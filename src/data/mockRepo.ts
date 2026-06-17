import type { CatalogRepo } from './catalog'
import { hotels, getSimilarHotels } from './hotels'
import { destinations, getDestination } from './destinations'
import { recommend } from '../lib/searchEngine'
import { partnerDrafts } from '../lib/partnerDrafts'
import { applyEdits } from '../lib/hotelEdits'

/** Resolves `value` after a small delay to mimic network latency. */
const later = <T>(value: T, ms = 120): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms))

// The live catalogue = hotels registered through the back-office (drafts, newest
// first) + the bundled launch catalogue. Computed per-call so a hotel registered
// in this session appears immediately on navigation, without a refresh.
const catalogue = () => [...partnerDrafts.getAll().map((d) => d.hotel), ...hotels].map(applyEdits)

/** Bundled-data implementation of the catalog — the default in this prototype. */
export const mockRepo: CatalogRepo = {
  listDestinations: () => later(destinations),
  getDestination: (slug) => later(getDestination(slug)),
  allHotels: () => later(catalogue()),
  listHotelsByCity: (city) =>
    later(catalogue().filter((h) => h.city.toLowerCase() === city.toLowerCase())),
  getHotel: (slug) => later(catalogue().find((h) => h.slug === slug)),
  getSimilarHotels: (hotel) => later(getSimilarHotels(hotel)),
  // Slightly longer to sell the "AI thinking" moment.
  recommend: (query, limit) => later(recommend(query, catalogue(), limit), 400),
}
