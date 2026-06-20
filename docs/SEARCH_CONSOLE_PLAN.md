# Google Search Console → Partner portal ("How travelers find you on Google")

Each hotel partner sees, in their portal, the **Google search terms** that surface
their StayEasy page — impressions, clicks, CTR, average position. This is per-hotel
Search Console data, scoped to that hotel's page only.

## Status

| Piece | State |
| --- | --- |
| Hotel pages return 200 & are indexable | ✅ `scripts/gen-static-routes.mjs` (flat `.html` per route) |
| Site verified in Search Console | ✅ `<meta name="google-site-verification">` in `index.html` |
| API contract | ✅ `endpoints.partnerSearchInsights(slug)`, `PartnerSearchInsightsResponse` in `src/api/contract.ts` |
| Portal panel | ✅ `src/components/SearchInsightsPanel.tsx` (mock data via `src/lib/searchInsights.ts`) |
| Live Search Console data | ⏳ needs backend + service account (below) |

The frontend already switches mock → live automatically when `VITE_API_URL` is set:
`getSearchInsights()` calls `GET {VITE_API_URL}/api/v1/partner/search-insights/:slug`.

## Backend implementation (server/, when the service account key is ready)

1. **Service account** (one-time): create in Google Cloud, enable the **Search Console API**,
   download the JSON key. Add the service-account email as a **user** of the Search Console
   property (Settings → Users and permissions). The key is a **secret** — store it as a
   Render secret / env, never in git.

2. **Endpoint** `GET /api/v1/partner/search-insights/:slug` (auth: the partner owns `:slug`):
   - Build the hotel page URL: `https://bstars00-rgb.github.io/AI-StayEasy/hotels/<slug>`.
   - Call Search Console Search Analytics:
     `POST https://searchconsole.googleapis.com/webmasters/v3/sites/{siteUrl}/searchAnalytics/query`
     body:
     ```json
     {
       "startDate": "<today-28d>", "endDate": "<today>",
       "dimensions": ["query"],
       "dimensionFilterGroups": [{ "filters": [
         { "dimension": "page", "operator": "equals",
           "expression": "https://bstars00-rgb.github.io/AI-StayEasy/hotels/<slug>" }
       ]}],
       "rowLimit": 10
     }
     ```
     (`siteUrl` is the URL-prefix property, URL-encoded:
     `https://bstars00-rgb.github.io/AI-StayEasy/`.)
   - Map rows → `PartnerSearchInsightsResponse` (totals + topQueries), set `source: 'search-console'`.
   - Auth: `google-auth-library` JWT from the service-account key, scope
     `https://www.googleapis.com/auth/webmasters.readonly`.

3. **Deploy** server/ on Render (`render.yaml` exists). Set `VITE_API_URL` on the web build to
   the Render URL so the portal calls the live endpoint.

## Notes / caveats

- **Data lag**: Search Console only has data from the verification date forward, and per-page
  query data takes days–weeks to accumulate. The panel shows demo data until then.
- **Hash vs path**: indexing relies on the path-based URLs (`/hotels/<slug>`), which is why the
  pre-render step (200, no soft-404) is a hard prerequisite — done.
- Could later add Search Console **property-level** trends and a sitemap submission step.
