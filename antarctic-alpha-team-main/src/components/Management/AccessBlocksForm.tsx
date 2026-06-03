// Form for managing access blocks
import { useState, useEffect } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { useAdminStore } from '@/store/adminStore'
import { getAllAccessBlocks, addAccessBlock, updateAccessBlock, deleteAccessBlock } from '@/services/firestoreService'
import { useScrollLock } from '@/hooks/useScrollLock'
import { AccessBlock, AccessFeature, TEAM_MEMBERS } from '@/types'
import { X, Plus, Trash2, Edit, Save, Shield, ShieldX, Clock, Users, User, Check, ChevronDown, ChevronRight, Folder, FileText } from 'lucide-react'

interface AccessBlocksFormProps {
  onClose: () => void
}

// Иерархическая структура для меню
interface MenuItem {
  value: AccessFeature
  label: string
  description: string
}

interface MenuCategory {
  id: string
  label: string
  icon: string // для будущего использования
  items: MenuItem[]
}

interface FormData {
  targetType: 'all' | 'single' | 'subset'
  userId: string
  userIds: string[]
  reason: string
  expiresAt: string
  blockFeatures: AccessFeature[]
  isActive: boolean
}

// Иерархическая структура меню - точно соответствует Layout.tsx
const MENU_STRUCTURE: MenuCategory[] = [
  {
    id: 'quick_access',
    label: 'Quick Access',
    icon: 'zap',
    items: [
      { value: 'ava_converter', label: 'Converter', description: 'Конвертер валют' },
      { value: 'ava_communication', label: 'Communication', description: 'Чат и коммуникация' },
    ]
  },
  {
    id: 'traders',
    label: "Traders' Lounge",
    icon: 'wallet',
    items: [
      { value: 'ava_hub', label: 'HUB', description: 'Сигналы и аналитика' },
      { value: 'ava_trader_diary', label: 'Trader Diary', description: 'Торговый журнал' },
      { value: 'ava_realtime_chart', label: 'Market Analytics', description: 'Рыночная аналитика' },
      { value: 'tools_strategies', label: 'Contour', description: 'Стратегии и контур' },
    ]
  },
  {
    id: 'planner',
    label: 'Planner Dashboard',
    icon: 'calendar',
    items: [
      { value: 'ava_schedule', label: 'Lead', description: 'Расписание и слоты' },
      { value: 'ava_tasks', label: 'Tasks', description: 'Задачи и канбан' },
      { value: 'tools_events', label: 'Events', description: 'События и мероприятия' },
      { value: 'tools_challenges', label: 'Challenges', description: 'Челленджи' },
      { value: 'tools_initiatives', label: 'Initiatives', description: 'Инициативы' },
      { value: 'ava_rating', label: 'Track Record', description: 'Рейтинг и статистика' },
      { value: 'ava_referrals', label: 'Invite & Earn', description: 'Реферальная программа' },
    ]
  },
  {
    id: 'reward',
    label: 'Reward Centre',
    icon: 'dollar',
    items: [
      { value: 'ava_profit', label: 'P&L', description: 'Доходы и выплаты' },
      { value: 'ava_community_fund', label: 'Community Fund', description: 'Общий фонд' },
      { value: 'ava_team_fund', label: "Team's Wallet", description: 'Доступ к командному кошельку' },
      { value: 'ava_payments', label: 'Payments', description: 'Управление выплатами' },
      { value: 'ava_cards_crypto', label: 'Cards & Crypto', description: 'Карты и крипто' },
    ]
  },
  {
    id: 'analytics',
    label: 'Applications',
    icon: 'file-text',
    items: [
      { value: 'tools_applications', label: 'Applications', description: 'Заявки и обращения' },
    ]
  },
  {
    id: 'arca_info',
    label: 'ARCA INFO',
    icon: 'book',
    items: [
      { value: 'ava_faq', label: 'FAQ', description: 'Часто задаваемые вопросы' },
      { value: 'ava_info', label: 'INFO', description: 'Информация о проекте' },
      { value: 'ava_feedback', label: 'Feedback', description: 'Фидбек от команды' },
      { value: 'ava_contact_dm', label: 'Contact DM', description: 'Связь с DM' },
    ]
  },
  {
    id: 'global',
    label: 'Глобальные',
    icon: 'shield',
    items: [
      { value: 'all', label: 'Весь сайт', description: 'Полная блокировка доступа ко всему сайту' },
      { value: 'profile', label: 'Профиль', description: 'Блокировка доступа к профилю' },
    ]
  }
]

// Карта соответствия категорий и их feature для бэкенда
const CATEGORY_TO_FEATURES: Record<string, AccessFeature> = {
  'quick_access': 'ava_quick_access',
  'traders': 'ava_traders_lounge',
  'planner': 'ava_planner_dashboard',
  'reward': 'ava_reward_centre',
  'analytics': 'ava_applications',
  'arca_info': 'ava_arca_info',
}

// Получить все feature подкатегорий для категории
const getSubFeatures = (categoryId: string): AccessFeature[] => {
  const category = MENU_STRUCTURE.find(c => c.id === categoryId)
  if (!category) return []
  return category.items.map(item => item.value)
}

export const AccessBlocksForm = ({ onClose }: AccessBlocksFormProps) => {
  const { theme } = useThemeStore()
  const { user } = useAuthStore()
  const { isAdmin } = useAdminStore()
  useScrollLock()
  const [blocks, setBlocks] = useState<AccessBlock[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [editingBlock, setEditingBlock] = useState<AccessBlock | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  // Открытые категории (по умолчанию все)
  const [openCategories, setOpenCategories] = useState<Set<string>>(
    new Set(MENU_STRUCTURE.map(c => c.id))
  )

  const [formData, setFormData] = useState<FormData>({
    targetType: 'single',
    userId: '',
    userIds: [],
    reason: '',
    expiresAt: '',
    blockFeatures: [],
    isActive: true
  })

  useEffect(() => {
    loadBlocks()
  }, [])

  const loadBlocks = async () => {
    try {
      setLoading(true)
      const data = await getAllAccessBlocks()
      setBlocks(data)
    } catch (error) {
      console.error('Error loading blocks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user && !isAdmin) {
      setError('Необходима авторизация')
      return
    }

    if (formData.targetType === 'single' && !formData.userId) {
      setError('Выберите пользователя для блокировки')
      return
    }

    if (formData.targetType === 'subset' && formData.userIds.length === 0) {
      setError('Выберите хотя бы одного пользователя')
      return
    }

    setSaving(true)
    setError('')
    try {
      const blockData = {
        targetType: formData.targetType,
        userId: formData.targetType === 'single' ? formData.userId : '',
        userIds: formData.targetType === 'subset' ? formData.userIds : [],
        reason: formData.reason || 'Администратор не указал причину',
        blockFeatures: formData.blockFeatures,
        isActive: formData.isActive,
        createdBy: user?.id || 'admin',
        createdAt: new Date().toISOString(),
        expiresAt: formData.expiresAt || ''
      }

      if (editingBlock) {
        await updateAccessBlock(editingBlock.id, blockData)
      } else {
        await addAccessBlock(blockData as any)
      }

      await loadBlocks()
      resetForm()
      setShowAddForm(false)
      setEditingBlock(null)
    } catch (error: any) {
      console.error('Error saving block:', error)
      setError(error.message || 'Ошибка сохранения')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (block: AccessBlock) => {
    setEditingBlock(block)
    setFormData({
      targetType: block.targetType || (block.userId ? 'single' : 'all'),
      userId: block.userId || '',
      userIds: block.userIds || [],
      reason: block.reason === 'Администратор не указал причину' ? '' : block.reason,
      expiresAt: block.expiresAt || '',
      blockFeatures: block.blockFeatures,
      isActive: block.isActive
    })
    setError('')
    setShowAddForm(true)
  }

  const handleDelete = async (blockId: string) => {
    if (!confirm('Удалить эту блокировку?')) return
    try {
      await deleteAccessBlock(blockId)
      await loadBlocks()
    } catch (error) {
      console.error('Error deleting block:', error)
    }
  }

  const handleToggleActive = async (block: AccessBlock) => {
    try {
      await updateAccessBlock(block.id, { isActive: !block.isActive })
      await loadBlocks()
    } catch (error) {
      console.error('Error toggling block status:', error)
    }
  }

  // Переключение категории (всё вместе)
  const handleCategoryToggle = (categoryId: string) => {
    const categoryFeature = CATEGORY_TO_FEATURES[categoryId]
    const subFeatures = getSubFeatures(categoryId)
    
    setFormData((prev: FormData) => {
      const hasCategory = prev.blockFeatures.includes(categoryFeature as AccessFeature)
      
      if (hasCategory) {
        // Убираем категорию и все её подпункты
        return {
          ...prev,
          blockFeatures: prev.blockFeatures.filter(
            (f: AccessFeature) => f !== categoryFeature && !subFeatures.includes(f)
          )
        }
      } else {
        // Добавляем категорию и все подпункты
        return {
          ...prev,
          blockFeatures: [
            ...prev.blockFeatures.filter((f: AccessFeature) => !subFeatures.includes(f)),
            categoryFeature as AccessFeature,
            ...subFeatures
          ]
        }
      }
    })
  }

  // Переключение отдельного подпункта
  const handleItemToggle = (item: MenuItem, categoryId: string) => {
    const categoryFeature = CATEGORY_TO_FEATURES[categoryId]
    const subFeatures = getSubFeatures(categoryId)
    
    setFormData((prev: FormData) => {
      const isSelected = prev.blockFeatures.includes(item.value)
      
      if (isSelected) {
        // Убираем подпункт
        const newFeatures = prev.blockFeatures.filter((f: AccessFeature) => f !== item.value)
        
        // Если убираем последний подпункт категории, убираем и категорию
        const remainingSubFeatures = subFeatures.filter(sf => 
          newFeatures.includes(sf) && sf !== item.value
        )
        if (remainingSubFeatures.length === 0 && newFeatures.includes(categoryFeature as AccessFeature)) {
          return {
            ...prev,
            blockFeatures: newFeatures.filter((f: AccessFeature) => f !== categoryFeature)
          }
        }
        
        return { ...prev, blockFeatures: newFeatures }
      } else {
        // Добавляем подпункт (категория добавляется если ещё не выбрана)
        const alreadyHasCategory = prev.blockFeatures.includes(categoryFeature as AccessFeature)
        
        // Проверяем, выбраны ли уже все подпункты - тогда добавляем категорию
        const currentlySelectedSubs = subFeatures.filter(sf => 
          prev.blockFeatures.includes(sf)
        )
        const willBeAllSelected = currentlySelectedSubs.length + 1 === subFeatures.length
        
        if (willBeAllSelected && !alreadyHasCategory) {
          // Все подпункты выбраны - добавляем категорию
          return {
            ...prev,
            blockFeatures: [...prev.blockFeatures, item.value, categoryFeature as AccessFeature]
          }
        }
        
        return {
          ...prev,
          blockFeatures: [...prev.blockFeatures, item.value]
        }
      }
    })
  }

  // Проверка выбрана ли категория полностью
  const isCategoryFullySelected = (categoryId: string): boolean => {
    const categoryFeature = CATEGORY_TO_FEATURES[categoryId]
    const subFeatures = getSubFeatures(categoryId)
    return formData.blockFeatures.includes(categoryFeature as AccessFeature) ||
           (subFeatures.length > 0 && subFeatures.every(sf => formData.blockFeatures.includes(sf)))
  }

  // Проверка выбрана ли категория частично
  const isCategoryPartiallySelected = (categoryId: string): boolean => {
    const categoryFeature = CATEGORY_TO_FEATURES[categoryId]
    const subFeatures = getSubFeatures(categoryId)
    const hasCategory = formData.blockFeatures.includes(categoryFeature as AccessFeature)
    const selectedSubCount = subFeatures.filter(sf => formData.blockFeatures.includes(sf)).length
    
    return (hasCategory && selectedSubCount < subFeatures.length) ||
           (!hasCategory && selectedSubCount > 0 && selectedSubCount < subFeatures.length)
  }

  // Проверка выбран ли конкретный подпункт
  const isItemSelected = (itemValue: AccessFeature): boolean => {
    return formData.blockFeatures.includes(itemValue)
  }

  const handleUserToggle = (id: string) => {
    setFormData((prev: FormData) => ({
      ...prev,
      userIds: prev.userIds.includes(id)
        ? prev.userIds.filter((uid: string) => uid !== id)
        : [...prev.userIds, id]
    }))
  }

  const toggleCategory = (categoryId: string) => {
    setOpenCategories((prev: Set<string>) => {
      const next = new Set(prev)
      if (next.has(categoryId)) next.delete(categoryId)
      else next.add(categoryId)
      return next
    })
  }

  const resetForm = () => {
    setError('')
    setFormData({
      targetType: 'single',
      userId: '',
      userIds: [],
      reason: '',
      expiresAt: '',
      blockFeatures: [],
      isActive: true
    })
  }

  const getTargetLabel = (block: AccessBlock) => {
    if (block.targetType === 'all') return 'Все участники'
    if (block.targetType === 'subset') return `Группа (${block.userIds?.length || 0} чел.)`
    const member = TEAM_MEMBERS.find(m => m.id === block.userId)
    return member?.name || 'Пользователь'
  }

  const isExpired = (expiry?: string) => expiry ? new Date(expiry) < new Date() : false

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xl flex items-start sm:items-center justify-center z-[70] p-4 overflow-y-auto">
      <div className={`w-full max-w-5xl rounded-3xl shadow-2xl border ${theme === 'dark' ? 'bg-[#0c1320] border-white/10' : 'bg-white border-slate-200'} max-h-[95vh] overflow-hidden flex flex-col`}>
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500">
              <ShieldX className="w-6 h-6" />
            </div>
            <div>
              <h3 className={`text-xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Управление доступом</h3>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Гибкая блокировка участников и функционала</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {loading ? (
            <div className="flex items-center justify-center p-20">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-red-500/20 border-t-red-500"></div>
            </div>
          ) : (
            <>
              {/* Add/Edit Form Overlay-like Section */}
              {(showAddForm || editingBlock) && (
                <div className={`rounded-2xl border p-8 ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'} animate-in fade-in slide-in-from-top-4 duration-300`}>
                  <h4 className={`text-lg font-black mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{editingBlock ? 'Изменить параметры блока' : 'Новая блокировка'}</h4>

                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* 1. Target Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">Кого блокируем?</label>
                        <div className="flex gap-2 p-1 bg-black/20 rounded-xl">
                          {[
                            { id: 'single', label: 'Участник', icon: User },
                            { id: 'subset', label: 'Определенных', icon: Users },
                            { id: 'all', label: 'Всех', icon: Shield }
                          ].map((type) => (
                            <button
                              key={type.id}
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, targetType: type.id as any }))}
                              className={`flex-1 flex items-center justify-center gap-2 py-2 pr-3 pl-2 rounded-lg text-xs font-bold transition-all ${formData.targetType === type.id ? 'bg-red-500 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                              <type.icon className="w-4 h-4" />
                              <span>{type.label}</span>
                            </button>
                          ))}
                        </div>

                        {formData.targetType === 'single' && (
                          <select
                            value={formData.userId}
                            onChange={(e) => setFormData(prev => ({ ...prev, userId: e.target.value }))}
                            className={`w-full px-4 py-3 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-white/10 text-white' : 'bg-white border-gray-200'} focus:ring-2 focus:ring-red-500 outline-none`}
                          >
                            <option value="">Выберите участника...</option>
                            {TEAM_MEMBERS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                          </select>
                        )}

                        {formData.targetType === 'subset' && (
                          <div className={`grid grid-cols-2 gap-2 p-3 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-white/10' : 'bg-white border-gray-200'}`}>
                            {TEAM_MEMBERS.map(m => (
                              <button
                                key={m.id}
                                type="button"
                                onClick={() => handleUserToggle(m.id)}
                                className={`flex items-center gap-3 p-2 rounded-lg text-xs font-medium transition-all ${formData.userIds.includes(m.id) ? 'bg-red-500/20 text-red-500' : 'text-gray-500 hover:bg-white/5'}`}
                              >
                                <div className={`w-4 h-4 rounded border flex items-center justify-center ${formData.userIds.includes(m.id) ? 'bg-red-500 border-red-500' : 'border-gray-600'}`}>
                                  {formData.userIds.includes(m.id) && <Check className="w-3 h-3 text-white" />}
                                </div>
                                {m.name}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">Причина и сроки</label>
                        <textarea
                          value={formData.reason}
                          onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                          placeholder="Администратор не указал причину..."
                          className={`w-full px-4 py-3 rounded-xl border h-[120px] resize-none ${theme === 'dark' ? 'bg-slate-900 border-white/10 text-white' : 'bg-white border-gray-200'} focus:ring-2 focus:ring-red-500 outline-none`}
                        />
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <input
                              type="datetime-local"
                              value={formData.expiresAt}
                              onChange={(e) => setFormData(prev => ({ ...prev, expiresAt: e.target.value }))}
                              className={`w-full px-4 py-3 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-white/10 text-white' : 'bg-white border-gray-200'} focus:ring-2 focus:ring-red-500 outline-none text-sm`}
                            />
                            <p className="text-[10px] text-gray-500 mt-1 ml-1">Пустое поле = Навсегда</p>
                          </div>
                          <label className="flex items-center gap-3 cursor-pointer select-none">
                            <div className="relative">
                              <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))} className="sr-only" />
                              <div className={`w-10 h-5 rounded-full transition-colors ${formData.isActive ? 'bg-green-500' : 'bg-gray-700'}`}>
                                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${formData.isActive ? 'left-6' : 'left-1'}`} />
                              </div>
                            </div>
                            <span className="text-xs font-bold text-gray-400">Активна</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* 2. Feature Selection - Иерархическая структура меню */}
                    <div className="space-y-4 pt-4 border-t border-white/5">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">Что именно блокируем?</label>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              // Выбрать все категории полностью
                              const allFeatures: AccessFeature[] = []
                              MENU_STRUCTURE.forEach(cat => {
                                const catFeature = CATEGORY_TO_FEATURES[cat.id]
                                if (catFeature) allFeatures.push(catFeature)
                                cat.items.forEach(item => allFeatures.push(item.value))
                              })
                              setFormData(prev => ({ ...prev, blockFeatures: allFeatures }))
                            }}
                            className="text-[10px] text-gray-500 hover:text-gray-300 underline"
                          >
                            Выбрать все
                          </button>
                          <span className="text-gray-600">|</span>
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, blockFeatures: [] }))}
                            className="text-[10px] text-gray-500 hover:text-gray-300 underline"
                          >
                            Очистить
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        {MENU_STRUCTURE.map(category => {
                          const isFullySelected = isCategoryFullySelected(category.id)
                          const isPartiallySelected = isCategoryPartiallySelected(category.id)
                          const isOpen = openCategories.has(category.id)
                          
                          return (
                            <div 
                              key={category.id} 
                              className={`rounded-xl border overflow-hidden ${
                                isFullySelected 
                                  ? 'border-red-500/50 bg-red-500/5' 
                                  : isPartiallySelected
                                    ? 'border-amber-500/30 bg-amber-500/5'
                                    : theme === 'dark' ? 'border-white/5 bg-black/20' : 'border-gray-200 bg-white'
                              }`}
                            >
                              {/* Заголовок категории - кнопка для выбора всей категории */}
                              <button
                                type="button"
                                onClick={() => handleCategoryToggle(category.id)}
                                className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                                    isFullySelected 
                                      ? 'bg-red-500 border-red-500' 
                                      : isPartiallySelected
                                        ? 'border-amber-500 bg-amber-500/20'
                                        : 'border-gray-600 hover:border-gray-500'
                                  }`}>
                                    {isFullySelected && <Check className="w-3 h-3 text-white" />}
                                    {isPartiallySelected && !isFullySelected && <div className="w-2 h-2 rounded-full bg-amber-500" />}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Folder className={`w-4 h-4 ${isFullySelected ? 'text-red-500' : 'text-gray-500'}`} />
                                    <h5 className={`font-bold text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                                      {category.label}
                                    </h5>
                                  </div>
                                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                                    isFullySelected 
                                      ? 'bg-red-500/20 text-red-500' 
                                      : isPartiallySelected
                                        ? 'bg-amber-500/20 text-amber-500'
                                        : 'bg-white/5 text-gray-500'
                                  }`}>
                                    {category.items.filter(item => isItemSelected(item.value)).length} / {category.items.length}
                                  </span>
                                </div>
                                <button 
                                  type="button" 
                                  onClick={(e) => { e.stopPropagation(); toggleCategory(category.id) }} 
                                  className="p-1 hover:bg-white/10 rounded"
                                >
                                  {isOpen ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronRight className="w-4 h-4 text-gray-500" />}
                                </button>
                              </button>

                              {/* Подпункты категории */}
                              {isOpen && (
                                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 border-t border-white/5">
                                  {category.items.map(item => {
                                    const isSelected = isItemSelected(item.value)
                                    return (
                                      <button
                                        key={item.value}
                                        type="button"
                                        onClick={() => handleItemToggle(item, category.id)}
                                        className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                                          isSelected 
                                            ? 'border-red-500/50 bg-red-500/10' 
                                            : 'border-white/5 hover:bg-white/5'
                                        }`}
                                      >
                                        <div className={`mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                                          isSelected 
                                            ? 'bg-red-500 border-red-500' 
                                            : 'border-gray-600 hover:border-gray-500'
                                        }`}>
                                          {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                                        </div>
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2">
                                            <FileText className={`w-3 h-3 ${isSelected ? 'text-red-500' : 'text-gray-500'}`} />
                                            <p className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-gray-400'}`}>
                                              {item.label}
                                            </p>
                                          </div>
                                          <p className="text-[10px] text-gray-500 leading-tight mt-0.5 ml-5">
                                            {item.description}
                                          </p>
                                        </div>
                                      </button>
                                    )
                                  })}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => { resetForm(); setShowAddForm(false); setEditingBlock(null); }}
                        className="px-6 py-3 rounded-xl border border-white/10 text-gray-400 font-bold hover:bg-white/5 transition-all text-sm"
                      >
                        Отмена
                      </button>
                      <button
                        type="submit"
                        disabled={saving || formData.blockFeatures.length === 0}
                        className="px-10 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-black transition-all flex items-center justify-center gap-2 min-w-[200px] shadow-lg shadow-red-500/20 disabled:opacity-50"
                      >
                        {saving ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white" /> : <><Save className="w-4 h-4" /> <span>{editingBlock ? 'Сохранить изменения' : 'Подтвердить блокировку'}</span></>}
                      </button>
                    </div>
                    {error && <p className="text-sm text-red-500 text-center font-bold bg-red-500/10 p-3 rounded-xl border border-red-500/20">{error}</p>}
                  </form>
                </div>
              )}

              {/* Blocks List Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                  <h4 className={`text-lg font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>История и активные блоки</h4>
                  {!showAddForm && !editingBlock && (
                    <button
                      onClick={() => setShowAddForm(true)}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-black shadow-lg shadow-red-500/20 transition-all"
                    >
                      <Plus className="w-4 h-4" /> Добавить блок
                    </button>
                  )}
                </div>

                {blocks.length === 0 ? (
                  <div className="py-20 text-center space-y-4">
                    <Shield className="w-16 h-16 text-gray-700 mx-auto opacity-20" />
                    <p className="text-gray-500 font-medium">Нет активных или прошлых блокировок</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {blocks.map(block => (
                      <div
                        key={block.id}
                        className={`group relative p-6 rounded-2xl border transition-all ${block.isActive && !isExpired(block.expiresAt) ? 'bg-red-500/5 border-red-500/30' : 'bg-white/2 border-white/5 grayscale opacity-60'}`}
                      >
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${block.isActive && !isExpired(block.expiresAt) ? 'bg-red-500 text-white' : 'bg-gray-700 text-white'}`}>
                              {block.targetType === 'single' ? <User className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                            </div>
                            <div>
                              <p className={`font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{getTargetLabel(block)}</p>
                              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{block.isActive && !isExpired(block.expiresAt) ? 'Активна' : 'Неактивна'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEdit(block)} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"><Edit className="w-4 h-4" /></button>
                            <button onClick={() => handleDelete(block.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{block.reason}</p>

                          <div className="flex flex-wrap gap-1.5">
                            {block.blockFeatures.slice(0, 3).map(f => (
                              <span key={f} className="text-[9px] font-black uppercase bg-white/5 px-2 py-0.5 rounded text-gray-500">{f}</span>
                            ))}
                            {block.blockFeatures.length > 3 && <span className="text-[9px] font-black uppercase bg-white/5 px-2 py-0.5 rounded text-gray-500">+{block.blockFeatures.length - 3}</span>}
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-white/5">
                            <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-bold">
                              <Clock className="w-3 h-3" />
                              <span>{block.expiresAt ? `До ${new Date(block.expiresAt).toLocaleDateString('ru-RU')}` : 'Навсегда'}</span>
                            </div>
                            <button
                              onClick={() => handleToggleActive(block)}
                              className={`text-[10px] font-black px-3 py-1 rounded-lg transition-all ${block.isActive && !isExpired(block.expiresAt) ? 'bg-green-500/10 text-green-500' : 'bg-white/5 text-gray-400'}`}
                            >
                              {block.isActive ? 'Выключить' : 'Включить'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
