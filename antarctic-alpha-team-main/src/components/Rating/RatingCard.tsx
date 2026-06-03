import { useThemeStore } from '@/store/themeStore'
import { getRatingBreakdown } from '@/utils/ratingUtils'
import { RatingData } from '@/types'
import { UserNickname } from '@/components/UserNickname'
import { Clock, DollarSign, Users, TrendingUp, AlertTriangle, Lightbulb, Shield, ChevronDown } from 'lucide-react'
import React, { useState } from 'react'
import { useUserNickname, useUserAvatar, useUserPositions } from '@/utils/userUtils'

interface RatingCardProps {
  rating: RatingData & { breakdown?: ReturnType<typeof getRatingBreakdown> }
  place?: { rank: number }
}

interface ScaleLevel {
  label: string
  points: number
  color: string
}

interface MetricInfo {
  icon: React.ReactNode
  label: string
  value: string
  points: number
  maxPoints: number
  what: string
  why: string
  how: string
  color: string
  scale: ScaleLevel[]
}

const PenguinIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg 
    viewBox="0 0 64 64" 
    className={className}
    fill="currentColor"
  >
    {/* Тело пингвина */}
    <ellipse cx="32" cy="38" rx="18" ry="22" fill="currentColor"/>
    {/* Живот */}
    <ellipse cx="32" cy="40" rx="10" ry="16" fill="white"/>
    {/* Голова */}
    <circle cx="32" cy="20" r="12" fill="currentColor"/>
    {/* Глаза */}
    <circle cx="28" cy="18" r="2.5" fill="white"/>
    <circle cx="36" cy="18" r="2.5" fill="white"/>
    <circle cx="28" cy="18" r="1.2" fill="black"/>
    <circle cx="36" cy="18" r="1.2" fill="black"/>
    {/* Клюв */}
    <path d="M32 22 L28 26 L32 28 L36 26 Z" fill="#FFA500"/>
    {/* Лапки */}
    <ellipse cx="22" cy="58" rx="6" ry="3" fill="#FFA500"/>
    <ellipse cx="42" cy="58" rx="6" ry="3" fill="#FFA500"/>
    {/* Крылья */}
    <ellipse cx="14" cy="38" rx="4" ry="12" fill="currentColor" transform="rotate(-20 14 38)"/>
    <ellipse cx="50" cy="38" rx="4" ry="12" fill="currentColor" transform="rotate(20 50 38)"/>
  </svg>
)

const RatingScale: React.FC<{ scale: ScaleLevel[]; currentPoints: number; theme: string }> = ({ scale, currentPoints, theme }) => {
  const mutedColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
  
  // Сортируем шкалу по возрастанию баллов для универсальной обработки
  const sortedScale = [...scale].sort((a, b) => a.points - b.points)
  
  // Определяем направление шкалы (возрастающая или убывающая в оригинале)
  const isDescending = scale[0].points > scale[scale.length - 1].points
  
  // Находим индекс текущего уровня в отсортированной шкале
  const currentLevelIndex = sortedScale.findIndex((_, idx) => {
    if (idx === sortedScale.length - 1) return true
    return currentPoints < sortedScale[idx + 1].points
  })
  
  // Вычисляем позицию пингвина внутри сегмента
  const segmentWidth = 100 / sortedScale.length
  let penguinPosition = 0
  
  if (currentLevelIndex >= 0) {
    const currentLevel = sortedScale[currentLevelIndex]
    const nextLevel = sortedScale[currentLevelIndex + 1]
    
    if (nextLevel) {
      // Вычисляем прогресс внутри сегмента
      const range = nextLevel.points - currentLevel.points
      let progress = 0
      
      if (isDescending) {
        // Для убывающих шкал инвертируем прогресс
        progress = range > 0 ? (currentLevel.points - currentPoints) / range : 0
      } else {
        // Для возрастающих шкал используем обычную логику
        progress = range > 0 ? (currentPoints - currentLevel.points) / range : 0
      }
      
      progress = Math.max(0, Math.min(1, progress))
      
      if (isDescending) {
        // Для убывающих шкал пингвин идет от конца сегмента к началу
        penguinPosition = (currentLevelIndex * segmentWidth) + (segmentWidth * (1 - progress))
      } else {
        // Для возрастающих шкал пингвин идет от начала сегмента к концу
        penguinPosition = (currentLevelIndex * segmentWidth) + (segmentWidth * progress)
      }
    } else {
      // Если это последний уровень в отсортированном порядке
      penguinPosition = isDescending ? 0 : 100
    }
  }

  return (
    <div className="mt-3 space-y-3">
      {/* Шкала с пингвином */}
      <div className="relative">
        <div className="flex gap-1 h-4 rounded-full overflow-hidden">
          {scale.map((level, idx) => (
            <div
              key={idx}
              className={`flex-1 transition-all duration-300 ${level.color} ${
                currentPoints >= level.points ? 'opacity-100' : 'opacity-30'
              }`}
              title={`${level.label}: ${level.points} баллов`}
            />
          ))}
        </div>
        
        {/* Маркер с пингвином */}
        <div 
          className="absolute -top-2 transform -translate-x-1/2 transition-all duration-500 ease-out"
          style={{ left: `${penguinPosition}%` }}
        >
          <div className="relative">
            <PenguinIcon className="w-7 h-7 text-gray-800 drop-shadow-lg" />
            {/* Тень */}
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-5 h-1.5 bg-black/20 rounded-full blur-sm"/>
          </div>
        </div>
      </div>

      {/* Числовые значения - центрированы по сегментам */}
      <div className="flex">
        {scale.map((level, idx) => (
          <div
            key={idx}
            className={`flex-1 text-center text-[10px] uppercase font-bold tracking-wide ${
              currentPoints >= level.points
                ? level.color.replace('bg-', 'text-').replace('/20', '').replace('/30', '').replace('/10', '')
                : mutedColor
            }`}
          >
            {level.points > 0 ? '+' : ''}{level.points}
          </div>
        ))}
      </div>

      {/* Полные подписи уровней - центрированы по сегментам */}
      <div className="flex">
        {scale.map((level, idx) => (
          <div
            key={idx}
            className={`flex-1 text-center text-[9px] uppercase tracking-wider leading-tight ${
              currentPoints >= level.points
                ? level.color.replace('bg-', 'text-').replace('/20', '').replace('/30', '').replace('/10', '')
                : mutedColor
            }`}
          >
            {level.label}
          </div>
        ))}
      </div>
    </div>
  )
}

export const RatingCard = ({ rating, place }: RatingCardProps) => {
  console.log('RatingCard render - userId:', rating.userId, 'breakdown:', rating.breakdown)
  const { theme } = useThemeStore()
  const [expandedMetric, setExpandedMetric] = useState<number | null>(null)
  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const mutedColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
  const cardBg = theme === 'dark' ? 'bg-[#0f0f0f]' : 'bg-white'
  const borderColor = theme === 'dark' ? 'border-white/10' : 'border-gray-200'
  const softSurface = theme === 'dark' ? 'bg-white/5' : 'bg-gray-50/80'

  // Максимальное количество баллов не ограничено, поэтому показываем прогресс относительно 100 как ориентир
  const barWidth = rating.rating <= 0 ? '4%' : `${Math.min(Math.max(rating.rating, 5), 100)}%`

  const nickname = useUserNickname(rating.userId)
  const avatarUrl = useUserAvatar(rating.userId)
  const positions = useUserPositions(rating.userId)
  const primaryPosition = positions[0] // Используем первую позицию как основную

  const metrics: MetricInfo[] = rating.breakdown ? [
    {
      icon: <Clock className="w-5 h-5" />,
      label: 'Часы работы',
      value: `${rating.breakdown.weeklyHours.toFixed(1)} ч/нед`,
      points: rating.breakdown.weeklyHoursPoints,
      maxPoints: 20,
      what: `Отработано ${rating.breakdown.weeklyHours.toFixed(1)} часов за неделю.`,
      why: 'Часы работы показывают твой вклад в общее время команды. Это базовый показатель активности — чем больше часов, тем выше твой вклад.',
      how: rating.breakdown.weeklyHoursPoints < 20
        ? rating.breakdown.weeklyHoursPoints === 0
          ? 'Твоя активность ниже нормы. Для получения баллов нужно минимум 15 часов в неделю. Берите больше слотов и задач.'
          : 'Хороший старт! Цель: 25+ часов в неделю для 20 баллов.'
        : 'Отличный результат! Ты активно работаешь и вносишь максимальный вклад.',
      color: 'bg-blue-200 text-blue-900 dark:bg-blue-500/20 dark:text-blue-400',
      scale: [
        { label: '< 15ч', points: 0, color: 'bg-gray-400' },
        { label: '15-25ч', points: 10, color: 'bg-blue-400' },
        { label: '25+ч', points: 20, color: 'bg-blue-600' }
      ]
    },
    {
      icon: <DollarSign className="w-5 h-5" />,
      label: 'Заработок (неделя)',
      value: `${Math.round(rating.breakdown.weeklyEarnings).toLocaleString()} ₽`,
      points: rating.breakdown.weeklyEarningsPoints,
      maxPoints: 20,
      what: `Заработано ${Math.round(rating.breakdown.weeklyEarnings).toLocaleString()} ₽ за неделю.`,
      why: 'Недельный доход — ключевой показатель эффективности твоих действий. Это результат работы и умения находить профитные возможности.',
      how: rating.breakdown.weeklyEarningsPoints < 20
        ? rating.breakdown.weeklyEarningsPoints === 0
          ? 'Доход ниже порога для баллов. Минимум 10 000 ₽ для получения баллов. Анализируй рынок и ищи возможности.'
          : rating.breakdown.weeklyEarningsPoints === 10
          ? 'Хороший результат! Цель: 20 000+ ₽ для 15 баллов или 30 000+ ₽ для максимальных 20.'
          : 'Отличный прогресс! До 20 баллов осталось чуть больше 10 000 ₽.'
        : 'Супер! Твой доход на высоте — ты получаешь максимальные баллы за этот показатель.',
      color: 'bg-emerald-200 text-emerald-900 dark:bg-emerald-500/20 dark:text-emerald-400',
      scale: [
        { label: '< 10K', points: 0, color: 'bg-gray-400' },
        { label: '10K-20K', points: 10, color: 'bg-emerald-400' },
        { label: '20K-30K', points: 15, color: 'bg-emerald-500' },
        { label: '30K+', points: 20, color: 'bg-emerald-600' }
      ]
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: 'Рефералы (месяц)',
      value: `${rating.breakdown.referrals} чел.`,
      points: rating.breakdown.referralsPoints,
      maxPoints: 20,
      what: `Привлечено ${rating.breakdown.referrals} рефералов за 30 дней.`,
      why: 'Рост комьюнити важен для масштабирования и новых возможностей. Рефералы показывают твой вклад в развитие сообщества.',
      how: rating.breakdown.referralsPoints < 20
        ? rating.breakdown.referralsPoints === 0
          ? 'Рефералов пока нет. Начни с 1 приглашённого для первых 5 баллов. Делись реферальной ссылкой.'
          : 'Хорошее начало! Каждый новый реферал приносит 5 баллов. Цель: 4 реферала для 20 баллов.'
        : 'Превосходно! Ты активно помогаешь развивать комьюнити.',
      color: 'bg-pink-200 text-pink-900 dark:bg-pink-500/20 dark:text-pink-400',
      scale: [
        { label: '0 реф', points: 0, color: 'bg-gray-400' },
        { label: '1 реф', points: 5, color: 'bg-pink-400' },
        { label: '2 реф', points: 10, color: 'bg-pink-500' },
        { label: '4+ реф', points: 20, color: 'bg-pink-600' }
      ]
    },
    {
      icon: <Lightbulb className="w-5 h-5" />,
      label: 'Инициативы (месяц)',
      value: `${rating.breakdown.initiatives}`,
      points: rating.breakdown.initiativesPoints,
      maxPoints: 40,
      what: `Предложено ${rating.breakdown.initiatives} инициатив за месяц.`,
      why: 'Проактивность помогает развивать проект и улучшать процессы. Инициативы показывают твою вовлечённость в развитие команды.',
      how: rating.breakdown.initiativesPoints < 40
        ? rating.breakdown.initiativesPoints === 0
          ? 'Инициатив пока нет. Предложи хотя бы 2 идеи для первых 20 баллов. Это может быть улучшение процессов, новый инструмент или предложение.'
          : 'Хороший старт! Цель: 4 инициативы для максимальных 40 баллов.'
        : 'Отлично! Ты активно вносишь вклад в развитие проекта.',
      color: 'bg-indigo-200 text-indigo-900 dark:bg-indigo-500/20 dark:text-indigo-400',
      scale: [
        { label: '< 2', points: 0, color: 'bg-gray-400' },
        { label: '2 инициативы', points: 20, color: 'bg-indigo-400' },
        { label: '4+ инициатив', points: 40, color: 'bg-indigo-600' }
      ]
    },
    {
      icon: <Shield className="w-5 h-5" />,
      label: 'Отсутствия (месяц)',
      value: `${rating.breakdown.absenceDays} дн.`,
      points: rating.breakdown.absenceDaysPoints,
      maxPoints: 0,
      what: `Отсутствий: ${rating.breakdown.absenceDays} за месяц (с согласованием).`,
      why: 'Минимум отсутствий показывает твою ответственность и надёжность как участника команды. Меньше 5 дней в месяц — бонус.',
      how: rating.breakdown.absenceDaysPoints < 10
        ? rating.breakdown.absenceDaysPoints === -20
          ? 'Слишком много отсутствий! Ты теряешь 20 баллов. Старайся минимизировать отсутствия и лучше планировать своё время.'
          : 'Нейтральный показатель. Для получения +10 баллов постарайся держать отсутствия ниже 5 дней в месяц.'
        : 'Отличная посещаемость! Ты получаешь бонус за стабильность.',
      color: rating.breakdown.absenceDaysPoints < 0
        ? 'bg-red-200 text-red-900 dark:bg-red-500/20 dark:text-red-400'
        : 'bg-amber-200 text-amber-900 dark:bg-amber-500/20 dark:text-amber-400',
      scale: [
        { label: '> 10 дней', points: -20, color: 'bg-red-500' },
        { label: '5-10 дней', points: 0, color: 'bg-gray-400' },
        { label: '< 5 дней', points: 10, color: 'bg-amber-500' }
      ]
    },
    {
      icon: <AlertTriangle className="w-5 h-5" />,
      label: 'Прогулы (месяц)',
      value: `${rating.breakdown.truancyDays} дн.`,
      points: rating.breakdown.truancyDaysPoints,
      maxPoints: 0,
      what: `Прогулов: ${rating.breakdown.truancyDays} за месяц (без согласования).`,
      why: 'Прогул — серьёзное нарушение дисциплины. >3 прогулов — штраф -15 баллов, >6 — двойной штраф -30 баллов. Это влияет на возможность оставаться в команде.',
      how: rating.breakdown.truancyDaysPoints < 0
        ? rating.breakdown.truancyDaysPoints === -30
          ? 'Критичная ситуация! Прогулы недопустимы. Ты теряешь 30 баллов и рискуешь быть исключённым из команды. Обязательно предупреждай об отсутствиях заранее!'
          : 'Внимание! Прогулы влияют на рейтинг. Ты теряешь 15 баллов. Предупреждай об отсутствиях заранее через статус "Отсутствие".'
        : 'Дисциплина в норме. Продолжай предупреждать о планах заранее.',
      color: rating.breakdown.truancyDaysPoints < 0
        ? 'bg-red-300 text-red-900 dark:bg-red-500/30 dark:text-red-400'
        : 'bg-green-200 text-green-900 dark:bg-green-500/20 dark:text-green-400',
      scale: [
        { label: '0 прогулов', points: 0, color: 'bg-green-500' },
        { label: '1-3 прогула', points: -15, color: 'bg-orange-500' },
        { label: '4+ прогулов', points: -30, color: 'bg-red-600' }
      ]
    },
  ] : []

  const totalPoints = rating.breakdown?.totalRating || rating.rating

  // Place badge
  const placeBadge = (() => {
    if (!place) return null
    const rank = place.rank

    return (
      <div className={`inline-flex px-3 py-1.5 rounded-xl text-sm font-bold border-2 ${
        rank === 1
          ? 'bg-amber-500/10 border-amber-500/50 text-amber-600 dark:text-amber-400'
          : rank === 2
            ? 'bg-slate-500/10 border-slate-500/50 text-slate-500 dark:text-slate-400'
            : rank === 3
              ? 'bg-orange-500/10 border-orange-500/50 text-orange-500 dark:text-orange-400'
              : 'bg-gray-500/10 border-gray-500/50 text-gray-500 dark:text-gray-400'
      }`}>
        {rank} {rank === 1 ? 'место' : 'место'}
      </div>
    )
  })()

  return (
    <div className={`relative rounded-2xl p-6 ${cardBg} shadow-xl border ${borderColor} transition-all duration-300 overflow-hidden`}>
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-blue-500/5 pointer-events-none" />

      {/* Header with name and rating */}
      <div className="relative mb-6 flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className={`text-[10px] uppercase tracking-[0.15em] font-bold ${mutedColor} mb-2`}>Участник команды</p>
            <div className="flex items-center gap-2 mb-2">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-bold`}>
                  {nickname ? nickname.charAt(0).toUpperCase() : '-'}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h3 className={`text-3xl font-black ${headingColor} truncate`}>
                  <UserNickname userId={rating.userId} fallback="unknown" />
                </h3>
                {primaryPosition && (
                  <p className={`text-[11px] font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-[#4C7F6E]' : 'text-[#4C7F6E]'}`}>
                    {primaryPosition}
                  </p>
                )}
              </div>
            </div>
            {placeBadge}
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-4xl font-black text-[#4C7F6E]">
              {rating.rating.toFixed(1)}
            </span>
            <span className={`text-[10px] uppercase tracking-wider font-bold ${mutedColor}`}>баллов</span>
          </div>
        </div>

        {/* Main rating progress bar */}
        <div className="space-y-2">
          <div className="relative w-full h-8 bg-gradient-to-r from-gray-200/50 to-gray-300/50 dark:from-gray-800/50 dark:to-gray-700/50 rounded-2xl overflow-hidden shadow-inner backdrop-blur-sm">
            <div
              className="h-full transition-all duration-700 ease-out flex items-center justify-end pr-3 bg-[#4C7F6E] relative overflow-hidden"
              style={{
                width: barWidth,
                minWidth: rating.rating <= 0 ? '50px' : undefined,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent" />
              {rating.rating >= 5 && <span className="text-sm font-black text-white drop-shadow-lg relative z-10">{rating.rating.toFixed(1)}</span>}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className={`text-xs font-semibold ${mutedColor}`}>Общий рейтинг</span>
            <span className={`text-xs font-black ${headingColor} px-2 py-0.5 rounded-lg ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-100'}`}>
              {totalPoints} баллов
            </span>
          </div>
        </div>
      </div>

      {/* Metrics Breakdown */}
      {rating.breakdown && (
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-[#4C7F6E]" />
            <h4 className={`text-lg font-semibold ${headingColor}`}>Детальный разбор</h4>
          </div>

          {metrics.map((metric, index) => {
            const percentage = metric.maxPoints > 0 ? Math.min(Math.max((metric.points / metric.maxPoints) * 100, 0), 100) : 0
            const isExpanded = expandedMetric === index

            return (
            <div
              key={index}
              className={`relative overflow-hidden rounded-xl border ${theme === 'dark'
                ? 'bg-white/5 border-white/10'
                : 'bg-white border-gray-100'
                }`}
            >
                <button
                  onClick={() => setExpandedMetric(isExpanded ? null : index)}
                  className="w-full px-4 py-3 flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`p-2 rounded-lg ${metric.color} flex-shrink-0`}>
                      {metric.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-semibold ${headingColor} truncate`}>
                          {metric.label}
                        </span>
                        <span className={`font-bold ml-2 ${metric.points > 0 ? 'text-[#4E6E49]' : metric.points < 0 ? 'text-red-500' : 'text-gray-400'}`}>
                          {metric.points > 0 ? '+' : ''}{metric.points}{metric.maxPoints > 0 ? `/${metric.maxPoints}` : ''}
                        </span>
                      </div>
                      {metric.maxPoints > 0 && (
                        <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${metric.color}`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      )}
                      <div className="flex items-center justify-between mt-1">
                        <span className={`text-xs ${mutedColor} truncate mr-2`}>{metric.value}</span>
                      </div>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-[#4C7F6E] flex-shrink-0 ml-2 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {isExpanded && (
                  <div className={`px-4 pb-4 pt-1 border-t ${borderColor} ${softSurface}`}>
                    <div className="space-y-2 mt-1">
                      {/* Визуальная шкала с пингвином */}
                      <div>
                        <span className={`text-[10px] uppercase font-bold tracking-wider opacity-60 ${headingColor}`}>Шкала баллов</span>
                        <RatingScale scale={metric.scale} currentPoints={metric.points} theme={theme} />
                      </div>
                      
                      <div>
                        <span className={`text-[10px] uppercase font-bold tracking-wider opacity-60 ${headingColor}`}>Что это</span>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{metric.what}</p>
                      </div>
                      <div>
                        <span className={`text-[10px] uppercase font-bold tracking-wider opacity-60 ${headingColor}`}>Почему это важно</span>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{metric.why}</p>
                      </div>
                      <div>
                        <span className={`text-[10px] uppercase font-bold tracking-wider opacity-60 ${headingColor}`}>Как улучшить</span>
                        <div className={`mt-1 p-2 rounded-lg border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-emerald-50 border-emerald-100'}`}>
                          <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {metric.how}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
