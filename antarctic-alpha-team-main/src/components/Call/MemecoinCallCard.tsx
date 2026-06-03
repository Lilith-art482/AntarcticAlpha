import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { Call, MemecoinSignalFields } from '@/types'
import { Copy, Edit, Trash2, CheckCircle2, XCircle, History, ExternalLink, TrendingUp, TrendingDown, RefreshCw, Zap, Target, Send, BarChart3, Clock, Share2, Calculator, X } from 'lucide-react'
import { formatMarketCap } from '@/components/Call/CallForm'
import { getNetworkInfo } from '@/components/Call/CallForm'
import { updateMemecoinCallData } from '@/services/firestoreService'

interface MemecoinCallCardProps {
  call: Call
  isAdmin: boolean
  onUpdateStatus: (callId: string, status: 'active' | 'completed' | 'cancelled') => void
  onUpdateCall?: (callId: string, updates: Partial<Call>) => void
  onEdit: (call: Call) => void
  onDelete: (callId: string) => void
  onShare?: (callId: string) => void
  traderName?: string
  traderAvatar?: string
}

// Бейдж для типа стратегии
const StrategyBadge = ({ strategy }: { strategy: string }) => {
  const strategies: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
    flip: { label: 'Флип', icon: <Zap className="w-2.5 h-2.5" />, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    medium: { label: 'Среднесрок', icon: <Target className="w-2.5 h-2.5" />, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    long: { label: 'Дальнесрок', icon: <Target className="w-2.5 h-2.5" />, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
  }

  const config = strategies[strategy] || strategies.medium

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${config.color}`}>
      {config.icon}
      {config.label}
    </span>
  )
}

export const MemecoinCallCard = ({
  call,
  isAdmin,
  onUpdateStatus,
  onUpdateCall,
  onEdit,
  onDelete,
  onShare,
  traderName,
  traderAvatar,
}: MemecoinCallCardProps) => {
  const { theme } = useThemeStore()
  const { user } = useAuthStore()
  const [copied, setCopied] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [showCalculator, setShowCalculator] = useState(false)
  const [investmentAmount, setInvestmentAmount] = useState<string>('')

  const details = (call.details?.memecoins || {}) as MemecoinSignalFields

  // Комиссии по сетям (вход + выход)
  const networkFees: Record<string, number> = {
    solana: 2,      // 1% вход + 1% выход
    ethereum: 3.5,  // 2% вход + 1.5% выход
    bsc: 2,         // 1% вход + 1% выход
    ton: 2.5,       // 1.5% вход + 1% выход
    base: 2.5,      // 1.5% вход + 1% выход
    sui: 2,         // 1% вход + 1% выход
    monad: 2,       // 1% вход + 1% выход
    polygon: 2,     // 1% вход + 1% выход
  }
  
  const feePercent = networkFees[details.network || 'solana'] || 2
  
  // Расчёты калькулятора
  const maxProfit = call.maxProfit || 0
  const amount = parseFloat(investmentAmount) || 0
  const grossProfit = amount * (maxProfit / 100) // Грязная прибыль
  const netProfit = grossProfit - (amount * (feePercent / 100)) // Чистая прибыль (за вычетом комиссий)
  const totalReturn = amount + netProfit // Общая сумма на выход

  const networkInfo = details.network ? getNetworkInfo(details.network) : null
  const tokenSymbol = details.tokenSymbol || details.contract?.slice(0, 4).toUpperCase() || '???'
  const tokenLogo = details.tokenLogo

  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const subtleColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
  const cardBg = theme === 'dark' ? 'bg-[#0f141a]' : 'bg-white'
  const borderColor = theme === 'dark' ? 'border-white/10' : 'border-gray-200'

  // Обновление данных токена
  const handleUpdateData = async () => {
    if (!details.contract || updating) return

    setUpdating(true)
    try {
      const result = await updateMemecoinCallData(call.id, details.contract)

      if (result && onUpdateCall) {
        // Обновляем карточку через родительский компонент
        onUpdateCall(call.id, {
          currentMarketCap: result.currentMarketCap,
          currentPnL: result.currentPnL,
          maxProfit: result.maxProfit,
          tokenPair: result.tokenPair,
        })

        // Если статус изменился, обновляем и его
        if (result.status && result.status !== call.status) {
          onUpdateCall(call.id, {
            status: result.status as 'active' | 'completed' | 'cancelled',
          })
        }
      }
    } catch (error) {
      console.error('Error updating call data:', error)
    } finally {
      setUpdating(false)
    }
  }

  // Форматирование profit
  const formatProfit = (profit?: number) => {
    if (!profit) return '0%'
    if (profit < 0) return `${profit.toFixed(2)}%`
    return `+${profit.toFixed(2)}%`
  }

  // GMGN URL
  const getGmgnUrl = () => {
    if (!details.contract) return '#'
    const network = details.network || 'solana'
    const networkMap: Record<string, string> = {
      solana: 'sol',
      ethereum: 'eth',
      bsc: 'bsc',
      ton: 'ton',
      base: 'base',
      sui: 'sui',
      monad: 'monad',
      polygon: 'polygon',
    }
    return `https://gmgn.ai/${networkMap[network] || 'sol'}/token/${details.contract}`
  }

  // Fasol URL
  const getFasolUrl = () => {
    if (!details.contract) return '#'
    return `https://t.me/fasolbot/directlink?startapp=ca_${details.contract}_ref_artyommedoed`
  }

  // Время публикации (publishedAt или createdAt для совместимости)
  const publishedAt = call.publishedAt || call.createdAt
  const publishedDate = publishedAt ? new Date(publishedAt) : null

  // Таймер до автозавершения
  const [timeLeft, setTimeLeft] = useState<string>('')

  useEffect(() => {
    if (!publishedAt || call.status !== 'active') {
      setTimeLeft('')
      return
    }

    const strategy = details.holdPlan
    const timeLimits: Record<string, number> = {
      flip: 24 * 60 * 60 * 1000,      // 24 часа
      medium: 30 * 24 * 60 * 60 * 1000, // 30 дней
      long: 60 * 24 * 60 * 60 * 1000,   // 60 дней
    }
    const limit = timeLimits[strategy] || timeLimits.medium
    const publishedTime = new Date(publishedAt).getTime()
    const endTime = publishedTime + limit

    const updateTimer = () => {
      const now = Date.now()
      const remaining = endTime - now

      if (remaining <= 0) {
        setTimeLeft('0ч 0м')
        return
      }

      const days = Math.floor(remaining / (24 * 60 * 60 * 1000))
      const hours = Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))
      const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000))

      if (days > 0) {
        setTimeLeft(`${days}д ${hours}ч`)
      } else if (hours > 0) {
        setTimeLeft(`${hours}ч ${minutes}м`)
      } else {
        setTimeLeft(`${minutes}м`)
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 60000) // Обновляем каждую минуту

    return () => clearInterval(interval)
  }, [publishedAt, call.status, details.holdPlan])

  const isOverdue = timeLeft === '0ч 0м' || timeLeft === '0м'

  // Форматирование даты публикации: дата / время (ЧЧ:ММ:СС)
  const formatPublishedDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')
    return `${day}.${month}.${year} / ${hours}:${minutes}:${seconds}`
  }

  const handleCopyAddress = () => {
    if (details.contract) {
      navigator.clipboard.writeText(details.contract)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const isAuthorOrAdmin = isAdmin || user?.id === call.userId

 return (
<div
 className={`relative z-10 p-5 rounded-2xl border ${borderColor} ${cardBg} shadow-lg hover:shadow-xl transition-all ${call.status !== 'active' ? 'opacity-60' : ''}`}
 >
 {/* Верхняя цветная линия */}
<div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-teal-400 via-cyan-500 to-emerald-400 opacity-80 rounded-t-2xl" />

 {/* Плашка со сферой */}
      <div className="absolute top-4 left-4">
        <span className="text-[10px] px-2 py-1 rounded-lg font-bold uppercase tracking-wider bg-[#4C7F6E]/10 text-[#4C7F6E] border border-[#4C7F6E]/20">
          Мемкоины
        </span>
      </div>

      {/* Статус сигнала */}
      {call.status === 'completed' && (
        <div className="absolute top-4 right-4">
          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-[#4C7F6E]/10 text-[#4C7F6E] px-2 py-1 rounded-full">
            <CheckCircle2 className="w-3 h-3" />
            Завершен
          </span>
        </div>
      )}
      {call.status === 'cancelled' && (
        <div className="absolute top-4 right-4">
          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-500 px-2 py-1 rounded-full">
            <XCircle className="w-3 h-3" />
            Отменен
          </span>
        </div>
      )}

      {/* Верхняя часть: логотип токена + логотип сети + название */}
      <div className="mt-10 mb-4">
        <div className="flex items-center gap-3">
          {/* Логотип токена с логотипом сети */}
          <div className="relative w-16 h-16 shrink-0">
            {/* Логотип токена - круглый */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#4C7F6E]/10 to-[#4C7F6E]/10 border border-[#4C7F6E]/20 flex items-center justify-center overflow-hidden">
              {tokenLogo ? (
                <img src={tokenLogo} alt={tokenSymbol} className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-bold text-[#4C7F6E]">{tokenSymbol.slice(0, 2)}</span>
              )}
            </div>
            {/* Логотип сети в кружочке */}
            {networkInfo && (
              <div className="absolute -bottom-1 -left-1 w-7 h-7 rounded-full bg-[#121212] border-2 border-[#0f141a] flex items-center justify-center overflow-hidden">
                {networkInfo.logoUrl ? (
                  <img src={networkInfo.logoUrl} alt={networkInfo.name} className="w-5 h-5 object-contain" />
                ) : (
                  <span className="text-xs">{networkInfo.logo}</span>
                )}
              </div>
            )}
          </div>

          {/* Название токена */}
          <div className="flex-1 min-w-0">
            <h3 className={`text-xl font-black ${textColor} truncate`}>{tokenSymbol}</h3>
            <div className="flex items-center gap-2">
              {networkInfo && (
                <p className={`text-sm ${subtleColor}`}>{networkInfo.name}</p>
              )}
              {/* Тип стратегии */}
              {details.holdPlan && (
                <>
                  {networkInfo && <span className={`text-sm ${subtleColor}`}>•</span>}
                  <StrategyBadge strategy={details.holdPlan} />
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Адрес с копированием и GMGN */}
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <a
            href={getGmgnUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex-1 px-3 py-2 rounded-lg border ${borderColor} ${theme === 'dark' ? 'bg-gray-800/50 hover:bg-gray-700/50' : 'bg-gray-50 hover:bg-gray-100'} transition-colors flex items-center gap-2 group`}
          >
            <span className={`text-xs font-mono ${textColor} truncate`}>
              {details.contract || 'Нет адреса'}
            </span>
            <ExternalLink className="w-3 h-3 shrink-0 text-gray-400 group-hover:text-[#4C7F6E] transition-colors" />
          </a>
          <button
            onClick={handleCopyAddress}
            className={`p-2 rounded-lg border ${borderColor} ${theme === 'dark' ? 'bg-gray-800/50 hover:bg-gray-700/50' : 'bg-gray-50 hover:bg-gray-100'} transition-colors`}
            title="Скопировать адрес"
          >
            <Copy className={`w-4 h-4 ${copied ? 'text-[#4C7F6E]' : 'text-gray-400'}`} />
          </button>
        </div>
      </div>

      {/* Комментарий трейдера и АО */}
      {(() => {
        const comment = details.traderComment || ''
        // АО-маркеры
        const aoMarkers = [
          'АО: проверь время сигнала!',
          'Не ИИР, проводите собственный анализ!',
          'Не ИИР, проводите самостоятельный анализ!',
          'АО: Решай на лету — или проходи'
        ]
        // Ищем позицию первого АО-маркера
        const aoPosition = aoMarkers.reduce((minPos, marker) => {
          const pos = comment.indexOf(marker)
          if (pos === -1) return minPos
          return minPos === -1 ? pos : Math.min(minPos, pos)
        }, -1)
        
        // Разделяем комментарий и АО
        const traderCommentPart = aoPosition === -1 ? comment : comment.slice(0, aoPosition).trim()
        const aoPart = aoPosition === -1 ? '' : comment.slice(aoPosition).trim()
        
        // Для memecoins: если есть комментарий - показываем его + АО, если нет - показываем чисто АО
        if (aoPart) {
          return (
            <div className="mb-4 p-3 rounded-xl border border-[#4C7F6E]/20 bg-[#4C7F6E]/5">
              {traderCommentPart && (
                <>
                  <p className={`text-sm ${textColor} whitespace-pre-wrap mb-2`}>{traderCommentPart}</p>
                  <div className="border-t border-[#4C7F6E]/20 pt-2" />
                </>
              )}
              <p className={`text-sm ${textColor} whitespace-pre-wrap`}>{aoPart}</p>
            </div>
          )
        }
        
        // Если нет АО, показываем комментарий как есть
        if (comment) {
          return (
            <div className="mb-4 p-3 rounded-xl border border-[#4C7F6E]/20 bg-[#4C7F6E]/5">
              <p className={`text-sm ${textColor} whitespace-pre-wrap`}>{comment}</p>
            </div>
          )
        }
        
        return null
      })()}

      {/* CALL MC, Current PnL и Profit */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="p-3 rounded-xl border border-gray-200/30 dark:border-white/10 bg-gray-50/50 dark:bg-white/5">
          <p className={`text-[10px] uppercase tracking-wider ${subtleColor} mb-1`}>CALL MC</p>
          <p className={`text-lg font-bold ${textColor}`}>
            {call.signalMarketCap ? formatMarketCap(call.signalMarketCap) : '—'}
          </p>
        </div>
        <div className="p-3 rounded-xl border border-gray-200/30 dark:border-white/10 bg-gray-50/50 dark:bg-white/5">
          <p className={`text-[10px] uppercase tracking-wider ${subtleColor} mb-1`}>Current MC</p>
          <div className="flex items-center gap-2">
            {call.currentMarketCap ? (
              <>
                <p className={`text-lg font-bold ${textColor}`}>
                  {formatMarketCap(call.currentMarketCap)}
                </p>
                {call.currentPnL !== undefined && call.currentPnL !== 0 && (
                  <span className={`text-xs font-medium ${call.currentPnL > 0 ? 'text-[#4C7F6E]' : 'text-rose-400'}`}>
                    ({call.currentPnL > 0 ? '+' : ''}{formatProfit(call.currentPnL)})
                  </span>
                )}
              </>
            ) : (
              <p className={`text-lg font-bold ${textColor}`}>—</p>
            )}
          </div>
        </div>
        <div className="p-3 rounded-xl border border-gray-200/30 dark:border-white/10 bg-gray-50/50 dark:bg-white/5">
          <div className="flex items-center justify-between mb-1">
            <p className={`text-[10px] uppercase tracking-wider ${subtleColor}`}>Max Profit</p>
            {/* Кнопка обновления */}
            {call.status === 'active' && details.contract && (
              <button
                onClick={handleUpdateData}
                disabled={updating}
                className={`p-1 rounded transition-colors ${theme === 'dark' ? 'hover:bg-[#4C7F6E]/20 text-[#4C7F6E]' : 'hover:bg-[#4C7F6E]/10 text-[#4C7F6E]'} ${updating ? 'opacity-50 cursor-not-allowed' : ''}`}
                title="Обновить данные"
              >
                <RefreshCw className={`w-3 h-3 ${updating ? 'animate-spin' : ''}`} />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            {call.maxProfit !== undefined && call.maxProfit !== 0 ? (
              <>
                {call.maxProfit > 0 ? (
                  <TrendingUp className="w-4 h-4 text-[#4C7F6E]" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-rose-400" />
                )}
                <p className={`text-lg font-bold ${call.maxProfit > 0 ? 'text-[#4C7F6E]' : 'text-rose-400'}`}>
                  {formatProfit(call.maxProfit)}
                </p>
              </>
            ) : (
              <p className={`text-lg font-bold ${textColor}`}>0%</p>
            )}
          </div>
        </div>
      </div>

      {/* Кнопки торговых терминалов */}
      {details.contract && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          <a
            href={getFasolUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 transition-colors`}
          >
            <Send className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold text-blue-400">Fasol</span>
          </a>
          <a
            href={getGmgnUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-[#4C7F6E]/30 bg-[#4C7F6E]/10 hover:bg-[#4C7F6E]/20 transition-colors`}
          >
            <BarChart3 className="w-4 h-4 text-[#4C7F6E]" />
            <span className="text-xs font-bold text-[#4C7F6E]">GMGN</span>
          </a>
        </div>
      )}

      {/* Время публикации и таймер - показываем для всех карточек */}
      {publishedDate && (
        <div className="flex items-center justify-between mb-3 p-2 rounded-lg bg-gray-50 dark:bg-white/5">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            <span className={`text-xs ${subtleColor}`}>
              Опубликовано: {publishedDate ? formatPublishedDate(publishedDate) : '—'}
            </span>
          </div>
          {call.status === 'active' && timeLeft && (
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md ${isOverdue ? 'bg-rose-500/10 text-rose-400' : 'bg-[#4C7F6E]/10 text-[#4C7F6E]'}`}>
              <Clock className="w-3.5 h-3.5" />
              <span className={`text-xs font-semibold ${isOverdue ? 'text-rose-400' : 'text-[#4C7F6E]'}`}>
                {isOverdue ? 'Таймаут' : `Осталось: ${timeLeft}`}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Нижняя часть: трейдер и действия */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-200/30 dark:border-white/10">
        {/* Трейдер */}
        <div className="flex items-center gap-2">
          {traderAvatar ? (
            <img src={traderAvatar} className="w-8 h-8 rounded-full object-cover" alt={traderName} />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#4C7F6E] flex items-center justify-center text-white font-bold text-sm">
              {traderName?.[0] || '?'}
            </div>
          )}
          <div>
            <p className={`text-xs ${subtleColor}`}>Автор</p>
            <p className={`text-sm font-semibold ${textColor}`}>{traderName || 'Unknown'}</p>
          </div>
        </div>

        {/* Действия */}
        <div className="flex items-center gap-1">
          {/* Калькулятор */}
          <button
            onClick={() => setShowCalculator(true)}
            className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-blue-500/20 text-blue-400' : 'hover:bg-blue-50 text-blue-600'}`}
            title="Калькулятор прибыли"
          >
            <Calculator className="w-4 h-4" />
          </button>

          {/* Поделиться */}
          {onShare && (
            <button
              onClick={() => onShare(call.id)}
              className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-[#4C7F6E]/20 text-[#4C7F6E]' : 'hover:bg-[#4C7F6E]/10 text-[#4C7F6E]'}`}
              title="Поделиться"
            >
              <Share2 className="w-4 h-4" />
            </button>
          )}

          {/* Статус */}
          {isAuthorOrAdmin && call.status === 'active' && (
            <>
              <button
                onClick={() => onUpdateStatus(call.id, 'completed')}
                className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-[#4C7F6E]/20 text-[#4C7F6E]' : 'hover:bg-[#4C7F6E]/10 text-[#4C7F6E]'}`}
                title="Завершить"
              >
                <CheckCircle2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onUpdateStatus(call.id, 'cancelled')}
                className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-rose-500/20 text-rose-400' : 'hover:bg-rose-50 text-rose-600'}`}
                title="Отменить"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </>
          )}

          {isAuthorOrAdmin && call.status !== 'active' && (
            <button
              onClick={() => onUpdateStatus(call.id, 'active')}
              className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-blue-500/20 text-blue-400' : 'hover:bg-blue-50 text-blue-600'}`}
              title="Вернуть в работу"
            >
              <History className="w-4 h-4" />
            </button>
          )}

          {/* Редактировать */}
          {isAuthorOrAdmin && (
            <button
              onClick={() => onEdit(call)}
              className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-white/10 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'}`}
              title="Редактировать"
            >
              <Edit className="w-4 h-4" />
            </button>
          )}

          {/* Удалить */}
          {isAdmin && (
            <button
              onClick={() => onDelete(call.id)}
              className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-50 text-red-600'}`}
              title="Удалить"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Калькулятор прибыли - рендерится через Portal, чтобы не наследовать opacity от родителя */}
      {showCalculator && createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className={`${cardBg} rounded-2xl shadow-2xl border ${borderColor} max-w-md w-full p-6`}>
            {/* Заголовок */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-50'}`}>
                  <Calculator className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h3 className={`text-lg font-bold ${textColor}`}>Калькулятор прибыли</h3>
                  <p className={`text-xs ${subtleColor}`}>{tokenSymbol} • Max Profit: {formatProfit(maxProfit)}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowCalculator(false)
                  setInvestmentAmount('')
                }}
                className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Поле ввода суммы */}
            <div className="mb-6">
              <label className={`block text-sm font-medium mb-2 ${textColor}`}>Сумма вложения ($)</label>
              <input
                type="number"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(e.target.value)}
                placeholder="Введите сумму..."
                className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} ${textColor} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                autoFocus
              />
              <div className="grid grid-cols-4 gap-2 mt-2">
                {[20, 50, 100, 200, 500, 750, 1000, 2000].map((sum) => (
                  <button
                    key={sum}
                    onClick={() => setInvestmentAmount(sum.toString())}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${
                      theme === 'dark' 
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                    }`}
                  >
                    ${sum}
                  </button>
                ))}
              </div>
            </div>

            {/* Результаты */}
            {amount > 0 && (
              <div className="space-y-3">
                <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'} border ${borderColor}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-sm ${subtleColor}`}>Вложено</span>
                    <span className={`font-bold ${textColor}`}>${amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-sm ${subtleColor}`}>Комиссии ({feePercent}%)</span>
                    <span className="font-bold text-rose-400">-${(amount * feePercent / 100).toFixed(2)}</span>
                  </div>
                  <div className={`h-px ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'} my-3`} />
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-sm ${subtleColor}`}>Грязная прибыль</span>
                    <span className={`font-bold ${grossProfit >= 0 ? 'text-[#4C7F6E]' : 'text-rose-400'}`}>
                      {grossProfit >= 0 ? '+' : ''}${grossProfit.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm font-medium ${textColor}`}>Чистая прибыль</span>
                    <span className={`text-lg font-bold ${netProfit >= 0 ? 'text-[#4C7F6E]' : 'text-rose-400'}`}>
                      {netProfit >= 0 ? '+' : ''}${netProfit.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Итоговая сумма */}
                <div className={`p-4 rounded-xl bg-[#4C7F6E]/10 border border-[#4C7F6E]/20`}>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm font-medium ${textColor}`}>Итого на выходе</span>
                    <span className={`text-xl font-bold text-[#4C7F6E]`}>${totalReturn.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Подсказка о комиссиях */}
            <p className={`text-xs ${subtleColor} mt-4 text-center`}>
              * Комиссии приблизительные: вход ~{feePercent / 2}% + выход ~{feePercent / 2}%
            </p>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
