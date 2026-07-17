import type { Destination } from '../types'
import { hotels } from './hotels'

// Launch-market destinations are all in Vietnam; `country` and `hotelCount` are
// injected below (hotelCount is derived from the catalogue, never authored here).
const rawDestinations: Omit<Destination, 'country' | 'hotelCount'>[] = [
  {
    city: 'Da Nang',
    slug: 'da-nang',
    available: true,
    shortDescription: 'Beach city with mountains, river bridges, and world-class resorts — and an easy drive to Hoi An.',
    description:
      'Da Nang pairs a long sandy coastline with the Marble Mountains and the Son Tra Peninsula, plus a lively riverfront downtown. It is the most family-friendly, easy-to-navigate launch city for StayEasy.',
    bestFor: ['Family travel', 'Beach resorts', 'First-time Vietnam'],
    recommendedTraveler: 'Families, couples, and first-time Vietnam travelers.',
    heroColor: 'from-sky-500 to-brand-500',
    emoji: '🏖️',
    highlights: ['My Khe Beach', 'Dragon Bridge', 'Marble Mountains', '25 min to Hoi An'],
  },
  {
    city: 'Ho Chi Minh City',
    slug: 'ho-chi-minh-city',
    available: true,
    shortDescription: 'The energetic southern metropolis — French-colonial landmarks, rooftop bars, and street-food legends.',
    description:
      'Vietnam’s largest city blends history, nightlife, and food, with central District 1, leafy Thao Dien, and easy airport stays.',
    bestFor: ['City breaks', 'Food lovers', 'Business + leisure'],
    recommendedTraveler: 'City explorers, foodies, and business travelers.',
    heroColor: 'from-amber-500 to-orange-500',
    emoji: '🌆',
    highlights: ['Ben Thanh Market', 'District 1 rooftops', 'Mekong Delta day trip'],
  },
  {
    city: 'Nha Trang',
    slug: 'nha-trang',
    available: true,
    shortDescription: 'A curving bay of turquoise water, offshore islands, and big resort pools.',
    description: 'Beach resorts and island hopping on Vietnam’s south-central coast. Partner onboarding is underway.',
    bestFor: ['Couples', 'Resort pools', 'Snorkeling'],
    recommendedTraveler: 'Couples and resort-and-beach lovers.',
    heroColor: 'from-cyan-500 to-blue-500',
    emoji: '🐚',
    highlights: ['Nha Trang Bay', 'Island hopping', 'Mud-spa resorts'],
  },
  {
    city: 'Phu Quoc',
    slug: 'phu-quoc',
    available: true,
    shortDescription: 'Vietnam’s tropical island escape — white-sand beaches and laid-back resorts.',
    description: 'An island of quiet beaches, a long cable car, and sunset coasts. StayEasy partner program launching next.',
    bestFor: ['Honeymoons', 'Island resorts', 'Quiet getaways'],
    recommendedTraveler: 'Honeymooners and travelers wanting a quiet island.',
    heroColor: 'from-teal-500 to-emerald-500',
    emoji: '🌴',
    highlights: ['Sao Beach', 'Hon Thom cable car', 'Sunset coast'],
  },

  // ---- Discoverable destinations (onboarding hotel partners) ----
  {
    city: 'Hanoi',
    slug: 'hanoi',
    available: true,
    shortDescription: 'The 1,000-year-old capital — Old Quarter lanes, lakes, street food, and French-colonial grandeur.',
    description:
      'Vietnam’s capital blends a buzzing Old Quarter, serene lakes, world-class street food, and colonial architecture. The gateway to the north (Ha Long, Sapa, Ninh Binh).',
    bestFor: ['Culture & history', 'Food lovers', 'First-time Vietnam'],
    recommendedTraveler: 'Culture seekers, foodies, and northern-Vietnam starters.',
    heroColor: 'from-rose-500 to-red-600',
    emoji: '🏛️',
    highlights: ['Old Quarter', 'Hoan Kiem Lake', 'Train Street', 'Egg coffee'],
  },
  {
    city: 'Ha Long Bay',
    slug: 'ha-long-bay',
    available: false,
    shortDescription: 'A UNESCO seascape of thousands of limestone karsts — best seen on an overnight cruise.',
    description:
      'Emerald waters and towering limestone islands make Ha Long one of Vietnam’s iconic sights. Overnight cruises, kayaking, and caves are the draw.',
    bestFor: ['Cruises', 'Couples', 'Nature & scenery'],
    recommendedTraveler: 'Couples and travelers after iconic scenery and cruises.',
    heroColor: 'from-emerald-500 to-teal-600',
    emoji: '⛰️',
    highlights: ['Overnight cruise', 'Limestone karsts', 'Sung Sot Cave', 'Kayaking'],
  },
  {
    city: 'Sapa',
    slug: 'sapa',
    available: false,
    shortDescription: 'Misty northern highlands — terraced rice fields, hill-tribe villages, and Mount Fansipan.',
    description:
      'Cool mountain air, dramatic rice terraces, and ethnic-minority culture. A trekking and homestay base, with a cable car up Fansipan, Indochina’s highest peak.',
    bestFor: ['Trekking', 'Mountain scenery', 'Cultural immersion'],
    recommendedTraveler: 'Trekkers and travelers wanting mountains and culture.',
    heroColor: 'from-green-600 to-lime-600',
    emoji: '🏔️',
    highlights: ['Rice terraces', 'Fansipan cable car', 'Hill-tribe villages', 'Cat Cat'],
  },
  {
    city: 'Ninh Binh',
    slug: 'ninh-binh',
    available: false,
    shortDescription: '“Ha Long on land” — karst valleys, river caves, and rice paddies by sampan boat.',
    description:
      'Limestone peaks rise over rivers and rice fields. Sampan rides through Trang An and Tam Coc, ancient temples, and easy day trips from Hanoi.',
    bestFor: ['Day trips', 'Scenery', 'Couples'],
    recommendedTraveler: 'Scenery lovers and easy-going day-trippers.',
    heroColor: 'from-lime-500 to-green-600',
    emoji: '🛶',
    highlights: ['Trang An boat ride', 'Tam Coc', 'Mua Cave viewpoint', 'Bai Dinh'],
  },
  {
    city: 'Hue',
    slug: 'hue',
    available: true,
    shortDescription: 'The former imperial capital — a riverside Citadel, royal tombs, and refined cuisine.',
    description:
      'Hue’s Imperial Citadel, royal tombs along the Perfume River, and a distinctive court cuisine make it Vietnam’s heritage heart. An easy add-on to Da Nang/Hoi An.',
    bestFor: ['History & heritage', 'Culture', 'Foodies'],
    recommendedTraveler: 'History buffs and central-Vietnam culture travelers.',
    heroColor: 'from-amber-600 to-yellow-600',
    emoji: '👑',
    highlights: ['Imperial Citadel', 'Royal tombs', 'Perfume River', 'Hue cuisine'],
  },
  {
    city: 'Hoi An',
    slug: 'hoi-an',
    available: true,
    shortDescription: 'A lantern-lit UNESCO old town — tailors, riverside cafés, and a nearby beach.',
    description:
      'Hoi An’s preserved Ancient Town glows with lanterns at night. Famous for tailoring, food tours, and An Bang Beach — 30 minutes from Da Nang.',
    bestFor: ['Couples', 'Walkable charm', 'Food & shopping'],
    recommendedTraveler: 'Couples and travelers after lantern-lit charm and food.',
    heroColor: 'from-orange-500 to-amber-500',
    emoji: '🏮',
    highlights: ['Ancient Town', 'Lantern night', 'Tailor shops', 'An Bang Beach'],
  },
  {
    city: 'Da Lat',
    slug: 'da-lat',
    available: false,
    shortDescription: 'Cool-climate highlands — pine forests, flower farms, lakes, and coffee plantations.',
    description:
      'A romantic mountain town of eternal spring: French villas, waterfalls, flower gardens, canyoning, and Vietnam’s coffee heartland.',
    bestFor: ['Couples', 'Cool weather', 'Coffee & nature'],
    recommendedTraveler: 'Couples and travelers wanting cool, green highlands.',
    heroColor: 'from-emerald-600 to-green-700',
    emoji: '🌲',
    highlights: ['Flower gardens', 'Coffee farms', 'Datanla canyoning', 'Xuan Huong Lake'],
  },
  {
    city: 'Mui Ne',
    slug: 'mui-ne',
    available: false,
    shortDescription: 'A breezy beach town with red-and-white sand dunes and a kitesurfing scene.',
    description:
      'Mui Ne pairs a long beach with surreal sand dunes, the Fairy Stream, and some of Asia’s best kitesurfing — an easy escape from Ho Chi Minh City.',
    bestFor: ['Kitesurfing', 'Beach & dunes', 'Couples'],
    recommendedTraveler: 'Beach-and-watersports travelers and couples.',
    heroColor: 'from-orange-500 to-rose-500',
    emoji: '🏜️',
    highlights: ['Sand dunes', 'Fairy Stream', 'Kitesurfing', 'Fishing village'],
  },
  {
    city: 'Can Tho',
    slug: 'can-tho',
    available: false,
    shortDescription: 'The Mekong Delta hub — floating markets, river life, and lush orchards.',
    description:
      'The largest city of the Mekong Delta, famous for the Cai Rang floating market at dawn, canal cruises, fruit orchards, and warm river-life culture.',
    bestFor: ['Mekong Delta', 'Markets & culture', 'Day trips'],
    recommendedTraveler: 'Culture travelers exploring the Mekong Delta.',
    heroColor: 'from-lime-600 to-emerald-600',
    emoji: '🛥️',
    highlights: ['Cai Rang floating market', 'Canal cruise', 'Fruit orchards', 'Ninh Kieu'],
  },
  {
    city: 'Vung Tau',
    slug: 'vung-tau',
    available: false,
    shortDescription: 'A seaside city near Ho Chi Minh City — beaches, a hilltop Christ statue, and seafood.',
    description:
      'The closest beach getaway from Ho Chi Minh City: laid-back beaches, lighthouse and Christ-statue viewpoints, and fresh seafood.',
    bestFor: ['Weekend beach', 'Seafood', 'Easy escape'],
    recommendedTraveler: 'Weekenders and seafood lovers near Saigon.',
    heroColor: 'from-sky-500 to-blue-600',
    emoji: '⛱️',
    highlights: ['Back Beach', 'Christ of Vung Tau', 'Lighthouse', 'Seafood'],
  },
  {
    city: 'Quy Nhon',
    slug: 'quy-nhon',
    available: false,
    shortDescription: 'An up-and-coming central-coast beach city — quiet bays, Cham towers, and seafood.',
    description:
      'Less crowded than its neighbors, Quy Nhon offers clean beaches, scenic Ky Co and Eo Gio, ancient Cham towers, and superb-value seafood.',
    bestFor: ['Quiet beaches', 'Off the beaten path', 'Seafood'],
    recommendedTraveler: 'Travelers wanting quieter beaches off the trail.',
    heroColor: 'from-cyan-500 to-teal-600',
    emoji: '🐟',
    highlights: ['Ky Co Beach', 'Eo Gio', 'Cham towers', 'Seafood'],
  },
  {
    city: 'Con Dao',
    slug: 'con-dao',
    available: false,
    shortDescription: 'A remote, pristine island archipelago — empty beaches, diving, and turtle nesting.',
    description:
      'Once a prison island, now a serene nature escape: untouched beaches, coral reefs and diving, sea-turtle nesting, and a poignant history.',
    bestFor: ['Diving & nature', 'Seclusion', 'Honeymoons'],
    recommendedTraveler: 'Nature lovers and couples after seclusion.',
    heroColor: 'from-teal-600 to-cyan-700',
    emoji: '🐢',
    highlights: ['Empty beaches', 'Diving & reefs', 'Turtle nesting', 'National park'],
  },
  {
    city: 'Phu Yen',
    slug: 'phu-yen',
    available: false,
    shortDescription: 'An unspoiled central-coast gem (Tuy Hoa) — wild beaches, the “Eye of God,” and great-value seafood.',
    description:
      'Just south of Quy Nhon, Phu Yen (Tuy Hoa) offers dramatic coastline, untouched beaches, the famous Bai Xep and Ganh Da Dia, and authentic local life — “the real Vietnam” away from the crowds.',
    bestFor: ['Off the beaten path', 'Photography', 'Local food & value'],
    recommendedTraveler: 'Return travelers and those seeking quiet, authentic coast.',
    heroColor: 'from-cyan-600 to-teal-600',
    emoji: '🌅',
    highlights: ['Ganh Da Dia', 'Bai Xep', 'Tuy Hoa beach', 'Local seafood'],
  },
]

// hotelCount is DERIVED from the real catalogue (never hardcoded) so the count
// shown on cards can't drift from the hotels actually listed for a city.
export const destinations: Destination[] = rawDestinations.map((d) => ({
  country: 'Vietnam',
  ...d,
  hotelCount: hotels.filter((h) => h.city === d.city).length,
}))

export const getDestination = (slug: string) =>
  destinations.find((d) => d.slug === slug || d.city.toLowerCase() === slug.toLowerCase())
