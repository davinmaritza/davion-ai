"""Davion AI Web Inference & Benchmark API (FastAPI)."""

from __future__ import annotations

import json
from pathlib import Path

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from backend.services.dicom_parser import parse_uploaded_scan
from backend.services.inference import CHECKPOINT_PATH, run_diagnosis

ASSETS_DIR = Path("assets")
METRICS_PATH = Path("artifacts/checkpoints/metrics.json")

app = FastAPI(
    title="Davion AI Web Inference API",
    version="3.0.0-web",
    description="Cranial MRI classification, segmentation, explainability, and benchmark API.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict:
    return {
        "status": "ok",
        "pytorch_checkpoint_loaded": CHECKPOINT_PATH.exists(),
        "engine_mode": "pytorch_ensemble" if CHECKPOINT_PATH.exists() else "radiomic_baseline",
    }


@app.get("/api/v1/samples")
def list_samples() -> dict:
    """List built-in sample MRI scans from assets/."""
    samples = []
    if ASSETS_DIR.exists():
        for path in sorted(ASSETS_DIR.glob("sample_*.jpg")):
            samples.append({"name": path.name, "label_hint": path.stem.replace("sample_", "")})
    return {"samples": samples}


@app.post("/api/v1/diagnose")
async def diagnose(
    file: UploadFile | None = File(default=None),
    sample_name: str | None = Form(default=None),
) -> dict:
    """Analyze an uploaded MRI (.dcm, .nii/.nii.gz, .png, .jpg) or a built-in sample."""
    if file is not None:
        raw_bytes = await file.read()
        filename = file.filename or "upload.png"
    elif sample_name:
        safe_name = Path(sample_name).name
        target = ASSETS_DIR / safe_name
        if not target.exists():
            raise HTTPException(status_code=404, detail=f"Sample not found: {safe_name}")
        raw_bytes = target.read_bytes()
        filename = safe_name
    else:
        raise HTTPException(status_code=400, detail="Provide either an uploaded file or sample_name.")

    try:
        scan = parse_uploaded_scan(filename, raw_bytes)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Failed to parse medical image: {exc}") from exc

    return run_diagnosis(scan)


@app.post("/api/v1/compare")
async def compare_scans(
    baseline: UploadFile = File(...),
    followup: UploadFile = File(...),
) -> dict:
    """Longitudinal comparison between baseline and follow-up MRI scans."""
    b_scan = parse_uploaded_scan(baseline.filename or "baseline.png", await baseline.read())
    f_scan = parse_uploaded_scan(followup.filename or "followup.png", await followup.read())

    b_res = run_diagnosis(b_scan)
    f_res = run_diagnosis(f_scan)

    if b_res.get("is_ood") or f_res.get("is_ood"):
        return {"status": "REJECTED_OOD", "baseline": b_res, "followup": f_res}

    b_area = b_res["morphometry"]["area_cm2"]
    f_area = f_res["morphometry"]["area_cm2"]
    delta_cm2 = round(f_area - b_area, 2)
    delta_pct = round(((f_area - b_area) / b_area) * 100.0, 1) if b_area > 0 else 0.0

    return {
        "status": "OK",
        "baseline": b_res,
        "followup": f_res,
        "longitudinal_delta": {
            "area_change_cm2": delta_cm2,
            "area_change_pct": delta_pct,
            "trend": "PROGRESSION" if delta_cm2 > 0.25 else ("REGRESSION" if delta_cm2 < -0.25 else "STABLE"),
        },
    }


@app.get("/api/v1/benchmarks")
def get_benchmarks() -> dict:
    """Return retrained model metrics if available, otherwise documented N=2,800 baseline."""
    if METRICS_PATH.exists():
        data = json.loads(METRICS_PATH.read_text(encoding="utf-8"))
        return {"source": "retrained_checkpoint", **data}

    return {
        "source": "documented_baseline_n2800",
        "cohort_size": 2800,
        "classes": ["glioma", "meningioma", "pituitary", "normal"],
        "overall_accuracy": 0.8768,
        "macro_f1": 0.8746,
        "ece": None,
        "confusion_matrix": [
            [538, 52, 54, 56],
            [39, 573, 41, 47],
            [24, 21, 654, 1],
            [7, 3, 0, 690],
        ],
        "per_dataset": {
            "TCGA-LGG / Figshare / Partner Cohort (N=2800)": {"count": 2800, "accuracy": 0.8768},
        },
    }
