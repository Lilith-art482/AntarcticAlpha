import React, { useState, useEffect } from 'react';
import { useThemeStore } from '@/store/themeStore';
import {
    Code,
    HelpCircle,
    ChevronDown,
    ChevronUp,
    Lightbulb,
    Coins,
    Wrench,
    Database,
    ShieldAlert,
    TrendingUp,
    Users,
    Zap,
    Lock,
    ExternalLink,
    Copy,
    Check,
    Wallet,
    MessageSquare,
    Video,
    Send,
    Hash,
    FileText,
    AlertTriangle,
    Target,
    Sparkles,
    PieChart,
    GitBranch,
    ArrowRight,
} from 'lucide-react';
import { CategoryDropdownSelector } from '@/components/Strategies/CategoryDropdownSelector';

const MemcoinsDevingPage: React.FC = () => {
    const { theme } = useThemeStore();
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
    const [activeToolCategory, setActiveToolCategory] = useState<number | null>(null);
    const [copiedWallet, setCopiedWallet] = useState<string | null>(null);
    const [expandedArticle, setExpandedArticle] = useState<number | null>(null);
    const [walletsExpanded, setWalletsExpanded] = useState(true);
    const [faqExpanded, setFaqExpanded] = useState(true);

    // Load FAQ and wallet states from localStorage
    useEffect(() => {
        const savedFaq = localStorage.getItem('memcoins_dev_faq_expanded');
        const savedFaqExpanded = localStorage.getItem('memcoins_dev_faq_list_expanded');
        const savedWallets = localStorage.getItem('memcoins_dev_wallets_expanded');
        if (savedFaq) {
            setExpandedFaq(JSON.parse(savedFaq));
        }
        if (savedFaqExpanded !== null) {
            setFaqExpanded(JSON.parse(savedFaqExpanded));
        }
        if (savedWallets !== null) {
            setWalletsExpanded(JSON.parse(savedWallets));
        }
    }, []);

    // Save FAQ state to localStorage
    const handleFaqToggle = (index: number) => {
        const newValue = expandedFaq === index ? null : index;
        setExpandedFaq(newValue);
        localStorage.setItem('memcoins_dev_faq_expanded', JSON.stringify(newValue));
    };

    // Save FAQ list state to localStorage
    const handleFaqListToggle = () => {
        const newValue = !faqExpanded;
        setFaqExpanded(newValue);
        localStorage.setItem('memcoins_dev_faq_list_expanded', JSON.stringify(newValue));
    };

    // Save wallets state to localStorage
    const handleWalletsToggle = () => {
        const newValue = !walletsExpanded;
        setWalletsExpanded(newValue);
        localStorage.setItem('memcoins_dev_wallets_expanded', JSON.stringify(newValue));
    };

    const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
    const textColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';

    const copyToClipboard = async (wallet: string) => {
        try {
            await navigator.clipboard.writeText(wallet);
            setCopiedWallet(wallet);
            setTimeout(() => setCopiedWallet(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const faqData = [
        {
            question: 'Что такое мемкоин?',
            answer: 'Мемкоин — это криптотокен, чья ценность изначально строится на сообществе, вирусности и культурном нарративе, а не на фундаментальной технологической полезности.',
            icon: <Coins className="w-5 h-5" />,
        },
        {
            question: 'Кто такой дев (developer) в контексте мемкоина?',
            answer: 'Дев — это инициатор проекта, который разрабатывает или деплоит смарт-контракт, настраивает токеномику, запускает ликвидность, управляет первичным маркетингом и контролирует техническую инфраструктуру. В ранней фазе дев — это одновременно CTO, продакт и маркетолог.',
            icon: <Code className="w-5 h-5" />,
        },
        {
            question: 'На каких блокчейнах чаще всего создают мемкоины?',
            answer: 'Наиболее популярные сети: Ethereum — стандарт ERC-20, высокая ликвидность; Solana — низкие комиссии, быстрые транзакции; BNB Smart Chain — дешёвый газ, массовый ритейл. Выбор сети зависит от бюджета на газ, целевой аудитории и планируемой стратегии листинга.',
            icon: <Database className="w-5 h-5" />,
        },
        {
            question: 'Что такое токеномика мемкоина?',
            answer: 'Токеномика — это структура эмиссии и распределения токенов. Ключевые параметры: Total supply, процент дев-алокации, ликвидность (LP), налоги (buy/sell tax), механизмы сжигания (burn). Ошибки токеномики — основная причина потери доверия.',
            icon: <TrendingUp className="w-5 h-5" />,
        },
        {
            question: 'Что такое LP (Liquidity Pool)?',
            answer: 'LP — это пул ликвидности на DEX, обеспечивающий возможность торговли. Важно: LP может быть залочен (locked) или удалён (rug pull).',
            icon: <Database className="w-5 h-5" />,
        },
        {
            question: 'Что такое rug pull?',
            answer: 'Rug pull — это схема, при которой дев выводит ликвидность или продаёт свою долю, обрушивая цену. Типы: Liquidity rug, Dev wallet dump, Hidden mint exploit.',
            icon: <ShieldAlert className="w-5 h-5" />,
        },
        {
            question: 'Нужен ли аудит смарт-контракта?',
            answer: 'Для мемкоина — не обязателен, но повышает доверие.',
            icon: <ShieldAlert className="w-5 h-5" />,
        },
        {
            question: 'Что такое renounce ownership?',
            answer: 'Renounce — отказ от прав владельца контракта. После этого нельзя менять параметры и нельзя минтить токены (если функция отключена). Используется для демонстрации «честного запуска».',
            icon: <Lock className="w-5 h-5" />,
        },
        {
            question: 'Что важнее: продукт или комьюнити?',
            answer: 'Для мемкоина — комьюнити. Основные каналы: Telegram, X, Discord.',
            icon: <Users className="w-5 h-5" />,
        },
        {
            question: 'Какие основные фазы запуска мемкоина?',
            answer: 'Подготовка концепции, разработка и деплой контракта, создание LP, первичный маркетинг, листинг на агрегаторах (DexTools, DexScreener), работа с инфлюенсерами, поддержка ликвидности.',
            icon: <Zap className="w-5 h-5" />,
        },
        {
            question: 'Что такое fair launch?',
            answer: 'Fair launch — запуск без пресейла и без крупной дев-алокации. Все покупают на одинаковых условиях.',
            icon: <Lightbulb className="w-5 h-5" />,
        },
        {
            question: 'Сколько стоит запустить мемкоин?',
            answer: 'Зависит от сети: Ethereum: $500+, Solana: от $200+, BSC: $200+. Основные статьи расходов: газ, LP, маркетинг, боты / инструменты.',
            icon: <Coins className="w-5 h-5" />,
        },
        {
            question: 'Что убивает мемкоин?',
            answer: 'Отсутствие маркетинга, непрозрачная токеномика, слив дев-кошелька, отсутствие narrative, низкая ликвидность.',
            icon: <ShieldAlert className="w-5 h-5" />,
        },
        {
            question: 'Какие метрики важны после запуска?',
            answer: 'Volume, Liquidity depth, Holder count, Market cap, Distribution (топ-10 кошельков).',
            icon: <TrendingUp className="w-5 h-5" />,
        },
    ];

    const devWallets = [
        '7JZXALfy5FNrSM4y7UBGc8RbDgoMYSHj4KKQZnamWfHP',
        '6kkCpqnFzuvozZg9FcAXvQaBrqmzFiwtaKUZRrLBMLnW',
        'Bcs5kbnrih4BxNbU8aUTasvfmi5LkgkQXzWX7d1miLXp',
        '7ThvPtPijDcvuTN5EzQ1hipQWXSGzMtdHVboiNEHKFU7',
        '6xDpid1beBpmzaBKpd2L4Y44CJAo132cjc6xtzFCKnL1',
        'FAuDxKsZ45Y2WhEaW3KgnRmxBy69PuYCtqH7gQoExGvr',
        '59r6t97Wu4YBqUbcdyMRTvxJiD7bkfmuEifWPptFbY4U',
        'ALJ4P5QNyHeLEjpKGmA1eUfJHSEGQMjY8HLnDkSgjczb',
        'DVMZBgS6sRFpfq3uwqj6JjH8nY1Tqa2Y1DD4wfiNm4Lz',
        'BcSpYSFzzqAz1fe3uoZ6UeRhJW5od8v7pfk68gbFwm4v',
        '8RrMaJXYwANd4zEskfPQuSYE35dTzaYtuwyKz3ewcZQx',
        'CfumDPwfYn6m3W6fyzCMhsYkS2Uxpeu1npxZPUasV5nX',
        'WnBVqVTaiJk5hNbcwbHiffRVnMdf1aaxNU5JkSpvGub',
        '4PG3gQ7ahqYKuteAtN3EuivWTQztWEEFk399SHRhXkB4',
        '3vDNo8jDPaG6q89k2A55wN7vGSSij1VDuo4E3ebezrTX',
        'CG8H7EthgPtvVR4aVeYJgjSRMhKYhGCRYzg8wJvTmWWe',
        '9VXuNqqqzniYYW3fRDeaCtUUtqWsEeWWn5umh3aF9h17',
        '9iLW5FRnZrnEtfri9BHJfcF9S2gnZtTF4bDi7ZKwybLx',
        'CthHCQx15DaLX8C8h3CUc7QGjP45fmVpbzcW2J7SZvr',
        'EFcGBtCmQ7QvB34pYaonopWf5ZJqHYBB5rAiRYm59G3f',
        'AYoscEPUim61K63n7HaUK6NSMhBtprknkCizxAiceB7c',
        'AQc5Xb5rZhRJhwCnuVukJRg32rrtoNBTRRdw29a8XJGG',
    ];

    const articles = [
        {
            title: 'Риски в девинге и почему он работает на тех, кто готов рисковать',
            description: 'Как соотношение риск/ревард работает на стороне дева и почему эксперименты — это стратегия безопасности',
            icon: <AlertTriangle className="w-5 h-5" />,
            content: (
                <div className="space-y-4">
                    <p>В бизнесе и инвестициях часто возникает страх экспериментов. Люди предпочитают оставаться в зоне комфорта, повторяя привычные шаги и стратегии. Но реальность такова: рынки постоянно меняются. Появляются новые подходы, идеи, форматы. И если не двигаться вперёд, вы рискуете остаться на месте и потерять понимание, куда развиваться дальше.</p>

                    <div className="p-4 rounded-xl bg-[#4E6E49]/5 border border-[#4E6E49]/10">
                        <h4 className="font-bold text-[#4E6E49] mb-2">Новые стратегии — ключ к росту</h4>
                        <p>Принятие риска не означает бездумное действие. Это про практику экспериментов и тестирование новых векторов развития. Опыт показывает, что именно через пробу нового формируются успешные стратегии. Без этого можно лишь наблюдать, как мир движется мимо.</p>
                    </div>

                    <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/10">
                        <h4 className="font-bold text-green-500 mb-2">Риск/ревард: почему он чаще на нашей стороне как девов</h4>
                        <p className="mb-2">Большинство людей пугается потери. Но важно смотреть на соотношение риска и потенциального вознаграждения:</p>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                            <li>Мы инвестируем на уровне маркет-капитализации, ниже которого цена практически не упадёт</li>
                            <li>Потенциальная потеря $20–$30 несопоставима с возможной прибылью $300 и более</li>
                        </ul>
                        <p className="mt-2">Это классический пример, когда риск минимален, а потенциальная отдача максимальна.</p>
                    </div>

                    <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/10">
                        <h4 className="font-bold text-purple-500 mb-2">Практика нового = стратегия безопасности</h4>
                        <p>Страх перед новыми идеями часто блокирует рост. На самом деле, регулярная практика новых инструментов, стратегий и подходов снижает долгосрочный риск. Чем больше вы тестируете, тем увереннее понимаете, что работает, а что нет.</p>
                        <p className="mt-2">Не бойтесь рисковать там, где они минимальны. Используйте изменения на рынке как возможность, а не угрозу. Эксперименты, смелые решения и новые векторы — это не игра на удачу, а стратегический инструмент роста.</p>
                    </div>
                </div>
            ),
        },
        {
            title: 'Как находить идеи для запусков и ловить тренды',
            description: 'Системный подход к поиску идей через соцсети и торговые терминалы',
            icon: <Target className="w-5 h-5" />,
            content: (
                <div className="space-y-4">
                    <p>Ответ прост: внимательно наблюдать за трендами и реакциями рынка — и реагировать быстрее остальных. Соц‑сети, лидеры мнений и торговые терминалы могут стать концентратом инсайтов.</p>

                    <div className="p-4 rounded-xl bg-[#4E6E49]/5 border border-[#4E6E49]/10">
                        <h4 className="font-bold text-[#4E6E49] mb-2">1. Соц‑сети как источник идей</h4>
                        <p className="mb-2">Twitter/X — концентрат трендов и реакций аудитории. Особенно полезно следить за:</p>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                            <li>популярными мем-инфлюенсерами, которые задают дискурс и проверяют реакции аудитории</li>
                            <li>комментариями под постами — там часто скрыта боль или запрос, который можно превратить в продукт</li>
                        </ul>
                        <div className="mt-3 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                            <p className="text-sm"><span className="font-bold">💡 Совет:</span> не нужно ориентироваться только на громкие имена вроде Илона Маска. Ценность в динамике обсуждений и реакции аудитории.</p>
                        </div>
                    </div>

                    <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/10">
                        <h4 className="font-bold text-green-500 mb-2">2. Использование торговых терминалов для ловли нарративов</h4>
                        <p className="mb-3">Торговые терминалы помогают видеть идею в моменте, на ранней стадии роста токена:</p>

                        <div className="space-y-3">
                            <div className="p-3 bg-white/5 rounded-lg">
                                <h5 className="font-bold mb-1 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-yellow-400" />
                                    GMGN
                                </h5>
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                    <li>Установите VOLUME в краткосрочном периоде, чтобы видеть токены, у которых нарратив «улетает» прямо в моменте</li>
                                    <li>Ищите токены с хорошим объемом и быстрым ростом маркет-капитализации (MC)</li>
                                </ul>
                                <p className="text-sm mt-2 text-gray-400">Практика: берите токены из первой колонки GMGN, которые быстро достигли 10–20 MC. Это часто маркер актуальной идеи.</p>
                            </div>

                            <div className="p-3 bg-white/5 rounded-lg">
                                <h5 className="font-bold mb-1 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-cyan-400" />
                                    Photon
                                </h5>
                                <p className="text-sm">Аналогично, смотрите токены с быстрым ростом объема и MC. Это позволяет отслеживать тренды, пока они находятся в моменте максимального внимания.</p>
                            </div>
                        </div>

                        <p className="mt-3 text-sm"><span className="font-bold text-green-400">Главный принцип:</span> чем быстрее объем и MC растут, тем выше вероятность, что идея трендовая и может быть реализована в продукте или запуске.</p>
                    </div>

                    <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/10">
                        <h4 className="font-bold text-purple-500 mb-2">3. Практическая система поиска идей</h4>
                        <p className="mb-2">Шаги для работы с социальными сетями и терминалами:</p>
                        <ol className="list-decimal list-inside space-y-2 text-sm">
                            <li><span className="font-bold">Мониторинг трендов</span> — Twitter/X: посты + комментарии мем‑флюенсеров. Фильтруйте по вовлеченности и оригинальности идеи</li>
                            <li><span className="font-bold">Анализ рынка в терминалах</span> — GMGN и Photon: смотрите краткосрочные объемы, рост MC. Отбирайте токены с хорошим объемом и быстрым ростом — это сигнал тренда</li>
                            <li><span className="font-bold">Формулируйте гипотезу</span> — на базе инсайта из соцсетей или терминала формируйте мини‑гипотезу для запуска: «Если токен/идея привлекает внимание и быстро растет, возможно аудитория будет интересоваться продуктом X»</li>
                            <li><span className="font-bold">Тестирование в реальном времени</span> — мини‑прототип, лендинг, опрос или короткая кампания. Цель — проверить реакцию рынка и аудитории на идею как можно раньше</li>
                        </ol>
                    </div>

                    <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
                        <h4 className="font-bold text-[#4E6E49] mb-2">Вывод</h4>
                        <p>Сочетание соцсетей + терминалов позволяет:</p>
                        <ul className="list-disc list-inside space-y-1 text-sm mt-2">
                            <li>фиксировать идеи на раннем этапе</li>
                            <li>видеть тренды «в моменте»</li>
                            <li>минимизировать риск, проверяя гипотезу на реальных данных</li>
                        </ul>
                        <p className="mt-2">Это превращает вашу стратегию поиска идей в структурированный процесс, а не в случайное угадывание.</p>
                    </div>

                    <div className="p-4 rounded-xl bg-pink-500/5 border border-pink-500/10">
                        <h4 className="font-bold text-pink-500 mb-2 flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            Гем: список из 50+ инфлов
                        </h4>
                        <p className="text-sm mb-2">Список из 50+ инфлов в мем‑трейдинге, которые задают тренды и нарративы:</p>
                        <a
                            href="https://x.com/i/lists/1962599618333810958"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-[#4E6E49] hover:text-[#4E6E49] font-bold text-sm"
                        >
                            Открыть список <ExternalLink className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            ),
        },
        {
            title: 'Как правильно распределять эмиссию и откуп монеты',
            description: 'Баланс между ажиотажем, безопасностью и управлением спросом',
            icon: <PieChart className="w-5 h-5" />,
            content: (
                <div className="space-y-4">
                    <p>Распределение эмиссии между кошельками напрямую влияет на будущую динамику монеты. Неправильная схема может привести к отсутствию ажиотажа и слабому интересу со стороны покупателей, включая ботов.</p>

                    <div className="p-4 rounded-xl bg-[#4E6E49]/5 border border-[#4E6E49]/10">
                        <h4 className="font-bold text-[#4E6E49] mb-2">Основные принципы</h4>

                        <div className="mb-4">
                            <h5 className="font-bold mb-2">Объём откупа</h5>
                            <p className="mb-2">Для небольшого запуска оптимально выкупать <span className="font-bold text-[#4E6E49]">20–25%</span> всего саплая.</p>
                            <p>Это создаёт достаточный спрос и привлекает внимание рынка.</p>
                        </div>

                        <div className="mb-4">
                            <h5 className="font-bold mb-2">Методика частичного бандла</h5>
                            <p className="mb-2">Не выкупать всю долю сразу, а распределять:</p>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                                <li>Первая половина — сразу на выбранные кошельки</li>
                                <li>Вторая половина — постепенно, в течение нескольких минут</li>
                            </ul>
                            <div className="mt-3 p-3 bg-white/5 rounded-lg">
                                <p className="text-sm"><span className="font-bold text-green-400">Почему это работает:</span> этот подход снижает влияние снайперов. Даже если снайперы купят часть, боты и крупные закупки после бандла создадут дополнительный спрос, компенсируя их влияние.</p>
                            </div>
                        </div>

                        <div>
                            <h5 className="font-bold mb-2">Распределение по кошелькам</h5>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                                <li>Кошелёк разработчика: <span className="font-bold text-yellow-400">2–4%</span> от саплая (не больше 4%, в идеале — 0)</li>
                                <li>Остальной саплай: распределить на <span className="font-bold text-green-400">15–20</span> разных кошельков</li>
                            </ul>
                            <p className="mt-2">Такая схема создаёт эффект «естественного спроса» и равномерного движения цены.</p>
                        </div>
                    </div>

                    <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
                        <h4 className="font-bold text-[#4E6E49] mb-2">Тактика при бандлах и ботах</h4>
                        <ul className="list-disc list-inside space-y-2 text-sm">
                            <li>Не пытайтесь бороться со снайперами — при грамотном распределении их влияние минимально</li>
                            <li>Боты, которые реагируют на крупные закупки, помогут «разогреть» монету, создавая дополнительный интерес</li>
                        </ul>
                    </div>

                    <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/10">
                        <h4 className="font-bold text-purple-500 mb-2">Итог</h4>
                        <p>Правильное распределение эмиссии и откупа — это баланс между ажиотажем, безопасностью и управлением спросом.</p>

                        <div className="mt-3 space-y-2">
                            <div className="flex items-start gap-2">
                                <span className="text-red-400">✗</span>
                                <span className="text-sm">Слишком мало откупа → монета остаётся незамеченной</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-red-400">✗</span>
                                <span className="text-sm">Слишком много на одном кошельке → повышенный риск манипуляций и снайпинга</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-green-400">✓</span>
                                <span className="text-sm font-bold">Разбивка на бандлы и распределение по кошелькам → оптимальный вариант для создания активности и долгосрочного интереса</span>
                            </div>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: 'Что такое бета‑токенов и «клонов»: как работать с производными нарративами',
            description: 'Стратегия перехвата вторичной волны ликвидности',
            icon: <GitBranch className="w-5 h-5" />,
            content: (
                <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-[#4E6E49]/5 border border-[#4E6E49]/10">
                        <h4 className="font-bold text-[#4E6E49] mb-2">1. Принцип парных нарративов</h4>
                        <p className="mb-2">На рынке регулярно срабатывает модель, которую условно можно назвать «каждой твари по паре». Если появляется мощный инфоповод вокруг одного персонажа или идеи, рынок почти автоматически начинает искать:</p>
                        <ul className="list-disc list-inside space-y-1 text-sm mb-3">
                            <li>пару</li>
                            <li>альтернативу</li>
                            <li>отражение</li>
                            <li>противоположность</li>
                        </ul>
                        <p className="text-sm"><span className="font-bold">Пример медийной пары:</span> Donald Trump и Melania Trump</p>
                        <p className="text-sm mt-2">Когда запускается «альфа‑токен» (основной персонаж), внимание и ликвидность концентрируются вокруг него. В этот момент возникает окно возможностей для бета‑токена — связанной сущности.</p>
                    </div>

                    <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/10">
                        <h4 className="font-bold text-green-500 mb-2">2. Что такое альфа и бета в контексте запусков</h4>
                        <div className="space-y-3">
                            <div>
                                <h5 className="font-bold mb-1">Альфа‑токен</h5>
                                <p className="text-sm">Главный инфоповод, вокруг которого формируется ажиотаж.</p>
                            </div>
                            <div>
                                <h5 className="font-bold mb-1">Бета‑токен</h5>
                                <p className="text-sm mb-2">Производная идея, связанная с альфой через:</p>
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                    <li>семью (жена, дети, родственники)</li>
                                    <li>идеологическую противоположность</li>
                                    <li>животное/атрибут</li>
                                    <li>альтернативную версию (цвет, мем‑вариация)</li>
                                    <li>«зеркало» персонажа</li>
                                </ul>
                            </div>
                        </div>
                        <div className="mt-3 p-3 bg-white/5 rounded-lg">
                            <p className="text-sm"><span className="font-bold text-green-400">Классический сценарий:</span> Альфа запускается → Все фокусируются на его откупе → Ликвидность и внимание растут → Вы запускаете связанную бета‑идею, пока внимание уже разогрето.</p>
                        </div>
                    </div>

                    <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/10">
                        <h4 className="font-bold text-purple-500 mb-2">3. Почему это работает</h4>

                        <div className="mb-3">
                            <h5 className="font-bold text-purple-400 mb-1">3.1. Эффект бесплатного маркетинга</h5>
                            <p className="text-sm">Вы используете уже существующий инфопоток. Альфа прогревает рынок — бета собирает вторичную волну.</p>
                        </div>

                        <div className="mb-3">
                            <h5 className="font-bold text-purple-400 mb-1">3.2. Психология толпы</h5>
                            <p className="text-sm">Когда участники видят сильный нарратив, они:</p>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                                <li>начинают искать «следующий икс»</li>
                                <li>боятся пропустить второй шанс</li>
                                <li>переходят в режим FOMO</li>
                            </ul>
                        </div>

                        <div>
                            <h5 className="font-bold text-purple-400 mb-1">3.3. Скорость как ключевой фактор</h5>
                            <p className="text-sm">В этой стратегии критично быть первым. Кто первый запускает валидную бета‑связку — тот забирает основной поток ликвидности. На быстрых сетях вроде Solana преимущество получает именно скорость реакции.</p>
                        </div>
                    </div>

                    <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
                        <h4 className="font-bold text-[#4E6E49] mb-2">4. Расширение принципа (не только «муж и жена»)</h4>
                        <p className="mb-2">Не ограничивайтесь очевидными парами. Работают:</p>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                            <li>Родственные связи (дети, родственники)</li>
                            <li>Политические оппоненты (например, вариации вокруг Kamala Harris)</li>
                            <li>Животные пары (собака/кот)</li>
                            <li>Цветовые или идеологические вариации</li>
                            <li>Мем‑альтернативы одного и того же образа</li>
                        </ul>
                        <div className="mt-3 p-3 bg-white/5 rounded-lg">
                            <p className="text-sm"><span className="font-bold text-amber-400">Главное:</span> логическая связка, которую рынок понимает за 1–2 секунды. Если аудитории нужно объяснять — вы опоздали.</p>
                        </div>
                    </div>

                    <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/10">
                        <h4 className="font-bold text-cyan-500 mb-2">5. Тактика запуска беты</h4>

                        <div className="mb-3">
                            <h5 className="font-bold text-cyan-400 mb-1">5.1. Тайминг</h5>
                            <p className="text-sm mb-2">Не запускайте слишком рано — рынок ещё холодный. Не запускайте слишком поздно — ниша уже занята.</p>
                            <p className="text-sm"><span className="font-bold">Оптимальный момент:</span></p>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                                <li>Альфа активно откупается</li>
                                <li>В ленте и терминалах виден рост объема</li>
                                <li>Начинается фаза FOMO</li>
                            </ul>
                        </div>

                        <div>
                            <h5 className="font-bold text-cyan-400 mb-1">5.2. Откуп и ликвидность</h5>
                            <p className="text-sm mb-2">Один из эффективных инструментов — создание токена со своим пулом ликвидности.</p>
                            <p className="text-sm mb-2"><span className="font-bold">Механика:</span></p>
                            <ol className="list-decimal list-inside space-y-1 text-sm">
                                <li>Вы видите, что формируется «гигант»</li>
                                <li>Создаёте бета‑токен</li>
                                <li>Добавляете собственный пул ликвидности</li>
                                <li>Делаете значительный первичный откуп</li>
                            </ol>
                            <div className="mt-3 p-3 bg-white/5 rounded-lg">
                                <p className="text-sm"><span className="font-bold text-green-400">Результат:</span> вы заходите в конкурентную среду (PVP), перехватываете часть ликвидности и пользуетесь импульсом толпы.</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10">
                        <h4 className="font-bold text-red-500 mb-2">6. Риски и ограничения</h4>
                        <p className="text-sm mb-2">Эта стратегия работает только при соблюдении трёх условий:</p>
                        <ul className="list-disc list-inside space-y-1 text-sm mb-3">
                            <li>Скорость реакции</li>
                            <li>Чёткая логическая связка</li>
                            <li>Грамотное распределение и откуп</li>
                        </ul>
                        <p className="text-sm font-bold mb-2">Ошибки:</p>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                            <li>Запуск без понятного нарратива</li>
                            <li>Слишком очевидный «копипаст»</li>
                            <li>Отсутствие ликвидности</li>
                            <li>Слабый первичный импульс</li>
                        </ul>
                    </div>

                    <div className="p-4 rounded-xl bg-pink-500/5 border border-pink-500/10">
                        <h4 className="font-bold text-pink-500 mb-2">7. Ключевой вывод</h4>
                        <p>Стратегия бета‑токенов — это работа не с технологией, а с вниманием.</p>
                        <p className="text-sm mt-2">Вы:</p>
                        <ul className="list-disc list-inside space-y-1 text-sm mb-3">
                            <li>не создаёте тренд</li>
                            <li>вы встраиваетесь в уже существующий</li>
                            <li>и перехватываете вторичную волну ликвидности</li>
                        </ul>
                        <p className="text-sm font-bold text-pink-400">В этой модели решает: скорость + понятность идеи + правильный первичный импульс.</p>
                    </div>
                </div>
            ),
        },
        {
            title: 'Когда «брать» монету, а когда ждать: практическая логика выхода из позиции',
            description: 'Универсальной формулы не существует. Рынок — это динамическая среда, и модель «если X — делаем Y» здесь почти никогда не работает.',
            icon: <Target className="w-5 h-5" />,
            content: (
                <div className="space-y-4">
                    <p>Универсальной формулы не существует. Рынок — это динамическая среда, и модель «если X — делаем Y» здесь почти никогда не работает. Тем не менее, есть ряд поведенческих и рыночных факторов, которые можно использовать как ориентиры. Это не жёсткие правила, а сигналы-маячки, помогающие принять рациональное решение.</p>

                    <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/10">
                        <h4 className="font-bold text-green-500 mb-2">1. Крупные покупки продолжаются — спрос сохраняется</h4>
                        <p className="mb-2"><span className="font-bold">Сценарий:</span> Вы запустили монету, достигли определённой капитализации (N cap), находитесь в прибыли и видите, что в стакане продолжают проходить крупные покупки.</p>
                        <p className="mb-2"><span className="font-bold">Что это означает:</span></p>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                            <li>Есть устойчивый покупательский интерес</li>
                            <li>В рынок заходят участники с объёмом</li>
                            <li>Импульс не исчерпан</li>
                        </ul>
                        <p className="mt-2 text-sm">В такой ситуации преждевременный выход может привести к упущенной прибыли. Пока крупный капитал продолжает поддерживать движение, позицию логично удерживать и наблюдать за динамикой объёмов.</p>
                    </div>

                    <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
                        <h4 className="font-bold text-[#4E6E49] mb-2">2. Крупные баи исчезли — остаётся розница</h4>
                        <p className="mb-2"><span className="font-bold">Сценарий:</span> Вы в профите, но видите, что:</p>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                            <li>Крупные покупки прекратились</li>
                            <li>Проходят только небольшие сделки (например, до $50)</li>
                            <li>Импульс ослабевает</li>
                        </ul>
                        <p className="mb-2 mt-2"><span className="font-bold">Что это означает:</span></p>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                            <li>Институционального или крупного интереса больше нет</li>
                            <li>Движение поддерживается преимущественно мелкими участниками</li>
                            <li>Потенциал продолжения роста снижается</li>
                        </ul>
                        <p className="mt-2 text-sm">Это первый серьёзный сигнал задуматься о выходе. Отсутствие крупных игроков часто предшествует развороту или резкому снижению ликвидности.</p>
                    </div>

                    <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10">
                        <h4 className="font-bold text-red-500 mb-2">3. График «замирает» — импульс исчерпан</h4>
                        <p className="mb-2"><span className="font-bold">Сценарий:</span> Вы достигли целевой капитализации, находитесь в прибыли, но:</p>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                            <li>График стоит на месте более минуты</li>
                            <li>Новых импульсных покупок нет</li>
                            <li>Объёмы падают</li>
                        </ul>
                        <p className="mb-2 mt-2"><span className="font-bold">Что это означает:</span></p>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                            <li>Все, кому монета была интересна, уже вошли</li>
                            <li>Нового спроса нет</li>
                            <li>Рынок перешёл в фазу распределения</li>
                        </ul>
                        <p className="mt-2 text-sm">В таких условиях рассчитывать на «чудо-памп» — ошибка. Отсутствие движения при падении объёма — это, как правило, подготовка к снижению. Рациональное решение — фиксировать результат и выходить из позиции.</p>
                    </div>

                    <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/10">
                        <h4 className="font-bold text-purple-500 mb-2">Ключевой принцип: выход — это работа с вероятностями</h4>
                        <p className="mb-2">Важно понимать: теория выглядит простой, но на практике решает опыт. Выход из позиции — это не эмоция, а оценка:</p>
                        <ul className="list-disc list-inside space-y-1 text-sm mb-3">
                            <li>динамики объёма</li>
                            <li>структуры сделок (крупные vs мелкие)</li>
                            <li>поведения графика</li>
                            <li>скорости движения цены</li>
                        </ul>
                        <p>Набивать руку придётся практикой: наблюдать, сравнивать сценарии, анализировать свои выходы. Со временем вы начнёте чувствовать момент, когда импульс действительно живой, а когда — уже исчерпан.</p>
                        <p className="mt-2 font-bold text-purple-400">Именно в этом и заключается профессиональный подход к торговле.</p>
                    </div>
                </div>
            ),
        },
    ];

    const toolCategories = [
        {
            title: 'Создание и деплой',
            description: 'Инструменты для создания токенов',
            icon: <Wrench className="w-6 h-6 text-[#4E6E49]" />,
            bgColor: 'bg-[#4E6E49]/10',
            borderColor: 'border-[#4E6E49]/20',
            items: [
                { name: 'Vortex', url: 'https://vortexdeployer.com/ref/dexim', desc: 'Лучший бандлер для Solana (PumpSwap и BONK). Множество функций: накрутка показателей, полный контроль токена, автоматическое распределение SOL на кошельки, создание автоматизации. Отличается удобным UX-дизайном и аналитикой.', icon: <Zap className="w-5 h-5 text-orange-400" /> },
                { name: 'PumpFun', url: 'https://pump.fun', desc: 'База в создании токенов и базовом управлении. Помогает выискивать токены и идеи для создания. Позволяет создавать токены без комиссии.', icon: <TrendingUp className="w-5 h-5 text-green-400" /> },
                { name: 'Том.Бот', url: 'https://www.solspread.net', desc: 'Повысьте узнаваемость вашего токена за счет создания органичного объема на нескольких платформах DEX. Расширенные модели торговли, распределенные кошельки и аналитика в реальном времени.', icon: <PieChart className="w-5 h-5 text-purple-400" /> },
            ]
        },
        {
            title: 'Маркетинг и комьюнити',
            description: 'Продвижение и привлечение аудитории',
            icon: <Users className="w-6 h-6 text-[#4E6E49]" />,
            bgColor: 'bg-[#4E6E49]/10',
            borderColor: 'border-[#4E6E49]/20',
            items: [
                { name: 'Telegram', url: 'https://telegram.org', desc: 'Ядро комьюнити и операционный центр: чат холдеров, канал с анонсами, закреп CA и ссылки, интеграция buy/price-ботов. Удержание внимания и управление динамикой.', icon: <Send className="w-5 h-5 text-[#4E6E49]" /> },
                { name: 'X (Twitter)', url: 'https://x.com', desc: 'Нарратив + памп-маркетинг: работа с инфоповодами, комментарии под постами инфлюенсеров, вирусные треды, рейды. Запуск хайпа и быстрый приток участников.', icon: <Hash className="w-5 h-5 text-gray-900 dark:text-white" /> },
                { name: 'Discord', url: 'https://discord.com', desc: 'Структурированное комьюнити: тематические каналы, роли и геймификация, серьёзная атмосфера. Построение долгосрочной лояльности.', icon: <Users className="w-5 h-5 text-indigo-400" /> },
                { name: 'Reddit', url: 'https://www.reddit.com', desc: 'Органический охват и обсуждения: постинг в сабреддиты, анализ трендов, провокационные дискуссии. Аудитория чувствительна к рекламе — лучше работает натив.', icon: <MessageSquare className="w-5 h-5 text-orange-500" /> },
                { name: 'TikTok', url: 'https://www.tiktok.com', desc: 'Вирусный охват через короткие видео: ролики с эмоциональным триггером, истории «x100», трендовые звуки. Алгоритм продвигает без подписчиков, но трафик быстро выгорает.', icon: <Video className="w-5 h-5 text-pink-400" /> },
                { name: 'YouTube', url: 'https://www.youtube.com', desc: 'Доверие и экспертная упаковка: обзоры токена, разбор токеномики, Shorts. Создаёт иллюзию фундаментальности, но интеграции дорогостоящие.', icon: <Video className="w-5 h-5 text-red-500" /> },
            ]
        },
        {
            title: 'Аналитика и мониторинг',
            description: 'Отслеживание метрик проекта',
            icon: <TrendingUp className="w-6 h-6 text-[#4E6E49]" />,
            bgColor: 'bg-[#4E6E49]/10',
            borderColor: 'border-[#4E6E49]/20',
            items: [
                { name: 'DexScreener', url: 'https://dexscreener.com', desc: 'Агрегатор данных по DEX: графики в реальном времени, фильтры, trending, просмотр холдеров и распределения. Основной радар девелопера и трейдера.', icon: <TrendingUp className="w-5 h-5 text-[#4E6E49]" /> },
                { name: 'Solscan', url: 'https://solscan.io', desc: 'Блокчейн-эксплорер Solana: проверка транзакций, анализ кошельков, проверка supply и mint authority, отслеживание распределения токена. Ончейн-контроль и верификация.', icon: <Database className="w-5 h-5 text-teal-400" /> },
                { name: 'Birdeye', url: 'https://birdeye.so', desc: 'Расширенная аналитика по токенам: расширенные графики, wallet tracking, top traders, token overview. Анализ поведения крупных трейдеров и поиск умных денег.', icon: <TrendingUp className="w-5 h-5 text-purple-400" /> },
                { name: 'GMGN', url: 'https://gmgn.ai/rewards/Mxam3xgW?chain=sol', desc: 'Продвинутый терминал для мемкоинов Solana: поиск ранних токенов, фильтры, wallet tracking, быстрые покупки. Снип ранних запусков и копирование успешных кошельков.', icon: <Zap className="w-5 h-5 text-yellow-400" /> },
                { name: 'Axiom', url: 'https://axiom.trade/@dexim3', desc: 'Торгово-аналитический терминал: расширенный фильтр, анализ метрик, встроенный трейдинг, мониторинг кошельков. Сравнение токенов и поиск недооценённых проектов.', icon: <TrendingUp className="w-5 h-5 text-indigo-400" /> },
                { name: 'Dune', url: 'https://dune.com/jhackworth/pumpfun', desc: 'Ончейн-аналитическая платформа: SQL-запросы к блокчейн-данным, кастомные дашборды, статистика по Pump.fun. Глубокая стратегическая аналитика.', icon: <Database className="w-5 h-5 text-cyan-400" /> },
                { name: 'Pump.fun', url: 'https://pump.fun', desc: 'Launchpad для мемкоинов на Solana: оценка MC при выходе, сравнение initial cap, анализ покупательской способности. Ориентир по текущему темпераменту рынка.', icon: <Zap className="w-5 h-5 text-orange-400" /> },
                { name: 'Repump', url: 'https://repump-me.bot', desc: 'Telegram-бот для поддержки объёма на Pump.fun: создание транзакционной активности, повышение шансов попасть в тренды. ⚠ Использовать осторожно.', icon: <Send className="w-5 h-5 text-red-400" /> },
                { name: 'Cointool', url: 'https://ct.app/dashboard', desc: 'Мультифункциональный инструмент: массовая отправка SOL, multi-wallet операции, anti-MEV функции. Операционная инфраструктура для запусков.', icon: <Wrench className="w-5 h-5 text-slate-400" /> },
                { name: 'LunarCrush', url: 'https://lunarcrush.com', desc: 'Аналитика социальных настроений: social sentiment, трендовые темы, engagement rate. Синхронизация запуска с волной интереса.', icon: <TrendingUp className="w-5 h-5 text-pink-400" /> },
            ]
        },
    ];

    return (
        <div className="space-y-16 pb-20">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="p-2 bg-[#4E6E49]/10 rounded-xl border border-[#4E6E49]/20">
                    <Code className="w-6 h-6 text-[#4E6E49]" />
                </div>
                <div>
                    <h1 className={`text-2xl font-black ${headingColor}`}>Мемкоины (девинг)</h1>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Создание и запуск мемкоинов
                    </p>
                </div>
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
                                Полезные сервисы для девинга
                            </p>
                        </div>
                    </div>

                    <CategoryDropdownSelector
                        categories={[
                            { id: 0, name: 'Создание и деплой', icon: <Wrench className="w-4 h-4" /> },
                            { id: 1, name: 'Маркетинг и комьюнити', icon: <Users className="w-4 h-4" /> },
                            { id: 2, name: 'Аналитика и мониторинг', icon: <TrendingUp className="w-4 h-4" /> },
                        ]}
                        activeCategory={activeToolCategory}
                        setActiveCategory={setActiveToolCategory}
                        placeholder="Выберите категорию"
                    />
                </div>

                <div className="space-y-12">
                    {activeToolCategory === null ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[
                                {
                                    id: 0,
                                    title: 'Создание и деплой',
                                    description: 'Инструменты для создания токенов',
                                    icon: <Wrench className="w-8 h-8" />,
                                },
                                {
                                    id: 1,
                                    title: 'Маркетинг и комьюнити',
                                    description: 'Продвижение и привлечение аудитории',
                                    icon: <Users className="w-8 h-8" />,
                                },
                                {
                                    id: 2,
                                    title: 'Аналитика и мониторинг',
                                    description: 'Отслеживание метрик проекта',
                                    icon: <TrendingUp className="w-8 h-8" />,
                                }
                            ].map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveToolCategory(cat.id)}
                                    className={`group p-6 rounded-2xl text-left transition-all duration-300 border hover:shadow-xl hover:-translate-y-1 cursor-pointer ${
                                        theme === 'dark' 
                                            ? 'bg-[#151a21]/50 border-white/5 hover:border-[#4E6E49]/30 hover:bg-[#4E6E49]/5' 
                                            : 'bg-white border-gray-200 hover:border-[#4E6E49]/30 hover:bg-[#4E6E49]/5'
                                    }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="p-4 rounded-2xl w-fit mb-4 transition-transform duration-300 group-hover:scale-110 bg-[#4E6E49]/10 border border-[#4E6E49]/20">
                                            {React.cloneElement(cat.icon as React.ReactElement, { className: 'w-8 h-8 text-[#4E6E49]' })}
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-[#4E6E49]" />
                                    </div>
                                    <h4 className={`text-lg font-black mb-2 ${headingColor}`}>{cat.title}</h4>
                                    <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {cat.description}
                                    </p>
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
                                    <ChevronDown className="w-4 h-4 rotate-90" /> К категориям
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
                                                    <ExternalLink className="w-3.5 h-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity absolute top-4 right-4" />
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Dev Wallets Section */}
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#4E6E49]/10 rounded-xl border border-[#4E6E49]/20">
                            <Wallet className="w-6 h-6 text-[#4E6E49]" />
                        </div>
                        <div>
                            <h3 className={`text-xl font-black ${headingColor}`}>Кошельки-девы</h3>
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                Опытные девы Solana — следите за их новыми проектами
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleWalletsToggle}
                        className={`text-xs font-bold transition-colors flex items-center gap-1 ${
                            theme === 'dark' ? 'text-gray-400 hover:text-[#4E6E49]' : 'text-gray-500 hover:text-[#4E6E49]'
                        }`}
                    >
                        {walletsExpanded ? 'Свернуть' : 'Развернуть'}
                        {walletsExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                </div>

                {walletsExpanded && (
                    <div className={`rounded-3xl border p-6 ${theme === 'dark' ? 'bg-[#0b1015]/50 border-white/5' : 'bg-white border-gray-100'} shadow-xl animate-fade-in`}>
                        <div className="space-y-3">
                            {devWallets.map((wallet, index) => (
                                <div
                                    key={index}
                                    className={`group flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 ${
                                        theme === 'dark' 
                                            ? 'bg-white/5 border-white/10 hover:bg-[#4E6E49]/5 hover:border-[#4E6E49]/20' 
                                            : 'bg-gray-50 border-gray-200 hover:bg-[#4E6E49]/10 hover:border-[#4E6E49]/20'
                                    }`}
                                >
                                    {/* Number Badge */}
                                    <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm transition-colors ${
                                        theme === 'dark'
                                            ? 'bg-[#4E6E49]/20 text-[#4E6E49]'
                                            : 'bg-[#4E6E49]/10 text-[#4E6E49]'
                                    }`}>
                                        {String(index + 1).padStart(2, '0')}
                                    </div>

                                    {/* Wallet Address */}
                                    <div className="flex-1 min-w-0">
                                        <code className={`font-mono text-sm break-all ${textColor}`}>
                                            {wallet}
                                        </code>
                                    </div>

                                    {/* Copy Button */}
                                    <button
                                        onClick={() => copyToClipboard(wallet)}
                                        className={`flex-shrink-0 p-3 rounded-xl transition-all duration-300 ${
                                            copiedWallet === wallet
                                                ? 'bg-green-500/20 text-green-500'
                                                : theme === 'dark'
                                                ? 'bg-white/10 text-gray-400 hover:bg-[#4E6E49]/20 hover:text-[#4E6E49]'
                                                : 'bg-gray-200 text-gray-600 hover:bg-[#4E6E49]/20 hover:text-[#4E6E49]'
                                        }`}
                                        title="Скопировать кошелек"
                                    >
                                        {copiedWallet === wallet ? (
                                            <Check className="w-5 h-5" />
                                        ) : (
                                            <Copy className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 p-4 rounded-2xl bg-[#4E6E49]/5 border border-[#4E6E49]/10">
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                <span className="font-bold text-[#4E6E49]">Совет:</span> Следите за новыми запусками в <a href="https://t.me/fasolbot?start=ref_artyommedoed" target="_blank" rel="noopener noreferrer" className="text-[#4E6E49] hover:underline">FASOL</a> или <a href="https://gmgn.ai/rewards/Mxam3xgW?chain=sol" target="_blank" rel="noopener noreferrer" className="text-[#4E6E49] hover:underline">GMGN</a>, добавив их себе в трекинг кошельков.
                            </p>
                        </div>
                    </div>
                )}
            </section>

            {/* Articles Section */}
            <section className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#4E6E49]/10 rounded-xl border border-[#4E6E49]/20">
                        <FileText className="w-6 h-6 text-[#4E6E49]" />
                    </div>
                    <div>
                        <h3 className={`text-xl font-black ${headingColor}`}>Статьи и гайды</h3>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            Глубокие материалы по девингу мемкоинов
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    {articles.map((article, index) => (
                        <div
                            key={index}
                            className={`rounded-2xl border transition-all duration-300 ${
                                theme === 'dark'
                                    ? 'bg-white/5 border-white/10'
                                    : 'bg-gray-50 border-gray-200'
                            }`}
                        >
                            <button
                                onClick={() => setExpandedArticle(expandedArticle === index ? null : index)}
                                className="w-full p-6 flex items-start justify-between gap-4 text-left"
                            >
                                <div className="flex items-start gap-4 flex-1">
                                    <div className={`p-3 rounded-xl transition-colors ${
                                        expandedArticle === index
                                            ? 'bg-[#4E6E49]/20 text-[#4E6E49]'
                                            : 'bg-[#4E6E49]/10 text-[#4E6E49]/60'
                                    }`}>
                                        {article.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className={`font-bold ${headingColor} mb-1 flex items-center gap-2`}>
                                            {article.title}
                                        </h4>
                                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {article.description}
                                        </p>
                                        {expandedArticle === index && (
                                            <div className="mt-4 animate-fade-in">
                                                {article.content}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className={`flex-shrink-0 transition-transform duration-300 ${
                                    expandedArticle === index ? 'rotate-180' : ''
                                }`}>
                                    {expandedArticle === index ? (
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
                                Часто задаваемые вопросы о девинге мемкоинов
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleFaqListToggle}
                        className={`text-xs font-bold transition-colors flex items-center gap-1 ${
                            theme === 'dark' ? 'text-gray-400 hover:text-[#4E6E49]' : 'text-gray-500 hover:text-[#4E6E49]'
                        }`}
                    >
                        {faqExpanded ? 'Свернуть' : 'Развернуть'}
                        {faqExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                </div>

                {faqExpanded && (
                    <div className="space-y-3 animate-fade-in">
                        {faqData.map((faq, index) => (
                            <div
                                key={index}
                                className={`rounded-2xl border transition-all duration-300 ${
                                    expandedFaq === index
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
                                            expandedFaq === index
                                                ? 'bg-[#4E6E49]/20 text-[#4E6E49]'
                                                : 'bg-[#4E6E49]/10 text-[#4E6E49]/60'
                                        }`}>
                                            {faq.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className={`font-bold ${headingColor} mb-1`}>
                                                {faq.question}
                                            </h4>
                                            {expandedFaq === index && (
                                                <p className={`text-sm leading-relaxed ${textColor} animate-fade-in`}>
                                                    {faq.answer}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className={`flex-shrink-0 transition-transform duration-300 ${
                                        expandedFaq === index ? 'rotate-180' : ''
                                    }`}>
                                        {expandedFaq === index ? (
                                            <ChevronUp className="w-5 h-5 text-[#4E6E49]" />
                                        ) : (
                                            <ChevronDown className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                                        )}
                                    </div>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default MemcoinsDevingPage;
