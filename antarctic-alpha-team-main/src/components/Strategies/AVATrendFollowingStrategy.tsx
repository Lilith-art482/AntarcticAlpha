import React, { useState } from 'react'
import { useThemeStore } from '@/store/themeStore'
import {
    TrendingUp,
    Target,
    ArrowUpRight,
    ArrowDownRight,
    ChevronDown,
    ChevronUp,
    AlertCircle,
    LineChart,
    Clock,
    BarChart2,
    Activity,
    Brain,
    CheckCircle2,
    Zap,
    Layers
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

export const AVATrendFollowingStrategy: React.FC = () => {
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
                        <TrendingUp className={`w-12 h-12 ${theme === 'dark' ? 'text-[#4E6E49]' : 'text-[#4E6E49]'}`} />
                    </div>
                    <div className="flex-1 space-y-4">
                        <h2 className={`text-2xl md:text-3xl font-black ${headingColor}`}>AVA — Тренд-фолловинг</h2>
                        <p className={`text-lg leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            Торговля по тренду. Самая базовая логика из тех, что стабильно работают.
                        </p>
                        <div className={`flex flex-wrap gap-4 pt-2`}>
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${theme === 'dark' ? 'bg-white/5 text-gray-400 border border-white/10' : 'bg-gray-100 text-gray-600 border border-gray-200'
                                }`}>
                                <Activity className="w-3.5 h-3.5" />
                                PRICE ACTION
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
                        <h4 className={`text-lg font-black ${headingColor}`}>Что такое тренд для нас</h4>
                        <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            Для нас тренд — это не линия и не скользящая. Тренд — это <strong>поведение цены</strong>. Если по сути, рынок движется волнами в одну сторону. В лонге это выглядит так: цена обновляет максимум, затем откатывается, но не уходит ниже прошлого минимума, после чего снова растёт. И так несколько раз подряд.
                        </p>
                        <div className={`mt-4 p-4 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-white'} border border-[#4E6E49]/20`}>
                            <p className="text-sm font-bold text-[#4E6E49] mb-2">Структура тренда:</p>
                            <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
                                <span className="px-2 py-1 bg-[#4E6E49]/10 rounded-lg text-[#4E6E49]">Максимум</span>
                                <span className="text-gray-400">→</span>
                                <span className="px-2 py-1 bg-[#4E6E49]/10 rounded-lg text-[#4E6E49]">Откат</span>
                                <span className="text-gray-400">→</span>
                                <span className="px-2 py-1 bg-[#4E6E49]/10 rounded-lg text-[#4E6E49]">Максимум выше прошлого</span>
                                <span className="text-gray-400">→</span>
                                <span className="px-2 py-1 bg-[#4E6E49]/10 rounded-lg text-[#4E6E49]">Откат выше прошлого</span>
                            </div>
                        </div>
                        <p className={`text-sm mt-4 italic ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                            Пока эта структура сохраняется — тренд есть. Как только она ломается — тренда нет, даже если индикаторы выглядят привлекательно.
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
                        title="Определение наличия тренда"
                        icon={<Activity className="w-5 h-5" />}
                        isOpen={openStep === 1}
                        onToggle={() => toggleStep(1)}
                    >
                        <p>Чтобы не гадать и не подгонять картинку под ожидания, мы используем один простой фильтр — <strong>EMA 200</strong>:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                            <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-[#4E6E49]/10 border-[#4E6E49]/30' : 'bg-[#4E6E49]/5 border-[#4E6E49]/20'}`}>
                                <div className="flex items-center gap-2 mb-2">
                                    <ArrowUpRight className="w-5 h-5 text-[#4E6E49]" />
                                    <p className="font-bold text-sm">Цена выше EMA 200</p>
                                </div>
                                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Работаем только в <strong>лонг</strong>. EMA 200 — это граница интереса крупного капитала.
                                </p>
                            </div>
                            <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-rose-500/10 border-rose-500/30' : 'bg-rose-50 border-rose-500/20'}`}>
                                <div className="flex items-center gap-2 mb-2">
                                    <ArrowDownRight className="w-5 h-5 text-rose-500" />
                                    <p className="font-bold text-sm">Цена ниже EMA 200</p>
                                </div>
                                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Рассматриваем только <strong>шорты</strong>. Фильтр убирает большую часть случайных сделок.
                                </p>
                            </div>
                        </div>
                        <div className={`mt-4 p-4 rounded-xl border-l-4 ${theme === 'dark' ? 'bg-amber-500/10 border-amber-500/50' : 'bg-amber-50 border-amber-500/30'}`}>
                            <p className="text-sm">
                                <strong>Важно:</strong> EMA 200 — это не точка входа. Это фильтр и граница интереса крупного капитала.
                            </p>
                        </div>
                    </StrategyStep>

                    <StrategyStep
                        number={2}
                        title="Где мы НЕ работаем"
                        icon={<AlertCircle className="w-5 h-5" />}
                        isOpen={openStep === 2}
                        onToggle={() => toggleStep(2)}
                    >
                        <p>Если цена постоянно пересекает EMA 200 туда-сюда, нет чётких максимумов и минимумов, движение рваное и без импульса — в таком рынке мы <strong>не работаем</strong>.</p>
                        <div className={`mt-4 p-4 rounded-xl ${theme === 'dark' ? 'bg-rose-500/10 border border-rose-500/20' : 'bg-rose-50 border border-rose-500/20'}`}>
                            <p className="text-sm font-bold text-rose-500 mb-2">Признаки флэта:</p>
                            <ul className="space-y-1 text-xs text-gray-500">
                                <li>• Цена пересекает EMA 200 туда-сюда</li>
                                <li>• Нет чётких максимумов и минимумов</li>
                                <li>• Движение рваное и без импульса</li>
                                <li>• Нет чёткой структуры HH/LL или LH/LL</li>
                            </ul>
                        </div>
                        <p className={`text-sm mt-4 italic ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                            Это флэт. И в нём тренд-фолловинг статистически не даёт преимущества.
                        </p>
                    </StrategyStep>

                    <StrategyStep
                        number={3}
                        title="Где мы ищем вход"
                        icon={<Target className="w-5 h-5" />}
                        isOpen={openStep === 3}
                        onToggle={() => toggleStep(3)}
                    >
                        <p><strong>Ключевое правило:</strong> в тренде мы не покупаем рост. Мы работаем от отката.</p>
                        <div className="space-y-3 mt-4">
                            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                <h4 className="font-bold text-sm mb-2">📍 Шаблон входа:</h4>
                                <ol className="space-y-1 text-xs text-gray-500 list-decimal list-inside">
                                    <li>Сначала рынок должен показать <strong>импульс</strong></li>
                                    <li>После этого цена откатывается — <strong>спокойно</strong>, без агрессии</li>
                                    <li>Откаты доходят до <strong>EMA 20 или EMA 50</strong></li>
                                    <li>Мы рассматриваем эти зоны как рабочие, но не как автоматический сигнал</li>
                                </ol>
                            </div>
                        </div>
                        <div className={`mt-4 p-4 rounded-xl border ${theme === 'dark' ? 'bg-[#4E6E49]/5 border-[#4E6E49]/20' : 'bg-[#4E6E49]/5 border-[#4E6E49]/20'}`}>
                            <p className="text-sm">
                                <strong>Важно:</strong> откат должен быть медленным, свечи небольшими, без резких объёмов против движения. Это нормальная пауза внутри тренда.
                            </p>
                        </div>
                    </StrategyStep>

                    <StrategyStep
                        number={4}
                        title="Как выглядит корректный вход"
                        icon={<Zap className="w-5 h-5" />}
                        isOpen={openStep === 4}
                        onToggle={() => toggleStep(4)}
                    >
                        <p>Паттерн входа должен соответствовать всем критериям:</p>
                        <div className="grid grid-cols-1 gap-4 mt-4">
                            <div className={`p-4 rounded-xl border-2 ${theme === 'dark' ? 'bg-[#4E6E49]/10 border-[#4E6E49]/30' : 'bg-[#4E6E49]/5 border-[#4E6E49]/30'}`}>
                                <div className="flex items-center gap-2 mb-3">
                                    <CheckCircle2 className="w-5 h-5 text-[#4E6E49]" />
                                    <p className="font-bold text-sm">Условия для входа в лонг</p>
                                </div>
                                <ul className="space-y-1 text-xs text-gray-500">
                                    <li>• Цена находится <strong>выше EMA 200</strong></li>
                                    <li>• Был <strong>импульс вверх</strong></li>
                                    <li>• Начался <strong>откат к EMA 20 или EMA 50</strong></li>
                                    <li>• Откат <strong>медленный</strong>, свечи небольшие</li>
                                    <li>• Появляется <strong>свеча в сторону основного движения</strong></li>
                                </ul>
                            </div>
                        </div>
                        <div className={`mt-4 p-4 rounded-xl border-l-4 ${theme === 'dark' ? 'bg-[#4E6E49]/10 border-[#4E6E49]/50' : 'bg-[#4E6E49]/5 border-[#4E6E49]/30'}`}>
                            <p className="text-sm">
                                <strong>Момент входа:</strong> Мы входим <strong>только после того, как рынок подтвердил окончание отката</strong>. Не раньше и не «на опережение».
                            </p>
                        </div>
                    </StrategyStep>

                    <StrategyStep
                        number={5}
                        title="Куда мы ставим стоп"
                        icon={<Layers className="w-5 h-5" />}
                        isOpen={openStep === 5}
                        onToggle={() => toggleStep(5)}
                    >
                        <p>Стоп всегда ставится по логике рынка, а не «чтобы был короткий». Мы используем два варианта:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                            <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">Вариант 1</p>
                                <p className="font-bold text-sm mb-2">За последний локальный минимум отката</p>
                                <p className="text-xs text-gray-500">
                                    Логичный стоп, который не выбьет при нормальной коррекции.
                                </p>
                            </div>
                            <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">Вариант 2</p>
                                <p className="font-bold text-sm mb-2">На расстоянии 1–1.5 ATR от точки входа</p>
                                <p className="text-xs text-gray-500">
                                    Адаптивный стоп, учитывающий волатильность инструмента.
                                </p>
                            </div>
                        </div>
                        <div className={`mt-4 p-4 rounded-xl border-l-4 ${theme === 'dark' ? 'bg-amber-500/10 border-amber-500/50' : 'bg-amber-50 border-amber-500/30'}`}>
                            <p className="text-sm">
                                <strong>Если стоп регулярно выбивает</strong> — проблема не в стопе, а в месте входа. Качественный вход = комфортный стоп.
                            </p>
                        </div>
                    </StrategyStep>

                    <StrategyStep
                        number={6}
                        title="Где мы выходим"
                        icon={<Clock className="w-5 h-5" />}
                        isOpen={openStep === 6}
                        onToggle={() => toggleStep(6)}
                    >
                        <p>Часто мы фиксируем часть позиции, а остальное ведём до момента, когда рынок ломает структуру или выбивает по трейлинг-стопу.</p>
                        <div className="space-y-3 mt-4">
                            <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                                <h4 className="font-bold text-sm mb-2">📈 Стратегия выхода</h4>
                                <ul className="space-y-1 text-xs text-gray-500">
                                    <li>• Фиксация <strong>части позиции</strong> на промежуточных целях</li>
                                    <li>• Остаток ведём до <strong>слома структуры</strong></li>
                                    <li>• Использование <strong>трейлинг-стопа</strong> для защиты прибыли</li>
                                </ul>
                            </div>
                        </div>
                        <div className={`mt-4 p-4 rounded-xl ${theme === 'dark' ? 'bg-[#4E6E49]/10 border border-[#4E6E49]/20' : 'bg-[#4E6E49]/5 border border-[#4E6E49]/20'}`}>
                            <p className="text-sm">
                                <strong>Важно понимать:</strong> Одна качественная трендовая сделка способна перекрыть пять–семь убыточных. На этом и держится стратегия.
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
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">EMA для фильтра</p>
                                <p className="font-bold text-[#4E6E49]">EMA 200</p>
                                <p className="text-xs text-gray-500 mt-1">Граница интереса крупного капитала</p>
                            </div>
                            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Зоны отката</p>
                                <p className="font-bold text-[#4E6E49]">EMA 20 / EMA 50</p>
                                <p className="text-xs text-gray-500 mt-1">Рабочие зоны для входа</p>
                            </div>
                            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Стоп-лосс</p>
                                <p className="font-bold text-[#4E6E49]">1–1.5 ATR</p>
                                <p className="text-xs text-gray-500 mt-1">Или за локальный минимум отката</p>
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
                                <span>Вход в середине импульса</span>
                            </p>
                            <p className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
                                <span>Попытка поймать разворот</span>
                            </p>
                            <p className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
                                <span>Работа во флэте</span>
                            </p>
                            <p className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
                                <span>Слишком ранняя фиксация прибыли</span>
                            </p>
                            <p className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
                                <span>Увеличение объёма после серии минусов</span>
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
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Условие</p>
                                <p className="text-xs text-gray-500">Цена выше EMA 200</p>
                            </div>
                            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Импульс</p>
                                <p className="text-xs text-gray-500">Был сильный рост</p>
                            </div>
                            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Откат</p>
                                <p className="text-xs text-gray-500">К EMA 20, медленный</p>
                            </div>
                            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Объём</p>
                                <p className="text-xs text-gray-500">Снижается на откате</p>
                            </div>
                        </div>
                    </div>

                    <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-[#4E6E49]/10 border border-[#4E6E49]/20' : 'bg-[#4E6E49]/5 border border-[#4E6E49]/20'}`}>
                        <p className="text-sm font-bold mb-2">🎯 Вход</p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            Появляется уверенная свеча в сторону тренда → <strong>входим в лонг</strong> → стоп ставим под минимум отката.
                        </p>
                    </div>

                    <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-[#4E6E49]/10 border border-[#4E6E49]/20' : 'bg-[#4E6E49]/5 border border-[#4E6E49]/20'}`}>
                        <p className="text-sm font-bold mb-2">📈 Цель</p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            <strong>Не ниже 1:3</strong>. Без угадываний и прогнозов. Мы работаем только с тем, что рынок уже показал.
                        </p>
                    </div>
                </div>
            </div>

            {/* Final Logic Footer */}
            <div className={`rounded-2xl p-6 border-l-8 ${theme === 'dark' ? 'bg-[#0b1015] border-[#4E6E49]/50' : 'bg-gray-50 border-[#4E6E49]/30'
                }`}>
                <div className="flex gap-4 items-start">
                    <TrendingUp className="w-8 h-8 text-[#4E6E49] shrink-0" />
                    <div className="space-y-2">
                        <h4 className={`text-lg font-black ${headingColor}`}>Суть стратегии</h4>
                        <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            Тренд-фолловинг — это не магия индикаторов, а понимание рыночной структуры. Мы не пытаемся угадать развороты, а следуем за крупным капиталом. Терпение и дисциплина — единственные индикаторы, которые действительно работают. Одна правильная сделка компенсирует серию мелких убытков.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}