import { useState } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAdminStore } from '@/store/adminStore'
import { 
  FileText, 
  MessageCircle, 
  AlertTriangle, 
  ShoppingCart, 
  Users, 
  Inbox,
  CheckCircle,
  Clock,
  Construction,
  HeartHandshake,
  TrendingUp,
  Lock
} from 'lucide-react'

type ApplicationCategory = 'clients' | 'complaints' | 'purchase' | 'partnership' | 'community'

const CATEGORIES: { id: ApplicationCategory; label: string; icon: typeof FileText }[] = [
  { id: 'clients', label: 'Обращения клиентов', icon: MessageCircle },
  { id: 'complaints', label: 'Жалобы клиентов', icon: AlertTriangle },
  { id: 'purchase', label: 'Заявки на покупку', icon: ShoppingCart },
  { id: 'partnership', label: 'Заявки на партнерство', icon: HeartHandshake },
  { id: 'community', label: 'Метрики сообщества', icon: Users },
]

const STATS_MOCK = {
  open: 0,
  closed: 0,
  review: 0,
  partnership: 0,
  collaboration: 0,
}

export const Applications = () => {
  const { theme } = useThemeStore()
  const { isAdmin, isLimitedAdmin, hasSectionAccess } = useAdminStore()
  const [activeCategory, setActiveCategory] = useState<ApplicationCategory>('clients')

  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const subTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
  const cardBg = theme === 'dark' ? 'bg-[#0f1216]' : 'bg-white'
  const borderColor = theme === 'dark' ? 'border-white/10' : 'border-gray-200'

  // Проверка доступа: полный админ или limited admin с доступом к applications
  const hasAccess = isAdmin || (isLimitedAdmin && hasSectionAccess('applications'))

  if (!hasAccess) {
    return (
      <div className={`rounded-2xl p-8 ${cardBg} shadow-xl border-2 ${theme === 'dark'
        ? 'border-red-500/30 bg-gradient-to-br from-[#1a1a1a] to-[#0A0A0A]'
        : 'border-red-200 bg-gradient-to-br from-white to-red-50/20'
        } relative overflow-hidden`}>
        <div className="text-center">
          <div className={`inline-flex p-4 rounded-2xl mb-4 ${theme === 'dark'
            ? 'bg-red-500/20'
            : 'bg-red-100'
            }`}>
            <Lock className={`w-12 h-12 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`} />
          </div>
          <h2 className={`text-2xl font-bold mb-2 ${headingColor}`}>Доступ запрещен</h2>
          <p className={subTextColor}>
            Эта страница доступна только администраторам.
          </p>
        </div>
      </div>
    )
  }

  const renderPlaceholder = (category: ApplicationCategory) => {
    const categoryInfo = CATEGORIES.find(c => c.id === category)

    return (
      <div className={`rounded-2xl border ${borderColor} ${cardBg} p-12 text-center`}>
        <div className="relative inline-block mb-6">
          <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center ${
            theme === 'dark' ? 'bg-[#4C7F6E]/20' : 'bg-[#4C7F6E]/10'
          }`}>
            <Construction className="w-10 h-10 text-[#4C7F6E]" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
            <span className="text-xs">🚧</span>
          </div>
        </div>

        <h3 className={`text-xl font-bold mb-2 ${headingColor}`}>
          {categoryInfo?.label}
        </h3>
        <p className={`text-sm mb-4 ${subTextColor}`}>
          Этот раздел находится в разработке
        </p>
        
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
          theme === 'dark' ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700'
        }`}>
          <Clock className="w-4 h-4" />
          Скоро появится
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 pb-6 border-b border-white/5">
        <div className="p-3 bg-[#4C7F6E]/10 rounded-2xl border border-[#4C7F6E]/20">
          <FileText className="w-8 h-8 text-[#4C7F6E]" />
        </div>
        <div>
          <h1 className={`text-2xl md:text-3xl font-black tracking-tight ${headingColor}`}>
            Applications
          </h1>
          <p className={`text-sm font-medium ${subTextColor}`}>
            Заявки и обращения клиентов и партнёров
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Open Applications */}
        <div className={`rounded-2xl p-5 border ${borderColor} ${cardBg} relative overflow-hidden group hover:scale-[1.02] transition-all`}>
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Inbox className="w-4 h-4 text-blue-500" />
              </div>
              <span className={`text-xs font-medium ${subTextColor}`}>Открыто</span>
            </div>
            <p className={`text-3xl font-black ${headingColor}`}>{STATS_MOCK.open}</p>
            <p className={`text-xs mt-1 ${subTextColor}`}>новых обращений</p>
          </div>
        </div>

        {/* Under Review */}
        <div className={`rounded-2xl p-5 border ${borderColor} ${cardBg} relative overflow-hidden group hover:scale-[1.02] transition-all`}>
          <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg bg-amber-500/20">
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <span className={`text-xs font-medium ${subTextColor}`}>На рассмотрении</span>
            </div>
            <p className={`text-3xl font-black ${headingColor}`}>{STATS_MOCK.review}</p>
            <p className={`text-xs mt-1 ${subTextColor}`}>в очереди</p>
          </div>
        </div>

        {/* Closed */}
        <div className={`rounded-2xl p-5 border ${borderColor} ${cardBg} relative overflow-hidden group hover:scale-[1.02] transition-all`}>
          <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg bg-emerald-500/20">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
              </div>
              <span className={`text-xs font-medium ${subTextColor}`}>Закрыто</span>
            </div>
            <p className={`text-3xl font-black ${headingColor}`}>{STATS_MOCK.closed}</p>
            <p className={`text-xs mt-1 ${subTextColor}`}>решённых</p>
          </div>
        </div>

        {/* Partnership */}
        <div className={`rounded-2xl p-5 border ${borderColor} ${cardBg} relative overflow-hidden group hover:scale-[1.02] transition-all`}>
          <div className="absolute top-0 right-0 w-20 h-20 bg-[#4C7F6E]/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg bg-[#4C7F6E]/20">
                <HeartHandshake className="w-4 h-4 text-[#4C7F6E]" />
              </div>
              <span className={`text-xs font-medium ${subTextColor}`}>Партнёрство</span>
            </div>
            <p className={`text-3xl font-black ${headingColor}`}>{STATS_MOCK.partnership}</p>
            <p className={`text-xs mt-1 ${subTextColor}`}>заявок на партнёрство</p>
          </div>
        </div>
      </div>

      {/* Sales Analytics Placeholder */}
      <div className={`rounded-2xl border ${borderColor} ${cardBg} p-6`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-[#4C7F6E]/10">
            <TrendingUp className="w-5 h-5 text-[#4C7F6E]" />
          </div>
          <div>
            <h2 className={`text-lg font-bold ${headingColor}`}>Аналитика по продуктам</h2>
            <p className={`text-sm ${subTextColor}`}>Продажи и метрики по продуктам</p>
          </div>
        </div>

        <div className={`rounded-xl border ${borderColor} p-8 text-center`}>
          <div className="relative inline-block mb-4">
            <Construction className="w-12 h-12 text-amber-500 mx-auto" />
          </div>
          <p className={`text-sm ${subTextColor}`}>
            Аналитика продаж по продуктам — в разработке
          </p>
        </div>
      </div>

      {/* Category Selector */}
      <div className={`rounded-2xl border ${borderColor} ${cardBg} p-1`}>
        <div className="flex gap-1 overflow-x-auto pb-1">
          {CATEGORIES.map((category) => {
            const Icon = category.icon
            const isActive = activeCategory === category.id

            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex-1 min-w-[160px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#4C7F6E] text-white shadow-lg shadow-[#4C7F6E]/25'
                    : theme === 'dark'
                      ? 'text-gray-400 hover:bg-white/5 hover:text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {category.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Category Content */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {renderPlaceholder(activeCategory)}
      </div>
    </div>
  )
}

export default Applications
