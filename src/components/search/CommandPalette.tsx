import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import {
  CornerDownLeft,
  KanbanSquare,
  LayoutDashboard,
  List,
  Moon,
  Plus,
  Search,
  Sun,
} from 'lucide-react'
import { useStore } from '@/store/useStore'
import { useUiStore } from '@/store/useUiStore'
import { searchTickets } from '@/lib/search'
import { springs, usePrefersReducedMotion } from '@/lib/motion'
import { getUser } from '@/data/users'
import { PRIORITY_DOT } from '@/lib/labels'
import { Avatar } from '@/components/ui/Avatar'
import { Highlight } from '@/components/ui/Highlight'

type PaletteItem =
  | { kind: 'action'; key: string; label: string; hint?: string; icon: typeof Plus; run: () => void }
  | { kind: 'ticket'; key: string; ticket: ReturnType<typeof searchTickets>[number]['ticket'] }

export function CommandPalette() {
  const open = useUiStore((s) => s.commandPaletteOpen)
  const close = useUiStore((s) => s.closeCommandPalette)
  const toggle = useUiStore((s) => s.toggleCommandPalette)
  const openCreateTicket = useUiStore((s) => s.openCreateTicket)
  const tickets = useStore((s) => s.tickets)
  const toggleTheme = useStore((s) => s.toggleTheme)
  const theme = useStore((s) => s.theme)
  const navigate = useNavigate()
  const location = useLocation()
  const reduced = usePrefersReducedMotion()

  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        toggle()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [toggle])

  useEffect(() => {
    if (open) {
      setQuery('')
      setActiveIndex(0)
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [open])

  function openTicket(id: string) {
    navigate(`/tickets/${id}`, { state: { background: location } })
    close()
  }

  const items = useMemo<PaletteItem[]>(() => {
    if (!query.trim()) {
      return [
        { kind: 'action', key: 'new', label: 'Nouveau ticket', icon: Plus, run: () => openCreateTicket() },
        { kind: 'action', key: 'dash', label: 'Tableau de bord', icon: LayoutDashboard, run: () => navigate('/') },
        { kind: 'action', key: 'list', label: 'Liste des tickets', icon: List, run: () => navigate('/tickets') },
        { kind: 'action', key: 'kanban', label: 'Kanban', icon: KanbanSquare, run: () => navigate('/kanban') },
        {
          kind: 'action',
          key: 'theme',
          label: theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre',
          icon: theme === 'dark' ? Sun : Moon,
          run: () => toggleTheme(),
        },
      ]
    }
    const results = searchTickets(tickets, query, 8).map<PaletteItem>((r) => ({
      kind: 'ticket',
      key: r.ticket.id,
      ticket: r.ticket,
    }))
    results.push({
      kind: 'action',
      key: 'create-from-query',
      label: `Créer un ticket « ${query.trim()} »`,
      icon: Plus,
      run: () => {
        openCreateTicket({ defaultTitle: query.trim() })
      },
    })
    return results
  }, [query, tickets, theme, navigate, openCreateTicket, toggleTheme])

  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  function activate(item: PaletteItem) {
    if (item.kind === 'ticket') {
      openTicket(item.ticket.id)
    } else {
      item.run()
      close()
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, items.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const item = items[activeIndex]
      if (item) activate(item)
    } else if (e.key === 'Escape') {
      close()
    }
  }

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70] flex justify-center px-4 pt-[12vh]">
          <motion.div
            className="absolute inset-0 bg-ink/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={close}
            aria-hidden="true"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Recherche et actions rapides"
            initial={{ opacity: 0, y: reduced ? 0 : -12, scale: reduced ? 1 : 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reduced ? 0 : -8, scale: reduced ? 1 : 0.97 }}
            transition={springs.gentle}
            className="relative flex h-fit max-h-[70vh] w-full max-w-xl flex-col overflow-hidden rounded-md border border-line bg-surface shadow-lifted"
          >
            <div className="flex items-center gap-2.5 border-b border-line px-4 py-3">
              <Search className="h-4 w-4 shrink-0 text-ink-muted" aria-hidden="true" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Rechercher un ticket, une action…"
                aria-label="Rechercher un ticket ou une action"
                aria-activedescendant={items[activeIndex] ? `cmdk-${items[activeIndex].key}` : undefined}
                role="combobox"
                aria-expanded="true"
                aria-controls="cmdk-list"
                className="flex-1 bg-transparent text-sm text-ink placeholder:text-ink-muted focus:outline-none"
              />
              <kbd className="rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-ink-muted">
                esc
              </kbd>
            </div>

            <ul id="cmdk-list" role="listbox" className="flex-1 overflow-y-auto p-1.5">
              <AnimatePresence initial={false} mode="popLayout">
                {items.map((item, index) => {
                  const isActive = index === activeIndex
                  if (item.kind === 'action') {
                    const Icon = item.icon
                    return (
                      <motion.li
                        key={item.key}
                        id={`cmdk-${item.key}`}
                        layout={!reduced}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.12 }}
                      >
                        <button
                          type="button"
                          role="option"
                          aria-selected={isActive}
                          onMouseEnter={() => setActiveIndex(index)}
                          onClick={() => activate(item)}
                          className={`flex w-full items-center gap-3 rounded px-3 py-2.5 text-left text-sm transition-colors duration-instant ${
                            isActive ? 'bg-terracotta-soft/60 text-ink' : 'text-ink-secondary'
                          }`}
                        >
                          <Icon className="h-4 w-4 shrink-0 text-terracotta" aria-hidden="true" />
                          <span className="flex-1">{item.label}</span>
                          {isActive && <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-ink-muted" />}
                        </button>
                      </motion.li>
                    )
                  }

                  const t = item.ticket
                  const assignee = getUser(t.assigneeId)
                  return (
                    <motion.li
                      key={item.key}
                      id={`cmdk-${item.key}`}
                      layout={!reduced}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.12 }}
                    >
                      <button
                        type="button"
                        role="option"
                        aria-selected={isActive}
                        onMouseEnter={() => setActiveIndex(index)}
                        onClick={() => activate(item)}
                        className={`flex w-full items-center gap-3 rounded px-3 py-2.5 text-left text-sm transition-colors duration-instant ${
                          isActive ? 'bg-terracotta-soft/60' : ''
                        }`}
                      >
                        <span
                          className="h-[7px] w-[7px] shrink-0 rounded-full"
                          style={{ backgroundColor: PRIORITY_DOT[t.priority] }}
                          aria-hidden="true"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-medium text-ink">
                            <Highlight text={t.title} query={query} />
                          </span>
                          <span className="block font-mono text-[11px] text-ink-muted">
                            <Highlight text={t.id} query={query} />
                          </span>
                        </span>
                        <Avatar user={assignee} size="sm" />
                      </button>
                    </motion.li>
                  )
                })}
              </AnimatePresence>
            </ul>

            <div className="flex items-center gap-3 border-t border-line px-4 py-2 text-[11px] text-ink-muted">
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-line px-1 py-0.5 font-mono">↑↓</kbd> naviguer
              </span>
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-line px-1 py-0.5 font-mono">↵</kbd> ouvrir
              </span>
              <span className="ml-auto flex items-center gap-1">
                <kbd className="rounded border border-line px-1 py-0.5 font-mono">⌘K</kbd> pour rouvrir
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
