import React, { useState } from 'react'
import { useThemeStore } from '@/store/themeStore'
import {
    ArrowDownUp,
    Scale,
    Target,
    AlertTriangle,
    Zap,
    Layers,
    Clock,
    BarChart2,
    Lightbulb,
    AlertCircle,
    ChevronDown,
    ChevronUp,
    Activity,
    Brain,
    LineChart
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

export const AVAMeanReversionStrategy: React.FC = () => {
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
                        <ArrowDownUp className={`w-12 h-12 ${theme === 'dark' ? 'text-[#4E6E49]' : 'text-[#4E6E49]'}`} />
                    </div>
                    <div className="flex-1 space-y-4">
                        <h2 className={`text-2xl md:text-3xl font-black ${headingColor}`}>ARCA — Mean Reversion</h2>
                        <p className={`text-lg leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            Контртрендовая работа. Самая коварная и одновременно самая «денежная», если применять её строго по условиям. Эта стратегия не про героизм и не про угадывание разворотов. Мы используем её только там, где рынок сам зашёл слишком далеко и начинает выдыхаться.
                        </p>
                        <div className={`flex flex-wrap gap-4 pt-2`}>
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${theme === 'dark' ? 'bg-white/5 text-gray-400 border border-white/10' : 'bg-gray-100 text-gray-600 border border-gray-200'
                                }`}>
                                <Activity className="w-3.5 h-3.5" />
                                CONTRARIAN
                            </div>
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${theme === 'dark' ? 'bg-gray-100 text-gray-600 border border-gray-200' : 'bg-gray-100 text-gray-600 border border-gray-200'
                                }`}>
                                <Brain className="w-3.5 h-3.5" />
                                EXTREME ANALYSIS
                            </div>
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${theme === 'dark' ? 'bg-[#4E6E49]/10 text-[#4E6E49] border border-[#4E6E49]/20' : 'bg-[#4E6E49]/5 text-[#4E6E49] border border-[#4E6E49]/20'
                                }`}>
                                <Target className="w-3.5 h-3.5" />
                                SWING TRADING
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Key Principle */}
            <div className={`rounded-2xl p-6 border-l-8 ${theme === 'dark' ? 'bg-[#4E6E49]/5 border-[#4E6E49]/50' : 'bg-[#4E6E49]/5 border-[#4E6E49]/30'
                }`}>
                <div className="flex gap-4 items-start">
                    <Scale className="w-8 h-8 text-[#4E6E49] shrink-0" />
                    <div className="space-y-2">
                        <h4 className={`text-lg font-black ${headingColor}`}>В чём здесь логика</h4>
                        <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            Большая часть реальных объёмов в течение дня проходит около справедливой цены. Для нас это VWAP или, в более простом виде, средняя зона диапазона. Когда цена резко уходит слишком далеко от этой зоны, она часто возвращается. Не потому что «должна», а потому что:
                        </p>
                        <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                            <li>новые покупатели уже не спешат входить,</li>
                            <li>старые начинают фиксироваться,</li>
                            <li>импульс ослабевает.</li>
                        </ul>
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
                        title="В каких рынках мы используем эту стратегию"
                        icon={<Target className="w-5 h-5" />}
                        isOpen={openStep === 1}
                        onToggle={() => toggleStep(1)}
                    >
                        <p>Только при выполнении условий:</p>
                        <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                            <li>рынок во флэте или в умеренном тренде,</li>
                            <li>нет сильных новостей,</li>
                            <li>нет ускоряющегося импульса.</li>
                        </ul>
                        <div className={`mt-4 p-4 rounded-xl border ${theme === 'dark' ? 'bg-rose-500/10 border-rose-500/30' : 'bg-rose-50 border-rose-500/20'}`}>
                            <p className="text-sm">
                                <strong>Важно: </strong> Если рынок летит без остановок — мы не лезем. Mean reversion в сильном тренде — самый быстрый способ слить.
                            </p>
                        </div>
                    </StrategyStep>

                    <StrategyStep
                        number={2}
                        title="Нам нужны экстремумы"
                        icon={<AlertTriangle className="w-5 h-5" />}
                        isOpen={openStep === 2}
                        onToggle={() => toggleStep(2)}
                    >
                        <p>Мы не торгуем каждый откат. Нам нужны экстремумы. Обычно это сочетание факторов:</p>
                        <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                            <li>сильное отклонение от VWAP,</li>
                            <li>выход за границы Bollinger Bands,</li>
                            <li>ускорение движения без пауз.</li>
                        </ul>
                        <div className={`mt-4 p-4 rounded-xl border-l-4 ${theme === 'dark' ? 'bg-amber-500/10 border-amber-500/50' : 'bg-amber-50 border-amber-500/30'}`}>
                            <p className="text-sm">
                                <strong>Важно:</strong> Сам по себе ни один из этих факторов не является сигналом. Важно их совпадение.
                            </p>
                        </div>
                    </StrategyStep>

                    <StrategyStep
                        number={3}
                        title="Почему мы не входим сразу"
                        icon={<AlertTriangle className="w-5 h-5" />}
                        isOpen={openStep === 3}
                        onToggle={() => toggleStep(3)}
                    >
                        <p>Потому что рынок может оставаться иррациональным дольше, чем мы готовы терпеть убыток. Мы ждём не «дорого» или «дёшево», а признаки ослабления:</p>
                        <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                            <li>замедление движения,</li>
                            <li>более короткие свечи,</li>
                            <li>потерю объёма,</li>
                            <li>иногда — дивергенцию.</li>
                        </ul>
                        <div className={`mt-4 p-4 rounded-xl border ${theme === 'dark' ? 'bg-[#4E6E49]/10 border-[#4E6E49]/20' : 'bg-[#4E6E49]/5 border-[#4E6E49]/20'}`}>
                            <p className="text-sm">
                                <strong>Пока импульс жив</strong> — мы просто наблюдаем.
                            </p>
                        </div>
                    </StrategyStep>

                    <StrategyStep
                        number={4}
                        title="Где мы входим"
                        icon={<Zap className="w-5 h-5" />}
                        isOpen={openStep === 4}
                        onToggle={() => toggleStep(4)}
                    >
                        <p>Мы входим, когда:</p>
                        <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                            <li>Цена сильно ушла от VWAP.</li>
                            <li>Произошёл выход за границы диапазона.</li>
                            <li>Импульс начинает затухать.</li>
                            <li>Появляется первая реакция в противоположную сторону.</li>
                        </ul>
                        <div className={`mt-4 p-4 rounded-xl border-l-4 ${theme === 'dark' ? 'bg-[#4E6E49]/10 border-[#4E6E49]/50' : 'bg-[#4E6E49]/5 border-[#4E6E49]/30'}`}>
                            <p className="text-sm">
                                <strong>В этот момент мы заходим контртрендово</strong>, понимая, что берём не движение «на сотни пунктов», а возврат к среднему.
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
                        <p>Стоп всегда:</p>
                        <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                            <li>короткий,</li>
                            <li>жёсткий,</li>
                            <li>за экстремум.</li>
                        </ul>
                        <div className={`mt-4 p-4 rounded-xl border-l-4 ${theme === 'dark' ? 'bg-rose-500/10 border-rose-500/50' : 'bg-rose-50 border-rose-500/30'}`}>
                            <p className="text-sm">
                                <strong>Если рынок обновляет экстремум</strong> — идея сделки отменяется. Никаких усреднений, никаких «ещё немного подожду».
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
                        <p>Цель почти всегда одна — возврат к VWAP или к середине диапазона. Мы не ждём чуда и не пересиживаем. Это стратегия быстрых, понятных движений.</p>
                        <p className={`text-sm mt-4 italic ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                            По математике: риск/прибыль чаще всего 1:1 или 1:2, процент прибыльных сделок выше, чем в трендовых стратегиях.
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
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Условия рынка</p>
                                <p className="font-bold text-[#4E6E49]">Флэт или умеренный тренд. Нет сильных новостей.</p>
                                <p className="text-xs text-gray-500 mt-1">Крайне важен правильный контекст рынка</p>
                            </div>
                            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Сигналы входа</p>
                                <p className="font-bold text-[#4E6E49]">VWAP, Bollinger Bands, Затухание импульса</p>
                                <p className="text-xs text-gray-500 mt-1">Совпадение нескольких факторов</p>
                            </div>
                            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Стоп-лосс</p>
                                <p className="font-bold text-[#4E6E49]">Короткий, жёсткий, за экстремум</p>
                                <p className="text-xs text-gray-500 mt-1">Идея отменяется при обновлении экстремума</p>
                            </div>
                            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Цель</p>
                                <p className="font-bold text-[#4E6E49]">Возврат к VWAP / середине диапазона</p>
                                <p className="text-xs text-gray-500 mt-1">Быстрое движение, не пересиживаем</p>
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
                                <span>Попытка ловить каждый экстремум</span>
                            </p>
                            <p className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
                                <span>Работа против сильного тренда</span>
                            </p>
                            <p className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
                                <span>Усреднение убыточной позиции</span>
                            </p>
                            <p className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
                                <span>Ожидание «разворота дня» вместо возврата к среднему</span>
                            </p>
                            <p className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
                                <span>Игнор новостей и времени сессии</span>
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
                        <p className="text-sm font-bold mb-2">📊 Инструмент: ES</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
                            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Контекст</p>
                                <p className="text-xs text-gray-500">Рынок во флэте</p>
                            </div>
                            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Отклонение</p>
                                <p className="text-xs text-gray-500">Цена ушла от VWAP</p>
                            </div>
                            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Импульс</p>
                                <p className="text-xs text-gray-500">Начинает затухать</p>
                            </div>
                            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Реакция</p>
                                <p className="text-xs text-gray-500">Первая реакция в противоположную сторону</p>
                            </div>
                        </div>
                    </div>

                    <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-[#4E6E49]/10 border border-[#4E6E49]/20' : 'bg-[#4E6E49]/5 border border-[#4E6E49]/20'}`}>
                        <p className="text-sm font-bold mb-2">🎯 Вход</p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            Цена резко улетела вверх от VWAP, прошла несколько импульсных свечей подряд. Объём начинает снижаться, свечи укорачиваются, появляется первая красная реакция. Мы входим в шорт. Стоп — сразу за максимум.
                        </p>
                    </div>

                    <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-[#4E6E49]/10 border border-[#4E6E49]/20' : 'bg-[#4E6E49]/5 border border-[#4E6E49]/20'}`}>
                        <p className="text-sm font-bold mb-2">📈 Цель</p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            Возврат к VWAP. Если рынок не идёт сразу — мы не держим. Эта стратегия не про терпение, а про точность.
                        </p>
                    </div>
                </div>
            </div>

            {/* Final Logic Footer */}
            <div className={`rounded-2xl p-6 border-l-8 ${theme === 'dark' ? 'bg-[#0b1015] border-[#4E6E49]/50' : 'bg-gray-50 border-[#4E6E49]/30'
                }`}>
                <div className="flex gap-4 items-start">
                    <ArrowDownUp className="w-8 h-8 text-[#4E6E49] shrink-0" />
                    <div className="space-y-2">
                        <h4 className={`text-lg font-black ${headingColor}`}>Суть стратегии</h4>
                        <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            Mean Reversion — это стратегия работы от экстремумов, но не вслепую. Мы ловим момент, когда рынок выдохся, и ждём отката к среднему. Это требует дисциплины и точечного входа, но даёт высокий процент прибыльных сделок.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
