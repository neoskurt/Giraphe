import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { CreateTicketModal } from '@/components/tickets/CreateTicketModal'
import { CommandPalette } from '@/components/search/CommandPalette'

export function AppShell() {
  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <Outlet />
      </main>
      <CreateTicketModal />
      <CommandPalette />
    </div>
  )
}
