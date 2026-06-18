import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../i18n'
import { accountStrings } from '../lib/accountI18n'
import { guestAuth, useGuest } from '../lib/guestAuth'
import { useDocumentMeta } from '../lib/useDocumentMeta'

export default function AccountPage() {
  const { lang } = useLang()
  const s = accountStrings[lang]
  useDocumentMeta('My account — StayEasy', 'Your StayEasy member account and voucher.')
  const guest = useGuest()
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    if (!guest) return
    try { await navigator.clipboard.writeText(guest.welcomeCode) } catch { /* blocked */ }
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div className="container-page max-w-xl py-12">
      <nav className="mb-4 text-sm text-ink-700/60">
        <Link to="/" className="hover:text-brand-700">Home</Link> <span className="px-1">/</span> {s.accountTitle}
      </nav>

      {!guest ? (
        <div className="rounded-3xl bg-gradient-to-br from-brand-50 to-sand-50 p-8 ring-1 ring-brand-100">
          <div className="text-4xl">🎟️</div>
          <h1 className="mt-3 text-2xl font-extrabold text-ink-900">{s.perkTitle}</h1>
          <p className="mt-2 text-ink-700/80">{s.perkText}</p>
          <Link to="/signin?next=/account" className="mt-5 inline-block rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700">{s.signIn}</Link>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3">
            {guest.picture ? (
              <img src={guest.picture} alt="" className="h-12 w-12 rounded-full" />
            ) : (
              <span className="grid h-12 w-12 place-items-center rounded-full bg-brand-600 text-lg font-bold text-white">{guest.name.charAt(0).toUpperCase()}</span>
            )}
            <div>
              <p className="font-extrabold text-ink-900">{guest.name} <span className="ml-1 rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700">{s.member}</span></p>
              <p className="text-sm text-ink-600/70">{s.signedInAs} {guest.email}</p>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-brand-200">
            <div className="bg-gradient-to-br from-brand-600 to-brand-700 px-6 py-4 text-white">
              <p className="flex items-center gap-2 text-base font-bold">🎟️ {s.welcomeTitle}</p>
              <p className="mt-0.5 text-sm text-white/85">{s.welcomeText}</p>
            </div>
            <div className="space-y-4 p-6">
              <p className="text-lg font-extrabold text-brand-700">{guest.discountLabel}</p>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-700/50">{s.voucherLabel}</p>
                <div className="mt-1 flex items-stretch gap-2">
                  <code className="flex-1 rounded-xl bg-brand-50 px-4 py-3 text-center font-mono text-xl font-extrabold tracking-[0.2em] text-brand-700 ring-1 ring-brand-200">{guest.welcomeCode}</code>
                  <button onClick={copy} className="shrink-0 rounded-xl bg-ink-900 px-4 text-sm font-semibold text-white hover:bg-ink-800">{copied ? `✓ ${s.copied}` : s.copy}</button>
                </div>
              </div>
              <p className="text-sm text-ink-700/70">{s.validUntil}: <b>{guest.validUntil}</b></p>
              <p className="text-xs text-ink-700/55">{s.useNote}</p>
            </div>
          </div>

          <div className="mt-6 flex justify-between">
            <Link to="/destinations/da-nang" className="text-sm font-semibold text-brand-700 hover:underline">Browse hotels →</Link>
            <button onClick={() => guestAuth.signOut()} className="text-sm font-semibold text-ink-700/70 hover:text-ink-900">{s.signOut}</button>
          </div>
        </>
      )}
    </div>
  )
}
