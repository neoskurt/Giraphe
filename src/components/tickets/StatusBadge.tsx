import type { Status } from '@/types'
import { STATUS_LABELS } from '@/lib/labels'
import { statusColor } from '@/lib/vizPalette'
import { useStore } from '@/store/useStore'

export function StatusBadge({ status }: { status: Status }) {
  const theme = useStore((s) => s.theme)
  return (
    <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-ink-secondary">
      <span
        className="h-[7px] w-[7px] shrink-0 rounded-full"
        style={{ backgroundColor: statusColor(status, theme) }}
        aria-hidden="true"
      />
      {STATUS_LABELS[status]}
    </span>
  )
}
