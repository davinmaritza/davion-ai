# Pending Notion Sync — Davion AI

> **Sync Status:** `SYNCED` (Initial 19-section structure synchronized at `2026-11-26T12:16+07:00`)  
> **Notion Root Page:** `Davion AI` (`42413039-c767-814b-be9d-cfe83a24a62e`) — https://app.notion.com/p/42413039c767814bbe9dcfe83a24a62e?pvs=204

---

## Table of Contents (19 Sections)

- `00. Project Overview`
- `01. Current State`
- `02. Architecture`
- `03. Technical Context`
- `04. Product Context`
- `05. Project Decisions`
- `06. Development Rules`
- `07. Features & Modules`
- `08. Database & Data Model`
- `09. API & Integrations`
- `10. Security`
- `11. Testing`
- `12. Known Issues & Technical Debt`
- `13. Progress & Milestones`
- `14. Changelog`
- `15. Project Memory`
- `16. Documentation`
- `17. Tasks & Next Steps`
- `18. AI Context`

---

## 00. Project Overview

- **Project Purpose:** Clinical Neuro-Oncology Diagnostic Suite & Cranial MRI CADx Workstation for multi-class cranial MRI classification (Glioma, Meningioma, Pituitary Adenoma, Normal), lesion segmentation, morphometry, and clinical reporting.
- **Product Scope (Current Repo):** Public showcase, clinical validation documentation, SaMD regulatory blueprints, and visual assets (`README.md`, `docs/`, `assets/`).
- **Product Scope (Planned Evolution):** Web-only clinical workstation with Hybrid Clinical Workstation UI redesign and multi-dataset tumor model retraining (`ml/`, `backend/`, `web/`).
- **Target Users:** Neuroradiologists (Sp.Rad), Neurosurgeons (Sp.BS), Oncology Tumour Boards, and academic researchers.
- **Current Version:** `v2.5.0` (per `docs/CLINICAL_VALIDATION_REPORT.md`).
- **License:** Apache License 2.0 (`LICENSE`).
- **Repository Structure (Observed):** `assets/`, `docs/`, `README.md`, `LICENSE`, `.gitignore`, plus 5 PDF documents.

## 01. Current State

- **Development Status:** Documentation & showcase repository cloned; Web-Only + Multi-Dataset Retraining plan drafted and user preferences collected.
- **Completed Work:** Repo cloned (`main` @ `838013b`), full docs inspected, project knowledge rules/context initialized locally.
- **Work in Progress:** Notion synchronization (blocked on Notion sign-in) and finalizing start of Web-Only implementation.
- **Pending Work:** Implement `ml/` multi-dataset training pipeline, `backend/` FastAPI inference server, and `web/` redesigned frontend.
- **Blockers:** Notion plugin sign-in required for live Notion sync.

## 02. Architecture

- **Current Repo Implementation:** No executable code in this public repo (`davinmaritza/davion-ai-core` is private per `README.md`).
- **Documented Legacy Architecture (`docs/SPEC-desktop-app.md`):** Tauri 2.0 (Rust) + React 18 desktop shell communicating with local Python FastAPI (`127.0.0.1:8000`) and PyTorch/XGBoost models.
- **Planned Web-Only Architecture:** Browser frontend (`web/`) <-> FastAPI inference API (`backend/`) <-> PyTorch multi-dataset ensemble & Attention U-Net (`ml/`).
- **Database Architecture:** `UNKNOWN` / `NOT_APPLICABLE` in current repo (no database schema exists).

## 03. Technical Context

- **Current Repo Stack:** Markdown documentation, HTML/CSS palette board (`assets/brand_palette_board.html`), PNG/JPG/SVG/ICO assets, PDFs.
- **Documented ML/Backend Stack:** Python 3.10–3.14, PyTorch 2.x, FastAPI, Uvicorn, MONAI, SimpleITK, XGBoost (`samd_radiomics_xgb.json` referenced in validation report).
- **Planned Web Stack:** React / Next.js + TypeScript + Tailwind CSS (`web/`), Python FastAPI (`backend/`), PyTorch + `timm` + MONAI (`ml/`).
- **Testing Tooling:** `UNKNOWN` in current repo (no `tests/` directory present; `pytest` and `vitest` referenced in `docs/SPEC-desktop-app.md`).

## 04. Product Context

- **Clinical Classes:** `Glioma` (ICD-10 `C71.9`), `Meningioma` (ICD-10 `D32.0`), `Pituitary Adenoma` (ICD-10 `D35.2`), `Normal Brain` (ICD-10 `Z01.89`).
- **Core Rule:** Radiologist-in-the-Loop only; never autonomous diagnosis.
- **Planned Web Features (User-Selected):** Browser MRI Viewer (`.dcm`, `.nii.gz`, `.jpg/.png`), Interactive Explainability (Grad-CAM++ & Segmentation overlay), Uncertainty Quantification & OOD Gate, Longitudinal Tracking, Automated PDF Report Export, Dataset & Benchmark Dashboard.

## 05. Project Decisions

- **DEC-001 (`ACTIVE`):** Dual-repository showcase model (`davinmaritza/davion-ai` public, `davinmaritza/davion-ai-core` private). Source: `README.md`.
- **DEC-002 (`SUPERSEDED` by DEC-003 for new web build):** Desktop-first Tauri 2.0 + React 18 specification (`docs/SPEC-desktop-app.md`).
- **DEC-003 (`ACTIVE` — Planned):** Pivot new development in this workspace to **Web-Only** with **Hybrid Clinical Workstation** UI (Light/Dark toggle + dark MRI viewport) and **Hybrid (Local GPU + Colab/Kaggle)** multi-dataset retraining.

## 06. Development Rules

- Governed by `docs/ai/PROJECT_RULES.md`.
- Maintain strict separation between inference, clinical reasoning, and presentation layers.
- Never store PHI/PII or credentials in repo or Notion.

## 07. Features & Modules

- **Documented Showcase Capabilities:** Multi-class classifier, Attention U-Net segmentation, Digital PACS calipers, Neurosurgical trajectory planner, CBMIR retrieval, Virtual Contrast & Tofts PK, ACR RadReport, 16-bit DICOM viewer. (Status: `DOCUMENTED_ONLY` in this repo; source in private repo).
- **Planned Web Features:** 6 web-first features listed in `04. Product Context` (Status: `PLANNED`).

## 08. Database & Data Model

- `NOT_APPLICABLE` in current repository (no database present).

## 09. API & Integrations

- **Current Repo:** None implemented.
- **Documented Spec (`docs/SPEC-desktop-app.md`):** FastAPI on `127.0.0.1:8000` with routers for diagnostics, segmentation, synthesis, twins, clearance, report.

## 10. Security

- **Documented SaMD Controls (`docs/CLINICAL_REGULATORY_SAMD.md`):** In-memory DICOM PHI anonymization (stripping tags `(0010,0010)` and `(0010,0020)`), OOD non-cranial image rejection, local execution, SHA-256 weight integrity checks.
- **Credentials:** None stored.

## 11. Testing

- **Current Repo:** No test suite present (`tests/` does not exist).
- **Reported Historical Validation (`docs/CLINICAL_VALIDATION_REPORT.md`):** N=2,800 holdout cohort (700/class), 87.68% overall accuracy, 98.57% normal sensitivity/rule-out, 7.8ms/slice latency.

## 12. Known Issues & Technical Debt

- **ISS-001:** No source code in public repository.
- **ISS-002:** Design spec mismatch (`docs/DESIGN_SYSTEM.md` Pastel Claymorphism vs `docs/SPEC-desktop-app.md` Obsidian PACS).
- **ISS-003:** `README.md` links to `Davion_AI_Setup_v2.5.exe` on GitHub Releases, but `NO_RELEASES` exist.
- **ISS-004:** Clinical failure modes documented in `docs/CLINICAL_VALIDATION_REPORT.md` (low-grade non-enhancing gliomas, off-axis slices, thin en plaque meningiomas).

## 13. Progress & Milestones

- **Milestone 0 (Done):** Public showcase repo cloned and analyzed.
- **Milestone 1 (In Progress):** Project Knowledge System setup (local drafts complete; Notion sync pending sign-in).
- **Milestone 2 (Planned):** Multi-dataset ML retraining pipeline (`ml/`).
- **Milestone 3 (Planned):** FastAPI backend (`backend/`) & Redesigned Web UI (`web/`).

## 14. Changelog

- `838013b`: `docs(license): apply Apache License 2.0` (current HEAD on `main`). No `CHANGELOG.md` present in repo.

## 15. Project Memory

- This public repo is a showcase/documentation portal; any code implementation here starts greenfield.
- `docs/troubleshooting_and_optimization.md` documents BraTS 2023 training lessons: resample NIfTI to `(1.0, 1.0, 1.0)` mm isotropic, use AMP FP16/BF16 + gradient accumulation for VRAM limits, clamp Focal Loss at `1e-7`, use `WeightedRandomSampler` for class imbalance, and flag confidence `< 0.50` for manual radiologist review.

## 16. Documentation

- `README.md`, `docs/DESIGN_SYSTEM.md`, `docs/SPEC-desktop-app.md`, `docs/CLINICAL_VALIDATION_REPORT.md`, `docs/CLINICAL_REGULATORY_SAMD.md`, `docs/troubleshooting_and_optimization.md`, plus 5 PDFs in root.

## 17. Tasks & Next Steps

- **TASK-001 (`BLOCKED` on user sign-in):** Sign in to Notion and sync these 19 sections to root page `Davion AI`.
- **TASK-002 (`TODO`):** Scaffold `ml/` multi-dataset harmonizer, transforms, ensemble + segmentation training, and Colab/Kaggle notebook.
- **TASK-003 (`TODO`):** Scaffold `backend/` FastAPI inference API with DICOM/NIfTI parsing and PHI stripping.
- **TASK-004 (`TODO`):** Scaffold `web/` Hybrid Clinical Workstation UI with all 6 selected features.

## 18. AI Context

- Synchronize directly from `docs/ai/AI_CONTEXT.md`.
