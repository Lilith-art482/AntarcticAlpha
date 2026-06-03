import { useState, useEffect } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAdminStore } from '@/store/adminStore'
import { useAuthStore } from '@/store/authStore'
import { Lock, Users, Wallet, Copy, Check, Pencil, Trash2, Plus, Eye, EyeOff, Key, X, AlertTriangle, RefreshCw } from 'lucide-react'
import { TEAM_MEMBERS, UserWallet } from '@/types'
import { getUserWallets, addWallet, updateWallet, deleteWallet, getWalletPinCodePlainForAdmin } from '@/services/firestoreService'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/services/firebase'

// Тип для AW кошельков пользователя
interface UserAwWallets {
  userId: string
  userName: string
  avatar: string | undefined
  trc20: string
  ton: string
  pinCode: string | null
}

export const TeamWallets = () => {
  const { theme } = useThemeStore()
  const { isAdmin } = useAdminStore()
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState<'dex' | 'aw'>('dex')
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [allCopied, setAllCopied] = useState<string | null>(null)

  // DEX Wallets State
  const [dexWallets, setDexWallets] = useState<Record<string, UserWallet[]>>({})
  const [pinCodes, setPinCodes] = useState<Record<string, string | null>>({})
  const [loading, setLoading] = useState(true)
  const [expandedUser, setExpandedUser] = useState<string | null>(null)
  const [expandedWallet, setExpandedWallet] = useState<string | null>(null)

  // Edit/Add Modal State
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingWallet, setEditingWallet] = useState<UserWallet | null>(null)
  const [walletUserId, setWalletUserId] = useState<string>('')
  const [walletFormData, setWalletFormData] = useState({
    name: '',
    address: '',
    privateKey: '',
    seedPhrase: '',
    comment: ''
  })
  const [walletSaving, setWalletSaving] = useState(false)
  const [walletToDelete, setWalletToDelete] = useState<UserWallet | null>(null)

  // AW Wallets State
  const [awWallets, setAwWallets] = useState<UserAwWallets[]>([])
  const [awLoading, setAwLoading] = useState(true)
  const [editingAwWallet, setEditingAwWallet] = useState<{ userId: string; network: 'trc20' | 'ton' } | null>(null)
  const [awTempValue, setAwTempValue] = useState('')
  const [awSaving, setAwSaving] = useState(false)

  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const labelColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
  const cardBg = theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-white'

  // Copy to clipboard
  const copyToClipboard = (text: string, field: string) => {
    if (!text) return
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  // Copy all wallet data
  const copyAllWalletData = (wallet: UserWallet) => {
    const lines = [
      `Название: ${wallet.name}`,
      `Адрес: ${wallet.address}`,
      `Private Key: ${wallet.privateKey || '—'}`,
      `Seed Phrase: ${wallet.seedPhrase || '—'}`,
      `Описание: ${wallet.comment || '—'}`
    ].join('\n')
    navigator.clipboard.writeText(lines)
    setAllCopied(wallet.id)
    setTimeout(() => setAllCopied(null), 2000)
  }

  // Load all DEX wallets for all users
  const loadDexWallets = async () => {
    setLoading(true)
    try {
      const walletsMap: Record<string, UserWallet[]> = {}
      const pinCodesMap: Record<string, string | null> = {}

      for (const member of TEAM_MEMBERS) {
        try {
          const userWallets = await getUserWallets(member.id)
          if (userWallets.length > 0) {
            walletsMap[member.id] = userWallets
          }
          // Get plain PIN code for admin (with verification)
          if (user?.id) {
            const plainPin = await getWalletPinCodePlainForAdmin(member.id)
            pinCodesMap[member.id] = plainPin
          }
        } catch (error) {
          console.error(`Error loading wallets for user ${member.id}:`, error)
        }
      }

      setDexWallets(walletsMap)
      setPinCodes(pinCodesMap)
    } catch (error) {
      console.error('Error loading DEX wallets:', error)
    } finally {
      setLoading(false)
    }
  }

  // Load all AW wallets for all users
  const loadAwWallets = async () => {
    setAwLoading(true)
    try {
      const awData: UserAwWallets[] = []

      for (const member of TEAM_MEMBERS) {
        try {
          const userDoc = await getDoc(doc(db, 'users', member.id))
          // Get plain PIN code for admin (with verification)
          let plainPin: string | null = null
          if (user?.id) {
            plainPin = await getWalletPinCodePlainForAdmin(member.id)
          }
          if (userDoc.exists()) {
            const data = userDoc.data()
            awData.push({
              userId: member.id,
              userName: member.name,
              avatar: member.avatar,
              trc20: data.awWalletTRC20 || '',
              ton: data.awWalletTON || '',
              pinCode: plainPin
            })
          } else {
            awData.push({
              userId: member.id,
              userName: member.name,
              avatar: member.avatar,
              trc20: '',
              ton: '',
              pinCode: plainPin
            })
          }
        } catch (error) {
          console.error(`Error loading AW wallets for user ${member.id}:`, error)
        }
      }

      setAwWallets(awData)
    } catch (error) {
      console.error('Error loading AW wallets:', error)
    } finally {
      setAwLoading(false)
    }
  }

  useEffect(() => {
    // Check admin state immediately
    if (isAdmin) {
      setLoading(true)
      loadDexWallets()
      loadAwWallets()
    }
  }, [isAdmin])

  // Handle add wallet
  const handleAddWallet = async () => {
    if (!walletFormData.name || !walletFormData.address || !walletUserId) return

    setWalletSaving(true)
    try {
      await addWallet({
        userId: walletUserId,
        name: walletFormData.name,
        address: walletFormData.address,
        privateKey: walletFormData.privateKey || undefined,
        seedPhrase: walletFormData.seedPhrase || undefined,
        comment: walletFormData.comment || undefined,
      })
      await loadDexWallets()
      closeEditModal()
    } catch (error) {
      console.error('Error adding wallet:', error)
    } finally {
      setWalletSaving(false)
    }
  }

  // Handle edit wallet
  const handleEditWallet = async () => {
    if (!editingWallet || !walletFormData.name || !walletFormData.address) return

    setWalletSaving(true)
    try {
      await updateWallet(editingWallet.id, {
        name: walletFormData.name,
        address: walletFormData.address,
        privateKey: walletFormData.privateKey || undefined,
        seedPhrase: walletFormData.seedPhrase || undefined,
        comment: walletFormData.comment || undefined,
      })
      await loadDexWallets()
      closeEditModal()
    } catch (error) {
      console.error('Error updating wallet:', error)
    } finally {
      setWalletSaving(false)
    }
  }

  // Handle delete wallet
  const handleDeleteWallet = async () => {
    if (!walletToDelete) return

    try {
      await deleteWallet(walletToDelete.id)
      await loadDexWallets()
      setWalletToDelete(null)
    } catch (error) {
      console.error('Error deleting wallet:', error)
    }
  }

  // Open edit modal
  const openEditModal = (wallet: UserWallet | null, userId: string) => {
    if (wallet) {
      setEditingWallet(wallet)
      setWalletFormData({
        name: wallet.name,
        address: wallet.address,
        privateKey: wallet.privateKey || '',
        seedPhrase: wallet.seedPhrase || '',
        comment: wallet.comment || '',
      })
    } else {
      setEditingWallet(null)
      setWalletFormData({ name: '', address: '', privateKey: '', seedPhrase: '', comment: '' })
    }
    setWalletUserId(userId)
    setShowEditModal(true)
  }

  // Close edit modal
  const closeEditModal = () => {
    setShowEditModal(false)
    setEditingWallet(null)
    setWalletFormData({ name: '', address: '', privateKey: '', seedPhrase: '', comment: '' })
    setWalletUserId('')
  }

  // Save AW wallet
  const saveAwWallet = async (userId: string, network: 'trc20' | 'ton', value: string) => {
    setAwSaving(true)
    try {
      const updateData = network === 'trc20'
        ? { awWalletTRC20: value }
        : { awWalletTON: value }

      await updateDoc(doc(db, 'users', userId), updateData)
      await loadAwWallets()
      setEditingAwWallet(null)
      setAwTempValue('')
    } catch (error) {
      console.error('Error saving AW wallet:', error)
    } finally {
      setAwSaving(false)
    }
  }

  // Get user avatar - use directly from TEAM_MEMBERS
  const getUserAvatar = (avatarPath?: string) => {
    return avatarPath || '/default-avatar.png'
  }

  if (!isAdmin) {
    return (
      <div className={`rounded-2xl p-8 ${cardBg} shadow-xl border-2 ${theme === 'dark'
        ? 'border-red-500/30 bg-gradient-to-br from-[#1a1a1a] to-[#0A0A0A]'
        : 'border-red-200 bg-gradient-to-br from-white to-red-50/20'
        } relative overflow-hidden`}>
        <div className="text-center">
          <div className={`inline-flex p-4 rounded-2xl mb-4 ${theme === 'dark'
            ? 'bg-red-500/20'
            : 'bg-red-100'
            }`}>
            <Lock className={`w-12 h-12 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`} />
          </div>
          <h2 className={`text-2xl font-bold mb-2 ${headingColor}`}>Доступ запрещен</h2>
          <p className={labelColor}>
            Эта страница доступна только администраторам. Для входа используйте режим "Админ" на странице входа.
          </p>
        </div>
      </div>
    )
  }

  const usersWithDexWallets = TEAM_MEMBERS.filter(m => dexWallets[m.id] && dexWallets[m.id].length > 0)
  const totalDexWallets = Object.values(dexWallets).flat().length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`rounded-2xl p-6 ${cardBg} shadow-lg border-2 ${theme === 'dark' ? 'border-[#4C7F6E]/30' : 'border-[#4C7F6E]/20'}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${theme === 'dark' ? 'bg-[#4C7F6E]/20' : 'bg-[#4C7F6E]/10'}`}>
              <Wallet className={`w-6 h-6 text-[#4C7F6E]`} />
            </div>
            <div>
              <h1 className={`text-xl font-black ${headingColor}`}>Team Wallets</h1>
              <p className={`text-sm ${labelColor}`}>Управление кошельками команды</p>
            </div>
          </div>

          {/* Tabs */}
          <div className={`flex rounded-xl p-1 ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'}`}>
            <button
              onClick={() => setActiveTab('dex')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'dex'
                  ? 'bg-[#4C7F6E] text-white shadow-lg'
                  : theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              DEX Wallets
            </button>
            <button
              onClick={() => setActiveTab('aw')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'aw'
                  ? 'bg-[#4C7F6E] text-white shadow-lg'
                  : theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Wallets AW
            </button>
          </div>
        </div>
      </div>

      {/* DEX Wallets Tab */}
      {activeTab === 'dex' && (
        <div className={`rounded-2xl p-6 ${cardBg} shadow-lg border ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}>
          {loading ? (
            <div className={`text-center py-12 ${labelColor}`}>
              <div className="w-8 h-8 border-2 border-[#4C7F6E]/30 border-t-[#4C7F6E] rounded-full animate-spin mx-auto mb-3" />
              Загрузка кошельков...
            </div>
          ) : usersWithDexWallets.length === 0 ? (
            <div className={`text-center py-12 rounded-2xl border-2 border-dashed ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}>
              <Wallet className={`w-12 h-12 mx-auto mb-3 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
              <p className={`text-base font-bold mb-1 ${headingColor}`}>Нет сохранённых кошельков</p>
              <p className={`text-sm ${labelColor}`}>Пользователи пока не добавили кошельки DEX</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Stats */}
              <div className={`flex items-center justify-between p-4 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#4C7F6E]" />
                    <span className={`text-sm ${labelColor}`}>{usersWithDexWallets.length} пользователей</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-[#4C7F6E]" />
                    <span className={`text-sm ${labelColor}`}>{totalDexWallets} кошельков</span>
                  </div>
                </div>
              </div>

              {/* Users List */}
              {usersWithDexWallets.map((member) => {
                const wallets = dexWallets[member.id] || []
                const isExpanded = expandedUser === member.id
                const hasPin = pinCodes[member.id]

                return (
                  <div key={member.id} className={`rounded-2xl border overflow-hidden ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}>
                    {/* User Header */}
                    <div
                      onClick={() => setExpandedUser(isExpanded ? null : member.id)}
                      className={`flex items-center justify-between p-4 cursor-pointer transition-all ${
                        theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={getUserAvatar(member.avatar)}
                          alt={member.name}
                          className="w-10 h-10 rounded-full object-cover border-2 border-[#4C7F6E]/30"
                        />
                        <div>
                          <h3 className={`font-bold ${headingColor}`}>{member.name}</h3>
                          <div className="flex items-center gap-2 text-xs">
                            <span className={labelColor}>{wallets.length} кошельков</span>
                            {hasPin && (
                              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#4C7F6E]/10 text-[#4C7F6E]">
                                <Key className="w-3 h-3" />
                                PIN установлен
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className={`p-4 border-t ${theme === 'dark' ? 'border-white/10 bg-white/[0.02]' : 'border-gray-100 bg-gray-50/50'}`}>
                        {/* PIN Code Display */}
                        <div className={`flex items-center gap-3 p-3 rounded-xl mb-4 ${theme === 'dark' ? 'bg-[#4C7F6E]/10' : 'bg-[#4C7F6E]/5'}`}>
                          <Key className="w-4 h-4 text-[#4C7F6E]" />
                          <span className={`text-sm ${labelColor}`}>PIN-код:</span>
                          <code className={`font-mono font-bold ${headingColor}`}>
                            {hasPin || '—'}
                          </code>
                        </div>

                        {/* Add Wallet Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            openEditModal(null, member.id)
                          }}
                          className="w-full mb-4 py-2.5 rounded-xl border-2 border-dashed border-[#4C7F6E]/30 hover:border-[#4C7F6E] text-[#4C7F6E] font-bold text-sm transition-all flex items-center justify-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Добавить кошелёк
                        </button>

                        {/* Wallets List */}
                        <div className="space-y-3">
                          {wallets.map((wallet) => {
                            const isWalletExpanded = expandedWallet === wallet.id

                            return (
                              <div key={wallet.id} className={`rounded-xl border ${theme === 'dark' ? 'border-white/10 bg-[#121620]' : 'border-gray-200 bg-white'}`}>
                                {/* Wallet Header */}
                                <div className="p-4">
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-1">
                                        <h4 className={`font-bold ${headingColor}`}>{wallet.name}</h4>
                                        <button
                                          onClick={() => copyToClipboard(wallet.name, `name-${wallet.id}`)}
                                          className="p-1 hover:bg-[#4C7F6E]/10 rounded transition-colors"
                                        >
                                          {copiedField === `name-${wallet.id}` ? (
                                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                                          ) : (
                                            <Copy className="w-3.5 h-3.5 text-gray-400" />
                                          )}
                                        </button>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <code className={`text-xs font-mono px-2 py-0.5 rounded ${theme === 'dark' ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                                          {wallet.address.slice(0, 8)}...{wallet.address.slice(-8)}
                                        </code>
                                        <button
                                          onClick={() => copyToClipboard(wallet.address, `addr-${wallet.id}`)}
                                          className="p-1 hover:bg-[#4C7F6E]/10 rounded transition-colors"
                                        >
                                          {copiedField === `addr-${wallet.id}` ? (
                                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                                          ) : (
                                            <Copy className="w-3.5 h-3.5 text-gray-400" />
                                          )}
                                        </button>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-1">
                                      <button
                                        onClick={() => setExpandedWallet(isWalletExpanded ? null : wallet.id)}
                                        className={`p-2 rounded-lg transition-all ${
                                          isWalletExpanded
                                            ? 'bg-[#4C7F6E] text-white'
                                            : theme === 'dark' ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                                        }`}
                                        title={isWalletExpanded ? 'Скрыть детали' : 'Показать детали'}
                                      >
                                        {isWalletExpanded ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                      </button>
                                      <button
                                        onClick={() => openEditModal(wallet, member.id)}
                                        className={`p-2 rounded-lg transition-all ${theme === 'dark' ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
                                        title="Редактировать"
                                      >
                                        <Pencil className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => setWalletToDelete(wallet)}
                                        className={`p-2 rounded-lg transition-all ${theme === 'dark' ? 'hover:bg-red-500/10 text-red-400' : 'hover:bg-red-50 text-red-500'}`}
                                        title="Удалить"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>

                                  {/* Expandable Details */}
                                  {isWalletExpanded && (
                                    <div className={`mt-4 pt-4 border-t ${theme === 'dark' ? 'border-white/10' : 'border-gray-100'}`}>
                                      <div className="grid grid-cols-1 gap-3">
                                        {/* Private Key */}
                                        <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                          <div className="flex items-center justify-between mb-1">
                                            <span className={`text-[10px] font-black uppercase tracking-wider ${labelColor}`}>Private Key</span>
                                            <button
                                              onClick={() => copyToClipboard(wallet.privateKey || '', `pk-${wallet.id}`)}
                                              className="text-[10px] font-bold text-[#4C7F6E] hover:underline"
                                            >
                                              {copiedField === `pk-${wallet.id}` ? 'Скопировано' : 'Копировать'}
                                            </button>
                                          </div>
                                          <code className={`text-xs font-mono break-all ${wallet.privateKey ? (theme === 'dark' ? 'text-[#4C7F6E]' : 'text-[#4C7F6E]') : 'text-gray-500'}`}>
                                            {wallet.privateKey || '—'}
                                          </code>
                                        </div>

                                        {/* Seed Phrase */}
                                        <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                          <div className="flex items-center justify-between mb-2">
                                            <span className={`text-[10px] font-black uppercase tracking-wider ${labelColor}`}>Seed Phrase</span>
                                            {wallet.seedPhrase && (
                                              <button
                                                onClick={() => copyToClipboard(wallet.seedPhrase || '', `seed-${wallet.id}`)}
                                                className="text-[10px] font-bold text-[#4C7F6E] hover:underline"
                                              >
                                                {copiedField === `seed-${wallet.id}` ? 'Скопировано' : 'Копировать'}
                                              </button>
                                            )}
                                          </div>
                                          {wallet.seedPhrase ? (
                                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                                              {wallet.seedPhrase.split(/\s+/).map((word, idx) => (
                                                <div key={idx} className={`px-2 py-1 rounded border flex items-center gap-1.5 ${theme === 'dark' ? 'bg-black/20 border-white/5' : 'bg-white border-gray-200'}`}>
                                                  <span className="text-[8px] font-black text-[#4C7F6E]/50">{idx + 1}</span>
                                                  <span className={`text-[10px] font-mono font-bold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{word}</span>
                                                </div>
                                              ))}
                                            </div>
                                          ) : (
                                            <span className="text-gray-500 text-xs">—</span>
                                          )}
                                        </div>

                                        {/* Comment */}
                                        <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                          <span className={`text-[10px] font-black uppercase tracking-wider ${labelColor} block mb-1`}>Описание</span>
                                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                            {wallet.comment || '—'}
                                          </p>
                                        </div>
                                      </div>

                                      {/* Copy All Button */}
                                      <button
                                        onClick={() => copyAllWalletData(wallet)}
                                        className={`w-full mt-3 py-2 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                                          allCopied === wallet.id
                                            ? 'bg-emerald-500 text-white'
                                            : theme === 'dark' ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                                        }`}
                                      >
                                        {allCopied === wallet.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                        {allCopied === wallet.id ? 'Скопировано' : 'Копировать все данные'}
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* AW Wallets Tab */}
      {activeTab === 'aw' && (
        <div className={`rounded-2xl p-6 ${cardBg} shadow-lg border ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}>
          {awLoading ? (
            <div className={`text-center py-12 ${labelColor}`}>
              <div className="w-8 h-8 border-2 border-[#4C7F6E]/30 border-t-[#4C7F6E] rounded-full animate-spin mx-auto mb-3" />
              Загрузка кошельков...
            </div>
          ) : (
            <div className="space-y-4">
              {/* Stats */}
              <div className={`flex items-center gap-4 p-4 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#4C7F6E]" />
                  <span className={`text-sm ${labelColor}`}>{awWallets.length} пользователей</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-[#4C7F6E]" />
                  <span className={`text-sm ${labelColor}`}>
                    TRC-20: {awWallets.filter(w => w.trc20).length} | TON: {awWallets.filter(w => w.ton).length}
                  </span>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`border-b ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}>
                      <th className={`text-left p-3 text-xs font-black uppercase tracking-wider ${labelColor}`}>Пользователь</th>
                      <th className={`text-left p-3 text-xs font-black uppercase tracking-wider ${labelColor}`}>PIN</th>
                      <th className={`text-left p-3 text-xs font-black uppercase tracking-wider ${labelColor}`}>TRC-20</th>
                      <th className={`text-left p-3 text-xs font-black uppercase tracking-wider ${labelColor}`}>TON</th>
                    </tr>
                  </thead>
                  <tbody>
                    {awWallets.map((user) => (
                      <tr key={user.userId} className={`border-b ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'}`}>
                        {/* User */}
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={getUserAvatar(user.avatar)}
                              alt={user.userName}
                              className="w-8 h-8 rounded-full object-cover border-2 border-[#4C7F6E]/30"
                            />
                            <span className={`font-bold text-sm ${headingColor}`}>{user.userName}</span>
                          </div>
                        </td>

                        {/* PIN */}
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            {user.pinCode ? (
                              <>
                                <Key className="w-3.5 h-3.5 text-[#4C7F6E]" />
                                <code className={`text-xs font-mono ${headingColor}`}>{user.pinCode}</code>
                              </>
                            ) : (
                              <span className="text-gray-500 text-sm">—</span>
                            )}
                          </div>
                        </td>

                        {/* TRC-20 */}
                        <td className="p-3">
                          {editingAwWallet?.userId === user.userId && editingAwWallet.network === 'trc20' ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={awTempValue}
                                onChange={(e) => setAwTempValue(e.target.value)}
                                placeholder="Адрес TRC-20"
                                className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${
                                  theme === 'dark'
                                    ? 'bg-white/5 border-white/10 text-white focus:border-[#4C7F6E]'
                                    : 'bg-white border-gray-200 text-gray-900 focus:border-[#4C7F6E]'
                                }`}
                              />
                              <button
                                onClick={() => saveAwWallet(user.userId, 'trc20', awTempValue.trim())}
                                disabled={awSaving}
                                className="p-1.5 rounded-lg bg-[#4C7F6E] text-white hover:bg-[#3d6b5a] transition-colors"
                              >
                                {awSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                              </button>
                              <button
                                onClick={() => { setEditingAwWallet(null); setAwTempValue('') }}
                                className="p-1.5 rounded-lg bg-gray-500/20 text-gray-400 hover:bg-gray-500/30 transition-colors"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              {user.trc20 ? (
                                <>
                                  <code className={`text-xs font-mono truncate max-w-[150px] ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                    {user.trc20.slice(0, 10)}...{user.trc20.slice(-10)}
                                  </code>
                                  <button
                                    onClick={() => copyToClipboard(user.trc20, `trc20-${user.userId}`)}
                                    className="p-1 hover:bg-[#4C7F6E]/10 rounded transition-colors"
                                  >
                                    {copiedField === `trc20-${user.userId}` ? (
                                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                                    ) : (
                                      <Copy className="w-3.5 h-3.5 text-gray-400" />
                                    )}
                                  </button>
                                </>
                              ) : (
                                <span className="text-gray-500 text-sm">—</span>
                              )}
                              <button
                                onClick={() => { setEditingAwWallet({ userId: user.userId, network: 'trc20' }); setAwTempValue(user.trc20) }}
                                className={`p-1 rounded transition-colors ${theme === 'dark' ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </td>

                        {/* TON */}
                        <td className="p-3">
                          {editingAwWallet?.userId === user.userId && editingAwWallet.network === 'ton' ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={awTempValue}
                                onChange={(e) => setAwTempValue(e.target.value)}
                                placeholder="Адрес TON"
                                className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${
                                  theme === 'dark'
                                    ? 'bg-white/5 border-white/10 text-white focus:border-[#4C7F6E]'
                                    : 'bg-white border-gray-200 text-gray-900 focus:border-[#4C7F6E]'
                                }`}
                              />
                              <button
                                onClick={() => saveAwWallet(user.userId, 'ton', awTempValue.trim())}
                                disabled={awSaving}
                                className="p-1.5 rounded-lg bg-[#4C7F6E] text-white hover:bg-[#3d6b5a] transition-colors"
                              >
                                {awSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                              </button>
                              <button
                                onClick={() => { setEditingAwWallet(null); setAwTempValue('') }}
                                className="p-1.5 rounded-lg bg-gray-500/20 text-gray-400 hover:bg-gray-500/30 transition-colors"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              {user.ton ? (
                                <>
                                  <code className={`text-xs font-mono truncate max-w-[150px] ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                    {user.ton.slice(0, 10)}...{user.ton.slice(-10)}
                                  </code>
                                  <button
                                    onClick={() => copyToClipboard(user.ton, `ton-${user.userId}`)}
                                    className="p-1 hover:bg-[#4C7F6E]/10 rounded transition-colors"
                                  >
                                    {copiedField === `ton-${user.userId}` ? (
                                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                                    ) : (
                                      <Copy className="w-3.5 h-3.5 text-gray-400" />
                                    )}
                                  </button>
                                </>
                              ) : (
                                <span className="text-gray-500 text-sm">—</span>
                              )}
                              <button
                                onClick={() => { setEditingAwWallet({ userId: user.userId, network: 'ton' }); setAwTempValue(user.ton) }}
                                className={`p-1 rounded transition-colors ${theme === 'dark' ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Edit/Add Wallet Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeEditModal} />
          <div className={`relative w-full max-w-lg p-6 rounded-2xl shadow-2xl ${theme === 'dark' ? 'bg-[#1a1a1a] border border-white/10' : 'bg-white border border-gray-200'}`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-lg font-black ${headingColor}`}>
                {editingWallet ? 'Редактировать кошелёк' : 'Добавить кошелёк'}
              </h3>
              <button onClick={closeEditModal} className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`text-xs font-black uppercase tracking-wider ${labelColor} block mb-1.5`}>Название *</label>
                <input
                  type="text"
                  value={walletFormData.name}
                  onChange={(e) => setWalletFormData({ ...walletFormData, name: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border transition-all ${
                    theme === 'dark'
                      ? 'bg-white/5 border-white/10 text-white focus:border-[#4C7F6E]'
                      : 'bg-white border-gray-200 text-gray-900 focus:border-[#4C7F6E]'
                  }`}
                  placeholder="Мой кошелёк"
                />
              </div>

              <div>
                <label className={`text-xs font-black uppercase tracking-wider ${labelColor} block mb-1.5`}>Адрес *</label>
                <input
                  type="text"
                  value={walletFormData.address}
                  onChange={(e) => setWalletFormData({ ...walletFormData, address: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border font-mono text-sm transition-all ${
                    theme === 'dark'
                      ? 'bg-white/5 border-white/10 text-white focus:border-[#4C7F6E]'
                      : 'bg-white border-gray-200 text-gray-900 focus:border-[#4C7F6E]'
                  }`}
                  placeholder="0x..."
                />
              </div>

              <div>
                <label className={`text-xs font-black uppercase tracking-wider ${labelColor} block mb-1.5`}>Private Key</label>
                <textarea
                  value={walletFormData.privateKey}
                  onChange={(e) => setWalletFormData({ ...walletFormData, privateKey: e.target.value })}
                  rows={2}
                  className={`w-full px-4 py-3 rounded-xl border font-mono text-sm transition-all resize-none ${
                    theme === 'dark'
                      ? 'bg-white/5 border-white/10 text-white focus:border-[#4C7F6E]'
                      : 'bg-white border-gray-200 text-gray-900 focus:border-[#4C7F6E]'
                  }`}
                  placeholder="Приватный ключ (опционально)"
                />
              </div>

              <div>
                <label className={`text-xs font-black uppercase tracking-wider ${labelColor} block mb-1.5`}>Seed Phrase</label>
                <textarea
                  value={walletFormData.seedPhrase}
                  onChange={(e) => setWalletFormData({ ...walletFormData, seedPhrase: e.target.value })}
                  rows={2}
                  className={`w-full px-4 py-3 rounded-xl border font-mono text-sm transition-all resize-none ${
                    theme === 'dark'
                      ? 'bg-white/5 border-white/10 text-white focus:border-[#4C7F6E]'
                      : 'bg-white border-gray-200 text-gray-900 focus:border-[#4C7F6E]'
                  }`}
                  placeholder="word1 word2 word3... (опционально)"
                />
              </div>

              <div>
                <label className={`text-xs font-black uppercase tracking-wider ${labelColor} block mb-1.5`}>Описание</label>
                <textarea
                  value={walletFormData.comment}
                  onChange={(e) => setWalletFormData({ ...walletFormData, comment: e.target.value })}
                  rows={2}
                  className={`w-full px-4 py-3 rounded-xl border text-sm transition-all resize-none ${
                    theme === 'dark'
                      ? 'bg-white/5 border-white/10 text-white focus:border-[#4C7F6E]'
                      : 'bg-white border-gray-200 text-gray-900 focus:border-[#4C7F6E]'
                  }`}
                  placeholder="Комментарий к кошельку (опционально)"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={closeEditModal}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
                  theme === 'dark' ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}
              >
                Отмена
              </button>
              <button
                onClick={editingWallet ? handleEditWallet : handleAddWallet}
                disabled={walletSaving || !walletFormData.name || !walletFormData.address}
                className="flex-1 py-3 rounded-xl bg-[#4C7F6E] hover:bg-[#3d6b5a] text-white font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {walletSaving ? 'Сохранение...' : editingWallet ? 'Сохранить' : 'Добавить'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {walletToDelete && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setWalletToDelete(null)} />
          <div className={`relative w-full max-w-md p-6 rounded-2xl shadow-2xl ${theme === 'dark' ? 'bg-[#1a1a1a] border border-red-500/30' : 'bg-white border border-red-200'}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2.5 rounded-xl ${theme === 'dark' ? 'bg-red-500/20' : 'bg-red-100'}`}>
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className={`text-lg font-black ${headingColor}`}>Удалить кошелёк?</h3>
                <p className={`text-sm ${labelColor}`}>Это действие нельзя отменить</p>
              </div>
            </div>

            <div className={`p-4 rounded-xl mb-4 ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
              <p className={`text-sm font-bold ${headingColor}`}>{walletToDelete.name}</p>
              <code className={`text-xs font-mono ${labelColor}`}>{walletToDelete.address.slice(0, 12)}...{walletToDelete.address.slice(-12)}</code>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setWalletToDelete(null)}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
                  theme === 'dark' ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}
              >
                Отмена
              </button>
              <button
                onClick={handleDeleteWallet}
                className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition-all"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
