import React from 'react'
import { useThemeStore } from '@/store/themeStore'

interface DeadlineFilterProps {
    activeFilter: 'all' | '<24h' | '<48h' | '<72h'
    setActiveFilter: (filter: 'all' | '<24h' | '<48h' | '<72h') => void
}

export const DeadlineFilter: React.FC<DeadlineFilterProps> = ({ activeFilter, setActiveFilter }) => {
    const { theme } = useThemeStore()

    const filters = [
        { label: 'Все', value: 'all' },
        { label: '< 24 ч', value: '<24h' },
        { label: '24-48 ч', value: '<48h' }, // Изменено название
        { label: '48-72 ч', value: '<72h' }, // Изменено название
    ]

    return (
        <div className={`flex items-center rounded-xl p-1 overflow-x-auto ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'} scrollbar-hide`}>
            {filters.map((filter) => (
                <button
                    key={filter.value}
                    onClick={() => setActiveFilter(filter.value as any)} // will fix type later
                    className={`px-3 py-2 sm:py-1.5 rounded-lg flex items-center gap-2 text-xs sm:text-sm font-medium transition-all whitespace-nowrap touch-manipulation ${activeFilter === filter.value
                        ? (theme === 'dark' ? 'bg-white/10 text-white' : 'bg-white text-gray-900 shadow')
                        : 'text-gray-500 hover:text-gray-300'
                        }`}
                >
                    {filter.label}
                </button>
            ))}
        </div>
    )
}
