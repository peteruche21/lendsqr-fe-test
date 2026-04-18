import { useState } from 'react'
import { createColumnHelper } from '@tanstack/react-table'
import { ListFilter, MoreVertical } from 'lucide-react'
import { AcUserBlockIcon, AcUserCheckIcon, AcUserEyeIcon } from '@/assets/icons'
import { Badge, Card } from '@/components'
import type { User } from '@/types'
import { formatUserDate } from '@/utils'

const columnHelper = createColumnHelper<User>()

// Generic Header Component to keep the filter icon consistent
function ColumnHeader({ title }: { title: string }) {
  return (
    <div className="table-header">
      <span>{title}</span>
      <button className="table-header__filter" type="button" aria-label={`Filter by ${title}`}>
        {/* User wanted 16x10.5, we will force dimensions in CSS or directly on SVG, let's just render ListFilter */}
        <ListFilter />
      </button>
    </div>
  )
}

function ActionsCell({ user }: { user: User }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="table-actions">
      <button
        aria-label="More actions"
        className="table-actions__trigger"
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          setOpen(true)
        }}
      >
        <MoreVertical size={20} />
      </button>
      {open && (
        <>
          <div aria-hidden="true" className="table-actions__backdrop" onClick={(e) => { e.stopPropagation(); setOpen(false); }} />
          <div className="table-actions__popover" onClick={(e) => e.stopPropagation()}>
            <Card as="div" className="table-actions__card">
              <button className="table-actions__item" type="button" onClick={() => setOpen(false)}>
                <AcUserEyeIcon />
                <span>View Details</span>
              </button>
              <button className="table-actions__item" type="button" onClick={() => setOpen(false)}>
                <AcUserBlockIcon />
                <span>Blacklist User</span>
              </button>
              <button className="table-actions__item" type="button" onClick={() => setOpen(false)}>
                <AcUserCheckIcon />
                <span>Activate User</span>
              </button>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}

export const userColumns = [
  columnHelper.accessor('organization', {
    header: () => <ColumnHeader title="Organization" />,
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('username', {
    header: () => <ColumnHeader title="Username" />,
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('email', {
    header: () => <ColumnHeader title="Email" />,
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('phoneNumber', {
    header: () => <ColumnHeader title="Phone Number" />,
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('dateJoined', {
    header: () => <ColumnHeader title="Date Joined" />,
    cell: (info) => formatUserDate(info.getValue()),
  }),
  columnHelper.accessor('status', {
    header: () => <ColumnHeader title="Status" />,
    cell: (info) => <Badge variant={info.getValue()} />,
  }),
  columnHelper.display({
    id: 'actions',
    header: '',
    cell: (info) => <ActionsCell user={info.row.original} />,
  }),
]
