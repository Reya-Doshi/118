import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon: LucideIcon;
  variant?: 'default' | 'accent' | 'warning' | 'alert';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subtext,
  icon: Icon,
  variant = 'default'
}) => {
  let border = 'border-[var(--card-border)]';
  let iconBg = 'bg-[var(--card-surface-subtle)] text-[var(--text-secondary)]';

  if (variant === 'accent') {
    border = 'border-[var(--accent-primary)]/40';
    iconBg = 'bg-[var(--accent-primary)]/15 text-[var(--accent-primary)]';
  } else if (variant === 'warning') {
    border = 'border-[#FF9500]/40';
    iconBg = 'bg-[#FF9500]/15 text-[#FF9500]';
  } else if (variant === 'alert') {
    border = 'border-[#FF3B30]/50';
    iconBg = 'bg-[#FF3B30]/15 text-[#FF3B30]';
  }

  return (
    <div className={`command-card mouse-glow-card rounded-2xl border ${border} p-5 transition-all duration-200 hover:-translate-y-0.5`}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-secondary)] font-semibold">{label}</span>
        <div className={`p-2 rounded-xl ${iconBg}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text-primary)] font-mono">{value}</span>
        {subtext && <span className="text-xs font-mono text-[var(--text-secondary)]">{subtext}</span>}
      </div>
    </div>
  );
};
