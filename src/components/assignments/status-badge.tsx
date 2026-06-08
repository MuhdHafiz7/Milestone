import { Badge } from '@/components/ui/badge'
import type { AssignmentStatus } from '@/types/assignment'

interface StatusBadgeProps {
  status: AssignmentStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  if (status === 'Completed') return <Badge variant="green">Completed</Badge>
  if (status === 'In Progress') return <Badge variant="amber">In Progress</Badge>
  return <Badge variant="indigo">Pending</Badge>
}
