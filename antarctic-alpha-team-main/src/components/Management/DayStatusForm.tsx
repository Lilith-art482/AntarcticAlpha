import { X, Trash2, Users, Calendar, CheckCircle2, Moon, HeartPulse, Plane, XCircle, AlertTriangle, GraduationCap } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'
import { useAdminStore } from '@/store/adminStore'
import { addApprovalRequest, getDayStatuses, addDayStatus, updateDayStatus, checkRestriction, deleteDayStatus } from '@/services/firestoreService'
import { formatDate, isSameDate, getDatesInRange, normalizeDatesList } from '@/utils/dateUtils'
import { getUserNicknameSync } from '@/utils/userUtils'
import { DayStatus, TEAM_MEMBERS } from '@/types'
import { useScrollLock } from '@/hooks/useScrollLock'

interface DayStatusFormProps {
  type?: 'dayoff' | 'sick' | 'vacation' | 'absence' | 'truancy' | 'internship'
  status?: DayStatus | null
  onClose: () => void
  onSave: () => void
}

export const DayStatusForm = ({ type, status, onClose, onSave }: DayStatusFormProps) => {
  const { user } = useAuthStore()
  const { theme } = useThemeStore()
  const { isAdmin } = useAdminStore()
  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const initialDate = status?.date || formatDate(new Date(), 'yyyy-MM-dd')
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>(
    status?.userId ? [status.userId] : user?.id ? [user.id] : []
  )
  const [date, _setDate] = useState(initialDate)
  const [endDate, setEndDate] = useState(status?.endDate || initialDate)
  const [isMultiDay, setIsMultiDay] = useState(!!status?.endDate)
  const [selectedType, setSelectedType] = useState<'dayoff' | 'sick' | 'vacation' | 'absence' | 'truancy' | 'internship' | null>(
    type || 
    (status?.type && ['dayoff', 'sick', 'vacation', 'absence', 'truancy', 'internship'].includes(status.type) 
      ? (status.type as 'dayoff' | 'sick' | 'vacation' | 'absence' | 'truancy' | 'internship') 
      : null)
  )
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [dateMode, setDateMode] = useState<'single' | 'range' | 'multiple'>('single')
  const [rangeStart, _setRangeStart] = useState(initialDate)
  const [rangeEnd, _setRangeEnd] = useState(initialDate)
  const [multiDateInput, setMultiDateInput] = useState(initialDate)
  const [multipleDates, setMultipleDates] = useState<string[]>([])

  const adminBulkMode = isAdmin && !status

  useScrollLock()

  useEffect(() => {
    if (!isMultiDay) {
      setEndDate(date)
    }
  }, [isMultiDay, date])

  useEffect(() => {
    if (adminBulkMode && dateMode !== 'single') {
      setIsMultiDay(false)
    }
  }, [adminBulkMode, dateMode])

  const toggleUserSelection = (userId: string) => {
    setSelectedUserIds((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId)
      }
      return [...prev, userId]
    })
  }

  const handleSelectAllUsers = () => {
    if (selectedUserIds.length === TEAM_MEMBERS.length) {
      setSelectedUserIds([])
    } else {
      setSelectedUserIds(TEAM_MEMBERS.map((member) => member.id))
    }
  }

  const handleAddMultiDate = () => {
    if (!multiDateInput) return
    const updated = normalizeDatesList([...multipleDates, multiDateInput])
    setMultipleDates(updated)
    setMultiDateInput('')
  }

  const handleRemoveMultiDate = (dateToRemove: string) => {
    setMultipleDates((prev) => prev.filter((d) => d !== dateToRemove))
  }

  const getTargetUsers = (): string[] => {
    if (status) {
      return [status.userId]
    }
    if (adminBulkMode) {
      return selectedUserIds
    }
    if (isAdmin && !user) {
      return selectedUserIds.length > 0 ? selectedUserIds : []
    }
    return user?.id ? [user.id] : []
  }

  const getMemberName = (userId: string) => getUserNicknameSync(userId)

  const getDatePayloads = (currentType: 'dayoff' | 'sick' | 'vacation' | 'absence' | 'truancy' | 'internship'): { date: string; endDate?: string }[] => {
    if (adminBulkMode) {
      if (dateMode === 'range') {
        if (rangeStart && rangeEnd) {
          if (currentType === 'dayoff') {
            return getDatesInRange(rangeStart, rangeEnd).map((d) => ({ date: d }))
          }
          return [{ date: rangeStart, endDate: rangeEnd }]
        }
        return []
      }
      if (dateMode === 'multiple') {
        if (currentType === 'dayoff') {
          return multipleDates.map((d) => ({ date: d }))
        }
        return multipleDates.map((d) => ({ date: d, endDate: d }))
      }
    }

    if (currentType === 'dayoff') {
      if (dateMode === 'range') {
        return getDatesInRange(rangeStart, rangeEnd).map((d) => ({ date: d }))
      }
      if (dateMode === 'multiple') {
        return multipleDates.map((d) => ({ date: d }))
      }
    }

    if (dateMode === 'range' && rangeStart && rangeEnd) {
      return [{ date: rangeStart, endDate: rangeEnd }]
    }
    if (dateMode === 'multiple') {
      return multipleDates.map((d) => ({ date: d, endDate: d }))
    }

    const payload: { date: string; endDate?: string } = { date }
    if (currentType !== 'dayoff' && (isMultiDay || status?.endDate)) {
      payload.endDate = endDate
    }
    return [payload]
  }

  const validateStatus = async (targetUserId: string, startDate: string, endDateValue: string | undefined, currentType: 'dayoff' | 'sick' | 'vacation' | 'absence' | 'truancy' | 'internship'): Promise<string | null> => {
    if (isAdmin) return null
    if (!user) return 'Пользователь не найден'

    const today = new Date()
    const selectedDate = new Date(startDate)
    const selectedEndDate = new Date(endDateValue || startDate)

    if (currentType === 'dayoff') {
      if (isSameDate(selectedDate, today)) {
        return 'Нельзя установить выходной на сегодня. Выберите смену или возьмите больничный.'
      }
    }

    if (currentType === 'sick') {
      const todayStart = new Date()
      todayStart.setHours(0, 0, 0, 0)
      const maxDate = new Date(todayStart)
      maxDate.setDate(maxDate.getDate() + 2)
      const selectedDateObj = new Date(startDate)
      selectedDateObj.setHours(0, 0, 0, 0)

      if (selectedDateObj < todayStart || selectedDateObj > maxDate) {
        return 'Больничный можно взять только на актуальную дату и + 2 суток. Нельзя выбрать заранее.'
      }

      const daysDiff = Math.ceil(
        (selectedEndDate.getTime() - selectedDate.getTime()) / (1000 * 60 * 60 * 24)
      ) + 1

      if (daysDiff < 1) {
        return 'Больничный должен быть минимум на 1 день'
      }

      if (daysDiff > 14) {
        return 'Больничный может длиться не более 14 календарных дней в месяце'
      }

      const monthStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
      const monthEnd = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0)
      const existingStatuses = await getDayStatuses(targetUserId)
      const monthSickDays = existingStatuses.filter(
        (s) => s.type === 'sick' && s.date >= formatDate(monthStart, 'yyyy-MM-dd') && s.date <= formatDate(monthEnd, 'yyyy-MM-dd')
      )

      if (monthSickDays.length + daysDiff > 14) {
        return 'Больничный ограничен 14 днями в месяц'
      }
    }

    if (currentType === 'vacation') {
      const daysDiff = Math.ceil(
        (selectedEndDate.getTime() - selectedDate.getTime()) / (1000 * 60 * 60 * 24)
      ) + 1

      if (daysDiff > 14) {
        return 'Отпуск не может быть больше 14 дней в месяце'
      }

      const yearStart = new Date(selectedDate.getFullYear(), 0, 1)
      const yearEnd = new Date(selectedDate.getFullYear(), 11, 31)
      const existingStatuses = await getDayStatuses(targetUserId)
      const yearVacations = existingStatuses.filter(
        (s) => s.type === 'vacation' && s.date >= formatDate(yearStart, 'yyyy-MM-dd') && s.date <= formatDate(yearEnd, 'yyyy-MM-dd')
      )

      if (yearVacations.length >= 6) {
        return 'Не более 6 отпусков в год'
      }
    }

    if (currentType === 'dayoff') {
      const weekStart = new Date(selectedDate)
      weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1)
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)

      const existingStatuses = await getDayStatuses(targetUserId)
      let weekDayoffs = existingStatuses.filter(
        (s) => s.type === 'dayoff' && s.date >= formatDate(weekStart, 'yyyy-MM-dd') && s.date <= formatDate(weekEnd, 'yyyy-MM-dd')
      )

      if (status) {
        weekDayoffs = weekDayoffs.filter(s => s.id !== status.id)
      }

      if (weekDayoffs.length >= 4) {
        return 'Выходные на неделе ограничены максимум 4 днями'
      }
    }

    return null
  }

  const handleSave = async () => {
    console.log('handleSave called (DayStatusForm)')
    if (!isAdmin && !user) {
      console.log('No user found')
      setError('Пользователь не найден')
      return
    }

    if (!selectedType) {
      setError('Выберите тип отсутствия')
      return
    }

    if (status && !isAdmin && user && status.userId !== user.id) {
      setError('Вы можете редактировать только свои статусы')
      setLoading(false)
      return
    }

    const targetUsers = getTargetUsers()
    if (targetUsers.length === 0) {
      setError('Выберите хотя бы одного участника')
      return
    }

    if (adminBulkMode && dateMode === 'range') {
      if (!rangeStart || !rangeEnd) {
        setError('Укажите даты начала и окончания')
        return
      }
      if (new Date(rangeEnd) < new Date(rangeStart)) {
        setError('Дата окончания не может быть раньше даты начала')
        return
      }
    }

    const datePayloads = getDatePayloads(selectedType)
    if (datePayloads.length === 0) {
      setError('Выберите даты')
      return
    }

    const saveStatusFor = async (targetUserId: string, payload: { date: string; endDate?: string }) => {
      if (!isAdmin) {
        const restrictionCheck = await checkRestriction(selectedType, payload.date)
        if (restrictionCheck.restricted) {
          throw new Error(`[${getMemberName(targetUserId)} • ${formatDate(new Date(payload.date), 'dd.MM.yyyy')}] ${restrictionCheck.reason}`)
        }

        const validationError = await validateStatus(targetUserId, payload.date, payload.endDate, selectedType)
        if (validationError) {
          throw new Error(`[${getMemberName(targetUserId)} • ${formatDate(payload.date, 'dd.MM.yyyy')}] ${validationError}`)
        }
      }

      const statusData: DayStatus = {
        id: status?.id || '',
        userId: targetUserId,
        date: payload.date,
        type: selectedType,
        ...(payload.endDate && { endDate: payload.endDate }),
      }

      if (isAdmin) {
        const { id: _id, ...payload } = statusData
        if (status) {
          await updateDayStatus(status.id, payload)
        } else {
          await addDayStatus(payload)
        }
      } else {
        await addApprovalRequest({
          entity: 'status',
          action: status ? 'update' : 'create',
          authorId: user?.id || targetUserId,
          targetUserId,
          before: status ? status : null,
          after: statusData,
        })
      }
    }

    console.log('Starting save process...')
    setError('')
    setLoading(true)

    try {
      if (status) {
        const payload: { date: string; endDate?: string } = { date }
        if (selectedType !== 'dayoff' && (isMultiDay || status.endDate)) {
          payload.endDate = endDate
        }
        await saveStatusFor(status.userId, payload)
        onSave()
        return
      }

      for (const targetUserId of targetUsers) {
        for (const payload of datePayloads) {
          await saveStatusFor(targetUserId, payload)
        }
      }

      onSave()
    } catch (err: any) {
      console.error('Error saving day status:', err)
      const errorMessage = err.message || err.code || 'Ошибка при сохранении'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const typeOptions = [
    { key: 'dayoff' as const, label: 'Выходной', icon: Moon, color: 'text-green-500', bgColor: 'bg-green-500/10' },
    { key: 'sick' as const, label: 'Больничный', icon: HeartPulse, color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
    { key: 'vacation' as const, label: 'Отпуск', icon: Plane, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    ...(isAdmin ? [
      { key: 'absence' as const, label: 'Отсутствие', icon: XCircle, color: 'text-orange-500', bgColor: 'bg-orange-500/10' },
      { key: 'truancy' as const, label: 'Прогул', icon: AlertTriangle, color: 'text-red-500', bgColor: 'bg-red-500/10' },
      { key: 'internship' as const, label: 'Стажировка', icon: GraduationCap, color: 'text-yellow-500', bgColor: 'bg-yellow-500/10' },
    ] : []),
  ]

  const nounByType: Record<'dayoff' | 'sick' | 'vacation' | 'absence' | 'truancy' | 'internship', string> = {
    dayoff: 'выходной',
    sick: 'больничный',
    vacation: 'отпуск',
    absence: 'отсутствие',
    truancy: 'прогул',
    internship: 'стажировка',
  }

  const headingTitle = selectedType ? `${status ? 'Редактировать' : 'Новый'} ${nounByType[selectedType]}` : 'Новый статус'

  const handleDelete = async () => {
    if (!status) return

    if (!confirm('Удалить этот статус?')) return

    try {
      await deleteDayStatus(status.id)
      onSave()
    } catch (err: any) {
      console.error('Error deleting day status:', err)
      setError(err.message || 'Ошибка при удалении')
    }
  }

  const getTypeIcon = () => {
    if (!selectedType) return Calendar
    const opt = typeOptions.find(t => t.key === selectedType)
    return opt?.icon || Calendar
  }

  const TypeIcon = getTypeIcon()

  return (
    <>
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl flex items-center justify-center z-[70] p-4 touch-manipulation overflow-y-auto">
        <div className={`w-full max-w-2xl rounded-2xl shadow-2xl border ${theme === 'dark' ? 'bg-[#0d1117] border-white/10' : 'bg-white border-gray-200'}`}>
          {/* Header */}
          <div className={`sticky top-0 z-10 px-5 py-4 border-b ${theme === 'dark' ? 'bg-[#0d1117] border-white/10' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${theme === 'dark' ? 'bg-[#4C7F6E]/20' : 'bg-[#4C7F6E]/10'}`}>
                  <TypeIcon className="w-5 h-5 text-[#4C7F6E]" />
                </div>
                <div>
                  <h3 className={`text-lg font-bold ${headingColor}`}>
                    {headingTitle}
                  </h3>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                    {selectedType ? typeOptions.find(t => t.key === selectedType)?.label : 'Выберите тип'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 space-y-5 max-h-[calc(90vh-140px)] overflow-y-auto">
            {/* Type selection */}
            {!status && !type && (
              <section className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 text-[#4C7F6E]" />
                  <span className={`text-sm font-semibold ${headingColor}`}>Тип отсутствия</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {typeOptions.map((item) => {
                    const isSelected = selectedType === item.key
                    const Icon = item.icon
                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => setSelectedType(item.key as typeof selectedType)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'border-[#4C7F6E] bg-[#4C7F6E]/10'
                            : theme === 'dark'
                              ? 'border-white/10 hover:border-white/30'
                              : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-lg ${item.bgColor}`}>
                            <Icon className={`w-4 h-4 ${item.color}`} />
                          </div>
                          <span className={`text-sm font-medium ${headingColor}`}>{item.label}</span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </section>
            )}

            {/* User selection for admin */}
            {adminBulkMode && (
              <section className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4 text-[#4C7F6E]" />
                  <span className={`text-sm font-semibold ${headingColor}`}>Участники</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {TEAM_MEMBERS.map((member) => (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => toggleUserSelection(member.id)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        selectedUserIds.includes(member.id)
                          ? 'bg-[#4C7F6E] text-white'
                          : theme === 'dark'
                            ? 'bg-white/10 text-gray-300 hover:bg-white/20'
                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      {getUserNicknameSync(member.id)}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleSelectAllUsers}
                  className="mt-2 text-xs text-[#4C7F6E] hover:underline"
                >
                  {selectedUserIds.length === TEAM_MEMBERS.length ? 'Снять выделение' : 'Выбрать всех'}
                </button>
              </section>
            )}

            {/* Date selection */}
            <section className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-4 h-4 text-[#4C7F6E]" />
                <span className={`text-sm font-semibold ${headingColor}`}>Дата</span>
              </div>

              {/* Date mode selector - for all users */}
              <div className="flex gap-2 mb-3">
                {[
                  { value: 'single', label: 'Один день' },
                  { value: 'range', label: 'Диапазон' },
                  { value: 'multiple', label: 'Несколько' },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setDateMode(option.value as typeof dateMode)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      dateMode === option.value
                        ? 'bg-[#4C7F6E] text-white'
                        : theme === 'dark'
                          ? 'bg-white/10 text-gray-400 hover:text-white'
                          : 'bg-white text-gray-500 hover:text-gray-900 border border-gray-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              {/* Single date input */}
              {dateMode === 'single' && (
                <div className="space-y-3">
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => _setDate(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-lg border text-sm ${
                      theme === 'dark'
                        ? 'bg-[#161b22] border-white/10 text-white'
                        : 'bg-white border-gray-200 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-[#4C7F6E]/50`}
                  />

                  {(selectedType === 'sick' || selectedType === 'vacation') && (
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isMultiDay}
                        onChange={(e) => setIsMultiDay(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-600 text-[#4C7F6E] focus:ring-[#4C7F6E]"
                      />
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Несколько дней
                      </span>
                    </label>
                  )}

                  {isMultiDay && (selectedType === 'sick' || selectedType === 'vacation') && (
                    <div className="space-y-2">
                      <label className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Дата окончания
                      </label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        min={date}
                        className={`w-full px-4 py-2.5 rounded-lg border text-sm ${
                          theme === 'dark'
                            ? 'bg-[#161b22] border-white/10 text-white'
                            : 'bg-white border-gray-200 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-[#4C7F6E]/50`}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Range date inputs */}
              {dateMode === 'range' && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      С
                    </label>
                    <input
                      type="date"
                      value={rangeStart}
                      onChange={(e) => _setRangeStart(e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-lg border text-sm ${
                        theme === 'dark'
                          ? 'bg-[#161b22] border-white/10 text-white'
                          : 'bg-white border-gray-200 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-[#4C7F6E]/50`}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      По
                    </label>
                    <input
                      type="date"
                      value={rangeEnd}
                      min={rangeStart}
                      onChange={(e) => _setRangeEnd(e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-lg border text-sm ${
                        theme === 'dark'
                          ? 'bg-[#161b22] border-white/10 text-white'
                          : 'bg-white border-gray-200 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-[#4C7F6E]/50`}
                    />
                  </div>
                </div>
              )}

              {/* Multiple dates input */}
              {dateMode === 'multiple' && (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={multiDateInput}
                      onChange={(e) => setMultiDateInput(e.target.value)}
                      className={`flex-1 px-4 py-2.5 rounded-lg border text-sm ${
                        theme === 'dark'
                          ? 'bg-[#161b22] border-white/10 text-white'
                          : 'bg-white border-gray-200 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-[#4C7F6E]/50`}
                    />
                    <button
                      type="button"
                      onClick={handleAddMultiDate}
                      className="px-4 py-2 bg-[#4C7F6E] text-white rounded-lg text-sm font-medium hover:bg-[#4C7F6E]/90"
                    >
                      +
                    </button>
                  </div>
                  {multipleDates.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {multipleDates.map((d) => (
                        <span
                          key={d}
                          className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs ${
                            theme === 'dark' ? 'bg-white/10 text-gray-300' : 'bg-gray-200 text-gray-700'
                          }`}
                        >
                          {formatDate(d, 'dd.MM')}
                          <button onClick={() => handleRemoveMultiDate(d)} className="text-red-400 hover:text-red-300">×</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* Error */}
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-sm">
                {error}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className={`sticky bottom-0 px-5 py-4 border-t flex gap-3 ${theme === 'dark' ? 'bg-[#0d1117] border-white/10' : 'bg-white border-gray-200'}`}>
            {status && isAdmin && (
              <button
                onClick={handleDelete}
                className="px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Удалить
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={loading || !selectedType}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#4C7F6E] hover:bg-[#4C7F6E]/90 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Сохранение...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  {status ? 'Обновить' : isAdmin ? 'Создать' : 'Отправить'}
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className={`px-6 py-2.5 rounded-xl font-medium transition-colors ${
                theme === 'dark' ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              Отмена
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
