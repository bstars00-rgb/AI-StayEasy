import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { hotels } from '../data/hotels'
import { Logo } from '../components/Logo'
import { partnerAuth } from '../lib/partnerAuth'
import { useDocumentMeta } from '../lib/useDocumentMeta'

const cleanName = (n: string) => n.replace(' (Sample)', '')
const inputCls = 'w-full rounded-xl border border-black/10 bg-sand-50 px-3 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100'

export default function PartnerLoginPage() {
  useDocumentMeta('Hotel login — StayEasy partners', 'Sign in to manage your StayEasy listing.')
  const navigate = useNavigate()
  const [slug, setSlug] = useState(hotels[0]?.slug ?? '')
  const [email, setEmail] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const hotel = hotels.find((h) => h.slug === slug)
    if (!hotel) return
    partnerAuth.login({ slug, propertyName: cleanName(hotel.name), email: email.trim() })
    navigate('/partner')
  }

  return (
    <div className="grid min-h-screen place-items-center bg-sand-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center"><Logo size={40} /></div>
        <form onSubmit={submit} className="rounded-3xl bg-white p-7 shadow-card ring-1 ring-black/5">
          <h1 className="text-xl font-extrabold text-ink-900">Partner sign in</h1>
          <p className="mt-1 text-sm text-ink-700/70">Manage your hotel’s listing, official benefits, and content on StayEasy.</p>

          <div className="mt-5 space-y-4">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-ink-600/70">Your property</span>
              <select value={slug} onChange={(e) => setSlug(e.target.value)} className={`mt-1 ${inputCls}`}>
                {hotels.map((h) => (
                  <option key={h.slug} value={h.slug}>{cleanName(h.name)} — {h.city}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-ink-600/70">Work email</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="manager@hotel.example" className={`mt-1 ${inputCls}`} />
            </label>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-ink-600/70">Access code</span>
              <input type="password" placeholder="demo — any code works" className={`mt-1 ${inputCls}`} />
            </label>
          </div>

          <button type="submit" className="mt-6 w-full rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-700">
            Sign in to your listing
          </button>
          <p className="mt-3 text-center text-xs text-ink-600/60">🧪 Demo sign-in — real partner accounts arrive with the backend.</p>
        </form>

        <div className="mt-4 flex justify-between text-sm">
          <Link to="/" className="text-ink-700/70 hover:text-ink-900">← Back to site</Link>
          <Link to="/partners" className="text-brand-700 hover:underline">Not a partner yet?</Link>
        </div>
      </div>
    </div>
  )
}
