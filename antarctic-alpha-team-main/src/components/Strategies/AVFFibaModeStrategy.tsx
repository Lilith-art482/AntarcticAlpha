import React, { useState } from 'react'
import { useThemeStore } from '@/store/themeStore'
import {
    Activity,
    ChevronDown,
    ChevronUp,
    Target,
    BarChart3,
    Info,
    XCircle,
    Twitter,
    Layers,
    Brain,
    MousePointer2,
    ShieldAlert,
    TrendingUp,
    Zap,
    LayoutList
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

export const AVAFibaModeStrategy: React.FC = () => {
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
                        <Layers className={`w-12 h-12 text-[#4E6E49]`} />
                    </div>
                    <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-3">
                            <h2 className={`text-2xl md:text-3xl font-black ${headingColor}`}>ARCA - FIBA MODE</h2>
                            <span className="px-3 py-1 rounded-full bg-[#4E6E49]/20 text-[#4E6E49] text-[10px] font-black uppercase tracking-widest border border-[#4E6E49]/20">Counter-Trend</span>
                        </div>
                        <p className={`text-lg leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            Контртрендовая подстратегия для забора технического отката. Включается, когда импульс упущен, но актив жив и сохраняет интерес рынка.
                        </p>
                        <div className="p-3 rounded-xl bg-[#4E6E49]/5 border border-[#4E6E49]/10 inline-block text-xs font-bold italic opacity-80">
                            "FIBA — это работа на чужой фиксации. Зарабатываем не на росте, а на реакции рынка на коррекцию."
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Red Flags / When NOT to use */}
            <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-rose-500/5 border-rose-500/20' : 'bg-rose-50 border-rose-500/20'}`}>
                <div className="flex items-center gap-3 mb-4">
                    <ShieldAlert className="w-6 h-6 text-rose-500" />
                    <h3 className={`text-lg font-black ${headingColor}`}>FIBA ЗАПРЕЩЕНА, если:</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { title: "Мёртвый актив", desc: "Нет объема, график — тонкие линии, пустые свечи." },
                        { title: "Тишина в X", desc: "Twitter молчит, нет живого инфоповода и новых твитов." },
                        { title: "Одиночный памп", desc: "Движение было разовым импульсом без поддержки комьюнити." },
                        { title: "Агрессивный слив", desc: "Слив без откупов, Dev активно продает в коррекции." },
                        { title: "Слом структуры", desc: "Цена ушла ниже старта импульса → стратегия отменяется." },
                        { title: "Много отскоков от 0.7", desc: "Более одного-двух раза после миграции токен уже отскочил от 0.7." },
                        { title: "Сильный пролив после миграции", desc: "Если после миграции токен полился слишком сильно." }
                    ].map((item, i) => (
                        <div key={i} className="space-y-1">
                            <div className="flex items-center gap-2 text-xs text-rose-600 font-bold uppercase">
                                <XCircle className="w-3.5 h-3.5 shrink-0" />
                                {item.title}
                            </div>
                            <p className="text-[10px] opacity-70 ml-5 leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 3. Detailed Guide */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                        <LayoutList className={`w-6 h-6 ${theme === 'dark' ? 'text-[#4E6E49]' : 'text-[#4E6E49]'}`} />
                        <h3 className={`text-xl font-black ${headingColor}`}>Технический регламент</h3>
                    </div>

                    <StrategyStep
                        number={1}
                        title="Обязательные условия"
                        icon={<Activity className="w-5 h-5 text-[#4E6E49]" />}
                        isOpen={openStep === 1}
                        onToggle={() => toggleStep(1)}
                        badge="Checklist"
                    >
                        <div className="space-y-6">
                            <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                                <h5 className="text-xs font-bold uppercase mb-2 text-[#4E6E49] flex items-center gap-2">
                                    <Twitter className="w-4 h-4" /> Живой Twitter & Инфополе
                                </h5>
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    Должно быть актуальное инфо-сопровождение: продолжаются твиты, идут репосты, комьюнити обсуждает токен, появляются новые участники. Откат должен быть на фоне интереса, а не затухания.
                                </p>
                            </div>
                            <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                                <h5 className="text-xs font-bold uppercase mb-2 text-[#4E6E49] flex items-center gap-2">
                                    <BarChart3 className="w-4 h-4" /> Объём — ключевой фильтр
                                </h5>
                                <p className="text-xs text-gray-500 leading-relaxed mb-2">
                                    Перед построением Фибо: импульсный объём, видны свечи с телами, движение сформировано покупками.
                                </p>
                                <div className="p-2 bg-[#4E6E49]/5 rounded border border-[#4E6E49]/10 text-[10px] font-bold italic opacity-70">
                                    "Фибо имеет смысл только там, где есть ликвидность. Без объёма уровни — фикция."
                                </div>
                            </div>
                        </div>
                    </StrategyStep>

                    <StrategyStep
                        number={2}
                        title="Механика входа и Фибо"
                        icon={<MousePointer2 className="w-5 h-5 text-[#4E6E49]" />}
                        isOpen={openStep === 2}
                        onToggle={() => toggleStep(2)}
                        badge="Technical"
                    >
                        <div className="space-y-4 text-sm">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black opacity-50 uppercase">Таймфрейм</p>
                                    <p className="font-bold text-[#4E6E49]">15s / 1m</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black opacity-50 uppercase">Тип ордеров</p>
                                    <p className="font-bold text-[#4E6E49]">Только лимитки</p>
                                </div>
                            </div>
                            <p className="text-xs opacity-80 pt-2 border-t border-white/5">Построение: Сетка строится от <strong>лоя импульса</strong> к его <strong>хаю</strong>.</p>
                            <div className={`p-4 rounded-xl bg-[#4E6E49]/10 border border-[#4E6E49]/20`}>
                                <h6 className="text-xs font-bold uppercase mb-3">Рабочие уровни входа:</h6>
                                <div className="grid grid-cols-2 gap-4 text-center">
                                    <div>
                                        <p className="text-2xl font-black tracking-widest text-[#4E6E49]">0.618</p>
                                        <p className="text-[9px] opacity-60 uppercase font-black">Ликвидная зона 1</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-black tracking-widest text-[#4E6E49]">0.786</p>
                                        <p className="text-[9px] opacity-60 uppercase font-black">Ликвидная зона 2</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </StrategyStep>

                    <StrategyStep
                        number={3}
                        title="Условия подтверждения"
                        icon={<Target className="w-5 h-5 text-[#4E6E49]" />}
                        isOpen={openStep === 3}
                        onToggle={() => toggleStep(3)}
                    >
                        <div className={`p-6 rounded-xl border-l-4 border-[#4E6E49] ${theme === 'dark' ? 'bg-[#4E6E49]/5' : 'bg-[#4E6E49]/5'}`}>
                            <p className="text-sm font-bold text-[#4E6E49] uppercase mb-3">Сигнал — это реакция цены + объем</p>
                            <ul className="text-xs space-y-3">
                                <li className="flex items-start gap-3">
                                    <div className="p-1 rounded bg-[#4E6E49]/20 text-[#4E6E49] mt-0.5"><Zap className="w-3 h-3" /></div>
                                    <span>На уровне появляется объем на откуп.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="p-1 rounded bg-[#4E6E49]/20 text-[#4E6E49] mt-0.5"><Zap className="w-3 h-3" /></div>
                                    <span>Есть заметное замедление падения.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="p-1 rounded bg-[#4E6E49]/20 text-[#4E6E49] mt-0.5"><Zap className="w-3 h-3" /></div>
                                    <span>Нет агрессивного пролива маркетом.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="p-1 rounded bg-[#4E6E49]/20 text-[#4E6E49] mt-0.5"><Zap className="w-3 h-3" /></div>
                                    <span>Отсутствие DevSell в момент коррекции.</span>
                                </li>
                            </ul>
                        </div>
                    </StrategyStep>

                    <StrategyStep
                        number={4}
                        title="Логика сделки и Риски"
                        icon={<ShieldAlert className="w-5 h-5 text-[#4E6E49]" />}
                        isOpen={openStep === 4}
                        onToggle={() => toggleStep(4)}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h5 className="text-xs font-bold uppercase text-[#4E6E49] border-b border-[#4E6E49]/20 pb-1">Цель сделки</h5>
                                <p className="text-[11px] opacity-80 leading-relaxed">
                                    Целимся в технический отскок, а не в новый хай.
                                    <br />
                                    Фиксация: <strong className="text-green-500">20–40%</strong> без ожиданий продолжения тренда.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <h5 className="text-xs font-bold uppercase text-rose-500 border-b border-rose-500/20 pb-1">Риск-модель</h5>
                                <ul className="text-[11px] space-y-2 opacity-80">
                                    <li>• Меньший объём позиции, чем в ARCA FLIP</li>
                                    <li>• Более быстрый стоп-лосс</li>
                                    <li>• Никаких усреднений и "веры"</li>
                                </ul>
                            </div>
                        </div>
                    </StrategyStep>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Psychology */}
                    <div className={`rounded-3xl p-6 border ${theme === 'dark' ? 'bg-[#151a21] border-white/5 shadow-xl' : 'bg-white border-gray-100 shadow-sm'} space-y-4`}>
                        <div className="flex items-center gap-2">
                            <Brain className="w-6 h-6 text-[#4E6E49]" />
                            <h4 className={`font-black uppercase text-sm ${headingColor}`}>Эффективность</h4>
                        </div>
                        <p className="text-[10px] leading-relaxed text-gray-500">
                            Максимально эффективно при: сильном нарративе, хайповой теме, активном Twitter и нескольких волнах объема.
                        </p>
                        <div className="pt-2 border-t border-white/5">
                            <p className="text-[9px] font-black uppercase text-[#4E6E49] mb-1">Зона разворота</p>
                            <p className="text-[10px] opacity-70 italic">На 0.618 и 0.786 фиксируют ранние и добирают новые — это зоны локального разворота.</p>
                        </div>
                    </div>

                    {/* Conceptual Formula */}
                    <div className={`p-6 rounded-3xl bg-[#4E6E49]/5 border border-[#4E6E49]/10 text-center space-y-2`}>
                        <p className="text-[10px] font-black uppercase text-[#4E6E49]">Концептуальная формула:</p>
                        <p className="text-xs font-black tracking-tighter leading-tight">
                            ЖИЗНЬ В АКТИВЕ + ОБЪЁМ + СТРУКТУРА + УРОВЕНЬ = СДЕЛКА
                        </p>
                        <p className="text-[9px] opacity-60 underline decoration-[#4E6E49]/30">БЕЗ ЛЮБОГО ЭЛЕМЕНТА ВХОД ЗАПРЕЩЁН</p>
                    </div>

                    <div className={`p-6 rounded-3xl border border-dashed border-gray-300 flex flex-col items-center justify-center opacity-60`}>
                        <Info className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-[10px] font-black text-center uppercase tracking-widest">FIBA — это короткий технический трейд, а не долгосрочная идея.</p>
                    </div>
                </div>
            </div>

            {/* Final Conclusion */}
            <div className={`rounded-[2.5rem] p-8 border ${theme === 'dark' ? 'bg-[#4E6E49]/5 border-[#4E6E49]/10' : 'bg-[#4E6E49]/5 border-[#4E6E49]/5 shadow-sm'} flex flex-col items-center text-center space-y-4`}>
                <div className="p-4 rounded-2xl bg-[#4E6E49]/50 text-white shadow-lg shadow-[#4E6E49]/20">
                    <TrendingUp className="w-8 h-8" />
                </div>
                <div className="max-w-2xl">
                    <h4 className={`text-2xl font-black ${headingColor} uppercase mb-2`}>Финальное правило FIBA</h4>
                    <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Если ARCA FLIP — это работа на импульсе, то FIBA — это хладнокровная работа на неэффективности рынка в момент страха коррекции. Отработал отскок → забрал профит → вышел без оглядки.
                    </p>
                </div>
            </div>
        </div>
    )
}
