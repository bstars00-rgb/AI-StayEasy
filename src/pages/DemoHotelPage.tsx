import { Link } from 'react-router-dom'
import { useLang } from '../i18n'
import { demoStrings } from '../lib/demoI18n'
import { useDocumentMeta } from '../lib/useDocumentMeta'

/**
 * Where the "official website" buttons of the fictional demo hotels lead. There is
 * no site to send anyone to, and a search for a fictional name would only mislead.
 */
export default function DemoHotelPage() {
  const { lang } = useLang()
  const s = demoStrings[lang]
  useDocumentMeta(`${s.pageTitle} — StayEasy`, s.pageText)
  return (
    <div className="container-page max-w-xl py-16 text-center">
      <p className="text-4xl" aria-hidden>🌙</p>
      <h1 className="mt-3 text-2xl font-extrabold text-ink-900">{s.pageTitle}</h1>
      <p className="mt-3 text-ink-700/85">{s.pageText}</p>
      <Link to="/destinations/da-nang" className="mt-6 inline-block rounded-full bg-brand-600 px-6 py-3 text-sm font-bold text-white hover:bg-brand-700">
        {s.pageBack}
      </Link>
    </div>
  )
}
