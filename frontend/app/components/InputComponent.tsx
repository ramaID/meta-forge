import React from 'react'

interface InputProps {
  id: string
  name: string
  type?: string
  autoComplete?: string
  required?: boolean
  label: string
  error?: string | string[]
}

const InputComponent: React.FC<InputProps> = ({
  id,
  name,
  type = 'text',
  autoComplete,
  required = false,
  label,
  error,
}) => {
  const hasError = error && (typeof error === 'string' || Array.isArray(error))

  return (
    <fieldset className="mt-2">
      <label
        htmlFor={id}
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {label}{' '}
        {hasError && (
          <span className="text-red-500 font-semibold">
            {typeof error === 'string' ? error : ''}
          </span>
        )}
      </label>
      <div className="mt-2">
        <input
          id={id}
          name={name}
          type={type}
          autoComplete={autoComplete}
          required={required}
          className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
            hasError ? 'input-field-error' : ''
          }`}
        />
      </div>
      {Array.isArray(error) && (
        <ol className="mt-2 ml-4 text-sm text-red-500 list-decimal">
          {error.map((errorMsg, i) => (
            <li key={`error-${id}-${i}`}>{errorMsg}</li>
          ))}
        </ol>
      )}
    </fieldset>
  )
}

export default InputComponent
