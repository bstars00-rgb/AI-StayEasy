import Button from '../components/Button'
import { HotelCard } from '../components/HotelCard'
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

  const { ids, count, clear } = useWishlist()
  const key = ids.join(',')
  const { data: hotels = [], loading } = useAsync(
    () =>
      Promise.all(ids.map((slug) => repo.getHotel(slug))).then((r) => r.filter((h): h is Hotel => Boolean(h))),
    [key],
  )

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
        {count > 0 && (
          <div className="mb-5 flex items-center justify-between">
            <p className="text-sm text-ink-700/70">
              <span className="font-semibold text-ink-900">{count}</span> {s.countSuffix}
            </p>
            <button onClick={clear} className="text-sm font-semibold text-ink-700/60 underline hover:text-ink-900">
              {s.clear}
            </button>
          </div>
        )}

        {count === 0 ? (
          <div className="rounded-3xl bg-white p-12 text-center shadow-card ring-1 ring-black/5">
            <div className="text-5xl">♡</div>
            <h2 className="mt-3 text-xl font-bold text-ink-900">{s.emptyTitle}</h2>
            <p className="mt-1 text-sm text-ink-700/70">{s.emptyText}</p>
            <div className="mt-6">
              <Button to="/destinations/da-nang">{s.browse}</Button>
            </div>
          </div>
        ) : loading ? (
          <CardGridSkeleton count={Math.min(count, 6)} />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {hotels.map((h) => (
              <HotelCard key={h.id} hotel={h} />
            ))}
          </div>
        )}
      </section>
    </>
  )
}
