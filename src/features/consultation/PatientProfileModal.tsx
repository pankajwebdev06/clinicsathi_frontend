'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Calendar, FileText, Image as ImageIcon, X, ZoomIn, Phone, User as UserIcon } from 'lucide-react'

interface RawVisit {
  id: string
  created_at: string
  diagnosis?: string | null
  doctor_notes?: string | null
  chief_complaints?: string | null
  handwritten_prescription_url?: string | null
  reports?: string | null   // JSON string of URL[]
}

interface PatientInfo {
  name: string
  age: number | string
  gender: 'M' | 'F' | 'O' | string
  mobile: string
}

interface PatientProfileModalProps {
  isOpen: boolean
  onClose: () => void
  patient: PatientInfo | null
  visits: RawVisit[]
}

function parseReports(raw?: string | null): string[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter(Boolean) : []
  } catch { return [] }
}

function formatDate(s: string): string {
  try {
    return new Date(s).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch { return s }
}

function genderLabel(g: string): string {
  return g === 'M' ? 'Male' : g === 'F' ? 'Female' : g === 'O' ? 'Other' : '—'
}

export function PatientProfileModal({ isOpen, onClose, patient, visits }: PatientProfileModalProps) {
  const [zoomImage, setZoomImage] = useState<string | null>(null)

  if (!patient) return null

  // Roll-up stats across all visits
  const totalVisits = visits.length
  const allPrescriptions = visits.filter(v => !!v.handwritten_prescription_url).map(v => ({
    url: v.handwritten_prescription_url!,
    date: v.created_at,
    diagnosis: v.diagnosis || 'Handwritten prescription',
  }))
  const allReports = visits.flatMap(v => parseReports(v.reports).map(url => ({
    url,
    date: v.created_at,
    diagnosis: v.diagnosis || 'Report',
  })))
  const firstVisit = visits.length > 0 ? visits[visits.length - 1].created_at : null
  const lastVisit = visits.length > 0 ? visits[0].created_at : null

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto p-0 gap-0">
          {/* ── HEADER — patient identity always visible ── */}
          <div className="sticky top-0 z-10 bg-gradient-to-br from-teal-600 to-teal-700 text-white p-5 md:p-6 rounded-t-xl">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-2xl md:text-3xl flex-shrink-0">
                  {patient.gender === 'F' ? '👩' : patient.gender === 'M' ? '👨' : '🧑'}
                </div>
                <div className="min-w-0">
                  <h2 className="text-xl md:text-2xl font-black leading-tight truncate">{patient.name}</h2>
                  <div className="flex items-center gap-2 text-teal-50 text-xs md:text-sm mt-1 flex-wrap">
                    <span>{patient.age} yrs</span>
                    <span className="opacity-50">•</span>
                    <span>{genderLabel(String(patient.gender))}</span>
                    <span className="opacity-50">•</span>
                    <span className="inline-flex items-center gap-1"><Phone size={11} />+91 {patient.mobile}</span>
                  </div>
                </div>
              </div>
              <button onClick={onClose} className="flex-shrink-0 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-2 md:gap-3 mt-4">
              <Stat label="Visits"        value={totalVisits} />
              <Stat label="Prescriptions" value={allPrescriptions.length} />
              <Stat label="Reports"       value={allReports.length} />
            </div>

            {(firstVisit || lastVisit) && (
              <div className="mt-3 text-[10px] md:text-xs text-teal-100 flex items-center gap-3 flex-wrap">
                {firstVisit && <span>First visit: <strong className="text-white">{formatDate(firstVisit)}</strong></span>}
                {lastVisit && firstVisit !== lastVisit && <span>Last visit: <strong className="text-white">{formatDate(lastVisit)}</strong></span>}
              </div>
            )}
          </div>

          <div className="p-5 md:p-6 space-y-6">
            {/* ── ALL PRESCRIPTIONS — gallery ── */}
            {allPrescriptions.length > 0 && (
              <section>
                <SectionHeader icon={<FileText size={14} />} title="All Prescriptions" count={allPrescriptions.length} />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                  {allPrescriptions.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => setZoomImage(p.url)}
                      className="group relative bg-slate-100 rounded-xl overflow-hidden border border-slate-200 aspect-[3/4] hover:shadow-md transition-shadow text-left"
                    >
                      <img src={p.url} alt={`Prescription from ${formatDate(p.date)}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-2">
                        <p className="text-white text-[10px] font-bold truncate">{formatDate(p.date)}</p>
                        <p className="text-white/80 text-[9px] truncate">{p.diagnosis}</p>
                      </div>
                      <div className="absolute top-2 right-2 bg-white/90 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ZoomIn size={12} className="text-slate-700" />
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* ── ALL REPORTS — gallery ── */}
            {allReports.length > 0 && (
              <section>
                <SectionHeader icon={<ImageIcon size={14} />} title="Lab Reports & Documents" count={allReports.length} />
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-3 mt-3">
                  {allReports.map((r, i) => (
                    <button
                      key={i}
                      onClick={() => setZoomImage(r.url)}
                      className="group relative bg-slate-100 rounded-lg overflow-hidden border border-slate-200 aspect-square hover:shadow-md transition-shadow"
                    >
                      <img src={r.url} alt={`Report from ${formatDate(r.date)}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-x-0 bottom-0 bg-black/60 p-1">
                        <p className="text-white text-[9px] font-bold truncate text-center">{formatDate(r.date)}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* ── VISIT TIMELINE — chronological list ── */}
            <section>
              <SectionHeader icon={<Calendar size={14} />} title="Visit Timeline" count={totalVisits} />
              {visits.length === 0 ? (
                <p className="text-sm text-slate-400 italic mt-3 p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center">
                  No previous visits recorded.
                </p>
              ) : (
                <ol className="mt-3 space-y-3 relative">
                  <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-slate-200" />
                  {visits.map((v, idx) => {
                    const reports = parseReports(v.reports)
                    return (
                      <li key={v.id} className="relative pl-10">
                        <span className={`absolute left-0 top-1 w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black border-2 border-white shadow ${
                          idx === 0 ? 'bg-teal-600 text-white' : 'bg-white text-slate-600 border-slate-200'
                        }`}>{visits.length - idx}</span>
                        <div className="bg-white border border-slate-200 rounded-xl p-3 md:p-4">
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <p className="font-bold text-slate-900 text-sm md:text-base leading-tight">
                              {v.diagnosis || 'Handwritten consultation'}
                            </p>
                            <span className="flex-shrink-0 text-[10px] text-slate-500 font-semibold whitespace-nowrap">{formatDate(v.created_at)}</span>
                          </div>
                          {v.chief_complaints && (
                            <p className="text-xs text-slate-600 mb-2">
                              <span className="font-semibold text-slate-700">Complaints:</span> {v.chief_complaints}
                            </p>
                          )}
                          {v.doctor_notes && (
                            <p className="text-xs md:text-sm text-slate-700 bg-slate-50 rounded-lg p-2 mt-2 italic leading-relaxed">
                              "{v.doctor_notes}"
                            </p>
                          )}
                          {(v.handwritten_prescription_url || reports.length > 0) && (
                            <div className="flex items-center gap-2 mt-3 flex-wrap">
                              {v.handwritten_prescription_url && (
                                <button
                                  onClick={() => setZoomImage(v.handwritten_prescription_url!)}
                                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-md"
                                >
                                  <FileText size={11} /> View Rx
                                </button>
                              )}
                              {reports.length > 0 && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-orange-700 bg-orange-50 px-2 py-1 rounded-md">
                                  <ImageIcon size={11} /> {reports.length} report{reports.length === 1 ? '' : 's'}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </li>
                    )
                  })}
                </ol>
              )}
            </section>
          </div>
        </DialogContent>
      </Dialog>

      {/* Full-screen image zoom — separate stacked dialog */}
      {zoomImage && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setZoomImage(null)}
        >
          <button
            onClick={(e) => { e.stopPropagation(); setZoomImage(null); }}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center"
          >
            <X size={20} />
          </button>
          <img src={zoomImage} alt="Zoom" className="max-w-full max-h-full object-contain rounded-lg" />
        </div>
      )}
    </>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white/15 backdrop-blur rounded-xl p-2 md:p-3 text-center">
      <div className="text-xl md:text-2xl font-black leading-none">{value}</div>
      <div className="text-[9px] md:text-[10px] uppercase tracking-wider opacity-80 font-bold mt-1">{label}</div>
    </div>
  )
}

function SectionHeader({ icon, title, count }: { icon: React.ReactNode; title: string; count: number }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
      <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
        <span className="text-teal-600">{icon}</span>
        {title}
      </h4>
      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{count}</span>
    </div>
  )
}
