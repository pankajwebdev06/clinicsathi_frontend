import React, { useState, useEffect } from 'react'
import { Card, Badge } from '@/components/ui'
import { HistoryPreview } from './HistoryPreview'
import { PatientProfileModal } from './PatientProfileModal'
import { consultationApi } from './api'
import { queueApi } from '@/features/queue/api'
import { FileText, ImageIcon, FolderOpen } from 'lucide-react'

export function ConsultPanel({ patient, onActionComplete }: { patient: any, onActionComplete?: () => void }) {
  const patientId = patient?.patientId || '';
  const queueId = patient?.id || '';
  const [profileOpen, setProfileOpen] = useState(false)
  const [history, setHistory] = useState<any[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  // Quick aggregate for the "Open Profile" button label
  const totalAttachments = history.reduce((acc: number, h: any) => {
    let n = h.handwritten_prescription_url ? 1 : 0
    try { n += JSON.parse(h.reports || '[]').length } catch { /* ignore */ }
    return acc + n
  }, 0)

  useEffect(() => {
    if (patientId) {
      consultationApi.getPatientHistory(patientId)
        .then(data => setHistory(data))
        .catch(err => console.error("Failed to load history", err));
    }
  }, [patientId]);

  const handleAction = async (status: string) => {
    if (!queueId) return;
    setIsProcessing(true);
    try {
      await queueApi.updateQueueEntry(queueId, { status });
      // In a real app, you might also create an empty consultation record here
      // just to link the future uploaded prescription to this visit date.
      if (onActionComplete) onActionComplete();
    } catch (error) {
      console.error("Action failed", error);
      alert("Failed to update status");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full mx-auto space-y-4">
      {/* 1. Patient Header */}
      <Card className="p-5 bg-gradient-to-br from-teal-600 to-teal-700 text-white border-none shadow-md rounded-2xl">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold">Consultation View</h2>
            <p className="text-teal-100 text-xs mt-0.5">Token: {patient?.token} • ID: {patientId}</p>
          </div>
          <Badge className="bg-white/20 text-white border-none text-xs">Active Visit</Badge>
        </div>
        
        <div className="mt-4 bg-white/10 rounded-xl p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-teal-100 text-[10px] font-bold uppercase tracking-wider mb-1">Patient</p>
              <p className="font-bold text-lg leading-tight">{patient?.name}</p>
              <p className="text-teal-50 text-xs mt-0.5">{patient?.age} yrs • {patient?.gender === 'M' ? 'Male' : patient?.gender === 'F' ? 'Female' : 'Other'} • +91 {patient?.mobile}</p>
            </div>
            <div>
              <p className="text-teal-100 text-[10px] font-bold uppercase tracking-wider mb-1">Chief Complaint</p>
              <p className="font-medium text-sm text-white">{patient?.symptoms || 'No specific symptoms recorded.'}</p>
            </div>
          </div>
          {(patient?.bp || patient?.weight || patient?.temperature || patient?.pulse) && (
            <div className="mt-4 pt-4 border-t border-teal-500/30 grid grid-cols-4 gap-2 text-center">
              {patient.bp && <div><p className="text-teal-200 text-[9px] font-bold uppercase tracking-wider">BP</p><p className="font-semibold text-sm">{patient.bp}</p></div>}
              {patient.weight && <div><p className="text-teal-200 text-[9px] font-bold uppercase tracking-wider">Weight</p><p className="font-semibold text-sm">{patient.weight}</p></div>}
              {patient.temperature && <div><p className="text-teal-200 text-[9px] font-bold uppercase tracking-wider">Temp</p><p className="font-semibold text-sm">{patient.temperature}</p></div>}
              {patient.pulse && <div><p className="text-teal-200 text-[9px] font-bold uppercase tracking-wider">Pulse</p><p className="font-semibold text-sm">{patient.pulse}</p></div>}
            </div>
          )}
        </div>
      </Card>
      
      {/* 2. Patient Profile — full history button (only when there's something) */}
      {history.length > 0 && (
        <button
          onClick={() => setProfileOpen(true)}
          className="w-full flex items-center justify-between gap-3 p-4 bg-gradient-to-r from-teal-50 to-blue-50 border-2 border-teal-200 hover:border-teal-400 rounded-2xl transition-all text-left active:scale-[0.99]"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-teal-600 text-white flex items-center justify-center">
              <FolderOpen size={20} />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-slate-900 text-sm leading-tight">Open Patient Profile</p>
              <p className="text-xs text-slate-600 mt-0.5">
                {history.length} visit{history.length === 1 ? '' : 's'}
                {totalAttachments > 0 && ` • ${totalAttachments} attachment${totalAttachments === 1 ? '' : 's'}`}
              </p>
            </div>
          </div>
          <span className="flex-shrink-0 text-teal-700 text-sm font-bold">View →</span>
        </button>
      )}

      {/* 3. History Preview strip (kept for quick glance) */}
      <section className="space-y-3">
        <HistoryPreview
          patientId={patientId}
          history={history.map(h => ({
            id: h.id,
            date: new Date(h.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
            diagnosis: h.diagnosis || 'Handwritten Prescription',
            hasImages: !!h.handwritten_prescription_url,
            hasReports: !!(h.reports && JSON.parse(h.reports || '[]').length > 0)
          }))}
          onSelectVisit={() => setProfileOpen(true)}
        />
      </section>

      {/* 3. Action Buttons (Doctor Controls) */}
      <div className="mt-2 p-3 bg-white rounded-xl shadow-sm border border-slate-100 flex gap-2">
        <button
          onClick={() => handleAction('completed')}
          disabled={isProcessing}
          className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg font-bold text-sm shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-1.5">
          <span>✅</span>
          <span>Done</span>
        </button>
        <button
          onClick={() => handleAction('skipped')}
          disabled={isProcessing}
          className="flex-1 py-2 px-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white rounded-lg font-bold text-sm shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-1.5">
          <span>⏭️</span>
          <span>Skip</span>
        </button>
        <button
          onClick={() => handleAction('cancelled')}
          disabled={isProcessing}
          className="flex-1 py-2 px-3 bg-slate-100 hover:bg-red-50 hover:text-red-600 disabled:opacity-50 text-slate-600 rounded-lg font-bold text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-1.5">
          <span>❌</span>
          <span>Cancel</span>
        </button>
      </div>

      {/* Full patient profile — all visits, all prescriptions, all reports, timeline */}
      <PatientProfileModal
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        patient={patient ? {
          name: patient.name,
          age: patient.age,
          gender: patient.gender,
          mobile: patient.mobile,
        } : null}
        visits={history}
      />
    </div>
  )
}
