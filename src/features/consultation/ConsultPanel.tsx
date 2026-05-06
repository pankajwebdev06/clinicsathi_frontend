import React, { useState, useEffect } from 'react'
import { Card, Button, Badge } from '@/components/ui'
import { HistoryPreview } from './HistoryPreview'
import { VisitDetailModal } from './VisitDetailModal'
import { consultationApi } from './api'
import { queueApi } from '@/features/queue/api'

export function ConsultPanel({ patientId, queueId, onActionComplete }: { patientId: string, queueId?: string, onActionComplete?: () => void }) {
  const [selectedVisitId, setSelectedVisitId] = useState<string | null>(null)
  const [history, setHistory] = useState<any[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

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
    <div className="max-w-4xl mx-auto p-4 space-y-6 pb-24">
      {/* 1. Patient Header */}
      <Card className="p-6 bg-gradient-to-br from-teal-600 to-teal-700 text-white border-none shadow-lg">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">Consultation View</h2>
            <p className="text-teal-100">Patient ID: {patientId}</p>
          </div>
          <Badge className="bg-white/20 text-white border-none">Active Visit</Badge>
        </div>
        <p className="mt-4 text-teal-50 text-sm">Review patient details below. Write your prescription on the printed form. Once finished, click "Done" to send the patient back to reception for document upload.</p>
      </Card>
      
      {/* 2. History Preview */}
      <section className="space-y-4">
        <HistoryPreview 
          patientId={patientId} 
          history={history.map(h => ({
            id: h.id,
            date: new Date(h.created_at).toLocaleDateString(),
            diagnosis: h.diagnosis || 'Handwritten Prescription',
            hasImages: !!h.handwritten_prescription_url,
            hasReports: h.reports && JSON.parse(h.reports).length > 0
          }))} 
          onSelectVisit={(id) => setSelectedVisitId(id)} 
        />
      </section>

      {/* 3. Action Buttons (Doctor Controls) */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t">
        <div className="max-w-4xl mx-auto flex gap-3">
          <button
            onClick={() => handleAction('completed')}
            disabled={isProcessing}
            className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-bold shadow-md shadow-emerald-600/20 transition-all active:scale-[0.98] flex flex-col items-center gap-0.5">
            <span className="text-xl">✅</span>
            <span>Done</span>
          </button>
          <button
            onClick={() => handleAction('skipped')}
            disabled={isProcessing}
            className="flex-1 py-4 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white rounded-xl font-bold shadow-md shadow-amber-500/20 transition-all active:scale-[0.98] flex flex-col items-center gap-0.5">
            <span className="text-xl">⏭️</span>
            <span>Skip</span>
          </button>
          <button
            onClick={() => handleAction('cancelled')}
            disabled={isProcessing}
            className="flex-1 py-4 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white rounded-xl font-bold shadow-md shadow-red-500/20 transition-all active:scale-[0.98] flex flex-col items-center gap-0.5">
            <span className="text-xl">❌</span>
            <span>Cancel</span>
          </button>
        </div>
      </div>

      {/* Modal for viewing history detail */}
      <VisitDetailModal 
        isOpen={!!selectedVisitId} 
        onClose={() => setSelectedVisitId(null)}
        visitData={selectedVisitId && history.find(h => h.id === selectedVisitId) ? {
          id: selectedVisitId,
          date: new Date(history.find(h => h.id === selectedVisitId)!.created_at).toLocaleDateString(),
          diagnosis: history.find(h => h.id === selectedVisitId)!.diagnosis || 'Handwritten Prescription',
          doctorNotes: history.find(h => h.id === selectedVisitId)!.doctor_notes || '',
          prescriptionUrl: history.find(h => h.id === selectedVisitId)!.handwritten_prescription_url || ''
        } : null}
      />
    </div>
  )
}
