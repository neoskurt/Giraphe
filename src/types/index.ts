export type Priority = 'P0' | 'P1' | 'P2' | 'P3'

export type Status =
  | 'a_trier'
  | 'a_faire'
  | 'en_cours'
  | 'en_revue'
  | 'termine'
  | 'annule'

export type TicketType = 'bug' | 'demande' | 'incident' | 'amelioration'

export type Team = 'Support' | 'Produit' | 'Tech' | 'Ops'

export interface User {
  id: string
  firstName: string
  lastName: string
  role: string
  team: Team
  avatarColor: string
}

export interface Ticket {
  id: string
  title: string
  description: string
  type: TicketType
  team: Team
  tags: string[]
  priority: Priority
  status: Status
  assigneeId: string | null
  creatorId: string
  dueDate: string | null
  createdAt: string
  updatedAt: string
  order: number
}

export interface Comment {
  id: string
  ticketId: string
  authorId: string
  content: string
  mentions: string[]
  createdAt: string
}

export type ActivityKind = 'status' | 'priority' | 'assignee' | 'creation'

export interface ActivityEntry {
  id: string
  ticketId: string
  authorId: string
  createdAt: string
  kind: ActivityKind
  from: string | null
  to: string | null
}

export type FeedItem =
  | { kind: 'comment'; createdAt: string; data: Comment }
  | { kind: 'activity'; createdAt: string; data: ActivityEntry }
