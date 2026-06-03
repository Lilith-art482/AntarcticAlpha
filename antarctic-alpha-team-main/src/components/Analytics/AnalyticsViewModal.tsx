import { useState } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { AnalyticsReview, SlotCategory } from '@/types'
import { addOrUpdateReviewRating, updateAnalyticsReview, deleteReviewRating } from '@/services/analyticsService'
import { X, ExternalLink, Edit, Check, XCircle, Maximize2, RotateCcw } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { SLOT_CATEGORY_META } from '@/types'
import { RatingDisplay } from './RatingDisplay'
import { RatingInput } from './RatingInput'
import { UserNickname } from '@/components/UserNickname'
import Avatar from '@/components/Avatar'
import { formatDate } from '@/utils/dateUtils'
import { useAdminStore } from '@/store/adminStore'

interface AnalyticsViewModalProps {
    isOpen: boolean
    onClose: () => void
    review: AnalyticsReview | null
    onEditFromView: (review: AnalyticsReview) => void
    onRatingSuccess: (reviewId: string) => void
    onReviewUpdated: (reviewId: string) => void
}

export const AnalyticsViewModal = ({ isOpen, onClose, review, onEditFromView, onRatingSuccess, onReviewUpdated }: AnalyticsViewModalProps) => {
    const { theme } = useThemeStore()
    const { user } = useAuthStore()
    const { isAdmin } = useAdminStore()
    const [loading, setLoading] = useState(false)
    const [screenshotModalOpen, setScreenshotModalOpen] = useState(false)

    if (!isOpen || !review) return null

    const handleRateReview = async (ratingValue: number) => {
        if (!user || !review?.id) return
        setLoading(true)
        try {
            await addOrUpdateReviewRating(review.id, user.id, ratingValue)
            console.log('Оценка успешно сохранена!')
            onRatingSuccess(review.id)
        } catch (error) {
            console.error('Ошибка при сохранении оценки:', error)
        } finally {
            setLoading(false)
        }
    }

    const canEditReview = (currentReview: AnalyticsReview) => {
        // Если разбор закрыт, редактирование запрещено
        if (currentReview.closed) return false
        if (isAdmin) return true
        if (user?.id !== currentReview.createdBy) return false

        const createdAt = new Date(currentReview.createdAt).getTime()
        const now = new Date().getTime()
        return (now - createdAt) < 30 * 60 * 1000
    }

    const canCloseReview = (currentReview: AnalyticsReview) => {
        // Закрыть разбор может автор или администратор, только если разбор еще не закрыт
        return !currentReview.closed && (isAdmin || user?.id === currentReview.createdBy)
    }

    const canReopenReview = (currentReview: AnalyticsReview) => {
        // Переоткрыть разбор может только администратор
        return currentReview.closed && isAdmin
    }

    const handleCloseReview = async (outcome: 'success' | 'failure') => {
        if (!review?.id) return
        if (confirm(`Вы уверены, что хотите закрыть разбор как ${outcome === 'success' ? 'удачный' : 'неудачный'}?`)) {
            try {
                await updateAnalyticsReview(review.id, {
                    closed: true,
                    closedAt: new Date().toISOString(),
                    outcome: outcome
                })
                console.log('Разбор успешно закрыт!')
                onReviewUpdated(review.id)
            } catch (error) {
                console.error('Ошибка при закрытии разбора:', error)
            }
        }
    }

    const handleReopenReview = async () => {
        if (!review?.id) return
        if (confirm('Вы уверены, что хотите переоткрыть этот разбор? Он снова станет актуальным с дедлайном.')) {
            try {
                await updateAnalyticsReview(review.id, {
                    closed: false,
                    closedAt: undefined,
                    outcome: undefined
                })
                console.log('Разбор успешно переоткрыт!')
                onReviewUpdated(review.id)
            } catch (error) {
                console.error('Ошибка при переоткрытии разбора:', error)
            }
        }
    }

    const handleChangeOutcome = async (newOutcome: 'success' | 'failure') => {
        if (!review?.id) return
        if (confirm(`Вы уверены, что хотите изменить результат на ${newOutcome === 'success' ? 'удачный' : 'неудачный'}?`)) {
            try {
                await updateAnalyticsReview(review.id, {
                    outcome: newOutcome
                })
                console.log('Результат успешно изменен!')
                onReviewUpdated(review.id)
            } catch (error) {
                console.error('Ошибка при изменении результата:', error)
            }
        }
    }

    const handleDeleteRating = async () => {
        if (!user || !review?.id) return
        if (!confirm('Вы уверены, что хотите удалить свою оценку?')) return

        try {
            await deleteReviewRating(review.id, user.id)
            console.log('Оценка успешно удалена!')
            onRatingSuccess(review.id)
        } catch (error) {
            console.error('Ошибка при удалении оценки:', error)
        }
    }

    const bgColor = theme === 'dark' ? 'bg-[#0f141a]' : 'bg-white'
    const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
    const subTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500'

    const userRating = review.ratings?.find((r: { userId: string; value: number }) => r.userId === user?.id)?.value || null
    const isClosed = review.closed === true

    const parsedLinks = review.links?.map((link: string) => {
        const parts = link.slice(-1) === '-' ? [link.slice(0, -1).trim()] : link.split(' - ')
        return { url: parts[0] || '', title: parts[1] || '' }
    }) || []

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className={`${bgColor} w-full max-w-2xl max-h-[calc(100vh-32px)] rounded-3xl overflow-hidden shadow-2xl border mt-4 mb-8 ${theme === 'dark' ? 'border-white/10' : 'border-gray-100'}`}>
                <div className="flex items-center justify-between p-6 border-b border-white/5 sticky top-0 bg-inherit z-10">
                    <div className="flex items-center gap-3">
                        <h2 className={`text-xl font-black tracking-tight ${textColor}`}>
                            Аналитический обзор
                        </h2>
                        {review.number && (
                            <span className={`text-xs font-black px-2 py-1 rounded-lg ${theme === 'dark' ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                                #{review.number}
                            </span>
                        )}
                        {isClosed && (
                            <span className={`text-xs font-black px-2 py-1 rounded-lg ${review.outcome === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                {review.outcome === 'success' ? '✓ Удачный' : '✗ Неудачный'}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {canCloseReview(review) && (
                            <>
                                <button
                                    onClick={() => handleCloseReview('success')}
                                    className="p-2 hover:bg-green-500/20 rounded-xl transition-colors"
                                    title="Закрыть как удачный"
                                >
                                    <Check className="w-5 h-5 text-green-500" />
                                </button>
                                <button
                                    onClick={() => handleCloseReview('failure')}
                                    className="p-2 hover:bg-red-500/20 rounded-xl transition-colors"
                                    title="Закрыть как неудачный"
                                >
                                    <XCircle className="w-5 h-5 text-red-500" />
                                </button>
                            </>
                        )}
                        {canReopenReview(review) && (
                            <>
                                <button
                                    onClick={() => handleChangeOutcome('success')}
                                    className="p-2 hover:bg-green-500/20 rounded-xl transition-colors"
                                    title="Изменить на удачный"
                                >
                                    <Check className="w-5 h-5 text-green-500" />
                                </button>
                                <button
                                    onClick={() => handleChangeOutcome('failure')}
                                    className="p-2 hover:bg-red-500/20 rounded-xl transition-colors"
                                    title="Изменить на неудачный"
                                >
                                    <XCircle className="w-5 h-5 text-red-500" />
                                </button>
                                <button
                                    onClick={handleReopenReview}
                                    className="p-2 hover:bg-blue-500/20 rounded-xl transition-colors"
                                    title="Переоткрыть разбор"
                                >
                                    <RotateCcw className="w-5 h-5 text-blue-500" />
                                </button>
                            </>
                        )}
                        {canEditReview(review) && (
                            <button
                                onClick={() => onEditFromView(review)}
                                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                                title="Редактировать"
                            >
                                <Edit className="w-5 h-5 text-gray-500" />
                            </button>
                        )}
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
                    {/* Скриншоты - полный, но уменьшенный */}
                    {review.screenshots && review.screenshots.length > 0 && (
                        <div className="space-y-1.5">
                            <div className="relative group cursor-pointer" onClick={() => setScreenshotModalOpen(true)}>
                                <img
                                    src={review.screenshots[0]}
                                    alt="Screenshot"
                                    className="w-full h-64 object-contain rounded-xl border border-white/10 bg-black/20"
                                />
                                <div className="absolute inset-0 bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Maximize2 className="w-8 h-8 text-white" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Автор и рейтинг */}
                    <div className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/5">
                        <div className="flex items-center gap-3">
                            <Avatar userId={review.createdBy} size="md" />
                            <div>
                                <UserNickname userId={review.createdBy} className={`text-sm font-bold ${textColor}`} />
                                <p className={`text-[10px] uppercase font-bold tracking-widest ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Автор обзора</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <RatingDisplay ratings={review.ratings} theme={theme} />
                            {user && user.id !== review.createdBy && (
                                <div className="flex items-center gap-2">
                                    <RatingInput
                                        currentRating={userRating}
                                        onRate={handleRateReview}
                                        theme={theme}
                                        disabled={loading}
                                    />
                                    {userRating && !loading && (
                                        <button
                                            onClick={handleDeleteRating}
                                            className="p-1 hover:bg-red-500/20 rounded-lg transition-colors"
                                            title="Удалить оценку"
                                        >
                                            <RotateCcw className="w-4 h-4 text-red-500" />
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Сфера */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#4C7F6E]">Сфера</label>
                        <div className="flex flex-wrap gap-2">
                            <span
                                className="px-3 py-1.5 rounded-lg text-sm font-medium bg-[#4C7F6E]/10 border border-[#4C7F6E]/20 text-white"
                            >
                                {SLOT_CATEGORY_META[review.sphere as SlotCategory]?.label || review.sphere}
                            </span>
                        </div>
                    </div>

                    {/* Актив */}
                    {review.asset && (
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#4C7F6E]">Актив</label>
                            <div className={`px-4 py-3 rounded-xl border border-white/10 bg-white/5 ${textColor} font-bold`}>
                                {review.asset}
                            </div>
                        </div>
                    )}

                    {/* Статус и дедлайн */}
                    {isClosed && review.closedAt ? (
                        <div className="space-y-1.5">
                            <label className={`text-[10px] uppercase font-bold tracking-widest ${review.outcome === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                                Неактуален
                            </label>
                            <div className={`px-4 py-3 rounded-xl border border-white/10 ${review.outcome === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                <div className="font-bold">
                                    {review.outcome === 'success' ? '✓ Удачный' : '✗ Неудачный'}
                                </div>
                                <div className="text-sm mt-1">
                                    Закрыт: {formatDate(new Date(review.closedAt), 'dd.MM.yyyy HH:mm')}
                                </div>
                            </div>
                        </div>
                    ) : review.deadline ? (
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#4C7F6E]">Актуален</label>
                            <div className={`px-4 py-3 rounded-xl border border-white/10 bg-white/5 ${textColor}`}>
                                <div className="font-bold">
                                    {formatDate(new Date(review.deadline), 'dd.MM.yyyy HH:mm')}
                                </div>
                                {review.extensionCount && review.extensionCount > 0 && (
                                    <div className="text-sm text-amber-500 mt-1">
                                        Продлён: {review.extensionCount} раз
                                    </div>
                                )}
                                {review.originalDeadline && (
                                    <div className="text-xs mt-1 opacity-70">
                                        Оригинальный дедлайн: {formatDate(new Date(review.originalDeadline), 'dd.MM.yyyy HH:mm')}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : null}

                    {/* Предупреждение о проверке актуальности */}
                    {!isClosed && review.extensionCount && review.extensionCount > 0 && (
                        <div className={`p-3 rounded-xl border ${theme === 'dark' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
                            <div className="text-xs font-bold uppercase tracking-wider mb-1">⚠️ Важно</div>
                            <div className="text-xs leading-relaxed">
                                Перед входом в позицию проверьте актуальность вручную и сравните цели. Дедлайн был автоматически продлён {review.extensionCount} раз.
                            </div>
                        </div>
                    )}

                    {/* Цена на момент разбора */}
                    {review.currentPrice && (
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#4C7F6E]">Цена на момент разбора</label>
                            <div className={`px-4 py-3 rounded-xl border border-white/10 bg-[#4C7F6E]/10 ${textColor} font-bold`}>
                                ${review.currentPrice}
                            </div>
                        </div>
                    )}

                    {/* Polymarket - Название события и прогноз */}
                    {review.eventName && (
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#4C7F6E]">Событие</label>
                            <div className={`px-4 py-3 rounded-xl border border-white/10 bg-white/5 ${textColor} font-bold`}>
                                {review.eventName}
                            </div>
                        </div>
                    )}

                    {/* Polymarket - Прогноз */}
                    {review.prediction && (
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#4C7F6E]">Прогноз</label>
                            <div className={`px-4 py-3 rounded-xl border border-white/10 font-bold ${
                                review.prediction === 'yes' 
                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                                    : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            }`}>
                                {review.prediction === 'yes' ? 'YES' : 'NO'}
                            </div>
                        </div>
                    )}

                    {/* Комментарий эксперта */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#4C7F6E]">Комментарий эксперта</label>
                        <div className={`px-4 py-3 rounded-xl border border-white/10 bg-white/5 ${textColor} whitespace-pre-wrap`}>
                            {review.expertComment}
                        </div>
                    </div>

                    {/* Стратегия */}
                    {review.strategy && (
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#4C7F6E]">Стратегия</label>
                            <div className={`px-4 py-3 rounded-xl border border-white/10 bg-white/5 ${textColor} whitespace-pre-wrap`}>
                                {review.strategy}
                            </div>
                        </div>
                    )}

                    {/* Важные детали */}
                    {review.importantDetails && (
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#4C7F6E]">Важные детали</label>
                            <div className={`px-4 py-3 rounded-xl border border-white/10 bg-white/5 ${textColor} whitespace-pre-wrap`}>
                                {review.importantDetails}
                            </div>
                        </div>
                    )}

                    {/* Ссылки */}
                    {parsedLinks.length > 0 && (
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#4C7F6E]">Ссылки</label>
                            <div className="space-y-2">
                                {parsedLinks.map((link: { url: string; title: string }, index: number) => (
                                    link.url && (
                                        <a
                                            key={index}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`flex items-center gap-2 px-4 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all ${textColor}`}
                                        >
                                            <ExternalLink className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium truncate">{link.title || 'Ссылка'}</div>
                                                <div className={`text-xs ${subTextColor} truncate`}>{link.url}</div>
                                            </div>
                                        </a>
                                    )
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Дата создания */}
                    <div className="pt-2">
                        <p className={`text-[10px] uppercase font-bold tracking-widest ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                            Создано: {format(parseISO(review.createdAt), 'dd.MM.yyyy HH:mm')}
                        </p>
                    </div>
                </div>
            </div>

            {/* Модальное окно для просмотра скриншота */}
            {screenshotModalOpen && review.screenshots && review.screenshots.length > 0 && (
                <div
                    className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={() => setScreenshotModalOpen(false)}
                >
                    <div
                        className={`relative max-w-7xl w-full max-h-[90vh] flex items-center justify-center`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={review.screenshots[0]}
                            alt="Screenshot"
                            className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
                        />
                        <button
                            onClick={() => setScreenshotModalOpen(false)}
                            className="absolute top-4 right-4 p-3 rounded-xl bg-black/50 text-white hover:bg-black/70 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
