import { Routes, Route, Navigate, useParams } from 'react-router-dom'
import { Layout } from './components/Layout'
import HomePage from './pages/HomePage'
import VietnamPage from './pages/VietnamPage'
import HotelListPage from './pages/HotelListPage'
import HotelDetailPage from './pages/HotelDetailPage'
import BookingGuidePage from './pages/BookingGuidePage'
import PartnerPage from './pages/PartnerPage'
import DashboardPage from './pages/DashboardPage'
import AboutPage from './pages/AboutPage'
import NotFoundPage from './pages/NotFoundPage'

/** Redirect legacy /hotel/:slug → /hotels/:slug while preserving the slug. */
function HotelSlugRedirect() {
  const { slug } = useParams()
  return <Navigate to={`/hotels/${slug}`} replace />
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/destinations/vietnam" element={<VietnamPage />} />
        <Route path="/destinations/da-nang" element={<HotelListPage />} />
        <Route path="/hotels/:slug" element={<HotelDetailPage />} />
        <Route path="/guides/direct-booking" element={<BookingGuidePage />} />
        <Route path="/partners" element={<PartnerPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/about" element={<AboutPage />} />

        {/* Legacy route redirects */}
        <Route path="/vietnam" element={<Navigate to="/destinations/vietnam" replace />} />
        <Route path="/da-nang" element={<Navigate to="/destinations/da-nang" replace />} />
        <Route path="/booking-guide" element={<Navigate to="/guides/direct-booking" replace />} />
        <Route path="/hotel/:slug" element={<HotelSlugRedirect />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  )
}
