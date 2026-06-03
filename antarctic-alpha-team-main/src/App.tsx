import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore, initializeFirebaseAuth } from './store/authStore'
import { useAdminStore } from './store/adminStore'
import { useThemeStore } from './store/themeStore'
import { useEffect } from 'react'
import { Login } from './pages/Login'
import { CallPage } from './pages/Call'
import { Management } from './pages/Management'
import { Earnings } from './pages/Earnings'
import { Rating } from './pages/Rating'
import { Tasks } from './pages/Tasks'
import { Admin } from './pages/Admin'
import { Profile } from './pages/Profile'
import { Controls } from './pages/Controls'
import { About } from './pages/About'
import { Approvals } from './pages/Approvals'
import { Strategies } from './pages/Strategies'
import { EventsPage } from './pages/Events'
import { Referrals } from './pages/Referrals'
import { NotFound } from './pages/NotFound'
import { Initiatives } from './pages/Initiatives'
import { Challenges } from './pages/Challenges'
import { AIReview } from './pages/AIReview'
import { ApplicationForm } from './pages/ApplicationForm'
import { InfrastructureForm } from './pages/InfrastructureForm'
import { FeedbackLoop } from './pages/FeedbackLoop'
import CommunityFund from './pages/CommunityFund'
import TeamFund from './pages/TeamFund'
import Payments from './pages/Payments'
import CashoutCastle from './pages/CashoutCastle'
import Applications from './pages/Applications'
import SupportTickets from './pages/SupportTickets'
import SalesAnalytics from './pages/SalesAnalytics'
import { HRHub } from './pages/HRHub'
import { UnfilteredFeedback } from './pages/UnfilteredFeedback'
import Converter from './pages/Converter'
import { TraderDiary } from './pages/TraderDiary'
import MarketAnalytics from './pages/MarketAnalytics'
import FAQ from './pages/FAQ'
import { TeamWallets } from './pages/TeamWallets'
import ContourSpheres from './pages/ContourSpheres'
import { BetaTesting } from './pages/BetaTesting'
import { PoolRulesNew as PoolRules } from './pages/PoolRulesNew'
import { CheckReferrals } from './pages/admin/CheckReferrals'
import { FeedbackAdmin } from './pages/admin/FeedbackAdmin'
import ContactDM from './pages/ContactDM'
import { CardsAndCrypto } from './pages/CardsAndCrypto'
import { Communication } from './pages/Communication'
import { Appeals } from './pages/Appeals'
import { AdminDashboard } from './pages/AdminDashboard'

import { ProtectedRoute } from './components/ProtectedRoute'
import { AccessBlockScreen } from './components/AccessBlockScreen'
import { cleanupOldData, cleanupOldSessions } from './services/firestoreService'
import { auth } from './firebase/config'

import { AppLayout } from './components/AppLayout'
import { useAuthSecurity } from './hooks/useAuthSecurity'

function App() {
  const { isAuthenticated } = useAuthStore()
  const { isAdmin } = useAdminStore()
  const { theme } = useThemeStore()

  // Monitor session security and auto-logout if credentials change
  useAuthSecurity()

  useEffect(() => {
    // Apply theme on mount
    document.body.classList.toggle('dark', theme === 'dark')
  }, [theme])

  useEffect(() => {
    // Initialize Firebase Auth on app load (restore session from localStorage)
    initializeFirebaseAuth()
      .then(() => {
        // Run cleanup only when we have an auth user to avoid permission errors
        if (auth.currentUser) {
          cleanupOldData().catch((error) => console.error('Cleanup failed', error))
          cleanupOldSessions().catch((error) => console.error('Sessions cleanup failed', error))
        }
      })
      .catch((error) => console.error('Firebase Auth init failed', error))
  }, [])

  return (
    <BrowserRouter>
      <AccessBlockScreen />
      <Routes>
        <Route
          path="/login"
          element={
            (!isAuthenticated && !isAdmin) ? (
              <Login />
            ) : (
              <Navigate to="/about" replace />
            )
          }
        />

        {/* Public routes for application forms */}
        <Route path="/application" element={<ApplicationForm />} />
        <Route path="/infrastructure" element={<InfrastructureForm />} />

        {/* Layout wrapper for all pages with navigation */}
        <Route element={<AppLayout />}>
          <Route
            path="/hub"
            element={
              <ProtectedRoute>
                <CallPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lead"
            element={
              <ProtectedRoute>
                <Management />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pnl"
            element={
              <ProtectedRoute>
                <Earnings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/track-record"
            element={
              <ProtectedRoute>
                <Rating />
              </ProtectedRoute>
            }
          />
          <Route
            path="/invite-earn"
            element={
              <ProtectedRoute>
                <Referrals />
              </ProtectedRoute>
            }
          />
<Route
 path="/tasks"
 element={
<ProtectedRoute>
<Tasks />
</ProtectedRoute>
 }
 />
          <Route
            path="/about"
            element={
              <ProtectedRoute>
                <About />
              </ProtectedRoute>
            }
          />
          <Route
            path="/faq"
            element={
              <ProtectedRoute>
                <FAQ />
              </ProtectedRoute>
            }
          />
          <Route
            path="/feedback"
            element={
              <ProtectedRoute>
                <UnfilteredFeedback />
              </ProtectedRoute>
            }
          />
          {/* Маршрут /rules удален, так как компонент Rules был удален */}
          
          <Route
            path="/controls"
            element={
              <ProtectedRoute adminOnly={true}>
                <Controls />
              </ProtectedRoute>
            }
          />
          <Route
            path="/approvals"
            element={
              <ProtectedRoute>
                <Approvals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/check-ref"
            element={
              <ProtectedRoute adminOnly={true}>
                <CheckReferrals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/feedback-form"
            element={
              <ProtectedRoute>
                <FeedbackAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/strategies"
            element={
              <ProtectedRoute>
                <Strategies />
              </ProtectedRoute>
            }
          />
          <Route
            path="/events"
            element={
              <ProtectedRoute>
                <EventsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/initiatives"
            element={
              <ProtectedRoute>
                <Initiatives />
              </ProtectedRoute>
            }
          />
          <Route
            path="/challenges"
            element={
              <ProtectedRoute>
                <Challenges />
              </ProtectedRoute>
            }
          />
          {/* Маршрут /docs удален, так как компонент Docs был удален */}
          
          <Route
            path="/ai-review"
            element={
              <ProtectedRoute>
                <AIReview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/feedback-loop"
            element={
              <ProtectedRoute>
                <FeedbackLoop />
              </ProtectedRoute>
            }
          />
          {/* Legacy redirect */}
          <Route
            path="/unfiltered-feedback"
            element={<Navigate to="/feedback-loop" replace />}
          />
          <Route
            path="/hr-hub"
            element={
              <ProtectedRoute adminOnly={true}>
                <HRHub />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hr-hub/feedback"
            element={
              <ProtectedRoute adminOnly={true}>
                <UnfilteredFeedback />
              </ProtectedRoute>
            }
          />
          <Route
            path="/converter"
            element={
              <ProtectedRoute>
                <Converter />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trader-diary"
            element={
              <ProtectedRoute>
                <TraderDiary />
              </ProtectedRoute>
            }
          />
          <Route
            path="/market-analytics"
            element={
              <ProtectedRoute>
                <MarketAnalytics />
              </ProtectedRoute>
            }
          />
        
          
          <Route
            path="/community-fund"
            element={
              <ProtectedRoute>
                <CommunityFund />
              </ProtectedRoute>
            }
          />
          <Route
            path="/team-fund"
            element={
              <ProtectedRoute feature="ava_team_fund">
                <TeamFund />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payments"
            element={
              <ProtectedRoute feature="ava_payments">
                <Payments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cashout-castle"
            element={
              <ProtectedRoute>
                <CashoutCastle />
              </ProtectedRoute>
            }
          />
          <Route
            path="/applications"
            element={
              <ProtectedRoute>
                <Applications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/support-tickets"
            element={
              <ProtectedRoute>
                <SupportTickets />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sales-analytics"
            element={
              <ProtectedRoute>
                <SalesAnalytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/team-wallets"
            element={
              <ProtectedRoute>
                <TeamWallets />
              </ProtectedRoute>
            }
          />
          <Route
            path="/appeals"
            element={
              <ProtectedRoute>
                <Appeals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contour-spheres"
            element={
              <ProtectedRoute adminOnly={true}>
                <ContourSpheres />
              </ProtectedRoute>
            }
          />
          <Route
            path="/beta-testing"
            element={
              <ProtectedRoute>
                <BetaTesting />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pool-rules"
            element={
              <ProtectedRoute>
                <PoolRules />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cards-crypto"
            element={
              <ProtectedRoute>
                <CardsAndCrypto />
              </ProtectedRoute>
            }
          />
          <Route
            path="/communication"
            element={
              <ProtectedRoute>
                <Communication />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contact-dm"
            element={
              <ContactDM />
            }
          />
        </Route>

        <Route path="/" element={<Navigate to={(isAuthenticated || isAdmin) ? "/profile" : "/login"} replace />} />

        {/* Legacy redirects for old URLs */}
        <Route path="/call" element={<Navigate to="/hub" replace />} />
        <Route path="/management" element={<Navigate to="/lead" replace />} />
        <Route path="/earnings" element={<Navigate to="/pnl" replace />} />
        <Route path="/operations" element={<Navigate to="/tasks" replace />} />
        <Route path="/rating" element={<Navigate to="/track-record" replace />} />
        <Route path="/referrals" element={<Navigate to="/invite-earn" replace />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
