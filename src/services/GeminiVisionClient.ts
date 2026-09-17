/**
 * Direct Client-Side Gemini Vision Service for Web & Kiosk
 * Enables direct optical localization & quality audits without requiring a local Python backend.
 */

export interface GeminiClientAuditResult {
  wristband_detected: boolean;
  wristband_type: string;
  provider: string;
  sensing_patch_color?: {
    hex: string;
    stage: 'BASELINE_NORMAL' | 'LOW_EXPOSURE' | 'ACTION_MONITOR' | 'ELEVATED_REVIEW' | 'CRITICAL_BLACK' | 'NOT_A_DOSIMETER';
    color_name: string;
  };
  bounding_boxes: {
    sensing_strip: [number, number, number, number]; // [ymin, xmin, ymax, xmax] 0-1000
    reference_scale?: [number, number, number, number];
  };
  image_quality: {
    is_too_dark: boolean;
    is_overexposed: boolean;
    is_blurry: boolean;
    strip_not_visible: boolean;
    reference_scale_missing: boolean;
    quality_verdict: 'PASS' | 'WARNING' | 'FAIL';
    quality_score: number;
    quality_notes: string;
  };
}

const DEFAULT_KEY = (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
const STORAGE_KEY = 'RAGEB8_GEMINI_API_KEY';

const GEMINI_PROMPT = `
You are a precision computer-vision localization and quality-inspection assistant for an industrial passive chemical dosimeter wristband (SARVAS / RageB8 Dual-Zone H2S Dosimeter).

CRITICAL SAFETY DIRECTIVE:
You must NEVER predict chemical concentration, gas dose, or ppm·h directly. Quantitative dosing is handled strictly by a separate calibrated physics model.

YOUR PRIMARY QUALITY & DETECTION DIRECTIVE:
1. DETECT WHETHER AN AUTHENTIC SARVAS PASSIVE CHEMICAL DOSIMETER OR TEST CARD IS PRESENT:
   - Check if the image contains a passive chemical dosimeter wristband, wearable dosimeter band, benchmark test card, or colorimetric strip.
   - If the image contains a smartwatch, electronic device display, bare skin, desk, face, or unrelated object without a dosimeter:
     * Set "wristband_detected": false
     * Set "wristband_type": "NOT_A_DOSIMETER"
     * Set "image_quality": {
         "is_too_dark": false,
         "is_overexposed": false,
         "is_blurry": false,
         "strip_not_visible": true,
         "reference_scale_missing": true,
         "quality_verdict": "FAIL",
         "quality_score": 0.0,
         "quality_notes": "REJECTED: Dosimeter wristband or test strip not detected in image frame."
       }

2. OPTICAL QUALITY AUDIT & EXTRACTION (If dosimeter present):
   - Set "wristband_detected": true
   - Set "wristband_type": "SARVAS Dual-Zone Dosimeter Band"
   - Localize the colorimetric sensing strip bounding box in normalized coordinates [ymin, xmin, ymax, xmax] (0 to 1000 integer scale).
   - Localize the printed reference color scale bounding box in normalized coordinates [ymin, xmin, ymax, xmax] (0 to 1000 integer scale).
   - Extract optical patch color:
     * hex: dominant hex color code of the sensing strip/patch (e.g. "#EDECE5" baseline, "#D8D4CD" trace, "#928D88" action, "#504A44" critical).
     * stage: "BASELINE_NORMAL" | "LOW_EXPOSURE" | "ACTION_MONITOR" | "ELEVATED_REVIEW" | "CRITICAL_BLACK"
     * color_name: description of the optical patch
   - Audit image quality:
     * is_too_dark (boolean), is_overexposed (boolean), is_blurry (boolean), strip_not_visible (boolean), reference_scale_missing (boolean)
     * quality_verdict: "PASS" | "WARNING" | "FAIL"
     * quality_score: float between 0.0 and 1.0
     * quality_notes: explanation of quality verdict

Return strictly valid JSON with no markdown backticks:
{
  "wristband_detected": true,
  "wristband_type": "SARVAS Dual-Zone Dosimeter Band",
  "sensing_patch_color": {
    "hex": "#EDECE5",
    "stage": "BASELINE_NORMAL",
    "color_name": "Calibrated Sensing Zone"
  },
  "bounding_boxes": {
    "sensing_strip": [380, 420, 580, 580],
    "reference_scale": [620, 400, 720, 600]
  },
  "image_quality": {
    "is_too_dark": false,
    "is_overexposed": false,
    "is_blurry": false,
    "strip_not_visible": false,
    "reference_scale_missing": false,
    "quality_verdict": "PASS",
    "quality_score": 0.95,
    "quality_notes": "Authentic wristband optical reading captured successfully."
  }
}
`;

export class GeminiVisionClient {
  public static getApiKey(): string {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && saved.trim()) return saved.trim();
    return DEFAULT_KEY;
  }

  public static setApiKey(key: string): void {
    if (!key || !key.trim()) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, key.trim());
    }
  }

  public static isKeyConfigured(): boolean {
    const key = this.getApiKey();
    return Boolean(key && key.length > 5);
  }

  public static async analyzeImage(imageDataUrlOrBase64: string): Promise<GeminiClientAuditResult> {
    const apiKey = this.getApiKey();

    let base64Data = imageDataUrlOrBase64;
    let mimeType = 'image/jpeg';

    if (imageDataUrlOrBase64.includes('base64,')) {
      const parts = imageDataUrlOrBase64.split('base64,');
      const match = parts[0].match(/:(.*?);/);
      if (match) mimeType = match[1];
      base64Data = parts[1];
    }

    if (!apiKey) {
      return this.fallbackHeuristicAudit();
    }

    const models = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-2.0-flash'];

    for (const model of models) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: GEMINI_PROMPT },
                  {
                    inline_data: {
                      mime_type: mimeType,
                      data: base64Data
                    }
                  }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.1,
              maxOutputTokens: 800,
              responseMimeType: 'application/json'
            }
          }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(cleaned);

            const detected = parsed.wristband_detected ?? false; // fail-safe: missing field = not detected
            const qualityVerdict = parsed.image_quality?.quality_verdict ?? (detected ? 'PASS' : 'FAIL');

            return {
              wristband_detected: Boolean(detected),
              wristband_type: parsed.wristband_type ?? (detected ? 'SARVAS Dual-Zone Dosimeter Band' : 'NOT_A_DOSIMETER'),
              provider: `Google Gemini Vision (${model} Direct)`,
              sensing_patch_color: parsed.sensing_patch_color || undefined,
              bounding_boxes: {
                sensing_strip: parsed.bounding_boxes?.sensing_strip || [380, 420, 580, 580],
                reference_scale: parsed.bounding_boxes?.reference_scale || [620, 400, 720, 600]
              },
              image_quality: {
                is_too_dark: parsed.image_quality?.is_too_dark ?? false,
                is_overexposed: parsed.image_quality?.is_overexposed ?? false,
                is_blurry: parsed.image_quality?.is_blurry ?? false,
                strip_not_visible: parsed.image_quality?.strip_not_visible ?? !detected,
                reference_scale_missing: parsed.image_quality?.reference_scale_missing ?? false,
                quality_verdict: qualityVerdict as 'PASS' | 'WARNING' | 'FAIL',
                quality_score: parsed.image_quality?.quality_score ?? (detected ? 0.95 : 0.0),
                quality_notes: parsed.image_quality?.quality_notes ?? (detected ? 'Direct Gemini inspection completed.' : 'Dosimeter strip not detected.')
              }
            };
          }
        }
      } catch (err) {
        console.warn(`Gemini client call to ${model} failed:`, err);
      }
    }

    return this.fallbackHeuristicAudit();
  }

  public static fallbackHeuristicAudit(): GeminiClientAuditResult {
    // When Gemini is unavailable, we cannot confirm a dosimeter is present.
    // Return a conservative FAIL so the user is prompted to retry with connectivity.
    return {
      wristband_detected: false,
      wristband_type: 'UNVERIFIED (Gemini Offline)',
      provider: 'On-Device Fallback (Gemini Unavailable)',
      bounding_boxes: {
        sensing_strip: [375, 425, 575, 575],
        reference_scale: [610, 410, 710, 590]
      },
      image_quality: {
        is_too_dark: false,
        is_overexposed: false,
        is_blurry: false,
        strip_not_visible: true,
        reference_scale_missing: true,
        quality_verdict: 'FAIL',
        quality_score: 0.0,
        quality_notes: 'Gemini Vision API unavailable. Cannot verify dosimeter presence. Please retry with network connection.'
      }
    };
  }
}
