'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, ReactNode } from 'react';

// ------------------------------------------
// Query Client Configuration
// ------------------------------------------
function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Time until data is considered stale (5 minutes)
        staleTime: 5 * 60 * 1000,
        
        // Keep data in cache for 10 minutes
        gcTime: 10 * 60 * 1000,
        
        // Refetch on window focus
        refetchOnWindowFocus: true,
        
        // Refetch when reconnecting
        refetchOnReconnect: true,
        
        // Retry failed requests 3 times
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        
        // Use cached data while fetching fresh data
        placeholderData: (previousData: unknown) => previousData,
      },
      mutations: {
        // Retry failed mutations once
        retry: 1,
      },
    },
  });
}

// ------------------------------------------
// Query Provider Component
// ------------------------------------------
interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  // Create client once to avoid hydration mismatches
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* DevTools only shown in development */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}

// ------------------------------------------
// Query Keys - Centralized for consistency
// ------------------------------------------
export const queryKeys = {
  // Auth
  auth: ['auth'] as const,
  user: (userId: string) => ['auth', 'user', userId] as const,
  clinic: (clinicId: string) => ['auth', 'clinic', clinicId] as const,

  // Patients
  patients: ['patients'] as const,
  patientList: (clinicId: string) => ['patients', 'list', clinicId] as const,
  patient: (patientId: string) => ['patients', 'detail', patientId] as const,
  patientSearch: (mobile: string) => ['patients', 'search', mobile] as const,

  // Queue
  queue: ['queue'] as const,
  queueList: (clinicId: string, status?: string) => 
    ['queue', 'list', clinicId, status] as const,
  queueEntry: (entryId: string) => ['queue', 'entry', entryId] as const,

  // Consultations
  consultations: ['consultations'] as const,
  consultationList: (patientId: string) => 
    ['consultations', 'list', patientId] as const,
  consultation: (id: string) => ['consultations', 'detail', id] as const,

  // Prescriptions
  prescriptions: ['prescriptions'] as const,
  prescriptionList: (patientId: string) => 
    ['prescriptions', 'list', patientId] as const,
};
