import { Shield, Users, MessageSquare, FileText, CheckCircle2, Wallet, Settings, TrendingUp, MessageSquarePlus, ChevronRight } from 'lucide-react'
import { useAdminStore, AdminSection } from '@/store/adminStore'
import { AdminProtectedLink } from '@/components/AdminProtectedLink'
import { useThemeStore } from '@/store/themeStore'

const adminCards = [
  {
    path: '/admin',
    label: 'Team',
    description: 'Управление командой: просмотр и верификация личных данных участников',
    icon: Users,
    section: 'admin' as AdminSection,
    gradient: 'from-emerald-500/20 to-emerald-600/10',
    borderHover: 'hover:border-emerald-500/40',
  },
  {
    path: '/controls',
    label: 'Controls',
    description: 'Ограничения и блокировки: управление доступом, конфликтами и рестрикциями',
    icon: Shield,
    section: 'controls' as AdminSection,
    gradient: 'from-red-500/20 to-red-600/10',
    borderHover: 'hover:border-red-500/40',
  },
  {
    path: '/team-wallets',
    label: 'Wallets',
    description: 'Кошельки команды: управление DEX и AW кошельками с админ-доступом',
    icon: Wallet,
    section: 'team-wallets' as AdminSection,
    gradient: 'from-blue-500/20 to-blue-600/10',
    borderHover: 'hover:border-blue-500/40',
  },
  {
    path: '/appeals',
    label: 'Appeals',
    description: 'Апелляции: обработка и рассмотрение апелляций участников',
    icon: MessageSquare,
    section: 'appeals' as AdminSection,
    gradient: 'from-purple-500/20 to-purple-600/10',
    borderHover: 'hover:border-purple-500/40',
  },
  {
    path: '/applications',
    label: 'Applications',
    description: 'Заявки: обработка заявок, жалоб и запросов на покупку',
    icon: FileText,
    section: 'applications' as AdminSection,
    gradient: 'from-amber-500/20 to-amber-600/10',
    borderHover: 'hover:border-amber-500/40',
  },
  {
    path: '/approvals',
    label: 'Check',
    description: 'Проверки: управление слотами и статусами подтверждений',
    icon: CheckCircle2,
    section: 'approvals' as AdminSection,
    gradient: 'from-cyan-500/20 to-cyan-600/10',
    borderHover: 'hover:border-cyan-500/40',
  },
  {
    path: '/check-ref',
    label: 'Check_REF',
    description: 'Рефералы: управление реферальными баллами, балансами и обменом',
    icon: Users,
    section: 'approvals' as AdminSection,
    gradient: 'from-teal-500/20 to-teal-600/10',
    borderHover: 'hover:border-teal-500/40',
  },
  {
    path: '/feedback-form',
    label: 'Feedback Form',
    description: 'Обратная связь: управление формой обратной связи и ответами',
    icon: MessageSquarePlus,
    section: 'feedback-form' as AdminSection,
    gradient: 'from-pink-500/20 to-pink-600/10',
    borderHover: 'hover:border-pink-500/40',
  },
  {
    path: '/hr-hub',
    label: 'HR Hub',
    description: 'HR: управление персоналом, наймом и кадровыми вопросами',
    icon: Settings,
    section: 'hr-hub' as AdminSection,
    gradient: 'from-indigo-500/20 to-indigo-600/10',
    borderHover: 'hover:border-indigo-500/40',
  },
  {
    path: '/contour-spheres',
    label: 'Contour Spheres',
    description: 'Сферы: управление торговыми сферами и контурами',
    icon: TrendingUp,
    section: 'contour-spheres' as AdminSection,
    gradient: 'from-orange-500/20 to-orange-600/10',
    borderHover: 'hover:border-orange-500/40',
  },
]

export const AdminDashboard = () => {
  const { isLimitedAdmin, hasSectionAccess } = useAdminStore()
  const { theme } = useThemeStore()

  const availableCards = adminCards.filter(card => hasSectionAccess(card.section))

  if (availableCards.length === 0) {
    return (
      <div className="page-shell">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Shield className="w-16 h-16 mb-4 text-gray-400" />
          <h2 className="text-xl font-bold text-gray-500">Нет доступа к разделам</h2>
          <p className="text-sm text-gray-400 mt-2">У вас нет прав для просмотра панели управления</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page-shell">
      <div className="relative mb-10">
        <div className="floating-grid" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4C7F6E] to-[#4C7F6E]/70 flex items-center justify-center shadow-lg shadow-[#4C7F6E]/30">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                <span style={{ color: '#4C7F6E' }}>{isLimitedAdmin ? 'Limited Admin' : 'Панель управления'}</span>
              </h1>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Выберите раздел для управления
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {availableCards.map((card) => (
          <AdminProtectedLink
            key={card.path}
            to={card.path}
            className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
              theme === 'dark'
                ? 'bg-[#0d1520]/80 border-white/5 hover:border-white/20 hover:shadow-black/40'
                : 'bg-white/90 border-gray-200/60 hover:border-gray-300/80 hover:shadow-gray-200/50'
            }`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            <div className="relative z-10 p-5">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg ${
                theme === 'dark'
                  ? 'bg-white/5 group-hover:bg-white/10'
                  : 'bg-gray-100/80 group-hover:bg-white'
              }`}>
                <card.icon className="w-6 h-6" style={{ color: '#4C7F6E' }} />
              </div>
              <h3 className="text-base font-bold mb-2">
                {card.label}
              </h3>
              <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                {card.description}
              </p>
              <div className={`flex items-center gap-1 mt-4 text-xs font-semibold transition-all duration-300 group-hover:gap-2 ${
                theme === 'dark' ? 'text-[#4C7F6E]' : 'text-[#4C7F6E]'
              }`}>
                <span>Перейти</span>
                <ChevronRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </div>
            </div>
          </AdminProtectedLink>
        ))}
      </div>
    </div>
  )
}
