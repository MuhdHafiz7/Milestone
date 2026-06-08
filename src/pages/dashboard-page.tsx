import { endOfWeek, format, isWithinInterval, startOfDay } from 'date-fns'

import { SummaryCards } from '@/components/assignments/summary-cards'
import { StatusBadge } from '@/components/assignments/status-badge'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAssignments } from '@/hooks/useAssignments'
import { getSummary, isOverdue } from '@/utils/assignment'

export function DashboardPage() {
  const { data: assignments = [], isLoading, error } = useAssignments()

  if (error) {
    return (
      <Card>
        <CardContent className="pt-4 text-red-600">{error.message}</CardContent>
      </Card>
    )
  }

  const summary = getSummary(assignments)
  const upcoming = [...assignments]
    .filter((assignment) => !isOverdue(assignment))
    .sort((left, right) => new Date(left.due_date).getTime() - new Date(right.due_date).getTime())
    .slice(0, 5)

  const dueToday = assignments.filter(
    (assignment) => format(new Date(assignment.due_date), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd'),
  )

  const now = new Date()
  const dueThisWeek = assignments.filter((assignment) =>
    isWithinInterval(new Date(assignment.due_date), {
      start: startOfDay(now),
      end: endOfWeek(now, { weekStartsOn: 1 }),
    }),
  )

  return (
    <div className="space-y-4">
      <SummaryCards summary={summary} />

      {isLoading ? <p className="text-sm text-slate-500">Loading dashboard...</p> : null}

      <div className="grid gap-4 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {upcoming.length ? (
              upcoming.map((assignment) => (
                <div key={assignment.id} className="rounded border border-slate-100 p-3">
                  <p className="font-medium text-slate-800">{assignment.assignment_name}</p>
                  <p className="text-xs text-slate-500">
                    {assignment.subject} • {format(new Date(assignment.due_date), 'dd MMM yyyy, HH:mm')}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <StatusBadge status={assignment.status} />
                    <Badge variant={assignment.priority === 'High' ? 'red' : assignment.priority === 'Medium' ? 'amber' : 'green'}>
                      {assignment.priority}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No upcoming assignments.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Due Today ({summary.dueToday})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {dueToday.length ? (
              dueToday.map((assignment) => (
                <div key={assignment.id} className="rounded border border-amber-200 bg-amber-50 p-3">
                  <p className="font-medium text-slate-800">{assignment.assignment_name}</p>
                  <p className="text-xs text-slate-600">{assignment.subject}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No assignments due today.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Due This Week ({summary.dueThisWeek})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {dueThisWeek.length ? (
              dueThisWeek.map((assignment) => (
                <div key={assignment.id} className="rounded border border-slate-100 p-3">
                  <p className="font-medium text-slate-800">{assignment.assignment_name}</p>
                  <p className="text-xs text-slate-500">{format(new Date(assignment.due_date), 'EEE, dd MMM')}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No assignments due this week.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
