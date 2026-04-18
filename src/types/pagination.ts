export type Cursor = number

export type PaginatedRequest<TLimit extends number = number> = {
  cursor?: Cursor
  limit: TLimit
}

export type PaginationMeta = {
  hasNextPage: boolean
  nextCursor: Cursor | null
  requestedLimit: number
  returned: number
  total: number
}

export type PaginatedResponse<TItem> = {
  items: TItem[]
  pagination: PaginationMeta
}
