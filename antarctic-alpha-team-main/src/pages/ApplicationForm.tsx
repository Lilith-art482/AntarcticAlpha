import { useState, useEffect } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { useThemeStore } from '@/store/themeStore'
import { Check, ArrowRight, Shield, Send, Users, Zap, Copy, AlertTriangle, X } from 'lucide-react'
import { db } from '@/firebase/config'
import { doc, setDoc, Timestamp } from 'firebase/firestore'
import { getAllUsers } from '@/services/firestoreService'
import logo from '../assets/logo.png'
import CustomCursor from '@/components/CustomCursor'

type Section = 'welcome' | 'personal' | 'crypto' | 'success'

type FormData = {
  // Personal Information
  firstName: string
  lastName: string
  middleName: string
  birthDate: string
  country: string
  timezone: string
  email: string
  phone: string
  telegram: string
  discord: string
  twitter: string
  maxVk: string
  referralCode: string
  
  // Trading & Experience - General
  devExperience: string
  education: string
  previousProjects: string
  goldenCase: string
  keyExpertise: string
  failureLesson: string
  devEngagement: string
  
  // Trading & Experience - Crypto
  tradingExperience: string
  cryptoGoldenCase: string
  cryptoGoldenCaseLinks: string
  baptismOfFire: string
  alphaSources: string
  dailyToolkit: string
  workingCapital: string
  tradingEngagement: string
  workSphere: string[]
}

const workingCapitalOptions = [
  { value: 'micro', label: 'Micro: <50-$100' },
  { value: 'low', label: 'Low: $200 – $500' },
  { value: 'mid', label: 'Mid: $1k – $5k' },
  { value: 'high', label: 'High: $5k+ (активный капитал)' },
]

const engagementOptions = [
  { value: 'less_than_hour', label: 'Меньше часа' },
  { value: '2_4_hours', label: '2–4 часа' },
  { value: '4_8_hours', label: '4–8 часов' },
  { value: '10_plus_hours', label: '10+ часов' },
]

export const ApplicationForm = () => {
  const { theme } = useThemeStore()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [currentSection, setCurrentSection] = useState<Section>('welcome')
  const [applicationId, setApplicationId] = useState('')
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [copied, setCopied] = useState(false)
  
  // Реферальное приветствие
  const [showReferralWelcome, setShowReferralWelcome] = useState(false)
  const [showReferralError, setShowReferralError] = useState(false)
  const [referrerNickname, setReferrerNickname] = useState('')
  const [referrerName, setReferrerName] = useState('')
  const [referralCodeError, setReferralCodeError] = useState('')
  const [validNicknames, setValidNicknames] = useState<Set<string>>(new Set())
  
  // Получаем ref из URL
  useEffect(() => {
    const refFromUrl = searchParams.get('ref')
    if (refFromUrl) {
      // Устанавливаем реферальный код в форму
      setFormData(prev => ({ ...prev, referralCode: refFromUrl }))
      // Загружаем данные о пригласившем
      loadReferrerInfo(refFromUrl)
    }
  }, [searchParams])
  
  // Загружаем все valid nicknames при монтировании
  useEffect(() => {
    const loadValidNicknames = async () => {
      try {
        const allUsers = await getAllUsers()
        const nicknameSet = new Set<string>(
          allUsers
            .map((u) => u.nickname)
            .filter((n): n is string => !!n)
            .map((n) => n.toLowerCase())
        )
        setValidNicknames(nicknameSet)
      } catch (error) {
        console.error('Error loading nicknames:', error)
      }
    }
    loadValidNicknames()
  }, [])
  
  // Валидация реферального кода при изменении
  const handleReferralCodeChange = (value: string) => {
    setFormData(prev => ({ ...prev, referralCode: value }))
    
    if (value.trim()) {
      // Извлекаем никнейм из кода (формат: ref-ARCATEAM=Nickname)
      const nickname = value.includes('=') ? value.split('=')[1] : value
      const nicknameLower = nickname.toLowerCase()
      
      if (!validNicknames.has(nicknameLower)) {
        setReferralCodeError('Такого реферального кода не существует. Пожалуйста, проверьте правильность кода или не указывайте его.')
      } else {
        setReferralCodeError('')
        // Загружаем информацию о пригласившем
        loadReferrerInfo(nickname)
      }
    } else {
      setReferralCodeError('')
    }
  }
  
  // Загрузка информации о пригласившем из Firestore
  const loadReferrerInfo = async (nickname: string) => {
    try {
      // Загружаем всех пользователей и ищем по nickname (case-insensitive)
      const allUsers = await getAllUsers()
      
      // Ищем точное совпадение (без учёта регистра)
      const foundUser = allUsers.find(
        (u) => u.nickname && u.nickname.toLowerCase() === nickname.toLowerCase()
      )
      
      if (foundUser) {
        // Пользователь найден — показываем приветствие
        setReferrerNickname(foundUser.nickname || nickname)
        setReferrerName(foundUser.name || foundUser.nickname || nickname)
        setShowReferralWelcome(true)
      } else {
        // Пользователь не найден — показываем ошибку и очищаем реферальный код
        setReferrerNickname(nickname)
        setShowReferralError(true)
        setFormData(prev => ({ ...prev, referralCode: '' }))
      }
    } catch (error) {
      console.error('Error loading referrer info:', error)
      setReferrerNickname(nickname)
      setShowReferralError(true)
      setFormData(prev => ({ ...prev, referralCode: '' }))
    }
  }

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    middleName: '',
    birthDate: '',
    country: '',
    timezone: '',
    email: '',
    phone: '',
    telegram: '',
    discord: '',
    twitter: '',
    maxVk: '',
    referralCode: '',
    
    devExperience: '',
    education: '',
    previousProjects: '',
    goldenCase: '',
    keyExpertise: '',
    failureLesson: '',
    devEngagement: '',
    
    tradingExperience: '',
    cryptoGoldenCase: '',
    cryptoGoldenCaseLinks: '',
    baptismOfFire: '',
    alphaSources: '',
    dailyToolkit: '',
    workingCapital: '',
    tradingEngagement: '',
    workSphere: [],
  })

  const handleInputChange = (field: keyof FormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const isPersonalValid = () => {
    return formData.firstName && 
           formData.lastName && 
           formData.birthDate && 
           formData.country && 
           formData.timezone && 
           formData.email && 
           formData.phone &&
           formData.telegram
  }

  const isTradingValid = () => {
    return formData.devExperience && 
           formData.education && 
           formData.previousProjects && 
           formData.goldenCase && 
           formData.keyExpertise && 
           formData.failureLesson && 
           formData.devEngagement
  }

  const isCryptoValid = () => {
    return formData.tradingExperience && 
           formData.cryptoGoldenCase && 
           formData.baptismOfFire && 
           formData.alphaSources && 
           formData.dailyToolkit && 
           formData.workingCapital && 
           formData.tradingEngagement &&
           formData.workSphere && formData.workSphere.length > 0
  }

  const generateApplicationId = () => {
    return 'AA-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase()
  }

  const handleSubmit = async () => {
    const newId = generateApplicationId()
    setApplicationId(newId)
    
    try {
      const applicationData = {
        id: newId,
        ...formData,
        submittedAt: Timestamp.now(),
        status: 'pending'
      }
      
      // Save to Firestore
      await setDoc(doc(db, 'applications', newId), applicationData)
      
      console.log('Application saved to Firestore:', newId)
      
      // Also store in localStorage as backup
      localStorage.setItem('application_' + newId, JSON.stringify({
        id: newId,
        ...formData,
        submittedAt: new Date().toISOString()
      }))
      
      setCurrentSection('success')
    } catch (error) {
      console.error('Error saving application:', error)
      alert('Ошибка при сохранении заявки. Попробуйте еще раз.')
    }
  }

  const copyApplicationId = () => {
    navigator.clipboard.writeText(applicationId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleNavigation = (action: 'home' | 'dm') => {
    ;(window as any).pendingAction = action
    setShowConfirmModal(true)
  }

  return (
    <>
      <CustomCursor />
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0b0f17]' : 'bg-white'}`}>
        {/* Background Effects */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -left-24 w-[620px] h-[620px] bg-gradient-to-br from-[#4C7F6E]/35 via-emerald-500/22 to-transparent blur-[110px]" />
          <div className="absolute top-[-120px] right-[-180px] w-[780px] h-[780px] bg-gradient-to-bl from-[#4C7F6E]/24 via-emerald-500/22 to-transparent blur-[140px]" />
          <div className="floating-grid opacity-30" />
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Модальное окно приветствия реферала */}
          {showReferralWelcome && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4">
              <div className={`relative w-full max-w-lg rounded-3xl border p-8 ${
                theme === 'dark' ? 'bg-[#0b1015] border-white/10' : 'bg-white border-gray-200'
              } shadow-2xl animate-in fade-in zoom-in duration-300`}>
                <button
                  onClick={() => setShowReferralWelcome(false)}
                  className={`absolute top-4 right-4 p-2 rounded-lg transition-colors ${
                    theme === 'dark' ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
                
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#4C7F6E]/20 to-emerald-600/20 flex items-center justify-center">
                    <Users className="w-8 h-8 text-[#4C7F6E]" />
                  </div>
                  <h2 className={`text-2xl font-black mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Привет!
                  </h2>
                </div>

                <div className="space-y-4">
                  <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    Тебя пригласил: <span className="font-bold" style={{ color: '#4C7F6E' }}>{referrerNickname}</span> {referrerName && referrerName !== referrerNickname && `(${referrerName})`} в команду сообщества трейдеров — <span className="font-bold">Antarctic Alpha</span>.
                  </p>
                  
                  <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    Мы строим сообщество, где каждый — это «Alpha», но вместе мы — единый ледокол.
                  </p>
                  
                  <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                    <p className={`text-sm font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Вот, что ты получишь благодаря реферальному приглашению, если будешь принят / принята в команду и пройдешь все этапы:
                    </p>
                    <ul className={`space-y-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      <li className="flex items-start gap-2">
                        <span className="text-[#4C7F6E] mt-1">•</span>
                        <span>Получишь доступ к любому разделу Контура (нашей обучающей платформы, где собраны свыше 6 сфер по крипте и фондовому рынку с советами, рекомендациями, сервисами и статьями) без дополнительной платы;</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#4C7F6E] mt-1">•</span>
                        <span>Вернешь 50% взносов в пул сообщества во время торговли в первый месяц самостоятельной торговли после успешного прохождения контура;</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#4C7F6E] mt-1">•</span>
                        <span>Получишь 50$ USDT на баланс для торговли после успешного прохождения контура.</span>
                      </li>
                    </ul>
                  </div>
                  
                  <p className={`text-sm font-medium text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    Скорее подавай заявку, встретимся в команде! 🐧
                  </p>
                </div>
                
                <button
                  onClick={() => setShowReferralWelcome(false)}
                  className="w-full mt-6 py-3 rounded-xl text-white font-bold transition-all"
                  style={{ backgroundColor: '#4C7F6E' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3d6a5e'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4C7F6E'}
                >
                  Понятно, продолжить
                </button>
              </div>
            </div>
          )}

          {/* Модальное окно ошибки реферала */}
          {showReferralError && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4">
              <div className={`relative w-full max-w-md rounded-3xl border p-8 ${
                theme === 'dark' ? 'bg-[#0b1015] border-white/10' : 'bg-white border-gray-200'
              } shadow-2xl animate-in fade-in zoom-in duration-300`}>
                <button
                  onClick={() => setShowReferralError(false)}
                  className={`absolute top-4 right-4 p-2 rounded-lg transition-colors ${
                    theme === 'dark' ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
                
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-500/10 flex items-center justify-center">
                    <AlertTriangle className="w-8 h-8 text-red-500" />
                  </div>
                  <h2 className={`text-2xl font-black mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Участник команды не найден
                  </h2>
                </div>

                <div className="space-y-4">
                  <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    Участник с никнеймом <span className="font-mono font-bold" style={{ color: '#4C7F6E' }}>{referrerNickname}</span> не найден в нашей команде.
                  </p>
                  
                  <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                    <p className={`text-sm font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Что можно сделать:
                    </p>
                    <ul className={`space-y-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      <li className="flex items-start gap-2">
                        <span className="text-[#4C7F6E] mt-1">1.</span>
                        <span>Проверьте правильность ссылки — возможно, в ней опечатка или никнейм изменился.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#4C7F6E] mt-1">2.</span>
                        <span>Свяжитесь с другом, который пригласил вас, и попросите актуальную реферальную ссылку.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#4C7F6E] mt-1">3.</span>
                        <span>Вы можете подать заявку без реферального приглашения — отбор проходит одинаково для всех.</span>
                      </li>
                    </ul>
                  </div>

                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                    Если вы уверены, что ссылка верная, но ошибка повторяется — свяжитесь с нами по кнопке «Помощь» на странице авторизации или «DM» на странице формы, мы разберёмся.
                  </p>
                </div>

                <button
                  onClick={() => setShowReferralError(false)}
                  className="w-full mt-6 py-3 rounded-xl text-white font-bold transition-all"
                  style={{ backgroundColor: '#4C7F6E' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3d6a5e'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4C7F6E'}
                >
                  Продолжить без реферала
                </button>
              </div>
            </div>
          )}

          {currentSection === 'welcome' && (
            <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-6 py-12">
              <div className="max-w-4xl mx-auto w-full">
                {/* Header */}
                <div className="text-center mb-12">
                  <div className="mb-6 flex justify-center">
                    <div className="w-24 h-24 flex items-center justify-center animate-pulse-subtle">
                      <img
                        src={logo}
                        alt="Antarctic Alpha Team"
                        className="w-20 h-20 object-contain rounded-xl filter drop-shadow-[0_0_15px_rgba(76,127,110,0.4)]"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Анкета на отбор в команду
                    </h1>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
                      <span className="bg-gradient-to-r from-[#4C7F6E] via-emerald-500 to-[#4C7F6E] bg-clip-text text-transparent">
                        Antarctic Alpha
                      </span>
                      <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}> 🐧</span>
                    </h2>
                  </div>
                </div>

                {/* Info Blocks - 2x2 Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Block 1 */}
                  <div className={`relative rounded-2xl p-6 ${theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-200'} shadow-lg`}>
                    <div className="flex flex-col h-full">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4C7F6E]/20 to-emerald-600/20 flex items-center justify-center flex-shrink-0">
                          <Users className="w-6 h-6 text-[#4C7F6E]" />
                        </div>
                        <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          Antarctic Alpha Team
                        </h3>
                      </div>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} flex-1`}>
                        Ты на пороге вступления в одну из самых эффективных команд в крипте и фондовом рынке! Мы строим сообщество, где каждый — это «Alpha», но вместе мы — единый ледокол.
                      </p>
                    </div>
                  </div>

                  {/* Block 2 */}
                  <div className={`relative rounded-2xl p-6 ${theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-200'} shadow-lg`}>
                    <div className="flex flex-col h-full">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4C7F6E]/20 to-emerald-600/20 flex items-center justify-center flex-shrink-0">
                          <Zap className="w-6 h-6 text-[#4C7F6E]" />
                        </div>
                      ч  <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          Твой шанс
                        </h3>
                      </div>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} flex-1`}>
                        Нам нужны не только трейдеры, но и разработчики, аналитики, юристы, SMM-специалисты и еще много кто. Заполни анкету максимально подробно — это твой шанс стать частью нашей экспедиции за профитом. Если твой скилл усилит команду, мы найдем общий язык!
                      </p>
                    </div>
                  </div>

                  {/* Block 3 */}
                  <div className={`relative rounded-2xl p-6 ${theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-200'} shadow-lg`}>
                    <div className="flex flex-col h-full">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4C7F6E]/20 to-emerald-600/20 flex items-center justify-center flex-shrink-0">
                          <Shield className="w-6 h-6 text-[#4C7F6E]" />
                        </div>
                        <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          Второй шанс
                        </h3>
                      </div>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} flex-1`}>
                        Не получилось пройти отбор с первого раза — не страшно. Мы обязательно дадим обратную связь и второй шанс, а при повторном отказе — подробный разбор и возможность вернуться в команду через 3 месяца. Если увидим твою искреннюю вовлеченность и желание расти, предложим досрочную попытку — без ответа точно не оставим!
                      </p>
                    </div>
                  </div>

                  {/* Block 4 - Final */}
                  <div className={`relative rounded-2xl p-6 ${theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-200'} shadow-lg`}>
                    <div className="flex flex-col h-full">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4C7F6E]/20 to-emerald-600/20 flex items-center justify-center flex-shrink-0">
                          <Check className="w-6 h-6 text-[#4C7F6E]" />
                        </div>
                        <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          Мы верим в тебя!
                        </h3>
                      </div>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} flex-1`}>
                        Если возникнут сложности и потребуется перерыв, мы всё поймем и поставим рассмотрение заявки или уже обучение на паузу. Ответы на частые вопросы ищи в нашем FAQ или напиши DM. Верим, что у тебя всё получится — до встречи в команде!
                      </p>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
    <Link
      to="/application-faq"
      className={`inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all ${theme === 'dark'
        ? 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                      : 'bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span>FAQ</span>
                  </Link>
                  <button
                    onClick={() => setCurrentSection('personal')}
                    className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#4C7F6E] hover:bg-[#4C7F6E]/90 text-white font-black text-lg transition-all shadow-lg shadow-[#4C7F6E]/20 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span>Gm, дальше!</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <Link
                    to="/contact-dm"
                    className={`inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all ${theme === 'dark'
                      ? 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                      : 'bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span>DM</span>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Personal Information Section */}
          {currentSection === 'personal' && (
            <div className="min-h-[calc(100vh-5rem)] px-6 py-12">
              <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#4C7F6E]/10 text-[#4C7F6E] text-sm font-bold mb-4">
                    <span className="w-2 h-2 rounded-full bg-[#4C7F6E]" />
                    Раздел 1 из 2
                  </div>
                  <h2 className={`text-3xl sm:text-4xl font-black mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Personal Information
                  </h2>
                  <p className={`text-gray-500 dark:text-gray-400 font-medium leading-relaxed`}>
                    Эти данные необходимы для внутренней верификации и координации внутри команды. Мы ценим твою приватность: предоставленная информация будет доступна только ответственным за отбор и не выйдет за пределы Antarctic Alpha, за исключением случаев, предусмотренных применимым законодательством.
                  </p>
                </div>

                <div className={`rounded-3xl p-8 ${theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-gray-50 border border-gray-200'}`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className={`text-sm font-bold block ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Имя *</label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        placeholder="Иван"
                        className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E]'}`}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className={`text-sm font-bold block ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Фамилия *</label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        placeholder="Иванов"
                        className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E]'}`}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className={`text-sm font-bold block ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Отчество</label>
                      <input
                        type="text"
                        value={formData.middleName}
                        onChange={(e) => handleInputChange('middleName', e.target.value)}
                        placeholder="Иванович"
                        className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E]'}`}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className={`text-sm font-bold block ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Дата рождения *</label>
                      <input
                        type="date"
                        value={formData.birthDate}
                        onChange={(e) => handleInputChange('birthDate', e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E]'}`}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className={`text-sm font-bold block ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Страна *</label>
                      <input
                        type="text"
                        value={formData.country}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                        placeholder="Россия"
                        className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E]'}`}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className={`text-sm font-bold block ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Часовой пояс (UTC) *</label>
                      <input
                        type="text"
                        value={formData.timezone}
                        onChange={(e) => handleInputChange('timezone', e.target.value)}
                        placeholder="UTC+3"
                        className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E]'}`}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className={`text-sm font-bold block ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Email *</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="example@email.com"
                        className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E]'}`}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className={`text-sm font-bold block ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Номер телефона *</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+7 999 123 45 67"
                        className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E]'}`}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className={`text-sm font-bold block ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Telegram (Username) *</label>
                      <input
                        type="text"
                        value={formData.telegram}
                        onChange={(e) => handleInputChange('telegram', e.target.value)}
                        placeholder="@username"
                        className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E]'}`}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className={`text-sm font-bold block ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Discord (Username)</label>
                      <input
                        type="text"
                        value={formData.discord}
                        onChange={(e) => handleInputChange('discord', e.target.value)}
                        placeholder="username#0000"
                        className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E]'}`}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className={`text-sm font-bold block ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Ссылка на профиль в X (Twitter)</label>
                      <input
                        type="url"
                        value={formData.twitter}
                        onChange={(e) => handleInputChange('twitter', e.target.value)}
                        placeholder="https://x.com/username"
                        className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E]'}`}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className={`text-sm font-bold block ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Ссылка на MAX или ВК</label>
                      <input
                        type="url"
                        value={formData.maxVk}
                        onChange={(e) => handleInputChange('maxVk', e.target.value)}
                        placeholder="https://..."
                        className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E]'}`}
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className={`text-sm font-bold block ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Реферальный код</label>
                      <input
                        type="text"
                        value={formData.referralCode}
                        onChange={(e) => handleReferralCodeChange(e.target.value)}
                        placeholder="Реферальный код"
                        className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-red-500/10 ${
                          referralCodeError 
                            ? theme === 'dark'
                              ? 'bg-white/5 border-red-500 text-white placeholder-gray-600 focus:border-red-500'
                              : 'bg-white border-red-500 text-gray-900 placeholder-gray-400 focus:border-red-500'
                            : theme === 'dark' 
                              ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#4C7F6E]' 
                              : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E]'
                        }`}
                      />
                      {referralCodeError ? (
                        <p className="text-xs text-red-500">{referralCodeError}</p>
                      ) : (
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                          Реферальный код можно взять у действующего трейдера команды. Не применим для специализаций, которые не связаны с торговлей.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-8 flex justify-between items-center">
                    <button
                      onClick={() => setCurrentSection('welcome')}
                      className={`px-6 py-3 rounded-xl font-bold transition-all ${theme === 'dark' ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      Назад
                    </button>
                    <button
                      onClick={() => setCurrentSection('crypto')}
                      disabled={!isPersonalValid()}
                      className={`inline-flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all ${isPersonalValid() ? 'bg-[#4C7F6E] hover:bg-[#4C7F6E]/90 text-white shadow-lg shadow-[#4C7F6E]/20 hover:scale-[1.02]' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                    >
                      <span>Двигаюсь дальше</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Trading & Experience Section */}
          {currentSection === 'crypto' && (
            <div className="min-h-[calc(100vh-5rem)] px-6 py-12">
              <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#4C7F6E]/10 text-[#4C7F6E] text-sm font-bold mb-4">
                    <span className="w-2 h-2 rounded-full bg-[#4C7F6E]" />
                    Раздел 2 из 2
                  </div>
                  <h2 className={`text-3xl sm:text-4xl font-black mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Trading & Experience
                  </h2>
                  <p className={`text-gray-500 dark:text-gray-400 font-medium leading-relaxed mb-4`}>
                    Здесь мы хотим понять твой общий фундамент и торговый опыт. Нам не важны заоблачные цифры — нам важна твоя логика, дисциплина и умение выживать на рынке.
                  </p>
                </div>

                <div className={`rounded-3xl p-8 space-y-8 ${theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-gray-50 border border-gray-200'}`}>
                  
                  {/* Подблок: Общие вопросы */}
                  <div className="space-y-6">
                    <h3 className={`text-xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Общие вопросы
                    </h3>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-4`}>
                      Если ты планируешься заниматься только торговлей/ончейн и иным связанным с торговлей анализом, пропусти этот подблок и перейди к подблоку Trading.
                    </p>

                    {/* Вопрос 1: Опыт в разработке */}
                    <div className="space-y-4">
                      <label className={`text-lg font-bold block ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>1) У тебя есть опыт в разработке (в т.ч. дизайн/юриспруденции/маркетинге и SMM):</label>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Пиши в формате: Сфера - Опыт (кол-во месяцев/лет теории и практики)
                      </p>
                      <textarea
                        value={formData.devExperience}
                        onChange={(e) => handleInputChange('devExperience', e.target.value)}
                        placeholder="Например: Дизайн - 2 года занимаюсь веб-дизайном, сделал / сделала сайты для более чем 20 клиентов, Python разработка - 6 месяцев"
                        rows={3}
                        className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 resize-none ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E]'}`}
                      />
                    </div>

                    {/* Вопрос 2: Образование */}
                    <div className="space-y-4">
                      <label className={`text-lg font-bold block ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>2) Твое образование:</label>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Укажи вуз, специальность и год окончания. Если есть дополнительное образование, курсы или сертификаты — расскажи о них.
                      </p>
                      <textarea
                        value={formData.education}
                        onChange={(e) => handleInputChange('education', e.target.value)}
                        placeholder="Например: МГУ, Прикладная математика, 2020. additionally: курсы по машинному обучению, 2022"
                        rows={3}
                        className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 resize-none ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E]'}`}
                      />
                    </div>

                    {/* Вопрос 3: Предыдущие проекты */}
                    <div className="space-y-4">
                      <label className={`text-lg font-bold block ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>3) Предыдущие проекты:</label>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Расскажи о ключевых проектах, в которых ты участвовал или участвовала. Укажи свою роль, задачи и достигнутые результаты. Ссылки на портфолио или GitHub приветствуются.
                      </p>
                      <textarea
                        value={formData.previousProjects}
                        onChange={(e) => handleInputChange('previousProjects', e.target.value)}
                        placeholder="Опиши свои ключевые проекты..."
                        rows={4}
                        className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 resize-none ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E]'}`}
                      />
                    </div>

                    {/* Вопрос 4: Golden Case */}
                    <div className="space-y-4">
                      <label className={`text-lg font-bold block ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>4) Твой Golden Case:</label>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Расскажи о своем лучшем проекте или кейсе. Что было сделано, какие проблемы решены, какой результат достигнут?
                      </p>
                      <textarea
                        value={formData.goldenCase}
                        onChange={(e) => handleInputChange('goldenCase', e.target.value)}
                        placeholder="Опиши свой самый успешный кейс..."
                        rows={4}
                        className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 resize-none ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E]'}`}
                      />
                    </div>

                    {/* Вопрос 5: Ключевая экспертиза */}
                    <div className="space-y-4">
                      <label className={`text-lg font-bold block ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>5) В чем твоя ключевая экспертиза?</label>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Какие технологии, инструменты или методологии ты используешь лучше всего? Расскажи о своей суперсиле.
                      </p>
                      <textarea
                        value={formData.keyExpertise}
                        onChange={(e) => handleInputChange('keyExpertise', e.target.value)}
                        placeholder="Опиши свою суперсилу..."
                        rows={3}
                        className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 resize-none ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E]'}`}
                      />
                    </div>

                    {/* Вопрос 6: Ситуация когда что-то пошло не так */}
                    <div className="space-y-4">
                      <label className={`text-lg font-bold block ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>6) Опиши ситуацию, когда что-то пошло не так:</label>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Как ты справился или справилась с проблемой? Чему научился/научилась? Мы ценим честность и способность извлекать уроки.
                      </p>
                      <textarea
                        value={formData.failureLesson}
                        onChange={(e) => handleInputChange('failureLesson', e.target.value)}
                        placeholder="Опиши ситуацию и извлеченный урок..."
                        rows={4}
                        className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 resize-none ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E]'}`}
                      />
                    </div>

                    {/* Вопрос 7: Вовлеченность */}
                    <div className="space-y-4">
                      <label className={`text-lg font-bold block ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>7) Твоя вовлеченность (Engagement):</label>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Сколько времени ты готов или готова инвестировать в развитие команды ежедневно? (Меньше часа, 2-4 часа, 4-8 часов, 10+)
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        {engagementOptions.map(option => (
                          <button
                            key={option.value}
                            onClick={() => handleInputChange('devEngagement', option.value)}
                            className={`p-4 rounded-xl border-2 text-center font-bold transition-all ${formData.devEngagement === option.value ? 'border-[#4C7F6E] bg-[#4C7F6E]/10 text-[#4C7F6E]' : theme === 'dark' ? 'border-white/10 bg-white/5 text-white hover:border-white/20' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        <strong>P.S.</strong> Указанные часы и цифры — это ориентир. Мы работаем по принципу Proof of Work: нам важен результат, а не время, проведенное перед монитором. Если ты выдаешь за 1 час то, на что у других уходит день — мы это оценим и поощрим.
                      </p>
                    </div>
                  </div>

                  {/* Подблок: Crypto */}
                  <div className="space-y-6 pt-6 border-t border-white/10">
                    <h3 className={`text-xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Trading
                    </h3>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-4`}>
                      Здесь все вопросы для трейдеров, аналитиков и коллеров. Постарайся указать все скиллы и подтвердить их, это даст преимущество при рассмотрении заявки
                    </p>

                    {/* Вопрос 1: Стаж в торговле */}
                    <div className="space-y-4">
                      <label className={`text-lg font-bold block ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>1) Твой стаж в торговле?</label>
                      <textarea
                        value={formData.tradingExperience}
                        onChange={(e) => handleInputChange('tradingExperience', e.target.value)}
                        placeholder="Опиши свой опыт в торговле..."
                        rows={3}
                        className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 resize-none ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E]'}`}
                      />
                    </div>

                    {/* Вопрос 2: Golden Case Crypto */}
                    <div className="space-y-4">
                      <label className={`text-lg font-bold block ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>2) Твой Golden Case:</label>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Расскажи о своих самых прибыльных сделках (в идеале — топ-3-5-10, но можно одну флагманскую). Нам важно понять: что стало триггером для входа (ресерч, инсайд, тех-анализ, аномалия в чейне) и как ты фиксировал или фиксировала результат?
                      </p>
                      <textarea
                        value={formData.cryptoGoldenCase}
                        onChange={(e) => handleInputChange('cryptoGoldenCase', e.target.value)}
                        placeholder="Опиши свои самые прибыльные сделки..."
                        rows={4}
                        className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 resize-none ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E]'}`}
                      />
                      <p className={`text-sm font-bold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Подтверждение (Proof of Work):</p>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Прикрепи ссылки на транзакции в эксплорере (Etherscan, Solscan и др.) или свой профиль в DeBank/Arkham/GMGN. Если есть скрины сделок или видео с разбором логики — загружай на диск и кидай ссылку.
                      </p>
                      <input
                        type="url"
                        value={formData.cryptoGoldenCaseLinks}
                        onChange={(e) => handleInputChange('cryptoGoldenCaseLinks', e.target.value)}
                        placeholder="Ссылка на подтверждения (Etherscan, DeBank и т.д.)"
                        className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E]'}`}
                      />
                    </div>

                    {/* Вопрос 3: Боевое крещение */}
                    <div className="space-y-4">
                      <label className={`text-lg font-bold block ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>3) Твое "боевое крещение": самый дорогой урок от рынка:</label>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Опиши ошибку в риск-менеджменте или анализе. Если не торгов — опиши крупнейший провал в своей дисциплине (в т.ч. в обычной, рядовой жизни).
                      </p>
                      <textarea
                        value={formData.baptismOfFire}
                        onChange={(e) => handleInputChange('baptismOfFire', e.target.value)}
                        placeholder="Опиши свой самый поучительный факап..."
                        rows={4}
                        className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 resize-none ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E]'}`}
                      />
                    </div>

                    {/* Вопрос 4: Источники альфы */}
                    <div className="space-y-4">
                      <label className={`text-lg font-bold block ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>4) Где ты черпаешь альфу?</label>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Перечисли 3–5 источников (Twitter-аккаунты, Discord-каналы, закрытые чаты, софт), которые формируют твою картину рынка — так поймем твой уровень по качеству твоей ленты.
                      </p>
                      <textarea
                        value={formData.alphaSources}
                        onChange={(e) => handleInputChange('alphaSources', e.target.value)}
                        placeholder="Перечисли источники альфы..."
                        rows={4}
                        className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 resize-none ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E]'}`}
                      />
                    </div>

                    {/* Вопрос 5: Daily Toolkit */}
                    <div className="space-y-4">
                      <label className={`text-lg font-bold block ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>5) Твой Daily Toolkit: какими инструментами пользуешься ежедневно?</label>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Например: DexScreener, Dune Analytics, Glassnode, GMGN, Debank, Nansen, TV и т.д.
                      </p>
                      <textarea
                        value={formData.dailyToolkit}
                        onChange={(e) => handleInputChange('dailyToolkit', e.target.value)}
                        placeholder="Перечисли инструменты..."
                        rows={3}
                        className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 resize-none ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E]'}`}
                      />
                    </div>

                    {/* Вопрос 6: Рабочий капитал */}
                    <div className="space-y-4">
                      <label className={`text-lg font-bold block ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>6) Твой рабочий капитал:</label>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Нам не важен размер депозита для оценки твоих способностей, но нам важно понимать твой текущий масштаб и риск-менеджмент.
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        {workingCapitalOptions.map(option => (
                          <button
                            key={option.value}
                            onClick={() => handleInputChange('workingCapital', option.value)}
                            className={`p-4 rounded-xl border-2 text-center font-bold transition-all ${formData.workingCapital === option.value ? 'border-[#4C7F6E] bg-[#4C7F6E]/10 text-[#4C7F6E]' : theme === 'dark' ? 'border-white/10 bg-white/5 text-white hover:border-white/20' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Вопрос 7: Вовлеченность Trading */}
                    <div className="space-y-4">
                      <label className={`text-lg font-bold block ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>7) Твоя вовлеченность (Engagement):</label>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Сколько времени ты готов или готова работать ежедневно или в месяце?
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        {engagementOptions.map(option => (
                          <button
                            key={option.value}
                            onClick={() => handleInputChange('tradingEngagement', option.value)}
                            className={`p-4 rounded-xl border-2 text-center font-bold transition-all ${formData.tradingEngagement === option.value ? 'border-[#4C7F6E] bg-[#4C7F6E]/10 text-[#4C7F6E]' : theme === 'dark' ? 'border-white/10 bg-white/5 text-white hover:border-white/20' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        <strong>P.S.</strong> Указанные часы и цифры — это ориентир. Мы работаем по принципу Proof of Work: нам важен результат, а не время, проведенное перед монитором. Если ты выдаешь за 1 час то, на что у других уходит день — мы это оценим и поощрим.
                      </p>
                    </div>

                    {/* Вопрос 8: Сфера работы */}
                    <div className="space-y-4">
                      <label className={`text-lg font-bold block ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>8) В какой сфере ты бы хотел или хотела бы работать? (можно выбрать несколько):</label>
                      <div className="space-y-2">
                        {[
                          { value: 'trading', label: 'Торговля и анализ мемов' },
                          { value: 'deving', label: 'Создание мемов (девинг)' },
                          { value: 'polymarket', label: 'Polymarket' },
                          { value: 'spot_futures', label: 'Спотовая, фьючерсная и проп-трейдинг торговля' },
                          { value: 'nft', label: 'NFT' },
                          { value: 'stock', label: 'Торговля и анализ фондового рынка' },
                          { value: 'p2p', label: 'P2P и P2C' },
                          { value: 'staking', label: 'Стейкинг и AirDrop' },
                        ].map(option => (
                          <label key={option.value} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-100'}`}>
                            <input
                              type="checkbox"
                              checked={formData.workSphere?.includes(option.value) || false}
                              onChange={(e) => {
                                const current = formData.workSphere || []
                                const updated = e.target.checked
                                  ? [...current, option.value]
                                  : current.filter(v => v !== option.value)
                                handleInputChange('workSphere', updated)
                              }}
                              className="w-5 h-5 rounded border-gray-300 text-[#4C7F6E] focus:ring-[#4C7F6E]"
                            />
                            <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Navigation */}
                  <div className="mt-8 flex justify-between items-center pt-6 border-t border-white/10">
                    <button
                      onClick={() => setCurrentSection('personal')}
                      className={`px-6 py-3 rounded-xl font-bold transition-all ${theme === 'dark' ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      Назад
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={!isTradingValid() || !isCryptoValid()}
                      className={`inline-flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all ${(!isTradingValid() || !isCryptoValid()) ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#4C7F6E] hover:bg-[#4C7F6E]/90 text-white shadow-lg shadow-[#4C7F6E]/20 hover:scale-[1.02]'}`}
                    >
                      <Send className="w-5 h-5" />
                      <span>Отправить анкету</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Success Section */}
          {currentSection === 'success' && (
            <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-6 py-12">
              <div className={`max-w-2xl mx-auto rounded-3xl p-8 sm:p-12 ${theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-gray-50 border border-gray-200'}`}>
                <div className="text-center mb-8">
                  <div className="w-20 h-20 rounded-full bg-[#4C7F6E]/20 flex items-center justify-center mx-auto mb-6">
                    <Check className="w-10 h-10 text-[#4C7F6E]" />
                  </div>
                  <div className="space-y-2">
                    <h2 className={`text-3xl sm:text-4xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Анкета получена, спасибо, {formData.firstName}!
                    </h2>
                    <p className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
                      <span className="bg-gradient-to-r from-[#4C7F6E] via-emerald-500 to-[#4C7F6E] bg-clip-text text-transparent">
                        Antarctic Alpha
                      </span>
                      <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}> 🐧</span>
                    </p>
                  </div>
                  <div className="mt-4 flex items-center justify-center gap-3">
                    <p className={`text-sm font-mono ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      ID анкеты: <span className="font-bold text-[#4C7F6E]">{applicationId}</span>
                    </p>
                    <button
                      onClick={copyApplicationId}
                      className={`p-2 rounded-lg transition-all ${theme === 'dark' ? 'bg-white/5 text-[#4C7F6E] hover:bg-white/10' : 'bg-gray-100 text-[#4C7F6E] hover:bg-gray-200'}`}
                      title="Скопировать ID"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  {copied && <p className="text-sm text-[#4C7F6E] font-medium">ID скопирован!</p>}
                </div>

                <div className="space-y-6 mb-8">
                  <div>
                    <h3 className={`font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Твои данные, которые ты использовал(а) для заполнения:
                    </h3>
                    <div className={`rounded-xl p-4 space-y-2 ${theme === 'dark' ? 'bg-white/5' : 'bg-white'}`}>
                      <div className="flex justify-between">
                        <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Имя:</span>
                        <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{formData.firstName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Фамилия:</span>
                        <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{formData.lastName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Дата рождения:</span>
                        <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{formData.birthDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Email:</span>
                        <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{formData.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Телефон:</span>
                        <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{formData.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>TG или MAX:</span>
                        <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {formData.telegram}{formData.maxVk && formData.maxVk !== formData.telegram ? ` / ${formData.maxVk}` : ''}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className={`rounded-xl p-6 ${theme === 'dark' ? 'bg-[#4C7F6E]/10' : 'bg-[#4C7F6E]/5'}`}>
                    <p className={`font-medium leading-relaxed ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Твоя заявка ушла на рассмотрение в штаб Antarctic Alpha. Мы изучаем каждого кандидата вручную. Если твои скиллы — это то, что нам нужно, наш ответ прилетит быстрее, чем свеча на графике. Сохраняй холодную голову. Скоро свяжемся!
                    </p>
                  </div>

                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    P.S.: если ответ не пришел в течение 7 дней, то свяжись с DM по кнопке «Помощь» на странице авторизации или «Связь с DM» отсюда с указанием ID анкеты и почты, которая была указана при заполнении контактных данных.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => handleNavigation('home')}
                    className="flex-1 py-3 px-6 rounded-xl bg-[#4C7F6E] hover:bg-[#4C7F6E]/90 text-white font-bold transition-all"
                  >
                    На главную
                  </button>
                  <button
                    onClick={() => navigate('/contact-dm')}
                    className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all ${theme === 'dark' ? 'bg-white/5 text-white hover:bg-white/10 border border-white/10' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'}`}
                  >
                    Связь с DM
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Confirmation Modal */}
          {showConfirmModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowConfirmModal(false)} />
              <div className={`relative max-w-md w-full rounded-3xl p-8 ${theme === 'dark' ? 'bg-[#0b0f17] border border-white/10' : 'bg-white border border-gray-200'} shadow-2xl`}>
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mb-6">
                    <AlertTriangle className="w-8 h-8 text-amber-500" />
                  </div>
                  <h3 className={`text-2xl font-black mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Убедись, что ID скопировано
                  </h3>
                  <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
                    Без него найти твою анкету невозможно
                  </p>
                  <div className={`w-full p-4 rounded-xl mb-6 ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'}`}>
                    <p className={`text-sm font-mono ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-2`}>
                      Твой ID анкеты:
                    </p>
                    <p className="text-2xl font-black text-[#4C7F6E]">{applicationId}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <button
                      onClick={() => setShowConfirmModal(false)}
                      className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all ${theme === 'dark' ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      Остаться
                    </button>
                    <button
                      onClick={() => {
                        const pendingAction = (window as any).pendingAction
                        if (pendingAction === 'home') {
                          navigate('/')
                        } else if (pendingAction === 'dm') {
                          navigate('/contact-dm')
                        }
                        setShowConfirmModal(false)
                      }}
                      className="flex-1 py-3 px-6 rounded-xl bg-[#4C7F6E] hover:bg-[#4C7F6E]/90 text-white font-bold transition-all"
                    >
                      ID скопирован, продолжить
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
