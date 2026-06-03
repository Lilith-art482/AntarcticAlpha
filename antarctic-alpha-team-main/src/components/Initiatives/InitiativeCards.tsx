import { useState } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAdminStore } from '@/store/adminStore'
import { useAuthStore } from '@/store/authStore'
import { Initiative, voteForInitiative, removeVoteFromInitiative, updateInitiative } from '@/services/initiativesService'
import { UserNickname } from '@/components/UserNickname'
import { Edit, Trash2, Share, X, XCircle, RotateCcw, Pause, Play, Image as ImageIcon } from 'lucide-react'
import Avatar from '@/components/Avatar'
import { useUsers } from '@/hooks/useUsers'

interface InitiativeCardsProps {
    initiatives: Initiative[]
    isArchive: boolean
    isImplemented: boolean
    onEdit: (initiative: Initiative) => void
    onView: (id: string) => void
}

export const InitiativeCards = ({ initiatives, isArchive, isImplemented, onEdit, onView }: InitiativeCardsProps) => {
    const { theme } = useThemeStore()
    const { isAdmin } = useAdminStore()
    const { user } = useAuthStore()
    const { users } = useUsers()
    const [screenshotModal, setScreenshotModal] = useState<string | null>(null)

    const cardBg = theme === 'dark' ? 'bg-[#0f141a]' : 'bg-white'
    const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
    const subTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
    const borderColor = theme === 'dark' ? 'border-white/10' : 'border-gray-200'

    const totalTeamMembers = users.length || 1

    const handleCopyLink = (initiativeId: string) => {
        const link = `${window.location.origin}/initiatives?initiativeId=${initiativeId}`
        navigator.clipboard.writeText(link)
            .then(() => {
                console.log('Ссылка скопирована!', link)
            })
            .catch(err => {
                console.error('Не удалось скопировать ссылку: ', err)
            })
    }

    const canVote = (initiative: Initiative) => {
        return initiative.status === 'voting' && user && !isArchive && !isImplemented
    }

    const hasVoted = (initiative: Initiative) => {
        if (!user) return false
        return initiative.votes.some(v => v.userId === user.id)
    }

    const getUserVote = (initiative: Initiative) => {
        if (!user) return null
        return initiative.votes.find(v => v.userId === user.id)?.vote || null
    }

    const handleVote = async (initiative: Initiative, vote: 'for' | 'against') => {
        if (!user) return
        try {
            await voteForInitiative(initiative.id, user.id, vote)
        } catch (error) {
            console.error('Ошибка при голосовании:', error)
        }
    }

    const handleRemoveVote = async (initiative: Initiative) => {
        if (!user) return
        try {
            await removeVoteFromInitiative(initiative.id, user.id)
        } catch (error) {
            console.error('Ошибка при удалении голоса:', error)
        }
    }

    const handleReject = async (initiative: Initiative) => {
        if (confirm('Вы уверены, что хотите отклонить эту инициативу?')) {
            await updateInitiative(initiative.id, { status: 'refused_dm' })
        }
    }

    const handlePause = async (initiative: Initiative) => {
        await updateInitiative(initiative.id, { status: 'pause_dm' })
    }

    const handleResume = async (initiative: Initiative) => {
        await updateInitiative(initiative.id, { status: 'voting' })
    }

    const handleDelete = async (id: string) => {
        if (confirm('Вы уверены, что хотите удалить эту инициативу?')) {
            await updateInitiative(id, { status: 'archived', archivedAt: new Date().toISOString() })
        }
    }

    const getStatusConfig = (status: string) => {
        const configs = {
            voting: { label: 'Голосование', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
            accepted: { label: 'Принято', color: 'bg-green-500/10 text-green-500 border-green-500/20' },
            rejected: { label: 'Не принято', color: 'bg-red-500/10 text-red-500 border-red-500/20' },
            pause_dm: { label: 'Пауза DM', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
            refused_dm: { label: 'Отказ DM', color: 'bg-red-500/10 text-red-500 border-red-500/20' },
            implemented: { label: 'Реализовано', color: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
            archived: { label: 'Архив', color: 'bg-gray-500/10 text-gray-500 border-gray-500/20' }
        }
        return configs[status as keyof typeof configs] || configs.voting
    }

    const getDeadlineInfo = (initiative: Initiative) => {
        if (initiative.status !== 'voting' || !initiative.votingEndsAt) return null

        const now = new Date().getTime()
        const endTime = new Date(initiative.votingEndsAt).getTime()
        const diff = endTime - now

        if (diff <= 0) return null

        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)

        return { hours, minutes, seconds }
    }

    const CountdownTimer = ({ initiative }: { initiative: Initiative }) => {
        const [, setTick] = useState(0)

        const deadline = getDeadlineInfo(initiative)
        if (!deadline) return null

        // Обновляем каждую секунду
        useState(() => {
            const interval = setInterval(() => {
                setTick(t => t + 1)
            }, 1000)
            return () => clearInterval(interval)
        })

        return (
            <div className="flex items-center gap-1 text-xs font-mono">
                <span className="text-[#4C7F6E]">{String(deadline.hours).padStart(2, '0')}</span>:
                <span className="text-[#4C7F6E]">{String(deadline.minutes).padStart(2, '0')}</span>:
                <span className="text-[#4C7F6E]">{String(deadline.seconds).padStart(2, '0')}</span>
            </div>
        )
    }

    if (initiatives.length === 0) {
        return (
            <div className={`p-10 text-center rounded-2xl border border-dashed ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'}`}>
                <p className={subTextColor}>Инициатив не найдено.</p>
            </div>
        )
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {initiatives.map((initiative) => {
                    const statusConfig = getStatusConfig(initiative.status)
                    const votesFor = initiative.votes.filter(v => v.vote === 'for').length
                    const votesAgainst = initiative.votes.filter(v => v.vote === 'against').length
                    const totalVotes = votesFor + votesAgainst
                    const voteProgress = totalTeamMembers > 0 ? (totalVotes / totalTeamMembers) * 100 : 0
                    const userVote = getUserVote(initiative)
                    const voted = hasVoted(initiative)

                    return (
                        <div
                            key={initiative.id}
                            onClick={() => onView(initiative.id)}
                            className={`${cardBg} rounded-2xl p-5 pt-12 border ${borderColor} shadow-lg transition-all hover:shadow-xl cursor-pointer relative`}
                        >
                            {/* Верхняя строка: номер и кнопки админа */}
                            <div className="absolute top-4 left-5 right-5 flex items-center justify-between bg-transparent z-10">
                                <span className={`text-xs font-black px-2 py-1 rounded-lg ${theme === 'dark' ? 'bg-[#4C7F6E]/20 text-[#4C7F6E]' : 'bg-[#4C7F6E]/10 text-[#4C7F6E]'}`}>
                                    #{initiative.number}
                                </span>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleCopyLink(initiative.id) }}
                                        className="p-1.5 rounded-lg text-gray-400 hover:bg-white/10 transition-all"
                                        title="Поделиться"
                                    >
                                        <Share className="w-4 h-4" />
                                    </button>
                                    {isAdmin && !isArchive && !isImplemented && (
                                        <>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleReject(initiative) }}
                                                className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/20 transition-all"
                                                title="Отклонить"
                                            >
                                                <XCircle className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onEdit(initiative) }}
                                                className="p-1.5 rounded-lg text-gray-400 hover:bg-white/10 transition-all"
                                                title="Редактировать"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            {initiative.status === 'voting' ? (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handlePause(initiative) }}
                                                    className="p-1.5 rounded-lg text-amber-500 hover:bg-amber-500/20 transition-all"
                                                    title="Заблокировать голосование"
                                                >
                                                    <Pause className="w-4 h-4" />
                                                </button>
                                            ) : initiative.status === 'pause_dm' ? (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleResume(initiative) }}
                                                    className="p-1.5 rounded-lg text-green-500 hover:bg-green-500/20 transition-all"
                                                    title="Возобновить голосование"
                                                >
                                                    <Play className="w-4 h-4" />
                                                </button>
                                            ) : null}
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDelete(initiative.id) }}
                                                className="p-1.5 rounded-lg text-gray-400 hover:bg-white/10 transition-all"
                                                title="Удалить"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </>
                                    )}
                                    {isAdmin && isArchive && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleResume(initiative) }}
                                            className="p-1.5 rounded-lg text-green-500 hover:bg-green-500/20 transition-all"
                                            title="Возобновить голосование"
                                        >
                                            <RotateCcw className="w-4 h-4" />
                                        </button>
                                    )}
                                    {initiative.screenshots && initiative.screenshots.length > 0 && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setScreenshotModal(initiative.screenshots[0])
                                            }}
                                            className="p-1.5 rounded-lg text-gray-400 hover:bg-white/10 transition-all"
                                            title="Открыть скриншот"
                                        >
                                            <ImageIcon className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Статус и сфера */}
                            <div className="flex items-center justify-between mb-3">
                                <span className={`text-[10px] px-2 py-1 rounded-lg font-bold uppercase tracking-wider border ${statusConfig.color}`}>
                                    {statusConfig.label}
                                </span>
                                <span className={`text-[10px] px-2 py-1 rounded-lg font-bold uppercase tracking-wider border bg-[#4C7F6E]/10 border-[#4C7F6E]/20 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                    {initiative.sphere}
                                </span>
                            </div>

                            {/* Название */}
                            <h3 className={`text-lg font-black mb-3 ${textColor}`}>
                                {initiative.title}
                            </h3>

                            {/* Автор */}
                            <div className="flex items-center gap-2 mb-4">
                                <Avatar userId={initiative.createdBy} size="sm" />
                                <UserNickname userId={initiative.createdBy} className={`text-sm font-bold ${textColor}`} />
                            </div>

                            {/* Прогресс голосования */}
                            <div className="space-y-2 mb-4">
                                <div className="h-2 rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-[#4C7F6E] to-[#5a9a8a] rounded-full transition-all duration-500"
                                        style={{ width: `${voteProgress}%` }}
                                    />
                                </div>
                                <div className="text-xs text-center">
                                    <span className={subTextColor}>Проголосовало: </span>
                                    <span className={`font-bold ${textColor}`}>{totalVotes}/{totalTeamMembers}</span>
                                </div>
                            </div>

                            {/* Кнопки голосования */}
                            {canVote(initiative) && (
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            if (voted && userVote === 'for') {
                                                handleRemoveVote(initiative)
                                            } else {
                                                handleVote(initiative, 'for')
                                            }
                                        }}
                                        className={`flex-1 py-2 px-3 rounded-xl font-bold text-sm transition-all ${
                                            voted && userVote === 'for'
                                                ? 'bg-green-500 text-white'
                                                : theme === 'dark'
                                                    ? 'bg-white/10 text-gray-300 hover:bg-green-500/20'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-green-500/10'
                                        }`}
                                    >
                                        {voted && userVote === 'for' ? '✓ За' : 'За'}
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            if (voted && userVote === 'against') {
                                                handleRemoveVote(initiative)
                                            } else {
                                                handleVote(initiative, 'against')
                                            }
                                        }}
                                        className={`flex-1 py-2 px-3 rounded-xl font-bold text-sm transition-all ${
                                            voted && userVote === 'against'
                                                ? 'bg-red-500 text-white'
                                                : theme === 'dark'
                                                    ? 'bg-white/10 text-gray-300 hover:bg-red-500/20'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-red-500/10'
                                        }`}
                                    >
                                        {voted && userVote === 'against' ? '✗ Против' : 'Против'}
                                    </button>
                                </div>
                            )}

                            {/* Таймер дедлайна */}
                            {initiative.status === 'voting' && initiative.votingEndsAt && (
                                <div className={`mt-3 text-xs ${subTextColor}`}>
                                    <div>Окончание голосования:</div>
                                    <CountdownTimer initiative={initiative} />
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
