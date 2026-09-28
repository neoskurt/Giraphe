import type { Priority, Status, TicketType } from '@/types'

export const PRIORITY_LABELS: Record<Priority, string> = {
  P0: 'Critique',
  P1: 'Haute',
  P2: 'Moyenne',
  P3: 'Basse',
}

export const PRIORITY_ORDER: Priority[] = ['P0', 'P1', 'P2', 'P3']

// Fixed, mode-invariant status/severity palette (reserved role — never reused
// for a categorical series). Always paired with an icon + text label.
export const PRIORITY_DOT: Record<Priority, string> = {
  P0: '#d03b3b',
  P1: '#ec835a',
  P2: '#fab219',
  P3: '#0ca30c',
}

export const STATUS_LABELS: Record<Status, string> = {
  a_trier: 'À trier',
  a_faire: 'À faire',
  en_cours: 'En cours',
  en_revue: 'En revue',
  termine: 'Terminé',
  annule: 'Annulé',
}

export const STATUS_ORDER: Status[] = ['a_trier', 'a_faire', 'en_cours', 'en_revue', 'termine']

export const KANBAN_STATUSES: Status[] = ['a_trier', 'a_faire', 'en_cours', 'en_revue', 'termine']

export const TYPE_LABELS: Record<TicketType, string> = {
  bug: 'Bug',
  demande: 'Demande',
  incident: 'Incident',
  amelioration: 'Amélioration',
}

// Curated hue set kept distinct from the priority (status/severity) and
// workflow-stage (categorical) palettes so no two axes read as the same signal.
export const TYPE_DOT: Record<TicketType, string> = {
  bug: '#B3452C',
  demande: '#5B7A8C',
  incident: '#C9612C',
  amelioration: '#3F7D53',
}
