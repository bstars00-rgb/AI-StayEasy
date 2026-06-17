/**
 * Resolves a working link to a hotel's official website.
 *
 * The sample catalogue uses placeholder `.example` URLs, which are dead links.
 * Rather than render a broken outbound link (bad for users, SEO, and ad-network
 * review), we fall back to a web search for the hotel — a real, useful page that
 * helps the traveler find and book on the genuine official site.
 *
 * Real registered partners with a true URL are linked directly.
 */
export interface OfficialLinkInput {
  officialWebsiteUrl?: string
  name: string
  city: string
}

export function isPlaceholderUrl(url?: string): boolean {
  return !url || url.includes('.example') || url === 'https://example.com'
}

export function officialLink(hotel: OfficialLinkInput): string {
  if (!isPlaceholderUrl(hotel.officialWebsiteUrl)) return hotel.officialWebsiteUrl as string
  const q = encodeURIComponent(`${hotel.name} ${hotel.city} hotel official website`)
  return `https://www.google.com/search?q=${q}`
}
