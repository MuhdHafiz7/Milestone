export type AssignmentPriority = 'Low' | 'Medium' | 'High'
export type AssignmentStatus = 'Pending' | 'In Progress' | 'Completed'

export interface Subject {
  id: string
  name: string
  color: string
}

export interface Assignment {
  id: string
  assignment_name: string
  subject_id: string | null
  subject?: Subject
  due_date: string
  priority: AssignmentPriority
  status: AssignmentStatus
  remarks: string | null
}

export interface AssignmentInput {
  assignment_name: string
  subject_id: string
  due_date: string
  priority: AssignmentPriority
  status: AssignmentStatus
  remarks?: string
}
