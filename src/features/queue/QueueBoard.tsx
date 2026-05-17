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

      <div className="space-y-2 max-h-[50vh] md:max-h-[500px] overflow-y-auto pr-1 md:pr-2">
        {queue.map((entry) => {
          const isActive = entry.status === 'consulting' || entry.status === 'in_consultation';
          return (
            <div
              key={entry.id}
              onClick={() => !isActive && onSelect?.(entry)}
              className={`relative flex items-center justify-between p-3 md:p-4 rounded-2xl border transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-md'
                  : 'bg-white border-slate-100 active:bg-slate-50 cursor-pointer hover:border-blue-200 hover:shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className={`w-11 h-11 flex-shrink-0 rounded-xl flex items-center justify-center font-black text-sm shadow-sm transition-colors duration-300 ${
                  isActive ? 'bg-blue-600 text-white shadow-blue-600/30' : 'bg-slate-100 text-slate-700'
                }`}>
                  {entry.token_number}
                </div>
                <div className="min-w-0">
                  <p className={`font-bold text-sm md:text-base truncate ${isActive ? 'text-blue-900' : 'text-slate-800'}`}>
                    {entry.patient_name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge variant={getStatusColor(entry.status)} className="text-[10px] uppercase font-bold tracking-wider">
                      {entry.status.replace('_', ' ')}
                    </Badge>
                    {entry.priority > 0 && <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-red-100 text-red-700 font-bold uppercase tracking-wider">Priority</span>}
                  </div>
                </div>
              </div>

              {!isActive && (
                <Button
                  size="sm"
                  className="flex-shrink-0 ml-2 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-600 h-9 px-3 rounded-xl border border-blue-100 font-semibold shadow-sm transition-all"
                  onClick={(e) => { e.stopPropagation(); onSelect?.(entry); }}
                >
                  {entry.status === 'waiting' ? 'Call' : 'Recall'} <ArrowRight size={13} className="ml-1" />
                </Button>
              )}
              {isActive && (
                <div className="flex-shrink-0 bg-white p-1.5 rounded-full shadow-sm ml-2">
                  <CheckCircle size={22} className="text-blue-600" />
                </div>
              )}
            </div>
          );
        })}

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
