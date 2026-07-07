import { useState } from 'react'
import { useLang } from '../i18n'
import { community, useCommunity } from '../lib/community'
import { communityStrings, type CommunityStrings } from '../lib/communityI18n'
import { IconUsers } from './icons'

/** Localized "N ago" from a timestamp. */
function relativeTime(at: number, s: CommunityStrings): string {
  const mins = Math.floor((Date.now() - at) / 60000)
  if (mins < 1) return s.now
  if (mins < 60) return s.minsAgo.replace('{n}', String(mins))
  const hours = Math.floor(mins / 60)
  if (hours < 24) return s.hoursAgo.replace('{n}', String(hours))
  return s.daysAgo.replace('{n}', String(Math.floor(hours / 24)))
}

/** Simple monogram avatar from the author's first letter. */
function Avatar({ name }: { name: string }) {
  const ch = (name.trim()[0] ?? '?').toUpperCase()
  return <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">{ch}</span>
}

/**
 * Per-hotel community thread. Anyone can post a question or insight — no login
 * required. Mock storage (this browser's localStorage) via the community store.
 */
export function HotelCommunity({ slug }: { slug: string }) {
  const { lang } = useLang()
  const s = communityStrings[lang]
  const posts = useCommunity(slug)
  const [name, setName] = useState('')
  const [body, setBody] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!body.trim()) return
    community.add(slug, name.trim() || s.anon, body)
    setBody('')
  }

  return (
    <div className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-black/5 sm:p-6">
      <div className="flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-50 text-brand-700"><IconUsers className="h-5 w-5" /></span>
        <h2 className="text-lg font-bold text-ink-900">{s.title}</h2>
        <span className="ml-auto text-xs font-semibold text-ink-600/60">{s.count.replace('{n}', String(posts.length))}</span>
      </div>
      <p className="mt-1 text-sm text-ink-700/70">{s.subtitle}</p>

      <form onSubmit={submit} className="mt-4 rounded-xl bg-sand-50 p-3 ring-1 ring-black/5">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={s.namePh}
          className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={s.bodyPh}
          rows={3}
          className="mt-2 w-full resize-none rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
        />
        <div className="mt-2 flex items-center justify-between gap-2">
          <p className="text-[11px] text-ink-600/55">{s.demoNote}</p>
          <button
            type="submit"
            disabled={!body.trim()}
            className="shrink-0 rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-50"
          >
            {s.post}
          </button>
        </div>
      </form>

      {posts.length === 0 ? (
        <p className="mt-4 rounded-xl bg-sand-50 px-4 py-6 text-center text-sm text-ink-600/70">{s.empty}</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {posts.map((p) => (
            <li key={p.id} className="flex gap-3">
              <Avatar name={p.author} />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-semibold text-ink-900">{p.author}</span>
                  <span className="text-[11px] text-ink-600/55">{relativeTime(p.at, s)}</span>
                  <button
                    onClick={() => community.remove(slug, p.id)}
                    className="ml-auto text-[11px] text-ink-500/50 hover:text-rose-500"
                  >
                    {s.delete}
                  </button>
                </div>
                <p className="mt-0.5 whitespace-pre-wrap break-words text-sm text-ink-800">{p.body}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
