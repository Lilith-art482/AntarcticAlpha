import React, { useState } from 'react'
import { useThemeStore } from '@/store/themeStore'
import {
    BarChart3,
    Search,
    LayoutList,
    TrendingUp,
    ChevronDown,
    ChevronUp,
    Info,
    Calculator,
    AlertCircle,
    Bell,
    Layers,
    Percent,
    ArrowUpRight,
    ArrowDownRight,
    Sparkles
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

export const FasolAlertStrategy: React.FC = () => {
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
                        <Bell className={`w-12 h-12 ${theme === 'dark' ? 'text-[#4E6E49]' : 'text-[#4E6E49]'}`} />
                    </div>
                    <div className="flex-1 space-y-4">
                        <h2 className={`text-2xl md:text-3xl font-black ${headingColor}`}>Fasol Alert Strategy</h2>
                        <p className={`text-lg leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            Математический подход к торговле мемкоинами с использованием двух параллельных стратегий. Основа — высокий винрейт и отказ от "тугих" стоп-лоссов для пережидания волатильности перед крупным ростом.
                        </p>
                        <div className={`flex flex-wrap gap-4 pt-2`}>
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${theme === 'dark' ? 'bg-white/5 text-gray-400 border border-white/10' : 'bg-gray-100 text-gray-600 border border-gray-200'
                                }`}>
                                <Layers className="w-3.5 h-3.5" />
                                DUAL STRATEGY
                            </div>
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${theme === 'dark' ? 'bg-white/5 text-gray-400 border border-white/10' : 'bg-gray-100 text-gray-600 border border-gray-200'
                                }`}>
                                <Search className="w-3.5 h-3.5" />
                                15-16 СИГНАЛОВ/ДЕНЬ
                            </div>
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${theme === 'dark' ? 'bg-white/10 text-[#4E6E49] border border-[#4E6E49]/20' : 'bg-[#4E6E49]/5 text-[#4E6E49] border border-[#4E6E49]/20'
                                }`}>
                                <Info className="w-3.5 h-3.5" />
                                71-77% WINRATE
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Steps */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                        <LayoutList className={`w-6 h-6 ${theme === 'dark' ? 'text-[#4E6E49]' : 'text-[#4E6E49]'}`} />
                        <h3 className={`text-xl font-black ${headingColor}`}>Алгоритм работы</h3>
                    </div>

                    <StrategyStep
                        number={1}
                        title="Стратегия А: Охотник за отскоком (Bounce Hunter)"
                        icon={<TrendingUp className="w-5 h-5" />}
                        isOpen={openStep === 1}
                        onToggle={() => toggleStep(1)}
                    >
                        <p>Поиск монет, которые уже показали сильный исторический максимум (ATH), но откатились на 25% и сейчас начинают отскок на возобновленных объемах.</p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                            <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Возраст токена</p>
                                <p className={`text-lg font-black ${headingColor}`}>≥ 6 часов</p>
                            </div>
                            <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Холдеры</p>
                                <p className={`text-lg font-black ${headingColor}`}>≥ 20</p>
                            </div>
                            <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Сигналов в день</p>
                                <p className={`text-lg font-black text-[#4E6E49]`}>8-9</p>
                            </div>
                            <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Винрейт x1.5</p>
                                <p className={`text-lg font-black text-emerald-500`}>71%</p>
                            </div>
                        </div>

                        <div className={`mt-4 p-4 rounded-xl border-l-4 ${theme === 'dark' ? 'bg-[#4E6E49]/5 border-[#4E6E49]/50' : 'bg-[#4E6E49]/5 border-[#4E6E49]/30'}`}>
                            <p className="text-sm italic">
                                <strong>Условие входа:</strong> Токен показал ATH, откатился на ~25%, начался отскок с объёмом. Это признак того, что крупные игроки накапливают позицию после выбивания розничных трейдеров стопами.
                            </p>
                        </div>
                    </StrategyStep>

                    <StrategyStep
                        number={2}
                        title="Стратегия Б: Качественный старт (Lifecycle Quality Setup)"
                        icon={<Sparkles className="w-5 h-5" />}
                        isOpen={openStep === 2}
                        onToggle={() => toggleStep(2)}
                    >
                        <p>Ловля токенов на самых ранних этапах (сразу после миграции), но с жёсткой фильтрацией качества разработчиков и распределения держателей.</p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                            <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Возраст токена</p>
                                <p className={`text-lg font-black ${headingColor}`}>&lt; 25 минут</p>
                            </div>
                            <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Опыт разработчиков</p>
                                <p className={`text-lg font-black ${headingColor}`}>2+ запусков, 2+ миграций</p>
                            </div>
                            <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Сигналов в день</p>
                                <p className={`text-lg font-black text-[#4E6E49]`}>~7</p>
                            </div>
                            <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Винрейт x1.5</p>
                                <p className={`text-lg font-black text-emerald-500`}>77%</p>
                            </div>
                        </div>

                        <div className={`mt-4 p-4 rounded-xl border-l-4 ${theme === 'dark' ? 'bg-[#4E6E49]/5 border-[#4E6E49]/50' : 'bg-[#4E6E49]/5 border-[#4E6E49]/30'}`}>
                            <p className="text-sm italic">
                                <strong>Фильтр разработчиков:</strong> Проверяем историю dev-кошелька через Bubblemaps. Опытные разработчики с 2+ успешными запусками значительно повышают вероятность успеха.
                            </p>
                        </div>
                    </StrategyStep>

                    <StrategyStep
                        number={3}
                        title="Математика: Тейк-Профит и Стоп-Лосс"
                        icon={<Calculator className="w-5 h-5" />}
                        isOpen={openStep === 3}
                        onToggle={() => toggleStep(3)}
                    >
                        <div className="space-y-6">
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <ArrowDownRight className="w-4 h-4 text-rose-500" />
                                    <h4 className="font-bold">Стоп-Лосс</h4>
                                </div>
                                <ul className="space-y-2 list-disc list-inside text-sm pl-2">
                                    <li><strong>Рекомендация:</strong> <span className="text-rose-400 font-bold">НЕ ИСПОЛЬЗОВАТЬ стоп-лосс</span></li>
                                    <li>Максимум: Аварийный стоп на уровне <strong>-70%</strong></li>
                                    <li>Даже монеты, которые в итоге делают x5, по пути часто падают на -30%</li>
                                    <li>При стопе на -20% или -30% вы вылетите из сделки до начала роста</li>
                                    <li>Математически выгоднее принять убыток в -60%...-80% по проигрышным сделкам</li>
                                </ul>
                            </div>

                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                                    <h4 className="font-bold">Тейк-Профит</h4>
                                </div>
                                <ul className="space-y-2 list-disc list-inside text-sm pl-2">
                                    <li><strong>Оптимальная цель:</strong> <span className="text-emerald-400 font-bold">+50% (1.5x)</span></li>
                                    <li>Прибыль +25% слишком мала для покрытия убытков</li>
                                    <li>Цель +100% (2x) даёт падение винрейта с ~74% до ~47%</li>
                                    <li>+50% — "золотая середина" между доходностью и реализуемостью</li>
                                </ul>
                            </div>
                        </div>
                    </StrategyStep>

                    <StrategyStep
                        number={4}
                        title="Альтернативная тактика продажи"
                        icon={<Percent className="w-5 h-5" />}
                        isOpen={openStep === 4}
                        onToggle={() => toggleStep(4)}
                    >
                        <p>Чтобы не пропускать "ракеты" (x5, x10), можно использовать частичную фиксацию:</p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                            <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-emerald-50 border-emerald-500/20'}`}>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 mb-1">Шаг 1</p>
                                <p className={`text-lg font-black ${headingColor}`}>Продать 50% при +50%</p>
                                <p className="text-sm text-gray-500 mt-1">Фиксируем прибыль и возвращаем инвестицию</p>
                            </div>
                            <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-purple-500/5 border-purple-500/20' : 'bg-purple-50 border-purple-500/20'}`}>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-purple-500 mb-1">Шаг 2</p>
                                <p className={`text-lg font-black ${headingColor}`}>Трейлинг-стоп -35%</p>
                                <p className="text-sm text-gray-500 mt-1">Для оставшихся 50% — ловля x5-x10</p>
                            </div>
                        </div>
                    </StrategyStep>
                </div>

                {/* Sidebar: Rules & Statistics */}
                <div className="space-y-6">
                    {/* Expected Results */}
                    <div className={`rounded-2xl p-6 border ${theme === 'dark' ? 'bg-[#151a21]/80 border-white/5' : 'bg-white border-gray-100'
                        } shadow-lg space-y-4`}>
                        <div className="flex items-center gap-3">
                            <BarChart3 className={`w-6 h-6 text-[#4E6E49]`} />
                            <h3 className={`text-lg font-black ${headingColor}`}>Ожидаемая доходность</h3>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Сигналы в день</p>
                                <div className={`space-y-2 p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                    <div className="flex justify-between text-sm">
                                        <span>Стратегия А</span>
                                        <span className="font-bold text-[#4E6E49]">8-9</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Стратегия Б</span>
                                        <span className="font-bold text-[#4E6E49]">~7</span>
                                    </div>
                                    <div className="mt-2 pt-2 border-t border-white/5 flex justify-between font-bold">
                                        <span>Итого</span>
                                        <span className="text-[#4E6E49]">15-16/день</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Винрейт по целям</p>
                                <div className={`space-y-2 p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                    <div className="flex justify-between text-sm">
                                        <span>x1.5 (+50%)</span>
                                        <span className="font-bold text-emerald-500">71-77%</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>x2 (+100%)</span>
                                        <span className="font-bold text-amber-500">45-49%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Key Rules */}
                    <div className={`rounded-2xl p-6 border ${theme === 'dark' ? 'bg-[#4E6E49]/5 border-[#4E6E49]/20' : 'bg-[#4E6E49]/5 border-[#4E6E49]/20'
                        } shadow-lg space-y-4`}>
                        <div className="flex items-center gap-3">
                            <AlertCircle className={`w-6 h-6 text-[#4E6E49]`} />
                            <h3 className={`text-lg font-black ${headingColor}`}>Ключевые правила</h3>
                        </div>
                        <div className={`space-y-1.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                            <p className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#4E6E49]/50"></span>
                                Запустить обе стратегии одновременно
                            </p>
                            <p className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#4E6E49]/50"></span>
                                Вход по сигналу
                            </p>
                            <p className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500/50"></span>
                                Стоп-лосс: отключен или -50% макс
                            </p>
                            <p className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50"></span>
                                TP: автоматически при +50%
                            </p>
                            <p className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-500/50"></span>
                                Размер позиции: 1 SOL на сделку
                            </p>
                        </div>
                    </div>

                    {/* Disclaimer */}
                    <div className={`rounded-2xl p-6 border ${theme === 'dark' ? 'bg-amber-500/5 border-amber-500/20' : 'bg-amber-50 border-amber-500/20'
                        } shadow-lg space-y-3`}>
                        <div className="flex items-center gap-3">
                            <Info className={`w-6 h-6 text-amber-500`} />
                            <h3 className={`text-lg font-black ${headingColor}`}>Важно</h3>
                        </div>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            Высокий винрейт (71-77%) перекроет убытки от проигрышных сделок. Математическое ожидание положительное при строгом следовании стратегии.
                        </p>
                    </div>
                </div>
            </div>

            {/* Final Logic Footer */}
            <div className={`rounded-2xl p-6 border-l-8 ${theme === 'dark' ? 'bg-[#0b1015] border-[#4E6E49]/50' : 'bg-gray-50 border-[#4E6E49]/30'
                }`}>
                <div className="flex gap-4 items-start">
                    <AlertCircle className="w-8 h-8 text-[#4E6E49] shrink-0" />
                    <div className="space-y-2">
                        <h4 className={`text-lg font-black ${headingColor}`}>Резюме для работы</h4>
                        <ul className={`text-sm leading-relaxed space-y-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            <li className="flex items-start gap-2">
                                <span className="text-[#4E6E49] mt-1">•</span>
                                <span>Запустите обе стратегии одновременно (Dual Alert)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[#4E6E49] mt-1">•</span>
                                <span>Вход по сигналу</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-rose-400 mt-1">•</span>
                                <span>Стоп-лосс: Отключен (или -50% как страховка от катастрофы)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-emerald-400 mt-1">•</span>
                                <span>Тейк-профит: Автоматическая продажа при +50% от входа</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-purple-400 mt-1">•</span>
                                <span>Альтернатива: 50% на 50%, 50% с трейлинг-стопом -35%</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
