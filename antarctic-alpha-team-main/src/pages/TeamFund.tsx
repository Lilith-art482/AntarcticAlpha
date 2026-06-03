import { useState, useEffect } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { useAdminStore } from '@/store/adminStore'
import {
  Wallet,
  Plus,
  X,
  Send,
  ChevronDown,
  Upload,
  Link as LinkIcon,
  Image,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Shield,
  Rocket,
  TrendingDown,
  BarChart3,
  Coins,
  BookOpen,
  Calendar,
  Users,
  CheckSquare,
  FileText,
} from 'lucide-react'
import { TeamFundSphere, TEAM_FUND_SPHERES, TeamFundRequest, TeamFundRequestStatus } from '@/types'
import {
  addTeamFundRequest,
  getTeamFundRequests,
  getUserTeamFundRequests,
  approveTeamFundRequest,
  rejectTeamFundRequest,
  deleteTeamFundRequest,
  cleanupOldTeamFundRequests,
} from '@/services/firestoreService'
import { UserNickname } from '@/components/UserNickname'
import Avatar from '@/components/Avatar'

const sphereIcons: Record<TeamFundSphere, { icon: React.ReactNode; color: string; bg: string }> = {
  memecoins: { icon: <Rocket className="w-5 h-5" />, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  polymarket: { icon: <BarChart3 className="w-5 h-5" />, color: 'text-pink-500', bg: 'bg-pink-500/10' },
  futures_spot: { icon: <TrendingDown className="w-5 h-5" />, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  traditional: { icon: <Coins className="w-5 h-5" />, color: 'text-amber-500', bg: 'bg-amber-500/10' },
}

const statusBadgeMap: Record<TeamFundRequestStatus, { bg: string; text: string; icon: React.ReactNode; label: string }> = {
  pending: {
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    text: 'text-amber-800 dark:text-amber-200',
    icon: <Clock className="w-3.5 h-3.5" />,
    label: 'На рассмотрении',
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
}

// Application Form Modal
const ApplicationFormModal = ({
  onClose,
  onSubmit,
  theme,
}: {
  onClose: () => void
  onSubmit: (data: Omit<TeamFundRequest, 'id' | 'userId' | 'userName' | 'status' | 'createdAt' | 'updatedAt'>) => void
  theme: string
}) => {
  const [sphere, setSphere] = useState<TeamFundSphere>('memecoins')
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
      comment: comment.trim(),
      screenshots,
      links: links.filter((l) => l.url.trim()),
      requestedAmount: parseFloat(requestedAmount) || 0,
    })
  }

  const isDark = theme === 'dark'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border ${
          isDark ? 'bg-[#0f1624] border-white/10' : 'bg-white border-gray-200'
        } shadow-2xl`}
      >
        {/* Header */}
        <div
          className={`sticky top-0 z-10 flex items-center justify-between p-6 border-b ${
            isDark ? 'border-white/10 bg-[#0f1624]' : 'border-gray-200 bg-white'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#4C7F6E]/20">
              <FileText className="w-5 h-5 text-[#4C7F6E]" />
            </div>
            <h2 className={`text-xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Заявка на доступ к командному кошельку
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Sphere */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Сфера использования средств
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowSphereDropdown(!showSphereDropdown)}
                className={`w-full flex items-center justify-between p-4 rounded-xl border ${
                  isDark
                    ? 'bg-white/5 border-white/10 hover:border-white/20'
                    : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                } transition-colors`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${sphereIcons[sphere].bg} ${sphereIcons[sphere].color}`}>
                    {sphereIcons[sphere].icon}
                  </div>
                  <div className="text-left">
                    <span className={isDark ? 'text-white' : 'text-gray-900'}>
                      {TEAM_FUND_SPHERES[sphere].label}
                    </span>
                    <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      {TEAM_FUND_SPHERES[sphere].description}
                    </p>
                  </div>
                </div>
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${showSphereDropdown ? 'rotate-180' : ''} ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}
                />
              </button>
              {showSphereDropdown && (
                <div
                  className={`absolute z-20 w-full mt-2 rounded-xl border overflow-hidden ${
                    isDark ? 'bg-[#1a2535] border-white/10' : 'bg-white border-gray-200 shadow-lg'
                  }`}
                >
                  {(Object.keys(TEAM_FUND_SPHERES) as TeamFundSphere[]).map((key) => {
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
                          isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700'
                        } ${isSelected ? 'bg-[#4C7F6E]/20' : ''}`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${sphereIcons[key].bg} ${sphereIcons[key].color}`}>
                          {sphereIcons[key].icon}
                        </div>
                        <div>
                          <p className="font-medium">{TEAM_FUND_SPHERES[key].label}</p>
                          <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                            {TEAM_FUND_SPHERES[key].description}
                          </p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Запрашиваемая сумма (USD)
            </label>
            <input
              type="number"
              value={requestedAmount}
              onChange={(e) => setRequestedAmount(e.target.value)}
              placeholder="0 — полный доступ ко всем средствам"
              min="0"
              step="100"
              className={`w-full p-4 rounded-xl border ${
                isDark
                  ? 'bg-white/5 border-white/10 text-white placeholder-gray-500'
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
              }`}
            />
            <p className={`text-xs mt-1.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              Оставьте 0, если запрашиваете полный доступ ко всем средствам фонда
            </p>
          </div>

          {/* Comment */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Комментарий / Обоснование
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Опишите ваш опыт, стратегию и почему вы должны получить доступ..."
              rows={4}
              required
              className={`w-full p-4 rounded-xl border text-sm resize-none ${
                isDark
                  ? 'bg-white/5 border-white/10 text-white placeholder-gray-500'
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
              }`}
            />
          </div>

          {/* Screenshots */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Скриншоты (до 10)
              </label>
              <span className="text-xs text-gray-500">{screenshots.length}/10</span>
            </div>
            <div className="mb-2">
              <label
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl cursor-pointer transition-colors ${
                  uploadingScreenshot
                    ? 'bg-gray-500/20 text-gray-500'
                    : isDark
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
                      isDark ? 'bg-white/5' : 'bg-gray-100'
                    }`}
                  >
                    <img
                      src={screenshot}
                      alt={`Скриншот ${index + 1}`}
                      className="w-8 h-8 object-cover rounded"
                    />
                    <span className="text-xs truncate max-w-[150px]">Файл {index + 1}</span>
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
              <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
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
                    isDark
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
                    isDark
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
                      isDark ? 'bg-white/5' : 'bg-gray-100'
                    }`}
                  >
                    <LinkIcon className="w-4 h-4 text-[#4C7F6E]" />
                    <span className="text-xs truncate max-w-[150px]">{link.name || link.url}</span>
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

// Request Details Modal
const RequestDetailsModal = ({
  request,
  onClose,
  theme,
  isAdmin,
  onApprove,
  onReject,
  onDelete,
}: {
  request: TeamFundRequest
  onClose: () => void
  theme: string
  isAdmin: boolean
  onApprove: (id: string, comment?: string) => void
  onReject: (id: string, comment?: string) => void
  onDelete: (id: string) => void
}) => {
  const [adminComment, setAdminComment] = useState('')
  const [screenshotModal, setScreenshotModal] = useState<string | null>(null)
  const status = statusBadgeMap[request.status]
  const isDark = theme === 'dark'

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div
          className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border ${
            isDark ? 'bg-[#0f1624] border-white/10' : 'bg-white border-gray-200'
          } shadow-2xl`}
        >
          <div
            className={`sticky top-0 z-10 flex items-center justify-between p-6 border-b ${
              isDark ? 'border-white/10 bg-[#0f1624]' : 'border-gray-200 bg-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#4C7F6E]/20">
                <FileText className="w-5 h-5 text-[#4C7F6E]" />
              </div>
              <h2 className={`text-xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>Детали заявки</h2>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-xl transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
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
                  <p className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
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
              {isAdmin && (
                <button
                  onClick={() => onDelete(request.id)}
                  className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors"
                  title="Удалить заявку"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Info */}
            <div className={`p-4 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
              <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Информация о заявке
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Сфера</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center ${sphereIcons[request.sphere].bg} ${sphereIcons[request.sphere].color}`}>
                      {sphereIcons[request.sphere].icon}
                    </div>
                    <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {TEAM_FUND_SPHERES[request.sphere].label}
                    </p>
                  </div>
                </div>
                <div>
                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Запрашиваемая сумма</p>
                  <p className={`text-2xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {request.requestedAmount > 0 ? `$${request.requestedAmount.toLocaleString()}` : 'Полный доступ'}
                  </p>
                </div>
              </div>
            </div>

            {/* Comment */}
            {request.comment && (
              <div>
                <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Комментарий
                </h3>
                <div className={`p-4 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                  <p className={`whitespace-pre-wrap ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{request.comment}</p>
                </div>
              </div>
            )}

            {/* Screenshots */}
            {request.screenshots.length > 0 && (
              <div>
                <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Скриншоты ({request.screenshots.length})
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {request.screenshots.map((screenshot, index) => (
                    <button
                      key={index}
                      onClick={() => setScreenshotModal(screenshot)}
                      className={`p-3 rounded-xl flex items-center gap-2 transition-colors ${
                        isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <Image className="w-5 h-5 text-[#4C7F6E]" />
                      <span className={`text-sm truncate ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
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
                <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Ссылки
                </h3>
                <div className="space-y-2">
                  {request.links.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                        isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <LinkIcon className="w-4 h-4 text-[#4C7F6E]" />
                      <span className={`text-sm truncate ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {link.name || link.url}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Admin Comment */}
            {request.adminComment && (
              <div>
                <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Решение DM
                </h3>
                <div className={`p-4 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                  <p className={`whitespace-pre-wrap ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{request.adminComment}</p>
                </div>
              </div>
            )}

            {/* Admin Actions */}
            {isAdmin && request.status === 'pending' && (
              <div className="space-y-3 pt-4 border-t border-gray-200/10">
                <textarea
                  value={adminComment}
                  onChange={(e) => setAdminComment(e.target.value)}
                  placeholder="Комментарий к решению (необязательно)..."
                  rows={2}
                  className={`w-full p-3 rounded-xl border text-sm resize-none ${
                    isDark
                      ? 'bg-white/5 border-white/10 text-white placeholder-gray-500'
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                  }`}
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => onReject(request.id, adminComment)}
                    className="flex-1 py-3 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Отклонить
                  </button>
                  <button
                    onClick={() => onApprove(request.id, adminComment)}
                    className="flex-1 py-3 rounded-xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Одобрить
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {screenshotModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80" onClick={() => setScreenshotModal(null)}>
          <img src={screenshotModal} alt="Screenshot" className="max-w-full max-h-[90vh] rounded-xl" />
        </div>
      )}
    </>
  )
}

export default function TeamFund() {
  const { theme } = useThemeStore()
  const { user } = useAuthStore()
  const { isAdmin } = useAdminStore()
  const isDark = theme === 'dark'

  const [requests, setRequests] = useState<TeamFundRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<TeamFundRequest | null>(null)
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')

  const loadRequests = async () => {
    setLoading(true)
    try {
      if (isAdmin) {
        const data = await getTeamFundRequests()
        setRequests(data)
        // Clean up old requests for admins
        await cleanupOldTeamFundRequests()
      } else if (user) {
        const data = await getUserTeamFundRequests(user.id)
        setRequests(data)
      }
    } catch (error) {
      console.error('Error loading team fund requests:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRequests()
    
    // Set up interval to clean up old requests every hour for admins
    let intervalId: NodeJS.Timeout | undefined
    if (isAdmin) {
      intervalId = setInterval(async () => {
        await cleanupOldTeamFundRequests()
      }, 60 * 60 * 1000) // Every hour
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [isAdmin, user?.id])

  const handleSubmit = async (
    data: Omit<TeamFundRequest, 'id' | 'userId' | 'userName' | 'status' | 'createdAt' | 'updatedAt'>
  ) => {
    if (!user) return
    try {
      await addTeamFundRequest({
        ...data,
        userId: user.id,
        userName: user.name,
        status: 'pending',
      })
      setShowForm(false)
      await loadRequests()
    } catch (error) {
      console.error('Error submitting request:', error)
      alert('Ошибка при отправке заявки')
    }
  }

  const handleApprove = async (id: string, comment?: string) => {
    if (!user) return
    try {
      await approveTeamFundRequest(id, user.id, comment)
      setSelectedRequest(null)
      await loadRequests()
    } catch (error) {
      console.error('Error approving request:', error)
      alert('Ошибка при одобрении заявки')
    }
  }

  const handleReject = async (id: string, comment?: string) => {
    if (!user) return
    try {
      await rejectTeamFundRequest(id, user.id, comment)
      setSelectedRequest(null)
      await loadRequests()
    } catch (error) {
      console.error('Error rejecting request:', error)
      alert('Ошибка при отклонении заявки')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить эту заявку?')) return
    try {
      await deleteTeamFundRequest(id)
      setSelectedRequest(null)
      await loadRequests()
    } catch (error) {
      console.error('Error deleting request:', error)
      alert('Ошибка при удалении заявки')
    }
  }

  const filteredRequests =
    activeTab === 'all' ? requests : requests.filter((r) => r.status === activeTab)

  const headingColor = isDark ? 'text-white' : 'text-gray-900'
  const subHeadingColor = isDark ? 'text-gray-400' : 'text-gray-600'
  const cardBg = isDark ? 'bg-[#0b1015] border-white/5' : 'bg-white border-gray-100'

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl sm:text-3xl font-black ${headingColor}`}>Team's Wallet</h1>
          <p className={`text-sm mt-1 ${subHeadingColor}`}>Доступ к общему кошельку команды — фонду Antarctic Alpha</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-5 py-2.5 rounded-xl bg-[#4C7F6E] hover:bg-[#3d6b5a] text-white font-bold text-sm transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Подать заявку
        </button>
      </div>

      {/* Rules & Conditions */}
      <div className={`p-6 rounded-2xl border ${cardBg} space-y-5`}>
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${isDark ? 'bg-[#4C7F6E]/20' : 'bg-[#4C7F6E]/15'}`}>
            <Shield className="w-5 h-5 text-[#4C7F6E]" />
          </div>
          <h2 className={`text-lg font-black ${headingColor}`}>Ключевые условия</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="w-4 h-4 text-[#4C7F6E]" />
              <span className={`text-sm font-bold ${headingColor}`}>Доступ к фонду</span>
            </div>
            <p className={`text-xs leading-relaxed ${subHeadingColor}`}>
              DM вправе выдать доступ ко всем средствам кошелька или создать отдельный выделенный кошелёк с фиксированной суммой.
            </p>
          </div>

          <div className={`p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <span className={`text-sm font-bold ${headingColor}`}>Запрет на вывод</span>
            </div>
            <p className={`text-xs leading-relaxed ${subHeadingColor}`}>
              Категорически запрещено выводить средства, принадлежащие Antarctic Alpha. Вся прибыль добавляется через P&L с оплатой взноса в пул.
            </p>
          </div>

          <div className={`p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span className={`text-sm font-bold ${headingColor}`}>Разрешённые сферы</span>
            </div>
            <ul className={`text-xs leading-relaxed ${subHeadingColor} space-y-1`}>
              <li>• Мемкоины (торговля)</li>
              <li>• Polymarket</li>
              <li>• Фьючерсы и спот-торговля</li>
              <li>• Традиционные инвестиции (скальпинг, интрадей, холд до 3 мес.)</li>
            </ul>
          </div>

          <div className={`p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="w-4 h-4 text-rose-500" />
              <span className={`text-sm font-bold ${headingColor}`}>Запрещённые направления</span>
            </div>
            <ul className={`text-xs leading-relaxed ${subHeadingColor} space-y-1`}>
              <li>• Проп-трейдинг челленджи</li>
              <li>• NFT</li>
              <li>• Стейкинг</li>
              <li>• Облигации и иные инвестиции вне списка</li>
            </ul>
          </div>
        </div>

        {/* Admission Requirements */}
        <div className={`p-4 rounded-xl border ${isDark ? 'border-[#4C7F6E]/20 bg-[#4C7F6E]/5' : 'border-[#4C7F6E]/10 bg-[#4C7F6E]/5'}`}>
          <h3 className={`text-sm font-black mb-3 ${headingColor}`}>Условия допуска к заявке</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { icon: BookOpen, text: 'Пройденный Контур по сфере, в которой запрашивается баланс' },
              { icon: Calendar, text: '21 торговый день в месяце по 5+ часов на демо-счёте с положительной прибылью' },
              { icon: CheckSquare, text: 'Сдача устного, письменного и практического тестирования на 80+ баллов' },
              { icon: Users, text: 'Нахождение в сообществе не менее 60 дней' },
              { icon: Shield, text: 'Подтверждённая верификация в сообществе' },
              { icon: Coins, text: 'Взнос в пул не менее 20.000 рублей' },
              { icon: Wallet, text: 'Внесение страхового депозита не менее 500 USDT' },
              { icon: CheckCircle2, text: 'Прохождение психологического тестирования' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <item.icon className="w-4 h-4 text-[#4C7F6E] mt-0.5 shrink-0" />
                <span className={`text-xs leading-relaxed ${subHeadingColor}`}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className={`p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
          <h3 className={`text-sm font-black mb-2 ${headingColor}`}>Важная информация</h3>
          <p className={`text-xs leading-relaxed ${subHeadingColor} mb-3`}>
            Количественные требования к прибыли на демо-счёте (включая, но не ограничиваясь: абсолютной суммой в USD/BTC/стейблах, процентным отношением к стартовому балансу, количеством прибыльных дней подряд, фактором прибыли или коэффициентом Шарпа) не устанавливаются настоящим регламентом.
          </p>
          <p className={`text-xs leading-relaxed ${subHeadingColor}`}>
            Решение о достаточности результатов демо-торговли принимается единолично DM на основании совокупности качественных и процедурных критериев. DM вправе:
          </p>
          <ul className={`text-xs leading-relaxed ${subHeadingColor} mt-2 space-y-1 ml-4`}>
            <li>• зачесть демо-период даже при отрицательной прибыли, если соблюдены правила риск-менеджмента;</li>
            <li>• отклонить кандидата с прибылью, если процедурные нарушения (отсутствие обоснований, игнорирование стоп-лоссов, некорректная реакция на форс-мажоры или случайный заработок) признаны критическими.</li>
          </ul>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className={`text-lg font-black ${headingColor}`}>
            {isAdmin ? 'Все заявки' : 'Мои заявки'}
          </h2>
          <div className="flex items-center gap-1">
            {(['all', 'pending', 'approved', 'rejected'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === tab
                    ? 'bg-[#4C7F6E] text-white'
                    : isDark
                    ? 'text-gray-400 hover:text-white hover:bg-white/5'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {tab === 'all' && 'Все'}
                {tab === 'pending' && 'На рассмотрении'}
                {tab === 'approved' && 'Одобрено'}
                {tab === 'rejected' && 'Отклонено'}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-2 border-[#4C7F6E]/30 border-t-[#4C7F6E] rounded-full animate-spin mx-auto mb-4" />
            <p className={subHeadingColor}>Загрузка заявок...</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className={`text-center py-16 rounded-2xl border ${cardBg}`}>
            <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${isDark ? 'bg-[#4C7F6E]/20' : 'bg-[#4C7F6E]/10'}`}>
              <FileText className="w-8 h-8 text-[#4C7F6E]" />
            </div>
            <p className={`text-lg font-bold ${headingColor}`}>Нет заявок</p>
            <p className={`text-sm mt-1 ${subHeadingColor}`}>
              {isAdmin ? 'Заявки будут отображаться здесь' : 'Вы ещё не подавали заявок на доступ'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredRequests.map((request) => {
              const status = statusBadgeMap[request.status]
              return (
                <button
                  key={request.id}
                  onClick={() => setSelectedRequest(request)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all hover:scale-[1.01] ${cardBg}`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Avatar userId={request.userId} size="md" />
                      <div>
                        <p className={`font-bold ${headingColor}`}>
                          <UserNickname userId={request.userId} />
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className={`w-5 h-5 rounded flex items-center justify-center ${sphereIcons[request.sphere].bg} ${sphereIcons[request.sphere].color}`}>
                            {sphereIcons[request.sphere].icon}
                          </div>
                          <span className={`text-xs ${subHeadingColor}`}>
                            {TEAM_FUND_SPHERES[request.sphere].label}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}
                      >
                        {status.icon}
                        {status.label}
                      </span>
                      <p className={`text-sm font-black mt-1 ${headingColor}`}>
                        {request.requestedAmount > 0 ? `$${request.requestedAmount.toLocaleString()}` : 'Полный доступ'}
                      </p>
                    </div>
                  </div>
                  {request.comment && (
                    <p className={`text-xs mt-3 line-clamp-2 ${subHeadingColor}`}>{request.comment}</p>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      {showForm && (
        <ApplicationFormModal onClose={() => setShowForm(false)} onSubmit={handleSubmit} theme={theme} />
      )}
      {selectedRequest && (
        <RequestDetailsModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          theme={theme}
          isAdmin={isAdmin}
          onApprove={handleApprove}
          onReject={handleReject}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}
