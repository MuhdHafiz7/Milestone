import { useEffect, useState } from 'react'
import { LayoutDashboard, ListChecks } from 'lucide-react'

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      onComplete()
    }, 1000)

    return () => clearTimeout(timer)
  }, [onComplete])

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-2xl bg-indigo-600 flex items-center justify-center">
            <LayoutDashboard className="h-12 w-12 text-white" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
            <ListChecks className="h-4 w-4 text-indigo-600" />
          </div>
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900">Milestone</h1>
          <p className="text-slate-500 mt-1">Assignment Progression Tracker</p>
        </div>
        <div className="flex gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  )
}