import { useState, useEffect, type JSX } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { addCall, updateCall } from '@/services/firestoreService'
import type {
  Call,
  CallCategory,
  CallDetails,
  CallRiskLevel,
  CallSentiment,
  MemecoinSignalFields,
  FuturesSignalFields,
  SpotSignalFields,
  PolymarketSignalFields,
  NftSignalFields,
} from '@/types'
import { TEAM_MEMBERS } from '@/types'
import Avatar from '@/components/Avatar'
import { Sparkles, Rocket, LineChart, Coins, Shield, Target, Info, MapPin, TrendingUp, AlertTriangle, Settings, MessageSquare, Eye, X, Check, Globe2, Clock3, Link2, Activity, Gauge, ScrollText, Percent, Octagon, Network as NetworkIcon, Copy, Loader2, Users, Globe } from 'lucide-react'
interface CallFormProps {
  onSuccess?: () => void
  onCancel?: () => void
  callToEdit?: Call | null
  initialCategory?: CallCategory
  category?: CallCategory
  onCategoryChange?: (category: CallCategory) => void
  showCategorySelector?: boolean
}

type FieldType = 'text' | 'textarea' | 'select' | 'checkbox'

interface FieldConfig {
  key: string
  label: string
  placeholder?: string
  type?: FieldType
  options?: { value: string; label: string }[]
  section?: string
  required?: boolean
}

interface SectionConfig {
  title: string
  icon: JSX.Element
  description?: string
}

// Тип для состояния формы
type FormDetailsState = {
  memecoins: MemecoinSignalFields
  futures: FuturesSignalFields
  spot: SpotSignalFields
  polymarket: PolymarketSignalFields
  nft: NftSignalFields
}

const CATEGORY_META: Record<CallCategory, { label: string; gradient: string; gradientDark: string; icon: JSX.Element; pastelBg: string; pastelBorder: string; pastelText: string }> = {
  memecoins: { label: 'Мемкоины', gradient: 'from-emerald-400 via-teal-500 to-cyan-400', gradientDark: 'from-emerald-500 via-teal-600 to-cyan-500', icon: <Rocket className="w-5 h-5" />, pastelBg: 'bg-emerald-50', pastelBorder: 'border-emerald-200', pastelText: 'text-emerald-800' },
  polymarket: { label: 'Polymarket', gradient: 'from-rose-300 to-red-300', gradientDark: 'from-rose-600 to-red-500', icon: <Target className="w-5 h-5" />, pastelBg: 'bg-rose-50', pastelBorder: 'border-rose-100', pastelText: 'text-rose-800' },
  spot: { label: 'Спот', gradient: 'from-amber-300 to-orange-300', gradientDark: 'from-amber-600 to-orange-500', icon: <Coins className="w-5 h-5" />, pastelBg: 'bg-amber-50', pastelBorder: 'border-amber-100', pastelText: 'text-amber-800' },
  futures: { label: 'Фьючерсы', gradient: 'from-sky-300 to-indigo-400', gradientDark: 'from-sky-600 to-indigo-500', icon: <LineChart className="w-5 h-5" />, pastelBg: 'bg-sky-50', pastelBorder: 'border-sky-100', pastelText: 'text-sky-800' },
}

// Helper to get appropriate gradient based on theme
const getCategoryGradient = (category: CallCategory, theme: string) => {
  return theme === 'dark' ? CATEGORY_META[category].gradientDark : CATEGORY_META[category].gradient
}

const riskBadges: Record<CallRiskLevel, string> = {
  low: 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20',
  medium: 'bg-blue-500/10 text-blue-600 border border-blue-500/20',
  high: 'bg-amber-500/10 text-amber-600 border border-amber-500/20',
  ultra: 'bg-red-500/10 text-red-600 border border-red-500/20',
}

const categoryTone: Record<CallCategory, { border: string; bg: string; text: string; chipBg: string }> = {
  memecoins: { border: 'border-emerald-400/40', bg: 'bg-emerald-500/10', text: 'text-emerald-400', chipBg: 'bg-emerald-400/30' },
  futures: { border: 'border-blue-500/30', bg: 'bg-blue-500/5', text: 'text-blue-400', chipBg: 'bg-blue-500/20' },
  spot: { border: 'border-amber-500/30', bg: 'bg-amber-500/5', text: 'text-amber-400', chipBg: 'bg-amber-500/20' },
  polymarket: { border: 'border-rose-500/30', bg: 'bg-rose-500/5', text: 'text-rose-400', chipBg: 'bg-rose-500/20' },
}

// Цвета для фоновых эффектов модального окна
const CATEGORY_BG_COLORS: Record<CallCategory, { primary: string; secondary: string; gradientFrom: string }> = {
  memecoins: { primary: 'bg-emerald-500/10', secondary: 'bg-cyan-500/10', gradientFrom: 'from-emerald-500/5' },
  futures: { primary: 'bg-sky-500/10', secondary: 'bg-indigo-500/10', gradientFrom: 'from-sky-500/5' },
  spot: { primary: 'bg-amber-500/10', secondary: 'bg-orange-500/10', gradientFrom: 'from-amber-500/5' },
  polymarket: { primary: 'bg-rose-500/10', secondary: 'bg-red-500/10', gradientFrom: 'from-rose-500/5' },
}

// Helper functions for preview
const getDetails = (call: Call) => (call.details as any)?.[call.category] || {}

const getRiskLevel = (call: Call): CallRiskLevel => call.riskLevel || getDetails(call).riskLevel || getDetails(call).protocolRisk || 'medium'

const shortenValue = (value: string | undefined, maxLength: number): string => {
  if (!value) return ''
  return value.length > maxLength ? `${value.slice(0, maxLength)}...` : value
}

const CATEGORY_SECTIONS: Record<CallCategory, Record<string, SectionConfig>> = {
  memecoins: {
    basic: { title: 'Токен', icon: <Coins className="w-4 h-4" />, description: 'Адрес контракта и стратегия' },
    additional: { title: 'Комментарий', icon: <MessageSquare className="w-4 h-4" />, description: 'Дополнительные заметки' },
  },
  futures: {
    basic: { title: 'Основная информация', icon: <Info className="w-4 h-4" />, description: 'Данные о паре и направлении' },
    entry: { title: 'Зоны входа', icon: <MapPin className="w-4 h-4" />, description: 'Условия входа' },
    targets: { title: 'Цели и риски', icon: <TrendingUp className="w-4 h-4" />, description: 'План прибыли и стоп-лоссы' },
    additional: { title: 'Дополнительно', icon: <Settings className="w-4 h-4" />, description: 'Комментарии и детали' },
  },
  spot: {
    basic: { title: 'Основная информация', icon: <Info className="w-4 h-4" />, description: 'Данные о монете' },
    entry: { title: 'Зона входа', icon: <MapPin className="w-4 h-4" />, description: 'Условия входа в позицию' },
    targets: { title: 'Цели и риски', icon: <TrendingUp className="w-4 h-4" />, description: 'План прибыли и стоп-лоссы' },
    additional: { title: 'Дополнительно', icon: <Settings className="w-4 h-4" />, description: 'Анализ и комментарии' },
  },
  polymarket: {
    basic: { title: 'Основная информация', icon: <Info className="w-4 h-4" />, description: 'Данные о событии' },
    entry: { title: 'Условия входа', icon: <MapPin className="w-4 h-4" />, description: 'Позиция и цена входа' },
    targets: { title: 'Цели и риски', icon: <TrendingUp className="w-4 h-4" />, description: 'План прибыли и риски' },
    additional: { title: 'Дополнительно', icon: <Settings className="w-4 h-4" />, description: 'Комментарии и детали' },
  },
}

// Интерфейс для информации о сети
interface NetworkInfo {
  id: string
  name: string
  logo: string
  logoUrl?: string
}

// Интерфейс для информации о токене
interface TokenInfo {
  symbol: string
  name: string
  logoUrl?: string
  bannerUrl?: string
  marketCap?: number
  formattedMarketCap?: string
}

// Маппинг chainId из DexScreener в информацию о сети с логотипами из cryptologos.cc
export const getNetworkInfo = (chainId: string): NetworkInfo | null => {
  const networkMapping: Record<string, NetworkInfo> = {
    solana: { id: 'solana', name: 'Solana', logo: '◎', logoUrl: 'https://cryptologos.cc/logos/solana-sol-logo.png' },
    ethereum: { id: 'ethereum', name: 'Ethereum', logo: '⟠', logoUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
    bsc: { id: 'bsc', name: 'BNB Chain', logo: 'B', logoUrl: 'https://cryptologos.cc/logos/bnb-bnb-logo.png' },
    ton: { id: 'ton', name: 'TON', logo: '💎', logoUrl: 'https://cryptologos.cc/logos/ton-ton-logo.png' },
    base: { id: 'base', name: 'Base', logo: '⬡', logoUrl: 'https://cryptologos.cc/logos/base-protocol-base-logo.png' },
    polygon: { id: 'polygon', name: 'Polygon', logo: '⬡', logoUrl: 'https://cryptologos.cc/logos/polygon-matic-logo.png' },
    sui: { id: 'sui', name: 'Sui', logo: 'S', logoUrl: 'https://cryptologos.cc/logos/sui-sui-logo.png' },
    monad: { id: 'monad', name: 'Monad', logo: 'M' },
    arbitrum: { id: 'arbitrum', name: 'Arbitrum', logo: '⬡', logoUrl: 'https://cryptologos.cc/logos/arbitrum-arb-logo.png' },
    optimism: { id: 'optimism', name: 'Optimism', logo: '⬡', logoUrl: 'https://cryptologos.cc/logos/optimism-ethereum-op-logo.png' },
    avalanche: { id: 'avalanche', name: 'Avalanche', logo: 'A', logoUrl: 'https://cryptologos.cc/logos/avalanche-avax-logo.png' },
    fantom: { id: 'fantom', name: 'Fantom', logo: 'F', logoUrl: 'https://cryptologos.cc/logos/fantom-ftm-logo.png' },
    tron: { id: 'tron', name: 'TRON', logo: 'T', logoUrl: 'https://cryptologos.cc/logos/tron-trx-logo.png' },
    aptos: { id: 'aptos', name: 'Aptos', logo: 'A', logoUrl: 'https://cryptologos.cc/logos/aptos-apt-logo.png' },
    near: { id: 'near', name: 'NEAR Protocol', logo: 'N', logoUrl: 'https://cryptologos.cc/logos/near-protocol-near-logo.png' },
    cosmos: { id: 'cosmos', name: 'Cosmos', logo: 'C', logoUrl: 'https://cryptologos.cc/logos/cosmos-atom-logo.png' },
    osmosis: { id: 'osmosis', name: 'Osmosis', logo: 'O', logoUrl: 'https://cryptologos.cc/logos/osmosis-osmo-logo.png' },
    injective: { id: 'injective', name: 'Injective', logo: 'I', logoUrl: 'https://cryptologos.cc/logos/injective-protocol-inj-logo.png' },
    kava: { id: 'kava', name: 'Kava', logo: 'K', logoUrl: 'https://cryptologos.cc/logos/kava-kava-logo.png' },
    canto: { id: 'canto', name: 'Canto', logo: 'C' },
    evmos: { id: 'evmos', name: 'Evmos', logo: 'E', logoUrl: 'https://cryptologos.cc/logos/evmos-evmos-logo.png' },
    thorchain: { id: 'thorchain', name: 'THORChain', logo: 'T', logoUrl: 'https://cryptologos.cc/logos/thorchain-rune-logo.png' },
    dogechain: { id: 'dogechain', name: 'Dogechain', logo: 'D' },
    metis: { id: 'metis', name: 'Metis', logo: 'M', logoUrl: 'https://cryptologos.cc/logos/metis-metis-logo.png' },
    harmony: { id: 'harmony', name: 'Harmony', logo: 'H', logoUrl: 'https://cryptologos.cc/logos/harmony-one-logo.png' },
    moonriver: { id: 'moonriver', name: 'Moonriver', logo: 'M', logoUrl: 'https://cryptologos.cc/logos/moonriver-movr-logo.png' },
    moonbeam: { id: 'moonbeam', name: 'Moonbeam', logo: 'M', logoUrl: 'https://cryptologos.cc/logos/moonbeam-glmr-logo.png' },
    celo: { id: 'celo', name: 'Celo', logo: 'C', logoUrl: 'https://cryptologos.cc/logos/celo-celo-logo.png' },
    aurora: { id: 'aurora', name: 'Aurora', logo: 'A', logoUrl: 'https://cryptologos.cc/logos/aurora-aurora-logo.png' },
    conflux: { id: 'conflux', name: 'Conflux', logo: 'C', logoUrl: 'https://cryptologos.cc/logos/conflux-cfx-logo.png' },
    filecoin: { id: 'filecoin', name: 'Filecoin', logo: 'F', logoUrl: 'https://cryptologos.cc/logos/filecoin-fil-logo.png' },
    stacks: { id: 'stacks', name: 'Stacks', logo: 'S', logoUrl: 'https://cryptologos.cc/logos/stacks-stx-logo.png' },
    tezos: { id: 'tezos', name: 'Tezos', logo: 'T', logoUrl: 'https://cryptologos.cc/logos/tezos-xtz-logo.png' },
    algorand: { id: 'algorand', name: 'Algorand', logo: 'A', logoUrl: 'https://cryptologos.cc/logos/algorand-algo-logo.png' },
    cardano: { id: 'cardano', name: 'Cardano', logo: 'C', logoUrl: 'https://cryptologos.cc/logos/cardano-ada-logo.png' },
    flow: { id: 'flow', name: 'Flow', logo: 'F', logoUrl: 'https://cryptologos.cc/logos/flow-flow-logo.png' },
    hedera: { id: 'hedera', name: 'Hedera', logo: 'H', logoUrl: 'https://cryptologos.cc/logos/hedera-hbar-logo.png' },
    klaytn: { id: 'klaytn', name: 'Klaytn', logo: 'K', logoUrl: 'https://cryptologos.cc/logos/klaytn-klay-logo.png' },
    icon: { id: 'icon', name: 'ICON', logo: 'I', logoUrl: 'https://cryptologos.cc/logos/icon-icx-logo.png' },
    waves: { id: 'waves', name: 'Waves', logo: 'W', logoUrl: 'https://cryptologos.cc/logos/waves-waves-logo.png' },
    velas: { id: 'velas', name: 'Velas', logo: 'V' },
    oasis: { id: 'oasis', name: 'Oasis', logo: 'O', logoUrl: 'https://cryptologos.cc/logos/oasis-network-rose-logo.png' },
    zilliqa: { id: 'zilliqa', name: 'Zilliqa', logo: 'Z', logoUrl: 'https://cryptologos.cc/logos/zilliqa-zil-logo.png' },
    iotex: { id: 'iotex', name: 'IoTeX', logo: 'I', logoUrl: 'https://cryptologos.cc/logos/iotex-iotx-logo.png' },
    theta: { id: 'theta', name: 'Theta', logo: 'T', logoUrl: 'https://cryptologos.cc/logos/theta-theta-logo.png' },
    elrond: { id: 'elrond', name: 'MultiversX (Elrond)', logo: 'M', logoUrl: 'https://cryptologos.cc/logos/multiversx-egld-logo.png' },
    terra: { id: 'terra', name: 'Terra', logo: 'T', logoUrl: 'https://cryptologos.cc/logos/terra-luna-logo.png' },
    cronos: { id: 'cronos', name: 'Cronos', logo: 'C', logoUrl: 'https://cryptologos.cc/logos/cronos-cro-logo.png' },
    dfk: { id: 'dfk', name: 'DFK Chain', logo: 'D' },
    godwoken: { id: 'godwoken', name: 'Godwoken', logo: 'G' },
    rollux: { id: 'rollux', name: 'Rollux', logo: 'R' },
    syscoin: { id: 'syscoin', name: 'Syscoin', logo: 'S', logoUrl: 'https://cryptologos.cc/logos/syscoin-sys-logo.png' },
    pulse: { id: 'pulse', name: 'PulseChain', logo: 'P' },
    wanchain: { id: 'wanchain', name: 'Wanchain', logo: 'W', logoUrl: 'https://cryptologos.cc/logos/wanchain-wan-logo.png' },
    bluzelle: { id: 'bluzelle', name: 'Bluzelle', logo: 'B' },
    bitgert: { id: 'bitgert', name: 'Bitgert', logo: 'B' },
    vechain: { id: 'vechain', name: 'VeChain', logo: 'V', logoUrl: 'https://cryptologos.cc/logos/vechain-vet-logo.png' },
    xdc: { id: 'xdc', name: 'XDC Network', logo: 'X', logoUrl: 'https://cryptologos.cc/logos/xdc-network-xdc-logo.png' },
    kaspa: { id: 'kaspa', name: 'Kaspa', logo: 'K' },
    zeta: { id: 'zeta', name: 'ZetaChain', logo: 'Z' },
    linea: { id: 'linea', name: 'Linea', logo: 'L' },
    manta: { id: 'manta', name: 'Manta', logo: 'M' },
    scroll: { id: 'scroll', name: 'Scroll', logo: 'S' },
    zklink: { id: 'zklink', name: 'zkLink', logo: 'Z' },
    taiko: { id: 'taiko', name: 'Taiko', logo: 'T' },
    sei: { id: 'sei', name: 'Sei', logo: 'S' },
    berachain: { id: 'berachain', name: 'Berachain', logo: 'B' },
    xlayer: { id: 'xlayer', name: 'XLayer', logo: 'X' },
    mode: { id: 'mode', name: 'Mode', logo: 'M' },
    blast: { id: 'blast', name: 'Blast', logo: 'B' },
    starknet: { id: 'starknet', name: 'Starknet', logo: 'S', logoUrl: 'https://cryptologos.cc/logos/starknet-strk-logo.png' },
    zksync: { id: 'zksync', name: 'zkSync', logo: 'Z', logoUrl: 'https://cryptologos.cc/logos/zk-sync-zk-logo.png' },
    immutable: { id: 'immutable', name: 'Immutable X', logo: 'I', logoUrl: 'https://cryptologos.cc/logos/immutable-x-imx-logo.png' },
    mantle: { id: 'mantle', name: 'Mantle', logo: 'M', logoUrl: 'https://cryptologos.cc/logos/mantle-mnt-logo.png' },
    coredao: { id: 'coredao', name: 'Core', logo: 'C' },
    bob: { id: 'bob', name: 'BOB', logo: 'B' },
    boba: { id: 'boba', name: 'Boba', logo: 'B' },
    metal: { id: 'metal', name: 'Metal', logo: 'M' },
    degen: { id: 'degen', name: 'Degen', logo: 'D' },
  }

  return networkMapping[chainId] || null
}

// Функция форматирования капитализации
export const formatMarketCap = (marketCap: number): string => {
  if (!marketCap || marketCap === 0) return '0'

  if (marketCap < 1000) {
    return marketCap.toFixed(2)
  } else if (marketCap < 1_000_000) {
    return (marketCap / 1_000).toFixed(2) + 'к'
  } else if (marketCap < 1_000_000_000) {
    return (marketCap / 1_000_000).toFixed(2) + 'м'
  } else {
    return (marketCap / 1_000_000_000).toFixed(2) + 'б'
  }
}

// Функция проверки, является ли строка адресом контракта
const isValidContractAddress = (text: string): boolean => {
  if (!text || typeof text !== 'string') return false
  
  const trimmed = text.trim()
  
  // EVM адреса (0x + 40 hex символов = 42 символа)
  const evmRegex = /^0x[a-fA-F0-9]{40}$/
  
  // Solana адреса (base58, 32-44 символа)
  const solanaRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/
  
  // TON адреса (EQ или UQ + 48 символов)
  const tonRegex = /^(EQ|UQ)[a-zA-Z0-9_-]{48}$/
  
  return evmRegex.test(trimmed) || solanaRegex.test(trimmed) || tonRegex.test(trimmed)
}

// Функция для определения сети и данных токена через DexScreener API
const fetchTokenFromDexScreener = async (contractAddress: string): Promise<{ network: NetworkInfo | null, token: TokenInfo | null } | null> => {
  if (!contractAddress || contractAddress.length < 10) return null

  try {
    const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${contractAddress}`)
    if (!response.ok) return null

    const data = await response.json()
    if (!data.pairs || !Array.isArray(data.pairs) || data.pairs.length === 0) return null

    const firstPair = data.pairs[0]
    const chainId = firstPair.chainId

    // Получаем информацию о сети
    const networkInfo = getNetworkInfo(chainId)

    // Получаем информацию о токене
    const tokenInfo: TokenInfo = {
      symbol: firstPair.baseToken.symbol || '',
      name: firstPair.baseToken.name || '',
      logoUrl: firstPair.info?.imageUrl || undefined,
      bannerUrl: firstPair.info?.headerImage || undefined,
      marketCap: firstPair.fdv || firstPair.marketCap || undefined,
      formattedMarketCap: (firstPair.fdv || firstPair.marketCap) ? formatMarketCap(firstPair.fdv || firstPair.marketCap) : undefined,
    }

    return { network: networkInfo, token: tokenInfo }
  } catch (error) {
    console.error('Error fetching token from DexScreener:', error)
    return null
  }
}

const CATEGORY_FIELDS: Record<CallCategory, FieldConfig[]> = {
  memecoins: [
    { key: 'contract', label: 'Адрес (контракт)', placeholder: '0x... или адрес токена', section: 'basic' },
    {
      key: 'holdPlan',
      label: 'Тип стратегии',
      type: 'select',
      options: [
        { value: 'flip', label: 'Флип' },
        { value: 'medium', label: 'Среднесрок' },
        { value: 'long', label: 'Дальнесрок' },
      ],
      section: 'basic',
    },
    { key: 'traderComment', label: 'Комментарий трейдера', type: 'textarea', placeholder: 'Доп. наблюдения, планы...', section: 'additional' },
  ],
  futures: [
    { key: 'pair', label: 'Пара', placeholder: 'BTC/USDT', section: 'basic' },
    { key: 'link', label: 'Ссылка на сделку', placeholder: 'BingX / MEXC / Bybit / OKX', section: 'basic' },
    {
      key: 'direction',
      label: 'Направление',
      type: 'select',
      options: [
        { value: 'long', label: 'Long' },
        { value: 'short', label: 'Short' },
      ],
      section: 'basic',
    },
    { key: 'entryZone', label: 'Зоны входа', placeholder: '69000 - 70000', section: 'entry' },
    { key: 'targets', label: 'Цели', placeholder: '71000 / 72500 / 74000', section: 'targets' },
    { key: 'stopLoss', label: 'Рекомендованный SL', placeholder: '68000', section: 'targets' },
    { key: 'traderComment', label: 'Комментарий трейдера', type: 'textarea', placeholder: 'Доп. наблюдения, планы...', section: 'additional' },
  ],
  spot: [
    { key: 'coin', label: 'Монета', placeholder: 'BTC', section: 'basic' },
    { key: 'link', label: 'Ссылка на сделку', placeholder: 'BingX / MEXC / Bybit / OKX', section: 'basic' },
    {
      key: 'holdingHorizon',
      label: 'Горизонт удержания',
      type: 'select',
      options: [
        { value: 'short', label: 'Краткосрок' },
        { value: 'medium', label: 'Среднесрок' },
        { value: 'long', label: 'Долгосрок' },
      ],
      section: 'basic',
    },
    { key: 'entryZone', label: 'Зона входа', placeholder: '500M или 0.000012', section: 'entry' },
    { key: 'targets', label: 'Цели', placeholder: '550M / 650M / 750M', section: 'targets' },
    { key: 'stopLoss', label: 'Рекомендованный SL', placeholder: '-10% или 450M', section: 'targets' },
    { key: 'traderComment', label: 'Комментарий трейдера', type: 'textarea', placeholder: 'Условия фиксации, обновления', section: 'additional' },
  ],
  polymarket: [
    { key: 'event', label: 'Событие', placeholder: 'Trump wins 2025', section: 'basic' },
    { key: 'eventLink', label: 'Ссылка на событие', placeholder: 'https://polymarket.com/...', section: 'basic' },
    {
      key: 'positionType',
      label: 'Тип позиции',
      type: 'select',
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
      ],
      section: 'entry',
    },
    { key: 'entryPrice', label: 'Цена входа', placeholder: '42%', section: 'entry' },
 { key: 'expectedProbability', label: 'Ожидаемая вероятность', placeholder: '65%', section: 'entry' },
 {
 key: 'targetPlan',
 label: 'Цель',
 type: 'select',
 options: [
 { value: 'Продажа до события', label: 'Продажа до события' },
 { value: 'Удержание до конца', label: 'Удержание до конца' },
 ],
 section: 'targets',
 },
    { key: 'traderComment', label: 'Комментарий трейдера', type: 'textarea', placeholder: 'Доп. наблюдения, планы...', section: 'additional' },
  ],
}

const buildEmptyDetails = (): FormDetailsState => ({
  memecoins: {
    network: 'solana',
    contract: '',
    holdPlan: 'flip',
    traderComment: '',
  },
  futures: {
    pair: '',
    direction: 'long',
    entryZone: '',
    targets: '',
    stopLoss: '',
    riskLevel: 'medium',
    traderComment: '',
    link: '',
  },
  spot: {
    coin: '',
    entryZone: '',
    targets: '',
    stopLoss: '',
    holdingHorizon: 'medium',
    traderComment: '',
    link: '',
  },
  polymarket: {
    event: '',
    eventLink: '',
    positionType: 'yes',
    entryPrice: '',
    expectedProbability: '',
    eventDeadline: '',
    riskLevel: 'medium',
    targetPlan: '',
    traderComment: '',
  },
  nft: {
    nftLink: '',
    targets: '',
    traderComment: '',
  },
})

const mergeDetails = (base: FormDetailsState, incoming?: CallDetails): FormDetailsState => ({
  memecoins: { ...base.memecoins, ...(incoming?.memecoins || {}) },
  futures: { ...base.futures, ...(incoming?.futures || {}) },
  spot: { ...base.spot, ...(incoming?.spot || {}) },
  polymarket: { ...base.polymarket, ...(incoming?.polymarket || {}) },
  nft: { ...base.nft, ...(incoming?.nft || {}) },
})

export const CallForm = ({ onSuccess, onCancel, callToEdit, initialCategory, category: categoryProp, onCategoryChange, showCategorySelector = true }: CallFormProps) => {
  const { theme } = useThemeStore()
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [detectingNetwork, setDetectingNetwork] = useState(false)
  const [detectedNetworkInfo, setDetectedNetworkInfo] = useState<NetworkInfo | null>(null)
  const [detectedTokenInfo, setDetectedTokenInfo] = useState<TokenInfo | null>(null)

  const defaultDetails = mergeDetails(buildEmptyDetails(), callToEdit?.details)
  const [internalCategory, setInternalCategory] = useState<CallCategory>(callToEdit?.category || initialCategory || 'memecoins')
  const [details, setDetails] = useState<FormDetailsState>(defaultDetails)
  const [isTeam, setIsTeam] = useState<boolean>(callToEdit?.isTeam ?? false)

  // Use controlled category if provided, otherwise use internal state
  const category = categoryProp ?? internalCategory
  const setCategory = (newCategory: CallCategory) => {
    setInternalCategory(newCategory)
    onCategoryChange?.(newCategory)
    // Also update details when category changes
    setDetails((prev) => ({
      ...prev,
    }))
  }

  useEffect(() => {
    const merged = mergeDetails(buildEmptyDetails(), callToEdit?.details)
    setDetails(merged)
    if (!categoryProp) {
      const newCategory = callToEdit?.category || initialCategory || 'memecoins'
      setInternalCategory(newCategory)
      onCategoryChange?.(newCategory)
    }
  }, [callToEdit, initialCategory, categoryProp])
  
  // Reset form fields when category changes (not on edit)
  useEffect(() => {
    if (callToEdit) return // Don't reset when editing
    
    // Clear fields for the new category
    setDetails(prev => ({
      ...prev,
      [category]: buildEmptyDetails()[category]
    }))
  }, [category, callToEdit])

  // Автоматическая вставка контракта из буфера обмена при открытии формы добавления
  useEffect(() => {
    // Только при создании нового сигнала (не редактировании)
    if (callToEdit) return
    
    // Только для мемкоинов
    if (category !== 'memecoins') return

    // Если контракт уже заполнен - не перезаписываем
    if (details.memecoins?.contract) return

    const checkClipboard = async () => {
      try {
        const clipboardText = await navigator.clipboard.readText()
        if (clipboardText && isValidContractAddress(clipboardText)) {
          console.log('📋 Контракт обнаружен в буфере обмена:', clipboardText.slice(0, 10) + '...')
          updateField('contract', clipboardText.trim())
        }
      } catch (err) {
        // Игнорируем ошибки доступа к буферу - это нормально в некоторых браузерах
        console.debug('Не удалось прочитать буфер обмена:', err)
      }
    }

    // Небольшая задержка, чтобы форма успела отрисоваться
    const timer = setTimeout(checkClipboard, 300)
    return () => clearTimeout(timer)
  }, [callToEdit, category])

  // Автоматическое определение сети и данных токена для мемкоинов при изменении контракта
  useEffect(() => {
    if (category !== 'memecoins') return

    const contract = (details as any)[category]?.contract
    if (!contract || contract.length < 10) {
      setDetectedNetworkInfo(null)
      setDetectedTokenInfo(null)
      return
    }

    // Не определяем данные, если это редактирование и они уже установлены
    if (callToEdit && callToEdit.details?.memecoins?.network) {
      // Если данные уже установлены, показываем их
      const existingNetwork = callToEdit.details?.memecoins?.network
      setDetectedNetworkInfo(getNetworkInfo(existingNetwork))
      // Если есть MC в сигнале, показываем и его
      if (callToEdit.signalMarketCap) {
        setDetectedTokenInfo({
          symbol: '',
          name: '',
          formattedMarketCap: formatMarketCap(callToEdit.signalMarketCap),
        })
      }
      return
    }

    const timer = setTimeout(async () => {
      setDetectingNetwork(true)
      try {
        const result = await fetchTokenFromDexScreener(contract)
        if (result) {
          setDetectedNetworkInfo(result.network)
          setDetectedTokenInfo(result.token)
          if (result.network) {
            updateField('network', result.network.id as any)
          }
          // Сохраняем логотип и символ токена
          if (result.token?.symbol) {
            updateField('tokenSymbol', result.token.symbol)
          }
          if (result.token?.logoUrl) {
            updateField('tokenLogo', result.token.logoUrl)
          }
        }
      } catch (error) {
        console.error('Error detecting token data:', error)
        setDetectedNetworkInfo(null)
        setDetectedTokenInfo(null)
      } finally {
        setDetectingNetwork(false)
      }
    }, 800) // Debounce 800ms

    return () => clearTimeout(timer)
  }, [category, details.memecoins?.contract, callToEdit])

  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const borderColor = theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
  const subtle = theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
  const subtleColor = subtle
  const bgColor = theme === 'dark' ? 'bg-[#121212]' : 'bg-white'

  const updateField = (key: string, value: any) => {
    setDetails((prev: FormDetailsState) => ({
      ...prev,
      [category]: {
        ...(prev as any)[category],
        [key]: value,
      },
    }))
  }

  const deriveRiskLevel = (payload: any): CallRiskLevel | undefined => {
    return payload?.riskLevel || payload?.protocolRisk || undefined
  }

  const deriveSentiment = (payload: any): CallSentiment | undefined => {
    if (payload?.signalType) return payload.signalType
    if (payload?.direction === 'long') return 'buy'
    if (payload?.direction === 'short') return 'sell'
    return undefined
  }

  // Copy renderCategoryMetrics from Call.tsx
  const renderCategoryMetrics = (call: Call) => {
    const d = getDetails(call)
    const risk = getRiskLevel(call) as CallRiskLevel
    const catGradient = getCategoryGradient(call.category, theme)
    const metrics: { label: string; value?: string; icon: JSX.Element }[] = []

    const addMetric = (label: string, value: string | undefined, icon: JSX.Element) => {
      if (!value) return
      metrics.push({ label, value, icon })
    }

    switch (call.category) {
      case 'memecoins':
        addMetric('Контракт', shortenValue(d.contract, 20), <Link2 className="w-4 h-4" />)
        addMetric('Сеть', d.network ? String(d.network).toUpperCase() : '', <Globe2 className="w-4 h-4" />)
        addMetric('Стратегия', d.holdPlan === 'flip' ? 'Флип' : d.holdPlan === 'medium' ? 'Среднесрок' : 'Дальнесрок', <TrendingUp className="w-4 h-4" />)
        break
      case 'futures':
        addMetric('Пара', d.pair, <Activity className="w-4 h-4" />)
        addMetric('Направление', d.direction ? d.direction.toUpperCase() : '', <TrendingUp className="w-4 h-4" />)
        addMetric('Зона входа', d.entryZone, <MapPin className="w-4 h-4" />)
        addMetric('Цели', d.targets, <Target className="w-4 h-4" />)
        addMetric('SL', d.stopLoss, <Octagon className="w-4 h-4" />)
        if (d.link) {
          addMetric('Ссылка', 'Открыть', <Globe2 className="w-4 h-4" />)
        }
        break
      case 'spot':
        addMetric('Монета', d.coin, <Coins className="w-4 h-4" />)
        addMetric('Зона входа', d.entryZone, <MapPin className="w-4 h-4" />)
        addMetric('Цели', d.targets, <Target className="w-4 h-4" />)
        addMetric('SL', d.stopLoss, <Octagon className="w-4 h-4" />)
        addMetric('Горизонт', d.holdingHorizon, <Clock3 className="w-4 h-4" />)
        if (d.link) {
          addMetric('Ссылка', 'Открыть', <Globe2 className="w-4 h-4" />)
        }
        break
      case 'polymarket':
        addMetric('Событие', d.event, <ScrollText className="w-4 h-4" />)
        addMetric('Ссылка', d.eventLink, <Link2 className="w-4 h-4" />)
        addMetric('Тип', d.positionType ? d.positionType.toUpperCase() : '', <Shield className="w-4 h-4" />)
        addMetric('Вход %', d.entryPrice, <Percent className="w-4 h-4" />)
        addMetric('Ожидание %', d.expectedProbability, <Gauge className="w-4 h-4" />)
        addMetric('Цель', d.targetPlan, <Target className="w-4 h-4" />)
        break
    }

    const visibleMetrics = metrics.filter((m) => m.value)
    if (!visibleMetrics.length) return null

    return (
      <div className={`rounded-2xl border ${borderColor} ${theme === 'dark' ? 'bg-gray-900/60' : 'bg-white'}`}>
        <div className={`flex items-center gap-2 px-4 py-3 border-b ${borderColor} ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
          <div className={`p-1.5 rounded-lg bg-gradient-to-br ${catGradient} text-white`}>
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <p className={`text-sm font-semibold ${textColor}`}>Ключевые метрики</p>
          <span className={`ml-auto text-[11px] font-semibold px-3 py-1 rounded-full ${riskBadges[risk]}`}>
            Риск: {risk}
          </span>
        </div>
        <div className="divide-y divide-gray-200/70 dark:divide-white/10">
          {visibleMetrics.map((metric) => (
            <div key={metric.label} className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl bg-gradient-to-br ${catGradient} text-white`}>
                  {metric.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs uppercase tracking-wide ${subtleColor}`}>{metric.label}</p>
                  <p className={`${textColor} font-semibold whitespace-pre-wrap break-words`}>{metric.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Generate preview call object
  const generatePreviewCall = (): Call => {
    const activePayload = (details as any)[category]
    const payloadDetails: CallDetails = {
      [category]: activePayload,
    }

    const sentiment = deriveSentiment(activePayload)
    const riskLevel = deriveRiskLevel(activePayload)

    const previewCall: Call = {
      id: 'preview',
      userId: user?.id || 'unknown',
      category,
      details: payloadDetails,
      createdAt: new Date().toISOString(),
      status: 'active',
      tags: [],
      sentiment,
      riskLevel,
    }

    // Добавляем marketCap из detectedTokenInfo для предпросмотра
    if (detectedTokenInfo?.marketCap) {
      previewCall.signalMarketCap = detectedTokenInfo.marketCap
      previewCall.currentMarketCap = detectedTokenInfo.marketCap
    }

    return previewCall
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    setLoading(true)
    try {
      const activePayload = (details as any)[category]
      const payloadDetails: CallDetails = {
        ...callToEdit?.details,
        [category]: activePayload,
      }

      const userId = callToEdit?.userId || user?.id || 'unknown'

      const baseData: Omit<Call, 'id'> = {
        userId,
        category,
        details: payloadDetails,
        createdAt: callToEdit?.createdAt || new Date().toISOString(),
        publishedAt: callToEdit?.publishedAt || (!callToEdit ? new Date().toISOString() : undefined),
        status: callToEdit?.status || 'active',
        tags: callToEdit?.tags || [],
        isTeam: isTeam,
      }

      // Обработка описания для мемкоинов
      if (category === 'memecoins') {
        let description = activePayload?.traderComment || ''
        const suffix = '\n\nНе ИИР, проводите собственный анализ!'

        // Если стратегия флип и нет описания, добавляем стандартное
        if (activePayload?.holdPlan === 'flip' && (!description || description.trim() === '')) {
          description = 'АО: Решай на лету — или проходи'
        }

        // Добавляем суффикс про ИИР, если его ещё нет
        if (!description.includes('Не ИИР, проводите собственный анализ!')) {
          description = description.trim() + suffix
        }

        activePayload.traderComment = description
      }

 // Добавление приписки для Polymarket - специальный текст
 if (category === 'polymarket') {
 const suffix = '\n\nАО: проверь время сигнала!\n\nНе ИИР, проводите собственный анализ!'
 // Всегда добавляем суффикс (независимо от того, есть комментарий или нет)
 const currentComment = activePayload?.traderComment || ''
 if (!currentComment.includes('АО: проверь время сигнала!')) {
 // Если комментарий пустой - не добавляем перенос в начале
 activePayload.traderComment = currentComment.trim() 
 ? currentComment.trim() + suffix 
 : 'АО: проверь время сигнала!\n\nНе ИИР, проводите собственный анализ!'
 }
 }

 // Добавление приписки для Spot, Futures - как для Polymarket
 if (category === 'spot' || category === 'futures') {
 const suffix = '\n\nАО: проверь время сигнала!\n\nНе ИИР, проводите собственный анализ!'
 // Всегда добавляем суффикс (независимо от того, есть комментарий или нет)
 const currentComment = activePayload?.traderComment || ''
 if (!currentComment.includes('АО: проверь время сигнала!')) {
 // Если комментарий пустой - не добавляем перенос в начале
 activePayload.traderComment = currentComment.trim() 
 ? currentComment.trim() + suffix 
 : 'АО: проверь время сигнала!\n\nНе ИИР, проводите собственный анализ!'
 }
 }

      const sentiment = deriveSentiment(activePayload)
      if (sentiment) baseData.sentiment = sentiment

      const riskLevel = deriveRiskLevel(activePayload)
      if (riskLevel) baseData.riskLevel = riskLevel

      // Сохраняем marketCap из detectedTokenInfo при создании нового сигнала
      if (!callToEdit && detectedTokenInfo?.marketCap) {
        baseData.signalMarketCap = detectedTokenInfo.marketCap
        baseData.currentMarketCap = detectedTokenInfo.marketCap
      }

      if (callToEdit?.maxProfit !== undefined) baseData.maxProfit = callToEdit.maxProfit
      if (callToEdit?.currentPnL !== undefined) baseData.currentPnL = callToEdit.currentPnL
      if (callToEdit?.currentMarketCap !== undefined) baseData.currentMarketCap = callToEdit.currentMarketCap
      if (callToEdit?.signalMarketCap !== undefined) baseData.signalMarketCap = callToEdit.signalMarketCap
      if (callToEdit?.currentPrice !== undefined) baseData.currentPrice = callToEdit.currentPrice
      if (callToEdit?.entryPrice !== undefined) baseData.entryPrice = callToEdit.entryPrice

      if (callToEdit) {
        await updateCall(callToEdit.id, baseData)
      } else {
        await addCall(baseData)
      }
      onSuccess?.()
    } catch (err) {
      console.error('Error creating call:', err)
      const message = (err as any)?.message || (err as any)?.code || 'Ошибка при сохранении сигнала'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const renderField = (field: FieldConfig) => {
    const activePayload = (details as any)[category] || {}
    const value = activePayload[field.key]
    const common = `w-full px-4 py-2.5 rounded-lg border ${borderColor} ${theme === 'dark' ? 'bg-gray-800/80' : 'bg-gray-50'} ${textColor} focus:outline-none focus:ring-2 focus:ring-[#4E6E49] transition-all`

    if (field.type === 'textarea') {
      return (
        <textarea
          value={value || ''}
          onChange={(e) => updateField(field.key, e.target.value)}
          className={`${common} min-h-[100px] resize-y`}
          placeholder={field.placeholder}
        />
      )
    }

    if (field.type === 'select' && field.options) {
      const cols = field.options.length <= 3 ? 'grid-cols-1 sm:grid-cols-3' :
        field.options.length <= 4 ? 'grid-cols-2 sm:grid-cols-4' :
          'grid-cols-2 sm:grid-cols-3'
      const catGradient = getCategoryGradient(category, theme)
      return (
        <div className={`grid ${cols} gap-2 sm:gap-3`}>
          {field.options.map((opt) => {
            const isSelected = value === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => updateField(field.key, opt.value)}
                className={`px-3 py-3 sm:py-2.5 rounded-lg border-2 text-sm font-medium transition-all duration-300 min-h-[44px] sm:min-h-[40px] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#4E6E49]/30 ${isSelected
                  ? `bg-gradient-to-r ${catGradient} text-white shadow-md border-transparent`
                  : `${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:border-gray-600' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-400'}`
                  }`}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      )
    }

    if (field.type === 'checkbox') {
      return (
        <label className="inline-flex items-center gap-3 cursor-pointer select-none p-3 sm:p-3 rounded-lg border transition-all duration-200 min-h-[48px] sm:min-h-[44px] hover:shadow-sm ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}">
          <input
            type="checkbox"
            checked={!!value}
            onChange={(e) => updateField(field.key, e.target.checked)}
            className="accent-[#4E6E49] w-5 h-5 sm:w-4 sm:h-4"
          />
          <span className={`font-medium ${textColor} text-sm sm:text-base`}>{field.label}</span>
        </label>
      )
    }

    return (
      <div className="relative">
        <input
          type="text"
          value={value || ''}
          onChange={(e) => updateField(field.key, e.target.value)}
          className={common}
          placeholder={field.placeholder}
        />
        {field.key === 'contract' && value && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {detectingNetwork && (
              <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
            )}
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(String(value))
              }}
              className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-500'}`}
              title="Скопировать контракт"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-red-900/30 border border-red-700/50 text-red-300' : 'bg-red-50 border border-red-200 text-red-800'} flex items-center gap-3 animate-in shake`}>
            <AlertTriangle className="w-5 h-5 shrink-0" />
            {error}
          </div>
        )}

        {/* Category Selection - Enhanced Design */}
        {showCategorySelector && (
          <div className={`relative rounded-2xl border ${borderColor} ${theme === 'dark' ? 'bg-gray-900/60' : 'bg-white'} p-5 overflow-hidden`}>
            {/* Gradient accent bar using category color */}
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getCategoryGradient(category, theme)}`} />

            <div className="flex items-center gap-3 mb-5">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-lg bg-gradient-to-br ${getCategoryGradient(category, theme)}`}>
                <Target className="w-5 h-5" />
              </div>
              <div>
                <p className={`text-lg font-bold ${textColor}`}>Тип сигнала</p>
                <p className={`text-xs ${subtle}`}>Выберите категорию для вашего сигнала</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {(Object.keys(CATEGORY_META) as CallCategory[]).map((cat) => {
                const meta = CATEGORY_META[cat]
                const catGradient = getCategoryGradient(cat, theme)
                const isSelected = category === cat
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`relative p-4 rounded-xl border-2 transition-all duration-300 group overflow-hidden ${isSelected
                      ? `border-transparent shadow-lg shadow-${catGradient.split(' ')[0].replace('from-', '').split('-')[0]}-500/20 scale-[1.02]`
                      : `border-gray-700 hover:border-gray-600 hover:shadow-lg hover:-translate-y-0.5 ${theme === 'dark' ? 'bg-gray-800/30' : 'bg-gray-50'}`
                      }`}
                  >
                    {/* Gradient background for selected */}
                    {isSelected && (
                      <div className={`absolute inset-0 bg-gradient-to-br ${catGradient} opacity-30 rounded-xl`} />
                    )}

                    {/* Subtle gradient for non-selected in dark mode */}
                    {!isSelected && theme === 'dark' && (
                      <div className={`absolute inset-0 bg-gradient-to-br ${catGradient.replace('from-', 'from-').replace(' to-', ' to-')} opacity-5 rounded-xl`} />
                    )}

                    <div className="relative flex flex-col items-center gap-2.5 text-center">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${isSelected
                        ? `bg-gradient-to-br ${catGradient} text-white shadow-md`
                        : `${theme === 'dark' ? 'bg-gray-700/50 text-gray-400' : 'bg-gray-100 text-gray-500'} group-hover:${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'}`}`}>
                        <div className="w-5 h-5">
                          {meta.icon}
                        </div>
                      </div>
                      <div className="w-full">
                        <span className={`text-sm font-bold block transition-colors ${isSelected ? `bg-gradient-to-r ${catGradient} bg-clip-text text-transparent` : textColor}`}>
                          {meta.label}
                        </span>
                        {isSelected && (
                          <span className={`text-[10px] bg-gradient-to-r ${catGradient} bg-clip-text text-transparent font-medium`}>Выбрано</span>
                        )}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Team Switcher - Общий / Team */}
        <div className={`relative rounded-2xl border ${borderColor} ${theme === 'dark' ? 'bg-gray-900/60' : 'bg-white'} p-5 overflow-hidden`}>
          {/* Gradient accent bar using category color */}
          <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getCategoryGradient(category, theme)}`} />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br ${getCategoryGradient(category, theme)} text-white`}>
                {isTeam ? <Users className="w-5 h-5" /> : <Globe className="w-5 h-5" />}
              </div>
              <div>
                <p className={`text-lg font-bold ${textColor}`}>Тип сигнала</p>
                <p className={`text-xs ${subtle}`}>Публичный или для команды</p>
              </div>
            </div>
            
            {/* Toggle Switch */}
            <div className="flex items-center gap-3">
              <span className={`text-sm font-medium transition-colors ${!isTeam ? textColor : subtle}`}>
                Общий
              </span>
              <button
                type="button"
                onClick={() => setIsTeam(!isTeam)}
                className={`relative w-16 h-8 rounded-full transition-all duration-300 bg-gradient-to-r ${getCategoryGradient(category, theme)} shadow-lg`}
              >
                <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300 ${
                  isTeam ? 'left-9' : 'left-1'
                }`} />
              </button>
              <span className={`text-sm font-medium transition-colors ${isTeam ? textColor : subtle}`}>
                Team
              </span>
            </div>
          </div>
          
          {/* Description */}
          <div className={`mt-4 p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
            <p className={`text-sm ${subtle}`}>
              {isTeam 
                ? 'Сигнал будет виден только участникам команды ARCA. Доступ ограничен.' 
                : 'Сигнал будет опубликован и доступен всем пользователям платформы.'}
            </p>
          </div>
        </div>

        {/* Signal Details - Enhanced Card */}
        <div className={`relative rounded-2xl border ${borderColor} ${theme === 'dark' ? 'bg-gray-900/60' : 'bg-white'} p-5 overflow-hidden`}>
          {/* Decorative gradient accent using category color */}
          <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getCategoryGradient(category, theme)}`} />
          <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${getCategoryGradient(category, theme).replace('from-', '').replace(' to-', '/10 to-')} to-transparent rounded-full blur-2xl opacity-30`} />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative">
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-lg bg-gradient-to-br ${getCategoryGradient(category, theme)}`}>
                <ScrollText className="w-5 h-5" />
              </div>
              <div>
                <p className={`text-lg font-bold ${textColor}`}>{CATEGORY_META[category].label}</p>
                <p className={`text-xs ${subtle}`}>Заполните детали сигнала</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {Object.entries(CATEGORY_SECTIONS[category]).map(([sectionKey, sectionConfig]) => {
              const sectionFields = CATEGORY_FIELDS[category].filter(field => field.section === sectionKey)
              if (sectionFields.length === 0) return null

              return (
                <div
                  key={sectionKey}
                  className="relative space-y-4"
                >
                  {/* Section header with accent */}
                  <div className="flex items-center gap-3 pb-3 border-b border-gray-200/50 dark:border-gray-700/50">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${getCategoryGradient(category, theme)} text-white`}>
                      {sectionConfig.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-base font-bold ${textColor}`}>{sectionConfig.title}</h3>
                      {sectionConfig.description && (
                        <p className={`text-xs ${subtle}`}>{sectionConfig.description}</p>
                      )}
                    </div>
                    <div className={`h-px flex-1 bg-gradient-to-r from-transparent ${getCategoryGradient(category, theme).replace('from-', 'via-')} to-transparent opacity-20`} />
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {sectionFields.map((field) => (
                      <div key={field.key} className="space-y-2">
                        {field.type !== 'checkbox' && (
                          <label className={`text-sm font-semibold ${textColor} flex items-center gap-2`}>
                            {field.label}
                            {field.required && <span className="text-red-500">*</span>}
                          </label>
                        )}
                        {renderField(field)}

                        {/* Отображение определенной сети и данных токена для мемкоинов после поля контракта */}
                        {category === 'memecoins' && field.key === 'contract' && detectedNetworkInfo && (
                          <div className={`mt-3 p-4 rounded-xl border ${theme === 'dark' ? 'bg-gradient-to-r from-emerald-900/20 to-cyan-900/20 border-emerald-500/30' : 'bg-gradient-to-r from-emerald-50 to-cyan-50 border-emerald-200'} space-y-3 animate-in slide-in-from-left-2 duration-300`}>
                            {/* Сеть */}
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${getCategoryGradient(category, theme)} text-white shadow-lg overflow-hidden`}>
                                {detectedNetworkInfo.logoUrl ? (
                                  <img
                                    src={detectedNetworkInfo.logoUrl}
                                    alt={detectedNetworkInfo.name}
                                    className="w-6 h-6 object-contain"
                                    onError={(e) => {
                                      // Fallback к эмодзи если изображение не загрузилось
                                      e.currentTarget.style.display = 'none'
                                      const fallback = e.currentTarget.nextElementSibling as HTMLElement
                                      if (fallback) fallback.style.display = 'flex'
                                    }}
                                  />
                                ) : null}
                                <span className={`text-xl font-bold ${detectedNetworkInfo.logoUrl ? 'hidden' : 'flex'}`}>
                                  {detectedNetworkInfo.logo}
                                </span>
                              </div>
                              <div className="flex-1">
                                <p className={`text-xs uppercase tracking-wide ${subtle}`}>Сеть</p>
                                <p className={`font-bold ${textColor}`}>{detectedNetworkInfo.name}</p>
                              </div>
                            </div>

                            {/* Информация о токене */}
                            {detectedTokenInfo && (
                              <div className="flex items-center gap-3 pt-2 border-t border-gray-200/30 dark:border-white/10">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${getCategoryGradient(category, theme)} text-white shadow-lg overflow-hidden`}>
                                  {detectedTokenInfo.logoUrl ? (
                                    <img
                                      src={detectedTokenInfo.logoUrl}
                                      alt={detectedTokenInfo.symbol}
                                      className="w-8 h-8 object-contain"
                                      onError={(e) => {
                                        e.currentTarget.style.display = 'none'
                                      }}
                                    />
                                  ) : detectedTokenInfo.symbol ? (
                                    <span className="text-sm font-bold">{detectedTokenInfo.symbol.slice(0, 2).toUpperCase()}</span>
                                  ) : null}
                                </div>
                                <div className="flex-1">
                                  <p className={`text-xs uppercase tracking-wide ${subtle}`}>Токен</p>
                                  <p className={`font-bold ${textColor}`}>{detectedTokenInfo.symbol || detectedTokenInfo.name || 'Неизвестно'}</p>
                                </div>
                                {detectedTokenInfo.formattedMarketCap && (
                                  <div className="text-right">
                                    <p className={`text-xs uppercase tracking-wide ${subtle}`}>CALL MC</p>
                                    <p className={`font-bold text-emerald-500 dark:text-emerald-400`}>${detectedTokenInfo.formattedMarketCap}</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {category === 'memecoins' && field.key === 'contract' && !detectedNetworkInfo && (details as any)[category]?.contract && (details as any)[category]?.contract.length >= 10 && !detectingNetwork && (
                          <div className={`mt-3 p-3 rounded-xl border ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'} flex items-center gap-3`}>
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${theme === 'dark' ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'}`}>
                              <NetworkIcon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <p className={`text-xs uppercase tracking-wide ${subtle}`}>Сеть</p>
                              <p className={`font-medium ${textColor}`}>Не определена</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 py-3.5 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${loading
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : `bg-gradient-to-r ${getCategoryGradient(category, theme)} text-white hover:shadow-xl hover:scale-[1.01] active:scale-[0.98]`
                }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>...</span>
                </>
              ) : callToEdit ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Call</span>
                </>
              ) : (
                <>
                  <Rocket className="w-4 h-4" />
                  <span>Call</span>
                </>
              )}
            </button>

            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className={`px-5 py-3.5 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                  theme === 'dark'
                    ? 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                } active:scale-[0.98]`}
              >
                <X className="w-4 h-4" />
                Undo
              </button>
            )}
          </div>
        </div>

        {/* Preview Modal - Enhanced Design */}
        {showPreview && (() => {
          const previewCall = generatePreviewCall()
          const trader = TEAM_MEMBERS.find(t => t.id === previewCall.userId)

          return (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-xl z-[80] flex items-start sm:items-center justify-center p-4 overflow-y-auto">
              {/* Animated background elements */}
              <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className={`absolute top-1/4 left-1/4 w-96 h-96 ${CATEGORY_BG_COLORS[category].primary} rounded-full blur-3xl animate-pulse`} />
                <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 ${CATEGORY_BG_COLORS[category].secondary} rounded-full blur-3xl animate-pulse`} style={{ animationDelay: '1s' }} />
              </div>

              <div className={`relative ${bgColor} rounded-3xl shadow-2xl shadow-black/50 border ${borderColor} max-w-2xl w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300`}>
                {/* Header gradient */}
                <div className={`h-2 bg-gradient-to-r ${getCategoryGradient(category, theme)}`} />

                <div className="p-6 flex items-center justify-between sticky top-0 z-10 ${bgColor} border-b ${borderColor}">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getCategoryGradient(category, theme)} flex items-center justify-center text-white shadow-lg`}>
                      <Eye className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className={`text-xl font-bold ${textColor}`}>Предпросмотр</h2>
                      <p className={`text-xs ${subtle}`}>Проверьте сигнал перед публикацией</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowPreview(false)}
                    className={`p-2 rounded-xl transition-all ${theme === 'dark' ? 'hover:bg-gray-800 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'}`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="px-6 pb-6 pt-4 overflow-y-auto max-h-[calc(90vh-100px)]">
                  {/* Preview Card */}
                  <div className={`relative rounded-2xl border-2 overflow-hidden mb-6 ${categoryTone[category].border} ${categoryTone[category].bg}`}>
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/5 to-transparent rounded-full blur-xl" />
                    <div className={`absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr ${CATEGORY_BG_COLORS[category].gradientFrom} to-transparent rounded-full blur-xl`} />

                    <div className={`relative px-5 py-4 flex flex-wrap items-center justify-between gap-3 border-b ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-white/70 bg-white/70'}`}>
                      {/* Category with Icon */}
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg bg-gradient-to-br ${getCategoryGradient(category, theme)} text-white`}>
                          {CATEGORY_META[category].icon}
                        </div>
                        <span className={`text-sm font-bold ${textColor}`}>{CATEGORY_META[category].label}</span>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-500 border border-emerald-500/30`}>
                          Активен
                        </span>
                        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${riskBadges[previewCall.riskLevel || 'medium']}`}>
                          Риск: {previewCall.riskLevel || 'medium'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-medium ${theme === 'dark' ? 'bg-gray-800/70 text-gray-300 border border-white/10' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                          Только что
                        </span>
                        {trader && (
                          <div className="flex items-center gap-2 px-2 py-1 rounded-lg border border-white/10 bg-black/5 dark:bg-white/5">
                            <Avatar user={trader} size="sm" className="w-7 h-7" />
                            <span className={`text-xs font-medium ${subtleColor}`}>{trader.name}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Category Header with Icon - REMOVED, moved above */}

                    <div className="relative p-5 space-y-5">
                      {/* Metrics */}
                      {renderCategoryMetrics(previewCall)}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowPreview(false)}
                      className={`flex-1 px-4 py-3.5 rounded-xl font-semibold border-2 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${loading
                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                        : `bg-gradient-to-r ${getCategoryGradient(category, theme)} text-white hover:shadow-xl`
                        }`}
                    >
                      <X className="w-4 h-4" />
                      Назад
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowPreview(false)
                        const form = document.querySelector('form') as HTMLFormElement
                        form?.requestSubmit()
                      }}
                      disabled={loading}
                      className={`flex-1 py-3.5 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${loading
                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                        : `bg-gradient-to-r ${getCategoryGradient(category, theme)} text-white hover:shadow-xl`
                        }`}
                    >
                      <Check className="w-4 h-4" />
                      Опубликовать
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })()}
      </form>
    </>
  )
}
