import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useAdminStore } from '@/store/adminStore'
import { useThemeStore } from '@/store/themeStore'
import { addApprovalRequest } from '@/services/firestoreService'
import { formatDate } from '@/utils/dateUtils'
import { getUserNicknameSync } from '@/utils/userUtils'
import { EARNINGS_CATEGORY_META, Earnings, EarningsCategory } from '@/types'
import { X, Rocket, LineChart, Image, Coins, BarChart3, ShieldCheck, Sparkles, Gift, Wallet, Repeat, HeartHandshake, DollarSign, Calculator, Calendar, Briefcase, Copy, Check, LinkIcon } from 'lucide-react'
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
  'funds'
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
  other: <Sparkles className="w-5 h-5" />,
}

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
  const [transactionHash, setTransactionHash] = useState(editingEarning?.transactionHash || '')
  const [receivedWallet, setReceivedWallet] = useState(editingEarning?.receivedWallet || '')
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

  // Calculate values
  const numericAmount = parseFloat(amount || '0')
  const numericExtraWalletsCount = parseInt(extraWalletsCount || '0', 10)
  
  const totalEarnings = calculateTotalEarnings(numericAmount, walletType, numericExtraWalletsCount)
  const { poolShare, percent } = calculatePoolShare(totalEarnings, category, walletType)

  const calculatePerParticipant = () => {
    const participants = isEditing && editingEarning 
      ? (editingEarning.participants?.length ? editingEarning.participants : [editingEarning.userId])
      : [user?.id || '']
    if (!participants.length) return 0
    return Math.max(totalEarnings - poolShare, 0) / participants.length
  }

  const perParticipant = calculatePerParticipant()

  const canEdit = !isEditing || (isAdmin && editingEarning?.status === 'pending')

  const handleSave = async () => {
    if (!amount || !user?.id) {
      setError('Пожалуйста, заполните все обязательные поля')
      return
    }

    if (!transactionHash.trim()) {
      setError('Пожалуйста, укажите хэш транзакции или ссылку')
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
        transactionHash: transactionHash.trim(),
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
        <div className="relative z-10 p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-180px)]">
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
              <p className="text-sm text-red-400 font-medium">{error}</p>
            </div>
          )}

          {/* Date */}
          <div className="space-y-2">
            <label className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${textMuted}`}>
              <Calendar className="w-4 h-4" />
              Дата
            </label>
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

          {/* Category */}
          <div className="space-y-3">
            <label className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${textMuted}`}>
              <Rocket className="w-4 h-4" />
              Сфера деятельности
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
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

          {/* Wallet Type - визуально скрыто, всегда используется 'general' логику */}
          {/* Кнопка "Пул" перемещена ниже */}

          {/* Amount Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Amount Input */}
            <div className="space-y-3">
              <label className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${textMuted}`}>
                <Calculator className="w-4 h-4" />
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

          {/* Transaction Hash */}
          <div className="space-y-2">
            <label className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${textMuted}`}>
              <LinkIcon className="w-4 h-4" />
              Хэш транзакции или ссылка <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={transactionHash}
              onChange={(e) => setTransactionHash(e.target.value)}
              disabled={!canEdit}
              placeholder="Например: 0x123abc... или https://solscan.io/tx/..."
              className={`w-full px-4 py-3.5 rounded-xl border ${bgInput} ${textMain} placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4C7F6E]/50 transition-all disabled:opacity-50`}
            />
            <p className={`text-[10px] ${textMuted}`}>
              Укажите хэш транзакции или ссылку на блокчейн-эксплорер (Solscan, Etherscan, Tronscan и т.д.)
            </p>
          </div>

          {/* Received Wallet */}
          <div className="space-y-2">
            <label className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${textMuted}`}>
              <Wallet className="w-4 h-4" />
              Кошелек Пула <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={receivedWallet}
              onChange={(e) => setReceivedWallet(e.target.value)}
              disabled={!canEdit}
              placeholder="Адрес кошелька, на который поступили средства"
              className={`w-full px-4 py-3.5 rounded-xl border ${bgInput} ${textMain} placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4C7F6E]/50 transition-all disabled:opacity-50`}
            />
            <p className={`text-[10px] ${textMuted}`}>
              Укажите адрес кошелька, на который были отправлены средства в пул
            </p>
          </div>

          {/* Summary Card */}
          <div className={`p-5 rounded-2xl border ${borderMain} bg-gradient-to-br ${isDark ? 'from-white/5 to-transparent' : 'from-gray-50 to-transparent'}`}>
            <div className="flex items-center justify-between mb-4">
              <span className={`text-xs font-bold uppercase tracking-wider ${textMuted}`}>Расчёт</span>
              <div className={`px-2 py-1 rounded-lg text-xs font-bold bg-[#4C7F6E]/20 text-[#4C7F6E]`}>
                {(percent * 100).toFixed(0)}% в пул
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col">
                <span className={`text-xs ${textMuted}`}>Общий результат:</span>
                <span className={`text-base font-bold ${textMain}`}>{totalEarnings.toLocaleString()} ₽</span>
              </div>
              <div className="flex flex-col">
                <span className={`text-xs ${textMuted}`}>В пул:</span>
                <span className="text-base font-bold text-red-400">-{poolShare.toFixed(2)} ₽</span>
              </div>
              <div className="flex flex-col pt-3 md:pt-0">
                <span className={`text-xs font-medium ${textMain}`}>Чистый доход:</span>
                <span className="text-lg font-black text-emerald-400">{perParticipant.toFixed(2)} ₽</span>
              </div>
            </div>
          </div>

          {/* Wallet Information */}
          <div className={`p-5 rounded-2xl border ${borderMain} bg-gradient-to-br ${isDark ? 'from-amber-500/5 to-transparent' : 'from-amber-50 to-transparent'}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h3 className={`text-sm font-black uppercase tracking-wider ${textMain}`}>Кошельки для перевода доли в пул</h3>
                <p className={`text-xs ${textMuted}`}>После расчёта перечислите сумму, указанную в "В пул" на адрес, соответствующей активу и сети</p>
              </div>
            </div>

            <div className="space-y-3">
              {/* Cryptocurrency Wallets */}
              <div className={`p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-white border border-gray-200'}`}>
                <p className={`text-xs font-bold uppercase mb-3 ${textMuted}`}>Криптовалюты</p>
                <div className="space-y-2">
                  {/* SOL */}
                  <div className={`flex items-center justify-between p-2.5 rounded-lg ${isDark ? 'bg-black/20' : 'bg-gray-50'}`}>
                    <span className={`text-xs font-medium ${textMain}`}>SOL</span>
                    <div className="flex items-center gap-2">
                      <code 
                        onClick={() => copyWallet('ArcYzhj7aqMW6HTLhbRwCB3bLFpZ1k1M79SGM1RZtciE', 'sol')}
                        className={`text-[10px] font-mono px-2 py-1 rounded cursor-pointer transition-all ${
                          isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                      >
                        ArcYzhj7aqMW6HTLhbRwCB3bLFpZ1k1M79SGM1RZtciE
                      </code>
                      <button
                        onClick={() => copyWallet('ArcYzhj7aqMW6HTLhbRwCB3bLFpZ1k1M79SGM1RZtciE', 'sol')}
                        className={`p-1.5 rounded-lg transition-all ${
                          copiedWallets.has('sol')
                            ? 'bg-emerald-500/20 text-emerald-500'
                            : isDark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-300 text-gray-500'
                        }`}
                      >
                        {copiedWallets.has('sol') ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* USDT TON */}
                  <div className={`flex items-center justify-between p-2.5 rounded-lg ${isDark ? 'bg-black/20' : 'bg-gray-50'}`}>
                    <span className={`text-xs font-medium ${textMain}`}>USDT (TON)</span>
                    <div className="flex items-center gap-2">
                      <code 
                        onClick={() => copyWallet('UQBbODsjSkrMAQ-u_W8H57pKC263lVjxeUWIKmBemwOGnHVV', 'usdt-ton')}
                        className={`text-[10px] font-mono px-2 py-1 rounded cursor-pointer transition-all ${
                          isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                      >
                        UQBbODsjSkrMAQ-u_W8H57pKC263lVjxeUWIKmBemwOGnHVV
                      </code>
                      <button
                        onClick={() => copyWallet('UQBbODsjSkrMAQ-u_W8H57pKC263lVjxeUWIKmBemwOGnHVV', 'usdt-ton')}
                        className={`p-1.5 rounded-lg transition-all ${
                          copiedWallets.has('usdt-ton')
                            ? 'bg-emerald-500/20 text-emerald-500'
                            : isDark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-300 text-gray-500'
                        }`}
                      >
                        {copiedWallets.has('usdt-ton') ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* USDT TRON */}
                  <div className={`flex items-center justify-between p-2.5 rounded-lg ${isDark ? 'bg-black/20' : 'bg-gray-50'}`}>
                    <span className={`text-xs font-medium ${textMain}`}>USDT (TRON)</span>
                    <div className="flex items-center gap-2">
                      <code 
                        onClick={() => copyWallet('TLfHswhB8CreaKVJHaYeR3xxxkfEZLTbmb', 'usdt-tron')}
                        className={`text-[10px] font-mono px-2 py-1 rounded cursor-pointer transition-all ${
                          isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                      >
                        TLfHswhB8CreaKVJHaYeR3xxxkfEZLTbmb
                      </code>
                      <button
                        onClick={() => copyWallet('TLfHswhB8CreaKVJHaYeR3xxxkfEZLTbmb', 'usdt-tron')}
                        className={`p-1.5 rounded-lg transition-all ${
                          copiedWallets.has('usdt-tron')
                            ? 'bg-emerald-500/20 text-emerald-500'
                            : isDark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-300 text-gray-500'
                        }`}
                      >
                        {copiedWallets.has('usdt-tron') ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* TON */}
                  <div className={`flex items-center justify-between p-2.5 rounded-lg ${isDark ? 'bg-black/20' : 'bg-gray-50'}`}>
                    <span className={`text-xs font-medium ${textMain}`}>TON</span>
                    <div className="flex items-center gap-2">
                      <code 
                        onClick={() => copyWallet('UQBbODsjSkrMAQ-u_W8H57pKC263lVjxeUWIKmBemwOGnHVV', 'ton')}
                        className={`text-[10px] font-mono px-2 py-1 rounded cursor-pointer transition-all ${
                          isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                      >
                        UQBbODsjSkrMAQ-u_W8H57pKC263lVjxeUWIKmBemwOGnHVV
                      </code>
                      <button
                        onClick={() => copyWallet('UQBbODsjSkrMAQ-u_W8H57pKC263lVjxeUWIKmBemwOGnHVV', 'ton')}
                        className={`p-1.5 rounded-lg transition-all ${
                          copiedWallets.has('ton')
                            ? 'bg-emerald-500/20 text-emerald-500'
                            : isDark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-300 text-gray-500'
                        }`}
                      >
                        {copiedWallets.has('ton') ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* BTC */}
                  <div className={`flex items-center justify-between p-2.5 rounded-lg ${isDark ? 'bg-black/20' : 'bg-gray-50'}`}>
                    <span className={`text-xs font-medium ${textMain}`}>BTC</span>
                    <div className="flex items-center gap-2">
                      <code 
                        onClick={() => copyWallet('bc1ql3277lsmdj32he06tugqf8c0p0zr8hda3t6kzt', 'btc')}
                        className={`text-[10px] font-mono px-2 py-1 rounded cursor-pointer transition-all ${
                          isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                      >
                        bc1ql3277lsmdj32he06tugqf8c0p0zr8hda3t6kzt
                      </code>
                      <button
                        onClick={() => copyWallet('bc1ql3277lsmdj32he06tugqf8c0p0zr8hda3t6kzt', 'btc')}
                        className={`p-1.5 rounded-lg transition-all ${
                          copiedWallets.has('btc')
                            ? 'bg-emerald-500/20 text-emerald-500'
                            : isDark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-300 text-gray-500'
                        }`}
                      >
                        {copiedWallets.has('btc') ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* ETH */}
                  <div className={`flex items-center justify-between p-2.5 rounded-lg ${isDark ? 'bg-black/20' : 'bg-gray-50'}`}>
                    <span className={`text-xs font-medium ${textMain}`}>ETH</span>
                    <div className="flex items-center gap-2">
                      <code 
                        onClick={() => copyWallet('0x7aBF66CBD4734ddfe093dD7E065beada94A11a95', 'eth')}
                        className={`text-[10px] font-mono px-2 py-1 rounded cursor-pointer transition-all ${
                          isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                      >
                        0x7aBF66CBD4734ddfe093dD7E065beada94A11a95
                      </code>
                      <button
                        onClick={() => copyWallet('0x7aBF66CBD4734ddfe093dD7E065beada94A11a95', 'eth')}
                        className={`p-1.5 rounded-lg transition-all ${
                          copiedWallets.has('eth')
                            ? 'bg-emerald-500/20 text-emerald-500'
                            : isDark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-300 text-gray-500'
                        }`}
                      >
                        {copiedWallets.has('eth') ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* USDC ETH */}
                  <div className={`flex items-center justify-between p-2.5 rounded-lg ${isDark ? 'bg-black/20' : 'bg-gray-50'}`}>
                    <span className={`text-xs font-medium ${textMain}`}>USDC (ETH)</span>
                    <div className="flex items-center gap-2">
                      <code 
                        onClick={() => copyWallet('0x7aBF66CBD4734ddfe093dD7E065beada94A11a95', 'usdc-eth')}
                        className={`text-[10px] font-mono px-2 py-1 rounded cursor-pointer transition-all ${
                          isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                      >
                        0x7aBF66CBD4734ddfe093dD7E065beada94A11a95
                      </code>
                      <button
                        onClick={() => copyWallet('0x7aBF66CBD4734ddfe093dD7E065beada94A11a95', 'usdc-eth')}
                        className={`p-1.5 rounded-lg transition-all ${
                          copiedWallets.has('usdc-eth')
                            ? 'bg-emerald-500/20 text-emerald-500'
                            : isDark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-300 text-gray-500'
                        }`}
                      >
                        {copiedWallets.has('usdc-eth') ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* USDC SOL */}
                  <div className={`flex items-center justify-between p-2.5 rounded-lg ${isDark ? 'bg-black/20' : 'bg-gray-50'}`}>
                    <span className={`text-xs font-medium ${textMain}`}>USDC (SOL)</span>
                    <div className="flex items-center gap-2">
                      <code 
                        onClick={() => copyWallet('7cGdsTHxFhxEiT92g4CFsoXbvJHic2cWuiWSB4pJRYgE', 'usdc-sol')}
                        className={`text-[10px] font-mono px-2 py-1 rounded cursor-pointer transition-all ${
                          isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                      >
                        7cGdsTHxFhxEiT92g4CFsoXbvJHic2cWuiWSB4pJRYgE
                      </code>
                      <button
                        onClick={() => copyWallet('7cGdsTHxFhxEiT92g4CFsoXbvJHic2cWuiWSB4pJRYgE', 'usdc-sol')}
                        className={`p-1.5 rounded-lg transition-all ${
                          copiedWallets.has('usdc-sol')
                            ? 'bg-emerald-500/20 text-emerald-500'
                            : isDark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-300 text-gray-500'
                        }`}
                      >
                        {copiedWallets.has('usdc-sol') ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* TRX */}
                  <div className={`flex items-center justify-between p-2.5 rounded-lg ${isDark ? 'bg-black/20' : 'bg-gray-50'}`}>
                    <span className={`text-xs font-medium ${textMain}`}>TRX</span>
                    <div className="flex items-center gap-2">
                      <code 
                        onClick={() => copyWallet('TLfHswhB8CreaKVJHaYeR3xxxkfEZLTbmb', 'trx')}
                        className={`text-[10px] font-mono px-2 py-1 rounded cursor-pointer transition-all ${
                          isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                      >
                        TLfHswhB8CreaKVJHaYeR3xxxkfEZLTbmb
                      </code>
                      <button
                        onClick={() => copyWallet('TLfHswhB8CreaKVJHaYeR3xxxkfEZLTbmb', 'trx')}
                        className={`p-1.5 rounded-lg transition-all ${
                          copiedWallets.has('trx')
                            ? 'bg-emerald-500/20 text-emerald-500'
                            : isDark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-300 text-gray-500'
                        }`}
                      >
                        {copiedWallets.has('trx') ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* BNB */}
                  <div className={`flex items-center justify-between p-2.5 rounded-lg ${isDark ? 'bg-black/20' : 'bg-gray-50'}`}>
                    <span className={`text-xs font-medium ${textMain}`}>BNB</span>
                    <div className="flex items-center gap-2">
                      <code 
                        onClick={() => copyWallet('0x7aBF66CBD4734ddfe093dD7E065beada94A11a95', 'bnb')}
                        className={`text-[10px] font-mono px-2 py-1 rounded cursor-pointer transition-all ${
                          isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                      >
                        0x7aBF66CBD4734ddfe093dD7E065beada94A11a95
                      </code>
                      <button
                        onClick={() => copyWallet('0x7aBF66CBD4734ddfe093dD7E065beada94A11a95', 'bnb')}
                        className={`p-1.5 rounded-lg transition-all ${
                          copiedWallets.has('bnb')
                            ? 'bg-emerald-500/20 text-emerald-500'
                            : isDark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-300 text-gray-500'
                        }`}
                      >
                        {copiedWallets.has('bnb') ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fiat Information */}
              <div className={`p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-white border border-gray-200'}`}>
                <p className={`text-xs font-bold uppercase mb-3 ${textMuted}`}>Фиатные валюты</p>
                <div className={`p-4 rounded-lg border-2 ${isDark ? 'bg-blue-500/10 border-blue-500/40' : 'bg-blue-50 border-blue-300'}`}>
                  <p className={`text-sm font-bold mb-3 ${textMain}`}>
                    Для перевода фиата конвертируйте его в USDT и отправьте на один из кошельков:
                  </p>
                  <div className="space-y-2">
                    <div className={`flex items-center justify-between p-2 rounded ${isDark ? 'bg-black/20' : 'bg-white'}`}>
                      <span className={`text-xs font-semibold ${textMain}`}>USDT (TON)</span>
                      <div className="flex items-center gap-2">
                        <code 
                          onClick={() => copyWallet('UQBbODsjSkrMAQ-u_W8H57pKC263lVjxeUWIKmBemwOGnHVV', 'fiat-usdt-ton')}
                          className={`text-[10px] font-mono px-2 py-1 rounded cursor-pointer transition-all ${
                            isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-200 hover:bg-gray-300'
                          }`}
                        >
                          UQBbODsjSkrMAQ-u_W8H57pKC263lVjxeUWIKmBemwOGnHVV
                        </code>
                        <button
                          onClick={() => copyWallet('UQBbODsjSkrMAQ-u_W8H57pKC263lVjxeUWIKmBemwOGnHVV', 'fiat-usdt-ton')}
                          className={`p-1 rounded transition-all ${
                            copiedWallets.has('fiat-usdt-ton')
                              ? 'bg-emerald-500/20 text-emerald-500'
                              : isDark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-300 text-gray-500'
                          }`}
                        >
                          {copiedWallets.has('fiat-usdt-ton') ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className={`flex items-center justify-between p-2 rounded ${isDark ? 'bg-black/20' : 'bg-white'}`}>
                      <span className={`text-xs font-semibold ${textMain}`}>USDT (TRON)</span>
                      <div className="flex items-center gap-2">
                        <code 
                          onClick={() => copyWallet('TLfHswhB8CreaKVJHaYeR3xxxkfEZLTbmb', 'fiat-usdt-tron')}
                          className={`text-[10px] font-mono px-2 py-1 rounded cursor-pointer transition-all ${
                            isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-200 hover:bg-gray-300'
                          }`}
                        >
                          TLfHswhB8CreaKVJHaYeR3xxxkfEZLTbmb
                        </code>
                        <button
                          onClick={() => copyWallet('TLfHswhB8CreaKVJHaYeR3xxxkfEZLTbmb', 'fiat-usdt-tron')}
                          className={`p-1 rounded transition-all ${
                            copiedWallets.has('fiat-usdt-tron')
                              ? 'bg-emerald-500/20 text-emerald-500'
                              : isDark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-300 text-gray-500'
                          }`}
                        >
                          {copiedWallets.has('fiat-usdt-tron') ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Important Warning */}
              <div className={`p-4 rounded-xl ${isDark ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-amber-50 border border-amber-200'}`}>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <p className={`text-xs font-bold text-amber-500 mb-1`}>Важно!</p>
                    <p className={`text-xs ${textMuted}`}>
                      Убедитесь, что выбрали верную сеть при переводе актива. Ответственный за сообщество проверит поступление средств в пул и внесёт соответствующую запись.
                    </p>
                  </div>
                </div>
              </div>
            </div>
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
