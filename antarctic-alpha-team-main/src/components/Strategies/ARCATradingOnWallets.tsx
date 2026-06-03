import React, { useState } from 'react'
import { useThemeStore } from '@/store/themeStore'
import {
    Search,
    Users,
    Brain,
    Wallet,
    TrendingUp,
    ChevronDown,
    ChevronUp,
    Target,
    AlertCircle,
    BarChart3,
    CheckCircle2,
    LayoutList,
    Activity,
    Eye
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

export const ARCATradingOnWallets: React.FC = () => {
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
                        <Search className={`w-12 h-12 ${theme === 'dark' ? 'text-[#4E6E49]' : 'text-[#4E6E49]'}`} />
                    </div>
                    <div className="flex-1 space-y-4">
                        <h2 className={`text-2xl md:text-3xl font-black ${headingColor}`}>ARCA Trading on Wallets</h2>
                        <p className={`text-lg leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            Торговля по кошелькам заключается в сборе базы адресов успешных игроков (инфлюенсеров, колеров, смарт-трейдеров или членов команд запуска) 
                            и отслеживании их действий в реальном времени. Активность таких кошельков служит дополнительным тезисом для того, чтобы зайти в сделку 
                            или продолжать удерживать позицию. Обратите внимание, что так можно исать и кошелько DEV, которые запускают нормальные проекты (нет множество запусков, нет одной-двух свечей на миграцию, нормальный Bot Fee), высокие ATH.
                        </p>
                        <div className={`flex flex-wrap gap-4 pt-2`}>
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${theme === 'dark' ? 'bg-white/5 text-gray-400 border border-white/10' : 'bg-gray-100 text-gray-600 border border-gray-200'
                                }`}>
                                <Users className="w-3.5 h-3.5" />
                                ON-CHAIN АНАЛИЗ
                            </div>
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${theme === 'dark' ? 'bg-white/5 text-gray-400 border border-white/10' : 'bg-gray-100 text-gray-600 border border-gray-200'
                                }`}>
                                <Target className="w-3.5 h-3.5" />
                                Слежение за кошельками
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
                        title="Типы кошельков для отслеживания"
                        icon={<Users className="w-5 h-5" />}
                        isOpen={openStep === 1}
                        onToggle={() => toggleStep(1)}
                    >
                        <p className="mb-4">Для эффективной работы важно понимать, чьи именно действия вы видите:</p>
                        
                        <div className="space-y-3">
                            <div className={`flex items-start gap-3 p-3 rounded-xl ${theme === 'dark' ? 'bg-emerald-500/5 border border-emerald-500/20' : 'bg-emerald-50 border border-emerald-500/20'}`}>
                                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold text-sm">Публичные адреса инфлюенсеров и колеров</p>
                                    <p className="text-xs">Позволяют видеть, какие монеты они выбирают для работы.</p>
                                </div>
                            </div>
                            <div className={`flex items-start gap-3 p-3 rounded-xl ${theme === 'dark' ? 'bg-blue-500/5 border border-blue-500/20' : 'bg-blue-50 border border-blue-500/20'}`}>
                                <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold text-sm">Смарт-мани (Smart Money)</p>
                                    <p className="text-xs">Кошельки обычных трейдеров, которые «чувствуют рынок», имеют высокий PnL и вовремя заходят в профитные сделки.</p>
                                </div>
                            </div>
                            <div className={`flex items-start gap-3 p-3 rounded-xl ${theme === 'dark' ? 'bg-violet-500/5 border border-violet-500/20' : 'bg-violet-50 border border-violet-500/20'}`}>
                                <CheckCircle2 className="w-5 h-5 text-violet-500 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold text-sm">Кошельки команд и сайд-кошельки</p>
                                    <p className="text-xs">Адреса, связанные с разработчиками конкретной монеты. Имеют наибольшую ценность, так как владельцы точно знают потенциал роста проекта.</p>
                                </div>
                            </div>
                        </div>
                    </StrategyStep>

                    <StrategyStep
                        number={2}
                        title="Инструменты и поиск кошельков"
                        icon={<Search className="w-5 h-5" />}
                        isOpen={openStep === 2}
                        onToggle={() => toggleStep(2)}
                    >
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-bold mb-2">Где искать кошельки</h4>
                                <p className="text-sm">Для поиска и анализа используются терминалы</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Вкладка «Трейдеры»</p>
                                    <p className={`text-lg font-black ${headingColor}`}>Traders</p>
                                    <p className="text-xs text-gray-500 mt-1">Список кошельков, взаимодействующих с монетой</p>
                                </div>
                                <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Раздел «Смарты»</p>
                                    <p className={`text-lg font-black ${headingColor}`}>Smart Money</p>
                                    <p className="text-xs text-gray-500 mt-1">Готовые списки прибыльных кошельков</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-bold mb-2">Что анализировать</h4>
                                <ul className="space-y-1 list-disc list-inside text-sm pl-2">
                                    <li>Анализ PnL и статистики — история сделок, доходность, какие монеты холдит</li>
                                    <li>Уведомления — найденные кошельки ставим на алерты</li>
                                    <li>В фасоли реализован трекер кошельков</li>
                                </ul>
                            </div>
                        </div>
                    </StrategyStep>

                    <StrategyStep
                        number={3}
                        title="Анализ поведения кошелька"
                        icon={<Brain className="w-5 h-5" />}
                        isOpen={openStep === 3}
                        onToggle={() => toggleStep(3)}
                    >
                        <p className="mb-4">При изучении адреса обращайте внимание на следующие паттерны:</p>
                        
                        <div className="space-y-3">
                            <div className={`flex items-start gap-3 p-3 rounded-xl ${theme === 'dark' ? 'bg-rose-500/5 border border-rose-500/20' : 'bg-rose-50 border border-rose-500/20'}`}>
                                <Target className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold text-sm">Точка входа</p>
                                    <p className="text-xs">Покупает ли кошелек на «лоях» (при капитализации $10 000) или уже после миграции (при капе $50к–100к).</p>
                                </div>
                            </div>
                            <div className={`flex items-start gap-3 p-3 rounded-xl ${theme === 'dark' ? 'bg-orange-500/5 border border-orange-500/20' : 'bg-orange-50 border border-orange-500/20'}`}>
                                <Activity className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold text-sm">Стиль торговли</p>
                                    <p className="text-xs">Скальпинг (быстрые покупки и продажи на графике) или долгосрочное удержание (холд).</p>
                                </div>
                            </div>
                            <div className={`flex items-start gap-3 p-3 rounded-xl ${theme === 'dark' ? 'bg-purple-500/5 border border-purple-500/20' : 'bg-purple-50 border border-purple-500/20'}`}>
                                <TrendingUp className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold text-sm">Взаимосвязи</p>
                                    <p className="text-xs">Связь между конкретной личностью и кошельком или принадлежность адреса к определенной «кабальной» команде.</p>
                                </div>
                            </div>
                        </div>
                    </StrategyStep>

                    <StrategyStep
                        number={4}
                        title="Практические советы"
                        icon={<Wallet className="w-5 h-5" />}
                        isOpen={openStep === 4}
                        onToggle={() => toggleStep(4)}
                    >
                        <div className="space-y-4">
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="w-6 h-6 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center text-xs font-bold">1</span>
                                    <h4 className="font-bold">Насмотренность</h4>
                                </div>
                                <p className="text-sm pl-8">Собрать качественную пачку кошельков с первого раза не получится; это требует времени и постоянного анализа графиков и транзакций.</p>
                            </div>

                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="w-6 h-6 rounded-lg bg-fuchsia-500/10 text-fuchsia-500 flex items-center justify-center text-xs font-bold">2</span>
                                    <h4 className="font-bold">Приоритетность</h4>
                                </div>
                                <p className="text-sm pl-8">Скрытые кошельки команд гораздо важнее кошельков обычных смертных, так как команда лучше понимает реальные перспективы токена.</p>
                            </div>

                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="w-6 h-6 rounded-lg bg-pink-500/10 text-pink-500 flex items-center justify-center text-xs font-bold">3</span>
                                    <h4 className="font-bold">Ведение базы</h4>
                                </div>
                                <p className="text-sm pl-8">Отслеживайте покупки/продажи прямо на графике в терминале, чтобы видеть, в какие моменты умные деньги выходят из позиции.</p>
                            </div>
                        </div>
                    </StrategyStep>

                    <StrategyStep
                        number={5}
                        title="Главная задача трейдера"
                        icon={<Target className="w-5 h-5" />}
                        isOpen={openStep === 5}
                        onToggle={() => toggleStep(5)}
                    >
                        <p className="mb-4">Самостоятельно разбирать монетки по свечам и стакану, ища подтверждение действий отслеживаемых кошельков.</p>
                        
                        <div className={`p-4 rounded-xl border-l-4 ${theme === 'dark' ? 'bg-[#4E6E49]/5 border-[#4E6E49]/50' : 'bg-[#4E6E49]/5 border-[#4E6E49]/30'}`}>
                            <p className="text-sm italic">
                                <strong>Ключевая идея:</strong> Кошельки — это дополнительный тезис, а не сигнал к входу. Всегда проверяйте свечи и объёмы перед принятием решения.
                            </p>
                        </div>
                    </StrategyStep>
                </div>

                {/* Sidebar: Quick Reference */}
                <div className="space-y-6">
                    {/* Entry Conditions */}
                    <div className={`rounded-2xl p-6 border ${theme === 'dark' ? 'bg-[#151a21]/80 border-white/5' : 'bg-white border-gray-100'
                        } shadow-lg space-y-4`}>
                        <div className="flex items-center gap-3">
                            <Eye className={`w-6 h-6 text-blue-400`} />
                            <h3 className={`text-lg font-black ${headingColor}`}>Что искать</h3>
                        </div>

                        <div className="space-y-3">
                            <div className={`flex items-center gap-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                <span>Покупки на «лоях» (капа $10k)</span>
                            </div>
                            <div className={`flex items-center gap-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                <span>Высокий PnL кошелька</span>
                            </div>
                            <div className={`flex items-center gap-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                <span>Связь с командой проекта</span>
                            </div>
                            <div className={`flex items-center gap-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                <span>Докупки на просадках</span>
                            </div>
                        </div>
                    </div>

                    {/* Risk Management */}
                    <div className={`rounded-2xl p-6 border ${theme === 'dark' ? 'bg-[#4E6E49]/5 border-[#4E6E49]/20' : 'bg-[#4E6E49]/5 border-[#4E6E49]/20'
                        } shadow-lg space-y-4`}>
                        <div className="flex items-center gap-3">
                            <AlertCircle className={`w-6 h-6 text-[#4E6E49]`} />
                            <h3 className={`text-lg font-black ${headingColor}`}>Риск-менеджмент</h3>
                        </div>

                        <div className="space-y-3">
                            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                <p className="text-xs text-gray-500 mb-1">Кошельки — это</p>
                                <p className="font-bold">Дополнительный тезис</p>
                                <p className="text-xs text-gray-500 mt-1">Не основной сигнал к входу</p>
                            </div>
                            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                <p className="text-xs text-gray-500 mb-1">Всегда проверяйте</p>
                                <p className="font-bold">Свечи и объёмы</p>
                                <p className="text-xs text-gray-500 mt-1">Подтверждение от кошелька</p>
                            </div>
                        </div>
                    </div>

                    {/* Tools */}
                    <div className={`rounded-2xl p-6 border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
                        } shadow-lg space-y-4`}>
                        <div className="flex items-center gap-3">
                            <BarChart3 className={`w-6 h-6 text-[#4E6E49]`} />
                            <h3 className={`text-lg font-black ${headingColor}`}>Инструменты</h3>
                        </div>
                        
                        <div className="space-y-2">
                            <a 
                                href="https://gmgn.ai/r/Mxam3xgW" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className={`block p-3 rounded-xl transition-colors ${theme === 'dark' ? 'bg-white/5 hover:bg-white/10' : 'bg-white hover:bg-gray-100'} border ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}
                            >
                                <p className="font-bold text-sm">GMGN Terminal</p>
                                <p className="text-xs text-gray-500">Топ-трейдеры, вкладка Traders</p>
                            </a>
                            <a 
                                href="https://t.me/fasolbot?start=ref_artyommedoed" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className={`block p-3 rounded-xl transition-colors ${theme === 'dark' ? 'bg-white/5 hover:bg-white/10' : 'bg-white hover:bg-gray-100'} border ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}
                            >
                                <p className="font-bold text-sm">Fasol Terminal</p>
                                <p className="text-xs text-gray-500">Трекер кошельков, алерты</p>
                            </a>
                            <a 
                                href="https://t.me/BullxBetaBot?start=access_KEUS3W7GJKG" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className={`block p-3 rounded-xl transition-colors ${theme === 'dark' ? 'bg-white/5 hover:bg-white/10' : 'bg-white hover:bg-gray-100'} border ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}
                            >
                                <p className="font-bold text-sm">Bullx Terminal</p>
                                <p className="text-xs text-gray-500">Торговый терминал с продвинутыми функциями</p>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Final Logic Footer */}
            <div className={`rounded-2xl p-6 border-l-8 ${theme === 'dark' ? 'bg-[#0b1015] border-[#4E6E49]/50' : 'bg-gray-50 border-[#4E6E49]/30'
                }`}>
                <div className="flex gap-4 items-start">
                    <AlertCircle className="w-8 h-8 text-[#4E6E49] shrink-0" />
                    <div className="space-y-2">
                        <h4 className={`text-lg font-black ${headingColor}`}>Итоговая логика</h4>
                        <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            Стратегия требует времени на формирование качественной базы кошельков. Начинайте с публичных адресов инфлюенсеров, затем переходите к смарт-мани и кошелькам команд. Всегда подтверждайте действия кошельков свечным и объёмным анализом — кошельки это дополнительный тезис, а не гарантия успеха.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ARCATradingOnWallets
