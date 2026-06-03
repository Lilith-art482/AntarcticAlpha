// Utility functions for user data
import { TEAM_MEMBERS } from '@/types'
import { getUserNicknameValue, getAllUsers } from '@/services/firestoreService'

// Default nickname map (from ManagementTable)
const defaultNicknameMap: Record<string, string> = {
  '1': 'Dex',
  '2': 'Enowk',
  '3': 'Xenia',
  '4': 'Olenka',
  '5': 'Sydney',
}

// Cache for custom nicknames to avoid multiple async calls
const nicknameCache = new Map<string, string | null>()

/**
 * Get user nickname - checks custom nickname first, then default nickname map, then login
 * This is a synchronous version that uses cache
 */
export const getUserNicknameSync = (userId: string): string => {
  // Check cache first
  const cached = nicknameCache.get(userId)
  if (cached !== undefined) {
    return cached || defaultNicknameMap[userId] || TEAM_MEMBERS.find((m) => m.id === userId)?.login || userId
  }

  // Return default if not in cache
  return defaultNicknameMap[userId] || TEAM_MEMBERS.find((m) => m.id === userId)?.login || userId
}

/**
 * Get user nickname - async version that fetches from Firestore
 * Use this when you need the most up-to-date value
 */
export const getUserNicknameAsync = async (userId: string): Promise<string> => {
  try {
    const customNickname = await getUserNicknameValue(userId)
    if (customNickname) {
      nicknameCache.set(userId, customNickname)
      return customNickname
    }

    const defaultNickname = defaultNicknameMap[userId] || TEAM_MEMBERS.find((m) => m.id === userId)?.login || userId
    nicknameCache.set(userId, null) // Cache null to indicate no custom nickname
    return defaultNickname
  } catch (error) {
    console.error('Error fetching user nickname:', error)
    return getUserNicknameSync(userId)
  }
}

/**
 * Clear nickname cache for a user (call after nickname change is approved)
 */
export const clearNicknameCache = (userId: string) => {
  nicknameCache.delete(userId)
}

/**
 * Clear all nickname cache
 */
export const clearAllNicknameCache = () => {
  nicknameCache.clear()
}

// Legacy aliases for backward compatibility (will be removed)
export const getUserLoginSync = getUserNicknameSync
export const getUserLoginAsync = getUserNicknameAsync
export const clearLoginCache = clearNicknameCache
export const clearAllLoginCache = clearAllNicknameCache

// Login/Password Generation Utilities
const ADJECTIVES = [
  'fast', 'smart', 'bright', 'cool', 'wise', 'bold', 'calm', 'eager', 'easy', 'fair',
  'glad', 'kind', 'lucky', 'nice', 'proud', 'silly', 'vivid', 'warm', 'young', 'happy',
  'prime', 'neo', 'super', 'mega', 'ultra', 'hyper', 'max', 'top', 'pro', 'maxi'
]

const SPECIAL_CHARS = '!@#$%&*'

/**
 * Generate a random password
 */
export const generatePassword = (length: number = 10): string => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const numbers = '0123456789'

  const allChars = lowercase + numbers + uppercase + SPECIAL_CHARS
  let password = ''

  // Ensure at least one of each required type
  password += lowercase[Math.floor(Math.random() * lowercase.length)]
  password += numbers[Math.floor(Math.random() * numbers.length)]
  password += uppercase[Math.floor(Math.random() * uppercase.length)]
  password += SPECIAL_CHARS[Math.floor(Math.random() * SPECIAL_CHARS.length)]

  // Fill remaining length
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)]
  }

  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('')
}

/**
 * Generate a unique login based on name
 */
export const generateLogin = (name: string, existingLogins: string[] = []): string => {
  // Clean the name - take first word, lowercase, remove special chars
  const baseName = name.split(' ')[0]
    .toLowerCase()
    .replace(/[^a-zа-яё0-9]/gi, '')
    .slice(0, 8)

  // Try base name first
  if (!existingLogins.includes(baseName)) {
    return baseName
  }

  // Try with random number suffix
  const suffix = Math.floor(Math.random() * 90 + 10) // 10-99
  const loginWithNumber = `${baseName}${suffix}`
  if (!existingLogins.includes(loginWithNumber)) {
    return loginWithNumber
  }

  // Try with adjective prefix
  const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]
  const loginWithAdj = `${adjective}${baseName}`
  if (!existingLogins.includes(loginWithAdj)) {
    return loginWithAdj
  }

  // Try with number suffix on adjective version
  const loginFinal = `${adjective}${baseName}${suffix}`
  return loginFinal
}

/**
 * Generate complete credentials for a new user
 */
export const generateUserCredentials = (name: string, existingUsers: { login: string }[] = []): { login: string; password: string } => {
  const existingLogins = existingUsers.map(u => u.login)
  const login = generateLogin(name, existingLogins)
  const password = generatePassword(12)
  return { login, password }
}

/**
 * React hook for user nickname that automatically updates when nickname changes
 */
import { useState, useEffect } from 'react'

export const useUserNickname = (userId: string): string => {
  const [nickname, setNickname] = useState(() => getUserNicknameSync(userId))

  useEffect(() => {
    // Initial fetch
    getUserNicknameAsync(userId).then(val => setNickname(val))

    const handleUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<{ userId: string }>
      if (!customEvent.detail?.userId || customEvent.detail.userId === userId) {
        getUserNicknameAsync(userId).then(val => setNickname(val))
      }
    }

    window.addEventListener('nicknameUpdated', handleUpdate)
    window.addEventListener('userUpdated', handleUpdate)
    return () => {
      window.removeEventListener('nicknameUpdated', handleUpdate)
      window.removeEventListener('userUpdated', handleUpdate)
    }
  }, [userId])

  return nickname
}

/**
 * React hook for user avatar that automatically updates
 */
export const useUserAvatar = (userId: string, initialAvatar?: string): string | undefined => {
  const [avatar, setAvatar] = useState(initialAvatar)

  useEffect(() => {
    const fetchAvatar = async () => {
      // Find in TEAM_MEMBERS first
      const member = TEAM_MEMBERS.find(m => m.id === userId)
      let currentAvatar = member?.avatar

      // Then check Firestore (could be improved by adding getUserAvatar to firestoreService)
      try {
        const { users } = await getAllUsers().then(u => ({ users: u }))
        const firestoreUser = users.find(u => u.id === userId)
        if (firestoreUser?.avatar) {
          currentAvatar = firestoreUser.avatar
        }
      } catch (e) { /* ignore */ }

      setAvatar(currentAvatar)
    }

    // Всегда сбрасываем аватар при изменении userId, чтобы не показывать аватар предыдущего пользователя
    if (userId) {
      fetchAvatar()
    } else {
      setAvatar(undefined)
    }

    const handleUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<{ userId: string }>
      if (!customEvent.detail?.userId || customEvent.detail.userId === userId) {
        fetchAvatar()
      }
    }

    window.addEventListener('avatarUpdated', handleUpdate)
    window.addEventListener('userUpdated', handleUpdate)
    return () => {
      window.removeEventListener('avatarUpdated', handleUpdate)
      window.removeEventListener('userUpdated', handleUpdate)
    }
  }, [userId, initialAvatar])

  return avatar
}

/**
 * React hook for user positions (team status) that automatically updates
 */
export const useUserPositions = (userId: string): string[] => {
  const [positions, setPositions] = useState<string[]>([])

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const { users } = await getAllUsers().then(u => ({ users: u }))
        const firestoreUser = users.find(u => u.id === userId)
        if (firestoreUser?.positions) {
          setPositions(firestoreUser.positions)
        } else {
          // Fallback to TEAM_MEMBERS for basic users
          const member = TEAM_MEMBERS.find(m => m.id === userId)
          if (member?.role) {
            setPositions([member.role])
          } else {
            setPositions([])
          }
        }
      } catch (e) {
        console.error('Error fetching user positions:', e)
        setPositions([])
      }
    }

    if (userId) {
      fetchPositions()
    } else {
      setPositions([])
    }

    const handleUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<{ userId: string }>
      if (!customEvent.detail?.userId || customEvent.detail.userId === userId) {
        fetchPositions()
      }
    }

    window.addEventListener('userUpdated', handleUpdate)
    return () => {
      window.removeEventListener('userUpdated', handleUpdate)
    }
  }, [userId])

  return positions
}
