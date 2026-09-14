import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CALIBRATION_DATASET } from '../data/calibrationData';
import type { CalibrationSample } from '../data/calibrationData';
import { StatusBadge } from '../components/StatusBadge';
import { Download, Search, Database, ArrowRight, LineChart as ChartIcon, Sparkles } from 'lucide-react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, Tooltip, CartesianGrid, ZAxis } from 'recharts';

export const CalibrationPage: React.FC = () => {
  const { setSelectedSample, setActivePage } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('ALL');

  const filteredSamples = CALIBRATION_DATASET.filter(s => {
    const matchesSearch =
      s.sampleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.actionFlag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.expiryStatus.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.targetDose.toString().includes(searchTerm);

    const matchesFilter =
      stageFilter === 'ALL' ||
      (stageFilter === 'STAGE1' && s.visualStage.includes('Stage 1')) ||
      (stageFilter === 'STAGE2' && s.visualStage.includes('Stage 2')) ||
      (stageFilter === 'STAGE3' && s.visualStage.includes('Stage 3')) ||
      (stageFilter === 'STAGE4' && s.visualStage.includes('Stage 4')) ||
      (stageFilter === 'STAGE5' && s.visualStage.includes('Stage 5')) ||
      (stageFilter === 'EXPIRED' && (s.visualStage.includes('Expired') || s.expiryStatus === 'EXPIRED'));

    return matchesSearch && matchesFilter;
  });

  const handleTestInScanner = (sample: CalibrationSample) => {
    setSelectedSample({
      id: sample.sampleId,
      name: `${sample.sampleId} — ${sample.actionFlag}`,
      badgeId: sample.sampleId,
      workerName: 'Simulated Exposure Subject',
      dosePpmH: sample.targetDose,
      status: sample.safetyStatus,
      confidenceScore: sample.safetyStatus === 'OUT_OF_CALIBRATION' ? 0 : 95,
      description: `Target Dose: ${sample.targetDose} ppm·h | Gas Conc: ${sample.gasConc} ppm for ${sample.exposureTime}h at ${sample.tempC}°C, ${sample.rh}% RH.`,
      stripColorHex: sample.hexColor,
      stripColorBg: 'bg-current',
      tempC: sample.tempC,
      humidityPercent: sample.rh,
      sampleTag: `${sample.sampleId}: ${sample.targetDose} ppm·h [${sample.actionFlag}]`,
      lab: sample.lab,
      deltaE: sample.deltaE,
      actionFlag: sample.actionFlag,
      expiryStatus: sample.expiryStatus,
      gasConc: sample.gasConc,
      exposureTime: sample.exposureTime,
      shelfAge: sample.shelfAge
    });
    setActivePage('scan');
  };

  const handleDownloadCSV = () => {
    const link = document.createElement('a');
    link.href = `${import.meta.env.BASE_URL}prototype_calibration.csv`;
    link.download = 'prototype_calibration.csv';
    link.click();
  };

  const chartData = CALIBRATION_DATASET.map(s => ({
    dose: s.targetDose,
    deltaE: s.deltaE,
    temp: s.tempC,
    id: s.sampleId,
    flag: s.actionFlag
  }));

  return (
    <div className="space-y-8 pb-16 text-[var(--text-primary)]">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-[var(--card-border)]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-[var(--accent-primary)]/15 border border-[var(--accent-primary)]/30 text-[var(--accent-primary)] text-[10.5px] font-mono font-bold uppercase tracking-wider">
              Cu-PAN Displacement Chemistry
            </span>
            <span className="text-xs text-[var(--text-secondary)] font-mono">260 Calibrated Prototype Records</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading tracking-tight flex items-center gap-2.5">
            <Database className="w-6 h-6 text-[var(--accent-primary)]" />
            <span>Dosimeter Calibration Dataset</span>
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Optical density and colorimetric displacement curves across cumulative exposure (0–44 ppm·h), temperature, and humidity.
          </p>
        </div>

        <button
          onClick={handleDownloadCSV}
          className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-black font-mono text-xs font-bold tracking-wide hover:shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-all flex items-center gap-2 cursor-pointer shadow-md"
        >
          <Download className="w-4 h-4 stroke-[2.5]" />
          <span>Download Cu-PAN CSV (260 Rows)</span>
        </button>
      </div>

      {/* PROTOTYPE NOTICE BANNER */}
      <div className="command-card rounded-2xl p-4 sm:p-5 border border-[var(--card-border)] flex items-start gap-3 text-xs shadow-md">
        <Sparkles className="w-5 h-5 text-[var(--accent-primary)] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
            Cu-PAN Chemical Displacement Matrix (Literature Anchored)
          </div>
          <p className="leading-relaxed text-[var(--text-secondary)]">
            Ground-truth calibration anchored in peer-reviewed passive H₂S colorimetry (Thongboon et al. 2023, Wang et al. 2022, Carpenter et al. 2017). Maps copper(II) 1-(2-pyridylazo)-2-naphthol displacement reaction to CIE L*a*b* coordinates and ΔEab* color difference.
          </p>
        </div>
      </div>

      {/* METRIC OVERVIEW CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="command-card p-4 rounded-2xl border border-[var(--card-border)] shadow-xs">
          <div className="text-[10px] font-mono font-bold text-[var(--text-secondary)] uppercase">TOTAL RECORDS</div>
          <div className="text-2xl font-bold font-mono text-[var(--text-primary)] mt-1">260</div>
          <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">Cu-PAN calibration curves</div>
        </div>
        <div className="command-card p-4 rounded-2xl border border-[var(--card-border)] shadow-xs">
          <div className="text-[10px] font-mono font-bold text-[var(--text-secondary)] uppercase">TARGET DOSE RANGE</div>
          <div className="text-2xl font-bold font-mono text-[var(--accent-primary)] mt-1">0.0 – 44.0</div>
          <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">ppm·h cumulative H₂S</div>
        </div>
        <div className="command-card p-4 rounded-2xl border border-[var(--card-border)] shadow-xs">
          <div className="text-[10px] font-mono font-bold text-[var(--text-secondary)] uppercase">MAX COLOR SHIFT (ΔE)</div>
          <div className="text-2xl font-bold font-mono text-[#38BDF8] mt-1">101.3</div>
          <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">CIE76 optical span</div>
        </div>
        <div className="command-card p-4 rounded-2xl border border-[var(--card-border)] shadow-xs">
          <div className="text-[10px] font-mono font-bold text-[var(--text-secondary)] uppercase">VALID VS EXPIRED</div>
          <div className="text-2xl font-bold font-mono text-[#10B981] mt-1">235 / 25</div>
          <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">Active vs Degraded Matrix</div>
        </div>
      </div>

      {/* CALIBRATION CURVE SCATTER CHART */}
      <div className="command-card p-5 sm:p-6 rounded-2xl border border-[var(--card-border)] shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold font-mono text-[var(--text-primary)] flex items-center gap-2">
              <ChartIcon className="w-4 h-4 text-[var(--accent-primary)]" />
              <span>Cu-PAN Dosimetry Calibration Curve: Color Difference (ΔEab*) vs Cumulative Exposure (ppm·h)</span>
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Colorimetric shift response from pristine deep violet (Stage 1) to saturated yellow-orange (Stage 5).
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-[var(--card-surface-subtle)] border border-[var(--card-border)] text-[10px] font-mono text-[var(--text-secondary)]">
            Empirical Displacement Model
          </span>
        </div>

        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
              <XAxis
                type="number"
                dataKey="dose"
                name="Cumulative Dose"
                unit=" ppm·h"
                stroke="currentColor"
                opacity={0.6}
                fontSize={11}
              />
              <YAxis
                type="number"
                dataKey="deltaE"
                name="Reference ΔE"
                unit=" ΔE"
                stroke="currentColor"
                opacity={0.6}
                fontSize={11}
              />
              <ZAxis range={[25, 60]} />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="command-card border border-[var(--card-border)] p-3 rounded-xl shadow-2xl text-xs font-mono space-y-1 bg-black/90 text-white">
                        <div className="font-bold text-[var(--accent-primary)]">{d.id}</div>
                        <div>Dose: {d.dose} ppm·h</div>
                        <div>ΔEab*: {d.deltaE}</div>
                        <div>Temp: {d.temp}°C</div>
                        <div className="text-[10px] text-[var(--text-secondary)] truncate max-w-[200px]">{d.flag}</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter name="Samples" data={chartData} fill="#F59E0B" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="command-card p-4 rounded-2xl border border-[var(--card-border)] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search sample ID, dose, flag..."
            className="w-full pl-9 pr-4 py-2 bg-[var(--card-surface-subtle)] rounded-xl border border-[var(--card-border)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
          />
        </div>

        {/* Filter Categories: Stages 1-5 + Expired */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {[
            { id: 'ALL', label: 'All (260)' },
            { id: 'STAGE1', label: 'Stage 1: Fresh' },
            { id: 'STAGE2', label: 'Stage 2: Trace' },
            { id: 'STAGE3', label: 'Stage 3: Action' },
            { id: 'STAGE4', label: 'Stage 4: Elevated' },
            { id: 'STAGE5', label: 'Stage 5: Saturated' },
            { id: 'EXPIRED', label: 'Out of Cal' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setStageFilter(f.id)}
              className={`px-3 py-1.5 rounded-full font-mono text-xs font-semibold transition-all cursor-pointer ${
                stageFilter === f.id
                  ? 'bg-[var(--accent-primary)] text-black font-bold shadow-xs'
                  : 'text-[var(--text-secondary)] bg-[var(--card-surface-subtle)] border border-[var(--card-border)] hover:text-[var(--text-primary)]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* DATASET TABLE (260 ROWS) */}
      <div className="command-card rounded-2xl border border-[var(--card-border)] shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-black/5 dark:bg-black/40 text-[var(--text-secondary)] font-mono border-b border-[var(--card-border)]">
              <tr>
                <th className="py-3 px-3.5 font-semibold">Sample ID</th>
                <th className="py-3 px-3.5 font-semibold">Strip Color</th>
                <th className="py-3 px-3.5 font-semibold">CIE L*, a*, b*</th>
                <th className="py-3 px-3.5 font-semibold">Target Dose</th>
                <th className="py-3 px-3.5 font-semibold">Gas Conc. / Time</th>
                <th className="py-3 px-3.5 font-semibold">Temp / RH</th>
                <th className="py-3 px-3.5 font-semibold">ΔEab*</th>
                <th className="py-3 px-3.5 font-semibold">Safety Status</th>
                <th className="py-3 px-3.5 font-semibold">Visual Stage / Flag</th>
                <th className="py-3 px-3.5 font-semibold text-right">Test Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--card-border)] font-mono">
              {filteredSamples.map(sample => (
                <tr key={sample.sampleId} className="hover:bg-white/[0.04] dark:hover:bg-white/[0.03] transition-colors">
                  <td className="py-3 px-3.5 font-bold text-[var(--text-primary)]">{sample.sampleId}</td>
                  
                  {/* Color Swatch */}
                  <td className="py-3 px-3.5">
                    <div className="flex items-center gap-1.5">
                      <div
                        className="w-5 h-5 rounded-md border border-white/20 shadow-xs"
                        style={{ backgroundColor: sample.hexColor }}
                        title={`Derived Hex: ${sample.hexColor}`}
                      />
                    </div>
                  </td>

                  <td className="py-3 px-3.5 text-[var(--text-secondary)]">{sample.rawColorString}</td>
                  <td className="py-3 px-3.5 font-bold text-[var(--text-primary)]">{sample.targetDose.toFixed(2)} ppm·h</td>
                  <td className="py-3 px-3.5 text-[var(--text-secondary)]">{sample.gasConc.toFixed(2)} ppm / {sample.exposureTime}h</td>
                  <td className="py-3 px-3.5 text-[var(--text-secondary)]">{sample.tempC}°C / {sample.rh}%</td>
                  <td className="py-3 px-3.5 font-bold text-[var(--accent-primary)]">{sample.deltaE.toFixed(1)}</td>
                  
                  <td className="py-3 px-3.5">
                    <StatusBadge status={sample.safetyStatus} size="sm" />
                  </td>

                  <td className="py-3 px-3.5">
                    <span className="text-[11px] font-sans font-medium text-[var(--text-primary)]">
                      {sample.actionFlag}
                    </span>
                  </td>

                  <td className="py-3 px-3.5 text-right font-sans">
                    <button
                      onClick={() => handleTestInScanner(sample)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[var(--card-surface-subtle)] border border-[var(--card-border)] hover:border-[var(--accent-primary)] text-[var(--accent-primary)] text-[10px] font-mono font-bold transition-all cursor-pointer shadow-xs"
                      title="Load this sample into the Read Wristband scanner"
                    >
                      <span>Load</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
