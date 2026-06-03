import React, { useState } from 'react'
import { useThemeStore } from '@/store/themeStore'
import {
    BarChart3,
    Brain,
    Zap,
    TrendingUp,
    Globe,
    ArrowLeft,
    ArrowRight,
    Wrench,
    Lightbulb,
    RefreshCw,
    ArrowDownUp,
    Sunrise,
    Megaphone,
    Gauge,
    TrendingDown,
    Activity,
    Calendar,
    LineChart,
    PieChart,
    Coins,
    HelpCircle,
    ChevronUp,
    ChevronDown,
    DollarSign,
    Shield,
    Clock,
    Percent,
    AlertTriangle,
    BarChart2,
    Layers,
    Wallet,
    Scale,
    Briefcase,
    Bot,
    Newspaper,
    ShieldCheck,
    Target,
    CheckCircle2,
    ExternalLink
} from 'lucide-react'
import { AVATrendFollowingStrategy } from './AVATrendFollowingStrategy'
import { AVABreakoutRetestStrategy } from './AVABreakoutRetestStrategy'
import { AVAMeanReversionStrategy } from './AVAMeanReversionStrategy'
import { AVASessionOpenStrategy } from './AVASessionOpenStrategy'
import { AVAEventTradingStrategy } from './AVAEventTradingStrategy'
import { AVAScalpingStrategy } from './AVAScalpingStrategy'
import { AVAIntradayFuturesStrategy } from './AVAIntradayFuturesStrategy' // Новый импорт для фьючерсов
import { StrategyDropdownSelector } from './StrategyDropdownSelector' // Импорт нового компонента
import { CategoryDropdownSelector } from './CategoryDropdownSelector'

type StrategyId = 'trend-following' | 'breakout-retest' | 'mean-reversion' | 'session-open' | 'event-trading' | 'scalping' | 'intraday-futures' | null; // Добавляем новый тип StrategyId для фьючерсов

export const FuturesStrategies: React.FC = () => {
    const { theme } = useThemeStore()
    const [activeCategory, setActiveCategory] = useState<number | null>(null)
    const [activeStrategy, setActiveStrategy] = useState<StrategyId>(null)
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
    const [faqExpanded, setFaqExpanded] = useState(true)
    const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
    const textColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
    const innerBg = theme === 'dark' ? 'bg-[#151a21]/50' : 'bg-gray-50/50'

    const handleFaqToggle = (index: number) => {
        setExpandedFaq(expandedFaq === index ? null : index)
    }

    const handleFaqListToggle = () => {
        setFaqExpanded(!faqExpanded)
    }

    const strategies = [
        {
            id: 'trend-following' as StrategyId,
            name: 'ARCA тренд-фолловинг',
            icon: <TrendingUp className="w-4 h-4" />,
            desc: 'Торговля по тренду. Самая базовая логика из тех, что стабильно работают.'
        },
        {
            id: 'breakout-retest' as StrategyId,
            name: 'ARCA пробой с возвратом',
            icon: <RefreshCw className="w-4 h-4" />,
            desc: 'Работаем не на сам пробой, а на подтверждение того, что рынок действительно выбрал направление.'
        },
        {
            id: 'mean-reversion' as StrategyId,
            name: 'ARCA - Mean Reversion',
            icon: <ArrowDownUp className="w-4 h-4" />,
            desc: 'Контртрендовая работа. Самая коварная и одновременно самая «денежная», если применять её строго по условиям.'
        },
        {
            id: 'session-open' as StrategyId,
            name: 'ARCA - Session Open',
            icon: <Sunrise className="w-4 h-4" />,
            desc: 'Торговля первых минут активной фазы рынка, когда в стакан заходят основные объёмы.'
        },
        {
            id: 'event-trading' as StrategyId,
            name: 'ARCA - Event Trading',
            icon: <Megaphone className="w-4 h-4" />,
            desc: 'Это стратегия для особых случаев. Мы её используем только тогда, когда есть крупный катализатор.'
        },
        {
            id: 'scalping' as StrategyId,
            name: 'ARCA - Scalping',
            icon: <Gauge className="w-4 h-4" />,
            desc: 'Суть скальпинга — ловить микродвижения на графике 1–5 минут. Мы берём маленькие профиты много раз в течение дня.'
        },
        {
            id: 'intraday-futures' as StrategyId,
            name: 'ARCA - Intraday',
            icon: <Zap className="w-4 h-4" />,
            desc: 'Все сделки открываются и закрываются в течение одного торгового дня, чтобы избежать ночных рисков, гэпов и неожиданных новостей.'
        },
    ]

    const faqDataSpotFutures = [
        {
            question: 'Что такое спотовая торговля?',
            answer: 'Спотовая торговля — это покупка или продажа актива по текущей рыночной цене с фактической поставкой. Вы становитесь владельцем актива (криптовалюты, акции, ETF и т.д.).',
            icon: <Wallet className="w-5 h-5" />
        },
        {
            question: 'Что такое фьючерсная торговля?',
            answer: 'Фьючерсная торговля — это работа с производным контрактом на изменение цены базового актива без владения им. Вы торгуете контрактом, а не самим активом.',
            icon: <Layers className="w-5 h-5" />
        },
        {
            question: 'В чём ключевая разница между спотом и фьючерсами?',
            answer: 'На споте вы владеете активом. На фьючерсах вы торгуете контрактом. На фьючерсах доступно плечо. На фьючерсах есть риск ликвидации. Спот проще и менее агрессивен по риску.',
            icon: <Scale className="w-5 h-5" />
        },
        {
            question: 'Что такое кредитное плечо?',
            answer: 'Плечо (leverage) — это возможность открыть позицию больше вашего капитала за счёт заёмных средств биржи. Если у вас $1 000 и плечо 10x — вы контролируете позицию на $10 000. Плечо усиливает и прибыль, и убыток.',
            icon: <TrendingUp className="w-5 h-5" />
        },
        {
            question: 'Плечо 10x означает риск 10%?',
            answer: 'Нет. Плечо увеличивает размер позиции, но риск определяется: размером позиции, расстоянием до стопа, размером капитала. Можно использовать 10x и рисковать 1% капитала — если правильно рассчитан объём.',
            icon: <Percent className="w-5 h-5" />
        },
        {
            question: 'Что такое маржа?',
            answer: 'Маржа — это залог, который вы вносите для открытия фьючерсной позиции. Существует: Initial Margin (начальная маржа), Maintenance Margin (поддерживающая маржа).',
            icon: <DollarSign className="w-5 h-5" />
        },
        {
            question: 'Что такое изолированная и кросс-маржа?',
            answer: 'Isolated margin — маржа ограничена конкретной позицией. При ликвидации теряется только залог этой сделки. Cross margin — используется весь баланс фьючерсного кошелька. При неблагоприятном движении может быть задействован весь доступный капитал.',
            icon: <Shield className="w-5 h-5" />
        },
        {
            question: 'Что такое ликвидация?',
            answer: 'Ликвидация — это принудительное закрытие позиции биржей, когда маржи недостаточно для её поддержания. Чем выше плечо — тем ближе цена ликвидации.',
            icon: <AlertTriangle className="w-5 h-5" />
        },
        {
            question: 'Как считается цена ликвидации?',
            answer: 'Упрощённо: Чем выше плечо — тем ближе ликвидация. Чем больше добавочной маржи — тем дальше ликвидация. Funding и комиссии уменьшают доступную маржу. Точная формула зависит от биржи, но принцип один — когда собственный капитал позиции приближается к maintenance margin, происходит ликвидация.',
            icon: <TrendingDown className="w-5 h-5" />
        },
        {
            question: 'Что происходит при ликвидации?',
            answer: 'Позиция закрывается по рыночной цене. Удерживается комиссия ликвидации. Остаток возвращается (если он есть). При высокой волатильности возможно проскальзывание.',
            icon: <AlertTriangle className="w-5 h-5" />
        },
        {
            question: 'Можно ли потерять больше депозита?',
            answer: 'На большинстве криптобирж действует защита от отрицательного баланса. Однако при кросс-марже можно потерять весь фьючерсный баланс.',
            icon: <Shield className="w-5 h-5" />
        },
        {
            question: 'Что такое perpetual-контракт?',
            answer: 'Perpetual (бессрочный фьючерс) — это контракт без даты экспирации. Он торгуется постоянно и использует механизм funding для привязки к споту.',
            icon: <Clock className="w-5 h-5" />
        },
        {
            question: 'Что такое квартальный фьючерс?',
            answer: 'Квартальный фьючерс имеет дату экспирации. У него: нет funding, возможна премия или дисконт к споту, к дате исполнения цена сходится со спотом.',
            icon: <Calendar className="w-5 h-5" />
        },
        {
            question: 'Что такое funding rate?',
            answer: 'Funding — это периодический платёж между лонгами и шортами в perpetual-контрактах. Положительный funding → лонги платят шортам. Отрицательный → шорты платят лонгам. Funding удерживает цену фьючерса рядом со спотовой.',
            icon: <ArrowRight className="w-5 h-5" />
        },
        {
            question: 'Может ли funding существенно повлиять на результат?',
            answer: 'Да. При долгом удержании позиции funding может значительно изменить итоговый PnL, особенно при высоком перекосе рынка.',
            icon: <Percent className="w-5 h-5" />
        },
        {
            question: 'Что такое basis?',
            answer: 'Basis — разница между ценой фьючерса и спотовой ценой. Положительный basis → фьючерс дороже спота. Отрицательный → дешевле.',
            icon: <TrendingUp className="w-5 h-5" />
        },
        {
            question: 'Почему фьючерс отличается от спота на 1–2%?',
            answer: 'Причины: дисбаланс спроса на лонг или шорт, funding, низкая ликвидность, рыночный перекос.',
            icon: <BarChart2 className="w-5 h-5" />
        },
        {
            question: 'Что такое Open Interest (OI)?',
            answer: 'Open Interest — это общее количество открытых контрактов. Рост OI означает приток новых позиций.',
            icon: <BarChart3 className="w-5 h-5" />
        },
        {
            question: 'Чем объём отличается от Open Interest?',
            answer: 'Объём — сколько контрактов проторговано за период. Open Interest — сколько контрактов остаётся открытыми. Большой объём не означает рост OI.',
            icon: <BarChart2 className="w-5 h-5" />
        },
        {
            question: 'Как интерпретировать рост цены и рост OI?',
            answer: 'Цена растёт + OI растёт → в рынок заходят новые участники (чаще лонги). Цена падает + OI растёт → открываются новые шорты. OI падает → позиции закрываются.',
            icon: <TrendingUp className="w-5 h-5" />
        },
        {
            question: 'Что такое ликвидационный каскад?',
            answer: 'Это цепная реакция ликвидаций: Цена достигает зоны массовых ликвидаций. Биржа закрывает позиции по рынку. Возникают дополнительные рыночные ордера. Движение усиливается.',
            icon: <AlertTriangle className="w-5 h-5" />
        },
        {
            question: 'Почему на фьючерсах движения резче, чем на споте?',
            answer: 'Плечо усиливает размер позиций. Ликвидации создают дополнительные рыночные ордера. Алгоритмы реагируют на перекосы funding и OI.',
            icon: <TrendingDown className="w-5 h-5" />
        },
        {
            question: 'Что такое ADL?',
            answer: 'ADL (Auto-Deleveraging) — механизм автоматического сокращения позиций прибыльных трейдеров, если страховой фонд биржи недостаточен для покрытия убытков ликвидированных позиций.',
            icon: <Shield className="w-5 h-5" />
        },
        {
            question: 'Можно ли держать фьючерсную позицию долго?',
            answer: 'Технически — да (в perpetual-контрактах). Практически — funding, волатильность и психологическая нагрузка усложняют долгосрочное удержание.',
            icon: <Clock className="w-5 h-5" />
        },
        {
            question: 'Можно ли зарабатывать только на шортах?',
            answer: 'Да. Фьючерсы позволяют открывать шорт без владения активом.',
            icon: <TrendingDown className="w-5 h-5" />
        },
        {
            question: 'Чем опасно высокое плечо (20x–50x)?',
            answer: 'Минимальное движение против позиции приводит к ликвидации. Усиливается влияние рыночного шума. Растёт эмоциональное давление.',
            icon: <AlertTriangle className="w-5 h-5" />
        },
        {
            question: 'Что безопаснее — спот или фьючерсы?',
            answer: 'Спот объективно менее рискованный: Нет ликвидации. Нет обязательного плеча. Убыток ограничен вложенной суммой. Фьючерсы — более агрессивный инструмент.',
            icon: <Shield className="w-5 h-5" />
        },
        {
            question: 'Когда логично использовать фьючерсы?',
            answer: 'Для хеджирования спотовой позиции. Для заработка на падении. Для активной краткосрочной торговли.',
            icon: <Zap className="w-5 h-5" />
        },
        {
            question: 'Подходит ли спот для долгосрочных инвестиций?',
            answer: 'Да. Спот чаще используется для: накопления, портфельного инвестирования, усреднения позиции.',
            icon: <Wallet className="w-5 h-5" />
        },
        {
            question: 'Что важнее — плечо или размер позиции?',
            answer: 'Размер позиции. Плечо — лишь инструмент масштабирования.',
            icon: <Scale className="w-5 h-5" />
        },
        {
            question: 'Что такое скользящая маржа и maintenance margin?',
            answer: 'Maintenance margin — это минимальная сумма маржи, которую нужно держать для поддержания позиции. Если маржа падает ниже этой суммы — начинается ликвидация.',
            icon: <DollarSign className="w-5 h-5" />
        },
        {
            question: 'Что такое проскальзывание (slippage)?',
            answer: 'Простыми словами: разница между ожидаемой ценой входа/выхода и фактической ценой исполнения. Чаще возникает при высокой волатильности и крупных ордерах.',
            icon: <ArrowRight className="w-5 h-5" />
        },
        {
            question: 'Что такое maker/taker комиссии?',
            answer: 'Maker — добавляешь ликвидность (лимитный ордер) → обычно меньше комиссия. Taker — берёшь ликвидность (рыночный ордер) → комиссия выше.',
            icon: <Percent className="w-5 h-5" />
        },
        {
            question: 'Почему иногда цена фьючерса обгоняет спот?',
            answer: 'Funding перекос (лонги активнее шортов или наоборот). Небольшая ликвидность в моменте. Механика премии квартальных контрактов.',
            icon: <TrendingUp className="w-5 h-5" />
        },
        {
            question: 'Что такое ADL и почему он нужен?',
            answer: 'ADL (Auto-Deleveraging) — механизм, когда биржа уменьшает прибыльные позиции, чтобы покрыть убытки ликвидированных трейдеров, если страховой фонд мал.',
            icon: <Shield className="w-5 h-5" />
        },
        {
            question: 'Какие ключевые риски фьючерсов?',
            answer: 'Ликвидация из-за движения против позиции. Просадка из-за funding. Проскальзывание при высокой волатильности. ADL в редких случаях. Перекос плеча и объёма — цепочка ликвидаций.',
            icon: <AlertTriangle className="w-5 h-5" />
        }
    ]

    const faqDataPropTrading = [
        {
            question: 'Что такое проп-трейдинг?',
            answer: 'Prop (proprietary) trading — это торговля финансовыми инструментами на капитал компании с разделением прибыли между трейдером и фирмой. Ты не инвестируешь свои деньги (кроме оплаты челленджа в онлайн-модели), а управляешь капиталом фирмы по заданным правилам риска.',
            icon: <Briefcase className="w-5 h-5" />
        },
        {
            question: 'Какими инструментами торгуют в пропе?',
            answer: 'Чаще всего используются Фьючерсы, так как они популярны из-за ликвидности, прозрачного стакана и удобной маржи. Также могут использоваться: Акции, Опционы, Криптовалюты.',
            icon: <TrendingUp className="w-5 h-5" />
        },
        {
            question: 'Нужно ли вкладывать свои деньги?',
            answer: 'Зависит от модели. В онлайн-пропе: ты платишь за прохождение отбора (challenge). Если прошёл — получаешь funded-аккаунт. Собственные деньги не участвуют в торговле.',
            icon: <ShieldCheck className="w-5 h-5" />
        },
        {
            question: 'Что такое челлендж?',
            answer: 'Это этап проверки, на котором ты должен доказать свою компетентность. Цель: прибыль ~8–10%. Лимит: No Max Drawdown. Контроль: Daily Loss Limit.',
            icon: <Target className="w-5 h-5" />
        },
        {
            question: 'Что такое max drawdown?',
            answer: 'Максимально допустимая просадка — это порог, ниже которого общая стоимость счёта (equity) не должна опускаться. Важно: бывает trailing drawdown — лимит может двигаться вслед за прибылью.',
            icon: <Zap className="w-5 h-5" />
        },
        {
            question: 'Что такое daily loss limit?',
            answer: 'Максимально допустимый убыток за один торговый день. Это главный предохранитель от тильта и агрессивной торговли. Превысил лимит дня — аккаунт аннулируется мгновенно.',
            icon: <AlertTriangle className="w-5 h-5" />
        },
        {
            question: 'Как делится прибыль?',
            answer: 'Процент прибыли (Profit Split) обычно составляет 70/30, 80/20 или 90/10. Первый участник в сплите — это Трейдер. Например, при 80% сплите и доходе в $10,000, ты получаешь $8,000.',
            icon: <Scale className="w-5 h-5" />
        },
        {
            question: 'Чем проп лучше торговли на свои деньги?',
            answer: 'Плюсы: доступ к огромному капиталу, ограниченный личный риск, возможность масштабирования. Минусы: жёсткие лимиты, давление правил, риск «вылететь» за один день.',
            icon: <CheckCircle2 className="w-5 h-5" />
        },
        {
            question: 'Подходит ли проп новичку?',
            answer: 'Честный ответ: проп не заменяет обучение. Вероятность «сгореть» крайне высока, если у тебя нет статистики, истории сделок и понимания risk-management.',
            icon: <HelpCircle className="w-5 h-5" />
        },
        {
            question: 'Когда проп имеет смысл?',
            answer: 'Он рационален как инструмент масштабирования, если: у тебя уже есть рабочая стратегия, ты понимаешь свою среднюю просадку, ты можешь торговать системно (без эмоций).',
            icon: <CheckCircle2 className="w-5 h-5" />
        },
        {
            question: 'Что будет, если я потрачу все деньги?',
            answer: 'В 99% онлайн-пропов технически невозможно «слить всё» благодаря защитным механизмам: Daily Loss Limit, Max Drawdown, Автоликвидация. Проп — это не кредит. Максимум, что ты теряешь — это стоимость челленджа или подписки.',
            icon: <AlertTriangle className="w-5 h-5" />
        },
        {
            question: 'Главный вывод о проп-трейдинге',
            answer: 'Проп — это не способ «слить чужие деньги». Система спроектирована так, чтобы ограничить риски фирмы. Ты рискуешь только доступом к капиталу, временем на челлендж и стоимостью оплаты.',
            icon: <ShieldCheck className="w-5 h-5" />
        }
    ]

    const categories = [
        {
            title: 'Биржи',
            description: 'Ведущие платформы для торговли деривативами',
            icon: <Globe className="w-6 h-6 text-[#4E6E49]" />,
            bgColor: 'bg-[#4E6E49]/10',
            borderColor: 'border-[#4E6E49]/20',
            tools: [
                {
                    name: 'Mexc',
                    url: 'https://promote.mexc.com/r/R9YFaTBn',
                    desc: 'Одна их лучших бирж, имеет один из самых удобных стаканов, низкие комиссии, демо-торговлю, режим DEX и многое другое.',
                    icon: <BarChart3 className="w-5 h-5 text-green-400" />
                },
                {
                    name: 'BingX',
                    url: 'https://bingxdao.com/invite/3JPDH6/',
                    desc: 'Аналогично, одна из лучших бирж на данный момент. Имеет копи-трейдинг, демо-режим, боты, автоматизированную торговлю и многое другое.',
                    icon: <Zap className="w-5 h-5 text-[#4E6E49]" />
                }
            ]
        },
        {
            title: 'Проп-фирмы',
            description: 'Платформы для проп-трейдинга с возможностью получения funded-аккаунта',
            icon: <Briefcase className="w-6 h-6 text-blue-500" />,
            bgColor: 'bg-blue-500/10',
            borderColor: 'border-blue-500/20',
            tools: [
                {
                    name: 'HASH HEDGE',
                    url: 'https://www.hashhedge.com/client/login?redirect=/index',
                    desc: 'Платформа для проп-трейдинга с возможностью получения funded-аккаунта и торговли на капитал компании.',
                    icon: <Briefcase className="w-5 h-5 text-blue-400" />
                }
            ]
        },
        {
            title: 'Аналитика и Данные',
            description: 'Инструменты для анализа рынка и трендов',
            icon: <Brain className="w-6 h-6 text-purple-500" />,
            bgColor: 'bg-purple-500/10',
            borderColor: 'border-purple-500/20',
            tools: [
                {
                    name: 'TradingView',
                    url: 'https://tradingview.com',
                    desc: 'Мировой стандарт графиков, подключение к торговым терминалам и демо-торговля, обзоры и новости.',
                    icon: <TrendingUp className="w-5 h-5 text-[#4E6E49]" />
                },
                {
                    name: 'Coinglass',
                    url: 'https://www.coinglass.com/pro/futures/LiquidationHeatMap',
                    desc: 'Платформа, агрегирующая данные по бессрочным контрактам: открытый интерес, ставка финансирования, ликвидации, лонг/шорт-соотношения и тепловые карты ликвидности по крупным криптобиржам.',
                    icon: <BarChart3 className="w-5 h-5 text-cyan-400" />
                },
                {
                    name: 'CoinMarketCap',
                    url: 'https://coinmarketcap.com/',
                    desc: 'Агрегатор цены и объёма. Показывает спотовые цены, объёмы торгов, капитализацию, рейтинги активов и пары. Отлично подходит для общего обзора рынка и сравнения активов.',
                    icon: <Coins className="w-5 h-5 text-amber-400" />
                },
                {
                    name: 'CoinGecko',
                    url: 'https://www.coingecko.com/',
                    desc: 'Показатели рынка и дополнительные метрики. Схожий агрегатор, где можно отслеживать цены, объемы, динамику листинга на биржах, интерес инвесторов и базовые фундаментальные метрики.',
                    icon: <TrendingDown className="w-5 h-5 text-green-400" />
                },
                {
                    name: 'Glassnode',
                    url: 'https://glassnode.com/',
                    desc: 'On-chain метрики. Фокусируется на метриках блокчейн-активности: движение средств, баланс бирж, SOPR, NVT, активные адреса и др. Это помогает видеть накопление/отток капитала с бирж.',
                    icon: <Activity className="w-5 h-5 text-purple-400" />
                },
                {
                    name: 'Coindar',
                    url: 'https://coindar.org/',
                    desc: 'Календарь крипто-событий. Аналитический календарь основных событий крипто-рынка (халвинги, форки, листинги), а также новостные напоминания. Удобно для фундаментального планирования.',
                    icon: <Calendar className="w-5 h-5 text-orange-400" />
                },
                {
                    name: 'SpreadCharts',
                    url: 'https://spreadcharts.com/',
                    desc: 'Аналитика товарных фьючерсов. Специализированный сервис для анализа фьючерсов на сырьевые товары, spreads между контрактами, сезонности, а также торговых сигналов и sentiment-данных.',
                    icon: <LineChart className="w-5 h-5 text-indigo-400" />
                },
                {
                    name: 'Investing.com',
                    url: 'https://www.investing.com/',
                    desc: 'Макро и рыночные данные. Агрегирует данные по экономике (FX, индексы, сырьё), календарь событий, технические индикаторы и спотовые котировки финансовых активов.',
                    icon: <PieChart className="w-5 h-5 text-red-400" />
                },
                {
                    name: 'cryptoRobotics',
                    url: 'https://cryptorobotics.net/',
                    desc: 'Терминал с ИИ-сигналами и ML-алгоритмами для автоматизированной торговли.',
                    icon: <Bot className="w-5 h-5 text-cyan-400" />
                },
                {
                    name: 'ForkLog',
                    url: 'https://forklog.com',
                    desc: 'Аналитическое издание. Новости и исследования для фундаментального понимания трендов.',
                    icon: <Newspaper className="w-5 h-5 text-orange-400" />
                }
            ]
        }
    ]

    return (
        <div className="space-y-16 pb-20">
            {/* Strategies Block */}
            <section className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#4E6E49]/10 rounded-xl border border-[#4E6E49]/20">
                            <Lightbulb className="w-6 h-6 text-[#4E6E49]" />
                        </div>
                        <div>
                            <h3 className={`text-xl font-black ${headingColor}`}>Стратегии</h3>
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                Проверенные методики фьючерсной и спот-торговли
                            </p>
                        </div>
                    </div>

                    {/* Strategy Selector - Visible when strategy is already selected */}
                    {activeStrategy !== undefined && (
                        <StrategyDropdownSelector
                            strategies={strategies}
                            activeStrategy={activeStrategy}
                            setActiveStrategy={setActiveStrategy as (id: string | null) => void}
                            placeholder="Выберите стратегию"
                        />
                    )}
                </div>

                {!activeStrategy ? (
                    /* Selection Grid - New Design */
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            {
                                id: 'trend-following',
                                name: 'ARCA тренд-фолловинг',
                                description: 'Торговля по тренду. Самая базовая логика из тех, что стабильно работают.',
                                icon: <TrendingUp className="w-8 h-8" />,
                            },
                            {
                                id: 'breakout-retest',
                                name: 'ARCA пробой с возвратом',
                                description: 'Работаем не на сам пробой, а на подтверждение того, что рынок действительно выбрал направление.',
                                icon: <RefreshCw className="w-8 h-8" />,
                            },
                            {
                                id: 'mean-reversion',
                                name: 'ARCA - Mean Reversion',
                                description: 'Контртрендовая работа. Самая коварная и одновременно самая «денежная», если применять её строго по условиям.',
                                icon: <ArrowDownUp className="w-8 h-8" />,
                            },
                            {
                                id: 'session-open',
                                name: 'ARCA - Session Open',
                                description: 'Торговля первых минут активной фазы рынка, когда в стакан заходят основные объёмы.',
                                icon: <Sunrise className="w-8 h-8" />,
                            },
                            {
                                id: 'event-trading',
                                name: 'ARCA - Event Trading',
                                description: 'Это стратегия для особых случаев. Мы её используем только тогда, когда есть крупный катализатор.',
                                icon: <Megaphone className="w-8 h-8" />,
                            },
                            {
                                id: 'scalping',
                                name: 'ARCA - Scalping',
                                description: 'Суть скальпинга — ловить микродвижения на графике 1–5 минут. Мы берём маленькие профиты много раз в течение дня.',
                                icon: <Gauge className="w-8 h-8" />,
                            },
                            {
                                id: 'intraday-futures',
                                name: 'ARCA - Intraday',
                                description: 'Все сделки открываются и закрываются в течение одного торгового дня, чтобы избежать ночных рисков, гэпов и неожиданных новостей.',
                                icon: <Zap className="w-8 h-8" />,
                            },
                        ].map((s) => (
                            <button
                                key={s.id}
                                onClick={() => setActiveStrategy(s.id as StrategyId)}
                                className={`group p-6 rounded-2xl text-left transition-all duration-300 border hover:shadow-xl hover:-translate-y-1 cursor-pointer ${
                                    theme === 'dark' 
                                        ? 'bg-[#151a21]/50 border-white/5 hover:border-[#4E6E49]/30 hover:bg-[#4E6E49]/5'
                                        : 'bg-white border-gray-200 hover:border-[#4E6E49]/30 hover:bg-[#4E6E49]/5'
                                }`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="p-4 rounded-2xl w-fit mb-4 transition-transform duration-300 group-hover:scale-110 bg-[#4E6E49]/10 border border-[#4E6E49]/20">
                                        {React.cloneElement(s.icon as React.ReactElement, { className: 'w-8 h-8 text-[#4E6E49]' })}
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-[#4E6E49]" />
                                </div>
                                <h4 className={`text-lg font-black mb-2 ${headingColor}`}>{s.name}</h4>
                                <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {s.description}
                                </p>
                            </button>
                        ))}
                    </div>
                ) : (
                    /* Active Strategy View */
                    <div className={`rounded-3xl border p-1 sm:p-2 ${theme === 'dark' ? 'bg-[#0b1015]/50 border-white/5' : 'bg-white border-gray-100'
                        } shadow-xl animate-scale-up`}>
                        <div className={`p-6 sm:p-8 rounded-[2.5rem] ${innerBg}`}>
                            <div className="mb-6 flex items-center justify-between">
                                <button
                                    onClick={() => setActiveStrategy(null)}
                                    className="text-xs font-bold text-gray-500 hover:text-[#4E6E49] transition-colors flex items-center gap-1"
                                >
                                    ← К списку стратегий
                                </button>
                            </div>
                            {activeStrategy === 'trend-following' && <AVATrendFollowingStrategy />}
                            {activeStrategy === 'breakout-retest' && <AVABreakoutRetestStrategy />}
                            {activeStrategy === 'mean-reversion' && <AVAMeanReversionStrategy />}
                            {activeStrategy === 'session-open' && <AVASessionOpenStrategy />}
                            {activeStrategy === 'event-trading' && <AVAEventTradingStrategy />}
                            {activeStrategy === 'scalping' && <AVAScalpingStrategy />} {/* Добавляем рендеринг новой стратегии */}
                            {activeStrategy === 'intraday-futures' && <AVAIntradayFuturesStrategy />} {/* Добавляем рендеринг новой стратегии для фьючерсов */}
                        </div>
                    </div>
                )}
            </section>

            {/* Tools Block */}
            <section className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#4E6E49]/10 rounded-xl border border-[#4E6E49]/20">
                            <Wrench className="w-6 h-6 text-[#4E6E49]" />
                        </div>
                        <div>
                            <h3 className={`text-xl font-black ${headingColor}`}>Инструменты</h3>
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                Биржи, аналитика и терминалы для торговли
                            </p>
                        </div>
                    </div>

                    {activeCategory !== undefined && (
                        <CategoryDropdownSelector
                            categories={categories.map((c, idx) => ({ id: idx, name: c.title, icon: c.icon }))}
                            activeCategory={activeCategory}
                            setActiveCategory={setActiveCategory as (id: number | null) => void}
                            placeholder="Выберите категорию"
                        />
                    )}
                </div>

                <div className="space-y-12">
                    {activeCategory === null ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[
                                {
                                    id: 0,
                                    title: 'Биржи',
                                    description: 'Ведущие платформы для торговли деривативами',
                                    icon: <Globe className="w-8 h-8" />,
                                },
                                {
                                    id: 1,
                                    title: 'Проп-фирмы',
                                    description: 'Платформы для проп-трейдинга с возможностью получения funded-аккаунта',
                                    icon: <Briefcase className="w-8 h-8" />,
                                },
                                {
                                    id: 2,
                                    title: 'Аналитика и Данные',
                                    description: 'Инструменты для анализа рынка и трендов',
                                    icon: <Brain className="w-8 h-8" />,
                                }
                            ].map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
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
                                    onClick={() => setActiveCategory(null)}
                                    className="text-xs font-bold text-gray-500 hover:text-[#4E6E49] transition-colors flex items-center gap-1"
                                >
                                    <ArrowLeft className="w-3 h-3" /> Все категории
                                </button>
                            </div>

                            <section className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className={`p-3 ${categories[activeCategory].bgColor} rounded-2xl border ${categories[activeCategory].borderColor}`}>
                                        {React.cloneElement(categories[activeCategory].icon as React.ReactElement, { className: 'w-8 h-8' })}
                                    </div>
                                    <div>
                                        <h3 className={`text-2xl font-black ${headingColor}`}>{categories[activeCategory].title}</h3>
                                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {categories[activeCategory].description}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {categories[activeCategory].tools.map((tool, idx) => (
                                        <a
                                            key={idx}
                                            href={tool.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`group relative p-5 rounded-2xl border transition-all duration-300 hover:shadow-lg ${theme === 'dark'
                                                ? 'bg-[#151a21]/50 border-white/5 hover:border-[#4E6E49]/30'
                                                : 'bg-white border-gray-100 hover:border-[#4E6E49]/20'
                                                }`}
                                        >
                                            <div className={`p-2.5 rounded-xl w-fit mb-4 ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'
                                                } group-hover:scale-110 transition-transform`}>
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
                            </section>
                        </div>
                    )}
                </div>
            </section>

            {/* FAQ Section */}
            <section className="space-y-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#4E6E49]/10 rounded-xl border border-[#4E6E49]/20">
                            <HelpCircle className="w-6 h-6 text-[#4E6E49]" />
                        </div>
                        <div>
                            <h3 className={`text-xl font-black ${headingColor}`}>FAQ</h3>
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                Часто задаваемые вопросы о фьючерсной и спот-торговле
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
                    <div className="space-y-8 animate-fade-in">
                        {/* Раздел: Спот и Фьючерсы */}
                        <div>
                            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/10">
                                <div className="p-2 bg-[#4E6E49]/20 rounded-xl">
                                    <Zap className="w-5 h-5 text-[#4E6E49]" />
                                </div>
                                <h4 className={`text-lg font-black ${headingColor}`}>Спот и Фьючерсы</h4>
                            </div>
                            <div className="space-y-3">
                                {faqDataSpotFutures.map((faq, index) => (
                                    <div
                                        key={`spot-${index}`}
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
                        </div>

                        {/* Раздел: Проп-трейдинг */}
                        <div>
                            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-blue-500/20">
                                <div className="p-2 bg-blue-500/20 rounded-xl">
                                    <Briefcase className="w-5 h-5 text-blue-400" />
                                </div>
                                <h4 className={`text-lg font-black ${headingColor}`}>Проп-трейдинг</h4>
                            </div>
                            <div className="space-y-3">
                                {faqDataPropTrading.map((faq, index) => {
                                    const propIndex = faqDataSpotFutures.length + index;
                                    return (
                                        <div
                                            key={`prop-${index}`}
                                            className={`rounded-2xl border transition-all duration-300 ${
                                                expandedFaq === propIndex
                                                    ? 'bg-blue-500/5 border-blue-500/20'
                                                    : theme === 'dark'
                                                    ? 'bg-white/5 border-white/10'
                                                    : 'bg-gray-50 border-gray-200'
                                            }`}
                                        >
                                            <button
                                                onClick={() => handleFaqToggle(propIndex)}
                                                className="w-full p-5 flex items-start justify-between gap-4 text-left"
                                            >
                                                <div className="flex items-start gap-4 flex-1">
                                                    <div className={`p-2 rounded-xl transition-colors ${
                                                        expandedFaq === propIndex
                                                            ? 'bg-blue-500/20 text-blue-400'
                                                            : 'bg-blue-500/10 text-blue-400/60'
                                                    }`}>
                                                        {faq.icon}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className={`font-bold ${headingColor} mb-1`}>
                                                            {faq.question}
                                                        </h4>
                                                        {expandedFaq === propIndex && (
                                                            <p className={`text-sm leading-relaxed ${textColor} animate-fade-in`}>
                                                                {faq.answer}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className={`flex-shrink-0 transition-transform duration-300 ${
                                                    expandedFaq === propIndex ? 'rotate-180' : ''
                                                }`}>
                                                    {expandedFaq === propIndex ? (
                                                        <ChevronUp className="w-5 h-5 text-blue-400" />
                                                    ) : (
                                                        <ChevronDown className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                                                    )}
                                                </div>
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </div>
    )
}
