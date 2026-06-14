import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Button from '../components/Button'
import { HotelCard } from '../components/HotelCard'
import { hotelsByCity } from '../data/hotels'
import type { Hotel } from '../types'

type GroupKey = 'area' | 'travel' | 'features' | 'benefits'

const FILTERS: Record<GroupKey, { label: string; options: string[] }> = {
  area: { label: 'Area', options: ['My Khe Beach', 'Han River', 'City Center', 'Resort Area'] },
  travel: { label: 'Travel type', options: ['Family', 'Couple', 'Business', 'Beach', 'Long Stay'] },
  features: { label: 'Features', options: ['Pool', 'Breakfast', 'Kids-friendly', 'Korean-friendly', 'Airport transfer'] },
  benefits: { label: 'Official benefits', options: ['Free breakfast', 'Flexible cancellation', 'Room upgrade', 'Late checkout'] },
}

// How each filter group tests a hotel.
const matchers: Record<GroupKey, (h: Hotel, value: string) => boolean> = {
  area: (h, v) => h.area === v,
  travel: (h, v) => h.tags.includes(v as Hotel['tags'][number]),
  features: (h, v) => h.facilities.some((f) => f.toLowerCase() === v.toLowerCase()),
  benefits: (h, v) => h.officialBenefits.some((b) => b.toLowerCase().includes(v.toLowerCase().replace('free breakfast', 'breakfast'))),
}

export default function HotelListPage() {
  const all = hotelsByCity('Da Nang')
  const [searchParams, setSearchParams] = useSearchParams()
  const [selected, setSelected] = useState<Record<GroupKey, string[]>>({ area: [], travel: [], features: [], benefits: [] })

  // Preselect a travel-style from the home discovery block (?style=Family).
  useEffect(() => {
    const style = searchParams.get('style')
    if (style && FILTERS.travel.options.includes(style)) {
      setSelected((s) => (s.travel.includes(style) ? s : { ...s, travel: [...s.travel, style] }))
    }
  }, [searchParams])

  const toggle = (group: GroupKey, value: string) =>
    setSelected((s) => ({
      ...s,
      [group]: s[group].includes(value) ? s[group].filter((v) => v !== value) : [...s[group], value],
    }))

  const clearAll = () => {
    setSelected({ area: [], travel: [], features: [], benefits: [] })
    setSearchParams({})
  }

  const activeCount = Object.values(selected).reduce((n, arr) => n + arr.length, 0)

  const results = useMemo(() => {
    return all.filter((h) =>
      (Object.keys(selected) as GroupKey[]).every((g) => {
        const vals = selected[g]
        return vals.length === 0 || vals.some((v) => matchers[g](h, v))
      }),
    )
  }, [all, selected])

  return (
    <>
      {/* 1. Hero */}
      <section className="bg-gradient-to-br from-sky-600 to-brand-600 py-12 text-white">
        <div className="container-page">
          <nav className="mb-3 text-sm text-white/70">
            <Link to="/" className="hover:text-white">Home</Link> <span className="px-1">/</span>
            <Link to="/destinations/vietnam" className="hover:text-white"> Vietnam</Link> <span className="px-1">/</span> Da Nang
          </nav>
          <h1 className="text-4xl font-extrabold tracking-tight">Da Nang hotels for direct booking</h1>
          <p className="mt-2 max-w-2xl text-white/85">Compare hotels by location, travel style, and official booking benefits.</p>
        </div>
      </section>

      <section className="container-page mt-6">
        {/* 2. Filter bar */}
        <div className="rounded-2xl bg-white p-4 shadow-card ring-1 ring-black/5 sm:p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-ink-900">Filter by what matters for your trip</h2>
            {activeCount > 0 && (
              <button onClick={clearAll} className="text-xs font-semibold text-ink-700/60 underline hover:text-ink-900">
                Clear all ({activeCount})
              </button>
            )}
          </div>
          <div className="mt-4 space-y-4">
            {(Object.keys(FILTERS) as GroupKey[]).map((g) => (
              <div key={g}>
                <p className="text-xs font-bold uppercase tracking-wide text-ink-700/50">{FILTERS[g].label}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {FILTERS[g].options.map((opt) => {
                    const on = selected[g].includes(opt)
                    return (
                      <button
                        key={opt}
                        onClick={() => toggle(g, opt)}
                        aria-pressed={on}
                        className={`pill border transition-colors ${
                          on ? 'border-brand-600 bg-brand-600 text-white' : 'border-black/10 bg-white text-ink-700 hover:bg-sand-50'
                        }`}
                      >
                        {opt}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Hotel cards */}
        <div className="mt-5 flex items-center justify-between">
          <p className="text-sm text-ink-700/70">
            <span className="font-semibold text-ink-900">{results.length}</span> hotel{results.length !== 1 && 's'} match your trip
          </p>
          <p className="hidden text-xs text-ink-700/50 sm:block">Curated for suitability — not sorted by lowest price.</p>
        </div>

        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((h) => (
            <HotelCard key={h.id} hotel={h} />
          ))}
        </div>

        {results.length === 0 && (
          <div className="rounded-2xl bg-white p-10 text-center shadow-card ring-1 ring-black/5">
            <div className="text-3xl">🔍</div>
            <h3 className="mt-2 font-bold text-ink-900">No hotels match those filters</h3>
            <p className="mt-1 text-sm text-ink-700/70">Try removing a filter to see more options.</p>
            <button onClick={clearAll} className="mt-4 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">
              Reset filters
            </button>
          </div>
        )}
      </section>

      {/* 4. Content block — how to choose */}
      <section className="container-page mt-16">
        <div className="rounded-3xl bg-white p-8 shadow-card ring-1 ring-black/5 sm:p-10">
          <h2 className="text-2xl font-extrabold text-ink-900">How to choose a Da Nang hotel</h2>
          <p className="mt-2 text-sm text-ink-700/80">Pick your area first — it shapes the whole trip.</p>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: '🏖️', t: 'My Khe Beach', d: 'Best for a beach trip — sand, sea-view rooms, and family resorts.' },
              { icon: '🌉', t: 'Han River', d: 'Best for city access — walkable to the Dragon Bridge, dining, and nightlife.' },
              { icon: '🌴', t: 'Resort Area', d: 'Best for a family or couples’ vacation — quieter, spread-out resorts.' },
              { icon: '🏙️', t: 'City Center', d: 'Best for business and short stays — central, convenient, and well-connected.' },
            ].map((c) => (
              <div key={c.t} className="rounded-2xl bg-sand-50 p-5 ring-1 ring-black/5">
                <div className="text-2xl">{c.icon}</div>
                <h3 className="mt-2 font-bold text-ink-900">{c.t}</h3>
                <p className="mt-1 text-sm text-ink-700/80">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CTA for hotels */}
      <section className="container-page my-16">
        <div className="flex flex-col items-center justify-between gap-4 rounded-3xl bg-gradient-to-br from-ink-900 to-brand-800 p-8 text-white sm:flex-row sm:p-10">
          <div>
            <h2 className="text-xl font-extrabold sm:text-2xl">Are you a hotel in Da Nang?</h2>
            <p className="mt-1 text-white/80">Promote your official booking benefits on StayEasy — commission-free.</p>
          </div>
          <Button to="/partners" variant="white" size="lg">Partner with StayEasy</Button>
        </div>
      </section>
    </>
  )
}
