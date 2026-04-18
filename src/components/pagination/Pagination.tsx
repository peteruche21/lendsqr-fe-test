import { ChevronLeft, ChevronRight } from 'lucide-react'

type PaginationPageItem = number | 'ellipsis'

type PaginationProps = {
  currentPage: number
  onNext?: () => void
  onPageChange?: (page: number) => void
  onPrevious?: () => void
  totalPages: number
}

function getPaginationItems(currentPage: number, totalPages: number): PaginationPageItem[] {
  if (totalPages <= 6) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 'ellipsis', totalPages - 1, totalPages]
  }

  if (currentPage >= totalPages - 2) {
    return [1, 2, 'ellipsis', totalPages - 2, totalPages - 1, totalPages]
  }

  return [1, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages]
}

export function Pagination({
  currentPage,
  onNext,
  onPageChange,
  onPrevious,
  totalPages,
}: PaginationProps) {
  const boundedTotalPages = Math.max(1, totalPages)
  const boundedCurrentPage = Math.min(Math.max(currentPage, 1), boundedTotalPages)
  const pages = getPaginationItems(boundedCurrentPage, boundedTotalPages)
  const hasPrevious = boundedCurrentPage > 1
  const hasNext = boundedCurrentPage < boundedTotalPages

  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        aria-label="Previous page"
        className="pagination__control"
        disabled={!hasPrevious}
        type="button"
        onClick={onPrevious}
      >
        <ChevronLeft aria-hidden="true" className="pagination__chevron" />
      </button>

      <ol className="pagination__list">
        {pages.map((page, index) => (
          <li key={`${page}-${index}`} className="pagination__item">
            {page === 'ellipsis' ? (
              <span className="pagination__ellipsis">...</span>
            ) : (
              <button
                aria-current={page === boundedCurrentPage ? 'page' : undefined}
                className="pagination__page"
                type="button"
                onClick={() => onPageChange?.(page)}
              >
                {page}
              </button>
            )}
          </li>
        ))}
      </ol>

      <button
        aria-label="Next page"
        className="pagination__control"
        disabled={!hasNext}
        type="button"
        onClick={onNext}
      >
        <ChevronRight aria-hidden="true" className="pagination__chevron" />
      </button>
    </nav>
  )
}

export type { PaginationPageItem, PaginationProps }
