/** Target markets across Asia. Vietnam is the launch market; the rest are the
 *  expansion roadmap (onboarding next). */
export type Country =
  | 'Vietnam'
  | 'Thailand'
  | 'Japan'
  | 'South Korea'
  | 'Indonesia'
  | 'Singapore'
  | 'Malaysia'
  | 'Philippines'
  | 'Cambodia'
  | 'Laos'
  | 'Taiwan'
  | 'Hong Kong'
  | 'China'
  | 'India'
  | 'Sri Lanka'
  | 'Maldives'

export type City =
  // Live (hotels available)
  | 'Da Nang'
  | 'Ho Chi Minh City'
  | 'Nha Trang'
  | 'Phu Quoc'
  // Discoverable destinations (onboarding hotel partners)
  | 'Hanoi'
  | 'Ha Long Bay'
  | 'Sapa'
  | 'Ninh Binh'
  | 'Hue'
  | 'Hoi An'
  | 'Da Lat'
  | 'Mui Ne'
  | 'Can Tho'
  | 'Vung Tau'
  | 'Quy Nhon'
  | 'Con Dao'
  | 'Phu Yen'

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
  // Nha Trang
  | 'Nha Trang Beach'
  | 'North Nha Trang'
  // Phu Quoc
  | 'Long Beach'
  | 'Sao Beach'
  // Hoi An
  | 'Ancient Town'
  | 'An Bang Beach'
  | 'Cam Thanh'
  // Hanoi
  | 'Old Quarter'
  | 'West Lake'
  | 'French Quarter'

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

/** A direct-booking discount voucher the hotel provides — redeemed on the
 *  hotel's official website (StayEasy never processes the booking). */
export interface Voucher {
  code: string
  /** Short discount headline, e.g. "10% off your direct booking". */
  discountLabel: string
  terms: string
  /** ISO date the voucher is valid until. */
  validUntil: string
  /** How the guest redeems it:
   *  - 'online' (default): enter the code in the hotel booking form's Voucher field.
   *  - 'onsite': download to mobile and show it at check-in for the perk. */
  redeem?: 'online' | 'onsite'
}

/** Normalized, filterable travel conditions — the attributes travelers actually
 *  filter by. Derived deterministically from each hotel's profile. */
export interface HotelConditions {
  /** Official star rating (3–5). */
  starRating: 3 | 4 | 5
  /** StayEasy Score out of 10 — our own independent, editorial rating (not an
   *  aggregate of user reviews). Like a guide rating, it favors standout local
   *  hotels over big global chains. */
  stayEasyScore: number
  freeCancellation: boolean
  breakfastIncluded: boolean
  freeAirportShuttle: boolean
  freeParking: boolean
  freeWifi: boolean
  pool: boolean
  /** Directly on, or a short walk from, the beach. */
  beachfront: boolean
  familyFriendly: boolean
  petFriendly: boolean
  spa: boolean
  gym: boolean
  twentyFourHourFrontDesk: boolean
  nonSmoking: boolean
  /** Step-free / wheelchair-accessible. */
  accessible: boolean
  /** Walking minutes to the nearest beach. */
  walkToBeachMin: number
}

/** The hotel's own contact channels. StayEasy doesn't host the conversation —
 *  it routes the guest straight to the channel the hotel prefers (no extra
 *  system for the hotel to log into). */
export interface ContactChannels {
  /** Hotel's working language — guest requests are translated into this. */
  lang?: 'en' | 'ko' | 'vi' | 'zh' | 'ja'
  email?: string
  /** E.164-style number for tel: / wa.me / zalo.me. */
  phone?: string
  whatsapp?: string
  zalo?: string
  /** KakaoTalk open-chat URL. */
  kakao?: string
  /** LINE id. */
  line?: string
  /** Facebook Messenger username (m.me/<id>). */
  messenger?: string
}

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
  country: Country
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
  /** Normalized travel conditions used by the listing filters. */
  conditions: HotelConditions
  /** Placeholder image URL. Falls back to a branded gradient if it fails to load. */
  imageUrl: string
  /** Optional extra gallery photos (showcase hotels). Falls back to placeholders. */
  gallery?: string[]
  officialWebsiteUrl: string
  /** The hotel's preferred direct contact channels (optional). */
  contact?: ContactChannels
  isSponsored: boolean
  /** Optional downloadable direct-booking discount voucher from the hotel. */
  voucher?: Voucher
  similarHotelSlugs: string[]
  // ---- UI helpers (not part of the core hotel record) ----
  heroColor: string
  emoji: string
  koreanFriendly: boolean
}

export interface Destination {
  country: Country
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
