import React, { useState, useEffect } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { useAdminStore } from '@/store/adminStore'
import { checkUserAccess } from '@/services/firestoreService'
import {
    Lightbulb,
    Wrench,
    Brain,
    Zap,
    BarChart,
    Search,
    Timer,
    Terminal,
    Monitor,
    Bot,
    Bell,
    Database,
    Share2,
    ShieldAlert,
    Users,
    ShieldCheck,
    Activity,
    TrendingUp,
    Lock,
    Calendar,
    ArrowLeft,
    ArrowRight,
    ArrowDown,
    ArrowDownToLine,
    Layers,
    Play,
    Copy,
    Info,
    Star,
    Filter,
    BookOpen,
    ExternalLink
} from 'lucide-react'
import { AVALateVolumeStrategy } from './AVALateVolumeStrategy'
import { AVAIntradayStrategy } from './AVAIntradayStrategy'
import { AVAFlipStrategy } from './AVAFlipStrategy'
import { AVAFlipFibaStrategy } from './AVAFlipFibaStrategy'
import { AVAFibaModeStrategy } from './AVAFibaModeStrategy'
import { AVACopyTradingAOStrategy } from './AVACopyTradingAOStrategy'
import { FasolAlertStrategy } from './FasolAlertStrategy'
import { AVAHolderLevelsStrategy } from './AVAHolderLevelsStrategy'
import { ARCATradingOnWallets } from './ARCATradingOnWallets'
import { StrategyDropdownSelector } from './StrategyDropdownSelector'
import { CategoryDropdownSelector } from './CategoryDropdownSelector'

type StrategyId = 'late-volume' | 'intraday' | 'flip' | 'flip-fiba' | 'fiba-mode' | 'copy-trading-ao' | 'fasol-alert' | 'holder-levels' | 'wallet-trading' | null;

export const MemecoinStrategies: React.FC = () => {
    const { theme } = useThemeStore()
    const { user } = useAuthStore()
    const { isAdmin } = useAdminStore()
    const [activeStrategy, setActiveStrategy] = useState<StrategyId>(null)
    const [activeToolCategory, setActiveToolCategory] = useState<number | null>(null)
    const [hasStrategiesAccess, setHasStrategiesAccess] = useState(true)
    const [hasToolsAccess, setHasToolsAccess] = useState(true)
    const [loading, setLoading] = useState(true)
    const [openArticles, setOpenArticles] = useState<Set<number>>(new Set())

    const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'

    useEffect(() => {
        const checkAccess = async () => {
            if (!user || isAdmin) {
                setLoading(false)
                return
            }

            const [stratResult, toolsResult] = await Promise.all([
                checkUserAccess(user.id, 'tools_strategies_view'),
                checkUserAccess(user.id, 'tools_items_view')
            ])

            setHasStrategiesAccess(stratResult.hasAccess)
            setHasToolsAccess(toolsResult.hasAccess)
            setLoading(false)
        }

        checkAccess()
    }, [user, isAdmin])

    const strategies = [
        { id: 'late-volume', name: 'ARCA Late Volume', icon: <BarChart className="w-4 h-4" /> },
        { id: 'intraday', name: 'ARCA Intraday', icon: <Zap className="w-4 h-4" /> },
        { id: 'flip', name: 'ARCA FLIP-1S', icon: <Timer className="w-4 h-4" /> },
        { id: 'flip-fiba', name: 'ARCA FLIP + FIBA', icon: <Zap className="w-4 h-4" /> },
        { id: 'fiba-mode', name: 'ARCA - FIBA MODE', icon: <Layers className="w-4 h-4" /> },
        { id: 'copy-trading-ao', name: 'ARCA — Copy Trading AO', icon: <Users className="w-4 h-4" /> },
        { id: 'fasol-alert', name: 'Fasol Alert Strategy', icon: <Bell className="w-4 h-4" /> },
        { id: 'holder-levels', name: 'ARCA — Топ-держатели уровни', icon: <Users className="w-4 h-4" /> },
        { id: 'wallet-trading', name: 'ARCA Trading on wallets', icon: <Search className="w-4 h-4" /> },
    ]

    if (loading) {
        return null // Sub-loading handled by parent
    }

    return (
        <div className="space-y-16 pb-20">
            {/* 2. Strategies Block */}
            {hasStrategiesAccess ? (
                <section className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-[#4E6E49]/10 rounded-xl border border-[#4E6E49]/20">
                                <Lightbulb className="w-6 h-6 text-[#4E6E49]" />
                            </div>
                            <div>
                                <h3 className={`text-xl font-black ${headingColor}`}>Стратегии</h3>
                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Проверенные методики отбора и управления позициями
                                </p>
                            </div>
                        </div>

                        {/* Strategy Selector - Visible when strategy is already selected */}
                        {activeStrategy !== undefined && (
                            <StrategyDropdownSelector
                                strategies={strategies}
                                activeStrategy={activeStrategy}
                                setActiveStrategy={setActiveStrategy as (id: string | null) => void}
                                placeholder="Выберите стратегию Memecoin"
                            />
                        )}
                    </div>

                    {!activeStrategy ? (
                        /* Selection Grid - New Design */
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[
                                {
                                    id: 'late-volume',
                                    name: 'ARCA Late Volume',
                                    description: 'Работа с аномальными объемами на поздних стадиях.',
                                    icon: <BarChart className="w-8 h-8" />,
                                    color: 'green'
                                },
                                {
                                    id: 'intraday',
                                    name: 'ARCA Intraday',
                                    description: 'Внутридневная торговля на основе технического анализа.',
                                    icon: <Zap className="w-8 h-8" />,
                                    color: 'amber'
                                },
                                {
                                    id: 'flip',
                                    name: 'ARCA FLIP-1S',
                                    description: 'Скоростная торговля на изменениях цены в 1 секунду.',
                                    icon: <Timer className="w-8 h-8" />,
                                    color: 'rose'
                                },
                                {
                                    id: 'flip-fiba',
                                    name: 'ARCA FLIP + FIBA',
                                    description: 'Интрадей-флип токенов Solana pre-migration.',
                                    icon: <Zap className="w-8 h-8" />,
                                    color: 'orange'
                                },
                                {
                                    id: 'fiba-mode',
                                    name: 'ARCA FIBA MODE',
                                    description: 'Торговля по фибоначчи и уровням.',
                                    icon: <Layers className="w-8 h-8" />,
                                    color: 'purple'
                                },
                                {
                                    id: 'copy-trading-ao',
                                    name: 'ARCA Copy Trading AO',
                                    description: 'Копирование высокопотенциальных сделок с ручной проверкой.',
                                    icon: <Users className="w-8 h-8" />,
                                    color: 'cyan'
                                },
                                {
                                    id: 'fasol-alert',
                                    name: 'Fasol Alert Strategy',
                                    description: 'Математический подход с двумя параллельными стратегиями и высоким винрейтом.',
                                    icon: <Bell className="w-8 h-8" />,
                                    color: 'red'
                                },
                                {
                                    id: 'holder-levels',
                                    name: 'ARCA Топ-держатели уровни',
                                    description: 'Торговля от уровней поддержки топ-10 и топ-25 держателей.',
                                    icon: <Users className="w-8 h-8" />,
                                    color: 'blue'
                                },
                                {
                                    id: 'wallet-trading',
                                    name: 'ARCA Trading on Wallets',
                                    description: 'Торговля по действиям успешных кошельков: инфлюенсеров, смарт-мани и команд.',
                                    icon: <Search className="w-8 h-8" />,
                                    color: 'violet'
                                },
                            ].map((s) => {
                                return (
                                    <button
                                        key={s.id}
                                        onClick={() => setActiveStrategy(s.id as StrategyId)}
                                        className={`group p-6 rounded-2xl text-left transition-all duration-300 border hover:shadow-xl hover:-translate-y-1 cursor-pointer ${
                                            theme === 'dark' 
                                                ? 'bg-[#151a21]/50 border-white/5 hover:border-[#4E6E49]/30 hover:bg-[#4E6E49]/5' 
                                                : 'bg-white border-gray-200 hover:border-[#4E6E49]/30 hover:bg-[#4E6E49]/5'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className={`p-4 rounded-2xl w-fit mb-4 transition-transform duration-300 group-hover:scale-110 bg-[#4E6E49]/10 border border-[#4E6E49]/20`}>
                                                {React.cloneElement(s.icon as React.ReactElement, { className: 'w-8 h-8 text-[#4E6E49]' })}
                                            </div>
                                            <ArrowRight className="w-5 h-5 text-[#4E6E49]" />
                                        </div>
                                        <h4 className={`text-lg font-black mb-2 ${headingColor}`}>{s.name}</h4>
                                        <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {s.description}
                                        </p>
                                    </button>
                                )
                            })}
                        </div>
                    ) : (
                        /* Active Strategy View */
                        <div className={`rounded-3xl border p-1 sm:p-2 ${theme === 'dark' ? 'bg-[#0b1015]/50 border-white/5' : 'bg-white border-gray-100'
                            } shadow-xl animate-scale-up`}>
                            <div className={`p-6 sm:p-8 rounded-[2.5rem] ${theme === 'dark' ? 'bg-[#151a21]/50' : 'bg-gray-50/50'
                                }`}>
                                <div className="mb-6 flex items-center justify-between">
                                    <button
                                        onClick={() => setActiveStrategy(null)}
                                        className="text-xs font-bold text-gray-500 hover:text-[#4E6E49] transition-colors flex items-center gap-1"
                                    >
                                        ← К списку стратегий
                                    </button>
                                </div>
                                {activeStrategy === 'late-volume' ? (
                                    <AVALateVolumeStrategy />
                                ) : activeStrategy === 'intraday' ? (
                                    <AVAIntradayStrategy />
                                ) : activeStrategy === 'flip' ? (
                                    <AVAFlipStrategy />
                                ) : activeStrategy === 'flip-fiba' ? (
                                    <AVAFlipFibaStrategy />
                                ) : activeStrategy === 'fiba-mode' ? (
                                    <AVAFibaModeStrategy />
                                ) : activeStrategy === 'fasol-alert' ? (
                                    <FasolAlertStrategy />
                                ) : activeStrategy === 'holder-levels' ? (
                                    <AVAHolderLevelsStrategy />
                                ) : activeStrategy === 'wallet-trading' ? (
                                    <ARCATradingOnWallets />
                                ) : (
                                    <AVACopyTradingAOStrategy />
                                )}
                            </div>
                        </div>
                    )}
                </section>
            ) : (
                <section className={`p-8 rounded-3xl border text-center space-y-4 ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                    <Lock className="w-12 h-12 text-gray-500 mx-auto" />
                    <h3 className={`text-lg font-bold ${headingColor}`}>Доступ к стратегиям заблокирован</h3>
                    <p className="text-sm text-gray-500">Свяжитесь с администратором для получения доступа.</p>
                </section>
            )}

            {/* 3. Tools Block */}
            {hasToolsAccess ? (
                <section className="space-y-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-[#4E6E49]/10 rounded-xl border border-[#4E6E49]/20">
                                <Wrench className="w-6 h-6 text-[#4E6E49]" />
                            </div>
                            <div>
                                <h3 className={`text-xl font-black ${headingColor}`}>Инструменты</h3>
                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Вспомогательные сервисы и скрипты
                                </p>
                            </div>
                        </div>

                        {activeToolCategory !== undefined && (
                            <CategoryDropdownSelector
                                categories={[
                                    { id: 0, name: 'Терминалы и Исполнение', icon: <Terminal className="w-4 h-4" /> },
                                    { id: 1, name: 'Ончейн-аналитика и блокчейны', icon: <Database className="w-4 h-4" /> },
                                    { id: 2, name: 'Безопасность и Речерч', icon: <ShieldCheck className="w-4 h-4" /> },
                                    { id: 3, name: 'Продвинутая Аналитика', icon: <Brain className="w-4 h-4" /> },
                                    { id: 4, name: 'Нарративы', icon: <Share2 className="w-4 h-4" /> },
                                    { id: 5, name: 'Демо-торговля', icon: <Play className="w-4 h-4" /> },
                                ]}
                                activeCategory={activeToolCategory}
                                setActiveCategory={setActiveToolCategory}
                                placeholder="Выберите категорию"
                            />
                        )}
                    </div>

                    <div className="space-y-12">
                        {activeToolCategory === null ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {[
                                    {
                                        id: 0,
                                        title: 'Терминалы и Исполнение',
                                        description: 'Платформы для быстрой торговли и мониторинга',
                                        icon: <Terminal className="w-8 h-8" />,
                                        color: 'green'
                                    },
                                    {
                                        id: 1,
                                        title: 'Ончейн-аналитика',
                                        description: 'Блокчейн-эксплореры и данные о транзакциях',
                                        icon: <Database className="w-8 h-8" />,
                                        color: 'emerald'
                                    },
                                    {
                                        id: 2,
                                        title: 'Безопасность и Речерч',
                                        description: 'Проверка токенов и анализ связей кошельков',
                                        icon: <ShieldCheck className="w-8 h-8" />,
                                        color: 'rose'
                                    },
                                    {
                                        id: 3,
                                        title: 'Продвинутая Аналитика',
                                        description: 'Трекинг "умных денег" и инфлюенсеров',
                                        icon: <Brain className="w-8 h-8" />,
                                        color: 'purple'
                                    },
                                    {
                                        id: 4,
                                        title: 'Нарративы',
                                        description: 'Социальная аналитика и мониторинг внимания',
                                        icon: <Share2 className="w-8 h-8" />,
                                        color: 'indigo'
                                    },
                                    {
                                        id: 5,
                                        title: 'Демо-торговля',
                                        description: 'Практика без риска на виртуальных средствах',
                                        icon: <Play className="w-8 h-8" />,
                                        color: 'cyan'
                                    },
                                ].map((cat) => {
                                    return (
                                        <button
                                            key={cat.id}
                                            onClick={() => setActiveToolCategory(cat.id)}
                                            className={`group p-6 rounded-2xl text-left transition-all duration-300 border hover:shadow-xl hover:-translate-y-1 cursor-pointer ${
                                                theme === 'dark' 
                                                    ? 'bg-[#151a21]/50 border-white/5 hover:border-[#4E6E49]/30 hover:bg-[#4E6E49]/5' 
                                                    : 'bg-white border-gray-200 hover:border-[#4E6E49]/30 hover:bg-[#4E6E49]/5'
                                            }`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="p-4 rounded-2xl w-fit mb-4 transition-transform duration-300 group-hover:scale-110 bg-[#4E6E49]/10 border border-[#4E6E49]/20">
                                                    {React.cloneElement(cat.icon as React.ReactElement, { className: 'w-8 h-8 text-[#4E6E49]' })}
                                                </div>
                                                <ArrowRight className="w-5 h-5 text-[#4E6E49]" />
                                            </div>
                                            <h4 className={`text-lg font-black mb-2 ${headingColor}`}>{cat.title}</h4>
                                            <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                {cat.description}
                                            </p>
                                        </button>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="space-y-8 animate-scale-up">
                                <div className="flex items-center justify-between">
                                    <button
                                        onClick={() => setActiveToolCategory(null)}
                                        className="text-xs font-bold text-gray-500 hover:text-[#4E6E49] transition-colors flex items-center gap-2"
                                    >
                                        <ArrowLeft className="w-4 h-4" /> К категориям
                                    </button>
                                </div>

                                {[
                                    {
                                        title: 'Терминалы и Исполнение',
                                        description: 'Платформы для быстрой торговли и мониторинга',
                                        icon: <Terminal className="w-6 h-6 text-green-500" />,
                                        items: [
                                            { name: 'Axiom', url: 'https://axiom.trade/@dexim3', desc: 'Профессиональный терминал для анализа и выбора монет', icon: <BarChart className="w-5 h-5 text-[#4E6E49]" /> },
                                            { name: 'GMGN', url: 'https://gmgn.ai/rewards/Mxam3xgW?chain=sol', desc: 'Профессиональный терминал для анализа и выбора монет', icon: <Zap className="w-5 h-5 text-yellow-400" /> },
                                            { name: 'DexScreener', url: 'https://dexscreener.com', desc: 'Мониторинг графиков и поиск новых пар', icon: <Monitor className="w-5 h-5 text-slate-400" /> },
                                            { name: 'Alpha One', url: 'https://t.me/alpha_web3_bot?start=nbyO0C5R', desc: 'ТГ-терминал с сигналами и AI-агентом', icon: <Bot className="w-5 h-5 text-purple-400" /> },
                                            { name: 'Fasol', url: 'https://t.me/fasolbot?start=ref_artyommedoed', desc: 'Торговый бот с гибкими алертами', icon: <Bell className="w-5 h-5 text-red-400" /> },
                                            { name: 'Frontrun', url: 'https://chromewebstore.google.com/detail/frontrun/kifcalgkjaphbpbcgokommchjiimejah', desc: 'Торговый терминал, объединяющий торговлю, проверку кошельков и многое другое', icon: <ShieldAlert className="w-5 h-5 text-orange-400" /> },
                                            { name: 'Catapult', url: 'https://catapult.trade/r/DEXIM', desc: 'Торговля мемами с плечом (лонг и шорт)', icon: <Zap className="w-5 h-5 text-green-400" /> },
                                        ]
                                    },
                                    {
                                        title: 'Ончейн-аналитика и блокчейны',
                                        description: 'Блокчейн-эксплореры и данные о транзакциях',
                                        icon: <Database className="w-6 h-6 text-[#4E6E49]" />,
                                        items: [
                                            { name: 'Solscan', url: 'https://solscan.io', desc: 'Эксплорер блокчейна Solana', icon: <Search className="w-5 h-5 text-teal-400" /> },
                                            { name: 'Etherscan', url: 'https://etherscan.io', desc: 'Эксплорер блокчейна Ethereum', icon: <Database className="w-5 h-5 text-indigo-400" /> },
                                            { name: 'BscScan', url: 'https://bscscan.com', desc: 'Эксплорер блокчейна BSC', icon: <Database className="w-5 h-5 text-yellow-500" /> },
                                        ]
                                    },
                                    {
                                        title: 'Безопасность и Речерч',
                                        description: 'Проверка токенов и анализ связей кошельков',
                                        icon: <ShieldCheck className="w-6 h-6 text-rose-500" />,
                                        items: [
                                            { name: 'Bubblemaps', url: 'https://bubblemaps.io', desc: 'Визуализация связей кошельков', icon: <Share2 className="w-5 h-5 text-pink-400" /> },
                                            { name: 'RugCheck', url: 'https://rugcheck.xyz', desc: 'Проверка токенов на безопасность', icon: <ShieldCheck className="w-5 h-5 text-red-500" /> },
                                            { name: 'SolSniffer', url: 'https://www.solsniffer.com', desc: 'Сниффер новых токенов Solana', icon: <Activity className="w-5 h-5 text-violet-400" /> },
                                            { name: 'Token Sniffer', url: 'https://tokensniffer.com/', desc: 'Автоматическое обнаружение мошенничества, аудит контрактов и анализ рисков', icon: <Search className="w-5 h-5 text-cyan-400" /> },
                                            { name: 'Honeypot.is', url: 'https://honeypot.is', desc: 'Симуляция продажи токена. Проверка налогов и honeypot-рисков для BSC, Ethereum и Base.', icon: <ShieldAlert className="w-5 h-5 text-amber-400" /> },
                                            { name: 'BSCCheck.eu', url: 'https://bsccheck.eu', desc: 'Комплексный анализ BSC: проверка ликвидности, топ-холдеров, honeypot и статуса контракта.', icon: <Database className="w-5 h-5 text-teal-400" /> },
                                        ]
                                    },
                                    {
                                        title: 'Продвинутая Аналитика',
                                        description: 'Трекинг "умных денег" и инфлюенсеров',
                                        icon: <Brain className="w-6 h-6 text-purple-500" />,
                                        items: [
                                            { name: 'Nansen', url: 'https://www.nansen.ai', desc: 'Smart Money и глубокая аналитика', icon: <Brain className="w-5 h-5 text-cyan-400" /> },
                                            { name: 'HolderScan', url: 'https://holderscan.com', desc: 'Анализ холдеров и кластеров', icon: <Users className="w-5 h-5 text-emerald-400" /> },
                                            { name: 'KolScan', url: 'https://kolscan.io', desc: 'Трекинг KOL-ов и инфлюенсеров', icon: <TrendingUp className="w-5 h-5 text-fuchsia-400" /> },
                                        ]
                                    },
                                    {
                                        title: 'Нарративы',
                                        description: 'Социальная аналитика и мониторинг внимания',
                                        icon: <Share2 className="w-6 h-6 text-indigo-500" />,
                                        items: [
                                            { name: 'LunarCrush', url: 'https://lunarcrush.com/home?category=cryptocurrencies', desc: 'Социальная и тренд-аналитика: метрики популярности, настроения и роста обсуждений.', icon: <Activity className="w-5 h-5 text-orange-400" /> },
                                            { name: 'Santiment', url: 'https://app.santiment.net', desc: 'Социальные и он-чейн метрики: упоминания, активность сообщества и поведение держателей.', icon: <BarChart className="w-5 h-5 text-[#4E6E49]" /> },
                                            { name: 'Sharpe AI', url: 'https://sharpe.ai/home/ru', desc: 'Крипто mindshare и тренды: отслеживание доли обсуждений и внимания в реальном времени.', icon: <Brain className="w-5 h-5 text-purple-400" /> },
                                            { name: 'Coindar', url: 'https://coindar.org', desc: 'Календарь событий: листинги, аирдропы и мероприятия как триггеры нарративов.', icon: <Calendar className="w-5 h-5 text-green-400" /> },
                                        ]
                                    },
                                    {
                                        title: 'Демо-торговля',
                                        description: 'Практика без риска на виртуальных средствах',
                                        icon: <Play className="w-6 h-6 text-cyan-500" />,
                                        items: [
                                            { name: 'ZERØ', url: 'https://zero.solanatrader.io', desc: 'Бумажное торговое наложение Solana для практики исполнения, дисциплины и стратегии в реальных терминалах DEX.', icon: <Play className="w-5 h-5 text-cyan-400" /> },
                                            { name: 'Sniper', url: 'https://www.sniper.xyz', desc: 'Торговый терминал с демо-торговлей на реальном рынке и интерфейсом, приближенным к реальным инструментам.', icon: <Terminal className="w-5 h-5 text-green-400" /> },
                                            { name: 'Mevx', url: 'https://mevx.io/@Dexim3', desc: 'Удобный торговый терминал с демо-торговлей, в т.ч. с лимитными заявками.', icon: <Terminal className="w-5 h-5 text-cyan-400" /> },
                                        ]
                                    },
                                ]
                                    .filter((_c, i) => i === activeToolCategory).map((category, catIdx) => (
                                        <div key={catIdx} className="space-y-6">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-3 rounded-2xl transition-colors ${theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-gray-100 border border-gray-200'}`}>
                                                    {category.icon}
                                                </div>
                                                <div>
                                                    <h4 className={`text-xl font-bold ${headingColor}`}>{category.title}</h4>
                                                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{category.description}</p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                                {category.items.map((tool, idx) => (
                                                    <a
                                                        key={idx}
                                                        href={tool.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={`group p-5 rounded-2xl transition-all duration-300 border hover:shadow-xl hover:-translate-y-1 ${
                                                            theme === 'dark' 
                                                                ? 'bg-[#151a21]/50 border-white/5 hover:border-[#4E6E49]/30 hover:bg-[#4E6E49]/5' 
                                                                : 'bg-white border-gray-200 hover:border-[#4E6E49]/30 hover:bg-[#4E6E49]/5'
                                                        }`}
                                                    >
                                                        <div className="p-3 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform bg-[#4E6E49]/10 border border-[#4E6E49]/20">
                                                            {tool.icon}
                                                        </div>

                                                        <h4 className={`font-bold mb-1 ${headingColor} flex items-center gap-2`}>
                                                            {tool.name}
                                                            <ExternalLink className="w-3.5 h-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        </h4>
                                                        <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                            {tool.desc}
                                                        </p>
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                </section>
            ) : (
                <section className={`p-8 rounded-3xl border text-center space-y-4 ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                    <Lock className="w-12 h-12 text-gray-500 mx-auto" />
                    <h3 className={`text-lg font-bold ${headingColor}`}>Список инструментов скрыт</h3>
                    <p className="text-sm text-gray-500">Доступ ограничен администратором.</p>
                </section>
            )}

            {/* 4. Top Dev Section */}
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#4E6E49]/10 rounded-xl border border-[#4E6E49]/20">
                            <Star className="w-6 h-6 text-[#4E6E49]" />
                        </div>
                        <div>
                            <h3 className={`text-xl font-black ${headingColor}`}>Top Dev</h3>
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                Кошельки Devов для отслеживания запусков/торговли
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => {
                                const gmgnData = [
                                    { address: "AQc5Xb5rZhRJhwCnuVukJRg32rrtoNBTRRdw29a8XJGG", name: "9iLW5FRnZrnEtfri9BHJfcF9S2gnZt", emoji: "", groups: ["DEV NEIM"] },
                                    { address: "EFcGBtCmQ7QvB34pYaonopWf5ZJqHYBB5rAiRYm59G3f", name: "9iLW5FRnZrnEtfri9BHJfcF9S2gnZt", emoji: "", groups: ["DEV NEIM"] },
                                    { address: "CthHCQx15DaLX8C8h3CUc7QGjP45fmVpbzcW2J7SZvr", name: "9iLW5FRnZrnEtfri9BHJfcF9S2gnZt", emoji: "", groups: ["DEV NEIM"] },
                                    { address: "9iLW5FRnZrnEtfri9BHJfcF9S2gnZtTF4bDi7ZKwybLx", name: "9iLW5FRnZrnEtfri9BHJfcF9S2gnZt", emoji: "", groups: ["DEV NEIM"] },
                                    { address: "9VXuNqqqzniYYW3fRDeaCtUUtqWsEeWWn5umh3aF9h17", name: "9VXuNqqqzniYYW3fRDeaCtUUtqWsEe", emoji: "", groups: ["DEV NEIM"] },
                                    { address: "CG8H7EthgPtvVR4aVeYJgjSRMhKYhGCRYzg8wJvTmWWe", name: "CG8H7EthgPtvVR4aVeYJgjSRMhKYhG", emoji: "", groups: ["DEV NEIM"] },
                                    { address: "3vDNo8jDPaG6q89k2A55wN7vGSSij1VDuo4E3ebezrTX", name: "3vDNo8jDPaG6q89k2A55wN7vGSSij1", emoji: "💰", groups: ["DEV NEIM"] },
                                    { address: "4PG3gQ7ahqYKuteAtN3EuivWTQztWEEFk399SHRhXkB4", name: "4PG3gQ7ahqYKuteAtN3EuivWTQztWE", emoji: "", groups: ["DEV NEIM"] },
                                    { address: "WnBVqVTaiJk5hNbcwbHiffRVnMdf1aaxNU5JkSpvGub", name: "WnBVqVTaiJk5hNbcwbHiffRVnMdf1a", emoji: "", groups: ["DEV NEIM"] },
                                    { address: "CfumDPwfYn6m3W6fyzCMhsYkS2Uxpeu1npxZPUasV5nX", name: "CfumDPwfYn6m3W6fyzCMhsYkS2Uxpe", emoji: "", groups: ["DEV NEIM"] },
                                    { address: "8RrMaJXYwANd4zEskfPQuSYE35dTzaYtuwyKz3ewcZQx", name: "8RrMaJXYwANd4zEskfPQuSYE35dTza", emoji: "", groups: ["DEV NEIM"] },
                                    { address: "ALJ4P5QNyHeLEjpKGmA1eUfJHSEGQMjY8HLnDkSgjczb", name: "", emoji: "", groups: ["DEV NEIM"] },
                                    { address: "6xDpid1beBpmzaBKpd2L4Y44CJAo132cjc6xtzFCKnL1", name: "", emoji: "", groups: ["DEV NEIM"] },
                                    { address: "Bcs5kbnrih4BxNbU8aUTasvfmi5LkgkQXzWX7d1miLXp", name: "", emoji: "", groups: ["DEV NEIM"] },
                                    { address: "6kkCpqnFzuvozZg9FcAXvQaBrqmzFiwtaKUZRrLBMLnW", name: "", emoji: "", groups: ["DEV NEIM"] },
                                    { address: "7JZXALfy5FNrSM4y7UBGc8RbDgoMYSHj4KKQZnamWfHP", name: "7JZXALfy5FNrSM4y7UBGc8RbDgoMYS", emoji: "", groups: ["DEV NEIM"] },
                                    { address: "7KeTM38U87WLsthJGCxBMhv3gUakUEU4GJ68vBvB3Z8N", name: "7KeTM38U87WLsthJGCxBMhv3gUakUE", emoji: "", groups: ["DEV NEIM"] },
                                    { address: "HGFvPJFSZTL9wEQbgGrSqx5JyGuMjkERyK5uGjv32C1r", name: "", emoji: "", groups: ["DEV NEIM"] },
                                    { address: "EY1Gywyjxqfn71aG9cnnk3DXDHx5SNTDVjhkhvRkNRrY", name: "", emoji: "", groups: ["DEV NEIM"] },
                                    { address: "5j2Sd3oN1sydkm953Fx22PdWznmDdpzSiNovdBVz9LXn", name: "", emoji: "", groups: ["DEV NEIM"] },
                                    { address: "FXXsfWJCz3WnQ9VD2uhz8ZHp8zxVf696mQJ95S9rJawM", name: "", emoji: "", groups: ["DEV NEIM"] },
                                    { address: "HPRBXaMARD4wCijg3H9NDSH8JTVFwk3fe4PVes1Gemn8", name: "", emoji: "", groups: ["DEV NEIM"] },
                                    { address: "862TYSvRYoiHAK3F3WwTRYAfuGiQaGdxedN9AGvRGWo2", name: "", emoji: "", groups: ["DEV NEIM"] },
                                    { address: "AQdBYZNy3BZ1vouGUjA1w9Ay7aq7kH5UQSuh4LQWKotY", name: "", emoji: "", groups: ["DEV NEIM"] },
                                    { address: "GVP9YZHRSiwD8PfzSyhVLvwJQNCMN5vMxoUDFA1o2ZDa", name: "", emoji: "", groups: ["DEV NEIM"] },
                                    { address: "6uNm1NxNgURuuPMynWcfTPjJJXV3g6bPgJTF43hEVdcX", name: "", emoji: "", groups: ["DEV NEIM"] },
                                    { address: "CzwWvTVn39dSd4LiVc6W9gZxgu36737M2fcX4EWhquh4", name: "", emoji: "", groups: ["DEV NEIM"] },
                                    { address: "7ufmve7ZSFCzuNcKRunYrGtyb2Ka1MXzkWwf7jZhVsmL", name: "", emoji: "", groups: ["DEV NEIM"] },
                                    { address: "9VHB7HHU7msVHzd6BjMhHPbL2E92XPRiV2R7fg1Xx6T9", name: "", emoji: "", groups: ["DEV NEIM"] }
                                ]
                                navigator.clipboard.writeText(JSON.stringify(gmgnData, null, 2))
                            }}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all duration-300
                                bg-[#4C7F6E] hover:bg-[#3d6b5a] text-white shadow-lg hover:shadow-xl"
                        >
                            <Copy className="w-4 h-4" />
                            Импорт в GMGN/FASOL
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {[
                        "AQc5Xb5rZhRJhwCnuVukJRg32rrtoNBTRRdw29a8XJGG",
                        "EFcGBtCmQ7QvB34pYaonopWf5ZJqHYBB5rAiRYm59G3f",
                        "CthHCQx15DaLX8C8h3CUc7QGjP45fmVpbzcW2J7SZvr",
                        "9iLW5FRnZrnEtfri9BHJfcF9S2gnZtTF4bDi7ZKwybLx",
                        "9VXuNqqqzniYYW3fRDeaCtUUtqWsEeWWn5umh3aF9h17",
                        "CG8H7EthgPtvVR4aVeYJgjSRMhKYhGCRYzg8wJvTmWWe",
                        "3vDNo8jDPaG6q89k2A55wN7vGSSij1VDuo4E3ebezrTX",
                        "4PG3gQ7ahqYKuteAtN3EuivWTQztWEEFk399SHRhXkB4",
                        "WnBVqVTaiJk5hNbcwbHiffRVnMdf1aaxNU5JkSpvGub",
                        "CfumDPwfYn6m3W6fyzCMhsYkS2Uxpeu1npxZPUasV5nX",
                        "8RrMaJXYwANd4zEskfPQuSYE35dTzaYtuwyKz3ewcZQx",
                        "ALJ4P5QNyHeLEjpKGmA1eUfJHSEGQMjY8HLnDkSgjczb",
                        "6xDpid1beBpmzaBKpd2L4Y44CJAo132cjc6xtzFCKnL1",
                        "Bcs5kbnrih4BxNbU8aUTasvfmi5LkgkQXzWX7d1miLXp",
                        "6kkCpqnFzuvozZg9FcAXvQaBrqmzFiwtaKUZRrLBMLnW",
                        "7JZXALfy5FNrSM4y7UBGc8RbDgoMYSHj4KKQZnamWfHP",
                        "7KeTM38U87WLsthJGCxBMhv3gUakUEU4GJ68vBvB3Z8N",
                        "HGFvPJFSZTL9wEQbgGrSqx5JyGuMjkERyK5uGjv32C1r",
                        "EY1Gywyjxqfn71aG9cnnk3DXDHx5SNTDVjhkhvRkNRrY",
                        "5j2Sd3oN1sydkm953Fx22PdWznmDdpzSiNovdBVz9LXn",
                        "FXXsfWJCz3WnQ9VD2uhz8ZHp8zxVf696mQJ95S9rJawM",
                        "HPRBXaMARD4wCijg3H9NDSH8JTVFwk3fe4PVes1Gemn8",
                        "862TYSvRYoiHAK3F3WwTRYAfuGiQaGdxedN9AGvRGWo2",
                        "AQdBYZNy3BZ1vouGUjA1w9Ay7aq7kH5UQSuh4LQWKotY",
                        "GVP9YZHRSiwD8PfzSyhVLvwJQNCMN5vMxoUDFA1o2ZDa",
                        "6uNm1NxNgURuuPMynWcfTPjJJXV3g6bPgJTF43hEVdcX",
                        "CzwWvTVn39dSd4LiVc6W9gZxgu36737M2fcX4EWhquh4",
                        "7ufmve7ZSFCzuNcKRunYrGtyb2Ka1MXzkWwf7jZhVsmL",
                        "9VHB7HHU7msVHzd6BjMhHPbL2E92XPRiV2R7fg1Xx6T9"
                    ].map((address, idx) => (
                        <button
                            key={idx}
                            onClick={() => navigator.clipboard.writeText(address)}
                            className={`group flex items-center gap-3 p-3 rounded-2xl border transition-all duration-300 hover:scale-[1.02]
                                ${theme === 'dark' 
                                    ? 'bg-white/5 border-white/10 hover:border-[#4E6E49]/30 hover:bg-[#4E6E49]/5' 
                                    : 'bg-gray-50 border-gray-200 hover:border-[#4E6E49]/30 hover:bg-[#4E6E49]/5'
                                }`}
                        >
                            <div className="p-2 rounded-xl bg-[#4E6E49]/10 border border-[#4E6E49]/20">
                                <Star className="w-4 h-4 text-[#4E6E49]" />
                            </div>
                            <div className="flex-1 min-w-0 text-left">
                                <p className={`text-xs font-mono truncate ${headingColor}`}>
                                    {address.slice(0, 6)}...{address.slice(-4)}
                                </p>
                            </div>
                            <Copy className={`w-4 h-4 transition-opacity 
                                ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                        </button>
                    ))}
                </div>
            </section>

            {/* 5. Filters Section */}
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#4E6E49]/10 rounded-xl border border-[#4E6E49]/20">
                            <Filter className="w-6 h-6 text-[#4E6E49]" />
                        </div>
                        <div>
                            <h3 className={`text-xl font-black ${headingColor}`}>Фильтры</h3>
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                Готовые настройки фильтров для разных этапов
                            </p>
                        </div>
                    </div>
                </div>

                {/* Filter Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { 
                            id: 'new_tokens', 
                            name: 'New Tokens', 
                            desc: 'Поиск свежих запусков',
                            config: {
                                "currentPage": "NewCreations",
                                "network": "sol",
                                "dex": {
                                    "Pump.fun": true, "pump_mayhem": false, "pump_mayhem_agent": false, "pump_agent": false,
                                    "letsbonk": true, "bonkers": false, "bags": false, "memoo": false, "liquid": false,
                                    "bankr": false, "zora": false, "surge": false, "anoncoin": false, "moonshot_app": false,
                                    "wendotdev": false, "heaven": false, "sugar": false, "token_mill": false, "believe": false,
                                    "trendsfun": false, "trends_fun": false, "jup_studio": false, "Moonshot": false, "boop": false,
                                    "xstocks": false, "ray_launchpad": false, "meteora_virtual_curve": false, "pool_ray": false,
                                    "pool_meteora": false, "pool_pump_amm": false, "pool_orca": false
                                },
                                "quote": {
                                    "sol_sol": true, "sol_usdc": true, "sol_usd1": true, "sol_zora": true, "sol_others": true
                                },
                                "metricsRange": {
                                    "progress": { "min": "", "max": "" },
                                    "created": { "min": "5", "max": "60" },
                                    "liquidity": { "min": "", "max": "" },
                                    "usd_market_cap": { "min": "6000", "max": "" },
                                    "top_10_holder_rate": { "min": "", "max": "" },
                                    "creator_balance_rate": { "min": "", "max": "" },
                                    "bundler_rate": { "min": "", "max": "" },
                                    "private_vault_hold_rate": { "min": "", "max": "" },
                                    "entrapment_ratio": { "min": "", "max": "" },
                                    "fresh_wallet_rate": { "min": "", "max": "" },
                                    "visiting_count": { "min": "", "max": "" },
                                    "top70_sniper_hold_rate": { "min": "", "max": "" },
                                    "rug_ratio": { "min": "", "max": "" },
                                    "x_follower": { "min": "", "max": "" },
                                    "total_fee": { "min": "1", "max": "" },
                                    "renowned_count": { "min": "", "max": "" },
                                    "creator_created_open_count": { "min": "", "max": "" },
                                    "creator_created_count": { "min": "2", "max": "" },
                                    "creator_created_open_ratio": { "min": "", "max": "" },
                                    "holders": { "min": "", "max": "" },
                                    "bot_count": { "min": "", "max": "" },
                                    "bot_degen_rate": { "min": "", "max": "" },
                                    "rat_trader_amount_rate": { "min": "", "max": "" },
                                    "twitter_rename_count": { "min": "", "max": "" },
                                    "volume_24h": { "min": "5000", "max": "" },
                                    "net_buy_24h": { "min": "", "max": "" },
                                    "swaps_24h": { "min": "", "max": "" },
                                    "buys_24h": { "min": "", "max": "" },
                                    "sells_24h": { "min": "", "max": "" },
                                    "smart_degen_count": { "min": "", "max": "" },
                                    "start_live_time": { "min": "", "max": "" },
                                    "tg_call_count": { "min": "", "max": "" }
                                },
                                "metricsSelect": {
                                    "creator_close": true, "creator_hold": false, "img_not_duplicate": false,
                                    "social_not_duplicate": false, "token_burnt": false, "renounced_mint": true,
                                    "renounced_freeze_account": true, "is_burnt": true, "is_token_live_v2": false,
                                    "is_token_end_live": false, "not_wash_trading": true, "dev_team_sell_all": false,
                                    "no_suspected_insider": false, "offchain": false, "uxento": false, "rapid": false
                                },
                                "social": {
                                    "has_social": true, "twitter_is_tweet": false, "dexscr_ad": false,
                                    "dexscr_trending_bar": false, "dexscr_boost": false, "dexscr_update_link": false,
                                    "cto_flag": false, "has_twitter": false, "has_website": false, "has_telegram": false,
                                    "has_youtube": false, "has_tiktok": false, "has_instagram": false
                                },
                                "inputKeywords": {}
                            }
                        },
                        { 
                            id: 'final_stretch', 
                            name: 'Final Stretch', 
                            desc: 'Токены на грани миграции',
                            config: {
                                "filters": {
                                    "age": { "max": null, "min": null }, "fees": { "max": null, "min": null },
                                    "txns": { "max": null, "min": null }, "bundle": { "max": null, "min": null },
                                    "volume": { "max": null, "min": 30000 }, "dexPaid": false,
                                    "holders": { "max": null, "min": null }, "numBuys": { "max": null, "min": null },
                                    "snipers": { "max": null, "min": null }, "twitter": { "max": null, "min": null },
                                    "website": false, "botUsers": { "max": null, "min": null },
                                    "insiders": { "max": null, "min": null }, "numSells": { "max": null, "min": null },
                                    "telegram": false, "liquidity": { "max": null, "min": null },
                                    "marketCap": { "max": null, "min": 50000 },
                                    "protocols": {
                                        "bonk": false, "boop": false, "pump": true, "pumpAmm": false,
                                        "raydium": false, "moonshot": false, "launchLab": false,
                                        "meteoraAmm": false, "launchACoin": false, "meteoraAmmV2": false,
                                        "virtualCurve": false
                                    },
                                    "devHolding": { "max": null, "min": null }, "bondingCurve": { "max": null, "min": null },
                                    "top10Holders": { "max": null, "min": null }, "mustEndInPump": false,
                                    "numMigrations": { "max": null, "min": null }, "twitterExists": false,
                                    "searchKeywords": [], "excludeKeywords": [], "atLeastOneSocial": false
                                },
                                "tab": "finalStretch"
                            }
                        },
                        { 
                            id: 'migration', 
                            name: 'Миграция', 
                            desc: 'Успешно мигрировавшие пары',
                            config: {
                                "filters": {
                                    "age": { "max": null, "min": null }, "fees": { "max": null, "min": "4" },
                                    "txns": { "max": null, "min": null }, "bundle": { "max": null, "min": null },
                                    "volume": { "max": null, "min": 100000 }, "dexPaid": false,
                                    "holders": { "max": null, "min": null }, "numBuys": { "max": null, "min": null },
                                    "snipers": { "max": null, "min": null }, "twitter": { "max": null, "min": null },
                                    "website": false, "botUsers": { "max": null, "min": null },
                                    "insiders": { "max": null, "min": null }, "numSells": { "max": null, "min": null },
                                    "telegram": false, "liquidity": { "max": null, "min": null },
                                    "marketCap": { "max": null, "min": 70000 },
                                    "protocols": {
                                        "bonk": true, "boop": false, "pump": true, "pumpAmm": false,
                                        "raydium": false, "moonshot": false, "launchLab": true,
                                        "meteoraAmm": false, "launchACoin": false, "meteoraAmmV2": false,
                                        "virtualCurve": true, "heaven": true, "jupiterStudio": false
                                    },
                                    "devHolding": { "max": null, "min": null }, "bondingCurve": { "max": null, "min": null },
                                    "top10Holders": { "max": null, "min": null }, "mustEndInPump": false,
                                    "numMigrations": { "max": null, "min": null }, "twitterExists": false,
                                    "searchKeywords": [], "excludeKeywords": [], "atLeastOneSocial": false
                                },
                                "tab": "migrated"
                            }
                        },
                    ].map((item) => (
                        <div 
                            key={item.id}
                            className={`group p-5 rounded-2xl border transition-all duration-300 hover:scale-[1.02] flex items-center justify-between
                                ${theme === 'dark' 
                                    ? 'bg-white/5 border-white/10 hover:border-[#4E6E49]/30 hover:bg-[#4E6E49]/5' 
                                    : 'bg-white border-gray-200 hover:border-[#4E6E49]/30 hover:bg-[#4E6E49]/5'
                                }`}
                        >
                            <div className="flex-1 min-w-0 pr-4">
                                <h4 className={`font-bold ${headingColor} truncate`}>{item.name}</h4>
                                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} truncate`}>{item.desc}</p>
                            </div>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(JSON.stringify(item.config, null, 2));
                                }}
                                className={`p-2.5 rounded-xl transition-all duration-300 bg-[#4E6E49]/10 border border-[#4E6E49]/20 hover:bg-[#4E6E49] hover:text-white group-hover:shadow-lg
                                    ${theme === 'dark' ? 'text-[#4E6E49]' : 'text-[#4E6E49]'}`}
                                title="Копировать фильтр"
                            >
                                <Copy className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* 6. Useful Articles Section */}
            <section className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#4E6E49]/10 rounded-xl border border-[#4E6E49]/20">
                        <BookOpen className="w-6 h-6 text-[#4E6E49]" />
                    </div>
                    <div>
                        <h3 className={`text-xl font-black ${headingColor}`}>Полезные статьи</h3>
                        <p className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            Экспертные материалы по оценке токенов и Devов
                        </p>
                    </div>
                </div>

                {/* Article 1 */}
                <div className={`rounded-3xl border overflow-hidden ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                    <button
                        onClick={() => {
                            const newOpen = new Set(openArticles)
                            if (newOpen.has(1)) {
                                newOpen.delete(1)
                            } else {
                                newOpen.add(1)
                            }
                            setOpenArticles(newOpen)
                        }}
                        className="w-full text-left"
                    >
                        <div className={`p-6 ${theme === 'dark' ? 'bg-gradient-to-r from-[#4E6E49]/10 to-transparent' : 'bg-gradient-to-r from-[#4E6E49]/5 to-transparent'}`}>
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-2xl bg-[#4E6E49]/10 border border-[#4E6E49]/20">
                                        <Star className="w-6 h-6 text-[#4E6E49]" />
                                    </div>
                                    <div>
                                        <h4 className={`text-lg font-black ${headingColor} mb-2`}>Топ-5 критериев оценки токена и Devа</h4>
                                        <p className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            Как правильно анализировать новые токены и принимать решения о входе
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <a
                                        href="https://www.uxento.io/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all duration-300
                                            bg-[#4C7F6E] hover:bg-[#3d6b5a] text-white shadow-lg hover:shadow-xl whitespace-nowrap"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        UXTENSION
                                    </a>
                                    <div className={`p-2 rounded-full transition-transform duration-300 ${openArticles.has(1) ? 'rotate-180' : ''}`}>
                                        <ArrowDown className={`w-5 h-5 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </button>
                    
                    {openArticles.has(1) && (
                        <div className="p-6 space-y-6 animate-fade-in">
                            {/* Point 1 */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-1 rounded-lg bg-[#4E6E49] text-white text-xs font-bold">1</span>
                                    <h5 className={`font-bold ${headingColor}`}>Оценка миграции: главный индикатор</h5>
                                </div>
                                <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-white/5' : 'bg-white'} space-y-2`}>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        <span className="text-[#4E6E49] font-bold">Главный вывод:</span> Если 50–60% объема мигрировало — это однозначно Green flag. Это говорит о том, что токен подхватили, идея зашла, а комьюнити активно.
                                    </p>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/30">🟢 Зеленая зона: 50–60% миграции</span>
                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-500/20 text-gray-400 border border-gray-500/30">⚪ Серая зона: 10–20% — требует проверки</span>
                                    </div>
                                    <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        Если 50% мигрировало, а остальные 50% без объема — дев не смог поймать начальное движение. Такой проект потенциально можно рассматривать.
                                    </p>
</div>
                        </div>

                        {/* Step 5 */}
                        <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-1 rounded-lg bg-[#4E6E49] text-white text-xs font-bold">2</span>
                                    <h5 className={`font-bold ${headingColor}`}>Если миграция низкая (10–20%): сценарии спасения</h5>
                                </div>
                                <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-white/5' : 'bg-white'} space-y-3`}>
                                    <div>
                                        <p className={`text-sm font-bold ${headingColor}`}>Сценарий 1: много лаунчей + низкая миграция</p>
                                        <p className={`text-xs ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Количество лаунчей 10–20 и процент миграции 10–20%.</p>
                                        <span className="inline-block mt-1 px-2 py-0.5 rounded text-xs font-bold bg-green-500/20 text-green-400">🟢 Вердикт: Green flag — минимальная виральность, но идея и комьюнижи есть</span>
                                    </div>
                                    <div>
                                        <p className={`text-sm font-bold ${headingColor}`}>Сценарий 2: аномально высокое количество лаунчей</p>
                                        <p className={`text-xs ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>12 546, 5 758, 2 832 лаунча и т.п.</p>
                                        <span className="inline-block mt-1 px-2 py-0.5 rounded text-xs font-bold bg-yellow-500/20 text-yellow-400">🟡 Вердикт: зависит от контекста — идея, СТО, качество твита</span>
                                        <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            Пример: E3caynYHVujvcBbq8bBBWqRsdymXY4etFz2iJ35qpump дала 200k при 1664 non-migrated монетах. Просто адекватный человек встал у руля СТО.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Point 3 */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-1 rounded-lg bg-[#4E6E49] text-white text-xs font-bold">3</span>
                                    <h5 className={`font-bold ${headingColor}`}>Первая монета деплоера: риски и возможности</h5>
                                </div>
                                <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-white/5' : 'bg-white'} space-y-2`}>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        Если кошелек деплоера новый и это его первый токен — ситуация 🟢/🔴
                                    </p>
                                    <ul className={`text-xs space-y-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        <li>• Проверить наличие продукта (сайт, соцсети)</li>
                                        <li>• Оценить качество сайта — если сделан не "на коленке" = Green flag</li>
                                        <li>• Красный флаг: кнопки не кликабельны, ведут на главную</li>
                                        <li>• Проверить страницу в X — нормальный аккаунт без следов других запусков</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Point 4 */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-1 rounded-lg bg-[#4E6E49] text-white text-xs font-bold">4</span>
                                    <h5 className={`font-bold ${headingColor}`}>Два важных чека: ренейм и CA на сайте</h5>
                                </div>
                                <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-white/5' : 'bg-white'} space-y-2`}>
                                    <div>
                                        <p className={`text-sm font-bold ${headingColor}`}>1) Проверка ренейма (бывшего ника)</p>
                                        <p className={`text-xs ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Если аккаунт в X менял название — стоит понять, под каким именем он существовал раньше. Это помогает исключить "мусорные" аккаунты.</p>
                                    </div>
                                    <div>
                                        <p className={`text-sm font-bold ${headingColor}`}>2) Наличие CA на сайте</p>
                                        <p className={`text-xs ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>CA (контракт) должен быть указан на официальном сайте. Допустим домен вроде Twitter-овского. Главное: старый домен + наличие CA = серьезный подход.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Point 5 */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-1 rounded-lg bg-[#4E6E49] text-white text-xs font-bold">5</span>
                                    <h5 className={`font-bold ${headingColor}`}>Главный инструмент: UXTENSION</h5>
                                </div>
                                <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-white/5' : 'bg-white'} space-y-2`}>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        Особое внимание — утилите <a href="https://www.uxento.io/" target="_blank" rel="noopener noreferrer" className="text-[#4E6E49] font-bold hover:underline">UXTENSION</a>
                                    </p>
                                    <ul className={`text-xs space-y-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        <li>• Подсветка монет, которые упоминались в альфа-группах несколько раз</li>
                                        <li>• Быстрый анализ истории токена</li>
                                        <li>• Возможность быстро "девнуть" токен, если видишь потенциал</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Article 2 */}
                <div className={`rounded-3xl border overflow-hidden ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                    <button
                        onClick={() => {
                            const newOpen = new Set(openArticles)
                            if (newOpen.has(2)) {
                                newOpen.delete(2)
                            } else {
                                newOpen.add(2)
                            }
                            setOpenArticles(newOpen)
                        }}
                        className="w-full text-left"
                    >
                        <div className={`p-6 ${theme === 'dark' ? 'bg-gradient-to-r from-[#4E6E49]/10 to-transparent' : 'bg-gradient-to-r from-[#4E6E49]/5 to-transparent'}`}>
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-2xl bg-[#4E6E49]/10 border border-[#4E6E49]/20">
                                        <TrendingUp className="w-6 h-6 text-[#4E6E49]" />
                                    </div>
                                    <div>
                                        <h4 className={`text-lg font-black ${headingColor} mb-2`}>Как торговать высокие (хай) MC</h4>
                                        <p className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            Три случая, когда такие монеты можно брать в работу
                                        </p>
                                    </div>
                                </div>
                                <div className={`p-2 rounded-full transition-transform duration-300 ${openArticles.has(2) ? 'rotate-180' : ''}`}>
                                    <ArrowDown className={`w-5 h-5 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} />
                                </div>
                            </div>
                        </div>
                    </button>

                    {openArticles.has(2) && (
                        <div className="p-6 space-y-6 animate-fade-in">
                            {/* Case 1 */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-1 rounded-lg bg-[#4E6E49] text-white text-xs font-bold">1</span>
                                    <h5 className={`font-bold ${headingColor}`}>Формирование культа вокруг монеты</h5>
                                </div>
                                <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-white/5' : 'bg-white'} space-y-3`}>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        Если вокруг монеты формируется определенный культ — это серьёзный сигнал. Примеры: <span className="text-[#4E6E49] font-bold">$KIRKINATOR</span> и <span className="text-[#4E6E49] font-bold">$REGRET</span>.
                                    </p>
                                    <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'}`}>
                                        <p className={`text-xs font-bold ${headingColor}`}>$KIRKINATOR</p>
                                        <p className={`text-xs ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            Очень вирусный аккаунт в X (<a href="https://x.com/kirkinator_sol" target="_blank" rel="noopener noreferrer" className="text-[#4E6E49] hover:underline">@kirkinator_sol</a>), прикольные видео с ИИ и сама идея про Кирка. График смотрелся очень привлекательно, каждый памп +100K$ MC от ATH. Это придало огласке, хорошим кошелькам и инфлам в X — и монета улетела.
                                        </p>
                                    </div>
                                    <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'}`}>
                                        <p className={`text-xs font-bold ${headingColor}`}>$REGRET</p>
                                        <p className={`text-xs ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            Комьюнити на 1.6к человек — редко такое можно увидеть, чтобы за забавным приколом так следовали. Это огромный Green flag, хоть и объемы небольшие, но это 100% слоукук. Вайбы Enough, GUT, UNC, Microwaved и прочего (монеты, которые по такому же принципу улетели). + накопление выглядело очень привлекательно, как пружина в трейдинге.
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">💡 Насмотренность</span>
                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">🎯 Шаблон потенциального раннера</span>
                                    </div>
                                    <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        Тут надо сравнивать, пробовать, от этого появляется определённая насмотренность и вы формируете у себя в голове шаблон, как выглядит потенциальный раннер. Знаете, это как вы идёте по улице и от проходящего человека чувствуете "тот самый" парфюм — здесь принцип такой же.
                                    </p>
                                </div>
                            </div>

                            {/* Case 2 */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-1 rounded-lg bg-[#4E6E49] text-white text-xs font-bold">2</span>
                                    <h5 className={`font-bold ${headingColor}`}>Продукт, разработка, команда что-то медленно, но верно билдит</h5>
                                </div>
                                <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-white/5' : 'bg-white'} space-y-3`}>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        Главное понять: будет ли это иметь какую-то ценность в будущем?
                                    </p>
                                    <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'}`}>
                                        <p className={`text-xs font-bold ${headingColor}`}>$EDX</p>
                                        <p className={`text-xs ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            Билдят свою трейд-платформу. Каждый пост в X — памп. Они говорят про то, что в будущем составят конкуренцию крупным игрокам. В это слабо верится, но почему нет? На их платформе уже можно торговать, они активных юзеров подогревают 20% рефбэками и + все бабки инвестируют дальше в продукт. От этого они и возят токен на 200к на протяжении уже 3 месяцев.
                                        </p>
                                    </div>
                                    <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'}`}>
                                        <p className={`text-xs font-bold ${headingColor}`}>$ON</p>
                                        <p className={`text-xs ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            Интересная разработка в формате игры в "президента". Есть полноценный сайт многопользовательский с учетками, где тому, кто станет "президентом" будут выплачиваться фисы.
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/30">✅ Чекайте роадмап</span>
                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/30">📊 КПД проекта</span>
                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/30">🔮 Ценность для людей</span>
                                    </div>
                                    <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        Если вы находите вполне логичные ответы и проект выглядит не как однодневка — это потенциальная возможность продавать хату, затем баить токен и без нервов фиксировать иксы.
                                    </p>
                                </div>
                            </div>

                            {/* Case 3 */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-1 rounded-lg bg-[#4E6E49] text-white text-xs font-bold">3</span>
                                    <h5 className={`font-bold ${headingColor}`}>Большие объёмы, чей-то свежий твит или новость</h5>
                                </div>
                                <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-white/5' : 'bg-white'} space-y-3`}>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        Старайтесь покупать такие токены примерно в диапазоне <span className="text-[#4E6E49] font-bold">100k$ MC — 130k$ MC</span>.
                                    </p>
                                    <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'} space-y-2`}>
                                        <p className={`text-xs ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            В таких монетах главное быстро сообразить, что к чему и забидить. Если он мунится дальше без оплаты DEX или комьюнити (быстрее чекать в <a href="https://t.me/Phanes_bot" target="_blank" rel="noopener noreferrer" className="text-[#4E6E49] hover:underline">Phanes Bot</a>), то это определённо Green flag и потенциальные ATH в 300-500k$ MC.
                                        </p>
                                        <p className={`text-xs ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            Если DEX уже оплатили до миграции или же сразу после — такое обычно просто скапайте или выходите на около +50%.
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">💰 Оставляйте 10% мунбэга</span>
                                    </div>
                                    <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        В таких ситуациях оставляйте 10% мунбэга. В первых двух случаях (культ/продукт) можно фиксить прибыль полностью, т.к. непонятно сколько ещё сидеть и ждать ли анонсов. Но тут не ошибайтесь в этом, оставляйте всегда, тем более сейчас хороший рынок и каждый день есть раннеры 1M$ MC +.
                                    </p>
                                </div>
                            </div>

                            {/* Graph Analysis */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <BarChart className="w-5 h-5 text-[#4E6E49]" />
                                    <h5 className={`font-bold ${headingColor}`}>Анализ графика</h5>
                                </div>
                                <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-white/5' : 'bg-white'} space-y-3`}>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-red-500/10' : 'bg-red-50'} border ${theme === 'dark' ? 'border-red-500/20' : 'border-red-200'}`}>
                                            <p className={`text-xs font-bold text-red-400 mb-1`}>🔴 Каскад ликвидаций</p>
                                            <p className={`text-xs ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Просто нисходящий тренд — баить не стоит</p>
                                        </div>
                                        <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-green-500/10' : 'bg-green-50'} border ${theme === 'dark' ? 'border-green-500/20' : 'border-green-200'}`}>
                                            <p className={`text-xs font-bold text-green-400 mb-1`}>🟢 Проторговка</p>
                                            <p className={`text-xs ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Долгое время на одном уровне — можно неплохо сформировать позу и ждать пампа</p>
                                        </div>
                                        <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-green-500/10' : 'bg-green-50'} border ${theme === 'dark' ? 'border-green-500/20' : 'border-green-200'} sm:col-span-2`}>
                                            <p className={`text-xs font-bold text-green-400 mb-1`}>🟢 Сжатие как пружина</p>
                                            <p className={`text-xs ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>График сжимается как пружина в трейдинге — хороший знак для предстоящего пампа</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Article 3 */}
                <div className={`rounded-3xl border overflow-hidden ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                    <button
                        onClick={() => {
                            const newOpen = new Set(openArticles)
                            if (newOpen.has(3)) {
                                newOpen.delete(3)
                            } else {
                                newOpen.add(3)
                            }
                            setOpenArticles(newOpen)
                        }}
                        className="w-full text-left"
                    >
                        <div className={`p-6 ${theme === 'dark' ? 'bg-gradient-to-r from-[#4E6E49]/10 to-transparent' : 'bg-gradient-to-r from-[#4E6E49]/5 to-transparent'}`}>
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-2xl bg-[#4E6E49]/10 border border-[#4E6E49]/20">
                                        <Zap className="w-6 h-6 text-[#4E6E49]" />
                                    </div>
                                    <div>
                                        <h4 className={`text-lg font-black ${headingColor} mb-2`}>Что делать, если маленький баланс?</h4>
                                        <p className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            Инструкция по выходу в профит
                                        </p>
                                    </div>
                                </div>
                                <div className={`p-2 rounded-full transition-transform duration-300 ${openArticles.has(3) ? 'rotate-180' : ''}`}>
                                    <ArrowDown className={`w-5 h-5 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} />
                                </div>
                            </div>
                        </div>
                    </button>

                    {openArticles.has(3) && (
                        <div className="p-6 space-y-6 animate-fade-in">
                            {/* Intro */}
                            <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-white/5' : 'bg-white'}`}>
                                <p className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                    В первых двух статьях мы разобрали, как оценивать токены и находить «зелёные флаги» даже при сложной статистике. Но есть нюанс: все эти знания бесполезны, если у вас <span className="text-[#4E6E49] font-bold">маленький баланс</span>. Когда на счету $30–100, любая ошибка становится критической. Психология давит: хочется «отыграться» или найти ту самую монету, которая заменит зарплату. Именно здесь новички сливают депозиты.
                                </p>
                            </div>

                            {/* Section 1 */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-1 rounded-lg bg-[#4E6E49] text-white text-xs font-bold">1</span>
                                    <h5 className={`font-bold ${headingColor}`}>Лоу-капы — ваша стартовая площадка</h5>
                                </div>
                                <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-white/5' : 'bg-white'} space-y-3`}>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        Если у вас маленький баланс, забудьте про хайповые монеты с миллионными объёмами. Ваша экосистема — <span className="text-[#4E6E49] font-bold">лоу-капы</span>.
                                    </p>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        Начинать стоит именно с них. Вот почему:
                                    </p>
                                    <ul className={`text-sm space-y-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        <li className="flex items-start gap-2">
                                            <span className="text-[#4E6E49] mt-1">▸</span>
                                            <span><span className="font-bold">Они учат относиться к потерям.</span> В крипте просадки неизбежны. Лоу-капы делают эту боль терпимой.</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-[#4E6E49] mt-1">▸</span>
                                            <span><span className="font-bold">Максимальная потеря фиксирована.</span> В среднем вы рискуете 20–30% от входа. Это не фатально.</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-[#4E6E49] mt-1">▸</span>
                                            <span><span className="font-bold">Потенциал роста не ограничен.</span> Как говорил классик: «Падать вы можете на 20%, а расти — хоть на 100 000%».</span>
                                        </li>
                                    </ul>
                                    <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-[#4E6E49]/10' : 'bg-[#4E6E49]/5'} border border-[#4E6E49]/20`}>
                                        <p className={`text-xs ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            <span className="font-bold">Совет:</span> не пытайтесь стать снайпером с маленьким балансом. Вы будете проигрывать ботам и комиссиям. Лучше развивайте скорость реакции на новости и умение быстро оценивать нарратив.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Section 2 */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-1 rounded-lg bg-[#4E6E49] text-white text-xs font-bold">2</span>
                                    <h5 className={`font-bold ${headingColor}`}>Окружение = 50% успеха</h5>
                                </div>
                                <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-white/5' : 'bg-white'} space-y-3`}>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        Это не метафора. В крипте <span className="text-[#4E6E49] font-bold">связи решают всё</span>. Если вы торгуете в одиночку, просматривая публичные каналы, вы уже опоздали.
                                    </p>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        Что должно «разрываться» у вас в телефоне:
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'}`}>
                                            <p className={`text-xs font-bold ${headingColor}`}>💬 Чаты</p>
                                            <p className={`text-xs ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Альфа-чаты, торговые комнаты</p>
                                        </div>
                                        <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'}`}>
                                            <p className={`text-xs font-bold ${headingColor}`}>👥 Контакты</p>
                                            <p className={`text-xs ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Личные связи с трейдерами</p>
                                        </div>
                                        <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'}`}>
                                            <p className={`text-xs font-bold ${headingColor}`}>🔐 Даошки / приватные группы</p>
                                            <p className={`text-xs ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Закрытые сообщества с инсайдами</p>
                                        </div>
                                    </div>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        Зачем это нужно:
                                    </p>
                                    <ul className={`text-xs space-y-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        <li>• <span className="font-bold">Разные мнения на одну ситуацию</span> — вы перестанете принимать решения в вакууме</li>
                                        <li>• <span className="font-bold">Скорость</span> — инсайд-инфу вы получаете на часы, а иногда и дни раньше толпы</li>
                                        <li>• <span className="font-bold">Минимизация рисков</span> — кто-то уже проверил контракт, нашёл красный флаг или подтвердил инфу</li>
                                    </ul>
                                    <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-purple-500/10' : 'bg-purple-50'} border ${theme === 'dark' ? 'border-purple-500/20' : 'border-purple-200'}`}>
                                        <p className={`text-xs ${theme === 'dark' ? 'text-purple-300' : 'text-purple-600'}`}>
                                            В будущем вы будете получать на пассиве то, что сегодня пытаетесь выгрызть и изучать. Связи работают, даже когда вы спите.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Section 3 */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-1 rounded-lg bg-[#4E6E49] text-white text-xs font-bold">3</span>
                                    <h5 className={`font-bold ${headingColor}`}>Энергия и настойчивость: главный секрет</h5>
                                </div>
                                <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-white/5' : 'bg-white'} space-y-3`}>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        Самое сложное в маленьком балансе — не потерять веру. Вы будете тратить время на ресерч, заходить в проекты, которые сливаются, и видеть, как другие зарабатывают миллионы на том, что вы пропустили.
                                    </p>
                                    <p className={`text-sm font-bold ${headingColor}`}>
                                        Не останавливайтесь. Отдавайте энергию вселенной. Она возвращается.
                                    </p>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        Не в формате «магии», а в формате:
                                    </p>
                                    <ul className={`text-sm space-y-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        <li className="flex items-start gap-2">
                                            <span className="text-[#4E6E49] mt-1">▸</span>
                                            <span>вы нарабатываете насмотренность</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-[#4E6E49] mt-1">▸</span>
                                            <span>вас замечают в чатах</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-[#4E6E49] mt-1">▸</span>
                                            <span>вы получаете доступ в приватные группы</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-[#4E6E49] mt-1">▸</span>
                                            <span>вы становитесь тем, к кому приходят с инсайдами</span>
                                        </li>
                                    </ul>
                                    <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-50'} border ${theme === 'dark' ? 'border-blue-500/20' : 'border-blue-200'}`}>
                                        <p className={`text-xs ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}>
                                            <span className="font-bold">Важно:</span> когда вы самый тупой в комнате — это идеальная точка старта. Не беситесь, а впитывайте.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Checklist */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-1 rounded-lg bg-[#4E6E49] text-white text-xs font-bold">4</span>
                                    <h5 className={`font-bold ${headingColor}`}>Чек-лист: первые шаги с маленьким балансом</h5>
                                </div>
                                <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-white/5' : 'bg-white'} space-y-4`}>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        Если у вас <span className="text-[#4E6E49] font-bold">$30–500</span> на счету, действуйте по плану:
                                    </p>
                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 rounded-lg bg-[#4E6E49]/10 text-[#4E6E49] text-xs font-bold shrink-0">70%</div>
                                            <div>
                                                <p className={`text-sm font-bold ${headingColor}`}>Формирование окружения</p>
                                                <p className={`text-xs ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Вступайте в чаты, пишите в личку, задавайте вопросы. Не молчите.</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 rounded-lg bg-[#4E6E49]/10 text-[#4E6E49] text-xs font-bold shrink-0">🔒</div>
                                            <div>
                                                <p className={`text-sm font-bold ${headingColor}`}>Только лоу-капы</p>
                                                <p className={`text-xs ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Максимальная просадка — 30%. Риск-менеджмент жёсткий: 1–3% от депозита на сделку.</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 rounded-lg bg-[#4E6E49]/10 text-[#4E6E49] text-xs font-bold shrink-0">🎯</div>
                                            <div>
                                                <p className={`text-sm font-bold ${headingColor}`}>Не снайпер, а нарративщик</p>
                                                <p className={`text-xs ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Ловите нарративы и новости. Учитесь отличать хайп от реального интереса.</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 rounded-lg bg-[#4E6E49]/10 text-[#4E6E49] text-xs font-bold shrink-0">⏭️</div>
                                            <div>
                                                <p className={`text-sm font-bold ${headingColor}`}>Не сливайте энергию на FOMO</p>
                                                <p className={`text-xs ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Пропустили рост? Ок. Следующий будет. Главное — не входить на вершине из страха упустить возможность.</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 rounded-lg bg-[#4E6E49]/10 text-[#4E6E49] text-xs font-bold shrink-0">💰</div>
                                            <div>
                                                <p className={`text-sm font-bold ${headingColor}`}>Фиксируйте профит</p>
                                                <p className={`text-xs ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Маленький баланс требует частых фиксаций. Не ждите x100 с каждым входом. 50%–x3 — отличный результат для старта.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Conclusion */}
                            <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-gradient-to-r from-[#4E6E49]/20 to-transparent' : 'bg-gradient-to-r from-[#4E6E49]/10 to-transparent'} border border-[#4E6E49]/20`}>
                                <p className={`text-sm font-bold ${headingColor} mb-2`}>Итог:</p>
                                <p className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                    Маленький баланс — это не приговор. Это <span className="text-[#4E6E49] font-bold">режим повышенной дисциплины</span>. Ваша задача не в том, чтобы найти одну монету на x1000.
                                </p>
                                <p className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mt-2`}>
                                    Задача — <span className="text-[#4E6E49] font-bold">выстроить систему</span>, в которой:
                                </p>
                                <ul className={`text-xs space-y-1 mt-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                    <li>✓ вы минимально теряете на входах</li>
                                    <li>✓ вы получаете информацию быстрее рынка</li>
                                    <li>✓ вы окружены людьми, которые умнее вас</li>
                                    <li>✓ вы не выгораете эмоционально</li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>

                {/* Article 4 */}
                <div className={`rounded-3xl border overflow-hidden ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                    <button
                        onClick={() => {
                            const newOpen = new Set(openArticles)
                            if (newOpen.has(4)) {
                                newOpen.delete(4)
                            } else {
                                newOpen.add(4)
                            }
                            setOpenArticles(newOpen)
                        }}
                        className="w-full text-left"
                    >
                        <div className={`p-6 ${theme === 'dark' ? 'bg-gradient-to-r from-[#4E6E49]/10 to-transparent' : 'bg-gradient-to-r from-[#4E6E49]/5 to-transparent'}`}>
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-2xl bg-[#4E6E49]/10 border border-[#4E6E49]/20">
                                        <Users className="w-6 h-6 text-[#4E6E49]" />
                                    </div>
                                    <div>
                                        <h4 className={`text-lg font-black ${headingColor} mb-2`}>Как найти хорошие кошельки?</h4>
                                        <p className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            Полное руководство по копи-трейдингу
                                        </p>
                                    </div>
                                </div>
                                <div className={`p-2 rounded-full transition-transform duration-300 ${openArticles.has(4) ? 'rotate-180' : ''}`}>
                                    <ArrowDown className={`w-5 h-5 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} />
                                </div>
                            </div>
                        </div>
                    </button>

                    {openArticles.has(4) && (
                        <div className="p-6 space-y-6 animate-fade-in">
                            {/* Intro */}
                            <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-white/5' : 'bg-white'}`}>
                                <p className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                    В предыдущих частях мы разобрали, как оценивать токены и как выстраивать стратегию при маленьком балансе. Но есть способ, который объединяет всё: <span className="text-[#4E6E49] font-bold">копи-трейдинг</span>. Вместо того чтобы самостоятельно ресерчить сотни монет, вы находите тех, кто уже делает это лучше вас, и повторяете их действия. Это не магия. Это системный подход к поиску ликвидности и инсайдов.
                                </p>
                            </div>

                            {/* Step 1 */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-1 rounded-lg bg-[#4E6E49] text-white text-xs font-bold">1</span>
                                    <h5 className={`font-bold ${headingColor}`}>Находим топ-трейдеров на DexScreener/GMGN</h5>
                                </div>
                                <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-white/5' : 'bg-white'} space-y-3`}>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        Первый и самый очевидный источник — <span className="text-[#4E6E49] font-bold">DexScreener</span>. Здесь собираются все, кто активно торгует на децентрализованных биржах.
                                    </p>
                                    <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'} space-y-2`}>
                                        <p className={`text-xs font-bold ${headingColor}`}>Алгоритм:</p>
                                        <ol className={`text-xs space-y-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'} list-decimal list-inside`}>
                                            <li>Заходим на <a href="http://dexscreener.com" target="_blank" rel="noopener noreferrer" className="text-[#4E6E49] hover:underline">dexscreener.com</a></li>
                                            <li>Переходим в раздел «Топ трейдеры» (Top Traders)</li>
                                            <li>Выбираем период <span className="font-bold">3D</span> (3 дня). Это оптимальный временной отрезок: не слишком короткий, чтобы отсеять случайности, и не слишком длинный, чтобы данные были актуальны.</li>
                                            <li>Копируем адрес кошелька.</li>
                                            <li>Переходим на <a href="http://gmgn.ai" target="_blank" rel="noopener noreferrer" className="text-[#4E6E49] hover:underline">gmgn.ai</a> — это лучший инструмент для анализа кошельков на сегодня. Вставляем адрес и получаем полную статистику.</li>
                                        </ol>
                                    </div>
                                </div>
                            </div>

                        {/* Step 2 */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-1 rounded-lg bg-[#4E6E49] text-white text-xs font-bold">2</span>
                                    <h5 className={`font-bold ${headingColor}`}>Критерии хорошего кошелька</h5>
                                </div>
                                <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-white/5' : 'bg-white'} space-y-3`}>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        Не все топ-трейдеры из рейтинга подходят для копирования. Многие показывают результат за счёт хай-риск стратегий или крупных депозитов. Вам нужны <span className="text-[#4E6E49] font-bold">стабильные смарты</span>.
                                    </p>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        Мы выработали три ключевых критерия:
                                    </p>
                                    <div className="overflow-x-auto">
                                        <table className={`w-full text-xs ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        <thead>
                                            <tr className={`border-b ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}>
                                                <th className={`text-left py-2 font-bold ${headingColor}`}>Параметр</th>
                                                <th className={`text-left py-2 font-bold ${headingColor}`}>Пороговое значение</th>
                                                <th className={`text-left py-2 font-bold ${headingColor}`}>Почему это важно</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className={`border-b ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'}`}>
                                                <td className="py-2">30-дневный PnL</td>
                                                <td className="py-2 text-green-400 font-bold">80% и выше</td>
                                                <td className="py-2">Показывает стабильную прибыльность на дистанции</td>
                                            </tr>
                                            <tr className={`border-b ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'}`}>
                                                <td className="py-2">Винрейт</td>
                                                <td className="py-2 text-green-400 font-bold">40% и более</td>
                                                <td className="py-2">Даже если просадки есть, они перекрываются успешными сделками</td>
                                            </tr>
                                            <tr>
                                                <td className="py-2">Количество токенов за 30 дней</td>
                                                <td className="py-2 text-green-400 font-bold">До 300</td>
                                                <td className="py-2">Отсекает «спам-трейдеров», которые лутают всё подряд без системы</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-red-500/10' : 'bg-red-50'} border ${theme === 'dark' ? 'border-red-500/20' : 'border-red-200'}`}>
                                    <p className={`text-xs ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
                                        <span className="font-bold">🔴 Красный флаг:</span> если у кошелька винрейт ниже 30% или PnL отрицательный на дистанции — это не смарт, это игрок в казино.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Step 3 */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-1 rounded-lg bg-[#4E6E49] text-white text-xs font-bold">3</span>
                                    <h5 className={`font-bold ${headingColor}`}>Альтернативные способы поиска</h5>
                                </div>
                                <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-white/5' : 'bg-white'} space-y-3`}>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        DexScreener — не единственный источник. Хорошие кошельки можно найти и другими способами:
                                    </p>
                                    <div className="space-y-3">
                                        <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'}`}>
                                            <p className={`text-xs font-bold ${headingColor}`}>1. Через вкладку Trades на любом щитке</p>
                                            <p className={`text-xs ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                Открываете любой токен, смотрите раздел <span className="font-bold">Top Traders</span>, находите тех, кто:
                                            </p>
                                            <ul className={`text-xs ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mt-1 ml-2`}>
                                                <li>• откупал на хорошую сумму (не $10–20, а заметный объём);</li>
                                                <li>• вышел в профит.</li>
                                            </ul>
                                        </div>
                                        <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'}`}>
                                            <p className={`text-xs font-bold ${headingColor}`}>2. На стримах инфлюенсеров</p>
                                            <p className={`text-xs ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                Это один из самых недооценённых способов. Они часто показывают экран, и их кошелёк мелькает. Достаточно поймать адрес один раз — и вы получаете доступ к сделкам человека, который ведёт за собой тысячи подписчиков.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Step 4 */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-1 rounded-lg bg-[#4E6E49] text-white text-xs font-bold">4</span>
                                    <h5 className={`font-bold ${headingColor}`}>Анализ стиля торговли</h5>
                                </div>
                                <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-white/5' : 'bg-white'} space-y-3`}>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        Нашли кошелёк? Не кидайтесь сразу копировать. <span className="text-[#4E6E49] font-bold">Потрекайте его определённый период.</span> Поймите, как этот человек торгует.
                                    </p>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        Инструменты для анализа:
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'}`}>
                                            <p className={`text-xs font-bold ${headingColor}`}>1. Telegram-бот: @ray_purple_bot</p>
                                            <p className={`text-xs ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                Позволяет отслеживать кошельки. Есть небольшая задержка, но это не критично, если смарты берут токены на среднесрок или долгосрок.
                                            </p>
                                        </div>
                                        <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'}`}>
                                            <p className={`text-xs font-bold ${headingColor}`}>2. Торговая площадка (GMGN, DexScreener)</p>
                                            <p className={`text-xs ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                Подпишитесь на нужный кошелёк. Поставьте уведомления (уведы). Отслеживайте график токена: будет видно, где и насколько купил ваш смарт.
                                            </p>
                                        </div>
                                    </div>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        На что обращать внимание:
                                    </p>
                                    <div className="overflow-x-auto">
                                        <table className={`w-full text-xs ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        <thead>
                                            <tr className={`border-b ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}>
                                                <th className={`text-left py-2 font-bold ${headingColor}`}>Параметр</th>
                                                <th className={`text-left py-2 font-bold ${headingColor}`}>Что значит</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className={`border-b ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'}`}>
                                                <td className="py-2">Среднее время удержания</td>
                                                <td className="py-2">Чем выше, тем более «сейвплей» токены выбирает кошелёк. Долгосрочники = меньше стресса</td>
                                            </tr>
                                            <tr className={`border-b ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'}`}>
                                                <td className="py-2">Размер входа</td>
                                                <td className="py-2">Если кошелёк заходит на капы 5–7k, это может быть инфлюенсер, который выходит за счёт своих копиров</td>
                                            </tr>
                                            <tr>
                                                <td className="py-2">Частота сделок</td>
                                                <td className="py-2">Хайперы делают 50+ сделок в день, сейвплей-трейдеры — 5–10</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Step 5 */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-1 rounded-lg bg-[#4E6E49] text-white text-xs font-bold">5</span>
                                    <h5 className={`font-bold ${headingColor}`}>Фильтруем инфлюенсеров-«сливщиков»</h5>
                                </div>
                                <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-white/5' : 'bg-white'} space-y-3`}>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        Это важнейший пункт. Многие инфлюенсеры (и даже некоторые «топ-трейдеры») зарабатывают не на рынке, а на своих подписчиках.
                                    </p>
                                    <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'}`}>
                                        <p className={`text-xs font-bold ${headingColor}`}>Как они работают:</p>
                                        <ul className={`text-xs ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mt-1 space-y-1`}>
                                            <li>1. Заходят в токен на капе 5–7к.</li>
                                            <li>2. Покупают крупный объём.</li>
                                            <li>3. Их копиры (вы) видят сделку и заходят следом.</li>
                                            <li>4. Инфлюенсер выходит в профит, а копиры остаются с мешком.</li>
                                        </ul>
                                    </div>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        Как отфильтровать:
                                    </p>
                                    <ul className={`text-xs space-y-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#4E6E49] mt-1">▸</span>
                                        <span>Проверьте <span className="font-bold">размер входа</span>. Если кошелёк регулярно заходит на совсем маленькие капы (менее 10к), это повод насторожиться.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#4E6E49] mt-1">▸</span>
                                        <span>Посмотрите <span className="font-bold">историю выходов</span>. Если после входа инфлюенсера токен рисует свечу и сразу падает — скорее всего, он вышел.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#4E6E49] mt-1">▸</span>
                                        <span>Сравните <span className="font-bold">время входа и выхода</span>. Если среднее время удержания меньше часа — это не инвестор, это пампила.</span>
                                    </li>
                                </ul>
                                <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-amber-500/10' : 'bg-amber-50'} border ${theme === 'dark' ? 'border-amber-500/20' : 'border-amber-200'}`}>
                                    <p className={`text-xs ${theme === 'dark' ? 'text-amber-400' : 'text-amber-600'}`}>
                                        <span className="font-bold">Золотое правило:</span> не копируйте тех, кто торгует на своей аудитории. Копируйте тех, кто торгует на рынке.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Checklist */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-1 rounded-lg bg-[#4E6E49] text-white text-xs font-bold">✓</span>
                                    <h5 className={`font-bold ${headingColor}`}>Итоговый чек-лист: как найти и проверить кошелёк</h5>
                                </div>
                                <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-white/5' : 'bg-white'} space-y-4`}>
                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 rounded-lg bg-[#4E6E49]/10 text-[#4E6E49] font-bold shrink-0">1</div>
                                            <div>
                                                <p className={`text-sm font-bold ${headingColor}`}>Найти источник:</p>
                                                <ul className={`text-xs ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mt-1`}>
                                                    <li>• DexScreener → Топ трейдеры → 3D</li>
                                                    <li>• Вкладка Trades на любом токене</li>
                                                    <li>• Стримы инфлюенсеров</li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 rounded-lg bg-[#4E6E49]/10 text-[#4E6E49] font-bold shrink-0">2</div>
                                            <div>
                                                <p className={`text-sm font-bold ${headingColor}`}>Проверить через GMGN:</p>
                                                <ul className={`text-xs ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mt-1`}>
                                                    <li>• 30-дневный PnL ≥ 80%</li>
                                                    <li>• Винрейт ≥ 40%</li>
                                                    <li>• Токенов за 30 дней ≤ 300</li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 rounded-lg bg-[#4E6E49]/10 text-[#4E6E49] font-bold shrink-0">3</div>
                                            <div>
                                                <p className={`text-sm font-bold ${headingColor}`}>Проанализировать стиль:</p>
                                                <ul className={`text-xs ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mt-1`}>
                                                    <li>• Среднее время удержания (чем выше, тем лучше)</li>
                                                    <li>• Размер входа (осторожно с капами 5–7к)</li>
                                                    <li>• Нет ли регулярных «памп-дамп» паттернов</li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 rounded-lg bg-[#4E6E49]/10 text-[#4E6E49] font-bold shrink-0">4</div>
                                            <div>
                                                <p className={`text-sm font-bold ${headingColor}`}>Настроить отслеживание:</p>
                                                <ul className={`text-xs ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mt-1`}>
                                                    <li>• Подписаться в @ray_purple_bot</li>
                                                    <li>• Поставить уведомления на GMGN или DexScreener</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Bonus */}
                            <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-gradient-to-r from-[#4E6E49]/20 to-transparent' : 'bg-gradient-to-r from-[#4E6E49]/10 to-transparent'} border border-[#4E6E49]/20`}>
                                <p className={`text-sm font-bold ${headingColor} mb-2`}>Бонус: связка с предыдущими частями</p>
                                <p className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                    Если вы прошли первые два этапа:
                                </p>
                                <ul className={`text-xs space-y-1 mt-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                    <li>✓ Научились оценивать токены по миграциям, лаунчам и деплоерам.</li>
                                    <li>✓ Поняли, как работать с маленьким балансом через лоу-капы.</li>
                                </ul>
                                <p className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mt-3`}>
                                    Теперь вы добавляете третий элемент: <span className="text-[#4E6E49] font-bold">копирование проверенных смартов</span>. Это не отменяет ваш собственный ресерч, но даёт вам:
                                </p>
                                <ul className={`text-xs space-y-1 mt-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                <li>⚡ <span className="font-bold">Скорость</span> — вы заходите вместе с умными деньгами</li>
                                <li>🛡️ <span className="font-bold">Снижение рисков</span> — вы не торгуете вслепую</li>
                                <li>📚 <span className="font-bold">Обучение</span> — наблюдая за стилем смарта, вы прокачиваете свои навыки</li>
                            </ul>
                            </div>
                        </div>
                    )}
                </div>

                {/* Article 5 */}
                <div className={`rounded-3xl border overflow-hidden ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                    <button
                        onClick={() => {
                            const newOpen = new Set(openArticles)
                            if (newOpen.has(5)) {
                                newOpen.delete(5)
                            } else {
                                newOpen.add(5)
                            }
                            setOpenArticles(newOpen)
                        }}
                        className="w-full text-left"
                    >
                        <div className={`p-6 ${theme === 'dark' ? 'bg-gradient-to-r from-[#4E6E49]/10 to-transparent' : 'bg-gradient-to-r from-[#4E6E49]/5 to-transparent'}`}>
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-2xl bg-[#4E6E49]/10 border border-[#4E6E49]/20">
                                        <Search className="w-6 h-6 text-[#4E6E49]" />
                                    </div>
                                    <div>
                                        <h4 className={`text-lg font-black ${headingColor} mb-2`}>Как находить кошельки инфлюенсеров и коллеров</h4>
                                        <p className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            Инструкция по социальной разведке
                                        </p>
                                    </div>
                                </div>
                                <div className={`p-2 rounded-full transition-transform duration-300 ${openArticles.has(5) ? 'rotate-180' : ''}`}>
                                    <ArrowDown className={`w-5 h-5 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} />
                                </div>
                            </div>
                        </div>
                    </button>

                    {openArticles.has(5) && (
                        <div className="p-6 space-y-6 animate-fade-in">
                        {/* Intro */}
                            <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-white/5' : 'bg-white'}`}>
                                <p className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                    В прошлой части мы разобрали, как искать топ-трейдеров через DexScreener и GMGN. Но есть категория кошельков, которые не всегда всплывают в общих рейтингах: <span className="text-[#4E6E49] font-bold">кошельки инфлюенсеров и коллеров</span>.
                                </p>
                                <p className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mt-2`}>
                                    Это те люди, которые:
                                </p>
                                <ul className={`text-xs ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mt-1 space-y-1`}>
                                    <li>• ведут за собой аудиторию;</li>
                                    <li>• получают ранний доступ к проектам;</li>
                                    <li>• часто торгуют на инсайдах.</li>
                                </ul>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mt-2`}>
                                        Найти их сложнее, чем обычных топ-трейдеров. Они прячутся, манипулируют статистикой и сознательно усложняют жизнь копирам. Но это возможно.
                                    </p>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mt-2`}>
                                        Рассказываю, как.
                                    </p>
                                </div>

                                {/* Step 1 */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-1 rounded-lg bg-[#4E6E49] text-white text-xs font-bold">1</span>
                                        <h5 className={`font-bold ${headingColor}`}>Получаем исходные данные</h5>
                                    </div>
                                    <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-white/5' : 'bg-white'} space-y-3`}>
                                        <p className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            Прежде чем искать кошелек, нужно понять, <span className="font-bold">кого именно</span> вы ищете. Инфлюенсеры часто сами дают подсказки — сознательно или случайно.
                                        </p>
                                        <p className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            Что нужно получить:
                                        </p>
                                        <ul className={`text-xs space-y-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            <li>• <span className="font-bold">PNL (прибыль/убыток)</span> — хотя бы примерный</li>
                                            <li>• <span className="font-bold">Процент доходности</span> — многие называют цифры в стримах или постах</li>
                                            <li>• <span className="font-bold">Сумму заработка</span> — часто говорят: «сделал 50к на этой монете»</li>
                                        </ul>
                                        <p className={`text-xs ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            <span className="font-bold">Откуда брать:</span>
                                        </p>
                                        <ul className={`text-xs space-y-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            <li>• Стримы (Роман Олегович, Такси Флип, Леван и др.)</li>
                                            <li>• Посты в Twitter</li>
                                            <li>• Закрытые чаты и альфа-группы</li>
                                            <li>• Скриншоты, которые они случайно публикуют</li>
                                        </ul>
                                        <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-50'} border ${theme === 'dark' ? 'border-blue-500/20' : 'border-blue-200'}`}>
                                            <p className={`text-xs ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}>
                                                <span className="font-bold">Важно:</span> эти данные — ваша точка входа. Дальше вы будете искать кошелек, который соответствует этим параметрам.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Step 2 */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-1 rounded-lg bg-[#4E6E49] text-white text-xs font-bold">2</span>
                                        <h5 className={`font-bold ${headingColor}`}>Метод поиска через DexScreener</h5>
                                    </div>
                                    <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-white/5' : 'bg-white'} space-y-3`}>
                                        <p className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            Когда у вас есть примерные цифры, алгоритм прост:
                                        </p>
                                        <ol className={`text-sm space-y-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'} list-decimal list-inside`}>
                                            <li>Заходим на <span className="font-bold">DexScreener</span> → раздел <span className="font-bold">«Топ трейдеры»</span></li>
                                            <li>Выбираем нужный токен (если знаете, на чем они заработали)</li>
                                            <li>Ищем среди трейдеров те значения, которые вам известны</li>
                                            <li>Если инфлюенсер говорил: <span className="font-bold italic">«Я сделал +240% на этом токене»</span> — ищите в списке трейдеров кошелек с PnL около 240%.</li>
                                        </ol>
                                        <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'}`}>
                                            <p className={`text-xs font-bold ${headingColor}`}>Пример:</p>
                                            <p className={`text-xs ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                Допустим, инфлюенсер сказал, что заработал $12,500 на монете X. Вы идете в топ-трейдеров этой монеты и ищете кошелек с PnL в районе $12,000–13,000.
                                            </p>
                                            <p className={`text-xs ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mt-1`}>
                                                <span className="font-bold">Простая математика:</span> скорее всего, это будет он.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Step 3 */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-1 rounded-lg bg-[#4E6E49] text-white text-xs font-bold">3</span>
                                        <h5 className={`font-bold ${headingColor}`}>Осторожно: манипуляции с PNL</h5>
                                    </div>
                                    <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-white/5' : 'bg-white'} space-y-3`}>
                                        <p className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            И вот здесь начинается самое интересное. Инфлюенсеры <span className="font-bold">не хотят, чтобы их находили</span>. По крайней мере, большинство из них. Поэтому они используют несколько методов защиты.
                                        </p>
                                        <div className="space-y-3">
                                            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'}`}>
                                                <p className={`text-xs font-bold ${headingColor}`}>Метод 1: Изменение PNL через ИИ или код-элемента</p>
                                                <p className={`text-xs ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                    Некоторые инфлюенсеры публикуют скриншоты с измененными цифрами. Это делается через:
                                                </p>
                                                <ul className={`text-xs ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mt-1 space-y-1`}>
                                                    <li>• <span className="font-bold">Инспектор кода</span> (F12 в браузере) — меняют текст прямо на странице перед скрином</li>
                                                    <li>• <span className="font-bold">ИИ-генерацию</span> — создают полностью фейковые скриншоты</li>
                                                </ul>
                                                <p className={`text-xs font-bold ${theme === 'dark' ? 'text-amber-400' : 'text-amber-600'} mt-2`}>
                                                    Что делать: никогда не верьте скринам без видео. Если видите только картинку — это не доказательство.
                                                </p>
                                            </div>
                                            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'}`}>
                                                <p className={`text-xs font-bold ${headingColor}`}>Метод 2: PNL скрыт другими топ-трейдерами</p>
                                                <p className={`text-xs ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                    Особенно часто это встречается в <span className="font-bold">раннерах</span> (новых токенах с низкой капитализацией).
                                                </p>
                                                <ul className={`text-xs ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mt-1 space-y-1`}>
                                                    <li>1. Инфлюенсер заходит в токен.</li>
                                                    <li>2. В топ-трейдерах его кошелек оказывается на 2–3 месте.</li>
                                                    <li>3. Но выше него есть другие крупные трейдеры с огромными цифрами.</li>
                                                    <li>4. Визуально его PNL «теряется» среди больших чисел.</li>
                                                </ul>
                                                <p className={`text-xs font-bold ${theme === 'dark' ? 'text-amber-400' : 'text-amber-600'} mt-2`}>
                                                    Что делать: не смотрите только на первые места. Пролистывайте список. Часто нужный кошелек находится на 4–10 позиции.
                                                </p>
                                            </div>
                                            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'}`}>
                                                <p className={`text-xs font-bold ${headingColor}`}>Метод 3: Называют неточный результат</p>
                                                <p className={`text-xs ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                    Инфлюенсеры редко называют точную цифру. Вместо этого они говорят:
                                                </p>
                                                <ul className={`text-xs ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mt-1 space-y-1`}>
                                                    <li>• <span className="font-bold">«Заработал около 10к»</span> (а на самом деле 12,400)</li>
                                                    <li>• <span className="font-bold italic">«Сделал +200%»</span> (а на самом деле +170% или +230%)</li>
                                                </ul>
                                                <p className={`text-xs font-bold ${theme === 'dark' ? 'text-amber-400' : 'text-amber-600'} mt-2`}>
                                                    Что делать: берите диапазон. Если назвали 10к — ищите от 8к до 12к. Если назвали 200% — ищите от 150% до 250%.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Step 4 */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-1 rounded-lg bg-[#4E6E49] text-white text-xs font-bold">4</span>
                                        <h5 className={`font-bold ${headingColor}`}>Дополнительные способы поиска</h5>
                                    </div>
                                    <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-white/5' : 'bg-white'} space-y-3`}>
                                        <p className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            Если метод через DexScreener не сработал, подключайте альтернативные варианты.
                                        </p>
                                        <div className="space-y-3">
                                            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'}`}>
                                                <p className={`text-xs font-bold ${headingColor}`}>Способ 1: Отслеживание в реальном времени</p>
                                                <ul className={`text-xs ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mt-1 space-y-1`}>
                                                    <li>• Во время стрима смотрите на экран инфлюенсера.</li>
                                                    <li>• Ловите момент, когда он открывает DexScreener или свой кошелек.</li>
                                                    <li>• Адрес может мелькнуть на секунду — будьте готовы.</li>
                                                </ul>
                                            </div>
                                            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'}`}>
                                                <p className={`text-xs font-bold ${headingColor}`}>Способ 2: Анализ взаимосвязей</p>
                                                <p className={`text-xs ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                    Нашли один кошелек инфлюенсера? Посмотрите, с какими другими кошельками он часто взаимодействует. Инфлюенсеры часто используют несколько адресов, и они связаны.
                                                </p>
                                            </div>
                                            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'}`}>
                                                <p className={`text-xs font-bold ${headingColor}`}>Способ 3: Через коллаборации</p>
                                                <p className={`text-xs ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                    Если инфлюенсер часто упоминает другого трейдера — скорее всего, они взаимодействуют. Найдите кошелек одного — второй найдется через общие транзакции.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Step 5 */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-1 rounded-lg bg-[#4E6E49] text-white text-xs font-bold">5</span>
                                        <h5 className={`font-bold ${headingColor}`}>Чек-лист: как проверить, что нашли именно того</h5>
                                    </div>
                                    <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-white/5' : 'bg-white'} space-y-3`}>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-xs text-left border-collapse">
                                                <thead>
                                                    <tr className={theme === 'dark' ? 'border-b border-white/10' : 'border-b border-gray-200'}>
                                                        <th className="py-2 font-bold">Признак</th>
                                                        <th className="py-2 font-bold">Что должно совпадать</th>
                                                    </tr>
                                                </thead>
                                                <tbody className={theme === 'dark' ? 'text-white/80' : 'text-gray-700'}>
                                                    <tr className={theme === 'dark' ? 'border-b border-white/5' : 'border-b border-gray-100'}>
                                                        <td className="py-2 font-bold">Время входа</td>
                                                        <td className="py-2">Должно совпадать с тем, когда инфлюенсер говорил о покупке</td>
                                                    </tr>
                                                    <tr className={theme === 'dark' ? 'border-b border-white/5' : 'border-b border-gray-100'}>
                                                        <td className="py-2 font-bold">Размер входа</td>
                                                        <td className="py-2">Должен соответствовать стилю торговли (если он всегда заходит на $1к — не верьте, что нашли его сделку на $50)</td>
                                                    </tr>
                                                    <tr className={theme === 'dark' ? 'border-b border-white/5' : 'border-b border-gray-100'}>
                                                        <td className="py-2 font-bold">История</td>
                                                        <td className="py-2">Кошелек должен быть активен не только на этом токене</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="py-2 font-bold">Взаимодействия</td>
                                                        <td className="py-2">Если инфлюенсер часто торгует с кем-то известным — проверьте, есть ли общие транзакции</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                                {/* Common Errors */}
                                <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-red-500/10' : 'bg-red-50'} border ${theme === 'dark' ? 'border-red-500/20' : 'border-red-200'}`}>
                                    <p className={`text-sm font-bold ${theme === 'dark' ? 'text-red-400' : 'text-red-600'} mb-2`}>Главные ошибки при поиске</p>
                                    <ul className={`text-xs space-y-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        <li>• <span className="font-bold">Верить скринам.</span> Без видео или прямого эфира любые цифры можно подделать.</li>
                                        <li>• <span className="font-bold">Смотреть только топ-1.</span> Нужный кошелек часто скрыт среди других трейдеров.</li>
                                        <li>• <span className="font-bold">Искать точную цифру.</span> Инфлюенсеры почти всегда округляют или занижают/завышают результат.</li>
                                        <li>• <span className="font-bold">Не проверять историю.</span> Одна удачная сделка не делает кошелек смартом.</li>
                                    </ul>
                                </div>

                                {/* Conclusion */}
                                <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-gradient-to-r from-[#4E6E49]/20 to-transparent' : 'bg-gradient-to-r from-[#4E6E49]/10 to-transparent'} border border-[#4E6E49]/20`}>
                                    <p className={`text-sm font-bold ${headingColor} mb-2`}>Итог: как построить систему поиска</p>
                                    <ul className={`text-xs space-y-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        <li className="flex items-start gap-2">
                                            <span className="text-[#4E6E49] mt-1">▸</span>
                                            <span><span className="font-bold">Собирайте данные</span> — PNL, проценты, суммы из стримов и постов</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-[#4E6E49] mt-1">▸</span>
                                            <span><span className="font-bold">Используйте DexScreener</span> — ищите совпадения в топ-трейдерах по конкретным токенам</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-[#4E6E49] mt-1">▸</span>
                                            <span><span className="font-bold">Берите диапазон</span> — никогда не ищите точное совпадение</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-[#4E6E49] mt-1">▸</span>
                                            <span><span className="font-bold">Проверяйте манипуляции</span> — учитывайте, что PNL может быть изменен или скрыт</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-[#4E6E49] mt-1">▸</span>
                                            <span><span className="font-bold">Анализируйте взаимосвязи</span> — один найденный кошелек ведет к другим</span>
                                        </li>
                                    </ul>
                                    <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-amber-500/10' : 'bg-amber-50'} border ${theme === 'dark' ? 'border-amber-500/20' : 'border-amber-200'} mt-4`}>
                                        <p className={`text-xs ${theme === 'dark' ? 'text-amber-400' : 'text-amber-600'}`}>
                                            <span className="font-bold">Золотое правило:</span> если кошелек слишком легко находится — возможно, это не тот, кто вам нужен. Настоящие смарты и крупные инфлюенсеры умеют прятаться.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

            {/* 6. FASOL Setups Section */}
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#4E6E49]/10 rounded-xl border border-[#4E6E49]/20">
                            <Bell className="w-6 h-6 text-[#4E6E49]" />
                        </div>
                        <div>
                            <h3 className={`text-xl font-black ${headingColor}`}>Сетапы FASOL</h3>
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                Авторские алерты для торговли
                            </p>
                        </div>
                    </div>
                </div>

                <div className={`p-6 rounded-3xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                    {/* Info & Warning */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="flex-1 p-4 rounded-2xl bg-[#4E6E49]/10 border border-[#4E6E49]/30">
                            <div className="flex items-start gap-3">
                                <Info className="w-5 h-5 text-[#4E6E49] shrink-0 mt-0.5" />
                                <p className="text-sm text-[#4E6E49]">
                                    Обновляются <span className="font-bold">раз в 30 дней</span>. Доступны всем участникам команды
                                </p>
                            </div>
                        </div>
                        <div className="flex-1 p-4 rounded-2xl bg-[#4E6E49]/10 border border-[#4E6E49]/30">
                            <div className="flex items-start gap-3">
                                <ShieldAlert className="w-5 h-5 text-[#4E6E49] shrink-0 mt-0.5" />
                                <p className="text-sm text-[#4E6E49]">
                                    <span className="font-bold">Важно:</span> сверяйте уровни. <span className="font-bold">Алерт ≠ покупка</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Setup Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            {
                                name: 'Volume Alerts',
                                desc: 'Алерты по аномальным объемам',
                                url: 'https://t.me/fasolbot?start=alert_f3mR8tJGsOMzNJlX_bnmIAO44OH-7MSG',
                                icon: <Activity className="w-6 h-6" />
                            },
                            {
                                name: 'DEV Alerts',
                                desc: 'Мониторинг кошельков разработчиков',
                                url: 'https://t.me/fasolbot?start=alert_GP4yXkhlvsGYZJbRDwAAMaOOylgk6Hco',
                                icon: <Users className="w-6 h-6" />
                            },
                            {
                                name: 'Safe Alerts',
                                desc: 'Консервативные сигналы для новичков',
                                url: 'https://t.me/fasolbot?start=alert_7GxxPMIjsypLlF0l3LquUHhvY7YVA2Vl',
                                icon: <ShieldCheck className="w-6 h-6" />
                            },
                            {
                                name: 'DIP Alerts',
                                desc: 'Покупка на откатах',
                                url: 'https://t.me/fasolbot?start=alert_F6jQ-R43txuQHSGF_GKdzsezFgB3VEdc',
                                icon: <ArrowDownToLine className="w-6 h-6" />
                            },
                        ].map((setup, idx) => (
                            <a
                                key={idx}
                                href={setup.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`group p-5 rounded-2xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer
                                    ${theme === 'dark' 
                                        ? 'bg-[#151a21]/50 border-white/5 hover:border-[#4E6E49]/30 hover:bg-[#4E6E49]/5' 
                                        : 'bg-white border-gray-200 hover:border-[#4E6E49]/30 hover:bg-[#4E6E49]/5'
                                    }`}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="p-3 rounded-xl bg-[#4E6E49]/10 border border-[#4E6E49]/20">
                                        {React.cloneElement(setup.icon as React.ReactElement, { className: 'w-6 h-6 text-[#4E6E49]' })}
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-[#4E6E49]" />
                                </div>
                                <h4 className={`font-bold text-base mb-1 ${headingColor}`}>{setup.name}</h4>
                                <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {setup.desc}
                                </p>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

        </div>
    )
}
