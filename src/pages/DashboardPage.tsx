import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MetricCard } from '../components/MetricCard';
import { StatusBadge } from '../components/StatusBadge';
import { SHIFT_TREND_DATA } from '../data/mockData';
import { 
  Users, 
  Scan, 
  AlertTriangle, 
  Clock, 
  MapPin, 
  ArrowUpRight, 
  ChevronRight, 
  ShieldAlert, 
  ShieldCheck, 
  Wind, 
  Radio, 
  FileCheck2, 
  UserCheck,
  Download,
  Search,
  FileSpreadsheet,
  Printer,
  X,
  History,
  Activity
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from 'recharts';

export const DashboardPage: React.FC = () => {
  const { workers, readings, setActivePage, alerts, currentUser, showToast } = useApp();
  const [scrubberActive, setScrubberActive] = useState(false);
  const [broadcastActive, setBroadcastActive] = useState(false);
  const [auditSigned, setAuditSigned] = useState(false);

  // Deliverable 3: Exposure Logs & Worker History state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'NORMAL' | 'MONITOR' | 'REVIEW'>('ALL');
  const [inspectorWorker, setInspectorWorker] = useState<any | null>(null);

  const isAdmin = currentUser?.role === 'ADMIN';

  const handleScrubberToggle = () => {
    setScrubberActive(!scrubberActive);
    showToast(!scrubberActive ? 'HVAC Scrubber Bank 2 elevated to 100% Emergency Airflow' : 'HVAC Scrubber returned to standard cycling mode');
  };

  const handleBroadcast = () => {
    setBroadcastActive(true);
    showToast('🚨 Plant-Wide H2S Caution Broadcasted to All Pagers & Radios');
  };

  const handleAuditSign = () => {
    setAuditSigned(true);
    showToast('✅ OSHA 1910.1000 Shift Dosimetry Log Signed by Plant Admin');
  };

  const handleWorkerClick = (workerId: string) => {
    const found = workers.find(w => w.workerId === workerId || w.badgeId === workerId);
    if (found) {
      setInspectorWorker(found);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Timestamp', 'Worker Name', 'Worker ID', 'Badge ID', 'Shift', 'Dose (ppm·h)', 'Status', 'Location', 'Confidence (%)'];
    const rows = readings.map(r => [
      r.timeAgo || r.timestamp,
      `"${r.workerName}"`,
      r.workerId,
      r.badgeId,
      `"${r.shift}"`,
      r.dosePpmH.toFixed(2),
      r.status,
      `"${r.location}"`,
      `${r.confidenceScore}%`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SARVAS_Exposure_Audit_Logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exposure logs successfully exported to CSV.');
  };

  const handleExportOSHA = () => {
    const oshaContent = `==========================================================\n` +
      `OSHA FORM 300 COMPLIANCE SUMMARY & AUDIT LOG\n` +
      `SARVAS by RageB8 Industrial Passive Chemical Dosimeter\n` +
      `==========================================================\n\n` +
      `Facility: MRPL Refinery Sector 4 (Demo Unit)\n` +
      `Shift Date: ${new Date().toLocaleDateString()}\n` +
      `Safety Officer: Mira Patel (HSE-4012)\n` +
      `Plant Administrator: Level 1 HSE Governance\n\n` +
      `SUMMARY OF MONITORED PERSONNEL:\n` +
      `----------------------------------------------------------\n` +
      `Total Registered Operators: ${workers.length}\n` +
      `Shift Exposure Scans Logged: ${readings.length}\n` +
      `Normal Status (<= 0.50 ppm·h): ${workers.filter(w => w.status === 'NORMAL').length}\n` +
      `Action Level Required (0.50 - 1.00 ppm·h): ${workers.filter(w => w.status === 'MONITOR').length}\n` +
      `Critical Overexposure Flags (> 1.00 ppm·h): ${workers.filter(w => w.status === 'REVIEW').length}\n\n` +
      `REGULATORY STANDARD:\n` +
      `OSHA 1910.1000 Table Z-2 Permissible Exposure Limit: 1.00 ppm·h\n` +
      `ACGIH 8-Hour Threshold Limit Value (TLV): 1.00 ppm·h\n` +
      `Status: AUDIT SEALED & ELECTRONICALLY SIGNED\n`;
    const blob = new Blob([oshaContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `OSHA_300_Safety_Audit_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('OSHA 300 Compliance Log exported.');
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-[#D8D0C2]">
        <div className="flex items-center gap-3.5">
          <img 
            src="/sarvas_logo_v2.png" 
            alt="RageB8 Logo" 
            className="w-12 h-12 rounded-2xl object-contain bg-white p-1 border border-[#D8D0C2] shadow-xs shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-[#292925]">
                {isAdmin ? 'Facility Executive Overview & HSE Governance' : 'Shift Safety Overview'}
              </h1>
              {isAdmin ? (
                <span className="px-2.5 py-0.5 rounded-full bg-[#9A6258]/15 border border-[#9A6258]/30 text-[#7A342B] text-[10px] font-mono font-bold uppercase tracking-wider">
                  Admin Privileges Active
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-[#71806B]/15 border border-[#71806B]/30 text-[#4F5D4B] text-[10px] font-mono font-bold uppercase tracking-wider">
                  Safety Officer View
                </span>
              )}
            </div>
            <p className="text-xs text-[#5D5B53] mt-0.5 font-medium">
              {isAdmin 
                ? 'Plant-wide administrative precautions, batch calibration verification & emergency controls' 
                : 'Real-time cumulative dosimetry tracking & exposure flags'}
            </p>
          </div>
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

      {/* SAFETY MANAGER AUDIT & EXPORT SUITE (Deliverable 3) */}
      <div className="bg-white p-4 rounded-xl border border-[#D8D0C2] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#4F5D4B] text-[#F6F1E7] flex items-center justify-center shrink-0">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#292925] block">Safety Manager Exposure Logs &amp; Audit Suite</span>
            <span className="text-[10px] text-[#5D5B53] font-mono">OSHA 1910.1000 &amp; NIOSH Shift Dosimetry Registry</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 rounded-lg bg-[#4F5D4B] hover:bg-[#3d493a] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            title="Download full exposure logs in CSV format"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleExportOSHA}
            className="px-3 py-1.5 rounded-lg bg-[#292925] hover:bg-black text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            title="Export OSHA 300 Safety Summary"
          >
            <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>OSHA 300 Log</span>
          </button>
          <button
            onClick={handlePrintReport}
            className="px-3 py-1.5 rounded-lg border border-[#D8D0C2] bg-[#EDE5D6] hover:bg-[#E5DDCB] text-[#292925] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Print Shift Audit Report"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* ADMIN PRECAUTIONARY COMMAND DIRECTIVES (Highlighted when Admin is logged in) */}
      {isAdmin && (
        <div className="bg-[#EDE5D6]/40 p-5 rounded-xl border border-[#D8D0C2] shadow-xs space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#D8D0C2] pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#4F5D4B]" />
              <div>
                <h3 className="text-sm font-bold text-[#292925]">Facility Executive Precaution & Control Directives</h3>
                <p className="text-xs text-[#5D5B53]">Plant-level safety overrides, batch certification & emergency intervention</p>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded bg-[#4F5D4B] text-[#F6F1E7] text-[10px] font-mono font-bold">
              Director Authorization
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            {/* 1. Emergency Ventilation / Scrubber Overdrive */}
            <div className="p-4 rounded-lg bg-[#F6F1E7] border border-[#D8D0C2] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#292925] flex items-center gap-1.5">
                  <Wind className="w-4 h-4 text-[#4F5D4B]" />
                  <span>Air Scrubber Overdrive</span>
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  scrubberActive ? 'bg-[#71806B]/20 text-[#4F5D4B]' : 'bg-[#D8D0C2] text-[#5D5B53]'
                }`}>
                  {scrubberActive ? '100% BOOST' : 'CYCLING (65%)'}
                </span>
              </div>
              <p className="text-[11px] text-[#5D5B53] leading-relaxed">
                Emergency ventilation boost for Hydrocracker Unit 2 & Desulfurizer area to purge airborne trace H₂S.
              </p>
              <button
                onClick={handleScrubberToggle}
                className={`w-full py-2 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  scrubberActive
                    ? 'bg-[#71806B] text-[#F6F1E7] hover:bg-[#5e6b59]'
                    : 'bg-[#EDE5D6] border border-[#D8D0C2] text-[#292925] hover:bg-[#E5DDCB]'
                }`}
              >
                <Wind className="w-3.5 h-3.5" />
                <span>{scrubberActive ? 'Active (Click to Throttle)' : 'Engage 100% Overdrive'}</span>
              </button>
            </div>

            {/* 2. Plant-wide Emergency Warning Broadcast */}
            <div className="p-4 rounded-lg bg-[#F6F1E7] border border-[#D8D0C2] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#292925] flex items-center gap-1.5">
                  <Radio className="w-4 h-4 text-[#9A6258]" />
                  <span>HSE Caution Broadcast</span>
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  broadcastActive ? 'bg-[#9A6258]/20 text-[#7A342B]' : 'bg-[#D8D0C2] text-[#5D5B53]'
                }`}>
                  {broadcastActive ? 'TRANSMITTED' : 'STANDBY'}
                </span>
              </div>
              <p className="text-[11px] text-[#5D5B53] leading-relaxed">
                Broadcast instant audible caution notification to all field workers and safety officers carrying pagers.
              </p>
              <button
                onClick={handleBroadcast}
                className={`w-full py-2 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  broadcastActive
                    ? 'bg-[#9A6258]/20 text-[#7A342B] border border-[#9A6258]/40'
                    : 'bg-[#9A6258] text-[#F6F1E7] hover:bg-[#834f46]'
                }`}
              >
                <Radio className="w-3.5 h-3.5" />
                <span>{broadcastActive ? 'Broadcast Dispatched' : 'Issue Plant-Wide Advisory'}</span>
              </button>
            </div>

            {/* 3. OSHA Compliance Sign-off & Batch Recall */}
            <div className="p-4 rounded-lg bg-[#F6F1E7] border border-[#D8D0C2] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#292925] flex items-center gap-1.5">
                  <FileCheck2 className="w-4 h-4 text-[#4F5D4B]" />
                  <span>OSHA 1910.1000 Sign-off</span>
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  auditSigned ? 'bg-[#71806B]/20 text-[#4F5D4B]' : 'bg-[#B08A55]/20 text-[#8C6D48]'
                }`}>
                  {auditSigned ? 'SIGNED' : 'PENDING REVIEW'}
                </span>
              </div>
              <p className="text-[11px] text-[#5D5B53] leading-relaxed">
                Certified audit of current shift 8h TWA dosage slope (Peak: 1.48 ppm·h in Zone 2).
              </p>
              <button
                onClick={handleAuditSign}
                className={`w-full py-2 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  auditSigned
                    ? 'bg-[#71806B]/20 text-[#4F5D4B] border border-[#71806B]/40'
                    : 'bg-[#4F5D4B] text-[#F6F1E7] hover:bg-[#3d493a]'
                }`}
              >
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>{auditSigned ? 'Audit Log Signed & Sealed' : 'Sign Digital HSE Log'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

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
          
          {/* Current Shift Table & Exposure Logs Filter */}
          <div className="bg-[#EDE5D6] rounded-xl border border-[#D8D0C2] shadow-xs overflow-hidden space-y-3">
            <div className="p-4 border-b border-[#D8D0C2] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-[#292925]">Shift Exposure Logs &amp; Dosimeter Readings</h2>
                <p className="text-xs text-[#5D5B53]">Click any operator row to inspect detailed individual 7-day dosage history</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-[#4F5D4B] bg-white px-2 py-0.5 rounded border border-[#D8D0C2]">
                  {workers.length} Monitored
                </span>
                <button
                  onClick={() => setActivePage('workers')}
                  className="text-xs font-semibold text-[#4F5D4B] hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <span>Full Roster</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Filter Controls Bar */}
            <div className="px-4 flex flex-col sm:flex-row items-center justify-between gap-2.5">
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-gray-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search worker or badge ID..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white border border-[#D8D0C2] text-xs text-[#292925] focus:outline-none focus:border-[#4F5D4B]"
                />
              </div>

              <div className="flex items-center gap-1 bg-[#F6F1E7] p-1 rounded-lg border border-[#D8D0C2] text-xs font-semibold self-stretch sm:self-auto justify-center">
                {(['ALL', 'NORMAL', 'MONITOR', 'REVIEW'] as const).map(st => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-2 py-0.5 rounded transition-colors cursor-pointer text-[10px] ${
                      statusFilter === st ? 'bg-[#292925] text-white' : 'text-[#5D5B53] hover:text-[#292925]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#E5DDCB] text-[#5D5B53] font-mono border-b border-[#D8D0C2]">
                  <tr>
                    <th className="py-2.5 px-4 font-medium">Worker Profile</th>
                    <th className="py-2.5 px-4 font-medium">Badge ID</th>
                    <th className="py-2.5 px-4 font-medium">Strip Color</th>
                    <th className="py-2.5 px-4 font-medium">Cumulative Dose</th>
                    <th className="py-2.5 px-4 font-medium">Status</th>
                    <th className="py-2.5 px-4 font-medium">Shift</th>
                    <th className="py-2.5 px-4 font-medium text-right">Audit Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D8D0C2]">
                  {workers
                    .filter(w => {
                      const matchesSearch = w.name.toLowerCase().includes(searchTerm.toLowerCase()) || w.badgeId.toLowerCase().includes(searchTerm.toLowerCase());
                      const matchesStatus = statusFilter === 'ALL' || w.status === statusFilter;
                      return matchesSearch && matchesStatus;
                    })
                    .map(w => (
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
                            <div>
                              <span className="font-bold">{w.name}</span>
                              <span className="text-[10px] text-gray-500 font-mono block">{w.workerId}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono text-[#5D5B53]">{w.badgeId}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            <div
                              className="w-4 h-4 rounded-full border border-gray-300 shadow-2xs shrink-0"
                              style={{
                                backgroundColor: w.status === 'NORMAL' ? '#B8728A' : w.status === 'MONITOR' ? '#7A5B43' : '#3D2B1F'
                              }}
                            />
                            <span className="text-[10px] font-mono text-gray-500">
                              {w.status === 'NORMAL' ? 'Pink' : w.status === 'MONITOR' ? 'Amber' : 'Bronze'}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-[#292925]">
                          {w.currentDose.toFixed(2)} ppm·h
                        </td>
                        <td className="py-3 px-4">
                          <StatusBadge status={w.status} size="sm" />
                        </td>
                        <td className="py-3 px-4 text-[#5D5B53]">{w.shift.split('·')[0]}</td>
                        <td className="py-3 px-4 text-right">
                          <span className="text-[10px] font-mono font-bold text-[#4F5D4B] bg-white px-2 py-1 rounded border border-[#D8D0C2] hover:bg-[#EDE5D6] transition-colors">
                            Inspect History →
                          </span>
                        </td>
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

      {/* OPERATIONAL HIERARCHY & ROLE PRECAUTIONS DISTINCTION MATRIX */}
      <div className="bg-[#EDE5D6]/30 p-6 rounded-2xl border border-[#D8D0C2] shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#D8D0C2] pb-3">
          <div>
            <h3 className="text-sm font-bold text-[#292925]">Operational Role Distinction & Safety SOP Guidelines</h3>
            <p className="text-xs text-[#5D5B53]">Clear distinction of authority, responsibilities & mandated safety precautions across personnel tiers</p>
          </div>
          <span className="px-2.5 py-0.5 rounded bg-[#EDE5D6] border border-[#D8D0C2] text-[#4F5D4B] text-[10px] font-mono font-bold">
            OSHA / ISO 45001 Framework
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* 1. Facility Admin / Director */}
          <div className={`p-4 rounded-xl border transition-all space-y-3 ${
            isAdmin ? 'bg-[#EDE5D6] border-[#4F5D4B] ring-1 ring-[#4F5D4B] shadow-xs' : 'bg-[#F6F1E7] border-[#D8D0C2]'
          }`}>
            <div className="flex items-center justify-between border-b border-[#D8D0C2] pb-2">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#9A6258]" />
                <span className="text-xs font-bold text-[#292925] uppercase tracking-wide">Plant Administrator</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#9A6258]/15 text-[#7A342B] font-bold">
                Level 1 · Governance
              </span>
            </div>
            <p className="text-[11px] text-[#5D5B53] leading-relaxed">
              Executive authority over plant-wide operations, batch safety parameters, and regulatory reporting.
            </p>
            <div className="space-y-2 text-xs">
              <span className="text-[10px] font-bold text-[#292925] uppercase tracking-wide block">Mandated Admin Precautions:</span>
              <ul className="space-y-1.5 text-[11px] text-[#5D5B53]">
                <li className="flex items-start gap-1.5">
                  <span className="text-[#9A6258] font-bold">•</span>
                  <span><strong>Scrubber Escalation:</strong> Order 100% HVAC overdrive when zone exposure exceeds 1.5 ppm·h.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#9A6258] font-bold">•</span>
                  <span><strong>Batch Recall:</strong> Quarantine & recall dosimeters exceeding 60-day matrix stability.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#9A6258] font-bold">•</span>
                  <span><strong>Regulatory Sign-Off:</strong> Sign digital OSHA 1910.1000 & NIOSH audit logs daily.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#9A6258] font-bold">•</span>
                  <span><strong>Plant Evacuation:</strong> Authorize sirens & sirens broadcast during Tier 3 emergencies.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* 2. Safety Officer (Mira Patel) */}
          <div className={`p-4 rounded-xl border transition-all space-y-3 ${
            currentUser?.role === 'OFFICER' ? 'bg-[#EDE5D6] border-[#4F5D4B] ring-1 ring-[#4F5D4B] shadow-xs' : 'bg-[#F6F1E7] border-[#D8D0C2]'
          }`}>
            <div className="flex items-center justify-between border-b border-[#D8D0C2] pb-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#4F5D4B]" />
                <span className="text-xs font-bold text-[#292925] uppercase tracking-wide">Safety Officer</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#4F5D4B]/15 text-[#4F5D4B] font-bold">
                Level 2 · Field Audit
              </span>
            </div>
            <p className="text-[11px] text-[#5D5B53] leading-relaxed">
              Real-time shift inspection, optical wristband reading, worker rotation, and personal protective compliance.
            </p>
            <div className="space-y-2 text-xs">
              <span className="text-[10px] font-bold text-[#292925] uppercase tracking-wide block">Mandated Officer Precautions:</span>
              <ul className="space-y-1.5 text-[11px] text-[#5D5B53]">
                <li className="flex items-start gap-1.5">
                  <span className="text-[#4F5D4B] font-bold">•</span>
                  <span><strong>Optical Verification:</strong> Scan dosimeter strips at shift start, hour 4, and shift completion.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#4F5D4B] font-bold">•</span>
                  <span><strong>Worker Zone Rotation:</strong> Reassign operators with &gt;0.50 ppm·h to low-risk exterior areas within 1h.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#4F5D4B] font-bold">•</span>
                  <span><strong>PPE Inspection:</strong> Verify positive-pressure SCBA seal and cartridge expiration dates.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#4F5D4B] font-bold">•</span>
                  <span><strong>Medical Escort:</strong> Directly accompany workers with 'REVIEW' flags to health clinic.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* 3. Field Worker (Ramesh Kumar) */}
          <div className={`p-4 rounded-xl border transition-all space-y-3 ${
            currentUser?.role === 'WORKER' ? 'bg-[#EDE5D6] border-[#4F5D4B] ring-1 ring-[#4F5D4B] shadow-xs' : 'bg-[#F6F1E7] border-[#D8D0C2]'
          }`}>
            <div className="flex items-center justify-between border-b border-[#D8D0C2] pb-2">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#B08A55]" />
                <span className="text-xs font-bold text-[#292925] uppercase tracking-wide">Field Worker</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#B08A55]/15 text-[#8C6D48] font-bold">
                Level 3 · Operations
              </span>
            </div>
            <p className="text-[11px] text-[#5D5B53] leading-relaxed">
              Frontline equipment operation, continuous passive dosimeter wearing, and early symptom self-reporting.
            </p>
            <div className="space-y-2 text-xs">
              <span className="text-[10px] font-bold text-[#292925] uppercase tracking-wide block">Mandated Worker Precautions:</span>
              <ul className="space-y-1.5 text-[11px] text-[#5D5B53]">
                <li className="flex items-start gap-1.5">
                  <span className="text-[#B08A55] font-bold">•</span>
                  <span><strong>Wear Protocol:</strong> Fasten 118 band securely on outer wrist without glove overlap.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#B08A55] font-bold">•</span>
                  <span><strong>Hourly Visual Inspection:</strong> Violet/pink is safe; brown/amber indicates H₂S exposure.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#B08A55] font-bold">•</span>
                  <span><strong>Immediate Retreat:</strong> Evacuate crosswind/upwind if rotten-egg odor or strip darkens.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#B08A55] font-bold">•</span>
                  <span><strong>Daily Logging:</strong> Present band for camera scan before leaving facility gates.</span>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>

      {/* WORKER EXPOSURE HISTORY INSPECTOR MODAL (Deliverable 3) */}
      {inspectorWorker && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-2xl border border-[#D8D0C2] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-4 bg-[#EDE5D6] border-b border-[#D8D0C2] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#292925] text-white flex items-center justify-center font-mono font-bold text-sm">
                  {inspectorWorker.name.split(' ').map((n: string) => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-[#292925] flex items-center gap-2">
                    <span>{inspectorWorker.name}</span>
                    <StatusBadge status={inspectorWorker.status} size="sm" />
                  </h3>
                  <span className="text-[10px] font-mono text-[#5D5B53]">
                    {inspectorWorker.workerId} · Badge #{inspectorWorker.badgeId} · {inspectorWorker.department}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setInspectorWorker(null)}
                className="w-8 h-8 rounded-full bg-white/70 border border-[#D8D0C2] flex items-center justify-center text-gray-500 hover:text-gray-900 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-5 overflow-y-auto space-y-6">
              
              {/* Key Worker Stats Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-[#FAF8F5] rounded-xl border border-gray-200">
                  <span className="text-[10px] font-mono text-gray-500 uppercase block">Current Shift Dose</span>
                  <span className="font-mono font-bold text-[#292925] text-base">{inspectorWorker.currentDose.toFixed(2)} ppm·h</span>
                  <span className="text-[9px] text-gray-500 block mt-0.5">Shift: {inspectorWorker.shift.split('·')[0]}</span>
                </div>
                <div className="p-3 bg-[#FAF8F5] rounded-xl border border-gray-200">
                  <span className="text-[10px] font-mono text-gray-500 uppercase block">7-Day Max Exposure</span>
                  <span className="font-mono font-bold text-amber-800 text-base">
                    {Math.max(...(inspectorWorker.trend7Day?.map((t: any) => t.dose) || [0.65])).toFixed(2)} ppm·h
                  </span>
                  <span className="text-[9px] text-gray-500 block mt-0.5">Cumulative peak</span>
                </div>
                <div className="p-3 bg-[#FAF8F5] rounded-xl border border-gray-200">
                  <span className="text-[10px] font-mono text-gray-500 uppercase block">Badge Validity</span>
                  <span className="font-mono font-bold text-emerald-800 text-base">{inspectorWorker.badgeValidityDays} days left</span>
                  <span className="text-[9px] text-gray-500 block mt-0.5">Expires: {inspectorWorker.badgeExpiryDate}</span>
                </div>
                <div className="p-3 bg-[#FAF8F5] rounded-xl border border-gray-200">
                  <span className="text-[10px] font-mono text-gray-500 uppercase block">OSHA Status</span>
                  <span className={`font-mono font-bold text-sm ${inspectorWorker.status === 'NORMAL' ? 'text-emerald-700' : inspectorWorker.status === 'MONITOR' ? 'text-amber-700' : 'text-red-700'}`}>
                    {inspectorWorker.status === 'NORMAL' ? 'COMPLIANT' : inspectorWorker.status === 'MONITOR' ? 'ACTION LEVEL' : 'OVEREXPOSED'}
                  </span>
                  <span className="text-[9px] text-gray-500 block mt-0.5">1.00 ppm·h ceiling</span>
                </div>
              </div>

              {/* 7-Day Dosage Trend Chart with OSHA Permissible Limit Line */}
              <div className="bg-[#FAF8F5] p-4 rounded-xl border border-gray-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-[#292925] flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-[#4F5D4B]" />
                      <span>7-Day Exposure History vs OSHA Permissible Limit</span>
                    </h4>
                    <span className="text-[10px] text-gray-500 font-mono">Daily cumulative dosage slope</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-mono">
                    <span className="flex items-center gap-1 text-red-600 font-bold">
                      <span className="w-2.5 h-0.5 bg-red-500" />
                      OSHA PEL (1.00)
                    </span>
                  </div>
                </div>

                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={inspectorWorker.trend7Day || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5DDCB" vertical={false} />
                      <XAxis dataKey="day" stroke="#878377" fontSize={10} tickLine={false} />
                      <YAxis stroke="#878377" fontSize={10} tickLine={false} unit=" ppm·h" domain={[0, 1.6]} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#292925', border: '1px solid #3E3C36', borderRadius: '6px', color: '#EDE5D6', fontSize: '11px' }}
                      />
                      <ReferenceLine y={1.00} stroke="#dc2626" strokeDasharray="4 4" label={{ value: 'OSHA PEL', fill: '#dc2626', fontSize: 10, position: 'top' }} />
                      <Line type="monotone" dataKey="dose" stroke="#4F5D4B" strokeWidth={2.5} dot={{ r: 3, fill: '#4F5D4B' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chronological Shift Exposure Logs for this Worker */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[#292925] flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-[#4F5D4B]" />
                  <span>Logged Exposure Scans for {inspectorWorker.name}</span>
                </h4>
                
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF8F5] text-gray-600 font-mono border-b border-gray-200">
                      <tr>
                        <th className="py-2 px-3 font-medium">Timestamp</th>
                        <th className="py-2 px-3 font-medium">Location</th>
                        <th className="py-2 px-3 font-medium">Dose</th>
                        <th className="py-2 px-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-[11px]">
                      {readings
                        .filter(r => r.workerId === inspectorWorker.workerId || r.workerName === inspectorWorker.name)
                        .slice(0, 5)
                        .map(r => (
                          <tr key={r.id} className="hover:bg-gray-50">
                            <td className="py-2 px-3 font-mono text-gray-600">{r.timeAgo || r.timestamp}</td>
                            <td className="py-2 px-3">{r.location}</td>
                            <td className="py-2 px-3 font-mono font-bold text-gray-900">{r.dosePpmH.toFixed(2)} ppm·h</td>
                            <td className="py-2 px-3">
                              <StatusBadge status={r.status} size="sm" />
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* Modal Footer Controls */}
            <div className="p-4 bg-[#FAF8F5] border-t border-[#D8D0C2] flex items-center justify-between">
              <button
                onClick={() => {
                  showToast(`Individual HSE record exported for ${inspectorWorker.name}.`);
                }}
                className="px-3 py-2 rounded-xl border border-[#D8D0C2] bg-white text-xs font-semibold text-[#292925] hover:bg-gray-50 flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Worker Record</span>
              </button>
              <button
                onClick={() => setInspectorWorker(null)}
                className="px-4 py-2 rounded-xl bg-[#292925] text-white hover:bg-black text-xs font-semibold cursor-pointer"
              >
                Close Inspector
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
