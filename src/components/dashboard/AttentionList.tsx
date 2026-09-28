import type { LucideIcon } from 'lucide-react'
import type { Ticket } from '@/types'
import { AssigneeSelect } from '@/components/tickets/AssigneeSelect'
import { PriorityBadge } from '@/components/tickets/PriorityBadge'
import { formatDate } from '@/lib/date'

interface AttentionListProps {
  title: string
  icon: LucideIcon
  tickets: Ticket[]
  emptyMessage: string
  onOpen: (id: string) => void
}

export function AttentionList({ title, icon: Icon, tickets, emptyMessage, onOpen }: AttentionListProps) {
  return (
    <div className="rounded-md border border-line bg-surface p-4">
      <h3 className="mb-3 flex items-center gap-2 font-display text-heading font-semibold text-ink">
        <Icon className="h-4 w-4 text-danger" aria-hidden="true" />
        {title}
        <span className="ml-auto rounded-full border border-danger/30 px-2 py-0.5 text-xs font-bold text-danger">
          {tickets.length}
        </span>
      </h3>
      {tickets.length === 0 ? (
        <p className="py-4 text-center text-sm text-ink-muted">{emptyMessage}</p>
      ) : (
        <ul className="divide-y divide-line/70">
          {tickets.map((t) => (
            <li key={t.id} className="flex items-center gap-2 py-2">
              <button
                type="button"
                onClick={() => onOpen(t.id)}
                className="flex-1 truncate text-left text-sm text-ink hover:underline"
              >
                <span className="mr-1.5 font-mono text-xs text-ink-muted">{t.id}</span>
                {t.title}
              </button>
              <PriorityBadge priority={t.priority} compact />
              {t.dueDate && (
                <span className="hidden shrink-0 text-xs text-ink-muted sm:inline">{formatDate(t.dueDate)}</span>
              )}
              <div onClick={(e) => e.stopPropagation()}>
                <AssigneeSelect ticketId={t.id} assigneeId={t.assigneeId} compact />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
