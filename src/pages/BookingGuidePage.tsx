import { Link } from 'react-router-dom'
import Button from '../components/Button'
import { SectionHeading } from '../components/SectionHeading'

const comparison: { factor: string; direct: string; ota: string }[] = [
  { factor: 'Price', direct: 'Often matched or lower; best-rate guarantees common', ota: 'Easy to compare many hotels at once; occasional flash deals' },
  { factor: 'Cancellation policy', direct: 'Set by the hotel; can be flexible if you ask', ota: 'Standardized in-app; quick to cancel' },
  { factor: 'Loyalty benefits', direct: 'Hotel loyalty points, member rates, perks', ota: 'OTA-wide points across many hotels' },
  { factor: 'Special requests', direct: 'Handled directly with the hotel, first-hand', ota: 'Passed along; sometimes lost in translation' },
  { factor: 'Customer support', direct: 'One party — the hotel', ota: 'OTA support, plus the hotel for on-site issues' },
  { factor: 'Payment options', direct: 'Hotel’s options; sometimes pay at hotel', ota: 'Unified checkout; app wallets and instalments' },
  { factor: 'Room upgrade possibility', direct: 'Higher — hotels favor direct guests', ota: 'Lower — hotel can’t always tell you apart' },
]

export default function BookingGuidePage() {
  return (
    <>
      {/* 1. Hero */}
      <section className="bg-gradient-to-br from-brand-700 to-ink-900 py-14 text-white">
        <div className="container-page">
          <nav className="mb-3 text-sm text-white/60">
            <Link to="/" className="hover:text-white">Home</Link> <span className="px-1">/</span> Guides / Direct booking
          </nav>
          <span className="pill bg-white/15 text-white ring-1 ring-white/25">Neutral & practical</span>
          <h1 className="mt-4 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl">Should you book directly with the hotel?</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/85">
            Direct booking can offer better communication and official benefits, but you should always check price,
            cancellation, and payment terms.
          </p>
        </div>
      </section>

      {/* 2. Comparison table */}
      <section className="container-page mt-12">
        <SectionHeading eyebrow="Side by side" title="OTA vs direct booking" subtitle="OTAs are convenient. Direct booking has its own strengths. Here’s an honest comparison." />
        <div className="overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-black/5">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-black/5 bg-sand-50">
                <th className="p-4 font-bold text-ink-900">Factor</th>
                <th className="p-4 font-bold text-brand-700">Direct booking</th>
                <th className="p-4 font-bold text-ink-700">OTA</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((row, i) => (
                <tr key={row.factor} className={i % 2 ? 'bg-sand-50/40' : ''}>
                  <td className="p-4 font-semibold text-ink-900">{row.factor}</td>
                  <td className="p-4 text-ink-700/90">{row.direct}</td>
                  <td className="p-4 text-ink-700/80">{row.ota}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-ink-700/60">Neither is always better — the right choice depends on your trip.</p>
      </section>

      {/* 3 & 4. When each is better */}
      <section className="container-page mt-16">
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-3xl bg-brand-50 p-8 ring-1 ring-brand-100">
            <h2 className="text-2xl font-extrabold text-ink-900">When direct booking is better</h2>
            <ul className="mt-4 space-y-2 text-sm text-ink-700/90">
              {['Family trip with special requests', 'Honeymoon or anniversary', 'Long stay', 'You need an airport transfer', 'You need connecting rooms', 'You need early check-in or late checkout'].map((x) => (
                <li key={x} className="flex items-start gap-2"><span className="mt-0.5 text-brand-600">✓</span> {x}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl bg-white p-8 shadow-card ring-1 ring-black/5">
            <h2 className="text-2xl font-extrabold text-ink-900">When an OTA may still be better</h2>
            <ul className="mt-4 space-y-2 text-sm text-ink-700/90">
              {['You need easy price comparison', 'You want OTA loyalty points', 'You need flexible, app-based cancellation', 'You’re booking many hotels quickly'].map((x) => (
                <li key={x} className="flex items-start gap-2"><span className="mt-0.5 text-ink-700/50">•</span> {x}</li>
              ))}
            </ul>
            <p className="mt-4 rounded-xl bg-sand-50 px-4 py-3 text-xs text-ink-700/70 ring-1 ring-black/5">
              We don’t think OTAs are the enemy — they’re a useful tool. StayEasy just makes the direct option clearer.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Direct booking checklist */}
      <section className="container-page mt-16">
        <SectionHeading eyebrow="Before you book" title="Direct booking checklist" align="center" />
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow-card ring-1 ring-black/5">
          <ul className="space-y-2.5">
            {[
              'Is the final price clear?',
              'Are taxes included?',
              'Is breakfast included?',
              'What is the cancellation deadline?',
              'Is the payment refundable?',
              'Can the hotel confirm your request by email?',
              'Is the official website secure (https)?',
            ].map((c) => (
              <li key={c} className="flex items-start gap-3 rounded-xl bg-sand-50 px-4 py-3 ring-1 ring-black/5">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border-2 border-brand-300 text-xs text-brand-600">☑</span>
                <span className="text-sm text-ink-800">{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 6. CTA */}
      <section className="container-page my-16">
        <div className="rounded-3xl bg-ink-900 p-8 text-center text-white sm:p-12">
          <h2 className="text-2xl font-extrabold sm:text-3xl">Put it into practice</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/80">Explore Da Nang hotels with official booking benefits, each with a clear checklist before you book.</p>
          <div className="mt-6">
            <Button to="/destinations/da-nang" variant="primary" size="lg">Explore Da Nang hotels with official booking benefits</Button>
          </div>
        </div>
      </section>
    </>
  )
}
