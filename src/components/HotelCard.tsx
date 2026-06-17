import { Link } from 'react-router-dom'
import type { Hotel } from '../types'
import { HotelImage } from './HotelImage'
import { SponsoredBadge } from './SponsoredBadge'
import { FacilityChips } from './Facilities'
import { WishlistButton } from './WishlistButton'
import { useLang, useT, localizeHotel } from '../i18n'
import { voucherStrings } from '../lib/voucherI18n'
import { officialLink } from '../lib/officialLink'

/**
 * Suitability-first hotel card. Leads with *who it's for* and the official
 * booking benefit — not price — to stay true to the non-OTA positioning.
 * Localizes the hotel's text and enum labels for the active language.
 */
export function HotelCard({ hotel: raw }: { hotel: Hotel }) {
  const t = useT()
  const { lang } = useLang()
  const hotel = localizeHotel(raw, lang)
  const area = (t.enums.area as Record<string, string>)[hotel.area] ?? hotel.area
  const city = (t.enums.city as Record<string, string>)[hotel.city] ?? hotel.city
  const type = (t.enums.hotelType as Record<string, string>)[hotel.hotelType] ?? hotel.hotelType

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-black/5 transition-all hover:-translate-y-0.5 hover:shadow-card-hover">
      <WishlistButton hotelId={raw.slug} className="absolute right-3 top-3 z-10" />
      <Link to={`/hotels/${hotel.slug}`} className="relative block">
        <HotelImage
          src={hotel.imageUrl}
          gradient={hotel.heroColor}
          emoji={hotel.emoji}
          rounded=""
          className="h-44 w-full"
          label={hotel.name}
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {hotel.isSponsored && <SponsoredBadge />}
          {raw.voucher && (
            <span className="pill bg-brand-600 text-white">🎟️ {voucherStrings[lang].badge}</span>
          )}
        </div>
        <div className="absolute bottom-3 right-3">
          <span className="pill bg-white/90 text-ink-900 backdrop-blur">{type}</span>
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <Link to={`/hotels/${hotel.slug}`}>
            <h3 className="font-bold leading-snug text-ink-900 group-hover:text-brand-700">{hotel.name}</h3>
          </Link>
          <p className="mt-0.5 text-sm text-ink-700/70">
            <span aria-hidden>📍</span> {area}, {city}
          </p>
        </div>

        <p className="text-sm text-ink-700/90">{hotel.shortDescription}</p>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-700/50">{t.common.bestFor}</p>
          <p className="mt-0.5 text-sm font-medium text-ink-800">{hotel.bestFor.slice(0, 2).join(' · ')}</p>
        </div>

        <FacilityChips items={hotel.facilities} limit={3} />

        <div className="rounded-xl bg-brand-50 px-3 py-2">
          <p className="text-xs font-semibold text-brand-700">🏷️ {t.common.officialBenefit}</p>
          <p className="text-sm text-ink-800">{hotel.officialBenefits[0]}</p>
        </div>

        <div className="mt-auto grid grid-cols-2 gap-2 pt-1">
          <Link
            to={`/hotels/${hotel.slug}`}
            className="rounded-full bg-ink-900 px-3 py-2.5 text-center text-sm font-semibold text-white hover:bg-ink-800"
          >
            {t.common.viewGuide}
          </Link>
          <a
            href={officialLink(hotel)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-brand-600 px-3 py-2.5 text-center text-sm font-semibold text-white hover:bg-brand-700"
          >
            {t.common.officialWebsite} ↗
          </a>
        </div>
      </div>
    </div>
  )
}
