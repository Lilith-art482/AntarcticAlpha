import React, { useState } from 'react'
import { useThemeStore } from '@/store/themeStore'
import {
    RefreshCw,
    Target,
    AlertCircle,
    Zap,
    ArrowUpRight,
    Layers,
    Clock,
    BarChart2,
    Activity,
    Brain,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    LineChart,
    Waves,
    Crosshair,
    TrendingUp // Возвращаем импорт TrendingUp
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

export const AvfBreakoutRetestStrategy: React.FC = () => {
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
                        <RefreshCw className={`w-12 h-12 ${theme === 'dark' ? 'text-[#4E6E49]' : 'text-[#4E6E49]'}`} />
                    </div>
                    <div className="flex-1 space-y-4">
                        <h2 className={`text-2xl md:text-3xl font-black ${headingColor}`}>ARCA — Пробой с возвратом</h2>
                        <p className={`text-lg leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            Работаем не на сам пробой, а на подтверждение того, что рынок действительно выбрал направление. Эта стратегия хорошо дополняет тренд-фолловинг.
                        </p>
                        <div className={`flex flex-wrap gap-4 pt-2`}>
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${theme === 'dark' ? 'bg-white/5 text-gray-400 border border-white/10' : 'bg-gray-100 text-gray-600 border border-gray-200'
                                }`}>
                                <Activity className="w-3.5 h-3.5" />
                                BREAKOUT CONFIRMATION
                            </div>
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${theme === 'dark' ? 'bg-white/5 text-gray-400 border border-white/10' : 'bg-gray-100 text-gray-600 border border-gray-200'
                                }`}>
                                <Brain className="w-3.5 h-3.5" />
                                STRUCTURE ANALYSIS
                            </div>
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${theme === 'dark' ? 'bg-[#4E6E49]/10 text-[#4E6E49] border border-[#4E6E49]/20' : 'bg-[#4E6E49]/5 text-[#4E6E49] border border-[#4E6E49]/20'
                                }`}>
                                <Target className="w-3.5 h-3.5" />
                                MARKET EDGE
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Key Principle */}
            <div className={`rounded-2xl p-6 border-l-8 ${theme === 'dark' ? 'bg-[#4E6E49]/5 border-[#4E6E49]/50' : 'bg-[#4E6E49]/5 border-[#4E6E49]/30'
                }`}>
                <div className="flex gap-4 items-start">
                    <Brain className="w-8 h-8 text-[#4E6E49] shrink-0" />
                    <div className="space-y-2">
                        <h4 className={`text-lg font-black ${headingColor}`}>В чём здесь логика</h4>
                        <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            Когда рынок долго стоит в диапазоне, внутри него накапливаются позиции. Одни покупают, другие продают, но цена никуда не уходит. В какой-то момент баланс ломается — появляется импульс. Пробой сам по себе ещё ничего не гарантирует. Важно другое: готов ли рынок принять новый уровень как нормальный. Именно это мы и проверяем через возврат.
                        </p>
                        <div className={`mt-4 p-4 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-white'} border border-[#4E6E49]/20`}>
                            <p className="text-sm font-bold text-[#4E6E49] mb-2">Дополнение тренд-фолловинга:</p>
                            <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
                                <span className="px-2 py-1 bg-[#4E6E49]/10 rounded-lg text-[#4E6E49]">Тренд-фолловинг</span>
                                <span className="text-gray-400">→</span>
                                <span className="px-2 py-1 bg-[#4E6E49]/10 rounded-lg text-[#4E6E49]">Зарабатывает на продолжении</span>
                                <span className="text-gray-400">→</span>
                                <span className="px-2 py-1 bg-[#4E6E49]/10 rounded-lg text-[#4E6E49]">Мы подключаемся в начале движения</span>
                            </div>
                        </div>
                        <p className={`text-sm mt-4 italic ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                            Если первая стратегия зарабатывает на продолжении движения, то здесь мы подключаемся в момент, когда рынок только начинает идти.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Steps */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                        <LineChart className={`w-6 h-6 ${theme === 'dark' ? 'text-[#4E6E49]' : 'text-[#4E6E49]'}`} />
                        <h3 className={`text-xl font-black ${headingColor}`}>Как применять стратегию</h3>
                    </div>

                    <StrategyStep
                        number={1}
                        title="Что мы считаем диапазоном"
                        icon={<Waves className="w-5 h-5" />}
                        isOpen={openStep === 1}
                        onToggle={() => toggleStep(1)}
                    >
                        <p>Перед входом мы всегда видим диапазон. Это:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                            <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-[#4E6E49]/10 border-[#4E6E49]/30' : 'bg-[#4E6E49]/5 border-[#4E6E49]/20'}`}>
                                <div className="flex items-center gap-2 mb-2">
                                    <Crosshair className="w-5 h-5 text-[#4E6E49]" />
                                    <p className="font-bold text-sm">Узкий коридор</p>
                                </div>
                                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Цена ходит в узком коридоре, верх и низ читаются без фантазии, несколько касаний границ, волатильность сжимается.
                                </p>
                            </div>
                            <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-rose-500/10 border-rose-500/30' : 'bg-rose-50 border-rose-500/20'}`}>
                                <div className="flex items-center gap-2 mb-2">
                                    <AlertCircle className="w-5 h-5 text-rose-500" />
                                    <p className="font-bold text-sm">Что мы НЕ берём</p>
                                </div>
                                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Если диапазон «рваный» и постоянно расширяется — мы его не трогаем. Это может быть накопление перед сессией, перед новостями или просто пауза после движения.
                                </p>
                            </div>
                        </div>
                        <div className={`mt-4 p-4 rounded-xl border-l-4 ${theme === 'dark' ? 'bg-amber-500/10 border-amber-500/50' : 'bg-amber-50 border-amber-500/30'}`}>
                            <p className="text-sm">
                                <strong>Важно:</strong> Диапазон должен быть чётким, с понятными границами, которые легко определить визуально.
                            </p>
                        </div>
                    </StrategyStep>

                    <StrategyStep
                        number={2}
                        title="Что мы считаем пробоем"
                        icon={<Zap className="w-5 h-5" />}
                        isOpen={openStep === 2}
                        onToggle={() => toggleStep(2)}
                    >
                        <p>Для нас пробой — это не просто свеча за уровнем. Мы ждём:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                            <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-[#4E6E49]/10 border-[#4E6E49]/30' : 'bg-[#4E6E49]/5 border-[#4E6E49]/20'}`}>
                                <div className="flex items-center gap-2 mb-2">
                                    <ArrowUpRight className="w-5 h-5 text-[#4E6E49]" />
                                    <p className="font-bold text-sm">Выход за границу</p>
                                </div>
                                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Цена выходит за границу диапазона
                                </p>
                            </div>
                            <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-[#4E6E49]/10 border-[#4E6E49]/30' : 'bg-[#4E6E49]/5 border-[#4E6E49]/20'}`}>
                                <div className="flex items-center gap-2 mb-2">
                                    <Activity className="w-5 h-5 text-[#4E6E49]" />
                                    <p className="font-bold text-sm">Импульсное движение</p>
                                </div>
                                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Должен быть импульс, а не простое «выползание»
                                </p>
                            </div>
                            <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-[#4E6E49]/10 border-[#4E6E49]/30' : 'bg-[#4E6E49]/5 border-[#4E6E49]/20'}`}>
                                <div className="flex items-center gap-2 mb-2">
                                    <BarChart2 className="w-5 h-5 text-[#4E6E49]" />
                                    <p className="font-bold text-sm">Рост объёма</p>
                                </div>
                                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Желательно — рост объёма на пробое
                                </p>
                            </div>
                        </div>
                        <div className={`mt-4 p-4 rounded-xl border-l-4 ${theme === 'dark' ? 'bg-rose-500/10 border-rose-500/50' : 'bg-rose-50 border-rose-500/30'}`}>
                            <p className="text-sm">
                                <strong>Важно:</strong> Если цена «выползает» за уровень без энергии, такой пробой нас не интересует.
                            </p>
                        </div>
                    </StrategyStep>

                    <StrategyStep
                        number={3}
                        title="Почему мы не входим сразу"
                        icon={<AlertCircle className="w-5 h-5" />}
                        isOpen={openStep === 3}
                        onToggle={() => toggleStep(3)}
                    >
                        <p>Потому что значительная часть пробоев — ложные. Рынок часто выносит стопы за границей диапазона и возвращается обратно.</p>
                        <div className={`mt-4 p-4 rounded-xl ${theme === 'dark' ? 'bg-rose-500/10 border border-rose-500/20' : 'bg-rose-50 border border-rose-500/20'}`}>
                            <p className="text-sm font-bold text-rose-500 mb-2">Почему пробои ломаются:</p>
                            <ul className="space-y-1 text-xs text-gray-500">
                                <li>• Маркетмейкеры выносят стопы за границей диапазона</li>
                                <li>• Трейдеры входят «на пробой» и создают давление</li>
                                <li>• Крупные игроки разворачивают рынок в обратную сторону</li>
                                <li>• Истинный пробой требует подтверждения</li>
                            </ul>
                        </div>
                        <p className={`text-sm mt-4 italic ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                            Поэтому мы не покупаем сам пробой. Мы ждём, что рынок сделает дальше.
                        </p>
                    </StrategyStep>

                    <StrategyStep
                        number={4}
                        title="Что такое ретест"
                        icon={<RefreshCw className="w-5 h-5" />}
                        isOpen={openStep === 4}
                        onToggle={() => toggleStep(4)}
                    >
                        <p>После пробоя цена возвращается к уровню, который раньше был границей диапазона. Важно, <strong>как именно</strong> она возвращается:</p>
                        <div className="grid grid-cols-1 gap-4 mt-4">
                            <div className={`p-4 rounded-xl border-2 ${theme === 'dark' ? 'bg-[#4E6E49]/10 border-[#4E6E49]/30' : 'bg-[#4E6E49]/5 border-[#4E6E49]/30'}`}>
                                <div className="flex items-center gap-2 mb-3">
                                    <CheckCircle2 className="w-5 h-5 text-[#4E6E49]" />
                                    <p className="font-bold text-sm">Признаки качественного ретеста</p>
                                </div>
                                <ul className="space-y-1 text-xs text-gray-500">
                                    <li>• Возврат без агрессии</li>
                                    <li>• Без резких объёмов против движения</li>
                                    <li>• Часто медленно, с паузами</li>
                                    <li>• Уровень удерживается и рынок не «проваливается» обратно в диапазон</li>
                                </ul>
                            </div>
                        </div>
                        <div className={`mt-4 p-4 rounded-xl border-l-4 ${theme === 'dark' ? 'bg-[#4E6E49]/10 border-[#4E6E49]/50' : 'bg-[#4E6E49]/5 border-[#4E6E49]/30'}`}>
                            <p className="text-sm">
                                <strong>Если уровень удерживается</strong> — это наш сигнал. Рынок подтвердил, что пробой был истинным.
                            </p>
                        </div>
                    </StrategyStep>

                    <StrategyStep
                        number={5}
                        title="Где мы входим"
                        icon={<Target className="w-5 h-5" />}
                        isOpen={openStep === 5}
                        onToggle={() => toggleStep(5)}
                    >
                        <p>Вход происходит при выполнении всех условий:</p>
                        <div className="grid grid-cols-1 gap-4 mt-4">
                            <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-[#4E6E49]/10 border-[#4E6E49]/30' : 'bg-[#4E6E49]/5 border-[#4E6E49]/30'}`}>
                                <div className="flex items-center gap-2 mb-3">
                                    <CheckCircle2 className="w-5 h-5 text-[#4E6E49]" />
                                    <p className="font-bold text-sm">Условия для входа</p>
                                </div>
                                <ul className="space-y-1 text-xs text-gray-500">
                                    <li>• Цена находилась в диапазоне</li>
                                    <li>• Произошёл импульсный пробой</li>
                                    <li>• Цена вернулась к пробитому уровню</li>
                                    <li>• На возврате нет сильного давления</li>
                                    <li>• Появляется реакция в сторону пробоя</li>
                                </ul>
                            </div>
                        </div>
                        <div className={`mt-4 p-4 rounded-xl border-l-4 ${theme === 'dark' ? 'bg-[#4E6E49]/10 border-[#4E6E49]/50' : 'bg-[#4E6E49]/5 border-[#4E6E49]/30'}`}>
                            <p className="text-sm">
                                <strong>Момент входа:</strong> Мы входим от уровня, а не в погоне за движением. Это ключевое отличие от входа «на пробой».
                            </p>
                        </div>
                    </StrategyStep>

                    <StrategyStep
                        number={6}
                        title="Куда мы ставим стоп"
                        icon={<Layers className="w-5 h-5" />}
                        isOpen={openStep === 6}
                        onToggle={() => toggleStep(6)}
                    >
                        <p>Здесь всё достаточно жёстко. Основной вариант:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                            <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">Основной вариант</p>
                                <p className="font-bold text-sm mb-2">За пробитый уровень</p>
                                <p className="text-xs text-gray-500">
                                    Чуть глубже зоны ретеста. Если цена уверенно возвращается обратно в диапазон, идея сделки сломана.
                                </p>
                            </div>
                            <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-[#4E6E49]/10 border-[#4E6E49]/30' : 'bg-[#4E6E49]/5 border-[#4E6E49]/20'}`}>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">Преимущество</p>
                                <p className="font-bold text-sm mb-2">Короткий стоп</p>
                                <p className="text-xs text-gray-500">
                                    Стоп в этой стратегии обычно короткий. Это одно из её преимуществ перед другими подходами.
                                </p>
                            </div>
                        </div>
                        <div className={`mt-4 p-4 rounded-xl border-l-4 ${theme === 'dark' ? 'bg-rose-500/10 border-rose-500/50' : 'bg-rose-50 border-rose-500/30'}`}>
                            <p className="text-sm">
                                <strong>Важно:</strong> Мы выходим без колебаний, если цена возвращается обратно в диапазон. Идея сломана — сделка закрыта.
                            </p>
                        </div>
                    </StrategyStep>

                    <StrategyStep
                        number={7}
                        title="Где мы выходим"
                        icon={<Clock className="w-5 h-5" />}
                        isOpen={openStep === 7}
                        onToggle={() => toggleStep(7)}
                    >
                        <p>Есть два рабочих подхода, мы используем оба в зависимости от контекста:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                            <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-[#4E6E49]/10 border-[#4E6E49]/30' : 'bg-[#4E6E49]/5 border-[#4E6E49]/20'}`}>
                                <div className="flex items-center gap-2 mb-2">
                                    <Target className="w-5 h-5 text-[#4E6E49]" />
                                    <p className="font-bold text-sm">Цель по диапазону</p>
                                </div>
                                <p className="text-xs text-gray-500">
                                    Откладываем высоту предыдущего диапазона от точки пробоя. Это логичная цель, основанная на структуре движения.
                                </p>
                            </div>
                            <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-[#4E6E49]/10 border-[#4E6E49]/30' : 'bg-[#4E6E49]/5 border-[#4E6E49]/20'}`}>
                                <div className="flex items-center gap-2 mb-2">
                                    <TrendingUp className="w-5 h-5 text-[#4E6E49]" />
                                    <p className="font-bold text-sm">Риск/Прибыль</p>
                                </div>
                                <p className="text-xs text-gray-500">
                                    Минимум 1:3. Если движение импульсное, часть позиции можно сопровождать дальше.
                                </p>
                            </div>
                        </div>
                        <div className={`mt-4 p-4 rounded-xl ${theme === 'dark' ? 'bg-[#4E6E49]/10 border border-[#4E6E49]/20' : 'bg-[#4E6E49]/5 border border-[#4E6E49]/20'}`}>
                            <p className="text-sm">
                                <strong>Важно:</strong> Мы не гонимся за максимумами. Фиксация части прибыли на 1:3 защищает результат.
                            </p>
                        </div>
                    </StrategyStep>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Key Metrics */}
                    <div className={`rounded-2xl p-6 border ${theme === 'dark' ? 'bg-[#151a21]/80 border-white/5' : 'bg-white border-gray-100'
                        } shadow-lg space-y-4`}>
                        <div className="flex items-center gap-3">
                            <BarChart2 className={`w-6 h-6 text-[#4E6E49]`} />
                            <h3 className={`text-lg font-black ${headingColor}`}>Ключевые параметры</h3>
                        </div>

                        <div className="space-y-3">
                            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Диапазон</p>
                                <p className="font-bold text-[#4E6E49]">Узкий коридор</p>
                                <p className="text-xs text-gray-500 mt-1">Чёткие границы, сжатая волатильность</p>
                            </div>
                            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Пробой</p>
                                <p className="font-bold text-[#4E6E49]">Импульс + объём</p>
                                <p className="text-xs text-gray-500 mt-1">Выход за границу с энергией</p>
                            </div>
                            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Вход</p>
                                <p className="font-bold text-[#4E6E49]">На ретесте уровня</p>
                                <p className="text-xs text-gray-500 mt-1">От уровня, а не в погоне</p>
                            </div>
                            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Стоп</p>
                                <p className="font-bold text-[#4E6E49]">За уровнем</p>
                                <p className="text-xs text-gray-500 mt-1">Глубже зоны ретеста</p>
                            </div>
                            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Минимальная цель</p>
                                <p className="font-bold text-[#4E6E49]">1:3</p>
                                <p className="text-xs text-gray-500 mt-1">Risk/Reward не менее 1 к 3</p>
                            </div>
                        </div>
                    </div>

                    {/* Red Flags */}
                    <div className={`rounded-2xl p-6 border ${theme === 'dark' ? 'bg-rose-500/5 border-rose-500/20' : 'bg-rose-50 border-rose-500/20'
                        } shadow-lg space-y-4`}>
                        <div className="flex items-center gap-3">
                            <AlertCircle className={`w-6 h-6 text-rose-500`} />
                            <h3 className={`text-lg font-black ${headingColor}`}>Типичные ошибки</h3>
                        </div>
                        <div className={`space-y-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-xs`}>
                            <p className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
                                <span>Вход в первый пробой без ожидания возврата</span>
                            </p>
                            <p className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
                                <span>Торговля расширяющегося диапазона</span>
                            </p>
                            <p className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
                                <span>Попытка «добавляться», если цена вернулась внутрь диапазона</span>
                            </p>
                            <p className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
                                <span>Работа без чёткого уровня</span>
                            </p>
                            <p className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
                                <span>FOMO после сильной свечи</span>
                            </p>
                        </div>
                    </div>

                </div>
            </div>

            {/* Example Case */}
            <div className={`rounded-3xl p-8 border ${theme === 'dark'
                ? 'bg-gradient-to-br from-[#1a212a] to-[#0f1216] border-[#4E6E49]/20'
                : 'bg-gradient-to-br from-white to-[#4E6E49]/5 border-[#4E6E49]/10'
                } shadow-xl`}>
                <h3 className={`text-xl font-black ${headingColor} mb-4 flex items-center gap-3`}>
                    <Target className="w-6 h-6 text-[#4E6E49]" />
                    Пример сделки
                </h3>
                <div className="space-y-4">
                    <div>
                        <p className="text-sm font-bold mb-2">📊 Инструмент: BTC</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
                            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Диапазон</p>
                                <p className="text-xs text-gray-500">Цена несколько часов стоит в коридоре</p>
                            </div>
                            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Граница</p>
                                <p className="text-xs text-gray-500">Верхняя граница читается чётко</p>
                            </div>
                            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Пробой</p>
                                <p className="text-xs text-gray-500">Импульсная свеча вверх с объёмом</p>
                            </div>
                            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Ретест</p>
                                <p className="text-xs text-gray-500">Цена возвращается к уровню</p>
                            </div>
                        </div>
                    </div>

                    <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-[#4E6E49]/10 border border-[#4E6E49]/20' : 'bg-[#4E6E49]/5 border border-[#4E6E49]/20'}`}>
                        <p className="text-sm font-bold mb-2">🎯 Вход</p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            Через несколько минут цена возвращается к пробитому уровню, но продавцы не давят. Появляется свеча вверх от уровня. <strong>Мы входим в лонг.</strong>
                        </p>
                    </div>

                    <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-[#4E6E49]/10 border border-[#4E6E49]/20' : 'bg-[#4E6E49]/5 border border-[#4E6E49]/20'}`}>
                        <p className="text-sm font-bold mb-2">🛡️ Стоп</p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            Сразу под уровнем. Если цена возвращается в диапазон — выходим без колебаний.
                        </p>
                    </div>

                    <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-[#4E6E49]/10 border border-[#4E6E49]/20' : 'bg-[#4E6E49]/5 border border-[#4E6E49]/20'}`}>
                        <p className="text-sm font-bold mb-2">📈 Цель</p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            Минимум в три раза больше стопа или проекция диапазона. При импульсном движении — часть позиции ведём дальше.
                        </p>
                    </div>
                </div>
            </div>

            {/* Final Logic Footer */}
            <div className={`rounded-2xl p-6 border-l-8 ${theme === 'dark' ? 'bg-[#0b1015] border-[#4E6E49]/50' : 'bg-gray-50 border-[#4E6E49]/30'
                }`}>
                <div className="flex gap-4 items-start">
                    <RefreshCw className="w-8 h-8 text-[#4E6E49] shrink-0" />
                    <div className="space-y-2">
                        <h4 className={`text-lg font-black ${headingColor}`}>Суть стратегии</h4>
                        <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            Пробой с возвратом — это способ подтвердить, что рынок действительно выбрал направление. Мы не пытаемся угадать пробой, а ждём, когда рынок сам покажет, что движение продолжится. Терпение и дисциплина в ожидании ретеста — ключ к успеху. Короткий стоп и чёткое соотношение риск/прибыль делают эту стратегию математически обоснованной.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}