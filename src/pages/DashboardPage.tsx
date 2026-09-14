import React from 'react';
import { useApp } from '../context/AppContext';
import { MetricCard } from '../components/MetricCard';
import { StatusBadge } from '../components/StatusBadge';
import { SHIFT_TREND_DATA } from '../data/mockData';
import { Users, Scan, AlertTriangle, Clock, MapPin, ArrowUpRight, ChevronRight, ShieldAlert } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const DashboardPage: React.FC = () => {
  const { workers, setActivePage, setSelectedWorker, alerts } = useApp();

  const handleWorkerClick = (workerId: string) => {
    const found = workers.find(w => w.workerId === workerId || w.badgeId === workerId);
    if (found) {
      setSelectedWorker(found);
      setActivePage('workers');
    }
  };

  return (
    <div className="space-y-8 text-[var(--text-primary)]">
      
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-[var(--card-border)]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading tracking-tight text-[var(--text-primary)]">
            Shift Safety Overview
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5 font-medium">
            Real-time cumulative dosimetry tracking & exposure flags
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
          {/* Site Selector */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--card-surface-subtle)] rounded-full border border-[var(--card-border)] text-[var(--text-primary)] font-medium">
            <MapPin className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
            <span>MRPL — Claus SRU Facility</span>
          </div>

          {/* Date */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--card-surface-subtle)] rounded-full border border-[var(--card-border)] text-[var(--text-secondary)]">
            <Clock className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            <span>06 September 2026</span>
          </div>

          {/* Shift */}
          <div className="px-3 py-1.5 bg-[var(--accent-primary)]/15 rounded-full border border-[var(--accent-primary)]/30 text-[var(--accent-primary)] font-bold">
            Morning · 06:00–14:00
          </div>
        </div>
      </div>

      {/* SUMMARY METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="ACTIVE WORKERS"
          value={48}
          subtext="on morning shift"
          icon={Users}
          variant="accent"
        />
        <MetricCard
          label="WRISTBANDS SCANNED"
          value={42}
          subtext="87.5% compliance"
          icon={Scan}
        />
        <MetricCard
          label="EXPOSURE FLAGS"
          value={3}
          subtext="requires review"
          icon={AlertTriangle}
          variant="alert"
        />
        <MetricCard
          label="EXPIRING BADGES"
          value={2}
          subtext="< 7 days shelf-life"
          icon={Clock}
          variant="warning"
        />
      </div>

      {/* MAIN TWO-COLUMN DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2 cols): Current Shift Roster & Trend Chart */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Current Shift Table */}
          <div className="command-card rounded-2xl border border-[var(--card-border)] shadow-md overflow-hidden backdrop-blur-md">
            <div className="p-4 sm:p-5 border-b border-[var(--card-border)] flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold font-mono text-[var(--text-primary)]">Current Shift Readings</h2>
                <p className="text-xs text-[var(--text-secondary)]">Active dosimeter readings recorded this shift</p>
              </div>
              <button
                onClick={() => setActivePage('workers')}
                className="text-xs font-mono font-semibold text-[var(--accent-primary)] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View Full Roster</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-black/5 dark:bg-black/40 text-[var(--text-secondary)] font-mono border-b border-[var(--card-border)]">
                  <tr>
                    <th className="py-3 px-4 font-medium">Worker</th>
                    <th className="py-3 px-4 font-medium">Badge</th>
                    <th className="py-3 px-4 font-medium">Dose Estimate</th>
                    <th className="py-3 px-4 font-medium">Status</th>
                    <th className="py-3 px-4 font-medium">Shift</th>
                    <th className="py-3 px-4 font-medium text-right">Last Reading</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--card-border)] font-mono">
                  {workers.map(w => (
                    <tr
                      key={w.id}
                      onClick={() => handleWorkerClick(w.workerId)}
                      className="hover:bg-white/[0.04] dark:hover:bg-white/[0.03] cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4 font-medium text-[var(--text-primary)]">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[var(--card-surface-subtle)] border border-[var(--card-border)] text-[var(--accent-primary)] flex items-center justify-center font-mono font-bold text-[10px]">
                            {w.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span>{w.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[var(--text-secondary)]">{w.badgeId}</td>
                      <td className="py-3 px-4 font-bold text-[var(--text-primary)]">
                        {w.currentDose.toFixed(2)} ppm·h
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={w.status} size="sm" />
                      </td>
                      <td className="py-3 px-4 text-[var(--text-secondary)]">{w.shift.split('·')[0]}</td>
                      <td className="py-3 px-4 text-[var(--text-muted)] text-right">{w.lastReadingTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cumulative Shift Exposure Chart */}
          <div className="command-card rounded-2xl border border-[var(--card-border)] p-5 sm:p-6 shadow-md space-y-4 backdrop-blur-md">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold font-mono text-[var(--text-primary)]">Cumulative Exposure — Current Shift</h3>
                <p className="text-xs text-[var(--text-secondary)]">Average vs Peak dosage trend across morning shift timeline</p>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                  <span className="text-[var(--text-secondary)]">Shift Avg</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                  <span className="text-[var(--text-secondary)]">Peak Flag</span>
                </div>
              </div>
            </div>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={SHIFT_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} vertical={false} />
                  <XAxis dataKey="time" stroke="currentColor" opacity={0.5} fontSize={11} tickLine={false} />
                  <YAxis stroke="currentColor" opacity={0.5} fontSize={11} tickLine={false} unit=" ppm·h" />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'rgba(8, 10, 14, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#F3F4F6', fontSize: '11px', fontFamily: 'monospace' }}
                  />
                  <Line type="monotone" dataKey="avgDose" stroke="#10B981" strokeWidth={2.5} dot={{ r: 3, fill: '#10B981' }} />
                  <Line type="monotone" dataKey="maxDose" stroke="#F59E0B" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3, fill: '#F59E0B' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Right Column (1 col): Attention Required Alert Feed */}
        <div className="space-y-6">
          <div className="command-card rounded-2xl border border-[var(--card-border)] p-5 shadow-md space-y-4 backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-[var(--card-border)] pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#EF4444]" />
                <div>
                  <h3 className="text-sm font-bold font-mono text-[var(--text-primary)]">Safety Officer Alert Feed</h3>
                  <p className="text-[10px] text-[var(--text-secondary)] font-mono">Lead Auditor: Mira Patel</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#EF4444]/15 border border-[#EF4444]/30 text-[#EF4444] text-[10px] font-bold font-mono">
                {alerts.length} Active
              </span>
            </div>

            {/* Alert List */}
            <div className="space-y-2.5">
              {alerts.map(alert => (
                <div
                  key={alert.id}
                  onClick={() => handleWorkerClick(alert.workerId)}
                  className={`p-3.5 rounded-xl border transition-all space-y-1 group cursor-pointer ${
                    alert.type === 'REVIEW'
                      ? 'border-[#EF4444]/40 bg-[#EF4444]/10 hover:border-[#EF4444]'
                      : 'border-[var(--card-border)] bg-[var(--card-surface-subtle)] hover:border-[var(--accent-primary)]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold text-[var(--text-primary)]">
                    <span className="flex items-center gap-1.5">
                      {alert.type === 'REVIEW' && <AlertTriangle className="w-3.5 h-3.5 text-[#EF4444]" />}
                      <span>{alert.title}</span>
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[var(--text-secondary)] group-hover:text-[var(--accent-primary)] transition-colors" />
                  </div>
                  <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">{alert.description}</p>
                  <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-[var(--text-muted)]">
                    <span>Badge: {alert.badgeId}</span>
                    <span>{alert.timestamp} · Officer: Mira Patel</span>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Quick Scanner Shortcut Banner */}
          <div className="command-card p-5 rounded-2xl border border-[var(--card-border)] space-y-3 shadow-md backdrop-blur-md">
            <div className="flex items-center gap-2 text-[var(--accent-primary)] text-xs font-mono font-semibold">
              <Scan className="w-4 h-4" />
              <span>Safety Officer Tool</span>
            </div>
            <h4 className="text-sm font-semibold font-mono text-[var(--text-primary)]">Read New SARVAS Wristband</h4>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Capture or select colorimetric strip images beside reference scales for automated exposure estimation.
            </p>
            <button
              onClick={() => setActivePage('scan')}
              className="w-full py-2.5 rounded-full bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-black text-xs font-mono font-bold hover:shadow-[0_0_15px_rgba(245,158,11,0.5)] transition-all cursor-pointer shadow-sm"
            >
              Open Camera Scanner
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
