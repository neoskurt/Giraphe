import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AlertTriangle, CircleCheck, Clock, Flame, ListTodo } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { users } from '@/data/users'
import { STATUS_LABELS, PRIORITY_LABELS, KANBAN_STATUSES } from '@/lib/labels'
import { statusColor, priorityColor, sequentialColor } from '@/lib/vizPalette'
import { isOverdue } from '@/lib/date'
import { StatTile } from '@/components/dashboard/StatTile'
import { HorizontalBarChart, type BarDatum } from '@/components/dashboard/HorizontalBarChart'
import { AttentionList } from '@/components/dashboard/AttentionList'
import type { Priority, Status } from '@/types'

export function DashboardPage() {
  const tickets = useStore((s) => s.tickets)
  const theme = useStore((s) => s.theme)
  const navigate = useNavigate()
  const location = useLocation()

  function openTicket(id: string) {
    navigate(`/tickets/${id}`, { state: { background: location } })
  }

  const openTickets = useMemo(
    () => tickets.filter((t) => t.status !== 'termine' && t.status !== 'annule'),
    [tickets],
  )

  const overdueTickets = useMemo(
    () => tickets.filter((t) => isOverdue(t.dueDate, t.status)),
    [tickets],
  )

  const criticalUnassigned = useMemo(
    () => openTickets.filter((t) => t.priority === 'P0' && !t.assigneeId),
    [openTickets],
  )

  const terminatedCount = useMemo(() => tickets.filter((t) => t.status === 'termine').length, [tickets])
  const criticalOpenCount = useMemo(() => openTickets.filter((t) => t.priority === 'P0').length, [openTickets])

  const statusData: BarDatum[] = useMemo(() => {
    const statuses: Status[] = [...KANBAN_STATUSES, 'annule']
    return statuses.map((status) => ({
      key: status,
      label: STATUS_LABELS[status],
      value: tickets.filter((t) => t.status === status).length,
      color: statusColor(status, theme),
    }))
  }, [tickets, theme])

  const priorityData: BarDatum[] = useMemo(() => {
    const priorities: Priority[] = ['P0', 'P1', 'P2', 'P3']
    return priorities.map((priority) => ({
      key: priority,
      label: `${PRIORITY_LABELS[priority]} (${priority})`,
      value: tickets.filter((t) => t.priority === priority).length,
      color: priorityColor(priority),
    }))
  }, [tickets])

  const workloadData: BarDatum[] = useMemo(() => {
    const color = sequentialColor(theme)
    return users
      .map((u) => ({
        key: u.id,
        label: u.firstName,
        value: openTickets.filter((t) => t.assigneeId === u.id).length,
        color,
      }))
      .sort((a, b) => b.value - a.value)
  }, [openTickets, theme])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-display-lg font-semibold text-ink">Tableau de bord</h1>
        <p className="text-sm text-ink-muted">Vue d'ensemble de l'activité Giraphe chez Nordival.</p>
      </div>

      <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
        <StatTile icon={ListTodo} label="Tickets ouverts" value={openTickets.length} />
        <StatTile icon={Flame} label="Critiques ouverts" value={criticalOpenCount} accent="critical" />
        <StatTile icon={Clock} label="En retard" value={overdueTickets.length} accent={overdueTickets.length > 0 ? 'critical' : 'default'} />
        <StatTile icon={CircleCheck} label="Terminés" value={terminatedCount} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <HorizontalBarChart title="Tickets par statut" data={statusData} />
        <HorizontalBarChart title="Tickets par priorité" data={priorityData} />
      </div>

      <HorizontalBarChart title="Charge par utilisateur (tickets ouverts assignés)" data={workloadData} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <AttentionList
          title="Critiques non assignés"
          icon={AlertTriangle}
          tickets={criticalUnassigned}
          emptyMessage="Aucun ticket critique non assigné 🎉"
          onOpen={openTicket}
        />
        <AttentionList
          title="Tickets en retard"
          icon={Clock}
          tickets={overdueTickets}
          emptyMessage="Aucun ticket en retard"
          onOpen={openTicket}
        />
      </div>
    </div>
  )
}
