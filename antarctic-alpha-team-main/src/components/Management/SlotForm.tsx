import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'
import { useAdminStore } from '@/store/adminStore'
import { addApprovalRequest, getWorkSlots, addWorkSlot, updateWorkSlot, checkRestriction, getUserConflicts } from '@/services/firestoreService'
import { calculateHours, timeOverlaps, formatDate, getDatesInRange, normalizeDatesList, parseTime } from '@/utils/dateUtils'
import { UserNickname } from '@/components/UserNickname'
import { getUserNicknameSync } from '@/utils/userUtils'
import { X, Plus, Trash2, Edit, Calendar, CheckCircle2, ExternalLink, Clock, Users, Tag, ClipboardList, Coffee } from 'lucide-react'
import { CategorySelector } from './CategorySelector'
import { WorkSlot, TimeSlot, TEAM_MEMBERS, SlotCategory } from '@/types'
import { useScrollLock } from '@/hooks/useScrollLock'

interface SlotFormProps {
  slot?: WorkSlot | null
  onClose: () => void
  onSave: () => void
}

export const SlotForm = ({ slot, onClose, onSave }: SlotFormProps) => {
  const { user } = useAuthStore()
  const { theme } = useThemeStore()
  const { isAdmin } = useAdminStore()
  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const initialDate = slot?.date || formatDate(new Date(), 'yyyy-MM-dd')
  const [date, _setDate] = useState(initialDate)
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>(
    slot?.userId ? [slot.userId] : []
  )
  const [slots, setSlots] = useState<TimeSlot[]>(
    slot?.slots?.map(s => {
      // Convert old format (break) to new format (breaks array) for backward compatibility
      const oldSlot = s as any
      if (oldSlot.break && !oldSlot.breaks) {
        return { ...s, breaks: [oldSlot.break] }
      }
      return s
    }) || []
  )
  const [currentStart, setCurrentStart] = useState('')
  const [currentEnd, setCurrentEnd] = useState('')
  const [crossesMidnight, setCrossesMidnight] = useState(false)
  const [editingTimeSlotIndex, setEditingTimeSlotIndex] = useState<number | null>(null)
  const [currentBreakStart, setCurrentBreakStart] = useState('')
  const [currentBreakEnd, setCurrentBreakEnd] = useState('')
  const [editingBreakSlotIndex, setEditingBreakSlotIndex] = useState<number | null>(null)
  const [editingBreakIndex, setEditingBreakIndex] = useState<number | null>(null)
  const [expandedBreaksSlotIndex, setExpandedBreaksSlotIndex] = useState<number | null>(null)
  const [dateMode, setDateMode] = useState<'single' | 'range' | 'multiple'>('single')
  const [rangeStart, setRangeStart] = useState(initialDate)
  const [rangeEnd, setRangeEnd] = useState(initialDate)
  const [multiDateInput, setMultiDateInput] = useState(initialDate)
  const [multipleDates, setMultipleDates] = useState<string[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [category, setCategory] = useState<SlotCategory | ''>(slot?.category || '')
  const [isTaskRelated, setIsTaskRelated] = useState(!!slot?.taskId)
  const [taskId, setTaskId] = useState(slot?.taskId || '')
  useScrollLock()

  // Взаимоисключение: при включении задачи сбрасываем категорию
  useEffect(() => {
    if (isTaskRelated && category) {
      setCategory('')
    }
  }, [isTaskRelated])

  const adminBulkMode = isAdmin && !slot

  useEffect(() => {
    console.log('SlotForm mounted, user:', user?.name, 'slots count:', slots.length)
  }, [])

  const addOrUpdateTimeSlot = () => {
    if (!currentStart || !currentEnd) {
      setError('Заполните время начала и окончания')
      return
    }

    // Check if slot crosses midnight (either checkbox checked or time indicates crossing)
    const timeIndicatesCrossing = parseTime(currentStart) >= parseTime(currentEnd)
    const slotCrossesMidnight = crossesMidnight || timeIndicatesCrossing

    // Validate time: if time indicates crossing but user didn't acknowledge it, show error
    if (timeIndicatesCrossing && !crossesMidnight) {
      setError('Время окончания должно быть позже времени начала. Включите "Переходит через полночь" для слотов, переходящих на следующий день.')
      return
    }

    // Calculate end date if crossing midnight (always next day relative to selected date)
    let endDate: string | undefined = undefined
    if (slotCrossesMidnight && date) {
      const startDate = new Date(date)
      startDate.setDate(startDate.getDate() + 1)
      endDate = formatDate(startDate, 'yyyy-MM-dd')
    }

    // Add slot without breaks initially (breaks can be added separately)
    const baseBreaks = editingTimeSlotIndex !== null ? (slots[editingTimeSlotIndex]?.breaks || []) : []
    const newSlot: TimeSlot = {
      start: currentStart,
      end: currentEnd,
      ...(endDate && { endDate }),
      breaks: baseBreaks
    }

    if (editingTimeSlotIndex !== null) {
      const updated = [...slots]
      updated[editingTimeSlotIndex] = newSlot
      setSlots(updated)
    } else {
      setSlots([...slots, newSlot])
    }

    setCurrentStart('')
    setCurrentEnd('')
    setCrossesMidnight(false)
    setEditingTimeSlotIndex(null)
    setError('')
  }

  const startEditTimeSlot = (index: number) => {
    const slotToEdit = slots[index]
    if (!slotToEdit) return

    const slotCrossesMidnight = !!slotToEdit.endDate || parseTime(slotToEdit.end) <= parseTime(slotToEdit.start)

    setCurrentStart(slotToEdit.start)
    setCurrentEnd(slotToEdit.end)
    setCrossesMidnight(slotCrossesMidnight)
    setEditingTimeSlotIndex(index)
    setError('')
  }

  const cancelEditTimeSlot = () => {
    setEditingTimeSlotIndex(null)
    setCurrentStart('')
    setCurrentEnd('')
    setCrossesMidnight(false)
    setError('')
  }

  const removeTimeSlot = (index: number) => {
    setSlots(slots.filter((_: any, i: number) => i !== index))
    if (editingTimeSlotIndex === index) {
      cancelEditTimeSlot()
    }
  }

  // Break management functions
  const addBreakToSlot = (slotIndex: number) => {
    if (!currentBreakStart || !currentBreakEnd) {
      setError('Заполните время начала и окончания перерыва')
      return
    }

    const slot = slots[slotIndex]
    if (!slot) return

    if (currentBreakStart >= currentBreakEnd) {
      setError('Время окончания перерыва должно быть позже времени начала')
      return
    }

    const breakStartMin = parseTime(currentBreakStart)
    const breakEndMin = parseTime(currentBreakEnd)
    const slotStartMin = parseTime(slot.start)
    const slotEndMin = parseTime(slot.end)

    const slotCrossesMidnight = slot.endDate || slotEndMin <= slotStartMin
    let breakWithinSlot = false

    if (slotCrossesMidnight) {
      const minutesInDay = 24 * 60
      const breakInFirstPart = breakStartMin >= slotStartMin && breakStartMin < minutesInDay &&
        breakEndMin > breakStartMin && breakEndMin <= minutesInDay
      const breakInSecondPart = breakStartMin >= 0 && breakStartMin <= slotEndMin &&
        breakEndMin > breakStartMin && breakEndMin <= slotEndMin
      const breakSpansMidnight = breakStartMin >= slotStartMin && breakStartMin < minutesInDay &&
        breakEndMin > 0 && breakEndMin <= slotEndMin && breakStartMin > breakEndMin
      breakWithinSlot = breakInFirstPart || breakInSecondPart || breakSpansMidnight
    } else {
      breakWithinSlot = breakStartMin >= slotStartMin && breakEndMin <= slotEndMin && breakEndMin > breakStartMin
    }

    if (!breakWithinSlot) {
      setError(`Перерыв должен быть в пределах времени слота (${slot.start} - ${slot.end})`)
      return
    }

    const existingBreaks = slot.breaks || []
    for (let i = 0; i < existingBreaks.length; i++) {
      if (editingBreakSlotIndex === slotIndex && editingBreakIndex === i) continue
      const existingBreak = existingBreaks[i]
      if (
        (currentBreakStart >= existingBreak.start && currentBreakStart < existingBreak.end) ||
        (currentBreakEnd > existingBreak.start && currentBreakEnd <= existingBreak.end) ||
        (currentBreakStart <= existingBreak.start && currentBreakEnd >= existingBreak.end)
      ) {
        setError('Перерывы не должны пересекаться')
        return
      }
    }

    let newBreaks: { start: string; end: string }[]
    if (editingBreakSlotIndex === slotIndex && editingBreakIndex !== null) {
      newBreaks = [...existingBreaks]
      newBreaks[editingBreakIndex] = { start: currentBreakStart, end: currentBreakEnd }
      newBreaks.sort((a, b) => a.start.localeCompare(b.start))
    } else {
      newBreaks = [...existingBreaks, { start: currentBreakStart, end: currentBreakEnd }]
        .sort((a, b) => a.start.localeCompare(b.start))
    }

    const updatedSlots = [...slots]
    updatedSlots[slotIndex] = { ...slot, breaks: newBreaks }
    setSlots(updatedSlots)
    setCurrentBreakStart('')
    setCurrentBreakEnd('')
    setEditingBreakSlotIndex(null)
    setEditingBreakIndex(null)
    setError('')
  }

  const startEditBreak = (slotIndex: number, breakIndex: number) => {
    const slot = slots[slotIndex]
    if (!slot || !slot.breaks || !slot.breaks[breakIndex]) return
    const breakTime = slot.breaks[breakIndex]
    setEditingBreakSlotIndex(slotIndex)
    setEditingBreakIndex(breakIndex)
    setCurrentBreakStart(breakTime.start)
    setCurrentBreakEnd(breakTime.end)
    setError('')
  }

  const removeBreakFromSlot = (slotIndex: number, breakIndex: number) => {
    const slot = slots[slotIndex]
    if (!slot || !slot.breaks) return
    const updatedBreaks = slot.breaks.filter((_: any, i: number) => i !== breakIndex)
    const updatedSlots = [...slots]
    updatedSlots[slotIndex] = {
      ...slot,
      breaks: updatedBreaks.length > 0 ? updatedBreaks : undefined
    }
    setSlots(updatedSlots)
  }

  const toggleBreaksExpand = (slotIndex: number) => {
    setExpandedBreaksSlotIndex(expandedBreaksSlotIndex === slotIndex ? null : slotIndex)
  }

  const toggleUserSelection = (userId: string) => {
    setSelectedUserIds((prev: string[]) => {
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
      setSelectedUserIds(TEAM_MEMBERS.map((member: any) => member.id))
    }
  }

  const handleAddMultiDate = () => {
    if (!multiDateInput) return
    const updated = normalizeDatesList([...multipleDates, multiDateInput])
    setMultipleDates(updated)
    setMultiDateInput('')
  }

  const handleRemoveMultiDate = (dateToRemove: string) => {
    setMultipleDates((prev: string[]) => prev.filter((d: string) => d !== dateToRemove))
  }

  const getTargetDates = (): string[] => {
    if (adminBulkMode) {
      if (dateMode === 'range') {
        return getDatesInRange(rangeStart, rangeEnd)
      }
      if (dateMode === 'multiple') {
        return multipleDates
      }
    }

    return [date]
  }

  const getTargetUsers = (): string[] => {
    if (slot) {
      return [slot.userId]
    }
    if (adminBulkMode) {
      return selectedUserIds
    }
    // Allow admin to work without user (they can select users via adminBulkMode)
    if (isAdmin && !user) {
      return selectedUserIds.length > 0 ? selectedUserIds : []
    }
    return user?.id ? [user.id] : []
  }

  const getMemberName = (userId: string): string => {
    return getUserNicknameSync(userId)
  }

  const validateSlot = async (slotDate: string, timeSlots: TimeSlot[], targetUserId?: string): Promise<string | null> => {
    // Check user conflicts - users cannot create slots that overlap with their restricted users
    if (targetUserId) {
      const userConflicts = await getUserConflicts(targetUserId, true)
      for (const conflict of userConflicts) {
        const restrictedUserSlots = await getWorkSlots(conflict.restrictedUserId, slotDate)
        for (const timeSlot of timeSlots) {
          for (const restrictedSlot of restrictedUserSlots) {
            if (timeOverlaps(timeSlot, restrictedSlot.slots[0])) {
              const restrictedUserName = getMemberName(conflict.restrictedUserId)
              return `Ваше время пересекается со слотом ${restrictedUserName} (${restrictedSlot.slots[0].start}-${restrictedSlot.slots[0].end}). ${conflict.reason || 'Выберите другое время.'}`
            }
          }
          // Also check next day if slot crosses midnight
          if (timeSlot.endDate) {
            const restrictedNextDaySlots = await getWorkSlots(conflict.restrictedUserId, timeSlot.endDate)
            for (const restrictedSlot of restrictedNextDaySlots) {
              if (timeOverlaps(timeSlot, restrictedSlot.slots[0])) {
                const restrictedUserName = getMemberName(conflict.restrictedUserId)
                return `Ваше время пересекается со слотом ${restrictedUserName} (${restrictedSlot.slots[0].start}-${restrictedSlot.slots[0].end}). ${conflict.reason || 'Выберите другое время.'}`
              }
            }
          }
        }
      }
    }

    // Get all existing slots on this date (excluding the current slot if editing)
    const allExistingSlotsOnDate = await getWorkSlots(undefined, slotDate)
    const existingSlotsOnDate = allExistingSlotsOnDate.filter((s: any) => s.id !== slot?.id)

    // Check max 3 people per slot (for overlapping times)
    for (const timeSlot of timeSlots) {
      // Check overlaps with slots on the same date
      for (const existingSlot of existingSlotsOnDate) {
        if (timeOverlaps(timeSlot, existingSlot.slots[0])) {
          const overlappingCount = existingSlot.participants.length
          if (overlappingCount >= 3) {
            return `Слот ${timeSlot.start}-${timeSlot.end} уже занят максимальным количеством участников (3)`
          }
        }
      }

      // If this slot crosses midnight, also check overlaps with slots on the next day
      if (timeSlot.endDate) {
        const nextDaySlots = await getWorkSlots(undefined, timeSlot.endDate)
        const nextDayExistingSlots = nextDaySlots.filter((s: any) => s.id !== slot?.id)

        for (const existingSlot of nextDayExistingSlots) {
          if (timeOverlaps(timeSlot, existingSlot.slots[0])) {
            const overlappingCount = existingSlot.participants.length
            if (overlappingCount >= 3) {
              return `Слот ${timeSlot.start}-${timeSlot.end} (до ${timeSlot.endDate}) уже занят максимальным количеством участников (3)`
            }
          }
        }
      }
    }

    return null
  }

  const handleSave = async () => {
    console.log('handleSave called')
    // Allow admin to save slots even without user
    if (!isAdmin && !user) {
      console.log('No user found')
      setError('Пользователь не найден')
      return
    }

    if (slots.length === 0) {
      setError('Добавьте хотя бы один временной интервал')
      return
    }

    // Check if user can edit this slot
    if (slot && !isAdmin && user && slot.userId !== user.id) {
      setError('Вы можете редактировать только свои слоты')
      setLoading(false)
      return
    }

    const targetUsers = getTargetUsers()
    if (targetUsers.length === 0) {
      setError('Выберите хотя бы одного участника')
      return
    }

    const targetDates = getTargetDates()
    if (targetDates.length === 0) {
      setError('Выберите даты')
      return
    }

    // Validate: either category or taskId must be specified for new slots
    if (!slot && !category && !taskId) {
      setError('Укажите сферу деятельности или ID задачи')
      return
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const daysBetween = (from: string, to: string) => {
      const a = new Date(from)
      const b = new Date(to)
      a.setHours(0, 0, 0, 0)
      b.setHours(0, 0, 0, 0)
      return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24))
    }

    const createSlotForUserDate = async (targetUserId: string, dateStr: string, participants: string[] = [targetUserId]) => {
      // Пересчитываем endDate под каждую целевую дату, чтобы слоты, переходящие через полночь,
      // сдвигались на следующий день именно относительно текущей даты цикла.
      const adjustedSlots: TimeSlot[] = slots.map((s: TimeSlot) => {
        const crossesWithoutEndDate = !s.endDate && parseTime(s.end) <= parseTime(s.start)
        const baseDiffDays = s.endDate ? daysBetween(date, s.endDate) : (crossesWithoutEndDate ? 1 : 0)

        if (baseDiffDays > 0) {
          const end = new Date(dateStr)
          end.setDate(end.getDate() + baseDiffDays)
          return { ...s, endDate: formatDate(end, 'yyyy-MM-dd') }
        }

        // Если у слота задан endDate, но разница 0, оставляем как есть; если была вручную очищена — убираем поле.
        return { ...s, ...(s.endDate ? { endDate: s.endDate } : {}) }
      })

      // Check restrictions for slot creation
      if (!isAdmin) {
        // Get the earliest slot start time for time-based restrictions
        const earliestSlotStart = adjustedSlots.length > 0 ? adjustedSlots[0].start : undefined

        // Check restriction for the main date
        const restrictionCheck = await checkRestriction('slots', dateStr, earliestSlotStart)
        if (restrictionCheck.restricted) {
          throw new Error(`[${getMemberName(targetUserId)} • ${formatDate(new Date(dateStr), 'dd.MM.yyyy')}] ${restrictionCheck.reason}`)
        }

        // For slots that cross midnight, also check the next day
        for (const slot of adjustedSlots) {
          if (slot.endDate && slot.endDate !== dateStr) {
            const nextDayCheck = await checkRestriction('slots', slot.endDate)
            if (nextDayCheck.restricted) {
              throw new Error(`[${getMemberName(targetUserId)} • ${formatDate(new Date(slot.endDate), 'dd.MM.yyyy')}] ${nextDayCheck.reason}`)
            }
          }
        }
      }

      // Check user conflicts (applies to everyone including admins)
      const validationError = await validateSlot(dateStr, adjustedSlots, targetUserId)
      if (validationError) {
        throw new Error(`[${getMemberName(targetUserId)} • ${formatDate(new Date(dateStr), 'dd.MM.yyyy')}] ${validationError}`)
      }

      const slotData: WorkSlot = {
        id: slot?.id || '',
        userId: targetUserId,
        date: dateStr,
        slots: adjustedSlots,
        participants,
        ...(category ? { category: category as SlotCategory } : (slot?.category ? { category: slot.category } : {})),
        ...(isTaskRelated && taskId && { taskId }),
      }

      if (isAdmin) {
        if (slot) {
          const { id: _id, ...payload } = slotData
          await updateWorkSlot(slot.id, payload)
        } else {
          const { id: _id, ...payload } = slotData
          await addWorkSlot(payload)
        }
      } else {
        await addApprovalRequest({
          entity: 'slot',
          action: slot ? 'update' : 'create',
          authorId: user?.id || targetUserId,
          targetUserId,
          before: slot ? slot : null,
          after: slotData,
          comment: isTaskRelated && taskId ? `Связано с задачей: ${taskId}` : undefined,
        })
      }
    }

    console.log('Starting save process...')
    setError('')
    setLoading(true)

    try {
      if (slot) {
        await createSlotForUserDate(slot.userId, date, slot.participants || [slot.userId])
        onSave()
        return
      }

      if (adminBulkMode && dateMode !== 'single') {
        for (const dateStr of targetDates) {
          for (const targetUserId of targetUsers) {
            await createSlotForUserDate(targetUserId, dateStr)
          }
        }
      } else {
        for (const targetUserId of targetUsers) {
          await createSlotForUserDate(targetUserId, date)
        }
      }

      onSave()
    } catch (err: any) {
      console.error('Error saving slot:', err)
      const errorMessage = err.message || err.code || 'Ошибка при сохранении'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl flex items-center justify-center z-[70] p-4 touch-manipulation overflow-y-auto">
        <div className={`w-full max-w-4xl rounded-2xl shadow-2xl border ${theme === 'dark' ? 'bg-[#0d1117] border-white/10' : 'bg-white border-gray-200'}`}>
          {/* Header */}
          <div className={`sticky top-0 z-10 px-5 py-4 border-b ${theme === 'dark' ? 'bg-[#0d1117] border-white/10' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${theme === 'dark' ? 'bg-[#4C7F6E]/20' : 'bg-[#4C7F6E]/10'}`}>
                  <Clock className="w-5 h-5 text-[#4C7F6E]" />
                </div>
                <div>
                  <h3 className={`text-lg font-bold ${headingColor}`}>
                    {slot ? 'Редактировать слот' : 'Новый слот'}
                  </h3>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                    {slots.length > 0 ? `${slots.length} интервал · ${calculateHours(slots).toFixed(1)} ч` : 'Заполните поля ниже'}
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
            {/* User selection for admin */}
            {adminBulkMode && (
              <section className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4 text-[#4C7F6E]" />
                  <span className={`text-sm font-semibold ${headingColor}`}>Участники</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {TEAM_MEMBERS.map((member: any) => (
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
                      <UserNickname userId={member.id} />
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
              
              {adminBulkMode && (
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
              )}

              {(!adminBulkMode || dateMode === 'single') && (
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
              )}

              {adminBulkMode && dateMode === 'range' && (
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="date"
                    value={rangeStart}
                    onChange={(e) => setRangeStart(e.target.value)}
                    className={`px-4 py-2.5 rounded-lg border text-sm ${
                      theme === 'dark'
                        ? 'bg-[#161b22] border-white/10 text-white'
                        : 'bg-white border-gray-200 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-[#4C7F6E]/50`}
                  />
                  <input
                    type="date"
                    value={rangeEnd}
                    min={rangeStart}
                    onChange={(e) => setRangeEnd(e.target.value)}
                    className={`px-4 py-2.5 rounded-lg border text-sm ${
                      theme === 'dark'
                        ? 'bg-[#161b22] border-white/10 text-white'
                        : 'bg-white border-gray-200 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-[#4C7F6E]/50`}
                  />
                </div>
              )}

              {adminBulkMode && dateMode === 'multiple' && (
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

            {/* Time slots */}
            <section className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#4C7F6E]" />
                  <span className={`text-sm font-semibold ${headingColor}`}>Время</span>
                </div>
                {slots.length > 0 && (
                  <span className={`text-xs px-2 py-1 rounded-full ${theme === 'dark' ? 'bg-[#4C7F6E]/20 text-[#4C7F6E]' : 'bg-[#4C7F6E]/10 text-[#4C7F6E]'}`}>
                    {calculateHours(slots).toFixed(1)} ч
                  </span>
                )}
              </div>

              {/* Add time slot form */}
              <div className="space-y-3 mb-3">
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={currentStart}
                    onChange={(e) => setCurrentStart(e.target.value)}
                    className={`flex-1 px-3 py-2 rounded-lg border text-sm ${
                      theme === 'dark'
                        ? 'bg-[#161b22] border-white/10 text-white'
                        : 'bg-white border-gray-200 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-[#4C7F6E]/50`}
                  />
                  <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}>→</span>
                  <input
                    type="time"
                    value={currentEnd}
                    onChange={(e) => setCurrentEnd(e.target.value)}
                    className={`flex-1 px-3 py-2 rounded-lg border text-sm ${
                      theme === 'dark'
                        ? 'bg-[#161b22] border-white/10 text-white'
                        : 'bg-white border-gray-200 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-[#4C7F6E]/50`}
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={crossesMidnight}
                      onChange={(e) => setCrossesMidnight(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-600 text-[#4C7F6E] focus:ring-[#4C7F6E]"
                    />
                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Через полночь
                    </span>
                  </label>

                  <button
                    type="button"
                    onClick={addOrUpdateTimeSlot}
                    className="flex items-center gap-1.5 px-3 py-2 bg-[#4C7F6E] text-white rounded-lg text-sm font-medium hover:bg-[#4C7F6E]/90 transition-colors"
                  >
                    {editingTimeSlotIndex !== null ? <Edit className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    {editingTimeSlotIndex !== null ? 'Сохранить' : 'Добавить'}
                  </button>
                  
                  {editingTimeSlotIndex !== null && (
                    <button
                      type="button"
                      onClick={cancelEditTimeSlot}
                      className={`px-3 py-2 rounded-lg text-sm ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                      Отмена
                    </button>
                  )}
                </div>
              </div>

              {/* Added slots list */}
              {slots.length > 0 && (
                <div className="space-y-2">
                  {slots.map((s, index) => (
                    <div
                      key={index}
                      className={`rounded-lg overflow-hidden ${
                        theme === 'dark' ? 'bg-[#161b22]' : 'bg-white border border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between p-2.5">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium ${headingColor}`}>
                            {s.start} — {s.end}
                          </span>
                          {s.endDate && (
                            <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                              theme === 'dark' ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'
                            }`}>
                              до {formatDate(new Date(s.endDate), 'dd.MM')}
                            </span>
                          )}
                          {s.breaks && s.breaks.length > 0 && (
                            <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                              theme === 'dark' ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700'
                            }`}>
                              {s.breaks.length} перерыв
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => toggleBreaksExpand(index)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              expandedBreaksSlotIndex === index
                                ? 'bg-amber-500/20 text-amber-400'
                                : theme === 'dark' ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                            }`}
                            title="Перерывы"
                          >
                            <Coffee className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => startEditTimeSlot(index)}
                            className={`p-1.5 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => removeTimeSlot(index)}
                            className={`p-1.5 rounded-lg transition-colors hover:bg-red-500/20 text-red-400`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Breaks section */}
                      {expandedBreaksSlotIndex === index && (
                        <div className={`px-2.5 pb-2.5 pt-0 border-t ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'}`}>
                          <div className="flex items-center gap-2 mb-2 mt-2">
                            <Coffee className="w-3 h-3 text-amber-500" />
                            <span className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                              Перерывы
                            </span>
                          </div>
                          
                          {/* Add break form */}
                          <div className="flex items-center gap-2 mb-2">
                            <input
                              type="time"
                              value={editingBreakSlotIndex === index ? currentBreakStart : ''}
                              onChange={(e) => {
                                setEditingBreakSlotIndex(index)
                                setCurrentBreakStart(e.target.value)
                              }}
                              placeholder="Начало"
                              className={`flex-1 px-2 py-1.5 rounded-lg border text-xs ${
                                theme === 'dark'
                                  ? 'bg-[#0d1117] border-white/10 text-white'
                                  : 'bg-gray-50 border-gray-200 text-gray-900'
                              } focus:outline-none focus:ring-1 focus:ring-amber-500/50`}
                            />
                            <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}>—</span>
                            <input
                              type="time"
                              value={editingBreakSlotIndex === index ? currentBreakEnd : ''}
                              onChange={(e) => {
                                setEditingBreakSlotIndex(index)
                                setCurrentBreakEnd(e.target.value)
                              }}
                              placeholder="Конец"
                              className={`flex-1 px-2 py-1.5 rounded-lg border text-xs ${
                                theme === 'dark'
                                  ? 'bg-[#0d1117] border-white/10 text-white'
                                  : 'bg-gray-50 border-gray-200 text-gray-900'
                              } focus:outline-none focus:ring-1 focus:ring-amber-500/50`}
                            />
                            <button
                              type="button"
                              onClick={() => addBreakToSlot(index)}
                              className="p-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded-lg transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          
                          {/* Breaks list */}
                          {s.breaks && s.breaks.length > 0 && (
                            <div className="space-y-1">
                              {s.breaks.map((br, brIndex) => (
                                <div
                                  key={brIndex}
                                  className={`flex items-center justify-between px-2 py-1.5 rounded-lg ${
                                    theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'
                                  }`}
                                >
                                  <span className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                    {br.start} — {br.end}
                                  </span>
                                  <div className="flex items-center gap-1">
                                    <button
                                      onClick={() => startEditBreak(index, brIndex)}
                                      className={`p-1 rounded transition-colors ${theme === 'dark' ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-200 text-gray-500'}`}
                                    >
                                      <Edit className="w-3 h-3" />
                                    </button>
                                    <button
                                      onClick={() => removeBreakFromSlot(index, brIndex)}
                                      className="p-1 rounded hover:bg-red-500/20 text-red-400 transition-colors"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Category selection */}
            <section className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4 text-[#4C7F6E]" />
                <span className={`text-sm font-semibold ${headingColor}`}>
                  Сфера деятельности
                </span>
              </div>
              <CategorySelector
                selectedCategory={category}
                onSelect={(cat) => {
                  setCategory(cat)
                  // Взаимоисключение: при выборе категории сбрасываем задачу
                  if (cat) {
                    setTaskId('')
                    setIsTaskRelated(false)
                  }
                  setError('')
                }}
                error={!slot && !category && !!error && error.includes('сферу')}
              />
            </section>

            {/* Task relation */}
            <section className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
              <label className="flex items-center gap-3 cursor-pointer mb-3">
                <div className={`relative w-10 h-6 rounded-full transition-colors ${isTaskRelated ? 'bg-[#4C7F6E]' : theme === 'dark' ? 'bg-white/20' : 'bg-gray-300'}`}>
                  <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${isTaskRelated ? 'translate-x-4' : ''}`} />
                </div>
                <input
                  type="checkbox"
                  checked={isTaskRelated}
                  onChange={(e) => setIsTaskRelated(e.target.checked)}
                  className="hidden"
                />
                <div className="flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-[#4C7F6E]" />
                  <span className={`text-sm font-semibold ${headingColor}`}>Выполняю задачу</span>
                </div>
              </label>

              {isTaskRelated && (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={taskId}
                    onChange={(e) => {
                      setTaskId(e.target.value)
                      // Взаимоисключение: при вводе ID задачи сбрасываем категорию
                      if (e.target.value && category) {
                        setCategory('')
                      }
                    }}
                    placeholder="ID задачи"
                    className={`w-full px-4 py-2.5 rounded-lg border text-sm ${
                      theme === 'dark'
                        ? 'bg-[#161b22] border-white/10 text-white placeholder-gray-500'
                        : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                    } focus:outline-none focus:ring-2 focus:ring-[#4C7F6E]/50`}
                  />
                  <p className={`text-xs flex items-center gap-1.5 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                    <ExternalLink className="w-3 h-3" />
                    ID можно найти в разделе Tasks в карточке задачи
                  </p>
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
  <button
    onClick={handleSave}
    disabled={loading || slots.length === 0 || (!slot && !category && !taskId)}
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
                  {slot ? 'Обновить' : isAdmin ? 'Создать' : 'Отправить'}
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
