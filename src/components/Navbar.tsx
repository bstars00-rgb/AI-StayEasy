import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useT } from '../i18n'
import { LanguageSwitcher } from './LanguageSwitcher'

export function Navbar() {
  const [open, setOpen] = useState(false)
  const t = useT()

  const links = [
    { to: '/destinations/vietnam', label: t.nav.destinations },
    { to: '/destinations/da-nang', label: t.nav.daNangHotels },
    { to: '/guides/direct-booking', label: t.nav.guide },
    { to: '/partners', label: t.nav.forHotels },
  ]

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-sand-50/85 backdrop-blur">
      <nav className="container-page flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-lg text-white">🏨</span>
          <span className="text-lg font-extrabold tracking-tight text-ink-900">
            StayEasy <span className="text-brand-600">Vietnam</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'bg-brand-100 text-brand-800' : 'text-ink-700 hover:bg-sand-100'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <Link
            to="/dashboard"
            className="ml-2 rounded-full bg-ink-900 px-4 py-2 text-sm font-semibold text-white hover:bg-ink-800"
          >
            {t.nav.hotelLogin}
          </Link>
          <div className="ml-1">
            <LanguageSwitcher />
          </div>
        </div>

        <button
          className="grid h-10 w-10 place-items-center rounded-lg text-ink-900 hover:bg-sand-100 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? '✕' : '☰'}
        </button>
      </nav>

      {open && (
        <div className="border-t border-black/5 bg-sand-50 md:hidden">
          <div className="container-page flex flex-col py-3">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2.5 text-sm font-medium ${
                    isActive ? 'bg-brand-100 text-brand-800' : 'text-ink-800 hover:bg-sand-100'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <Link
              to="/dashboard"
              onClick={() => setOpen(false)}
              className="mt-1 rounded-lg bg-ink-900 px-3 py-2.5 text-center text-sm font-semibold text-white"
            >
              {t.nav.hotelLogin}
            </Link>
            <div className="mt-2">
              <LanguageSwitcher block />
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
