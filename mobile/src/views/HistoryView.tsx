import React, { useState } from 'react';
import type { Reading } from '../types/mobile';
import { Clock, Filter, ArrowLeft, Thermometer, Droplets, ShieldCheck, MapPin, UserCheck, ShieldAlert } from 'lucide-react';

interface HistoryViewProps {
  readings: Reading[];
  onBack: () => void;
  workerLanguage?: 'hi' | 'en';
}

export const HistoryView: React.FC<HistoryViewProps> = ({ readings, onBack, workerLanguage = 'en' }) => {
  const isHindi = workerLanguage === 'hi';
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterType, setFilterType] = useState<string>('ALL');

  const filtered = readings.filter((r) => {
    const matchesStatus = filterStatus === 'ALL' || r.status === filterStatus;
    const matchesType = filterType === 'ALL' || 
      (filterType === 'PERSONAL' && r.scanType === 'PERSONAL_WORKER_SCAN') ||
      (filterType === 'AUDIT' && r.scanType === 'OFFICER_FIELD_AUDIT');
    return matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'NORMAL':
        return <span className="subtle-badge badge-normal font-bold">{isHindi ? 'सुरक्षित' : 'NORMAL'}</span>;
      case 'MONITOR':
        return <span className="subtle-badge badge-monitor font-bold">{isHindi ? 'सतर्क रहें' : 'MONITOR'}</span>;
      case 'REVIEW':
        return <span className="subtle-badge badge-review font-bold">{isHindi ? 'खतरा / समीक्षा' : 'REVIEW'}</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Top Header */}
      <div className="flex items-center gap-3 pt-1 border-b border-[#D8D0C2] pb-3">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full bg-[#EDE5D6] border border-[#D8D0C2] flex items-center justify-center text-[#292925] active:bg-[#E2DBD0]"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl font-serif font-bold text-[#292925]">
            {isHindi ? 'एक्सपोजर इतिहास' : 'Exposure History'}
          </h1>
          <span className="text-[11px] font-mono text-[#71806B]">
            {isHindi ? 'सभी डॉसिमीटर स्कैन एवं निरीक्षण रिकॉर्ड' : 'All Quantitative Dosimeter Scans & Field Audits'}
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="space-y-2">
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {[
            { id: 'ALL', label: isHindi ? 'सभी' : 'ALL' },
            { id: 'NORMAL', label: isHindi ? 'सुरक्षित' : 'NORMAL' },
            { id: 'MONITOR', label: isHindi ? 'सतर्क' : 'MONITOR' },
            { id: 'REVIEW', label: isHindi ? 'समीक्षा' : 'REVIEW' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilterStatus(item.id)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all shrink-0 ${
                filterStatus === item.id
                  ? 'bg-[#292925] text-[#F6F1E7] shadow-xs'
                  : 'bg-[#EDE5D6] border border-[#D8D0C2] text-[#5D5B53]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Scan Type Filter */}
        <div className="flex gap-1.5">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-2 py-0.5 rounded text-[10px] font-mono ${
              filterType === 'ALL' ? 'bg-[#71806B] text-white' : 'bg-[#EDE5D6] text-[#5D5B53] border border-[#D8D0C2]'
            }`}
          >
            {isHindi ? `सभी स्कैन (${readings.length})` : `All Scans (${readings.length})`}
          </button>
          <button
            onClick={() => setFilterType('PERSONAL')}
            className={`px-2 py-0.5 rounded text-[10px] font-mono ${
              filterType === 'PERSONAL' ? 'bg-[#71806B] text-white' : 'bg-[#EDE5D6] text-[#5D5B53] border border-[#D8D0C2]'
            }`}
          >
            {isHindi ? 'स्वयं स्कैन' : 'Operator Self-Scans'}
          </button>
          <button
            onClick={() => setFilterType('AUDIT')}
            className={`px-2 py-0.5 rounded text-[10px] font-mono ${
              filterType === 'AUDIT' ? 'bg-[#71806B] text-white' : 'bg-[#EDE5D6] text-[#5D5B53] border border-[#D8D0C2]'
            }`}
          >
            {isHindi ? 'सुरक्षा ऑडिट' : 'Inspector Audits'}
          </button>
        </div>
      </div>

      {/* Readings Timeline List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-[#878377] text-xs">
            {isHindi ? 'चयनित फिल्टर के लिए कोई रिकॉर्ड नहीं मिला।' : 'No readings found for selected filter criteria.'}
          </div>
        ) : (
          filtered.map((reading) => (
            <div
              key={reading.readingId}
              className="bg-[#EDE5D6] border border-[#D8D0C2] rounded-xl p-4 space-y-2 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-sm text-[#292925]">
                      {reading.workerName}
                    </span>
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${
                      reading.scanType === 'OFFICER_FIELD_AUDIT'
                        ? 'bg-[#B08A55]/20 text-[#795726]'
                        : 'bg-[#5A7456]/20 text-[#385034]'
                    }`}>
                      {reading.scanType === 'OFFICER_FIELD_AUDIT' ? 'AUDIT' : 'SELF'}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-[#878377]">
                    Band {reading.bandId} · {reading.timestamp}
                  </span>
                </div>
                <div>{getStatusBadge(reading.status)}</div>
              </div>

              {/* Location indicator */}
              {reading.inspectionLocation && (
                <div className="flex items-center gap-1.5 text-[11px] text-[#5D5B53]">
                  <MapPin className="w-3.5 h-3.5 text-[#71806B] shrink-0" />
                  <span className="truncate">{reading.inspectionLocation}</span>
                </div>
              )}

              {/* Dose display */}
              <div className="flex items-baseline gap-2 pt-1 border-t border-[#D8D0C2]/60">
                <span className="text-2xl font-mono font-bold text-[#292925]">
                  {reading.estimatedDose.toFixed(2)}
                </span>
                <span className="text-xs text-[#5D5B53] font-serif">
                  {isHindi ? 'ppm·h अनुमानित एक्सपोज़र' : 'ppm·h estimated dose'}
                </span>
              </div>

              {/* Ambient & Colorimetric Info */}
              <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-[#5D5B53] pt-1">
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#71806B]" />
                  <span>{reading.confidence}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <Thermometer className="w-3.5 h-3.5 text-[#71806B]" />
                  <span>{reading.temperature}°C</span>
                </div>
                <div className="flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-[#71806B]" />
                  <span>{reading.humidity}% RH</span>
                </div>
                {reading.rgb && (
                  <div className="flex items-center gap-1 bg-[#F6F1E7] px-1.5 py-0.5 rounded border border-[#D8D0C2]">
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-black/20 shrink-0"
                      style={{ backgroundColor: reading.rgb.hex }}
                    />
                    <span className="text-[10px] font-mono font-bold text-[#292925]">{reading.rgb.hex}</span>
                    {reading.deltaE !== undefined && (
                      <span className="text-[9px] text-[#878377]">ΔE={reading.deltaE.toFixed(1)}</span>
                    )}
                  </div>
                )}
              </div>


              {reading.officerNotes && (
                <p className="text-[11px] text-[#795726] bg-[#F5EEDB] p-2 rounded-lg border border-[#DDC69E]/50 italic">
                  Officer Note: "{reading.officerNotes}"
                </p>
              )}

              {reading.notes && !reading.officerNotes && (
                <p className="text-[11px] text-[#5D5B53] italic pt-1 border-t border-[#D8D0C2]/40">
                  {reading.notes}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
