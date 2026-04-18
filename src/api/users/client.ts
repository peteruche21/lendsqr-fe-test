import type { PaginatedRequest, PaginatedResponse, User } from '@/types'

export async function fetchUsers(
  request: PaginatedRequest,
): Promise<PaginatedResponse<User>> {
  const params = new URLSearchParams({
    limit: String(request.limit),
  })

  if (request.cursor !== undefined) {
    params.set('cursor', String(request.cursor))
  }

  const response = await fetch(`/api/users?${params}`)

  if (!response.ok) {
    throw new Error('Unable to load users.')
  }

  return response.json() as Promise<PaginatedResponse<User>>
}
