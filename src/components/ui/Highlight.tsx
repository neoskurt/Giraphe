import { splitHighlight } from '@/lib/search'

export function Highlight({ text, query }: { text: string; query: string }) {
  const parts = splitHighlight(text, query)
  return (
    <>
      {parts.map((part, i) =>
        part.match ? (
          <mark key={i} className="rounded-sm bg-terracotta-soft text-ink">
            {part.text}
          </mark>
        ) : (
          <span key={i}>{part.text}</span>
        ),
      )}
    </>
  )
}
