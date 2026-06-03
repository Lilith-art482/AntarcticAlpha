import React, { useState } from 'react'
import { useThemeStore } from '@/store/themeStore'
import {
    BarChart3,
    Users,
    ShieldCheck,
    LayoutList,
    TrendingUp,
    ChevronDown,
    ChevronUp,
    Target,
    Calculator,
    AlertCircle,
    Wallet,
    LineChart,
    ArrowUpRight,
    ArrowDownRight,
    Eye,
    XCircle,
    CheckCircle2
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

export const AVAHolderLevelsStrategy: React.FC = () => {
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
                        <Users className={`w-12 h-12 ${theme === 'dark' ? 'text-[#4E6E49]' : 'text-[#4E6E49]'}`} />
                    </div>
                    <div className="flex-1 space-y-4">
                        <h2 className={`text-2xl md:text-3xl font-black ${headingColor}`}>ARCA — Топ-держатели уровни</h2>
                        <p className={`text-lg leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            Торговля от уровней поддержки, созданных крупнейшими держателями. Используем анализ кошельков топ-10 и топ-25 для определения зон высокой вероятности отскока.
                        </p>
                        <div className={`flex flex-wrap gap-4 pt-2`}>
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${theme === 'dark' ? 'bg-white/5 text-gray-400 border border-white/10' : 'bg-gray-100 text-gray-600 border border-gray-200'
                                }`}>
                                <Users className="w-3.5 h-3.5" />
                                ON-CHAIN АНАЛИЗ
                            </div>
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${theme === 'dark' ? 'bg-white/5 text-gray-400 border border-white/10' : 'bg-gray-100 text-gray-600 border border-gray-200'
                                }`}>
                                <Target className="w-3.5 h-3.5" />
                                УРОВНИ ПОДДЕРЖКИ
                            </div>
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${theme === 'dark' ? 'bg-white/10 text-[#4E6E49] border border-[#4E6E49]/20' : 'bg-[#4E6E49]/5 text-[#4E6E49] border border-[#4E6E49]/20'
                                }`}>
                                <LineChart className="w-3.5 h-3.5" />
                                GMGN TERMINAL
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
                        title="Логика стратегии"
                        icon={<TrendingUp className="w-5 h-5" />}
                        isOpen={openStep === 1}
                        onToggle={() => toggleStep(1)}
                    >
                        <p>В мемкоинах крупные держатели часто создают искусственные уровни поддержки:</p>
                        <ul className="space-y-2 list-disc list-inside text-sm pl-2">
                            <li>Они добирают позицию на просадках</li>
                            <li>Защищают свою среднюю цену входа</li>
                            <li>Используют лимитные заявки в определённых зонах</li>
                        </ul>
                        <div className={`mt-4 p-4 rounded-xl border-l-4 ${theme === 'dark' ? 'bg-[#4E6E49]/5 border-[#4E6E49]/50' : 'bg-[#4E6E49]/5 border-[#4E6E49]/30'}`}>
                            <p className="text-sm italic">
                                <strong>Ключевая идея:</strong> Если топ-10 или топ-25 кошельки стабильно покупают в узком диапазоне — это зона высокой вероятности отскока.
                            </p>
                        </div>
                    </StrategyStep>

                    <StrategyStep
                        number={2}
                        title="Данные по держателям"
                        icon={<Wallet className="w-5 h-5" />}
                        isOpen={openStep === 2}
                        onToggle={() => toggleStep(2)}
                    >
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-bold mb-2">Где получить данные</h4>
                                <p className="text-sm">Используйте терминал с линией топ-10 и топ-25, например <strong>GMGN</strong>.</p>
                                <a 
                                    href="https://gmgn.ai/r/Mxam3xgW" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-sm text-[#4E6E49] hover:underline mt-1"
                                >
                                    GMGN Terminal <ArrowUpRight className="w-3 h-3" />
                                </a>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Топ-10</p>
                                    <p className={`text-lg font-black ${headingColor}`}>Крупнейшие держатели</p>
                                    <p className="text-xs text-gray-500 mt-1">Исключаем MM, контракты, CEX</p>
                                </div>
                                <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Топ-25</p>
                                    <p className={`text-lg font-black ${headingColor}`}>Средние держатели</p>
                                    <p className="text-xs text-gray-500 mt-1">Вторая волна накопления</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-bold mb-2">Что отслеживать</h4>
                                <ul className="space-y-1 list-disc list-inside text-sm pl-2">
                                    <li>Средняя цена входа каждого крупного кошелька</li>
                                    <li>Диапазоны, в которых они докупали за последние 24–72 часа</li>
                                    <li>Объём текущей позиции и изменение доли</li>
                                </ul>
                            </div>
                        </div>
                    </StrategyStep>

                    <StrategyStep
                        number={3}
                        title="Зона поддержки: как определить"
                        icon={<ShieldCheck className="w-5 h-5" />}
                        isOpen={openStep === 3}
                        onToggle={() => toggleStep(3)}
                    >
                        <p className="mb-4">Уровень считается сильным при выполнении следующих условий:</p>
                        
                        <div className="space-y-3">
                            <div className={`flex items-start gap-3 p-3 rounded-xl ${theme === 'dark' ? 'bg-emerald-500/5 border border-emerald-500/20' : 'bg-emerald-50 border border-emerald-500/20'}`}>
                                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold text-sm">Консенсус покупок</p>
                                    <p className="text-xs">Минимум 2–3 кошелька из топ-10/топ-25 покупали в одном диапазоне (разница 5–10%)</p>
                                </div>
                            </div>
                            <div className={`flex items-start gap-3 p-3 rounded-xl ${theme === 'dark' ? 'bg-emerald-500/5 border border-emerald-500/20' : 'bg-emerald-50 border border-emerald-500/20'}`}>
                                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold text-sm">Тест уровня</p>
                                    <p className="text-xs">Цена подходила к зоне минимум 2 раза и отскакивала</p>
                                </div>
                            </div>
                            <div className={`flex items-start gap-3 p-3 rounded-xl ${theme === 'dark' ? 'bg-emerald-500/5 border border-emerald-500/20' : 'bg-emerald-50 border border-emerald-500/20'}`}>
                                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold text-sm">Объём</p>
                                    <p className="text-xs">Объёмы в зоне выше среднего за последние сутки</p>
                                </div>
                            </div>
                            <div className={`flex items-start gap-3 p-3 rounded-xl ${theme === 'dark' ? 'bg-emerald-500/5 border border-emerald-500/20' : 'bg-emerald-50 border border-emerald-500/20'}`}>
                                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold text-sm">Отсутствие продаж</p>
                                    <p className="text-xs">Крупные кошельки не выводили и не продавали на подходе к уровню</p>
                                </div>
                            </div>
                        </div>
                    </StrategyStep>

                    <StrategyStep
                        number={4}
                        title="Точки входа"
                        icon={<Target className="w-5 h-5" />}
                        isOpen={openStep === 4}
                        onToggle={() => toggleStep(4)}
                    >
                        <div className="space-y-6">
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <ArrowDownRight className="w-4 h-4 text-blue-400" />
                                    <h4 className="font-bold">Вариант 1. Лимитный ордер в зону</h4>
                                </div>
                                <ul className="space-y-2 list-disc list-inside text-sm pl-2">
                                    <li>Выставляем лимитку чуть выше средней цены покупок топ-10/топ-25</li>
                                    <li>Стоп-лосс: <span className="text-rose-400 font-bold">25-50% ниже</span> зоны накопления</li>
                                    <li>Если крупные игроки ошиблись или рынок сломал уровень — выходим</li>
                                </ul>
                            </div>

                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <ArrowUpRight className="w-4 h-4 text-purple-400" />
                                    <h4 className="font-bold">Вариант 2. Подтверждение после касания</h4>
                                </div>
                                <ul className="space-y-2 list-disc list-inside text-sm pl-2">
                                    <li>Ждём, когда цена коснётся зоны</li>
                                    <li>Дожидаемся формирования свечного разворота</li>
                                    <li>Входим по рынку после подтверждения</li>
                                </ul>
                            </div>
                        </div>
                    </StrategyStep>

                    <StrategyStep
                        number={5}
                        title="Тейк‑профит (TP)"
                        icon={<Calculator className="w-5 h-5" />}
                        isOpen={openStep === 5}
                        onToggle={() => toggleStep(5)}
                    >
                        <p className="mb-4">В мемкоинах цели рассчитываем не в процентах, а по зонам:</p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-emerald-50 border-emerald-500/20'}`}>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 mb-1">TP1</p>
                                <p className={`text-lg font-black ${headingColor}`}>+20–30%</p>
                                <p className="text-xs text-gray-500 mt-1">Ближайший локальный хай или зона фиксации мелких держателей</p>
                            </div>
                            <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-[#4E6E49]/5 border-[#4E6E49]/20' : 'bg-[#4E6E49]/5 border-[#4E6E49]/20'}`}>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-[#4E6E49] mb-1">TP2</p>
                                <p className={`text-lg font-black ${headingColor}`}>+50–80%</p>
                                <p className="text-xs text-gray-500 mt-1">Следующая зона крупных продаж (по дельте объёмов)</p>
                            </div>
                            <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-purple-500/5 border-purple-500/20' : 'bg-purple-50 border-purple-500/20'}`}>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-purple-500 mb-1">TP3</p>
                                <p className={`text-lg font-black ${headingColor}`}>x2+</p>
                                <p className="text-xs text-gray-500 mt-1">Обновление локального максимума (только при агрессивном рынке)</p>
                            </div>
                        </div>

                        <div className={`mt-4 p-4 rounded-xl border-l-4 border-amber-500 ${theme === 'dark' ? 'bg-amber-500/5 border-amber-500/50' : 'bg-amber-50 border-amber-500/30'}`}>
                            <p className="text-sm">
                                <strong>Важно:</strong> Если цена дошла до TP2 и крупные кошельки начали выводить — фиксируем минимум 70–80% позиции.
                            </p>
                        </div>
                    </StrategyStep>

                    <StrategyStep
                        number={6}
                        title="Когда НЕ входить"
                        icon={<XCircle className="w-5 h-5" />}
                        isOpen={openStep === 6}
                        onToggle={() => toggleStep(6)}
                    >
                        <p className="mb-4">Стратегия даёт пропускать сделки в таких случаях:</p>
                        
                        <div className="space-y-3">
                            <div className={`flex items-start gap-3 p-3 rounded-xl ${theme === 'dark' ? 'bg-rose-500/5 border border-rose-500/20' : 'bg-rose-50 border border-rose-500/20'}`}>
                                <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold text-sm">Продажи на подходе</p>
                                    <p className="text-xs">Топ-10 держатели продают на подходе к уровню (видно по исходящим tx)</p>
                                </div>
                            </div>
                            <div className={`flex items-start gap-3 p-3 rounded-xl ${theme === 'dark' ? 'bg-rose-500/5 border border-rose-500/20' : 'bg-rose-50 border border-rose-500/20'}`}>
                                <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold text-sm">Рост доли без роста цены</p>
                                    <p className="text-xs">Доля топ-10 растёт без роста цены — возможно, доливают в падающем рынке</p>
                                </div>
                            </div>
                            <div className={`flex items-start gap-3 p-3 rounded-xl ${theme === 'dark' ? 'bg-rose-500/5 border border-rose-500/20' : 'bg-rose-50 border border-rose-500/20'}`}>
                                <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold text-sm">Падение объёмов</p>
                                    <p className="text-xs">Объёмы падают при касании уровня — нет интереса</p>
                                </div>
                            </div>
                            <div className={`flex items-start gap-3 p-3 rounded-xl ${theme === 'dark' ? 'bg-rose-500/5 border border-rose-500/20' : 'bg-rose-50 border border-rose-500/20'}`}>
                                <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold text-sm">Нет единой зоны</p>
                                    <p className="text-xs">Разница между крупнейшими кошельками слишком большая (&gt;25% в цене входа)</p>
                                </div>
                            </div>
                        </div>
                    </StrategyStep>
                </div>

                {/* Sidebar: Quick Reference */}
                <div className="space-y-6">
                    {/* Entry Conditions */}
                    <div className={`rounded-2xl p-6 border ${theme === 'dark' ? 'bg-[#151a21]/80 border-white/5' : 'bg-white border-gray-100'
                        } shadow-lg space-y-4`}>
                        <div className="flex items-center gap-3">
                            <Eye className={`w-6 h-6 text-blue-400`} />
                            <h3 className={`text-lg font-black ${headingColor}`}>Условия входа</h3>
                        </div>

                        <div className="space-y-3">
                            <div className={`flex items-center gap-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                <span>2-3 кошелька из топ-10/25 покупали в одном диапазоне</span>
                            </div>
                            <div className={`flex items-center gap-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                <span>Цена тестировала зону 2+ раз</span>
                            </div>
                            <div className={`flex items-center gap-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                <span>Объёмы выше среднего</span>
                            </div>
                            <div className={`flex items-center gap-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                <span>Нет исходящих транзакций от крупняка</span>
                            </div>
                        </div>
                    </div>

                    {/* Risk Management */}
                    <div className={`rounded-2xl p-6 border ${theme === 'dark' ? 'bg-[#4E6E49]/5 border-[#4E6E49]/20' : 'bg-[#4E6E49]/5 border-[#4E6E49]/20'
                        } shadow-lg space-y-4`}>
                        <div className="flex items-center gap-3">
                            <AlertCircle className={`w-6 h-6 text-[#4E6E49]`} />
                            <h3 className={`text-lg font-black ${headingColor}`}>Риск-менеджмент</h3>
                        </div>

                        <div className="space-y-3">
                            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                <p className="text-xs text-gray-500 mb-1">Стоп-лосс</p>
                                <p className="font-bold text-rose-400">-25% ... -50%</p>
                                <p className="text-xs text-gray-500 mt-1">Ниже зоны накопления</p>
                            </div>
                            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                <p className="text-xs text-gray-500 mb-1">Фиксация на TP2</p>
                                <p className="font-bold text-amber-500">70-80%</p>
                                <p className="text-xs text-gray-500 mt-1">При начале вывода крупняка</p>
                            </div>
                        </div>
                    </div>

                    {/* Tools */}
                    <div className={`rounded-2xl p-6 border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
                        } shadow-lg space-y-4`}>
                        <div className="flex items-center gap-3">
                            <BarChart3 className={`w-6 h-6 text-[#4E6E49]`} />
                            <h3 className={`text-lg font-black ${headingColor}`}>Инструменты</h3>
                        </div>
                        
                        <div className="space-y-2">
                            <a 
                                href="https://gmgn.ai/r/Mxam3xgW" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className={`block p-3 rounded-xl transition-colors ${theme === 'dark' ? 'bg-white/5 hover:bg-white/10' : 'bg-white hover:bg-gray-100'} border ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}
                            >
                                <p className="font-bold text-sm">GMGN Terminal</p>
                                <p className="text-xs text-gray-500">Топ-10/25 линия, анализ кошельков</p>
                            </a>
                            <a 
                                href="https://bubblemaps.io" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className={`block p-3 rounded-xl transition-colors ${theme === 'dark' ? 'bg-white/5 hover:bg-white/10' : 'bg-white hover:bg-gray-100'} border ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}
                            >
                                <p className="font-bold text-sm">Bubblemaps</p>
                                <p className="text-xs text-gray-500">Визуализация связей кошельков</p>
                            </a>
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
                        <h4 className={`text-lg font-black ${headingColor}`}>Итоговая логика</h4>
                        <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            Стратегия работает на принципе "умных денег" — крупные держатели защищают свои позиции и создают уровни поддержки. Задача трейдера — идентифицировать эти зоны и войти вместе с крупняком, а не против него. Всегда проверяйте исходящие транзакции перед входом!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
