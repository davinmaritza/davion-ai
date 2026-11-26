"""Multi-backbone tumor classifier ensemble with uncertainty and temperature calibration."""

from __future__ import annotations

from dataclasses import dataclass

import torch
import torch.nn as nn
import torch.nn.functional as F


@dataclass
class EnsemblePrediction:
    """Calibrated multi-backbone prediction with inter-model uncertainty."""

    probabilities: torch.Tensor
    epistemic_variance: torch.Tensor
    entropy: torch.Tensor
    requires_radiologist_review: torch.Tensor


class DavionTumorEnsemble(nn.Module):
    """Soft-voting ensemble combining CNN and Vision Transformer backbones via timm."""

    def __init__(
        self,
        backbone_names: tuple[str, ...] = ("convnext_small", "efficientnet_b4", "vit_base_patch16_224"),
        num_classes: int = 4,
        pretrained: bool = True,
        dropout_rate: float = 0.25,
    ) -> None:
        super().__init__()
        import timm

        self.backbone_names = backbone_names
        self.num_classes = num_classes
        self.models = nn.ModuleList(
            [
                timm.create_model(
                    name,
                    pretrained=pretrained,
                    num_classes=num_classes,
                    drop_rate=dropout_rate,
                )
                for name in backbone_names
            ]
        )
        # Learnable temperature scalar for probability calibration (ECE reduction)
        self.temperature = nn.Parameter(torch.ones(1))

    def forward_logits(self, x: torch.Tensor) -> list[torch.Tensor]:
        """Return raw logits from each backbone."""
        temp = torch.clamp(self.temperature, min=0.25, max=5.0)
        return [model(x) / temp for model in self.models]

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        """Return mean calibrated logits across all backbones."""
        logits = torch.stack(self.forward_logits(x), dim=0)
        return logits.mean(dim=0)

    @torch.no_grad()
    def predict_with_uncertainty(
        self,
        x: torch.Tensor,
        confidence_threshold: float = 0.50,
        variance_threshold: float = 0.15,
    ) -> EnsemblePrediction:
        """Compute calibrated probabilities, inter-model variance, and review flag."""
        self.eval()
        logits_stack = torch.stack(self.forward_logits(x), dim=0)  # (M, B, C)
        probs_stack = F.softmax(logits_stack, dim=-1)
        mean_probs = probs_stack.mean(dim=0)  # (B, C)
        variance = probs_stack.var(dim=0).mean(dim=-1)  # (B,)
        entropy = -(mean_probs * torch.log(torch.clamp(mean_probs, min=1e-7))).sum(dim=-1)
        max_conf = mean_probs.max(dim=-1).values
        requires_review = (max_conf < confidence_threshold) | (variance > variance_threshold)
        return EnsemblePrediction(
            probabilities=mean_probs,
            epistemic_variance=variance,
            entropy=entropy,
            requires_radiologist_review=requires_review,
        )
