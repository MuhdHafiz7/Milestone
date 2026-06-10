import { useState } from 'react'
import { Outlet } from 'react-router-dom'

import { Sidebar } from '@/components/layout/sidebar'
import { TopNav } from '@/components/layout/top-nav'
import { MobileNav } from '@/components/layout/mobile-nav'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, LayoutDashboard } from 'lucide-react'

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="min-h-screen bg-slate-100 lg:flex">
      <Sidebar isOpen={sidebarOpen} />
      <div className="flex min-h-screen flex-1 flex-col lg:transition-all lg:duration-300">
        <TopNav />
        <main className="flex-1 p-4 lg:p-6 pb-20 lg:pb-0">
          <Outlet />
        </main>
      </div>
      <MobileNav />
      <Button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed bottom-24 right-6 z-50 rounded-full shadow-lg lg:hidden"
        aria-label={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
      >
        {sidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <LayoutDashboard className="h-5 w-5" />}
      </Button>
      <Button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed bottom-24 left-6 z-50 rounded-full shadow-lg hidden lg:flex"
        aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
      >
        {sidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
      </Button>
    </div>
  )
}
