import { useStore } from '@/store/useStore'
import { users } from '@/data/users'

export function useCurrentUser() {
  const currentUserId = useStore((s) => s.currentUserId)
  return users.find((u) => u.id === currentUserId) ?? users[0]
}
