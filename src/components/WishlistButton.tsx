import { useLang } from '../i18n'
import { useWishlist } from '../lib/wishlist'
import { wishlistStrings } from '../lib/wishlistI18n'

export function WishlistButton({
  hotelId,
  className = '',
  variant = 'icon',
}: {
  hotelId: string
  className?: string
  variant?: 'icon' | 'pill'
}) {
  const { has, toggle } = useWishlist()
  const { lang } = useLang()
  const s = wishlistStrings[lang]
  const saved = has(hotelId)
  const label = saved ? s.saved : s.save

  if (variant === 'pill') {
    return (
      <button
        type="button"
        onClick={() => toggle(hotelId)}
        aria-pressed={saved}
        aria-label={label}
        title={label}
        className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold ring-1 transition-colors ${
          saved ? 'bg-accent-50 text-accent-700 ring-accent-200' : 'bg-white text-ink-800 ring-black/10 hover:bg-sand-50'
        } ${className}`}
      >
        <span aria-hidden>{saved ? '♥' : '♡'}</span> {saved ? s.saved : s.save}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={() => toggle(hotelId)}
      aria-pressed={saved}
      aria-label={label}
      title={label}
      className={`grid h-9 w-9 place-items-center rounded-full bg-white/90 text-lg shadow-sm ring-1 ring-black/5 backdrop-blur transition-colors hover:bg-white ${
        saved ? 'text-accent-600' : 'text-ink-700/60'
      } ${className}`}
    >
      <span aria-hidden>{saved ? '♥' : '♡'}</span>
    </button>
  )
}
