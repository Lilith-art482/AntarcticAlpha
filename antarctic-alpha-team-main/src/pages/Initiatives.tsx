import { useState, useEffect } from 'react'
import { InitiativeModal } from '@/components/Initiatives/InitiativeModal'
import { InitiativeViewModal } from '@/components/Initiatives/InitiativeViewModal'
import { Initiative, subscribeToInitiatives, getInitiativeById, checkAndUpdateInitiativeStatus, cleanupImplementedInitiatives, cleanupArchivedInitiatives } from '@/services/initiativesService'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { Plus, Search, Archive, CheckCircle2 } from 'lucide-react'
import { InitiativeCards } from '@/components/Initiatives/InitiativeCards'
import { useUsers } from '@/hooks/useUsers'
import { useLocation, useNavigate } from 'react-router-dom'

type ViewMode = 'active' | 'archive' | 'implemented'

export const Initiatives = () => {
    const { theme } = useThemeStore()
    const { user } = useAuthStore()
    const { users } = useUsers()
    const [searchQuery, setSearchQuery] = useState('')
    const [initiatives, setInitiatives] = useState<Initiative[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isViewMode, setIsViewMode] = useState(false)
    const [editingInitiative, setEditingInitiative] = useState<Initiative | null>(null)
    const [viewMode, setViewMode] = useState<ViewMode>('active')
    const location = useLocation()
    const navigate = useNavigate()

    const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'

    const openModal = () => {
        setEditingInitiative(null)
        setIsViewMode(false)
        setIsModalOpen(true)
        navigate(location.pathname, { replace: true })
    }

    const openViewModalFromCard = async (initiativeId: string) => {
        const initiativeData = await getInitiativeById(initiativeId)
        if (initiativeData) {
            setEditingInitiative(initiativeData)
            setIsViewMode(true)
            setIsModalOpen(true)
            navigate(`${location.pathname}?initiativeId=${initiativeId}`, { replace: true })
        } else {
            console.error('Инициатива не найдена:', initiativeId)
        }
    }

    const handleInitiativeUpdated = async (initiativeId: string) => {
        const updatedInitiative = await getInitiativeById(initiativeId)
        if (updatedInitiative) {
            setEditingInitiative(updatedInitiative)
            setInitiatives(prev => prev.map(i => i.id === initiativeId ? updatedInitiative : i))
        }
    }

    useEffect(() => {
        const params = new URLSearchParams(location.search)
        const initiativeId = params.get('initiativeId')

        const fetchAndOpenInitiative = async (id: string) => {
            const initiativeData = await getInitiativeById(id)
            if (initiativeData) {
                setEditingInitiative(initiativeData)
                setIsViewMode(true)
                setIsModalOpen(true)
            }
        }

        if (initiativeId && !isModalOpen) {
            fetchAndOpenInitiative(initiativeId)
        } else if (!initiativeId && isModalOpen && editingInitiative) {
            setIsModalOpen(false)
            setEditingInitiative(null)
            setIsViewMode(false)
        }
    }, [location.search, isModalOpen, editingInitiative])

    useEffect(() => {
        if (!user?.id) return
        const unsubscribe = subscribeToInitiatives(setInitiatives)
        return () => unsubscribe()
    }, [user])

    // Проверка и обновление статусов инициатив
    useEffect(() => {
        const totalTeamMembers = users.length || 1
        initiatives.forEach(async (initiative) => {
            await checkAndUpdateInitiativeStatus(initiative, totalTeamMembers)
        })
    }, [initiatives, users])

    // Очистка реализованных инициатив (перенос в архив через 14 дней)
    useEffect(() => {
        cleanupImplementedInitiatives(initiatives)
    }, [initiatives])

    // Очистка архивных инициатив (удаление через 7 дней)
    useEffect(() => {
        cleanupArchivedInitiatives(initiatives)
    }, [initiatives])

    const closeInitiativeModal = () => {
        setIsModalOpen(false)
        setEditingInitiative(null)
        setIsViewMode(false)
        navigate(location.pathname, { replace: true })
    }

    const filterInitiativesBySearchQuery = (allInitiatives: Initiative[]) => {
        if (!searchQuery) return allInitiatives
        const queryTerm = searchQuery.toLowerCase()

        return allInitiatives.filter(initiative => {
            // Поиск по номеру
            if (initiative.number && (`#${initiative.number}`.includes(queryTerm) || `№${initiative.number}`.includes(queryTerm) || initiative.number.toString().includes(queryTerm))) return true

            // Поиск по названию
            if (initiative.title.toLowerCase().includes(queryTerm)) return true

            // Поиск по сфере
            if (initiative.sphere.toLowerCase().includes(queryTerm)) return true

            // Поиск по описанию
            if (initiative.description.toLowerCase().includes(queryTerm)) return true

            return false
        })
    }

    let filteredInitiatives = filterInitiativesBySearchQuery(initiatives)

    // Разделяем по статусам
    const activeInitiatives = filteredInitiatives.filter(i => 
        ['voting', 'accepted', 'rejected', 'pause_dm', 'refused_dm'].includes(i.status)
    )
    const implementedInitiatives = filteredInitiatives.filter(i => i.status === 'implemented')
    const archivedInitiatives = filteredInitiatives.filter(i => i.status === 'archived')

    const getInitiativesForView = () => {
        switch (viewMode) {
            case 'archive':
                return archivedInitiatives
            case 'implemented':
                return implementedInitiatives
            default:
                return activeInitiatives
        }
    }

    const getStats = () => {
        const currentInitiatives = getInitiativesForView()
        const totalVotes = currentInitiatives.reduce((acc, i) => acc + i.votes.length, 0)
        const acceptedCount = currentInitiatives.filter(i => i.status === 'accepted').length
        const rejectedCount = currentInitiatives.filter(i => i.status === 'rejected' || i.status === 'refused_dm').length

        return { total: currentInitiatives.length, totalVotes, acceptedCount, rejectedCount }
    }

    const stats = getStats()

    return (
        <div className="flex min-h-screen">
            <div className="w-full space-y-6 p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                        <h1 className={`flex items-center gap-2 text-2xl md:text-3xl font-black tracking-tight ${headingColor}`}>
                            <span className="text-[#4C7F6E]">
                                <CheckCircle2 size={32} />
                            </span>
                            Initiatives
                        </h1>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Архив */}
                        <button
                            onClick={() => setViewMode('archive')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                                viewMode === 'archive'
                                    ? theme === 'dark'
                                        ? 'bg-[#4C7F6E] hover:bg-[#3d6660] text-white'
                                        : 'bg-[#4C7F6E] hover:bg-[#3d6660] text-white'
                                    : theme === 'dark'
                                        ? 'bg-white/10 hover:bg-white/20 text-gray-300'
                                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                            }`}
                        >
                            <Archive size={18} />
                            Архив ({archivedInitiatives.length})
                        </button>
                        {/* Поиск */}
                        <div className="relative w-48">
                            <input
                                type="text"
                                placeholder="Поиск"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={`w-full pl-9 pr-3 py-2 rounded-xl border outline-none transition-all ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white focus:border-[#4C7F6E]/50' : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-[#4C7F6E]/30'}`}
                            />
                            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                        </div>
                        <button
                            onClick={openModal}
                            className="flex items-center justify-center w-10 h-10 rounded-xl font-medium transition-all bg-[#4C7F6E] hover:bg-[#3d6660] text-white"
                            title="Добавить инициативу"
                        >
                            <Plus size={20} />
                        </button>
                    </div>
                </div>

                {/* Переключатель представлений */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setViewMode('active')}
                        className={`px-4 py-2 rounded-xl font-medium transition-all ${
                            viewMode === 'active'
                                ? theme === 'dark'
                                    ? 'bg-[#4C7F6E] hover:bg-[#3d6660] text-white'
                                    : 'bg-[#4C7F6E] hover:bg-[#3d6660] text-white'
                                : theme === 'dark'
                                    ? 'bg-white/10 hover:bg-white/20 text-gray-300'
                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                    >
                        Активные ({activeInitiatives.length})
                    </button>
                    <button
                        onClick={() => setViewMode('implemented')}
                        className={`px-4 py-2 rounded-xl font-medium transition-all ${
                            viewMode === 'implemented'
                                ? theme === 'dark'
                                    ? 'bg-[#4C7F6E] hover:bg-[#3d6660] text-white'
                                    : 'bg-[#4C7F6E] hover:bg-[#3d6660] text-white'
                                : theme === 'dark'
                                    ? 'bg-white/10 hover:bg-white/20 text-gray-300'
                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                    >
                        Реализованные ({implementedInitiatives.length})
                    </button>
                </div>

                {/* Статистика */}
                <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    <div className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}>
                        <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Всего инициатив</div>
                        <div className="text-2xl font-black">{stats.total}</div>
                    </div>
                    <div className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}>
                        <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Всего голосов</div>
                        <div className="text-2xl font-black">{stats.totalVotes}</div>
                    </div>
                    <div className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-green-500/10 border-green-500/20' : 'bg-green-50 border-green-200'}`}>
                        <div className="text-sm text-green-500">Принято</div>
                        <div className="text-2xl font-black text-green-500">{stats.acceptedCount}</div>
                    </div>
                    <div className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-200'}`}>
                        <div className="text-sm text-red-500">Отклонено</div>
                        <div className="text-2xl font-black text-red-500">{stats.rejectedCount}</div>
                    </div>
                </div>

                {/* Карточки */}
                {isViewMode ? (
                    <InitiativeViewModal
                        isOpen={isModalOpen}
                        onClose={closeInitiativeModal}
                        initiative={editingInitiative}
                        onInitiativeUpdated={handleInitiativeUpdated}
                    />
                ) : (
                    <InitiativeCards
                        initiatives={getInitiativesForView()}
                        isArchive={viewMode === 'archive'}
                        isImplemented={viewMode === 'implemented'}
                        onEdit={(initiative) => {
                            setEditingInitiative(initiative)
                            setIsViewMode(false)
                            setIsModalOpen(true)
                            navigate(`${location.pathname}?initiativeId=${initiative.id}`, { replace: true })
                        }}
                        onView={openViewModalFromCard}
                    />
                )}

                {isViewMode ? null : (
                    <InitiativeModal
                        isOpen={isModalOpen}
                        onClose={closeInitiativeModal}
                        initiative={editingInitiative}
                    />
                )}
            </div>
        </div>
    )
}

export default Initiatives
