export type AssignmentPriority = 'Low' | 'Medium' | 'High'
export type AssignmentStatus = 'Pending' | 'In Progress' | 'Completed'

export interface Assignment {
  id: string
  assignment_name: string
  subject: string
  due_date: string
  priority: AssignmentPriority
  status: AssignmentStatus
}

export interface AssignmentInput {
  assignment_name: string
  subject: string
  due_date: string
  priority: AssignmentPriority
  status: AssignmentStatus
}
