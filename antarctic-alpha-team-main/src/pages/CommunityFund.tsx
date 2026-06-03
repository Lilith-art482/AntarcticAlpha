import { useState, useEffect } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { useAdminStore } from '@/store/adminStore'
import { useUsers } from '@/hooks/useUsers'
import {
  Wallet,
  Plus,
  Users,
  FileText,
  ThumbsUp,
  ThumbsDown,
  PiggyBank,
  DollarSign,
  TrendingUp,
  Shield,
  BarChart3,
  PieChart,
  CheckCircle2,
  XCircle,
  X,
  Send,
  ChevronDown,
  Trash2,
  Upload,
  Link as LinkIcon,
  Image,
  MessageSquare,
  Clock,
  Rocket,
  TrendingDown,
  Gem,
  Coins,
  Gift,
  Sparkles,
} from 'lucide-react'
import {
  CompensationRequest,
  CompensationRequestStatus,
  CommunityFundSphere,
  COMMUNITY_FUND_SPHERES,
  DiversificationEntry,
  Earnings,
  PoolContribution,
} from '@/types'
import {
  getCompensationRequests,
  addCompensationRequest,
  voteCompensationRequest,
  approveCompensationRequest,
  rejectCompensationRequest,
  markCompensationRequestPaid,
  deleteCompensationRequest,
  getDiversificationEntries,
  addDiversificationEntry,
  deleteDiversificationEntry,
  getCommunityFundStats,
  getPoolContributions,
  deletePoolContribution,
  adjustPoolManually,
} from '@/services/firestoreService'
import { formatDate } from '@/utils/dateUtils'
import { getUserNicknameAsync } from '@/utils/userUtils'
import { UserNickname } from '@/components/UserNickname'
import Avatar from '@/components/Avatar'

// Status badges
const statusBadgeMap: Record<CompensationRequestStatus, { bg: string; text: string; icon: JSX.Element; label: string }> = {
  pending: {
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    text: 'text-amber-800 dark:text-amber-200',
    icon: <Clock className="w-3.5 h-3.5" />,
    label: 'На рассмотрении',
  },
  voting: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-800 dark:text-blue-200',
    icon: <ThumbsUp className="w-3.5 h-3.5" />,
    label: 'Голосование',
  },
  approved: {
    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
    text: 'text-emerald-800 dark:text-emerald-200',
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    label: 'Одобрено',
  },
  rejected: {
    bg: 'bg-rose-100 dark:bg-rose-900/30',
    text: 'text-rose-800 dark:text-rose-200',
    icon: <XCircle className="w-3.5 h-3.5" />,
    label: 'Отклонено',
  },
  paid: {
    bg: 'bg-purple-100 dark:bg-purple-900/30',
    text: 'text-purple-800 dark:text-purple-200',
    icon: <DollarSign className="w-3.5 h-3.5" />,
    label: 'Одобрено',
  },
}

// Stat Card Component
const StatCard = ({
  label,
  value,
  icon,
  accentColor,
  theme,
}: {
  label: string
  value: string | number
  icon: React.ReactNode
  accentColor: string
  theme: string
}) => (
  <div
    className={`relative overflow-hidden rounded-2xl p-5 border transition-all duration-300 hover:shadow-lg ${
      theme === 'dark'
        ? `bg-white/5 border-white/10 hover:border-white/20 ${accentColor}`
        : `bg-white border-gray-100 hover:border-gray-200 shadow-sm`
    }`}
  >
    <div className="absolute top-0 right-0 w-24 h-24 bg-current opacity-5 blur-2xl rounded-full -mr-12 -mt-12" />
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-4">
        <span
          className={`text-[10px] font-black uppercase tracking-widest ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}
        >
          {label}
        </span>
        <div className={`p-2 rounded-xl ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-100'}`}>{icon}</div>
      </div>
      <p
        className={`text-2xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
      >
        {typeof value === 'number' ? value.toLocaleString() : value} ₽
      </p>
    </div>
  </div>
)

// Sphere icons mapping with colors
const sphereIcons: Record<CommunityFundSphere, { icon: React.ReactNode; color: string }> = {
  memecoins: { icon: <Rocket className="w-5 h-5" />, color: 'text-emerald-500' },
  futures: { icon: <TrendingDown className="w-5 h-5" />, color: 'text-blue-500' },
  nft: { icon: <Gem className="w-5 h-5" />, color: 'text-purple-500' },
  spot: { icon: <Coins className="w-5 h-5" />, color: 'text-amber-500' },
  airdrop: { icon: <Gift className="w-5 h-5" />, color: 'text-cyan-500' },
  polymarket: { icon: <BarChart3 className="w-5 h-5" />, color: 'text-pink-500' },
  staking: { icon: <Shield className="w-5 h-5" />, color: 'text-indigo-500' },
  other: { icon: <Sparkles className="w-5 h-5" />, color: 'text-gray-500' },
}

// Compensation Request Form Modal
const CompensationFormModal = ({
  onClose,
  onSubmit,
  theme,
}: {
  onClose: () => void
  onSubmit: (data: Omit<CompensationRequest, 'id' | 'userId' | 'userName' | 'status' | 'votes' | 'createdAt' | 'updatedAt'>) => void
  theme: string
}) => {
  const [sphere, setSphere] = useState<CommunityFundSphere>('memecoins')
  const [dealDate, setDealDate] = useState(new Date().toISOString().split('T')[0])
  const [dealTime, setDealTime] = useState('12:00')
  const [comment, setComment] = useState('')
  const [screenshots, setScreenshots] = useState<string[]>([])
  const [links, setLinks] = useState<{ url: string; name: string }[]>([])
  const [requestedAmount, setRequestedAmount] = useState('')
  const [linkUrlInput, setLinkUrlInput] = useState('')
  const [linkNameInput, setLinkNameInput] = useState('')
  const [showSphereDropdown, setShowSphereDropdown] = useState(false)
  const [uploadingScreenshot, setUploadingScreenshot] = useState(false)

  const handleFileScreenshot = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploadingScreenshot(true)
    try {
      for (let i = 0; i < files.length && screenshots.length + i < 10; i++) {
        const file = files[i]
        if (!file.type.startsWith('image/')) continue

        const reader = new FileReader()
        const base64 = await new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string)
          reader.readAsDataURL(file)
        })
        
        setScreenshots((prev) => [...prev, base64])
      }
    } catch (error) {
      console.error('Error uploading screenshot:', error)
    } finally {
      setUploadingScreenshot(false)
    }
  }

  const handleRemoveScreenshot = (index: number) => {
    setScreenshots(screenshots.filter((_, i) => i !== index))
  }

  const handleAddLink = () => {
    if (linkUrlInput.trim() && links.length < 15) {
      setLinks([...links, { url: linkUrlInput.trim(), name: linkNameInput.trim() }])
      setLinkUrlInput('')
      setLinkNameInput('')
    }
  }

  const handleRemoveLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      sphere,
      dealDate,
      dealTime,
      comments: comment.trim() ? [comment.trim()] : [],
      screenshots,
      links: links.filter((l) => l.url.trim()),
      requestedAmount: parseFloat(requestedAmount) || 0,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border ${
          theme === 'dark'
            ? 'bg-[#0f1624] border-white/10'
            : 'bg-white border-gray-200'
        } shadow-2xl`}
      >
        {/* Header */}
        <div
          className={`sticky top-0 z-10 flex items-center justify-between p-6 border-b ${
            theme === 'dark' ? 'border-white/10 bg-[#0f1624]' : 'border-gray-200 bg-white'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#4C7F6E]/20">
              <FileText className="w-5 h-5 text-[#4C7F6E]" />
            </div>
            <h2 className={`text-xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Заявка на компенсацию
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors ${
              theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Sphere */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Сфера сделки
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowSphereDropdown(!showSphereDropdown)}
                className={`w-full flex items-center justify-between p-4 rounded-xl border ${
                  theme === 'dark'
                    ? 'bg-white/5 border-white/10 hover:border-white/20'
                    : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                } transition-colors`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    theme === 'dark' ? 'bg-white/10' : 'bg-gray-100'
                  } ${sphereIcons[sphere].color}`}>
                    {sphereIcons[sphere].icon}
                  </div>
                  <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                    {COMMUNITY_FUND_SPHERES[sphere].label}
                  </span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${
                    showSphereDropdown ? 'rotate-180' : ''
                  } ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
                />
              </button>
              {showSphereDropdown && (
                <div
                  className={`absolute z-20 w-full mt-2 rounded-xl border overflow-hidden ${
                    theme === 'dark'
                      ? 'bg-[#1a2535] border-white/10'
                      : 'bg-white border-gray-200 shadow-lg'
                  }`}
                >
                  {(Object.keys(COMMUNITY_FUND_SPHERES) as CommunityFundSphere[]).map((key) => {
                    const isSelected = sphere === key
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => {
                          setSphere(key)
                          setShowSphereDropdown(false)
                        }}
                        className={`w-full p-3 text-left text-sm hover:bg-[#4C7F6E]/10 transition-colors flex items-center gap-3 ${
                          theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700'
                        } ${isSelected ? 'bg-[#4C7F6E]/20' : ''}`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          isSelected 
                            ? 'bg-[#4C7F6E] text-white'
                            : theme === 'dark' ? 'bg-white/10' : 'bg-gray-100'
                        } ${isSelected ? '' : sphereIcons[key].color}`}>
                          {sphereIcons[key].icon}
                        </div>
                        {COMMUNITY_FUND_SPHERES[key].label}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Дата сделки
              </label>
              <input
                type="date"
                value={dealDate}
                onChange={(e) => setDealDate(e.target.value)}
                className={`w-full p-4 rounded-xl border ${
                  theme === 'dark'
                    ? 'bg-white/5 border-white/10 text-white'
                    : 'bg-gray-50 border-gray-200 text-gray-900'
                }`}
              />
            </div>
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Время сделки
              </label>
              <input
                type="time"
                value={dealTime}
                onChange={(e) => setDealTime(e.target.value)}
                className={`w-full p-4 rounded-xl border ${
                  theme === 'dark'
                    ? 'bg-white/5 border-white/10 text-white'
                    : 'bg-gray-50 border-gray-200 text-gray-900'
                }`}
              />
            </div>
          </div>

          {/* Comment */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Комментарий
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Опишите сделку, причину компенсации и другие детали"
              rows={4}
              className={`w-full p-4 rounded-xl border text-sm resize-none ${
                theme === 'dark'
                  ? 'bg-white/5 border-white/10 text-white placeholder-gray-500'
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
              }`}
            />
          </div>

          {/* Screenshots */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Скриншоты (до 10)
              </label>
              <span className="text-xs text-gray-500">{screenshots.length}/10</span>
            </div>
            <div className="mb-2">
              <label
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl cursor-pointer transition-colors ${
                  uploadingScreenshot
                    ? 'bg-gray-500/20 text-gray-500'
                    : theme === 'dark'
                    ? 'bg-white/10 hover:bg-white/20 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                } ${screenshots.length >= 10 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {uploadingScreenshot ? (
                  <div className="w-4 h-4 border-2 border-gray-500/30 border-t-gray-500 rounded-full animate-spin" />
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span className="text-sm font-medium">Загрузить скриншоты</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileScreenshot}
                  disabled={screenshots.length >= 10 || uploadingScreenshot}
                  className="hidden"
                />
              </label>
            </div>
            {screenshots.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {screenshots.map((screenshot, index) => (
                  <div
                    key={index}
                    className={`relative group flex items-center gap-2 px-3 py-2 rounded-lg ${
                      theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'
                    }`}
                  >
                    {screenshot.startsWith('data:') ? (
                      <img 
                        src={screenshot} 
                        alt={`Скриншот ${index + 1}`}
                        className="w-8 h-8 object-cover rounded"
                      />
                    ) : (
                      <Image className="w-4 h-4 text-[#4C7F6E]" />
                    )}
                    <span className="text-xs truncate max-w-[150px]">
                      Файл {index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveScreenshot(index)}
                      className="p-0.5 hover:bg-rose-500/20 rounded"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Links */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Ссылки (до 15)
              </label>
              <span className="text-xs text-gray-500">{links.length}/15</span>
            </div>
            <div className="space-y-2 mb-2">
              <div className="flex gap-2">
                <input
                  type="url"
                  value={linkUrlInput}
                  onChange={(e) => setLinkUrlInput(e.target.value)}
                  placeholder="Ссылка"
                  className={`flex-1 p-3 rounded-xl border text-sm ${
                    theme === 'dark'
                      ? 'bg-white/5 border-white/10 text-white placeholder-gray-500'
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                  }`}
                />
                <input
                  type="text"
                  value={linkNameInput}
                  onChange={(e) => setLinkNameInput(e.target.value)}
                  placeholder="Название"
                  className={`flex-1 p-3 rounded-xl border text-sm ${
                    theme === 'dark'
                      ? 'bg-white/5 border-white/10 text-white placeholder-gray-500'
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                  }`}
                />
              </div>
              <button
                type="button"
                onClick={handleAddLink}
                disabled={!linkUrlInput.trim() || links.length >= 15}
                className="w-full py-2 rounded-xl bg-[#4C7F6E]/20 text-[#4C7F6E] hover:bg-[#4C7F6E]/30 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Добавить ссылку
              </button>
            </div>
            {links.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {links.map((link, index) => (
                      <div
                        key={index}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                          theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'
                        }`}
                      >
                        <LinkIcon className="w-4 h-4 text-[#4C7F6E]" />
                        <span className="text-xs truncate max-w-[150px]">
                          {link.name || link.url}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveLink(index)}
                          className="p-0.5 hover:bg-rose-500/20 rounded"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
              </div>
            )}
          </div>

          {/* Amount */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Запрашиваемая сумма (₽)
            </label>
            <input
              type="number"
              value={requestedAmount}
              onChange={(e) => setRequestedAmount(e.target.value)}
              placeholder="0"
              min="0"
              step="100"
              className={`w-full p-4 rounded-xl border ${
                theme === 'dark'
                  ? 'bg-white/5 border-white/10 text-white placeholder-gray-500'
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
              }`}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-[#4C7F6E] hover:bg-[#3d6a5c] text-white font-bold transition-colors flex items-center justify-center gap-2"
          >
            <Send className="w-5 h-5" />
            Отправить заявку
          </button>
        </form>
      </div>
    </div>
  )
}

// Diversification Form Modal (Admin)
const DiversificationFormModal = ({
  onClose,
  onSubmit,
  theme,
}: {
  onClose: () => void
  onSubmit: (data: Omit<DiversificationEntry, 'id' | 'createdAt'>) => void
  theme: string
}) => {
  const { user } = useAuthStore()
  const [amount, setAmount] = useState('')
  const [asset, setAsset] = useState('')
  const [duration, setDuration] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      amount: parseFloat(amount) || 0,
      asset: asset.trim(),
      duration: duration.trim(),
      date,
      createdBy: user?.id || '',
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className={`relative w-full max-w-md rounded-3xl border ${
          theme === 'dark'
            ? 'bg-[#0f1624] border-white/10'
            : 'bg-white border-gray-200'
        } shadow-2xl`}
      >
        <div
          className={`flex items-center justify-between p-6 border-b ${
            theme === 'dark' ? 'border-white/10' : 'border-gray-200'
          }`}
        >
          <h2 className={`text-xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Добавить диверсификацию
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl ${
              theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label
              className={`block text-xs font-bold uppercase tracking-wider mb-2 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Сумма (₽)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              min="0"
              className={`w-full p-4 rounded-xl border ${
                theme === 'dark'
                  ? 'bg-white/5 border-white/10 text-white'
                  : 'bg-gray-50 border-gray-200 text-gray-900'
              }`}
            />
          </div>

          <div>
            <label
              className={`block text-xs font-bold uppercase tracking-wider mb-2 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Актив
            </label>
            <input
              type="text"
              value={asset}
              onChange={(e) => setAsset(e.target.value)}
              placeholder="SOL, BTC, ETH..."
              className={`w-full p-4 rounded-xl border ${
                theme === 'dark'
                  ? 'bg-white/5 border-white/10 text-white'
                  : 'bg-gray-50 border-gray-200 text-gray-900'
              }`}
            />
          </div>

          <div>
            <label
              className={`block text-xs font-bold uppercase tracking-wider mb-2 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Срок
            </label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="30 дней, 6 месяцев..."
              className={`w-full p-4 rounded-xl border ${
                theme === 'dark'
                  ? 'bg-white/5 border-white/10 text-white'
                  : 'bg-gray-50 border-gray-200 text-gray-900'
              }`}
            />
          </div>

          <div>
            <label
              className={`block text-xs font-bold uppercase tracking-wider mb-2 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Дата направления
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={`w-full p-4 rounded-xl border ${
                theme === 'dark'
                  ? 'bg-white/5 border-white/10 text-white'
                  : 'bg-gray-50 border-gray-200 text-gray-900'
              }`}
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-[#4C7F6E] hover:bg-[#3d6a5c] text-white font-bold transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Добавить
          </button>
        </form>
      </div>
    </div>
  )
}

// Pool Adjustment Modal (Admin)
const PoolAdjustmentModal = ({
  onClose,
  onSubmit,
  theme,
}: {
  onClose: () => void
  onSubmit: (amount: number, description: string) => void
  theme: string
}) => {
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || parseFloat(amount) <= 0) return
    
    setLoading(true)
    onSubmit(parseFloat(amount), description.trim())
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className={`relative w-full max-w-md rounded-3xl border ${
          theme === 'dark'
            ? 'bg-[#0f1624] border-white/10'
            : 'bg-white border-gray-200'
        } shadow-2xl`}
      >
        <div
          className={`flex items-center justify-between p-6 border-b ${
            theme === 'dark' ? 'border-white/10' : 'border-gray-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-xl">
              <PiggyBank className="w-5 h-5 text-emerald-500" />
            </div>
            <h2 className={`text-xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Добавить вклад в пул
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl ${
              theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label
              className={`block text-xs font-bold uppercase tracking-wider mb-2 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Сумма (₽)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              min="0"
              className={`w-full p-4 rounded-xl border ${
                theme === 'dark'
                  ? 'bg-white/5 border-white/10 text-white'
                  : 'bg-gray-50 border-gray-200 text-gray-900'
              }`}
              autoFocus
            />
          </div>

          <div>
            <label
              className={`block text-xs font-bold uppercase tracking-wider mb-2 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Описание (необязательно)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Причина добавления..."
              className={`w-full p-4 rounded-xl border ${
                theme === 'dark'
                  ? 'bg-white/5 border-white/10 text-white placeholder-gray-500'
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
              }`}
            />
          </div>

          <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            Вклад будет добавлен в общую сумму пула. Эта операция не связана с P&L.
          </p>

          <button
            type="submit"
            disabled={loading || !amount || parseFloat(amount) <= 0}
            className="w-full py-4 rounded-xl bg-[#4C7F6E] hover:bg-[#3d6a5c] text-white font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Добавить в пул
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

// Request Details Modal
const RequestDetailsModal = ({
  request,
  onClose,
  theme,
}: {
  request: CompensationRequest
  onClose: () => void
  theme: string
}) => {
  const [screenshotModal, setScreenshotModal] = useState<string | null>(null)
  
  const status = statusBadgeMap[request.status]
  const yesVotes = request.votes.filter((v) => v.vote === 'yes').length
  const noVotes = request.votes.filter((v) => v.vote === 'no').length

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div
          className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border ${
            theme === 'dark'
              ? 'bg-[#0f1624] border-white/10'
              : 'bg-white border-gray-200'
          } shadow-2xl`}
        >
          {/* Header */}
          <div
            className={`sticky top-0 z-10 flex items-center justify-between p-6 border-b ${
              theme === 'dark' ? 'border-white/10 bg-[#0f1624]' : 'border-gray-200 bg-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#4C7F6E]/20">
                <FileText className="w-5 h-5 text-[#4C7F6E]" />
              </div>
              <h2 className={`text-xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Детали заявки
              </h2>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-xl transition-colors ${
                theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-100'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Status & Author */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar userId={request.userId} size="lg" />
                <div>
                  <p className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    <UserNickname userId={request.userId} />
                  </p>
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}
                          >
                            {status.icon}
                            {status.label}
                          </span>
                </div>
              </div>
            </div>

            {/* Deal Info */}
            <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
              <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Информация о сделке
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Сфера</p>
                  <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {COMMUNITY_FUND_SPHERES[request.sphere].label}
                  </p>
                </div>
                <div>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Запрашиваемая сумма</p>
                  <p className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {request.requestedAmount.toLocaleString()} ₽
                  </p>
                </div>
                <div>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Дата сделки</p>
                  <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {formatDate(request.dealDate)}
                  </p>
                </div>
                <div>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Время сделки</p>
                  <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {request.dealTime}
                  </p>
                </div>
              </div>
            </div>

            {/* Comments */}
            {request.comments.length > 0 && (
              <div>
                <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Комментарий
                </h3>
                <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                  <p className={`whitespace-pre-wrap ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {request.comments.join('\n\n')}
                  </p>
                </div>
              </div>
            )}

            {/* Screenshots */}
            {request.screenshots.length > 0 && (
              <div>
                <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Скриншоты ({request.screenshots.length})
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {request.screenshots.map((screenshot, index) => (
                    <button
                      key={index}
                      onClick={() => setScreenshotModal(screenshot)}
                      className={`p-3 rounded-xl flex items-center gap-2 transition-colors ${
                        theme === 'dark' ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <Image className="w-5 h-5 text-[#4C7F6E]" />
                      <span className={`text-sm truncate ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Скриншот {index + 1}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Links */}
            {request.links.length > 0 && (
              <div>
                <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Ссылки ({request.links.length})
                </h3>
                <div className="space-y-2">
                  {request.links.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-3 rounded-xl flex items-center gap-2 transition-colors ${
                        theme === 'dark' ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <LinkIcon className="w-5 h-5 text-[#4C7F6E]" />
                      <span className={`text-sm truncate ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        {link.name || link.url}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Voting Stats */}
            {(request.status === 'voting' || request.status === 'approved' || request.status === 'rejected') && (
              <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Результаты голосования
                </h3>
                <div className="flex gap-6">
                  <div>
                    <p className="text-emerald-500 font-bold text-lg">✓ {yesVotes}</p>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>За</p>
                  </div>
                  <div>
                    <p className="text-rose-500 font-bold text-lg">✗ {noVotes}</p>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Против</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Screenshot Modal */}
      {screenshotModal && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setScreenshotModal(null)}
        >
          <div className="relative max-w-full max-h-[90vh]">
            <img
              src={screenshotModal}
              alt="Скриншот"
              className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
            />
            <button
              onClick={() => setScreenshotModal(null)}
              className="absolute top-4 right-4 p-3 rounded-xl bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}

// Main Component
export const CommunityFund = () => {
  const { theme } = useThemeStore()
  const { user } = useAuthStore()
  const { isAdmin } = useAdminStore()
  const { users: allMembers } = useUsers()

  const [stats, setStats] = useState({
    totalPool: 0,
    weekPool: 0,
    totalCompensated: 0,
    totalDiversified: 0,
  })
  const [requests, setRequests] = useState<CompensationRequest[]>([])
  const [diversificationEntries, setDiversificationEntries] = useState<DiversificationEntry[]>([])
  const [earnings, setEarnings] = useState<Earnings[]>([])
  const [poolContributions, setPoolContributions] = useState<PoolContribution[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'requests' | 'contributors' | 'diversification' | 'pool'>('overview')
  const [showFormModal, setShowFormModal] = useState(false)
  const [showDiversificationModal, setShowDiversificationModal] = useState(false)
  const [showPoolModal, setShowPoolModal] = useState(false)
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<CompensationRequest | null>(null)
  const [userVotes, setUserVotes] = useState<Record<string, 'yes' | 'no'>>({})
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update current time every second for timer display
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Calculate time remaining until auto-delete (3 days from decidedAt)
  const getTimeRemaining = (decidedAt?: string): { days: number; hours: number; minutes: number; seconds: number; isExpired: boolean } | null => {
    if (!decidedAt) return null
    
    const decided = new Date(decidedAt)
    const deleteAt = new Date(decided.getTime() + 3 * 24 * 60 * 60 * 1000) // 3 days
    const diff = deleteAt.getTime() - currentTime.getTime()
    
    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true }
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)
    
    return { days, hours, minutes, seconds, isExpired: false }
  }

  // Format time remaining as D:HH:MM:SS
  const formatTimeRemaining = (time: { days: number; hours: number; minutes: number; seconds: number; isExpired: boolean }): string => {
    if (time.isExpired) return 'Истек'
    const pad = (n: number) => n.toString().padStart(2, '0')
    return `${time.days}:${pad(time.hours)}:${pad(time.minutes)}:${pad(time.seconds)}`
  }

  // Load data
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [statsData, requestsData, divEntries, earningsData, contributionsData] = await Promise.all([
        getCommunityFundStats(),
        getCompensationRequests(),
        getDiversificationEntries(),
        // Get earnings for contributors
        import('@/services/firestoreService').then((m) => m.getEarnings()),
        getPoolContributions(),
      ])

      setStats(statsData)
      setRequests(requestsData)
      setDiversificationEntries(divEntries)
      setEarnings(earningsData)
      setPoolContributions(contributionsData)

      // Load user's votes
      const votes: Record<string, 'yes' | 'no'> = {}
      requestsData.forEach((req) => {
        const userVote = req.votes.find((v: { userId: string; vote: 'yes' | 'no' }) => v.userId === user?.id)
        if (userVote) {
          votes[req.id] = userVote.vote
        }
      })
      setUserVotes(votes)
    } catch (error) {
      console.error('Error loading community fund data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate contributors from earnings (pool contributions) - только approved earnings
  const contributors = allMembers.map((member) => {
    const memberEarnings = earnings.filter((e) =>
      (e.participants?.includes(member.id) || e.userId === member.id) &&
      (e.status === 'approved' || !e.status)
    )
    const poolContribution = memberEarnings.reduce((sum, e) => {
      const share = e.participants && e.participants.length > 0
        ? (e.poolAmount || 0) / e.participants.length
        : (e.poolAmount || 0)
      return sum + share
    }, 0)

    // Calculate compensated amount (approved + paid requests for this member)
    const memberCompensations = requests.filter((r) => 
      r.userId === member.id && (r.status === 'approved' || r.status === 'paid')
    )
    const compensatedAmount = memberCompensations.reduce((sum, r) => sum + r.requestedAmount, 0)

    return {
      ...member,
      poolContribution,
      compensatedAmount,
    }
  }).sort((a, b) => b.poolContribution - a.poolContribution)

  // Handle compensation request submission
  const handleSubmitRequest = async (
    data: Omit<CompensationRequest, 'id' | 'userId' | 'userName' | 'status' | 'votes' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      const userName = await getUserNicknameAsync(user?.id || '')
      await addCompensationRequest({
        ...data,
        userId: user?.id || '',
        userName: userName || user?.id,
        status: 'pending',
        votes: [],
      })
      setShowFormModal(false)
      loadData()
    } catch (error) {
      console.error('Error submitting compensation request:', error)
    }
  }

  // Handle voting
  const handleVote = async (requestId: string, vote: 'yes' | 'no') => {
    try {
      await voteCompensationRequest(requestId, user?.id || '', vote)
      setUserVotes({ ...userVotes, [requestId]: vote })
      loadData()
    } catch (error) {
      console.error('Error voting:', error)
    }
  }

  // Handle approve/reject (admin)
  const handleApprove = async (requestId: string) => {
    try {
      await approveCompensationRequest(requestId, user?.id || '', 'Одобрено')
      loadData()
    } catch (error) {
      console.error('Error approving:', error)
    }
  }

  const handleReject = async (requestId: string) => {
    try {
      await rejectCompensationRequest(requestId, 'Отклонено')
      loadData()
    } catch (error) {
      console.error('Error rejecting:', error)
    }
  }

  const handleMarkPaid = async (requestId: string) => {
    try {
      await markCompensationRequestPaid(requestId)
      loadData()
    } catch (error) {
      console.error('Error marking as paid:', error)
    }
  }

  // Handle request deletion (admin)
  const handleDeleteRequest = async (requestId: string) => {
    if (!confirm('Удалить эту заявку? Это действие нельзя отменить.')) return
    try {
      await deleteCompensationRequest(requestId)
      loadData()
    } catch (error) {
      console.error('Error deleting request:', error)
    }
  }

  // Handle diversification entry submission
  const handleSubmitDiversification = async (
    data: Omit<DiversificationEntry, 'id' | 'createdAt'>
  ) => {
    try {
      // Добавляем запись о диверсификации
      await addDiversificationEntry(data)
      
      // Автоматически вычитаем сумму из пула
      await adjustPoolManually(
        -data.amount,  // отрицательная сумма = вычитание из пула
        `Диверсификация: ${data.asset} (${data.duration})`,
        user?.id || ''
      )
      
      setShowDiversificationModal(false)
      await loadData()
    } catch (error) {
      console.error('Error adding diversification entry:', error)
    }
  }

  // Handle diversification entry deletion
  const handleDeleteDiversification = async (id: string) => {
    if (!confirm('Удалить эту запись о диверсификации?')) return
    try {
      await deleteDiversificationEntry(id)
      loadData()
    } catch (error) {
      console.error('Error deleting diversification entry:', error)
    }
  }

  // Handle pool contribution deletion (admin only - manual removal)
  const handleDeletePoolContribution = async (id: string) => {
    if (!confirm('Удалить эту запись о вкладе в пул? Это уменьшит общую сумму пула.')) return
    try {
      await deletePoolContribution(id)
      loadData()
    } catch (error) {
      console.error('Error deleting pool contribution:', error)
    }
  }

  // Handle manual pool adjustment (admin)
  const handleAddPoolAdjustment = async (amount: number, description: string) => {
    try {
      await adjustPoolManually(amount, description, user?.id || '')
      setShowPoolModal(false)
      await loadData()  // Wait for data to reload
    } catch (error) {
      console.error('Error adding pool adjustment:', error)
    }
  }

  // Approved requests
  const approvedRequests = requests.filter((r) => r.status === 'approved')
  // Pending requests (for voting)
  const votingRequests = requests.filter((r) => r.status === 'voting' || r.status === 'pending')
  // All requests
  const allRequests = requests

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#4C7F6E] border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#4C7F6E]/10 rounded-2xl border border-[#4C7F6E]/20">
            <Wallet className="w-8 h-8 text-[#4C7F6E]" />
          </div>
          <div>
            <h1 className={`text-2xl md:text-3xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Community <span className="text-[#4C7F6E]">Fund</span>
            </h1>
            <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Пул сообщества и компенсации
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowFormModal(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#4C7F6E] hover:bg-[#3d6a5c] text-white font-bold text-sm transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Компенсация
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: 'overview', label: 'Обзор', icon: <PieChart className="w-4 h-4" /> },
          { id: 'requests', label: 'Заявки', icon: <FileText className="w-4 h-4" /> },
          { id: 'contributors', label: 'Участники пула', icon: <Users className="w-4 h-4" /> },
          { id: 'diversification', label: 'Диверсификация', icon: <BarChart3 className="w-4 h-4" /> },
          ...(isAdmin ? [{ id: 'pool', label: 'Управление пулом', icon: <PiggyBank className="w-4 h-4" /> }] : []),
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-[#4C7F6E] text-white'
                : theme === 'dark'
                ? 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                : 'bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Всего в пуле"
              value={stats.totalPool}
              icon={<PiggyBank className="w-5 h-5 text-emerald-500" />}
              accentColor="border-emerald-500/20"
              theme={theme}
            />
            <StatCard
              label="За неделю"
              value={stats.weekPool}
              icon={<TrendingUp className="w-5 h-5 text-blue-500" />}
              accentColor="border-blue-500/20"
              theme={theme}
            />
            <StatCard
              label="Компенсировано"
              value={stats.totalCompensated}
              icon={<DollarSign className="w-5 h-5 text-purple-500" />}
              accentColor="border-purple-500/20"
              theme={theme}
            />
            <StatCard
              label="Диверсификация"
              value={stats.totalDiversified}
              icon={<Shield className="w-5 h-5 text-[#4C7F6E]" />}
              accentColor="border-[#4C7F6E]/20"
              theme={theme}
            />
          </div>

          {/* Recent Requests */}
          <div
            className={`relative overflow-hidden rounded-3xl p-6 ${
              theme === 'dark' ? 'bg-[#0b1015] border-white/5' : 'bg-white border-gray-100'
            } border shadow-2xl`}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#4C7F6E]/5 blur-3xl rounded-full -mr-32 -mt-32" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#4C7F6E]/10 rounded-xl">
                    <FileText className="w-5 h-5 text-[#4C7F6E]" />
                  </div>
                  <h3 className={`text-lg font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Последние заявки
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTab('requests')}
                  className={`text-sm hover:underline ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                >
                  Все заявки →
                </button>
              </div>

              {allRequests.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className={`w-12 h-12 mx-auto mb-3 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-300'}`} />
                  <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                    Заявок пока нет
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {allRequests.slice(0, 5).map((request) => {
                    const status = statusBadgeMap[request.status]
                    const timeRemaining = getTimeRemaining(request.decidedAt)
                    
                    return (
                      <div
                        key={request.id}
                        onClick={() => {
                          setSelectedRequest(request)
                          setShowRequestModal(true)
                        }}
                        className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-colors ${
                          theme === 'dark' ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <Avatar userId={request.userId} size="sm" />
                          <div>
                            <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                              <UserNickname userId={request.userId} />
                            </p>
                            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                              {COMMUNITY_FUND_SPHERES[request.sphere].label} • {formatDate(request.dealDate)}
                            </p>
                            {request.links.length > 0 && (
                              <div className="flex items-center gap-1 mt-1">
                                <LinkIcon className="w-3 h-3 text-[#4C7F6E]" />
                                <span className="text-xs text-[#4C7F6E]">
                                  {request.links.length} ссыл.
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                              {request.requestedAmount.toLocaleString()} ₽
                            </p>
                          </div>
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}
                          >
                            {status.icon}
                            {status.label}
                          </span>
                          {timeRemaining && !timeRemaining.isExpired && ['approved', 'rejected', 'paid'].includes(request.status) && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/20 text-amber-500 text-xs font-mono">
                              <Clock className="w-3 h-3" />
                              {formatTimeRemaining(timeRemaining)}
                            </span>
                          )}
                          {isAdmin && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteRequest(request.id)
                              }}
                              className="p-2 rounded-lg hover:bg-rose-500/20 text-rose-500 transition-colors"
                              title="Удалить заявку"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Pool Management Tab */}
      {activeTab === 'pool' && (
        <div className="space-y-6">
          {/* Admin Controls */}
          {isAdmin && (
            <div className="flex justify-end">
              <button
                onClick={() => setShowPoolModal(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#4C7F6E] hover:bg-[#3d6a5c] text-white font-bold text-sm transition-all hover:scale-105 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                Добавить вклад вручную
              </button>
            </div>
          )}

          {/* Pool Contributions History */}
          <div
            className={`relative overflow-hidden rounded-3xl p-6 ${
              theme === 'dark' ? 'bg-[#0b1015] border-white/5' : 'bg-white border-gray-100'
            } border shadow-2xl`}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-3xl rounded-full -mr-32 -mt-32" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-500/10 rounded-xl">
                  <PiggyBank className="w-5 h-5 text-emerald-500" />
                </div>
                <h3 className={`text-lg font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  История вкладов в пул
                </h3>
              </div>

              <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Вклады автоматически добавляются при создании записи в P&L с суммой пула. 
                При удалении записи из P&L вклад остаётся в пуле — администратор может удалить его вручную при необходимости.
              </p>

              {poolContributions.length === 0 ? (
                <div className="text-center py-8">
                  <PiggyBank className={`w-12 h-12 mx-auto mb-3 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-300'}`} />
                  <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                    Вкладов в пул пока нет
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                        <th className="text-left py-3 px-4 font-semibold">Дата</th>
                        <th className="text-left py-3 px-4 font-semibold">Источник</th>
                        <th className="text-left py-3 px-4 font-semibold">Описание</th>
                        <th className="text-right py-3 px-4 font-semibold">Сумма</th>
                        {isAdmin && <th className="text-right py-3 px-4 font-semibold">Действия</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                      {poolContributions.map((contribution) => (
                        <tr key={contribution.id} className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                          <td className="py-3 px-4">{formatDate(contribution.date)}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold ${
                              contribution.source === 'earning' 
                                ? 'bg-blue-500/20 text-blue-500'
                                : contribution.source === 'diversification'
                                ? 'bg-[#4C7F6E]/20 text-[#4C7F6E]'
                                : 'bg-purple-500/20 text-purple-500'
                            }`}>
                              {contribution.source === 'earning' ? 'P&L' : contribution.source === 'diversification' ? 'Диверсификация' : 'Вручную'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                              {contribution.description || '-'}
                            </span>
                          </td>
                          <td className={`py-3 px-4 text-right font-bold ${
                            contribution.amount < 0 ? 'text-rose-500' : 'text-emerald-500'
                          }`}>
                            {contribution.amount >= 0 ? '+' : ''}{contribution.amount.toLocaleString()} ₽
                          </td>
                          {isAdmin && (
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => handleDeletePoolContribution(contribution.id)}
                                className="p-2 rounded-lg hover:bg-rose-500/20 text-rose-500 transition-colors"
                                title="Удалить вклад (только для админов)"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Total */}
              {poolContributions.length > 0 && (
                <div className={`mt-6 pt-6 border-t ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}>
                  <div className="flex items-center justify-between">
                    <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Всего в пуле
                    </span>
                    <span className="text-2xl font-black text-emerald-500">
                      {stats.totalPool.toLocaleString()} ₽
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {activeTab === 'requests' && (
        <div className="space-y-6">
          {/* Voting Interface */}
          {votingRequests.length > 0 && (
            <div
              className={`relative overflow-hidden rounded-3xl p-6 ${
                theme === 'dark' ? 'bg-[#0b1015] border-white/5' : 'bg-white border-gray-100'
              } border shadow-2xl`}
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-3xl rounded-full -mr-32 -mt-32" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-500/10 rounded-xl">
                    <ThumbsUp className="w-5 h-5 text-blue-500" />
                  </div>
                  <h3 className={`text-lg font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Голосование по заявкам
                  </h3>
                </div>

                <div className="space-y-4">
                  {votingRequests.map((request) => {
                    const status = statusBadgeMap[request.status]
                    const yesVotes = request.votes.filter((v) => v.vote === 'yes').length
                    const noVotes = request.votes.filter((v) => v.vote === 'no').length

                    return (
                      <div
                        key={request.id}
                        onClick={() => {
                          setSelectedRequest(request)
                          setShowRequestModal(true)
                        }}
                        className={`p-5 rounded-2xl cursor-pointer transition-all hover:scale-[1.01] ${
                          theme === 'dark' ? 'bg-white/5 border border-white/10 hover:border-[#4C7F6E]/30' : 'bg-gray-50 border border-gray-200 hover:border-[#4C7F6E]/30'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Avatar userId={request.userId} size="md" />
                            <div>
                              <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                <UserNickname userId={request.userId} />
                              </p>
                              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                {COMMUNITY_FUND_SPHERES[request.sphere].label} •{' '}
                                {formatDate(request.dealDate)} в {request.dealTime}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}
                          >
                            {status.icon}
                            {status.label}
                          </span>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className={`text-xs uppercase tracking-wider mb-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                              Запрашиваемая сумма
                            </p>
                            <p className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                              {request.requestedAmount.toLocaleString()} ₽
                            </p>
                          </div>
                          <div className="text-right">
                            <p className={`text-xs uppercase tracking-wider mb-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                              Голоса
                            </p>
                            <div className="flex gap-3">
                              <span className="text-emerald-500 font-bold">✓ {yesVotes}</span>
                              <span className="text-rose-500 font-bold">✗ {noVotes}</span>
                            </div>
                          </div>
                        </div>

                        {/* Evidence preview */}
                        {(request.comments.length > 0 || request.screenshots.length > 0 || request.links.length > 0) && (
                          <div className={`p-3 rounded-xl mb-4 ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'}`}>
                            <p className={`text-xs uppercase tracking-wider mb-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                              Доказательства
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {request.comments.length > 0 && (
                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#4C7F6E]/20 text-xs ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                  <MessageSquare className="w-3 h-3" />
                                  {request.comments.length} коммент.
                                </span>
                              )}
                              {request.screenshots.length > 0 && (
                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#4C7F6E]/20 text-xs ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                  <Image className="w-3 h-3" />
                                  {request.screenshots.length} скринш.
                                </span>
                              )}
                              {request.links.length > 0 && (
                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#4C7F6E]/20 text-xs ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                  <LinkIcon className="w-3 h-3" />
                                  {request.links.length} ссыл.
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Voting buttons */}
                        <div className="flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleVote(request.id, 'yes')}
                            className={`flex-1 min-w-[120px] py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors ${
                              userVotes[request.id] === 'yes'
                                ? 'bg-emerald-500 text-white'
                                : theme === 'dark'
                                ? 'bg-white/10 hover:bg-emerald-500/20 text-white'
                                : 'bg-gray-200 hover:bg-emerald-100 text-gray-900'
                            }`}
                          >
                            <ThumbsUp className="w-4 h-4" />
                            За
                          </button>
                          <button
                            onClick={() => handleVote(request.id, 'no')}
                            className={`flex-1 min-w-[120px] py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors ${
                              userVotes[request.id] === 'no'
                                ? 'bg-rose-500 text-white'
                                : theme === 'dark'
                                ? 'bg-white/10 hover:bg-rose-500/20 text-white'
                                : 'bg-gray-200 hover:bg-rose-100 text-gray-900'
                            }`}
                          >
                            <ThumbsDown className="w-4 h-4" />
                            Против
                          </button>
                          {isAdmin && request.status === 'pending' && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleApprove(request.id)
                                }}
                                className="px-4 py-3 rounded-xl bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-600 transition-colors"
                              >
                                Одобрить
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleReject(request.id)
                                }}
                                className="px-4 py-3 rounded-xl bg-rose-500 text-white font-bold text-sm hover:bg-rose-600 transition-colors"
                              >
                                Отклонить
                              </button>
                            </>
                          )}
                          {isAdmin && request.status === 'voting' && (
                            <>
                              <button
                                onClick={() => handleApprove(request.id)}
                                className="px-4 py-3 rounded-xl bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-600 transition-colors"
                              >
                                Одобрить
                              </button>
                              <button
                                onClick={() => handleReject(request.id)}
                                className="px-4 py-3 rounded-xl bg-rose-500 text-white font-bold text-sm hover:bg-rose-600 transition-colors"
                              >
                                Отклонить
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Approved Requests */}
          {approvedRequests.length > 0 && (
            <div
              className={`relative overflow-hidden rounded-3xl p-6 ${
                theme === 'dark' ? 'bg-[#0b1015] border-white/5' : 'bg-white border-gray-100'
              } border shadow-2xl`}
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-3xl rounded-full -mr-32 -mt-32" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-emerald-500/10 rounded-xl">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  </div>
                  <h3 className={`text-lg font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Одобренные заявки
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                        <th className="text-left py-3 px-4 font-semibold">Участник</th>
                        <th className="text-left py-3 px-4 font-semibold">Сфера</th>
                        <th className="text-left py-3 px-4 font-semibold">Дата</th>
                        <th className="text-right py-3 px-4 font-semibold">Сумма</th>
                        <th className="text-center py-3 px-4 font-semibold">Статус</th>
                        {isAdmin && <th className="text-right py-3 px-4 font-semibold">Действия</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                      {approvedRequests.map((request) => {
                        const status = statusBadgeMap[request.status]
                        const timeRemaining = getTimeRemaining(request.decidedAt)
                        const showTimer = timeRemaining && !timeRemaining.isExpired
                        
                        return (
                          <tr key={request.id} className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <Avatar userId={request.userId} size="sm" />
                                <UserNickname userId={request.userId} />
                              </div>
                            </td>
                            <td className="py-3 px-4">{COMMUNITY_FUND_SPHERES[request.sphere].label}</td>
                            <td className="py-3 px-4">{formatDate(request.dealDate)}</td>
                            <td className="py-3 px-4 text-right font-bold">
                              {request.requestedAmount.toLocaleString()} ₽
                            </td>
                            <td className="py-3 px-4 text-center">
                              <div className="flex flex-col items-center gap-1">
                                <span
                                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}
                                >
                                  {status.icon}
                                  {status.label}
                                </span>
                                {showTimer && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-500 text-xs font-mono">
                                    <Clock className="w-3 h-3" />
                                    {formatTimeRemaining(timeRemaining)}
                                  </span>
                                )}
                              </div>
                            </td>
                            {isAdmin && (
                              <td className="py-3 px-4 text-right">
                                {request.status === 'approved' && (
                                  <button
                                    onClick={() => handleMarkPaid(request.id)}
                                    className="px-3 py-1.5 rounded-lg bg-purple-500 text-white text-xs font-semibold hover:bg-purple-600"
                                  >
                                    Отметить выплаченным
                                  </button>
                                )}
                              </td>
                            )}
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {votingRequests.length === 0 && approvedRequests.length === 0 && (
            <div className={`text-center py-12 rounded-3xl border-2 border-dashed ${
              theme === 'dark' ? 'border-white/10' : 'border-gray-200'
            }`}>
              <FileText className={`w-16 h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-300'}`} />
              <p className={`text-lg font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Заявок пока нет
              </p>
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                Станьте первым, кто подаст заявку на компенсацию
              </p>
            </div>
          )}
        </div>
      )}

      {/* Contributors Tab */}
      {activeTab === 'contributors' && (
        <div
          className={`relative overflow-hidden rounded-3xl p-6 ${
            theme === 'dark' ? 'bg-[#0b1015] border-white/5' : 'bg-white border-gray-100'
          } border shadow-2xl`}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#4C7F6E]/5 blur-3xl rounded-full -mr-32 -mt-32" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#4C7F6E]/10 rounded-xl">
                <Users className="w-5 h-5 text-[#4C7F6E]" />
              </div>
              <h3 className={`text-lg font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Вклад в пул сообщества
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                    <th className="text-center py-3 px-4 font-semibold">#</th>
                    <th className="text-center py-3 px-4 font-semibold">Участник</th>
                    <th className="text-center py-3 px-4 font-semibold">Вклад в пул</th>
                    <th className="text-center py-3 px-4 font-semibold">Компенсировано</th>
                    <th className="text-center py-3 px-4 font-semibold">Доля</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {contributors.map((contributor, index) => {
                    const share = stats.totalPool > 0 
                      ? ((contributor.poolContribution / stats.totalPool) * 100).toFixed(1) 
                      : '0'
                    return (
                      <tr key={contributor.id} className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                        <td className="py-3 px-4 text-center">
                          <span className={`font-bold ${index < 3 ? 'text-[#4C7F6E]' : ''}`}>
                            {index + 1}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <Avatar user={contributor} size="sm" />
                            <UserNickname userId={contributor.id} />
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center font-bold">
                          {contributor.poolContribution.toLocaleString()} ₽
                        </td>
                        <td className="py-3 px-4 text-center font-bold">
                          <span className={contributor.compensatedAmount > 0 
                            ? (theme === 'dark' ? 'text-white' : 'text-gray-900')
                            : (theme === 'dark' ? 'text-gray-500' : 'text-gray-400')
                          }>
                            {contributor.compensatedAmount > 0 ? `${contributor.compensatedAmount.toLocaleString()} ₽` : '-'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="text-[#4C7F6E] font-bold">{share}%</span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Diversification Tab */}
      {activeTab === 'diversification' && (
        <div className="space-y-6">
          {/* Admin Form */}
          {isAdmin && (
            <div className="flex justify-end">
              <button
                onClick={() => setShowDiversificationModal(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#4C7F6E] hover:bg-[#3d6a5c] text-white font-bold text-sm transition-all hover:scale-105 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                Добавить диверсификацию
              </button>
            </div>
          )}

          {/* Diversification Entries */}
          <div
            className={`relative overflow-hidden rounded-3xl p-6 ${
              theme === 'dark' ? 'bg-[#0b1015] border-white/5' : 'bg-white border-gray-100'
            } border shadow-2xl`}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#4C7F6E]/5 blur-3xl rounded-full -mr-32 -mt-32" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-[#4C7F6E]/10 rounded-xl">
                  <BarChart3 className="w-5 h-5 text-[#4C7F6E]" />
                </div>
                <h3 className={`text-lg font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Диверсификация средств
                </h3>
              </div>

              {diversificationEntries.length === 0 ? (
                <div className="text-center py-8">
                  <BarChart3 className={`w-12 h-12 mx-auto mb-3 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-300'}`} />
                  <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                    Записей о диверсификации пока нет
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                        <th className="text-left py-3 px-4 font-semibold">Дата</th>
                        <th className="text-left py-3 px-4 font-semibold">Актив</th>
                        <th className="text-right py-3 px-4 font-semibold">Сумма</th>
                        <th className="text-left py-3 px-4 font-semibold">Срок</th>
                        {isAdmin && <th className="text-right py-3 px-4 font-semibold">Действия</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                      {diversificationEntries.map((entry) => (
                        <tr key={entry.id} className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                          <td className="py-3 px-4">{formatDate(entry.date)}</td>
                          <td className="py-3 px-4 font-bold">{entry.asset}</td>
                          <td className="py-3 px-4 text-right font-bold">
                            {entry.amount.toLocaleString()} ₽
                          </td>
                          <td className="py-3 px-4">{entry.duration}</td>
                          {isAdmin && (
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => handleDeleteDiversification(entry.id)}
                                className="p-2 rounded-lg hover:bg-rose-500/20 text-rose-500 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Total */}
              {diversificationEntries.length > 0 && (
                <div className={`mt-6 pt-6 border-t ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}>
                  <div className="flex items-center justify-between">
                    <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Всего направлено на диверсификацию
                    </span>
                    <span className="text-2xl font-black text-[#4C7F6E]">
                      {stats.totalDiversified.toLocaleString()} ₽
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showFormModal && (
        <CompensationFormModal
          onClose={() => setShowFormModal(false)}
          onSubmit={handleSubmitRequest}
          theme={theme}
        />
      )}

      {showDiversificationModal && isAdmin && (
        <DiversificationFormModal
          onClose={() => setShowDiversificationModal(false)}
          onSubmit={handleSubmitDiversification}
          theme={theme}
        />
      )}

      {/* Pool Manual Adjustment Modal (Admin) */}
      {showPoolModal && isAdmin && (
        <PoolAdjustmentModal
          onClose={() => setShowPoolModal(false)}
          onSubmit={handleAddPoolAdjustment}
          theme={theme}
        />
      )}

      {/* Request Details Modal */}
      {showRequestModal && selectedRequest && (
        <RequestDetailsModal
          request={selectedRequest}
          onClose={() => {
            setShowRequestModal(false)
            setSelectedRequest(null)
          }}
          theme={theme}
        />
      )}
    </div>
  )
}

export default CommunityFund
