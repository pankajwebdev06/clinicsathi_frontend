import { apiClient } from "@/core/api/apiClient";

export const authApi = {
  async registerClinic(data: { name: string; doctor_name: string; specialization?: string; city?: string; address?: string; phone?: string; mci_number?: string }) {
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

  // Combined registration: creates clinic, registers doctor as user, and logs them in
  async registerDoctor(data: {
    mobile_number: string;
    name: string;
    password: string;
    specialization: string;
    clinic_name: string;
    city: string;
    address: string;
  }) {
    // 1. Register clinic
    const clinic = await this.registerClinic({
      name: data.clinic_name,
      doctor_name: data.name,
      specialization: data.specialization,
      city: data.city,
      address: data.address,
    });

    // 2. Register doctor as user
    const user = await this.registerUser({
      mobile_number: data.mobile_number,
      name: data.name,
      password: data.password,
      role: 'doctor',
      clinic_id: clinic.id,
    });

    // 3. Login to get access token
    const loginResponse = await this.login({
      mobile_number: data.mobile_number,
      password: data.password,
    });

    return {
      access_token: loginResponse.access_token,
      user: loginResponse.user,
      clinic: clinic,
    };
  },

  async login(data: { mobile_number: string; password: string }) {
    return apiClient("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async getClinic(clinicId: string) {
    return apiClient(`/auth/clinics/${clinicId}`, {
      method: "GET",
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
