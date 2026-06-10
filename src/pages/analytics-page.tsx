import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAssignments } from '@/hooks/useAssignments'
import { byStatus, dueInMonth, groupBySubject } from '@/utils/assignment'

const statusColors: Record<string, string> = {
  Pending: '#4f46e5',
  'In Progress': '#f59e0b',
  Completed: '#10b981',
  Overdue: '#ef4444',
}

export function AnalyticsPage() {
  const { data: assignments = [], error } = useAssignments()

  if (error) {
    return (
      <Card>
        <CardContent className="pt-4 text-red-600">{error.message}</CardContent>
      </Card>
    )
  }

  // Filter out Final Exams
  const regularAssignments = assignments.filter(a => a.assignment_name !== 'Final Exam')

  const statusData = Object.entries(byStatus(regularAssignments)).map(([name, value]) => ({ name, value }))
  const subjectData = groupBySubject(regularAssignments)
  const monthData = dueInMonth(regularAssignments)

  if (!regularAssignments.length) {
    return (
      <Card>
        <CardContent className="pt-4 text-sm text-slate-500">No assignments yet. Add data to view analytics.</CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Status Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={110} label>
                {statusData.map((entry) => (
                  <Cell key={entry.name} fill={statusColors[entry.name] ?? '#64748b'} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Assignments By Subject</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer>
            <BarChart data={subjectData}>
              <XAxis dataKey="subject" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#4f46e5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="xl:col-span-2">
        <CardHeader>
          <CardTitle>Upcoming Assignments By Month</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer>
            <BarChart data={monthData}>
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
