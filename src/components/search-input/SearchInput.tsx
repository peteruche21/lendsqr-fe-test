import { Search } from 'lucide-react'
import type { InputHTMLAttributes } from 'react'

type SearchInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  buttonLabel?: string
}

export function SearchInput({
  buttonLabel = 'Search',
  className,
  placeholder = 'Search for anything',
  ...inputProps
}: SearchInputProps) {
  const classes = ['search-input', className ?? ''].filter(Boolean).join(' ')

  return (
    <label className={classes}>
      <span className="search-input__label">{buttonLabel}</span>
      <input
        className="search-input__field"
        placeholder={placeholder}
        type="search"
        {...inputProps}
      />
      <button className="search-input__button" type="button" aria-label={buttonLabel}>
        <Search aria-hidden="true" size={14} strokeWidth={3} />
      </button>
    </label>
  )
}

export type { SearchInputProps }
