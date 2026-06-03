import React, { useState } from 'react'
import { useThemeStore } from '@/store/themeStore'
import {
    Target,
    TrendingUp,
    ChevronDown,
    ChevronUp,
    AlertCircle,
    Calculator,
    Search,
    BarChart3,
    CheckCircle2,
    XCircle,
    Lightbulb,
    Users,
    Brain,
    Clock,
    LineChart
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
                    <div className={`flex items-center justify-center w-10 h-10 rounded-xl font-black text-lg ${theme === 'dark' ? 'bg-rose-500/20 text-rose-400' : 'bg-rose-50 text-rose-600'
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

export const AVAValueBettingStrategy: React.FC = () => {
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
                    ? 'bg-gradient-to-br from-[#1a212a] to-[#0f1216] border-rose-500/20 shadow-2xl'
                    : 'bg-gradient-to-br from-white to-rose-50/30 border-rose-500/10 shadow-xl'
                }`}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 blur-3xl rounded-full -mr-20 -mt-20 pointer-events-none"></div>

                <div className="relative flex flex-col md:flex-row gap-8 items-start">
                    <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-rose-500/10' : 'bg-rose-500/5'}`}>
                        <Target className={`w-12 h-12 ${theme === 'dark' ? 'text-rose-400' : 'text-rose-500'}`} />
                    </div>
                    <div className="flex-1 space-y-4">
                        <h2 className={`text-2xl md:text-3xl font-black ${headingColor}`}>AVA — Value Betting</h2>
                        <p className={`text-lg leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            Стратегия поиска недооценённых событий на прогнозных рынках. Основана на выявлении расхождений между рыночной вероятностью события и вашей собственной обоснованной оценкой.
                        </p>
                        <div className={`flex flex-wrap gap-4 pt-2`}>
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${theme === 'dark' ? 'bg-white/5 text-gray-400 border border-white/10' : 'bg-gray-100 text-gray-600 border border-gray-200'
                                }`}>
                                <TrendingUp className="w-3.5 h-3.5" />
                                PROBABILITY ANALYSIS
                            </div>
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${theme === 'dark' ? 'bg-white/5 text-gray-400 border border-white/10' : 'bg-gray-100 text-gray-600 border border-gray-200'
                                }`}>
                                <Brain className="w-3.5 h-3.5" />
                                DEEP RESEARCH
                            </div>
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${theme === 'dark' ? 'bg-white/10 text-rose-400 border border-rose-500/20' : 'bg-rose-50 text-rose-600 border border-rose-200'
                                }`}>
                                <Target className="w-3.5 h-3.5" />
                                MARKET INEFFICIENCY
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Key Principle */}
            <div className={`rounded-2xl p-6 border-l-8 ${theme === 'dark' ? 'bg-rose-500/5 border-rose-500/50' : 'bg-rose-50 border-rose-500/30'
                }`}>
                <div className="flex gap-4 items-start">
                    <Lightbulb className="w-8 h-8 text-rose-500 shrink-0" />
                    <div className="space-y-2">
                        <h4 className={`text-lg font-black ${headingColor}`}>Ключевой принцип</h4>
                        <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            Вы зарабатываете не на исходе события, а на ошибке рынка в оценке вероятности. Если рынок оценивает событие в 40%, а вы на основе ресёрча считаете, что реальная вероятность 70% — событие положительное, даже если в итоге оно не произойдёт.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Steps */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                        <BarChart3 className={`w-6 h-6 ${theme === 'dark' ? 'text-rose-400' : 'text-rose-500'}`} />
                        <h3 className={`text-xl font-black ${headingColor}`}>Как применять стратегию</h3>
                    </div>

                    <StrategyStep
                        number={1}
                        title="Выбор рынка"
                        icon={<Search className="w-5 h-5" />}
                        isOpen={openStep === 1}
                        onToggle={() => toggleStep(1)}
                    >
                        <p>Критерии отбора подходящего рынка для анализа:</p>
                        <ul className="space-y-2 list-disc list-inside text-sm pl-2">
                            <li><strong>Чётко сформулированное условие</strong> — без двусмысленности</li>
                            <li><strong>Достаточная ликвидность</strong> — возможность войти и выйти</li>
                            <li><strong>Понятный таймфрейм</strong> — известная дата разрешения</li>
                            <li><strong>Доступность данных</strong> — возможность провести анализ</li>
                        </ul>
                        <div className={`mt-4 p-4 rounded-xl border-l-4 ${theme === 'dark' ? 'bg-rose-500/5 border-rose-500/50' : 'bg-rose-50 border-rose-500/30'}`}>
                            <p className="text-sm">
                                <strong>Подходящие категории:</strong> кино и медиа, политика, макроэкономика, технологии и продукты, долгосрочные спортивные маркеты
                            </p>
                        </div>
                    </StrategyStep>

                    <StrategyStep
                        number={2}
                        title="Рыночная оценка"
                        icon={<Calculator className="w-5 h-5" />}
                        isOpen={openStep === 2}
                        onToggle={() => toggleStep(2)}
                    >
                        <p>Фиксация текущей рыночной оценки вероятности:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                            <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Цена YES</p>
                                <p className={`text-lg font-black ${headingColor}`}>$0.40 = 40%</p>
                                <p className="text-xs text-gray-500 mt-1">Рынок считает вероятность ≈ 40%</p>
                            </div>
                            <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Цена NO</p>
                                <p className={`text-lg font-black ${headingColor}`}>$0.60 = 60%</p>
                                <p className="text-xs text-gray-500 mt-1">Вероятность «не случится» ≈ 60%</p>
                            </div>
                        </div>
                        <p className="text-sm mt-4 italic">
                            Цена напрямую отражает коллективное мнение участников о вероятности события.
                        </p>
                    </StrategyStep>

                    <StrategyStep
                        number={3}
                        title="Собственный ресёрч"
                        icon={<Brain className="w-5 h-5" />}
                        isOpen={openStep === 3}
                        onToggle={() => toggleStep(3)}
                    >
                        <p>Глубокий анализ для формирования независимой оценки:</p>
                        <div className="space-y-3 mt-4">
                            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                <h4 className="font-bold text-sm mb-2">📊 Исторические данные</h4>
                                <p className="text-xs text-gray-500">Анализ прошлых аналогичных событий и их исходов</p>
                            </div>
                            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                <h4 className="font-bold text-sm mb-2">🔍 Аналоги</h4>
                                <p className="text-xs text-gray-500">Поиск похожих ситуаций и паттернов</p>
                            </div>
                            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                <h4 className="font-bold text-sm mb-2">⚙️ Фундаментальные факторы</h4>
                                <p className="text-xs text-gray-500">Объективные данные, влияющие на исход</p>
                            </div>
                            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                <h4 className="font-bold text-sm mb-2">🌍 Контекст</h4>
                                <p className="text-xs text-gray-500">Время, среда, стимулы участников</p>
                            </div>
                        </div>
                    </StrategyStep>

                    <StrategyStep
                        number={4}
                        title="Формирование своей вероятности"
                        icon={<LineChart className="w-5 h-5" />}
                        isOpen={openStep === 4}
                        onToggle={() => toggleStep(4)}
                    >
                        <p>Создание аргументированной оценки на основе анализа:</p>
                        <div className={`mt-4 p-4 rounded-xl border ${theme === 'dark' ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-emerald-50 border-emerald-500/20'}`}>
                            <p className="text-sm font-bold mb-2">✅ Правильный подход:</p>
                            <ul className="space-y-1 text-xs text-gray-500">
                                <li>• Аргументированная оценка с обоснованием</li>
                                <li>• Лучше диапазон (60-75%), чем точка (67%)</li>
                                <li>• Учёт альтернативных сценариев</li>
                                <li>• Документирование логики</li>
                            </ul>
                        </div>
                        <div className={`mt-3 p-4 rounded-xl border ${theme === 'dark' ? 'bg-rose-500/5 border-rose-500/20' : 'bg-rose-50 border-rose-500/20'}`}>
                            <p className="text-sm font-bold mb-2">❌ Неправильный подход:</p>
                            <ul className="space-y-1 text-xs text-gray-500">
                                <li>• «Мне кажется» без расчёта</li>
                                <li>• Оценка на основе одного источника</li>
                                <li>• Игнорирование контраргументов</li>
                                <li>• Путаница между верой и математикой</li>
                            </ul>
                        </div>
                    </StrategyStep>

                    <StrategyStep
                        number={5}
                        title="Сравнение и принятие решения"
                        icon={<Target className="w-5 h-5" />}
                        isOpen={openStep === 5}
                        onToggle={() => toggleStep(5)}
                    >
                        <p>Определение наличия value и принятие решения о входе:</p>
                        <div className="grid grid-cols-1 gap-4 mt-4">
                            <div className={`p-4 rounded-xl border-2 ${theme === 'dark' ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-emerald-50 border-emerald-500/30'}`}>
                                <div className="flex items-center gap-2 mb-2">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                    <p className="font-bold text-sm">Value найден</p>
                                </div>
                                <p className="text-xs text-gray-500">Ваша вероятность <strong>значимо выше</strong> рыночной → вход в позицию</p>
                                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-mono">
                                    Пример: Рынок 40%, ваша оценка 70% → +30% edge
                                </p>
                            </div>
                            <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                                <div className="flex items-center gap-2 mb-2">
                                    <XCircle className="w-5 h-5 text-gray-500" />
                                    <p className="font-bold text-sm">Value отсутствует</p>
                                </div>
                                <p className="text-xs text-gray-500">Разница мала или отсутствует → пропуск</p>
                                <p className="text-xs text-gray-500 mt-2 font-mono">
                                    Пример: Рынок 40%, ваша оценка 42% → недостаточно
                                </p>
                            </div>
                        </div>
                    </StrategyStep>

                    <StrategyStep
                        number={6}
                        title="Управление позицией"
                        icon={<Clock className="w-5 h-5" />}
                        isOpen={openStep === 6}
                        onToggle={() => toggleStep(6)}
                    >
                        <p>Два основных подхода к управлению позицией:</p>
                        <div className="space-y-3 mt-4">
                            <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                                <h4 className="font-bold text-sm mb-2">📈 Фиксация при сужении спреда</h4>
                                <p className="text-xs text-gray-500">
                                    Рынок «догоняет» вашу оценку → YES растёт с $0.40 до $0.65 → фиксация прибыли без ожидания разрешения
                                </p>
                            </div>
                            <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                                <h4 className="font-bold text-sm mb-2">🎯 Удержание до разрешения</h4>
                                <p className="text-xs text-gray-500">
                                    Держите позицию до финального исхода, если уверены в своём анализе и готовы к волатильности
                                </p>
                            </div>
                        </div>
                    </StrategyStep>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Why It Works */}
                    <div className={`rounded-2xl p-6 border ${theme === 'dark' ? 'bg-[#151a21]/80 border-white/5' : 'bg-white border-gray-100'
                        } shadow-lg space-y-4`}>
                        <div className="flex items-center gap-3">
                            <TrendingUp className={`w-6 h-6 text-rose-500`} />
                            <h3 className={`text-lg font-black ${headingColor}`}>Почему работает</h3>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Рынки не идеальны</p>
                                <ul className="space-y-1 text-xs text-gray-500">
                                    <li>• Реакция с запозданием</li>
                                    <li>• Эмоциональные решения</li>
                                    <li>• Копирование консенсуса</li>
                                    <li>• Недооценка данных</li>
                                </ul>
                            </div>

                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Неравенство экспертизы</p>
                                <p className="text-xs text-gray-500">
                                    Глубокий анализ и экспертиза в нише дают преимущество над поверхностным взглядом большинства
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Цена = вероятность</p>
                                <p className="text-xs text-gray-500">
                                    Математическая модель, где каждая ошибка рынка имеет стоимость
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Red Flags */}
                    <div className={`rounded-2xl p-6 border ${theme === 'dark' ? 'bg-rose-500/5 border-rose-500/20' : 'bg-rose-50 border-rose-500/20'
                        } shadow-lg space-y-4`}>
                        <div className="flex items-center gap-3">
                            <AlertCircle className={`w-6 h-6 text-rose-500`} />
                            <h3 className={`text-lg font-black ${headingColor}`}>Красные флаги</h3>
                        </div>
                        <div className={`space-y-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-xs`}>
                            <p className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
                                <span>Не можете объяснить, почему рынок ошибается</span>
                            </p>
                            <p className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
                                <span>Оценка на одном источнике</span>
                            </p>
                            <p className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
                                <span>«Мне кажется» вместо расчёта</span>
                            </p>
                            <p className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
                                <span>Высоколиквидный рынок уже учёл всю информацию</span>
                            </p>
                            <p className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
                                <span>Путаете веру в исход с математическим преимуществом</span>
                            </p>
                        </div>
                    </div>

                    {/* Who It's For */}
                    <div className={`rounded-2xl p-6 border ${theme === 'dark' ? 'bg-[#4E6E49]/5 border-[#4E6E49]/20' : 'bg-[#4E6E49]/5 border-[#4E6E49]/20'
                        } shadow-lg space-y-4`}>
                        <div className="flex items-center gap-3">
                            <Users className={`w-6 h-6 text-[#4E6E49]`} />
                            <h3 className={`text-lg font-black ${headingColor}`}>Кому подходит</h3>
                        </div>
                        <div className={`space-y-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-xs`}>
                            <p className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#4E6E49]/50"></span>
                                Аналитическое мышление
                            </p>
                            <p className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#4E6E49]/50"></span>
                                Работа с вероятностями
                            </p>
                            <p className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#4E6E49]/50"></span>
                                Готовность к ресёрчу
                            </p>
                            <p className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#4E6E49]/50"></span>
                                Восприятие рынка как модели
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Example Case */}
            <div className={`rounded-3xl p-8 border ${theme === 'dark'
                    ? 'bg-gradient-to-br from-[#1a212a] to-[#0f1216] border-[#4E6E49]/20'
                    : 'bg-gradient-to-br from-white to-[#4E6E49]/5 border-[#4E6E49]/10'
                } shadow-xl`}>
                <h3 className={`text-xl font-black ${headingColor} mb-4 flex items-center gap-3`}>
                    <Calculator className="w-6 h-6 text-[#4E6E49]" />
                    Практический пример
                </h3>
                <div className="space-y-4">
                    <div>
                        <p className="text-sm font-bold mb-2">📊 Рынок</p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            «Соберёт ли фильм Avatar более $450 млн до 31 января?»
                        </p>
                        <p className="text-xs text-gray-500 mt-1">YES торгуется по $0.40 → рыночная вероятность 40%</p>
                    </div>
                    
                    <div>
                        <p className="text-sm font-bold mb-2">🔍 Ваш анализ</p>
                        <ul className="space-y-1 text-xs text-gray-500">
                            <li>• Динамика сборов по неделям</li>
                            <li>• История релизов схожих франшиз</li>
                            <li>• Отзывы зрителей и критиков</li>
                            <li>• География проката и праздничный период</li>
                            <li>• Маркетинговая активность студии</li>
                        </ul>
                        <p className={`text-sm mt-3 font-bold ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>
                            Вывод: реальная вероятность ≈ 70%
                        </p>
                    </div>

                    <div>
                        <p className="text-sm font-bold mb-2">💰 Действие</p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            Покупка YES по $0.40 с математическим преимуществом +30%
                        </p>
                    </div>

                    <div>
                        <p className="text-sm font-bold mb-2">📈 Возможные сценарии</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                <p className="text-xs font-bold mb-1">Сценарий 1</p>
                                <p className="text-xs text-gray-500">Рынок догоняет вашу оценку → YES растёт до $0.65 → фиксация</p>
                            </div>
                            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                <p className="text-xs font-bold mb-1">Сценарий 2</p>
                                <p className="text-xs text-gray-500">Удержание до разрешения при уверенности в исходе</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Final Logic Footer */}
            <div className={`rounded-2xl p-6 border-l-8 ${theme === 'dark' ? 'bg-[#0b1015] border-rose-500/50' : 'bg-gray-50 border-rose-500/30'
                }`}>
                <div className="flex gap-4 items-start">
                    <Target className="w-8 h-8 text-rose-500 shrink-0" />
                    <div className="space-y-2">
                        <h4 className={`text-lg font-black ${headingColor}`}>Итоговая логика стратегии</h4>
                        <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            Value Betting — это не угадывание событий и не азартная игра. Это систематический поиск ситуаций, где ваш глубокий анализ выявляет расхождение между рыночной ценой и реальной вероятностью. Математическое преимущество реализуется через серию сделок, а не через отдельные ставки.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
