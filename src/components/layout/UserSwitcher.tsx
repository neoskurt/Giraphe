import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useStore } from '@/store/useStore'
import { users, userFullName } from '@/data/users'
import { Avatar } from '@/components/ui/Avatar'
import { springs } from '@/lib/motion'

export function UserSwitcher() {
  const [open, setOpen] = useState(false)
  const currentUserId = useStore((s) => s.currentUserId)
  const setCurrentUser = useStore((s) => s.setCurrentUser)
  const currentUser = users.find((u) => u.id === currentUserId) ?? users[0]
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2.5 transition-colors duration-fast hover:bg-sunken focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta"
      >
        <Avatar user={currentUser} size="sm" />
        <span className="hidden text-sm font-medium text-ink sm:inline">{currentUser.firstName}</span>
        <ChevronDown className="h-3.5 w-3.5 text-ink-muted" aria-hidden="true" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            aria-label="Changer d'utilisateur connecté"
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={springs.snappy}
            className="absolute right-0 z-20 mt-2 w-64 overflow-hidden rounded-md border border-line bg-surface py-1 shadow-panel"
          >
            {users.map((user) => (
              <li key={user.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={user.id === currentUserId}
                  onClick={() => {
                    setCurrentUser(user.id)
                    setOpen(false)
                  }}
                  className={`flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition-colors duration-fast hover:bg-sunken ${
                    user.id === currentUserId ? 'bg-terracotta-soft/50' : ''
                  }`}
                >
                  <Avatar user={user} size="sm" />
                  <span className="flex-1">
                    <span className="block font-medium text-ink">{userFullName(user)}</span>
                    <span className="block text-xs text-ink-muted">
                      {user.role} · {user.team}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
