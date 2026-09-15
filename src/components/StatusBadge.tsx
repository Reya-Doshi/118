import React from 'react';
import type { ExposureStatus } from '../types';

export interface StatusBadgeProps {
  status: ExposureStatus;
  size?: 'sm' | 'md' | 'lg';
  language?: 'hi' | 'en';
  customLabel?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  size = 'md',
  language = 'en',
  customLabel
}) => {
  let bg = '';
  let border = '';
  let text = '';
  let dot = '';

  switch (status) {
    case 'NORMAL':
      // Muted Sage Green
      bg = 'bg-[#E5EADF]';
      border = 'border-[#C5CEC0]';
      text = 'text-[#4F5D4B]';
      dot = 'bg-[#71806B]';
      break;
    case 'MONITOR':
      // Muted Amber
      bg = 'bg-[#F3EDE2]';
      border = 'border-[#E0D4C0]';
      text = 'text-[#826235]';
      dot = 'bg-[#B08A55]';
      break;
    case 'REVIEW':
      // Dusty Brick
      bg = 'bg-[#F3E8E5]';
      border = 'border-[#DFC6C1]';
      text = 'text-[#76423A]';
      dot = 'bg-[#9A6258]';
      break;
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[11px] gap-1.5 font-medium',
    md: 'px-2.5 py-1 text-xs gap-1.5 font-medium',
    lg: 'px-3.5 py-1.5 text-xs gap-2 font-bold tracking-wide'
  }[size];

  let displayLabel = customLabel;
  if (!displayLabel) {
    if (language === 'hi') {
      displayLabel = status === 'NORMAL' ? 'सुरक्षित' : status === 'MONITOR' ? 'सतर्क रहें' : 'खतरा / बाहर निकलें';
    } else {
      displayLabel = status;
    }
  }

  return (
    <span
      className={`inline-flex items-center rounded-md border ${bg} ${border} ${text} ${sizeClasses} transition-all duration-200`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {displayLabel}
    </span>
  );
};
