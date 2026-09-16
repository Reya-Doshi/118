import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle2, 
  Loader2, 
  Sparkles, 
  AlertTriangle, 
  RotateCcw, 
  X, 
  WifiOff, 
  Settings, 
  Server
} from 'lucide-react';
import { DosimeterApiService, DosimeterApiError } from '../../services/DosimeterApiService';
import { CalibrationEngine } from '../../services/CalibrationEngine';
import type { BackendAnalyzeResponse } from '../../types/mobile';

interface AnalysisSequenceModalProps {
  isOpen: boolean;
  imageUri?: string | null;
  ambientTemp?: number;
  ambientRh?: number;
  shelfAgeDays?: number;
  onAnalysisSuccess: (response: BackendAnalyzeResponse) => void;
  onClose: () => void;
}

const ANALYSIS_STEPS = [
  { id: 1, label: 'Detecting wristband' },
  { id: 2, label: 'Locating reference scale' },
  { id: 3, label: 'Sampling strip colour' },
  { id: 4, label: 'Correcting illumination' },
  { id: 5, label: 'Estimating exposure' }
];

export const AnalysisSequenceModal: React.FC<AnalysisSequenceModalProps> = ({
  isOpen,
  imageUri,
  ambientTemp = 25.0,
  ambientRh = 50.0,
  shelfAgeDays = 15.0,
  onAnalysisSuccess,
  onClose
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [progressPercent, setProgressPercent] = useState(15);
  const [errorState, setErrorState] = useState<string | null>(null);
  const [errorKind, setErrorKind] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showServerConfig, setShowServerConfig] = useState(false);
  const [customServerUrl, setCustomServerUrl] = useState(DosimeterApiService.getBaseUrl());

  const isMounted = useRef(true);

  const startAnalysis = async () => {
    if (!imageUri) {
      setErrorState('No wristband image data provided. Please capture or select a photo.');
      setErrorKind('INVALID_IMAGE');
      return;
    }

    setErrorState(null);
    setErrorKind(null);
    setIsProcessing(true);
    setCurrentStep(1);
    setProgressPercent(20);

    // Visual step progression timer
    const stepTimer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < 4) {
          const next = prev + 1;
          setProgressPercent(Math.min(85, Math.round((next / 5) * 100)));
          return next;
        }
        return prev;
      });
    }, 700);

    try {
      // Execute live backend API call: POST /api/analyze-wristband
      const apiResponse = await DosimeterApiService.analyzeWristband({
        imageUri,
        temperature: ambientTemp,
        humidity: ambientRh,
        shelfAgeDays
      });

      clearInterval(stepTimer);

      if (!isMounted.current) return;

      // Final step: Estimating exposure
      setCurrentStep(5);
      setProgressPercent(100);

      // Brief pause to allow user to see 100% completion
      setTimeout(() => {
        if (isMounted.current) {
          onAnalysisSuccess(apiResponse);
        }
      }, 500);

    } catch (err: any) {
      console.warn('DosimeterApiService caught error. Automatically executing On-Device AI Engine (Offline Safe):', err);
      try {
        const onDeviceResult = await CalibrationEngine.analyzeRawImageAsync(
          imageUri,
          ambientTemp,
          ambientRh,
          shelfAgeDays
        );
        clearInterval(stepTimer);
        if (!isMounted.current) return;
        setCurrentStep(5);
        setProgressPercent(100);
        setTimeout(() => {
          if (isMounted.current) {
            onAnalysisSuccess(onDeviceResult);
          }
        }, 500);
      } catch (fallbackErr: any) {
        clearInterval(stepTimer);
        if (!isMounted.current) return;
        setErrorState(fallbackErr?.message || 'Unable to analyze image.');
        setErrorKind('INVALID_IMAGE');
      }
    } finally {
      if (isMounted.current) {
        setIsProcessing(false);
      }
    }
  };

  useEffect(() => {
    isMounted.current = true;
    if (isOpen && imageUri) {
      startAnalysis();
    }
    return () => {
      isMounted.current = false;
    };
  }, [isOpen, imageUri]);

  const runOnDeviceFallback = async () => {
    if (!imageUri) return;
    setIsProcessing(true);
    setErrorState(null);
    setCurrentStep(5);
    setProgressPercent(100);

    try {
      const fallbackResult = await CalibrationEngine.analyzeRawImageAsync(
        imageUri,
        ambientTemp,
        ambientRh,
        shelfAgeDays
      );
      setTimeout(() => {
        if (isMounted.current) {
          onAnalysisSuccess(fallbackResult);
        }
      }, 400);
    } catch (err: any) {
      setErrorState('On-device analysis error: ' + (err?.message || 'Unknown error'));
    } finally {
      if (isMounted.current) {
        setIsProcessing(false);
      }
    }
  };

  const handleSaveCustomServer = (urlToSave?: string) => {
    const targetUrl = urlToSave || customServerUrl;
    if (targetUrl) {
      localStorage.setItem('RAGEB8_BACKEND_URL', targetUrl.trim());
      setCustomServerUrl(targetUrl.trim());
      setShowServerConfig(false);
      startAnalysis();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#111827]/90 backdrop-blur-md flex flex-col justify-center items-center p-5 max-w-md mx-auto text-[#FAF8F5]">
      <div className="w-full bg-[#1F2937] border border-white/15 rounded-3xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Title */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-[11px] font-mono mb-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            AI Analytical Pipeline · PS-118
          </div>
          <h3 className="text-xl font-serif font-bold text-white">
            {errorState ? 'Backend Analysis Disrupted' : 'Analyzing Wristband'}
          </h3>
          <p className="text-xs text-gray-400">
            {errorState 
              ? 'Server unreachable or offline. On-device fallback available.' 
              : 'Gemini Vision QA → OpenCV Colorimetric Engine → ML Regressor'}
          </p>
        </div>

        {/* Error State Display */}
        {errorState ? (
          <div className="space-y-3.5 py-1">
            <div className="bg-red-950/40 border border-red-500/40 rounded-2xl p-4 text-red-200 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-sm text-red-300">
                {errorKind === 'NETWORK_UNAVAILABLE' ? (
                  <WifiOff className="w-5 h-5 text-red-400 shrink-0" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                )}
                <span>
                  {errorKind === 'NETWORK_UNAVAILABLE' && 'Backend Server Offline / Network Shift'}
                  {errorKind === 'TIMEOUT' && 'Connection Timed Out'}
                  {errorKind === 'INVALID_IMAGE' && 'Unreadable Image'}
                  {errorKind === 'SERVER_ERROR' && 'API Processing Error'}
                  {!errorKind && 'Analysis Error'}
                </span>
              </div>
              <p className="text-[11px] leading-relaxed text-red-200/90">
                {errorState}
              </p>
            </div>

            {/* Prominent On-Device AI Option */}
            <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  On-Device AI Engine (Offline Safe)
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-900/60 px-2 py-0.5 rounded-md">
                  120 Samples Calibrated
                </span>
              </div>
              <p className="text-[11px] text-emerald-100/80 leading-snug">
                Runs the Cu-PAN colorimetric chelation model directly on your phone with zero delay.
              </p>
              <button
                onClick={runOnDeviceFallback}
                disabled={isProcessing}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-emerald-200" />
                ⚡ Run On-Device AI Pipeline Now
              </button>
            </div>

            {/* Server URL Configuration toggle */}
            {showServerConfig ? (
              <div className="bg-gray-900/80 border border-white/20 rounded-2xl p-3 space-y-2.5 text-xs">
                <label className="text-[10px] font-mono text-gray-300 block font-semibold">
                  Select or Enter Backend IP:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {DosimeterApiService.getPresetUrls().map((preset) => (
                    <button
                      key={preset}
                      onClick={() => handleSaveCustomServer(preset)}
                      className="px-2 py-1 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-[10px] font-mono text-gray-200"
                    >
                      {preset.replace('https://', '').replace('http://', '').replace(':8000', '')}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={customServerUrl}
                    onChange={(e) => setCustomServerUrl(e.target.value)}
                    placeholder="https://sarvas.onrender.com"
                    className="flex-1 bg-black/60 border border-white/30 rounded-xl p-2 text-xs text-white font-mono"
                  />
                  <button
                    onClick={() => handleSaveCustomServer()}
                    className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold text-xs"
                  >
                    Save & Test
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between text-[11px] px-1 text-gray-400">
                <span className="truncate max-w-[240px]">Server: <code className="text-gray-200 font-mono text-[10px]">{DosimeterApiService.getBaseUrl()}</code></span>
                <button
                  onClick={() => setShowServerConfig(true)}
                  className="text-gray-300 underline flex items-center gap-1 hover:text-white shrink-0"
                >
                  <Settings className="w-3 h-3" /> Change IP
                </button>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2.5 pt-1">
              <button
                onClick={onClose}
                className="flex-1 py-3 bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl text-xs font-semibold text-white transition-all flex items-center justify-center gap-1.5"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={startAnalysis}
                disabled={isProcessing}
                className="flex-1 py-3 bg-white hover:bg-gray-100 text-gray-900 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                Retry Server
              </button>
            </div>
          </div>
        ) : (
          /* Normal Progress State */
          <>
            {/* Scanner Radar Graphic */}
            <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-[#D8D0C2]/20 animate-ping opacity-30"></div>
              <div className="absolute inset-2 rounded-full border border-[#71806B]/40"></div>
              <div className="absolute inset-5 rounded-full border border-dashed border-[#D8D0C2]/30 animate-spin"></div>
              
              <div className="relative z-10 flex flex-col items-center justify-center">
                <span className="text-2xl font-mono font-bold text-white">
                  {progressPercent}%
                </span>
                <span className="text-[9px] font-mono text-[#C9BFAE] uppercase">
                  Analyzing
                </span>
              </div>
            </div>

            {/* Step-by-Step Breakdown matching exact user requirements */}
            <div className="space-y-2.5 pt-1">
              {ANALYSIS_STEPS.map((step) => {
                const isDone = currentStep > step.id;
                const isCurrent = currentStep === step.id;

                return (
                  <div
                    key={step.id}
                    className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                      isCurrent ? 'bg-white/10' : 'opacity-85'
                    }`}
                  >
                    <div className="w-5 h-5 flex items-center justify-center shrink-0">
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-[#5A7456]" />
                      ) : isCurrent ? (
                        <Loader2 className="w-4 h-4 text-[#C9BFAE] animate-spin" />
                      ) : (
                        <div className="w-3 h-3 rounded-full border border-[#878377]" />
                      )}
                    </div>

                    <span
                      className={`text-xs ${
                        isCurrent
                          ? 'text-white font-semibold'
                          : isDone
                          ? 'text-[#C9BFAE]'
                          : 'text-[#878377]'
                      }`}
                    >
                      {step.id}. {step.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Prototype Transparency Notice */}
            <div className="border-t border-white/10 pt-3 text-center">
              <p className="text-[10px] text-[#878377] font-mono">
                SIMULATED / PROTOTYPE READING · Backend Random Forest Model
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
