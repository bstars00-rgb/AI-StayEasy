import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/Button'
import { SectionHeading } from '../components/SectionHeading'

const products = [
  { icon: '🆓', name: 'Free Basic Listing', desc: 'A verified hotel profile with your official website link and key info. No cost to start.', tag: 'Free' },
  { icon: '📄', name: 'Official Booking Guide Page', desc: 'A dedicated, localized guide page that turns lookers into direct bookers.', tag: 'Paid' },
  { icon: '✨', name: 'Premium Content Package', desc: 'Professional photos, video, and written guides in Korean and English.', tag: 'Content' },
  { icon: '⭐', name: 'Featured Hotel Placement', desc: 'Top, labeled “Sponsored” placement on city and destination pages.', tag: 'Exposure' },
  { icon: '📰', name: 'Sponsored Destination Article', desc: 'Seasonal campaign articles that feature your hotel in travel content.', tag: 'Campaign' },
  { icon: '🖱️', name: 'CPC Official Website Click Package', desc: 'Pay only for measured clicks through to your official booking page.', tag: 'Performance' },
]

const reportMetrics = [
  { label: 'Page views', value: '18,420' },
  { label: 'Official website clicks', value: '3,160' },
  { label: 'Click-through rate', value: '17.2%' },
  { label: 'Top source market', value: '🇰🇷 Korea' },
  { label: 'Top traveler type', value: 'Family' },
]

const plans = [
  { name: 'Starter', sub: 'Get discovered', features: ['Free Basic Listing', 'Official website CTA', 'Basic monthly stats'] },
  { name: 'Growth', sub: 'Convert more direct bookings', features: ['Official Booking Guide Page', 'Premium content (KR + EN)', 'Featured placement slots', 'Click & traffic report'], highlight: true },
  { name: 'Campaign', sub: 'Seasonal & performance push', features: ['Sponsored destination articles', 'CPC official-click package', 'Seasonal campaign management', 'Dedicated partner manager'] },
]

export default function PartnerPage() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <>
      {/* 1. Hero */}
      <section className="bg-gradient-to-br from-ink-900 via-ink-800 to-brand-800 py-16 text-white">
        <div className="container-page">
          <nav className="mb-3 text-sm text-white/60">
            <Link to="/" className="hover:text-white">Home</Link> <span className="px-1">/</span> Partners
          </nav>
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <span className="pill bg-brand-500/25 text-brand-100 ring-1 ring-brand-400/30">Hotel partner program</span>
              <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">Grow your direct booking traffic in Vietnam</h1>
              <p className="mt-4 max-w-xl text-lg text-white/85">
                Promote your official hotel benefits through trusted content, destination guides, and sponsored
                placements — without paying booking commission.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button href="#contact" variant="primary" size="lg">List your hotel on StayEasy</Button>
                <Button to="/dashboard" variant="white" size="lg">Preview the dashboard</Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { k: '0%', v: 'Booking commission' },
                { k: '100%', v: 'Of your booking revenue' },
                { k: 'Ads + content', v: 'Not commission' },
                { k: 'KR + EN', v: 'Localized traveler reach' },
              ].map((s) => (
                <div key={s.v} className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/15 backdrop-blur">
                  <div className="text-3xl font-extrabold text-brand-100">{s.k}</div>
                  <div className="mt-1 text-sm text-white/75">{s.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Why hotels need StayEasy */}
      <section className="container-page mt-14">
        <SectionHeading eyebrow="Why StayEasy" title="Why hotels need StayEasy" align="center" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: '💸', t: 'OTA commission is expensive', d: 'Keep your margin — pay for advertising and content, not a cut of every stay.' },
            { icon: '📚', t: 'Travelers need trustworthy content', d: 'Guests still want clear, honest hotel information before they book.' },
            { icon: '🌐', t: 'Official sites lack localized content', d: 'Many hotel websites have little Korean or English traveler-facing content.' },
            { icon: '🏷️', t: 'Communicate official benefits clearly', d: 'We surface your direct-booking perks where travelers are deciding.' },
          ].map((c) => (
            <div key={c.t} className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-black/5">
              <div className="text-2xl">{c.icon}</div>
              <h3 className="mt-2 font-bold text-ink-900">{c.t}</h3>
              <p className="mt-1.5 text-sm text-ink-700/80">{c.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Products */}
      <section className="container-page mt-16">
        <SectionHeading eyebrow="Products" title="Advertising & content — not commission" subtitle="Our revenue comes from listings, content, exposure, and clicks. Never from your bookings." />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <div key={p.name} className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-black/5">
              <div className="flex items-center justify-between">
                <span className="text-2xl">{p.icon}</span>
                <span className="pill bg-brand-50 text-brand-700">{p.tag}</span>
              </div>
              <h3 className="mt-3 font-bold text-ink-900">{p.name}</h3>
              <p className="mt-1.5 text-sm text-ink-700/80">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. What hotels get */}
      <section className="container-page mt-16">
        <div className="rounded-3xl bg-white p-8 shadow-card ring-1 ring-black/5 sm:p-10">
          <SectionHeading eyebrow="Included" title="What hotels get" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {['Hotel profile page', 'Official website CTA', 'Multi-language content', 'Traveler-style positioning', 'Campaign exposure', 'Click and traffic report'].map((x) => (
              <div key={x} className="flex items-center gap-2.5 rounded-xl bg-sand-50 px-4 py-3 ring-1 ring-black/5">
                <span className="text-brand-600">✓</span> <span className="text-sm font-medium text-ink-800">{x}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Example report preview */}
      <section className="container-page mt-16">
        <SectionHeading eyebrow="Reporting" title="Example performance report" subtitle="Every partner sees how their listing and campaigns perform. (Sample data.)" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {reportMetrics.map((m) => (
            <div key={m.label} className="rounded-2xl bg-white p-5 text-center shadow-card ring-1 ring-black/5">
              <div className="text-2xl font-extrabold text-ink-900">{m.value}</div>
              <div className="mt-1 text-xs text-ink-700/70">{m.label}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Link to="/dashboard" className="text-sm font-semibold text-brand-700 hover:underline">See the full sample dashboard →</Link>
        </div>
      </section>

      {/* 6. Pricing placeholder */}
      <section className="container-page mt-16">
        <SectionHeading eyebrow="Plans" title="Simple, commission-free plans" align="center" />
        <div className="grid gap-5 lg:grid-cols-3">
          {plans.map((p) => (
            <div key={p.name} className={`relative rounded-3xl p-6 ring-1 ${p.highlight ? 'bg-ink-900 text-white ring-ink-900 shadow-card-hover' : 'bg-white text-ink-900 ring-black/5 shadow-card'}`}>
              {p.highlight && <span className="absolute -top-3 left-6 pill bg-brand-500 text-white">★ Most popular</span>}
              <h3 className="text-lg font-bold">{p.name}</h3>
              <p className={`mt-1 text-sm ${p.highlight ? 'text-white/70' : 'text-ink-700/70'}`}>{p.sub}</p>
              <ul className="mt-4 space-y-2 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="text-brand-500">✓</span>
                    <span className={p.highlight ? 'text-white/85' : 'text-ink-700/85'}>{f}</span>
                  </li>
                ))}
              </ul>
              <a href="#contact" className={`mt-6 block rounded-full px-5 py-2.5 text-center text-sm font-semibold ${p.highlight ? 'bg-brand-500 text-white hover:bg-brand-400' : 'bg-brand-600 text-white hover:bg-brand-700'}`}>
                Contact us
              </a>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-ink-700/60">Pricing is tailored per hotel and city. Contact us for a quote.</p>
      </section>

      {/* 7. Contact form */}
      <section id="contact" className="container-page my-16">
        <div className="overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-black/5">
          <div className="grid lg:grid-cols-2">
            <div className="bg-gradient-to-br from-brand-600 to-brand-800 p-8 text-white sm:p-10">
              <h2 className="text-2xl font-extrabold">List your hotel on StayEasy</h2>
              <p className="mt-3 text-white/85">Tell us about your hotel and we’ll set up your verified listing. A partner manager replies within two business days.</p>
              <ul className="mt-6 space-y-3 text-sm text-white/85">
                <li className="flex gap-2">✓ Free verified listing to start</li>
                <li className="flex gap-2">✓ No booking commission, ever</li>
                <li className="flex gap-2">✓ Korean &amp; English support</li>
              </ul>
            </div>
            <form
              className="p-8 sm:p-10"
              onSubmit={(e) => {
                e.preventDefault()
                setSubmitted(true)
              }}
            >
              {submitted ? (
                <div className="grid h-full place-items-center text-center">
                  <div>
                    <div className="text-4xl">🎉</div>
                    <h3 className="mt-2 text-xl font-bold text-ink-900">Thanks — request received!</h3>
                    <p className="mt-1 text-sm text-ink-700/70">This is a prototype, so nothing was actually sent. A real submission would reach our partnerships team.</p>
                    <button onClick={() => setSubmitted(false)} className="mt-4 text-sm font-semibold text-brand-700 hover:underline">Submit another</button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {[
                    { id: 'hotel', label: 'Hotel name', type: 'text', ph: 'e.g. An Bang Beach Resort' },
                    { id: 'city', label: 'City', type: 'text', ph: 'Da Nang' },
                    { id: 'person', label: 'Contact person', type: 'text', ph: 'Your name' },
                    { id: 'email', label: 'Email', type: 'email', ph: 'you@hotel.com' },
                    { id: 'website', label: 'Official website', type: 'url', ph: 'https://your-hotel.com' },
                  ].map((f) => (
                    <div key={f.id}>
                      <label htmlFor={f.id} className="text-sm font-medium text-ink-800">{f.label}</label>
                      <input id={f.id} type={f.type} required placeholder={f.ph} className="mt-1 w-full rounded-xl border border-black/10 bg-sand-50 px-3 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100" />
                    </div>
                  ))}
                  <div>
                    <label htmlFor="message" className="text-sm font-medium text-ink-800">Message</label>
                    <textarea id="message" rows={3} placeholder="Tell us what you’re looking for…" className="mt-1 w-full rounded-xl border border-black/10 bg-sand-50 px-3 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100" />
                  </div>
                  <button type="submit" className="w-full rounded-full bg-brand-600 px-5 py-3 text-sm font-bold text-white hover:bg-brand-700">List your hotel on StayEasy</button>
                  <p className="text-center text-xs text-ink-700/50">Prototype form — no data is stored or sent.</p>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
