import { ArrowDown, ArrowUp, ArrowUpDown, Clock, Trash2 } from 'lucide-react'
import type { Ticket } from '@/types'
import { PriorityBadge } from '@/components/tickets/PriorityBadge'
import { StatusBadge } from '@/components/tickets/StatusBadge'
import { TypeBadge } from '@/components/tickets/TypeBadge'
import { AssigneeSelect } from '@/components/tickets/AssigneeSelect'
import { formatDate, isOverdue } from '@/lib/date'

export type SortKey = 'priority' | 'dueDate' | 'createdAt'

interface TicketTableProps {
  tickets: Ticket[]
  sortKey: SortKey
  sortDir: 'asc' | 'desc'
  onSort: (key: SortKey) => void
  onOpen: (id: string) => void
  onDeleteRequest: (id: string) => void
}

const COLUMNS: { key: SortKey | null; label: string }[] = [
  { key: null, label: 'Ticket' },
  { key: null, label: 'Type' },
  { key: null, label: 'Équipe' },
  { key: 'priority', label: 'Priorité' },
  { key: null, label: 'Statut' },
  { key: null, label: 'Assigné' },
  { key: 'dueDate', label: 'Échéance' },
  { key: null, label: '' },
]

export function TicketTable({ tickets, sortKey, sortDir, onSort, onOpen, onDeleteRequest }: TicketTableProps) {
  return (
    <div className="overflow-x-auto rounded-md border border-line">
      <table className="w-full min-w-[860px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-line text-left font-sans text-eyebrow font-semibold uppercase text-ink-muted">
            {COLUMNS.map((col) => (
              <th key={col.label || 'actions'} scope="col" className="px-4 py-3">
                {col.key ? (
                  <button
                    type="button"
                    onClick={() => onSort(col.key as SortKey)}
                    className="flex items-center gap-1 transition-colors duration-fast hover:text-terracotta"
                  >
                    {col.label}
                    {sortKey === col.key ? (
                      sortDir === 'asc' ? (
                        <ArrowUp className="h-3 w-3" />
                      ) : (
                        <ArrowDown className="h-3 w-3" />
                      )
                    ) : (
                      <ArrowUpDown className="h-3 w-3 opacity-40" />
                    )}
                  </button>
                ) : (
                  col.label
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => {
            const overdue = isOverdue(ticket.dueDate, ticket.status)
            const criticalUnassigned = ticket.priority === 'P0' && !ticket.assigneeId && ticket.status !== 'termine' && ticket.status !== 'annule'
            return (
              <tr
                key={ticket.id}
                onClick={() => onOpen(ticket.id)}
                className="cursor-pointer border-b border-line/70 transition-colors duration-fast last:border-0 hover:bg-terracotta-soft/25"
              >
                <td className="px-4 py-3">
                  <div className="flex items-start gap-2">
                    {criticalUnassigned && (
                      <span title="Critique et non assigné" aria-label="Critique et non assigné">
                        <Clock className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
                      </span>
                    )}
                    <div>
                      <span className="block font-mono text-xs text-ink-muted">{ticket.id}</span>
                      <span className="line-clamp-1 font-display font-medium text-ink">
                        {ticket.title}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <TypeBadge type={ticket.type} />
                </td>
                <td className="px-4 py-3 text-ink-secondary">{ticket.team}</td>
                <td className="px-4 py-3">
                  <PriorityBadge priority={ticket.priority} />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={ticket.status} />
                </td>
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <AssigneeSelect ticketId={ticket.id} assigneeId={ticket.assigneeId} compact />
                </td>
                <td className="px-4 py-3 tabular">
                  {ticket.dueDate ? (
                    <span className={overdue ? 'font-medium text-danger' : 'text-ink-secondary'}>
                      {formatDate(ticket.dueDate)}
                      {overdue && ' · en retard'}
                    </span>
                  ) : (
                    <span className="text-ink-muted">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => onDeleteRequest(ticket.id)}
                    aria-label={`Supprimer le ticket ${ticket.id}`}
                    className="rounded p-1.5 text-ink-muted transition-colors duration-fast hover:bg-danger-soft hover:text-danger"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
