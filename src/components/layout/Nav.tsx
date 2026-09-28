import { NavLink } from 'react-router-dom'
import { LayoutDashboard, List, KanbanSquare } from 'lucide-react'
import clsx from 'clsx'

const LINKS = [
  { to: '/', label: 'Tableau de bord', icon: LayoutDashboard, end: true },
  { to: '/tickets', label: 'Liste', icon: List, end: false },
  { to: '/kanban', label: 'Kanban', icon: KanbanSquare, end: false },
]

export function Nav() {
  return (
    <nav className="flex h-16 items-stretch gap-1" aria-label="Navigation principale">
      {LINKS.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            clsx(
              'flex items-center gap-1.5 border-b-2 px-2.5 text-[13.5px] font-medium tracking-tight transition-colors duration-fast',
              isActive
                ? 'border-terracotta text-ink'
                : 'border-transparent text-ink-muted hover:border-line hover:text-ink',
            )
          }
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
