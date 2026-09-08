import type { Worker, ExposureReading, DemoSample, AlertItem } from '../types';

export const INITIAL_WORKERS: Worker[] = [
  {
    id: 'w1',
    workerId: 'WRK-2048',
    name: 'Rahul Shetty',
    badgeId: 'DS-1088',
    currentDose: 0.72,
    status: 'MONITOR',
    shift: 'Morning · 06:00–14:00',
    lastReadingTime: '11:37',
    badgeIssuedDate: '18 Aug 2026',
    badgeExpiryDate: '27 Sep 2026',
    badgeValidityDays: 21,
    department: 'Hydrocracker Unit 2',
    role: 'Process Operator',
    trend7Day: [
      { day: 'Mon', dose: 0.18 },
      { day: 'Tue', dose: 0.32 },
      { day: 'Wed', dose: 0.27 },
      { day: 'Thu', dose: 0.61 },
      { day: 'Fri', dose: 0.49 },
      { day: 'Sat', dose: 0.72 },
      { day: 'Sun', dose: 0.72 }
    ]
  },
  {
    id: 'w2',
    workerId: 'WRK-3012',
    name: 'Sanjay Rao',
    badgeId: 'DS-1091',
    currentDose: 1.24,
    status: 'REVIEW',
    shift: 'Morning · 06:00–14:00',
    lastReadingTime: '11:29',
    badgeIssuedDate: '10 Aug 2026',
    badgeExpiryDate: '19 Sep 2026',
    badgeValidityDays: 13,
    department: 'Sulfur Recovery Unit (SRU)',
    role: 'Maintenance Technician',
    trend7Day: [
      { day: 'Mon', dose: 0.25 },
      { day: 'Tue', dose: 0.45 },
      { day: 'Wed', dose: 0.78 },
      { day: 'Thu', dose: 0.92 },
      { day: 'Fri', dose: 1.10 },
      { day: 'Sat', dose: 1.18 },
      { day: 'Sun', dose: 1.24 }
    ]
  },
  {
    id: 'w3',
    workerId: 'WRK-1042',
    name: 'Arjun Kumar',
    badgeId: 'DS-1042',
    currentDose: 0.18,
    status: 'NORMAL',
    shift: 'Morning · 06:00–14:00',
    lastReadingTime: '11:42',
    badgeIssuedDate: '01 Sep 2026',
    badgeExpiryDate: '10 Oct 2026',
    badgeValidityDays: 34,
    department: 'Crude Distillation Unit (CDU)',
    role: 'Safety Inspector',
    trend7Day: [
      { day: 'Mon', dose: 0.05 },
      { day: 'Tue', dose: 0.08 },
      { day: 'Wed', dose: 0.12 },
      { day: 'Thu', dose: 0.15 },
      { day: 'Fri', dose: 0.14 },
      { day: 'Sat', dose: 0.17 },
      { day: 'Sun', dose: 0.18 }
    ]
  },
  {
    id: 'w4',
    workerId: 'WRK-1099',
    name: 'Priya Nair',
    badgeId: 'DS-1103',
    currentDose: 0.09,
    status: 'NORMAL',
    shift: 'Morning · 06:00–14:00',
    lastReadingTime: '11:18',
    badgeIssuedDate: '02 Sep 2026',
    badgeExpiryDate: '11 Oct 2026',
    badgeValidityDays: 35,
    department: 'Quality Assurance Lab',
    role: 'Lab Chemist',
    trend7Day: [
      { day: 'Mon', dose: 0.02 },
      { day: 'Tue', dose: 0.04 },
      { day: 'Wed', dose: 0.06 },
      { day: 'Thu', dose: 0.07 },
      { day: 'Fri', dose: 0.08 },
      { day: 'Sat', dose: 0.09 },
      { day: 'Sun', dose: 0.09 }
    ]
  },
  {
    id: 'w5',
    workerId: 'WRK-4055',
    name: 'Vikram Singh',
    badgeId: 'DS-1077',
    currentDose: 0.45,
    status: 'NORMAL',
    shift: 'Morning · 06:00–14:00',
    lastReadingTime: '10:55',
    badgeIssuedDate: '12 Aug 2026',
    badgeExpiryDate: '09 Sep 2026',
    badgeValidityDays: 3,
    department: 'Desulfurization Unit',
    role: 'Field Engineer',
    trend7Day: [
      { day: 'Mon', dose: 0.10 },
      { day: 'Tue', dose: 0.18 },
      { day: 'Wed', dose: 0.24 },
      { day: 'Thu', dose: 0.35 },
      { day: 'Fri', dose: 0.40 },
      { day: 'Sat', dose: 0.42 },
      { day: 'Sun', dose: 0.45 }
    ]
  },
  {
    id: 'w6',
    workerId: 'WRK-2018',
    name: 'Anita Desai',
    badgeId: 'DS-1115',
    currentDose: 0.88,
    status: 'MONITOR',
    shift: 'Morning · 06:00–14:00',
    lastReadingTime: '10:40',
    badgeIssuedDate: '14 Aug 2026',
    badgeExpiryDate: '11 Sep 2026',
    badgeValidityDays: 5,
    department: 'Tank Farm / Storage',
    role: 'Operations Supervisor',
    trend7Day: [
      { day: 'Mon', dose: 0.20 },
      { day: 'Tue', dose: 0.38 },
      { day: 'Wed', dose: 0.52 },
      { day: 'Thu', dose: 0.65 },
      { day: 'Fri', dose: 0.74 },
      { day: 'Sat', dose: 0.82 },
      { day: 'Sun', dose: 0.88 }
    ]
  }
];

export const DEMO_SAMPLES: DemoSample[] = [
  {
    id: 'sample-a',
    name: 'Sample A — Baseline Exposure',
    badgeId: 'DS-1042',
    workerName: 'Arjun Kumar',
    dosePpmH: 0.18,
    status: 'NORMAL',
    confidenceScore: 95,
    description: 'Minimal chemical shift observed. Safe operational range within standard 8-hour shift limits.',
    stripColorHex: '#d4c5a9',
    stripColorBg: 'bg-[#d4c5a9]',
    tempC: 28,
    humidityPercent: 62,
    sampleTag: 'Sample A: 0.18 ppm·h (NORMAL)'
  },
  {
    id: 'sample-b',
    name: 'Sample B — Moderately Elevated Exposure',
    badgeId: 'DS-1088',
    workerName: 'Rahul Shetty',
    dosePpmH: 0.72,
    status: 'MONITOR',
    confidenceScore: 92,
    description: 'Moderate color change indicating accumulated H₂S exposure over shift. Monitoring recommended.',
    stripColorHex: '#8c6d48',
    stripColorBg: 'bg-[#8c6d48]',
    tempC: 29,
    humidityPercent: 67,
    sampleTag: 'Sample B: 0.72 ppm·h (MONITOR)'
  },
  {
    id: 'sample-c',
    name: 'Sample C — High Exposure Flag',
    badgeId: 'DS-1091',
    workerName: 'Sanjay Rao',
    dosePpmH: 1.24,
    status: 'REVIEW',
    confidenceScore: 89,
    description: 'Significant dark silver sulfide formation on colorimetric strip. Exceeds internal target threshold.',
    stripColorHex: '#3a2e2b',
    stripColorBg: 'bg-[#3a2e2b]',
    tempC: 31,
    humidityPercent: 71,
    sampleTag: 'Sample C: 1.24 ppm·h (REVIEW)'
  }
];

export const INITIAL_READINGS: ExposureReading[] = [
  {
    id: 'rd-101',
    timestamp: '2026-09-06T11:42:00',
    timeAgo: '11:42 AM',
    workerId: 'WRK-1042',
    workerName: 'Arjun Kumar',
    badgeId: 'DS-1042',
    dosePpmH: 0.18,
    status: 'NORMAL',
    shift: 'Morning · 06:00–14:00',
    confidenceScore: 95,
    location: 'CDU Unit 1 - Deck B',
    tempC: 28,
    humidityPercent: 62,
    stripColorHex: '#d4c5a9',
    isDemo: true
  },
  {
    id: 'rd-102',
    timestamp: '2026-09-06T11:37:00',
    timeAgo: '11:37 AM',
    workerId: 'WRK-2048',
    workerName: 'Rahul Shetty',
    badgeId: 'DS-1088',
    dosePpmH: 0.72,
    status: 'MONITOR',
    shift: 'Morning · 06:00–14:00',
    confidenceScore: 92,
    location: 'Hydrocracker Unit 2',
    tempC: 29,
    humidityPercent: 67,
    stripColorHex: '#8c6d48',
    isDemo: true
  },
  {
    id: 'rd-103',
    timestamp: '2026-09-06T11:29:00',
    timeAgo: '11:29 AM',
    workerId: 'WRK-3012',
    workerName: 'Sanjay Rao',
    badgeId: 'DS-1091',
    dosePpmH: 1.24,
    status: 'REVIEW',
    shift: 'Morning · 06:00–14:00',
    confidenceScore: 89,
    location: 'Sulfur Recovery Unit (SRU)',
    tempC: 31,
    humidityPercent: 71,
    stripColorHex: '#3a2e2b',
    isDemo: true
  },
  {
    id: 'rd-104',
    timestamp: '2026-09-06T11:18:00',
    timeAgo: '11:18 AM',
    workerId: 'WRK-1099',
    workerName: 'Priya Nair',
    badgeId: 'DS-1103',
    dosePpmH: 0.09,
    status: 'NORMAL',
    shift: 'Morning · 06:00–14:00',
    confidenceScore: 96,
    location: 'QA Central Lab',
    tempC: 25,
    humidityPercent: 55,
    stripColorHex: '#ded5c1',
    isDemo: true
  }
];

export const SHIFT_TREND_DATA = [
  { time: '06:00', avgDose: 0.02, maxDose: 0.05, scannedCount: 4 },
  { time: '07:30', avgDose: 0.08, maxDose: 0.15, scannedCount: 12 },
  { time: '09:00', avgDose: 0.19, maxDose: 0.42, scannedCount: 22 },
  { time: '10:30', avgDose: 0.35, maxDose: 0.88, scannedCount: 33 },
  { time: '12:00', avgDose: 0.44, maxDose: 1.24, scannedCount: 42 },
  { time: '13:30', avgDose: 0.48, maxDose: 1.24, scannedCount: 46 }
];

export const INITIAL_ALERTS: AlertItem[] = [
  {
    id: 'alt-1',
    type: 'REVIEW',
    title: 'DS-1091 requires exposure review',
    description: 'Sanjay Rao recorded 1.24 ppm·h cumulative exposure at SRU area.',
    badgeId: 'DS-1091',
    workerId: 'WRK-3012',
    timestamp: '11:29'
  },
  {
    id: 'alt-2',
    type: 'EXPIRY',
    title: '2 wristbands approaching expiry',
    description: 'DS-1077 (3 days remaining) and DS-1115 (5 days remaining) require re-issuance.',
    badgeId: 'DS-1077',
    workerId: 'WRK-4055',
    timestamp: '10:55'
  },
  {
    id: 'alt-3',
    type: 'INCREASE',
    title: 'Rahul Shetty exposure increased 18%',
    description: 'Shift reading escalated from 0.61 to 0.72 ppm·h during post-maintenance check.',
    badgeId: 'DS-1088',
    workerId: 'WRK-2048',
    timestamp: '11:37'
  }
];
