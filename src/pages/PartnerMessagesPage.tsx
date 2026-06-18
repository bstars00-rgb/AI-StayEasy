import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Logo } from '../components/Logo'
import { useLang } from '../i18n'
import type { Lang } from '../i18n'
import { usePartnerSession } from '../lib/partnerAuth'
import { conciergeStrings } from '../lib/conciergeI18n'
import { concierge, useHotelThreads } from '../lib/messages'
import type { ConciergeThread } from '../lib/messages'
import { useDocumentMeta } from '../lib/useDocumentMeta'

const LANG_NAMES: Record<Lang, string> = { en: 'English', ko: '한국어', vi: 'Tiếng Việt', zh: '中文', ja: '日本語' }

function ThreadCard({ thread, lang }: { thread: ConciergeThread; lang: Lang }) {
  const s = conciergeStrings[lang]
  const [reply, setReply] = useState('')

  const send = (e: React.FormEvent) => {
    e.preventDefault()
    if (!reply.trim()) return
    concierge.reply(thread.id, reply.trim(), lang, new Date().toISOString())
    setReply('')
  }

  return (
    <div className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-black/5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <p className="font-bold text-ink-900">{thread.guestName}</p>
          <p className="text-xs text-ink-600/70">{s.refLabel}: {thread.bookingRef || '—'} · {thread.createdAt.slice(0, 10)}</p>
        </div>
        <span className="pill bg-brand-50 text-brand-700">🌐 {s.translated} · {LANG_NAMES[thread.guestLang]}</span>
      </div>

      {thread.requests.length > 0 && (
        <div className="mt-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-600/60">{s.requestsHeading}</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {thread.requests.map((k) => (
              <span key={k} className="pill bg-sand-100 text-ink-800">{s.request[k]}</span>
            ))}
          </div>
        </div>
      )}

      {thread.messages.length > 0 && (
        <div className="mt-3 space-y-2">
          {thread.messages.map((m) => (
            <div key={m.id} className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${m.from === 'guest' ? 'bg-sand-50 text-ink-800 ring-1 ring-black/5' : 'ml-auto bg-brand-600 text-white'}`}>
              {m.text}
              {m.from === 'guest' && m.lang !== lang && <span className="mt-0.5 block text-[11px] text-ink-600/50">🌐 {s.translated} · {LANG_NAMES[m.lang]}</span>}
            </div>
          ))}
        </div>
      )}

      <form onSubmit={send} className="mt-3 flex gap-2">
        <input value={reply} onChange={(e) => setReply(e.target.value)} placeholder={s.replyPh} className="flex-1 rounded-xl border border-black/10 bg-sand-50 px-3 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100" />
        <button type="submit" className="shrink-0 rounded-xl bg-ink-900 px-4 text-sm font-semibold text-white hover:bg-ink-800">{s.replyBtn}</button>
      </form>
    </div>
  )
}

export default function PartnerMessagesPage() {
  useDocumentMeta('Guest messages — StayEasy partners', 'Translated guest messages for your hotel.')
  const session = usePartnerSession()
  const { lang } = useLang()
  const threads = useHotelThreads(session?.slug ?? '')
  const s = conciergeStrings[lang]

  if (!session) return <Navigate to="/partner/login" replace />

  return (
    <div className="min-h-screen bg-sand-50">
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-black/5 bg-white/90 px-4 backdrop-blur sm:px-6">
        <Link to="/partner" className="flex items-center gap-2 text-sm font-medium text-ink-700 hover:text-ink-900">← Back to portal</Link>
        <Logo size={30} textClass="text-base" />
      </header>

      <main className="mx-auto max-w-2xl p-4 sm:p-6">
        <h1 className="text-2xl font-extrabold text-ink-900">{s.inboxTitle}</h1>
        <p className="mt-1 text-sm text-ink-700/70">Guests message you in their language — you read and reply in yours.</p>

        {threads.length === 0 ? (
          <div className="mt-6 rounded-2xl bg-white p-10 text-center text-sm text-ink-600/70 shadow-card ring-1 ring-black/5">{s.inboxEmpty}</div>
        ) : (
          <div className="mt-5 space-y-4">
            {threads.map((t) => <ThreadCard key={t.id} thread={t} lang={lang} />)}
          </div>
        )}
        <p className="mt-6 text-center text-xs text-ink-600/55">🧪 Demo — a real build delivers these by push (email / Zalo / WhatsApp) and machine-translates free text.</p>
      </main>
    </div>
  )
}
