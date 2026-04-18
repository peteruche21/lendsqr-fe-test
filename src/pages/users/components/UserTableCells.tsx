import { useState } from 'react'
import { ListFilter, MoreVertical } from 'lucide-react'
import { AcUserBlockIcon, AcUserCheckIcon, AcUserEyeIcon } from '@/assets/icons'
import { Card } from '@/components'

export function ColumnHeader({ title }: { title: string }) {
  return (
    <div className="table-header">
      <span>{title}</span>
      <button className="table-header__filter" type="button" aria-label={`Filter by ${title}`}>
        <ListFilter />
      </button>
    </div>
  )
}

type ActionsCellProps = {
  onViewDetails: () => void
}

export function ActionsCell({ onViewDetails }: ActionsCellProps) {
  const [open, setOpen] = useState(false)

  const closePopover = () => setOpen(false)

  return (
    <div className="table-actions">
      <button
        aria-label="More actions"
        className="table-actions__trigger"
        type="button"
        onClick={(event) => {
          event.stopPropagation()
          setOpen(true)
        }}
      >
        <MoreVertical size={20} />
      </button>
      {open && (
        <>
          <div
            aria-hidden="true"
            className="table-actions__backdrop"
            onClick={(event) => {
              event.stopPropagation()
              setOpen(false)
            }}
          />
          <div
            className="table-actions__popover"
            onClick={(event) => event.stopPropagation()}
          >
            <Card as="div" className="table-actions__card">
              <button
                className="table-actions__item"
                type="button"
                onClick={() => {
                  closePopover()
                  onViewDetails()
                }}
              >
                <AcUserEyeIcon />
                <span>View Details</span>
              </button>
              <button className="table-actions__item" type="button" onClick={closePopover}>
                <AcUserBlockIcon />
                <span>Blacklist User</span>
              </button>
              <button className="table-actions__item" type="button" onClick={closePopover}>
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
