import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-md border border-dashed border-line px-6 py-14 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-terracotta">
        <Icon className="h-5 w-5" aria-hidden="true" strokeWidth={1.75} />
      </div>
      <p className="font-display text-base font-semibold text-ink">{title}</p>
      {description && <p className="max-w-sm text-sm text-ink-muted">{description}</p>}
      {action}
    </div>
  )
}
