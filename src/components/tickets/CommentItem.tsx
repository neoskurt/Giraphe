import type { Comment } from '@/types'
import { getUser, userFullName, users } from '@/data/users'
import { Avatar } from '@/components/ui/Avatar'
import { formatRelative } from '@/lib/date'
import { motion } from 'motion/react'
import { Fragment } from 'react'
import { fadeRise, springs, usePrefersReducedMotion } from '@/lib/motion'

function renderContent(content: string) {
  const parts = content.split(/(@[\p{L}]+)/gu)
  return parts.map((part, index) => {
    if (part.startsWith('@')) {
      const name = part.slice(1).toLowerCase()
      const mentioned = users.find((u) => u.firstName.toLowerCase() === name)
      if (mentioned) {
        return (
          <span key={index} className="rounded bg-terracotta-soft px-1 py-0.5 font-medium text-ink">
            {part}
          </span>
        )
      }
    }
    return <Fragment key={index}>{part}</Fragment>
  })
}

export function CommentItem({ comment }: { comment: Comment }) {
  const author = getUser(comment.authorId)
  const reduced = usePrefersReducedMotion()
  const { initial, animate } = fadeRise(reduced)

  return (
    <motion.li initial={initial} animate={animate} transition={springs.gentle} className="flex gap-3 py-3">
      <Avatar user={author} size="md" />
      <div className="flex-1">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-semibold text-ink">
            {author ? userFullName(author) : 'Utilisateur inconnu'}
          </span>
          <span className="text-xs text-ink-muted">{formatRelative(comment.createdAt)}</span>
        </div>
        <p className="mt-1 whitespace-pre-wrap text-sm text-ink-secondary">{renderContent(comment.content)}</p>
      </div>
    </motion.li>
  )
}
