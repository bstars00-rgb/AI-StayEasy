export type City = 'Da Nang' | 'Ho Chi Minh City' | 'Nha Trang' | 'Phu Quoc'

export type Area =
  // Da Nang
  | 'My Khe Beach'
  | 'Han River'
  | 'City Center'
  | 'Resort Area'
  // Ho Chi Minh City
  | 'District 1'
  | 'Thao Dien'
  | 'Airport Area'

export type HotelType =
  | 'Beach resort'
  | 'Family hotel'
  | 'City hotel'
  | 'Business hotel'
  | 'Long stay serviced apartment'
  | 'Korean-friendly hotel'

/** Travel-style labels used across discovery filters and "Best for" content. */
export type TravelStyle = 'Family' | 'Couple' | 'Business' | 'Beach' | 'Long Stay' | 'Korean-friendly'

/** Relative price band — used by AI search only; never shown as a price. */
export type PriceTier = 'budget' | 'mid' | 'premium'

export interface RoomGuide {
  couples: string
  families: string
  longStay: string
  checkBeforeBooking: string
}

export interface LocationGuide {
  nearby: string
  airportDistance: string
  gettingAround: string
  nearbyFood: string
}

export interface Hotel {
  id: string
  slug: string
  name: string
  city: City
  area: Area
  hotelType: HotelType
  shortDescription: string
  /** One-line positioning shown in the detail header. */
  positioningLine: string
  bestFor: string[]
  notIdealFor: string[]
  /** The single strongest reason to choose this hotel (StayEasy summary). */
  mainReason: string
  /** Things a traveler should verify before booking (StayEasy summary). */
  thingsToCheck: string[]
  tags: TravelStyle[]
  /** Relative price band for AI search matching (not displayed as a price). */
  priceTier: PriceTier
  facilities: string[]
  officialBenefits: string[]
  roomGuide: RoomGuide
  locationGuide: LocationGuide
  cancellationChecklist: string[]
  /** Placeholder image URL. Falls back to a branded gradient if it fails to load. */
  imageUrl: string
  officialWebsiteUrl: string
  isSponsored: boolean
  similarHotelSlugs: string[]
  // ---- UI helpers (not part of the core hotel record) ----
  heroColor: string
  emoji: string
  koreanFriendly: boolean
}

export interface Destination {
  city: City
  slug: string
  available: boolean
  shortDescription: string
  description: string
  bestFor: string[]
  recommendedTraveler: string
  heroColor: string
  emoji: string
  highlights: string[]
  hotelCount: number
}

export interface TravelStyleGuide {
  style: string
  emoji: string
  summary: string
  lookFor: string[]
}
