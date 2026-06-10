import { BarChart3, BookOpen, CalendarDays, LayoutDashboard, ListChecks, Settings } from 'lucide-react'
import { NavLink } from 'react-router-dom'

import { cn } from '@/lib/utils'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/calendar', label: 'Calendar', icon: CalendarDays },
  { to: '/assignments', label: 'Edit Assignments', icon: ListChecks },
  { to: '/subjects', label: 'Subjects', icon: BookOpen },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/settings', label: 'Settings', icon: Settings },
]

interface SidebarProps {
  isOpen: boolean
}

export function Sidebar({ isOpen }: SidebarProps) {
  return (
    <aside
      className={cn(
        'transition-all duration-300 bg-white border-slate-200 overflow-hidden hidden lg:flex',
        isOpen
          ? 'lg:w-64 lg:border-r'
          : 'lg:w-16 lg:border-r',
      )}
    >
      <div className="p-4 lg:h-screen">
        <div className="mb-6">
          {isOpen && (
            <>
              <p className="text-lg font-semibold text-indigo-600">Milestone</p>
              <p className="text-sm text-slate-500">Assignment Progression Tracker</p>
            </>
          )}
          {!isOpen && <p className="text-lg font-semibold text-indigo-600 text-center">M</p>}
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100',
                  !isOpen && 'justify-center',
                )
              }
              title={!isOpen ? item.label : undefined}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              {isOpen && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  )
}
