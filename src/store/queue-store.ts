import { create } from 'zustand';
import { db } from '@/lib/db/schema';
import { syncManager } from '@/lib/sync/sync-manager';
import type { QueueEntry, QueueEntryCreate, QueueStatus } from '@/types';

// ------------------------------------------
// Queue State Types
// ------------------------------------------
interface QueueState {
  // State
  queue: QueueEntry[];
  currentToken: QueueEntry | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  loadQueue: (clinicId: string, status?: QueueStatus) => Promise<void>;
  addToQueue: (data: QueueEntryCreate) => Promise<QueueEntry>;
  updateStatus: (entryId: string, status: QueueStatus) => Promise<void>;
  removeFromQueue: (entryId: string) => Promise<void>;
  setCurrentToken: (entry: QueueEntry | null) => void;
  clearError: () => void;
  
  // Real-time
  subscribeToQueue: (clinicId: string, callback: (queue: QueueEntry[]) => void) => () => void;
}

// ------------------------------------------
// Queue Store
// ------------------------------------------
export const useQueueStore = create<QueueState>((set, get) => ({
  // Initial State
  queue: [],
  currentToken: null,
  isLoading: false,
  error: null,

  // Actions
  loadQueue: async (clinicId, status) => {
    set({ isLoading: true, error: null });

    try {
      // Load from local DB first (offline-first)
      let localQueue: QueueEntry[];
      
      if (status) {
        localQueue = await db.getQueueByStatus(clinicId, status);
      } else {
        localQueue = await db.queue
          .where({ clinic_id: clinicId })
          .reverse()
          .sortBy('created_at');
      }

      set({ queue: localQueue, isLoading: false });

      // If online, fetch from server and sync
      if (navigator.onLine) {
        try {
          const { queueApi } = await import('@/features/queue/api');
          const serverQueue = await queueApi.getQueue(clinicId, status);

          // Merge server data with local
          for (const entry of serverQueue) {
            const existing = await db.queue.get(entry.id);
            if (!existing || existing.syncStatus === 'synced') {
              await db.queue.put({ ...entry, syncStatus: 'synced' });
            }
          }

          // Reload from local DB after sync
          const updatedQueue = status 
            ? await db.getQueueByStatus(clinicId, status)
            : await db.queue.where({ clinic_id: clinicId }).reverse().sortBy('created_at');

          set({ queue: updatedQueue });
        } catch (error) {
          console.error('Server sync failed:', error);
        }
      }
    } catch (error) {
      set({
        error: (error as Error).message || 'Failed to load queue',
        isLoading: false,
      });
    }
  },

  addToQueue: async (data) => {
    set({ isLoading: true, error: null });

    try {
      // Use sync manager for offline-first creation
      const entry = await syncManager.addToQueue(data);
      
      set((state) => ({
        queue: [...state.queue, entry],
        isLoading: false,
      }));

      return entry;
    } catch (error) {
      set({
        error: (error as Error).message || 'Failed to add to queue',
        isLoading: false,
      });
      throw error;
    }
  },

  updateStatus: async (entryId, status) => {
    set({ isLoading: true, error: null });

    try {
      // Update local state immediately (optimistic update)
      set((state) => ({
        queue: state.queue.map((entry) =>
          entry.id === entryId ? { ...entry, status } : entry
        ),
      }));

      // Use sync manager for offline support
      await syncManager.updateQueueStatus(entryId, status);

      // If marking as in_consultation, set as current token
      if (status === 'in_consultation') {
        const entry = get().queue.find((e) => e.id === entryId);
        if (entry) {
          set({ currentToken: entry });
        }
      }

      set({ isLoading: false });
    } catch (error) {
      // Revert optimistic update on error
      get().loadQueue(get().queue[0]?.clinic_id || '');
      
      set({
        error: (error as Error).message || 'Failed to update status',
        isLoading: false,
      });
    }
  },

  removeFromQueue: async (entryId) => {
    set({ isLoading: true, error: null });

    try {
      // Remove from local DB
      await db.queue.delete(entryId);

      // Update state
      set((state) => ({
        queue: state.queue.filter((entry) => entry.id !== entryId),
        isLoading: false,
      }));

      // If online, sync to server
      if (navigator.onLine) {
        try {
          const { queueApi } = await import('@/features/queue/api');
          await queueApi.updateQueueEntry(entryId, { status: 'cancelled' });
        } catch (error) {
          console.error('Server delete failed:', error);
        }
      }
    } catch (error) {
      set({
        error: (error as Error).message || 'Failed to remove from queue',
        isLoading: false,
      });
    }
  },

  setCurrentToken: (entry) => set({ currentToken: entry }),

  clearError: () => set({ error: null }),

  subscribeToQueue: (clinicId, callback) => {
    // Create WebSocket connection for real-time updates
    let ws: WebSocket | null = null;
    
    const connect = () => {
      const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000';
      ws = new WebSocket(`${wsUrl}/api/v1/queue/ws/${clinicId}`);

      ws.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.event === 'QUEUE_UPDATED') {
            // Reload queue when notified
            const updatedQueue = await db.queue
              .where({ clinic_id: clinicId })
              .reverse()
              .sortBy('created_at');
            
            callback(updatedQueue);
          }
        } catch (error) {
          console.error('WebSocket message error:', error);
        }
      };

      ws.onclose = () => {
        // Reconnect after 5 seconds
        setTimeout(connect, 5000);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    };

    connect();

    // Return unsubscribe function
    return () => {
      ws?.close();
    };
  },
}));
