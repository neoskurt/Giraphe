import { Search, X } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative min-w-[220px] flex-1">
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted"
        aria-hidden="true"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Rechercher un ticket (titre, ID, tag…)"
        aria-label="Rechercher un ticket"
        className="w-full rounded border border-line bg-surface py-2 pl-9 pr-8 text-sm text-ink placeholder:text-ink-muted transition-colors duration-fast focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Effacer la recherche"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-ink-muted transition-colors duration-fast hover:bg-sunken hover:text-ink"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  )
}
