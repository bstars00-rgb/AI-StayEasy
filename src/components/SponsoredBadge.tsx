/**
 * Transparency label. StayEasy earns from ads & featured listings, so any
 * paid placement is clearly marked — trust is the core of the product.
 */
export function SponsoredBadge({ className = '' }: { className?: string }) {
  return (
    <span
      className={`pill bg-amber-100 text-amber-800 ring-1 ring-amber-200 ${className}`}
      title="This hotel pays for a featured placement. StayEasy never takes booking commission."
    >
      <span aria-hidden>★</span> Sponsored
    </span>
  )
}

export function VerifiedBadge({ className = '' }: { className?: string }) {
  return (
    <span
      className={`pill bg-brand-100 text-brand-800 ring-1 ring-brand-200 ${className}`}
      title="StayEasy has verified this hotel's official website, benefits, and policies."
    >
      <span aria-hidden>✓</span> Verified partner
    </span>
  )
}
