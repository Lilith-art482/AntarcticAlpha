import { useState, useEffect, type JSX } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useScrollLock } from '@/hooks/useScrollLock'
import {
  Lock, X, Loader2, Copy, Check, Search, Link2, 
  MessageSquare, ChevronDown,
  Rocket, Code, Coins, LineChart, Gauge, Image, ArrowLeftRight,
  Target, BookOpen, Zap, BarChart3, DollarSign, Camera, Trash2,
  TrendingUp, TrendingDown, Brain, FileText, ExternalLink,
  Shield, ArrowRightLeft, CreditCard, ShieldAlert, Settings, Bell
} from 'lucide-react'

// ==================== ТИПЫ ====================
type DiarySphere = 'mem-trade' | 'mem-deving' | 'spot' | 'futures' | 'polymarket' | 'nft'

interface MemTradeData {
  // === БАЗОВАЯ ИНФОРМАЦИЯ ===
  tokenName: string
  ticker: string
  tradeDate: string
  tradeTime: string
  duration: string
  
  // === ФИНАНСЫ ===
  entryMC: string
  exitMC: string
  commission: string
  profitPercent: string
  resultAmount: string
  resultAsset: string
  
  // === СТОП-ЛОСС ===
  hasStopLoss: boolean | null
  stopLossPercent: string
  
  // === ПАРАМЕТРЫ ТОКЕНА ===
  coinAge: string
  migration: boolean | null
  bCurve: string
  understoodNarrative: boolean | null
  hasSocials: boolean | null
  xAlive: boolean | null
  dexPaid: boolean | null
  
  // === ТИП СДЕЛКИ ===
  buyType: 'market' | 'limit' | null
  sellType: 'market' | 'limit' | 'ts' | null
  strategy: 'FLIP' | 'Intraday' | 'DIP' | 'Mediumterm' | 'Long-term' | null
  
  // === ФИБОНАЧЧИ ===
  fibMatchEntry: boolean | null
  fibEntryLevel: string
  
  // === МИГРАЦИЯ ===
  singleMigrationCandle: boolean | null
  migrationDetails: string
  
  // === КОМИССИИ ===
  botFee: string
  
  // === VOLUME И LIQUIDITY ===
  volume5m: string
  volumeTotal: string
  liquidity: string
  
  // === ATH ===
  athAtEntry: string
  dropFromAth: string
  
  // === ТРАНСАКЦИИ ===
  txsCount: string
  buysCount: string
  sellsCount: string
  
  // === ИНФОРМАЦИЯ О ДЕВЕ ===
  devMigrations: string
  devLaunches: string
  devSoldBeforeMigration: boolean | null
  
  // === ХОЛДЕРЫ И РАСПРЕДЕЛЕНИЕ ===
  holdersAtEntry: string
  holdersAtExit: string
  bundlerPercent: string
  sniperPercent: string
  botTraderPercent: string
  freshWalletPercent: string
  insiderPercent: string
  devPercent: string
  top1Percent: string
  top5Percent: string
  top10Percent: string
  makers: string
  
  // === ДОПОЛНИТЕЛЬНО ===
  dexTax: string
  launchpad: string
  comment: string
  videoLinks: string
  hasAlert: boolean | null
  alertSource: string
}

// ==================== ТИПЫ POLYMARKET ====================
interface PolymarketData {
  // === БАЗОВАЯ ИНФОРМАЦИЯ О СДЕЛКЕ ===
  entryDateTime: string
  marketName: string
  outcome: string
  entryPrice: string
  positionSize: string
  positionCost: string
  exitDateTime: string
  exitPrice: string
  finalPnL: string
  finalPnLPercent: string
  // === МЕНТАЛЬНОЕ СОСТОЯНИЕ И КОНТЕКСТ ===
  triggerType: 'news' | 'technical' | 'intuition' | 'signal' | null
  triggerDetails: string
  thesis: string
  emotionsBefore: 'calm' | 'excitement' | 'fear' | 'uncertainty' | null
  takeProfitTarget: string
  stopLossPrice: string
  holdUntilResolution: boolean | null
  // === АНАЛИЗ ВЫХОДА ===
  tradeResult: 'profit' | 'loss' | 'zero' | null
  exitReason: string
  followedPlan: boolean | null
  planDeviationReason: string
  // === ССЫЛКИ И СКРИНШОТЫ ===
  eventLink: string
  additionalLinks: string[]
  screenshots: string[]
}

// ==================== ТИПЫ SPOT ====================
interface SpotData {
  // === БАЗОВАЯ ИНФОРМАЦИЯ О СДЕЛКЕ ===
  entryDateTime: string
  assetPair: string
  direction: 'long' | null
  entryPrice: string
  positionSize: string
  positionCost: string
  exitDateTime: string
  exitPrice: string
  commissions: string
  finalPnL: string
  finalPnLPercent: string
  // === КОНТЕКСТ И ТЕЗИС ===
  analysisTypes: ('technical' | 'fundamental' | 'sentiment')[]
  thesis: string
  timeframe: 'scalp' | 'short' | 'medium' | 'long' | null
  stopLoss: string
  takeProfit1: string
  takeProfit1Percent: string
  takeProfit2: string
  takeProfit2Percent: string
  // === УПРАВЛЕНИЕ ПОЗИЦИЕЙ ===
  hadDCA: boolean | null
  dcaReason: string
  emotionsOnMinus: string
  emotionsOnPlus: string
  // === АНАЛИЗ ВЫХОДА ===
  exitReason: 'takeProfit' | 'stopLoss' | 'fundamental' | 'emotions' | null
  exitReasonDetails: string
  followedPlan: boolean | null
  planDeviationReason: string
  decisionQuality: 'good' | 'bad' | null
  decisionAnalysis: string
  // === ССЫЛКИ И СКРИНШОТЫ ===
  links: string[]
  screenshots: string[]
}

// ==================== ТИПЫ FUTURES ====================
interface FuturesData {
  // === 1. ОБЪЕКТИВНЫЕ ДАННЫЕ (ПАСПОРТ СДЕЛКИ) ===
  entryDateTime: string
  assetPair: string
  direction: 'long' | 'short' | null
  positionSize: string
  positionSizeUnit: 'usd' | 'coins' | null
  leverage: string
  margin: string
  entryPrice: string
  liquidationPrice: string
  stopLoss: string
  takeProfit: string
  exitDateTime: string
  exitPrice: string
  fundingRateEntry: string
  fundingRateExit: string
  finalPnL: string
  finalPnLPercent: string
  // === 2. КОНТЕКСТ И ТЕЗИС ===
  analysisTypes: ('technical' | 'fundamental')[]
  thesis: string
  timeframe: 'scalp' | 'intraday' | 'swing' | null
  riskPercent: string
  // === 3. УПРАВЛЕНИЕ ПОЗИЦИЕЙ ===
  movedStopLoss: boolean | null
  addedToPosition: boolean | null
  modificationsDetails: string
  hadFOMO: boolean | null
  hadPanic: boolean | null
  hadGreed: boolean | null
  observations: string
  // === 4. АНАЛИЗ ВЫХОДА И РЕЗУЛЬТАТОВ ===
  exitReason: 'takeProfit' | 'stopLoss' | 'liquidation' | 'manual' | null
  exitReasonDetails: string
  followedPlan: boolean | null
  planDeviationReason: string
  errorAnalysis: string
  successAnalysis: string
  tradeResult: 'profit' | 'loss' | null
  // === ССЫЛКИ И СКРИНШОТЫ ===
  links: string[]
  screenshots: string[]
}

// ==================== ТИПЫ NFT ====================
interface NFTData {
  // === 1. ИНФОРМАЦИЯ О ПРОЕКТЕ И NFT ===
  collectionName: string
  tokenId: string
  purchaseDateTime: string
  platform: string
  dealType: 'mint' | 'flipping' | null
  entryPriceToken: string
  entryPriceUSD: string
  commissions: string
  rarityRank: string
  traits: string
  // === 2. КОНТЕКСТ И ТЕЗИС ===
  ideaSource: string
  analysisType: 'floor' | 'rarity' | 'trait' | null
  thesis: string
  targetPrice: string
  stopLoss: string
  // === 3. УПРАВЛЕНИЕ ПОЗИЦИЕЙ И ВЫХОД ===
  saleDateTime: string
  salePriceToken: string
  salePriceUSD: string
  salePlatform: string
  finalPnLToken: string
  finalPnLPercent: string
  exitReason: 'takeProfit' | 'stopLoss' | 'manual' | 'thesisChange' | 'liquidityNeed' | 'emotions' | null
  exitReasonDetails: string
  // === 4. МЕНТАЛЬНЫЙ И КАЧЕСТВЕННЫЙ АНАЛИЗ ===
  emotionsOnBuy: 'fomo' | 'calculation' | 'hunt' | null
  emotionsOnHold: string
  communityInvolvement: boolean | null
  communityDetails: string
  smartMoney: boolean | null
  caughtRareTrait: boolean | null
  // === ССЫЛКИ И СКРИНШОТЫ ===
  links: string[]
  screenshots: string[]
}

// ==================== ТИПЫ MEM-DEVING ====================
interface MemDevingData {
  // === 1. ПАСПОРТ ТОКЕНА (Технические параметры) ===
  tokenName: string
  ticker: string
  tokenLogo?: string
  contractAddress: string
  blockchain: string
  launchDateTime: string
  launchPlatform: string
  totalSupply: string
  initialLiquidity: string
  teamTokensLocked: boolean | null
  // Ссылки
  websiteUrl: string
  twitterUrl: string
  telegramUrl: string
  tiktokUrl: string
  redditUrl: string
  
  // === 2. КОНЦЕПЦИЯ И ТЕЗИС ===
  narrative: string
  targetAudience: string
  // Маркетинговый план до запуска
  marketingChannels: string
  kolPlanned: boolean | null
  kolDetails: string
  marketingBudget: string
  // Стратегия выхода
  exitStrategyType: 'rugpull' | 'partial' | 'hold' | null
  exitStrategyDetails: string
  
  // === 3. ЖУРНАЛ ЗАПУСКА И МАРКЕТИНГА ===
  firstPostTime: string
  contentCreated: string
  raidsDone: string
  contestsHeld: string
  communitySize: string
  communityActivity: string
  listingsSubmitted: string
  adSpend: string
  kolPaid: string
  kolCoverage: string
  
  // === 4. АНАЛИЗ ЭФФЕКТИВНОСТИ И ФИНАНСОВЫЙ РЕЗУЛЬТАТ ===
  totalRevenue: string
  totalExpenses: string
  gasExpenses: string
  platformFees: string
  kolExpenses: string
  designerExpenses: string
  otherExpenses: string
  netProfit: string
  
  // === 5. МЕТРИКИ ТОКЕНА ===
  athMcapt: string
  currentMcapt: string
  peakHolders: string
  peakVolume: string
  
  // === 6. АНАЛИЗ ЧТО СРАБОТАЛО ===
  whatWorked: string
  bestNarrative: string
  bestKol: string
  buybackDetails: string
  // Анализ ошибок
  whatFailed: string
  technicalBug: boolean | null
  competitionMissed: boolean | null
  
  // === ССЫЛКИ И СКРИНШОТЫ ===
  links: string[]
  screenshots: string[]
}

interface SphereCardMeta {
  id: DiarySphere
  label: string
  gradient: string
  gradientDark: string
  icon: JSX.Element
  description: string
  accent: string
}

// ==================== МЕТАДАННЫЕ СФЕР ====================
const SPHERE_META: Record<DiarySphere, SphereCardMeta> = {
  'mem-trade': {
    id: 'mem-trade',
    label: 'Mem-trade',
    gradient: 'from-emerald-400 via-teal-500 to-cyan-400',
    gradientDark: 'from-emerald-500 via-teal-600 to-cyan-500',
    icon: <Rocket className="w-5 h-5" />,
    description: 'Торговля мемкоинами',
    accent: 'teal'
  },
  'mem-deving': {
    id: 'mem-deving',
    label: 'Mem-deving',
    gradient: 'from-purple-400 via-violet-500 to-indigo-400',
    gradientDark: 'from-purple-500 via-violet-600 to-indigo-500',
    icon: <Code className="w-5 h-5" />,
    description: 'Создание мемкоинов',
    accent: 'purple'
  },
  spot: {
    id: 'spot',
    label: 'Спот',
    gradient: 'from-amber-400 via-orange-500 to-yellow-400',
    gradientDark: 'from-amber-500 via-orange-600 to-yellow-500',
    icon: <Coins className="w-5 h-5" />,
    description: 'Спотовая торговля',
    accent: 'amber'
  },
  futures: {
    id: 'futures',
    label: 'Фьючерсы',
    gradient: 'from-blue-400 via-indigo-500 to-cyan-400',
    gradientDark: 'from-blue-500 via-indigo-600 to-cyan-500',
    icon: <LineChart className="w-5 h-5" />,
    description: 'Фьючерсная торговля',
    accent: 'blue'
  },
  polymarket: {
    id: 'polymarket',
    label: 'Polymarket',
    gradient: 'from-rose-400 via-red-500 to-orange-400',
    gradientDark: 'from-rose-500 via-red-600 to-orange-500',
    icon: <Gauge className="w-5 h-5" />,
    description: 'Предсказательные рынки',
    accent: 'rose'
  },
  nft: {
    id: 'nft',
    label: 'NFT',
    gradient: 'from-purple-400 via-pink-500 to-rose-400',
    gradientDark: 'from-purple-500 via-pink-600 to-rose-500',
    icon: <Image className="w-5 h-5" />,
    description: 'NFT торговля',
    accent: 'purple'
  }
}

const SPHERE_ORDER: DiarySphere[] = ['mem-trade', 'mem-deving', 'spot', 'futures', 'polymarket', 'nft']

// ==================== КОМПОНЕНТЫ UI ====================

// Custom Select Component
const CustomSelect = ({ 
  value, 
  onChange, 
  options, 
  placeholder, 
  icon 
}: { 
  value: string | null
  onChange: (val: string) => void
  options: { value: string; label: string }[]
  placeholder?: string
  icon?: JSX.Element
}) => {
  const { theme } = useThemeStore()
  const [isOpen, setIsOpen] = useState(false)

  const selectedOption = options.find(o => o.value === value)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl border transition-all ${
          theme === 'dark' 
            ? 'bg-white/5 border-white/10 hover:border-white/20' 
            : 'bg-gray-50 border-gray-200 hover:border-gray-300'
        } ${isOpen ? 'ring-2 ring-[#4C7F6E]/50' : ''}`}
      >
        <div className="flex items-center gap-2">
          {icon && <span className="text-gray-400">{icon}</span>}
          <span className={selectedOption ? '' : 'text-gray-400'}>
            {selectedOption?.label || placeholder || 'Выберите...'}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className={`absolute z-50 w-full mt-2 py-2 rounded-xl border shadow-xl ${
          theme === 'dark' 
            ? 'bg-[#0f1419] border-white/10' 
            : 'bg-white border-gray-200'
        }`}>
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value)
                setIsOpen(false)
              }}
              className={`w-full px-4 py-2.5 text-left transition-colors ${
                value === option.value 
                  ? 'bg-[#4C7F6E]/20 text-[#4C7F6E]' 
                  : theme === 'dark' 
                    ? 'hover:bg-white/5' 
                    : 'hover:bg-gray-50'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// Toggle Button Group
const ToggleGroup = ({ 
  value, 
  onChange, 
  options 
}: { 
  value: boolean | null
  onChange: (val: boolean) => void
  options: { value: boolean; label: string }[]
}) => {
  const { theme } = useThemeStore()

  return (
    <div className="flex gap-2">
      {options.map((option) => (
        <button
          key={String(option.value)}
          type="button"
          onClick={() => onChange(option.value)}
          className={`flex-1 px-4 py-3 rounded-xl border font-medium transition-all ${
            value === option.value
              ? 'bg-[#4C7F6E]/20 border-[#4C7F6E] text-[#4C7F6E]'
              : theme === 'dark' 
                ? 'border-white/10 hover:border-white/20' 
                : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

// Custom Sphere Selector Component
const CustomSphereSelector = ({
  value,
  onChange,
  theme
}: { 
  value: DiarySphere | null
  onChange: (val: DiarySphere | null) => void
  theme: string
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const selectedSphere = value ? SPHERE_META[value] : null

  return (
    <div className="relative z-[200]">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
          theme === 'dark' 
            ? 'bg-white/5 border-white/10 hover:border-white/20' 
            : 'bg-gray-50 border-gray-200 hover:border-gray-300'
        } ${isOpen ? 'ring-2 ring-[#4C7F6E]/50' : ''}`}
      >
        {selectedSphere ? (
          <>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br ${selectedSphere.gradient} text-white flex-shrink-0`}>
              {selectedSphere.icon}
            </div>
            <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {selectedSphere.label}
            </span>
          </>
        ) : (
          <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            Все сферы
          </span>
        )}
        <ChevronDown className={`w-4 h-4 ml-auto text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className={`absolute z-[300] w-full mt-2 py-2 rounded-xl border shadow-xl ${
          theme === 'dark' 
            ? 'bg-[#0f1419] border-white/10' 
            : 'bg-white border-gray-200'
        }`}>
          <button
            type="button"
            onClick={() => {
              onChange(null)
              setIsOpen(false)
            }}
            className={`w-full px-4 py-2.5 text-left transition-colors flex items-center gap-3 ${
              value === null
                ? 'bg-[#4C7F6E]/20 text-[#4C7F6E]' 
                : theme === 'dark' 
                  ? 'hover:bg-white/5 text-gray-300' 
                  : 'hover:bg-gray-50 text-gray-700'
            }`}
          >
            <span className="text-gray-400 text-sm">Все сферы</span>
          </button>
          {SPHERE_ORDER.map((sphereId) => {
            const sphere = SPHERE_META[sphereId]
            return (
              <button
                key={sphereId}
                type="button"
                onClick={() => {
                  onChange(sphereId)
                  setIsOpen(false)
                }}
                className={`w-full px-4 py-2.5 text-left transition-colors flex items-center gap-3 ${
                  value === sphereId
                    ? 'bg-[#4C7F6E]/20 text-[#4C7F6E]' 
                    : theme === 'dark' 
                      ? 'hover:bg-white/5 text-gray-300' 
                      : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className={`w-6 h-6 rounded-md flex items-center justify-center bg-gradient-to-br ${sphere.gradient} text-white flex-shrink-0`}>
                  {sphere.icon}
                </div>
                <span className="font-medium truncate">{sphere.label}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ==================== ФОРМА MEM-TRADE ====================
const MemTradeForm = ({ 
  onClose, 
  onSave 
}: { 
  onClose: () => void
  onSave: (data: MemTradeData) => void 
}) => {
  const { theme } = useThemeStore()
  
  const [formData, setFormData] = useState<MemTradeData>({
    tokenName: '',
    ticker: '',
    tradeDate: new Date().toISOString().slice(0, 10),
    tradeTime: new Date().toISOString().slice(0, 5),
    duration: '',
    entryMC: '',
    exitMC: '',
    commission: '',
    profitPercent: '',
    resultAmount: '',
    resultAsset: '',
    hasStopLoss: null,
    stopLossPercent: '',
    coinAge: '',
    migration: null,
    bCurve: '',
    understoodNarrative: null,
    hasSocials: null,
    xAlive: null,
    dexPaid: null,
    buyType: null,
    sellType: null,
    strategy: null,
    fibMatchEntry: null,
    fibEntryLevel: '',
    singleMigrationCandle: null,
    migrationDetails: '',
    botFee: '',
    volume5m: '',
    volumeTotal: '',
    liquidity: '',
    athAtEntry: '',
    dropFromAth: '',
    txsCount: '',
    buysCount: '',
    sellsCount: '',
    devMigrations: '',
    devLaunches: '',
    devSoldBeforeMigration: null,
    holdersAtEntry: '',
    holdersAtExit: '',
    bundlerPercent: '',
    sniperPercent: '',
    botTraderPercent: '',
    freshWalletPercent: '',
    insiderPercent: '',
    devPercent: '',
    top1Percent: '',
    top5Percent: '',
    top10Percent: '',
    makers: '',
    dexTax: '',
    launchpad: '',
    comment: '',
    videoLinks: '',
    hasAlert: null,
    alertSource: ''
  })
  
  const updateField = <K extends keyof MemTradeData>(key: K, value: MemTradeData[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const borderColor = theme === 'dark' ? 'border-white/10' : 'border-gray-200'
  const bgColor = theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* === 1. БАЗОВАЯ ИНФОРМАЦИЯ === */}
      <div className="space-y-4">
        <h3 className={`text-lg font-bold ${textColor} flex items-center gap-2`}>
          <Target className="w-5 h-5 text-[#4C7F6E]" />
          Базовая информация
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Название токена</label>
            <input type="text" value={formData.tokenName} onChange={(e) => updateField('tokenName', e.target.value)} placeholder="PEPE" className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-[#4C7F6E]/50`} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Тикер</label>
            <input type="text" value={formData.ticker} onChange={(e) => updateField('ticker', e.target.value)} placeholder="PEPE" className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-[#4C7F6E]/50`} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Дата и время сделки</label>
            <input type="datetime-local" value={formData.tradeDate && formData.tradeTime ? `${formData.tradeDate}T${formData.tradeTime}` : ''} onChange={(e) => { const dt = e.target.value.split('T'); updateField('tradeDate', dt[0] || ''); updateField('tradeTime', dt[1] || ''); }} className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-[#4C7F6E]/50`} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Время в сделке</label>
            <input type="text" value={formData.duration} onChange={(e) => updateField('duration', e.target.value)} placeholder="2ч 30м" className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-[#4C7F6E]/50`} />
          </div>
        </div>
      </div>

      {/* === 2. ФИНАНСЫ === */}
      <div className="space-y-4">
        <h3 className={`text-lg font-bold ${textColor} flex items-center gap-2`}>
          <DollarSign className="w-5 h-5 text-[#4C7F6E]" />
          Финансы
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">MC входа</label>
            <input type="text" value={formData.entryMC} onChange={(e) => updateField('entryMC', e.target.value)} placeholder="$10,000" className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-[#4C7F6E]/50`} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">MC выхода</label>
            <input type="text" value={formData.exitMC} onChange={(e) => updateField('exitMC', e.target.value)} placeholder="$50,000" className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-[#4C7F6E]/50`} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Комиссия</label>
            <input type="text" value={formData.commission} onChange={(e) => updateField('commission', e.target.value)} placeholder="$5.50" className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-[#4C7F6E]/50`} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">% Дохода / Убытка</label>
            <input type="text" value={formData.profitPercent} onChange={(e) => updateField('profitPercent', e.target.value)} placeholder="+150%" className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-[#4C7F6E]/50`} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Результат (сумма)</label>
            <input type="text" value={formData.resultAmount} onChange={(e) => updateField('resultAmount', e.target.value)} placeholder="+5 SOL" className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-[#4C7F6E]/50`} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Результат (актив)</label>
            <input type="text" value={formData.resultAsset} onChange={(e) => updateField('resultAsset', e.target.value)} placeholder="SOL, USDT" className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-[#4C7F6E]/50`} />
          </div>
        </div>
      </div>

      {/* === 3. СТОП-ЛОСС === */}
      <div className="space-y-4">
        <h3 className={`text-lg font-bold ${textColor} flex items-center gap-2`}>
          <Shield className="w-5 h-5 text-[#4C7F6E]" />
          Стоп-лосс
        </h3>
        <div>
          <label className="block text-sm font-medium mb-2">Был стоп-лосс?</label>
          <ToggleGroup value={formData.hasStopLoss} onChange={(v) => updateField('hasStopLoss', v)} options={[{ value: true, label: '✓ Да' }, { value: false, label: '✗ Нет' }]} />
          {formData.hasStopLoss && (
            <div className="mt-3">
              <label className="block text-sm font-medium mb-2">% Стоп-лосса</label>
              <input type="text" value={formData.stopLossPercent} onChange={(e) => updateField('stopLossPercent', e.target.value)} placeholder="-10%" className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-[#4C7F6E]/50`} />
            </div>
          )}
        </div>
      </div>

      {/* === 4. ПАРАМЕТРЫ ТОКЕНА === */}
      <div className="space-y-4">
        <h3 className={`text-lg font-bold ${textColor} flex items-center gap-2`}>
          <Rocket className="w-5 h-5 text-[#4C7F6E]" />
          Параметры токена
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Возраст монеты</label>
            <input type="text" value={formData.coinAge} onChange={(e) => updateField('coinAge', e.target.value)} placeholder="2ч, 1д" className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-[#4C7F6E]/50`} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Монета мигрировала?</label>
            <ToggleGroup value={formData.migration} onChange={(v) => updateField('migration', v)} options={[{ value: true, label: '✓ Да' }, { value: false, label: '✗ Нет' }]} />
          </div>
          {!formData.migration && (
            <div>
              <label className="block text-sm font-medium mb-2">B. Curve</label>
              <input type="text" value={formData.bCurve} onChange={(e) => updateField('bCurve', e.target.value)} placeholder="0.5%" className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-[#4C7F6E]/50`} />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-2">Понятен ли нарратив?</label>
            <ToggleGroup value={formData.understoodNarrative} onChange={(v) => updateField('understoodNarrative', v)} options={[{ value: true, label: '✓ Да' }, { value: false, label: '✗ Нет' }]} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Наличие соцсетей</label>
            <ToggleGroup value={formData.hasSocials} onChange={(v) => updateField('hasSocials', v)} options={[{ value: true, label: '✓ Есть' }, { value: false, label: '✗ Нет' }]} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Живой X (Twitter)?</label>
            <ToggleGroup value={formData.xAlive} onChange={(v) => updateField('xAlive', v)} options={[{ value: true, label: '✓ Да' }, { value: false, label: '✗ Нет' }]} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">DEX-Paid?</label>
            <ToggleGroup value={formData.dexPaid} onChange={(v) => updateField('dexPaid', v)} options={[{ value: true, label: '✓ Да' }, { value: false, label: '✗ Нет' }]} />
          </div>
        </div>
      </div>

      {/* === 5. ТИП СДЕЛКИ === */}
      <div className="space-y-4">
        <h3 className={`text-lg font-bold ${textColor} flex items-center gap-2`}>
          <Zap className="w-5 h-5 text-[#4C7F6E]" />
          Тип сделки
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Покупка</label>
            <CustomSelect value={formData.buyType as any} onChange={(v) => updateField('buyType', v as any)} options={[{ value: 'market', label: '📈 Рыночная' }, { value: 'limit', label: '📊 Лимитная' }]} placeholder="Выберите..." />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Продажа</label>
            <CustomSelect value={formData.sellType as any} onChange={(v) => updateField('sellType', v as any)} options={[{ value: 'market', label: '📈 Рыночная' }, { value: 'limit', label: '📊 Лимитная' }, { value: 'ts', label: '🎯 Трейлинг' }]} placeholder="Выберите..." />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Стратегия</label>
            <CustomSelect value={formData.strategy as any} onChange={(v) => updateField('strategy', v as any)} options={[{ value: 'FLIP', label: '⚡ FLIP' }, { value: 'Intraday', label: '🕐 Intraday' }, { value: 'DIP', label: '💎 DIP' }, { value: 'Mediumterm', label: '📅 Mediumterm' }, { value: 'Long-term', label: '🚀 Long-term' }]} placeholder="Выберите..." />
          </div>
        </div>
      </div>

      {/* === 6. ФИБОНАЧЧИ === */}
      <div className="space-y-4">
        <h3 className={`text-lg font-bold ${textColor} flex items-center gap-2`}>
          <Target className="w-5 h-5 text-[#4C7F6E]" />
          Фибоначчи
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Совпадение фибы с точкой входа</label>
            <ToggleGroup value={formData.fibMatchEntry} onChange={(v) => updateField('fibMatchEntry', v)} options={[{ value: true, label: '✓ Да' }, { value: false, label: '✗ Нет' }]} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Уровень входа по фибе</label>
            <input type="text" value={formData.fibEntryLevel} onChange={(e) => updateField('fibEntryLevel', e.target.value)} placeholder="0.618" className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-[#4C7F6E]/50`} />
          </div>
        </div>
      </div>

      {/* === 7. МИГРАЦИЯ === */}
      <div className="space-y-4">
        <h3 className={`text-lg font-bold ${textColor} flex items-center gap-2`}>
          <ArrowRightLeft className="w-5 h-5 text-[#4C7F6E]" />
          Миграция
        </h3>
        <div>
          <label className="block text-sm font-medium mb-2">Была ли единая свеча миграции?</label>
          <ToggleGroup value={formData.singleMigrationCandle} onChange={(v) => updateField('singleMigrationCandle', v)} options={[{ value: true, label: '✓ Да' }, { value: false, label: '✗ Нет' }]} />
          {formData.singleMigrationCandle && (
            <div className={`mt-3 p-3 rounded-xl border ${theme === 'dark' ? 'bg-white/10 border-white/20 text-white' : 'bg-black/5 border-black/10 text-gray-900'}`}>
              <p className="text-sm">В 80% это скам)</p>
            </div>
          )}
        </div>
      </div>

      {/* === 8. КОМИССИИ === */}
      <div className="space-y-4">
        <h3 className={`text-lg font-bold ${textColor} flex items-center gap-2`}>
          <CreditCard className="w-5 h-5 text-[#4C7F6E]" />
          Комиссии
        </h3>
        <div>
          <label className="block text-sm font-medium mb-2">Bot Fee / Global Fees</label>
          <input type="text" value={formData.botFee} onChange={(e) => updateField('botFee', e.target.value)} placeholder="$10 / $500" className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-[#4C7F6E]/50`} />
        </div>
      </div>

      {/* === 9. VOLUME И LIQUIDITY === */}
      <div className="space-y-4">
        <h3 className={`text-lg font-bold ${textColor} flex items-center gap-2`}>
          <BarChart3 className="w-5 h-5 text-[#4C7F6E]" />
          Volume и Liquidity
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Volume за 5 минут</label>
            <input type="text" value={formData.volume5m} onChange={(e) => updateField('volume5m', e.target.value)} placeholder="$5,000" className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-[#4C7F6E]/50`} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Volume (общий)</label>
            <input type="text" value={formData.volumeTotal} onChange={(e) => updateField('volumeTotal', e.target.value)} placeholder="$150,000" className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-[#4C7F6E]/50`} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Liquidity (на момент входа)</label>
            <input type="text" value={formData.liquidity} onChange={(e) => updateField('liquidity', e.target.value)} placeholder="$25,000" className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-[#4C7F6E]/50`} />
          </div>
        </div>
      </div>

      {/* === 10. ATH === */}
      <div className="space-y-4">
        <h3 className={`text-lg font-bold ${textColor} flex items-center gap-2`}>
          <TrendingUp className="w-5 h-5 text-[#4C7F6E]" />
          ATH токена
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">ATH токена на момент входа</label>
            <input type="text" value={formData.athAtEntry} onChange={(e) => updateField('athAtEntry', e.target.value)} placeholder="$0.00123" className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-[#4C7F6E]/50`} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Падение от ATH на момент входа</label>
            <input type="text" value={formData.dropFromAth} onChange={(e) => updateField('dropFromAth', e.target.value)} placeholder="-45%" className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-[#4C7F6E]/50`} />
          </div>
        </div>
      </div>

      {/* === 11. TXS === */}
      <div className="space-y-4">
        <h3 className={`text-lg font-bold ${textColor} flex items-center gap-2`}>
          <ArrowLeftRight className="w-5 h-5 text-[#4C7F6E]" />
          Транзакции
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Кол-во TXS</label>
            <input type="text" value={formData.txsCount} onChange={(e) => updateField('txsCount', e.target.value)} placeholder="1,234" className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-[#4C7F6E]/50`} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Кол-во покупок</label>
            <input type="text" value={formData.buysCount} onChange={(e) => updateField('buysCount', e.target.value)} placeholder="856" className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-[#4C7F6E]/50`} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Кол-во продаж</label>
            <input type="text" value={formData.sellsCount} onChange={(e) => updateField('sellsCount', e.target.value)} placeholder="378" className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-[#4C7F6E]/50`} />
          </div>
        </div>
      </div>

      {/* === 12. ИНФОРМАЦИЯ О ДЕВЕ === */}
      <div className="space-y-4">
        <h3 className={`text-lg font-bold ${textColor} flex items-center gap-2`}>
          <Code className="w-5 h-5 text-[#4C7F6E]" />
          Информация о деве
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Сколько миграций у дева?</label>
            <input type="text" value={formData.devMigrations} onChange={(e) => updateField('devMigrations', e.target.value)} placeholder="0" className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-[#4C7F6E]/50`} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Сколько лаунчей у дева?</label>
            <input type="text" value={formData.devLaunches} onChange={(e) => updateField('devLaunches', e.target.value)} placeholder="3" className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-[#4C7F6E]/50`} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Sell Dev до миграции?</label>
            <ToggleGroup value={formData.devSoldBeforeMigration} onChange={(v) => updateField('devSoldBeforeMigration', v)} options={[{ value: true, label: '✓ Да' }, { value: false, label: '✗ Нет' }]} />
          </div>
        </div>
      </div>

      {/* === 13. ХОЛДЕРЫ === */}
      <div className="space-y-4">
        <h3 className={`text-lg font-bold ${textColor} flex items-center gap-2`}>
          <Coins className="w-5 h-5 text-[#4C7F6E]" />
          Холдеры
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Кол-во холдеров на момент входа</label>
            <input type="text" value={formData.holdersAtEntry} onChange={(e) => updateField('holdersAtEntry', e.target.value)} placeholder="523" className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-[#4C7F6E]/50`} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Кол-во холдеров на момент выхода</label>
            <input type="text" value={formData.holdersAtExit} onChange={(e) => updateField('holdersAtExit', e.target.value)} placeholder="1,234" className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-[#4C7F6E]/50`} />
          </div>
        </div>
      </div>

      {/* === 14. ПРОЦЕНТЫ БАНДЛЕРОВ И СНЙПЕРОВ === */}
      <div className="space-y-4">
        <h3 className={`text-lg font-bold ${textColor} flex items-center gap-2`}>
          <ShieldAlert className="w-5 h-5 text-[#4C7F6E]" />
          Проценты (вход)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div><label className="block text-sm font-medium mb-2">% Бандлеров</label><input type="text" value={formData.bundlerPercent} onChange={(e) => updateField('bundlerPercent', e.target.value)} placeholder="2%" className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-[#4C7F6E]/50`} /></div>
          <div><label className="block text-sm font-medium mb-2">% Снайперов</label><input type="text" value={formData.sniperPercent} onChange={(e) => updateField('sniperPercent', e.target.value)} placeholder="5%" className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-[#4C7F6E]/50`} /></div>
          <div><label className="block text-sm font-medium mb-2">% Bot Traders</label><input type="text" value={formData.botTraderPercent} onChange={(e) => updateField('botTraderPercent', e.target.value)} placeholder="10%" className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-[#4C7F6E]/50`} /></div>
          <div><label className="block text-sm font-medium mb-2">% Fresh Wallets</label><input type="text" value={formData.freshWalletPercent} onChange={(e) => updateField('freshWalletPercent', e.target.value)} placeholder="60%" className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-[#4C7F6E]/50`} /></div>
          <div><label className="block text-sm font-medium mb-2">% Инсайдеров</label><input type="text" value={formData.insiderPercent} onChange={(e) => updateField('insiderPercent', e.target.value)} placeholder="1%" className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-[#4C7F6E]/50`} /></div>
          <div><label className="block text-sm font-medium mb-2">% у дева</label><input type="text" value={formData.devPercent} onChange={(e) => updateField('devPercent', e.target.value)} placeholder="15%" className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-[#4C7F6E]/50`} /></div>
        </div>
      </div>

      {/* === 15. ТОП ХОЛДЕРЫ === */}
      <div className="space-y-4">
        <h3 className={`text-lg font-bold ${textColor} flex items-center gap-2`}>
          <TrendingUp className="w-5 h-5 text-[#4C7F6E]" />
          Топ холдеры
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div><label className="block text-sm font-medium mb-2">% у Топ-1</label><input type="text" value={formData.top1Percent} onChange={(e) => updateField('top1Percent', e.target.value)} placeholder="5%" className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-[#4C7F6E]/50`} /></div>
          <div><label className="block text-sm font-medium mb-2">% у Топ-5</label><input type="text" value={formData.top5Percent} onChange={(e) => updateField('top5Percent', e.target.value)} placeholder="20%" className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-[#4C7F6E]/50`} /></div>
          <div><label className="block text-sm font-medium mb-2">% у Топ-10</label><input type="text" value={formData.top10Percent} onChange={(e) => updateField('top10Percent', e.target.value)} placeholder="35%" className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-[#4C7F6E]/50`} /></div>
        </div>
      </div>

      {/* === 16. ДОПОЛНИТЕЛЬНО === */}
      <div className="space-y-4">
        <h3 className={`text-lg font-bold ${textColor} flex items-center gap-2`}>
          <Settings className="w-5 h-5 text-[#4C7F6E]" />
          Дополнительно
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-2">Мейкеры на момент входа</label><input type="text" value={formData.makers} onChange={(e) => updateField('makers', e.target.value)} placeholder="123" className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-[#4C7F6E]/50`} /></div>
          <div><label className="block text-sm font-medium mb-2">Dex Tax</label><input type="text" value={formData.dexTax} onChange={(e) => updateField('dexTax', e.target.value)} placeholder="1%" className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-[#4C7F6E]/50`} /></div>
          <div><label className="block text-sm font-medium mb-2">Лаунчпад</label><input type="text" value={formData.launchpad} onChange={(e) => updateField('launchpad', e.target.value)} placeholder="Pump.fun" className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-[#4C7F6E]/50`} /></div>
        </div>
      </div>

      {/* === 17. АЛЕРТ === */}
      <div className="space-y-4">
        <h3 className={`text-lg font-bold ${textColor} flex items-center gap-2`}>
          <Bell className="w-5 h-5 text-[#4C7F6E]" />
          Алерт
        </h3>
        <div>
          <label className="block text-sm font-medium mb-2">Был алерт?</label>
          <ToggleGroup value={formData.hasAlert} onChange={(v) => updateField('hasAlert', v)} options={[{ value: true, label: '✓ Да' }, { value: false, label: '✗ Нет' }]} />
          {formData.hasAlert && (
            <div className="mt-3">
              <label className="block text-sm font-medium mb-2">Источник алерта</label>
              <input type="text" value={formData.alertSource} onChange={(e) => updateField('alertSource', e.target.value)} placeholder="Telegram, Twitter" className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-[#4C7F6E]/50`} />
            </div>
          )}
        </div>
      </div>

      {/* === 18. КОММЕНТАРИЙ И ССЫЛКИ === */}
      <div className="space-y-4">
        <h3 className={`text-lg font-bold ${textColor} flex items-center gap-2`}>
          <MessageSquare className="w-5 h-5 text-[#4C7F6E]" />
          Комментарий и ссылки
        </h3>
        <div>
          <label className="block text-sm font-medium mb-2">Комментарий трейдера</label>
          <textarea value={formData.comment} onChange={(e) => updateField('comment', e.target.value)} placeholder="Опишите ход мыслей..." rows={4} className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-[#4C7F6E]/50 resize-none`} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Видео со сделки (или другие нужные ссылки) - до 5</label>
          {[0, 1, 2, 3, 4].map((index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <Link2 className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={(formData.videoLinks as any)[index] || ''}
                onChange={(e) => {
                  const links = formData.videoLinks ? formData.videoLinks.split('\n').filter(l => l.trim()) : []
                  links[index] = e.target.value
                  updateField('videoLinks', links.join('\n'))
                }}
                placeholder={`Ссылка ${index + 1} (YouTube, Vimeo...)`}
                className={`flex-1 px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-[#4C7F6E]/50`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* === КНОПКИ === */}
      <div className="flex gap-3 pt-4 border-t border-white/10">
        <button type="button" onClick={onClose} className={`flex-1 px-4 py-3 rounded-xl border ${borderColor} font-medium hover:bg-white/5 transition-colors`}>Отмена</button>
        <button type="submit" className="flex-1 px-4 py-3 rounded-xl bg-[#4C7F6E] hover:bg-[#4C7F6E]/80 text-white font-bold transition-all shadow-lg shadow-[#4C7F6E]/25">Сохранить сделку</button>
      </div>
    </form>
  )
}

// ==================== ФОРМА POLYMARKET ====================
const PolymarketForm = ({ 
  onClose, 
  onSave 
}: { 
  onClose: () => void
  onSave: (data: PolymarketData) => void 
}) => {
  const { theme } = useThemeStore()
  
  const [formData, setFormData] = useState<PolymarketData>({
    entryDateTime: new Date().toISOString().slice(0, 16),
    marketName: '',
    outcome: '',
    entryPrice: '',
    positionSize: '',
    positionCost: '',
    exitDateTime: '',
    exitPrice: '',
    finalPnL: '',
    finalPnLPercent: '',
    triggerType: null,
    triggerDetails: '',
    thesis: '',
    emotionsBefore: null,
    takeProfitTarget: '',
    stopLossPrice: '',
    holdUntilResolution: null,
    tradeResult: null,
    exitReason: '',
    followedPlan: null,
    planDeviationReason: '',
    eventLink: '',
    additionalLinks: ['', ''],
    screenshots: []
  })

  const updateField = <K extends keyof PolymarketData>(key: K, value: PolymarketData[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const borderColor = theme === 'dark' ? 'border-white/10' : 'border-gray-200'
  const bgColor = theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* === 1. БАЗОВАЯ ИНФОРМАЦИЯ О СДЕЛКЕ === */}
      <div className="space-y-4">
        <h3 className={`text-lg font-bold ${textColor} flex items-center gap-2`}>
          <FileText className="w-5 h-5 text-rose-400" />
          Базовая информация о сделке
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Дата и время входа */}
          <div>
            <label className="block text-sm font-medium mb-2">Дата и время входа</label>
            <input
              type="datetime-local"
              value={formData.entryDateTime}
              onChange={(e) => updateField('entryDateTime', e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-rose-500/50`}
            />
          </div>

          {/* Рынок (Название события) */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Рынок (Название события)</label>
            <input
              type="text"
              value={formData.marketName}
              onChange={(e) => updateField('marketName', e.target.value)}
              placeholder="Will the Fed cut interest rates in March 2026?"
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-rose-500/50`}
            />
          </div>

          {/* Исход */}
          <div>
            <label className="block text-sm font-medium mb-2">Исход (на который ставили)</label>
            <input
              type="text"
              value={formData.outcome}
              onChange={(e) => updateField('outcome', e.target.value)}
              placeholder="Yes / No / Конкретный кандидат"
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-rose-500/50`}
            />
          </div>

          {/* Цена входа */}
          <div>
            <label className="block text-sm font-medium mb-2">Цена входа ($)</label>
            <input
              type="text"
              value={formData.entryPrice}
              onChange={(e) => updateField('entryPrice', e.target.value)}
              placeholder="$0.64 (или 64¢)"
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-rose-500/50`}
            />
          </div>

          {/* Объем позиции */}
          <div>
            <label className="block text-sm font-medium mb-2">Объем позиции (кол-во контрактов)</label>
            <input
              type="text"
              value={formData.positionSize}
              onChange={(e) => updateField('positionSize', e.target.value)}
              placeholder="100"
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-rose-500/50`}
            />
          </div>

          {/* Стоимость позиции */}
          <div>
            <label className="block text-sm font-medium mb-2">Стоимость позиции (общий риск)</label>
            <input
              type="text"
              value={formData.positionCost}
              onChange={(e) => updateField('positionCost', e.target.value)}
              placeholder="$64"
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-rose-500/50`}
            />
          </div>

          {/* Дата и время выхода */}
          <div>
            <label className="block text-sm font-medium mb-2">Дата и время выхода</label>
            <input
              type="datetime-local"
              value={formData.exitDateTime}
              onChange={(e) => updateField('exitDateTime', e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-rose-500/50`}
            />
          </div>

          {/* Цена выхода */}
          <div>
            <label className="block text-sm font-medium mb-2">Цена выхода ($)</label>
            <input
              type="text"
              value={formData.exitPrice}
              onChange={(e) => updateField('exitPrice', e.target.value)}
              placeholder="$0.85 (или 85¢)"
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-rose-500/50`}
            />
          </div>

          {/* Итоговый P&L */}
          <div>
            <label className="block text-sm font-medium mb-2">Итоговый P&L ($)</label>
            <input
              type="text"
              value={formData.finalPnL}
              onChange={(e) => updateField('finalPnL', e.target.value)}
              placeholder="+$21.00"
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-rose-500/50`}
            />
          </div>

          {/* P&L в % */}
          <div>
            <label className="block text-sm font-medium mb-2">Итоговый P&L (%)</label>
            <input
              type="text"
              value={formData.finalPnLPercent}
              onChange={(e) => updateField('finalPnLPercent', e.target.value)}
              placeholder="+32.8%"
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-rose-500/50`}
            />
          </div>
        </div>
      </div>

      {/* === 2. МЕНТАЛЬНОЕ СОСТОЯНИЕ И КОНТЕКСТ === */}
      <div className="space-y-4">
        <h3 className={`text-lg font-bold ${textColor} flex items-center gap-2`}>
          <Brain className="w-5 h-5 text-rose-400" />
          Ментальное состояние и контекст
        </h3>
        
        <div className="space-y-4">
          {/* Тиггер сделки */}
          <div>
            <label className="block text-sm font-medium mb-2">Тиггер сделки (почему вошли?)</label>
            <CustomSelect
              value={formData.triggerType}
              onChange={(v) => updateField('triggerType', v as PolymarketData['triggerType'])}
              options={[
                { value: 'news', label: '📰 Новость / Твит / Отчет' },
                { value: 'technical', label: '📊 Техническая картина (график)' },
                { value: 'intuition', label: '💡 Интуиция' },
                { value: 'signal', label: '📡 Сигнал / Рекомендация' }
              ]}
              placeholder="Выберите тип триггера..."
            />
          </div>

          {/* Детали триггера */}
          <div>
            <label className="block text-sm font-medium mb-2">Детали триггера</label>
            <textarea
              value={formData.triggerDetails}
              onChange={(e) => updateField('triggerDetails', e.target.value)}
              placeholder="Опишите подробнее, что именно стало поводом для входа..."
              rows={2}
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-rose-500/50 resize-none`}
            />
          </div>
          
          {/* Обоснование (Тезис) */}
          <div>
            <label className="block text-sm font-medium mb-2">Обоснование (Тезис)</label>
            <textarea
              value={formData.thesis}
              onChange={(e) => updateField('thesis', e.target.value)}
              placeholder="Я считаю, что вероятность выше рыночной, потому что... Рыночная цена 64%, а я оцениваю шанс в 80%..."
              rows={3}
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-rose-500/50 resize-none`}
            />
          </div>

          {/* Эмоции перед сделкой */}
          <div>
            <label className="block text-sm font-medium mb-2">Эмоции перед сделкой</label>
            <CustomSelect
              value={formData.emotionsBefore}
              onChange={(v) => updateField('emotionsBefore', v as PolymarketData['emotionsBefore'])}
              options={[
                { value: 'calm', label: '😌 Спокойствие' },
                { value: 'excitement', label: '🤩 Азарт' },
                { value: 'fear', label: '😰 Страх (FOMO)' },
                { value: 'uncertainty', label: '🤔 Неуверенность' }
              ]}
              placeholder="Выберите состояние..."
            />
          </div>

          {/* План на сделку */}
          <div className={`p-4 rounded-2xl border ${borderColor} ${theme === 'dark' ? 'bg-rose-900/10' : 'bg-rose-50'}`}>
            <h4 className="font-medium text-rose-400 mb-3">План на сделку</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Цель тейк-профита</label>
                <input
                  type="text"
                  value={formData.takeProfitTarget}
                  onChange={(e) => updateField('takeProfitTarget', e.target.value)}
                  placeholder="Продам при $0.85 или держу до исхода"
                  className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-rose-500/50`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Стоп-лосс</label>
                <input
                  type="text"
                  value={formData.stopLossPrice}
                  onChange={(e) => updateField('stopLossPrice', e.target.value)}
                  placeholder="Выхожу при $0.45"
                  className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-rose-500/50`}
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">Держать до исхода?</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => updateField('holdUntilResolution', true)}
                  className={`flex-1 px-4 py-3 rounded-xl border font-medium transition-all ${
                    formData.holdUntilResolution === true
                      ? 'bg-rose-500/20 border-rose-500 text-rose-400'
                      : theme === 'dark' 
                        ? 'border-white/10 hover:border-white/20' 
                        : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  ✓ Да
                </button>
                <button
                  type="button"
                  onClick={() => updateField('holdUntilResolution', false)}
                  className={`flex-1 px-4 py-3 rounded-xl border font-medium transition-all ${
                    formData.holdUntilResolution === false
                      ? 'bg-rose-500/20 border-rose-500 text-rose-400'
                      : theme === 'dark' 
                        ? 'border-white/10 hover:border-white/20' 
                        : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  ✗ Нет
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* === 3. АНАЛИЗ ВЫХОДА === */}
      <div className="space-y-4">
        <h3 className={`text-lg font-bold ${textColor} flex items-center gap-2`}>
          <TrendingUp className="w-5 h-5 text-rose-400" />
          Анализ выхода
        </h3>

        <div className="space-y-4">
          {/* Результат сделки */}
          <div>
            <label className="block text-sm font-medium mb-2">Результат сделки</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => updateField('tradeResult', 'profit')}
                className={`flex-1 px-4 py-3 rounded-xl border font-medium transition-all flex items-center justify-center gap-2 ${
                  formData.tradeResult === 'profit'
                    ? 'bg-green-500/20 border-green-500 text-green-400'
                    : theme === 'dark' 
                      ? 'border-white/10 hover:border-white/20' 
                      : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                Прибыль
              </button>
              <button
                type="button"
                onClick={() => updateField('tradeResult', 'loss')}
                className={`flex-1 px-4 py-3 rounded-xl border font-medium transition-all flex items-center justify-center gap-2 ${
                  formData.tradeResult === 'loss'
                    ? 'bg-red-500/20 border-red-500 text-red-400'
                    : theme === 'dark' 
                      ? 'border-white/10 hover:border-white/20' 
                      : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <TrendingDown className="w-4 h-4" />
                Убыток
              </button>
              <button
                type="button"
                onClick={() => updateField('tradeResult', 'zero')}
                className={`flex-1 px-4 py-3 rounded-xl border font-medium transition-all ${
                  formData.tradeResult === 'zero'
                    ? 'bg-gray-500/20 border-gray-500 text-gray-400'
                    : theme === 'dark' 
                      ? 'border-white/10 hover:border-white/20' 
                      : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                Ноль
              </button>
            </div>
          </div>

          {/* Почему закрыли именно здесь */}
          <div>
            <label className="block text-sm font-medium mb-2">Почему закрыли именно здесь?</label>
            <textarea
              value={formData.exitReason}
              onChange={(e) => updateField('exitReason', e.target.value)}
              placeholder="Что изменилось? Вышел опрос? Конгрессмен что-то сказал? Просто испугались просадки? Или держали до исхода?"
              rows={3}
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-rose-500/50 resize-none`}
            />
          </div>

          {/* Соответствие плану */}
          <div>
            <label className="block text-sm font-medium mb-2">Следовал плану?</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => updateField('followedPlan', true)}
                className={`flex-1 px-4 py-3 rounded-xl border font-medium transition-all ${
                  formData.followedPlan === true
                    ? 'bg-green-500/20 border-green-500 text-green-400'
                    : theme === 'dark' 
                      ? 'border-white/10 hover:border-white/20' 
                      : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                ✓ Да
              </button>
              <button
                type="button"
                onClick={() => updateField('followedPlan', false)}
                className={`flex-1 px-4 py-3 rounded-xl border font-medium transition-all ${
                  formData.followedPlan === false
                    ? 'bg-red-500/20 border-red-500 text-red-400'
                    : theme === 'dark' 
                      ? 'border-white/10 hover:border-white/20' 
                      : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                ✗ Нет
              </button>
            </div>
          </div>

          {/* Причина отклонения от плана */}
          {formData.followedPlan === false && (
            <div>
              <label className="block text-sm font-medium mb-2">Почему отклонились от плана?</label>
              <textarea
                value={formData.planDeviationReason}
                onChange={(e) => updateField('planDeviationReason', e.target.value)}
                placeholder="Жадность, паника, надежда, другой фактор..."
                rows={2}
                className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-rose-500/50 resize-none`}
              />
            </div>
          )}
        </div>
      </div>

      {/* === ССЫЛКИ === */}
      <div className="space-y-4">
        <h3 className={`text-lg font-bold ${textColor} flex items-center gap-2`}>
          <ExternalLink className="w-5 h-5 text-rose-400" />
          Ссылки
        </h3>

        <div className="space-y-3">
          {/* Ссылка на событие */}
          <div>
            <label className="block text-sm font-medium mb-2">Ссылка на событие (Polymarket)</label>
            <div className="flex items-center gap-2">
              <Link2 className="w-4 h-4 text-gray-400" />
              <input
                type="url"
                value={formData.eventLink}
                onChange={(e) => updateField('eventLink', e.target.value)}
                placeholder="https://polymarket.com/event/..."
                className={`flex-1 px-4 py-2.5 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-rose-500/50`}
              />
            </div>
          </div>

          {/* Дополнительные ссылки */}
          <div>
            <label className="block text-sm font-medium mb-2">Дополнительные ссылки (до 2 штук)</label>
            {[0, 1].map((index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <Link2 className="w-4 h-4 text-gray-400" />
                <input
                  type="url"
                  value={formData.additionalLinks[index] || ''}
                  onChange={(e) => {
                    const links = [...formData.additionalLinks]
                    links[index] = e.target.value
                    updateField('additionalLinks', links)
                  }}
                  placeholder={`Ссылка ${index + 1}`}
                  className={`flex-1 px-4 py-2.5 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-rose-500/50`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* === СКРИНШОТЫ === */}
      <div className="space-y-4">
        <h3 className={`text-lg font-bold ${textColor} flex items-center gap-2`}>
          <Camera className="w-5 h-5 text-rose-400" />
          Скриншоты (до 2 штук)
        </h3>

        <div className="grid grid-cols-2 gap-4">
          {[0, 1].map((index) => (
            <div key={index}>
              {formData.screenshots[index] ? (
                <div className="relative group">
                  <img
                    src={formData.screenshots[index]}
                    alt={`Скриншот ${index + 1}`}
                    className="w-full h-40 object-cover rounded-xl border border-white/10"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newScreenshots = [...formData.screenshots]
                      newScreenshots.splice(index, 1)
                      updateField('screenshots', newScreenshots)
                    }}
                    className="absolute top-2 right-2 p-2 rounded-lg bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label
                  className={`flex flex-col items-center justify-center h-40 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
                    theme === 'dark'
                      ? 'border-white/20 hover:border-rose-500/50 bg-white/5'
                      : 'border-gray-300 hover:border-rose-500 bg-gray-50'
                  }`}
                >
                  <Camera className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-400">Скриншот {index + 1}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        if (file.size > 5 * 1024 * 1024) {
                          alert('Файл слишком большой. Максимальный размер: 5MB')
                          e.target.value = ''
                          return
                        }
                        const reader = new FileReader()
                        reader.onloadend = () => {
                          const base64 = reader.result as string
                          const newScreenshots = [...formData.screenshots]
                          const currentScreenshots = newScreenshots.filter(Boolean)
                          if (currentScreenshots.length < 2) {
                            currentScreenshots.push(base64)
                            updateField('screenshots', currentScreenshots)
                          }
                        }
                        reader.readAsDataURL(file)
                      }
                      e.target.value = ''
                    }}
                  />
                </label>
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400">
          Поддерживаются форматы: PNG, JPG, WEBP. Максимальный размер: 5MB
        </p>
      </div>

      {/* Кнопки */}
      <div className="flex gap-3 pt-4 border-t border-white/10">
        <button
          type="button"
          onClick={onClose}
          className={`flex-1 px-4 py-3 rounded-xl border ${borderColor} font-medium hover:bg-white/5 transition-colors`}
        >
          Отмена
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold hover:from-rose-400 hover:to-orange-400 transition-all shadow-lg shadow-rose-500/25"
        >
          <Check className="w-4 h-4 inline mr-2" />
          Сохранить сделку
        </button>
      </div>
    </form>
  )
}

// ==================== ФОРМА SPOT ====================
const SpotForm = ({ 
  onClose, 
  onSave 
}: { 
  onClose: () => void
  onSave: (data: SpotData) => void 
}) => {
  const { theme } = useThemeStore()
  
  const [formData, setFormData] = useState<SpotData>({
    entryDateTime: new Date().toISOString().slice(0, 16),
    assetPair: '',
    direction: 'long',
    entryPrice: '',
    positionSize: '',
    positionCost: '',
    exitDateTime: '',
    exitPrice: '',
    commissions: '',
    finalPnL: '',
    finalPnLPercent: '',
    analysisTypes: [],
    thesis: '',
    timeframe: null,
    stopLoss: '',
    takeProfit1: '',
    takeProfit1Percent: '',
    takeProfit2: '',
    takeProfit2Percent: '',
    hadDCA: null,
    dcaReason: '',
    emotionsOnMinus: '',
    emotionsOnPlus: '',
    exitReason: null,
    exitReasonDetails: '',
    followedPlan: null,
    planDeviationReason: '',
    decisionQuality: null,
    decisionAnalysis: '',
    links: ['', '', ''],
    screenshots: []
  })

  const updateField = <K extends keyof SpotData>(key: K, value: SpotData[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const toggleAnalysisType = (type: 'technical' | 'fundamental' | 'sentiment') => {
    const current = formData.analysisTypes
    if (current.includes(type)) {
      updateField('analysisTypes', current.filter(t => t !== type))
    } else {
      updateField('analysisTypes', [...current, type])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const borderColor = theme === 'dark' ? 'border-white/10' : 'border-gray-200'
  const bgColor = theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* === 1. БАЗОВАЯ ИНФОРМАЦИЯ О СДЕЛКЕ === */}
      <div className="space-y-4">
        <h3 className={`text-lg font-bold ${textColor} flex items-center gap-2`}>
          <FileText className="w-5 h-5 text-amber-400" />
          Базовая информация о сделке
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Дата и время входа */}
          <div>
            <label className="block text-sm font-medium mb-2">Дата и время входа</label>
            <input
              type="datetime-local"
              value={formData.entryDateTime}
              onChange={(e) => updateField('entryDateTime', e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-amber-500/50`}
            />
          </div>

          {/* Актив (Пара) */}
          <div>
            <label className="block text-sm font-medium mb-2">Актив (Пара)</label>
            <input
              type="text"
              value={formData.assetPair}
              onChange={(e) => updateField('assetPair', e.target.value)}
              placeholder="BTC/USDT, ETH/USDC..."
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-amber-500/50`}
            />
          </div>

          {/* Направление */}
          <div>
            <label className="block text-sm font-medium mb-2">Направление</label>
            <div className="px-4 py-3 rounded-xl border border-green-500/30 bg-green-500/10 text-green-400 font-medium">
              📈 Long (покупка)
            </div>
          </div>

          {/* Цена входа */}
          <div>
            <label className="block text-sm font-medium mb-2">Цена входа ($)</label>
            <input
              type="text"
              value={formData.entryPrice}
              onChange={(e) => updateField('entryPrice', e.target.value)}
              placeholder="$45,000"
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-amber-500/50`}
            />
          </div>

          {/* Объем */}
          <div>
            <label className="block text-sm font-medium mb-2">Объем (количество монет)</label>
            <input
              type="text"
              value={formData.positionSize}
              onChange={(e) => updateField('positionSize', e.target.value)}
              placeholder="0.5 BTC"
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-amber-500/50`}
            />
          </div>

          {/* Стоимость позиции */}
          <div>
            <label className="block text-sm font-medium mb-2">Стоимость позиции ($)</label>
            <input
              type="text"
              value={formData.positionCost}
              onChange={(e) => updateField('positionCost', e.target.value)}
              placeholder="$22,500"
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-amber-500/50`}
            />
          </div>

          {/* Дата и время выхода */}
          <div>
            <label className="block text-sm font-medium mb-2">Дата и время выхода</label>
            <input
              type="datetime-local"
              value={formData.exitDateTime}
              onChange={(e) => updateField('exitDateTime', e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-amber-500/50`}
            />
          </div>

          {/* Цена выхода */}
          <div>
            <label className="block text-sm font-medium mb-2">Цена выхода ($)</label>
            <input
              type="text"
              value={formData.exitPrice}
              onChange={(e) => updateField('exitPrice', e.target.value)}
              placeholder="$48,000"
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-amber-500/50`}
            />
          </div>

          {/* Комиссии */}
          <div>
            <label className="block text-sm font-medium mb-2">Комиссии</label>
            <input
              type="text"
              value={formData.commissions}
              onChange={(e) => updateField('commissions', e.target.value)}
              placeholder="$15.50"
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-amber-500/50`}
            />
          </div>

          {/* Итоговый P&L */}
          <div>
            <label className="block text-sm font-medium mb-2">Итоговый P&L ($)</label>
            <input
              type="text"
              value={formData.finalPnL}
              onChange={(e) => updateField('finalPnL', e.target.value)}
              placeholder="+$1,500"
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-amber-500/50`}
            />
          </div>

          {/* P&L в % */}
          <div>
            <label className="block text-sm font-medium mb-2">Итоговый P&L (%)</label>
            <input
              type="text"
              value={formData.finalPnLPercent}
              onChange={(e) => updateField('finalPnLPercent', e.target.value)}
              placeholder="+6.67%"
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-amber-500/50`}
            />
          </div>
        </div>
      </div>

      {/* === 2. КОНТЕКСТ И ТЕЗИС === */}
      <div className="space-y-4">
        <h3 className={`text-lg font-bold ${textColor} flex items-center gap-2`}>
          <Brain className="w-5 h-5 text-amber-400" />
          Контекст и Тезис
        </h3>

        <div className="space-y-4">
          {/* Тип анализа */}
          <div>
            <label className="block text-sm font-medium mb-2">Тип анализа (можно выбрать несколько)</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => toggleAnalysisType('technical')}
                className={`px-4 py-3 rounded-xl border font-medium transition-all ${
                  formData.analysisTypes.includes('technical')
                    ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                    : theme === 'dark' 
                      ? 'border-white/10 hover:border-white/20' 
                      : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                📊 Технический (ТА)
              </button>
              <button
                type="button"
                onClick={() => toggleAnalysisType('fundamental')}
                className={`px-4 py-3 rounded-xl border font-medium transition-all ${
                  formData.analysisTypes.includes('fundamental')
                    ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                    : theme === 'dark' 
                      ? 'border-white/10 hover:border-white/20' 
                      : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                📰 Фундаментальный (ФА)
              </button>
              <button
                type="button"
                onClick={() => toggleAnalysisType('sentiment')}
                className={`px-4 py-3 rounded-xl border font-medium transition-all ${
                  formData.analysisTypes.includes('sentiment')
                    ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                    : theme === 'dark' 
                      ? 'border-white/10 hover:border-white/20' 
                      : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                😰 Сентимент
              </button>
            </div>
          </div>

          {/* Тезис */}
          <div>
            <label className="block text-sm font-medium mb-2">Тезис</label>
            <textarea
              value={formData.thesis}
              onChange={(e) => updateField('thesis', e.target.value)}
              placeholder="BTC пробил нисходящий тренд на 4-часовом графике с объемом, захожу в лонг в расчете на движение к следующему сопротивлению..."
              rows={3}
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none`}
            />
          </div>

          {/* Таймфрейм */}
          <div>
            <label className="block text-sm font-medium mb-2">Таймфрейм сделки</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => updateField('timeframe', 'scalp')}
                className={`px-4 py-3 rounded-xl border font-medium transition-all ${
                  formData.timeframe === 'scalp'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                    : theme === 'dark' 
                      ? 'border-white/10 hover:border-white/20' 
                      : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                ⚡ Скальп
              </button>
              <button
                type="button"
                onClick={() => updateField('timeframe', 'short')}
                className={`px-4 py-3 rounded-xl border font-medium transition-all ${
                  formData.timeframe === 'short'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                    : theme === 'dark' 
                      ? 'border-white/10 hover:border-white/20' 
                      : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                📅 Краткосрок
              </button>
              <button
                type="button"
                onClick={() => updateField('timeframe', 'medium')}
                className={`px-4 py-3 rounded-xl border font-medium transition-all ${
                  formData.timeframe === 'medium'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                    : theme === 'dark' 
                      ? 'border-white/10 hover:border-white/20' 
                      : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                📆 Среднесрок
              </button>
              <button
                type="button"
                onClick={() => updateField('timeframe', 'long')}
                className={`px-4 py-3 rounded-xl border font-medium transition-all ${
                  formData.timeframe === 'long'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                    : theme === 'dark' 
                      ? 'border-white/10 hover:border-white/20' 
                      : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                🚀 Долгосрок
              </button>
            </div>
          </div>

          {/* Риск-менеджмент */}
          <div className={`p-4 rounded-2xl border ${borderColor} ${theme === 'dark' ? 'bg-amber-900/10' : 'bg-amber-50'}`}>
            <h4 className="font-medium text-amber-400 mb-3">⚠️ Риск-менеджмент</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Стоп-лосс ($)</label>
                <input
                  type="text"
                  value={formData.stopLoss}
                  onChange={(e) => updateField('stopLoss', e.target.value)}
                  placeholder="$43,500"
                  className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-amber-500/50`}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Тейк-профит 1</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={formData.takeProfit1}
                    onChange={(e) => updateField('takeProfit1', e.target.value)}
                    placeholder="Цена: $48,000"
                    className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-amber-500/50`}
                  />
                  <input
                    type="text"
                    value={formData.takeProfit1Percent}
                    onChange={(e) => updateField('takeProfit1Percent', e.target.value)}
                    placeholder="Продать: 50% позиции"
                    className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-amber-500/50`}
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Тейк-профит 2</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={formData.takeProfit2}
                    onChange={(e) => updateField('takeProfit2', e.target.value)}
                    placeholder="Цена: $52,000"
                    className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-amber-500/50`}
                  />
                  <input
                    type="text"
                    value={formData.takeProfit2Percent}
                    onChange={(e) => updateField('takeProfit2Percent', e.target.value)}
                    placeholder="Продать: остальное"
                    className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-amber-500/50`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* === 3. УПРАВЛЕНИЕ ПОЗИЦИЕЙ === */}
      <div className="space-y-4">
        <h3 className={`text-lg font-bold ${textColor} flex items-center gap-2`}>
          <Target className="w-5 h-5 text-amber-400" />
          Управление позицией
        </h3>

        <div className="space-y-4">
          {/* Были ли доливки */}
          <div>
            <label className="block text-sm font-medium mb-2">Были ли доливки (усреднение)?</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => updateField('hadDCA', true)}
                className={`flex-1 px-4 py-3 rounded-xl border font-medium transition-all ${
                  formData.hadDCA === true
                    ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                    : theme === 'dark' 
                      ? 'border-white/10 hover:border-white/20' 
                      : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                ✓ Да
              </button>
              <button
                type="button"
                onClick={() => updateField('hadDCA', false)}
                className={`flex-1 px-4 py-3 rounded-xl border font-medium transition-all ${
                  formData.hadDCA === false
                    ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                    : theme === 'dark' 
                      ? 'border-white/10 hover:border-white/20' 
                      : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                ✗ Нет
              </button>
            </div>
          </div>

          {/* Причина доливки */}
          {formData.hadDCA && (
            <div>
              <label className="block text-sm font-medium mb-2">Причина доливки</label>
              <textarea
                value={formData.dcaReason}
                onChange={(e) => updateField('dcaReason', e.target.value)}
                placeholder="Цена пошла против меня, но тезис сильнее — купил еще ниже..."
                rows={2}
                className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none`}
              />
            </div>
          )}

          {/* Эмоции во время сделки */}
          <div className={`p-4 rounded-2xl border ${borderColor}`}>
            <h4 className="font-medium mb-3">Эмоции во время сделки</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-2 text-red-400">Когда цена пошла в минус:</label>
                <textarea
                  value={formData.emotionsOnMinus}
                  onChange={(e) => updateField('emotionsOnMinus', e.target.value)}
                  placeholder="Паника? Спокойствие? Желание докупить?"
                  rows={2}
                  className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-green-400">Когда цена пошла в плюс:</label>
                <textarea
                  value={formData.emotionsOnPlus}
                  onChange={(e) => updateField('emotionsOnPlus', e.target.value)}
                  placeholder="Желание закрыть всё сразу? Или хочется держать до луны?"
                  rows={2}
                  className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* === 4. АНАЛИЗ ВЫХОДА === */}
      <div className="space-y-4">
        <h3 className={`text-lg font-bold ${textColor} flex items-center gap-2`}>
          <TrendingUp className="w-5 h-5 text-amber-400" />
          Анализ выхода
        </h3>

        <div className="space-y-4">
          {/* Причина выхода */}
          <div>
            <label className="block text-sm font-medium mb-2">Причина выхода</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => updateField('exitReason', 'takeProfit')}
                className={`px-4 py-3 rounded-xl border font-medium transition-all ${
                  formData.exitReason === 'takeProfit'
                    ? 'bg-green-500/20 border-green-500 text-green-400'
                    : theme === 'dark' 
                      ? 'border-white/10 hover:border-white/20' 
                      : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                🎯 Достиг TP
              </button>
              <button
                type="button"
                onClick={() => updateField('exitReason', 'stopLoss')}
                className={`px-4 py-3 rounded-xl border font-medium transition-all ${
                  formData.exitReason === 'stopLoss'
                    ? 'bg-red-500/20 border-red-500 text-red-400'
                    : theme === 'dark' 
                      ? 'border-white/10 hover:border-white/20' 
                      : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                🛑 Сработал SL
              </button>
              <button
                type="button"
                onClick={() => updateField('exitReason', 'fundamental')}
                className={`px-4 py-3 rounded-xl border font-medium transition-all ${
                  formData.exitReason === 'fundamental'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                    : theme === 'dark' 
                      ? 'border-white/10 hover:border-white/20' 
                      : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                📰 Изменился ФА
              </button>
              <button
                type="button"
                onClick={() => updateField('exitReason', 'emotions')}
                className={`px-4 py-3 rounded-xl border font-medium transition-all ${
                  formData.exitReason === 'emotions'
                    ? 'bg-purple-500/20 border-purple-500 text-purple-400'
                    : theme === 'dark' 
                      ? 'border-white/10 hover:border-white/20' 
                      : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                😰 Эмоции
              </button>
            </div>
          </div>

          {/* Детали причины выхода */}
          <div>
            <label className="block text-sm font-medium mb-2">Детали выхода</label>
            <textarea
              value={formData.exitReasonDetails}
              onChange={(e) => updateField('exitReasonDetails', e.target.value)}
              placeholder="Подробнее опишите причину выхода..."
              rows={2}
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none`}
            />
          </div>

          {/* Соответствие плану */}
          <div>
            <label className="block text-sm font-medium mb-2">Следовал плану?</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => updateField('followedPlan', true)}
                className={`flex-1 px-4 py-3 rounded-xl border font-medium transition-all ${
                  formData.followedPlan === true
                    ? 'bg-green-500/20 border-green-500 text-green-400'
                    : theme === 'dark' 
                      ? 'border-white/10 hover:border-white/20' 
                      : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                ✓ Да
              </button>
              <button
                type="button"
                onClick={() => updateField('followedPlan', false)}
                className={`flex-1 px-4 py-3 rounded-xl border font-medium transition-all ${
                  formData.followedPlan === false
                    ? 'bg-red-500/20 border-red-500 text-red-400'
                    : theme === 'dark' 
                      ? 'border-white/10 hover:border-white/20' 
                      : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                ✗ Нет
              </button>
            </div>
          </div>

          {/* Причина отклонения от плана */}
          {formData.followedPlan === false && (
            <div>
              <label className="block text-sm font-medium mb-2">Почему отклонились от плана?</label>
              <textarea
                value={formData.planDeviationReason}
                onChange={(e) => updateField('planDeviationReason', e.target.value)}
                placeholder="Изменил стоп или передвинул тейк, потому что..."
                rows={2}
                className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none`}
              />
            </div>
          )}

          {/* Оценка решения */}
          <div>
            <label className="block text-sm font-medium mb-2">Оценка решения</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => updateField('decisionQuality', 'good')}
                className={`flex-1 px-4 py-3 rounded-xl border font-medium transition-all ${
                  formData.decisionQuality === 'good'
                    ? 'bg-green-500/20 border-green-500 text-green-400'
                    : theme === 'dark' 
                      ? 'border-white/10 hover:border-white/20' 
                      : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                ✓ Хорошее
              </button>
              <button
                type="button"
                onClick={() => updateField('decisionQuality', 'bad')}
                className={`flex-1 px-4 py-3 rounded-xl border font-medium transition-all ${
                  formData.decisionQuality === 'bad'
                    ? 'bg-red-500/20 border-red-500 text-red-400'
                    : theme === 'dark' 
                      ? 'border-white/10 hover:border-white/20' 
                      : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                ✗ Плохое
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Убыток по стопу — это хорошее решение (сохранили капитал). Прибыль из-за паники до тейка — плохое решение.
            </p>
          </div>

          {/* Анализ решения */}
          <div>
            <label className="block text-sm font-medium mb-2">Анализ решения</label>
            <textarea
              value={formData.decisionAnalysis}
              onChange={(e) => updateField('decisionAnalysis', e.target.value)}
              placeholder="Тезис не подтвердился, решение продать по стопу было верным, сохранил капитал..."
              rows={2}
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none`}
            />
          </div>
        </div>
      </div>

      {/* === ССЫЛКИ === */}
      <div className="space-y-4">
        <h3 className={`text-lg font-bold ${textColor} flex items-center gap-2`}>
          <ExternalLink className="w-5 h-5 text-amber-400" />
          Ссылки (или другие нужные ссылки)
        </h3>

        <div className="space-y-3">
          {[0, 1, 2].map((index) => (
            <div key={index} className="flex items-center gap-2">
              <Link2 className="w-4 h-4 text-gray-400" />
              <input
                type="url"
                value={formData.links[index] || ''}
                onChange={(e) => {
                  const links = [...formData.links]
                  links[index] = e.target.value
                  updateField('links', links)
                }}
                placeholder={`Ссылка ${index + 1}`}
                className={`flex-1 px-4 py-2.5 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-amber-500/50`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* === СКРИНШОТЫ === */}
      <div className="space-y-4">
        <h3 className={`text-lg font-bold ${textColor} flex items-center gap-2`}>
          <Camera className="w-5 h-5 text-amber-400" />
          Скриншоты (до 2 штук)
        </h3>

        <div className="grid grid-cols-2 gap-4">
          {[0, 1].map((index) => (
            <div key={index}>
              {formData.screenshots[index] ? (
                <div className="relative group">
                  <img
                    src={formData.screenshots[index]}
                    alt={`Скриншот ${index + 1}`}
                    className="w-full h-40 object-cover rounded-xl border border-white/10"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newScreenshots = [...formData.screenshots]
                      newScreenshots.splice(index, 1)
                      updateField('screenshots', newScreenshots)
                    }}
                    className="absolute top-2 right-2 p-2 rounded-lg bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label
                  className={`flex flex-col items-center justify-center h-40 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
                    theme === 'dark'
                      ? 'border-white/20 hover:border-amber-500/50 bg-white/5'
                      : 'border-gray-300 hover:border-amber-500 bg-gray-50'
                  }`}
                >
                  <Camera className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-400">Скриншот {index + 1}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        if (file.size > 5 * 1024 * 1024) {
                          alert('Файл слишком большой. Максимальный размер: 5MB')
                          e.target.value = ''
                          return
                        }
                        const reader = new FileReader()
                        reader.onloadend = () => {
                          const base64 = reader.result as string
                          const newScreenshots = [...formData.screenshots]
                          const currentScreenshots = newScreenshots.filter(Boolean)
                          if (currentScreenshots.length < 2) {
                            currentScreenshots.push(base64)
                            updateField('screenshots', currentScreenshots)
                          }
                        }
                        reader.readAsDataURL(file)
                      }
                      e.target.value = ''
                    }}
                  />
                </label>
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400">
          Поддерживаются форматы: PNG, JPG, WEBP. Максимальный размер: 5MB
        </p>
      </div>

      {/* Кнопки */}
      <div className="flex gap-3 pt-4 border-t border-white/10">
        <button
          type="button"
          onClick={onClose}
          className={`flex-1 px-4 py-3 rounded-xl border ${borderColor} font-medium hover:bg-white/5 transition-colors`}
        >
          Отмена
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg shadow-amber-500/25"
        >
          <Check className="w-4 h-4 inline mr-2" />
          Сохранить сделку
        </button>
      </div>
    </form>
  )
}

// ==================== ФОРМА FUTURES ====================
const FuturesForm = ({ 
  onClose, 
  onSave 
}: { 
  onClose: () => void
  onSave: (data: FuturesData) => void 
}) => {
  const { theme } = useThemeStore()
  
  const [formData, setFormData] = useState<FuturesData>({
    // === 1. ПАСПОРТ СДЕЛКИ ===
    entryDateTime: new Date().toISOString().slice(0, 16),
    assetPair: '',
    direction: null,
    positionSize: '',
    positionSizeUnit: null,
    leverage: '',
    margin: '',
    entryPrice: '',
    liquidationPrice: '',
    stopLoss: '',
    takeProfit: '',
    exitDateTime: '',
    exitPrice: '',
    fundingRateEntry: '',
    fundingRateExit: '',
    finalPnL: '',
    finalPnLPercent: '',
    // === 2. КОНТЕКСТ И ТЕЗИС ===
    analysisTypes: [],
    thesis: '',
    timeframe: null,
    riskPercent: '',
    // === 3. УПРАВЛЕНИЕ ПОЗИЦИЕЙ ===
    movedStopLoss: null,
    addedToPosition: null,
    modificationsDetails: '',
    hadFOMO: null,
    hadPanic: null,
    hadGreed: null,
    observations: '',
    // === 4. АНАЛИЗ ВЫХОДА ===
    exitReason: null,
    exitReasonDetails: '',
    followedPlan: null,
    planDeviationReason: '',
    errorAnalysis: '',
    successAnalysis: '',
    tradeResult: null,
    // === ССЫЛКИ И СКРИНШОТЫ ===
    links: ['', '', ''],
    screenshots: []
  })

  const updateField = <K extends keyof FuturesData>(key: K, value: FuturesData[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const toggleAnalysisType = (type: 'technical' | 'fundamental') => {
    const current = formData.analysisTypes
    if (current.includes(type)) {
      updateField('analysisTypes', current.filter(t => t !== type))
    } else {
      updateField('analysisTypes', [...current, type])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const borderColor = theme === 'dark' ? 'border-white/10' : 'border-gray-200'
  const bgColor = theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* === 1. ОБЪЕКТИВНЫЕ ДАННЫЕ (ПАСПОРТ СДЕЛКИ) === */}
      <div className="space-y-4">
        <h3 className={`text-lg font-bold ${textColor} flex items-center gap-2`}>
          <FileText className="w-5 h-5 text-blue-400" />
          Паспорт сделки
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Дата и время входа */}
          <div>
            <label className="block text-sm font-medium mb-2">Дата и время входа</label>
            <input
              type="datetime-local"
              value={formData.entryDateTime}
              onChange={(e) => updateField('entryDateTime', e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
            />
          </div>

          {/* Актив (Пара) */}
          <div>
            <label className="block text-sm font-medium mb-2">Актив (Пара)</label>
            <input
              type="text"
              value={formData.assetPair}
              onChange={(e) => updateField('assetPair', e.target.value)}
              placeholder="BTCUSDT.P, ETHUSDT.P..."
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
            />
          </div>

          {/* Направление */}
          <div>
            <label className="block text-sm font-medium mb-2">Направление</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => updateField('direction', 'long')}
                className={`px-4 py-3 rounded-xl border font-medium transition-all flex items-center justify-center gap-2 ${
                  formData.direction === 'long'
                    ? 'bg-green-500/20 border-green-500 text-green-400'
                    : theme === 'dark' 
                      ? 'border-white/10 hover:border-white/20' 
                      : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                LONG
              </button>
              <button
                type="button"
                onClick={() => updateField('direction', 'short')}
                className={`px-4 py-3 rounded-xl border font-medium transition-all flex items-center justify-center gap-2 ${
                  formData.direction === 'short'
                    ? 'bg-red-500/20 border-red-500 text-red-400'
                    : theme === 'dark' 
                      ? 'border-white/10 hover:border-white/20' 
                      : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <TrendingDown className="w-4 h-4" />
                SHORT
              </button>
            </div>
          </div>

          {/* Размер позиции */}
          <div>
            <label className="block text-sm font-medium mb-2">Размер позиции</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.positionSize}
                onChange={(e) => updateField('positionSize', e.target.value)}
                placeholder="1000"
                className={`flex-1 px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
              />
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => updateField('positionSizeUnit', 'usd')}
                  className={`px-3 py-3 rounded-xl border font-medium transition-all text-sm ${
                    formData.positionSizeUnit === 'usd'
                      ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                      : theme === 'dark' 
                        ? 'border-white/10 hover:border-white/20' 
                        : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  $
                </button>
                <button
                  type="button"
                  onClick={() => updateField('positionSizeUnit', 'coins')}
                  className={`px-3 py-3 rounded-xl border font-medium transition-all text-sm ${
                    formData.positionSizeUnit === 'coins'
                      ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                      : theme === 'dark' 
                        ? 'border-white/10 hover:border-white/20' 
                        : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  монет
                </button>
              </div>
            </div>
          </div>

          {/* Плечо */}
          <div>
            <label className="block text-sm font-medium mb-2">Плечо (x)</label>
            <input
              type="text"
              value={formData.leverage}
              onChange={(e) => updateField('leverage', e.target.value)}
              placeholder="5x, 10x, 20x..."
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
            />
          </div>

          {/* Маржа (Залог) */}
          <div>
            <label className="block text-sm font-medium mb-2">Маржа (Залог)</label>
            <input
              type="text"
              value={formData.margin}
              onChange={(e) => updateField('margin', e.target.value)}
              placeholder="$100"
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
            />
            <p className="text-xs text-gray-400 mt-1">Ваши собственные деньги в позиции</p>
          </div>

          {/* Цена входа */}
          <div>
            <label className="block text-sm font-medium mb-2">Цена входа</label>
            <input
              type="text"
              value={formData.entryPrice}
              onChange={(e) => updateField('entryPrice', e.target.value)}
              placeholder="$45,000"
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
            />
          </div>

          {/* Цена ликвидации */}
          <div>
            <label className="block text-sm font-medium mb-2">Цена ликвидации</label>
            <input
              type="text"
              value={formData.liquidationPrice}
              onChange={(e) => updateField('liquidationPrice', e.target.value)}
              placeholder="$40,500"
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
            />
            <p className="text-xs text-red-400 mt-1">⚠️ Красная линия, которую нельзя пересекать</p>
          </div>

          {/* Стоп-лосс */}
          <div>
            <label className="block text-sm font-medium mb-2">Стоп-лосс (Цена)</label>
            <input
              type="text"
              value={formData.stopLoss}
              onChange={(e) => updateField('stopLoss', e.target.value)}
              placeholder="$43,500"
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
            />
          </div>

          {/* Тейк-профит */}
          <div>
            <label className="block text-sm font-medium mb-2">Тейк-профит (Цена)</label>
            <input
              type="text"
              value={formData.takeProfit}
              onChange={(e) => updateField('takeProfit', e.target.value)}
              placeholder="$50,000"
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
            />
          </div>

          {/* Дата и время выхода */}
          <div>
            <label className="block text-sm font-medium mb-2">Дата и время выхода</label>
            <input
              type="datetime-local"
              value={formData.exitDateTime}
              onChange={(e) => updateField('exitDateTime', e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
            />
          </div>

          {/* Цена выхода */}
          <div>
            <label className="block text-sm font-medium mb-2">Цена выхода</label>
            <input
              type="text"
              value={formData.exitPrice}
              onChange={(e) => updateField('exitPrice', e.target.value)}
              placeholder="$48,000"
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
            />
          </div>

          {/* Funding Rate на входе */}
          <div>
            <label className="block text-sm font-medium mb-2">Funding Rate на входе</label>
            <input
              type="text"
              value={formData.fundingRateEntry}
              onChange={(e) => updateField('fundingRateEntry', e.target.value)}
              placeholder="+0.01% или -0.02%"
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
            />
          </div>

          {/* Funding Rate на выходе */}
          <div>
            <label className="block text-sm font-medium mb-2">Funding Rate на выходе</label>
            <input
              type="text"
              value={formData.fundingRateExit}
              onChange={(e) => updateField('fundingRateExit', e.target.value)}
              placeholder="+0.01% или -0.02%"
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
            />
          </div>

          {/* Итоговый P&L */}
          <div>
            <label className="block text-sm font-medium mb-2">Итоговый P&L ($)</label>
            <input
              type="text"
              value={formData.finalPnL}
              onChange={(e) => updateField('finalPnL', e.target.value)}
              placeholder="+$500 или -$200"
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
            />
          </div>

          {/* P&L в % */}
          <div>
            <label className="block text-sm font-medium mb-2">Итоговый P&L (%)</label>
            <input
              type="text"
              value={formData.finalPnLPercent}
              onChange={(e) => updateField('finalPnLPercent', e.target.value)}
              placeholder="+50% или -20%"
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
            />
            <p className="text-xs text-gray-400 mt-1">Считайте % от маржи, не от размера позиции</p>
          </div>
        </div>
      </div>

      {/* === 2. КОНТЕКСТ И ТЕЗИС === */}
      <div className="space-y-4">
        <h3 className={`text-lg font-bold ${textColor} flex items-center gap-2`}>
          <Brain className="w-5 h-5 text-blue-400" />
          Контекст и Тезис
        </h3>

        <div className="space-y-4">
          {/* Тип анализа */}
          <div>
            <label className="block text-sm font-medium mb-2">Тип анализа (можно выбрать несколько)</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => toggleAnalysisType('technical')}
                className={`px-4 py-3 rounded-xl border font-medium transition-all ${
                  formData.analysisTypes.includes('technical')
                    ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                    : theme === 'dark' 
                      ? 'border-white/10 hover:border-white/20' 
                      : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                📊 Технический (уровни, паттерны, индикаторы)
              </button>
              <button
                type="button"
                onClick={() => toggleAnalysisType('fundamental')}
                className={`px-4 py-3 rounded-xl border font-medium transition-all ${
                  formData.analysisTypes.includes('fundamental')
                    ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                    : theme === 'dark' 
                      ? 'border-white/10 hover:border-white/20' 
                      : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                📰 Фундаментальный / Новостной
              </button>
            </div>
          </div>

          {/* Краткое обоснование */}
          <div>
            <label className="block text-sm font-medium mb-2">Краткое обоснование</label>
            <textarea
              value={formData.thesis}
              onChange={(e) => updateField('thesis', e.target.value)}
              placeholder="Прорыв уровня сопротивления на высоком объеме, захожу в лонг с целью до ликвидации выше... или Плохие новости по макроэкономике, захожу в шорт на пробой поддержки..."
              rows={3}
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none`}
            />
          </div>

          {/* Таймфрейм */}
          <div>
            <label className="block text-sm font-medium mb-2">Таймфрейм</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => updateField('timeframe', 'scalp')}
                className={`px-4 py-3 rounded-xl border font-medium transition-all ${
                  formData.timeframe === 'scalp'
                    ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                    : theme === 'dark' 
                      ? 'border-white/10 hover:border-white/20' 
                      : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                ⚡ Скальп (1-15 мин)
              </button>
              <button
                type="button"
                onClick={() => updateField('timeframe', 'intraday')}
                className={`px-4 py-3 rounded-xl border font-medium transition-all ${
                  formData.timeframe === 'intraday'
                    ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                    : theme === 'dark' 
                      ? 'border-white/10 hover:border-white/20' 
                      : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                📅 Интрадей (1-4 часа)
              </button>
              <button
                type="button"
                onClick={() => updateField('timeframe', 'swing')}
                className={`px-4 py-3 rounded-xl border font-medium transition-all ${
                  formData.timeframe === 'swing'
                    ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                    : theme === 'dark' 
                      ? 'border-white/10 hover:border-white/20' 
                      : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                📆 Средний (1-7 дней)
              </button>
            </div>
          </div>

          {/* Риск на сделку */}
          <div className={`p-4 rounded-2xl border ${borderColor} ${theme === 'dark' ? 'bg-blue-900/10' : 'bg-blue-50'}`}>
            <div className="flex items-start gap-3 mb-3">
              <Target className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-400">Риск на сделку (% от депозита)</h4>
                <p className="text-xs text-gray-400 mt-1">
                  Классическое правило: рисковать не более 1-2% от всего депозита в одной сделке
                </p>
              </div>
            </div>
            <input
              type="text"
              value={formData.riskPercent}
              onChange={(e) => updateField('riskPercent', e.target.value)}
              placeholder="1% или 2%"
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
            />
            <p className="text-xs text-gray-400 mt-2">
              Пример: Депозит 1000 USDT, риск 2% = 20 USDT. Стоп-лосс должен стоять так, чтобы потерять именно 20 USDT.
            </p>
          </div>
        </div>
      </div>

      {/* === 3. УПРАВЛЕНИЕ ПОЗИЦИЕЙ === */}
      <div className="space-y-4">
        <h3 className={`text-lg font-bold ${textColor} flex items-center gap-2`}>
          <Target className="w-5 h-5 text-blue-400" />
          Управление позицией
        </h3>

        <div className="space-y-4">
          {/* Модификации */}
          <div className={`p-4 rounded-2xl border ${borderColor}`}>
            <h4 className="font-medium mb-3">Модификации</h4>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-sm font-medium mb-2">Передвигал стоп?</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => updateField('movedStopLoss', true)}
                    className={`flex-1 px-4 py-2.5 rounded-xl border font-medium transition-all ${
                      formData.movedStopLoss === true
                        ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                        : theme === 'dark' 
                          ? 'border-white/10 hover:border-white/20' 
                          : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    ✓ Да
                  </button>
                  <button
                    type="button"
                    onClick={() => updateField('movedStopLoss', false)}
                    className={`flex-1 px-4 py-2.5 rounded-xl border font-medium transition-all ${
                      formData.movedStopLoss === false
                        ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                        : theme === 'dark' 
                          ? 'border-white/10 hover:border-white/20' 
                          : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    ✗ Нет
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Доливал позицию?</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => updateField('addedToPosition', true)}
                    className={`flex-1 px-4 py-2.5 rounded-xl border font-medium transition-all ${
                      formData.addedToPosition === true
                        ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                        : theme === 'dark' 
                          ? 'border-white/10 hover:border-white/20' 
                          : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    ✓ Да
                  </button>
                  <button
                    type="button"
                    onClick={() => updateField('addedToPosition', false)}
                    className={`flex-1 px-4 py-2.5 rounded-xl border font-medium transition-all ${
                      formData.addedToPosition === false
                        ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                        : theme === 'dark' 
                          ? 'border-white/10 hover:border-white/20' 
                          : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    ✗ Нет
                  </button>
                </div>
              </div>
            </div>
            {(formData.movedStopLoss || formData.addedToPosition) && (
              <div>
                <label className="block text-sm font-medium mb-2">Детали модификаций</label>
                <textarea
                  value={formData.modificationsDetails}
                  onChange={(e) => updateField('modificationsDetails', e.target.value)}
                  placeholder="Опишите, что и почему делали..."
                  rows={2}
                  className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none`}
                />
              </div>
            )}
          </div>

          {/* Эмоции и состояние */}
          <div className={`p-4 rounded-2xl border ${borderColor}`}>
            <h4 className="font-medium mb-3">Эмоции и состояние</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-2">FOMO (Страх упустить) при входе?</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => updateField('hadFOMO', true)}
                    className={`flex-1 px-4 py-2.5 rounded-xl border font-medium transition-all ${
                      formData.hadFOMO === true
                        ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                        : theme === 'dark' 
                          ? 'border-white/10 hover:border-white/20' 
                          : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    😰 Да
                  </button>
                  <button
                    type="button"
                    onClick={() => updateField('hadFOMO', false)}
                    className={`flex-1 px-4 py-2.5 rounded-xl border font-medium transition-all ${
                      formData.hadFOMO === false
                        ? 'bg-green-500/20 border-green-500 text-green-400'
                        : theme === 'dark' 
                          ? 'border-white/10 hover:border-white/20' 
                          : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    😌 Нет
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Паника, когда цена пошла против?</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => updateField('hadPanic', true)}
                    className={`flex-1 px-4 py-2.5 rounded-xl border font-medium transition-all ${
                      formData.hadPanic === true
                        ? 'bg-red-500/20 border-red-500 text-red-400'
                        : theme === 'dark' 
                          ? 'border-white/10 hover:border-white/20' 
                          : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    😱 Да
                  </button>
                  <button
                    type="button"
                    onClick={() => updateField('hadPanic', false)}
                    className={`flex-1 px-4 py-2.5 rounded-xl border font-medium transition-all ${
                      formData.hadPanic === false
                        ? 'bg-green-500/20 border-green-500 text-green-400'
                        : theme === 'dark' 
                          ? 'border-white/10 hover:border-white/20' 
                          : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    😌 Нет
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Жадность, когда позиция в плюсе?</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => updateField('hadGreed', true)}
                    className={`flex-1 px-4 py-2.5 rounded-xl border font-medium transition-all ${
                      formData.hadGreed === true
                        ? 'bg-purple-500/20 border-purple-500 text-purple-400'
                        : theme === 'dark' 
                          ? 'border-white/10 hover:border-white/20' 
                          : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    💰 Да
                  </button>
                  <button
                    type="button"
                    onClick={() => updateField('hadGreed', false)}
                    className={`flex-1 px-4 py-2.5 rounded-xl border font-medium transition-all ${
                      formData.hadGreed === false
                        ? 'bg-green-500/20 border-green-500 text-green-400'
                        : theme === 'dark' 
                          ? 'border-white/10 hover:border-white/20' 
                          : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    😌 Нет
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Наблюдения */}
          <div>
            <label className="block text-sm font-medium mb-2">Наблюдения</label>
            <textarea
              value={formData.observations}
              onChange={(e) => updateField('observations', e.target.value)}
              placeholder="Что происходило вокруг во время сделки? Вышел ли важный отчет? Был ли резкий скачок цены?"
              rows={3}
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none`}
            />
          </div>
        </div>
      </div>

      {/* === 4. АНАЛИЗ ВЫХОДА И РЕЗУЛЬТАТОВ === */}
      <div className="space-y-4">
        <h3 className={`text-lg font-bold ${textColor} flex items-center gap-2`}>
          <TrendingUp className="w-5 h-5 text-blue-400" />
          Анализ выхода и результатов
        </h3>

        <div className="space-y-4">
          {/* Причина выхода */}
          <div>
            <label className="block text-sm font-medium mb-2">Причина выхода</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => updateField('exitReason', 'takeProfit')}
                className={`px-4 py-3 rounded-xl border font-medium transition-all ${
                  formData.exitReason === 'takeProfit'
                    ? 'bg-green-500/20 border-green-500 text-green-400'
                    : theme === 'dark' 
                      ? 'border-white/10 hover:border-white/20' 
                      : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                🎯 Сработал Тейк-профит
              </button>
              <button
                type="button"
                onClick={() => updateField('exitReason', 'stopLoss')}
                className={`px-4 py-3 rounded-xl border font-medium transition-all ${
                  formData.exitReason === 'stopLoss'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                    : theme === 'dark' 
                      ? 'border-white/10 hover:border-white/20' 
                      : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                🛑 Сработал Стоп-лосс
              </button>
              <button
                type="button"
                onClick={() => updateField('exitReason', 'liquidation')}
                className={`px-4 py-3 rounded-xl border font-medium transition-all ${
                  formData.exitReason === 'liquidation'
                    ? 'bg-red-500/20 border-red-500 text-red-400'
                    : theme === 'dark' 
                      ? 'border-white/10 hover:border-white/20' 
                      : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                💥 Ликвидация
              </button>
              <button
                type="button"
                onClick={() => updateField('exitReason', 'manual')}
                className={`px-4 py-3 rounded-xl border font-medium transition-all ${
                  formData.exitReason === 'manual'
                    ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                    : theme === 'dark' 
                      ? 'border-white/10 hover:border-white/20' 
                      : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                ✋ Ручное закрытие
              </button>
            </div>
            {formData.exitReason === 'liquidation' && (
              <p className="text-xs text-red-400 mt-2">
                ⚠️ ОШИБКА! Проанализируйте, почему не сработал стоп-лосс
              </p>
            )}
          </div>

          {/* Детали причины выхода */}
          <div>
            <label className="block text-sm font-medium mb-2">Детали выхода</label>
            <textarea
              value={formData.exitReasonDetails}
              onChange={(e) => updateField('exitReasonDetails', e.target.value)}
              placeholder="Подробнее опишите причину выхода..."
              rows={2}
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none`}
            />
          </div>

          {/* Соответствие плану */}
          <div>
            <label className="block text-sm font-medium mb-2">Следовал плану?</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => updateField('followedPlan', true)}
                className={`flex-1 px-4 py-3 rounded-xl border font-medium transition-all ${
                  formData.followedPlan === true
                    ? 'bg-green-500/20 border-green-500 text-green-400'
                    : theme === 'dark' 
                      ? 'border-white/10 hover:border-white/20' 
                      : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                ✓ Да
              </button>
              <button
                type="button"
                onClick={() => updateField('followedPlan', false)}
                className={`flex-1 px-4 py-3 rounded-xl border font-medium transition-all ${
                  formData.followedPlan === false
                    ? 'bg-red-500/20 border-red-500 text-red-400'
                    : theme === 'dark' 
                      ? 'border-white/10 hover:border-white/20' 
                      : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                ✗ Нет
              </button>
            </div>
          </div>

          {/* Причина отклонения от плана */}
          {formData.followedPlan === false && (
            <div>
              <label className="block text-sm font-medium mb-2">Почему отклонились от плана?</label>
              <textarea
                value={formData.planDeviationReason}
                onChange={(e) => updateField('planDeviationReason', e.target.value)}
                placeholder="Это золотая жила для анализа..."
                rows={2}
                className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none`}
              />
            </div>
          )}

          {/* Результат сделки */}
          <div>
            <label className="block text-sm font-medium mb-2">Результат сделки</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => updateField('tradeResult', 'profit')}
                className={`flex-1 px-4 py-3 rounded-xl border font-medium transition-all flex items-center justify-center gap-2 ${
                  formData.tradeResult === 'profit'
                    ? 'bg-green-500/20 border-green-500 text-green-400'
                    : theme === 'dark' 
                      ? 'border-white/10 hover:border-white/20' 
                      : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                Профит
              </button>
              <button
                type="button"
                onClick={() => updateField('tradeResult', 'loss')}
                className={`flex-1 px-4 py-3 rounded-xl border font-medium transition-all flex items-center justify-center gap-2 ${
                  formData.tradeResult === 'loss'
                    ? 'bg-red-500/20 border-red-500 text-red-400'
                    : theme === 'dark' 
                      ? 'border-white/10 hover:border-white/20' 
                      : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <TrendingDown className="w-4 h-4" />
                Убыток
              </button>
            </div>
          </div>

          {/* Анализ ошибок/успехов */}
          {formData.tradeResult === 'loss' && (
            <div className={`p-4 rounded-2xl border ${borderColor} ${theme === 'dark' ? 'bg-red-900/10' : 'bg-red-50'}`}>
              <h4 className="font-medium text-red-400 mb-2">Анализ ошибок</h4>
              <textarea
                value={formData.errorAnalysis}
                onChange={(e) => updateField('errorAnalysis', e.target.value)}
                placeholder="Где была ошибка? В анализе? В размере плеча? В неправильной постановке стопа? Нарушил правило?"
                rows={3}
                className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none`}
              />
            </div>
          )}

          {formData.tradeResult === 'profit' && (
            <div className={`p-4 rounded-2xl border ${borderColor} ${theme === 'dark' ? 'bg-green-900/10' : 'bg-green-50'}`}>
              <h4 className="font-medium text-green-400 mb-2">Анализ успеха</h4>
              <textarea
                value={formData.successAnalysis}
                onChange={(e) => updateField('successAnalysis', e.target.value)}
                placeholder="Это мастерство или просто повезло? Был ли риск оправдан?"
                rows={3}
                className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none`}
              />
            </div>
          )}
        </div>
      </div>

      {/* === ССЫЛКИ === */}
      <div className="space-y-4">
        <h3 className={`text-lg font-bold ${textColor} flex items-center gap-2`}>
          <ExternalLink className="w-5 h-5 text-blue-400" />
          Ссылки (или другие нужные ссылки)
        </h3>

        <div className="space-y-3">
          {[0, 1, 2].map((index) => (
            <div key={index} className="flex items-center gap-2">
              <Link2 className="w-4 h-4 text-gray-400" />
              <input
                type="url"
                value={formData.links[index] || ''}
                onChange={(e) => {
                  const links = [...formData.links]
                  links[index] = e.target.value
                  updateField('links', links)
                }}
                placeholder={`Ссылка ${index + 1}`}
                className={`flex-1 px-4 py-2.5 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* === СКРИНШОТЫ === */}
      <div className="space-y-4">
        <h3 className={`text-lg font-bold ${textColor} flex items-center gap-2`}>
          <Camera className="w-5 h-5 text-blue-400" />
          Скриншоты (до 2 штук)
        </h3>

        <div className="grid grid-cols-2 gap-4">
          {[0, 1].map((index) => (
            <div key={index}>
              {formData.screenshots[index] ? (
                <div className="relative group">
                  <img
                    src={formData.screenshots[index]}
                    alt={`Скриншот ${index + 1}`}
                    className="w-full h-40 object-cover rounded-xl border border-white/10"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newScreenshots = [...formData.screenshots]
                      newScreenshots.splice(index, 1)
                      updateField('screenshots', newScreenshots)
                    }}
                    className="absolute top-2 right-2 p-2 rounded-lg bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label
                  className={`flex flex-col items-center justify-center h-40 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
                    theme === 'dark'
                      ? 'border-white/20 hover:border-blue-500/50 bg-white/5'
                      : 'border-gray-300 hover:border-blue-500 bg-gray-50'
                  }`}
                >
                  <Camera className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-400">Скриншот {index + 1}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        if (file.size > 5 * 1024 * 1024) {
                          alert('Файл слишком большой. Максимальный размер: 5MB')
                          e.target.value = ''
                          return
                        }
                        const reader = new FileReader()
                        reader.onloadend = () => {
                          const base64 = reader.result as string
                          const newScreenshots = [...formData.screenshots]
                          const currentScreenshots = newScreenshots.filter(Boolean)
                          if (currentScreenshots.length < 2) {
                            currentScreenshots.push(base64)
                            updateField('screenshots', currentScreenshots)
                          }
                        }
                        reader.readAsDataURL(file)
                      }
                      e.target.value = ''
                    }}
                  />
                </label>
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400">
          Поддерживаются форматы: PNG, JPG, WEBP. Максимальный размер: 5MB
        </p>
      </div>

      {/* Кнопки */}
      <div className="flex gap-3 pt-4 border-t border-white/10">
        <button
          type="button"
          onClick={onClose}
          className={`flex-1 px-4 py-3 rounded-xl border ${borderColor} font-medium hover:bg-white/5 transition-colors`}
        >
          Отмена
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold hover:from-blue-400 hover:to-indigo-400 transition-all shadow-lg shadow-blue-500/25"
        >
          <Check className="w-4 h-4 inline mr-2" />
          Сохранить сделку
        </button>
      </div>
    </form>
  )
}

// ==================== ФОРМА NFT ====================
const NFTForm = ({ 
  onClose, 
  onSave 
}: { 
  onClose: () => void
  onSave: (data: NFTData) => void 
}) => {
  const { theme } = useThemeStore()
  
  const [formData, setFormData] = useState<NFTData>({
    // === 1. ИНФОРМАЦИЯ О ПРОЕКТЕ И NFT ===
    collectionName: '',
    tokenId: '',
    purchaseDateTime: new Date().toISOString().slice(0, 16),
    platform: '',
    dealType: null,
    entryPriceToken: '',
    entryPriceUSD: '',
    commissions: '',
    rarityRank: '',
    traits: '',
    // === 2. КОНТЕКСТ И ТЕЗИС ===
    ideaSource: '',
    analysisType: null,
    thesis: '',
    targetPrice: '',
    stopLoss: '',
    // === 3. УПРАВЛЕНИЕ ПОЗИЦИЕЙ И ВЫХОД ===
    saleDateTime: '',
    salePriceToken: '',
    salePriceUSD: '',
    salePlatform: '',
    finalPnLToken: '',
    finalPnLPercent: '',
    exitReason: null,
    exitReasonDetails: '',
    // === 4. МЕНТАЛЬНЫЙ И КАЧЕСТВЕННЫЙ АНАЛИЗ ===
    emotionsOnBuy: null,
    emotionsOnHold: '',
    communityInvolvement: null,
    communityDetails: '',
    smartMoney: null,
    caughtRareTrait: null,
    // === ССЫЛКИ И СКРИНШОТЫ ===
    links: ['', '', ''],
    screenshots: []
  })

  const updateField = <K extends keyof NFTData>(key: K, value: NFTData[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const borderColor = theme === 'dark' ? 'border-white/10' : 'border-gray-200'
  const bgColor = theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* === 1. ИНФОРМАЦИЯ О ПРОЕКТЕ И NFT === */}
      <div className="space-y-4">
        <h3 className={`text-lg font-bold ${textColor} flex items-center gap-2`}>
          <Image className="w-5 h-5 text-purple-400" />
          Информация о проекте и NFT
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Название коллекции */}
          <div>
            <label className="block text-sm font-medium mb-2">Название коллекции (Project)</label>
            <input
              type="text"
              value={formData.collectionName}
              onChange={(e) => updateField('collectionName', e.target.value)}
              placeholder="Bored Ape Yacht Club, Azuki, Pudgy Penguins..."
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
            />
          </div>

          {/* ID токена */}
          <div>
            <label className="block text-sm font-medium mb-2">ID токена (Token ID)</label>
            <input
              type="text"
              value={formData.tokenId}
              onChange={(e) => updateField('tokenId', e.target.value)}
              placeholder="Напр. #156"
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
            />
          </div>

          {/* Дата и время покупки/майнтинга */}
          <div>
            <label className="block text-sm font-medium mb-2">Дата и время покупки/майнтинга</label>
            <input
              type="datetime-local"
              value={formData.purchaseDateTime}
              onChange={(e) => updateField('purchaseDateTime', e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
            />
          </div>

          {/* Платформа покупки */}
          <div>
            <label className="block text-sm font-medium mb-2">Платформа покупки</label>
            <input
              type="text"
              value={formData.platform}
              onChange={(e) => updateField('platform', e.target.value)}
              placeholder="OpenSea, Blur, LooksRare, Magic Eden..."
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
            />
          </div>

          {/* Тип сделки */}
          <div>
            <label className="block text-sm font-medium mb-2">Тип сделки</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => updateField('dealType', 'mint')}
                className={`px-4 py-3 rounded-xl border font-medium transition-all ${
                  formData.dealType === 'mint'
                    ? 'bg-purple-500/20 border-purple-500 text-purple-400'
                    : theme === 'dark' 
                      ? 'border-white/10 hover:border-white/20' 
                      : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                🚀 Mint (Первичный выпуск)
              </button>
              <button
                type="button"
                onClick={() => updateField('dealType', 'flipping')}
                className={`px-4 py-3 rounded-xl border font-medium transition-all ${
                  formData.dealType === 'flipping'
                    ? 'bg-purple-500/20 border-purple-500 text-purple-400'
                    : theme === 'dark' 
                      ? 'border-white/10 hover:border-white/20' 
                      : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                🔄 Flipping (Перепродажа)
              </button>
            </div>
          </div>

          {/* Цена входа (в токене) */}
          <div>
            <label className="block text-sm font-medium mb-2">Цена входа (в токене)</label>
            <input
              type="text"
              value={formData.entryPriceToken}
              onChange={(e) => updateField('entryPriceToken', e.target.value)}
              placeholder="0.5 ETH"
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
            />
          </div>

          {/* Цена входа (в $) */}
          <div>
            <label className="block text-sm font-medium mb-2">Цена входа ($)</label>
            <input
              type="text"
              value={formData.entryPriceUSD}
              onChange={(e) => updateField('entryPriceUSD', e.target.value)}
              placeholder="$1,200"
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
            />
          </div>

          {/* Комиссии */}
          <div>
            <label className="block text-sm font-medium mb-2">Комиссии (Gas Fee + Комиссия маркетплейса)</label>
            <input
              type="text"
              value={formData.commissions}
              onChange={(e) => updateField('commissions', e.target.value)}
              placeholder="$50"
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
            />
          </div>

          {/* Редкость */}
          <div>
            <label className="block text-sm font-medium mb-2">Редкость (Rarity Rank)</label>
            <input
              type="text"
              value={formData.rarityRank}
              onChange={(e) => updateField('rarityRank', e.target.value)}
              placeholder="Rank #156 из 10000"
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
            />
          </div>

          {/* Уникальные черты */}
          <div>
            <label className="block text-sm font-medium mb-2">Уникальные черты (Traits/Attributes)</label>
            <input
              type="text"
              value={formData.traits}
              onChange={(e) => updateField('traits', e.target.value)}
              placeholder="Fur: Gold, Eyes: Laser, Hat: Captain's Cap"
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
            />
          </div>
        </div>
      </div>

      {/* === 2. КОНТЕКСТ И ТЕЗИС === */}
      <div className="space-y-4">
        <h3 className={`text-lg font-bold ${textColor} flex items-center gap-2`}>
          <Brain className="w-5 h-5 text-purple-400" />
          Контекст и Тезис
        </h3>

        <div className="space-y-4">
          {/* Источник идеи */}
          <div>
            <label className="block text-sm font-medium mb-2">Источник идеи</label>
            <textarea
              value={formData.ideaSource}
              onChange={(e) => updateField('ideaSource', e.target.value)}
              placeholder="Анализ рынка: Заметил, что золотые NFT из этой коллекции продаются быстро... Новости проекта: Анонс токена, метавселенной... Дискорд/Твиттер: Инсайд от сообщества..."
              rows={2}
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none`}
            />
          </div>

          {/* Тип анализа */}
          <div>
            <label className="block text-sm font-medium mb-2">Тип анализа</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => updateField('analysisType', 'floor')}
                className={`px-4 py-3 rounded-xl border font-medium transition-all ${
                  formData.analysisType === 'floor'
                    ? 'bg-purple-500/20 border-purple-500 text-purple-400'
                    : theme === 'dark' 
                      ? 'border-white/10 hover:border-white/20' 
                      : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                📊 Floor Price (флор)
              </button>
              <button
                type="button"
                onClick={() => updateField('analysisType', 'rarity')}
                className={`px-4 py-3 rounded-xl border font-medium transition-all ${
                  formData.analysisType === 'rarity'
                    ? 'bg-purple-500/20 border-purple-500 text-purple-400'
                    : theme === 'dark' 
                      ? 'border-white/10 hover:border-white/20' 
                      : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                💎 Rarity (редкость)
              </button>
              <button
                type="button"
                onClick={() => updateField('analysisType', 'trait')}
                className={`px-4 py-3 rounded-xl border font-medium transition-all ${
                  formData.analysisType === 'trait'
                    ? 'bg-purple-500/20 border-purple-500 text-purple-400'
                    : theme === 'dark' 
                      ? 'border-white/10 hover:border-white/20' 
                      : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                🎯 Черты (traits)
              </button>
            </div>
          </div>

          {/* Тезис */}
          <div>
            <label className="block text-sm font-medium mb-2">Тезис (Кратко)</label>
            <textarea
              value={formData.thesis}
              onChange={(e) => updateField('thesis', e.target.value)}
              placeholder="Проект анонсировал стейкинг на следующей неделе. Флор подрастет, а NFT с редким фоном (Gold) будут в топе. Покупаю этого 'Lion' с золотым фоном по 0.5 ETH..."
              rows={3}
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none`}
            />
          </div>

          {/* План сделки */}
          <div className={`p-4 rounded-2xl border ${borderColor} ${theme === 'dark' ? 'bg-purple-900/10' : 'bg-purple-50'}`}>
            <h4 className="font-medium text-purple-400 mb-3">План сделки</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Целевая цена (Тейк-профит)</label>
                <input
                  type="text"
                  value={formData.targetPrice}
                  onChange={(e) => updateField('targetPrice', e.target.value)}
                  placeholder="0.8 ETH"
                  className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Стоп-лосс (Цена бегства)</label>
                <input
                  type="text"
                  value={formData.stopLoss}
                  onChange={(e) => updateField('stopLoss', e.target.value)}
                  placeholder="0.35 ETH или -30% флора"
                  className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* === 3. УПРАВЛЕНИЕ ПОЗИЦИЕЙ И ВЫХОД === */}
      <div className="space-y-4">
        <h3 className={`text-lg font-bold ${textColor} flex items-center gap-2`}>
          <TrendingUp className="w-5 h-5 text-purple-400" />
          Управление позицией и Выход
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Дата и время продажи */}
          <div>
            <label className="block text-sm font-medium mb-2">Дата и время продажи</label>
            <input
              type="datetime-local"
              value={formData.saleDateTime}
              onChange={(e) => updateField('saleDateTime', e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
            />
          </div>

          {/* Платформа продажи */}
          <div>
            <label className="block text-sm font-medium mb-2">Платформа продажи</label>
            <input
              type="text"
              value={formData.salePlatform}
              onChange={(e) => updateField('salePlatform', e.target.value)}
              placeholder="OpenSea, Blur..."
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
            />
          </div>

          {/* Цена выхода (в токене) */}
          <div>
            <label className="block text-sm font-medium mb-2">Цена выхода (в токене)</label>
            <input
              type="text"
              value={formData.salePriceToken}
              onChange={(e) => updateField('salePriceToken', e.target.value)}
              placeholder="0.8 ETH"
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
            />
          </div>

          {/* Цена выхода (в $) */}
          <div>
            <label className="block text-sm font-medium mb-2">Цена выхода ($)</label>
            <input
              type="text"
              value={formData.salePriceUSD}
              onChange={(e) => updateField('salePriceUSD', e.target.value)}
              placeholder="$1,920"
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
            />
          </div>

          {/* Итоговый P&L */}
          <div>
            <label className="block text-sm font-medium mb-2">Итоговый P&L (в токене)</label>
            <input
              type="text"
              value={formData.finalPnLToken}
              onChange={(e) => updateField('finalPnLToken', e.target.value)}
              placeholder="+0.3 ETH"
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
            />
          </div>

          {/* P&L в % */}
          <div>
            <label className="block text-sm font-medium mb-2">Итоговый P&L (%)</label>
            <input
              type="text"
              value={formData.finalPnLPercent}
              onChange={(e) => updateField('finalPnLPercent', e.target.value)}
              placeholder="+60%"
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
            />
          </div>
        </div>

        {/* Причина выхода */}
        <div>
          <label className="block text-sm font-medium mb-2">Причина выхода</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => updateField('exitReason', 'takeProfit')}
              className={`px-4 py-3 rounded-xl border font-medium transition-all ${
                formData.exitReason === 'takeProfit'
                  ? 'bg-green-500/20 border-green-500 text-green-400'
                  : theme === 'dark' 
                    ? 'border-white/10 hover:border-white/20' 
                    : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              🎯 Достиг цели (TP)
            </button>
            <button
              type="button"
              onClick={() => updateField('exitReason', 'stopLoss')}
              className={`px-4 py-3 rounded-xl border font-medium transition-all ${
                formData.exitReason === 'stopLoss'
                  ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                  : theme === 'dark' 
                    ? 'border-white/10 hover:border-white/20' 
                    : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              🛑 Сработал стоп
            </button>
            <button
              type="button"
              onClick={() => updateField('exitReason', 'manual')}
              className={`px-4 py-3 rounded-xl border font-medium transition-all ${
                formData.exitReason === 'manual'
                  ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                  : theme === 'dark' 
                    ? 'border-white/10 hover:border-white/20' 
                    : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              ✋ Продал вручную
            </button>
            <button
              type="button"
              onClick={() => updateField('exitReason', 'thesisChange')}
              className={`px-4 py-3 rounded-xl border font-medium transition-all ${
                formData.exitReason === 'thesisChange'
                  ? 'bg-purple-500/20 border-purple-500 text-purple-400'
                  : theme === 'dark' 
                    ? 'border-white/10 hover:border-white/20' 
                    : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              🔄 Смена тезиса
            </button>
            <button
              type="button"
              onClick={() => updateField('exitReason', 'liquidityNeed')}
              className={`px-4 py-3 rounded-xl border font-medium transition-all ${
                formData.exitReason === 'liquidityNeed'
                  ? 'bg-orange-500/20 border-orange-500 text-orange-400'
                  : theme === 'dark' 
                    ? 'border-white/10 hover:border-white/20' 
                    : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              💸 Нужна ликвидность
            </button>
            <button
              type="button"
              onClick={() => updateField('exitReason', 'emotions')}
              className={`px-4 py-3 rounded-xl border font-medium transition-all ${
                formData.exitReason === 'emotions'
                  ? 'bg-red-500/20 border-red-500 text-red-400'
                  : theme === 'dark' 
                    ? 'border-white/10 hover:border-white/20' 
                    : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              😰 Эмоции
            </button>
          </div>
        </div>

        {/* Детали выхода */}
        <div>
          <label className="block text-sm font-medium mb-2">Детали выхода</label>
          <textarea
            value={formData.exitReasonDetails}
            onChange={(e) => updateField('exitReasonDetails', e.target.value)}
            placeholder="Подробнее опишите причину выхода..."
            rows={2}
            className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none`}
          />
        </div>
      </div>

      {/* === 4. МЕНТАЛЬНЫЙ И КАЧЕСТВЕННЫЙ АНАЛИЗ === */}
      <div className="space-y-4">
        <h3 className={`text-lg font-bold ${textColor} flex items-center gap-2`}>
          <Brain className="w-5 h-5 text-purple-400" />
          Ментальный и Качественный анализ
        </h3>

        <div className="space-y-4">
          {/* Эмоции при покупке */}
          <div>
            <label className="block text-sm font-medium mb-2">Эмоции при покупке</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => updateField('emotionsOnBuy', 'fomo')}
                className={`px-4 py-3 rounded-xl border font-medium transition-all ${
                  formData.emotionsOnBuy === 'fomo'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                    : theme === 'dark' 
                      ? 'border-white/10 hover:border-white/20' 
                      : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                😰 FOMO
              </button>
              <button
                type="button"
                onClick={() => updateField('emotionsOnBuy', 'calculation')}
                className={`px-4 py-3 rounded-xl border font-medium transition-all ${
                  formData.emotionsOnBuy === 'calculation'
                    ? 'bg-green-500/20 border-green-500 text-green-400'
                    : theme === 'dark' 
                      ? 'border-white/10 hover:border-white/20' 
                      : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                🧠 Расчет
              </button>
              <button
                type="button"
                onClick={() => updateField('emotionsOnBuy', 'hunt')}
                className={`px-4 py-3 rounded-xl border font-medium transition-all ${
                  formData.emotionsOnBuy === 'hunt'
                    ? 'bg-purple-500/20 border-purple-500 text-purple-400'
                    : theme === 'dark' 
                      ? 'border-white/10 hover:border-white/20' 
                      : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                🎯 Охота за редкостью
              </button>
            </div>
          </div>

          {/* Эмоции при удержании */}
          <div>
            <label className="block text-sm font-medium mb-2">Эмоции при удержании</label>
            <textarea
              value={formData.emotionsOnHold}
              onChange={(e) => updateField('emotionsOnHold', e.target.value)}
              placeholder="Страх, когда рынок падает; радость, когда твой NFT лайкают в твиттере; жадность, когда видишь рост..."
              rows={2}
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none`}
            />
          </div>

          {/* Работа с сообществом */}
          <div className={`p-4 rounded-2xl border ${borderColor}`}>
            <h4 className="font-medium mb-3">Работа с сообществом</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-2">Участвовали в Discord/Twitter проекта?</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => updateField('communityInvolvement', true)}
                    className={`flex-1 px-4 py-2.5 rounded-xl border font-medium transition-all ${
                      formData.communityInvolvement === true
                        ? 'bg-purple-500/20 border-purple-500 text-purple-400'
                        : theme === 'dark' 
                          ? 'border-white/10 hover:border-white/20' 
                          : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    ✓ Да
                  </button>
                  <button
                    type="button"
                    onClick={() => updateField('communityInvolvement', false)}
                    className={`flex-1 px-4 py-2.5 rounded-xl border font-medium transition-all ${
                      formData.communityInvolvement === false
                        ? 'bg-purple-500/20 border-purple-500 text-purple-400'
                        : theme === 'dark' 
                          ? 'border-white/10 hover:border-white/20' 
                          : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    ✗ Нет
                  </button>
                </div>
              </div>
              {formData.communityInvolvement && (
                <div>
                  <label className="block text-sm font-medium mb-2">Как это помогло в принятии решения?</label>
                  <textarea
                    value={formData.communityDetails}
                    onChange={(e) => updateField('communityDetails', e.target.value)}
                    placeholder="Получил инсайд от крупного держателя, узнал о будущем анонсе..."
                    rows={2}
                    className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none`}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Оценка качества сделки */}
          <div className={`p-4 rounded-2xl border ${borderColor}`}>
            <h4 className="font-medium mb-3">Оценка качества сделки</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-2">Это было "умными деньгами"?</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => updateField('smartMoney', true)}
                    className={`flex-1 px-4 py-2.5 rounded-xl border font-medium transition-all ${
                      formData.smartMoney === true
                        ? 'bg-green-500/20 border-green-500 text-green-400'
                        : theme === 'dark' 
                          ? 'border-white/10 hover:border-white/20' 
                          : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    ✓ Да
                  </button>
                  <button
                    type="button"
                    onClick={() => updateField('smartMoney', false)}
                    className={`flex-1 px-4 py-2.5 rounded-xl border font-medium transition-all ${
                      formData.smartMoney === false
                        ? 'bg-red-500/20 border-red-500 text-red-400'
                        : theme === 'dark' 
                          ? 'border-white/10 hover:border-white/20' 
                          : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    ✗ Нет
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Удалось "поймать" редкую черту?</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => updateField('caughtRareTrait', true)}
                    className={`flex-1 px-4 py-2.5 rounded-xl border font-medium transition-all ${
                      formData.caughtRareTrait === true
                        ? 'bg-green-500/20 border-green-500 text-green-400'
                        : theme === 'dark' 
                          ? 'border-white/10 hover:border-white/20' 
                          : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    ✓ Да
                  </button>
                  <button
                    type="button"
                    onClick={() => updateField('caughtRareTrait', false)}
                    className={`flex-1 px-4 py-2.5 rounded-xl border font-medium transition-all ${
                      formData.caughtRareTrait === false
                        ? 'bg-red-500/20 border-red-500 text-red-400'
                        : theme === 'dark' 
                          ? 'border-white/10 hover:border-white/20' 
                          : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    ✗ Нет
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* === ССЫЛКИ === */}
      <div className="space-y-4">
        <h3 className={`text-lg font-bold ${textColor} flex items-center gap-2`}>
          <ExternalLink className="w-5 h-5 text-purple-400" />
          Ссылки (или другие нужные ссылки)
        </h3>

        <div className="space-y-3">
          {[0, 1, 2].map((index) => (
            <div key={index} className="flex items-center gap-2">
              <Link2 className="w-4 h-4 text-gray-400" />
              <input
                type="url"
                value={formData.links[index] || ''}
                onChange={(e) => {
                  const links = [...formData.links]
                  links[index] = e.target.value
                  updateField('links', links)
                }}
                placeholder={`Ссылка ${index + 1}`}
                className={`flex-1 px-4 py-2.5 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* === СКРИНШОТЫ === */}
      <div className="space-y-4">
        <h3 className={`text-lg font-bold ${textColor} flex items-center gap-2`}>
          <Camera className="w-5 h-5 text-purple-400" />
          Скриншоты (до 2 штук)
        </h3>

        <div className="grid grid-cols-2 gap-4">
          {[0, 1].map((index) => (
            <div key={index}>
              {formData.screenshots[index] ? (
                <div className="relative group">
                  <img
                    src={formData.screenshots[index]}
                    alt={`Скриншот ${index + 1}`}
                    className="w-full h-40 object-cover rounded-xl border border-white/10"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newScreenshots = [...formData.screenshots]
                      newScreenshots.splice(index, 1)
                      updateField('screenshots', newScreenshots)
                    }}
                    className="absolute top-2 right-2 p-2 rounded-lg bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label
                  className={`flex flex-col items-center justify-center h-40 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
                    theme === 'dark'
                      ? 'border-white/20 hover:border-purple-500/50 bg-white/5'
                      : 'border-gray-300 hover:border-purple-500 bg-gray-50'
                  }`}
                >
                  <Camera className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-400">Скриншот {index + 1}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        if (file.size > 5 * 1024 * 1024) {
                          alert('Файл слишком большой. Максимальный размер: 5MB')
                          e.target.value = ''
                          return
                        }
                        const reader = new FileReader()
                        reader.onloadend = () => {
                          const base64 = reader.result as string
                          const newScreenshots = [...formData.screenshots]
                          const currentScreenshots = newScreenshots.filter(Boolean)
                          if (currentScreenshots.length < 2) {
                            currentScreenshots.push(base64)
                            updateField('screenshots', currentScreenshots)
                          }
                        }
                        reader.readAsDataURL(file)
                      }
                      e.target.value = ''
                    }}
                  />
                </label>
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400">
          Поддерживаются форматы: PNG, JPG, WEBP. Максимальный размер: 5MB
        </p>
      </div>

      {/* Кнопки */}
      <div className="flex gap-3 pt-4 border-t border-white/10">
        <button
          type="button"
          onClick={onClose}
          className={`flex-1 px-4 py-3 rounded-xl border ${borderColor} font-medium hover:bg-white/5 transition-colors`}
        >
          Отмена
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold hover:from-purple-400 hover:to-pink-400 transition-all shadow-lg shadow-purple-500/25"
        >
          <Check className="w-4 h-4 inline mr-2" />
          Сохранить сделку
        </button>
      </div>
    </form>
  )
}

// ==================== ФОРМА MEM-DEVING ====================
const MemDevingForm = ({ 
  onClose, 
  onSave 
}: { 
  onClose: () => void
  onSave: (data: MemDevingData) => void 
}) => {
  const { theme } = useThemeStore()
  
  const [formData, setFormData] = useState<MemDevingData>({
    tokenName: '',
    ticker: '',
    tokenLogo: '',
    contractAddress: '',
    blockchain: '',
    launchDateTime: new Date().toISOString().slice(0, 16),
    launchPlatform: '',
    totalSupply: '',
    initialLiquidity: '',
    teamTokensLocked: null,
    websiteUrl: '',
    twitterUrl: '',
    telegramUrl: '',
    tiktokUrl: '',
    redditUrl: '',
    narrative: '',
    targetAudience: '',
    marketingChannels: '',
    kolPlanned: null,
    kolDetails: '',
    marketingBudget: '',
    exitStrategyType: null,
    exitStrategyDetails: '',
    firstPostTime: '',
    contentCreated: '',
    raidsDone: '',
    contestsHeld: '',
    communitySize: '',
    communityActivity: '',
    listingsSubmitted: '',
    adSpend: '',
    kolPaid: '',
    kolCoverage: '',
    totalRevenue: '',
    totalExpenses: '',
    gasExpenses: '',
    platformFees: '',
    kolExpenses: '',
    designerExpenses: '',
    otherExpenses: '',
    netProfit: '',
    athMcapt: '',
    currentMcapt: '',
    peakHolders: '',
    peakVolume: '',
    whatWorked: '',
    bestNarrative: '',
    bestKol: '',
    buybackDetails: '',
    whatFailed: '',
    technicalBug: null,
    competitionMissed: null,
    links: [],
    screenshots: []
  })
  
  const [detectingToken, setDetectingToken] = useState(false)
  const [copied, setCopied] = useState(false)

  // Автоматическое определение токена через DexScreener
  useEffect(() => {
    const address = formData.contractAddress
    if (!address || address.length < 10) return

    const timer = setTimeout(async () => {
      setDetectingToken(true)
      try {
        const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${address}`)
        if (response.ok) {
          const data = await response.json()
          if (data.pairs && data.pairs.length > 0) {
            const pair = data.pairs[0]
            setFormData(prev => ({
              ...prev,
              tokenName: pair.baseToken?.name || prev.tokenName,
              ticker: pair.baseToken?.symbol || prev.ticker,
              tokenLogo: pair.info?.imageUrl || '',
              blockchain: pair.chainId || ''
            }))
          }
        }
      } catch (e) {
        console.error('Error fetching token:', e)
      } finally {
        setDetectingToken(false)
      }
    }, 800)

    return () => clearTimeout(timer)
  }, [formData.contractAddress])

  // Автовставка из буфера обмена
  useEffect(() => {
    const checkClipboard = async () => {
      try {
        const text = await navigator.clipboard.readText()
        if (text && (text.startsWith('0x') || text.length >= 32)) {
          setFormData(prev => ({ ...prev, contractAddress: text.trim() }))
        }
      } catch (e) {
        // Ignore clipboard errors
      }
    }
    checkClipboard()
  }, [])

  const updateField = <K extends keyof MemDevingData>(key: K, value: MemDevingData[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const borderColor = theme === 'dark' ? 'border-white/10' : 'border-gray-200'
  const bgColor = theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. ПАСПОРТ ТОКЕНА */}
      <div className="space-y-4">
        <h3 className={`text-lg font-bold ${textColor} flex items-center gap-2`}>
          <Target className="w-5 h-5 text-purple-400" />
          1. Паспорт токена (Технические параметры)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Название токена */}
          <div>
            <label className="block text-sm font-medium mb-2">Название токена</label>
            <input
              type="text"
              value={formData.tokenName}
              onChange={(e) => updateField('tokenName', e.target.value)}
              placeholder="Pepa the King"
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
            />
          </div>
          
          {/* Тикер */}
          <div>
            <label className="block text-sm font-medium mb-2">Тикер</label>
            <input
              type="text"
              value={formData.ticker}
              onChange={(e) => updateField('ticker', e.target.value)}
              placeholder="$PEK"
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
            />
          </div>

          {/* Адрес контракта */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">
              Адрес контракта
              {detectingToken && <Loader2 className="w-4 h-4 animate-spin inline ml-2 text-purple-400" />}
            </label>
            <div className="relative">
              <div className="flex items-center gap-2">
                {formData.tokenLogo && (
                  <img 
                    src={formData.tokenLogo} 
                    alt="" 
                    className="w-10 h-10 rounded-lg object-cover border border-white/10"
                  />
                )}
                <input
                  type="text"
                  value={formData.contractAddress}
                  onChange={(e) => updateField('contractAddress', e.target.value)}
                  placeholder="0x... (автоопределится лого и сеть)"
                  className={`flex-1 px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
                />
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(formData.contractAddress)
                    setCopied(true)
                    setTimeout(() => setCopied(false), 2000)
                  }}
                  className={`p-3 rounded-xl border ${borderColor} hover:bg-white/5`}
                >
                  {copied ? <Check className="w-4 h-4 text-purple-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Блокчейн */}
          <div>
            <label className="block text-sm font-medium mb-2">Блокчейн</label>
            <input
              type="text"
              value={formData.blockchain}
              onChange={(e) => updateField('blockchain', e.target.value)}
              placeholder="solana, ethereum, base..."
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
            />
          </div>

          {/* Дата и время запуска */}
          <div>
            <label className="block text-sm font-medium mb-2">Дата и время запуска (Mint)</label>
            <input
              type="datetime-local"
              value={formData.launchDateTime}
              onChange={(e) => updateField('launchDateTime', e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
            />
          </div>

          {/* Платформа запуска */}
          <div>
            <label className="block text-sm font-medium mb-2">Платформа запуска</label>
            <input
              type="text"
              value={formData.launchPlatform}
              onChange={(e) => updateField('launchPlatform', e.target.value)}
              placeholder="Pump.fun, Moonshot, SunPump..."
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
            />
          </div>

          {/* Общее предложение */}
          <div>
            <label className="block text-sm font-medium mb-2">Общее предложение (Total Supply)</label>
            <input
              type="text"
              value={formData.totalSupply}
              onChange={(e) => updateField('totalSupply', e.target.value)}
              placeholder="1,000,000,000"
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
            />
          </div>

          {/* Начальная ликвидность */}
          <div>
            <label className="block text-sm font-medium mb-2">Начальная ликвидность</label>
            <input
              type="text"
              value={formData.initialLiquidity}
              onChange={(e) => updateField('initialLiquidity', e.target.value)}
              placeholder="$2,000"
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
            />
          </div>

          {/* Заморожены ли токены команды */}
          <div>
            <label className="block text-sm font-medium mb-2">Токены команды заморожены?</label>
            <ToggleGroup
              value={formData.teamTokensLocked}
              onChange={(v) => updateField('teamTokensLocked', v)}
              options={[
                { value: true, label: '✓ Да' },
                { value: false, label: '✗ Нет' }
              ]}
            />
          </div>
        </div>

        {/* Ссылки */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Сайт</label>
            <input
              type="url"
              value={formData.websiteUrl}
              onChange={(e) => updateField('websiteUrl', e.target.value)}
              placeholder="https://..."
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Twitter (X)</label>
            <input
              type="url"
              value={formData.twitterUrl}
              onChange={(e) => updateField('twitterUrl', e.target.value)}
              placeholder="https://x.com/..."
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Telegram</label>
            <input
              type="url"
              value={formData.telegramUrl}
              onChange={(e) => updateField('telegramUrl', e.target.value)}
              placeholder="https://t.me/..."
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">TikTok</label>
            <input
              type="url"
              value={formData.tiktokUrl}
              onChange={(e) => updateField('tiktokUrl', e.target.value)}
              placeholder="https://tiktok.com/..."
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
            />
          </div>
        </div>
      </div>

      {/* 2. КОНЦЕПЦИЯ И ТЕЗИС */}
      <div className="space-y-4">
        <h3 className={`text-lg font-bold ${textColor} flex items-center gap-2`}>
          <Brain className="w-5 h-5 text-purple-400" />
          2. Концепция и Тезис (Почему этот мем?)
        </h3>
        
        <div className="space-y-4">
          {/* Нарратив */}
          <div>
            <label className="block text-sm font-medium mb-2">Нарратив (История мема)</label>
            <textarea
              value={formData.narrative}
              onChange={(e) => updateField('narrative', e.target.value)}
              placeholder="Это ленивая капибара, которая любит пиво. Мем должен залететь в крипто-твиттер из-за связи с пивным сезоном..."
              rows={3}
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none`}
            />
          </div>

          {/* Целевая аудитория */}
          <div>
            <label className="block text-sm font-medium mb-2">Целевая аудитория</label>
            <input
              type="text"
              value={formData.targetAudience}
              onChange={(e) => updateField('targetAudience', e.target.value)}
              placeholder="Русскоязычное комьюнити, англоязычные дегены, фанаты конкретного KOL..."
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
            />
          </div>

          {/* Маркетинговый план до запуска */}
          <div className={`p-4 rounded-2xl border ${borderColor} ${theme === 'dark' ? 'bg-purple-900/10' : 'bg-purple-50'}`}>
            <h4 className="font-medium text-purple-400 mb-3">Маркетинговый план (до запуска)</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-2">Каналы продвижения</label>
                <input
                  type="text"
                  value={formData.marketingChannels}
                  onChange={(e) => updateField('marketingChannels', e.target.value)}
                  placeholder="Twitter, Telegram, TikTok, 4chan..."
                  className={`w-full px-4 py-2.5 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Планируется ли платить KOL?</label>
                <ToggleGroup
                  value={formData.kolPlanned}
                  onChange={(v) => updateField('kolPlanned', v)}
                  options={[
                    { value: true, label: '✓ Да' },
                    { value: false, label: '✗ Нет' }
                  ]}
                />
              </div>
              {formData.kolPlanned && (
                <div>
                  <label className="block text-sm font-medium mb-2">Какие KOL и условия?</label>
                  <input
                    type="text"
                    value={formData.kolDetails}
                    onChange={(e) => updateField('kolDetails', e.target.value)}
                    placeholder="@kol1 - $500, @kol2 - бартер..."
                    className={`w-full px-4 py-2.5 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-2">Бюджет на маркетинг</label>
                <input
                  type="text"
                  value={formData.marketingBudget}
                  onChange={(e) => updateField('marketingBudget', e.target.value)}
                  placeholder="$1,000"
                  className={`w-full px-4 py-2.5 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
                />
              </div>
            </div>
          </div>

          {/* Стратегия выхода */}
          <div>
            <label className="block text-sm font-medium mb-2">Стратегия выхода</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => updateField('exitStrategyType', 'rugpull')}
                className={`px-4 py-3 rounded-xl border font-medium transition-all ${
                  formData.exitStrategyType === 'rugpull'
                    ? 'bg-red-500/20 border-red-500 text-red-400'
                    : theme === 'dark' 
                      ? 'border-white/10 hover:border-white/20' 
                      : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                💸 Рагпул
              </button>
              <button
                type="button"
                onClick={() => updateField('exitStrategyType', 'partial')}
                className={`px-4 py-3 rounded-xl border font-medium transition-all ${
                  formData.exitStrategyType === 'partial'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                    : theme === 'dark' 
                      ? 'border-white/10 hover:border-white/20' 
                      : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                📊 Частичный выход
              </button>
              <button
                type="button"
                onClick={() => updateField('exitStrategyType', 'hold')}
                className={`px-4 py-3 rounded-xl border font-medium transition-all ${
                  formData.exitStrategyType === 'hold'
                    ? 'bg-green-500/20 border-green-500 text-green-400'
                    : theme === 'dark' 
                      ? 'border-white/10 hover:border-white/20' 
                      : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                🚀 Холд (лунная сумка)
              </button>
            </div>
          </div>
          {formData.exitStrategyType && (
            <div>
              <label className="block text-sm font-medium mb-2">Детали стратегии выхода</label>
              <textarea
                value={formData.exitStrategyDetails}
                onChange={(e) => updateField('exitStrategyDetails', e.target.value)}
                placeholder="Продать 20% при MCAP $50К, еще 30% при $150К, оставить 50% навсегда..."
                rows={2}
                className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none`}
              />
            </div>
          )}
        </div>
      </div>

      {/* 3. ЖУРНАЛ ЗАПУСКА И МАРКЕТИНГА */}
      <div className="space-y-4">
        <h3 className={`text-lg font-bold ${textColor} flex items-center gap-2`}>
          <FileText className="w-5 h-5 text-purple-400" />
          3. Журнал запуска и маркетинга (Действия)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Время первого поста</label>
            <input
              type="datetime-local"
              value={formData.firstPostTime}
              onChange={(e) => updateField('firstPostTime', e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Размер сообщества (соцсети)</label>
            <input
              type="text"
              value={formData.communitySize}
              onChange={(e) => updateField('communitySize', e.target.value)}
              placeholder="TG: 500, X: 200..."
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Контент создан</label>
            <input
              type="text"
              value={formData.contentCreated}
              onChange={(e) => updateField('contentCreated', e.target.value)}
              placeholder="5 мемов, 2 видео..."
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Рейды проведены</label>
            <input
              type="text"
              value={formData.raidsDone}
              onChange={(e) => updateField('raidsDone', e.target.value)}
              placeholder="Под 10 постами..."
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Конкурсы/Эйрдропы</label>
            <input
              type="text"
              value={formData.contestsHeld}
              onChange={(e) => updateField('contestsHeld', e.target.value)}
              placeholder="1 конкурс репостов..."
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Активность сообщества</label>
            <input
              type="text"
              value={formData.communityActivity}
              onChange={(e) => updateField('communityActivity', e.target.value)}
              placeholder="Высокая/Средняя/Низкая"
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Листинги (заявки поданы)</label>
            <input
              type="text"
              value={formData.listingsSubmitted}
              onChange={(e) => updateField('listingsSubmitted', e.target.value)}
              placeholder="CoinGecko, CMC..."
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Рекламный бюджет (KOL)</label>
            <input
              type="text"
              value={formData.kolPaid}
              onChange={(e) => updateField('kolPaid', e.target.value)}
              placeholder="$500"
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Охват KOL</label>
            <input
              type="text"
              value={formData.kolCoverage}
              onChange={(e) => updateField('kolCoverage', e.target.value)}
              placeholder="50,000 просмотров"
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
            />
          </div>
        </div>
      </div>

      {/* 4. АНАЛИЗ ЭФФЕКТИВНОСТИ И ФИНАНСОВЫЙ РЕЗУЛЬТАТ */}
      <div className="space-y-4">
        <h3 className={`text-lg font-bold ${textColor} flex items-center gap-2`}>
          <DollarSign className="w-5 h-5 text-purple-400" />
          4. Анализ эффективности и Финансовый результат
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Общий доход</label>
            <input
              type="text"
              value={formData.totalRevenue}
              onChange={(e) => updateField('totalRevenue', e.target.value)}
              placeholder="$5,000"
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Общие расходы</label>
            <input
              type="text"
              value={formData.totalExpenses}
              onChange={(e) => updateField('totalExpenses', e.target.value)}
              placeholder="$800"
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Расходы на Gas</label>
            <input
              type="text"
              value={formData.gasExpenses}
              onChange={(e) => updateField('gasExpenses', e.target.value)}
              placeholder="$50"
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Комиссии платформы</label>
            <input
              type="text"
              value={formData.platformFees}
              onChange={(e) => updateField('platformFees', e.target.value)}
              placeholder="$200"
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Расходы на KOL</label>
            <input
              type="text"
              value={formData.kolExpenses}
              onChange={(e) => updateField('kolExpenses', e.target.value)}
              placeholder="$500"
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Расходы на дизайнеров</label>
            <input
              type="text"
              value={formData.designerExpenses}
              onChange={(e) => updateField('designerExpenses', e.target.value)}
              placeholder="$50"
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Прочие расходы</label>
            <input
              type="text"
              value={formData.otherExpenses}
              onChange={(e) => updateField('otherExpenses', e.target.value)}
              placeholder="$..."
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-green-400">Чистая прибыль</label>
            <input
              type="text"
              value={formData.netProfit}
              onChange={(e) => updateField('netProfit', e.target.value)}
              placeholder="$4,200"
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-green-500/50`}
            />
          </div>
        </div>
      </div>

      {/* 5. МЕТРИКИ ТОКЕНА */}
      <div className="space-y-4">
        <h3 className={`text-lg font-bold ${textColor} flex items-center gap-2`}>
          <BarChart3 className="w-5 h-5 text-purple-400" />
          5. Метрики токена
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Максимальная капитализация (ATH MCAP)</label>
            <input
              type="text"
              value={formData.athMcapt}
              onChange={(e) => updateField('athMcapt', e.target.value)}
              placeholder="$250,000"
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Текущая капитализация</label>
            <input
              type="text"
              value={formData.currentMcapt}
              onChange={(e) => updateField('currentMcapt', e.target.value)}
              placeholder="$10,000 (если не рагпулили)"
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Пиковое кол-во холдеров</label>
            <input
              type="text"
              value={formData.peakHolders}
              onChange={(e) => updateField('peakHolders', e.target.value)}
              placeholder="1,200"
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Пиковый объём торгов</label>
            <input
              type="text"
              value={formData.peakVolume}
              onChange={(e) => updateField('peakVolume', e.target.value)}
              placeholder="$500,000"
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
            />
          </div>
        </div>
      </div>

      {/* 6. АНАЛИЗ ЧТО СРАБОТАЛО */}
      <div className="space-y-4">
        <h3 className={`text-lg font-bold ${textColor} flex items-center gap-2`}>
          <TrendingUp className="w-5 h-5 text-purple-400" />
          6. Анализ что сработало и ошибки
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Что сработало?</label>
            <textarea
              value={formData.whatWorked}
              onChange={(e) => updateField('whatWorked', e.target.value)}
              placeholder="Опишите что помогло успеху..."
              rows={2}
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none`}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Лучший нарратив</label>
              <input
                type="text"
                value={formData.bestNarrative}
                onChange={(e) => updateField('bestNarrative', e.target.value)}
                placeholder="Какой нарратив зашел лучше..."
                className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Лучший KOL</label>
              <input
                type="text"
                value={formData.bestKol}
                onChange={(e) => updateField('bestKol', e.target.value)}
                placeholder="KOL который принес покупателей..."
                className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Схема откупа (Buyback)</label>
            <textarea
              value={formData.buybackDetails}
              onChange={(e) => updateField('buybackDetails', e.target.value)}
              placeholder="Сколько потратили на откуп, чтобы создать объем..."
              rows={2}
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none`}
            />
          </div>
          
          {/* Анализ ошибок */}
          <div className={`p-4 rounded-2xl border ${borderColor} ${theme === 'dark' ? 'bg-red-900/10' : 'bg-red-50'}`}>
            <h4 className="font-medium text-red-400 mb-3">Анализ ошибок</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-2">Что не сработало?</label>
                <textarea
                  value={formData.whatFailed}
                  onChange={(e) => updateField('whatFailed', e.target.value)}
                  placeholder="Почему схлопнулся хайп..."
                  rows={2}
                  className={`w-full px-4 py-2.5 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-red-500/50 resize-none`}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Был тех. баг?</label>
                  <ToggleGroup
                    value={formData.technicalBug}
                    onChange={(v) => updateField('technicalBug', v)}
                    options={[
                      { value: true, label: '✓ Да' },
                      { value: false, label: '✗ Нет' }
                    ]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Недооценили конкуренцию?</label>
                  <ToggleGroup
                    value={formData.competitionMissed}
                    onChange={(v) => updateField('competitionMissed', v)}
                    options={[
                      { value: true, label: '✓ Да' },
                      { value: false, label: '✗ Нет' }
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ССЫЛКИ */}
      <div className="space-y-4">
        <h3 className={`text-lg font-bold ${textColor} flex items-center gap-2`}>
          <ExternalLink className="w-5 h-5 text-purple-400" />
          Ссылки
        </h3>

        <div className="space-y-3">
          {[0, 1, 2].map((index) => (
            <div key={index} className="flex items-center gap-2">
              <Link2 className="w-4 h-4 text-gray-400" />
              <input
                type="url"
                value={formData.links[index] || ''}
                onChange={(e) => {
                  const links = [...formData.links]
                  links[index] = e.target.value
                  updateField('links', links)
                }}
                placeholder={`Ссылка ${index + 1}`}
                className={`flex-1 px-4 py-2.5 rounded-xl border ${borderColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* СКРИНШОТЫ */}
      <div className="space-y-4">
        <h3 className={`text-lg font-bold ${textColor} flex items-center gap-2`}>
          <Camera className="w-5 h-5 text-purple-400" />
          Скриншоты (до 2 штук)
        </h3>

        <div className="grid grid-cols-2 gap-4">
          {[0, 1].map((index) => (
            <div key={index}>
              {formData.screenshots[index] ? (
                <div className="relative group">
                  <img
                    src={formData.screenshots[index]}
                    alt={`Скриншот ${index + 1}`}
                    className="w-full h-40 object-cover rounded-xl border border-white/10"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newScreenshots = [...formData.screenshots]
                      newScreenshots.splice(index, 1)
                      updateField('screenshots', newScreenshots)
                    }}
                    className="absolute top-2 right-2 p-2 rounded-lg bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label
                  className={`flex flex-col items-center justify-center h-40 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
                    theme === 'dark'
                      ? 'border-white/20 hover:border-purple-500/50 bg-white/5'
                      : 'border-gray-300 hover:border-purple-500 bg-gray-50'
                  }`}
                >
                  <Camera className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-400">Скриншот {index + 1}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        if (file.size > 5 * 1024 * 1024) {
                          alert('Файл слишком большой. Максимальный размер: 5MB')
                          e.target.value = ''
                          return
                        }
                        const reader = new FileReader()
                        reader.onloadend = () => {
                          const base64 = reader.result as string
                          const newScreenshots = [...formData.screenshots]
                          const currentScreenshots = newScreenshots.filter(Boolean)
                          if (currentScreenshots.length < 2) {
                            currentScreenshots.push(base64)
                            updateField('screenshots', currentScreenshots)
                          }
                        }
                        reader.readAsDataURL(file)
                      }
                      e.target.value = ''
                    }}
                  />
                </label>
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400">
          Поддерживаются форматы: PNG, JPG, WEBP. Максимальный размер: 5MB
        </p>
      </div>

      {/* Кнопки */}
      <div className="flex gap-3 pt-4 border-t border-white/10">
        <button
          type="button"
          onClick={onClose}
          className={`flex-1 px-4 py-3 rounded-xl border ${borderColor} font-medium hover:bg-white/5 transition-colors`}
        >
          Отмена
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold hover:from-purple-400 hover:to-indigo-400 transition-all shadow-lg shadow-purple-500/25"
        >
          <Check className="w-4 h-4 inline mr-2" />
          Сохранить сделку
        </button>
      </div>
    </form>
  )
}

// ==================== КАРТОЧКА СФЕРЫ ====================
const SphereCard = ({ 
  sphere, 
  onClick, 
  tradesCount,
  isActive 
}: { 
  sphere: SphereCardMeta
  onClick: () => void
  tradesCount: number
  isActive: boolean
}) => {
  const { theme } = useThemeStore()
  const gradient = theme === 'dark' ? sphere.gradientDark : sphere.gradient

  return (
    <button
      onClick={onClick}
      className={`group relative overflow-hidden p-5 rounded-2xl border transition-all duration-300 hover:scale-[1.02] ${
        isActive
          ? 'ring-2 ring-[#4C7F6E]/50 shadow-xl'
          : ''
      } ${
        theme === 'dark'
          ? 'bg-[#0f1419] border-white/10 hover:border-white/20'
          : 'bg-white border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="relative flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${gradient} text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}>
          {sphere.icon}
        </div>
        <div className="text-left flex-1">
          <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {sphere.label}
          </h3>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            {sphere.description}
          </p>
        </div>
        {tradesCount > 0 && (
          <span className={`px-3 py-1 rounded-full text-sm font-bold ${
            theme === 'dark' 
              ? 'bg-white/10 text-white' 
              : 'bg-gray-100 text-gray-700'
          }`}>
            {tradesCount}
          </span>
        )}
      </div>
    </button>
  )
}

// ==================== ГЛАВНЫЙ КОМПОНЕНТ ====================
export const TraderDiary = () => {
  const { theme } = useThemeStore()
  const [hasAccess] = useState(true)
  
  // UI State
  const [showForm, setShowForm] = useState(false)
  const [activeSphere, setActiveSphere] = useState<DiarySphere | null>(null)
  const [viewSphere, setViewSphere] = useState<DiarySphere | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [dateFilter, setDateFilter] = useState<{ from: string; to: string }>({ from: '', to: '' })
  
  // Data (mock для демонстрации)
  const [, setTrades] = useState<MemTradeData[]>([])
  const [, setMemDevingTrades] = useState<MemDevingData[]>([])
  const [, setPolymarketTrades] = useState<PolymarketData[]>([])
  const [, setSpotTrades] = useState<SpotData[]>([])
  const [, setFuturesTrades] = useState<FuturesData[]>([])
  const [, setNFTTrades] = useState<NFTData[]>([])
  
  useScrollLock(showForm)

  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const subtleColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
  const borderColor = theme === 'dark' ? 'border-white/10' : 'border-gray-200'
  const bgColor = theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-white'

  const handleSaveTrade = (data: MemTradeData) => {
    setTrades(prev => [...prev, data])
    setShowForm(false)
    setActiveSphere(null)
  }

  const handleSaveMemDevingTrade = (data: MemDevingData) => {
    setMemDevingTrades(prev => [...prev, data])
    setShowForm(false)
    setActiveSphere(null)
  }

  const handleSavePolymarketTrade = (data: PolymarketData) => {
    setPolymarketTrades(prev => [...prev, data])
    setShowForm(false)
    setActiveSphere(null)
  }

  const handleSaveSpotTrade = (data: SpotData) => {
    setSpotTrades(prev => [...prev, data])
    setShowForm(false)
    setActiveSphere(null)
  }

  const handleSaveFuturesTrade = (data: FuturesData) => {
    setFuturesTrades(prev => [...prev, data])
    setShowForm(false)
    setActiveSphere(null)
  }

  const handleSaveNFTTrade = (data: NFTData) => {
    setNFTTrades(prev => [...prev, data])
    setShowForm(false)
    setActiveSphere(null)
  }

  const handleSphereClick = (sphere: DiarySphere) => {
    setViewSphere(sphere)
  }

  // No access
  if (!hasAccess) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className={`relative max-w-md w-full p-8 rounded-3xl text-center ${
          theme === 'dark' ? 'bg-[#0f1419] border border-white/10' : 'bg-white border border-gray-200'
        } shadow-2xl`}>
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center bg-gray-100 dark:bg-white/5">
            <Lock className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className={`text-2xl font-black mb-3 ${textColor}`}>Trader Diary</h3>
          <p className={`text-sm ${subtleColor}`}>Доступ ограничен. Свяжитесь с администратором.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-20 relative">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-teal-500/8 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-500/6 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Hero Header */}
      <div className="px-4 sm:px-6 lg:px-8 pt-4">
        <div className={`relative overflow-hidden rounded-3xl ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-[#0f1419] via-[#0a0f14] to-[#0d1218] border border-white/10' 
            : 'bg-gradient-to-br from-white via-gray-50 to-white border border-gray-200'
        } shadow-2xl`}>
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#4C7F6E]/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl" />
          </div>

          <div className="relative p-6 sm:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#4C7F6E]/10 flex items-center justify-center border border-[#4C7F6E]/30`}>
                    <BookOpen className="w-7 h-7 sm:w-8 sm:h-8 text-[#4C7F6E]" />
                  </div>
                </div>
                <div>
                  <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${textColor}`}>
                    Trader Diary
                  </h1>
                  <p className={`text-sm ${subtleColor}`}>
                    Личный дневник сделок и аналитика
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveSphere(null)
                  setShowForm(true)
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white shadow-lg shadow-[#4C7F6E]/25 transition-all hover:scale-105 active:scale-95 bg-[#4C7F6E] hover:bg-[#4C7F6E]/80"
              >
                <Zap className="w-5 h-5" />
                <span>Добавить сделку</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Фильтры */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className={`rounded-2xl p-4 ${
          theme === 'dark' 
            ? 'bg-[#0f1419]/80 backdrop-blur-xl border border-white/10' 
            : 'bg-white/80 backdrop-blur-xl border border-gray-200'
        } shadow-xl`}>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Селектор сферы */}
            <div className="relative min-w-[200px]">
              <CustomSphereSelector
                value={viewSphere}
                onChange={(val) => setViewSphere(val as DiarySphere || null)}
                theme={theme}
              />
            </div>
            
            {/* Поиск */}
            <div className="flex-1 relative">
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${subtleColor}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск по названию, тикеру..."
                className={`w-full pl-12 pr-4 py-3 rounded-xl border-0 ${
                  theme === 'dark' 
                    ? 'bg-white/5 text-white placeholder-gray-500 focus:bg-white/10' 
                    : 'bg-gray-100 text-gray-900 placeholder-gray-400 focus:bg-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-[#4C7F6E]/50 transition-all`}
              />
            </div>
            
            {/* Даты */}
            <div className="flex gap-3">
              <input
                type="date"
                value={dateFilter.from}
                onChange={(e) => setDateFilter(prev => ({ ...prev, from: e.target.value }))}
                className={`px-4 py-2.5 rounded-xl border ${borderColor} ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'} focus:outline-none focus:ring-2 focus:ring-[#4C7F6E]/50`}
              />
              <input
                type="date"
                value={dateFilter.to}
                onChange={(e) => setDateFilter(prev => ({ ...prev, to: e.target.value }))}
                className={`px-4 py-2.5 rounded-xl border ${borderColor} ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'} focus:outline-none focus:ring-2 focus:ring-[#4C7F6E]/50`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Карточки сфер */}
      <div className="px-4 sm:px-6 lg:px-8">
        <h3 className={`text-sm font-semibold ${subtleColor} mb-4 flex items-center gap-2`}>
          <Target className="w-4 h-4" />
          Ваши сферы
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SPHERE_ORDER.map((sphereId) => {
            const sphere = SPHERE_META[sphereId]
            return (
              <SphereCard
                key={sphereId}
                sphere={sphere}
                onClick={() => handleSphereClick(sphereId)}
                tradesCount={0}
                isActive={activeSphere === sphereId}
              />
            )
          })}
        </div>
      </div>

      {/* Секция просмотра сделок сферы */}
      {viewSphere && (
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-sm font-semibold ${subtleColor} flex items-center gap-2`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br ${SPHERE_META[viewSphere].gradient} text-white`}>
                {SPHERE_META[viewSphere].icon}
              </div>
              Сделки: {SPHERE_META[viewSphere].label}
            </h3>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setActiveSphere(viewSphere)
                  setShowForm(true)
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-white shadow-lg shadow-[#4C7F6E]/25 transition-all hover:scale-105 active:scale-95 bg-[#4C7F6E] hover:bg-[#4C7F6E]/80 text-sm"
              >
                <Zap className="w-4 h-4" />
                Добавить сделку
              </button>
              <button
                onClick={() => setViewSphere(null)}
                className={`text-sm px-3 py-2 rounded-lg transition-colors ${
                  theme === 'dark' 
                    ? 'text-gray-400 hover:text-white hover:bg-white/10' 
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                ← К сферам
              </button>
            </div>
          </div>
          
          {/* Здесь будут карточки сделок выбранной сферы */}
          <div className={`rounded-2xl p-8 text-center ${
            theme === 'dark' 
              ? 'bg-[#0f1419]/50 border border-white/10' 
              : 'bg-gray-50 border border-gray-200'
          }`}>
            <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center bg-gradient-to-br ${SPHERE_META[viewSphere].gradient} text-white`}>
              {SPHERE_META[viewSphere].icon}
            </div>
            <h4 className={`text-lg font-bold ${textColor} mb-2`}>
              {SPHERE_META[viewSphere].label}
            </h4>
            <p className={`text-sm ${subtleColor} mb-4`}>
              {SPHERE_META[viewSphere].description}
            </p>
            <p className={`text-sm ${subtleColor}`}>
              Сделок пока нет. Добавьте первую сделку!
            </p>
          </div>
        </div>
      )}

      {/* Модальное окно формы */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-2xl z-[70] flex items-start sm:items-center justify-center p-4 overflow-y-auto">
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#4C7F6E]/10 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[80px] animate-pulse" />
          </div>

          <div className={`relative ${bgColor} rounded-3xl shadow-2xl shadow-black/50 border-2 ${
            theme === 'dark' ? 'border-white/10' : 'border-gray-200'
          } w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300`}>
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-white/10 bg-inherit">
              <div className="flex items-center gap-3">
                {activeSphere && SPHERE_META[activeSphere] && (
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${SPHERE_META[activeSphere].gradient} text-white`}>
                    {SPHERE_META[activeSphere].icon}
                  </div>
                )}
                <div>
                  <h2 className={`text-lg font-bold ${textColor}`}>
                    {activeSphere ? SPHERE_META[activeSphere].label : 'Новая сделка'}
                  </h2>
                  <p className={`text-xs ${subtleColor}`}>
                    {activeSphere ? SPHERE_META[activeSphere].description : 'Выберите тип сделки'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowForm(false)
                  setActiveSphere(null)
                }}
                className={`p-2 rounded-xl transition-colors ${
                  theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {!activeSphere ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {SPHERE_ORDER.map((sphereId) => {
                    const sphere = SPHERE_META[sphereId]
                    const gradient = theme === 'dark' ? sphere.gradientDark : sphere.gradient
                    return (
                      <button
                        key={sphereId}
                        onClick={() => setActiveSphere(sphereId)}
                        className={`group rounded-2xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
                          theme === 'dark' 
                            ? 'bg-transparent border-white/10 hover:border-[#4C7F6E]/40 hover:bg-white/5' 
                            : 'bg-white border-gray-200 hover:border-[#4C7F6E]/30 hover:bg-gray-50'
                        }`}
                      >
                        <div className="p-4 flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${gradient} text-white shadow-lg transition-transform duration-300 group-hover:scale-110 flex-shrink-0`}>
                            {sphere.icon}
                          </div>
                          <div className="text-left">
                            <span className={`font-bold text-base ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                              {sphere.label}
                            </span>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              ) : activeSphere === 'mem-trade' ? (
                <MemTradeForm
                  onClose={() => {
                    setShowForm(false)
                    setActiveSphere(null)
                  }}
                  onSave={handleSaveTrade}
                />
              ) : activeSphere === 'mem-deving' ? (
                <MemDevingForm
                  onClose={() => {
                    setShowForm(false)
                    setActiveSphere(null)
                  }}
                  onSave={handleSaveMemDevingTrade}
                />
              ) : activeSphere === 'polymarket' ? (
                <PolymarketForm
                  onClose={() => {
                    setShowForm(false)
                    setActiveSphere(null)
                  }}
                  onSave={handleSavePolymarketTrade}
                />
              ) : activeSphere === 'spot' ? (
                <SpotForm
                  onClose={() => {
                    setShowForm(false)
                    setActiveSphere(null)
                  }}
                  onSave={handleSaveSpotTrade}
                />
              ) : activeSphere === 'futures' ? (
                <FuturesForm
                  onClose={() => {
                    setShowForm(false)
                    setActiveSphere(null)
                  }}
                  onSave={handleSaveFuturesTrade}
                />
              ) : activeSphere === 'nft' ? (
                <NFTForm
                  onClose={() => {
                    setShowForm(false)
                    setActiveSphere(null)
                  }}
                  onSave={handleSaveNFTTrade}
                />
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TraderDiary
