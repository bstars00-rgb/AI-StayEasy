import { useEffect, useState } from 'react'

export interface AsyncState<T> {
  data?: T
  loading: boolean
  error?: unknown
}

/**
 * Runs an async function and tracks loading/data/error, re-running when `deps`
 * change. Stale results are ignored (last-call-wins) to avoid races when a
 * route param changes mid-flight.
 */
export function useAsync<T>(fn: () => Promise<T>, deps: unknown[]): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({ loading: true })

  useEffect(() => {
    let active = true
    setState((s) => ({ ...s, loading: true, error: undefined }))
    fn().then(
      (data) => active && setState({ data, loading: false }),
      (error) => active && setState({ loading: false, error }),
    )
    return () => {
      active = false
    }
    // fn is intentionally recreated each render; deps control re-runs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return state
}
