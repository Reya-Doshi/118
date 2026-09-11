import React, { useState, useEffect } from 'react';
import { CheckCircle2, Loader2, Sparkles, ShieldAlert } from 'lucide-react';

interface AnalysisSequenceModalProps {
  isOpen: boolean;
  onAnalysisComplete: () => void;
}

const ANALYSIS_STEPS = [
  { id: 1, label: 'Detecting wristband outline' },
  { id: 2, label: 'Locating printed reference scale' },
  { id: 3, label: 'Sampling colorimetric strip response' },
  { id: 4, label: 'Correcting ambient illumination' },
  { id: 5, label: 'Estimating cumulative exposure' }
];

export const AnalysisSequenceModal: React.FC<AnalysisSequenceModalProps> = ({
  isOpen,
  onAnalysisComplete
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [progressPercent, setProgressPercent] = useState(15);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1);
      setProgressPercent(15);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < 5) {
          const next = prev + 1;
          setProgressPercent(Math.round((next / 5) * 100));
          return next;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            onAnalysisComplete();
          }, 600);
          return prev;
        }
      });
    }, 650);

    return () => clearInterval(interval);
  }, [isOpen, onAnalysisComplete]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#292925]/90 backdrop-blur-xs flex flex-col justify-center items-center p-6 max-w-md mx-auto text-[#F6F1E7]">
      <div className="w-full bg-[#292925] border border-[#D8D0C2]/30 rounded-2xl p-6 shadow-2xl space-y-6">
        {/* Header Title */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#71806B]/20 border border-[#71806B]/40 text-[#EDE5D6] text-[11px] font-mono mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#C9BFAE]" />
            AI-Assisted Colorimetric Analysis
          </div>
          <h3 className="text-xl font-serif font-bold text-[#F6F1E7]">
            Analyzing Wristband
          </h3>
          <p className="text-xs text-[#C9BFAE]">
            Simulated colorimetric compensation in progress
          </p>
        </div>

        {/* Scanner Radar Graphic */}
        <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
          {/* Outer circle */}
          <div className="absolute inset-0 rounded-full border border-[#D8D0C2]/20 animate-ping opacity-30"></div>
          <div className="absolute inset-2 rounded-full border border-[#71806B]/40"></div>
          <div className="absolute inset-5 rounded-full border border-dashed border-[#D8D0C2]/30 animate-spin"></div>
          
          <div className="relative z-10 flex flex-col items-center justify-center">
            <span className="text-2xl font-mono font-bold text-white">
              {progressPercent}%
            </span>
            <span className="text-[9px] font-mono text-[#C9BFAE] uppercase">
              Pipeline
            </span>
          </div>
        </div>

        {/* Step by Step Breakdown */}
        <div className="space-y-3 pt-2">
          {ANALYSIS_STEPS.map((step) => {
            const isDone = currentStep > step.id;
            const isCurrent = currentStep === step.id;

            return (
              <div
                key={step.id}
                className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                  isCurrent ? 'bg-white/10' : 'opacity-80'
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
                      ? 'text-white font-medium'
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

        {/* Honest Prototype Notice */}
        <div className="border-t border-white/10 pt-3 text-center">
          <p className="text-[10px] text-[#878377] font-mono">
            Reads physical color response · Not direct gas sensing
          </p>
        </div>
      </div>
    </div>
  );
};
