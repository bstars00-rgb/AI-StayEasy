import { useState } from 'react'

/**
 * Hotel image with a graceful fallback. Renders the placeholder photo (`src`)
 * on top of a branded gradient + emoji. If the image fails to load (e.g. offline),
 * the gradient shows through — so the prototype never shows a broken image.
 */
export function HotelImage({
  src,
  gradient,
  emoji,
  className = '',
  rounded = 'rounded-2xl',
  label,
}: {
  src?: string
  gradient: string
  emoji: string
  className?: string
  rounded?: string
  label?: string
}) {
  const [failed, setFailed] = useState(false)

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br ${gradient} ${rounded} ${className}`}
      role="img"
      aria-label={label ?? 'Hotel image'}
    >
      <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_30%_20%,white_0,transparent_40%),radial-gradient(circle_at_80%_70%,white_0,transparent_35%)]" />
      <span className="select-none text-6xl drop-shadow-sm sm:text-7xl">{emoji}</span>
      {src && !failed && (
        <img
          src={src}
          alt={label ?? ''}
          loading="lazy"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
    </div>
  )
}
