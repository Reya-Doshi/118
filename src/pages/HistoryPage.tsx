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
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-[#D8D0C2]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#292925]">Exposure History</h1>
          <p className="text-xs text-[#292925]/70 mt-0.5">Comprehensive audit log of colorimetric readings across plant shifts</p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 rounded-lg bg-[#4F5D4B] text-[#F6F1E7] text-xs font-semibold tracking-wide hover:bg-[#3d493a] transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
        >
          <Download className="w-4 h-4 text-[#F6F1E7]" />
          <span>Export Report (CSV)</span>
        </button>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="bg-[#EDE5D6]/40 p-4 rounded-xl border border-[#D8D0C2] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#292925]/50 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Filter by worker, badge ID, location..."
            className="w-full pl-9 pr-4 py-2 bg-[#F6F1E7] rounded-lg border border-[#D8D0C2] text-xs text-[#292925] focus:outline-none focus:border-[#4F5D4B]"
          />
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto text-xs">
          
          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-[#F6F1E7] p-1 rounded-lg border border-[#D8D0C2]">
            {(['ALL', 'NORMAL', 'MONITOR', 'REVIEW'] as const).map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                  statusFilter === st
                    ? 'bg-[#292925] text-[#F6F1E7]'
                    : 'text-[#292925]/70 hover:bg-[#EDE5D6]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Sort selector */}
          <button
            onClick={() => setSortBy(prev => (prev === 'date' ? 'dose' : 'date'))}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#F6F1E7] rounded-lg border border-[#D8D0C2] text-[#292925] font-semibold hover:bg-[#EDE5D6] transition-colors cursor-pointer"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-[#4F5D4B]" />
            <span>Sort: {sortBy === 'date' ? 'Latest First' : 'Highest Dose'}</span>
          </button>

        </div>

      </div>

      {/* EXPOSURE READINGS TABLE */}
      <div className="bg-[#EDE5D6]/30 rounded-xl border border-[#D8D0C2] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#EDE5D6] text-[#292925]/80 font-mono border-b border-[#D8D0C2]">
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
            <tbody className="divide-y divide-[#D8D0C2]/70">
              {filteredReadings.map(r => (
                <tr key={r.id} className="hover:bg-[#EDE5D6]/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-[#292925]/70">{r.timeAgo || r.timestamp}</td>
                  <td className="py-3.5 px-4 font-bold text-[#292925]">{r.workerName}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-[#292925]">{r.badgeId}</td>
                  <td className="py-3.5 px-4 text-[#292925]/70">{r.shift.split('·')[0]}</td>
                  <td className="py-3.5 px-4 text-[#292925]/70">{r.location}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-[#292925]">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full border border-black/20" style={{ backgroundColor: r.stripColorHex }} />
                      <span>{r.dosePpmH.toFixed(2)}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={r.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[#292925]/60 text-right">{r.confidenceScore}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
