import type { ColumnDef } from '@tanstack/react-table'
import type { User, UserFilterField } from '@/types'
import { formatUserDate } from '@/utils'
import { ActionsCell, ColumnHeader, StatusCell } from './UserTableCells'

type CreateUserColumnsOptions = {
  activeFilters: ReadonlySet<UserFilterField>
  onOpenFilter: (field: UserFilterField, trigger: HTMLElement) => void
  onViewDetails: (user: User) => void
  openFilter: UserFilterField | null
}

export function createUserColumns({
  activeFilters,
  onOpenFilter,
  onViewDetails,
  openFilter,
}: CreateUserColumnsOptions): ColumnDef<User>[] {
  const renderHeader = (title: string, field: UserFilterField) => (
    <ColumnHeader
      field={field}
      hasFilter={activeFilters.has(field)}
      onOpenFilter={onOpenFilter}
      openFilter={openFilter}
      title={title}
    />
  )

  return [
    {
      accessorKey: 'organization',
      header: () => renderHeader('Organization', 'organization'),
      cell: (info) => info.row.original.organization,
    },
    {
      accessorKey: 'username',
      header: () => renderHeader('Username', 'username'),
      cell: (info) => info.row.original.username,
    },
    {
      accessorKey: 'email',
      header: () => renderHeader('Email', 'email'),
      cell: (info) => info.row.original.email,
    },
    {
      accessorKey: 'phoneNumber',
      header: () => renderHeader('Phone Number', 'phoneNumber'),
      cell: (info) => info.row.original.phoneNumber,
    },
    {
      accessorKey: 'dateJoined',
      header: () => renderHeader('Date Joined', 'dateJoined'),
      cell: (info) => formatUserDate(info.row.original.dateJoined),
    },
    {
      accessorKey: 'status',
      header: () => renderHeader('Status', 'status'),
      cell: (info) => <StatusCell user={info.row.original} />,
    },
    {
      id: 'actions',
      header: '',
      cell: (info) => (
        <ActionsCell 
          user={info.row.original}
          onViewDetails={() => onViewDetails(info.row.original)} 
        />
      ),
    },
  ]
}
