import { Link } from 'react-router-dom'
import type { Hotel } from '../types'
import { HotelImage } from './HotelImage'
import { SponsoredBadge } from './SponsoredBadge'
import { FacilityChips } from './Facilities'
import { WishlistButton } from './WishlistButton'
import { useLang, useT, localizeHotel } from '../i18n'
import { voucherStrings } from '../lib/voucherI18n'
import { officialLink } from '../lib/officialLink'
import { IconPin, IconTag } from './icons'
import { BM_ENABLED } from '../lib/bm'
import { imageNotice } from '../lib/imageNoticeI18n'
import { distinctionOf } from '../lib/distinction'
import { headlineBenefit } from '../data/hotels'
import { StarRating, DistinctionBadge } from './HotelRating'

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
  const dist = distinctionOf(raw.slug)
  const benefit = headlineBenefit(hotel)

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
          {dist && <DistinctionBadge kind={dist} />}
          {BM_ENABLED && hotel.isSponsored && <SponsoredBadge />}
          {BM_ENABLED && raw.voucher && (
            <span className="pill bg-brand-600 text-white"><IconTag className="h-3.5 w-3.5" /> {voucherStrings[lang].badge}</span>
          )}
        </div>
        <div className="absolute bottom-3 right-3">
          <span className="pill bg-white/90 text-ink-900 backdrop-blur">{type}</span>
        </div>
        {/* Honesty: listing photos are stock until the hotel supplies real ones. */}
        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-md bg-black/60 px-2 py-1 text-[11px] font-semibold text-white shadow-sm backdrop-blur-sm">
          <span aria-hidden>📷</span> {imageNotice[lang].chip}
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <Link to={`/hotels/${hotel.slug}`}>
            <h3 className="line-clamp-2 min-h-[2.75rem] font-bold leading-snug text-ink-900 group-hover:text-brand-700">{hotel.name}</h3>
          </Link>
          {raw.conditions.starRating ? (
            <StarRating value={raw.conditions.starRating} className="mt-0.5" />
          ) : (
            <span aria-hidden className="mt-0.5 block h-3.5" />
          )}
          <p className="mt-1 flex items-center gap-1 text-sm text-ink-700/70">
            <IconPin className="h-3.5 w-3.5 shrink-0 text-ink-700/45" /> {area}, {city}
          </p>
        </div>

        <p className="line-clamp-2 min-h-[2.5rem] text-sm text-ink-700/90">{hotel.shortDescription}</p>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-700/50">{t.common.bestFor}</p>
          <p className="mt-0.5 truncate text-sm font-medium text-ink-800">{hotel.bestFor.slice(0, 2).join(' · ')}</p>
        </div>

        {/* Fixed single-row height so the official-benefit block sits at the same
            position on every card regardless of how many facilities a hotel has. */}
        <div className="h-7 overflow-hidden">
          <FacilityChips items={hotel.facilities} limit={3} />
        </div>

        {/* Only a substantive, site-verified perk earns this box (HEADLINE_BENEFIT).
            Most hotels have nothing beyond "book on the official website", and
            rendering that here dressed a non-answer as an answer — so they get
            no box at all. */}
        {benefit && (
          <div className="rounded-xl bg-brand-50 px-3 py-2">
            <p className="flex items-center gap-1 text-xs font-semibold text-brand-700"><IconTag className="h-3.5 w-3.5" /> {t.common.officialBenefit}</p>
            <p className="line-clamp-1 text-sm text-ink-800">{benefit}</p>
          </div>
        )}

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
