import { useState, useEffect, useMemo } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { RatingCard } from '@/components/Rating/RatingCard'
import { getRatingData, getEarnings, getDayStatuses, getReferrals, getWorkSlots } from '@/services/firestoreService'
import { getLastNDaysRange, getWeekRange, formatDate, calculateHours, countDaysInPeriod } from '@/utils/dateUtils'
import { calculateRating, getRatingBreakdown } from '@/utils/ratingUtils'
import { getUserNicknameAsync, clearAllNicknameCache, getUserNicknameSync, useUserAvatar } from '@/utils/userUtils'
import { RatingData, Referral, Earnings, DayStatus } from '@/types'
import { useUsers } from '@/hooks/useUsers'
import { TrendingUp, Award, Target, UserPlus, BarChart3, Lock } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useAccessControl } from '@/hooks/useAccessControl'

// Компонент для отображения трёх лидеров
const TopThreeLeaders = ({ leaders, theme }: { leaders: Array<{ userId: string; rating: number }>, theme: string }) => {
  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const mutedColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500'

  if (leaders.length === 0) {
    return (
      <div className={`text-sm ${mutedColor}`}>
        Нет участников с 50+ баллов
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {leaders.map((leader) => {
        const avatarUrl = useUserAvatar(leader.userId)
        const nickname = getUserNicknameSync(leader.userId)
        
        return (
          <div key={leader.userId} className="flex items-center gap-2">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-6 h-6 rounded-full object-cover flex-shrink-0" />
            ) : (
              <div className={`w-6 h-6 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-bold flex-shrink-0`}>
                {nickname ? nickname.charAt(0).toUpperCase() : '-'}
              </div>
            )}
            <span className={`text-sm font-semibold ${headingColor} truncate flex-1`}>
              {nickname || '—'}
            </span>
            <span className={`text-xs font-bold ${theme === 'dark' ? 'text-amber-400' : 'text-amber-600'} flex-shrink-0`}>
              {leader.rating.toFixed(1)}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export const Rating = () => {
  const { user } = useAuthStore()
  const { theme } = useThemeStore()
  const { users: allMembers, loading: usersLoading } = useUsers()
  type RatingWithBreakdown = RatingData & { breakdown: ReturnType<typeof getRatingBreakdown> }
  const [ratings, setRatings] = useState<RatingWithBreakdown[]>([])
  const [loading, setLoading] = useState(true)
  const [referrals, setReferrals] = useState<Referral[]>([])

  // Access Control
  const pageAccess = useAccessControl('arca_rating')
  const othersAccess = useAccessControl('rating_others_view')
  const selfAccess = useAccessControl('rating_self_view')

  useEffect(() => {
    if (!usersLoading) {
      loadRatings()
    }
  }, [usersLoading])

  const loadRatings = async () => {
    setLoading(true)
    try {
      // Для рейтинга считаем за неделю и за месяц
      const weekRange = getWeekRange()
      const weekStart = formatDate(weekRange.start, 'yyyy-MM-dd')
      const weekEnd = formatDate(weekRange.end, 'yyyy-MM-dd')

      const monthRange = getLastNDaysRange(30)
      const monthStart = formatDate(monthRange.start, 'yyyy-MM-dd')
      const monthEnd = formatDate(monthRange.end, 'yyyy-MM-dd')
      const monthIsoStart = monthRange.start.toISOString()
      const monthIsoEnd = monthRange.end.toISOString()

      // 1. Bulk Fetch Data
      const [
        currentReferrals,
        weekEarningsAll,
        monthEarningsAll,
        allExistingRatings
      ] = await Promise.all([
        getReferrals(undefined, monthIsoStart, monthIsoEnd),
        getEarnings(undefined, weekStart, weekEnd),
        getEarnings(undefined, monthStart, monthEnd),
        getRatingData() // Fetch all ratings at once
      ])

      setReferrals(currentReferrals)

      // Filter out excluded user
      const excludedUserIds = ['ydiEgmNj2sCBirUjWeiv']
      const activeMembers = allMembers.filter(m => !excludedUserIds.includes(m.id))

      // 2. Process members in parallel
      const ratingPromises = activeMembers.map(async (member) => {
        try {
          // Earnings filtering (in memory from bulk data)
          const weekEarnings = weekEarningsAll.filter(e => {
            const participants = e.participants && e.participants.length > 0 ? [...e.participants, e.userId] : [e.userId]
            const isApproved = e.status === 'approved' || !e.status
            return participants.includes(member.id) && isApproved
          })

          const weeklyEarnings = weekEarnings.reduce((sum: number, e: Earnings) => {
            const participantCount = e.participants && e.participants.length > 0 ? e.participants.length : 1
            return sum + (e.amount / participantCount)
          }, 0)

          const monthEarnings = monthEarningsAll.filter(e => {
            const participants = e.participants && e.participants.length > 0 ? [...e.participants, e.userId] : [e.userId]
            const isApproved = e.status === 'approved' || !e.status
            return participants.includes(member.id) && isApproved
          })

          const totalEarnings = monthEarnings.reduce((sum: number, e: Earnings) => {
            const participantCount = e.participants && e.participants.length > 0 ? e.participants.length : 1
            return sum + (e.amount / participantCount)
          }, 0)

          const poolAmount = monthEarnings.reduce((sum: number, e: Earnings) => {
            const participantCount = e.participants && e.participants.length > 0 ? e.participants.length : 1
            return sum + (e.poolAmount / participantCount)
          }, 0)

          // Individual fetches (still necessary, but parallelized)
          const [statuses, slots] = await Promise.all([
            getDayStatuses(member.id),
            getWorkSlots(member.id)
          ])

          // Filter statuses that overlap with the month period
          const monthStatuses = statuses.filter(s => {
            const statusStart = s.date
            const statusEnd = s.endDate || s.date
            return statusStart <= monthEnd && statusEnd >= monthStart
          })

          const countStatusDays = (type: string) => monthStatuses
            .filter(s => s.type === type)
            .reduce((sum: number, s: DayStatus) => sum + countDaysInPeriod(s.date, s.endDate, monthStart, monthEnd), 0)

          const absenceDays = countStatusDays('absence')
          const truancyDays = countStatusDays('truancy')

          const weekSlots = slots.filter(s => s.date >= weekStart && s.date <= weekEnd)
          const weeklyHours = weekSlots.reduce((sum, slot) => sum + calculateHours(slot.slots), 0)

          // Find existing rating data
          const existingRatingData = allExistingRatings.find(r => r.userId === member.id)
          const ratingData = existingRatingData || {
            userId: member.id,
            earnings: 0,
            messages: 0,
            initiatives: 0,
            signals: 0,
            profitableSignals: 0,
            referrals: 0,
            daysOff: 0,
            sickDays: 0,
            vacationDays: 0,
            absenceDays: 0,
            internshipDays: 0,
            poolAmount: 0,
            rating: 0,
            lastUpdated: new Date().toISOString(),
          }

          const userReferrals = currentReferrals.filter((referral) => referral.ownerId === member.id).length

          const updatedData: Omit<RatingData, 'rating'> = {
            userId: member.id,
            earnings: totalEarnings,
            messages: ratingData.messages || 0,
            initiatives: ratingData.initiatives || 0,
            signals: ratingData.signals || 0,
            profitableSignals: ratingData.profitableSignals || 0,
            referrals: userReferrals,
            daysOff: 0,
            sickDays: 0,
            vacationDays: 0,
            absenceDays,
            truancyDays,
            internshipDays: 0,
            poolAmount,
            lastUpdated: new Date().toISOString(),
          }

          const rating = calculateRating(updatedData, weeklyHours, weeklyEarnings, 0, 0, 0)
          const breakdown = getRatingBreakdown(updatedData, weeklyHours, weeklyEarnings, 0, 0, 0)

          return {
            ...updatedData,
            rating,
            breakdown,
          }
        } catch (err) {
          console.error(`Error processing rating for member ${member.id}:`, err)
          return null
        }
      })

      const results = await Promise.all(ratingPromises)
      const validRatings = results.filter((r): r is RatingWithBreakdown => r !== null)

      // Sort by rating
      validRatings.sort((a, b) => b.rating - a.rating)
      setRatings(validRatings)
    } catch (error) {
      console.error('Error loading ratings:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredRatings = useMemo(() => {
    if (!user) return []
    return ratings.filter(r => {
      const isSelf = r.userId === user.id
      if (isSelf) return selfAccess.hasAccess
      return othersAccess.hasAccess
    })
  }, [ratings, user, selfAccess.hasAccess, othersAccess.hasAccess])

  const teamKPD = ratings.reduce((sum: number, r: RatingWithBreakdown) => sum + r.rating, 0) / (ratings.length || 1)
  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'

  const sortedRatings = useMemo<RatingWithBreakdown[]>(() => {
    return [...filteredRatings].sort((a, b) => b.rating - a.rating)
  }, [filteredRatings])

  const ratingOverview = useMemo(() => {
    if (!sortedRatings.length) {
      return { top: 0, median: 0, count: 0, high: 0 }
    }
    const top = sortedRatings[0]?.rating || 0
    const median = sortedRatings[Math.floor((sortedRatings.length - 1) / 2)]?.rating || top
    const high = sortedRatings.filter((r) => r.rating >= 80).length
    return { top, median, count: sortedRatings.length, high }
  }, [sortedRatings])

  // Три лидера с рейтингом >= 50
  const topThreeLeaders = useMemo(() => {
    return sortedRatings
      .filter(r => r.rating >= 50)
      .slice(0, 3)
      .map(r => ({ userId: r.userId, rating: r.rating }))
  }, [sortedRatings])

  // Load custom nicknames on mount
  useEffect(() => {
    const loadCustomNicknames = async () => {
      clearAllNicknameCache()
      for (const member of allMembers) {
        await getUserNicknameAsync(member.id)
      }
    }
    if (!usersLoading) {
      loadCustomNicknames()
    }
  }, [allMembers, usersLoading])

  // Listen for nickname updates and reload nicknames
  useEffect(() => {
    const handleNicknameUpdate = async (event: Event) => {
      const customEvent = event as CustomEvent<{ userId: string }>
      const { userId } = customEvent.detail || {}
      if (userId) {
        // Reload nickname for the updated user
        await getUserNicknameAsync(userId)
        // Force component re-render by updating state
        setRatings(prev => [...prev])
      } else {
        // Reload all nicknames if userId not specified
        clearAllNicknameCache()
        for (const member of allMembers) {
          await getUserNicknameAsync(member.id)
        }
        setRatings(prev => [...prev])
      }
    }

    window.addEventListener('nicknameUpdated', handleNicknameUpdate)
    return () => {
      window.removeEventListener('nicknameUpdated', handleNicknameUpdate)
    }
  }, [allMembers])

  if (pageAccess.loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    )
  }

  if (!pageAccess.hasAccess) {
    return (
      <div className="py-20 text-center space-y-4">
        <Lock className="w-16 h-16 text-gray-700 mx-auto opacity-20" />
        <h3 className={`text-xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Доступ к ARCA Score ограничен</h3>
        <p className="text-gray-500 max-w-md mx-auto">{othersAccess.reason || 'У вас нет доступа к просмотру рейтинга.'}</p>
      </div>
    )
  }

  const statCards = [
    {
      label: 'Средний рейтинг',
      value: `${teamKPD.toFixed(1)}`,
      note: 'за текущую неделю',
      icon: <TrendingUp className="w-5 h-5 text-[#4C7F6E]" />,
      bgClass: 'bg-[#4C7F6E]/5',
      borderClass: 'border-[#4C7F6E]/20'
    },
    {
      label: 'Три лидера',
      value: <TopThreeLeaders leaders={topThreeLeaders} theme={theme} />,
      note: 'минимум 50 баллов',
      icon: <Award className="w-5 h-5 text-amber-400" />,
      bgClass: 'bg-amber-500/5',
      borderClass: 'border-amber-500/20'
    },
    {
      label: 'Участников 80+',
      value: `${ratingOverview.high}`,
      note: 'высокий уровень',
      icon: <Target className="w-5 h-5 text-blue-400" />,
      bgClass: 'bg-blue-500/5',
      borderClass: 'border-blue-500/20'
    },
    {
      label: 'Рефералы за 30 дней',
      value: `${referrals.length}`,
      note: 'новые участники',
      icon: <UserPlus className="w-5 h-5 text-pink-400" />,
      bgClass: 'bg-pink-500/5',
      borderClass: 'border-pink-500/20'
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#4C7F6E]/10 rounded-2xl border border-[#4C7F6E]/20">
              <TrendingUp className="w-8 h-8 text-[#4C7F6E]" />
            </div>
            <div>
              <h1 className={`text-2xl md:text-3xl font-black tracking-tight ${headingColor}`}>
                Track Record
              </h1>
              <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Рейтинг эффективности команды ARCA - Team
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((item, idx) => (
            <div
              key={idx}
              className={`relative overflow-hidden rounded-2xl p-5 border transition-all duration-300 hover:shadow-lg group ${theme === 'dark'
                ? `${item.bgClass} ${item.borderClass} hover:border-opacity-50`
                : 'bg-white border-gray-100 hover:border-emerald-500/20'
                }`}
            >
              <div className="flex justify-between items-start mb-4">
                <span className={`text-[10px] font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {item.label}
                </span>
                <div className={`p-2 rounded-xl transition-colors ${theme === 'dark' ? 'bg-white/5 group-hover:bg-white/10' : 'bg-gray-100 group-hover:bg-gray-200'}`}>
                  {item.icon}
                </div>
              </div>
              <div className="space-y-1">
                <div className={`text-2xl font-black tracking-tight ${headingColor}`}>
                  {typeof item.value === 'string' ? item.value : item.value}
                </div>
                <div className={`text-[11px] font-medium ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                  {item.note}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rating Cards Section */}
      <div className={`rounded-2xl p-6 border ${theme === 'dark' ? 'bg-[#0b1015] border-white/5' : 'bg-white border-gray-100'} shadow-xl`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-[#4C7F6E]/10 rounded-xl">
            <BarChart3 className="w-5 h-5 text-[#4C7F6E]" />
          </div>
          <div>
            <h3 className={`text-lg font-black tracking-tight ${headingColor}`}>Детальная статистика</h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Карточки участников с полными данными</p>
          </div>
        </div>

        {loading ? (
          <div className={`rounded-xl p-12 text-center border border-dashed ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'}`}>
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
              <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Загрузка рейтинга...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Топ-1', value: sortedRatings[0]?.rating ? `${sortedRatings[0].rating.toFixed(1)}` : '—' },
                { label: 'Средний рейтинг', value: `${teamKPD.toFixed(1)}` },
                { label: 'Медиана', value: `${ratingOverview.median.toFixed(1)}` },
                { label: 'Участников', value: sortedRatings.length },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`rounded-xl border px-4 py-3 ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}
                >
                  <p className={`text-[11px] uppercase tracking-wide font-bold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{item.label}</p>
                  <p className={`text-2xl font-black ${headingColor}`}>{item.value}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6">
              {sortedRatings.map((rating, index) => (
                <RatingCard
                  key={rating.userId}
                  rating={rating}
                  place={{ rank: index + 1 }}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
