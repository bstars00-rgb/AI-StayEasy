/**
 * Minimal, monochrome line icons (inherit `currentColor`) — a cleaner, more
 * professional alternative to decorative emoji across the UI.
 */
type IconProps = { className?: string; strokeWidth?: number }

function Svg({ className = 'h-5 w-5', strokeWidth = 1.75, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {children}
    </svg>
  )
}

export const IconCheck = (p: IconProps) => <Svg {...p}><path d="m20 6-11 11-5-5" /></Svg>

export const IconTag = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 11.5V4a1 1 0 0 1 1-1h7.5a2 2 0 0 1 1.4.6l7.5 7.5a2 2 0 0 1 0 2.8l-7 7a2 2 0 0 1-2.8 0l-7.5-7.5A2 2 0 0 1 3 11.5Z" />
    <circle cx="7.5" cy="7.5" r="1.3" />
  </Svg>
)

export const IconShield = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3 5 6v5c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z" />
    <path d="m9.5 12 1.8 1.8 3.3-3.6" />
  </Svg>
)

export const IconUsers = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="9" cy="8" r="3" />
    <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
    <path d="M16 5.5a3 3 0 0 1 0 5.8M20.5 20a5.5 5.5 0 0 0-4-5.3" />
  </Svg>
)

export const IconPin = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 21s-6.5-5.4-6.5-10.3A6.5 6.5 0 0 1 12 4a6.5 6.5 0 0 1 6.5 6.7C18.5 15.6 12 21 12 21Z" />
    <circle cx="12" cy="10.5" r="2.3" />
  </Svg>
)

export const IconSparkle = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3.5 13.6 9l5.4 1.6-5.4 1.6L12 17.5 10.4 12 5 10.5 10.4 9 12 3.5Z" />
  </Svg>
)

export const IconStar = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={p.className ?? 'h-4 w-4'} aria-hidden="true">
    <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9L12 3.5Z" />
  </svg>
)
