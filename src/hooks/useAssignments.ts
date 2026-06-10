import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createClient } from 'graphql-ws'
import { useEffect } from 'react'

import { assertNhost, nhost } from '@/services/nhost'
import { checkAndNotify } from '@/services/notifications'
import type { Assignment, AssignmentInput, AssignmentStatus, Subject } from '@/types/assignment'

const queryKey = ['assignments']
const subjectsKey = ['subjects']

const ASSIGNMENTS_QUERY = `
  query GetAssignments {
    assignments(order_by: { due_date: asc }) {
      id
      assignment_name
      subject_id
      due_date
      priority
      status
      remarks
      subject {
        id
        name
        color
      }
    }
  }
`

const ASSIGNMENTS_SUBSCRIPTION = `
  subscription GetAssignments {
    assignments(order_by: { due_date: asc }) {
      id
      assignment_name
      subject_id
      due_date
      priority
      status
      remarks
      subject {
        id
        name
        color
      }
    }
  }
`

const SUBJECTS_QUERY = `
  query GetSubjects {
    subjects(order_by: { name: asc }) {
      id
      name
      color
    }
  }
`

const SUBJECTS_SUBSCRIPTION = `
  subscription GetSubjects {
    subjects(order_by: { name: asc }) {
      id
      name
      color
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

async function fetchSubjects() {
  const client = assertNhost()
  const { data, error } = await client.graphql.request(SUBJECTS_QUERY)
  if (error) throw error
  return data.subjects as Subject[]
}

export function useAssignments() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const client = nhost
    if (!client) return

    const wsClient = createClient({ url: client.graphql.wsUrl })

    const unsubscribeAssignments = wsClient.subscribe(
      { query: ASSIGNMENTS_SUBSCRIPTION },
      {
        next() {
          void queryClient.invalidateQueries({ queryKey })
        },
        error(err: unknown) {
          console.error('Nhost assignments subscription error:', err)
        },
        complete() {
          // subscription completed
        },
      },
    )

    const unsubscribeSubjects = wsClient.subscribe(
      { query: SUBJECTS_SUBSCRIPTION },
      {
        next() {
          void queryClient.invalidateQueries({ queryKey: subjectsKey })
        },
        error(err: unknown) {
          console.error('Nhost subjects subscription error:', err)
        },
        complete() {
          // subscription completed
        },
      },
    )

    return () => {
      unsubscribeAssignments()
      unsubscribeSubjects()
      wsClient.dispose()
    }
  }, [queryClient])

  const assignmentsQuery = useQuery({
    queryKey,
    queryFn: fetchAssignments,
  })

  const subjectsQuery = useQuery({
    queryKey: subjectsKey,
    queryFn: fetchSubjects,
  })

  useEffect(() => {
    if (assignmentsQuery.data) {
      checkAndNotify(assignmentsQuery.data)
    }
  }, [assignmentsQuery.data])

  useEffect(() => {
    const interval = setInterval(() => {
      if (assignmentsQuery.data) {
        checkAndNotify(assignmentsQuery.data)
      }
    }, 60 * 60 * 1000)
    return () => clearInterval(interval)
  }, [assignmentsQuery.data])

  // Auto-complete overdue assignments
  useEffect(() => {
    if (!assignmentsQuery.data) return
    
    const interval = setInterval(async () => {
      const client = assertNhost()
      
      const overdueAssignments = assignmentsQuery.data.filter(
        a => a.status !== 'Completed' && new Date(a.due_date) < new Date()
      )
      
      for (const assignment of overdueAssignments) {
        try {
          await client.graphql.request(
            `mutation UpdateStatus($id: uuid!, $status: String!) {
              update_assignments_by_pk(pk_columns: { id: $id }, _set: { status: $status }) { id }
            }`,
            { id: assignment.id, status: 'Completed' }
          )
        } catch (err) {
          console.error('Failed to auto-complete assignment:', err)
        }
      }
      
      if (overdueAssignments.length > 0) {
        queryClient.invalidateQueries({ queryKey })
      }
    }, 60 * 60 * 1000) // Check every hour
    
    return () => clearInterval(interval)
  }, [assignmentsQuery.data, queryClient])

  const createAssignment = useMutation({
    mutationFn: async (input: AssignmentInput) => {
      const client = assertNhost()
      const object = {
        assignment_name: input.assignment_name,
        subject_id: input.subject_id,
        due_date: input.due_date,
        priority: input.priority,
        status: input.status,
        remarks: input.remarks ?? '',
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
        subject_id: input.subject_id,
        due_date: input.due_date,
        priority: input.priority,
        status: input.status,
        remarks: input.remarks ?? '',
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
    subjects: subjectsQuery.data ?? [],
    createAssignment,
    updateAssignment,
    deleteAssignment,
    updateStatus,
  }
}