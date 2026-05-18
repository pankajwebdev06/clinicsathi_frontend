'use client';
import { useState, useEffect } from 'react';

export function ConnectionDot({ className = '' }: { className?: string }) {
  const [online, setOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);

  return (
    <span
      title={
        online
          ? 'Online — data saves instantly to server'
          : 'Offline — saving locally, syncs automatically on reconnect'
      }
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold border select-none ${
        online
          ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
          : 'bg-red-50 text-red-700 border-red-100'
      } ${className}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
          online ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'
        }`}
      />
      {online ? 'Online' : 'Offline'}
    </span>
  );
}
