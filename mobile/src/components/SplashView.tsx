import React, { useEffect } from 'react';

interface SplashViewProps {
  onComplete: () => void;
}

export const SplashView: React.FC<SplashViewProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2400);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div 
      onClick={onComplete}
      className="fixed inset-0 bg-[#F6F1E7] z-50 flex flex-col justify-between items-center py-10 px-6 cursor-pointer select-none"
    >
      <div className="w-full text-center pt-4">
        <span className="text-[11px] font-mono tracking-widest text-[#71806B] font-semibold uppercase bg-[#EDE5D6] border border-[#D8D0C2] px-3.5 py-1.5 rounded-full shadow-2xs">
          SIH 2026 · Problem Statement 118
        </span>
      </div>

      <div className="flex flex-col items-center text-center max-w-sm my-auto">
        <div className="relative overflow-hidden rounded-3xl shadow-md border border-[#D8D0C2] bg-[#F6F1E7] p-2 mb-3">
          <img 
            src="/sarvas_splash.jpg" 
            alt="SARVAS - Because not all danger announces itself."
            className="w-72 h-auto max-w-full object-contain rounded-2xl" 
          />
        </div>
        <p className="text-xs text-[#5D5B53] font-mono tracking-wider uppercase font-semibold">
          Zero-Power Cumulative H₂S Dosimetry
        </p>
      </div>

      <div className="flex flex-col items-center gap-2 pb-4">
        <div className="flex items-center gap-2 text-xs text-[#71806B] font-mono">
          <span className="w-2 h-2 rounded-full bg-[#71806B] animate-pulse"></span>
          <span className="font-semibold tracking-wider">SYSTEM CALIBRATION READY</span>
        </div>
        <span className="text-[11px] text-[#878377] font-medium">Tap anywhere to enter</span>
      </div>
    </div>
  );
};
