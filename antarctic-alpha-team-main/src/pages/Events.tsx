import { useState, useEffect, useMemo } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useAdminStore } from '@/store/adminStore'
import { useThemeStore } from '@/store/themeStore'
import { EventCard } from '@/components/Events/EventCard'
import { EventModal } from '@/components/Events/EventModal'
import { EventDetailModal } from '@/components/Events/EventDetailModal'
import { getEvents, deleteEvent, subscribeToEvents } from '@/services/eventService'
import type { Event, EventCategory } from '@/types'
import { EVENT_CATEGORY_META } from '@/types'

import {
  Calendar,
  Plus,
  Filter,
  TrendingUp,
  Gift,
  Image,
  Shield,
  Coins,
  Rocket,
  BarChart3,
  Users,
  ChevronDown,
  ChevronUp,
  HelpCircle,
} from 'lucide-react'

import { LucideIcon } from 'lucide-react'

const categoryIcons: Record<string, LucideIcon> = {
  memecoins: Rocket,
  polymarket: BarChart3,
  nft: Image,
  staking: Shield,
  spot: Coins,
  futures: TrendingUp,
  airdrop: Gift,
}

// Получение текущего времени в Москве (UTC+3)
const getMoscowDateTime = (): { date: string; time: string } => {
  // Создаём дату в часовом поясе UTC, затем добавляем 3 часа для Москвы
  const now = new Date()
  const moscowTime = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours() + 3, now.getUTCMinutes(), now.getUTCSeconds()))

  // Форматируем вручную, чтобы избежать проблем с часовыми поясами
  const dateStr = `${moscowTime.getFullYear()}-${String(moscowTime.getMonth() + 1).padStart(2, '0')}-${String(moscowTime.getDate()).padStart(2, '0')}`
  const timeStr = `${String(moscowTime.getHours()).padStart(2, '0')}:${String(moscowTime.getMinutes()).padStart(2, '0')}`

  return { date: dateStr, time: timeStr }
}

// Получение текущего времени в миллисекундах по Москве (UTC+3)
const getNowMskMs = (): number => {
  return Date.now() + 3 * 60 * 60 * 1000
}

export const EventsPage = () => {
  const { user } = useAuthStore()
  const { isAdmin } = useAdminStore()
  const { theme } = useThemeStore()

  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const subTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
  const brandColor = '#4C7F6E'

  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [viewEvent, setViewEvent] = useState<Event | null>(null)
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null)

  // Filters
  const [categoryFilter, setCategoryFilter] = useState<EventCategory | 'all'>('all')
  const [showFilters, setShowFilters] = useState(false)
  const [showMyOnly, setShowMyOnly] = useState(false)

  const fetchEvents = async () => {
    try {
      const data = await getEvents()
      setEvents(data)
    } catch (error) {
      console.error('Failed to fetch events:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const unsubscribe = subscribeToEvents((data) => {
      setEvents(data)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Обработка и фильтрация событий
  const filteredEvents = useMemo(() => {
    const { date: currentDate } = getMoscowDateTime()
    const nowMskMs = getNowMskMs()

    // 1. Сначала фильтруем по базовым критериям (категория, "только мои")
    let result = [...events]

    if (categoryFilter !== 'all') {
      result = result.filter((e) => e.category === categoryFilter)
    }

    if (showMyOnly && user) {
      result = result.filter((e) => e.requiredParticipants.includes(user.id))
    }

    // 2. Для обычных пользователей скрываем только "скрытые"
    if (!isAdmin) {
      result = result.filter(event => {
        if (event.isHidden) return false
        return true
      })
    }

    // 3. Сортировка: сначала Актуальные (те что идут сейчас или ForceActual), потом по времени
    const getStatusWeight = (event: Event) => {
      const eventStartMs = new Date(`${currentDate}T${event.time}`).getTime()
      const eventEndMs = event.endTime
        ? new Date(`${currentDate}T${event.endTime}`).getTime()
        : eventStartMs + 2 * 60 * 60 * 1000

      const isToday = event.dates.includes(currentDate)
      const isActive = isToday && eventStartMs <= nowMskMs && eventEndMs > nowMskMs

      if (event.isActualForce || isActive) return 0

      const nextDate = event.dates.filter(d => d >= currentDate).sort()[0]
      if (nextDate === currentDate) return 1
      if (nextDate) return 2
      return 3 // Прошедшие
    }

    result.sort((a, b) => {
      // Сначала по весу статуса
      const weightA = getStatusWeight(a)
      const weightB = getStatusWeight(b)
      if (weightA !== weightB) return weightA - weightB

      // Затем по ближайшей дате и времени
      const nextDateA = a.dates.filter((d: string) => d >= currentDate).sort()[0] || '9999-99-99'
      const nextDateB = b.dates.filter((d: string) => d >= currentDate).sort()[0] || '9999-99-99'

      if (nextDateA !== nextDateB) return nextDateA.localeCompare(nextDateB)
      return a.time.localeCompare(b.time)
    })

    return result
  }, [events, categoryFilter, showMyOnly, user, isAdmin])


  const handleDelete = async (eventId: string) => {
    if (!window.confirm('Удалить это событие?')) return
    try {
      await deleteEvent(eventId)
      setEvents((prev: Event[]) => prev.filter((e: Event) => e.id !== eventId))
    } catch (error: any) {
      console.error('Failed to delete event:', error)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedEvent(null)
    fetchEvents()
  }

  // FAQ data
  const faqItems = [
    {
      question: 'Что означают статусы событий?',
      answer: '• "Идёт" — событие проходит в данный момент\n• "Скоро" — событие начнётся в течение 30 минут\n• "Топ" — событие закреплено в актуальных',
      icon: TrendingUp
    },
    {
      question: 'Как отметить участие в событии?',
      answer: 'Можете нажать "Я буду" или "Не буду" для подтверждения или отклонения участия.',
      icon: Users
    },
    {
      question: 'Чем отличаются обязательные и рекомендованные участники?',
      answer: 'Обязательные участники должны присутствовать на событии. Рекомендованные — это те, кому участие рекомендуется, но не обязательно.',
      icon: Gift
    }
  ]

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index)
  }



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 pb-6 border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#4C7F6E]/10 rounded-2xl border border-[#4C7F6E]/20">
            <Calendar className="w-8 h-8 text-[#4C7F6E]" />
          </div>
          <div>
            <h1 className={`text-2xl md:text-3xl font-black tracking-tight ${headingColor}`}>
              Events
            </h1>
            <p className={`text-sm font-medium ${subTextColor}`}>
              Анонсы событий и важные даты
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-3 rounded-xl border transition-all duration-300 ${
              showFilters 
                ? 'bg-[#4C7F6E]/10 border-[#4C7F6E]/30' 
                : theme === 'dark' ? 'border-white/10 hover:bg-white/5' : 'border-gray-200 hover:bg-gray-100'
            }`}
          >
            <Filter size={20} className={showFilters ? 'text-[#4C7F6E]' : subTextColor} />
          </button>

          {isAdmin && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#4C7F6E] hover:bg-[#3d6b5a] text-white font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-[#4C7F6E]/20"
            >
              <Plus className="w-4 h-4" />
              Создать
            </button>
          )}
        </div>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className={`p-6 rounded-2xl border transition-all duration-300 ${
          theme === 'dark' ? 'border-white/10 bg-[#0f1216]' : 'border-gray-200 bg-white'
        }`}>
          {/* Category filter */}
          <div className="space-y-3">
            <span className={`text-xs font-black uppercase tracking-widest ${subTextColor}`}>По категории</span>
            <div className="flex flex-wrap gap-2.5">
              <button
                onClick={() => setCategoryFilter('all')}
                className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                  categoryFilter === 'all'
                    ? 'bg-[#4C7F6E] text-white shadow-lg shadow-[#4C7F6E]/30'
                    : theme === 'dark' ? 'bg-white/5 text-gray-400 hover:bg-white/10' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Все
              </button>
              {(Object.keys(EVENT_CATEGORY_META) as EventCategory[]).map((cat) => {
                const IconComponent = categoryIcons[cat]
                const meta = EVENT_CATEGORY_META[cat]
                return (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                      categoryFilter === cat
                        ? 'bg-[#4C7F6E] text-white shadow-lg shadow-[#4C7F6E]/30'
                        : theme === 'dark' ? 'bg-white/5 text-gray-400 hover:bg-white/10' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <IconComponent size={16} />
                    {meta.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* My events only */}
          <div className="mt-4">
            <label className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all hover:bg-white/5">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={showMyOnly}
                  onChange={(e) => setShowMyOnly(e.target.checked)}
                  className="sr-only peer"
                />
                <div 
                  className="w-11 h-6 rounded-full transition-all duration-300 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all cursor-pointer"
                  style={{ 
                    backgroundColor: showMyOnly ? '#4C7F6E' : '#6b7280',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
                  }}
                />
              </div>
              <span className={`text-sm font-semibold ${headingColor}`}>Только мои</span>
            </label>
          </div>
        </div>
      )}

      {/* Events Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#4C7F6E]/30 border-t-[#4C7F6E] rounded-full animate-spin" />
        </div>
      ) : filteredEvents.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              isAdmin={isAdmin}
              onEdit={(e: Event) => {
                setSelectedEvent(e)
                setIsModalOpen(true)
              }}
              onDelete={handleDelete}
              onClick={(e: Event) => setViewEvent(e)}
            />
          ))}
        </div>
      ) : (
        <div className={`p-8 rounded-2xl border text-center space-y-4 ${
          theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'
        }`}>
          <Calendar className={`w-16 h-16 mx-auto mb-4 ${subTextColor}`} />
          <h3 className={`text-xl font-bold ${headingColor}`}>Нет событий</h3>
          <p className={`text-sm ${subTextColor}`}>
            На ближайшее время событий не запланировано или они скрыты
          </p>
        </div>
      )}

        {/* Modal */}
        {isModalOpen && (
          <EventModal
            event={selectedEvent}
            onClose={handleCloseModal}
          />
        )}

        {/* Event Detail Modal */}
        {viewEvent && (
          <EventDetailModal
            event={viewEvent}
            onClose={() => setViewEvent(null)}
          />
        )}

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
              <h2 className={`text-xl font-bold ${headingColor}`}>FAQ: События</h2>
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
                    <h3 className={`font-semibold ${headingColor}`}>
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
                
                {isExpanded && item.answer && (
                  <div className="px-5 pb-5 pl-16 pt-0">
                    <div className="pt-4 border-t border-white/5">
                      <p className={`text-sm leading-relaxed whitespace-pre-line ${subTextColor}`}>
                        {item.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
