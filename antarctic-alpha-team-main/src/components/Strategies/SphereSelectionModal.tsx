import { useState } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { ContourSphere } from '@/types'
import { updateUser } from '@/services/firestoreService'
import { 
  TrendingUp, 
  Code, 
  BarChart3, 
  Zap, 
  Image as ImageIcon, 
  Gift,
  Lock,
  AlertTriangle,
  Check,
  GraduationCap,
  Calendar,
  Newspaper,
  Brain,
  ChevronRight,
  Wallet
} from 'lucide-react'

// Метаданные сфер с описаниями
export const SPHERE_META: Record<ContourSphere, {
  label: string
  emoji: string
  icon: React.ReactNode
  description: string
  features: string[]
  gradient: string
  gradientDark: string
}> = {
  memecoins_trading: {
    label: 'Мемкоины (трейдинг)',
    emoji: '🐸',
    icon: <TrendingUp className="w-6 h-6" />,
    description: 'Ты не будешь гадать на помойке и играться в казино. Вместе с наставником заходишь в мемы и начинаешь забирать профит системно.',
    features: [
      'FASOL — научишься собирать сетапы для сигналов, получишь готовые фильтры',
      '8+ стратегий, которые работают',
      '20+ инструментов — от терминалов и ончейн-анализа до безопасности',
      'Список кошельков, за которыми надо следить (киты, умные деньги, девы)',
      'Понимание нарративов и демо-торговли для отработки навыков и стратегий',
      'Прокачка в X — чтобы не просто торговать, а стать авторитетом'
    ],
    gradient: 'from-emerald-400 via-teal-500 to-cyan-500',
    gradientDark: 'from-emerald-500 via-teal-600 to-cyan-600'
  },
  memecoins_deving: {
    label: 'Мемкоины (девинг)',
    emoji: '🛠',
    icon: <Code className="w-6 h-6" />,
    description: 'Мало торговать — надо создавать. Здесь научишься запускать монеты, рагать их и выводить в топ.',
    features: [
      'Полный цикл: создание → развитие → выход',
      'Использование ИИ для генерации монет и контента',
      'Понимание нарративов — чтобы монета залетела',
      'Списки опытных девов',
      'Инструменты — от рядовых до бандлеров'
    ],
    gradient: 'from-teal-400 via-cyan-500 to-blue-500',
    gradientDark: 'from-teal-500 via-cyan-600 to-blue-600'
  },
  polymarket: {
    label: 'Polymarket',
    emoji: '🎲',
    icon: <BarChart3 className="w-6 h-6" />,
    description: 'Ставки — это математика, а не удача. Научишься прогнозировать политику, спорт, крипту — всё, на что можно поставить.',
    features: [
      '2 стратегии, которые работают с момента основания Polymarket',
      '10+ инструментов — аналитика, данные, AI-инсайты, трекинг портфеля',
      'Прокачка математического мышления и аналитики'
    ],
    gradient: 'from-rose-400 via-red-500 to-orange-500',
    gradientDark: 'from-rose-600 via-red-600 to-orange-600'
  },
  futures: {
    label: 'Фьючерсы и Спот',
    emoji: '📈',
    icon: <Zap className="w-6 h-6" />,
    description: 'Полный разбор работы с CEX. Научишься собирать портфель, торговать фьючерсы и понимать, куда идет рынок.',
    features: [
      'Выбор монет в портфель',
      'Понимание цен на золото, нефть, серебро и другие активы, в том числе альткоинов, мемкоинов (крупных), биткоина',
      'Разбор отчетов компаний',
      '6+ стратегий',
      '15+ инструментов',
      'Работа с кредитным плечом',
      'Проп-фирмы — торгуешь на чужой капитал, когда своих мало'
    ],
    gradient: 'from-blue-400 via-indigo-500 to-purple-500',
    gradientDark: 'from-blue-600 via-indigo-600 to-purple-600'
  },
  nft: {
    label: 'NFT',
    emoji: '🖼',
    icon: <ImageIcon className="w-6 h-6" />,
    description: 'Не просто картинки. Научишься выбирать коллекции, которые растут, и создавать свои.',
    features: [
      '4 стратегии — от снайпинга до чек-листа выбора',
      'Понимание ценности, минта, роялти',
      'Какой блокчейн и платформа работают лучше',
      'Создание и развитие своих коллекций'
    ],
    gradient: 'from-purple-400 via-pink-500 to-rose-500',
    gradientDark: 'from-purple-600 via-pink-600 to-rose-600'
  },
  airdrop: {
    label: 'AirDrop',
    emoji: '💎',
    icon: <Gift className="w-6 h-6" />,
    description: 'Быть первым — вот что приносит деньги. Научишься находить проекты на ранней стадии и забирать вознаграждения.',
    features: [
      'Выбор проектов до того, как о них узнают все',
      'Работа в командах проектов',
      'Полное погружение в крипто-рынок'
    ],
    gradient: 'from-cyan-400 via-blue-500 to-indigo-500',
    gradientDark: 'from-cyan-600 via-blue-600 to-indigo-600'
  },
  digital_payments: {
    label: 'Цифровые платёжные решения',
    emoji: '💳',
    icon: <Wallet className="w-6 h-6" />,
    description: 'Криптокошельки нового поколения для оплаты товаров и услуг криптовалютой через QR-коды.',
    features: [
      'Antarctic Wallet — криптокошелёк с оплатой по QR-коду',
      'Altyn.one — web3 кошелёк с банковской лицензией',
      'Валлет — оплата криптой по QR-коду',
      'Crypto Bot — обмен, оплата по СБП и хранение',
      'SkyPay — оплата по QR-коду, покупка/продажа USDT',
      'Crypto Office — хранение, обмен, массовые операции'
    ],
    gradient: 'from-violet-400 via-purple-500 to-fuchsia-500',
    gradientDark: 'from-violet-600 via-purple-600 to-fuchsia-600'
  }
}

// Общие преимущества для всех
const COMMON_BENEFITS = [
  { icon: <Brain className="w-5 h-5" />, text: 'Дополнительные знания в аналитике блокчейна' },
  { icon: <Newspaper className="w-5 h-5" />, text: 'Список новостных ресурсов' },
  { icon: <Calendar className="w-5 h-5" />, text: 'Календари событий' },
  { icon: <GraduationCap className="w-5 h-5" />, text: 'И многое другое, например - как платить криптой по СБП, безопасно ее покупать и продавать :)' }
]

interface SphereSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (sphere: ContourSphere) => void
  selectedSphere?: ContourSphere
  sphereSelectedAt?: string
  isAdmin?: boolean
}

export const SphereSelectionModal: React.FC<SphereSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  selectedSphere,
  sphereSelectedAt,
  isAdmin = false
}) => {
  const { theme } = useThemeStore()
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [expandedSphere, setExpandedSphere] = useState<ContourSphere | null>(null)

  // Проверяем, можно ли менять сферу
  // Только админы могут менять сферу, пользователи - нет
  const canChangeSphere = () => {
    if (!sphereSelectedAt) return true // Если сфера не выбрана - можно выбрать
    return isAdmin // Только админы могут менять уже выбранную сферу
  }

  const handleSelect = async (sphere: ContourSphere) => {
    if (!user) return
    
    // Проверка блокировки: если сфера уже выбрана - только админ может изменить
    if (selectedSphere && selectedSphere !== sphere && !canChange) {
      alert(`⚠️ Смена сферы заблокирована!\n\nТекущая сфера: ${SPHERE_META[selectedSphere]?.label}\nВыбрано: ${sphereSelectedAt ? new Date(sphereSelectedAt).toLocaleDateString('ru-RU') : ''}\n\nДля изменения сферы обратитесь к администратору.`)
      return
    }
    
    setLoading(true)
    try {
      const now = new Date().toISOString()
      await updateUser(user.id, {
        selectedSphere: sphere,
        sphereSelectedAt: now
      })
      
      // Обновляем локальное состояние
      useAuthStore.getState().updateUser({
        selectedSphere: sphere,
        sphereSelectedAt: now
      })
      
      onSelect(sphere)
    } catch (error) {
      console.error('Error selecting sphere:', error)
    } finally {
      setLoading(false)
    }
  }

const sphereIds = Object.keys(SPHERE_META) as ContourSphere[]
  const canChange = canChangeSphere()

  // Проверка, заблокирована ли сфера
  const isSphereLocked = (sphereId: ContourSphere) => {
    return !!(selectedSphere && selectedSphere !== sphereId && !canChange)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop - cannot be closed */}
      <div className="absolute inset-0 bg-black/95 backdrop-blur-sm" />
      
      {/* Modal */}
      <div className={`relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl ${
        theme === 'dark' ? 'bg-[#0a0f14] border border-white/10' : 'bg-white border border-gray-200'
      } shadow-2xl`}>
        {/* Header */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-start justify-between">
            <div>
              <h2 className={`text-2xl font-black tracking-tight ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Выбери свою сферу
              </h2>
              <p className={`mt-2 text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Определись с направлением — это поможет сфокусироваться на главном
              </p>
            </div>
            
            {/* Warning badge */}
            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl ${
              theme === 'dark' ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-amber-50 border border-amber-200'
            }`}>
              <Lock className="w-4 h-4 text-amber-500" />
              <span className={`text-xs font-medium ${theme === 'dark' ? 'text-amber-400' : 'text-amber-700'}`}>
                Выбор заблокирован (только админ может изменить)
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Info message */}
          <div className={`mb-6 p-4 rounded-xl ${
            theme === 'dark' ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'
          }`}>
            <div className="flex items-start gap-3">
              <AlertTriangle className={`w-5 h-5 mt-0.5 ${
                theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
              }`} />
              <div>
                <p className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-blue-300' : 'text-blue-800'
                }`}>
                  После выбора сферы изменить её можно только через администратора
                </p>
                <p className={`text-xs mt-1 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Убедись, что тебе это интересно и понятно. В случае необходимости обратись к тому, кто пригласил тебя в сообщество, в DM или в чат команды — ребята помогут тебе выбрать сферу.
                </p>
              </div>
            </div>
          </div>

          {/* Sphere selection - always show spheres, but handle locked state */}
          {true ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sphereIds.map((sphereId) => {
                const meta = SPHERE_META[sphereId]
                const isExpanded = expandedSphere === sphereId
                const isSelected = selectedSphere === sphereId
                const isLocked = isSphereLocked(sphereId)
                
                return (
                  <div
                    key={sphereId}
                    className={`relative rounded-xl border transition-all ${
                      isSelected
                        ? theme === 'dark' 
                          ? 'border-emerald-500/50 bg-emerald-500/5' 
                          : 'border-emerald-500 bg-emerald-50'
                        : isLocked
                          ? theme === 'dark'
                            ? 'border-amber-500/30 bg-amber-500/5 opacity-60'
                            : 'border-amber-200 bg-amber-50 opacity-60'
                          : theme === 'dark'
                            ? 'border-white/10 hover:border-white/20 bg-white/5'
                            : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                    }`}
                  >
                    <button
                      onClick={() => setExpandedSphere(isExpanded ? null : sphereId)}
                      disabled={loading}
                      className="w-full p-4 text-left relative"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${meta.gradient} text-white shadow-lg flex-shrink-0`}>
                          {meta.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{meta.emoji}</span>
                            <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                              {meta.label}
                            </h3>
                            {isLocked && (
                              <Lock className="w-4 h-4 text-amber-500" />
                            )}
                          </div>
                          <p className={`text-sm mt-1 ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            {meta.description}
                          </p>
                        </div>
                        {isSelected && (
                          <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                        <ChevronRight className={`w-5 h-5 transition-transform ${
                          isExpanded ? 'rotate-90' : ''
                        } ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                      </div>
                    </button>
                    
                    {/* Expanded features */}
                    {isExpanded && (
                      <div className={`px-4 pb-4 pt-2 border-t ${
                        theme === 'dark' ? 'border-white/10' : 'border-gray-200'
                      }`}>
                        <ul className="space-y-2 mb-4">
                          {meta.features.map((feature, idx) => (
                            <li key={idx} className={`flex items-start gap-2 text-sm ${
                              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                        
                        {/* Locked warning */}
                        {isLocked && (
                          <div className={`mb-4 p-3 rounded-lg ${
                            theme === 'dark' ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-amber-50 border border-amber-200'
                          }`}>
                            <div className="flex items-start gap-2">
                              <Lock className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                              <div className="text-sm">
                                <p className={`font-medium ${theme === 'dark' ? 'text-amber-400' : 'text-amber-700'}`}>
                                  Смена сферы недоступна
                                </p>
                                <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                  Только администратор может изменить вашу сферу
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSelect(sphereId)
                          }}
                          disabled={loading || isLocked}
                          className={`w-full py-2.5 px-4 rounded-xl font-bold text-sm transition-all ${
                            isLocked
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white disabled:opacity-50'
                          }`}
                        >
                          {isLocked ? 'Заблокировано' : loading ? 'Сохранение...' : isSelected ? 'Выбрано' : 'Выбрать сферу'}
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            /* Already selected - show current sphere */
            <div className="space-y-4">
              <div className={`p-6 rounded-xl border ${
                theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'
              }`}>
                <div className="flex items-center gap-4 mb-4">
                  {selectedSphere && (() => {
                    const sphere = selectedSphere
                    const meta = SPHERE_META[sphere as ContourSphere]
                    return (
                      <>
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br ${
                          meta?.gradient || 'from-gray-500 to-gray-600'
                        } text-white shadow-lg`}>
                          {meta?.icon || <TrendingUp className="w-8 h-8" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{meta?.emoji || '📊'}</span>
                            <h3 className={`text-xl font-bold ${
                              theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>
                              {meta?.label || sphere}
                            </h3>
                          </div>
                          <p className={`text-sm ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            Выбрано {sphereSelectedAt ? new Date(sphereSelectedAt as string).toLocaleDateString('ru-RU') : ''}
                          </p>
                        </div>
                      </>
                    )
                  })()}
                </div>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {selectedSphere ? (SPHERE_META[selectedSphere as ContourSphere]?.description || '') : ''}
                </p>
              </div>
              
              {/* Show admin notice */}
              {isAdmin && (
                <div className={`p-4 rounded-xl border ${
                  theme === 'dark' ? 'bg-purple-500/10 border-purple-500/20' : 'bg-purple-50 border-purple-200'
                }`}>
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-purple-300' : 'text-purple-700'
                  }`}>
                    🗝 <strong>Админ-режим:</strong> У тебя есть доступ ко всем сферам. Твой выбор — это просто метка для аналитики.
                  </p>
                </div>
              )}
              
              {/* Locked warning for non-admins */}
              {!canChange && selectedSphere && !isAdmin && (
                <div className={`p-4 rounded-xl border ${
                  theme === 'dark' ? 'bg-amber-500/10 border-amber-500/20' : 'bg-amber-50 border-amber-200'
                }`}>
                  <div className="flex items-start gap-3">
                    <Lock className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className={`font-medium ${
                        theme === 'dark' ? 'text-amber-400' : 'text-amber-700'
                      }`}>
                        Смена сферы заблокирована
                      </p>
                      <p className={`text-sm mt-1 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Выбрано: {sphereSelectedAt ? new Date(sphereSelectedAt as string).toLocaleDateString('ru-RU') : ''}
                      </p>
                      <p className={`text-xs mt-2 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Только администратор может изменить вашу сферу. Обратитесь к админу для смены.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Common benefits */}
          <div className={`mt-8 p-6 rounded-xl ${
            theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-gray-50 border border-gray-200'
          }`}>
            <h3 className={`font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              📚 Вне зависимости от выбора ты получишь:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {COMMON_BENEFITS.map((benefit, idx) => (
                <div key={idx} className={`flex items-center gap-3 p-3 rounded-lg ${
                  theme === 'dark' ? 'bg-white/5' : 'bg-white'
                }`}>
                  <div className="w-10 h-10 rounded-lg bg-[#4E6E49]/10 flex items-center justify-center text-[#4E6E49] flex-shrink-0">
                    {benefit.icon}
                  </div>
                  <span className={`text-sm ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {benefit.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Mentorship note */}
          <div className={`mt-4 p-4 rounded-xl ${
            theme === 'dark' ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-emerald-50 border border-emerald-200'
          }`}>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              👨‍🏫 <strong>Наставничество:</strong> По каждому направлению тебя сопровождает опытный участник сообщества, который помогает, принимает экзамен и участвует в торговых сессиях вместе с тобой до тех пор, пока ты не станешь топ-спецом и не начнешь учить таких же, каким был ты.
            </p>
          </div>
        </div>

        {/* Footer - show close button if sphere is already selected */}
        {selectedSphere && (
          <div className="p-4 border-t border-white/5">
            <button
              onClick={onClose}
              className="w-full py-3 px-4 bg-[#4E6E49] hover:bg-[#4E6E49]/90 text-white rounded-xl font-bold transition-all"
            >
              Продолжить
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default SphereSelectionModal
