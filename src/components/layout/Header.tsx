import { Plus, Search } from 'lucide-react'
import { Logo } from './Logo'
import { Nav } from './Nav'
import { UserSwitcher } from './UserSwitcher'
import { ThemeToggle } from './ThemeToggle'
import { Button } from '@/components/ui/Button'
import { useUiStore } from '@/store/useUiStore'

export function Header() {
  const openCreateTicket = useUiStore((s) => s.openCreateTicket)
  const openCommandPalette = useUiStore((s) => s.openCommandPalette)

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-cream/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <div className="flex shrink-0 items-center gap-7">
          <Logo />
          <Nav />
        </div>

        <button
          type="button"
          onClick={openCommandPalette}
          className="ml-2 hidden flex-1 items-center gap-2 rounded border border-line bg-surface px-3 py-1.5 text-left text-sm text-ink-muted transition-colors duration-fast hover:border-terracotta/50 hover:text-ink-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta md:flex md:max-w-xs"
        >
          <Search className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span className="flex-1 truncate">Rechercher…</span>
          <kbd className="shrink-0 rounded border border-line bg-cream px-1.5 py-0.5 font-mono text-[10px] text-ink-muted">
            ⌘K
          </kbd>
        </button>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={openCommandPalette}
            aria-label="Rechercher"
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink-secondary transition-colors duration-fast hover:bg-sunken hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta md:hidden"
          >
            <Search className="h-[18px] w-[18px]" />
          </button>
          <Button variant="primary" size="sm" onClick={() => openCreateTicket()}>
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Nouveau ticket</span>
          </Button>
          <ThemeToggle />
          <UserSwitcher />
        </div>
      </div>
    </header>
  )
}
