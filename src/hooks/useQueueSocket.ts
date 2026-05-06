'use client'

import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

export function useQueueSocket(clinicId: string) {
  const [isConnected, setIsConnected] = useState(false)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!clinicId) return

    // Use the backend host from environment variables
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";
    const host = apiUrl.replace(/^https?:\/\//, '').split('/')[0];
    const protocol = apiUrl.startsWith('https') ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${host}/api/v1/queue/ws/${clinicId}`;
    
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
