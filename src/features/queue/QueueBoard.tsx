'use client'

import React from 'react'
import { Card, Badge, Button } from '@/components/ui'
import { useQueueSocket } from '@/hooks/useQueueSocket'
import { Users, Clock, ArrowRight, CheckCircle } from 'lucide-react'

interface QueueEntry {
  id: string
  token_number: string
  patient_name: string
  status: 'waiting' | 'consulting' | 'completed' | 'skipped'
  priority: number
}

export function QueueBoard({ clinicId, queue, onSelect }: { clinicId: string, queue: QueueEntry[], onSelect?: (entry: QueueEntry) => void }) {
  // Activate real-time listener
  const { isConnected } = useQueueSocket(clinicId)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'secondary'
      case 'consulting': return 'default'
      case 'completed': return 'outline'
      default: return 'secondary'
    }
  }

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-gray-800">
          <Users size={20} className="text-teal-600" />
          Patient Queue
          {isConnected && (
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse ml-1" title="Live Connected"></span>
          )}
        </div>
        <Badge variant="outline">{queue.length} Total</Badge>
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {queue.map((entry) => (
          <div 
            key={entry.id} 
            className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
              entry.status === 'consulting' 
                ? 'bg-teal-50 border-teal-200 shadow-sm' 
                : 'bg-white border-gray-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                entry.status === 'consulting' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600'
              }`}>
                {entry.token_number}
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">{entry.patient_name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <Badge variant={getStatusColor(entry.status)} className="text-[10px] uppercase">
                    {entry.status}
                  </Badge>
                  {entry.priority > 0 && <span className="text-[10px] text-red-500 font-bold">Priority</span>}
                </div>
              </div>
            </div>

            {entry.status === 'waiting' && (
              <Button size="sm" className="bg-teal-50 hover:bg-teal-100 text-teal-700 h-8 px-3 rounded-lg border border-teal-200 shadow-sm" onClick={() => onSelect?.(entry)}>
                Call <ArrowRight size={14} className="ml-1" />
              </Button>
            )}
            {entry.status === 'consulting' && (
              <CheckCircle size={20} className="text-teal-600 animate-in zoom-in" />
            )}
          </div>
        ))}

        {queue.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <Clock size={32} className="mx-auto mb-2 opacity-20" />
            <p className="text-sm">Queue is empty</p>
          </div>
        )}
      </div>
    </Card>
  )
}
