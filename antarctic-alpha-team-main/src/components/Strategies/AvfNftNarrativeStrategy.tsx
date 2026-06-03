import React, { useState } from 'react'
import { useThemeStore } from '@/store/themeStore'
import {
    Activity,
    ChevronDown,
    ChevronUp,
    Brain,
    ShieldAlert,
    TrendingUp,
    LayoutList,
    Search,
    AlertTriangle,
    Coins,
    Wallet,
    MessageSquare,
    Target
} from 'lucide-react'

interface StrategyStepProps {
    number: number | string
    title: string
    children: React.ReactNode
    icon: React.ReactNode
    isOpen: boolean
    onToggle: () => void
    badge?: string
}

const StrategyStep: React.FC<StrategyStepProps> = ({ number, title, children, icon, isOpen, onToggle, badge }) => {
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
                    <div className="flex-1">
                        <div className="flex items-center gap-3">
                            <div className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                                {icon}
                            </div>
                            <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                {title}
                            </h3>
                        </div>
                    </div>
                    {badge && (
                        <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-[#4E6E49]/10 text-[#4E6E49] text-[10px] font-bold uppercase tracking-wider border border-[#4E6E49]/20 mr-4">
                            {badge}
                        </span>
                    )}
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

export const AvfNftNarrativeStrategy: React.FC = () => {
    const { theme } = useThemeStore()
    const [openStep, setOpenStep] = useState<number | string>(1)

    const toggleStep = (step: number | string) => {
        setOpenStep(openStep === step ? '' : step)
    }

    const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'

    return (
        <div className="space-y-12 animate-fade-in">
            {/* 1. Hero Intro */}
            <div className={`relative overflow-hidden rounded-3xl p-8 border ${theme === 'dark'
                ? 'bg-gradient-to-br from-[#1a212a] to-[#0f1216] border-[#4E6E49]/20 shadow-2xl'
                : 'bg-gradient-to-br from-white to-[#4E6E49]/5 border-[#4E6E49]/10 shadow-xl'
                }`}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#4E6E49]/5 blur-3xl rounded-full -mr-20 -mt-20 pointer-events-none"></div>

                <div className="relative flex flex-col md:flex-row gap-8 items-start">
                    <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-[#4E6E49]/10' : 'bg-[#4E6E49]/5'}`}>
                        <MessageSquare className={`w-12 h-12 text-[#4E6E49]`} />
                    </div>
                    <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-3">
                            <h2 className={`text-2xl md:text-3xl font-black ${headingColor}`}>ARCA торговля NFT на нарративах</h2>
                            <span className="px-3 py-1 rounded-full bg-[#4E6E49]/20 text-[#4E6E49] text-[10px] font-black uppercase tracking-widest border border-[#4E6E49]/20">Narrative Trading</span>
                        </div>
                        <p className={`text-lg leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            Стратегия работы с темами, в которые рынок начинает верить. Заработок на импульсе внимания к теме, а не на долгосрочном качестве актива.
                        </p>
                        <div className="p-3 rounded-xl bg-[#4E6E49]/5 border border-[#4E6E49]/10 inline-block text-xs font-bold italic opacity-80">
                            "Ты покупаешь раньше, продаёшь когда внимание становится массовым."
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Basic Terms */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100 shadow-sm'}`}>
                    <div className="flex items-center gap-3 mb-4 text-[#4E6E49]">
                        <Brain className="w-6 h-6" />
                        <h4 className="font-black text-lg tracking-tight">Что такое нарратив</h4>
                    </div>
                    <p className="text-sm opacity-80 leading-relaxed">
                        Это устойчивая тема, которая активно обсуждается, привлекает свежий капитал и порождает новые проекты.
                        <strong> Не технология, а фокус внимания рынка.</strong>
                    </p>
                </div>

                <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100 shadow-sm'}`}>
                    <div className="flex items-center gap-3 mb-4 text-[#4E6E49]">
                        <LayoutList className="w-6 h-6" />
                        <h4 className="font-black text-lg tracking-tight">Примеры нарративов</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {['AI + крипта', 'Bitcoin Ordinals', 'GameFi', 'RWA', 'NFT Membership'].map(item => (
                            <span key={item} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${theme === 'dark' ? 'bg-[#4E6E49]/10 text-[#4E6E49] border border-[#4E6E49]/20' : 'bg-[#4E6E49]/5 text-[#4E6E49] border border-[#4E6E49]/10'}`}>
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* 3. Lifecycle */}
            <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#4E6E49]/5 border-[#4E6E49]/20' : 'bg-[#4E6E49]/5 border-[#4E6E49]/20'}`}>
                <div className="flex items-center gap-3 mb-6">
                    <Activity className="w-6 h-6 text-[#4E6E49]" />
                    <h3 className={`text-xl font-black ${headingColor}`}>Жизненный цикл нарратива</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl bg-[#4E6E49]/5 border border-[#4E6E49]/10">
                        <p className="text-[10px] font-black uppercase text-[#4E6E49] mb-2">1. Ранняя фаза</p>
                        <p className="text-xs opacity-70">Обсуждают единицы, цены низкие, мало проектов. <strong>Идеально для входа.</strong></p>
                    </div>
                    <div className="p-4 rounded-xl bg-[#4E6E49]/5 border border-[#4E6E49]/10">
                        <p className="text-[10px] font-black uppercase text-[#4E6E49] mb-2">2. Фаза роста</p>
                        <p className="text-xs opacity-70">Появляются инфлюенсеры, растёт объём, флоры начинают двигаться.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-[#4E6E49]/5 border border-[#4E6E49]/10">
                        <p className="text-[10px] font-black uppercase text-[#4E6E49] mb-2">3. Массовая фаза</p>
                        <p className="text-xs opacity-70">Тема в каждом посте, куча копий, рост замедляется. <strong>Поздний вход.</strong></p>
                    </div>
                    <div className="p-4 rounded-xl bg-[#4E6E49]/5 border border-[#4E6E49]/10">
                        <p className="text-[10px] font-black uppercase text-[#4E6E49] mb-2">4. Угасание</p>
                        <p className="text-xs opacity-70">Объёмы падают, внимание уходит. Остаются "багхолдеры".</p>
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                <div className="flex items-center gap-3 mb-2">
                    <LayoutList className={`w-6 h-6 ${theme === 'dark' ? 'text-[#4E6E49]' : 'text-[#4E6E49]'}`} />
                    <h3 className={`text-xl font-black ${headingColor}`}>Инструкция</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Steps 1-2 + Diagnostic */}
                    <div className="lg:col-span-2 space-y-4">
                        <StrategyStep
                            number={1}
                            title="Поиск и Проверка нарратива"
                            icon={<Search className="w-5 h-5" />}
                            isOpen={openStep === 1}
                            onToggle={() => toggleStep(1)}
                            badge="Step 1-2"
                        >
                            <div className="space-y-4">
                                <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                                    <h6 className="text-xs font-bold uppercase mb-2 text-[#4E6E49]">Где искать ранние сигналы:</h6>
                                    <ul className="text-xs space-y-2">
                                        <li>🐦 <strong>Twitter (X):</strong> Аналитика разработчиков и специализированных аккаунтов.</li>
                                        <li>💻 <strong>GitHub:</strong> Рост активности и новых репозиториев по теме.</li>
                                        <li>🏗️ <strong>Анонсы:</strong> Крупные фонды инвестируют в инфраструктуру под тему.</li>
                                    </ul>
                                </div>
                                <div className="p-4 rounded-xl border border-[#4E6E49]/20 bg-[#4E6E49]/5">
                                    <h6 className="text-xs font-bold uppercase text-[#4E6E49] mb-2">Критический вопрос для входа:</h6>
                                    <p className="text-xs">Решает ли тема задачу, есть ли в ней реальные деньги и заходит ли она широкому рынку?</p>
                                </div>
                            </div>
                        </StrategyStep>

                        <StrategyStep
                            number={2}
                            title="Отбор и Проверка проекта"
                            icon={<Target className="w-5 h-5" />}
                            isOpen={openStep === 2}
                            onToggle={() => toggleStep(2)}
                            badge="Step 3-4"
                        >
                            <div className="space-y-4">
                                <ul className="text-xs space-y-3">
                                    <li className="flex gap-2">✅ <strong>Связь:</strong> Понятная и прямая связь NFT с нарративом.</li>
                                    <li className="flex gap-2">✅ <strong>Саплай:</strong> Ограниченное количество токенов.</li>
                                    <li className="flex gap-2">✅ <strong>Команда:</strong> Живая активность и отсутствие анонимности (или сильное портфолио).</li>
                                </ul>
                                <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-[11px] text-orange-500">
                                    <strong>Опасайтесь:</strong> Проектов с общими формулировками или без внятного продукта ("мы тоже AI").
                                </div>
                            </div>
                        </StrategyStep>
                    </div>

                    <div className="space-y-6">
                        {/* Diagnostic */}
                        <div className={`rounded-2xl p-6 border ${theme === 'dark' ? 'bg-[#151a21]/80 border-white/5 shadow-xl' : 'bg-white border-gray-100 shadow-sm'} space-y-4 h-full`}>
                            <div className="flex items-center gap-3">
                                <ShieldAlert className="w-6 h-6 text-[#4E6E49]" />
                                <h4 className={`font-black uppercase text-sm ${headingColor}`}>А когда не работает?</h4>
                            </div>
                            <ul className="text-[10px] space-y-2 opacity-80 list-disc list-inside">
                                <li>В глубоком "медведе"</li>
                                <li>При общей усталости рынка от историй</li>
                                <li>Когда нарратив слишком сложен для понимания</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Steps 3-4 + Risks */}
                    <div className="lg:col-span-2 space-y-4">
                        <StrategyStep
                            number={3}
                            title="Вход и Мониторинг"
                            icon={<Wallet className="w-5 h-5" />}
                            isOpen={openStep === 3}
                            onToggle={() => toggleStep(3)}
                            badge="Step 5-6"
                        >
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-xl bg-[#4E6E49]/10 border border-[#4E6E49]/20">
                                        <h6 className="text-[10px] font-black uppercase text-[#4E6E49] mb-1">Точка входа:</h6>
                                        <p className="font-bold text-xs uppercase tracking-tight">До массовых обзоров</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-[#4E6E49]/10 border border-[#4E6E49]/20">
                                        <h6 className="text-[10px] font-black uppercase text-[#4E6E49] mb-1">Подтверждение:</h6>
                                        <p className="font-bold text-xs uppercase tracking-tight">Рост флора + объёма</p>
                                    </div>
                                </div>
                            </div>
                        </StrategyStep>

                        <StrategyStep
                            number={4}
                            title="Дисциплинированный Выход"
                            icon={<Coins className="w-5 h-5" />}
                            isOpen={openStep === 4}
                            onToggle={() => toggleStep(4)}
                            badge="Step 7"
                        >
                            <div className="space-y-4">
                                <p className="text-xs opacity-70">Продажа происходит по факту перегрева рынка, а не по обещаниям.</p>
                                <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5">
                                    <h6 className="text-xs font-bold uppercase text-rose-500 mb-2">Сигналы к выходу:</h6>
                                    <ul className="text-[11px] space-y-1.5 list-disc list-inside">
                                        <li>Тема стала массовой и вездесущей</li>
                                        <li>Появились сотни клонов-однодневок</li>
                                        <li>Внимание инвесторов сместилось на другие мемы</li>
                                    </ul>
                                </div>
                            </div>
                        </StrategyStep>
                    </div>

                    <div className="space-y-6">
                        {/* Risks Box */}
                        <div className={`rounded-2xl p-6 border ${theme === 'dark' ? 'bg-rose-500/5 border-rose-500/20' : 'bg-rose-50 border-rose-500/20'} space-y-4 h-full`}>
                            <div className="flex items-center gap-3">
                                <AlertTriangle className="w-6 h-6 text-rose-500" />
                                <h3 className={`text-lg font-black ${headingColor}`}>Риски</h3>
                            </div>
                            <ul className="text-xs space-y-2 opacity-80">
                                <li>🚩 Вход после всех инфлюенсеров</li>
                                <li>🚩 Удержание при потере внимания</li>
                                <li>🚩 Путаница между нарративом и пустышкой</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Final Outcome */}
            <div className={`rounded-2xl p-8 border ${theme === 'dark' ? 'bg-[#4E6E49]/5 border-[#4E6E49]/10' : 'bg-[#4E6E49]/5 border-[#4E6E49]/5 shadow-sm'} flex flex-col items-center text-center space-y-4`}>
                <div className="p-4 rounded-2xl bg-[#4E6E49]/50 text-white shadow-lg shadow-[#4E6E49]/20">
                    <TrendingUp className="w-8 h-8" />
                </div>
                <div className="max-w-2xl">
                    <h4 className={`text-xl font-black ${headingColor} uppercase mb-2`}>Краткий вывод</h4>
                    <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                        Торговля на нарративах — это анализ внимания, максимально ранний вход и дисциплинированный выход при первых признаках перегрева.
                    </p>
                </div>
            </div>
        </div>
    )
}
