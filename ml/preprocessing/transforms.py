"""Cross-scanner MRI preprocessing and augmentation transforms."""

from __future__ import annotations

import numpy as np
from PIL import Image


def zscore_intracranial_normalize(image: np.ndarray, eps: float = 1e-6) -> np.ndarray:
    """Normalize MRI slice intensity using foreground (non-zero) Z-score."""
    arr = image.astype(np.float32)
    mask = arr > np.percentile(arr, 5)
    if np.any(mask):
        mean = float(arr[mask].mean())
        std = float(arr[mask].std())
    else:
        mean = float(arr.mean())
        std = float(arr.std())
    std = max(std, eps)
    normed = (arr - mean) / std
    # Clip extreme outliers and rescale to [0, 1]
    normed = np.clip(normed, -3.0, 3.0)
    return (normed + 3.0) / 6.0


def load_and_preprocess_slice(image: Image.Image, target_size: int = 256) -> np.ndarray:
    """Convert PIL image to normalized (3, H, W) float32 tensor for backbone models."""
    gray = image.convert("L").resize((target_size, target_size), Image.Resampling.BILINEAR)
    arr = np.asarray(gray, dtype=np.float32)
    normed = zscore_intracranial_normalize(arr)
    # Replicate to 3 channels for ImageNet-pretrained backbones (ConvNeXt/EfficientNet/ViT)
    return np.stack([normed, normed, normed], axis=0)


def build_albumentations_pipeline(image_size: int = 256, is_train: bool = True):
    """Build Albumentations augmentation pipeline for cross-domain MRI robustness."""
    import albumentations as A
    from albumentations.pytorch import ToTensorV2

    if is_train:
        return A.Compose(
            [
                A.Resize(image_size, image_size),
                A.HorizontalFlip(p=0.5),
                A.ShiftScaleRotate(shift_limit=0.06, scale_limit=0.1, rotate_limit=15, p=0.6),
                A.RandomBrightnessContrast(brightness_limit=0.2, contrast_limit=0.2, p=0.5),
                A.GaussNoise(p=0.25),
                A.Normalize(mean=(0.485, 0.456, 0.406), std=(0.229, 0.224, 0.225)),
                ToTensorV2(),
            ]
        )
    return A.Compose(
        [
            A.Resize(image_size, image_size),
            A.Normalize(mean=(0.485, 0.456, 0.406), std=(0.229, 0.224, 0.225)),
            ToTensorV2(),
        ]
    )
