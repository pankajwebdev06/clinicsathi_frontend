'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/features/auth/api';
import { useClinic } from '@/core/store/clinic-context';
import { Breadcrumbs } from '@/shared/components/Breadcrumbs';
import { VitalsGrid } from '@/shared/components/VitalsGrid';
import { ClinicSidebar } from '@/shared/components/ClinicSidebar';
import { patientsApi } from '@/features/patients/api';
import { queueApi } from '@/features/queue/api';
import { NetworkError } from '@/core/api/apiClient';
import { DocumentUpload } from '@/features/reception/DocumentUpload';
import { ConnectionDot } from '@/features/reception/ConnectionDot';
import { useQueueSocket } from '@/hooks/useQueueSocket';
import { syncManager } from '@/lib/sync/sync-manager';
import { db } from '@/lib/db/schema';
import Link from 'next/link';

type FlowState = 'search' | 'loading' | 'history' | 'new_patient' | 'vitals' | 'token';

interface PatientVitals {
  bp: string; weight: string; temperature: string; pulse: string;
}

// Consistent status badge helper
function statusBadge(status: string) {
  const map: Record<string, string> = {
    completed:       'bg-emerald-100 text-emerald-700',
    in_consultation: 'bg-blue-100 text-blue-700',
    cancelled:       'bg-red-100 text-red-700',
    skipped:         'bg-orange-100 text-orange-700',
    waiting:         'bg-amber-100 text-amber-700',
  };
  return map[status] ?? 'bg-slate-100 text-slate-600';
}

export default function ReceptionDashboard() {
  const router = useRouter();
  const { clinic, setClinic } = useClinic();
  const [mobileNumber, setMobileNumber] = useState('');
  const [flowState, setFlowState] = useState<FlowState>('search');
  const [patientData, setPatientData] = useState({ id: '', name: '', age: '', gender: '', symptoms: '' });
  const [vitals, setVitals] = useState<PatientVitals>({ bp: '', weight: '', temperature: '', pulse: '' });
  const [token, setToken] = useState('');
  const [queue, setQueue] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [patientsCache, setPatientsCache] = useState<Record<string, any>>({});
  const [error, setError] = useState('');
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [consentGiven, setConsentGiven] = useState(false);

  const { isConnected } = useQueueSocket(clinic?.id, () => {
    loadQueue();
  });

  // Authentication check and dynamic clinic fetching
  useEffect(() => {
    const checkAuthAndFetchClinic = async () => {
      const token = localStorage.getItem('auth_token');
      const userInfoStr = localStorage.getItem('user_info');
      
      if (!token || !userInfoStr) {
        router.replace('/login');
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
          degree: 'MBBS',
          experience: '10',
          city: realClinicData.city || '',
          address: realClinicData.address || '',
          phone: realClinicData.phone || '',
          morningStart: '09:00',
          morningEnd: '13:00',
          eveningStart: '17:00',
          eveningEnd: '20:00',
          offDays: ['Sunday'],
          selectedTemplate: 't1'
        };
        
        setClinic(mappedData);
        setIsAuthChecking(false);
      } catch (err) {
        console.error('Auth or Fetch error:', err);
        router.push('/login');
      }
    };

    checkAuthAndFetchClinic();
  }, []);

  const [editingPatientId, setEditingPatientId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', age: '', gender: '', mobile_number: '' });
  const [calledPatient, setCalledPatient] = useState<{token: string, name: string} | null>(null);
  const prevQueueRef = React.useRef<any[]>([]);

  const playRing = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const playBeep = (freq: number, time: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        gain.gain.setValueAtTime(0.1, time);
        osc.frequency.value = freq;
        osc.start(time);
        osc.stop(time + duration);
      };
      playBeep(880, ctx.currentTime, 0.1);
      playBeep(1100, ctx.currentTime + 0.15, 0.3);
    } catch(e) { console.error("Audio failed", e) }
  };

  const loadQueue = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}');
      if (!userInfo.clinic_id) return;
      
      const qData = await queueApi.getQueue(userInfo.clinic_id);
      
      const missingPatientIds = qData
        .map((q: any) => q.patient_id)
        .filter((id: string) => !patientsCache[id]);
        
      let currentPatientsCache = { ...patientsCache };
      let currentPatientsList = patients;
      
      if (missingPatientIds.length > 0 || Object.keys(currentPatientsCache).length === 0) {
        const pData = await patientsApi.getPatients(userInfo.clinic_id);
        const newCache: Record<string, any> = {};
        pData.forEach((p: any) => { newCache[p.id] = p; });
        setPatientsCache(newCache);
        setPatients(pData);
        currentPatientsCache = newCache;
        currentPatientsList = pData;
      }
      
      const newInConsultation = qData.find((q: any) => q.status === 'in_consultation');
      if (newInConsultation) {
        const prev = prevQueueRef.current.find(q => q.id === newInConsultation.id);
        if (!prev || prev.status !== 'in_consultation') {
          const p = currentPatientsCache[newInConsultation.patient_id];
          setCalledPatient({ token: newInConsultation.token_number, name: p?.name || 'Unknown' });
          playRing();
        }
      }
      prevQueueRef.current = qData;
      setQueue(qData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadQueue();
    const interval = setInterval(loadQueue, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (mobileNumber.length === 10 && flowState === 'search') {
      const searchPatient = async () => {
        setFlowState('loading');
        setError('');
        try {
          const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}');
          if (!userInfo.clinic_id) throw new Error('Clinic ID missing');

          // OFFLINE-FIRST: check the local IndexedDB cache first so this works
          // even when navigator.onLine is false.
          const localMatches = await db.searchPatientsByMobile(userInfo.clinic_id, mobileNumber)
            .catch(() => [] as any[]);
          let found: any = localMatches[0] || null;

          // If we're online, also reconcile with the server (server may have
          // patients that haven't been pulled to this device yet).
          if (navigator.onLine) {
            try {
              const pts = await patientsApi.getPatients(userInfo.clinic_id);
              const serverMatch = pts.find((p: any) => p.mobile_number === mobileNumber);
              if (serverMatch) found = serverMatch;
            } catch (netErr) {
              // Network failed mid-search; fall through to local result
              console.warn('Online search failed, using local cache:', netErr);
            }
          }

          if (found) {
            setPatientData({ id: found.id, name: found.name, age: String(found.age), gender: found.gender, symptoms: '' });
            setFlowState('history');
          } else {
            setFlowState('new_patient');
          }
        } catch (err: any) {
          console.error('Search Patient Error:', err);
          setError(err.message || 'Failed to search patient');
          setFlowState('search');
        }
      };
      searchPatient();
    }
  }, [mobileNumber, flowState]);

  const handlePatientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFlowState('vitals');
  };

  const handleVitalsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFlowState('loading');
    setError('');

    try {
      const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}');
      if (!userInfo.clinic_id) throw new Error('Clinic ID missing');

      let pId = patientData.id;

      if (navigator.onLine) {
        // ONLINE: save directly to server — zero intermediary, instant response.
        // If the backend is unreachable (Render cold start, transient failure)
        // we catch NetworkError and fall through to the offline syncManager path
        // so the receptionist is never blocked.
        try {
          if (!pId) {
            const newPatient = await patientsApi.createPatient({
              name: patientData.name,
              mobile_number: mobileNumber,
              age: parseInt(patientData.age),
              gender: patientData.gender as any,
              clinic_id: userInfo.clinic_id,
              consent_given: consentGiven,
            });
            pId = newPatient.id;
            setPatientData(prev => ({ ...prev, id: pId }));
          }
          const queueEntry = await queueApi.addToQueue({
            clinic_id: userInfo.clinic_id,
            patient_id: pId,
            priority: 0,
            symptoms: patientData.symptoms,
            bp: vitals.bp,
            weight: vitals.weight,
            temperature: vitals.temperature,
            pulse: vitals.pulse,
          });
          setToken(queueEntry.token_number);
        } catch (netErr) {
          if (!(netErr instanceof NetworkError)) throw netErr;
          // Backend unreachable — fall back to offline queue so work isn't lost
          if (!pId) {
            const newPatient = await syncManager.createPatient({
              name: patientData.name,
              mobile_number: mobileNumber,
              age: parseInt(patientData.age),
              gender: patientData.gender as any,
              clinic_id: userInfo.clinic_id,
              consent_given: consentGiven,
            });
            pId = newPatient.id;
            setPatientData(prev => ({ ...prev, id: pId }));
          }
          const queueEntry = await syncManager.addToQueue({
            clinic_id: userInfo.clinic_id,
            patient_id: pId,
            priority: 0,
            symptoms: patientData.symptoms,
            bp: vitals.bp,
            weight: vitals.weight,
            temperature: vitals.temperature,
            pulse: vitals.pulse,
          });
          setToken(queueEntry.token_number === 'PENDING' ? 'PENDING (offline)' : queueEntry.token_number);
        }
      } else {
        // OFFLINE: write to IndexedDB immediately, background-sync on reconnect
        if (!pId) {
          const newPatient = await syncManager.createPatient({
            name: patientData.name,
            mobile_number: mobileNumber,
            age: parseInt(patientData.age),
            gender: patientData.gender as any,
            clinic_id: userInfo.clinic_id,
            consent_given: consentGiven,
          });
          pId = newPatient.id;
          setPatientData(prev => ({ ...prev, id: pId }));
        }
        const queueEntry = await syncManager.addToQueue({
          clinic_id: userInfo.clinic_id,
          patient_id: pId,
          priority: 0,
          symptoms: patientData.symptoms,
          bp: vitals.bp,
          weight: vitals.weight,
          temperature: vitals.temperature,
          pulse: vitals.pulse,
        });
        setToken(queueEntry.token_number === 'PENDING' ? 'PENDING (offline)' : queueEntry.token_number);
      }

      setFlowState('token');

      // Refresh queue panel immediately without waiting for the polling tick
      try {
        const pData = await patientsApi.getPatients(userInfo.clinic_id);
        const newCache: Record<string, any> = {};
        pData.forEach((p: any) => { newCache[p.id] = p; });
        setPatientsCache(newCache);
        setPatients(pData);
      } catch { /* offline — local cache still serves */ }
      loadQueue();
    } catch (err: any) {
      setError(err.message || 'Failed to generate token');
      setFlowState('vitals');
    }
  };

  const resetFlow = () => {
    setMobileNumber('');
    setPatientData({ id: '', name: '', age: '', gender: '', symptoms: '' });
    setVitals({ bp: '', weight: '', temperature: '', pulse: '' });
    setToken('');
    setFlowState('search');
  };

  const progress = flowState === 'search' ? 10
    : flowState === 'loading' ? 40
    : (flowState === 'new_patient' || flowState === 'history') ? 60
    : flowState === 'vitals' ? 80
    : 100;
  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium">Authenticating Reception...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">

      {/* Sidebar */}
      <ClinicSidebar
        clinicName={clinic.clinicName}
        subtitle="Reception Desk"
        doctorName={clinic.doctorName}
        specialization={clinic.specialization}
        navItems={[
          { id: 'entry', icon: '🏥', label: 'Dashboard', onClick: () => {} },
        ]}
        activeId={'entry'}
        onLogout={() => {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_info');
          router.push('/login');
        }}
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
            <span>Logout</span>
          </button>
        }
      />

      {/* Main */}
      <main className="flex-1 p-4 md:p-8 max-w-4xl mx-auto w-full pb-24 md:pb-8">

        {/* Mobile top bar — no back-to-home; receptionists work inside the dashboard */}
        <div className="flex items-center justify-between md:hidden mb-4 print:hidden">
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold text-slate-800 tracking-tight truncate">{clinic.clinicName}</h2>
            <p className="text-xs text-slate-500">Reception Desk</p>
          </div>
          <ConnectionDot className="ml-2" />
        </div>

        {/* Page title */}
        <div className="mb-5 md:mb-8 print:hidden">
          <div className="hidden md:block">
            <Breadcrumbs
              items={[
                { label: 'Reception', isCurrent: flowState === 'search' },
                ...(flowState !== 'search' && flowState !== 'loading' ? [{
                  label: flowState === 'new_patient' ? 'New Patient'
                    : flowState === 'history' ? 'Existing Patient'
                    : flowState === 'vitals' ? 'Vitals'
                    : 'Token Generated',
                  isCurrent: true
                }] : [])
              ]}
            />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Patient Check-in</h1>
          <p className="text-slate-500 text-sm md:text-base mt-1">Enter mobile number to search <strong>{clinic.clinicName}</strong>.</p>
          {error && <div className="mt-3 p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 flex items-start gap-2">
            <span className="flex-shrink-0">⚠️</span>
            <span>{error}</span>
          </div>}
        </div>

        {/* Connection status — desktop only (mobile top bar has its own dot) */}
        <div className="hidden md:flex justify-end mb-2 print:hidden">
          <ConnectionDot />
        </div>

        {/* Main card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden relative">

          {/* Progress Bar */}
          <div className="h-1.5 w-full bg-slate-100 print:hidden">
            <div className="h-full bg-blue-600 transition-all duration-700 ease-out" style={{ width: `${progress}%` }}></div>
          </div>

          <div className="p-6 md:p-10">

            {/* Step 1: Search */}
            <div className={`${flowState !== 'search' && flowState !== 'loading' ? 'hidden' : 'block'} print:hidden`}>
              <label htmlFor="search" className="block text-lg font-semibold text-slate-800 mb-4">Patient Mobile Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-slate-400 font-medium border-r border-slate-200 pr-3">+91</span>
                </div>
                <input
                  id="search"
                  type="tel"
                  maxLength={10}
                  value={mobileNumber}
                  onChange={e => { const v = e.target.value.replace(/\D/g, ''); setMobileNumber(v); if (v.length < 10) setFlowState('search'); }}
                  disabled={flowState === 'loading'}
                  className="block w-full pl-16 pr-12 py-5 bg-slate-50 border border-slate-200 rounded-2xl text-2xl font-semibold tracking-widest text-slate-800 focus:bg-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-70 placeholder:text-slate-300 placeholder:font-normal placeholder:tracking-normal"
                  placeholder="Enter 10 digits"
                />
                {flowState === 'loading' && (
                  <div className="absolute inset-y-0 right-4 flex items-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  </div>
                )}
              </div>
              <p className="text-sm text-slate-500 flex items-center gap-2 mt-3">
                <span className="text-emerald-500">✓</span>
                Searches only <strong>{clinic.clinicName}</strong> database. Auto-triggers at 10 digits.
              </p>
            </div>

            {/* Step 2a: Patient Form */}
            {(flowState === 'history' || flowState === 'new_patient') && (
              <form onSubmit={handlePatientSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 print:hidden">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800">
                      {flowState === 'history' ? 'Existing Patient' : 'New Patient Registration'}
                    </h3>
                    <p className="text-slate-500 font-medium mt-1">+91 {mobileNumber}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${flowState === 'history' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                    {flowState === 'history' ? '✓ Found' : 'New Entry'}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Full Name *</label>
                    <input type="text" required value={patientData.name} onChange={e => setPatientData(p => ({ ...p, name: e.target.value }))}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 placeholder:text-slate-400" placeholder="Patient name" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-700">Age *</label>
                      <input type="number" required value={patientData.age} onChange={e => setPatientData(p => ({ ...p, age: e.target.value }))}
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 placeholder:text-slate-400" placeholder="Yrs" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-700">Gender *</label>
                      <select required value={patientData.gender} onChange={e => setPatientData(p => ({ ...p, gender: e.target.value }))}
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900">
                        <option value="">Select</option>
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                        <option value="O">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Chief Complaint / Symptoms</label>
                  <textarea rows={2} value={patientData.symptoms} onChange={e => setPatientData(p => ({ ...p, symptoms: e.target.value }))}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none text-slate-900 placeholder:text-slate-400"
                    placeholder="e.g. Fever, headache since 2 days..." />
                </div>

                {flowState === 'new_patient' && (
                  <div className="consent-block bg-green-50 border border-green-500 rounded-xl p-4 mt-4">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={consentGiven}
                        onChange={(e) => setConsentGiven(e.target.checked)}
                        className="mt-1 w-5 h-5 accent-teal-600"
                      />
                      <span className="text-sm text-green-800">
                        The patient (or their authorized guardian) has given consent for their health information
                        to be stored and processed by this clinic using ClinicSathi.{' '}
                        <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-teal-700 underline font-semibold">
                          View Privacy Policy
                        </a>
                      </span>
                    </label>
                  </div>
                )}

                <div className="flex gap-4 pt-4 border-t border-slate-100">
                  <button type="button" onClick={resetFlow} className="px-6 py-4 rounded-xl font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">Cancel</button>
                  <button 
                    type="submit" 
                    disabled={flowState === 'new_patient' && !consentGiven}
                    className="flex-1 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold shadow-md transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
                    Next: Record Vitals →
                  </button>
                </div>
              </form>
            )}

            {/* Step 2b: Vitals */}
            {flowState === 'vitals' && (
              <form onSubmit={handleVitalsSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 print:hidden">
                <div>
                  <h3 className="text-2xl font-bold text-slate-800">Record Vitals</h3>
                  <p className="text-slate-500 mt-1 font-medium">{patientData.name} • {patientData.age} yrs • {patientData.gender}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Blood Pressure', key: 'bp', placeholder: '120/80 mmHg' },
                    { label: 'Weight (kg)', key: 'weight', placeholder: '70 kg' },
                    { label: 'Temperature', key: 'temperature', placeholder: '37°C' },
                    { label: 'Pulse (bpm)', key: 'pulse', placeholder: '72 bpm' },
                  ].map(({ label, key, placeholder }) => (
                    <div key={key} className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-700">{label} <span className="text-slate-400 font-normal">(optional)</span></label>
                      <input
                        value={vitals[key as keyof PatientVitals]}
                        onChange={e => setVitals(v => ({ ...v, [key]: e.target.value }))}
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium text-slate-900 placeholder:text-slate-400"
                        placeholder={placeholder}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex gap-4 pt-4 border-t border-slate-100">
                  <button type="button" onClick={() => setFlowState(patientData.id ? 'history' : 'new_patient')}
                    className="px-6 py-4 rounded-xl font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">← Back</button>
                  <button type="submit" className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md shadow-blue-600/20 transition-all active:scale-[0.98]">
                    Save & Generate Token →
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: Token */}
            {flowState === 'token' && (
              <div className="animate-in fade-in zoom-in-95 duration-500 max-w-md mx-auto mt-4">
                <div className="border border-slate-200 rounded-2xl p-5 text-center bg-white shadow-sm">
                  <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${token.includes('PENDING') ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'} mb-2 print:hidden text-xl`}>
                    {token.includes('PENDING') ? '⏳' : '✓'}
                  </div>
                  <h4 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-0.5">Token</h4>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tighter mb-3 break-words">{token}</h2>
                  {token.includes('PENDING') && (
                    <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2 mb-3 font-semibold">
                      Saved locally — final token will appear here once the device reconnects.
                    </p>
                  )}

                  <div className="bg-slate-50 p-3 rounded-xl text-left border border-slate-100">
                    <p className="text-slate-400 text-[10px] mb-0.5 font-bold uppercase tracking-wider">Patient</p>
                    <p className="font-bold text-slate-800 text-sm">{patientData.name}</p>
                    <p className="text-slate-500 text-xs">{patientData.age} yrs • {patientData.gender === 'M' ? 'Male' : patientData.gender === 'F' ? 'Female' : 'Other'} • +91 {mobileNumber}</p>
                  </div>

                  <p className="mt-3 text-[10px] text-slate-400">{clinic.clinicName} • {clinic.doctorName}</p>
                </div>

                <div className="mt-3 flex gap-2 print:hidden">
                  <button
                    onClick={() => {
                      const params = new URLSearchParams({
                        name: patientData.name, age: patientData.age,
                        gender: patientData.gender, symptoms: patientData.symptoms,
                        token, mobile: mobileNumber,
                        bp: vitals.bp, weight: vitals.weight,
                        temperature: vitals.temperature, pulse: vitals.pulse,
                      });
                      window.open(`/prescription/print?${params.toString()}`, '_blank');
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-md shadow-blue-600/20 transition-all active:scale-[0.98]">
                    🖨️ Print
                  </button>
                  <button className="flex-1 py-3.5 bg-slate-100 text-slate-700 text-sm font-bold rounded-xl transition-all hover:bg-slate-200 active:scale-[0.98]" onClick={resetFlow}>New Patient</button>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Queue Management Section */}
        <div className="mt-8">
          <div className="mb-4 print:hidden">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900">Queue Management</h2>
            <p className="text-slate-500 text-sm mt-1">Live patient queue for <strong>{clinic.clinicName}</strong>.</p>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden p-6 md:p-8">
            <h3 className="text-xl font-bold text-slate-800 mb-6">Today&apos;s Queue</h3>
            
            <div className="space-y-4">
              {queue.length === 0 ? (
                <div className="text-center py-10 text-slate-500">No patients in queue yet.</div>
              ) : [...queue].sort((a, b) => {
                  if (a.status === 'in_consultation' && b.status !== 'in_consultation') return -1;
                  if (a.status !== 'in_consultation' && b.status === 'in_consultation') return 1;
                  return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
              }).map(q => {
                const p = patients.find(pat => pat.id === q.patient_id) || { name: 'Unknown', mobile_number: '', gender: '', age: 0 };
                const isEditing = editingPatientId === q.patient_id;
                return (
                  <div key={q.id} className={`p-3 md:p-4 rounded-2xl border transition-all ${
                    q.status === 'in_consultation'
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-md'
                      : 'bg-white border-slate-200'
                  }`}>
                    {/* Header row — token badge | name+meta | status */}
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Prominent token badge — same hierarchy as doctor's QueueBoard */}
                      <div className={`flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-2xl flex flex-col items-center justify-center shadow-sm ${
                        q.status === 'in_consultation' ? 'bg-blue-600 text-white shadow-blue-600/30'
                        : q.status === 'completed'      ? 'bg-emerald-100 text-emerald-800'
                        : q.status === 'cancelled'      ? 'bg-red-100 text-red-700'
                        : q.status === 'skipped'        ? 'bg-orange-100 text-orange-700'
                        :                                  'bg-slate-100 text-slate-800'
                      }`}>
                        <span className="text-[9px] font-bold uppercase tracking-wider opacity-70 leading-none">Token</span>
                        <span className="font-black text-base md:text-lg leading-tight mt-0.5">{q.token_number || '—'}</span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className={`font-bold text-base md:text-lg truncate leading-tight ${q.status === 'in_consultation' ? 'text-blue-900' : 'text-slate-900'}`}>
                          {p.name || 'Loading…'}
                        </p>
                        <p className="text-xs md:text-sm text-slate-500 truncate mt-0.5">
                          {p.age ? `${p.age} yrs` : '—'} • {p.gender === 'M' ? 'Male' : p.gender === 'F' ? 'Female' : p.gender === 'O' ? 'Other' : '—'} • +91 {p.mobile_number || '—'}
                        </p>
                        <span className={`inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusBadge(q.status)}`}>
                          {q.status.replace('_', ' ')}
                        </span>
                      </div>

                      {!isEditing && (
                        <button onClick={() => {
                          setEditForm({ name: p.name, age: p.age.toString(), gender: p.gender, mobile_number: p.mobile_number });
                          setEditingPatientId(q.patient_id);
                        }} className="flex-shrink-0 text-blue-600 text-xs font-bold px-3 py-2 hover:bg-blue-50 rounded-lg min-h-[36px]">Edit</button>
                      )}
                    </div>

                    {/* Inline edit form — stacks below on all screen sizes */}
                    {isEditing && (
                      <div className="mt-3 pt-3 border-t border-slate-200">
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <input
                            value={editForm.name}
                            onChange={e => setEditForm(f => ({...f, name: e.target.value}))}
                            className="col-span-2 p-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Full Name"
                          />
                          <input
                            value={editForm.age}
                            onChange={e => setEditForm(f => ({...f, age: e.target.value}))}
                            className="p-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Age"
                            type="number"
                          />
                          <select
                            value={editForm.gender}
                            onChange={e => setEditForm(f => ({...f, gender: e.target.value}))}
                            className="p-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          >
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                            <option value="O">Other</option>
                          </select>
                          <input
                            value={editForm.mobile_number}
                            onChange={e => setEditForm(f => ({...f, mobile_number: e.target.value}))}
                            className="col-span-2 p-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Mobile Number"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={async () => {
                              try {
                                await patientsApi.updatePatient(q.patient_id, {
                                  name: editForm.name,
                                  age: parseInt(editForm.age),
                                  gender: editForm.gender,
                                  mobile_number: editForm.mobile_number
                                });
                                setEditingPatientId(null);
                                loadQueue();
                              } catch(e) { alert("Failed to update patient"); }
                            }}
                            className="flex-1 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-colors"
                          >
                            Save Changes
                          </button>
                          <button
                            onClick={() => setEditingPatientId(null)}
                            className="px-4 py-2.5 bg-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-300 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {q.status === 'completed' && (
                      <div className="mt-3 pt-3 border-t border-slate-100">
                        <DocumentUpload patientId={q.patient_id} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </main>

      {/* Doctor Call Popup */}
      {calledPatient && (
        <div className="fixed bottom-6 right-6 bg-blue-600 text-white p-5 rounded-2xl shadow-2xl z-50 animate-in slide-in-from-bottom-5 fade-in flex gap-4 items-center max-w-sm">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl animate-pulse">
            🔔
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-blue-100 uppercase tracking-widest mb-1">Doctor is Calling</p>
            <p className="text-xl font-extrabold">{calledPatient.token} - {calledPatient.name}</p>
          </div>
          <button 
            onClick={() => setCalledPatient(null)}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
            title="Dismiss"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
