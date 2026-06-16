import { PrismaClient } from '@prisma/client'
import type { Hotel, Destination } from '../../src/types'

export const prisma = new PrismaClient()

const P = (s: string) => JSON.parse(s)

/** Prisma City row (+ name) → API Destination shape. */
export function toDestination(r: {
  name: string; slug: string; available: boolean; shortDescription: string; description: string
  recommendedTraveler: string; bestForJson: string; highlightsJson: string; heroColor: string; emoji: string; hotelCount: number
}): Destination {
  return {
    city: r.name as Destination['city'],
    slug: r.slug,
    available: r.available,
    shortDescription: r.shortDescription,
    description: r.description,
    bestFor: P(r.bestForJson),
    recommendedTraveler: r.recommendedTraveler,
    heroColor: r.heroColor,
    emoji: r.emoji,
    highlights: P(r.highlightsJson),
    hotelCount: r.hotelCount,
  }
}

/** Prisma Hotel row (with `city` included) → API Hotel shape. */
export function toHotel(r: Record<string, unknown> & { city?: { name: string } }): Hotel {
  const g = (k: string) => r[k] as string
  return {
    id: g('id'),
    slug: g('slug'),
    name: g('name'),
    city: (r.city?.name ?? '') as Hotel['city'],
    area: g('area') as Hotel['area'],
    hotelType: g('hotelType') as Hotel['hotelType'],
    priceTier: g('priceTier') as Hotel['priceTier'],
    shortDescription: g('shortDescription'),
    positioningLine: g('positioningLine'),
    bestFor: P(g('bestForJson')),
    notIdealFor: P(g('notIdealForJson')),
    mainReason: g('mainReason'),
    thingsToCheck: P(g('thingsToCheckJson')),
    tags: P(g('tagsJson')),
    facilities: P(g('facilitiesJson')),
    officialBenefits: P(g('officialBenefitsJson')),
    roomGuide: P(g('roomGuideJson')),
    locationGuide: P(g('locationGuideJson')),
    cancellationChecklist: P(g('cancellationListJson')),
    imageUrl: g('imageUrl'),
    officialWebsiteUrl: g('officialWebsiteUrl'),
    isSponsored: r.isSponsored as boolean,
    similarHotelSlugs: P(g('similarSlugsJson')),
    heroColor: g('heroColor'),
    emoji: g('emoji'),
    koreanFriendly: r.koreanFriendly as boolean,
  }
}
