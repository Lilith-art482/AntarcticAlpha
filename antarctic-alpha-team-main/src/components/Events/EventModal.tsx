import { useState, useEffect, useRef } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'
import { useUsers } from '@/hooks/useUsers'
import { useScrollLock } from '@/hooks/useScrollLock'
import { addEvent, updateEvent } from '@/services/eventService'
import { uploadFile, deleteFile } from '@/services/storageService'
import type { Event, EventCategory, EventFile } from '@/types'
import { EVENT_CATEGORY_META } from '@/types'
import {
  X,
  Upload,
  Trash2,
  Plus,
  Calendar,
  Link as LinkIcon,
  FileText as FileTextIcon,
  Rocket,
  BarChart3,
  Shield,
  Coins,
  TrendingUp,
  Gift,
  Image,
  LucideIcon,
} from 'lucide-react'

interface EventModalProps {
  event: Event | null
  onClose: () => void
}

const categoryIcons: Record<string, LucideIcon> = {
  memecoins: Rocket,
  polymarket: BarChart3,
  nft: Image,
  staking: Shield,
  spot: Coins,
  futures: TrendingUp,
  airdrop: Gift,
}

export const EventModal = ({ event, onClose }: EventModalProps) => {
  const { user } = useAuthStore()
  const { theme } = useThemeStore()
  const { users: allMembers } = useUsers()
  const { lockScroll, unlockScroll } = useScrollLock()

  useEffect(() => {
    lockScroll()
    return unlockScroll
  }, [lockScroll, unlockScroll])

  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  // Form state
  const [title, setTitle] = useState(event?.title || '')
  const [description, setDescription] = useState(event?.description || '')
  const [category, setCategory] = useState<EventCategory>(event?.category || 'memecoins')
  const [dates, setDates] = useState<string[]>(event?.dates || [])
  const [time, setTime] = useState(event?.time || '12:00')
  const [endTime, setEndTime] = useState(event?.endTime || '')
  const [recurrence, setRecurrence] = useState<Event['recurrence']>(event?.recurrence || { type: 'none', startDate: '' })
  const [links, setLinks] = useState<Event['links']>(event?.links || [])
  const [requiredParticipants, setRequiredParticipants] = useState<string[]>(event?.requiredParticipants || [])
  const [recommendedParticipants, setRecommendedParticipants] = useState<string[]>(event?.recommendedParticipants || [])
  const [going] = useState<string[]>(event?.going || [])
  const [notGoing] = useState<string[]>(event?.notGoing || [])
  const [files, setFiles] = useState<EventFile[]>(event?.files || [])
  const [isHidden, setIsHidden] = useState(event?.isHidden || false)
  const [isActualForce, setIsActualForce] = useState(event?.isActualForce || false)

  // New recurrence fields
  const [recurrenceEndDate, setRecurrenceEndDate] = useState(event?.recurrence?.endDate || '')
  const [excludedDays, setExcludedDays] = useState<number[]>([]) // 0 is Sunday, 1 is Monday, etc.

  // New date input
  const [newDate, setNewDate] = useState('')
  // New link input
  const [newLinkUrl, setNewLinkUrl] = useState('')
  const [newLinkName, setNewLinkName] = useState('')

  // File upload
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const subtleColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
  const borderColor = theme === 'dark' ? 'border-white/10' : 'border-gray-200'
  const bgColor = theme === 'dark' ? 'bg-gray-800' : 'bg-white'
  const inputBg = theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'

  const IconComponent = categoryIcons[category]

  const handleAddDate = () => {
    if (newDate && !dates.includes(newDate)) {
      setDates(prev => [...prev, newDate].sort())
      setNewDate('')
    }
  }

  const generateRecurrenceDates = () => {
    if (!recurrence || recurrence.type === 'none' || !recurrence.startDate || !recurrenceEndDate) {
      alert('Укажите дату начала и дату окончания повторения')
      return
    }

    const parseDate = (dateStr: string) => {
      const [year, month, day] = dateStr.split('-').map(Number)
      return new Date(year, month - 1, day)
    }

    const formatDate = (date: Date) => {
      const y = date.getFullYear()
      const m = String(date.getMonth() + 1).padStart(2, '0')
      const d = String(date.getDate()).padStart(2, '0')
      return `${y}-${m}-${d}`
    }

    const start = parseDate(recurrence.startDate)
    const end = parseDate(recurrenceEndDate)

    if (start > end) {
      alert('Дата начала не может быть позже даты окончания')
      return
    }

    const newDates: string[] = []
    const current = new Date(start)

    while (current <= end) {
      const dayOfWeek = current.getDay()
      if (!excludedDays.includes(dayOfWeek)) {
        newDates.push(formatDate(current))
      }

      if (recurrence.type === 'weekly') {
        current.setDate(current.getDate() + 7)
      } else {
        // daily, range, until - all increment daily
        current.setDate(current.getDate() + 1)
      }

      // Safety break to prevent infinite loops
      if (newDates.length > 730 || current.getTime() > start.getTime() + 1000 * 60 * 60 * 24 * 365 * 2) break
    }

    if (newDates.length > 0) {
      setDates(prev => {
        const combined = Array.from(new Set([...prev, ...newDates]))
        return combined.sort()
      })
      alert(`Добавлено дат: ${newDates.length}`)
    } else {
      alert('Не удалось сгенерировать даты. Проверьте диапазон.')
    }
  }

  const handleRemoveDate = (date: string) => {
    setDates(prev => prev.filter(d => d !== date))
  }

  const handleAddLink = () => {
    if (newLinkUrl && !links.find(l => l.url === newLinkUrl)) {
      setLinks(prev => [...prev, {
        url: newLinkUrl.trim(),
        name: newLinkName.trim() || `Ссылка ${prev.length + 1}`
      }])
      setNewLinkUrl('')
      setNewLinkName('')
    }
  }

  const handleRemoveLink = (url: string) => {
    setLinks(prev => prev.filter(l => l.url !== url))
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || [])
    setSelectedFiles(prev => [...prev, ...newFiles])
  }

  const handleRemoveSelectedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleRemoveExistingFile = async (file: EventFile) => {
    if (!window.confirm(`Удалить файл "${file.name}"?`)) return
    try {
      await deleteFile(file.url)
      setFiles(prev => prev.filter(f => f.id !== file.id))
    } catch (error) {
      console.error('Failed to delete file:', error)
    }
  }

  const handleUploadFiles = async (eventId: string): Promise<EventFile[]> => {
    if (selectedFiles.length === 0) return []

    setUploading(true)
    const uploadedFiles: EventFile[] = []

    try {
      for (const file of selectedFiles) {
        const path = `events/${eventId}/${Date.now()}_${file.name}`
        const result = await uploadFile(file, path)
        uploadedFiles.push({
          id: Date.now().toString() + Math.random().toString(36).slice(2),
          name: result.fileName,
          url: result.url,
          type: file.type,
          size: file.size,
        })
      }
      return uploadedFiles
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || dates.length === 0) {
      alert('Заполните обязательные поля: название и даты')
      return
    }

    setLoading(true)

    try {
      let eventId = event?.id

      if (event) {
        // Upload new files
        const uploadedFiles = await handleUploadFiles(event.id)
        const updatedFiles = [...files, ...uploadedFiles]

        // Update existing event
        await updateEvent(event.id, {
          title,
          description,
          category,
          dates,
          time,
          endTime,
          recurrence: { type: recurrence?.type || 'none', startDate: recurrence?.startDate || '', endDate: recurrenceEndDate },
          links: links.map(l => ({ ...l, url: l.url.trim() })),
          requiredParticipants,
          recommendedParticipants,
          going,
          notGoing,
          files: updatedFiles,
        })
      } else {
        // Create new event
        eventId = await addEvent({
          title,
          description,
          category,
          dates,
          time,
          endTime,
          recurrence: { type: recurrence?.type || 'none', startDate: recurrence?.startDate || '', endDate: recurrenceEndDate },
          links: links.map(l => ({ ...l, url: l.url.trim() })),
          requiredParticipants,
          recommendedParticipants,
          going: [],
          notGoing: [],
          files: [],
          isHidden,
          isActualForce,
          createdBy: user?.id || '',
        })

        // Upload new files
        const uploadedFiles = await handleUploadFiles(eventId)
        if (uploadedFiles.length > 0) {
          await updateEvent(eventId, { files: uploadedFiles })
        }
      }

      onClose()
    } catch (error: any) {
      console.error('Failed to save event:', error)
      alert(error.message || 'Ошибка при сохранении события')
    } finally {
      setLoading(false)
    }
  }

  const toggleRecommendedParticipant = (userId: string) => {
    setRecommendedParticipants(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId)
      }
      // If adding to recommended, remove from required
      setRequiredParticipants(r => r.filter(id => id !== userId))
      return [...prev, userId]
    })
  }

  // Update toggleParticipant to also remove from recommended if added to required
  const toggleRequiredParticipant = (userId: string) => {
    setRequiredParticipants(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId)
      }
      // If adding to required, remove from recommended
      setRecommendedParticipants(r => r.filter(id => id !== userId))
      return [...prev, userId]
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl ${bgColor} shadow-2xl`}>
        {/* Header */}
        <div className={`sticky top-0 z-10 flex items-center justify-between p-6 border-b ${borderColor}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl bg-[#4C7F6E] bg-opacity-10 text-white`}>
              <IconComponent size={20} />
            </div>
            <h2 className={`text-xl font-bold ${textColor}`}>
              {event ? 'Редактирование события' : 'Новое событие'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-all ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
          >
            <X size={20} className={subtleColor} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${textColor}`}>
              Название *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Введите название события"
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${inputBg} ${textColor} placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4C7F6E]`}
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${textColor}`}>
              Категория
            </label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(EVENT_CATEGORY_META) as EventCategory[]).map((cat) => {
                const catMeta = EVENT_CATEGORY_META[cat]
                const CatIcon = categoryIcons[cat]
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${category === cat
                      ? 'bg-[#4C7F6E] text-white'
                      : theme === 'dark' ? 'bg-white/10 text-gray-300 hover:bg-white/20' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    <CatIcon size={16} />
                    {catMeta.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${textColor}`}>
              Описание
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Опишите событие..."
              rows={3}
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${inputBg} ${textColor} placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4C7F6E] resize-none`}
            />
          </div>

          {/* Visibility and Force Actual (Admin Only) */}
          <div className="flex flex-col sm:flex-row gap-6 p-4 rounded-xl border border-[#4C7F6E]/20 bg-[#4C7F6E]/5">
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={isHidden}
                  onChange={(e) => setIsHidden(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-6 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
              </div>
              <span className={`text-sm font-bold ${textColor}`}>Скрыть от всех</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={isActualForce}
                  onChange={(e) => setIsActualForce(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-6 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4C7F6E]"></div>
              </div>
              <span className={`text-sm font-bold ${textColor}`}>Закрепить в актуальных</span>
            </label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${textColor}`}>
                Даты *
              </label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Calendar size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 ${subtleColor} sm:block hidden`} />
                    <input
                      type="date"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className={`w-full sm:pl-12 px-4 py-2.5 rounded-xl border ${borderColor} ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-[#4C7F6E]`}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddDate}
                    disabled={!newDate}
                    className="px-4 py-2.5 rounded-xl bg-[#4C7F6E] text-white font-bold hover:bg-[#3d6660] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#4C7F6E]/20"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                {dates.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {dates.map((date) => (
                      <span
                        key={date}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-full text-sm bg-[#4C7F6E]/10 text-[#4C7F6E] border border-[#4C7F6E]/20"
                      >
                        <Calendar size={12} />
                        {new Date(date).toLocaleDateString('ru-RU')}
                        <button
                          type="button"
                          onClick={() => handleRemoveDate(date)}
                          className="ml-1 hover:text-red-400"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${textColor}`}>
                Время начала
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-[#4C7F6E]`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${textColor}`}>
                Время окончания
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-[#4C7F6E]`}
              />
            </div>
          </div>

          {/* Recurrence */}
          <div className={`p-4 rounded-xl border ${borderColor} ${inputBg}`}>
            <label className={`block text-sm font-bold mb-4 ${textColor} uppercase tracking-wider`}>
              Повторение события
            </label>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'none', label: 'Нет' },
                  { id: 'daily', label: 'Ежедневно' },
                  { id: 'weekly', label: 'Еженедельно' },
                  { id: 'range', label: 'Диапазон дат' },
                  { id: 'until', label: 'До даты' },
                ].map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setRecurrence(prev => ({ ...prev!, type: type.id as any }))}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${recurrence?.type === type.id
                      ? 'bg-[#4C7F6E] text-white shadow-lg shadow-[#4C7F6E]/20'
                      : theme === 'dark' ? 'bg-white/10 text-gray-300 hover:bg-white/20' : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>

              {recurrence?.type !== 'none' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                  <div>
                    <label className={`block text-xs font-medium mb-1.5 ${subtleColor}`}>
                      Дата начала
                    </label>
                    <input
                      type="date"
                      value={recurrence?.startDate}
                      onChange={(e) => setRecurrence(prev => ({ ...prev!, startDate: e.target.value }))}
                      className={`w-full px-3 py-2 rounded-lg border ${borderColor} ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} ${textColor} focus:outline-none focus:ring-2 focus:ring-[#4C7F6E] text-sm`}
                    />
                  </div>
                  {(recurrence?.type === 'daily' || recurrence?.type === 'weekly' || recurrence?.type === 'range' || recurrence?.type === 'until') && (
                    <div>
                      <label className={`block text-xs font-medium mb-1.5 ${subtleColor}`}>
                        {recurrence.type === 'range' ? 'Дата окончания' : 'Повторять до'}
                      </label>
                      <input
                        type="date"
                        value={recurrenceEndDate}
                        onChange={(e) => setRecurrenceEndDate(e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border ${borderColor} ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} ${textColor} focus:outline-none focus:ring-2 focus:ring-[#4C7F6E] text-sm`}
                      />
                    </div>
                  )}

                  <div className="md:col-span-2">
                    <label className={`block text-xs font-medium mb-2 ${subtleColor}`}>
                      Исключить дни недели
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: 1, label: 'Пн' },
                        { id: 2, label: 'Вт' },
                        { id: 3, label: 'Ср' },
                        { id: 4, label: 'Чт' },
                        { id: 5, label: 'Пт' },
                        { id: 6, label: 'Сб' },
                        { id: 0, label: 'Вс' },
                      ].map((day) => (
                        <button
                          key={day.id}
                          type="button"
                          onClick={() => setExcludedDays(prev =>
                            prev.includes(day.id) ? prev.filter(d => d !== day.id) : [...prev, day.id]
                          )}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${excludedDays.includes(day.id)
                            ? 'bg-rose-500 text-white shadow-md'
                            : theme === 'dark' ? 'bg-gray-800 text-gray-400 hover:text-white' : 'bg-white text-gray-500 hover:bg-gray-50'
                            } border ${borderColor}`}
                        >
                          {day.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <button
                      type="button"
                      onClick={generateRecurrenceDates}
                      disabled={!recurrence?.startDate || !recurrenceEndDate}
                      className="w-full py-2.5 rounded-lg bg-[#4C7F6E]/10 text-[#4C7F6E] font-bold hover:bg-[#4C7F6E]/20 transition-all text-sm border border-[#4C7F6E]/20 disabled:opacity-50"
                    >
                      Применить и добавить даты
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Links */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${textColor}`}>
              Ссылки
            </label>

            {/* Existing links */}
            {links.length > 0 && (
              <div className="space-y-2 mb-4">
                {links.map((link, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-3 p-3 rounded-lg border ${borderColor}`}
                  >
                    <LinkIcon size={16} className={subtleColor} />
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex-1 text-sm truncate ${theme === 'dark' ? 'text-[#4C7F6E]/80 hover:text-[#4C7F6E]' : 'text-[#4C7F6E] hover:text-[#3d6660]'}`}
                    >
                      {link.name} <span className="text-[10px] opacity-50 ml-1">({link.url})</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => handleRemoveLink(link.url)}
                      className={`p-1.5 rounded-lg transition-all ${theme === 'dark' ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-50 text-red-600'}`}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add link input */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-[2]">
                  <LinkIcon size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 ${subtleColor}`} />
                  <input
                    type="url"
                    value={newLinkUrl}
                    onChange={(e) => setNewLinkUrl(e.target.value)}
                    placeholder="https://..."
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border ${borderColor} ${inputBg} ${textColor} placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4C7F6E]`}
                  />
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={newLinkName}
                      onChange={(e) => setNewLinkName(e.target.value)}
                      placeholder="Название"
                      className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${inputBg} ${textColor} placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4C7F6E]`}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddLink}
                    disabled={!newLinkUrl.trim()}
                    className="px-5 py-3 rounded-xl bg-[#4C7F6E] text-white font-bold hover:bg-[#3d6660] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#4C7F6E]/20"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Required Participants */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${textColor}`}>
              Обязательные участники
            </label>
            <div className="flex flex-wrap gap-2">
              {allMembers.map((member) => (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => toggleRequiredParticipant(member.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${requiredParticipants.includes(member.id)
                    ? 'bg-[#4C7F6E] text-white'
                    : theme === 'dark' ? 'bg-white/10 text-gray-300 hover:bg-white/20' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {member.name}
                </button>
              ))}
            </div>
          </div>

          {/* Recommended Participants */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${textColor}`}>
              Рекомендованные участники
            </label>
            <div className="flex flex-wrap gap-2">
              {allMembers.map((member) => (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => toggleRecommendedParticipant(member.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${recommendedParticipants.includes(member.id)
                    ? 'bg-blue-500 text-white'
                    : theme === 'dark' ? 'bg-white/10 text-gray-300 hover:bg-white/20' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {member.name}
                </button>
              ))}
            </div>
          </div>

          {/* Files */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${textColor}`}>
              Файлы
            </label>

            {/* Existing files */}
            {files.length > 0 && (
              <div className="space-y-2 mb-4">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border ${borderColor}`}
                  >
                    <FileTextIcon size={18} className={subtleColor} />
                    <span className={`flex-1 text-sm truncate ${textColor}`}>{file.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingFile(file)}
                      className={`p-1.5 rounded-lg transition-all ${theme === 'dark' ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-50 text-red-600'}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Selected files */}
            {selectedFiles.length > 0 && (
              <div className="space-y-2 mb-4">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-3 p-3 rounded-lg border ${borderColor}`}
                  >
                    <FileTextIcon size={18} className={subtleColor} />
                    <span className={`flex-1 text-sm truncate ${textColor}`}>{file.name}</span>
                    <span className={`text-xs ${subtleColor}`}>
                      {(file.size / 1024).toFixed(1)} KB
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSelectedFile(index)}
                      className={`p-1.5 rounded-lg transition-all ${theme === 'dark' ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-50 text-red-600'}`}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border border-dashed ${borderColor} ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-50'} transition-all`}
            >
              <Upload size={18} className={subtleColor} />
              <span className={`text-sm ${subtleColor}`}>Загрузить файлы</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.7z,.rar,.png,.jpg,.jpeg,.gif"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-6 border-t ${borderColor}">
            <button
              type="button"
              onClick={onClose}
              className={`w-full sm:w-auto px-8 py-3 rounded-xl font-bold transition-all ${theme === 'dark' ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                }`}
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading || uploading}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-3 rounded-xl bg-[#4C7F6E] text-white font-black shadow-lg shadow-[#4C7F6E]/25 transition-all hover:shadow-[#4C7F6E]/40 disabled:opacity-50"
            >
              {loading || uploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Сохранение...</span>
                </>
              ) : (
                <>Сохранить</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}