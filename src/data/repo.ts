import type { CatalogRepo } from './catalog'
import { mockRepo } from './mockRepo'
import { createApiRepo } from './apiRepo'

/**
 * The active catalog data source.
 *
 * Defaults to bundled mock data. Set `VITE_API_URL` (e.g. in `.env`) to point
 * the whole app at a real backend implementing src/api/contract.ts — no other
 * code changes needed. UI imports `repo` from here only.
 */
const apiUrl = import.meta.env.VITE_API_URL as string | undefined

export const repo: CatalogRepo = apiUrl ? createApiRepo(apiUrl) : mockRepo

export type { CatalogRepo }
