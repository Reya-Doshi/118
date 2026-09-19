import React from 'react';

export const HardwareShowcase: React.FC = () => {
  return (
    <div className="bg-[#292925] text-[#EDE5D6] rounded-2xl p-6 md:p-8 border border-[#3E3C36] relative overflow-hidden">
      
      {/* Header title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#3E3C36] pb-4 mb-8">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-[#C2CBBF] uppercase">Hardware Specifications</span>
          <h3 className="text-xl font-bold tracking-tight text-[#EDE5D6] mt-0.5">
            SARVAS Physical Passive Dosimeter Wristband
          </h3>
        </div>
        <div className="px-3 py-1 rounded bg-[#32322D] border border-[#4A4740] text-[#C2CBBF] text-xs font-mono font-medium">
          Disposable Shift Badge
        </div>
      </div>

      {/* Main Schematic Diagram with Leader Lines */}
      <div className="relative py-6 px-2 max-w-4xl mx-auto">
        
        {/* Horizontal Wristband Graphic */}
        <div className="relative bg-[#32322D] border border-[#43423A] rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-6 z-10">
          
          {/* Badge & SARVAS branding */}
          <div className="relative flex items-center gap-3 p-3 bg-[#20201C] rounded-lg border border-[#383731] w-full md:w-auto">
            <div className="w-2.5 h-8 bg-[#4F5D4B] rounded-xs" />
            <div>
              <div className="text-sm font-bold tracking-widest font-mono text-[#EDE5D6]">SARVAS</div>
              <div className="text-[10px] text-[#A69F91] font-mono">ID: DS-1088</div>
            </div>
            <div className="w-2 h-2 rounded-full bg-[#71806B] ml-2" />
          </div>

          {/* Sensing Strip */}
          <div className="relative p-3 bg-[#20201C] rounded-lg border border-[#383731] flex flex-col items-center">
            <div className="text-[9px] text-[#A69F91] uppercase font-mono mb-1">Chemical Cell</div>
            <div className="w-24 h-10 rounded border border-white/15 bg-[#8c6d48] shadow-inner relative flex items-center justify-center">
              <div className="w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>
          </div>

          {/* Reference Scale */}
          <div className="relative p-3 bg-[#20201C] rounded-lg border border-[#383731] flex flex-col items-center">
            <div className="text-[9px] text-[#A69F91] uppercase font-mono mb-1">Calibration Reference</div>
            <div className="flex items-center gap-1.5">
              {[
                { label: 'A1', hex: '#d4c5a9' },
                { label: 'A2', hex: '#b59b75' },
                { label: 'A3', hex: '#8c6d48' },
                { label: 'A4', hex: '#5d4533' },
                { label: 'A5', hex: '#3a2e2b' }
              ].map(s => (
                <div key={s.label} className="flex flex-col items-center">
                  <div className="w-4 h-7 rounded-xs border border-white/15" style={{ backgroundColor: s.hex }} />
                  <span className="text-[9px] font-mono text-[#8E897E] mt-1">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Expiry Tag */}
          <div className="relative p-3 bg-[#20201C] rounded-lg border border-[#383731] flex flex-col items-center w-full md:w-auto">
            <div className="text-[9px] text-[#A69F91] uppercase font-mono mb-1">Shelf-Life</div>
            <div className="px-3 py-1 rounded bg-[#20201C] border border-[#4F5D4B] text-[#C2CBBF] text-xs font-mono font-bold">
              VALID
            </div>
          </div>

        </div>

        {/* Feature Leader Line Annotations */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-3 bg-[#20201C] rounded-lg border-l-2 border-[#71806B] text-xs">
            <div className="font-bold text-[#EDE5D6] mb-0.5">Badge ID & Worker Associate</div>
            <div className="text-[#A69F91] text-[11px]">Unique serial number linked directly to shift logs and worker profile.</div>
          </div>

          <div className="p-3 bg-[#20201C] rounded-lg border-l-2 border-[#8c6d48] text-xs">
            <div className="font-bold text-[#EDE5D6] mb-0.5">Cumulative H₂S Sensing Strip</div>
            <div className="text-[#A69F91] text-[11px]">Chemical dye matrix darkens progressively upon exposure to hydrogen sulfide.</div>
          </div>

          <div className="p-3 bg-[#20201C] rounded-lg border-l-2 border-[#B08A55] text-xs">
            <div className="font-bold text-[#EDE5D6] mb-0.5">Printed Calibration Reference</div>
            <div className="text-[#A69F91] text-[11px]">Printed beside the strip to allow lighting-compensated color correction.</div>
          </div>

          <div className="p-3 bg-[#20201C] rounded-lg border-l-2 border-[#71806B] text-xs">
            <div className="font-bold text-[#EDE5D6] mb-0.5">Independent Expiry Indicator</div>
            <div className="text-[#A69F91] text-[11px]">Chemical shelf-life indicator prevents invalid analysis of aged dosimeters.</div>
          </div>
        </div>

      </div>

    </div>
  );
};
