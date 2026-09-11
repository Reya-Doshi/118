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
    <div className="space-y-8">
      
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-[#D8D0C2]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#292925]">Shift Safety Overview</h1>
          <p className="text-xs text-[#5D5B53] mt-0.5 font-medium">Real-time cumulative dosimetry tracking & exposure flags</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          {/* Site Selector */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#EDE5D6] rounded border border-[#D8D0C2] text-[#292925] font-medium">
            <MapPin className="w-3.5 h-3.5 text-[#4F5D4B]" />
            <span>MRPL — Demo Facility</span>
          </div>

          {/* Date */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#EDE5D6] rounded border border-[#D8D0C2] text-[#5D5B53]">
            <Clock className="w-3.5 h-3.5 text-[#878377]" />
            <span className="font-mono">06 September 2026</span>
          </div>

          {/* Shift */}
          <div className="px-3 py-1.5 bg-[#E5EADF] rounded border border-[#C5CEC0] text-[#4F5D4B] font-semibold font-mono">
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
          <div className="bg-[#EDE5D6] rounded-xl border border-[#D8D0C2] shadow-xs overflow-hidden">
            <div className="p-4 border-b border-[#D8D0C2] flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-[#292925]">Current Shift Readings</h2>
                <p className="text-xs text-[#5D5B53]">Active dosimeter readings recorded this shift</p>
              </div>
              <button
                onClick={() => setActivePage('workers')}
                className="text-xs font-semibold text-[#4F5D4B] hover:underline flex items-center gap-1"
              >
                <span>View All Roster</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#E5DDCB] text-[#5D5B53] font-mono border-b border-[#D8D0C2]">
                  <tr>
                    <th className="py-2.5 px-4 font-medium">Worker</th>
                    <th className="py-2.5 px-4 font-medium">Badge</th>
                    <th className="py-2.5 px-4 font-medium">Dose Estimate</th>
                    <th className="py-2.5 px-4 font-medium">Status</th>
                    <th className="py-2.5 px-4 font-medium">Shift</th>
                    <th className="py-2.5 px-4 font-medium text-right">Last Reading</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D8D0C2]">
                  {workers.map(w => (
                    <tr
                      key={w.id}
                      onClick={() => handleWorkerClick(w.workerId)}
                      className="hover:bg-[#E5DDCB]/60 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4 font-medium text-[#292925]">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-[#D8D0C2] text-[#292925] flex items-center justify-center font-mono font-bold text-[10px]">
                            {w.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span>{w.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-[#5D5B53]">{w.badgeId}</td>
                      <td className="py-3 px-4 font-mono font-bold text-[#292925]">
                        {w.currentDose.toFixed(2)} ppm·h
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={w.status} size="sm" />
                      </td>
                      <td className="py-3 px-4 text-[#5D5B53]">{w.shift.split('·')[0]}</td>
                      <td className="py-3 px-4 font-mono text-[#878377] text-right">{w.lastReadingTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cumulative Shift Exposure Chart */}
          <div className="bg-[#EDE5D6] rounded-xl border border-[#D8D0C2] p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-[#292925]">Cumulative Exposure — Current Shift</h3>
                <p className="text-xs text-[#5D5B53]">Average vs Max ppm·h dosage trend across morning shift timeline</p>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#4F5D4B]" />
                  <span className="text-[#5D5B53]">Shift Avg</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#B08A55]" />
                  <span className="text-[#5D5B53]">Peak Flag</span>
                </div>
              </div>
            </div>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={SHIFT_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#D8D0C2" vertical={false} />
                  <XAxis dataKey="time" stroke="#878377" fontSize={11} tickLine={false} />
                  <YAxis stroke="#878377" fontSize={11} tickLine={false} unit=" ppm·h" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#292925', border: '1px solid #3E3C36', borderRadius: '6px', color: '#EDE5D6', fontSize: '11px' }}
                  />
                  <Line type="monotone" dataKey="avgDose" stroke="#4F5D4B" strokeWidth={2.5} dot={{ r: 3, fill: '#4F5D4B' }} />
                  <Line type="monotone" dataKey="maxDose" stroke="#B08A55" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3, fill: '#B08A55' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Right Column (1 col): Attention Required Alert Feed */}
        <div className="space-y-6">
          <div className="bg-[#EDE5D6] rounded-xl border border-[#D8D0C2] p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#D8D0C2] pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#9A6258]" />
                <div>
                  <h3 className="text-sm font-bold text-[#292925]">Safety Officer Alert Feed</h3>
                  <p className="text-[10px] text-[#5D5B53] font-serif">Lead Auditor: Mira Patel</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#9A6258]/15 text-[#7A342B] text-[10px] font-bold font-mono">
                {alerts.length} Active
              </span>
            </div>

            {/* Alert List */}
            <div className="space-y-2.5">
              {alerts.map(alert => (
                <div
                  key={alert.id}
                  onClick={() => handleWorkerClick(alert.workerId)}
                  className={`p-3.5 rounded-lg border transition-all space-y-1 group cursor-pointer ${
                    alert.type === 'REVIEW'
                      ? 'border-[#9A6258]/40 bg-[#F6E2DF]/40 hover:bg-[#F6E2DF]/70'
                      : 'border-[#D8D0C2] bg-[#F6F1E7] hover:border-[#B8B0A2]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold text-[#292925]">
                    <span className="flex items-center gap-1.5">
                      {alert.type === 'REVIEW' && <AlertTriangle className="w-3.5 h-3.5 text-[#9A6258]" />}
                      <span>{alert.title}</span>
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#878377] group-hover:text-[#4F5D4B] transition-colors" />
                  </div>
                  <p className="text-[11px] text-[#5D5B53] leading-relaxed">{alert.description}</p>
                  <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-[#878377]">
                    <span>Badge: {alert.badgeId}</span>
                    <span>{alert.timestamp} · Officer: Mira Patel</span>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Quick Scanner Shortcut Banner */}
          <div className="bg-[#292925] text-[#EDE5D6] p-5 rounded-xl border border-[#3E3C36] space-y-3 shadow-xs">
            <div className="flex items-center gap-2 text-[#C2CBBF] text-xs font-mono font-semibold">
              <Scan className="w-4 h-4" />
              <span>Safety Officer Tool</span>
            </div>
            <h4 className="text-sm font-semibold">Read New 118 Wristband</h4>
            <p className="text-xs text-[#A69F91] leading-relaxed">
              Capture or select colorimetric strip images beside reference scales for automated exposure estimation.
            </p>
            <button
              onClick={() => setActivePage('scan')}
              className="w-full py-2 rounded bg-[#4F5D4B] text-[#F6F1E7] text-xs font-medium hover:bg-[#3D493A] transition-colors"
            >
              Open Camera Scanner
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
