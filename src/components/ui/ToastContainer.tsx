import { CheckCircle2, Info, XCircle } from 'lucide-react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { useStore } from '@/store/useStore'
import { springs, usePrefersReducedMotion } from '@/lib/motion'
import clsx from 'clsx'

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
}

const ACCENTS = {
  success: 'text-[#3F7D53]',
  error: 'text-danger',
  info: 'text-terracotta',
}

export function ToastContainer() {
  const toasts = useStore((s) => s.toasts)
  const dismissToast = useStore((s) => s.dismissToast)
  const reduced = usePrefersReducedMotion()

  return createPortal(
    <div
      className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2"
      role="status"
      aria-live="polite"
    >
      <AnimatePresence mode="sync">
        {toasts.map((toast) => {
          const Icon = ICONS[toast.variant]
          return (
            <motion.div
              key={toast.id}
              layout={!reduced}
              initial={{ opacity: 0, x: reduced ? 0 : 32, scale: reduced ? 1 : 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: reduced ? 0 : 32, scale: reduced ? 1 : 0.97 }}
              transition={springs.snappy}
              className="pointer-events-auto flex items-start gap-2.5 rounded-md border border-line bg-surface px-4 py-3 text-sm font-medium text-ink shadow-panel"
            >
              <Icon className={clsx('mt-0.5 h-4 w-4 shrink-0', ACCENTS[toast.variant])} aria-hidden="true" />
              <span className="flex-1">{toast.message}</span>
              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                aria-label="Fermer la notification"
                className="text-ink-muted transition-colors duration-fast hover:text-ink"
              >
                ×
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>,
    document.body,
  )
}
