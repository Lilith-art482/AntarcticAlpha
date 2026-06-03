import React, { useState, useRef, useEffect } from 'react'
import { Search, ChevronDown, Check, LayoutGrid } from 'lucide-react'
import { SLOT_CATEGORY_META, SlotCategory } from '@/types'
import { useThemeStore } from '@/store/themeStore'

interface CategorySelectorProps {
    selectedCategory: SlotCategory | ''
    onSelect: (category: SlotCategory | '') => void
    error?: boolean
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({ selectedCategory, onSelect, error }) => {
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

    const categories = (Object.keys(SLOT_CATEGORY_META) as SlotCategory[])
    const filteredCategories = categories.filter(cat => {
        const meta = SLOT_CATEGORY_META[cat]
        const label = meta.label.toLowerCase()
        const query = search.toLowerCase()
        return label.includes(query)
    })

    const selectedMeta = selectedCategory ? SLOT_CATEGORY_META[selectedCategory] : null

    const getCategoryColor = (cat: SlotCategory) => {
        // Mapping based on SlotForm/ManagementTable logic or define new standard
        // Reusing the meta accent logic if available, or hardcoding similar to table
        const colors: Record<string, string> = {
            emerald: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
            blue: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
            purple: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
            amber: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
            cyan: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
            pink: 'text-pink-500 bg-pink-500/10 border-pink-500/20',
            indigo: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
        }
        const meta = SLOT_CATEGORY_META[cat]
        return colors[meta.accent] || 'text-gray-500 bg-gray-500/10'
    }

    return (
        <div className="relative w-full" ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between gap-3 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border transition-all ${error ? 'border-red-500 ring-1 ring-red-500' :
                        theme === 'dark'
                            ? 'bg-gray-700 border-gray-800 text-white hover:border-gray-600'
                            : 'bg-white border-gray-300 text-gray-900 hover:border-gray-400'
                    } focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`}
            >
                <div className="flex items-center gap-2.5 overflow-hidden">
                    {selectedCategory && selectedMeta ? (
                        <>
                            <div className={`w-5 h-5 rounded-md flex items-center justify-center border text-[10px] flex-shrink-0 ${getCategoryColor(selectedCategory)}`}>
                                {/* Placeholder icon logic if needed, or just first letter */}
                                {selectedMeta.label[0]}
                            </div>
                            <span className="text-sm font-medium truncate">
                                {selectedMeta.label}
                            </span>
                        </>
                    ) : (
                        <>
                            <div className={`w-5 h-5 rounded-md flex items-center justify-center border border-dashed flex-shrink-0 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}>
                                <LayoutGrid size={12} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
                            </div>
                            <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Выберите сферу...</span>
                        </>
                    )}
                </div>
                <ChevronDown size={16} className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className={`absolute z-50 top-full mt-2 w-full min-w-[240px] rounded-xl border shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 ${theme === 'dark' ? 'bg-[#1a1f26] border-white/10' : 'bg-white border-gray-200'
                    }`}>
                    {/* Search bar */}
                    <div className="p-2 border-b border-white/5">
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Поиск..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className={`w-full pl-9 pr-8 py-2 rounded-lg text-xs font-medium outline-none transition-all ${theme === 'dark'
                                        ? 'bg-black/20 text-gray-300 focus:bg-black/40'
                                        : 'bg-gray-100 text-gray-700 focus:bg-gray-200'
                                    }`}
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Categories list */}
                    <div className="max-h-[300px] overflow-y-auto p-1.5 custom-scrollbar space-y-1">
                        <button
                            type="button"
                            onClick={() => {
                                onSelect('')
                                setIsOpen(false)
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-left ${!selectedCategory
                                    ? theme === 'dark' ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-900'
                                    : theme === 'dark' ? 'hover:bg-white/5 text-gray-400' : 'hover:bg-gray-50 text-gray-600'
                                }`}
                        >
                            <span className="text-xs font-medium">Не выбрано</span>
                            {!selectedCategory && <Check size={14} className="ml-auto" />}
                        </button>

                        {filteredCategories.map(cat => {
                            const meta = SLOT_CATEGORY_META[cat]
                            const isSelected = selectedCategory === cat
                            return (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => {
                                        onSelect(cat)
                                        setIsOpen(false)
                                    }}
                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-left group ${isSelected
                                            ? theme === 'dark' ? 'bg-emerald-500/10' : 'bg-emerald-50'
                                            : theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-50'
                                        }`}
                                >
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center border text-xs font-bold transition-transform group-hover:scale-105 ${getCategoryColor(cat)}`}>
                                        {meta.label[0]}
                                    </div>
                                    <div className="flex flex-col min-w-0 flex-1">
                                        <span className={`text-sm font-semibold truncate ${isSelected
                                                ? theme === 'dark' ? 'text-emerald-400' : 'text-emerald-700'
                                                : theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                                            }`}>
                                            {meta.label}
                                        </span>
                                    </div>
                                    {isSelected && <Check size={14} className={theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'} />}
                                </button>
                            )
                        })}
                        {filteredCategories.length === 0 && (
                            <div className="p-4 text-center">
                                <p className="text-[10px] text-gray-500">Ничего не найдено</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
