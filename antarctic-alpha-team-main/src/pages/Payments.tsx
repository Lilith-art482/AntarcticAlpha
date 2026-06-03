import { useState, useEffect } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { useAdminStore } from '@/store/adminStore'
import { deleteField } from 'firebase/firestore'
import {
  DollarSign,
  Plus,
  X,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Eye,
} from 'lucide-react'
import { Payment, PaymentStatus, TEAM_MEMBERS, Earnings } from '@/types'
import {
  getPayments,
  getUserPayments,
  createPayment,
  updatePayment,
  deletePayment,
  getEarnings,
  cleanupOldPayments,
} from '@/services/firestoreService'
import { UserNickname } from '@/components/UserNickname'
import Avatar from '@/components/Avatar'

const statusBadgeMap: Record<PaymentStatus, { bg: string; text: string; icon: React.ReactNode; label: string }> = {
  pending: {
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    text: 'text-amber-800 dark:text-amber-200',
    icon: <Clock className="w-3.5 h-3.5" />,
    label: 'Ожидает',
  },
  paid: {
    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
    text: 'text-emerald-800 dark:text-emerald-200',
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    label: 'Выплачено',
  },
  rejected: {
    bg: 'bg-rose-100 dark:bg-rose-900/30',
    text: 'text-rose-800 dark:text-rose-200',
    icon: <XCircle className="w-3.5 h-3.5" />,
    label: 'Отклонено',
  },
  threshold_not_reached: {
    bg: 'bg-gray-100 dark:bg-gray-800',
    text: 'text-gray-700 dark:text-gray-300',
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
    label: 'Ниже порога',
  },
}

// Payment Assignment Modal
const PaymentAssignmentModal = ({
  onClose,
  onSubmit,
  theme,
  users,
  weekStart,
  weekEnd,
}: {
  onClose: () => void
  onSubmit: (data: { userId: string; userName: string; amount: number; comment?: string; scheduledAt?: string }[]) => void
  theme: string
  users: { id: string; name: string }[]
  weekStart: string
  weekEnd: string
}) => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [individualComments, setIndividualComments] = useState<Record<string, string>>({})
  const [individualAmounts, setIndividualAmounts] = useState<Record<string, number>>({})
  const [userWeeklyNet, setUserWeeklyNet] = useState<Record<string, number>>({})
  const [isScheduled, setIsScheduled] = useState(false)
  const [scheduledDate, setScheduledDate] = useState<string>('')

  const isDark = theme === 'dark'

  // Load user weekly net earnings
  useEffect(() => {
    const loadWeeklyNet = async () => {
      const netValues: Record<string, number> = {}
      
      for (const user of users) {
        try {
          const earnings = await getEarnings(user.id, weekStart, weekEnd)
          const approvedEarnings = earnings.filter(e => e.status === 'approved' || !e.status)
          const gross = approvedEarnings.reduce((sum: number, e: Earnings) => {
            const participantCount = e.participants && e.participants.length > 0 ? e.participants.length : 1
            return sum + (e.amount / participantCount)
          }, 0)
          const pool = approvedEarnings.reduce((sum: number, e: Earnings) => {
            const participantCount = e.participants && e.participants.length > 0 ? e.participants.length : 1
            return sum + (e.poolAmount / participantCount)
          }, 0)
          netValues[user.id] = Math.max(0, gross - pool)
        } catch (error) {
          console.error(`Error loading earnings for ${user.id}:`, error)
          netValues[user.id] = 0
        }
      }
      setUserWeeklyNet(netValues)
      // Set individual amounts to weekly net values
      const amounts: Record<string, number> = {}
      Object.keys(netValues).forEach((userId) => {
        amounts[userId] = netValues[userId]
      })
      setIndividualAmounts(amounts)
    }
    loadWeeklyNet()
  }, [users, weekStart, weekEnd])

  const handleUserToggle = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    )
  }

  const handleAmountChange = (userId: string, value: string) => {
    setIndividualAmounts((prev) => ({
      ...prev,
      [userId]: parseFloat(value) || 0
    }))
  }

  const handleSubmit = () => {
    const data = selectedUsers.map((userId) => {
      const user = users.find((u) => u.id === userId)
      const amount = individualAmounts[userId] || 0
      return {
        userId,
        userName: user?.name || '',
        amount,
        comment: individualComments[userId] || '',
        scheduledAt: isScheduled ? scheduledDate : undefined,
      }
    })
    onSubmit(data)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className={`relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border ${
          isDark ? 'bg-[#0f1624] border-white/10' : 'bg-white border-gray-200'
        } shadow-2xl`}
      >
        {/* Header */}
        <div
          className={`sticky top-0 z-10 flex items-center justify-between p-6 border-b ${
            isDark ? 'border-white/10 bg-[#0f1624]' : 'border-gray-200 bg-white'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#4C7F6E]/20">
              <DollarSign className="w-5 h-5 text-[#4C7F6E]" />
            </div>
            <h2 className={`text-xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Назначение выплат
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Scheduled Payment Toggle */}
          <div className={`p-4 rounded-xl border ${isDark ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Отложенная выплата</p>
                <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Запланировать выплату на будущую дату</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isScheduled}
                  onChange={(e) => setIsScheduled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#4C7F6E]/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#4C7F6E]"></div>
              </label>
            </div>
            {isScheduled && (
              <div className="mt-4">
                <label className={`block text-xs font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Дата выплаты
                </label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full p-3 rounded-xl border text-sm ${
                    isDark
                      ? 'bg-white/5 border-white/10 text-white'
                      : 'bg-gray-50 border-gray-200 text-gray-900'
                  }`}
                />
              </div>
            )}
          </div>

          {/* Users List */}
          <div>
            <label className={`block text-sm font-medium mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Выберите участников ({selectedUsers.length} из {users.length})
            </label>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {users.map((user) => {
                const isSelected = selectedUsers.includes(user.id)
                return (
                  <div
                    key={user.id}
                    onClick={() => handleUserToggle(user.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? isDark
                          ? 'border-[#4C7F6E]/50 bg-[#4C7F6E]/10'
                          : 'border-[#4C7F6E] bg-[#4C7F6E]/5'
                        : isDark
                        ? 'border-white/10 bg-white/5 hover:bg-white/10'
                        : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-all ${
                        isSelected
                          ? 'bg-[#4C7F6E] border-[#4C7F6E]'
                          : isDark
                          ? 'border-white/20'
                          : 'border-gray-300'
                      }`}>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <Avatar userId={user.id} size="md" />
                      <div className="flex-1">
                        <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          <UserNickname userId={user.id} />
                        </span>
                        <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          Чистыми за неделю: ₽{(userWeeklyNet[user.id] || 0).toLocaleString()}
                        </p>
                      </div>
                      {isSelected && (
                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="number"
                            value={individualAmounts[user.id] || ''}
                            onChange={(e) => handleAmountChange(user.id, e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            placeholder="0"
                            min="0"
                            step="100"
                            className={`w-28 p-2 rounded-lg border text-right font-bold ${
                              isDark
                                ? 'bg-white/5 border-white/10 text-white placeholder-gray-500'
                                : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                            }`}
                          />
                        </div>
                      )}
                    </div>
                    {isSelected && (
                      <div className="mt-3 ml-8">
                        <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          Комментарий к выплате
                        </label>
                        <input
                          type="text"
                          value={individualComments[user.id] || ''}
                          onChange={(e) => {
                            e.stopPropagation()
                            setIndividualComments((prev) => ({ ...prev, [user.id]: e.target.value }))
                          }}
                          onClick={(e) => e.stopPropagation()}
                          placeholder="Комментарий..."
                          className={`w-full p-2 rounded-lg border text-sm ${
                            isDark
                              ? 'bg-white/5 border-white/10 text-white placeholder-gray-500'
                              : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                          }`}
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={selectedUsers.length === 0}
            className="w-full py-4 rounded-xl bg-[#4C7F6E] hover:bg-[#3d6a5c] disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Назначить выплаты
          </button>
        </div>
      </div>
    </div>
  )
}

// Payment Details Modal
const PaymentDetailsModal = ({
  payment,
  onClose,
  theme,
  onStatusChange,
  onUpdateAdminComment,
  onDelete,
  isAdmin,
  subHeadingColor,
}: {
  payment: Payment
  onClose: () => void
  theme: string
  onStatusChange: (id: string, status: PaymentStatus, comment?: string) => void
  onUpdateAdminComment: (id: string, comment: string) => void
  onDelete: (id: string) => void
  isAdmin: boolean
  subHeadingColor: string
}) => {
  const [adminComment, setAdminComment] = useState(payment.adminComment || '')
  const [isEditingComment, setIsEditingComment] = useState(false)
  const status = statusBadgeMap[payment.status]
  const isDark = theme === 'dark'

  const handleSaveComment = () => {
    onUpdateAdminComment(payment.id, adminComment)
    setIsEditingComment(false)
    onClose()
  }

  const handleDelete = () => {
    onDelete(payment.id)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className={`relative w-full max-w-lg rounded-3xl border ${
          isDark ? 'bg-[#0f1624] border-white/10' : 'bg-white border-gray-200'
        } shadow-2xl`}
      >
        <div
          className={`sticky top-0 z-10 flex items-center justify-between p-6 border-b ${
            isDark ? 'border-white/10 bg-[#0f1624]' : 'border-gray-200 bg-white'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#4C7F6E]/20">
              <DollarSign className="w-5 h-5 text-[#4C7F6E]" />
            </div>
            <h2 className={`text-xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>Детали выплаты</h2>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* User & Amount */}
          <div className="flex items-center gap-4">
            <Avatar userId={payment.userId} size="lg" />
            <div className="flex-1">
              <p className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                <UserNickname userId={payment.userId} />
              </p>
              <p className={`text-3xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
                ₽{payment.amount.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Status */}
          <div>
            <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Статус
            </p>
            <div className="flex justify-center">
              <span
                className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}
              >
                {status.icon}
                {status.label}
              </span>
            </div>
          </div>

          {/* Week Info */}
          {payment.weekStart && payment.weekEnd && (
            <div>
              <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Период выплаты
              </p>
              <div className={`p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  с {payment.weekStart} по {payment.weekEnd}
                </p>
              </div>
            </div>
          )}

          {/* Scheduled Date */}
          {payment.scheduledAt && (
            <div>
              <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Запланированная дата
              </p>
              <div className={`p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {new Date(payment.scheduledAt + 'T00:00:00').toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                </p>
              </div>
            </div>
          )}

          {/* Rejection Info */}
          {payment.rejectionReason && (
            <div>
              <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Причина отказа
              </p>
              <div className={`p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {payment.rejectionReason === 'threshold_not_reached'
                    ? 'Порог не достигнут (менее 100.000 ₽ за неделю)'
                    : payment.rejectionComment || 'Отклонено администратором'}
                </p>
              </div>
            </div>
          )}

          {/* Paid At */}
          {payment.paidAt && (
            <div>
              <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Выплачено
              </p>
              <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {new Date(payment.paidAt).toLocaleDateString('ru-RU')}
              </p>
            </div>
          )}

          {/* Admin Comment */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Комментарий админа
              </p>
              {isAdmin && !isEditingComment && (
                <button
                  onClick={() => setIsEditingComment(true)}
                  className={`text-xs font-bold px-2 py-1 rounded ${
                    isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  Редактировать
                </button>
              )}
            </div>
{isEditingComment ? (
<div className="space-y-3">
<textarea
value={adminComment}
onChange={(e) => setAdminComment(e.target.value)}
placeholder="Комментарий..."
rows={3}
className={`w-full p-3 rounded-xl border text-sm resize-none ${
isDark
? 'bg-white/5 border-white/10 text-white placeholder-gray-500'
: 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
}`}
/>
<div className="flex gap-2">
<button
onClick={handleSaveComment}
className="flex-1 py-2 rounded-xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 font-bold transition-colors flex items-center justify-center gap-2"
>
<CheckCircle2 className="w-4 h-4 flex-shrink-0" />
Сохранить
</button>
<button
onClick={() => {
setAdminComment(payment.adminComment || '')
setIsEditingComment(false)
}}
className={`flex-1 py-2 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 ${
isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-200 hover:bg-gray-300'
}`}
>
<X className="w-4 h-4 flex-shrink-0" />
Отмена
</button>
</div>
</div>
) : (
<div className={`p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'} whitespace-pre-wrap`}>
<p className={`text-sm ${payment.adminComment ? (isDark ? 'text-gray-300' : 'text-gray-700') : subHeadingColor}`}>
{payment.adminComment || 'Нет комментария'}
</p>
</div>
)}
          </div>

          {/* Admin Actions */}
          {isAdmin && (
            <div className="space-y-3 pt-4 border-t border-gray-200/10">
              <div className="flex gap-3">
                {payment.status !== 'paid' && (
                  <button
                    onClick={() => {
                      onStatusChange(payment.id, 'paid')
                      onClose()
                    }}
                    className="flex-1 py-3 rounded-xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    Выплачено
                  </button>
                )}
                {payment.status !== 'threshold_not_reached' && (
                  <button
                    onClick={() => {
                      onStatusChange(payment.id, 'threshold_not_reached', adminComment)
                      onClose()
                    }}
                    className="flex-1 py-3 rounded-xl bg-gray-500/10 text-gray-500 hover:bg-gray-500/20 font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    Ниже порога
                  </button>
                )}
              </div>
              {payment.status !== 'rejected' && (
                <button
                  onClick={() => {
                    onStatusChange(payment.id, 'rejected', adminComment)
                    onClose()
                  }}
                  className="w-full py-3 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4 flex-shrink-0" />
                  Отклонить выплату
                </button>
              )}
<button
onClick={() => {
handleDelete()
}}
className={`w-full py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 ${
isDark
? 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-300'
: 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-700'
}`}
>
<X className="w-4 h-4 flex-shrink-0" />
Удалить выплату
</button>
              <div>
                <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Комментарий к решению (необязательно)
                </label>
                <textarea
                  value={adminComment}
                  onChange={(e) => setAdminComment(e.target.value)}
                  placeholder="Комментарий..."
                  rows={2}
                  className={`w-full p-3 rounded-xl border text-sm resize-none ${
                    isDark
                      ? 'bg-white/5 border-white/10 text-white placeholder-gray-500'
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                  }`}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Payments() {
  const { theme } = useThemeStore()
  const { user } = useAuthStore()
  const { isAdmin } = useAdminStore()
  const isDark = theme === 'dark'

  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [showAssignmentModal, setShowAssignmentModal] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [weekStart, setWeekStart] = useState('')
  const [weekEnd, setWeekEnd] = useState('')
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week')

  // Get current week (Monday to Sunday)
  useEffect(() => {
    const today = new Date()
    const dayOfWeek = today.getDay()
    const monday = new Date(today)
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1))
    monday.setHours(0, 0, 0, 0)
    
    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 6)
    sunday.setHours(23, 59, 59, 999)

    setWeekStart(monday.toISOString().split('T')[0])
    setWeekEnd(sunday.toISOString().split('T')[0])
  }, [])

  const loadPayments = async () => {
    setLoading(true)
    try {
      if (isAdmin) {
        if (viewMode === 'week' && weekStart && weekEnd) {
          const data = await getPayments(weekStart, weekEnd)
          setPayments(data)
        } else if (viewMode === 'month') {
          // Получить выплаты за последние 30 дней
          const thirtyDaysAgo = new Date()
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
          const thirtyDaysAgoIso = thirtyDaysAgo.toISOString().split('T')[0]
          const today = new Date().toISOString().split('T')[0]
          const data = await getPayments(thirtyDaysAgoIso, today)
          setPayments(data)
        }
      } else if (user) {
        const data = await getUserPayments(user.id)
        setPayments(data)
      }
    } catch (error) {
      console.error('Error loading payments:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPayments()
    
    // Clean up old payments on mount
    cleanupOldPayments()
  }, [isAdmin, user?.id, weekStart, weekEnd, viewMode])

  const handleCreatePayments = async (data: { userId: string; userName: string; amount: number; comment?: string; scheduledAt?: string }[]) => {
    try {
      for (const item of data) {
        const paymentData: any = {
          userId: item.userId,
          userName: item.userName,
          amount: item.amount,
          status: item.amount === 0 ? 'threshold_not_reached' : 'pending',
          weekStart,
          weekEnd,
          createdBy: user?.id,
        }
        
        if (item.amount === 0) {
          paymentData.rejectionReason = 'threshold_not_reached'
        }
        
        if (item.comment && item.comment.trim()) {
          paymentData.adminComment = item.comment.trim()
        }
        
        if (item.scheduledAt && item.scheduledAt.trim()) {
          paymentData.scheduledAt = item.scheduledAt.trim()
        }
        
        await createPayment(paymentData)
      }
      setShowAssignmentModal(false)
      await loadPayments()
    } catch (error) {
      console.error('Error creating payments:', error)
      alert('Ошибка при создании выплат')
    }
  }

  const handleUpdateAdminComment = async (paymentId: string, comment: string) => {
    try {
      if (comment && comment.trim()) {
        await updatePayment(paymentId, {
          adminComment: comment.trim(),
        })
      } else {
        // Не обновляем поле если комментарий пустой
      }
      await loadPayments()
      // Обновляем selectedPayment чтобы UI синхронизировался
      if (selectedPayment && selectedPayment.id === paymentId) {
        setSelectedPayment({
          ...selectedPayment,
          adminComment: comment && comment.trim() ? comment.trim() : undefined,
        })
      }
    } catch (error) {
      console.error('Error updating admin comment:', error)
      alert('Ошибка при сохранении комментария')
    }
  }

  const handleDeletePayment = async (paymentId: string) => {
    try {
      await deletePayment(paymentId)
      await loadPayments()
    } catch (error) {
      console.error('Error deleting payment:', error)
      alert('Ошибка при удалении выплаты')
    }
  }

  const handleStatusChange = async (paymentId: string, status: PaymentStatus, comment?: string) => {
    try {
      const updates: any = {
        status,
      }
      
      if (status === 'paid') {
        updates.paidAt = new Date().toISOString()
      }
      
      if (status === 'threshold_not_reached' || status === 'rejected') {
        updates.rejectionReason = status === 'threshold_not_reached' ? 'threshold_not_reached' : 'admin_decision'
        if (comment && comment.trim()) {
          updates.rejectionComment = comment.trim()
        }
      } else {
        // Для статуса "paid" удаляем rejection поля
        updates.rejectionReason = deleteField()
        updates.rejectionComment = deleteField()
      }
      
      await updatePayment(paymentId, updates)
      await loadPayments()
    } catch (error) {
      console.error('Error updating payment:', error)
      alert('Ошибка при обновлении статуса')
    }
  }

  const headingColor = isDark ? 'text-white' : 'text-gray-900'
  const subHeadingColor = isDark ? 'text-gray-400' : 'text-gray-600'
  const cardBg = isDark ? 'bg-[#0b1015] border-white/5' : 'bg-white border-gray-100'

// Team users - all members including admins
const teamUsers = TEAM_MEMBERS.map((m) => ({
  id: m.id,
  name: m.name,
}))

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl sm:text-3xl font-black ${headingColor}`}>Payments</h1>
          <p className={`text-sm mt-1 ${subHeadingColor}`}>Управление выплатами членам команды</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowAssignmentModal(true)}
            className="px-5 py-2.5 rounded-xl bg-[#4C7F6E] hover:bg-[#3d6b5a] text-white font-bold text-sm transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Запись
          </button>
        )}
      </div>

      {/* Week Filter (Admin only) */}
      {isAdmin && (
        <div className={`p-4 rounded-2xl border ${cardBg}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Calendar className={`w-5 h-5 ${isDark ? 'text-[#4C7F6E]' : 'text-[#4C7F6E]'}`} />
              <div>
                <label className={`text-xs font-bold uppercase tracking-wider ${subHeadingColor}`}>
                  Период выплат
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={() => setViewMode('week')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      viewMode === 'week'
                        ? 'bg-[#4C7F6E] text-white'
                        : isDark
                        ? 'bg-white/5 text-gray-300 hover:bg-white/10'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Неделя
                  </button>
                  <button
                    onClick={() => setViewMode('month')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      viewMode === 'month'
                        ? 'bg-[#4C7F6E] text-white'
                        : isDark
                        ? 'bg-white/5 text-gray-300 hover:bg-white/10'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Месяц (30 дней)
                  </button>
                </div>
              </div>
            </div>
          </div>
          {viewMode === 'week' && (
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={weekStart}
                onChange={(e) => setWeekStart(e.target.value)}
                className={`p-2 rounded-lg border text-sm ${
                  isDark
                    ? 'bg-white/5 border-white/10 text-white'
                    : 'bg-gray-50 border-gray-200 text-gray-900'
                }`}
              />
              <span className={subHeadingColor}>—</span>
              <input
                type="date"
                value={weekEnd}
                onChange={(e) => setWeekEnd(e.target.value)}
                className={`p-2 rounded-lg border text-sm ${
                  isDark
                    ? 'bg-white/5 border-white/10 text-white'
                    : 'bg-gray-50 border-gray-200 text-gray-900'
                }`}
              />
            </div>
          )}
          {viewMode === 'month' && (
            <p className={`text-xs ${subHeadingColor}`}>
              Показываются выплаты за последние 30 дней
            </p>
          )}
        </div>
      )}

      {/* Payments Table */}
      <div className={`rounded-2xl border overflow-hidden ${cardBg}`}>
        {/* Week Period Header */}
        <div className={`p-3 border-b ${isDark ? 'border-white/10 bg-[#0b1015]' : 'border-gray-200 bg-gray-50'}`}>
          <p className={`text-sm font-bold text-center ${headingColor}`}>
            Неделя: {weekStart ? new Date(weekStart + 'T00:00:00').toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '-'} — {weekEnd ? new Date(weekEnd + 'T00:00:00').toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '-'}
          </p>
        </div>
        <div className={`grid grid-cols-12 gap-4 p-4 border-b ${isDark ? 'border-white/10' : 'border-gray-200'} font-bold text-sm`}>
          <div className={`col-span-3 text-center ${headingColor}`}>Участник</div>
          <div className={`col-span-2 text-center ${headingColor}`}>Выплата</div>
          <div className={`col-span-2 text-center ${headingColor}`}>Статус</div>
          <div className={`col-span-3 text-center ${headingColor}`}>Дата выплаты</div>
          <div className={`col-span-1 text-center ${headingColor}`}>Комментарий</div>
          <div className="col-span-1"></div>
        </div>
        <div className="divide-y divide-gray-200/10">
          {loading ? (
            <div className="text-center py-16">
              <div className="w-8 h-8 border-2 border-[#4C7F6E]/30 border-t-[#4C7F6E] rounded-full animate-spin mx-auto mb-4" />
              <p className={subHeadingColor}>Загрузка выплат...</p>
            </div>
          ) : payments.length === 0 ? (
            <div className="text-center py-16">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${isDark ? 'bg-[#4C7F6E]/20' : 'bg-[#4C7F6E]/10'}`}>
                <DollarSign className="w-8 h-8 text-[#4C7F6E]" />
              </div>
              <p className={`text-lg font-bold ${headingColor}`}>Нет выплат</p>
              <p className={`text-sm mt-1 ${subHeadingColor}`}>
                {isAdmin ? 'Назначьте выплаты участникам' : 'Вы не имеете назначенных выплат'}
              </p>
            </div>
          ) : (
            payments.map((payment) => {
              const status = statusBadgeMap[payment.status]
              return (
                <button
                  key={payment.id}
                  onClick={() => setSelectedPayment(payment)}
                  className={`w-full text-left p-4 transition-colors hover:${isDark ? 'bg-white/5' : 'bg-gray-50'}`}
                >
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className={`col-span-3 flex items-center justify-center gap-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      <Avatar userId={payment.userId} size="md" />
                      <div>
                        <p className={`font-semibold ${headingColor}`}>
                          <UserNickname userId={payment.userId} />
                        </p>
                      </div>
                    </div>
                    <div className={`col-span-2 font-black text-lg text-center ${headingColor}`}>
                      ₽{payment.amount.toLocaleString()}
                    </div>
                    <div className="col-span-2 flex justify-center">
                      <span
                        className={`inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}
                      >
                        {status.icon}
                        {status.label}
                      </span>
                    </div>
                    <div className={`col-span-3 text-sm text-center ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {payment.scheduledAt ? (
                        new Date(payment.scheduledAt + 'T00:00:00').toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
                      ) : (
                        <span className={`text-xs ${subHeadingColor}`}>-</span>
                      )}
                    </div>
                    <div className={`col-span-1 text-sm text-center ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {payment.adminComment ? payment.adminComment : <span className={`text-xs ${subHeadingColor}`}>-</span>}
                    </div>
                    <div className="col-span-1 flex justify-end gap-2">
                      <Eye className={`w-4 h-4 cursor-pointer ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`} 
                        onClick={() => setSelectedPayment(payment)}
                      />
                      {isAdmin && (
                        <X className={`w-4 h-4 cursor-pointer ${isDark ? 'text-gray-500 hover:text-rose-400' : 'text-gray-400 hover:text-rose-600'}`}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeletePayment(payment.id)
                          }}
                        />
                      )}
                    </div>
                  </div>
                </button>
              )
            })
          )}
        </div>
      </div>

      {/* Info */}
      <div className={`p-6 rounded-2xl border ${cardBg}`}>
        <h3 className={`text-sm font-black mb-3 ${headingColor}`}>Условия выплат</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span className={`text-sm font-bold ${headingColor}`}>Порог выплаты</span>
            </div>
            <p className={`text-xs ${subHeadingColor}`}>
              Порог выплаты — <strong>₽10,000</strong>
            </p>
          </div>
          <div className={`p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-[#4C7F6E]" />
              <span className={`text-sm font-bold ${headingColor}`}>Срок выплаты</span>
            </div>
            <p className={`text-xs ${subHeadingColor}`}>
              Выплаты производятся <strong>каждый понедельник</strong>
            </p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className={`p-6 rounded-2xl border ${cardBg}`}>
        <h3 className={`text-sm font-black mb-4 ${headingColor}`}>FAQ — Часто задаваемые вопросы</h3>
        <div className="space-y-4">
          <div className={`p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
            <p className={`text-sm font-bold ${headingColor}`}>1. Все ли мои выплаты отображаются здесь?</p>
            <p className={`text-xs mt-1 ${subHeadingColor}`}>Да. Сюда заносятся все виды выплат: заработок, компенсации из пула, реферальные вознаграждения. Несколько выплат могут быть объединены в одну транзакцию. В таком случае в комментарии будет указано, из каких частей состоит сумма.</p>
          </div>
          <div className={`p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
            <p className={`text-sm font-bold ${headingColor}`}>2. Мне отказали в выплате. Что делать?</p>
            <p className={`text-xs mt-1 ${subHeadingColor}`}>Прочитайте комментарий к отказу — там указана причина. Основные причины отказа: недостигнут лимит (менее 10 000 ₽ чистыми за неделю), грубые нарушения устава сообщества и документации сообщества. Если считаете отказ ошибочным — обжалуйте (см. вопрос 17).</p>
          </div>
          <div className={`p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
            <p className={`text-sm font-bold ${headingColor}`}>3. Я не вижу выплату / сумма неверна / статус «выплачено», но денег нет</p>
            <p className={`text-xs mt-1 ${subHeadingColor}`}>Обратитесь к DM через форму на сайте: Профиль → или INFO → «Обращение к DM».</p>
          </div>
          <div className={`p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
            <p className={`text-sm font-bold ${headingColor}`}>4. Могут ли задержать выплату или средства не прийти вовсе?</p>
            <p className={`text-xs mt-1 ${subHeadingColor}`}>Да. Возможные причины: неверно указан кошелек или сеть в разделе «Кошельки для выплат», мы не успели обработать заявки → выплата будет отправлена до следующего понедельника включительно, мы объединяем выплаты за две недели (уведомим заранее).</p>
          </div>
          <div className={`p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
            <p className={`text-sm font-bold ${headingColor}`}>5. В блокчейне транзакция есть, но на кошельке нет</p>
            <p className={`text-xs mt-1 ${subHeadingColor}`}>Подождите 15–30 минут — возможна перегрузка сети. Если прошло более суток → обратитесь к DM (вопрос 3). Дополнительно — проверьте в поддержке Antarctic Wallet. Если выплата была на внутренний кошелек платформы — сразу к DM.</p>
          </div>
          <div className={`p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
            <p className={`text-sm font-bold ${headingColor}`}>6. Меры предосторожности</p>
            <p className={`text-xs mt-1 ${subHeadingColor}`}>Не привязывайте карту и не оплачивайте по QR-коду подозрительные сервисы. Проверяйте адреса страниц, отзывы и соцсети сервиса перед оплатой. Не передавайте доступ к аккаунтам, скриншоты, записи экрана с чувствительной информацией. Не передавайте ключи шифрования, пин-коды. Учитывайте возможности ИИ: подделка внешности, голоса и даже присутствие в звонке.</p>
          </div>
          <div className={`p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
            <p className={`text-sm font-bold ${headingColor}`}>7. Может ли DM запросить мою SEED-фразу или пароль от кошелька?</p>
            <p className={`text-xs mt-1 ${subHeadingColor}`}>Нет. Никогда. DM, Antarctic Alpha и Antarctic Wallet не имеют права запрашивать SEED-фразу, Private Key, пароли, пин-коды или ключи шифрования. Любой такой запрос — мошенничество. Немедленно прекратите общение и сообщите через форму (вопрос 3). Единственное исключение, когда вы указываете Private Key и SEED-фразу в разделе «Trade Wallet» в профиле, доступ к данным кошелька, за исключением Private Key и SEED фразы имеет только DM и разработчики, в свою очередь Private Key и SEED фраза зашифрованы в базе данных и никому недоступны.</p>
          </div>
          <div className={`p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
            <p className={`text-sm font-bold ${headingColor}`}>8. Что делать, если я подозреваю взлом аккаунта или кражу сессии?</p>
            <p className={`text-xs mt-1 ${subHeadingColor}`}>Немедленно смените пароль на платформе. Отзовите все API-ключи и активные сессии (при наличии). Проверьте раздел «Кошельки для выплат» — замените адрес, если видите чужой. Обратитесь к DM через форму с пометкой «Взлом аккаунта».</p>
          </div>
          <div className={`p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
            <p className={`text-sm font-bold ${headingColor}`}>9. Как отозвать доступ к выплатам, если кошелек скомпрометирован?</p>
            <p className={`text-xs mt-1 ${subHeadingColor}`}>Зайдите в Профиль → Кошельки для выплат. Удалите скомпрометированный кошелек. Добавьте новый, безопасный адрес (USDT в TON или TRC-20). Важно: если выплата уже отправлена на старый адрес — средства не вернуть (см. вопрос 20).</p>
          </div>
          <div className={`p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
            <p className={`text-sm font-bold ${headingColor}`}>10. Можно ли запросить выплату досрочно вручную?</p>
            <p className={`text-xs mt-1 ${subHeadingColor}`}>По умолчанию — нет. Выплаты идут автоматически (см. вопрос 14). Исключение (ручная выплата): раз в 6 месяцев, сумма не менее 3000 ₽ чистыми, запрос через форму к DM. Во всех остальных случаях — только по расписанию.</p>
          </div>
          <div className={`p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
            <p className={`text-sm font-bold ${headingColor}`}>11. Можно ли отменить заявку на выплату после отправки?</p>
            <p className={`text-xs mt-1 ${subHeadingColor}`}>Нет.</p>
          </div>
          <div className={`p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
            <p className={`text-sm font-bold ${headingColor}`}>12. В какой валюте и сети приходят выплаты?</p>
            <p className={`text-xs mt-1 ${subHeadingColor}`}>Только USDT в одной из сетей: TON, TRC-20. Иногда — TON (сама монета). Другие валюты и сети не поддерживаются.</p>
          </div>
          <div className={`p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
            <p className={`text-sm font-bold ${headingColor}`}>13. Кто платит комиссию?</p>
            <p className={`text-xs mt-1 ${subHeadingColor}`}>Получатель. Из итоговой суммы вычитаются: Antarctic Alpha — 0,7%, Блокчейн — комиссия сети, Antarctic Wallet — комиссия сервиса (если используется их кошелек). Итоговая сумма на вашем кошельке будет меньше начисленной.</p>
          </div>
          <div className={`p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
            <p className={`text-sm font-bold ${headingColor}`}>14. Как часто приходят обычные (не ручные) выплаты?</p>
            <p className={`text-xs mt-1 ${subHeadingColor}`}>Выплаты нельзя запросить досрочно — они автоматические. График: пятница — формирование суммы, понедельник — отправка. Заработок за субботу и воскресенье переносится в следующую выплату в 85% случаях.</p>
          </div>
          <div className={`p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
            <p className={`text-sm font-bold ${headingColor}`}>15. Если отказали в выплате, можно ли запросить снова?</p>
            <p className={`text-xs mt-1 ${subHeadingColor}`}>Если причина не связана с грубыми нарушениями устава и документации сообщества, то да — в течение 3 дней с момента такого отказа.</p>
          </div>
          <div className={`p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
            <p className={`text-sm font-bold ${headingColor}`}>16. Что означает статус «Выплачено»?</p>
            <p className={`text-xs mt-1 ${subHeadingColor}`}>Средства отправлены с единого кошелька Antarctic Alpha на ваш кошелек. Дальнейшее зачисление — ответственность: блокчейна (подтверждение), сервиса-получателя (Antarctic Wallet и др.). Antarctic Alpha не гарантирует финальное зачисление на ваш баланс.</p>
          </div>
          <div className={`p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
            <p className={`text-sm font-bold ${headingColor}`}>17. Можно ли обжаловать отказ в выплате?</p>
            <p className={`text-xs mt-1 ${subHeadingColor}`}>Да. Через ту же форму, что в вопросе 3. Дедлайн: не позднее 48 часов с момента получения отказа. После 48 часов отказ окончательный.</p>
          </div>
          <div className={`p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
            <p className={`text-sm font-bold ${headingColor}`}>18. Где посмотреть актуальный устав?</p>
            <p className={`text-xs mt-1 ${subHeadingColor}`}>Раздел INFO → «Документы Antarctic Alpha». Там же — все пункты, на которые ссылаются в отказах.</p>
          </div>
          <div className={`p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
            <p className={`text-sm font-bold ${headingColor}`}>19. Почему комментарий к выплате пустой / с прочерком?</p>
            <p className={`text-xs mt-1 ${subHeadingColor}`}>Это не ошибка. Комментарий отсутствует если: в выплате только заработанная сумма (без компенсаций, рефералов и иных выплат), статус «Ожидает» или «Выплачено». Другой случай: сумма меньше 10 000 ₽ чистыми → статус «Ниже порога» или «Отказ» — комментарий также не пишется.</p>
          </div>
          <div className={`p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
            <p className={`text-sm font-bold ${headingColor}`}>20. Выплата ушла на несуществующий, старый или чужой кошелек. Средства вернут?</p>
            <p className={`text-xs mt-1 ${subHeadingColor}`}>Нет. Возврат невозможен. Вы несёте полную ответственность за корректность кошелька в профиле. Проверяйте адрес перед каждой выплатой.</p>
          </div>
        </div>
      </div>

      {/* Modals */}
      {isAdmin && showAssignmentModal && (
        <PaymentAssignmentModal
          onClose={() => setShowAssignmentModal(false)}
          onSubmit={handleCreatePayments}
          theme={theme}
          users={teamUsers}
          weekStart={weekStart}
          weekEnd={weekEnd}
        />
      )}
      {selectedPayment && (
        <PaymentDetailsModal
          payment={selectedPayment}
          onClose={() => setSelectedPayment(null)}
          theme={theme}
          onStatusChange={handleStatusChange}
          onUpdateAdminComment={handleUpdateAdminComment}
          onDelete={handleDeletePayment}
          isAdmin={isAdmin}
          subHeadingColor={subHeadingColor}
        />
      )}
    </div>
  )
}
