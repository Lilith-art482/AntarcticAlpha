import React from 'react'
import { useThemeStore } from '@/store/themeStore'
import { Wallet, QrCode, CreditCard, Coins, Building2, Link as LinkIcon } from 'lucide-react'

interface PaymentService {
    name: string
    url: string
    description: string
    features: string[]
    icon: React.ReactNode
    color: string
    bgGradient: string
}

export const DigitalPaymentStrategies: React.FC = () => {
    const { theme } = useThemeStore()

    const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
    const mutedText = theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
    const cardBg = theme === 'dark' ? 'bg-[#151a21]/50 border-white/5' : 'bg-white border-gray-100'
    const borderColor = theme === 'dark' ? 'border-white/10' : 'border-gray-200'

    const services: PaymentService[] = [
        {
            name: 'Antarctic Wallet',
            url: 'https://t.me/antarctic_wallet_bot/app?startapp=ref_ebd6f17ae5',
            description: 'Криптокошелёк нового поколения, который позволяет оплачивать товары и услуги криптовалютой через QR-коды на кассах, терминалах и в онлайн-магазинах.',
            features: [
                'Оплата по QR-коду на кассах и терминалах',
                'Оплата в онлайн-магазинах',
                'Поддержка основных криптовалют',
                'Мгновенные переводы'
            ],
            icon: <QrCode className="w-6 h-6" />,
            color: 'text-cyan-400',
            bgGradient: 'from-cyan-500 to-blue-600'
        },
        {
            name: 'Altyn.one',
            url: 'https://altyn.one',
            description: 'Web3 кошелёк с банковской лицензией. Пополняй баланс в USDT, трать при помощи карты. Используй в РФ без P2P и обменников.',
            features: [
                'Банковская лицензия',
                'Пополнение в USDT',
                'Карта для оплаты',
                'Использование в РФ без P2P'
            ],
            icon: <CreditCard className="w-6 h-6" />,
            color: 'text-amber-400',
            bgGradient: 'from-amber-500 to-orange-600'
        },
        {
            name: 'Валлет',
            url: 'https://t.me/PlatiVallet_bot?start=B4F2238D-xXM1B5AslN1ofNfLVFy5122K_2vXWEynRXrllxUrXng',
            description: 'Криптокошелёк, с помощью которого ты можешь оплатить товары криптой по QR-коду.',
            features: [
                'Оплата криптовалютой по QR-коду',
                'Поддержка множества криптовалют',
                'Простой и понятный интерфейс',
                'Быстрые переводы'
            ],
            icon: <Wallet className="w-6 h-6" />,
            color: 'text-emerald-400',
            bgGradient: 'from-emerald-500 to-teal-600'
        },
        {
            name: 'Crypto Bot',
            url: 'https://t.me send',
            description: 'Криптокошелёк, с помощью которого можно обменивать крипту, оплачивать криптой по СБП и безопасно её хранить.',
            features: [
                'Обмен криптовалют',
                'Оплата по СБП',
                'Безопасное хранение',
                'Интеграция с Telegram'
            ],
            icon: <Coins className="w-6 h-6" />,
            color: 'text-violet-400',
            bgGradient: 'from-violet-500 to-purple-600'
        },
        {
            name: 'SkyPay',
            url: '#',
            description: 'Оплачивайте покупки по QR‑коду. Продавайте и покупайте USDT прямо со своего DeFi кошелька.',
            features: [
                'Оплата по QR-коду',
                'Покупка/продажа USDT',
                'Интеграция с DeFi кошельками',
                'Быстрые расчёты'
            ],
            icon: <QrCode className="w-6 h-6" />,
            color: 'text-sky-400',
            bgGradient: 'from-sky-500 to-blue-600'
        },
        {
            name: 'Crypto Office',
            url: 'https://crypto-office.com/ru',
            description: 'Сервис для хранения, покупки, продажи и обмена криптовалют. Позволяет быстро отправлять криптовалюты, совершать кросс-чейн переводы и обмены по выгодному курсу. Также доступны массовые операции, контроль безопасности кошельков.',
            features: [
                'Хранение криптовалют',
                'Покупка и продажа',
                'Кросс-чейн переводы',
                'Массовые операции',
                'Контроль безопасности кошельков'
            ],
            icon: <Building2 className="w-6 h-6" />,
            color: 'text-rose-400',
            bgGradient: 'from-rose-500 to-pink-600'
        }
    ]

    return (
        <div className="space-y-16 pb-20">
            {/* Header Section */}
            <section className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl">
                        <Wallet className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h3 className={`text-2xl font-black ${headingColor}`}>Цифровые платёжные решения</h3>
                        <p className={`text-sm ${mutedText}`}>
                            Криптокошельки нового поколения для оплаты товаров и услуг
                        </p>
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service, idx) => (
                        <a
                            key={idx}
                            href={service.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`group relative p-6 rounded-2xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${cardBg} hover:border-violet-500/30`}
                        >
                            {/* Gradient background accent */}
                            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${service.bgGradient} opacity-0 group-hover:opacity-5 transition-opacity`} />

                            <div className="relative">
                                {/* Icon */}
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.bgGradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                                    <div className="text-white">
                                        {service.icon}
                                    </div>
                                </div>

                                {/* Title */}
                                <h4 className={`font-bold text-lg mb-2 ${headingColor} flex items-center gap-2`}>
                                    {service.name}
                                    <LinkIcon className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </h4>

                                {/* Description */}
                                <p className={`text-sm mb-4 leading-relaxed ${mutedText}`}>
                                    {service.description}
                                </p>

                                {/* Features */}
                                <ul className="space-y-2">
                                    {service.features.map((feature, fIdx) => (
                                        <li key={fIdx} className={`flex items-start gap-2 text-xs ${mutedText}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${service.bgGradient} mt-1.5 flex-shrink-0`} />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </a>
                    ))}
                </div>
            </section>

            {/* Info Section */}
            <section className={`p-6 rounded-2xl border ${borderColor} ${cardBg}`}>
                <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20`}>
                        <Coins className={`w-6 h-6 text-violet-400`} />
                    </div>
                    <div>
                        <h4 className={`font-bold mb-2 ${headingColor}`}>
                            Как начать использовать криптокошельки для оплаты?
                        </h4>
                        <p className={`text-sm ${mutedText} leading-relaxed`}>
                            Выберите подходящий сервис из списка выше, создайте кошелёк и следуйте инструкциям по активации карты или QR-кода для оплаты. 
                            Большинство сервисов позволяют пополнить баланс через P2P или напрямую с банковской карты.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    )
}
