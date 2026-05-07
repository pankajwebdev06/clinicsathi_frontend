import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/core/query/query-provider';
import { patientsApi } from '@/features/patients/api';
import { usePatientStore } from '@/store';
import { syncManager } from '@/lib/sync/sync-manager';
import type { PatientCreate, Patient } from '@/types';

// ------------------------------------------
// Patient Query Hooks
// ------------------------------------------

/**
 * Hook to fetch patients list for a clinic
 */
export function usePatients(clinicId: string) {
  const { loadPatients } = usePatientStore();

  return useQuery({
    queryKey: queryKeys.patientList(clinicId),
    queryFn: async () => {
      // First load from local DB
      await loadPatients(clinicId);
      
      // If online, fetch from server
      if (navigator.onLine) {
        const patients = await patientsApi.getPatients(clinicId);
        return patients;
      }
      
      return [];
    },
    enabled: !!clinicId,
    staleTime: 60000, // 1 minute
  });
}

/**
 * Hook to search for a patient by mobile number
 */
export function usePatientSearch(clinicId: string) {
  const { searchPatient, searchResults, isSearching, error, clearSearch } = usePatientStore();

  const search = async (mobileNumber: string) => {
    await searchPatient(clinicId, mobileNumber);
    return searchResults;
  };

  return {
    search,
    results: searchResults,
    isLoading: isSearching,
    error,
    clearSearch,
  };
}

/**
 * Hook to create a new patient with offline support
 */
export function useCreatePatient() {
  const queryClient = useQueryClient();
  const { createPatient } = usePatientStore();

  return useMutation({
    mutationFn: async (data: PatientCreate) => {
      const patient = await createPatient(data);
      return patient;
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch patient list
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.patientList(variables.clinic_id) 
      });
      
      // Set query data for this patient
      queryClient.setQueryData(
        queryKeys.patient(data.id),
        data
      );
    },
  });
}

/**
 * Hook to get a single patient by ID
 */
export function usePatient(patientId: string) {
  return useQuery({
    queryKey: queryKeys.patient(patientId),
    queryFn: async () => {
      // Implementation would fetch from API
      // For now, return from local DB
      const { db } = await import('@/lib/db/schema');
      return await db.patients.get(patientId);
    },
    enabled: !!patientId,
  });
}

/**
 * Hook for patient operations with optimistic updates
 */
export function usePatientOptimistic(clinicId: string) {
  const queryClient = useQueryClient();

  const createPatientOptimistic = useMutation({
    mutationFn: async (newPatient: PatientCreate) => {
      return await syncManager.createPatient(newPatient);
    },
    onMutate: async (newPatient) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ 
        queryKey: queryKeys.patientList(clinicId) 
      });

      // Snapshot previous value
      const previousPatients = queryClient.getQueryData<Patient[]>(
        queryKeys.patientList(clinicId)
      );

      // Optimistically update
      const optimisticPatient: Patient = {
        ...newPatient,
        id: `temp-${Date.now()}`,
        consent_timestamp: new Date().toISOString(),
        is_minor: newPatient.age < 18,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        syncStatus: 'pending',
      };

      queryClient.setQueryData<Patient[]>(
        queryKeys.patientList(clinicId),
        (old) => old ? [...old, optimisticPatient] : [optimisticPatient]
      );

      return { previousPatients };
    },
    onError: (err, newPatient, context) => {
      // Rollback on error
      queryClient.setQueryData(
        queryKeys.patientList(clinicId),
        context?.previousPatients
      );
    },
    onSettled: () => {
      // Refetch after error or success
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.patientList(clinicId) 
      });
    },
  });

  return { createPatientOptimistic };
}
