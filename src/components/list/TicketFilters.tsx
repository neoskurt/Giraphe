import { users, userFullName } from '@/data/users'
import { PRIORITY_LABELS, STATUS_LABELS, TYPE_LABELS } from '@/lib/labels'
import type { Priority, Status, Team, TicketType } from '@/types'
import { useCurrentUser } from '@/hooks/useCurrentUser'

export interface Filters {
  status: Status | 'all'
  priority: Priority | 'all'
  assigneeId: string | 'all' | 'unassigned'
  team: Team | 'all'
  type: TicketType | 'all'
  mine: boolean
}

export const DEFAULT_FILTERS: Filters = {
  status: 'all',
  priority: 'all',
  assigneeId: 'all',
  team: 'all',
  type: 'all',
  mine: false,
}

const TEAMS: Team[] = ['Support', 'Produit', 'Tech', 'Ops']

const selectClass =
  'rounded border border-line bg-surface px-2.5 py-2 text-sm text-ink transition-colors duration-fast focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta'

interface TicketFiltersProps {
  filters: Filters
  onChange: (filters: Filters) => void
}

export function TicketFilters({ filters, onChange }: TicketFiltersProps) {
  const currentUser = useCurrentUser()

  function set<K extends keyof Filters>(key: K, value: Filters[K]) {
    onChange({ ...filters, [key]: value })
  }

  const hasActiveFilters =
    filters.status !== 'all' ||
    filters.priority !== 'all' ||
    filters.assigneeId !== 'all' ||
    filters.team !== 'all' ||
    filters.type !== 'all' ||
    filters.mine

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        aria-label="Filtrer par statut"
        className={selectClass}
        value={filters.status}
        onChange={(e) => set('status', e.target.value as Filters['status'])}
      >
        <option value="all">Tous les statuts</option>
        {(Object.keys(STATUS_LABELS) as Status[]).map((s) => (
          <option key={s} value={s}>
            {STATUS_LABELS[s]}
          </option>
        ))}
      </select>

      <select
        aria-label="Filtrer par priorité"
        className={selectClass}
        value={filters.priority}
        onChange={(e) => set('priority', e.target.value as Filters['priority'])}
      >
        <option value="all">Toutes les priorités</option>
        {(Object.keys(PRIORITY_LABELS) as Priority[]).map((p) => (
          <option key={p} value={p}>
            {PRIORITY_LABELS[p]} ({p})
          </option>
        ))}
      </select>

      <select
        aria-label="Filtrer par type"
        className={selectClass}
        value={filters.type}
        onChange={(e) => set('type', e.target.value as Filters['type'])}
      >
        <option value="all">Tous les types</option>
        {(Object.keys(TYPE_LABELS) as TicketType[]).map((t) => (
          <option key={t} value={t}>
            {TYPE_LABELS[t]}
          </option>
        ))}
      </select>

      <select
        aria-label="Filtrer par équipe"
        className={selectClass}
        value={filters.team}
        onChange={(e) => set('team', e.target.value as Filters['team'])}
      >
        <option value="all">Toutes les équipes</option>
        {TEAMS.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>

      <select
        aria-label="Filtrer par assigné"
        className={selectClass}
        value={filters.assigneeId}
        onChange={(e) => set('assigneeId', e.target.value as Filters['assigneeId'])}
      >
        <option value="all">Tous les assignés</option>
        <option value="unassigned">Non assigné</option>
        {users.map((u) => (
          <option key={u.id} value={u.id}>
            {userFullName(u)}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={() => set('mine', !filters.mine)}
        aria-pressed={filters.mine}
        className={`rounded border px-3 py-2 text-sm font-medium transition-colors duration-fast ${
          filters.mine
            ? 'border-terracotta bg-terracotta text-cream'
            : 'border-line bg-surface text-ink hover:bg-sunken'
        }`}
      >
        Mes tickets ({currentUser.firstName})
      </button>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={() => onChange(DEFAULT_FILTERS)}
          className="text-sm font-medium text-terracotta underline-offset-2 hover:underline"
        >
          Réinitialiser
        </button>
      )}
    </div>
  )
}
