import type { CatalogRepo } from './catalog'
import { hotels, getHotel, hotelsByCity, getSimilarHotels } from './hotels'
import { destinations, getDestination } from './destinations'
import { recommend } from '../lib/searchEngine'

/** Resolves `value` after a small delay to mimic network latency. */
const later = <T>(value: T, ms = 120): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms))

/** Bundled-data implementation of the catalog — the default in this prototype. */
export const mockRepo: CatalogRepo = {
  listDestinations: () => later(destinations),
  getDestination: (slug) => later(getDestination(slug)),
  allHotels: () => later(hotels),
  listHotelsByCity: (city) => later(hotelsByCity(city)),
  getHotel: (slug) => later(getHotel(slug)),
  getSimilarHotels: (hotel) => later(getSimilarHotels(hotel)),
  // Slightly longer to sell the "AI thinking" moment.
  recommend: (query, limit) => later(recommend(query, hotels, limit), 400),
}
