import React, { ReactNode } from 'react'

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset'
  className?: string
  onClick?: () => void
  children?: ReactNode
}

const Button: React.FC<ButtonProps> = ({
  type = 'button',
  className,
  onClick,
  children,
}) => {
  return (
    <button
      type={type}
      className={`flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default Button
