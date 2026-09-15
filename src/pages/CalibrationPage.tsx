import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CALIBRATION_DATASET } from '../data/calibrationData';
import type { CalibrationSample } from '../data/calibrationData';
import { Download, Search, Database, ArrowRight, ShieldAlert, LineChart as ChartIcon } from 'lucide-react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, Tooltip, CartesianGrid, ZAxis } from 'recharts';

export const CalibrationPage: React.FC = () => {
  const { setSelectedSample, setActivePage } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [flagFilter, setFlagFilter] = useState<string>('ALL');

  const filteredSamples = CALIBRATION_DATASET.filter(s => {
    const matchesSearch =
      s.sampleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.actionFlag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.expiryStatus.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.targetDose.toString().includes(searchTerm);

    const matchesFilter =
      flagFilter === 'ALL' ||
      (flagFilter === 'EXPIRED' && s.expiryStatus === 'EXPIRED') ||
      (flagFilter === 'SAFE' && (s.actionFlag.includes('Normal') || s.actionFlag.includes('Baseline'))) ||
      (flagFilter === 'ACTION' && s.actionFlag.includes('Action Level')) ||
      (flagFilter === 'PEL' && s.actionFlag.includes('PEL')) ||
      (flagFilter === 'CRITICAL' && (s.actionFlag.includes('Critical') || s.actionFlag.includes('Exceeded')));

    return matchesSearch && matchesFilter;
  });

  const handleTestInScanner = (sample: CalibrationSample) => {
    // Map sample to DemoSample
    setSelectedSample({
      id: sample.sampleId,
      name: `${sample.sampleId} — ${sample.actionFlag}`,
      badgeId: sample.sampleId,
      workerName: 'Simulated Exposure Subject',
      dosePpmH: sample.targetDose,
      status: sample.safetyStatus,
      confidenceScore: sample.expiryStatus === 'EXPIRED' ? 74 : 94,
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
    link.href = `${import.meta.env.BASE_URL}calibration_dataset.csv`;
    link.download = 'calibration_dataset.csv';
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
    <div className="space-y-8 pb-16">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-[#D8D0C2]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#B08A55]/20 border border-[#B08A55]/40 text-[#292925] text-[10px] font-mono font-bold uppercase tracking-wider">
              Prototype / Simulated Data
            </span>
            <span className="text-xs text-[#292925]/60 font-mono">120 Synthetic Calibration Records</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#292925] flex items-center gap-2.5">
            <Database className="w-6 h-6 text-[#4F5D4B]" />
            <span>Dosimeter Calibration Dataset</span>
          </h1>
          <p className="text-xs text-[#292925]/70 mt-0.5">
            Simulated optical density calibration curves across exposure dosage, temperature, and humidity.
          </p>
        </div>

        <button
          onClick={handleDownloadCSV}
          className="px-4 py-2.5 rounded-lg bg-[#4F5D4B] text-[#F6F1E7] text-xs font-semibold tracking-wide hover:bg-[#3d493a] transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
        >
          <Download className="w-4 h-4 text-[#F6F1E7]" />
          <span>Download CSV (120 Rows)</span>
        </button>
      </div>

      {/* PROTOTYPE DISCLAIMER BANNER */}
      <div className="bg-[#B08A55]/15 border border-[#B08A55]/35 rounded-xl p-4 flex items-start gap-3 text-xs text-[#292925]">
        <ShieldAlert className="w-5 h-5 text-[#B08A55] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold uppercase tracking-wider text-[#292925]">Prototype Calibration Dataset Notice</div>
          <p className="leading-relaxed text-[#292925]/80">
            This is a <strong>simulated prototype dataset</strong> created to demonstrate the AI-assisted colorimetric reading workflow, CIE L*a*b* extraction, ΔE computation, and environmental temperature/humidity compensation. It is not experimental laboratory data. Full production deployment requires chemical calibration and validation in a certified laboratory environment.
          </p>
        </div>
      </div>

      {/* METRIC OVERVIEW CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#EDE5D6]/30 p-4 rounded-xl border border-[#D8D0C2] shadow-xs">
          <div className="text-[10px] font-mono font-bold text-[#292925]/60 uppercase">TOTAL SAMPLES</div>
          <div className="text-2xl font-bold font-mono text-[#292925] mt-1">120</div>
          <div className="text-[11px] text-[#292925]/70 mt-0.5">Full simulated range</div>
        </div>
        <div className="bg-[#EDE5D6]/30 p-4 rounded-xl border border-[#D8D0C2] shadow-xs">
          <div className="text-[10px] font-mono font-bold text-[#292925]/60 uppercase">TARGET DOSE RANGE</div>
          <div className="text-2xl font-bold font-mono text-[#292925] mt-1">0.0 – 160.0</div>
          <div className="text-[11px] text-[#292925]/70 mt-0.5">ppm·h cumulative H₂S</div>
        </div>
        <div className="bg-[#EDE5D6]/30 p-4 rounded-xl border border-[#D8D0C2] shadow-xs">
          <div className="text-[10px] font-mono font-bold text-[#292925]/60 uppercase">MAX COLOR SHIFT (ΔE)</div>
          <div className="text-2xl font-bold font-mono text-[#292925] mt-1">69.5</div>
          <div className="text-[11px] text-[#292925]/70 mt-0.5">ΔEab* optical range</div>
        </div>
        <div className="bg-[#EDE5D6]/30 p-4 rounded-xl border border-[#D8D0C2] shadow-xs">
          <div className="text-[10px] font-mono font-bold text-[#292925]/60 uppercase">BADGE LIFECYCLE</div>
          <div className="text-2xl font-bold font-mono text-[#4F5D4B] mt-1">107 / 13</div>
          <div className="text-[11px] text-[#292925]/70 mt-0.5">Active vs Expired Rejects</div>
        </div>
      </div>

      {/* CALIBRATION CURVE SCATTER CHART */}
      <div className="bg-[#EDE5D6]/30 p-5 rounded-xl border border-[#D8D0C2] shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-[#292925] flex items-center gap-2">
              <ChartIcon className="w-4 h-4 text-[#4F5D4B]" />
              <span>Simulated Calibration Response Curve: Color Difference (ΔEab*) vs Cumulative Dose (ppm·h)</span>
            </h3>
            <p className="text-xs text-[#292925]/70">
              Optical density progressive response under varying thermal and humidity conditions.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded bg-[#EDE5D6] border border-[#D8D0C2] text-[10px] font-mono text-[#292925]/70">
            Beer-Lambert Model
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#D8D0C2" opacity={0.6} />
              <XAxis
                type="number"
                dataKey="dose"
                name="Cumulative Dose"
                unit=" ppm·h"
                stroke="#292925"
                opacity={0.6}
                fontSize={11}
              />
              <YAxis
                type="number"
                dataKey="deltaE"
                name="Reference ΔE"
                unit=" ΔE"
                stroke="#292925"
                opacity={0.6}
                fontSize={11}
              />
              <ZAxis range={[30, 70]} />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="bg-[#292925] text-[#F6F1E7] border border-[#D8D0C2] p-3 rounded-lg shadow-xl text-xs font-mono space-y-1">
                        <div className="font-bold text-[#71806B]">{d.id}</div>
                        <div>Dose: {d.dose} ppm·h</div>
                        <div>ΔEab*: {d.deltaE}</div>
                        <div>Temp: {d.temp}°C</div>
                        <div className="text-[10px] text-[#B08A55]">{d.flag}</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter name="Samples" data={chartData} fill="#4F5D4B" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-[#EDE5D6]/40 p-4 rounded-xl border border-[#D8D0C2] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#292925]/50 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search sample ID, dose, flag..."
            className="w-full pl-9 pr-4 py-2 bg-[#F6F1E7] rounded-lg border border-[#D8D0C2] text-xs text-[#292925] focus:outline-none focus:border-[#4F5D4B]"
          />
        </div>

        {/* Filter Categories */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {[
            { id: 'ALL', label: 'All (120)' },
            { id: 'SAFE', label: 'Clean / Safe' },
            { id: 'ACTION', label: 'Action Level' },
            { id: 'PEL', label: 'PEL / Limit' },
            { id: 'CRITICAL', label: 'Critical' },
            { id: 'EXPIRED', label: 'Expired' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFlagFilter(f.id)}
              className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                flagFilter === f.id
                  ? 'bg-[#292925] text-[#F6F1E7]'
                  : 'text-[#292925]/70 bg-[#F6F1E7] border border-[#D8D0C2] hover:bg-[#EDE5D6]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* DATASET TABLE (120 ROWS) */}
      <div className="bg-[#EDE5D6]/30 rounded-xl border border-[#D8D0C2] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#EDE5D6] text-[#292925]/80 font-mono border-b border-[#D8D0C2]">
              <tr>
                <th className="py-3 px-3.5 font-semibold">Sample ID</th>
                <th className="py-3 px-3.5 font-semibold">Strip Color</th>
                <th className="py-3 px-3.5 font-semibold">Raw L*, a*, b*</th>
                <th className="py-3 px-3.5 font-semibold">Target Dose</th>
                <th className="py-3 px-3.5 font-semibold">Gas Conc. / Time</th>
                <th className="py-3 px-3.5 font-semibold">Temp / RH</th>
                <th className="py-3 px-3.5 font-semibold">ΔEab*</th>
                <th className="py-3 px-3.5 font-semibold">Expiry Status</th>
                <th className="py-3 px-3.5 font-semibold">Action / Compliance Flag</th>
                <th className="py-3 px-3.5 font-semibold text-right">Demo Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8D0C2]/70 font-mono">
              {filteredSamples.map(sample => (
                <tr key={sample.sampleId} className="hover:bg-[#EDE5D6]/60 transition-colors">
                  <td className="py-3 px-3.5 font-bold text-[#292925]">{sample.sampleId}</td>
                  
                  {/* Swatch */}
                  <td className="py-3 px-3.5">
                    <div className="flex items-center gap-1.5">
                      <div
                        className="w-5 h-5 rounded-xs border border-black/20 shadow-xs"
                        style={{ backgroundColor: sample.hexColor }}
                        title={`Derived Hex: ${sample.hexColor}`}
                      />
                    </div>
                  </td>

                  <td className="py-3 px-3.5 text-[#292925]/70">{sample.rawColorString}</td>
                  <td className="py-3 px-3.5 font-bold text-[#292925]">{sample.targetDose.toFixed(1)} ppm·h</td>
                  <td className="py-3 px-3.5 text-[#292925]/70">{sample.gasConc.toFixed(2)} ppm / {sample.exposureTime}h</td>
                  <td className="py-3 px-3.5 text-[#292925]/70">{sample.tempC}°C / {sample.rh}%</td>
                  <td className="py-3 px-3.5 font-bold text-[#4F5D4B]">{sample.deltaE.toFixed(1)}</td>
                  
                  <td className="py-3 px-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      sample.expiryStatus === 'EXPIRED'
                        ? 'bg-[#9A6258]/20 text-[#9A6258] border border-[#9A6258]/30'
                        : sample.expiryStatus.includes('Fresh')
                        ? 'bg-[#71806B]/20 text-[#4F5D4B] border border-[#71806B]/30'
                        : 'bg-[#B08A55]/20 text-[#B08A55] border border-[#B08A55]/30'
                    }`}>
                      {sample.expiryStatus}
                    </span>
                  </td>

                  <td className="py-3 px-3.5">
                    <span className="text-[11px] font-sans font-medium text-[#292925]">
                      {sample.actionFlag}
                    </span>
                  </td>

                  <td className="py-3 px-3.5 text-right font-sans">
                    <button
                      onClick={() => handleTestInScanner(sample)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#4F5D4B] text-[#F6F1E7] text-[10px] font-semibold hover:bg-[#3d493a] transition-colors cursor-pointer"
                      title="Load this sample into the Read Wristband scanner"
                    >
                      <span>Load in Scanner</span>
                      <ArrowRight className="w-3 h-3 text-[#F6F1E7]" />
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
