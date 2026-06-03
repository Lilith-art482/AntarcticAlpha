import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Search, X } from 'lucide-react'
import { useThemeStore } from '@/store/themeStore'

interface StrategyItem {
    id: string | null;
    name: string;
    icon: React.ReactNode;
}

interface StrategyDropdownSelectorProps {
    strategies: StrategyItem[];
    activeStrategy: string | null;
    setActiveStrategy: (id: string | null) => void;
    placeholder?: string;
}

export const StrategyDropdownSelector: React.FC<StrategyDropdownSelectorProps> = ({
    strategies,
    activeStrategy,
    setActiveStrategy,
    placeholder = 'Выберите стратегию...'
}) => {
    const { theme } = useThemeStore();
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedStrategy = strategies.find(s => s.id === activeStrategy);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredStrategies = strategies.filter(s => {
        const name = s.name.toLowerCase();
        const query = search.toLowerCase();
        return name.includes(query);
    });

    return (
        <div className="relative w-full lg:w-72" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-2xl border transition-all duration-300 ${theme === 'dark'
                    ? 'bg-[#151a21]/80 border-white/5 text-gray-300 hover:border-[#4E6E49]/30'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-[#4E6E49]'
                    } shadow-xl backdrop-blur-xl group relative overflow-hidden`}
            >
                <div className="flex items-center gap-2.5 overflow-hidden relative z-10">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${theme === 'dark' ? 'bg-[#4E6E49]/20 text-[#4E6E49]' : 'bg-[#4E6E49]/5 text-[#4E6E49]'
                        } flex-shrink-0`}>
                        {selectedStrategy?.icon || <Search size={16} />}
                    </div>
                    <div className="text-left min-w-0">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-[#4E6E49]/60 leading-none mb-1">Стратегия</p>
                        <span className="text-sm font-black tracking-tight truncate block">
                            {selectedStrategy?.name || placeholder}
                        </span>
                    </div>
                </div>
                <ChevronDown size={16} className={`text-[#4E6E49] transition-transform duration-300 relative z-10 ${isOpen ? 'rotate-180' : ''}`} />

                {/* Animated background glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#4E6E49]/0 via-[#4E6E49]/5 to-[#4E6E49]/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </button>

            {isOpen && (
                <div className={`absolute z-50 top-full mt-2 w-full min-w-[240px] rounded-2xl border shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300 ${theme === 'dark' ? 'bg-[#1a1f26] border-white/10' : 'bg-white border-gray-200'
                    }`}>
                    {/* Search bar */}
                    <div className="p-3 border-b border-white/5">
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4E6E49]/60" />
                            <input
                                type="text"
                                placeholder="Поиск стратегии..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className={`w-full pl-9 pr-8 py-2.5 rounded-xl text-xs font-bold outline-none transition-all ${theme === 'dark'
                                    ? 'bg-[#4E6E49]/5 text-gray-300 focus:bg-[#4E6E49]/10 border border-[#4E6E49]/10 focus:border-[#4E6E49]/30'
                                    : 'bg-gray-50 text-gray-700 focus:bg-white border border-gray-200 focus:border-[#4E6E49]/30'
                                    }`}
                                autoFocus
                            />
                            {search && (
                                <button
                                    onClick={() => setSearch('')}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:text-rose-500 transition-colors"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Strategies list */}
                    <div className="max-h-[300px] overflow-y-auto p-2 space-y-1 custom-scrollbar">
                        <StrategyItemButton
                            name={"Все стратегии"}
                            icon={<Search size={14} />}
                            isSelected={!activeStrategy}
                            onClick={() => {
                                setActiveStrategy(null);
                                setIsOpen(false);
                            }}
                            theme={theme}
                        />

                        {filteredStrategies.map(strategy => (
                            <StrategyItemButton
                                key={strategy.id}
                                name={strategy.name}
                                icon={strategy.icon}
                                isSelected={activeStrategy === strategy.id}
                                onClick={() => {
                                    setActiveStrategy(strategy.id);
                                    setIsOpen(false);
                                }}
                                theme={theme}
                            />
                        ))}

                        {filteredStrategies.length === 0 && (
                            <div className="py-8 text-center">
                                <Search className="w-8 h-8 text-[#4E6E49]/20 mx-auto mb-2" />
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Ничего не найдено</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// MemberItem аналогия для стратегий
const StrategyItemButton: React.FC<{
    name: string;
    icon: React.ReactNode;
    isSelected: boolean;
    onClick: () => void;
    theme: string;
}> = ({ name, icon, isSelected, onClick, theme }) => {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left group ${isSelected
                ? theme === 'dark' ? 'bg-[#4E6E49]/20 text-[#4E6E49]' : 'bg-[#4E6E49]/5 text-[#4E6E49]'
                : theme === 'dark' ? 'hover:bg-white/5 text-gray-400' : 'hover:bg-gray-50 text-gray-600'
                }`}
        >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isSelected
                ? 'bg-[#4E6E49]/50 text-white shadow-lg shadow-[#4E6E49]/20'
                : theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'
                }`}>
                {icon}
            </div>
            <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold truncate tracking-tight">{name}</span>
            </div>
        </button>
    );
};
