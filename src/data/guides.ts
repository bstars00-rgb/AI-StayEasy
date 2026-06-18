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
  {
    slug: 'ho-chi-minh-city-guide',
    category: 'City guide',
    title: 'Ho Chi Minh City travel guide: energy, history, and street food',
    excerpt:
      'Vietnam’s largest city blends French-colonial landmarks, rooftop bars, war history, and legendary street food — the gateway to the south and the Mekong Delta.',
    readMins: 6,
    updated: '2026-06-13',
    emoji: '🌆',
    heroColor: 'from-amber-500 to-orange-500',
    heroImage: u('1555921015-5532091f6026'),
    intro:
      'Ho Chi Minh City (still widely called Saigon) is fast, hot, and full of energy. District 1 packs the landmarks, markets, and rooftops; leafy Thao Dien draws expats and brunch spots; and the city is the natural base for a Mekong Delta day trip. It rewards travelers who lean into the pace — and the food.',
    sections: [
      {
        heading: 'Where to stay',
        body: ['Choose between the central buzz and quieter riverside calm.'],
        bullets: [
          'District 1 — central, walkable to landmarks, markets, and rooftop bars',
          'Thao Dien (District 2) — leafy, relaxed, café and brunch culture',
          'Airport Area — convenient for early flights and short layovers',
        ],
      },
      {
        heading: 'What to do',
        body: ['Mix history, markets, and food, then escape to the delta.'],
        bullets: [
          'Visit the War Remnants Museum and the Reunification Palace',
          'See Notre-Dame Cathedral and the Central Post Office',
          'Shop and snack at Ben Thanh Market',
          'Take a sunset rooftop drink over the skyline',
          'Day-trip to the Mekong Delta or the Cu Chi Tunnels',
        ],
      },
    ],
    faqs: [
      {
        q: 'How many days do you need in Ho Chi Minh City?',
        a: 'Two to three days covers the main sights and food, plus a Mekong Delta or Cu Chi Tunnels day trip.',
      },
    ],
  },
  {
    slug: 'da-lat-travel-guide',
    category: 'City guide',
    title: 'Da Lat travel guide: cool highlands, pine forests, and coffee',
    excerpt:
      'A cool-climate mountain town of pine forests, flower farms, waterfalls, and Vietnam’s coffee heartland — a romantic break from the coastal heat.',
    readMins: 5,
    updated: '2026-06-13',
    emoji: '🌲',
    heroColor: 'from-emerald-600 to-green-700',
    heroImage: u('1504457047772-27faf1c00561'),
    intro:
      'Da Lat sits in the Central Highlands at around 1,500 m, giving it a spring-like climate year-round. It is a change of pace from Vietnam’s beaches: French-era villas, flower gardens, lakes, waterfalls, and coffee plantations, with cooler evenings that call for a light jacket.',
    sections: [
      {
        heading: 'What to do',
        body: ['Da Lat suits slow, scenic days and a bit of adventure.'],
        bullets: [
          'Stroll the flower gardens and around Xuan Huong Lake',
          'Visit a coffee farm — this is Vietnam’s coffee country',
          'Chase waterfalls like Datanla (with a fun alpine coaster)',
          'Try canyoning for an adrenaline day out',
        ],
      },
      {
        heading: 'Good to know',
        body: [
          'Evenings are genuinely cool, so pack a layer even in summer. Da Lat is a popular weekend escape for Vietnamese travelers, so book ahead around holidays and weekends.',
        ],
      },
    ],
  },
  {
    slug: 'sapa-travel-guide',
    category: 'City guide',
    title: 'Sapa travel guide: rice terraces, hill tribes, and Fansipan',
    excerpt:
      'Misty northern highlands of dramatic rice terraces, ethnic-minority villages, and Mount Fansipan — Indochina’s highest peak — best explored on foot.',
    readMins: 5,
    updated: '2026-06-13',
    emoji: '🏔️',
    heroColor: 'from-green-600 to-lime-600',
    heroImage: u('1573790387438-4da905039392'),
    intro:
      'Sapa, in Vietnam’s far north, is famous for its sculpted rice terraces and the culture of the Hmong, Dao, and other ethnic-minority communities. It is a trekking and homestay destination, with a cable car and railway running up Fansipan, the highest mountain in Indochina.',
    sections: [
      {
        heading: 'What to do',
        body: ['Sapa is best on foot, valley to valley.'],
        bullets: [
          'Trek between terraced villages like Cat Cat, Lao Chai, and Ta Van',
          'Stay in a local homestay for the views and the welcome',
          'Take the cable car up Fansipan for the summit panorama',
          'Time a visit around a colorful local market day',
        ],
      },
      {
        heading: 'When to go',
        body: [
          'September to November brings golden, ready-to-harvest terraces and clearer skies; spring is green and mild. Winter can be cold and misty — atmospheric, but pack warm layers.',
        ],
      },
    ],
  },
  {
    slug: 'ha-long-bay-travel-guide',
    category: 'City guide',
    title: 'Ha Long Bay travel guide: cruising a UNESCO seascape',
    excerpt:
      'Thousands of limestone karsts rising from emerald water — Ha Long Bay is best experienced on an overnight cruise, with kayaking, caves, and sunrise on deck.',
    readMins: 5,
    updated: '2026-06-13',
    emoji: '⛰️',
    heroColor: 'from-emerald-500 to-teal-600',
    heroImage: u('1559592413-7cec4d0cae2b'),
    intro:
      'Ha Long Bay is one of Vietnam’s signature sights: a vast seascape of forested limestone islands and quiet lagoons. The classic way to see it is an overnight cruise from the Hanoi area, trading day-trip crowds for a calm night anchored among the karsts.',
    sections: [
      {
        heading: 'Choosing a cruise',
        body: ['The cruise makes or breaks the trip — choose deliberately.'],
        bullets: [
          'One night suits most travelers; two nights reaches quieter areas like Lan Ha Bay',
          'Compare exactly what is included: meals, kayaking, cave visits, transfers',
          'Read recent reviews — boat quality and routes vary widely',
        ],
      },
      {
        heading: 'What to do on board',
        body: [
          'Expect kayaking or bamboo-boat rides through lagoons, a visit to a cave such as Sung Sot, swimming stops in warmer months, and an early start for sunrise and tai chi on deck.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Is Ha Long Bay a day trip or an overnight?',
        a: 'Both exist, but an overnight cruise is far more rewarding — you see the bay at its calmest, after the day boats leave.',
      },
    ],
  },
  {
    slug: 'first-time-vietnam',
    category: 'Planning',
    title: 'First time in Vietnam? Start here',
    excerpt:
      'A practical orientation for a first trip: how to split your time between north, center, and south, plus the basics of money, transport, and getting around.',
    readMins: 6,
    updated: '2026-06-14',
    emoji: '🧭',
    heroColor: 'from-sky-500 to-brand-500',
    heroImage: u('1488646953014-85cb44e25828'),
    intro:
      'Vietnam is long and varied, so a first trip is really about choosing a route. Most first-timers pick two or three regions rather than trying to see everything. Here is how to think about it, plus the practical basics that make the trip smoother.',
    sections: [
      {
        heading: 'Pick a route, not a checklist',
        body: ['A classic first itinerary links a few anchors:'],
        bullets: [
          'North: Hanoi + Ha Long Bay (and optionally Sapa or Ninh Binh)',
          'Center: Da Nang + Hoi An (easy beaches and old-town charm)',
          'South: Ho Chi Minh City + the Mekong Delta (and Phu Quoc to relax)',
          'Ten days comfortably covers two regions; two weeks covers all three',
        ],
      },
      {
        heading: 'Practical basics',
        body: ['A few things smooth out a first visit.'],
        bullets: [
          'Domestic flights save long overland hauls between regions',
          'Use Grab (ride-hailing) in cities for fair, cashless fares',
          'Carry some cash; cards work in hotels and bigger venues',
          'Check current visa/e-visa rules for your nationality before you fly',
        ],
      },
    ],
    faqs: [
      {
        q: 'How long should a first trip to Vietnam be?',
        a: 'Ten days lets you do two regions well; two weeks is ideal for north, center, and south without rushing.',
      },
    ],
  },
  {
    slug: 'family-travel-vietnam',
    category: 'Planning',
    title: 'Family travel in Vietnam: where to go with kids',
    excerpt:
      'Vietnam is a rewarding family destination — calm beaches, easy day trips, and family-friendly resorts. Here’s how to plan a trip that works for all ages.',
    readMins: 5,
    updated: '2026-06-14',
    emoji: '👨‍👩‍👧',
    heroColor: 'from-cyan-500 to-blue-500',
    heroImage: u('1528181304800-259b08848526'),
    intro:
      'With calm beaches, short flights between regions, and warm hospitality, Vietnam suits families well. The key is pacing: pair a resort base with a couple of easy excursions, rather than constant moving.',
    sections: [
      {
        heading: 'Best bases for families',
        body: ['Choose a relaxed base with pools and space to roam.'],
        bullets: [
          'Da Nang — wide beaches, family resorts, and a short hop to Hoi An',
          'Phu Quoc — quiet island beaches and resort pools',
          'Nha Trang — beach promenade plus island boat trips',
        ],
      },
      {
        heading: 'Tips that help',
        body: [
          'Book rooms with a pool and confirm the child and extra-bed policy before you pay. Plan activities for the cooler morning and late afternoon, and keep midday for the pool. Direct booking can make it easier to request connecting rooms or a crib.',
        ],
      },
    ],
  },
  {
    slug: 'honeymoon-vietnam',
    category: 'Planning',
    title: 'A Vietnam honeymoon: quiet beaches and romantic escapes',
    excerpt:
      'From lantern-lit Hoi An to the quiet islands of Phu Quoc and Con Dao, Vietnam offers romantic, good-value honeymoons. Here’s how to plan one.',
    readMins: 5,
    updated: '2026-06-14',
    emoji: '💑',
    heroColor: 'from-rose-500 to-red-600',
    heroImage: u('1540611025311-01df3cef54b5'),
    intro:
      'Vietnam is an underrated honeymoon destination: atmospheric old towns, quiet island resorts, and excellent value for the level of comfort. A good honeymoon route balances a romantic town with a slow beach finish.',
    sections: [
      {
        heading: 'Romantic anchors',
        body: ['Pair charm with calm.'],
        bullets: [
          'Hoi An — lantern-lit evenings, tailoring, and riverside dinners',
          'Phu Quoc — sunset coasts, spas, and quiet beaches',
          'Con Dao — remote, pristine, and wonderfully secluded',
          'Da Lat — a cool-climate, pine-scented mountain detour',
        ],
      },
      {
        heading: 'Make it special',
        body: [
          'Booking direct is often the best way to flag that it’s a honeymoon — hotels can sometimes arrange a room upgrade, late checkout, or a small in-room surprise for direct guests. Always confirm any promised perk on your reservation before arrival.',
        ],
      },
    ],
  },
  {
    slug: 'vietnam-on-a-budget',
    category: 'Planning',
    title: 'Vietnam on a budget: how to travel well for less',
    excerpt:
      'Vietnam is already affordable — and a few habits stretch your money further without cutting the experience. Food, transport, and booking tips that add up.',
    readMins: 5,
    updated: '2026-06-14',
    emoji: '💸',
    heroColor: 'from-lime-500 to-green-600',
    heroImage: u('1517824806704-9040b037703b'),
    intro:
      'Vietnam offers some of the best value in Southeast Asia. You do not need to rough it to travel cheaply here — a few smart choices around food, transport, and booking keep costs low while keeping the trip comfortable.',
    sections: [
      {
        heading: 'Where the savings are',
        body: ['Small habits add up over a trip.'],
        bullets: [
          'Eat where locals eat — street food and small eateries are cheap and excellent',
          'Use Grab and shared transport instead of private cars',
          'Travel between regions by overnight train or budget flights booked early',
          'Shoulder season brings lower room rates and thinner crowds',
        ],
      },
      {
        heading: 'Booking smart',
        body: [
          'Compare the total price including taxes on the hotel’s official site and OTAs before you commit. Direct rates sometimes include breakfast or flexible cancellation that a slightly cheaper non-refundable OTA rate does not — which can be the better deal overall.',
        ],
      },
    ],
  },
  {
    slug: 'hue-travel-guide',
    category: 'City guide',
    title: 'Hue travel guide: Vietnam’s imperial heritage city',
    excerpt:
      'The former imperial capital — a riverside Citadel, royal tombs along the Perfume River, and a refined court cuisine. An easy heritage add-on to Da Nang and Hoi An.',
    readMins: 5,
    updated: '2026-06-15',
    emoji: '👑',
    heroColor: 'from-amber-600 to-yellow-600',
    heroImage: u('1526481280693-3bfa7568e0f3'),
    intro:
      'Hue was the seat of the Nguyen dynasty, and it still feels stately: a walled Imperial Citadel on the Perfume River, royal tombs set in gardens outside town, and a distinctive court cuisine. It pairs naturally with central Vietnam — about 2.5 hours north of Da Nang over the scenic Hai Van Pass.',
    sections: [
      {
        heading: 'What to see',
        body: ['Hue rewards a slow day or two of history and food.'],
        bullets: [
          'Explore the Imperial Citadel and the Forbidden Purple City',
          'Visit the royal tombs (Minh Mang, Tu Duc, Khai Dinh) by car or boat',
          'Take a dragon-boat trip on the Perfume River to Thien Mu Pagoda',
          'Try Hue specialties — bun bo Hue, banh khoai, and royal-style dishes',
        ],
      },
      {
        heading: 'Getting there',
        body: [
          'The drive from Da Nang over the Hai Van Pass is one of Vietnam’s great coastal roads — consider a private car or the train for the views. Many travelers do Hue as an overnight from Da Nang or Hoi An rather than a base.',
        ],
      },
    ],
  },
  {
    slug: 'quy-nhon-travel-guide',
    category: 'City guide',
    title: 'Quy Nhon travel guide: quiet beaches off the trail',
    excerpt:
      'An up-and-coming central-coast city with clean beaches, scenic Ky Co and Eo Gio, ancient Cham towers, and superb-value seafood — far less crowded than its neighbors.',
    readMins: 4,
    updated: '2026-06-15',
    emoji: '🐟',
    heroColor: 'from-cyan-500 to-teal-600',
    heroImage: u('1540541338287-41700207dee6'),
    intro:
      'Quy Nhon is what Nha Trang was twenty years ago: a relaxed coastal city with long beaches, dramatic coves, and excellent seafood, but without the crowds. It suits travelers who want the beach without the resort strip.',
    sections: [
      {
        heading: 'What to do',
        body: ['Beach days plus a couple of scenic half-day trips.'],
        bullets: [
          'Swim and relax along the city beach and promenade',
          'Boat to Ky Co beach and the cliffs of Eo Gio',
          'See the ancient Cham towers (Banh It) above town',
          'Eat your way through some of Vietnam’s best-value seafood',
        ],
      },
      {
        heading: 'Good to know',
        body: [
          'Quy Nhon is spread along the coast, so a base near the city beach keeps you close to restaurants while the best coves are a short boat or car ride away. It’s quietest mid-week and outside Vietnamese holidays.',
        ],
      },
    ],
  },
  {
    slug: 'mui-ne-travel-guide',
    category: 'City guide',
    title: 'Mui Ne travel guide: sand dunes and kitesurfing',
    excerpt:
      'A breezy beach town with red-and-white sand dunes, the Fairy Stream, and some of Asia’s best kitesurfing — an easy escape from Ho Chi Minh City.',
    readMins: 4,
    updated: '2026-06-15',
    emoji: '🏜️',
    heroColor: 'from-orange-500 to-rose-500',
    heroImage: u('1503764654157-72d979d9af2f'),
    intro:
      'Mui Ne pairs a long, windswept beach with surreal sand dunes and a strong watersports scene. It’s the closest dunes-and-kite destination to Ho Chi Minh City, and a favorite for an active beach break.',
    sections: [
      {
        heading: 'What to do',
        body: ['Wind and sand define the days here.'],
        bullets: [
          'Catch sunrise over the white sand dunes; slide the red dunes at sunset',
          'Walk the Fairy Stream through orange canyons',
          'Try kitesurfing or windsurfing — Mui Ne is a regional hub',
          'Visit the fishing village and harbor at dawn',
        ],
      },
      {
        heading: 'When to go',
        body: [
          'The kitesurfing season runs roughly November to April, when the wind is reliable and the skies are dry. It’s about a 4–5 hour drive or a short flight-plus-transfer from Ho Chi Minh City, so most travelers come for two or three nights.',
        ],
      },
    ],
  },
  {
    slug: 'vietnam-street-food',
    category: 'Planning',
    title: 'A traveler’s guide to Vietnamese street food',
    excerpt:
      'Pho, banh mi, bun cha, and the rest — what to order, how to eat safely, and how regional dishes differ from north to south.',
    readMins: 5,
    updated: '2026-06-16',
    emoji: '🍜',
    heroColor: 'from-amber-500 to-orange-500',
    heroImage: u('1559314809-0d155014e29e'),
    intro:
      'Street food is one of the best reasons to visit Vietnam — fresh, cheap, and deeply regional. A little orientation goes a long way toward eating well and eating safely.',
    sections: [
      {
        heading: 'Dishes to seek out',
        body: ['Start with the classics, then follow the regional specialties.'],
        bullets: [
          'Pho — the iconic noodle soup, best at breakfast',
          'Banh mi — a French-Vietnamese baguette sandwich',
          'Bun cha — grilled pork with noodles, a Hanoi favorite',
          'Cao lau and white-rose dumplings — Hoi An specialties',
          'Vietnamese coffee — try it iced with condensed milk, or egg coffee in Hanoi',
        ],
      },
      {
        heading: 'Eat well, eat safely',
        body: [
          'Busy stalls with high turnover are your friend — fresh food and a local crowd are good signs. Eat food that’s cooked to order and served hot, be a little cautious with ice and raw herbs if your stomach is sensitive, and carry small cash. When in doubt, follow the queue.',
        ],
      },
    ],
  },
  {
    slug: 'getting-around-vietnam',
    category: 'Planning',
    title: 'Getting around Vietnam: flights, trains, and ride-hailing',
    excerpt:
      'How to move between regions and around cities — when to fly, when to take the train, and how to use Grab without the hassle.',
    readMins: 5,
    updated: '2026-06-16',
    emoji: '🚆',
    heroColor: 'from-sky-500 to-brand-500',
    heroImage: u('1512058564366-18510be2db19'),
    intro:
      'Vietnam is long, so getting around is mostly about choosing between flights, trains, and road transport for the big hops — and ride-hailing for the cities. Here’s how the options compare.',
    sections: [
      {
        heading: 'Between regions',
        body: ['Match the mode to the distance and the experience you want.'],
        bullets: [
          'Domestic flights — fastest for north↔south (e.g. Hanoi↔HCMC); book early',
          'Trains — scenic and comfortable for shorter legs like Da Nang↔Hue',
          'Sleeper buses — cheapest, but slower and less comfortable',
        ],
      },
      {
        heading: 'Around cities',
        body: [
          'Use Grab (ride-hailing) for cars and motorbike taxis — fares are set in-app, so there’s no haggling and no language barrier. In old quarters, walking is often faster than driving. Cross busy streets at a slow, steady, predictable pace and let the motorbikes flow around you.',
        ],
      },
    ],
  },
]

export const getGuide = (slug: string) => guides.find((g) => g.slug === slug)
export const guidesByCategory = (category: GuideCategory) => guides.filter((g) => g.category === category)
