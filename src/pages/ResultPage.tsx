import React from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/StatusBadge';
import { ArrowLeft, Save, RefreshCw, Clock, User, Award, ShieldAlert, Cpu } from 'lucide-react';

export const ResultPage: React.FC = () => {
  const { latestReading, saveReading, setActivePage } = useApp();

  if (!latestReading) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-4">
        <h2 className="text-xl font-bold text-[#191c1a]">No Active Reading Found</h2>
        <p className="text-xs text-[#575e59]">Please capture or analyze a dosimeter wristband first.</p>
        <button
          onClick={() => setActivePage('scan')}
          className="px-4 py-2 bg-[#191c1a] text-white text-xs font-bold rounded-lg"
        >
          Go to Scanner
        </button>
      </div>
    );
  }

  const {
    dosePpmH,
    status,
    workerName,
    workerId,
    badgeId,
    sampleId,
    shift,
    timeAgo,
    confidenceScore,
    location,
    tempC,
    humidityPercent,
    stripColorHex,
    lab,
    rawColorString,
    rawDeltaE,
    compensatedDeltaE,
    shelfAge,
    expiryStatus,
    actionFlag,
    tempCompensationFactor,
    humidityCompensationFactor
  } = latestReading;

  // Visual marker position across 0 to 160 ppm·h scale
  let markerPercent = 50;
  if (dosePpmH <= 15) {
    markerPercent = (dosePpmH / 15) * 30;
  } else if (dosePpmH <= 50) {
    markerPercent = 30 + ((dosePpmH - 15) / 35) * 35;
  } else {
    markerPercent = Math.min(100, 65 + ((dosePpmH - 50) / 110) * 35);
  }

  const handleSave = () => {
    saveReading(latestReading);
    setActivePage('dashboard');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      
      {/* Top Back Nav & Notice */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActivePage('scan')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#292925]/70 hover:text-[#292925] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Scanner</span>
        </button>

        <span className="px-2.5 py-0.5 rounded-full bg-[#B08A55]/15 border border-[#B08A55]/35 text-[#292925] text-[10px] font-mono font-bold uppercase tracking-wider">
          Prototype / Simulated Reading
        </span>
      </div>

      {/* RESULT MAIN HERO CARD */}
      <div className="bg-[#EDE5D6]/30 rounded-2xl border border-[#D8D0C2] p-6 md:p-8 shadow-sm space-y-8">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#D8D0C2] pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono tracking-widest text-[#292925]/60 uppercase">
                AI-Assisted Colorimetric Reading
              </span>
              {sampleId && (
                <span className="px-2 py-0.5 rounded bg-[#EDE5D6] border border-[#D8D0C2] font-mono text-[10px] text-[#292925] font-bold">
                  {sampleId}
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#292925] mt-0.5">Exposure Reading</h1>
          </div>
          <StatusBadge status={status} size="lg" />
        </div>

        {/* Big Dose Output Display */}
        <div className="text-center space-y-2 py-5 bg-[#F6F1E7] rounded-xl border border-[#D8D0C2]">
          <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#292925]/70">
            CUMULATIVE EXPOSURE ESTIMATE
          </span>
          <div className="flex items-center justify-center gap-3">
            <div
              className="w-6 h-6 rounded-full border border-black/20 shadow-xs"
              style={{ backgroundColor: stripColorHex }}
              title="Detected Strip Color"
            />
            <div className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-mono tracking-tight text-[#292925]">
              {dosePpmH.toFixed(1)} <span className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#292925]/70">ppm·h</span>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-mono pt-1">
            <span className="text-[#4F5D4B] font-semibold">
              Action Flag: <strong>{actionFlag || status}</strong>
            </span>
            <span>•</span>
            <span className="text-[#292925]/70">
              Algorithm Confidence: <strong>{confidenceScore}%</strong>
            </span>
          </div>
        </div>

        {/* HORIZONTAL RANGE SCALE (0 to 160 ppm·h) */}
        <div className="space-y-3 px-1 sm:px-2">
          <div className="flex justify-between text-[10px] sm:text-xs font-bold font-mono">
            <span className="text-[#71806B]">SAFE (0 - 15)</span>
            <span className="text-[#B08A55]">ACTION (15 - 50)</span>
            <span className="text-[#9A6258]">PEL (&gt; 50)</span>
          </div>

          <div className="relative h-4 rounded-full bg-gradient-to-r from-[#71806B]/30 via-[#B08A55]/30 to-[#9A6258]/30 border border-[#D8D0C2] overflow-visible">
            <div className="absolute left-[30%] top-0 bottom-0 w-0.5 bg-[#292925]/20" />
            <div className="absolute left-[65%] top-0 bottom-0 w-0.5 bg-[#292925]/20" />

            {/* Marker Indicator */}
            <div
              className="absolute -top-2.5 -ml-3 flex flex-col items-center transition-all duration-500"
              style={{ left: `${markerPercent}%` }}
            >
              <div className="w-6 h-6 rounded-full bg-[#292925] border-2 border-[#F6F1E7] shadow-lg flex items-center justify-center text-[#F6F1E7] text-[10px] font-bold">
                ▼
              </div>
            </div>
          </div>

          <div className="text-[11px] text-[#292925]/60 font-medium text-center pt-1">
            Calculated dosimeter position: <strong className="text-[#292925] font-mono">{markerPercent.toFixed(0)}% scale</strong>
          </div>
        </div>

        {/* SIMULATED COLORIMETRIC & LAB DATA GRID */}
        <div className="bg-[#F6F1E7] p-4 rounded-xl border border-[#D8D0C2] space-y-3">
          <div className="flex items-center justify-between border-b border-[#D8D0C2] pb-2">
            <span className="text-xs font-bold text-[#292925] flex items-center gap-1.5 uppercase font-mono">
              <Cpu className="w-3.5 h-3.5 text-[#4F5D4B]" />
              Colorimetric Extraction & Environmental Compensation
            </span>
            <span className="text-[10px] font-mono text-[#292925]/60">Simulated Calibration</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div>
              <span className="text-[10px] text-[#292925]/60 block">Raw L*, a*, b*</span>
              <span className="font-bold text-[#292925]">{rawColorString || (lab ? `${lab.L}, ${lab.a}, ${lab.b}` : 'N/A')}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#292925]/60 block">Reference ΔEab*</span>
              <span className="font-bold text-[#4F5D4B]">{rawDeltaE !== undefined ? rawDeltaE.toFixed(1) : '35.8'}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#292925]/60 block">Compensated ΔE</span>
              <span className="font-bold text-[#292925]">{compensatedDeltaE !== undefined ? compensatedDeltaE.toFixed(1) : '34.2'}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#292925]/60 block">Badge Shelf Age</span>
              <span className="font-bold text-[#292925]">{shelfAge ? `${shelfAge} Days` : '45 Days'}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono pt-2 border-t border-[#D8D0C2]">
            <div>
              <span className="text-[10px] text-[#292925]/60 block">Ambient Temp</span>
              <span className="font-semibold text-[#292925]/80">{tempC}°C ({tempCompensationFactor ? `${tempCompensationFactor}x` : '1.02x'})</span>
            </div>
            <div>
              <span className="text-[10px] text-[#292925]/60 block">Ambient RH</span>
              <span className="font-semibold text-[#292925]/80">{humidityPercent}% ({humidityCompensationFactor ? `${humidityCompensationFactor}x` : '1.03x'})</span>
            </div>
            <div>
              <span className="text-[10px] text-[#292925]/60 block">Expiry Indicator</span>
              <span className={`font-bold ${expiryStatus === 'EXPIRED' ? 'text-[#9A6258]' : 'text-[#4F5D4B]'}`}>
                {expiryStatus || 'Fresh (Active)'}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[#292925]/60 block">Classification</span>
              <span className="font-bold text-[#292925] truncate block">{actionFlag || 'Normal / Safe'}</span>
            </div>
          </div>
        </div>

        {/* WORKER & FACILITY DETAILS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-[#D8D0C2]">
          <div className="p-3 rounded-lg bg-[#F6F1E7] border border-[#D8D0C2] space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-[#292925]/70 font-medium">
              <User className="w-3.5 h-3.5 text-[#4F5D4B]" />
              <span>Assigned Worker</span>
            </div>
            <div className="text-sm font-bold text-[#292925]">{workerName}</div>
            <div className="text-[10px] font-mono text-[#292925]/60">{workerId}</div>
          </div>

          <div className="p-3 rounded-lg bg-[#F6F1E7] border border-[#D8D0C2] space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-[#292925]/70 font-medium">
              <Award className="w-3.5 h-3.5 text-[#4F5D4B]" />
              <span>Badge / Sample ID</span>
            </div>
            <div className="text-sm font-mono font-bold text-[#292925]">{badgeId}</div>
            <div className="text-[10px] text-[#292925]/60">{location}</div>
          </div>

          <div className="p-3 rounded-lg bg-[#F6F1E7] border border-[#D8D0C2] space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-[#292925]/70 font-medium">
              <Clock className="w-3.5 h-3.5 text-[#4F5D4B]" />
              <span>Shift & Timestamp</span>
            </div>
            <div className="text-sm font-bold text-[#292925]">{shift.split('·')[0]}</div>
            <div className="text-[10px] font-mono text-[#292925]/60">{timeAgo}</div>
          </div>
        </div>

        {/* DISCLAIMER NOTICE */}
        <div className="p-3 rounded-lg bg-[#B08A55]/15 border border-[#B08A55]/35 text-[#292925] text-[11px] leading-relaxed flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-[#B08A55] shrink-0 mt-0.5" />
          <span>
            <strong>Simulated Calibration Data:</strong> Cumulative exposure is an AI-assisted estimate derived from the synthetic 120-row calibration dataset. Requires laboratory validation before operational deployment.
          </span>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-[#D8D0C2]">
          <button
            onClick={() => setActivePage('scan')}
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#F6F1E7] border border-[#D8D0C2] text-[#292925] text-xs font-semibold tracking-wide hover:bg-[#EDE5D6] transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Scan Another Sample</span>
          </button>

          <button
            onClick={handleSave}
            className="w-full sm:w-auto px-8 py-2.5 rounded-lg bg-[#4F5D4B] text-[#F6F1E7] text-xs font-semibold tracking-wide hover:bg-[#3d493a] transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5 text-[#F6F1E7]" />
            <span>Save Reading</span>
          </button>
        </div>

      </div>

    </div>
  );
};
