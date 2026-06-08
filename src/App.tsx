import { Navigate, Route, Routes } from 'react-router-dom'

import { AppLayout } from '@/components/layout/app-layout'
import { AnalyticsPage } from '@/pages/analytics-page'
import { AssignmentsPage } from '@/pages/assignments-page'
import { CalendarPage } from '@/pages/calendar-page'
import { DashboardPage } from '@/pages/dashboard-page'

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/assignments" element={<AssignmentsPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Route>
    </Routes>
  )
}

export default App
