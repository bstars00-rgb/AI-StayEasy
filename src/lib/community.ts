import { useSyncExternalStore } from 'react'

/**
 * Per-hotel community threads — anyone can post a question or insight. Mock
 * storage: everything lives in this browser's localStorage (no backend, not
 * shared across devices yet). SSR-safe and subscribable. A real backend can
 * replace commit()/read() later without changing the UI.
 */
export interface CommunityPost {
  id: string
  slug: string
  author: string
  /** Signed-in account email — ownership key for delete (display name is not
   *  unique: two different accounts can share the same first name). */
  authorEmail?: string
  body: string
  at: number
}

const KEY = 'stayeasy-community'
type Store = Record<string, CommunityPost[]>
const EMPTY_STORE: Store = {}
const EMPTY_POSTS: CommunityPost[] = []

function read(): Store {
  if (typeof localStorage === 'undefined') return EMPTY_STORE
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? '{}')
    return v && typeof v === 'object' && !Array.isArray(v) ? (v as Store) : EMPTY_STORE
  } catch {
    return EMPTY_STORE
  }
}

let store: Store = read()
const listeners = new Set<() => void>()

function commit(next: Store) {
  store = next
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(KEY, JSON.stringify(store))
    } catch {
      /* ignore quota/availability errors */
    }
  }
  listeners.forEach((l) => l())
}

function makeId(at: number): string {
  const rand = Math.floor((typeof crypto !== 'undefined' && crypto.getRandomValues ? crypto.getRandomValues(new Uint32Array(1))[0] : at * 7) % 1e6)
  return `${at}-${rand.toString(36)}`
}

export const community = {
  get: () => store,
  posts: (slug: string): CommunityPost[] => store[slug] ?? EMPTY_POSTS,
  add: (slug: string, author: string, body: string, authorEmail?: string) => {
    const text = body.trim()
    if (!text) return
    const at = Date.now()
    const post: CommunityPost = { id: makeId(at), slug, author: author.trim(), authorEmail, body: text, at }
    commit({ ...store, [slug]: [...(store[slug] ?? []), post] })
  },
  remove: (slug: string, id: string) =>
    commit({ ...store, [slug]: (store[slug] ?? []).filter((p) => p.id !== id) }),
  subscribe: (l: () => void) => {
    listeners.add(l)
    return () => {
      listeners.delete(l)
    }
  },
}

/** Reactive posts for one hotel, newest first. */
export function useCommunity(slug: string): CommunityPost[] {
  const map = useSyncExternalStore(community.subscribe, community.get, () => EMPTY_STORE)
  const posts = map[slug] ?? EMPTY_POSTS
  return [...posts].sort((a, b) => b.at - a.at)
}
