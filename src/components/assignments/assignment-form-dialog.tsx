import { useState, type FormEvent } from 'react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { Assignment, AssignmentInput, Subject } from '@/types/assignment'

interface AssignmentFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: Assignment
  onSubmit: (payload: AssignmentInput) => Promise<void>
  pending: boolean
  subjects: Subject[]
}

const emptyState: AssignmentInput = {
  assignment_name: '',
  subject_id: '',
  due_date: '',
  priority: 'Medium',
  status: 'Pending',
  remarks: '',
}

function formatForDateTimeInput(isoDate: string) {
  const date = new Date(isoDate)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

export function AssignmentFormDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  pending,
  subjects,
}: AssignmentFormDialogProps) {
  const [formState, setFormState] = useState<AssignmentInput>(() =>
    initialData
      ? {
          assignment_name: initialData.assignment_name,
          subject_id: initialData.subject_id ?? '',
          due_date: formatForDateTimeInput(initialData.due_date),
          priority: initialData.priority,
          status: initialData.status,
          remarks: initialData.remarks ?? '',
        }
      : emptyState,
  )
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!formState.assignment_name.trim() || !formState.subject_id || !formState.due_date) {
      setError('Assignment name, subject, and due date are required.')
      return
    }

    setError(null)

    try {
      await onSubmit({
        ...formState,
        due_date: new Date(formState.due_date).toISOString(),
      })
      onOpenChange(false)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save assignment'
      setError(message)
    }
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
            <Select
              value={formState.subject_id}
              onChange={(event) => updateField('subject_id', event.target.value)}
            >
              <option value="">Select subject</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </Select>
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

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Remarks</label>
            <Textarea
              value={formState.remarks ?? ''}
              onChange={(event) => updateField('remarks', event.target.value)}
              placeholder="Add any notes or remarks..."
              rows={3}
            />
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
