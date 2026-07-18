import { Link } from 'react-router-dom'
import { useLang, useT } from '../i18n'
import { searchStrings } from '../lib/searchI18n'
import { useDocumentMeta } from '../lib/useDocumentMeta'
import { AISearch } from '../components/AISearch'

export default function SearchPage() {
  const { lang } = useLang()
  const t = useT()
  const s = searchStrings[lang]
  useDocumentMeta(`${s.nav} — StayEasy Vietnam`, s.subtitle)

  return (
    <>
      <section className="bg-gradient-to-br from-brand-700 via-brand-600 to-sky-500 py-12 text-white">
        <div className="container-page">
          <nav className="mb-3 text-sm text-white/70">
            <Link to="/" className="hover:text-white">{t.common.home}</Link> <span className="px-1">/</span> {s.nav}
          </nav>
          <span className="pill bg-white/15 text-white ring-1 ring-white/25">✨ {s.nav}</span>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">{s.title}</h1>
          <p className="mt-2 max-w-2xl text-white/85">{s.subtitle}</p>
        </div>
      </section>

      <section className="container-page my-8">
        <AISearch autoFocus />
      </section>
    </>
  )
}
