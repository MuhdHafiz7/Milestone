export type AssignmentPriority = 'Low' | 'Medium' | 'High'
export type AssignmentStatus = 'Pending' | 'In Progress' | 'Completed'

export interface Assignment {
  id: string
  assignment_name: string
  subject: string
  lecturer: string | null
  due_date: string
  priority: AssignmentPriority
  status: AssignmentStatus
  remarks: string | null
  created_at: string
  updated_at: string
}

export interface AssignmentInput {
  assignment_name: string
  subject: string
  lecturer?: string
  due_date: string
  priority: AssignmentPriority
  status: AssignmentStatus
  remarks?: string
}
