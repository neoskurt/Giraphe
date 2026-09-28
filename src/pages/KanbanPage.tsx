import { useLocation, useNavigate } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { KanbanBoard } from '@/components/kanban/KanbanBoard'

export function KanbanPage() {
  const tickets = useStore((s) => s.tickets)
  const navigate = useNavigate()
  const location = useLocation()

  function openTicket(id: string) {
    navigate(`/tickets/${id}`, { state: { background: location } })
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-display-lg font-semibold text-ink">Kanban</h1>
        <p className="text-sm text-ink-muted">
          Glissez-déposez les tickets entre les colonnes pour changer leur statut, ou réordonnez-les au sein d'une
          colonne.
        </p>
      </div>
      <KanbanBoard tickets={tickets} onOpen={openTicket} />
    </div>
  )
}
