/**
 * Google Maps place IDs per hotel slug, used only to fetch the live review
 * summary (see docs/GOOGLE_REVIEWS.md).
 *
 * Place IDs are the one piece of Places data Google lets us store indefinitely
 * (it recommends refreshing IDs older than 12 months). Nothing else from Places
 * — reviews, summaries, names, addresses — may be stored here.
 *
 * Add an entry ONLY after a person has matched it to the hotel's own listing:
 * name AND address must agree with the hotel's official site. A name-query
 * geocode can land on a same-chain neighbour, and a wrong ID would attach
 * another property's reviews to this hotel.
 *
 * Empty until the Places coverage probe (scripts/probe-places.mjs) shows that
 * Google actually returns summaries for Vietnamese hotels. While a slug is
 * absent the review block simply doesn't render.
 */
export const PLACE_IDS: Record<string, string> = {}
