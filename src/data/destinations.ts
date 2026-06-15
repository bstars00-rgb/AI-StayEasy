import type { Destination } from '../types'

export const destinations: Destination[] = [
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
    hotelCount: 12,
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
    hotelCount: 4,
  },
  {
    city: 'Nha Trang',
    slug: 'nha-trang',
    available: false,
    shortDescription: 'A curving bay of turquoise water, offshore islands, and big resort pools.',
    description: 'Beach resorts and island hopping on Vietnam’s south-central coast. Partner onboarding is underway.',
    bestFor: ['Couples', 'Resort pools', 'Snorkeling'],
    recommendedTraveler: 'Couples and resort-and-beach lovers.',
    heroColor: 'from-cyan-500 to-blue-500',
    emoji: '🐚',
    highlights: ['Nha Trang Bay', 'Island hopping', 'Mud-spa resorts'],
    hotelCount: 0,
  },
  {
    city: 'Phu Quoc',
    slug: 'phu-quoc',
    available: false,
    shortDescription: 'Vietnam’s tropical island escape — white-sand beaches and laid-back resorts.',
    description: 'An island of quiet beaches, a long cable car, and sunset coasts. StayEasy partner program launching next.',
    bestFor: ['Honeymoons', 'Island resorts', 'Quiet getaways'],
    recommendedTraveler: 'Honeymooners and travelers wanting a quiet island.',
    heroColor: 'from-teal-500 to-emerald-500',
    emoji: '🌴',
    highlights: ['Sao Beach', 'Hon Thom cable car', 'Sunset coast'],
    hotelCount: 0,
  },
]

export const getDestination = (slug: string) =>
  destinations.find((d) => d.slug === slug || d.city.toLowerCase() === slug.toLowerCase())
