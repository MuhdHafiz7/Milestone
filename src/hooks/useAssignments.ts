import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

import { assertSupabase, supabase } from '@/services/supabase'
import type { Assignment, AssignmentInput, AssignmentStatus } from '@/types/assignment'

const queryKey = ['assignments']

async function fetchAssignments() {
  const client = assertSupabase()
  const { data, error } = await client
    .from('assignments')
    .select('*')
    .order('due_date', { ascending: true })

  if (error) throw error

  return data as Assignment[]
}

export function useAssignments() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const client = supabase
    if (!client) return

    const channel = client
      .channel('assignments-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'assignments' },
        () => void queryClient.invalidateQueries({ queryKey }),
      )
      .subscribe()

    return () => {
      void client.removeChannel(channel)
    }
  }, [queryClient])

  const assignmentsQuery = useQuery({
    queryKey,
    queryFn: fetchAssignments,
  })

  const createAssignment = useMutation({
    mutationFn: async (input: AssignmentInput) => {
      const client = assertSupabase()
      const payload = {
        ...input,
        lecturer: input.lecturer?.trim() || null,
        remarks: input.remarks?.trim() || null,
      }
      const { error } = await client.from('assignments').insert(payload)
      if (error) throw error
    },
    onSuccess: () => void queryClient.invalidateQueries({ queryKey }),
  })

  const updateAssignment = useMutation({
    mutationFn: async ({ id, input }: { id: string; input: AssignmentInput }) => {
      const client = assertSupabase()
      const payload = {
        ...input,
        lecturer: input.lecturer?.trim() || null,
        remarks: input.remarks?.trim() || null,
      }
      const { error } = await client.from('assignments').update(payload).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => void queryClient.invalidateQueries({ queryKey }),
  })

  const deleteAssignment = useMutation({
    mutationFn: async (id: string) => {
      const client = assertSupabase()
      const { error } = await client.from('assignments').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => void queryClient.invalidateQueries({ queryKey }),
  })

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: AssignmentStatus }) => {
      const client = assertSupabase()
      const { error } = await client.from('assignments').update({ status }).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => void queryClient.invalidateQueries({ queryKey }),
  })

  return {
    ...assignmentsQuery,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    updateStatus,
  }
}
