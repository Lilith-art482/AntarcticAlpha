import { Layout } from './Layout'
import { Outlet } from 'react-router-dom'
import CustomCursor from './CustomCursor'
import { PdConsentModal, usePdConsent } from './PdConsentModal'
import { useAuthStore } from '@/store/authStore'
import { useEffect } from 'react'

export const AppLayout = () => {
  const { user, isAuthenticated } = useAuthStore()
  const { needsConsent, checkConsent, acceptConsent } = usePdConsent(user?.id)

  // Check consent on mount and when user changes
  useEffect(() => {
    if (user?.id) {
      checkConsent()
    }
  }, [user?.id])

  // For authenticated users, show layout with menu
  // For guests, show content without layout (no menu)
  if (!isAuthenticated) {
    return (
      <>
        <CustomCursor />
        <Outlet />
      </>
    )
  }
        
  return (
    <Layout>
        <CustomCursor />
        <Outlet />
        
        {/* PD Consent Modal - shows on all protected pages */}
        {needsConsent && user && (
          <PdConsentModal userId={user.id} onAccept={acceptConsent} />
        )}
    </Layout>
  )
}
