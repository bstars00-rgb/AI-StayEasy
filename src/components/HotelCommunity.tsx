import { useState } from 'react'
import { useLang } from '../i18n'
import { community, useCommunity } from '../lib/community'
import { communityStrings, type CommunityStrings } from '../lib/communityI18n'
import { accountStrings } from '../lib/accountI18n'
import { guestAuth, useGuest } from '../lib/guestAuth'
import { promptGoogle, googleEnabled } from '../lib/googleAuth'
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
 * Per-hotel community thread. READING is open to everyone (an always-locked
 * box would be a dead end for new visitors); POSTING requires signing in —
 * the composer doubles as the account-creation gate. Ownership for delete is
 * the account email, not the display name. Mock auth + storage (localStorage).
 */
export function HotelCommunity({ slug }: { slug: string }) {
  const { lang } = useLang()
  const s = communityStrings[lang]
  const as = accountStrings[lang]
  const guest = useGuest()
  const posts = useCommunity(slug)
  const [email, setEmail] = useState('')
  const [body, setBody] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!guest || !body.trim()) return
    community.add(slug, guest.name, body, guest.email)
    setBody('')
  }

  const signInEmail = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.includes('@')) return
    guestAuth.signIn({ email: email.trim() })
    setEmail('')
  }

  return (
    <div className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-black/5 sm:p-6">
      <div className="flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-50 text-brand-700"><IconUsers className="h-5 w-5" /></span>
        <h2 className="text-lg font-bold text-ink-900">{s.title}</h2>
        <span className="ml-auto text-xs font-semibold text-ink-600/60">{s.count.replace('{n}', String(posts.length))}</span>
      </div>
      <p className="mt-1 text-sm text-ink-700/70">{s.subtitle}</p>

      {/* Composer — or the sign-in gate when signed out (reading stays open). */}
      {guest ? (
        <form onSubmit={submit} className="mt-4 rounded-xl bg-sand-50 p-3 ring-1 ring-black/5">
          <div className="flex items-center gap-2 px-1 pb-2 text-xs text-ink-700/70">
            <Avatar name={guest.name} />
            <span>{s.participatingAs.replace('{name}', guest.name)}</span>
            <button type="button" onClick={() => guestAuth.signOut()} className="ml-auto text-ink-500/60 hover:text-ink-800">{as.signOut}</button>
          </div>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={s.bodyPh}
            rows={3}
            className="w-full resize-none rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
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
      ) : (
        <div className="mt-4 rounded-xl bg-gradient-to-br from-brand-50 to-sand-50 p-4 ring-1 ring-brand-100">
          <p className="text-sm font-semibold text-ink-900">🔒 {s.gateTitle}</p>
          <p className="mt-0.5 text-sm text-ink-700/75">{s.createHint}</p>
          <form onSubmit={signInEmail} className="mt-3">
            {googleEnabled && (
              <>
                <button
                  type="button"
                  onClick={() => promptGoogle((p) => guestAuth.signIn(p))}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-black/15 bg-white px-4 py-2.5 text-sm font-semibold text-ink-800 hover:bg-sand-100"
                >
                  {as.google}
                </button>
                <div className="my-3 flex items-center gap-3 text-[11px] text-ink-600/50">
                  <span className="h-px flex-1 bg-black/10" /> or <span className="h-px flex-1 bg-black/10" />
                </div>
              </>
            )}
            <div className="flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={as.emailPh}
                className="min-w-0 flex-1 rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
              />
              <button type="submit" className="shrink-0 rounded-full bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700">
                {s.join}
              </button>
            </div>
          </form>
          <p className="mt-2 text-[11px] text-ink-600/50">{as.demoNote}</p>
        </div>
      )}

      {/* Posts — readable by everyone. */}
      {posts.length === 0 ? (
        <p className="mt-4 rounded-xl bg-sand-50 px-4 py-6 text-center text-sm text-ink-600/70">{s.empty}</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {posts.map((p) => {
            const displayName = p.author.trim() || s.anon
            return (
              <li key={p.id} className="flex gap-3">
                <Avatar name={displayName} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-ink-900">{displayName}</span>
                    <span className="text-[11px] text-ink-600/55">{relativeTime(p.at, s)}</span>
                    {guest && p.authorEmail && p.authorEmail === guest.email && (
                      <button
                        onClick={() => community.remove(slug, p.id)}
                        className="ml-auto text-[11px] text-ink-500/50 hover:text-rose-500"
                      >
                        {s.delete}
                      </button>
                    )}
                  </div>
                  <p className="mt-0.5 whitespace-pre-wrap break-words text-sm text-ink-800">{p.body}</p>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
