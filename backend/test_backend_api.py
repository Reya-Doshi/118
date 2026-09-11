"""
Automated Integration Test Suite for RageB8 Backend API
Tests:
  1. GET /health
  2. POST /api/analyze-wristband (multipart/form-data upload)
  3. POST /api/analyze-wristband (application/json with base64)
  4. Validation handling (empty/invalid images)
"""

import os
import sys
import base64
import json
from fastapi.testclient import TestClient

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from backend.main import app

client = TestClient(app)

def run_tests():
    print("\n" + "=" * 65)
    print("  RUNNING BACKEND API TEST SUITE: POST /api/analyze-wristband")
    print("=" * 65)

    # 1. Health check
    print("\n1. Testing GET /health...")
    res_health = client.get("/health")
    print(f"   Status Code: {res_health.status_code}")
    print(f"   Response: {res_health.json()}")
    assert res_health.status_code == 200

    # Test image path
    test_img_path = os.path.join(PROJECT_ROOT, "test_images", "wristband_low_monitor.png")
    assert os.path.exists(test_img_path), f"Test image not found: {test_img_path}"

    # 2. Test Multipart Form-Data Upload
    print("\n2. Testing POST /api/analyze-wristband (multipart/form-data)...")
    with open(test_img_path, "rb") as f:
        files = {"file": ("wristband_low_monitor.png", f, "image/png")}
        data = {
            "temperature": "27.0",
            "humidity": "55.0",
            "shelf_age_days": "20.0"
        }
        res_upload = client.post("/api/analyze-wristband", files=files, data=data)

    print(f"   Status Code: {res_upload.status_code}")
    assert res_upload.status_code == 200, f"Error: {res_upload.text}"
    body = res_upload.json()
    print(f"   Estimated Exposure: {body['estimated_exposure_ppm_h']} ppm·h")
    print(f"   Status:             {body['status']}")
    print(f"   Confidence Score:   {body['confidence']['score']}")
    print(f"   Extracted RGB:      {body['rgb']}")
    print(f"   Extracted LAB:      {body['lab']}")
    print(f"   Delta E:            {body['delta_e']}")
    print(f"   Image Quality:      {body['image_quality']['verdict']}")
    print(f"   Band Detected:      {body['band_detected']}")
    print(f"   Prototype Flag:     {body['prototype']}")

    # Verify all expected keys exist
    expected_keys = [
        "estimated_exposure_ppm_h", "status", "confidence", "rgb", "lab",
        "delta_e", "temperature", "humidity", "shelf_age_days",
        "image_quality", "band_detected", "prototype"
    ]
    for k in expected_keys:
        assert k in body, f"Missing required key in response: {k}"

    # 3. Test Base64 JSON Payload
    print("\n3. Testing POST /api/analyze-wristband (application/json base64)...")
    with open(test_img_path, "rb") as f:
        b64 = base64.b64encode(f.read()).decode("utf-8")

    json_payload = {
        "image_base64": f"data:image/png;base64,{b64}",
        "temperature": 25.0,
        "humidity": 50.0,
        "shelf_age_days": 15.0
    }
    res_b64 = client.post("/api/analyze-wristband", json=json_payload)
    print(f"   Status Code: {res_b64.status_code}")
    assert res_b64.status_code == 200, f"Error: {res_b64.text}"
    b64_body = res_b64.json()
    print(f"   Estimated Exposure: {b64_body['estimated_exposure_ppm_h']} ppm·h")
    print(f"   Status:             {b64_body['status']}")
    assert b64_body["status"] in ["NORMAL", "MONITOR", "REVIEW"]

    # 4. Test Validation & Error Handling
    print("\n4. Testing Validation on Corrupt / Empty Payload...")
    res_bad = client.post("/api/analyze-wristband", files={"file": ("empty.jpg", b"", "image/jpeg")})
    print(f"   Empty upload status code: {res_bad.status_code} (Expected: 400)")
    assert res_bad.status_code == 400

    print("\n" + "=" * 65)
    print("  ALL BACKEND API TESTS PASSED SUCCESSFULLY!")
    print("=" * 65 + "\n")

if __name__ == "__main__":
    run_tests()
