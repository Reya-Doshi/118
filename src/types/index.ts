export type ExposureStatus = 'NORMAL' | 'MONITOR' | 'REVIEW';

export interface Worker {
  id: string;
  workerId: string;
  name: string;
  avatarUrl?: string;
  badgeId: string;
  currentDose: number; // in ppm·h
  status: ExposureStatus;
  shift: string;
  lastReadingTime: string;
  badgeIssuedDate: string;
  badgeExpiryDate: string;
  badgeValidityDays: number;
  department: string;
  role: string;
  trend7Day: { day: string; dose: number }[];
}

export interface ExposureReading {
  id: string;
  timestamp: string;
  timeAgo?: string;
  workerId: string;
  workerName: string;
  badgeId: string;
  sampleId?: string;
  dosePpmH: number;
  status: ExposureStatus;
  shift: string;
  confidenceScore: number;
  location: string;
  tempC: number;
  humidityPercent: number;
  stripColorHex: string;
  isDemo: boolean;
  
  // Calibration dataset specific parameters
  lab?: { L: number; a: number; b: number };
  rawColorString?: string;
  rawDeltaE?: number;
  compensatedDeltaE?: number;
  gasConc?: number;
  exposureTime?: number;
  shelfAge?: number;
  expiryStatus?: string;
  actionFlag?: string;
  tempCompensationFactor?: number;
  humidityCompensationFactor?: number;

  calibrationMetrics?: {
    referenceCalibration: number;
    colorExtraction: number;
    lightingCorrection: number;
    doseEstimation: number;
  };
}

export interface DemoSample {
  id: string;
  name: string;
  badgeId: string;
  workerName: string;
  dosePpmH: number;
  status: ExposureStatus;
  confidenceScore: number;
  description: string;
  stripColorHex: string;
  stripColorBg: string;
  tempC: number;
  humidityPercent: number;
  sampleTag: string;
  lab?: { L: number; a: number; b: number };
  deltaE?: number;
  actionFlag?: string;
  expiryStatus?: string;
  gasConc?: number;
  exposureTime?: number;
  shelfAge?: number;
}

export interface AlertItem {
  id: string;
  type: 'REVIEW' | 'EXPIRY' | 'INCREASE';
  title: string;
  description: string;
  badgeId: string;
  workerId: string;
  timestamp: string;
  safetyOfficer?: string;
  actionRequired?: string;
  dosePpmH?: number;
  tempC?: number;
  humidityPercent?: number;
}

export type PageView = 'landing' | 'dashboard' | 'worker-dashboard' | 'scan' | 'result' | 'workers' | 'history' | 'calibration' | 'kiosk' | 'explainability';

export type UserRole = 'WORKER' | 'OFFICER' | 'ADMIN';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  employeeId: string;
  department: string;
  assignedBandId?: string;
  avatarText: string;
  designation?: string;
  workLocation?: string;
  shift?: string;
}
