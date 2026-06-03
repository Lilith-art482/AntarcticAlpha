import React, { useState } from 'react'
import { useThemeStore } from '@/store/themeStore'
import {
    Activity,
    ChevronDown,
    ChevronUp,
    Target,
    BarChart3,
    Brain,
    ShieldAlert,
    TrendingUp,
    Zap,
    LayoutList,
    ShoppingBag,
    Search,
    AlertTriangle,
    Timer
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

export const AftNftSnipingStrategy: React.FC = () => {
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
                        <Target className={`w-12 h-12 text-[#4E6E49]`} />
                    </div>
                    <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-3">
                            <h2 className={`text-2xl md:text-3xl font-black ${headingColor}`}>ARCA снайпинг NFT</h2>
                            <span className="px-3 py-1 rounded-full bg-[#4E6E49]/20 text-[#4E6E49] text-[10px] font-black uppercase tracking-widest border border-[#4E6E49]/20">Sniper Mode</span>
                        </div>
                        <p className={`text-lg leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            Снайпинг — это покупка NFT дешевле текущей рыночной цены (флора) с целью перепродажи по рыночной цене или чуть ниже неё.
                        </p>
                        <div className="p-3 rounded-xl bg-[#4E6E49]/5 border border-[#4E6E49]/10 inline-block text-xs font-bold italic opacity-80">
                            "Ты покупаешь, когда кто-то паникует или ошибается, и продаёшь, когда рынок возвращается в норму."
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Philosophy & Basic Terms */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100 shadow-sm'}`}>
                    <div className="flex items-center gap-3 mb-4 text-[#4E6E49]">
                        <Brain className="w-6 h-6" />
                        <h4 className="font-black text-lg tracking-tight">Суть стратегии</h4>
                    </div>
                    <p className="text-sm leading-relaxed opacity-80">
                        Это не про хайп, а про механику рынка. Заработок на панических продажах и ошибках владельцев (Panic Sell). Когда владелец срочно выходит или фиксирует убыток, снайпер забирает актив ниже флора.
                    </p>
                </div>

                <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100 shadow-sm'}`}>
                    <div className="flex items-center gap-3 mb-4 text-[#4E6E49]">
                        <LayoutList className="w-6 h-6" />
                        <h4 className="font-black text-lg tracking-tight">Базовые термины</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <p className="text-[10px] font-bold uppercase text-[#4E6E49]">Secondary market</p>
                            <p className="text-[11px] opacity-70">OpenSea, Blur, Magic Eden — платформы перепродажи.</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase text-[#4E6E49]">Floor price (Флор)</p>
                            <p className="text-[11px] opacity-70">Минимальная цена — индикатор спроса здесь и сейчас.</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase text-[#4E6E49]">Liquidity</p>
                            <p className="text-[11px] opacity-70">Скорость продажи без обвала цены.</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase text-[#4E6E49]">Panic sell</p>
                            <p className="text-[11px] opacity-70">Срочная продажа ниже рынка.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Market Conditions */}
            <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#4E6E49]/5 border-[#4E6E49]/20' : 'bg-[#4E6E49]/5 border-[#4E6E49]/20'}`}>
                <div className="flex items-center gap-3 mb-6">
                    <Activity className="w-6 h-6 text-[#4E6E49]" />
                    <h3 className={`text-xl font-black ${headingColor}`}>Рыночный фильтр</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <h5 className="text-xs font-bold uppercase text-green-500 flex items-center gap-2">
                            Лучшие условия
                        </h5>
                        <ul className="text-sm space-y-2 opacity-80">
                            <li>🔹 Боковой рынок (Sideways)</li>
                            <li>🔹 Умеренный медвежий рынок</li>
                            <li>🔹 Коллекции с постоянным объёмом торгов</li>
                            <li className="text-[11px] italic opacity-60">Почему: Меньше хайпа, больше ошибок у продавцов.</li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h5 className="text-xs font-bold uppercase text-rose-500 flex items-center gap-2">
                            Когда НЕ использовать
                        </h5>
                        <ul className="text-sm space-y-2 opacity-80">
                            <li>❌ Полностью мёртвые проекты</li>
                            <li>❌ Коллекции без объёма</li>
                            <li>❌ NFT «надежды и молитвы»</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 4. Detailed Guide */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                        <LayoutList className={`w-6 h-6 ${theme === 'dark' ? 'text-[#4E6E49]' : 'text-[#4E6E49]'}`} />
                        <h3 className={`text-xl font-black ${headingColor}`}>Пошаговая инструкция</h3>
                    </div>

                    <StrategyStep
                        number={1}
                        title="Выбор коллекции"
                        icon={<ShoppingBag className="w-5 h-5" />}
                        isOpen={openStep === 1}
                        onToggle={() => toggleStep(1)}
                        badge="Selection"
                    >
                        <div className="space-y-4">
                            <div className="p-4 rounded-xl border border-[#4E6E49]/10 bg-[#4E6E49]/5">
                                <h6 className="text-[10px] font-black uppercase mb-2">Минимальные критерии:</h6>
                                <p className="text-sm">Есть ежедневные продажи, живой Discord / Twitter, флор не стоит на одном месте неделями.</p>
                            </div>
                            <div>
                                <h6 className="text-[10px] font-black uppercase text-[#4E6E49] mb-2">Проверка объёма (Stats):</h6>
                                <p className="text-xs text-gray-500 italic">Смотреть: volume 24h, volume 7d. Правило: если нет продаж — нет снайпинга.</p>
                            </div>
                        </div>
                    </StrategyStep>

                    <StrategyStep
                        number={2}
                        title="Определение реального флора"
                        icon={<BarChart3 className="w-5 h-5" />}
                        isOpen={openStep === 2}
                        onToggle={() => toggleStep(2)}
                        badge="Audit"
                    >
                        <p className="text-sm mb-4">Ошибка новичков: смотреть только на минимальный листинг.</p>
                        <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-[#151a21] border-white/5' : 'bg-gray-50 border-gray-200'}`}>
                            <h6 className="text-xs font-bold uppercase mb-2 text-[#4E6E49]">Как определить:</h6>
                            <ul className="text-xs space-y-1 list-inside list-disc opacity-80">
                                <li>Открыть последние 10–20 продаж</li>
                                <li>Посмотреть диапазон цен</li>
                                <li>Определить среднее значение</li>
                            </ul>
                            <p className="text-[10px] mt-3 font-bold uppercase tracking-widest text-[#4E6E49]/60">Это и есть реальный флор</p>
                        </div>
                    </StrategyStep>

                    <StrategyStep
                        number={3}
                        title="Поиск и Сделка"
                        icon={<Search className="w-5 h-5" />}
                        isOpen={openStep === 3}
                        onToggle={() => toggleStep(3)}
                    >
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl border border-green-500/20 bg-green-500/5">
                                    <h6 className="text-[10px] font-black uppercase text-green-500 mb-2">Хорошая сделка:</h6>
                                    <ul className="text-[11px] space-y-1 opacity-80">
                                        <li>✅ Цена на 10–30% ниже флора</li>
                                        <li>✅ NFT без ограничений</li>
                                        <li>✅ Стандартные traits</li>
                                    </ul>
                                </div>
                                <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5">
                                    <h6 className="text-[10px] font-black uppercase text-rose-500 mb-2">Пропустить:</h6>
                                    <ul className="text-[11px] space-y-1 opacity-80">
                                        <li>❌ Заблокированные NFT</li>
                                        <li>❌ Странные метаданные</li>
                                        <li>❌ "Уникальные" без спроса</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="p-4 rounded-xl border border-[#4E6E49]/10 bg-[#4E6E49]/5">
                                <h6 className="text-[10px] font-black uppercase text-[#4E6E49] mb-2">Проверка (Обязательно):</h6>
                                <p className="text-sm">История продаж, отсутствие резких дампов и wash trading. Если продавали сами себе — пропускаем.</p>
                            </div>
                        </div>
                    </StrategyStep>

                    <StrategyStep
                        number={4}
                        title="Покупка и Перепродажа"
                        icon={<Zap className="w-5 h-5" />}
                        isOpen={openStep === 4}
                        onToggle={() => toggleStep(4)}
                        badge="Execution"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <h6 className="text-xs font-bold uppercase text-[#4E6E49]">Вход:</h6>
                                <ul className="text-xs list-disc list-inside opacity-80">
                                    <li>Не на весь баланс</li>
                                    <li>Одна сделка = одна идея</li>
                                    <li>Фиксировать цену входа</li>
                                </ul>
                            </div>
                            <div className="space-y-3">
                                <h6 className="text-xs font-bold uppercase text-green-500">Выход:</h6>
                                <ul className="text-xs list-disc list-inside opacity-80">
                                    <li>По текущему флору</li>
                                    <li>Или на 1–3% ниже</li>
                                    <li>Ждать: часы — дни</li>
                                </ul>
                            </div>
                        </div>
                        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-[10px] text-rose-500 font-bold uppercase text-center mt-4">
                            Если флор падает или объёмы исчезают — выходить в ноль.
                        </div>
                    </StrategyStep>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Character Analysis */}
                    <div className={`rounded-2xl p-6 border ${theme === 'dark' ? 'bg-[#151a21]/80 border-white/5' : 'bg-white border-gray-100'} shadow-lg space-y-4`}>
                        <div className="flex items-center gap-3">
                            <ShieldAlert className={`w-6 h-6 text-[#4E6E49]`} />
                            <h3 className={`text-lg font-black ${headingColor}`}>Диагноз коллекции</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="pb-3 border-b border-white/5">
                                <p className="text-[9px] font-black text-green-500 uppercase tracking-widest mb-1">Живая</p>
                                <p className="text-xs opacity-70">Ежедневные сделки, живые обсуждения, реакция на апдейты.</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest mb-1">Мёртвая</p>
                                <p className="text-xs opacity-70">Флор стоит неделями, Discord пуст, Twitter молчит. Флор без объёма = иллюзия.</p>
                            </div>
                        </div>
                    </div>

                    {/* Mistakes Box */}
                    <div className={`rounded-2xl p-6 border ${theme === 'dark' ? 'bg-rose-500/5 border-rose-500/20' : 'bg-rose-50 border-rose-500/20'} space-y-4`}>
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="w-6 h-6 text-rose-500" />
                            <h3 className={`text-lg font-black ${headingColor}`}>Ошибки новичков</h3>
                        </div>
                        <ul className="text-xs space-y-2 opacity-80">
                            <li>🚩 Покупать «самое дешёвое»</li>
                            <li>🚩 Игнорировать объём</li>
                            <li>🚩 Ловить дно без спроса</li>
                        </ul>
                    </div>

                    {/* Summary */}
                    <div className={`p-6 rounded-2xl bg-[#4E6E49]/5 border border-[#4E6E49]/20 text-center space-y-2`}>
                        <p className="text-[10px] font-black uppercase text-[#4E6E49]">Снайпинг — это:</p>
                        <div className="flex justify-center gap-4 py-2">
                            <div className="text-center">
                                <Timer className="w-5 h-5 text-[#4E6E49] mx-auto" />
                                <span className="text-[10px] font-bold">Терпение</span>
                            </div>
                            <div className="text-center">
                                <Brain className="w-5 h-5 text-[#4E6E49] mx-auto" />
                                <span className="text-[10px] font-bold">Расчёт</span>
                            </div>
                            <div className="text-center">
                                <Zap className="w-5 h-5 text-[#4E6E49] mx-auto" />
                                <span className="text-[10px] font-bold">Холод</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Final Outcome */}
            <div className={`rounded-2xl p-6 border-l-8 ${theme === 'dark' ? 'bg-[#0b1015] border-[#4E6E49]/50' : 'bg-gray-50 border-[#4E6E49]/30'} flex gap-6 items-start shadow-inner`}>
                <div className={`p-4 rounded-full ${theme === 'dark' ? 'bg-[#4E6E49]/10' : 'bg-[#4E6E49]/5'}`}>
                    <TrendingUp className="w-10 h-10 text-[#4E6E49] shrink-0" />
                </div>
                <div className="space-y-2">
                    <h4 className={`text-xl font-black ${headingColor}`}>Итог стратегии</h4>
                    <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        Стратегия снайпинга требует дисциплины и быстрого принятия решений. Это не азартная игра, а работа с неэффективностью рынка. Входите хладнокровно, выходите вовремя.
                    </p>
                </div>
            </div>
        </div>
    )
}
