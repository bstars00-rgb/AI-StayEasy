import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

type Variant = 'primary' | 'secondary' | 'ghost' | 'white'
type Size = 'sm' | 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:opacity-60'

const variants: Record<Variant, string> = {
  primary: 'bg-brand-600 text-white shadow-sm hover:bg-brand-700 active:scale-[0.98]',
  secondary: 'bg-ink-900 text-white hover:bg-ink-800 active:scale-[0.98]',
  ghost: 'bg-transparent text-brand-700 hover:bg-brand-50',
  white: 'bg-white text-ink-900 shadow-sm ring-1 ring-black/5 hover:bg-sand-50',
}

const sizes: Record<Size, string> = {
  sm: 'px-3.5 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
}

interface CommonProps {
  variant?: Variant
  size?: Size
  className?: string
  children: ReactNode
}

type ButtonProps = CommonProps &
  ({ to: string; href?: never; onClick?: never } | { href: string; to?: never; onClick?: never } | { to?: never; href?: never; onClick?: () => void })

export default function Button({ variant = 'primary', size = 'md', className = '', children, ...rest }: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`

  if ('to' in rest && rest.to) {
    return (
      <Link to={rest.to} className={classes}>
        {children}
      </Link>
    )
  }
  if ('href' in rest && rest.href) {
    return (
      <a href={rest.href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    )
  }
  return (
    <button type="button" onClick={'onClick' in rest ? rest.onClick : undefined} className={classes}>
      {children}
    </button>
  )
}
