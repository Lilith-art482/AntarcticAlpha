import { useThemeStore } from '@/store/themeStore'
import { useAdminStore } from '@/store/adminStore'
import { useAuthStore } from '@/store/authStore'
import { AnalyticsReview } from '@/types'
import { deleteAnalyticsReview, updateAnalyticsReview } from '@/services/analyticsService'
import { UserNickname } from '@/components/UserNickname'
import { Edit, Trash2, ExternalLink, Share, Check, XCircle, RotateCcw } from 'lucide-react'
import { formatDate } from '@/utils/dateUtils'
import { SLOT_CATEGORY_META, SlotCategory } from '@/types'
import { useEffect, useState } from 'react'
import Avatar from '@/components/Avatar'
import { RatingDisplay } from './RatingDisplay'

interface AnalyticsTableProps {
    reviews: AnalyticsReview[]
    onEdit: (review: AnalyticsReview) => void
}

export const CountdownTimer = ({ deadline }: { deadline: string }) => {
    const calculateTimeLeft = () => {
        const difference = +new Date(deadline) - +new Date()
        let timeLeft = {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0
        }

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            }
        }
        return timeLeft
    }

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft())
        }, 1000)

        return () => clearTimeout(timer)
    })

    const { days, hours, minutes, seconds } = timeLeft

    return (
        <span>
            {days > 0 && `${days}д `}
            {hours.toString().padStart(2, '0')}:
            {minutes.toString().padStart(2, '0')}:
            {seconds.toString().padStart(2, '0')}
        </span>
    )
}

export const getDeadlineColor = (deadline: string) => {
    const difference = +new Date(deadline) - +new Date()
    const hours = difference / (1000 * 60 * 60)

    if (hours < 24) return 'text-red-500'
    if (hours < 48) return 'text-yellow-500'
    if (hours < 72) return 'text-[#4C7F6E]'
    return 'text-gray-500'
}

export const AnalyticsTable = ({ reviews, onEdit }: AnalyticsTableProps) => {
    const { theme } = useThemeStore()
    const { isAdmin } = useAdminStore()
    const { user } = useAuthStore()

    const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
    const subTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500'

    const handleCopyLink = (reviewId: string) => {
        const link = `${window.location.origin}/lab?reviewId=${reviewId}`
        navigator.clipboard.writeText(link)
            .then(() => {
                console.log('Ссылка скопирована!', link)
            })
            .catch(err => {
                console.error('Не удалось скопировать ссылку: ', err)
            })
    }

    const canEdit = (review: AnalyticsReview) => {
        // Если разбор закрыт, редактирование запрещено
        if (review.closed) return false
        if (isAdmin) return true
        if (user?.id !== review.createdBy) return false

        const createdAt = new Date(review.createdAt).getTime()
        const now = new Date().getTime()
        return (now - createdAt) < 30 * 60 * 1000
    }

    const canCloseReview = (review: AnalyticsReview) => {
        // Закрыть разбор может автор или администратор, только если разбор еще не закрыт
        return !review.closed && (isAdmin || user?.id === review.createdBy)
    }

    const canReopenReview = (review: AnalyticsReview) => {
        // Переоткрыть разбор может только администратор
        return review.closed && isAdmin
    }

    const handleCloseReview = async (review: AnalyticsReview, outcome: 'success' | 'failure') => {
        if (confirm(`Вы уверены, что хотите закрыть разбор как ${outcome === 'success' ? 'удачный' : 'неудачный'}?`)) {
            await updateAnalyticsReview(review.id, {
                closed: true,
                closedAt: new Date().toISOString(),
                outcome: outcome
            })
        }
    }

    const handleReopenReview = async (review: AnalyticsReview) => {
        if (confirm('Вы уверены, что хотите переоткрыть этот разбор? Он снова станет актуальным с дедлайном.')) {
            await updateAnalyticsReview(review.id, {
                closed: false,
                closedAt: undefined,
                outcome: undefined
            })
        }
    }

    const handleChangeOutcome = async (review: AnalyticsReview, newOutcome: 'success' | 'failure') => {
        if (confirm(`Вы уверены, что хотите изменить результат на ${newOutcome === 'success' ? 'удачный' : 'неудачный'}?`)) {
            await updateAnalyticsReview(review.id, {
                outcome: newOutcome
            })
        }
    }

    const handleDelete = async (id: string) => {
        if (confirm('Вы уверены, что хотите удалить этот обзор?')) {
            await deleteAnalyticsReview(id)
        }
    }

    if (reviews.length === 0) {
        return (
            <div className={`p-10 text-center rounded-2xl border border-dashed ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'}`}>
                <p className={subTextColor}>Аналитических обзоров в этой сфере не найдено.</p>
            </div>
        )
    }

    return (
        <div className={`rounded-2xl ${theme === 'dark' ? 'bg-[#0b1015]' : 'bg-white'} overflow-hidden border ${theme === 'dark' ? 'border-white/5' : 'border-gray-100 shadow-sm'}`}>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className={theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}>
                            <th className={`p-4 text-center text-[10px] font-bold uppercase tracking-wider ${subTextColor} w-32`}>Сфера</th>
                            <th className={`p-4 text-center text-[10px] font-bold uppercase tracking-wider ${subTextColor} w-24`}>Актив</th>
                            <th className={`p-4 text-center text-[10px] font-bold uppercase tracking-wider ${subTextColor}`}>Комментарий эксперта</th>
                            <th className={`p-4 text-center text-[10px] font-bold uppercase tracking-wider ${subTextColor}`}>Важные детали</th>
                            <th className={`p-4 text-center text-[10px] font-bold uppercase tracking-wider ${subTextColor} w-32`}>Статус</th>
                            <th className={`p-4 text-center text-[10px] font-bold uppercase tracking-wider ${subTextColor} w-24`}>Ссылки</th>
                            <th className={`p-4 text-center text-[10px] font-bold uppercase tracking-wider ${subTextColor} w-32`}>Эксперт</th>
                            <th className={`p-4 text-center text-[10px] font-bold uppercase tracking-wider ${subTextColor} w-24`}>Оценка</th>
                            <th className={`p-4 text-center text-[10px] font-bold uppercase tracking-wider ${subTextColor} w-24`}>Действия</th>
                        </tr>
                    </thead>
                    <tbody className={`divide-y ${theme === 'dark' ? 'divide-white/5' : 'divide-gray-100'}`}>
                        {reviews.map((review) => {
                            const isClosed = review.closed === true
                            return (
                                <tr key={review.id} className={`hover:bg-[#4C7F6E]/5 transition-colors group ${isClosed ? 'opacity-75' : ''}`}>
                                    <td className="p-4 align-top text-center">
                                        <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider border ${theme === 'dark' ? 'bg-[#4C7F6E]/10 border-[#4C7F6E]/20 text-[#4C7F6E]' : 'bg-[#4C7F6E]/10 border-[#4C7F6E]/20 text-[#4C7F6E]'}`}>
                                            {SLOT_CATEGORY_META[review.sphere as SlotCategory]?.label || review.sphere}
                                        </span>
                                    </td>
                                    <td className={`p-4 align-top text-center text-sm font-bold ${headingColor}`}>
                                        {review.asset || '-'}
                                    </td>
                                    <td className={`p-4 align-top text-center text-sm font-medium ${headingColor} whitespace-pre-wrap max-w-sm`}>
                                        {review.expertComment}
                                    </td>
                                    <td className={`p-4 align-top text-center text-sm ${subTextColor} whitespace-pre-wrap max-w-sm`}>
                                        {review.importantDetails}
                                    </td>
                                    <td className={`p-4 align-top text-center text-xs font-bold`}>
                                        {isClosed && review.closedAt ? (
                                            <div className={`flex flex-col items-center gap-1 ${review.outcome === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                                                <span className="font-bold">
                                                    {review.outcome === 'success' ? '✓ Удачно' : '✗ Неудачно'}
                                                </span>
                                                <span className="text-[10px] font-medium">
                                                    {formatDate(new Date(review.closedAt), 'dd.MM HH:mm')}
                                                </span>
                                            </div>
                                        ) : review.deadline ? (
                                            <div className="flex flex-col items-center gap-1">
                                                <span className="text-[#4C7F6E]">Актуален</span>
                                                <span className={getDeadlineColor(review.deadline)}>
                                                    <CountdownTimer deadline={review.deadline} />
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-gray-500">-</span>
                                        )}
                                    </td>
                                    <td className="p-4 align-top text-center">
                                        {review.links && review.links.length > 0 && (
                                            <div className="flex justify-center gap-1">
                                                {review.links.map((link, idx) => {
                                                    const parts = link.split(' - ')
                                                    const url = parts[0]
                                                    const title = parts[1] || 'Ссылка'
                                                    return (
                                                        <a
                                                            key={idx}
                                                            href={url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-all"
                                                            title={title}
                                                        >
                                                            <ExternalLink className="w-3.5 h-3.5" />
                                                        </a>
                                                    )
                                                })}
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-4 align-top text-center">
                                        <div className="flex items-center gap-2 justify-center">
                                            <Avatar userId={review.createdBy} size="sm" />
                                            <UserNickname userId={review.createdBy} className={`text-sm font-bold ${headingColor}`} />
                                        </div>
                                    </td>
                                    <td className="p-4 align-top text-center">
                                        <RatingDisplay ratings={review.ratings} theme={theme} />
                                    </td>
                                    <td className="p-4 align-top text-center">
                                        <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {canCloseReview(review) && (
                                                <>
                                                    <button
                                                        onClick={() => handleCloseReview(review, 'success')}
                                                        className="p-1.5 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-all"
                                                        title="Закрыть как удачный"
                                                    >
                                                        <Check className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleCloseReview(review, 'failure')}
                                                        className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all"
                                                        title="Закрыть как неудачный"
                                                    >
                                                        <XCircle className="w-3.5 h-3.5" />
                                                    </button>
                                                </>
                                            )}
                                            {canReopenReview(review) && (
                                                <>
                                                    <button
                                                        onClick={() => handleChangeOutcome(review, 'success')}
                                                        className="p-1.5 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-all"
                                                        title="Изменить на удачный"
                                                    >
                                                        <Check className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleChangeOutcome(review, 'failure')}
                                                        className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all"
                                                        title="Изменить на неудачный"
                                                    >
                                                        <XCircle className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleReopenReview(review)}
                                                        className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-all"
                                                        title="Переоткрыть разбор"
                                                    >
                                                        <RotateCcw className="w-3.5 h-3.5" />
                                                    </button>
                                                </>
                                            )}
                                            <button
                                                onClick={() => handleCopyLink(review.id)}
                                                className="p-1.5 rounded-lg bg-[#4C7F6E]/10 text-[#4C7F6E] hover:bg-[#4C7F6E]/20 transition-all"
                                                title="Копировать ссылку"
                                            >
                                                <Share className="w-3.5 h-3.5" />
                                            </button>
                                            {canEdit(review) && (
                                                <button
                                                    onClick={() => onEdit(review)}
                                                    className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-all"
                                                    title="Редактировать"
                                                >
                                                    <Edit className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                            {(isAdmin || user?.id === review.createdBy) && (
                                                <button
                                                    onClick={() => handleDelete(review.id)}
                                                    className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition-all"
                                                    title="Удалить"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}