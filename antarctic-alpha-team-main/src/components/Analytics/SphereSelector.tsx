import React, { useState, useRef, useEffect } from 'react'
import { Search, ChevronDown, BarChart3, X } from 'lucide-react'
import { useThemeStore } from '@/store/themeStore'

interface SphereItem {
    id: string | null;
    name: string;
    icon: React.ReactNode;
}

interface SphereSelectorProps {
    spheres: SphereItem[];
    activeSphere: string | null;
    setActiveSphere: (id: string | null) => void;
}

export const SphereSelector: React.FC<SphereSelectorProps> = ({
    spheres,
    activeSphere,
    setActiveSphere,
}) => {
    const { theme } = useThemeStore()
    const [isOpen, setIsOpen] = useState(false)
    const [search, setSearch] = useState('')
    const containerRef = useRef<HTMLDivElement>(null)

    const selectedSphere = spheres.find(s => s.id === activeSphere)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const filteredSpheres = spheres.filter(s => {
        const name = s.name.toLowerCase()
        const query = search.toLowerCase()
        return name.includes(query)
    })

    return (
        <div className="relative w-full lg:w-72" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-2xl border transition-all duration-300 ${theme === 'dark'
                    ? 'bg-[#151a21]/80 border-white/5 text-gray-300 hover:border-[#4C7F6E]/30'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-[#4C7F6E]'
                    } shadow-xl backdrop-blur-xl group relative overflow-hidden`}
            >
                <div className="flex items-center gap-2.5 overflow-hidden relative z-10">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${theme === 'dark' ? 'bg-[#4C7F6E]/20 text-[#4C7F6E]' : 'bg-[#4C7F6E]/10 text-[#4C7F6E]'
                        } flex-shrink-0`}>
                        {selectedSphere?.icon || <BarChart3 size={20} />}
                    </div>
                    <div className="text-left min-w-0">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-[#4C7F6E]/60 leading-none mb-1">Сфера</p>
                        <span className="text-sm font-black tracking-tight truncate block">{selectedSphere?.name || 'Все сферы'}</span>
                    </div>
                </div>
                <ChevronDown size={16} className={`text-[#4C7F6E] transition-transform duration-300 relative z-10 ${isOpen ? 'rotate-180' : ''}`} />

                {/* Animated background glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#4C7F6E]/0 via-[#4C7F6E]/5 to-[#4C7F6E]/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </button>

            {isOpen && (
                <div className={`absolute z-50 top-full mt-2 w-full min-w-[240px] rounded-2xl border shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300 ${theme === 'dark' ? 'bg-[#1a1f26] border-white/10' : 'bg-white border-gray-200'
                    }`}>
                    {/* Search bar */}
                    <div className="p-3 border-b border-white/5">
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Поиск сферы..."
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

                    {/* Spheres list */}
                    <div className="max-h-[300px] overflow-y-auto p-1.5 custom-scrollbar">
                        <button
                            onClick={() => {
                                setActiveSphere('all')
                                setIsOpen(false)
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${activeSphere === 'all'
                                ? theme === 'dark' ? 'bg-[#4C7F6E]/10 text-[#4C7F6E]' : 'bg-[#4C7F6E]/10 text-[#4C7F6E]'
                                : theme === 'dark' ? 'hover-bg-white/5 text-gray-400' : 'hover:bg-gray-50 text-gray-600'
                                }`}
                        >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeSphere === 'all'
                                ? 'bg-[#4C7F6E] text-white shadow-lg shadow-[#4C7F6E]/20'
                                : theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'
                                }`}>
                                <BarChart3 size={20} />
                            </div>
                            <span className="text-sm font-black tracking-tight">Все сферы</span>
                        </button>

                        {filteredSpheres.map(sphere => ( sphere.id !== 'all' &&
                            <SphereItemComponent
                                key={sphere.id}
                                sphere={sphere}
                                isSelected={activeSphere === sphere.id}
                                onSelect={(id) => {
                                    setActiveSphere(id)
                                    setIsOpen(false)
                                }}
                                theme={theme}
                            />
                        ))}

                        {filteredSpheres.length === 0 && (
                            <div className="p-4 text-center">
                                <p className="text-[10px] text-gray-500">Ничего не нашли :(</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

const SphereItemComponent: React.FC<{
    sphere: SphereItem
    isSelected: boolean
    onSelect: (id: string | null) => void
    theme: string
}> = ({ sphere, isSelected, onSelect, theme }) => {
    return (
        <button
            onClick={() => onSelect(sphere.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${isSelected
                ? theme === 'dark' ? 'bg-[#4C7F6E]/10 text-[#4C7F6E]' : 'bg-[#4C7F6E]/10 text-[#4C7F6E]'
                : theme === 'dark' ? 'hover:bg-white/5 text-gray-300' : 'hover:bg-gray-50 text-gray-700'
                }`}
        >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isSelected
                ? 'bg-[#4C7F6E] text-white shadow-lg shadow-[#4C7F6E]/20'
                : theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'
                }`}>
                {sphere.icon}
            </div>
            <span className="text-sm font-black tracking-tight">{sphere.name}</span>
            {isSelected && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#4C7F6E] animate-pulse" />
            )}
        </button>
    )
}