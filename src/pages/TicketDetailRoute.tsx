import { useNavigate, useParams } from 'react-router-dom'
import { Drawer } from '@/components/ui/Drawer'
import { TicketDetailPanel } from '@/components/tickets/TicketDetailPanel'

export function TicketDetailRoute() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  function close() {
    navigate(-1)
  }

  if (!id) return null

  return (
    <Drawer open onClose={close} labelledBy="ticket-detail-title">
      <TicketDetailPanel ticketId={id} />
    </Drawer>
  )
}
