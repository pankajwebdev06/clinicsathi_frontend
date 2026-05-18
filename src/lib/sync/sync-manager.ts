import { db, generateLocalId, isLocalId } from '../db/schema';
import type { 
  SyncQueueItem, 
  SyncResult, 
  SyncConflict, 
  Patient, 
  QueueEntry,
  PatientCreate,
  QueueEntryCreate 
} from '@/types';
import { patientsApi } from '@/features/patients/api';
import { queueApi } from '@/features/queue/api';

// ------------------------------------------
// Sync Manager Class
// ------------------------------------------
class SyncManager {
  private syncing = false;
  private retryInterval = 30000; // 30 seconds
  private maxRetries = 5;

  // ── Event subscribers — used by useOfflineSync to update the banner
  // without any polling. We notify whenever the sync queue could have
  // changed (start/end of sync, an operation queued for later).
  private listeners = new Set<() => void>();

  onChange(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  }

  private notify(): void {
    this.listeners.forEach(l => { try { l(); } catch { /* ignore subscriber errors */ } });
  }

  // ------------------------------------------
  // Public Methods
  // ------------------------------------------

  /**
   * Start manual sync process
   */
  async startSync(): Promise<SyncResult> {
    if (this.syncing) {
      return { synced: [], conflicts: [] };
    }

    if (!navigator.onLine) {
      throw new Error('Cannot sync while offline');
    }

    this.syncing = true;
    this.notify();   // banner can flip to "Syncing…"
    const results: SyncResult = { synced: [], conflicts: [] };

    try {
      // Get all pending operations ordered by timestamp
      const pending = await db.syncQueue.orderBy('timestamp').toArray();

      for (const operation of pending) {
        try {
          const syncResult = await this.syncOperation(operation);
          
          if (syncResult) {
            results.synced.push(syncResult);
            // Remove from queue on success
            await db.syncQueue.delete(operation.id!);
          }
        } catch (error) {
          await this.handleSyncError(operation, error as Error, results);
        }
      }

      // Update last sync timestamp
      await db.setLastSyncTimestamp();

      return results;
    } finally {
      this.syncing = false;
      this.notify();   // banner can clear or update remaining pending count
    }
  }

  /**
   * Auto-sync ONLY on real network events — no periodic polling.
   *
   * Triggers:
   *   1. App startup, if currently online AND there are pending items
   *   2. The browser's `online` event (offline → online transition)
   *
   * Online-state writes (createPatient / addToQueue) hit the API synchronously
   * via `await`, so when the receptionist is connected nothing ever lands in
   * the sync queue in the first place — there's nothing to "wait" for.
   *
   * Removed: 30-second periodic interval. It was a no-op when the queue was
   * empty (the common case) and caused user confusion ("why is it always
   * trying to sync?"). If a queued item fails its initial API attempt, it'll
   * be retried the next time the device toggles back online.
   */
  private autoSyncInitialised = false;

  startAutoSync(): void {
    if (this.autoSyncInitialised) return;   // idempotent: safe to call from multiple mount points
    this.autoSyncInitialised = true;

    // Reconnect handler
    window.addEventListener('online', () => {
      console.log('[SyncManager] Back online — draining sync queue…');
      this.startSync().catch(console.error);
    });

    // Startup sweep — flush anything left over from a previous offline session
    if (navigator.onLine) {
      db.getPendingSyncCount()
        .then(count => { if (count > 0) this.startSync().catch(console.error); })
        .catch(() => { /* IndexedDB unavailable — nothing to flush */ });
    }
  }

  /**
   * Queue an operation for sync
   */
  async queueOperation(
    operation: 'CREATE' | 'UPDATE' | 'DELETE',
    entity: 'patient' | 'queue' | 'consultation' | 'prescription',
    data: unknown
  ): Promise<void> {
    await db.syncQueue.add({
      operation,
      entity,
      data,
      timestamp: new Date(),
      retryCount: 0,
    });
    this.notify();   // a new pending item appeared
  }

  /**
   * Create patient with offline support
   */
  async createPatient(patientData: PatientCreate): Promise<Patient> {
    const localId = generateLocalId();
    const patient: Patient = {
      ...patientData,
      id: localId,
      consent_timestamp: new Date().toISOString(),
      is_minor: patientData.age < 18,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      syncStatus: 'pending',
    };

    // Always save to IndexedDB first
    await db.patients.add({ ...patient, syncStatus: 'pending' });

    if (navigator.onLine) {
      try {
        // Try to sync immediately
        const response = await patientsApi.createPatient(patientData);
        
        // Update local record with server data
        await db.patients.update(localId, {
          id: response.id,
          syncStatus: 'synced',
        });

        return { ...patient, id: response.id, syncStatus: 'synced' };
      } catch (error) {
        // Queue for later sync
        await this.queueOperation('CREATE', 'patient', patient);
        return patient;
      }
    } else {
      // Offline: queue for later
      await this.queueOperation('CREATE', 'patient', patient);
      return patient;
    }
  }

  /**
   * Add to queue with offline support
   */
  async addToQueue(queueData: QueueEntryCreate): Promise<QueueEntry> {
    const localId = generateLocalId();
    const entry: QueueEntry = {
      ...queueData,
      id: localId,
      token_number: 'PENDING', // Will be generated by server
      status: 'waiting',
      priority: queueData.priority ?? 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      syncStatus: 'pending',
    };

    // Always save to IndexedDB first
    await db.queue.add({ ...entry, syncStatus: 'pending' });

    if (navigator.onLine) {
      try {
        const response = await queueApi.addToQueue(queueData);
        
        await db.queue.update(localId, {
          id: response.id,
          token_number: response.token_number,
          syncStatus: 'synced',
        });

        return { ...entry, id: response.id, token_number: response.token_number, syncStatus: 'synced' };
      } catch (error) {
        await this.queueOperation('CREATE', 'queue', entry);
        return entry;
      }
    } else {
      await this.queueOperation('CREATE', 'queue', entry);
      return entry;
    }
  }

  /**
   * Update queue status with offline support
   */
  async updateQueueStatus(entryId: string, status: string): Promise<void> {
    const entry = await db.queue.get(entryId);
    if (!entry) {
      throw new Error('Queue entry not found');
    }

    // Update local first
    await db.queue.update(entryId, {
      status: status as QueueEntry['status'],
      updated_at: new Date().toISOString(),
      syncStatus: 'pending',
    });

    if (navigator.onLine && !isLocalId(entryId)) {
      try {
        await queueApi.updateQueueEntry(entryId, { status });
        await db.queue.update(entryId, { syncStatus: 'synced' });
      } catch (error) {
        await this.queueOperation('UPDATE', 'queue', { id: entryId, status });
      }
    } else {
      await this.queueOperation('UPDATE', 'queue', { id: entryId, status });
    }
  }

  /**
   * Get sync status summary
   */
  async getSyncStatus(): Promise<{
    isSyncing: boolean;
    pendingCount: number;
    lastSync: Date | null;
    isOnline: boolean;
  }> {
    const [pendingCount, lastSync] = await Promise.all([
      db.getPendingSyncCount(),
      db.getLastSyncTimestamp(),
    ]);

    return {
      isSyncing: this.syncing,
      pendingCount,
      lastSync,
      isOnline: navigator.onLine,
    };
  }

  // ------------------------------------------
  // Private Methods
  // ------------------------------------------

  private async syncOperation(operation: SyncQueueItem): Promise<{ localId: string; serverId: string; status: string } | null> {
    switch (operation.entity) {
      case 'patient':
        return this.syncPatient(operation);
      case 'queue':
        return this.syncQueue(operation);
      default:
        console.warn(`[SyncManager] Unknown entity: ${operation.entity}`);
        return null;
    }
  }

  private async syncPatient(operation: SyncQueueItem): Promise<{ localId: string; serverId: string; status: string }> {
    const { operation: op, data } = operation as { operation: string; data: Patient };

    if (op === 'CREATE') {
      const response = await patientsApi.createPatient({
        mobile_number: data.mobile_number,
        name: data.name,
        age: data.age,
        gender: data.gender,
        clinic_id: data.clinic_id,
        consent_given: data.consent_given,
      });

      // Update local record
      await db.patients.update(data.id, {
        id: response.id,
        syncStatus: 'synced',
      });

      // Fix stale local patient IDs in pending queue sync items and db.queue.
      // When offline, queue entries are saved with patient_id = local_xxx. After
      // the patient syncs and gets a real server ID, any pending queue CREATE
      // operations must be updated to use the server ID or the backend will
      // reject them with a foreign key constraint violation.
      const pendingSyncItems = await db.syncQueue.toArray();
      for (const item of pendingSyncItems) {
        if (item.entity === 'queue' && item.id != null) {
          const qData = item.data as QueueEntry;
          if (qData.patient_id === data.id) {
            await db.syncQueue.update(item.id, {
              data: { ...qData, patient_id: response.id },
            });
          }
        }
      }
      await db.queue.where('patient_id').equals(data.id).modify({ patient_id: response.id });

      return { localId: data.id, serverId: response.id, status: 'created' };
    }

    throw new Error(`Unsupported patient operation: ${op}`);
  }

  private async syncQueue(operation: SyncQueueItem): Promise<{ localId: string; serverId: string; status: string }> {
    const { operation: op, data } = operation as { operation: string; data: QueueEntry };

    if (op === 'CREATE') {
      const response = await queueApi.addToQueue({
        clinic_id: data.clinic_id,
        patient_id: data.patient_id,
        priority: data.priority,
        symptoms: data.symptoms,
        bp: data.bp,
        weight: data.weight,
        temperature: data.temperature,
        pulse: data.pulse,
      });

      await db.queue.update(data.id, {
        id: response.id,
        token_number: response.token_number,
        syncStatus: 'synced',
      });

      return { localId: data.id, serverId: response.id, status: 'created' };
    }

    if (op === 'UPDATE') {
      const { id, ...updateData } = data as QueueEntry & { status?: string };
      
      if (isLocalId(id)) {
        // Can't update on server yet, keep in queue
        throw new Error('Local record not yet synced to server');
      }

      await queueApi.updateQueueEntry(id, updateData);
      await db.queue.update(id, { syncStatus: 'synced' });

      return { localId: id, serverId: id, status: 'updated' };
    }

    throw new Error(`Unsupported queue operation: ${op}`);
  }

  private async handleSyncError(
    operation: SyncQueueItem, 
    error: Error, 
    results: SyncResult
  ): Promise<void> {
    const newRetryCount = (operation.retryCount || 0) + 1;

    if (newRetryCount >= this.maxRetries) {
      // Max retries exceeded - mark as error
      results.conflicts.push({
        localId: (operation.data as { id?: string })?.id || 'unknown',
        reason: error.message,
        localData: operation.data,
      });
      
      await db.syncQueue.delete(operation.id!);
    } else {
      // Increment retry count
      await db.syncQueue.update(operation.id!, {
        retryCount: newRetryCount,
        errorMessage: error.message,
      });
    }
  }
}

// ------------------------------------------
// Export Singleton
// ------------------------------------------
export const syncManager = new SyncManager();
