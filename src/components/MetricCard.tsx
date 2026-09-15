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
  let border = 'border-[#D8D0C2]';
  let iconBg = 'bg-[#EDE5D6] text-[#5D5B53]';

  if (variant === 'accent') {
    iconBg = 'bg-[#E5EADF] text-[#4F5D4B]';
  } else if (variant === 'warning') {
    border = 'border-[#E0D4C0]';
    iconBg = 'bg-[#F3EDE2] text-[#B08A55]';
  } else if (variant === 'alert') {
    border = 'border-[#DFC6C1]';
    iconBg = 'bg-[#F3E8E5] text-[#9A6258]';
  }

  return (
    <div className={`bg-[#F6F1E7] rounded-lg border ${border} p-4 transition-all duration-200 hover:border-[#B8B0A2]`}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-mono uppercase tracking-wider text-[#5D5B53]">{label}</span>
        <div className={`p-1.5 rounded ${iconBg}`}>
          <Icon className="w-3.5 h-3.5" />
        </div>
      </div>
      <div className="mt-2.5 flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-[#292925] font-mono">{value}</span>
        {subtext && <span className="text-xs text-[#878377]">{subtext}</span>}
      </div>
    </div>
  );
};
