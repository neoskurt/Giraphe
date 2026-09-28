import { Moon, Sun } from 'lucide-react'
import { useStore } from '@/store/useStore'

export function ThemeToggle() {
  const theme = useStore((s) => s.theme)
  const toggleTheme = useStore((s) => s.toggleTheme)

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
      aria-pressed={theme === 'dark'}
      className="flex h-9 w-9 items-center justify-center rounded-full text-ink-secondary transition-colors duration-fast hover:bg-sunken hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta"
    >
      {theme === 'dark' ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
    </button>
  )
}
