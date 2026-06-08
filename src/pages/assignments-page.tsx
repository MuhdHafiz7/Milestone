import { Plus } from 'lucide-react'
import { useState } from 'react'

import { AssignmentFormDialog } from '@/components/assignments/assignment-form-dialog'
import { AssignmentTable } from '@/components/assignments/assignment-table'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAssignments } from '@/hooks/useAssignments'
import type { Assignment, AssignmentInput, AssignmentStatus } from '@/types/assignment'

export function AssignmentsPage() {
  const { data: assignments = [], isLoading, error, createAssignment, updateAssignment, deleteAssignment, updateStatus } =
    useAssignments()

  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<Assignment | undefined>()

  async function handleSubmit(payload: AssignmentInput) {
    if (selected) {
      await updateAssignment.mutateAsync({ id: selected.id, input: payload })
      setSelected(undefined)
      return
    }

    await createAssignment.mutateAsync(payload)
  }

  async function handleDelete(id: string) {
    await deleteAssignment.mutateAsync(id)
  }

  async function handleStatusChange(id: string, status: AssignmentStatus) {
    await updateStatus.mutateAsync({ id, status })
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-4 text-red-600">{error.message}</CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Manage Assignments</CardTitle>
          <Button
            onClick={() => {
              setSelected(undefined)
              setOpen(true)
            }}
          >
            <Plus className="h-4 w-4" /> Create Assignment
          </Button>
        </CardHeader>
        <CardContent>
          <AssignmentTable
            assignments={assignments}
            loading={isLoading}
            onEdit={(assignment) => {
              setSelected(assignment)
              setOpen(true)
            }}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
          />
        </CardContent>
      </Card>

      {open ? (
        <AssignmentFormDialog
          key={selected?.id ?? 'new-assignment'}
          open={open}
          onOpenChange={setOpen}
          initialData={selected}
          onSubmit={handleSubmit}
          pending={createAssignment.isPending || updateAssignment.isPending}
        />
      ) : null}
    </div>
  )
}
