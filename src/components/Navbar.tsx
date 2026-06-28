import { Fragment, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useLang, useT } from '../i18n'
import { LanguageSwitcher } from './LanguageSwitcher'
import { Logo } from './Logo'
import { destinations } from '../data/destinations'
import { useFeaturedCity } from '../lib/siteNav'
import { useWishlist } from '../lib/wishlist'
import { wishlistStrings } from '../lib/wishlistI18n'
import { useGuest } from '../lib/guestAuth'
import { accountStrings } from '../lib/accountI18n'

export function Navbar() {
  const [open, setOpen] = useState(false)
  const t = useT()
  const { lang } = useLang()
  const ws = wishlistStrings[lang]
  const as = accountStrings[lang]
  const guest = useGuest()
  const { count } = useWishlist()

  // Admin-configurable featured-destination link (e.g. "Da Nang trip" → Phu Quoc).
  const featuredCity = useFeaturedCity()
  const fc = destinations.find((d) => d.slug === featuredCity) ?? destinations.find((d) => d.available)
  const fcName = fc ? ((t.enums.city as Record<string, string>)[fc.city] ?? fc.city) : ''
  const featured = fc ? { to: `/destinations/${fc.slug}`, label: t.nav.tripLabel.replace('{city}', fcName) } : null

  const links = [
    { to: '/destinations/vietnam', label: t.nav.destinations },
    { to: '/guides/direct-booking', label: t.nav.guide },
    { to: '/partners', label: t.nav.forHotels },
  ]

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-sand-50/85 backdrop-blur">
      <nav className="container-page flex h-16 items-center justify-between gap-4">
        <Link to="/" aria-label="StayEasy home" onClick={() => setOpen(false)}>
          <Logo size={36} />
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l, i) => (
            <Fragment key={l.to}>
              <NavLink
                to={l.to}
                className={({ isActive }) =>
                  `rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                    isActive ? 'bg-brand-100 text-brand-800' : 'text-ink-700 hover:bg-sand-100'
                  }`
                }
              >
                {l.label}
              </NavLink>
              {i === 0 && featured && (
                <NavLink
                  to={featured.to}
                  className={({ isActive }) =>
                    `rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                      isActive ? 'bg-brand-100 text-brand-800' : 'text-ink-700 hover:bg-sand-100'
                    }`
                  }
                >
                  {featured.label}
                </NavLink>
              )}
            </Fragment>
          ))}
          <NavLink
            to="/wishlist"
            aria-label={ws.nav}
            title={ws.nav}
            className={({ isActive }) =>
              `relative ml-1 grid h-9 w-9 place-items-center rounded-full text-lg transition-colors ${
                isActive ? 'bg-accent-50 text-accent-600' : 'text-ink-700 hover:bg-sand-100'
              }`
            }
          >
            <span aria-hidden>{count > 0 ? '♥' : '♡'}</span>
            {count > 0 && (
              <span className="absolute -right-1.5 -top-1.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-accent-500 px-1 text-[11px] font-bold leading-none text-white ring-2 ring-sand-50">
                {count}
              </span>
            )}
          </NavLink>
          {guest ? (
            <Link to="/account" aria-label={as.accountTitle} title={guest.email} className="ml-1 grid h-9 w-9 place-items-center rounded-full bg-brand-600 text-sm font-bold text-white hover:bg-brand-700">
              {guest.name.charAt(0).toUpperCase()}
            </Link>
          ) : (
            <Link to="/signin" className="ml-1 rounded-full px-3.5 py-2 text-sm font-medium text-ink-700 hover:bg-sand-100">
              {as.signIn}
            </Link>
          )}
          <Link
            to="/partner/login"
            className="ml-1 rounded-full bg-ink-900 px-4 py-2 text-sm font-semibold text-white hover:bg-ink-800"
          >
            {t.nav.hotelLogin}
          </Link>
          <div className="ml-1">
            <LanguageSwitcher />
          </div>
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <NavLink to="/wishlist" aria-label={ws.nav} className="relative grid h-10 w-10 place-items-center rounded-lg text-lg text-ink-900 hover:bg-sand-100">
            <span aria-hidden>{count > 0 ? '♥' : '♡'}</span>
            {count > 0 && (
              <span className="absolute right-0.5 top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-accent-500 px-1 text-[11px] font-bold leading-none text-white ring-2 ring-sand-50">
                {count}
              </span>
            )}
          </NavLink>
          <button
            className="grid h-10 w-10 place-items-center rounded-lg text-ink-900 hover:bg-sand-100"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-black/5 bg-sand-50 md:hidden">
          <div className="container-page flex flex-col py-3">
            <NavLink
              to={links[0].to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2.5 text-sm font-medium ${isActive ? 'bg-brand-100 text-brand-800' : 'text-ink-800 hover:bg-sand-100'}`
              }
            >
              {links[0].label}
            </NavLink>

            {featured && (
              <NavLink
                to={featured.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2.5 text-sm font-medium ${isActive ? 'bg-brand-100 text-brand-800' : 'text-ink-800 hover:bg-sand-100'}`
                }
              >
                {featured.label}
              </NavLink>
            )}

            {links.slice(1).map((l) => (
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
            <NavLink
              to="/wishlist"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2.5 text-sm font-medium ${
                  isActive ? 'bg-accent-50 text-accent-700' : 'text-ink-800 hover:bg-sand-100'
                }`
              }
            >
              ♥ {ws.nav}{count > 0 ? ` (${count})` : ''}
            </NavLink>
            {guest ? (
              <Link to="/account" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-800 hover:bg-sand-100">👤 {guest.name} · {as.member}</Link>
            ) : (
              <Link to="/signin" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-800 hover:bg-sand-100">{as.signIn}</Link>
            )}
            <Link
              to="/partner/login"
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
