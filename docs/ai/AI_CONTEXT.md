# 18. AI Context — Davion AI

> **Status:** `SYNCED` — Synchronized to Notion root page `Davion AI` (`42413039-c767-814b-be9d-cfe83a24a62e`).

## Current Objective

Initialize the integrated Project Knowledge System for **Davion AI** and prepare execution of the approved **Web-Only Platform Redesign & Multi-Dataset Brain Tumor Retraining** plan.

## Current Work

- Completed initial functional build of **Davion AI Web-Only** (`ml/`, `backend/`, `web/`) and verified TypeScript/Vite build + `pytest` suite.

## Last Completed Work

- Built `ml/` multi-dataset harmonizer (patient-level zero-leakage splits), transforms, `DavionTumorEnsemble` (`timm`), `AttentionUNet`, `train.py`, `evaluate.py`, and Colab/Kaggle notebook `ml/notebooks/train_davion_multi_dataset.ipynb`.
- Built `backend/` FastAPI server (`backend/main.py`) with `.dcm`/`.nii.gz`/`.png`/`.jpg` parsing, in-memory PHI stripping, OOD gate, Grad-CAM++/mask overlays, `/api/v1/compare`, and `/api/v1/benchmarks`.
- Built `web/` React + TypeScript + Vite + Tailwind app with MRI viewport, opacity sliders, digital calipers, longitudinal compare, benchmarks table, Light/Dark toggle, and PDF print export.
- Synchronized project knowledge to Notion (`Davion AI` root page + 19 child pages).

## Next Action

- Run `.\.venv\Scripts\python.exe -m uvicorn backend.main:app --port 8000` and `npm --prefix web run dev` to test live in browser, or run `ml/notebooks/train_davion_multi_dataset.ipynb` on CUDA GPU / Colab to generate trained `.pt` weights.

## Active Constraints

- **Repository Reality:** The public repository currently contains **only documentation, PDFs, and visual assets** (`assets/`). There is no executable source code (`models/`, `api/`, `desktop/`) in this repo; core code lives in the private `davinmaritza/davion-ai-core` repo per `README.md`.
- **GitHub Releases:** `https://api.github.com/repos/davinmaritza/davion-ai/releases` returned `NO_RELEASES` (no binary installer published).
- **Target Scope Change (User-Requested):** The new project direction is **Web-Only** (no Tauri desktop shell), with a **UI redesign** and **multi-dataset tumor retraining**.
- **Medical Disclaimer:** Prototype/research software only; not FDA/CE-MDR/Kemenkes cleared for autonomous clinical diagnosis.

## Important Decisions

- **D-001 (Historical/Repo):** Dual-repository public showcase architecture (`davinmaritza/davion-ai` public docs/assets vs `davinmaritza/davion-ai-core` private code).
- **D-002 (Historical/Repo — Conflicting Specs):** `docs/DESIGN_SYSTEM.md` specifies Soft 3D Pastel Claymorphism while `docs/SPEC-desktop-app.md` references Deep Medical Obsidian PACS + Tauri 2.0.
- **D-003 (User-Selected Plan Direction, Pending Implementation):** Transition to **Web-Only**, **Hybrid Clinical Workstation** UI, **Hybrid (Local GPU + Colab/Kaggle)** multi-dataset retraining, and 6 web-first clinical features.

## Active Files

- `docs/ai/PROJECT_RULES.md`
- `docs/ai/AI_CONTEXT.md`
- `docs/ai/PENDING_NOTION_SYNC.md`
- `README.md`
- `docs/DESIGN_SYSTEM.md`
- `docs/SPEC-desktop-app.md`
- `docs/CLINICAL_VALIDATION_REPORT.md`
- `docs/CLINICAL_REGULATORY_SAMD.md`
- `docs/troubleshooting_and_optimization.md`

## Known Issues

- **KI-001:** No source code (`api/`, `models/`, `web/` or `desktop/`) exists in this public repository yet.
- **KI-002:** Conflicting design specifications between `docs/DESIGN_SYSTEM.md` (Pastel Claymorphism) and `docs/SPEC-desktop-app.md` (Obsidian PACS).
- **KI-003:** `README.md` references `Davion_AI_Setup_v2.5.exe` on GitHub Releases, but no releases are currently published.
- **KI-004:** Clinical validation report (`N=2,800`, 87.68% acc) notes failure modes on non-enhancing low-grade gliomas (56 cases), off-axis sagittal/coronal slices (54 cases), and thin en plaque meningiomas (47 cases).

## Do Not Change

- Preserve existing `LICENSE` (Apache-2.0), copyright attribution (`Copyright 2026 Davin Maritza`), and historical clinical/regulatory reference documents unless explicitly requested.
- Never store PHI/PII or credentials in repository knowledge files or Notion.

## Last Validation

- `npm --prefix web run build` (`tsc && vite build`): PASSED (`dist/` built in 2.84s).
- `.\.venv\Scripts\python.exe -m pytest ml/tests backend/tests -v`: PASSED (6/6 tests in 0.89s).

## Last Context Update

- `2026-11-26T12:23+07:00`

## Last Successful Notion Sync

- `2026-11-26T12:23+07:00` (Root Page: `Davion AI`, ID `42413039-c767-814b-be9d-cfe83a24a62e`, 19 child pages `00`–`18` synced)

## Cross-AI Handoff Metadata

- **Project Identity:** `Davion AI` (`c:\Users\Despair\Projects\Web_and_AI\Davion-AI`, branch `main`, commit `838013b`).
- **Last AI/Runtime:** `Antigravity` / `Gemini 4 Hydrogen (Medium)` (Execution mode: `FULL` — repo R/W + Notion R/W verified).
- **Rules Source:** `docs/ai/PROJECT_RULES.md`
- **Reload Instructions:** Read `docs/ai/PROJECT_RULES.md`, `docs/ai/AI_CONTEXT.md`, and `docs/ai/PENDING_NOTION_SYNC.md`.
