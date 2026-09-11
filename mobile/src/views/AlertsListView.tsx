import React from 'react';
import type { Alert } from '../types/mobile';
import { repository } from '../services/DosimeterRepository';
import { ArrowLeft, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

interface AlertsListViewProps {
  alerts: Alert[];
  onBack: () => void;
}

export const AlertsListView: React.FC<AlertsListViewProps> = ({ alerts, onBack }) => {
  const handleResolve = (alertId: string) => {
    repository.resolveAlert(alertId);
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return <span className="subtle-badge badge-review">CRITICAL</span>;
      case 'HIGH':
        return <span className="subtle-badge badge-review">HIGH</span>;
      case 'MEDIUM':
        return <span className="subtle-badge badge-monitor">MEDIUM</span>;
      default:
        return <span className="subtle-badge badge-normal">LOW</span>;
    }
  };

  return (
    <div className="space-y-4 pb-20">
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
            Safety Incidents & Alerts
          </h1>
          <span className="text-[11px] font-mono text-[#71806B]">
            Automated Dosimeter Threshold Notifications
          </span>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {alerts.length === 0 ? (
          <div className="text-center py-12 text-[#878377] text-xs">
            No safety alerts recorded. All systems within normal limits.
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.alertId}
              className={`border rounded-xl p-4 space-y-2 shadow-xs transition-colors ${
                alert.resolved
                  ? 'bg-[#EDE5D6]/60 border-[#D8D0C2] opacity-70'
                  : alert.severity === 'CRITICAL' || alert.severity === 'HIGH'
                  ? 'bg-[#F6E2DF] border-[#E4B5AF]'
                  : 'bg-[#F5EEDB] border-[#DDC69E]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-[#9A6258]" />
                  <span className="font-semibold text-xs text-[#292925]">
                    {alert.workerName}
                  </span>
                </div>
                <div>{getSeverityBadge(alert.severity)}</div>
              </div>

              <p className="text-xs text-[#292925] leading-relaxed">
                {alert.message}
              </p>

              <div className="flex items-center justify-between pt-1 text-[11px] font-mono text-[#5D5B53] border-t border-black/10">
                <span>{alert.timestamp} · Band {alert.bandId}</span>
                {alert.resolved ? (
                  <span className="flex items-center gap-1 text-[#5A7456] font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Acknowledged
                  </span>
                ) : (
                  <button
                    onClick={() => handleResolve(alert.alertId)}
                    className="px-2.5 py-1 bg-[#292925] text-white rounded text-[10px] font-mono uppercase font-semibold active:scale-95"
                  >
                    Acknowledge
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
