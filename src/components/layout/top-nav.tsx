import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

const titles: Record<string, string> = {
  '/': 'Dashboard',
  '/assignments': 'Assignments',
  '/calendar': 'Calendar',
  '/analytics': 'Analytics',
}

export function TopNav() {
  const location = useLocation()

  const title = useMemo(() => titles[location.pathname] ?? 'Assignment Due Date Tracker', [location.pathname])

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-6">
      <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
      <p className="text-sm text-slate-500">Realtime shared board</p>
    </header>
  )
}
