/**
 * Google sign-in (Google Identity Services). Activates when VITE_GOOGLE_CLIENT_ID
 * is set; otherwise the UI falls back to an email demo flow. The credential JWT
 * is decoded client-side for the profile (a production build verifies it server-
 * side).
 */
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined

export const googleEnabled = !!CLIENT_ID

export interface GoogleProfile {
  email: string
  name?: string
  picture?: string
}

interface GoogleIdApi {
  accounts: {
    id: {
      initialize: (opts: { client_id: string; callback: (resp: { credential: string }) => void }) => void
      prompt: () => void
    }
  }
}
declare global {
  interface Window {
    google?: GoogleIdApi
  }
}

function decode(credential: string): GoogleProfile | null {
  try {
    const payload = JSON.parse(atob(credential.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
    return { email: payload.email, name: payload.name, picture: payload.picture }
  } catch {
    return null
  }
}

let scriptPromise: Promise<void> | null = null
function ensureScript(): Promise<void> {
  if (scriptPromise) return scriptPromise
  scriptPromise = new Promise((resolve, reject) => {
    if (typeof document === 'undefined') return reject(new Error('no document'))
    const s = document.createElement('script')
    s.src = 'https://accounts.google.com/gsi/client'
    s.async = true
    s.onload = () => resolve()
    s.onerror = () => reject(new Error('failed to load Google Identity Services'))
    document.head.appendChild(s)
  })
  return scriptPromise
}

/** Triggers Google One Tap / sign-in. Returns false if Google is not configured. */
export function promptGoogle(onProfile: (p: GoogleProfile) => void): boolean {
  if (!CLIENT_ID) return false
  ensureScript()
    .then(() => {
      window.google?.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: (resp) => {
          const profile = decode(resp.credential)
          if (profile?.email) onProfile(profile)
        },
      })
      window.google?.accounts.id.prompt()
    })
    .catch(() => {})
  return true
}
