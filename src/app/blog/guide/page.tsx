import Link from 'next/link';
import React from 'react';

export const metadata = {
  title: 'Complete Guide to ClinicSathi | Step-by-Step Tutorial',
  description: 'A comprehensive visual guide to using ClinicSathi - from clinic registration to managing patients, prescriptions, and staff.',
};

interface VisualMockupProps {
  type: 'doctor-form' | 'clinic-form' | 'timings-form' | 'staff-form' | 'login' | 'patient-search' | 'patient-form' | 'vitals-form' | 'token' | 'queue' | 'doctor-dashboard' | 'consultation' | 'prescription' | 'settings';
  title: string;
  description: string;
}

// Lightweight CSS-based visual mockups - no images, fast on 3G
function VisualMockup({ type, title, description }: VisualMockupProps) {
  const mockups: Record<string, React.ReactNode> = {
    'doctor-form': (
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-teal-500 px-6 py-4">
          <div className="flex items-center gap-2 text-white">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-sm">🏥</div>
            <span className="font-bold">Register Your Clinic</span>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">1</div>
            <span className="text-sm font-semibold text-slate-700">Professional Details</span>
          </div>
          <div className="space-y-3">
            <div>
              <div className="text-xs text-slate-500 mb-1">Full Name</div>
              <div className="h-10 bg-slate-100 rounded-lg border border-slate-200 px-3 flex items-center text-sm text-slate-600">Dr. Ramesh Kumar</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-slate-500 mb-1">Mobile Number</div>
                <div className="h-10 bg-slate-100 rounded-lg border border-slate-200 px-3 flex items-center text-sm text-slate-600">98765 43210</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">Password</div>
                <div className="h-10 bg-slate-100 rounded-lg border border-slate-200 px-3 flex items-center text-sm text-slate-600">••••••••</div>
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">Specialization</div>
              <div className="h-10 bg-blue-50 rounded-lg border border-blue-200 px-3 flex items-center text-sm text-blue-700">General Physician</div>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <div className="px-4 py-2 bg-slate-100 rounded-lg text-xs text-slate-600">Back</div>
            <div className="px-4 py-2 bg-blue-600 rounded-lg text-xs text-white font-medium">Next Step →</div>
          </div>
        </div>
      </div>
    ),
    'clinic-form': (
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-teal-500 px-6 py-4">
          <div className="flex items-center gap-2 text-white">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-sm">🏥</div>
            <span className="font-bold">Clinic Information</span>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">2</div>
            <span className="text-sm font-semibold text-slate-700">Clinic Details</span>
          </div>
          <div className="space-y-3">
            <div>
              <div className="text-xs text-slate-500 mb-1">Clinic Name</div>
              <div className="h-10 bg-slate-100 rounded-lg border border-slate-200 px-3 flex items-center text-sm text-slate-600">Shree Sai Clinic</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-slate-500 mb-1">City</div>
                <div className="h-10 bg-slate-100 rounded-lg border border-slate-200 px-3 flex items-center text-sm text-slate-600">Mumbai</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">MCI Number</div>
                <div className="h-10 bg-slate-100 rounded-lg border border-slate-200 px-3 flex items-center text-sm text-slate-600">MCI-12345</div>
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">Full Address</div>
              <div className="h-16 bg-slate-100 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600">123, Main Road, Andheri West, Mumbai - 400053</div>
            </div>
          </div>
          <div className="flex justify-between pt-4 border-t border-slate-100">
            <div className="px-4 py-2 bg-slate-100 rounded-lg text-xs text-slate-600">← Back</div>
            <div className="px-4 py-2 bg-blue-600 rounded-lg text-xs text-white font-medium">Next: Timings →</div>
          </div>
        </div>
      </div>
    ),
    'timings-form': (
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-teal-500 px-6 py-4">
          <div className="flex items-center gap-2 text-white">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-sm">⏰</div>
            <span className="font-bold">Clinic Timings</span>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">3</div>
            <span className="text-sm font-semibold text-slate-700">Set Your Schedule</span>
          </div>
          <div className="space-y-3">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-sm font-semibold text-blue-800 mb-3">Morning Session</div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-slate-500 mb-1">Start Time</div>
                  <div className="h-10 bg-white rounded-lg border border-blue-200 px-3 flex items-center text-sm text-slate-700">09:00 AM</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">End Time</div>
                  <div className="h-10 bg-white rounded-lg border border-blue-200 px-3 flex items-center text-sm text-slate-700">01:00 PM</div>
                </div>
              </div>
            </div>
            <div className="bg-amber-50 rounded-lg p-4">
              <div className="text-sm font-semibold text-amber-800 mb-3">Evening Session</div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-slate-500 mb-1">Start Time</div>
                  <div className="h-10 bg-white rounded-lg border border-amber-200 px-3 flex items-center text-sm text-slate-700">05:00 PM</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">End Time</div>
                  <div className="h-10 bg-white rounded-lg border border-amber-200 px-3 flex items-center text-sm text-slate-700">08:00 PM</div>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(d => (
                <div key={d} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">{d}</div>
              ))}
              {['Sat', 'Sun'].map(d => (
                <div key={d} className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-xs">{d}</div>
              ))}
            </div>
          </div>
          <div className="flex justify-between pt-4 border-t border-slate-100">
            <div className="px-4 py-2 bg-slate-100 rounded-lg text-xs text-slate-600">← Back</div>
            <div className="px-4 py-2 bg-blue-600 rounded-lg text-xs text-white font-medium">Next: Staff →</div>
          </div>
        </div>
      </div>
    ),
    'staff-form': (
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-teal-500 px-6 py-4">
          <div className="flex items-center gap-2 text-white">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-sm">👥</div>
            <span className="font-bold">Add Reception Staff</span>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">4</div>
            <span className="text-sm font-semibold text-slate-700">Staff Management</span>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-bold">R</div>
              <div className="flex-1">
                <div className="text-sm font-medium text-slate-700">Receptionist</div>
                <div className="text-xs text-slate-500">Mobile: 98765 12345</div>
              </div>
              <div className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-medium">Added</div>
            </div>
            <div className="border-2 border-dashed border-blue-200 rounded-lg p-4">
              <div className="text-xs text-slate-500 mb-2">Add New Staff</div>
              <div className="flex gap-2">
                <div className="flex-1 h-10 bg-slate-100 rounded-lg border border-slate-200 px-3 flex items-center text-sm text-slate-600">Enter mobile number</div>
                <div className="px-4 py-2 bg-blue-600 rounded-lg text-xs text-white font-medium">Add</div>
              </div>
            </div>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-emerald-700">
              <span className="text-lg">✅</span>
              <span className="text-sm font-medium">Ready to finish registration</span>
            </div>
          </div>
          <div className="flex justify-between pt-4 border-t border-slate-100">
            <div className="px-4 py-2 bg-slate-100 rounded-lg text-xs text-slate-600">← Back</div>
            <div className="px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-500 rounded-lg text-xs text-white font-medium">Finish & Open Dashboard</div>
          </div>
        </div>
      </div>
    ),
    'login': (
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 max-w-sm mx-auto">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-teal-400 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">CS</div>
          <h3 className="text-xl font-bold text-slate-800">Welcome Back</h3>
          <p className="text-sm text-slate-500">Sign in to your clinic dashboard</p>
        </div>
        <div className="space-y-4">
          <div>
            <div className="text-xs text-slate-500 mb-1">Mobile Number</div>
            <div className="h-12 bg-slate-50 rounded-xl border border-slate-200 px-4 flex items-center text-sm text-slate-700">98765 43210</div>
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-1">Password</div>
            <div className="h-12 bg-slate-50 rounded-xl border border-slate-200 px-4 flex items-center text-sm text-slate-700">••••••••</div>
          </div>
          <div className="h-12 bg-gradient-to-r from-blue-600 to-teal-500 rounded-xl flex items-center justify-center text-white font-semibold shadow-md shadow-blue-500/25">
            Sign In
          </div>
          <div className="text-center">
            <span className="text-xs text-slate-400">Don't have an account? </span>
            <span className="text-xs text-blue-600 font-medium">Register</span>
          </div>
        </div>
      </div>
    ),
    'patient-search': (
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="bg-teal-600 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <span className="text-sm font-semibold">📋 Reception Desk</span>
          </div>
          <div className="text-xs text-teal-100">Dr. Ramesh Kumar</div>
        </div>
        <div className="p-6">
          <div className="text-lg font-bold text-slate-800 mb-4">Patient Check-In</div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
            <div className="text-xs text-amber-700 font-medium mb-2">Step 1: Search Patient</div>
            <div className="h-12 bg-white rounded-lg border border-amber-300 px-4 flex items-center text-sm text-slate-700">📱 Enter 10-digit mobile number</div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Search auto-triggers at 10 digits</span>
          </div>
        </div>
      </div>
    ),
    'patient-form': (
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="bg-teal-600 px-6 py-3">
          <div className="text-white text-sm font-semibold">📝 New Patient Registration</div>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
            <span>Step 2 of 3</span>
            <div className="flex-1 h-1 bg-slate-100 rounded-full"><div className="w-2/3 h-1 bg-teal-500 rounded-full"></div></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs text-slate-500 mb-1">Patient Name</div>
              <div className="h-10 bg-slate-50 rounded-lg border border-slate-200 px-3 flex items-center text-sm text-slate-700">Priya Sharma</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">Age</div>
              <div className="h-10 bg-slate-50 rounded-lg border border-slate-200 px-3 flex items-center text-sm text-slate-700">34 years</div>
            </div>
          </div>
          <div className="flex gap-3">
            {['Male', 'Female', 'Other'].map((g, i) => (
              <div key={g} className={`px-4 py-2 rounded-lg text-xs font-medium ${i === 1 ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-500'}`}>{g}</div>
            ))}
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-1">Symptoms / Chief Complaint</div>
            <div className="h-20 bg-slate-50 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700">Fever and headache since 2 days</div>
          </div>
          <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
            <div className="w-4 h-4 bg-teal-500 rounded flex items-center justify-center text-white text-xs">✓</div>
            <div className="text-xs text-slate-600">Patient consent obtained for data collection</div>
          </div>
          <div className="flex justify-end">
            <div className="px-6 py-2 bg-teal-600 rounded-lg text-xs text-white font-medium">Next: Vitals →</div>
          </div>
        </div>
      </div>
    ),
    'vitals-form': (
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="bg-teal-600 px-6 py-3">
          <div className="text-white text-sm font-semibold">🩺 Record Vitals</div>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
            <span>Step 3 of 3</span>
            <div className="flex-1 h-1 bg-slate-100 rounded-full"><div className="w-full h-1 bg-teal-500 rounded-full"></div></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Blood Pressure', value: '120/80 mmHg', icon: '🫀' },
              { label: 'Weight', value: '65 kg', icon: '⚖️' },
              { label: 'Temperature', value: '37 °C', icon: '🌡️' },
              { label: 'Pulse', value: '72 bpm', icon: '💓' },
            ].map((vital) => (
              <div key={vital.label} className="bg-slate-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs">{vital.icon}</span>
                  <span className="text-xs text-slate-500">{vital.label}</span>
                </div>
                <div className="text-sm font-semibold text-slate-700">{vital.value}</div>
              </div>
            ))}
          </div>
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="text-xs text-amber-700">ℹ️ All vitals are optional but recommended</div>
          </div>
          <div className="h-12 bg-gradient-to-r from-teal-600 to-emerald-500 rounded-xl flex items-center justify-center text-white font-semibold shadow-md">
            💾 Save & Generate Token
          </div>
        </div>
      </div>
    ),
    'token': (
      <div className="bg-gradient-to-br from-blue-600 to-teal-500 rounded-xl shadow-lg p-6 text-white max-w-xs mx-auto">
        <div className="text-center mb-4">
          <div className="text-xs text-blue-100 mb-1">Token Generated</div>
          <div className="text-5xl font-black">A-042</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-blue-100">Patient</span>
            <span className="font-medium">Priya Sharma</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-100">Age/Gender</span>
            <span className="font-medium">34/F</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-100">Status</span>
            <span className="px-2 py-0.5 bg-yellow-400 text-yellow-900 rounded text-xs font-bold">WAITING</span>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <div className="flex-1 h-10 bg-white/20 rounded-lg flex items-center justify-center text-xs font-medium">🖨️ Print</div>
          <div className="flex-1 h-10 bg-white rounded-lg flex items-center justify-center text-xs font-bold text-blue-600">+ New</div>
        </div>
      </div>
    ),
    'queue': (
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="bg-slate-800 px-6 py-3 flex items-center justify-between">
          <div className="text-white text-sm font-semibold">📊 Live Queue</div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-xs text-slate-300">Live</span>
          </div>
        </div>
        <div className="p-4 space-y-2">
          {[
            { token: 'A-041', name: 'Amit Patel', status: 'Completed', color: 'bg-emerald-100 text-emerald-700' },
            { token: 'A-042', name: 'Priya Sharma', status: 'Waiting', color: 'bg-amber-100 text-amber-700' },
            { token: 'A-043', name: 'Rahul Gupta', status: 'In Consultation', color: 'bg-blue-100 text-blue-700' },
          ].map((patient, i) => (
            <div key={patient.token} className={`flex items-center gap-3 p-3 rounded-lg ${i === 1 ? 'bg-blue-50 border border-blue-200' : 'bg-slate-50'}`}>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-400 rounded-lg flex items-center justify-center text-white text-xs font-bold">{patient.token}</div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-slate-700">{patient.name}</div>
                <div className="text-xs text-slate-400">34 yrs • Male</div>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${patient.color}`}>{patient.status}</div>
            </div>
          ))}
        </div>
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 text-xs text-slate-400 text-center">
          Auto-refreshes every 5 seconds
        </div>
      </div>
    ),
    'doctor-dashboard': (
      <div className="bg-slate-100 rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-teal-400 rounded-lg flex items-center justify-center text-white text-xs font-bold">CS</div>
            <span className="text-sm font-semibold text-slate-700">Doctor Dashboard</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">🔔</div>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs font-bold">DR</div>
          </div>
        </div>
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Waiting', value: '3', color: 'text-amber-600' },
              { label: 'Completed', value: '12', color: 'text-emerald-600' },
              { label: 'Total', value: '15', color: 'text-blue-600' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-lg p-3 text-center shadow-sm">
                <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
                <div className="text-xs text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="text-xs font-semibold text-slate-700 mb-2">Current Patient</div>
            <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">PS</div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-slate-700">Priya Sharma</div>
                <div className="text-xs text-slate-500">A-042 • Fever, Headache</div>
              </div>
              <div className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-medium">Consult</div>
            </div>
          </div>
        </div>
      </div>
    ),
    'consultation': (
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="bg-blue-600 px-6 py-3 flex items-center justify-between">
          <div className="text-white text-sm font-semibold">🩺 Patient Consultation</div>
          <div className="text-xs text-blue-200">Token: A-042</div>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">PS</div>
            <div>
              <div className="font-semibold text-slate-800">Priya Sharma</div>
              <div className="text-xs text-slate-500">34 yrs • Female • BP: 120/80</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="text-xs text-amber-700 mb-1">Symptoms</div>
              <div className="text-sm text-slate-700">Fever, Headache</div>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-xs text-blue-700 mb-1">Vitals</div>
              <div className="text-sm text-slate-700">Temp: 37°C • Pulse: 72</div>
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-1">Diagnosis & Notes</div>
            <div className="h-20 bg-slate-50 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700">Viral fever. Prescribed paracetamol and rest.</div>
          </div>
          <div className="flex gap-2">
            <div className="flex-1 h-10 bg-emerald-500 rounded-lg flex items-center justify-center text-white text-sm font-medium shadow-md">✓ Complete</div>
            <div className="h-10 px-4 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 text-sm">⏭️ Skip</div>
          </div>
        </div>
      </div>
    ),
    'prescription': (
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 max-w-sm mx-auto">
        <div className="border-b-2 border-blue-600 pb-3 mb-4">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-800">Shree Sai Clinic</div>
            <div className="text-xs text-slate-500">123 Main Road, Mumbai - 400053</div>
            <div className="text-xs text-slate-500">Dr. Ramesh Kumar • MCI-12345</div>
          </div>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Patient:</span>
            <span className="font-medium">Priya Sharma</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Date:</span>
            <span>07 May 2026</span>
          </div>
          <div className="border-t border-slate-200 pt-3">
            <div className="font-semibold text-slate-700 mb-2">Rx</div>
            <div className="space-y-1 text-sm">
              <div>1. Paracetamol 500mg - 1 tab BD × 3 days</div>
              <div>2. Vitamin C 500mg - 1 tab OD × 5 days</div>
            </div>
          </div>
          <div className="border-t border-slate-200 pt-3 mt-3">
            <div className="text-xs text-slate-500 italic">Dr. Ramesh Kumar</div>
            <div className="text-xs text-slate-400">Reg. No: MCI-12345</div>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <div className="flex-1 h-8 bg-slate-100 rounded flex items-center justify-center text-xs text-slate-600">Template: Classic</div>
          <div className="h-8 px-4 bg-blue-600 rounded flex items-center justify-center text-white text-xs">🖨️ Print</div>
        </div>
      </div>
    ),
    'settings': (
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="bg-slate-800 px-6 py-3">
          <div className="text-white text-sm font-semibold">⚙️ Clinic Settings</div>
        </div>
        <div className="p-4 space-y-2">
          {[
            { icon: '🏥', label: 'Clinic Profile', desc: 'Name, address, contact' },
            { icon: '⏰', label: 'Timings', desc: 'Operating hours' },
            { icon: '👥', label: 'Staff', desc: 'Manage receptionists' },
            { icon: '🎨', label: 'Prescription', desc: 'Choose template' },
            { icon: '🔐', label: 'Security', desc: 'Change password' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg cursor-pointer">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-lg">{item.icon}</div>
              <div className="flex-1">
                <div className="text-sm font-medium text-slate-700">{item.label}</div>
                <div className="text-xs text-slate-400">{item.desc}</div>
              </div>
              <div className="text-slate-300">→</div>
            </div>
          ))}
        </div>
      </div>
    ),
  };

  return (
    <div className="my-8">
      <div className="max-w-lg mx-auto">
        {mockups[type]}
      </div>
      <p className="text-center text-slate-500 text-sm mt-4 max-w-md mx-auto">{description}</p>
    </div>
  );
}

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-5 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-400 flex items-center justify-center text-white font-black text-xs">CS</div>
            <span className="font-extrabold text-slate-900">ClinicSathi</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm font-semibold text-slate-500">
            <Link href="/blog" className="hover:text-slate-900 transition-colors">← Back to Blog</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-teal-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-5 text-center">
          <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-4">
            📖 Complete Tutorial
          </span>
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
            ClinicSathi Step-by-Step Guide
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Everything you need to know about setting up and using ClinicSathi for your medical practice. 
            From registration to daily operations.
          </p>
        </div>
      </div>

      {/* Table of Contents */}
      <div className="bg-slate-50 border-b border-slate-200 py-8">
        <div className="max-w-4xl mx-auto px-5">
          <h2 className="font-bold text-slate-900 mb-4">Table of Contents</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {[
              { id: 'registration', label: '1. Clinic Registration', icon: '🏥' },
              { id: 'login', label: '2. Signing In', icon: '🔐' },
              { id: 'reception', label: '3. Reception Dashboard', icon: '📋' },
              { id: 'doctor', label: '4. Doctor Dashboard', icon: '👨‍⚕️' },
              { id: 'consultation', label: '5. Patient Consultation', icon: '🩺' },
              { id: 'prescription', label: '6. Prescription Printing', icon: '📄' },
              { id: 'staff', label: '7. Staff Management', icon: '👥' },
              { id: 'settings', label: '8. Clinic Settings', icon: '⚙️' },
            ].map((item) => (
              <a 
                key={item.id}
                href={`#${item.id}`}
                className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all"
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-semibold text-slate-700">{item.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-5 py-12">
        
        {/* Section 1: Clinic Registration */}
        <section id="registration" className="mb-16 scroll-mt-24">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-2xl">🏥</span>
            <div>
              <h2 className="text-3xl font-black text-slate-900">1. Clinic Registration</h2>
              <p className="text-slate-500">Setting up your clinic in 4 simple steps</p>
            </div>
          </div>

          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-600 leading-relaxed">
              Getting started with ClinicSathi begins with a quick 4-step registration process. 
              Navigate to <code className="bg-slate-100 px-2 py-1 rounded text-sm">/doctor/setup</code> to begin.
            </p>

            <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">Step 1: Doctor Professional Details</h3>
            <p className="text-slate-600 mb-4">
              Enter your professional information including your full name (with Dr. prefix), mobile number 
              (this will be your login ID), password, degrees, years of experience, and specialization. 
              The mobile number you enter here will be used for all future logins.
            </p>
            
            <VisualMockup 
              type="doctor-form"
              title="Doctor Information Form"
              description="Enter your professional details including name, mobile number (login ID), password, degree, and specialization."
            />

            <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">Step 2: Clinic Information</h3>
            <p className="text-slate-600 mb-4">
              Provide your clinic details: clinic name, city, contact number, MCI/NMC registration number 
              (optional but recommended for prescriptions), and full clinic address. This information will 
              appear on your printed prescriptions.
            </p>

            <VisualMockup 
              type="clinic-form"
              title="Clinic Details Form"
              description="Enter clinic name, city, contact number, MCI registration, and full address."
            />

            <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">Step 3: Clinic Timings</h3>
            <p className="text-slate-600 mb-4">
              Set your clinic operating hours for both morning and evening sessions. You can also mark 
              specific days as off/holidays. Default timings are set to 9 AM - 1 PM (morning) and 
              5 PM - 8 PM (evening).
            </p>

            <VisualMockup 
              type="timings-form"
              title="Clinic Timings Configuration"
              description="Set morning and evening session timings and select off days for your clinic."
            />

            <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">Step 4: Add Reception Staff</h3>
            <p className="text-slate-600 mb-4">
              Add your reception staff by entering their 10-digit mobile numbers. They can log in 
              immediately using their mobile number. You can skip this step and add staff later from 
              the Settings page.
            </p>

            <VisualMockup 
              type="staff-form"
              title="Staff Management"
              description="Add reception staff by mobile number. Staff can log in immediately."
            />

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 mt-6">
              <p className="text-emerald-800 font-semibold mb-2">✅ Registration Complete!</p>
              <p className="text-emerald-700 text-sm">
                Once you click &quot;Finish & Open Dashboard&quot;, your clinic will be registered and you&apos;ll 
                be automatically logged in and redirected to your Doctor Dashboard.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Signing In */}
        <section id="login" className="mb-16 scroll-mt-24">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center text-2xl">🔐</span>
            <div>
              <h2 className="text-3xl font-black text-slate-900">2. Signing In</h2>
              <p className="text-slate-500">Access your clinic dashboard</p>
            </div>
          </div>

          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-600 leading-relaxed">
              The login page is accessible at <code className="bg-slate-100 px-2 py-1 rounded text-sm">/login</code>. 
              Use your registered mobile number and password to access your dashboard.
            </p>

            <VisualMockup 
              type="login"
              title="Login Page"
              description="Enter your 10-digit mobile number and password to sign in to your clinic dashboard."
            />

            <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">Role-Based Dashboard Access</h3>
            <p className="text-slate-600 mb-4">
              ClinicSathi automatically redirects users based on their role:
            </p>
            <ul className="space-y-3 text-slate-600">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold flex-shrink-0">👨‍⚕️</span>
                <span><strong>Doctors</strong> are redirected to the Doctor Dashboard at <code className="bg-slate-100 px-1 rounded text-sm">/doctor/dashboard</code></span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center text-sm font-bold flex-shrink-0">📋</span>
                <span><strong>Receptionists</strong> are redirected to the Reception Desk at <code className="bg-slate-100 px-1 rounded text-sm">/reception</code></span>
              </li>
            </ul>
          </div>
        </section>

        {/* Section 3: Reception Dashboard */}
        <section id="reception" className="mb-16 scroll-mt-24">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-600 flex items-center justify-center text-2xl">📋</span>
            <div>
              <h2 className="text-3xl font-black text-slate-900">3. Reception Dashboard</h2>
              <p className="text-slate-500">Patient check-in and queue management</p>
            </div>
          </div>

          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-600 leading-relaxed">
              The Reception Dashboard is the central hub for managing patient arrivals. It features 
              a streamlined 3-step process for patient check-in and real-time queue management.
            </p>

            <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">Step 1: Patient Search</h3>
            <p className="text-slate-600 mb-4">
              Enter the patient&apos;s 10-digit mobile number. The system automatically searches your 
              clinic&apos;s database when you enter 10 digits. If the patient exists, their details are 
              retrieved; otherwise, you&apos;ll proceed to new patient registration.
            </p>

            <VisualMockup 
              type="patient-search"
              title="Patient Mobile Search"
              description="Enter the patient's 10-digit mobile number. Search auto-triggers at 10 digits."
            />

            <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">Step 2: Patient Information</h3>
            <p className="text-slate-600 mb-4">
              For new patients, enter their full name, age, and gender. For returning patients, 
              verify their existing information. Add the chief complaint or symptoms in the text area. 
              New patients must provide consent before proceeding.
            </p>

            <VisualMockup 
              type="patient-form"
              title="Patient Registration Form"
              description="Enter patient details (name, age, gender) and symptoms. Consent checkbox for new patients."
            />

            <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">Step 3: Record Vitals</h3>
            <p className="text-slate-600 mb-4">
              Record optional vitals: Blood Pressure, Weight, Temperature, and Pulse. 
              These fields are optional but recommended for comprehensive patient records. 
              Click &quot;Save & Generate Token&quot; to complete the check-in.
            </p>

            <VisualMockup 
              type="vitals-form"
              title="Vitals Entry Form"
              description="Record optional vitals: BP, Weight, Temperature, and Pulse."
            />

            <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">Token Generation</h3>
            <p className="text-slate-600 mb-4">
              After saving, a unique token number is generated and displayed. The token card shows 
              patient details, vitals, and clinic information. You can print the prescription template 
              immediately or register a new patient.
            </p>

            <VisualMockup 
              type="token"
              title="Token Display"
              description="Generated token number with patient details. Options to print prescription or add new patient."
            />

            <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">Live Queue Management</h3>
            <p className="text-slate-600 mb-4">
              The bottom section displays the live patient queue with real-time status updates. 
              Patients are shown with their token number, name, age, gender, and current status 
              (Waiting, In Consultation, Completed, Skipped, or Cancelled).
            </p>

            <VisualMockup 
              type="queue"
              title="Queue Management Panel"
              description="Live queue showing patient tokens, details, and status badges. Auto-refreshes every 5 seconds."
            />
          </div>
        </section>

        {/* Section 4: Doctor Dashboard */}
        <section id="doctor" className="mb-16 scroll-mt-24">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-2xl">👨‍⚕️</span>
            <div>
              <h2 className="text-3xl font-black text-slate-900">4. Doctor Dashboard</h2>
              <p className="text-slate-500">Your command center for patient care</p>
            </div>
          </div>

          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-600 leading-relaxed">
              The Doctor Dashboard provides a complete overview of your clinic operations with three 
              main sections: Patient Queue, Daily Summary, and Settings & Staff.
            </p>

            <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">Dashboard Layout</h3>
            <p className="text-slate-600 mb-4">
              The dashboard features a collapsible sidebar on the left with navigation, a header showing 
              clinic name and doctor information, and the main content area. The sidebar can be collapsed 
              for Focus Mode to maximize workspace.
            </p>

            <VisualMockup 
              type="doctor-dashboard"
              title="Doctor Dashboard Overview"
              description="Main dashboard with sidebar navigation, clinic header, and patient queue panel."
            />

            <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">Statistics Cards</h3>
            <p className="text-slate-600 mb-4">
              At the top of the dashboard, four statistics cards display real-time metrics:
              Today&apos;s Patients, In Queue, Completed, and Average Wait Time. These update 
              automatically as the queue changes.
            </p>

            <VisualMockup 
              type="doctor-dashboard"
              title="Dashboard Statistics"
              description="Four stats cards showing: Today's Patients, In Queue, Completed, and Avg. Wait Time."
            />

            <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">Patient Queue Panel</h3>
            <p className="text-slate-600 mb-4">
              The left panel displays the live patient queue. Each patient card shows their token number, 
              name, status badge, and priority. Click on any patient to select them and begin consultation. 
              The queue auto-refreshes every 5 seconds to keep data current.
            </p>

            <VisualMockup 
              type="queue"
              title="Patient Queue List"
              description="List of patients with token numbers, names, status badges (Waiting, In Consultation, Completed)."
            />
          </div>
        </section>

        {/* Section 5: Patient Consultation */}
        <section id="consultation" className="mb-16 scroll-mt-24">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-2xl">🩺</span>
            <div>
              <h2 className="text-3xl font-black text-slate-900">5. Patient Consultation</h2>
              <p className="text-slate-500">Consultation panel and patient history</p>
            </div>
          </div>

          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-600 leading-relaxed">
              When you select a patient from the queue, the Consultation Panel opens on the right side 
              of the dashboard. This is where you review patient history and manage the consultation workflow.
            </p>

            <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">Patient Header Card</h3>
            <p className="text-slate-600 mb-4">
              The top of the consultation panel shows a teal-colored header card with the patient ID 
              and an &quot;Active Visit&quot; badge. This clearly indicates which patient is currently selected.
            </p>

            <VisualMockup 
              type="consultation"
              title="Consultation Panel Header"
              description="Active consultation view with patient ID, status badge, and instructions."
            />

            <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">Patient History</h3>
            <p className="text-slate-600 mb-4">
              Below the header, the History Preview section displays the patient&apos;s past visits. 
              Each visit card shows the date, diagnosis (or &quot;Handwritten Prescription&quot;), and indicators 
              for attached images or reports. Click on any visit to view full details in a modal.
            </p>

            <VisualMockup 
              type="consultation"
              title="Patient History Preview"
              description="List of past visits with date, diagnosis, and indicators for images/reports."
            />

            <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">Doctor Action Controls</h3>
            <p className="text-slate-600 mb-4">
              At the bottom of the screen, three action buttons allow you to manage the patient flow:
            </p>
            <ul className="space-y-3 text-slate-600">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm flex-shrink-0">✅</span>
                <span><strong>Done</strong> - Mark consultation complete (patient returns to reception for document upload)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded bg-amber-100 text-amber-600 flex items-center justify-center text-sm flex-shrink-0">⏭️</span>
                <span><strong>Skip</strong> - Temporarily skip this patient and move to next</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded bg-red-100 text-red-600 flex items-center justify-center text-sm flex-shrink-0">❌</span>
                <span><strong>Cancel</strong> - Cancel the patient&apos;s visit</span>
              </li>
            </ul>

            <VisualMockup 
              type="consultation"
              title="Doctor Action Buttons"
              description="Fixed bottom bar with Done, Skip, and Cancel action buttons."
            />
          </div>
        </section>

        {/* Section 6: Prescription Printing */}
        <section id="prescription" className="mb-16 scroll-mt-24">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-2xl">📄</span>
            <div>
              <h2 className="text-3xl font-black text-slate-900">6. Prescription Printing</h2>
              <p className="text-slate-500">Professional prescription templates</p>
            </div>
          </div>

          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-600 leading-relaxed">
              ClinicSathi offers 10 professional prescription templates. The reception can print 
              prescriptions immediately after token generation, or you can print them later from the queue.
            </p>

            <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">Available Templates</h3>
            <p className="text-slate-600 mb-4">
              Choose from 10 professionally designed templates: Classic Blue, Modern Dark, Minimal, 
              Emerald, Royal Purple, Warm Saffron, Slate Pro, Rose Medical, Ocean Teal, and Gold Premium. 
              Each template features your clinic branding at the top.
            </p>

            <VisualMockup 
              type="prescription"
              title="Prescription Template Selection"
              description="Grid of 10 prescription templates with live preview. Templates include Classic Blue, Modern Dark, Minimal, etc."
            />

            <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">Template Preview</h3>
            <p className="text-slate-600 mb-4">
              A live preview shows exactly how your prescription will look when printed. It includes 
              your clinic name, doctor name, degree, specialization, contact number, and address. 
              The template features sections for Vitals, Symptoms, the Rx symbol, and medication space.
            </p>

            <VisualMockup 
              type="prescription"
              title="Live Prescription Preview"
              description="Real-time preview showing clinic header, vitals section, symptoms, and Rx area."
            />

            <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">Printing Workflow</h3>
            <p className="text-slate-600 mb-4">
              After generating a token, click the &quot;Print Prescription&quot; button. This opens a print-ready 
              page with patient details pre-filled. The printed prescription can be used by the doctor 
              to write medication, which is then uploaded back to the system by reception.
            </p>
          </div>
        </section>

        {/* Section 7: Staff Management */}
        <section id="staff" className="mb-16 scroll-mt-24">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-2xl">👥</span>
            <div>
              <h2 className="text-3xl font-black text-slate-900">7. Staff Management</h2>
              <p className="text-slate-500">Add and manage reception staff</p>
            </div>
          </div>

          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-600 leading-relaxed">
              The Staff Management section in Settings allows you to add, view, and manage reception 
              staff members who can access the Reception Dashboard.
            </p>

            <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">Adding New Staff</h3>
            <p className="text-slate-600 mb-4">
              To add a receptionist, enter their 10-digit mobile number, full name, and a password 
              (minimum 6 characters). Once added, they can immediately log in using their mobile number 
              and the password you set.
            </p>

            <VisualMockup 
              type="staff-form"
              title="Add Staff Form"
              description="Form with mobile number (+91 prefix), name input, and password field."
            />

            <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">Staff List</h3>
            <p className="text-slate-600 mb-4">
              The staff list displays all added receptionists with their initials badge, name, 
              mobile number, and active status. Staff members are numbered (R1, R2, etc.) for easy reference.
            </p>

            <VisualMockup 
              type="settings"
              title="Staff List Display"
              description="List of reception staff with avatar, name, mobile number, and active/inactive status."
            />
          </div>
        </section>

        {/* Section 8: Clinic Settings */}
        <section id="settings" className="mb-16 scroll-mt-24">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center text-2xl">⚙️</span>
            <div>
              <h2 className="text-3xl font-black text-slate-900">8. Clinic Settings</h2>
              <p className="text-slate-500">Configure your clinic preferences</p>
            </div>
          </div>

          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-600 leading-relaxed">
              The Settings tab in the Doctor Dashboard allows you to update clinic information, 
              timing, prescription templates, manage staff, and export patient data.
            </p>

            <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">Clinic Information</h3>
            <p className="text-slate-600 mb-4">
              Update doctor name, degree, specialization, experience, clinic name, city, contact number, 
              MCI/NMC registration number, and full address. All changes are saved to your clinic profile.
            </p>

            <VisualMockup 
              type="settings"
              title="Clinic Settings Form"
              description="Editable form with all clinic details: doctor info, clinic name, contact, address."
            />

            <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">Data Export</h3>
            <p className="text-slate-600 mb-4">
              Export all patient records in JSON format for backup. The export includes complete 
              patient data and can be converted to CSV or PDF later. File is named with the current date 
              for easy organization.
            </p>

            <VisualMockup 
              type="settings"
              title="Data Export Section"
              description="Export panel with button to download all patient records in JSON format."
            />

            <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">Daily Summary</h3>
            <p className="text-slate-600 mb-4">
              The Daily Summary tab provides a complete overview of the day&apos;s activities: total patients 
              seen, regular vs. new patient count, and a detailed list of all patients with their status. 
              This helps with end-of-day reconciliation.
            </p>

            <VisualMockup 
              type="doctor-dashboard"
              title="Daily Summary View"
              description="Statistics cards for total patients, regular vs new, with detailed patient list below."
            />
          </div>
        </section>

        {/* Quick Reference */}
        <section className="mb-16">
          <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12">
            <h2 className="text-2xl font-bold mb-6">📱 Quick Reference: Page URLs</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { url: '/', desc: 'Landing page with feature overview' },
                { url: '/doctor/setup', desc: 'Clinic registration (4-step wizard)' },
                { url: '/login', desc: 'Sign in page for all users' },
                { url: '/register', desc: 'Alternative registration page' },
                { url: '/doctor/dashboard', desc: 'Doctor dashboard (3 tabs)' },
                { url: '/reception', desc: 'Reception desk interface' },
                { url: '/prescription/print', desc: 'Print prescription (query params)' },
                { url: '/blog', desc: 'Blog homepage' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-white/10 rounded-xl p-4">
                  <code className="text-teal-300 font-mono text-sm">{item.url}</code>
                  <span className="text-slate-300 text-sm">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">❓ Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: 'Can I use the same mobile number for doctor and receptionist?',
                a: 'No, each user must have a unique mobile number as it serves as the login ID.'
              },
              {
                q: 'How do I reset a staff member\'s password?',
                a: 'Currently, contact your system administrator or re-add the staff member with a new password.'
              },
              {
                q: 'Can I customize the prescription template colors?',
                a: 'Choose from 10 pre-designed templates. Custom color selection may be available in future updates.'
              },
              {
                q: 'How often does the queue refresh?',
                a: 'The queue auto-refreshes every 5 seconds to keep data current across all devices.'
              },
              {
                q: 'Is patient data backed up?',
                a: 'Use the Data Export feature in Settings to create regular JSON backups of all patient records.'
              },
            ].map((faq, i) => (
              <div key={i} className="border border-slate-200 rounded-xl p-6">
                <h3 className="font-bold text-slate-800 mb-2">{faq.q}</h3>
                <p className="text-slate-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="text-center py-12 border-t border-slate-200">
          <p className="text-slate-500 mb-4">Ready to get started?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/doctor/setup" 
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors"
            >
              🚀 Register Your Clinic
            </Link>
            <Link 
              href="/login" 
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
            >
              🔐 Sign In
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-12">
        <div className="max-w-4xl mx-auto px-5 text-center">
          <p className="text-slate-400 text-sm">
            © 2026 ClinicSathi. Built for the Indian Subcontinent.
          </p>
          <p className="text-slate-400 text-sm mt-2">
            Questions? Contact us at <a href="/contact" className="text-blue-600 hover:underline">support@clinicsathi.com</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
