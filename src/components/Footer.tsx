import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="command-card bg-[var(--card-surface-subtle)] text-[var(--text-primary)] border-t border-[var(--card-border)] py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Grid: 118 Product & RAGEBYTERS Team */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[var(--card-border)]">
          
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-[#DFFF00] to-[#FF9500] rounded-lg p-[1.5px] flex items-center justify-center">
                <div className="w-full h-full bg-[#080A0C] rounded-[6px] flex items-center justify-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#DFFF00]" />
                </div>
              </div>
              <span className="text-base font-bold font-mono tracking-wider text-[var(--text-primary)]">118</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] font-bold border border-[var(--accent-primary)]/30">
                MRPL
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)]">
              Passive exposure intelligence for safer shifts in petroleum operations.
            </p>
          </div>

          {/* RAGEBYTERS SIH 2026 Section */}
          <div className="flex flex-col md:items-end space-y-1">
            <div className="text-sm font-bold font-mono tracking-widest text-[var(--text-primary)]">
              RAGEBYTERS
            </div>
            <div className="text-xs text-[var(--accent-secondary)] font-mono font-semibold">
              SIH 2026 · Hardware × AI × Industrial Safety
            </div>
            <div className="text-[11px] text-[var(--text-secondary)]">
              Built for MRPL Mangalore Refinery operations.
            </div>
          </div>

        </div>

        {/* Bottom Disclaimers */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-[var(--text-secondary)] gap-4">
          <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-[var(--accent-primary)] shrink-0" />
            <span>Prototype calibration dataset & readings are simulated estimates. Chemical validation compliant with factories act section 41F.</span>
          </div>
          <div className="font-mono text-[var(--text-secondary)]">
            © 2026 118 by RAGEBYTERS · SIH 2026
          </div>
        </div>

      </div>
    </footer>
  );
};
