import { useState, useEffect } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore, ensureFirebaseAuthForUser } from '@/store/authStore'
import { useAdminStore, ADMIN_PASSWORD } from '@/store/adminStore'
import { useViewedUserStore } from '@/store/viewedUserStore'
import { useEffectiveUserId } from '@/hooks/useEffectiveUserId'
import {
  getRatingData,
  getEarnings,
  getDayStatuses,
  getReferrals,
  getWorkSlots,
  getUserWallets,
  addWallet,
  updateWallet,
  deleteWallet,
  setWalletPinCode,
  verifyWalletPinCode,
  hasWalletPinCode,
  getPinChangeInfo,
  changeWalletPinCode,
  updateUserEmail,
  updateUserPhone,
  updateUserLogin,
  updateUserPassword,
  updateUserRecoveryCode,
  updateUserAuthCode,
  savePersonalData,
  setPersonalDataPinCode,
  verifyPersonalDataPinCode,
  submitPersonalDataForVerification,
  getPersonalDataVerificationByUserId,
} from '@/services/firestoreService'
import type { PersonalDataVerificationStatus } from '@/types'
import {
  getWeekRange,
  getLastNDaysRange,
  formatDate,
  calculateHours,
  countDaysInPeriod
} from '@/utils/dateUtils'
import { calculateRating, getRatingBreakdown } from '@/utils/ratingUtils'
import { RatingData, Earnings, DayStatus, WorkSlot, UserWallet } from '@/types'
import {
  LogOut,
  TrendingUp,
  Shield,
  Info,
  DollarSign,
  Clock,
  Users,
  AlertTriangle,
  AlertCircle,
  Lightbulb,
  Copy,
  Check,
  User as UserIcon,
  Key,
  Smartphone,
  Lock,
  Unlock,
  KeyRound,
  Plus,
  Trash2,
  Coins,
  FileText,
  X,
  Eye,
  EyeOff,
  Download,
  RefreshCw,
  ExternalLink,
  Pencil,
  Wallet,
  PiggyBank,
  Calendar,
  Fingerprint,
  Sun,
  Moon,
  HelpCircle,
  Send,
  MessageCircle,
  AtSign,
} from 'lucide-react'
import { isWebAuthnSupported, hasRegisteredCredentials, registerBiometric, removeBiometricCredentials, authenticateWithBiometric } from '@/utils/webAuthn'
import { useNavigate } from 'react-router-dom'
import { TEAM_MEMBERS } from '@/types'
import { useUserAvatar } from '@/utils/userUtils'
import { useRatesStore } from '@/store/ratesStore'

// Тип для баланса кошелька
interface WalletBalance {
  sol: number
  usd: number
  loading: boolean
}

// Fixed mask for sensitive data (prevents jitter on re-render)
const SENSITIVE_MASK = '••••••••'

export const Profile = () => {
  const { theme, toggleTheme } = useThemeStore()
  const { user, logout } = useAuthStore()
  const { isAdmin, deactivateAdmin } = useAdminStore()
  const { isViewingOtherUser } = useViewedUserStore()
  const effectiveUserId = useEffectiveUserId()
  const navigate = useNavigate()
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [allCopied, setAllCopied] = useState(false)

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)

  // Show toast helper
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  // Show/hide credentials state
  const [showCredentials, setShowCredentials] = useState(false)
  const [credentialsTimer, setCredentialsTimer] = useState<number | null>(null)

  // Code verification state for profile
  const [showCodeModal, setShowCodeModal] = useState(false)
  const [profileCode, setProfileCode] = useState('')
  const [codeError, setCodeError] = useState('')
  const [pendingShowCredentials, setPendingShowCredentials] = useState(false)

  // Wallets state
  const [wallets, setWallets] = useState<UserWallet[]>([])
  const [walletsLoading, setWalletsLoading] = useState(false)
  const [showWalletsModal, setShowWalletsModal] = useState(false)
  const [showAddWalletModal, setShowAddWalletModal] = useState(false)
  const [viewingWallet, setViewingWallet] = useState<UserWallet | null>(null)
  const [editingWallet, setEditingWallet] = useState<UserWallet | null>(null)
  const [walletFormData, setWalletFormData] = useState({
    name: '',
    address: '',
    privateKey: '',
    seedPhrase: '',
    comment: ''
  })
  const [walletSaving, setWalletSaving] = useState(false)
  const [walletToDelete, setWalletToDelete] = useState<UserWallet | null>(null)

  // Wallet credentials visibility state (like profile credentials)
  const [showWalletCredentials, setShowWalletCredentials] = useState(false)
  const [activeCredentialWalletId, setActiveCredentialWalletId] = useState<string | null>(null)
  const [walletCredentialsTimer, setWalletCredentialsTimer] = useState<number | null>(null)

  // Wallet PIN Code states
  const [hasPinCode, setHasPinCode] = useState(false)
  const [isWalletsUnlocked, setIsWalletsUnlocked] = useState(false)
  const [showSetPinModal, setShowSetPinModal] = useState(false)
  const [showUnlockModal, setShowUnlockModal] = useState(false)
  const [showChangePinModal, setShowChangePinModal] = useState(false)
  const [pinCode, setPinCode] = useState('')
  const [confirmPinCode, setConfirmPinCode] = useState('')
  const [pinCodeError, setPinCodeError] = useState('')
  const [pinCodeStep, setPinCodeStep] = useState<'first' | 'confirm'>('first')
  const [pinCodeLoading, setPinCodeLoading] = useState(false)
  const [showPinCode, setShowPinCode] = useState(false)
  const [showConfirmPinCode, setShowConfirmPinCode] = useState(false)

  // Change PIN states
  const [oldPinCode, setOldPinCode] = useState('')
  const [newPinCode, setNewPinCode] = useState('')
  const [confirmNewPinCode, setConfirmNewPinCode] = useState('')
  const [changePinAuthCode, setChangePinAuthCode] = useState('')
  const [changePinStep, setChangePinStep] = useState<'verify' | 'new' | 'confirm'>('verify')
  const [pinChangeInfo, setPinChangeInfo] = useState<{
    changesThisMonth: number
    remainingChanges: number
    canChange: boolean
  }>({ changesThisMonth: 0, remainingChanges: 3, canChange: true })

  // Wallet balances state
  const [walletBalances, setWalletBalances] = useState<Record<string, WalletBalance>>({})
  const [balancesLoading, setBalancesLoading] = useState(false)

  // Wallets AW states (TRC-20 and TON)
  const [awWallets, setAwWallets] = useState<{
    trc20: string
    ton: string
  }>({ trc20: '', ton: '' })
  const [awWalletSaving, setAwWalletSaving] = useState(false)
  const [awCopiedField, setAwCopiedField] = useState<string | null>(null)
  const [awEditMode, setAwEditMode] = useState<{
    trc20: boolean
    ton: boolean
  }>({ trc20: false, ton: false })
  const [awTempWallet, setAwTempWallet] = useState('')

// Email and Phone edit states
  const [isEditingPhone, setIsEditingPhone] = useState(false)
  const [isEditingEmail, setIsEditingEmail] = useState(false)
  const [isEditingTelegram, setIsEditingTelegram] = useState(false)
  const [isEditingDiscord, setIsEditingDiscord] = useState(false)
  const [isEditingVK, setIsEditingVK] = useState(false)
  const [isEditingX, setIsEditingX] = useState(false)
  const [isEditingLogin, setIsEditingLogin] = useState(false)
  const [isEditingPassword, setIsEditingPassword] = useState(false)
  const [isEditingRecoveryCode, setIsEditingRecoveryCode] = useState(false)
  const [isEditingAuthCode, setIsEditingAuthCode] = useState(false)
  const [tempPhone, setTempPhone] = useState('')
  const [tempEmail, setTempEmail] = useState('')
  const [tempTelegram, setTempTelegram] = useState('')
  const [tempDiscord, setTempDiscord] = useState('')
  const [tempVK, setTempVK] = useState('')
  const [tempX, setTempX] = useState('')
  const [tempLogin, setTempLogin] = useState('')
  const [tempPassword, setTempPassword] = useState('')
  const [tempRecoveryCode, setTempRecoveryCode] = useState('')
  const [tempAuthCode, setTempAuthCode] = useState('')
  const [isSavingContact, setIsSavingContact] = useState(false)

  // Phone and Email from Firestore (not from authStore)
  const [userPhone, setUserPhone] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [userTelegram, setUserTelegram] = useState('')
  const [userDiscord, setUserDiscord] = useState('')
  const [userVK, setUserVK] = useState('')
  const [userX, setUserX] = useState('')
  const [userLogin, setUserLogin] = useState('')
  const [userPassword, setUserPassword] = useState('')
  const [userRecoveryCode, setUserRecoveryCode] = useState('')
  const [userAuthCode, setUserAuthCode] = useState('')

  // Biometric authentication state
  const [biometricRegistered, setBiometricRegistered] = useState(false)
  const [biometricLoading, setBiometricLoading] = useState(false)

  // Personal data state
  const [personalData, setPersonalData] = useState({
    lastName: '',
    firstName: '',
    middleName: '',
    birthDate: '',
    birthPlace: '',
    registrationAddress: '',
    residenceAddress: '',
    passportSeries: '',
    passportNumber: '',
    passportIssuedBy: '',
    passportIssueDate: '',
    passportDepartmentCode: '',
    inn: '',
    passportPhotos: [] as string[],
    passportPhotosLink: '',
    passportPhotosPassword: '',
  })
  const [isEditingPersonalData, setIsEditingPersonalData] = useState(false)
  const [tempPersonalData, setTempPersonalData] = useState(personalData)
  const [isSavingPersonalData, setIsSavingPersonalData] = useState(false)
  const [showWhyModal, setShowWhyModal] = useState(false)
  const [showPassportInstructionModal, setShowPassportInstructionModal] = useState(false)

  // Personal data unlock states
  const [hasPersonalDataPin, setHasPersonalDataPin] = useState(false)
  const [isPersonalDataUnlocked, setIsPersonalDataUnlocked] = useState(false)
  const [showPersonalDataUnlockModal, setShowPersonalDataUnlockModal] = useState(false)
  const [showPersonalDataSetPinModal, setShowPersonalDataSetPinModal] = useState(false)
  const [personalDataPin, setPersonalDataPin] = useState('')
  const [personalDataPinConfirm, setPersonalDataPinConfirm] = useState('')
  const [personalDataPinError, setPersonalDataPinError] = useState('')
  const [personalDataPinStep, setPersonalDataPinStep] = useState<'first' | 'confirm'>('first')
  const [personalDataPinLoading, setPersonalDataPinLoading] = useState(false)
  const [showPersonalDataPin, setShowPersonalDataPin] = useState(false)
  const [showPersonalDataPinConfirm, setShowPersonalDataPinConfirm] = useState(false)
  const [personalDataBiometricLoading, setPersonalDataBiometricLoading] = useState(false)

  // Personal data verification state
  const [personalDataVerificationStatus, setPersonalDataVerificationStatus] = useState<PersonalDataVerificationStatus | null>(null)
  const [verificationLoading, setVerificationLoading] = useState(false)
  const [dmComment, setDmComment] = useState<string | null>(null)
  const [showDmCommentModal, setShowDmCommentModal] = useState(false)

  // Check biometric status on mount and when user changes
  useEffect(() => {
    if (user?.id) {
      const checkBiometric = async () => {
        const registered = await hasRegisteredCredentials(user.id)
        setBiometricRegistered(registered)
      }
      checkBiometric()
    }
  }, [user?.id])



  // Rates store for SOL price
  const { rates } = useRatesStore()

  // Use effective user ID (viewed user or current user)
  const targetUserId = effectiveUserId || user?.id || 'admin'

  // Helper to format date from YYYY-MM-DD to DD.MM.YYYY
  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return ''
    const parts = dateStr.split('-')
    if (parts.length === 3) {
      return `${parts[2]}.${parts[1]}.${parts[0]}`
    }
    return dateStr
  }

  // Helper to mask sensitive data (show only last 4 characters)
  const maskData = (value: string, showLast: number = 4) => {
    if (!value) return ''
    if (value.length <= showLast) return '*'.repeat(value.length)
    return '*'.repeat(value.length - showLast) + value.slice(-showLast)
  }

  // Helper to mask name (show first letter and last name if full name)
  const maskName = (name: string) => {
    if (!name) return ''
    if (name.length <= 1) return '*'
    return name[0] + '*'.repeat(name.length - 1)
  }

  // Load personal data from Firestore
  const loadPersonalData = async () => {
    const userId = effectiveUserId || user?.id || 'admin'
    if (!userId) return
    try {
      const { doc, getDoc } = await import('firebase/firestore')
      const { db } = await import('@/services/firebase')
      const userDoc = await getDoc(doc(db, 'users', userId))
      if (userDoc.exists()) {
        const data = userDoc.data()
        setPersonalData({
          lastName: data.lastName || '',
          firstName: data.firstName || '',
          middleName: data.middleName || '',
          birthDate: data.birthDate || '',
          birthPlace: data.birthPlace || '',
          registrationAddress: data.registrationAddress || '',
          residenceAddress: data.residenceAddress || '',
          passportSeries: data.passportSeries || '',
          passportNumber: data.passportNumber || '',
          passportIssuedBy: data.passportIssuedBy || '',
          passportIssueDate: data.passportIssueDate || '',
          passportDepartmentCode: data.passportDepartmentCode || '',
          inn: data.inn || '',
          passportPhotos: data.passportPhotos || [],
          passportPhotosLink: data.passportPhotosLink || '',
          passportPhotosPassword: data.passportPhotosPassword || '',
        })
      }
    } catch (error) {
      console.error('Error loading personal ', error)
    }
  }

  // Validate personal data in modal before submission
  const validateTempPersonalData = (): { valid: boolean; missingFields: string[] } => {
    const missingFields: string[] = []

    if (!tempPersonalData.lastName?.trim()) missingFields.push('Фамилия')
    if (!tempPersonalData.firstName?.trim()) missingFields.push('Имя')
    if (!tempPersonalData.middleName?.trim()) missingFields.push('Отчество')
    if (!tempPersonalData.birthDate) missingFields.push('Дата рождения')
    if (!tempPersonalData.birthPlace?.trim()) missingFields.push('Место рождения')
    if (!tempPersonalData.registrationAddress?.trim()) missingFields.push('Адрес регистрации')
    if (!tempPersonalData.passportSeries?.trim()) missingFields.push('Серия паспорта')
    if (!tempPersonalData.passportNumber?.trim()) missingFields.push('Номер паспорта')
    if (!tempPersonalData.passportIssuedBy?.trim()) missingFields.push('Кем выдан')
    if (!tempPersonalData.passportIssueDate) missingFields.push('Дата выдачи')
    if (!tempPersonalData.passportDepartmentCode?.trim()) missingFields.push('Код подразделения')
    if (!tempPersonalData.inn?.trim()) missingFields.push('ИНН')

    return { valid: missingFields.length === 0, missingFields }
  }

  // Save personal data and submit for verification
  const handleSavePersonalData = async () => {
    const userId = effectiveUserId || user?.id || 'admin'
    if (!userId) return

    // Validate all required fields
    const { valid, missingFields } = validateTempPersonalData()

    if (!valid) {
      showToast(`Заполните обязательные поля:\n${missingFields.join(', ')}`, 'error')
      return
    }

    // Check if already verified or pending
    if (personalDataVerificationStatus === 'approved') {
      showToast('Персональные данные уже верифицированы', 'info')
      return
    }

    if (personalDataVerificationStatus === 'pending') {
      showToast('Заявка на верификацию уже отправлена', 'info')
      return
    }

    setIsSavingPersonalData(true)
    try {
      // Save personal data first
      await savePersonalData(userId, {
        lastName: tempPersonalData.lastName,
        firstName: tempPersonalData.firstName,
        middleName: tempPersonalData.middleName,
        birthDate: tempPersonalData.birthDate,
        birthPlace: tempPersonalData.birthPlace,
        registrationAddress: tempPersonalData.registrationAddress,
        residenceAddress: tempPersonalData.residenceAddress,
        passportSeries: tempPersonalData.passportSeries,
        passportNumber: tempPersonalData.passportNumber,
        passportIssuedBy: tempPersonalData.passportIssuedBy,
        passportIssueDate: tempPersonalData.passportIssueDate,
        passportDepartmentCode: tempPersonalData.passportDepartmentCode,
        inn: tempPersonalData.inn,
        passportPhotos: tempPersonalData.passportPhotos,
        passportPhotosLink: tempPersonalData.passportPhotosLink,
        passportPhotosPassword: tempPersonalData.passportPhotosPassword,
      })

      // Update local state
      setPersonalData(tempPersonalData)

      // Submit for verification
      await submitPersonalDataForVerification(userId, tempPersonalData)
      setPersonalDataVerificationStatus('pending')

      setIsEditingPersonalData(false)
      showToast('Заявка на верификацию успешно отправлена!', 'success')
    } catch (error: any) {
      console.error('Error saving personal ', error)
      if (error.message?.includes('уже существует')) {
        showToast(error.message, 'error')
      } else {
        showToast('Ошибка при отправке заявки. Попробуйте ещё раз.', 'error')
      }
    } finally {
      setIsSavingPersonalData(false)
    }
  }

  // Load personal data on mount
  useEffect(() => {
    loadPersonalData()

    // Check if user has personal data PIN set
    const checkPersonalDataPin = async () => {
      const userId = effectiveUserId || user?.id
      if (!userId) return
      const { hasPersonalDataPinCode } = await import('@/services/firestoreService')
      const hasPin = await hasPersonalDataPinCode(userId)
      console.log('Personal data PIN set:', hasPin)
      setHasPersonalDataPin(hasPin)
    }
    checkPersonalDataPin()

    // Load personal data verification status
    const loadVerificationStatus = async () => {
      const userId = effectiveUserId || user?.id
      if (!userId) return
      try {
        const { doc, getDoc } = await import('firebase/firestore')
        const { db } = await import('@/services/firebase')
        const userDoc = await getDoc(doc(db, 'users', userId))
        if (userDoc.exists()) {
          const data = userDoc.data()
          const status = data.personalDataVerificationStatus as PersonalDataVerificationStatus | undefined
          setPersonalDataVerificationStatus(status || null)
        }
        // Also get DM comment if exists
        const verification = await getPersonalDataVerificationByUserId(userId)
        if (verification) {
          setDmComment(verification.dmComment || null)
        }
      } catch (error) {
        console.error('Error loading verification status:', error)
      }
    }
    loadVerificationStatus()
  }, [effectiveUserId, user?.id])

  // Load all user data from Firestore
  useEffect(() => {
    const loadUserData = async () => {
      if (!targetUserId) return
      try {
        const { doc, getDoc } = await import('firebase/firestore')
        const { db } = await import('@/services/firebase')
        const userDoc = await getDoc(doc(db, 'users', targetUserId))
        if (userDoc.exists()) {
          const data = userDoc.data()
          setUserPhone(data.phone || '')
          setUserEmail(data.email || '')
          setUserTelegram(data.telegram || '')
          setUserDiscord(data.discord || '')
          setUserVK(data.vk || '')
          setUserX(data.x || '')
          setUserLogin(data.login || '')
          setUserPassword(data.password || '')
          setUserRecoveryCode(data.recoveryCode || '')
          setUserAuthCode(data.authCode || '')
        }
      } catch (error) {
        console.error('Error loading user ', error)
      }
    }
    loadUserData()
  }, [targetUserId])

  // Get authCode from TEAM_MEMBERS based on target user
  const targetTeamMember = TEAM_MEMBERS.find(m => m.id === targetUserId)
  const targetAuthCode = targetTeamMember?.authCode

  const [rating, setRating] = useState<RatingData | null>(null)
  const [ratingBreakdown, setRatingBreakdown] = useState<ReturnType<typeof getRatingBreakdown> | null>(null)
  const [earningsSummary, setEarningsSummary] = useState<{
    total: number
    pool: number
    net: number
    weekly: { gross: number; pool: number; net: number }
  } | null>(null)
  const [loading, setLoading] = useState(true)

  // Get viewed user info if viewing other user
  const viewedUserMember = effectiveUserId ? TEAM_MEMBERS.find(m => m.id === effectiveUserId) : null

  const userData = user || (isAdmin ? { id: 'admin', name: 'Администратор', login: 'admin', password: ADMIN_PASSWORD, avatar: undefined } : null)
  const profileAvatar = useUserAvatar(targetUserId, userData?.id === targetUserId ? userData?.avatar : undefined)
  const profileInitial = userData?.name ? userData.name.charAt(0).toUpperCase() : 'A'

  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'

  const copyToClipboard = (text: string | undefined, field: string) => {
    if (!text) return
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const copyAllCredentials = () => {
    if (!userData) return
    const credentials = [
      userLogin || userData.login,
      userPassword || userData.password,
      userPhone || userData.phone,
      userEmail || userData.email,
      userRecoveryCode || userData.recoveryCode || targetTeamMember?.recoveryCode,
      userAuthCode || targetAuthCode || userData.authCode
    ].filter(Boolean).join('\n')
    navigator.clipboard.writeText(credentials)
    setAllCopied(true)
    setTimeout(() => setAllCopied(false), 2000)
  }

  const handleUpdatePhone = async () => {
    if (!targetUserId || !tempPhone) return
    setIsSavingContact(true)
    try {
      await updateUserPhone(targetUserId, tempPhone)
      setUserPhone(tempPhone)

      // Update authStore if editing own profile
      if (targetUserId === user?.id) {
        useAuthStore.getState().updateUser({ phone: tempPhone })
      }

      setIsEditingPhone(false)
    } catch (error) {
      console.error('Error updating phone:', error)
    } finally {
      setIsSavingContact(false)
    }
  }

  const handleUpdateEmail = async () => {
    if (!targetUserId || !tempEmail) return
    setIsSavingContact(true)
    try {
      await updateUserEmail(targetUserId, tempEmail)
      setUserEmail(tempEmail)

      // Update authStore if editing own profile
      if (targetUserId === user?.id) {
        useAuthStore.getState().updateUser({ email: tempEmail })
      }

      setIsEditingEmail(false)
    } catch (error) {
      console.error('Error updating email:', error)
    } finally {
      setIsSavingContact(false)
    }
  }

  const handleUpdateTelegram = async () => {
    if (!targetUserId) return
    setIsSavingContact(true)
    try {
      const { doc, updateDoc } = await import('firebase/firestore')
      const { db } = await import('@/services/firebase')
      await updateDoc(doc(db, 'users', targetUserId), { telegram: tempTelegram })
      setUserTelegram(tempTelegram)
      setIsEditingTelegram(false)
    } catch (error) {
      console.error('Error updating telegram:', error)
    } finally {
      setIsSavingContact(false)
    }
  }

  const handleUpdateDiscord = async () => {
    if (!targetUserId) return
    setIsSavingContact(true)
    try {
      const { doc, updateDoc } = await import('firebase/firestore')
      const { db } = await import('@/services/firebase')
      await updateDoc(doc(db, 'users', targetUserId), { discord: tempDiscord })
      setUserDiscord(tempDiscord)
      setIsEditingDiscord(false)
    } catch (error) {
      console.error('Error updating discord:', error)
    } finally {
      setIsSavingContact(false)
    }
  }

  const handleUpdateVK = async () => {
    if (!targetUserId) return
    setIsSavingContact(true)
    try {
      const { doc, updateDoc } = await import('firebase/firestore')
      const { db } = await import('@/services/firebase')
      await updateDoc(doc(db, 'users', targetUserId), { vk: tempVK })
      setUserVK(tempVK)
      setIsEditingVK(false)
    } catch (error) {
      console.error('Error updating vk:', error)
    } finally {
      setIsSavingContact(false)
    }
  }

  const handleUpdateX = async () => {
    if (!targetUserId) return
    setIsSavingContact(true)
    try {
      const { doc, updateDoc } = await import('firebase/firestore')
      const { db } = await import('@/services/firebase')
      await updateDoc(doc(db, 'users', targetUserId), { x: tempX })
      setUserX(tempX)
      setIsEditingX(false)
    } catch (error) {
      console.error('Error updating x:', error)
    } finally {
      setIsSavingContact(false)
    }
  }

  const handleUpdateLogin = async () => {
    if (!targetUserId || !tempLogin) return

    // Validate login format - must end with @antarctic-alpha
    if (!tempLogin.endsWith('@antarctic-alpha')) {
      alert('Логин должен заканчиваться на @antarctic-alpha')
      return
    }

    setIsSavingContact(true)
    try {
      await updateUserLogin(targetUserId, tempLogin)
      setUserLogin(tempLogin)

      // Update authStore if editing own profile
      if (targetUserId === user?.id) {
        useAuthStore.getState().updateUser({ login: tempLogin })
      }

      setIsEditingLogin(false)
    } catch (error) {
      console.error('Error updating login:', error)
    } finally {
      setIsSavingContact(false)
    }
  }

  const handleUpdatePassword = async () => {
    if (!targetUserId || !tempPassword) return
    setIsSavingContact(true)
    try {
      console.log('Updating password for user:', targetUserId, 'new password length:', tempPassword.length)
      await updateUserPassword(targetUserId, tempPassword)
      console.log('Password updated in Firestore')
      setUserPassword(tempPassword)

      // Update authStore if editing own profile
      if (targetUserId === user?.id) {
        console.log('Updating authStore with new password')
        useAuthStore.getState().updateUser({ password: tempPassword })
        console.log('AuthStore updated')
      }

      setIsEditingPassword(false)
      console.log('Password update complete')
    } catch (error) {
      console.error('Error updating password:', error)
    } finally {
      setIsSavingContact(false)
    }
  }

  const handleUpdateRecoveryCode = async () => {
    if (!targetUserId || !tempRecoveryCode) return
    setIsSavingContact(true)
    try {
      await updateUserRecoveryCode(targetUserId, tempRecoveryCode)
      setUserRecoveryCode(tempRecoveryCode)

      // Update authStore if editing own profile
      if (targetUserId === user?.id) {
        useAuthStore.getState().updateUser({ recoveryCode: tempRecoveryCode })
      }

      setIsEditingRecoveryCode(false)
    } catch (error) {
      console.error('Error updating recovery code:', error)
    } finally {
      setIsSavingContact(false)
    }
  }

  const handleUpdateAuthCode = async () => {
    if (!targetUserId || !tempAuthCode) return
    setIsSavingContact(true)
    try {
      await updateUserAuthCode(targetUserId, tempAuthCode)
      setUserAuthCode(tempAuthCode)

      // Update authStore if editing own profile
      if (targetUserId === user?.id) {
        useAuthStore.getState().updateUser({ authCode: tempAuthCode })
      }

      setIsEditingAuthCode(false)
    } catch (error) {
      console.error('Error updating auth code:', error)
    } finally {
      setIsSavingContact(false)
    }
  }

  useEffect(() => {
    if (user || isAdmin) {
      loadProfileData()
    }
  }, [user, isAdmin])

  // Timer for auto-hide credentials (60 seconds)
  useEffect(() => {
    if (showCredentials && credentialsTimer !== null && credentialsTimer > 0) {
      const timer = setTimeout(() => {
        setCredentialsTimer(prev => {
          if (prev === null || prev <= 1) {
            setShowCredentials(false)
            return null
          }
          return prev - 1
        })
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [showCredentials, credentialsTimer])

  // Auto-hide credentials when timer reaches 0
  useEffect(() => {
    if (credentialsTimer === 0) {
      setShowCredentials(false)
      setCredentialsTimer(null)
    }
  }, [credentialsTimer])

  // Timer for auto-hide wallet credentials (60 seconds)
  useEffect(() => {
    if (showWalletCredentials && walletCredentialsTimer !== null && walletCredentialsTimer > 0) {
      const timer = setTimeout(() => {
        setWalletCredentialsTimer(prev => {
          if (prev === null || prev <= 1) {
            setShowWalletCredentials(false)
            return null
          }
          return prev - 1
        })
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [showWalletCredentials, walletCredentialsTimer])

  // Auto-hide wallet credentials when timer reaches 0
  useEffect(() => {
    if (walletCredentialsTimer === 0) {
      setShowWalletCredentials(false)
      setWalletCredentialsTimer(null)
    }
  }, [walletCredentialsTimer])

  const handleProfileCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCodeError('')

    if (!profileCode) {
      setCodeError('Пожалуйста, введите код')
      return
    }

    // Verify code against target user's authCode from Firestore or TEAM_MEMBERS
    const codeToVerify = userAuthCode || targetAuthCode
    if (codeToVerify && profileCode === codeToVerify) {
      setShowCodeModal(false)
      setProfileCode('')

      if (pendingShowCredentials) {
        setShowCredentials(true)
        setCredentialsTimer(30) // 30 seconds timer
        setPendingShowCredentials(false)
      }
    } else {
      setCodeError('Неверный код авторизации')
    }
  }

  // Handle close code modal
  const handleCloseCodeModal = () => {
    setShowCodeModal(false)
    setPendingShowCredentials(false)
    setProfileCode('')
    setCodeError('')
  }

  const loadProfileData = async () => {
    if (!user && !isAdmin) return

    setLoading(true)
    try {
      // Use effective user ID (viewed user or current user)
      const targetUserId = effectiveUserId || user?.id || 'admin'

      if (user) {
        const weekRange = getWeekRange()
        const weekStart = formatDate(weekRange.start, 'yyyy-MM-dd')
        const weekEnd = formatDate(weekRange.end, 'yyyy-MM-dd')

        const monthRange = getLastNDaysRange(30)
        const monthStart = formatDate(monthRange.start, 'yyyy-MM-dd')
        const monthEnd = formatDate(monthRange.end, 'yyyy-MM-dd')
        const monthIsoStart = monthRange.start.toISOString()
        const monthIsoEnd = monthRange.end.toISOString()

        const weekEarnings = await getEarnings(targetUserId, weekStart, weekEnd)
        const approvedWeekEarnings = weekEarnings.filter(e => e.status === 'approved' || !e.status)
        const weeklyEarningsAmount = approvedWeekEarnings.reduce((sum: number, e: Earnings) => {
          const participantCount = e.participants && e.participants.length > 0 ? e.participants.length : 1
          return sum + (e.amount / participantCount)
        }, 0)
        const weeklyPool = approvedWeekEarnings.reduce((sum: number, e: Earnings) => {
          const participantCount = e.participants && e.participants.length > 0 ? e.participants.length : 1
          return sum + (e.poolAmount / participantCount)
        }, 0)

        const monthEarnings = await getEarnings(targetUserId, monthStart, monthEnd)
        const approvedMonthEarnings = monthEarnings.filter(e => e.status === 'approved' || !e.status)
        const totalEarnings = approvedMonthEarnings.reduce((sum: number, e: Earnings) => {
          const participantCount = e.participants && e.participants.length > 0 ? e.participants.length : 1
          return sum + (e.amount / participantCount)
        }, 0)
        const poolAmount = approvedMonthEarnings.reduce((sum: number, e: Earnings) => {
          const participantCount = e.participants && e.participants.length > 0 ? e.participants.length : 1
          return sum + (e.poolAmount / participantCount)
        }, 0)

        const statuses = await getDayStatuses(targetUserId)
        const monthStatuses = statuses.filter((s: DayStatus) => {
          const statusStart = s.date
          const statusEnd = s.endDate || s.date
          return statusStart <= monthEnd && statusEnd >= monthStart
        })

        const absenceDays = monthStatuses
          .filter((s: DayStatus) => s.type === 'absence')
          .reduce((sum: number, s: DayStatus) => sum + countDaysInPeriod(s.date, s.endDate, monthStart, monthEnd), 0)
        const truancyDays = monthStatuses
          .filter((s: DayStatus) => s.type === 'truancy')
          .reduce((sum: number, s: DayStatus) => sum + countDaysInPeriod(s.date, s.endDate, monthStart, monthEnd), 0)

        const slots = await getWorkSlots(targetUserId)
        const weekSlots = slots.filter((s: WorkSlot) => s.date >= weekStart && s.date <= weekEnd)
        const weeklyHours = weekSlots.reduce((sum: number, slot: WorkSlot) => sum + calculateHours(slot.slots), 0)

        const existingRatings = await getRatingData(targetUserId)
        const ratingData = existingRatings[0] || {
          userId: targetUserId,
          earnings: 0,
          messages: 0,
          initiatives: 0,
          signals: 0,
          profitableSignals: 0,
          referrals: 0,
          daysOff: 0,
          sickDays: 0,
          vacationDays: 0,
          absenceDays: 0,
          internshipDays: 0,
          poolAmount: 0,
          rating: 0,
          lastUpdated: new Date().toISOString(),
        }

        const currentReferrals = await getReferrals(undefined, monthIsoStart, monthIsoEnd)
        const userReferrals = currentReferrals.filter((referral: any) => referral.ownerId === targetUserId).length

        const updatedData: Omit<RatingData, 'rating'> = {
          userId: targetUserId,
          earnings: totalEarnings,
          messages: ratingData.messages || 0,
          initiatives: ratingData.initiatives || 0,
          signals: ratingData.signals || 0,
          profitableSignals: ratingData.profitableSignals || 0,
          referrals: userReferrals,
          daysOff: 0,
          sickDays: 0,
          vacationDays: 0,
          absenceDays,
          truancyDays,
          internshipDays: 0,
          poolAmount,
          lastUpdated: new Date().toISOString(),
        }

        console.log('Profile.tsx calculateRating call for user:', targetUserId, {
          weeklyHours,
          weeklyEarnings: weeklyEarningsAmount,
          updatedData
        })

        const calculatedRating = calculateRating(
          updatedData,
          weeklyHours,
          weeklyEarningsAmount,
          0,
          0,
          0
        )

        const breakdown = getRatingBreakdown(
          updatedData,
          weeklyHours,
          weeklyEarningsAmount,
          0,
          0,
          0
        )

        setRating({ ...updatedData, rating: calculatedRating })
        setRatingBreakdown(breakdown)

        setEarningsSummary({
          total: totalEarnings,
          pool: poolAmount,
          net: Math.max(0, totalEarnings - poolAmount),
          weekly: {
            gross: weeklyEarningsAmount,
            pool: weeklyPool,
            net: Math.max(0, weeklyEarningsAmount - weeklyPool),
          },
        })
      }
    } catch (error) {
      console.error('Error loading profile ', error)
    } finally {
      setLoading(false)
    }
  }

  // Load wallets when component mounts or user changes
  const loadWallets = async () => {
    if (!targetUserId) return
    setWalletsLoading(true)
    try {
      const userWallets = await getUserWallets(targetUserId)
      setWallets(userWallets)
    } catch (error) {
      console.error('Error loading wallets:', error)
    } finally {
      setWalletsLoading(false)
    }
  }

  useEffect(() => {
    if (user || isAdmin) {
      loadWallets()
    }
  }, [targetUserId, user, isAdmin])

  // Fetch wallet balances when unlocked
  useEffect(() => {
    if (isWalletsUnlocked && wallets.length > 0) {
      fetchAllWalletBalances()
    }
  }, [isWalletsUnlocked, wallets.length])

  // Handle add wallet
  const handleAddWallet = async () => {
    if (!walletFormData.name || !walletFormData.address || !targetUserId) return

    setWalletSaving(true)
    try {
      await addWallet({
        userId: targetUserId,
        name: walletFormData.name,
        address: walletFormData.address,
        privateKey: walletFormData.privateKey || undefined,
        seedPhrase: walletFormData.seedPhrase || undefined,
        comment: walletFormData.comment || undefined,
      })
      await loadWallets()
      setShowAddWalletModal(false)
      setWalletFormData({ name: '', address: '', privateKey: '', seedPhrase: '', comment: '' })
    } catch (error) {
      console.error('Error adding wallet:', error)
    } finally {
      setWalletSaving(false)
    }
  }

  // Handle edit wallet
  const handleEditWallet = async () => {
    if (!editingWallet || !walletFormData.name || !walletFormData.address) return

    setWalletSaving(true)
    try {
      await updateWallet(editingWallet.id, {
        name: walletFormData.name,
        address: walletFormData.address,
        privateKey: walletFormData.privateKey || undefined,
        seedPhrase: walletFormData.seedPhrase || undefined,
        comment: walletFormData.comment || undefined,
      })
      await loadWallets()
      setEditingWallet(null)
      setShowAddWalletModal(false)
      setWalletFormData({ name: '', address: '', privateKey: '', seedPhrase: '', comment: '' })
    } catch (error) {
      console.error('Error updating wallet:', error)
    } finally {
      setWalletSaving(false)
    }
  }

  // Handle delete wallet
  const handleDeleteWallet = async () => {
    if (!walletToDelete) return

    try {
      await deleteWallet(walletToDelete.id)
      await loadWallets()
      setWalletToDelete(null)
    } catch (error) {
      console.error('Error deleting wallet:', error)
    }
  }

  // Open edit wallet modal
  const openEditWalletModal = (wallet: UserWallet) => {
    setEditingWallet(wallet)
    setWalletFormData({
      name: wallet.name,
      address: wallet.address,
      privateKey: wallet.privateKey || '',
      seedPhrase: wallet.seedPhrase || '',
      comment: wallet.comment || '',
    })
    setShowAddWalletModal(true)
  }

  // Close add/edit wallet modal
  const closeWalletModal = () => {
    setShowAddWalletModal(false)
    setEditingWallet(null)
    setWalletFormData({ name: '', address: '', privateKey: '', seedPhrase: '', comment: '' })
  }

  // Check if user has PIN code set and get change info
  useEffect(() => {
    const checkPinCode = async () => {
      if (!targetUserId) return
      
      // Ensure Firebase Auth session is for this user before Firestore operations
      await ensureFirebaseAuthForUser(targetUserId)
      
      const hasPin = await hasWalletPinCode(targetUserId)
      setHasPinCode(hasPin)

      // Get PIN change info
      const info = await getPinChangeInfo(targetUserId)
      setPinChangeInfo(info)
    }
    checkPinCode()
  }, [targetUserId])

  // Handle unlock wallets section
  const handleUnlockWallets = () => {
    if (!hasPinCode) {
      // First time - show set PIN modal
      setShowSetPinModal(true)
    } else {
      // Already has PIN - show unlock modal
      setShowUnlockModal(true)
    }
  }

  // Handle PIN code submission for first time setup
  const handleSetPinSubmit = () => {
    setPinCodeError('')

    // Validate PIN code
    if (pinCode.length < 8) {
      setPinCodeError('Пинкод должен быть не менее 8 символов')
      return
    }

    // Check for special characters
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pinCode)
    if (!hasSpecialChar) {
      setPinCodeError('Пинкод должен содержать хотя бы один спецсимвол (!@#$%^&*...)')
      return
    }

    // Check for numbers
    const hasNumber = /\d/.test(pinCode)
    if (!hasNumber) {
      setPinCodeError('Пинкод должен содержать хотя бы одну цифру')
      return
    }

    // Proceed to confirmation step
    setPinCodeStep('confirm')
  }

  // Handle confirm PIN code
  const handleConfirmPinSubmit = async () => {
    setPinCodeError('')

    if (pinCode !== confirmPinCode) {
      setPinCodeError('Пинкоды не совпадают. Попробуйте ещё раз.')
      setPinCodeStep('first')
      setPinCode('')
      setConfirmPinCode('')
      return
    }

    // Save PIN code to database
    setPinCodeLoading(true)
    try {
      // Ensure Firebase Auth session is for this user before Firestore operations
      await ensureFirebaseAuthForUser(targetUserId)
      await setWalletPinCode(targetUserId, pinCode)
      setHasPinCode(true)
      setIsWalletsUnlocked(true)
      setShowSetPinModal(false)
      setPinCode('')
      setConfirmPinCode('')
      setPinCodeStep('first')
      // Fetch balances after first-time PIN setup
      setTimeout(() => fetchAllWalletBalances(), 100)
    } catch (error) {
      console.error('Error setting PIN code:', error)
      setPinCodeError('Ошибка сохранения пинкода. Попробуйте ещё раз.')
    } finally {
      setPinCodeLoading(false)
    }
  }

  // Handle unlock with PIN code
  const handleUnlockSubmit = async () => {
    setPinCodeError('')

    if (!pinCode) {
      setPinCodeError('Введите пинкод')
      return
    }

    setPinCodeLoading(true)
    try {
      // Ensure Firebase Auth session is for this user before Firestore operations
      await ensureFirebaseAuthForUser(targetUserId)
      const isValid = await verifyWalletPinCode(targetUserId, pinCode)

      if (isValid) {
        setIsWalletsUnlocked(true)
        setShowUnlockModal(false)
        setPinCode('')
        // Fetch balances after unlock
        setTimeout(() => fetchAllWalletBalances(), 100)
      } else {
        setPinCodeError('Неверный пинкод. Попробуйте ещё раз.')
      }
    } catch (error) {
      console.error('Error verifying PIN code:', error)
      setPinCodeError('Ошибка проверки пинкода. Попробуйте ещё раз.')
    } finally {
      setPinCodeLoading(false)
    }
  }

  // Handle unlock wallets with biometric
  const handleUnlockWalletsBiometric = async () => {
    if (!user?.id) return

    setPinCodeLoading(true)
    setPinCodeError('')

    try {
      const result = await authenticateWithBiometric(user.id)

      if (result.success) {
        setIsWalletsUnlocked(true)
        setShowUnlockModal(false)
        showToast('Кошельки разблокированы', 'success')
        // Fetch balances after unlock
        setTimeout(() => fetchAllWalletBalances(), 100)
      } else {
        setPinCodeError(result.error || 'Ошибка биометрической аутентификации')
      }
    } catch (error) {
      console.error('Error verifying biometric:', error)
      setPinCodeError('Ошибка биометрической аутентификации')
    } finally {
      setPinCodeLoading(false)
    }
  }

  // Handle personal data PIN code setup
  const handlePersonalDataSetPin = () => {
    setPersonalDataPinError('')

    if (personalDataPin.length < 4) {
      setPersonalDataPinError('Пинкод должен быть не менее 4 символов')
      return
    }

    setPersonalDataPinStep('confirm')
  }

  // Handle personal data PIN code confirmation
  const handlePersonalDataConfirmPin = async () => {
    setPersonalDataPinError('')

    if (personalDataPin !== personalDataPinConfirm) {
      setPersonalDataPinError('Пинкоды не совпадают. Попробуйте ещё раз.')
      setPersonalDataPinStep('first')
      setPersonalDataPin('')
      setPersonalDataPinConfirm('')
      return
    }

    const userId = effectiveUserId || user?.id
    if (!userId) return

    setPersonalDataPinLoading(true)
    try {
      await setPersonalDataPinCode(userId, personalDataPin)
      setHasPersonalDataPin(true)
      setIsPersonalDataUnlocked(true)
      setShowPersonalDataSetPinModal(false)
      setPersonalDataPin('')
      setPersonalDataPinConfirm('')
      setPersonalDataPinStep('first')
    } catch (error) {
      console.error('Error setting personal data PIN:', error)
      setPersonalDataPinError('Ошибка сохранения пинкода. Попробуйте ещё раз.')
    } finally {
      setPersonalDataPinLoading(false)
    }
  }

  // Handle personal data unlock
  const handlePersonalDataUnlock = async () => {
    setPersonalDataPinError('')

    if (!personalDataPin) {
      setPersonalDataPinError('Введите пинкод')
      return
    }

    const userId = effectiveUserId || user?.id
    if (!userId) return

    setPersonalDataPinLoading(true)
    try {
      const isValid = await verifyPersonalDataPinCode(userId, personalDataPin)

      if (isValid) {
        setIsPersonalDataUnlocked(true)
        setShowPersonalDataUnlockModal(false)
        setPersonalDataPin('')
      } else {
        setPersonalDataPinError('Неверный пинкод. Попробуйте ещё раз.')
      }
    } catch (error) {
      console.error('Error verifying personal data PIN:', error)
      setPersonalDataPinError('Ошибка проверки пинкода. Попробуйте ещё раз.')
    } finally {
      setPersonalDataPinLoading(false)
    }
  }

  // Handle personal data unlock with biometric
  const handlePersonalDataUnlockBiometric = async () => {
    if (!user?.id) return

    setPersonalDataBiometricLoading(true)
    setPersonalDataPinError('')

    try {
      const result = await authenticateWithBiometric(user.id)

      if (result.success) {
        setIsPersonalDataUnlocked(true)
        setShowPersonalDataUnlockModal(false)
        showToast('Персональные данные разблокированы', 'success')
      } else {
        setPersonalDataPinError(result.error || 'Ошибка биометрической аутентификации')
      }
    } catch (error) {
      console.error('Error verifying biometric:', error)
      setPersonalDataPinError('Ошибка биометрической аутентификации')
    } finally {
      setPersonalDataBiometricLoading(false)
    }
  }

  // Handle unlock personal data button click
  const handleUnlockPersonalDataClick = () => {
    if (isPersonalDataUnlocked) {
      // If already unlocked, lock it
      setIsPersonalDataUnlocked(false)
    } else if (!hasPersonalDataPin) {
      setShowPersonalDataSetPinModal(true)
    } else {
      setShowPersonalDataUnlockModal(true)
    }
  }

  // Validate personal data before verification
  const validatePersonalData = (): { valid: boolean; missingFields: string[] } => {
    const missingFields: string[] = []

    if (!personalData.lastName?.trim()) missingFields.push('Фамилия')
    if (!personalData.firstName?.trim()) missingFields.push('Имя')
    if (!personalData.middleName?.trim()) missingFields.push('Отчество')
    if (!personalData.birthDate) missingFields.push('Дата рождения')
    if (!personalData.birthPlace?.trim()) missingFields.push('Место рождения')
    if (!personalData.registrationAddress?.trim()) missingFields.push('Адрес регистрации')
    if (!personalData.passportSeries?.trim()) missingFields.push('Серия паспорта')
    if (!personalData.passportNumber?.trim()) missingFields.push('Номер паспорта')
    if (!personalData.passportIssuedBy?.trim()) missingFields.push('Кем выдан')
    if (!personalData.passportIssueDate) missingFields.push('Дата выдачи')
    if (!personalData.passportDepartmentCode?.trim()) missingFields.push('Код подразделения')
    if (!personalData.inn?.trim()) missingFields.push('ИНН')

    return { valid: missingFields.length === 0, missingFields }
  }

  // Submit personal data for verification
  const handleSubmitForVerification = async () => {
    const userId = effectiveUserId || user?.id
    if (!userId) return

    // Validate personal data first
    const { valid, missingFields } = validatePersonalData()

    if (!valid) {
      showToast(`Для отправки на верификацию необходимо заполнить следующие поля:\n\n${missingFields.join('\n')}`, 'error')
      return
    }

    // Check if already verified or pending
    if (personalDataVerificationStatus === 'approved') {
      showToast('Персональные данные уже верифицированы', 'info')
      return
    }

    if (personalDataVerificationStatus === 'pending') {
      showToast('Заявка на верификацию уже отправлена и находится на рассмотрении', 'info')
      return
    }

    setVerificationLoading(true)

    try {
      await submitPersonalDataForVerification(userId, personalData)
      setPersonalDataVerificationStatus('pending')
      showToast('Заявка на верификацию успешно отправлена!', 'success')
    } catch (error: any) {
      console.error('Error submitting for verification:', error)
      if (error.message?.includes('уже существует')) {
        showToast(error.message, 'error')
      } else {
        showToast('Ошибка при отправке заявки. Попробуйте ещё раз.', 'error')
      }
    } finally {
      setVerificationLoading(false)
    }
  }

  // Handle lock wallets section
  const handleLockWallets = () => {
    setIsWalletsUnlocked(false)
    setShowWalletCredentials(false)
    setActiveCredentialWalletId(null)
    setWalletCredentialsTimer(null)
    setShowWalletsModal(false)
  }

  // Export wallets to Excel (CSV)
  const handleExportWallets = () => {
    if (!wallets.length) return

    // Create CSV content
    const headers = ['Название', 'Адрес', 'Приватный ключ', 'Seed фраза', 'Комментарий', 'Дата создания']
    const rows = wallets.map(w => [
      w.name,
      w.address,
      w.privateKey || '',
      w.seedPhrase || '',
      w.comment || '',
      new Date(w.createdAt).toLocaleDateString('ru-RU')
    ])

    const csvContent = [
      headers.join(';'),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(';'))
    ].join('\n')

    // Add BOM for UTF-8
    const BOM = '\uFEFF'
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `wallets_${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Fetch balance for a single wallet
  const fetchWalletBalance = async (address: string): Promise<WalletBalance> => {
    try {
      // Try multiple RPC endpoints if one fails
      const rpcEndpoints = [
        "https://solana-mainnet.g.allthatnode.com/full/mainnet-beta",
        "https://api.mainnet-beta.solana.com",
        "https://rpc.ankr.com/solana",
        "https://solana-rpc.publicnode.com",
        "https://api.dex.solana.com"
      ]

      let result: any = null

      for (const endpoint of rpcEndpoints) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3000);

          const res = await fetch(endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            signal: controller.signal,
            body: JSON.stringify({
              jsonrpc: "2.0",
              id: 1,
              method: "getBalance",
              params: [address]
            })
          })

          clearTimeout(timeoutId);

          if (res.ok) {
            result = await res.json()
            if (result?.result) break
          }
        } catch (e) {
          continue
        }
      }

      const solBalance = result?.result?.value ? result.result.value / 1000000000 : 0

      // Get SOL price from Binance API directly (more reliable)
      let solPrice = 0
      try {
        const priceRes = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=SOLUSDT')
        const priceData = await priceRes.json()
        solPrice = parseFloat(priceData.price) || 0
      } catch (e) {
        console.error('Error fetching SOL price:', e)
        solPrice = rates?.solana?.usd || 0
      }

      return {
        sol: solBalance,
        usd: solBalance * solPrice,
        loading: false
      }
    } catch (error) {
      console.error('Error fetching wallet balance:', error)
      return { sol: 0, usd: 0, loading: false }
    }
  }

  // Fetch all wallet balances
  const fetchAllWalletBalances = async () => {
    if (!wallets.length || !isWalletsUnlocked) return

    setBalancesLoading(true)
    try {
      const balancePromises = wallets.map(async (wallet) => {
        const balance = await fetchWalletBalance(wallet.address)
        return { id: wallet.id, balance }
      })

      const results = await Promise.all(balancePromises)
      const newBalances: Record<string, WalletBalance> = {}
      results.forEach(({ id, balance }) => {
        newBalances[id] = balance
      })
      setWalletBalances(newBalances)
    } catch (error) {
      console.error('Error fetching wallet balances:', error)
    } finally {
      setBalancesLoading(false)
    }
  }

  // Load AW wallets from Firestore
  const loadAwWallets = async () => {
    if (!targetUserId) return
    try {
      const { doc, getDoc } = await import('firebase/firestore')
      const { db } = await import('@/services/firebase')
      const userDoc = await getDoc(doc(db, 'users', targetUserId))
      if (userDoc.exists()) {
        const data = userDoc.data()
        setAwWallets({
          trc20: data.awWalletTRC20 || '',
          ton: data.awWalletTON || ''
        })
      }
    } catch (error) {
      console.error('Error loading AW wallets:', error)
    }
  }

  // Save AW wallet to Firestore
  const saveAwWallet = async (network: 'trc20' | 'ton', address: string) => {
    if (!targetUserId) return

    setAwWalletSaving(true)
    try {
      const { doc, updateDoc } = await import('firebase/firestore')
      const { db } = await import('@/services/firebase')

      const updateData = network === 'trc20'
        ? { awWalletTRC20: address }
        : { awWalletTON: address }

      await updateDoc(doc(db, 'users', targetUserId), updateData)
      setAwWallets(prev => ({ ...prev, [network]: address }))
      setAwEditMode(prev => ({ ...prev, [network]: false }))
      setAwTempWallet('')
    } catch (error) {
      console.error('Error saving AW wallet:', error)
    } finally {
      setAwWalletSaving(false)
    }
  }

  // Copy AW wallet to clipboard
  const copyAwWallet = (address: string, field: string) => {
    if (!address) return
    navigator.clipboard.writeText(address)
    setAwCopiedField(field)
    setTimeout(() => setAwCopiedField(null), 2000)
  }

  // Load AW wallets on mount
  useEffect(() => {
    if (user || isAdmin) {
      loadAwWallets()
    }
  }, [targetUserId, user, isAdmin])

  // Close PIN modals and reset state
  const handleCloseSetPinModal = () => {
    setShowSetPinModal(false)
    setPinCode('')
    setConfirmPinCode('')
    setPinCodeStep('first')
    setPinCodeError('')
  }

  const handleCloseUnlockModal = () => {
    setShowUnlockModal(false)
    setPinCode('')
    setPinCodeError('')
  }

  // Open change PIN modal
  const handleOpenChangePinModal = async () => {
    // Get latest PIN change info
    // Ensure Firebase Auth session is for this user before Firestore operations
    await ensureFirebaseAuthForUser(targetUserId)
    const info = await getPinChangeInfo(targetUserId)
    setPinChangeInfo(info)

    if (!info.canChange) {
      setPinCodeError(`Превышен лимит смены пинкода (3 раза в месяц). Попробуйте в следующем месяце.`)
      return
    }

    setShowChangePinModal(true)
    setChangePinStep('verify')
    setOldPinCode('')
    setNewPinCode('')
    setConfirmNewPinCode('')
    setChangePinAuthCode('')
    setPinCodeError('')
  }

  // Handle change PIN step verification
  const handleChangePinVerify = async () => {
    setPinCodeError('')

    if (!oldPinCode) {
      setPinCodeError('Введите текущий пинкод')
      return
    }

    // Ensure Firebase Auth session is for this user before Firestore operations
    await ensureFirebaseAuthForUser(targetUserId)
    
    // Verify old PIN code first
    const isOldPinValid = await verifyWalletPinCode(targetUserId, oldPinCode)
    if (!isOldPinValid) {
      setPinCodeError('Неверный текущий пинкод')
      return
    }

    // Move to new PIN step
    setChangePinStep('new')
  }

  // Handle new PIN validation
  const handleChangePinNew = () => {
    setPinCodeError('')

    // Validate new PIN code
    if (newPinCode.length < 8) {
      setPinCodeError('Пинкод должен быть не менее 8 символов')
      return
    }

    // Check for special characters
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPinCode)
    if (!hasSpecialChar) {
      setPinCodeError('Пинкод должен содержать хотя бы один спецсимвол (!@#$%^&*...)')
      return
    }

    // Check for numbers
    const hasNumber = /\d/.test(newPinCode)
    if (!hasNumber) {
      setPinCodeError('Пинкод должен содержать хотя бы одну цифру')
      return
    }

    // Proceed to confirmation step
    setChangePinStep('confirm')
  }

  // Handle confirm new PIN and submit
  const handleChangePinConfirm = async () => {
    setPinCodeError('')

    if (newPinCode !== confirmNewPinCode) {
      setPinCodeError('Пинкоды не совпадают. Попробуйте ещё раз.')
      setChangePinStep('new')
      setNewPinCode('')
      setConfirmNewPinCode('')
      return
    }

    // Change the PIN code
    setPinCodeLoading(true)
    try {
      // Ensure Firebase Auth session is for this user before Firestore operations
      await ensureFirebaseAuthForUser(targetUserId)
      const result = await changeWalletPinCode(targetUserId, oldPinCode, newPinCode, '')

      if (result.success) {
        // Refresh PIN change info
        const info = await getPinChangeInfo(targetUserId)
        setPinChangeInfo(info)

        // Close modal and reset
        setShowChangePinModal(false)
        setOldPinCode('')
        setNewPinCode('')
        setConfirmNewPinCode('')
        setChangePinAuthCode('')
        setChangePinStep('verify')

        // Show success message
        showToast('Пинкод успешно изменён! Старый пинкод более недействителен.', 'success')

        // Lock wallets section since old PIN is now invalid
        setIsWalletsUnlocked(false)
        setShowWalletCredentials(false)
        setActiveCredentialWalletId(null)
        setWalletCredentialsTimer(null)
      } else {
        setPinCodeError(result.error || 'Ошибка при смене пинкода')
      }
    } catch (error) {
      console.error('Error changing PIN code:', error)
      setPinCodeError('Ошибка при смене пинкода. Попробуйте ещё раз.')
    } finally {
      setPinCodeLoading(false)
    }
  }

  // Close change PIN modal
  const handleCloseChangePinModal = () => {
    setShowChangePinModal(false)
    setOldPinCode('')
    setNewPinCode('')
    setConfirmNewPinCode('')
    setChangePinAuthCode('')
    setChangePinStep('verify')
    setPinCodeError('')
  }

  const handleLogout = () => {
    if (isAdmin) {
      deactivateAdmin()
    }
    logout()
    navigate('/login')
  }

  if (!userData) {
    return (
      <div className="text-center py-12">
        <p className={headingColor}>Необходима авторизация</p>
      </div>
    )
  }

  const weeklyNetStatus = earningsSummary?.weekly.net && earningsSummary.weekly.net >= 10000
  const weeklyStatusText = weeklyNetStatus ? 'Вывод доступен' : 'Ожидание порога'
  const weeklyStatusClass = weeklyNetStatus
    ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-500'
    : 'border-amber-500/20 bg-amber-500/10 text-amber-500'
  const weeklyStatusBadge = weeklyNetStatus ? 'Доступно к выводу' : 'Перенос суммы'

  return (
    <div className="space-y-6">
      {/* New Header */}
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 md:gap-4 min-w-0">
            <div className="flex-shrink-0">
              {profileAvatar ? (
                <img
                  src={profileAvatar}
                  alt={userData?.name}
                  className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover border-2 border-[#4E6E49]/30 shadow-lg shadow-[#4E6E49]/10"
                />
              ) : (
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-[#4E6E49] to-emerald-600 flex items-center justify-center text-xl md:text-2xl font-black text-white border-2 border-[#4E6E49]/30 shadow-lg shadow-[#4E6E49]/10">
                  {profileInitial}
                </div>
              )}
            </div>
            <div className="min-w-0">
              {isViewingOtherUser() && (
                <div className="flex items-center gap-2 mb-1 md:mb-2">
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-500 text-[9px] font-black tracking-widest uppercase border border-amber-500/20">
                    Просмотр профиля
                  </span>
                </div>
              )}
              <h1 className={`text-xl md:text-4xl font-black tracking-tight truncate ${headingColor}`}>
                {isViewingOtherUser() ? viewedUserMember?.name || 'Пользователь' : userData.name}
              </h1>
            </div>
          </div>
          {/* Кнопки - показываем всегда (справа от имени) */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all ${
                theme === 'dark'
                  ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-400'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              title={theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center w-10 h-10 md:w-auto md:px-5 md:py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white transition-all shadow-lg"
              title="Выйти"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline ml-2 text-sm font-bold">Выйти</span>
            </button>
          </div>
        </div>

        {/* Account Credentials Card - UPGRADED VERSION */}
        {userData && (userData.login || userData.password || userData.phone || userData.recoveryCode) && (
          <div className={`relative overflow-hidden rounded-3xl border transition-all duration-500 ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-[#1a1a1a] to-[#141414] border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
              : 'bg-white border-gray-100 shadow-[0_8px_32px_rgba(76,127,110,0.08)]'
          }`}>
            {/* Decorative Background Elements */}
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-[#4C7F6E]/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl" />

            {/* Security Shield Decor */}
            <div className="absolute top-0 right-0 opacity-5">
              <Shield className="w-40 h-40 -rotate-12 translate-x-10 -translate-y-10" />
            </div>

            <div className="relative z-10 p-4 md:p-6">
              {/* Enhanced Timer Banner with Progress Bar */}
              {showCredentials && credentialsTimer !== null && (
                <div className={`mb-4 p-3 md:p-4 rounded-2xl border transition-all duration-300 ${
                  credentialsTimer <= 10
                    ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/10 border-amber-500/30'
                    : 'bg-gradient-to-r from-[#4C7F6E]/20 to-emerald-500/10 border-[#4C7F6E]/30'
                }`}>
                  {/* Progress Bar */}
                  <div className={`h-1 rounded-full mb-3 overflow-hidden ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`}>
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        credentialsTimer <= 10 ? 'bg-gradient-to-r from-amber-500 to-orange-400' : 'bg-gradient-to-r from-[#4C7F6E] to-emerald-400'
                      }`}
                      style={{ width: `${(credentialsTimer / 30) * 100}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-xl ${
                        credentialsTimer <= 10 ? 'bg-amber-500/20' : 'bg-[#4C7F6E]/20'
                      }`}>
                        <Clock className={`w-4 h-4 ${credentialsTimer <= 10 ? 'text-amber-500 animate-pulse' : 'text-[#4C7F6E]'}`} />
                      </div>
                      <div>
                        <span className={`text-xs font-bold ${
                          credentialsTimer <= 10
                            ? (theme === 'dark' ? 'text-amber-400' : 'text-amber-600')
                            : (theme === 'dark' ? 'text-white' : 'text-gray-900')
                        }`}>
                          {credentialsTimer <= 10 ? '⚠️ Скоро скроется!' : '🔒 Данные видны'}
                        </span>
                        <p className={`text-[10px] ${
                          credentialsTimer <= 10
                            ? (theme === 'dark' ? 'text-amber-400/70' : 'text-amber-600/70')
                            : (theme === 'dark' ? 'text-gray-400' : 'text-gray-600')
                        }`}>
                          Автоскрытие через {credentialsTimer} секунд
                        </p>
                      </div>
                    </div>
                    <div className={`text-3xl font-black tabular-nums tracking-tight ${
                      credentialsTimer <= 10
                        ? (theme === 'dark' ? 'text-amber-400' : 'text-amber-600')
                        : (theme === 'dark' ? 'text-white' : 'text-gray-900')
                    }`}>
                      {credentialsTimer}
                    </div>
                  </div>
                </div>
              )}

              {/* Header Section */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3.5">
                  <div className={`relative p-3 rounded-2xl ${
                    theme === 'dark'
                      ? 'bg-gradient-to-br from-[#4C7F6E]/30 to-[#4C7F6E]/10'
                      : 'bg-gradient-to-br from-[#4C7F6E]/20 to-[#4C7F6E]/5'
                  }`}>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#4C7F6E]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Lock className="w-6 h-6 text-[#4C7F6E]" />
                    {/* Glow effect */}
                    <div className="absolute -inset-1 bg-[#4C7F6E]/20 rounded-2xl blur-lg -z-10" />
                  </div>
                  <div>
                    <h2 className={`text-lg font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      Учетные данные
                    </h2>
                    <p className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                      {showCredentials ? 'Нажмите "Скрыть" для безопасности' : 'Нажмите "Показать" для просмотра'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (showCredentials) {
                        setShowCredentials(false)
                        setCredentialsTimer(null)
                      } else {
                        setShowCredentials(true)
                        setCredentialsTimer(30)
                      }
                    }}
                    className={`group relative flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all duration-300 overflow-hidden ${
                      showCredentials
                        ? 'bg-gradient-to-r from-[#4C7F6E] to-[#3d6b5a] text-white shadow-lg shadow-[#4C7F6E]/30'
                        : theme === 'dark'
                          ? 'bg-white/10 hover:bg-white/20 text-white border border-white/10 hover:border-white/20'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-200'
                    }`}
                  >
                    {/* Shine effect */}
                    <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    <span className="relative flex items-center gap-2">
                      {showCredentials ? (
                        <>
                          <Lock className="w-4 h-4" />
                          <span>Скрыть</span>
                        </>
                      ) : (
                        <>
                          <Key className="w-4 h-4" />
                          <span>Показать</span>
                        </>
                      )}
                    </span>
                  </button>
                  <button
                    onClick={copyAllCredentials}
                    className={`group relative flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all duration-300 overflow-hidden ${
                      allCopied
                        ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/30'
                        : theme === 'dark'
                          ? 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-200'
                    }`}
                  >
                    <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    <span className="relative flex items-center gap-2">
                      {allCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span className="hidden sm:inline">{allCopied ? 'Скопировано' : 'Копировать всё'}</span>
                      <span className="sm:hidden">{allCopied ? '✓' : 'Копировать'}</span>
                    </span>
                  </button>
                </div>
              </div>

              {/* Grouped Fields */}
              <div className="space-y-5">
                {/* Secret Data Section */}
                {(userLogin || userPassword || userRecoveryCode || userAuthCode) && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${showCredentials ? 'bg-emerald-500 animate-pulse' : 'bg-gray-500'}`} />
                      <span className={`text-[10px] font-black uppercase tracking-widest ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                        Секретные данные
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        {
                          label: 'Логин',
                          value: userLogin || userData.login || '—',
                          copyValue: userLogin || userData.login,
                          icon: UserIcon,
                          id: 'login',
                          sensitive: true,
                          editable: true,
                          onEdit: () => {
                            setTempLogin(userLogin || userData.login || '')
                            setIsEditingLogin(true)
                          }
                        },
                        {
                          label: 'Пароль',
                          value: userPassword || userData.password || '—',
                          copyValue: userPassword || userData.password,
                          icon: Key,
                          id: 'password',
                          sensitive: true,
                          editable: true,
                          onEdit: () => {
                            setTempPassword(userPassword || userData.password || '')
                            setIsEditingPassword(true)
                          }
                        },
                        {
                          label: 'Код восстановления',
                          value: userRecoveryCode || userData.recoveryCode || targetTeamMember?.recoveryCode || '—',
                          copyValue: userRecoveryCode || userData.recoveryCode || targetTeamMember?.recoveryCode,
                          icon: Lock,
                          id: 'recoveryCode',
                          sensitive: true,
                          editable: true,
                          onEdit: () => {
                            setTempRecoveryCode(userRecoveryCode || userData.recoveryCode || targetTeamMember?.recoveryCode || '')
                            setIsEditingRecoveryCode(true)
                          }
                        },
                        {
                          label: 'Код авторизации',
                          value: userAuthCode || targetAuthCode || '—',
                          copyValue: userAuthCode || targetAuthCode,
                          icon: KeyRound,
                          id: 'authcode',
                          sensitive: true,
                          editable: true,
                          onEdit: () => {
                            setTempAuthCode(userAuthCode || targetAuthCode || '')
                            setIsEditingAuthCode(true)
                          }
                        },
                      ].map((field) => {
                        const displayValue = field.sensitive && !showCredentials && field.value !== '—' ? SENSITIVE_MASK : field.value
                        const isSecret = field.sensitive
                        return (
                          <div
                            key={field.id}
                            className={`group relative p-4 rounded-2xl border transition-all duration-300 hover:scale-[1.01] ${
                              isSecret && !showCredentials
                                ? theme === 'dark'
                                  ? 'bg-white/[0.02] border-white/5'
                                  : 'bg-gray-50 border-gray-100'
                                : theme === 'dark'
                                  ? 'bg-[#4C7F6E]/5 border-white/[0.08] hover:border-[#4C7F6E]/30 hover:bg-[#4C7F6E]/10'
                                  : 'bg-white border-gray-200 hover:border-[#4C7F6E]/30 hover:shadow-md hover:shadow-[#4C7F6E]/5'
                            }`}
                          >
                            {/* Status indicator */}
                            <div className={`absolute top-2 right-2 w-2 h-2 rounded-full transition-all duration-300 ${
                              field.value !== '—'
                                ? isSecret && !showCredentials
                                  ? 'bg-gray-500/50'
                                  : 'bg-emerald-500 shadow-lg shadow-emerald-500/50'
                                : 'bg-gray-300'
                            }`} />

                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div className={`p-2.5 rounded-xl shrink-0 transition-colors ${
                                  isSecret && !showCredentials
                                    ? theme === 'dark' ? 'bg-white/5 text-gray-500' : 'bg-gray-100 text-gray-400'
                                    : theme === 'dark' ? 'bg-[#4C7F6E]/20 text-[#4C7F6E]' : 'bg-[#4C7F6E]/10 text-[#4C7F6E]'
                                }`}>
                                  <field.icon className="w-4 h-4" />
                                </div>
                                <div className="text-left min-w-0 flex-1">
                                  <span className={`text-[9px] font-black uppercase tracking-wider block mb-1 ${
                                    theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                                  }`}>
                                    {field.label}
                                  </span>
                                  <p className={`text-sm font-bold truncate ${
                                    isSecret && !showCredentials
                                      ? theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                                      : theme === 'dark' ? 'text-white' : 'text-gray-900'
                                  }`}>
                                    {displayValue}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                {field.editable && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      field.onEdit?.()
                                    }}
                                    className={`p-2 rounded-xl transition-all duration-300 hover:scale-110 ${
                                      theme === 'dark'
                                        ? 'hover:bg-white/10 text-gray-500 hover:text-[#4C7F6E]'
                                        : 'hover:bg-gray-200 text-gray-400 hover:text-[#4C7F6E]'
                                    }`}
                                    title="Редактировать"
                                  >
                                    <Pencil className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    copyToClipboard(field.copyValue, field.id)
                                  }}
                                  className={`p-2 rounded-xl transition-all duration-300 hover:scale-110 ${
                                    copiedField === field.id
                                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                                      : theme === 'dark'
                                        ? 'hover:bg-white/10 text-gray-500 hover:text-emerald-400'
                                        : 'hover:bg-gray-200 text-gray-400 hover:text-emerald-500'
                                  }`}
                                  title={copiedField === field.id ? 'Скопировано!' : 'Копировать'}
                                >
                                  {copiedField === field.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                </button>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Contact Data Section */}
                {(userPhone || userEmail || userTelegram || userDiscord || userVK || userX) && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full bg-[#4C7F6E]`} />
                      <span className={`text-[10px] font-black uppercase tracking-widest ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                        Контактные данные
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        {
                          label: 'Телефон',
                          value: userPhone || userData.phone || '—',
                          copyValue: userPhone || userData.phone,
                          icon: Smartphone,
                          id: 'phone',
                          sensitive: false,
                          editable: true,
                          onEdit: () => {
                            setTempPhone(userPhone || userData.phone || '')
                            setIsEditingPhone(true)
                          }
                        },
                        {
                          label: 'Email',
                          value: userEmail || userData.email || '—',
                          copyValue: userEmail || userData.email,
                          icon: FileText,
                          id: 'email',
                          sensitive: false,
                          editable: true,
                          onEdit: () => {
                            setTempEmail(userEmail || userData.email || '')
                            setIsEditingEmail(true)
                          }
                        },
                        {
                          label: 'Telegram',
                          value: userTelegram || '—',
                          copyValue: userTelegram,
                          icon: MessageCircle,
                          id: 'telegram',
                          sensitive: false,
                          editable: true,
                          hint: 'Укажите ID или username, не указывайте ссылки, страницы профиля',
                          onEdit: () => {
                            setTempTelegram(userTelegram || '')
                            setIsEditingTelegram(true)
                          }
                        },
                        {
                          label: 'Discord',
                          value: userDiscord || '—',
                          copyValue: userDiscord,
                          icon: AtSign,
                          id: 'discord',
                          sensitive: false,
                          editable: true,
                          hint: 'Укажите ID или username, не указывайте ссылки, страницы профиля',
                          onEdit: () => {
                            setTempDiscord(userDiscord || '')
                            setIsEditingDiscord(true)
                          }
                        },
                        {
                          label: 'VK',
                          value: userVK || '—',
                          copyValue: userVK,
                          icon: Users,
                          id: 'vk',
                          sensitive: false,
                          editable: true,
                          hint: 'Укажите ID или username, не указывайте ссылки, страницы профиля',
                          onEdit: () => {
                            setTempVK(userVK || '')
                            setIsEditingVK(true)
                          }
                        },
                        {
                          label: 'X (Twitter)',
                          value: userX || '—',
                          copyValue: userX,
                          icon: X,
                          id: 'x',
                          sensitive: false,
                          editable: true,
                          hint: 'Укажите ID или username, не указывайте ссылки, страницы профиля',
                          onEdit: () => {
                            setTempX(userX || '')
                            setIsEditingX(true)
                          }
                        },
                      ].map((field) => {
                        const displayValue = field.sensitive && !showCredentials && field.value !== '—' ? SENSITIVE_MASK : field.value
                        return (
                          <div
                            key={field.id}
                            className={`group relative p-4 rounded-2xl border transition-all duration-300 hover:scale-[1.01] ${
                              theme === 'dark'
                                ? 'bg-white/[0.02] border-white/5 hover:border-white/15 hover:bg-white/[0.04]'
                                : 'bg-white border-gray-100 hover:border-gray-300 hover:bg-gray-50 hover:shadow-md'
                            }`}
                          >
                            {/* Status indicator */}
                            <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${
                              field.value !== '—'
                                ? 'bg-[#4C7F6E] shadow-lg shadow-[#4C7F6E]/50'
                                : 'bg-gray-300'
                            }`} />

                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div className={`p-2.5 rounded-xl shrink-0 ${
                                  theme === 'dark' ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-600'
                                }`}>
                                  <field.icon className="w-4 h-4" />
                                </div>
                                <div className="text-left min-w-0 flex-1">
                                  <span className={`text-[9px] font-black uppercase tracking-wider block mb-1 ${
                                    theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                                  }`}>
                                    {field.label}
                                  </span>
                                  <p className={`text-sm font-bold truncate ${
                                    field.value !== '—'
                                      ? theme === 'dark' ? 'text-white' : 'text-gray-900'
                                      : theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                                  }`}>
                                    {displayValue}
                                  </p>
                                  {field.hint && (
                                    <span className={`text-[8px] block mt-1 ${
                                      theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                                    }`}>
                                      {field.hint}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                {field.editable && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      field.onEdit?.()
                                    }}
                                    className={`p-2 rounded-xl transition-all duration-300 hover:scale-110 ${
                                      theme === 'dark'
                                        ? 'hover:bg-white/10 text-gray-500 hover:text-[#4C7F6E]'
                                        : 'hover:bg-gray-200 text-gray-400 hover:text-[#4C7F6E]'
                                    }`}
                                    title="Редактировать"
                                  >
                                    <Pencil className="w-3.5 h-3.5" />
                                  </button>
                                 )}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    copyToClipboard(field.copyValue, field.id)
                                  }}
                                  className={`p-2 rounded-xl transition-all duration-300 hover:scale-110 ${
                                    copiedField === field.id
                                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                                      : theme === 'dark'
                                        ? 'hover:bg-white/10 text-gray-500 hover:text-emerald-400'
                                        : 'hover:bg-gray-200 text-gray-400 hover:text-emerald-500'
                                  }`}
                                  title={copiedField === field.id ? 'Скопировано!' : 'Копировать'}
                                >
                                  {copiedField === field.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                </button>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Security Tip */}
              {showCredentials && (
                <div className={`mt-5 p-3 rounded-xl flex items-center gap-3 ${
                  theme === 'dark' ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-amber-50 border border-amber-200'
                }`}>
                  <div className={`p-1.5 rounded-lg ${theme === 'dark' ? 'bg-amber-500/20' : 'bg-amber-200/50'}`}>
                    <AlertTriangle className={`w-4 h-4 ${theme === 'dark' ? 'text-amber-500' : 'text-amber-600'}`} />
                  </div>
                  <p className={`text-xs font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Не сообщайте эти данные посторонним. Данные автоматически скроются через {credentialsTimer} сек.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Notice about personal data collection */}
        <div className={`p-4 rounded-2xl border-2 border-amber-500/30 bg-amber-500/5`}>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className={`text-sm font-bold text-amber-500 mb-1`}>
                Пожалуйста, не вносите свои персональные данные
              </p>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Мы начнём сбор заявок на верификацию с 25 мая 2026 года.
              </p>
            </div>
          </div>
        </div>

        {/* Biometric Section - UPGRADED */}
        {user?.id && !isViewingOtherUser() && (
          <div className={`relative overflow-hidden rounded-3xl border transition-all duration-500 ${
            theme === 'dark'
              ? 'bg-[#1a1a1a] border-white/5'
              : 'bg-white border-gray-100'
          }`}>
            <div className="relative z-10 p-5 md:p-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                <div className="flex items-center gap-4">
                  <div className={`p-3.5 rounded-2xl ${
                    theme === 'dark'
                      ? 'bg-white/5'
                      : 'bg-gray-100'
                  }`}>
                    <Fingerprint className={`w-6 h-6 ${
                      biometricRegistered ? 'text-emerald-500' : 'text-gray-400'
                    }`} />
                  </div>
                  <div>
                    <h2 className={`text-lg font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      Биометрия
                    </h2>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${biometricRegistered ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      <p className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                        {biometricRegistered ? 'Привязана' : 'Не привязана'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!biometricRegistered && (
                    <button
                      onClick={async () => {
                        if (!isWebAuthnSupported()) {
                          alert('Биометрия не поддерживается в этом браузере')
                          return
                        }
                        setBiometricLoading(true)
                        try {
                          const result = await registerBiometric(user.id, user.name || user.login || 'User')
                          if (result.success) {
                            setBiometricRegistered(true)
                            alert('Биометрия успешно привязана!')
                          } else {
                            alert(result.error || 'Не удалось привязать биометрию')
                          }
                        } catch (e) {
                          alert('Ошибка при привязке биометрии')
                        }
                        setBiometricLoading(false)
                      }}
                      disabled={biometricLoading}
                      className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
                        theme === 'dark'
                          ? 'bg-[#4C7F6E]/20 hover:bg-[#4C7F6E]/30 text-white'
                          : 'bg-[#4C7F6E]/10 hover:bg-[#4C7F6E]/20 text-[#4C7F6E]'
                      } ${biometricLoading ? 'opacity-50' : ''}`}
                    >
                      {biometricLoading ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Fingerprint className="w-4 h-4" />
                      )}
                      <span>Привязать биометрию</span>
                    </button>
                  )}

                  {biometricRegistered && (
                    <>
                      <button
                        onClick={async () => {
                          if (confirm('Заменить биометрию? Старая будет удалена.')) {
                            await removeBiometricCredentials(user.id)
                            setBiometricLoading(true)
                            try {
                              const result = await registerBiometric(user.id, user.name || user.login || 'User')
                              if (result.success) {
                                alert('Биометрия успешно перепривязана!')
                              } else {
                                alert(result.error || 'Не удалось заменить биометрию')
                              }
                            } catch (e) {
                              alert('Ошибка при замене биометрии')
                            }
                            setBiometricLoading(false)
                          }
                        }}
                        disabled={biometricLoading}
                        className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
                          theme === 'dark'
                            ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400'
                            : 'bg-amber-50 hover:bg-amber-100 text-amber-600'
                        } ${biometricLoading ? 'opacity-50' : ''}`}
                      >
                        {biometricLoading ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <RefreshCw className="w-4 h-4" />
                        )}
                        <span>Заменить</span>
                      </button>

                      <button
                        onClick={async () => {
                          if (confirm('Удалить привязку биометрии?')) {
                            await removeBiometricCredentials(user.id)
                            setBiometricRegistered(false)
                            alert('Биометрия удалена!')
                          }
                        }}
                        className={`px-3 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
                          theme === 'dark'
                            ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400'
                            : 'bg-red-50 hover:bg-red-100 text-red-600'
                        }`}
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Удалить</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Status Card */}
              <div className={`p-4 rounded-2xl border ${
                biometricRegistered
                  ? theme === 'dark'
                    ? 'bg-emerald-500/5 border-emerald-500/10'
                    : 'bg-emerald-50 border-emerald-100'
                  : theme === 'dark'
                    ? 'bg-amber-500/5 border-amber-500/10'
                    : 'bg-amber-50 border-amber-100'
              }`}>
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-xl ${
                    biometricRegistered
                      ? theme === 'dark' ? 'bg-emerald-500/20' : 'bg-emerald-100'
                      : theme === 'dark' ? 'bg-amber-500/20' : 'bg-amber-100'
                  }`}>
                    {biometricRegistered ? (
                      <Check className={`w-5 h-5 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`} />
                    ) : (
                      <Lock className={`w-5 h-5 ${theme === 'dark' ? 'text-amber-400' : 'text-amber-600'}`} />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-sm font-bold mb-1 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {biometricRegistered ? 'Биометрия активна' : 'Биометрия не настроена'}
                    </h3>
                    <p className={`text-xs leading-relaxed ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {biometricRegistered
                        ? 'Вы можете входить в приложение быстро и безопасно с помощью биометрии.'
                        : 'Привяжите биометрию для быстрого и безопасного входа без ввода пароля.'
                      }
                    </p>
                    <p className={`text-[10px] mt-2 ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                      Примечание: биометрия привязывается по общему правилу к браузеру. Для входа с другого устройства или браузера — привяжите биометрию на нём.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Personal Data Section */}
        {user?.id && !isViewingOtherUser() && (
          <div className={`relative overflow-hidden rounded-3xl border transition-all duration-500 ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-[#1a1a1a] to-[#151515] border-white/5'
              : 'bg-white border-gray-100'
          }`}>
            <div className="relative z-10 p-5 md:p-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                <div className="flex items-center gap-4">
                  <div className={`p-3.5 rounded-2xl ${
                    theme === 'dark'
                      ? 'bg-gradient-to-br from-[#4C7F6E]/30 to-[#4C7F6E]/10'
                      : 'bg-gradient-to-br from-[#4C7F6E]/20 to-[#4C7F6E]/5'
                  }`}>
                    <UserIcon className="w-6 h-6 text-[#4C7F6E]" />
                  </div>
                  <div>
                    <h2 className={`text-lg font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      Персональные данные
                    </h2>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        isPersonalDataUnlocked
                          ? (personalData.lastName && personalData.firstName ? 'bg-emerald-500' : 'bg-amber-500')
                          : 'bg-amber-500'
                      }`} />
                      <p className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                        {isPersonalDataUnlocked
                          ? (personalData.lastName && personalData.firstName ? 'Заполнено' : 'Не заполнено')
                          : hasPersonalDataPin ? 'Требуется разблокировка' : 'Требуется установление пинкода'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4">
                  {!hasPersonalDataPin ? (
                    <button
                      onClick={() => setShowPersonalDataSetPinModal(true)}
                      className="px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 bg-[#4C7F6E] hover:bg-[#3d6b5a] text-white shadow-lg shadow-[#4C7F6E]/20"
                    >
                      <Key className="w-4 h-4" />
                      <span>Установить пинкод</span>
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleUnlockPersonalDataClick}
                        className="px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 bg-[#4C7F6E] hover:bg-[#3d6b5a] text-white"
                      >
                        {isPersonalDataUnlocked ? <Lock className="w-4 h-4" /> : <Key className="w-4 h-4" />}
                        <span>{isPersonalDataUnlocked ? 'Блокировать' : 'Разблокировать'}</span>
                      </button>
                      <button
                        onClick={() => setShowWhyModal(true)}
                        className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
                          theme === 'dark'
                            ? 'bg-blue-500/20 hover:bg-blue-500/30 text-white'
                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                        }`}
                      >
                        <Info className="w-4 h-4" />
                        <span>Зачем это?</span>
                      </button>
                      {isPersonalDataUnlocked && (
                        <button
                          onClick={() => {
                            setTempPersonalData(personalData)
                            setIsEditingPersonalData(true)
                          }}
                          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
                            theme === 'dark'
                              ? 'bg-[#4C7F6E]/20 hover:bg-[#4C7F6E]/30 text-white'
                              : 'bg-[#4C7F6E]/10 hover:bg-[#4C7F6E]/20 text-[#4C7F6E]'
                          }`}
                        >
                          <Pencil className="w-4 h-4" />
                          <span>Редактировать</span>
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Verification Status - под кнопками, справа */}
              {isPersonalDataUnlocked && personalData.lastName && personalData.firstName && personalData.passportNumber && (
                <div className="px-5 md:px-6 pb-5 md:pb-6 flex justify-end">
                  {personalDataVerificationStatus === 'approved' ? (
                    <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-emerald-500/30 border border-emerald-500/40">
                      <Check className="w-4 h-4" />
                      <span>Верифицировано</span>
                    </div>
                  ) : personalDataVerificationStatus === 'rejected' ? (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-red-500/30 border border-red-500/40">
                        <X className="w-4 h-4" />
                        <span>Отказ</span>
                        {dmComment && (
                          <button
                            onClick={() => setShowDmCommentModal(true)}
                            className="ml-1 p-0.5 rounded hover:bg-red-500/50"
                            title="Показать комментарий"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <button
                        onClick={handleSubmitForVerification}
                        disabled={verificationLoading}
                        className="px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 bg-[#4C7F6E] hover:bg-[#3d6b5a] text-white disabled:opacity-50"
                      >
                        {verificationLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        <span>Повторить</span>
                      </button>
                    </div>
                  ) : personalDataVerificationStatus === 'pending' ? (
                    <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-amber-500/30 border border-amber-500/40">
                      <Clock className="w-4 h-4 animate-pulse" />
                      <span>На рассмотрении</span>
                    </div>
                  ) : (
                    <button
                      onClick={handleSubmitForVerification}
                      disabled={verificationLoading}
                      className="px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 bg-[#4C7F6E] hover:bg-[#3d6b5a] text-white shadow-lg shadow-[#4C7F6E]/20 disabled:opacity-50"
                    >
                      {verificationLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      <span>Отправить на верификацию</span>
                    </button>
                  )}
                </div>
              )}

              {/* Locked State */}
              {!isPersonalDataUnlocked ? (
                <div className={`group relative text-center py-12 rounded-3xl border-2 border-dashed transition-all duration-500 ${
                  theme === 'dark'
                    ? 'border-[#4C7F6E]/20 bg-gradient-to-br from-[#4C7F6E]/5 to-transparent hover:border-[#4C7F6E]/40'
                    : 'border-[#4C7F6E]/20 bg-gradient-to-br from-[#4C7F6E]/5 to-transparent hover:border-[#4C7F6E]/40'
                }`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#4C7F6E]/10 rounded-full blur-3xl group-hover:bg-[#4C7F6E]/20 transition-all duration-500" />

                  <div className="relative z-10">
                    <div className={`w-20 h-20 mx-auto mb-5 rounded-3xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 ${
                      theme === 'dark' ? 'bg-[#4C7F6E]/20' : 'bg-[#4C7F6E]/10'
                    }`}>
                      <Lock className={`w-10 h-10 text-[#4C7F6E] transition-transform duration-500 group-hover:rotate-12 group-hover:translate-y-[-3px]`} />
                    </div>
                    <p className={`text-lg font-black mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Персональные данные заблокированы
                    </p>
                    <p className={`text-sm mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {hasPersonalDataPin
                        ? 'Нажмите «Разблокировать» для доступа к персональным данным'
                        : 'Нажмите «Установить пинкод» для доступа к персональным данным'
                      }
                    </p>
                    {hasPersonalDataPin && (
                      <button
                        onClick={handleUnlockPersonalDataClick}
                        className={`group/btn relative px-8 py-3.5 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 mx-auto overflow-hidden ${
                          theme === 'dark'
                            ? 'bg-gradient-to-r from-[#4C7F6E]/30 to-[#4C7F6E]/10 border border-[#4C7F6E]/30 hover:border-[#4C7F6E]/50 text-white'
                            : 'bg-gradient-to-r from-[#4C7F6E]/20 to-[#4C7F6E]/5 border border-[#4C7F6E]/30 hover:border-[#4C7F6E]/50 text-[#4C7F6E]'
                        }`}
                      >
                        <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                        <span className="relative flex items-center gap-2">
                          <Lock className="w-4 h-4 transition-transform duration-300 group-hover/btn:rotate-12 group-hover/btn:translate-y-[-2px]" />
                          <span>Разблокировать</span>
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
              /* Data Display - Improved Layout with Sections */
              <div className="space-y-6">
                {/* Section: Basic Info */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-1.5 h-1.5 rounded-full ${theme === 'dark' ? 'bg-[#4C7F6E]' : 'bg-[#4C7F6E]'}`} />
                    <span className={`text-sm font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      Основная информация
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* ФИО */}
                    <div className={`p-4 rounded-2xl border ${
                      theme === 'dark'
                        ? 'bg-white/[0.02] border-white/5'
                        : 'bg-gray-50 border-gray-100'
                    }`}>
                      <span className={`text-[9px] font-black uppercase tracking-wider block mb-1 ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                        ФИО
                      </span>
                      <p className={`text-sm font-bold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {personalData.lastName || personalData.firstName || personalData.middleName
                          ? `${personalData.lastName || ''} ${personalData.firstName || ''} ${personalData.middleName || ''}`.trim()
                          : '—'
                        }
                      </p>
                    </div>

                    {/* Дата рождения */}
                    <div className={`p-4 rounded-2xl border ${
                      theme === 'dark'
                        ? 'bg-white/[0.02] border-white/5'
                        : 'bg-gray-50 border-gray-100'
                    }`}>
                      <span className={`text-[9px] font-black uppercase tracking-wider block mb-1 ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                        Дата рождения
                      </span>
                      <p className={`text-sm font-bold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {formatDateDisplay(personalData.birthDate) || '—'}
                      </p>
                    </div>

                    {/* Место рождения */}
                    <div className={`p-4 rounded-2xl border ${
                      theme === 'dark'
                        ? 'bg-white/[0.02] border-white/5'
                        : 'bg-gray-50 border-gray-100'
                    }`}>
                      <span className={`text-[9px] font-black uppercase tracking-wider block mb-1 ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                        Место рождения
                      </span>
                      <p className={`text-sm font-bold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {personalData.birthPlace || '—'}
                      </p>
                    </div>

                    {/* Место регистрации */}
                    <div className={`p-4 rounded-2xl border ${
                      theme === 'dark'
                        ? 'bg-white/[0.02] border-white/5'
                        : 'bg-gray-50 border-gray-100'
                    }`}>
                      <span className={`text-[9px] font-black uppercase tracking-wider block mb-1 ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                        Место регистрации
                      </span>
                      <p className={`text-sm font-bold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {personalData.registrationAddress || '—'}
                      </p>
                    </div>

                    {/* Место проживания - full width */}
                    <div className={`p-4 rounded-2xl border sm:col-span-2 ${
                      theme === 'dark'
                        ? 'bg-white/[0.02] border-white/5'
                        : 'bg-gray-50 border-gray-100'
                    }`}>
                      <span className={`text-[9px] font-black uppercase tracking-wider block mb-1 ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                        Место проживания
                      </span>
                      <p className={`text-sm font-bold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {personalData.residenceAddress || '—'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section: Passport */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-1.5 h-1.5 rounded-full bg-blue-500`} />
                    <span className={`text-sm font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      Паспортные данные
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Серия паспорта */}
                    <div className={`p-4 rounded-2xl border ${
                      theme === 'dark'
                        ? 'bg-white/[0.02] border-white/5'
                        : 'bg-gray-50 border-gray-100'
                    }`}>
                      <span className={`text-[9px] font-black uppercase tracking-wider block mb-1 ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                        Серия паспорта
                      </span>
                      <p className={`text-sm font-bold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {personalData.passportSeries ? maskData(personalData.passportSeries, 2) : '—'}
                      </p>
                    </div>

                    {/* Номер паспорта */}
                    <div className={`p-4 rounded-2xl border ${
                      theme === 'dark'
                        ? 'bg-white/[0.02] border-white/5'
                        : 'bg-gray-50 border-gray-100'
                    }`}>
                      <span className={`text-[9px] font-black uppercase tracking-wider block mb-1 ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                        Номер паспорта
                      </span>
                      <p className={`text-sm font-bold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {personalData.passportNumber ? maskData(personalData.passportNumber, 2) : '—'}
                      </p>
                    </div>

                    {/* Кем выдан - full width */}
                    <div className={`p-4 rounded-2xl border sm:col-span-2 ${
                      theme === 'dark'
                        ? 'bg-white/[0.02] border-white/5'
                        : 'bg-gray-50 border-gray-100'
                    }`}>
                      <span className={`text-[9px] font-black uppercase tracking-wider block mb-1 ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                        Кем выдан
                      </span>
                      <p className={`text-sm font-bold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {personalData.passportIssuedBy ? maskName(personalData.passportIssuedBy) : '—'}
                      </p>
                    </div>

                    {/* Дата выдачи */}
                    <div className={`p-4 rounded-2xl border ${
                      theme === 'dark'
                        ? 'bg-white/[0.02] border-white/5'
                        : 'bg-gray-50 border-gray-100'
                    }`}>
                      <span className={`text-[9px] font-black uppercase tracking-wider block mb-1 ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                        Дата выдачи
                      </span>
                      <p className={`text-sm font-bold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {personalData.passportIssueDate ? formatDateDisplay(personalData.passportIssueDate) : '—'}
                      </p>
                    </div>

                    {/* Код подразделения */}
                    <div className={`p-4 rounded-2xl border ${
                      theme === 'dark'
                        ? 'bg-white/[0.02] border-white/5'
                        : 'bg-gray-50 border-gray-100'
                    }`}>
                      <span className={`text-[9px] font-black uppercase tracking-wider block mb-1 ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                        Код подразделения
                      </span>
                      <p className={`text-sm font-bold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {personalData.passportDepartmentCode ? maskData(personalData.passportDepartmentCode, 2) : '—'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section: Tax & Photos */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-1.5 h-1.5 rounded-full bg-emerald-500`} />
                    <span className={`text-sm font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      Данные налогоплательщика
                    </span>
                  </div>
                  <div className="space-y-3">
                    {/* ИНН */}
                    <div className={`p-4 rounded-2xl border ${
                      theme === 'dark'
                        ? 'bg-gradient-to-r from-[#4C7F6E]/10 to-transparent border-[#4C7F6E]/20'
                        : 'bg-gradient-to-r from-[#4C7F6E]/5 to-transparent border-[#4C7F6E]/20'
                    }`}>
                      <span className={`text-[9px] font-black uppercase tracking-wider block mb-1 ${
                        theme === 'dark' ? 'text-[#4C7F6E]' : 'text-[#4C7F6E]'
                      }`}>
                        ИНН
                      </span>
                      <p className={`text-sm font-bold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {personalData.inn ? maskData(personalData.inn, 4) : '—'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              )}
            </div>
          </div>
        )}

        {/* Phone Edit Modal */}
        {isEditingPhone && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className={`w-full max-w-md rounded-3xl p-6 border ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200'} shadow-2xl`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Изменить телефон</h3>
                <button onClick={() => setIsEditingPhone(false)} className="p-2 rounded-xl hover:bg-gray-500/10 transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Новый номер телефона</label>
                  <input
                    type="text"
                    value={tempPhone}
                    onChange={(e) => setTempPhone(e.target.value)}
                    className={`w-full px-4 py-3 rounded-2xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 ${
                      theme === 'dark' ? 'bg-white/5 border-white/10 text-white focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 focus:border-[#4C7F6E]'
                    }`}
                    placeholder="+7 (999) 000-00-00"
                  />
                </div>
                <button
                  onClick={handleUpdatePhone}
                  disabled={isSavingContact || !tempPhone}
                  className="w-full py-4 rounded-2xl bg-[#4C7F6E] hover:bg-[#3d6b5a] text-white font-black text-sm transition-all shadow-lg shadow-[#4C7F6E]/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSavingContact ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>Сохранить</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Email Edit Modal */}
        {isEditingEmail && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className={`w-full max-w-md rounded-3xl p-6 border ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200'} shadow-2xl`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Изменить Email</h3>
                <button onClick={() => setIsEditingEmail(false)} className="p-2 rounded-xl hover:bg-gray-500/10 transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Новый Email адрес</label>
                  <input
                    type="email"
                    value={tempEmail}
                    onChange={(e) => setTempEmail(e.target.value)}
                    className={`w-full px-4 py-3 rounded-2xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 ${
                      theme === 'dark' ? 'bg-white/5 border-white/10 text-white focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 focus:border-[#4C7F6E]'
                    }`}
                    placeholder="example@mail.com"
                  />
                </div>
                <button
                  onClick={handleUpdateEmail}
                  disabled={isSavingContact || !tempEmail}
                  className="w-full py-4 rounded-2xl bg-[#4C7F6E] hover:bg-[#3d6b5a] text-white font-black text-sm transition-all shadow-lg shadow-[#4C7F6E]/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSavingContact ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>Сохранить</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Telegram Edit Modal */}
        {isEditingTelegram && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className={`w-full max-w-md rounded-3xl p-6 border ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200'} shadow-2xl`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Изменить Telegram</h3>
                <button onClick={() => setIsEditingTelegram(false)} className="p-2 rounded-xl hover:bg-gray-500/10 transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Новый Telegram username</label>
                  <input
                    type="text"
                    value={tempTelegram}
                    onChange={(e) => setTempTelegram(e.target.value)}
                    className={`w-full px-4 py-3 rounded-2xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 ${
                      theme === 'dark' ? 'bg-white/5 border-white/10 text-white focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 focus:border-[#4C7F6E]'
                    }`}
                    placeholder="@username или ID"
                  />
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} ml-1`}>
                    Укажите ID или username, не указывайте ссылки, страницы профиля
                  </p>
                </div>
                <button
                  onClick={handleUpdateTelegram}
                  disabled={isSavingContact}
                  className="w-full py-4 rounded-2xl bg-[#4C7F6E] hover:bg-[#3d6b5a] text-white font-black text-sm transition-all shadow-lg shadow-[#4C7F6E]/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSavingContact ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>Сохранить</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Discord Edit Modal */}
        {isEditingDiscord && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className={`w-full max-w-md rounded-3xl p-6 border ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200'} shadow-2xl`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Изменить Discord</h3>
                <button onClick={() => setIsEditingDiscord(false)} className="p-2 rounded-xl hover:bg-gray-500/10 transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Новый Discord username</label>
                  <input
                    type="text"
                    value={tempDiscord}
                    onChange={(e) => setTempDiscord(e.target.value)}
                    className={`w-full px-4 py-3 rounded-2xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 ${
                      theme === 'dark' ? 'bg-white/5 border-white/10 text-white focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 focus:border-[#4C7F6E]'
                    }`}
                    placeholder="username или ID"
                  />
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} ml-1`}>
                    Укажите ID или username, не указывайте ссылки, страницы профиля
                  </p>
                </div>
                <button
                  onClick={handleUpdateDiscord}
                  disabled={isSavingContact}
                  className="w-full py-4 rounded-2xl bg-[#4C7F6E] hover:bg-[#3d6b5a] text-white font-black text-sm transition-all shadow-lg shadow-[#4C7F6E]/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSavingContact ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>Сохранить</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VK Edit Modal */}
        {isEditingVK && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className={`w-full max-w-md rounded-3xl p-6 border ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200'} shadow-2xl`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Изменить VK</h3>
                <button onClick={() => setIsEditingVK(false)} className="p-2 rounded-xl hover:bg-gray-500/10 transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Новый VK ID или username</label>
                  <input
                    type="text"
                    value={tempVK}
                    onChange={(e) => setTempVK(e.target.value)}
                    className={`w-full px-4 py-3 rounded-2xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 ${
                      theme === 'dark' ? 'bg-white/5 border-white/10 text-white focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 focus:border-[#4C7F6E]'
                    }`}
                    placeholder="ID или username"
                  />
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} ml-1`}>
                    Укажите ID или username, не указывайте ссылки, страницы профиля
                  </p>
                </div>
                <button
                  onClick={handleUpdateVK}
                  disabled={isSavingContact}
                  className="w-full py-4 rounded-2xl bg-[#4C7F6E] hover:bg-[#3d6b5a] text-white font-black text-sm transition-all shadow-lg shadow-[#4C7F6E]/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSavingContact ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>Сохранить</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* X (Twitter) Edit Modal */}
        {isEditingX && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className={`w-full max-w-md rounded-3xl p-6 border ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200'} shadow-2xl`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Изменить X (Twitter)</h3>
                <button onClick={() => setIsEditingX(false)} className="p-2 rounded-xl hover:bg-gray-500/10 transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Новый X username</label>
                  <input
                    type="text"
                    value={tempX}
                    onChange={(e) => setTempX(e.target.value)}
                    className={`w-full px-4 py-3 rounded-2xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 ${
                      theme === 'dark' ? 'bg-white/5 border-white/10 text-white focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 focus:border-[#4C7F6E]'
                    }`}
                    placeholder="@username или ID"
                  />
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} ml-1`}>
                    Укажите ID или username, не указывайте ссылки, страницы профиля
                  </p>
                </div>
                <button
                  onClick={handleUpdateX}
                  disabled={isSavingContact}
                  className="w-full py-4 rounded-2xl bg-[#4C7F6E] hover:bg-[#3d6b5a] text-white font-black text-sm transition-all shadow-lg shadow-[#4C7F6E]/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSavingContact ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>Сохранить</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Login Edit Modal */}
        {isEditingLogin && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className={`w-full max-w-md rounded-3xl p-6 border ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200'} shadow-2xl`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Изменить логин</h3>
                <button onClick={() => setIsEditingLogin(false)} className="p-2 rounded-xl hover:bg-gray-500/10 transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Новый логин</label>
                  <input
                    type="text"
                    value={tempLogin}
                    onChange={(e) => setTempLogin(e.target.value)}
                    className={`w-full px-4 py-3 rounded-2xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 ${
                      theme === 'dark' ? 'bg-white/5 border-white/10 text-white focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 focus:border-[#4C7F6E]'
                    }`}
                    placeholder="Введите новый логин"
                  />
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} ml-1`}>
                    Логин должен заканчиваться на <span className="font-bold text-[#4C7F6E]">@antarctic-alpha</span>
                  </p>
                </div>
                <button
                  onClick={handleUpdateLogin}
                  disabled={isSavingContact || !tempLogin}
                  className="w-full py-4 rounded-2xl bg-[#4C7F6E] hover:bg-[#3d6b5a] text-white font-black text-sm transition-all shadow-lg shadow-[#4C7F6E]/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSavingContact ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>Сохранить</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Password Edit Modal */}
        {isEditingPassword && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className={`w-full max-w-md rounded-3xl p-6 border ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200'} shadow-2xl`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Изменить пароль</h3>
                <button onClick={() => setIsEditingPassword(false)} className="p-2 rounded-xl hover:bg-gray-500/10 transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Новый пароль</label>
                  <input
                    type="text"
                    value={tempPassword}
                    onChange={(e) => setTempPassword(e.target.value)}
                    className={`w-full px-4 py-3 rounded-2xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 ${
                      theme === 'dark' ? 'bg-white/5 border-white/10 text-white focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 focus:border-[#4C7F6E]'
                    }`}
                    placeholder="Введите новый пароль"
                  />
                </div>
                <button
                  onClick={handleUpdatePassword}
                  disabled={isSavingContact || !tempPassword}
                  className="w-full py-4 rounded-2xl bg-[#4C7F6E] hover:bg-[#3d6b5a] text-white font-black text-sm transition-all shadow-lg shadow-[#4C7F6E]/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSavingContact ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>Сохранить</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Recovery Code Edit Modal */}
        {isEditingRecoveryCode && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className={`w-full max-w-md rounded-3xl p-6 border ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200'} shadow-2xl`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Изменить код восстановления</h3>
                <button onClick={() => setIsEditingRecoveryCode(false)} className="p-2 rounded-xl hover:bg-gray-500/10 transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Новый код восстановления</label>
                  <input
                    type="text"
                    value={tempRecoveryCode}
                    onChange={(e) => setTempRecoveryCode(e.target.value)}
                    className={`w-full px-4 py-3 rounded-2xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 ${
                      theme === 'dark' ? 'bg-white/5 border-white/10 text-white focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 focus:border-[#4C7F6E]'
                    }`}
                    placeholder="Введите новый код восстановления"
                  />
                </div>
                <button
                  onClick={handleUpdateRecoveryCode}
                  disabled={isSavingContact || !tempRecoveryCode}
                  className="w-full py-4 rounded-2xl bg-[#4C7F6E] hover:bg-[#3d6b5a] text-white font-black text-sm transition-all shadow-lg shadow-[#4C7F6E]/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSavingContact ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>Сохранить</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Auth Code Edit Modal */}
        {isEditingAuthCode && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className={`w-full max-w-md rounded-3xl p-6 border ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200'} shadow-2xl`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Изменить код авторизации</h3>
                <button onClick={() => setIsEditingAuthCode(false)} className="p-2 rounded-xl hover:bg-gray-500/10 transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Новый код авторизации</label>
                  <input
                    type="text"
                    value={tempAuthCode}
                    onChange={(e) => setTempAuthCode(e.target.value)}
                    className={`w-full px-4 py-3 rounded-2xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 ${
                      theme === 'dark' ? 'bg-white/5 border-white/10 text-white focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 focus:border-[#4C7F6E]'
                    }`}
                    placeholder="Введите новый код авторизации"
                  />
                </div>
                <button
                  onClick={handleUpdateAuthCode}
                  disabled={isSavingContact || !tempAuthCode}
                  className="w-full py-4 rounded-2xl bg-[#4C7F6E] hover:bg-[#3d6b5a] text-white font-black text-sm transition-all shadow-lg shadow-[#4C7F6E]/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSavingContact ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>Сохранить</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Personal Data Edit Modal */}
        {isEditingPersonalData && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <div className={`w-full max-w-2xl rounded-3xl p-6 border my-8 ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200'} shadow-2xl`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Персональные данные</h3>
                <button onClick={() => setIsEditingPersonalData(false)} className="p-2 rounded-xl hover:bg-gray-500/10 transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {/* ФИО */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Фамилия</label>
                    <input
                      type="text"
                      value={tempPersonalData.lastName}
                      onChange={(e) => setTempPersonalData({ ...tempPersonalData, lastName: e.target.value })}
                      className={`w-full px-4 py-3 rounded-2xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 ${
                        theme === 'dark' ? 'bg-white/5 border-white/10 text-white focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 focus:border-[#4C7F6E]'
                      }`}
                      placeholder="Иванов"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Имя</label>
                    <input
                      type="text"
                      value={tempPersonalData.firstName}
                      onChange={(e) => setTempPersonalData({ ...tempPersonalData, firstName: e.target.value })}
                      className={`w-full px-4 py-3 rounded-2xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 ${
                        theme === 'dark' ? 'bg-white/5 border-white/10 text-white focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 focus:border-[#4C7F6E]'
                      }`}
                      placeholder="Иван"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Отчество</label>
                    <input
                      type="text"
                      value={tempPersonalData.middleName}
                      onChange={(e) => setTempPersonalData({ ...tempPersonalData, middleName: e.target.value })}
                      className={`w-full px-4 py-3 rounded-2xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 ${
                        theme === 'dark' ? 'bg-white/5 border-white/10 text-white focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 focus:border-[#4C7F6E]'
                      }`}
                      placeholder="Иванович"
                    />
                  </div>
                </div>

                {/* Дата рождения и место рождения */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Дата рождения</label>
                    <input
                      type="date"
                      value={tempPersonalData.birthDate}
                      onChange={(e) => setTempPersonalData({ ...tempPersonalData, birthDate: e.target.value })}
                      className={`w-full px-4 py-3 rounded-2xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 ${
                        theme === 'dark' ? 'bg-white/5 border-white/10 text-white focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 focus:border-[#4C7F6E]'
                      }`}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Место рождения</label>
                    <input
                      type="text"
                      value={tempPersonalData.birthPlace}
                      onChange={(e) => setTempPersonalData({ ...tempPersonalData, birthPlace: e.target.value })}
                      className={`w-full px-4 py-3 rounded-2xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 ${
                        theme === 'dark' ? 'bg-white/5 border-white/10 text-white focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 focus:border-[#4C7F6E]'
                      }`}
                      placeholder="г. Москва, Россия"
                    />
                  </div>
                </div>

                {/* Место регистрации */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Место регистрации</label>
                  <input
                    type="text"
                    value={tempPersonalData.registrationAddress}
                    onChange={(e) => setTempPersonalData({ ...tempPersonalData, registrationAddress: e.target.value })}
                    className={`w-full px-4 py-3 rounded-2xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 ${
                      theme === 'dark' ? 'bg-white/5 border-white/10 text-white focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 focus:border-[#4C7F6E]'
                    }`}
                    placeholder="г. Москва, ул. Примерная, д. 1, кв. 1"
                  />
                </div>

                {/* Место проживания */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Место проживания</label>
                  <input
                    type="text"
                    value={tempPersonalData.residenceAddress}
                    onChange={(e) => setTempPersonalData({ ...tempPersonalData, residenceAddress: e.target.value })}
                    className={`w-full px-4 py-3 rounded-2xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 ${
                      theme === 'dark' ? 'bg-white/5 border-white/10 text-white focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 focus:border-[#4C7F6E]'
                    }`}
                    placeholder="г. Москва, ул. Примерная, д. 1, кв. 1"
                  />
                </div>

                {/* Паспортные данные */}
                <div className="space-y-3">
                  <h4 className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Паспортные данные</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Серия паспорта</label>
                      <input
                        type="text"
                        value={tempPersonalData.passportSeries}
                        onChange={(e) => setTempPersonalData({ ...tempPersonalData, passportSeries: e.target.value })}
                        className={`w-full px-4 py-3 rounded-2xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 ${
                          theme === 'dark' ? 'bg-white/5 border-white/10 text-white focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 focus:border-[#4C7F6E]'
                        }`}
                        placeholder="1234"
                        maxLength={4}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Номер паспорта</label>
                      <input
                        type="text"
                        value={tempPersonalData.passportNumber}
                        onChange={(e) => setTempPersonalData({ ...tempPersonalData, passportNumber: e.target.value })}
                        className={`w-full px-4 py-3 rounded-2xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 ${
                          theme === 'dark' ? 'bg-white/5 border-white/10 text-white focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 focus:border-[#4C7F6E]'
                        }`}
                        placeholder="123456"
                        maxLength={6}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Кем выдан</label>
                    <input
                      type="text"
                      value={tempPersonalData.passportIssuedBy}
                      onChange={(e) => setTempPersonalData({ ...tempPersonalData, passportIssuedBy: e.target.value })}
                      className={`w-full px-4 py-3 rounded-2xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 ${
                        theme === 'dark' ? 'bg-white/5 border-white/10 text-white focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 focus:border-[#4C7F6E]'
                      }`}
                      placeholder="УМВД России по г. Москве"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Дата выдачи</label>
                      <input
                        type="date"
                        value={tempPersonalData.passportIssueDate}
                        onChange={(e) => setTempPersonalData({ ...tempPersonalData, passportIssueDate: e.target.value })}
                        className={`w-full px-4 py-3 rounded-2xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 ${
                          theme === 'dark' ? 'bg-white/5 border-white/10 text-white focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 focus:border-[#4C7F6E]'
                        }`}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Код подразделения</label>
                      <input
                        type="text"
                        value={tempPersonalData.passportDepartmentCode}
                        onChange={(e) => setTempPersonalData({ ...tempPersonalData, passportDepartmentCode: e.target.value })}
                        className={`w-full px-4 py-3 rounded-2xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 ${
                          theme === 'dark' ? 'bg-white/5 border-white/10 text-white focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 focus:border-[#4C7F6E]'
                        }`}
                        placeholder="123-456"
                        maxLength={7}
                      />
                    </div>
                  </div>
                </div>

                {/* Фото паспорта - ссылка на файлообменник */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">
                    Фото паспорта (ссылка на файлообменник или облако)
                  </label>

                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Загрузите фото паспорта на любой файлообменник (с паролем) или используйте облако (например, mail) и предоставьте доступ по ссылке.
                  </p>

                  {/* Link input */}
                  <div className="space-y-2">
                    <input
                      type="url"
                      value={tempPersonalData.passportPhotosLink}
                      onChange={(e) => setTempPersonalData({ ...tempPersonalData, passportPhotosLink: e.target.value })}
                      className={`w-full px-4 py-3 rounded-2xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 ${
                        theme === 'dark' ? 'bg-white/5 border-white/10 text-white focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 focus:border-[#4C7F6E]'
                      }`}
                      placeholder="Ссылка на файлы"
                    />
                  </div>

                  {/* Password input */}
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={tempPersonalData.passportPhotosPassword}
                      onChange={(e) => setTempPersonalData({ ...tempPersonalData, passportPhotosPassword: e.target.value })}
                      className={`w-full px-4 py-3 rounded-2xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 ${
                        theme === 'dark' ? 'bg-white/5 border-white/10 text-white focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 focus:border-[#4C7F6E]'
                      }`}
                      placeholder="Пароль от данных (при наличии)"
                    />
                  </div>

                  {/* Instruction button */}
                  <button
                    onClick={() => setShowPassportInstructionModal(true)}
                    className={`w-full px-4 py-3 rounded-2xl font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                      theme === 'dark'
                        ? 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'
                    }`}
                  >
                    <HelpCircle className="w-4 h-4" />
                    <span>Инструкция по подготовке фото</span>
                  </button>

                  <p className={`text-[10px] ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                    ⚠️ Сохранение загруженных файлов установите на 72 часа с момента отправки на верификацию.
                  </p>
                </div>

                {/* ИНН */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">ИНН (Индивидуальный номер налогоплательщика)</label>
                  <input
                    type="text"
                    value={tempPersonalData.inn}
                    onChange={(e) => setTempPersonalData({ ...tempPersonalData, inn: e.target.value })}
                    className={`w-full px-4 py-3 rounded-2xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 ${
                      theme === 'dark' ? 'bg-white/5 border-white/10 text-white focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 focus:border-[#4C7F6E]'
                    }`}
                    placeholder="123456789012"
                    maxLength={12}
                  />
                </div>
              </div>

              <button
                onClick={handleSavePersonalData}
                disabled={isSavingPersonalData}
                className="w-full mt-6 py-4 rounded-2xl bg-[#4C7F6E] hover:bg-[#3d6b5a] text-white font-black text-sm transition-all shadow-lg shadow-[#4C7F6E]/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSavingPersonalData ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>Отправить на верификацию</span>
              </button>
            </div>
          </div>
        )}

        {/* Personal Data Set PIN Modal */}
        {showPersonalDataSetPinModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className={`w-full max-w-md rounded-3xl p-6 border ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200'} shadow-2xl`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {personalDataPinStep === 'first' ? 'Установить пинкод' : 'Подтвердите пинкод'}
                </h3>
                <button onClick={() => { setShowPersonalDataSetPinModal(false); setPersonalDataPinStep('first'); setPersonalDataPin(''); setPersonalDataPinConfirm(''); }} className="p-2 rounded-xl hover:bg-gray-500/10 transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                {personalDataPinStep === 'first' ? (
                  <>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Придумайте пинкод</label>
                      <div className="relative">
                        <input
                          type={showPersonalDataPin ? 'text' : 'password'}
                          value={personalDataPin}
                          onChange={(e) => setPersonalDataPin(e.target.value)}
                          className={`w-full px-4 py-3 rounded-2xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 ${
                            theme === 'dark' ? 'bg-white/5 border-white/10 text-white focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 focus:border-[#4C7F6E]'
                          }`}
                          placeholder="Введите пинкод (минимум 4 символа)"
                          maxLength={20}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPersonalDataPin(!showPersonalDataPin)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                        >
                          {showPersonalDataPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                      Этот пинкод будет использоваться для защиты ваших персональных данных
                    </p>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Подтвердите пинкод</label>
                      <div className="relative">
                        <input
                          type={showPersonalDataPinConfirm ? 'text' : 'password'}
                          value={personalDataPinConfirm}
                          onChange={(e) => setPersonalDataPinConfirm(e.target.value)}
                          className={`w-full px-4 py-3 rounded-2xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 ${
                            theme === 'dark' ? 'bg-white/5 border-white/10 text-white focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 focus:border-[#4C7F6E]'
                          }`}
                          placeholder="Повторите пинкод"
                          maxLength={20}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPersonalDataPinConfirm(!showPersonalDataPinConfirm)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                        >
                          {showPersonalDataPinConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {personalDataPinError && (
                  <p className="text-red-500 text-sm font-medium">{personalDataPinError}</p>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => { setShowPersonalDataSetPinModal(false); setPersonalDataPinStep('first'); setPersonalDataPin(''); setPersonalDataPinConfirm(''); }}
                    className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all ${
                      theme === 'dark' ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                    }`}
                  >
                    Отмена
                  </button>
                  <button
                    onClick={personalDataPinStep === 'first' ? handlePersonalDataSetPin : handlePersonalDataConfirmPin}
                    disabled={personalDataPinLoading || (personalDataPinStep === 'first' ? personalDataPin.length < 4 : !personalDataPinConfirm)}
                    className="flex-1 py-3 px-4 rounded-xl bg-[#4C7F6E] hover:bg-[#3d6b5a] text-white font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {personalDataPinLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
                    {personalDataPinStep === 'first' ? 'Продолжить' : 'Сохранить'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Personal Data Unlock Modal */}
        {showPersonalDataUnlockModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className={`w-full max-w-md rounded-3xl p-6 border ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200'} shadow-2xl`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Разблокировать данные</h3>
                <button onClick={() => { setShowPersonalDataUnlockModal(false); setPersonalDataPin(''); }} className="p-2 rounded-xl hover:bg-gray-500/10 transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#4C7F6E]/10 border border-[#4C7F6E]/20">
                  <Lock className="w-5 h-5 text-[#4C7F6E]" />
                  <p className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Введите пинкод для доступа к персональным данным
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Пинкод</label>
                  <div className="relative">
                    <input
                      type={showPersonalDataPin ? 'text' : 'password'}
                      value={personalDataPin}
                      onChange={(e) => setPersonalDataPin(e.target.value)}
                      className={`w-full px-4 py-3 rounded-2xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 ${
                        theme === 'dark' ? 'bg-white/5 border-white/10 text-white focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 focus:border-[#4C7F6E]'
                      }`}
                      placeholder="Введите пинкод"
                      maxLength={20}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPersonalDataPin(!showPersonalDataPin)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                    >
                      {showPersonalDataPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {personalDataPinError && (
                  <p className="text-red-500 text-sm font-medium">{personalDataPinError}</p>
                )}

                {/* Biometric Unlock Option */}
                {biometricRegistered && (
                  <div className="flex items-center gap-2">
                    <div className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      theme === 'dark'
                        ? 'border-[#4C7F6E]/30 hover:border-[#4C7F6E]/50 bg-[#4C7F6E]/10 text-white'
                        : 'border-[#4C7F6E]/30 hover:border-[#4C7F6E]/50 bg-[#4C7F6E]/10 text-[#4C7F6E]'
                    }`}
                    onClick={handlePersonalDataUnlockBiometric}
                    >
                      <Fingerprint className={`w-5 h-5 ${personalDataBiometricLoading ? 'animate-pulse' : ''}`} />
                      <span className="text-sm font-bold">
                        {personalDataBiometricLoading ? 'Проверка...' : 'Разблокировать биометрией'}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => { setShowPersonalDataUnlockModal(false); setPersonalDataPin(''); }}
                    className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all ${
                      theme === 'dark' ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                    }`}
                  >
                    Отмена
                  </button>
                  <button
                    onClick={handlePersonalDataUnlock}
                    disabled={personalDataPinLoading || !personalDataPin}
                    className="flex-1 py-3 px-4 rounded-xl bg-[#4C7F6E] hover:bg-[#3d6b5a] text-white font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {personalDataPinLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Unlock className="w-4 h-4" />}
                    Разблокировать
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Why Modal - Detailed Information */}
        {showWhyModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <div className={`w-full max-w-3xl rounded-3xl p-6 border my-8 ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200'} shadow-2xl`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Зачем сообществу ваш ИНН и паспорт?
                </h3>
                <button onClick={() => setShowWhyModal(false)} className="p-2 rounded-xl hover:bg-gray-500/10 transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className={`space-y-6 max-h-[70vh] overflow-y-auto pr-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>

                <p className="text-sm leading-relaxed mb-4">
                  Взаимодействие в рамках сообщества подразумевает работу с высокорисковыми активами, что требует от соблюдения протоколов безопасности транзакционного контура.
                </p>

                {/* 1. Архитектура выплат и AML-мониторинг */}
                <div className="space-y-3">
                  <h4 className={`text-base font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>1. Архитектура выплат и AML-мониторинг</h4>
                  <p className="text-sm leading-relaxed">
                    Выплаты (выплаты, компенсации, вознаграждения) осуществляются с консолидированного корпоративного счета (кошелька).
                    Любой исходящий транзакционный поток подвергается анализу автоматизированными AML-системами (Anti-Money Laundering). Без предварительной идентификации получателя (KYC) сервис-монитор классифицирует транзакцию как «анонимный перевод с высоким риском обналичивания». Это дает платформе законное право на принудительную блокировку (freeze) средств до выяснения источника происхождения. В ряде случаев отсутствие данных приводит к перманентной потере активов без права обжалования.
                  </p>
                </div>

                {/* 2. Целевое использование идентификационных данных */}
                <div className="space-y-3">
                  <h4 className={`text-base font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>2. Целевое использование идентификационных данных</h4>
                  <p className="text-sm leading-relaxed">Предоставление ИНН и паспортных данных — это не формальность, а инструмент юридической защиты участника. Эти данные позволяют нам:</p>
                  <ul className="list-disc list-inside text-sm space-y-2 ml-2">
                    <li><span className="font-bold">Верифицировать статус:</span> подтвердить, что получатель не включен в международные санкционные списки (OFAC, EU), а также в перечни лиц, причастных к экстремизму или терроризму.</li>
                    <li><span className="font-bold">Исключить «дропперство»:</span> доказать проверяющим органам, что вы являетесь реальным бенефициаром средств, а не подставным лицом, используемым в схемах по выводу капитала.</li>
                    <li><span className="font-bold">Процессуальное представительство:</span> в случае блокировки выплаты на стороне банка или биржи, сообщество выступает вашим официальным представителем. Без ваших данных у нас нет законных оснований (правосубъектности) для подачи апелляции и защиты ваших интересов.</li>
                  </ul>
                </div>

                {/* 3. Критичность внутренней верификации */}
                <div className="space-y-3">
                  <h4 className={`text-base font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>3. Критичность внутренней верификации</h4>
                  <p className="text-sm leading-relaxed">Зачастую участники полагают, что идентификации на стороне их личной биржи достаточно. Это заблуждение:</p>
                  <ul className="list-disc list-inside text-sm space-y-2 ml-2">
                    <li><span className="font-bold">Проблема юридического разрыва:</span> биржа видит вас, но не видит легитимную связь между вашим счетом и общим кошельком сообщества. Для системы это выглядит как перевод между чужими людьми, что является триггером для финансового мониторинга.</li>
                    <li><span className="font-bold">Статус «верифицированного сообщества»:</span> наличие базы данных участников позволяет нам маркировать транзакции как «внутрикорпоративное распределение активов». Это кратно снижает риск-скоринг операций для всех участников сообщества.</li>
                  </ul>
                </div>

                {/* 4. Расширенный перечень данных */}
                <div className="space-y-3">
                  <h4 className={`text-base font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>4. Расширенный перечень данных</h4>
                  <p className="text-sm leading-relaxed">ФИО, дата рождения и адрес регистрации являются обязательными атрибутами, без которых технически невозможно провести проверку:</p>
                  <ul className="list-disc list-inside text-sm space-y-2 ml-2">
                    <li><span className="font-bold">Определение юрисдикции:</span> место проживания критично для определения налогового режима. Мы обязаны знать, являетесь ли вы налоговым резидентом РФ или иной страны, чтобы применять соответствующие международные конвенции об избежании двойного налогообложения.</li>
                    <li><span className="font-bold">Проверка по линии ФССП и ФНС:</span> наличие непогашенных задолженностей (в т.ч. по алиментам) делает перевод в ваш адрес «сделкой по выводу активов из-под взыскания». Это создает риск наложения ареста на весь кошелек сообщества. Мы обязаны исключить этот риск для безопасности остальных участников.</li>
                  </ul>
                </div>

                {/* 5. Безопасность и право на передачу данных */}
                <div className="space-y-3">
                  <h4 className={`text-base font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>5. Безопасность и право на передачу данных</h4>
                  <p className="text-sm leading-relaxed">Мы строго придерживаемся политики конфиденциальности (Data Privacy) в рамках 152-ФЗ:</p>
                  <ul className="list-disc list-inside text-sm space-y-2 ml-2">
                    <li>Данные могут быть переданы в ФНС, ФССП, МВД, ФСБ, Росфинмониторинг и иные органы государственной власти исключительно в рамках официального запроса или при наступлении обстоятельств, предусмотренных законодательством.</li>
                    <li>Исключена любая передача данных третьим лицам в маркетинговых или иных корыстных целях. Данные хранятся в зашифрованном виде с ограниченным доступом.</li>
                  </ul>
                </div>

                {/* 6. Юридические последствия отказа */}
                <div className="space-y-3">
                  <h4 className={`text-base font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>6. Юридические последствия отказа</h4>
                  <p className="text-sm leading-relaxed">Участник имеет право не предоставлять данные, принимая на себя следующие риски:</p>
                  <ul className="list-disc list-inside text-sm space-y-2 ml-2">
                    <li><span className="font-bold">Отказ в проведении выплаты:</span> если транзакция несет риск блокировки общего счета, сообщество вправе заморозить выплату до момента верификации.</li>
                    <li><span className="font-bold">Самостоятельное регулирование споров:</span> в случае блокировки средств на стороне банка или биржи, вы будете вынуждены решать проблему самостоятельно без юридической поддержки сообщества.</li>
                    <li><span className="font-bold">Повышенная комиссия (Risk Premium):</span> в некоторых случаях транзакции на неверифицированные аккаунты могут облагаться дополнительным сбором из-за необходимости использования более сложных и дорогих каналов вывода.</li>
                  </ul>
                </div>

              </div>

              <button
                onClick={() => setShowWhyModal(false)}
                className="w-full mt-6 py-4 rounded-2xl bg-[#4C7F6E] hover:bg-[#3d6b5a] text-white font-black text-sm transition-all shadow-lg shadow-[#4C7F6E]/20"
              >
                Понятно
              </button>
            </div>
          </div>
        )}

        {/* Passport Instruction Modal */}
        {showPassportInstructionModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <div className={`w-full max-w-2xl rounded-3xl p-6 border my-8 ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200'} shadow-2xl`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Инструкция по верификации: Фото паспорта
                </h3>
                <button onClick={() => setShowPassportInstructionModal(false)} className="p-2 rounded-xl hover:bg-gray-500/10 transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className={`space-y-6 max-h-[70vh] overflow-y-auto pr-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>

                {/* 1. Какие страницы нужны? */}
                <div className="space-y-3">
                  <h4 className={`text-base font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>1. Какие страницы нужны?</h4>
                  <ul className="list-disc list-inside text-sm space-y-2 ml-2">
                    <li>Разворот 2-3: Главная страница с фото (где серия/номер) + страница с пропиской/регистрацией.</li>
                    <li>Разворот 4-5: Страница с семейным положением.</li>
                    <li>Последняя страница: Где отметка о ранее выданных паспортах (если есть).</li>
                  </ul>
                </div>

                {/* 2. Требования к файлу */}
                <div className="space-y-3">
                  <h4 className={`text-base font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>2. Требования к файлу</h4>
                  <ul className="list-disc list-inside text-sm space-y-2 ml-2">
                    <li>Качество: Чёткий текст без смазывания, видны все серии, номера и микротекст.</li>
                    <li>Освещение: Естественный дневной свет, без бликов от лампы.</li>
                    <li>Все данные видны, не скрыты и не изменены каким-либо способом.</li>
                  </ul>
                </div>

                {/* 3. Как правильно сфотографировать */}
                <div className="space-y-3">
                  <h4 className={`text-base font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>3. Как правильно сфотографировать</h4>
                  <ul className="list-disc list-inside text-sm space-y-2 ml-2">
                    <li>Фон: Положите паспорт на однотонную поверхность (без узоров, ковров, газет).</li>
                    <li>Рамка: Паспорт должен занимать 90% кадра. Не держите пальцы на страницах.</li>
                    <li>Угол: Снимайте строго сверху (не под углом 45°), чтобы не было искажений букв. Убедитесь, что видны водяные знаки.</li>
                  </ul>
                </div>

                {/* 4. Что категорически нельзя делать */}
                <div className="space-y-3">
                  <h4 className={`text-base font-bold text-red-500`}>4. Что категорически нельзя делать (отказ в верификации)</h4>
                  <ul className="list-disc list-inside text-sm space-y-2 ml-2">
                    <li className="text-red-400">❌ Закрывать углы или данные рукой / пальцем.</li>
                    <li className="text-red-400">❌ Использовать фотошоп, нейросеть или редакторы. Мы проверяем метаданные и цифровую подпись фото.</li>
                    <li className="text-red-400">❌ Отправлять ч/б копию, ксерокопию или сканер.</li>
                    <li className="text-red-400">❌ Делать селфи с паспортом в руках.</li>
                    <li className="text-red-400">❌ Присылать фото паспорта на фоне монитора/лампы/окна.</li>
                    <li className="text-red-400">❌ Ставить водяные знаки «Только для верификации» поверх данных.</li>
                  </ul>
                </div>

              </div>

              <button
                onClick={() => setShowPassportInstructionModal(false)}
                className="w-full mt-6 py-4 rounded-2xl bg-[#4C7F6E] hover:bg-[#3d6b5a] text-white font-black text-sm transition-all shadow-lg shadow-[#4C7F6E]/20"
              >
                Понятно
              </button>
            </div>
          </div>
        )}

        {/* DM Comment Modal - для отображения комментария при отказе в верификации */}
        {showDmCommentModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <div className={`w-full max-w-md rounded-3xl p-6 border ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200'} shadow-2xl`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Комментарий DM
                </h3>
                <button onClick={() => setShowDmCommentModal(false)} className="p-2 rounded-xl hover:bg-gray-500/10 transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className={`p-4 rounded-2xl mb-6 ${
                theme === 'dark' ? 'bg-[#4C7F6E]/10 border border-[#4C7F6E]/20' : 'bg-[#4C7F6E]/10 border border-[#4C7F6E]/20'
              }`}>
                <div className="flex items-start gap-3">
                  <MessageCircle className={`w-5 h-5 shrink-0 mt-0.5 text-white`} />
                  <p className={`text-sm leading-relaxed text-white`}>
                    {dmComment || 'Комментарий не был предоставлен'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowDmCommentModal(false)}
                className="w-full py-3 rounded-2xl bg-[#4C7F6E] hover:bg-[#3d6b5a] text-white font-bold text-sm transition-all"
              >
                Закрыть
              </button>
            </div>
          </div>
        )}

        {/* Sessions are tracked but hidden from UI - functionality preserved */}

        {/* My Wallets Section - UPGRADED */}
        <div className={`relative overflow-hidden rounded-3xl border transition-all duration-500 ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-[#1a1a1a] to-[#141414] border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
            : 'bg-white border-gray-100 shadow-[0_8px_32px_rgba(76,127,110,0.08)]'
        }`}>
          {/* Декоративные элементы */}
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-40 h-40 bg-gradient-to-bl from-[#4C7F6E]/15 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl" />

          {/* Grid pattern */}
          <div className={`absolute inset-0 opacity-[0.015] ${
            theme === 'dark' ? 'bg-[url("image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")]' : ''
          }`} />

          <div className="relative z-10 p-5 md:p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
              <div className="flex items-center gap-4">
                <div className={`relative p-3.5 rounded-2xl ${
                  theme === 'dark'
                    ? 'bg-gradient-to-br from-[#4C7F6E]/30 to-[#4C7F6E]/10'
                    : 'bg-gradient-to-br from-[#4C7F6E]/20 to-[#4C7F6E]/5'
                }`}>
                  <Coins className="w-6 h-6 text-[#4C7F6E]" />
                  <div className="absolute -inset-2 bg-[#4C7F6E]/20 rounded-2xl blur-xl -z-10" />
                </div>
                <div>
                  <h2 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Trade Wallet
                  </h2>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isWalletsUnlocked ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                    <p className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                      {isWalletsUnlocked ? 'Данные доступны' : 'Требуется разблокировка'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                {isWalletsUnlocked && (
                  <button
                    onClick={handleLockWallets}
                    className={`px-3 py-2 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                      theme === 'dark'
                        ? 'bg-white/10 text-white hover:bg-white/20'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    <Lock className="w-4 h-4" />
                    <span className="hidden sm:inline">Заблокировать</span>
                  </button>
                )}
                {hasPinCode && (
                  <button
                    onClick={handleOpenChangePinModal}
                    className={`px-3 py-2 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                      theme === 'dark'
                        ? 'bg-white/10 text-white hover:bg-white/20'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                    title="Сменить пинкод"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span className="hidden sm:inline">Сменить пинкод</span>
                  </button>
                )}
                <button
                  onClick={() => setShowAddWalletModal(true)}
                  className={`px-3 py-2 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                    theme === 'dark'
                      ? 'bg-white/10 text-white hover:bg-white/20'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Добавить</span>
                </button>
              </div>
            </div>

            {/* Wallet count and actions */}
            {isWalletsUnlocked && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <div className={`flex items-center gap-2 text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  <div className="w-2 h-2 rounded-full bg-[#4C7F6E] animate-pulse" />
                  <span>{wallets.length} {wallets.length === 1 ? 'кошелёк' : wallets.length >= 2 && wallets.length <= 4 ? 'кошелька' : 'кошельков'}</span>
                </div>
                {wallets.length > 0 && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={fetchAllWalletBalances}
                      disabled={balancesLoading}
                      className="px-3 py-1.5 rounded-lg bg-[#4C7F6E] hover:bg-[#3d6b5a] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-[#4C7F6E]/10"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${balancesLoading ? 'animate-spin' : ''}`} />
                      <span className="hidden sm:inline">Обновить</span>
                    </button>
                    <button
                      onClick={handleExportWallets}
                      className="px-3 py-1.5 rounded-lg bg-[#4C7F6E] hover:bg-[#3d6b5a] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-[#4C7F6E]/10"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Экспорт</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Locked State - Enhanced */}
            {!isWalletsUnlocked ? (
              <div className={`group relative text-center py-12 rounded-3xl border-2 border-dashed transition-all duration-500 ${
                theme === 'dark'
                  ? 'border-[#4C7F6E]/20 bg-gradient-to-br from-[#4C7F6E]/5 to-transparent hover:border-[#4C7F6E]/40'
                  : 'border-[#4C7F6E]/20 bg-gradient-to-br from-[#4C7F6E]/5 to-transparent hover:border-[#4C7F6E]/40'
              }`}>
                {/* Decor */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#4C7F6E]/10 rounded-full blur-3xl group-hover:bg-[#4C7F6E]/20 transition-all duration-500" />

                <div className="relative z-10">
                  <div className={`w-20 h-20 mx-auto mb-5 rounded-3xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 ${
                    theme === 'dark' ? 'bg-[#4C7F6E]/20' : 'bg-[#4C7F6E]/10'
                  }`}>
                    <Lock className={`w-10 h-10 text-[#4C7F6E] transition-transform duration-500 group-hover:rotate-12 group-hover:translate-y-[-3px]`} />
                  </div>
                  <p className={`text-lg font-black mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Кошельки заблокированы
                  </p>
                  <p className={`text-sm mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Нажмите «Разблокировать» для доступа к кошелькам
                  </p>
                  <button
                    onClick={handleUnlockWallets}
                    className={`group/btn relative px-8 py-3.5 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 mx-auto overflow-hidden ${
                      theme === 'dark'
                        ? 'bg-gradient-to-r from-[#4C7F6E]/30 to-[#4C7F6E]/10 border border-[#4C7F6E]/30 hover:border-[#4C7F6E]/50 text-white'
                        : 'bg-gradient-to-r from-[#4C7F6E]/20 to-[#4C7F6E]/5 border border-[#4C7F6E]/30 hover:border-[#4C7F6E]/50 text-[#4C7F6E]'
                    }`}
                  >
                    <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    <span className="relative flex items-center gap-2">
                      <Lock className="w-4 h-4 transition-transform duration-300 group-hover/btn:rotate-12 group-hover/btn:translate-y-[-2px]" />
                      <span>Разблокировать</span>
                    </span>
                  </button>
                </div>
              </div>
            ) : walletsLoading ? (
              <div className={`text-center py-12 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                <div className="w-8 h-8 border-3 border-[#4C7F6E]/30 border-t-[#4C7F6E] rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm font-medium">Загрузка кошельков...</p>
              </div>
            ) : wallets.length === 0 ? (
              <div className={`text-center py-12 rounded-3xl border-2 border-dashed ${
                theme === 'dark'
                  ? 'border-white/10 bg-white/5'
                  : 'border-gray-200 bg-gray-50'
              }`}>
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                  theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'
                }`}>
                  <Wallet className={`w-8 h-8 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
                </div>
                <p className={`text-base font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Нет сохранённых кошельков
                </p>
                <p className={`text-sm mb-5 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                  Нажмите «Добавить» для сохранения данных кошелька
                </p>
                <button
                  onClick={() => setShowAddWalletModal(true)}
                  className="px-6 py-2.5 rounded-xl bg-[#4C7F6E] hover:bg-[#3d6b5a] text-white font-bold text-sm transition-all flex items-center gap-2 mx-auto shadow-lg shadow-[#4C7F6E]/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Добавить кошелёк</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {wallets.map((wallet) => {
                  const balance = walletBalances[wallet.id]
                  const isExpanded = showWalletCredentials && activeCredentialWalletId === wallet.id

                  return (
                  <div
                    key={wallet.id}
                    className={`relative rounded-3xl border transition-all duration-500 overflow-hidden group ${
                      theme === 'dark'
                        ? 'bg-gradient-to-br from-[#121620] to-[#0d0f14] border-[#4C7F6E]/20 hover:border-[#4C7F6E]/40 shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
                        : 'bg-white border-gray-100 hover:border-[#4C7F6E]/30 hover:shadow-xl hover:shadow-[#4C7F6E]/10'
                    } ${isExpanded ? 'ring-2 ring-[#4C7F6E]' : ''}`}
                  >
                    {/* Фоновый декор */}
                    <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[80px] transition-opacity duration-700 ${
                      isExpanded ? 'bg-[#4C7F6E]/30 opacity-100' : 'bg-[#4C7F6E]/5 opacity-0 group-hover:opacity-50'
                    }`} />

                    {/* Основной контент карточки */}
                    <div className="p-5 md:p-6 relative z-10">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                        {/* Левая часть: Название и Адрес */}
                        <div className="flex-1 min-w-0 order-1">
                          <div className="flex items-center gap-2.5 mb-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#4C7F6E] animate-pulse" />
                            <h3 className={`text-lg font-black tracking-tight truncate ${
                              theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>
                              {wallet.name}
                            </h3>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <code className={`text-[11px] font-mono px-2.5 py-1 rounded-lg ${
                              theme === 'dark' ? 'bg-white/5 text-gray-400' : 'bg-gray-50 text-gray-500'
                            }`}>
                              {wallet.address.slice(0, 6)}...{wallet.address.slice(-6)}
                            </code>
                            <button
                              onClick={() => copyToClipboard(wallet.address, `wallet-${wallet.id}`)}
                              className={`p-1.5 rounded-lg transition-all hover:scale-110 ${
                                copiedField === `wallet-${wallet.id}`
                                  ? 'bg-emerald-500 text-white'
                                  : theme === 'dark' ? 'hover:bg-white/10 text-gray-400 hover:text-[#4C7F6E]' : 'hover:bg-gray-100 text-gray-500 hover:text-[#4C7F6E]'
                              }`}
                              title="Копировать адрес"
                            >
                              {copiedField === `wallet-${wallet.id}` ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>

                        {/* Центральная часть: Баланс - Enhanced */}
                        <div className={`flex items-center gap-3 sm:gap-5 px-4 py-3 rounded-2xl transition-all order-3 lg:order-2 ${
                          theme === 'dark' ? 'bg-gradient-to-r from-white/5 to-white/[0.02]' : 'bg-gradient-to-r from-[#4C7F6E]/10 to-[#4C7F6E]/5'
                        }`}>
                          <div className="text-right">
                            <div className={`text-[9px] font-black uppercase tracking-widest mb-1 ${
                              theme === 'dark' ? 'text-gray-500' : 'text-[#4C7F6E]/70'
                            }`}>
                              USDT
                            </div>
                            <div className="flex items-baseline gap-1">
                              <span className={`text-lg sm:text-xl font-black ${
                                theme === 'dark' ? 'text-white' : 'text-gray-900'
                              }`}>
                                {balance ? `${balance.usd.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—'}
                              </span>
                              <span className={`text-[10px] font-bold ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>$</span>
                            </div>
                          </div>
                          <div className="hidden sm:block w-px h-10 bg-[#4C7F6E]/20" />
                          <div className="text-left">
                            <div className={`text-[9px] font-black uppercase tracking-widest mb-1 ${
                              theme === 'dark' ? 'text-gray-500' : 'text-[#4C7F6E]/70'
                            }`}>
                              SOL
                            </div>
                            <div className="flex items-baseline gap-1">
                              <span className={`text-lg sm:text-xl font-black ${
                                theme === 'dark' ? 'text-white' : 'text-gray-900'
                              }`}>
                                {balance ? `${balance.sol.toFixed(3)}` : '—'}
                              </span>
                              <span className={`text-[10px] font-bold ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>SOL</span>
                            </div>
                          </div>
                        </div>

                        {/* Правая часть: Быстрые действия */}
                        <div className="flex items-center justify-between lg:justify-end gap-1 order-2 lg:order-3">
                          <a
                            href={`https://solscan.io/address/${wallet.address}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`p-2.5 rounded-xl transition-all hover:scale-110 ${
                              theme === 'dark' ? 'hover:bg-white/10 text-gray-400 hover:text-[#4C7F6E]' : 'hover:bg-gray-100 text-gray-500 hover:text-[#4C7F6E]'
                            }`}
                            title="Solscan"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                            <button
                              onClick={() => setViewingWallet(wallet)}
                              className={`p-2.5 rounded-xl transition-all hover:scale-110 ${
                                theme === 'dark' ? 'hover:bg-white/10 text-gray-400 hover:text-[#4C7F6E]' : 'hover:bg-gray-100 text-gray-500 hover:text-[#4C7F6E]'
                              }`}
                              title="Подробнее"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          <button
                            onClick={() => setWalletToDelete(wallet)}
                            className={`p-2.5 rounded-xl transition-all hover:scale-110 ${
                              theme === 'dark' ? 'hover:bg-rose-500/10 text-rose-400 hover:text-rose-300' : 'hover:bg-rose-50 text-rose-500 hover:text-rose-600'
                            }`}
                            title="Удалить"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                  </div>

                  {/* Разворачиваемая приватная часть */}
                  <div className={`transition-all duration-500 ease-in-out ${
                    isExpanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                  }`}>
                    <div className={`p-5 pt-0 space-y-4 ${theme === 'dark' ? 'bg-[#4C7F6E]/5' : 'bg-gray-50'}`}>
                      {/* Timer if active - Enhanced */}
                      {isExpanded && walletCredentialsTimer !== null && (
                        <div className={`p-3 rounded-xl flex items-center justify-between gap-3 ${
                          walletCredentialsTimer <= 10
                            ? 'bg-amber-500/10 border border-amber-500/30'
                            : 'bg-[#4C7F6E]/20 border border-[#4C7F6E]/30'
                        }`}>
                          <div className="flex items-center gap-2">
                            <Clock className={`w-4 h-4 ${walletCredentialsTimer <= 10 ? 'text-amber-500' : 'text-[#4C7F6E]'}`} />
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${
                              walletCredentialsTimer <= 10 ? 'text-amber-500' : 'text-[#4C7F6E]'
                            }`}>
                              Автоскрытие через:
                            </span>
                          </div>
                          <span className={`text-lg font-black tabular-nums ${
                            walletCredentialsTimer <= 10 ? 'text-amber-500' : 'text-[#4C7F6E]'
                          }`}>
                            {walletCredentialsTimer}с
                          </span>
                        </div>
                      )}

                      {/* Комментарий */}
                      {wallet.comment && (
                        <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Описание</label>
                          <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            {wallet.comment}
                          </p>
                        </div>
                      )}

                      {/* Seed Phrase */}
                      {wallet.seedPhrase && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Seed Phrase</label>
                            <button
                              onClick={() => copyToClipboard(wallet.seedPhrase || '', `seed-${wallet.id}`)}
                              className={`text-[10px] font-bold px-2 py-1 rounded-lg transition-all ${
                                copiedField === `seed-${wallet.id}`
                                  ? 'bg-emerald-500 text-white'
                                  : 'text-[#4C7F6E] hover:bg-[#4C7F6E]/10'
                              }`}
                            >
                              {copiedField === `seed-${wallet.id}` ? 'Скопировано!' : 'Копировать фразу'}
                            </button>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            {wallet.seedPhrase.split(/\s+/).map((word, idx) => (
                              <div key={idx} className={`px-2.5 py-2 rounded-xl border flex items-center gap-2 transition-all hover:scale-105 ${
                                theme === 'dark' ? 'bg-black/20 border-white/5' : 'bg-white border-gray-200'
                              }`}>
                                <span className="text-[8px] font-black text-[#4C7F6E] opacity-50">{idx + 1}</span>
                                <span className={`text-[11px] font-mono font-bold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>{word}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Private Key */}
                      {wallet.privateKey && (
                        <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Private Key</label>
                          <div className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                            theme === 'dark' ? 'bg-black/20 border-white/5' : 'bg-white border-gray-200'
                          }`}>
                            <code className="text-[10px] font-mono break-all text-[#4C7F6E] font-bold">
                              {wallet.privateKey}
                            </code>
                            <button
                              onClick={() => copyToClipboard(wallet.privateKey || '', `pk-${wallet.id}`)}
                              className={`p-2 rounded-lg shrink-0 transition-all hover:scale-110 ${
                                copiedField === `pk-${wallet.id}`
                                  ? 'bg-emerald-500 text-white'
                                  : theme === 'dark' ? 'bg-[#4C7F6E]/20 text-[#4C7F6E]' : 'bg-[#4C7F6E]/10 text-[#4C7F6E]'
                              }`}
                            >
                              {copiedField === `pk-${wallet.id}` ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Wallets AW Section - TRC-20 and TON */}
        </div>
        <div className={`relative overflow-hidden rounded-3xl border transition-all duration-500 ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-[#1a1a1a] to-[#141414] border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
            : 'bg-white border-gray-100 shadow-[0_8px_32px_rgba(76,127,110,0.08)]'
        }`}>
          {/* Decorative Background Elements */}
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-[#4C7F6E]/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl" />

          {/* Shield Decor */}
          <div className="absolute top-0 right-0 opacity-5">
            <Shield className="w-40 h-40 -rotate-12 translate-x-10 -translate-y-10" />
          </div>

          <div className="relative z-10 p-4 md:p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3.5">
                <div className={`relative p-3 rounded-2xl ${
                  theme === 'dark'
                    ? 'bg-gradient-to-br from-[#4C7F6E]/30 to-[#4C7F6E]/10'
                    : 'bg-gradient-to-br from-[#4C7F6E]/20 to-[#4C7F6E]/5'
                }`}>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#4C7F6E]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Coins className="w-6 h-6 text-[#4C7F6E]" />
                  {/* Glow effect */}
                  <div className="absolute -inset-1 bg-[#4C7F6E]/20 rounded-2xl blur-lg -z-10" />
                </div>
                <div>
                  <h2 className={`text-lg font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Кошельки для выплат
                  </h2>
                  <p className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                    Antarctic Wallet — TRC-20 и TON
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
                awWallets.trc20 && awWallets.ton
                  ? 'bg-emerald-500/10 border border-emerald-500/20'
                  : theme === 'dark'
                    ? 'bg-white/5 border border-white/10'
                    : 'bg-gray-100 border border-gray-200'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  awWallets.trc20 && awWallets.ton ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'
                }`} />
                <span className={`text-[10px] font-bold ${
                  awWallets.trc20 && awWallets.ton
                    ? 'text-emerald-500'
                    : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {awWallets.trc20 && awWallets.ton ? 'Добавлено' : 'Настройка'}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className={`mb-6 p-4 rounded-2xl ${
              theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'
            }`}>
              <p className={`text-sm leading-relaxed ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Укажите кошельки для получения выплат. Поддерживаются две сети — <span className="font-bold text-[#4C7F6E]">TRC-20 (TRON)</span> и <span className="font-bold text-[#4C7F6E]">TON</span>. Убедитесь, что кошельки принадлежат сервису Antarctic Wallet.
              </p>
            </div>

            {/* Networks List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* TRC-20 */}
              <div className={`relative rounded-2xl border transition-all duration-300 overflow-hidden group ${
                theme === 'dark'
                  ? 'bg-[#121620] border-[#4C7F6E]/20 hover:border-[#4C7F6E]/40'
                  : 'bg-gray-50 border-gray-200 hover:border-[#4C7F6E]/30'
              }`}>
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#4C7F6E]/10 to-transparent rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity" />

                <div className="p-4 md:p-5 relative z-10">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        theme === 'dark' ? 'bg-[#4C7F6E]/20' : 'bg-[#4C7F6E]/10'
                      }`}>
                        <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#4C7F6E]" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                        </svg>
                      </div>
                      <div>
                        <h3 className={`text-base font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>TRC-20</h3>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Сеть TRON • USDT</p>
                      </div>
                    </div>

                    {/* Status Indicator */}
                    {awWallets.trc20 && (
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10">
                        <Check className="w-3 h-3 text-emerald-500" />
                        <span className="text-[9px] font-bold text-emerald-500">Настроен</span>
                      </div>
                    )}
                  </div>

                  {/* Wallet Display or Input */}
                  {awEditMode.trc20 ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={awTempWallet}
                        onChange={(e) => setAwTempWallet(e.target.value)}
                        placeholder="Введите адрес кошелька TRC-20"
                        className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 ${
                          theme === 'dark'
                            ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#4C7F6E]'
                            : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E]'
                        }`}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && awTempWallet.trim()) {
                            saveAwWallet('trc20', awTempWallet.trim())
                          }
                        }}
                      />
                      <button
                        onClick={() => awTempWallet.trim() && saveAwWallet('trc20', awTempWallet.trim())}
                        disabled={awWalletSaving || !awTempWallet.trim()}
                        className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#4C7F6E] to-[#3d6b5a] hover:from-[#3d6b5a] hover:to-[#2d5b4a] text-white font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#4C7F6E]/20 hover:shadow-[#4C7F6E]/30"
                      >
                        {awWalletSaving ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Сохранить кошелёк</span>
                          </>
                        )}
                      </button>
                    </div>
                  ) : awWallets.trc20 ? (
                    <div className={`flex items-center gap-3 p-3 rounded-xl border ${
                      theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
                    }`}>
                      <code className={`flex-1 text-xs font-mono truncate ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {awWallets.trc20}
                      </code>
                      <button
                        onClick={() => copyAwWallet(awWallets.trc20, 'trc20')}
                        className={`p-2 rounded-lg transition-all shrink-0 hover:scale-110 ${
                          awCopiedField === 'trc20'
                            ? 'bg-emerald-500 text-white'
                            : theme === 'dark'
                              ? 'hover:bg-white/10 text-gray-400 hover:text-white'
                              : 'hover:bg-gray-200 text-gray-500 hover:text-gray-900'
                        }`}
                        title="Копировать"
                      >
                        {awCopiedField === 'trc20' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => {
                          setAwTempWallet(awWallets.trc20)
                          setAwEditMode(prev => ({ ...prev, trc20: true }))
                        }}
                        className={`p-2 rounded-lg transition-all shrink-0 hover:scale-110 ${
                          theme === 'dark'
                            ? 'hover:bg-white/10 text-gray-400 hover:text-white'
                            : 'hover:bg-gray-200 text-gray-500 hover:text-gray-900'
                        }`}
                        title="Изменить"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className={`text-center py-6 rounded-xl border-2 border-dashed ${
                      theme === 'dark'
                        ? 'border-[#4C7F6E]/20 text-gray-500'
                        : 'border-gray-200 text-gray-400'
                    }`}>
                      <Wallet className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm font-medium">Кошелек не добавлен</p>
                      <p className="text-xs mt-1 opacity-70">Нажмите кнопку ниже для добавления</p>
                      <button
                        onClick={() => {
                          setAwTempWallet(awWallets.trc20)
                          setAwEditMode(prev => ({ ...prev, trc20: true }))
                        }}
                        className="mt-3 px-4 py-2 rounded-xl bg-[#4C7F6E]/10 hover:bg-[#4C7F6E]/20 text-[#4C7F6E] font-bold text-xs transition-all flex items-center gap-2 mx-auto"
                      >
                        <Plus className="w-4 h-4" />
                        Добавить кошелёк
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* TON */}
              <div className={`relative rounded-2xl border transition-all duration-300 overflow-hidden group ${
                theme === 'dark'
                  ? 'bg-[#121620] border-[#4C7F6E]/20 hover:border-[#4C7F6E]/40'
                  : 'bg-gray-50 border-gray-200 hover:border-[#4C7F6E]/30'
              }`}>
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#4C7F6E]/10 to-transparent rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity" />

                <div className="p-4 md:p-5 relative z-10">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        theme === 'dark' ? 'bg-[#4C7F6E]/20' : 'bg-[#4C7F6E]/10'
                      }`}>
                        <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#4C7F6E]" fill="currentColor">
                          <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.18l6.9 3.45L12 11.09 5.1 7.63 12 4.18zM4 8.82l7 3.5v7.36l-7-3.5V8.82zm9 10.86v-7.36l7-3.5v7.36l-7 3.5z"/>
                        </svg>
                      </div>
                      <div>
                        <h3 className={`text-base font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>TON</h3>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Сеть TON • USDT</p>
                      </div>
                    </div>

                    {/* Status Indicator */}
                    {awWallets.ton && (
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10">
                        <Check className="w-3 h-3 text-emerald-500" />
                        <span className="text-[9px] font-bold text-emerald-500">Настроен</span>
                      </div>
                    )}
                  </div>

                  {/* Wallet Display or Input */}
                  {awEditMode.ton ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={awTempWallet}
                        onChange={(e) => setAwTempWallet(e.target.value)}
                        placeholder="Введите адрес кошелька TON"
                        className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 ${
                          theme === 'dark'
                            ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#4C7F6E]'
                            : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E]'
                        }`}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && awTempWallet.trim()) {
                            saveAwWallet('ton', awTempWallet.trim())
                          }
                        }}
                      />
                      <button
                        onClick={() => awTempWallet.trim() && saveAwWallet('ton', awTempWallet.trim())}
                        disabled={awWalletSaving || !awTempWallet.trim()}
                        className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#4C7F6E] to-[#3d6b5a] hover:from-[#3d6b5a] hover:to-[#2d5b4a] text-white font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#4C7F6E]/20 hover:shadow-[#4C7F6E]/30"
                      >
                        {awWalletSaving ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Сохранить кошелёк</span>
                          </>
                        )}
                      </button>
                    </div>
                  ) : awWallets.ton ? (
                    <div className={`flex items-center gap-3 p-3 rounded-xl border ${
                      theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
                    }`}>
                      <code className={`flex-1 text-xs font-mono truncate ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {awWallets.ton}
                      </code>
                      <button
                        onClick={() => copyAwWallet(awWallets.ton, 'ton')}
                        className={`p-2 rounded-lg transition-all shrink-0 hover:scale-110 ${
                          awCopiedField === 'ton'
                            ? 'bg-emerald-500 text-white'
                            : theme === 'dark'
                              ? 'hover:bg-white/10 text-gray-400 hover:text-white'
                              : 'hover:bg-gray-200 text-gray-500 hover:text-gray-900'
                        }`}
                        title="Копировать"
                      >
                        {awCopiedField === 'ton' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => {
                          setAwTempWallet(awWallets.ton)
                          setAwEditMode(prev => ({ ...prev, ton: true }))
                        }}
                        className={`p-2 rounded-lg transition-all shrink-0 hover:scale-110 ${
                          theme === 'dark'
                            ? 'hover:bg-white/10 text-gray-400 hover:text-white'
                            : 'hover:bg-gray-200 text-gray-500 hover:text-gray-900'
                        }`}
                        title="Изменить"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className={`text-center py-6 rounded-xl border-2 border-dashed ${
                      theme === 'dark'
                        ? 'border-[#4C7F6E]/20 text-gray-500'
                        : 'border-gray-200 text-gray-400'
                    }`}>
                      <Wallet className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm font-medium">Кошелек не добавлен</p>
                      <p className="text-xs mt-1 opacity-70">Нажмите кнопку ниже для добавления</p>
                      <button
                        onClick={() => {
                          setAwTempWallet(awWallets.ton)
                          setAwEditMode(prev => ({ ...prev, ton: true }))
                        }}
                        className="mt-3 px-4 py-2 rounded-xl bg-[#4C7F6E]/10 hover:bg-[#4C7F6E]/20 text-[#4C7F6E] font-bold text-xs transition-all flex items-center gap-2 mx-auto"
                      >
                        <Plus className="w-4 h-4" />
                        Добавить кошелёк
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {loading ? (
        <div className={`rounded-xl p-8 text-center ${theme === 'dark' ? 'bg-white/5 text-white' : 'bg-white text-gray-800'} shadow`}>Загрузка...</div>
      ) : (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
            {/* Rating Card */}
            {rating && ratingBreakdown && (
              <div className={`relative overflow-hidden rounded-3xl border transition-all duration-500 ${
                theme === 'dark'
                  ? 'bg-gradient-to-br from-[#1a1a1a] to-[#141414] border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
                  : 'bg-white border-gray-100 shadow-[0_8px_32px_rgba(76,127,110,0.08)]'
              }`}>
                {/* Decorative Background Elements */}
                <div className="absolute -top-20 -right-20 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-indigo-500/3 rounded-full blur-2xl" />

                {/* TrendingUp Decor */}
                <div className="absolute top-0 right-0 opacity-[0.03]">
                  <TrendingUp className="w-40 h-40 -rotate-12 translate-x-10 -translate-y-10" />
                </div>

                <div className="relative z-10 p-4 md:p-6">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3.5">
                      <div className={`relative p-3 rounded-2xl ${
                        theme === 'dark'
                          ? 'bg-white/5'
                          : 'bg-gray-100'
                      }`}>
                        <TrendingUp className="w-6 h-6 text-purple-500" />
                      </div>
                      <div>
                        <h2 className={`text-lg font-bold ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          Рейтинг
                        </h2>
                        <p className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                          Детальная оценка
                        </p>
                      </div>
                    </div>

                    {/* Rating Badge */}
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
                      rating.rating >= 50
                        ? 'bg-emerald-500/10 border border-emerald-500/20'
                        : 'bg-amber-500/10 border border-amber-500/20'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        rating.rating >= 50 ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                      }`} />
                      <span className={`text-[10px] font-bold ${
                        rating.rating >= 50 ? 'text-emerald-500' : 'text-amber-500'
                      }`}>
                        {rating.rating.toFixed(1)} баллов
                      </span>
                    </div>
                  </div>

                  {/* Main Rating Display */}
                  <div className={`p-5 rounded-2xl border mb-6 ${
                    theme === 'dark'
                      ? 'bg-[#121620] border-white/5'
                      : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-end justify-between">
                      <div>
                        <div className={`text-5xl font-black ${
                          rating.rating >= 80 ? 'text-emerald-500' : rating.rating >= 50 ? 'text-purple-400' : 'text-amber-500'
                        }`}>
                          {rating.rating.toFixed(1)}
                        </div>
                        <p className={`text-sm font-bold mt-1 ${
                          rating.rating >= 80 ? 'text-emerald-500' : rating.rating >= 50 ? 'text-purple-400' : 'text-amber-500'
                        }`}>
                          {rating.rating >= 80 ? 'Эталон' : rating.rating >= 50 ? 'В команде' : rating.rating >= 30 ? 'Риск исключения' : 'Не в команде'}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={`text-xs font-medium ${
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                        }`}>Минимум</div>
                        <div className={`text-lg font-black ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>50</div>
                      </div>
                    </div>
                    {/* Progress bar to 50 */}
                    <div className="mt-4">
                      <div className="h-2 rounded-full bg-gray-700/30 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            rating.rating >= 80 ? 'bg-emerald-500' : rating.rating >= 50 ? 'bg-purple-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${Math.min((rating.rating / 80) * 100, 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className={`text-[8px] ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>0</span>
                        <span className={`text-[8px] ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>50</span>
                        <span className={`text-[8px] ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>80+</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {[
                      { label: 'Часы', value: `${ratingBreakdown.weeklyHours.toFixed(1)} ч/нед`, pts: ratingBreakdown.weeklyHoursPoints, max: 15, icon: Clock, color: 'blue' },
                      { label: 'Заработок', value: `${Math.round(ratingBreakdown.weeklyEarnings).toLocaleString()} ₽`, pts: ratingBreakdown.weeklyEarningsPoints, max: 30, icon: DollarSign, color: 'emerald' },
                      { label: 'Рефералы', value: `${ratingBreakdown.referrals}`, pts: ratingBreakdown.referralsPoints, max: 20, icon: Users, color: 'purple' },
                      { label: 'Инициативы', value: `${ratingBreakdown.initiatives}`, pts: ratingBreakdown.initiativesPoints, max: 15, icon: Lightbulb, color: 'indigo' },
                      { label: 'Отсутствия', value: `${ratingBreakdown.absenceDays} дн`, pts: ratingBreakdown.absenceDaysPoints, max: 0, icon: AlertTriangle, color: ratingBreakdown.absenceDaysPoints < 0 ? 'red' : 'amber' },
                      { label: 'Прогулы', value: `${ratingBreakdown.truancyDays} дн`, pts: ratingBreakdown.truancyDaysPoints, max: 0, icon: AlertTriangle, color: ratingBreakdown.truancyDaysPoints < 0 ? 'red' : 'green' }
                    ].map(item => {
                      const colorMap: Record<string, string> = {
                        blue: theme === 'dark' ? 'text-blue-400' : 'text-blue-600',
                        emerald: theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600',
                        purple: theme === 'dark' ? 'text-purple-400' : 'text-purple-600',
                        indigo: theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600',
                        red: theme === 'dark' ? 'text-red-400' : 'text-red-600',
                        amber: theme === 'dark' ? 'text-amber-400' : 'text-amber-600',
                        green: theme === 'dark' ? 'text-green-400' : 'text-green-600',
                      }
                      const bgMap: Record<string, string> = {
                        blue: theme === 'dark' ? 'bg-blue-500/5 border-blue-500/10' : 'bg-blue-50 border-blue-100',
                        emerald: theme === 'dark' ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-emerald-50 border-emerald-100',
                        purple: theme === 'dark' ? 'bg-purple-500/5 border-purple-500/10' : 'bg-purple-50 border-purple-100',
                        indigo: theme === 'dark' ? 'bg-indigo-500/5 border-indigo-500/10' : 'bg-indigo-50 border-indigo-100',
                        red: theme === 'dark' ? 'bg-red-500/5 border-red-500/10' : 'bg-red-50 border-red-100',
                        amber: theme === 'dark' ? 'bg-amber-500/5 border-amber-500/10' : 'bg-amber-50 border-amber-100',
                        green: theme === 'dark' ? 'bg-green-500/5 border-green-500/10' : 'bg-green-50 border-green-100',
                      }
                      return (
                        <div key={item.label} className={`p-3 rounded-xl border transition-all duration-300 hover:scale-[1.02] ${bgMap[item.color]}`}>
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-1.5">
                              <item.icon className={`w-3.5 h-3.5 ${colorMap[item.color]}`} />
                              <div className={`text-[8px] font-black uppercase tracking-widest ${colorMap[item.color]}`}>{item.label}</div>
                            </div>
                            {item.max > 0 && (
                              <div className={`text-[8px] font-black ${
                                item.pts > 0 ? 'text-emerald-500' : 'text-gray-500'
                              }`}>
                                {item.pts > 0 ? '+' : ''}{item.pts}/{item.max}
                              </div>
                            )}
                          </div>
                          <div className={`text-sm font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{item.value}</div>
                          {item.max > 0 && (
                            <div className={`w-full mt-2 h-1.5 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                              <div
                                className={`h-full transition-all duration-300 ${item.pts > 0 ? 'bg-emerald-500' : 'bg-gray-500'}`}
                                style={{ width: `${Math.min(Math.max((item.pts / item.max) * 100, 0), 100)}%` }}
                              />
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* Info Box */}
                  <div className={`p-4 rounded-xl border ${
                    theme === 'dark'
                      ? 'border-white/10 bg-white/5'
                      : 'border-gray-200 bg-gray-50'
                  }`}>
                    <h3 className={`text-sm font-bold ${headingColor} mb-2 flex items-center gap-2`}>
                      <Info className="w-4 h-4" />
                      Как считается рейтинг
                    </h3>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      6 параметров: часы работы (неделя), заработок (неделя), рефералы (месяц), инициативы (месяц), отсутствия (месяц), прогулы (месяц). Максимум баллов не ограничен. Минимум 50 баллов для нахождения в команде.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Earnings Card */}
            {earningsSummary && (
              <div className={`relative overflow-hidden rounded-3xl border transition-all duration-500 ${
                theme === 'dark'
                  ? 'bg-gradient-to-br from-[#1a1a1a] to-[#141414] border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
                  : 'bg-white border-gray-100 shadow-[0_8px_32px_rgba(76,127,110,0.08)]'
              }`}>
                {/* Decorative Background Elements */}
                <div className="absolute -top-20 -right-20 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-gray-500/3 rounded-full blur-2xl" />

                {/* Dollar Sign Decor */}
                <div className="absolute top-0 right-0 opacity-[0.03]">
                  <DollarSign className="w-40 h-40 -rotate-12 translate-x-10 -translate-y-10" />
                </div>

                <div className="relative z-10 p-4 md:p-6">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3.5">
                      <div className={`relative p-3 rounded-2xl ${
                        theme === 'dark'
                          ? 'bg-white/5'
                          : 'bg-gray-100'
                      }`}>
                        <DollarSign className="w-6 h-6 text-emerald-500" />
                      </div>
                      <div>
                        <h2 className={`text-lg font-bold ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          Мой заработок
                        </h2>
                        <p className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                          Суммы с учётом долей
                        </p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
                      weeklyStatusClass
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        weeklyStatusText.includes('Активна') ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'
                      }`} />
                      <span className="text-[10px] font-bold">{weeklyStatusText}</span>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    {[
                      { label: 'Всего заработано', value: earningsSummary.total, icon: TrendingUp, color: 'emerald' },
                      { label: 'Отправлено в пул', value: earningsSummary.pool, icon: PiggyBank, color: 'slate' },
                      { label: 'Чистыми', value: earningsSummary.net, icon: Wallet, color: 'slate' },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className={`relative p-4 rounded-2xl border transition-all duration-300 group hover:scale-[1.02] ${
                          theme === 'dark'
                            ? 'bg-[#121620] border-white/5 hover:border-white/10'
                            : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className={`absolute top-0 right-0 w-16 h-16 rounded-full blur-xl opacity-10 transition-opacity group-hover:opacity-20 ${
                          item.color === 'emerald' ? 'bg-emerald-500' : 'bg-gray-400'
                        }`} />
                        <div className="relative z-10">
                          <div className={`flex items-center gap-2 mb-2 ${
                            item.color === 'emerald' ? 'text-emerald-500' : 'text-gray-400'
                          }`}>
                            <item.icon className="w-3.5 h-3.5" />
                            <p className="text-[9px] font-black uppercase tracking-widest">{item.label}</p>
                          </div>
                          <p className={`text-2xl font-black ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            {Math.round(item.value).toLocaleString('ru-RU')} <span className="text-sm font-bold text-gray-400">₽</span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Active Week Section */}
                  <div className={`relative p-5 rounded-2xl border transition-all duration-300 ${
                    theme === 'dark'
                      ? 'bg-white/[0.02] border-white/5'
                      : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="absolute -top-10 -right-10 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl" />

                    <div className="relative z-10 flex flex-col gap-4">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            weeklyStatusText.includes('Активна') ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'
                          }`} />
                          <div>
                            <p className={`text-sm font-black uppercase tracking-wider ${
                              theme === 'dark' ? 'text-emerald-400' : 'text-emerald-700'
                            }`}>Активная неделя</p>
                            <p className={`text-[10px] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                              День вывода — понедельник
                            </p>
                          </div>
                        </div>
                        <span className={`text-[9px] font-black tracking-widest px-3 py-1 rounded-full border text-center ${
                          weeklyStatusClass
                        }`}>
                          {weeklyStatusBadge}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                          { label: 'Заработано', value: earningsSummary.weekly.gross },
                          { label: 'В пул', value: earningsSummary.weekly.pool },
                          { label: 'Чистыми', value: earningsSummary.weekly.net },
                        ].map((item) => (
                          <div
                            key={item.label}
                            className={`p-3 rounded-xl border transition-all duration-300 hover:scale-[1.02] ${
                              theme === 'dark'
                                ? 'bg-[#151a21] border-white/5'
                                : 'bg-white border-gray-200'
                            }`}
                          >
                            <p className={`text-[8px] font-black uppercase tracking-widest mb-1 text-gray-500`}>{item.label}</p>
                            <p className={`text-lg font-black ${
                              theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>
                              {Math.round(item.value).toLocaleString('ru-RU')} <span className="text-xs font-bold text-gray-400">₽</span>
                            </p>
                          </div>
                        ))}
                      </div>

                      {earningsSummary.weekly.net < 10000 && (
                        <div className={`flex items-center gap-2 p-3 rounded-xl border ${
                          theme === 'dark'
                            ? 'bg-amber-500/10 border-amber-500/20'
                            : 'bg-amber-50 border-amber-200'
                        }`}>
                          <AlertTriangle className={`w-4 h-4 ${
                            theme === 'dark' ? 'text-amber-500' : 'text-amber-600'
                          }`} />
                          <p className={`text-[10px] font-medium ${
                            theme === 'dark' ? 'text-amber-400' : 'text-amber-700'
                          }`}>
                            Менее 10 000 ₽ чистыми — вывод недоступен, сумма переносится.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Code Verification Modal for Profile */}
      {showCodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleCloseCodeModal}
          />
          <div className={`relative w-full max-w-md p-6 rounded-2xl shadow-2xl ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-[#0b0f17] via-[#0d1320] to-[#0a0f17] border border-white/10'
              : 'bg-white border border-gray-200'
          }`}>
            <div className="text-center mb-6">
              <div className={`w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center ${
                theme === 'dark' ? 'bg-[#4C7F6E]/20' : 'bg-[#4C7F6E]/10'
              }`}>
                <KeyRound className="w-7 h-7 text-[#4C7F6E]" />
              </div>
              <h3 className={`text-xl font-black mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Подтверждение доступа
              </h3>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Введите код авторизации для доступа к профилю
              </p>
            </div>

            <form onSubmit={handleProfileCodeSubmit}>
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={profileCode}
                    onChange={(e) => setProfileCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="00000000"
                    className={`w-full px-5 py-4 text-center text-2xl font-black tracking-[0.3em] rounded-2xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 ${
                      theme === 'dark'
                        ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#4C7F6E]'
                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E]'
                    }`}
                    maxLength={8}
                    autoFocus
                  />
                </div>

                {codeError && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold text-center">
                    {codeError}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-4 px-6 rounded-2xl bg-[#4C7F6E] hover:bg-[#4C7F6E]/90 text-white font-black text-lg transition-all shadow-lg shadow-[#4C7F6E]/20 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Подтвердить
                </button>
              </div>
            </form>

            <div className={`mt-4 text-center text-xs ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            }`}>
              Код из 5-8 цифр, указанный в ваших данных
            </div>
          </div>
        </div>
      )}

      {/* Wallets List Modal */}
      {showWalletsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowWalletsModal(false)}
          />
          <div className={`relative w-full max-w-lg p-6 rounded-2xl shadow-2xl max-h-[80vh] overflow-y-auto ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-[#0b0f17] via-[#0d1320] to-[#0a0f17] border border-[#4C7F6E]/20'
              : 'bg-white border border-[#4C7F6E]/20'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${theme === 'dark' ? 'bg-[#4C7F6E]/20 text-[#4C7F6E]' : 'bg-[#4C7F6E]/10 text-[#4C7F6E]'}`}>
                  <Coins className="w-5 h-5" />
                </div>
                <h3 className={`text-lg font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Твои кошельки
                </h3>
              </div>
              <button
                onClick={() => setShowWalletsModal(false)}
                className={`p-2 rounded-lg transition-all ${theme === 'dark' ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {wallets.length === 0 ? (
              <div className={`text-center py-8 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                <Wallet className={`w-10 h-10 mx-auto mb-3 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
                <p className={`text-sm font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Нет сохранённых кошельков
                </p>
                <p className={`text-xs mb-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                  Нажмите "Добавить кошелёк" для сохранения данных
                </p>
              </div>
            ) : (
              <div className="space-y-3 mb-4">
                {wallets.map((wallet) => (
                  <div
                    key={wallet.id}
                    className={`p-4 rounded-xl border ${theme === 'dark'
                      ? 'bg-white/[0.03] border-white/10'
                      : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-sm font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {wallet.name}
                          </span>
                        </div>
                        <div className={`text-xs font-mono truncate mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {wallet.address}
                        </div>
                        {wallet.comment && (
                          <div className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                            {wallet.comment}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => copyToClipboard(wallet.address, `wallet-modal-${wallet.id}`)}
                          className={`p-2 rounded-lg transition-all ${
                            copiedField === `wallet-modal-${wallet.id}`
                              ? 'bg-emerald-500 text-white'
                              : theme === 'dark'
                                ? 'hover:bg-white/10 text-gray-400 hover:text-white'
                                : 'hover:bg-gray-200 text-gray-500 hover:text-gray-900'
                          }`}
                        >
                          {copiedField === `wallet-modal-${wallet.id}` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => {
                            setShowWalletsModal(false)
                            openEditWalletModal(wallet)
                          }}
                          className={`p-2 rounded-lg transition-all ${
                            theme === 'dark'
                              ? 'hover:bg-white/10 text-gray-400 hover:text-white'
                              : 'hover:bg-gray-200 text-gray-500 hover:text-gray-900'
                          }`}
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setShowWalletsModal(false)
                            setWalletToDelete(wallet)
                          }}
                          className={`p-2 rounded-lg transition-all ${
                            theme === 'dark'
                              ? 'hover:bg-red-500/10 text-gray-400 hover:text-red-400'
                              : 'hover:bg-red-50 text-gray-500 hover:text-red-600'
                          }`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => {
                setShowWalletsModal(false)
                setShowAddWalletModal(true)
              }}
              className="w-full py-3 px-4 rounded-xl bg-[#4C7F6E] hover:bg-[#3d6b5a] text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#4C7F6E]/20"
            >
              <Plus className="w-4 h-4" />
              Добавить кошелёк
            </button>
          </div>
        </div>
      )}

      {/* Add/Edit Wallet Modal */}
      {showAddWalletModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeWalletModal}
          />
          <div className={`relative w-full max-w-md p-6 rounded-2xl shadow-2xl ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-[#0b0f17] via-[#0d1320] to-[#0a0f17] border border-[#4C7F6E]/20'
              : 'bg-white border border-[#4C7F6E]/20'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-lg font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {editingWallet ? 'Редактировать кошелёк' : 'Добавить кошелёк'}
              </h3>
              <button
                onClick={closeWalletModal}
                className={`p-2 rounded-lg transition-all ${theme === 'dark' ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`block text-xs font-black uppercase tracking-wider mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Название *
                </label>
                <input
                  type="text"
                  value={walletFormData.name}
                  onChange={(e) => setWalletFormData({ ...walletFormData, name: e.target.value })}
                  placeholder="Основной кошелёк"
                  className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 ${
                    theme === 'dark'
                      ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#4C7F6E]'
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E]'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-black uppercase tracking-wider mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Адрес кошелька *
                </label>
                <input
                  type="text"
                  value={walletFormData.address}
                  onChange={(e) => setWalletFormData({ ...walletFormData, address: e.target.value })}
                  placeholder="0x..."
                  className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 ${
                    theme === 'dark'
                      ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#4C7F6E]'
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E]'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-black uppercase tracking-wider mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Приватный ключ
                </label>
                <input
                  type="password"
                  value={walletFormData.privateKey}
                  onChange={(e) => setWalletFormData({ ...walletFormData, privateKey: e.target.value })}
                  placeholder="Введите приватный ключ"
                  className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 ${
                    theme === 'dark'
                      ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#4C7F6E]'
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E]'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-black uppercase tracking-wider mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Seed фраза
                </label>
                <textarea
                  value={walletFormData.seedPhrase}
                  onChange={(e) => setWalletFormData({ ...walletFormData, seedPhrase: e.target.value })}
                  placeholder="Введите seed фразу (12-24 слова)"
                  rows={2}
                  className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 resize-none ${
                    theme === 'dark'
                      ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#4C7F6E]'
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E]'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-black uppercase tracking-wider mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Комментарий
                </label>
                <input
                  type="text"
                  value={walletFormData.comment}
                  onChange={(e) => setWalletFormData({ ...walletFormData, comment: e.target.value })}
                  placeholder="Заметка о кошельке"
                  className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 ${
                    theme === 'dark'
                      ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#4C7F6E]'
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E]'
                  }`}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeWalletModal}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all ${
                    theme === 'dark'
                      ? 'bg-white/10 hover:bg-white/20 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }`}
                >
                  Отмена
                </button>
                <button
                  type="button"
                  onClick={editingWallet ? handleEditWallet : handleAddWallet}
                  disabled={walletSaving || !walletFormData.name || !walletFormData.address}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#4C7F6E] hover:bg-[#3d6b5a] text-white font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#4C7F6E]/20"
                >
                  {walletSaving ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>{editingWallet ? 'Сохранить' : 'Добавить'}</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

{/* Set PIN Modal */}
      {showSetPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleCloseSetPinModal}
          />
          <div className={`relative w-full max-w-md p-6 rounded-2xl shadow-2xl ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-[#0b0f17] via-[#0d1320] to-[#0a0f17] border border-[#4C7F6E]/20'
              : 'bg-white border border-[#4C7F6E]/20'
          }`}>
            <div className="text-center mb-6">
              <div className={`w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center ${
                theme === 'dark' ? 'bg-[#4C7F6E]/20' : 'bg-[#4C7F6E]/10'
              }`}>
                <KeyRound className="w-7 h-7 text-[#4C7F6E]" />
              </div>
              <h3 className={`text-xl font-black mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {pinCodeStep === 'confirm' ? 'Подтвердите пинкод' : 'Создайте пинкод'}
              </h3>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {pinCodeStep === 'confirm'
                  ? 'Введите пинкод ещё раз для подтверждения'
                  : 'Минимум 8 символов, цифра и спецсимвол'}
              </p>
            </div>

            <div className="space-y-4">
              {pinCodeStep === 'first' ? (
                <div className="relative">
                  <input
                    type={showPinCode ? 'text' : 'password'}
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    placeholder="Введите пинкод"
                    className={`w-full px-5 py-4 rounded-2xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 ${
                      theme === 'dark'
                        ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#4C7F6E]'
                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPinCode(!showPinCode)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPinCode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <input
                    type={showConfirmPinCode ? 'text' : 'password'}
                    value={confirmPinCode}
                    onChange={(e) => setConfirmPinCode(e.target.value)}
                    placeholder="Подтвердите пинкод"
                    className={`w-full px-5 py-4 rounded-2xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 ${
                      theme === 'dark'
                        ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#4C7F6E]'
                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPinCode(!showConfirmPinCode)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPinCode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              )}

              {pinCodeError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold text-center">
                  {pinCodeError}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCloseSetPinModal}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all ${
                    theme === 'dark'
                      ? 'bg-white/10 hover:bg-white/20 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }`}
                >
                  Отмена
                </button>
                <button
                  type="button"
                  onClick={pinCodeStep === 'first' ? handleSetPinSubmit : handleConfirmPinSubmit}
                  disabled={pinCodeLoading || (pinCodeStep === 'first' ? !pinCode : !confirmPinCode)}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#4C7F6E] hover:bg-[#3d6b5a] text-white font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#4C7F6E]/20"
                >
                  {pinCodeLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>{pinCodeStep === 'first' ? 'Далее' : 'Подтвердить'}</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Unlock PIN Modal */}
      {showUnlockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleCloseUnlockModal}
          />
          <div className={`relative w-full max-w-md p-6 rounded-2xl shadow-2xl ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-[#0b0f17] via-[#0d1320] to-[#0a0f17] border border-[#4C7F6E]/20'
              : 'bg-white border border-[#4C7F6E]/20'
          }`}>
            <div className="text-center mb-6">
              <div className={`w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center ${
                theme === 'dark' ? 'bg-[#4C7F6E]/20' : 'bg-[#4C7F6E]/10'
              }`}>
                <Lock className="w-7 h-7 text-[#4C7F6E]" />
              </div>
              <h3 className={`text-xl font-black mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Введите пинкод
              </h3>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Введите пинкод для разблокировки кошельков
              </p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <input
                  type={showPinCode ? 'text' : 'password'}
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  placeholder="Введите пинкод"
                  className={`w-full px-5 py-4 rounded-2xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 ${
                    theme === 'dark'
                      ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#4C7F6E]'
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E]'
                  }`}
                  onKeyDown={(e) => e.key === 'Enter' && handleUnlockSubmit()}
                />
                <button
                  type="button"
                  onClick={() => setShowPinCode(!showPinCode)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPinCode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {pinCodeError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold text-center">
                  {pinCodeError}
                </div>
              )}

              {/* Biometric Unlock Option */}
              {biometricRegistered && (
                <div className="flex items-center gap-2">
                  <div className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    theme === 'dark'
                      ? 'border-[#4C7F6E]/30 hover:border-[#4C7F6E]/50 bg-[#4C7F6E]/10 text-white'
                      : 'border-[#4C7F6E]/30 hover:border-[#4C7F6E]/50 bg-[#4C7F6E]/10 text-[#4C7F6E]'
                  }`}
                  onClick={handleUnlockWalletsBiometric}
                  >
                    <Fingerprint className={`w-5 h-5 ${pinCodeLoading ? 'animate-pulse' : ''}`} />
                    <span className="text-sm font-bold">
                      {pinCodeLoading ? 'Проверка...' : 'Разблокировать биометрией'}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCloseUnlockModal}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all ${
                    theme === 'dark'
                      ? 'bg-white/10 hover:bg-white/20 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }`}
                >
                  Отмена
                </button>
                <button
                  type="button"
                  onClick={handleUnlockSubmit}
                  disabled={pinCodeLoading || !pinCode}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#4C7F6E] hover:bg-[#3d6b5a] text-white font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#4C7F6E]/20"
                >
                  {pinCodeLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : 'Разблокировать'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Change PIN Modal */}
      {showChangePinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleCloseChangePinModal}
          />
          <div className={`relative w-full max-w-md p-6 rounded-2xl shadow-2xl ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-[#0b0f17] via-[#0d1320] to-[#0a0f17] border border-[#4C7F6E]/20'
              : 'bg-white border border-[#4C7F6E]/20'
          }`}>
            <div className="text-center mb-6">
              <div className={`w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center ${
                theme === 'dark' ? 'bg-[#4C7F6E]/20' : 'bg-[#4C7F6E]/10'
              }`}>
                <RefreshCw className="w-7 h-7 text-[#4C7F6E]" />
              </div>
              <h3 className={`text-xl font-black mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {changePinStep === 'verify' ? 'Смена пинкода' : changePinStep === 'new' ? 'Новый пинкод' : 'Подтверждение'}
              </h3>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {changePinStep === 'verify'
                  ? `Осталось смен: ${pinChangeInfo.remainingChanges}/3 в этом месяце`
                  : changePinStep === 'new'
                    ? 'Минимум 8 символов, цифра и спецсимвол'
                    : 'Введите новый пинкод ещё раз'}
              </p>
            </div>

            <div className="space-y-4">
              {changePinStep === 'verify' ? (
                <>
                  <div className="relative">
                    <input
                      type={showPinCode ? 'text' : 'password'}
                      value={oldPinCode}
                      onChange={(e) => setOldPinCode(e.target.value)}
                      placeholder="Текущий пинкод"
                      className={`w-full px-5 py-4 rounded-2xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 ${
                        theme === 'dark'
                          ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#4C7F6E]'
                          : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E]'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPinCode(!showPinCode)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPinCode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={changePinAuthCode}
                    onChange={(e) => setChangePinAuthCode(e.target.value)}
                    placeholder="Код авторизации"
                    className={`w-full px-5 py-4 rounded-2xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 ${
                      theme === 'dark'
                        ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#4C7F6E]'
                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E]'
                    }`}
                  />
                </>
              ) : changePinStep === 'new' ? (
                <div className="relative">
                  <input
                    type={showPinCode ? 'text' : 'password'}
                    value={newPinCode}
                    onChange={(e) => setNewPinCode(e.target.value)}
                    placeholder="Новый пинкод"
                    className={`w-full px-5 py-4 rounded-2xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 ${
                      theme === 'dark'
                        ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#4C7F6E]'
                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPinCode(!showPinCode)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPinCode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <input
                    type={showConfirmPinCode ? 'text' : 'password'}
                    value={confirmNewPinCode}
                    onChange={(e) => setConfirmNewPinCode(e.target.value)}
                    placeholder="Подтвердите новый пинкод"
                    className={`w-full px-5 py-4 rounded-2xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 ${
                      theme === 'dark'
                        ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#4C7F6E]'
                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPinCode(!showConfirmPinCode)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPinCode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              )}

              {pinCodeError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold text-center">
                  {pinCodeError}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCloseChangePinModal}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all ${
                    theme === 'dark'
                      ? 'bg-white/10 hover:bg-white/20 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }`}
                >
                  Отмена
                </button>
                <button
                  type="button"
                  onClick={
                    changePinStep === 'verify'
                      ? handleChangePinVerify
                      : changePinStep === 'new'
                        ? handleChangePinNew
                        : handleChangePinConfirm
                  }
                  disabled={pinCodeLoading}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#4C7F6E] hover:bg-[#3d6b5a] text-white font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#4C7F6E]/20"
                >
                  {pinCodeLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>{changePinStep === 'verify' ? 'Далее' : changePinStep === 'new' ? 'Далее' : 'Сменить'}</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Wallet Details Modal */}
      {viewingWallet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setViewingWallet(null)}
          />
          <div className={`relative w-full max-w-lg p-6 rounded-2xl shadow-2xl max-h-[85vh] overflow-y-auto ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-[#0b0f17] via-[#0d1320] to-[#0a0f17] border border-[#4C7F6E]/30'
              : 'bg-white border border-[#4C7F6E]/20'
          }`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  theme === 'dark' ? 'bg-[#4C7F6E]/20' : 'bg-[#4C7F6E]/10'
                }`}>
                  <Wallet className="w-6 h-6 text-[#4C7F6E]" />
                </div>
                <div>
                  <h3 className={`text-lg font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {viewingWallet.name}
                  </h3>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                    Детали кошелька
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewingWallet(null)}
                className={`p-2 rounded-lg transition-all ${
                  theme === 'dark' ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Decorative gradient */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-bl from-[#4C7F6E]/20 to-transparent rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-4 relative z-10">
              {/* Address */}
              <div className={`p-4 rounded-xl border ${
                theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <label className={`text-[10px] font-black uppercase tracking-widest ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                  }`}>Адрес кошелька</label>
                  <button
                    onClick={() => copyToClipboard(viewingWallet.address, `view-wallet-address`)}
                    className={`p-1.5 rounded-lg transition-all hover:scale-110 ${
                      copiedField === `view-wallet-address`
                        ? 'bg-emerald-500 text-white'
                        : theme === 'dark' ? 'bg-[#4C7F6E]/20 text-[#4C7F6E] hover:bg-[#4C7F6E]/30' : 'bg-[#4C7F6E]/10 text-[#4C7F6E] hover:bg-[#4C7F6E]/20'
                    }`}
                    title="Копировать"
                  >
                    {copiedField === `view-wallet-address` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <code className={`text-xs font-mono break-all flex-1 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {viewingWallet.address}
                  </code>
                </div>
                <a
                  href={`https://solscan.io/address/${viewingWallet.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1.5 mt-2 text-[10px] font-bold transition-all hover:underline ${
                    theme === 'dark' ? 'text-[#4C7F6E]' : 'text-[#4C7F6E]'
                  }`}
                >
                  <ExternalLink className="w-3 h-3" />
                  Открыть в Solscan
                </a>
              </div>

              {/* Comment/Description */}
              {viewingWallet.comment && (
                <div className={`p-4 rounded-xl border ${
                  theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <label className={`text-[10px] font-black uppercase tracking-widest ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                    }`}>Описание</label>
                    <button
                      onClick={() => copyToClipboard(viewingWallet.comment || '', `view-wallet-comment`)}
                      className={`p-1.5 rounded-lg transition-all hover:scale-110 ${
                        copiedField === `view-wallet-comment`
                          ? 'bg-emerald-500 text-white'
                          : theme === 'dark' ? 'bg-[#4C7F6E]/20 text-[#4C7F6E] hover:bg-[#4C7F6E]/30' : 'bg-[#4C7F6E]/10 text-[#4C7F6E] hover:bg-[#4C7F6E]/20'
                      }`}
                      title="Копировать"
                    >
                      {copiedField === `view-wallet-comment` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {viewingWallet.comment}
                  </p>
                </div>
              )}

              {/* Private Key */}
              {viewingWallet.privateKey && (
                <div className={`p-4 rounded-xl border ${
                  theme === 'dark' ? 'bg-gradient-to-r from-amber-500/5 to-transparent border-amber-500/20' : 'bg-gradient-to-r from-amber-50 to-transparent border-amber-200'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <label className={`text-[10px] font-black uppercase tracking-widest ${
                        theme === 'dark' ? 'text-amber-500/80' : 'text-amber-600'
                      }`}>Private Key</label>
                      <span className={`text-[8px] px-1.5 py-0.5 rounded-full ${
                        theme === 'dark' ? 'bg-amber-500/10 text-amber-500' : 'bg-amber-100 text-amber-600'
                      }`}>Секретно</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(viewingWallet.privateKey || '', `view-wallet-pk`)}
                      className={`p-1.5 rounded-lg transition-all hover:scale-110 ${
                        copiedField === `view-wallet-pk`
                          ? 'bg-emerald-500 text-white'
                          : theme === 'dark' ? 'bg-amber-500/20 text-amber-500 hover:bg-amber-500/30' : 'bg-amber-100 text-amber-600 hover:bg-amber-200'
                      }`}
                      title="Копировать"
                    >
                      {copiedField === `view-wallet-pk` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className={`p-3 rounded-lg border ${
                    theme === 'dark' ? 'bg-black/20 border-white/5' : 'bg-white border-gray-200'
                  }`}>
                    <code className={`text-xs font-mono break-all ${
                      theme === 'dark' ? 'text-amber-400' : 'text-amber-700'
                    }`}>
                      {viewingWallet.privateKey}
                    </code>
                  </div>
                </div>
              )}

              {/* Seed Phrase */}
              {viewingWallet.seedPhrase && (
                <div className={`p-4 rounded-xl border ${
                  theme === 'dark' ? 'bg-gradient-to-r from-purple-500/5 to-transparent border-purple-500/20' : 'bg-gradient-to-r from-purple-50 to-transparent border-purple-200'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <label className={`text-[10px] font-black uppercase tracking-widest ${
                        theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                      }`}>Seed Phrase</label>
                      <span className={`text-[8px] px-1.5 py-0.5 rounded-full ${
                        theme === 'dark' ? 'bg-purple-500/10 text-purple-400' : 'bg-purple-100 text-purple-600'
                      }`}>Секретно</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(viewingWallet.seedPhrase || '', `view-wallet-seed`)}
                      className={`p-1.5 rounded-lg transition-all hover:scale-110 ${
                        copiedField === `view-wallet-seed`
                          ? 'bg-emerald-500 text-white'
                          : theme === 'dark' ? 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30' : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                      }`}
                      title="Копировать"
                    >
                      {copiedField === `view-wallet-seed` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {viewingWallet.seedPhrase.split(/\s+/).map((word, idx) => (
                      <div key={idx} className={`px-3 py-2 rounded-xl border flex items-center gap-2 transition-all hover:scale-105 ${
                        theme === 'dark' ? 'bg-black/20 border-white/5' : 'bg-white border-gray-200'
                      }`}>
                        <span className={`text-[8px] font-black ${
                          theme === 'dark' ? 'text-purple-400/50' : 'text-purple-500/50'
                        }`}>{idx + 1}</span>
                        <span className={`text-[11px] font-mono font-bold ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-800'
                        }`}>{word}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Created Date */}
              <div className={`p-3 rounded-xl border ${
                theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center gap-2">
                  <Calendar className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                  <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                    Создан {new Date(viewingWallet.createdAt).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6 pt-4 border-t border-dashed border-gray-700/30">
              <button
                onClick={() => {
                  setViewingWallet(null)
                  openEditWalletModal(viewingWallet)
                }}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                  theme === 'dark'
                    ? 'bg-white/10 hover:bg-white/20 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}
              >
                <Pencil className="w-4 h-4" />
                Редактировать
              </button>
              <button
                onClick={() => {
                  setViewingWallet(null)
                  setWalletToDelete(viewingWallet)
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold text-sm transition-all flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Wallet Confirmation Modal */}
      {walletToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setWalletToDelete(null)}
          />
          <div className={`relative w-full max-w-md p-6 rounded-2xl shadow-2xl ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-[#0b0f17] via-[#0d1320] to-[#0a0f17] border border-red-500/20'
              : 'bg-white border border-red-200'
          }`}>
            <div className="text-center mb-6">
              <div className={`w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center ${
                theme === 'dark' ? 'bg-red-500/20' : 'bg-red-100'
              }`}>
                <Trash2 className="w-7 h-7 text-red-500" />
              </div>
              <h3 className={`text-xl font-black mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Удалить кошелёк?
              </h3>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Кошелёк «{walletToDelete.name}» будет удалён безвозвратно
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setWalletToDelete(null)}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all ${
                  theme === 'dark'
                    ? 'bg-white/10 hover:bg-white/20 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}
              >
                Отмена
              </button>
              <button
                type="button"
                onClick={handleDeleteWallet}
                className="flex-1 py-3 px-4 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-500/20"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[100] animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div className={`px-5 py-4 rounded-2xl shadow-2xl border flex items-center gap-3 min-w-[280px] ${
            toast.type === 'success'
              ? theme === 'dark'
                ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                : 'bg-emerald-50 border-emerald-200 text-emerald-700'
              : toast.type === 'error'
                ? theme === 'dark'
                  ? 'bg-red-500/20 border-red-500/30 text-red-400'
                  : 'bg-red-50 border-red-200 text-red-700'
                : theme === 'dark'
                  ? 'bg-[#4C7F6E]/20 border-[#4C7F6E]/30 text-[#4C7F6E]'
                  : 'bg-[#4C7F6E]/10 border-[#4C7F6E]/20 text-[#4C7F6E]'
          }`}>
            {toast.type === 'success' ? (
              <Check className="w-5 h-5 shrink-0" />
            ) : toast.type === 'error' ? (
              <AlertCircle className="w-5 h-5 shrink-0" />
            ) : (
              <Info className="w-5 h-5 shrink-0" />
            )}
            <p className={`text-sm font-medium whitespace-pre-wrap ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {toast.message}
            </p>
            <button
              onClick={() => setToast(null)}
              className="ml-2 p-1 rounded hover:bg-white/10 shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
