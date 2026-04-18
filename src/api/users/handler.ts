import { UserStatus, type PaginatedRequest, type UserFilters } from '@/types'
import { listMockUsers } from './mock-store'

export async function handleUsersRequest(request: Request): Promise<Response> {
  if (request.method !== 'GET') {
    return Response.json({ error: 'Method not allowed.' }, { status: 405 })
  }

  const url = new URL(request.url)
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
    filters.status = status
  }

  return filters
}
