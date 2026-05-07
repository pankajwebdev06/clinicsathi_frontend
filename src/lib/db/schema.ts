import Dexie, { Table } from 'dexie';
import type { 
  Patient, 
  QueueEntry, 
  Consultation, 
  Prescription, 
  SyncQueueItem,
  SyncStatus 
} from '@/types';

// ------------------------------------------
// IndexedDB Entity Types (with sync status)
// ------------------------------------------
export interface LocalPatient extends Patient {
  syncStatus: SyncStatus;
  localId?: string; // For tracking local-only records before server sync
}

export interface LocalQueueEntry extends QueueEntry {
  syncStatus: SyncStatus;
  localId?: string;
}

export interface LocalConsultation extends Consultation {
  syncStatus: SyncStatus;
  localId?: string;
}

export interface LocalPrescription extends Prescription {
  syncStatus: SyncStatus;
  localId?: string;
}

// ------------------------------------------
// ClinicFlow Database Class
// ------------------------------------------
class ClinicFlowDB extends Dexie {
  patients!: Table<LocalPatient, string>;
  queue!: Table<LocalQueueEntry, string>;
  consultations!: Table<LocalConsultation, string>;
  prescriptions!: Table<LocalPrescription, string>;
  syncQueue!: Table<SyncQueueItem, number>;
  meta!: Table<{ key: string; value: unknown }, string>;

  constructor() {
    super('ClinicFlowDB');
    
    this.version(1).stores({
      // Patients: index by id, clinicId, mobileNumber, and syncStatus
      patients: 'id, clinic_id, mobile_number, syncStatus, [clinic_id+mobile_number]',
      
      // Queue: index by id, clinicId, patientId, status, createdAt
      queue: 'id, clinic_id, patient_id, status, created_at, syncStatus, [clinic_id+status]',
      
      // Consultations: index by id, clinicId, patientId, createdAt
      consultations: 'id, clinic_id, patient_id, created_at, syncStatus',
      
      // Prescriptions: index by id, clinicId, patientId, consultationId
      prescriptions: 'id, clinic_id, patient_id, consultation_id, syncStatus',
      
      // Sync Queue: auto-increment id, index by entity and timestamp
      syncQueue: '++id, entity, timestamp, operation',
      
      // Meta: for storing app metadata (lastSync, etc.)
      meta: 'key'
    });
  }

  // ------------------------------------------
  // Helper Methods
  // ------------------------------------------
  
  async getLastSyncTimestamp(): Promise<Date | null> {
    const record = await this.meta.get('lastSync');
    return record?.value ? new Date(record.value as string) : null;
  }

  async setLastSyncTimestamp(date: Date = new Date()): Promise<void> {
    await this.meta.put({ key: 'lastSync', value: date.toISOString() });
  }

  async getPendingSyncCount(): Promise<number> {
    return await this.syncQueue.count();
  }

  async getPendingPatients(clinicId: string): Promise<LocalPatient[]> {
    return await this.patients
      .where({ clinic_id: clinicId, syncStatus: 'pending' })
      .toArray();
  }

  async getPendingQueueEntries(clinicId: string): Promise<LocalQueueEntry[]> {
    return await this.queue
      .where({ clinic_id: clinicId, syncStatus: 'pending' })
      .toArray();
  }

  async searchPatientsByMobile(clinicId: string, mobileNumber: string): Promise<LocalPatient[]> {
    return await this.patients
      .where({ clinic_id: clinicId, mobile_number: mobileNumber })
      .toArray();
  }

  async getQueueByStatus(clinicId: string, status: string): Promise<LocalQueueEntry[]> {
    return await this.queue
      .where({ clinic_id: clinicId, status })
      .reverse()
      .sortBy('created_at');
  }

  async clearAllData(): Promise<void> {
    await this.patients.clear();
    await this.queue.clear();
    await this.consultations.clear();
    await this.prescriptions.clear();
    await this.syncQueue.clear();
    await this.meta.clear();
  }

  async getClinicDataSize(clinicId: string): Promise<{
    patients: number;
    queue: number;
    consultations: number;
    prescriptions: number;
  }> {
    const [patientCount, queueCount, consultationCount, prescriptionCount] = await Promise.all([
      this.patients.where({ clinic_id: clinicId }).count(),
      this.queue.where({ clinic_id: clinicId }).count(),
      this.consultations.where({ clinic_id: clinicId }).count(),
      this.prescriptions.where({ clinic_id: clinicId }).count(),
    ]);

    return {
      patients: patientCount,
      queue: queueCount,
      consultations: consultationCount,
      prescriptions: prescriptionCount,
    };
  }
}

// ------------------------------------------
// Export Database Instance
// ------------------------------------------
export const db = new ClinicFlowDB();

// ------------------------------------------
// Helper Functions
// ------------------------------------------
export function generateLocalId(): string {
  return `local_${crypto.randomUUID()}`;
}

export function isLocalId(id: string): boolean {
  return id.startsWith('local_');
}
