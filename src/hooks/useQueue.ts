import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/core/query/query-provider';
import { queueApi } from '@/features/queue/api';
import { useQueueStore } from '@/store';
import { syncManager } from '@/lib/sync/sync-manager';
import type { QueueEntryCreate, QueueEntry, QueueStatus } from '@/types';

// ------------------------------------------
// Queue Query Hooks
// ------------------------------------------

/**
 * Hook to fetch queue for a clinic
 */
export function useQueue(clinicId: string, status?: QueueStatus) {
  const { loadQueue, queue } = useQueueStore();

  return useQuery({
    queryKey: queryKeys.queueList(clinicId, status),
    queryFn: async () => {
      await loadQueue(clinicId, status);
      return queue;
    },
    enabled: !!clinicId,
    // Refetch every 5 seconds for real-time updates
    refetchInterval: 5000,
    staleTime: 2000,
  });
}

/**
 * Hook to add a patient to the queue
 */
export function useAddToQueue() {
  const queryClient = useQueryClient();
  const { addToQueue } = useQueueStore();

  return useMutation({
    mutationFn: async (data: QueueEntryCreate) => {
      const entry = await addToQueue(data);
      return entry;
    },
    onSuccess: (data, variables) => {
      // Invalidate queue queries
      queryClient.invalidateQueries({
        queryKey: queryKeys.queueList(variables.clinic_id),
      });
    },
  });
}

/**
 * Hook to update queue entry status
 */
export function useUpdateQueueStatus() {
  const queryClient = useQueryClient();
  const queueStore = useQueueStore();

  return useMutation({
    mutationFn: async ({ 
      entryId, 
      status,
      clinicId 
    }: { 
      entryId: string; 
      status: QueueStatus;
      clinicId: string;
    }) => {
      await queueStore.updateStatus(entryId, status);
    },
    onSuccess: (data, variables) => {
      // Invalidate all queue queries for this clinic
      queryClient.invalidateQueries({
        queryKey: queryKeys.queueList(variables.clinicId),
      });
    },
  });
}

/**
 * Hook to remove from queue
 */
export function useRemoveFromQueue() {
  const queryClient = useQueryClient();
  const { removeFromQueue } = useQueueStore();

  return useMutation({
    mutationFn: async ({ 
      entryId,
      clinicId 
    }: { 
      entryId: string;
      clinicId: string;
    }) => {
      await removeFromQueue(entryId);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.queueList(variables.clinicId),
      });
    },
  });
}

/**
 * Hook for queue with optimistic updates and real-time sync
 */
export function useQueueRealtime(clinicId: string) {
  const queryClient = useQueryClient();
  const { queue, loadQueue, subscribeToQueue } = useQueueStore();

  // Subscribe to real-time updates
  const { data: queueData } = useQuery({
    queryKey: queryKeys.queueList(clinicId),
    queryFn: async () => {
      await loadQueue(clinicId);
      return queue;
    },
    enabled: !!clinicId,
  });

  // Subscribe to WebSocket updates
  if (typeof window !== 'undefined') {
    subscribeToQueue(clinicId, (updatedQueue) => {
      queryClient.setQueryData(
        queryKeys.queueList(clinicId),
        updatedQueue
      );
    });
  }

  // Optimistic add mutation
  const addMutation = useMutation({
    mutationFn: async (data: QueueEntryCreate) => {
      return await syncManager.addToQueue(data);
    },
    onMutate: async (newEntry) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.queueList(clinicId),
      });

      const previousQueue = queryClient.getQueryData<QueueEntry[]>(
        queryKeys.queueList(clinicId)
      );

      const optimisticEntry: QueueEntry = {
        ...newEntry,
        id: `temp-${Date.now()}`,
        token_number: 'PENDING',
        status: 'waiting',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        syncStatus: 'pending',
      };

      queryClient.setQueryData<QueueEntry[]>(
        queryKeys.queueList(clinicId),
        (old) => old ? [...old, optimisticEntry] : [optimisticEntry]
      );

      return { previousQueue };
    },
    onError: (err, newEntry, context) => {
      queryClient.setQueryData(
        queryKeys.queueList(clinicId),
        context?.previousQueue
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.queueList(clinicId),
      });
    },
  });

  return {
    queue: queueData || queue,
    addToQueue: addMutation.mutate,
    isAdding: addMutation.isPending,
  };
}

/**
 * Hook to get current token being served
 */
export function useCurrentToken(clinicId: string) {
  const { currentToken, setCurrentToken } = useQueueStore();

  const { data: inConsultation } = useQuery({
    queryKey: [...queryKeys.queueList(clinicId), 'in-consultation'],
    queryFn: async () => {
      const entries = await queueApi.getQueue(clinicId, 'in_consultation');
      return entries[0] || null;
    },
    enabled: !!clinicId,
    refetchInterval: 3000,
  });

  return {
    currentToken: currentToken || inConsultation,
    setCurrentToken,
  };
}
