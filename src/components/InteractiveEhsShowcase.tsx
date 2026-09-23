import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  Scan,
  Cpu,
  Layers,
  Sparkles,
  Sliders,
  Activity,
  ArrowRight,
  RefreshCw,
  Info
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from 'recharts';

interface ExposureRecord {
  id: string;
  workerName: string;
  workerId: string;
  shift: string;
  dosePpmH: number;
  ciLower: number;
  ciUpper: number;
  status: 'NORMAL' | 'MONITOR' | 'REVIEW';
  time: string;
  quality: string;
}

const INITIAL_RECORDS: ExposureRecord[] = [
  { id: 'REC-101', workerName: 'Reya Doshi', workerId: 'MRPL-W-4091', shift: 'Day Shift (08:00–16:00)', dosePpmH: 1.84, ciLower: 1.52, ciUpper: 2.16, status: 'NORMAL', time: '10 mins ago', quality: 'Good' },
  { id: 'REC-102', workerName: 'Rajesh Kumar', workerId: 'MRPL-C-1044', shift: 'Day Shift (08:00–16:00)', dosePpmH: 8.92, ciLower: 7.95, ciUpper: 9.89, status: 'MONITOR', time: '24 mins ago', quality: 'Good' },
  { id: 'REC-103', workerName: 'Arun Verma', workerId: 'MRPL-C-2018', shift: 'Night Shift (00:00–08:00)', dosePpmH: 14.30, ciLower: 12.80, ciUpper: 15.80, status: 'REVIEW', time: '1 hr ago', quality: 'Acceptable' },
  { id: 'REC-104', workerName: 'Suresh Patil', workerId: 'MRPL-W-1082', shift: 'Day Shift (08:00–16:00)', dosePpmH: 0.65, ciLower: 0.45, ciUpper: 0.85, status: 'NORMAL', time: '2 hrs ago', quality: 'Good' },
  { id: 'REC-105', workerName: 'Mohammed Tariq', workerId: 'MRPL-C-3091', shift: 'Day Shift (08:00–16:00)', dosePpmH: 4.20, ciLower: 3.75, ciUpper: 4.65, status: 'MONITOR', time: '3 hrs ago', quality: 'Good' },
  { id: 'REC-106', workerName: 'Priya Sundaram', workerId: 'MRPL-W-2045', shift: 'Morning Shift', dosePpmH: 1.10, ciLower: 0.90, ciUpper: 1.30, status: 'NORMAL', time: '4 hrs ago', quality: 'Good' },
];

const WEEKLY_TREND = [
  { day: 'Mon', avgDose: 1.4, peakDose: 4.2, scans: 182 },
  { day: 'Tue', avgDose: 2.1, peakDose: 6.8, scans: 194 },
  { day: 'Wed', avgDose: 3.5, peakDose: 11.2, scans: 205 },
  { day: 'Thu', avgDose: 2.8, peakDose: 8.4, scans: 178 },
  { day: 'Fri', avgDose: 4.2, peakDose: 14.3, scans: 210 },
  { day: 'Sat', avgDose: 1.9, peakDose: 5.1, scans: 145 },
  { day: 'Sun', avgDose: 1.2, peakDose: 3.4, scans: 132 },
];

export const InteractiveEhsShowcase: React.FC = () => {
  const { setActivePage, showToast } = useApp();

  // Simulator State
  const [darknessPercent, setDarknessPercent] = useState<number>(45);
  const [tempCelsius, setTempCelsius] = useState<number>(27);
  const [humidityPercent, setHumidityPercent] = useState<number>(55);
  const [isStainedPreset, setIsStainedPreset] = useState<boolean>(false);
  const [records, setRecords] = useState<ExposureRecord[]>(INITIAL_RECORDS);
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'NORMAL' | 'MONITOR' | 'REVIEW'>('ALL');

  // Mathematical Calculation for Simulation (Literature-Informed Arrhenius + Dual-Zone Saturation Model)
  // Dose roughly scales with darkness with Arrhenius temperature scaling:
  // f_T = 1.0 + 0.012*(T - 25), f_RH = 1.0 + 0.004*(RH - 50)
  const f_T = 1.0 + 0.012 * (tempCelsius - 25);
  const f_RH = 1.0 + 0.004 * (humidityPercent - 50);
  const rawDarknessFactor = darknessPercent / 100;

  // Non-linear power curve representing cumulative dosimeter response up to 50+ ppm·h
  const baseDose = Math.pow(rawDarknessFactor, 1.35) * 52;
  const calculatedDose = Math.max(0.1, Number((baseDose / (f_T * f_RH)).toFixed(1)));
  const ciUncertainty = Number((calculatedDose * 0.12).toFixed(1));
  const ciLower = Math.max(0, Number((calculatedDose - ciUncertainty).toFixed(1)));
  const ciUpper = Number((calculatedDose + ciUncertainty).toFixed(1));

  let badgeStatus: 'NORMAL' | 'MONITOR' | 'REVIEW' = 'NORMAL';
  if (isStainedPreset) {
    badgeStatus = 'REVIEW';
  } else if (calculatedDose >= 10.0) {
    badgeStatus = 'REVIEW';
  } else if (calculatedDose >= 2.5) {
    badgeStatus = 'MONITOR';
  }

  // Handle Save to Exposure History
  const handleSaveToHistory = () => {
    const newRecord: ExposureRecord = {
      id: `REC-${Math.floor(1000 + Math.random() * 9000)}`,
      workerName: 'Current Scan (Simulator)',
      workerId: 'MRPL-SIM-099',
      shift: 'Day Shift (Live)',
      dosePpmH: isStainedPreset ? 0.0 : calculatedDose,
      ciLower: isStainedPreset ? 0.0 : ciLower,
      ciUpper: isStainedPreset ? 0.0 : ciUpper,
      status: badgeStatus,
      time: 'Just now',
      quality: isStainedPreset ? 'Stain Rejected' : 'Good'
    };
    setRecords([newRecord, ...records]);
    showToast(isStainedPreset ? '⚠️ Oil Stain Detected — Flagged for Inspection' : `✅ Logged ${calculatedDose} ppm·h to Exposure History`);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Record ID', 'Worker Name', 'Worker ID', 'Shift', 'Dose (ppm·h)', '95% CI Lower', '95% CI Upper', 'Status', 'Timestamp', 'Optical Quality'];
    const rows = records.map(r => [
      r.id,
      `"${r.workerName}"`,
      r.workerId,
      `"${r.shift}"`,
      r.dosePpmH.toFixed(2),
      r.ciLower.toFixed(2),
      r.ciUpper.toFixed(2),
      r.status,
      `"${r.time}"`,
      r.quality
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SARVAS_EHS_Exposure_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('📁 Exported complete EHS exposure records to CSV');
  };

  const filteredRecords = filterStatus === 'ALL'
    ? records
    : records.filter(r => r.status === filterStatus);

  return (
    <div className="space-y-12 sm:space-y-16">
      
      {/* HEADER SECTION: Problem, Solution, Impact, Proof */}
      <div className="bg-[#292925] text-[#EDE5D6] rounded-2xl p-6 sm:p-10 border border-[#3E3C36] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#4F5D4B]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#3E3C36] pb-4 mb-6">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-1 rounded bg-[#3A3832] text-[#C2CBBF] font-mono text-[10px] sm:text-xs font-bold tracking-wider uppercase border border-[#4E4C44]">
              MRPL • SIH26118 • RageB8
            </span>
            <span className="text-[#8E897E] text-xs font-mono">•</span>
            <span className="text-[11px] font-mono text-[#D8D0C2] uppercase font-semibold">
              HARDWARE • SMART AUTOMATION
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#71806B] animate-pulse" />
            <span className="text-[11px] font-mono text-[#C2CBBF]">OFFLINE-FIRST READY</span>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-3 max-w-3xl">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-[#F6F1E7] tracking-tight">
            SARVAS DOSIMETER BADGE <br />
            <span className="font-normal text-[#C2CBBF]">Passive H₂S Exposure Dosimeter with AI-Based Quantitative Readout</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#A69F91] leading-relaxed">
            Turn a progressive inorganic color response into an auditable cumulative exposure record using reference-calibrated smartphone imaging.
          </p>
        </div>

        {/* 4 Pillars Grid (Problem, Solution, Impact, Proof) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          <div className="p-4 rounded-xl bg-[#20201C] border border-[#3E3C36] space-y-2">
            <div className="flex items-center gap-2 text-[#B08A55]">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider">The Problem</span>
            </div>
            <p className="text-xs text-[#A69F91] leading-relaxed">
              Instantaneous sirens only detect momentary spikes (&gt;10 ppm); workers breathe 1–9 ppm silently without any cumulative exposure record.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#20201C] border border-[#3E3C36] space-y-2">
            <div className="flex items-center gap-2 text-[#71806B]">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider">The Solution</span>
            </div>
            <p className="text-xs text-[#A69F91] leading-relaxed">
              Dual-Zone (Ag/Cu) inorganic paper cartridge + printed reference scale + smartphone image analysis + CIEDE2000 dirt discrimination.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#20201C] border border-[#3E3C36] space-y-2">
            <div className="flex items-center gap-2 text-[#8CA086]">
              <Activity className="w-4 h-4" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider">The Impact</span>
            </div>
            <p className="text-xs text-[#A69F91] leading-relaxed">
              Worker ID, shift timestamp, dose (ppm·h), and 95% CI uncertainty automatically logged into statutory EHS compliance logs.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#20201C] border border-[#3E3C36] space-y-2">
            <div className="flex items-center gap-2 text-[#C2CBBF]">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider">The Proof</span>
            </div>
            <p className="text-xs text-[#A69F91] leading-relaxed">
              Grounded in 100 empirical exposure test samples from peer-reviewed industrial field studies, with Arrhenius temperature compensation.
            </p>
          </div>
        </div>

        {/* 4 Bottom Highlight Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-[#3E3C36]">
          <div className="text-center p-2.5 rounded-lg bg-[#242420] border border-[#383730]">
            <div className="text-base sm:text-lg font-bold font-mono text-[#EDE5D6]">₹0.85</div>
            <div className="text-[10px] text-[#A69F91] uppercase tracking-wider font-mono">Unit Manufacturing BOM</div>
          </div>
          <div className="text-center p-2.5 rounded-lg bg-[#242420] border border-[#383730]">
            <div className="text-base sm:text-lg font-bold font-mono text-[#EDE5D6]">60–90 Days</div>
            <div className="text-[10px] text-[#A69F91] uppercase tracking-wider font-mono">Pouched Shelf-Life</div>
          </div>
          <div className="text-center p-2.5 rounded-lg bg-[#242420] border border-[#383730]">
            <div className="text-base sm:text-lg font-bold font-mono text-[#EDE5D6]">ppm·h</div>
            <div className="text-[10px] text-[#A69F91] uppercase tracking-wider font-mono">Cumulative Dose Metric</div>
          </div>
          <div className="text-center p-2.5 rounded-lg bg-[#242420] border border-[#383730]">
            <div className="text-base sm:text-lg font-bold font-mono text-[#71806B]">±12%</div>
            <div className="text-[10px] text-[#A69F91] uppercase tracking-wider font-mono">95% CI Uncertainty</div>
          </div>
        </div>
      </div>

      {/* SECTION 2: INTERACTIVE DEMO SIMULATOR ("MOBILE APP PROTOTYPE") */}
      <div className="bg-[#EDE5D6] rounded-2xl border border-[#D8D0C2] p-6 sm:p-8 space-y-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#D8D0C2] pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#4F5D4B] text-[#F6F1E7] text-[10px] font-mono font-bold tracking-widest uppercase">
                DEMO MODE
              </span>
              <span className="text-[11px] font-mono text-[#5D5B53] font-semibold">
                SCAN → CALIBRATE → ESTIMATE → RECORD
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#292925] mt-1">
              Interactive Dose Quantification Simulator
            </h3>
            <p className="text-xs text-[#5D5B53] mt-0.5">
              Simulate sensor color change, apply environmental compensation, and observe real-time dose estimation.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                setDarknessPercent(45);
                setTempCelsius(27);
                setHumidityPercent(55);
                setIsStainedPreset(false);
                showToast('Reset simulator to standard 45% exposure preset');
              }}
              className="px-3 py-2 rounded border border-[#C5CEC0] bg-[#F6F1E7] text-[#292925] text-xs font-medium hover:bg-[#E5EADF] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            <button
              onClick={() => {
                setIsStainedPreset(!isStainedPreset);
                showToast(!isStainedPreset ? '⚠️ Simulated surface oil/grease stain on badge' : 'Restored clean sensor badge');
              }}
              className={`px-3 py-2 rounded text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                isStainedPreset
                  ? 'bg-[#B08A55] text-white shadow-xs'
                  : 'bg-[#F6F1E7] border border-[#C5CEC0] text-[#5D5B53] hover:bg-[#E5EADF]'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{isStainedPreset ? 'Oil Stain Active' : 'Test Oil Stain'}</span>
            </button>
          </div>
        </div>

        {/* 3 Step Interactive Workflow Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Step 1: Capture / Sensor Preset Selection */}
          <div className="p-5 rounded-xl bg-[#F6F1E7] border border-[#D8D0C2] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#4F5D4B] uppercase">
                1. CAPTURE SENSOR IMAGE
              </span>
              <Scan className="w-4 h-4 text-[#4F5D4B]" />
            </div>

            {/* Virtual Badge Preview */}
            <div className="p-4 rounded-lg bg-[#292925] text-white space-y-3 border border-[#3E3C36]">
              <div className="flex items-center justify-between text-[10px] font-mono text-[#A69F91]">
                <span>SARVAS BADGE #04091</span>
                <span>QR: MRPL-A</span>
              </div>

              {/* Sensor Strip Visualizer */}
              <div className="h-16 rounded flex items-center justify-center relative overflow-hidden transition-all duration-300"
                style={{
                  backgroundColor: isStainedPreset
                    ? '#38322B'
                    : `hsl(${270 - (darknessPercent * 2.3)}, ${Math.max(10, 50 - darknessPercent * 0.4)}%, ${Math.max(12, 55 - darknessPercent * 0.45)}%)`
                }}
              >
                <div className="text-center font-mono text-xs font-bold text-white/90 drop-shadow-md">
                  {isStainedPreset ? 'SURFACE STAIN DETECTED' : `SENSOR DARKNESS: ${darknessPercent}%`}
                </div>
                {/* Reference Scale Strip Preview */}
                <div className="absolute bottom-1 inset-x-2 flex gap-1 h-2">
                  <div className="flex-1 bg-white rounded-xs" title="D65 White" />
                  <div className="flex-1 bg-gray-400 rounded-xs" title="18% Neutral Gray" />
                  <div className="flex-1 bg-[#804476] rounded-xs" title="0.0 ppm·h" />
                  <div className="flex-1 bg-[#AF5569] rounded-xs" title="2.5 ppm·h" />
                  <div className="flex-1 bg-[#CD6E44] rounded-xs" title="8.0 ppm·h" />
                  <div className="flex-1 bg-[#3A2A1A] rounded-xs" title="50 ppm·h" />
                </div>
              </div>

              {/* Status indicators */}
              <div className="flex items-center justify-between text-[10px] font-mono pt-1 text-[#C2CBBF]">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#71806B]" /> Framing
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#71806B]" /> Scale Detected
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#71806B]" /> Lighting Calibrated
                </span>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-[#5D5B53] font-semibold uppercase">
                Quick Exposure Presets
              </label>
              <div className="grid grid-cols-4 gap-1.5 text-xs font-mono">
                {[
                  { label: '0%', val: 0 },
                  { label: '15%', val: 15 },
                  { label: '45%', val: 45 },
                  { label: '85%', val: 85 }
                ].map(p => (
                  <button
                    key={p.label}
                    onClick={() => {
                      setDarknessPercent(p.val);
                      setIsStainedPreset(false);
                    }}
                    className={`py-1.5 rounded border text-center font-medium transition-colors ${
                      darknessPercent === p.val && !isStainedPreset
                        ? 'bg-[#4F5D4B] text-white border-[#4F5D4B]'
                        : 'bg-[#EDE5D6] border-[#D8D0C2] text-[#292925] hover:bg-[#E5EADF]'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Step 2: Reference Calibration & Environmental Sliders */}
          <div className="p-5 rounded-xl bg-[#F6F1E7] border border-[#D8D0C2] space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#4F5D4B] uppercase">
                2. REFERENCE &amp; SENSORS
              </span>
              <Sliders className="w-4 h-4 text-[#4F5D4B]" />
            </div>

            {/* Slider 1: Darkness */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#5D5B53]">Observed Sensor Darkness:</span>
                <span className="font-bold text-[#292925]">{darknessPercent}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={darknessPercent}
                onChange={e => {
                  setDarknessPercent(Number(e.target.value));
                  setIsStainedPreset(false);
                }}
                className="w-full accent-[#4F5D4B] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#878377]">
                <span>0% (Pristine)</span>
                <span>50% (Action)</span>
                <span>100% (Saturated)</span>
              </div>
            </div>

            {/* Slider 2: Temperature */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#5D5B53]">Ambient Temperature:</span>
                <span className="font-bold text-[#292925]">{tempCelsius}°C</span>
              </div>
              <input
                type="range"
                min="15"
                max="45"
                value={tempCelsius}
                onChange={e => setTempCelsius(Number(e.target.value))}
                className="w-full accent-[#71806B] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#878377]">
                <span>15°C (Winter)</span>
                <span>27°C (Baseline)</span>
                <span>45°C (Summer)</span>
              </div>
            </div>

            {/* Slider 3: Humidity */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#5D5B53]">Relative Humidity:</span>
                <span className="font-bold text-[#292925]">{humidityPercent}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="90"
                value={humidityPercent}
                onChange={e => setHumidityPercent(Number(e.target.value))}
                className="w-full accent-[#71806B] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#878377]">
                <span>20% (Dry)</span>
                <span>50% (Standard)</span>
                <span>90% (Coastal)</span>
              </div>
            </div>

            <div className="p-2.5 rounded bg-[#EDE5D6] border border-[#D8D0C2] text-[11px] font-mono text-[#5D5B53]">
              Arrhenius fT: <span className="font-bold text-[#292925]">{f_T.toFixed(3)}</span> | fRH: <span className="font-bold text-[#292925]">{f_RH.toFixed(3)}</span>
            </div>
          </div>

          {/* Step 3: Quantitative Result */}
          <div className="p-5 rounded-xl bg-[#F6F1E7] border border-[#D8D0C2] flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#4F5D4B] uppercase">
                  3. QUANTITATIVE RESULT
                </span>
                <Cpu className="w-4 h-4 text-[#4F5D4B]" />
              </div>

              {/* Main Dose Big Display */}
              <div className="mt-4 p-4 rounded-xl bg-white border border-[#D8D0C2] text-center space-y-1">
                <div className="text-3xl sm:text-4xl font-extrabold font-mono"
                  style={{
                    color: isStainedPreset ? '#826235' : (badgeStatus === 'NORMAL' ? '#4F5D4B' : (badgeStatus === 'MONITOR' ? '#B08A55' : '#A34838'))
                  }}
                >
                  {isStainedPreset ? 'FLAG: STAIN' : `${calculatedDose} ppm·h`}
                </div>
                <div className="text-xs font-mono text-[#5D5B53]">
                  {isStainedPreset ? 'Uncoupled ΔL* Drop Rejected' : `95% CI: ${ciLower} – ${ciUpper} ppm·h`}
                </div>
              </div>

              {/* Badges and Metadata */}
              <div className="grid grid-cols-2 gap-2 mt-3 text-[11px] font-mono">
                <div className="p-2 rounded bg-[#EDE5D6] border border-[#D8D0C2]">
                  <span className="text-[#878377] block text-[10px]">BADGE STATUS</span>
                  <span className="font-bold text-[#292925]">
                    {isStainedPreset ? '⚠️ STAIN REJECT' : `✓ ${badgeStatus}`}
                  </span>
                </div>
                <div className="p-2 rounded bg-[#EDE5D6] border border-[#D8D0C2]">
                  <span className="text-[#878377] block text-[10px]">WORKER PROFILE</span>
                  <span className="font-bold text-[#292925]">RJK-001 (Day)</span>
                </div>
                <div className="p-2 rounded bg-[#EDE5D6] border border-[#D8D0C2]">
                  <span className="text-[#878377] block text-[10px]">MODEL PIPELINE</span>
                  <span className="font-bold text-[#292925]">RF + Dual-Zone</span>
                </div>
                <div className="p-2 rounded bg-[#EDE5D6] border border-[#D8D0C2]">
                  <span className="text-[#878377] block text-[10px]">OPTICAL QA</span>
                  <span className="font-bold text-[#4F5D4B]">Good (0.96)</span>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="space-y-2">
              <button
                onClick={handleSaveToHistory}
                className="w-full py-2.5 rounded bg-[#4F5D4B] text-[#F6F1E7] text-xs font-bold hover:bg-[#3D493A] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save to Exposure History</span>
              </button>
              <p className="text-[10px] text-center text-[#878377] font-mono">
                Prototype estimate only; not a certified primary safety siren.
              </p>
            </div>

          </div>

        </div>
      </div>

      {/* SECTION 3: EHS / OCCUPATIONAL HEALTH EXPOSURE DASHBOARD */}
      <div className="bg-[#F6F1E7] rounded-2xl border border-[#D8D0C2] p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#D8D0C2] pb-5">
          <div>
            <span className="text-[11px] font-mono font-semibold text-[#71806B] uppercase">
              EHS / OCCUPATIONAL HEALTH
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-[#292925] mt-0.5">
              Shift Exposure Dashboard &amp; Audit Logs
            </h3>
            <p className="text-xs text-[#5D5B53] mt-0.5">
              Enterprise-grade shift monitoring, compliance trends, and worker dose history.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 rounded bg-[#292925] text-[#EDE5D6] text-xs font-semibold hover:bg-[#3E3C36] transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#71806B]" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => setActivePage('dashboard')}
              className="px-4 py-2 rounded border border-[#C5CEC0] bg-white text-[#292925] text-xs font-semibold hover:bg-[#EDE5D6] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Full EHS Suite</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 4 KPI Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="p-4 rounded-xl bg-[#EDE5D6] border border-[#D8D0C2]">
            <div className="text-[10px] font-mono text-[#878377] uppercase font-bold">TOTAL WORKERS</div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#292925] mt-1">128</div>
            <div className="text-[11px] text-[#5D5B53] mt-0.5">Permanent &amp; contract</div>
          </div>
          <div className="p-4 rounded-xl bg-[#EDE5D6] border border-[#D8D0C2]">
            <div className="text-[10px] font-mono text-[#878377] uppercase font-bold">SCANS LOGGED</div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#292925] mt-1">1,246</div>
            <div className="text-[11px] text-[#4F5D4B] mt-0.5">99.2% shift check-in</div>
          </div>
          <div className="p-4 rounded-xl bg-[#EDE5D6] border border-[#D8D0C2]">
            <div className="text-[10px] font-mono text-[#878377] uppercase font-bold">HIGH-DOSE REVIEWS</div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#B08A55] mt-1">12</div>
            <div className="text-[11px] text-[#826235] mt-0.5">&gt; 10.0 ppm·h ceiling</div>
          </div>
          <div className="p-4 rounded-xl bg-[#EDE5D6] border border-[#D8D0C2]">
            <div className="text-[10px] font-mono text-[#878377] uppercase font-bold">VALID BANDS</div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#4F5D4B] mt-1">1,210</div>
            <div className="text-[11px] text-[#5D5B53] mt-0.5">97.1% uncompromised</div>
          </div>
        </div>

        {/* Weekly Cumulative Trend Chart */}
        <div className="p-5 rounded-xl bg-white border border-[#D8D0C2] space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <h4 className="text-sm font-bold text-[#292925]">Weekly Facility Cumulative Dose Trend (ppm·h)</h4>
              <p className="text-xs text-[#5D5B53]">Daily average worker dose against the ACGIH 8.0 ppm·h guideline ceiling</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-[#4F5D4B]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4F5D4B]" /> Avg Dose
              </span>
              <span className="flex items-center gap-1.5 text-[#B08A55]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B08A55]" /> Peak Scan
              </span>
              <span className="flex items-center gap-1.5 text-[#A34838]">
                <span className="w-2.5 h-0.5 bg-[#A34838]" /> ACGIH Limit (8.0)
              </span>
            </div>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={WEEKLY_TREND} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="avgDoseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#71806B" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#71806B" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5EADF" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#5D5B53' }} />
                <YAxis tick={{ fontSize: 11, fill: '#5D5B53' }} unit=" ppm·h" domain={[0, 16]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#292925', borderColor: '#3E3C36', color: '#EDE5D6', fontSize: '11px', borderRadius: '8px' }}
                />
                <ReferenceLine y={8.0} stroke="#A34838" strokeDasharray="4 4" label={{ value: 'ACGIH 8 ppm·h', fill: '#A34838', fontSize: 10, position: 'insideTopRight' }} />
                <Area type="monotone" dataKey="avgDose" stroke="#4F5D4B" strokeWidth={2} fillOpacity={1} fill="url(#avgDoseGrad)" name="Average Shift Dose" />
                <Area type="monotone" dataKey="peakDose" stroke="#B08A55" strokeWidth={2} fill="transparent" name="Peak Shift Dose" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Exposure Records Table */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <h4 className="text-sm font-bold text-[#292925]">Recent Shift Exposure Records</h4>
            
            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 text-[11px] font-mono">
              {(['ALL', 'NORMAL', 'MONITOR', 'REVIEW'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                    filterStatus === status
                      ? 'bg-[#292925] text-white font-bold'
                      : 'bg-[#EDE5D6] text-[#5D5B53] hover:bg-[#E5EADF]'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#D8D0C2] bg-white">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#EDE5D6] text-[#5D5B53] uppercase text-[10px] border-b border-[#D8D0C2]">
                <tr>
                  <th className="py-2.5 px-3.5">Record ID</th>
                  <th className="py-2.5 px-3.5">Worker Name</th>
                  <th className="py-2.5 px-3.5">Worker ID</th>
                  <th className="py-2.5 px-3.5">Shift</th>
                  <th className="py-2.5 px-3.5 text-right">Dose (ppm·h)</th>
                  <th className="py-2.5 px-3.5">95% CI</th>
                  <th className="py-2.5 px-3.5 text-center">Status</th>
                  <th className="py-2.5 px-3.5 text-right">Logged</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFEBE4]">
                {filteredRecords.map(r => (
                  <tr key={r.id} className="hover:bg-[#F6F1E7] transition-colors">
                    <td className="py-2.5 px-3.5 font-bold text-[#292925]">{r.id}</td>
                    <td className="py-2.5 px-3.5 text-[#292925] font-sans font-medium">{r.workerName}</td>
                    <td className="py-2.5 px-3.5 text-[#878377]">{r.workerId}</td>
                    <td className="py-2.5 px-3.5 text-[#5D5B53]">{r.shift}</td>
                    <td className="py-2.5 px-3.5 text-right font-bold text-[#292925]">{r.dosePpmH.toFixed(2)}</td>
                    <td className="py-2.5 px-3.5 text-[#878377]">{r.ciLower}–{r.ciUpper}</td>
                    <td className="py-2.5 px-3.5 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        r.status === 'NORMAL'
                          ? 'bg-[#E5EADF] text-[#4F5D4B]'
                          : (r.status === 'MONITOR' ? 'bg-[#F4ECE1] text-[#826235]' : 'bg-[#F9EBEA] text-[#A34838]')
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3.5 text-right text-[#878377]">{r.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* SECTION 4: END-TO-END ARCHITECTURE (SYSTEM DESIGN) */}
      <div className="bg-[#292925] text-[#EDE5D6] rounded-2xl p-6 sm:p-10 border border-[#3E3C36] space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-[11px] font-mono font-semibold uppercase tracking-widest text-[#71806B]">
            SYSTEM DESIGN
          </span>
          <h3 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
            End-to-End Architecture
          </h3>
          <p className="text-xs text-[#A69F91]">
            Intrinsically safe non-electrical wearable hardware paired with edge mobile computer vision and cloud EHS intelligence.
          </p>
        </div>

        {/* 4 Architecture Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Pillar 1 */}
          <div className="p-4 rounded-xl bg-[#20201C] border border-[#3E3C36] space-y-3">
            <div className="flex items-center justify-between text-[#71806B]">
              <span className="text-xs font-mono font-bold uppercase">1. Wearable Hardware</span>
              <Layers className="w-4 h-4" />
            </div>
            <ul className="space-y-1.5 text-xs text-[#A69F91]">
              <li className="flex items-start gap-1.5">
                <span className="text-[#71806B]">•</span>
                <span>Anti-static silicone strap &amp; breathing-zone collar clip</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#71806B]">•</span>
                <span>Whatman No. 1 cellulose dual-zone strip (AgNO₃ + CuSO₄)</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#71806B]">•</span>
                <span>Printed D65 White, 18% Gray &amp; 4-step reference scales</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#71806B]">•</span>
                <span>Serialized Micro-QR code for batch &amp; worker ID linking</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#71806B]">•</span>
                <span>Tamper-evident foil pouch with printed expiry date</span>
              </li>
            </ul>
          </div>

          {/* Pillar 2 */}
          <div className="p-4 rounded-xl bg-[#20201C] border border-[#3E3C36] space-y-3">
            <div className="flex items-center justify-between text-[#8CA086]">
              <span className="text-xs font-mono font-bold uppercase">2. Mobile / Edge</span>
              <Scan className="w-4 h-4" />
            </div>
            <ul className="space-y-1.5 text-xs text-[#A69F91]">
              <li className="flex items-start gap-1.5">
                <span className="text-[#8CA086]">•</span>
                <span>React + Vite + Capacitor (Android Native &amp; Web)</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#8CA086]">•</span>
                <span>OpenCV contour isolation &amp; camera framing reticle</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#8CA086]">•</span>
                <span>von Kries chromatic adaptation (2700K–6500K invariant)</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#8CA086]">•</span>
                <span>Device-independent CIE L*a*b* conversion under D65</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#8CA086]">•</span>
                <span>Shift check-out scanning outside classified Zone 0/1</span>
              </li>
            </ul>
          </div>

          {/* Pillar 3 */}
          <div className="p-4 rounded-xl bg-[#20201C] border border-[#3E3C36] space-y-3">
            <div className="flex items-center justify-between text-[#B08A55]">
              <span className="text-xs font-mono font-bold uppercase">3. Data &amp; Model</span>
              <Cpu className="w-4 h-4" />
            </div>
            <ul className="space-y-1.5 text-xs text-[#A69F91]">
              <li className="flex items-start gap-1.5">
                <span className="text-[#B08A55]">•</span>
                <span>CIELAB locus trajectory analysis with CIEDE2000 formula</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#B08A55]">•</span>
                <span>Automatic rejection of mud, crude oil &amp; grease stains</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#B08A55]">•</span>
                <span>Random Forest Regressor with 95% CI tree dispersion</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#B08A55]">•</span>
                <span>Shift-averaged Arrhenius temperature &amp; humidity compensation</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#B08A55]">•</span>
                <span>Grounded in 100-sample empirical literature dataset</span>
              </li>
            </ul>
          </div>

          {/* Pillar 4 */}
          <div className="p-4 rounded-xl bg-[#20201C] border border-[#3E3C36] space-y-3">
            <div className="flex items-center justify-between text-[#C2CBBF]">
              <span className="text-xs font-mono font-bold uppercase">4. EHS &amp; Backend</span>
              <Activity className="w-4 h-4" />
            </div>
            <ul className="space-y-1.5 text-xs text-[#A69F91]">
              <li className="flex items-start gap-1.5">
                <span className="text-[#C2CBBF]">•</span>
                <span>FastAPI Python backend deployed live on Render</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#C2CBBF]">•</span>
                <span>Worker profile &amp; turnstile check-in/out integration</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#C2CBBF]">•</span>
                <span>1-Click export to DGMS Form IV &amp; OISD-STD-113 CSV/PDF</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#C2CBBF]">•</span>
                <span>SHA-256 cryptographic hashing for tamper-proof audit trails</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#C2CBBF]">•</span>
                <span>ACGIH 8.0 ppm·h shift ceiling alert triggers</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Tech Stack Pills Banner */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4 border-t border-[#3E3C36] text-[11px] font-mono text-[#A69F91]">
          <span className="px-2.5 py-1 rounded bg-[#2A2A26] border border-[#3E3C36]">React 19 + TypeScript</span>
          <span className="px-2.5 py-1 rounded bg-[#2A2A26] border border-[#3E3C36]">Capacitor Native Android</span>
          <span className="px-2.5 py-1 rounded bg-[#2A2A26] border border-[#3E3C36]">OpenCV Vision</span>
          <span className="px-2.5 py-1 rounded bg-[#2A2A26] border border-[#3E3C36]">FastAPI (Render)</span>
          <span className="px-2.5 py-1 rounded bg-[#2A2A26] border border-[#3E3C36]">scikit-learn Random Forest</span>
          <span className="px-2.5 py-1 rounded bg-[#2A2A26] border border-[#3E3C36]">CIEDE2000 Colorimetry</span>
        </div>
      </div>

      {/* SECTION 5: VALIDATION ROADMAP & INDUSTRIAL CONTROLS */}
      <div className="bg-[#EDE5D6] rounded-2xl border border-[#D8D0C2] p-6 sm:p-10 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-[11px] font-mono font-semibold uppercase tracking-widest text-[#71806B]">
            VALIDATION ROADMAP
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold text-[#292925] tracking-tight">
            Build → Characterize → Validate → Pilot
          </h3>
          <p className="text-xs text-[#5D5B53]">
            A phased, scientifically defensible development roadmap designed for refinery adoption.
          </p>
        </div>

        {/* 5 Phase Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {[
            { num: '01', title: 'Chemistry', desc: 'AgNO₃/CuSO₄ inorganic stoichiometry, irreversible mineral sulfide formation, UV-blocking amber film.' },
            { num: '02', title: 'Calibration', desc: 'Controlled Na₂S acid-release in fume hood with concurrent Dräger reference monitor.' },
            { num: '03', title: 'Robustness', desc: 'Testing across smartphone CMOS sensors, factory lighting (2700K–6500K), and temperature range (15–45°C).' },
            { num: '04', title: 'AI & Filters', desc: 'CIEDE2000 locus vector validation to reject motor oil, grease, and refinery soot stains.' },
            { num: '05', title: 'MRPL Pilot', desc: 'Deployment on 5–10 sour-service workers alongside active electronic badges for ground-truth comparison.' }
          ].map(p => (
            <div key={p.num} className="p-3.5 rounded-xl bg-[#F6F1E7] border border-[#D8D0C2] space-y-1.5">
              <span className="text-xs font-mono font-extrabold text-[#4F5D4B]">{p.num}</span>
              <h5 className="text-xs font-bold text-[#292925]">{p.title}</h5>
              <p className="text-[11px] text-[#5D5B53] leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>

        {/* Industrial Challenges vs Engineering Controls Table */}
        <div className="space-y-3 pt-4 border-t border-[#D8D0C2]">
          <h4 className="text-sm font-bold text-[#292925]">Industrial Challenges vs. SARVAS Engineering Controls</h4>
          <div className="overflow-x-auto rounded-xl border border-[#D8D0C2] bg-white">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#E5EADF] text-[#4F5D4B] uppercase text-[10px] border-b border-[#D8D0C2]">
                <tr>
                  <th className="py-2.5 px-4">Refinery Operating Challenge</th>
                  <th className="py-2.5 px-4">SARVAS Engineering Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFEBE4]">
                <tr>
                  <td className="py-2.5 px-4 font-bold text-[#292925]">Lighting &amp; Phone Camera Variances</td>
                  <td className="py-2.5 px-4 text-[#5D5B53]">Dual on-badge D65 White &amp; 18% Neutral Gray swatches + von Kries chromatic adaptation.</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-bold text-[#292925]">Crude Oil, Diesel Soot &amp; Mud Splashes</td>
                  <td className="py-2.5 px-4 text-[#5D5B53]">CIELAB chromaticity locus analysis: uncoupled brightness drops are flagged as dirt rather than false gas leaks.</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-bold text-[#292925]">Badge Ageing &amp; Storage Degradation</td>
                  <td className="py-2.5 px-4 text-[#5D5B53]">Sealed gas-impermeable silver control patch allows app to subtract UV photo-drift; tamper-evident pouch confirms shelf integrity.</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-bold text-[#292925]">Temperature &amp; Humidity Variations</td>
                  <td className="py-2.5 px-4 text-[#5D5B53]">Shift-averaged Arrhenius diffusion scaling formula applied from facility ambient telemetry.</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-bold text-[#292925]">Explosive Hydrocarbon Gas Atmospheres</td>
                  <td className="py-2.5 px-4 text-[#5D5B53]">100% non-electrical passive badge (zero spark risk); smartphone scanning occurs outside hazardous areas.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Safety Boundary Disclaimer */}
        <div className="p-4 rounded-xl bg-[#F6F1E7] border border-[#C5CEC0] flex items-start gap-3 text-xs text-[#5D5B53]">
          <Info className="w-5 h-5 text-[#71806B] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-[#292925]">Safety Boundary Disclaimer:</strong> SARVAS is an intrinsically non-electrical cumulative dosimeter prototype designed to complement active real-time sirens. Actual H₂S chemistry, exposure experiments, occupational limits, and plant deployment follow MRPL, DGMS, and OISD safety protocols.
          </p>
        </div>
      </div>

    </div>
  );
};
