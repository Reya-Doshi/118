import React from 'react';
import type { ExposureStatus } from '../types';

interface StatusBadgeProps {
  status: ExposureStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  let bg = '';
  let border = '';
  let text = '';
  let dot = '';

  switch (status) {
    case 'NORMAL':
      // Electric Sulfur Chartreuse / Nominal Olive
      bg = 'bg-[var(--accent-primary)]/15';
      border = 'border-[var(--accent-primary)]/40';
      text = 'text-[var(--accent-primary)]';
      dot = 'bg-[#DFFF00] shadow-[0_0_6px_#DFFF00]';
      break;
    case 'MONITOR':
      // Refinery Flare Amber
      bg = 'bg-[#FF9500]/15';
      border = 'border-[#FF9500]/40';
      text = 'text-[#FF9500]';
      dot = 'bg-[#FF9500] shadow-[0_0_6px_#FF9500]';
      break;
    case 'REVIEW':
      // Toxic Crimson
      bg = 'bg-[#FF3B30]/15';
      border = 'border-[#FF3B30]/50';
      text = 'text-[#FF3B30]';
      dot = 'bg-[#FF3B30] shadow-[0_0_8px_#FF3B30] animate-pulse';
      break;
    case 'OUT_OF_CALIBRATION':
      // Out of calibration / invalid
      bg = 'bg-stone-500/20';
      border = 'border-stone-500/50';
      text = 'text-stone-400 dark:text-stone-300';
      dot = 'bg-stone-400 shadow-[0_0_6px_#a8a29e]';
      break;
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px] gap-1.5 font-mono font-bold',
    md: 'px-2.5 py-1 text-xs gap-1.5 font-mono font-bold',
    lg: 'px-3.5 py-1.5 text-xs gap-2 font-mono font-bold tracking-wide'
  }[size];

  const label = status === 'OUT_OF_CALIBRATION' ? 'OUT OF CALIBRATION' : status;

  return (
    <span
      className={`inline-flex items-center rounded-full border ${bg} ${border} ${text} ${sizeClasses} transition-all duration-200`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
};
