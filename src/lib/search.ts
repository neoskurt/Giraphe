import type { Ticket } from '@/types'

export function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
}

export interface TicketSearchResult {
  ticket: Ticket
  score: number
}

/** Lightweight relevance ranking: ID match > title prefix > title substring > tag > description. */
export function searchTickets(tickets: Ticket[], rawQuery: string, limit = 8): TicketSearchResult[] {
  const query = normalize(rawQuery)
  if (!query) return []

  const results: TicketSearchResult[] = []

  for (const ticket of tickets) {
    const id = normalize(ticket.id)
    const title = normalize(ticket.title)
    const tags = ticket.tags.map(normalize)
    const description = normalize(ticket.description)

    let score = 0
    if (id === query) score = 100
    else if (id.includes(query)) score = 90
    else if (title.startsWith(query)) score = 80
    else if (title.includes(query)) score = 60
    else if (tags.some((t) => t.includes(query))) score = 40
    else if (description.includes(query)) score = 20

    if (score > 0) results.push({ ticket, score })
  }

  results.sort((a, b) => b.score - a.score || a.ticket.id.localeCompare(b.ticket.id))
  return results.slice(0, limit)
}

interface HighlightPart {
  text: string
  match: boolean
}

/** Splits `text` into parts flagging which ones match `rawQuery`, accent-insensitively. */
export function splitHighlight(text: string, rawQuery: string): HighlightPart[] {
  const query = normalize(rawQuery)
  if (!query) return [{ text, match: false }]

  const normalized = normalize(text)
  const index = normalized.indexOf(query)
  if (index === -1) return [{ text, match: false }]

  return [
    { text: text.slice(0, index), match: false },
    { text: text.slice(index, index + query.length), match: true },
    { text: text.slice(index + query.length), match: false },
  ].filter((part) => part.text.length > 0)
}
