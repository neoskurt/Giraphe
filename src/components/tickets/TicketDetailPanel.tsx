import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { Eye, FileQuestion, Pencil, Tag as TagIcon, Trash2, X } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { getUser, userFullName, users } from '@/data/users'
import type { Priority, Status, Team, TicketType } from '@/types'
import { PRIORITY_LABELS, STATUS_LABELS, TYPE_LABELS } from '@/lib/labels'
import { formatDate, formatRelative, isOverdue } from '@/lib/date'
import { Avatar } from '@/components/ui/Avatar'
import { AssigneeSelect } from '@/components/tickets/AssigneeSelect'
import { PriorityBadge } from '@/components/tickets/PriorityBadge'
import { TypeBadge } from '@/components/tickets/TypeBadge'
import { TagBadge } from '@/components/ui/Badge'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Button } from '@/components/ui/Button'
import { CommentThread } from '@/components/tickets/CommentThread'
import { EmptyState } from '@/components/ui/EmptyState'

const TEAMS: Team[] = ['Support', 'Produit', 'Tech', 'Ops']
const TYPES: TicketType[] = ['bug', 'demande', 'incident', 'amelioration']
const PRIORITIES: Priority[] = ['P0', 'P1', 'P2', 'P3']
const STATUSES: Status[] = ['a_trier', 'a_faire', 'en_cours', 'en_revue', 'termine', 'annule']

const selectClass =
  'rounded border border-line bg-surface px-2 py-1.5 text-sm text-ink transition-colors duration-fast focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta'

const labelClass = 'mb-1 block font-sans text-eyebrow font-semibold uppercase text-ink-muted'

export function TicketDetailPanel({ ticketId }: { ticketId: string }) {
  const ticket = useStore((s) => s.tickets.find((t) => t.id === ticketId))
  const updateTicket = useStore((s) => s.updateTicket)
  const deleteTicket = useStore((s) => s.deleteTicket)
  const navigate = useNavigate()

  const [editingTitle, setEditingTitle] = useState(false)
  const [titleDraft, setTitleDraft] = useState(ticket?.title ?? '')
  const [editingDescription, setEditingDescription] = useState(false)
  const [descriptionDraft, setDescriptionDraft] = useState(ticket?.description ?? '')
  const [previewDescription, setPreviewDescription] = useState(false)
  const [editingTags, setEditingTags] = useState(false)
  const [tagsDraft, setTagsDraft] = useState(ticket?.tags.join(', ') ?? '')
  const [confirmDelete, setConfirmDelete] = useState(false)

  if (!ticket) {
    return (
      <div className="p-6">
        <EmptyState
          icon={FileQuestion}
          title="Ticket introuvable"
          description="Ce ticket a peut-être été supprimé."
        />
      </div>
    )
  }

  const creator = getUser(ticket.creatorId)
  const overdue = isOverdue(ticket.dueDate, ticket.status)

  function saveTitle() {
    const trimmed = titleDraft.trim()
    if (trimmed && trimmed !== ticket!.title) updateTicket(ticket!.id, { title: trimmed })
    setEditingTitle(false)
  }

  function saveDescription() {
    updateTicket(ticket!.id, { description: descriptionDraft })
    setEditingDescription(false)
  }

  function saveTags() {
    const tags = tagsDraft
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
    updateTicket(ticket!.id, { tags })
    setEditingTags(false)
  }

  function handleDelete() {
    deleteTicket(ticket!.id)
    setConfirmDelete(false)
    navigate('/tickets')
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-line px-6 py-5">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-xs text-ink-muted">{ticket.id}</span>
          <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(true)}>
            <Trash2 className="h-3.5 w-3.5" />
            Supprimer
          </Button>
        </div>

        {editingTitle ? (
          <input
            autoFocus
            value={titleDraft}
            onChange={(e) => setTitleDraft(e.target.value)}
            onBlur={saveTitle}
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveTitle()
              if (e.key === 'Escape') {
                setTitleDraft(ticket.title)
                setEditingTitle(false)
              }
            }}
            className="mt-1 w-full rounded border border-terracotta bg-surface px-2 py-1 font-display text-xl font-semibold text-ink focus:outline-none"
          />
        ) : (
          <button
            type="button"
            onClick={() => {
              setTitleDraft(ticket.title)
              setEditingTitle(true)
            }}
            className="mt-1 block w-full rounded px-2 py-1 text-left font-display text-xl font-semibold text-ink transition-colors duration-fast hover:bg-sunken"
            id="ticket-detail-title"
          >
            {ticket.title}
          </button>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <select
            aria-label="Statut"
            className={selectClass}
            value={ticket.status}
            onChange={(e) => updateTicket(ticket.id, { status: e.target.value as Status })}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
          <select
            aria-label="Priorité"
            className={selectClass}
            value={ticket.priority}
            onChange={(e) => updateTicket(ticket.id, { priority: e.target.value as Priority })}
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {PRIORITY_LABELS[p]} ({p})
              </option>
            ))}
          </select>
          <PriorityBadge priority={ticket.priority} />
          <TypeBadge type={ticket.type} />
        </div>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className={labelClass}>Assigné</span>
            <div className="flex items-center gap-2">
              <AssigneeSelect ticketId={ticket.id} assigneeId={ticket.assigneeId} />
              <span className="text-ink-secondary">
                {ticket.assigneeId ? userFullName(users.find((u) => u.id === ticket.assigneeId)!) : 'Non assigné'}
              </span>
            </div>
          </div>
          <div>
            <span className={labelClass}>Créateur</span>
            <div className="flex items-center gap-2">
              <Avatar user={creator} size="sm" />
              <span className="text-ink-secondary">{creator ? userFullName(creator) : 'Inconnu'}</span>
            </div>
          </div>
          <div>
            <span className={labelClass}>Type</span>
            <select
              aria-label="Type de ticket"
              className={selectClass}
              value={ticket.type}
              onChange={(e) => updateTicket(ticket.id, { type: e.target.value as TicketType })}
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {TYPE_LABELS[t]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <span className={labelClass}>Équipe</span>
            <select
              aria-label="Équipe concernée"
              className={selectClass}
              value={ticket.team}
              onChange={(e) => updateTicket(ticket.id, { team: e.target.value as Team })}
            >
              {TEAMS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <span className={labelClass}>Échéance</span>
            <input
              type="date"
              aria-label="Date d'échéance"
              className={selectClass}
              value={ticket.dueDate ? ticket.dueDate.slice(0, 10) : ''}
              onChange={(e) =>
                updateTicket(ticket.id, { dueDate: e.target.value ? new Date(e.target.value).toISOString() : null })
              }
            />
            {overdue && <p className="mt-1 text-xs font-medium text-danger">En retard</p>}
          </div>
          <div>
            <span className={labelClass}>Dates</span>
            <p className="text-ink-secondary">
              Créé {formatRelative(ticket.createdAt)} · MAJ {formatRelative(ticket.updatedAt)}
            </p>
          </div>
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <span className={labelClass}>Tags</span>
            {!editingTags && (
              <button
                type="button"
                onClick={() => {
                  setTagsDraft(ticket.tags.join(', '))
                  setEditingTags(true)
                }}
                className="text-xs text-terracotta hover:underline"
              >
                <Pencil className="inline h-3 w-3" /> modifier
              </button>
            )}
          </div>
          {editingTags ? (
            <div className="flex items-center gap-2">
              <input
                autoFocus
                value={tagsDraft}
                onChange={(e) => setTagsDraft(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && saveTags()}
                placeholder="export, performance"
                className={`${selectClass} flex-1`}
              />
              <Button size="sm" variant="primary" onClick={saveTags}>
                Ok
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setEditingTags(false)}>
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          ) : ticket.tags.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {ticket.tags.map((tag) => (
                <TagBadge key={tag}>
                  <TagIcon className="mr-1 inline h-3 w-3" />
                  {tag}
                </TagBadge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-ink-muted">Aucun tag</p>
          )}
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <span className={labelClass}>Description</span>
            {editingDescription ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewDescription((v) => !v)}
                  className="flex items-center gap-1 text-xs text-terracotta hover:underline"
                >
                  <Eye className="h-3 w-3" /> {previewDescription ? 'Éditer' : 'Aperçu'}
                </button>
                <Button size="sm" variant="primary" onClick={saveDescription}>
                  Enregistrer
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setEditingDescription(false)}>
                  Annuler
                </Button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setDescriptionDraft(ticket.description)
                  setEditingDescription(true)
                  setPreviewDescription(false)
                }}
                className="text-xs text-terracotta hover:underline"
              >
                <Pencil className="inline h-3 w-3" /> modifier
              </button>
            )}
          </div>

          {editingDescription ? (
            previewDescription ? (
              <div className="prose prose-sm max-w-none rounded border border-line bg-surface p-3">
                <ReactMarkdown>{descriptionDraft || '*Aucune description*'}</ReactMarkdown>
              </div>
            ) : (
              <textarea
                autoFocus
                value={descriptionDraft}
                onChange={(e) => setDescriptionDraft(e.target.value)}
                className="min-h-[140px] w-full resize-y rounded border border-terracotta bg-surface px-3 py-2 text-sm text-ink focus:outline-none"
              />
            )
          ) : ticket.description ? (
            <div className="prose prose-sm max-w-none text-ink-secondary">
              <ReactMarkdown>{ticket.description}</ReactMarkdown>
            </div>
          ) : (
            <p className="text-sm text-ink-muted">Aucune description</p>
          )}
        </div>

        <CommentThread ticketId={ticket.id} />
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title="Supprimer ce ticket ?"
        message={`Le ticket ${ticket.id} sera définitivement supprimé, ainsi que ses commentaires et son historique. Cette action est irréversible.`}
        confirmLabel="Supprimer"
        danger
        onCancel={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
      />

      <p className="px-6 pb-4 text-xs text-ink-muted">
        {formatDate(ticket.createdAt)} — dernière mise à jour {formatRelative(ticket.updatedAt)}
      </p>
    </div>
  )
}
