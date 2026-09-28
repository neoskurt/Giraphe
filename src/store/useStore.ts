import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ActivityEntry, Comment, Priority, Status, Team, Ticket, TicketType } from '@/types'
import { seedData, DEFAULT_CURRENT_USER_ID } from '@/data/seed'
import { users } from '@/data/users'
import { nextTicketId, resetTicketIdCounter, makeId } from '@/lib/id'

export type Theme = 'light' | 'dark'

export interface NewTicketInput {
  title: string
  description: string
  type: TicketType
  team: Team
  tags: string[]
  priority: Priority
  dueDate: string | null
  assigneeId: string | null
  status?: Status
}

export interface TicketPatch {
  title?: string
  description?: string
  type?: TicketType
  team?: Team
  tags?: string[]
  priority?: Priority
  status?: Status
  assigneeId?: string | null
  dueDate?: string | null
}

interface ToastState {
  id: string
  message: string
  variant: 'success' | 'error' | 'info'
}

interface StoreState {
  tickets: Ticket[]
  comments: Comment[]
  activity: ActivityEntry[]
  currentUserId: string
  theme: Theme
  toasts: ToastState[]

  setCurrentUser: (userId: string) => void
  toggleTheme: () => void

  createTicket: (input: NewTicketInput) => Ticket
  updateTicket: (id: string, patch: TicketPatch) => void
  deleteTicket: (id: string) => void
  assignTicket: (id: string, userId: string | null) => void
  changeStatus: (id: string, status: Status) => void
  changePriority: (id: string, priority: Priority) => void
  moveTicket: (id: string, toStatus: Status, toIndex: number) => void

  addComment: (ticketId: string, content: string) => void

  pushToast: (message: string, variant?: ToastState['variant']) => void
  dismissToast: (id: string) => void

  resetDemoData: () => void
}

function highestTicketNumber(tickets: Ticket[]): number {
  let max = 100
  for (const t of tickets) {
    const n = Number(t.id.replace('GIR-', ''))
    if (!Number.isNaN(n) && n > max) max = n
  }
  return max
}

function findMentions(content: string): string[] {
  const matches = content.match(/@([\p{L}]+)/gu) ?? []
  const mentioned = new Set<string>()
  for (const raw of matches) {
    const name = raw.slice(1).toLowerCase()
    const user = users.find((u) => u.firstName.toLowerCase() === name)
    if (user) mentioned.add(user.id)
  }
  return Array.from(mentioned)
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      ...seedData(),
      theme: typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light',
      toasts: [],

      setCurrentUser: (userId) => set({ currentUserId: userId }),

      toggleTheme: () =>
        set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),

      createTicket: (input) => {
        const now = new Date().toISOString()
        const status = input.status ?? 'a_trier'
        const ticket: Ticket = {
          id: nextTicketId(),
          title: input.title,
          description: input.description,
          type: input.type,
          team: input.team,
          tags: input.tags,
          priority: input.priority,
          status,
          assigneeId: input.assigneeId,
          creatorId: get().currentUserId,
          dueDate: input.dueDate,
          createdAt: now,
          updatedAt: now,
          order: get().tickets.filter((t) => t.status === status).length,
        }
        const creation: ActivityEntry = {
          id: makeId('act'),
          ticketId: ticket.id,
          authorId: ticket.creatorId,
          kind: 'creation',
          from: null,
          to: ticket.status,
          createdAt: now,
        }
        set((state) => ({
          tickets: [...state.tickets, ticket],
          activity: [...state.activity, creation],
        }))
        get().pushToast(`Ticket ${ticket.id} créé`, 'success')
        return ticket
      },

      updateTicket: (id, patch) => {
        const state = get()
        const ticket = state.tickets.find((t) => t.id === id)
        if (!ticket) return
        const now = new Date().toISOString()
        const actorId = state.currentUserId
        const newActivity: ActivityEntry[] = []

        if (patch.status !== undefined && patch.status !== ticket.status) {
          newActivity.push({
            id: makeId('act'),
            ticketId: id,
            authorId: actorId,
            kind: 'status',
            from: ticket.status,
            to: patch.status,
            createdAt: now,
          })
        }
        if (patch.priority !== undefined && patch.priority !== ticket.priority) {
          newActivity.push({
            id: makeId('act'),
            ticketId: id,
            authorId: actorId,
            kind: 'priority',
            from: ticket.priority,
            to: patch.priority,
            createdAt: now,
          })
        }
        if (patch.assigneeId !== undefined && patch.assigneeId !== ticket.assigneeId) {
          newActivity.push({
            id: makeId('act'),
            ticketId: id,
            authorId: actorId,
            kind: 'assignee',
            from: ticket.assigneeId,
            to: patch.assigneeId,
            createdAt: now,
          })
        }

        set((s) => ({
          tickets: s.tickets.map((t) => (t.id === id ? { ...t, ...patch, updatedAt: now } : t)),
          activity: [...s.activity, ...newActivity],
        }))
      },

      deleteTicket: (id) => {
        set((state) => ({
          tickets: state.tickets.filter((t) => t.id !== id),
          comments: state.comments.filter((c) => c.ticketId !== id),
          activity: state.activity.filter((a) => a.ticketId !== id),
        }))
        get().pushToast(`Ticket ${id} supprimé`, 'info')
      },

      assignTicket: (id, userId) => {
        get().updateTicket(id, { assigneeId: userId })
        const label = userId ? users.find((u) => u.id === userId)?.firstName ?? 'utilisateur' : 'désassigné'
        get().pushToast(userId ? `Ticket ${id} attribué à ${label}` : `Ticket ${id} désassigné`, 'success')
      },

      changeStatus: (id, status) => {
        get().updateTicket(id, { status })
      },

      changePriority: (id, priority) => {
        get().updateTicket(id, { priority })
      },

      moveTicket: (id, toStatus, toIndex) => {
        const state = get()
        const moving = state.tickets.find((t) => t.id === id)
        if (!moving) return
        const statusChanged = moving.status !== toStatus
        const now = new Date().toISOString()

        const columnTickets = state.tickets
          .filter((t) => t.status === toStatus && t.id !== id)
          .sort((a, b) => a.order - b.order)

        columnTickets.splice(toIndex, 0, moving)

        const orderMap = new Map<string, number>()
        columnTickets.forEach((t, index) => orderMap.set(t.id, index))

        const newActivity: ActivityEntry[] = statusChanged
          ? [
              {
                id: makeId('act'),
                ticketId: id,
                authorId: state.currentUserId,
                kind: 'status',
                from: moving.status,
                to: toStatus,
                createdAt: now,
              },
            ]
          : []

        set((s) => ({
          tickets: s.tickets.map((t) => {
            if (t.id === id) {
              return { ...t, status: toStatus, order: orderMap.get(t.id) ?? 0, updatedAt: now }
            }
            if (orderMap.has(t.id)) {
              return { ...t, order: orderMap.get(t.id) ?? t.order }
            }
            return t
          }),
          activity: [...s.activity, ...newActivity],
        }))
      },

      addComment: (ticketId, content) => {
        const trimmed = content.trim()
        if (!trimmed) return
        const comment: Comment = {
          id: makeId('cmt'),
          ticketId,
          authorId: get().currentUserId,
          content: trimmed,
          mentions: findMentions(trimmed),
          createdAt: new Date().toISOString(),
        }
        set((state) => ({ comments: [...state.comments, comment] }))
      },

      pushToast: (message, variant = 'info') => {
        const toast: ToastState = { id: makeId('toast'), message, variant }
        set((state) => ({ toasts: [...state.toasts, toast] }))
        setTimeout(() => get().dismissToast(toast.id), 4000)
      },

      dismissToast: (id) => {
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
      },

      resetDemoData: () => {
        resetTicketIdCounter(100)
        const fresh = seedData()
        set({ ...fresh, toasts: [] })
        get().pushToast('Données de démonstration réinitialisées', 'info')
      },
    }),
    {
      name: 'giraphe-storage',
      version: 1,
      partialize: (state) => ({
        tickets: state.tickets,
        comments: state.comments,
        activity: state.activity,
        currentUserId: state.currentUserId,
        theme: state.theme,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          resetTicketIdCounter(highestTicketNumber(state.tickets))
        }
      },
    },
  ),
)

export function getCurrentUser() {
  const state = useStore.getState()
  return users.find((u) => u.id === state.currentUserId) ?? users[0]
}

export const DEFAULT_USER_ID = DEFAULT_CURRENT_USER_ID
