import { useMemo } from 'react'
import type { FeedItem } from '@/types'
import { useStore } from '@/store/useStore'
import { CommentItem } from './CommentItem'
import { ActivityItem } from './ActivityItem'
import { CommentInput } from './CommentInput'

export function CommentThread({ ticketId }: { ticketId: string }) {
  const comments = useStore((s) => s.comments)
  const activity = useStore((s) => s.activity)

  const feed = useMemo<FeedItem[]>(() => {
    const items: FeedItem[] = [
      ...comments.filter((c) => c.ticketId === ticketId).map((c) => ({ kind: 'comment' as const, createdAt: c.createdAt, data: c })),
      ...activity.filter((a) => a.ticketId === ticketId).map((a) => ({ kind: 'activity' as const, createdAt: a.createdAt, data: a })),
    ]
    items.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    return items
  }, [comments, activity, ticketId])

  return (
    <div>
      <h3 className="mb-2 font-display text-heading font-semibold text-ink">Activité</h3>
      <ul className="divide-y divide-line/70">
        {feed.map((item) =>
          item.kind === 'comment' ? (
            <CommentItem key={item.data.id} comment={item.data} />
          ) : (
            <ActivityItem key={item.data.id} entry={item.data} />
          ),
        )}
      </ul>
      <div className="mt-4">
        <CommentInput ticketId={ticketId} />
      </div>
    </div>
  )
}
