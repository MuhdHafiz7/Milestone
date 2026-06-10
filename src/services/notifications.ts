export type NotificationOffset = 7 | 5 | 3 | 1 | 0

export interface NotificationSettings {
  enabled: boolean
  offsets: Record<NotificationOffset, boolean>
}

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  enabled: true,
  offsets: {
    7: true,
    5: true,
    3: true,
    1: true,
    0: true,
  },
}

const STORAGE_KEY = 'milestone-notification-settings'

export function getNotificationSettings(): NotificationSettings {
  if (typeof window === 'undefined') return DEFAULT_NOTIFICATION_SETTINGS
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return { ...DEFAULT_NOTIFICATION_SETTINGS, ...parsed }
    }
  } catch {
    // ignore parse errors
  }
  return DEFAULT_NOTIFICATION_SETTINGS
}

export function saveNotificationSettings(settings: NotificationSettings): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
}

export function getDaysUntilDue(dueDate: string): number {
  const due = new Date(dueDate)
  const now = new Date()
  const diffTime = due.getTime() - now.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export function shouldNotify(assignment: { due_date: string; status: string }, settings: NotificationSettings): NotificationOffset | null {
  if (!settings.enabled) return null
  if (assignment.status === 'Completed') return null

  const daysUntil = getDaysUntilDue(assignment.due_date)
  
  const validOffsets: NotificationOffset[] = [7, 5, 3, 1, 0]
  for (const offset of validOffsets) {
    if (daysUntil === offset && settings.offsets[offset]) {
      return offset
    }
  }
  return null
}

export function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return Promise.resolve('denied')
  }
  return Notification.requestPermission()
}

export function showNotification(title: string, body: string): void {
  if (typeof window === 'undefined' || !('Notification' in window)) return
  if (Notification.permission !== 'granted') return

  new Notification(title, {
    body,
    icon: '/vite.svg',
    badge: '/vite.svg',
    tag: `milestone-${Date.now()}`,
    requireInteraction: true,
  })
}

export function checkAndNotify(assignments: Array<{ id: string; assignment_name: string; due_date: string; status: string; subject?: { name: string } }>): void {
  const settings = getNotificationSettings()
  
  for (const assignment of assignments) {
    const offset = shouldNotify(assignment, settings)
    if (offset !== null) {
      const dayText = offset === 0 ? 'today' : `in ${offset} day${offset > 1 ? 's' : ''}`
      const isFinalExam = assignment.assignment_name === 'Final Exam'
      
      if (isFinalExam && assignment.subject) {
        showNotification(
          'Final Exam Starting Soon',
          `${assignment.subject.name} Final Exam is starting ${dayText}!`
        )
      } else {
        showNotification(
          'Assignment Due Soon',
          `"${assignment.assignment_name}" is due ${dayText}!`
        )
      }
      break // Only show one notification at a time
    }
  }
}