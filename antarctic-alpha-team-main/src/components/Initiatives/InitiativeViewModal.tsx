import { useState, useEffect } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { useAdminStore } from '@/store/adminStore'
import { Initiative, voteForInitiative, removeVoteFromInitiative, updateInitiative } from '@/services/initiativesService'
import { X, Edit, Trash2, Share, Pause, Play, ExternalLink, Maximize2 } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import Avatar from '@/components/Avatar'
import { UserNickname } from '@/components/UserNickname'
import { useUsers } from '@/hooks/useUsers'

interface InitiativeViewModalProps {
    isOpen: boolean
    onClose: () => void
    initiative: Initiative | null
    onInitiativeUpdated?: (initiativeId: string) => void
}

export const InitiativeViewModal = ({ isOpen, onClose, initiative, onInitiativeUpdated }: InitiativeViewModalProps) => {
    const { theme } = useThemeStore()
    const { user } = useAuthStore()
    const { isAdmin } = useAdminStore()
    const { users } = useUsers()
    const [screenshotModalOpen, setScreenshotModalOpen] = useState<string | null>(null)
    const [, setTick] = useState(0)

    const totalTeamMembers = users.length || 1

    useEffect(() => {
        if (isOpen && initiative?.status === 'voting') {
            const interval = setInterval(() => {
                setTick(t => t + 1)
            }, 1000)
            return () => clearInterval(interval)
        }
    }, [isOpen, initiative?.status])

    if (!isOpen || !initiative) return null

    const handleVote = async (vote: 'for' | 'against') => {
        if (!user) return
        try {
            await voteForInitiative(initiative.id, user.id, vote)
            onInitiativeUpdated?.(initiative.id)
        } catch (error) {
            console.error('Ошибка при голосовании:', error)
        }
    }

    const handleRemoveVote = async () => {
        if (!user) return
        try {
            await removeVoteFromInitiative(initiative.id, user.id)
            onInitiativeUpdated?.(initiative.id)
        } catch (error) {
            console.error('Ошибка при удалении голоса:', error)
        }
    }

    const handleReject = async () => {
        if (confirm('Вы уверены, что хотите отклонить эту инициативу?')) {
            await updateInitiative(initiative.id, { status: 'refused_dm' })
            onInitiativeUpdated?.(initiative.id)
        }
    }

    const handlePause = async () => {
        await updateInitiative(initiative.id, { status: 'pause_dm' })
        onInitiativeUpdated?.(initiative.id)
    }

    const handleResume = async () => {
        await updateInitiative(initiative.id, { status: 'voting' })
        onInitiativeUpdated?.(initiative.id)
    }

    const handleDelete = async () => {
        if (confirm('Вы уверены, что хотите переместить эту инициативу в архив?')) {
            await updateInitiative(initiative.id, { status: 'archived', archivedAt: new Date().toISOString() })
            onInitiativeUpdated?.(initiative.id)
            onClose()
        }
    }

    const handleMarkImplemented = async () => {
        await updateInitiative(initiative.id, { status: 'implemented', implementedAt: new Date().toISOString() })
        onInitiativeUpdated?.(initiative.id)
    }

    const handleStatusChange = async (newStatus: Initiative['status']) => {
        if (confirm(`Вы уверены, что хотите изменить статус на "${newStatus}"?`)) {
            const updates: Partial<Initiative> = { status: newStatus }
            if (newStatus === 'implemented') {
                updates.implementedAt = new Date().toISOString()
            } else if (newStatus === 'archived') {
                updates.archivedAt = new Date().toISOString()
            }
            await updateInitiative(initiative.id, updates)
            onInitiativeUpdated?.(initiative.id)
        }
    }

    const canVote = initiative.status === 'voting' && user
    const userVote = initiative.votes.find(v => v.userId === user?.id)?.vote || null
    const hasVoted = userVote !== null

    const votesFor = initiative.votes.filter(v => v.vote === 'for').length
    const votesAgainst = initiative.votes.filter(v => v.vote === 'against').length
    const totalVotes = votesFor + votesAgainst
    const voteProgress = totalTeamMembers > 0 ? (totalVotes / totalTeamMembers) * 100 : 0

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

    const getDeadlineInfo = () => {
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

    const deadline = getDeadlineInfo()

    const parsedLinks = initiative.links?.map(link => {
        const parts = link.slice(-1) === '-' ? [link.slice(0, -1).trim()] : link.split(' - ')
        return { url: parts[0] || '', title: parts[1] || '' }
    }) || []

    const statusConfig = getStatusConfig(initiative.status)

    const bgColor = theme === 'dark' ? 'bg-[#0f141a]' : 'bg-white'
    const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
    const subTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500'

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className={`${bgColor} w-full max-w-2xl max-h-[calc(100vh-32px)] rounded-3xl overflow-hidden shadow-2xl border mt-4 mb-8 ${theme === 'dark' ? 'border-white/10' : 'border-gray-100'}`}>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/5 sticky top-0 bg-inherit z-10">
                    <div className="flex items-center gap-3">
                        <h2 className={`text-xl font-black tracking-tight ${textColor}`}>
                            Инициатива
                        </h2>
                        {initiative.number && (
                            <span className={`text-xs font-black px-2 py-1 rounded-lg ${theme === 'dark' ? 'bg-[#4C7F6E]/20 text-[#4C7F6E]' : 'bg-[#4C7F6E]/10 text-[#4C7F6E]'}`}>
                                #{initiative.number}
                            </span>
                        )}
                        <span className={`text-[10px] px-2 py-1 rounded-lg font-bold uppercase tracking-wider border ${statusConfig.color}`}>
                            {statusConfig.label}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => {
                                const link = `${window.location.origin}/initiatives?initiativeId=${initiative.id}`
                                navigator.clipboard.writeText(link)
                            }}
                            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                            title="Поделиться"
                        >
                            <Share className="w-5 h-5 text-gray-500" />
                        </button>
                        {isAdmin && (
                            <>
                                <div className="relative group">
                                    <button className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                                        <Edit className="w-5 h-5 text-gray-500" />
                                    </button>
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#0f141a] border border-white/10 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
                                        <div className="p-2 space-y-1">
                                            <button
                                                onClick={() => handleStatusChange('voting')}
                                                className="w-full px-3 py-2 text-left text-sm rounded-lg hover:bg-white/10 transition-all text-blue-500"
                                            >
                                                Голосование
                                            </button>
                                            <button
                                                onClick={() => handleStatusChange('accepted')}
                                                className="w-full px-3 py-2 text-left text-sm rounded-lg hover:bg-white/10 transition-all text-green-500"
                                            >
                                                Принято
                                            </button>
                                            <button
                                                onClick={() => handleStatusChange('rejected')}
                                                className="w-full px-3 py-2 text-left text-sm rounded-lg hover:bg-white/10 transition-all text-red-500"
                                            >
                                                Не принято
                                            </button>
                                            <button
                                                onClick={() => handleStatusChange('pause_dm')}
                                                className="w-full px-3 py-2 text-left text-sm rounded-lg hover:bg-white/10 transition-all text-amber-500"
                                            >
                                                Пауза DM
                                            </button>
                                            <button
                                                onClick={handleReject}
                                                className="w-full px-3 py-2 text-left text-sm rounded-lg hover:bg-white/10 transition-all text-red-500"
                                            >
                                                Отказ DM
                                            </button>
                                            <button
                                                onClick={handleMarkImplemented}
                                                className="w-full px-3 py-2 text-left text-sm rounded-lg hover:bg-white/10 transition-all text-purple-500"
                                            >
                                                Реализовано
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {initiative.status === 'voting' && (
                                    <>
                                        <button
                                            onClick={handlePause}
                                            className="p-2 hover:bg-amber-500/20 rounded-xl transition-colors"
                                            title="Заблокировать голосование"
                                        >
                                            <Pause className="w-5 h-5 text-amber-500" />
                                        </button>
                                    </>
                                )}
                                {initiative.status === 'pause_dm' && (
                                    <>
                                        <button
                                            onClick={handleResume}
                                            className="p-2 hover:bg-green-500/20 rounded-xl transition-colors"
                                            title="Возобновить голосование"
                                        >
                                            <Play className="w-5 h-5 text-green-500" />
                                        </button>
                                    </>
                                )}
                                <button
                                    onClick={handleDelete}
                                    className="p-2 hover:bg-red-500/20 rounded-xl transition-colors"
                                    title="Удалить"
                                >
                                    <Trash2 className="w-5 h-5 text-red-500" />
                                </button>
                            </>
                        )}
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
                    {/* Статус и сфера */}
                    <div className="flex items-center justify-between">
                        <span className={`text-[10px] px-2 py-1 rounded-lg font-bold uppercase tracking-wider border ${statusConfig.color}`}>
                            {statusConfig.label}
                        </span>
                        <span className={`text-[10px] px-2 py-1 rounded-lg font-bold uppercase tracking-wider border bg-[#4C7F6E]/10 border-[#4C7F6E]/20 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {initiative.sphere}
                        </span>
                    </div>

                    {/* Название */}
                    <h3 className={`text-2xl font-black ${textColor}`}>
                        {initiative.title}
                    </h3>

                    {/* Автор */}
                    <div className="flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-white/5">
                        <Avatar userId={initiative.createdBy} size="md" />
                        <div>
                            <UserNickname userId={initiative.createdBy} className={`text-sm font-bold ${textColor}`} />
                            <p className={`text-[10px] uppercase font-bold tracking-widest ${subTextColor}`}>Автор инициативы</p>
                        </div>
                    </div>

                    {/* Соавторы */}
                    {initiative.coauthors && initiative.coauthors.length > 0 && (
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#4C7F6E]">
                                Соавторы ({initiative.coauthors.length})
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {initiative.coauthors.map((coauthorId) => (
                                    <div key={coauthorId} className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/5">
                                        <Avatar userId={coauthorId} size="sm" />
                                        <UserNickname userId={coauthorId} className={`text-sm font-bold ${textColor}`} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Прогресс голосования */}
                    <div className="space-y-2 p-4 rounded-xl border border-white/5 bg-white/5">
                        <div className="h-3 rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden">
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
                    {canVote && (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => hasVoted && userVote === 'for' ? handleRemoveVote() : handleVote('for')}
                                className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all ${
                                    hasVoted && userVote === 'for'
                                        ? 'bg-green-500 text-white'
                                        : theme === 'dark'
                                            ? 'bg-white/10 text-gray-300 hover:bg-green-500/20'
                                            : 'bg-gray-100 text-gray-600 hover:bg-green-500/10'
                                }`}
                            >
                                {hasVoted && userVote === 'for' ? '✓ За' : 'За'}
                            </button>
                            <button
                                onClick={() => hasVoted && userVote === 'against' ? handleRemoveVote() : handleVote('against')}
                                className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all ${
                                    hasVoted && userVote === 'against'
                                        ? 'bg-red-500 text-white'
                                        : theme === 'dark'
                                            ? 'bg-white/10 text-gray-300 hover:bg-red-500/20'
                                            : 'bg-gray-100 text-gray-600 hover:bg-red-500/10'
                                }`}
                            >
                                {hasVoted && userVote === 'against' ? '✗ Против' : 'Против'}
                            </button>
                        </div>
                    )}

                    {/* Таймер дедлайна */}
                    {initiative.status === 'voting' && initiative.votingEndsAt && deadline && (
                        <div className="p-4 rounded-xl border border-[#4C7F6E]/20 bg-[#4C7F6E]/10">
                            <div className="text-sm font-bold text-[#4C7F6E] mb-1">Окончание голосования:</div>
                            <div className="flex items-center gap-2 text-2xl font-mono font-black text-[#4C7F6E]">
                                <span>{String(deadline.hours).padStart(2, '0')}</span>:
                                <span>{String(deadline.minutes).padStart(2, '0')}</span>:
                                <span>{String(deadline.seconds).padStart(2, '0')}</span>
                            </div>
                        </div>
                    )}

                    {/* Подробное описание */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#4C7F6E]">Описание</label>
                        <div className={`px-4 py-3 rounded-xl border border-white/10 bg-white/5 ${textColor} whitespace-pre-wrap`}>
                            {initiative.description}
                        </div>
                    </div>

                    {/* Скриншоты */}
                    {initiative.screenshots && initiative.screenshots.length > 0 && (
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#4C7F6E]">Скриншоты</label>
                            <div className="grid grid-cols-2 gap-2">
                                {initiative.screenshots.map((screenshot, index) => (
                                    <div
                                        key={index}
                                        className="relative group cursor-pointer"
                                        onClick={() => setScreenshotModalOpen(screenshot)}
                                    >
                                        <img
                                            src={screenshot}
                                            alt={`Screenshot ${index + 1}`}
                                            className="w-full h-32 object-cover rounded-xl border border-white/10"
                                        />
                                        <div className="absolute inset-0 bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Maximize2 className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Ссылки */}
                    {parsedLinks.length > 0 && (
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#4C7F6E]">Ссылки</label>
                            <div className="space-y-2">
                                {parsedLinks.map((link, index) => (
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
                        <p className={`text-[10px] uppercase font-bold tracking-widest ${subTextColor}`}>
                            Создано: {format(parseISO(initiative.createdAt), 'dd.MM.yyyy HH:mm')}
                        </p>
                    </div>
                </div>
            </div>

            {/* Screenshot Modal */}
            {screenshotModalOpen && (
                <div
                    className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={() => setScreenshotModalOpen(null)}
                >
                    <div
                        className="relative max-w-7xl w-full max-h-[90vh] flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={screenshotModalOpen}
                            alt="Скриншот"
                            className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
                        />
                        <button
                            onClick={() => setScreenshotModalOpen(null)}
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
