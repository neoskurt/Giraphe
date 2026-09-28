import { Route, Routes, useLocation } from 'react-router-dom'
import type { Location } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { DashboardPage } from '@/pages/DashboardPage'
import { TicketsListPage } from '@/pages/TicketsListPage'
import { KanbanPage } from '@/pages/KanbanPage'
import { TicketDetailRoute } from '@/pages/TicketDetailRoute'
import { ToastContainer } from '@/components/ui/ToastContainer'
import { useThemeEffect } from '@/hooks/useTheme'

interface NavigationState {
  background?: Location
}

function App() {
  useThemeEffect()
  const location = useLocation()
  const background = (location.state as NavigationState | null)?.background

  return (
    <>
      <Routes location={background ?? location}>
        <Route element={<AppShell />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/tickets" element={<TicketsListPage />} />
          <Route path="/tickets/:id" element={<TicketsListPage />} />
          <Route path="/kanban" element={<KanbanPage />} />
        </Route>
      </Routes>
      {background && (
        <Routes>
          <Route path="/tickets/:id" element={<TicketDetailRoute />} />
        </Routes>
      )}
      <ToastContainer />
    </>
  )
}

export default App
