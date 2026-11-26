"""Multi-dataset holdout evaluation & calibration (ECE) benchmark exporter."""

from __future__ import annotations

import csv
import json
from pathlib import Path

import numpy as np
import torch
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix, roc_auc_score
from torch.utils.data import DataLoader

from ml.datasets.harmonizer import CANONICAL_CLASSES, HarmonizedSample
from ml.models.ensemble import DavionTumorEnsemble
from ml.train import BrainMRIDataset


def expected_calibration_error(probs: np.ndarray, labels: np.ndarray, n_bins: int = 10) -> float:
    """Compute Expected Calibration Error (ECE) across confidence bins."""
    confidences = probs.max(axis=1)
    predictions = probs.argmax(axis=1)
    accuracies = (predictions == labels).astype(np.float32)

    bin_boundaries = np.linspace(0.0, 1.0, n_bins + 1)
    ece = 0.0
    for i in range(n_bins):
        mask = (confidences > bin_boundaries[i]) & (confidences <= bin_boundaries[i + 1])
        if np.any(mask):
            ece += (np.sum(mask) / len(labels)) * abs(float(accuracies[mask].mean()) - float(confidences[mask].mean()))
    return float(ece)


def load_manifest_split(manifest_csv: Path, split: str = "test") -> list[HarmonizedSample]:
    samples: list[HarmonizedSample] = []
    with manifest_csv.open("r", encoding="utf-8") as fh:
        for row in csv.DictReader(fh):
            if row["split"] == split:
                samples.append(
                    HarmonizedSample(
                        path=row["path"],
                        label=row["label"],
                        label_idx=int(row["label_idx"]),
                        dataset=row["dataset"],
                        patient_id=row["patient_id"],
                        split=row["split"],
                    )
                )
    return samples


def evaluate_checkpoint(checkpoint_path: Path, manifest_csv: Path, output_json: Path, image_size: int = 224) -> dict:
    """Evaluate a trained ensemble checkpoint on the patient-safe holdout test set."""
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    ckpt = torch.load(checkpoint_path, map_location=device)
    backbones = tuple(ckpt.get("backbones", ("convnext_small", "efficientnet_b4", "vit_base_patch16_224")))

    model = DavionTumorEnsemble(backbone_names=backbones, pretrained=False).to(device)
    model.load_state_dict(ckpt["state_dict"])
    model.eval()

    test_samples = load_manifest_split(manifest_csv, split="test")
    loader = DataLoader(BrainMRIDataset(test_samples, image_size=image_size), batch_size=32, shuffle=False)

    all_probs, all_labels, all_datasets = [], [], []
    with torch.no_grad():
        for x, y, ds in loader:
            pred = model.predict_with_uncertainty(x.to(device))
            all_probs.append(pred.probabilities.cpu().numpy())
            all_labels.append(y.numpy())
            all_datasets.extend(ds)

    probs = np.concatenate(all_probs, axis=0)
    labels = np.concatenate(all_labels, axis=0)
    preds = probs.argmax(axis=1)

    per_dataset = {}
    for ds_name in sorted(set(all_datasets)):
        idx = [i for i, d in enumerate(all_datasets) if d == ds_name]
        per_dataset[ds_name] = {
            "count": len(idx),
            "accuracy": round(float(accuracy_score(labels[idx], preds[idx])), 4),
        }

    metrics = {
        "cohort_size": int(len(labels)),
        "classes": list(CANONICAL_CLASSES),
        "overall_accuracy": round(float(accuracy_score(labels, preds)), 4),
        "macro_roc_auc": round(float(roc_auc_score(labels, probs, multi_class="ovr", average="macro")), 4),
        "ece": round(expected_calibration_error(probs, labels), 4),
        "confusion_matrix": confusion_matrix(labels, preds).tolist(),
        "classification_report": classification_report(labels, preds, target_names=list(CANONICAL_CLASSES), output_dict=True),
        "per_dataset": per_dataset,
    }
    output_json.parent.mkdir(parents=True, exist_ok=True)
    output_json.write_text(json.dumps(metrics, indent=2), encoding="utf-8")
    return metrics
