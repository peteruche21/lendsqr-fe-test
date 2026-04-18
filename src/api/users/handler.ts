import { UserStatus, type PaginatedRequest, type UserFilters } from '@/types'
import { listMockUsers, findMockUserById } from './mock-store'

export async function handleUsersRequest(request: Request): Promise<Response> {
  if (request.method !== 'GET') {
    return Response.json({ error: 'Method not allowed.' }, { status: 405 })
  }

  const url = new URL(request.url)
  const pathSegments = url.pathname.split('/').filter(Boolean)
  
  // Handle /api/users/:id
  if (pathSegments.length === 3 && pathSegments[1] === 'users') {
    const userId = pathSegments[2]
    const user = await findMockUserById(userId)
    
    if (!user) {
      return Response.json({ error: 'User not found.' }, { status: 404 })
    }
    
    return Response.json(user)
  }

  // Handle /api/users (List)
  const limit = Number(url.searchParams.get('limit'))
  const cursorParam = url.searchParams.get('cursor')
  const cursor = cursorParam === null ? undefined : Number(cursorParam)
  const filters = getUserFilters(url.searchParams)

  if (!Number.isInteger(limit) || limit < 1) {
    return Response.json({ error: 'A positive integer limit is required.' }, { status: 400 })
  }

  if (cursor !== undefined && (!Number.isInteger(cursor) || cursor < 0)) {
    return Response.json({ error: 'Cursor must be a positive integer.' }, { status: 400 })
  }

  const payload = await listMockUsers({
    cursor,
    filters,
    limit,
  } satisfies PaginatedRequest)

  return Response.json(payload)
}

function getUserFilters(searchParams: URLSearchParams): Partial<UserFilters> {
  const filters: Partial<UserFilters> = {}
  const organization = searchParams.get('organization')
  const username = searchParams.get('username')
  const email = searchParams.get('email')
  const phoneNumber = searchParams.get('phoneNumber')
  const dateJoined = searchParams.get('dateJoined')
  const status = searchParams.get('status')

  if (organization) {
    filters.organization = organization
  }

  if (username) {
    filters.username = username
  }

  if (email) {
    filters.email = email
  }

  if (phoneNumber) {
    filters.phoneNumber = phoneNumber
  }

  if (dateJoined) {
    filters.dateJoined = dateJoined
  }

  if (
    status === UserStatus.Active ||
    status === UserStatus.Blacklisted ||
    status === UserStatus.Inactive ||
    status === UserStatus.Pending
  ) {
    filters.status = status as UserStatus
  }

  return filters
}
