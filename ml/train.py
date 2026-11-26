"""Multi-dataset PyTorch training entrypoint (local CUDA GPU or Colab/Kaggle)."""

from __future__ import annotations

import argparse
import hashlib
import json
from collections import Counter
from pathlib import Path

import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F
from PIL import Image
from torch.utils.data import DataLoader, Dataset, WeightedRandomSampler

from ml.datasets.harmonizer import CANONICAL_CLASSES, HarmonizedSample, export_manifest_csv, harmonize_datasets
from ml.models.ensemble import DavionTumorEnsemble
from ml.preprocessing.transforms import load_and_preprocess_slice


class FocalLoss(nn.Module):
    """Multi-class Focal Loss with probability clamping for numerical stability."""

    def __init__(self, gamma: float = 2.0, eps: float = 1e-7) -> None:
        super().__init__()
        self.gamma = gamma
        self.eps = eps

    def forward(self, logits: torch.Tensor, targets: torch.Tensor) -> torch.Tensor:
        probs = F.softmax(logits, dim=-1)
        probs = torch.clamp(probs, min=self.eps, max=1.0 - self.eps)
        pt = probs.gather(1, targets.unsqueeze(1)).squeeze(1)
        loss = -((1.0 - pt) ** self.gamma) * torch.log(pt)
        return loss.mean()


class BrainMRIDataset(Dataset):
    """Dataset reading harmonized MRI images into normalized tensors."""

    def __init__(self, samples: list[HarmonizedSample], image_size: int = 224) -> None:
        self.samples = samples
        self.image_size = image_size

    def __len__(self) -> int:
        return len(self.samples)

    def __getitem__(self, idx: int) -> tuple[torch.Tensor, int, str]:
        sample = self.samples[idx]
        with Image.open(sample.path) as img:
            tensor_np = load_and_preprocess_slice(img, target_size=self.image_size)
        return torch.from_numpy(tensor_np), sample.label_idx, sample.dataset


def build_weighted_sampler(samples: list[HarmonizedSample]) -> WeightedRandomSampler:
    """Balance minority tumor classes across multi-dataset batches."""
    counts = Counter(s.label_idx for s in samples)
    weights = [1.0 / counts[s.label_idx] for s in samples]
    return WeightedRandomSampler(weights=weights, num_samples=len(samples), replacement=True)


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as fh:
        for chunk in iter(lambda: fh.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def train(args: argparse.Namespace) -> None:
    dataset_roots = {}
    for pair in args.datasets:
        name, path_str = pair.split("=", 1)
        dataset_roots[name.strip()] = Path(path_str.strip())

    samples = harmonize_datasets(dataset_roots, seed=args.seed)
    if not samples:
        raise RuntimeError("No valid MRI samples found across the provided dataset directories.")

    out_dir = Path(args.output_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    export_manifest_csv(samples, out_dir / "manifest.csv")

    train_samples = [s for s in samples if s.split == "train"]
    val_samples = [s for s in samples if s.split == "val"]

    train_ds = BrainMRIDataset(train_samples, image_size=args.image_size)
    val_ds = BrainMRIDataset(val_samples, image_size=args.image_size)

    train_loader = DataLoader(
        train_ds,
        batch_size=args.batch_size,
        sampler=build_weighted_sampler(train_samples),
        num_workers=args.num_workers,
        pin_memory=torch.cuda.is_available(),
    )
    val_loader = DataLoader(val_ds, batch_size=args.batch_size, shuffle=False, num_workers=args.num_workers)

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = DavionTumorEnsemble(backbone_names=tuple(args.backbones), pretrained=not args.no_pretrained).to(device)
    criterion = FocalLoss(gamma=2.0)
    optimizer = torch.optim.AdamW(model.parameters(), lr=args.lr, weight_decay=1e-4)
    scaler = torch.amp.GradScaler("cuda", enabled=torch.cuda.is_available())

    best_val_acc = -1.0
    ckpt_path = out_dir / "davion_ensemble_best.pt"

    for epoch in range(1, args.epochs + 1):
        model.train()
        optimizer.zero_grad()
        total_loss = 0.0

        for step, (x, y, _) in enumerate(train_loader):
            x, y = x.to(device), y.to(device)
            with torch.amp.autocast("cuda", enabled=torch.cuda.is_available()):
                logits = model(x)
                loss = criterion(logits, y) / args.grad_accum
            scaler.scale(loss).backward()
            if (step + 1) % args.grad_accum == 0 or (step + 1) == len(train_loader):
                scaler.unscale_(optimizer)
                nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
                scaler.step(optimizer)
                scaler.update()
                optimizer.zero_grad()
            total_loss += float(loss.item()) * args.grad_accum

        model.eval()
        correct = 0
        total = 0
        with torch.no_grad():
            for x, y, _ in val_loader:
                x, y = x.to(device), y.to(device)
                preds = model(x).argmax(dim=-1)
                correct += int((preds == y).sum().item())
                total += len(y)

        val_acc = correct / max(total, 1)
        print(f"Epoch {epoch}/{args.epochs} | train_loss={total_loss/max(len(train_loader),1):.4f} | val_acc={val_acc:.4f}")
        if val_acc >= best_val_acc:
            best_val_acc = val_acc
            torch.save({"state_dict": model.state_dict(), "backbones": args.backbones, "classes": CANONICAL_CLASSES}, ckpt_path)

    manifest = {"checkpoint": str(ckpt_path), "sha256": sha256_file(ckpt_path), "best_val_acc": best_val_acc}
    (out_dir / "checkpoint_manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Train Davion AI multi-dataset brain tumor ensemble.")
    p.add_argument("--datasets", nargs="+", required=True, help="Pairs like figshare=/data/figshare kaggle=/data/kaggle")
    p.add_argument("--output-dir", default="artifacts/checkpoints")
    p.add_argument("--backbones", nargs="+", default=["convnext_small", "efficientnet_b4", "vit_base_patch16_224"])
    p.add_argument("--epochs", type=int, default=20)
    p.add_argument("--batch-size", type=int, default=16)
    p.add_argument("--grad-accum", type=int, default=2)
    p.add_argument("--image-size", type=int, default=224)
    p.add_argument("--lr", type=float, default=1e-4)
    p.add_argument("--num-workers", type=int, default=2)
    p.add_argument("--seed", type=int, default=42)
    p.add_argument("--no-pretrained", action="store_true")
    return p.parse_args()


if __name__ == "__main__":
    train(parse_args())
