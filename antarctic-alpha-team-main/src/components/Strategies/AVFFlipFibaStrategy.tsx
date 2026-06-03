import React, { useState } from 'react'
import { useThemeStore } from '@/store/themeStore'
import {
    Zap,
    Activity,
    ChevronDown,
    ChevronUp,
    LayoutList,
    Search,
    Target,
    BarChart3,
    Rocket,
    Twitter,
    MousePointer2,
    Settings,
    Layers,
    AlertTriangle,
    Users,
    TrendingUp,
    ShieldAlert,
    Timer,
    Brain
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

export const AVAFlipFibaStrategy: React.FC = () => {
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
                        <Zap className={`w-12 h-12 text-[#4E6E49]`} />
                    </div>
                    <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-3">
                            <h2 className={`text-2xl md:text-3xl font-black ${headingColor}`}>ARCA FLIP + FIBA</h2>
                            <span className="px-3 py-1 rounded-full bg-[#4E6E49]/20 text-[#4E6E49] text-[10px] font-black uppercase tracking-widest border border-[#4E6E49]/20">Pre-Migration</span>
                        </div>
                        <p className={`text-lg leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            Интрадей-флип pre-migration токенов Solana. Авторская стратегия для сверхбыстрых сделок.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-2">
                            <div className="flex items-center gap-2">
                                <Target className="w-4 h-4 text-[#4E6E49]" />
                                <span className="text-sm font-bold">Цель: 2–3x</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Timer className="w-4 h-4 text-[#4E6E49]" />
                                <span className="text-sm font-bold">Время: 1–10 мин</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Core Philosophy Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100 shadow-sm'}`}>
                    <div className="flex items-center gap-3 mb-4 text-[#4E6E49]">
                        <Rocket className="w-6 h-6" />
                        <h4 className="font-black text-lg tracking-tight">Основная идея</h4>
                    </div>
                    <p className="text-sm leading-relaxed opacity-80">
                        Ловля первичного импульса на старте выпуска токена через инфоповод: пост в Twitter (X), активное комьюнити, понятный и хайповый нарратив. Вошёл → забрал импульс → вышел. Не удерживаем позицию долго.
                    </p>
                </div>

                <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100 shadow-sm'}`}>
                    <div className="flex items-center gap-3 mb-4 text-[#4E6E49]">
                        <Activity className="w-6 h-6" />
                        <h4 className="font-black text-lg tracking-tight">Почему это работает?</h4>
                    </div>
                    <ul className="text-xs space-y-3 opacity-90">
                        <li className="flex gap-2">🔹 <span><strong>Рынок изменился:</strong> Большинство покупок совершаются эмоционально.</span></li>
                        <li className="flex gap-2">🔹 <span><strong>Pre-migration сегмент:</strong> Токены с минимальной капитализацией дают иксы за секунды.</span></li>
                        <li className="flex gap-2">🔹 <span><strong>Скорость решает:</strong> Решения принимаются молниеносно: увидел → понял → зашёл.</span></li>
                    </ul>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 3. Detailed Guide */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                        <LayoutList className={`w-6 h-6 ${theme === 'dark' ? 'text-[#4E6E49]' : 'text-[#4E6E49]'}`} />
                        <h3 className={`text-xl font-black ${headingColor}`}>Энциклопедия стратегии</h3>
                    </div>

                    <StrategyStep
                        number={1}
                        title="Для кого подходит?"
                        icon={<Users className="w-5 h-5" />}
                        isOpen={openStep === 1}
                        onToggle={() => toggleStep(1)}
                        badge="Profile"
                    >
                        <ul className="space-y-3 text-sm">
                            <li className="flex justify-between items-center border-b border-white/5 pb-2">
                                <span>Депозит:</span>
                                <span className="font-bold text-[#4E6E49]">до $500</span>
                            </li>
                            <li className="flex justify-between items-center border-b border-white/5 pb-2">
                                <span>Кол-во сделок:</span>
                                <span className="font-bold text-[#4E6E49]">10–15 в день</span>
                            </li>
                            <li className="flex justify-between items-center border-b border-white/5 pb-2">
                                <span>Вход:</span>
                                <span className="font-bold text-[#4E6E49]">20–30 секунд</span>
                            </li>
                            <li className="flex justify-between items-center pb-2">
                                <span>Фиксация:</span>
                                <span className="font-bold text-[#4E6E49]">1–2 минуты</span>
                            </li>
                        </ul>
                        <p className="text-xs italic opacity-70 mt-2">
                            Требуется полное отсутствие эмоциональной привязанности к токенам и готовность быстро резать убытки.
                        </p>
                    </StrategyStep>

                    <StrategyStep
                        number={2}
                        title="Инструменты и Колонки"
                        icon={<Search className="w-5 h-5" />}
                        isOpen={openStep === 2}
                        onToggle={() => toggleStep(2)}
                        badge="Setup"
                    >
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                                    <h5 className="text-xs font-bold uppercase mb-2 text-[#4E6E49]">Терминалы</h5>
                                    <p className="text-xs text-gray-500 leading-relaxed">Axiom Terminal, GMGN</p>
                                </div>
                                <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                                    <h5 className="text-xs font-bold uppercase mb-2 text-[#4E6E49]">Торговля & Графики</h5>
                                    <p className="text-xs text-gray-500 leading-relaxed">Alpha One, Fasol, Frontrun</p>
                                </div>
                            </div>
                            <div className="p-4 rounded-xl bg-[#4E6E49]/5 border border-[#4E6E49]/20">
                                <p className="text-xs font-bold uppercase mb-2">Рабочие колонки (Axiom/GMGN):</p>
                                <ul className="text-xs space-y-2">
                                    <li>🚀 <strong>Final Stretch (Ключевая):</strong> Капитализация $10K–30K. Токены до миграции, уже есть объёмы.</li>
                                    <li>🆕 <strong>New Pairs:</strong> Свежие токены с нулевой капой. Высокая доля мусора, но есть алмазы.</li>
                                    <li>🛑 <strong>Migrated:</strong> После миграции — для данной стратегии НЕ используются.</li>
                                </ul>
                            </div>
                        </div>
                    </StrategyStep>

                    <StrategyStep
                        number={3}
                        title="Чек-лист отбора токена"
                        icon={<Twitter className="w-5 h-5" />}
                        isOpen={openStep === 3}
                        onToggle={() => toggleStep(3)}
                        badge="Audit"
                    >
                        <div className="space-y-6">
                            <div>
                                <h5 className="text-sm font-bold text-[#4E6E49] mb-3 flex items-center gap-2">
                                    <Twitter className="w-4 h-4" /> Социальный аудит (Обязательно)
                                </h5>
                                <ul className="space-y-2 text-xs">
                                    <li className="flex gap-2">✅ <span>Запуск из живого Twitter-комьюнити (пост свежий — 10–15 мин).</span></li>
                                    <li className="flex gap-2">✅ <span>У автора или комьюнити 1000+ живых подписчиков.</span></li>
                                    <li className="flex gap-2">✅ <span>Контракт указан в посте или закрепленном сообщении чата.</span></li>
                                    <li className="flex gap-2">✅ <span>Визуал и слоган соответствуют хайповой идее.</span></li>
                                </ul>
                            </div>
                            <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                                <h5 className="text-sm font-bold text-[#4E6E49] mb-3 flex items-center gap-2">
                                    <BarChart3 className="w-4 h-4" /> График и Метрики (Axiom)
                                </h5>
                                <ul className="grid grid-cols-2 gap-y-2 text-[10px] uppercase font-bold">
                                    <li>Dev: 0%</li>
                                    <li>Top-10: 25–30%</li>
                                    <li>Снайперы: 6–7%</li>
                                    <li>Инсайдеры: до 10%</li>
                                    <li>Бандлеры: до 30%</li>
                                </ul>
                                <p className="text-xs mt-3 opacity-70 italic">На графике должны быть объёмные свечи. Обязателен откуп после DevSell.</p>
                            </div>
                        </div>
                    </StrategyStep>

                    <StrategyStep
                        number={4}
                        title="Точка входа и выхода"
                        icon={<MousePointer2 className="w-5 h-5" />}
                        isOpen={openStep === 4}
                        onToggle={() => toggleStep(4)}
                        badge="Execution"
                    >
                        <div className="space-y-4">
                            <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20">
                                <h6 className="text-xs font-bold text-green-500 uppercase mb-2">Где входим?</h6>
                                <p className="text-sm">В первые минуты после появления токена, когда идея ясна и пошли объемы. Не входим на FOMO, если цена уже улетела без проторговки.</p>
                            </div>
                            <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/20">
                                <h6 className="text-xs font-bold text-rose-500 uppercase mb-2">Где выходим? (Главное правило)</h6>
                                <p className="text-sm mb-2">Фиксация на импульсе: обычно это 2–3x при росте капы с $7–8K до $20–30K.</p>
                                <ul className="text-xs space-y-1 opacity-80 list-disc list-inside">
                                    <li>Цена вернулась к входу — выход в ноль.</li>
                                    <li>Не ждать «ещё чуть-чуть».</li>
                                    <li>Убыток резать быстро: –10–15% максимум.</li>
                                </ul>
                            </div>
                        </div>
                    </StrategyStep>

                    <StrategyStep
                        number={5}
                        title="Дополнительно: FIBA"
                        icon={<Layers className="w-5 h-5" />}
                        isOpen={openStep === 5}
                        onToggle={() => toggleStep(5)}
                        badge="Advanced"
                    >
                        <div className={`p-4 rounded-xl border-2 border-dashed ${theme === 'dark' ? 'border-[#4E6E49]/30' : 'border-[#4E6E49]/20'}`}>
                            <p className="text-xs font-bold uppercase text-[#4E6E49] mb-2">Работа на откате (15s / 1m TF)</p>
                            <p className="text-sm mb-3">Если основной импульс пропущен, строим сетку Фибо от лоя до хая.</p>
                            <div className="flex gap-6">
                                <div>
                                    <p className="text-[10px] font-bold opacity-50 uppercase">Уровни входа</p>
                                    <p className="font-black text-[#4E6E49]">0.618 / 0.786</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold opacity-50 uppercase">Цель отскока</p>
                                    <p className="font-black text-green-500">20–40%</p>
                                </div>
                            </div>
                        </div>
                    </StrategyStep>

                    <StrategyStep
                        number={6}
                        title="Навык и Ошибки"
                        icon={<Brain className="w-5 h-5" />}
                        isOpen={openStep === 6}
                        onToggle={() => toggleStep(6)}
                    >
                        <div className="space-y-4">
                            <div>
                                <h5 className="text-xs font-bold uppercase text-[#4E6E49] mb-2">Насмотренность</h5>
                                <p className="text-xs leading-relaxed opacity-80">Ежедневно разбирайте токены, которые улетели. Анализируйте идею, вход и тайминг. «Торговля на бумаге» — отмечайте гипотетические входы. Постоянно будьте в инфополе (Twitter, чаты, стримеры).</p>
                            </div>
                            <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-rose-500/5' : 'bg-rose-50'} border border-rose-500/20`}>
                                <h5 className="text-xs font-bold uppercase text-rose-500 mb-2">Типичные ошибки</h5>
                                <ul className="text-xs space-y-1 list-disc list-inside opacity-80">
                                    <li>Вход без понимания идеи.</li>
                                    <li>FOMO и вера в токен (пересиживание профита).</li>
                                    <li>Надежда в убыточной позиции.</li>
                                    <li>Игнорирование метрик DEV и холдеров.</li>
                                    <li>Отработка без дисциплины фиксации.</li>
                                </ul>
                            </div>
                        </div>
                    </StrategyStep>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Trading Settings */}
                    <div className={`rounded-2xl p-6 border ${theme === 'dark' ? 'bg-[#151a21]/80 border-white/5' : 'bg-white border-gray-100'} shadow-lg space-y-4`}>
                        <div className="flex items-center gap-3">
                            <Settings className={`w-6 h-6 text-[#4E6E49]`} />
                            <h3 className={`text-lg font-black ${headingColor}`}>Тех. настройки</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="pb-3 border-b border-white/5">
                                <p className="text-[9px] font-black text-[#4E6E49] uppercase tracking-widest mb-1">ГАЗ (PRIORITY)</p>
                                <p className="text-xs font-bold">0.002 SOL (СТАРТ)</p>
                            </div>
                            <div className="pb-3 border-b border-white/5">
                                <p className="text-[9px] font-black text-[#4E6E49] uppercase tracking-widest mb-1">JITO</p>
                                <p className="text-xs font-bold">ВСЕГДА ВКЛЮЧЕН ВРУЧНУЮ</p>
                            </div>
                            <div className="pb-3 border-b border-white/5">
                                <p className="text-[9px] font-black text-[#4E6E49] uppercase tracking-widest mb-1">SLIPPAGE (PRO)</p>
                                <p className="text-xs font-bold">20% КУПИТЬ / 20% ПРОДАТЬ</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-[#4E6E49] uppercase tracking-widest mb-1">ВХОД</p>
                                <p className="text-xs font-bold">ПО РЫНКУ, ОДНОЙ СУММОЙ</p>
                            </div>
                        </div>
                        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-[10px] text-rose-500 font-bold uppercase text-center">
                            АВТО-SL / TP НЕ ИСПОЛЬЗОВАТЬ
                        </div>
                    </div>

                    {/* Criteria Box */}
                    <div className={`rounded-2xl p-6 border ${theme === 'dark' ? 'bg-[#4E6E49]/5 border-[#4E6E49]/20' : 'bg-[#4E6E49]/5 border-[#4E6E49]/20'} space-y-4`}>
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="w-6 h-6 text-[#4E6E49]" />
                            <h3 className={`text-lg font-black ${headingColor}`}>Потолок идеи</h3>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <p className="text-[10px] font-bold opacity-50 uppercase">Слабая идея</p>
                                <p className="text-xs font-bold tracking-tight">ФИКСАЦИЯ ОКОЛО $50K КАПЫ</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold opacity-50 uppercase">Сильная идея</p>
                                <p className="text-xs font-bold tracking-tight">ЖДАТЬ $100K–$150K</p>
                            </div>
                        </div>
                        <div className="pt-2">
                            <p className="text-[10px] font-black text-rose-500 uppercase mb-2 tracking-tighter underline">ПРОПУСКАТЬ, ЕСЛИ:</p>
                            <ul className="text-[10px] space-y-1 opacity-70">
                                <li>• Идея нечитаемая / дубликат</li>
                                <li>• Ошибки в названии</li>
                                <li>• Нет ясного нарратива</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Final Outcome */}
            <div className={`rounded-2xl p-6 border-l-8 ${theme === 'dark' ? 'bg-[#0b1015] border-[#4E6E49]/50' : 'bg-gray-50 border-[#4E6E49]/30'} flex gap-6 items-start shadow-inner`}>
                <div className={`p-4 rounded-full ${theme === 'dark' ? 'bg-[#4E6E49]/10' : 'bg-[#4E6E49]/5'}`}>
                    <ShieldAlert className="w-10 h-10 text-[#4E6E49] shrink-0" />
                </div>
                <div className="space-y-2">
                    <h4 className={`text-xl font-black ${headingColor}`}>Итог стратегии</h4>
                    <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        Стратегия основана на скорости и дисциплине. Чек-лист важнее интуиции. На старте — меньше сделок, больше глубокого анализа. Прогресс приходит через ежедневную осознанную практику и наработку насмотренности.
                    </p>
                    <div className="flex items-center gap-2 text-[#4E6E49] font-black text-[10px] uppercase tracking-widest pt-2">
                        Действуйте хладнокровно <TrendingUp className="w-3 h-3" />
                    </div>
                </div>
            </div>
        </div>
    )
}
