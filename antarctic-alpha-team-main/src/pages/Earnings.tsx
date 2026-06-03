import { useState, useEffect, useMemo } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { EarningsForm } from '@/components/Earnings/EarningsForm'
import { EarningsList } from '@/components/Earnings/EarningsList'
import { getEarnings } from '@/services/firestoreService'
import { Earnings as EarningsType, EARNINGS_CATEGORY_META, EarningsCategory, EARNINGS_PERIODS, EarningsPeriod } from '@/types'
import { Plus, DollarSign, TrendingUp, Wallet, PieChart, BarChart3, Calendar, ChevronDown, Lock, ArrowUpDown, Coins, Target, Trophy, Layers, Filter, Rocket, LineChart, Image, Shield, Sparkles, Repeat, HeartHandshake, Code2, Briefcase, Gift } from 'lucide-react'
import { getWeekRange, getMonthRange, formatDate } from '@/utils/dateUtils'
import { useUsers } from '@/hooks/useUsers'
import { useAccessControl } from '@/hooks/useAccessControl'
import { calculatePoolShare, getTotalAmount } from '@/utils/earningsCalculations'
import Avatar from '@/components/Avatar'

// Утилиты для работы с датами
const getPeriodDates = (period: EarningsPeriod): { start: string; end: string } => {
  const now = new Date()
  const today = formatDate(now, 'yyyy-MM-dd')
  
  switch (period) {
    case 'day':
      return { start: today, end: today }
    case 'week': {
      const weekRange = getWeekRange()
      return { start: formatDate(weekRange.start, 'yyyy-MM-dd'), end: formatDate(weekRange.end, 'yyyy-MM-dd') }
    }
    case 'month': {
      const monthRange = getMonthRange(new Date())
      return { start: formatDate(monthRange.start, 'yyyy-MM-dd'), end: formatDate(monthRange.end, 'yyyy-MM-dd') }
    }
    case '3months': {
      const start = new Date(now.getFullYear(), now.getMonth() - 3, 1)
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      return { start: formatDate(start, 'yyyy-MM-dd'), end: formatDate(end, 'yyyy-MM-dd') }
    }
    case '6months': {
      const start = new Date(now.getFullYear(), now.getMonth() - 6, 1)
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      return { start: formatDate(start, 'yyyy-MM-dd'), end: formatDate(end, 'yyyy-MM-dd') }
    }
    case '12months': {
      const start = new Date(now.getFullYear() - 1, now.getMonth(), 1)
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      return { start: formatDate(start, 'yyyy-MM-dd'), end: formatDate(end, 'yyyy-MM-dd') }
    }
    case 'all':
    default:
      return { start: '2020-01-01', end: today }
  }
}

// Все категории для отображения (без 'other')
const ALL_CATEGORIES: EarningsCategory[] = [
  'memecoins_trading',
  'memecoins_deving',
  'polymarket',
  'spot',
  'futures',
  'prop_trading',
  'nft',
  'staking',
  'airdrop',
  'p2p',
  'p2c',
  'funds'
]

export const Earnings = () => {
  const { theme } = useThemeStore()
  const { user: currentUser } = useAuthStore()
  const [showForm, setShowForm] = useState(false)
  const [editingEarning, setEditingEarning] = useState<EarningsType | null>(null)
  const [earnings, setEarnings] = useState<EarningsType[]>([])
  const [loading, setLoading] = useState(true)
  
  // Периоды
  const [sharesPeriod, setSharesPeriod] = useState<EarningsPeriod>('month')
  const [detailsPeriod, setDetailsPeriod] = useState<EarningsPeriod>('month')
  
  // UI состояния
  const [showSharesDropdown, setShowSharesDropdown] = useState(false)
  const [showDetailsDropdown, setShowDetailsDropdown] = useState(false)
  const [expandedMember, setExpandedMember] = useState<string | null>(null)
  const [showAllEarnings, setShowAllEarnings] = useState(false)

  // Access Control Hooks
  const pageAccess = useAccessControl('arca_profit')
  const statsAccess = useAccessControl('profit_stats_view')
  const addAccess = useAccessControl('profit_add')
  const leadersAccess = useAccessControl('profit_leaders_view')
  const historyAccess = useAccessControl('profit_history_view')

  const { users: allMembers } = useUsers()

  // Функции для расчёта с учётом extraWalletsCount
  const getPoolValue = (earning: EarningsType) => {
    // Если есть сохранённый poolAmount - используем его
    if (earning.poolAmount) return earning.poolAmount
    
    // Иначе вычисляем с учётом extraWalletsCount
    const totalAmount = getTotalAmount(earning.amount, earning.extraWalletsCount, earning.walletType)
    const category = earning.category as EarningsCategory
    const { poolShare } = calculatePoolShare(totalAmount, category, earning.walletType || 'general')
    return poolShare
  }
  
  const getNetValue = (earning: EarningsType) => {
    const totalAmount = getTotalAmount(earning.amount, earning.extraWalletsCount, earning.walletType)
    const pool = getPoolValue(earning)
    return Math.max(totalAmount - pool, 0)
  }
  const getParticipants = (earning: EarningsType) => earning.participants?.length ? earning.participants : [earning.userId]

  // Проверка, что earning одобрен (для фильтрации)
  const isApprovedEarning = (e: EarningsType) => e.status === 'approved' || !e.status

  // Статистика за всё время для таблицы "Сферы - Сумма - В пул"
  const allTimeStats = useMemo(() => {
    return ALL_CATEGORIES.map(category => {
      const items = earnings.filter((e) => e.category === category && isApprovedEarning(e))
      // gross - полная сумма с учётом extraWalletsCount (грязная, для общей статистики)
      const gross = items.reduce((sum, e) => sum + getTotalAmount(e.amount, e.extraWalletsCount, e.walletType), 0)
      const pool = items.reduce((sum, e) => sum + getPoolValue(e), 0)

      return {
        key: category,
        gross,
        pool,
      }
    })
  }, [earnings])

  // Персональная статистика по категориям для текущего пользователя
  const calculatePersonalCategoryStats = (period: EarningsPeriod, userId: string) => {
    const { start, end } = getPeriodDates(period)
    const periodEarnings = earnings.filter((e: EarningsType) => 
      e.date >= start && e.date <= end && 
      getParticipants(e).includes(userId) &&
      isApprovedEarning(e)
    )
    
    return ALL_CATEGORIES.map(category => {
      const items = periodEarnings.filter((e) => e.category === category)
      // gross - полная сумма с учётом extraWalletsCount (грязная)
      const gross = items.reduce((sum, e) => {
        const totalAmount = getTotalAmount(e.amount, e.extraWalletsCount, e.walletType)
        const share = totalAmount / Math.max(getParticipants(e).length, 1)
        return sum + share
      }, 0)
      const pool = items.reduce((sum, e) => {
        const share = getPoolValue(e) / Math.max(getParticipants(e).length, 1)
        return sum + share
      }, 0)
      const net = items.reduce((sum, e) => {
        const share = getNetValue(e) / Math.max(getParticipants(e).length, 1)
        return sum + share
      }, 0)

      return {
        key: category,
        gross,
        pool,
        net,
        count: items.length,
      }
    })
  }

  // Статистика по периодам для долей (персонально для текущего пользователя)
  const sharesStats = useMemo(() => 
    currentUser ? calculatePersonalCategoryStats(sharesPeriod, currentUser.id) : [],
    [earnings, sharesPeriod, currentUser]
  )
  const detailsStats = useMemo(() => 
    currentUser ? calculatePersonalCategoryStats(detailsPeriod, currentUser.id) : [],
    [earnings, detailsPeriod, currentUser]
  )

  // Общие суммы за период для долей
  const sharesTotal = sharesStats.reduce((sum, cat) => sum + cat.net, 0)
  const sharesWithShares = ALL_CATEGORIES.map(catKey => {
    const stat = sharesStats.find(s => s.key === catKey)!
    return {
      ...stat,
      share: sharesTotal > 0 ? (stat.net / sharesTotal) * 100 : 0
    }
  }).sort((a, b) => b.net - a.net)

  // Общие суммы за период для детализации
  const detailsTotal = detailsStats.reduce((sum, cat) => sum + cat.net, 0)
  const detailsWithShares = ALL_CATEGORIES.map(catKey => {
    const stat = detailsStats.find(s => s.key === catKey)!
    return {
      ...stat,
      share: detailsTotal > 0 ? (stat.net / detailsTotal) * 100 : 0
    }
  }).sort((a, b) => b.net - a.net)

  // Общая статистика за текущий месяц (для карточек сверху)
  const currentMonthStats = useMemo(() => {
    const { start, end } = getPeriodDates('month')
    const monthEarnings = earnings.filter((e: EarningsType) => e.date >= start && e.date <= end && isApprovedEarning(e))
    
    return {
      // total - полная сумма с учётом extraWalletsCount
      total: monthEarnings.reduce((sum, e) => sum + getTotalAmount(e.amount, e.extraWalletsCount, e.walletType), 0),
      pool: monthEarnings.reduce((sum, e) => sum + getPoolValue(e), 0),
      net: monthEarnings.reduce((sum, e) => sum + getNetValue(e), 0),
    }
  }, [earnings])

  // Статистика за текущую неделю
  const currentWeekStats = useMemo(() => {
    const { start, end } = getPeriodDates('week')
    const weekEarnings = earnings.filter((e: EarningsType) => e.date >= start && e.date <= end && isApprovedEarning(e))
    
    return {
      // total - полная сумма с учётом extraWalletsCount
      total: weekEarnings.reduce((sum, e) => sum + getTotalAmount(e.amount, e.extraWalletsCount, e.walletType), 0),
      pool: weekEarnings.reduce((sum, e) => sum + getPoolValue(e), 0),
      net: weekEarnings.reduce((sum, e) => sum + getNetValue(e), 0),
    }
  }, [earnings])

  // Рейтинг участников с детализацией по сферам
  const contributorRanking = useMemo(() => {
    return allMembers.map((member) => {
      const related = earnings.filter((e) => getParticipants(e).includes(member.id) && isApprovedEarning(e))
      
      // Общие показатели
      const net = related.reduce((sum, e) => {
        const share = getNetValue(e) / Math.max(getParticipants(e).length, 1)
        return sum + share
      }, 0)
      
      const poolShare = related.reduce((sum, e) => {
        const share = getPoolValue(e) / Math.max(getParticipants(e).length, 1)
        return sum + share
      }, 0)
      
      // grossContribution - полная сумма с учётом extraWalletsCount (для индивидуальной статистики)
      const grossContribution = related.reduce((sum, e) => {
        const totalAmount = getTotalAmount(e.amount, e.extraWalletsCount, e.walletType)
        const share = totalAmount / Math.max(getParticipants(e).length, 1)
        return sum + share
      }, 0)

      // Детализация по сферам
      const sphereDetails = ALL_CATEGORIES.map(category => {
        const sphereEarnings = related.filter(e => e.category === category)
        if (sphereEarnings.length === 0) return null

        // sphereGross - полная сумма с учётом extraWalletsCount
        const sphereGross = sphereEarnings.reduce((sum, e) => {
          const totalAmount = getTotalAmount(e.amount, e.extraWalletsCount, e.walletType)
          const share = totalAmount / Math.max(getParticipants(e).length, 1)
          return sum + share
        }, 0)

        const spherePool = sphereEarnings.reduce((sum, e) => {
          const share = getPoolValue(e) / Math.max(getParticipants(e).length, 1)
          return sum + share
        }, 0)

        const sphereNet = sphereEarnings.reduce((sum, e) => {
          const share = getNetValue(e) / Math.max(getParticipants(e).length, 1)
          return sum + share
        }, 0)

        return {
          category,
          gross: sphereGross,
          pool: spherePool,
          net: sphereNet,
        }
      }).filter(Boolean)

      return { 
        ...member, 
        net, 
        poolShare, 
        grossContribution,
        sphereDetails: sphereDetails as { category: EarningsCategory; gross: number; pool: number; net: number }[]
      }
    }).sort((a, b) => b.net - a.net)
  }, [earnings, allMembers])

  // Загрузка данных
  useEffect(() => {
    loadEarnings()
  }, [])

  const loadEarnings = async () => {
    setLoading(true)
    try {
      const allEarnings = await getEarnings()
      setEarnings(allEarnings)
    } catch (error) {
      console.error('Error loading earnings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (earning: EarningsType) => {
    setEditingEarning(earning)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingEarning(null)
  }

  const handleSave = () => {
    setShowForm(false)
    setEditingEarning(null)
    loadEarnings()
  }

  // Отображение записей - ограничим 50 если не показаны все
  // Фильтруем только одобренные записи для отображения
  const approvedEarnings = earnings.filter(e => e.status === 'approved' || !e.status)
  const pendingEarnings = earnings.filter(e => e.status === 'pending')
  const displayedEarnings = showAllEarnings ? approvedEarnings : approvedEarnings.slice(0, 50)

  if (pageAccess.loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    )
  }

  if (!pageAccess.hasAccess) {
    return (
      <div className="py-20 text-center space-y-4">
        <Lock className="w-16 h-16 text-gray-700 mx-auto opacity-20" />
        <h3 className={`text-xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Доступ к ARCA — Profit ограничен</h3>
        <p className="text-gray-500 max-w-md mx-auto">{pageAccess.reason || 'У вас нет доступа к мониторингу доходов.'}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#4C7F6E]/10 rounded-2xl border border-[#4C7F6E]/20">
              <DollarSign className="w-8 h-8 text-[#4C7F6E]" />
            </div>
            <div>
              <h1 className={`text-2xl md:text-3xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                P&L
              </h1>
              <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Мониторинг доходов и распределение пула
              </p>
            </div>
          </div>
          {addAccess.hasAccess && (
            <button
              onClick={() => setShowForm(true)}
              className="w-full md:w-auto flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-[#4C7F6E] hover:bg-[#3d6b5a] text-white font-bold text-sm transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[#4C7F6E]/20"
            >
              <Plus className="w-5 h-5" />
              <span>Добавить заработок</span>
            </button>
          )}
        </div>

        {/* Stats Grid */}
        {statsAccess.hasAccess && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: 'НЕДЕЛЯ (ЧИСТЫМИ)',
                value: `${currentWeekStats.net.toLocaleString()} ₽`,
                icon: <TrendingUp className="w-5 h-5 text-emerald-400" />,
                bgClass: 'bg-emerald-500/5',
                borderClass: 'border-emerald-500/10'
              },
              {
                label: 'НЕДЕЛЯ (ПУЛ)',
                value: `${currentWeekStats.pool.toLocaleString()} ₽`,
                icon: <Coins className="w-5 h-5 text-blue-400" />,
                bgClass: 'bg-blue-500/5',
                borderClass: 'border-blue-500/10'
              },
              {
                label: 'МЕСЯЦ (ЧИСТЫМИ)',
                value: `${currentMonthStats.net.toLocaleString()} ₽`,
                icon: <Wallet className="w-5 h-5 text-purple-400" />,
                bgClass: 'bg-purple-500/5',
                borderClass: 'border-purple-500/10'
              },
              {
                label: 'МЕСЯЦ (ПУЛ)',
                value: `${currentMonthStats.pool.toLocaleString()} ₽`,
                icon: <Target className="w-5 h-5 text-orange-400" />,
                bgClass: 'bg-orange-500/5',
                borderClass: 'border-orange-500/10',
              }
            ].map((item, idx) => (
              <div
                key={idx}
                className={`relative overflow-hidden rounded-2xl p-5 border transition-all duration-300 hover:shadow-xl group ${theme === 'dark'
                  ? `${item.bgClass} ${item.borderClass} hover:border-white/20`
                  : 'bg-white border-gray-100 hover:border-emerald-500/20 shadow-sm'
                  }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-[10px] font-black uppercase tracking-widest text-gray-500`}>{item.label}</span>
                  {item.icon}
                </div>
                <p className={`text-xl font-black leading-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{item.value}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Split layout: Shares vs Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Shares */}
        <div className={`lg:col-span-3 relative overflow-hidden rounded-3xl p-6 ${theme === 'dark' ? 'bg-[#0b1015] border-white/5' : 'bg-white border-gray-100'} border shadow-2xl`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#4E6E49]/5 blur-3xl rounded-full -mr-32 -mt-32" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#4E6E49]/10 rounded-lg">
                  <PieChart className="w-5 h-5 text-[#4E6E49]" />
                </div>
                <h3 className={`text-sm font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Доли заработка (персонально)</h3>
              </div>
            </div>

            {/* Period Selector */}
            <div className="relative mb-6">
              <button
                onClick={() => setShowSharesDropdown(!showSharesDropdown)}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'} transition-all`}
              >
                <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {EARNINGS_PERIODS[sharesPeriod].label}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showSharesDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showSharesDropdown && (
                <div className={`absolute top-full left-0 right-0 mt-2 rounded-xl border overflow-hidden z-20 ${theme === 'dark' ? 'bg-[#0b1015] border-white/10' : 'bg-white border-gray-200'} shadow-xl`}>
                  {(Object.keys(EARNINGS_PERIODS) as EarningsPeriod[]).map((period) => (
                    <button
                      key={period}
                      onClick={() => {
                        setSharesPeriod(period)
                        setShowSharesDropdown(false)
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm font-medium transition-all ${sharesPeriod === period ? 'bg-emerald-500/10 text-emerald-500' : theme === 'dark' ? 'text-gray-300 hover:bg-white/5' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      {EARNINGS_PERIODS[period].label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-4">
              {sharesWithShares.map((cat) => {
                const meta = EARNINGS_CATEGORY_META[cat.key]
                const barColor = `bg-${meta.accent}-500`
                
                const getCategoryIcon = (iconType: string) => {
                  const iconClass = "w-3.5 h-3.5"
                  const colorClass = `text-${meta.accent}-400`
                  switch (iconType) {
                    case 'rocket':
                      return <Rocket className={`${iconClass} ${colorClass}`} />
                    case 'code':
                      return <Code2 className={`${iconClass} ${colorClass}`} />
                    case 'barchart':
                      return <BarChart3 className={`${iconClass} ${colorClass}`} />
                    case 'coins':
                      return <Coins className={`${iconClass} ${colorClass}`} />
                    case 'line':
                      return <LineChart className={`${iconClass} ${colorClass}`} />
                    case 'briefcase':
                      return <Briefcase className={`${iconClass} ${colorClass}`} />
                    case 'image':
                      return <Image className={`${iconClass} ${colorClass}`} />
                    case 'shield':
                      return <Shield className={`${iconClass} ${colorClass}`} />
                    case 'gift':
                      return <Gift className={`${iconClass} ${colorClass}`} />
                    case 'repeat':
                      return <Repeat className={`${iconClass} ${colorClass}`} />
                    case 'handshake':
                      return <HeartHandshake className={`${iconClass} ${colorClass}`} />
                    case 'sparkles':
                      return <Sparkles className={`${iconClass} ${colorClass}`} />
                    default:
                      return <Sparkles className={`${iconClass} ${colorClass}`} />
                  }
                }
                
                return (
                  <div key={cat.key} className="space-y-2">
                    <div className="flex justify-between items-center text-[11px] font-black">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(meta.icon)}
                        <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>{meta.label}</span>
                      </div>
                      <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>{cat.share.toFixed(0)}%</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${barColor}`}
                        style={{ width: `${cat.share}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right: Category Details Grid */}
        <div className={`lg:col-span-9 relative overflow-hidden rounded-3xl p-6 ${theme === 'dark' ? 'bg-[#0b1015] border-white/5' : 'bg-white border-gray-100'} border shadow-2xl`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-3xl rounded-full -mr-32 -mt-32" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className={`text-sm font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Детализация дохода по сферам (персонально)</h3>
              </div>
              
              {/* Period Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowDetailsDropdown(!showDetailsDropdown)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'} transition-all`}
                >
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {EARNINGS_PERIODS[detailsPeriod].label}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showDetailsDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {showDetailsDropdown && (
                  <div className={`absolute top-full right-0 mt-2 rounded-xl border overflow-hidden z-20 ${theme === 'dark' ? 'bg-[#0b1015] border-white/10' : 'bg-white border-gray-200'} shadow-xl min-w-[160px]`}>
                    {(Object.keys(EARNINGS_PERIODS) as EarningsPeriod[]).map((period) => (
                      <button
                        key={period}
                        onClick={() => {
                          setDetailsPeriod(period)
                          setShowDetailsDropdown(false)
                        }}
                        className={`w-full px-4 py-2.5 text-left text-sm font-medium transition-all ${detailsPeriod === period 
                          ? 'bg-emerald-500/10 text-emerald-500' 
                          : theme === 'dark' ? 'text-gray-300 hover:bg-white/5' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {EARNINGS_PERIODS[period].label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" style={{ minHeight: '400px' }}>
              {detailsWithShares.map((cat) => {
                const meta = EARNINGS_CATEGORY_META[cat.key]
                
                const getCategoryIcon = (iconType: string) => {
                  const iconClass = "w-4 h-4"
                  const colorClass = `text-${meta.accent}-400`
                  switch (iconType) {
                    case 'rocket':
                      return <Rocket className={`${iconClass} ${colorClass}`} />
                    case 'code':
                      return <Code2 className={`${iconClass} ${colorClass}`} />
                    case 'barchart':
                      return <BarChart3 className={`${iconClass} ${colorClass}`} />
                    case 'coins':
                      return <Coins className={`${iconClass} ${colorClass}`} />
                    case 'line':
                      return <LineChart className={`${iconClass} ${colorClass}`} />
                    case 'briefcase':
                      return <Briefcase className={`${iconClass} ${colorClass}`} />
                    case 'image':
                      return <Image className={`${iconClass} ${colorClass}`} />
                    case 'shield':
                      return <Shield className={`${iconClass} ${colorClass}`} />
                    case 'gift':
                      return <Gift className={`${iconClass} ${colorClass}`} />
                    case 'repeat':
                      return <Repeat className={`${iconClass} ${colorClass}`} />
                    case 'handshake':
                      return <HeartHandshake className={`${iconClass} ${colorClass}`} />
                    case 'sparkles':
                      return <Sparkles className={`${iconClass} ${colorClass}`} />
                    default:
                      return <Sparkles className={`${iconClass} ${colorClass}`} />
                  }
                }
                
                return (
                  <div key={cat.key} className={`flex flex-col p-5 rounded-2xl border ${theme === 'dark' ? 'bg-white/5 border-white/5 shadow-inner' : 'bg-gray-50 border-gray-100'}`}>
                    <div className="flex items-center gap-2 mb-4">
                      {getCategoryIcon(meta.icon)}
                      <span className={`text-xs font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{meta.label}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-[9px] font-black text-gray-500 uppercase mb-1">ЧИСТЫМИ</p>
                        <p className={`text-sm font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{cat.net.toLocaleString()} ₽</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] font-black text-gray-500 uppercase mb-1">В ПУЛ</p>
                        <p className={`text-sm font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{cat.pool.toLocaleString()} ₽</p>
                      </div>
                    </div>

                    <div className="mt-auto">
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-${meta.accent.toString()}-500`}
                          style={{ width: `${cat.share}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Таблица "Сферы - Сумма - В пул за всё время" */}
      <div className={`relative overflow-hidden rounded-3xl p-6 ${theme === 'dark' ? 'bg-[#0b1015] border-white/5' : 'bg-white border-gray-100'} border shadow-2xl`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 blur-3xl rounded-full -mr-32 -mt-32" />
        <div className="relative z-10">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Layers className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className={`text-sm font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Общая статистика по сферам (за всё время)
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={theme === 'dark' ? 'border-b border-white/10' : 'border-b border-gray-100'}>
                  <th className={`text-center text-[10px] font-black uppercase tracking-widest pb-3 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Сфера</th>
                  <th className={`text-center text-[10px] font-black uppercase tracking-widest pb-3 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Заработано</th>
                  <th className={`text-center text-[10px] font-black uppercase tracking-widest pb-3 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Внесено в пул</th>
                </tr>
              </thead>
              <tbody>
                {allTimeStats.map((stat) => {
                  const meta = EARNINGS_CATEGORY_META[stat.key]
                  
                  // Иконки для всех категорий
                  const getCategoryIcon = (iconType: string) => {
                    const iconClass = "w-4 h-4"
                    const colorClass = `text-${meta.accent}-400`
                    switch (iconType) {
                      case 'rocket':
                        return <Rocket className={`${iconClass} ${colorClass}`} />
                      case 'code':
                        return <Code2 className={`${iconClass} ${colorClass}`} />
                      case 'barchart':
                        return <BarChart3 className={`${iconClass} ${colorClass}`} />
                      case 'coins':
                        return <Coins className={`${iconClass} ${colorClass}`} />
                      case 'line':
                        return <LineChart className={`${iconClass} ${colorClass}`} />
                      case 'briefcase':
                        return <Briefcase className={`${iconClass} ${colorClass}`} />
                      case 'image':
                        return <Image className={`${iconClass} ${colorClass}`} />
                      case 'shield':
                        return <Shield className={`${iconClass} ${colorClass}`} />
                      case 'parachute':
                        return <Gift className={`${iconClass} ${colorClass}`} />
                      case 'repeat':
                        return <Repeat className={`${iconClass} ${colorClass}`} />
                      case 'handshake':
                        return <HeartHandshake className={`${iconClass} ${colorClass}`} />
                      case 'sparkles':
                        return <Sparkles className={`${iconClass} ${colorClass}`} />
                      default:
                        return <Sparkles className={`${iconClass} ${colorClass}`} />
                    }
                  }
                  
                  return (
                    <tr key={stat.key} className={`${theme === 'dark' ? 'border-b border-white/5' : 'border-b border-gray-50'} hover:bg-white/5 transition-colors`}>
                      <td className="py-4">
                        <div className="flex items-center justify-center gap-3">
                          {getCategoryIcon(meta.icon)}
                          <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{meta.label}</span>
                        </div>
                      </td>
                      <td className={`py-4 text-center text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {stat.gross.toLocaleString()} ₽
                      </td>
                      <td className={`py-4 text-center text-sm font-bold text-blue-400`}>
                        {stat.pool.toLocaleString()} ₽
                      </td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr className={theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}>
                  <td className={`py-4 text-center text-sm font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Результаты</td>
                  <td className={`py-4 text-center text-sm font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {allTimeStats.reduce((sum, s) => sum + s.gross, 0).toLocaleString()} ₽
                  </td>
                  <td className={`py-4 text-center text-sm font-bold text-blue-400`}>
                    {allTimeStats.reduce((sum, s) => sum + s.pool, 0).toLocaleString()} ₽
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      {/* Лидеры по доходу с детализацией по сферам */}
      {leadersAccess.hasAccess && (
        <div className={`relative overflow-hidden rounded-3xl p-6 ${theme === 'dark' ? 'bg-[#0b1015] border-white/5' : 'bg-white border-gray-100'} border shadow-2xl`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-3xl rounded-full -mr-32 -mt-32" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <Trophy className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className={`text-sm font-black uppercase tracking-widest ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Лидеры по доходу
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {contributorRanking.filter(m => m.grossContribution > 0).slice(0, 12).map((member) => (
                <div
                  key={member.id}
                  className={`rounded-2xl border overflow-hidden ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}
                >
                  {/* Header */}
                  <div className={`p-4 border-b ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'}`}>
                    <div className="flex items-center gap-3">
                      <Avatar user={member} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-black truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{member.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-emerald-500 font-bold">{member.net.toLocaleString()} ₽</span>
                          <span className={`text-[10px] ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>чистыми</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick stats */}
                  <div className="grid grid-cols-2 gap-px bg-white/5">
                    <div className={`p-3 ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                      <p className="text-[9px] font-black text-gray-500 uppercase">Заработано</p>
                      <p className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{member.grossContribution.toLocaleString()} ₽</p>
                    </div>
                    <div className={`p-3 ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                      <p className="text-[9px] font-black text-gray-500 uppercase">В пул</p>
                      <p className={`text-sm font-bold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{member.poolShare.toLocaleString()} ₽</p>
                    </div>
                  </div>

                  {/* Expand button */}
                  {member.sphereDetails && member.sphereDetails.length > 0 && (
                    <button
                      onClick={() => setExpandedMember(expandedMember === member.id ? null : member.id)}
                      className={`w-full p-2 text-xs font-medium transition-all flex items-center justify-center gap-1 ${
                        theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <ArrowUpDown className="w-3 h-3" />
                      {expandedMember === member.id ? 'Скрыть' : 'По сферам'}
                    </button>
                  )}

                  {/* Expanded sphere details */}
                  {expandedMember === member.id && member.sphereDetails && (
                    <div className={`p-3 space-y-2 border-t ${theme === 'dark' ? 'border-white/5 bg-white/[0.02]' : 'border-gray-100 bg-gray-50'}`}>
                      {member.sphereDetails.map((sphere) => {
                        const meta = EARNINGS_CATEGORY_META[sphere.category]
                        if (sphere.gross === 0) return null
                        return (
                          <div key={sphere.category} className="flex items-center justify-between text-[10px]">
                            <div className="flex items-center gap-1.5">
                              <div className={`w-1.5 h-1.5 rounded-full bg-${meta.accent.toString()}-500`} />
                              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>{meta.shortName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}>{sphere.gross.toLocaleString()} →</span>
                              <span className="text-emerald-500 font-bold">{sphere.net.toLocaleString()}</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* История записей */}
      {historyAccess.hasAccess && (
        <div className="pt-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-xl">
                <Filter className="w-5 h-5 text-emerald-500" />
              </div>
              <h3 className={`text-lg font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Все записи о заработке
              </h3>
            </div>
            {approvedEarnings.length > 50 && (
              <button
                onClick={() => setShowAllEarnings(!showAllEarnings)}
                className="text-sm font-medium text-emerald-500 hover:text-emerald-400 transition-colors"
              >
                {showAllEarnings ? 'Показать последние 50' : `Показать все (${approvedEarnings.length})`}
              </button>
            )}
          </div>
          
          {/* Pending earnings notification */}
          {pendingEarnings.length > 0 && (
            <div className={`mb-4 p-4 rounded-xl border ${theme === 'dark' ? 'bg-amber-500/10 border-amber-500/20' : 'bg-amber-50 border-amber-200'}`}>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-bold text-amber-500 mb-1`}>Ожидает согласования</p>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    У вас есть {pendingEarnings.length} {pendingEarnings.length === 1 ? 'запись' : 'записи'} на согласовании. Они появятся в P&L после одобрения администратором.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {loading ? (
            <div className={`rounded-2xl p-12 text-center border border-dashed ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'}`}>
              <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Загрузка данных...</p>
              </div>
            </div>
          ) : (
            <EarningsList
              earnings={displayedEarnings}
              onEdit={handleEdit}
              onDelete={loadEarnings}
            />
          )}
        </div>
      )}

      {showForm && (
        <EarningsForm
          onClose={handleCloseForm}
          onSave={handleSave}
          editingEarning={editingEarning}
        />
      )}
    </div>
  )
}
