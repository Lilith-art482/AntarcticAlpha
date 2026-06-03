import React, { useState } from 'react';
import { useThemeStore } from '@/store/themeStore';
import {
    Briefcase,
    HelpCircle,
    ChevronDown,
    ChevronUp,
    TrendingUp,
    ShieldAlert,
    Wallet,
    Zap,
    AlertTriangle,
    CheckCircle,
    Target,
    ArrowDown,
    Maximize2,
    Minimize2,
} from 'lucide-react';

const PropTradingPage: React.FC = () => {
    const { theme } = useThemeStore();
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

    const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
    const textColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';

    const faqData = [
        {
            question: 'Что такое проп-трейдинг?',
            answer: 'Prop (proprietary) trading — это торговля финансовыми инструментами на капитал компании с разделением прибыли между трейдером и фирмой. Ты не инвестируешь свои деньги (кроме оплаты челленджа в онлайн-модели), а управляешь капиталом фирмы по заданным правилам риска.',
            icon: <Briefcase className="w-5 h-5" />,
        },
        {
            question: 'Какими инструментами торгуют в пропе?',
            answer: 'Чаще всего: Фьючерсы (чаще их, ибо фьючерсы популярны из-за ликвидности, прозрачного стакана и удобной маржи), а еще могут быть акции, опционы и криптовалюты',
            icon: <TrendingUp className="w-5 h-5" />,
        },
        {
            question: 'Нужно ли вкладывать свои деньги?',
            answer: 'Зависит от модели, мы же используем только онлайн-проп: Ты платишь за прохождение отбора (challenge). Если прошёл — получаешь funded-аккаунт. Собственные деньги не участвуют в торговле.',
            icon: <Wallet className="w-5 h-5" />,
        },
        {
            question: 'Что такое челлендж?',
            answer: 'Это этап проверки, где ты должен: достичь целевой прибыли (например 8–10%), не нарушить max drawdown, не превысить дневной лимит потерь. Только после этого дают funded-счёт.',
            icon: <Target className="w-5 h-5" />,
        },
        {
            question: 'Что такое max drawdown?',
            answer: 'Максимально допустимая просадка. Пример: Счёт $100,000, Max DD = $5,000. Если equity падает до $95,000 → аккаунт закрывают. Важно: бывает trailing drawdown — лимит двигается вслед за прибылью.',
            icon: <ArrowDown className="w-5 h-5" />,
        },
        {
            question: 'Что такое daily loss limit?',
            answer: 'Максимально допустимый убыток за один торговый день. Пример: Daily limit = $2,000, потерял больше → аккаунт аннулируется. Это главный ограничитель агрессивной торговли.',
            icon: <ShieldAlert className="w-5 h-5" />,
        },
        {
            question: 'Как делится прибыль?',
            answer: 'Обычно: 70/30, 80/20, 90/10 (в пользу трейдера). Пример: Ты заработал $10,000. Split 80% → тебе $8,000',
            icon: <TrendingUp className="w-5 h-5" />,
        },
        {
            question: 'Чем проп лучше торговли на свои деньги?',
            answer: 'Плюсы: Доступ к большему капиталу, Ограниченный личный риск, Возможность масштабирования. Минусы: Жёсткие лимиты, Давление правил, Можно «вылететь» за один плохой день',
            icon: <Zap className="w-5 h-5" />,
        },
        {
            question: 'Подходит ли проп новичку?',
            answer: 'Честный ответ: проп не заменяет обучение. Если у тебя: нет стабильной статистики, нет истории сделок, нет понимания risk-per-trade → вероятность «сгореть» очень высокая.',
            icon: <AlertTriangle className="w-5 h-5" />,
        },
        {
            question: 'Когда проп имеет смысл?',
            answer: 'Он рационален, если: У тебя уже есть рабочая стратегия, Ты понимаешь свою среднюю просадку, Ты можешь торговать системно. Проп — это инструмент масштабирования, а не обучение трейдингу.',
            icon: <CheckCircle className="w-5 h-5" />,
        },
        {
            question: 'Что будет, если я потрачу все деньги?',
            answer: 'Если ты «потратишь все деньги» на проп-счёте, то в 99% онлайн-пропов физически «потратить всё» невозможно. Есть три защитных механизма: Daily loss limit — превысил дневной лимит → аккаунт мгновенно блокируется. Max drawdown — достиг лимита просадки → счёт закрывается. Автоликвидация — позиции принудительно закроют до полного обнуления. Ты не уходишь в минус, потому что: это не кредит, у тебя нет маржинального обязательства перед фирмой, риск ограничен правилами системы. Максимум, что ты теряешь — стоимость челленджа / подписки. Когда может быть иначе? Исключения возможны только если: ты работаешь в оффлайн-пропе по трудовому контракту, ты нарушил регламент (оверрайд лимитов, обход риск-системы), есть отдельный договор о материальной ответственности. В стандартной онлайн-модели этого нет.',
            icon: <ShieldAlert className="w-5 h-5" />,
        },
    ];

    const handleFaqToggle = (index: number) => {
        setExpandedFaq(expandedFaq === index ? null : index);
    };

    const expandAll = () => {
        setExpandedFaq(-1);
    };

    const collapseAll = () => {
        setExpandedFaq(null);
    };

    return (
        <div className="space-y-16 pb-20">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="p-2 bg-[#4E6E49]/10 rounded-xl border border-[#4E6E49]/20">
                    <Briefcase className="w-6 h-6 text-[#4E6E49]" />
                </div>
                <div>
                    <h1 className={`text-2xl font-black ${headingColor}`}>Проп-трейдинг</h1>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Торговля на капитале компании
                    </p>
                </div>
            </div>

            {/* FAQ Section */}
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#4E6E49]/10 rounded-xl border border-[#4E6E49]/20">
                            <HelpCircle className="w-6 h-6 text-[#4E6E49]" />
                        </div>
                        <div>
                            <h3 className={`text-xl font-black ${headingColor}`}>FAQ</h3>
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                Часто задаваемые вопросы о проп-трейдинге
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={expandAll}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                theme === 'dark'
                                    ? 'bg-white/5 hover:bg-white/10 text-gray-300'
                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                            }`}
                        >
                            <Maximize2 className="w-4 h-4" />
                            Развернуть все
                        </button>
                        <button
                            onClick={collapseAll}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                theme === 'dark'
                                    ? 'bg-white/5 hover:bg-white/10 text-gray-300'
                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                            }`}
                        >
                            <Minimize2 className="w-4 h-4" />
                            Свернуть все
                        </button>
                    </div>
                </div>

                <div className="space-y-3">
                    {faqData.map((faq, index) => (
                        <div
                            key={index}
                            className={`rounded-2xl border transition-all duration-300 ${
                                expandedFaq === index || expandedFaq === -1
                                    ? 'bg-[#4E6E49]/5 border-[#4E6E49]/20'
                                    : theme === 'dark'
                                    ? 'bg-white/5 border-white/10'
                                    : 'bg-gray-50 border-gray-200'
                            }`}
                        >
                            <button
                                onClick={() => handleFaqToggle(index)}
                                className="w-full p-5 flex items-start justify-between gap-4 text-left"
                            >
                                <div className="flex items-start gap-4 flex-1">
                                    <div className={`p-2 rounded-xl transition-colors ${
                                        expandedFaq === index || expandedFaq === -1
                                            ? 'bg-[#4E6E49]/20 text-[#4E6E49]'
                                            : 'bg-[#4E6E49]/10 text-[#4E6E49]/60'
                                    }`}>
                                        {faq.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className={`font-bold ${headingColor} mb-1`}>
                                            {faq.question}
                                        </h4>
                                        {(expandedFaq === index || expandedFaq === -1) && (
                                            <p className={`text-sm leading-relaxed whitespace-pre-line ${textColor} animate-fade-in`}>
                                                {faq.answer}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className={`flex-shrink-0 transition-transform duration-300 ${
                                    expandedFaq === index || expandedFaq === -1 ? 'rotate-180' : ''
                                }`}>
                                    {expandedFaq === index || expandedFaq === -1 ? (
                                        <ChevronUp className="w-5 h-5 text-[#4E6E49]" />
                                    ) : (
                                        <ChevronDown className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                                    )}
                                </div>
                            </button>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default PropTradingPage;
