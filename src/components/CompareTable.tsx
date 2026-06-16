import { Link } from 'react-router-dom'
import type { Hotel } from '../types'
import { useLang, useT, localizeHotel } from '../i18n'
import { facilityIcon } from '../lib/facilities'
import { HotelImage } from './HotelImage'
import { WishlistButton } from './WishlistButton'

const COMPARE_FACILITIES = [
  'Pool', 'Breakfast', 'Beachfront', 'Kids-friendly', 'Korean-friendly',
  'Spa', 'Gym', 'Airport transfer', 'Kitchen',
]

export function CompareTable({ hotels: raws }: { hotels: Hotel[] }) {
  const t = useT()
  const { lang } = useLang()
  const hotels = raws.map((h) => localizeHotel(h, lang))
  const fLabel = (f: string) => (t.enums.facility as Record<string, string>)[f] ?? f
  const enumArea = (a: string) => (t.enums.area as Record<string, string>)[a] ?? a
  const enumCity = (c: string) => (t.enums.city as Record<string, string>)[c] ?? c
  const enumType = (ty: string) => (t.enums.hotelType as Record<string, string>)[ty] ?? ty

  const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <tr className="border-t border-black/5">
      <th className="sticky left-0 z-10 bg-sand-50 p-3 text-left align-top text-xs font-bold uppercase tracking-wide text-ink-600/70">
        {label}
      </th>
      {children}
    </tr>
  )

  return (
    <div className="overflow-x-auto rounded-2xl bg-white shadow-card ring-1 ring-black/5">
      <table className="min-w-full border-separate border-spacing-0">
        <thead>
          <tr>
            <th className="sticky left-0 z-10 bg-white p-3" />
            {hotels.map((h) => (
              <th key={h.id} className="min-w-[200px] p-3 align-top">
                <div className="relative">
                  <HotelImage src={h.imageUrl} gradient={h.heroColor} emoji={h.emoji} className="h-24 w-full" label={h.name} />
                  <WishlistButton hotelId={h.slug} className="absolute right-2 top-2" />
                </div>
                <Link to={`/hotels/${h.slug}`} className="mt-2 block text-left text-sm font-bold text-ink-900 hover:text-brand-700">
                  {h.name}
                </Link>
                <span className="mt-1 inline-block pill bg-sand-100 text-ink-700">{enumType(h.hotelType)}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <Row label={t.list.groupArea}>
            {hotels.map((h) => (
              <td key={h.id} className="p-3 text-sm text-ink-800">{enumArea(h.area)}, {enumCity(h.city)}</td>
            ))}
          </Row>
          <Row label={t.common.bestFor}>
            {hotels.map((h) => (
              <td key={h.id} className="p-3 text-sm text-ink-800">{h.bestFor.slice(0, 2).join(' · ')}</td>
            ))}
          </Row>
          {COMPARE_FACILITIES.map((f) => (
            <Row key={f} label={`${facilityIcon(f)} ${fLabel(f)}`}>
              {hotels.map((h) => (
                <td key={h.id} className="p-3 text-center text-sm">
                  {h.facilities.includes(f) ? <span className="text-brand-600">✓</span> : <span className="text-ink-700/30">—</span>}
                </td>
              ))}
            </Row>
          ))}
          <Row label={`🏷️ ${t.common.officialBenefit}`}>
            {hotels.map((h) => (
              <td key={h.id} className="p-3 text-sm text-ink-800">{h.officialBenefits[0]}</td>
            ))}
          </Row>
          <tr className="border-t border-black/5">
            <th className="sticky left-0 z-10 bg-sand-50 p-3" />
            {hotels.map((h) => (
              <td key={h.id} className="p-3">
                <a
                  href={h.officialWebsiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-full bg-brand-600 px-3 py-2 text-center text-xs font-bold text-white hover:bg-brand-700"
                >
                  {t.common.officialWebsite} ↗
                </a>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  )
}
