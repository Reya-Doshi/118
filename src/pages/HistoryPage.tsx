import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/StatusBadge';
import type { ExposureStatus } from '../types';
import { Download, Search, ArrowUpDown } from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const { readings } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | ExposureStatus>('ALL');
  const [sortBy, setSortBy] = useState<'date' | 'dose'>('date');

  const filteredReadings = readings
    .filter(r => {
      const matchesSearch =
        r.workerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.badgeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'dose') {
        return b.dosePpmH - a.dosePpmH;
      }
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

  const handleExportCSV = () => {
    const headers = ['Date & Time', 'Worker Name', 'Worker ID', 'Badge ID', 'Shift', 'Dose (ppm·h)', 'Status', 'Location', 'Confidence (%)'];
    const rows = filteredReadings.map(r => [
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
    link.setAttribute('download', `118_Shift_Exposure_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header & Export CTA */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-[var(--card-border)]">
        <div>
          <h1 className="text-2xl font-bold font-heading tracking-tight text-[var(--text-primary)]">Exposure History</h1>
          <p className="text-xs text-[var(--text-secondary)] font-mono mt-0.5">Comprehensive audit log of colorimetric readings across plant shifts · SARVAS</p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#FF9500] to-[#F59E0B] text-black text-xs font-mono font-bold tracking-wide hover:shadow-[0_0_15px_rgba(255,149,0,0.4)] transition-all shadow-sm flex items-center gap-2 cursor-pointer"
        >
          <Download className="w-4 h-4 text-black" />
          <span>Export Report (CSV)</span>
        </button>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="command-card p-4 rounded-xl border border-[var(--card-border)] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4 bg-[var(--card-surface-subtle)]">
        
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[var(--text-secondary)] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Filter by worker, badge ID, location..."
            className="w-full pl-9 pr-4 py-2 bg-[var(--card-surface)] rounded-lg border border-[var(--card-border)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] font-mono"
          />
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto text-xs">
          
          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-[var(--card-surface)] p-1 rounded-lg border border-[var(--card-border)] font-mono">
            {(['ALL', 'NORMAL', 'MONITOR', 'REVIEW'] as const).map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-md font-bold transition-colors cursor-pointer ${
                  statusFilter === st
                    ? 'bg-[var(--accent-primary)] text-black'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--card-surface-subtle)]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Sort selector */}
          <button
            onClick={() => setSortBy(prev => (prev === 'date' ? 'dose' : 'date'))}
            className="flex items-center gap-1.5 px-3 py-2 bg-[var(--card-surface)] rounded-lg border border-[var(--card-border)] text-[var(--text-primary)] font-mono font-bold hover:border-[var(--accent-primary)] transition-colors cursor-pointer"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
            <span>Sort: {sortBy === 'date' ? 'Latest First' : 'Highest Dose'}</span>
          </button>

        </div>

      </div>

      {/* EXPOSURE READINGS TABLE */}
      <div className="command-card rounded-xl border border-[var(--card-border)] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[var(--card-surface-subtle)] text-[var(--text-secondary)] font-mono border-b border-[var(--card-border)]">
              <tr>
                <th className="py-3 px-4 font-semibold">Date & Time</th>
                <th className="py-3 px-4 font-semibold">Worker</th>
                <th className="py-3 px-4 font-semibold">Badge</th>
                <th className="py-3 px-4 font-semibold">Shift</th>
                <th className="py-3 px-4 font-semibold">Location</th>
                <th className="py-3 px-4 font-semibold">Dose (ppm·h)</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--card-border)]">
              {filteredReadings.map(r => (
                <tr key={r.id} className="hover:bg-[var(--card-surface-subtle)] transition-colors">
                  <td className="py-3.5 px-4 font-mono text-[var(--text-secondary)]">{r.timeAgo || r.timestamp}</td>
                  <td className="py-3.5 px-4 font-bold text-[var(--text-primary)]">{r.workerName}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-[var(--text-primary)]">{r.badgeId}</td>
                  <td className="py-3.5 px-4 text-[var(--text-secondary)] font-mono">{r.shift.split('·')[0]}</td>
                  <td className="py-3.5 px-4 text-[var(--text-secondary)] font-mono">{r.location}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-[var(--text-primary)]">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full border border-white/20 shrink-0" style={{ backgroundColor: r.stripColorHex }} />
                      <span>{r.dosePpmH.toFixed(2)}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={r.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[var(--accent-primary)] text-right font-bold">{r.confidenceScore}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
