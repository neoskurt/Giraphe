import { Plus } from 'lucide-react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import type { Status, Ticket } from '@/types'
import { STATUS_LABELS } from '@/lib/labels'
import { statusColor } from '@/lib/vizPalette'
import { useStore } from '@/store/useStore'
import { KanbanCard } from './KanbanCard'
import { useUiStore } from '@/store/useUiStore'

interface KanbanColumnProps {
  status: Status
  tickets: Ticket[]
  onOpen: (id: string) => void
}

export function KanbanColumn({ status, tickets, onOpen }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: `col-${status}` })
  const openCreateTicket = useUiStore((s) => s.openCreateTicket)
  const theme = useStore((s) => s.theme)
  const accent = statusColor(status, theme)

  return (
    <div className="flex w-72 shrink-0 flex-col">
      <div
        className="flex items-center justify-between gap-2 border-b-2 px-1 pb-2"
        style={{ borderColor: accent }}
      >
        <div className="flex items-baseline gap-2">
          <span className="font-display text-[15px] font-semibold text-ink">{STATUS_LABELS[status]}</span>
          <span className="tabular text-xs text-ink-muted">{tickets.length}</span>
        </div>
        <button
          type="button"
          onClick={() => openCreateTicket({ defaultStatus: status })}
          aria-label={`Ajouter un ticket en ${STATUS_LABELS[status]}`}
          className="rounded p-1 text-ink-muted transition-colors duration-fast hover:bg-sunken hover:text-terracotta focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div
        ref={setNodeRef}
        className={`flex min-h-[140px] flex-1 flex-col gap-2 overflow-y-auto rounded-md p-2 pt-3 transition-colors duration-fast ${
          isOver ? 'bg-terracotta-soft/50 ring-1 ring-terracotta/40' : ''
        }`}
      >
        <SortableContext items={tickets.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tickets.map((ticket) => (
            <KanbanCard key={ticket.id} ticket={ticket} onOpen={onOpen} />
          ))}
        </SortableContext>
        {tickets.length === 0 && (
          <p className="rounded border border-dashed border-line px-2 py-6 text-center text-xs text-ink-muted">
            Aucun ticket
          </p>
        )}
      </div>
    </div>
  )
}
