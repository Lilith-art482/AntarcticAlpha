import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { Check, ArrowRight, Send, Copy, MessageSquare, Sparkles, BookOpen, TrendingUp, Users } from 'lucide-react'
import CustomCursor from '@/components/CustomCursor'

type Section = 'block1' | 'block2' | 'block3' | 'block4' | 'success'

type FeedbackData = {
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
  
  // Block 4: Финальный "Dump"
  finalDump: string
}

export const UnfilteredFeedback = () => {
  const { theme } = useThemeStore()
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [currentSection, setSection] = useState<Section>('block1')
  const [feedbackId, setFeedbackId] = useState('')
  const [copied, setCopied] = useState(false)
  
  const [formData, setFormData] = useState<FeedbackData>({
    // Block 1
    learningMaterialsUseful: '',
    contourMissing: '',
    knowledgeGap: '',
    skillGrowth: '',
    // Block 2
    hubUsageFrequency: '',
    hubNotUsed: '',
    hubImprovements: '',
    tradingSessionsImprovements: '',
    // Block 3
    mostAnnoying: '',
    fireOneTool: '',
    timeWaste: '',
    silentProblems: '',
    communityFriendliness: '',
    communityMissing: '',
    replaceManager: '',
    kpiGrowthBlocker: '',
    killerFeature: '',
    efficiencyNeeds: '',
    idealManagement: '',
    // Block 4
    finalDump: '',
  })

  // Auto-resize textarea
  useEffect(() => {
    const textareas = document.querySelectorAll('textarea')
    textareas.forEach(textarea => {
      textarea.style.height = 'auto'
      textarea.style.height = textarea.scrollHeight + 'px'
    })
  }, [formData])

  const handleInputChange = (field: keyof FeedbackData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const generateFeedbackId = () => {
    return 'UF-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase()
  }

  const handleSubmit = async () => {
    const newId = generateFeedbackId()
    setFeedbackId(newId)
    
    const feedbackData = {
      id: newId,
      authorId: user?.id || 'anonymous',
      authorName: user?.name || 'Аноним',
      authorLogin: user?.login || '',
      ...formData,
      submittedAt: new Date().toISOString(),
      status: 'pending',
      priority: 'medium' as const,
      adminComment: '',
    }
    
    // Save to Firestore
    try {
      const { db } = await import('@/firebase/config')
      const { collection, addDoc } = await import('firebase/firestore')
      await addDoc(collection(db, 'unfilteredFeedback'), feedbackData)
    } catch (error) {
      console.error('Error saving feedback:', error)
      // Fallback to localStorage
      localStorage.setItem('feedback_' + newId, JSON.stringify(feedbackData))
    }
    
    setSection('success')
  }

  const copyFeedbackId = () => {
    navigator.clipboard.writeText(feedbackId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const nextSection = () => {
    const sections: Section[] = ['block1', 'block2', 'block3', 'block4']
    const currentIndex = sections.indexOf(currentSection)
    if (currentIndex < sections.length - 1) {
      setSection(sections[currentIndex + 1])
    }
  }

  const prevSection = () => {
    const sections: Section[] = ['block1', 'block2', 'block3', 'block4']
    const currentIndex = sections.indexOf(currentSection)
    if (currentIndex > 0) {
      setSection(sections[currentIndex - 1])
    }
  }

  const getBlockNumber = () => {
    const blocks = ['block1', 'block2', 'block3', 'block4']
    return blocks.indexOf(currentSection) + 1
  }

  const getBlockTitle = () => {
    switch (currentSection) {
      case 'block1': return 'Обучение и развитие'
      case 'block2': return 'Совместная торговля и сигналы'
      case 'block3': return 'Проблемы управления и команды'
      case 'block4': return 'Финальный "Dump"'
      default: return ''
    }
  }

  const getBlockIcon = () => {
    switch (currentSection) {
      case 'block1': return BookOpen
      case 'block2': return TrendingUp
      case 'block3': return Users
      case 'block4': return Sparkles
      default: return MessageSquare
    }
  }

  const BlockIcon = getBlockIcon()

  return (
    <>
      <CustomCursor />
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0b0f17]' : 'bg-white'}`}>
        {/* Background Effects */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -left-24 w-[620px] h-[620px] bg-gradient-to-br from-[#4C7F6E]/35 via-emerald-500/22 to-transparent blur-[110px]" />
          <div className="absolute top-[-120px] right-[-180px] w-[780px] h-[780px] bg-gradient-to-bl from-[#4C7F6E]/24 via-emerald-500/22 to-transparent blur-[140px]" />
          <div className="floating-grid opacity-30" />
        </div>

        {/* Content */}
        <div className="relative z-10">
          {currentSection !== 'success' && (
            <div className="min-h-[calc(100vh-5rem)] px-6 py-12">
              <div className="max-w-3xl mx-auto">
                {/* Introduction */}
                {currentSection === 'block1' && (
                  <div className={`rounded-3xl p-8 mb-8 ${theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-gray-50 border border-gray-200'}`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-3 rounded-2xl ${theme === 'dark' ? 'bg-[#4C7F6E]/20' : 'bg-[#4C7F6E]/10'}`}>
                        <MessageSquare className={`w-6 h-6 ${theme === 'dark' ? 'text-[#4C7F6E]' : 'text-[#4C7F6E]'}`} />
                      </div>
                      <h2 className={`text-2xl sm:text-3xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Feedback Loop: Развитие команды и продукта
                      </h2>
                    </div>
                    <p className={`mb-6 leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Цель этой анкеты — собрать объективную картину того, как живет наш проект. Твои ответы напрямую повлияют на то, какие процессы мы изменим в следующем спринте и какие фичи возьмем в приоритет.
                    </p>
                    <div className={`rounded-xl p-6 mb-6 ${theme === 'dark' ? 'bg-[#4C7F6E]/10 border border-[#4C7F6E]/20' : 'bg-[#4C7F6E]/5 border border-[#4C7F6E]/20'}`}>
                      <p className={`font-bold mb-3 ${theme === 'dark' ? 'text-[#4C7F6E]' : 'text-[#4C7F6E]'}`}>
                        Мы ценим твое время. Эту анкету можно заполнить двумя способами:
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${theme === 'dark' ? 'bg-[#4C7F6E]/20 text-[#4C7F6E]' : 'bg-[#4C7F6E]/10 text-[#4C7F6E]'}`}>
                            <span className="text-xs font-bold">1</span>
                          </div>
                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            <span className="font-bold">Полный Check-up:</span> Ответить на все вопросы по разделам, чтобы мы увидели общую картину.
                          </p>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${theme === 'dark' ? 'bg-[#4C7F6E]/20 text-[#4C7F6E]' : 'bg-[#4C7F6E]/10 text-[#4C7F6E]'}`}>
                            <span className="text-xs font-bold">2</span>
                          </div>
                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            <span className="font-bold">Fast Track:</span> Если у тебя есть конкретная идея или «горит» один вопрос — нажми кнопку «Свое предложение». Это позволит пропустить стандартные блоки и сразу перейти к сути.
                          </p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSection('block4')}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-[#4C7F6E] to-emerald-600 hover:from-[#4C7F6E]/90 hover:to-emerald-600/90 text-white font-bold transition-all shadow-lg shadow-[#4C7F6E]/20 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Sparkles className="w-5 h-5" />
                      <span>Свое предложение</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                )}

                {/* Progress Header */}
                <div className="mb-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#4C7F6E]/10 text-[#4C7F6E] text-sm font-bold mb-4">
                    <span className="w-2 h-2 rounded-full bg-[#4C7F6E]" />
                    Блок {getBlockNumber()} из 4
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-3 rounded-2xl ${theme === 'dark' ? 'bg-[#4C7F6E]/20' : 'bg-[#4C7F6E]/10'}`}>
                      <BlockIcon className={`w-6 h-6 ${theme === 'dark' ? 'text-[#4C7F6E]' : 'text-[#4C7F6E]'}`} />
                    </div>
                    <h2 className={`text-3xl sm:text-4xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {getBlockTitle()}
                    </h2>
                  </div>
                  <p className={`text-gray-500 dark:text-gray-400 font-medium leading-relaxed`}>
                    Все вопросы необязательны. Отвечай честно — это поможет нам сделать команду лучше.
                  </p>
                </div>

                {/* Questions Form */}
                <div className={`rounded-3xl p-8 space-y-8 ${theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-gray-50 border border-gray-200'}`}>
                  {/* Block 1 Questions: Обучение и развитие */}
                  {currentSection === 'block1' && (
                    <>
                      <div className="space-y-4">
                        <label className={`text-lg font-bold block ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          Насколько тебе понятны и полезны обучающие материалы в Контуре?
                        </label>
                        <textarea
                          value={formData.learningMaterialsUseful}
                          onChange={(e) => handleInputChange('learningMaterialsUseful', e.target.value)}
                          placeholder="Оцени полезность материалов и объясни почему..."
                          rows={3}
                          className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 resize-none overflow-hidden ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E]'}`}
                        />
                      </div>

                      <div className="space-y-4">
                        <label className={`text-lg font-bold block ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          Чего не хватает в Контуре?
                        </label>
                        <textarea
                          value={formData.contourMissing}
                          onChange={(e) => handleInputChange('contourMissing', e.target.value)}
                          placeholder="Каких знаний, инструментов или материалов не хватает..."
                          rows={3}
                          className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 resize-none overflow-hidden ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E]'}`}
                        />
                      </div>

                      <div className="space-y-4">
                        <label className={`text-lg font-bold block ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          В какой области знаний (крипто-нарративы, техстек, софт-скиллы) ты хотел(а) бы прокачаться сильнее, но не хватает знаний в Контуре?
                        </label>
                        <textarea
                          value={formData.knowledgeGap}
                          onChange={(e) => handleInputChange('knowledgeGap', e.target.value)}
                          placeholder="В какой области тебе нужна поддержка?"
                          rows={3}
                          className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 resize-none overflow-hidden ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E]'}`}
                        />
                      </div>

                      <div className="space-y-4">
                        <label className={`text-lg font-bold block ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          Оцени, насколько ты реально повысил или повысила скиллы за время нахождения в проекте?
                        </label>
                        <textarea
                          value={formData.skillGrowth}
                          onChange={(e) => handleInputChange('skillGrowth', e.target.value)}
                          placeholder="В каких направлениях вырос? Что далось легко, а что - сложно?"
                          rows={3}
                          className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 resize-none overflow-hidden ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E]'}`}
                        />
                      </div>
                    </>
                  )}

                  {/* Block 2 Questions: Совместная торговля и сигналы */}
                  {currentSection === 'block2' && (
                    <>
                      <div className="space-y-4">
                        <label className={`text-lg font-bold block ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          Как часто ты используешь идеи / коллы от участников проекта?
                        </label>
                        <textarea
                          value={formData.hubUsageFrequency}
                          onChange={(e) => handleInputChange('hubUsageFrequency', e.target.value)}
                          placeholder="Как часто заходишь в HUB? Какие идеи используешь?"
                          rows={3}
                          className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 resize-none overflow-hidden ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E]'}`}
                        />
                      </div>

                      <div className="space-y-4">
                        <label className={`text-lg font-bold block ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          Если не используете HUB проекта, расскажите почему?
                        </label>
                        <textarea
                          value={formData.hubNotUsed}
                          onChange={(e) => handleInputChange('hubNotUsed', e.target.value)}
                          placeholder="Что мешает использовать HUB?"
                          rows={3}
                          className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 resize-none overflow-hidden ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E]'}`}
                        />
                      </div>

                      <div className="space-y-4">
                        <label className={`text-lg font-bold block ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          Что стоит улучшить в HUB?
                        </label>
                        <textarea
                          value={formData.hubImprovements}
                          onChange={(e) => handleInputChange('hubImprovements', e.target.value)}
                          placeholder="Какие улучшения нужны в HUB?"
                          rows={3}
                          className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 resize-none overflow-hidden ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E]'}`}
                        />
                      </div>

                      <div className="space-y-4">
                        <label className={`text-lg font-bold block ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          Что бы вы улучшили в системе совместной торговли (торговых сессиях)?
                        </label>
                        <textarea
                          value={formData.tradingSessionsImprovements}
                          onChange={(e) => handleInputChange('tradingSessionsImprovements', e.target.value)}
                          placeholder="Как сделать торговые сессии полезнее?"
                          rows={3}
                          className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 resize-none overflow-hidden ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E]'}`}
                        />
                      </div>
                    </>
                  )}

                  {/* Block 3 Questions: Проблемы управления и команды */}
                  {currentSection === 'block3' && (
                    <>
                      <div className="space-y-4">
                        <label className={`text-lg font-bold block ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          Что в наших процессах бесит тебя больше всего?
                        </label>
                        <textarea
                          value={formData.mostAnnoying}
                          onChange={(e) => handleInputChange('mostAnnoying', e.target.value)}
                          placeholder="Опиши, что тебя раздражает..."
                          rows={3}
                          className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 resize-none overflow-hidden ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E]'}`}
                        />
                      </div>

                      <div className="space-y-4">
                        <label className={`text-lg font-bold block ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          Если была бы возможность убрать инструмент/стратегию/алгоритм/порядок и так далее — что это было бы и почему?
                        </label>
                        <textarea
                          value={formData.fireOneTool}
                          onChange={(e) => handleInputChange('fireOneTool', e.target.value)}
                          placeholder="Назови инструмент/процесс и объясни причину..."
                          rows={3}
                          className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 resize-none overflow-hidden ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E]'}`}
                        />
                      </div>

                      <div className="space-y-4">
                        <label className={`text-lg font-bold block ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          Где, по твоему мнению, мы теряем больше всего времени впустую?
                        </label>
                        <textarea
                          value={formData.timeWaste}
                          onChange={(e) => handleInputChange('timeWaste', e.target.value)}
                          placeholder="Опиши процессы, которые отнимают время без пользы..."
                          rows={3}
                          className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 resize-none overflow-hidden ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E]'}`}
                        />
                      </div>

                      <div className="space-y-4">
                        <label className={`text-lg font-bold block ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          О каких проблемах в команде все знают, но предпочитают молчать?
                        </label>
                        <textarea
                          value={formData.silentProblems}
                          onChange={(e) => handleInputChange('silentProblems', e.target.value)}
                          placeholder="Поделись тем, о чем говорят за закрытыми дверями..."
                          rows={3}
                          className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 resize-none overflow-hidden ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E]'}`}
                        />
                      </div>

                      <div className="space-y-4">
                        <label className={`text-lg font-bold block ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          Насколько дружелюбное комьюнити и команда?
                        </label>
                        <textarea
                          value={formData.communityFriendliness}
                          onChange={(e) => handleInputChange('communityFriendliness', e.target.value)}
                          placeholder="Оцени атмосферу в команде..."
                          rows={3}
                          className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 resize-none overflow-hidden ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E]'}`}
                        />
                      </div>

                      <div className="space-y-4">
                        <label className={`text-lg font-bold block ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          Чего не хватает в команде или комьюнити?
                        </label>
                        <textarea
                          value={formData.communityMissing}
                          onChange={(e) => handleInputChange('communityMissing', e.target.value)}
                          placeholder="Что бы сделало команду сплоченнее?"
                          rows={3}
                          className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 resize-none overflow-hidden ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E]'}`}
                        />
                      </div>

                      <div className="space-y-4">
                        <label className={`text-lg font-bold block ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          Если бы у тебя была возможность заменить одного или несколько руководителей, то кто это был бы и какое решение ты бы принял(а) прямо после замены?
                        </label>
                        <textarea
                          value={formData.replaceManager}
                          onChange={(e) => handleInputChange('replaceManager', e.target.value)}
                          placeholder="Кого бы заменил и что бы изменил?"
                          rows={3}
                          className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 resize-none overflow-hidden ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E]'}`}
                        />
                      </div>

                      <div className="space-y-4">
                        <label className={`text-lg font-bold block ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          Что, на твой взгляд, сейчас сильнее всего тормозит рост нашего KPI и заработка?
                        </label>
                        <textarea
                          value={formData.kpiGrowthBlocker}
                          onChange={(e) => handleInputChange('kpiGrowthBlocker', e.target.value)}
                          placeholder="Что мешает нам расти и зарабатывать больше?"
                          rows={3}
                          className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 resize-none overflow-hidden ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E]'}`}
                        />
                      </div>

                      <div className="space-y-4">
                        <label className={`text-lg font-bold block ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          Какую фичу (или изменение) ты считаешь "киллер-фичей", которую мы почему-то до сих пор не реализовали или реализовали не так, как хотелось бы?
                        </label>
                        <textarea
                          value={formData.killerFeature}
                          onChange={(e) => handleInputChange('killerFeature', e.target.value)}
                          placeholder="Опиши идеальную фичу или изменение..."
                          rows={3}
                          className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 resize-none overflow-hidden ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E]'}`}
                        />
                      </div>

                      <div className="space-y-4">
                        <label className={`text-lg font-bold block ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          Чего тебе не хватает для того, чтобы работать в 2 раза эффективнее и кайфовать от процесса?
                        </label>
                        <textarea
                          value={formData.efficiencyNeeds}
                          onChange={(e) => handleInputChange('efficiencyNeeds', e.target.value)}
                          placeholder="Что бы помогло тебе работать лучше?"
                          rows={3}
                          className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 resize-none overflow-hidden ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E]'}`}
                        />
                      </div>

                      <div className="space-y-4">
                        <label className={`text-lg font-bold block ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          Опиши идеальный формат взаимодействия с DM/фаундерами: чего тебе не хватает в их стиле управления?
                        </label>
                        <textarea
                          value={formData.idealManagement}
                          onChange={(e) => handleInputChange('idealManagement', e.target.value)}
                          placeholder="Как бы ты хотел(а), чтобы с тобой взаимодействовали?"
                          rows={3}
                          className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 resize-none overflow-hidden ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E]'}`}
                        />
                      </div>
                    </>
                  )}

                  {/* Block 4 Questions */}
                  {currentSection === 'block4' && (
                    <>
                      <div className="space-y-4">
                        <label className={`text-lg font-bold block ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          Есть ли что-то еще, что мы забыли спросить, но тебе очень важно это сказать?
                        </label>
                        <textarea
                          value={formData.finalDump}
                          onChange={(e) => handleInputChange('finalDump', e.target.value)}
                          placeholder="Напиши всё, что считаешь важным..."
                          rows={5}
                          className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-[#4C7F6E]/10 resize-none overflow-hidden ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#4C7F6E]' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E]'}`}
                        />
                      </div>
                    </>
                  )}

                  {/* Navigation */}
                  <div className="mt-8 flex justify-between items-center pt-6 border-t border-white/10">
                    <button
                      onClick={prevSection}
                      disabled={currentSection === 'block1'}
                      className={`px-6 py-3 rounded-xl font-bold transition-all ${currentSection === 'block1' ? 'opacity-50 cursor-not-allowed' : theme === 'dark' ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      Назад
                    </button>
                    <button
                      onClick={currentSection === 'block4' ? handleSubmit : nextSection}
                      className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-[#4C7F6E] hover:bg-[#4C7F6E]/90 text-white font-bold transition-all shadow-lg shadow-[#4C7F6E]/20 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {currentSection === 'block4' ? (
                        <>
                          <Send className="w-5 h-5" />
                          <span>Отправить</span>
                        </>
                      ) : (
                        <>
                          <span>Дальше</span>
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Success Section */}
          {currentSection === 'success' && (
            <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-6 py-12">
              <div className={`max-w-2xl mx-auto rounded-3xl p-8 sm:p-12 ${theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-gray-50 border border-gray-200'}`}>
                <div className="text-center mb-8">
                  <div className="w-20 h-20 rounded-full bg-[#4C7F6E]/20 flex items-center justify-center mx-auto mb-6">
                    <Check className="w-10 h-10 text-[#4C7F6E]" />
                  </div>
                  <h2 className={`text-3xl sm:text-4xl font-black tracking-tight mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Спасибо за честность!
                  </h2>
                  <p className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
                    <span className="bg-gradient-to-r from-[#4C7F6E] via-emerald-500 to-[#4C7F6E] bg-clip-text text-transparent">
                      Antarctic Alpha
                    </span>
                    <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}> 🐧</span>
                  </p>
                  <div className="mt-6 flex items-center justify-center gap-3">
                    <p className={`text-sm font-mono ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      ID фидбека: <span className="font-bold text-[#4C7F6E]">{feedbackId}</span>
                    </p>
                    <button
                      onClick={copyFeedbackId}
                      className={`p-2 rounded-lg transition-all ${theme === 'dark' ? 'bg-white/5 text-[#4C7F6E] hover:bg-white/10' : 'bg-gray-100 text-[#4C7F6E] hover:bg-gray-200'}`}
                      title="Скопировать ID"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  {copied && <p className="text-sm text-[#4C7F6E] font-medium mt-2">ID скопирован!</p>}
                </div>

                <div className={`rounded-xl p-6 mb-8 ${theme === 'dark' ? 'bg-[#4C7F6E]/10' : 'bg-[#4C7F6E]/5'}`}>
                  <p className={`font-medium leading-relaxed ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Твой фидбек получен и будет анонимно рассмотрен (до тех пор, пока ты не предоставишь ID). Мы ценим и благодарим тебя за честность — это помогает нам расти и становиться лучше.
                  </p>
                </div>

                <div className={`rounded-xl p-6 mb-8 ${theme === 'dark' ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-amber-50 border border-amber-200'}`}>
                  <div className="flex items-start gap-3">
                    <MessageSquare className={`w-5 h-5 mt-0.5 ${theme === 'dark' ? 'text-amber-400' : 'text-amber-600'}`} />
                    <div>
                      <p className={`font-bold mb-2 ${theme === 'dark' ? 'text-amber-200' : 'text-amber-800'}`}>
                        Сохраняй ID!
                      </p>
                      <p className={`text-sm ${theme === 'dark' ? 'text-amber-200' : 'text-amber-800'}`}>
                        Если нужно будет уточнить детали или добавить что-то, используй этот ID для связи с DM - так мы сможем найти твою анкету.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/about')}
                  className="w-full py-4 px-6 rounded-2xl bg-[#4C7F6E] hover:bg-[#4C7F6E]/90 text-white font-black text-lg transition-all shadow-lg shadow-[#4C7F6E]/20 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Вернуться к функциям
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
