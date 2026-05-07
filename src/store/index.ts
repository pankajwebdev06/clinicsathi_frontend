// ------------------------------------------
// Zustand Store Exports
// ------------------------------------------

export { useAuthStore } from './auth-store';
export { usePatientStore } from './patient-store';
export { useQueueStore } from './queue-store';
export { useSyncStore } from './sync-store';

// Re-export types
export type { 
  User, 
  Clinic, 
  Patient, 
  QueueEntry, 
  SyncResult,
  SyncConflict,
  QueueStatus,
  PatientCreate,
  QueueEntryCreate,
} from '@/types';
