import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore, loginWithBiometric } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'
import {
  Moon,
  Sun,
  Shield,
  User,
  Users,
  Eye,
  EyeOff,
  Lock,
  KeyRound,
  X,
  Fingerprint
} from 'lucide-react'
import logo from '../assets/logo.png'
import { ForgotPasswordModal } from '@/components/Auth/ForgotPasswordModal'
import CustomCursor from '@/components/CustomCursor'
import { PdConsentModal, usePdConsent } from '@/components/PdConsentModal'
import { isWebAuthnSupported, hasRegisteredCredentials, registerBiometric } from '@/utils/webAuthn'

// Declare Telegram WebApp types
declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initData: string
        initDataUnsafe?: {
          user?: {
            id: number
            first_name?: string
            last_name?: string
            username?: string
          }
        }
        ready: () => void
        expand: () => void
      }
    }
  }
}

export const Login = () => {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const { login: loginUser, user, isAuthenticated, verifyAuthCode, clearPendingAuth } = useAuthStore()
  const { theme, toggleTheme } = useThemeStore()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false)

  // PD Consent state
  const { needsConsent, checkConsent, acceptConsent } = usePdConsent()

  // Check consent on mount
  useEffect(() => {
    checkConsent()
  }, [])

  // Code verification state
  const [authCode, setAuthCode] = useState('')
  const [codeError, setCodeError] = useState('')
  const [showCodeModal, setShowCodeModal] = useState(false)

  // Biometric state - hide biometric button until user sets it up manually
  const [biometricAvailable, setBiometricAvailable] = useState(false)
  const [biometricLoading, setBiometricLoading] = useState(false)
  const [biometricError, setBiometricError] = useState('')

  // Biometric setup modal state (shown after successful login)
  const [showBiometricSetupModal, setShowBiometricSetupModal] = useState(false)
  const [biometricSetupLoading, setBiometricSetupLoading] = useState(false)
  const [biometricSetupError, setBiometricSetupError] = useState('')
  const [biometricSetupSuccess, setBiometricSetupSuccess] = useState(false)

  // Check biometric availability on mount
  useEffect(() => {
    const supported = isWebAuthnSupported()
    const hasCreds = hasRegisteredCredentials()
    setBiometricAvailable(supported && hasCreds)
  }, [])

  // Apply theme to body on mount and theme change
  useEffect(() => {
    document.body.classList.toggle('dark', theme === 'dark')
  }, [theme])

  // Load remembered credentials
  useEffect(() => {
    const saved = localStorage.getItem('arca_remembered')
    if (saved) {
      try {
        const { login: l, password: p } = JSON.parse(saved)
        setLogin(l)
        setPassword(p)
        setRememberMe(true)
      } catch (err) {
        console.error('Error loading remembered credentials:', err)
      }
    }
  }, [])

  // Check for Telegram Mini App authentication
  useEffect(() => {
    // Don't redirect if we need to show biometric setup modal
    if (isAuthenticated && user && !showBiometricSetupModal) {
      const isMobile = window.innerWidth < 1024;
      navigate('/profile', { state: { openMenu: isMobile } });
      return
    }

    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready()
      window.Telegram.WebApp.expand()

      const initDataFromUrl = searchParams.get('tgWebAppData')
      const initData = initDataFromUrl || window.Telegram.WebApp.initData
      const loginFromUrl = searchParams.get('login')
      const passwordFromUrl = searchParams.get('password')

      if (loginFromUrl && passwordFromUrl) {
        // Use an async function to handle the login
        const performLogin = async () => {
          const success = await loginUser(loginFromUrl, passwordFromUrl)
          if (success) {
            const isMobile = window.innerWidth < 1024;
            navigate('/profile', { state: { openMenu: isMobile } });
          }
        }
        performLogin()
        return
      }

      if (initData) {
        try {
          const params = new URLSearchParams(initData)
          const userParam = params.get('user')

          if (userParam) {
            const userData = JSON.parse(decodeURIComponent(userParam))
            const telegramUserId = userData.id
            sessionStorage.setItem('telegram_user_id', String(telegramUserId))

            const savedAuth = localStorage.getItem('arca-auth')
            if (savedAuth) {
              try {
                const parsed = JSON.parse(savedAuth)
                if (parsed.state?.user) {
                  const savedUser = parsed.state.user
                  const performSavedLogin = async () => {
                    const success = await loginUser(savedUser.login, savedUser.password)
                    if (success) {
                      const isMobile = window.innerWidth < 1024;
                      navigate('/profile', { state: { openMenu: isMobile } });
                    }
                  }
                  performSavedLogin()
                  return
                }
              } catch (err) {
                console.error('Error parsing saved auth:', err)
              }
            }
          }
        } catch (err) {
          console.error('Error parsing Telegram initData:', err)
        }
      }

      const unsafeUser = window.Telegram.WebApp.initDataUnsafe?.user
      if (unsafeUser) {
        sessionStorage.setItem('telegram_user_id', String(unsafeUser.id))
      }
    }
  }, [searchParams, isAuthenticated, user, navigate, loginUser, showBiometricSetupModal])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const result = await loginUser(login || 'any', password || 'any')
    if (result.success) {
      if (result.requiresCode) {
        // Show code verification modal
        setShowCodeModal(true)
        setAuthCode('')
        setCodeError('')
      } else {
        // No code required - complete login
        if (rememberMe) {
          localStorage.setItem('arca_remembered', JSON.stringify({ login, password, type: 'member' }))
        } else {
          localStorage.removeItem('arca_remembered')
        }

      // Go to profile - user can setup biometric in settings later
      const isMobile = window.innerWidth < 1024
      navigate('/profile', { state: { openMenu: isMobile } })
      }
    } else {
      setError('Неверный логин или пароль')
    }
  }

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCodeError('')

    if (!authCode) {
      setCodeError('Пожалуйста, введите код')
      return
    }

    const isValid = await verifyAuthCode(authCode, password)
    if (isValid) {
      setShowCodeModal(false)
      if (rememberMe) {
        localStorage.setItem('arca_remembered', JSON.stringify({ login, password, type: 'member' }))
      } else {
        localStorage.removeItem('arca_remembered')
      }

      // Go to profile - user can setup biometric in settings later
      const isMobile = window.innerWidth < 1024
      navigate('/profile', { state: { openMenu: isMobile } })
    } else {
      setCodeError('Неверный код авторизации')
    }
  }

  const handleCloseCodeModal = () => {
    setShowCodeModal(false)
    setAuthCode('')
    setCodeError('')
    clearPendingAuth()
  }

  // Handle biometric login
  const handleBiometricLogin = async () => {
    setBiometricError('')
    setBiometricLoading(true)

    try {
      const result = await loginWithBiometric()

      if (result.success) {
        const isMobile = window.innerWidth < 1024
        navigate('/profile', { state: { openMenu: isMobile } })
      } else {
        setBiometricError(result.error || 'Ошибка входа')
        // Refresh biometric availability state
        setBiometricAvailable(hasRegisteredCredentials())
      }
    } catch (err) {
      setBiometricError('Ошибка биометрической аутентификации')
    } finally {
      setBiometricLoading(false)
    }
  }

  // Handle biometric setup (register)
  const handleBiometricSetup = async () => {
    const user = useAuthStore.getState().user
    if (!user) return

    setBiometricSetupLoading(true)
    setBiometricSetupError('')

    try {
      const result = await registerBiometric(user.id, user.name || user.login)

      if (result.success) {
        setBiometricSetupSuccess(true)
        setBiometricAvailable(true)
        // Refresh the state after successful registration
        setTimeout(() => {
          const isMobile = window.innerWidth < 1024
          navigate('/profile', { state: { openMenu: isMobile } })
        }, 1500)
      } else {
        setBiometricSetupError(result.error || 'Ошибка привязки')
      }
    } catch (err) {
      setBiometricSetupError('Ошибка привязки биометрии')
    } finally {
      setBiometricSetupLoading(false)
    }
  }

  // Skip biometric setup and proceed to profile
  const skipBiometricSetup = () => {
    setShowBiometricSetupModal(false)
    const isMobile = window.innerWidth < 1024
    navigate('/profile', { state: { openMenu: isMobile } })
  }

  // Close biometric setup modal
  const closeBiometricSetupModal = () => {
    setShowBiometricSetupModal(false)
    setBiometricSetupError('')
    setBiometricSetupSuccess(false)
  }

  return (
    <>
      <CustomCursor />
      <div className={`min-h-screen flex flex-col xl:flex-row ${theme === 'dark' ? 'bg-[#0b0f17]' : 'bg-white'}`}>
        {/* Left Branding Section */}
        <div className="hidden xl:flex flex-1 relative bg-[#0b0f17] items-center justify-center p-12 overflow-hidden">
          {/* Background Gradients */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-24 -left-24 w-[620px] h-[620px] bg-gradient-to-br from-[#4C7F6E]/35 via-emerald-500/22 to-transparent blur-[110px]" />
            <div className="absolute top-[-120px] right-[-180px] w-[780px] h-[780px] bg-gradient-to-bl from-[#4C7F6E]/24 via-emerald-500/22 to-transparent blur-[140px]" />
            <div className="floating-grid opacity-30" />
          </div>

          <div className="relative z-10 flex flex-col items-center text-center max-w-md">
            <div className="w-24 h-24 sm:w-32 sm:h-32 mb-8 flex items-center justify-center animate-pulse-subtle">
              <img
                src={logo}
                alt="ARCA - Team"
                className="w-20 h-20 sm:w-24 sm:h-24 object-contain rounded-xl filter drop-shadow-[0_0_15px_rgba(76,127,110,0.4)]"
              />
            </div>

            <h1 className="text-4xl lg:text-5xl font-black text-white mb-2 tracking-tight">
              Antarctic Alpha Team
            </h1>

            <p className="text-lg text-gray-400 font-medium leading-relaxed">
              Единый контур для управления процессами и командой сообщества <span className="text-[#4C7F6E] font-bold">ARCA - Team</span> 
            </p>

          </div>
        </div>

        {/* Right Form Section */}
        <div className={`flex-1 flex flex-col min-h-screen relative p-6 sm:p-12 lg:p-20 ${theme === 'dark' ? 'bg-[#0b0f17]' : 'bg-white'}`}>
          {/* Mobile Header */}
          <div className="xl:hidden flex items-center justify-between mb-12">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Logo" className="w-10 h-10 object-contain rounded-xl" />
              <span className={`font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>ARCA — Team</span>
            </div>
            <button onClick={toggleTheme} className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-amber-300">
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>

          {/* Desktop Theme Toggle */}
          <div className="hidden xl:flex justify-end absolute top-8 right-8">
            <button
              onClick={toggleTheme}
              className={`p-3 rounded-full shadow-lg transition-all border ${theme === 'dark'
                ? 'bg-white/5 border-white/10 text-amber-300 hover:bg-white/10'
                : 'bg-white border-gray-100 text-gray-700 hover:bg-gray-50'
                }`}
            >
              {theme === 'dark' ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </button>
          </div>

          <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
            <div className="mb-10 text-center">
              <h2 className={`text-3xl font-extrabold mb-3 tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Welcome
              </h2>
              <p className={`text-gray-500 dark:text-gray-400 font-medium`}>
                Введите данные для входа в панель <span className="text-[#4C7F6E] font-bold">ARCA - Team</span>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className={`text-sm font-bold block ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Login / Номер телефона
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#4C7F6E] transition-colors">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    placeholder="Login или номер телефона"
                    className={`w-full pl-12 pr-4 py-4 rounded-2xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 ${theme === 'dark'
                      ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#4C7F6E]'
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E]'
                      }`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className={`text-sm font-bold block ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#4C7F6E] transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full pl-12 pr-12 py-4 rounded-2xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 ${theme === 'dark'
                      ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#4C7F6E]'
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E]'
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#4C7F6E] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded border transition-all flex items-center justify-center ${rememberMe
                      ? 'bg-[#4C7F6E] border-[#4C7F6E]'
                      : 'border-gray-300 dark:border-white/20'
                      }`}>
                      {rememberMe && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
                    </div>
                  </div>
                  <span className={`text-sm font-bold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Запомнить меня</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(true)}
                  className="text-sm font-bold text-[#4C7F6E] hover:text-[#4C7F6E]/80 transition-colors"
                >
                  Напомнить данные
                </button>
              </div>

              {error && (
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold animate-shake">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-4 px-6 rounded-2xl bg-[#4C7F6E] hover:bg-[#4C7F6E]/90 text-white font-black text-lg transition-all shadow-lg shadow-[#4C7F6E]/20 hover:scale-[1.02] active:scale-[0.98]"
              >
                Войти в систему управления
              </button>

              {/* Biometric Login Button */}
              {biometricAvailable && (
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={handleBiometricLogin}
                    disabled={biometricLoading}
                    className="w-full py-3 px-6 rounded-2xl border-2 border-[#4C7F6E] text-[#4C7F6E] font-black text-base transition-all hover:bg-[#4C7F6E]/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {biometricLoading ? (
                      <span>Проверка...</span>
                    ) : (
                      <>
                        <Fingerprint className="w-5 h-5" />
                        <span>Войти по биометрии</span>
                      </>
                    )}
                  </button>
                  {biometricError && (
                    <p className="mt-2 text-center text-red-500 text-sm font-medium">{biometricError}</p>
                  )}
                </div>
              )}
            </form>

            <div className="mt-12 pt-8 border-t border-gray-100 dark:border-white/5">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => navigate('/contact-dm')}
                  className={`flex flex-col items-center justify-center gap-1.5 py-3 px-3 rounded-2xl border transition-all font-bold text-xs ${theme === 'dark'
                    ? 'border-white/10 bg-white/5 text-white hover:bg-white/10'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50 shadow-sm'
                    }`}
                >
                  <Shield className="w-4 h-4 text-[#4C7F6E]" />
                  <span>Помощь</span>
                </button>
                <button
                  onClick={() => navigate('/application')}
                  className={`flex flex-col items-center justify-center gap-1.5 py-3 px-3 rounded-2xl border transition-all font-bold text-xs ${theme === 'dark'
                    ? 'border-white/10 bg-white/5 text-white hover:bg-white/10'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50 shadow-sm'
                    }`}
                >
                  <Users className="w-4 h-4 text-[#4C7F6E]" />
                  <span>Анкета</span>
                </button>
              </div>
            </div>

          </div>
        </div>
        {isForgotModalOpen && (
          <ForgotPasswordModal
            theme={theme as 'dark' | 'light'}
            onClose={() => setIsForgotModalOpen(false)}
          />
        )}

        {/* Code Verification Modal */}
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
              <button
                onClick={handleCloseCodeModal}
                className={`absolute top-4 right-4 p-2 rounded-lg transition-colors ${
                  theme === 'dark' ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                }`}
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <div className={`w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  theme === 'dark' ? 'bg-[#4C7F6E]/20' : 'bg-[#4C7F6E]/10'
                }`}>
                  <KeyRound className="w-7 h-7 text-[#4C7F6E]" />
                </div>
                <h3 className={`text-xl font-black mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Подтверждение входа
                </h3>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Введите код авторизации
                </p>
              </div>

              <form onSubmit={handleCodeSubmit}>
                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={authCode}
                      onChange={(e) => setAuthCode(e.target.value.replace(/\D/g, ''))}
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
                Код действителен только для текущей сессии
              </div>
            </div>
          </div>
        )}

        {/* Biometric Setup Modal - OLD */}
        {showBiometricSetupModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={biometricSetupSuccess ? undefined : closeBiometricSetupModal}
            />
            <div className={`relative w-full max-w-md p-6 rounded-2xl shadow-2xl ${
              theme === 'dark' 
                ? 'bg-gradient-to-br from-[#0b0f17] via-[#0d1320] to-[#0a0f17] border border-white/10' 
                : 'bg-white border border-gray-200'
            }`}>
              {!biometricSetupSuccess && (
                <button
                  onClick={closeBiometricSetupModal}
                  className={`absolute top-4 right-4 p-2 rounded-lg transition-colors ${
                    theme === 'dark' ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              )}

              <div className="text-center mb-6">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  theme === 'dark' ? 'bg-[#4C7F6E]/20' : 'bg-[#4C7F6E]/10'
                }`}>
                  <Fingerprint className="w-8 h-8 text-[#4C7F6E]" />
                </div>
                <h3 className={`text-xl font-black mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {biometricSetupSuccess ? 'Готово!' : 'Привязать биометрию?'}
                </h3>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {biometricSetupSuccess 
                    ? 'Биометрия успешно привязана. Теперь вы можете входить по отпечатку пальца или Face ID.'
                    : 'Хотите добавить быстрый вход по биометрии (Face ID / Touch ID / отпечаток пальца)?'
                  }
                </p>
              </div>

              {!biometricSetupSuccess && (
                <div className="space-y-3">
                  {biometricSetupError && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold text-center">
                      {biometricSetupError}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleBiometricSetup}
                    disabled={biometricSetupLoading}
                    className="w-full py-4 px-6 rounded-2xl bg-[#4C7F6E] hover:bg-[#4C7F6E]/90 text-white font-black text-lg transition-all shadow-lg shadow-[#4C7F6E]/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {biometricSetupLoading ? (
                      <span>Привязка...</span>
                    ) : (
                      <>
                        <Fingerprint className="w-5 h-5" />
                        <span>Да, привязать</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={skipBiometricSetup}
                    className={`w-full py-3 px-6 rounded-2xl border font-bold text-base transition-all ${
                      theme === 'dark'
                        ? 'border-white/10 text-gray-400 hover:bg-white/5'
                        : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    Не сейчас
                  </button>

                  <p className={`text-xs text-center ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    Вы всегда сможете привязать биометрию позже в настройках профиля
                  </p>
                </div>
              )}

              {biometricSetupSuccess && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      const isMobile = window.innerWidth < 1024
                      navigate('/profile', { state: { openMenu: isMobile } })
                    }}
                    className="w-full py-4 px-6 rounded-2xl bg-[#4C7F6E] hover:bg-[#4C7F6E]/90 text-white font-black text-lg transition-all shadow-lg shadow-[#4C7F6E]/20"
                  >
                    Продолжить
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PD Consent Modal */}
        {needsConsent && (
          <PdConsentModal userId={user?.id} onAccept={acceptConsent} />
        )}
      </div>
    </>
  )
}
