import React, { useState, useEffect } from 'react'
import { HelpCircle, X, Plus, Send as SendIcon, FileUp, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'
import { createAppeal } from '@/services/appealsService'
import { DMContactTopic, DM_CONTACT_TOPICS, AppealCategory } from '@/types'
import { DMTopicSelector } from '@/components/Contact/DMTopicSelector'

interface LinkEntry {
  name: string
  url: string
}

const ContactDM: React.FC = () => {
  const { user } = useAuthStore()
  const { theme } = useThemeStore()
  const navigate = useNavigate()
  const isDark = theme === 'dark'

  const isGuest = !user

  const [topic, setTopic] = useState<DMContactTopic | ''>('')
  const [message, setMessage] = useState('')
  const [links, setLinks] = useState<LinkEntry[]>([{ name: '', url: '' }])
  const [screenshots, setScreenshots] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [successAppealId, setSuccessAppealId] = useState<string>('')
  const [timeRemaining, setTimeRemaining] = useState(30)
  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [showTips, setShowTips] = useState(true)

  // Таймер обратного отсчета
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (showSuccess && timeRemaining > 0) {
      timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000)
    } else if (timeRemaining === 0 && showSuccess) {
      setShowSuccess(false)
      setSuccessAppealId('')
      setTimeRemaining(30)
    }
    return () => clearTimeout(timer)
  }, [showSuccess, timeRemaining])

  // Поля для темы "Предложить идею"
  const [ideaSummary, setIdeaSummary] = useState('')
  const [ideaInInitiatives, setIdeaInInitiatives] = useState<boolean | null>(null)
  const [ideaInitiativesReason, setIdeaInitiativesReason] = useState('')

  // Поля для темы "Сообщить о нарушениях"
  const [violationWho, setViolationWho] = useState('')
  const [violationWhere, setViolationWhere] = useState('')

  // Поля для темы "Присоединиться к команде"
  const [applicationId, setApplicationId] = useState('')
  const [applicationEmail, setApplicationEmail] = useState('')

  const handleScreenshotUpload = async (files: File[]) => {
    const remainingSlots = 10 - screenshots.length
    const filesToUpload = files.slice(0, remainingSlots)
    const newScreenshots = filesToUpload.map((file) => URL.createObjectURL(file))
    setScreenshots(prev => [...prev, ...newScreenshots])
  }

  const handleLinkNameChange = (index: number, value: string) => {
    const newLinks = [...links]
    newLinks[index] = { ...newLinks[index], name: value }
    setLinks(newLinks)
  }

  const handleLinkUrlChange = (index: number, value: string) => {
    const newLinks = [...links]
    newLinks[index] = { ...newLinks[index], url: value }
    setLinks(newLinks)
  }

  const addLinkField = () => {
    if (links.length < 15) {
      setLinks([...links, { name: '', url: '' }])
    }
  }

  const removeLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index))
  }

  const removeScreenshot = (index: number) => {
    const newScreenshots = screenshots.filter((_, i) => i !== index)
    setScreenshots(newScreenshots)
  }

  // Маппинг тем в категории appeals
  const topicToCategory: Record<DMContactTopic, AppealCategory> = {
    bug_report: 'technical',
    idea: 'other',
    violation: 'other',
    join_team: 'other',
    referral: 'referral',
    earnings_pool_payments: 'billing',
    card_payment: 'billing',
    schedule_events_tasks: 'schedule',
    general: 'other',
  }

  const handleSubmit = async () => {
    if (!topic) {
      alert('Выберите тему сообщения')
      return
    }

    if (!message.trim()) {
      alert('Введите сообщение')
      return
    }

    if (isGuest && !guestName.trim()) {
      alert('Введите ваше имя')
      return
    }

    if (isGuest && !guestEmail.trim()) {
      alert('Введите ваш email для получения ответа')
      return
    }

    if (topic === 'idea') {
      if (!ideaSummary.trim()) {
        alert('Введите тезис идеи')
        return
      }
      if (ideaInInitiatives === null) {
        alert('Укажите, предлагали ли вы идею в разделе инициатив')
        return
      }
      if (ideaInInitiatives && !ideaInitiativesReason.trim()) {
        alert('Укажите причину отказа или почему решили оставить идею в таком формате')
        return
      }
    }

    if (topic === 'violation') {
      if (!violationWho.trim()) {
        alert('Укажите, кто нарушил')
        return
      }
      if (!violationWhere.trim()) {
        alert('Укажите, где нарушено')
        return
      }
    }

    if (topic === 'join_team') {
      if (!applicationId.trim()) {
        alert('Введите ID анкеты')
        return
      }
      if (!applicationEmail.trim()) {
        alert('Введите email, указанный при подаче заявки')
        return
      }
    }

    const filteredLinks = links
      .filter(link => link.url.trim())
      .map(link => ({
        name: link.name.trim() || link.url,
        url: link.url.trim()
      }))
    
    if (filteredLinks.length > 15) {
      alert('Максимум 15 ссылок')
      return
    }

    if (screenshots.length > 10) {
      alert('Максимум 10 скриншотов')
      return
    }

    setIsSubmitting(true)

    try {
      // Формируем subject из темы и дополнительных полей
      let subject = DM_CONTACT_TOPICS[topic as DMContactTopic]
      
      if (topic === 'idea') {
        subject = `Идея: ${ideaSummary.trim().substring(0, 50)}${ideaSummary.length > 50 ? '...' : ''}`
      } else if (topic === 'violation') {
        subject = `Нарушение: ${violationWhere}`
      } else if (topic === 'join_team') {
        subject = `Присоединение к команде (ID: ${applicationId})`
      }

      const appealData: any = {
        userId: user?.id,
        form: {
          topic: topic as DMContactTopic,
          category: topicToCategory[topic as DMContactTopic],
          name: user?.name || guestName.trim() || 'Аноним',
          email: user?.email || guestEmail.trim(),
          telegram: user?.telegram || '',
          vk: user?.vk || '',
          subject,
          message: message.trim(),
          // Добавляем поля только если они есть
          ...(filteredLinks.length > 0 && { links: filteredLinks }),
          ...(screenshots.length > 0 && { screenshots }),
          // Доп поля
          ...(topic === 'idea' && {
            ideaSummary: ideaSummary.trim(),
            ideaInInitiatives: ideaInInitiatives || false,
            ...(ideaInInitiatives && { ideaInitiativesReason: ideaInitiativesReason.trim() })
          }),
          ...(topic === 'violation' && {
            violationWho: violationWho.trim(),
            violationWhere: violationWhere.trim()
          }),
          ...(topic === 'join_team' && {
            applicationId: applicationId.trim(),
            applicationEmail: applicationEmail.trim()
          })
        },
      }

      const { appealId } = await createAppeal(appealData)

      setShowSuccess(true)
      setSuccessAppealId(appealId)
      setTimeRemaining(30)
    } catch (error) {
      console.error('Error submitting appeal:', error)
      alert('Ошибка при отправке сообщения')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setTopic('')
    setMessage('')
    setLinks([{ name: '', url: '' }])
    setScreenshots([])
    setGuestName('')
    setGuestEmail('')
    setIdeaSummary('')
    setIdeaInInitiatives(null)
    setIdeaInitiativesReason('')
    setViolationWho('')
    setViolationWhere('')
    setApplicationId('')
    setApplicationEmail('')
    setShowSuccess(false)
    setSuccessAppealId('')
    setTimeRemaining(30)
  }

  const handleConfirmClose = () => {
    if (window.confirm('Вы уверены? ID обращения уже сохранён в системе.')) {
      resetForm()
    }
  }

  const bugTip = topic === 'bug_report'
    ? 'Здесь можно оставить сообщение о любом баге, связанном с экосистемой Antarctic Alpha — от любых разделов панели управления до публичного сайта и ресурсов (ботов, каналов, сообществ).'
    : null

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Back button for guests */}
      {isGuest && (
        <div className="mb-6">
          <button
            onClick={() => navigate('/login')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all ${
              isDark
                ? 'bg-white/5 text-white hover:bg-white/10'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            ← Назад
          </button>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-3 rounded-2xl ${isDark ? 'bg-[#4C7F6E]/20' : 'bg-[#4C7F6E]/10'}`}>
            <HelpCircle className="w-6 h-6 text-[#4C7F6E]" />
          </div>
          <div>
            <h1 className={`text-3xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Contact DM
            </h1>
            <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Связь с ответственным за сообщество
            </p>
          </div>
        </div>
      </div>

      {/* Maintenance Notice */}
      <div className={`mb-6 rounded-2xl border overflow-hidden ${
        isDark 
          ? 'bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-500/20' 
          : 'bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-200'
      }`}>
        <div className="p-5">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl shrink-0 ${
              isDark ? 'bg-amber-500/20' : 'bg-amber-100'
            }`}>
              <AlertCircle className={`w-6 h-6 ${
                isDark ? 'text-amber-400' : 'text-amber-600'
              }`} />
            </div>
            <div className="flex-1">
              <h3 className={`font-bold text-base mb-2 ${
                isDark ? 'text-amber-400' : 'text-amber-800'
              }`}>
                Временно недоступно
              </h3>
              <p className={`text-sm leading-relaxed ${
                isDark ? 'text-amber-200/80' : 'text-amber-700'
              }`}>
                Функционал отправки заявок в данный момент находится на техническом обслуживании для улучшения качества обслуживания. Мы работаем над этим и вернём возможность подачи обращений в ближайшее время. Пожалуйста, попробуйте подать заявку позже.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tips Block */}
      {showTips && (
        <div className={`mb-6 rounded-2xl border p-6 ${
          isDark ? 'bg-[#1a1f2e] border-white/5' : 'bg-amber-50 border-amber-200'
        }`}>
          <button
            onClick={() => setShowTips(false)}
            className={`w-full flex items-center justify-between mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            <span className="font-bold text-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              Инструкция по заполнению
            </span>
            <ChevronUp className="w-5 h-5" />
          </button>
          
          <div className={`space-y-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            <div>
              <h4 className="font-bold mb-2">1. Выберите правильную тему обращения:</h4>
              <ul className="space-y-2 ml-4">
                <li>• Если Ваш вопрос связан с <strong>начислением выплаты</strong> (любой в экосистеме Antarctic Alpha), <strong>компенсацией из Пула</strong> или <strong>начислением в пул</strong> — выберите тему <strong>«Заработок, пул и выплаты»</strong>.</li>
                <li>• Если Ваш вопрос связан с <strong>начислением бонусов и преимуществ за рефералов</strong>, их <strong>привязкой</strong>, <strong>статусами рефералов</strong> или <strong>Вашим статусом</strong> — выберите тему <strong>«Реферальная программа»</strong>.</li>
                <li>• Если Вы хотите <strong>пожаловаться на действия участников и команды</strong> — выберите раздел <strong>«Сообщить о нарушении»</strong>.</li>
                <li>• Если вопрос связан со <strong>слотом</strong>, <strong>выходным / отпуском / больничным</strong> (для членов команды), <strong>событиями сообщества и команды</strong>, <strong>задачами</strong> (для членов команды) — выберите тему <strong>«Расписание, события и задачи»</strong>.</li>
                <li>• Если вопрос связан с <strong>картой для оплаты</strong>, <strong>оплатой по QR-коду</strong>, <strong>возвратами</strong> — выберите тему <strong>«Карта и оплата»</strong>.</li>
                <li>• По всем остальным вопросам, <strong>за исключением</strong> сообщений о баге, идеях и нарушениях, — выбирайте тему <strong>«Общие вопросы»</strong>.</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-2">2. Опишите проблему максимально подробно:</h4>
              <ul className="space-y-2 ml-4">
                <li>• Старайтесь как можно подробнее изложить <strong>факты</strong> Вашего обращения.</li>
                <li>• При наличии <strong>видео нарушения / бага</strong> — загрузите его на файлообменник и предоставьте ссылку в блок <strong>«Ссылки»</strong>.</li>
                <li>• Давайте <strong>название каждой ссылке</strong> и связывайте названия с текстом. Пример: «Ошибка такая-то, см. ссылку с названием ...»</li>
                <li>• При наличии <strong>скриншотов</strong> — используйте блок <strong>«Скриншот»</strong>.</li>
                <li>• Если скриншотов, ссылок или иных материалов <strong>слишком много</strong> — загрузите всё в <strong>архив</strong> (убедитесь, что архив открывается на macOS) и предоставьте ссылку на архив.</li>
                <li>• Разбивайте мысли <strong>по абзацам</strong>.</li>
                <li>• Соблюдайте <strong>правила орфографии и грамматики</strong>.</li>
              </ul>
            </div>
            
            <div className={`p-4 rounded-xl ${isDark ? 'bg-red-500/10' : 'bg-red-50'}`}>
              <h4 className="font-bold mb-2 text-red-500">⚠️ ВАЖНО:</h4>
              <ul className="space-y-1 text-sm">
                <li>• DM <strong>вправе оставить сообщение без ответа</strong> без объяснения причин.</li>
                <li>• <strong>Не дублируйте</strong> обращение раньше чем через <strong>7 дней</strong> с момента отправки.</li>
                <li>• Если вопрос находится в компетенции <strong>иных лиц команды</strong> Antarctic Alpha, ответственный за сообщество <strong>переадресует</strong> его участнику команды, ответственному за такой вопрос.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {!showTips && (
        <button
          onClick={() => setShowTips(true)}
          className={`mb-6 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all ${
            isDark ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <ChevronDown className="w-4 h-4" />
          Показать инструкцию
        </button>
      )}

      {/* Form */}
      <div className={`rounded-3xl border overflow-hidden ${isDark ? 'bg-[#0b1015] border-white/5' : 'bg-white border-gray-100'} shadow-xl`}>
        <div className="p-6 sm:p-8 space-y-6">
          {/* Guest Name and Email Fields */}
          {isGuest && (
            <>
              <div>
                <label className={`block text-base font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Ваше имя <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Введите ваше имя..."
                  className={`w-full p-4 rounded-xl border text-base transition-all ${
                    isDark
                      ? 'bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-[#4C7F6E] focus:ring-2 focus:ring-[#4C7F6E]/20'
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E] focus:ring-2 focus:ring-[#4C7F6E]/20'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-base font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Email для ответа <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="example@mail.ru"
                  className={`w-full p-4 rounded-xl border text-base transition-all ${
                    isDark
                      ? 'bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-[#4C7F6E] focus:ring-2 focus:ring-[#4C7F6E]/20'
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E] focus:ring-2 focus:ring-[#4C7F6E]/20'
                  }`}
                />
                <p className={`mt-2 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  Укажите email для получения ответа и продолжения переписки
                </p>
              </div>
            </>
          )}

          {/* Topic Selector - Enhanced */}
          <div>
            <label className={`block text-base font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Тема сообщения <span className="text-red-500">*</span>
            </label>
            <DMTopicSelector
              selectedTopic={topic as DMContactTopic | ''}
              onSelect={(t) => setTopic(t)}
              error={!topic && isSubmitting}
            />
            {topic && (
              <p className={`mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Выбрано: <span className="font-bold text-[#4C7F6E]">{DM_CONTACT_TOPICS[topic as DMContactTopic]}</span>
              </p>
            )}
          </div>

          {/* Bug Report Tip */}
          {bugTip && (
            <div className={`p-4 rounded-xl ${isDark ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
              <p className={`text-sm ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                {bugTip}
              </p>
            </div>
          )}

          {/* Idea Fields */}
          {topic === 'idea' && (
            <>
              <div>
                <label className={`block text-base font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Тезис идеи <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={ideaSummary}
                  onChange={(e) => setIdeaSummary(e.target.value)}
                  placeholder="Кратко опишите суть вашей идеи..."
                  rows={3}
                  className={`w-full p-4 rounded-xl border text-base resize-none transition-all ${
                    isDark
                      ? 'bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-[#4C7F6E] focus:ring-2 focus:ring-[#4C7F6E]/20'
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E] focus:ring-2 focus:ring-[#4C7F6E]/20'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-base font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Предлагали ли вы идею в разделе инициатив? <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-4">
                  <label className={`flex items-center gap-2 cursor-pointer ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    <input
                      type="radio"
                      checked={ideaInInitiatives === true}
                      onChange={() => setIdeaInInitiatives(true)}
                      className="w-4 h-4"
                    />
                    Да
                  </label>
                  <label className={`flex items-center gap-2 cursor-pointer ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    <input
                      type="radio"
                      checked={ideaInInitiatives === false}
                      onChange={() => setIdeaInInitiatives(false)}
                      className="w-4 h-4"
                    />
                    Нет
                  </label>
                </div>
              </div>

              {ideaInInitiatives !== null && (
                <div>
                  <label className={`block text-base font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {ideaInInitiatives 
                      ? 'Почему отказали?' 
                      : 'Почему решили оставить идею в таком формате?'} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={ideaInitiativesReason}
                    onChange={(e) => setIdeaInitiativesReason(e.target.value)}
                    placeholder="Опишите причину..."
                    rows={3}
                    className={`w-full p-4 rounded-xl border text-base resize-none transition-all ${
                      isDark
                        ? 'bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-[#4C7F6E] focus:ring-2 focus:ring-[#4C7F6E]/20'
                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E] focus:ring-2 focus:ring-[#4C7F6E]/20'
                    }`}
                  />
                </div>
              )}
            </>
          )}

          {/* Violation Fields */}
          {topic === 'violation' && (
            <>
              <div>
                <label className={`block text-base font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Кто нарушил? <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={violationWho}
                  onChange={(e) => setViolationWho(e.target.value)}
                  placeholder="Участник сообщества / Член команды / Иное лицо (указать)"
                  className={`w-full p-4 rounded-xl border text-base transition-all ${
                    isDark
                      ? 'bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-[#4C7F6E] focus:ring-2 focus:ring-[#4C7F6E]/20'
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E] focus:ring-2 focus:ring-[#4C7F6E]/20'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-base font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Где нарушено? <span className="text-red-500">*</span>
                </label>
                <select
                  value={violationWhere}
                  onChange={(e) => setViolationWhere(e.target.value)}
                  className={`w-full p-4 rounded-xl border text-base transition-all ${
                    isDark
                      ? 'bg-white/5 border-white/10 text-white focus:border-[#4C7F6E] focus:ring-2 focus:ring-[#4C7F6E]/20'
                      : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-[#4C7F6E] focus:ring-2 focus:ring-[#4C7F6E]/20'
                  }`}
                >
                  <option value="">Выберите платформу...</option>
                  <option value="VK">VK</option>
                  <option value="YouTube">YouTube</option>
                  <option value="Telegram">Telegram</option>
                  <option value="Discord">Discord</option>
                  <option value="Dzen">Дзен</option>
                  <option value="Platform">Учебная платформа</option>
                  <option value="Other">Иное (укажите в сообщении)</option>
                </select>
              </div>

              <div className={`p-4 rounded-xl ${isDark ? 'bg-amber-500/10' : 'bg-amber-50'}`}>
                <p className={`text-sm ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>
                  Здесь можно сообщить о любых нарушениях — например, если считаете, что блокировка незаслуженна, не возвращают денежные средства за подписки на ресурсы, другой пользователь нарушил правила/оферту
                </p>
              </div>
            </>
          )}

          {/* Join Team Fields */}
          {topic === 'join_team' && (
            <>
              <div>
                <label className={`block text-base font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  ID анкеты <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={applicationId}
                  onChange={(e) => setApplicationId(e.target.value)}
                  placeholder="Введите ID вашей анкеты..."
                  className={`w-full p-4 rounded-xl border text-base transition-all ${
                    isDark
                      ? 'bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-[#4C7F6E] focus:ring-2 focus:ring-[#4C7F6E]/20'
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E] focus:ring-2 focus:ring-[#4C7F6E]/20'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-base font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Email, указанный при подаче заявки <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={applicationEmail}
                  onChange={(e) => setApplicationEmail(e.target.value)}
                  placeholder="example@mail.ru"
                  className={`w-full p-4 rounded-xl border text-base transition-all ${
                    isDark
                      ? 'bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-[#4C7F6E] focus:ring-2 focus:ring-[#4C7F6E]/20'
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E] focus:ring-2 focus:ring-[#4C7F6E]/20'
                  }`}
                />
              </div>
            </>
          )}

          {/* Message Textarea */}
          <div>
            <label className={`block text-base font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Сообщение <span className="text-red-500">*</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Опишите вашу проблему или вопрос подробно..."
              rows={8}
              className={`w-full p-4 rounded-xl border text-base resize-none transition-all ${
                isDark
                  ? 'bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-[#4C7F6E] focus:ring-2 focus:ring-[#4C7F6E]/20'
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E] focus:ring-2 focus:ring-[#4C7F6E]/20'
              }`}
              style={{ whiteSpace: 'pre-wrap' }}
            />
            <p className={`mt-2 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              Поддерживается форматирование: переносы строк, абзацы
            </p>
          </div>

          {/* Links */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className={`block text-base font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Ссылки
              </label>
              <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                {links.filter(l => l.url.trim()).length} / 15
              </span>
            </div>
            <div className="space-y-3">
              {links.map((link, index) => (
                <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) => handleLinkUrlChange(index, e.target.value)}
                    placeholder="https://..."
                    className={`flex-1 p-3 rounded-xl border text-sm transition-all ${
                      isDark
                        ? 'bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-[#4C7F6E]'
                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E]'
                    }`}
                  />
                  <input
                    type="text"
                    value={link.name}
                    onChange={(e) => handleLinkNameChange(index, e.target.value)}
                    placeholder="Название ссылки"
                    className={`sm:w-1/3 p-3 rounded-xl border text-sm transition-all ${
                      isDark
                        ? 'bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-[#4C7F6E]'
                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4C7F6E]'
                    }`}
                  />
                  {links.length > 1 && (
                    <button
                      onClick={() => removeLink(index)}
                      className={`p-3 rounded-xl transition-colors ${
                        isDark
                          ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                          : 'bg-red-50 text-red-500 hover:bg-red-100'
                      }`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              {links.length < 15 && (
                <button
                  onClick={addLinkField}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isDark
                      ? 'bg-white/5 text-gray-300 hover:bg-white/10'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  Добавить ссылку
                </button>
              )}
            </div>
          </div>

          {/* Screenshots */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className={`block text-base font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Скриншоты
              </label>
              <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                {screenshots.length} / 10
              </span>
            </div>
            
            {screenshots.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                {screenshots.map((screenshot, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={screenshot}
                      alt={`Screenshot ${index + 1}`}
                      className="w-full h-32 object-cover rounded-xl border border-white/10"
                    />
                    <button
                      onClick={() => removeScreenshot(index)}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <label className={`flex items-center justify-center gap-3 p-6 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
              isDark
                ? 'border-white/10 hover:border-[#4C7F6E]/50 hover:bg-white/5'
                : 'border-gray-300 hover:border-[#4C7F6E] hover:bg-gray-50'
            } ${screenshots.length >= 10 ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <FileUp className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              <div className="text-center">
                <p className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Загрузить скриншоты
                </p>
                <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  PNG, JPG до 10MB
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  if (e.target.files) {
                    handleScreenshotUpload(Array.from(e.target.files))
                  }
                }}
                disabled={screenshots.length >= 10}
                className="hidden"
              />
            </label>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !topic || !message.trim()}
            className={`w-full py-4 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2 ${
              isSubmitting || !topic || !message.trim()
                ? 'bg-gray-500/50 cursor-not-allowed text-gray-400'
                : 'bg-gradient-to-r from-[#4C7F6E] to-[#4E6E49] hover:from-[#4C7F6E]/90 hover:to-[#4E6E49]/90 text-white shadow-lg shadow-[#4C7F6E]/25'
            }`}
          >
            <SendIcon className="w-5 h-5" />
            {isSubmitting ? 'Отправка...' : 'Отправить сообщение DM'}
          </button>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={handleConfirmClose}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div 
            className={`relative p-8 rounded-3xl text-center animate-in zoom-in-95 duration-200 max-w-md ${
              isDark ? 'bg-[#0b1015] border border-white/10' : 'bg-white'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`w-20 h-20 mx-auto mb-4 rounded-3xl flex items-center justify-center ${
              isDark ? 'bg-emerald-500/20' : 'bg-emerald-100'
            }`}>
              <SendIcon className="w-10 h-10 text-emerald-500" />
            </div>
            <h3 className={`text-xl font-black mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Обращение создано!
            </h3>
            <div className={`p-4 rounded-xl mb-4 ${isDark ? 'bg-[#4C7F6E]/10' : 'bg-[#4C7F6E]/5'}`}>
              <p className={`text-sm font-bold mb-1 ${isDark ? 'text-[#4C7F6E]' : 'text-[#4C7F6E]'}`}>
                ID обращения:
              </p>
              <p className={`text-2xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {successAppealId}
              </p>
            </div>
            <p className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              ID обращения сохранён в системе
            </p>
            <p className={`text-xs mb-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              Автоматическое закрытие через {timeRemaining} сек.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleConfirmClose}
                className={`flex-1 px-4 py-3 rounded-xl font-bold text-sm transition-colors ${
                  isDark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                Закрыть
              </button>
              <button
                onClick={() => {
                  resetForm()
                  navigate('/appeals')
                }}
                className="flex-1 px-4 py-3 rounded-xl font-bold text-sm text-white transition-colors"
                style={{ backgroundColor: '#4C7F6E' }}
              >
                К списку
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ContactDM
