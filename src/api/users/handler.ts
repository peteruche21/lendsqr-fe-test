import type { PaginatedRequest } from '@/types'
import { listMockUsers } from './mock-store'

export async function handleUsersRequest(request: Request): Promise<Response> {
  if (request.method !== 'GET') {
    return Response.json({ error: 'Method not allowed.' }, { status: 405 })
  }

  const url = new URL(request.url)
  const limit = Number(url.searchParams.get('limit'))
  const cursorParam = url.searchParams.get('cursor')
  const cursor = cursorParam === null ? undefined : Number(cursorParam)

  if (!Number.isInteger(limit) || limit < 1) {
    return Response.json({ error: 'A positive integer limit is required.' }, { status: 400 })
  }

  if (cursor !== undefined && (!Number.isInteger(cursor) || cursor < 0)) {
    return Response.json({ error: 'Cursor must be a positive integer.' }, { status: 400 })
  }

  const payload = await listMockUsers({
    cursor,
    limit,
  } satisfies PaginatedRequest)

  return Response.json(payload)
}
