import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDocumentMeta } from '../lib/useDocumentMeta'

const CONTACT_EMAIL = (import.meta.env.VITE_CONTACT_EMAIL as string | undefined) ?? 'hello@stayeasy.asia'
const inputCls = 'w-full rounded-xl border border-black/10 bg-sand-50 px-3 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100'

export default function ContactPage() {
  useDocumentMeta('Contact — StayEasy', 'Get in touch with the StayEasy team — partnerships, content, or general questions.')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`StayEasy enquiry from ${name || 'a visitor'}`)}&body=${encodeURIComponent(`${message}\n\n— ${name} (${email})`)}`

  return (
    <div className="container-page max-w-3xl py-12">
      <nav className="mb-4 text-sm text-ink-700/60">
        <Link to="/" className="hover:text-brand-700">Home</Link> <span className="px-1">/</span> Contact
      </nav>
      <h1 className="text-3xl font-extrabold text-ink-900">Contact us</h1>
      <p className="mt-3 max-w-2xl text-ink-700/85">
        Questions, feedback, or a hotel partnership enquiry? We’d love to hear from you. Email us directly at{' '}
        <a className="font-semibold text-brand-700 underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>, or use the form below.
      </p>

      <div className="mt-8 grid gap-8 sm:grid-cols-[1fr_260px]">
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            window.location.href = mailto
          }}
        >
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-ink-600/70" htmlFor="c-name">Your name</label>
            <input id="c-name" value={name} onChange={(e) => setName(e.target.value)} required className={`mt-1 ${inputCls}`} />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-ink-600/70" htmlFor="c-email">Your email</label>
            <input id="c-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={`mt-1 ${inputCls}`} />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-ink-600/70" htmlFor="c-message">Message</label>
            <textarea id="c-message" value={message} onChange={(e) => setMessage(e.target.value)} rows={5} required className={`mt-1 ${inputCls}`} />
          </div>
          <button type="submit" className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700">
            Send email
          </button>
          <p className="text-xs text-ink-600/60">This opens your email app with the message ready to send.</p>
        </form>

        <aside className="space-y-4">
          <div className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-black/5">
            <p className="text-sm font-bold text-ink-900">For hotels</p>
            <p className="mt-1 text-sm text-ink-700/80">Want to be listed and promote your official-website benefits?</p>
            <Link to="/partners" className="mt-3 inline-block text-sm font-semibold text-brand-700 hover:underline">Partner with StayEasy →</Link>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-black/5">
            <p className="text-sm font-bold text-ink-900">Email</p>
            <a className="mt-1 block text-sm text-brand-700 underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </div>
        </aside>
      </div>
    </div>
  )
}
