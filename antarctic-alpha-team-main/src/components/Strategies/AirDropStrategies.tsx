import React, { useState } from 'react'
import { useThemeStore } from '@/store/themeStore'
import {
    Wrench,
    BarChart3,
    TrendingUp,
    ArrowLeft,
    ArrowRight,
    Gift,
    MessageCircle,
    Users,
    ExternalLink
} from 'lucide-react'
import { CategoryDropdownSelector } from './CategoryDropdownSelector'

interface Tool {
    name: string
    url: string
    fullDesc: string
    icon: React.ReactNode
    color: string
    bgColor: string
    tags: string[]
}

export const AirDropStrategies: React.FC = () => {
    const { theme } = useThemeStore()
    const [activeToolCategory, setActiveToolCategory] = useState<number | null>(null)

    const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
    const mutedText = theme === 'dark' ? 'text-gray-400' : 'text-gray-500'

    const tools: Tool[] = [
        {
            name: 'Airdrops.io',
            url: 'https://airdrops.io',
            fullDesc: 'Агрегатор активных и потенциальных airdrop’ов с базовой фильтрацией по блокчейнам и кратким описанием условий участия.',
            icon: <Gift className="w-5 h-5" />,
            color: 'text-[#4E6E49]',
            bgColor: 'bg-[#4E6E49]/10 border-[#4E6E49]/20',
            tags: ['Aggregator']
        },
        {
            name: 'CoinMarketCap Airdrops',
            url: 'https://coinmarketcap.com/airdrop',
            fullDesc: 'Официальный раздел CoinMarketCap с маркетинговыми и партнёрскими airdrop’ами, ориентированными на массового пользователя.',
            icon: <TrendingUp className="w-5 h-5" />,
            color: 'text-[#4E6E49]',
            bgColor: 'bg-[#4E6E49]/10 border-[#4E6E49]/20',
            tags: ['Aggregator']
        },
        {
            name: 'AirdropAlert',
            url: 'https://airdropalert.com',
            fullDesc: 'Агрегатор крипто-airdrop’ов с каталогом активных, потенциальных и завершённых раздач, категориями проектов и пошаговыми инструкциями.',
            icon: <Gift className="w-5 h-5" />,
            color: 'text-[#4E6E49]',
            bgColor: 'bg-[#4E6E49]/10 border-[#4E6E49]/20',
            tags: ['Aggregator']
        },
        {
            name: 'Drops Bot',
            url: 'https://drops.bot',
            fullDesc: 'Сервис для отслеживания криптовалютных айрдропов, который позволяет проверять публичные адреса кошельков на предмет доступных, пропущенных и потенциальных будущих наград.',
            icon: <Gift className="w-5 h-5" />,
            color: 'text-purple-400',
            bgColor: 'bg-purple-500/10 border-purple-500/20',
            tags: ['Aggregator']
        },
        {
            name: 'Coindar',
            url: 'https://coindar.org',
            fullDesc: 'Календарь событий: листинги, аирдропы и мероприятия как триггеры нарративов.',
            icon: <BarChart3 className="w-5 h-5" />,
            color: 'text-emerald-400',
            bgColor: 'bg-emerald-500/10 border-emerald-500/20',
            tags: ['Calendar']
        },
        {
            name: 'Reddit',
            url: 'https://www.reddit.com',
            fullDesc: 'Форумная платформа, где обсуждаются новые протоколы, testnet\'ы и потенциальные airdrop-активности.',
            icon: <Users className="w-5 h-5" />,
            color: 'text-orange-400',
            bgColor: 'bg-orange-500/10 border-orange-500/20',
            tags: ['Community']
        },
        {
            name: 'Discord',
            url: 'https://discord.com',
            fullDesc: 'Основной коммуникационный канал криптопроектов, где публикуются testnet-активности, роли за участие и ранние пользовательские задания.',
            icon: <MessageCircle className="w-5 h-5" />,
            color: 'text-indigo-400',
            bgColor: 'bg-indigo-500/10 border-indigo-500/20',
            tags: ['Community']
        }
    ]

    return (
        <div className="space-y-16 pb-20">
            {/* Tools Block */}
            <section className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#4E6E49]/10 rounded-xl border border-[#4E6E49]/20">
                            <Wrench className="w-6 h-6 text-[#4E6E49]" />
                        </div>
                        <div>
                            <h3 className={`text-xl font-black ${headingColor}`}>Инструменты AirDrop</h3>
                            <p className={`text-sm ${mutedText}`}>
                                Агрегаторы, календари и платформы для поиска раздач
                            </p>
                        </div>
                    </div>

                    <CategoryDropdownSelector
                        categories={[
                            { id: 0, name: 'Агрегаторы и Календари', icon: <Gift className="w-4 h-4" /> },
                            { id: 1, name: 'Комьюнити', icon: <Users className="w-4 h-4" /> },
                        ]}
                        activeCategory={activeToolCategory}
                        setActiveCategory={setActiveToolCategory}
                        placeholder="Выберите категорию"
                    />
                </div>

                <div className="space-y-12">
                    {activeToolCategory === null ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                {
                                    id: 0,
                                    title: 'Агрегаторы и Календари',
                                    description: 'Поиск активных раздач и событий',
                                    icon: <Gift className="w-8 h-8" />,
                                },
                                {
                                    id: 1,
                                    title: 'Комьюнити',
                                    description: 'Обсуждения и инсайды',
                                    icon: <Users className="w-8 h-8" />,
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
                                    title: 'Агрегаторы и Календари',
                                    items: tools.filter(t => t.tags.includes('Aggregator') || t.tags.includes('Calendar'))
                                },
                                {
                                    title: 'Комьюнити',
                                    items: tools.filter(t => t.tags.includes('Community'))
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
                                                className={`group relative p-5 rounded-2xl border transition-all duration-300 hover:shadow-lg ${theme === 'dark'
                                                    ? 'bg-[#151a21]/50 border-white/5 hover:border-[#4E6E49]/30'
                                                    : 'bg-white border-gray-100 hover:border-[#4E6E49]/20'
                                                    }`}
                                            >
                                                <div className={`p-2.5 rounded-xl w-fit mb-4 ${tool.bgColor} group-hover:scale-110 transition-transform`}>
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
