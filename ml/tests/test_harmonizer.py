"""Unit tests for multi-dataset harmonization and patient-level split isolation."""

from pathlib import Path

from ml.datasets.harmonizer import (
    assign_patient_level_splits,
    harmonize_datasets,
    normalize_label,
)


def test_normalize_label_variants() -> None:
    assert normalize_label("glioma_tumor") == "glioma"
    assert normalize_label("GBM") == "glioma"
    assert normalize_label("no_tumor") == "normal"
    assert normalize_label("notumor") == "normal"
    assert normalize_label("Pituitary Adenoma") == "pituitary"
    assert normalize_label("unknown_class") is None


def test_patient_level_split_zero_leakage(tmp_path: Path) -> None:
    # Create synthetic multi-dataset folders with multi-slice patients
    ds1 = tmp_path / "kaggle"
    ds2 = tmp_path / "figshare"
    for cls in ("glioma", "meningioma", "pituitary", "notumor"):
        (ds1 / cls).mkdir(parents=True)
        for p in range(1, 6):
            for s in range(1, 4):
                (ds1 / cls / f"PID-{p:03d}_slice{s}.png").write_bytes(b"fake")

    (ds2 / "glioma_tumor").mkdir(parents=True)
    for p in range(1, 5):
        (ds2 / "glioma_tumor" / f"TCGA-01-{p:04d}_1.jpg").write_bytes(b"fake")

    samples = harmonize_datasets({"kaggle": ds1, "figshare": ds2}, seed=123)
    assert len(samples) == (4 * 5 * 3) + 4

    splits_by_patient: dict[str, set[str]] = {}
    for item in samples:
        splits_by_patient.setdefault(item.patient_id, set()).add(item.split)

    # Every patient_id must appear in strictly one split
    assert all(len(sp) == 1 for sp in splits_by_patient.values())
    assert {"train", "val", "test"}.issubset({s.split for s in samples})
