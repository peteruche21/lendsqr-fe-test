import { useEffect, useMemo, useRef } from 'react'
import { useInfiniteQuery, type InfiniteData } from '@tanstack/react-query'
import { fetchUsers } from '@/api'
import { DEFAULT_USER_PAGE_SIZE, QUERY_STALE_TIME_MS } from '@/constants'
import type { PaginatedResponse, User } from '@/types'
import { formatUserDate } from '@/utils'
import { Page } from '@/pages/shared'

export function UsersPage() {
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const query = useInfiniteQuery<
    PaginatedResponse<User>,
    Error,
    InfiniteData<PaginatedResponse<User>>,
    readonly ['users', number],
    number
  >({
    getNextPageParam: (lastPage) => lastPage.pagination.nextCursor ?? undefined,
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      fetchUsers({
        cursor: pageParam,
        limit: DEFAULT_USER_PAGE_SIZE,
      }),
    queryKey: ['users', DEFAULT_USER_PAGE_SIZE],
    staleTime: QUERY_STALE_TIME_MS,
  })

  const users = useMemo(
    () => query.data?.pages.flatMap((page) => page.items) ?? [],
    [query.data],
  )
  const total = query.data?.pages[0]?.pagination.total ?? 0

  useEffect(() => {
    const sentinel = sentinelRef.current

    if (!sentinel) {
      return
    }

    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries

      if (entry?.isIntersecting && query.hasNextPage && !query.isFetchingNextPage) {
        void query.fetchNextPage()
      }
    })

    observer.observe(sentinel)

    return () => observer.disconnect()
  }, [query])

  return (
    <Page copy="this is a users page.">
      <section className="users">
        <header className="users__summary">
          <span>{users.length} loaded</span>
          <span>{total} total</span>
        </header>

        <div className="users__table-wrap">
          <table className="users__table">
            <thead>
              <tr>
                <th>Organization</th>
                <th>Username</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Date Joined</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <UserRow key={user.id} user={user} />
              ))}
            </tbody>
          </table>
        </div>

        <div className="users__sentinel" ref={sentinelRef}>
          {query.isLoading && 'Loading users...'}
          {query.isFetchingNextPage && 'Loading more users...'}
          {!query.hasNextPage && users.length > 0 && 'All users loaded.'}
          {query.isError && 'Unable to load users.'}
        </div>
      </section>
    </Page>
  )
}

function UserRow({ user }: { user: User }) {
  return (
    <tr>
      <td>{user.organization}</td>
      <td>{user.username}</td>
      <td>{user.email}</td>
      <td>{user.phoneNumber}</td>
      <td>{formatUserDate(user.dateJoined)}</td>
      <td>
        <span className={`status status--${user.status}`}>{user.status}</span>
      </td>
    </tr>
  )
}
