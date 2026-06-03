import React, { useState } from 'react'
import { useThemeStore } from '@/store/themeStore'
import {
    Clock,
    Zap,
    TrendingUp,
    XCircle,
    HelpCircle,
    CheckCircle2,
    Target,
    Scale,
    Activity,
    MinusCircle,
    Hourglass,
    GanttChart,
    CandlestickChart,
    HandIcon,
    WalletCards,
    Waypoints,
    Footprints,
    ChevronUp,
    ChevronDown,
    LayoutList
} from 'lucide-react'

// Вспомогательный компонент для шагов стратегии
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
                    <div className={`flex items-center justify-center w-10 h-10 rounded-xl font-black text-lg ${theme === 'dark' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
                        }`}>
                        {number}
                    </div>
                    <div className="flex items-center gap-3">
                        <div className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
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

export const AVAFuturesIntradayStrategy: React.FC = () => {
    const { theme } = useThemeStore()
    const [openStep, setOpenStep] = useState<number | null>(1)

    const toggleStep = (step: number) => {
        setOpenStep(openStep === step ? null : step)
    }

    const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'

    return (
        <div className="space-y-12 animate-fade-in">
            {/* 1. Strategy Hero Intro */}
            <div className={`relative overflow-hidden rounded-3xl p-8 border ${theme === 'dark'
                ? 'bg-gradient-to-br from-[#1a212a] to-[#0f1216] border-indigo-500/20 shadow-2xl'
                : 'bg-gradient-to-br from-white to-indigo-50/30 border-indigo-500/10 shadow-xl'
                }`}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-3xl rounded-full -mr-20 -mt-20 pointer-events-none"></div>

                <div className="relative flex flex-col md:flex-row gap-8 items-start">
                    <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-indigo-500/10' : 'bg-indigo-500/5'}`}>
                        <Clock className={`w-12 h-12 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-500'}`} />
                    </div>
                    <div className="flex-1 space-y-4">
                        <h2 className={`text-2xl md:text-3xl font-black ${headingColor}`}>ARCA - Intraday</h2>
                        <p className={`text-lg leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            Интрадей — это стиль торговли, при котором все сделки открываются и закрываются в течение одного торгового дня. Позиции не переносятся на следующий день, чтобы избежать ночных рисков, гэпов и неожиданных новостей.
                        </p>
                        <p className={`text-sm opacity-80 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            Интрадей подходит тем, кто хочет активно участвовать в рынке, готов следить за графиком в течение сессии и предпочитает контролируемый риск и понятную логику сделок.
                        </p>
                        <div className={`flex flex-wrap gap-4 pt-2`}>
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${theme === 'dark' ? 'bg-white/5 text-gray-400 border border-white/10' : 'bg-gray-100 text-gray-600 border border-gray-200'
                                }`}>
                                <Hourglass className="w-3.5 h-3.5" /> ИНТРАДЕЙ
                            </div>
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${theme === 'dark' ? 'bg-white/5 text-gray-400 border border-white/10' : 'bg-gray-100 text-gray-600 border border-gray-200'
                                }`}>
                                <Zap className="w-3.5 h-3.5" /> АКТИВНОЕ УЧАСТИЕ
                            </div>
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${theme === 'dark' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                                }`}>
                                <TrendingUp className="w-3.5 h-3.5" /> КОНТРОЛИРУЕМЫЙ РИСК
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Key Advantages & Targets */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { title: "Понятные условия", desc: "Дождаться формирования понятной рыночной ситуации.", icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" /> },
                    { title: "Контроль риска", icon: <Scale className="w-5 h-5 text-indigo-500" />, desc: "Войти в сделку с ограниченным риском." },
                    { title: "План выхода", icon: <Target className="w-5 h-5 text-amber-500" />, desc: "Выйти по заранее определённому плану." },
                    { title: "Строгая дисциплина", icon: <Footprints className="w-5 h-5 text-purple-500" />, desc: "Отсутствие эмоциональных решений и строгая дисциплина." }
                ].map((item, idx) => (
                    <div key={idx} className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100'} shadow-sm`}>
                        <div className="mb-3">{item.icon}</div>
                        <h4 className="font-bold text-sm mb-1">{item.title}</h4>
                        <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                    </div>
                ))}
            </div>

            {/* 3. Logic & Summary (Moved Up) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className={`rounded-2xl p-6 border-l-8 ${theme === 'dark' ? 'bg-[#0b1015] border-indigo-500/50' : 'bg-gray-50 border-indigo-500/30'
                    } flex gap-4 items-start`}>
                    <HelpCircle className="w-8 h-8 text-indigo-500 shrink-0" />
                    <div className="space-y-2">
                        <h4 className={`text-lg font-black ${headingColor}`}>В чём идея стратегии:</h4>
                        <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            В течение дня рынок формирует импульсы, откаты, диапазоны и уровни, вокруг которых концентрируется ликвидность. Наша задача — не угадывать будущее, а дождаться формирования понятной рыночной ситуации, войти в сделку с ограниченным риском и выйти по заранее определённому плану.
                        </p>
                    </div>
                </div>

                <div className={`rounded-2xl p-6 border ${theme === 'dark' ? 'bg-indigo-500/5 border-indigo-500/20' : 'bg-indigo-50 border-indigo-500/20'
                    } flex gap-4 items-start`}>
                    <Activity className="w-8 h-8 text-indigo-500 shrink-0" />
                    <div className="space-y-2">
                        <h4 className={`text-lg font-black ${headingColor}`}>Основные принципы</h4>
                        <ul className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            <li>Торговля только в активные часы сессии;</li>
                            <li>Ограниченное количество сделок;</li>
                            <li>Заранее известный риск в каждой сделке;</li>
                            <li>Отсутствие эмоциональных решений;</li>
                            <li>Строгая дисциплина выхода из рынка.</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 4. Main Steps */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                        <LayoutList className={`w-6 h-6 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-500'}`} />
                        <h3 className={`text-xl font-black ${headingColor}`}>Алгоритм работы</h3>
                    </div>

                    <StrategyStep
                        number={1}
                        title="Какие инструменты подходят (Важна ликвидность)"
                        icon={<WalletCards className="w-5 h-5" />}
                        isOpen={openStep === 1}
                        onToggle={() => toggleStep(1)}
                    >
                        <p className="text-sm font-medium mb-2">Стратегия применяется только к ликвидным рынкам. Подходящие инструменты:</p>
                        <ul className="space-y-2 text-sm list-disc list-inside pl-2">
                            <li>Фьючерсы на индексы: <strong>ES, NQ, YM</strong>;</li>
                            <li>Фьючерсы на сырьё: <strong>CL</strong>;</li>
                            <li>Крипто-фьючерсы: <strong>BTC, ETH, SOL</strong>.</li>
                        </ul>
                        <p className="text-sm font-medium mt-4 mb-2">Почему важна ликвидность:</p>
                        <ul className="space-y-2 text-sm list-disc list-inside pl-2">
                            <li>Ликвидный рынок имеет узкий спред;</li>
                            <li>Быстро исполняет ордера;</li>
                            <li>Позволяет выходить из сделки без сильного проскальзывания.</li>
                        </ul>
                        <p className="text-sm font-medium mt-4">Мы не используем малоликвидные активы, так как они:</p>
                        <ul className="space-y-2 text-sm list-disc list-inside pl-2">
                            <li>Дают ложные сигналы;</li>
                            <li>Увеличивают риск случайных стопов;</li>
                            <li>Искажают результат стратегии.</li>
                        </ul>
                    </StrategyStep>

                    <StrategyStep
                        number={2}
                        title="Таймфреймы и подготовка"
                        icon={<GanttChart className="w-5 h-5" />}
                        isOpen={openStep === 2}
                        onToggle={() => toggleStep(2)}
                    >
                        <p className="text-sm font-medium mb-2">Перед началом торгов:</p>
                        <ul className="space-y-2 text-sm list-disc list-inside pl-2">
                            <li><strong>15 минут</strong> — общий контекст дня;</li>
                            <li><strong>5 минут</strong> — рабочий таймфрейм;</li>
                            <li><strong>1 минута</strong> — уточнение точки входа (по необходимости).</li>
                        </ul>
                        <p className="text-sm font-medium mt-4 mb-2">Перед открытием сессии отмечаются:</p>
                        <ul className="space-y-2 text-sm list-disc list-inside pl-2">
                            <li>Максимум и минимум предыдущего дня;</li>
                            <li>Ключевые уровни внутри диапазона;</li>
                            <li>Области, где цена уже проявляла активность.</li>
                        </ul>
                    </StrategyStep>

                    <StrategyStep
                        number={3}
                        title="Где мы входим в сделку"
                        icon={<Waypoints className="w-5 h-5" />}
                        isOpen={openStep === 3}
                        onToggle={() => toggleStep(3)}
                    >
                        <p className="text-sm font-medium mb-4">Сетап 1: Откат внутри тренда</p>
                        <p className="text-xs text-gray-500 leading-relaxed mb-2">Используется, когда рынок движется в одном направлении.</p>
                        <h5 className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-1">Условия:</h5>
                        <ul className="space-y-2 text-sm list-disc list-inside pl-2 mb-4">
                            <li>Есть выраженный импульс вверх или вниз;</li>
                            <li>Цена корректируется без сильного давления;</li>
                            <li>Откат останавливается у значимого уровня.</li>
                        </ul>
                        <p className="text-sm font-medium mb-4">Логика входа:</p>
                        <p className="text-xs text-gray-500 leading-relaxed mb-4">Мы входим по направлению основного движения, когда рынок показывает готовность продолжить тренд.</p>

                        <p className="text-sm font-medium mb-4">Сетап 2: Ложный пробой диапазона</p>
                        <p className="text-xs text-gray-500 leading-relaxed mb-2">Используется во флэте или на границах дневного диапазона.</p>
                        <h5 className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-1">Условия:</h5>
                        <ul className="space-y-2 text-sm list-disc list-inside pl-2 mb-4">
                            <li>Цена пробивает максимум или минимум дня;</li>
                            <li>Не появляется продолжения движения;</li>
                            <li>Цена возвращается обратно в диапазон.</li>
                        </ul>
                        <p className="text-sm font-medium mb-4">Логика входа:</p>
                        <p className="text-xs text-gray-500 leading-relaxed">Мы работаем против пробоя, когда рынок показывает, что движение было ложным.</p>
                    </StrategyStep>

                    <StrategyStep
                        number={4}
                        title="Куда ставим стоп-лосс"
                        icon={<MinusCircle className="w-5 h-5" />}
                        isOpen={openStep === 4}
                        onToggle={() => toggleStep(4)}
                    >
                        <p className="text-sm font-medium mb-2">Стоп-лосс — обязательная часть каждой сделки. Он ставится:</p>
                        <ul className="space-y-2 text-sm list-disc list-inside pl-2">
                            <li>За ближайший локальный экстремум;</li>
                            <li>За уровень, при пробое которого сценарий становится неверным.</li>
                        </ul>
                        <p className="text-sm font-medium mt-4 mb-2">Если стоп сработал:</p>
                        <ul className="space-y-2 text-sm list-disc list-inside pl-2">
                            <li>Сделка считается завершённой;</li>
                            <li>Повторный вход возможен только при новом сетапе.</li>
                        </ul>
                        <p className="text-rose-400 font-bold p-3 rounded-xl bg-rose-400/5 border border-rose-400/20 list-none mt-4">
                            Усреднение убыточных позиций запрещено.
                        </p>
                    </StrategyStep>

                    <StrategyStep
                        number={5}
                        title="Где мы выходим из сделки"
                        icon={<HandIcon className="w-5 h-5" />}
                        isOpen={openStep === 5}
                        onToggle={() => toggleStep(5)}
                    >
                        <ul className="space-y-2 text-sm list-disc list-inside pl-2">
                            <li>Фиксация части позиции на ближайшем уровне;</li>
                            <li>Полный выход при достижении цели;</li>
                            <li>Сопровождение сделки, если рынок развивается в нашу сторону.</li>
                        </ul>
                        <p className="text-sm font-medium mt-4">Мы не держим позицию «на авось» — выход всегда запланирован заранее.</p>
                    </StrategyStep>

                    <StrategyStep
                        number={6}
                        title="Пример сделки"
                        icon={<CandlestickChart className="w-5 h-5" />}
                        isOpen={openStep === 6}
                        onToggle={() => toggleStep(6)}
                    >
                        <ul className="space-y-2 text-sm list-disc list-inside pl-2">
                            <li>Допустим, <strong>SOL</strong>, график <strong>5 минут</strong>.</li>
                            <li>Цена формирует импульс вверх.</li>
                            <li>Происходит откат к уровню, где ранее был максимум.</li>
                            <li>После подтверждения на <strong>1-минутном графике</strong> открывается лонг.</li>
                            <li>Стоп размещается за минимум отката.</li>
                            <li>Цель — обновление локального максимума.</li>
                        </ul>
                    </StrategyStep>
                </div>

                {/* 4. Sidebar: Warnings & Errors */}
                <div className="space-y-6">
                    {/* Typical Errors */}
                    <div className={`rounded-2xl p-6 border ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100'
                        } shadow-lg space-y-4`}>
                        <div className="flex items-center gap-3">
                            <XCircle className={`w-6 h-6 text-gray-500`} />
                            <h3 className={`text-lg font-black ${headingColor}`}>Типичные ошибки новичков</h3>
                        </div>
                        <ul className="space-y-2 text-xs text-gray-500 list-disc list-inside">
                            <li>Торговля без чёткого плана;</li>
                            <li>Вход «потому что цена пошла»;</li>
                            <li>Перенос позиции на следующий день;</li>
                            <li>Увеличение объёма после убытков;</li>
                            <li>Игнорирование стоп-лосса.</li>
                        </ul>
                    </div>
                </div>
            </div>

        </div>
    )
}
