import { USER_RECORD_COUNT } from '@/constants/users'
import type { PaginatedRequest, PaginatedResponse, User } from '@/types'
import { createMockUser } from '@/utils/user-fixtures'

const users = Array.from({ length: USER_RECORD_COUNT }, (_, index) => createMockUser(index))

export async function listMockUsers(
  request: PaginatedRequest,
): Promise<PaginatedResponse<User>> {
  const cursor = request.cursor ?? 0
  const nextCursor = cursor + request.limit
  const items = users.slice(cursor, nextCursor)
  const hasNextPage = nextCursor < users.length

  return {
    items,
    pagination: {
      hasNextPage,
      nextCursor: hasNextPage ? nextCursor : null,
      requestedLimit: request.limit,
      returned: items.length,
      total: users.length,
    },
  }
}
