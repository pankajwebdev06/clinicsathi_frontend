import { create } from 'zustand';
import { db } from '@/lib/db/schema';
import { syncManager } from '@/lib/sync/sync-manager';
import type { SyncResult, SyncConflict } from '@/types';

// ------------------------------------------
// Sync State Types
// ------------------------------------------
interface SyncState {
  // State
  isOnline: boolean;
  isSyncing: boolean;
  pendingCount: number;
  lastSyncAt: Date | null;
  conflicts: SyncConflict[];
  isSlowConnection: boolean;

  // Actions
  setOnlineStatus: (isOnline: boolean) => void;
  setSlowConnection: (isSlow: boolean) => void;
  startSync: () => Promise<SyncResult>;
  resolveConflict: (conflict: SyncConflict, useServer: boolean) => Promise<void>;
  refreshSyncStatus: () => Promise<void>;
  clearConflicts: () => void;
}

// ------------------------------------------
// Network Monitor
// ------------------------------------------
let connectionMonitor: EventTarget | null = null;

function initNetworkMonitoring(callback: (online: boolean) => void) {
  if (typeof window === 'undefined') return;

  // Listen for online/offline events
  window.addEventListener('online', () => callback(true));
  window.addEventListener('offline', () => callback(false));

  // Check connection speed periodically
  setInterval(() => {
    if (navigator.onLine && 'connection' in navigator) {
      const connection = (navigator as Navigator & { connection?: { effectiveType?: string } }).connection;
      if (connection?.effectiveType) {
        const isSlow = ['2g', 'slow-2g'].includes(connection.effectiveType);
        // Emit slow connection event
        window.dispatchEvent(new CustomEvent('slowConnection', { detail: { isSlow } }));
      }
    }
  }, 30000);
}

// ------------------------------------------
// Sync Store
// ------------------------------------------
export const useSyncStore = create<SyncState>((set, get) => {
  // Initialize network monitoring on client
  if (typeof window !== 'undefined') {
    initNetworkMonitoring((isOnline) => {
      set({ isOnline });
      
      // Auto-sync when coming back online
      if (isOnline) {
        get().startSync().catch(console.error);
      }
    });

    // Listen for slow connection events
    window.addEventListener('slowConnection', ((event: Event) => {
      const customEvent = event as CustomEvent<{ isSlow: boolean }>;
      set({ isSlowConnection: customEvent.detail.isSlow });
    }) as EventListener);
  }

  return {
    // Initial State
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    isSyncing: false,
    pendingCount: 0,
    lastSyncAt: null,
    conflicts: [],
    isSlowConnection: false,

    // Actions
    setOnlineStatus: (isOnline) => {
      set({ isOnline });
    },

    setSlowConnection: (isSlow) => {
      set({ isSlowConnection: isSlow });
    },

    startSync: async () => {
      if (get().isSyncing) {
        return { synced: [], conflicts: [] };
      }

      if (!navigator.onLine) {
        throw new Error('Cannot sync while offline');
      }

      set({ isSyncing: true });

      try {
        const result = await syncManager.startSync();
        
        // Refresh status after sync
        const pendingCount = await db.getPendingSyncCount();
        const lastSyncAt = await db.getLastSyncTimestamp();

        set({
          isSyncing: false,
          pendingCount,
          lastSyncAt,
          conflicts: [...get().conflicts, ...result.conflicts],
        });

        return result;
      } catch (error) {
        set({ isSyncing: false });
        throw error;
      }
    },

    resolveConflict: async (conflict, useServer) => {
      // Remove from conflicts list
      set((state) => ({
        conflicts: state.conflicts.filter((c) => c.localId !== conflict.localId),
      }));

      if (useServer && conflict.serverData) {
        // Apply server data to local DB
        // This would need entity-specific handling
        console.log('Applying server data:', conflict.serverData);
      } else {
        // Re-queue local data for sync
        await syncManager.queueOperation('UPDATE', 'patient', conflict.localData);
      }
    },

    refreshSyncStatus: async () => {
      const [pendingCount, lastSyncAt] = await Promise.all([
        db.getPendingSyncCount(),
        db.getLastSyncTimestamp(),
      ]);

      set({
        pendingCount,
        lastSyncAt,
      });
    },

    clearConflicts: () => set({ conflicts: [] }),
  };
});
