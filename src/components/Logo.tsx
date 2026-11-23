/**
 * StayEasy brand: the lowercase wordmark "stayeasy" with a coral full stop.
 *
 * The letters are drawn as round-capped strokes (Quicksand-like), not set in a
 * font, so the logo looks identical in the header, the social image and the
 * app icon and needs no webfont request. Colors come from the Tailwind brand
 * palette. `LogoMark` is the one-letter "s." tile used where a wordmark can't
 * fit (app icon, favicon, back-office).
 */
const GREEN = '#15564A'
const CORAL = '#FB5D2C'

/** The "s." mark. Same geometry as public/favicon.svg and public/icon.svg. */
export const S_DOT_PATH = 'M66 38 C62 28 36 26 34 40 C32 54 66 48 66 62 C66 76 38 76 32 64'

/** App-icon mark: a rounded green tile with a white "s" and a coral dot. */
export function LogoMark({ size = 36, className = '' }: { size?: number; className?: string }) {
  return (
    <span
      className={`inline-grid shrink-0 place-items-center rounded-xl ${className}`}
      style={{ width: size, height: size, background: GREEN }}
      aria-hidden="true"
    >
      <svg width={size * 0.8} height={size * 0.8} viewBox="0 0 100 100" fill="none">
        <path d={S_DOT_PATH} stroke="#FFFFFF" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="78" cy="78" r="7.5" fill={CORAL} />
      </svg>
    </span>
  )
}

/** Wordmark box: 100 units = the letters' x-height; room above for the t and below for the y. */
const VB_X = -11
const VB_Y = -34
const VB_W = 851
const VB_H = 173

/**
 * The wordmark. `size` keeps the old tile-size meaning for call sites: the
 * x-height is 0.5 × size, so 36 → an 18px x-height (about a 36px font).
 */
export function Logo({ size = 36, className = '' }: { size?: number; className?: string }) {
  const unit = (size * 0.5) / 100
  return (
    <svg
      role="img"
      aria-label="StayEasy"
      className={className}
      width={VB_W * unit}
      height={VB_H * unit}
      viewBox={`${VB_X} ${VB_Y} ${VB_W} ${VB_H}`}
      fill="none"
      strokeWidth="22"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g className="stroke-ink-900"><path transform="translate(-47.37,-43.72) scale(1.8)" d="M66 38 C62 28 36 26 34 40 C32 54 66 48 66 62 C66 76 38 76 32 64" strokeWidth="12.1"/></g>
      <g className="stroke-ink-900"><path d="M121 -12 V64 Q121 89 148 89 M99 11 H149"/></g>
      <g className="stroke-ink-900"><circle cx="218" cy="50" r="39"/><path d="M257 11 V89"/></g>
      <g className="stroke-ink-900"><path d="M286 11 L327 91 M364 11 L310 128"/></g>
      <g className="stroke-brand-600"><path d="M399 50 H477 A39 39 0 1 0 465.6 77.6"/></g>
      <g className="stroke-brand-600"><circle cx="545" cy="50" r="39"/><path d="M584 11 V89"/></g>
      <g className="stroke-brand-600"><path transform="translate(554.65,-43.72) scale(1.8)" d="M66 38 C62 28 36 26 34 40 C32 54 66 48 66 62 C66 76 38 76 32 64" strokeWidth="12.1"/></g>
      <g className="stroke-brand-600"><path d="M704 11 L745 91 M782 11 L728 128"/></g>
      <circle cx="815.0" cy="87" r="13" className="fill-accent-500 stroke-none" />
    </svg>
  )
}
