import { useState } from 'react'
import { useLocation, Navigate, Route, Routes } from 'react-router-dom'

import { AppLayout } from '@/components/layout/app-layout'
import { AnalyticsPage } from '@/pages/analytics-page'
import { AssignmentsPage } from '@/pages/assignments-page'
import { CalendarPage } from '@/pages/calendar-page'
import { DashboardPage } from '@/pages/dashboard-page'
import { SettingsPage } from '@/pages/settings-page'
import { SubjectsPage } from '@/pages/subjects-page'
import { SplashScreen } from '@/components/ui/splash-screen'
import { PageLoader } from '@/components/ui/page-loader'

function App() {
  const [showSplash, setShowSplash] = useState(true)
  const location = useLocation()

  return (
    <>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      {!showSplash && (
        <>
          <PageLoader key={location.pathname} />
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/assignments" element={<AssignmentsPage />} />
              <Route path="/subjects" element={<SubjectsPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate replace to="/" />} />
            </Route>
          </Routes>
        </>
      )}
    </>
  )
}

export default App
