import { USER_RECORD_COUNT } from '@/constants/users'
import type { PaginatedRequest, PaginatedResponse, User } from '@/types'
import { filterUsers } from '@/utils/user-filters'
import { createMockUser } from '@/utils/user-fixtures'

const users = Array.from({ length: USER_RECORD_COUNT }, (_, index) => createMockUser(index))

export async function listMockUsers(
  request: PaginatedRequest,
): Promise<PaginatedResponse<User>> {
  const cursor = request.cursor ?? 0
  const filteredUsers = request.filters ? filterUsers(users, request.filters) : users
  const nextCursor = cursor + request.limit
  const items = filteredUsers.slice(cursor, nextCursor)
  const hasNextPage = nextCursor < filteredUsers.length

  return {
    items,
    pagination: {
      hasNextPage,
      nextCursor: hasNextPage ? nextCursor : null,
      requestedLimit: request.limit,
      returned: items.length,
      total: filteredUsers.length,
    },
  }
}
