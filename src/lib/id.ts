let counter = 100

export function resetTicketIdCounter(startAt: number): void {
  counter = startAt
}

export function nextTicketId(): string {
  counter += 1
  return `GIR-${counter}`
}

export function makeId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`
}
