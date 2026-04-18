import type { PaginatedRequest, PaginatedResponse, User, UserDetails } from '@/types'

export async function fetchUsers(
  request: PaginatedRequest,
): Promise<PaginatedResponse<User>> {
  const params = new URLSearchParams({
    limit: String(request.limit),
  })

  if (request.cursor !== undefined) {
    params.set('cursor', String(request.cursor))
  }

  if (request.filters) {
    for (const [field, value] of Object.entries(request.filters)) {
      if (value) {
        params.set(field, value)
      }
    }
  }

  const response = await fetch(`/api/users?${params}`)

  if (!response.ok) {
    throw new Error('Unable to load users.')
  }

  return response.json() as Promise<PaginatedResponse<User>>
}

export async function fetchUserById(id: string): Promise<UserDetails> {
  const response = await fetch(`/api/users/${id}`)

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('User not found.')
    }
    throw new Error('Unable to load user details.')
  }

  return response.json() as Promise<UserDetails>
}
