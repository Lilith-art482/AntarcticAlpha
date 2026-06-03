import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useThemeStore } from '@/store/themeStore'
import { X, Check, ArrowRight, Shield, Send, Sun, Moon, Zap, Copy, AlertTriangle, Briefcase, Code, Scale, Megaphone, Palette, Search } from 'lucide-react'
import logo from '../assets/logo.png'
import CustomCursor from '@/components/CustomCursor'

type Section = 'welcome' | 'personal' | 'background' | 'specialization' | 'experience' | 'success'

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
  
  // Background
  workExperience: string
  education: string
  previousProjects: string
  
  // Specialization
  specialization: string
  
  // Experience
  hardSkill: string
  goldenCase: string
  goldenCaseLinks: string
  biggestFail: string
  toolkit: string
  engagement: string
  
  // Trading Interest
  tradingInterest: string
}

const specializationOptions = [
  { value: 'dev', label: 'Разработка (Dev)', icon: Code, description: 'Frontend, Backend, Smart Contracts, DevOps' },
  { value: 'legal', label: 'Юридический отдел (Legal)', icon: Scale, description: 'Compliance, KYC, Contracts' },
  { value: 'research', label: 'Аналитика и ресерч (Research)', icon: Search, description: 'On-chain анализ, Due Diligence' },
  { value: 'marketing', label: 'Маркетинг и SMM (Marketing)', icon: Megaphone, description: 'Content, Community, PR' },
  { value: 'design', label: 'Дизайн (Design)', icon: Palette, description: 'UI/UX, Branding, Graphics' },
  { value: 'ops', label: 'Операционная деятельность (Ops)', icon: Briefcase, description: 'Project Management, Operations' },
]

const workExperienceOptions = [
  { value: 'no_experience', label: 'Нет опыта (студент/новичок)' },
  { value: '1_year', label: '1 год+ (Junior)' },
  { value: '3_years', label: '3 года+ (Middle)' },
  { value: '5_years', label: '5 лет+ (Senior)' },
  { value: '8_years', label: '8 лет+ (Expert/Lead)' },
]

const engagementOptions = [
  { value: 'less_than_hour', label: 'Меньше часа' },
  { value: '2_4_hours', label: '2–4 часа' },
  { value: '4_8_hours', label: '4–8 часов' },
  { value: '10_plus_hours', label: '10+ часов' },
]

const tradingInterestOptions = [
  { value: 'no', label: 'Нет интереса, только в своей сфере' },
  { value: 'maybe_later', label: 'Возможно, но позже' },
  { value: 'yes_learning', label: 'Да, хотел(а) бы научиться' },
  { value: 'yes_combining', label: 'Да, планирую совмещать' },
]

export const InfrastructureForm = () => {
  const { theme, toggleTheme } = useThemeStore()
  const navigate = useNavigate()
  const [currentSection, setCurrentSection] = useState<Section>('welcome')
  const [applicationId, setApplicationId] = useState('')
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [copied, setCopied] = useState(false)
  
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
    
    workExperience: '',
    education: '',
    previousProjects: '',
    
    specialization: '',
    
    hardSkill: '',
    goldenCase: '',
    goldenCaseLinks: '',
    biggestFail: '',
    toolkit: '',
    engagement: '',
    
    tradingInterest: '',
  })

  const handleInputChange = (field: keyof FormData, value: string) => {
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

  const isBackgroundValid = () => {
    return formData.workExperience && 
           formData.education &&
           formData.previousProjects
  }

  const isSpecializationValid = () => {
    return formData.specialization
  }

  const isExperienceValid = () => {
    return formData.hardSkill && 
           formData.goldenCase && 
           formData.biggestFail && 
           formData.toolkit && 
           formData.engagement &&
           formData.tradingInterest
  }

  const generateApplicationId = () => {
    return 'AI-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase()
  }

  const handleSubmit = () => {
    const newId = generateApplicationId()
    setApplicationId(newId)
    
    // Here you would save the data to Firestore or send to server
    console.log('Infrastructure application submitted:', { id: newId, ...formData })
    
    // Store in localStorage for demo purposes
    localStorage.setItem('infrastructure_' + newId, JSON.stringify({ id: newId, ...formData, submittedAt: new Date().toISOString() }))
    
    setCurrentSection('success')
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

  const getSpecializationLabel = (value: string) => {
    const spec = specializationOptions.find(s => s.value === value)
    return spec ? spec.label : value
  }

  return (
    <>
      <CustomCursor />
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0b0f17]' : 'bg-white'}`}>
        {/* Header */}
        <div className={`fixed top-0 left-0 right-0 z-50 ${theme === 'dark' ? 'bg-[#0b0f17]/90 backdrop-blur-lg border-b border-white/10' : 'bg-white/90 backdrop-blur-lg border-b border-gray-200'}`}>
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Logo" className="w-10 h-10 object-contain rounded-xl" />
              <span className={`font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Antarctic Alpha Team
              </span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-amber-300 transition-all`}
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={() => {
                  if (currentSection === 'success') {
                    handleNavigation('home')
                  } else {
                    navigate('/login')
                  }
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${theme === 'dark'
                  ? 'bg-white/5 text-white hover:bg-white/10'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <X className="w-4 h-4" />
                <span className="hidden sm:inline">Закрыть</span>
              </button>
            </div>
          </div>
        </div>

        {/* Background Effects */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -left-24 w-[620px] h-[620px] bg-gradient-to-br from-[#4C7F6E]/35 via-emerald-500/22 to-transparent blur-[110px]" />
          <div className="absolute top-[-120px] right-[-180px] w-[780px] h-[780px] bg-gradient-to-bl from-[#4C7F6E]/24 via-emerald-500/22 to-transparent blur-[140px]" />
          <div className="floating-grid opacity-30" />
        </div>

        {/* Content */}
        <div className="relative z-10 pt-20">
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
                      Инфраструктура & Ops
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
                          <Briefcase className="w-6 h-6 text-[#4C7F6E]" />
                        </div>
                        <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          Инфраструктура команды
                        </h3>
                      </div>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} flex-1`}>
                        Antarctic Alpha — это не только трейдеры. Наш успех строится на мощной инфраструктуре: разработчики создают инструменты, аналитики находят возможности, маркетологи продвигают идеи, юристы обеспечивают безопасность. Каждый участник инфраструктуры — важная часть ледокола.
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
                        <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          Твой вклад
                        </h3>
                      </div>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} flex-1`}>
                        Мы ищем профессионалов в разных областях: разработка (Frontend/Backend/Smart Contracts), юридический отдел, аналитика и ресерч, маркетинг и SMM, дизайн, операционная деятельность. Твой скилл поможет команде работать эффективнее и достигать результатов.
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
                          Горизонтальный рост
                        </h3>
                      </div>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} flex-1`}>
                        Мы поддерживаем горизонтальный рост. Если со временем ты захочешь попробовать себя в роли трейдера — дай знать в DM. Мы поможем с переходом. Antarctic Alpha — это место для развития и новых возможностей.
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
                          Давай работать вместе!
                        </h3>
                      </div>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} flex-1`}>
                        Заполни анкету максимально подробно — это твой шанс стать частью Antarctic Alpha. Мы ценим профессионализм, инициативность и желание расти. Если возникнут вопросы, пиши в DM. До встречи в команде!
                      </p>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    onClick={() => navigate('/application')}
                    className={`inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all ${theme === 'dark'
                      ? 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                      : 'bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span>Я трейдер</span>
                  </button>
                  <button
                    onClick={() => setCurrentSection('personal')}
                    className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#4C7F6E] hover:bg-[#4C7F6E]/90 text-white font-black text-lg transition-all shadow-lg shadow-[#4C7F6E]/20 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span>Начать заполнение</span>
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
                    Раздел 1 из 4
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
                  </div>

                  <div className="mt-8 flex justify-between items-center">
                    <button
                      onClick={() => setCurrentSection('welcome')}
                      className={`px-6 py-3 rounded-xl font-bold transition-all ${theme === 'dark' ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      Назад
                    </button>
                    <button
                      onClick={() => setCurrentSection('background')}
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

          {/* Background Section */}
          {currentSection === 'background' && (
            <div className="min-h-[calc(100vh-5rem)] px-6 py-12">
              <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#4C7F6E]/10 text-[#4C7F6E] text-sm font-bold mb-4">
                    <span className="w-2 h-2 rounded-full bg-[#4C7F6E]" />
                    Раздел 2 из 4
                  </div>
                  <h2 className={`text-3xl sm:text-4xl font-black mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Background & Experience
                  </h2>
                  <p className={`text-gray-500 dark:text-gray-400 font-medium leading-relaxed`}>
                    Расскажи о своем опыте работы и образовании. Это поможет нам понять твой профессиональный уровень и найти подходящую роль в команде.
                  </p>
                </div>

                <div className={`rounded-3xl p-8 space-y-8 ${theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-gray-50 border border-gray-200'}`}>
                  {/* Work Experience */}
                  <div className="space-y-4">
                    <label className={`text-lg font-bold block ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>1) Твой опыт работы:</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {workExperienceOptions.map(option => (
                        <button
                          key={option.value}
                          onClick={() => handleInputChange('workExperience', option.value)}
                          className={`p-4 rounded-xl border-2 text-center font-bold transition-all ${formData.workExperience === option.value ? 'border-[#4C7F6E] bg-[#4C7F6E]/10 text-[#4C7F6E]' : theme === 'dark' ? 'border-white/10 bg-white/5 text-white hover:border-white/20' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Education */}
                  <div className="space-y-4">
                    <label className={`text-lg font-bold block ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>2) Твое образование:</label>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Укажи вуз, специальность и год окончания. Если есть дополнительное образование, курсы или сертификаты — расскажи о них.
                    </p>
                    <textarea
                      value={formData.education}
                      onChange={(e) => handleInputChange('education', e.target.value)}
                      placeholder="МГУ, программирование, 2020..."
                      rows={4}
                      className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 resize-none ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E]'}`}
                    />
                  </div>

                  {/* Previous Projects */}
                  <div className="space-y-4">
                    <label className={`text-lg font-bold block ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>3) Предыдущие проекты:</label>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Расскажи о ключевых проектах, в которых ты участвовал. Укажи свою роль, задачи и достигнутые результаты. Ссылки на портфолио или GitHub приветствуются.
                    </p>
                    <textarea
                      value={formData.previousProjects}
                      onChange={(e) => handleInputChange('previousProjects', e.target.value)}
                      placeholder="Проект 1: Разработка сайта... Проект 2: SMM-стратегия..."
                      rows={4}
                      className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 resize-none ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E]'}`}
                    />
                  </div>

                  <div className="mt-8 flex justify-between items-center pt-6 border-t border-white/10">
                    <button
                      onClick={() => setCurrentSection('personal')}
                      className={`px-6 py-3 rounded-xl font-bold transition-all ${theme === 'dark' ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      Назад
                    </button>
                    <button
                      onClick={() => setCurrentSection('specialization')}
                      disabled={!isBackgroundValid()}
                      className={`inline-flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all ${isBackgroundValid() ? 'bg-[#4C7F6E] hover:bg-[#4C7F6E]/90 text-white shadow-lg shadow-[#4C7F6E]/20 hover:scale-[1.02]' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                    >
                      <span>Двигаюсь дальше</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Specialization Section */}
          {currentSection === 'specialization' && (
            <div className="min-h-[calc(100vh-5rem)] px-6 py-12">
              <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#4C7F6E]/10 text-[#4C7F6E] text-sm font-bold mb-4">
                    <span className="w-2 h-2 rounded-full bg-[#4C7F6E]" />
                    Раздел 3 из 4
                  </div>
                  <h2 className={`text-3xl sm:text-4xl font-black mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Специализация
                  </h2>
                  <p className={`text-gray-500 dark:text-gray-400 font-medium leading-relaxed`}>
                    Выбери область, в которой ты хочешь работать. Можно выбрать несколько направлений, если ты универсальный специалист.
                  </p>
                </div>

                <div className={`rounded-3xl p-8 space-y-8 ${theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-gray-50 border border-gray-200'}`}>
                  {/* Specialization Options */}
                  <div className="space-y-4">
                    <label className={`text-lg font-bold block ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Выбери свою специализацию:</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {specializationOptions.map(option => {
                        const Icon = option.icon
                        return (
                          <button
                            key={option.value}
                            onClick={() => handleInputChange('specialization', option.value)}
                            className={`p-6 rounded-xl border-2 text-left transition-all ${formData.specialization === option.value ? 'border-[#4C7F6E] bg-[#4C7F6E]/10' : theme === 'dark' ? 'border-white/10 bg-white/5 hover:border-white/20' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                          >
                            <div className="flex items-start gap-4">
                              <div className={`p-3 rounded-xl ${formData.specialization === option.value ? 'bg-[#4C7F6E]/20' : theme === 'dark' ? 'bg-white/10' : 'bg-gray-100'}`}>
                                <Icon className={`w-6 h-6 ${formData.specialization === option.value ? 'text-[#4C7F6E]' : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                              </div>
                              <div className="flex-1">
                                <h3 className={`font-bold mb-1 ${formData.specialization === option.value ? 'text-[#4C7F6E]' : theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                  {option.label}
                                </h3>
                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                  {option.description}
                                </p>
                              </div>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div className="mt-8 flex justify-between items-center pt-6 border-t border-white/10">
                    <button
                      onClick={() => setCurrentSection('background')}
                      className={`px-6 py-3 rounded-xl font-bold transition-all ${theme === 'dark' ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      Назад
                    </button>
                    <button
                      onClick={() => setCurrentSection('experience')}
                      disabled={!isSpecializationValid()}
                      className={`inline-flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all ${isSpecializationValid() ? 'bg-[#4C7F6E] hover:bg-[#4C7F6E]/90 text-white shadow-lg shadow-[#4C7F6E]/20 hover:scale-[1.02]' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                    >
                      <span>Двигаюсь дальше</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Experience Section */}
          {currentSection === 'experience' && (
            <div className="min-h-[calc(100vh-5rem)] px-6 py-12">
              <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#4C7F6E]/10 text-[#4C7F6E] text-sm font-bold mb-4">
                    <span className="w-2 h-2 rounded-full bg-[#4C7F6E]" />
                    Раздел 4 из 4
                  </div>
                  <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Твой Hard Skill & Опыт
                  </h2>
                  <p className={`text-gray-500 dark:text-gray-400 font-medium leading-relaxed`}>
                    Расскажи о своих ключевых навыках, лучшем проекте и уроках. Это поможет нам понять твой профессиональный уровень.
                  </p>
                </div>

                <div className={`rounded-3xl p-8 space-y-8 ${theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-gray-50 border border-gray-200'}`}>
                  {/* Hard Skill */}
                  <div className="space-y-4">
                    <label className={`text-lg font-bold block ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>1) Твой Hard Skill & Суперсила:</label>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      В чем твоя ключевая экспертиза? Какие технологии, инструменты или методологии ты используешь лучше всего? Расскажи о своей суперсиле.
                    </p>
                    <textarea
                      value={formData.hardSkill}
                      onChange={(e) => handleInputChange('hardSkill', e.target.value)}
                      placeholder="Я специализируюсь на React и TypeScript, имею опыт с Next.js..."
                      rows={4}
                      className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 resize-none ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E]'}`}
                    />
                  </div>

                  {/* Golden Case */}
                  <div className="space-y-4">
                    <label className={`text-lg font-bold block ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>2) Твой Golden Case:</label>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Расскажи о своем лучшем проекте или кейсе. Что было сделано, какие проблемы решены, какой результат достигнут?
                    </p>
                    <textarea
                      value={formData.goldenCase}
                      onChange={(e) => handleInputChange('goldenCase', e.target.value)}
                      placeholder="Мой лучший проект — разработка..."
                      rows={4}
                      className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 resize-none ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E]'}`}
                    />
                    <p className={`text-sm font-bold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Подтверждение (Proof of Work):</p>
                    <input
                      type="url"
                      value={formData.goldenCaseLinks}
                      onChange={(e) => handleInputChange('goldenCaseLinks', e.target.value)}
                      placeholder="Ссылка на проект, GitHub, портфолио..."
                      className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E]'}`}
                    />
                  </div>

                  {/* Biggest Fail */}
                  <div className="space-y-4">
                    <label className={`text-lg font-bold block ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>3) Твой самый большой провал:</label>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Опиши ситуацию, где что-то пошло не так. Как ты справился с проблемой? Чему научился? Мы ценим честность и способность извлекать уроки.
                    </p>
                    <textarea
                      value={formData.biggestFail}
                      onChange={(e) => handleInputChange('biggestFail', e.target.value)}
                      placeholder="Однажды я допустил ошибку..."
                      rows={4}
                      className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 resize-none ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E]'}`}
                    />
                  </div>

                  {/* Toolkit */}
                  <div className="space-y-4">
                    <label className={`text-lg font-bold block ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>4) Твой Toolkit:</label>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Перечисли инструменты, которые ты используешь в своей работе: IDE, софт, фреймворки, библиотеки и т.д.
                    </p>
                    <textarea
                      value={formData.toolkit}
                      onChange={(e) => handleInputChange('toolkit', e.target.value)}
                      placeholder="VS Code, Figma, GitHub, Jira, Notion..."
                      rows={4}
                      className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 resize-none ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E]'}`}
                    />
                  </div>

                  {/* Engagement */}
                  <div className="space-y-4">
                    <label className={`text-lg font-bold block ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>5) Твоя вовлеченность (Engagement):</label>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Сколько времени ты готов или готова инвестировать в развитие команды ежедневно?
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {engagementOptions.map(option => (
                        <button
                          key={option.value}
                          onClick={() => handleInputChange('engagement', option.value)}
                          className={`p-4 rounded-xl border-2 text-center font-bold transition-all ${formData.engagement === option.value ? 'border-[#4C7F6E] bg-[#4C7F6E]/10 text-[#4C7F6E]' : theme === 'dark' ? 'border-white/10 bg-white/5 text-white hover:border-white/20' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Trading Interest */}
                  <div className="space-y-4">
                    <label className={`text-lg font-bold block ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>6) Интерес к трейдингу:</label>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Интересуешься ли ты трейдингом? Хотел(а) бы научиться или планируешь совмещать с основной деятельностью?
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {tradingInterestOptions.map(option => (
                        <button
                          key={option.value}
                          onClick={() => handleInputChange('tradingInterest', option.value)}
                          className={`p-4 rounded-xl border-2 text-left font-bold transition-all ${formData.tradingInterest === option.value ? 'border-[#4C7F6E] bg-[#4C7F6E]/10 text-[#4C7F6E]' : theme === 'dark' ? 'border-white/10 bg-white/5 text-white hover:border-white/20' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 flex justify-between items-center pt-6 border-t border-white/10">
                    <button
                      onClick={() => setCurrentSection('specialization')}
                      className={`px-6 py-3 rounded-xl font-bold transition-all ${theme === 'dark' ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      Назад
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={!isExperienceValid()}
                      className={`inline-flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all ${isExperienceValid() ? 'bg-[#4C7F6E] hover:bg-[#4C7F6E]/90 text-white shadow-lg shadow-[#4C7F6E]/20 hover:scale-[1.02]' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
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
                        <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Специализация:</span>
                        <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{getSpecializationLabel(formData.specialization)}</span>
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
