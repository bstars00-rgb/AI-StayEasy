import { Link } from 'react-router-dom'
import { Logo } from './Logo'
import { useT } from '../i18n'

export function Footer() {
  const t = useT()
  return (
    <footer className="mt-16 border-t border-black/5 bg-white">
      <div className="container-page grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo size={36} />
          <p className="mt-3 max-w-xs text-sm text-ink-700/80">{t.footer.tagline}</p>
        </div>

        <div>
          <h4 className="text-sm font-bold text-ink-900">{t.footer.colStayeasy}</h4>
          <ul className="mt-3 space-y-2 text-sm text-ink-700/80">
            <li><Link className="hover:text-brand-700" to="/about">{t.footer.about}</Link></li>
            <li><Link className="hover:text-brand-700" to="/guides">Guides</Link></li>
            <li><Link className="hover:text-brand-700" to="/partners">{t.footer.partner}</Link></li>
            <li><Link className="hover:text-brand-700" to="/contact">{t.footer.contact}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold text-ink-900">{t.footer.colExplore}</h4>
          <ul className="mt-3 space-y-2 text-sm text-ink-700/80">
            <li><Link className="hover:text-brand-700" to="/destinations/vietnam">{t.footer.destinations}</Link></li>
            <li><Link className="hover:text-brand-700" to="/destinations/da-nang">{t.footer.daNang}</Link></li>
            <li><Link className="hover:text-brand-700" to="/guides">Guides</Link></li>
            <li><Link className="hover:text-brand-700" to="/partners">{t.footer.partner}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold text-ink-900">{t.footer.colMoney}</h4>
          <p className="mt-3 text-sm text-ink-700/80">{t.footer.moneyText}</p>
        </div>
      </div>

      <div className="border-t border-black/5">
        <div className="container-page py-5 text-xs text-ink-700/60">
          <p className="mb-2 rounded-lg bg-sand-50 px-3 py-2 text-ink-700/80 ring-1 ring-black/5">
            ⚠️ {t.footer.disclaimer}
          </p>
          <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
            <p>© {new Date().getFullYear()} StayEasy · {t.footer.rights}</p>
            <nav className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <Link className="hover:text-brand-700" to="/privacy">Privacy Policy</Link>
              <Link className="hover:text-brand-700" to="/terms">Terms of Use</Link>
              <Link className="hover:text-brand-700" to="/contact">Contact</Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  )
}
