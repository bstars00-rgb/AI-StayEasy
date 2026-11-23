import type { NearbyResult } from '../lib/nearby'
import { formatDistance, mapsLink } from '../lib/nearby'
import { nearbyStrings } from '../lib/nearbyI18n'
import type { Lang } from '../i18n'

/** Nearest-first list of the city's recommended places, measured from this hotel. */
export function NearbyPlaces({ result, lang }: { result: NearbyResult; lang: Lang }) {
  const s = nearbyStrings[lang]
  if (result.items.length === 0) return null

  return (
    <div>
      <p className="text-sm text-ink-700/80">{s.subtitle}</p>
      <ol className="mt-3 grid gap-2 sm:grid-cols-2">
        {result.items.map((p, i) => (
          <li key={p.id} className="flex items-center gap-3 rounded-xl bg-sand-50 p-3 ring-1 ring-black/5">
            <span aria-hidden className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-amber-500 text-xs font-bold text-white">{i + 1}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-ink-900">{p.name}</p>
              <p className="text-xs text-ink-700/70">
                {s.category[p.category]} · {s.about} {formatDistance(p.km)}
              </p>
            </div>
            <a
              href={mapsLink(p.lat, p.lng)}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 text-xs font-semibold text-brand-700 hover:underline"
            >
              {s.openMap} ↗
            </a>
          </li>
        ))}
      </ol>
      <p className="mt-2 text-xs text-ink-700/55">
        {s.note}
        {!result.pinConfirmed && ` ${s.areaPinNote}`}
      </p>
    </div>
  )
}
