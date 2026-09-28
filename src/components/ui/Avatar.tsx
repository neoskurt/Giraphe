import { userFullName, userInitials } from '@/data/users'
import type { User } from '@/types'
import clsx from 'clsx'

const SIZES = {
  sm: 'h-6 w-6 text-[10px]',
  md: 'h-8 w-8 text-xs',
  lg: 'h-11 w-11 text-sm',
} as const

interface AvatarProps {
  user: User | undefined
  size?: keyof typeof SIZES
  className?: string
  title?: string
}

export function Avatar({ user, size = 'md', className, title }: AvatarProps) {
  if (!user) {
    return (
      <div
        role="img"
        aria-label="Non assigné"
        title={title ?? 'Non assigné'}
        className={clsx(
          'flex shrink-0 items-center justify-center rounded-full border border-dashed border-ink-muted/50 font-display italic text-ink-muted',
          SIZES[size],
          className,
        )}
      >
        <span aria-hidden="true">?</span>
      </div>
    )
  }

  return (
    <div
      role="img"
      aria-label={userFullName(user)}
      title={title ?? userFullName(user)}
      className={clsx(
        'flex shrink-0 items-center justify-center rounded-full font-semibold text-cream ring-1 ring-inset ring-black/10',
        SIZES[size],
        className,
      )}
      style={{ backgroundColor: user.avatarColor }}
    >
      {userInitials(user)}
    </div>
  )
}
