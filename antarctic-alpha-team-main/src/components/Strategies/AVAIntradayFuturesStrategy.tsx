import React, { useState } from 'react'
import { useThemeStore } from '@/store/themeStore'
import {
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

export const AVAIntradayFuturesStrategy: React.FC = () => {
    const { theme } = useThemeStore();
    const [openStep, setOpenStep] = useState<number | null>(null);

    const toggleStep = (step: number) => {
        setOpenStep(openStep === step ? null : step);
    };

    const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900';

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
                        <Zap className={`w-12 h-12 ${theme === 'dark' ? 'text-[#4E6E49]' : 'text-[#4E6E49]'}`} />
                    </div>
                    <div className="flex-1 space-y-4">
                        <h2 className={`text-2xl md:text-3xl font-black ${headingColor}`}>ARCA - Intraday</h2>
                        <p className={`text-lg leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            Интрадей — это стиль торговли, при котором все сделки открываются и закрываются в течение одного торгового дня. Позиции не переносятся на следующий день, чтобы избежать ночных рисков, гэпов и неожиданных новостей.
                        </p>
                        <div className={`flex flex-wrap gap-4 pt-2`}>
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${theme === 'dark' ? 'bg-white/5 text-gray-400 border border-white/10' : 'bg-gray-100 text-gray-600 border border-gray-200'}
                                }`}>
                                <Clock className="w-3.5 h-3.5" />
                                Активный рынок
                            </div>
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${theme === 'dark' ? 'bg-gray-100 text-gray-600 border border-gray-200' : 'bg-gray-100 text-gray-600 border border-gray-200'}
                                }`}>
                                <Activity className="w-3.5 h-3.5" />
                                Контролируемый риск
                            </div>
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${theme === 'dark' ? 'bg-[#4E6E49]/10 text-[#4E6E49] border border-[#4E6E49]/20' : 'bg-[#4E6E49]/5 text-[#4E6E49] border border-[#4E6E49]/20'}
                                }`}>
                                <Target className="w-3.5 h-3.5" />
                                Чёткий план
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Key Principle */}
            <div className={`rounded-2xl p-6 border-l-8 ${theme === 'dark' ? 'bg-[#4E6E49]/5 border-[#4E6E49]/50' : 'bg-[#4E6E49]/5 border-[#4E6E49]/30'}
                }`}>
                <div className="flex gap-4 items-start">
                    <LineChart className="w-8 h-8 text-[#4E6E49] shrink-0" />
                    <div className="space-y-2">
                        <h4 className={`text-lg font-black ${headingColor}`}>В чём идея стратегии</h4>
                        <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            В течение дня рынок формирует: импульсы, откаты, диапазоны, уровни, вокруг которых концентрируется ликвидность.
                        </p>
                        <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            Наша задача — не угадывать будущее, а:
                        </p>
                        <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                            <li>дождаться формирования понятной рыночной ситуации;</li>
                            <li>войти в сделку с ограниченным риском;</li>
                            <li>выйти по заранее определённому плану.</li>
                        </ul>
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
                        title="Кто может применять Интрадей"
                        icon={<Lightbulb className="w-5 h-5" />}
                        isOpen={openStep === 1}
                        onToggle={() => toggleStep(1)}
                    >
                        <p>Интрадей подходит тем, кто:</p>
                        <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                            <li>хочет активно участвовать в рынке,</li>
                            <li>готов следить за графиком в течение сессии,</li>
                            <li>предпочитает контролируемый риск и понятную логику сделок.</li>
                        </ul>
                    </StrategyStep>

                    <StrategyStep
                        number={2}
                        title="Таймфреймы и подготовка"
                        icon={<Edit className="w-5 h-5" />}
                        isOpen={openStep === 2}
                        onToggle={() => toggleStep(2)}
                    >
                        <p>Перед началом торгов:</p>
                        <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                            <li>15 минут — общий контекст дня;</li>
                            <li>5 минут — рабочий таймфрейм;</li>
                            <li>1 минута — уточнение точки входа (по необходимости).</li>
                        </ul>
                        <p className="mt-4">Перед открытием сессии отмечаются:</p>
                        <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                            <li>максимум и минимум предыдущего дня;</li>
                            <li>ключевые уровни внутри диапазона;</li>
                            <li>области, где цена уже проявляла активность.</li>
                        </ul>
                    </StrategyStep>

                    <StrategyStep
                        number={3}
                        title="Где мы входим в сделку"
                        icon={<Square className="w-5 h-5" />}
                        isOpen={openStep === 3}
                        onToggle={() => toggleStep(3)}
                    >
                        <h4 className={`text-md font-bold mb-2 ${headingColor}`}>Сетап 1: Откат внутри тренда</h4>
                        <p className="text-sm mb-2">Используется, когда рынок движется в одном направлении.</p>
                        <p className="text-sm font-bold mb-1">Условия:</p>
                        <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                            <li>есть выраженный импульс вверх или вниз;</li>
                            <li>цена корректируется без сильного давления;</li>
                            <li>откат останавливается у значимого уровня.</li>
                        </ul>
                        <p className="text-sm mt-4">Логика входа: Мы входим по направлению основного движения, когда рынок показывает готовность продолжить тренд.</p>

                        <h4 className={`text-md font-bold mt-6 mb-2 ${headingColor}`}>Сетап 2: Ложный пробой диапазона</h4>
                        <p className="text-sm mb-2">Используется во флэте или на границах дневного диапазона.</p>
                        <p className="text-sm font-bold mb-1">Условия:</p>
                        <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                            <li>цена пробивает максимум или минимум дня;</li>
                            <li>не появляется продолжения движения;</li>
                            <li>цена возвращается обратно в диапазон.</li>
                        </ul>
                        <p className="text-sm mt-4">Логика входа: Мы работаем против пробоя, когда рынок показывает, что движение было ложным.</p>
                    </StrategyStep>

                    <StrategyStep
                        number={4}
                        title="Куда ставим стоп-лосс"
                        icon={<Layers className="w-5 h-5" />}
                        isOpen={openStep === 4}
                        onToggle={() => toggleStep(4)}
                    >
                        <p>Стоп-лосс — обязательная часть каждой сделки. Он ставится:</p>
                        <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                            <li>за ближайший локальный экстремум;</li>
                            <li>за уровень, при пробое которого сценарий становится неверным.</li>
                        </ul>
                        <p className="text-sm font-bold mt-4">Если стоп сработал:</p>
                        <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                            <li>сделка считается завершённой;</li>
                            <li>повторный вход возможен только при новом сетапе.</li>
                        </ul>
                        <p className={`text-sm italic mt-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Усреднение убыточных позиций запрещено.</p>
                    </StrategyStep>

                    <StrategyStep
                        number={5}
                        title="Где мы выходим из сделки"
                        icon={<Target className="w-5 h-5" />}
                        isOpen={openStep === 5}
                        onToggle={() => toggleStep(5)}
                    >
                        <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                            <li>фиксация части позиции на ближайшем уровне;</li>
                            <li>полный выход при достижении цели;</li>
                            <li>сопровождение сделки, если рынок развивается в нашу сторону.</li>
                        </ul>
                        <p className="text-sm italic mt-4">Мы не держим позицию «на авось» — выход всегда запланирован заранее.</p>
                    </StrategyStep>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Key Metrics */}
                    <div className={`rounded-2xl p-6 border ${theme === 'dark' ? 'bg-[#151a21]/80 border-white/5' : 'bg-white border-gray-100'}
                        } shadow-lg space-y-4`}>
                        <div className="flex items-center gap-3">
                            <BarChart2 className={`w-6 h-6 text-[#4E6E49]`} />
                            <h3 className={`text-lg font-black ${headingColor}`}>Ключевые параметры</h3>
                        </div>

                        <div className="space-y-3">
                            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Основные принципы</p>
                                <p className="font-bold text-[#4E6E49]">Активные часы, ограниченность сделок, контролируемый риск</p>
                                <p className="text-xs text-gray-500 mt-1">Интрадей — это не постоянное «сидение в позиции», а выборочные, осознанные входы.</p>
                            </div>
                            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Инструменты</p>
                                <p className="font-bold text-[#4E6E49]">Ликвидные фьючерсы (ES, NQ, YM, CL, BTC, ETH, SOL)</p>
                                <p className="text-xs text-gray-500 mt-1">Важна ликвидность для узкого спреда и быстрого исполнения ордеров</p>
                            </div>
                            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Подготовка</p>
                                <p className="font-bold text-[#4E6E49]">15м (контекст), 5м (рабочий), 1м (вход)</p>
                                <p className="text-xs text-gray-500 mt-1">Отмечаем Max/Min дня, ключевые уровни, области активности</p>
                            </div>
                            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Стоп-лосс</p>
                                <p className="font-bold text-[#4E6E49]">За локальный экстремум / уровень</p>
                                <p className="text-xs text-gray-500 mt-1">Усреднение убыточных позиций запрещено</p>
                            </div>
                        </div>
                    </div>

                    {/* Red Flags */}
                    <div className={`rounded-2xl p-6 border ${theme === 'dark' ? 'bg-rose-500/5 border-rose-500/20' : 'bg-rose-50 border-rose-500/20'}
                        } shadow-lg space-y-4`}>
                        <div className="flex items-center gap-3">
                            <AlertCircle className={`w-6 h-6 text-rose-500`} />
                            <h3 className={`text-lg font-black ${headingColor}`}>Типичные ошибки новичков</h3>
                        </div>
                        <div className={`space-y-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-xs`}>
                            <p className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
                                <span>торговля без чёткого плана;</span>
                            </p>
                            <p className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
                                <span>вход «потому что цена пошла»;</span>
                            </p>
                            <p className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
                                <span>перенос позиции на следующий день;</span>
                            </p>
                            <p className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
                                <span>увеличение объёма после убытков;</span>
                            </p>
                            <p className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
                                <span>игнорирование стоп-лосса.</span>
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
                        <p className="text-sm font-bold mb-2">📊 Инструмент: SOL</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
                            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Движение</p>
                                <p className="text-xs text-gray-500">Цена формирует импульс вверх</p>
                            </div>
                            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Откат</p>
                                <p className="text-xs text-gray-500">Происходит откат к уровню, где ранее был максимум</p>
                            </div>
                            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Вход</p>
                                <p className="text-xs text-gray-500">После подтверждения на 1-минутном графике открывается лонг</p>
                            </div>
                            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Стоп и цель</p>
                                <p className="text-xs text-gray-500">Стоп за минимум отката, Цель — обновление локального максимума</p>
                            </div>
                        </div>
                    </div>

                    <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-[#4E6E49]/10 border border-[#4E6E49]/20' : 'bg-[#4E6E49]/5 border border-[#4E6E49]/20'}`}>
                        <p className="text-sm font-bold mb-2">🎯 Результат</p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            Пример успешной сделки, подтверждающий важность понятной рыночной ситуации и ограниченного риска.
                        </p>
                    </div>
                </div>
            </div>

            {/* Final Logic Footer */}
            <div className={`rounded-2xl p-6 border-l-8 ${theme === 'dark' ? 'bg-[#0b1015] border-[#4E6E49]/50' : 'bg-gray-50 border-[#4E6E49]/30'}
                }`}>
                <div className="flex gap-4 items-start">
                    <Zap className="w-8 h-8 text-[#4E6E49] shrink-0" />
                    <div className="space-y-2">
                        <h4 className={`text-lg font-black ${headingColor}`}>Суть стратегии</h4>
                        <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            Интрадей — это не постоянное «сидение в позиции», а выборочные, осознанные входы. Торговля в активные часы сессии с заранее известным риском и строгой дисциплиной выхода из рынка.
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
};
