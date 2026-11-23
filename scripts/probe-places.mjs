// Coverage probe: does Google return an AI review summary for these hotels?
//
//   GOOGLE_PLACES_API_KEY=... node scripts/probe-places.mjs "Olalani Resort Da Nang" "Amiana Resort Nha Trang"
//
// Run this BEFORE building anything on Google review summaries: Google's docs
// list the regions and place types where AI summaries exist, and Vietnam hotels
// are not clearly among them. Each hotel costs two or three Places calls.
// It prints what Google answers and stores NOTHING (Google's policy forbids
// storing Places content). A place ID found here must still be matched to the
// hotel by a person before it goes into src/data/placeIds.ts.
const key = process.env.GOOGLE_PLACES_API_KEY
const queries = process.argv.slice(2)
if (!key || queries.length === 0) {
  console.error('Usage: GOOGLE_PLACES_API_KEY=... node scripts/probe-places.mjs "<hotel name city>" [...]')
  process.exit(1)
}

const call = async (url, init) => {
  const res = await fetch(url, init)
  const body = await res.json().catch(() => ({}))
  return { ok: res.ok, status: res.status, body }
}

for (const q of queries) {
  console.log(`\n== ${q}`)
  const search = await call('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'X-Goog-Api-Key': key,
      'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress',
    },
    body: JSON.stringify({ textQuery: q, maxResultCount: 3 }),
  })
  if (!search.ok) {
    console.log(`search failed: HTTP ${search.status} ${search.body?.error?.message ?? ''}`)
    continue
  }
  const places = search.body.places ?? []
  if (places.length === 0) {
    console.log('no place found')
    continue
  }
  places.forEach((p, i) => console.log(`  candidate ${i + 1}: ${p.displayName?.text} - ${p.formattedAddress} [${p.id}]`))

  for (const lang of ['en', 'ko']) {
    const d = await call(`https://places.googleapis.com/v1/places/${places[0].id}?languageCode=${lang}`, {
      headers: { 'X-Goog-Api-Key': key, 'X-Goog-FieldMask': 'reviewSummary' },
    })
    if (!d.ok) {
      console.log(`  [${lang}] details failed: HTTP ${d.status} ${d.body?.error?.message ?? ''}`)
      continue
    }
    const rs = d.body.reviewSummary
    console.log(
      rs?.text?.text
        ? `  [${lang}] SUMMARY PRESENT (${rs.text.text.length} chars), disclosure: ${rs.disclosureText?.text ?? 'none'}`
        : `  [${lang}] no review summary returned`,
    )
  }
}
