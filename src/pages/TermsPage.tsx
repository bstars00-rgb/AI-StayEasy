import { Link } from 'react-router-dom'
import { useDocumentMeta } from '../lib/useDocumentMeta'

const updated = 'June 16, 2026'

export default function TermsPage() {
  useDocumentMeta('Terms of Use — StayEasy', 'The terms governing your use of the StayEasy website.')
  return (
    <div className="container-page max-w-3xl py-12">
      <nav className="mb-4 text-sm text-ink-700/60">
        <Link to="/" className="hover:text-brand-700">Home</Link> <span className="px-1">/</span> Terms of Use
      </nav>
      <h1 className="text-3xl font-extrabold text-ink-900">Terms of Use</h1>
      <p className="mt-2 text-sm text-ink-700/60">Last updated: {updated}</p>

      <div className="mt-6 space-y-6 text-ink-800">
        <section>
          <h2 className="text-xl font-bold text-ink-900">About StayEasy</h2>
          <p className="mt-2">
            StayEasy is an independent hotel-information and content service. We help travelers compare hotels and book
            directly on each hotel’s official website. We are not an online travel agency and do not process bookings,
            payments, or refunds.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink-900">No booking relationship</h2>
          <p className="mt-2">
            Any reservation you make is a contract between you and the hotel (or the site where you complete it). StayEasy
            is not a party to that contract. Always confirm the price, dates, inclusions, and cancellation policy on the
            hotel’s official website before you pay.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink-900">Accuracy of information</h2>
          <p className="mt-2">
            We work to keep our content accurate and useful, but details such as prices, availability, facilities, and
            policies change and can vary by date. Information on StayEasy is provided “as is” without warranty. The hotel’s
            official website is always the authoritative source.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink-900">Sponsored content &amp; advertising</h2>
          <p className="mt-2">
            Some placements are sponsored by hotels and are clearly labeled as such. The site may also display third-party
            advertising. Sponsored content and advertising do not change our editorial guidance, and we never take a
            commission on your booking.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink-900">Third-party links</h2>
          <p className="mt-2">
            We link to hotels’ official websites and other third-party sites. We are not responsible for the content,
            policies, or practices of those sites.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink-900">Contact</h2>
          <p className="mt-2">
            Questions about these terms? Visit our <Link to="/contact" className="text-brand-700 underline">Contact page</Link>.
          </p>
        </section>
      </div>
    </div>
  )
}
