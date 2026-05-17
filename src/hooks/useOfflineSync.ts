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
 * - Tracks navigator online/offline transitions
 * - Polls the sync queue for pending count
 * - Exposes a manual `syncNow()` trigger
 * - Auto-starts the sync manager on mount (idempotent)
 *
 * Used by the reception dashboard (the only surface that needs offline mode).
 */
export function useOfflineSync(pollIntervalMs = 5_000): OfflineSyncState & { syncNow: () => Promise<void> } {
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
      /* IndexedDB may not be available — degrade gracefully */
    }
  }, []);

  const syncNow = useCallback(async () => {
    if (!navigator.onLine) return;
    try {
      await syncManager.startSync();
    } catch (err) {
      console.warn('[useOfflineSync] manual sync failed:', err);
    } finally {
      refresh();
    }
  }, [refresh]);

  useEffect(() => {
    // Kick off auto-sync listeners once
    syncManager.startAutoSync();

    const handleOnline = () => { setIsOnline(true); refresh(); };
    const handleOffline = () => { setIsOnline(false); refresh(); };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial + periodic refresh of sync status
    refresh();
    const id = setInterval(refresh, pollIntervalMs);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(id);
    };
  }, [pollIntervalMs, refresh]);

  return { ...state, isOnline, syncNow };
}
