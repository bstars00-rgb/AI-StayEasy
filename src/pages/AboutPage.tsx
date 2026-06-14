import { Link } from 'react-router-dom'
import Button from '../components/Button'
import { SectionHeading } from '../components/SectionHeading'

export default function AboutPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-ink-900 to-brand-800 py-14 text-white">
        <div className="container-page">
          <nav className="mb-3 text-sm text-white/60">
            <Link to="/" className="hover:text-white">Home</Link> <span className="px-1">/</span> About
          </nav>
          <h1 className="max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl">About StayEasy Vietnam</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/85">
            StayEasy helps travelers choose better hotels and book directly with hotels — through clear content,
            official booking benefits, and practical travel guidance.
          </p>
        </div>
      </section>

      <section className="container-page mt-12">
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-3xl bg-white p-8 shadow-card ring-1 ring-black/5">
            <h2 className="text-2xl font-extrabold text-ink-900">Our position</h2>
            <p className="mt-3 text-sm text-ink-700/80">
              We are not an OTA. We do not process bookings or take payment, and we never charge hotels a booking
              commission. We help travelers understand hotels better, then send them to the hotel’s official website
              to book directly.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-ink-700/90">
              {['We do not process bookings', 'We help travelers understand hotels better', 'Final booking is made directly with the hotel', 'Hotels promote official benefits, commission-free'].map((x) => (
                <li key={x} className="flex gap-2"><span className="text-brand-600">✓</span> {x}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl bg-white p-8 shadow-card ring-1 ring-black/5">
            <h2 className="text-2xl font-extrabold text-ink-900">How we make money</h2>
            <p className="mt-3 text-sm text-ink-700/80">Our revenue comes from advertising, content, and exposure — never commission:</p>
            <ul className="mt-4 space-y-2 text-sm text-ink-700/90">
              {['Free hotel listing', 'Paid official booking guide pages', 'Premium content production', 'Featured hotel placement', 'Official-booking click advertising (CPC)', 'Seasonal campaign advertising'].map((x) => (
                <li key={x} className="flex gap-2"><span className="text-brand-600">•</span> {x}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="container-page my-16">
        <SectionHeading eyebrow="Roadmap" title="Where we’re going" align="center" />
        <div className="rounded-3xl bg-ink-900 p-8 text-center text-white sm:p-12">
          <p className="mx-auto max-w-xl text-white/85">
            We’re launching in Da Nang, then expanding to Ho Chi Minh City, Nha Trang, and Phu Quoc — one trusted,
            direct-booking city at a time.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button to="/destinations/da-nang" variant="primary" size="lg">Explore Da Nang hotels</Button>
            <Button to="/partners" variant="white" size="lg">Partner with StayEasy</Button>
          </div>
        </div>
      </section>
    </>
  )
}
