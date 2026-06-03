import React, { useState, useRef, useEffect } from 'react'
import { Search, ChevronDown, User, X } from 'lucide-react'
import { User as UserType } from '@/types'
import { useUserNickname } from '@/utils/userUtils'
import { useThemeStore } from '@/store/themeStore'
import { getAllUsers } from '@/services/firestoreService'
import Avatar from '@/components/Avatar'
import { TEAM_MEMBERS } from '@/types'

interface MemberSelectorProps {
    selectedUserId: string | null
    onSelect: (userId: string | null) => void
}

export const MemberSelector: React.FC<MemberSelectorProps> = ({ selectedUserId, onSelect }) => {
    const { theme } = useThemeStore()
    const [isOpen, setIsOpen] = useState(false)
    const [search, setSearch] = useState('')
    const [firestoreUsers, setFirestoreUsers] = useState<UserType[]>([])
    const containerRef = useRef<HTMLDivElement>(null)

    // Merge Firestore users with TEAM_MEMBERS (Firestore takes priority)
    const allUsers = React.useMemo(() => {
        const usersMap = new Map<string, UserType>()

        // Add TEAM_MEMBERS first (as fallback)
        TEAM_MEMBERS.forEach(user => {
            usersMap.set(user.id, user)
        })

        // Override with Firestore users
        firestoreUsers.forEach(user => {
            usersMap.set(user.id, user)
        })

        return Array.from(usersMap.values())
    }, [firestoreUsers])

    const selectedMember = allUsers.find(m => m.id === selectedUserId)
    const selectedNickname = useUserNickname(selectedUserId || '')

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const users = await getAllUsers()
                setFirestoreUsers(users)
            } catch (error) {
                console.error('Error loading users for selector:', error)
            }
        }
        loadUsers()
    }, [])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const filteredMembers = allUsers.filter(m => {
        const name = m.name.toLowerCase()
        const query = search.toLowerCase()
        return name.includes(query)
    })

    return (
        <div className="relative w-full" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl border transition-all ${theme === 'dark'
                    ? 'bg-[#151a21] border-white/5 text-gray-300 hover:border-[#4C7F6E]/30'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-[#4C7F6E]'
                    }`}
            >
                <div className="flex items-center gap-2.5 overflow-hidden">
                    {selectedMember ? (
                        <>
                            <Avatar user={selectedMember} size="sm" className="w-5 h-5" />
                            <span className="text-sm font-bold truncate">
                                {selectedNickname || selectedMember.name}
                            </span>
                        </>
                    ) : (
                        <>
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center border border-dashed border-gray-500 flex-shrink-0`}>
                                <User size={12} className="text-gray-500" />
                            </div>
                            <span className="text-sm font-semibold text-gray-500">Трейдеры</span>
                        </>
                    )}
                </div>
                <ChevronDown size={16} className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className={`absolute z-50 top-full mt-2 w-full min-w-[240px] rounded-2xl border shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 ${theme === 'dark' ? 'bg-[#1a1f26] border-white/10' : 'bg-white border-gray-200'
                    }`}>
                    {/* Search bar */}
                    <div className="p-3 border-b border-white/5">
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Поиск участника..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className={`w-full pl-9 pr-8 py-2 rounded-lg text-xs font-medium outline-none transition-all ${theme === 'dark'
                                    ? 'bg-black/20 text-gray-300 focus:bg-black/40'
                                    : 'bg-gray-100 text-gray-700 focus:bg-gray-200'
                                    }`}
                                autoFocus
                            />
                            {search && (
                                <button
                                    onClick={() => setSearch('')}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:text-rose-500"
                                >
                                    <X size={12} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Members list */}
                    <div className="max-h-[300px] overflow-y-auto p-1.5 custom-scrollbar">
                        <button
                            onClick={() => {
                                onSelect(null)
                                setIsOpen(false)
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-left ${!selectedUserId
                                ? theme === 'dark' ? 'bg-[#4C7F6E]/10 text-[#4C7F6E]' : 'bg-[#4C7F6E]/10 text-[#4C7F6E]'
                                : theme === 'dark' ? 'hover:bg-white/5 text-gray-400' : 'hover:bg-gray-50 text-gray-600'
                                }`}
                        >
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center border border-dashed border-gray-500 text-[10px]`}>
                                <User size={12} />
                            </div>
                            <span className="text-xs font-bold">Трейдеры</span>
                        </button>

                        {filteredMembers.map(member => (
                            <MemberItem
                                key={member.id}
                                member={member}
                                isSelected={selectedUserId === member.id}
                                onSelect={(id) => {
                                    onSelect(id)
                                    setIsOpen(false)
                                }}
                                theme={theme}
                            />
                        ))}

                        {filteredMembers.length === 0 && (
                            <div className="p-4 text-center">
                                <p className="text-[10px] text-gray-500">Никого не нашли :(</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

const MemberItem: React.FC<{
    member: UserType
    isSelected: boolean
    onSelect: (id: string) => void
    theme: string
}> = ({ member, isSelected, onSelect, theme }) => {
    const nickname = useUserNickname(member.id)

    return (
        <button
            onClick={() => onSelect(member.id)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-left group ${isSelected
                ? theme === 'dark' ? 'bg-[#4C7F6E]/10 text-[#4C7F6E]' : 'bg-[#4C7F6E]/10 text-[#4C7F6E]'
                : theme === 'dark' ? 'hover:bg-white/5 text-gray-300' : 'hover:bg-gray-50 text-gray-700'
                }`}
        >
            <div className="relative">
                <Avatar user={member} size="sm" className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold truncate">{nickname || member.name}</span>
        </button>
    )
}
