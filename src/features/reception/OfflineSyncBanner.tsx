'use client';
import { useOfflineSync } from '@/hooks/useOfflineSync';

/**
 * Sticky banner shown in the reception dashboard.
 * - Red when offline (data saving locally, will sync on reconnect)
 * - Amber when online with pending sync items (sync in progress)
 * - Hidden when online with no pending items
 */
export function OfflineSyncBanner() {
  const { isOnline, isSyncing, pendingCount, lastSync, syncNow } = useOfflineSync();

  // Online and nothing pending — don't clutter the UI
  if (isOnline && pendingCount === 0 && !isSyncing) return null;

  const offlineMode = !isOnline;
  const bg = offlineMode ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200';
  const dot = offlineMode ? 'bg-red-500' : 'bg-amber-500';
  const textColor = offlineMode ? 'text-red-800' : 'text-amber-800';

  return (
    <div className={`${bg} border rounded-2xl p-3 md:p-4 mb-4 flex items-center gap-3 print:hidden`}>
      <span className={`w-2.5 h-2.5 rounded-full ${dot} animate-pulse flex-shrink-0`} />
      <div className="flex-1 min-w-0">
        {offlineMode ? (
          <>
            <p className={`text-sm font-bold ${textColor}`}>You are offline</p>
            <p className="text-xs text-red-600 mt-0.5">
              Patient registrations and tokens are saved locally — they will sync automatically when the internet returns.
              {pendingCount > 0 && ` (${pendingCount} pending)`}
            </p>
          </>
        ) : (
          <>
            <p className={`text-sm font-bold ${textColor}`}>
              {isSyncing ? 'Syncing offline records…' : `${pendingCount} record${pendingCount === 1 ? '' : 's'} waiting to sync`}
            </p>
            <p className="text-xs text-amber-700 mt-0.5">
              {lastSync ? `Last synced ${formatRelative(lastSync)}` : 'Will retry automatically'}
            </p>
          </>
        )}
      </div>
      {isOnline && pendingCount > 0 && !isSyncing && (
        <button
          onClick={syncNow}
          className="flex-shrink-0 px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg min-h-[36px] active:scale-95 transition-transform"
        >
          Sync Now
        </button>
      )}
    </div>
  );
}

function formatRelative(d: Date | string): string {
  const date = typeof d === 'string' ? new Date(d) : d;
  const sec = Math.round((Date.now() - date.getTime()) / 1000);
  if (sec < 60) return 'just now';
  if (sec < 3600) return `${Math.round(sec / 60)}m ago`;
  if (sec < 86400) return `${Math.round(sec / 3600)}h ago`;
  return date.toLocaleDateString('en-IN');
}
