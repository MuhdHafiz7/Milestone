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
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useMemo, useState } from 'react'

import { StatusBadge } from '@/components/assignments/status-badge'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAssignments } from '@/hooks/useAssignments'
import { assignmentsForDate } from '@/utils/assignment'

export function CalendarPage() {
  const { data: assignments = [], error } = useAssignments()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())

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
                    {dayAssignments.slice(0, 2).map((assignment) => (
                      <p key={assignment.id} className="truncate rounded bg-indigo-100 px-1 py-0.5 text-[11px] text-indigo-700">
                        {assignment.assignment_name}
                      </p>
                    ))}
                    {dayAssignments.length > 2 ? (
                      <p className="text-[11px] text-slate-500">+{dayAssignments.length - 2} more</p>
                    ) : null}
                  </div>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{format(selectedDate, 'dd MMMM yyyy')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {selectedAssignments.length ? (
            selectedAssignments.map((assignment) => (
              <div key={assignment.id} className="rounded border border-slate-100 p-3">
                <p className="font-medium text-slate-800">{assignment.assignment_name}</p>
                <p className="text-xs text-slate-500">{assignment.subject}</p>
                <div className="mt-2 flex items-center gap-2">
                  <StatusBadge status={assignment.status} />
                  <Badge variant={assignment.priority === 'High' ? 'red' : assignment.priority === 'Medium' ? 'amber' : 'green'}>
                    {assignment.priority}
                  </Badge>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500">No assignments on this date.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
