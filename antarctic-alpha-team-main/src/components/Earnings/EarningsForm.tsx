import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useAdminStore } from '@/store/adminStore'
import { useThemeStore } from '@/store/themeStore'
import { addApprovalRequest } from '@/services/firestoreService'
import { formatDate } from '@/utils/dateUtils'
import { getUserNicknameSync } from '@/utils/userUtils'
import { EARNINGS_CATEGORY_META, Earnings, EarningsCategory } from '@/types'
import { X, Rocket, LineChart, Image, Coins, BarChart3, ShieldCheck, Sparkles, Gift, Wallet, Repeat, HeartHandshake, DollarSign, Calculator, Calendar, Briefcase, Copy, Check, Bot, Landmark, AlertTriangle, CheckCircle2, Send } from 'lucide-react'
import { useScrollLock } from '@/hooks/useScrollLock'
import { calculatePoolShare, calculateTotalEarnings } from '@/utils/earningsCalculations'

interface EarningsFormProps {
  onClose: () => void
  onSave: () => void
  editingEarning?: Earnings | null
}

// Категории для отображения (без 'other' для основного выбора)
const CATEGORY_OPTIONS: EarningsCategory[] = [
  'memecoins_trading',
  'memecoins_deving',
  'polymarket',
  'spot',
  'futures',
  'prop_trading',
  'nft',
  'staking',
  'airdrop',
  'p2p',
  'p2c',
  'funds',
  'crypto_casino',
  'automated_software'
]

const CATEGORY_ICONS: Record<EarningsCategory, React.ReactNode> = {
  memecoins_trading: <Rocket className="w-5 h-5" />,
  memecoins_deving: <Rocket className="w-5 h-5" />,
  polymarket: <BarChart3 className="w-5 h-5" />,
  spot: <Coins className="w-5 h-5" />,
  futures: <LineChart className="w-5 h-5" />,
  prop_trading: <ShieldCheck className="w-5 h-5" />,
  nft: <Image className="w-5 h-5" />,
  staking: <ShieldCheck className="w-5 h-5" />,
  airdrop: <Gift className="w-5 h-5" />,
  p2p: <Repeat className="w-5 h-5" />,
  p2c: <HeartHandshake className="w-5 h-5" />,
  funds: <Briefcase className="w-5 h-5" />,
  crypto_casino: <Sparkles className="w-5 h-5" />,
  automated_software: <Bot className="w-5 h-5" />,
  other: <Sparkles className="w-5 h-5" />,
}

interface PoolWallet {
  id: string
  name: string
  network: string
  networkChip: string
  address: string
  icon: string
  networkIcon?: string
  tile: string
  accent: string
  hint: string
}

const CRYPTO_WALLETS: PoolWallet[] = [
  {
    id: 'usdt-ton',
    name: 'USDT (TON)',
    network: 'TON',
    networkChip: 'bg-sky-500/10 text-sky-500 border-sky-500/25',
    address: 'UQDFdNMk2Ymz1dFXZrHwfqOf6VqSu9WqwPV649klh6WCDVnj',
    icon: '/usdt.png',
    networkIcon: '/ton.svg',
    tile: 'from-emerald-400/30 to-teal-500/10',
    accent: 'from-emerald-400 to-teal-500',
    hint: 'Универсальный стейблкоин — рекомендуемый вариант для большинства переводов',
  },
  {
    id: 'usdc-polygon',
    name: 'USDC (Polygon)',
    network: 'Polygon',
    networkChip: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/25',
    address: '0x9bcf3eaA37249BEBC377820E3Ee1D2b09aC88731',
    icon: '/usdc.jpg',
    networkIcon: '/polygon.png',
    tile: 'from-blue-400/30 to-indigo-500/10',
    accent: 'from-blue-400 to-indigo-500',
    hint: 'Стейблкоин в сети Polygon — низкие комиссии и быстрые переводы',
  },
  {
    id: 'sol',
    name: 'SOL',
    network: 'Solana',
    networkChip: 'bg-violet-500/10 text-violet-500 border-violet-500/25',
    address: 'ARcYzhj7aqMW6HTLhbRwCB3bLFpZ1k1M79SGM1RZtciE',
    icon: '/sol.webp',
    tile: 'from-violet-400/30 to-purple-500/10',
    accent: 'from-violet-400 to-purple-500',
    hint: 'Используйте, если прибыль получена в Solana',
  },
  {
    id: 'gram',
    name: 'GRAM',
    network: 'TON',
    networkChip: 'bg-sky-500/10 text-sky-500 border-sky-500/25',
    address: 'UQDFdNMk2Ymz1dFXZrHwfqOf6VqSu9WqwPV649klh6WCDVnj',
    icon: '/ton.svg',
    tile: 'from-sky-400/30 to-blue-500/10',
    accent: 'from-sky-400 to-blue-500',
    hint: 'Токен экосистемы Telegram (сеть TON)',
  },
  {
    id: 'eth',
    name: 'ETH (ERC20)',
    network: 'ERC-20',
    networkChip: 'bg-slate-500/10 text-slate-500 border-slate-500/25',
    address: '0x9bcf3eaA37249BEBC377820E3Ee1D2b09aC88731',
    icon: '/eth.webp',
    tile: 'from-slate-400/30 to-slate-600/10',
    accent: 'from-slate-400 to-slate-600',
    hint: 'Эфир в сети Ethereum (ERC-20)',
  },
  {
    id: 'bnb',
    name: 'BNB (BEP20)',
    network: 'BEP-20',
    networkChip: 'bg-amber-500/10 text-amber-500 border-amber-500/25',
    address: '0x7aBF66CBD4734ddfe093dD7E065beada94A11a95',
    icon: '/bnb.webp',
    tile: 'from-amber-400/30 to-yellow-500/10',
    accent: 'from-amber-400 to-yellow-500',
    hint: 'BNB в сети BNB Chain (BEP-20)',
  },
  {
    id: 'btc',
    name: 'BTC',
    network: 'Bitcoin',
    networkChip: 'bg-orange-500/10 text-orange-500 border-orange-500/25',
    address: 'bc1qgycajytzlhz9yywjm470nvmzrmj7uln3gyzc2a',
    icon: '/btc.webp',
    tile: 'from-orange-400/30 to-red-500/10',
    accent: 'from-orange-400 to-red-500',
    hint: 'Биткоин в основной сети Bitcoin',
  },
]

const FIAT_WALLETS: PoolWallet[] = [
  {
    id: 'fiat-usdt-ton',
    name: 'USDT (TON)',
    network: 'TON',
    networkChip: 'bg-sky-500/10 text-sky-500 border-sky-500/25',
    address: 'UQDFdNMk2Ymz1dFXZrHwfqOf6VqSu9WqwPV649klh6WCDVnj',
    icon: '/usdt.png',
    networkIcon: '/ton.svg',
    tile: 'from-emerald-400/30 to-teal-500/10',
    accent: 'from-emerald-400 to-teal-500',
    hint: 'Лучший вариант после конвертации фиата в USDT',
  },
  {
    id: 'fiat-usdt-tron',
    name: 'USDT (TRON)',
    network: 'TRC-20',
    networkChip: 'bg-red-500/10 text-red-500 border-red-500/25',
    address: 'TUpjccuJ34dSM9tqDhd5FhhQbPJWqGgjJr',
    icon: '/usdt.png',
    networkIcon: '/tron.png',
    tile: 'from-red-400/30 to-rose-500/10',
    accent: 'from-red-400 to-rose-500',
    hint: 'Альтернативный вариант — USDT в сети TRON',
  },
]

const ALL_POOL_WALLETS = [...CRYPTO_WALLETS, ...FIAT_WALLETS]

const TRANSFER_STEPS = [
  { title: 'Выберите актив', description: 'Найдите монету и сеть, в которых у вас сейчас средства' },
  { title: 'Отправьте сумму', description: 'Переведите на адрес сумму из блока «В пул» выше' },
  { title: 'Подтвердите', description: 'Нажмите «Выбрать» под кошельком — адрес подставится в заявку' },
]

export const EarningsForm = ({ onClose, onSave, editingEarning }: EarningsFormProps) => {
  const { user } = useAuthStore()
  const { isAdmin } = useAdminStore()
  const { theme } = useThemeStore()
  const isEditing = !!editingEarning

  // Конвертация старой категории при редактировании
  const getInitialCategory = (): EarningsCategory => {
    if (!editingEarning) return 'memecoins_trading'
    if (editingEarning.category === 'memecoins') {
      return editingEarning.isDeving ? 'memecoins_deving' : 'memecoins_trading'
    }
    return editingEarning.category as EarningsCategory
  }

  const [date, setDate] = useState(editingEarning?.date || formatDate(new Date(), 'yyyy-MM-dd'))
  const [amount, setAmount] = useState(editingEarning?.amount.toString() || '')

  // New State
  const [walletType, setWalletType] = useState<'general' | 'pool'>(editingEarning?.walletType || 'general')
  const [extraWalletsCount, setExtraWalletsCount] = useState(editingEarning?.extraWalletsCount?.toString() || '0')
  const [category, setCategory] = useState<EarningsCategory>(getInitialCategory())
  const [receivedWallet, setReceivedWallet] = useState(editingEarning?.receivedWallet || '')
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(() => {
    if (!editingEarning?.receivedWallet) return null
    return ALL_POOL_WALLETS.find(w => w.address === editingEarning.receivedWallet)?.id ?? null
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [copiedWallets, setCopiedWallets] = useState<Set<string>>(new Set())

  useScrollLock()

  // Функция копирования кошелька
  const copyWallet = async (address: string, id: string) => {
    try {
      await navigator.clipboard.writeText(address)
      setCopiedWallets(prev => {
        const newSet = new Set(prev)
        newSet.add(id)
        return newSet
      })
      setTimeout(() => {
        setCopiedWallets(prev => {
          const newSet = new Set(prev)
          newSet.delete(id)
          return newSet
        })
      }, 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleSelectWallet = (wallet: PoolWallet) => {
    setReceivedWallet(wallet.address)
    setSelectedWalletId(wallet.id)
    copyWallet(wallet.address, wallet.id)
  }

  // Calculate values
  const numericAmount = parseFloat(amount || '0')
  const numericExtraWalletsCount = parseInt(extraWalletsCount || '0', 10)
  
  // Базовые значения без надбавок
  const baseTotalEarnings = calculateTotalEarnings(numericAmount, walletType, numericExtraWalletsCount)
  // В общем результате показывается сумма без тех. надбавки
  const totalEarnings = baseTotalEarnings

  // Технические надбавки
  const EARNINGS_MARKUP = 0.125 // +12.5% к заработку (база для расчёта пула)
  const POOL_MARKUP = 0.165 // +16.5% к сумме взноса в пул

  // Пул: считается от заработка с надбавкой +10%, затем к сумме пула добавляется +15%
  const inflatedEarnings = baseTotalEarnings * (1 + EARNINGS_MARKUP)
  const { poolShare: basePoolShare } = calculatePoolShare(inflatedEarnings, category, walletType)
  const poolShare = basePoolShare * (1 + POOL_MARKUP)
  const percent = inflatedEarnings > 0 ? basePoolShare / inflatedEarnings : 0

  const calculatePerParticipant = () => {
    const participants = isEditing && editingEarning 
      ? (editingEarning.participants?.length ? editingEarning.participants : [editingEarning.userId])
      : [user?.id || '']
    if (!participants.length) return 0
    return Math.max(totalEarnings - poolShare, 0) / participants.length
  }

  const perParticipant = calculatePerParticipant()

  const canEdit = !isEditing || (isAdmin && editingEarning?.status === 'pending')

  const matchedWallets = receivedWallet.trim() ? ALL_POOL_WALLETS.filter(w => w.address === receivedWallet.trim()) : []

  const handleSave = async () => {
    if (!amount || !user?.id) {
      setError('Пожалуйста, заполните все обязательные поля')
      return
    }

    if (!receivedWallet.trim()) {
      setError('Пожалуйста, укажите кошелек, на который поступили средства')
      return
    }

    if (isAdmin && isEditing && editingEarning?.status === 'approved') {
      setError('Нельзя изменять одобренный заработок')
      return
    }

    setLoading(true)
    setError('')

    try {
      const participants = isEditing && editingEarning 
        ? (editingEarning.participants?.length ? editingEarning.participants : [editingEarning.userId])
        : [user.id]

      const earningsData = {
        date,
        amount: numericAmount,
        extraWalletsCount: numericExtraWalletsCount,
        category,
        walletType,
        participants,
        userId: user.id,
        status: 'pending' as const,
        perParticipant: perParticipant,
        poolAmount: poolShare,
        receivedWallet: receivedWallet.trim()
      }

      // Создаем approval request вместо прямого сохранения
      await addApprovalRequest({
        entity: 'earning',
        action: isEditing ? 'update' : 'create',
        authorId: user.id,
        targetUserId: user.id,
        before: isEditing && editingEarning ? editingEarning : undefined,
        after: earningsData as unknown as Earnings,
      })

      onSave()
      onClose()
    } catch (error) {
      console.error('Error saving earnings:', error)
      setError('Ошибка при сохранении. Попробуйте снова.')
    } finally {
      setLoading(false)
    }
  }

  const userNickname = user?.id ? getUserNicknameSync(user.id) : ''

  // Цветовые переменные
  const isDark = theme === 'dark'
  const bgMain = isDark ? 'bg-gradient-to-br from-[#0d1520] via-[#0f1a28] to-[#0a1019]' : 'bg-white'
  const borderMain = isDark ? 'border-white/10' : 'border-gray-200'
  const bgInput = isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
  const textMain = isDark ? 'text-white' : 'text-gray-900'
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-500'

  const renderHeading = (step: number, icon: React.ReactNode, title: string, subtitle?: string) => (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl bg-[#4C7F6E]/15 border border-[#4C7F6E]/30 flex items-center justify-center text-[#4C7F6E] flex-shrink-0">
        {icon}
      </div>
      <div>
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-md bg-gradient-to-br from-[#4C7F6E] to-[#3d6660] text-white text-[10px] font-black flex items-center justify-center shadow-md shadow-[#4C7F6E]/30">
            {step}
          </span>
          <h3 className={`text-sm font-black uppercase tracking-wider ${textMain}`}>{title}</h3>
        </div>
        {subtitle && <p className={`text-[11px] ${textMuted} mt-0.5 leading-snug`}>{subtitle}</p>}
      </div>
    </div>
  )

  const renderWalletCard = (wallet: PoolWallet) => {
    const isSelected = selectedWalletId === wallet.id
    const isCopied = copiedWallets.has(wallet.id)
    return (
      <div
        key={wallet.id}
        className={`group relative overflow-hidden rounded-2xl border p-4 transition-all duration-200 ${
          isSelected
            ? 'border-emerald-500/60 bg-gradient-to-br from-emerald-500/15 via-[#4C7F6E]/5 to-transparent ring-1 ring-emerald-500/30 shadow-lg shadow-emerald-500/10'
            : isDark
              ? 'border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.02] hover:border-[#4C7F6E]/50 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#4C7F6E]/10'
              : 'border-gray-200 bg-gradient-to-b from-white to-gray-50/60 hover:border-[#4C7F6E]/40 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#4C7F6E]/10'
        }`}
      >
        {/* Top accent */}
        <div className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${wallet.accent} ${isSelected ? 'opacity-100' : 'opacity-30 group-hover:opacity-70'}`} />

        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`relative w-12 h-12 rounded-2xl bg-gradient-to-br ${wallet.tile} flex items-center justify-center flex-shrink-0 ring-1 ring-white/10 shadow-inner`}>
              <img src={wallet.icon} alt={wallet.name} loading="lazy" className="w-7 h-7 object-contain drop-shadow-md" />
              {wallet.networkIcon && (
                <div className={`absolute -right-1.5 -bottom-1.5 w-5 h-5 rounded-full flex items-center justify-center shadow-md ${isDark ? 'bg-[#0f1a28]' : 'bg-white'} border ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                  <img src={wallet.networkIcon} alt={wallet.network} loading="lazy" className="w-3 h-3 object-contain" />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-sm font-bold ${textMain}`}>{wallet.name}</span>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border uppercase tracking-wide ${wallet.networkChip}`}>{wallet.network}</span>
              </div>
              <p className={`text-[10px] leading-snug ${textMuted} mt-0.5`}>{wallet.hint}</p>
            </div>
          </div>
          {isSelected && (
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shadow-md shadow-emerald-500/40">
              <Check className="w-3 h-3 text-white" />
            </div>
          )}
        </div>

        <div className={`mt-3 flex items-center gap-2 pl-3 pr-1.5 py-2 rounded-xl border transition-all ${
          isCopied
            ? 'bg-emerald-500/15 border-emerald-500/30'
            : isDark ? 'bg-black/40 border-white/10 group-hover:border-white/20' : 'bg-gray-900/[0.04] border-gray-200 group-hover:border-gray-300'
        }`}>
          <code className={`flex-1 min-w-0 break-all text-[10px] font-mono leading-snug ${textMain} opacity-70`}>{wallet.address}</code>
          <button
            type="button"
            onClick={() => copyWallet(wallet.address, wallet.id)}
            title="Скопировать адрес"
            className={`p-1.5 rounded-lg transition-all flex-shrink-0 ${
              isCopied
                ? 'bg-emerald-500/20 text-emerald-500'
                : isDark ? 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700'
            }`}
          >
            {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        <button
          type="button"
          onClick={() => handleSelectWallet(wallet)}
          disabled={!canEdit}
          className={`mt-3 w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
            isSelected
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/30'
              : isDark
                ? 'bg-white/[0.06] text-gray-300 border border-white/10 hover:bg-white/[0.12]'
                : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
          }`}
        >
          {isSelected ? <Check className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
          <span>{isSelected ? 'Выбрано' : 'Выбрать'}</span>
        </button>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Animated Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className={`relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl ${bgMain} border ${borderMain} animate-in fade-in zoom-in-95 duration-300`}>
        {/* Decorative Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -left-32 w-64 h-64 bg-[#4C7F6E]/20 rounded-full blur-[80px]" />
          <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-[#4C7F6E]/10 rounded-full blur-[80px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />
        </div>

        {/* Header */}
        <div className={`relative z-10 flex items-center justify-between p-6 border-b ${borderMain}`}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[#4C7F6E]/20 border border-[#4C7F6E]/30">
              <DollarSign className="w-6 h-6 text-[#4C7F6E]" />
            </div>
            <div>
              <h2 className={`text-xl font-black ${textMain}`}>
                {isEditing ? 'Редактировать' : 'Добавить заработок'}
              </h2>
              <p className={`text-xs font-medium ${textMuted}`}>
                {isEditing ? 'Изменить данные о доходе' : 'Записать новый доход'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2.5 rounded-xl transition-all ${isDark ? 'hover:bg-white/10 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="relative z-10 p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
              <p className="text-sm text-red-400 font-medium">{error}</p>
            </div>
          )}

          {/* Шаг 1 — Дата */}
          <div className="space-y-3">
            {renderHeading(1, <Calendar className="w-4 h-4" />, 'Дата', 'Укажите дату получения дохода')}
            <div className="relative">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                disabled={!canEdit}
                className={`w-full px-4 py-3.5 rounded-xl border ${bgInput} ${textMain} focus:outline-none focus:ring-2 focus:ring-[#4C7F6E]/50 transition-all disabled:opacity-50`}
              />
            </div>
          </div>

          {/* Шаг 2 — Сфера */}
          <div className="space-y-3">
            {renderHeading(2, <Rocket className="w-4 h-4" />, 'Сфера деятельности', 'Выберите, откуда получен доход')}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
              {CATEGORY_OPTIONS.map((cat) => {
                const meta = EARNINGS_CATEGORY_META[cat]
                const isSelected = category === cat
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    disabled={!canEdit}
                    className={`relative flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-200 ${
                      isSelected
                        ? 'border-[#4C7F6E] bg-[#4C7F6E]/10 shadow-lg shadow-[#4C7F6E]/20'
                        : `${bgInput} hover:border-white/20`
                    } disabled:opacity-50 touch-manipulation`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isSelected 
                        ? 'bg-gradient-to-br from-[#4C7F6E] to-[#3d6660] text-white shadow-lg' 
                        : 'bg-white/5 text-gray-400'
                    }`}>
                      {CATEGORY_ICONS[cat]}
                    </div>
                    <span className={`text-[10px] font-bold truncate w-full text-center ${isSelected ? 'text-[#4C7F6E]' : textMuted}`}>
                      {meta.shortName}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Шаг 3 — Сумма */}
          <div className="space-y-3">
            {renderHeading(3, <Calculator className="w-4 h-4" />, 'Сумма дохода', walletType === 'pool' ? 'Сумма будет полностью зачислена в пул' : 'Укажите прибыль и дополнительные кошельки, если они были')}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Amount Input */}
              <div className="space-y-2">
                <label className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${textMuted}`}>
                  {walletType === 'pool' ? 'Сумма в пул (₽)' : 'Прибыль с основного кошелька (₽)'}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    disabled={!canEdit}
                    placeholder="0.00"
                    className={`w-full px-4 py-4 text-lg font-bold rounded-xl border ${bgInput} ${textMain} placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4C7F6E]/50 transition-all disabled:opacity-50`}
                  />
                  <span className={`absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold ${textMuted}`}>₽</span>
                </div>
              </div>

              {/* Extra Wallets & Pool Button */}
              <div className="space-y-2">
                <label className={`flex items-center gap-2 text-sm font-medium ${textMain}`}>
                  Кол-во копи-кошельков / аккаунтов
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={extraWalletsCount}
                    onChange={(e) => setExtraWalletsCount(e.target.value)}
                    disabled={!canEdit}
                    placeholder="0"
                    className={`flex-1 px-4 py-3 rounded-xl border ${bgInput} ${textMain} placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4C7F6E]/50 transition-all disabled:opacity-50`}
                  />
                  <button
                    type="button"
                    onClick={() => setWalletType(walletType === 'pool' ? 'general' : 'pool')}
                    disabled={!canEdit}
                    className={`px-4 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                      walletType === 'pool'
                        ? 'bg-gradient-to-r from-[#4C7F6E] to-[#3d6660] text-white shadow-lg shadow-[#4C7F6E]/30'
                        : `${bgInput} ${textMuted} hover:border-white/20`
                    } disabled:opacity-50`}
                  >
                    <Coins className="w-4 h-4" />
                    <span>Пул</span>
                  </button>
                </div>
                <p className={`text-[10px] ${textMuted}`}>
                  Укажите кол-во дополнительных кошельков или аккаунтов, с которых получена прибыль
                </p>
              </div>
            </div>

            {/* Pool Hint */}
            {walletType === 'pool' && (
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <Coins className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${textMain}`}>
                      Отправка в пул
                    </p>
                    <p className={`text-xs ${textMuted} mt-1`}>
                      Используйте этот тип, если хотите отправить всю сумму в общий пул сообщества. 
                      Также выберите этот вариант, если к вам применены штрафные санкции за нарушение правил — 
                      в этом случае сумма будет полностью зачислена в пул.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Шаг 4 — Расчёт */}
          <div className={`p-5 rounded-2xl border ${borderMain} bg-gradient-to-br ${isDark ? 'from-white/5 to-transparent' : 'from-gray-50 to-transparent'}`}>
            {renderHeading(4, <Calculator className="w-4 h-4" />, 'Расчёт', 'Сумма рассчитывается автоматически по тарифу вашей сферы')}
            <div className="flex items-center justify-between mt-4 mb-4">
              <span className={`text-xs ${textMuted}`}>Взнос сообществу</span>
              <div className={`px-2.5 py-1 rounded-lg text-xs font-bold bg-[#4C7F6E]/20 text-[#4C7F6E]`}>
                {(percent * 100).toFixed(0)}% в пул
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className={`flex flex-col gap-1.5 p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-white border border-gray-200'}`}>
                <div className="w-8 h-8 rounded-lg bg-[#4C7F6E]/15 text-[#4C7F6E] flex items-center justify-center">
                  <Wallet className="w-4 h-4" />
                </div>
                <span className={`text-[10px] uppercase tracking-wider font-bold ${textMuted}`}>Общий результат</span>
                <span className={`text-base font-black ${textMain}`}>{totalEarnings.toLocaleString()} ₽</span>
              </div>
              <div className={`flex flex-col gap-1.5 p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-white border border-gray-200'}`}>
                <div className="w-8 h-8 rounded-lg bg-red-500/15 text-red-400 flex items-center justify-center">
                  <Coins className="w-4 h-4" />
                </div>
                <span className={`text-[10px] uppercase tracking-wider font-bold ${textMuted}`}>В пул</span>
                <span className="text-base font-black text-red-400">-{poolShare.toFixed(2)} ₽</span>
              </div>
              <div className={`flex flex-col gap-1.5 p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 shadow-lg shadow-emerald-500/10`}>
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                  <DollarSign className="w-4 h-4" />
                </div>
                <span className={`text-[10px] uppercase tracking-wider font-bold ${textMain}`}>Чистый доход</span>
                <span className="text-lg font-black text-emerald-400">{perParticipant.toFixed(2)} ₽</span>
              </div>
            </div>
          </div>

          {/* Шаг 5 — Перевод в пул */}
          <div className={`p-5 rounded-2xl border ${borderMain} bg-gradient-to-br ${isDark ? 'from-white/5 to-transparent' : 'from-gray-50 to-transparent'}`}>
            {renderHeading(5, <Send className="w-4 h-4" />, 'Перевод доли в пул', 'Отправьте сумму из блока «В пул» на кошелек, соответствующий вашему активу и сети')}

            {/* Guide steps */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {TRANSFER_STEPS.map((step, i) => (
                <div key={step.title} className={`flex items-start gap-2.5 p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-white border border-gray-200'}`}>
                  <div className="w-6 h-6 rounded-full bg-[#4C7F6E]/15 border border-[#4C7F6E]/30 text-[#4C7F6E] flex items-center justify-center text-[10px] font-black flex-shrink-0">
                    {i + 1}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-xs font-bold ${textMain}`}>{step.title}</p>
                    <p className={`text-[10px] leading-snug ${textMuted} mt-0.5`}>{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Cryptocurrency Wallets */}
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-3">
                <Coins className="w-4 h-4 text-[#4C7F6E]" />
                <p className={`text-xs font-bold uppercase tracking-wider ${textMuted}`}>Криптовалюты</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {CRYPTO_WALLETS.map(wallet => renderWalletCard(wallet))}
              </div>
            </div>

            {/* Fiat Information */}
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-3">
                <Landmark className="w-4 h-4 text-[#4C7F6E]" />
                <p className={`text-xs font-bold uppercase tracking-wider ${textMuted}`}>Фиатные валюты</p>
              </div>
              <div className={`p-4 rounded-2xl border-2 ${isDark ? 'bg-blue-500/10 border-blue-500/40' : 'bg-blue-50 border-blue-300'}`}>
                <p className={`text-sm font-bold mb-3 ${textMain}`}>
                  Для перевода фиата конвертируйте его в USDT и отправьте на один из кошельков:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {FIAT_WALLETS.map(wallet => renderWalletCard(wallet))}
                </div>
              </div>
            </div>

            {/* Important Warning */}
            <div className={`mt-4 p-4 rounded-xl ${isDark ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-amber-50 border border-amber-200'}`}>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                </div>
                <div>
                  <p className={`text-xs font-bold text-amber-500 mb-1`}>Важно!</p>
                  <p className={`text-xs ${textMuted} leading-relaxed`}>
                    Убедитесь, что выбрали верную сеть при переводе актива — перевод в неверной сети может быть безвозвратно потерян. Ответственный за сообщество проверит поступление средств в пул и внесёт соответствующую запись.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Шаг 6 — Подтверждение кошелька */}
          <div className="space-y-3">
            {renderHeading(6, <Wallet className="w-4 h-4" />, 'Подтверждение кошелька', 'Нажмите «Выбрать» под нужным кошельком — адрес подставится автоматически')}
            <div className="relative">
              <input
                type="text"
                value={receivedWallet}
                onChange={(e) => {
                  setReceivedWallet(e.target.value)
                  setSelectedWalletId(null)
                }}
                disabled={!canEdit}
                list="pool-wallet-datalist"
                placeholder="Адрес кошелька, на который поступили средства"
                className={`w-full px-4 py-3.5 pr-11 rounded-xl border ${bgInput} ${textMain} placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4C7F6E]/50 transition-all disabled:opacity-50`}
              />
              {receivedWallet.trim() ? (
                <div className={`absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center ${
                  matchedWallets.length ? 'bg-emerald-500/20 text-emerald-500' : 'bg-amber-500/20 text-amber-500'
                }`}>
                  {matchedWallets.length ? <Check className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                </div>
              ) : (
                <div className={`absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center ${isDark ? 'bg-white/10 text-gray-500' : 'bg-gray-100 text-gray-400'}`}>
                  <Wallet className="w-3 h-3" />
                </div>
              )}
            </div>
            <datalist id="pool-wallet-datalist">
              {ALL_POOL_WALLETS.map(wallet => (
                <option key={wallet.id} value={wallet.address}>{wallet.name} · {wallet.network}</option>
              ))}
            </datalist>
            {receivedWallet.trim() && (
              matchedWallets.length > 0 ? (
                <div className="flex items-center gap-2 text-xs font-medium text-emerald-500">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>Адрес совпадает с кошельком пула: {matchedWallets.map(w => w.name).join(', ')}</span>
                </div>
              ) : (
                <div className="flex items-start gap-2 text-xs font-medium text-amber-500">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>Адрес не найден в списке кошельков пула. Убедитесь, что вы перевели средства на верный адрес.</span>
                </div>
              )
            )}
          </div>

          {/* User Info */}
          <div className="flex items-center justify-between pt-2">
            <span className={`text-sm ${textMuted}`}>
              Автор: <span className="font-bold text-[#4C7F6E]">{userNickname}</span>
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className={`relative z-10 flex items-center gap-3 p-6 border-t ${borderMain}`}>
          <button
            type="button"
            onClick={onClose}
            className={`flex-1 px-4 py-3.5 rounded-xl font-bold transition-all ${
              isDark 
                ? 'bg-white/5 hover:bg-white/10 text-gray-400 border border-white/10' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600 border border-gray-200'
            }`}
          >
            Отмена
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-gradient-to-r from-[#4C7F6E] to-[#3d6660] text-white font-bold shadow-lg shadow-[#4C7F6E]/30 hover:shadow-[#4C7F6E]/50 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Сохранение...</span>
              </>
            ) : (
              <>
                <DollarSign className="w-5 h-5" />
                <span>{isEditing ? 'Сохранить' : 'Добавить'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
