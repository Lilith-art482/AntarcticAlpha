import React, { useState } from 'react'
import { useThemeStore } from '@/store/themeStore'
import {
    BarChart3,
    Search,
    Users,
    ShieldCheck,
    LayoutList,
    TrendingUp,
    ChevronDown,
    ChevronUp,
    Info,
    Twitter,
    Send,
    Target,
    Calculator,
    AlertCircle
} from 'lucide-react'

interface StrategyStepProps {
    number: number
    title: string
    children: React.ReactNode
    icon: React.ReactNode
    isOpen: boolean
    onToggle: () => void
}

const StrategyStep: React.FC<StrategyStepProps> = ({ number, title, children, icon, isOpen, onToggle }) => {
    const { theme } = useThemeStore()

    return (
        <div className={`overflow-hidden rounded-2xl border transition-all duration-300 ${theme === 'dark'
                ? 'bg-[#1a212a]/50 border-white/5 shadow-inner'
                : 'bg-white border-gray-100 shadow-sm'
            }`}>
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-white/5"
            >
                <div className="flex items-center gap-4">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-xl font-black text-lg ${theme === 'dark' ? 'bg-[#4E6E49]/20 text-[#4E6E49]' : 'bg-[#4E6E49]/5 text-[#4E6E49]'
                        }`}>
                        {number}
                    </div>
                    <div className="flex items-center gap-3">
                        <div className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                            {icon}
                        </div>
                        <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {title}
                        </h3>
                    </div>
                </div>
                {isOpen ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
            </button>

            {isOpen && (
                <div className={`p-6 pt-0 border-t ${theme === 'dark' ? 'border-white/5' : 'border-gray-50'}`}>
                    <div className={`mt-4 space-y-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        {children}
                    </div>
                </div>
            )}
        </div>
    )
}

export const AVALateVolumeStrategy: React.FC = () => {
    const { theme } = useThemeStore()
    const [openStep, setOpenStep] = useState<number | null>(1)

    const toggleStep = (step: number) => {
        setOpenStep(openStep === step ? null : step)
    }

    const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Strategy Intro */}
            <div className={`relative overflow-hidden rounded-3xl p-8 border ${theme === 'dark'
                    ? 'bg-gradient-to-br from-[#1a212a] to-[#0f1216] border-[#4E6E49]/20 shadow-2xl'
                    : 'bg-gradient-to-br from-white to-[#4E6E49]/5 border-[#4E6E49]/10 shadow-xl'
                }`}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#4E6E49]/5 blur-3xl rounded-full -mr-20 -mt-20 pointer-events-none"></div>

                <div className="relative flex flex-col md:flex-row gap-8 items-start">
                    <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-[#4E6E49]/10' : 'bg-[#4E6E49]/5'}`}>
                        <BarChart3 className={`w-12 h-12 ${theme === 'dark' ? 'text-[#4E6E49]' : 'text-[#4E6E49]'}`} />
                    </div>
                    <div className="flex-1 space-y-4">
                        <h2 className={`text-2xl md:text-3xl font-black ${headingColor}`}>ARCA Late Volume</h2>
                        <p className={`text-lg leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            ARCA Late Volume — это контекстная торговая стратегия, ориентированная на инструменты, которые уже реализовали основной импульс, но сохраняют повышенное внимание рынка. Стратегия допускает и структурно предусматривает глубокую временную просадку с последующим набором при сохранении ключевых рыночных метрик.
                        </p>
                        <div className={`flex flex-wrap gap-4 pt-2`}>
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${theme === 'dark' ? 'bg-white/5 text-gray-400 border border-white/10' : 'bg-gray-100 text-gray-600 border border-gray-200'
                                }`}>
                                <TrendingUp className="w-3.5 h-3.5" />
                                POST-IMPULSE
                            </div>
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${theme === 'dark' ? 'bg-white/5 text-gray-400 border border-white/10' : 'bg-gray-100 text-gray-600 border border-gray-200'
                                }`}>
                                <Search className="w-3.5 h-3.5" />
                                GMGN SCREENING
                            </div>
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${theme === 'dark' ? 'bg-white/10 text-[#4E6E49] border border-[#4E6E49]/20' : 'bg-[#4E6E49]/5 text-[#4E6E49] border border-[#4E6E49]/20'
                                }`}>
                                <Info className="w-3.5 h-3.5" />
                                DEEP DISCOUNT
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Steps */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                        <LayoutList className={`w-6 h-6 ${theme === 'dark' ? 'text-[#4E6E49]' : 'text-[#4E6E49]'}`} />
                        <h3 className={`text-xl font-black ${headingColor}`}>Алгоритм работы</h3>
                    </div>

                    <StrategyStep
                        number={1}
                        title="Фильтрация: Капитализация и Просадка"
                        icon={<Target className="w-5 h-5" />}
                        isOpen={openStep === 1}
                        onToggle={() => toggleStep(1)}
                    >
                        <p>На первом этапе применяются жёсткие количественные фильтры для отсева нежизнеспособных активов:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">ATH Cap</p>
                                <p className={`text-lg font-black ${headingColor}`}>≥ 500k USD</p>
                            </div>
                            <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Просадка</p>
                                <p className={`text-lg font-black text-rose-500`}>-50% ... -90%</p>
                            </div>
                            <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Current Cap</p>
                                <p className={`text-lg font-black ${headingColor}`}>≥ 20k USD</p>
                            </div>
                        </div>
                        <div className={`mt-4 p-4 rounded-xl border-l-4 ${theme === 'dark' ? 'bg-[#4E6E49]/5 border-[#4E6E49]/50' : 'bg-[#4E6E49]/5 border-[#4E6E49]/30'}`}>
                            <p className="text-sm italic">
                                <strong>Смысл:</strong> Если токен уже достигал значимой капитализации, это означает, что рынок признавал ценность нарратива. Текущая глубокая просадка при сохранении минимальной капитализации формирует асимметричную зону входа — цену страха, а не отсутствия интереса.
                            </p>
                        </div>
                    </StrategyStep>

                    <StrategyStep
                        number={2}
                        title="Проверка жизнеспособности нарратива"
                        icon={<Users className="w-5 h-5" />}
                        isOpen={openStep === 2}
                        onToggle={() => toggleStep(2)}
                    >
                        <div className="space-y-6">
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <Twitter className="w-4 h-4 text-sky-400" />
                                    <h4 className="font-bold">Социальный фильтр (X / Twitter)</h4>
                                </div>
                                <ul className="space-y-2 list-disc list-inside text-sm pl-2">
                                    <li>Поиск по тикеру или адресу контракта</li>
                                    <li>Минимум <strong>3 упоминания</strong> за последние 24 часа</li>
                                    <li>Источник — аккаунты с <strong>5 000+ подписчиков</strong></li>
                                    <li>Приоритет: обзоры, обсуждения, аналитические треды</li>
                                    <li className="text-rose-400">Исключаются автоматические call-каналы и спам</li>
                                </ul>
                            </div>

                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <Send className="w-4 h-4 text-[#4E6E49]" />
                                    <h4 className="font-bold">Telegram-сообщество</h4>
                                </div>
                                <ul className="space-y-2 list-disc list-inside text-sm pl-2">
                                    <li>Онлайн-активность: <strong>≥ 10%</strong> от участников</li>
                                    <li>Характер: фокус на развитии и будущем</li>
                                    <li className="text-rose-400 text-[11px] uppercase font-bold mt-1">Исключаем при:</li>
                                    <li className="text-rose-400/80 ml-4">Панические настроения, "некрологи", полное молчание</li>
                                </ul>
                            </div>
                        </div>
                    </StrategyStep>

                    <StrategyStep
                        number={3}
                        title="Распределение холдеров и китов"
                        icon={<ShieldCheck className="w-5 h-5" />}
                        isOpen={openStep === 3}
                        onToggle={() => toggleStep(3)}
                    >
                        <p className="text-sm">Цель — исключить активы с централизованным контролем ликвидности.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                            <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-emerald-50 border-emerald-500/20'}`}>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 mb-1">Max Holder</p>
                                <p className={`text-lg font-black ${headingColor}`}>≤ 3% эмиссии</p>
                            </div>
                            <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-emerald-50 border-emerald-500/20'}`}>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 mb-1">Top-10 Holders</p>
                                <p className={`text-lg font-black ${headingColor}`}>≤ 20% всего</p>
                            </div>
                        </div>
                        <p className="text-sm font-medium mt-2 text-rose-400">
                            * При признаках массового распределения позиций крупными держателями актив исключается.
                        </p>
                    </StrategyStep>
                </div>

                {/* Sidebar: Rules & Management */}
                <div className="space-y-6">
                    {/* Management Rules */}
                    <div className={`rounded-2xl p-6 border ${theme === 'dark' ? 'bg-[#151a21]/80 border-white/5' : 'bg-white border-gray-100'
                        } shadow-lg space-y-4`}>
                        <div className="flex items-center gap-3">
                            <Calculator className={`w-6 h-6 text-amber-500`} />
                            <h3 className={`text-lg font-black ${headingColor}`}>Управление позицией</h3>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Усреднение</p>
                                <div className={`space-y-2 p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                    <div className="flex justify-between text-sm">
                                        <span>1-й добор</span>
                                        <span className="font-bold text-amber-500">-15%...-25%</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>2-й добор</span>
                                        <span className="font-bold text-amber-500">-40%...-50%</span>
                                    </div>
                                    <div className="mt-2 pt-2 border-t border-white/5 text-[11px] text-rose-400 font-bold uppercase">
                                        3-й добор ЗАПРЕЩЕН
                                    </div>
                                </div>
                            </div>

                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Диверсификация</p>
                                <div className={`space-y-2 p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                    <p className="text-sm">Дробление между адресами</p>
                                    <p className="text-[11px] font-medium text-gray-400">
                                        Max <span className="text-amber-500 font-bold">0.5%</span> эмиссии на один кошелек
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Express Check Summary */}
                    <div className={`rounded-2xl p-6 border ${theme === 'dark' ? 'bg-[#4E6E49]/5 border-[#4E6E49]/20' : 'bg-[#4E6E49]/5 border-[#4E6E49]/20'
                        } shadow-lg space-y-4`}>
                        <div className="flex items-center gap-3">
                            <AlertCircle className={`w-6 h-6 text-[#4E6E49]`} />
                            <h3 className={`text-lg font-black ${headingColor}`}>Экспресс-чек</h3>
                        </div>
                        <div className={`space-y-1.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                            <p className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#4E6E49]/50"></span>
                                ATH-кап ≥ 500k USD
                            </p>
                            <p className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#4E6E49]/50"></span>
                                Current кап {'>'} 20k USD
                            </p>
                            <p className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#4E6E49]/50"></span>
                                Просадка 50–90%
                            </p>
                            <p className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#4E6E49]/50"></span>
                                3+ упоминания в X (5k+)
                            </p>
                            <p className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#4E6E49]/50"></span>
                                Топ-1 {'<'} 3%, Топ-10 ≤ 20%
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Final Logic Footer */}
            <div className={`rounded-2xl p-6 border-l-8 ${theme === 'dark' ? 'bg-[#0b1015] border-[#4E6E49]/50' : 'bg-gray-50 border-[#4E6E49]/30'
                }`}>
                <div className="flex gap-4 items-start">
                    <AlertCircle className="w-8 h-8 text-[#4E6E49] shrink-0" />
                    <div className="space-y-2">
                        <h4 className={`text-lg font-black ${headingColor}`}>Итоговая логика стратегии</h4>
                        <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            Эта стратегия — это не охота за разворотами и не ставка на удачу. Это системная работа с активами, которые уже были признаны рынком, временно торгуются в зоне страха, но сохраняют интерес, ликвидность и распределённое владение. Любое отклонение от фильтров разрушает её статистическое преимущество.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
