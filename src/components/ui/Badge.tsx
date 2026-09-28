import clsx from 'clsx'
import type { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  className?: string
  dotColor?: string
}

export function Badge({ children, className, dotColor }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 text-[12px] font-medium text-ink-secondary',
        className,
      )}
    >
      {dotColor && <span className={clsx('h-[7px] w-[7px] shrink-0 rounded-full', dotColor)} aria-hidden="true" />}
      {children}
    </span>
  )
}

export function TagBadge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-sm border border-line px-1.5 py-0.5 text-[11px] font-medium text-ink-secondary">
      {children}
    </span>
  )
}
