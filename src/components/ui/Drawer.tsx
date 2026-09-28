import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { springs, usePrefersReducedMotion } from '@/lib/motion'

interface DrawerProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  labelledBy?: string
}

export function Drawer({ open, onClose, children, labelledBy }: DrawerProps) {
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (!open) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <motion.div
            className="absolute inset-0 bg-ink/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            initial={{ x: reduced ? 0 : '100%', opacity: reduced ? 0 : 1 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: reduced ? 0 : '100%', opacity: reduced ? 0 : 1 }}
            transition={springs.release}
            className="relative flex h-full w-full max-w-2xl flex-col border-l border-line bg-surface shadow-lifted"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Fermer le panneau"
              className="absolute right-4 top-4 z-10 rounded-full p-1.5 text-ink-muted transition-colors duration-fast hover:bg-sunken hover:text-ink"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="flex-1 overflow-y-auto">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
