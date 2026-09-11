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
      clearInterval(stepTimer);
      if (!isMounted.current) return;

      const message = err?.message || 'Unexpected analysis failure.';
      const kind = err instanceof DosimeterApiError ? err.kind : 'SERVER_ERROR';
      setErrorState(message);
      setErrorKind(kind);
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

  const handleSaveCustomServer = () => {
    if (customServerUrl) {
      localStorage.setItem('RAGEB8_BACKEND_URL', customServerUrl.trim());
      setShowServerConfig(false);
      startAnalysis();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#292925]/95 backdrop-blur-sm flex flex-col justify-center items-center p-5 max-w-md mx-auto text-[#F6F1E7]">
      <div className="w-full bg-[#292925] border border-[#D8D0C2]/30 rounded-2xl p-6 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Title */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#71806B]/25 border border-[#71806B]/40 text-[#EDE5D6] text-[11px] font-mono mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#C9BFAE]" />
            Backend API · POST /api/analyze-wristband
          </div>
          <h3 className="text-xl font-serif font-bold text-[#F6F1E7]">
            {errorState ? 'Analysis Disrupted' : 'Analyzing Wristband'}
          </h3>
          <p className="text-xs text-[#C9BFAE]">
            {errorState 
              ? 'Error encountered during reading pipeline' 
              : 'Gemini Vision QA → OpenCV Colorimetric Engine → ML Regressor'}
          </p>
        </div>

        {/* Error State Display */}
        {errorState ? (
          <div className="space-y-4 py-2">
            <div className="bg-[#9A6258]/20 border border-[#9A6258] rounded-xl p-4 text-[#F6E2DF] space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-sm text-[#F6E2DF]">
                {errorKind === 'NETWORK_UNAVAILABLE' ? (
                  <WifiOff className="w-5 h-5 text-[#E5A8A0] shrink-0" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-[#E5A8A0] shrink-0" />
                )}
                <span>
                  {errorKind === 'NETWORK_UNAVAILABLE' && 'Backend Server Offline'}
                  {errorKind === 'TIMEOUT' && 'Connection Timed Out'}
                  {errorKind === 'INVALID_IMAGE' && 'Unreadable Image'}
                  {errorKind === 'SERVER_ERROR' && 'API Processing Error'}
                  {!errorKind && 'Analysis Error'}
                </span>
              </div>
              <p className="text-[11px] leading-relaxed text-[#F6E2DF]/90">
                {errorState}
              </p>
              
              {errorKind === 'NETWORK_UNAVAILABLE' && (
                <div className="pt-2 border-t border-[#9A6258]/50 text-[10px] text-[#EDE5D6]/80 font-mono">
                  Tip: Make sure the FastAPI backend is running via <code className="text-white bg-black/40 px-1 py-0.5 rounded">npm run backend:dev</code> on port 8000.
                </div>
              )}
            </div>

            {/* Server URL Configuration toggle (useful when testing on physical phone) */}
            {showServerConfig ? (
              <div className="bg-[#1a1a17] border border-white/20 rounded-xl p-3 space-y-2 text-xs">
                <label className="text-[10px] font-mono text-[#C9BFAE] block">
                  Custom Backend Server URL:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customServerUrl}
                    onChange={(e) => setCustomServerUrl(e.target.value)}
                    placeholder="http://192.168.x.x:8000"
                    className="flex-1 bg-black/40 border border-white/30 rounded-lg p-2 text-xs text-white font-mono"
                  />
                  <button
                    onClick={handleSaveCustomServer}
                    className="px-3 py-2 bg-[#5A7456] text-white rounded-lg font-semibold text-xs"
                  >
                    Save & Retry
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between text-[11px] px-1 text-[#C9BFAE]">
                <span>Active Server: <code className="text-white font-mono">{DosimeterApiService.getBaseUrl()}</code></span>
                <button
                  onClick={() => setShowServerConfig(true)}
                  className="text-[#EDE5D6] underline flex items-center gap-1 hover:text-white"
                >
                  <Settings className="w-3 h-3" /> Change
                </button>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2.5 pt-2">
              <button
                onClick={onClose}
                className="flex-1 py-3 bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl text-xs font-semibold text-white transition-all flex items-center justify-center gap-1.5"
              >
                <X className="w-4 h-4" />
                Cancel & Retake
              </button>
              <button
                onClick={startAnalysis}
                disabled={isProcessing}
                className="flex-1 py-3 bg-[#EDE5D6] hover:bg-white text-[#292925] rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                Retry Analysis
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
