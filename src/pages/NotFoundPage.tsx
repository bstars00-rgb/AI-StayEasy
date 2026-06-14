import Button from '../components/Button'
import { useT } from '../i18n'

export default function NotFoundPage() {
  const t = useT()
  return (
    <div className="container-page grid place-items-center py-28 text-center">
      <div>
        <div className="text-6xl">🧭</div>
        <h1 className="mt-4 text-3xl font-extrabold text-ink-900">{t.notFound.title}</h1>
        <p className="mt-2 text-ink-700/70">{t.notFound.text}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button to="/">{t.notFound.home}</Button>
          <Button to="/destinations/da-nang" variant="white">{t.notFound.browse}</Button>
        </div>
      </div>
    </div>
  )
}
