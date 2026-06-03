import { useState, useEffect } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAdminStore } from '@/store/adminStore'
import { Clock, AlertCircle, Filter, Search, MessageSquare, Copy, ChevronDown, ChevronUp, Lock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { db } from '@/firebase/config'
import { collection, query, orderBy, getDocs, doc, updateDoc } from 'firebase/firestore'

type FeedbackStatus = 'pending' | 'reviewed' | 'in_progress'
type FeedbackPriority = 'low' | 'medium' | 'high' | 'critical'

interface FeedbackItem {
  id: string
  authorId: string
  authorName: string
  authorLogin: string
  mostAnnoying: string
  fireOneTool: string
  timeWaste: string
  silentProblems: string
  ceoDecision: string
  kpiGrowthBlocker: string
  killerFeature: string
  efficiencyNeeds: string
  idealManagement: string
  knowledgeGap: string
  finalDump: string
  submittedAt: string
  status: FeedbackStatus
  priority: FeedbackPriority
  adminComment: string
}

const PRIORITY_CONFIG = {
  critical: { label: 'Критический', color: 'red', order: 0 },
  high: { label: 'Высокий', color: 'orange', order: 1 },
  medium: { label: 'Средний', color: 'yellow', order: 2 },
  low: { label: 'Низкий', color: 'green', order: 3 },
} as const

const STATUS_CONFIG = {
  pending: { label: 'Ожидает', color: 'yellow' },
  in_progress: { label: 'В работе', color: 'blue' },
  reviewed: { label: 'Рассмотрено', color: 'green' },
} as const

export const FeedbackList = () => {
  const { theme } = useThemeStore()
  const { isAdmin, isLimitedAdmin, hasSectionAccess } = useAdminStore()
  const navigate = useNavigate()

  // Проверка доступа: полный админ или limited admin с доступом к feedback-form
  const hasAccess = isAdmin || (isLimitedAdmin && hasSectionAccess('feedback-form'))

  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<FeedbackStatus | 'all'>('all')
  const [priorityFilter, setPriorityFilter] = useState<FeedbackPriority | 'all'>('all')
  const [sortField, setSortField] = useState<'submittedAt' | 'priority' | 'author'>('submittedAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [expandedFeedback, setExpandedFeedback] = useState<string | null>(null)

  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const labelColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
  const cardBg = theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-white'

  useEffect(() => {
    fetchFeedbacks()
  }, [])

  const fetchFeedbacks = async () => {
    try {
      const q = query(collection(db, 'unfilteredFeedback'), orderBy('submittedAt', 'desc'))
      const snapshot = await getDocs(q)
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as FeedbackItem[]
      setFeedbacks(items)
    } catch (error) {
      console.error('Error fetching feedbacks:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateFeedback = async (id: string, updates: Partial<FeedbackItem>) => {
    try {
      const ref = doc(db, 'unfilteredFeedback', id)
      await updateDoc(ref, updates)
      setFeedbacks(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f))
    } catch (error) {
      console.error('Error updating feedback:', error)
    }
  }

  const getDeadlineInfo = (submittedAt: string) => {
    const submitted = new Date(submittedAt)
    const deadline = new Date(submitted.getTime() + 72 * 60 * 60 * 1000) // 72 hours
    const now = new Date()
    const remaining = deadline.getTime() - now.getTime()
    
    if (remaining <= 0) {
      return { label: 'Просрочено', isOverdue: true, hoursLeft: 0 }
    }
    
    const hoursLeft = Math.floor(remaining / (1000 * 60 * 60))
    const minutesLeft = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hoursLeft >= 24) {
      const days = Math.floor(hoursLeft / 24)
      return { label: `${days} дн. ${hoursLeft % 24} ч.`, isOverdue: false, hoursLeft }
    }
    
    return { label: `${hoursLeft} ч. ${minutesLeft} мин.`, isOverdue: false, hoursLeft }
  }

  const filteredAndSortedFeedbacks = feedbacks
    .filter(f => {
      if (statusFilter !== 'all' && f.status !== statusFilter) return false
      if (priorityFilter !== 'all' && f.priority !== priorityFilter) return false
      if (searchTerm) {
        const search = searchTerm.toLowerCase()
        return (
          f.authorName.toLowerCase().includes(search) ||
          f.authorLogin.toLowerCase().includes(search) ||
          f.id.toLowerCase().includes(search)
        )
      }
      return true
    })
    .sort((a, b) => {
      let comparison = 0
      if (sortField === 'submittedAt') {
        comparison = a.submittedAt.localeCompare(b.submittedAt)
      } else if (sortField === 'priority') {
        comparison = PRIORITY_CONFIG[a.priority].order - PRIORITY_CONFIG[b.priority].order
      } else if (sortField === 'author') {
        comparison = a.authorName.localeCompare(b.authorName)
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })

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
          <p className={labelColor}>
            Эта страница доступна только администраторам.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`rounded-2xl p-6 ${cardBg} shadow-lg border-2 ${theme === 'dark' ? 'border-[#4C7F6E]/30' : 'border-[#4C7F6E]/20'
        }`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-[#4C7F6E]/20' : 'bg-[#4C7F6E]/10'}`}>
              <MessageSquare className={`w-6 h-6 ${theme === 'dark' ? 'text-[#4C7F6E]' : 'text-[#4C7F6E]'}`} />
            </div>
            <div>
              <h2 className={`text-2xl font-bold ${headingColor}`}>Unfiltered Feedback</h2>
              <p className={`text-sm ${labelColor}`}>Фидбек от команды</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/admin')}
            className={`px-4 py-2 rounded-xl font-bold transition-all ${theme === 'dark'
              ? 'bg-white/5 text-white hover:bg-white/10'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            ← Назад в Admin
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className={`rounded-2xl p-6 ${cardBg} shadow-lg border-2 ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'
        }`}>
        <div className="flex items-center gap-2 mb-4">
          <Filter className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
          <h3 className={`font-bold ${headingColor}`}>Фильтры</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Поиск по автору или ID..."
                className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 ${theme === 'dark'
                  ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#4C7F6E]'
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E]'
                }`}
              />
            </div>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as FeedbackStatus | 'all')}
            className={`px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 ${theme === 'dark'
              ? 'bg-white/5 border-white/10 text-white focus:border-[#4C7F6E]'
              : 'bg-white border-gray-200 text-gray-900 focus:border-[#4C7F6E]'
            }`}
          >
            <option value="all">Все статусы</option>
            <option value="pending">Ожидает</option>
            <option value="in_progress">В работе</option>
            <option value="reviewed">Рассмотрено</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as FeedbackPriority | 'all')}
            className={`px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 ${theme === 'dark'
              ? 'bg-white/5 border-white/10 text-white focus:border-[#4C7F6E]'
              : 'bg-white border-gray-200 text-gray-900 focus:border-[#4C7F6E]'
            }`}
          >
            <option value="all">Все приоритеты</option>
            <option value="critical">Критический</option>
            <option value="high">Высокий</option>
            <option value="medium">Средний</option>
            <option value="low">Низкий</option>
          </select>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/10">
          <span className={`text-sm font-bold ${labelColor}`}>Сортировка:</span>
          <button
            onClick={() => setSortField('submittedAt')}
            className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${sortField === 'submittedAt'
              ? 'bg-[#4C7F6E] text-white'
              : theme === 'dark' ? 'bg-white/5 text-gray-400 hover:bg-white/10' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Дате
          </button>
          <button
            onClick={() => setSortField('priority')}
            className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${sortField === 'priority'
              ? 'bg-[#4C7F6E] text-white'
              : theme === 'dark' ? 'bg-white/5 text-gray-400 hover:bg-white/10' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Приоритету
          </button>
          <button
            onClick={() => setSortField('author')}
            className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${sortField === 'author'
              ? 'bg-[#4C7F6E] text-white'
              : theme === 'dark' ? 'bg-white/5 text-gray-400 hover:bg-white/10' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Автору
          </button>
          <button
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            className={`p-1.5 rounded-lg transition-all ${theme === 'dark'
              ? 'bg-white/5 text-gray-400 hover:bg-white/10'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Feedback Table */}
      {loading ? (
        <div className={`rounded-2xl p-12 ${cardBg} shadow-lg border-2 ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}>
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#4C7F6E]"></div>
            <p className={`mt-4 ${labelColor}`}>Загрузка...</p>
          </div>
        </div>
      ) : filteredAndSortedFeedbacks.length === 0 ? (
        <div className={`rounded-2xl p-12 ${cardBg} shadow-lg border-2 ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}>
          <div className="text-center">
            <MessageSquare className={`w-16 h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
            <h3 className={`text-xl font-bold mb-2 ${headingColor}`}>Нет фидбека</h3>
            <p className={labelColor}>
              {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
                ? 'Попробуйте изменить параметры фильтрации'
                : 'Фидбек пока не поступил'
              }
            </p>
          </div>
        </div>
      ) : (
        <div className={`rounded-2xl overflow-hidden shadow-lg border-2 ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'
          }`}>
          <table className="w-full">
            <thead className={theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}>
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">ID</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Автор</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Дата</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Дедлайн</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Приоритет</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Статус</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Действия</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${theme === 'dark' ? 'divide-white/10' : 'divide-gray-200'}`}>
              {filteredAndSortedFeedbacks.map((feedback) => {
                const deadlineInfo = getDeadlineInfo(feedback.submittedAt)
                const isExpanded = expandedFeedback === feedback.id
                
                return (
                  <>
                    <tr key={feedback.id} className={`transition-colors ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`font-mono text-sm font-bold ${theme === 'dark' ? 'text-[#4C7F6E]' : 'text-[#4C7F6E]'}`}>
                            {feedback.id}
                          </span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(feedback.id)
                            }}
                            className={`p-1 rounded transition-all ${theme === 'dark' ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-200 text-gray-500'}`}
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className={`font-bold ${headingColor}`}>{feedback.authorName}</div>
                          <div className={`text-xs ${labelColor}`}>@{feedback.authorLogin}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`text-sm ${labelColor}`}>
                          {new Date(feedback.submittedAt).toLocaleDateString('ru-RU', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`flex items-center gap-2 ${deadlineInfo.isOverdue ? 'text-red-500' : ''}`}>
                          <Clock className="w-4 h-4" />
                          <span className={`text-sm font-bold ${deadlineInfo.isOverdue ? 'text-red-500' : labelColor}`}>
                            {deadlineInfo.label}
                          </span>
                          {deadlineInfo.isOverdue && <AlertCircle className="w-4 h-4 text-red-500" />}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={feedback.priority}
                          onChange={(e) => updateFeedback(feedback.id, { priority: e.target.value as FeedbackPriority })}
                          className={`px-3 py-1.5 rounded-lg text-sm font-bold border transition-all ${theme === 'dark'
                            ? 'bg-white/5 border-white/10 text-white focus:border-[#4C7F6E]'
                            : 'bg-white border-gray-200 text-gray-900 focus:border-[#4C7F6E]'
                          }`}
                        >
                          {Object.entries(PRIORITY_CONFIG).map(([key, config]) => (
                            <option key={key} value={key}>{config.label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={feedback.status}
                          onChange={(e) => updateFeedback(feedback.id, { status: e.target.value as FeedbackStatus })}
                          className={`px-3 py-1.5 rounded-lg text-sm font-bold border transition-all ${theme === 'dark'
                            ? 'bg-white/5 border-white/10 text-white focus:border-[#4C7F6E]'
                            : 'bg-white border-gray-200 text-gray-900 focus:border-[#4C7F6E]'
                          }`}
                        >
                          {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                            <option key={key} value={key}>{config.label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setExpandedFeedback(isExpanded ? null : feedback.id)}
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${theme === 'dark'
                            ? 'bg-[#4C7F6E]/10 text-[#4C7F6E] hover:bg-[#4C7F6E]/20'
                            : 'bg-[#4C7F6E]/10 text-[#4C7F6E] hover:bg-[#4C7F6E]/20'
                          }`}
                        >
                          {isExpanded ? 'Свернуть' : 'Подробнее'}
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </td>
                    </tr>
                    
                    {/* Expanded Details */}
                    {isExpanded && (
                      <tr className={theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}>
                        <td colSpan={7} className="px-6 py-6">
                          <div className="space-y-6">
                            {/* Admin Comment */}
                            <div>
                              <label className={`block text-sm font-bold mb-2 ${headingColor}`}>Комментарий админа:</label>
                              <textarea
                                value={feedback.adminComment}
                                onChange={(e) => updateFeedback(feedback.id, { adminComment: e.target.value })}
                                placeholder="Добавьте комментарий..."
                                rows={3}
                                className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 resize-none ${theme === 'dark'
                                  ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#4C7F6E]'
                                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E]'
                                }`}
                              />
                            </div>

                            {/* Feedback Content */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Block 1 */}
                              <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-white'}`}>
                                <h4 className={`font-bold mb-3 ${headingColor}`}>Блок 1: Проблемы и "боли"</h4>
                                <div className="space-y-3">
                                  {feedback.mostAnnoying && (
                                    <div>
                                      <p className={`text-xs font-bold mb-1 ${labelColor}`}>Что бесит больше всего:</p>
                                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{feedback.mostAnnoying}</p>
                                    </div>
                                  )}
                                  {feedback.fireOneTool && (
                                    <div>
                                      <p className={`text-xs font-bold mb-1 ${labelColor}`}>Что бы уволил(а):</p>
                                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{feedback.fireOneTool}</p>
                                    </div>
                                  )}
                                  {feedback.timeWaste && (
                                    <div>
                                      <p className={`text-xs font-bold mb-1 ${labelColor}`}>Где теряем время:</p>
                                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{feedback.timeWaste}</p>
                                    </div>
                                  )}
                                  {feedback.silentProblems && (
                                    <div>
                                      <p className={`text-xs font-bold mb-1 ${labelColor}`}>О чём молчат:</p>
                                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{feedback.silentProblems}</p>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Block 2 */}
                              <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-white'}`}>
                                <h4 className={`font-bold mb-3 ${headingColor}`}>Блок 2: Продукт и стратегия</h4>
                                <div className="space-y-3">
                                  {feedback.ceoDecision && (
                                    <div>
                                      <p className={`text-xs font-bold mb-1 ${labelColor}`}>Решение CEO:</p>
                                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{feedback.ceoDecision}</p>
                                    </div>
                                  )}
                                  {feedback.kpiGrowthBlocker && (
                                    <div>
                                      <p className={`text-xs font-bold mb-1 ${labelColor}`}>Тормозит KPI:</p>
                                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{feedback.kpiGrowthBlocker}</p>
                                    </div>
                                  )}
                                  {feedback.killerFeature && (
                                    <div>
                                      <p className={`text-xs font-bold mb-1 ${labelColor}`}>Киллер-фича:</p>
                                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{feedback.killerFeature}</p>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Block 3 */}
                              <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-white'}`}>
                                <h4 className={`font-bold mb-3 ${headingColor}`}>Блок 3: Личное и команда</h4>
                                <div className="space-y-3">
                                  {feedback.efficiencyNeeds && (
                                    <div>
                                      <p className={`text-xs font-bold mb-1 ${labelColor}`}>Для эффективности:</p>
                                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{feedback.efficiencyNeeds}</p>
                                    </div>
                                  )}
                                  {feedback.idealManagement && (
                                    <div>
                                      <p className={`text-xs font-bold mb-1 ${labelColor}`}>Идеальное управление:</p>
                                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{feedback.idealManagement}</p>
                                    </div>
                                  )}
                                  {feedback.knowledgeGap && (
                                    <div>
                                      <p className={`text-xs font-bold mb-1 ${labelColor}`}>Прокачать знания:</p>
                                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{feedback.knowledgeGap}</p>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Block 4 */}
                              <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-white'}`}>
                                <h4 className={`font-bold mb-3 ${headingColor}`}>Блок 4: Финальный "Dump"</h4>
                                {feedback.finalDump && (
                                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{feedback.finalDump}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
