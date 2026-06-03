import { useState, useEffect, useMemo, useCallback, type JSX } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { CallForm } from '@/components/Call/CallForm'
import { CustomSelect } from '@/components/Call/CustomSelect'
import { MemecoinCallCard } from '@/components/Call/MemecoinCallCard'
import { getCalls, deleteCall, updateCall } from '@/services/firestoreService'
import type { Call, CallCategory } from '@/types'
import { useUsers } from '@/hooks/useUsers'
import { useAutoUpdateMemecoinCalls } from '@/hooks/useAutoUpdateMemecoinCalls'
import { useCleanupOldCalls } from '@/hooks/useCleanupOldCalls'
import {
 X,
 Edit,
 Trash2,
 Search,
 Sparkles,
 Copy,
 Rocket,
 LineChart,
 Coins,
 AlertTriangle,
 Activity,
 Gauge,
 User,
 Zap,
 CheckCircle2,
 XCircle,
 History,
 Clock,
 TrendingUp,
 Flame,
 Target,
 Layers,
 Radio,
 Hexagon,
 ExternalLink,
 Lock
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useScrollLock } from '@/hooks/useScrollLock'
import { useAccessControl } from '@/hooks/useAccessControl'
import { useLocation, useNavigate } from 'react-router-dom'

type StatusFilter = 'all' | 'active' | 'completed' | 'cancelled' | 'reviewed'
type RelevanceFilter = 'all' | 'relevant' | 'not_relevant' // Актуален / Неактуален (только для мемкоинов)

const CATEGORY_ORDER: CallCategory[] = ['memecoins', 'polymarket', 'spot', 'futures']

// Updated CATEGORY_META with cardGradient - Enhanced with neon effects
const CATEGORY_META: Record<CallCategory, { label: string; gradient: string; gradientDark: string; chip: string; icon: JSX.Element; cardGradient: string; glowColor: string }> = {
  memecoins: {
    label: 'Мемкоины',
    gradient: 'from-teal-400 via-cyan-500 to-emerald-400',
    gradientDark: 'from-teal-500 via-cyan-600 to-emerald-500',
    chip: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
    icon: <Rocket className="w-5 h-5" />,
    cardGradient: 'from-teal-500/20 via-cyan-500/10 to-emerald-500/5',
    glowColor: 'shadow-teal-500/25'
  },
  futures: {
    label: 'Фьючерсы',
    gradient: 'from-blue-400 via-indigo-500 to-cyan-400',
    gradientDark: 'from-blue-500 via-indigo-600 to-cyan-500',
    chip: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    icon: <LineChart className="w-5 h-5" />,
    cardGradient: 'from-blue-500/20 via-indigo-500/10 to-cyan-500/5',
    glowColor: 'shadow-blue-500/25'
  },
  spot: {
    label: 'Спот',
    gradient: 'from-amber-400 via-orange-500 to-yellow-400',
    gradientDark: 'from-amber-500 via-orange-600 to-yellow-500',
    chip: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    icon: <Coins className="w-5 h-5" />,
    cardGradient: 'from-amber-500/20 via-orange-500/10 to-yellow-500/5',
    glowColor: 'shadow-amber-500/25'
  },
  polymarket: {
    label: 'Polymarket',
    gradient: 'from-rose-400 via-red-500 to-orange-400',
    gradientDark: 'from-rose-500 via-red-600 to-orange-500',
    chip: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    icon: <Gauge className="w-5 h-5" />,
    cardGradient: 'from-rose-500/20 via-red-500/10 to-orange-500/5',
    glowColor: 'shadow-rose-500/25'
  },
}

export const CallPage = () => {
  const { theme } = useThemeStore()
  const { user } = useAuthStore()
  const isAdmin = user?.id === '1'
  const [calls, setCalls] = useState<Call[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteCallId, setDeleteCallId] = useState<string | null>(null)
  const [cancelCallId, setCancelCallId] = useState<string | null>(null)
  const [editingCall, setEditingCall] = useState<Call | null>(null)
  const [formCategory, setFormCategory] = useState<CallCategory>('memecoins')
  const [showCategorySelector, setShowCategorySelector] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter] = useState<StatusFilter>('all')
  const [relevanceFilter, setRelevanceFilter] = useState<RelevanceFilter>('all')
  const [categoryFilter, setCategoryFilter] = useState<'all' | CallCategory>('all')
  const [traderFilter, setTraderFilter] = useState<'all' | string>('all')

  // Для модального окна "поделиться"
  const [viewCallId, setViewCallId] = useState<string | null>(null)
  const [viewCall, setViewCall] = useState<Call | null>(null)
  const location = useLocation()
  const navigate = useNavigate()

  // Access Control Hooks
  const pageAccess = useAccessControl('arca_hub')
  const addSignalAccess = useAccessControl('hub_signals_add')

  // Category-specific access
  const memecoinsAccess = useAccessControl('hub_signals_cat_memecoins')
  const polymarketAccess = useAccessControl('hub_signals_cat_polymarket')
  const spotAccess = useAccessControl('hub_signals_cat_spot')
  const futuresAccess = useAccessControl('hub_signals_cat_futures')

  const categoryAccess: Record<CallCategory, boolean> = {
    memecoins: memecoinsAccess.hasAccess,
    polymarket: polymarketAccess.hasAccess,
    spot: spotAccess.hasAccess,
    futures: futuresAccess.hasAccess
  }

  useScrollLock(showForm || showDeleteModal || !!cancelCallId || !!viewCallId)

  // Автоматическое обновление данных мемкоинов каждые 5 минут
  const handleCallUpdate = useCallback((callId: string, updates: Partial<Call>) => {
    setCalls((prevCalls) =>
      prevCalls.map((call) =>
        call.id === callId ? { ...call, ...updates } : call
      )
    )
  }, [])

  useAutoUpdateMemecoinCalls(calls, handleCallUpdate, 60, 50, -90) // 60 секунд

  // Автоматическая очистка старых закрытых сигналов (раз в 5 минут)
  useCleanupOldCalls(5, 3) // 3 часа

  useEffect(() => {
    loadCalls()
  }, [])

  const loadCalls = async () => {
    setLoading(true)
    try {
      const fetchedCalls = await getCalls()
      setCalls(fetchedCalls)
    } catch (error) {
      console.error('Error loading calls:', error)
      setCalls([])
    } finally {
      setLoading(false)
    }
  }

  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const bgColor = theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-white'
  const subtleColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
  const borderColor = theme === 'dark' ? 'border-white/10' : 'border-gray-100'

  const handleSuccess = () => {
    setShowForm(false)
    setEditingCall(null)
    loadCalls()
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingCall(null)
  }

  const handleUpdateStatus = async (callId: string, status: 'active' | 'completed' | 'cancelled') => {
    try {
      const updates: Partial<Call> = { status }

      // При закрытии сигнала сохраняем время закрытия
      if (status === 'completed' || status === 'cancelled') {
        updates.closedAt = new Date().toISOString()
      }

      await updateCall(callId, updates)
      await loadCalls()
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Ошибка при обновлении статуса')
    }
  }

  const handleEdit = (call: Call) => {
    setEditingCall(call)
    setFormCategory(call.category)
    setShowForm(true)
  }

  const handleDeleteClick = (callId: string) => {
    setDeleteCallId(callId)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteCallId) return
    try {
      await deleteCall(deleteCallId)
      setShowDeleteModal(false)
      setDeleteCallId(null)
      loadCalls()
    } catch (error) {
      console.error('Error deleting call:', error)
      alert('Ошибка при удалении сигнала')
    }
  }

  const handleCancelConfirm = async () => {
    if (!cancelCallId) return
    try {
      await updateCall(cancelCallId, { status: 'cancelled' })
      setCancelCallId(null)
      loadCalls()
    } catch (error) {
      console.error('Error cancelling call:', error)
      alert('Ошибка при отмене сигнала')
    }
  }

  const getDetails = (call: Call) => (call.details as any)?.[call.category] || {}

  // Функция определения актуальности мемкоина
  // Актуален: еще не дал 50% с момента публикации
  // Неактуален: 
  // - MC удерживалась ниже $10,000 более 16 часов
  // - Профит 100% и более
  const isMemecoinRelevant = (call: Call): boolean => {
    if (call.category !== 'memecoins') return true
    
    const currentMC = call.currentMarketCap || 0
    const maxProfit = call.maxProfit || 0
    const publishedAt = call.publishedAt ? new Date(call.publishedAt).getTime() : (call.createdAt ? new Date(call.createdAt).getTime() : Date.now())
    const now = Date.now()
    const hoursSincePublication = (now - publishedAt) / (1000 * 60 * 60)
    
    // Неактуален если профит 100% и более
    if (maxProfit >= 100) return false
    
    // Неактуален если MC был ниже $10,000 более 16 часов
    if (currentMC < 10_000 && hoursSincePublication > 16) return false
    
    return true
  }

  // Обработка URL параметра callId для "поделиться"
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const callId = params.get('callId')
    
    if (callId && !viewCallId && calls.length > 0) {
      const call = calls.find(c => c.id === callId)
      if (call) {
        setViewCallId(callId)
        setViewCall(call)
      }
    }
  }, [location.search, calls, viewCallId])

  const closeViewModal = () => {
    setViewCallId(null)
    setViewCall(null)
    navigate(location.pathname, { replace: true })
  }

  const getPrimaryTitle = (call: Call) => {
    const d = getDetails(call)
    switch (call.category) {
      case 'memecoins':
        return d.contract ? `${d.contract.slice(0, 6)}...${d.contract.slice(-4)}` : 'Мемкоин'
      case 'futures':
        return d.pair || 'Фьючерс'
      case 'spot':
        return d.coin || 'Спот'
      case 'polymarket':
        return d.event || 'Polymarket событие'
      default:
        return 'Сигнал'
    }
  }

  const composeSearchString = (call: Call) => {
    const d = getDetails(call)
    const base = [
      call.category,
      call.status,
      call.comment,
      d.contract,
      d.pair,
      d.reason,
      d.targets,
      d.event,
      d.marketplace,
      d.platform,
      d.entryCap,
      d.entryZone,
      d.network,
    ]
    return base.filter(Boolean).join(' ').toLowerCase()
  }

  const filteredCalls = calls.filter((call) => {
if (statusFilter !== 'all' && call.status !== statusFilter) return false
  if (categoryFilter !== 'all' && call.category !== categoryFilter) return false
  if (traderFilter !== 'all' && call.userId !== traderFilter) return false
    if (!categoryAccess[call.category]) return false
    
    // Фильтр актуальности для мемкоинов
    if (relevanceFilter !== 'all' && call.category === 'memecoins') {
      const isRelevant = isMemecoinRelevant(call)
      if (relevanceFilter === 'relevant' && !isRelevant) return false
      if (relevanceFilter === 'not_relevant' && isRelevant) return false
    }
    
    if (searchQuery.trim()) {
      return composeSearchString(call).includes(searchQuery.toLowerCase())
    }
    return true
  })

  const totals = useMemo(() => ({
    total: calls.length,
    active: calls.filter((c) => c.status === 'active').length,
    completed: calls.filter((c) => c.status === 'completed').length,
    cancelled: calls.filter((c) => c.status === 'cancelled').length,
  }), [calls])

  // Prepare options for custom selectors
  const categoryOptions = [
    { value: 'all', label: 'Все сферы', icon: <Activity size={14} /> },
    ...CATEGORY_ORDER.map(cat => ({
      value: cat,
      label: CATEGORY_META[cat].label,
      icon: CATEGORY_META[cat].icon,
      chip: CATEGORY_META[cat].chip
    }))
  ]

  

  const relevanceOptions = [
    { value: 'all', label: 'Все', icon: <Activity size={14} /> },
    { value: 'relevant', label: 'Актуальны', icon: <Clock size={14} /> },
    { value: 'not_relevant', label: 'Неактуальны', icon: <Clock size={14} /> },
  ]

  // Get all users for trader options
  const { users: allMembers } = useUsers()

  const traderOptions = [
    { value: 'all', label: 'Все трейдеры', icon: <User size={16} /> },
    ...allMembers.map(t => ({
      value: t.id,
      label: t.name,
      meta: t.login,
      icon: t.avatar ? <img src={t.avatar} className="w-full h-full object-cover rounded-full" /> : <User size={10} />,
    }))
  ]

  if (pageAccess.loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          {/* Animated spinner */}
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-2 border-teal-500/20" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-teal-500 animate-spin" />
            <div className="absolute inset-2 rounded-full border border-teal-500/10" />
          </div>
          <p className={`text-sm font-medium ${subtleColor}`}>Загрузка HUB...</p>
        </div>
      </div>
    )
  }

  if (!pageAccess.hasAccess) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className={`relative max-w-md w-full p-8 rounded-3xl text-center ${
          theme === 'dark' 
            ? 'bg-[#0f1419] border border-white/10'
            : 'bg-white border border-gray-200'
        } shadow-2xl`}>
          {/* Animated background effect */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl">
            <div className="absolute top-0 left-1/4 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl" />
          </div>

          <div className="relative">
            {/* Lock Icon with Glow */}
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-full blur-2xl" />
              <div className={`relative w-full rounded-2xl flex items-center justify-center ${
                theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-gray-100 border border-gray-200'
              }`}>
                <Lock className={`w-10 h-10 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
              </div>
            </div>
            
            <h3 className={`text-2xl font-black mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              ARCA — HUB
            </h3>
            <p className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Доступ ограничен
            </p>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
              {pageAccess.reason || 'У вас нет доступа к торговым сигналам. Свяжитесь с администратором для получения доступа.'}
            </p>
            
            {/* Decorative line */}
            <div className="mt-6 flex items-center justify-center gap-2">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-teal-500/50" />
              <div className="w-2 h-2 rounded-full bg-teal-500/50" />
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-teal-500/50" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-20 relative">
      {/* Animated Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-teal-500/8 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-500/6 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[150px]" />
      </div>

      {/* Hero Header Section */}
      <div className="px-4 sm:px-6 lg:px-8 pt-4">
        <div className={`relative overflow-hidden rounded-3xl ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-[#0f1419] via-[#0a0f14] to-[#0d1218] border border-white/10' 
            : 'bg-gradient-to-br from-white via-gray-50 to-white border border-gray-200'
        } shadow-2xl`}>
          {/* Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-teal-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.1)_100%)]" />
          </div>

          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `linear-gradient(${theme === 'dark' ? '#fff' : '#000'} 1px, transparent 1px), linear-gradient(90deg, ${theme === 'dark' ? '#fff' : '#000'} 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }} />

          <div className="relative p-6 sm:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Left: Title & Description */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${theme === 'dark' ? 'from-teal-500 via-cyan-500 to-emerald-500' : 'from-teal-400 via-cyan-500 to-emerald-400'} flex items-center justify-center shadow-lg shadow-teal-500/30`}>
                    <Radio className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full animate-ping" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      ARCA HUB
                    </h1>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      theme === 'dark' 
                        ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30' 
                        : 'bg-teal-100 text-teal-600 border border-teal-200'
                    }`}>
                      Live
                    </span>
                  </div>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Торговые сигналы и аналитика
                  </p>
                </div>
              </div>
              
              {/* Right: Stats & Actions */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* Stats Pills */}
                <div className="flex flex-wrap gap-2">
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl ${
                    theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-gray-100 border border-gray-200'
                  }`}>
                    <Flame className="w-4 h-4 text-orange-400" />
                    <span className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{totals.active}</span>
                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>активных</span>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl ${
                    theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-gray-100 border border-gray-200'
                  }`}>
                    <CheckCircle2 className="w-4 h-4 text-teal-400" />
                    <span className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{totals.completed}</span>
                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>завершено</span>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl ${
                    theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-gray-100 border border-gray-200'
                  }`}>
                    <Layers className="w-4 h-4 text-blue-400" />
                    <span className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{totals.total}</span>
                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>всего</span>
                  </div>
                </div>

                {/* Add Signal Button */}
                {addSignalAccess.hasAccess && (
                  <button
                    onClick={() => {
                      setEditingCall(null)
                      setFormCategory('memecoins')
                      setShowCategorySelector(true)
                      setShowForm(true)
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white shadow-lg shadow-teal-500/25 transition-all hover:scale-105 active:scale-95 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400"
                  >
                    <Zap className="w-5 h-5" />
                    <span>Сигнал</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Quick Actions - Enhanced Cards */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mb-4">
          <h3 className={`text-sm font-semibold ${subtleColor} flex items-center gap-2`}>
            <Target className="w-4 h-4" />
            Создать сигнал
          </h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {CATEGORY_ORDER.filter(cat => categoryAccess[cat]).map((cat) => {
            const meta = CATEGORY_META[cat]
            const catGradient = theme === 'dark' ? meta.gradientDark : meta.gradient
            return (
              <button
                key={cat}
                onClick={() => {
                  setEditingCall(null)
                  setFormCategory(cat)
                  setShowCategorySelector(false)
                  setShowForm(true)
                }}
                className={`group relative overflow-hidden p-4 rounded-2xl border transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 ${
                  theme === 'dark'
                    ? 'bg-[#0f1419] border-white/10 hover:border-white/20 hover:shadow-xl'
                    : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-lg'
                } ${meta.glowColor}`}
              >
                {/* Gradient Overlay on Hover */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br ${meta.cardGradient}`} />
                
  <div className="relative flex flex-col items-center gap-3">
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-br ${catGradient} text-white shadow-lg`}>
      {meta.icon}
    </div>
                  <span className={`text-xs font-semibold truncate w-full text-center ${textColor}`}>
                    {meta.label}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Search & Filters Row */}
      <div className="px-4 sm:px-6 lg:px-8 relative z-20">
        <div className={`rounded-2xl p-4 ${
          theme === 'dark' 
            ? 'bg-[#0f1419]/80 backdrop-blur-xl border border-white/10' 
            : 'bg-white/80 backdrop-blur-xl border border-gray-200'
        } shadow-xl`}>
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${subtleColor}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по тикеру, событию, сети или причине..."
              className={`w-full pl-12 pr-4 py-3 rounded-xl border-0 ${
                theme === 'dark' 
                  ? 'bg-white/5 text-white placeholder-gray-500 focus:bg-white/10' 
                  : 'bg-gray-100 text-gray-900 placeholder-gray-400 focus:bg-gray-200'
              } focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all`}
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="w-full sm:w-auto min-w-[180px]">
              <CustomSelect
                value={categoryFilter}
                onChange={(val) => setCategoryFilter(val as any)}
                options={categoryOptions}
                placeholder="Все сферы"
                icon={<Hexagon size={16} />}
              />
            </div>

            <div className="w-full sm:w-auto min-w-[150px]">
              <CustomSelect
                value={relevanceFilter}
                onChange={(val) => setRelevanceFilter(val as any)}
                options={relevanceOptions}
                placeholder="Все"
                icon={<Clock size={16} />}
              />
            </div>

            <div className="w-full sm:w-auto min-w-[200px]">
              <CustomSelect
                value={traderFilter}
                onChange={(val) => setTraderFilter(val)}
                options={traderOptions}
                placeholder="Все трейдеры"
                searchable={true}
                icon={<User size={16} />}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Signals Feed Header */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${
              theme === 'dark' ? 'bg-teal-500/20' : 'bg-teal-100'
            }`}>
              <TrendingUp className="w-5 h-5 text-teal-500" />
            </div>
            <h2 className={`text-lg font-bold ${textColor}`}>Лента сигналов</h2>
          </div>
          <p className={`text-sm ${subtleColor}`}>
            <span className="font-semibold text-teal-400">{filteredCalls.length}</span> из {totals.active} активных
          </p>
        </div>
      </div>

      {/* Signals List - Enhanced Grid */}
      <div className="px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-center py-16">
            <div className="relative w-16 h-16 mx-auto mb-4">
              <div className="absolute inset-0 rounded-full border-4 border-teal-500/20" />
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-teal-500 animate-spin" />
            </div>
            <p className={subtleColor}>Загрузка сигналов...</p>
          </div>
        ) : filteredCalls.length === 0 ? (
          <div className={`text-center py-16 rounded-3xl ${
            theme === 'dark' 
              ? 'bg-[#0f1419]/50 border border-white/10' 
              : 'bg-gray-50 border border-gray-200'
          }`}>
            <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
              theme === 'dark' ? 'bg-white/5' : 'bg-gray-200'
            }`}>
              <Sparkles className={`w-10 h-10 ${subtleColor}`} />
            </div>
            <p className={`text-xl font-bold ${textColor} mb-2`}>Нет сигналов</p>
            <p className={subtleColor}>Попробуйте изменить фильтры</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 relative z-10">
            {filteredCalls.map((call) => {
              // Используем новый компонент для мемкоинов
              if (call.category === 'memecoins') {
                const trader = allMembers.find(t => t.id === call.userId)
                return (
                  <MemecoinCallCard
                    key={call.id}
                    call={call}
                    isAdmin={isAdmin}
                    onUpdateStatus={handleUpdateStatus}
                    onUpdateCall={handleCallUpdate}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                    onShare={(id) => {
                      const url = `${window.location.origin}/hub?callId=${id}`
                      navigator.clipboard.writeText(url)
                    }}
                    traderName={trader?.name}
                    traderAvatar={trader?.avatar}
                  />
                )
              }

 // Улучшенная карточка для остальных категорий (в стиле мемкоинов)
 const meta = CATEGORY_META[call.category]
 const details = getDetails(call)
 const trader = allMembers.find(t => t.id === call.userId)
 const isAuthorOrAdmin = isAdmin || user?.id === call.userId

 // Форматирование даты публикации
 const publishedAt = call.publishedAt || call.createdAt
 const publishedDate = publishedAt ? new Date(publishedAt) : null
 const formatPublishedDate = (date: Date) => {
 const day = date.getDate().toString().padStart(2, '0')
 const month = (date.getMonth() +1).toString().padStart(2, '0')
 const year = date.getFullYear()
 const hours = date.getHours().toString().padStart(2, '0')
 const minutes = date.getMinutes().toString().padStart(2, '0')
 return `${day}.${month}.${year} / ${hours}:${minutes}`
 }

 return (
<div
 className={`relative z-10 p-5 rounded-2xl border transition-all duration-300 ${
 theme === 'dark'
 ? 'bg-[#0f141a] border-white/10'
 : 'bg-white border-gray-200'
 } ${call.status !== 'active' ? 'opacity-60' : ''}`}
 >
 {/* Верхняя цветная линия */}
<div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${meta.gradient} opacity-80 rounded-t-2xl`} />



 {/* Плашка со сферой */}
<div className="absolute top-4 left-4">
<span className={`text-[10px] px-2 py-1 rounded-lg font-bold uppercase tracking-wider ${meta.chip}`}>
 {meta.label}
</span>
</div>

 {/* Статус сигнала */}
 {call.status === 'completed' && (
<div className="absolute top-4 right-4">
<span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-teal-500/10 text-teal-500 px-2 py-1 rounded-full border border-teal-500/20">
<CheckCircle2 className="w-3 h-3" />
 Завершен
</span>
</div>
 )}
 {call.status === 'cancelled' && (
<div className="absolute top-4 right-4">
<span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-500 px-2 py-1 rounded-full border border-rose-500/20">
<XCircle className="w-3 h-3" />
 Отменен
</span>
</div>
 )}

 {/* Заголовок: иконка + название + риск */}
<div className="mt-10 mb-4">
<div className="flex items-center gap-3">
<div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${meta.gradient} text-white shadow-lg flex items-center justify-center shrink-0`}>
 {meta.icon}
</div>
<div className="flex-1 min-w-0">
{call.category === 'polymarket' && details.event ? (
<h3 className={`text-xl font-black ${textColor} truncate`}>{details.event}</h3>
) : (
<h3 className={`text-xl font-black ${textColor} truncate`}>{getPrimaryTitle(call)}</h3>
)}
{/* Для Futures - показываем направление (LONG/SHORT) */}
{call.category === 'futures' && details.direction && (
<div className="flex items-center gap-2 mt-1">
<span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${details.direction === 'long' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500' : 'border-rose-500/30 bg-rose-500/10 text-rose-500'}`}>
 {details.direction === 'long' ? 'LONG' : 'SHORT'}
</span>
</div>
)}
{/* Для Spot - показываем горизонт удержания */}
{call.category === 'spot' && details.holdingHorizon && (
<div className="flex items-center gap-2 mt-1">
<span className="px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-amber-500/30 bg-amber-500/10 text-amber-500">
 {details.holdingHorizon === 'short' ? 'Краткосрок' : details.holdingHorizon === 'medium' ? 'Среднесрок' : 'Долгосрок'}
</span>
</div>
)}
</div>
</div>
</div>

 {/* Специфичные данные по категории */}
<div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
 {call.category === 'polymarket' && (
 <>
 {/* Ссылка на событие - на всю ширину, перед комментарием */}
 {details.eventLink && (
<div className="col-span-2 sm:col-span-3 mb-2">
<div className="flex items-center gap-2">
<a
 href={details.eventLink}
 target="_blank"
 rel="noopener noreferrer"
 className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-lg border ${borderColor} ${theme === 'dark' ? 'bg-gray-800/50 hover:bg-gray-700/50' : 'bg-gray-50 hover:bg-gray-100'} transition-colors flex items-center gap-2 group`}
>
<span className={`text-xs font-mono ${textColor} truncate flex-1`}>
 {details.eventLink || 'Нет ссылки'}
</span>
<ExternalLink className="w-3 h-3 shrink-0 text-gray-400 group-hover:text-rose-500 transition-colors" />
</a>
<button
 onClick={() => {
 navigator.clipboard.writeText(details.eventLink || '')
 }}
 className={`p-2 rounded-lg border ${borderColor} ${theme === 'dark' ? 'bg-gray-800/50 hover:bg-gray-700/50' : 'bg-gray-50 hover:bg-gray-100'} transition-colors`}
 title="Скопировать ссылку"
>
<Copy className="w-4 h-4 text-gray-400 hover:text-rose-500 transition-colors" />
</button>
</div>
</div>
 )}

 {/* Комментарий трейдера и АО - после ссылки */}
 {(() => {
 const comment = details.traderComment || ''
 // АО-маркеры для всех категорий
 const aoMarkers = [
 'АО: проверь время сигнала!',
 'Не ИИР, проводите собственный анализ!',
 'Не ИИР, проводите самостоятельный анализ!',
 'АО: Решай на лету — или проходи'
 ]
 // Ищем позицию первого АО-маркера
 const aoPosition = aoMarkers.reduce((minPos, marker) => {
 const pos = comment.indexOf(marker)
 if (pos === -1) return minPos
 return minPos === -1 ? pos : Math.min(minPos, pos)
 }, -1)
 
 // Разделяем комментарий и АО
 const traderCommentPart = aoPosition === -1 ? comment : comment.slice(0, aoPosition).trim()
 const aoPart = aoPosition === -1 ? '' : comment.slice(aoPosition).trim()
 
 // Если есть АО - показываем с разделением комментария и АО
 if (aoPart) {
 return (
 <div className="col-span-2 sm:col-span-3 mb-2 p-3 rounded-xl border border-[#4C7F6E]/20 bg-[#4C7F6E]/5">
 {traderCommentPart && (
 <>
 <p className={`text-sm ${textColor} whitespace-pre-wrap mb-2`}>{traderCommentPart}</p>
 <div className="border-t border-[#4C7F6E]/20 pt-2" />
 </>
 )}
 <p className={`text-sm ${textColor} whitespace-pre-wrap`}>{aoPart}</p>
 </div>
 )
 }
 
 // Если есть просто комментарий без АО (например, старые сигналы)
 if (comment) {
 return (
 <div className="col-span-2 sm:col-span-3 mb-2 p-3 rounded-xl border border-[#4C7F6E]/20 bg-[#4C7F6E]/5">
 <p className={`text-sm ${textColor} whitespace-pre-wrap`}>{comment}</p>
 </div>
 )
 }
 
 return null
 })()}

 {/* Три карточки в ряд: Позиция/значение, Ожидаемый результат, Цель */}
<div className="col-span-2 sm:col-span-3 grid grid-cols-3 gap-3">
 {/* Позиция / значение - объединено */}
 {(details.positionType || details.entryPrice) && (
<div className={`p-3 rounded-xl border ${details.positionType === 'yes' ? 'border-emerald-500/30 bg-emerald-500/10' : details.positionType === 'no' ? 'border-rose-500/30 bg-rose-500/10' : 'border-gray-200/30 dark:border-white/10 bg-gray-50/50 dark:bg-white/5'}`}>
<p className={`text-[10px] uppercase tracking-wider ${subtleColor} mb-1`}>Позиция / значение</p>
<p className={`text-lg font-bold ${textColor}`}>
 {details.positionType ? (details.positionType === 'yes' ? 'YES' : 'NO') : ''}{details.positionType && details.entryPrice ? ' / ' : ''}{details.entryPrice ? `${details.entryPrice}%` : ''}
</p>
</div>
 )}

 {/* Ожидаемый результат */}
 {details.expectedProbability && (
<div className="p-3 rounded-xl border border-blue-500/20 bg-blue-500/5">
<p className={`text-[10px] uppercase tracking-wider ${subtleColor} mb-1`}>Ожидаемый результат</p>
<p className={`text-sm font-bold ${textColor}`}>{details.expectedProbability}</p>
</div>
 )}

 {/* Цель */}
 {details.targetPlan && (
<div className="p-3 rounded-xl border border-[#4C7F6E]/20 bg-[#4C7F6E]/5">
<p className={`text-[10px] uppercase tracking-wider ${subtleColor} mb-1`}>Цель</p>
<p className={`text-sm font-semibold ${textColor}`}>{details.targetPlan}</p>
</div>
 )}
</div>

 {/* Кнопка Polymarket - как Fasol/GMGN у мемов */}
 {details.eventLink && (
<div className="col-span-2 sm:col-span-3">
<a
 href={details.eventLink}
 target="_blank"
 rel="noopener noreferrer"
 className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 transition-colors`}
>
<Gauge className="w-4 h-4 text-rose-400" />
<span className="text-xs font-bold text-rose-400">Polymarket</span>
</a>
</div>
 )}
 </>
 )}
{call.category === 'futures' && (
 <>
 {/* Ссылка на BingX */}
 {details.link && (
<div className="col-span-2 sm:col-span-3 mb-2">
<div className="flex items-center gap-2">
<a
 href={details.link}
 target="_blank"
 rel="noopener noreferrer"
 className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-lg border ${borderColor} ${theme === 'dark' ? 'bg-gray-800/50 hover:bg-gray-700/50' : 'bg-gray-50 hover:bg-gray-100'} transition-colors flex items-center gap-2 group`}
>
<span className={`text-xs font-mono ${textColor} truncate flex-1`}>
 {details.link || 'Нет ссылки'}
</span>
<ExternalLink className="w-3 h-3 shrink-0 text-gray-400 group-hover:text-blue-500 transition-colors" />
</a>
<button
 onClick={() => {
 navigator.clipboard.writeText(details.link || '')
 }}
 className={`p-2 rounded-lg border ${borderColor} ${theme === 'dark' ? 'bg-gray-800/50 hover:bg-gray-700/50' : 'bg-gray-50 hover:bg-gray-100'} transition-colors`}
 title="Скопировать ссылку"
>
<Copy className="w-4 h-4 text-gray-400 hover:text-blue-500 transition-colors" />
</button>
</div>
</div>
 )}

 {/* Комментарий трейдера и АО - после ссылки */}
 {(() => {
 const comment = details.traderComment || ''
 const aoMarkers = [
 'АО: проверь время сигнала!',
 'Не ИИР, проводите собственный анализ!',
 'Не ИИР, проводите самостоятельный анализ!',
 ]
 const aoPosition = aoMarkers.reduce((minPos, marker) => {
 const pos = comment.indexOf(marker)
 if (pos === -1) return minPos
 return minPos === -1 ? pos : Math.min(minPos, pos)
 }, -1)
 
 const traderCommentPart = aoPosition === -1 ? comment : comment.slice(0, aoPosition).trim()
 const aoPart = aoPosition === -1 ? '' : comment.slice(aoPosition).trim()
 
 if (aoPart) {
 return (
 <div className="col-span-2 sm:col-span-3 mb-2 p-3 rounded-xl border border-[#4C7F6E]/20 bg-[#4C7F6E]/5">
 {traderCommentPart && (
 <>
 <p className={`text-sm ${textColor} whitespace-pre-wrap mb-2`}>{traderCommentPart}</p>
 <div className="border-t border-[#4C7F6E]/20 pt-2" />
 </>
 )}
 <p className={`text-sm ${textColor} whitespace-pre-wrap`}>{aoPart}</p>
 </div>
 )
 }
 
 if (comment) {
 return (
 <div className="col-span-2 sm:col-span-3 mb-2 p-3 rounded-xl border border-[#4C7F6E]/20 bg-[#4C7F6E]/5">
 <p className={`text-sm ${textColor} whitespace-pre-wrap`}>{comment}</p>
 </div>
 )
 }
 
 return null
 })()}

 {/* Три карточки в ряд: Зона входа, Цели, SL */}
<div className="col-span-2 sm:col-span-3 grid grid-cols-3 gap-3">
 {/* Зона входа */}
 {details.entryZone && (
<div className="p-3 rounded-xl border border-blue-500/20 bg-blue-500/5">
<p className={`text-[10px] uppercase tracking-wider ${subtleColor} mb-1`}>Зона входа</p>
<p className={`text-sm font-semibold ${textColor}`}>{details.entryZone}</p>
</div>
 )}

 {/* Цели */}
 {details.targets && (
<div className="p-3 rounded-xl border border-[#4C7F6E]/20 bg-[#4C7F6E]/5">
<p className={`text-[10px] uppercase tracking-wider ${subtleColor} mb-1`}>Цели</p>
<p className={`text-sm font-semibold ${textColor}`}>{details.targets}</p>
</div>
 )}

 {/* Рекомендованный SL */}
 {details.stopLoss && (
<div className="p-3 rounded-xl border border-rose-500/20 bg-rose-500/5">
<p className={`text-[10px] uppercase tracking-wider ${subtleColor} mb-1`}>Рекомендованный SL</p>
<p className={`text-sm font-semibold ${textColor}`}>{details.stopLoss}</p>
</div>
 )}
</div>
 </>
)}
{call.category === 'spot' && (
 <>
 {/* Ссылка на BingX */}
 {details.link && (
<div className="col-span-2 sm:col-span-3 mb-2">
<div className="flex items-center gap-2">
<a
 href={details.link}
 target="_blank"
 rel="noopener noreferrer"
 className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-lg border ${borderColor} ${theme === 'dark' ? 'bg-gray-800/50 hover:bg-gray-700/50' : 'bg-gray-50 hover:bg-gray-100'} transition-colors flex items-center gap-2 group`}
>
<span className={`text-xs font-mono ${textColor} truncate flex-1`}>
 {details.link || 'Нет ссылки'}
</span>
<ExternalLink className="w-3 h-3 shrink-0 text-gray-400 group-hover:text-amber-500 transition-colors" />
</a>
<button
 onClick={() => {
 navigator.clipboard.writeText(details.link || '')
 }}
 className={`p-2 rounded-lg border ${borderColor} ${theme === 'dark' ? 'bg-gray-800/50 hover:bg-gray-700/50' : 'bg-gray-50 hover:bg-gray-100'} transition-colors`}
 title="Скопировать ссылку"
>
<Copy className="w-4 h-4 text-gray-400 hover:text-amber-500 transition-colors" />
</button>
</div>
</div>
 )}

 {/* Комментарий трейдера и АО - после ссылки */}
 {(() => {
 const comment = details.traderComment || ''
 const aoMarkers = [
 'АО: проверь время сигнала!',
 'Не ИИР, проводите собственный анализ!',
 'Не ИИР, проводите самостоятельный анализ!',
 ]
 const aoPosition = aoMarkers.reduce((minPos, marker) => {
 const pos = comment.indexOf(marker)
 if (pos === -1) return minPos
 return minPos === -1 ? pos : Math.min(minPos, pos)
 }, -1)
 
 const traderCommentPart = aoPosition === -1 ? comment : comment.slice(0, aoPosition).trim()
 const aoPart = aoPosition === -1 ? '' : comment.slice(aoPosition).trim()
 
 if (aoPart) {
 return (
 <div className="col-span-2 sm:col-span-3 mb-2 p-3 rounded-xl border border-[#4C7F6E]/20 bg-[#4C7F6E]/5">
 {traderCommentPart && (
 <>
 <p className={`text-sm ${textColor} whitespace-pre-wrap mb-2`}>{traderCommentPart}</p>
 <div className="border-t border-[#4C7F6E]/20 pt-2" />
 </>
 )}
 <p className={`text-sm ${textColor} whitespace-pre-wrap`}>{aoPart}</p>
 </div>
 )
 }
 
 if (comment) {
 return (
 <div className="col-span-2 sm:col-span-3 mb-2 p-3 rounded-xl border border-[#4C7F6E]/20 bg-[#4C7F6E]/5">
 <p className={`text-sm ${textColor} whitespace-pre-wrap`}>{comment}</p>
 </div>
 )
 }
 
 return null
 })()}

 {/* Три карточки в ряд: Зона входа, Цели, SL */}
<div className="col-span-2 sm:col-span-3 grid grid-cols-3 gap-3">
 {/* Зона входа */}
 {details.entryZone && (
<div className="p-3 rounded-xl border border-blue-500/20 bg-blue-500/5">
<p className={`text-[10px] uppercase tracking-wider ${subtleColor} mb-1`}>Зона входа</p>
<p className={`text-sm font-semibold ${textColor}`}>{details.entryZone}</p>
</div>
 )}

 {/* Цели */}
 {details.targets && (
<div className="p-3 rounded-xl border border-[#4C7F6E]/20 bg-[#4C7F6E]/5">
<p className={`text-[10px] uppercase tracking-wider ${subtleColor} mb-1`}>Цели</p>
<p className={`text-sm font-semibold ${textColor}`}>{details.targets}</p>
</div>
 )}

 {/* Рекомендованный SL */}
 {details.stopLoss && (
<div className="p-3 rounded-xl border border-rose-500/20 bg-rose-500/5">
<p className={`text-[10px] uppercase tracking-wider ${subtleColor} mb-1`}>Рекомендованный SL</p>
<p className={`text-sm font-semibold ${textColor}`}>{details.stopLoss}</p>
</div>
 )}
</div>
 </>
)}
 {/* Общие поля для всех (кроме спота и фьючерсов - у них свои секции) */}
 {details.entryPrice && call.category !== 'polymarket' && call.category !== 'spot' && call.category !== 'futures' && (
<div className="p-3 rounded-xl border border-gray-200/30 dark:border-white/10 bg-gray-50/50 dark:bg-white/5">
<p className={`text-[10px] uppercase tracking-wider ${subtleColor} mb-1`}>Вход</p>
<p className={`text-sm font-semibold ${textColor}`}>{details.entryPrice}</p>
</div>
 )}
 {details.targets && call.category !== 'spot' && call.category !== 'futures' && (
<div className="p-3 rounded-xl border border-[#4C7F6E]/20 bg-[#4C7F6E]/5">
<p className={`text-[10px] uppercase tracking-wider ${subtleColor} mb-1`}>Цель</p>
<p className="text-sm font-semibold text-[#4C7F6E]">{details.targets}</p>
</div>
 )}
 {details.stopLoss && call.category !== 'spot' && call.category !== 'futures' && (
<div className="p-3 rounded-xl border border-rose-500/20 bg-rose-500/5">
<p className={`text-[10px] uppercase tracking-wider ${subtleColor} mb-1`}>Стоп</p>
<p className="text-sm font-semibold text-rose-500">{details.stopLoss}</p>
</div>
 )}
</div>

 {/* Время публикации */}
 {publishedDate && (
<div className="flex items-center justify-between mb-3 p-2 rounded-lg bg-gray-50 dark:bg-white/5">
<div className="flex items-center gap-1.5">
<Clock className="w-3.5 h-3.5 text-gray-400" />
<span className={`text-xs ${subtleColor}`}>
 Опубликовано: {formatPublishedDate(publishedDate)}
</span>
</div>
</div>
 )}

 {/* Нижняя часть: трейдер и действия */}
<div className="flex items-center justify-between pt-3 border-t border-gray-200/30 dark:border-white/10">
 {/* Трейдер */}
<div className="flex items-center gap-2">
 {trader?.avatar ? (
<img src={trader.avatar} className="w-8 h-8 rounded-full object-cover" alt={trader.name} />
 ) : (
<div className="w-8 h-8 rounded-full bg-[#4C7F6E] flex items-center justify-center text-white font-bold text-sm">
 {trader?.name?.[0] || '?'}
</div>
 )}
<div>
<p className={`text-xs ${subtleColor}`}>Автор</p>
<p className={`text-sm font-semibold ${textColor}`}>{trader?.name || 'Unknown'}</p>
</div>
</div>

 {/* Действия */}
<div className="flex items-center gap-1">
 {/* Копировать сигнал */}
<button
 onClick={() => {
 const text = `🚀 ${meta.label}: ${getPrimaryTitle(call)}\n` +
 (details.entryPrice ? `📍 Вход: ${details.entryPrice}\n` : '') +
 (details.targets ? `🎯 Цели: ${details.targets}\n` : '') +
 (details.stopLoss ? `🛑 Стоп: ${details.stopLoss}\n` : '') +
 (details.contract ? `📝 CA: ${details.contract}\n` : '') +
 (details.link ? `🔗 Ссылка: ${details.link}\n` : '') +
 `👤 Трейдер: ${trader?.name || 'Admin'}`
 navigator.clipboard.writeText(text)
 }}
 className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-[#4C7F6E]/20 text-[#4C7F6E]' : 'hover:bg-[#4C7F6E]/10 text-[#4C7F6E]'}`}
 title="Копировать сигнал"
 >
<Copy className="w-4 h-4" />
</button>

 {/* Статус */}
 {isAuthorOrAdmin && call.status === 'active' && (
 <>
<button
 onClick={() => handleUpdateStatus(call.id, 'completed')}
 className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-[#4C7F6E]/20 text-[#4C7F6E]' : 'hover:bg-[#4C7F6E]/10 text-[#4C7F6E]'}`}
 title="Завершить"
 >
<CheckCircle2 className="w-4 h-4" />
</button>
<button
 onClick={() => handleUpdateStatus(call.id, 'cancelled')}
 className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-rose-500/20 text-rose-400' : 'hover:bg-rose-50 text-rose-600'}`}
 title="Отменить"
 >
<XCircle className="w-4 h-4" />
</button>
 </>
 )}

 {isAuthorOrAdmin && call.status !== 'active' && (
<button
 onClick={() => handleUpdateStatus(call.id, 'active')}
 className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-blue-500/20 text-blue-400' : 'hover:bg-blue-50 text-blue-600'}`}
 title="Вернуть в работу"
 >
<History className="w-4 h-4" />
</button>
 )}

 {/* Редактировать */}
 {isAuthorOrAdmin && (
<button
 onClick={() => handleEdit(call)}
 className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-white/10 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'}`}
 title="Редактировать"
 >
<Edit className="w-4 h-4" />
</button>
 )}

 {/* Удалить */}
 {isAdmin && (
<button
 onClick={() => handleDeleteClick(call.id)}
 className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-50 text-red-600'}`}
 title="Удалить"
 >
<Trash2 className="w-4 h-4" />
</button>
 )}
</div>
</div>
</div>
 )
            })}
          </div>
        )}
      </div>

      {/* Form Modal - Enhanced */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-2xl z-[70] flex items-start sm:items-center justify-center p-4 overflow-y-auto">
          {/* Animated background effects */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '0.5s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px]" />
          </div>

          <div className={`relative ${bgColor} rounded-3xl shadow-2xl shadow-black/50 border-2 ${
            theme === 'dark' ? 'border-white/10' : 'border-gray-200'
          } max-w-4xl w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300`}>
  {/* Header gradient accent - dynamic based on category */}
  <div className={`h-1.5 transition-all duration-500 ${
    formCategory === 'memecoins' ? 'bg-gradient-to-r from-teal-400 via-cyan-500 to-emerald-400' :
    formCategory === 'polymarket' ? 'bg-gradient-to-r from-rose-500 via-red-500 to-orange-500' :
    formCategory === 'futures' ? 'bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500' :
    formCategory === 'spot' ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500' :
    formCategory === 'staking' ? 'bg-gradient-to-r from-emerald-500 via-green-500 to-teal-400' :
    formCategory === 'airdrop' ? 'bg-gradient-to-r from-slate-400 via-zinc-400 to-gray-400' :
    'bg-gradient-to-r from-gray-400 via-zinc-400 to-slate-400'
  }`} />

            {/* Decorative grid */}
            <div className={`absolute inset-0 opacity-[0.02] pointer-events-none ${
              theme === 'dark' ? '' : 'invert'
            }`} style={{
              backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
              backgroundSize: '30px 30px'
            }} />

            <div className="relative flex flex-col h-full">
              <div className={`p-5 flex items-center justify-between sticky top-0 z-20 ${bgColor} border-b ${borderColor}`}>
      <div className="flex items-center gap-4">
        <div className={`relative w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg transition-all duration-300 ${
          formCategory === 'memecoins' ? 'bg-gradient-to-br from-teal-400 via-cyan-500 to-emerald-400 shadow-teal-500/30' :
          formCategory === 'polymarket' ? 'bg-gradient-to-br from-rose-500 via-red-500 to-orange-500 shadow-rose-500/30' :
          formCategory === 'futures' ? 'bg-gradient-to-br from-blue-500 via-indigo-500 to-cyan-500 shadow-blue-500/30' :
          formCategory === 'spot' ? 'bg-gradient-to-br from-amber-500 via-orange-500 to-yellow-500 shadow-amber-500/30' :
          formCategory === 'staking' ? 'bg-gradient-to-br from-emerald-500 via-green-500 to-teal-400 shadow-emerald-500/30' :
          formCategory === 'airdrop' ? 'bg-gradient-to-br from-slate-400 via-zinc-400 to-gray-400 shadow-slate-500/30' :
          'bg-gradient-to-br from-gray-400 via-zinc-400 to-slate-400 shadow-gray-500/30'
        }`}>
                    {CATEGORY_META[formCategory].icon}
                    <div className="absolute -top-1 -right-1 w-4 h-4">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-white/50 opacity-75 animate-ping" />
                      <div className="relative inline-flex rounded-full h-4 w-4 bg-white/80" />
                    </div>
                  </div>
                  <div>
                    <h2 className={`text-xl font-black ${textColor}`}>
                      {editingCall ? 'Редактировать' : 'Новый сигнал'}
                    </h2>
                    <p className={`text-xs ${subtleColor}`}>
                      {editingCall ? 'Измените данные сигнала' : `${CATEGORY_META[formCategory].label} • Заполните данные`}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCancel}
                  className={`p-2.5 rounded-xl transition-all duration-200 ${
                    theme === 'dark' 
                      ? 'hover:bg-white/10 text-gray-400 hover:text-white' 
                      : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="px-6 pb-6 pt-4 overflow-y-auto flex-1 max-h-[calc(90vh-80px)]">
                <CallForm
                  callToEdit={editingCall}
                  onSuccess={handleSuccess}
                  onCancel={handleCancel}
                  initialCategory={formCategory}
                  category={formCategory}
                  onCategoryChange={setFormCategory}
                  showCategorySelector={showCategorySelector}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal - Enhanced */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-2xl z-[70] flex items-start sm:items-center justify-center p-4 overflow-y-auto overscroll-contain">
          {/* Animated background */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-red-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl" />
          </div>

          <div className={`relative ${bgColor} rounded-3xl shadow-2xl border-2 border-red-500/20 max-w-md w-full animate-in zoom-in-95 duration-200`}>
            {/* Red accent bar */}
            <div className="h-1 bg-gradient-to-r from-red-500 via-rose-500 to-orange-500 rounded-t-3xl" />
            
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-red-500/20 text-red-400">
                  <AlertTriangle className="w-7 h-7" />
                </div>
                <div>
                  <h3 className={`text-xl font-black ${textColor}`}>Удалить сигнал?</h3>
                  <p className={`text-sm ${subtleColor}`}>Это действие нельзя отменить</p>
                </div>
              </div>
              
              {/* Warning info */}
              <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-red-500/10 border border-red-500/20' : 'bg-red-50 border border-red-100'}`}>
                <p className={`text-sm ${theme === 'dark' ? 'text-red-300' : 'text-red-600'}`}>
                  Все данные сигнала будут удалены безвозвратно. Это действие затронет также историю и статистику.
                </p>
              </div>
              
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => { setShowDeleteModal(false); setDeleteCallId(null) }}
                  className={`flex-1 px-4 py-3 rounded-xl border font-medium transition-all ${
                    theme === 'dark' 
                      ? 'border-white/10 text-white hover:bg-white/5' 
                      : 'border-gray-200 text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  Отмена
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-red-500 to-rose-500 text-white font-bold hover:from-red-400 hover:to-rose-400 shadow-lg shadow-red-500/25 transition-all hover:scale-[1.02]"
                >
                  Удалить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal - Enhanced */}
      {cancelCallId && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-2xl z-[70] flex items-start sm:items-center justify-center p-4 overflow-y-auto overscroll-contain">
          {/* Animated background */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />
          </div>

          <div className={`relative ${bgColor} rounded-3xl shadow-2xl border-2 border-amber-500/20 max-w-md w-full animate-in zoom-in-95 duration-200`}>
            {/* Amber accent bar */}
            <div className="h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 rounded-t-3xl" />
            
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400">
                  <AlertTriangle className="w-7 h-7" />
                </div>
                <div>
                  <h3 className={`text-xl font-black ${textColor}`}>Отменить сигнал?</h3>
                  <p className={`text-sm ${subtleColor}`}>Статус станет «Отменен», запись останется в списке</p>
                </div>
              </div>
              
              {/* Info box */}
              <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-amber-50 border border-amber-100'}`}>
                <p className={`text-sm ${theme === 'dark' ? 'text-amber-300' : 'text-amber-600'}`}>
                  Сигнал будет помечен как отменённый. Вы сможете вернуть его в работу позже при необходимости.
                </p>
              </div>
              
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setCancelCallId(null)}
                  className={`flex-1 px-4 py-3 rounded-xl border font-medium transition-all ${
                    theme === 'dark' 
                      ? 'border-white/10 text-white hover:bg-white/5' 
                      : 'border-gray-200 text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  Отмена
                </button>
                <button
                  onClick={handleCancelConfirm}
                  className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold hover:from-amber-400 hover:to-orange-400 shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.02]"
                >
                  Отменить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Modal (for share link) */}
      {viewCallId && viewCall && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80] flex items-start sm:items-center justify-center p-4 overflow-y-auto overscroll-contain">
          <div className={`${bgColor} rounded-2xl shadow-2xl border ${borderColor} max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
            <div className="sticky top-0 flex items-center justify-between p-4 border-b ${borderColor} ${bgColor} z-10">
              <h3 className={`text-lg font-bold ${textColor}`}>Сигнал мемкоина</h3>
              <button
                onClick={closeViewModal}
                className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-100'} transition-colors`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <MemecoinCallCard
                call={viewCall}
                isAdmin={isAdmin}
                onUpdateStatus={handleUpdateStatus}
                onUpdateCall={handleCallUpdate}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                onShare={(id) => {
                  const url = `${window.location.origin}/hub?callId=${id}`
                  navigator.clipboard.writeText(url)
                }}
                traderName={allMembers.find(u => u.id === viewCall.userId)?.name}
                traderAvatar={allMembers.find(u => u.id === viewCall.userId)?.avatar}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
 
