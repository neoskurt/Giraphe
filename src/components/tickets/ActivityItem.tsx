import { ArrowRight, Flag, Sparkle, UserRound } from 'lucide-react'
import type { ActivityEntry } from '@/types'
import { getUser, userFullName } from '@/data/users'
import { PRIORITY_LABELS, STATUS_LABELS } from '@/lib/labels'
import { formatRelative } from '@/lib/date'

function describe(entry: ActivityEntry): { icon: typeof Flag; text: string } {
  const author = getUser(entry.authorId)
  const authorName = author ? userFullName(author) : 'Quelqu\'un'

  switch (entry.kind) {
    case 'creation':
      return { icon: Sparkle, text: `${authorName} a créé le ticket` }
    case 'status': {
      const from = entry.from ? STATUS_LABELS[entry.from as keyof typeof STATUS_LABELS] : '—'
      const to = entry.to ? STATUS_LABELS[entry.to as keyof typeof STATUS_LABELS] : '—'
      return { icon: ArrowRight, text: `${authorName} a changé le statut : ${from} → ${to}` }
    }
    case 'priority': {
      const from = entry.from ? PRIORITY_LABELS[entry.from as keyof typeof PRIORITY_LABELS] : '—'
      const to = entry.to ? PRIORITY_LABELS[entry.to as keyof typeof PRIORITY_LABELS] : '—'
      return { icon: Flag, text: `${authorName} a changé la priorité : ${from} → ${to}` }
    }
    case 'assignee': {
      const fromUser = getUser(entry.from)
      const toUser = getUser(entry.to)
      const from = fromUser ? userFullName(fromUser) : 'Non assigné'
      const to = toUser ? userFullName(toUser) : 'Non assigné'
      return { icon: UserRound, text: `${authorName} a réattribué : ${from} → ${to}` }
    }
    default:
      return { icon: Sparkle, text: `${authorName} a mis à jour le ticket` }
  }
}

export function ActivityItem({ entry }: { entry: ActivityEntry }) {
  const { icon: Icon, text } = describe(entry)
  return (
    <li className="flex items-center gap-3 py-2 text-sm text-ink-muted">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-line text-terracotta">
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      </span>
      <span className="flex-1 italic">{text}</span>
      <span className="shrink-0 text-xs">{formatRelative(entry.createdAt)}</span>
    </li>
  )
}
