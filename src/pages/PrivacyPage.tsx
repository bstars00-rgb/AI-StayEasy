import { Link } from 'react-router-dom'
import { useDocumentMeta } from '../lib/useDocumentMeta'

const updated = 'June 16, 2026'

export default function PrivacyPage() {
  useDocumentMeta('Privacy Policy — StayEasy', 'How StayEasy handles data, cookies, and third-party advertising.')
  return (
    <div className="container-page max-w-3xl py-12">
      <nav className="mb-4 text-sm text-ink-700/60">
        <Link to="/" className="hover:text-brand-700">Home</Link> <span className="px-1">/</span> Privacy Policy
      </nav>
      <h1 className="text-3xl font-extrabold text-ink-900">Privacy Policy</h1>
      <p className="mt-2 text-sm text-ink-700/60">Last updated: {updated}</p>

      <div className="prose-stayeasy mt-6 space-y-6 text-ink-800">
        <section>
          <h2 className="text-xl font-bold text-ink-900">Who we are</h2>
          <p className="mt-2">
            StayEasy is an independent hotel-information service. We help travelers choose hotels and book directly on
            each hotel’s official website. We are not an online travel agency (OTA): we do not process bookings, take
            payments, or charge commission.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink-900">Information we collect</h2>
          <p className="mt-2">We aim to collect as little as possible. Depending on how you use the site:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li><b>Information you give us</b> — e.g. when you contact us or a hotel submits a partner inquiry (name, email, message).</li>
            <li><b>Usage data</b> — basic, aggregated analytics such as pages viewed and general location/device, used to improve the site.</li>
            <li><b>Local storage</b> — your wishlist and language preference are stored in your browser, not on our servers.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink-900">Cookies</h2>
          <p className="mt-2">
            We and our partners use cookies and similar technologies to remember preferences, measure traffic, and (where
            enabled) serve advertising. You can control or delete cookies through your browser settings; some features may
            not work without them.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink-900">Third-party advertising (Google AdSense)</h2>
          <p className="mt-2">
            This site may display ads served by Google, including through Google AdSense. As described in Google’s policies:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this and other websites.</li>
            <li>Google’s use of advertising cookies enables it and its partners to serve ads to you based on your visits to this and/or other sites on the Internet.</li>
            <li>
              You may opt out of personalized advertising by visiting{' '}
              <a className="text-brand-700 underline" href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.
            </li>
            <li>
              You can also opt out of some third-party vendors’ use of cookies for personalized advertising at{' '}
              <a className="text-brand-700 underline" href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">aboutads.info/choices</a>.
            </li>
          </ul>
          <p className="mt-2">
            For more information about how Google uses data, see{' '}
            <a className="text-brand-700 underline" href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">
              How Google uses information from sites that use its services
            </a>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink-900">Analytics</h2>
          <p className="mt-2">
            We may use privacy-respecting analytics to understand aggregate traffic. This data is not used to personally
            identify you.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink-900">Your choices</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Manage cookies and tracking through your browser settings.</li>
            <li>Opt out of personalized ads via the links above.</li>
            <li>Contact us to ask what information we hold about you, or to request deletion.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink-900">Contact</h2>
          <p className="mt-2">
            Questions about this policy? Visit our{' '}
            <Link to="/contact" className="text-brand-700 underline">Contact page</Link>.
          </p>
        </section>
      </div>
    </div>
  )
}
