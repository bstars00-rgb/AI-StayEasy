import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { destinations } from '../data/destinations'
import type { TravelStyle } from '../types'
import { useT } from '../i18n'

const styles: TravelStyle[] = ['Family', 'Couple', 'Business', 'Beach', 'Long Stay', 'Korean-friendly']

/** Destination + travel-style discovery. Routes to the Da Nang list with a style filter. */
export function DiscoveryBlock() {
  const navigate = useNavigate()
  const t = useT()
  const [city, setCity] = useState('da-nang')
  const [style, setStyle] = useState<TravelStyle | null>(null)

  const go = () => {
    const params = new URLSearchParams()
    if (style) params.set('style', style)
    // Only Da Nang is live; any selection lands on Da Nang for the prototype.
    navigate(`/destinations/da-nang${params.toString() ? `?${params.toString()}` : ''}`)
  }

  return (
    <div className="rounded-3xl bg-white p-5 shadow-card ring-1 ring-black/5 sm:p-6">
      <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wide text-ink-700/50">{t.home.discovery.whereTo}</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {destinations.map((d) => (
                <button
                  key={d.slug}
                  onClick={() => d.available && setCity(d.slug)}
                  disabled={!d.available}
                  className={`pill border transition-colors ${
                    city === d.slug
                      ? 'border-brand-600 bg-brand-600 text-white'
                      : d.available
                        ? 'border-black/10 bg-white text-ink-700 hover:bg-sand-50'
                        : 'cursor-not-allowed border-black/5 bg-sand-50 text-ink-700/40'
                  }`}
                >
                  {d.emoji} {(t.enums.city as Record<string, string>)[d.city] ?? d.city}
                  {!d.available && ` · ${t.home.discovery.soon}`}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wide text-ink-700/50">{t.home.discovery.travelStyle}</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {styles.map((s) => (
                <button
                  key={s}
                  onClick={() => setStyle((cur) => (cur === s ? null : s))}
                  className={`pill border transition-colors ${
                    style === s
                      ? 'border-ink-900 bg-ink-900 text-white'
                      : 'border-black/10 bg-white text-ink-700 hover:bg-sand-50'
                  }`}
                >
                  {(t.enums.travelStyle as Record<string, string>)[s] ?? s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={go}
          className="h-12 rounded-full bg-brand-600 px-7 text-sm font-bold text-white shadow-sm hover:bg-brand-700"
        >
          {t.home.discovery.find} →
        </button>
      </div>
    </div>
  )
}
