import React, { useState } from 'react'
import { useThemeStore } from '@/store/themeStore'
import {
    Megaphone,
    TrendingUp,
    Newspaper,
    PenTool,
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

export const AVAEventTradingStrategy: React.FC = () => {
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
                        <Megaphone className={`w-12 h-12 ${theme === 'dark' ? 'text-[#4E6E49]' : 'text-[#4E6E49]'}`} />
                    </div>
                    <div className="flex-1 space-y-4">
                        <h2 className={`text-2xl md:text-3xl font-black ${headingColor}`}>ARCA — Event Trading</h2>
                        <p className={`text-lg leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            Это стратегия для особых случаев. Мы её используем только тогда, когда есть крупный катализатор, и точно знаем, как реагировать на рынок. Здесь нет места угадывания — всё о реакции на факт.
                        </p>
                        <div className={`flex flex-wrap gap-4 pt-2`}>
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${theme === 'dark' ? 'bg-white/5 text-gray-400 border border-white/10' : 'bg-gray-100 text-gray-600 border border-gray-200'
                                }`}>
                                <Activity className="w-3.5 h-3.5" />
                                CATALYST DRIVEN
                            </div>
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${theme === 'dark' ? 'bg-white/5 text-gray-400 border border-white/10' : 'bg-gray-100 text-gray-600 border border-gray-200'
                                }`}>
                                <Brain className="w-3.5 h-3.5" />
                                IMPULSE REACTION
                            </div>
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${theme === 'dark' ? 'bg-[#4E6E49]/10 text-[#4E6E49] border border-[#4E6E49]/20' : 'bg-[#4E6E49]/5 text-[#4E6E49] border border-[#4E6E49]/20'
                                }`}>
                                <TrendingUp className="w-3.5 h-3.5" />
                                QUICK MOVES
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Key Principle */}
            <div className={`rounded-2xl p-6 border-l-8 ${theme === 'dark' ? 'bg-[#4E6E49]/5 border-[#4E6E49]/50' : 'bg-[#4E6E49]/5 border-[#4E6E49]/30'
                }`}>
                <div className="flex gap-4 items-start">
                    <TrendingUp className="w-8 h-8 text-[#4E6E49] shrink-0" />
                    <div className="space-y-2">
                        <h4 className={`text-lg font-black ${headingColor}`}>В чём логика</h4>
                        <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            Рынок очень чувствителен к крупным событиям: отчёты компаний, макроэкономика, новости регуляторов, неожиданные заявления. В первые минуты после новости часто происходят резкие движения: цена скачет, импульс может быть огромным. Наша задача — сразу понять, кто управляет движением, и подключиться к уже сформированному импульсу.
                        </p>
                        <p className={`text-sm italic mt-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                            Это не «догоняющая» торговля. Мы не пытаемся предугадать реакцию. Мы работаем с тем, что рынок уже показал.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Steps */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                        <Newspaper className={`w-6 h-6 ${theme === 'dark' ? 'text-[#4E6E49]' : 'text-[#4E6E49]'}`} />
                        <h3 className={`text-xl font-black ${headingColor}`}>Как применять стратегию</h3>
                    </div>

                    <StrategyStep
                        number={1}
                        title="Какие новости мы отслеживаем"
                        icon={<Newspaper className="w-5 h-5" />}
                        isOpen={openStep === 1}
                        onToggle={() => toggleStep(1)}
                    >
                        <p>Мы фокусируемся на событиях, которые реально двигают инструменты:</p>
                        <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                            <li>Макроэкономические данные: NFP, CPI, процентные ставки</li>
                            <li>Результаты крупных компаний, особенно в секторе, где торгуем</li>
                            <li>Внеплановые заявления регуляторов или центробанков</li>
                        </ul>
                        <div className={`mt-4 p-4 rounded-xl border ${theme === 'dark' ? 'bg-amber-500/10 border-amber-500/30' : 'bg-amber-50 border-amber-500/20'}`}>
                            <p className="text-sm">
                                <strong>Важно: </strong> Не каждая новость нам подходит. Если она слабая или рынок уже «скипнул» реакцию, мы просто наблюдаем.
                            </p>
                        </div>
                    </StrategyStep>

                    <StrategyStep
                        number={2}
                        title="Перед выходом новости мы:"
                        icon={<PenTool className="w-5 h-5" />}
                        isOpen={openStep === 2}
                        onToggle={() => toggleStep(2)}
                    >
                        <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                            <li>отмечаем ключевые уровни и диапазон последнего часа</li>
                            <li>смотрим на общий тренд и недавние движения</li>
                            <li>оцениваем волатильность и потенциальные стопы</li>
                        </ul>
                        <div className={`mt-4 p-4 rounded-xl border-l-4 ${theme === 'dark' ? 'bg-[#4E6E49]/10 border-[#4E6E49]/50' : 'bg-[#4E6E49]/5 border-[#4E6E49]/30'}`}>
                            <p className="text-sm">
                                <strong>Мы знаем заранее</strong>, куда будет логично поставить стоп и куда цель. Это не «всё зависит от свечи».
                            </p>
                        </div>
                    </StrategyStep>

                    <StrategyStep
                        number={3}
                        title="Где мы входим:"
                        icon={<Zap className="w-5 h-5" />}
                        isOpen={openStep === 3}
                        onToggle={() => toggleStep(3)}
                    >
                        <p>Мы делаем это по правилу:</p>
                        <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                            <li>Новости выходят, рынок даёт первый импульс.</li>
                            <li>Импульс подтверждается объёмом или повторной свечой в сторону движения.</li>
                            <li>Цена корректируется, возвращаясь к ключевому уровню (иногда — к VWAP, иногда — к последнему локальному максимуму/минимуму).</li>
                        </ul>
                        <div className={`mt-4 p-4 rounded-xl border ${theme === 'dark' ? 'bg-[#4E6E49]/10 border-[#4E6E49]/20' : 'bg-[#4E6E49]/5 border-[#4E6E49]/20'}`}>
                            <p className="text-sm">
                                <strong>В этот момент мы входим по движению</strong>, а не на догадке «куда пойдёт цена».
                            </p>
                        </div>
                    </StrategyStep>

                    <StrategyStep
                        number={4}
                        title="Куда ставим стоп:"
                        icon={<Layers className="w-5 h-5" />}
                        isOpen={openStep === 4}
                        onToggle={() => toggleStep(4)}
                    >
                        <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                            <li>Стоп короткий, строго за локальный экстремум перед импульсом.</li>
                        </ul>
                        <div className={`mt-4 p-4 rounded-xl border-l-4 ${theme === 'dark' ? 'bg-rose-500/10 border-rose-500/50' : 'bg-rose-50 border-rose-500/30'}`}>
                            <p className="text-sm">
                                <strong>Если цена ломает этот уровень</strong> — сделка отменяется. Мы не пересиживаем. Новости могут выкинуть рынок резко в обе стороны, и важно держать потери маленькими.
                            </p>
                        </div>
                    </StrategyStep>

                    <StrategyStep
                        number={5}
                        title="Где мы выходим:"
                        icon={<Target className="w-5 h-5" />}
                        isOpen={openStep === 5}
                        onToggle={() => toggleStep(5)}
                    >
                        <p>Выход зависит от ситуации:</p>
                        <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                            <li>Иногда фиксируем прибыль после движения в 1–2 стопа</li>
                            <li>Иногда держим часть позиции до конца первых 15–30 минут, если импульс устойчив</li>
                            <li>Частично можно сопровождать движение по трейлингу</li>
                        </ul>
                        <p className={`text-sm italic mt-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                            Главное правило — мы не держим новостные позиции весь день, если только это не совпадает с другой стратегией (например, тренд-фолловинг).
                        </p>
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
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Катализатор</p>
                                <p className="font-bold text-[#4E6E49]">Крупные новости: макроэкономика, отчёты, регуляторы</p>
                                <p className="text-xs text-gray-500 mt-1">Только события, которые реально двигают рынок</p>
                            </div>
                            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Подготовка</p>
                                <p className="font-bold text-[#4E6E49]">Ключевые уровни, диапазон, волатильность</p>
                                <p className="text-xs text-gray-500 mt-1">Заранее знаем стоп и цель</p>
                            </div>
                            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Вход</p>
                                <p className="font-bold text-[#4E6E49]">По импульсу после коррекции к уровню</p>
                                <p className="text-xs text-gray-500 mt-1">Работаем с тем, что рынок уже показал</p>
                            </div>
                            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Стоп-лосс</p>
                                <p className="font-bold text-[#4E6E49]">Короткий, за локальный экстремум</p>
                                <p className="text-xs text-gray-500 mt-1">Сделка отменяется при пробое уровня</p>
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
                                <span>Вход на самом старте импульса без подтверждения</span>
                            </p>
                            <p className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
                                <span>Торговля «для экшена», а не по уровню</span>
                            </p>
                            <p className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
                                <span>Игнор коротких стопов и риска</span>
                            </p>
                            <p className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
                                <span>Попытка удерживать позицию слишком долго</span>
                            </p>
                            <p className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
                                <span>Непонимание контекста: тренд или флэт</span>
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
                        <p className="text-sm font-bold mb-2">📊 Инструмент: NQ</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
                            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Событие</p>
                                <p className="text-xs text-gray-500">Выход CPI США</p>
                            </div>
                            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Реакция</p>
                                <p className="text-xs text-gray-500">Рынок резко вверх, объем высокий</p>
                            </div>
                            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Коррекция</p>
                                <p className="text-xs text-gray-500">Цена корректируется к локальному максимуму</p>
                            </div>
                            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Подтверждение</p>
                                <p className="text-xs text-gray-500">Давления против нет, появляется подтверждающая свеча</p>
                            </div>
                        </div>
                    </div>

                    <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-[#4E6E49]/10 border border-[#4E6E49]/20' : 'bg-[#4E6E49]/5 border border-[#4E6E49]/20'}`}>
                        <p className="text-sm font-bold mb-2">🎯 Вход</p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            <strong>Входим в лонг.</strong> Стоп — под экстремум перед импульсом.
                        </p>
                    </div>

                    <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-[#4E6E49]/10 border border-[#4E6E49]/20' : 'bg-[#4E6E49]/5 border border-[#4E6E49]/20'}`}>
                        <p className="text-sm font-bold mb-2">📈 Цель</p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            <strong>Движение минимум 1:2–1:3</strong>. Если рынок резко разворачивается против нас — стоп срабатывает мгновенно, мы остаёмся вне позиции.
                        </p>
                    </div>
                </div>
            </div>

            {/* Final Logic Footer */}
            <div className={`rounded-2xl p-6 border-l-8 ${theme === 'dark' ? 'bg-[#0b1015] border-[#4E6E49]/50' : 'bg-gray-50 border-[#4E6E49]/30'
                }`}>
                <div className="flex gap-4 items-start">
                    <Megaphone className="w-8 h-8 text-[#4E6E49] shrink-0" />
                    <div className="space-y-2">
                        <h4 className={`text-lg font-black ${headingColor}`}>Суть стратегии</h4>
                        <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            Event Trading — это высокодисциплинированная стратегия, ориентированная на извлечение прибыли из первой реакции рынка на значимые новости. Она требует тщательной подготовки, точного входа на подтвержденном импульсе и жесткого управления риском, чтобы максимизировать прибыль и минимизировать потери в условиях повышенной волатильности.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
