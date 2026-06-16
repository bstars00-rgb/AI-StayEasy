import { PrismaClient } from '@prisma/client'
import { hotels } from '../../src/data/hotels'
import { destinations } from '../../src/data/destinations'

const prisma = new PrismaClient()
const J = (v: unknown) => JSON.stringify(v)

async function main() {
  await prisma.hotel.deleteMany()
  await prisma.city.deleteMany()

  const cityIdByName = new Map<string, string>()
  for (const d of destinations) {
    cityIdByName.set(d.city, d.slug)
    await prisma.city.create({
      data: {
        id: d.slug,
        slug: d.slug,
        name: d.city,
        available: d.available,
        heroColor: d.heroColor,
        emoji: d.emoji,
        shortDescription: d.shortDescription,
        description: d.description,
        recommendedTraveler: d.recommendedTraveler,
        bestForJson: J(d.bestFor),
        highlightsJson: J(d.highlights),
        hotelCount: d.hotelCount,
      },
    })
  }

  for (const h of hotels) {
    const cityId = cityIdByName.get(h.city)
    if (!cityId) throw new Error(`No city row for "${h.city}" (hotel ${h.id})`)
    await prisma.hotel.create({
      data: {
        id: h.id,
        slug: h.slug,
        name: h.name,
        area: h.area,
        hotelType: h.hotelType,
        priceTier: h.priceTier,
        isSponsored: h.isSponsored,
        koreanFriendly: h.koreanFriendly,
        officialWebsiteUrl: h.officialWebsiteUrl,
        imageUrl: h.imageUrl,
        heroColor: h.heroColor,
        emoji: h.emoji,
        shortDescription: h.shortDescription,
        positioningLine: h.positioningLine,
        mainReason: h.mainReason,
        bestForJson: J(h.bestFor),
        notIdealForJson: J(h.notIdealFor),
        thingsToCheckJson: J(h.thingsToCheck),
        officialBenefitsJson: J(h.officialBenefits),
        cancellationListJson: J(h.cancellationChecklist),
        tagsJson: J(h.tags),
        facilitiesJson: J(h.facilities),
        similarSlugsJson: J(h.similarHotelSlugs),
        roomGuideJson: J(h.roomGuide),
        locationGuideJson: J(h.locationGuide),
        cityId,
      },
    })
  }

  console.log(`Seeded ${destinations.length} cities and ${hotels.length} hotels.`)
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
