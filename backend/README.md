# SARVAS Dosimeter Backend API Server

FastAPI backend server that coordinates **Gemini Vision** (quality audit & region localization), **OpenCV** (spatial median color extraction & CIE $L^*a^*b^*$ conversion), and a calibrated **Random Forest Regressor** to estimate cumulative $H_2S$ exposure.

> [!NOTE]
> **SIMULATED / PROTOTYPE READING**  
> All dose predictions reflect prototype Cu-PAN colorimetric chelation behavior and are tagged with `"prototype": true`.

---

## 1. Running the Server Locally

### Option A: Via Python Direct
Ensure your virtual environment is active and run:
```powershell
python backend/main.py
```
By default, the server starts on `http://localhost:8000`.  
To run on a custom port (e.g. `8080`):
```powershell
$env:PORT="8080"; python backend/main.py
```

### Option B: Via npm Script
```powershell
npm run backend:dev
```

### Interactive API Documentation
Once running, navigate to:
- **Swagger UI:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc:** [http://localhost:8000/redoc](http://localhost:8000/redoc)
- **Health Check:** [http://localhost:8000/health](http://localhost:8000/health)

---

## 2. Endpoint Specification

### `POST /api/analyze-wristband`

Accepts either **`multipart/form-data`** (standard file upload) or **`application/json`** (base64 string).

#### Form-Data Parameters:
- `file` (or `image`): Image binary file (JPEG, PNG, WEBP, BMP up to 15 MB).
- `temperature` *(optional, float)*: Ambient temperature in °C (default: `25.0`).
- `humidity` *(optional, float)*: Relative humidity % (default: `50.0`).
- `shelf_age_days` *(optional, float)*: Dosimeter shelf life in days (default: `15.0`).

#### Example cURL (Multipart File Upload):
```bash
curl -X POST "http://localhost:8000/api/analyze-wristband" \
  -F "file=@test_images/wristband_low_monitor.png" \
  -F "temperature=26.5" \
  -F "humidity=52.0" \
  -F "shelf_age_days=18.0"
```

#### Example cURL (JSON Base64):
```bash
curl -X POST "http://localhost:8000/api/analyze-wristband" \
  -H "Content-Type: application/json" \
  -d '{
    "image_base64": "data:image/png;base64,iVBORw0KGgo...",
    "temperature": 25.0,
    "humidity": 50.0,
    "shelf_age_days": 15.0
  }'
```

---

## 3. Response Schema

```json
{
  "estimated_exposure_ppm_h": 0.89,
  "status": "MONITOR",
  "confidence": {
    "score": 0.98,
    "uncertainty_95_ci_ppm_h": 0.35,
    "ci_lower_ppm_h": 0.54,
    "ci_upper_ppm_h": 1.24
  },
  "rgb": {
    "r": 175,
    "g": 85,
    "b": 105,
    "hex": "#AF5569"
  },
  "lab": {
    "L": 47.79,
    "a": 38.75,
    "b": 5.93
  },
  "delta_e": 31.56,
  "temperature": 26.5,
  "humidity": 52.0,
  "shelf_age_days": 18.0,
  "image_quality": {
    "verdict": "PASS",
    "score": 0.98,
    "is_too_dark": false,
    "is_overexposed": false,
    "is_blurry": false,
    "strip_not_visible": false,
    "reference_scale_missing": false,
    "notes": "Optimal lighting, strip and reference scale clearly visible."
  },
  "band_detected": true,
  "localizations": {
    "sensing_strip_roi": { "x": 334, "y": 156, "w": 131, "h": 169 },
    "reference_scale_roi": { "x": 200, "y": 158, "w": 40, "h": 153 }
  },
  "vision_engine": "Gemini Vision API (gemini-3.5-flash)",
  "action_guideline": "Action level reached (0.50–1.00 ppm·h). Verify ventilation & limit further exposure.",
  "prototype": true,
  "timestamp": "2026-09-11T14:41:09.551401+00:00"
}
```

---

## 4. Operational Safety Standards

| Status | Threshold | Operational Action Directive |
| :--- | :--- | :--- |
| **`NORMAL`** | $< 0.50\text{ ppm}\cdot\text{h}$ | Safe working environment. Continue normal shift monitoring. |
| **`MONITOR`** | $0.50 - 1.00\text{ ppm}\cdot\text{h}$ | Action level reached. Verify ventilation and limit further exposure. |
| **`REVIEW`** | $> 1.00\text{ ppm}\cdot\text{h}$ | Permissible exposure limit exceeded. Prompt evacuation and safety review. |
| **`EXPIRED / REJECT`** | $\text{Shelf Age} > 90\text{ days}$ | Band expired. Chemistry degraded; reading invalidated. |

---

## 5. Security & Fail-Safe Architecture

1. **Server-Side Key Isolation**: `GEMINI_API_KEY` is loaded strictly on the backend from `.env`. The key is never returned in HTTP responses or bundled in the frontend or Android builds.
2. **Fail-Safe Fallback**: If the Gemini API experiences network delays or is unreachable, the server automatically engages OpenCV geometric spatial contour localization.
3. **Payload Sanitization & Size Limits**: Rejects empty payloads, corrupt encodings, and files exceeding 15 MB.

---

## 6. Running Backend Automated Tests

To run the automated endpoint integration test suite:
```powershell
python backend/test_backend_api.py
```
This tests `GET /health`, `POST /api/analyze-wristband` via multipart file upload, `POST /api/analyze-wristband` via base64 JSON payload, and error validation handling.
