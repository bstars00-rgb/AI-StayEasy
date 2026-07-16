import { useState } from 'react'
import { useLang } from '../i18n'
import { repo } from '../data/repo'
import { type Recommendation } from '../lib/searchEngine'
import { searchStrings } from '../lib/searchI18n'
import { HotelCard } from './HotelCard'
import { IconSparkle } from './icons'

export function AISearch({ autoFocus = false }: { autoFocus?: boolean }) {
  const { lang } = useLang()
  const s = searchStrings[lang]
  const [query, setQuery] = useState('')
  const [rec, setRec] = useState<Recommendation | null>(null)
  const [loading, setLoading] = useState(false)

  const run = async (q: string) => {
    const text = q.trim()
    if (!text) return
    setLoading(true)
    setRec(null)
    try {
      setRec(await repo.recommend(text))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Search box */}
      <div className="rounded-3xl bg-white p-5 shadow-card ring-1 ring-black/5 sm:p-6">
        <div className="flex items-center gap-2 text-brand-700">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white"><IconSparkle className="h-4 w-4" /></span>
          <h2 className="text-lg font-extrabold text-ink-900">{s.title}</h2>
        </div>
        <p className="mt-1.5 text-sm text-ink-700/80">{s.subtitle}</p>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <textarea
            value={query}
            autoFocus={autoFocus}
            aria-label={s.title}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                run(query)
              }
            }}
            rows={2}
            placeholder={s.placeholder}
            className="flex-1 resize-none rounded-2xl border border-black/10 bg-sand-50 px-4 py-3 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />
          <button
            onClick={() => run(query)}
            disabled={!query.trim() || loading}
            className="shrink-0 rounded-2xl bg-brand-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-brand-700 disabled:opacity-50 sm:self-stretch"
          >
            {loading ? '…' : s.button}
          </button>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-ink-700/50">{s.examplesLabel}</span>
          {s.examples.map((ex) => (
            <button
              key={ex}
              onClick={() => {
                setQuery(ex)
                run(ex)
              }}
              className="pill border border-black/10 bg-white text-ink-700 hover:bg-sand-50"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div
          role="status"
          aria-live="polite"
          className="mt-5 flex items-center justify-center gap-3 rounded-2xl bg-white p-8 text-ink-700/70 shadow-card ring-1 ring-black/5"
        >
          <span aria-hidden="true" className="h-5 w-5 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
          {s.thinking}
        </div>
      )}

      {/* Results */}
      {rec && !loading && (
        <div className="mt-6" aria-live="polite">
          {/* Understood intents */}
          {rec.detected.length > 0 && (
            <div className="mb-4 rounded-2xl bg-brand-50 px-4 py-3 ring-1 ring-brand-100">
              <p className="text-xs font-bold uppercase tracking-wide text-brand-700">🧠 {s.understood}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {rec.detected.map((sig) => (
                  <span key={sig} className="pill bg-white text-brand-700 ring-1 ring-brand-200">{s.reason[sig]}</span>
                ))}
              </div>
            </div>
          )}
          {rec.comingSoon ? (
            <div className="mb-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800 ring-1 ring-amber-200">
              {s.comingSoonNote.replace('{city}', rec.comingSoon)}
            </div>
          ) : (
            rec.generic && (
              <div className="mb-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800 ring-1 ring-amber-200">
                {s.genericNote}
              </div>
            )
          )}

          {rec.results.length === 0 ? (
            <div className="rounded-2xl bg-white p-10 text-center shadow-card ring-1 ring-black/5">
              <div className="text-3xl">🔍</div>
              <h3 className="mt-2 font-bold text-ink-900">{s.noMatchTitle}</h3>
              <p className="mt-1 text-sm text-ink-700/70">{s.noMatchText}</p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {rec.results.map((r) => (
                <div key={r.hotel.id} className="space-y-2">
                  {!rec.generic && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="pill bg-brand-600 text-white">{r.pct}% {s.matchSuffix}</span>
                      {r.reasons.slice(0, 4).map((sig) => (
                        <span key={sig} className="pill bg-sand-100 text-ink-700">✓ {s.reason[sig]}</span>
                      ))}
                    </div>
                  )}
                  <HotelCard hotel={r.hotel} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
