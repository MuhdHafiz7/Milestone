import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { AssignmentSummary } from '@/utils/assignment'

interface SummaryCardsProps {
  summary: AssignmentSummary
}

const cardItems: Array<{ key: keyof AssignmentSummary; title: string }> = [
  { key: 'total', title: 'Total Assignments' },
  { key: 'pending', title: 'Pending Assignments' },
  { key: 'inProgress', title: 'In Progress Assignments' },
  { key: 'completed', title: 'Completed Assignments' },
  { key: 'overdue', title: 'Overdue Assignments' },
]

export function SummaryCards({ summary }: SummaryCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {cardItems.map((item) => (
        <Card key={item.key}>
          <CardHeader>
            <CardTitle>{item.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-slate-900">{summary[item.key]}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
