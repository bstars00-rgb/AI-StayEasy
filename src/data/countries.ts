import type { Country } from '../types'
import { hotels } from './hotels'

/** Derived from the real catalogue so Vietnam's count can't drift (was hardcoded). */
const VIETNAM_HOTELS = hotels.filter((h) => h.country === 'Vietnam').length

/**
 * Asia expansion roadmap. StayEasy launched in Vietnam to enter the market, then
 * rolls out across Asia. This list drives the registration country→city cascade,
 * the back-office "Markets" panel, and the public roadmap section.
 *
 * `cities` are representative destinations used by the registration form and the
 * roadmap — not the full catalogue (Vietnam's live catalogue lives in hotels.ts).
 */
export type Region = 'Southeast Asia' | 'East Asia' | 'South Asia'

export interface CountryMarket {
  name: Country
  slug: string
  /** ISO 3166-1 alpha-2. */
  code: string
  flag: string
  region: Region
  /** Live = hotels are bookable today (Vietnam). */
  available: boolean
  /** Hotels currently listed (0 for roadmap markets). */
  hotelCount: number
  cities: string[]
}

export const countries: CountryMarket[] = [
  {
    name: 'Vietnam',
    slug: 'vietnam',
    code: 'VN',
    flag: '🇻🇳',
    region: 'Southeast Asia',
    available: true,
    hotelCount: VIETNAM_HOTELS,
    cities: [
      'Da Nang', 'Ho Chi Minh City', 'Hanoi', 'Nha Trang', 'Phu Quoc', 'Hoi An',
      'Ha Long Bay', 'Sapa', 'Ninh Binh', 'Hue', 'Da Lat', 'Mui Ne', 'Can Tho',
      'Vung Tau', 'Quy Nhon', 'Con Dao', 'Phu Yen',
    ],
  },
  // ---- Expansion roadmap (onboarding next) ----
  { name: 'Thailand', slug: 'thailand', code: 'TH', flag: '🇹🇭', region: 'Southeast Asia', available: false, hotelCount: 0, cities: ['Bangkok', 'Phuket', 'Chiang Mai', 'Pattaya', 'Krabi', 'Koh Samui'] },
  { name: 'Japan', slug: 'japan', code: 'JP', flag: '🇯🇵', region: 'East Asia', available: false, hotelCount: 0, cities: ['Tokyo', 'Osaka', 'Kyoto', 'Fukuoka', 'Sapporo', 'Okinawa'] },
  { name: 'South Korea', slug: 'south-korea', code: 'KR', flag: '🇰🇷', region: 'East Asia', available: false, hotelCount: 0, cities: ['Seoul', 'Busan', 'Jeju', 'Incheon', 'Gangneung'] },
  { name: 'Indonesia', slug: 'indonesia', code: 'ID', flag: '🇮🇩', region: 'Southeast Asia', available: false, hotelCount: 0, cities: ['Bali', 'Jakarta', 'Yogyakarta', 'Lombok', 'Bandung'] },
  { name: 'Singapore', slug: 'singapore', code: 'SG', flag: '🇸🇬', region: 'Southeast Asia', available: false, hotelCount: 0, cities: ['Singapore'] },
  { name: 'Malaysia', slug: 'malaysia', code: 'MY', flag: '🇲🇾', region: 'Southeast Asia', available: false, hotelCount: 0, cities: ['Kuala Lumpur', 'Penang', 'Langkawi', 'Kota Kinabalu', 'Malacca'] },
  { name: 'Philippines', slug: 'philippines', code: 'PH', flag: '🇵🇭', region: 'Southeast Asia', available: false, hotelCount: 0, cities: ['Manila', 'Cebu', 'Boracay', 'Palawan', 'Bohol'] },
  { name: 'Cambodia', slug: 'cambodia', code: 'KH', flag: '🇰🇭', region: 'Southeast Asia', available: false, hotelCount: 0, cities: ['Siem Reap', 'Phnom Penh', 'Sihanoukville'] },
  { name: 'Laos', slug: 'laos', code: 'LA', flag: '🇱🇦', region: 'Southeast Asia', available: false, hotelCount: 0, cities: ['Luang Prabang', 'Vientiane', 'Vang Vieng'] },
  { name: 'Taiwan', slug: 'taiwan', code: 'TW', flag: '🇹🇼', region: 'East Asia', available: false, hotelCount: 0, cities: ['Taipei', 'Kaohsiung', 'Taichung', 'Tainan', 'Hualien'] },
  { name: 'Hong Kong', slug: 'hong-kong', code: 'HK', flag: '🇭🇰', region: 'East Asia', available: false, hotelCount: 0, cities: ['Hong Kong', 'Kowloon'] },
  { name: 'China', slug: 'china', code: 'CN', flag: '🇨🇳', region: 'East Asia', available: false, hotelCount: 0, cities: ['Shanghai', 'Beijing', 'Guangzhou', 'Chengdu', 'Xi’an', 'Sanya'] },
  { name: 'India', slug: 'india', code: 'IN', flag: '🇮🇳', region: 'South Asia', available: false, hotelCount: 0, cities: ['New Delhi', 'Mumbai', 'Goa', 'Jaipur', 'Bengaluru'] },
  { name: 'Sri Lanka', slug: 'sri-lanka', code: 'LK', flag: '🇱🇰', region: 'South Asia', available: false, hotelCount: 0, cities: ['Colombo', 'Kandy', 'Galle', 'Sigiriya'] },
  { name: 'Maldives', slug: 'maldives', code: 'MV', flag: '🇲🇻', region: 'South Asia', available: false, hotelCount: 0, cities: ['Malé', 'Maafushi', 'Addu City'] },
]

export const getCountry = (name: string) => countries.find((c) => c.name === name || c.slug === name)

/** Markets grouped by region — for the roadmap UI. */
export const countriesByRegion: { region: Region; markets: CountryMarket[] }[] = (
  ['Southeast Asia', 'East Asia', 'South Asia'] as Region[]
).map((region) => ({ region, markets: countries.filter((c) => c.region === region) }))

export const liveMarkets = countries.filter((c) => c.available)
export const roadmapMarkets = countries.filter((c) => !c.available)
