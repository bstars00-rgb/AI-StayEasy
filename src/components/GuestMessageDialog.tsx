import { useState } from 'react'
import { useLang } from '../i18n'
import type { Lang } from '../i18n'
import { conciergeStrings, REQUEST_KEYS } from '../lib/conciergeI18n'
import type { RequestKey } from '../lib/conciergeI18n'
import { concierge, useHotelThreads } from '../lib/messages'
import type { ConciergeThread } from '../lib/messages'
import { translatePhrase } from '../lib/translate'

const LANG_NAMES: Record<Lang, string> = { en: 'English', ko: '한국어', vi: 'Tiếng Việt', zh: '中文', ja: '日本語' }
const inputCls = 'w-full rounded-xl border border-black/10 bg-sand-50 px-3 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100'

function Shell({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-6 shadow-card sm:rounded-3xl">
        {children}
      </div>
    </div>
  )
}

/** Conversation view — shown once the guest has an open thread for this hotel. */
function ThreadView({ thread, hotelName, onClose }: { thread: ConciergeThread; hotelName: string; onClose: () => void }) {
  const gl = thread.guestLang
  const s = conciergeStrings[gl]
  const [reply, setReply] = useState('')

  const send = (e: React.FormEvent) => {
    e.preventDefault()
    if (!reply.trim()) return
    concierge.addMessage(thread.id, 'guest', reply.trim(), gl, new Date().toISOString())
    setReply('')
  }

  return (
    <Shell onClose={onClose}>
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-ink-900">{s.guestTitle}</h2>
          <p className="text-xs text-ink-600/60">{hotelName}</p>
        </div>
        <button type="button" onClick={onClose} aria-label={s.close} className="grid h-8 w-8 place-items-center rounded-lg text-ink-600 hover:bg-sand-100">✕</button>
      </div>

      {thread.requests.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {thread.requests.map((k) => <span key={k} className="pill bg-sand-100 text-ink-800">{s.request[k]}</span>)}
        </div>
      )}

      <div className="mt-4 space-y-2">
        {thread.messages.map((m) => {
          const tr = m.from === 'hotel' ? translatePhrase(m.text, m.lang, gl) : { text: m.text, translated: false }
          return (
            <div key={m.id} className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${m.from === 'guest' ? 'ml-auto bg-brand-600 text-white' : 'bg-sand-50 text-ink-800 ring-1 ring-black/5'}`}>
              {tr.text}
              {m.from === 'hotel' && tr.translated && <span className="mt-0.5 block text-[11px] text-ink-600/50">🌐 {s.translated} · {LANG_NAMES[m.lang]}</span>}
            </div>
          )
        })}
        {thread.messages.filter((m) => m.from === 'hotel').length === 0 && (
          <p className="rounded-xl bg-sand-50 px-3 py-2 text-sm text-ink-600/70 ring-1 ring-black/5">{s.sentText}</p>
        )}
      </div>

      <form onSubmit={send} className="mt-4 flex gap-2">
        <input value={reply} onChange={(e) => setReply(e.target.value)} placeholder={s.notePh} className={inputCls} />
        <button type="submit" className="shrink-0 rounded-xl bg-ink-900 px-4 text-sm font-semibold text-white hover:bg-ink-800">{s.send}</button>
      </form>
    </Shell>
  )
}

export function GuestMessageDialog({ hotelSlug, hotelName, onClose }: { hotelSlug: string; hotelName: string; onClose: () => void }) {
  const { lang } = useLang()
  const threads = useHotelThreads(hotelSlug)
  const existing = threads[0]

  const [glang, setGlang] = useState<Lang>(lang)
  const s = conciergeStrings[glang]
  const [name, setName] = useState('')
  const [ref, setRef] = useState('')
  const [picked, setPicked] = useState<RequestKey[]>([])
  const [note, setNote] = useState('')

  if (existing) return <ThreadView thread={existing} hotelName={hotelName} onClose={onClose} />

  const toggle = (k: RequestKey) => setPicked((p) => (p.includes(k) ? p.filter((x) => x !== k) : [...p, k]))

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!picked.length && !note.trim()) return
    concierge.open({ hotelSlug, guestName: name, bookingRef: ref, guestLang: glang, requests: picked, note, createdAt: new Date().toISOString() })
    // useHotelThreads re-renders into the ThreadView automatically.
  }

  return (
    <Shell onClose={onClose}>
      <form onSubmit={submit}>
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-ink-900">{s.guestTitle}</h2>
            <p className="text-sm text-ink-700/70">🌐 {s.guestSubtitle}</p>
            <p className="mt-1 text-xs text-ink-600/60">{hotelName}</p>
          </div>
          <button type="button" onClick={onClose} aria-label={s.close} className="grid h-8 w-8 place-items-center rounded-lg text-ink-600 hover:bg-sand-100">✕</button>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-ink-600/70">{s.name}</span>
            <input value={name} onChange={(e) => setName(e.target.value)} className={`mt-1 ${inputCls}`} />
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-ink-600/70">{s.language}</span>
            <select value={glang} onChange={(e) => setGlang(e.target.value as Lang)} className={`mt-1 ${inputCls}`}>
              {(Object.keys(LANG_NAMES) as Lang[]).map((l) => <option key={l} value={l}>{LANG_NAMES[l]}</option>)}
            </select>
          </label>
        </div>
        <label className="mt-3 block">
          <span className="text-xs font-semibold uppercase tracking-wide text-ink-600/70">{s.bookingRef}</span>
          <input value={ref} onChange={(e) => setRef(e.target.value)} placeholder={s.bookingRefPh} className={`mt-1 ${inputCls}`} />
        </label>

        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-600/70">{s.requestsLabel}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {REQUEST_KEYS.map((k) => (
              <button type="button" key={k} onClick={() => toggle(k)} className={`pill border ${picked.includes(k) ? 'border-brand-600 bg-brand-600 text-white' : 'border-black/10 bg-white text-ink-700 hover:bg-sand-50'}`}>
                {s.request[k]}
              </button>
            ))}
          </div>
        </div>

        <label className="mt-4 block">
          <span className="text-xs font-semibold uppercase tracking-wide text-ink-600/70">{s.noteLabel}</span>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder={s.notePh} className={`mt-1 ${inputCls}`} />
        </label>

        <button type="submit" className="mt-5 w-full rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-700">{s.send} →</button>
        <p className="mt-2 text-center text-xs text-ink-600/55">🧪 Demo — saved in your browser; the hotel sees it in their language.</p>
      </form>
    </Shell>
  )
}
