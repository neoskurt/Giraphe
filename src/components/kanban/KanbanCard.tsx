import type { CSSProperties } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { AlertTriangle, Clock } from 'lucide-react'
import type { Ticket } from '@/types'
import { PriorityBadge } from '@/components/tickets/PriorityBadge'
import { AssigneeSelect } from '@/components/tickets/AssigneeSelect'
import { formatDate, isOverdue } from '@/lib/date'
import { getUser } from '@/data/users'

interface KanbanCardProps {
  ticket: Ticket
  onOpen: (id: string) => void
}

export function KanbanCard({ ticket, onOpen }: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: ticket.id,
  })

  const baseTransform = CSS.Transform.toString(transform)
  const style: CSSProperties = {
    transform: isDragging ? `${baseTransform ?? ''} rotate(-1.5deg) scale(1.03)`.trim() : baseTransform,
    transition,
  }

  const overdue = isOverdue(ticket.dueDate, ticket.status)
  const criticalUnassigned =
    ticket.priority === 'P0' && !ticket.assigneeId && ticket.status !== 'termine' && ticket.status !== 'annule'
  const assignee = getUser(ticket.assigneeId)

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-md border border-line bg-surface p-3 transition-shadow duration-fast ${
        isDragging ? 'shadow-lifted' : 'shadow-card hover:shadow-panel'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <button
          type="button"
          onClick={() => onOpen(ticket.id)}
          className="flex-1 text-left"
          {...attributes}
          {...listeners}
        >
          <span className="block font-mono text-[11px] tracking-tight text-ink-muted">{ticket.id}</span>
          <span className="mt-0.5 block line-clamp-2 font-display text-[14px] font-semibold leading-snug text-ink">
            {ticket.title}
          </span>
        </button>
        {criticalUnassigned && (
          <span title="Critique et non assigné" aria-label="Critique et non assigné">
            <AlertTriangle className="h-4 w-4 shrink-0 text-danger" />
          </span>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <PriorityBadge priority={ticket.priority} compact />
        <div onClick={(e) => e.stopPropagation()}>
          <AssigneeSelect ticketId={ticket.id} assigneeId={ticket.assigneeId} compact />
        </div>
      </div>

      {ticket.dueDate && (
        <div
          className={`mt-2 flex items-center gap-1 text-xs ${
            overdue ? 'font-medium text-danger' : 'text-ink-muted'
          }`}
        >
          <Clock className="h-3 w-3" />
          {formatDate(ticket.dueDate)}
          {overdue && ' · en retard'}
        </div>
      )}

      <span className="sr-only">
        {assignee ? `Assigné à ${assignee.firstName}` : 'Non assigné'}
      </span>
    </div>
  )
}
