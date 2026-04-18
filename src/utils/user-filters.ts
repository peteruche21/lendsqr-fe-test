import type { User, UserFilters } from '@/types'

export function filterUsers(users: User[], filters: Partial<UserFilters>): User[] {
  return users.filter((user) => {
    if (filters.organization && user.organization !== filters.organization) {
      return false
    }

    if (
      filters.username &&
      !user.username.toLowerCase().includes(filters.username.toLowerCase())
    ) {
      return false
    }

    if (
      filters.email &&
      !user.email.toLowerCase().includes(filters.email.toLowerCase())
    ) {
      return false
    }

    if (
      filters.phoneNumber &&
      !user.phoneNumber.includes(filters.phoneNumber)
    ) {
      return false
    }

    if (filters.status && user.status !== filters.status) {
      return false
    }

    if (filters.dateJoined && !user.dateJoined.startsWith(filters.dateJoined)) {
      return false
    }

    return true
  })
}
