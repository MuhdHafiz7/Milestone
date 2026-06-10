import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns'
import { ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'

import { AssignmentFormDialog } from '@/components/assignments/assignment-form-dialog'
import { StatusBadge } from '@/components/assignments/status-badge'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAssignments } from '@/hooks/useAssignments'
import { assignmentsForDate } from '@/utils/assignment'
import type { AssignmentInput } from '@/types/assignment'

export function CalendarPage() {
  const { data: assignments = [], error, createAssignment, deleteAssignment, subjects } = useAssignments()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [formOpen, setFormOpen] = useState(false)
  const [examFormOpen, setExamFormOpen] = useState(false)

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 })
    const end = endOfMonth(currentMonth)
    return eachDayOfInterval({ start, end: endOfMonth(end) })
  }, [currentMonth])

  const selectedAssignments = assignmentsForDate(assignments, selectedDate)

  if (error) {
    return (
      <Card>
        <CardContent className="pt-4 text-red-600">{error.message}</CardContent>
      </Card>
    )
  }

  async function handleSubmit(payload: AssignmentInput) {
    await createAssignment.mutateAsync(payload)
    setFormOpen(false)
  }

  async function handleExamSubmit(payload: { subject_id: string; exam_date: string }) {
    await createAssignment.mutateAsync({
      assignment_name: 'Final Exam',
      subject_id: payload.subject_id,
      due_date: payload.exam_date,
      priority: 'High',
      status: 'Pending',
    })
    setExamFormOpen(false)
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{format(currentMonth, 'MMMM yyyy')}</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setCurrentMonth((month) => subMonths(month, 1))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentMonth((month) => addMonths(month, 1))}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-slate-500">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <p key={day}>{day}</p>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-7 gap-2">
            {days.map((day) => {
              const dayAssignments = assignmentsForDate(assignments, day)
              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  onClick={() => setSelectedDate(day)}
                  className={`min-h-24 rounded-md border p-2 text-left ${
                    isSameDay(selectedDate, day)
                      ? 'border-indigo-400 bg-indigo-50'
                      : isSameMonth(day, currentMonth)
                        ? 'border-slate-200 bg-white'
                        : 'border-slate-200 bg-slate-50 text-slate-400'
                  }`}
                >
                  <p className="text-xs font-semibold">{format(day, 'd')}</p>
                  <div className="mt-1 space-y-1">
                    {dayAssignments.slice(0, 3).map((assignment) => (
                      <p key={assignment.id} className="truncate rounded bg-indigo-100 px-1 py-0.5 text-[11px] text-indigo-700">
                        {assignment.assignment_name}
                      </p>
                    ))}
                    {dayAssignments.length > 3 ? (
                      <p className="text-[11px] text-slate-500">+{dayAssignments.length - 3} more</p>
                    ) : null}
                  </div>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{format(selectedDate, 'dd MMMM yyyy')}</CardTitle>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" onClick={() => setFormOpen(true)}>
              <Plus className="h-4 w-4 mr-1" /> Add Assignment
            </Button>
            <Button size="sm" onClick={() => setExamFormOpen(true)} className="bg-red-600 hover:bg-red-700">
              <Plus className="h-4 w-4 mr-1" /> Add Final Exam
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {selectedAssignments.length ? (
            selectedAssignments.map((assignment) => (
              <div key={assignment.id} className="rounded border border-slate-100 p-3">
                <p className="font-medium text-slate-800">{assignment.assignment_name}</p>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-slate-600">
                    {assignment.subject?.name 
                      ? assignment.assignment_name === 'Final Exam' 
                        ? `${assignment.subject.name} Final Exam`
                        : assignment.subject.name
                      : ''}
                  </span>
                  {assignment.assignment_name !== 'Final Exam' && (
                    <>
                      <StatusBadge status={assignment.status} />
                      <Badge variant={assignment.priority === 'High' ? 'red' : assignment.priority === 'Medium' ? 'amber' : 'green'}>
                        {assignment.priority}
                      </Badge>
                    </>
                  )}
                  {assignment.assignment_name === 'Final Exam' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => deleteAssignment.mutateAsync(assignment.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500">No assignments on this date.</p>
          )}
        </CardContent>
      </Card>

      <AssignmentFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmit}
        pending={createAssignment.isPending}
        subjects={subjects}
        initialData={{ id: '', assignment_name: '', subject_id: subjects[0]?.id ?? '', due_date: format(selectedDate, "yyyy-MM-dd'T'HH:mm:ss"), priority: 'Medium', status: 'Pending', remarks: '' }}
      />
      <ExamFormDialog
        open={examFormOpen}
        onOpenChange={setExamFormOpen}
        onSubmit={handleExamSubmit}
        pending={createAssignment.isPending}
        subjects={subjects}
        defaultDate={format(selectedDate, "yyyy-MM-dd")}
      />
    </div>
  )
}

function ExamFormDialog({
  open,
  onOpenChange,
  onSubmit,
  pending,
  subjects,
  defaultDate,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (payload: { subject_id: string; exam_date: string }) => Promise<void>
  pending: boolean
  subjects: { id: string; name: string }[]
  defaultDate?: string
}) {
  const [subjectId, setSubjectId] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!subjectId || !defaultDate) {
      setError('Subject is required.')
      return
    }
    setError(null)
    try {
      await onSubmit({ subject_id: subjectId, exam_date: defaultDate! })
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save exam')
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-lg font-semibold mb-4">Add Final Exam</h2>
        <p className="text-sm text-slate-500 mb-4">Date: {defaultDate ? format(new Date(defaultDate), 'dd MMMM yyyy') : 'N/A'}</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Subject *</label>
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="">Select subject</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 border border-slate-300 rounded-md hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {pending ? 'Saving...' : 'Add Final Exam'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}