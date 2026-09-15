import React from 'react';
import { Info } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#292925] text-[#EDE5D6] border-t border-[#3E3C36] py-14 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Grid: 118 Product & RAGEBYTERS Team */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[#3E3C36]">
          
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <img 
                src="/sarvas_icon.png" 
                alt="SARVAS Logo" 
                className="w-7 h-7 rounded-lg object-contain bg-[#FAF8F5] p-0.5 border border-white/20 shadow-xs"
              />
              <span className="text-base font-bold font-mono tracking-wider text-white">SARVAS</span>
            </div>
            <p className="text-xs text-[#B8B2A4]">Passive exposure intelligence for safer shifts in petroleum operations.</p>
          </div>

          {/* RAGEBYTERS SIH 2026 Section */}
          <div className="flex flex-col md:items-end space-y-1">
            <div className="text-sm font-bold font-mono tracking-widest text-white">
              RAGEBYTERS
            </div>
            <div className="text-xs text-[#C2CBBF] font-mono">
              SIH 2026 · Hardware × AI × Safety
            </div>
            <div className="text-[11px] text-[#8E897E]">
              Built for safer industrial workplaces.
            </div>
          </div>

        </div>

        {/* Bottom Disclaimers */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#8E897E] gap-4">
          <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-[#B8B2A4] shrink-0" />
            <span>Prototype calibration dataset & readings are simulated estimates. Chemical validation required in a certified laboratory.</span>
          </div>
          <div className="font-mono text-[#B8B2A4]">
            © 2026 118 by RAGEBYTERS · SIH 2026
          </div>
        </div>

      </div>
    </footer>
  );
};
