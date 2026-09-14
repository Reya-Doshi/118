/**
 * Dosimeter API Service for Mobile Companion Application
 * Connects directly to the FastAPI backend at POST /api/analyze-wristband.
 * 
 * SECURITY DIRECTIVE:
 *  - Never stores or accepts Gemini API keys on the client.
 *  - Communicates solely with the secure backend server.
 */

import { Capacitor } from '@capacitor/core';
import type { BackendAnalyzeResponse } from '../types/mobile';

export interface AnalyzeWristbandParams {
  imageUri: string; // Base64 DataUrl or URL
  temperature?: number;
  humidity?: number;
  shelfAgeDays?: number;
}

export type ApiErrorKind = 
  | 'NETWORK_UNAVAILABLE' 
  | 'TIMEOUT' 
  | 'INVALID_IMAGE' 
  | 'BAND_NOT_DETECTED' 
  | 'SERVER_ERROR';

export class DosimeterApiError extends Error {
  public kind: ApiErrorKind;
  public details?: any;

  constructor(kind: ApiErrorKind, message: string, details?: any) {
    super(message);
    this.name = 'DosimeterApiError';
    this.kind = kind;
    this.details = details;
  }
}

export class DosimeterApiService {
  /**
   * Resolves the backend server endpoint automatically based on runtime environment.
   */
  public static getBaseUrl(): string {
    // 1. Explicit user/runtime override in localStorage
    const stored = localStorage.getItem('RAGEB8_BACKEND_URL');
    if (stored) return stored.trim().replace(/\/+$/, '');

    // 2. Vite environment variable
    const envUrl = (import.meta as any).env?.VITE_BACKEND_URL;
    if (envUrl) return envUrl.trim().replace(/\/+$/, '');

    // 3. Android Native Device / Emulator
    if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android') {
      return 'http://192.168.31.77:8000';
    }

    // 4. Browser / Mobile Web: use current host on port 8000
    if (typeof window !== 'undefined' && window.location) {
      const hostname = window.location.hostname || 'localhost';
      return `http://${hostname}:8000`;
    }

    return 'http://localhost:8000';
  }

  /**
   * Health check to test backend reachability.
   */
  public static async checkHealth(): Promise<{ online: boolean; message: string }> {
    const baseUrl = this.getBaseUrl();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    try {
      const res = await fetch(`${baseUrl}/health`, {
        method: 'GET',
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        return { online: true, message: 'Backend connected' };
      }
      return { online: false, message: `Server error: HTTP ${res.status}` };
    } catch (err: any) {
      clearTimeout(timeoutId);
      return { 
        online: false, 
        message: err.name === 'AbortError' ? 'Connection timed out' : 'Server offline' 
      };
    }
  }

  /**
   * Uploads and analyzes wristband photo via POST /api/analyze-wristband
   */
  public static async analyzeWristband(params: AnalyzeWristbandParams): Promise<BackendAnalyzeResponse> {
    const baseUrl = this.getBaseUrl();
    const endpoint = `${baseUrl}/api/analyze-wristband`;

    const controller = new AbortController();
    // 25 second timeout to allow Gemini cloud inspection
    const timeoutId = setTimeout(() => controller.abort(), 25000);

    try {
      // Send as JSON base64 payload
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          image_base64: params.imageUri,
          temperature: params.temperature ?? 25.0,
          humidity: params.humidity ?? 50.0,
          shelf_age_days: params.shelfAgeDays ?? 15.0
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errMessage = `HTTP ${response.status} ${response.statusText}`;
        try {
          const errJson = await response.json();
          if (errJson.detail) errMessage = errJson.detail;
        } catch {
          // ignore parsing error
        }

        if (response.status === 400) {
          throw new DosimeterApiError('INVALID_IMAGE', `Image format rejected: ${errMessage}`);
        } else if (response.status >= 500) {
          throw new DosimeterApiError('SERVER_ERROR', `Backend processing error: ${errMessage}`);
        } else {
          throw new DosimeterApiError('SERVER_ERROR', errMessage);
        }
      }

      const data: BackendAnalyzeResponse = await response.json();

      // Validate required response fields
      if (typeof data.estimated_exposure_ppm_h !== 'number' || !data.status) {
        throw new DosimeterApiError('SERVER_ERROR', 'Malformed API response: Missing estimated_exposure_ppm_h or status.');
      }

      return data;
    } catch (err: any) {
      clearTimeout(timeoutId);

      if (err instanceof DosimeterApiError) {
        throw err;
      }

      if (err.name === 'AbortError') {
        throw new DosimeterApiError(
          'TIMEOUT',
          'Analysis timed out after 25 seconds. Please check your network and retry.'
        );
      }

      // Network unreachable / CORS / Connection refused
      throw new DosimeterApiError(
        'NETWORK_UNAVAILABLE',
        `Unable to connect to backend server at ${baseUrl}. Please ensure the backend is running.`,
        err
      );
    }
  }
}
