'use client'

import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

export function useQueueSocket(clinicId: string) {
  const [isConnected, setIsConnected] = useState(false)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!clinicId) return

    // In production, use your actual domain
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const wsUrl = `${protocol}//${window.location.host}/api/v1/queue/ws/${clinicId}`
    
    const socket = new WebSocket(wsUrl)

    socket.onopen = () => {
      console.log('WebSocket Connected to Queue')
      setIsConnected(true)
    }

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.event === 'QUEUE_UPDATED') {
        // Automatically refresh the queue list in the UI
        queryClient.invalidateQueries({ queryKey: ['queue', clinicId] })
        
        // Optional: Show a small toast notification
        console.log('Queue Updated:', data.message)
      }
    }

    socket.onclose = () => {
      console.log('WebSocket Disconnected')
      setIsConnected(false)
      // Optional: Implement auto-reconnect logic here
    }

    return () => {
      socket.close()
    }
  }, [clinicId, queryClient])

  return { isConnected }
}
