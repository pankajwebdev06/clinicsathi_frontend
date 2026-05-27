import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Clinic, AuthResponse, LoginCredentials } from '@/types';
import { authApi } from '@/features/auth/api';

// ------------------------------------------
// Auth State Types
// ------------------------------------------
interface AuthState {
  // State
  user: User | null;
  clinic: Clinic | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  registerDoctor: (data: {
    mobile_number: string;
    name: string;
    specialization: string;
    clinic_name: string;
    city: string;
    address: string;
  }) => Promise<void>;
  clearError: () => void;
  setClinic: (clinic: Clinic) => void;
}

// ------------------------------------------
// Auth Store
// ------------------------------------------
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial State
      user: null,
      clinic: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        
        try {
          const response: AuthResponse = await authApi.login(credentials);
          
          // Store token in localStorage for API calls
          if (typeof window !== 'undefined') {
            localStorage.setItem('auth_token', response.access_token);
            localStorage.setItem('user_info', JSON.stringify(response.user));
          }

          set({
            user: response.user,
            clinic: response.clinic || null,
            token: response.access_token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: (error as Error).message || 'Login failed',
            isLoading: false,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      logout: () => {
        // Clear localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_info');
          localStorage.removeItem('doctorkadost_clinic');
        }

        set({
          user: null,
          clinic: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      registerDoctor: async (data) => {
        set({ isLoading: true, error: null });

        try {
          const response = await authApi.registerDoctor(data);
          
          if (typeof window !== 'undefined') {
            localStorage.setItem('user_info', JSON.stringify(response.user));
          }

          set({
            user: response.user,
            clinic: response.clinic,
            isLoading: false,
            isAuthenticated: false, // Must verify OTP to be fully authenticated
          });
        } catch (error) {
          set({
            error: (error as Error).message || 'Registration failed',
            isLoading: false,
          });
          throw error;
        }
      },

      clearError: () => set({ error: null }),

      setClinic: (clinic) => set({ clinic }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        clinic: state.clinic, 
        token: state.token,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);
