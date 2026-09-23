import React from 'react';
import { useApp } from '../context/AppContext';
import type { PageView } from '../types';
import { Info, Database, Scan, Sparkles, Clock, FileCheck2, BookOpen } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActivePage } = useApp();

  const handleNav = (page: PageView) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#292925] text-[#EDE5D6] border-t border-[#3E3C36] py-14 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Grid: 118 Product & RAGEBYTERS Team */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[#3E3C36]">
          
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <img 
                src="/sarvas_logo_v2.png" 
                alt="SARVAS Logo" 
                className="w-7 h-7 rounded-lg object-contain bg-white p-0.5 border border-white/20 shadow-xs"
              />
              <span className="text-base font-bold font-mono tracking-wider text-white">SARVAS</span>
            </div>
            <p className="text-xs text-[#B8B2A4]">Passive exposure intelligence for safer shifts in petroleum operations.</p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <button
              onClick={() => handleNav('overview')}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[#F6F1E7] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#B08A55]" />
              <span>Project Dossier</span>
            </button>
            <button
              onClick={() => handleNav('calibration')}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[#F6F1E7] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>303 Calibration</span>
            </button>
            <button
              onClick={() => handleNav('scan')}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[#F6F1E7] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Scan className="w-3.5 h-3.5 text-sky-400" />
              <span>Scanner</span>
            </button>
            <button
              onClick={() => handleNav('kiosk')}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[#F6F1E7] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Kiosk</span>
            </button>
            <button
              onClick={() => handleNav('explainability')}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[#F6F1E7] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              <span>ML Pipeline</span>
            </button>
            <button
              onClick={() => handleNav('faq')}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[#F6F1E7] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <FileCheck2 className="w-3.5 h-3.5 text-[#C2CBBF]" />
              <span>FAQ</span>
            </button>
            <button
              onClick={() => handleNav('references')}
              className="px-2.5 py-1 rounded-lg bg-[#4F5D4B] hover:bg-[#3D493A] text-white transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs font-bold"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-300" />
              <span>Reference Links</span>
            </button>
          </div>

          {/* SARVAS Technology Section */}
          <div className="flex flex-col md:items-end space-y-1">
            <div className="text-sm font-bold font-mono tracking-widest text-white">
              SARVAS Dosimeter
            </div>
            <div className="text-xs text-[#C2CBBF] font-mono">
              Hardware × AI × Worker Safety
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
            <span>Calibrated across a 303-point controlled empirical matrix; ongoing field validation designed for industrial toxic gas exposure test chambers.</span>
          </div>
          <div className="font-mono text-[#B8B2A4] text-right">
            © 2026 SARVAS • Made by <a href="https://github.com/Nxyen-labs" target="_blank" rel="noopener noreferrer" className="text-white hover:underline font-semibold">Nxyen Labs</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
