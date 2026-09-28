export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <svg viewBox="0 0 32 32" className="h-7 w-7" fill="none" aria-hidden="true">
        <path
          d="M14 8c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2"
          stroke="rgb(var(--color-ink))"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M15 10v6.5c0 1 .4 1.9 1.1 2.6l1.3 1.3c.7.7 1.1 1.6 1.1 2.6V24"
          stroke="rgb(var(--color-ink))"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="15.2" cy="12.5" r="1" fill="rgb(var(--color-terracotta))" />
        <circle cx="15.2" cy="15.5" r="1" fill="rgb(var(--color-terracotta))" />
        <circle cx="19" cy="21" r="1" fill="rgb(var(--color-terracotta))" />
        <path
          d="M18.5 24c0 1.7-1.3 3-3 3"
          stroke="rgb(var(--color-ink))"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <span className="font-display text-[19px] font-semibold italic tracking-tight text-ink">
        Giraphe
      </span>
    </div>
  )
}
