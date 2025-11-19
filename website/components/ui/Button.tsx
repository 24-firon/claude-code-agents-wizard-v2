import Link from 'next/link'
import { ReactNode } from 'react'

interface ButtonProps {
  href?: string
  onClick?: () => void
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  className?: string
}

export default function Button({ href, onClick, children, variant = 'primary', className = '' }: ButtonProps) {
  const baseStyles = 'inline-block px-6 py-3 rounded font-semibold transition-colors duration-150'

  const variantStyles = {
    primary: 'bg-ki-gold text-ki-black hover:bg-yellow-500',
    secondary: 'border-2 border-ki-gold text-ki-gold hover:bg-ki-gold hover:text-ki-black',
    ghost: 'text-ki-gold hover:underline'
  }

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${className}`

  if (href) {
    return (
      <Link href={href} className={combinedClassName}>
        {children}
      </Link>
    )
  }

  return (
    <button onClick={onClick} className={combinedClassName}>
      {children}
    </button>
  )
}
