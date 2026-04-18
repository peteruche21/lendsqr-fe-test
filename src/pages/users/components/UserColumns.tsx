import type { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components'
import type { User } from '@/types'
import { formatUserDate } from '@/utils'
import { ActionsCell, ColumnHeader } from './UserTableCells'

type CreateUserColumnsOptions = {
  onViewDetails: (user: User) => void
}

export function createUserColumns({
  onViewDetails,
}: CreateUserColumnsOptions): ColumnDef<User>[] {
  return [
    {
      accessorKey: 'organization',
      header: () => <ColumnHeader title="Organization" />,
      cell: (info) => info.row.original.organization,
    },
    {
      accessorKey: 'username',
      header: () => <ColumnHeader title="Username" />,
      cell: (info) => info.row.original.username,
    },
    {
      accessorKey: 'email',
      header: () => <ColumnHeader title="Email" />,
      cell: (info) => info.row.original.email,
    },
    {
      accessorKey: 'phoneNumber',
      header: () => <ColumnHeader title="Phone Number" />,
      cell: (info) => info.row.original.phoneNumber,
    },
    {
      accessorKey: 'dateJoined',
      header: () => <ColumnHeader title="Date Joined" />,
      cell: (info) => formatUserDate(info.row.original.dateJoined),
    },
    {
      accessorKey: 'status',
      header: () => <ColumnHeader title="Status" />,
      cell: (info) => <Badge variant={info.row.original.status} />,
    },
    {
      id: 'actions',
      header: '',
      cell: (info) => (
        <ActionsCell onViewDetails={() => onViewDetails(info.row.original)} />
      ),
    },
  ]
}
