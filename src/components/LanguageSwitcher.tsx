import { useEffect, useRef, useState } from 'react'
import { LANGS, useLang, useT } from '../i18n'

export function LanguageSwitcher({ block = false }: { block?: boolean }) {
  const { lang, setLang } = useLang()
  const t = useT()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const current = LANGS.find((l) => l.code === lang) ?? LANGS[0]

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  return (
    <div className={`relative ${block ? 'w-full' : ''}`} ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-3 py-2 text-sm font-medium text-ink-800 hover:bg-sand-50 ${block ? 'w-full justify-center' : ''}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t.nav.language}
        title={t.nav.language}
      >
        <span aria-hidden>🌐</span>
        <span>{current.flag} {current.label}</span>
        <span aria-hidden className="text-ink-700/50">▾</span>
      </button>
      {open && (
        <ul
          className={`absolute z-50 mt-2 min-w-[10rem] overflow-hidden rounded-xl bg-white py-1 shadow-card ring-1 ring-black/10 ${block ? 'left-0 right-0' : 'right-0'}`}
          role="listbox"
        >
          {LANGS.map((l) => (
            <li key={l.code}>
              <button
                role="option"
                aria-selected={l.code === lang}
                onClick={() => {
                  setLang(l.code)
                  setOpen(false)
                }}
                className={`flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-sand-50 ${
                  l.code === lang ? 'font-semibold text-brand-700' : 'text-ink-800'
                }`}
              >
                <span aria-hidden>{l.flag}</span> {l.label}
                {l.code === lang && <span className="ml-auto text-brand-600">✓</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
