import { format } from 'date-fns'
import { Pencil, Search, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'

import { StatusBadge } from '@/components/assignments/status-badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Table, TableContainer } from '@/components/ui/table'
import type { Assignment, AssignmentStatus } from '@/types/assignment'
import { isOverdue, priorityRank } from '@/utils/assignment'

interface AssignmentTableProps {
  assignments: Assignment[]
  loading: boolean
  onEdit: (assignment: Assignment) => void
  onDelete: (id: string) => Promise<void>
  onStatusChange: (id: string, status: AssignmentStatus) => Promise<void>
}

export function AssignmentTable({ assignments, loading, onEdit, onDelete, onStatusChange }: AssignmentTableProps) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [subjectFilter, setSubjectFilter] = useState('All')
  const [sortBy, setSortBy] = useState<'due_date' | 'priority'>('due_date')

  const subjects = useMemo(
    () => Array.from(new Set(assignments.map((a) => a.subject?.name).filter((s): s is string => Boolean(s)))).sort((a, b) => a.localeCompare(b)),
    [assignments],
  )

  const filteredAssignments = useMemo(() => {
    return assignments
      .filter((assignment) => assignment.assignment_name !== 'Final Exam')
      .filter((assignment) => {
        const q = search.toLowerCase()
        const subjectName = assignment.subject?.name ?? ''
        const matchesQuery =
          assignment.assignment_name.toLowerCase().includes(q) || subjectName.toLowerCase().includes(q)
        const matchesStatus = statusFilter === 'All' || assignment.status === statusFilter
        const matchesSubject = subjectFilter === 'All' || subjectName === subjectFilter
        return matchesQuery && matchesStatus && matchesSubject
      })
      .sort((left, right) => {
        if (sortBy === 'priority') return priorityRank[right.priority] - priorityRank[left.priority]
        return new Date(left.due_date).getTime() - new Date(right.due_date).getTime()
      })
  }, [assignments, search, statusFilter, subjectFilter, sortBy])

  if (loading) return <p className="text-sm text-slate-500">Loading assignments...</p>

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="relative sm:col-span-2 xl:col-span-1">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            className="pl-9"
            placeholder="Search name or subject"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <Select value={sortBy} onChange={(event) => setSortBy(event.target.value as 'due_date' | 'priority')}>
          <option value="due_date">Sort by Due Date</option>
          <option value="priority">Sort by Priority</option>
        </Select>

        <Select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </Select>

        <Select value={subjectFilter} onChange={(event) => setSubjectFilter(event.target.value)}>
          <option value="All">All Subjects</option>
          {subjects.map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </Select>
      </div>

      <TableContainer>
        <Table>
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-2">Assignment</th>
              <th className="px-3 py-2">Subject</th>
              <th className="px-3 py-2">Due Date</th>
              <th className="px-3 py-2">Priority</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssignments.length ? (
              filteredAssignments.map((assignment) => {
                const overdue = isOverdue(assignment)
                return (
                  <tr key={assignment.id} className={overdue ? 'bg-red-50/60' : 'border-t border-slate-100'}>
                    <td className="px-3 py-2 font-medium text-slate-800">{assignment.assignment_name}</td>
                    <td className="px-3 py-2">{assignment.subject?.name ?? ''}</td>
                    <td className="px-3 py-2">
                      {format(new Date(assignment.due_date), 'dd MMM yyyy, HH:mm')}
                      {overdue ? <Badge className="ml-2" variant="red">Overdue</Badge> : null}
                    </td>
                    <td className="px-3 py-2">
                      <Badge
                        variant={
                          assignment.priority === 'High'
                            ? 'red'
                            : assignment.priority === 'Medium'
                              ? 'amber'
                              : 'green'
                        }
                      >
                        {assignment.priority}
                      </Badge>
                    </td>
                    <td className="px-3 py-2">
                      <div className="space-y-2">
                        <StatusBadge status={assignment.status} />
                        <Select
                          className="h-8"
                          value={assignment.status}
                          onChange={(event) => onStatusChange(assignment.id, event.target.value as AssignmentStatus)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </Select>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => onEdit(assignment)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive">
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete assignment?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. The assignment will be permanently removed.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel asChild>
                                <Button variant="outline">Cancel</Button>
                              </AlertDialogCancel>
                              <AlertDialogAction asChild>
                                <Button variant="destructive" onClick={() => onDelete(assignment.id)}>
                                  Delete
                                </Button>
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td className="px-3 py-6 text-center text-sm text-slate-500" colSpan={8}>
                  No assignments found. Create one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </TableContainer>
    </div>
  )
}
