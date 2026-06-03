import React, { useState } from 'react'
import { useThemeStore } from '@/store/themeStore'
import {
    ExternalLink,
    Users,
    BarChart3,
    AlertCircle,
    LayoutList,
    TrendingUp,
    ChevronDown,
    ChevronUp,
    Calculator,
    Info
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

export const AVACopyTradingAOStrategy: React.FC = () => {
    const { theme } = useThemeStore()
    const [openStep, setOpenStep] = useState<number | null>(1) // Открываем первый шаг по умолчанию

    const toggleStep = (step: number) => {
        setOpenStep(openStep === step ? null : step)
    }

    const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
    const textColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-600'


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
                        <Users className={`w-12 h-12 ${theme === 'dark' ? 'text-[#4E6E49]' : 'text-[#4E6E49]'}`} />
                    </div>
                    <div className="flex-1 space-y-4">
                        <h2 className={`text-2xl md:text-3xl font-black ${headingColor}`}>AVA — Copy Trading AO</h2>
                        <p className={`text-lg leading-relaxed ${textColor}`}>
                            AVA — Copy Trading AO — это стратегия торговли мемкоинами на основе сигналов HUB от <a href="https://t.me/alpha_web3_bot?start=nbyO0C5R" target="_blank" rel="noopener noreferrer" className="${theme === 'dark' ? 'text-[#4E6E49]' : 'text-[#4E6E49]'} flex items-center gap-1 inline-flex">Alpha One <ExternalLink className="w-3 h-3" /></a>. Потенциал доходности — от 20% до практически неограниченных иксов, при условии строгого соблюдения регламента и риск-менеджмента.
                        </p>
                        <div className={`flex flex-wrap gap-4 pt-2`}>
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${theme === 'dark' ? 'bg-white/5 text-gray-400 border border-white/10' : 'bg-gray-100 text-gray-600 border border-gray-200'
                                }`}>
                                <Users className="w-3.5 h-3.5" />
                                COPY TRADING
                            </div>
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${theme === 'dark' ? 'bg-white/5 text-[#4E6E49] border border-white/10' : 'bg-gray-100 text-gray-600 border border-gray-200'
                                }`}>
                                <BarChart3 className="w-3.5 h-3.5" />
                                ALPHA ONE HUB
                            </div>
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${theme === 'dark' ? 'bg-white/10 text-[#4E6E49] border border-[#4E6E49]/20' : 'bg-[#4E6E49]/5 text-[#4E6E49] border border-[#4E6E49]/20'
                                }`}>
                                <Info className="w-3.5 h-3.5" />
                                RISK MANAGEMENT
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
                        <h3 className={`text-xl font-black ${headingColor}`}>Технический регламент</h3>
                    </div>

                    <StrategyStep
                        number={1}
                        title="Появление сигнала"
                        icon={<AlertCircle className="w-5 h-5" />}
                        isOpen={openStep === 1}
                        onToggle={() => toggleStep(1)}
                    >
                        <p>Появляется сигнал в HUB <a href="https://t.me/alpha_web3_bot?start=nbyO0C5R" target="_blank" rel="noopener noreferrer" className="${theme === 'dark' ? 'text-[#4E6E49]' : 'text-[#4E6E49]'} flex items-center gap-1 inline-flex">Alpha One <ExternalLink className="w-3 h-3" /></a></p>
                        <p className="mt-4">Моментально открываем:</p>
                        <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                            <li>график токена;</li>
                            <li>ленту сделок в <a href="https://gmgn.ai/r/WHA0hJCg" target="_blank" rel="noopener noreferrer" className="${theme === 'dark' ? 'text-[#4E6E49]' : 'text-[#4E6E49]'} flex items-center gap-1 inline-flex">GMGN <ExternalLink className="w-3 h-3" /></a>.</li>
                        </ul>
                    </StrategyStep>

                    <StrategyStep
                        number={2}
                        title="Быстрая оценка ситуации"
                        icon={<TrendingUp className="w-5 h-5" />}
                        isOpen={openStep === 2}
                        onToggle={() => toggleStep(2)}
                    >
                        <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-current text-[#4E6E49]"></span>
                                после сигнала в токен заходят массово;
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-current text-[#4E6E49]"></span>
                                в этот момент девелопер может сделать рагпул (резкий слив ликвидности).
                            </li>
                        </ul>
                        <h4 className={`text-lg font-bold ${headingColor} mt-4`}>Сценарии входа:</h4>

                        <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'} space-y-3`}>
                            <h5 className={`font-semibold ${headingColor}`}>1. График падает</h5>
                            <p className="text-sm">Если цена падает не из‑за рагпула, а из‑за фиксаций:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4 text-sm">
                                <li>Twitter / X проекта активен;</li>
                                <li>кошельки выглядят реальными;</li>
                                <li>нет аномальных сливов ликвидности.</li>
                            </ul>
                            <p className="text-sm font-bold mt-2">Действия:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4 text-sm">
                                <li>дожидаемся окончания падения;</li>
                                <li>следим, чтобы объёмы покупок превышали продажи;</li>
                                <li>появляются первые уверенные зелёные свечи;</li>
                                <li>в ленте — покупки от $50–100+;</li>
                                <li>в идеале дев уже полностью зафиксировался.</li>
                            </ul>
                            <p className="text-sm font-bold mt-2">После этого:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4 text-sm">
                                <li>ищем точку входа (в том числе по Fibonacci);</li>
                                <li>заходим аккуратно, без FOMO;</li>
                            </ul>
                        </div>

                        <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'} space-y-3 mt-4`}>
                            <h5 className={`font-semibold ${headingColor}`}>2. График растёт</h5>
                            <p className="text-sm">Если цена растёт сразу после сигнала, то важно убедиться, что рост не создаётся кошельками дева или команды.</p>
                            <p className="text-sm font-bold mt-2">Действия:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4 text-sm">
                                <li>выжидаем 5–10-15 секунд;</li>
                                <li>смотрим, как заходят другие трейдеры Alpha One;</li>
                                <li>подтверждаем, что объёмы — органические.</li>
                            </ul>
                            <p className="text-sm mt-2">Только после этого рассматриваем вход.</p>
                        </div>
                    </StrategyStep>

                    <StrategyStep
                        number={3}
                        title="Рекомендации по риск-менеджменту"
                        icon={<Calculator className="w-5 h-5" />}
                        isOpen={openStep === 3}
                        onToggle={() => toggleStep(3)}
                    >
                        <ul className="list-disc list-inside space-y-2 ml-4 text-sm ${textColor}">
                            <li>Не более 10–20% депозита на торговлю мемкоинами.</li>
                            <li>При росте 30–50%:
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li>выводим тело;</li>
                                    <li>далее работаем на «бесплатных» токенах.</li>
                                </ul>
                            </li>
                            <li>Не жадничать - лучше зафиксировать +50%, чем взять +10%, видя минуту назад +50%.</li>
                            <li>Не заходим спустя 2-5 минут после сигнала по такой стратегии, если не заметили сразу токен - используем уже для принятия решения о входе элементы других стратегий.</li>
                        </ul>
                    </StrategyStep>
                </div>

                {/* Sidebar: Important Notes & Summary */}
                <div className="space-y-6">
                    {/* Important Notes */}
                    <div className={`rounded-2xl p-6 border ${theme === 'dark' ? 'bg-[#151a21]/80 border-white/5' : 'bg-white border-gray-100'
                        } shadow-lg space-y-4`}>
                        <div className="flex items-center gap-3">
                            <AlertCircle className={`w-6 h-6 text-rose-500`} />
                            <h3 className={`text-lg font-black ${headingColor}`}>ВАЖНЫЕ ОГОВОРКИ</h3>
                        </div>

                        <div className={`space-y-4 ${textColor}`}>
                            <ul className="list-disc list-inside space-y-2 ml-4 text-sm">
                                <li>У <a href="https://t.me/alpha_web3_bot?start=nbyO0C5R" target="_blank" rel="noopener noreferrer" className="${theme === 'dark' ? 'text-[#4E6E49]' : 'text-[#4E6E49]'} flex items-center gap-1 inline-flex">Alpha One <ExternalLink className="w-3 h-3" /></a> есть функция автоповтора сделок («здесь и сейчас»). Мы её не используем.</li>
                                <li>Стратегия требует ручной проверки HUB-сигналов и самостоятельного входа в сделку при выполнении условий.</li>
                                <li>Коллеры <a href="https://t.me/alpha_web3_bot?start=nbyO0C5R" target="_blank" rel="noopener noreferrer" className="${theme === 'dark' ? 'text-[#4E6E49]' : 'text-[#4E6E49]'} flex items-center gap-1 inline-flex">Alpha One <ExternalLink className="w-3 h-3" /></a> не гарантируют 100% доходности, фиксированных иксов или отсутствия убытков.</li>
                                <li>Самостоятельный ресерч обязателен.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className={`rounded-2xl p-6 border ${theme === 'dark' ? 'bg-[#4E6E49]/5 border-[#4E6E49]/20' : 'bg-[#4E6E49]/5 border-[#4E6E49]/20'
                        } shadow-lg space-y-4`}>
                        <div className="flex items-center gap-3">
                            <TrendingUp className={`w-6 h-6 text-[#4E6E49]`} />
                            <h3 className={`text-lg font-black ${headingColor}`}>Итог</h3>
                        </div>
                        <div className={`space-y-1.5 ${textColor} text-sm`}>
                             <p className={textColor}>
                                AVA — Copy Trading AO — это не автотрейдинг и не «кнопка бабла». Это:
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-4 text-sm">
                                <li>быстрые решения;</li>
                                <li>холодная голова;</li>
                                <li>строгий регламент;</li>
                                <li>дисциплина в фиксации прибыли.</li>
                            </ul>
                            <p className="mt-4">
                                При правильном исполнении стратегия даёт редкую возможность участвовать в ранних движениях мемкоинов с опорой на опыт сильных трейдеров.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
