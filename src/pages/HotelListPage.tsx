import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom'
import Button from '../components/Button'
import { HotelCard } from '../components/HotelCard'
import { CardGridSkeleton, Spinner } from '../components/Loading'
import { repo } from '../data/repo'
import { useAsync } from '../lib/useAsync'
import type { Hotel } from '../types'
import { useT } from '../i18n'
import { useDocumentMeta } from '../lib/useDocumentMeta'

type GroupKey = 'area' | 'travel' | 'features' | 'benefits'

const TRAVEL_OPTS = ['Family', 'Couple', 'Business', 'Beach', 'Long Stay']
const FEATURE_OPTS = ['Pool', 'Breakfast', 'Kids-friendly', 'Korean-friendly', 'Airport transfer']
const BENEFIT_OPTS = ['Free breakfast', 'Flexible cancellation', 'Room upgrade', 'Late checkout']

// How each filter group tests a hotel.
const matchers: Record<GroupKey, (h: Hotel, value: string) => boolean> = {
  area: (h, v) => h.area === v,
  travel: (h, v) => h.tags.includes(v as Hotel['tags'][number]),
  features: (h, v) => h.facilities.some((f) => f.toLowerCase() === v.toLowerCase()),
  benefits: (h, v) => h.officialBenefits.some((b) => b.toLowerCase().includes(v.toLowerCase().replace('free breakfast', 'breakfast'))),
}

export default function HotelListPage() {
  const t = useT()
  const { citySlug } = useParams()
  useDocumentMeta(t.list.metaTitle, t.list.metaDesc)

  const destQ = useAsync(() => repo.getDestination(citySlug ?? 'da-nang'), [citySlug])
  const dest = destQ.data
  const hotelsQ = useAsync(() => (dest ? repo.listHotelsByCity(dest.city) : Promise.resolve([])), [dest?.city])

  const [searchParams, setSearchParams] = useSearchParams()
  const [selected, setSelected] = useState<Record<GroupKey, string[]>>({ area: [], travel: [], features: [], benefits: [] })

  // City's hotels + the areas that actually exist for this city.
  const all = hotelsQ.data ?? []
  const areaOptions = useMemo(() => Array.from(new Set(all.map((h) => h.area))), [all])

  // Reset filters when the city changes.
  useEffect(() => {
    setSelected({ area: [], travel: [], features: [], benefits: [] })
  }, [citySlug])

  // Preselect a travel-style from the home discovery block (?style=Family).
  useEffect(() => {
    const style = searchParams.get('style')
    if (style && TRAVEL_OPTS.includes(style)) {
      setSelected((s) => (s.travel.includes(style) ? s : { ...s, travel: [...s.travel, style] }))
    }
  }, [searchParams])

  if (destQ.loading) {
    return (
      <div className="container-page">
        <Spinner />
      </div>
    )
  }

  // Unknown city slug → back to the destinations overview.
  if (!dest) return <Navigate to="/destinations/vietnam" replace />

  const cityName = (t.enums.city as Record<string, string>)[dest.city] ?? dest.city
  const isDaNang = dest.city === 'Da Nang'

  // City listed but no hotels onboarded yet → friendly "coming soon" panel.
  if (!dest.available) {
    return (
      <section className="container-page py-20 text-center">
        <div className="text-5xl">{dest.emoji}</div>
        <h1 className="mt-4 text-3xl font-extrabold text-ink-900">{cityName}</h1>
        <p className="mx-auto mt-2 max-w-xl text-ink-700/75">{dest.shortDescription}</p>
        <span className="pill mt-4 inline-flex bg-amber-50 text-amber-700 ring-1 ring-amber-200">{t.common.comingSoon}</span>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button to="/destinations/vietnam">← {t.vietnam.destTitle}</Button>
          <Button to="/destinations/da-nang" variant="white">{t.list.heroTitle}</Button>
        </div>
      </section>
    )
  }

  const filters: Record<GroupKey, string[]> = {
    area: areaOptions,
    travel: TRAVEL_OPTS,
    features: FEATURE_OPTS,
    benefits: BENEFIT_OPTS,
  }

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

  const groupLabel: Record<GroupKey, string> = {
    area: t.list.groupArea,
    travel: t.list.groupTravel,
    features: t.list.groupFeatures,
    benefits: t.list.groupBenefits,
  }

  const benefitLabel: Record<string, string> = {
    'Free breakfast': t.list.benefitFreeBreakfast,
    'Flexible cancellation': t.list.benefitFlexCancel,
    'Room upgrade': t.list.benefitUpgrade,
    'Late checkout': t.list.benefitLateCheckout,
  }
  const optionLabel = (g: GroupKey, opt: string): string => {
    if (g === 'area') return (t.enums.area as Record<string, string>)[opt] ?? opt
    if (g === 'travel') return (t.enums.travelStyle as Record<string, string>)[opt] ?? opt
    if (g === 'features') return (t.enums.facility as Record<string, string>)[opt] ?? opt
    return benefitLabel[opt] ?? opt
  }

  const results = all.filter((h) =>
    (Object.keys(selected) as GroupKey[]).every((g) => {
      const vals = selected[g]
      return vals.length === 0 || vals.some((v) => matchers[g](h, v))
    }),
  )

  return (
    <>
      {/* 1. Hero */}
      <section className="bg-gradient-to-br from-sky-600 to-brand-600 py-12 text-white">
        <div className="container-page">
          <nav className="mb-3 text-sm text-white/70">
            <Link to="/" className="hover:text-white">Home</Link> <span className="px-1">/</span>
            <Link to="/destinations/vietnam" className="hover:text-white"> Vietnam</Link> <span className="px-1">/</span> {cityName}
          </nav>
          <h1 className="text-4xl font-extrabold tracking-tight">{isDaNang ? t.list.heroTitle : cityName}</h1>
          <p className="mt-2 max-w-2xl text-white/85">{t.list.heroSubtitle}</p>
        </div>
      </section>

      <section className="container-page mt-6">
        {/* 2. Filter bar */}
        <div className="rounded-2xl bg-white p-4 shadow-card ring-1 ring-black/5 sm:p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-ink-900">{t.list.filterTitle}</h2>
            {activeCount > 0 && (
              <button onClick={clearAll} className="text-xs font-semibold text-ink-700/60 underline hover:text-ink-900">
                {t.list.clearAll} ({activeCount})
              </button>
            )}
          </div>
          <div className="mt-4 space-y-4">
            {(Object.keys(filters) as GroupKey[]).map((g) => (
              <div key={g}>
                <p className="text-xs font-bold uppercase tracking-wide text-ink-700/50">{groupLabel[g]}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {filters[g].map((opt) => {
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
                        {optionLabel(g, opt)}
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
            <span className="font-semibold text-ink-900">{results.length}</span> {t.common.hotels} {t.list.resultsMatch}
          </p>
          <p className="hidden text-xs text-ink-700/50 sm:block">{t.list.curatedNote}</p>
        </div>

        {hotelsQ.loading ? (
          <div className="mt-4">
            <CardGridSkeleton count={6} />
          </div>
        ) : (
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((h) => (
              <HotelCard key={h.id} hotel={h} />
            ))}
          </div>
        )}

        {!hotelsQ.loading && results.length === 0 && (
          <div className="rounded-2xl bg-white p-10 text-center shadow-card ring-1 ring-black/5">
            <div className="text-3xl">🔍</div>
            <h3 className="mt-2 font-bold text-ink-900">{t.list.noneTitle}</h3>
            <p className="mt-1 text-sm text-ink-700/70">{t.list.noneText}</p>
            <button onClick={clearAll} className="mt-4 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">
              {t.list.reset}
            </button>
          </div>
        )}
      </section>

      {/* 4. Content block — how to choose (Da Nang-specific) */}
      {isDaNang && (
        <section className="container-page mt-16">
          <div className="rounded-3xl bg-white p-8 shadow-card ring-1 ring-black/5 sm:p-10">
            <h2 className="text-2xl font-extrabold text-ink-900">{t.list.chooseTitle}</h2>
            <p className="mt-2 text-sm text-ink-700/80">{t.list.chooseIntro}</p>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: '🏖️', t: t.list.choose1t, d: t.list.choose1d },
                { icon: '🌉', t: t.list.choose2t, d: t.list.choose2d },
                { icon: '🌴', t: t.list.choose3t, d: t.list.choose3d },
                { icon: '🏙️', t: t.list.choose4t, d: t.list.choose4d },
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
      )}

      {/* 5. CTA for hotels */}
      <section className="container-page my-16">
        <div className="flex flex-col items-center justify-between gap-4 rounded-3xl bg-gradient-to-br from-ink-900 to-brand-800 p-8 text-white sm:flex-row sm:p-10">
          <div>
            <h2 className="text-xl font-extrabold sm:text-2xl">{t.list.hotelCtaTitle}</h2>
            <p className="mt-1 text-white/80">{t.list.hotelCtaText}</p>
          </div>
          <Button to="/partners" variant="white" size="lg">{t.list.hotelCtaBtn}</Button>
        </div>
      </section>
    </>
  )
}
