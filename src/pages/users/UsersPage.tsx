import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchUsers } from '@/api'
import { Badge, Pagination, SearchInput } from '@/components'
import { DEFAULT_USER_PAGE_SIZE, QUERY_STALE_TIME_MS } from '@/constants'
import type { User } from '@/types'
import { formatUserDate } from '@/utils'
import { Page } from '@/pages/shared'

export function UsersPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const cursor = (currentPage - 1) * DEFAULT_USER_PAGE_SIZE
  const query = useQuery({
    queryFn: () =>
      fetchUsers({
        cursor,
        limit: DEFAULT_USER_PAGE_SIZE,
      }),
    queryKey: ['users', DEFAULT_USER_PAGE_SIZE, currentPage],
    staleTime: QUERY_STALE_TIME_MS,
  })

  const users = query.data?.items ?? []
  const total = query.data?.pagination.total ?? 0
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / DEFAULT_USER_PAGE_SIZE)),
    [total],
  )
  const statusMessage = query.isError
    ? 'Unable to load users.'
    : query.isLoading
      ? 'Loading users...'
      : query.isFetching
        ? 'Refreshing users...'
        : ''

  const goToPage = (page: number) => {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages))
  }

  return (
    <Page copy="this is a users page." showLogo={false}>
      <section className="users">
        <div className="users__search">
          <SearchInput />
        </div>

        <header className="users__summary">
          <span>{users.length} shown</span>
          <span>{total} total</span>
          <span>
            Page {currentPage} of {totalPages}
          </span>
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

        <footer className="users__footer">
          <span className="users__status">{statusMessage}</span>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onNext={() => goToPage(currentPage + 1)}
            onPageChange={goToPage}
            onPrevious={() => goToPage(currentPage - 1)}
          />
        </footer>
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
        <Badge variant={user.status} />
      </td>
    </tr>
  )
}
