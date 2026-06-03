
import { EarningsCategory } from '@/types'

type WalletType = 'general' | 'pool'

interface RateConfig {
    max: number // Upper bound of the range (exclusive, or effectively inclusive depending on logic). Using strictly less logic usually.
    percent: number
}

// Helper to define open-ended last tier by using Infinity?
// Or just check logic. "Up to 1000", "Over 1000 to 6000".
// I'll stick to: if amount <= max, use percent. 
// Ordered list. First match wins.

const createTiers = (tiers: [number, number][]): RateConfig[] => {
    return tiers.map(([max, percent]) => ({ max, percent: percent / 100 }))
}

// 2.3.x - General Wallet (Инфраструктура сообщества - 2.3)
const GENERAL_RATES: Record<string, RateConfig[]> = {
    // 2.3.1 Мемкоины (кроме девинга) - Meme Trade
    memecoins_trading: createTiers([
        [1000, 25],
        [5000, 30],
        [10000, 35],
        [20000, 40],
        [Infinity, 45]
    ]),
    // 2.3.2 Мемкоины (девинг - создание мемкоинов) - Meme Dev
    memecoins_deving: createTiers([
        [5000, 20],
        [15000, 25],
        [30000, 30],
        [60000, 35],
        [Infinity, 40]
    ]),
    // 2.3.3 Polymarket
    polymarket: createTiers([
        [1000, 20],
        [3000, 25],
        [6000, 30],
        [12000, 35],
        [Infinity, 40]
    ]),
    // 2.3.4 NFT-торговля
    nft: createTiers([
        [1000, 20],
        [3000, 25],
        [6000, 30],
        [12000, 35],
        [Infinity, 40]
    ]),
    // 2.3.5 Стейкинг
    staking: createTiers([
        [1000, 20],
        [3000, 25],
        [6000, 30],
        [12000, 35],
        [Infinity, 40]
    ]),
    // 2.3.6 Спотовая торговля
    spot: createTiers([
        [1000, 25],
        [5000, 30],
        [10000, 35],
        [20000, 40],
        [Infinity, 45]
    ]),
    // 2.3.7 Фьючерсная торговля
    futures: createTiers([
        [1000, 25],
        [5000, 30],
        [10000, 35],
        [20000, 40],
        [Infinity, 45]
    ]),
    // 2.3.8 Проп-трейдинг
    prop_trading: createTiers([
        [1000, 25],
        [5000, 30],
        [10000, 35],
        [20000, 40],
        [Infinity, 45]
    ]),
    // 2.3.9 AirDrop
    airdrop: createTiers([
        [1000, 20],
        [3000, 25],
        [6000, 30],
        [12000, 35],
        [Infinity, 40]
    ]),
    // 2.3.10 P2P
    p2p: createTiers([
        [1000, 20],
        [3000, 25],
        [6000, 30],
        [12000, 35],
        [Infinity, 40]
    ]),
    // 2.3.11 P2C
    p2c: createTiers([
        [1000, 20],
        [3000, 25],
        [6000, 30],
        [12000, 35],
        [Infinity, 40]
    ]),
    // 2.3.12 Фонда
    funds: createTiers([
        [5000, 20],
        [10000, 25],
        [20000, 30],
        [40000, 35],
        [Infinity, 40]
    ]),
    // Fallback for other
    other: createTiers([
        [1000, 20],
        [3000, 25],
        [6000, 30],
        [12000, 35],
        [Infinity, 40]
    ])
}

const getRateKey = (category: string): string => {
    // Map old category names if they exist in data (for backward compatibility)
    if (category === 'memecoins') {
        return 'memecoins_trading'
    }
    return category
}

export const calculatePoolShare = (
    amount: number,
    category: EarningsCategory,
    walletType: WalletType
): { poolShare: number; percent: number } => {
    if (amount <= 0) return { poolShare: 0, percent: 0 }

    if (walletType === 'pool') {
        return { poolShare: amount, percent: 1 }
    }

    const rates = GENERAL_RATES
    const key = getRateKey(category as string)
    const tiers = rates[key] || rates['other']

    if (!tiers) {
        // Fallback if 'other' or unknown. Default to basic logic or 0? 
        // Assuming 45% as in old logic if strict match fails, but we should cover all.
        // 'other' was not in the new spec.
        return { poolShare: amount * 0.45, percent: 0.45 }
    }

    // Find the matching tier
    const tier = tiers.find(t => amount <= t.max) || tiers[tiers.length - 1]

    return {
        poolShare: amount * tier.percent,
        percent: tier.percent
    }
}

export const calculateTotalEarnings = (
    mainAmount: number,
    walletType: WalletType,
    copyWalletsCount: number = 0
): number => {
    // Для общего кошелька - логика с умножением на количество копи-кошельков
    // Заработок = основной + (кол-во копи-кошельков * основной)
    if (walletType === 'general') {
        return mainAmount + (copyWalletsCount * mainAmount)
    } else if (walletType === 'pool') {
        return mainAmount
    }
    return mainAmount
}

// Получить полную сумму заработка с учетом дополнительных кошельков
export const getTotalAmount = (
    amount: number,
    extraWalletsCount: number | undefined,
    walletType: WalletType | undefined
): number => {
    if (!amount || amount <= 0) return 0
    
    // Для пула сумма не умножается
    if (walletType === 'pool') {
        return amount
    }
    
    // Для общего кошелька учитываем дополнительные кошельки
    const count = extraWalletsCount || 0
    return amount + (count * amount)
}
