import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, TEAM_MEMBERS, UserSession } from '@/types'
import { getAllUsers, getSessions, addSession, deleteSession, updateUser } from '@/services/firestoreService'
import { useAdminStore, isUserLimitedAdmin } from './adminStore'
import { signInWithEmailAndPassword, signInAnonymously, signOut as firebaseSignOut } from 'firebase/auth'
import { auth } from '@/firebase/config'
import { logger } from '@/utils/logger'
import { authenticateWithBiometric } from '@/utils/webAuthn'

// Sync all TEAM_MEMBERS to Firestore on first load
const syncAllTeamMembersToFirestore = async (): Promise<void> => {
  logger.log('[syncAllTeamMembers] Starting sync for all team members')
  try {
    const existingUsers = await getAllUsers()
    logger.log('[syncAllTeamMembers] Existing users in Firestore:', existingUsers.length)
    
    for (const teamMember of TEAM_MEMBERS) {
      const existing = existingUsers.find(u => u.id === teamMember.id)
      
      if (!existing) {
        // User doesn't exist - create from TEAM_MEMBERS
        logger.log('[syncAllTeamMembers] Creating user:', teamMember.id, teamMember.login)
        await updateUser(teamMember.id, {
          name: teamMember.name,
          login: teamMember.login,
          password: teamMember.password,
          recoveryCode: teamMember.recoveryCode,
          authCode: teamMember.authCode,
          phone: teamMember.phone,
          email: teamMember.email,
          avatar: teamMember.avatar,
          role: teamMember.role,
          nickname: teamMember.nickname,
        })
      } else {
        // User exists - update credentials from TEAM_MEMBERS if they differ
        logger.log('[syncAllTeamMembers] Updating user:', teamMember.id)
        const updates: Partial<User> = {}
        
        if (existing.login !== teamMember.login) {
          updates.login = teamMember.login
          logger.log('[syncAllTeamMembers] Login differs:', existing.login, '->', teamMember.login)
        }
        if (existing.password !== teamMember.password) {
          updates.password = teamMember.password
          logger.log('[syncAllTeamMembers] Password differs: existing=' + (existing.password ? existing.password.substring(0, 10) + '...' : 'empty') + ', updating to=' + (teamMember.password ? teamMember.password.substring(0, 10) + '...' : 'empty'))
        }
        if (existing.recoveryCode !== teamMember.recoveryCode) updates.recoveryCode = teamMember.recoveryCode
        if (existing.authCode !== teamMember.authCode) updates.authCode = teamMember.authCode
        if (existing.phone !== teamMember.phone) updates.phone = teamMember.phone
        if (existing.email !== teamMember.email) updates.email = teamMember.email
        if (existing.name !== teamMember.name) updates.name = teamMember.name
        if (existing.avatar !== teamMember.avatar) updates.avatar = teamMember.avatar
        if (existing.role !== teamMember.role) updates.role = teamMember.role
        if (existing.nickname !== teamMember.nickname) updates.nickname = teamMember.nickname
        
        if (Object.keys(updates).length > 0) {
          logger.log('[syncAllTeamMembers] Applying updates:', Object.keys(updates))
          await updateUser(teamMember.id, updates)
          logger.log('[syncAllTeamMembers] Updates applied successfully for user:', teamMember.id)
        } else {
          logger.log('[syncAllTeamMembers] No updates needed for user:', teamMember.id)
        }
      }
    }
    logger.log('[syncAllTeamMembers] Sync complete')
  } catch (error: any) {
    logger.error('[syncAllTeamMembers] Error:', error?.code || error?.message || error)
  }
}

// Mapping from TEAM_MEMBERS userId to Firebase Auth email
const USER_EMAIL_MAP: Record<string, string> = {
  '1': 'dexim@antarctic-alpha.com',
  '2': 'enowk@antarctic-alpha.com',
  '3': 'xenia@antarctic-alpha.com',
  '4': 'olga@antarctic-alpha.com',
  '5': 'antarctic-alpha-admin@mail.ru',
}

// Mapping from Firebase Auth uid to TEAM_MEMBERS userId
const FIREBASE_UID_TO_USER_ID: Record<string, string> = {
  'FHwKUQvz5tZICvazx37Id2yWSd72': '1', // dexim (Артём) - admin
  'YPGjIOIF5fPID7KuQNC0untA49E2': '2', // enowk (Адель)
  'yeH1O6eYHzcYNo82zNC6wltkXYk2': '3', // xenia (Ксения) - admin
  'UybkXhhXyIhjmHHYnRC8V1yOQCJ2': '4', // olga (Ольга)
  'EG0rphLHspPluXGoKOYOeVRBT1W2': '5', // antarctic-alpha-admin@mail.ru (новый админ)
}

// Mapping from TEAM_MEMBERS userId to Firebase Auth uid
const USER_ID_TO_FIREBASE_UID: Record<string, string> = {
  '1': 'FHwKUQvz5tZICvazx37Id2yWSd72', // dexim (Артём) - admin
  '2': 'YPGjIOIF5fPID7KuQNC0untA49E2', // enowk (Адель)
  '3': 'yeH1O6eYHzcYNo82zNC6wltkXYk2', // xenia (Ксения) - admin
  '4': 'UybkXhhXyIhjmHHYnRC8V1yOQCJ2', // olga (Ольга)
  '5': 'EG0rphLHspPluXGoKOYOeVRBT1W2', // antarctic-alpha-admin@mail.ru (новый админ)
}

// Firebase Auth passwords (can be simple, they're just for Firestore rules)
// Теперь используется пароль из TEAM_MEMBERS для каждого пользователя

// Build reverse lookup from login/phone to userId for faster Firebase Auth sign-in
const getUserIdByLoginOrPhone = (input: string): string | null => {
  const normalizedInput = input.replace(/\D/g, '')
  for (const tm of TEAM_MEMBERS) {
    if (tm.login === input) return tm.id
    if (tm.phone && tm.phone.replace(/\D/g, '') === normalizedInput) return tm.id
  }
  return null
}

// Get TEAM_MEMBERS userId from Firebase Auth uid
export const getUserIdFromFirebaseUid = (firebaseUid: string): string | null => {
  return FIREBASE_UID_TO_USER_ID[firebaseUid] || null
}

// Get Firebase Auth uid from TEAM_MEMBERS userId
export const getFirebaseUidFromUserId = (userId: string): string | null => {
  return USER_ID_TO_FIREBASE_UID[userId] || null
}

// Session type for active sessions - now imported from types

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  lastAuthTime: string | null // ISO timestamp of last successful auth
  pendingAuthCode: string | null // Code waiting for verification
  pendingUserId: string | null // User ID waiting for code verification
  sessions: UserSession[] // Active sessions
  codeVerified: boolean // Whether code was verified in current session
  login: (login: string, password: string) => Promise<{ success: boolean; requiresCode?: boolean }>
    verifyAuthCode: (code: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  logoutSession: (sessionId: string) => Promise<void>
  checkSessionExpiry: () => boolean // Returns true if session is expired
  clearPendingAuth: () => void
  setSessions: (sessions: UserSession[]) => void
  updateUser: (userData: Partial<User>) => void // Update current user data without logout
}

// Helper to sign in to Firebase Auth (for Firestore security rules)
const signInToFirebaseAuth = async (userId: string): Promise<boolean> => {
  const email = USER_EMAIL_MAP[userId]
  if (!email) {
    logger.warn('No Firebase Auth email mapping for user:', userId)
    return false
  }
  
  // Get the user's actual password from TEAM_MEMBERS
  const teamMember = TEAM_MEMBERS.find(tm => tm.id === userId)
  const password = teamMember?.password
  if (!password) {
    logger.warn('No password found in TEAM_MEMBERS for user:', userId)
    return false
  }
  
  try {
    await signInWithEmailAndPassword(auth, email, password)
    logger.log('✅ Signed in to Firebase Auth as:', email)
    return true
  } catch (error: any) {
    if (error.code === 'auth/user-not-found') {
      logger.warn('Firebase Auth user not found:', email)
    } else if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
      logger.warn('Firebase Auth invalid credential for:', email, '- check that the password in Firebase Console matches TEAM_MEMBERS')
    } else {
      logger.error('Firebase Auth sign-in error:', error.code, error.message)
    }
    return false
  }
}

// Fallback: sign in anonymously to satisfy Firestore rules when email auth fails
const signInAnonymouslyToFirebase = async (): Promise<boolean> => {
  try {
    await signInAnonymously(auth)
    logger.log('✅ Signed in to Firebase Auth anonymously')
    return true
  } catch (error: any) {
    logger.error('Firebase Auth anonymous sign-in error:', error.code, error.message)
    return false
  }
}

// Helper to sign out from Firebase Auth
const signOutFromFirebaseAuth = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth)
    logger.log('✅ Signed out from Firebase Auth')
  } catch (error) {
    logger.error('Firebase Auth sign-out error:', error)
  }
}

// Helper to ensure correct Firebase Auth session for operations requiring specific user permissions
// используется перед операциями с userSecurity где нужны owner rules
export const ensureFirebaseAuthForUser = async (userId: string): Promise<boolean> => {
  // Check if already signed in as the correct user
  const currentUid = auth.currentUser?.uid
  const targetUid = USER_ID_TO_FIREBASE_UID[userId]
  
  if (currentUid === targetUid) {
    logger.log('[ensureFirebaseAuth] Already signed in as correct user:', userId)
    return true
  }
  
  // Sign in to Firebase Auth for this user
  const success = await signInToFirebaseAuth(userId)
  if (success) {
    logger.log('✅ Ensured Firebase Auth session for user:', userId)
  } else {
    logger.error('Failed to ensure Firebase Auth session for user:', userId)
  }
  return success
}

// Initialize Firebase Auth on app load (restore session)
export const initializeFirebaseAuth = async (): Promise<void> => {
  // Check if user is already logged in from persisted state
  const stored = localStorage.getItem('ava-auth')
  if (!stored) return
  
  try {
    const parsed = JSON.parse(stored)
    const userId = parsed?.state?.user?.id
    const isAuthenticated = parsed?.state?.isAuthenticated
    
    if (userId && isAuthenticated) {
      const restored = await signInToFirebaseAuth(userId)
      if (!restored) {
        logger.warn('[init] Failed to restore Firebase Auth session for user:', userId, '- trying anonymous fallback')
        await signInAnonymouslyToFirebase()
      }
      logger.log('✅ Firebase Auth session restored for user:', userId)
      
      // Also load fresh user data from Firestore to get selectedSphere
      try {
        const firestoreUsers = await getAllUsers()
        const firestoreUser = firestoreUsers.find(u => u.id === userId)
        
        if (firestoreUser) {
          logger.log('✅ Loaded fresh user data from Firestore:', userId)
          // Update the store with fresh data
          const authStore = useAuthStore.getState()
          if (authStore.user) {
            authStore.updateUser({
              selectedSphere: firestoreUser.selectedSphere,
              sphereSelectedAt: firestoreUser.sphereSelectedAt,
              name: firestoreUser.name,
              avatar: firestoreUser.avatar,
              nickname: firestoreUser.nickname,
              // Preserve other fields from current state
            })
          }
        }
      } catch (error) {
        logger.error('Error loading fresh user data from Firestore:', error)
      }
    }
  } catch (error) {
    logger.error('Error restoring Firebase Auth session:', error)
  }
}
const getBrowserInfo = () => {
  const ua = navigator.userAgent
  let browser = 'Unknown'
  let device = 'Desktop'
  let deviceModel = ''
  let os = 'Unknown'

  // Browser detection
  if (ua.includes('Firefox')) browser = 'Firefox'
  else if (ua.includes('Chrome') && !ua.includes('Edg')) browser = 'Chrome'
  else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari'
  else if (ua.includes('Edg')) browser = 'Edge'
  else if (ua.includes('Opera') || ua.includes('OPR')) browser = 'Opera'

  // Check for iPad FIRST (before Mobile) - iPadOS includes "Mobile" in UA
  if (ua.includes('iPad') || ua.includes('Tablet') || ua.includes('Nexus 10') || ua.includes('Nexus 9')) {
    device = 'iPad'
    // iPad Pro detection by model identifiers
    if (ua.includes('iPad Pro 12.9')) {
      if (ua.includes('iPad18,') || ua.includes('iPad17,')) {
        deviceModel = 'iPad Pro 12.9" (M4/M2/M1)'
      } else if (ua.includes('iPad16,') || ua.includes('iPad15,')) {
        deviceModel = 'iPad Pro 12.9" (M2)'
      } else if (ua.includes('iPad14,') || ua.includes('iPad13,1')) {
        deviceModel = 'iPad Pro 12.9" (M1)'
      } else if (ua.includes('iPad8,') && ua.includes('Pro')) {
        deviceModel = 'iPad Pro 12.9" (2018/2020)'
      } else {
        deviceModel = 'iPad Pro 12.9"'
      }
    } else if (ua.includes('iPad Pro 11')) {
      if (ua.includes('iPad18,') || ua.includes('iPad17,')) {
        deviceModel = 'iPad Pro 11" (M4/M2/M1)'
      } else if (ua.includes('iPad16,') || ua.includes('iPad15,')) {
        deviceModel = 'iPad Pro 11" (M2)'
      } else if (ua.includes('iPad14,') || ua.includes('iPad13,')) {
        deviceModel = 'iPad Pro 11" (M1)'
      } else if (ua.includes('iPad11,')) {
        deviceModel = 'iPad Pro 11" (2018/2020)'
      } else {
        deviceModel = 'iPad Pro 11"'
      }
    } else if (ua.includes('iPad Air')) {
      if (ua.includes('iPad14,') || ua.includes('iPad13,')) {
        deviceModel = 'iPad Air (M2/M1)'
      } else if (ua.includes('iPad11,') || ua.includes('iPad7,')) {
        deviceModel = 'iPad Air (2019/2020)'
      } else {
        deviceModel = 'iPad Air'
      }
    } else if (ua.includes('iPad mini')) {
      if (ua.includes('iPad14,') || ua.includes('iPad13,')) {
        deviceModel = 'iPad mini (M2/M1)'
      } else if (ua.includes('iPad11,')) {
        deviceModel = 'iPad mini (2019)'
      } else {
        deviceModel = 'iPad mini'
      }
    } else if (ua.includes('Nexus 10')) {
      deviceModel = 'Nexus 10'
    } else if (ua.includes('Nexus 9')) {
      deviceModel = 'Nexus 9'
    } else {
      // Generic iPad by model number
      const ipadModelMatch = ua.match(/iPad(\d+),(\d+)/i)
      if (ipadModelMatch) {
        const modelNum = parseInt(ipadModelMatch[1])
        if (modelNum >= 18) deviceModel = 'iPad (M4)'
        else if (modelNum >= 14) deviceModel = 'iPad (M2)'
        else if (modelNum >= 10) deviceModel = 'iPad (10th gen)'
        else if (modelNum >= 7) deviceModel = `iPad (${modelNum + 4}th gen)`
        else deviceModel = 'iPad'
      } else {
        deviceModel = 'iPad'
      }
    }
  } else if (ua.includes('iPhone') || (ua.includes('Mobile') || ua.includes('mobile')) && !ua.includes('Android')) {
    if (ua.includes('iPhone')) {
      device = 'iPhone'
      // iPhone model detection
      if (ua.includes('iPhone 16')) {
        deviceModel = ua.includes('Pro') ? 'iPhone 16 Pro' : 'iPhone 16'
      } else if (ua.includes('iPhone 15')) {
        deviceModel = ua.includes('Pro') ? 'iPhone 15 Pro' : 'iPhone 15'
      } else if (ua.includes('iPhone 14')) {
        deviceModel = ua.includes('Pro') ? 'iPhone 14 Pro' : 'iPhone 14'
      } else if (ua.includes('iPhone 13')) {
        deviceModel = ua.includes('Pro') ? 'iPhone 13 Pro' : 'iPhone 13'
      } else if (ua.includes('iPhone 12')) {
        deviceModel = ua.includes('Pro') ? 'iPhone 12 Pro' : 'iPhone 12'
      } else if (ua.includes('iPhone 11')) {
        deviceModel = ua.includes('Pro') ? 'iPhone 11 Pro' : 'iPhone 11'
      } else if (ua.includes('iPhone SE')) {
        deviceModel = 'iPhone SE'
      } else if (ua.includes('iPhone XR') || ua.includes('iPhone XS')) {
        deviceModel = ua.includes('XR') ? 'iPhone XR' : 'iPhone XS'
      } else if (ua.includes('iPhone X')) {
        deviceModel = 'iPhone X'
      } else if (ua.includes('iPhone 8')) {
        deviceModel = 'iPhone 8'
      } else if (ua.includes('iPhone 7')) {
        deviceModel = 'iPhone 7'
      } else if (ua.includes('iPhone 6')) {
        deviceModel = 'iPhone 6'
      } else {
        const iphoneMatch = ua.match(/iPhone (\d+)/i)
        deviceModel = iphoneMatch ? `iPhone ${iphoneMatch[1]}` : 'iPhone'
      }
    } else if (ua.includes('Android')) {
      device = 'Android'
      let androidModel = ''
      
      // Try "Model/Version" format
      const modelMatch = ua.match(/Android [^;]*; [^;]*; ([^;/)]+)/i)
      if (modelMatch && modelMatch[1]) {
        androidModel = modelMatch[1].trim()
      }
      
      // Samsung
      if (!androidModel || androidModel === 'Linux') {
        const samsungMatch = ua.match(/SM-([A-Z0-9]+)/i)
        if (samsungMatch) androidModel = `Samsung ${samsungMatch[1]}`
      }
      
      // Xiaomi
      if (!androidModel || androidModel === 'Linux') {
        const xiaomiMatch = ua.match(/Mi (\d+)/i)
        if (xiaomiMatch) androidModel = `Xiaomi Mi ${xiaomiMatch[1]}`
        else {
          const redmiMatch = ua.match(/Redmi ([^;)]+)/i)
          if (redmiMatch) androidModel = `Redmi ${redmiMatch[1].trim()}`
        }
      }
      
      // Google Pixel
      if (!androidModel || androidModel === 'Linux') {
        const pixelMatch = ua.match(/Pixel (\d+)/i)
        if (pixelMatch) androidModel = `Google Pixel ${pixelMatch[1]}`
      }
      
      // OnePlus
      if (!androidModel || androidModel === 'Linux') {
        const onePlusMatch = ua.match(/ONEPLUS ([A-Z0-9]+)/i)
        if (onePlusMatch) androidModel = `OnePlus ${onePlusMatch[1]}`
      }
      
      // Huawei
      if (!androidModel || androidModel === 'Linux') {
        const huaweiMatch = ua.match(/Huawei ([A-Z0-9-]+)/i)
        if (huaweiMatch) androidModel = `Huawei ${huaweiMatch[1]}`
      }
      
      // OPPO
      if (!androidModel || androidModel === 'Linux') {
        const oppoMatch = ua.match(/OPPO ([A-Z0-9]+)/i)
        if (oppoMatch) androidModel = `OPPO ${oppoMatch[1]}`
      }
      
      // Vivo
      if (!androidModel || androidModel === 'Linux') {
        const vivoMatch = ua.match(/Vivo ([A-Z0-9]+)/i)
        if (vivoMatch) androidModel = `Vivo ${vivoMatch[1]}`
      }
      
      // Realme
      if (!androidModel || androidModel === 'Linux') {
        const realmeMatch = ua.match(/Realme ([A-Z0-9]+)/i)
        if (realmeMatch) androidModel = `Realme ${realmeMatch[1]}`
      }
      
      // Sony
      if (!androidModel || androidModel === 'Linux') {
        const sonyMatch = ua.match(/Sony ([A-Z0-9-]+)/i)
        if (sonyMatch) androidModel = `Sony ${sonyMatch[1]}`
      }
      
      // Motorola
      if (!androidModel || androidModel === 'Linux') {
        const motoMatch = ua.match(/Motorola ([A-Z0-9-]+)/i)
        if (motoMatch) androidModel = `Motorola ${motoMatch[1]}`
      }
      
      // ASUS
      if (!androidModel || androidModel === 'Linux') {
        const asusMatch = ua.match(/ASUS_[A-Z0-9]+/i)
        if (asusMatch) androidModel = asusMatch[0].replace('_', ' ')
      }
      
      deviceModel = androidModel || 'Android'
    } else {
      device = 'Mobile'
    }
  } else {
    // Desktop / Laptop detection
    device = 'Desktop'
    
    // Mac detection
    if (ua.includes('Mac') || ua.includes('Macintosh')) {
      // MacBook Pro - check model identifiers (more precise)
      if (ua.includes('MacBook Pro')) {
        // M4 (2024)
        if (ua.includes('MacBookPro24,')) {
          if (ua.includes('1') || ua.includes('2')) deviceModel = 'MacBook Pro 14" (M4)'
          if (ua.includes('3') || ua.includes('4')) deviceModel = 'MacBook Pro 16" (M4 Max)'
        }
        // M3 (2023-2024)
        else if (ua.includes('MacBookPro23,')) {
          deviceModel = 'MacBook Pro 14/16" (M3)'
        }
        // M2 Pro/Max (2023)
        else if (ua.includes('MacBookPro22,')) {
          if (ua.includes('1') || ua.includes('3')) deviceModel = 'MacBook Pro 14" (M2 Pro/Max)'
          if (ua.includes('2') || ua.includes('4')) deviceModel = 'MacBook Pro 16" (M2 Pro/Max)'
        }
        // M2 (2022) - MacBook Pro 13" M2
        else if (ua.includes('MacBookPro18,') && (ua.includes('5') || ua.includes('6'))) {
          deviceModel = 'MacBook Pro 13" (M2)'
        }
        // M1 Pro/Max (2021)
        else if (ua.includes('MacBookPro18,')) {
          if (ua.includes('3') || ua.includes('4')) deviceModel = 'MacBook Pro 14" (M1 Pro)'
          else if (ua.includes('1') || ua.includes('2')) deviceModel = 'MacBook Pro 16" (M1 Pro/Max)'
          else deviceModel = 'MacBook Pro 14/16" (M1 Pro/Max)'
        }
        // M1 (2020) - MacBook Pro 13" M1
        else if (ua.includes('MacBookPro17,')) {
          deviceModel = 'MacBook Pro 13" (M1)'
        }
        // Intel MacBook Pro (2019-2020)
        else if (ua.includes('MacBookPro16,')) {
          if (ua.includes('4')) deviceModel = 'MacBook Pro 16" (2019)'
          else if (ua.includes('1') || ua.includes('2') || ua.includes('3')) deviceModel = 'MacBook Pro 16" (2019)'
          else if (ua.includes('5')) deviceModel = 'MacBook Pro 13" (2020)'
        }
        // Intel MacBook Pro (2018-2019)
        else if (ua.includes('MacBookPro15,')) {
          if (ua.includes('3') || ua.includes('4')) deviceModel = 'MacBook Pro 15" (2019)'
          else if (ua.includes('1') || ua.includes('2')) deviceModel = 'MacBook Pro 15" (2018)'
          else deviceModel = 'MacBook Pro 15" (2018/2019)'
        }
        // Intel MacBook Pro (2016-2017)
        else if (ua.includes('MacBookPro14,')) {
          deviceModel = 'MacBook Pro 13" (2016/2017)'
        }
        // Older MacBook Pro by screen size in UA
        else if (ua.includes('MacBook Pro 16')) {
          deviceModel = 'MacBook Pro 16"'
        }
        else if (ua.includes('MacBook Pro 15')) {
          deviceModel = 'MacBook Pro 15"'
        }
        else if (ua.includes('MacBook Pro 14')) {
          deviceModel = 'MacBook Pro 14"'
        }
        else if (ua.includes('MacBook Pro 13')) {
          deviceModel = 'MacBook Pro 13"'
        }
        // Generic MacBook Pro
        else {
          deviceModel = 'MacBook Pro'
        }
      }
      // MacBook Air
      else if (ua.includes('MacBook Air')) {
        // M3 (2024)
        if (ua.includes('MacBookAir15,')) {
          deviceModel = 'MacBook Air 15" (M3)'
        }
        // M2 (2022)
        else if (ua.includes('MacBookAir14,')) {
          deviceModel = 'MacBook Air 13" (M2)'
        }
        // M1 (2020)
        else if (ua.includes('MacBookAir10,')) {
          deviceModel = 'MacBook Air (M1)'
        }
        // Intel (2018-2020)
        else if (ua.includes('MacBookAir9,')) {
          deviceModel = 'MacBook Air (2020)'
        }
        else if (ua.includes('MacBookAir8,')) {
          deviceModel = 'MacBook Air (2018/2019)'
        }
        // Older by screen size
        else if (ua.includes('MacBook Air 13') || ua.includes('MacBookAir13')) {
          deviceModel = 'MacBook Air 13"'
        }
        else if (ua.includes('MacBook Air 11') || ua.includes('MacBookAir11')) {
          deviceModel = 'MacBook Air 11"'
        }
        else {
          deviceModel = 'MacBook Air'
        }
      }
      // Generic MacBook
      else if (ua.includes('MacBook')) {
        deviceModel = 'MacBook'
      }
      // iMac
      else if (ua.includes('iMac')) {
        if (ua.includes('iMac Pro')) {
          deviceModel = 'iMac Pro'
        } else if (ua.includes('iMac24')) {
          deviceModel = 'iMac 24" (M1/M3)'
        } else if (ua.includes('iMac21,')) {
          deviceModel = 'iMac 24" (M1)'
        } else if (ua.includes('iMac20,')) {
          deviceModel = 'iMac 27" (2020)'
        } else if (ua.includes('iMac19,')) {
          deviceModel = 'iMac 27" (2019)'
        } else if (ua.includes('iMac18,')) {
          deviceModel = 'iMac 27" (2017)'
        } else {
          const imacMatch = ua.match(/iMac(\d+)/i)
          deviceModel = imacMatch ? `iMac ${imacMatch[1]}"` : 'iMac'
        }
      }
      // Mac mini
      else if (ua.includes('Mac mini')) {
        if (ua.includes('Macmini10,')) {
          deviceModel = 'Mac mini (M2/M1)'
        } else if (ua.includes('Macmini9,')) {
          deviceModel = 'Mac mini (2020)'
        } else if (ua.includes('Macmini8,')) {
          deviceModel = 'Mac mini (2018)'
        } else {
          deviceModel = 'Mac mini'
        }
      }
      // Mac Studio
      else if (ua.includes('Mac Studio')) {
        if (ua.includes('MacStudio17,')) {
          deviceModel = 'Mac Studio (M2 Max/Ultra)'
        } else if (ua.includes('MacStudio16,')) {
          deviceModel = 'Mac Studio (M1 Max/Ultra)'
        } else {
          deviceModel = 'Mac Studio'
        }
      }
      // Mac Pro
      else if (ua.includes('Mac Pro')) {
        deviceModel = 'Mac Pro'
      }
      else {
        deviceModel = 'Mac'
      }
    }
    // Windows detection
    else if (ua.includes('Windows')) {
      if (ua.includes('Tablet') || ua.includes('Touch')) {
        device = 'Tablet'
        deviceModel = 'Windows Tablet'
      } else {
        // Check for common laptop models
        const laptopModels = [
          // ThinkPad
          'ThinkPad X1', 'ThinkPad X', 'ThinkPad T', 'ThinkPad L', 'ThinkPad P', 'ThinkPad E', 'ThinkPad Yoga', 'ThinkBook',
          // Dell
          'Latitude', 'Precision', 'XPS', 'Inspiron', 'Vostro',
          // HP
          'EliteBook', 'ProBook', 'Pavilion', 'Spectre', 'Envy', 'Omen', 'ZBook', 'HP Laptop',
          // Lenovo
          'Yoga', 'Legion', 'IdeaPad', 'V15', 'V14', 'V130', 'ThinkBook',
          // ASUS
          'ZenBook', 'ROG', 'TUF', 'VivoBook', 'ExpertBook', 'ProArt',
          // Acer
          'Aspire', 'Swift', 'Predator', 'Nitro', 'ConceptD',
          // Microsoft
          'Surface',
          // Razer
          'Razer Blade',
          // Alienware
          'Alienware',
          // MSI
          'MSI', 'GS', 'GE', 'GF', 'GP',
          // Samsung
          'Samsung Notebook',
          // Other
          'Gram', 'Gram+', 'Blade'
        ]
        
        let foundModel = ''
        for (const model of laptopModels) {
          if (ua.includes(model)) {
            foundModel = model
            break
          }
        }
        
        if (foundModel) {
          deviceModel = foundModel
        } else {
          deviceModel = 'Windows PC'
        }
      }
    }
    // Linux detection
    else if (ua.includes('Linux')) {
      // Try to detect specific Linux distributions or devices
      if (ua.includes('Ubuntu')) {
        deviceModel = 'Ubuntu PC'
      } else if (ua.includes('Fedora')) {
        deviceModel = 'Fedora PC'
      } else if (ua.includes('Debian')) {
        deviceModel = 'Debian PC'
      } else if (ua.includes('Arch')) {
        deviceModel = 'Arch PC'
      } else {
        deviceModel = 'Linux PC'
      }
    }
    // Generic desktop
    else {
      deviceModel = 'Desktop'
    }
  }

  // OS detection - more precise
  if (ua.includes('Windows')) os = 'Windows'
  else if (ua.includes('Android')) os = 'Android'
  else if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS'
  else if (ua.includes('Mac') || ua.includes('Macintosh')) os = 'macOS'
  else if (ua.includes('Linux')) os = 'Linux'

  return { browser, device, deviceModel, os }
}

// Get current session city (placeholder - would need IP geolocation API)
const getSessionCity = async (): Promise<string> => {
  // In a real app, you'd use an IP geolocation API
  return 'Moscow'
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      lastAuthTime: null,
      pendingAuthCode: null,
      pendingUserId: null,
      sessions: [],
      codeVerified: false,

login: async (login: string, password: string) => {
        logger.log('[login] Attempting login for:', login)
        
        // Normalize login input - check if it's a phone number or email
        const normalizedLogin = login.trim()
        const isPhoneNumber = /^[\d\+\-\(\)\s]+$/.test(normalizedLogin) && normalizedLogin.replace(/\D/g, '').length >= 10
        
        // Validate login format - must be phone number, email, or end with @antarctic-alpha
        const isEmailFormat = normalizedLogin.includes('@')
        if (!isPhoneNumber && !isEmailFormat && !normalizedLogin.endsWith('@antarctic-alpha')) {
          logger.log('[login] Invalid login format - must be phone, email, or @antarctic-alpha email')
          return { success: false }
        }

        // Try to sign in to Firebase Auth so Firestore rules allow reads.
        // First: try the user that matches the entered login/phone directly.
        let signedInUserId: string | null = getUserIdByLoginOrPhone(normalizedLogin)
        let firebaseAuthSuccess = false

        // Only use Firebase Auth email/password for standard users (dexim, enowk, xenia, olga)
        // For all other users (including new admins with @mail.ru), skip Firebase Auth
        const STANDARD_USER_IDS = ['1', '2', '3', '4']
        const isStandardUser = signedInUserId ? STANDARD_USER_IDS.includes(signedInUserId) : false

        if (isStandardUser && signedInUserId) {
          logger.log('[login] Standard user, trying Firebase Auth for:', signedInUserId)
          firebaseAuthSuccess = await signInToFirebaseAuth(signedInUserId)
        } else {
          logger.log('[login] Non-standard user, skipping Firebase Auth email/password, will use anonymous auth')
          // Skip Firebase Auth email/password, but anonymous auth will be used below
          firebaseAuthSuccess = false // Will trigger anonymous auth fallback
        }

        // Fallback: try each TEAM_MEMBER in case the login was changed in Firestore
        if (!firebaseAuthSuccess) {
          for (const tm of TEAM_MEMBERS) {
            logger.log('[login] Fallback Firebase Auth try:', tm.id)
            firebaseAuthSuccess = await signInToFirebaseAuth(tm.id)
            if (firebaseAuthSuccess) {
              signedInUserId = tm.id
              logger.log('[login] ✅ Firebase Auth signed in with fallback:', tm.id)
              break
            }
          }
        }

        // Last resort: anonymous auth so Firestore rules that only require request.auth != null still work
        if (!firebaseAuthSuccess) {
          logger.log('[login] Trying anonymous Firebase Auth fallback...')
          firebaseAuthSuccess = await signInAnonymouslyToFirebase()
          if (firebaseAuthSuccess) {
            // Keep the matched userId if we have one, otherwise stay null for now
            signedInUserId = signedInUserId || null
          }
        }

        if (!firebaseAuthSuccess) {
          logger.log('[login] ❌ Could not sign in to Firebase Auth (email or anonymous)')
          return { success: false }
        }

        // Sync TEAM_MEMBERS to Firestore if needed
        await syncAllTeamMembersToFirestore()

        // Now get user from Firestore
        try {
          logger.log('[login] Fetching from Firestore...')
          const firestoreUsers = await getAllUsers()
          logger.log('[login] Firestore users count:', firestoreUsers.length)
          
          // Find user by login (email) OR phone number OR email field
          const normalizedInput = normalizedLogin.replace(/\D/g, '') // Remove all non-digits for phone comparison
          let firestoreUser = firestoreUsers.find((u) => {
            // Try email/login match first
            if (u.login === normalizedLogin) return true
            
            // Try email field match (for users who have email separate from login)
            if (u.email && u.email === normalizedLogin) return true
            
            // Try phone match (normalize both to digits only)
            if (u.phone) {
              const userPhoneNormalized = u.phone.replace(/\D/g, '')
              if (userPhoneNormalized === normalizedInput) return true
            }
            
            return false
          })

          if (firestoreUser) {
            logger.log('[login] ✅ Found user in Firestore:', firestoreUser.id, firestoreUser.login, 'phone:', firestoreUser.phone)
            logger.log('[login] Firestore password:', firestoreUser.password ? 'exists (length: ' + firestoreUser.password.length + ')' : 'empty')
            logger.log('[login] Input password length:', password?.length)
            logger.log('[login] Passwords match:', firestoreUser.password === password)
            
            // FIRST verify password - this is the main authentication
            if (firestoreUser.password !== password) {
              logger.log('[login] ❌ Password mismatch')
              logger.log('[login] Expected (from Firestore):', firestoreUser.password?.substring(0, 10) + '...')
              logger.log('[login] Received (input):', password?.substring(0, 10) + '...')
              return { success: false }
            }
            logger.log('[login] ✅ Password correct')

            // THEN check if user has authCode - require verification
            if (firestoreUser.authCode) {
              logger.log('[login] User has authCode:', firestoreUser.authCode, 'requiring verification')
              set({ 
                pendingUserId: firestoreUser.id,
                pendingAuthCode: firestoreUser.authCode 
              })
              return { success: true, requiresCode: true }
            }
            logger.log('[login] No authCode required, proceeding with full login')

            // No authCode - proceed with full login
              const now = new Date().toISOString()
              const browserInfo = getBrowserInfo()
              const city = await getSessionCity()

              const newSession: UserSession = {
                id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                userId: firestoreUser.id,
                browser: browserInfo.browser,
                device: browserInfo.device,
                deviceModel: browserInfo.deviceModel,
                os: browserInfo.os,
                loginAt: now,
                city,
                isCurrent: true
              }

try {
                await addSession({
                  userId: newSession.userId,
                  browser: newSession.browser,
                  device: newSession.device,
                  deviceModel: newSession.deviceModel,
                  os: newSession.os,
                  loginAt: newSession.loginAt,
                  city: newSession.city,
                  isCurrent: true
                })
              } catch (e) {
                logger.error('Failed to save session to Firestore:', e)
              }

              // Use Firestore data directly - it's the primary source
              const teamMember = TEAM_MEMBERS.find(u => u.id === firestoreUser.id)
              const user: User = {
                ...teamMember,
                ...firestoreUser,
                id: firestoreUser.id || teamMember?.id || '',
                login: firestoreUser.login || teamMember?.login || '',
                password: firestoreUser.password || teamMember?.password || '',
                recoveryCode: firestoreUser.recoveryCode || teamMember?.recoveryCode || '',
                phone: firestoreUser.phone || teamMember?.phone || '',
                email: firestoreUser.email || teamMember?.email || '',
                authCode: firestoreUser.authCode || teamMember?.authCode || '',
}

              logger.log('[login] Setting user in state:', user.id, user.login)
              set(() => ({
                user,
                isAuthenticated: true,
                lastAuthTime: now,
                pendingAuthCode: null,
                pendingUserId: null,
                sessions: [newSession],
                codeVerified: true
              }))

              try {
                const userSessions = await getSessions(firestoreUser.id)
                set({ sessions: userSessions })
              } catch (e) {
                logger.error('Failed to load sessions from Firestore:', e)
              }

              if (user.role === 'admin') {
                useAdminStore.getState().activateAdmin('', user.id)
              } else if (isUserLimitedAdmin(user.id)) {
                useAdminStore.getState().activateAdmin('', user.id)
              }

              logger.log('[login] Login successful (Firestore)')
              return { success: true, requiresCode: false }
          } else {
            logger.log('[login] User not found in Firestore')
          }
        } catch (error: any) {
          logger.error('[login] ❌ Firestore error:', error?.code || error?.message || error)
        }

        // No fallback - if not in Firestore with correct password, deny access
        logger.log('[login] ❌ Login failed - user not found or wrong password')
        return { success: false }
      },

      verifyAuthCode: async (code: string, password: string) => {
        const state = get()
        if (!state.pendingAuthCode || !state.pendingUserId) {
          return false
        }

        if (code !== state.pendingAuthCode) {
          return false
        }

        // Code is correct - now verify password
        // Get user from Firestore to check password
        let teamMember = TEAM_MEMBERS.find(u => u.id === state.pendingUserId)
        let firestoreUser = null
        
        try {
          const firestoreUsers = await getAllUsers()
          firestoreUser = firestoreUsers.find(u => u.id === state.pendingUserId)
        } catch (error) {
          console.error('Error fetching user from Firestore:', error)
        }

// Verify password from Firestore first
        if (firestoreUser?.password && firestoreUser.password !== password) {
          logger.log('[verifyAuthCode] Password mismatch')
          return false
        }

        // Also check TEAM_MEMBERS if no Firestore password
        if (!firestoreUser?.password && teamMember?.password !== password) {
          logger.log('[verifyAuthCode] Password mismatch in TEAM_MEMBERS')
          return false
        }
        
        logger.log('[verifyAuthCode] Password correct')

        // Password verified - complete the login
        const now = new Date().toISOString()
        
// Sign in to Firebase Auth for Firestore rules
        const authOk = state.pendingUserId ? await signInToFirebaseAuth(state.pendingUserId) : false
        if (!authOk) {
          await signInAnonymouslyToFirebase()
        }

        // Merge data: Firestore takes priority (user's edits are saved there)
        const user: User = {
          // Start with TEAM_MEMBERS defaults
          ...teamMember,
          // Override with Firestore data
          ...firestoreUser,
          // Preserve authCode from pendingAuthCode (already verified)
          authCode: state.pendingAuthCode,
          // Ensure critical fields have values
          id: firestoreUser?.id || teamMember?.id || state.pendingUserId || '',
          name: firestoreUser?.name || teamMember?.name || '',
          login: firestoreUser?.login || teamMember?.login || '',
          password: firestoreUser?.password || teamMember?.password || '',
          recoveryCode: firestoreUser?.recoveryCode || teamMember?.recoveryCode || '',
          phone: firestoreUser?.phone || teamMember?.phone || '',
          email: firestoreUser?.email || teamMember?.email || '',
        }

        if (!user) {
          return false
        }

        const browserInfo = getBrowserInfo()
        const city = await getSessionCity()

        const newSession: UserSession = {
          id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId: user.id,
          browser: browserInfo.browser,
          device: browserInfo.device,
          deviceModel: browserInfo.deviceModel,
          os: browserInfo.os,
          loginAt: now,
          city,
          isCurrent: true
        }

        // Save session to Firestore
try {
          await addSession({
            userId: newSession.userId,
            browser: newSession.browser,
            device: newSession.device,
            deviceModel: newSession.deviceModel,
            os: newSession.os,
            loginAt: newSession.loginAt,
            city: newSession.city,
            isCurrent: true
          })
        } catch (e) {
          logger.error('Failed to save session to Firestore:', e)
        }

        set(() => ({
          user,
          isAuthenticated: true,
          lastAuthTime: now,
          pendingAuthCode: null,
          pendingUserId: null,
          sessions: [newSession],
          codeVerified: true
        }))

// Load all sessions for this user from Firestore
        try {
          const userSessions = await getSessions(user.id)
          set({ sessions: userSessions })
        } catch (e) {
          logger.error('Failed to load sessions from Firestore:', e)
        }

if (user.role === 'admin') {
          useAdminStore.getState().activateAdmin('', user.id)
        } else if (isUserLimitedAdmin(user.id)) {
          useAdminStore.getState().activateAdmin('', user.id)
        }

        return true
      },

      logout: async () => {
        // Sign out from Firebase Auth
        await signOutFromFirebaseAuth()
        
        useAdminStore.getState().deactivateAdmin()
        set({
          user: null, 
          isAuthenticated: false, 
          lastAuthTime: null,
          pendingAuthCode: null,
          pendingUserId: null,
          codeVerified: false
        })
      },

      logoutSession: async (sessionId: string) => {
        const state = get()
        const sessionToDelete = state.sessions.find(s => s.id === sessionId)
        
// Delete from Firestore
        try {
          await deleteSession(sessionId)
        } catch (e) {
          logger.error('Failed to delete session from Firestore:', e)
        }
        
        // If deleting the current session, logout the user completely
        if (sessionToDelete?.isCurrent) {
          // Sign out from Firebase Auth
          await signOutFromFirebaseAuth()
          
          useAdminStore.getState().deactivateAdmin()
          set({ 
            user: null, 
            isAuthenticated: false, 
            lastAuthTime: null,
            pendingAuthCode: null,
            pendingUserId: null,
            codeVerified: false,
            sessions: state.sessions.filter(s => s.id !== sessionId)
          })
        } else {
          set((state) => ({
            sessions: state.sessions.filter(s => s.id !== sessionId)
          }))
        }
      },

      checkSessionExpiry: () => {
        // Session expiry check disabled - user stays logged in
        return false
      },

      clearPendingAuth: () => {
        set({
          pendingAuthCode: null,
          pendingUserId: null
        })
      },

setSessions: (sessions: UserSession[]) => {
        set({ sessions })
      },

updateUser: (userData: Partial<User>) => {
        const state = get()
        if (!state.user) {
          logger.log('[updateUser] No user in state, skipping update')
          return
        }

        logger.log('[updateUser] Updating user data:', Object.keys(userData))
        const updatedUser = {
          ...state.user,
          ...userData
        }
        logger.log('[updateUser] Updated user:', updatedUser.id, updatedUser.login)
        set({
          user: updatedUser
        })
      }
}),
    {
      name: 'ava-auth',
// Don't persist password to avoid using old password
      partialize: (state) => {
        const partialState = {
          user: state.user ? {
            ...state.user,
            password: undefined // Exclude password from persistence
          } : null,
          isAuthenticated: state.isAuthenticated,
          lastAuthTime: state.lastAuthTime,
          sessions: state.sessions,
          codeVerified: state.codeVerified
        }
        logger.log('[persist] Saving state:', {
          userId: partialState.user?.id,
          hasPassword: !!state.user?.password,
          hasSelectedSphere: !!state.user?.selectedSphere,
          selectedSphere: state.user?.selectedSphere,
          isAuthenticated: partialState.isAuthenticated
        })
        return partialState
      },
      onRehydrateStorage: () => (state) => {
        logger.log('[persist] Rehydrating state:', {
          userId: state?.user?.id,
          hasPassword: !!state?.user?.password,
          isAuthenticated: state?.isAuthenticated
        })
      }
    }
  )
)

// Login with biometric authentication
export const loginWithBiometric = async (): Promise<{ success: boolean; error?: string }> => {
  logger.log('[loginWithBiometric] Starting biometric login')

  // Просто пытаемся аутентифицироваться - функция сама проверит есть ли credentials
  const result = await authenticateWithBiometric()

  if (!result.success || !result.userId) {
    logger.log('[loginWithBiometric] Biometric auth failed:', result.error)
    return { success: false, error: result.error || 'Ошибка аутентификации' }
  }

  const userId = result.userId
  logger.log('[loginWithBiometric] Biometric auth successful for user:', userId)

  try {
    // Sign in to Firebase Auth
    const authOk = await signInToFirebaseAuth(userId)
    if (!authOk) {
      await signInAnonymouslyToFirebase()
    }
    logger.log('[loginWithBiometric] ✅ Firebase Auth signed in')

    // Get user from Firestore
    const firestoreUsers = await getAllUsers()
    const firestoreUser = firestoreUsers.find(u => u.id === userId)

    if (!firestoreUser) {
      logger.log('[loginWithBiometric] User not found in Firestore')
      return { success: false, error: 'Пользователь не найден' }
    }

    // Get team member data
    const teamMember = TEAM_MEMBERS.find(u => u.id === userId)

    // Create user object
    const user: User = {
      ...teamMember,
      ...firestoreUser,
      id: firestoreUser.id || teamMember?.id || '',
      login: firestoreUser.login || teamMember?.login || '',
      password: firestoreUser.password || teamMember?.password || '',
      recoveryCode: firestoreUser.recoveryCode || teamMember?.recoveryCode || '',
      phone: firestoreUser.phone || teamMember?.phone || '',
      email: firestoreUser.email || teamMember?.email || '',
      authCode: firestoreUser.authCode || teamMember?.authCode || '',
    }

    // Create session
    const now = new Date().toISOString()
    const browserInfo = getBrowserInfo()
    const city = await getSessionCity()

    const newSession: UserSession = {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      browser: browserInfo.browser,
      device: browserInfo.device,
      deviceModel: browserInfo.deviceModel,
      os: browserInfo.os,
      loginAt: now,
      city,
      isCurrent: true
    }

    // Save session to Firestore
    try {
      await addSession({
        userId: newSession.userId,
        browser: newSession.browser,
        device: newSession.device,
        deviceModel: newSession.deviceModel,
        os: newSession.os,
        loginAt: newSession.loginAt,
        city: newSession.city,
        isCurrent: true
      })
    } catch (e) {
      logger.error('Failed to save session to Firestore:', e)
    }

    // Update store
    useAuthStore.setState({
      user,
      isAuthenticated: true,
      lastAuthTime: now,
      sessions: [newSession],
      codeVerified: true
    })

    // Load all sessions
    try {
      const userSessions = await getSessions(user.id)
      useAuthStore.setState({ sessions: userSessions })
    } catch (e) {
      logger.error('Failed to load sessions from Firestore:', e)
    }

// Activate admin if needed
    if (user.role === 'admin') {
      useAdminStore.getState().activateAdmin('', user.id)
    } else if (isUserLimitedAdmin(user.id)) {
      useAdminStore.getState().activateAdmin('', user.id)
    }

    logger.log('[loginWithBiometric] ✅ Login successful')
    return { success: true }
  } catch (error: any) {
    logger.error('[loginWithBiometric] ❌ Error:', error?.code || error?.message || error)
    return { success: false, error: 'Ошибка входа' }
  }
}

