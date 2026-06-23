import type { CatalogRepo } from './catalog'
import { hotels, getSimilarHotels } from './hotels'
import { destinations, getDestination } from './destinations'
import { recommend } from '../lib/searchEngine'
import { partnerDrafts } from '../lib/partnerDrafts'
import { applyEdits } from '../lib/hotelEdits'

/** Resolves `value`. Catalogue reads are immediate (no artificial latency, so
 *  navigation feels instant); pass `ms` only where a deliberate pause helps. */
const later = <T>(value: T, ms = 0): Promise<T> =>
  ms <= 0 ? Promise.resolve(value) : new Promise((resolve) => setTimeout(() => resolve(value), ms))

// The live catalogue = hotels registered through the back-office (drafts, newest
// first) + the bundled launch catalogue. Computed per-call so a hotel registered
// in this session appears immediately on navigation, without a refresh.
const catalogue = () => [...partnerDrafts.getAll().map((d) => d.hotel), ...hotels].map(applyEdits)

/** Synchronous catalogue lookup (drafts + static + self-service edits applied).
 *  Used by the partner portal, which scopes to a single signed-in property. */
export const findInCatalogue = (slug: string) => catalogue().find((h) => h.slug === slug)

/** Bundled-data implementation of the catalog — the default in this prototype. */
export const mockRepo: CatalogRepo = {
  listDestinations: () => later(destinations),
  getDestination: (slug) => later(getDestination(slug)),
  allHotels: () => later(catalogue()),
  listHotelsByCity: (city) =>
    later(catalogue().filter((h) => h.city.toLowerCase() === city.toLowerCase())),
  getHotel: (slug) => later(catalogue().find((h) => h.slug === slug)),
  getSimilarHotels: (hotel) => later(getSimilarHotels(hotel)),
  // A brief pause to sell the "AI thinking" moment (the one place latency helps UX).
  recommend: (query, limit) => later(recommend(query, catalogue(), limit), 250),
}
