import React, { useState } from 'react'
import { useThemeStore } from '@/store/themeStore'
import {
    ChevronDown,
    ChevronUp,
    X
} from 'lucide-react'

interface StrategyItem {
    id: string | null;
    name: string;
    icon: React.ReactNode;
    desc?: string;
}

interface StrategySelectorProps {
    strategies: StrategyItem[];
    activeStrategy: string | null;
    setActiveStrategy: (id: string | null) => void;
    categoryName: string;
    categoryDescription: string;
    categoryIcon: React.ReactNode;
}

export const StrategySelector: React.FC<StrategySelectorProps> = (
    { strategies, activeStrategy, setActiveStrategy, categoryName, categoryDescription, categoryIcon }
) => {
    const { theme } = useThemeStore()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'

    const currentStrategy = strategies.find(s => s.id === activeStrategy);

    return (
        <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#4E6E49]/10 rounded-xl border border-[#4E6E49]/20">
                        {categoryIcon}
                    </div>
                    <div>
                        <h3 className={`text-xl font-black ${headingColor}`}>{categoryName}</h3>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            {categoryDescription}
                        </p>
                    </div>
                </div>

                {/* Strategy Selector for PC when a strategy is active */}
                {activeStrategy && (
                    <div className="hidden sm:flex w-full overflow-x-auto pb-2 justify-end" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        <style>{`
                            .overflow-x-auto::-webkit-scrollbar {
                                display: none;
                            }
                        `}</style>
                        <div className={`flex items-center gap-2 p-1.5 rounded-xl border ${theme === 'dark' ? 'bg-[#151a21] border-white/5' : 'bg-gray-50 border-gray-200'}`}>
                            {strategies.map((s) => (
                                <button
                                    key={s.id}
                                    onClick={() => setActiveStrategy(s.id)}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${activeStrategy === s.id
                                        ? 'bg-[#4E6E49]/50 text-white shadow-lg shadow-[#4E6E49]/20'
                                        : 'text-gray-400 hover:text-gray-200'
                                        }`}
                                >
                                    {s.icon}
                                    <span>{s.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile Selector for strategies */}
            <div className="relative sm:hidden">
                <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all active:scale-[0.98] ${theme === 'dark'
                        ? 'bg-white/5 border-white/10 text-white active:bg-white/10'
                        : 'bg-white border-gray-200 text-gray-900 active:bg-gray-50'
                        } shadow-xl backdrop-blur-xl relative overflow-hidden group`}
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-[#4E6E49]/10 text-[#4E6E49]">
                            {currentStrategy ? currentStrategy.icon : categoryIcon}
                        </div>
                        <div className="text-left">
                            <p className="text-[10px] uppercase tracking-widest font-bold text-[#4E6E49]/60 leading-none mb-1">
                                {activeStrategy ? 'Выбранная Стратегия' : 'Выберите Стратегию'}
                            </p>
                            <span className="font-black text-lg">
                                {currentStrategy ? currentStrategy.name : categoryName}
                            </span>
                        </div>
                    </div>
                    <div className={`p-2 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                        {isMobileMenuOpen ? <ChevronUp className="w-5 h-5 text-[#4E6E49]" /> : <ChevronDown className="w-5 h-5 text-[#4E6E49]" />}
                    </div>

                    {/* Animated background glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#4E6E49]/0 via-[#4E6E49]/5 to-[#4E6E49]/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </button>

                {/* Mobile Drawer Overlay */}
                {isMobileMenuOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center sm:hidden p-4"> {/* Изменено: items-end на items-center и justify-center, добавлен p-4 */}
                        <div
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                        <div className={`w-full max-w-md relative z-10 p-6 rounded-[2.5rem] border ${theme === 'dark' ? 'bg-[#0b1015] border-white/10' : 'bg-white border-gray-100'
                            } shadow-2xl animate-in fade-in zoom-in-95 duration-300`}> {/* Изменено: rounded-t-[2.5rem] на rounded-[2.5rem], убран border-t, изменена анимация */}
                            <div className="flex items-center justify-between mb-8">
                                <h3 className={`text-xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Выберите Стратегию</h3>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`p-2 rounded-full ${theme === 'dark' ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-500'}`}
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 gap-3 max-h-[70vh] overflow-y-auto pr-2"> {/* Добавлено max-h и overflow-y */}'''
                                {strategies.map((s) => (
                                    <button
                                        key={s.id}
                                        onClick={() => {
                                            setActiveStrategy(s.id)
                                            setIsMobileMenuOpen(false)
                                        }}
                                        className={`flex items-center gap-4 p-4 rounded-[1.5rem] transition-all relative overflow-hidden ${activeStrategy === s.id
                                            ? 'bg-[#4E6E49]/50 text-white shadow-lg shadow-[#4E6E49]/25 scale-[1.02]'
                                            : theme === 'dark' ? 'bg-white/5 text-gray-400 hover:bg-white/10' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        <div className={`p-2.5 rounded-xl ${activeStrategy === s.id ? 'bg-white/20' : theme === 'dark' ? 'bg-white/5' : 'bg-white'}`}>
                                            {s.icon}
                                        </div>
                                        <span className="font-bold text-base">{s.name}</span>
                                        {activeStrategy === s.id && (
                                            <div className="ml-auto w-2 h-2 rounded-full bg-white animate-pulse" />
                                        )}
                                    </button>
                                ))}
                            </div>
                            <div className="h-8" /> {/* Safe area spacer */}
                        </div>
                    </div>
                )}
            </div>

            {/* Selection Grid for PC when no strategy is active */}
            {!activeStrategy && (
                <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {strategies.map((s) => (
                        <button
                            key={s.id}
                            onClick={() => setActiveStrategy(s.id)}
                            className={`group p-8 rounded-[2.5rem] border text-left transition-all duration-500 hover:-translate-y-2 ${theme === 'dark'
                                ? 'bg-white/5 border-white/5 hover:border-[#4E6E49]/30 hover:bg-[#4E6E49]/5'
                                : 'bg-white border-gray-100 hover:border-[#4E6E49]/20 hover:shadow-2xl hover:shadow-[#4E6E49]/10'
                                }`}
                        >
                            <div className={`p-4 rounded-2xl w-fit mb-6 transition-transform duration-500 group-hover:scale-110 ${theme === 'dark' ? 'bg-[#4E6E49]/20 text-[#4E6E49]' : 'bg-[#4E6E49]/5 text-[#4E6E49]'
                                }`}>
                                {React.cloneElement(s.icon as React.ReactElement, { className: 'w-8 h-8' })}
                            </div>
                            <h4 className={`text-xl font-black mb-2 ${headingColor}`}>{s.name}</h4>
                            <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                {s.desc}
                            </p>
                            <div className="mt-6 flex items-center gap-2">
                                <span className="relative overflow-hidden px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border border-[#4E6E49]/30 text-[#4E6E49] group-hover:border-[#4E6E49] group-hover:bg-[#4E6E49]/5 transition-all duration-300">
                                    <span className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 bg-gradient-to-r from-transparent via-[#4E6E49]/10 to-transparent" />
                                    <span className="relative">
                                        Подробнее о стратегии
                                    </span>
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </section>
    );
}
