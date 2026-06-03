// Admin mode store using Zustand
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { TEAM_MEMBERS } from '@/types'
import { logger } from '@/utils/logger'

// Типы админских разделов
export type AdminSection = 
  | 'controls'
  | 'approvals'
  | 'applications'
  | 'feedback-form'
  | 'hr-hub'
  | 'appeals'
  | 'admin'
  | 'team-wallets'
  | 'hr-hub'
  | 'contour-spheres'
  | 'feedback-form'
  | 'applications'

// Конфигурация ограниченного доступа для конкретных пользователей
const LIMITED_ACCESS_CONFIG: Record<string, AdminSection[]> = {
  // Адель (id: '2') - ограниченный доступ к Applications, Feedback Form, HR Hub
  '2': ['applications', 'feedback-form', 'hr-hub'],
  // Можно добавить других пользователей с ограниченным доступом
}

interface AdminState {
  isAdmin: boolean
  isLimitedAdmin: boolean
  limitedSections: AdminSection[]
  activateAdmin: (password: string, userId?: string) => boolean
  deactivateAdmin: () => void
  checkAdminRole: (userId: string) => boolean
  hasSectionAccess: (section: AdminSection) => boolean
}

export const ADMIN_PASSWORD = '4747'

// Check if user has admin role from their profile
export const isUserAdmin = (userId: string): boolean => {
  const user = TEAM_MEMBERS.find(m => m.id === userId)
  return user?.role === 'admin'
}

// Get limited access sections for user
export const getLimitedSections = (userId: string): AdminSection[] => {
  return LIMITED_ACCESS_CONFIG[userId] || []
}

// Check if user has limited admin access
export const isUserLimitedAdmin = (userId: string): boolean => {
  return getLimitedSections(userId).length > 0
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      isAdmin: false,
      isLimitedAdmin: false,
      limitedSections: [],
      activateAdmin: (password: string, userId?: string) => {
        logger.log('[adminStore] activateAdmin called:', { password, userId, isUserAdmin: userId ? isUserAdmin(userId) : 'no userId' })
        
        // Check password first (full admin access)
        if (password === ADMIN_PASSWORD) {
          logger.log('[adminStore] Activating by password (full admin)')
          set({ isAdmin: true, isLimitedAdmin: false, limitedSections: [] })
          localStorage.setItem('isAdmin', 'true')
          localStorage.setItem('isLimitedAdmin', 'false')
          localStorage.removeItem('limitedSections')
          return true
        }
        // Check if user has full admin role
        if (userId && isUserAdmin(userId)) {
          logger.log('[adminStore] Activating by userId, user is admin:', userId)
          set({ isAdmin: true, isLimitedAdmin: false, limitedSections: [] })
          localStorage.setItem('isAdmin', 'true')
          localStorage.setItem('isLimitedAdmin', 'false')
          localStorage.removeItem('limitedSections')
          return true
        }
        // Check if user has limited admin access
        if (userId && isUserLimitedAdmin(userId)) {
          const sections = getLimitedSections(userId)
          logger.log('[adminStore] Activating limited admin for user:', userId, sections)
          set({ 
            isAdmin: false, 
            isLimitedAdmin: true, 
            limitedSections: sections 
          })
          localStorage.setItem('isAdmin', 'false')
          localStorage.setItem('isLimitedAdmin', 'true')
          localStorage.setItem('limitedSections', JSON.stringify(sections))
          return true
        }
        logger.log('[adminStore] Activation failed - not admin and wrong password')
        return false
      },
      deactivateAdmin: () => {
        logger.log('[adminStore] Deactivating admin')
        set({ isAdmin: false, isLimitedAdmin: false, limitedSections: [] })
        localStorage.removeItem('isAdmin')
        localStorage.removeItem('isLimitedAdmin')
        localStorage.removeItem('limitedSections')
      },
      checkAdminRole: (userId: string) => isUserAdmin(userId),
      hasSectionAccess: (section: AdminSection) => {
        const state = get()
        // Full admin has access to everything
        if (state.isAdmin) return true
        // Limited admin check
        if (state.isLimitedAdmin) {
          return state.limitedSections.includes(section)
        }
        return false
      },
    }),
    {
      name: 'ava-admin',
    }
  )
)



