'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface TemplateConfig {
  primaryColor: string;
  bgColor: string;
  fontFamily: 'serif' | 'sans';
  borderStyle: 'none' | 'top' | 'full';
  letterheadUrl?: string;       // doctor's clinic logo shown in header
  referenceImageUrl?: string;   // uploaded prescription image for visual reference only
  header: {
    showClinicName: boolean;
    showDoctorName: boolean;
    showDegree: boolean;
    showSpecialization: boolean;
    showMCI: boolean;
    showPhone: boolean;
    showAddress: boolean;
    showTimings: boolean;
    customLine: string;
  };
  footer: {
    customText: string;
    showSignature: boolean;
    followUpText: string;
    showPoweredBy: boolean;
  };
}

export const DEFAULT_TEMPLATE_CONFIG: TemplateConfig = {
  primaryColor: '#1e40af',
  bgColor: '#ffffff',
  fontFamily: 'serif',
  borderStyle: 'top',
  header: {
    showClinicName: true,
    showDoctorName: true,
    showDegree: true,
    showSpecialization: true,
    showMCI: true,
    showPhone: true,
    showAddress: true,
    showTimings: true,
    customLine: '',
  },
  footer: {
    customText: '',
    showSignature: true,
    followUpText: 'Follow-up as advised',
    showPoweredBy: true,
  },
};

export interface ClinicData {
  id: string;
  doctorName: string;
  degree: string;
  specialization: string;
  experience: string;
  clinicName: string;
  city: string;
  address: string;
  phone: string;
  morningStart: string;
  morningEnd: string;
  eveningStart: string;
  eveningEnd: string;
  offDays: string[];
  selectedTemplate: string;
  templateConfig?: TemplateConfig;
  mciNumber?: string;
  slug?: string;
  doctorPhoto?: string;
  clinicPhoto?: string;
  aboutDoctor?: string;
  metaTitle?: string;
  metaDescription?: string;
  consultationFee?: string;
  services?: string;
}

const DEFAULT_CLINIC: ClinicData = {
  id: 'default-clinic',
  doctorName: 'Dr. Anil Mehra',
  degree: 'MBBS, MD',
  specialization: 'General Physician',
  experience: '12',
  clinicName: 'Mehra Health Clinic',
  city: 'New Delhi',
  address: 'Shop No. 12, Sector 14 Market, New Delhi – 110001',
  phone: '9876543210',
  morningStart: '09:00',
  morningEnd: '13:00',
  eveningStart: '17:00',
  eveningEnd: '20:00',
  offDays: ['Sunday'],
  selectedTemplate: 't1',
  mciNumber: 'MH-12345',
};

interface ClinicContextType {
  clinic: ClinicData;
  setClinic: (data: ClinicData) => void;
}

const ClinicContext = createContext<ClinicContextType>({
  clinic: DEFAULT_CLINIC,
  setClinic: () => {},
});

export function ClinicProvider({ children }: { children: ReactNode }) {
  const [clinic, setClinicState] = useState<ClinicData>(DEFAULT_CLINIC);

  useEffect(() => {
    const saved = localStorage.getItem('clinicsathi_clinic');
    if (saved) {
      try { setClinicState(JSON.parse(saved)); } catch {}
    }
  }, []);

  const setClinic = (data: ClinicData) => {
    setClinicState(data);
    localStorage.setItem('clinicsathi_clinic', JSON.stringify(data));
  };

  return (
    <ClinicContext.Provider value={{ clinic, setClinic }}>
      {children}
    </ClinicContext.Provider>
  );
}

export const useClinic = () => useContext(ClinicContext);
