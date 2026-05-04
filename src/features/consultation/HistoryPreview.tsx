'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, FileText, Image as ImageIcon, ChevronRight } from 'lucide-react'

interface HistoryItem {
  id: string
  date: string
  diagnosis: string
  hasImages: boolean
  hasReports: boolean
}

interface HistoryPreviewProps {
  patientId: string
  history: HistoryItem[]
  onSelectVisit: (visitId: string) => void
}

export function HistoryPreview({ patientId, history, onSelectVisit }: HistoryPreviewProps) {
  if (!history || history.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed">
        No previous history found for this patient.
      </div>
    )
  }

  return (
    <div className="w-full space-y-3 mt-4">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Calendar size={16} className="text-teal-600" />
          Recent Visits
        </h3>
        <button className="text-xs text-teal-600 hover:underline flex items-center">
          View All <ChevronRight size={12} />
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {history.map((item) => (
          <Card 
            key={item.id}
            onClick={() => onSelectVisit(item.id)}
            className="flex-shrink-0 w-40 p-3 cursor-pointer hover:border-teal-500 hover:shadow-sm transition-all border-gray-100 bg-white"
          >
            <div className="flex flex-col h-full justify-between gap-2">
              <div>
                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                  {item.date}
                </p>
                <p className="text-sm font-semibold text-gray-800 line-clamp-1 mt-0.5">
                  {item.diagnosis}
                </p>
              </div>
              
              <div className="flex items-center gap-2 mt-1">
                {item.hasImages && (
                  <div title="Prescription available" className="bg-blue-50 p-1 rounded">
                    <FileText size={12} className="text-blue-600" />
                  </div>
                )}
                {item.hasReports && (
                  <div title="Reports available" className="bg-orange-50 p-1 rounded">
                    <ImageIcon size={12} className="text-orange-600" />
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
