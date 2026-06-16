import type { Hotel, Destination } from '../types'
import type { Recommendation } from '../lib/searchEngine'

/**
 * Catalog data access interface — the contract every data source implements.
 *
 * All methods are async (Promise-based) so the same calling code works whether
 * the data comes from bundled mocks (`mockRepo`) or a real HTTP backend
 * (`apiRepo`, see src/api/contract.ts). UI reads through `repo` (src/data/repo.ts)
 * and never imports a concrete data file directly.
 */
export interface CatalogRepo {
  listDestinations(): Promise<Destination[]>
  getDestination(slug: string): Promise<Destination | undefined>
  allHotels(): Promise<Hotel[]>
  listHotelsByCity(city: string): Promise<Hotel[]>
  getHotel(slug: string): Promise<Hotel | undefined>
  getSimilarHotels(hotel: Hotel): Promise<Hotel[]>
  /** Natural-language recommendation over the catalogue. */
  recommend(query: string, limit?: number): Promise<Recommendation>
}
