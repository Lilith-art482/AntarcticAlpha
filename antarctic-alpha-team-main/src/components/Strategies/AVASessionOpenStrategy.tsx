import React, { useState } from 'react'
import { useThemeStore } from '@/store/themeStore'
import {
    Sunrise,
    LineChart,
    Clock,
    Edit,
    Square,
    Zap,
    Layers,
    Target,
    Lightbulb,
    AlertCircle,
    ChevronDown,
    ChevronUp,
    Activity,
    Brain,
    BarChart2 // Добавлен импорт BarChart2
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

export const AVASessionOpenStrategy: React.FC = () => {
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
                        <Sunrise className={`w-12 h-12 ${theme === 'dark' ? 'text-[#4E6E49]' : 'text-[#4E6E49]'}`} />
                    </div>
                    <div className="flex-1 space-y-4">
                        <h2 className={`text-2xl md:text-3xl font-black ${headingColor}`}>ARCA — Session Open</h2>
                        <p className={`text-lg leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            Торговля первых минут активной фазы рынка, когда в стакан заходят основные объёмы. Это не стратегия «весь день в рынке». Это стратегия чёткого окна, в котором мы либо зарабатываем, либо закрываем терминал.
                        </p>
                        <div className={`flex flex-wrap gap-4 pt-2`}>
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${theme === 'dark' ? 'bg-white/5 text-gray-400 border border-white/10' : 'bg-gray-100 text-gray-600 border border-gray-200'
                                }`}>
                                <Activity className="w-3.5 h-3.5" />
                                VOLATILITY SPIKE
                            </div>
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${theme === 'dark' ? 'bg-gray-100 text-gray-600 border border-gray-200' : 'bg-gray-100 text-gray-600 border border-gray-200'
                                }`}>
                                <Brain className="w-3.5 h-3.5" />
                                RANGE BREAKOUT
                            </div>
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${theme === 'dark' ? 'bg-[#4E6E49]/10 text-[#4E6E49] border border-[#4E6E49]/20' : 'bg-[#4E6E49]/5 text-[#4E6E49] border border-[#4E6E49]/20'
                                }`}>
                                <Clock className="w-3.5 h-3.5" />
                                SESSION TRADING
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
                        <h4 className={`text-lg font-black ${headingColor}`}>В чём здесь логика</h4>
                        <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            Основные деньги приходят в рынок в начале сессии. Причины простые:
                        </p>
                        <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                            <li>открываются фонды,</li>
                            <li>включаются институционалы,</li>
                            <li>отрабатываются новости,</li>
                            <li>происходит перераспределение позиций.</li>
                        </ul>
                        <p className={`text-sm leading-relaxed mt-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            В результате:
                        </p>
                        <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                            <li>волатильность резко растёт,</li>
                            <li>появляются импульсы,</li>
                            <li>рынок часто выбирает направление на весь день.</li>
                        </ul>
                        <p className={`text-sm italic mt-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                            Наша задача — не ловить всё движение, а взять самый понятный кусок.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Steps */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                        <Clock className={`w-6 h-6 ${theme === 'dark' ? 'text-[#4E6E49]' : 'text-[#4E6E49]'}`} />
                        <h3 className={`text-xl font-black ${headingColor}`}>Как применять стратегию</h3>
                    </div>

                    <StrategyStep
                        number={1}
                        title="Какие сессии мы используем"
                        icon={<Clock className="w-5 h-5" />}
                        isOpen={openStep === 1}
                        onToggle={() => toggleStep(1)}
                    >
                        <p>Зависит от инструмента, но чаще всего:</p>
                        <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                            <li>Лондон</li>
                            <li>Нью-Йорк</li>
                        </ul>
                        <div className={`mt-4 p-4 rounded-xl border ${theme === 'dark' ? 'bg-[#4E6E49]/10 border-[#4E6E49]/30' : 'bg-[#4E6E49]/5 border-[#4E6E49]/20'}`}>
                            <p className="text-sm">
                                <strong>Для индексов США и крипты</strong> основной фокус — открытие Нью-Йорка.
                            </p>
                        </div>
                        <p className={`text-sm italic mt-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                            Мы не распыляем внимание на все сессии подряд. Лучше один качественный сетап, чем три сомнительных.
                        </p>
                    </StrategyStep>

                    <StrategyStep
                        number={2}
                        title="Как мы готовимся перед открытием"
                        icon={<Edit className="w-5 h-5" />}
                        isOpen={openStep === 2}
                        onToggle={() => toggleStep(2)}
                    >
                        <p>Перед открытием сессии мы:</p>
                        <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                            <li>отмечаем high и low азиатской или ночной сессии,</li>
                            <li>смотрим, был ли флэт,</li>
                            <li>оцениваем общий контекст: тренд, диапазон, новостной фон.</li>
                        </ul>
                        <div className={`mt-4 p-4 rounded-xl border-l-4 ${theme === 'dark' ? 'bg-amber-500/10 border-amber-500/50' : 'bg-amber-50 border-amber-500/30'}`}>
                            <p className="text-sm">
                                <strong>Наша задача</strong> — понять: рынок накопил энергию или уже её потратил.
                            </p>
                        </div>
                    </StrategyStep>

                    <StrategyStep
                        number={3}
                        title="Что мы считаем рабочей моделью"
                        icon={<Square className="w-5 h-5" />}
                        isOpen={openStep === 3}
                        onToggle={() => toggleStep(3)}
                    >
                        <p>Классический вариант:</p>
                        <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                            <li>В первые 15–30 минут формируется диапазон.</li>
                            <li>Цена консолидируется.</li>
                            <li>Происходит импульсный пробой.</li>
                        </ul>
                        <div className={`mt-4 p-4 rounded-xl border ${theme === 'dark' ? 'bg-[#4E6E49]/10 border-[#4E6E49]/20' : 'bg-[#4E6E49]/5 border-[#4E6E49]/20'}`}>
                            <p className="text-sm">
                                <strong>Этот диапазон</strong> становится нашей опорной зоной.
                            </p>
                        </div>
                    </StrategyStep>

                    <StrategyStep
                        number={4}
                        title="Где мы входим: два базовых варианта"
                        icon={<Zap className="w-5 h-5" />}
                        isOpen={openStep === 4}
                        onToggle={() => toggleStep(4)}
                    >
                        <div className="space-y-4">
                            <div>
                                <h4 className={`text-md font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Вариант 1 — вход по пробою:</h4>
                                <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                                    <li>Цена выходит из диапазона открытия.</li>
                                    <li>Импульс сильный, объём растёт.</li>
                                    <li>Мы входим по рынку или лимитом на небольшом откате.</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className={`text-md font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Вариант 2 — вход по ретесту:</h4>
                                <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                                    <li>Цена пробивает диапазон.</li>
                                    <li>Затем возвращается к его границе.</li>
                                    <li>Появляется реакция в сторону пробоя.</li>
                                    <li>Мы входим от уровня.</li>
                                </ul>
                                <div className={`mt-4 p-4 rounded-xl border-l-4 ${theme === 'dark' ? 'bg-[#4E6E49]/10 border-[#4E6E49]/50' : 'bg-[#4E6E49]/5 border-[#4E6E49]/30'}`}>
                                    <p className="text-sm">
                                        <strong>Этот вариант</strong> мы используем чаще, потому что он даёт более короткий стоп.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </StrategyStep>

                    <StrategyStep
                        number={5}
                        title="Куда мы ставим стоп"
                        icon={<Layers className="w-5 h-5" />}
                        isOpen={openStep === 5}
                        onToggle={() => toggleStep(5)}
                    >
                        <p>Стоп ставится за противоположную границу диапазона, либо за уровень ретеста.</p>
                        <div className={`mt-4 p-4 rounded-xl border-l-4 ${theme === 'dark' ? 'bg-rose-500/10 border-rose-500/50' : 'bg-rose-50 border-rose-500/30'}`}>
                            <p className="text-sm">
                                <strong>Если рынок возвращается внутрь диапазона</strong> — сценарий сломан, мы выходим без обсуждений.
                            </p>
                        </div>
                    </StrategyStep>

                    <StrategyStep
                        number={6}
                        title="Где мы выходим"
                        icon={<Target className="w-5 h-5" />}
                        isOpen={openStep === 6}
                        onToggle={() => toggleStep(6)}
                    >
                        <p>Есть три основных подхода:</p>
                        <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                            <li>Фиксированная цель — 1:2 или 1:3.</li>
                            <li>Работа по импульсу — держим до его затухания.</li>
                            <li>Частичная фиксация + трейлинг.</li>
                        </ul>
                        <p className={`text-sm italic mt-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                            Выбор зависит от силы движения и общего фона.
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
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Рабочие сессии</p>
                                <p className="font-bold text-[#4E6E49]">Лондон, Нью-Йорк</p>
                                <p className="text-xs text-gray-500 mt-1">Основной фокус на открытии Нью-Йорка для индексов США и крипты</p>
                            </div>
                            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Подготовка</p>
                                <p className="font-bold text-[#4E6E49]">High/Low ночной сессии, контекст рынка, новостной фон</p>
                                <p className="text-xs text-gray-500 mt-1">Понять, накопил ли рынок энергию</p>
                            </div>
                            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Рабочая модель</p>
                                <p className="font-bold text-[#4E6E49]">Диапазон 15-30 минут, пробой, ретест</p>
                                <p className="text-xs text-gray-500 mt-1">Диапазон открытия как опорная зона</p>
                            </div>
                            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Стоп-лосс</p>
                                <p className="font-bold text-[#4E6E49]">За границу диапазона / уровень ретеста</p>
                                <p className="text-xs text-gray-500 mt-1">Сценарий ломается при возвращении внутрь диапазона</p>
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
                                <span>Торговля без диапазона</span>
                            </p>
                            <p className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
                                <span>Ожидание движения каждый день</span>
                            </p>
                            <p className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
                                <span>Переторговка после первой неудачной сделки</span>
                            </p>
                            <p className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
                                <span>Вход на эмоциях в середине импульса</span>
                            </p>
                            <p className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
                                <span>Игнор времени сессии</span>
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
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Сессия</p>
                                <p className="text-xs text-gray-500">Открытие Нью-Йорка</p>
                            </div>
                            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Начало</p>
                                <p className="text-xs text-gray-500">20 минут рынок в узком диапазоне</p>
                            </div>
                            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Пробой</p>
                                <p className="text-xs text-gray-500">Цена пробивает верхнюю границу после статистики</p>
                            </div>
                            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Ретест</p>
                                <p className="text-xs text-gray-500">Ждем откат к уровню, появляется зеленая свеча</p>
                            </div>
                        </div>
                    </div>

                    <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-[#4E6E49]/10 border border-[#4E6E49]/20' : 'bg-[#4E6E49]/5 border border-[#4E6E49]/20'}`}>
                        <p className="text-sm font-bold mb-2">🎯 Вход</p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            Продавцов нет, появляется зелёная свеча. <strong>Входим в лонг</strong>. Стоп — за границу диапазона.
                        </p>
                    </div>

                    <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-[#4E6E49]/10 border border-[#4E6E49]/20' : 'bg-[#4E6E49]/5 border-[#4E6E49]/20'}`}>
                        <p className="text-sm font-bold mb-2">📈 Цель</p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            <strong>1:3 или сопровождение импульса</strong>. Максимально эффективно использовать движение.
                        </p>
                    </div>
                </div>
            </div>

            {/* Final Logic Footer */}
            <div className={`rounded-2xl p-6 border-l-8 ${theme === 'dark' ? 'bg-[#0b1015] border-[#4E6E49]/50' : 'bg-gray-50 border-[#4E6E49]/30'
                }`}>
                <div className="flex gap-4 items-start">
                    <Sunrise className="w-8 h-8 text-[#4E6E49] shrink-0" />
                    <div className="space-y-2">
                        <h4 className={`text-lg font-black ${headingColor}`}>Суть стратегии</h4>
                        <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            Session Open — это стратегия, ориентированная на высокую волатильность и импульс на открытии ключевых торговых сессий. Она требует тщательной подготовки, точного определения диапазона и быстрого принятия решений, чтобы взять самый «сочный» кусок движения и уйти с рынка.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
