// ==========================================
// DoctorKaDost TypeScript Type Definitions
// ==========================================

// ------------------------------------------
// Auth Types
// ------------------------------------------
export type UserRole = 'doctor' | 'receptionist' | 'admin';

export interface User {
  id: string;
  clinic_id: string;
  mobile_number: string;
  name: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Clinic {
  id: string;
  name: string;
  doctor_name: string;
  specialization?: string;
  city?: string;
  address?: string;
  mci_number?: string;
  gstin?: string;
  phone?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
  clinic?: Clinic;
}

export interface LoginCredentials {
  mobile_number: string;
  clinic_id?: string;
}

export interface RegisterData {
  mobile_number: string;
  name: string;
  role: UserRole;
  clinic_id: string;
}

// ------------------------------------------
// Patient Types
// ------------------------------------------
export type Gender = 'M' | 'F' | 'O';

export interface Patient {
  id: string;
  clinic_id: string;
  mobile_number: string;
  name: string;
  age: number;
  gender: Gender;
  consent_given: boolean;
  consent_timestamp?: string;
  consent_given_by?: string;
  is_minor?: boolean;
  guardian_name?: string;
  guardian_relationship?: string;
  created_at: string;
  updated_at: string;
  // Frontend-specific
  syncStatus?: SyncStatus;
  isNew?: boolean;
  lastVisit?: string;
}

export interface PatientCreate {
  mobile_number: string;
  name: string;
  age: number;
  gender: Gender;
  clinic_id: string;
  consent_given: boolean;
  consent_given_by?: string;
  guardian_name?: string;
  guardian_relationship?: string;
}

export interface PatientSearchResult {
  patient: Patient | null;
  visits: number;
  lastVisit?: string;
}

// ------------------------------------------
// Queue Types
// ------------------------------------------
export type QueueStatus = 'waiting' | 'in_consultation' | 'completed' | 'cancelled';

export interface QueueEntry {
  id: string;
  clinic_id: string;
  patient_id: string;
  token_number: string;
  status: QueueStatus;
  priority?: number;
  symptoms?: string;
  bp?: string;
  weight?: string;
  temperature?: string;
  pulse?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  patient?: Patient;
  // Frontend-specific
  syncStatus?: SyncStatus;
}

export interface QueueEntryCreate {
  clinic_id: string;
  patient_id: string;
  priority?: number;
  symptoms?: string;
  bp?: string;
  weight?: string;
  temperature?: string;
  pulse?: string;
}

export interface QueueEntryUpdate {
  status?: QueueStatus;
  priority?: number;
}

// ------------------------------------------
// Consultation Types
// ------------------------------------------
export interface Consultation {
  id: string;
  clinic_id: string;
  patient_id: string;
  doctor_id: string;
  doctor_notes?: string;
  chief_complaints?: string;
  diagnosis?: string;
  handwritten_prescription_url?: string;
  reports?: string[];
  created_at: string;
  updated_at: string;
  // Joined data
  patient?: Patient;
  prescription?: Prescription;
}

export interface ConsultationCreate {
  patient_id: string;
  doctor_notes?: string;
  chief_complaints?: string;
  diagnosis?: string;
  reports?: string[];
}

// ------------------------------------------
// Prescription Types
// ------------------------------------------
export interface PrescriptionMedicine {
  id: string;
  prescription_id: string;
  medicine_name: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
  timing?: string;
  quantity?: number;
  instructions?: string;
}

export interface Prescription {
  id: string;
  clinic_id: string;
  patient_id: string;
  consultation_id?: string;
  doctor_id: string;
  diagnosis?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  medicines: PrescriptionMedicine[];
}

export interface PrescriptionCreate {
  patient_id: string;
  consultation_id?: string;
  diagnosis?: string;
  notes?: string;
  medicines: Omit<PrescriptionMedicine, 'id' | 'prescription_id'>[];
}

// ------------------------------------------
// Vitals Types
// ------------------------------------------
export interface Vitals {
  bp?: string;
  weight?: string;
  temperature?: string;
  pulse?: string;
}

// ------------------------------------------
// Sync Types
// ------------------------------------------
export type SyncStatus = 'synced' | 'pending' | 'conflict' | 'error';
export type SyncOperation = 'CREATE' | 'UPDATE' | 'DELETE';
export type SyncEntity = 'patient' | 'queue' | 'consultation' | 'prescription';

export interface SyncQueueItem {
  id?: number;
  operation: SyncOperation;
  entity: SyncEntity;
  data: unknown;
  timestamp: Date;
  retryCount: number;
  errorMessage?: string;
}

export interface SyncConflict {
  localId: string;
  serverId?: string;
  reason: string;
  serverData?: unknown;
  localData: unknown;
}

export interface SyncResult {
  synced: Array<{ localId: string; serverId: string; status: string }>;
  conflicts: SyncConflict[];
}

// ------------------------------------------
// UI/Component Types
// ------------------------------------------
export interface ApiError {
  message: string;
  status?: number;
  detail?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  skip: number;
  limit: number;
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

// ------------------------------------------
// Network Types
// ------------------------------------------
export interface NetworkStatus {
  isOnline: boolean;
  isSlowConnection: boolean;
  lastSyncedAt?: Date;
}
