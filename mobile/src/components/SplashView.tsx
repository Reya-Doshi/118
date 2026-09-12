import React, { useEffect } from 'react';
import { ShieldCheck, Activity } from 'lucide-react';

interface SplashViewProps {
  onComplete: () => void;
}

export const SplashView: React.FC<SplashViewProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 1800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div 
      onClick={onComplete}
      className="fixed inset-0 bg-[#F6F1E7] z-50 flex flex-col justify-between items-center py-16 px-6 cursor-pointer"
    >
      <div className="w-full text-center pt-8">
        <span className="text-[11px] font-mono tracking-widest text-[#878377] uppercase">
          SIH 2026 Prototype
        </span>
      </div>

      <div className="flex flex-col items-center text-center max-w-xs">
        <div className="w-20 h-20 bg-[#292925] rounded-2xl flex items-center justify-center shadow-md mb-6 relative">
          <ShieldCheck className="w-10 h-10 text-[#F6F1E7]" strokeWidth={1.5} />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#71806B] flex items-center justify-center border-2 border-[#F6F1E7]">
            <Activity className="w-3 h-3 text-white" />
          </div>
        </div>

        <h1 className="text-3xl font-serif font-bold text-[#292925] tracking-tight mb-2">
          SARVAS
        </h1>
        <p className="text-xs text-[#5D5B53] font-medium uppercase tracking-wider mb-3">
          Intelligent Cumulative H₂S Dosimetry
        </p>

        <div className="w-24 h-0.5 bg-[#D8D0C2] my-2"></div>
        <p className="text-[13px] text-[#71806B] font-medium italic leading-relaxed">
          "Because not all danger announces itself."
        </p>
      </div>

      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2 text-xs text-[#878377] font-mono">
          <span className="w-2 h-2 rounded-full bg-[#71806B] animate-pulse"></span>
          <span>CALIBRATION READY</span>
        </div>
        <span className="text-[10px] text-[#A69F91]">Tap anywhere to enter</span>
      </div>
    </div>
  );
};
