import { useEffect, useRef } from 'react'
import type { LucideIcon } from 'lucide-react'
import { animate } from 'motion'
import clsx from 'clsx'
import { motionTokens, usePrefersReducedMotion } from '@/lib/motion'

interface StatTileProps {
  icon: LucideIcon
  label: string
  value: number
  accent?: 'default' | 'critical'
}

function Counter({ to }: { to: number }) {
  const nodeRef = useRef<HTMLSpanElement>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (!nodeRef.current) return
    if (reduced) {
      nodeRef.current.textContent = String(to)
      return
    }
    const controls = animate(0, to, {
      duration: motionTokens.duration.slow + 0.2,
      ease: motionTokens.easing.smooth,
      onUpdate: (v) => {
        if (nodeRef.current) nodeRef.current.textContent = String(Math.round(v))
      },
    })
    return () => controls.stop()
  }, [to, reduced])

  return <span ref={nodeRef} className="tabular">0</span>
}

export function StatTile({ icon: Icon, label, value, accent = 'default' }: StatTileProps) {
  return (
    <div className={clsx('border-t-2 pt-3', accent === 'critical' ? 'border-danger' : 'border-line')}>
      <div className="flex items-center gap-2">
        <Icon
          className={clsx('h-4 w-4', accent === 'critical' ? 'text-danger' : 'text-terracotta')}
          aria-hidden="true"
        />
        <span className="font-sans text-eyebrow font-semibold uppercase text-ink-muted">{label}</span>
      </div>
      <p
        className={clsx(
          'mt-1.5 font-display text-display-xl font-semibold',
          accent === 'critical' ? 'text-danger' : 'text-ink',
        )}
      >
        <Counter to={value} />
      </p>
    </div>
  )
}
