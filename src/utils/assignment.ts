import { endOfDay, endOfWeek, isSameDay, isWithinInterval, parseISO, startOfDay } from 'date-fns'

import type { Assignment, AssignmentPriority, AssignmentStatus } from '@/types/assignment'

export interface AssignmentSummary {
  total: number
  pending: number
  inProgress: number
  completed: number
  overdue: number
  dueToday: number
  dueThisWeek: number
}

export const priorityRank: Record<AssignmentPriority, number> = {
  High: 3,
  Medium: 2,
  Low: 1,
}

export function isOverdue(assignment: Assignment, now = new Date()): boolean {
  return parseISO(assignment.due_date) < now && assignment.status !== 'Completed'
}

export function getSummary(assignments: Assignment[], now = new Date()): AssignmentSummary {
  const todayStart = startOfDay(now)
  const todayEnd = endOfDay(now)
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 })

  return assignments.reduce<AssignmentSummary>(
    (summary, assignment) => {
      const dueDate = parseISO(assignment.due_date)

      summary.total += 1
      if (assignment.status === 'Pending') summary.pending += 1
      if (assignment.status === 'In Progress') summary.inProgress += 1
      if (assignment.status === 'Completed') summary.completed += 1
      if (isOverdue(assignment, now)) summary.overdue += 1
      if (isWithinInterval(dueDate, { start: todayStart, end: todayEnd })) summary.dueToday += 1
      if (isWithinInterval(dueDate, { start: todayStart, end: weekEnd })) summary.dueThisWeek += 1

      return summary
    },
    { total: 0, pending: 0, inProgress: 0, completed: 0, overdue: 0, dueToday: 0, dueThisWeek: 0 },
  )
}

export function byStatus(assignments: Assignment[]): Record<AssignmentStatus | 'Overdue', number> {
  const result: Record<AssignmentStatus | 'Overdue', number> = {
    Pending: 0,
    'In Progress': 0,
    Completed: 0,
    Overdue: 0,
  }

  assignments.forEach((assignment) => {
    result[assignment.status] += 1
    if (isOverdue(assignment)) {
      result.Overdue += 1
    }
  })

  return result
}

export function groupBySubject(assignments: Assignment[]): Array<{ subject: string; value: number }> {
  const subjectMap = assignments.reduce<Record<string, number>>((accumulator, assignment) => {
    const name = assignment.subject?.name ?? 'Unknown'
    accumulator[name] = (accumulator[name] ?? 0) + 1
    return accumulator
  }, {})

  return Object.entries(subjectMap).map(([subject, value]) => ({ subject, value }))
}

export function dueInMonth(assignments: Assignment[]): Array<{ month: string; count: number }> {
  const monthMap = assignments.reduce<Record<string, number>>((accumulator, assignment) => {
    const month = assignment.due_date.slice(0, 7)
    accumulator[month] = (accumulator[month] ?? 0) + 1
    return accumulator
  }, {})

  return Object.entries(monthMap)
    .sort((left, right) => left[0].localeCompare(right[0]))
    .map(([month, count]) => ({ month, count }))
}

export function assignmentsForDate(assignments: Assignment[], date: Date): Assignment[] {
  return assignments.filter((assignment) => isSameDay(parseISO(assignment.due_date), date))
}
