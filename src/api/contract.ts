/**
 * Shared API contract for StayEasy Vietnam.
 *
 * This is the single source of truth for the REST API shape, consumed by the
 * web app, the (future) mobile app, and the (future) backend. The app currently
 * runs on bundled mock data; swapping to a real API means implementing these
 * endpoints and pointing a data adapter at them — the types don't change.
 *
 * See docs/BACKEND_PLAN.md for the architecture behind these contracts.
 */
import type { Hotel, Destination, Area, TravelStyle } from '../types'
import type { Lang } from '../i18n'
import type { Recommendation } from '../lib/searchEngine'
import type { Partner, Campaign, Inquiry } from '../data/adminData'

export const API_VERSION = 'v1'
export const API_BASE = `/api/${API_VERSION}`

/** Endpoint path builders (keep in sync with the backend router). */
export const endpoints = {
  cities: () => `${API_BASE}/cities`,
  city: (slug: string) => `${API_BASE}/cities/${slug}`,
  cityHotels: (slug: string) => `${API_BASE}/cities/${slug}/hotels`,
  hotel: (slug: string) => `${API_BASE}/hotels/${slug}`,
  recommend: () => `${API_BASE}/recommend`,
  track: () => `${API_BASE}/track`,
  inquiries: () => `${API_BASE}/inquiries`,
  // partner
  partnerMe: () => `${API_BASE}/partner/me`,
  partnerMetrics: () => `${API_BASE}/partner/metrics`,
  partnerHotel: () => `${API_BASE}/partner/hotel`,
  /** Google Search Console — how this hotel is found on Google. */
  partnerSearchInsights: (slug: string) => `${API_BASE}/partner/search-insights/${slug}`,
  // admin
  adminOverview: () => `${API_BASE}/admin/overview`,
  adminHotels: () => `${API_BASE}/admin/hotels`,
  adminPartners: () => `${API_BASE}/admin/partners`,
  adminCampaigns: () => `${API_BASE}/admin/campaigns`,
  adminInquiries: () => `${API_BASE}/admin/inquiries`,
  adminClicks: () => `${API_BASE}/admin/clicks`,
} as const

// ---- Envelopes ----
export interface ApiError {
  code: string
  message: string
  details?: unknown
}
export interface Paginated<T> {
  items: T[]
  page: number
  pageSize: number
  total: number
}
export interface PageQuery {
  page?: number
  pageSize?: number
}

// ---- Public: catalog (read) ----
export type CitiesResponse = Destination[]
export type CityResponse = Destination

export interface HotelListQuery extends PageQuery {
  area?: Area
  tag?: TravelStyle
  facility?: string
  /** Official-benefit keyword filter, e.g. "Late checkout". */
  benefit?: string
  lang?: Lang
  sort?: 'recommended' | 'name'
}
export type HotelListResponse = Paginated<Hotel>

export interface HotelDetailQuery {
  lang?: Lang
}
export type HotelDetailResponse = Hotel

// ---- Public: AI recommend ----
export interface RecommendRequest {
  query: string
  lang: Lang
  limit?: number
}
/** Same shape as the on-device engine, so server/offline are interchangeable. */
export type RecommendResponse = Recommendation

// ---- Public: tracking (CPC / impressions) ----
export interface TrackEventRequest {
  hotelId?: string
  type: 'official_click' | 'impression'
  source: 'home' | 'list' | 'detail' | 'search' | 'campaign'
  lang: Lang
  /** Anonymous session id (no PII). */
  sessionId?: string
}
export interface TrackEventResponse {
  accepted: boolean
}

// ---- Public: partner inquiries (lead form) ----
export interface InquiryCreateRequest {
  hotel: string
  city: string
  contact: string
  planInterest: Inquiry['planInterest']
  website?: string
  message?: string
}
export type InquiryResponse = Inquiry

// ---- Partner (authenticated) ----
export interface PartnerMeResponse {
  partner: Partner
  hotelSlug: string
}
export interface PartnerMetricsQuery {
  range?: 'last7' | 'last30' | 'month'
}
export interface PartnerMetricsResponse {
  views: number
  officialClicks: number
  ctr: string
  topMarket: string
  topTravelerType: string
  bySource: { source: string; pct: number }[]
}

/** One Google search term that surfaced this hotel's StayEasy page. */
export interface SearchQueryRow {
  query: string
  clicks: number
  impressions: number
  /** Click-through rate, 0..1. */
  ctr: number
  /** Average position in Google results (1 = top). */
  position: number
}
/** Google Search Console insights for a single hotel page — "how travelers
 *  find you on Google". Backed by the Search Console Search Analytics API in
 *  production; mock data until the backend + service account are wired. */
export interface PartnerSearchInsightsResponse {
  slug: string
  /** Trailing window the figures cover, in days (e.g. 28). */
  rangeDays: number
  totals: { clicks: number; impressions: number; ctr: number; position: number }
  topQueries: SearchQueryRow[]
  /** Where the numbers came from — so the UI can label demo vs live. */
  source: 'mock' | 'search-console'
}

// ---- Admin / back-office (RBAC: operator | admin) ----
export interface AdminOverviewResponse {
  kpis: { label: string; value: string; delta: string }[]
  clicksByCity: { city: string; clicks: number }[]
}
export type AdminHotelsResponse = Paginated<Hotel>
export type AdminPartnersResponse = Paginated<Partner>
export type AdminCampaignsResponse = Paginated<Campaign>
export type AdminInquiriesResponse = Paginated<Inquiry>

export interface AdminClicksQuery {
  range?: 'last7' | 'last30' | 'month'
}
export interface AdminClicksResponse {
  totalClicks: number
  byHotel: { hotelId: string; hotel: string; clicks: number; cpcRevenue: number }[]
}

// ---- Auth ----
export type Role = 'operator' | 'admin' | 'partner'
export interface SessionUser {
  id: string
  role: Role
  email: string
  partnerId?: string
}
