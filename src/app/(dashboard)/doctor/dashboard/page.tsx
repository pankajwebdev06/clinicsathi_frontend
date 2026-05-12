'use client';

import React, { useState } from 'react';

import { useClinic } from '@/core/store/clinic-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Breadcrumbs } from '@/shared/components/Breadcrumbs';
import { VitalsGrid } from '@/shared/components/VitalsGrid';
import { ClinicSidebar } from '@/shared/components/ClinicSidebar';
import { patientsApi } from '@/features/patients/api';
import { queueApi } from '@/features/queue/api';
import { useEffect } from 'react';
import { ConsultPanel } from '@/features/consultation/ConsultPanel';
import { QueueBoard } from '@/features/queue/QueueBoard';
import { authApi } from '@/features/auth/api';

type Tab = 'queue' | 'summary' | 'settings' | 'profile';

interface Patient {
  token: string;
  name: string;
  age: number;
  gender: string;
  mobile: string;
  status: 'waiting' | 'in_consultation' | 'done';
  isNew: boolean;
  symptoms?: string;
  bp?: string;
  weight?: string;
  temperature?: string;
  pulse?: string;
}

// MOCK_QUEUE removed — using live data from API

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

const TEMPLATES = [
  { id: 't1', name: 'Classic Blue', color: '#1d4ed8' },
  { id: 't2', name: 'Modern Dark', color: '#0f172a' },
  { id: 't3', name: 'Minimal', color: '#374151' },
  { id: 't4', name: 'Emerald', color: '#059669' },
  { id: 't5', name: 'Royal Purple', color: '#7c3aed' },
  { id: 't6', name: 'Warm Saffron', color: '#d97706' },
  { id: 't7', name: 'Slate Pro', color: '#475569' },
  { id: 't8', name: 'Rose Medical', color: '#e11d48' },
  { id: 't9', name: 'Ocean Teal', color: '#0891b2' },
  { id: 't10', name: 'Gold Premium', color: '#b45309' },
];

function formatTime(t: string) {
  if (!t) return '';
  const [h, m] = t.split(':');
  const hour = parseInt(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  return `${hour % 12 || 12}:${m} ${ampm}`;
}

export default function DoctorDashboard() {
  const router = useRouter();
  const { clinic, setClinic } = useClinic();
  const [activeTab, setActiveTab] = useState<Tab>('queue');
  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [focusMode, setFocusMode] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  const [settingsForm, setSettingsForm] = useState(clinic);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  // Authentication check and dynamic clinic fetching
  useEffect(() => {
    const checkAuthAndFetchClinic = async () => {
      const token = localStorage.getItem('auth_token');
      const userInfoStr = localStorage.getItem('user_info');
      
      if (!token || !userInfoStr) {
        router.push('/login');
        return;
      }

      try {
        const userInfo = JSON.parse(userInfoStr);
        // Fetch real clinic data from backend
        const realClinicData = await authApi.getClinic(userInfo.clinic_id);
        
        // Map backend response to frontend ClinicData structure
        const mappedData = {
          id: realClinicData.id,
          clinicName: realClinicData.name,
          doctorName: realClinicData.doctor_name,
          specialization: realClinicData.specialization || 'General Physician',
          degree: 'MBBS', // Backend should ideally provide this, using fallback
          experience: '10',
          city: realClinicData.city || '',
          address: realClinicData.address || '',
          phone: realClinicData.phone || '',
          mciNumber: realClinicData.mci_number || '',
          morningStart: '09:00',
          morningEnd: '13:00',
          eveningStart: '17:00',
          eveningEnd: '20:00',
          offDays: ['Sunday'],
          selectedTemplate: 't1'
        };
        
        setClinic(mappedData);
        setSettingsForm(mappedData);
        setIsAuthChecking(false);
      } catch (err) {
        console.error('Auth or Fetch error:', err);
        router.push('/login');
      }
    };

    checkAuthAndFetchClinic();
  }, []);

  // Staff management state
  const [staffList, setStaffList] = useState<any[]>([]);
  const [newStaffMobile, setNewStaffMobile] = useState('');
  const [newStaffName, setNewStaffName] = useState('');
  const [staffError, setStaffError] = useState('');
  const [staffLoading, setStaffLoading] = useState(false);

  const fetchQueue = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}');
      if (!userInfo.clinic_id) return;

      const [qData, pData] = await Promise.all([
        queueApi.getQueue(userInfo.clinic_id),
        patientsApi.getPatients(userInfo.clinic_id)
      ]);

      const merged = qData.map((q: any) => {
        const p = pData.find((pat: any) => pat.id === q.patient_id) || {};
        return {
          id: q.id,
          patientId: q.patient_id,
          token: q.token_number,
          name: p.name || 'Unknown',
          age: p.age || 0,
          gender: p.gender || '—',
          mobile: p.mobile_number || '—',
          status: q.status,
          symptoms: q.symptoms,
          bp: q.bp,
          weight: q.weight,
          temperature: q.temperature,
          pulse: q.pulse,
          isNew: false
        };
      });

      setQueue(merged);
      if (!selectedPatient && merged.length > 0) {
        const firstWaiting = merged.find((p: any) => p.status === 'waiting' || p.status === 'in_consultation');
        if (firstWaiting) setSelectedPatient(firstWaiting);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching queue:', err);
    }
  };

  const fetchStaff = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}');
      if (!userInfo.clinic_id) return;
      const staff = await authApi.getStaff(userInfo.clinic_id);
      setStaffList(staff);
    } catch (err) {
      console.error('Error fetching staff:', err);
    }
  };

  const addStaff = async () => {
    setStaffError('');
    if (!newStaffMobile || newStaffMobile.length !== 10) { setStaffError('Enter a valid 10-digit mobile number.'); return; }
    if (!newStaffName) { setStaffError('Enter staff name.'); return; }
    setStaffLoading(true);
    try {
      const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}');
      await authApi.registerUser({
        mobile_number: newStaffMobile,
        name: newStaffName,
        role: 'receptionist',
        clinic_id: userInfo.clinic_id,
      });
      setNewStaffMobile('');
      setNewStaffName('');
      await fetchStaff();
    } catch (err: any) {
      setStaffError(err.message || 'Failed to add staff.');
    } finally {
      setStaffLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
    fetchStaff();
    const interval = setInterval(fetchQueue, 5000);
    return () => clearInterval(interval);
  }, []);

  const markDone = async (id: string) => {
    try {
      await queueApi.updateQueueEntry(id, { status: 'completed' });
      await fetchQueue();
      setSelectedPatient(null);
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const skipPatient = async (id: string) => {
    try {
      await queueApi.updateQueueEntry(id, { status: 'skipped' });
      await fetchQueue();
      setSelectedPatient(null);
    } catch (err) {
      alert("Failed to skip patient");
    }
  };

  const cancelPatient = async (id: string) => {
    if (!confirm(`Cancel this patient from queue?`)) return;
    try {
      await queueApi.updateQueueEntry(id, { status: 'cancelled' });
      await fetchQueue();
      setSelectedPatient(null);
    } catch (err) {
      alert("Failed to cancel patient");
    }
  };

  const selectPatient = async (patient: any) => {
    setSelectedPatient(patient);
    if (patient.status === 'waiting') {
       try {
         await queueApi.updateQueueEntry(patient.id, { status: 'in_consultation' });
         fetchQueue(); // Refresh to update status in list
       } catch (err) {
         console.error("Failed to update status to in_consultation");
       }
    }
  };

  const handleExport = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('http://localhost:8000/api/v1/patients/export', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Export failed');
      
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `clinicsathi_records_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Failed to export records");
    }
  };

  const stats = [
    { label: "Today's Patients", value: queue.length.toString(), icon: '👥', color: 'bg-blue-50 text-blue-700' },
    { label: 'In Queue', value: queue.filter(p => p.status === 'waiting').length.toString(), icon: '⏳', color: 'bg-amber-50 text-amber-700' },
    { label: 'Completed', value: queue.filter(p => p.status === 'completed').length.toString(), icon: '✅', color: 'bg-emerald-50 text-emerald-700' },
    { label: 'Avg. Wait Time', value: '12m', icon: '⚡', color: 'bg-purple-50 text-purple-700' },
  ];

  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium">Authenticating...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">

      {/* Sidebar */}
      <ClinicSidebar 
        clinicName={clinic.clinicName}
        subtitle={`${clinic.doctorName} • ${clinic.specialization}`}
        doctorName={clinic.doctorName}
        specialization={clinic.specialization}
        activeId={activeTab}
        focusMode={focusMode}
        onToggleFocus={() => setFocusMode(!focusMode)}
        navItems={[
          { id: 'queue', icon: '🗂️', label: 'Patient Queue', onClick: () => setActiveTab('queue') },
          { id: 'summary', icon: '📊', label: 'Daily Summary', onClick: () => setActiveTab('summary') },
          { id: 'profile', icon: '👤', label: 'Public Profile', onClick: () => setActiveTab('profile') },
          { id: 'settings', icon: '⚙️', label: 'Settings & Staff', onClick: () => setActiveTab('settings') },
        ]}
        footerContent={
          <button 
            onClick={() => {
              localStorage.removeItem('auth_token');
              localStorage.removeItem('user_info');
              router.push('/login');
            }}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-red-900/30 hover:text-red-400 transition-colors"
          >
            <span className="text-lg">🚪</span>
            {!focusMode && <span>Logout</span>}
          </button>
        }
      />

      {/* Main */}
      <main className="flex-1 overflow-y-auto">

        {/* Mobile Top Bar */}
        <div className="md:hidden bg-white border-b border-slate-100 px-5 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
          <div>
            <h2 className="font-bold text-slate-900 text-base leading-tight">{clinic.clinicName}</h2>
            <p className="text-xs text-slate-500">{clinic.doctorName}</p>
          </div>
          <div className="flex gap-2 text-xl">
            <button onClick={() => setActiveTab('settings')} title="Settings">⚙️</button>
          </div>
        </div>

        {/* Page Header with Breadcrumb */}
        <div className="px-5 md:px-8 pt-5 pb-4 border-b border-slate-100 bg-white">
          <Breadcrumbs 
            items={[
              { label: 'Home', href: '/', icon: '🏠' },
              { label: 'Doctor Dashboard', isCurrent: activeTab === 'queue' },
              ...(activeTab !== 'queue' ? [{
                label: activeTab === 'summary' ? 'Daily Summary' : 'Settings & Staff',
                isCurrent: true
              }] : [])
            ]}
          />
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">{clinic.clinicName}</h1>
              <p className="text-slate-500 font-medium mt-0.5">
                {clinic.doctorName} • {clinic.degree} • {clinic.experience} yrs exp.
              </p>
              <p className="text-slate-400 text-sm mt-0.5">
                🕐 {formatTime(clinic.morningStart)}–{formatTime(clinic.morningEnd)} | {formatTime(clinic.eveningStart)}–{formatTime(clinic.eveningEnd)}
                {clinic.offDays.length > 0 && ` • Off: ${clinic.offDays.join(', ')}`}
              </p>
            </div>
            <span className="hidden md:block px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100">● Clinic Open</span>
          </div>
        </div>

        <div className="p-5 md:p-8">



          {/* Tab: Queue */}
          {activeTab === 'queue' && (
            <div className="flex flex-col-reverse md:grid md:grid-cols-5 gap-6">
              {/* Queue List (Now using the modular QueueBoard) */}
              <div className="md:col-span-2">
                <QueueBoard 
                  clinicId={clinic.id} 
                  queue={queue.map(p => ({
                    id: p.id,
                    token_number: p.token,
                    patient_name: p.name,
                    status: p.status,
                    priority: 0
                  }))}
                  onSelect={(entry) => selectPatient(queue.find(q => q.id === entry.id))}
                />
              </div>

              {/* Consultation Panel (Now using the modular ConsultPanel) */}
              <div className="md:col-span-3">
                {selectedPatient ? (
                  <ConsultPanel 
                    patientId={selectedPatient.patientId} 
                    queueId={selectedPatient.id} 
                    onActionComplete={() => selectPatient(null)} 
                  />
                ) : (
                  <div className="bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center justify-center p-16 text-center h-full">
                    <p className="text-5xl mb-4">🩺</p>
                    <p className="font-bold text-slate-700 text-lg">Select a patient from the queue</p>
                    <p className="text-slate-400 text-sm mt-1">Start consultation to see details and history.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab: Public Profile */}
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-2">👤 Public Profile Settings</h3>
                <p className="text-slate-500 text-sm mb-6">Customize your public profile that patients will see. Upload photos and add SEO details for better visibility.</p>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  {/* Doctor Photo Upload */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-600">Doctor Photo</label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const formData = new FormData();
                            formData.append('file', file);
                            try {
                              const token = localStorage.getItem('auth_token');
                              const res = await fetch('http://localhost:8000/api/v1/auth/upload-image', {
                                method: 'POST',
                                headers: { Authorization: `Bearer ${token}` },
                                body: formData
                              });
                              const data = await res.json();
                              setClinic({ ...clinic, doctorPhoto: data.url });
                            } catch (err) {
                              alert('Upload failed');
                            }
                          }
                        }}
                        className="hidden"
                        id="doctor-photo-upload"
                      />
                      <label
                        htmlFor="doctor-photo-upload"
                        className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all"
                      >
                        {clinic.doctorPhoto ? (
                          <img src={clinic.doctorPhoto} alt="Doctor" className="w-full h-full object-cover rounded-2xl" />
                        ) : (
                          <div className="text-center">
                            <span className="text-4xl mb-2 block">👨‍⚕️</span>
                            <p className="text-sm text-slate-600 font-medium">Upload Doctor Photo</p>
                            <p className="text-xs text-slate-400 mt-1">JPG, PNG, WebP (max 5MB)</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Clinic Photo Upload */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-600">Clinic Photo</label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const formData = new FormData();
                            formData.append('file', file);
                            try {
                              const token = localStorage.getItem('auth_token');
                              const res = await fetch('http://localhost:8000/api/v1/auth/upload-image', {
                                method: 'POST',
                                headers: { Authorization: `Bearer ${token}` },
                                body: formData
                              });
                              const data = await res.json();
                              setClinic({ ...clinic, clinicPhoto: data.url });
                            } catch (err) {
                              alert('Upload failed');
                            }
                          }
                        }}
                        className="hidden"
                        id="clinic-photo-upload"
                      />
                      <label
                        htmlFor="clinic-photo-upload"
                        className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all"
                      >
                        {clinic.clinicPhoto ? (
                          <img src={clinic.clinicPhoto} alt="Clinic" className="w-full h-full object-cover rounded-2xl" />
                        ) : (
                          <div className="text-center">
                            <span className="text-4xl mb-2 block">🏥</span>
                            <p className="text-sm text-slate-600 font-medium">Upload Clinic Photo</p>
                            <p className="text-xs text-slate-400 mt-1">JPG, PNG, WebP (max 5MB)</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
                </div>

                {/* Profile Details */}
                <div className="grid md:grid-cols-2 gap-5 mb-6">
                  {[
                    { label: 'Degree(s)', key: 'degree', placeholder: 'MBBS, MD, MS' },
                    { label: 'Experience (years)', key: 'experience', placeholder: '12' },
                    { label: 'Consultation Fee (₹)', key: 'consultationFee', placeholder: '500' },
                    { label: 'Services (comma separated)', key: 'services', placeholder: 'General Checkup, Vaccination, Lab Tests' },
                  ].map(({ label, key, placeholder }) => (
                    <div key={key} className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-600">{label}</label>
                      <input
                        value={settingsForm[key as keyof typeof settingsForm] as string || ''}
                        onChange={e => setSettingsForm(f => ({ ...f, [key]: e.target.value }))}
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900"
                        placeholder={placeholder}
                      />
                    </div>
                  ))}
                </div>

                {/* About Doctor */}
                <div className="mb-6">
                  <label className="text-sm font-semibold text-slate-600 mb-2 block">About Doctor</label>
                  <textarea
                    rows={4}
                    value={settingsForm.aboutDoctor || ''}
                    onChange={e => setSettingsForm(f => ({ ...f, aboutDoctor: e.target.value }))}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                    placeholder="Write a brief description about yourself, your qualifications, and your approach to patient care..."
                  />
                </div>

                {/* SEO Settings */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100 mb-6">
                  <h4 className="text-lg font-bold text-slate-900 mb-4">🔍 SEO Settings</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-slate-600 mb-2 block">Meta Title (SEO)</label>
                      <input
                        value={settingsForm.metaTitle || ''}
                        onChange={e => setSettingsForm(f => ({ ...f, metaTitle: e.target.value }))}
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900"
                        placeholder="Dr. Rahul Kumar - Best Cardiologist in Delhi | ClinicSathi"
                        maxLength={60}
                      />
                      <p className="text-xs text-slate-500 mt-1">Recommended: 50-60 characters</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-slate-600 mb-2 block">Meta Description (SEO)</label>
                      <textarea
                        rows={3}
                        value={settingsForm.metaDescription || ''}
                        onChange={e => setSettingsForm(f => ({ ...f, metaDescription: e.target.value }))}
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                        placeholder="Dr. Rahul Kumar is a renowned cardiologist with 15+ years of experience. Specialized in heart care, cardiac rehabilitation, and preventive cardiology. Book appointment at..."
                        maxLength={160}
                      />
                      <p className="text-xs text-slate-500 mt-1">Recommended: 150-160 characters</p>
                    </div>
                  </div>
                </div>

                {/* Preview Link */}
                <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-emerald-800">🌐 Your Public Profile</p>
                      <p className="text-xs text-emerald-600 mt-1">View how patients will see your profile</p>
                    </div>
                    <a
                      href={`/doctor/${clinic.slug || 'your-slug'}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors"
                    >
                      Preview Profile
                    </a>
                  </div>
                </div>

                <button
                  onClick={async () => {
                    try {
                      const token = localStorage.getItem('auth_token');
                      const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}');
                      const res = await fetch(`http://localhost:8000/api/v1/auth/clinics/${userInfo.clinic_id}`, {
                        method: 'PUT',
                        headers: {
                          'Content-Type': 'application/json',
                          Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify(settingsForm)
                      });
                      if (res.ok) {
                        setClinic({ ...clinic, ...settingsForm });
                        alert('Profile updated successfully!');
                      } else {
                        alert('Failed to update profile');
                      }
                    } catch (err) {
                      alert('Error updating profile');
                    }
                  }}
                  className="px-8 py-3.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors active:scale-[0.98] shadow-md"
                >
                  💾 Save Profile Changes
                </button>
              </div>
            </div>
          )}

          {/* Tab: Daily Summary */}
          {activeTab === 'summary' && (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 animate-in fade-in duration-300">
              <h3 className="text-xl font-bold text-slate-900 mb-6">📊 Daily Summary — {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</h3>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {[
                  [queue.length.toString(), 'Total Patients Seen', '👥'],
                  [queue.filter(p => !p.isNew).length.toString(), 'Regular Patients', '🔁'],
                  [queue.filter(p => p.isNew).length.toString(), 'New Registrations', '🆕'],
                ].map(([val, label, icon]) => (
                  <div key={label} className="bg-slate-50 rounded-2xl p-6 text-center">
                    <div className="text-3xl mb-2">{icon}</div>
                    <div className="text-4xl font-extrabold text-slate-900">{val}</div>
                    <div className="text-slate-500 text-sm mt-1 font-medium">{label}</div>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <h4 className="font-bold text-slate-700 mb-3">All Patients Today</h4>
                {queue.map(p => (
                  <div key={p.token} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-700 w-14">{p.token}</span>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">{p.name}</p>
                        <p className="text-slate-400 text-xs">{p.age} yrs • {p.gender}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      p.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                      p.status === 'in_consultation' ? 'bg-blue-100 text-blue-700' :
                      p.status === 'skipped' ? 'bg-orange-100 text-orange-700' :
                      p.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                      {p.status === 'completed' ? 'Done' : p.status === 'in_consultation' ? 'In Room' : p.status === 'skipped' ? 'Skipped' : p.status === 'cancelled' ? 'Cancelled' : 'Waiting'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab: Settings */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-6">⚙️ Clinic Settings</h3>
                <div className="grid md:grid-cols-2 gap-5">
                  {[
                    { label: 'Doctor Name', key: 'doctorName', placeholder: 'Dr. Name' },
                    { label: 'Degree(s)', key: 'degree', placeholder: 'MBBS, MD' },
                    { label: 'Specialization', key: 'specialization', placeholder: '' },
                    { label: 'Experience (years)', key: 'experience', placeholder: '12' },
                    { label: 'Clinic Name', key: 'clinicName', placeholder: 'Clinic name' },
                    { label: 'City', key: 'city', placeholder: 'City' },
                    { label: 'Contact Number', key: 'phone', placeholder: '10-digit' },
                    { label: 'MCI / NMC Reg. No.', key: 'mciNumber', placeholder: 'e.g. MH-12345' },
                  ].map(({ label, key, placeholder }) => (
                    <div key={key} className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-600">{label}</label>
                      <input
                        value={settingsForm[key as keyof typeof settingsForm] as string}
                        onChange={e => setSettingsForm(f => ({ ...f, [key]: e.target.value }))}
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900"
                        placeholder={placeholder}
                      />
                    </div>
                  ))}
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-sm font-semibold text-slate-600">Full Address</label>
                    <textarea rows={2} value={settingsForm.address}
                      onChange={e => setSettingsForm(f => ({ ...f, address: e.target.value }))}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none" />
                  </div>
                </div>

                {/* Timings */}
                <div className="mt-6 grid md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <p className="text-sm font-bold text-slate-600 mb-3">🌅 Morning Session</p>
                    <div className="grid grid-cols-2 gap-3">
                      <input type="time" value={settingsForm.morningStart} onChange={e => setSettingsForm(f => ({ ...f, morningStart: e.target.value }))} className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-semibold" />
                      <input type="time" value={settingsForm.morningEnd} onChange={e => setSettingsForm(f => ({ ...f, morningEnd: e.target.value }))} className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-semibold" />
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <p className="text-sm font-bold text-slate-600 mb-3">🌆 Evening Session</p>
                    <div className="grid grid-cols-2 gap-3">
                      <input type="time" value={settingsForm.eveningStart} onChange={e => setSettingsForm(f => ({ ...f, eveningStart: e.target.value }))} className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-semibold" />
                      <input type="time" value={settingsForm.eveningEnd} onChange={e => setSettingsForm(f => ({ ...f, eveningEnd: e.target.value }))} className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-semibold" />
                    </div>
                  </div>
                </div>

                {/* Off Days */}
                <div className="mt-5">
                  <p className="text-sm font-bold text-slate-600 mb-3">🚫 Off Days</p>
                  <div className="flex flex-wrap gap-2">
                    {DAYS.map(day => (
                      <button key={day} type="button"
                        onClick={() => setSettingsForm(f => ({
                          ...f,
                          offDays: f.offDays.includes(day) ? f.offDays.filter(d => d !== day) : [...f.offDays, day]
                        }))}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${settingsForm.offDays.includes(day) ? 'bg-red-100 text-red-700 border-2 border-red-200' : 'bg-slate-100 text-slate-600 border-2 border-transparent'}`}>
                        {day.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>

                <button onClick={() => setClinic(settingsForm)}
                  className="mt-8 px-8 py-3.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors active:scale-[0.98] shadow-md">
                  💾 Save All Changes
                </button>
              </div>

              {/* Data Export Section */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-2">📥 Data Export</h3>
                <p className="text-slate-500 text-sm mb-4">Download all your clinic's patient records in JSON format. This backup can be converted to CSV or PDF later.</p>
                <button onClick={handleExport} className="px-6 py-3 border-2 border-slate-200 hover:border-blue-500 text-slate-700 hover:text-blue-600 font-bold rounded-xl transition-all active:scale-[0.98] flex items-center gap-2">
                  <span className="text-xl">⬇️</span> Export Patient Records
                </button>
              </div>

              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-1">🖨️ Prescription Template</h3>
                <p className="text-slate-500 text-sm mb-6">Select the default template. Reception will use this layout when printing prescriptions.</p>
                
                <div className="flex flex-col xl:flex-row gap-8">
                  {/* Left: Template Grid */}
                  <div className="flex-1">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {TEMPLATES.map(t => (
                        <button key={t.id}
                          onClick={() => { setClinic({ ...clinic, selectedTemplate: t.id }); }}
                          className={`p-4 rounded-2xl border-2 text-left transition-all ${
                            clinic.selectedTemplate === t.id
                              ? 'border-blue-500 bg-blue-50 shadow-md'
                              : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                          }`}>
                          <div className="w-8 h-8 rounded-lg mb-2" style={{ background: t.color }}></div>
                          <p className={`text-xs font-bold ${ clinic.selectedTemplate === t.id ? 'text-blue-700' : 'text-slate-700'}`}>{t.name}</p>
                          {clinic.selectedTemplate === t.id && <p className="text-[10px] text-blue-500 font-semibold mt-0.5">✓ Active</p>}
                        </button>
                      ))}
                    </div>
                    <p className="mt-4 text-xs text-slate-400">Template is saved automatically when selected. Reception will always use this template.</p>
                  </div>
                  
                  {/* Right: Live Preview */}
                  <div className="w-full xl:w-[400px] flex-shrink-0">
                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                       <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Live Preview</p>
                       <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-300" 
                            style={{ borderTop: `8px solid ${TEMPLATES.find(t => t.id === clinic.selectedTemplate)?.color || '#1d4ed8'}` }}>
                          <div className="p-5 border-b border-slate-100 flex justify-between items-start">
                             <div>
                               <h4 className="font-black text-lg leading-tight transition-colors duration-300" style={{ color: TEMPLATES.find(t => t.id === clinic.selectedTemplate)?.color || '#1d4ed8' }}>
                                  {clinic.clinicName || 'Clinic Name'}
                               </h4>
                               <p className="text-xs text-slate-600 font-bold mt-1">{clinic.doctorName || 'Dr. Name'} <span className="text-slate-400 font-normal">| {clinic.degree || 'Degree'}</span></p>
                               <p className="text-[10px] text-slate-400 mt-0.5">{clinic.specialization || 'Specialization'}</p>
                             </div>
                             <div className="text-right">
                               <p className="text-[10px] text-slate-500 font-medium">Mob: {clinic.phone || '+91 0000000000'}</p>
                             </div>
                          </div>
                          <div className="p-5 flex gap-4 min-h-[180px]">
                             <div className="w-1/3 border-r border-slate-100 pr-4">
                                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-3">Vitals</div>
                                <div className="h-1.5 w-full bg-slate-100 rounded-full mb-2"></div>
                                <div className="h-1.5 w-full bg-slate-100 rounded-full mb-2"></div>
                                <div className="h-1.5 w-3/4 bg-slate-100 rounded-full mb-4"></div>
                                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-3">Symptoms</div>
                                <div className="h-1.5 w-full bg-slate-100 rounded-full mb-2"></div>
                             </div>
                             <div className="flex-1 pl-2">
                                <div className="text-3xl font-serif mb-4 transition-colors duration-300" style={{ color: TEMPLATES.find(t => t.id === clinic.selectedTemplate)?.color || '#1d4ed8' }}>Rx</div>
                                <div className="h-2 w-full bg-slate-100 rounded-full mb-3"></div>
                                <div className="h-2 w-5/6 bg-slate-100 rounded-full mb-3"></div>
                                <div className="h-2 w-1/2 bg-slate-100 rounded-full mb-6"></div>
                                <div className="h-2 w-full bg-slate-100 rounded-full mb-3"></div>
                                <div className="h-2 w-2/3 bg-slate-100 rounded-full mb-3"></div>
                             </div>
                          </div>
                          <div className="p-3 border-t border-slate-100 bg-slate-50 text-center">
                             <p className="text-[9px] text-slate-400">{clinic.address || 'Clinic full address will appear here on the printed prescription'}</p>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Staff Management */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-2">👥 Staff Management</h3>
                <p className="text-slate-500 text-sm mb-6">Add reception staff by mobile number. They can log in immediately.</p>

                {staffError && (
                  <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">{staffError}</div>
                )}

                <div className="grid md:grid-cols-2 gap-3 mb-4">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm border-r border-slate-200 pr-3">+91</span>
                    <input type="tel" maxLength={10} value={newStaffMobile}
                      onChange={e => setNewStaffMobile(e.target.value.replace(/\D/g, ''))}
                      placeholder="Mobile number"
                      className="w-full pl-14 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none tracking-widest text-sm" />
                  </div>
                  <input type="text" value={newStaffName}
                    onChange={e => setNewStaffName(e.target.value)}
                    placeholder="Full name"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm" />
                </div>
                <button onClick={addStaff} disabled={staffLoading}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl font-bold transition-all active:scale-[0.98] text-sm mb-6">
                  {staffLoading ? 'Adding...' : '+ Add Receptionist'}
                </button>

                <div className="space-y-3">
                  {staffList.length === 0 ? (
                    <p className="text-slate-400 text-sm text-center py-6">No staff added yet.</p>
                  ) : staffList.map((s: any, i: number) => (
                    <div key={s.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">R{i + 1}</div>
                        <div>
                          <p className="font-semibold text-slate-800 text-sm">{s.name}</p>
                          <p className="text-xs text-slate-500">+91 {s.mobile_number}</p>
                          <p className={`text-xs font-medium mt-0.5 ${s.is_active ? 'text-emerald-600' : 'text-red-500'}`}>
                            {s.is_active ? '● Active' : '● Inactive'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
