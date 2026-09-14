import React from 'react';

interface WristbandPreviewProps {
  stripColorHex?: string;
  badgeId?: string;
  expiryStatus?: string;
  interactive?: boolean;
  className?: string;
  showLabels?: boolean;
}

export const WristbandPreview: React.FC<WristbandPreviewProps> = ({
  stripColorHex = '#8c6d48',
  badgeId = 'DS-1088',
  expiryStatus = 'VALID',
  className = '',
  showLabels = false
}) => {
  return (
    <div className={`relative command-card text-[var(--text-primary)] rounded-2xl p-4 border border-[var(--card-border)] overflow-hidden select-none ${className}`}>
      {/* Wristband Container */}
      <div className="relative flex flex-col md:flex-row items-center justify-between gap-4 p-3.5 rounded-xl command-card border border-[var(--card-border)] bg-[var(--card-surface-subtle)]">
        
        {/* Brand & Badge ID section */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2">
            <div className="w-2 h-6 bg-[var(--accent-primary)] rounded-xs" />
            <div>
              <div className="text-xs font-bold tracking-widest text-[var(--text-primary)] font-mono">118</div>
              <div className="text-[9px] text-[var(--text-secondary)] font-mono">DOSIMETER</div>
            </div>
          </div>
          <div className="px-2 py-0.5 rounded-full command-card border border-[var(--card-border)] text-[var(--accent-secondary)] text-[10px] font-mono font-bold tracking-wider">
            {badgeId}
          </div>
        </div>

        {/* Chemical Sensing Strip & Reference Scale */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-center command-card p-2.5 rounded-xl border border-[var(--card-border)]">
          
          {/* Active Sensing Strip */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-[9px] text-[var(--text-secondary)] uppercase tracking-wider font-mono">Sensing Strip</span>
            <div
              className="w-16 h-8 rounded border border-white/20 shadow-inner transition-colors duration-500 relative flex items-center justify-center overflow-hidden"
              style={{ backgroundColor: stripColorHex }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-black/25 pointer-events-none rounded" />
            </div>
          </div>

          {/* Divider */}
          <div className="w-px h-9 bg-[var(--card-border)]" />

          {/* Reference Scale */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-[9px] text-[var(--text-secondary)] uppercase tracking-wider font-mono">Reference Scale</span>
            <div className="flex items-center gap-1">
              {[
                { code: 'A1', hex: '#d4c5a9' },
                { code: 'A2', hex: '#b59b75' },
                { code: 'A3', hex: '#8c6d48' },
                { code: 'A4', hex: '#5d4533' },
                { code: 'A5', hex: '#3a2e2b' }
              ].map(item => (
                <div key={item.code} className="flex flex-col items-center">
                  <div
                    className="w-3.5 h-6 rounded-xs border border-white/20 shadow-xs"
                    style={{ backgroundColor: item.hex }}
                  />
                  <span className="text-[8px] text-[var(--text-secondary)] font-mono mt-0.5">{item.code}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Expiry Tag */}
        <div className="flex items-center justify-end w-full md:w-auto">
          <div className="flex flex-col items-end">
            <span className="text-[8px] text-[var(--text-secondary)] uppercase tracking-wider font-mono">Expiry Indicator</span>
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[var(--accent-primary)]/15 border border-[var(--accent-primary)]/40 text-[var(--accent-primary)] text-[10px] font-mono font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#DFFF00] animate-pulse" />
              {expiryStatus}
            </div>
          </div>
        </div>

      </div>

      {showLabels && (
        <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2 text-center border-t border-[var(--card-border)] pt-3 text-[11px] text-[var(--text-secondary)] font-mono">
          <div>
            <span className="text-[var(--text-primary)] font-bold">Strip:</span> Reacts to cumulative H₂S
          </div>
          <div>
            <span className="text-[var(--text-primary)] font-bold">Scale:</span> Optical reference
          </div>
          <div>
            <span className="text-[var(--text-primary)] font-bold">Expiry:</span> Shelf-life validation
          </div>
          <div>
            <span className="text-[var(--text-primary)] font-bold">Badge ID:</span> Worker & shift tracking
          </div>
        </div>
      )}
    </div>
  );
};
