import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, TEAM_MEMBERS, UserSession } from '@/types'
import { getAllUsers, getSessions, addSession, deleteSession } from '@/services/firestoreService'
import { useAdminStore, isUserLimitedAdmin } from './adminStore'
import { logger } from '@/utils/logger'
import { authenticateWithBiometric } from '@/utils/webAuthn'

// Mapping from TEAM_MEMBERS userId to Firebase Auth email (deprecated - keeping for backward compatibility)
const USER_EMAIL_MAP: Record<string, string> = {
  '1': 'dexim@antarctic-alpha.com',
  '2': 'enowk@antarctic-alpha.com',
  '3': 'xenia@antarctic-alpha.com',
  '4': 'olga@antarctic-alpha.com',
}

// Mapping from Firebase Auth uid to TEAM_MEMBERS userId (deprecated)
const FIREBASE_UID_TO_USER_ID: Record<string, string> = {
  'FHwKUQvz5tZICvazx37Id2yWSd72': '1', // dexim (Артём) - admin
  'YPGjIOIF5fPID7KuQNC0untA49E2': '2', // enowk (Адель)
  'yeH1O6eYHzcYNo82zNC6wltkXYk2': '3', // xenia (Ксения) - admin
  'UybkXhhXyIhjmHHYnRC8V1yOQCJ2': '4', // olga (Ольга)
}

// Mapping from TEAM_MEMBERS userId to Firebase Auth uid (deprecated)
const USER_ID_TO_FIREBASE_UID: Record<string, string> = {
  '1': 'FHwKUQvz5tZICvazx37Id2yWSd72', // dexim (Артём) - admin
  '2': 'YPGjIOIF5fPID7KuQNC0untA49E2', // enowk (Адель)
  '3': 'yeH1O6eYHzcYNo82zNC6wltkXYk2', // xenia (Ксения) - admin
  '4': 'UybkXhhXyIhjmHHYnRC8V1yOQCJ2', // olga (Ольга)
}

// Firebase Auth passwords (deprecated - no longer used)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const FIREBASE_AUTH_PASSWORD = 'AntarcticAlpha2024!' // Same for all users

// Build reverse lookup from login/phone to userId for faster Firebase Auth sign-in (deprecated)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getUserIdByLoginOrPhone = (input: string): string | null => {
  const normalizedInput = input.replace(/\D/g, '')
  for (const tm of TEAM_MEMBERS) {
    if (tm.login === input) return tm.id
    if (tm.phone && tm.phone.replace(/\D/g, '') === normalizedInput) return tm.id
  }
  return null
}

// Get TEAM_MEMBERS userId from Firebase Auth uid (deprecated)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getUserIdFromFirebaseUid = (firebaseUid: string): string | null => {
  return FIREBASE_UID_TO_USER_ID[firebaseUid] || null
}

// Get Firebase Auth uid from TEAM_MEMBERS userId (deprecated)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

// Sign in to Firebase Auth (deprecated - kept for backward compatibility)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const signInToFirebaseAuth = async (userId: string): Promise<boolean> => {
  return false
}

// Sign in anonymously to Firebase (deprecated - kept for backward compatibility)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const signInAnonymouslyToFirebase = async (): Promise<boolean> => {
  return false
}

// Sign out from Firebase Auth (deprecated - kept for backward compatibility)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const signOutFromFirebaseAuth = async (): Promise<void> => {
  return
}

// Helper to ensure correct Firebase Auth session (deprecated - kept for backward compatibility)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const ensureFirebaseAuthForUser = async (userId: string): Promise<boolean> => {
  return false
}

// Initialize Firebase Auth (deprecated - kept for backward compatibility)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const initializeFirebaseAuth = async (): Promise<void> => {
  return
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
        
        // Normalize login input
        const normalizedLogin = login.trim()
        const normalizedInput = normalizedLogin.replace(/\D/g, '') // Remove all non-digits for phone comparison
        
        // Get all users from Firestore
        try {
          logger.log('[login] Fetching users from Firestore...')
          const firestoreUsers = await getAllUsers()
          logger.log('[login] Firestore users count:', firestoreUsers.length)
          
          // Find user by login/email OR phone number
          let firestoreUser = firestoreUsers.find((u) => {
            // Try login match first
            if (u.login === normalizedLogin) return true
            
            // Try email field match
            if (u.email && u.email === normalizedLogin) return true
            
            // Try phone match (normalize both to digits only)
            if (u.phone) {
              const userPhoneNormalized = u.phone.replace(/\D/g, '')
              if (userPhoneNormalized === normalizedInput) return true
            }
            
            return false
          })

          if (!firestoreUser) {
            logger.log('[login] ❌ User not found in Firestore')
            return { success: false }
          }
          
          logger.log('[login] ✅ Found user in Firestore:', firestoreUser.id, firestoreUser.login)
          logger.log('[login] Firestore password length:', firestoreUser.password?.length || 0)
          logger.log('[login] Input password length:', password?.length)
          logger.log('[login] Passwords match:', firestoreUser.password === password)
            
          // Verify password
          if (firestoreUser.password !== password) {
            logger.log('[login] ❌ Password mismatch')
            logger.log('[login] Expected (from Firestore):', firestoreUser.password?.substring(0, 10) + '...')
            logger.log('[login] Received (input):', password?.substring(0, 10) + '...')
            return { success: false }
          }
          logger.log('[login] ✅ Password correct')

          // Check if user has authCode - require verification
          if (firestoreUser.authCode) {
            logger.log('[login] User has authCode:', firestoreUser.authCode, 'requiring verification')
            set({ 
              pendingUserId: firestoreUser.id,
              pendingAuthCode: firestoreUser.authCode 
            })
            return { success: true, requiresCode: true }
          }
          logger.log('[login] No authCode required, proceeding with full login')

          // Full login - create session
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

          // Use Firestore data directly
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

          logger.log('[login] Login successful (Firestore only)')
          return { success: true, requiresCode: false }
          
        } catch (error: any) {
          logger.error('[login] ❌ Error:', error?.code || error?.message || error)
          return { success: false }
        }
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
        
        // Get user data from Firestore
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

