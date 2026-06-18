import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../i18n'
import { conciergeStrings } from '../lib/conciergeI18n'
import { useAllThreads } from '../lib/messages'
import { findInCatalogue } from '../data/mockRepo'
import { GuestMessageDialog } from '../components/GuestMessageDialog'
import { useDocumentMeta } from '../lib/useDocumentMeta'

export default function MyMessagesPage() {
  const { lang } = useLang()
  const s = conciergeStrings[lang]
  useDocumentMeta('My messages — StayEasy', 'Your messages with hotels you booked direct.')
  const threads = useAllThreads()
  const [open, setOpen] = useState<{ slug: string; name: string } | null>(null)

  return (
    <div className="container-page max-w-2xl py-10">
      <nav className="mb-4 text-sm text-ink-700/60">
        <Link to="/" className="hover:text-brand-700">Home</Link> <span className="px-1">/</span> {s.inboxTitle}
      </nav>
      <h1 className="text-3xl font-extrabold text-ink-900">{s.inboxTitle}</h1>
      <p className="mt-2 text-ink-700/80">🌐 {s.guestSubtitle}</p>

      {threads.length === 0 ? (
        <div className="mt-8 rounded-2xl bg-white p-10 text-center shadow-card ring-1 ring-black/5">
          <div className="text-3xl">💬</div>
          <p className="mt-2 text-sm text-ink-700/70">{s.inboxEmpty}</p>
          <Link to="/destinations/da-nang" className="mt-4 inline-block rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">Browse hotels</Link>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {threads.map((t) => {
            const hotel = findInCatalogue(t.hotelSlug)
            const last = t.messages[t.messages.length - 1]
            const hasReply = t.messages.some((m) => m.from === 'hotel')
            return (
              <button
                key={t.id}
                onClick={() => setOpen({ slug: t.hotelSlug, name: hotel?.name ?? t.hotelSlug })}
                className="flex w-full items-center justify-between gap-3 rounded-2xl bg-white p-5 text-left shadow-card ring-1 ring-black/5 transition-colors hover:bg-sand-50"
              >
                <div className="min-w-0">
                  <p className="font-bold text-ink-900">{hotel?.name ?? t.hotelSlug}</p>
                  <p className="mt-0.5 truncate text-sm text-ink-700/70">{last ? last.text : t.requests.map((k) => s.request[k]).join(' · ')}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {hasReply && <span className="pill bg-accent-50 text-accent-700">{s.translated} ↩</span>}
                  <span className="text-brand-700">→</span>
                </div>
              </button>
            )
          })}
        </div>
      )}

      {open && <GuestMessageDialog hotelSlug={open.slug} hotelName={open.name} onClose={() => setOpen(null)} />}
    </div>
  )
}
