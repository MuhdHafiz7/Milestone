import { NavLink } from 'react-router-dom'
import { LayoutDashboard, ListChecks, BookOpen, CalendarDays, BarChart3, Settings } from 'lucide-react'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/assignments', label: 'Assignments', icon: ListChecks },
  { to: '/subjects', label: 'Subjects', icon: BookOpen },
  { to: '/calendar', label: 'Calendar', icon: CalendarDays },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 lg:hidden z-50">
      <div className="grid grid-cols-3 gap-1 px-2 py-2">
        {navItems.slice(0, 3).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-2 py-2 rounded-lg text-xs transition-colors ${
                isActive ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500 hover:text-slate-700'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-1 px-2 pb-2 lg:hidden">
        {navItems.slice(3).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-2 py-2 rounded-lg text-xs transition-colors ${
                isActive ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500 hover:text-slate-700'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}