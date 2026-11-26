"""Integration tests for Davion AI FastAPI backend."""

import io
from pathlib import Path

import numpy as np
from fastapi.testclient import TestClient
from PIL import Image

from backend.main import app

client = TestClient(app)


def test_health_and_samples() -> None:
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] == "ok"

    samples = client.get("/api/v1/samples")
    assert samples.status_code == 200
    names = [s["name"] for s in samples.json()["samples"]]
    assert "sample_glioma.jpg" in names


def test_diagnose_sample_glioma() -> None:
    res = client.post("/api/v1/diagnose", data={"sample_name": "sample_glioma.jpg"})
    assert res.status_code == 200
    body = res.json()
    assert body["status"] == "OK"
    assert body["is_ood"] is False
    assert abs(sum(body["probabilities"].values()) - 1.0) < 0.02
    assert body["gradcam_data_url"].startswith("data:image/png;base64,")
    assert body["segmentation_data_url"].startswith("data:image/png;base64,")


def test_reject_ood_color_image() -> None:
    arr = np.zeros((128, 128, 3), dtype=np.uint8)
    arr[:, :, 0] = 250
    arr[:, :, 1] = 30
    arr[:, :, 2] = 200
    buf = io.BytesIO()
    Image.fromarray(arr).save(buf, format="PNG")
    buf.seek(0)

    res = client.post("/api/v1/diagnose", files={"file": ("selfie.png", buf, "image/png")})
    assert res.status_code == 200
    body = res.json()
    assert body["status"] == "REJECTED_OOD"
    assert body["is_ood"] is True


def test_compare_and_benchmarks() -> None:
    sample_a = Path("assets/sample_glioma.jpg").read_bytes()
    sample_b = Path("assets/sample_notumor.jpg").read_bytes()

    res = client.post(
        "/api/v1/compare",
        files={
            "baseline": ("baseline.jpg", sample_a, "image/jpeg"),
            "followup": ("followup.jpg", sample_b, "image/jpeg"),
        },
    )
    assert res.status_code == 200
    body = res.json()
    assert body["status"] == "OK"
    assert "longitudinal_delta" in body

    bench = client.get("/api/v1/benchmarks")
    assert bench.status_code == 200
    assert bench.json()["cohort_size"] == 2800
