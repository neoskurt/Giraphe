import { formatDistanceToNow, formatDistanceStrict, isPast, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'

export function daysAgo(days: number, fromHours = 9): Date {
  const d = new Date()
  d.setDate(d.getDate() - days)
  d.setHours(fromHours, 0, 0, 0)
  return d
}

export function hoursAgo(hours: number): Date {
  return new Date(Date.now() - hours * 60 * 60 * 1000)
}

export function daysFromNow(days: number): Date {
  const d = new Date()
  d.setDate(d.getDate() + days)
  d.setHours(18, 0, 0, 0)
  return d
}

export function formatRelative(iso: string): string {
  return formatDistanceToNow(parseISO(iso), { addSuffix: true, locale: fr })
}

export function formatDuration(iso: string): string {
  return formatDistanceStrict(parseISO(iso), new Date(), { locale: fr })
}

export function isOverdue(dueDateIso: string | null, status: string): boolean {
  if (!dueDateIso) return false
  if (status === 'termine' || status === 'annule') return false
  return isPast(parseISO(dueDateIso))
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).format(
    parseISO(iso),
  )
}
