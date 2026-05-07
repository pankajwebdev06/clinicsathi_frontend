import { apiClient } from "@/core/api/apiClient";

export const authApi = {
  async registerClinic(data: { name: string; doctor_name: string; specialization?: string; city?: string; address?: string; phone?: string; mci_number?: string }) {
    return apiClient("/auth/clinics", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async registerUser(data: { mobile_number: string; email?: string; name: string; role: string; clinic_id: string }) {
    return apiClient("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Combined registration: creates clinic and registers doctor as user (no password needed)
  async registerDoctor(data: {
    mobile_number: string;
    email?: string;
    name: string;
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

    // 2. Register doctor as user (no password - OTP based)
    const user = await this.registerUser({
      mobile_number: data.mobile_number,
      email: data.email,
      name: data.name,
      role: 'doctor',
      clinic_id: clinic.id,
    });

    return {
      user,
      clinic,
    };
  },

  // Send OTP to mobile number
  async sendOTP(data: { mobile_number: string }) {
    return apiClient("/auth/send-otp", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Verify OTP and get token
  async verifyOTP(data: { mobile_number: string; otp_code: string }) {
    return apiClient("/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Legacy endpoint - now sends OTP
  async login(data: { mobile_number: string }) {
    return this.sendOTP(data);
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
