import React, { useState } from 'react'
import { useThemeStore } from '@/store/themeStore'
import {
    Activity,
    ChevronDown,
    ChevronUp,
    Brain,
    ShieldAlert,
    TrendingUp,
    Zap,
    LayoutList,
    Search,
    AlertTriangle,
    Flame,
    Droplets,
    ShieldCheck,
    Coins,
    Wallet
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

export const AvfMintFlipStrategy: React.FC = () => {
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
                        <Flame className={`w-12 h-12 text-[#4E6E49]`} />
                    </div>
                    <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-3">
                            <h2 className={`text-2xl md:text-3xl font-black ${headingColor}`}>AVA Mint → Flip</h2>
                            <span className="px-3 py-1 rounded-full bg-[#4E6E49]/20 text-[#4E6E49] text-[10px] font-black uppercase tracking-widest border border-[#4E6E49]/20">Primary Market</span>
                        </div>
                        <p className={`text-lg leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            Стратегия заработка на первичном спросе и хайпе: покупка напрямую у создателей (mint) и быстрая перепродажа на вторичном рынке.
                        </p>
                        <div className="p-3 rounded-xl bg-[#4E6E49]/5 border border-[#4E6E49]/10 inline-block text-xs font-bold italic opacity-80">
                            "Цель — заработать на импульсе запуска, а не на долгосрочном владении актива."
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Basic Terms */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100 shadow-sm'}`}>
                    <div className="flex items-center gap-3 mb-4 text-[#4E6E49]">
                        <Brain className="w-6 h-6" />
                        <h4 className="font-black text-lg tracking-tight">Суть стратегии</h4>
                    </div>
                    <ul className="text-sm space-y-3 opacity-80">
                        <li className="flex gap-2"><span>1.</span> <strong>Mинт:</strong> Покупка напрямую по фиксированной цене.</li>
                        <li className="flex gap-2"><span>2.</span> <strong>Флип:</strong> Быстрая перепродажа в первые часы/дни.</li>
                    </ul>
                </div>

                <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100 shadow-sm'}`}>
                    <div className="flex items-center gap-3 mb-4 text-[#4E6E49]">
                        <LayoutList className="w-6 h-6" />
                        <h4 className="font-black text-lg tracking-tight">Обязательные термины</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-[10px] font-bold uppercase text-[#4E6E49]">Gas (Газ)</p>
                            <p className="text-[11px] opacity-70">Комиссия сети. Опасайтесь Gas Wars.</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase text-[#4E6E49]">Supply (Саплай)</p>
                            <p className="text-[11px] opacity-70">Общее кол-во NFT. Чем меньше, тем лучше.</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase text-[#4E6E49]">Floor Price</p>
                            <p className="text-[11px] opacity-70">Минимальная цена рынка. Ориентир выхода.</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase text-[#4E6E49]">Whitelist (WL)</p>
                            <p className="text-[11px] opacity-70">Право на покупку без очереди и дешевле.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Market Cycles */}
            <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#4E6E49]/5 border-[#4E6E49]/20' : 'bg-[#4E6E49]/5 border-[#4E6E49]/20'}`}>
                <div className="flex items-center gap-3 mb-6">
                    <Activity className="w-6 h-6 text-[#4E6E49]" />
                    <h3 className={`text-xl font-black ${headingColor}`}>Циклы рынка</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <h5 className="text-xs font-bold uppercase text-[#4E6E49] flex items-center gap-2">
                            Бычий рынок (NFT Bull)
                        </h5>
                        <ul className="text-sm space-y-2 opacity-80">
                            <li>📈 Коллекции быстро растут в цене</li>
                            <li>📊 Высокий объём торгов и приток новых лиц</li>
                            <li>✅ Стратегия работает часто, риски снижены</li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h5 className="text-xs font-bold uppercase text-rose-500 flex items-center gap-2">
                            Медвежий рынок (NFT Bear)
                        </h5>
                        <ul className="text-sm space-y-2 opacity-80">
                            <li>📉 Новые минты не продаются</li>
                            <li>📉 Низкий объём, флоры падают</li>
                            <li>❌ Стратегия крайне рискованна</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 4. Steps */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                        <LayoutList className={`w-6 h-6 ${theme === 'dark' ? 'text-[#4E6E49]' : 'text-[#4E6E49]'}`} />
                        <h3 className={`text-xl font-black ${headingColor}`}>Инструкция Mint → Flip</h3>
                    </div>

                    <StrategyStep
                        number={1}
                        title="Поиск и отбор проекта"
                        icon={<Search className="w-5 h-5" />}
                        isOpen={openStep === 1}
                        onToggle={() => toggleStep(1)}
                        badge="Research"
                    >
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 rounded-xl bg-[#4E6E49]/5 border border-[#4E6E49]/10">
                                    <h6 className="text-[10px] font-black uppercase mb-1">Где искать:</h6>
                                    <p className="text-[11px] opacity-70">Twitter (X), Discord, NFT-календари.</p>
                                </div>
                                <div className="p-3 rounded-xl bg-[#4E6E49]/5 border border-[#4E6E49]/10">
                                    <h6 className="text-[10px] font-black uppercase mb-1">Рекоменация:</h6>
                                    <p className="text-[11px] opacity-70">Минт до 0.08 ETH для новичков.</p>
                                </div>
                            </div>
                            <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                                <h6 className="text-xs font-bold uppercase mb-2 text-[#4E6E49]">Чек-лист отсева:</h6>
                                <ul className="text-xs space-y-2">
                                    <li>📊 <strong>Supply:</strong> Всегда проверяйте общее кол-во. Нет числа = красный флаг.</li>
                                    <li>🎨 <strong>Арт:</strong> Должен быть показан до минта. Опасайтесь "рендеров в тумане".</li>
                                </ul>
                            </div>
                        </div>
                    </StrategyStep>

                    <StrategyStep
                        number={2}
                        title="Глубокая аналитика (Антискам)"
                        icon={<ShieldCheck className="w-5 h-5" />}
                        isOpen={openStep === 2}
                        onToggle={() => toggleStep(2)}
                        badge="Security"
                    >
                        <div className="space-y-4">
                            <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5">
                                <h6 className="text-xs font-bold uppercase text-rose-500 mb-2">Красные флаги команды:</h6>
                                <p className="text-xs">Полная анонимность без репутации, пустые обещания «гарантий», фразы «скоро раскроемся».</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <h6 className="text-[10px] font-black uppercase text-[#4E6E49]">Discord Аудит:</h6>
                                    <p className="text-[11px] opacity-70">Живое общение против ботов и бесконечных "gm".</p>
                                </div>
                                <div className="space-y-1">
                                    <h6 className="text-[10px] font-black uppercase text-[#4E6E49]">Roadmap:</h6>
                                    <p className="text-[11px] opacity-70">Конкретика без фантазий про метавселенные завтра.</p>
                                </div>
                            </div>
                        </div>
                    </StrategyStep>

                    <StrategyStep
                        number={3}
                        title="Минт и Подготовка"
                        icon={<Wallet className="w-5 h-5" />}
                        isOpen={openStep === 3}
                        onToggle={() => toggleStep(3)}
                    >
                        <div className="space-y-4">
                            <div className={`p-4 rounded-xl border-l-4 border-[#4E6E49] ${theme === 'dark' ? 'bg-[#151a21]' : 'bg-gray-50'}`}>
                                <h6 className="text-xs font-bold uppercase text-[#4E6E49] mb-2">Техника безопасности:</h6>
                                <ul className="text-xs space-y-2">
                                    <li>🛡️ Используйте отдельный чистый кошелёк (MetaMask).</li>
                                    <li>🔗 Ссылки только из ОФИЦИАЛЬНОГО Discord проекта.</li>
                                    <li>🔍 Проверяйте адрес контракта на Etherscan.</li>
                                </ul>
                            </div>
                        </div>
                    </StrategyStep>

                    <StrategyStep
                        number={4}
                        title="Продажа (Flip Mode)"
                        icon={<Coins className="w-5 h-5" />}
                        isOpen={openStep === 4}
                        onToggle={() => toggleStep(4)}
                        badge="Final Call"
                    >
                        <div className="space-y-4 text-sm">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-[#4E6E49]/10 border border-[#4E6E49]/20">
                                    <h6 className="text-[10px] font-black uppercase text-[#4E6E49] mb-1">Тайминг:</h6>
                                    <p className="font-bold">Первые 24–72 часа</p>
                                </div>
                                <div className="p-4 rounded-xl bg-[#4E6E49]/10 border border-[#4E6E49]/20">
                                    <h6 className="text-[10px] font-black uppercase text-[#4E6E49] mb-1">Цель:</h6>
                                    <p className="font-bold">1.3–2x от минта</p>
                                </div>
                            </div>
                            <p className="text-xs opacity-70 pt-2 border-t border-white/5">
                                Как продавать: выставить NFT по флору или на 1–3% ниже, чтобы выйти первым. <strong>Хайп быстро умирает — ликвидность исчезает первой.</strong>
                            </p>
                        </div>
                    </StrategyStep>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Diagnostic */}
                    <div className={`rounded-2xl p-6 border ${theme === 'dark' ? 'bg-[#151a21]/80 border-white/5 shadow-xl' : 'bg-white border-gray-100 shadow-sm'} space-y-4`}>
                        <div className="flex items-center gap-3">
                            <ShieldAlert className="w-6 h-6 text-[#4E6E49]" />
                            <h4 className={`font-black uppercase text-sm ${headingColor}`}>Золотые правила</h4>
                        </div>
                        <div className="space-y-4">
                            <p className="text-[10px] opacity-70 italic">Перед минтом задай себе вопросы:</p>
                            <ul className="text-[10px] space-y-2 opacity-80 list-disc list-inside">
                                <li>Купил бы я это на вторичке?</li>
                                <li>Есть ли покупатели кроме меня?</li>
                                <li>КТО будет следующим покупателем?</li>
                            </ul>
                        </div>
                    </div>

                    {/* Mistakes Box */}
                    <div className={`rounded-2xl p-6 border ${theme === 'dark' ? 'bg-rose-500/5 border-rose-500/20' : 'bg-rose-50 border-rose-500/20'} space-y-4`}>
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="w-6 h-6 text-rose-500" />
                            <h3 className={`text-lg font-black ${headingColor}`}>Ошибки</h3>
                        </div>
                        <ul className="text-xs space-y-2 opacity-80">
                            <li>🚩 Минт без плана выхода</li>
                            <li>🚩 Вера в «уникальный арт»</li>
                            <li>🚩 Жадность при 1.3x доходе</li>
                        </ul>
                    </div>

                    {/* Conceptual Formula */}
                    <div className={`p-6 rounded-2xl bg-[#4E6E49]/5 border border-[#4E6E49]/10 text-center space-y-2`}>
                        <div className="flex justify-center gap-4 py-2">
                            <div className="text-center">
                                <Zap className="w-5 h-5 text-[#4E6E49] mx-auto" />
                                <span className="text-[10px] font-bold">Скорость</span>
                            </div>
                            <div className="text-center">
                                <Droplets className="w-5 h-5 text-[#4E6E49] mx-auto" />
                                <span className="text-[10px] font-bold">Хайп</span>
                            </div>
                            <div className="text-center">
                                <Search className="w-5 h-5 text-[#4E6E49] mx-auto" />
                                <span className="text-[10px] font-bold">Анализ</span>
                            </div>
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
                    <h4 className={`text-xl font-black ${headingColor} uppercase mb-2`}>Итог стратегии</h4>
                    <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                        Mint → Flip — это не инвестиция, а высокорисковая спекуляция. Она требует постоянного мониторинга рынка, быстрых действий и отсутствия эмоциональной привязанности к картинкам.
                    </p>
                </div>
            </div>
        </div>
    )
}
