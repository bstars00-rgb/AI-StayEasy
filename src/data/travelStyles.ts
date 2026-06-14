import type { TravelStyleGuide } from '../types'

/** Used by the discovery block and the Vietnam "travel style guide" section. */
export const travelStyles: TravelStyleGuide[] = [
  {
    style: 'Family trip',
    emoji: '👨‍👩‍👧‍👦',
    summary: 'Space, a safe pool, and easy food matter most. Look for kids facilities and connecting rooms.',
    lookFor: ['Kids pool / kids club', 'Family or connecting rooms', 'Breakfast included', 'Near the beach'],
  },
  {
    style: 'Business trip',
    emoji: '💼',
    summary: 'A central, efficient base with fast Wi-Fi, a desk, and flexible check-in beats resort frills.',
    lookFor: ['Central location', 'Fast Wi-Fi & desk', 'Early check-in / late checkout', 'VAT invoice'],
  },
  {
    style: 'Beach vacation',
    emoji: '🏖️',
    summary: 'Prioritize beachfront or one-block-back access and a good pool to switch between sand and shade.',
    lookFor: ['Beachfront or near beach', 'Good pool', 'Sea-view rooms', 'Beach loungers'],
  },
  {
    style: 'Long stay',
    emoji: '🧳',
    summary: 'Kitchens, laundry, and weekly rates make extended stays comfortable and affordable.',
    lookFor: ['Kitchen & laundry', 'Weekly/monthly rates', 'Co-working or desk', 'Supermarket nearby'],
  },
  {
    style: 'First-time Vietnam trip',
    emoji: '🧭',
    summary: 'Ease and familiarity reduce stress — central or beachside, English/Korean support, airport transfer.',
    lookFor: ['Easy location', 'English / Korean-friendly staff', 'Airport transfer', 'Clear cancellation policy'],
  },
]
