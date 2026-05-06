import { apiClient } from "@/core/api/apiClient";

export const authApi = {
  async registerClinic(data: { name: string; doctor_name: string; specialization?: string; city?: string; address?: string; phone?: string }) {
    return apiClient("/auth/clinics", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async registerUser(data: { mobile_number: string; name: string; password: string; role: string; clinic_id: string }) {
    return apiClient("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async login(data: { mobile_number: string; password: string }) {
    return apiClient("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async getMe() {
    return apiClient("/auth/me", {
      method: "GET",
    });
  },

  async getStaff(clinicId: string) {
    return apiClient(`/auth/staff?clinic_id=${clinicId}`, {
      method: "GET",
    });
  },
};
