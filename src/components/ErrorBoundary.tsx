import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}
interface State {
  hasError: boolean
}

/**
 * Catches render-time errors anywhere in the tree and shows a recovery screen
 * instead of a blank page. Kept i18n-free so it works even if locale code fails.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // In a real app this would report to an error service.
    console.error('Unhandled UI error:', error, info.componentStack)
  }

  render() {
    if (!this.state.hasError) return this.props.children
    return (
      <div className="grid min-h-screen place-items-center bg-sand-50 px-6 text-center">
        <div>
          <div className="text-5xl">🛠️</div>
          <h1 className="mt-4 text-2xl font-extrabold text-ink-900">Something went wrong</h1>
          <p className="mt-2 text-ink-700/70">An unexpected error occurred while rendering this page.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => window.location.reload()}
              className="rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Reload the page
            </button>
            <a
              href="/"
              className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-ink-900 shadow-sm ring-1 ring-black/5 hover:bg-sand-50"
            >
              Back home
            </a>
          </div>
        </div>
      </div>
    )
  }
}
