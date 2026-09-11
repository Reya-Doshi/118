import type { User, Worker, Wristband, Reading, Shift, Alert, DemoSampleBadge, ExposureStatus } from '../types/mobile';

export const DEMO_USERS: User[] = [
  {
    id: 'usr-worker-1',
    name: 'Rahul Shetty',
    email: 'rahul.shetty@refinery-safety.io',
    phone: '+91 98765 43210',
    role: 'WORKER',
    workerId: 'WRK-2048',
    createdAt: '2026-08-01'
  },
  {
    id: 'usr-safety-1',
    name: 'Inspector Meera Patel',
    email: 'm.patel@refinery-safety.io',
    phone: '+91 98765 88990',
    role: 'SAFETY_OFFICER',
    createdAt: '2026-07-15'
  },
  {
    id: 'usr-admin-1',
    name: 'Chief Supervisor Anand Verma',
    email: 'a.verma@refinery-safety.io',
    phone: '+91 98765 11223',
    role: 'ADMIN',
    createdAt: '2026-06-01'
  }
];

export const DEMO_SAMPLES: DemoSampleBadge[] = [
  {
    id: 'sample-1',
    label: 'Normal Exposure (0.18 ppm·h)',
    bandId: 'DS-1042',
    workerId: 'WRK-1042',
    workerName: 'Arjun Kumar',
    workLocation: 'CDU Column Platform Deck 4',
    estimatedDose: 0.18,
    status: 'NORMAL',
    confidence: 95,
    temperature: 28,
    humidity: 62,
    shelfAgeDays: 14,
    colorHex: '#d4c5a9',
    isExpired: false,
    description: 'Minimal chemical shift. Safe operational baseline.'
  },
  {
    id: 'sample-2',
    label: 'Monitor Exposure (0.72 ppm·h)',
    bandId: 'DS-1088',
    workerId: 'WRK-2048',
    workerName: 'Rahul Shetty',
    workLocation: 'Hydrocracker Unit 2 - Reactor Top Deck',
    estimatedDose: 0.72,
    status: 'MONITOR',
    confidence: 92,
    temperature: 32,
    humidity: 68,
    shelfAgeDays: 24,
    colorHex: '#8c6d48',
    isExpired: false,
    description: 'Moderate silver sulfide darkening. Intermediate action level.'
  },
  {
    id: 'sample-3',
    label: 'High Review Exposure (1.24 ppm·h)',
    bandId: 'DS-1091',
    workerId: 'WRK-3012',
    workerName: 'Sanjay Rao',
    workLocation: 'Sulfur Recovery Unit - Tail Gas Treater',
    estimatedDose: 1.24,
    status: 'REVIEW',
    confidence: 89,
    temperature: 34,
    humidity: 71,
    shelfAgeDays: 32,
    colorHex: '#3a2e2b',
    isExpired: false,
    description: 'Dark silver sulfide layer. Exceeds shift internal target.'
  },
  {
    id: 'sample-4',
    label: 'Expired Badge (>90 Days Shelf Life)',
    bandId: 'DS-1077',
    workerId: 'WRK-4055',
    workerName: 'Vikram Singh',
    workLocation: 'Amine Treating Absorber Base',
    estimatedDose: 0.0,
    status: 'REVIEW',
    confidence: 65,
    temperature: 31,
    humidity: 70,
    shelfAgeDays: 94,
    colorHex: '#8a7d65',
    isExpired: true,
    description: 'Badge shelf age exceeded 90 days. Chemical matrix expired.'
  }
];

class DosimeterRepository {
  private workers: Worker[] = [
    {
      workerId: 'WRK-2048',
      name: 'Rahul Shetty',
      employeeId: 'EMP-9021',
      department: 'Hydrocracker Unit 2',
      designation: 'Lead Process Operator',
      assignedBandId: 'DS-1088',
      status: 'MONITOR',
      currentDose: 0.72,
      lastReadingTime: '11:37 AM Today',
      shift: 'Morning · 06:00–14:00',
      workLocation: 'Reactor Top Platform Deck B (High Elevation)',
      hazardZone: 'High-Pressure H₂/H₂S Catalytic Circuit',
      riskLevel: 'HIGH',
      wearTimeHours: 5.6,
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
      workerId: 'WRK-3012',
      name: 'Sanjay Rao',
      employeeId: 'EMP-7741',
      department: 'Sulfur Recovery Unit (SRU)',
      designation: 'Senior Maintenance Technician',
      assignedBandId: 'DS-1091',
      status: 'REVIEW',
      currentDose: 1.24,
      lastReadingTime: '11:29 AM Today',
      shift: 'Morning · 06:00–14:00',
      workLocation: 'Claus Furnace & Tail Gas Catalytic Converter',
      hazardZone: 'Concentrated Acid Gas & Liquid Sulfur Sump',
      riskLevel: 'HIGH',
      wearTimeHours: 5.4,
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
      workerId: 'WRK-1042',
      name: 'Arjun Kumar',
      employeeId: 'EMP-8812',
      department: 'Crude Distillation Unit (CDU)',
      designation: 'Shift Field Safety Inspector',
      assignedBandId: 'DS-1042',
      status: 'NORMAL',
      currentDose: 0.18,
      lastReadingTime: '11:42 AM Today',
      shift: 'Morning · 06:00–14:00',
      workLocation: 'Atmospheric Distillation Column Platform 4',
      hazardZone: 'Sour Crude Overhead Vapor Stream',
      riskLevel: 'MEDIUM',
      wearTimeHours: 5.7,
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
      workerId: 'WRK-1099',
      name: 'Priya Nair',
      employeeId: 'EMP-9102',
      department: 'QA & Analytical Lab',
      designation: 'Senior Chemist & Chromatographer',
      assignedBandId: 'DS-1103',
      status: 'NORMAL',
      currentDose: 0.09,
      lastReadingTime: '11:18 AM Today',
      shift: 'Morning · 06:00–14:00',
      workLocation: 'Central Laboratory Gas Chromatography Bay 2',
      hazardZone: 'Controlled Exhaust Fume Hood Bay',
      riskLevel: 'LOW',
      wearTimeHours: 5.3,
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
      workerId: 'WRK-4055',
      name: 'Vikram Singh',
      employeeId: 'EMP-6531',
      department: 'Desulfurization Unit',
      designation: 'Field Valve Operator',
      assignedBandId: 'DS-1077',
      status: 'NORMAL',
      currentDose: 0.45,
      lastReadingTime: '10:55 AM Today',
      shift: 'Morning · 06:00–14:00',
      workLocation: 'Amine Contactor Column Base Level 1',
      hazardZone: 'Lean/Rich Amine Piping Manifold',
      riskLevel: 'MEDIUM',
      wearTimeHours: 4.9,
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
      workerId: 'WRK-2018',
      name: 'Anita Desai',
      employeeId: 'EMP-8234',
      department: 'Tank Farm & Crude Storage',
      designation: 'Operations Gauge Specialist',
      assignedBandId: 'DS-1115',
      status: 'MONITOR',
      currentDose: 0.88,
      lastReadingTime: '10:40 AM Today',
      shift: 'Morning · 06:00–14:00',
      workLocation: 'Floating Roof Crude Storage Tank TK-104 Top Deck',
      hazardZone: 'Tank Vapor Seal & Headspace Venting Zone',
      riskLevel: 'HIGH',
      wearTimeHours: 4.6,
      trend7Day: [
        { day: 'Mon', dose: 0.20 },
        { day: 'Tue', dose: 0.38 },
        { day: 'Wed', dose: 0.52 },
        { day: 'Thu', dose: 0.65 },
        { day: 'Fri', dose: 0.74 },
        { day: 'Sat', dose: 0.82 },
        { day: 'Sun', dose: 0.88 }
      ]
    },
    {
      workerId: 'WRK-5102',
      name: 'Manoj Tiwari',
      employeeId: 'EMP-5519',
      department: 'Wastewater Treatment (WWTP)',
      designation: 'Sour Water Stripper Operator',
      assignedBandId: 'DS-1120',
      status: 'MONITOR',
      currentDose: 0.54,
      lastReadingTime: '09:15 AM Today',
      shift: 'Morning · 06:00–14:00',
      workLocation: 'Sour Water Stripper Column Overhead Condenser',
      hazardZone: 'Hydrogen Sulfide Desorption Flue',
      riskLevel: 'MEDIUM',
      wearTimeHours: 3.2,
      trend7Day: [
        { day: 'Mon', dose: 0.12 },
        { day: 'Tue', dose: 0.22 },
        { day: 'Wed', dose: 0.31 },
        { day: 'Thu', dose: 0.42 },
        { day: 'Fri', dose: 0.48 },
        { day: 'Sat', dose: 0.52 },
        { day: 'Sun', dose: 0.54 }
      ]
    },
    {
      workerId: 'WRK-3340',
      name: 'Farhan Khan',
      employeeId: 'EMP-3920',
      department: 'Bitumen & Asphalt Unit',
      designation: 'Rail Tanker Loading Specialist',
      assignedBandId: 'DS-1134',
      status: 'NORMAL',
      currentDose: 0.35,
      lastReadingTime: '08:45 AM Today',
      shift: 'Morning · 06:00–14:00',
      workLocation: 'Heavy Bitumen Loading Gantry Platform 3',
      hazardZone: 'Hot Asphalt Vapor Dispenser Manifold',
      riskLevel: 'MEDIUM',
      wearTimeHours: 2.8,
      trend7Day: [
        { day: 'Mon', dose: 0.08 },
        { day: 'Tue', dose: 0.14 },
        { day: 'Wed', dose: 0.19 },
        { day: 'Thu', dose: 0.25 },
        { day: 'Fri', dose: 0.29 },
        { day: 'Sat', dose: 0.33 },
        { day: 'Sun', dose: 0.35 }
      ]
    },
    {
      workerId: 'WRK-4421',
      name: 'Sunita Murthy',
      employeeId: 'EMP-4421',
      department: 'Flare System & Relief',
      designation: 'Pressure Relief Systems Specialist',
      assignedBandId: 'DS-1142',
      status: 'MONITOR',
      currentDose: 0.65,
      lastReadingTime: '09:50 AM Today',
      shift: 'Morning · 06:00–14:00',
      workLocation: 'High-Pressure Flare Knockout Drum Perimeter',
      hazardZone: 'Emergency Blowdown Gas Header Manifold',
      riskLevel: 'HIGH',
      wearTimeHours: 3.8,
      trend7Day: [
        { day: 'Mon', dose: 0.15 },
        { day: 'Tue', dose: 0.28 },
        { day: 'Wed', dose: 0.38 },
        { day: 'Thu', dose: 0.47 },
        { day: 'Fri', dose: 0.55 },
        { day: 'Sat', dose: 0.61 },
        { day: 'Sun', dose: 0.65 }
      ]
    },
    {
      workerId: 'WRK-6019',
      name: 'Rajesh Gokhale',
      employeeId: 'EMP-6019',
      department: 'Hydrogen Generation Unit (HGU)',
      designation: 'Reformer Lead Engineer',
      assignedBandId: 'DS-1150',
      status: 'NORMAL',
      currentDose: 0.22,
      lastReadingTime: '10:10 AM Today',
      shift: 'Morning · 06:00–14:00',
      workLocation: 'Hydrodesulfurization Catalyst Vessel Skids',
      hazardZone: 'Reformer Feed Gas Purification Enclosure',
      riskLevel: 'LOW',
      wearTimeHours: 4.1,
      trend7Day: [
        { day: 'Mon', dose: 0.04 },
        { day: 'Tue', dose: 0.07 },
        { day: 'Wed', dose: 0.11 },
        { day: 'Thu', dose: 0.15 },
        { day: 'Fri', dose: 0.18 },
        { day: 'Sat', dose: 0.20 },
        { day: 'Sun', dose: 0.22 }
      ]
    }
  ];

  private wristbands: Wristband[] = [
    {
      bandId: 'DS-1088',
      workerId: 'WRK-2048',
      workerName: 'Rahul Shetty',
      activationDate: '2026-08-18',
      expiryDate: '2026-09-27',
      shelfAgeDays: 24,
      status: 'ACTIVE',
      batchNumber: 'BATCH-2026-08A',
      calibrationBatch: 'CAL-REF-D65-01'
    },
    {
      bandId: 'DS-1091',
      workerId: 'WRK-3012',
      workerName: 'Sanjay Rao',
      activationDate: '2026-08-10',
      expiryDate: '2026-09-19',
      shelfAgeDays: 32,
      status: 'ACTIVE',
      batchNumber: 'BATCH-2026-08A',
      calibrationBatch: 'CAL-REF-D65-01'
    },
    {
      bandId: 'DS-1042',
      workerId: 'WRK-1042',
      workerName: 'Arjun Kumar',
      activationDate: '2026-09-01',
      expiryDate: '2026-10-10',
      shelfAgeDays: 10,
      status: 'ACTIVE',
      batchNumber: 'BATCH-2026-09B',
      calibrationBatch: 'CAL-REF-D65-02'
    },
    {
      bandId: 'DS-1103',
      workerId: 'WRK-1099',
      workerName: 'Priya Nair',
      activationDate: '2026-09-02',
      expiryDate: '2026-10-11',
      shelfAgeDays: 9,
      status: 'ACTIVE',
      batchNumber: 'BATCH-2026-09B',
      calibrationBatch: 'CAL-REF-D65-02'
    },
    {
      bandId: 'DS-1077',
      workerId: 'WRK-4055',
      workerName: 'Vikram Singh',
      activationDate: '2026-06-01',
      expiryDate: '2026-09-01',
      shelfAgeDays: 94,
      status: 'EXPIRED',
      batchNumber: 'BATCH-2026-06A',
      calibrationBatch: 'CAL-REF-D65-01'
    },
    {
      bandId: 'DS-1115',
      workerId: 'WRK-2018',
      workerName: 'Anita Desai',
      activationDate: '2026-08-25',
      expiryDate: '2026-10-04',
      shelfAgeDays: 17,
      status: 'ACTIVE',
      batchNumber: 'BATCH-2026-08C',
      calibrationBatch: 'CAL-REF-D65-02'
    },
    {
      bandId: 'DS-1120',
      workerId: 'WRK-5102',
      workerName: 'Manoj Tiwari',
      activationDate: '2026-09-01',
      expiryDate: '2026-10-10',
      shelfAgeDays: 10,
      status: 'ACTIVE',
      batchNumber: 'BATCH-2026-09B',
      calibrationBatch: 'CAL-REF-D65-02'
    },
    {
      bandId: 'DS-1134',
      workerId: 'WRK-3340',
      workerName: 'Farhan Khan',
      activationDate: '2026-08-28',
      expiryDate: '2026-10-07',
      shelfAgeDays: 14,
      status: 'ACTIVE',
      batchNumber: 'BATCH-2026-08C',
      calibrationBatch: 'CAL-REF-D65-02'
    },
    {
      bandId: 'DS-1142',
      workerId: 'WRK-4421',
      workerName: 'Sunita Murthy',
      activationDate: '2026-08-15',
      expiryDate: '2026-09-24',
      shelfAgeDays: 27,
      status: 'ACTIVE',
      batchNumber: 'BATCH-2026-08B',
      calibrationBatch: 'CAL-REF-D65-01'
    },
    {
      bandId: 'DS-1150',
      workerId: 'WRK-6019',
      workerName: 'Rajesh Gokhale',
      activationDate: '2026-09-03',
      expiryDate: '2026-10-12',
      shelfAgeDays: 8,
      status: 'ACTIVE',
      batchNumber: 'BATCH-2026-09B',
      calibrationBatch: 'CAL-REF-D65-02'
    },
    {
      bandId: 'DS-2001',
      activationDate: '2026-09-05',
      expiryDate: '2026-10-15',
      shelfAgeDays: 6,
      status: 'ACTIVE',
      batchNumber: 'BATCH-2026-09B',
      calibrationBatch: 'CAL-REF-D65-02'
    },
    {
      bandId: 'DS-2002',
      activationDate: '2026-09-08',
      expiryDate: '2026-10-18',
      shelfAgeDays: 3,
      status: 'ACTIVE',
      batchNumber: 'BATCH-2026-09B',
      calibrationBatch: 'CAL-REF-D65-02'
    }
  ];

  private readings: Reading[] = [
    {
      readingId: 'rd-101',
      workerId: 'WRK-1042',
      workerName: 'Arjun Kumar',
      bandId: 'DS-1042',
      timestamp: '11:42 AM Today',
      shiftId: 'SH-MORNING',
      estimatedDose: 0.18,
      status: 'NORMAL',
      confidence: 95,
      temperature: 28,
      humidity: 62,
      isSimulated: true,
      scanType: 'PERSONAL_WORKER_SCAN',
      notes: 'Clean morning baseline scan at Atmospheric Column platform.'
    },
    {
      readingId: 'rd-102',
      workerId: 'WRK-2048',
      workerName: 'Rahul Shetty',
      bandId: 'DS-1088',
      timestamp: '11:37 AM Today',
      shiftId: 'SH-MORNING',
      estimatedDose: 0.72,
      status: 'MONITOR',
      confidence: 92,
      temperature: 32,
      humidity: 68,
      isSimulated: true,
      scanType: 'PERSONAL_WORKER_SCAN',
      notes: 'Mid-shift check after flange gasket inspection on Reactor Deck B.'
    },
    {
      readingId: 'rd-103',
      workerId: 'WRK-3012',
      workerName: 'Sanjay Rao',
      bandId: 'DS-1091',
      timestamp: '11:29 AM Today',
      shiftId: 'SH-MORNING',
      estimatedDose: 1.24,
      status: 'REVIEW',
      confidence: 89,
      temperature: 34,
      humidity: 71,
      isSimulated: true,
      scanType: 'OFFICER_FIELD_AUDIT',
      inspectionLocation: 'Claus Furnace Area - SRU Battery Limit',
      officerNotes: 'High exposure flag confirmed by Inspector Patel. Worker rotated out.',
      notes: 'Valve maintenance inspection in SRU unit.'
    },
    {
      readingId: 'rd-104',
      workerId: 'WRK-1099',
      workerName: 'Priya Nair',
      bandId: 'DS-1103',
      timestamp: '11:18 AM Today',
      shiftId: 'SH-MORNING',
      estimatedDose: 0.09,
      status: 'NORMAL',
      confidence: 96,
      temperature: 25,
      humidity: 55,
      isSimulated: true,
      scanType: 'PERSONAL_WORKER_SCAN',
      notes: 'Routine morning badge check in QA chromatography bay.'
    },
    {
      readingId: 'rd-105',
      workerId: 'WRK-2018',
      workerName: 'Anita Desai',
      bandId: 'DS-1115',
      timestamp: '10:40 AM Today',
      shiftId: 'SH-MORNING',
      estimatedDose: 0.88,
      status: 'MONITOR',
      confidence: 91,
      temperature: 33,
      humidity: 65,
      isSimulated: true,
      scanType: 'OFFICER_FIELD_AUDIT',
      inspectionLocation: 'Storage Tank TK-104 Gauge Platform',
      officerNotes: 'Moderate sour vapor accumulation observed during roof inspection.',
      notes: 'Tank farm roof seal routine measurement.'
    }
  ];

  private alerts: Alert[] = [
    {
      alertId: 'alt-1',
      workerId: 'WRK-3012',
      workerName: 'Sanjay Rao',
      readingId: 'rd-103',
      bandId: 'DS-1091',
      severity: 'CRITICAL',
      message: 'Sanjay Rao recorded 1.24 ppm·h cumulative exposure at Claus Furnace SRU. Immediate rotation enforced.',
      timestamp: '11:29 AM',
      resolved: false
    },
    {
      alertId: 'alt-2',
      workerId: 'WRK-4055',
      workerName: 'Vikram Singh',
      bandId: 'DS-1077',
      severity: 'HIGH',
      message: 'Wristband DS-1077 expired (shelf age 94 days > 90d discard limit). Re-issuance required.',
      timestamp: '10:55 AM',
      resolved: false
    },
    {
      alertId: 'alt-3',
      workerId: 'WRK-2018',
      workerName: 'Anita Desai',
      readingId: 'rd-105',
      bandId: 'DS-1115',
      severity: 'MEDIUM',
      message: 'Anita Desai recorded 0.88 ppm·h cumulative exposure at Tank TK-104 roof. Continuous monitoring active.',
      timestamp: '10:40 AM',
      resolved: false
    },
    {
      alertId: 'alt-4',
      workerId: 'WRK-2048',
      workerName: 'Rahul Shetty',
      readingId: 'rd-102',
      bandId: 'DS-1088',
      severity: 'MEDIUM',
      message: 'Rahul Shetty exposure escalated to 0.72 ppm·h (Action level threshold reached).',
      timestamp: '11:37 AM',
      resolved: false
    }
  ];

  private listeners: Set<() => void> = new Set();

  private notify() {
    this.listeners.forEach(cb => cb());
  }

  public subscribe(cb: () => void): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  public getWorkers(): Worker[] {
    return [...this.workers];
  }

  public getWorkerById(workerId: string): Worker | undefined {
    return this.workers.find(w => w.workerId === workerId);
  }

  public getWristbands(): Wristband[] {
    return [...this.wristbands];
  }

  public getReadings(): Reading[] {
    return [...this.readings];
  }

  public getReadingsForWorker(workerId: string): Reading[] {
    return this.readings.filter(r => r.workerId === workerId);
  }

  public getAlerts(): Alert[] {
    return [...this.alerts];
  }

  public saveReading(readingData: Omit<Reading, 'readingId'>): Reading {
    const readingId = `rd-${Date.now().toString().slice(-4)}`;
    const newReading: Reading = {
      ...readingData,
      readingId
    };

    this.readings.unshift(newReading);

    // Update worker status and dose
    const workerIndex = this.workers.findIndex(w => w.workerId === newReading.workerId);
    if (workerIndex !== -1) {
      this.workers[workerIndex] = {
        ...this.workers[workerIndex],
        currentDose: newReading.estimatedDose,
        status: newReading.status,
        lastReadingTime: 'Just now'
      };
    }

    // Auto generate alert if threshold breached
    if (newReading.status === 'REVIEW') {
      this.alerts.unshift({
        alertId: `alt-${Date.now().toString().slice(-4)}`,
        workerId: newReading.workerId,
        workerName: newReading.workerName,
        readingId: newReading.readingId,
        bandId: newReading.bandId,
        severity: 'CRITICAL',
        message: `${newReading.workerName} recorded high exposure of ${newReading.estimatedDose} ppm·h on band ${newReading.bandId} [${newReading.scanType === 'OFFICER_FIELD_AUDIT' ? 'Officer Audit' : 'Personal Scan'}].`,
        timestamp: 'Just now',
        resolved: false
      });
    } else if (newReading.status === 'MONITOR') {
      this.alerts.unshift({
        alertId: `alt-${Date.now().toString().slice(-4)}`,
        workerId: newReading.workerId,
        workerName: newReading.workerName,
        readingId: newReading.readingId,
        bandId: newReading.bandId,
        severity: 'MEDIUM',
        message: `${newReading.workerName} recorded elevated exposure of ${newReading.estimatedDose} ppm·h on band ${newReading.bandId}.`,
        timestamp: 'Just now',
        resolved: false
      });
    }

    this.notify();
    return newReading;
  }

  public assignBandToWorker(bandId: string, workerId: string): boolean {
    const band = this.wristbands.find(b => b.bandId === bandId);
    const worker = this.workers.find(w => w.workerId === workerId);

    if (!band || !worker) return false;

    band.workerId = worker.workerId;
    band.workerName = worker.name;
    worker.assignedBandId = band.bandId;

    this.notify();
    return true;
  }

  public resolveAlert(alertId: string): void {
    const alert = this.alerts.find(a => a.alertId === alertId);
    if (alert) {
      alert.resolved = true;
      this.notify();
    }
  }
}

export const repository = new DosimeterRepository();
