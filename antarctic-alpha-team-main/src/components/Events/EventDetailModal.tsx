import { useEffect, useState } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { useUsers } from '@/hooks/useUsers'
import { useScrollLock } from '@/hooks/useScrollLock'
import { updateEvent } from '@/services/eventService'
import type { Event } from '@/types'
import { EVENT_CATEGORY_META } from '@/types'
import {
  X,
  Calendar,
  Clock,
  Users,
  FileText,
  ExternalLink,
  Rocket,
  BarChart3,
  Image as ImageIcon,
  Shield,
  Coins,
  TrendingUp,
  Gift,
  CheckCircle2,
  XCircle,
  Timer,
} from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { LucideIcon } from 'lucide-react'

interface EventDetailModalProps {
  event: Event
  onClose: () => void
}

const categoryIcons: Record<string, LucideIcon> = {
  memecoins: Rocket,
  polymarket: BarChart3,
  nft: ImageIcon,
  staking: Shield,
  spot: Coins,
  futures: TrendingUp,
  airdrop: Gift,
}

const getMoscowDateTime = (): { date: string; time: string } => {
  const now = new Date()
  const moscowTime = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours() + 3, now.getUTCMinutes(), now.getUTCSeconds())
  return {
    date: `${moscowTime.getFullYear()}-${String(moscowTime.getMonth() + 1).padStart(2, '0')}-${String(moscowTime.getDate()).padStart(2, '0')}`,
    time: `${String(moscowTime.getHours()).padStart(2, '0')}:${String(moscowTime.getMinutes()).padStart(2, '0')}`
  }
}

const getMoscowTimeMs = (): number => {
  const now = new Date()
  return now.getTime() + now.getTimezoneOffset() * 60 * 1000 + 3 * 60 * 60 * 1000
}

const isSoonStarting = (eventDateTimeMs: number): boolean => {
  const diff = eventDateTimeMs - getMoscowTimeMs()
  return diff > 0 && diff <= 30 * 60 * 1000
}

export const EventDetailModal = ({ event: initialEvent, onClose }: EventDetailModalProps) => {
  const { theme } = useThemeStore()
  const { user } = useAuthStore()
  const { users: allMembers } = useUsers()
  const { lockScroll, unlockScroll } = useScrollLock()

  // Локальное состояние для мгновенного обновления
  const [event, setEvent] = useState(initialEvent)

  useEffect(() => {
    setEvent(initialEvent)
  }, [initialEvent])

  useEffect(() => {
    lockScroll()
    return unlockScroll
  }, [lockScroll, unlockScroll])

  const meta = EVENT_CATEGORY_META[event.category]
  const IconComponent = categoryIcons[event.category] || Rocket

  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const subtleColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
  const bgColor = theme === 'dark' ? 'bg-[#0d1117]' : 'bg-white'
  const cardBg = theme === 'dark' ? 'bg-white/[0.03]' : 'bg-gray-50'

  const { date: currentDate } = getMoscowDateTime()

  const eventStartMs = new Date(`${currentDate}T${event.time}`).getTime()
  const eventEndMs = event.endTime ? new Date(`${currentDate}T${event.endTime}`).getTime() : eventStartMs + 2 * 60 * 60 * 1000

  const isActive = event.dates.includes(currentDate) && eventStartMs <= getMoscowTimeMs() && eventEndMs > getMoscowTimeMs()
  const upcomingDates = event.dates.filter(date => date >= currentDate).sort()
  const nextDate = upcomingDates[0]

  const getTimeUntilEvent = (): string | null => {
    if (!nextDate) return null
    const diff = new Date(`${nextDate}T${event.time}`).getTime() - getMoscowTimeMs()
    if (diff < 0) return null
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const parts = []
    if (days > 0) parts.push(`${days}д`)
    if (hours > 0) parts.push(`${hours}ч`)
    if (minutes >= 0) parts.push(`${minutes}мин`)
    return parts.join(' ')
  }

  const timeUntil = getTimeUntilEvent()
  const startsSoon = nextDate && isSoonStarting(new Date(`${nextDate}T${event.time}`).getTime())

  const requiredParticipants = event.requiredParticipants.map(id => allMembers.find((m: any) => m.id === id)?.name).filter(Boolean)
  const recommendedParticipants = (event.recommendedParticipants || []).map(id => allMembers.find((m: any) => m.id === id)?.name).filter(Boolean)
  const goingUsers = event.going.map(id => allMembers.find((m: any) => m.id === id)?.name).filter(Boolean)
  const notGoingUsers = event.notGoing.map(id => allMembers.find((m: any) => m.id === id)?.name).filter(Boolean)

  const isUserRequired = user && event.requiredParticipants.includes(user.id)
  const isUserRecommended = user && (event.recommendedParticipants || []).includes(user.id)
  const isUserGoing = user && event.going.includes(user.id)
  const isUserNotGoing = user && event.notGoing.includes(user.id)

  const formatDate = (dateStr: string) => format(parseISO(dateStr), 'dd.MM.yyyy')

  const handleRSVP = async (going: boolean) => {
    if (!user) return

    // Оптимистичное обновление UI
    let newGoing = [...event.going]
    let newNotGoing = [...event.notGoing]

    if (going) {
      if (newGoing.includes(user.id)) {
        newGoing = newGoing.filter(id => id !== user.id)
      } else {
        newGoing = [...newGoing, user.id]
        newNotGoing = newNotGoing.filter(id => id !== user.id)
      }
    } else {
      if (newNotGoing.includes(user.id)) {
        newNotGoing = newNotGoing.filter(id => id !== user.id)
      } else {
        newNotGoing = [...newNotGoing, user.id]
        newGoing = newGoing.filter(id => id !== user.id)
      }
    }

    setEvent(prev => ({ ...prev, going: newGoing, notGoing: newNotGoing }))

    try {
      await updateEvent(event.id, { going: newGoing, notGoing: newNotGoing })
    } catch (error: any) {
      // Откат при ошибке
      setEvent(initialEvent)
      console.error('Failed to RSVP:', error)
      alert(error.message || 'Ошибка при сохранении ответа')
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={onClose} />

      {/* Modal с внутренним скроллом */}
      <div
        className={`relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-3xl ${bgColor} shadow-2xl border overflow-hidden`}
        style={{ borderColor: theme === 'dark' ? 'rgba(76,127,110,0.2)' : 'rgba(76,127,110,0.15)' }}
      >
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#4C7F6E]/15 rounded-full blur-[120px]" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#4C7F6E]/8 rounded-full blur-[100px]" />
        </div>

        {/* Header - фиксированный */}
        <div
          className="relative shrink-0 p-6 border-b"
          style={{
            borderColor: theme === 'dark' ? 'rgba(76,127,110,0.15)' : 'rgba(76,127,110,0.1)',
            background: theme === 'dark' ? '#0d1117' : 'white'
          }}
        >
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl shrink-0 bg-gradient-to-br from-[#4C7F6E] to-[#3d6b58] shadow-lg shadow-[#4C7F6E]/30">
              <IconComponent className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0 pr-8">
              <h2 className={`text-xl font-bold ${textColor} leading-tight`}>{event.title}</h2>
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#4C7F6E] to-[#3d6b58] text-white">
                  {meta.label}
                </span>
                {isActive && (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Идёт сейчас
                  </span>
                )}
                {startsSoon && !isActive && (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-400">
                    <Timer size={12} />
                    Скоро начнётся
                  </span>
                )}
                {timeUntil && !isActive && !startsSoon && (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/15 text-blue-400">
                    <Timer size={12} />
                    Через {timeUntil}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`absolute top-6 right-6 p-2 rounded-xl transition-all ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
          >
            <X size={20} className={subtleColor} />
          </button>
        </div>

        {/* Content - скроллируемая область */}
        <div className="relative flex-1 overflow-y-auto p-6 space-y-4">
          {/* Date & Time Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className={`p-4 rounded-2xl ${cardBg} border`} style={{ borderColor: theme === 'dark' ? 'rgba(76,127,110,0.15)' : 'rgba(76,127,110,0.1)' }}>
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#4C7F6E]/15">
                  <Calendar size={18} className="text-[#4C7F6E]" />
                </div>
                <div>
                  <p className={`text-[10px] ${subtleColor} uppercase tracking-widest font-medium`}>Дата</p>
                  <p className={`text-sm font-bold ${textColor}`}>
                    {event.dates.length === 1 ? formatDate(event.dates[0]) : `${formatDate(event.dates[0])} — ${formatDate(event.dates[event.dates.length - 1])}`}
                  </p>
                  {event.dates.length > 1 && <p className={`text-[10px] ${subtleColor}`}>{event.dates.length} дат</p>}
                </div>
              </div>
            </div>
            <div className={`p-4 rounded-2xl ${cardBg} border`} style={{ borderColor: theme === 'dark' ? 'rgba(76,127,110,0.15)' : 'rgba(76,127,110,0.1)' }}>
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#4C7F6E]/15">
                  <Clock size={18} className="text-[#4C7F6E]" />
                </div>
                <div>
                  <p className={`text-[10px] ${subtleColor} uppercase tracking-widest font-medium`}>Время</p>
                  <p className={`text-sm font-bold ${textColor}`}>{event.time}{event.endTime ? ` — ${event.endTime}` : ''}</p>
                </div>
              </div>
            </div>
          </div>

          {/* All Dates */}
          {event.dates.length > 1 && (
            <div className={`p-4 rounded-2xl ${cardBg} border`} style={{ borderColor: theme === 'dark' ? 'rgba(76,127,110,0.15)' : 'rgba(76,127,110,0.1)' }}>
              <p className={`text-xs font-bold ${subtleColor} uppercase tracking-wider mb-3`}>Все даты</p>
              <div className="flex flex-wrap gap-1.5">
                {event.dates.map((date, idx) => {
                  const isToday = date === currentDate
                  const isPast = date < currentDate
                  return (
                    <span key={idx} className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                      isToday ? 'bg-[#4C7F6E] text-white' :
                      isPast ? (theme === 'dark' ? 'bg-white/5 text-gray-500' : 'bg-gray-100 text-gray-400') :
                      (theme === 'dark' ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-600')
                    }`}>
                      {formatDate(date)}{isToday && ' · сегодня'}
                    </span>
                  )
                })}
              </div>
            </div>
          )}

          {/* Description */}
          {event.description && (
            <div className={`p-4 rounded-2xl ${cardBg} border`} style={{ borderColor: theme === 'dark' ? 'rgba(76,127,110,0.15)' : 'rgba(76,127,110,0.1)' }}>
              <p className={`text-xs font-bold ${subtleColor} uppercase tracking-wider mb-2`}>Описание</p>
              <p className={`text-sm leading-relaxed ${textColor} whitespace-pre-wrap`}>{event.description}</p>
            </div>
          )}

          {/* Links */}
          {event.links.length > 0 && (
            <div className={`p-4 rounded-2xl ${cardBg} border`} style={{ borderColor: theme === 'dark' ? 'rgba(76,127,110,0.15)' : 'rgba(76,127,110,0.1)' }}>
              <p className={`text-xs font-bold ${subtleColor} uppercase tracking-wider mb-3`}>Ссылки</p>
              <div className="space-y-2">
                {event.links.map((link, index) => (
                  <a key={index} href={link.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl bg-[#4C7F6E]/10 hover:bg-[#4C7F6E]/15 transition-all group">
                    <ExternalLink size={16} className="text-[#4C7F6E] group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium text-[#4C7F6E]">{link.name}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Files */}
          {event.files.length > 0 && (
            <div className={`p-4 rounded-2xl ${cardBg} border`} style={{ borderColor: theme === 'dark' ? 'rgba(76,127,110,0.15)' : 'rgba(76,127,110,0.1)' }}>
              <p className={`text-xs font-bold ${subtleColor} uppercase tracking-wider mb-3`}>Файлы</p>
              <div className="space-y-2">
                {event.files.map((file) => (
                  <a key={file.id} href={file.url} target="_blank" rel="noopener noreferrer"
                    className={`flex items-center gap-3 p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5 hover:bg-white/10' : 'bg-white hover:bg-gray-100'} transition-all group border ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}>
                    <FileText size={16} className={subtleColor} />
                    <span className={`text-sm font-medium ${textColor}`}>{file.name}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Participants */}
          {(requiredParticipants.length > 0 || recommendedParticipants.length > 0) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {requiredParticipants.length > 0 && (
                <div className="p-4 rounded-2xl bg-[#4C7F6E]/10 border border-[#4C7F6E]/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Users size={14} className="text-[#4C7F6E]" />
                    <p className="text-xs font-bold uppercase tracking-wider text-[#4C7F6E]">Обязательные ({requiredParticipants.length})</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {requiredParticipants.map((name, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[#4C7F6E]/20 text-[#4C7F6E]">{name}</span>
                    ))}
                  </div>
                </div>
              )}
              {recommendedParticipants.length > 0 && (
                <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Users size={14} className="text-blue-400" />
                    <p className="text-xs font-bold uppercase tracking-wider text-blue-400">Рекомендованные ({recommendedParticipants.length})</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {recommendedParticipants.map((name, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-500/20 text-blue-400">{name}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Going / Not Going - обновляется мгновенно */}
          {(goingUsers.length > 0 || notGoingUsers.length > 0) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {goingUsers.length > 0 && (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 size={14} className="text-emerald-400" />
                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">Будут ({goingUsers.length})</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {goingUsers.map((name, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-500/20 text-emerald-400">{name}</span>
                    ))}
                  </div>
                </div>
              )}
              {notGoingUsers.length > 0 && (
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <XCircle size={14} className="text-rose-400" />
                    <p className="text-xs font-bold uppercase tracking-wider text-rose-400">Не смогут ({notGoingUsers.length})</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {notGoingUsers.map((name, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-rose-500/20 text-rose-400">{name}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* RSVP */}
          {user && (
            <div className={`p-5 rounded-2xl ${cardBg} border`} style={{ borderColor: theme === 'dark' ? 'rgba(76,127,110,0.15)' : 'rgba(76,127,110,0.1)' }}>
              <p className={`text-xs font-bold ${subtleColor} uppercase tracking-wider mb-3`}>Ваш ответ</p>
              <div className="flex gap-3">
                <button onClick={() => handleRSVP(true)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all hover:scale-[1.02] ${isUserGoing ? 'bg-gradient-to-r from-[#4C7F6E] to-[#3d6b58] text-white shadow-lg shadow-[#4C7F6E]/30' : 'bg-[#4C7F6E]/15 text-[#4C7F6E] hover:bg-[#4C7F6E]/25'}`}>
                  <CheckCircle2 size={18} /> Я буду
                </button>
                <button onClick={() => handleRSVP(false)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all hover:scale-[1.02] ${isUserNotGoing ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-lg shadow-rose-500/30' : 'bg-rose-500/15 text-rose-400 hover:bg-rose-500/25'}`}>
                  <XCircle size={18} /> Не буду
                </button>
              </div>
              {(isUserRequired || isUserRecommended) && !isUserGoing && !isUserNotGoing && (
                <p className={`text-xs ${subtleColor} mt-3 text-center`}>
                  {isUserRequired ? '⚠️ Вы обязательный участник' : 'ℹ️ Ваше участие рекомендовано'}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
