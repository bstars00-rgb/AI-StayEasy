import { useLang } from '../i18n'
import { scoreStrings } from '../lib/scoreI18n'
import type { Distinction } from '../lib/distinction'

/** Official hotel-class stars (3–5) shown next to the hotel name. */
export function StarRating({ value, className = '' }: { value: number; className?: string }) {
  const { lang } = useLang()
  const aria = scoreStrings[lang].starsAria.replace('{n}', String(value))
  return (
    <span className={`inline-flex items-center gap-0.5 align-middle ${className}`} role="img" aria-label={aria} title={aria}>
      {Array.from({ length: value }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" className="h-3.5 w-3.5 text-amber-400" fill="currentColor" aria-hidden>
          <path d="M10 1.6l2.47 5.006 5.525.803-3.998 3.897.944 5.502L10 14.115l-4.941 2.597.944-5.502L2.005 7.41l5.525-.803z" />
        </svg>
      ))}
    </span>
  )
}

/**
 * The scarce StayEasy Distinction plaque. Renders nothing for the vast majority
 * of hotels (distinction === null) — that emptiness is the point.
 */
export function DistinctionBadge({ kind, className = '', size = 'sm' }: { kind: Distinction; className?: string; size?: 'sm' | 'lg' }) {
  const { lang } = useLang()
  if (!kind) return null
  const s = scoreStrings[lang]
  const isChoice = kind === 'choice'
  const label = isChoice ? s.choice : s.recommended
  const tip = isChoice ? s.choiceTip : s.recommendedTip
  const pad = size === 'lg' ? 'px-3 py-1.5 text-sm' : 'px-2.5 py-1 text-xs'
  const cls = isChoice
    ? 'bg-ink-900 text-amber-300 ring-1 ring-amber-400/40'
    : 'bg-white text-ink-800 ring-1 ring-black/10'
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-bold tracking-tight shadow-sm ${pad} ${cls} ${className}`}
      title={tip}
    >
      <svg viewBox="0 0 20 20" className={`${size === 'lg' ? 'h-4 w-4' : 'h-3.5 w-3.5'} ${isChoice ? 'text-amber-300' : 'text-brand-600'}`} fill="currentColor" aria-hidden>
        {/* Laurel-rosette mark — a small award emblem, not an emoji. */}
        <path d="M10 1.8l1.9 2.2 2.9-.3-.3 2.9 2.2 1.9-2.2 1.9.3 2.9-2.9-.3L10 18.2l-1.9-2.2-2.9.3.3-2.9L3.3 11.4l2.2-1.9-.3-2.9 2.9.3z" />
        <circle cx="10" cy="10" r="3" className="fill-white/90" />
      </svg>
      {label}
    </span>
  )
}
