import type { CatalogRepo } from './catalog'
import type { Hotel, Destination } from '../types'
import type { Recommendation } from '../lib/searchEngine'
import { endpoints, API_BASE, type HotelListResponse } from '../api/contract'

/**
 * HTTP implementation of the catalog — wired to the endpoints in
 * src/api/contract.ts. NOT active until a backend exists: `repo.ts` only selects
 * this when `VITE_API_URL` is set. Until then it stays a structurally-complete
 * skeleton so the mock → API switch is a one-line change.
 */
const slugify = (s: string) => s.toLowerCase().replace(/\s+/g, '-')

export function createApiRepo(baseUrl: string): CatalogRepo {
  const json = async <T>(path: string, init?: RequestInit): Promise<T> => {
    const res = await fetch(`${baseUrl}${path}`, {
      headers: { 'content-type': 'application/json' },
      ...init,
    })
    if (!res.ok) throw new Error(`API ${res.status} ${res.statusText} for ${path}`)
    return res.json() as Promise<T>
  }

  return {
    listDestinations: () => json<Destination[]>(endpoints.cities()),
    getDestination: (slug) => json<Destination>(endpoints.city(slug)),
    // TODO(backend): add GET /hotels (all, paginated). Skeleton hits it directly.
    allHotels: async () => (await json<HotelListResponse>(`${API_BASE}/hotels`)).items,
    listHotelsByCity: async (city) =>
      (await json<HotelListResponse>(endpoints.cityHotels(slugify(city)))).items,
    getHotel: (slug) => json<Hotel>(endpoints.hotel(slug)),
    // TODO(backend): /hotels/:slug/similar (or embed `similar` in the detail response).
    getSimilarHotels: (hotel) => json<Hotel[]>(`${endpoints.hotel(hotel.slug)}/similar`),
    recommend: (query, limit) =>
      json<Recommendation>(endpoints.recommend(), {
        method: 'POST',
        body: JSON.stringify({ query, limit }),
      }),
  }
}
