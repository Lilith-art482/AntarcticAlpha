import React, { useState } from 'react'
import { useThemeStore } from '@/store/themeStore'
import {
    Calculator,
    TrendingUp,
    ChevronDown,
    ChevronUp,
    AlertCircle,
    Search,
    BarChart3,
    XCircle,
    Lightbulb,
    Users,
    DollarSign,
    Zap,
    CheckCircle2,
    Clock,
    Target
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

export const AVAArbitrageStrategy: React.FC = () => {
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
                        <Calculator className={`w-12 h-12 ${theme === 'dark' ? 'text-[#4E6E49]' : 'text-[#4E6E49]'}`} />
                    </div>
                    <div className="flex-1 space-y-4">
                        <h2 className={`text-2xl md:text-3xl font-black ${headingColor}`}>AVA — Арбитраж</h2>
                        <p className={`text-lg leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            Чистая математика на прогнозных рынках. Стратегия без прогнозов, без веры в исход и без субъективного анализа. Мы зарабатываем исключительно на ценовых дисбалансах между позициями YES и NO в одном и том же маркете.
                        </p>
                        <div className={`flex flex-wrap gap-4 pt-2`}>
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${theme === 'dark' ? 'bg-white/5 text-gray-400 border border-white/10' : 'bg-gray-100 text-gray-600 border border-gray-200'
                                }`}>
                                <Calculator className="w-3.5 h-3.5" />
                                PURE MATH
                            </div>
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${theme === 'dark' ? 'bg-white/5 text-gray-400 border border-white/10' : 'bg-gray-100 text-gray-600 border border-gray-200'
                                }`}>
                                <Zap className="w-3.5 h-3.5" />
                                NO PREDICTIONS
                            </div>
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${theme === 'dark' ? 'bg-white/10 text-[#4E6E49] border border-[#4E6E49]/20' : 'bg-[#4E6E49]/5 text-[#4E6E49] border border-[#4E6E49]/20'
                                }`}>
                                <Target className="w-3.5 h-3.5" />
                                GUARANTEED PROFIT
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Basic Principle */}
            <div className={`rounded-2xl p-6 border-l-8 ${theme === 'dark' ? 'bg-[#4E6E49]/5 border-[#4E6E49]/50' : 'bg-[#4E6E49]/5 border-[#4E6E49]/30'
                }`}>
                <div className="flex gap-4 items-start">
                    <Lightbulb className="w-8 h-8 text-[#4E6E49] shrink-0" />
                    <div className="space-y-3">
                        <h4 className={`text-lg font-black ${headingColor}`}>Базовый принцип</h4>
                        <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            В любом рынке при разрешении: <strong>YES = $1.00, NO = $0.00</strong> или <strong>YES = $0.00, NO = $1.00</strong>
                        </p>
                        <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            Это означает, что одна из позиций всегда стоит $1.00. Если вы купили обе позиции дешевле $1.00 в сумме, разница — ваша прибыль.
                        </p>
                        <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-white'} border ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}>
                            <p className="text-xs font-bold uppercase tracking-wider text-[#4E6E49] mb-2">Условие арбитража</p>
                            <p className={`text-xl font-black font-mono ${headingColor}`}>YES + NO &lt; $1.00</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Example */}
            <div className={`rounded-3xl p-8 border ${theme === 'dark'
                ? 'bg-gradient-to-br from-[#1a212a] to-[#0f1216] border-[#4E6E49]/20'
                : 'bg-gradient-to-br from-white to-[#4E6E49]/5 border-[#4E6E49]/10'
                } shadow-xl`}>
                <h3 className={`text-xl font-black ${headingColor} mb-6 flex items-center gap-3`}>
                    <BarChart3 className="w-6 h-6 text-[#4E6E49]" />
                    Пример арбитража
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm font-bold mb-3">📊 Рынок</p>
                            <div className="grid grid-cols-2 gap-3">
                                <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">YES</p>
                                    <p className={`text-2xl font-black ${headingColor}`}>$0.45</p>
                                </div>
                                <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">NO</p>
                                    <p className={`text-2xl font-black ${headingColor}`}>$0.50</p>
                                </div>
                            </div>
                            <div className={`mt-3 p-3 rounded-xl ${theme === 'dark' ? 'bg-[#4E6E49]/10' : 'bg-[#4E6E49]/5'}`}>
                                <p className="text-xs text-gray-500">Сумма</p>
                                <p className={`text-lg font-black ${headingColor}`}>$0.45 + $0.50 = $0.95</p>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm font-bold mb-3">💰 Результат</p>
                            <div className={`p-4 rounded-xl border-2 ${theme === 'dark' ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-emerald-50 border-emerald-500/30'}`}>
                                <p className="text-xs text-gray-500 mb-2">При разрешении одна позиция = $1.00</p>
                                <p className={`text-lg font-black text-emerald-500 mb-1`}>Прибыль: $0.05</p>
                                <p className={`text-sm font-bold ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>Доходность: 5.26%</p>
                            </div>
                            <p className={`text-xs italic mt-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                Никаких «если». Никаких сценариев. Чистая математика.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Steps */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                        <BarChart3 className={`w-6 h-6 ${theme === 'dark' ? 'text-[#4E6E49]' : 'text-[#4E6E49]'}`} />
                        <h3 className={`text-xl font-black ${headingColor}`}>Как применять — пошагово</h3>
                    </div>

                    <StrategyStep
                        number={1}
                        title="Выбор маркета"
                        icon={<Search className="w-5 h-5" />}
                        isOpen={openStep === 1}
                        onToggle={() => toggleStep(1)}
                    >
                        <p>Критерии отбора подходящего рынка:</p>
                        <ul className="space-y-2 list-disc list-inside text-sm pl-2">
                            <li><strong>Активный рынок</strong> с торговлей по обеим сторонам</li>
                            <li><strong>Достаточная ликвидность</strong> по YES и NO</li>
                            <li><strong>Чёткие условия разрешения</strong> без двусмысленности</li>
                        </ul>
                    </StrategyStep>

                    <StrategyStep
                        number={2}
                        title="Проверка цен"
                        icon={<DollarSign className="w-5 h-5" />}
                        isOpen={openStep === 2}
                        onToggle={() => toggleStep(2)}
                    >
                        <p>Фиксация текущих цен обеих позиций:</p>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Цена YES</p>
                                <p className="text-xs text-gray-500 mt-2">Текущая цена позиции YES</p>
                            </div>
                            <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Цена NO</p>
                                <p className="text-xs text-gray-500 mt-2">Текущая цена позиции NO</p>
                            </div>
                        </div>
                    </StrategyStep>

                    <StrategyStep
                        number={3}
                        title="Расчёт"
                        icon={<Calculator className="w-5 h-5" />}
                        isOpen={openStep === 3}
                        onToggle={() => toggleStep(3)}
                    >
                        <p>Проверка условия арбитража:</p>
                        <div className={`mt-4 p-5 rounded-xl border-2 ${theme === 'dark' ? 'bg-[#4E6E49]/10 border-[#4E6E49]/30' : 'bg-[#4E6E49]/5 border-[#4E6E49]/30'}`}>
                            <p className="text-sm font-bold mb-3 flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-[#4E6E49]" />
                                Условие арбитража
                            </p>
                            <p className={`text-xl font-black font-mono ${headingColor} mb-2`}>YES + NO &lt; $1.00</p>
                            <p className="text-xs text-gray-500">Если условие выполнено → потенциальный арбитраж</p>
                        </div>
                    </StrategyStep>

                    <StrategyStep
                        number={4}
                        title="Учёт комиссий"
                        icon={<AlertCircle className="w-5 h-5" />}
                        isOpen={openStep === 4}
                        onToggle={() => toggleStep(4)}
                    >
                        <p>Обязательно учитывайте все издержки:</p>
                        <div className="space-y-3 mt-4">
                            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                <h4 className="font-bold text-sm mb-1">💳 Комиссия платформы</h4>
                                <p className="text-xs text-gray-500">Polymarket берёт комиссию с каждой сделки</p>
                            </div>
                            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                <h4 className="font-bold text-sm mb-1">⛓️ Комиссия сети</h4>
                                <p className="text-xs text-gray-500">Gas fees за транзакции в блокчейне</p>
                            </div>
                            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                <h4 className="font-bold text-sm mb-1">📊 Проскальзывание</h4>
                                <p className="text-xs text-gray-500">Разница между ожидаемой и фактической ценой</p>
                            </div>
                        </div>
                    </StrategyStep>

                    <StrategyStep
                        number={5}
                        title="Одновременный вход"
                        icon={<Zap className="w-5 h-5" />}
                        isOpen={openStep === 5}
                        onToggle={() => toggleStep(5)}
                    >
                        <p>Критически важно:</p>
                        <div className={`mt-4 p-4 rounded-xl border-l-4 ${theme === 'dark' ? 'bg-[#4E6E49]/5 border-[#4E6E49]/50' : 'bg-[#4E6E49]/5 border-[#4E6E49]/30'}`}>
                            <p className="text-sm font-bold mb-2">⚡ Покупка обеих сторон максимально близко по времени</p>
                            <p className="text-xs text-gray-500">
                                Если между покупками пройдёт время, цены могут измениться и арбитраж исчезнет
                            </p>
                        </div>
                    </StrategyStep>

                    <StrategyStep
                        number={6}
                        title="Фиксация"
                        icon={<Clock className="w-5 h-5" />}
                        isOpen={openStep === 6}
                        onToggle={() => toggleStep(6)}
                    >
                        <p>После входа в позицию:</p>
                        <div className={`mt-4 p-4 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                            <p className="text-sm">
                                Просто ждёте разрешения рынка. Никаких действий не требуется — математика работает за вас.
                            </p>
                        </div>
                    </StrategyStep>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Key Formula */}
                    <div className={`rounded-2xl p-6 border ${theme === 'dark' ? 'bg-[#151a21]/80 border-white/5' : 'bg-white border-gray-100'
                        } shadow-lg space-y-4`}>
                        <div className="flex items-center gap-3">
                            <Calculator className={`w-6 h-6 text-[#4E6E49]`} />
                            <h3 className={`text-lg font-black ${headingColor}`}>Ключевая формула</h3>
                        </div>

                        <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-[#4E6E49]/10' : 'bg-[#4E6E49]/5'} border ${theme === 'dark' ? 'border-[#4E6E49]/20' : 'border-[#4E6E49]/20'}`}>
                            <p className="text-xs text-gray-500 mb-2">Прибыль =</p>
                            <p className={`text-sm font-black font-mono ${headingColor} leading-relaxed`}>
                                1 − (YES + NO) − Комиссии
                            </p>
                        </div>

                        <div className="space-y-2 text-xs">
                            <p className={`flex items-start gap-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                <CheckCircle2 className="w-4 h-4 text-[#4E6E49] shrink-0 mt-0.5" />
                                <span>Результат положительный → сделка имеет смысл</span>
                            </p>
                            <p className={`flex items-start gap-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                <XCircle className="w-4 h-4 text-[#4E6E49] shrink-0 mt-0.5" />
                                <span>Результат отрицательный → пропуск, без эмоций</span>
                            </p>
                        </div>
                    </div>

                    {/* Why It Works */}
                    <div className={`rounded-2xl p-6 border ${theme === 'dark' ? 'bg-[#4E6E49]/5 border-[#4E6E49]/20' : 'bg-[#4E6E49]/5 border-[#4E6E49]/20'
                        } shadow-lg space-y-4`}>
                        <div className="flex items-center gap-3">
                            <TrendingUp className={`w-6 h-6 text-[#4E6E49]`} />
                            <h3 className={`text-lg font-black ${headingColor}`}>Почему работает</h3>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Асинхронность ордеров</p>
                                <p className="text-xs text-gray-500">
                                    Цены YES и NO формируются разными участниками и не всегда синхронизированы
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Поведенческие искажения</p>
                                <ul className="space-y-1 text-xs text-gray-500">
                                    <li>• Перекос в сторону популярного исхода</li>
                                    <li>• Массовые ставки без пересчёта</li>
                                    <li>• Паника, FOMO, резкие новости</li>
                                </ul>
                            </div>

                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Ручной рынок</p>
                                <p className="text-xs text-gray-500">
                                    Нет идеального маркет-мейкинга → арбитражные окна появляются регулярно
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Red Flags */}
                    <div className={`rounded-2xl p-6 border ${theme === 'dark' ? 'bg-[#4E6E49]/5 border-[#4E6E49]/20' : 'bg-[#4E6E49]/5 border-[#4E6E49]/20'
                        } shadow-lg space-y-4`}>
                        <div className="flex items-center gap-3">
                            <AlertCircle className={`w-6 h-6 text-[#4E6E49]`} />
                            <h3 className={`text-lg font-black ${headingColor}`}>Красные флаги</h3>
                        </div>
                        <div className={`space-y-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-xs`}>
                            <p className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#4E6E49]/50 mt-1.5 shrink-0"></span>
                                <span>Сумма &lt; $1.00, но после комиссий ≥ $1.00</span>
                            </p>
                            <p className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#4E6E49]/50 mt-1.5 shrink-0"></span>
                                <span>Недостаточная ликвидность → частичное исполнение</span>
                            </p>
                            <p className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#4E6E49]/50 mt-1.5 shrink-0"></span>
                                <span>Большой спред в стакане</span>
                            </p>
                            <p className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#4E6E49]/50 mt-1.5 shrink-0"></span>
                                <span>Вы купили одну сторону, вторая «убежала»</span>
                            </p>
                            <p className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#4E6E49]/50 mt-1.5 shrink-0"></span>
                                <span>Маркет с неочевидными условиями разрешения</span>
                            </p>
                        </div>
                        <p className={`text-xs font-bold ${theme === 'dark' ? 'text-[#4E6E49]' : 'text-[#4E6E49]'} pt-2`}>
                            Стратегия убивается не рынком, а плохим исполнением.
                        </p>
                    </div>

                    {/* Who It's For */}
                    <div className={`rounded-2xl p-6 border ${theme === 'dark' ? 'bg-purple-500/5 border-purple-500/20' : 'bg-purple-50 border-purple-500/20'
                        } shadow-lg space-y-4`}>
                        <div className="flex items-center gap-3">
                            <Users className={`w-6 h-6 text-purple-500`} />
                            <h3 className={`text-lg font-black ${headingColor}`}>Кому подходит</h3>
                        </div>
                        <div className={`space-y-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-xs`}>
                            <p className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                                Любители точных расчётов
                            </p>
                            <p className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                                Работа с цифрами, а не мнениями
                            </p>
                            <p className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                                Ценители предсказуемости
                            </p>
                            <p className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                                0.5–3% стабильно &gt; 50% случайно
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* When to Use */}
            <div className={`rounded-2xl p-6 border ${theme === 'dark' ? 'bg-[#4E6E49]/5 border-[#4E6E49]/20' : 'bg-[#4E6E49]/5 border-[#4E6E49]/20'
                }`}>
                <h4 className={`text-lg font-black ${headingColor} mb-4`}>Когда использовать</h4>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                    Стратегия особенно эффективна:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-white'}`}>
                        <p className="text-xs">📈 На волатильных рынках</p>
                    </div>
                    <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-white'}`}>
                        <p className="text-xs">📰 При резких новостях</p>
                    </div>
                    <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-white'}`}>
                        <p className="text-xs">🎯 В нишевых маркетах</p>
                    </div>
                    <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-white'}`}>
                        <p className="text-xs">👥 Когда толпа двигает одну сторону</p>
                    </div>
                </div>
                <p className={`text-xs italic mt-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
                    Это стратегия не про ожидание, а про момент входа.
                </p>
            </div>

            {/* Final Logic Footer */}
            <div className={`rounded-2xl p-6 border-l-8 ${theme === 'dark' ? 'bg-[#0b1015] border-[#4E6E49]/50' : 'bg-gray-50 border-[#4E6E49]/30'
                }`}>
                <div className="flex gap-4 items-start">
                    <Calculator className="w-8 h-8 text-[#4E6E49] shrink-0" />
                    <div className="space-y-2">
                        <h4 className={`text-lg font-black ${headingColor}`}>Итоговая логика стратегии</h4>
                        <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            AVA Арбитраж — это не ставка на исход, а эксплуатация математической неэффективности рынка. Вы не угадываете будущее — вы фиксируете гарантированную разницу между текущей ценой и финальным результатом. Единственный риск — ошибка в исполнении.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
