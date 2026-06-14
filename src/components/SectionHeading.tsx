import type { ReactNode } from 'react'

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'left',
  children,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  align?: 'left' | 'center'
  children?: ReactNode
}) {
  return (
    <div className={`mb-6 ${align === 'center' ? 'mx-auto max-w-2xl text-center' : ''}`}>
      {eyebrow && (
        <div className="mb-1.5 text-xs font-bold uppercase tracking-wider text-brand-600">{eyebrow}</div>
      )}
      <div className={`flex ${align === 'center' ? 'flex-col items-center' : 'items-end justify-between'} gap-3`}>
        <h2 className="text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">{title}</h2>
        {children}
      </div>
      {subtitle && <p className="mt-2 text-ink-700/80">{subtitle}</p>}
    </div>
  )
}
