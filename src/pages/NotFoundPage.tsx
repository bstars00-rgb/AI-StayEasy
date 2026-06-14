import Button from '../components/Button'

export default function NotFoundPage() {
  return (
    <div className="container-page grid place-items-center py-28 text-center">
      <div>
        <div className="text-6xl">🧭</div>
        <h1 className="mt-4 text-3xl font-extrabold text-ink-900">Page not found</h1>
        <p className="mt-2 text-ink-700/70">That page took a wrong turn somewhere in Vietnam.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button to="/">Back home</Button>
          <Button to="/destinations/da-nang" variant="white">Browse Da Nang hotels</Button>
        </div>
      </div>
    </div>
  )
}
