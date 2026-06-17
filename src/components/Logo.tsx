/**
 * StayEasy brand mark + wordmark.
 *
 * The symbol fuses an arched doorway/window (stay), a location-pin point
 * (travel), and a teal "S" ribbon (the StayEasy journey). Brand colors are
 * intentionally hard-coded — this is a fixed brand asset, not theme UI.
 */
const GREEN = '#15564A'
const TEAL = '#46B1A2'

/** The app-icon mark: a rounded green tile with the white doorway-pin symbol. */
export function LogoMark({ size = 36, className = '' }: { size?: number; className?: string }) {
  return (
    <span
      className={`inline-grid shrink-0 place-items-center rounded-xl ${className}`}
      style={{ width: size, height: size, background: GREEN }}
      aria-hidden="true"
    >
      <svg width={size * 0.72} height={size * 0.72} viewBox="0 0 100 100" fill="none">
        <g transform="translate(0,-3)">
          <path d="M28 40 A22 22 0 0 1 72 40 L72 66 Q72 80 50 92 Q28 80 28 66 Z" fill="#FFFFFF" />
          <path d="M37 41 A14 14 0 0 1 63 41" fill="none" stroke={GREEN} strokeWidth="2.4" strokeLinecap="round" opacity="0.18" />
          <path d="M59 35 C45 39 45 50 52 55 C59 60 59 70 45 74" fill="none" stroke={TEAL} strokeWidth="7" strokeLinecap="round" />
        </g>
      </svg>
    </span>
  )
}

/** Horizontal lockup: mark + two-tone wordmark. */
export function Logo({ size = 36, className = '', textClass = 'text-lg' }: { size?: number; className?: string; textClass?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark size={size} />
      <span className={`font-extrabold tracking-tight ${textClass}`}>
        <span className="text-ink-900">Stay</span>
        <span className="text-brand-600">Easy</span>
      </span>
    </span>
  )
}
