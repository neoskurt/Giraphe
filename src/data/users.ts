import type { User } from '@/types'

export const users: User[] = [
  {
    id: 'u-camille',
    firstName: 'Camille',
    lastName: 'Rousseau',
    role: 'Responsable Support',
    team: 'Support',
    avatarColor: '#D99B2B',
  },
  {
    id: 'u-karim',
    firstName: 'Karim',
    lastName: 'Belhadj',
    role: 'Tech Lead Backend',
    team: 'Tech',
    avatarColor: '#4A7A8C',
  },
  {
    id: 'u-lea',
    firstName: 'Léa',
    lastName: 'Fontaine',
    role: 'Product Manager',
    team: 'Produit',
    avatarColor: '#8C4A6E',
  },
  {
    id: 'u-thomas',
    firstName: 'Thomas',
    lastName: 'Girard',
    role: 'Responsable Ops',
    team: 'Ops',
    avatarColor: '#4A8C5E',
  },
  {
    id: 'u-sophie',
    firstName: 'Sophie',
    lastName: 'Lambert',
    role: 'Support Niveau 2',
    team: 'Support',
    avatarColor: '#B7791F',
  },
  {
    id: 'u-nicolas',
    firstName: 'Nicolas',
    lastName: 'Perrin',
    role: 'Développeur Full-Stack',
    team: 'Tech',
    avatarColor: '#5E4A8C',
  },
  {
    id: 'u-amandine',
    firstName: 'Amandine',
    lastName: 'Roche',
    role: 'UX Designer',
    team: 'Produit',
    avatarColor: '#8C6E4A',
  },
  {
    id: 'u-yanis',
    firstName: 'Yanis',
    lastName: 'Cherif',
    role: 'Ingénieur DevOps',
    team: 'Ops',
    avatarColor: '#4A6E8C',
  },
]

export function getUser(id: string | null): User | undefined {
  if (!id) return undefined
  return users.find((u) => u.id === id)
}

export function userInitials(user: User): string {
  return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
}

export function userFullName(user: User): string {
  return `${user.firstName} ${user.lastName}`
}
