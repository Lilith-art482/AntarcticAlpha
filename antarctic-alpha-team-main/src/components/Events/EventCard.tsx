import { memo } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { useUsers } from '@/hooks/useUsers'
import type { Event } from '@/types'
import { EVENT_CATEGORY_META } from '@/types'
import {
  Edit,
  Trash2,
  Calendar,
  Clock,
  Users,
  FileText,
  ExternalLink,
  Timer,
  Rocket,
  BarChart3,
  Image as ImageIcon,
  Shield,
  Coins,
  TrendingUp,
  Gift,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Pin,
  PinOff,
  ChevronRight,
} from 'lucide-react'
import { updateEvent } from '@/services/eventService'
import { format, parseISO } from 'date-fns'
import { LucideIcon } from 'lucide-react'

interface EventCardProps {
  event: Event
  isAdmin: boolean
  onEdit: (event: Event) => void
  onDelete: (eventId: string) => void
  onClick?: (event: Event) => void
  onRSVP?: () => void
  isEditable?: boolean
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

export const EventCard = memo(({ event, isAdmin, onEdit, onDelete, onClick, isEditable = true }: EventCardProps) => {
  const { theme } = useThemeStore()
  const { user } = useAuthStore()
  const { users: allMembers } = useUsers()

  const meta = EVENT_CATEGORY_META[event.category]
  const IconComponent = categoryIcons[event.category] || Rocket

  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const subtleColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600'

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
    if (minutes >= 0) parts.push(`${minutes}м`)
    return parts.join(' ')
  }

  const timeUntil = getTimeUntilEvent()
  const startsSoon = nextDate && isSoonStarting(new Date(`${nextDate}T${event.time}`).getTime())

  const participants = event.requiredParticipants.map(id => {
    const member = allMembers.find((m: any) => m.id === id)
    return member?.name || 'Unknown'
  }).filter(Boolean)

  const isUserRequired = user && event.requiredParticipants.includes(user.id)
  const isUserRecommended = user && (event.recommendedParticipants || []).includes(user.id)

  const formatDate = (dateStr: string) => format(parseISO(dateStr), 'dd.MM.yyyy')

  const handleToggleHidden = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isAdmin) return
    try {
      await updateEvent(event.id, { isHidden: !event.isHidden })
    } catch (error) {
      console.error('Failed to toggle visibility:', error)
    }
  }

  const handleToggleActual = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isAdmin) return
    try {
      await updateEvent(event.id, { isActualForce: !event.isActualForce })
    } catch (error) {
      console.error('Failed to toggle actual status:', error)
    }
  }

  const handleRSVP = async (going: boolean, e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (!user || !isEditable) return

    try {
      if (going) {
        if (event.going.includes(user.id)) {
          await updateEvent(event.id, { going: event.going.filter(id => id !== user.id) })
        } else {
          await updateEvent(event.id, { 
            going: [...event.going, user.id], 
            notGoing: event.notGoing.filter(id => id !== user.id) 
          })
        }
      } else {
        if (event.notGoing.includes(user.id)) {
          await updateEvent(event.id, { notGoing: event.notGoing.filter(id => id !== user.id) })
        } else {
          await updateEvent(event.id, { 
            notGoing: [...event.notGoing, user.id], 
            going: event.going.filter(id => id !== user.id) 
          })
        }
      }
    } catch (error: any) {
      console.error('Failed to RSVP:', error)
      alert(error.message || 'Ошибка при сохранении ответа')
    }
  }

  const goingUsers = event.going.map(id => allMembers.find((m: any) => m.id === id)?.name).filter(Boolean)
  const notGoingUsers = event.notGoing.map(id => allMembers.find((m: any) => m.id === id)?.name).filter(Boolean)

  const isUserGoing = user && event.going.includes(user.id)
  const isUserNotGoing = user && event.notGoing.includes(user.id)

  return (
    <div
      onClick={() => onClick?.(event)}
      className={`group relative rounded-2xl border transition-all duration-300 overflow-hidden ${onClick ? 'cursor-pointer' : ''} ${!isEditable ? 'opacity-60' : ''} ${event.isHidden ? 'opacity-50' : ''} hover:shadow-xl hover:shadow-[#4C7F6E]/10 hover:-translate-y-1`}
      style={{ 
        background: theme === 'dark' ? 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)' : 'linear-gradient(145deg, rgba(255,255,255,1) 0%, rgba(248,250,252,1) 100%)',
        borderColor: theme === 'dark' ? 'rgba(76,127,110,0.2)' : 'rgba(76,127,110,0.12)'
      }}
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#4C7F6E] via-[#5a9a86] to-[#4C7F6E] opacity-80" />

      {/* Background glow */}
      <div className="absolute -right-20 -top-20 w-40 h-40 bg-[#4C7F6E]/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative p-5">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#4C7F6E] to-[#3d6b58] shadow-lg shadow-[#4C7F6E]/25 shrink-0">
            <IconComponent className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={`text-sm font-bold ${textColor} leading-snug line-clamp-2 group-hover:text-[#4C7F6E] transition-colors`}>
              {event.title}
            </h3>
            <span className="inline-block mt-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#4C7F6E]/15 text-[#4C7F6E]">
              {meta.label}
            </span>
          </div>
          {onClick && (
            <ChevronRight size={16} className={`${subtleColor} opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1`} />
          )}
        </div>

        {/* Date & Time */}
        <div className="flex items-center gap-4 mb-3">
          <div className="flex items-center gap-1.5">
            <Calendar size={13} className="text-[#4C7F6E]" />
            <span className={`text-xs font-medium ${subtleColor}`}>
              {event.dates.length === 1 ? formatDate(event.dates[0]) : `${formatDate(event.dates[0])} — ${formatDate(event.dates[event.dates.length - 1])}`}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={13} className="text-[#4C7F6E]" />
            <span className={`text-xs font-medium ${subtleColor}`}>
              {event.time}{event.endTime ? `—${event.endTime}` : ''}
            </span>
          </div>
        </div>

        {/* Status Pills */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {isActive && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/15 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Идёт
            </span>
          )}
          {startsSoon && !isActive && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/15 text-amber-400">
              <AlertCircle size={10} />
              Скоро
            </span>
          )}
          {timeUntil && !isActive && !startsSoon && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/15 text-blue-400">
              <Timer size={10} />
              {timeUntil}
            </span>
          )}
          {isUserGoing && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#4C7F6E]/15 text-[#4C7F6E]">
              <CheckCircle2 size={10} />
              Иду
            </span>
          )}
          {isUserNotGoing && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-500/15 text-rose-400">
              <XCircle size={10} />
              Не иду
            </span>
          )}
          {!isUserGoing && !isUserNotGoing && (isUserRequired || isUserRecommended) && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/15 text-blue-400">
              <Users size={10} />
              {isUserRequired ? 'Участник' : 'Рекомендовано'}
            </span>
          )}
          {event.isActualForce && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-cyan-500/15 text-cyan-400">
              <Pin size={10} />
              Топ
            </span>
          )}
          {event.isHidden && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-gray-500/15 text-gray-400">
              <EyeOff size={10} />
              Скрыто
            </span>
          )}
        </div>

        {/* Description */}
        {event.description && (
          <p className={`text-xs leading-relaxed ${subtleColor} line-clamp-2 mb-3`}>
            {event.description}
          </p>
        )}

        {/* Links */}
        {event.links.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {event.links.slice(0, 2).map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium bg-[#4C7F6E]/10 text-[#4C7F6E] hover:bg-[#4C7F6E]/20 transition-colors"
              >
                <ExternalLink size={10} />
                {link.name}
              </a>
            ))}
            {event.links.length > 2 && (
              <span className={`text-[10px] ${subtleColor} self-center`}>+{event.links.length - 2}</span>
            )}
          </div>
        )}

        {/* Going / Not Going */}
        {(goingUsers.length > 0 || notGoingUsers.length > 0) && (
          <div className="flex gap-2 mb-3">
            {goingUsers.length > 0 && (
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/10">
                <CheckCircle2 size={10} className="text-emerald-400" />
                <span className="text-[10px] font-bold text-emerald-400">{goingUsers.length}</span>
              </div>
            )}
            {notGoingUsers.length > 0 && (
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-rose-500/10">
                <XCircle size={10} className="text-rose-400" />
                <span className="text-[10px] font-bold text-rose-400">{notGoingUsers.length}</span>
              </div>
            )}
          </div>
        )}

        {/* Participants */}
        {participants.length > 0 && (
          <div className="flex items-center gap-1.5 mb-3">
            <Users size={11} className={subtleColor} />
            <div className="flex flex-wrap gap-1">
              {participants.slice(0, 3).map((name, idx) => (
                <span key={idx} className={`text-[10px] font-medium ${subtleColor}`}>
                  {name}{idx < Math.min(participants.length, 3) - 1 ? ',' : ''}
                </span>
              ))}
              {participants.length > 3 && (
                <span className={`text-[10px] ${subtleColor}`}>+{participants.length - 3}</span>
              )}
            </div>
          </div>
        )}

        {/* Files */}
        {event.files.length > 0 && (
          <div className="flex items-center gap-1.5 mb-3">
            <FileText size={11} className={subtleColor} />
            <span className={`text-[10px] ${subtleColor}`}>{event.files.length} файл{event.files.length > 1 ? 'ов' : ''}</span>
          </div>
        )}

        {/* RSVP Buttons */}
        {user && isEditable && (
          <div className="flex gap-2 mt-4 pt-3 border-t" style={{ borderColor: theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}>
            <button
              onClick={(e) => handleRSVP(true, e)}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold transition-all ${isUserGoing ? 'bg-gradient-to-r from-[#4C7F6E] to-[#3d6b58] text-white shadow-md shadow-[#4C7F6E]/25' : 'bg-[#4C7F6E]/10 text-[#4C7F6E] hover:bg-[#4C7F6E]/20'}`}
            >
              <CheckCircle2 size={14} />
              Я буду
            </button>
            <button
              onClick={(e) => handleRSVP(false, e)}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold transition-all ${isUserNotGoing ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-md shadow-rose-500/25' : 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20'}`}
            >
              <XCircle size={14} />
              Не буду
            </button>
          </div>
        )}

        {/* Admin Actions */}
        {isAdmin && (
          <div className="flex items-center gap-2 mt-4 pt-3 border-t" style={{ borderColor: theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}>
            <button onClick={handleToggleActual} title={event.isActualForce ? 'Убрать из топа' : 'В топ'}
              className={`p-1.5 rounded-lg transition-all ${event.isActualForce ? 'bg-cyan-500/20 text-cyan-400' : 'hover:bg-white/10 text-gray-400'}`}>
              {event.isActualForce ? <PinOff size={14} /> : <Pin size={14} />}
            </button>
            <button onClick={handleToggleHidden} title={event.isHidden ? 'Показать' : 'Скрыть'}
              className={`p-1.5 rounded-lg transition-all ${event.isHidden ? 'bg-rose-500/20 text-rose-400' : 'hover:bg-white/10 text-gray-400'}`}>
              {event.isHidden ? <Eye size={14} /> : <EyeOff size={14} />}
            </button>
            <div className="flex-1" />
            <button onClick={(e) => { e.stopPropagation(); onEdit(event); }}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${theme === 'dark' ? 'bg-white/5 hover:bg-white/10 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}>
              <Edit size={11} />
              Изменить
            </button>
            <button onClick={(e) => { e.stopPropagation(); onDelete(event.id); }}
              className="p-1.5 rounded-lg transition-all hover:bg-rose-500/15 text-rose-400">
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
})
