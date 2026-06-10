import { useLocation } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import { BarChart3, BookOpen, CalendarDays, LayoutDashboard, ListChecks, Settings } from 'lucide-react'

const pageIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  '/': LayoutDashboard,
  '/assignments': ListChecks,
  '/subjects': BookOpen,
  '/calendar': CalendarDays,
  '/analytics': BarChart3,
  '/settings': Settings,
}

export function PageLoader() {
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(true)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    
    timerRef.current = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  if (!isLoading) return null

  const Icon = pageIcons[location.pathname] || LayoutDashboard

  return (
    <div className="fixed inset-y-0 left-0 right-0 lg:left-64 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center">
          <Icon className="h-8 w-8 text-indigo-600" />
        </div>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '100ms' }} />
          <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '200ms' }} />
        </div>
      </div>
    </div>
  )
}