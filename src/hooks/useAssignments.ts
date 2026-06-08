import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createClient } from 'graphql-ws'
import { useEffect } from 'react'

import { assertNhost, nhost } from '@/services/nhost'
import type { Assignment, AssignmentInput, AssignmentStatus } from '@/types/assignment'

const queryKey = ['assignments']

const ASSIGNMENTS_QUERY = `
  query GetAssignments {
    assignments(order_by: { due_date: asc }) {
      id
      assignment_name
      subject
      due_date
      priority
      status
    }
  }
`

const ASSIGNMENTS_SUBSCRIPTION = `
  subscription GetAssignments {
    assignments(order_by: { due_date: asc }) {
      id
      assignment_name
      subject
      due_date
      priority
      status
    }
  }
`

const CREATE_MUTATION = `
  mutation CreateAssignment($object: assignments_insert_input!) {
    insert_assignments_one(object: $object) {
      id
    }
  }
`

const UPDATE_MUTATION = `
  mutation UpdateAssignment($id: uuid!, $object: assignments_set_input!) {
    update_assignments_by_pk(pk_columns: { id: $id }, _set: $object) {
      id
    }
  }
`

const DELETE_MUTATION = `
  mutation DeleteAssignment($id: uuid!) {
    delete_assignments_by_pk(id: $id) {
      id
    }
  }
`

const UPDATE_STATUS_MUTATION = `
  mutation UpdateStatus($id: uuid!, $status: String!) {
    update_assignments_by_pk(pk_columns: { id: $id }, _set: { status: $status }) {
      id
    }
  }
`

async function fetchAssignments() {
  const client = assertNhost()
  const { data, error } = await client.graphql.request(ASSIGNMENTS_QUERY)
  if (error) throw error
  return data.assignments as Assignment[]
}

export function useAssignments() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const client = nhost
    if (!client) return

    const wsClient = createClient({ url: client.graphql.wsUrl })

    const unsubscribe = wsClient.subscribe(
      { query: ASSIGNMENTS_SUBSCRIPTION },
      {
        next() {
          void queryClient.invalidateQueries({ queryKey })
        },
        error(err: unknown) {
          console.error('Nhost subscription error:', err)
        },
        complete() {
          // subscription completed
        },
      },
    )

    return () => {
      unsubscribe()
      wsClient.dispose()
    }
  }, [queryClient])

  const assignmentsQuery = useQuery({
    queryKey,
    queryFn: fetchAssignments,
  })

  const createAssignment = useMutation({
    mutationFn: async (input: AssignmentInput) => {
      const client = assertNhost()
      const object = {
        assignment_name: input.assignment_name,
        subject: input.subject,
        due_date: input.due_date,
        priority: input.priority,
        status: input.status,
      }
      const { error } = await client.graphql.request(CREATE_MUTATION, { object })
      if (error) throw error
    },
    onSuccess: () => void queryClient.invalidateQueries({ queryKey }),
  })

  const updateAssignment = useMutation({
    mutationFn: async ({ id, input }: { id: string; input: AssignmentInput }) => {
      const client = assertNhost()
      const object = {
        assignment_name: input.assignment_name,
        subject: input.subject,
        due_date: input.due_date,
        priority: input.priority,
        status: input.status,
      }
      const { error } = await client.graphql.request(UPDATE_MUTATION, { id, object })
      if (error) throw error
    },
    onSuccess: () => void queryClient.invalidateQueries({ queryKey }),
  })

  const deleteAssignment = useMutation({
    mutationFn: async (id: string) => {
      const client = assertNhost()
      const { error } = await client.graphql.request(DELETE_MUTATION, { id })
      if (error) throw error
    },
    onSuccess: () => void queryClient.invalidateQueries({ queryKey }),
  })

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: AssignmentStatus }) => {
      const client = assertNhost()
      const { error } = await client.graphql.request(UPDATE_STATUS_MUTATION, { id, status })
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
