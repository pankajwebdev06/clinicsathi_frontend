import { apiClient } from "@/core/api/apiClient";

export const consultationApi = {
  // Create a new consultation record
  async createConsultation(data: {
    clinic_id: string;
    patient_id: string;
    doctor_id: string;
    chief_complaints?: string;
    diagnosis?: string;
    doctor_notes?: string;
  }) {
    return apiClient("/consultations/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Get patient's past consultations
  async getPatientHistory(patientId: string) {
    return apiClient(`/consultations/patient/${patientId}`, {
      method: "GET",
    });
  },

  // Update existing consultation
  async updateConsultation(consultationId: string, data: {
    chief_complaints?: string;
    diagnosis?: string;
    doctor_notes?: string;
  }) {
    return apiClient(`/consultations/${consultationId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },
};
