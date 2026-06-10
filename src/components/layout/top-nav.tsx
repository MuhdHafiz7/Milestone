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

  const title = useMemo(() => titles[location.pathname] ?? 'Milestone', [location.pathname])

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 backdrop-blur-sm px-4 lg:px-6">
      <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
    </header>
  )
}
