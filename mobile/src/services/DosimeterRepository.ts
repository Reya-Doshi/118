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
    estimatedDose: 0.18,
    status: 'NORMAL',
    confidence: 95,
    temperature: 28,
    humidity: 62,
    shelfAgeDays: 14,
    colorHex: '#d4c5a9',
    isExpired: false,
    description: 'Minimal chemical shift. Safe baseline shift exposure.'
  },
  {
    id: 'sample-2',
    label: 'Monitor Exposure (0.72 ppm·h)',
    bandId: 'DS-1088',
    workerId: 'WRK-2048',
    workerName: 'Rahul Shetty',
    estimatedDose: 0.72,
    status: 'MONITOR',
    confidence: 92,
    temperature: 32,
    humidity: 68,
    shelfAgeDays: 24,
    colorHex: '#8c6d48',
    isExpired: false,
    description: 'Moderate silver sulfide darkening. Close monitoring recommended.'
  },
  {
    id: 'sample-3',
    label: 'High Review Exposure (1.24 ppm·h)',
    bandId: 'DS-1091',
    workerId: 'WRK-3012',
    workerName: 'Sanjay Rao',
    estimatedDose: 1.24,
    status: 'REVIEW',
    confidence: 89,
    temperature: 34,
    humidity: 71,
    shelfAgeDays: 32,
    colorHex: '#3a2e2b',
    isExpired: false,
    description: 'Significant cumulative H2S exposure over shift threshold.'
  },
  {
    id: 'sample-4',
    label: 'Expired Badge (>90 Days Shelf Life)',
    bandId: 'DS-013',
    workerId: 'WRK-4055',
    workerName: 'Vikram Singh',
    estimatedDose: 0.0,
    status: 'REVIEW',
    confidence: 65,
    temperature: 31,
    humidity: 70,
    shelfAgeDays: 95,
    colorHex: '#8a7d65',
    isExpired: true,
    description: 'Badge expired (>90 days). Chemical sensing strip degraded.'
  }
];

class DosimeterRepository {
  private workers: Worker[] = [
    {
      workerId: 'WRK-2048',
      name: 'Rahul Shetty',
      employeeId: 'EMP-9021',
      department: 'Hydrocracker Unit 2',
      designation: 'Process Operator',
      assignedBandId: 'DS-1088',
      status: 'MONITOR',
      currentDose: 0.72,
      lastReadingTime: '11:37 AM Today',
      shift: 'Morning · 06:00–14:00'
    },
    {
      workerId: 'WRK-3012',
      name: 'Sanjay Rao',
      employeeId: 'EMP-7741',
      department: 'Sulfur Recovery Unit (SRU)',
      designation: 'Maintenance Technician',
      assignedBandId: 'DS-1091',
      status: 'REVIEW',
      currentDose: 1.24,
      lastReadingTime: '11:29 AM Today',
      shift: 'Morning · 06:00–14:00'
    },
    {
      workerId: 'WRK-1042',
      name: 'Arjun Kumar',
      employeeId: 'EMP-8812',
      department: 'Crude Distillation Unit (CDU)',
      designation: 'Safety Inspector',
      assignedBandId: 'DS-1042',
      status: 'NORMAL',
      currentDose: 0.18,
      lastReadingTime: '11:42 AM Today',
      shift: 'Morning · 06:00–14:00'
    },
    {
      workerId: 'WRK-1099',
      name: 'Priya Nair',
      employeeId: 'EMP-9102',
      department: 'Quality Assurance Lab',
      designation: 'Lab Chemist',
      assignedBandId: 'DS-1103',
      status: 'NORMAL',
      currentDose: 0.09,
      lastReadingTime: '11:18 AM Today',
      shift: 'Morning · 06:00–14:00'
    },
    {
      workerId: 'WRK-4055',
      name: 'Vikram Singh',
      employeeId: 'EMP-6531',
      department: 'Desulfurization Unit',
      designation: 'Field Engineer',
      assignedBandId: 'DS-1077',
      status: 'NORMAL',
      currentDose: 0.45,
      lastReadingTime: '10:55 AM Today',
      shift: 'Morning · 06:00–14:00'
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
      batchNumber: 'BATCH-2026-08A'
    },
    {
      bandId: 'DS-1091',
      workerId: 'WRK-3012',
      workerName: 'Sanjay Rao',
      activationDate: '2026-08-10',
      expiryDate: '2026-09-19',
      shelfAgeDays: 32,
      status: 'ACTIVE',
      batchNumber: 'BATCH-2026-08A'
    },
    {
      bandId: 'DS-1042',
      workerId: 'WRK-1042',
      workerName: 'Arjun Kumar',
      activationDate: '2026-09-01',
      expiryDate: '2026-10-10',
      shelfAgeDays: 10,
      status: 'ACTIVE',
      batchNumber: 'BATCH-2026-09B'
    },
    {
      bandId: 'DS-1103',
      workerId: 'WRK-1099',
      workerName: 'Priya Nair',
      activationDate: '2026-09-02',
      expiryDate: '2026-10-11',
      shelfAgeDays: 9,
      status: 'ACTIVE',
      batchNumber: 'BATCH-2026-09B'
    },
    {
      bandId: 'DS-1077',
      workerId: 'WRK-4055',
      workerName: 'Vikram Singh',
      activationDate: '2026-06-01',
      expiryDate: '2026-09-01',
      shelfAgeDays: 92,
      status: 'EXPIRED',
      batchNumber: 'BATCH-2026-06A'
    },
    {
      bandId: 'DS-2001',
      activationDate: '2026-09-05',
      expiryDate: '2026-10-15',
      shelfAgeDays: 6,
      status: 'ACTIVE',
      batchNumber: 'BATCH-2026-09B'
    }
  ];

  private readings: Reading[] = [
    {
      readingId: 'rd-101',
      workerId: 'WRK-1042',
      workerName: 'Arjun Kumar',
      bandId: 'DS-1042',
      timestamp: '2026-09-11 11:42 AM',
      shiftId: 'SH-MORNING',
      estimatedDose: 0.18,
      status: 'NORMAL',
      confidence: 95,
      temperature: 28,
      humidity: 62,
      isSimulated: true,
      notes: 'Initial morning baseline check.'
    },
    {
      readingId: 'rd-102',
      workerId: 'WRK-2048',
      workerName: 'Rahul Shetty',
      bandId: 'DS-1088',
      timestamp: '2026-09-11 11:37 AM',
      shiftId: 'SH-MORNING',
      estimatedDose: 0.72,
      status: 'MONITOR',
      confidence: 92,
      temperature: 32,
      humidity: 68,
      isSimulated: true,
      notes: 'Mid-shift monitoring scan at Hydrocracker.'
    },
    {
      readingId: 'rd-103',
      workerId: 'WRK-3012',
      workerName: 'Sanjay Rao',
      bandId: 'DS-1091',
      timestamp: '2026-09-11 11:29 AM',
      shiftId: 'SH-MORNING',
      estimatedDose: 1.24,
      status: 'REVIEW',
      confidence: 89,
      temperature: 34,
      humidity: 71,
      isSimulated: true,
      notes: 'Valve maintenance inspection reading.'
    },
    {
      readingId: 'rd-104',
      workerId: 'WRK-1099',
      workerName: 'Priya Nair',
      bandId: 'DS-1103',
      timestamp: '2026-09-11 11:18 AM',
      shiftId: 'SH-MORNING',
      estimatedDose: 0.09,
      status: 'NORMAL',
      confidence: 96,
      temperature: 25,
      humidity: 55,
      isSimulated: true,
      notes: 'QA Lab routine calibration.'
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
      message: 'Sanjay Rao recorded 1.24 ppm·h cumulative exposure at SRU area.',
      timestamp: '11:29 AM',
      resolved: false
    },
    {
      alertId: 'alt-2',
      workerId: 'WRK-4055',
      workerName: 'Vikram Singh',
      bandId: 'DS-1077',
      severity: 'HIGH',
      message: 'Wristband DS-1077 expired (shelf age > 90 days). Requires replacement.',
      timestamp: '10:55 AM',
      resolved: false
    },
    {
      alertId: 'alt-3',
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
        message: `${newReading.workerName} recorded high exposure of ${newReading.estimatedDose} ppm·h on band ${newReading.bandId}.`,
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
