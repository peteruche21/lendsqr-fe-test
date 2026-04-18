import { useId, useState, type InputHTMLAttributes } from 'react'

type InputType = 'email' | 'password' | 'text'

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  error?: string
  label?: string
  type?: InputType
}

export function Input({
  className,
  error,
  id,
  label,
  type = 'text',
  ...inputProps
}: InputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const isPasswordField = type === 'password'
  const resolvedType = isPasswordField && isPasswordVisible ? 'text' : type

  return (
    <label className={`input-field${error ? ' input-field--error' : ''}${className ? ` ${className}` : ''}`} htmlFor={inputId}>
      {label ? <span className="input-field__label">{label}</span> : null}

      <span className="input-field__control">
        <input
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className="input-field__input"
          id={inputId}
          type={resolvedType}
          {...inputProps}
        />

        {isPasswordField ? (
          <button
            aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
            type="button"
            className="input-field__toggle"
            onClick={() => setIsPasswordVisible((current) => !current)}
          >
            {isPasswordVisible ? 'Hide' : 'Show'}
          </button>
        ) : null}
      </span>

      {error ? (
        <span className="input-field__message" id={`${inputId}-error`} role="alert">
          {error}
        </span>
      ) : null}
    </label>
  )
}
