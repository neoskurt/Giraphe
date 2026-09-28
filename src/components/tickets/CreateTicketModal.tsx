import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { useStore } from '@/store/useStore'
import { useUiStore } from '@/store/useUiStore'
import { users, userFullName } from '@/data/users'
import { PRIORITY_LABELS, TYPE_LABELS } from '@/lib/labels'
import type { Priority, Team, TicketType } from '@/types'

const TEAMS: Team[] = ['Support', 'Produit', 'Tech', 'Ops']
const TYPES: TicketType[] = ['bug', 'demande', 'incident', 'amelioration']
const PRIORITIES: Priority[] = ['P0', 'P1', 'P2', 'P3']

const inputClass =
  'w-full rounded border border-line bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-muted transition-colors duration-fast focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta'

const labelClass = 'mb-1 block font-sans text-eyebrow font-semibold uppercase text-ink-muted'

export function CreateTicketModal() {
  const open = useUiStore((s) => s.createTicketOpen)
  const defaultStatus = useUiStore((s) => s.createTicketDefaultStatus)
  const defaultTitle = useUiStore((s) => s.createTicketDefaultTitle)
  const close = useUiStore((s) => s.closeCreateTicket)
  const createTicket = useStore((s) => s.createTicket)
  const navigate = useNavigate()
  const location = useLocation()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState<TicketType>('demande')
  const [team, setTeam] = useState<Team>('Support')
  const [priority, setPriority] = useState<Priority>('P2')
  const [tags, setTags] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [assigneeId, setAssigneeId] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (open && defaultTitle) setTitle(defaultTitle)
  }, [open, defaultTitle])

  function reset() {
    setTitle('')
    setDescription('')
    setType('demande')
    setTeam('Support')
    setPriority('P2')
    setTags('')
    setDueDate('')
    setAssigneeId('')
    setError('')
  }

  function handleClose() {
    reset()
    close()
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) {
      setError('Le titre est obligatoire.')
      return
    }
    const ticket = createTicket({
      title: title.trim(),
      description: description.trim(),
      type,
      team,
      priority,
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      assigneeId: assigneeId || null,
      status: defaultStatus ?? undefined,
    })
    handleClose()
    navigate(`/tickets/${ticket.id}`, { state: { background: location } })
  }

  return (
    <Modal open={open} onClose={handleClose} title="Nouveau ticket" maxWidthClassName="max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="ticket-title" className={labelClass}>
            Titre *
          </label>
          <input
            id="ticket-title"
            className={inputClass}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex. : Export CSV des livraisons échoue au-delà de 10 000 lignes"
            autoFocus
          />
          {error && <p className="mt-1 text-xs text-danger">{error}</p>}
        </div>

        <div>
          <label htmlFor="ticket-description" className={labelClass}>
            Description (markdown pris en charge)
          </label>
          <textarea
            id="ticket-description"
            className={`${inputClass} min-h-[100px] resize-y`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Détaillez le contexte, les étapes de reproduction, l'impact…"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="ticket-type" className={labelClass}>
              Type
            </label>
            <select id="ticket-type" className={inputClass} value={type} onChange={(e) => setType(e.target.value as TicketType)}>
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {TYPE_LABELS[t]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="ticket-team" className={labelClass}>
              Équipe
            </label>
            <select id="ticket-team" className={inputClass} value={team} onChange={(e) => setTeam(e.target.value as Team)}>
              {TEAMS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="ticket-priority" className={labelClass}>
              Priorité
            </label>
            <select
              id="ticket-priority"
              className={inputClass}
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {PRIORITY_LABELS[p]} ({p})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="ticket-assignee" className={labelClass}>
              Assigné
            </label>
            <select
              id="ticket-assignee"
              className={inputClass}
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
            >
              <option value="">Non assigné</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {userFullName(u)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="ticket-due" className={labelClass}>
              Échéance (optionnelle)
            </label>
            <input
              id="ticket-due"
              type="date"
              className={inputClass}
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="ticket-tags" className={labelClass}>
              Tags (séparés par des virgules)
            </label>
            <input
              id="ticket-tags"
              className={inputClass}
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="export, performance"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={handleClose}>
            Annuler
          </Button>
          <Button type="submit" variant="primary">
            Créer le ticket
          </Button>
        </div>
      </form>
    </Modal>
  )
}
