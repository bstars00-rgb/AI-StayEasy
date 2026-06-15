/** Maps free-text facility / benefit labels to an emoji icon, with a sensible default. */
const ICONS: Record<string, string> = {
  pool: '🏊',
  breakfast: '🍳',
  beachfront: '🏖️',
  'kids club': '🧸',
  'kids-friendly': '🧒',
  'korean-friendly': '🇰🇷',
  spa: '💆',
  gym: '🏋️',
  'airport transfer': '🚐',
  restaurant: '🍽️',
  bar: '🍸',
  parking: '🅿️',
  'free wi-fi': '📶',
  kitchen: '🍴',
}

export function facilityIcon(label: string): string {
  return ICONS[label.toLowerCase()] ?? '✓'
}
