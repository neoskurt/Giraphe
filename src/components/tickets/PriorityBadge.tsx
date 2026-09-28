import { AlertOctagon, ArrowUp, Equal, ArrowDown } from 'lucide-react'
import type { Priority } from '@/types'
import { PRIORITY_DOT, PRIORITY_LABELS } from '@/lib/labels'

const ICONS: Record<Priority, typeof AlertOctagon> = {
  P0: AlertOctagon,
  P1: ArrowUp,
  P2: Equal,
  P3: ArrowDown,
}

export function PriorityBadge({ priority, compact = false }: { priority: Priority; compact?: boolean }) {
  const Icon = ICONS[priority]
  return (
    <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-ink-secondary">
      <Icon className="h-3 w-3 shrink-0" aria-hidden="true" strokeWidth={2.5} style={{ color: PRIORITY_DOT[priority] }} />
      {compact ? priority : PRIORITY_LABELS[priority]}
    </span>
  )
}
