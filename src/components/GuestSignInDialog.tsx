import { useState } from 'react'
import { useLang } from '../i18n'
import { accountStrings } from '../lib/accountI18n'
import { guestAuth } from '../lib/guestAuth'
import { promptGoogle, googleEnabled } from '../lib/googleAuth'

const inputCls = 'w-full rounded-xl border border-black/10 bg-sand-50 px-3 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100'

function GoogleG() {
  return (
    <svg viewBox="0 0 48 48" width="18" height="18" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8a12 12 0 1 1 0-24c3.1 0 5.9 1.2 8 3.1l5.7-5.7A20 20 0 1 0 24 44c11 0 20-8 20-20 0-1.3-.1-2.3-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8A12 12 0 0 1 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7A20 20 0 0 0 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2A12 12 0 0 1 12.7 28l-6.6 5.1A20 20 0 0 0 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3a12 12 0 0 1-4.1 5.6l6.2 5.2C39.8 36 44 30.6 44 24c0-1.3-.1-2.3-.4-3.5z" />
    </svg>
  )
}

export function GuestSignInDialog({ onClose, onSignedIn }: { onClose: () => void; onSignedIn?: () => void }) {
  const { lang } = useLang()
  const s = accountStrings[lang]
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const finish = (input: { email: string; name?: string; picture?: string }) => {
    guestAuth.signIn(input)
    onSignedIn?.()
    onClose()
  }

  const withGoogle = () => {
    // Real Google sign-in when configured; otherwise demo with the email field.
    if (googleEnabled && promptGoogle((p) => finish(p))) return
    if (!email.trim()) return setError('Enter your email to continue (demo).')
    finish({ email })
  }

  const withEmail = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !email.includes('@')) return setError('Enter a valid email.')
    finish({ email })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-t-3xl bg-white p-7 shadow-card sm:rounded-3xl">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-ink-900">{s.title}</h2>
            <p className="mt-0.5 text-sm text-ink-700/70">🎟️ {s.subtitle}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="grid h-8 w-8 place-items-center rounded-lg text-ink-600 hover:bg-sand-100">✕</button>
        </div>

        <button
          type="button"
          onClick={withGoogle}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-black/15 bg-white px-4 py-3 text-sm font-semibold text-ink-800 hover:bg-sand-50"
        >
          <GoogleG /> {s.google}
        </button>

        <div className="my-4 flex items-center gap-3 text-xs text-ink-600/50">
          <span className="h-px flex-1 bg-black/10" /> or <span className="h-px flex-1 bg-black/10" />
        </div>

        <form onSubmit={withEmail} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError('') }}
            placeholder={s.emailPh}
            className={inputCls}
          />
          {error && <p className="text-xs text-rose-600">{error}</p>}
          <button type="submit" className="w-full rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-700">{s.emailBtn}</button>
        </form>

        <p className="mt-3 text-center text-xs text-ink-600/55">🧪 {s.demoNote}</p>
      </div>
    </div>
  )
}
