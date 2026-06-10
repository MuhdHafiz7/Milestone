import { useState } from 'react'
import { Bell, Save, CheckCircle2 } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { getNotificationSettings, saveNotificationSettings, requestNotificationPermission, type NotificationSettings } from '@/services/notifications'

export function SettingsPage() {
  const [settings, setSettings] = useState<NotificationSettings>(() => getNotificationSettings())
  const [saved, setSaved] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission
    }
    return 'default'
  })

  const handleToggle = (offset: keyof NotificationSettings['offsets']) => {
    setSettings((prev) => ({
      ...prev,
      offsets: {
        ...prev.offsets,
        [offset]: !prev.offsets[offset],
      },
    }))
    setSaved(false)
  }

  const handleEnableToggle = () => {
    setSettings((prev) => ({ ...prev, enabled: !prev.enabled }))
    setSaved(false)
  }

  const handleSave = () => {
    saveNotificationSettings(settings)
    setSaved(true)
    setTimeout(() => setSaved(false), 1000)
  }

  const handleRequestPermission = async () => {
    const perm = await requestNotificationPermission()
    setPermission(perm)
  }

  const offsets: Array<{ key: keyof NotificationSettings['offsets']; label: string }> = [
    { key: 7, label: '7 days before due' },
    { key: 5, label: '5 days before due' },
    { key: 3, label: '3 days before due' },
    { key: 1, label: '1 day before due' },
    { key: 0, label: 'Due today' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your notification preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-indigo-600" />
            Notification Reminders
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900">Enable Notifications</p>
              <p className="text-sm text-slate-500">Receive notifications for upcoming assignments</p>
            </div>
            <Switch
              checked={settings.enabled}
              onClick={handleEnableToggle}
              disabled={permission === 'denied'}
              aria-label="Enable notifications"
            />
          </div>

          {permission === 'denied' && (
            <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-md">
              <span>Notifications blocked. Enable in browser settings.</span>
              <Button variant="ghost" size="sm" onClick={handleRequestPermission}>
                Request Permission
              </Button>
            </div>
          )}

          {permission === 'default' && (
            <div className="flex items-center gap-2 text-sm text-indigo-600 bg-indigo-50 px-3 py-2 rounded-md">
              <span>Click to allow notifications</span>
              <Button variant="ghost" size="sm" onClick={handleRequestPermission}>
                Allow
              </Button>
            </div>
          )}

          <div className="space-y-4 pt-4 border-t border-slate-200">
            <p className="text-sm font-medium text-slate-700">Notify me when assignment is due:</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {offsets.map(({ key, label }) => (
                <div
                  key={key}
                  className={`
                    flex items-center justify-between p-3 rounded-lg border transition-colors
                    ${settings.offsets[key] ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-200'}
                    ${!settings.enabled ? 'opacity-50' : ''}
                  `}
                >
                  <span className="text-sm text-slate-700">{label}</span>
                  <Switch
                    checked={settings.enabled && settings.offsets[key]}
                    onClick={() => settings.enabled && handleToggle(key)}
                    disabled={!settings.enabled}
                    aria-label={label}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saved}>
              {saved ? (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Saved
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}