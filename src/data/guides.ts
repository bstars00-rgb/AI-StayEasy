/**
 * Original editorial guides — the content backbone of StayEasy. These are
 * written for travelers (not generated placeholders): how to book direct, what
 * to verify before paying, and practical, opinionated city guides for Vietnam.
 *
 * This content is what makes StayEasy a genuine information site rather than a
 * directory — and the foundation for advertising-based monetization.
 */

const u = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=70`

export type GuideCategory = 'Direct booking' | 'City guide' | 'Planning'

export interface GuideSection {
  heading: string
  body: string[]
  bullets?: string[]
}

export interface Guide {
  slug: string
  category: GuideCategory
  title: string
  excerpt: string
  readMins: number
  updated: string
  emoji: string
  heroColor: string
  heroImage: string
  intro: string
  sections: GuideSection[]
  faqs?: { q: string; a: string }[]
}

export const guides: Guide[] = [
  {
    slug: 'why-book-hotels-direct',
    category: 'Direct booking',
    title: 'Why booking a hotel directly is often the smarter choice',
    excerpt:
      'Direct booking is not automatically cheaper — but it can unlock perks, flexibility, and a better relationship with the hotel. Here is when it wins, and when it does not.',
    readMins: 6,
    updated: '2026-06-10',
    emoji: '🏷️',
    heroColor: 'from-brand-500 to-accent-500',
    heroImage: u('1566073771259-6a8506099945'),
    intro:
      'When you book a hotel through an online travel agency (OTA), the hotel pays a commission — often 15–25% of the room rate. Many hotels would rather give part of that value back to you for booking on their own website. That is the core idea behind direct booking, and why a content site like StayEasy points you to the official site instead of taking a cut.',
    sections: [
      {
        heading: 'What you can gain by booking direct',
        body: [
          'Hotels reserve their best treatment for guests they recognize as their own. Because there is no middleman taking a commission, they have room to offer extras that an OTA rate rarely includes.',
        ],
        bullets: [
          'Free breakfast, room upgrades, or late checkout offered as a direct-only perk',
          'A best-rate guarantee — many chains promise to match or beat OTA prices',
          'Easier changes and special requests, handled by the hotel directly',
          'Loyalty points and member rates that usually do not apply to OTA bookings',
        ],
      },
      {
        heading: 'When an OTA might still be better',
        body: [
          'Direct is not a universal win. OTAs are genuinely convenient, and sometimes their promotional rates or loyalty programs beat the official site. Be honest about the trade-off:',
        ],
        bullets: [
          'You want one itinerary and one customer-service contact for many bookings',
          'The OTA is running a flash sale or coupon that the hotel will not match',
          'You value OTA loyalty points more than the hotel’s own perks',
        ],
      },
      {
        heading: 'How to compare fairly',
        body: [
          'Open the OTA listing and the hotel’s official website side by side, and compare the total price after taxes and fees — not the headline rate. Then weigh what each option includes: breakfast, cancellation flexibility, and any perks. The cheapest number is not always the best value.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Is direct booking always cheaper?',
        a: 'No. Direct booking often adds value through perks and flexibility, but OTA promotions can sometimes be cheaper. Always compare the total price including taxes.',
      },
      {
        q: 'Does StayEasy book the room for me?',
        a: 'No. StayEasy is an information site, not an OTA. We help you choose, then you book on the hotel’s official website. We never process payments or take commission.',
      },
    ],
  },
  {
    slug: 'direct-booking-checklist',
    category: 'Direct booking',
    title: 'The 7-point checklist to run before you pay for any hotel',
    excerpt:
      'Before you enter your card details — on any site — run through these seven checks. They take two minutes and save the most common booking regrets.',
    readMins: 5,
    updated: '2026-06-12',
    emoji: '✅',
    heroColor: 'from-sky-500 to-brand-500',
    heroImage: u('1551882547-ff40c63fe5fa'),
    intro:
      'Most booking problems are avoidable. They come from skimming past the fine print: a non-refundable rate, breakfast that was not included, or a city tax added at the property. Here is a quick checklist to run on the final booking screen, whether you book direct or through an OTA.',
    sections: [
      {
        heading: 'The checklist',
        body: ['Run these in order before you confirm:'],
        bullets: [
          'Total price after taxes and fees — not the nightly headline rate',
          'Cancellation deadline and penalty — and whether the rate is refundable at all',
          'Whether breakfast is included, and for how many guests',
          'Deposit or prepayment terms, and when your card is charged',
          'Child and extra-bed policy if you are traveling with family',
          'Bed type and room view — confirm it matches what you expect',
          'The exact hotel name and address (avoid similarly named properties)',
        ],
      },
      {
        heading: 'Watch for the “non-refundable” trap',
        body: [
          'The lowest rate is frequently a non-refundable, pay-now rate. That can be fine if your plans are certain — but if there is any chance you will change dates, a slightly higher flexible rate is usually worth it. Read the cancellation line before the price tempts you.',
        ],
      },
      {
        heading: 'Keep your confirmation',
        body: [
          'Save the confirmation email and any perk you were promised (free breakfast, upgrade, late checkout). If you booked direct and a perk was part of the deal, a quick note to the hotel before arrival makes sure it is on your reservation.',
        ],
      },
    ],
    faqs: [
      {
        q: 'What is the single most common booking mistake?',
        a: 'Booking a non-refundable rate without realizing it. Always read the cancellation policy before you pay.',
      },
    ],
  },
  {
    slug: 'da-nang-travel-guide',
    category: 'City guide',
    title: 'Da Nang travel guide: beaches, bridges, and an easy base for central Vietnam',
    excerpt:
      'Da Nang pairs a long sandy coastline with mountains, a lively riverfront, and a 25-minute drive to Hoi An — the easiest launch point for first-time central Vietnam.',
    readMins: 7,
    updated: '2026-06-08',
    emoji: '🏖️',
    heroColor: 'from-sky-500 to-brand-500',
    heroImage: u('1507525428034-b723cf961d3e'),
    intro:
      'Da Nang is Vietnam’s most relaxed major beach city: a wide stretch of sand along My Khe, the Marble Mountains and Son Tra Peninsula on its edges, and a riverfront downtown lit up by the Dragon Bridge. It is well organized and easy to navigate, which makes it the most family-friendly first stop in central Vietnam.',
    sections: [
      {
        heading: 'Where to stay',
        body: [
          'Your neighborhood shapes the whole trip. Pick the area first, then the hotel.',
        ],
        bullets: [
          'My Khe Beach — best for a beach holiday: sand, sea-view rooms, family resorts',
          'Han River — best for city access: walkable to the Dragon Bridge, food, and nightlife',
          'City Center — convenient and well connected for short or business stays',
          'Son Tra / Resort Area — quieter, spread-out resorts for couples and families',
        ],
      },
      {
        heading: 'What to do',
        body: [
          'Da Nang rewards a mix of beach time and short trips. The city itself is calm; the highlights are a quick drive away.',
        ],
        bullets: [
          'Swim and relax along My Khe Beach',
          'See the Marble Mountains caves and viewpoints',
          'Drive the Son Tra Peninsula for the Lady Buddha and coastal views',
          'Watch the Dragon Bridge breathe fire on weekend nights',
          'Day-trip to Hoi An (≈25 minutes) and the Ba Na Hills Golden Bridge',
        ],
      },
      {
        heading: 'Getting around',
        body: [
          'Da Nang International Airport sits right in the city — most beachfront hotels are 10–15 minutes away. The beach road and riverfront are walkable; use Grab (ride-hailing) or taxis for the city, and book a car or tour for Hoi An, Ba Na Hills, and Hue.',
        ],
      },
    ],
    faqs: [
      {
        q: 'How many days do you need in Da Nang?',
        a: 'Three to four days is comfortable — enough for beach time plus day trips to Hoi An and the Marble Mountains or Ba Na Hills.',
      },
      {
        q: 'Is Da Nang good for families?',
        a: 'Yes. It is the most family-friendly base in central Vietnam, with calm beaches, resort pools, and short, easy day trips.',
      },
    ],
  },
  {
    slug: 'hoi-an-travel-guide',
    category: 'City guide',
    title: 'Hoi An travel guide: lanterns, tailors, and a UNESCO old town',
    excerpt:
      'Hoi An’s preserved Ancient Town glows with lanterns at night and is famous for tailoring, food, and a nearby beach — all 30 minutes from Da Nang.',
    readMins: 6,
    updated: '2026-06-08',
    emoji: '🏮',
    heroColor: 'from-orange-500 to-amber-500',
    heroImage: u('1578683010236-d716f9a3f461'),
    intro:
      'Hoi An is one of Vietnam’s most atmospheric towns: a car-free historic center of yellow merchant houses, wooden bridges, and thousands of silk lanterns that light up after dark. It is also a tailoring capital and a serious food town, with An Bang Beach a short cycle away. Most travelers pair it with Da Nang, 30 minutes north.',
    sections: [
      {
        heading: 'Where to stay',
        body: ['Decide between the buzz of the old town and the calm of the beach.'],
        bullets: [
          'Ancient Town — walk to the lanterns, cafés, and tailors at night',
          'An Bang Beach — quieter, with beach resorts and a slower pace',
          'Cam Thanh — rice paddies and boutique stays between the two',
        ],
      },
      {
        heading: 'What to do',
        body: ['Hoi An is best taken slowly — on foot and by bicycle.'],
        bullets: [
          'Wander the Ancient Town and cross the Japanese Covered Bridge',
          'See the lanterns and release a candle on the river after dark',
          'Order custom clothing from a reputable tailor (allow 1–2 days)',
          'Take a food tour — cao lau and white-rose dumplings are local specialties',
          'Cycle out to An Bang Beach or the Cam Thanh coconut palms',
        ],
      },
      {
        heading: 'Practical tips',
        body: [
          'The Ancient Town is most magical in the evening once the day-trip crowds thin and the lanterns come on. Daytime can be hot — plan indoor stops and cafés for the middle of the day, and save walking for early morning and night.',
        ],
      },
    ],
    faqs: [
      {
        q: 'How far is Hoi An from Da Nang?',
        a: 'About 30 minutes by car. Many travelers stay in one and day-trip to the other.',
      },
    ],
  },
  {
    slug: 'hanoi-travel-guide',
    category: 'City guide',
    title: 'Hanoi travel guide: the Old Quarter, lakes, and street food',
    excerpt:
      'Vietnam’s 1,000-year-old capital blends a buzzing Old Quarter, serene lakes, world-class street food, and French-colonial grandeur — the gateway to the north.',
    readMins: 7,
    updated: '2026-06-09',
    emoji: '🏛️',
    heroColor: 'from-rose-500 to-red-600',
    heroImage: u('1583417319070-4a69db38a482'),
    intro:
      'Hanoi is dense, historic, and endlessly atmospheric. The Old Quarter’s narrow lanes hum with motorbikes and sizzling sidewalk kitchens; a few blocks away, Hoan Kiem Lake and the tree-lined French Quarter slow everything down. It is also the gateway to northern Vietnam — Ha Long Bay, Sapa, and Ninh Binh are all reachable from here.',
    sections: [
      {
        heading: 'Where to stay',
        body: ['Pick your pace: lively and central, or calmer and leafy.'],
        bullets: [
          'Old Quarter — in the middle of the action, walkable to street food and sights',
          'Hoan Kiem / French Quarter — wider streets, colonial architecture, calmer nights',
          'West Lake (Tay Ho) — laid-back, with lake views and a café culture',
        ],
      },
      {
        heading: 'What to do',
        body: ['Balance the city’s intensity with its quieter corners.'],
        bullets: [
          'Walk the Old Quarter and circle Hoan Kiem Lake at dawn',
          'Eat your way through pho, bun cha, and egg coffee',
          'See the Temple of Literature and the Ho Chi Minh Mausoleum complex',
          'Catch the Train Street atmosphere (check current access rules locally)',
          'Use Hanoi as a base for Ha Long Bay, Ninh Binh, or Sapa',
        ],
      },
      {
        heading: 'Getting around',
        body: [
          'The Old Quarter is best on foot — traffic is dense and parking is scarce. Use Grab for longer hops. Crossing the street is an art: move at a steady, predictable pace and let the motorbikes flow around you.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Is Hanoi a good base for northern Vietnam?',
        a: 'Yes. Ha Long Bay, Ninh Binh, and Sapa are all popular trips from Hanoi, by road or overnight train.',
      },
    ],
  },
  {
    slug: 'nha-trang-travel-guide',
    category: 'City guide',
    title: 'Nha Trang travel guide: a beach bay with islands and big resort pools',
    excerpt:
      'A curving bay of turquoise water, offshore islands, and resort pools on Vietnam’s south-central coast — built for beach-and-pool holidays and island hopping.',
    readMins: 5,
    updated: '2026-06-09',
    emoji: '🐚',
    heroColor: 'from-cyan-500 to-blue-500',
    heroImage: u('1540541338287-41700207dee6'),
    intro:
      'Nha Trang is Vietnam’s classic beach-resort city: a long crescent of sand backed by a promenade, a string of islands offshore, and plenty of big pools. It is an easy, sun-focused stop — good for couples and travelers who want resort comfort with island day-trips on the side.',
    sections: [
      {
        heading: 'Where to stay',
        body: ['The beachfront is the main event; the north is quieter.'],
        bullets: [
          'Nha Trang Beach — central, walkable to the promenade and restaurants',
          'North Nha Trang — quieter resorts and bays away from the busy center',
        ],
      },
      {
        heading: 'What to do',
        body: ['Beach time first, then get out on the water.'],
        bullets: [
          'Relax on the main beach and promenade',
          'Take an island-hopping or snorkeling boat trip around the bay',
          'Visit the Po Nagar Cham Towers for history and views',
          'Try a mud-bath spa — a Nha Trang signature',
        ],
      },
    ],
    faqs: [
      {
        q: 'Is Nha Trang good for couples?',
        a: 'Yes — resort pools, beach dinners, and island trips make it an easy couples-and-relaxation destination.',
      },
    ],
  },
  {
    slug: 'phu-quoc-travel-guide',
    category: 'City guide',
    title: 'Phu Quoc travel guide: Vietnam’s tropical island escape',
    excerpt:
      'White-sand beaches, laid-back resorts, a long cable car, and sunset coasts — Phu Quoc is Vietnam’s easygoing island getaway, ideal for honeymoons and quiet trips.',
    readMins: 5,
    updated: '2026-06-09',
    emoji: '🌴',
    heroColor: 'from-teal-500 to-emerald-500',
    heroImage: u('1582719478250-c89cae4dc85b'),
    intro:
      'Phu Quoc is an island of quiet beaches and resort comfort off Vietnam’s southwest coast. It suits travelers who want to slow down: long stretches of sand, a famous cable car to the southern islands, and west-coast sunsets. It is an easy add-on to a southern Vietnam trip.',
    sections: [
      {
        heading: 'Where to stay',
        body: ['Beaches define the areas here.'],
        bullets: [
          'Long Beach (Bai Truong) — the main west-coast strip, sunsets and resorts',
          'Sao Beach and the south — quieter white sand and the Hon Thom cable car',
        ],
      },
      {
        heading: 'What to do',
        body: ['Mix beach days with a couple of island highlights.'],
        bullets: [
          'Relax on Long Beach or the quieter Sao Beach',
          'Ride the Hon Thom cable car — one of the world’s longest sea crossings',
          'Catch the sunset on the west coast',
          'Snorkel or island-hop in the An Thoi archipelago',
        ],
      },
    ],
    faqs: [
      {
        q: 'Is Phu Quoc good for a honeymoon?',
        a: 'Yes. Quiet beaches, resort spas, and sunset coasts make it a popular honeymoon and slow-getaway choice.',
      },
    ],
  },
  {
    slug: 'best-time-to-visit-vietnam',
    category: 'Planning',
    title: 'The best time to visit Vietnam, region by region',
    excerpt:
      'Vietnam stretches over 1,600 km, so there is no single best season. Here is how the north, center, and south differ — and how to time a multi-region trip.',
    readMins: 6,
    updated: '2026-06-11',
    emoji: '🗓️',
    heroColor: 'from-amber-500 to-orange-500',
    heroImage: u('1528127269322-539801943592'),
    intro:
      'Because Vietnam is long and narrow, its three regions have different climates at the same time of year. Choosing when to go means deciding which region matters most for your trip — or timing a route to catch each at its best.',
    sections: [
      {
        heading: 'North (Hanoi, Ha Long, Sapa)',
        body: [
          'The north has four seasons. Spring (March–April) and autumn (September–November) are the most comfortable, with mild, dry weather. Winter can be cool and misty; summer is hot and humid with the heaviest rain.',
        ],
      },
      {
        heading: 'Center (Da Nang, Hoi An, Hue)',
        body: [
          'Central Vietnam is at its best from roughly February to August, with dry, beach-friendly weather. The wettest months are October and November, when storms can reach the coast — worth checking if a beach trip is the priority.',
        ],
      },
      {
        heading: 'South (Ho Chi Minh City, Phu Quoc, Mekong)',
        body: [
          'The south is warm year-round with two seasons: dry (roughly December–April) and wet (May–November). The wet season brings short, heavy afternoon downpours rather than all-day rain, so travel is still very doable.',
        ],
      },
      {
        heading: 'Timing a multi-region trip',
        body: [
          'If you want all three regions in good weather, late winter to early spring (around February–April) is the most reliable window overall. Whatever you choose, build in flexibility — and always confirm a hotel’s cancellation policy in case weather shifts your plans.',
        ],
      },
    ],
    faqs: [
      {
        q: 'When is the overall best time to visit Vietnam?',
        a: 'February to April is the most reliable window if you want decent weather across the north, center, and south on one trip.',
      },
    ],
  },
]

export const getGuide = (slug: string) => guides.find((g) => g.slug === slug)
export const guidesByCategory = (category: GuideCategory) => guides.filter((g) => g.category === category)
