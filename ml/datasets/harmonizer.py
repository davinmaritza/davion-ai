"""Multi-dataset brain MRI harmonizer with patient-level split guarantees."""

from __future__ import annotations

import csv
import hashlib
import random
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

CANONICAL_CLASSES = ("glioma", "meningioma", "pituitary", "normal")
CLASS_TO_INDEX = {name: idx for idx, name in enumerate(CANONICAL_CLASSES)}

LABEL_ALIASES: dict[str, str] = {
    "glioma": "glioma",
    "glioma_tumor": "glioma",
    "lgg": "glioma",
    "gbm": "glioma",
    "astrocytoma": "glioma",
    "oligodendroglioma": "glioma",
    "glioblastoma": "glioma",
    "meningioma": "meningioma",
    "meningioma_tumor": "meningioma",
    "pituitary": "pituitary",
    "pituitary_tumor": "pituitary",
    "pituitary_adenoma": "pituitary",
    "normal": "normal",
    "no_tumor": "normal",
    "notumor": "normal",
    "healthy": "normal",
    "negative": "normal",
}

IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg", ".bmp", ".tif", ".tiff", ".dcm", ".nii", ".gz"}


@dataclass(frozen=True)
class HarmonizedSample:
    """Single harmonized brain MRI sample."""

    path: str
    label: str
    label_idx: int
    dataset: str
    patient_id: str
    split: str = "unassigned"


def normalize_label(raw_label: str) -> str | None:
    """Map heterogeneous dataset folder/CSV labels to the 4 canonical classes."""
    key = re.sub(r"[\s\-]+", "_", raw_label.strip().lower())
    return LABEL_ALIASES.get(key)


def infer_patient_id(path: Path, dataset: str) -> str:
    """Extract a deterministic patient/subject identifier from filename or parent folder."""
    stem = path.stem.replace(".nii", "")
    # Common patterns: TCGA-02-0001_slice12, BraTS2021_00001_flair_80, Tr-gl_0012
    match = re.match(r"^([A-Za-z]+[-_]\d+[-_]\d+|BraTS\d+_\d+|PID[-_]?\d+|sub[-_]\d+)", stem, re.I)
    if match:
        return f"{dataset}:{match.group(1).lower()}"
    # Fallback: hash stem without trailing slice index so adjacent slices group together
    base = re.sub(r"[_-]?(slice|sl|z)?\d+$", "", stem, flags=re.I) or stem
    digest = hashlib.sha1(f"{dataset}:{base}".encode("utf-8")).hexdigest()[:12]
    return f"{dataset}:{digest}"


def scan_classification_directory(root: Path, dataset_name: str) -> list[HarmonizedSample]:
    """Scan a directory tree where immediate or nested folders represent class names."""
    if not root.exists():
        return []

    samples: list[HarmonizedSample] = []
    for file_path in sorted(root.rglob("*")):
        if not file_path.is_file():
            continue
        if file_path.suffix.lower() not in IMAGE_EXTENSIONS:
            continue
        if file_path.name.lower().endswith(".nii.gz"):
            pass
        elif file_path.suffix.lower() == ".gz":
            continue

        # Walk up parents until root to find a recognizable class folder
        canonical = None
        for parent in file_path.relative_to(root).parents:
            if parent.name:
                canonical = normalize_label(parent.name)
                if canonical is not None:
                    break

        if canonical is None:
            continue

        samples.append(
            HarmonizedSample(
                path=str(file_path.resolve()),
                label=canonical,
                label_idx=CLASS_TO_INDEX[canonical],
                dataset=dataset_name,
                patient_id=infer_patient_id(file_path, dataset_name),
            )
        )
    return samples


def assign_patient_level_splits(
    samples: Iterable[HarmonizedSample],
    train_ratio: float = 0.75,
    val_ratio: float = 0.15,
    seed: int = 42,
) -> list[HarmonizedSample]:
    """Split samples into train/val/test without leaking any patient_id across splits."""
    if not (0.0 < train_ratio < 1.0 and 0.0 <= val_ratio < 1.0 and train_ratio + val_ratio < 1.0):
        raise ValueError("Invalid split ratios; train + val must be < 1.0")

    grouped: dict[str, list[HarmonizedSample]] = {}
    for sample in samples:
        grouped.setdefault(sample.patient_id, []).append(sample)

    # Group patients by their primary class so each patient_id belongs to strictly one split
    by_class: dict[str, list[list[HarmonizedSample]]] = {c: [] for c in CANONICAL_CLASSES}
    for _pid, group in sorted(grouped.items()):
        primary_label = group[0].label
        by_class[primary_label].append(group)

    rng = random.Random(seed)
    assigned: list[HarmonizedSample] = []

    for label in CANONICAL_CLASSES:
        patient_groups = by_class[label]
        rng.shuffle(patient_groups)
        n = len(patient_groups)
        if n == 0:
            continue

        n_train = max(1, int(round(n * train_ratio)))
        n_val = int(round(n * val_ratio))
        if n >= 3 and n_train + n_val >= n:
            n_train = max(1, n - 2)
            n_val = 1

        for idx, group in enumerate(patient_groups):
            if idx < n_train:
                split = "train"
            elif idx < n_train + n_val:
                split = "val"
            else:
                split = "test"
            for item in group:
                assigned.append(
                    HarmonizedSample(
                        path=item.path,
                        label=item.label,
                        label_idx=item.label_idx,
                        dataset=item.dataset,
                        patient_id=item.patient_id,
                        split=split,
                    )
                )

    return assigned


def harmonize_datasets(dataset_roots: dict[str, Path], seed: int = 42) -> list[HarmonizedSample]:
    """Load and harmonize multiple global brain MRI datasets into one patient-safe manifest."""
    all_samples: list[HarmonizedSample] = []
    for dataset_name, root in dataset_roots.items():
        all_samples.extend(scan_classification_directory(root, dataset_name))
    return assign_patient_level_splits(all_samples, seed=seed)


def export_manifest_csv(samples: Iterable[HarmonizedSample], output_csv: Path) -> None:
    """Write harmonized dataset manifest to CSV."""
    output_csv.parent.mkdir(parents=True, exist_ok=True)
    with output_csv.open("w", newline="", encoding="utf-8") as fh:
        writer = csv.writer(fh)
        writer.writerow(["path", "label", "label_idx", "dataset", "patient_id", "split"])
        for s in samples:
            writer.writerow([s.path, s.label, s.label_idx, s.dataset, s.patient_id, s.split])
