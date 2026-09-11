import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/StatusBadge';
import { 
  Camera, 
  Clock, 
  Tag, 
  MapPin, 
  AlertTriangle, 
  ShieldCheck, 
  HelpCircle, 
  ChevronRight, 
  History, 
  TrendingUp
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from 'recharts';

export const WorkerDashboardPage: React.FC = () => {
  const { 
    currentUser, 
    workers, 
    readings, 
    setActivePage, 
    setSelectedWorker, 
    openLoginModal 
  } = useApp();

  const [showColorScaleGuide, setShowColorScaleGuide] = useState(false);

  // Match the active worker from context or fallback to first worker
  const activeWorker = workers.find(
    w => w.workerId === currentUser?.employeeId || 
         w.badgeId === currentUser?.assignedBandId || 
         w.name.toLowerCase() === currentUser?.name.toLowerCase()
  ) || workers[0];

  // Shift target threshold is 1.00 ppm·h
  const targetShiftThreshold = 1.00;
  const currentDose = activeWorker?.currentDose ?? 0.72;
  const dosePercent = Math.min(100, Math.round((currentDose / targetShiftThreshold) * 100));

  // Filter readings specific to this worker
  const personalReadings = readings.filter(
    r => r.workerId === activeWorker.workerId || 
         r.badgeId === activeWorker.badgeId ||
         r.workerName.toLowerCase() === activeWorker.name.toLowerCase()
  );

  const handleOpenScan = () => {
    setSelectedWorker(activeWorker);
    setActivePage('scan');
  };

  const handleOpenHistory = () => {
    setActivePage('history');
  };

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      
      {/* Top Breadcrumb & Profile Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-[#D8D0C2]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-mono bg-[#4F5D4B]/15 text-[#4F5D4B] px-2.5 py-0.5 rounded font-bold uppercase tracking-wider border border-[#4F5D4B]/20">
              Personal Operator Session
            </span>
            <span className="text-[10px] font-mono text-[#878377]">
              MRPL Refinery Complex
            </span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-[#292925] tracking-tight">
            Hello, {activeWorker.name}
          </h1>
          <p className="text-xs text-[#5D5B53] flex flex-wrap items-center gap-2 mt-1">
            <span className="font-semibold text-[#292925]">{activeWorker.role || 'Process Operator'}</span>
            <span>·</span>
            <span>{activeWorker.department}</span>
            <span>·</span>
            <span className="font-mono text-[11px] text-[#71806B] font-bold">ID: {activeWorker.workerId}</span>
          </p>
        </div>

        {/* Action Pills & Switch Profile */}
        <div className="flex items-center gap-2">
          <button
            onClick={openLoginModal}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#D8D0C2] bg-[#EDE5D6] hover:bg-[#E2D8C5] text-xs text-[#292925] font-medium transition-all shadow-xs cursor-pointer"
            title="Switch Personnel Profile"
          >
            <div className="w-5 h-5 rounded-full bg-[#B08A55] text-white flex items-center justify-center text-[10px] font-bold font-mono">
              {activeWorker.name.slice(0, 2).toUpperCase()}
            </div>
            <span>Switch Role</span>
          </button>

          <button
            onClick={() => setActivePage('dashboard')}
            className="px-3 py-1.5 rounded-lg border border-[#D8D0C2] bg-[#EDE5D6]/60 hover:bg-[#EDE5D6] text-xs text-[#5D5B53] hover:text-[#292925] font-medium transition-colors cursor-pointer"
          >
            Plant Overview
          </button>
        </div>
      </div>

      {/* Workplace Zone & Shift Dossier Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Work Area */}
        <div className="bg-[#EDE5D6] border border-[#D8D0C2] rounded-xl p-3.5 flex items-start gap-3 shadow-xs">
          <MapPin className="w-4 h-4 text-[#71806B] shrink-0 mt-0.5" />
          <div className="text-xs leading-tight">
            <span className="text-[10px] font-mono uppercase text-[#878377] block font-semibold">Assigned Unit</span>
            <span className="font-bold text-[#292925] mt-0.5 block">{activeWorker.department}</span>
            <span className="text-[10px] text-[#5D5B53] mt-0.5 block font-serif">Cat-Cracking Deck B · Zone 1</span>
          </div>
        </div>

        {/* Shift Duration */}
        <div className="bg-[#EDE5D6] border border-[#D8D0C2] rounded-xl p-3.5 flex items-start gap-3 shadow-xs">
          <Clock className="w-4 h-4 text-[#71806B] shrink-0 mt-0.5" />
          <div className="text-xs leading-tight">
            <span className="text-[10px] font-mono uppercase text-[#878377] block font-semibold">Active Shift</span>
            <span className="font-bold text-[#292925] mt-0.5 block">{activeWorker.shift}</span>
            <span className="text-[10px] text-[#5D5B53] mt-0.5 block font-serif">Last read: {activeWorker.lastReadingTime || '11:37'}</span>
          </div>
        </div>

        {/* Assigned Band */}
        <div className="bg-[#EDE5D6] border border-[#D8D0C2] rounded-xl p-3.5 flex items-start gap-3 shadow-xs">
          <Tag className="w-4 h-4 text-[#71806B] shrink-0 mt-0.5" />
          <div className="text-xs leading-tight flex-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-[#878377] block font-semibold">Dosimeter Band</span>
              <span className="text-[10px] font-mono text-[#4F5D4B] font-bold">{activeWorker.badgeValidityDays}d valid</span>
            </div>
            <span className="font-mono font-bold text-sm text-[#292925] mt-0.5 block">{activeWorker.badgeId}</span>
            <span className="text-[10px] text-[#5D5B53] mt-0.5 block font-serif">Cu-PAN Optical Strip</span>
          </div>
        </div>
      </div>

      {/* Hero Exposure Gauge Card */}
      <div className="bg-[#EDE5D6] border border-[#D8D0C2] rounded-2xl p-6 sm:p-7 shadow-xs relative overflow-hidden">
        
        {/* Top Dose Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#5D5B53] font-bold block">
              Shift Cumulative H₂S Exposure
            </span>
            <p className="text-[11px] text-[#878377] font-serif mt-0.5">
              Integrated real-time dosage based on colorimetric strip analysis
            </p>
          </div>
          <StatusBadge status={activeWorker.status} size="lg" />
        </div>

        {/* Big Numbers */}
        <div className="flex items-baseline gap-3 mb-4">
          <span className="text-5xl sm:text-6xl font-mono font-bold text-[#292925] tracking-tight">
            {currentDose.toFixed(2)}
          </span>
          <div className="flex flex-col">
            <span className="text-base font-serif font-bold text-[#292925]">
              ppm·h
            </span>
            <span className="text-[11px] text-[#878377] font-mono">
              Action Level: 1.00 ppm·h
            </span>
          </div>
          <div className="ml-auto text-right hidden sm:block">
            <span className="text-2xl font-mono font-bold text-[#292925]">{dosePercent}%</span>
            <span className="text-[10px] text-[#878377] block font-mono">OF SHIFT THRESHOLD</span>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full bg-[#D8D0C2] h-3.5 rounded-full overflow-hidden p-0.5 mb-2.5">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              activeWorker.status === 'REVIEW'
                ? 'bg-[#9A6258]'
                : activeWorker.status === 'MONITOR'
                ? 'bg-[#B08A55]'
                : 'bg-[#5A7456]'
            }`}
            style={{ width: `${dosePercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-[#5D5B53] pt-1">
          <span className="font-mono text-[11px]">{dosePercent}% of allowable shift exposure</span>
          <span className="font-mono text-[11px] text-[#292925] font-semibold">
            Status: {activeWorker.status}
          </span>
        </div>

        {/* Dynamic Safety Advisory */}
        <div className="mt-5 pt-4 border-t border-[#D8D0C2]">
          {activeWorker.status === 'REVIEW' ? (
            <div className="flex items-start gap-2.5 text-[#7A342B] bg-[#9A6258]/10 p-3.5 rounded-xl border border-[#9A6258]/20">
              <AlertTriangle className="w-5 h-5 shrink-0 text-[#9A6258] mt-0.5" />
              <div>
                <span className="text-xs font-bold font-mono uppercase tracking-wider block">
                  Action Required: Shift Limit Exceeded
                </span>
                <p className="text-xs font-serif mt-0.5 text-[#7A342B] leading-relaxed">
                  Your cumulative exposure has exceeded 1.00 ppm·h. Report immediately to HSE Safety Officer (Kavita Sharma) and step out of catalytic area to clean air zone.
                </p>
              </div>
            </div>
          ) : activeWorker.status === 'MONITOR' ? (
            <div className="flex items-start gap-2.5 text-[#795726] bg-[#B08A55]/10 p-3.5 rounded-xl border border-[#B08A55]/25">
              <AlertTriangle className="w-5 h-5 shrink-0 text-[#B08A55] mt-0.5" />
              <div>
                <span className="text-xs font-bold font-mono uppercase tracking-wider block">
                  Advisory: Moderate Exposure Detected
                </span>
                <p className="text-xs font-serif mt-0.5 text-[#795726] leading-relaxed">
                  Cumulative shift dose is approaching the 1.00 ppm·h threshold. Wear personal breathing protection when servicing high-elevation flanges on Deck B.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2.5 text-[#385034] bg-[#5A7456]/10 p-3.5 rounded-xl border border-[#5A7456]/20">
              <ShieldCheck className="w-5 h-5 shrink-0 text-[#5A7456] mt-0.5" />
              <div>
                <span className="text-xs font-bold font-mono uppercase tracking-wider block">
                  Normal Safe Operating Range
                </span>
                <p className="text-xs font-serif mt-0.5 text-[#385034] leading-relaxed">
                  Dosimeter strip shows minimal chemical response. Cumulative exposure is well within OSHA / NIOSH shift limits. Continue standard work shift.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Prominent High-Contrast Scan Action CTA */}
      <div className="bg-[#292925] text-[#F6F1E7] rounded-2xl p-6 sm:p-7 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 border border-[#292925]">
        <div className="space-y-1.5 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="text-[10px] font-mono bg-[#71806B] text-[#F6F1E7] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              Ready to Scan
            </span>
            <span className="text-[11px] font-mono text-[#D8D0C2]">
              Assigned Band: {activeWorker.badgeId}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold tracking-tight">
            Read My Wristband Now
          </h2>
          <p className="text-xs text-[#D8D0C2]/80 max-w-md font-serif">
            Capture a clear photo of your wristband to extract optical strip absorbance, calculate ΔE, and sync your live dose.
          </p>
        </div>

        <button
          onClick={handleOpenScan}
          className="w-full sm:w-auto px-6 py-4 bg-[#71806B] hover:bg-[#5E6D58] text-[#F6F1E7] rounded-xl font-mono text-sm font-bold flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-all cursor-pointer whitespace-nowrap"
        >
          <Camera className="w-5 h-5" />
          <span>SCAN WRISTBAND</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* 2-Column Section: 7-Day Trend & Recent Scans */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left: 7-Day Dose History Chart */}
        <div className="bg-[#EDE5D6] rounded-xl border border-[#D8D0C2] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#71806B]" />
                <h3 className="text-sm font-bold text-[#292925]">7-Day Exposure Trend</h3>
              </div>
              <span className="text-[10px] font-mono text-[#878377]">
                Action Line: 1.00 ppm·h
              </span>
            </div>
            <p className="text-xs text-[#5D5B53] font-serif mb-4">
              Daily cumulative H₂S exposure across your last 7 work shifts
            </p>
          </div>

          <div className="h-52 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activeWorker.trend7Day} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#D8D0C2" opacity={0.6} />
                <XAxis dataKey="day" stroke="#878377" fontSize={11} tickLine={false} />
                <YAxis stroke="#878377" fontSize={11} tickLine={false} domain={[0, 1.5]} />
                <Tooltip
                  formatter={(value: any) => [`${Number(value).toFixed(2)} ppm·h`, 'Exposure']}
                  contentStyle={{
                    backgroundColor: '#292925',
                    borderColor: '#D8D0C2',
                    borderRadius: '8px',
                    fontSize: '11px',
                    color: '#F6F1E7'
                  }}
                  itemStyle={{ color: '#F6F1E7' }}
                />
                <ReferenceLine y={1.00} stroke="#9A6258" strokeDasharray="3 3" label={{ value: 'Limit', fill: '#9A6258', fontSize: 10 }} />
                <Bar 
                  dataKey="dose" 
                  fill="#71806B" 
                  radius={[4, 4, 0, 0]}
                  name="Dose (ppm·h)"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[11px] text-[#878377] font-mono pt-3 border-t border-[#D8D0C2] flex items-center justify-between">
            <span>Peak exposure: {Math.max(...activeWorker.trend7Day.map(t => t.dose)).toFixed(2)} ppm·h</span>
            <span>Weekly avg: {(activeWorker.trend7Day.reduce((a, b) => a + b.dose, 0) / activeWorker.trend7Day.length).toFixed(2)} ppm·h</span>
          </div>
        </div>

        {/* Right: Recent Scans Log */}
        <div className="bg-[#EDE5D6] rounded-xl border border-[#D8D0C2] shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="p-4 border-b border-[#D8D0C2] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-[#71806B]" />
              <div>
                <h3 className="text-sm font-bold text-[#292925]">Personal Scan Log</h3>
                <p className="text-[11px] text-[#5D5B53] font-serif">Verified readings logged for {activeWorker.badgeId}</p>
              </div>
            </div>
            <button
              onClick={handleOpenHistory}
              className="text-xs font-semibold text-[#4F5D4B] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-[#D8D0C2] overflow-y-auto max-h-56">
            {personalReadings.length > 0 ? (
              personalReadings.slice(0, 4).map((reading) => (
                <div key={reading.id} className="p-3.5 flex items-center justify-between hover:bg-[#E5DDCB]/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-8 rounded-xs border border-black/20 shrink-0 shadow-xs"
                      style={{ backgroundColor: reading.stripColorHex || '#71806B' }}
                      title={`Extracted color: ${reading.stripColorHex}`}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[#292925]">
                          {reading.dosePpmH.toFixed(2)} ppm·h
                        </span>
                        <StatusBadge status={reading.status} size="sm" />
                      </div>
                      <span className="text-[10px] text-[#5D5B53] font-mono block mt-0.5">
                        {reading.timestamp} · {reading.tempC}°C · {reading.humidityPercent}% RH
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-mono text-[#878377] block">
                      ΔE: {reading.rawDeltaE ? reading.rawDeltaE.toFixed(1) : '24.2'}
                    </span>
                    <span className="text-[9px] font-mono text-[#4F5D4B] font-bold">
                      {Math.round(reading.confidenceScore * 100)}% Conf.
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-[#5D5B53] font-serif">
                No scans recorded yet this shift for this wristband. Click "Scan Wristband" to take your initial reading.
              </div>
            )}
          </div>

          <div className="p-3 border-t border-[#D8D0C2] bg-[#EDE5D6]/80 text-[11px] font-mono text-[#878377] flex items-center justify-between">
            <span>Logged readings: {personalReadings.length}</span>
            <button
              onClick={handleOpenScan}
              className="text-[#4F5D4B] font-bold hover:underline cursor-pointer"
            >
              + New Reading
            </button>
          </div>
        </div>

      </div>

      {/* Colorimetric Strip Threshold Accordion */}
      <div className="bg-[#EDE5D6] border border-[#D8D0C2] rounded-xl p-4 shadow-xs">
        <button
          onClick={() => setShowColorScaleGuide(!showColorScaleGuide)}
          className="w-full flex items-center justify-between text-left cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-[#71806B]" />
            <span className="text-xs font-serif font-bold text-[#292925]">
              Cu-PAN Chemical Dosimeter Color Reference Guide
            </span>
          </div>
          <span className="text-xs font-mono text-[#4F5D4B] font-bold">
            {showColorScaleGuide ? 'Hide Scale ▲' : 'Inspect Scale ▼'}
          </span>
        </button>

        {showColorScaleGuide && (
          <div className="mt-4 pt-4 border-t border-[#D8D0C2] space-y-3">
            <p className="text-xs text-[#5D5B53] font-serif">
              The 118 wristband contains a copper-1-(2-pyridylazo)-2-naphthol (Cu-PAN) complex. Exposure to airborne H₂S breaks the complex, causing a visible shift from deep violet to yellow.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
              <div className="p-2.5 rounded-lg border border-[#D8D0C2] bg-[#F6F1E7]">
                <div className="h-6 rounded-md bg-[#3B284C] mb-1.5 shadow-xs" />
                <span className="text-[10px] font-mono font-bold text-[#292925] block">1. Baseline</span>
                <span className="text-[9px] text-[#5D5B53] block">Deep Violet (0.00 ppm·h)</span>
                <span className="text-[9px] text-[#4F5D4B] font-bold font-mono">NORMAL</span>
              </div>

              <div className="p-2.5 rounded-lg border border-[#D8D0C2] bg-[#F6F1E7]">
                <div className="h-6 rounded-md bg-[#5A2D52] mb-1.5 shadow-xs" />
                <span className="text-[10px] font-mono font-bold text-[#292925] block">2. Low Dose</span>
                <span className="text-[9px] text-[#5D5B53] block">Violet-Purple (0.20 ppm·h)</span>
                <span className="text-[9px] text-[#4F5D4B] font-bold font-mono">NORMAL</span>
              </div>

              <div className="p-2.5 rounded-lg border border-[#D8D0C2] bg-[#F6F1E7]">
                <div className="h-6 rounded-md bg-[#843644] mb-1.5 shadow-xs" />
                <span className="text-[10px] font-mono font-bold text-[#292925] block">3. Elevated</span>
                <span className="text-[9px] text-[#5D5B53] block">Reddish-Pink (0.72 ppm·h)</span>
                <span className="text-[9px] text-[#B08A55] font-bold font-mono">MONITOR</span>
              </div>

              <div className="p-2.5 rounded-lg border border-[#D8D0C2] bg-[#F6F1E7]">
                <div className="h-6 rounded-md bg-[#B45A28] mb-1.5 shadow-xs" />
                <span className="text-[10px] font-mono font-bold text-[#292925] block">4. High Dose</span>
                <span className="text-[9px] text-[#5D5B53] block">Amber-Orange (1.20 ppm·h)</span>
                <span className="text-[9px] text-[#9A6258] font-bold font-mono">REVIEW</span>
              </div>

              <div className="p-2.5 rounded-lg border border-[#D8D0C2] bg-[#F6F1E7]">
                <div className="h-6 rounded-md bg-[#D48818] mb-1.5 shadow-xs" />
                <span className="text-[10px] font-mono font-bold text-[#292925] block">5. Critical</span>
                <span className="text-[9px] text-[#5D5B53] block">Yellow-Orange (&gt;2.00 ppm·h)</span>
                <span className="text-[9px] text-[#9A6258] font-bold font-mono">REVIEW</span>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
