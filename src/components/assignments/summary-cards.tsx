import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { AssignmentSummary } from '@/utils/assignment'

interface SummaryCardsProps {
  summary: AssignmentSummary
}

const cardItems: Array<{ key: keyof AssignmentSummary; title: string }> = [
  { key: 'total', title: 'Total' },
  { key: 'pending', title: 'Pending' },
  { key: 'inProgress', title: 'In Progress' },
  { key: 'completed', title: 'Completed' },
  { key: 'overdue', title: 'Overdue' },
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
