import { useState, useEffect } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAdminStore } from '@/store/adminStore'
import { 
  MessageSquare, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Trash2, 
  Eye,
  XCircle,
  Search
} from 'lucide-react'
import { getUserNicknameSync } from '@/utils/userUtils'
import { db } from '@/firebase/config'
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc 
} from 'firebase/firestore'

type FeedbackStatus = 'pending' | 'in_progress' | 'rejected' | 'response_ready' | 'closed'

interface FeedbackItem {
  id: string
  authorId: string
  authorName: string
  submittedAt: string
  status: FeedbackStatus
  // Block 1: Обучение и развитие
  learningMaterialsUseful: string
  contourMissing: string
  knowledgeGap: string
  skillGrowth: string
  // Block 2: Совместная торговля и сигналы
  hubUsageFrequency: string
  hubNotUsed: string
  hubImprovements: string
  tradingSessionsImprovements: string
  // Block 3: Проблемы управления и команды
  mostAnnoying: string
  fireOneTool: string
  timeWaste: string
  silentProblems: string
  communityFriendliness: string
  communityMissing: string
  replaceManager: string
  kpiGrowthBlocker: string
  killerFeature: string
  efficiencyNeeds: string
  idealManagement: string
  // Block 4: Финальный Dump
  finalDump: string
}

const STATUS_OPTIONS: { value: FeedbackStatus; label: string; color: string; bgColor: string }[] = [
  { value: 'pending', label: 'На рассмотрении', color: 'text-amber-500', bgColor: 'bg-amber-500/20' },
  { value: 'in_progress', label: 'Принято в работу', color: 'text-blue-500', bgColor: 'bg-blue-500/20' },
  { value: 'rejected', label: 'Отказано', color: 'text-red-500', bgColor: 'bg-red-500/20' },
  { value: 'response_ready', label: 'Подготовлен ответ', color: 'text-purple-500', bgColor: 'bg-purple-500/20' },
  { value: 'closed', label: 'Закрыто', color: 'text-green-500', bgColor: 'bg-green-500/20' },
]

export const FeedbackAdmin = () => {
  const { theme } = useThemeStore()
  const { isAdmin, isLimitedAdmin, hasSectionAccess } = useAdminStore()
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null)
  const [expandedBlocks, setExpandedBlocks] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')

  // Filter feedbacks based on search
  const filteredFeedbacks = feedbacks.filter(feedback => {
    const query = searchQuery.toLowerCase()
    const nickname = getUserNicknameSync(feedback.authorId)?.toLowerCase() || ''
    return (
      feedback.id.toLowerCase().includes(query) ||
      feedback.authorName.toLowerCase().includes(query) ||
      nickname.includes(query)
    )
  })

  useEffect(() => {
    const q = query(collection(db, 'unfilteredFeedback'), orderBy('submittedAt', 'desc'))
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => {
        const docData = doc.data()
        return {
          id: doc.id,
          authorId: docData.authorId || '',
          authorName: docData.authorName || '',
          submittedAt: docData.submittedAt || '',
          status: (docData.status as FeedbackStatus) || 'pending',
          learningMaterialsUseful: docData.learningMaterialsUseful || '',
          contourMissing: docData.contourMissing || '',
          knowledgeGap: docData.knowledgeGap || '',
          skillGrowth: docData.skillGrowth || '',
          hubUsageFrequency: docData.hubUsageFrequency || '',
          hubNotUsed: docData.hubNotUsed || '',
          hubImprovements: docData.hubImprovements || '',
          tradingSessionsImprovements: docData.tradingSessionsImprovements || '',
          mostAnnoying: docData.mostAnnoying || '',
          fireOneTool: docData.fireOneTool || '',
          timeWaste: docData.timeWaste || '',
          silentProblems: docData.silentProblems || '',
          communityFriendliness: docData.communityFriendliness || '',
          communityMissing: docData.communityMissing || '',
          replaceManager: docData.replaceManager || '',
          kpiGrowthBlocker: docData.kpiGrowthBlocker || '',
          killerFeature: docData.killerFeature || '',
          efficiencyNeeds: docData.efficiencyNeeds || '',
          idealManagement: docData.idealManagement || '',
          finalDump: docData.finalDump || '',
        } as FeedbackItem
      })
      setFeedbacks(data)
      setLoading(false)
    }, (error) => {
      console.error('Error loading feedbacks:', error)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const handleStatusChange = async (feedbackId: string, newStatus: FeedbackStatus) => {
    console.log('Updating feedback:', feedbackId, 'to status:', newStatus)
    
    // Update local state immediately for better UX
    setFeedbacks(prev => 
      prev.map(f => f.id === feedbackId ? { ...f, status: newStatus } : f)
    )
    
    // Then update Firebase
    try {
      const docRef = doc(db, 'unfilteredFeedback', feedbackId)
      await updateDoc(docRef, {
        status: newStatus
      })
      console.log('Status updated successfully')
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const handleDelete = async (feedbackId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот фидбек?')) return
    try {
      await deleteDoc(doc(db, 'unfilteredFeedback', feedbackId))
    } catch (error) {
      console.error('Error deleting feedback:', error)
    }
  }

  const toggleBlock = (blockId: string) => {
    setExpandedBlocks(prev => {
      const next = new Set(prev)
      if (next.has(blockId)) {
        next.delete(blockId)
      } else {
        next.add(blockId)
      }
      return next
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusConfig = (status: FeedbackStatus) => {
    return STATUS_OPTIONS.find(s => s.value === status) || STATUS_OPTIONS[0]
  }

  const renderAnswers = (feedback: FeedbackItem) => {
    const blocks = [
      {
        id: 'block1',
        title: 'Обучение и развитие',
        answers: [
          { label: 'Насколько понятны и полезны обучающие материалы?', value: feedback.learningMaterialsUseful },
          { label: 'Чего не хватает в Контуре?', value: feedback.contourMissing },
          { label: 'В какой области хотел бы прокачаться?', value: feedback.knowledgeGap },
          { label: 'Оценка роста скиллов', value: feedback.skillGrowth },
        ]
      },
      {
        id: 'block2',
        title: 'Совместная торговля и сигналы',
        answers: [
          { label: 'Как часто используешь идеи/коллы?', value: feedback.hubUsageFrequency },
          { label: 'Почему не используешь HUB?', value: feedback.hubNotUsed },
          { label: 'Что улучшить в HUB?', value: feedback.hubImprovements },
          { label: 'Что улучшить в торговых сессиях?', value: feedback.tradingSessionsImprovements },
        ]
      },
      {
        id: 'block3',
        title: 'Проблемы управления и команды',
        answers: [
          { label: 'Что бесит в процессах?', value: feedback.mostAnnoying },
          { label: 'Что бы убрал(а)?', value: feedback.fireOneTool },
          { label: 'Где теряем время?', value: feedback.timeWaste },
          { label: 'О чём молчат?', value: feedback.silentProblems },
          { label: 'Насколько дружелюбное комьюнити?', value: feedback.communityFriendliness },
          { label: 'Чего не хватает в команде?', value: feedback.communityMissing },
          { label: 'Кого бы заменил(а)?', value: feedback.replaceManager },
          { label: 'Что тормозит KPI?', value: feedback.kpiGrowthBlocker },
          { label: 'Киллер-фича?', value: feedback.killerFeature },
          { label: 'Чего не хватает для эффективности?', value: feedback.efficiencyNeeds },
          { label: 'Идеальный формат взаимодействия с DM/фаундерами', value: feedback.idealManagement },
        ]
      },
      {
        id: 'block4',
        title: 'Финальный Dump',
        answers: [
          { label: 'Дополнительные комментарии', value: feedback.finalDump },
        ]
      },
    ]

    return (
      <div className="space-y-4">
        {blocks.map(block => (
          <div key={block.id} className={`rounded-xl border overflow-hidden ${
            theme === 'dark' ? 'border-white/10' : 'border-gray-200'
          }`}>
            <button
              onClick={() => toggleBlock(block.id)}
              className={`w-full px-4 py-3 flex items-center justify-between transition-colors ${
                theme === 'dark' ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {block.title}
              </span>
              {expandedBlocks.has(block.id) ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>

            {expandedBlocks.has(block.id) && (
              <div className={`p-4 space-y-3 ${theme === 'dark' ? 'bg-black/20' : 'bg-gray-50'}`}>
                {block.answers.map((answer, idx) => (
                  answer.value && (
                    <div key={idx}>
                      <p className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {answer.label}
                      </p>
                      <p className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {answer.value}
                      </p>
                    </div>
                  )
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  const hasAccess = isAdmin || (isLimitedAdmin && hasSectionAccess('feedback-form'))

  if (!hasAccess) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-[#0b0f17]' : 'bg-gray-100'}`}>
        <div className={`text-center p-8 rounded-3xl ${theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-200'}`}>
          <XCircle className={`w-16 h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-red-400' : 'text-red-500'}`} />
          <h2 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Доступ запрещён
          </h2>
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
            Эта страница доступна только администраторам
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0b0f17]' : 'bg-gray-100'}`}>
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 w-[620px] h-[620px] bg-gradient-to-br from-[#4C7F6E]/35 via-emerald-500/22 to-transparent blur-[110px]" />
        <div className="absolute top-[-120px] right-[-180px] w-[780px] h-[780px] bg-gradient-to-bl from-[#4C7F6E]/24 via-emerald-500/22 to-transparent blur-[140px]" />
      </div>

      <div className="relative z-10 px-6 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className={`p-3 rounded-2xl ${theme === 'dark' ? 'bg-[#4C7F6E]/20' : 'bg-[#4C7F6E]/10'}`}>
              <MessageSquare className={`w-6 h-6 ${theme === 'dark' ? 'text-[#4C7F6E]' : 'text-[#4C7F6E]'}`} />
            </div>
            <div>
              <h1 className={`text-3xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Управление фидбеком
              </h1>
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                Всего обращений: {feedbacks.length}
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className={`relative rounded-xl border flex items-center gap-3 px-4 ${
              theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
            }`}>
              <Search className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск по ID, имени или никнейму..."
                className={`flex-1 py-3 bg-transparent focus:outline-none ${
                  theme === 'dark' ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className={`p-1 rounded-lg ${theme === 'dark' ? 'hover:bg-white/10 text-gray-500' : 'hover:bg-gray-100 text-gray-400'}`}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            {searchQuery && (
              <p className={`mt-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Найдено: {filteredFeedbacks.length} из {feedbacks.length}
              </p>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#4C7F6E] border-t-transparent"></div>
            </div>
          ) : filteredFeedbacks.length === 0 ? (
            <div className={`text-center py-20 rounded-3xl ${theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-200'}`}>
              <MessageSquare className={`w-16 h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
              <p className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {searchQuery ? 'Ничего не найдено' : 'Пока нет обращений'}
              </p>
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                {searchQuery ? 'Попробуйте изменить запрос' : 'Когда пользователи отправят фидбек, он появится здесь'}
              </p>
            </div>
          ) : (
            /* Table */
            <div className={`rounded-3xl overflow-hidden ${theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-200'}`}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}>
                      <th className={`px-4 py-3 text-center text-sm font-bold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        ID
                      </th>
                      <th className={`px-4 py-3 text-center text-sm font-bold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Автор
                      </th>
                      <th className={`px-4 py-3 text-center text-sm font-bold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Дата
                      </th>
                      <th className={`px-4 py-3 text-center text-sm font-bold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Статус
                      </th>
                      <th className={`px-4 py-3 text-center text-sm font-bold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Действия
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {filteredFeedbacks.map(feedback => {
                      const statusConfig = getStatusConfig(feedback.status)
                      return (
                        <tr key={feedback.id} className={theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-50'}>
                          <td className={`px-4 py-3 text-sm font-mono text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {feedback.id}
                          </td>
                          <td className={`px-4 py-3 text-sm text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {getUserNicknameSync(feedback.authorId) || feedback.authorName}
                          </td>
                          <td className={`px-4 py-3 text-sm text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            {formatDate(feedback.submittedAt)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex justify-center">
                              <select
                                value={feedback.status}
                                onChange={(e) => handleStatusChange(feedback.id, e.target.value as FeedbackStatus)}
                                className={`px-3 py-2 pr-8 rounded-lg border text-sm font-medium cursor-pointer appearance-none text-center ${statusConfig.bgColor} ${statusConfig.color} ${
                                  theme === 'dark' ? 'border-white/10 bg-transparent' : 'border-gray-200 bg-transparent'
                                }`}
                                style={{ backgroundImage: 'none', textAlign: 'center', textAlignLast: 'center' }}
                              >
                                {STATUS_OPTIONS.map(option => (
                                  <option key={option.value} value={option.value} style={{ textAlign: 'center' }}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => setSelectedFeedback(feedback)}
                                className={`p-2 rounded-lg transition-colors ${
                                  theme === 'dark' 
                                    ? 'bg-[#4C7F6E]/20 text-[#4C7F6E] hover:bg-[#4C7F6E]/30' 
                                    : 'bg-[#4C7F6E]/10 text-[#4C7F6E] hover:bg-[#4C7F6E]/20'
                                }`}
                                title="Просмотреть"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(feedback.id)}
                                className={`p-2 rounded-lg transition-colors ${
                                  theme === 'dark' 
                                    ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                                    : 'bg-red-100 text-red-500 hover:bg-red-200'
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
            </div>
          )}
        </div>
      </div>

      {/* Modal for viewing feedback */}
      {selectedFeedback && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setSelectedFeedback(null)}
          />
          <div className={`relative w-full max-w-3xl rounded-3xl border p-6 my-8 ${
            theme === 'dark' ? 'bg-[#0b1015] border-white/10' : 'bg-white border-gray-200'
          } shadow-2xl`}>
            <button
              onClick={() => setSelectedFeedback(null)}
              className={`absolute top-4 right-4 p-2 rounded-lg transition-colors ${
                theme === 'dark' ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
              }`}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <div>
                <h2 className={`text-xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Фидбек от {getUserNicknameSync(selectedFeedback.authorId) || selectedFeedback.authorName}
                </h2>
                <p className={`text-sm font-mono ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  ID: {selectedFeedback.id}
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusConfig(selectedFeedback.status).bgColor} ${getStatusConfig(selectedFeedback.status).color}`}>
                {getStatusConfig(selectedFeedback.status).label}
              </div>
            </div>

            {/* Answers */}
            {renderAnswers(selectedFeedback)}

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-white/10 flex justify-between">
              <button
                onClick={() => handleDelete(selectedFeedback.id)}
                className={`px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 ${
                  theme === 'dark' 
                    ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                    : 'bg-red-100 text-red-500 hover:bg-red-200'
                }`}
              >
                <Trash2 className="w-4 h-4" />
                Удалить
              </button>
              <button
                onClick={() => setSelectedFeedback(null)}
                className="px-6 py-2 rounded-xl bg-[#4C7F6E] hover:bg-[#4C7F6E]/90 text-white font-medium transition-colors"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
