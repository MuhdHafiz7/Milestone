import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Table } from '@/components/ui/table'
import { useAssignments } from '@/hooks/useAssignments'
import type { Subject } from '@/types/assignment'
import { assertNhost } from '@/services/nhost'

export function SubjectsPage() {
  const { subjects } = useAssignments()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Subject | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [color, setColor] = useState('#6366f1')

  const isEdit = Boolean(editing)

  function handleOpenCreate() {
    setEditing(null)
    setName('')
    setColor('#6366f1')
    setOpen(true)
  }

  function handleOpenEdit(subject: Subject) {
    setEditing(subject)
    setName(subject.name)
    setColor(subject.color)
    setOpen(true)
  }

  function handleClose() {
    setOpen(false)
    setEditing(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return

    const client = assertNhost()
    
    if (isEdit) {
      const { error } = await client.graphql.request(
        `mutation UpdateSubject($id: uuid!, $name: String!, $color: String!) {
          update_subjects_by_pk(pk_columns: { id: $id }, _set: { name: $name, color: $color }) {
            id
          }
        }`,
        { id: editing!.id, name: name.trim(), color }
      )
      if (error) throw error
    } else {
      const { error } = await client.graphql.request(
        `mutation CreateSubject($name: String!, $color: String!) {
          insert_subjects_one(object: { name: $name, color: $color }) {
            id
          }
        }`,
        { name: name.trim(), color }
      )
      if (error) throw error
    }

    handleClose()
  }

  async function handleDelete(id: string) {
    const client = assertNhost()
    const { error } = await client.graphql.request(
      `mutation DeleteSubject($id: uuid!) { delete_subjects_by_pk(id: $id) { id } }`,
      { id }
    )
    if (error) throw error
    setDeleting(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Subjects</h1>
          <p className="text-slate-500 mt-1">Manage assignment subjects</p>
        </div>
        <Button onClick={handleOpenCreate}>
          <Plus className="h-4 w-4 mr-2" /> Add Subject
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <thead>
                <tr className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500 border-b border-slate-200">
                  <th className="px-4 py-3">Color</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3 w-28 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subjects.length ? (
                  subjects.map((subject) => (
                    <tr key={subject.id} className="border-t border-slate-100 hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="w-7 h-7 rounded-lg border border-slate-200" style={{ backgroundColor: subject.color }} />
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-900">{subject.name}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(subject)} className="text-slate-500 hover:text-slate-700 hover:bg-slate-100 p-1.5">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <AlertDialog open={deleting === subject.id} onOpenChange={(open) => setDeleting(open ? subject.id : null)}>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete subject?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will remove the subject. Assignments using it will become unassigned.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setDeleting(null)}>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(subject.id)} className="bg-red-600 hover:bg-red-700">
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-4 py-12 text-center text-sm text-slate-500" colSpan={3}>
                      <div className="flex flex-col items-center gap-2">
                        <svg className="h-10 w-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7c0-.512.195-1.024.586-1.414L12 1" />
                        </svg>
                        <p>No subjects yet. Create one to get started.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Edit Subject' : 'Create Subject'}</DialogTitle>
            <DialogDescription>{isEdit ? 'Update subject details' : 'Add a new subject for assignments'}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Name *</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Mathematics"
                autoFocus
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Color</label>
              <Input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-20 h-10 cursor-pointer"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
              <Button type="submit">{isEdit ? 'Save Changes' : 'Create Subject'}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}