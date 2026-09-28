import { useState, useRef, useEffect } from 'react'
import { users, userFullName } from '@/data/users'
import { Avatar } from '@/components/ui/Avatar'
import { useStore } from '@/store/useStore'
import { ChevronDown } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { springs } from '@/lib/motion'

interface AssigneeSelectProps {
  ticketId: string
  assigneeId: string | null
  compact?: boolean
}

export function AssigneeSelect({ ticketId, assigneeId, compact = false }: AssigneeSelectProps) {
  const [open, setOpen] = useState(false)
  const assignTicket = useStore((s) => s.assignTicket)
  const currentUser = users.find((u) => u.id === assigneeId)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          setOpen((v) => !v)
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={currentUser ? `Assigné à ${userFullName(currentUser)}, cliquer pour réattribuer` : 'Non assigné, cliquer pour assigner'}
        className="flex items-center gap-1 rounded-full p-0.5 transition-shadow duration-fast hover:ring-2 hover:ring-terracotta/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta"
      >
        <Avatar user={currentUser} size={compact ? 'sm' : 'md'} />
        {!compact && <ChevronDown className="h-3 w-3 text-ink-muted" aria-hidden="true" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            aria-label="Attribuer le ticket"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={springs.snappy}
            className="absolute right-0 z-20 mt-2 max-h-64 w-56 overflow-y-auto rounded-md border border-line bg-surface py-1 shadow-panel"
          >
            <li>
              <button
                type="button"
                role="option"
                aria-selected={assigneeId === null}
                onClick={() => {
                  assignTicket(ticketId, null)
                  setOpen(false)
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-ink-muted transition-colors duration-fast hover:bg-sunken"
              >
                <Avatar user={undefined} size="sm" />
                Non assigné
              </button>
            </li>
            {users.map((user) => (
              <li key={user.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={assigneeId === user.id}
                  onClick={() => {
                    assignTicket(ticketId, user.id)
                    setOpen(false)
                  }}
                  className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors duration-fast hover:bg-sunken ${
                    assigneeId === user.id ? 'bg-terracotta-soft/50' : ''
                  }`}
                >
                  <Avatar user={user} size="sm" />
                  {userFullName(user)}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
