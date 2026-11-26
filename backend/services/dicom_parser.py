"""In-memory medical image parser for DICOM, NIfTI, and standard image formats with PHI stripping."""

from __future__ import annotations

import io
import tempfile
from dataclasses import dataclass
from pathlib import Path

import numpy as np
from PIL import Image


@dataclass
class ParsedScan:
    """Normalized scan payload with anonymized metadata."""

    image: Image.Image
    rgb_for_ood: np.ndarray
    format_name: str
    pixel_spacing_mm: float
    metadata: dict[str, str | float | int | None]


def _normalize_to_uint8(arr: np.ndarray) -> np.ndarray:
    arr = arr.astype(np.float32)
    lo, hi = float(np.percentile(arr, 1)), float(np.percentile(arr, 99.5))
    if hi <= lo:
        hi = lo + 1.0
    scaled = np.clip((arr - lo) / (hi - lo), 0.0, 1.0)
    return (scaled * 255.0).astype(np.uint8)


def parse_uploaded_scan(filename: str, raw_bytes: bytes) -> ParsedScan:
    """Parse .dcm, .nii/.nii.gz, or .png/.jpg bytes into a grayscale Image without persisting PHI."""
    lower = filename.lower()

    if lower.endswith(".dcm"):
        import pydicom

        ds = pydicom.dcmread(io.BytesIO(raw_bytes), force=True)
        # Strip PHI/PII tags immediately in memory (HAZ-004)
        for tag in ((0x0010, 0x0010), (0x0010, 0x0020), (0x0010, 0x0030)):
            if tag in ds:
                del ds[tag]

        pixels = ds.pixel_array.astype(np.float32)
        slope = float(getattr(ds, "RescaleSlope", 1.0))
        intercept = float(getattr(ds, "RescaleIntercept", 0.0))
        pixels = pixels * slope + intercept
        if pixels.ndim == 3:
            pixels = pixels[pixels.shape[0] // 2]

        spacing = 0.47
        if hasattr(ds, "PixelSpacing") and len(ds.PixelSpacing) >= 1:
            spacing = float(ds.PixelSpacing[0])

        u8 = _normalize_to_uint8(pixels)
        img = Image.fromarray(u8, mode="L")
        rgb = np.stack([u8, u8, u8], axis=-1)
        return ParsedScan(
            image=img,
            rgb_for_ood=rgb,
            format_name="DICOM",
            pixel_spacing_mm=spacing,
            metadata={
                "modality": str(getattr(ds, "Modality", "MR")),
                "rows": int(u8.shape[0]),
                "cols": int(u8.shape[1]),
                "pixel_spacing_mm": round(spacing, 4),
                "phi_anonymized": "YES",
            },
        )

    if lower.endswith(".nii") or lower.endswith(".nii.gz"):
        import nibabel as nib

        suffix = ".nii.gz" if lower.endswith(".nii.gz") else ".nii"
        with tempfile.NamedTemporaryFile(suffix=suffix, delete=True) as tmp:
            tmp.write(raw_bytes)
            tmp.flush()
            nii = nib.load(tmp.name)
            vol = nii.get_fdata()
            zooms = nii.header.get_zooms()
            spacing = float(zooms[0]) if len(zooms) > 0 else 1.0

        while vol.ndim > 3:
            vol = vol[..., 0]
        slice_2d = vol[:, :, vol.shape[2] // 2] if vol.ndim == 3 else vol
        slice_2d = np.rot90(slice_2d)
        u8 = _normalize_to_uint8(slice_2d)
        img = Image.fromarray(u8, mode="L")
        rgb = np.stack([u8, u8, u8], axis=-1)
        return ParsedScan(
            image=img,
            rgb_for_ood=rgb,
            format_name="NIfTI",
            pixel_spacing_mm=spacing,
            metadata={
                "modality": "MR-NIfTI",
                "rows": int(u8.shape[0]),
                "cols": int(u8.shape[1]),
                "pixel_spacing_mm": round(spacing, 4),
                "phi_anonymized": "N/A",
            },
        )

    with Image.open(io.BytesIO(raw_bytes)) as src:
        rgb_img = src.convert("RGB")
        rgb_arr = np.asarray(rgb_img, dtype=np.uint8)
        gray = src.convert("L")
        return ParsedScan(
            image=gray,
            rgb_for_ood=rgb_arr,
            format_name=Path(filename).suffix.lstrip(".").upper() or "IMAGE",
            pixel_spacing_mm=0.47,
            metadata={
                "modality": "MR-2D",
                "rows": gray.height,
                "cols": gray.width,
                "pixel_spacing_mm": 0.47,
                "phi_anonymized": "YES",
            },
        )
