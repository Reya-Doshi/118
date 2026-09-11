export type UserRole = 'WORKER' | 'SAFETY_OFFICER' | 'ADMIN';

export type ExposureStatus = 'NORMAL' | 'MONITOR' | 'REVIEW';

export type WristbandStatus = 'ACTIVE' | 'EXPIRED' | 'DEGRADED';

export type AlertSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  workerId?: string; // If role === 'WORKER'
  createdAt: string;
}

export interface Worker {
  workerId: string;
  name: string;
  employeeId: string;
  department: string;
  designation: string;
  assignedBandId: string;
  status: ExposureStatus;
  currentDose: number; // in ppm·h
  lastReadingTime?: string;
  shift: string;
  workLocation: string; // Specific area/deck (e.g., "Reactor Top Platform Deck B")
  hazardZone: string; // Specific hazard description
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  wearTimeHours: number;
  trend7Day: { day: string; dose: number }[];
}

export interface Wristband {
  bandId: string;
  workerId?: string;
  workerName?: string;
  activationDate: string;
  expiryDate: string;
  shelfAgeDays: number;
  status: WristbandStatus;
  batchNumber: string;
  calibrationBatch: string;
}

export interface Reading {
  readingId: string;
  workerId: string;
  workerName: string;
  bandId: string;
  timestamp: string;
  shiftId: string;
  estimatedDose: number; // ppm·h
  status: ExposureStatus;
  confidence: number; // 0-100 percentage
  temperature: number; // Celsius
  humidity: number; // %
  imageUri?: string;
  isSimulated: boolean;
  notes?: string;
  scanType: 'PERSONAL_WORKER_SCAN' | 'OFFICER_FIELD_AUDIT';
  inspectionLocation?: string;
  officerNotes?: string;
  
  // Pipeline calibration details
  lab?: { L: number; a: number; b: number };
  deltaE?: number;
  expiryWarning?: string;
  actionRecommendation?: string;
}

export interface Shift {
  shiftId: string;
  workerId: string;
  startTime: string;
  endTime: string;
  location: string;
}

export interface Alert {
  alertId: string;
  workerId: string;
  workerName: string;
  readingId?: string;
  bandId: string;
  severity: AlertSeverity;
  message: string;
  timestamp: string;
  resolved: boolean;
}

export interface DemoSampleBadge {
  id: string;
  label: string;
  bandId: string;
  workerId: string;
  workerName: string;
  workLocation?: string;
  estimatedDose: number;
  status: ExposureStatus;
  confidence: number;
  temperature: number;
  humidity: number;
  shelfAgeDays: number;
  colorHex: string;
  isExpired: boolean;
  description: string;
}
