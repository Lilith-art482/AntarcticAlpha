import React, { useState } from 'react'
import { useThemeStore } from '@/store/themeStore'
import {
    Gauge,
    LineChart,
    Settings,
    Zap,
    Layers,
    Target,
    Lightbulb,
    AlertCircle,
    ChevronDown,
    ChevronUp,
    Activity,
    Brain,
    BarChart2
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

export const AvfScalpingStrategy: React.FC = () => {
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
                        <Gauge className={`w-12 h-12 ${theme === 'dark' ? 'text-[#4E6E49]' : 'text-[#4E6E49]'}`} />
                    </div>
                    <div className="flex-1 space-y-4">
                        <h2 className={`text-2xl md:text-3xl font-black ${headingColor}`}>AVA — Scalping</h2>
                        <p className={`text-lg leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            Суть скальпинга — ловить микродвижения на графике 1–5 минут. Мы берём маленькие профиты много раз в течение дня, не пытаясь «поймать тренд» на 50–100 пунктов. Это дисциплина, скорость и точность, а не прогнозирование.
                        </p>
                        <div className={`flex flex-wrap gap-4 pt-2`}>
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${theme === 'dark' ? 'bg-white/5 text-gray-400 border border-white/10' : 'bg-gray-100 text-gray-600 border border-gray-200'
                                }`}>
                                <Activity className="w-3.5 h-3.5" />
                                HIGH FREQUENCY
                            </div>
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${theme === 'dark' ? 'bg-white/5 text-gray-400 border border-white/10' : 'bg-gray-100 text-gray-600 border border-gray-200'
                                }`}>
                                <Brain className="w-3.5 h-3.5" />
                                MICRO TRENDS
                            </div>
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${theme === 'dark' ? 'bg-[#4E6E49]/10 text-[#4E6E49] border border-[#4E6E49]/20' : 'bg-[#4E6E49]/5 text-[#4E6E49] border border-[#4E6E49]/20'
                                }`}>
                                <Gauge className="w-3.5 h-3.5" />
                                PRECISION & SPEED
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Key Principle */}
            <div className={`rounded-2xl p-6 border-l-8 ${theme === 'dark' ? 'bg-[#4E6E49]/5 border-[#4E6E49]/50' : 'bg-[#4E6E49]/5 border-[#4E6E49]/30'
                }`}>
                <div className="flex gap-4 items-start">
                    <LineChart className="w-8 h-8 text-[#4E6E49] shrink-0" />
                    <div className="space-y-2">
                        <h4 className={`text-lg font-black ${headingColor}`}>В чём логика</h4>
                        <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            Цена почти всегда делает маленькие колебания, которые можно использовать для прибыли. Мы не ждём больших движений — нас интересует чистое соотношение риск/прибыль и повторяемость.
                        </p>
                        <p className={`text-sm leading-relaxed mt-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            Основные моменты:
                        </p>
                        <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                            <li>быстрые входы и выходы</li>
                            <li>малые стопы</li>
                            <li>объём и ликвидность критичны</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Steps */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                        <Settings className={`w-6 h-6 ${theme === 'dark' ? 'text-[#4E6E49]' : 'text-[#4E6E49]'}`} />
                        <h3 className={`text-xl font-black ${headingColor}`}>Как применять стратегию</h3>
                    </div>

                    <StrategyStep
                        number={1}
                        title="Какие инструменты подходят"
                        icon={<Settings className="w-5 h-5" />}
                        isOpen={openStep === 1}
                        onToggle={() => toggleStep(1)}
                    >
                        <p>Мы выбираем инструменты с:</p>
                        <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                            <li>высоким объёмом (фьючерсы)</li>
                            <li>низким спредом (валютные пары)</li>
                            <li>низкой комиссией и высокой ликвидностью</li>
                        </ul>
                        <div className={`mt-4 p-4 rounded-xl border ${theme === 'dark' ? 'bg-rose-500/10 border-rose-500/30' : 'bg-rose-50 border-rose-500/20'}`}>
                            <p className="text-sm">
                                <strong>Мы не скальпим</strong> малоликвидные активы — там слишком много шумов.
                            </p>
                        </div>
                    </StrategyStep>

                    <StrategyStep
                        number={2}
                        title="Где мы входим: базовые подходы"
                        icon={<Zap className="w-5 h-5" />}
                        isOpen={openStep === 2}
                        onToggle={() => toggleStep(2)}
                    >
                        <div className="space-y-4">
                            <div>
                                <h4 className={`text-md font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Откат внутри тренда:</h4>
                                <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                                    <li>Берём маленький откат на 1–2 свечи против импульса</li>
                                    <li>Цена возвращается к движению, мы заходим в сторону тренда</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className={`text-md font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Ловим импульсные свечи после флэта:</h4>
                                <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                                    <li>Цена в узком диапазоне</li>
                                    <li>Появляется сильная свеча с объёмом</li>
                                    <li>Входим на продолжение движения</li>
                                </ul>
                                <div className={`mt-4 p-4 rounded-xl border-l-4 ${theme === 'dark' ? 'bg-[#4E6E49]/10 border-[#4E6E49]/50' : 'bg-[#4E6E49]/5 border-[#4E6E49]/30'}`}>
                                    <p className="text-sm">
                                        <strong>Главное</strong> — не угадывать, а реагировать на подтверждённое движение.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </StrategyStep>

                    <StrategyStep
                        number={3}
                        title="Куда ставим стоп:"
                        icon={<Layers className="w-5 h-5" />}
                        isOpen={openStep === 3}
                        onToggle={() => toggleStep(3)}
                    >
                        <p>Стоп:</p>
                        <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                            <li>Очень короткий, обычно 1–2 ATR или чуть за ближайшую свечу</li>
                            <li>Если стоп срабатывает — быстро выходим</li>
                        </ul>
                        <div className={`mt-4 p-4 rounded-xl border ${theme === 'dark' ? 'bg-rose-500/10 border-rose-500/20' : 'bg-rose-50 border-rose-500/20'}`}>
                            <p className="text-sm">
                                <strong>Никогда не усредняем</strong> убыточные позиции.
                            </p>
                        </div>
                    </StrategyStep>

                    <StrategyStep
                        number={4}
                        title="Где мы выходим:"
                        icon={<Target className="w-5 h-5" />}
                        isOpen={openStep === 4}
                        onToggle={() => toggleStep(4)}
                    >
                        <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                            <li>Малый профит: 1–2 стопа</li>
                            <li>Часто фиксируем сразу, иногда сопровождаем трейлингом</li>
                        </ul>
                        <div className={`mt-4 p-4 rounded-xl border-l-4 ${theme === 'dark' ? 'bg-amber-500/10 border-amber-500/50' : 'bg-amber-50 border-amber-500/30'}`}>
                            <p className="text-sm">
                                <strong>Не держим позиции</strong> больше нескольких минут, иначе стратегия ломается.
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
                            <h3 className={`text-lg font-black ${headingColor}`}>Ключевые особенности</h3>
                        </div>

                        <div className="space-y-3">
                            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                <p className="text-xs font-bold text-[#4E6E49] uppercase tracking-widest mb-1">Основной таймфрейм</p>
                                <p className="font-bold text-[#4E6E49]">1–5 минут</p>
                                <p className="text-xs text-gray-500 mt-1">Ловим микродвижения</p>
                            </div>
                            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                <p className="text-xs font-bold text-[#4E6E49] uppercase tracking-widest mb-1">Цель</p>
                                <p className="font-bold text-[#4E6E49]">Маленькие профиты много раз в день</p>
                                <p className="text-xs text-gray-500 mt-1">Повторяемость и соотношение риск/прибыль</p>
                            </div>
                            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                <p className="text-xs font-bold text-[#4E6E49] uppercase tracking-widest mb-1">Вход</p>
                                <p className="font-bold text-[#4E6E49]">На подтвержденном импульсе или откат</p>
                                <p className="text-xs text-gray-500 mt-1">Не угадываем, а реагируем</p>
                            </div>
                            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                <p className="text-xs font-bold text-[#4E6E49] uppercase tracking-widest mb-1">Риск</p>
                                <p className="font-bold text-[#4E6E49]">Очень короткий стоп</p>
                                <p className="text-xs text-gray-500 mt-1">Быстрый выход при ошибке</p>
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
                                <span>Ловить каждый тик — выгораем морально и финансово</span>
                            </p>
                            <p className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
                                <span>Игнорировать комиссии и спреды — профит съедается</span>
                            </p>
                            <p className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
                                <span>Держать позицию слишком долго</span>
                            </p>
                            <p className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
                                <span>Увеличивать объём после минусов</span>
                            </p>
                            <p className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
                                <span>Скальпить на малоликвидных инструментах</span>
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
                    <Lightbulb className="w-6 h-6 text-[#4E6E49]" />
                    Пример сделки
                </h3>
                <div className="space-y-4">
                    <div>
                        <p className="text-sm font-bold mb-2">📊 Инструмент: ES (1 минута)</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
                            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Контекст</p>
                                <p className="text-xs text-gray-500">Цена во флэте 5 минут</p>
                            </div>
                            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Импульс</p>
                                <p className="text-xs text-gray-500">Импульсная зеленая свеча с объёмом</p>
                            </div>
                            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Вход</p>
                                <p className="text-xs text-gray-500">В лонг на следующей свече</p>
                            </div>
                            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Цель</p>
                                <p className="text-xs text-gray-500">1-2 тика профита, моментальная фиксация</p>
                            </div>
                        </div>
                    </div>

                    <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-[#4E6E49]/10 border border-[#4E6E49]/20' : 'bg-[#4E6E49]/5 border border-[#4E6E49]/20'}`}>
                        <p className="text-sm font-bold mb-2">🎯 Вход</p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            Появляется импульсная <strong>зелёная свеча с объёмом выше среднего</strong>. Мы входим в лонг на следующей свече. Стоп — под свечой начала импульса.
                        </p>
                    </div>

                    <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-[#4E6E49]/10 border border-[#4E6E49]/20' : 'bg-[#4E6E49]/5 border border-[#4E6E49]/20'}`}>
                        <p className="text-sm font-bold mb-2">📈 Цель</p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            <strong>1–2 тика профита</strong>, фиксируем моментально. Так повторяем несколько раз в час.
                        </p>
                    </div>
                </div>
            </div>

            {/* Final Logic Footer */}
            <div className={`rounded-2xl p-6 border-l-8 ${theme === 'dark' ? 'bg-[#0b1015] border-[#4E6E49]/50' : 'bg-gray-50 border-[#4E6E49]/30'
                }`}>
                <div className="flex gap-4 items-start">
                    <Gauge className="w-8 h-8 text-[#4E6E49] shrink-0" />
                    <div className="space-y-2">
                        <h4 className={`text-lg font-black ${headingColor}`}>Суть стратегии</h4>
                        <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            Scalping — это стратегия, ориентированная на извлечение небольших, но частых прибылей из микродвижений рынка. Она требует высокой скорости реакции, железной дисциплины при установке стопов и фиксации прибыли, а также глубокого понимания ликвидности инструмента. Это не про угадывание, а про точное реагирование на подтвержденные импульсы.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
