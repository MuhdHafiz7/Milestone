import { useState, type FormEvent } from 'react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { Assignment, AssignmentInput } from '@/types/assignment'

interface AssignmentFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: Assignment
  onSubmit: (payload: AssignmentInput) => Promise<void>
  pending: boolean
}

const emptyState: AssignmentInput = {
  assignment_name: '',
  subject: '',
  due_date: '',
  priority: 'Medium',
  status: 'Pending',
}

function formatForDateTimeInput(isoDate: string) {
  const date = new Date(isoDate)
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
}

export function AssignmentFormDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  pending,
}: AssignmentFormDialogProps) {
  const [formState, setFormState] = useState<AssignmentInput>(() =>
    initialData
      ? {
          assignment_name: initialData.assignment_name,
          subject: initialData.subject,
          due_date: formatForDateTimeInput(initialData.due_date),
          priority: initialData.priority,
          status: initialData.status,
        }
      : emptyState,
  )
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!formState.assignment_name.trim() || !formState.subject.trim() || !formState.due_date) {
      setError('Assignment name, subject, and due date are required.')
      return
    }

    setError(null)

    await onSubmit({
      ...formState,
      due_date: new Date(formState.due_date).toISOString(),
    })

    onOpenChange(false)
  }

  function updateField<K extends keyof AssignmentInput>(field: K, value: AssignmentInput[K]) {
    setFormState((current) => ({ ...current, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Assignment' : 'Create Assignment'}</DialogTitle>
          <DialogDescription>Fill assignment details and save.</DialogDescription>
        </DialogHeader>

        <form className="space-y-3" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Assignment Name *</label>
            <Input
              value={formState.assignment_name}
              onChange={(event) => updateField('assignment_name', event.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Subject *</label>
            <Input value={formState.subject} onChange={(event) => updateField('subject', event.target.value)} />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Due Date *</label>
            <Input
              type="datetime-local"
              value={formState.due_date}
              onChange={(event) => updateField('due_date', event.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Priority</label>
              <Select
                value={formState.priority}
                onChange={(event) => updateField('priority', event.target.value as AssignmentInput['priority'])}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Status</label>
              <Select
                value={formState.status}
                onChange={(event) => updateField('status', event.target.value as AssignmentInput['status'])}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </Select>
            </div>
          </div>
          
          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? 'Saving...' : 'Save Assignment'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
