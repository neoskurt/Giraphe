import type { Priority, Status } from '@/types'

export type ThemeMode = 'light' | 'dark'

interface HexPair {
  light: string
  dark: string
}

// Validated categorical palette (dataviz skill reference), used in its fixed
// default adjacency order — never reassigned dynamically.
const CATEGORICAL: HexPair[] = [
  { light: '#2a78d6', dark: '#3987e5' }, // blue
  { light: '#eb6834', dark: '#d95926' }, // orange
  { light: '#1baf7a', dark: '#199e70' }, // aqua
  { light: '#eda100', dark: '#c98500' }, // yellow
  { light: '#e87ba4', dark: '#d55181' }, // magenta
]

const MUTED: HexPair = { light: '#898781', dark: '#898781' }

// Fixed-order slot assignment, stable regardless of filtering/sorting.
const STATUS_COLOR_MAP: Record<Status, HexPair> = {
  a_trier: CATEGORICAL[0],
  a_faire: CATEGORICAL[1],
  en_cours: CATEGORICAL[2],
  en_revue: CATEGORICAL[3],
  termine: CATEGORICAL[4],
  annule: MUTED,
}

// Status/severity palette (fixed, mode-invariant, reserved role).
const PRIORITY_SEVERITY_HEX: Record<Priority, string> = {
  P0: '#d03b3b', // critical
  P1: '#ec835a', // serious
  P2: '#fab219', // warning
  P3: '#0ca30c', // good
}

const SEQUENTIAL_BLUE: HexPair = { light: '#2a78d6', dark: '#3987e5' }

export function statusColor(status: Status, mode: ThemeMode): string {
  return STATUS_COLOR_MAP[status][mode]
}

export function priorityColor(priority: Priority): string {
  return PRIORITY_SEVERITY_HEX[priority]
}

export function sequentialColor(mode: ThemeMode): string {
  return SEQUENTIAL_BLUE[mode]
}

export const VIZ_CHROME = {
  track: { light: '#e1e0d9', dark: '#2c2c2a' },
  textSecondary: { light: '#52514e', dark: '#c3c2b7' },
}
