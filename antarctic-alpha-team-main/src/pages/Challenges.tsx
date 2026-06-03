import { useState, useEffect } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAdminStore } from '@/store/adminStore'
import { useAuthStore } from '@/store/authStore'
import { Trophy, Target, Star, Medal, Crown, Users, Plus, X, Award, Trash2, Edit, Check, UserCircle, ChevronDown, ChevronUp, HelpCircle, Gift, Zap, Heart, Coins, TrendingUp, Minus, ExternalLink, ZoomIn, Image as ImageIcon } from 'lucide-react'
import { getChallenges, addChallenge, updateChallenge, deleteChallenge, joinChallenge, leaveChallenge, Challenge } from '@/services/challengesService'
import { getAllUsersPointsBalances, adjustPointsManually } from '@/services/firestoreService'
import { getUserNicknameSync } from '@/utils/userUtils'
import { TEAM_MEMBERS } from '@/types'
import Avatar from '@/components/Avatar'

export const Challenges = () => {
  const { theme } = useThemeStore()
  const { isAdmin } = useAdminStore()
  const { user } = useAuthStore()
  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const subTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
  const brandColor = '#4C7F6E'

  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null)
  const [showParticipantsModal, setShowParticipantsModal] = useState(false)
  const [selectedChallengeParticipants, setSelectedChallengeParticipants] = useState<string[]>([])
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null)
  const [usersBalances, setUsersBalances] = useState<{ userId: string; userName?: string; balance: number }[]>([])
  const [loadingBalances, setLoadingBalances] = useState(false)
  const [showPointsModal, setShowPointsModal] = useState(false)
  const [pointsAction, setPointsAction] = useState<'award' | 'revoke'>('award')
  const [pointsFormData, setPointsFormData] = useState({
    userId: '',
    points: 0,
    reason: ''
  })
  const [processingPoints, setProcessingPoints] = useState(false)
  const [showScreenshotModal, setShowScreenshotModal] = useState(false)
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null)
const [formData, setFormData] = useState({
    title: '',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    description: '',
    reward: '',
    deadline: '',
    links: [] as string[],
    screenshots: [] as string[]
  })

  // Load challenges and users balances
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load challenges
        const challengesData = await getChallenges()
        setChallenges(challengesData)
        
        // Load users points balances
        setLoadingBalances(true)
        try {
          const balances = await getAllUsersPointsBalances()
          setUsersBalances(balances)
        } catch (error) {
          console.error('Error loading balances:', error)
        } finally {
          setLoadingBalances(false)
        }
      } catch (error) {
        console.error('Error loading challenges:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [])

const handleAddChallenge = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const challengeData = {
        title: formData.title,
        difficulty: formData.difficulty,
        description: formData.description,
        reward: formData.reward,
        deadline: formData.deadline,
        links: formData.links.filter(link => link.trim()),
        screenshots: formData.screenshots
      }
      
      if (editingChallenge) {
        await updateChallenge(editingChallenge.id!, challengeData)
      } else {
        await addChallenge(challengeData)
      }
      
      const data = await getChallenges()
      setChallenges(data)
      
      setShowModal(false)
      setEditingChallenge(null)
      setFormData({
        title: '',
        difficulty: 'medium',
        description: '',
        reward: '',
        deadline: '',
        links: [],
        screenshots: []
      })
    } catch (error) {
      console.error('Error adding challenge:', error)
      alert('Ошибка при сохранении челленджа')
    }
  }

  const handleEditChallenge = (challenge: Challenge) => {
    setEditingChallenge(challenge)
    setFormData({
      title: challenge.title,
      difficulty: challenge.difficulty,
      description: challenge.description,
      reward: challenge.reward,
      deadline: challenge.deadline,
      links: challenge.links || [],
      screenshots: challenge.screenshots || []
    })
    setShowModal(true)
  }

  const handleJoinChallenge = async (challengeId: string) => {
    if (!user?.id) {
      alert('Войдите в систему для участия')
      return
    }
    
    try {
      await joinChallenge(challengeId, user.id)
      
      // Reload challenges
      const data = await getChallenges()
      setChallenges(data)
      
      alert('Вы успешно присоединились к челленджу!')
    } catch (error) {
      console.error('Error joining challenge:', error)
      alert('Ошибка при присоединении к челленджу')
    }
  }

  const handleLeaveChallenge = async (challengeId: string) => {
    if (!user?.id) return
    
    if (!confirm('Вы уверены, что хотите покинуть челлендж?')) return
    
    try {
      await leaveChallenge(challengeId, user.id)
      
      // Reload challenges
      const data = await getChallenges()
      setChallenges(data)
      
      alert('Вы покинули челлендж')
    } catch (error) {
      console.error('Error leaving challenge:', error)
      alert('Ошибка при выходе из челленджа')
    }
  }

  const handleShowParticipants = (participantIds: string[]) => {
    setSelectedChallengeParticipants(participantIds)
    setShowParticipantsModal(true)
  }

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index)
  }

  const faqItems = [
    {
      question: 'Что такое поинты ARCA?',
      answer: 'Поинты ARCA — это внутренняя валюта экосистемы Antarctic Alpha, которую вы получаете за выполнение челленджов.',
      icon: Gift
    },
    {
      question: 'В чем преимущество поинтов ARCA?',
      answer: 'Поинты можно обменять на реальные бонусы и преимущества. Обмен доступен по кнопке «Обмен» (или через форму, указанную в закрепленном сообщении).',
      icon: Zap
    },
    {
      question: 'Какие преимущества можно получить?',
      answer: null, // Will render table
      icon: Trophy
    },
    {
      question: 'В чем смысл участия в челленджах?',
      answer: 'Участие в челленджах дает вам три ключевых преимущества:\n\n• Лояльность команды: Вы демонстрируете активность. Если когда-либо будет рассматриваться вопрос об исключении, наличие участия в активностях сыграет вам на руку.\n\n• Развитие: Вы прокачиваете личные навыки и быстрее развиваетесь в трейдинге, анализе и подобном, чем занимается команда.\n\n• Дух и нетворкинг: Вы поддерживаете соревновательный настрой внутри команды и остаетесь в тонусе.',
      icon: Heart
    }
  ]

  const rewardTable = [
    { cost: '1 500 ARCA', bonus: 'Снижение отчислений в пул до 10% на 3 дня' },
    { cost: '2 500 ARCA', bonus: '15 USDT (вывод или ввод в дело)' },
    { cost: '5 000 ARCA', bonus: '30 USDT (вывод или ввод в дело)' },
    { cost: '7 500 ARCA', bonus: 'Полная отмена взносов в пул на 5 дней' }
  ]

  const handleOpenPointsModal = (action: 'award' | 'revoke') => {
    setPointsAction(action)
    setPointsFormData({ userId: '', points: 0, reason: '' })
    setShowPointsModal(true)
  }

  const handleAddLink = () => {
    if (formData.links.length < 5) {
      setFormData({ ...formData, links: [...formData.links, ''] })
    }
  }

  const handleRemoveLink = (index: number) => {
    setFormData({ ...formData, links: formData.links.filter((_, i) => i !== index) })
  }

  const handleLinkChange = (index: number, value: string) => {
    const newLinks = [...formData.links]
    newLinks[index] = value
    setFormData({ ...formData, links: newLinks })
  }

  const handleAddScreenshot = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || formData.screenshots.length + files.length > 3) {
      alert('Можно добавить до 3 скриншотов')
      return
    }
    
    // Upload files to Firebase Storage
    // For now, we'll use data URLs (in production, use Firebase Storage)
    const uploadPromises = Array.from(files).map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result as string)
        reader.readAsDataURL(file)
      })
    })

    try {
      const urls = await Promise.all(uploadPromises)
      setFormData({ ...formData, screenshots: [...formData.screenshots, ...urls] })
    } catch (error) {
      console.error('Error uploading screenshots:', error)
      alert('Ошибка при загрузке скриншотов')
    }
  }

  const handleRemoveScreenshot = (index: number) => {
    setFormData({ ...formData, screenshots: formData.screenshots.filter((_, i) => i !== index) })
  }

  const handleViewScreenshot = (url: string) => {
    setSelectedScreenshot(url)
    setShowScreenshotModal(true)
  }

  const handlePointsAction = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!pointsFormData.userId || pointsFormData.points <= 0) {
      alert('Выберите пользователя и укажите количество поинтов')
      return
    }
    
    setProcessingPoints(true)
    
    try {
      const member = TEAM_MEMBERS.find(m => m.id === pointsFormData.userId)
      if (!member) {
        alert('Пользователь не найден')
        return
      }

      const amount = pointsAction === 'award' ? pointsFormData.points : -pointsFormData.points
      await adjustPointsManually(
        pointsFormData.userId,
        amount,
        pointsFormData.reason || (pointsAction === 'award' ? 'Ручное начисление' : 'Ручное списание'),
        user?.id || 'admin',
        member.name
      )
      
      alert(`${pointsAction === 'award' ? 'Начислено' : 'Списано'} ${pointsFormData.points} ARCA POINT ${pointsAction === 'award' ? 'пользователю' : 'у'} ${member.name}`)
      
      // Reload balances
      const balances = await getAllUsersPointsBalances()
      setUsersBalances(balances)
      
      // Close modal
      setShowPointsModal(false)
      setPointsFormData({ userId: '', points: 0, reason: '' })
    } catch (error) {
      console.error('Error processing points:', error)
      alert('Ошибка при выполнении операции')
    } finally {
      setProcessingPoints(false)
    }
  }

  const handleDeleteChallenge = async (id: string) => {
    if (!confirm('Удалить этот челлендж?')) return
    
    try {
      await deleteChallenge(id)
      const data = await getChallenges()
      setChallenges(data)
      alert('Челлендж успешно удален')
    } catch (error) {
      console.error('Error deleting challenge:', error)
      alert('Ошибка при удалении челленджа')
    }
  }

  const getDifficultyBadge = (difficulty: string) => {
    const difficultyConfig = {
      easy: { label: 'Лёгкий', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20', icon: Medal },
      medium: { label: 'Средний', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20', icon: Star },
      hard: { label: 'Сложный', color: 'bg-rose-500/10 text-rose-500 border-rose-500/20', icon: Crown }
    }
    const config = difficultyConfig[difficulty as keyof typeof difficultyConfig] || difficultyConfig.medium
    const Icon = config.icon
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${config.color}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-[#4C7F6E]/30 border-t-[#4C7F6E] rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 pb-6 border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#4C7F6E]/10 rounded-2xl border border-[#4C7F6E]/20">
            <Award className="w-8 h-8 text-[#4C7F6E]" />
          </div>
          <div>
            <h1 className={`text-2xl md:text-3xl font-black tracking-tight ${headingColor}`}>
              Challenges
            </h1>
            <p className={`text-sm font-medium ${subTextColor}`}>
              Челленджи и соревнования для развития навыков
            </p>
          </div>
        </div>
        
        {isAdmin && (
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-xl bg-[#4C7F6E] hover:bg-[#3d6b5a] text-white font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-[#4C7F6E]/20"
          >
            <Plus className="w-4 h-4" />
            Добавить челлендж
          </button>
        )}
      </div>

      {/* Challenges Grid */}
      {challenges.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {challenges.map((challenge) => {
            const Icon = challenge.difficulty === 'easy' ? Medal : 
                        challenge.difficulty === 'hard' ? Crown : Star
            const isParticipant = challenge.participantIds?.includes(user?.id || '')
            
            return (
              <div
                key={challenge.id}
                className={`rounded-2xl p-6 border shadow-xl relative overflow-hidden group hover:scale-[1.02] transition-all duration-300 ${
                  theme === 'dark' 
                    ? 'border-white/10 bg-[#0f1216]' 
                    : 'border-gray-200 bg-white'
                }`}
              >
                {/* Subtle pattern background */}
                <div className="absolute inset-0 opacity-5" style={{
                  backgroundImage: `radial-gradient(circle at 2px 2px, ${brandColor} 1px, transparent 0)`,
                  backgroundSize: '24px 24px'
                }} />
                
                <div className="relative z-10 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="p-3 rounded-xl" style={{
                      backgroundColor: `${brandColor}15`,
                      color: brandColor
                    }}>
                      <Icon className="w-6 h-6" />
                    </div>
                    {getDifficultyBadge(challenge.difficulty)}
                  </div>

                  <div>
                    <h3 className={`text-lg font-bold ${headingColor}`}>{challenge.title}</h3>
                    <p className={`text-sm mt-2 whitespace-pre-wrap ${subTextColor}`}>{challenge.description}</p>
                    
                    {/* Links */}
                    {challenge.links && challenge.links.length > 0 && challenge.links.some(link => link.trim()) && (
                      <div className="mt-3 space-y-2">
                        {challenge.links.filter(link => link.trim()).map((link, index) => (
                          <a
                            key={index}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all hover:scale-105"
                            style={{
                              backgroundColor: `${brandColor}10`,
                              borderColor: `${brandColor}20`,
                              color: brandColor
                            }}
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span className="truncate max-w-[200px]">{link}</span>
                          </a>
                        ))}
                      </div>
                    )}
                    
                    {/* Screenshots */}
                    {challenge.screenshots && challenge.screenshots.length > 0 && (
                      <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
                        {challenge.screenshots.map((screenshot, index) => (
                          <div
                            key={index}
                            className="relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border border-white/10 cursor-pointer group"
                            onClick={() => handleViewScreenshot(screenshot)}
                          >
                            <img
                              src={screenshot}
                              alt={`Screenshot ${index + 1}`}
                              className="w-full h-full object-cover transition-transform group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <ZoomIn className="w-5 h-5 text-white" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Reward badge in brand color */}
                  <div className="flex items-center gap-3 p-3 rounded-xl border" style={{
                    backgroundColor: `${brandColor}10`,
                    borderColor: `${brandColor}30`
                  }}>
                    <Target style={{ color: brandColor }} className="w-5 h-5" />
                    <div>
                      <p className={`text-xs ${subTextColor}`}>Награда</p>
                      <p className="text-sm font-bold" style={{ color: brandColor }}>{challenge.reward}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm pt-2 border-t border-white/5">
                    <button
                      onClick={() => challenge.participantIds && handleShowParticipants(challenge.participantIds)}
                      className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                    >
                      <Users className={`w-4 h-4 ${subTextColor}`} />
                      <span className={subTextColor}>{challenge.participants || 0} участников</span>
                    </button>
                    <div className={`text-sm font-medium ${headingColor}`}>
                      до {new Date(challenge.deadline).toLocaleDateString('ru-RU')}
                    </div>
                  </div>

                  {/* Join/Leave button */}
                  {user && !isAdmin && (
                    <button
                      onClick={() => isParticipant 
                        ? handleLeaveChallenge(challenge.id!)
                        : handleJoinChallenge(challenge.id!)}
                      className={`w-full px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
                        isParticipant
                          ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500/20'
                          : 'bg-[#4C7F6E] text-white hover:bg-[#3d6b5a] shadow-lg shadow-[#4C7F6E]/20'
                      }`}
                    >
                      {isParticipant ? (
                        <>
                          <Check className="w-4 h-4 inline mr-2" />
                          Вы участвуете
                        </>
                      ) : (
                        'Участвовать'
                      )}
                    </button>
                  )}

                  {isAdmin && (
                    <div className="pt-2 border-t border-white/5 flex gap-3">
                      <button
                        onClick={() => handleEditChallenge(challenge)}
                        className="flex items-center gap-2 text-xs font-medium text-[#4C7F6E] hover:text-[#3d6b5a] transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        Редактировать
                      </button>
                      <button
                        onClick={() => challenge.id && handleDeleteChallenge(challenge.id)}
                        className="flex items-center gap-2 text-xs font-medium text-rose-500 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Удалить
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className={`p-8 rounded-2xl border text-center space-y-4 ${
          theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'
        }`}>
          <Trophy className={`w-16 h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
          <h3 className={`text-xl font-bold ${headingColor}`}>Нет активных челленджей</h3>
          <p className={`text-sm ${subTextColor}`}>
            {isAdmin ? 'Добавьте первый челлендж для сообщества' : 'Челленджи скоро появятся'}
          </p>
        </div>
      )}

      {/* Add/Edit Challenge Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { setShowModal(false); setEditingChallenge(null) }} />
          <div className={`relative w-full max-w-lg rounded-2xl border shadow-2xl ${
            theme === 'dark' ? 'bg-[#0f1216] border-white/10' : 'bg-white border-gray-200'
          }`}>
            <div className="p-6 border-b border-white/5">
              <div className="flex items-center justify-between">
                <h3 className={`text-xl font-bold ${headingColor}`}>
                  {editingChallenge ? 'Редактировать челлендж' : 'Добавить челлендж'}
                </h3>
                <button
                  onClick={() => { setShowModal(false); setEditingChallenge(null) }}
                  className="p-1 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <X className={`w-5 h-5 ${subTextColor}`} />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleAddChallenge} className="p-6 space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${headingColor}`}>
                  Название челленджа
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Например: Мастер трейдинга"
                  className={`w-full px-4 py-3 rounded-xl border transition-all ${
                    theme === 'dark'
                      ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#4C7F6E] focus:ring-2 focus:ring-[#4C7F6E]/20'
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-[#4C7F6E] focus:ring-2 focus:ring-[#4C7F6E]/20'
                  }`}
                  required
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${headingColor}`}>
                  Уровень сложности
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'easy', label: 'Лёгкий', icon: Medal },
                    { value: 'medium', label: 'Средний', icon: Star },
                    { value: 'hard', label: 'Сложный', icon: Crown }
                  ].map((option) => {
                    const Icon = option.icon
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, difficulty: option.value as any })}
                        className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                          formData.difficulty === option.value
                            ? 'bg-[#4C7F6E]/20 border-[#4C7F6E] text-[#4C7F6E]'
                            : theme === 'dark'
                            ? 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                            : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-xs font-medium">{option.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${headingColor}`}>
                  Что нужно сделать
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Опишите условия челленджа..."
                  rows={4}
                  className={`w-full px-4 py-3 rounded-xl border transition-all resize-none ${
                    theme === 'dark'
                      ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#4C7F6E] focus:ring-2 focus:ring-[#4C7F6E]/20'
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-[#4C7F6E] focus:ring-2 focus:ring-[#4C7F6E]/20'
                  }`}
                  required
                />
                <p className={`text-xs mt-1 ${subTextColor}`}>Форматирование сохраняется автоматически</p>
              </div>
              
              {/* Links */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${headingColor}`}>
                  Ссылки (до 5)
                </label>
                <div className="space-y-2">
                  {formData.links.map((link, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="url"
                        value={link}
                        onChange={(e) => handleLinkChange(index, e.target.value)}
                        placeholder="https://example.com"
                        className={`flex-1 px-4 py-2 rounded-xl border transition-all text-sm ${
                          theme === 'dark'
                            ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#4C7F6E]'
                            : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-[#4C7F6E]'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveLink(index)}
                        className="p-2 rounded-lg hover:bg-rose-500/20 text-rose-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {formData.links.length < 5 && (
                    <button
                      type="button"
                      onClick={handleAddLink}
                      className="w-full px-4 py-2 rounded-xl border border-dashed border-white/20 text-sm font-medium text-[#4C7F6E] hover:bg-[#4C7F6E]/10 transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Добавить ссылку
                    </button>
                  )}
                </div>
              </div>
              
              {/* Screenshots */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${headingColor}`}>
                  Скриншоты (до 3)
                </label>
                <div className="space-y-3">
                  {formData.screenshots.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {formData.screenshots.map((screenshot, index) => (
                        <div key={index} className="relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border border-white/10">
                          <img
                            src={screenshot}
                            alt={`Screenshot ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveScreenshot(index)}
                            className="absolute top-1 right-1 p-1 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {formData.screenshots.length < 3 && (
                    <label className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border border-dashed border-white/20 text-sm font-medium text-[#4C7F6E] hover:bg-[#4C7F6E]/10 transition-colors cursor-pointer">
                      <ImageIcon className="w-4 h-4" />
                      <span>Загрузить скриншот</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleAddScreenshot}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${headingColor}`}>
                  Награда
                </label>
                <input
                  type="text"
                  value={formData.reward}
                  onChange={(e) => setFormData({ ...formData, reward: e.target.value })}
                  placeholder="Например: 500 ARCA Points"
                  className={`w-full px-4 py-3 rounded-xl border transition-all ${
                    theme === 'dark'
                      ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#4C7F6E] focus:ring-2 focus:ring-[#4C7F6E]/20'
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-[#4C7F6E] focus:ring-2 focus:ring-[#4C7F6E]/20'
                  }`}
                  required
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${headingColor}`}>
                  Дедлайн
                </label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border transition-all ${
                    theme === 'dark'
                      ? 'bg-white/5 border-white/10 text-white focus:border-[#4C7F6E] focus:ring-2 focus:ring-[#4C7F6E]/20'
                      : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-[#4C7F6E] focus:ring-2 focus:ring-[#4C7F6E]/20'
                  }`}
                  required
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setEditingChallenge(null) }}
                  className={`flex-1 px-4 py-3 rounded-xl font-bold transition-all ${
                    theme === 'dark'
                      ? 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                      : 'bg-gray-50 border border-gray-200 text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 rounded-xl bg-[#4C7F6E] hover:bg-[#3d6b5a] text-white font-bold transition-all shadow-lg shadow-[#4C7F6E]/20"
                >
                  {editingChallenge ? 'Сохранить' : 'Добавить челлендж'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Team Points Table */}
      <div className={`mt-12 rounded-2xl border overflow-hidden ${
        theme === 'dark' ? 'border-white/10 bg-[#0f1216]' : 'border-gray-200 bg-white'
      }`}>
        <div className="p-6 border-b border-white/5" style={{
          background: `linear-gradient(to right, ${brandColor}15, transparent)`
        }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl" style={{
                backgroundColor: `${brandColor}20`,
                color: brandColor
              }}>
                <Coins className="w-6 h-6" />
              </div>
              <div>
                <h2 className={`text-xl font-bold ${headingColor}`}>ARCA POINT Команды</h2>
                <p className={`text-sm ${subTextColor}`}>Баланс поинтов всех участников</p>
              </div>
            </div>
            
            {isAdmin && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenPointsModal('award')}
                  className="px-3 py-2 rounded-xl bg-emerald-500/20 text-emerald-500 border border-emerald-500/20 font-bold text-xs hover:bg-emerald-500/30 transition-all flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Начислить
                </button>
                <button
                  onClick={() => handleOpenPointsModal('revoke')}
                  className="px-3 py-2 rounded-xl bg-rose-500/20 text-rose-500 border border-rose-500/20 font-bold text-xs hover:bg-rose-500/30 transition-all flex items-center gap-1"
                >
                  <Minus className="w-3.5 h-3.5" />
                  Отобрать
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{
                background: `linear-gradient(to right, ${brandColor}20, ${brandColor}10)`
              }}>
                <th className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${headingColor}`}>
                  Участник
                </th>
                <th className={`px-6 py-4 text-right text-xs font-bold uppercase tracking-wider ${headingColor}`}>
                  ARCA POINT
                </th>
                <th className={`px-6 py-4 text-center text-xs font-bold uppercase tracking-wider ${headingColor}`}>
                  Статус
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${theme === 'dark' ? 'divide-white/5' : 'divide-gray-100'}`}>
              {loadingBalances ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center">
                    <div className="w-8 h-8 border-2 border-[#4C7F6E]/30 border-t-[#4C7F6E] rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              ) : TEAM_MEMBERS.length > 0 ? (
                TEAM_MEMBERS
                  .map(member => {
                    const userBalance = usersBalances.find(b => b.userId === member.id)
                    return {
                      ...member,
                      points: userBalance?.balance || 0
                    }
                  })
                  .sort((a, b) => b.points - a.points)
                  .map((member) => {
                    const isCurrentUser = user?.id === member.id
                    
                    return (
                      <tr 
                        key={member.id}
                        className={`transition-colors ${isCurrentUser ? 'bg-[#4C7F6E]/10' : 'hover:bg-white/5'}`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar user={member} size="sm" />
                            <div>
                              <p className={`font-semibold ${headingColor}`}>
                                {member.name}
                                {isCurrentUser && (
                                  <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold" style={{
                                    backgroundColor: `${brandColor}20`,
                                    color: brandColor
                                  }}>
                                    Вы
                                  </span>
                                )}
                              </p>
                              <p className={`text-xs ${subTextColor}`}>ID: {member.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <span className={`text-lg font-black ${headingColor}`}>
                              {member.points.toLocaleString('ru-RU')}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                              member.points > 0 
                                ? 'bg-emerald-500/20 text-emerald-500' 
                                : 'bg-gray-500/20 text-gray-500'
                            }`}>
                              ARCA POINT
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {member.points > 1000 ? (
                            <div className="flex items-center justify-center gap-1">
                              <TrendingUp className="w-4 h-4 text-emerald-500" />
                              <span className="text-sm font-medium text-emerald-500">Активный</span>
                            </div>
                          ) : member.points > 0 ? (
                            <span className="text-sm font-medium text-amber-500">Начинающий</span>
                          ) : (
                            <span className={`text-sm font-medium ${subTextColor}`}>Новый</span>
                          )}
                        </td>
                      </tr>
                    )
                  })
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center">
                    <p className={subTextColor}>Нет данных о балансе</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ Section */}
      <div className={`mt-12 rounded-2xl border overflow-hidden ${
        theme === 'dark' ? 'border-white/10 bg-[#0f1216]' : 'border-gray-200 bg-white'
      }`}>
        <div className="p-6 border-b border-white/5" style={{
          background: `linear-gradient(135deg, ${brandColor}15 0%, ${brandColor}5 100%)`
        }}>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl" style={{
              backgroundColor: `${brandColor}20`,
              color: brandColor
            }}>
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className={`text-xl font-bold ${headingColor}`}>FAQ: Челленджи и поинты ARCA</h2>
              <p className={`text-sm ${subTextColor}`}>Ответы на частые вопросы</p>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-2">
          {faqItems.map((item, index) => {
            const Icon = item.icon
            const isExpanded = expandedFAQ === index
            
            return (
              <div
                key={index}
                className={`rounded-xl border transition-all duration-300 overflow-hidden ${
                  isExpanded
                    ? 'border-[#4C7F6E]/30 bg-[#4C7F6E]/5'
                    : theme === 'dark' 
                      ? 'border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]' 
                      : 'border-gray-100 bg-gray-50/50 hover:border-gray-200 hover:bg-gray-50'
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full p-5 flex items-start gap-4 text-left"
                >
                  <div className={`p-3 rounded-xl flex-shrink-0 transition-all duration-300 ${
                    isExpanded 
                      ? 'bg-[#4C7F6E]/20 scale-110' 
                      : 'bg-white/5 hover:bg-white/10'
                  }`}>
                    <Icon className={`w-5 h-5 transition-colors ${
                      isExpanded ? 'text-[#4C7F6E]' : subTextColor
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-semibold ${headingColor} group-hover:text-[#4C7F6E] transition-colors`}>
                      {item.question}
                    </h3>
                  </div>
                  <div className={`p-2 rounded-full transition-all duration-300 ${
                    isExpanded 
                      ? 'bg-[#4C7F6E]/20' 
                      : 'bg-white/5'
                  }`}>
                    {isExpanded ? (
                      <ChevronUp className={`w-4 h-4 text-[#4C7F6E]`} />
                    ) : (
                      <ChevronDown className={`w-4 h-4 ${subTextColor}`} />
                    )}
                  </div>
                </button>
                
                {isExpanded && (
                  <div className="px-5 pb-5 pl-16 pt-0">
                    <div className="pt-4 border-t border-white/5">
                      {item.answer ? (
                        <p className={`text-sm leading-relaxed whitespace-pre-line ${subTextColor}`}>
                          {item.answer}
                        </p>
                      ) : (
                        <div className="overflow-x-auto rounded-xl border border-white/10">
                          <table className={`w-full text-sm ${
                            theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'
                          }`}>
                            <thead>
                              <tr style={{
                                background: `linear-gradient(135deg, ${brandColor}20 0%, ${brandColor}10 100%)`
                              }}>
                                <th className={`px-4 py-3 text-left font-semibold ${headingColor}`}>Стоимость</th>
                                <th className={`px-4 py-3 text-left font-semibold ${headingColor}`}>Бонус</th>
                              </tr>
                            </thead>
                            <tbody className={`divide-y ${theme === 'dark' ? 'divide-white/5' : 'divide-gray-200'}`}>
                              {rewardTable.map((row, rowIndex) => (
                                <tr key={rowIndex} className={`transition-colors ${
                                  theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-100'
                                }`}>
                                  <td className={`px-4 py-3 font-mono font-bold ${headingColor}`}>
                                    {row.cost}
                                  </td>
                                  <td className={`px-4 py-3 ${subTextColor}`}>
                                    {row.bonus}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Participants Modal */}
      {showParticipantsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowParticipantsModal(false)} />
          <div className={`relative w-full max-w-2xl rounded-2xl border shadow-2xl max-h-[80vh] overflow-hidden ${
            theme === 'dark' ? 'bg-[#0f1216] border-white/10' : 'bg-white border-gray-200'
          }`}>
            <div className="p-6 border-b border-white/5">
              <div className="flex items-center justify-between">
                <h3 className={`text-xl font-bold ${headingColor}`}>Участники челленджа</h3>
                <button
                  onClick={() => setShowParticipantsModal(false)}
                  className="p-1 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <X className={`w-5 h-5 ${subTextColor}`} />
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {selectedChallengeParticipants.length > 0 ? (
                <div className="space-y-3">
                  {selectedChallengeParticipants.map((userId, index) => {
                    const nickname = getUserNicknameSync(userId)
                    return (
                      <div
                        key={userId}
                        className={`flex items-center gap-3 p-4 rounded-xl border ${
                          theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{
                          backgroundColor: `${brandColor}20`,
                          color: brandColor
                        }}>
                          <UserCircle className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <p className={`font-semibold ${headingColor}`}>{nickname || `User #${index + 1}`}</p>
                          <p className={`text-xs ${subTextColor}`}>ID: {userId}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className={`w-16 h-16 mx-auto mb-4 ${subTextColor}`} />
                  <p className={subTextColor}>Пока нет участников</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Screenshot View Modal */}
      {showScreenshotModal && selectedScreenshot && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setShowScreenshotModal(false)} />
          <div className="relative w-full max-w-5xl max-h-[90vh] flex items-center justify-center">
            <img
              src={selectedScreenshot}
              alt="Screenshot"
              className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
            />
            <button
              onClick={() => setShowScreenshotModal(false)}
              className="absolute top-4 right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* Points Management Modal */}
      {showPointsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowPointsModal(false)} />
          <div className={`relative w-full max-w-lg rounded-2xl border shadow-2xl ${
            theme === 'dark' ? 'bg-[#0f1216] border-white/10' : 'bg-white border-gray-200'
          }`}>
            <div className="p-6 border-b border-white/5">
              <div className="flex items-center justify-between">
                <h3 className={`text-xl font-bold ${headingColor}`}>
                  {pointsAction === 'award' ? 'Начислить ARCA POINT' : 'Отобрать ARCA POINT'}
                </h3>
                <button
                  onClick={() => setShowPointsModal(false)}
                  className="p-1 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <X className={`w-5 h-5 ${subTextColor}`} />
                </button>
              </div>
            </div>
            
            <form onSubmit={handlePointsAction} className="p-6 space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${headingColor}`}>
                  Участник
                </label>
                <select
                  value={pointsFormData.userId}
                  onChange={(e) => setPointsFormData({ ...pointsFormData, userId: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border transition-all ${
                    theme === 'dark'
                      ? 'bg-white/5 border-white/10 text-white focus:border-[#4C7F6E] focus:ring-2 focus:ring-[#4C7F6E]/20'
                      : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-[#4C7F6E] focus:ring-2 focus:ring-[#4C7F6E]/20'
                  }`}
                  required
                >
                  <option value="">Выберите участника</option>
                  {TEAM_MEMBERS.map(member => (
                    <option key={member.id} value={member.id}>
                      {member.name} (ID: {member.id})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${headingColor}`}>
                  Количество ARCA POINT
                </label>
                <input
                  type="number"
                  min="1"
                  value={pointsFormData.points || ''}
                  onChange={(e) => setPointsFormData({ ...pointsFormData, points: parseInt(e.target.value) || 0 })}
                  placeholder="Например: 500"
                  className={`w-full px-4 py-3 rounded-xl border transition-all ${
                    theme === 'dark'
                      ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#4C7F6E] focus:ring-2 focus:ring-[#4C7F6E]/20'
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-[#4C7F6E] focus:ring-2 focus:ring-[#4C7F6E]/20'
                  }`}
                  required
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${headingColor}`}>
                  Причина (опционально)
                </label>
                <textarea
                  value={pointsFormData.reason}
                  onChange={(e) => setPointsFormData({ ...pointsFormData, reason: e.target.value })}
                  placeholder="Опишите причину..."
                  rows={3}
                  className={`w-full px-4 py-3 rounded-xl border transition-all resize-none ${
                    theme === 'dark'
                      ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#4C7F6E] focus:ring-2 focus:ring-[#4C7F6E]/20'
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-[#4C7F6E] focus:ring-2 focus:ring-[#4C7F6E]/20'
                  }`}
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowPointsModal(false)}
                  className={`flex-1 px-4 py-3 rounded-xl font-bold transition-all ${
                    theme === 'dark'
                      ? 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                      : 'bg-gray-50 border border-gray-200 text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={processingPoints}
                  className={`flex-1 px-4 py-3 rounded-xl font-bold transition-all ${
                    pointsAction === 'award'
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                      : 'bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/20'
                  } disabled:opacity-50`}
                >
                  {processingPoints ? 'Обработка...' : pointsAction === 'award' ? 'Начислить' : 'Отобрать'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Challenges
