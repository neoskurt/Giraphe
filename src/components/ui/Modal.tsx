import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { springs, usePrefersReducedMotion } from '@/lib/motion'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  footer?: ReactNode
  maxWidthClassName?: string
}

export function Modal({ open, onClose, title, children, footer, maxWidthClassName = 'max-w-lg' }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (!open) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    dialogRef.current?.focus()
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            tabIndex={-1}
            initial={{ opacity: 0, y: reduced ? 0 : 10, scale: reduced ? 1 : 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reduced ? 0 : 6, scale: reduced ? 1 : 0.98 }}
            transition={springs.gentle}
            className={`relative w-full ${maxWidthClassName} max-h-[90vh] overflow-y-auto rounded-md border border-line bg-surface p-6 shadow-panel outline-none`}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 id="modal-title" className="font-display text-lg font-semibold text-ink">
                {title}
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Fermer"
                className="rounded-full p-1.5 text-ink-muted transition-colors duration-fast hover:bg-sunken hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {children}
            {footer && <div className="mt-6 flex justify-end gap-2">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
