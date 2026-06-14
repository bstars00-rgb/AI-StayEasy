import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="mt-16 border-t border-black/5 bg-white">
      <div className="container-page grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-lg text-white">🏨</span>
            <span className="text-lg font-extrabold text-ink-900">StayEasy Vietnam</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-ink-700/80">
            StayEasy helps travelers choose better hotels and book directly with hotels. We are not an OTA — we
            never take booking commission.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-bold text-ink-900">StayEasy</h4>
          <ul className="mt-3 space-y-2 text-sm text-ink-700/80">
            <li><Link className="hover:text-brand-700" to="/about">About</Link></li>
            <li><Link className="hover:text-brand-700" to="/guides/direct-booking">Direct Booking Guide</Link></li>
            <li><Link className="hover:text-brand-700" to="/partners">Partner with StayEasy</Link></li>
            <li><a className="hover:text-brand-700" href="#contact">Contact</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold text-ink-900">Explore</h4>
          <ul className="mt-3 space-y-2 text-sm text-ink-700/80">
            <li><Link className="hover:text-brand-700" to="/destinations/vietnam">Destinations</Link></li>
            <li><Link className="hover:text-brand-700" to="/destinations/da-nang">Da Nang hotels</Link></li>
            <li><Link className="hover:text-brand-700" to="/dashboard">Hotel dashboard</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold text-ink-900">How we make money</h4>
          <p className="mt-3 text-sm text-ink-700/80">
            Hotel advertising, featured listings, sponsored content, and content production — never a cut of your
            booking. <span className="font-semibold text-brand-700">Sponsored</span> placements are always labeled.
          </p>
        </div>
      </div>

      <div className="border-t border-black/5">
        <div className="container-page py-5 text-xs text-ink-700/60">
          <p className="mb-2 rounded-lg bg-sand-50 px-3 py-2 text-ink-700/80 ring-1 ring-black/5">
            ⚠️ StayEasy does not process hotel reservations or payments. Final booking is completed through each
            hotel’s official website.
          </p>
          <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
            <p>© {new Date().getFullYear()} StayEasy Vietnam · Prototype demo — sample data only.</p>
            <p>Da Nang · Ho Chi Minh City · Nha Trang · Phu Quoc</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
