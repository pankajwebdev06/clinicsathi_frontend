import { create } from 'zustand';
import { db } from '@/lib/db/schema';
import { syncManager } from '@/lib/sync/sync-manager';
import type { Patient, PatientCreate, PatientSearchResult } from '@/types';

// ------------------------------------------
// Patient State Types
// ------------------------------------------
interface PatientState {
  // State
  patients: Patient[];
  selectedPatient: Patient | null;
  searchResults: PatientSearchResult | null;
  isLoading: boolean;
  isSearching: boolean;
  error: string | null;

  // Actions
  searchPatient: (clinicId: string, mobileNumber: string) => Promise<void>;
  createPatient: (data: PatientCreate) => Promise<Patient>;
  selectPatient: (patient: Patient | null) => void;
  loadPatients: (clinicId: string) => Promise<void>;
  clearSearch: () => void;
  clearError: () => void;
  
  // Offline helpers
  getOfflinePatients: (clinicId: string) => Promise<Patient[]>;
  syncPendingPatients: () => Promise<void>;
}

// ------------------------------------------
// Patient Store
// ------------------------------------------
export const usePatientStore = create<PatientState>((set, get) => ({
  // Initial State
  patients: [],
  selectedPatient: null,
  searchResults: null,
  isLoading: false,
  isSearching: false,
  error: null,

  // Actions
  searchPatient: async (clinicId, mobileNumber) => {
    set({ isSearching: true, error: null });

    try {
      // First check local database (offline-first)
      const localResults = await db.searchPatientsByMobile(clinicId, mobileNumber);
      
      if (localResults.length > 0) {
        // Found in local DB
        const patient = localResults[0];
        const visits = localResults.length; // Simplified - should count actual consultations
        
        set({
          searchResults: {
            patient,
            visits,
            lastVisit: undefined,
          },
          isSearching: false,
        });
        return;
      }

      // If online, try server
      if (navigator.onLine) {
        try {
          const { patientsApi } = await import('@/features/patients/api');
          const response = await patientsApi.getPatients(clinicId);
          
          // Find matching patient
          const serverPatient = response.find(
            (p: Patient) => p.mobile_number === mobileNumber
          );

          if (serverPatient) {
            // Cache in local DB
            await db.patients.put({ ...serverPatient, syncStatus: 'synced' });

            set({
              searchResults: {
                patient: serverPatient,
                visits: 0, // Should fetch actual visit count
                lastVisit: undefined,
              },
              isSearching: false,
            });
            return;
          }
        } catch (error) {
          console.error('Server search failed:', error);
        }
      }

      // No patient found
      set({
        searchResults: { patient: null, visits: 0 },
        isSearching: false,
      });
    } catch (error) {
      set({
        error: (error as Error).message || 'Search failed',
        isSearching: false,
      });
    }
  },

  createPatient: async (data) => {
    set({ isLoading: true, error: null });

    try {
      // Use sync manager for offline-first creation
      const patient = await syncManager.createPatient(data);
      
      set((state) => ({
        patients: [...state.patients, patient],
        selectedPatient: patient,
        searchResults: {
          patient,
          visits: 0,
        },
        isLoading: false,
      }));

      return patient;
    } catch (error) {
      set({
        error: (error as Error).message || 'Failed to create patient',
        isLoading: false,
      });
      throw error;
    }
  },

  selectPatient: (patient) => set({ selectedPatient: patient }),

  loadPatients: async (clinicId) => {
    set({ isLoading: true, error: null });

    try {
      const patients = await db.patients
        .where({ clinic_id: clinicId })
        .toArray();

      set({ patients, isLoading: false });
    } catch (error) {
      set({
        error: (error as Error).message || 'Failed to load patients',
        isLoading: false,
      });
    }
  },

  clearSearch: () => set({ searchResults: null }),
  
  clearError: () => set({ error: null }),

  // Offline helpers
  getOfflinePatients: async (clinicId) => {
    return await db.patients.where({ clinic_id: clinicId }).toArray();
  },

  syncPendingPatients: async () => {
    await syncManager.startSync();
  },
}));
