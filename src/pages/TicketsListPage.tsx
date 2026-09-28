import { useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { ClipboardList } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { SearchBar } from '@/components/list/SearchBar'
import { TicketFilters, DEFAULT_FILTERS, type Filters } from '@/components/list/TicketFilters'
import { TicketTable, type SortKey } from '@/components/list/TicketTable'
import { EmptyState } from '@/components/ui/EmptyState'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Drawer } from '@/components/ui/Drawer'
import { Button } from '@/components/ui/Button'
import { useUiStore } from '@/store/useUiStore'
import { PRIORITY_ORDER } from '@/lib/labels'
import { TicketDetailPanel } from '@/components/tickets/TicketDetailPanel'

export function TicketsListPage() {
  const tickets = useStore((s) => s.tickets)
  const deleteTicket = useStore((s) => s.deleteTicket)
  const openCreateTicket = useUiStore((s) => s.openCreateTicket)
  const currentUser = useCurrentUser()
  const navigate = useNavigate()
  const { id: directTicketId } = useParams<{ id: string }>()
  const location = useLocation()

  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [sortKey, setSortKey] = useState<SortKey>('priority')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  function openTicket(id: string) {
    navigate(`/tickets/${id}`, { state: { background: location } })
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return tickets.filter((t) => {
      if (filters.status !== 'all' && t.status !== filters.status) return false
      if (filters.priority !== 'all' && t.priority !== filters.priority) return false
      if (filters.team !== 'all' && t.team !== filters.team) return false
      if (filters.type !== 'all' && t.type !== filters.type) return false
      if (filters.assigneeId === 'unassigned' && t.assigneeId) return false
      if (
        filters.assigneeId !== 'all' &&
        filters.assigneeId !== 'unassigned' &&
        t.assigneeId !== filters.assigneeId
      )
        return false
      if (filters.mine && t.assigneeId !== currentUser.id) return false
      if (q) {
        const haystack = `${t.id} ${t.title} ${t.tags.join(' ')}`.toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })
  }, [tickets, query, filters, currentUser.id])

  const sorted = useMemo(() => {
    const copy = [...filtered]
    copy.sort((a, b) => {
      let cmp = 0
      if (sortKey === 'priority') {
        cmp = PRIORITY_ORDER.indexOf(a.priority) - PRIORITY_ORDER.indexOf(b.priority)
      } else if (sortKey === 'dueDate') {
        const aTime = a.dueDate ? new Date(a.dueDate).getTime() : Infinity
        const bTime = b.dueDate ? new Date(b.dueDate).getTime() : Infinity
        cmp = aTime - bTime
      } else {
        cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      }
      return sortDir === 'asc' ? cmp : -cmp
    })
    return copy
  }, [filtered, sortKey, sortDir])

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-display-lg font-semibold text-ink">Liste des tickets</h1>
          <p className="text-sm text-ink-muted">
            {sorted.length} ticket{sorted.length > 1 ? 's' : ''} affiché{sorted.length > 1 ? 's' : ''} sur{' '}
            {tickets.length}
          </p>
        </div>
        <Button variant="primary" onClick={() => openCreateTicket()}>
          Nouveau ticket
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SearchBar value={query} onChange={setQuery} />
        <TicketFilters filters={filters} onChange={setFilters} />
      </div>

      {sorted.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="Aucun ticket ne correspond"
          description="Essayez d'élargir vos filtres ou votre recherche."
          action={
            <Button variant="secondary" onClick={() => { setFilters(DEFAULT_FILTERS); setQuery('') }}>
              Réinitialiser les filtres
            </Button>
          }
        />
      ) : (
        <TicketTable
          tickets={sorted}
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={handleSort}
          onOpen={openTicket}
          onDeleteRequest={setPendingDeleteId}
        />
      )}

      <ConfirmDialog
        open={pendingDeleteId !== null}
        title="Supprimer ce ticket ?"
        message={`Le ticket ${pendingDeleteId} sera définitivement supprimé, ainsi que ses commentaires et son historique. Cette action est irréversible.`}
        confirmLabel="Supprimer"
        danger
        onCancel={() => setPendingDeleteId(null)}
        onConfirm={() => {
          if (pendingDeleteId) deleteTicket(pendingDeleteId)
          setPendingDeleteId(null)
        }}
      />

      {directTicketId && (
        <Drawer open onClose={() => navigate('/tickets')} labelledBy="ticket-detail-title">
          <TicketDetailPanel ticketId={directTicketId} />
        </Drawer>
      )}
    </div>
  )
}
