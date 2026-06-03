import { useState } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAdminStore } from '@/store/adminStore'
import { useAuthStore } from '@/store/authStore'
import { AnalyticsReview } from '@/types'
import { deleteAnalyticsReview, updateAnalyticsReview } from '@/services/analyticsService'
import { UserNickname } from '@/components/UserNickname'
import { Edit, Trash2, Share, X, Check, XCircle, RotateCcw, Image as ImageIcon } from 'lucide-react'
import { formatDate } from '@/utils/dateUtils'
import { SLOT_CATEGORY_META, SlotCategory } from '@/types'
import Avatar from '@/components/Avatar'
import { CountdownTimer, getDeadlineColor } from '@/components/Analytics/AnalyticsTable'
import { RatingDisplay } from './RatingDisplay'

interface AnalyticsCardsProps {
    reviews: AnalyticsReview[]
    isArchive: boolean
    onEdit: (review: AnalyticsReview) => void
    onView: (id: string) => void
}

export const AnalyticsCards = ({ reviews, isArchive, onEdit, onView }: AnalyticsCardsProps) => {
    const { theme } = useThemeStore()
    const { isAdmin } = useAdminStore()
    const { user } = useAuthStore()
    const [screenshotModal, setScreenshotModal] = useState<string | null>(null)

    const cardBg = theme === 'dark' ? 'bg-[#0f141a]' : 'bg-white'
    const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
    const subTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
    const borderColor = theme === 'dark' ? 'border-white/10' : 'border-gray-200'

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
        // В архиве редактирование запрещено для всех
        if (isArchive) return false
        // Если разбор закрыт, редактирование запрещено
        if (review.closed) return false
        // Админ может редактировать всё
        if (isAdmin) return true
        // Автор может редактировать свои обзоры без ограничений по времени
        if (user?.id === review.createdBy) return true
        return false
    }

    const canDelete = (review: AnalyticsReview) => {
        // В архиве удалять может только администратор
        if (isArchive) return isAdmin
        // В активных карточках админ или автор могут удалять
        return isAdmin || user?.id === review.createdBy
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

    const isClosed = (review: AnalyticsReview) => review.closed === true

    if (reviews.length === 0) {
        return (
            <div className={`p-10 text-center rounded-2xl border border-dashed ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'}`}>
                <p className={subTextColor}>Аналитических обзоров в этой сфере не найдено.</p>
            </div>
        )
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reviews.map((review) => {
                    const closed = isClosed(review)
                    return (
                        <div
                            key={review.id}
                            onClick={() => onView(review.id)}
                            className={`${cardBg} rounded-2xl p-4 md:p-5 pt-14 md:pt-12 border ${borderColor} shadow-lg transition-all hover:shadow-xl cursor-pointer relative ${closed ? 'opacity-75' : ''}`}
                        >
                            <div className="absolute top-3 left-4 right-4 flex items-center justify-between bg-transparent z-10">
                                <div className="flex items-center gap-2">
                                    {review.number && (
                                        <span className={`text-xs font-black px-2 py-1 rounded-lg ${theme === 'dark' ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                                            #{review.number}
                                        </span>
                                    )}
                                    {closed && (
                                        <span className={`text-xs font-black px-2 py-1 rounded-lg ${review.outcome === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                            {review.outcome === 'success' ? '✓ Удачно' : '✗ Неудачно'}
                                        </span>
                                    )}
                                </div>
                                {/* Кнопки действий - крупнее для мобильных */}
                                <div className="flex items-center gap-1 sm:gap-0.5">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleCopyLink(review.id) }}
                                        className="p-2 sm:p-1.5 rounded-lg text-gray-400 hover:bg-white/10 transition-all touch-manipulation"
                                        title="Копировать ссылку"
                                    >
                                        <Share className="w-4 h-4" />
                                    </button>
                                    {canCloseReview(review) && (
                                        <>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleCloseReview(review, 'success')
                                                }}
                                                className="p-2 sm:p-1.5 rounded-lg text-green-500 hover:bg-green-500/20 transition-all touch-manipulation"
                                                title="Закрыть как удачный"
                                            >
                                                <Check className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleCloseReview(review, 'failure')
                                                }}
                                                className="p-2 sm:p-1.5 rounded-lg text-red-500 hover:bg-red-500/20 transition-all touch-manipulation"
                                                title="Закрыть как неудачный"
                                            >
                                                <XCircle className="w-4 h-4" />
                                            </button>
                                        </>
                                    )}
                                    {canReopenReview(review) && (
                                        <>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleChangeOutcome(review, 'success')
                                                }}
                                                className="p-2 sm:p-1.5 rounded-lg text-green-500 hover:bg-green-500/20 transition-all touch-manipulation"
                                                title="Изменить на удачный"
                                            >
                                                <Check className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleChangeOutcome(review, 'failure')
                                                }}
                                                className="p-2 sm:p-1.5 rounded-lg text-red-500 hover:bg-red-500/20 transition-all touch-manipulation"
                                                title="Изменить на неудачный"
                                            >
                                                <XCircle className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleReopenReview(review)
                                                }}
                                                className="p-2 sm:p-1.5 rounded-lg text-blue-500 hover:bg-blue-500/20 transition-all touch-manipulation"
                                                title="Переоткрыть разбор"
                                            >
                                                <RotateCcw className="w-4 h-4" />
                                            </button>
                                        </>
                                    )}
                                    {review.screenshots && review.screenshots.length > 0 && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setScreenshotModal(review.screenshots![0])
                                            }}
                                            className="p-2 sm:p-1.5 rounded-lg text-gray-400 hover:bg-white/10 transition-all touch-manipulation"
                                            title="Открыть скриншот"
                                        >
                                            <ImageIcon className="w-4 h-4" />
                                        </button>
                                    )}
                                    {canEdit(review) && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onEdit(review) }}
                                            className="p-2 sm:p-1.5 rounded-lg text-gray-400 hover:bg-white/10 transition-all touch-manipulation"
                                            title="Редактировать"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                    )}
                                    {canDelete(review) && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDelete(review.id) }}
                                            className="p-2 sm:p-1.5 rounded-lg text-gray-400 hover:bg-white/10 transition-all touch-manipulation"
                                            title="Удалить"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 mb-4">
                                <span className={`text-[10px] px-2 py-1 rounded-lg font-bold uppercase tracking-wider border bg-[#4C7F6E]/10 border-[#4C7F6E]/20 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                    {SLOT_CATEGORY_META[review.sphere as SlotCategory]?.label || review.sphere}
                                </span>
                            </div>

                            {review.asset && (
                                <div className="mb-3">
                                    <div className="flex items-center justify-between">
                                        <span className={`text-lg font-black tracking-tight ${textColor}`}>
                                            {review.asset}
                                        </span>
                                        {review.currentPrice && (
                                            <span className="text-sm font-bold px-2 py-1 rounded-lg bg-[#4C7F6E]/20 text-[#4C7F6E]">
                                                ${review.currentPrice}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Для Polymarket - отображение названия события */}
                            {review.eventName && (
                                <div className="mb-3">
                                    <div className="flex items-center justify-between">
                                        <span className={`text-lg font-black tracking-tight ${textColor}`}>
                                            {review.eventName}
                                        </span>
                                        {review.prediction && (
                                            <span className={`text-sm font-bold px-2 py-1 rounded-lg ${
                                                review.prediction === 'yes' 
                                                    ? 'bg-emerald-500/20 text-emerald-500' 
                                                    : 'bg-rose-500/20 text-rose-500'
                                            }`}>
                                                {review.prediction.toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="mb-4">
                                <RatingDisplay ratings={review.ratings} theme={theme} />
                            </div>

                            <div className="flex items-center justify-between border-t border-b py-3 mb-4">
                                <div className="flex items-center gap-2">
                                    <Avatar userId={review.createdBy} size="sm" />
                                    <UserNickname userId={review.createdBy} className={`text-sm font-bold ${textColor}`} />
                                </div>
                                {closed && review.closedAt ? (
                                    <div className={`text-right ${review.outcome === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                                        <div className="text-xs font-bold">
                                            Неактуален
                                        </div>
                                        <div className="text-[10px] font-medium">
                                            {formatDate(new Date(review.closedAt), 'dd.MM.yyyy HH:mm')}
                                        </div>
                                    </div>
                                ) : review.deadline ? (
                                    <div className={`text-right ${getDeadlineColor(review.deadline)}`}>
                                        <div className="text-xs font-bold">
                                            Актуален
                                        </div>
                                        <div className="text-xs font-bold">
                                            {formatDate(new Date(review.deadline), 'dd.MM.yyyy HH:mm')}
                                        </div>
                                        <div className="text-[10px] font-medium">
                                            <CountdownTimer deadline={review.deadline} />
                                        </div>
                                        {review.extensionCount && review.extensionCount > 0 && (
                                            <div className="text-[10px] font-medium text-amber-500 mt-1">
                                                Продлён: {review.extensionCount} раз
                                            </div>
                                        )}
                                    </div>
                                ) : null}
                            </div>

                            {/* Предупреждение о проверке актуальности */}
                            {!closed && review.extensionCount && review.extensionCount > 0 && (
                                <div className={`mb-3 p-2 rounded-lg border ${theme === 'dark' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
                                    <div className="text-[10px] font-bold uppercase tracking-wider mb-1">⚠️ Важно</div>
                                    <div className="text-[10px] leading-tight">
                                        Перед входом в позицию проверьте актуальность вручную и сравните цели
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Screenshot Modal */}
            {screenshotModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={() => setScreenshotModal(null)}
                >
                    <div
                        className="relative max-w-7xl w-full max-h-[90vh] flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={screenshotModal}
                            alt="Скриншот"
                            className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
                        />
                        <button
                            onClick={() => setScreenshotModal(null)}
                            className="absolute top-4 right-4 p-3 rounded-xl bg-black/50 text-white hover:bg-black/70 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}
