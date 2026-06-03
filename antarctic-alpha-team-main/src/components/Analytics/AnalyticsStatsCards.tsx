import { useThemeStore } from '@/store/themeStore'
import { AnalyticsReview } from '@/types'
import { UserNickname } from '@/components/UserNickname'
import { Trophy, TrendingUp, BarChart3, Star, ExternalLink } from 'lucide-react'
import { formatDate } from '@/utils/dateUtils'
import { SLOT_CATEGORY_META, SlotCategory } from '@/types'

interface AnalyticsStatsCardsProps {
    reviews: AnalyticsReview[]
}

interface AnalyticsStats {
    topAnalysts: Array<{ userId: string; positiveRatings: number }>
    topSpheres: Array<{ sphere: string; count: number }>
    mostPopularReview: { review: AnalyticsReview; ratingCount: number } | null
}

export const AnalyticsStatsCards = ({ reviews }: AnalyticsStatsCardsProps) => {
    const { theme } = useThemeStore()

    // Фильтруем обзоры за сегодня
    const todayStr = formatDate(new Date(), 'yyyy-MM-dd')
    const todayReviews = reviews.filter(review => {
        const reviewDate = formatDate(new Date(review.createdAt), 'yyyy-MM-dd')
        return reviewDate === todayStr
    })

    // Вычисляем статистику
    const stats: AnalyticsStats = {
        topAnalysts: [],
        topSpheres: [],
        mostPopularReview: null
    }

    // 1. Топ-3 аналитика по положительным оценкам (оценки >= 4 считаются положительными)
    const analystRatings: Record<string, number> = {}
    todayReviews.forEach(review => {
        if (review.ratings && review.ratings.length > 0) {
            const positiveCount = review.ratings.filter(r => r.value >= 4).length
            analystRatings[review.createdBy] = (analystRatings[review.createdBy] || 0) + positiveCount
        }
    })

    stats.topAnalysts = Object.entries(analystRatings)
        .map(([userId, positiveRatings]) => ({ userId, positiveRatings }))
        .sort((a, b) => b.positiveRatings - a.positiveRatings)
        .slice(0, 3)

    // 2. Топ-3 популярных сферы (по частоте упоминания)
    const sphereCounts: Record<string, number> = {}
    todayReviews.forEach(review => {
        const sphere = review.sphere
        if (sphere) {
            sphereCounts[sphere] = (sphereCounts[sphere] || 0) + 1
        }
    })

    stats.topSpheres = Object.entries(sphereCounts)
        .map(([sphere, count]) => ({ sphere, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3)

    // 3. Самый популярный разбор (по количеству оценок)
    const reviewsWithRatings = todayReviews.filter(r => r.ratings && r.ratings.length > 0)
    if (reviewsWithRatings.length > 0) {
        const mostPopular = reviewsWithRatings.reduce((max, review) => {
            const ratingCount = review.ratings!.length
            return ratingCount > max.ratingCount ? { review, ratingCount } : max
        }, { review: reviewsWithRatings[0], ratingCount: reviewsWithRatings[0].ratings!.length })
        stats.mostPopularReview = mostPopular
    }

    const statCards = [
        {
            label: '3 лучших аналитика',
            icon: <Trophy className="w-5 h-5 text-amber-400" />,
            tone: 'amber',
            bgClass: 'bg-amber-500/5',
            borderClass: 'border-amber-500/20',
            content: (
                <div className="space-y-2">
                    {stats.topAnalysts.length > 0 ? (
                        stats.topAnalysts.map((analyst, idx) => (
                            <div key={analyst.userId} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                        idx === 0 ? 'bg-amber-500 text-white' :
                                        idx === 1 ? 'bg-gray-400 text-white' :
                                        'bg-amber-700 text-white'
                                    }`}>
                                        {idx + 1}
                                    </span>
                                    <UserNickname userId={analyst.userId} className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} />
                                </div>
                                <span className={`text-sm font-bold ${theme === 'dark' ? 'text-amber-400' : 'text-amber-600'}`}>
                                    +{analyst.positiveRatings}
                                </span>
                            </div>
                        ))
                    ) : (
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Нет данных за сегодня</p>
                    )}
                </div>
            )
        },
        {
            label: '3 самых популярных сферы',
            icon: <TrendingUp className="w-5 h-5 text-[#4C7F6E]" />,
            tone: 'emerald',
            bgClass: 'bg-[#4C7F6E]/5',
            borderClass: 'border-[#4C7F6E]/20',
            content: (
                <div className="space-y-2">
                    {stats.topSpheres.length > 0 ? (
                        stats.topSpheres.map((item, idx) => (
                            <div key={item.sphere} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                        idx === 0 ? 'bg-[#4C7F6E] text-white' :
                                        idx === 1 ? 'bg-[#4C7F6E] text-white' :
                                        'bg-[#4C7F6E] text-white'
                                    }`}>
                                        {idx + 1}
                                    </span>
                                    <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        {SLOT_CATEGORY_META[item.sphere as SlotCategory]?.label || item.sphere}
                                    </span>
                                </div>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${theme === 'dark' ? 'bg-[#4C7F6E]/20 text-[#4C7F6E]' : 'bg-[#4C7F6E]/20 text-[#4C7F6E]'}`}>
                                    {item.count}
                                </span>
                            </div>
                        ))
                    ) : (
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Нет данных за сегодня</p>
                    )}
                </div>
            )
        },
        {
            label: 'Популярный разбор',
            icon: <Star className="w-5 h-5 text-yellow-400" />,
            tone: 'yellow',
            bgClass: 'bg-yellow-500/5',
            borderClass: 'border-yellow-500/20',
            content: (
                <div className="space-y-2">
                    {stats.mostPopularReview ? (
                        <>
                            <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-bold truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        #{stats.mostPopularReview.review.number || '—'} {stats.mostPopularReview.review.asset || 'Без названия'}
                                    </p>
                                    <p className={`text-xs truncate ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {SLOT_CATEGORY_META[stats.mostPopularReview.review.sphere as SlotCategory]?.label || stats.mostPopularReview.review.sphere}
                                    </p>
                                </div>
                                <div className="flex items-center gap-1 ml-2">
                                    <Star size={14} className="text-yellow-500 fill-yellow-500" />
                                    <span className={`text-sm font-bold ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}>
                                        {stats.mostPopularReview.ratingCount}
                                    </span>
                                </div>
                            </div>
                            <a
                                href={`/analytics?reviewId=${stats.mostPopularReview.review.id}`}
                                className={`flex items-center gap-1 text-xs font-medium transition-colors ${
                                    theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
                                }`}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <ExternalLink size={12} />
                                Открыть разбор
                            </a>
                        </>
                    ) : (
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Нет данных за сегодня</p>
                    )}
                </div>
            )
        },
        {
            label: 'Разборов за сегодня',
            icon: <BarChart3 className="w-5 h-5 text-blue-400" />,
            tone: 'blue',
            bgClass: 'bg-blue-500/5',
            borderClass: 'border-blue-500/20',
            content: (
                <div className="flex items-center justify-between">
                    <div className={`text-3xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {todayReviews.length}
                    </div>
                    <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        за {formatDate(new Date(), 'dd.MM.yyyy')}
                    </div>
                </div>
            )
        }
    ]

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((item, idx) => (
                <div
                    key={idx}
                    className={`relative overflow-hidden rounded-2xl p-5 border transition-all duration-300 hover:shadow-lg group ${theme === 'dark'
                        ? `${item.bgClass} ${item.borderClass} hover:border-opacity-50`
                        : 'bg-white border-gray-100 hover:border-blue-500/20'
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
                    {item.content}
                </div>
            ))}
        </div>
    )
}
