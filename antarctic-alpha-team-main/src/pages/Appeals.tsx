import { useState, useEffect } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { getAllUsers } from '@/services/firestoreService'
import { 
  getAppeals, 
  updateAppealStatus, 
  deleteAppeal,
  APPEAL_STATUS_META
} from '@/services/appealsService'
import type { Appeal, AppealStatus, User as UserType, DMContactTopic } from '@/types'
import { 
  MessageSquare, 
  X, 
  CheckCircle2, 
  Clock, 
  Trash2,
  User,
  Mail,
  MessageCircle,
  Shield,
  Search,
  AlertCircle,
  CheckCircle,
  Hash,
  Calendar,
  Copy,
  ChevronDown,
  Link2
} from 'lucide-react'
import { DM_CONTACT_TOPICS } from '@/types'

// Маппинг тем Contact DM на отображаемые названия категорий
const TOPIC_TO_CATEGORY_META: Record<DMContactTopic, { label: string; color: string; icon: any }> = {
  bug_report: { label: 'Сообщить о баге', color: 'red', icon: AlertCircle },
  idea: { label: 'Предложить идею', color: 'green', icon: MessageSquare },
  violation: { label: 'Сообщить о нарушениях', color: 'red', icon: Shield },
  join_team: { label: 'Присоединиться к команде', color: 'blue', icon: User },
  referral: { label: 'Реферальная программа', color: 'green', icon: MessageCircle },
  earnings_pool_payments: { label: 'Заработок, пул и выплаты', color: 'amber', icon: Mail },
  card_payment: { label: 'Карта и оплата', color: 'purple', icon: Mail },
  schedule_events_tasks: { label: 'Расписание, события и задачи', color: 'blue', icon: Calendar },
  general: { label: 'Общие вопросы', color: 'gray', icon: MessageSquare },
}

const Appeals = () => {
  const { theme } = useThemeStore()
  const { user } = useAuthStore()
  
  const [appeals, setAppeals] = useState<Appeal[]>([])
  const [users, setUsers] = useState<UserType[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAppeal, setSelectedAppeal] = useState<Appeal | null>(null)
  const [selectedAppealForAction, setSelectedAppealForAction] = useState<Appeal | null>(null)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [statusToSet, setStatusToSet] = useState<AppealStatus>('in_progress')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<AppealStatus | 'all'>('all')
  const [topicFilter, setTopicFilter] = useState<DMContactTopic | 'all'>('all')
  const [adminComment, setAdminComment] = useState('')
  
  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const subTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
  
  // Загрузка данных
  useEffect(() => {
    loadAllData()
  }, [])
  
  const loadAllData = async () => {
    setLoading(true)
    try {
      const [appealsData, usersData] = await Promise.all([
        getAppeals(),
        getAllUsers()
      ])
      setAppeals(appealsData)
      setUsers(usersData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }
  
  // Получить данные пользователя по ID
  const getUserData = (userId?: string) => {
    if (!userId) return null
    return users.find(u => u.id === userId) || null
  }
  
  // Форматирование даты с временем
  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return '—'
      return date.toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return '—'
    }
  }
  
  // Генерация ID обращения
  const generateAppealId = (appeal: Appeal) => {
    // Если есть appealId из БД - используем его
    if (appeal.appealId) return appeal.appealId
    // Иначе генерируем (для старых записей)
    const timestamp = new Date(appeal.createdAt).getTime().toString(36).toUpperCase()
    const random = Math.random().toString(36).substring(2, 6).toUpperCase()
    return `APP-${timestamp}-${random}`
  }
  
  // Копирование ID
  const copyAppealId = async (appeal: Appeal) => {
    const id = generateAppealId(appeal)
    try {
      await navigator.clipboard.writeText(id)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }
  
  // Обработка изменения статуса
  const handleStatusChange = async (appeal: Appeal, status: AppealStatus) => {
    try {
      await updateAppealStatus(appeal.id, status, adminComment || undefined, user?.id)
      // Обновляем локально без ожидания сервера
      setAppeals(prev => prev.map(a => 
        a.id === appeal.id ? { 
          ...a, 
          status, 
          adminComment: adminComment || undefined, 
          processedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        } : a
      ))
      setShowStatusModal(false)
      setAdminComment('')
      setSelectedAppealForAction(null)
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Ошибка при обновлении статуса')
      // Возвращаем старый статус при ошибке
      await loadAllData()
    }
  }
  
  // Удаление обращения
  const handleDelete = async () => {
    if (!selectedAppealForAction) return
    
    try {
      await deleteAppeal(selectedAppealForAction.id)
      setAppeals(prev => prev.filter(a => a.id !== selectedAppealForAction.id))
      setShowDeleteModal(false)
      setSelectedAppealForAction(null)
    } catch (error) {
      console.error('Error deleting appeal:', error)
      alert('Ошибка при удалении обращения')
    }
  }
  
  // Фильтрация
  const filteredAppeals = appeals.filter(appeal => {
    const topic = appeal.form.topic as DMContactTopic | undefined
    
    const matchesSearch = searchQuery.toLowerCase() === '' || 
      appeal.form.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (appeal.form.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      generateAppealId(appeal).toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || appeal.status === statusFilter
    const matchesTopic = topicFilter === 'all' || (topic && topic === topicFilter)
    
    return matchesSearch && matchesStatus && matchesTopic
  })
  
  // Статистика
  const stats = {
    total: appeals.length,
    inProgress: appeals.filter(a => a.status === 'in_progress').length,
    resolved: appeals.filter(a => a.status === 'resolved').length,
    closed: appeals.filter(a => a.status === 'closed').length,
  }
  
  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-[#0b0f17]' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#4C7F6E] border-t-transparent mx-auto mb-4" />
          <p className={`${subTextColor}`}>Загрузка обращений...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0b0f17]' : 'bg-gray-50'}`}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-black mb-2 ${headingColor}`}>
            Appeals
          </h1>
          <p className={subTextColor}>
            Обращения из Contact DM
          </p>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className={`rounded-2xl p-6 ${theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${subTextColor}`}>Всего</p>
                <p className={`text-3xl font-black mt-1 ${headingColor}`}>{stats.total}</p>
              </div>
              <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <MessageSquare className={`w-6 h-6 ${subTextColor}`} />
              </div>
            </div>
          </div>
          
          <div className={`rounded-2xl p-6 ${theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${subTextColor}`}>В работе</p>
                <p className="text-3xl font-black mt-1 text-blue-500">{stats.inProgress}</p>
              </div>
              <div className="p-3 rounded-xl bg-blue-500/10">
                <Clock className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </div>
          
          <div className={`rounded-2xl p-6 ${theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${subTextColor}`}>Отработано</p>
                <p className="text-3xl font-black mt-1 text-green-500">{stats.resolved}</p>
              </div>
              <div className="p-3 rounded-xl bg-green-500/10">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </div>
          
          <div className={`rounded-2xl p-6 ${theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${subTextColor}`}>Закрыто</p>
                <p className="text-3xl font-black mt-1 text-gray-500">{stats.closed}</p>
              </div>
              <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <Shield className={`w-6 h-6 ${subTextColor}`} />
              </div>
            </div>
          </div>
        </div>
        
        {/* Filters */}
        <div className={`rounded-2xl p-4 mb-6 ${theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-200'}`}>
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${subTextColor}`} />
                <input
                  type="text"
                  placeholder="Поиск по обращению или ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                    theme === 'dark' 
                      ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#4C7F6E]' 
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E]'
                  } focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10`}
                />
              </div>
            </div>
            
            {/* Status Filter */}
            <div className="lg:w-48">
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as AppealStatus | 'all')}
                  className={`w-full appearance-none px-4 py-3 pr-10 rounded-xl border ${
                    theme === 'dark' 
                      ? 'bg-white/5 border-white/10 text-white' 
                      : 'bg-white border-gray-200 text-gray-900'
                  } focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 cursor-pointer`}
                >
                  <option value="all">Все статусы</option>
                  <option value="in_progress">В работе</option>
                  <option value="resolved">Отработано</option>
                  <option value="closed">Закрыто</option>
                </select>
                <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none ${subTextColor}`} />
              </div>
            </div>
            
            {/* Topic Filter */}
            <div className="lg:w-64">
              <div className="relative">
                <select
                  value={topicFilter}
                  onChange={(e) => setTopicFilter(e.target.value as DMContactTopic | 'all')}
                  className={`w-full appearance-none px-4 py-3 pr-10 rounded-xl border ${
                    theme === 'dark' 
                      ? 'bg-white/5 border-white/10 text-white' 
                      : 'bg-white border-gray-200 text-gray-900'
                  } focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 cursor-pointer`}
                >
                  <option value="all">Все категории</option>
                  {Object.entries(DM_CONTACT_TOPICS).map(([key, label]) => {
                    return (
                      <option key={key} value={key}>{label}</option>
                    )
                  })}
                </select>
                <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none ${subTextColor}`} />
              </div>
            </div>
          </div>
        </div>
        
        {/* Appeals Table */}
        <div className={`rounded-2xl overflow-hidden ${theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-200'}`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}>
                  <th className={`text-center py-4 px-4 text-xs font-bold uppercase tracking-wider ${subTextColor}`}>ID</th>
                  <th className={`text-center py-4 px-4 text-xs font-bold uppercase tracking-wider ${subTextColor}`}>Отправитель</th>
                  <th className={`text-center py-4 px-4 text-xs font-bold uppercase tracking-wider ${subTextColor}`}>Контакты</th>
                  <th className={`text-center py-4 px-4 text-xs font-bold uppercase tracking-wider ${subTextColor}`}>Категория</th>
                  <th className={`text-center py-4 px-4 text-xs font-bold uppercase tracking-wider ${subTextColor}`}>Статус</th>
                  <th className={`text-center py-4 px-4 text-xs font-bold uppercase tracking-wider ${subTextColor}`}>Дата</th>
                  <th className={`text-center py-4 px-4 text-xs font-bold uppercase tracking-wider ${subTextColor}`}>Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppeals.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center">
                      <MessageSquare className={`w-12 h-12 mx-auto mb-3 ${subTextColor}`} />
                      <p className={subTextColor}>Обращений не найдено</p>
                    </td>
                  </tr>
                ) : (
                  filteredAppeals.map((appeal) => {
                    const statusConfig = APPEAL_STATUS_META[appeal.status]
                    const topic = appeal.form.topic as DMContactTopic | undefined
                    const topicMeta = topic ? TOPIC_TO_CATEGORY_META[topic] : { label: 'Неизвестная категория', color: 'gray', icon: AlertCircle }
                    const TopicIcon = topicMeta.icon
                    const userData = getUserData(appeal.userId)
                    const appealId = generateAppealId(appeal)
                    
                    return (
                      <tr 
                        key={appeal.id} 
                        className={`border-b cursor-pointer transition-colors ${
                          theme === 'dark' 
                            ? 'border-white/5 hover:bg-white/5' 
                            : 'border-gray-50 hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedAppeal(appeal)}
                      >
                        <td className="py-4 px-4 text-center">
                          <div className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#4C7F6E]/10">
                            <Hash className={`w-3.5 h-3.5 ${subTextColor}`} />
                            <span className={`text-xs font-bold ${headingColor}`}>{appealId}</span>
                            {copiedId === appealId && (
                              <span className="text-xs text-green-500 ml-1">✓</span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div>
                            <p className={`text-sm font-bold ${headingColor}`}>
                              {appeal.form.name || 'Гость'}
                            </p>
                            {userData && (
                              <p className={`text-xs mt-0.5 ${subTextColor}`}>
                                ID: {userData.id}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="text-xs space-y-1">
                            <div className="flex items-center justify-center gap-1.5">
                              <MessageCircle className={`w-3.5 h-3.5 ${subTextColor}`} />
                              <span className={subTextColor}>
                                TG: {appeal.form.telegram || '—'}
                              </span>
                            </div>
                            <div className="flex items-center justify-center gap-1.5">
                              <MessageCircle className={`w-3.5 h-3.5 ${subTextColor}`} />
                              <span className={subTextColor}>
                                VK: {appeal.form.vk || '—'}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#4C7F6E]/10">
                            <TopicIcon className={`w-4 h-4 text-[#4C7F6E]`} />
                            <span className={`text-xs font-semibold ${headingColor}`}>
                              {topicMeta.label}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedAppealForAction(appeal)
                              setStatusToSet(appeal.status)
                              setShowStatusModal(true)
                            }}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-all hover:scale-105 ${statusConfig.bgColor} ${statusConfig.color}`}
                          >
                            {statusConfig.label}
                          </button>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <span className={`text-sm ${subTextColor}`}>
                              {formatDateTime(appeal.createdAt)}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                copyAppealId(appeal)
                              }}
                              className={`p-2 rounded-lg transition-colors ${
                                theme === 'dark' ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                              }`}
                              title="Копировать ID"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedAppealForAction(appeal)
                                setShowDeleteModal(true)
                              }}
                              className={`p-2 rounded-lg transition-colors ${
                                theme === 'dark' ? 'hover:bg-red-500/10 text-gray-400 hover:text-red-500' : 'hover:bg-red-50 text-gray-500 hover:text-red-500'
                              }`}
                              title="Удалить"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Modal - Appeal Details */}
      {selectedAppeal && (() => {
        const topic = selectedAppeal.form.topic as DMContactTopic | undefined
        const topicMeta = topic ? TOPIC_TO_CATEGORY_META[topic] : { label: 'Неизвестная категория', color: 'gray', icon: AlertCircle }
        const TopicIcon = topicMeta.icon
        
        return (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedAppeal(null)}
        >
          <div 
            className={`relative w-full max-w-2xl rounded-3xl border p-6 max-h-[90vh] overflow-y-auto ${
              theme === 'dark' ? 'bg-[#0b1015] border-white/10' : 'bg-white border-gray-200'
            } shadow-2xl`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedAppeal(null)}
              className={`absolute top-4 right-4 p-2 rounded-lg transition-colors ${
                theme === 'dark' ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="mb-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h2 className={`text-2xl font-black mb-2 ${headingColor}`}>
                    {selectedAppeal.form.subject}
                  </h2>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#4C7F6E]/10">
                    <TopicIcon className="w-4 h-4 text-[#4C7F6E]" />
                    <span className={`text-sm font-bold ${headingColor}`}>
                      {topicMeta.label}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#4C7F6E]/10 mb-2">
                    <Hash className={`w-4 h-4 ${subTextColor}`} />
                    <span className={`text-sm font-bold ${headingColor}`}>{generateAppealId(selectedAppeal)}</span>
                  </div>
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${APPEAL_STATUS_META[selectedAppeal.status].bgColor} ${APPEAL_STATUS_META[selectedAppeal.status].color}`}>
                    {APPEAL_STATUS_META[selectedAppeal.status].label}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Info */}
            <div className={`rounded-2xl p-4 mb-6 ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
              <h3 className={`text-sm font-bold mb-3 ${headingColor}`}>Контактные данные</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <User className={`w-4 h-4 ${subTextColor}`} />
                  <span className={subTextColor}>Имя:</span>
                  <span className={`font-medium ${headingColor}`}>{selectedAppeal.form.name || 'Гость'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className={`w-4 h-4 ${subTextColor}`} />
                  <span className={subTextColor}>Email:</span>
                  <span className={`font-medium ${headingColor}`}>{selectedAppeal.form.email || '—'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className={`w-4 h-4 ${subTextColor}`} />
                  <span className={subTextColor}>Telegram:</span>
                  <span className={`font-medium ${headingColor}`}>{selectedAppeal.form.telegram || '—'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className={`w-4 h-4 ${subTextColor}`} />
                  <span className={subTextColor}>VK:</span>
                  <span className={`font-medium ${headingColor}`}>{selectedAppeal.form.vk || '—'}</span>
                </div>
              </div>
            </div>
            
            {/* Message */}
            <div className={`rounded-2xl p-4 mb-6 ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
              <h3 className={`text-sm font-bold mb-3 ${headingColor}`}>Сообщение</h3>
              <p className={`text-sm leading-relaxed whitespace-pre-line ${headingColor}`}>
                {selectedAppeal.form.message}
              </p>
            </div>
            
            {/* Ссылки */}
            {selectedAppeal.form.links && selectedAppeal.form.links.length > 0 && (
              <div className={`rounded-2xl p-4 mb-6 ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                <h3 className={`text-sm font-bold mb-3 ${headingColor}`}>Ссылки</h3>
                <div className="space-y-2">
                  {selectedAppeal.form.links.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-[#4C7F6E] hover:underline"
                    >
                      <Link2 className="w-4 h-4" />
                      <span className="font-medium">{link.name || link.url}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
            
            {/* Скриншоты */}
            {selectedAppeal.form.screenshots && selectedAppeal.form.screenshots.length > 0 && (
              <div className={`rounded-2xl p-4 mb-6 ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                <h3 className={`text-sm font-bold mb-3 ${headingColor}`}>Скриншоты</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {selectedAppeal.form.screenshots.map((screenshot, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedScreenshot(screenshot)}
                      className="block group relative overflow-hidden rounded-xl border border-white/10 hover:ring-2 hover:ring-[#4C7F6E] transition-all"
                    >
                      <img
                        src={screenshot}
                        alt={`Screenshot ${idx + 1}`}
                        className="w-full h-32 object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23333" width="100" height="100"/%3E%3Ctext fill="%23666" x="50" y="50" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E'
                        }}
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Search className="w-6 h-6 text-white" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Доп поля для темы "Предложить идею" */}
            {selectedAppeal.form.topic === 'idea' && (
              <div className={`rounded-2xl p-4 mb-6 ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                <h3 className={`text-sm font-bold mb-3 ${headingColor}`}>Детали идеи</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className={subTextColor}>Тезис:</span>
                    <p className={`mt-1 ${headingColor}`}>{selectedAppeal.form.ideaSummary || '—'}</p>
                  </div>
                  <div>
                    <span className={subTextColor}>Предлагалась в инициативах:</span>
                    <span className={`ml-2 ${selectedAppeal.form.ideaInInitiatives ? 'text-green-500' : 'text-gray-500'}`}>
                      {selectedAppeal.form.ideaInInitiatives ? 'Да' : 'Нет'}
                    </span>
                  </div>
                  {selectedAppeal.form.ideaInitiativesReason && (
                    <div>
                      <span className={subTextColor}>Причина:</span>
                      <p className={`mt-1 ${headingColor}`}>{selectedAppeal.form.ideaInitiativesReason}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Доп поля для темы "Сообщить о нарушениях" */}
            {selectedAppeal.form.topic === 'violation' && (
              <div className={`rounded-2xl p-4 mb-6 ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                <h3 className={`text-sm font-bold mb-3 ${headingColor}`}>Детали нарушения</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className={subTextColor}>Кто нарушил:</span>
                    <span className={`ml-2 ${headingColor}`}>{selectedAppeal.form.violationWho || '—'}</span>
                  </div>
                  <div>
                    <span className={subTextColor}>Где нарушено:</span>
                    <span className={`ml-2 ${headingColor}`}>{selectedAppeal.form.violationWhere || '—'}</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Доп поля для темы "Присоединиться к команде" */}
            {selectedAppeal.form.topic === 'join_team' && (
              <div className={`rounded-2xl p-4 mb-6 ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                <h3 className={`text-sm font-bold mb-3 ${headingColor}`}>Детали заявки</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className={subTextColor}>ID анкеты:</span>
                    <span className={`ml-2 ${headingColor}`}>{selectedAppeal.form.applicationId || '—'}</span>
                  </div>
                  <div>
                    <span className={subTextColor}>Email при подаче:</span>
                    <span className={`ml-2 ${headingColor}`}>{selectedAppeal.form.applicationEmail || '—'}</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Admin Comment */}
            {selectedAppeal.adminComment && (
              <div className={`rounded-2xl p-4 mb-6 ${theme === 'dark' ? 'bg-[#4C7F6E]/10' : 'bg-[#4C7F6E]/5'}`}>
                <h3 className={`text-sm font-bold mb-2 ${headingColor}`}>Комментарий админа</h3>
                <p className={`text-sm leading-relaxed whitespace-pre-line ${headingColor}`}>
                  {selectedAppeal.adminComment}
                </p>
                {selectedAppeal.processedBy && (
                  <p className={`text-xs mt-2 ${subTextColor}`}>
                    Обработано: {formatDateTime(selectedAppeal.processedAt!)}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
        )
      })()}
      
      {/* Modal - Status Change */}
      {showStatusModal && selectedAppealForAction && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4"
          onClick={() => {
            setShowStatusModal(false)
            setSelectedAppealForAction(null)
            setAdminComment('')
          }}
        >
          <div 
            className={`relative w-full max-w-md rounded-3xl border p-6 ${
              theme === 'dark' ? 'bg-[#0b1015] border-white/10' : 'bg-white border-gray-200'
            } shadow-2xl`}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className={`text-xl font-black mb-6 ${headingColor}`}>
              Изменить статус
            </h2>
            
            <div className="space-y-3 mb-6">
              {(Object.keys(APPEAL_STATUS_META) as AppealStatus[]).map((status) => {
                const config = APPEAL_STATUS_META[status]
                return (
                  <button
                    key={status}
                    onClick={() => setStatusToSet(status)}
                    className={`w-full p-4 rounded-xl border text-left transition-all ${
                      statusToSet === status
                        ? 'border-[#4C7F6E] bg-[#4C7F6E]/10'
                        : theme === 'dark' ? 'border-white/10 hover:border-white/20' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${config.bgColor}`}>
                        {status === 'in_progress' && <Clock className={`w-4 h-4 ${config.color}`} />}
                        {status === 'resolved' && <CheckCircle2 className={`w-4 h-4 ${config.color}`} />}
                        {status === 'closed' && <Shield className={`w-4 h-4 ${config.color}`} />}
                      </div>
                      <span className={`font-bold ${headingColor}`}>{config.label}</span>
                    </div>
                  </button>
                )
              })}
            </div>
            
            <div className="mb-6">
              <label className={`block text-sm font-bold mb-2 ${headingColor}`}>
                Комментарий (необязательно)
              </label>
              <textarea
                value={adminComment}
                onChange={(e) => setAdminComment(e.target.value)}
                placeholder="Добавьте комментарий к изменению статуса..."
                rows={3}
                className={`w-full px-4 py-3 rounded-xl border ${
                  theme === 'dark' 
                    ? 'bg-white/5 border-white/10 text-white placeholder-gray-600' 
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                } focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 resize-none`}
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowStatusModal(false)
                  setSelectedAppealForAction(null)
                  setAdminComment('')
                }}
                className={`flex-1 px-4 py-3 rounded-xl font-bold transition-colors ${
                  theme === 'dark' 
                    ? 'bg-white/5 hover:bg-white/10 text-gray-300' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                Отмена
              </button>
              <button
                onClick={() => handleStatusChange(selectedAppealForAction, statusToSet)}
                className="flex-1 px-4 py-3 rounded-xl font-bold text-white transition-colors"
                style={{ backgroundColor: '#4C7F6E' }}
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal - Delete Confirmation */}
      {showDeleteModal && selectedAppealForAction && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4"
          onClick={() => {
            setShowDeleteModal(false)
            setSelectedAppealForAction(null)
          }}
        >
          <div 
            className={`relative w-full max-w-md rounded-3xl border p-6 ${
              theme === 'dark' ? 'bg-[#0b1015] border-white/10' : 'bg-white border-gray-200'
            } shadow-2xl`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-500/10 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <h2 className={`text-2xl font-black mb-2 ${headingColor}`}>
                Удалить обращение?
              </h2>
              <p className={`text-sm ${subTextColor}`}>
                Это действие нельзя отменить
              </p>
            </div>
            
            <div className={`p-4 rounded-xl mb-6 ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
              <p className={`text-sm ${headingColor}`}>
                <span className="font-bold">ID:</span> {generateAppealId(selectedAppealForAction)}
              </p>
              <p className={`text-sm ${headingColor} mt-1`}>
                <span className="font-bold">Тема:</span> {selectedAppealForAction.form.subject}
              </p>
              <p className={`text-sm ${subTextColor} mt-1`}>
                От: {selectedAppealForAction.form.name || 'Гость'}
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setSelectedAppealForAction(null)
                }}
                className={`flex-1 px-4 py-3 rounded-xl font-bold transition-colors ${
                  theme === 'dark' 
                    ? 'bg-white/5 hover:bg-white/10 text-gray-300' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                Отмена
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-3 rounded-xl font-bold text-white transition-colors bg-red-500 hover:bg-red-600"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Скриншот Modal */}
      {selectedScreenshot && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
          onClick={() => setSelectedScreenshot(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img 
              src={selectedScreenshot} 
              alt="Full screenshot" 
              className="max-w-full max-h-[85vh] object-contain rounded-xl"
            />
            <button
              onClick={() => setSelectedScreenshot(null)}
              className="absolute -top-12 right-0 p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export { Appeals }
export default Appeals