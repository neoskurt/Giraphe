import { create } from 'zustand'
import type { Status } from '@/types'

interface OpenCreateTicketOptions {
  defaultStatus?: Status
  defaultTitle?: string
}

interface UiState {
  createTicketOpen: boolean
  createTicketDefaultStatus: Status | null
  createTicketDefaultTitle: string
  openCreateTicket: (options?: OpenCreateTicketOptions) => void
  closeCreateTicket: () => void

  commandPaletteOpen: boolean
  openCommandPalette: () => void
  closeCommandPalette: () => void
  toggleCommandPalette: () => void
}

export const useUiStore = create<UiState>((set) => ({
  createTicketOpen: false,
  createTicketDefaultStatus: null,
  createTicketDefaultTitle: '',
  openCreateTicket: (options) =>
    set({
      createTicketOpen: true,
      createTicketDefaultStatus: options?.defaultStatus ?? null,
      createTicketDefaultTitle: options?.defaultTitle ?? '',
    }),
  closeCreateTicket: () => set({ createTicketOpen: false, createTicketDefaultStatus: null, createTicketDefaultTitle: '' }),

  commandPaletteOpen: false,
  openCommandPalette: () => set({ commandPaletteOpen: true }),
  closeCommandPalette: () => set({ commandPaletteOpen: false }),
  toggleCommandPalette: () => set((s) => ({ commandPaletteOpen: !s.commandPaletteOpen })),
}))
