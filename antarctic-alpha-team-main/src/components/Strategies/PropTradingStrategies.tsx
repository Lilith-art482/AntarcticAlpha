import React, { useState } from 'react'
import { useThemeStore } from '@/store/themeStore'
import {
    HelpCircle,
    ChevronDown,
    Briefcase,
    TrendingUp,
    ShieldCheck,
    Target,
    Zap,
    Scale,
    CheckCircle2,
    AlertTriangle,
    Info,
    Wrench,
    Terminal,
    Brain,
    Bot,
    BookOpen,
    ArrowLeft,
    ArrowRight,
    LayoutGrid
} from 'lucide-react'
import { CategoryDropdownSelector } from './CategoryDropdownSelector'

interface FAQItemProps {
    question: string;
    answer: React.ReactNode;
    icon: React.ReactNode;
    isOpen: boolean;
    onClick: () => void;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, icon, isOpen, onClick }) => {
    const { theme } = useThemeStore();

    return (
        <div className={`rounded-2xl border transition-all duration-300 overflow-hidden ${isOpen
            ? (theme === 'dark' ? 'bg-[#4E6E49]/10 border-[#4E6E49]/30' : 'bg-[#4E6E49]/5 border-[#4E6E49]/20')
            : (theme === 'dark' ? 'bg-white/5 border-white/5 hover:border-white/10' : 'bg-white border-gray-100 hover:border-gray-200')
            }`}>
            <button
                onClick={onClick}
                className="w-full flex items-center justify-between p-5 text-left transition-colors"
            >
                <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-xl flex-shrink-0 transition-colors ${isOpen
                        ? (theme === 'dark' ? 'bg-[#4E6E49]/50 text-white' : 'bg-[#4E6E49]/50 text-white')
                        : (theme === 'dark' ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-500')
                        }`}>
                        {icon}
                    </div>
                    <span className={`font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {question}
                    </span>
                </div>
                <ChevronDown size={20} className={`text-[#4E6E49] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <div className={`p-5 pt-0 border-t border-white/5 leading-relaxed text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {answer}
                </div>
            </div>
        </div>
    );
};

export const PropTradingStrategies: React.FC = () => {
    const { theme } = useThemeStore();
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const [activeToolCategory, setActiveToolCategory] = useState<number | null>(null);

    const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900';

    const faqData = [
        {
            question: "Что такое проп-трейдинг?",
            icon: <Briefcase className="w-5 h-5" />,
            answer: (
                <div className="space-y-4">
                    <p>
                        <strong>Prop (proprietary) trading</strong> — это торговля финансовыми инструментами на капитал компании с разделением прибыли между трейдером и фирмой.
                    </p>
                    <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-[#4E6E49]/20' : 'bg-[#4E6E49]/5'} border border-[#4E6E49]/20`}>
                        <p className="font-medium text-[#4E6E49]">
                            Ты не инвестируешь свои деньги (кроме оплаты челленджа в онлайн-модели), а управляешь капиталом фирмы по заданным правилам риска.
                        </p>
                    </div>
                </div>
            )
        },
        {
            question: "Какими инструментами торгуют в пропе?",
            icon: <TrendingUp className="w-5 h-5" />,
            answer: (
                <div className="space-y-4">
                    <p>Чаще всего используются <strong>Фьючерсы</strong>, так как они популярны из-за ликвидности, прозрачного стакана и удобной маржи.</p>
                    <div className="flex flex-wrap gap-2">
                        {['Фьючерсы', 'Акции', 'Опционы', 'Криптовалюты'].map(tag => (
                            <span key={tag} className={`px-3 py-1 rounded-full text-xs font-bold ${theme === 'dark' ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            )
        },
        {
            question: "Нужно ли вкладывать свои деньги?",
            icon: <ShieldCheck className="w-5 h-5" />,
            answer: (
                <div className="space-y-3">
                    <p>Зависит от модели, мы в ARCA используем только <strong>онлайн-проп</strong>:</p>
                    <ul className="space-y-2 list-none">
                        <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                            <span>Ты платишь за прохождение отбора <strong>(challenge)</strong>.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                            <span>Если прошёл — получаешь funded-аккаунт.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                            <span>Собственные деньги не участвуют в торговле.</span>
                        </li>
                    </ul>
                </div>
            )
        },
        {
            question: "Что такое челлендж?",
            icon: <Target className="w-5 h-5" />,
            answer: (
                <div className="space-y-3">
                    <p>Это этап проверки, на котором ты должен доказать свою компетентность:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'} border border-white/5`}>
                            <p className="text-[10px] uppercase font-black text-gray-500 mb-1">Цель</p>
                            <p className="font-bold text-[#4E6E49]">Прибыль ~8–10%</p>
                        </div>
                        <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'} border border-white/5`}>
                            <p className="text-[10px] uppercase font-black text-gray-500 mb-1">Лимит</p>
                            <p className="font-bold text-red-500">No Max Drawdown</p>
                        </div>
                        <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'} border border-white/5`}>
                            <p className="text-[10px] uppercase font-black text-gray-500 mb-1">Контроль</p>
                            <p className="font-bold text-orange-500">Daily Loss Limit</p>
                        </div>
                    </div>
                </div>
            )
        },
        {
            question: "Что такое max drawdown?",
            icon: <Zap className="w-5 h-5" />,
            answer: (
                <div className="space-y-3">
                    <p><strong>Максимально допустимая просадка.</strong> Это порог, ниже которого общая стоимость счета (equity) не должна опускаться.</p>
                    <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-red-500/10' : 'bg-red-50'} border border-red-500/20`}>
                        <p className="text-sm">
                            <span className="font-bold text-red-400">Пример:</span> Счёт $100,000, Max DD = $5,000. Если equity падает до $95,000 — аккаунт закрывают.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-[#4E6E49] mt-2">
                        <Info className="w-4 h-4" />
                        Важно: бывает trailing drawdown — лимит может двигаться вслед за прибылью.
                    </div>
                </div>
            )
        },
        {
            question: "Что такое daily loss limit?",
            icon: <AlertTriangle className="w-5 h-5" />,
            answer: (
                <div className="space-y-3">
                    <p>Максимально допустимый убыток <strong>за один торговый день.</strong> Это главный предохранитель от тильта и агрессивной торговли.</p>
                    <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-orange-500/10 border-orange-500/20' : 'bg-orange-50 border-orange-200'}`}>
                        <p className="text-sm">
                            Daily limit = $2,000. Потерял больше в течение дня — аккаунт аннулируется мгновенно.
                        </p>
                    </div>
                </div>
            )
        },
        {
            question: "Как делится прибыль?",
            icon: <Scale className="w-5 h-5" />,
            answer: (
                <div className="space-y-4">
                    <p>Процент прибыли (Profit Split) обычно составляет:</p>
                    <div className="flex gap-4">
                        {['70 / 30', '80 / 20', '90 / 10'].map(split => (
                            <div key={split} className={`flex-1 p-3 text-center rounded-xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}>
                                <p className="text-xs text-gray-500 mb-1">Сплит</p>
                                <p className="font-black text-[#4E6E49]">{split}</p>
                            </div>
                        ))}
                    </div>
                    <p className="text-sm">Первый участник в сплите — это <strong>Трейдер</strong>. Например, при 80% сплите и доходе в $10,000, ты получаешь $8,000.</p>
                </div>
            )
        },
        {
            question: "Чем проп лучше торговли на свои деньги?",
            icon: <CheckCircle2 className="w-5 h-5" />,
            answer: (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-3">
                        <p className="text-xs font-black uppercase tracking-widest text-green-500">Плюсы:</p>
                        <ul className="space-y-2 text-sm">
                            <li>• Доступ к огромному капиталу</li>
                            <li>• Ограниченный личный риск</li>
                            <li>• Возможность масштабирования</li>
                        </ul>
                    </div>
                    <div className="space-y-3">
                        <p className="text-xs font-black uppercase tracking-widest text-red-500">Минусы:</p>
                        <ul className="space-y-2 text-sm">
                            <li>• Жёсткие лимиты</li>
                            <li>• Давление правил</li>
                            <li>• Риск «вылететь» за один день</li>
                        </ul>
                    </div>
                </div>
            )
        },
        {
            question: "Подходит ли проп новичку?",
            icon: <HelpCircle className="w-5 h-5" />,
            answer: (
                <div className="space-y-3">
                    <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Честный ответ: проп не заменяет обучение.</p>
                    <p>Вероятность «сгореть» крайне высока, если у тебя нет:</p>
                    <div className="flex flex-wrap gap-2">
                        {['Статистики', 'Истории сделок', 'Risk-Management'].map(item => (
                            <span key={item} className={`px-3 py-1 rounded-lg text-xs font-bold ${theme === 'dark' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            )
        },
        {
            question: "Когда проп имеет смысл?",
            icon: <CheckCircle2 className="w-5 h-5" />,
            answer: (
                <div className="space-y-3">
                    <p>Он рационален как инструмент <strong>масштабирования</strong>, если:</p>
                    <ul className="space-y-2 list-none text-sm">
                        <li className="flex gap-2"><span>—</span> У тебя уже есть рабочая стратегия</li>
                        <li className="flex gap-2"><span>—</span> Ты понимаешь свою среднюю просадку</li>
                        <li className="flex gap-2"><span>—</span> Ты можешь торговать системно (без эмоций)</li>
                    </ul>
                </div>
            )
        },
        {
            question: "Что будет, если я потрачу все деньги?",
            icon: <AlertTriangle className="w-5 h-5" />,
            answer: (
                <div className="space-y-4">
                    <p>В 99% онлайн-пропов <strong>технически невозможно</strong> «слить всё» благодаря защитным механизмам:</p>
                    <div className="space-y-2">
                        <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                            <p className="text-xs font-bold text-[#4E6E49] mb-1">1. Daily Loss Limit</p>
                            <p className="text-[11px]">Превысил лимит дня — аккаунт мгновенно блокируется.</p>
                        </div>
                        <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                            <p className="text-xs font-bold text-[#4E6E49] mb-1">2. Max Drawdown</p>
                            <p className="text-[11px]">Достиг лимита просадки — доступ к капиталу закрывается.</p>
                        </div>
                        <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                            <p className="text-xs font-bold text-[#4E6E49] mb-1">3. Автоликвидация</p>
                            <p className="text-[11px]">Позиции принудительно закроются системой до полного обнуления.</p>
                        </div>
                    </div>
                    <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-green-500/10 border-green-500/20' : 'bg-green-50 border-green-200'}`}>
                        <p className="text-xs font-bold text-green-500 leading-relaxed uppercase mb-2">Никаких долгов:</p>
                        <p className="text-[11px]">Проп — это не кредит. Максимум, что ты теряешь — это стоимость челленджа или подписки.</p>
                    </div>
                </div>
            )
        },
        {
            question: "Главный вывод",
            icon: <ShieldCheck className="w-5 h-5" />,
            answer: (
                <div className="space-y-4">
                    <p className={`font-bold italic ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Проп — это не способ «слить чужие деньги».
                    </p>
                    <p>Система спроектирована так, чтобы ограничить риски фирмы. Ты рискуешь только:</p>
                    <div className="grid grid-cols-3 gap-2">
                        <div className="text-center p-2 rounded-lg bg-[#4E6E49]/10 border border-[#4E6E49]/20">
                            <p className="text-[10px] uppercase font-black text-[#4E6E49]">Капитал</p>
                            <p className="text-[9px]">Доступом</p>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-[#4E6E49]/10 border border-[#4E6E49]/20">
                            <p className="text-[10px] uppercase font-black text-[#4E6E49]">Время</p>
                            <p className="text-[9px]">На челлендж</p>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-[#4E6E49]/10 border border-[#4E6E49]/20">
                            <p className="text-[10px] uppercase font-black text-[#4E6E49]">Оплата</p>
                            <p className="text-[9px]">Стоимостью</p>
                        </div>
                    </div>
                </div>
            )
        }
    ];

    const toolCategories = [
        {
            title: 'Проп-фирмы',
            description: 'Ведущие компании для получения funded-аккаунтов',
            icon: <Briefcase className="w-6 h-6 text-[#4E6E49]" />,
            bgColor: 'bg-[#4E6E49]/10',
            borderColor: 'border-[#4E6E49]/20',
            items: [
                {
                    name: 'HashHedge',
                    url: 'https://www.hashhedge.com/client/login?redirect=/index',
                    desc: 'Платформа для проп-трейдинга с возможностью получения funded-аккаунта и торговли на капитале компании.',
                    icon: <LayoutGrid className="w-5 h-5 text-[#4E6E49]" />
                }
            ]
        },
        {
            title: 'Демо-трейдинг и Тесты',
            description: 'Безопасная практика без реальных рисков',
            icon: <Terminal className="w-6 h-6 text-emerald-500" />,
            bgColor: 'bg-emerald-500/10',
            borderColor: 'border-emerald-500/20',
            items: [
                {
                    name: 'MEXC Demo Futures',
                    url: 'https://www.mexc.com',
                    desc: 'Торговля бессрочными контрактами в учебном режиме с виртуальными средствами.',
                    icon: <Terminal className="w-5 h-5 text-green-500" />
                },
                {
                    name: 'CryptoRobotics (Demo)',
                    url: 'https://cryptorobotics.ai',
                    desc: 'Универсальный терминал с демо-торговлей на Binance, Bybit, Bitget. Бесплатный демо-баланс ~3000 USDT.',
                    icon: <Bot className="w-5 h-5 text-purple-400" />
                }
            ]
        },
        {
            title: 'Аналитика и Данные',
            description: 'Инструменты для анализа рынка и трендов',
            icon: <Brain className="w-6 h-6 text-purple-500" />,
            bgColor: 'bg-purple-500/10',
            borderColor: 'border-purple-500/20',
            items: [
                {
                    name: 'CryptoRobotics',
                    url: 'https://cryptorobotics.ai',
                    desc: 'Терминал с ИИ-сигналами и ML-алгоритмами. Автоматическая торговля 24/7.',
                    icon: <Bot className="w-5 h-5 text-purple-500" />
                },
                {
                    name: 'TradingView',
                    url: 'https://tradingview.com',
                    desc: 'Мировой стандарт графиков. Подключение к фьючерсам через API, скрипты Pine Script и теханализ.',
                    icon: <TrendingUp className="w-5 h-5 text-[#4E6E49]" />
                },
                {
                    name: 'ForkLog',
                    url: 'https://forklog.com',
                    desc: 'Аналитическое издание. Новости и исследования для фундаментального понимания трендов.',
                    icon: <BookOpen className="w-5 h-5 text-orange-400" />
                },
                {
                    name: 'Coinglass',
                    url: 'https://www.coinglass.com/pro/futures/LiquidationHeatMap',
                    desc: 'Карта ликвидаций и анализ позиций. Визуализация ликвидаций на фьючерсах для понимания уровня стопов.',
                    icon: <LayoutGrid className="w-5 h-5 text-cyan-400" />
                }
            ]
        }
    ];

    return (
        <div className="space-y-16 pb-20 max-w-4xl mx-auto">
            <header className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#4E6E49]/10 border border-[#4E6E49]/20 text-[#4E6E49] text-[10px] font-black uppercase tracking-widest">
                    <Briefcase className="w-3 h-3" /> Prop Trading Section
                </div>
                <h2 className={`text-3xl md:text-4xl font-black tracking-tighter ${headingColor}`}>
                    Часто задаваемые вопросы
                </h2>
                <p className={`text-sm max-w-2xl mx-auto ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Разбираемся в особенностях проп-трейдинга, правилах управления капиталом и механике челленджа в ARCA.
                </p>
            </header>

            <div className="grid grid-cols-1 gap-4">
                {faqData.map((item, index) => (
                    <FAQItem
                        key={index}
                        question={item.question}
                        answer={item.answer}
                        icon={item.icon}
                        isOpen={openIndex === index}
                        onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    />
                ))}
            </div>

            {/* Tools Section */}
            <section className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#4E6E49]/10 rounded-xl border border-[#4E6E49]/20">
                            <Wrench className="w-6 h-6 text-[#4E6E49]" />
                        </div>
                        <div>
                            <h3 className={`text-xl font-black ${headingColor}`}>Инструменты</h3>
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                Полезные сервисы для проп-трейдинга
                            </p>
                        </div>
                    </div>

                    <CategoryDropdownSelector
                        categories={[
                            { id: 0, name: 'Проп-фирмы', icon: <Briefcase className="w-4 h-4" /> },
                            { id: 1, name: 'Демо-трейдинг и Тесты', icon: <Terminal className="w-4 h-4" /> },
                            { id: 2, name: 'Аналитика и Данные', icon: <Brain className="w-4 h-4" /> },
                        ]}
                        activeCategory={activeToolCategory}
                        setActiveCategory={setActiveToolCategory}
                        placeholder="Выберите категорию"
                    />
                </div>

                <div className="space-y-12">
                    {activeToolCategory === null ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {toolCategories.map((category, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveToolCategory(idx)}
                                    className="group p-6 rounded-3xl text-left transition-all duration-500 strategy-card strategy-card-compact"
                                >
                                    <div className={`p-4 rounded-2xl w-fit mb-4 transition-transform duration-500 group-hover:scale-110 strategy-card-icon ${category.bgColor} ${category.borderColor} border`}>
                                        {category.icon}
                                    </div>
                                    <h4 className={`text-lg font-black mb-2 ${headingColor}`}>{category.title}</h4>
                                    <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {category.description}
                                    </p>
                                    <div className="mt-4 flex items-center gap-2">
                                        <span className="relative overflow-hidden px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-[#4E6E49]/30 text-[#4E6E49] group-hover:border-[#4E6E49] group-hover:bg-[#4E6E49]/5 transition-all duration-300">
                                            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 bg-gradient-to-r from-transparent via-[#4E6E49]/10 to-transparent" />
                                            <span className="relative flex items-center gap-1.5">
                                                Смотреть инструменты
                                                <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" />
                                            </span>
                                        </span>
                                    </div>
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

                            {toolCategories
                                .filter((_c, i) => i === activeToolCategory)
                                .map((category, catIdx) => (
                                    <div key={catIdx} className="space-y-6">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-3 rounded-2xl transition-colors ${theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-gray-100 border border-gray-200'}`}>
                                                {category.icon}
                                            </div>
                                            <div>
                                                <h4 className={`text-xl font-bold ${headingColor}`}>{category.title}</h4>
                                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{category.description}</p>
                                            </div>
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
                                                    <div className="p-2.5 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform strategy-card-icon">
                                                        {tool.icon}
                                                    </div>

                                                    <h4 className={`font-bold mb-1 ${headingColor} flex items-center gap-2`}>
                                                        {tool.name}
                                                    </h4>
                                                    <p className="text-xs text-gray-500 leading-relaxed">
                                                        {tool.desc}
                                                    </p>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            </section>

            <footer className={`p-8 rounded-[2.5rem] text-center border ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-[#4E6E49]/10 rounded-2xl border border-[#4E6E49]/20">
                        <TrendingUp className="w-8 h-8 text-[#4E6E49]" />
                    </div>
                </div>
                <h3 className={`text-xl font-black mb-3 ${headingColor}`}>Готовы к масштабированию?</h3>
                <p className={`text-sm mb-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Если у вас есть стабильная стратегия и вы готовы работать с крупным капиталом, проп-трейдинг — это следующий логичный шаг.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <div className="px-6 py-3 rounded-xl bg-[#4E6E49]/50 text-white font-black hover:bg-[#4E6E49] transition-colors cursor-pointer text-sm">
                        Начать путь в Пропе
                    </div>
                    <div className={`px-6 py-3 rounded-xl font-bold transition-colors cursor-pointer text-sm border ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-100'
                        }`}>
                        Задать вопрос в саппорт
                    </div>
                </div>
            </footer>
        </div>
    )
};
