import { useState, useEffect } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { getReferrals, addReferral, addApprovalRequest, spendPoints, getApprovalRequests, deleteApprovalRequest, getPointsBalance, onPointsTransactionsChange, onUserApprovalRequestsChange, getEarnings, getPoolContributions, getAllUsers } from '@/services/firestoreService'
import { Referral, PointsBenefitType, ApprovalRequest, PointsExchangeRequest, Earnings, PoolContribution } from '@/types'
import { useAuthStore } from '@/store/authStore'
import { useAccessControl } from '@/hooks/useAccessControl'
import { 
  Users, 
  Trophy, 
  Shield, 
  Zap, 
  CheckCircle2,
  Plus,
  X,
  Clock,
  DollarSign,
  Activity,
  Calendar,
  MessageCircle,
  Phone,
  Mail,
  User,
  Hash,
  Ban,
  HelpCircle,
  TrendingUp,
  Trash2,
  ChevronDown,
  ChevronUp,
  Gift,
  UserPlus,
  Percent,
  CalendarDays,
  Copy,
  Link2
} from 'lucide-react'

// Типы статусов реферала
type ReferralStatus = 'pending' | 'confirmed' | 'active' | 'inactive' | 'excluded' | 'not_counted'

// Конфигурация статусов
const STATUS_CONFIG: Record<ReferralStatus, { label: string; color: string; bgColor: string; icon: any }> = {
  pending: { 
    label: 'На рассмотрении', 
    color: 'text-amber-500', 
    bgColor: 'bg-amber-500/20',
    icon: Clock 
  },
  confirmed: { 
    label: 'Подтверждён', 
    color: 'text-green-500', 
    bgColor: 'bg-green-500/20',
    icon: CheckCircle2 
  },
  active: { 
    label: 'Активный', 
    color: 'text-emerald-500', 
    bgColor: 'bg-emerald-500/20',
    icon: Activity 
  },
  inactive: { 
    label: 'Неактивный', 
    color: 'text-gray-500', 
    bgColor: 'bg-gray-500/20',
    icon: User 
  },
  excluded: { 
    label: 'Исключён', 
    color: 'text-red-500', 
    bgColor: 'bg-red-500/20',
    icon: Ban 
  },
  not_counted: { 
    label: 'Не зачтён', 
    color: 'text-orange-500', 
    bgColor: 'bg-orange-500/20',
    icon: X 
  },
}

// Типы бонусов для обмена
type BenefitType = PointsBenefitType

interface PointsBenefit {
  points: number
  type: BenefitType
  label: string
  description: string
}

const POINTS_BENEFITS: PointsBenefit[] = [
  { points: 20, type: 'usdt', label: '20 USDT', description: 'Вывод на кошелёк AW' },
  { points: 30, type: 'commission', label: 'Комиссия 10%', description: 'Снижение комиссии пула до 10% на 14 дней' },
  { points: 10, type: 'dayoff', label: 'Доп. выходной/отпуск', description: 'Дополнительный выходной или +1 день к отпуску' },
]

// Модальное окно для добавления реферала
const ReferralModal = ({
  isOpen,
  onClose,
  theme,
  onSave,
  userReferralCode,
  totalReferralsCount
}: {
  isOpen: boolean
  onClose: () => void
  theme: string
  onSave: (data: any) => void
  userReferralCode: string
  totalReferralsCount: number
}) => {
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [messengers, setMessengers] = useState<{ type: 'telegram' | 'vk' | 'discord'; value: string }[]>([
    { type: 'telegram', value: '' },
    { type: 'vk', value: '' },
    { type: 'discord', value: '' }
  ])
  const [source, setSource] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const labelColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
  const inputBg = theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
  
  // Извлекаем часть кода после =
  const codePart = userReferralCode.includes('=') ? userReferralCode.split('=')[1] : userReferralCode
  
  // Генерируем ID реферала
  const generateReferralId = () => {
    const nextNumber = totalReferralsCount + 1
    const namePart = name.trim().split(' ')[0] || 'USER'
    return `${nextNumber}—${namePart.toUpperCase()}—${codePart}`
  }
  
  // Изменить мессенджер
  const updateMessenger = (index: number, value: string) => {
    const updated = [...messengers]
    updated[index].value = value
    setMessengers(updated)
  }
    
  const handleSave = async () => {
    if (!name.trim()) {
      setError('Введите имя реферала')
      return
    }
    
    const hasPhone = phone.trim()
    const allMessengersFilled = messengers.every(m => m.value.trim())
    const telegramFilled = messengers[0]?.value.trim()
    const vkFilled = messengers[1]?.value.trim()
    const discordFilled = messengers[2]?.value.trim()
    
    if (!hasPhone && !allMessengersFilled) {
      setError('Укажите телефон или заполните все три мессенджера (Telegram, VK, Discord)')
      return
    }
    
    if (!telegramFilled || !vkFilled || !discordFilled) {
      setError('Заполните все три мессенджера: Telegram, VK и Discord')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      // Формируем строку мессенджеров
      const messengerString = messengers
        .filter(m => m.value.trim())
        .map(m => `${m.type}:${m.value.trim()}`)
        .join('; ')
      
      const referralData = {
        name: name.trim(),
        age: age.trim(),
        phone: phone.trim(),
        email: email.trim(),
        messenger: messengerString,
        messengerType: messengers[0]?.type || 'telegram',
        source: source.trim(),
        referralCode: userReferralCode,
        referralId: generateReferralId(),
        status: 'pending' as ReferralStatus,
      }
      
      await onSave(referralData)
      onClose()
      // Сброс формы
      setName('')
      setAge('')
      setPhone('')
      setEmail('')
      setMessengers([
        { type: 'telegram', value: '' },
        { type: 'vk', value: '' },
        { type: 'discord', value: '' }
      ])
      setSource('')
    } catch (err: any) {
      setError(err.message || 'Ошибка сохранения')
    } finally {
      setLoading(false)
    }
  }
  
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xl z-50 flex items-start sm:items-center justify-center p-4 overflow-y-auto">
      <div className={`relative w-full max-w-2xl rounded-3xl border p-6 ${
        theme === 'dark' ? 'bg-[#0b1015] border-white/10' : 'bg-white border-gray-200'
      } shadow-2xl mt-10 sm:mt-0 max-h-[90vh] overflow-y-auto`}>
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-lg transition-colors ${
            theme === 'dark' ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
          }`}
        >
          <X className="w-5 h-5" />
        </button>
        
        <h2 className={`text-xl font-black mb-6 ${headingColor}`}>Добавить реферала</h2>
        
        {/* Информационный блок */}
        <div className={`p-4 rounded-xl border mb-6 ${
          theme === 'dark' ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-100'
        }`}>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-blue-500/20 flex-shrink-0">
              <HelpCircle className="w-4 h-4 text-blue-500" />
            </div>
            <div>
              <p className={`text-sm font-medium ${headingColor}`}>Когда нужно добавлять реферала вручную?</p>
              <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Это требуется только в том случае, если ваш реферал <strong>забыл / не указал</strong> реферальный код при отправке заявки на присоедиение к команле. Обрати внимание, что рефералом не может быть человек, который не торгует.
              </p>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          {/* Имя */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${labelColor}`}>
              <User className="w-4 h-4 inline mr-2" />
              Имя реферала *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Иван Иванов"
              className={`w-full px-4 py-3 rounded-xl border ${inputBg} ${
                theme === 'dark' ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'
              } focus:outline-none focus:border-[#4C7F6E] transition-colors`}
            />
          </div>
          
          {/* Возраст */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${labelColor}`}>
              <Hash className="w-4 h-4 inline mr-2" />
              Возраст реферала
            </label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="25"
              min="18"
              max="99"
              className={`w-full px-4 py-3 rounded-xl border ${inputBg} ${
                theme === 'dark' ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'
              } focus:outline-none focus:border-[#4C7F6E] transition-colors`}
            />
          </div>
          
          {/* Телефон */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${labelColor}`}>
              <Phone className="w-4 h-4 inline mr-2" />
              Телефон реферала *
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+7 999 123-45-67"
              className={`w-full px-4 py-3 rounded-xl border ${inputBg} ${
                theme === 'dark' ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'
              } focus:outline-none focus:border-[#4C7F6E] transition-colors`}
            />
          </div>
          
          {/* Email */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${labelColor}`}>
              <Mail className="w-4 h-4 inline mr-2" />
              Email реферала
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              className={`w-full px-4 py-3 rounded-xl border ${inputBg} ${
                theme === 'dark' ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'
              } focus:outline-none focus:border-[#4C7F6E] transition-colors`}
            />
          </div>
          
          {/* Мессенджеры (обязательно) */}
          <div className="space-y-3">
            <label className={`block text-sm font-medium ${labelColor}`}>
              <MessageCircle className="w-4 h-4 inline mr-2" />
              Мессенджеры <span className="text-amber-500">*</span>
            </label>
            
            {/* Telegram */}
            <div className="flex items-center gap-3">
              <div className={`w-24 px-3 py-3 rounded-xl border ${inputBg} text-center ${
                theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
              } font-medium text-sm`}>
                Telegram
              </div>
              <input
                type="text"
                value={messengers[0]?.value || ''}
                onChange={(e) => updateMessenger(0, e.target.value)}
                placeholder="@username"
                className={`flex-1 px-4 py-3 rounded-xl border ${inputBg} ${
                  theme === 'dark' ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'
                } focus:outline-none focus:border-[#4C7F6E] transition-colors`}
              />
            </div>
            
            {/* VK */}
            <div className="flex items-center gap-3">
              <div className={`w-24 px-3 py-3 rounded-xl border ${inputBg} text-center ${
                theme === 'dark' ? 'text-blue-500' : 'text-blue-700'
              } font-medium text-sm`}>
                VK
              </div>
              <input
                type="text"
                value={messengers[1]?.value || ''}
                onChange={(e) => updateMessenger(1, e.target.value)}
                placeholder="Ссылка на профиль"
                className={`flex-1 px-4 py-3 rounded-xl border ${inputBg} ${
                  theme === 'dark' ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'
                } focus:outline-none focus:border-[#4C7F6E] transition-colors`}
              />
            </div>
            
            {/* Discord */}
            <div className="flex items-center gap-3">
              <div className={`w-24 px-3 py-3 rounded-xl border ${inputBg} text-center ${
                theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
              } font-medium text-sm`}>
                Discord
              </div>
              <input
                type="text"
                value={messengers[2]?.value || ''}
                onChange={(e) => updateMessenger(2, e.target.value)}
                placeholder="username#0000 или ссылка"
                className={`flex-1 px-4 py-3 rounded-xl border ${inputBg} ${
                  theme === 'dark' ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'
                } focus:outline-none focus:border-[#4C7F6E] transition-colors`}
              />
            </div>
            
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
              Все три мессенджера обязательны для заполнения
            </p>
          </div>
          
          {/* Источник */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${labelColor}`}>
              <Zap className="w-4 h-4 inline mr-2" />
              Источник (откуда приглашён)
            </label>
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="Instagram, Telegram, по рекомендации и т.д."
              className={`w-full px-4 py-3 rounded-xl border ${inputBg} ${
                theme === 'dark' ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'
              } focus:outline-none focus:border-[#4C7F6E] transition-colors`}
            />
          </div>
          
          {/* Код (автоматически) */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${labelColor}`}>
              <Hash className="w-4 h-4 inline mr-2" />
              Реферальный код
            </label>
            <input
              type="text"
              value={userReferralCode}
              disabled
              className={`w-full px-4 py-3 rounded-xl border ${inputBg} ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              } font-mono cursor-not-allowed`}
            />
            <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
              Код заполняется автоматически из вашего профиля
            </p>
          </div>
          
          {/* ID реферала (предпросмотр) */}
          {name && (
            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-[#4C7F6E]/10' : 'bg-[#4C7F6E]/5'}`}>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>ID реферала:</p>
              <p className={`font-mono font-bold ${theme === 'dark' ? 'text-[#4C7F6E]' : 'text-[#4C7F6E]'}`}>
                {generateReferralId()}
              </p>
            </div>
          )}
          
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
        </div>
        
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className={`flex-1 px-4 py-3 rounded-xl font-medium transition-colors ${
              theme === 'dark' 
                ? 'bg-white/5 hover:bg-white/10 text-gray-300' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            Отмена
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-xl font-medium transition-colors disabled:opacity-50"
            style={{ backgroundColor: '#4C7F6E' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3d6a5e'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4C7F6E'}
          >
            {loading ? 'Сохранение...' : 'Добавить'}
          </button>
        </div>
      </div>
    </div>
  )
}

// Модальное окно для обмена баллов
const ExchangePointsModal = ({
  isOpen,
  onClose,
  theme,
  currentPoints,
  onExchange
}: {
  isOpen: boolean
  onClose: () => void
  theme: string
  currentPoints: number
  onExchange: (data: any) => Promise<void>
}) => {
  const [pointsInput, setPointsInput] = useState('')
  const [selectedBenefit, setSelectedBenefit] = useState<PointsBenefitType | null>(null)
  const [walletAddress, setWalletAddress] = useState('')
  const [walletNetwork, setWalletNetwork] = useState<'ton' | 'trc20'>('ton')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [dayoffType, setDayoffType] = useState<'dayoff' | 'vacation'>('dayoff')
  const [dayoffDate, setDayoffDate] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const labelColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
  const inputBg = theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
  
  const parsedPoints = parseInt(pointsInput) || 0
  const selectedBenefitData = POINTS_BENEFITS.find(b => b.type === selectedBenefit)
  
  const handleExchange = async () => {
    setError('')
    
    // Проверка баллов
    if (!pointsInput.trim()) {
      setError('Укажите количество баллов')
      return
    }
    
    if (isNaN(parsedPoints) || parsedPoints <= 0) {
      setError('Количество баллов должно быть положительным числом')
      return
    }
    
    if (parsedPoints % 10 !== 0) {
      setError('Количество баллов должно быть кратно 10')
      return
    }
    
    if (parsedPoints > currentPoints) {
      setError(`У вас недостаточно баллов. Доступно: ${currentPoints} баллов`)
      return
    }
    
    if (!selectedBenefit) {
      setError('Выберите преимущество')
      return
    }
    
    if (parsedPoints < (selectedBenefitData?.points || 0)) {
      setError(`Для этого преимущества нужно минимум ${selectedBenefitData?.points} баллов`)
      return
    }
    
    if (selectedBenefit === 'usdt' && !walletAddress.trim()) {
      setError('Укажите адрес кошелька AW')
      return
    }
    
    if (selectedBenefit === 'commission' && (!dateRange.start || !dateRange.end)) {
      setError('Укажите даты периода')
      return
    }
    
    if (selectedBenefit === 'dayoff' && !dayoffDate) {
      setError('Укажите желаемую дату')
      return
    }
    
    setLoading(true)
    try {
      await onExchange({
        points: parsedPoints,
        type: selectedBenefit,
        walletAddress: selectedBenefit === 'usdt' ? walletAddress : undefined,
        walletNetwork: selectedBenefit === 'usdt' ? walletNetwork : undefined,
        dateRange: selectedBenefit === 'commission' ? dateRange : undefined,
        dayoffType: selectedBenefit === 'dayoff' ? dayoffType : undefined,
        dayoffDate: selectedBenefit === 'dayoff' ? dayoffDate : undefined,
      })
      // Сброс формы
      setPointsInput('')
      setSelectedBenefit(null)
      setWalletAddress('')
      setDateRange({ start: '', end: '' })
      setDayoffDate('')
      onClose()
    } catch (err: any) {
      setError(err.message || 'Ошибка обмена')
    } finally {
      setLoading(false)
    }
  }
  
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xl z-50 flex items-start sm:items-center justify-center p-4 overflow-y-auto">
      <div className={`relative w-full max-w-lg rounded-3xl border p-6 ${
        theme === 'dark' ? 'bg-[#0b1015] border-white/10' : 'bg-white border-gray-200'
      } shadow-2xl mt-10 sm:mt-0`}>
        <button 
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-lg transition-colors ${
            theme === 'dark' ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
          }`}
        >
          <X className="w-5 h-5" />
        </button>
        
        <h2 className={`text-xl font-black mb-2 ${headingColor}`}>Обменять баллы</h2>
        <p className={`text-sm mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          Ваш баланс: <span className="font-bold" style={{ color: '#4C7F6E' }}>{currentPoints} баллов</span>
        </p>
        
        <div className="space-y-4">
          {/* Ввод количества баллов вручную */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${labelColor}`}>Количество баллов *</label>
            <input
              type="number"
              value={pointsInput}
              onChange={(e) => setPointsInput(e.target.value)}
              placeholder="Введите количество (кратно 10)"
              step="10"
              min="10"
              max={currentPoints}
              className={`w-full px-4 py-3 rounded-xl border ${inputBg} ${
                theme === 'dark' ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'
              } focus:outline-none focus:border-[#4C7F6E] transition-colors`}
            />
            <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
              Шаг: 10 баллов. Доступно: {currentPoints} баллов
            </p>
          </div>
          
          {/* Выбор преимущества */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${labelColor}`}>Преимущество</label>
            <div className="space-y-2">
              {POINTS_BENEFITS.map((benefit) => {
                const minPoints = benefit.points
                const canAfford = parsedPoints >= minPoints && parsedPoints <= currentPoints
                return (
                  <button
                    key={benefit.type}
                    type="button"
                    onClick={() => setSelectedBenefit(benefit.type)}
                    className={`w-full p-3 rounded-xl border text-left transition-all ${
                      selectedBenefit === benefit.type
                        ? 'border-[#4C7F6E] bg-[#4C7F6E]/10'
                        : theme === 'dark' ? 'border-white/10 hover:border-white/20' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`font-bold ${headingColor}`}>{benefit.label}</p>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{benefit.description}</p>
                      </div>
                      <span className={`text-sm font-bold ${canAfford || !pointsInput ? '' : 'text-gray-500'}`}
                        style={{ color: canAfford || !pointsInput ? '#4C7F6E' : undefined }}>
                        от {benefit.points} баллов
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
          
          {/* Дополнительные поля для USDT */}
          {selectedBenefit === 'usdt' && (
            <div className="space-y-3">
              <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-amber-500/10' : 'bg-amber-50'}`}>
                <p className={`text-xs ${theme === 'dark' ? 'text-amber-400' : 'text-amber-600'}`}>
                  ⚠️ Обратите внимание: комиссия составит 0.5 USDT (TON) или 2.5 USDT (TRC-20). 
                  На другие кошельки, кроме Antarctic Wallet, выплаты не осуществляются.
                </p>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${labelColor}`}>Сеть</label>
                <select
                  value={walletNetwork}
                  onChange={(e) => setWalletNetwork(e.target.value as 'ton' | 'trc20')}
                  className={`w-full px-4 py-3 rounded-xl border ${inputBg} ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  } focus:outline-none focus:border-[#4C7F6E] transition-colors`}
                >
                  <option value="ton">TON (комиссия 0.5 USDT)</option>
                  <option value="trc20">TRC-20 (комиссия 2.5 USDT)</option>
                </select>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${labelColor}`}>Адрес кошелька AW</label>
                <input
                  type="text"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  placeholder="Введите адрес кошелька Antarctic Wallet"
                  className={`w-full px-4 py-3 rounded-xl border ${inputBg} ${
                    theme === 'dark' ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'
                  } focus:outline-none focus:border-[#4C7F6E] transition-colors`}
                />
              </div>
            </div>
          )}
          
          {/* Дополнительные поля для снижения комиссии */}
          {selectedBenefit === 'commission' && (
            <div className="space-y-3">
              <div>
                <label className={`block text-sm font-medium mb-2 ${labelColor}`}>Период снижения комиссии</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                    className={`px-4 py-3 rounded-xl border ${inputBg} ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    } focus:outline-none focus:border-[#4C7F6E] transition-colors`}
                  />
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                    className={`px-4 py-3 rounded-xl border ${inputBg} ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    } focus:outline-none focus:border-[#4C7F6E] transition-colors`}
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Дополнительные поля для выходного/отпуска */}
          {selectedBenefit === 'dayoff' && (
            <div className="space-y-3">
              <div>
                <label className={`block text-sm font-medium mb-2 ${labelColor}`}>Тип</label>
                <select
                  value={dayoffType}
                  onChange={(e) => setDayoffType(e.target.value as 'dayoff' | 'vacation')}
                  className={`w-full px-4 py-3 rounded-xl border ${inputBg} ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  } focus:outline-none focus:border-[#4C7F6E] transition-colors`}
                >
                  <option value="dayoff">Дополнительный выходной</option>
                  <option value="vacation">+1 день к отпуску</option>
                </select>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${labelColor}`}>Желаемая дата</label>
                <input
                  type="date"
                  value={dayoffDate}
                  onChange={(e) => setDayoffDate(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border ${inputBg} ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  } focus:outline-none focus:border-[#4C7F6E] transition-colors`}
                />
              </div>
            </div>
          )}
          
          {/* Предупреждение */}
          <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-[#4C7F6E]/10 border border-[#4C7F6E]/20' : 'bg-[#4C7F6E]/10 border border-[#4C7F6E]/20'}`}>
            <p className={`text-xs ${theme === 'dark' ? 'text-white/90' : 'text-gray-700'}`}>
              ⚠️ Возврат баллов невозможен после отправки заявки. Обмен или замена преимуществ не производится. 
              DM вправе отклонить заявку с возвратом баллов или со снижением до 50% от уплаченной суммы.
            </p>
          </div>
          
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
        </div>
        
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className={`flex-1 px-4 py-3 rounded-xl font-medium transition-colors ${
              theme === 'dark' 
                ? 'bg-white/5 hover:bg-white/10 text-gray-300' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            Отмена
          </button>
          <button
            onClick={handleExchange}
            disabled={loading || !pointsInput || !selectedBenefit}
            className="flex-1 px-4 py-3 rounded-xl font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#4C7F6E' }}
          >
            {loading ? 'Отправка...' : 'Обменять'}
          </button>
        </div>
      </div>
    </div>
  )
}

export const Referrals = () => {
  const { theme } = useThemeStore()
  const { user } = useAuthStore()
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [myRequests, setMyRequests] = useState<ApprovalRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [exchangeModalOpen, setExchangeModalOpen] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [pointsBalance, setPointsBalance] = useState(0)
  const [now, setNow] = useState(new Date())
  const [earnings, setEarnings] = useState<Earnings[]>([])
  const [poolContributions, setPoolContributions] = useState<PoolContribution[]>([])
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null)
  const [userNickname, setUserNickname] = useState('')
  
  // Загружаем актуальный никнейм из Firestore (ищем в users по userId)
  useEffect(() => {
    const loadNickname = async () => {
      if (user?.id) {
        try {
          const allUsers = await getAllUsers()
          const currentUser = allUsers.find(u => u.id === user.id)
          if (currentUser?.nickname) {
            setUserNickname(currentUser.nickname)
          }
        } catch (error) {
          console.error('Error loading nickname:', error)
        }
      }
    }
    loadNickname()
  }, [user?.id])
  
  // FAQ по реферальной программе
  const faqItems = [
    {
      question: 'Как работает реферальная программа?',
      answer: 'Вы приглашаете новых участников в команду, используя свой реферальный код. Когда реферал становится активным (выполняет KPI и работает в команде), вы получаете 10 баллов за каждого активного реферала. Баллы можно обменять на реальные бонусы: USDT, снижение комиссии пула или дополнительный выходной.',
      icon: UserPlus
    },
    {
      question: 'Сколько баллов я получаю за реферала?',
      answer: 'За каждого активного реферала начисляется 10 баллов. Реферал считается активным, когда он начинает работать в команде и выполняет все KPI. Баллы начисляются автоматически после подтверждения статуса "Активный" DM.',
      icon: Gift
    },
    {
      question: 'Какие бонусы можно получить за баллы?',
      answer: 'За баллы доступны следующие бонусы:\n\n• 20 баллов — 20 USDT (вывод на кошелёк AW)\n• 30 баллов — снижение комиссии пула до 10% на 14 дней\n• 10 баллов — дополнительный выходной или +1 день к отпуску\n\nМинимальная сумма для обмена — 10 баллов, шаг — 10 баллов.',
      icon: Percent
    },
    {
      question: 'Можно ли приглашать уже существующих участников?',
      answer: 'Нет, запрещено приглашать людей, которые уже являются участниками команды, а еще тех, кто был исключён. Такие рефералы не будут засчитаны, а пригласивший может получить санкции. Приглашайте только новых людей, которые ещё не состоят в команде.',
      icon: Shield
    },
    {
      question: 'Что делать, если реферал перестал быть активным?',
      answer: 'Если ваш реферал становится неактивным (прекращает выполнять KPI или выходит из команды), с вашего баланса могут быть списаны ранее начисленные баллы. Также к пригласившему могут применяться санкции при систематической неактивности рефералов. Старайтесь приглашать ответственных людей, которые готовы работать в команде долгосрочно.',
      icon: Activity
    },
    {
      question: 'Как обменять баллы на бонусы?',
      answer: 'Для обмена баллов нажмите кнопку "Обменять" в разделе "Система баллов". Выберите количество баллов (кратно 10) и желаемый бонус. После отправки заявки ожидайте решения DM. При одобрении бонус будет зачислен автоматически. Возврат баллов после отправки заявки невозможен, за исключением решений DM.',
      icon: CalendarDays
    }
  ]

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index)
  }
  
  // Access Control
  const pageAccess = useAccessControl('arca_referrals')
  
  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const subTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
  
  // Toast auto-hide
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [toast])
  
  // Обновление времени каждую секунду для таймера
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])
  
  // Формируем реферальный код на основе загруженного ника (без изменения регистра)
  const userReferralCode = userNickname ? `ref-ARCATEAM=${userNickname}` : 'ref-ARCATEAM=USER'
  
  // Рефералы текущего пользователя
  const myReferrals = user ? referrals.filter(r => r.ownerId === user.id) : []
  
  // Общее количество рефералов (для генерации ID)
  const totalReferralsCount = referrals.length
  
  // Функция для получения статистики реферала
  const getReferralStats = (referral: Referral) => {
    // Если у реферала нет linked userId, возвращаем заглушки
    if (!referral.userId) {
      return {
        totalEarnings: 0,
        totalPoolContributions: 0,
        myEarnings: 0,
        daysInSystem: 0,
        earningsCount: 0
      }
    }
    
    // Дни в системе
    const createdDate = new Date(referral.createdAt)
    const nowDate = new Date()
    const daysInSystem = Math.floor((nowDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24))
    
    // Получаем заработки реферала (только одобренные)
    const referralEarnings = earnings.filter(e => e.userId === referral.userId && (e.status === 'approved' || !e.status))
    const totalEarnings = referralEarnings.reduce((sum, e) => sum + e.amount, 0)
    const earningsCount = referralEarnings.length
    
    // Получаем взносы в пул реферала
    const referralPoolContributions = poolContributions.filter(p => p.addedBy === referral.userId)
    const totalPoolContributions = referralPoolContributions.reduce((sum, p) => sum + p.amount, 0)
    
    // Расчёт "Мой заработок" (25% от пула, если выполнены условия)
    // Условия: >30 дней в системе, >=20 заявок по доходу, сумма в пуле >12000
    let myEarnings = 0
    if (daysInSystem > 30 && earningsCount >= 20 && totalPoolContributions > 12000) {
      myEarnings = Math.floor(totalPoolContributions * 0.25)
    }
    
    return {
      totalEarnings,
      totalPoolContributions,
      myEarnings,
      daysInSystem,
      earningsCount
    }
  }
  
  // Форматирование суммы
  const formatAmount = (amount: number) => {
    if (amount === 0) return '—'
    return `${amount.toLocaleString('ru-RU')} ₽`
  }
  
  useEffect(() => {
    loadData()
  }, [])
  
  // Подписка на изменения баллов
  useEffect(() => {
    if (!user?.id) return
    
    const unsubscribe = onPointsTransactionsChange(user.id, (balance) => {
      setPointsBalance(balance)
    })
    
    return () => unsubscribe()
  }, [user?.id])
  
  // Подписка на изменения заявок
  useEffect(() => {
    if (!user?.id) return
    
    const unsubscribe = onUserApprovalRequestsChange(user.id, (requests) => {
      // Фильтруем заявки на обмен баллов
      const userRequests = requests.filter(r => 
        r.entity === 'points_exchange' && 
        r.authorId === user.id
      )
      setMyRequests(userRequests)
    })
    
    return () => unsubscribe()
  }, [user?.id])
  
  const loadData = async () => {
    setLoading(true)
    try {
      const [referralsData, allRequests, earningsData, poolData] = await Promise.all([
        getReferrals(),
        getApprovalRequests(undefined, user?.id),
        getEarnings(),
        getPoolContributions()
      ])
      setReferrals(referralsData)
      setEarnings(earningsData)
      setPoolContributions(poolData)
      
      // Фильтруем заявки пользователя на обмен баллов (исключаем удалённые пользователем)
      const userRequests = allRequests.filter(r => 
        r.entity === 'points_exchange' && 
        r.authorId === user?.id &&
        !(r as any).deletedByUser
      )
      setMyRequests(userRequests)
      
      // Загружаем баланс баллов из БД
      if (user?.id) {
        const balance = await getPointsBalance(user.id)
        setPointsBalance(balance)
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }
  
  // Удаление заявки (пользователь может только скрыть её)
  const handleDeleteRequest = async (requestId: string) => {
    if (!confirm('Скрыть заявку из истории? Она будет удалена только для вас.')) return
    try {
      // Мягкое удаление - скрываем только для пользователя
      await deleteApprovalRequest(requestId, true)
      setMyRequests(prev => prev.filter(r => r.id !== requestId))
    } catch (error) {
      console.error('Error deleting request:', error)
      alert('Ошибка при удалении заявки')
    }
  }
  
  // Функция для расчёта оставшегося времени до автоудаления (48 часов)
  const getTimeRemaining = (processedAt: string): { hours: number; minutes: number; seconds: number; expired: boolean } => {
    const processed = new Date(processedAt)
    const deleteAt = new Date(processed)
    deleteAt.setHours(deleteAt.getHours() + 48)
    
    const diff = deleteAt.getTime() - now.getTime()
    
    if (diff <= 0) {
      return { hours: 0, minutes: 0, seconds: 0, expired: true }
    }
    
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)
    
    return { hours, minutes, seconds, expired: false }
  }
  
  const handleAddReferral = async (data: any) => {
    try {
      const referralData = {
        ...data,
        ownerId: user?.id,
        ownerName: user?.name || user?.id,
        createdAt: new Date().toISOString(),
      }
      console.log('Saving referral:', referralData)
      await addReferral(referralData)
      await loadData()
    } catch (error) {
      console.error('Error adding referral:', error)
      throw error
    }
  }
  
  const handleExchangePoints = async (data: any) => {
    if (!user) return
    
    try {
      // Создаем заявку на обмен баллов (фильтруем undefined значения)
      const exchangeRequest: any = {
        userId: user.id,
        userName: user.name,
        points: data.points,
        benefitType: data.type,
        status: 'pending',
        createdAt: new Date().toISOString(),
      }
      
      // Добавляем дополнительные поля только если они есть
      if (data.walletAddress) exchangeRequest.walletAddress = data.walletAddress
      if (data.walletNetwork) exchangeRequest.walletNetwork = data.walletNetwork
      if (data.dateRange) exchangeRequest.dateRange = data.dateRange
      if (data.dayoffType) exchangeRequest.dayoffType = data.dayoffType
      if (data.dayoffDate) exchangeRequest.dayoffDate = data.dayoffDate
      
      // Создаем approval request
      const approvalResult = await addApprovalRequest({
        entity: 'points_exchange',
        action: 'create',
        authorId: user.id,
        targetUserId: user.id,
        after: exchangeRequest,
        comment: `Обмен ${data.points} баллов на ${POINTS_BENEFITS.find(b => b.type === data.type)?.label || data.type}`,
      })
      
      // Списываем баллы
      await spendPoints(user.id, data.points, approvalResult.id, user.name)
      
      console.log('Points exchange request created:', approvalResult.id)
      
      // Показываем красивое уведомление
      setToast({
        message: `Заявка на обмен ${data.points} баллов отправлена! Ожидайте решения DM.`,
        type: 'success'
      })
      
      // Закрываем модальное окно
      setExchangeModalOpen(false)
    } catch (error) {
      console.error('Error exchanging points:', error)
      setToast({
        message: 'Ошибка при отправке заявки. Попробуйте ещё раз.',
        type: 'error'
      })
      throw error
    }
  }
  
  if (loading || pageAccess.loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#4C7F6E]/20 border-t-[#4C7F6E]"></div>
      </div>
    )
  }
  
  if (!pageAccess.hasAccess) {
    return (
      <div className="py-20 text-center space-y-4">
        <Shield className="w-16 h-16 text-gray-700 mx-auto opacity-20" />
        <h3 className={`text-xl font-black ${headingColor}`}>Доступ ограничен</h3>
        <p className="text-gray-500 max-w-md mx-auto">{pageAccess.reason || 'У вас нет доступа к разделу рефералов.'}</p>
      </div>
    )
  }
      
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="absolute inset-0 bg-[#4C7F6E]/20 blur-2xl rounded-full" />
            <div className={`relative p-4 rounded-2xl border ${
              theme === 'dark' 
                ? 'bg-[#4C7F6E]/10 border-[#4C7F6E]/20 text-[#4C7F6E]' 
                : 'bg-[#4C7F6E]/10 border-[#4C7F6E]/20 text-[#4C7F6E] shadow-sm'
            }`}>
              <Users className="w-8 h-8" />
            </div>
          </div>
          <div>
            <h1 className={`text-3xl md:text-4xl font-black tracking-tight ${headingColor}`}>
              Invite & Earn
            </h1>
            <p className={`text-sm font-medium ${subTextColor}`}>
              Система приглашений и бонусов
            </p>
          </div>
        </div>
        
        <button
          onClick={() => setModalOpen(true)}
          className="w-12 h-12 rounded-xl text-white font-bold transition-all shadow-lg flex items-center justify-center"
          style={{ backgroundColor: '#4C7F6E' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3d6a5e'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4C7F6E'}
          title="Добавить реферала"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>
      
      {/* Рефералка */}
      <div className={`rounded-3xl p-6 border ${
        theme === 'dark' 
          ? 'bg-[#0b1015] border-white/5' 
          : 'bg-white border-gray-100'
      } shadow-xl`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-[#4C7F6E]/10 rounded-xl">
            <Link2 className="w-5 h-5 text-[#4C7F6E]" />
          </div>
          <div>
            <h3 className={`text-lg font-black ${headingColor}`}>Рефералка</h3>
            <p className={`text-xs ${subTextColor}`}>Поделись ссылкой и получи бонусы</p>
          </div>
        </div>
        
        <div className={`p-5 rounded-2xl border ${
          theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
        }`}>
          <p className={`text-sm font-medium mb-3 ${headingColor}`}>
            Твоя реферальная ссылка:
          </p>
          <div className="flex items-center gap-2">
            <div 
              onClick={() => {
                navigator.clipboard.writeText(`https://antarctic-alpha-team.vercel.app/application?ref=${userNickname}`)
                setToast({ message: 'Ссылка скопирована!', type: 'success' })
              }}
              className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                theme === 'dark' ? 'bg-black/20 border-white/10 hover:border-[#4C7F6E]/50' : 'bg-white border-gray-200 hover:border-[#4C7F6E]'
              }`}
              title="Нажать для копирования"
            >
              <Link2 className={`w-4 h-4 flex-shrink-0 ${subTextColor}`} />
              <span className={`text-sm font-mono truncate flex-1 ${subTextColor}`}>
                https://antarctic-alpha-team.vercel.app/application?ref={userNickname}
              </span>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(`https://antarctic-alpha-team.vercel.app/application?ref=${userNickname}`)
                setToast({ message: 'Ссылка скопирована!', type: 'success' })
              }}
              className={`p-3 rounded-xl transition-all flex-shrink-0 ${
                theme === 'dark' ? 'bg-[#4C7F6E]/20 text-[#4C7F6E] hover:bg-[#4C7F6E]/30' : 'bg-[#4C7F6E]/10 text-[#4C7F6E] hover:bg-[#4C7F6E]/20'
              }`}
              title="Скопировать"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>

          <div className={`mt-4 p-4 rounded-xl ${
            theme === 'dark' ? 'bg-[#4C7F6E]/10' : 'bg-[#4C7F6E]/5'
          }`}>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              <span className="font-bold" style={{ color: '#4C7F6E' }}>Твой код: </span>
              <span className="font-mono font-bold">{userNickname}</span>
            </p>
            <p className={`text-xs mt-1 ${subTextColor}`}>
              Отправь эту ссылку другу. Когда он перейдёт по ней — увидит приветствие от тебя и сможет подать заявку в команду.
            </p>
          </div>
        </div>
      </div>
      
      {/* Мои рефералы - Таблица */}
      <div className={`rounded-3xl p-6 border ${
        theme === 'dark' 
          ? 'bg-[#0b1015] border-white/5' 
          : 'bg-white border-gray-100'
      } shadow-xl`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-[#4C7F6E]/10 rounded-xl">
            <Users className="w-5 h-5 text-[#4C7F6E]" />
          </div>
          <h3 className={`text-lg font-black ${headingColor}`}>Мои рефералы</h3>
        </div>
        
        {myReferrals.length === 0 ? (
          <div className={`text-center py-10 rounded-2xl border-2 border-dashed ${
            theme === 'dark' ? 'border-white/10' : 'border-gray-200'
          }`}>
            <Users className={`w-12 h-12 mx-auto mb-3 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
            <p className={`text-sm font-bold mb-1 ${headingColor}`}>У вас пока нет рефералов</p>
            <p className={`text-xs ${subTextColor}`}>Нажмите «Добавить реферала» чтобы начать</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${theme === 'dark' ? 'border-white/10' : 'border-gray-100'}`}>
                  <th className={`text-center py-3 px-4 text-xs font-bold uppercase tracking-wider ${subTextColor}`}>Имя</th>
                  <th className={`text-center py-3 px-4 text-xs font-bold uppercase tracking-wider ${subTextColor}`}>ID</th>
                  <th className={`text-center py-3 px-4 text-xs font-bold uppercase tracking-wider ${subTextColor}`}>Телефон</th>
                  <th className={`text-center py-3 px-4 text-xs font-bold uppercase tracking-wider ${subTextColor}`}>Статус</th>
                </tr>
              </thead>
              <tbody>
                {myReferrals.map((ref) => {
                  const statusConfig = STATUS_CONFIG[ref.status as ReferralStatus] || STATUS_CONFIG.pending
                  const StatusIcon = statusConfig.icon
                  
                  return (
                    <tr key={ref.id} className={`border-b transition-colors ${
                      theme === 'dark' ? 'border-white/5 hover:bg-white/5' : 'border-gray-50 hover:bg-gray-50'
                    }`}>
                      <td className={`py-3 px-4 text-center`}>
                        <p className={`text-sm font-medium ${headingColor}`}>{ref.name}</p>
                      </td>
                      <td className={`py-3 px-4 text-center`}>
                        <code className={`text-xs font-mono ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {ref.referralId}
                        </code>
                      </td>
                      <td className={`py-3 px-4 text-center`}>
                        <p className={`text-sm ${subTextColor}`}>{ref.phone || '—'}</p>
                      </td>
                      <td className={`py-3 px-4 text-center`}>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.color}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {statusConfig.label}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Статистика моих рефералов */}
      <div className={`rounded-3xl p-6 border ${
        theme === 'dark' 
          ? 'bg-[#0b1015] border-white/5' 
          : 'bg-white border-gray-100'
      } shadow-xl`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-500/10 rounded-xl">
            <Activity className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className={`text-lg font-black ${headingColor}`}>Статистика моих рефералов</h3>
        </div>
        
        {myReferrals.length === 0 ? (
          <div className={`text-center py-10 rounded-2xl border-2 border-dashed ${
            theme === 'dark' ? 'border-white/10' : 'border-gray-200'
          }`}>
            <HelpCircle className={`w-12 h-12 mx-auto mb-3 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
            <p className={`text-sm font-bold mb-1 ${headingColor}`}>Нет рефералов</p>
            <p className={`text-xs ${subTextColor}`}>Добавьте рефералов для отображения статистики</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${theme === 'dark' ? 'border-white/10' : 'border-gray-100'}`}>
                  <th className={`text-center py-3 px-4 text-xs font-bold uppercase tracking-wider ${subTextColor}`}>ID</th>
                  <th className={`text-center py-3 px-4 text-xs font-bold uppercase tracking-wider ${subTextColor}`}>Имя</th>
                  <th className={`text-center py-3 px-4 text-xs font-bold uppercase tracking-wider ${subTextColor}`}>Заработок реферала</th>
                  <th className={`text-center py-3 px-4 text-xs font-bold uppercase tracking-wider ${subTextColor}`}>Отправлено в пул</th>
                  <th className={`text-center py-3 px-4 text-xs font-bold uppercase tracking-wider ${subTextColor}`}>Мой заработок</th>
                </tr>
              </thead>
              <tbody>
                {myReferrals.map((ref) => {
                  const stats = getReferralStats(ref)
                  
                  return (
                    <tr key={ref.id} className={`border-b transition-colors ${
                      theme === 'dark' ? 'border-white/5 hover:bg-white/5' : 'border-gray-50 hover:bg-gray-50'
                    }`}>
                      <td className={`py-3 px-4 text-center`}>
                        <code className={`text-xs font-mono ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {ref.referralId}
                        </code>
                      </td>
                      <td className={`py-3 px-4 text-center`}>
                        <div>
                          <p className={`text-sm font-medium ${headingColor}`}>{ref.name}</p>
                          {ref.userId && (
                            <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                              {stats.daysInSystem} дн. в сист.
                            </p>
                          )}
                        </div>
                      </td>
                      <td className={`py-3 px-4 text-center`}>
                        <div>
                          <span className={`text-sm font-medium ${
                            stats.totalEarnings > 0 ? 'text-green-500' : subTextColor
                          }`}>
                            {formatAmount(stats.totalEarnings)}
                          </span>
                          {ref.userId && stats.earningsCount > 0 && (
                            <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                              {stats.earningsCount} заявок
                            </p>
                          )}
                        </div>
                      </td>
                      <td className={`py-3 px-4 text-center`}>
                        <span className={`text-sm font-medium ${
                          stats.totalPoolContributions > 0 ? 'text-blue-400' : subTextColor
                        }`}>
                          {formatAmount(stats.totalPoolContributions)}
                        </span>
                      </td>
                      <td className={`py-3 px-4 text-center`}>
                        <span className={`text-sm font-bold ${
                          stats.myEarnings > 0 ? 'text-amber-500' : subTextColor
                        }`}>
                          {formatAmount(stats.myEarnings)}
                        </span>
                        {ref.userId && stats.myEarnings === 0 && stats.totalPoolContributions > 0 && (
                          <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                            {stats.earningsCount < 20 ? `нужно ${20 - stats.earningsCount} заявок` : 
                             stats.totalPoolContributions <= 12000 ? `нужно ещё ${12001 - stats.totalPoolContributions} в пул` :
                             stats.daysInSystem <= 30 ? `осталось ${30 - stats.daysInSystem} дней` : ''}
                          </p>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Система баллов */}
      <div className={`rounded-3xl p-6 border ${
        theme === 'dark' 
          ? 'bg-[#0b1015] border-white/5' 
          : 'bg-white border-gray-100'
      } shadow-xl`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-xl">
              <Trophy className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className={`text-lg font-black ${headingColor}`}>Система баллов</h3>
              <p className={`text-xs ${subTextColor}`}>1 активный реферал = 10 баллов</p>
            </div>
          </div>
          <div className="px-4 py-2 rounded-xl" style={{ backgroundColor: '#4C7F6E' }}>
            <span className={`text-lg font-black ${
              theme === 'dark' ? 'text-white' : 'text-white'
            }`}>{pointsBalance} баллов</span>
          </div>
        </div>
        
        {/* Обмен баллов */}
        <div className="space-y-3 mb-6">
          <p className={`text-sm font-medium ${headingColor}`}>Обмен баллов на преимущества:</p>
          
          {POINTS_BENEFITS.map((benefit, idx) => (
            <div 
              key={idx}
              className={`flex items-center justify-between p-4 rounded-xl ${
                theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  idx === 0 ? 'bg-green-500/10' : idx === 1 ? 'bg-blue-500/10' : 'bg-purple-500/10'
                }`}>
                  {idx === 0 && <DollarSign className="w-5 h-5 text-green-400" />}
                  {idx === 1 && <TrendingUp className="w-5 h-5 text-blue-400" />}
                  {idx === 2 && <Calendar className="w-5 h-5 text-purple-400" />}
                </div>
                <div>
                  <p className={`text-sm font-medium ${headingColor}`}>{benefit.label}</p>
                  <p className={`text-xs ${subTextColor}`}>{benefit.description}</p>
                </div>
              </div>
              <span className={`text-sm font-bold ${theme === 'dark' ? 'text-[#4C7F6E]' : 'text-[#4C7F6E]'}`}>
                {benefit.points} баллов
              </span>
            </div>
          ))}
        </div>
        
        <button
          onClick={() => setExchangeModalOpen(true)}
          disabled={pointsBalance < 10}
          className="w-full py-3 rounded-xl text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#4C7F6E' }}
        >
          Обменять
        </button>
      </div>
      
      {/* История заявок на обмен баллов */}
      {myRequests.length > 0 && (
        <div className={`rounded-3xl p-6 border ${
          theme === 'dark' 
            ? 'bg-[#0b1015] border-white/5' 
            : 'bg-white border-gray-100'
        } shadow-xl`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-500/10 rounded-xl">
              <Clock className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className={`text-lg font-black ${headingColor}`}>Мои заявки на обмен</h3>
              <p className={`text-xs ${subTextColor}`}>Хранятся 48 часов после решения DM</p>
            </div>
          </div>
          
          <div className="space-y-3">
            {myRequests.map((request) => {
              const data = request.after as PointsExchangeRequest
              const benefit = POINTS_BENEFITS.find(b => b.type === data?.benefitType)
              const isPending = request.status === 'pending'
              const isApproved = request.status === 'approved'
              const isRejected = request.status === 'rejected'
              
              // Расчёт времени до удаления
              let timeRemaining = null
              if (request.processedAt) {
                timeRemaining = getTimeRemaining(request.processedAt)
              }
              
              return (
                <div 
                  key={request.id}
                  className={`p-4 rounded-xl border ${
                    isPending 
                      ? theme === 'dark' ? 'bg-amber-500/5 border-amber-500/20' : 'bg-amber-50 border-amber-200'
                      : isApproved 
                        ? theme === 'dark' ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-emerald-50 border-emerald-200'
                        : theme === 'dark' ? 'bg-red-500/5 border-red-500/20' : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-lg font-black ${headingColor}`}>{data?.points} баллов</span>
                        <span className={`text-sm ${subTextColor}`}>→ {benefit?.label || data?.benefitType}</span>
                      </div>
                      
                      {/* Статус */}
                      <div className="flex items-center gap-2 mb-2">
                        {isPending && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-500">
                            <Clock className="w-3 h-3" />
                            На рассмотрении
                          </span>
                        )}
                        {isApproved && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-500">
                            <CheckCircle2 className="w-3 h-3" />
                            Одобрено
                          </span>
                        )}
                        {isRejected && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-500">
                            <X className="w-3 h-3" />
                            Отклонено
                          </span>
                        )}
                        
                        {/* Дата */}
                        <span className={`text-xs ${subTextColor}`}>
                          {new Date(request.createdAt).toLocaleDateString('ru-RU', {
                            day: '2-digit',
                            month: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      
                      {/* Комментарий админа */}
                      {request.adminComment && (
                        <div className={`text-xs p-2 rounded-lg ${
                          theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'
                        }`}>
                          <span className={`font-medium ${headingColor}`}>DM: </span>
                          <span className={subTextColor}>{request.adminComment}</span>
                        </div>
                      )}
                      
                      {/* Таймер до удаления */}
                      {timeRemaining && !timeRemaining.expired && (
                        <div className={`text-xs mt-2 ${subTextColor}`}>
                          <Clock className="w-3 h-3 inline mr-1" />
                          До удаления: {String(timeRemaining.hours).padStart(2, '0')}:{String(timeRemaining.minutes).padStart(2, '0')}:{String(timeRemaining.seconds).padStart(2, '0')}
                        </div>
                      )}
                    </div>
                    
                    {/* Кнопка удаления */}
                    {!isPending && (
                      <button
                        onClick={() => handleDeleteRequest(request.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          theme === 'dark' 
                            ? 'hover:bg-white/10 text-gray-400' 
                            : 'hover:bg-gray-100 text-gray-500'
                        }`}
                        title="Удалить из истории"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
      
      {/* Важные условия */}
      <div className={`rounded-3xl p-6 border ${
        theme === 'dark' 
          ? 'bg-[#0b1015] border-white/5' 
          : 'bg-white border-gray-100'
      } shadow-xl`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-red-500/10 rounded-xl">
            <Shield className="w-5 h-5 text-red-400" />
          </div>
          <h3 className={`text-lg font-black ${headingColor}`}>Важные условия</h3>
        </div>
        
        <div className={`p-4 rounded-xl border ${
          theme === 'dark' ? 'bg-[#4C7F6E]/10 border-[#4C7F6E]/20' : 'bg-[#4C7F6E]/10 border-[#4C7F6E]/20'
        }`}>
          <ul className={`space-y-2 text-sm ${theme === 'dark' ? 'text-white/90' : 'text-gray-700'}`}>
            <li className="flex items-start gap-2">
              <span className={theme === 'dark' ? 'text-[#4C7F6E]' : 'text-[#4C7F6E]'}>•</span>
              <span>Все рефералы должны быть активными и выполнять KPI - как в расписании, так и в пополнении пула сообщества и выполнении задач</span>
            </li>
            <li className="flex items-start gap-2">
              <span className={theme === 'dark' ? 'text-[#4C7F6E]' : 'text-[#4C7F6E]'}>•</span>
              <span>Пригласивший также должен оставаться активным в торговле, выполнять задачи и пополнять пул сообщества</span>
            </li>
            <li className="flex items-start gap-2">
              <span className={theme === 'dark' ? 'text-[#4C7F6E]' : 'text-[#4C7F6E]'}>•</span>
              <span>При неактивности реферала к пригласившему могут применяться санкции</span>
            </li>
            <li className="flex items-start gap-2">
              <span className={theme === 'dark' ? 'text-[#4C7F6E]' : 'text-[#4C7F6E]'}>•</span>
              <span>Реферал должен проработать минимум 30 дней для получения бонусов, пополнить пул сообщества не менее чем на 200$ и успешно пройти аттестацию (экзамен) после прохождения контура, а также быть с подтвержденной верификацией</span>
            </li>
            <li className="flex items-start gap-2">
              <span className={theme === 'dark' ? 'text-[#4C7F6E]' : 'text-[#4C7F6E]'}>•</span>
              <span>Запрещено приглашать уже существующих участников команды или тех, кто был исключен</span>
            </li>
          </ul>
        </div>
      </div>
      
      {/* FAQ */}
      <div className={`rounded-3xl p-6 border ${
        theme === 'dark' 
          ? 'bg-[#0b1015] border-white/5' 
          : 'bg-white border-gray-100'
      } shadow-xl`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-[#4C7F6E]/10 rounded-xl">
            <HelpCircle className="w-5 h-5 text-[#4C7F6E]" />
          </div>
          <h3 className={`text-lg font-black ${headingColor}`}>FAQ по реферальной программе</h3>
        </div>
        
        <div className="space-y-2">
          {faqItems.map((item, index) => {
            const Icon = item.icon
            const isExpanded = expandedFAQ === index
            
            return (
              <div
                key={index}
                className={`rounded-xl border transition-all duration-300 overflow-hidden ${
                  isExpanded
                    ? 'border-[#4C7F6E]/30 bg-[#4C7F6E]/5'
                    : theme === 'dark' 
                      ? 'border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]' 
                      : 'border-gray-100 bg-gray-50/50 hover:border-gray-200 hover:bg-gray-50'
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full p-5 flex items-start gap-4 text-left"
                >
                  <div className={`p-3 rounded-xl flex-shrink-0 transition-all duration-300 ${
                    isExpanded 
                      ? 'bg-[#4C7F6E]/20 scale-110' 
                      : 'bg-white/5 hover:bg-white/10'
                  }`}>
                    <Icon className={`w-5 h-5 transition-colors ${
                      isExpanded ? 'text-[#4C7F6E]' : subTextColor
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-semibold ${headingColor} group-hover:text-[#4C7F6E] transition-colors`}>
                      {item.question}
                    </h3>
                  </div>
                  <div className={`p-2 rounded-full transition-all duration-300 ${
                    isExpanded 
                      ? 'bg-[#4C7F6E]/20' 
                      : 'bg-white/5'
                  }`}>
                    {isExpanded ? (
                      <ChevronUp className={`w-4 h-4 text-[#4C7F6E]`} />
                    ) : (
                      <ChevronDown className={`w-4 h-4 ${subTextColor}`} />
                    )}
                  </div>
                </button>
                
                {isExpanded && (
                  <div className="px-5 pb-5 pl-16 pt-0">
                    <div className="pt-4 border-t border-white/5">
                      <p className={`text-sm leading-relaxed whitespace-pre-line ${subTextColor}`}>
                        {item.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
      
      {/* Toast уведомление */}
      {toast && (
        <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-[60] animate-in fade-in slide-in-from-top-4 duration-300`}>
          <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border text-white`}
            style={{ backgroundColor: '#4C7F6E' }}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            ) : (
              <X className="w-5 h-5 flex-shrink-0" />
            )}
            <span className="font-medium">{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="ml-2 p-1 rounded-lg hover:bg-white/20 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      
      {/* Modals */}
      <ReferralModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)}
        theme={theme}
        onSave={handleAddReferral}
        userReferralCode={userReferralCode}
        totalReferralsCount={totalReferralsCount}
      />
      
      <ExchangePointsModal
        isOpen={exchangeModalOpen}
        onClose={() => setExchangeModalOpen(false)}
        theme={theme}
        currentPoints={pointsBalance}
        onExchange={handleExchangePoints}
      />
    </div>
  )
}

export default Referrals
