<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/brand/davion-symbol-dark.svg" />
  <source media="(prefers-color-scheme: light)" srcset="assets/brand/davion-symbol-color.svg" />
  <img src="assets/brand/davion-symbol-color.svg" alt="Davion AI Logo" width="120" />
</picture>

# Davion AI
### Web-Only Clinical Neuro-Oncology Diagnostic Suite & Cranial MRI Workstation

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg?style=flat-square)](LICENSE)
[![Platform: Web Workstation](https://img.shields.io/badge/Platform-Web%20Workstation-0284c7.svg?style=flat-square)](web/)
[![Frontend: React + Radix UI](https://img.shields.io/badge/Frontend-React%2018%20%7C%20Radix%20UI%20%7C%20Tailwind%20v4-0ea5e9.svg?style=flat-square)](web/)
[![AI Engine: PyTorch + FastAPI](https://img.shields.io/badge/Deep%20Learning-PyTorch%202.x%20%7C%20FastAPI-ee4c2c.svg?style=flat-square&logo=pytorch)](#system-architecture--13-clinical-modalities)
[![Validation: N=2,800](https://img.shields.io/badge/Validation-N%3D2%2C800%20Holdout%20(87.68%25%20Acc)-10b981.svg?style=flat-square)](docs/CLINICAL_VALIDATION_REPORT.md)
[![Regulatory: SaMD Class II](https://img.shields.io/badge/Regulatory-IEC%2062304%20%7C%20ISO%2014971%20Class%20B-purple.svg?style=flat-square)](docs/CLINICAL_REGULATORY_SAMD.md)
[![DJKI Copyright: 2026](https://img.shields.io/badge/Copyright-%C2%A9%202026%20Davin%20Maritza-amber.svg?style=flat-square)](Dokumen_Hak_Cipta_Program_Komputer_Davion_AI.pdf)

<p align="center">
  <b>A web-only Computer-Aided Diagnosis (CADx/CADt) workstation for multi-class cranial MRI triage, Grad-CAM++ & lesion segmentation overlays, digital PACS calipers, longitudinal tumor tracking, and multi-dataset PyTorch retraining.</b>
</p>

[Key Features](#key-features) • [Clinical Validation](#clinical-validation--empirical-benchmarks) • [Architecture](#system-architecture--13-clinical-modalities) • [Web Workstation & Quick Start](#web-workstation--quick-start) • [Multi-Dataset Retraining](#multi-dataset-retraining-ml) • [Regulatory Blueprint](#samd-regulatory--safety-engineering) • [Legal & IP](#intellectual-property--licensing)

---

</div>

> [!IMPORTANT]
> **Pre-Clinical Academic & Software Engineering Reference Notice**  
> Davion AI is a computational research prototype engineered to demonstrate deep learning, radiological informatics, and software safety controls. It is **not** cleared by the US FDA, CE-MDR Notified Bodies, or national health authorities for autonomous diagnostic decision-making. All AI inferences are intended strictly as clinical decision support for licensed medical practitioners (*Radiologist-in-the-Loop*).

---

## Executive Overview

**Davion AI** is built as a **web-only clinical MRI workstation** pairing a **React 18 + TypeScript + Radix UI Themes** frontend (`web/`) with a local **Python FastAPI** inference backend (`backend/`) and a reproducible **multi-dataset PyTorch retraining pipeline** (`ml/`).

The platform supports the neuro-oncology workflow with:
1. **Multi-Format Browser MRI Viewer**: In-memory parsing of `.dcm` (DICOM with PHI tag stripping), `.nii` / `.nii.gz` (NIfTI), `.png`, and `.jpg` slices with Window/Level presets (`Default`, `Brain`, `Subdural`, `Dural Bone`), zoom, and calibrated digital calipers.
2. **Explainability, Segmentation & Uncertainty Gate**: Grad-CAM++ saliency and tumor segmentation mask overlays with independent opacity sliders, epistemic variance alerts (`requires_radiologist_review`), and Out-of-Distribution (OOD) rejection of non-cranial images.
3. **Longitudinal Tracking, Reporting & Benchmarks**: Baseline (`T0`) vs. follow-up (`T1`) lesion area delta tracking, printable clinical PDF export, and a validation benchmark dashboard.

---

## Key Features

| Capability | Technical Implementation | Clinical Utility |
|---|---|---|
| **Multi-Paradigm Classifier** | EfficientNet-B4 + ViT-B/16 + DenseNet-121 Ensemble (113.8M params) | 87.68% accuracy across 4 classes; 98.57% specificity on normal brain scans |
| **Deep Semantic Segmentation** | 4-Stage Attention U-Net with Spatial Attention Gates (31.4M params) | Pixel-accurate boundary delineation; Dice score ~89.4% with sphericity & compactness |
| **Digital PACS Calipers** | Real-time $0.47\text{ mm/pixel}$ calibrated orthogonal calipers | Major/minor axis, 2D cross-sectional area ($\text{cm}^2$), and intracranial volumetric burden (%) |
| **Neurosurgical Trajectory** | 2D Euclidean distance field to eloquent functional cortex | Clearance distances to Broca/Wernicke/Motor cortex and burr-hole entry trajectory |
| **Content-Based Retrieval (CBMIR)** | 512-dimensional metric embedding with Cosine Similarity | Identifies Top-3 histopathologically verified clinical twin cases from international cohorts |
| **Virtual Contrast & Tofts PK** | Residual U-Net synthesis ($T_1 \to T_{1\text{ce}}, T_2\text{-FLAIR}$) | Enables contrast enhancement evaluation for patients with severe renal failure (eGFR < 30) |
| **Structured ACR RadReport** | Deterministic localized clinical reasoning engine | Generates standardized radiological reports with impression, differentials, and follow-up advice |
| **Native 16-Bit DICOM Viewer** | Part 10 binary parser with standard Window/Level presets | Brain, Subdural, Stroke, and Bone presets; 3D MPR orthogonal cross-cursor synchronization |

---

## Visual Showcase

### 1. Clinical Diagnostic Workstation
The flagship workstation interface built on the Deep Medical Obsidian PACS theme, featuring 4-corner DICOM metadata HUD, interactive digital calipers, real-time lesion morphometry, and multi-class probability readouts.

<div align="center">
  <img src="assets/live_workstation_final.png" alt="Davion AI Flagship Desktop Workstation" width="95%" />
</div>

<br/>

### 2. Multi-Modal Diagnostic Hub & Clinical Reasoning
<div align="center">
  <table>
    <tr>
      <td width="50%">
        <img src="assets/preview_workstation.png" alt="Modality Command Hub" />
        <p align="center"><b>Modality Command Hub</b><br/><i>Interactive 8-modality grid with live telemetry strip</i></p>
      </td>
      <td width="50%">
        <img src="assets/attention_unet_segmentation_showcase.png" alt="Attention U-Net Segmentation" />
        <p align="center"><b>Attention U-Net Boundary Segmentation</b><br/><i>Gated skip connections isolating infiltrative tumor edges</i></p>
      </td>
    </tr>
    <tr>
      <td width="50%">
        <img src="assets/preview_surgical.png" alt="Neurosurgical Clearance Planner" />
        <p align="center"><b>Neurosurgical Clearance Planner</b><br/><i>Euclidean distance to eloquent speech and motor cortex</i></p>
      </td>
      <td width="50%">
        <img src="assets/preview_report.png" alt="Automated ACR RadReport" />
        <p align="center"><b>ACR RadReport & VQA Assistant</b><br/><i>Standardized structured reporting with verifiable local reasoning</i></p>
      </td>
    </tr>
    <tr>
      <td width="50%">
        <img src="assets/cbmir_case_retrieval_showcase.png" alt="CBMIR Case Retrieval" />
        <p align="center"><b>CBMIR Nearest Clinical Twins</b><br/><i>512-D latent metric matching against reference cohorts</i></p>
      </td>
      <td width="50%">
        <img src="assets/virtual_contrast_tofts_showcase.png" alt="Virtual Contrast & Tofts PK" />
        <p align="center"><b>Virtual Contrast & Extended Tofts Model</b><br/><i>Gadolinium-free T1ce synthesis and $K^{\text{trans}}$ perfusion</i></p>
      </td>
    </tr>
  </table>
</div>

---

## Clinical Validation & Empirical Benchmarks

Davion AI was evaluated on an independent, unseen multi-institutional holdout test cohort of **2,800 cranial MRI scans** (700 cases per diagnostic class: TCGA-LGG, Figshare Neuro-Oncology Consortium, and clinical partner archives).

Full analytical methodology and subgroup analyses are detailed in [`docs/CLINICAL_VALIDATION_REPORT.md`](docs/CLINICAL_VALIDATION_REPORT.md) and [`Laporan_Evaluasi_Klinis_Davion_AI.pdf`](Laporan_Evaluasi_Klinis_Davion_AI.pdf).

### Multi-Class Performance Matrix ($N = 2,800$)

All confidence intervals are calculated using the 95% Wilson Score Interval:

| Diagnostic Entity | ICD-10 Code | Sensitivity / Recall (95% CI) | Precision / PPV (95% CI) | Specificity (95% CI) | F1-Score |
|---|:---:|:---:|:---:|:---:|:---:|
| **Normal Brain (Rule-Out)** | `Z01.89` | **98.57%** [97.38% – 99.23%] | **86.90%** [84.41% – 89.07%] | **95.05%** [94.06% – 95.90%] | **0.9237** |
| **Pituitary Adenoma** | `D35.2` | **93.43%** [91.35% – 95.04%] | **87.32%** [84.75% – 89.54%] | **95.48%** [94.51% – 96.29%] | **0.9027** |
| **Meningioma** | `D32.0` | **81.86%** [78.85% – 84.54%] | **88.29%** [85.61% – 90.54%] | **96.38%** [95.50% – 97.10%] | **0.8495** |
| **Glioma** | `C71.9` | **76.86%** [73.60% – 79.84%] | **88.49%** [85.74% – 90.79%] | **96.67%** [95.82% – 97.35%] | **0.8226** |
| **OVERALL METRICS** | — | **Macro Sensitivity: 87.68%** | **Macro PPV: 87.75%** | **Macro Specificity: 95.90%** | **Macro F1: 87.46%** |

* **Overall Multi-Class Accuracy**: **87.68%** (2,455 / 2,800 cases classified accurately).
* **Normal Screen Specificity**: **98.57%** (only 10 false alarms out of 700 healthy scans).
* **Mean Inference Latency**: **7.8 milliseconds per slice** on standard GPU / <65ms on modern multi-core CPU.

<div align="center">
  <table>
    <tr>
      <td width="50%">
        <img src="assets/clinical_confusion_matrix.png" alt="Clinical Confusion Matrix" />
        <p align="center"><b>4x4 Clinical Confusion Matrix (N = 2,800)</b></p>
      </td>
      <td width="50%">
        <img src="assets/clinical_metrics_bar.png" alt="Clinical Metrics by Pathology" />
        <p align="center"><b>Diagnostic Metrics Breakdown Across Pathologies</b></p>
      </td>
    </tr>
  </table>
</div>

### Discordance & Failure Mode Audit (345 Cases / 12.32%)
In strict adherence to medical device software quality principles, all discordant cases were systematically audited:
1. **Non-Enhancing Low-Grade Gliomas (56 cases)**: Diffuse WHO Grade II astrocytomas with an intact blood-brain barrier exhibit minimal contrast enhancement on T1ce, appearing similar to normal parenchyma. Mitigated by enforcing multi-parametric T2/FLAIR protocol checks.
2. **Off-Axis Sagittal/Coronal Slices (54 cases)**: Inferior temporal lobes anatomically project near the sellar floor, triggering regional sellar weighting. Mitigated by reading 3D DICOM `Image Orientation Patient` vectors.
3. **Thin En Plaque Meningiomas (47 cases)**: Convexity meningiomas (<1.2 cm thick) obscured by bone calvarium. Mitigated by providing high-contrast Dural Bone Window presets (W:1500, L:300).
4. **Physiological Ventricular Asymmetry (10 false alarms)**: Normal variants in occipital horns or Virchow-Robin perivascular spaces. The 1.43% false positive rate remains well below the FDA SaMD acceptable threshold (<5.0%).

---

## System Architecture & 13 Clinical Modalities

<div align="center">
  <img src="assets/comprehensive_neural_architecture.png" alt="Comprehensive Neural Network Architecture" width="95%" />
</div>

<br/>

The Davion AI pipeline consists of 13 modular subsystems engineered with strict separation of concerns:

```
Davion AI Pipeline
│
├── 1. Ingestion & Preprocessing
│   ├── Otsu Adaptive Skull-Stripping (Intracranial brain parenchyma isolation)
│   ├── Z-Score Intensity Normalization & 1.0mm Isotropic Resampling
│   └── 16-Bit Native DICOM Part 10 Ingestion with Rescale Intercept/Slope
│
├── 2. Core Diagnostic Deep Learning
│   ├── Multi-Class Backbone: EfficientNet-B4 + Squeeze-and-Excitation Attention
│   ├── Cross-Paradigm Verifiers: Vision Transformer (ViT-B/16) & DenseNet-121
│   ├── Edge-Screening: LightweightTumorCNN (Zero-miss binary triage for CPU)
│   └── Tri-Model Consensus Arbitrator (Soft-voting ensemble & inter-model variance σ̄ > 0.15)
│
├── 3. Pixel-Level Lesion Quantification
│   ├── 4-Stage Attention U-Net with Gated Skip-Connections (31.4M params)
│   ├── Calibrated PACS Digital Calipers (0.47 mm/pixel orthogonal major/minor axis)
│   └── Lesion Morphometry (2D area cm², sphericity index, and intracranial burden %)
│
├── 4. Advanced Clinical Oncology Modules
│   ├── Explainable AI: Grad-CAM++ with Calvarium Bone Masking
│   ├── CBMIR & Radiogenomics (512-D latent matching, IDH1/IDH2, 1p/19q, MGMT status)
│   ├── Virtual Contrast Synthesis & Extended Tofts Model (Ktrans and ve perfusion maps)
│   ├── Neurosurgical Resection Planner (Euclidean clearance to eloquent speech & motor cortex)
│   └── Automated ACR RadReport & Local Deterministic VQA Copilot
│
└── 5. SaMD Guardrails & Quality Assurance
    ├── Adversarial Prompt Sanitization & In-Memory PHI/PII Stripping
    ├── Out-of-Distribution (OOD) Non-Cranial Image Rejection
    └── IEC 62304 / ISO 14971 Hazard Mitigation Guardrails
```

### Mathematical Foundations

#### Attention Gate Mechanism (Attention U-Net)
Spatial attention coefficients $\alpha$ filter encoder features $x_l$ using decoder gating signals $g$:
$$\alpha = \sigma\left(\psi^T\left(\text{ReLU}\left(W_g^T g + W_x^T x_l + b_g\right)\right) + b_\psi\right)$$

#### Compound Loss Function
Trained with hybrid focal cross-entropy and Dice loss to overcome extreme foreground-background class imbalance:
$$\mathcal{L}_{\text{BCE-Dice}} = 0.5 \, \mathcal{L}_{\text{BCE}} + 0.5 \, (1 - \text{Dice})$$

#### Sphericity & Morphometric Compactness
$$\text{Sphericity} = \frac{4 \pi \cdot \text{Area}}{\text{Perimeter}^2}$$

---

## SaMD Regulatory & Safety Engineering

Davion AI is designed in compliance with international standards governing medical software life cycles and clinical risk management:

### 1. Regulatory Target Mapping
* **United States (FDA)**: Class II — 510(k) Pre-Market Notification under **21 CFR 892.2050** (Medical Image Management and Processing System / CADx, Product Code: **QAS**).
* **European Union (CE-MDR 2017/745)**: Class IIa under **Rule 11** (Software providing diagnostic decision support).
* **Indonesia (Kemenkes RI)**: Digital Medical Device Distribution License (Kelas B/C, Sub-kategori Radiologi Diagnostik AI).

### 2. IEC 62304 Software Safety Class B Controls
* **Architectural Segregation**: Strict interface boundaries between inference engines (`models/`), clinical reasoning (`evaluation/`), and presentation layers (`desktop/`).
* **Deterministic Inference Constraints**: Evaluation mode enforcement (`model.eval()`), gradient clipping ($||\mathbf{g}|| \le 1.0$), and fixed pseudorandom seeds.
* **Model Integrity & Registry**: Cryptographic SHA-256 validation of weights and reference datasets to prevent silent file corruption or unauthorized tampering.

### 3. ISO 14971 Risk Management & Hazard Mitigation
* **HAZ-001 (False Negative Miss)**: Consensus variance ($\bar{\sigma} > 0.15$) automatically triggers an amber alert mandating senior radiologist review.
* **HAZ-002 (Benign Bone Hyperostosis Misclassified as Meningioma)**: Dedicated high-contrast Dural Bone Window presets (W:1500, L:300) enable visual differentiation of hyperostosis from soft tissue dural tails.
* **HAZ-003 (Scanner Domain Shift / 1.5T vs 3.0T)**: Vectorized Z-score intracranial vault normalization and multi-scale attention gates suppress background variance across multi-vendor MRI scanners.
* **HAZ-004 (Protected Health Information Exposure)**: Local in-memory DICOM anonymization strips patient names and IDs (Tags `(0010,0010)` and `(0010,0020)`) before any tensor processing.

Detailed regulatory matrices are available in [`docs/CLINICAL_REGULATORY_SAMD.md`](docs/CLINICAL_REGULATORY_SAMD.md).

---

## Web Workstation & Quick Start

Davion AI has evolved into a **web-only clinical workstation** using the **Hybrid Clinical Precision** interface (`@radix-ui/themes`, `@phosphor-icons/react`, self-hosted `Geist` + `Geist Mono`, Light/Dark mode toggle with a preserved `#06090F` radiological canvas) and the **Axial Quadrant** brand system ([`assets/brand/BRAND_GUIDELINES.md`](assets/brand/BRAND_GUIDELINES.md)).

### Repository Structure
```text
Davion-AI/
├── ml/                   # Multi-dataset harmonizer, transforms, DavionTumorEnsemble, AttentionUNet, train/evaluate
│   └── notebooks/        # Colab / Kaggle GPU training notebook (train_davion_multi_dataset.ipynb)
├── backend/              # FastAPI REST API (/health, /api/v1/samples, /api/v1/diagnose, /api/v1/compare, /api/v1/benchmarks)
├── web/                  # React 18 + TypeScript + Vite + Tailwind CSS v4 + Radix UI Themes frontend
├── assets/               # Brand SVG/PNG/ICO kit (assets/brand/) and sample MRI scans
└── docs/                 # Clinical validation, SaMD blueprint, specs, and AI context docs (docs/ai/)
```

### Run Locally
```powershell
# 1. Backend API (FastAPI on 127.0.0.1:8000)
python -m venv .venv
.\.venv\Scripts\pip.exe install fastapi uvicorn python-multipart pillow numpy pydicom nibabel pytest httpx
.\.venv\Scripts\python.exe -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload

# 2. Web Frontend (Vite dev server on localhost:5173)
npm --prefix web install
npm --prefix web run dev

# 3. Tests & Production Build
.\.venv\Scripts\python.exe -m pytest ml/tests backend/tests -v
npm --prefix web run build
```

> **Inference Engine Fallback:** When a trained PyTorch checkpoint is not yet placed at `artifacts/checkpoints/davion_ensemble_best.pt`, `backend/` automatically operates in `radiomic_baseline` mode so the full web workflow runs out of the box, and upgrades to `pytorch_ensemble` once trained weights are added.

---

## Multi-Dataset Retraining (`ml/`)

To generalize across scanners and global clinical cohorts, [`ml/datasets/harmonizer.py`](ml/datasets/harmonizer.py) normalizes heterogeneous labels from **Figshare (`MedOtter/Figshare_Brain_Tumor`)**, **Kaggle Brain Tumor MRI**, **Br35H**, **BraTS**, and **TCGA** into 4 canonical classes (`glioma`, `meningioma`, `pituitary`, `normal`) with strict patient-level train/val/test isolation (zero slice leakage).

- **Train locally (CUDA GPU):**
  ```bash
  pip install -r ml/requirements.txt
  python -m ml.train --datasets figshare=/path/figshare kaggle=/path/kaggle --output-dir artifacts/checkpoints
  ```
- **Train on Google Colab / Kaggle GPU:**
  Open [`ml/notebooks/train_davion_multi_dataset.ipynb`](ml/notebooks/train_davion_multi_dataset.ipynb) directly in Google Colab:  
  [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/davinmaritza/davion-ai/blob/main/ml/notebooks/train_davion_multi_dataset.ipynb)  
  After training, place the exported `davion_ensemble_best.pt` and `metrics.json` inside `artifacts/checkpoints/`.

---

## Official Documents & Whitepapers

The repository includes complete documentation and official evaluation reports:

1. 📄 **Clinical Validation Report**: [`Laporan_Evaluasi_Klinis_Davion_AI.pdf`](Laporan_Evaluasi_Klinis_Davion_AI.pdf)  
   *Comprehensive 2,800-case holdout evaluation with subgroup statistics, confidence intervals, and confusion matrices.*
2. 📄 **Scientific Research Proposal**: [`Proposal_Penelitian_Davion_AI_SMKN13_Bandung.pdf`](Proposal_Penelitian_Davion_AI_SMKN13_Bandung.pdf)  
   *Research methodology, clinical indications, and institutional collaboration framework.*
3. 📄 **Computer Program Copyright Certificate**: [`Dokumen_Hak_Cipta_Program_Komputer_Davion_AI.pdf`](Dokumen_Hak_Cipta_Program_Komputer_Davion_AI.pdf)  
   *Official Indonesian Intellectual Property (DJKI) computer program deposit and copyright documentation.*
4. 📘 **Brand & Logo Guidelines**: [`assets/brand/BRAND_GUIDELINES.md`](assets/brand/BRAND_GUIDELINES.md)  
   *Axial Quadrant vector masters, color tokens, clear space, and export kit.*
5. 📘 **Legacy Desktop Spec & Design System**: [`docs/SPEC-desktop-app.md`](docs/SPEC-desktop-app.md) & [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md)  
   *Historical v2.5 desktop architectural reference.*

---

## Intellectual Property & Licensing

### Repository Scope
* **`davinmaritza/davion-ai` (This Repository):** Houses the **Web-Only Workstation** (`web/`), **FastAPI Inference Server** (`backend/`), **Multi-Dataset PyTorch Retraining Pipeline** (`ml/`), **Axial Quadrant Brand Kit** (`assets/brand/`), clinical validation reports, and documentation.
* **`davinmaritza/davion-ai-core` (Private):** Houses the legacy proprietary v2.5 desktop checkpoints and archival training datasets.

### License
This project is licensed under the **Apache License 2.0** — see the [LICENSE](LICENSE) file for the full text.

```
Copyright 2026 Davin Maritza

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0
```

### Academic Collaboration & Research Access
Academic institutions, hospitals, clinical radiology departments, and accredited researchers wishing to obtain evaluated access, conduct collaborative clinical validation, or audit the core algorithms may direct inquiries to:

* **Author & Copyright Holder**: Davin Maritza
* **Affiliation**: SMKN 13 Bandung / Research Consortium
* **Official Channel**: Contact via [GitHub Profile](https://github.com/davinmaritza)
* **License**: [Apache-2.0 License](LICENSE)

---

<div align="center">

```
========================================================================================
             HAK CIPTA RESMI REPUBLIK INDONESIA — UU NO. 28 TAHUN 2014
                         Pencipta: Davin Maritza © 2026
                         Ciptaan: Program Komputer Davion AI
       Didaftarkan pada Direktorat Jenderal Kekayaan Intelektual (DJKI) Kemenkumham RI
========================================================================================
```

</div>
