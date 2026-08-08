import { useState, useEffect } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAdminStore } from '@/store/adminStore'
import { useUsers } from '@/hooks/useUsers'
import { addPoolDiscount, getPoolDiscounts, updatePoolDiscount, deletePoolDiscount } from '@/services/firestoreService'
import { EARNINGS_CATEGORY_META, PoolDiscount, PoolDiscountSphere, EarningsCategory } from '@/types'
import { 
  Tag, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Zap,
  X,
  ChevronDown,
  ChevronUp,
  Percent
} from 'lucide-react'

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

const DURATION_OPTIONS = [
  { label: '1 день', value: 1 },
  { label: '3 дня', value: 3 },
  { label: '7 дней', value: 7 },
  { label: '14 дней', value: 14 },
  { label: '30 дней', value: 30 },
  { label: '90 дней', value: 90 },
]

export const PoolDiscounts = () => {
  const { theme } = useThemeStore()
  const { isAdmin } = useAdminStore()
  const { users } = useUsers()
  
  const [discounts, setDiscounts] = useState<PoolDiscount[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  
  // Form state
  const [selectedUserId, setSelectedUserId] = useState('')
  const [discountPercent, setDiscountPercent] = useState('')
  const [selectedSpheres, setSelectedSpheres] = useState<PoolDiscountSphere[]>([])
  const [durationDays, setDurationDays] = useState(7)
  const [customDuration, setCustomDuration] = useState('')
  const [isCustomDuration, setIsCustomDuration] = useState(false)
  const [formError, setFormError] = useState('')
  const [formLoading, setFormLoading] = useState(false)

  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const labelColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
  const cardBg = theme === 'dark' ? 'bg-[#151a21]/50' : 'bg-white'
  const borderColor = theme === 'dark' ? 'border-white/10' : 'border-gray-200'
  const inputBg = theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'

  const loadDiscounts = async () => {
    try {
      setLoading(true)
      const data = await getPoolDiscounts()
      setDiscounts(data.sort((a, b) => b.createdAt.localeCompare(a.createdAt)))
    } catch (error) {
      console.error('Error loading discounts:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDiscounts()
  }, [])

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = 'POOL-'
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
  }

  const toggleSphere = (sphere: PoolDiscountSphere) => {
    setSelectedSpheres(prev => 
      prev.includes(sphere) 
        ? prev.filter(s => s !== sphere)
        : [...prev, sphere]
    )
  }

  const handleSubmit = async () => {
    setFormError('')
    
    if (!selectedUserId) {
      setFormError('Выберите пользователя')
      return
    }
    
    const percent = parseFloat(discountPercent)
    if (isNaN(percent) || percent <= 0 || percent > 100) {
      setFormError('Процент скидки должен быть от 1% до 100%')
      return
    }
    
    if (selectedSpheres.length === 0) {
      setFormError('Выберите хотя бы одну сферу')
      return
    }

    const days = isCustomDuration ? parseInt(customDuration) : durationDays
    if (isNaN(days) || days <= 0) {
      setFormError('Укажите корректный срок действия')
      return
    }

    setFormLoading(true)
    try {
      const user = users.find(u => u.id === selectedUserId)
      const now = new Date()
      const expiresAt = new Date(now.getTime() + days * 24 * 60 * 60 * 1000)
      
      await addPoolDiscount({
        userId: selectedUserId,
        userName: user?.name || '',
        code: generateCode(),
        discountPercent: percent,
        spheres: selectedSpheres,
        expiresAt: expiresAt.toISOString(),
        isActive: true,
        isUsed: false,
        createdBy: 'admin',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      })

      setShowForm(false)
      resetForm()
      await loadDiscounts()
    } catch (error) {
      console.error('Error creating discount:', error)
      setFormError('Ошибка при создании промокода')
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeactivate = async (id: string) => {
    try {
      await updatePoolDiscount(id, { isActive: false })
      await loadDiscounts()
    } catch (error) {
      console.error('Error deactivating discount:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить промокод?')) return
    try {
      await deletePoolDiscount(id)
      await loadDiscounts()
    } catch (error) {
      console.error('Error deleting discount:', error)
    }
  }

  const resetForm = () => {
    setSelectedUserId('')
    setDiscountPercent('')
    setSelectedSpheres([])
    setDurationDays(7)
    setCustomDuration('')
    setIsCustomDuration(false)
    setFormError('')
  }

  const getStatusColor = (discount: PoolDiscount) => {
    if (discount.isUsed) return 'text-gray-400'
    if (!discount.isActive) return 'text-red-400'
    if (new Date(discount.expiresAt) < new Date()) return 'text-amber-400'
    return 'text-emerald-400'
  }

  const getStatusLabel = (discount: PoolDiscount) => {
    if (discount.isUsed) return 'Использован'
    if (!discount.isActive) return 'Деактивирован'
    if (new Date(discount.expiresAt) < new Date()) return 'Истёк'
    return 'Активен'
  }

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString('ru-RU', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!isAdmin) {
    return (
      <div className="py-20 text-center space-y-4">
        <Tag className="w-16 h-16 text-gray-700 mx-auto opacity-20" />
        <h3 className={`text-xl font-black ${headingColor}`}>Доступ ограничен</h3>
        <p className={labelColor}>У вас нет прав для доступа к этому разделу.</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#4C7F6E]/10 rounded-2xl border border-[#4C7F6E]/20">
            <Tag className="w-6 h-6 text-[#4C7F6E]" />
          </div>
          <div>
            <h1 className={`text-2xl md:text-4xl font-black tracking-tight ${headingColor}`}>
              Pool Скидки
            </h1>
            <p className={`text-sm font-medium ${labelColor}`}>
              Управление промокодами для снижения комиссии пула
            </p>
          </div>
        </div>
      </div>

      {/* Add Button */}
      <button
        onClick={() => setShowForm(!showForm)}
        className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all ${
          showForm 
            ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20'
            : 'bg-gradient-to-r from-[#4C7F6E] to-[#3d6660] text-white shadow-lg shadow-[#4C7F6E]/30 hover:shadow-[#4C7F6E]/50 hover:scale-[1.02]'
        }`}
      >
        {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        {showForm ? 'Закрыть' : 'Создать промокод'}
      </button>

      {/* Create Form */}
      {showForm && (
        <div className={`p-6 rounded-2xl border ${borderColor} ${cardBg} space-y-6`}>
          <h3 className={`text-lg font-black ${headingColor}`}>Новый промокод</h3>
          
          {formError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-400">{formError}</p>
            </div>
          )}

          {/* User Selection */}
          <div className="space-y-2">
            <label className={`text-sm font-bold ${labelColor}`}>Пользователь</label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border ${inputBg} ${headingColor} focus:outline-none focus:ring-2 focus:ring-[#4C7F6E]/50`}
            >
              <option value="">Выберите пользователя</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>
          </div>

          {/* Discount Percent */}
          <div className="space-y-2">
            <label className={`text-sm font-bold ${labelColor}`}>Размер скидки (%)</label>
            <div className="relative">
              <input
                type="number"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(e.target.value)}
                min="1"
                max="100"
                placeholder="например, 25"
                className={`w-full px-4 py-3 pr-10 rounded-xl border ${inputBg} ${headingColor} placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4C7F6E]/50`}
              />
              <Percent className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <p className={`text-xs ${labelColor}`}>
              Скидка применяется к сумме взноса в пул
            </p>
          </div>

          {/* Sphere Selection */}
          <div className="space-y-2">
            <label className={`text-sm font-bold ${labelColor}`}>Сферы деятельности</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {CATEGORY_OPTIONS.map(cat => {
                const meta = EARNINGS_CATEGORY_META[cat]
                const isSelected = selectedSpheres.includes(cat)
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleSphere(cat)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-[#4C7F6E] bg-[#4C7F6E]/10 text-[#4C7F6E]'
                        : `${inputBg} hover:border-white/20 ${labelColor}`
                    }`}
                  >
                    <span className="text-xs font-bold">{meta.shortName}</span>
                  </button>
                )
              })}
            </div>
            <p className={`text-xs ${labelColor}`}>
              Промокод будет действовать только для выбранных сфер
            </p>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <label className={`text-sm font-bold ${labelColor}`}>Срок действия</label>
            <div className="flex flex-wrap gap-2">
              {DURATION_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => { setDurationDays(opt.value); setIsCustomDuration(false) }}
                  className={`px-4 py-2 rounded-xl border text-sm font-bold transition-all ${
                    !isCustomDuration && durationDays === opt.value
                      ? 'border-[#4C7F6E] bg-[#4C7F6E]/10 text-[#4C7F6E]'
                      : `${inputBg} hover:border-white/20 ${labelColor}`
                  }`}
                >
                  {opt.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setIsCustomDuration(true)}
                className={`px-4 py-2 rounded-xl border text-sm font-bold transition-all ${
                  isCustomDuration
                    ? 'border-[#4C7F6E] bg-[#4C7F6E]/10 text-[#4C7F6E]'
                    : `${inputBg} hover:border-white/20 ${labelColor}`
                }`}
              >
                Свой срок
              </button>
            </div>
            {isCustomDuration && (
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="number"
                  value={customDuration}
                  onChange={(e) => setCustomDuration(e.target.value)}
                  min="1"
                  placeholder="Кол-во дней"
                  className={`flex-1 px-4 py-3 rounded-xl border ${inputBg} ${headingColor} placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4C7F6E]/50`}
                />
                <span className={`text-sm font-bold ${labelColor}`}>дней</span>
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={formLoading}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#4C7F6E] to-[#3d6660] text-white font-bold shadow-lg shadow-[#4C7F6E]/30 hover:shadow-[#4C7F6E]/50 disabled:opacity-50 transition-all"
            >
              {formLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Zap className="w-5 h-5" />
              )}
              {formLoading ? 'Создание...' : 'Создать промокод'}
            </button>
            <button
              onClick={() => { setShowForm(false); resetForm() }}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                theme === 'dark' ? 'bg-white/5 hover:bg-white/10 text-gray-400 border border-white/10' : 'bg-gray-100 hover:bg-gray-200 text-gray-600 border border-gray-200'
              }`}
            >
              Отмена
            </button>
          </div>
        </div>
      )}

      {/* Discount List */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-10">
            <div className="w-8 h-8 border-2 border-[#4C7F6E]/30 border-t-[#4C7F6E] rounded-full animate-spin mx-auto" />
          </div>
        ) : discounts.length === 0 ? (
          <div className={`text-center py-10 ${labelColor}`}>
            <Tag className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Промокодов пока нет</p>
          </div>
        ) : (
          discounts.map(discount => {
            const isExpanded = expandedId === discount.id
            const isExpired = new Date(discount.expiresAt) < new Date()
            
            return (
              <div
                key={discount.id}
                className={`rounded-2xl border ${borderColor} ${cardBg} overflow-hidden transition-all`}
              >
                {/* Discount Row */}
                <div 
                  className="flex items-center gap-4 p-4 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : discount.id)}
                >
                  {/* Code Badge */}
                  <div className={`px-3 py-1.5 rounded-lg text-xs font-black tracking-wider ${
                    discount.isUsed 
                      ? 'bg-gray-500/20 text-gray-400' 
                      : discount.isActive && !isExpired
                        ? 'bg-[#4C7F6E]/20 text-[#4C7F6E]'
                        : 'bg-red-500/20 text-red-400'
                  }`}>
                    {discount.code}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${headingColor}`}>{discount.userName || 'Неизвестный'}</span>
                      <span className={`text-xs font-bold ${getStatusColor(discount)}`}>
                        {getStatusLabel(discount)}
                      </span>
                    </div>
                    <div className={`text-xs ${labelColor} mt-0.5`}>
                      {discount.discountPercent}% · {discount.spheres.length} сфер · до {formatDate(discount.expiresAt)}
                    </div>
                  </div>

                  {/* Expand Arrow */}
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className={`px-4 pb-4 border-t ${borderColor} space-y-3 pt-3`}>
                    {/* Spheres List */}
                    <div>
                      <p className={`text-xs font-bold ${labelColor} mb-2`}>Сферы:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {discount.spheres.map(s => (
                          <span key={s} className="px-2 py-1 rounded-lg bg-[#4C7F6E]/10 text-[#4C7F6E] text-[10px] font-bold">
                            {EARNINGS_CATEGORY_META[s]?.shortName || s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Dates */}
                    <div className={`grid grid-cols-2 gap-3 text-xs ${labelColor}`}>
                      <div>
                        <span className="font-bold">Создан:</span> {formatDate(discount.createdAt)}
                      </div>
                      <div>
                        <span className="font-bold">Истекает:</span> {formatDate(discount.expiresAt)}
                      </div>
                      {discount.isUsed && discount.usedAt && (
                        <div className="col-span-2">
                          <span className="font-bold">Использован:</span> {formatDate(discount.usedAt)}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    {!discount.isUsed && discount.isActive && (
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeactivate(discount.id) }}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-500/10 text-amber-400 text-xs font-bold hover:bg-amber-500/20 transition-all"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Деактивировать
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(discount.id) }}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/10 text-red-400 text-xs font-bold hover:bg-red-500/20 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Удалить
                        </button>
                      </div>
                    )}

                    {discount.isUsed && (
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Промокод был использован</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default PoolDiscounts