/**
 * Real photography for the home hero tiles and destination cards, so the site
 * doesn't lean on gradient + emoji placeholders. IDs are drawn from the same
 * verified free Unsplash set the hotel catalogue already uses (so they're known
 * to load); HotelImage still falls back to the gradient if a photo ever fails.
 * An operator can override any of these from the admin Images tab (siteImages).
 */
const u = (id: string, w = 800) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`

// Verified, known-good ids reused across the app (hotel/resort/beach/lantern).
const POOL = [
  '1507525428034-b723cf961d3e', // beach
  '1582719478250-c89cae4dc85b', // resort pool
  '1571896349842-33c89424de2d', // lobby
  '1566073771259-6a8506099945', // hotel building
  '1455587734955-081b22074882', // beachfront resort
  '1551882547-ff40c63fe5fa', // beach resort
  '1578683010236-d716f9a3f461', // Hoi An lanterns
  '1520250497591-112f2f40a3f4', // room
]

// City-appropriate signatures where we have a fitting verified photo.
const SIGNATURE: Record<string, string> = {
  'da-nang': '1551882547-ff40c63fe5fa',
  'ho-chi-minh-city': '1566073771259-6a8506099945',
  'nha-trang': '1582719478250-c89cae4dc85b',
  'phu-quoc': '1455587734955-081b22074882',
  'hoi-an': '1578683010236-d716f9a3f461',
  'hanoi': '1571896349842-33c89424de2d',
}

function hash(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h
}

/** A representative photo for a destination card. */
export function cityPhoto(slug: string, w = 800): string {
  return u(SIGNATURE[slug] ?? POOL[hash(slug) % POOL.length], w)
}

/** The four home hero tiles — beach, city, nature, stay. */
export const HERO_PHOTOS: string[] = [
  u('1507525428034-b723cf961d3e', 1000), // beach
  u('1566073771259-6a8506099945', 1000), // city hotel
  u('1582719478250-c89cae4dc85b', 1000), // resort / greenery
  u('1520250497591-112f2f40a3f4', 1000), // room / stay
]

/** Generic verified photo by index — for miscellaneous placeholder tiles. */
export function poolPhoto(i: number, w = 800): string {
  return u(POOL[i % POOL.length], w)
}
