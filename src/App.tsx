import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, Navigate, Outlet, useParams, useLocation } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Spinner } from './components/Loading'
import { initAnalytics, trackPageview } from './lib/analytics'
import HomePage from './pages/HomePage'

// The landing page loads eagerly (fast first paint); every other route is
// code-split so it ships in its own chunk and only downloads on navigation.
const VietnamPage = lazy(() => import('./pages/VietnamPage'))
const HotelListPage = lazy(() => import('./pages/HotelListPage'))
const HotelDetailPage = lazy(() => import('./pages/HotelDetailPage'))
const BookingGuidePage = lazy(() => import('./pages/BookingGuidePage'))
const GuidesIndexPage = lazy(() => import('./pages/GuidesIndexPage'))
const GuideArticlePage = lazy(() => import('./pages/GuideArticlePage'))
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'))
const TermsPage = lazy(() => import('./pages/TermsPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const PartnerPage = lazy(() => import('./pages/PartnerPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const SearchPage = lazy(() => import('./pages/SearchPage'))
const WishlistPage = lazy(() => import('./pages/WishlistPage'))
const AdminPage = lazy(() => import('./pages/AdminPage'))
const RegisterHotelPage = lazy(() => import('./pages/RegisterHotelPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

/** Suspense fallback while a route's code chunk downloads. */
function RouteFallback() {
  return (
    <div className="container-page py-24" data-testid="route-loading">
      <Spinner />
    </div>
  )
}

/** Redirect legacy /hotel/:slug → /hotels/:slug while preserving the slug. */
function HotelSlugRedirect() {
  const { slug } = useParams()
  return <Navigate to={`/hotels/${slug}`} replace />
}

/** Public site chrome (navbar + footer) wrapping the matched route. */
function PublicLayout() {
  return (
    <Layout>
      <Suspense fallback={<RouteFallback />}>
        <Outlet />
      </Suspense>
    </Layout>
  )
}

export default function App() {
  const location = useLocation()
  useEffect(() => {
    initAnalytics()
    trackPageview(location.pathname + location.search)
  }, [location.pathname, location.search])

  return (
    <Routes>
      {/* Back-office uses its own full-screen shell — no public navbar/footer. */}
      <Route
        path="/admin"
        element={
          <Suspense fallback={<RouteFallback />}>
            <AdminPage />
          </Suspense>
        }
      />
      <Route
        path="/admin/register"
        element={
          <Suspense fallback={<RouteFallback />}>
            <RegisterHotelPage />
          </Suspense>
        }
      />

      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/destinations/vietnam" element={<VietnamPage />} />
        <Route path="/destinations/:citySlug" element={<HotelListPage />} />
        <Route path="/hotels/:slug" element={<HotelDetailPage />} />
        <Route path="/guides" element={<GuidesIndexPage />} />
        <Route path="/guides/direct-booking" element={<BookingGuidePage />} />
        <Route path="/guides/:slug" element={<GuideArticlePage />} />
        <Route path="/partners" element={<PartnerPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* Legacy route redirects */}
        <Route path="/vietnam" element={<Navigate to="/destinations/vietnam" replace />} />
        <Route path="/da-nang" element={<Navigate to="/destinations/da-nang" replace />} />
        <Route path="/booking-guide" element={<Navigate to="/guides/direct-booking" replace />} />
        <Route path="/hotel/:slug" element={<HotelSlugRedirect />} />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
