import type { Hotel, Destination } from '../types'
import { hotels, getHotel, hotelsByCity, getSimilarHotels } from './hotels'
import { destinations, getDestination } from './destinations'
import { recommend as recommendEngine, type Recommendation } from '../lib/searchEngine'

/**
 * Catalog data access — the single seam between the UI and the data source.
 *
 * Today this is backed by bundled mock data. When the backend lands, swap each
 * method body for a `fetch()` against the endpoints in `src/api/contract.ts`
 * (e.g. `repo.getHotel(slug)` → `GET /api/v1/hotels/:slug`). The method
 * signatures are intentionally promise-friendly: callers can be migrated to
 * `await repo.x()` without changing call sites elsewhere.
 *
 * UI code should import from here rather than from `./hotels` / `./destinations`
 * directly, so the mock → API migration touches only this file.
 */
export const repo = {
  listDestinations(): Destination[] {
    return destinations
  },
  getDestination(slug: string): Destination | undefined {
    return getDestination(slug)
  },
  allHotels(): Hotel[] {
    return hotels
  },
  listHotelsByCity(city: string): Hotel[] {
    return hotelsByCity(city)
  },
  getHotel(slug: string): Hotel | undefined {
    return getHotel(slug)
  },
  getSimilarHotels(hotel: Hotel): Hotel[] {
    return getSimilarHotels(hotel)
  },
  /** Natural-language recommendation over the full catalogue. */
  recommend(query: string, limit?: number): Recommendation {
    return recommendEngine(query, hotels, limit)
  },
}
