import type { ActivityEntry } from '@/types'
import { tickets } from './tickets'
import { comments } from './comments'
import { users } from './users'
import { hoursAgo } from '@/lib/date'
import { makeId } from '@/lib/id'

interface ActivitySpec {
  ticketId: string
  authorId: string
  kind: ActivityEntry['kind']
  from: string | null
  to: string | null
  hoursAgoValue: number
}

const EXTRA_ACTIVITY: ActivitySpec[] = [
  { ticketId: 'GIR-101', authorId: 'u-camille', kind: 'assignee', from: null, to: 'u-nicolas', hoursAgoValue: 800 },
  { ticketId: 'GIR-101', authorId: 'u-nicolas', kind: 'status', from: 'a_faire', to: 'en_cours', hoursAgoValue: 720 },
  { ticketId: 'GIR-101', authorId: 'u-nicolas', kind: 'status', from: 'en_cours', to: 'termine', hoursAgoValue: 672 },
  { ticketId: 'GIR-103', authorId: 'u-yanis', kind: 'assignee', from: null, to: 'u-thomas', hoursAgoValue: 22 },
  { ticketId: 'GIR-103', authorId: 'u-thomas', kind: 'status', from: 'a_trier', to: 'en_cours', hoursAgoValue: 21 },
  { ticketId: 'GIR-104', authorId: 'u-sophie', kind: 'priority', from: 'P1', to: 'P0', hoursAgoValue: 95 },
  { ticketId: 'GIR-104', authorId: 'u-karim', kind: 'status', from: 'a_faire', to: 'en_cours', hoursAgoValue: 35 },
  { ticketId: 'GIR-104', authorId: 'u-karim', kind: 'status', from: 'en_cours', to: 'en_revue', hoursAgoValue: 22 },
  { ticketId: 'GIR-108', authorId: 'u-sophie', kind: 'assignee', from: null, to: 'u-yanis', hoursAgoValue: 185 },
  { ticketId: 'GIR-108', authorId: 'u-yanis', kind: 'status', from: 'a_faire', to: 'en_cours', hoursAgoValue: 100 },
  { ticketId: 'GIR-108', authorId: 'u-yanis', kind: 'status', from: 'en_cours', to: 'en_revue', hoursAgoValue: 60 },
  { ticketId: 'GIR-110', authorId: 'u-karim', kind: 'status', from: 'a_trier', to: 'en_cours', hoursAgoValue: 4 },
  { ticketId: 'GIR-112', authorId: 'u-thomas', kind: 'assignee', from: null, to: 'u-thomas', hoursAgoValue: 230 },
  { ticketId: 'GIR-112', authorId: 'u-yanis', kind: 'status', from: 'a_faire', to: 'en_revue', hoursAgoValue: 195 },
  { ticketId: 'GIR-114', authorId: 'u-thomas', kind: 'status', from: 'a_faire', to: 'en_cours', hoursAgoValue: 105 },
  { ticketId: 'GIR-118', authorId: 'u-thomas', kind: 'status', from: 'a_faire', to: 'en_revue', hoursAgoValue: 195 },
  { ticketId: 'GIR-123', authorId: 'u-thomas', kind: 'assignee', from: null, to: 'u-yanis', hoursAgoValue: 45 },
  { ticketId: 'GIR-123', authorId: 'u-yanis', kind: 'status', from: 'a_faire', to: 'en_cours', hoursAgoValue: 42 },
  { ticketId: 'GIR-124', authorId: 'u-lea', kind: 'status', from: 'a_faire', to: 'en_cours', hoursAgoValue: 260 },
  { ticketId: 'GIR-124', authorId: 'u-karim', kind: 'status', from: 'en_cours', to: 'en_revue', hoursAgoValue: 85 },
  { ticketId: 'GIR-128', authorId: 'u-lea', kind: 'priority', from: 'P2', to: 'P1', hoursAgoValue: 145 },
  { ticketId: 'GIR-128', authorId: 'u-nicolas', kind: 'status', from: 'a_faire', to: 'en_cours', hoursAgoValue: 62 },
  { ticketId: 'GIR-130', authorId: 'u-karim', kind: 'assignee', from: null, to: 'u-nicolas', hoursAgoValue: 11 },
  { ticketId: 'GIR-116', authorId: 'u-camille', kind: 'priority', from: 'P1', to: 'P0', hoursAgoValue: 5 },
]

function buildActivity(): ActivityEntry[] {
  const creationEntries: ActivityEntry[] = tickets.map((t) => ({
    id: makeId('act'),
    ticketId: t.id,
    authorId: t.creatorId,
    kind: 'creation',
    from: null,
    to: t.status,
    createdAt: t.createdAt,
  }))

  const extraEntries: ActivityEntry[] = EXTRA_ACTIVITY.map((spec) => ({
    id: makeId('act'),
    ticketId: spec.ticketId,
    authorId: spec.authorId,
    kind: spec.kind,
    from: spec.from,
    to: spec.to,
    createdAt: hoursAgo(spec.hoursAgoValue).toISOString(),
  }))

  return [...creationEntries, ...extraEntries]
}

export const DEFAULT_CURRENT_USER_ID = 'u-camille'

export function seedData() {
  return {
    users,
    tickets,
    comments,
    activity: buildActivity(),
    currentUserId: DEFAULT_CURRENT_USER_ID,
  }
}
