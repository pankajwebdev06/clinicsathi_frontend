'use client';
import { useEffect, useState, useCallback } from 'react';
import { syncManager } from '@/lib/sync/sync-manager';

interface OfflineSyncState {
  isOnline: boolean;
  isSyncing: boolean;
  pendingCount: number;
  lastSync: Date | null;
}

/**
 * Reception-side offline-sync hook.
 *
 * Event-driven — NO polling. Refreshes only when:
 *   - `navigator` fires `online` / `offline`
 *   - SyncManager notifies (sync started, finished, or new item queued)
 *
 * This keeps the banner accurate without burning a timer in the background.
 */
export function useOfflineSync(): OfflineSyncState & { syncNow: () => Promise<void> } {
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [state, setState] = useState<OfflineSyncState>({
    isOnline: true,
    isSyncing: false,
    pendingCount: 0,
    lastSync: null,
  });

  const refresh = useCallback(async () => {
    try {
      const status = await syncManager.getSyncStatus();
      setState({
        isOnline: status.isOnline,
        isSyncing: status.isSyncing,
        pendingCount: status.pendingCount,
        lastSync: status.lastSync,
      });
    } catch {
      /* IndexedDB unavailable — degrade gracefully */
    }
  }, []);

  const syncNow = useCallback(async () => {
    if (!navigator.onLine) return;
    try {
      await syncManager.startSync();
    } catch (err) {
      console.warn('[useOfflineSync] manual sync failed:', err);
    }
    // SyncManager notify() fires on its own, but call refresh explicitly so
    // we don't depend on the subscriber ordering.
    refresh();
  }, [refresh]);

  useEffect(() => {
    syncManager.startAutoSync();

    const handleOnline = () => { setIsOnline(true); refresh(); };
    const handleOffline = () => { setIsOnline(false); refresh(); };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Subscribe to SyncManager state changes — fires when items are queued
    // or a sync run starts / completes.
    const unsubscribe = syncManager.onChange(refresh);

    // One initial read so the banner reflects current state on mount
    refresh();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      unsubscribe();
    };
  }, [refresh]);

  return { ...state, isOnline, syncNow };
}
