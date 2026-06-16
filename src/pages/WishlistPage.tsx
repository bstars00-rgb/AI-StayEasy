import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Button from '../components/Button'
import { HotelCard } from '../components/HotelCard'
import { CompareTable } from '../components/CompareTable'
import { CardGridSkeleton } from '../components/Loading'
import { repo } from '../data/repo'
import { useAsync } from '../lib/useAsync'
import type { Hotel } from '../types'
import { useWishlist } from '../lib/wishlist'
import { wishlistStrings } from '../lib/wishlistI18n'
import { useLang } from '../i18n'
import { useDocumentMeta } from '../lib/useDocumentMeta'

export default function WishlistPage() {
  const { lang } = useLang()
  const s = wishlistStrings[lang]
  useDocumentMeta(`${s.title} — StayEasy Vietnam`, s.subtitle)

  const [params] = useSearchParams()
  const sharedRaw = params.get('ids')
  const sharedMode = sharedRaw !== null
  const { ids: savedIds, count: savedCount, clear } = useWishlist()

  const ids = sharedMode ? (sharedRaw ? sharedRaw.split(',').filter(Boolean) : []) : savedIds
  const count = ids.length
  const key = ids.join(',')

  const [view, setView] = useState<'cards' | 'compare'>('cards')
  const [copied, setCopied] = useState(false)

  const { data: hotels = [], loading } = useAsync(
    () => Promise.all(ids.map((slug) => repo.getHotel(slug))).then((r) => r.filter((h): h is Hotel => Boolean(h))),
    [key],
  )

  const onShare = async () => {
    try {
      const url = `${window.location.origin}${import.meta.env.BASE_URL}wishlist?ids=${encodeURIComponent(ids.join(','))}`
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard may be unavailable */
    }
  }

  return (
    <>
      <section className="bg-gradient-to-br from-accent-500 to-brand-600 py-12 text-white">
        <div className="container-page">
          <span className="pill bg-white/15 text-white ring-1 ring-white/25">♥ {s.nav}</span>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">{s.title}</h1>
          <p className="mt-2 max-w-2xl text-white/85">{s.subtitle}</p>
        </div>
      </section>

      <section className="container-page my-8">
        {sharedMode && count > 0 && (
          <div className="mb-5 rounded-2xl bg-brand-50 px-4 py-3 text-sm text-brand-800 ring-1 ring-brand-100">
            🔗 {s.sharedBanner}
          </div>
        )}

        {count === 0 && !sharedMode ? (
          <div className="rounded-3xl bg-white p-12 text-center shadow-card ring-1 ring-black/5">
            <div className="text-5xl">♡</div>
            <h2 className="mt-3 text-xl font-bold text-ink-900">{s.emptyTitle}</h2>
            <p className="mt-1 text-sm text-ink-700/70">{s.emptyText}</p>
            <div className="mt-6">
              <Button to="/destinations/da-nang">{s.browse}</Button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-ink-700/70">
                <span className="font-semibold text-ink-900">{count}</span> {s.countSuffix}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {count > 1 && (
                  <div className="inline-flex rounded-full bg-white p-1 ring-1 ring-black/10">
                    {(['cards', 'compare'] as const).map((v) => (
                      <button
                        key={v}
                        onClick={() => setView(v)}
                        className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                          view === v ? 'bg-ink-900 text-white' : 'text-ink-700 hover:bg-sand-50'
                        }`}
                      >
                        {v === 'cards' ? s.viewCards : s.viewCompare}
                      </button>
                    ))}
                  </div>
                )}
                <button
                  onClick={onShare}
                  className="rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-ink-800 ring-1 ring-black/10 hover:bg-sand-50"
                >
                  {copied ? `✓ ${s.copied}` : `🔗 ${s.share}`}
                </button>
                {!sharedMode && savedCount > 0 && (
                  <button onClick={clear} className="text-xs font-semibold text-ink-700/60 underline hover:text-ink-900">
                    {s.clear}
                  </button>
                )}
              </div>
            </div>

            {loading ? (
              <CardGridSkeleton count={Math.min(count, 6)} />
            ) : view === 'compare' && count > 1 ? (
              <CompareTable hotels={hotels} />
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {hotels.map((h) => (
                  <HotelCard key={h.id} hotel={h} />
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </>
  )
}
