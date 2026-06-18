import { useSyncExternalStore } from 'react'
import type { Lang } from '../i18n'
import type { RequestKey } from './conciergeI18n'

/**
 * Direct-Stay Inbox threads (DEMO — localStorage, no backend). One thread per
 * guest stay, scoped to a hotel slug. Structured requests are stored as keys so
 * each side renders them in its own language. A real build syncs to the partner
 * API with push notifications (email / Zalo / WhatsApp).
 */
export interface ConciergeMessage {
  id: string
  from: 'guest' | 'hotel'
  text: string
  lang: Lang
  createdAt: string
}

export interface ConciergeThread {
  id: string
  hotelSlug: string
  guestName: string
  bookingRef: string
  guestLang: Lang
  requests: RequestKey[]
  createdAt: string
  messages: ConciergeMessage[]
}

const KEY = 'stayeasy-concierge'
const EMPTY: ConciergeThread[] = []

function read(): ConciergeThread[] {
  if (typeof localStorage === 'undefined') return EMPTY
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? '[]')
    return Array.isArray(v) ? v : EMPTY
  } catch {
    return EMPTY
  }
}

let threads: ConciergeThread[] = read()
const listeners = new Set<() => void>()

function commit(next: ConciergeThread[]) {
  threads = next
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(KEY, JSON.stringify(threads))
    } catch {
      /* ignore */
    }
  }
  listeners.forEach((l) => l())
}

export const concierge = {
  all: () => threads,
  forHotel: (slug: string) => threads.filter((t) => t.hotelSlug === slug),

  open(input: {
    hotelSlug: string
    guestName: string
    bookingRef: string
    guestLang: Lang
    requests: RequestKey[]
    note: string
    createdAt: string
  }): ConciergeThread {
    const id = `t-${threads.length + 1}-${input.hotelSlug}`
    const messages: ConciergeMessage[] = input.note.trim()
      ? [{ id: `${id}-m1`, from: 'guest', text: input.note.trim(), lang: input.guestLang, createdAt: input.createdAt }]
      : []
    const thread: ConciergeThread = {
      id,
      hotelSlug: input.hotelSlug,
      guestName: input.guestName.trim() || 'Guest',
      bookingRef: input.bookingRef.trim(),
      guestLang: input.guestLang,
      requests: input.requests,
      createdAt: input.createdAt,
      messages,
    }
    commit([thread, ...threads])
    return thread
  },

  /** Appends a message from either side to a thread. */
  addMessage(threadId: string, from: 'guest' | 'hotel', text: string, lang: Lang, createdAt: string) {
    commit(
      threads.map((t) =>
        t.id === threadId
          ? { ...t, messages: [...t.messages, { id: `${threadId}-m${t.messages.length + 1}`, from, text, lang, createdAt }] }
          : t,
      ),
    )
  },

  /** Latest thread a guest opened for a hotel (this browser). */
  latestForHotel: (slug: string) => threads.find((t) => t.hotelSlug === slug),

  clear: () => commit([]),
  subscribe: (l: () => void) => {
    listeners.add(l)
    return () => {
      listeners.delete(l)
    }
  },
}

export function useHotelThreads(slug: string): ConciergeThread[] {
  const all = useSyncExternalStore(concierge.subscribe, concierge.all, () => EMPTY)
  return all.filter((t) => t.hotelSlug === slug)
}

export function useAllThreads(): ConciergeThread[] {
  return useSyncExternalStore(concierge.subscribe, concierge.all, () => EMPTY)
}
