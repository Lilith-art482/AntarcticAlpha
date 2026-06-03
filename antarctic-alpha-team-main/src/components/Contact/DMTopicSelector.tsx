import React, { useState, useRef, useEffect } from 'react'
import { Search, ChevronDown, Check, HelpCircle, Lightbulb, AlertTriangle, Users, Users2, Wallet, CreditCard, Calendar, Bug } from 'lucide-react'
import { DMContactTopic, DM_CONTACT_TOPICS } from '@/types'
import { useThemeStore } from '@/store/themeStore'

interface DMTopicSelectorProps {
    selectedTopic: DMContactTopic | ''
    onSelect: (topic: DMContactTopic | '') => void
    error?: boolean
}

interface TopicMeta {
    label: string
    icon: React.ComponentType<{ className?: string }>
    color: string
}

const DM_TOPIC_META: Record<DMContactTopic, TopicMeta> = {
    bug_report: {
        label: 'Сообщить о баге',
        icon: Bug,
        color: 'text-rose-500 bg-rose-500/10 border-rose-500/20'
    },
    idea: {
        label: 'Предложить идею',
        icon: Lightbulb,
        color: 'text-amber-500 bg-amber-500/10 border-amber-500/20'
    },
    violation: {
        label: 'Сообщить о нарушениях',
        icon: AlertTriangle,
        color: 'text-red-500 bg-red-500/10 border-red-500/20'
    },
    join_team: {
        label: 'Присоединиться к команде',
        icon: Users,
        color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
    },
    referral: {
        label: 'Реферальная программа',
        icon: Users2,
        color: 'text-purple-500 bg-purple-500/10 border-purple-500/20'
    },
    earnings_pool_payments: {
        label: 'Заработок, пул и выплаты',
        icon: Wallet,
        color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
    },
    card_payment: {
        label: 'Карта и оплата',
        icon: CreditCard,
        color: 'text-blue-500 bg-blue-500/10 border-blue-500/20'
    },
    schedule_events_tasks: {
        label: 'Расписание, события и задачи',
        icon: Calendar,
        color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20'
    },
    general: {
        label: 'Общие вопросы',
        icon: HelpCircle,
        color: 'text-gray-500 bg-gray-500/10 border-gray-500/20'
    }
}

export const DMTopicSelector: React.FC<DMTopicSelectorProps> = ({ selectedTopic, onSelect, error }) => {
    const { theme } = useThemeStore()
    const [isOpen, setIsOpen] = useState(false)
    const [search, setSearch] = useState('')
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const topics = (Object.keys(DM_CONTACT_TOPICS) as DMContactTopic[])
    const filteredTopics = topics.filter(topic => {
        const meta = DM_TOPIC_META[topic]
        const label = meta.label.toLowerCase()
        const query = search.toLowerCase()
        return label.includes(query)
    })

    const selectedMeta = selectedTopic ? DM_TOPIC_META[selectedTopic] : null

    return (
        <div className="relative w-full" ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl border-2 transition-all ${
                    error 
                        ? 'border-red-500 bg-red-500/5' 
                        : theme === 'dark'
                            ? 'bg-white/5 border-white/10 text-white hover:border-[#4C7F6E]/50 hover:bg-white/10'
                            : 'bg-gray-50 border-gray-200 text-gray-900 hover:border-[#4C7F6E] hover:bg-[#4C7F6E]/5'
                } focus:outline-none`}
            >
                <div className="flex items-center gap-3 overflow-hidden flex-1">
                    {selectedTopic && selectedMeta ? (
                        <>
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${selectedMeta.color}`}>
                                <selectedMeta.icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0 text-left">
                                <p className={`text-xs font-bold uppercase tracking-wider mb-0.5 ${
                                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                }`}>
                                    Тема сообщения
                                </p>
                                <p className={`text-base font-black truncate ${
                                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                                }`}>
                                    {selectedMeta.label}
                                </p>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-3 flex-1">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border-2 border-dashed ${
                                theme === 'dark' ? 'border-white/20 text-gray-500' : 'border-gray-300 text-gray-400'
                            }`}>
                                <HelpCircle className="w-5 h-5" />
                            </div>
                            <div className="flex-1 text-left">
                                <p className={`text-xs font-bold uppercase tracking-wider mb-0.5 ${
                                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                }`}>
                                    Тема сообщения
                                </p>
                                <p className={`text-base font-semibold ${
                                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                }`}>
                                    Выберите тему...
                                </p>
                            </div>
                        </div>
                    )}
                </div>
                <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className={`absolute z-50 top-full mt-3 w-full min-w-[320px] rounded-2xl border shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 ${
                    theme === 'dark' 
                        ? 'bg-[#1a1f26] border-white/10' 
                        : 'bg-white border-gray-200'
                }`}>
                    {/* Search bar */}
                    <div className={`p-3 border-b ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'}`}>
                        <div className="relative">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Поиск темы..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm font-medium outline-none transition-all ${
                                    theme === 'dark'
                                        ? 'bg-white/5 text-white placeholder-gray-500 focus:bg-white/10 focus:border-white/20'
                                        : 'bg-gray-100 text-gray-900 placeholder-gray-400 focus:bg-gray-200'
                                } border-0 focus:ring-2 focus:ring-[#4C7F6E]/20`}
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Topics list */}
                    <div className="max-h-[400px] overflow-y-auto p-2 custom-scrollbar space-y-1">
                        {filteredTopics.map(topic => {
                            const meta = DM_TOPIC_META[topic]
                            const isSelected = selectedTopic === topic
                            const Icon = meta.icon
                            
                            return (
                                <button
                                    key={topic}
                                    type="button"
                                    onClick={() => {
                                        onSelect(topic)
                                        setIsOpen(false)
                                    }}
                                    className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all text-left group ${
                                        isSelected
                                            ? theme === 'dark' ? 'bg-[#4C7F6E]/20' : 'bg-[#4C7F6E]/10'
                                            : theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-50'
                                    }`}
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 ${meta.color}`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 min-w-0 text-left">
                                        <p className={`text-sm font-bold truncate ${
                                            isSelected
                                                ? theme === 'dark' ? 'text-white' : 'text-gray-900'
                                                : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                        }`}>
                                            {meta.label}
                                        </p>
                                    </div>
                                    {isSelected && (
                                        <Check className={`w-5 h-5 flex-shrink-0 ${
                                            theme === 'dark' ? 'text-[#4C7F6E]' : 'text-[#4C7F6E]'
                                        }`} />
                                    )}
                                </button>
                            )
                        })}
                        {filteredTopics.length === 0 && (
                            <div className="p-6 text-center">
                                <HelpCircle className={`w-8 h-8 mx-auto mb-2 ${
                                    theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                                }`} />
                                <p className={`text-sm ${
                                    theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                                }`}>
                                    Ничего не найдено
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
