import { useMemo, useState } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { KANBAN_STATUSES } from '@/lib/labels'
import type { Status, Ticket } from '@/types'
import { KanbanColumn } from './KanbanColumn'
import { KanbanCard } from './KanbanCard'
import { useStore } from '@/store/useStore'

interface KanbanBoardProps {
  tickets: Ticket[]
  onOpen: (id: string) => void
}

function statusFromDroppableId(id: string): Status | null {
  if (id.startsWith('col-')) return id.slice(4) as Status
  return null
}

export function KanbanBoard({ tickets, onOpen }: KanbanBoardProps) {
  const moveTicket = useStore((s) => s.moveTicket)
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const columns = useMemo(() => {
    const map = new Map<Status, Ticket[]>()
    for (const status of KANBAN_STATUSES) map.set(status, [])
    for (const t of tickets) {
      if (map.has(t.status)) map.get(t.status)!.push(t)
    }
    for (const list of map.values()) list.sort((a, b) => a.order - b.order)
    return map
  }, [tickets])

  const activeTicket = activeId ? tickets.find((t) => t.id === activeId) ?? null : null

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id))
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null)
    const { active, over } = event
    if (!over) return

    const movingTicket = tickets.find((t) => t.id === active.id)
    if (!movingTicket) return

    const overId = String(over.id)
    const targetColumnFromContainer = statusFromDroppableId(overId)

    if (targetColumnFromContainer) {
      const columnTickets = (columns.get(targetColumnFromContainer) ?? []).filter((t) => t.id !== movingTicket.id)
      moveTicket(movingTicket.id, targetColumnFromContainer, columnTickets.length)
      return
    }

    const overTicket = tickets.find((t) => t.id === overId)
    if (!overTicket) return
    const columnTickets = (columns.get(overTicket.status) ?? []).filter((t) => t.id !== movingTicket.id)
    const overIndex = columnTickets.findIndex((t) => t.id === overTicket.id)
    moveTicket(movingTicket.id, overTicket.status, overIndex === -1 ? columnTickets.length : overIndex)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {KANBAN_STATUSES.map((status) => (
          <KanbanColumn key={status} status={status} tickets={columns.get(status) ?? []} onOpen={onOpen} />
        ))}
      </div>
      <DragOverlay>{activeTicket && <KanbanCard ticket={activeTicket} onOpen={() => {}} />}</DragOverlay>
    </DndContext>
  )
}
