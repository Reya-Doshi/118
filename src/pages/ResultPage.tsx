import React from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/StatusBadge';
import { ArrowLeft, Save, RefreshCw, Clock, User, Award, ShieldAlert, Cpu } from 'lucide-react';

export const ResultPage: React.FC = () => {
  const { latestReading, saveReading, setActivePage } = useApp();

  if (!latestReading) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-4">
        <h2 className="text-xl font-bold font-heading text-[var(--text-primary)]">No Active Reading Found</h2>
        <p className="text-xs text-[var(--text-secondary)]">Please capture or analyze a dosimeter wristband first.</p>
        <button
          onClick={() => setActivePage('scan')}
          className="px-5 py-2.5 bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-black text-xs font-mono font-bold rounded-full cursor-pointer shadow-md"
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

  const isOutOfCal = status === 'OUT_OF_CALIBRATION';

  // Visual marker position across 0 to 30 ppm·h Cu-PAN scale
  let markerPercent = 50;
  if (isOutOfCal) {
    markerPercent = 0;
  } else if (dosePpmH <= 0.5) {
    markerPercent = (dosePpmH / 0.5) * 20; // 0 - 20%
  } else if (dosePpmH <= 1.0) {
    markerPercent = 20 + ((dosePpmH - 0.5) / 0.5) * 20; // 20 - 40%
  } else if (dosePpmH <= 2.0) {
    markerPercent = 40 + ((dosePpmH - 1.0) / 1.0) * 20; // 40 - 60%
  } else if (dosePpmH <= 10.0) {
    markerPercent = 60 + ((dosePpmH - 2.0) / 8.0) * 20; // 60 - 80%
  } else {
    markerPercent = Math.min(100, 80 + ((dosePpmH - 10.0) / 20.0) * 20); // 80 - 100%
  }

  const handleSave = () => {
    saveReading(latestReading);
    setActivePage('dashboard');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16 text-[var(--text-primary)]">
      
      {/* Top Back Nav & Notice */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActivePage('scan')}
          className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Scanner</span>
        </button>

        <span className="px-3 py-1 rounded-full bg-[var(--accent-primary)]/15 border border-[var(--accent-primary)]/30 text-[var(--accent-primary)] text-[10.5px] font-mono font-bold uppercase tracking-wider">
          Cu-PAN Chemosensor Reading
        </span>
      </div>

      {/* RESULT MAIN HERO CARD */}
      <div className="command-card rounded-2xl border border-[var(--card-border)] p-6 md:p-8 shadow-2xl space-y-8 backdrop-blur-xl">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[var(--card-border)] pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono tracking-widest text-[var(--text-secondary)] uppercase font-semibold">
                Optical Dosimetry Reading
              </span>
              {sampleId && (
                <span className="px-2.5 py-0.5 rounded-full bg-[var(--card-surface-subtle)] border border-[var(--card-border)] font-mono text-[10px] text-[var(--accent-primary)] font-bold">
                  {sampleId}
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-heading tracking-tight mt-1">
              Exposure Quantification
            </h1>
          </div>
          <StatusBadge status={status} size="lg" />
        </div>

        {/* Big Dose Output Display */}
        <div className="text-center space-y-3 py-6 bg-[var(--card-surface-subtle)] rounded-2xl border border-[var(--card-border)]">
          <span className="text-xs font-mono font-bold tracking-widest uppercase text-[var(--text-secondary)]">
            {isOutOfCal ? 'CALIBRATION INTEGRITY STATUS' : 'CUMULATIVE EXPOSURE ESTIMATE'}
          </span>
          
          <div className="flex items-center justify-center gap-3.5">
            <div
              className="w-7 h-7 rounded-full border-2 border-white/20 shadow-md transition-all duration-300"
              style={{ backgroundColor: stripColorHex }}
              title="Detected Strip Color"
            />
            
            {isOutOfCal ? (
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#EF4444] tracking-tight">
                DO NOT ESTIMATE
              </div>
            ) : (
              <div className="text-4xl sm:text-6xl font-extrabold font-mono tracking-tight text-[var(--text-primary)]">
                {dosePpmH.toFixed(2)} <span className="text-xl sm:text-3xl font-semibold text-[var(--text-secondary)]">ppm·h</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-mono pt-1">
            <span className="text-[var(--accent-primary)] font-semibold">
              Classification: <strong>{actionFlag || status}</strong>
            </span>
            <span className="text-[var(--text-muted)]">•</span>
            <span className="text-[var(--text-secondary)]">
              Model Confidence: <strong>{confidenceScore}%</strong>
            </span>
          </div>

          {isOutOfCal && (
            <div className="max-w-md mx-auto mt-2 px-4 py-2 rounded-xl bg-stone-500/15 border border-stone-500/30 text-xs text-stone-300 font-mono">
              Strip color corresponds to aged/degraded matrix or legacy non-Cu-PAN chemistry. Replace wristband immediately.
            </div>
          )}
        </div>

        {/* HORIZONTAL RANGE SCALE (0 to 30+ ppm·h) */}
        <div className="space-y-3 px-1 sm:px-2">
          <div className="flex justify-between text-[10px] sm:text-xs font-bold font-mono">
            <span className="text-[var(--accent-primary)]">S1: ~0–0.49</span>
            <span className="text-[#FF9500]">S2: ~0.50–0.99</span>
            <span className="text-[#F87171]">S3: ~1.00–2.00</span>
            <span className="text-[#EF4444]">S4: ~2–10</span>
            <span className="text-[#DC2626]">S5: ~10–30+</span>
          </div>

          <div className="relative h-4 rounded-full bg-gradient-to-r from-[#795185] via-[#c96b70] to-[#fdb937] border border-[var(--card-border)] overflow-visible">
            {/* Stage divider notches */}
            <div className="absolute left-[20%] top-0 bottom-0 w-0.5 bg-white/40" />
            <div className="absolute left-[40%] top-0 bottom-0 w-0.5 bg-white/40" />
            <div className="absolute left-[60%] top-0 bottom-0 w-0.5 bg-white/40" />
            <div className="absolute left-[80%] top-0 bottom-0 w-0.5 bg-white/40" />

            {/* Marker Indicator */}
            {!isOutOfCal && (
              <div
                className="absolute -top-3 -ml-3 flex flex-col items-center transition-all duration-500"
                style={{ left: `${markerPercent}%` }}
              >
                <div className="w-6 h-6 rounded-full bg-[var(--text-primary)] border-2 border-[var(--canvas-bg)] shadow-lg flex items-center justify-center text-[var(--canvas-bg)] text-[10px] font-bold">
                  ▼
                </div>
              </div>
            )}
          </div>

          <div className="text-[11px] text-[var(--text-secondary)] font-medium text-center pt-1 font-mono">
            {isOutOfCal
              ? 'Out of calibration curve bounds — strip invalidated'
              : `Calculated position: ${markerPercent.toFixed(0)}% along Cu-PAN displacement response`}
          </div>
        </div>

        {/* OPTICAL & KINETIC LAB DATA GRID */}
        <div className="bg-[var(--card-surface-subtle)] p-5 rounded-2xl border border-[var(--card-border)] space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--card-border)] pb-3">
            <span className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5 uppercase font-mono">
              <Cpu className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
              Colorimetric Extraction & Environmental Compensation
            </span>
            <span className="text-[10px] font-mono text-[var(--text-secondary)]">CIE D65 Standard</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div>
              <span className="text-[10px] text-[var(--text-secondary)] block">CIE L*, a*, b*</span>
              <span className="font-bold text-[var(--text-primary)]">{rawColorString || (lab ? `${lab.L}, ${lab.a}, ${lab.b}` : 'N/A')}</span>
            </div>
            <div>
              <span className="text-[10px] text-[var(--text-secondary)] block">Reference ΔEab*</span>
              <span className="font-bold text-[var(--accent-primary)]">{rawDeltaE !== undefined ? rawDeltaE.toFixed(1) : '11.4'}</span>
            </div>
            <div>
              <span className="text-[10px] text-[var(--text-secondary)] block">Compensated ΔE</span>
              <span className="font-bold text-[var(--text-primary)]">{compensatedDeltaE !== undefined ? compensatedDeltaE.toFixed(1) : '11.4'}</span>
            </div>
            <div>
              <span className="text-[10px] text-[var(--text-secondary)] block">Badge Shelf Age</span>
              <span className="font-bold text-[var(--text-primary)]">{shelfAge ? `${shelfAge} Days` : '25 Days'}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono pt-3 border-t border-[var(--card-border)]">
            <div>
              <span className="text-[10px] text-[var(--text-secondary)] block">Ambient Temp</span>
              <span className="font-semibold text-[var(--text-primary)]">{tempC}°C ({tempCompensationFactor ? `${tempCompensationFactor}x` : '1.02x'})</span>
            </div>
            <div>
              <span className="text-[10px] text-[var(--text-secondary)] block">Ambient RH</span>
              <span className="font-semibold text-[var(--text-primary)]">{humidityPercent}% ({humidityCompensationFactor ? `${humidityCompensationFactor}x` : '1.01x'})</span>
            </div>
            <div>
              <span className="text-[10px] text-[var(--text-secondary)] block">Expiry Status</span>
              <span className={`font-bold ${expiryStatus === 'EXPIRED' ? 'text-[#EF4444]' : 'text-[#10B981]'}`}>
                {expiryStatus || 'Valid (Active)'}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[var(--text-secondary)] block">Stage Formula</span>
              <span className="font-bold text-[var(--accent-primary)] truncate block">{actionFlag?.split(':')[0] || 'Cu-PAN Matrix'}</span>
            </div>
          </div>
        </div>

        {/* WORKER & FACILITY DETAILS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-[var(--card-border)]">
          <div className="p-3.5 rounded-xl bg-[var(--card-surface-subtle)] border border-[var(--card-border)] space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] font-medium">
              <User className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
              <span>Assigned Worker</span>
            </div>
            <div className="text-sm font-bold text-[var(--text-primary)]">{workerName}</div>
            <div className="text-[10px] font-mono text-[var(--text-secondary)]">{workerId}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--card-surface-subtle)] border border-[var(--card-border)] space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] font-medium">
              <Award className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
              <span>Dosimeter Badge ID</span>
            </div>
            <div className="text-sm font-mono font-bold text-[var(--text-primary)]">{badgeId}</div>
            <div className="text-[10px] text-[var(--text-secondary)]">{location}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--card-surface-subtle)] border border-[var(--card-border)] space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] font-medium">
              <Clock className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
              <span>Shift & Timestamp</span>
            </div>
            <div className="text-sm font-bold text-[var(--text-primary)]">{shift.split('·')[0]}</div>
            <div className="text-[10px] font-mono text-[var(--text-secondary)]">{timeAgo}</div>
          </div>
        </div>

        {/* DISCLAIMER NOTICE */}
        <div className="p-4 rounded-xl bg-[var(--card-surface-subtle)] border border-[var(--card-border)] text-[11px] leading-relaxed flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-[var(--accent-primary)] shrink-0 mt-0.5" />
          <span className="text-[var(--text-secondary)]">
            <strong className="text-[var(--text-primary)]">Statutory Audit Integration:</strong> Readings are digitally logged into the MRPL Occupational Health & Safety ledger with tamper-evident time, temperature, and camera metadata.
          </span>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-[var(--card-border)]">
          <button
            onClick={() => setActivePage('scan')}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[var(--card-surface-subtle)] border border-[var(--card-border)] text-[var(--text-primary)] text-xs font-mono font-semibold tracking-wide hover:border-[var(--accent-primary)] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Scan Another Wristband</span>
          </button>

          <button
            onClick={handleSave}
            className="w-full sm:w-auto px-7 py-2.5 rounded-full bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-black text-xs font-mono font-bold tracking-wide hover:shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save to Worker Dossier</span>
          </button>
        </div>

      </div>

    </div>
  );
};
