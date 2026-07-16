import { useT } from '../i18n'

/**
 * Transparency label. StayEasy earns from ads & featured listings, so any
 * paid placement is clearly marked — trust is the core of the product.
 */
export function SponsoredBadge({ className = '' }: { className?: string }) {
  const t = useT()
  return (
    <span
      className={`pill bg-amber-100 text-amber-800 ring-1 ring-amber-200 ${className}`}
      title={t.badges.sponsoredTitle}
    >
      <span aria-hidden>★</span> {t.badges.sponsored}
    </span>
  )
}
