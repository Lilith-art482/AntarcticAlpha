1717
import { useState, useEffect } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAdminStore } from '@/store/adminStore'
import { getAllReferrals, updateReferral, deleteReferral, getApprovalRequests, approveApprovalRequest, rejectApprovalRequest, awardReferralPoints, revokeReferralPoints, migrateReferralPoints, adjustPointsManually, getAllUsersPointsBalances, getArchivedApprovalRequests, deleteApprovalRequest, deleteMultipleApprovalRequests, cleanupOldApprovalRequests } from '@/services/firestoreService'
import { Referral, ApprovalRequest, PointsExchangeRequest } from '@/types'
import { getUserNicknameSync } from '@/utils/userUtils'
import {
  Users,
  Shield,
  Clock,
  CheckCircle2,
  Activity,
  User,
  Ban,
  X,
  Mail,
  Phone,
  MessageCircle,
  Zap,
  RefreshCw,
  Trash2,
  Search,
  Trophy,
  DollarSign,
  TrendingUp,
  Calendar,
  Archive,
  CheckSquare
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

// Конфигурация типов преимуществ
const BENEFIT_CONFIG: Record<string, { label: string; icon: any; color: string }> = {
  usdt: { label: 'USDT', icon: DollarSign, color: 'text-green-400' },
  commission: { label: 'Снижение комиссии', icon: TrendingUp, color: 'text-blue-400' },
  dayoff: { label: 'Выходной/Отпуск', icon: Calendar, color: 'text-purple-400' },
}

export const CheckReferrals = () => {
  const { theme } = useThemeStore()
  const { isAdmin } = useAdminStore()
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [pointsRequests, setPointsRequests] = useState<ApprovalRequest[]>([])
  const [archivedRequests, setArchivedRequests] = useState<ApprovalRequest[]>([])
  const [usersBalances, setUsersBalances] = useState<{ userId: string; userName?: string; balance: number }[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<ReferralStatus | 'all'>('pending')
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'referrals' | 'points' | 'archive' | 'balances'>('referrals')
  const [migrating, setMigrating] = useState(false)
  const [adjustModal, setAdjustModal] = useState<{ userId: string; userName?: string; currentBalance: number } | null>(null)
  const [adjustAmount, setAdjustAmount] = useState('')
  const [adjustReason, setAdjustReason] = useState('')
  const [adjusting, setAdjusting] = useState(false)
  const [selectedArchive, setSelectedArchive] = useState<Set<string>>(new Set())
  
  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const subTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
  
  useEffect(() => {
    if (isAdmin) {
      loadData()
      // Автоматическая очистка старых записей при загрузке
      cleanupOldApprovalRequests(30).then(deleted => {
        if (deleted > 0) {
          console.log(`Auto-cleaned ${deleted} old archive records`)
        }
      })
    }
  }, [isAdmin])
  
  const loadData = async () => {
    setLoading(true)
    try {
      const [referralsData, approvalsData, balancesData, archivedData] = await Promise.all([
        getAllReferrals(),
        getApprovalRequests('pending'),
        getAllUsersPointsBalances(),
        getArchivedApprovalRequests()
      ])
      setReferrals(referralsData)
      // Фильтруем только заявки на обмен баллов
      const pointsExchanges = approvalsData.filter(a => a.entity === 'points_exchange')
      console.log('Loaded points exchange requests:', pointsExchanges.length, pointsExchanges)
      setPointsRequests(pointsExchanges)
      setUsersBalances(balancesData)
      setArchivedRequests(archivedData.filter(r => r.entity === 'points_exchange'))
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleApprovePoints = async (requestId: string) => {
    if (!confirm('Одобрить обмен баллов?')) return
    
    setUpdatingId(requestId)
    try {
      console.log('Approving points exchange:', requestId)
      await approveApprovalRequest(requestId, 'admin')
      console.log('Points exchange approved successfully')
      setPointsRequests(prev => prev.filter(r => r.id !== requestId))
      alert('Заявка одобрена! Баллы остаются списанными.')
    } catch (error) {
      console.error('Error approving points exchange:', error)
      alert('Ошибка при одобрении заявки: ' + (error as any)?.message)
    } finally {
      setUpdatingId(null)
    }
  }
  
  const handleRejectPoints = async (requestId: string, partialRefundPercent?: number) => {
    const comment = prompt('Причина отклонения (будет отправлена пользователю):')
    if (!comment) return
    
    setUpdatingId(requestId)
    try {
      console.log('Rejecting points exchange:', requestId, 'refund:', partialRefundPercent)
      await rejectApprovalRequest(requestId, 'admin', comment, partialRefundPercent)
      console.log('Points exchange rejected successfully')
      setPointsRequests(prev => prev.filter(r => r.id !== requestId))
      const refundText = partialRefundPercent 
        ? `Возвращено ${partialRefundPercent}% баллов.`
        : 'Баллы полностью возвращены.'
      alert(`Заявка отклонена! ${refundText}`)
    } catch (error) {
      console.error('Error rejecting points exchange:', error)
      alert('Ошибка при отклонении заявки: ' + (error as any)?.message)
    } finally {
      setUpdatingId(null)
    }
  }
  
  const handleStatusChange = async (referralId: string, newStatus: ReferralStatus) => {
    setUpdatingId(referralId)
    try {
      // Находим реферал для получения информации
      const referral = referrals.find(r => r.id === referralId)
      if (!referral) {
        throw new Error('Реферал не найден')
      }
      
      const oldStatus = referral.status as ReferralStatus
      const POINTS_PER_REFERRAL = 10
      
      // Обновляем статус
      await updateReferral(referralId, { status: newStatus })
      
      // Логика начисления/списания баллов
      // Если статус меняется НА "active" - начисляем баллы
      if (newStatus === 'active' && oldStatus !== 'active') {
        if (referral.ownerId) {
          await awardReferralPoints(
            referral.ownerId,
            POINTS_PER_REFERRAL,
            referralId,
            referral.name || 'Реферал',
            referral.ownerName
          )
          console.log(`✅ Начислено ${POINTS_PER_REFERRAL} баллов пользователю ${referral.ownerId} за реферала ${referral.name}`)
        }
      }
      // Если статус меняется С "active" на другой - списываем баллы
      else if (oldStatus === 'active' && newStatus !== 'active') {
        if (referral.ownerId) {
          await revokeReferralPoints(
            referral.ownerId,
            POINTS_PER_REFERRAL,
            referralId,
            referral.name || 'Реферал',
            referral.ownerName
          )
          console.log(`❌ Списано ${POINTS_PER_REFERRAL} баллов у пользователя ${referral.ownerId} за деактивацию реферала ${referral.name}`)
        }
      }
      
      setReferrals(prev => prev.map(r => 
        r.id === referralId ? { ...r, status: newStatus } : r
      ))
    } catch (error) {
      console.error('Error updating referral status:', error)
      alert('Ошибка при обновлении статуса: ' + (error as any)?.message)
    } finally {
      setUpdatingId(null)
    }
  }
  
  const handleDelete = async (referralId: string) => {
    if (!confirm('Удалить реферала?')) return
    
    try {
      await deleteReferral(referralId)
      setReferrals(prev => prev.filter(r => r.id !== referralId))
    } catch (error) {
      console.error('Error deleting referral:', error)
    }
  }
  
  // Миграция баллов для существующих активных рефералов
  const handleMigratePoints = async () => {
    if (!confirm('Начислить баллы за всех активных рефералов? Это действие нельзя отменить.')) return
    
    setMigrating(true)
    try {
      const result = await migrateReferralPoints()
      alert(`Миграция завершена!\n\nНачислено: ${result.migrated} рефералов\nОшибок: ${result.errors.length}`)
      if (result.errors.length > 0) {
        console.error('Migration errors:', result.errors)
      }
      await loadData()
    } catch (error) {
      console.error('Migration failed:', error)
      alert('Ошибка миграции: ' + (error as any)?.message)
    } finally {
      setMigrating(false)
    }
  }
  
  // Ручное изменение баллов
  const handleAdjustPoints = async () => {
    if (!adjustModal) return
    const newBalance = parseInt(adjustAmount)
    if (isNaN(newBalance) || newBalance < 0) {
      alert('Введите корректное количество баллов (неотрицательное число)')
      return
    }
    if (!adjustReason.trim()) {
      alert('Укажите причину изменения')
      return
    }
    
    // Вычисляем разницу
    const diff = newBalance - adjustModal.currentBalance
    if (diff === 0) {
      alert('Баланс не изменился')
      return
    }
    
    setAdjusting(true)
    try {
      await adjustPointsManually(
        adjustModal.userId,
        diff,
        adjustReason,
        'admin',
        adjustModal.userName
      )
      const action = diff > 0 ? 'начислено' : 'списано'
      alert(`Баланс обновлен! ${action}: ${Math.abs(diff)} баллов.\nНовый баланс: ${newBalance}`)
      setAdjustModal(null)
      setAdjustAmount('')
      setAdjustReason('')
      await loadData()
    } catch (error) {
      console.error('Error adjusting points:', error)
      alert('Ошибка: ' + (error as any)?.message)
    } finally {
      setAdjusting(false)
    }
  }
  
  // Выбор записи в архиве
  const toggleArchiveSelection = (id: string) => {
    setSelectedArchive(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }
  
  // Выбрать все в архиве
  const toggleSelectAllArchive = () => {
    if (selectedArchive.size === archivedRequests.length) {
      setSelectedArchive(new Set())
    } else {
      setSelectedArchive(new Set(archivedRequests.map(r => r.id)))
    }
  }
  
  // Удалить выбранные из архива
  const handleDeleteSelectedArchive = async () => {
    if (selectedArchive.size === 0) {
      alert('Выберите записи для удаления')
      return
    }
    if (!confirm(`Удалить ${selectedArchive.size} записей?`)) return
    
    try {
      const deleted = await deleteMultipleApprovalRequests(Array.from(selectedArchive))
      alert(`Удалено ${deleted} записей`)
      setSelectedArchive(new Set())
      await loadData()
    } catch (error) {
      console.error('Error deleting archive:', error)
      alert('Ошибка при удалении')
    }
  }
  
  // Удалить одну запись из архива
  const handleDeleteArchiveItem = async (id: string) => {
    if (!confirm('Удалить эту запись?')) return
    
    try {
      await deleteApprovalRequest(id)
      await loadData()
    } catch (error) {
      console.error('Error deleting archive item:', error)
      alert('Ошибка при удалении')
    }
  }
  
  // Очистка старых записей (старше 30 дней)
  const handleCleanupOldArchive = async () => {
    if (!confirm('Удалить все записи старше 30 дней?')) return
    
    try {
      const deleted = await cleanupOldApprovalRequests(30)
      alert(`Удалено ${deleted} старых записей`)
      await loadData()
    } catch (error) {
      console.error('Error cleaning up archive:', error)
      alert('Ошибка при очистке')
    }
  }
  
  // Фильтрация рефералов
  const filteredReferrals = referrals.filter(r => {
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter
    const matchesSearch = !searchQuery || 
      r.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.referralId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.phone?.includes(searchQuery) ||
      r.email?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })
  
  // Статистика по статусам
  const statusCounts = {
    all: referrals.length,
    pending: referrals.filter(r => r.status === 'pending').length,
    confirmed: referrals.filter(r => r.status === 'confirmed').length,
    active: referrals.filter(r => r.status === 'active').length,
    inactive: referrals.filter(r => r.status === 'inactive').length,
    excluded: referrals.filter(r => r.status === 'excluded').length,
    not_counted: referrals.filter(r => r.status === 'not_counted').length,
  }
  
  if (!isAdmin) {
    return (
      <div className="py-20 text-center space-y-4">
        <Shield className="w-16 h-16 text-gray-700 mx-auto opacity-20" />
        <h3 className={`text-xl font-black ${headingColor}`}>Доступ запрещён</h3>
        <p className="text-gray-500">Только администраторы могут просматривать эту страницу</p>
      </div>
    )
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#4C7F6E]/20 border-t-[#4C7F6E]"></div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={`p-4 rounded-2xl ${
            theme === 'dark' 
              ? 'bg-[#4C7F6E]/20' 
              : 'bg-[#4C7F6E]/10'
          }`}>
            <Users className={`w-7 h-7 ${theme === 'dark' ? 'text-[#4C7F6E]' : 'text-[#4C7F6E]'}`} />
          </div>
          <div>
            <h1 className={`text-3xl font-black tracking-tight ${headingColor}`}>
              Check_REF
            </h1>
            <p className={`text-sm font-medium ${subTextColor}`}>
              Управление рефералами и баллами
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
        
        <button
          onClick={loadData}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${
            theme === 'dark' 
              ? 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200'
          }`}
        >
          <RefreshCw className="w-4 h-4" />
          Обновить
        </button>
        
        <button
          onClick={handleMigratePoints}
          disabled={migrating}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 ${
            migrating
              ? 'opacity-50 cursor-not-allowed'
              : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-500 border border-amber-500/30'
          }`}
        >
          <Trophy className="w-4 h-4" />
          {migrating ? 'Миграция...' : 'Миграция'}
        </button>
        </div>
      </div>
      
      {/* Tabs */}
      <div className={`flex gap-2 p-1 rounded-xl ${
        theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'
      }`}>
        <button
          onClick={() => setActiveTab('referrals')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
            activeTab === 'referrals'
              ? 'bg-[#4C7F6E] text-white'
              : theme === 'dark'
                ? 'text-gray-400 hover:text-white'
                : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Users className="w-4 h-4" />
          Рефералы
          {statusCounts.pending > 0 && (
            <span className={`px-1.5 py-0.5 rounded-full text-xs ${
              activeTab === 'referrals' ? 'bg-white/20' : 'bg-amber-500/20 text-amber-500'
            }`}>
              {statusCounts.pending}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('points')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
            activeTab === 'points'
              ? 'bg-[#4C7F6E] text-white'
              : theme === 'dark'
                ? 'text-gray-400 hover:text-white'
                : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Trophy className="w-4 h-4" />
          Обмен
          {pointsRequests.length > 0 && (
            <span className={`px-1.5 py-0.5 rounded-full text-xs ${
              activeTab === 'points' ? 'bg-white/20' : 'bg-amber-500/20 text-amber-500'
            }`}>
              {pointsRequests.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('archive')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
            activeTab === 'archive'
              ? 'bg-[#4C7F6E] text-white'
              : theme === 'dark'
                ? 'text-gray-400 hover:text-white'
                : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Archive className="w-4 h-4" />
          Архив
          {archivedRequests.length > 0 && (
            <span className={`px-1.5 py-0.5 rounded-full text-xs ${
              activeTab === 'archive' ? 'bg-white/20' : 'bg-gray-500/20 text-gray-500'
            }`}>
              {archivedRequests.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('balances')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
            activeTab === 'balances'
              ? 'bg-[#4C7F6E] text-white'
              : theme === 'dark'
                ? 'text-gray-400 hover:text-white'
                : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          Балансы
        </button>
      </div>
      
      {/* Вкладка рефералов */}
      {activeTab === 'referrals' && (
        <>
          {/* Фильтры */}
          <div className={`p-4 rounded-2xl border ${
            theme === 'dark' ? 'bg-[#0b1015] border-white/5' : 'bg-white border-gray-100'
          }`}>
            <div className="flex flex-col md:flex-row gap-4">
              {/* Поиск */}
              <div className="flex-1 relative">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${subTextColor}`} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск по имени, ID, телефону, email..."
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${
                    theme === 'dark'
                      ? 'bg-white/5 border-white/10 text-white placeholder-gray-500'
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                  } focus:outline-none focus:border-[#4C7F6E] transition-colors`}
                />
              </div>
              
              {/* Фильтр по статусу */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as ReferralStatus | 'all')}
                className={`px-4 py-2.5 rounded-xl border ${
                  theme === 'dark'
                    ? 'bg-white/5 border-white/10 text-white' 
                    : 'bg-gray-50 border-gray-200 text-gray-900'
                } focus:outline-none focus:border-[#4C7F6E] transition-colors`}
              >
                <option value="all">Все ({statusCounts.all})</option>
                <option value="pending">На рассмотрении ({statusCounts.pending})</option>
                <option value="confirmed">Подтверждённые ({statusCounts.confirmed})</option>
                <option value="active">Активные ({statusCounts.active})</option>
                <option value="inactive">Неактивные ({statusCounts.inactive})</option>
                <option value="excluded">Исключённые ({statusCounts.excluded})</option>
                <option value="not_counted">Не зачтённые ({statusCounts.not_counted})</option>
              </select>
            </div>
          </div>
          
          {/* Таблица рефералов */}
          <div className={`rounded-3xl border overflow-hidden ${
            theme === 'dark' ? 'bg-[#0b1015] border-white/5' : 'bg-white border-gray-100'
          }`}>
            {filteredReferrals.length === 0 ? (
              <div className="text-center py-16">
                <Users className={`w-12 h-12 mx-auto mb-3 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
                <p className={`text-sm font-bold mb-1 ${headingColor}`}>
                  {statusFilter === 'pending' ? 'Нет рефералов на рассмотрении' : 'Нет рефералов'}
                </p>
                <p className={`text-xs ${subTextColor}`}>
                  {searchQuery ? 'Попробуйте изменить параметры поиска' : 'Все рефералы обработаны'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`border-b ${theme === 'dark' ? 'border-white/10' : 'border-gray-100'}`}>
                      <th className={`text-left py-4 px-4 text-xs font-bold uppercase tracking-wider ${subTextColor}`}>Реферал</th>
                      <th className={`text-left py-4 px-4 text-xs font-bold uppercase tracking-wider ${subTextColor}`}>Контакты</th>
                      <th className={`text-left py-4 px-4 text-xs font-bold uppercase tracking-wider ${subTextColor}`}>Источник</th>
                      <th className={`text-left py-4 px-4 text-xs font-bold uppercase tracking-wider ${subTextColor}`}>Пригласивший</th>
                      <th className={`text-left py-4 px-4 text-xs font-bold uppercase tracking-wider ${subTextColor}`}>Статус</th>
                      <th className={`text-left py-4 px-4 text-xs font-bold uppercase tracking-wider ${subTextColor}`}>Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReferrals.map((ref) => {
                      const statusConfig = STATUS_CONFIG[ref.status as ReferralStatus] || STATUS_CONFIG.pending
                      const StatusIcon = statusConfig.icon
                      const ownerNickname = ref.ownerId ? getUserNicknameSync(ref.ownerId) : '—'
                      
                      return (
                        <tr 
                          key={ref.id} 
                          className={`border-b transition-colors ${
                            theme === 'dark' 
                              ? 'border-white/5 hover:bg-white/5' 
                              : 'border-gray-50 hover:bg-gray-50'
                          }`}
                        >
                          {/* Реферал */}
                          <td className="py-4 px-4">
                            <div>
                              <p className={`text-sm font-bold ${headingColor}`}>{ref.name}</p>
                              <p className={`text-xs font-mono ${subTextColor}`}>{ref.referralId}</p>
                              {ref.age && (
                                <p className={`text-xs ${subTextColor}`}>Возраст: {ref.age}</p>
                              )}
                            </div>
                          </td>
                          
                          {/* Контакты */}
                          <td className="py-4 px-4">
                            <div className="space-y-1">
                              {ref.phone && (
                                <div className="flex items-center gap-2">
                                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                                  <span className={`text-xs ${subTextColor}`}>{ref.phone}</span>
                                </div>
                              )}
                              {ref.email && (
                                <div className="flex items-center gap-2">
                                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                                  <span className={`text-xs ${subTextColor}`}>{ref.email}</span>
                                </div>
                              )}
                              {ref.messenger && (
                                <div className="flex items-center gap-2">
                                  <MessageCircle className="w-3.5 h-3.5 text-gray-400" />
                                  <span className={`text-xs ${subTextColor}`}>
                                    {ref.messengerType === 'telegram' ? 'TG' : ref.messengerType === 'vk' ? 'VK' : 'MAX'}: {ref.messenger}
                                  </span>
                                </div>
                              )}
                            </div>
                          </td>
                          
                          {/* Источник */}
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <Zap className="w-3.5 h-3.5 text-gray-400" />
                              <span className={`text-xs ${subTextColor}`}>{ref.source || '—'}</span>
                            </div>
                          </td>
                          
                          {/* Пригласивший */}
                          <td className="py-4 px-4">
                            <div>
                              <p className={`text-sm font-medium ${headingColor}`}>{ref.ownerName || ownerNickname}</p>
                              <p className={`text-xs font-mono ${subTextColor}`}>{ref.referralCode}</p>
                            </div>
                          </td>
                          
                          {/* Статус */}
                          <td className="py-4 px-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.color}`}>
                              <StatusIcon className="w-3.5 h-3.5" />
                              {statusConfig.label}
                            </span>
                          </td>
                          
                          {/* Действия */}
                          <td className="py-4 px-4">
                            <div className="flex items-center justify-center gap-2">
                              <select
                                value={ref.status || 'pending'}
                                onChange={(e) => handleStatusChange(ref.id, e.target.value as ReferralStatus)}
                                disabled={updatingId === ref.id}
                                className={`px-3 py-2 pr-8 rounded-xl text-xs font-bold border appearance-none cursor-pointer min-w-[140px] text-center ${
                                  theme === 'dark' 
                                    ? 'bg-white/5 border-white/10 text-white' 
                                    : 'bg-white border-gray-200 text-gray-900'
                                } focus:outline-none focus:ring-2 focus:ring-[#4C7F6E]/30 transition-all disabled:opacity-50 ${
                                  STATUS_CONFIG[ref.status as ReferralStatus]?.bgColor || 'bg-amber-500/20'
                                } ${STATUS_CONFIG[ref.status as ReferralStatus]?.color || 'text-amber-500'}`}
                                style={{ 
                                  backgroundImage: 'none',
                                  textAlignLast: 'center'
                                }}
                              >
                                {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                                  <option key={key} value={key} className={theme === 'dark' ? 'bg-[#0b1015]' : 'bg-white'}>
                                    {config.label}
                                  </option>
                                ))}
                              </select>
                              
                              <button
                                onClick={() => handleDelete(ref.id)}
                                className={`p-2 rounded-lg transition-colors ${
                                  theme === 'dark' 
                                    ? 'hover:bg-red-500/20 text-red-400' 
                                    : 'hover:bg-red-100 text-red-500'
                                }`}
                                title="Удалить"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
      
      {/* Вкладка обмена баллов */}
      {activeTab === 'points' && (
        <div className={`rounded-3xl border overflow-hidden ${
          theme === 'dark' ? 'bg-[#0b1015] border-white/5' : 'bg-white border-gray-100'
        }`}>
          {pointsRequests.length === 0 ? (
            <div className="text-center py-16">
              <Trophy className={`w-12 h-12 mx-auto mb-3 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
              <p className={`text-sm font-bold mb-1 ${headingColor}`}>Нет заявок на обмен баллов</p>
              <p className={`text-xs ${subTextColor}`}>Все заявки обработаны</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${theme === 'dark' ? 'border-white/10' : 'border-gray-100'}`}>
                    <th className={`text-left py-4 px-4 text-xs font-bold uppercase tracking-wider ${subTextColor}`}>Пользователь</th>
                    <th className={`text-left py-4 px-4 text-xs font-bold uppercase tracking-wider ${subTextColor}`}>Баллы</th>
                    <th className={`text-left py-4 px-4 text-xs font-bold uppercase tracking-wider ${subTextColor}`}>Преимущество</th>
                    <th className={`text-left py-4 px-4 text-xs font-bold uppercase tracking-wider ${subTextColor}`}>Детали</th>
                    <th className={`text-left py-4 px-4 text-xs font-bold uppercase tracking-wider ${subTextColor}`}>Дата</th>
                    <th className={`text-left py-4 px-4 text-xs font-bold uppercase tracking-wider ${subTextColor}`}>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {pointsRequests.map((request) => {
                    const data = request.after as PointsExchangeRequest
                    const benefitConfig = BENEFIT_CONFIG[data?.benefitType || 'usdt']
                    const BenefitIcon = benefitConfig?.icon || DollarSign
                    const points = data?.points || 0
                    const usdtAmount = data?.benefitType === 'usdt' ? points : 0 // 1 балл = 1 USDT
                    
                    return (
                      <tr 
                        key={request.id} 
                        className={`border-b transition-colors ${
                          theme === 'dark' 
                            ? 'border-white/5 hover:bg-white/5' 
                            : 'border-gray-50 hover:bg-gray-50'
                        }`}
                      >
                        {/* Пользователь */}
                        <td className="py-4 px-4">
                          <div>
                            <p className={`text-sm font-bold ${headingColor}`}>{data?.userName || request.authorId}</p>
                            <p className={`text-xs font-mono ${subTextColor}`}>{request.authorId}</p>
                          </div>
                        </td>
                        
                        {/* Баллы и сумма */}
                        <td className="py-4 px-4">
                          <span className={`text-lg font-black text-amber-500`}>{points}</span>
                          {data?.benefitType === 'usdt' && (
                            <p className={`text-xs text-green-400 font-medium`}>= {usdtAmount} USDT</p>
                          )}
                        </td>
                        
                        {/* Преимущество */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <div className={`p-1.5 rounded-lg ${
                              data?.benefitType === 'usdt' ? 'bg-green-500/10' :
                              data?.benefitType === 'commission' ? 'bg-blue-500/10' : 'bg-purple-500/10'
                            }`}>
                              <BenefitIcon className={`w-4 h-4 ${benefitConfig?.color}`} />
                            </div>
                            <span className={`text-sm font-medium ${headingColor}`}>{benefitConfig?.label}</span>
                          </div>
                        </td>
                        
                        {/* Детали */}
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            {data?.benefitType === 'usdt' && (
                              <>
                                <p className={`text-xs ${subTextColor}`}>Сеть: {data.walletNetwork?.toUpperCase()}</p>
                                <p className={`text-xs font-mono ${subTextColor} break-all max-w-[200px]`}>{data.walletAddress}</p>
                              </>
                            )}
                            {data?.benefitType === 'commission' && data?.dateRange && (
                              <p className={`text-xs ${subTextColor}`}>
                                {data.dateRange.start} — {data.dateRange.end}
                              </p>
                            )}
                            {data?.benefitType === 'dayoff' && (
                              <>
                                <p className={`text-xs ${subTextColor}`}>
                                  {data.dayoffType === 'dayoff' ? 'Выходной' : '+1 день к отпуску'}
                                </p>
                                <p className={`text-xs ${subTextColor}`}>Дата: {data.dayoffDate}</p>
                              </>
                            )}
                          </div>
                        </td>
                        
                        {/* Дата */}
                        <td className="py-4 px-4">
                          <p className={`text-xs ${subTextColor}`}>
                            {new Date(request.createdAt).toLocaleDateString('ru-RU', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </td>
                        
                        {/* Действия */}
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleApprovePoints(request.id)}
                              disabled={updatingId === request.id}
                              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95 ${
                                theme === 'dark'
                                  ? 'bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30'
                                  : 'bg-green-100 hover:bg-green-200 text-green-600 border border-green-200'
                              } disabled:opacity-50 disabled:hover:scale-100`}
                            >
                              ✓ Одобрить
                            </button>
                            <button
                              onClick={() => handleRejectPoints(request.id, 100)}
                              disabled={updatingId === request.id}
                              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95 ${
                                theme === 'dark'
                                  ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30'
                                  : 'bg-red-100 hover:bg-red-200 text-red-600 border border-red-200'
                              } disabled:opacity-50 disabled:hover:scale-100`}
                            >
                              ✕ Отклонить
                            </button>
                            <button
                              onClick={() => handleRejectPoints(request.id, 50)}
                              disabled={updatingId === request.id}
                              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95 ${
                                theme === 'dark'
                                  ? 'bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/30'
                                  : 'bg-orange-100 hover:bg-orange-200 text-orange-600 border border-orange-200'
                              } disabled:opacity-50 disabled:hover:scale-100`}
                              title="Отклонить с возвратом 50% баллов"
                            >
                              ↩ 50%
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      
      {/* Вкладка балансов пользователей */}
      {activeTab === 'balances' && (
        <div className={`rounded-3xl border overflow-hidden ${
          theme === 'dark' ? 'bg-[#0b1015] border-white/5' : 'bg-white border-gray-100'
        }`}>
          {usersBalances.length === 0 ? (
            <div className="text-center py-16">
              <Trophy className={`w-12 h-12 mx-auto mb-3 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
              <p className={`text-sm font-bold mb-1 ${headingColor}`}>Нет данных о балансах</p>
              <p className={`text-xs ${subTextColor}`}>Баллы появятся после начисления</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${theme === 'dark' ? 'border-white/10' : 'border-gray-100'}`}>
                    <th className={`text-left py-4 px-4 text-xs font-bold uppercase tracking-wider ${subTextColor}`}>Пользователь</th>
                    <th className={`text-left py-4 px-4 text-xs font-bold uppercase tracking-wider ${subTextColor}`}>Баланс</th>
                    <th className={`text-left py-4 px-4 text-xs font-bold uppercase tracking-wider ${subTextColor}`}>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {usersBalances.map((user) => {
                    const nickname = getUserNicknameSync(user.userId)
                    
                    return (
                      <tr 
                        key={user.userId} 
                        className={`border-b transition-colors ${
                          theme === 'dark' 
                            ? 'border-white/5 hover:bg-white/5' 
                            : 'border-gray-50 hover:bg-gray-50'
                        }`}
                      >
                        <td className="py-4 px-4">
                          <div>
                            <p className={`text-sm font-bold ${headingColor}`}>{user.userName || nickname || 'Неизвестный'}</p>
                            <p className={`text-xs font-mono ${subTextColor}`}>{user.userId}</p>
                          </div>
                        </td>
                        
                        <td className="py-4 px-4">
                          <span className={`text-lg font-black ${user.balance > 0 ? 'text-amber-500' : 'text-gray-400'}`}>
                            {user.balance}
                          </span>
                          <span className={`text-xs ${subTextColor} ml-1`}>баллов</span>
                        </td>
                        
                        <td className="py-4 px-4">
                          <button
                            onClick={() => {
                              setAdjustModal({ 
                                userId: user.userId, 
                                userName: user.userName || nickname,
                                currentBalance: user.balance 
                              })
                              setAdjustAmount(String(user.balance))
                            }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95 ${
                              theme === 'dark'
                                ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30'
                                : 'bg-amber-100 hover:bg-amber-200 text-amber-600 border border-amber-200'
                            }`}
                          >
                            <Zap className="w-3.5 h-3.5" />
                            Изменить
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      
      {/* Вкладка архива */}
      {activeTab === 'archive' && (
        <div className={`rounded-3xl border overflow-hidden ${
          theme === 'dark' ? 'bg-[#0b1015] border-white/5' : 'bg-white border-gray-100'
        }`}>
          {/* Header с действиями */}
          {archivedRequests.length > 0 && (
            <div className={`p-4 border-b ${theme === 'dark' ? 'border-white/10' : 'border-gray-100'} flex items-center justify-between`}>
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleSelectAllArchive}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    theme === 'dark'
                      ? 'bg-white/5 hover:bg-white/10 text-gray-300'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  <CheckSquare className="w-4 h-4" />
                  {selectedArchive.size === archivedRequests.length ? 'Снять выбор' : 'Выбрать все'}
                </button>
                
                {selectedArchive.size > 0 && (
                  <button
                    onClick={handleDeleteSelectedArchive}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      theme === 'dark'
                        ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400'
                        : 'bg-red-50 hover:bg-red-100 text-red-600'
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                    Удалить ({selectedArchive.size})
                  </button>
                )}
              </div>
              
              <button
                onClick={handleCleanupOldArchive}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  theme === 'dark'
                    ? 'bg-orange-500/10 hover:bg-orange-500/20 text-orange-400'
                    : 'bg-orange-50 hover:bg-orange-100 text-orange-600'
                }`}
              >
                <Clock className="w-4 h-4" />
                Очистить старые (30+ дней)
              </button>
            </div>
          )}
          
          {archivedRequests.length === 0 ? (
            <div className="text-center py-16">
              <Archive className={`w-12 h-12 mx-auto mb-3 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
              <p className={`text-sm font-bold mb-1 ${headingColor}`}>Архив пуст</p>
              <p className={`text-xs ${subTextColor}`}>Рассмотренные заявки появятся здесь</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${theme === 'dark' ? 'border-white/10' : 'border-gray-100'}`}>
                    <th className={`text-left py-4 px-4 text-xs font-bold uppercase tracking-wider ${subTextColor} w-10`}>
                      <input
                        type="checkbox"
                        checked={selectedArchive.size === archivedRequests.length && archivedRequests.length > 0}
                        onChange={toggleSelectAllArchive}
                        className="rounded"
                      />
                    </th>
                    <th className={`text-left py-4 px-4 text-xs font-bold uppercase tracking-wider ${subTextColor}`}>Пользователь</th>
                    <th className={`text-left py-4 px-4 text-xs font-bold uppercase tracking-wider ${subTextColor}`}>Баллы</th>
                    <th className={`text-left py-4 px-4 text-xs font-bold uppercase tracking-wider ${subTextColor}`}>Преимущество</th>
                    <th className={`text-left py-4 px-4 text-xs font-bold uppercase tracking-wider ${subTextColor}`}>Статус</th>
                    <th className={`text-left py-4 px-4 text-xs font-bold uppercase tracking-wider ${subTextColor}`}>Дата решения</th>
                    <th className={`text-left py-4 px-4 text-xs font-bold uppercase tracking-wider ${subTextColor}`}>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {archivedRequests.map((request) => {
                    const data = request.after as PointsExchangeRequest
                    const benefitConfig = BENEFIT_CONFIG[data?.benefitType || 'usdt']
                    const BenefitIcon = benefitConfig?.icon || DollarSign
                    const points = data?.points || 0
                    const usdtAmount = data?.benefitType === 'usdt' ? points : 0
                    const isApproved = request.status === 'approved'
                    
                    // Расчёт дней до удаления
                    const processedDate = request.processedAt ? new Date(request.processedAt) : null
                    const daysRemaining = processedDate 
                      ? Math.max(0, 30 - Math.floor((Date.now() - processedDate.getTime()) / (1000 * 60 * 60 * 24)))
                      : null
                    
                    return (
                      <tr 
                        key={request.id} 
                        className={`border-b transition-colors ${
                          theme === 'dark' 
                            ? 'border-white/5 hover:bg-white/5' 
                            : 'border-gray-50 hover:bg-gray-50'
                        }`}
                      >
                        {/* Чекбокс */}
                        <td className="py-4 px-4">
                          <input
                            type="checkbox"
                            checked={selectedArchive.has(request.id)}
                            onChange={() => toggleArchiveSelection(request.id)}
                            className="rounded"
                          />
                        </td>
                        
                        {/* Пользователь */}
                        <td className="py-4 px-4">
                          <div>
                            <p className={`text-sm font-bold ${headingColor}`}>{data?.userName || request.authorId}</p>
                            <p className={`text-xs font-mono ${subTextColor}`}>{request.authorId}</p>
                          </div>
                        </td>
                        
                        {/* Баллы */}
                        <td className="py-4 px-4">
                          <span className={`text-lg font-black text-amber-500`}>{points}</span>
                          {data?.benefitType === 'usdt' && (
                            <p className={`text-xs text-green-400 font-medium`}>= {usdtAmount} USDT</p>
                          )}
                        </td>
                        
                        {/* Преимущество */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <div className={`p-1.5 rounded-lg ${
                              data?.benefitType === 'usdt' ? 'bg-green-500/10' :
                              data?.benefitType === 'commission' ? 'bg-blue-500/10' : 'bg-purple-500/10'
                            }`}>
                              <BenefitIcon className={`w-4 h-4 ${benefitConfig?.color}`} />
                            </div>
                            <span className={`text-sm font-medium ${headingColor}`}>{benefitConfig?.label}</span>
                          </div>
                        </td>
                        
                        {/* Статус */}
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                            isApproved 
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {isApproved ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Одобрено
                              </>
                            ) : (
                              <>
                                <X className="w-3.5 h-3.5" />
                                Отклонено
                              </>
                            )}
                          </span>
                          {request.adminComment && (
                            <p className={`text-xs ${subTextColor} mt-1 max-w-[150px] truncate`} title={request.adminComment}>
                              {request.adminComment}
                            </p>
                          )}
                        </td>
                        
                        {/* Дата */}
                        <td className="py-4 px-4">
                          <p className={`text-xs ${subTextColor}`}>
                            {request.processedAt ? new Date(request.processedAt).toLocaleDateString('ru-RU', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            }) : '—'}
                          </p>
                          {daysRemaining !== null && daysRemaining <= 7 && (
                            <p className={`text-xs ${daysRemaining <= 3 ? 'text-red-400' : 'text-orange-400'}`}>
                              Осталось {daysRemaining} дн.
                            </p>
                          )}
                        </td>
                        
                        {/* Действия */}
                        <td className="py-4 px-4">
                          <button
                            onClick={() => handleDeleteArchiveItem(request.id)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              theme === 'dark' 
                                ? 'hover:bg-red-500/10 text-red-400' 
                                : 'hover:bg-red-50 text-red-500'
                            }`}
                            title="Удалить"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      
      {/* Модальное окно изменения баллов */}
      {adjustModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-3xl p-6 border ${
            theme === 'dark' ? 'bg-[#0b1015] border-white/10' : 'bg-white border-gray-200'
          } shadow-2xl`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-bold ${headingColor}`}>
                Изменение баллов
              </h3>
              <button
                onClick={() => setAdjustModal(null)}
                className={`p-1.5 rounded-lg transition-colors ${
                  theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className={`text-sm ${subTextColor} mb-1`}>Пользователь</p>
                <p className={`font-medium ${headingColor}`}>
                  {adjustModal.userName || adjustModal.userId}
                </p>
              </div>
              
              <div>
                <p className={`text-sm ${subTextColor} mb-1`}>Текущий баланс</p>
                <p className={`text-xl font-black text-amber-500`}>
                  {adjustModal.currentBalance} баллов
                </p>
              </div>
              
              <div>
                <label className={`text-sm ${subTextColor} mb-1 block`}>
                  Новый баланс
                </label>
                <input
                  type="number"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value)}
                  placeholder="Введите количество баллов"
                  className={`w-full px-4 py-2.5 rounded-xl border ${
                    theme === 'dark'
                      ? 'bg-white/5 border-white/10 text-white placeholder-gray-500'
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                  } focus:outline-none focus:border-[#4C7F6E] transition-colors`}
                />
                <p className={`text-xs ${subTextColor} mt-1`}>
                  Текущий: {adjustModal.currentBalance} → введите новое значение
                </p>
              </div>
              
              <div>
                <label className={`text-sm ${subTextColor} mb-1 block`}>
                  Причина
                </label>
                <input
                  type="text"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="Например: Бонус за активность"
                  className={`w-full px-4 py-2.5 rounded-xl border ${
                    theme === 'dark'
                      ? 'bg-white/5 border-white/10 text-white placeholder-gray-500'
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                  } focus:outline-none focus:border-[#4C7F6E] transition-colors`}
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setAdjustModal(null)}
                className={`flex-1 py-2.5 rounded-xl font-medium transition-colors ${
                  theme === 'dark'
                    ? 'bg-white/5 hover:bg-white/10 text-gray-300'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                Отмена
              </button>
              <button
                onClick={handleAdjustPoints}
                disabled={adjusting}
                className="flex-1 py-2.5 rounded-xl font-medium text-white transition-colors disabled:opacity-50"
                style={{ backgroundColor: '#4C7F6E' }}
              >
                {adjusting ? 'Сохранение...' : 'Сохранить'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

