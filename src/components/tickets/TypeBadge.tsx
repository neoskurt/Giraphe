import { Bug, MessageSquarePlus, Siren, Sparkles } from 'lucide-react'
import type { TicketType } from '@/types'
import { TYPE_DOT, TYPE_LABELS } from '@/lib/labels'

const ICONS: Record<TicketType, typeof Bug> = {
  bug: Bug,
  demande: MessageSquarePlus,
  incident: Siren,
  amelioration: Sparkles,
}

export function TypeBadge({ type }: { type: TicketType }) {
  const Icon = ICONS[type]
  return (
    <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-ink-secondary">
      <Icon className="h-3 w-3 shrink-0" aria-hidden="true" style={{ color: TYPE_DOT[type] }} />
      {TYPE_LABELS[type]}
    </span>
  )
}
