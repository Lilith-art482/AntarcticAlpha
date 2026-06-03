import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Search, X, Check } from 'lucide-react'
import { useThemeStore } from '@/store/themeStore'

export interface SelectOption {
    value: string
    label: string
    icon?: React.ReactNode
    meta?: string
    chip?: string
}

interface MultiSelectProps {
    value: string[]
    onChange: (value: string[]) => void
    options: SelectOption[]
    placeholder?: string
    searchable?: boolean
    icon?: React.ReactNode
    singleSelect?: boolean
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
    value,
    onChange,
    options,
    placeholder = 'Select...',
    searchable = false,
    icon,
    singleSelect = false
}) => {
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

    const filteredOptions = options.filter(o =>
        o.label.toLowerCase().includes(search.toLowerCase()) ||
        (o.meta && o.meta.toLowerCase().includes(search.toLowerCase()))
    )

    const handleSelectOption = (optionValue: string) => {
        if (singleSelect) {
            // For single select, just set the value and close dropdown
            onChange([optionValue])
            setIsOpen(false)
        } else {
            if (value.includes(optionValue)) {
                // Remove if already selected
                onChange(value.filter(val => val !== optionValue))
            } else {
                // Add if not selected
                onChange([...value, optionValue])
            }
        }
    }

    return (
        <div className="relative min-w-[180px]" ref={containerRef}>
            <button
                type='button'
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl border transition-all ${theme === 'dark'
                    ? 'bg-[#151a21] border-white/5 text-gray-300 hover:border-[#4C7F6E]/30'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-[#4C7F6E]'
                    }`}
            >
                <div className="flex items-center gap-2.5 overflow-hidden flex-wrap">
                    {icon && <div className={value.length > 0 ? "text-[#4C7F6E]" : "text-gray-500"}>{icon}</div>}

                    {value.length > 0 ? (
                        value.map(val => {
                            const selectedOption = options.find(o => o.value === val)
                            return selectedOption ? (
                                <div key={val} className={`flex items-center gap-1 rounded-lg pl-2 pr-1 py-1 text-xs font-bold ${theme === 'dark' ? 'bg-white/10 text-gray-200' : 'bg-gray-100 text-gray-700'}`}>
                                    {selectedOption.icon && (
                                        <div className={`flex items-center justify-center`}>
                                            {selectedOption.icon}
                                        </div>
                                    )}
                                    <span className="truncate">{selectedOption.label}</span>
                                    <X size={12} className="cursor-pointer" onClick={(e) => { e.stopPropagation(); handleSelectOption(val); }} />
                                </div>
                            ) : null
                        })
                    ) : (
                        <span className="text-sm font-semibold text-gray-500">{placeholder}</span>
                    )}
                </div>
                <ChevronDown size={16} className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className={`absolute z-50 top-full mt-2 w-full min-w-[200px] rounded-2xl border shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 ${theme === 'dark' ? 'bg-[#1a1f26] border-white/10' : 'bg-white border-gray-200'
                    }`}>
                    {searchable && (
                        <div className="p-3 border-b border-white/5">
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
                                {search && (
                                    <button
                                        type='button'
                                        onClick={() => setSearch('')}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:text-rose-500"
                                    >
                                        <X size={12} />
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="max-h-[300px] overflow-y-auto p-1.5 custom-scrollbar">
                        {filteredOptions.map(option => (
                            <button
                                type='button'
                                key={option.value}
                                onClick={() => handleSelectOption(option.value)}
                                className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg transition-all text-left ${value.includes(option.value)
                                    ? theme === 'dark' ? 'bg-[#4C7F6E]/10 text-[#4C7F6E]' : 'bg-[#4C7F6E]/10 text-[#4C7F6E]'
                                    : theme === 'dark' ? 'hover:bg-white/5 text-gray-300' : 'hover:bg-gray-50 text-gray-700'
                                    }`}
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    {option.icon && (
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 overflow-hidden ${option.chip ? option.chip : (theme === 'dark' ? 'bg-white/5' : 'bg-gray-100')}`}>
                                            {option.icon}
                                        </div>
                                    )}
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-xs font-bold truncate">{option.label}</span>
                                        {option.meta && <span className="text-[9px] opacity-50 truncate">{option.meta}</span>}
                                    </div>
                                </div>
                                {value.includes(option.value) && <Check size={14} />}
                            </button>
                        ))}
                        {filteredOptions.length === 0 && (
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
