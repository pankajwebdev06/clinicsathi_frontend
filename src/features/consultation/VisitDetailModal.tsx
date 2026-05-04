'use client'

import React from 'react'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Calendar, User, FileText, Activity } from 'lucide-react'

interface VisitDetailModalProps {
  isOpen: boolean
  onClose: () => void
  visitData: {
    id: string
    date: string
    diagnosis: string
    doctorNotes: string
    prescriptionUrl?: string
    reportUrls?: string[]
  } | null
}

export function VisitDetailModal({ isOpen, onClose, visitData }: VisitDetailModalProps) {
  if (!visitData) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 text-teal-600 mb-1">
            <Calendar size={18} />
            <span className="text-sm font-semibold">{visitData.date}</span>
          </div>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Visit Summary: {visitData.diagnosis}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Notes Section */}
          <section className="space-y-2">
            <h4 className="text-sm font-bold text-gray-500 uppercase flex items-center gap-2">
              <FileText size={14} /> Doctor's Notes
            </h4>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 italic text-gray-700">
              {visitData.doctorNotes || "No notes recorded for this visit."}
            </div>
          </section>

          {/* Attachments Section */}
          <section className="space-y-4">
            <h4 className="text-sm font-bold text-gray-500 uppercase flex items-center gap-2">
              <Activity size={14} /> Attachments & Reports
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Handwritten Prescription */}
              {visitData.prescriptionUrl && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-600">Handwritten Prescription</p>
                  <div className="relative group overflow-hidden rounded-xl border shadow-sm">
                    <img 
                      src={visitData.prescriptionUrl} 
                      alt="Prescription" 
                      className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button className="bg-white text-gray-900 px-3 py-1 rounded-full text-xs font-bold">
                        Click to Zoom
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Lab Reports */}
              {visitData.reportUrls && visitData.reportUrls.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-600">Lab Reports ({visitData.reportUrls.length})</p>
                  <div className="grid grid-cols-2 gap-2">
                    {visitData.reportUrls.map((url, index) => (
                      <div key={index} className="relative group overflow-hidden rounded-lg border shadow-sm h-20">
                        <img 
                          src={url} 
                          alt={`Report ${index + 1}`} 
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {!visitData.prescriptionUrl && (!visitData.reportUrls || visitData.reportUrls.length === 0) && (
              <p className="text-sm text-gray-400 italic">No digital attachments found.</p>
            )}
          </section>
        </div>
      </DialogContent>
    </Dialog>
  )
}
