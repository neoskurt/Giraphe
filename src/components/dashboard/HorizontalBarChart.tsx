import { useEffect, useState } from 'react'
import { useStore } from '@/store/useStore'
import { VIZ_CHROME } from '@/lib/vizPalette'
import { usePrefersReducedMotion } from '@/lib/motion'

export interface BarDatum {
  key: string
  label: string
  value: number
  color: string
}

interface HorizontalBarChartProps {
  title: string
  data: BarDatum[]
  onBarClick?: (key: string) => void
}

export function HorizontalBarChart({ title, data, onBarClick }: HorizontalBarChartProps) {
  const theme = useStore((s) => s.theme)
  const track = VIZ_CHROME.track[theme]
  const textSecondary = VIZ_CHROME.textSecondary[theme]
  const max = Math.max(1, ...data.map((d) => d.value))
  const reduced = usePrefersReducedMotion()
  const [grown, setGrown] = useState(reduced)

  useEffect(() => {
    if (reduced) return
    const raf = requestAnimationFrame(() => setGrown(true))
    return () => cancelAnimationFrame(raf)
  }, [reduced])

  return (
    <div className="rounded-md border border-line bg-surface p-4">
      <h3 className="mb-3 font-display text-heading font-semibold text-ink">{title}</h3>
      <div role="img" aria-label={`${title} : ${data.map((d) => `${d.label} ${d.value}`).join(', ')}`} className="space-y-2.5">
        {data.map((d) => {
          const widthPct = Math.max(3, (d.value / max) * 100)
          const Comp = onBarClick ? 'button' : 'div'
          return (
            <Comp
              key={d.key}
              type={onBarClick ? 'button' : undefined}
              onClick={onBarClick ? () => onBarClick(d.key) : undefined}
              className={`flex w-full items-center gap-3 text-left ${onBarClick ? 'group cursor-pointer' : ''}`}
            >
              <span className="w-24 shrink-0 truncate text-xs font-medium" style={{ color: textSecondary }}>
                {d.label}
              </span>
              <span className="h-2.5 flex-1 overflow-hidden rounded-sm" style={{ backgroundColor: track }}>
                <span
                  className="block h-full origin-left rounded-sm transition-transform duration-slow ease-smooth group-hover:opacity-80"
                  style={{
                    width: `${widthPct}%`,
                    backgroundColor: d.color,
                    transform: grown ? 'scaleX(1)' : 'scaleX(0)',
                  }}
                />
              </span>
              <span className="tabular w-6 shrink-0 text-right text-xs font-semibold text-ink">{d.value}</span>
            </Comp>
          )
        })}
      </div>
      <table className="sr-only">
        <caption>{title}</caption>
        <thead>
          <tr>
            <th scope="col">Catégorie</th>
            <th scope="col">Nombre de tickets</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.key}>
              <td>{d.label}</td>
              <td>{d.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
