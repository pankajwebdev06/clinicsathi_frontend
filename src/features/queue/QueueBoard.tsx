'use client'

import React from 'react'
import { Card, Badge, Button } from '@/components/ui'
import { Users, Clock, ArrowRight, CheckCircle } from 'lucide-react'

interface QueueEntry {
  id: string
  token_number: string
  patient_name: string
  status: 'waiting' | 'consulting' | 'completed' | 'skipped' | 'cancelled' | 'in_consultation'
  priority: number
}

export function QueueBoard({ clinicId, queue, onSelect, isConnected }: { clinicId: string, queue: QueueEntry[], onSelect?: (entry: QueueEntry) => void, isConnected?: boolean }) {

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
            className={`group relative flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${
              entry.status === 'consulting' 
                ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-md transform scale-[1.02]' 
                : 'bg-white border-slate-100 hover:border-blue-200 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm shadow-sm transition-colors duration-300 ${
                entry.status === 'consulting' ? 'bg-blue-600 text-white shadow-blue-600/30' : 'bg-slate-100 text-slate-700 group-hover:bg-blue-100 group-hover:text-blue-700'
              }`}>
                {entry.token_number}
              </div>
              <div>
                <p className={`font-bold text-base ${entry.status === 'consulting' ? 'text-blue-900' : 'text-slate-800'}`}>
                  {entry.patient_name}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={getStatusColor(entry.status)} className="text-[10px] uppercase font-bold tracking-wider">
                    {entry.status.replace('_', ' ')}
                  </Badge>
                  {entry.priority > 0 && <span className="text-[10px] px-2 py-0.5 rounded-md bg-red-100 text-red-700 font-bold uppercase tracking-wider">Priority</span>}
                </div>
              </div>
            </div>

            {entry.status !== 'consulting' && entry.status !== 'in_consultation' && (
              <Button size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-600 h-9 px-4 rounded-xl border border-blue-100 font-semibold shadow-sm" onClick={() => onSelect?.(entry)}>
                {entry.status === 'waiting' ? 'Call' : 'Recall'} <ArrowRight size={14} className="ml-1.5" />
              </Button>
            )}
            {entry.status === 'consulting' && (
              <div className="bg-white p-2 rounded-full shadow-sm">
                <CheckCircle size={24} className="text-blue-600 animate-in zoom-in" />
              </div>
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
