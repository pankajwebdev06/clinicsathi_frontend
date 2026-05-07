'use client'

import { useEffect } from 'react'
import { QueryProvider } from '@/core/query/query-provider'
import { ClinicProvider } from '@/core/store/clinic-context'
import { Toaster } from 'sonner'
import { syncManager } from '@/lib/sync/sync-manager'

export default function Providers({ children }: { children: React.ReactNode }) {
  // Initialize sync manager and auto-sync on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      syncManager.startAutoSync()
    }
  }, [])

  return (
    <QueryProvider>
      <ClinicProvider>
        {children}
        {/* Toast notifications */}
        <Toaster 
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            style: {
              fontFamily: 'inherit',
            },
          }}
        />
      </ClinicProvider>
    </QueryProvider>
  )
}
