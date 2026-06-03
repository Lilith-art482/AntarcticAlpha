import React, { useState } from 'react'
import { useThemeStore } from '@/store/themeStore'
import {
    Lightbulb,
    Target,
    Calculator,
    Wrench,
    BarChart3,
    Brain,
    TrendingUp,
    Wallet,
    Zap,
    ArrowLeft,
    ArrowRight,
    ExternalLink
} from 'lucide-react'
import { AVAValueBettingStrategy } from './AVAValueBettingStrategy'
import { AVAArbitrageStrategy } from './AVAArbitrageStrategy'
import { StrategyDropdownSelector } from './StrategyDropdownSelector' // Импорт нового компонента
import { CategoryDropdownSelector } from './CategoryDropdownSelector'

type StrategyId = 'value-betting' | 'arbitrage' | null;

interface Tool {
    name: string
    url: string
    fullDesc: string
    icon: React.ReactNode
    color: string
    bgColor: string
    tags: string[]
}

export const PolymarketStrategies: React.FC = () => {
    const { theme } = useThemeStore()
    const [activeStrategy, setActiveStrategy] = useState<StrategyId>(null)
    const [activeToolCategory, setActiveToolCategory] = useState<number | null>(null)

    const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
    const innerBg = theme === 'dark' ? 'bg-[#151a21]/50' : 'bg-gray-50/50'
    const mutedText = theme === 'dark' ? 'text-gray-400' : 'text-gray-500'

    const strategies = [
        { id: 'value-betting', name: 'ARCA Value Betting', icon: <Target className="w-4 h-4" /> },
        { id: 'arbitrage', name: 'ARCA Арбитраж', icon: <Calculator className="w-4 h-4" /> },
    ]

    const tools: Tool[] = [
        {
            name: 'Polymarket',
            url: 'https://polymarket.com/',
            fullDesc: 'Децентрализованная платформа на блокчейне Polygon, на которой можно торговать вероятностями событий, покупая токены результата — YES или NO. Цена токена отражает рыночную вероятность события.',
            icon: <Target className="w-5 h-5" />,
            color: 'text-[#4E6E49]',
            bgColor: 'bg-[#4E6E49]/10 border-[#4E6E49]/20',
            tags: ['Core', 'Trading']
        },
        {
            name: 'HashDive',
            url: 'https://hashdive.com',
            fullDesc: 'Аналитическая платформа для Polymarket и Kalshi. Отслеживайте Smart Scores трейдеров (–100 до +100) на основе их перфоманса. Мониторинг активности китов, крупных сделок, рыночных трендов, ликвидности и волатильности. Анализ позиций и PnL по кошелькам.',
            icon: <BarChart3 className="w-5 h-5" />,
            color: 'text-[#4E6E49]',
            bgColor: 'bg-[#4E6E49]/10 border-[#4E6E49]/20',
            tags: ['Analytics', 'Whales', 'Scores']
        },
        {
            name: 'Polysights',
            url: 'https://intel.polysights.xyz',
            fullDesc: 'Предоставляет чистые информационные панели с искусственным интеллектом, анализ рынка и настройки arb.',
            icon: <Brain className="w-5 h-5" />,
            color: 'text-purple-400',
            bgColor: 'bg-purple-500/10 border-purple-500/20',
            tags: ['Analytics', 'AI', 'Arb']
        },
        {
            name: 'Munar AI',
            url: 'https://app.munar.ai',
            fullDesc: 'AI крипто-помощник (crypto copilot) для трейдеров. Помогает анализировать рынки, отвечает на вопросы о событиях и стратегиях, генерирует аналитические отчёты и торговые рекомендации.',
            icon: <Zap className="w-5 h-5" />,
            color: 'text-cyan-400',
            bgColor: 'bg-cyan-500/10 border-cyan-500/20',
            tags: ['AI', 'Assistant']
        },
        {
            name: 'Polymarket Analytics',
            url: 'https://polymarketanalytics.com',
            fullDesc: 'Глобальная платформа данных и аналитики для Polymarket. Live цены всех активных маркетов с обновлением каждые 5 минут. Top Traders с фильтрацией по категориям (Politics, Crypto, Sports). Unified Search — поиск маркетов на Polymarket и Kalshi в одном месте. Real-time Activity для отслеживания позиций топ-трейдеров. Portfolio Builder для управления несколькими кошельками и сводной PnL.',
            icon: <TrendingUp className="w-5 h-5" />,
            color: 'text-emerald-400',
            bgColor: 'bg-emerald-500/10 border-emerald-500/20',
            tags: ['Data', 'Live', 'Portfolio']
        },
        {
            name: 'PredictFolio',
            url: 'https://predictfolio.com',
            fullDesc: 'Портфолио и трейдер-аналитика для Polymarket. Portfolio Tracker для отслеживания позиций, PnL и odds в реальном времени. Trader Analytics для анализа стратегий других трейдеров. Benchmarking для сравнения win rate, volume и PnL с топ-кошельками. Follow Winners для копирования лучших сделок. Advanced Search по хендлу, маркету или метрикам.',
            icon: <Wallet className="w-5 h-5" />,
            color: 'text-indigo-400',
            bgColor: 'bg-indigo-500/10 border-indigo-500/20',
            tags: ['Portfolio', 'Analytics', 'Copy Trading']
        },
    ]

    return (
        <div className="space-y-16 pb-20">
            {/* Strategies Block */}
            <section className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#4E6E49]/10 rounded-xl border border-[#4E6E49]/20">
                            <Lightbulb className="w-6 h-6 text-[#4E6E49]" />
                        </div>
                        <div>
                            <h3 className={`text-xl font-black ${headingColor}`}>Стратегии</h3>
                            <p className={`text-sm ${mutedText}`}>
                                Проверенные методики работы с прогнозными рынками
                            </p>
                        </div>
                    </div>

                    {/* Strategy Selector - Visible when strategy is already selected */}
                    {activeStrategy !== undefined && (
                        <StrategyDropdownSelector
                            strategies={strategies}
                            activeStrategy={activeStrategy}
                            setActiveStrategy={setActiveStrategy as (id: string | null) => void}
                            placeholder="Выберите стратегию Polymarket"
                        />
                    )}
                </div>

                {!activeStrategy ? (
                    /* Selection Grid - New Design */
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            {
                                id: 'value-betting',
                                name: 'ARCA Value Betting',
                                description: 'Поиск математического ожидания и недооцененных исходов на рынках предсказаний.',
                                icon: <Target className="w-8 h-8" />,
                            },
                            {
                                id: 'arbitrage',
                                name: 'ARCA Арбитраж',
                                description: 'Заработок на разнице цен между Polymarket и другими платформами или реальностью.',
                                icon: <Calculator className="w-8 h-8" />,
                            },
                        ].map((s) => (
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
                        ))}
                    </div>
                ) : (
                    /* Active Strategy View */
                    <div className={`rounded-3xl border p-1 sm:p-2 ${theme === 'dark' ? 'bg-[#0b1015]/50 border-white/5' : 'bg-white border-gray-100'
                        } shadow-xl animate-scale-up`}>
                        <div className={`p-6 sm:p-8 rounded-[2.5rem] ${innerBg}`}>
                            <div className="mb-6 flex items-center justify-between">
                                <button
                                    onClick={() => setActiveStrategy(null)}
                                    className="text-xs font-bold text-gray-500 hover:text-[#4E6E49] transition-colors flex items-center gap-1"
                                >
                                    ← К списку стратегий
                                </button>
                            </div>
                            {activeStrategy === 'value-betting' ? (
                                <AVAValueBettingStrategy />
                            ) : (
                                <AVAArbitrageStrategy />
                            )}
                        </div>
                    </div>
                )}
            </section>

            {/* Tools Block */}
            <section className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#4E6E49]/10 rounded-xl border border-[#4E6E49]/20">
                            <Wrench className="w-6 h-6 text-[#4E6E49]" />
                        </div>
                        <div>
                            <h3 className={`text-xl font-black ${headingColor}`}>Инструменты</h3>
                            <p className={`text-sm ${mutedText}`}>
                                Вспомогательные сервисы и аналитика для прогнозных рынков
                            </p>
                        </div>
                    </div>

                    {activeToolCategory !== undefined && (
                        <CategoryDropdownSelector
                            categories={[
                                { id: 0, name: 'Аналитика и Данные', icon: <BarChart3 className="w-4 h-4" /> },
                                { id: 1, name: 'AI и Смарт-Инсайты', icon: <Brain className="w-4 h-4" /> },
                                { id: 2, name: 'Портфолио и Трекинг', icon: <Wallet className="w-4 h-4" /> },
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
                                    title: 'Аналитика и Данные',
                                    description: 'Отслеживание рынков, объёмов и активности китов',
                                    icon: <BarChart3 className="w-8 h-8" />,
                                },
                                {
                                    id: 1,
                                    title: 'AI и Смарт-Инсайты',
                                    description: 'Интеллектуальные помощники и предсказательные модели',
                                    icon: <Brain className="w-8 h-8" />,
                                },
                                {
                                    id: 2,
                                    title: 'Портфолио и Трекинг',
                                    description: 'Управление позициями и мониторинг перфоманса',
                                    icon: <Wallet className="w-8 h-8" />,
                                }
                            ].map((cat) => (
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
                            ))}
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
                                    title: 'Аналитика и Данные',
                                    items: tools.filter(t => t.tags.includes('Analytics') || t.tags.includes('Live'))
                                },
                                {
                                    title: 'AI и Смарт-Инсайты',
                                    items: tools.filter(t => t.tags.includes('AI') || t.tags.includes('Scores'))
                                },
                                {
                                    title: 'Портфолио и Трекинг',
                                    items: tools.filter(t => t.tags.includes('Portfolio'))
                                }
                            ].filter((_c, i) => i === activeToolCategory).map((category, catIdx) => (
                                <div key={catIdx} className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-3 rounded-2xl ${theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-gray-100 border border-gray-200'}`}>
                                            <Wrench className="w-6 h-6 text-[#4E6E49]" />
                                        </div>
                                        <h4 className={`text-xl font-bold ${headingColor}`}>{category.title}</h4>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                        {category.items.map((tool, idx) => (
                                            <a
                                                key={idx}
                                                href={tool.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group relative p-5 rounded-2xl transition-all duration-300 strategy-card strategy-card-compact"
                                            >
                                                <div className={`p-2.5 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform strategy-card-icon ${tool.bgColor}`}>
                                                    <div className={tool.color}>
                                                        {tool.icon}
                                                    </div>
                                                </div>

                                                <h4 className={`font-bold mb-1 ${headingColor} flex items-center gap-2`}>
                                                    {tool.name}
                                                </h4>
                                                <p className="text-xs text-gray-500 leading-relaxed">
                                                    {tool.fullDesc}
                                                </p>
                                                <ExternalLink className="w-3.5 h-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity absolute top-4 right-4" />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

        </div>
    )
}
