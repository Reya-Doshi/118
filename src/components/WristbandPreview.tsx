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
    <div className={`relative bg-[#292925] text-[#EDE5D6] rounded-xl p-4 border border-[#3E3C36] overflow-hidden select-none ${className}`}>
      {/* Wristband Container */}
      <div className="relative flex flex-col md:flex-row items-center justify-between gap-4 p-3 rounded-lg bg-[#32322D] border border-[#43423A]">
        
        {/* Brand & Badge ID section */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2">
            <div className="w-2 h-6 bg-[#4F5D4B] rounded-xs" />
            <div>
              <div className="text-xs font-bold tracking-widest text-[#EDE5D6] font-mono">SARVAS</div>
              <div className="text-[9px] text-[#A69F91] font-mono">DOSIMETER</div>
            </div>
          </div>
          <div className="px-2 py-0.5 rounded bg-[#20201C] border border-[#4A4740] text-[#B08A55] text-[10px] font-mono font-bold tracking-wider">
            {badgeId}
          </div>
        </div>

        {/* Chemical Sensing Strip & Reference Scale */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-center bg-[#20201C] p-2.5 rounded border border-[#383731]">
          
          {/* Active Sensing Strip */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-[9px] text-[#A69F91] uppercase tracking-wider font-mono">Sensing Strip</span>
            <div
              className="w-16 h-8 rounded border border-white/15 shadow-inner transition-colors duration-500 relative flex items-center justify-center"
              style={{ backgroundColor: stripColorHex }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-black/20 pointer-events-none rounded" />
            </div>
          </div>

          {/* Divider */}
          <div className="w-px h-9 bg-[#3E3C36]" />

          {/* Reference Scale */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-[9px] text-[#A69F91] uppercase tracking-wider font-mono">Reference Scale</span>
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
                    className="w-3.5 h-6 rounded-xs border border-white/15"
                    style={{ backgroundColor: item.hex }}
                  />
                  <span className="text-[8px] text-[#8E897E] font-mono mt-0.5">{item.code}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Expiry Tag */}
        <div className="flex items-center justify-end w-full md:w-auto">
          <div className="flex flex-col items-end">
            <span className="text-[8px] text-[#A69F91] uppercase tracking-wider font-mono">Expiry Indicator</span>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#20201C] border border-[#4F5D4B] text-[#C2CBBF] text-[10px] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#71806B]" />
              {expiryStatus}
            </div>
          </div>
        </div>

      </div>

      {showLabels && (
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-center border-t border-[#3E3C36] pt-3 text-[11px] text-[#A69F91]">
          <div>
            <span className="text-[#C2CBBF] font-semibold">Strip:</span> Reacts to cumulative H₂S
          </div>
          <div>
            <span className="text-[#C2CBBF] font-semibold">Scale:</span> Optical reference
          </div>
          <div>
            <span className="text-[#C2CBBF] font-semibold">Expiry:</span> Shelf-life validation
          </div>
          <div>
            <span className="text-[#C2CBBF] font-semibold">Badge ID:</span> Worker & shift tracking
          </div>
        </div>
      )}
    </div>
  );
};
