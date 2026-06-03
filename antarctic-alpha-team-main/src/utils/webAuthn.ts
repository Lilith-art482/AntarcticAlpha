/**
 * WebAuthn utility for biometric authentication
 * Uses WebAuthn API (FIDO2) for passwordless authentication
 */

export interface WebAuthnCredential {
  id: string
  userId: string
  userName: string
  createdAt: string
  deviceName: string
}

export interface WebAuthnCredentialStorage {
  credentials: WebAuthnCredential[]
}

// Storage key for credentials
const STORAGE_KEY = 'arca-webauthn-credentials'

/**
 * Check if WebAuthn is supported by the browser
 */
export const isWebAuthnSupported = (): boolean => {
  if (typeof navigator === 'undefined') return false
  if (!navigator.credentials) return false
  if (!navigator.credentials.create) return false
  if (!navigator.credentials.get) return false
  return true
}

/**
 * Check if device has biometric capability (Touch ID / Face ID / Windows Hello)
 */
export const isBiometricAvailable = async (): Promise<boolean> => {
  if (!isWebAuthnSupported()) return false

  try {
    // Try to get existing credentials to check if biometrics are enrolled
    await navigator.credentials.get({
      publicKey: {
        challenge: new Uint8Array(32),
        timeout: 1000,
        userVerification: 'preferred'
      }
    })
    return true
  } catch (error) {
    // If no credentials exist, WebAuthn might still work but user needs to set up first
    const err = error as Error
    if (err.name === 'NotAllowedError') {
      // User cancelled or no credentials - but biometrics might still be available
      return true
    }
    if (err.name === 'NotSupportedError') {
      return false
    }
    return true // Assume available, let user try
  }
}

/**
 * Get stored credentials from localStorage
 */
export const getStoredCredentials = (): WebAuthnCredentialStorage => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Error reading WebAuthn credentials:', error)
  }
  return { credentials: [] }
}

/**
 * Save credentials to localStorage
 */
const saveCredentials = (storage: WebAuthnCredentialStorage): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storage))
  } catch (error) {
    console.error('Error saving WebAuthn credentials:', error)
  }
}

/**
 * Check if user has any registered credentials on this device
 */
export const hasRegisteredCredentials = (userId?: string): boolean => {
  const storage = getStoredCredentials()
  if (userId) {
    return storage.credentials.some(c => c.userId === userId)
  }
  return storage.credentials.length > 0
}

/**
 * Get credentials for a specific user
 */
export const getCredentialsForUser = (userId: string): WebAuthnCredential[] => {
  const storage = getStoredCredentials()
  return storage.credentials.filter(c => c.userId === userId)
}

/**
 * Register a new credential (called after successful password login)
 * This creates a WebAuthn credential tied to the user
 */
export const registerBiometric = async (
  userId: string,
  userName: string
): Promise<{ success: boolean; error?: string }> => {
  if (!isWebAuthnSupported()) {
    return { success: false, error: 'WebAuthn не поддерживается в этом браузере' }
  }

  try {
    // Generate a random challenge
    const challenge = new Uint8Array(32)
    crypto.getRandomValues(challenge)

    // Get device info for display
    const deviceName = getDeviceName()

    // Create credential
    const credential = await navigator.credentials.create({
      publicKey: {
        challenge,
        rp: {
          name: 'ARCA Team',
          id: window.location.hostname
        },
        user: {
          id: new TextEncoder().encode(userId),
          name: userName,
          displayName: userName
        },
        pubKeyCredParams: [
          { type: 'public-key', alg: -7 }, // ES256
          { type: 'public-key', alg: -257 } // RS256
        ],
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          userVerification: 'preferred'
        },
        timeout: 60000
      }
    }) as PublicKeyCredential

    if (!credential) {
      return { success: false, error: 'Не удалось создать учетные данные' }
    }

    // Store the credential ID - сохраняем как есть (строка)
    // console.log('Credential ID type:', typeof credential.id, credential.id.substring(0, 50))
    const credentialData: WebAuthnCredential = {
      id: credential.id as string,
      userId,
      userName,
      createdAt: new Date().toISOString(),
      deviceName
    }

    // Save to localStorage
    const storage = getStoredCredentials()
    
    // Check if THIS credential already registered (same browser)
    const existingIndex = storage.credentials.findIndex(c => c.id === credential.id)
    if (existingIndex >= 0) {
      return { success: false, error: 'Биометрия уже привязана' }
    }

    // Add new credential
    storage.credentials.push(credentialData)
    saveCredentials(storage)

    return { success: true }
  } catch (error) {
    const err = error as Error
    console.error('WebAuthn registration error:', err)

    if (err.name === 'NotAllowedError') {
      return { success: false, error: 'Отменено пользователем' }
    }
    if (err.name === 'NotSupportedError') {
      return { success: false, error: 'Устройство не поддерживает биометрию' }
    }
    if (err.name === 'SecurityError') {
      return { success: false, error: 'Ошибка безопасности' }
    }

    return { success: false, error: err.message || 'Ошибка при регистрации биометрии' }
  }
}

/**
 * Authenticate using registered biometric
 */
export const authenticateWithBiometric = async (
  _userId?: string
): Promise<{ success: boolean; userId?: string; error?: string }> => {
  if (!isWebAuthnSupported()) {
    return { success: false, error: 'WebAuthn не поддерживается' }
  }

  try {
    // Generate challenge
    const challenge = new Uint8Array(32)
    crypto.getRandomValues(challenge)

    // Request biometric authentication - НЕ ограничиваем allowCredentials
    // Система сама предложит все доступные credential из Keychain
    const assertion = await navigator.credentials.get({
      publicKey: {
        challenge,
        timeout: 60000,
        userVerification: 'preferred'
      }
    }) as PublicKeyCredential | null

    if (!assertion) {
      return { success: false, error: 'Аутентификация отменена' }
    }

    // Get the credential ID from the assertion
    let credentialId: string
    if (typeof assertion.id === 'string') {
      credentialId = assertion.id
    } else {
      credentialId = btoa(String.fromCharCode(...new Uint8Array(assertion.id)))
    }
    
    // Получаем userHandle - это userId который мы передали при регистрации
    const authResponse = assertion.response as AuthenticatorAssertionResponse
    const userHandle = authResponse.userHandle
    let returnedUserId: string | undefined
    if (userHandle) {
      if (typeof userHandle === 'string') {
        returnedUserId = userHandle
      } else {
        returnedUserId = new TextDecoder().decode(userHandle)
      }
    }

    // Get stored credentials
    const storage = getStoredCredentials()
    
    // Ищем существующий credential
    let matchedCredential = storage.credentials.find(c => c.id === credentialId)

    // Если не найден - добавляем
    if (!matchedCredential) {
      // Используем userId из userHandle если есть, иначе из storage
      const targetUserId = returnedUserId || (storage.credentials[0]?.userId)
      
      if (!targetUserId) {
        return { success: false, error: 'Биометрия не привязана. Войдите по паролю и привяжите биометрию.' }
      }

      matchedCredential = {
        id: credentialId,
        userId: targetUserId,
        userName: 'Новое устройство',
        createdAt: new Date().toISOString(),
        deviceName: getDeviceName()
      }
      storage.credentials.push(matchedCredential)
      saveCredentials(storage)
    }

    return { success: true, userId: matchedCredential.userId }
  } catch (error) {
    const err = error as Error
    console.error('WebAuthn authentication error:', err)

    if (err.name === 'NotAllowedError') {
      return { success: false, error: 'Отменено пользователем' }
    }
    if (err.name === 'NotFoundError') {
      return { success: false, error: 'Биометрия не настроена. Привяжите биометрию в настройках.' }
    }
    if (err.name === 'SecurityError') {
      return { success: false, error: 'Ошибка безопасности. Попробуйте еще раз.' }
    }

    return { success: false, error: err.message || 'Ошибка аутентификации' }
  }
}

/**
 * Remove credentials for a user (both local and from server)
 */
export const removeBiometricCredentials = async (userId: string): Promise<void> => {
  // Remove from localStorage
  const storage = getStoredCredentials()
  storage.credentials = storage.credentials.filter(c => c.userId !== userId)
  saveCredentials(storage)
  
  // TODO: Remove from Firestore when sync is implemented
  console.log('Biometric credentials removed for user:', userId)
}

/**
 * Get device name for display
 */
const getDeviceName = (): string => {
  const ua = navigator.userAgent

  if (ua.includes('iPhone')) return 'iPhone'
  if (ua.includes('iPad')) return 'iPad'
  if (ua.includes('Mac')) return 'Mac'
  if (ua.includes('Windows')) return 'Windows PC'
  if (ua.includes('Android')) return 'Android'
  
  return 'Устройство'
}
