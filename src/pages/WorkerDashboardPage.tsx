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
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-[var(--card-border)]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-mono bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] px-2.5 py-0.5 rounded font-bold uppercase tracking-wider border border-[var(--accent-primary)]/30">
              Personal Operator Session
            </span>
            <span className="text-[10px] font-mono text-[var(--text-secondary)]">
              MRPL Refinery Complex · SARVAS
            </span>
          </div>
          <h1 className="text-3xl font-heading font-black text-[var(--text-primary)] tracking-tight">
            Hello, {activeWorker.name}
          </h1>
          <p className="text-xs text-[var(--text-secondary)] flex flex-wrap items-center gap-2 mt-1">
            <span className="font-semibold text-[var(--text-primary)]">{activeWorker.role || 'Process Operator'}</span>
            <span>·</span>
            <span>{activeWorker.department}</span>
            <span>·</span>
            <span className="font-mono text-[11px] text-[var(--accent-primary)] font-bold">ID: {activeWorker.workerId}</span>
          </p>
        </div>

        {/* Action Pills & Switch Profile */}
        <div className="flex items-center gap-2">
          <button
            onClick={openLoginModal}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--card-border)] bg-[var(--card-surface-subtle)] hover:bg-[var(--card-surface)] text-xs text-[var(--text-primary)] font-medium transition-all shadow-xs cursor-pointer"
            title="Switch Personnel Profile"
          >
            <div className="w-5 h-5 rounded-full bg-[var(--accent-secondary)] text-black flex items-center justify-center text-[10px] font-bold font-mono">
              {activeWorker.name.slice(0, 2).toUpperCase()}
            </div>
            <span>Switch Role</span>
          </button>

          <button
            onClick={() => setActivePage('dashboard')}
            className="px-3 py-1.5 rounded-lg border border-[var(--card-border)] bg-[var(--card-surface-subtle)] hover:bg-[var(--card-surface)] text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-medium transition-colors cursor-pointer"
          >
            Plant Overview
          </button>
        </div>
      </div>

      {/* Workplace Zone & Shift Dossier Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Work Area */}
        <div className="command-card border border-[var(--card-border)] rounded-xl p-3.5 flex items-start gap-3 shadow-xs">
          <MapPin className="w-4 h-4 text-[var(--accent-primary)] shrink-0 mt-0.5" />
          <div className="text-xs leading-tight">
            <span className="text-[10px] font-mono uppercase text-[var(--text-secondary)] block font-semibold">Assigned Unit</span>
            <span className="font-bold text-[var(--text-primary)] mt-0.5 block">{activeWorker.department}</span>
            <span className="text-[10px] text-[var(--text-secondary)] mt-0.5 block font-mono">Cat-Cracking Deck B · Zone 1</span>
          </div>
        </div>

        {/* Shift Duration */}
        <div className="command-card border border-[var(--card-border)] rounded-xl p-3.5 flex items-start gap-3 shadow-xs">
          <Clock className="w-4 h-4 text-[var(--accent-primary)] shrink-0 mt-0.5" />
          <div className="text-xs leading-tight">
            <span className="text-[10px] font-mono uppercase text-[var(--text-secondary)] block font-semibold">Active Shift</span>
            <span className="font-bold text-[var(--text-primary)] mt-0.5 block">{activeWorker.shift}</span>
            <span className="text-[10px] text-[var(--text-secondary)] mt-0.5 block font-mono">Last read: {activeWorker.lastReadingTime || '11:37'}</span>
          </div>
        </div>

        {/* Assigned Band */}
        <div className="command-card border border-[var(--card-border)] rounded-xl p-3.5 flex items-start gap-3 shadow-xs">
          <Tag className="w-4 h-4 text-[var(--accent-primary)] shrink-0 mt-0.5" />
          <div className="text-xs leading-tight flex-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-[var(--text-secondary)] block font-semibold">Dosimeter Band</span>
              <span className="text-[10px] font-mono text-[var(--accent-primary)] font-bold">{activeWorker.badgeValidityDays}d valid</span>
            </div>
            <span className="font-mono font-bold text-sm text-[var(--text-primary)] mt-0.5 block">{activeWorker.badgeId}</span>
            <span className="text-[10px] text-[var(--text-secondary)] mt-0.5 block font-mono">Cu-PAN Optical Strip</span>
          </div>
        </div>
      </div>

      {/* Hero Exposure Gauge Card */}
      <div className="command-card border border-[var(--card-border)] rounded-2xl p-6 sm:p-7 shadow-xs relative overflow-hidden">
        
        {/* Top Dose Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] font-bold block">
              Shift Cumulative H₂S Exposure
            </span>
            <p className="text-[11px] text-[var(--text-secondary)] font-mono mt-0.5">
              Integrated real-time dosage based on colorimetric strip analysis
            </p>
          </div>
          <StatusBadge status={activeWorker.status} size="lg" />
        </div>

        {/* Big Numbers */}
        <div className="flex items-baseline gap-3 mb-4">
          <span className="text-5xl sm:text-6xl font-mono font-bold text-[var(--text-primary)] tracking-tight">
            {currentDose.toFixed(2)}
          </span>
          <div className="flex flex-col">
            <span className="text-base font-bold text-[var(--text-primary)]">
              ppm·h
            </span>
            <span className="text-[11px] text-[var(--text-secondary)] font-mono">
              Action Level: 1.00 ppm·h
            </span>
          </div>
          <div className="ml-auto text-right hidden sm:block">
            <span className="text-2xl font-mono font-bold text-[var(--text-primary)]">{dosePercent}%</span>
            <span className="text-[10px] text-[var(--text-secondary)] block font-mono">OF SHIFT THRESHOLD</span>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full bg-[var(--card-surface-subtle)] border border-[var(--card-border)] h-3.5 rounded-full overflow-hidden p-0.5 mb-2.5">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              activeWorker.status === 'REVIEW'
                ? 'bg-[#EF4444]'
                : activeWorker.status === 'MONITOR'
                ? 'bg-[#F59E0B]'
                : 'bg-[#10B981]'
            }`}
            style={{ width: `${dosePercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] pt-1">
          <span className="font-mono text-[11px]">{dosePercent}% of allowable shift exposure</span>
          <span className="font-mono text-[11px] text-[var(--text-primary)] font-semibold">
            Status: {activeWorker.status}
          </span>
        </div>

        {/* Dynamic Safety Advisory */}
        <div className="mt-5 pt-4 border-t border-[var(--card-border)]">
          {activeWorker.status === 'REVIEW' ? (
            <div className="flex items-start gap-2.5 text-[#EF4444] bg-[#EF4444]/10 p-3.5 rounded-xl border border-[#EF4444]/20">
              <AlertTriangle className="w-5 h-5 shrink-0 text-[#EF4444] mt-0.5" />
              <div>
                <span className="text-xs font-bold font-mono uppercase tracking-wider block">
                  Action Required: Shift Limit Exceeded
                </span>
                <p className="text-xs font-mono mt-0.5 text-[#EF4444] leading-relaxed">
                  Your cumulative exposure has exceeded 1.00 ppm·h. Report immediately to HSE Safety Officer (Mira Patel) and step out of catalytic area to clean air zone.
                </p>
              </div>
            </div>
          ) : activeWorker.status === 'MONITOR' ? (
            <div className="flex items-start gap-2.5 text-[#F59E0B] bg-[#F59E0B]/10 p-3.5 rounded-xl border border-[#F59E0B]/25">
              <AlertTriangle className="w-5 h-5 shrink-0 text-[#F59E0B] mt-0.5" />
              <div>
                <span className="text-xs font-bold font-mono uppercase tracking-wider block">
                  Advisory: Moderate Exposure Detected
                </span>
                <p className="text-xs font-mono mt-0.5 text-[#F59E0B] leading-relaxed">
                  Cumulative shift dose is approaching the 1.00 ppm·h threshold. Wear personal breathing protection when servicing high-elevation flanges on Deck B.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2.5 text-[#10B981] bg-[#10B981]/10 p-3.5 rounded-xl border border-[#10B981]/20">
              <ShieldCheck className="w-5 h-5 shrink-0 text-[#10B981] mt-0.5" />
              <div>
                <span className="text-xs font-bold font-mono uppercase tracking-wider block">
                  Normal Safe Operating Range
                </span>
                <p className="text-xs font-mono mt-0.5 text-[#10B981] leading-relaxed">
                  Dosimeter strip shows minimal chemical response. Cumulative exposure is well within OSHA / NIOSH shift limits. Continue standard work shift.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Prominent High-Contrast Scan Action CTA */}
      <div className="command-card rounded-2xl p-6 sm:p-7 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 border border-[var(--accent-primary)]/40 bg-gradient-to-r from-[var(--card-surface)] to-[var(--card-surface-subtle)]">
        <div className="space-y-1.5 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="text-[10px] font-mono bg-[var(--accent-primary)] text-black px-2 py-0.5 rounded font-black uppercase tracking-wider">
              Ready to Scan
            </span>
            <span className="text-[11px] font-mono text-[var(--text-secondary)]">
              Assigned Band: {activeWorker.badgeId}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-heading font-bold tracking-tight text-[var(--text-primary)]">
            Read My Wristband Now
          </h2>
          <p className="text-xs text-[var(--text-secondary)] max-w-md font-mono">
            Capture a clear photo of your wristband to extract optical strip absorbance, calculate ΔE, and sync your live dose.
          </p>
        </div>

        <button
          onClick={handleOpenScan}
          className="w-full sm:w-auto px-6 py-4 bg-gradient-to-r from-[#FF9500] to-[#F59E0B] hover:shadow-[0_0_20px_rgba(255,149,0,0.5)] text-black rounded-xl font-mono text-sm font-black flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-all cursor-pointer whitespace-nowrap"
        >
          <Camera className="w-5 h-5" />
          <span>SCAN WRISTBAND</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* 2-Column Section: 7-Day Trend & Recent Scans */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left: 7-Day Dose History Chart */}
        <div className="command-card rounded-xl border border-[var(--card-border)] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[var(--accent-primary)]" />
                <h3 className="text-sm font-bold text-[var(--text-primary)]">7-Day Exposure Trend</h3>
              </div>
              <span className="text-[10px] font-mono text-[var(--text-secondary)]">
                Action Line: 1.00 ppm·h
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] font-mono mb-4">
              Daily cumulative H₂S exposure across your last 7 work shifts
            </p>
          </div>

          <div className="h-52 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activeWorker.trend7Day} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-[var(--card-border)]" opacity={0.6} />
                <XAxis dataKey="day" stroke="currentColor" className="text-[var(--text-secondary)]" fontSize={11} tickLine={false} />
                <YAxis stroke="currentColor" className="text-[var(--text-secondary)]" fontSize={11} tickLine={false} domain={[0, 1.5]} />
                <Tooltip
                  formatter={(value: any) => [`${Number(value).toFixed(2)} ppm·h`, 'Exposure']}
                  contentStyle={{
                    backgroundColor: '#0c0f12',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    fontSize: '11px',
                    color: '#fff'
                  }}
                  itemStyle={{ color: '#DFFF00' }}
                />
                <ReferenceLine y={1.00} stroke="#EF4444" strokeDasharray="3 3" label={{ value: 'Limit', fill: '#EF4444', fontSize: 10 }} />
                <Bar 
                  dataKey="dose" 
                  fill="#FF9500" 
                  radius={[4, 4, 0, 0]}
                  name="Dose (ppm·h)"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[11px] text-[var(--text-secondary)] font-mono pt-3 border-t border-[var(--card-border)] flex items-center justify-between">
            <span>Peak exposure: {Math.max(...activeWorker.trend7Day.map(t => t.dose)).toFixed(2)} ppm·h</span>
            <span>Weekly avg: {(activeWorker.trend7Day.reduce((a, b) => a + b.dose, 0) / activeWorker.trend7Day.length).toFixed(2)} ppm·h</span>
          </div>
        </div>

        {/* Right: Recent Scans Log */}
        <div className="command-card rounded-xl border border-[var(--card-border)] shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="p-4 border-b border-[var(--card-border)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-[var(--accent-primary)]" />
              <div>
                <h3 className="text-sm font-bold text-[var(--text-primary)]">Personal Scan Log</h3>
                <p className="text-[11px] text-[var(--text-secondary)] font-mono">Verified readings logged for {activeWorker.badgeId}</p>
              </div>
            </div>
            <button
              onClick={handleOpenHistory}
              className="text-xs font-semibold text-[var(--accent-primary)] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-[var(--card-border)] overflow-y-auto max-h-56">
            {personalReadings.length > 0 ? (
              personalReadings.slice(0, 4).map((reading) => (
                <div key={reading.id} className="p-3.5 flex items-center justify-between hover:bg-[var(--card-surface-subtle)] transition-colors">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-8 rounded-xs border border-white/20 shrink-0 shadow-xs"
                      style={{ backgroundColor: reading.stripColorHex || '#795185' }}
                      title={`Extracted color: ${reading.stripColorHex}`}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[var(--text-primary)]">
                          {reading.dosePpmH.toFixed(2)} ppm·h
                        </span>
                        <StatusBadge status={reading.status} size="sm" />
                      </div>
                      <span className="text-[10px] text-[var(--text-secondary)] font-mono block mt-0.5">
                        {reading.timestamp} · {reading.tempC}°C · {reading.humidityPercent}% RH
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-mono text-[var(--text-secondary)] block">
                      ΔE: {reading.rawDeltaE ? reading.rawDeltaE.toFixed(1) : '24.2'}
                    </span>
                    <span className="text-[9px] font-mono text-[var(--accent-primary)] font-bold">
                      {Math.round(reading.confidenceScore * 100)}% Conf.
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-[var(--text-secondary)] font-mono">
                No scans recorded yet this shift for this wristband. Click "Scan Wristband" to take your initial reading.
              </div>
            )}
          </div>

          <div className="p-3 border-t border-[var(--card-border)] bg-[var(--card-surface-subtle)] text-[11px] font-mono text-[var(--text-secondary)] flex items-center justify-between">
            <span>Logged readings: {personalReadings.length}</span>
            <button
              onClick={handleOpenScan}
              className="text-[var(--accent-primary)] font-bold hover:underline cursor-pointer"
            >
              + New Reading
            </button>
          </div>
        </div>

      </div>

      {/* Colorimetric Strip Threshold Accordion */}
      <div className="command-card border border-[var(--card-border)] rounded-xl p-4 shadow-xs">
        <button
          onClick={() => setShowColorScaleGuide(!showColorScaleGuide)}
          className="w-full flex items-center justify-between text-left cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-[var(--accent-primary)]" />
            <span className="text-xs font-bold text-[var(--text-primary)] font-mono uppercase tracking-wider">
              Cu-PAN Chemical Dosimeter Color Reference Guide (Stages 1–5)
            </span>
          </div>
          <span className="text-xs font-mono text-[var(--accent-primary)] font-bold">
            {showColorScaleGuide ? 'Hide Scale ▲' : 'Inspect Scale ▼'}
          </span>
        </button>

        {showColorScaleGuide && (
          <div className="mt-4 pt-4 border-t border-[var(--card-border)] space-y-3">
            <p className="text-xs text-[var(--text-secondary)] font-mono">
              The SARVAS wristband contains a copper-1-(2-pyridylazo)-2-naphthol complex: <span className="text-[var(--accent-primary)] font-bold">Cu(PAN)₂ + H₂S → CuS↓ + 2 H-PAN</span>. Exposure shifts color from deep violet to yellow-orange. Beige, brown, or black indicates out of calibration.
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              <div className="p-2.5 rounded-lg border border-[var(--card-border)] bg-[var(--card-surface-subtle)]">
                <div className="h-6 rounded-md bg-[#795185] mb-1.5 shadow-xs border border-white/20" />
                <span className="text-[10px] font-mono font-bold text-[var(--text-primary)] block">Stage 1</span>
                <span className="text-[9px] text-[var(--text-secondary)] block">Deep violet (~0–0.49 ppm·h)</span>
                <span className="text-[9px] text-[#10B981] font-bold font-mono">NORMAL</span>
              </div>

              <div className="p-2.5 rounded-lg border border-[var(--card-border)] bg-[var(--card-surface-subtle)]">
                <div className="h-6 rounded-md bg-[#935881] mb-1.5 shadow-xs border border-white/20" />
                <span className="text-[10px] font-mono font-bold text-[var(--text-primary)] block">Stage 2</span>
                <span className="text-[9px] text-[var(--text-secondary)] block">Violet-purple (~0.50–0.99)</span>
                <span className="text-[9px] text-[#F59E0B] font-bold font-mono">MONITOR</span>
              </div>

              <div className="p-2.5 rounded-lg border border-[var(--card-border)] bg-[var(--card-surface-subtle)]">
                <div className="h-6 rounded-md bg-[#c96b70] mb-1.5 shadow-xs border border-white/20" />
                <span className="text-[10px] font-mono font-bold text-[var(--text-primary)] block">Stage 3</span>
                <span className="text-[9px] text-[var(--text-secondary)] block">Reddish / pink (~1.00–2.00)</span>
                <span className="text-[9px] text-[#EF4444] font-bold font-mono">REVIEW</span>
              </div>

              <div className="p-2.5 rounded-lg border border-[var(--card-border)] bg-[var(--card-surface-subtle)]">
                <div className="h-6 rounded-md bg-[#d8796a] mb-1.5 shadow-xs border border-white/20" />
                <span className="text-[10px] font-mono font-bold text-[var(--text-primary)] block">Stage 4</span>
                <span className="text-[9px] text-[var(--text-secondary)] block">Amber-orange (~2–10)</span>
                <span className="text-[9px] text-[#EF4444] font-bold font-mono">REVIEW</span>
              </div>

              <div className="p-2.5 rounded-lg border border-[var(--card-border)] bg-[var(--card-surface-subtle)]">
                <div className="h-6 rounded-md bg-[#fdb937] mb-1.5 shadow-xs border border-white/20" />
                <span className="text-[10px] font-mono font-bold text-[var(--text-primary)] block">Stage 5</span>
                <span className="text-[9px] text-[var(--text-secondary)] block">Yellow-orange (~10–30+)</span>
                <span className="text-[9px] text-[#EF4444] font-bold font-mono">REVIEW</span>
              </div>

              <div className="p-2.5 rounded-lg border border-red-500/30 bg-red-500/5">
                <div className="h-6 rounded-md bg-[#5c4838] mb-1.5 shadow-xs border border-white/20" />
                <span className="text-[10px] font-mono font-bold text-[var(--text-primary)] block">Out of Cal</span>
                <span className="text-[9px] text-[var(--text-secondary)] block">Beige / brown / black</span>
                <span className="text-[8px] text-[#EF4444] font-bold font-mono">DO NOT ESTIMATE</span>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
