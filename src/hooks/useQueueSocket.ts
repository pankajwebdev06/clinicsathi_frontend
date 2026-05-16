'use client'

import { useEffect, useState } from 'react'

export function useQueueSocket(clinicId?: string, onUpdate?: () => void) {
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // WebSocket functionality is currently disabled because the backend does not have 
    // the 'websockets' library installed. 
    // The application is using high-performance Cache Polling instead.
    setIsConnected(false)
  }, [clinicId, onUpdate])

  return { isConnected }
}
