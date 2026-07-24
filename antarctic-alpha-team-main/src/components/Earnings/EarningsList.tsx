import { useState } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAdminStore } from '@/store/adminStore'
import { deleteEarnings } from '@/services/firestoreService'
import { Earnings, EARNINGS_CATEGORY_META, EarningsCategory, EarningsCategoryExtended } from '@/types'
import { formatDate } from '@/utils/dateUtils'
import { getUserNicknameSync } from '@/utils/userUtils'
import { calculatePoolShare, getTotalAmount } from '@/utils/earningsCalculations'
import { Edit2, Trash2, Rocket, LineChart, Image, Coins, BarChart3, ShieldCheck, Sparkles, Gift, Repeat, HeartHandshake, Bot } from 'lucide-react'

interface EarningsListProps {
  earnings: Earnings[]
  onEdit: (earning: Earnings) => void
  onDelete: () => void
}

export const EarningsList = ({ earnings, onEdit, onDelete }: EarningsListProps) => {
  const { theme } = useThemeStore()
  const { isAdmin } = useAdminStore()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const getCategoryIcon = (key: EarningsCategoryExtended, className = 'w-4 h-4') => {
    switch (key) {
      case 'memecoins':
      case 'memecoins_trading':
      case 'memecoins_deving':
        return <Rocket className={className} />
      case 'futures':
        return <LineChart className={className} />
      case 'nft':
        return <Image className={className} />
      case 'spot':
        return <Coins className={className} />
      case 'polymarket':
        return <BarChart3 className={className} />
      case 'staking':
        return <ShieldCheck className={className} />
      case 'airdrop':
        return <Gift className={className} />
      case 'p2p':
        return <Repeat className={className} />
      case 'p2c':
        return <HeartHandshake className={className} />
      case 'bot':
        return <Bot className={className} />
      default:
        return <Sparkles className={className} />
    }
  }

  const handleDelete = async (earning: Earnings) => {
    // Удалять может только админ
    if (!isAdmin) {
      alert('Удаление записей о заработке доступно только администратору')
      return
    }

    if (!confirm('Вы уверены, что хотите удалить эту запись о заработке?')) {
      return
    }

    setDeletingId(earning.id)
    try {
      await deleteEarnings(earning.id)
      onDelete()
    } catch (error) {
      console.error('Error deleting earnings:', error)
      alert('Ошибка при удалении записи')
    } finally {
      setDeletingId(null)
    }
  }

  const getParticipants = (earning: Earnings) => {
    return earning.participants && earning.participants.length > 0 ? earning.participants : [earning.userId]
  }

  // Функции для расчёта с учётом extraWalletsCount
  const calcPool = (earning: Earnings) => {
    // Если есть сохранённый poolAmount - используем его
    if (earning.poolAmount) return earning.poolAmount
    
    // Иначе вычисляем с учётом extraWalletsCount
    const totalAmount = getTotalAmount(earning.amount, earning.extraWalletsCount, earning.walletType)
    const category = earning.category as EarningsCategory
    const { poolShare } = calculatePoolShare(totalAmount, category, earning.walletType || 'general')
    return poolShare
  }
  
  const calcNet = (earning: Earnings) => {
    const totalAmount = getTotalAmount(earning.amount, earning.extraWalletsCount, earning.walletType)
    const pool = calcPool(earning)
    return Math.max(totalAmount - pool, 0)
  }
  
  const calcShare = (earning: Earnings) => {
    const participants = getParticipants(earning)
    return participants.length ? calcNet(earning) / participants.length : calcNet(earning)
  }

  const getCategoryMeta = (category: EarningsCategoryExtended) => {
    const meta = EARNINGS_CATEGORY_META[category]
    return meta
  }

  const getUserName = (userId: string) => {
    return getUserNicknameSync(userId) || userId
  }

  // Sort by date descending
  const sortedEarnings = [...earnings].sort((a, b) => b.date.localeCompare(a.date))

  if (sortedEarnings.length === 0) {
    return (
      <div className={`rounded-2xl p-8 text-center border-2 ${theme === 'dark'
        ? 'bg-[#1a1a1a] border-gray-800'
        : 'bg-white border-gray-200'
        } shadow-md`}>
        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-lg`}>
          Пока нет записей о заработке
        </p>
        <p className={`${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'} text-sm mt-2`}>
          Добавьте первую запись, чтобы начать отслеживать доходы команды
        </p>
      </div>
    )
  }

  return (
    <div className={`rounded-3xl overflow-hidden border shadow-2xl ${theme === 'dark' ? 'bg-[#0b1015] border-white/5' : 'bg-white border-gray-100'
      }`}>
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-xl">
            <Edit2 className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className={`text-lg font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            История выплат
          </h3>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-gray-500 whitespace-nowrap">Дата</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-gray-500">Сфера</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-gray-500">Команда</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-gray-500 text-right">Выплата</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-gray-500 text-right">В Пул</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-gray-500 text-center">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {sortedEarnings.map((earning) => {
              const participants = getParticipants(earning)
              const categoryMeta = getCategoryMeta(earning.category)
              const netAmount = calcNet(earning)
              const shareAmount = calcShare(earning)
              const canEdit = isAdmin
              const canDelete = isAdmin
              return (
                <tr
                  key={earning.id}
                  className={`group/row transition-colors ${theme === 'dark' ? 'hover:bg-white/[0.02]' : 'hover:bg-gray-50'}`}
                >
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span className={`text-[12px] font-bold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {formatDate(new Date(earning.date + 'T00:00:00'), 'dd.MM')}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-white/5 rounded-lg">
                        {getCategoryIcon(earning.category, 'w-3.5 h-3.5 text-gray-400')}
                      </div>
                      <span className={`text-xs font-bold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                        {categoryMeta.label}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                      {participants.map((pid) => (
                        <span
                          key={pid}
                          className={`px-2 py-0.5 rounded-md text-[10px] font-black tracking-tight border ${theme === 'dark'
                            ? 'border-white/5 bg-white/5 text-gray-400'
                            : 'border-gray-100 bg-gray-50 text-gray-600'
                            }`}
                        >
                          {getUserName(pid)}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-black text-emerald-500">
                        {netAmount.toFixed(0)} ₽
                      </span>
                      {participants.length > 1 && (
                        <span className="text-[10px] font-medium text-gray-500">
                          по {shareAmount.toFixed(0)} ₽
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <span className="text-sm font-bold text-purple-400 opacity-60">
                      {calcPool(earning).toFixed(0)} ₽
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    {canEdit || canDelete ? (
                      <div className="flex items-center justify-center gap-2 opacity-0 group-hover/row:opacity-100 transition-opacity duration-200">
                        {canEdit && (
                          <button
                            onClick={() => onEdit(earning)}
                            className={`p-2 rounded-xl border border-blue-500/20 bg-blue-500/5 text-blue-400 hover:bg-blue-500/20 transition-all`}
                            title="Редактировать (только админ)"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {canDelete && (
                          <button
                            onClick={() => handleDelete(earning)}
                            disabled={deletingId === earning.id}
                            className={`p-2 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-500 hover:bg-rose-500/20 transition-all disabled:opacity-50`}
                            title="Удалить (только админ)"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-700 text-xs">—</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
