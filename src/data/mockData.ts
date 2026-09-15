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
    name: 'Stage 1 — Deep Violet / Purple (Fresh Baseline)',
    badgeId: 'DS-1042',
    workerName: 'Arjun Kumar',
    dosePpmH: 0.14,
    status: 'NORMAL',
    confidenceScore: 96,
    description: 'Pristine unreacted Cu(II)-PAN complex. Minimal chemical displacement; safe operational shift baseline.',
    stripColorHex: '#5C3A7A',
    stripColorBg: 'bg-[#5C3A7A]',
    tempC: 25,
    humidityPercent: 50,
    sampleTag: 'Stage 1: 0.14 ppm·h (NORMAL)'
  },
  {
    id: 'sample-b',
    name: 'Stage 2 — Violet-Purple (Low Exposure)',
    badgeId: 'DS-1088',
    workerName: 'Rahul Shetty',
    dosePpmH: 0.24,
    status: 'NORMAL',
    confidenceScore: 94,
    description: 'Initial sulfide displacement on Cu-PAN strip. Well within safe 8-hour shift limits.',
    stripColorHex: '#804476',
    stripColorBg: 'bg-[#804476]',
    tempC: 27,
    humidityPercent: 55,
    sampleTag: 'Stage 2: 0.24 ppm·h (NORMAL)'
  },
  {
    id: 'sample-c',
    name: 'Stage 3 — Reddish-Pink / New York Pink (Intermediate)',
    badgeId: 'DS-1088',
    workerName: 'Rahul Shetty',
    dosePpmH: 0.72,
    status: 'MONITOR',
    confidenceScore: 92,
    description: 'Characteristic intermediate Cu-PAN pink transition. Approaching 1.00 ppm·h shift action level.',
    stripColorHex: '#AF5569',
    stripColorBg: 'bg-[#AF5569]',
    tempC: 29,
    humidityPercent: 67,
    sampleTag: 'Stage 3: 0.72 ppm·h (MONITOR)'
  },
  {
    id: 'sample-d',
    name: 'Stage 4 — Orange / Amber-Orange (Elevated Review)',
    badgeId: 'DS-1091',
    workerName: 'Sanjay Rao',
    dosePpmH: 1.24,
    status: 'REVIEW',
    confidenceScore: 89,
    description: 'Significant Cu(II) demetallation. Exceeds 1.00 ppm·h shift threshold. Prototype Review Alert triggered.',
    stripColorHex: '#CD6E44',
    stripColorBg: 'bg-[#CD6E44]',
    tempC: 31,
    humidityPercent: 71,
    sampleTag: 'Stage 4: 1.24 ppm·h (REVIEW)'
  },
  {
    id: 'sample-e',
    name: 'Stage 5 — Yellow / Yellow-Orange (Critical Review)',
    badgeId: 'DS-1091',
    workerName: 'Sanjay Rao',
    dosePpmH: 1.99,
    status: 'REVIEW',
    confidenceScore: 91,
    description: 'Full displacement to free neutral H-PAN dye. 1.99 ppm·h detected. Prototype Review Alert to Mira Patel.',
    stripColorHex: '#EBB92A',
    stripColorBg: 'bg-[#EBB92A]',
    tempC: 34,
    humidityPercent: 75,
    sampleTag: 'Stage 5: 1.99 ppm·h (REVIEW)'
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
    dosePpmH: 0.14,
    status: 'NORMAL',
    shift: 'Morning · 06:00–14:00',
    confidenceScore: 96,
    location: 'CDU Unit 1 - Deck B',
    tempC: 25,
    humidityPercent: 50,
    stripColorHex: '#5C3A7A',
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
    stripColorHex: '#AF5569',
    isDemo: true
  },
  {
    id: 'rd-103',
    timestamp: '2026-09-06T11:29:00',
    timeAgo: '11:29 AM',
    workerId: 'WRK-3012',
    workerName: 'Sanjay Rao',
    badgeId: 'DS-1091',
    dosePpmH: 1.99,
    status: 'REVIEW',
    shift: 'Morning · 06:00–14:00',
    confidenceScore: 91,
    location: 'Sulfur Recovery Unit (SRU)',
    tempC: 31,
    humidityPercent: 71,
    stripColorHex: '#EBB92A',
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
    stripColorHex: '#5C3A7A',
    isDemo: true
  }
];

export const SHIFT_TREND_DATA = [
  { time: '06:00', avgDose: 0.02, maxDose: 0.05, scannedCount: 4 },
  { time: '07:30', avgDose: 0.08, maxDose: 0.15, scannedCount: 12 },
  { time: '09:00', avgDose: 0.19, maxDose: 0.42, scannedCount: 22 },
  { time: '10:30', avgDose: 0.35, maxDose: 0.88, scannedCount: 33 },
  { time: '12:00', avgDose: 0.44, maxDose: 1.24, scannedCount: 42 },
  { time: '13:30', avgDose: 0.52, maxDose: 1.99, scannedCount: 46 }
];

export const INITIAL_ALERTS: AlertItem[] = [
  {
    id: 'alt-1',
    type: 'REVIEW',
    title: 'Prototype Review Alert: DS-1091',
    description: 'Sanjay Rao (WRK-3012) recorded 1.99 ppm·h at 31°C, 71% RH. Action: Review exposure and verify workplace conditions.',
    badgeId: 'DS-1091',
    workerId: 'WRK-3012',
    timestamp: '11:29',
    safetyOfficer: 'Mira Patel',
    actionRequired: 'Review exposure and verify workplace conditions.',
    dosePpmH: 1.99,
    tempC: 31,
    humidityPercent: 71
  },
  {
    id: 'alt-2',
    type: 'EXPIRY',
    title: '2 wristbands approaching expiry',
    description: 'DS-1077 (3 days remaining) and DS-1115 (5 days remaining) require re-issuance.',
    badgeId: 'DS-1077',
    workerId: 'WRK-4055',
    timestamp: '10:55',
    safetyOfficer: 'Mira Patel',
    actionRequired: 'Inspect dosimeter validity and reissue if necessary.'
  },
  {
    id: 'alt-3',
    type: 'INCREASE',
    title: 'Rahul Shetty exposure increased to 0.72 ppm·h',
    description: 'Shift reading reached 0.72 ppm·h (Action Level). Wear breathing protection on high-elevation decks.',
    badgeId: 'DS-1088',
    workerId: 'WRK-2048',
    timestamp: '11:37',
    safetyOfficer: 'Mira Patel',
    actionRequired: 'Verify area ventilation on Cat-Cracking Deck B.'
  }
];
