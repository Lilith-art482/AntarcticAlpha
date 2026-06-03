import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'
import { useAdminStore } from '@/store/adminStore'
import { getWorkSlots, deleteWorkSlot, getDayStatuses, deleteDayStatus, addApprovalRequest } from '@/services/firestoreService'
import { formatDate } from '@/utils/dateUtils'
import { getUserNicknameSync } from '@/utils/userUtils'
import { X, Trash2, Users, Calendar, Filter, ChevronRight, Check, AlertTriangle, Moon, HeartPulse, Plane, XCircle, GraduationCap } from 'lucide-react'
import { TEAM_MEMBERS, DayStatus } from '@/types'
import { useScrollLock } from '@/hooks/useScrollLock'

interface DeleteSlotsFormProps {
  onClose: () => void
  onSave: () => void
}

export const DeleteSlotsForm = ({ onClose, onSave }: DeleteSlotsFormProps) => {
  const { user } = useAuthStore()
  const { theme } = useThemeStore()
  const { isAdmin } = useAdminStore()
  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'

  const [selectedUserIds, setSelectedUserIds] = useState<string[]>(isAdmin ? [] : user?.id ? [user.id] : [])
  const [selectedDeleteTypes, setSelectedDeleteTypes] = useState<('slots' | 'dayoff' | 'sick' | 'vacation' | 'absence' | 'truancy' | 'internship')[]>(['slots'])

  const [deleteByWeekDay, setDeleteByWeekDay] = useState(false)
  const [deleteByDates, setDeleteByDates] = useState(false)
  const [deleteByDateRange, setDeleteByDateRange] = useState(false)
  const [selectedWeekDays, setSelectedWeekDays] = useState<number[]>([])
  const [selectedDates, setSelectedDates] = useState<string[]>([])
  const [currentDate, setCurrentDate] = useState('')
  const [dateRangeStart, setDateRangeStart] = useState('')
  const [dateRangeEnd, setDateRangeEnd] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeStep, setActiveStep] = useState<number>(0)

  useScrollLock()

  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
  const selectionInfo = deleteByWeekDay
    ? (selectedWeekDays.length > 0 ? selectedWeekDays.map((d) => weekDays[d]).join(', ') : 'Дни недели')
    : deleteByDates
    ? (selectedDates[0] ? `${formatDate(selectedDates[0], 'dd.MM')} +${Math.max(selectedDates.length - 1, 0)}` : 'Добавьте даты')
    : deleteByDateRange
    ? (dateRangeStart && dateRangeEnd ? `${formatDate(dateRangeStart, 'dd.MM')}–${formatDate(dateRangeEnd, 'dd.MM')}` : 'Укажите диапазон')
    : 'Выберите режим'

  const deleteTypeOptions = [
    { key: 'slots' as const, label: 'Слоты', icon: Calendar, availableFor: true },
    { key: 'dayoff' as const, label: 'Выходные', icon: Moon, availableFor: true },
    { key: 'sick' as const, label: 'Больничные', icon: HeartPulse, availableFor: true },
    { key: 'vacation' as const, label: 'Отпуска', icon: Plane, availableFor: true },
    ...(isAdmin ? [
      { key: 'truancy' as const, label: 'Прогулы', icon: AlertTriangle, availableFor: true },
      { key: 'internship' as const, label: 'Стажировки', icon: GraduationCap, availableFor: true },
      { key: 'absence' as const, label: 'Отсутствия', icon: XCircle, availableFor: true },
    ] : []),
  ]

  const handleUserToggle = (userId: string) => {
    setSelectedUserIds((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  const toggleDeleteType = (typeKey: 'slots' | 'dayoff' | 'sick' | 'vacation' | 'absence' | 'truancy' | 'internship') => {
    setSelectedDeleteTypes((prev) => {
      if (prev.includes(typeKey)) {
        return prev.filter((t) => t !== typeKey)
      }
      return [...prev, typeKey]
    })
  }

  const toggleMode = (setter: (v: boolean) => void, value: boolean, blockers: boolean[]) => {
    if (value && blockers.some(Boolean)) {
      setError('Снимите галочку с другой функции, чтобы активировать эту')
      return
    }
    setter(value)
    if (!value) setError('')
  }

  const addDate = () => {
    if (!currentDate) {
      setError('Выберите дату')
      return
    }
    if (selectedDates.includes(currentDate)) {
      setError('Эта дата уже добавлена')
      return
    }
    setSelectedDates([...selectedDates, currentDate].sort())
    setCurrentDate('')
    setError('')
  }

  const removeDate = (date: string) => setSelectedDates(selectedDates.filter((d) => d !== date))

  const handleDelete = async () => {
    if (!isAdmin && !user) {
      setError('Пользователь не найден')
      return
    }

    const targetUserIds = isAdmin ? selectedUserIds : user ? [user.id] : []
    if (targetUserIds.length === 0) {
      setError('Выберите хотя бы одного участника')
      return
    }
    if (selectedDeleteTypes.length === 0) {
      setError('Выберите хотя бы один тип записей')
      return
    }
    if (!deleteByWeekDay && !deleteByDates && !deleteByDateRange) {
      setError('Выберите способ удаления')
      return
    }
    if (deleteByWeekDay && selectedWeekDays.length === 0) {
      setError('Выберите день недели')
      return
    }
    if (deleteByDates && selectedDates.length === 0) {
      setError('Добавьте хотя бы одну дату')
      return
    }
    if (deleteByDateRange) {
      if (!dateRangeStart || !dateRangeEnd) {
        setError('Укажите начальную и конечную дату диапазона')
        return
      }
      if (dateRangeStart > dateRangeEnd) {
        setError('Начальная дата должна быть раньше конечной')
        return
      }
    }

    setError('')
    setLoading(true)

    try {
      const allSlotsArrays = await Promise.all(targetUserIds.map((u) => getWorkSlots(u)))
      const allStatusesArrays = await Promise.all(targetUserIds.map((u) => getDayStatuses(u)))
      const allSlots = allSlotsArrays.flat()
      const allStatuses = allStatusesArrays.flat()

      const overlapsRange = (date: string, end?: string) => {
        if (!dateRangeStart || !dateRangeEnd) return false
        const endVal = end || date
        return !(endVal < dateRangeStart || date > dateRangeEnd)
      }
      const matchesDateList = (date: string, end?: string) => {
        if (selectedDates.length === 0) return false
        if (!end) return selectedDates.includes(date)
        return selectedDates.some((d) => d >= date && d <= (end || date))
      }
      const matchesWeekDays = (date: string, end?: string) => {
        if (selectedWeekDays.length === 0) return false
        const dates: string[] = []
        const start = new Date(date + 'T00:00:00')
        const endDate = end ? new Date(end + 'T00:00:00') : new Date(date + 'T00:00:00')
        let cursor = start
        while (cursor <= endDate) {
          dates.push(formatDate(cursor, 'yyyy-MM-dd'))
          cursor.setDate(cursor.getDate() + 1)
        }
        return dates.some((dStr) => {
          const d = new Date(dStr + 'T00:00:00')
          const dow = d.getDay() === 0 ? 6 : d.getDay() - 1
          return selectedWeekDays.includes(dow)
        })
      }

      let idsToDelete: string[] = []
      
      for (const deleteType of selectedDeleteTypes) {
        if (deleteType === 'slots') {
          const slotIds = allSlots
            .filter((slot) => {
              if (deleteByWeekDay && matchesWeekDays(slot.date)) return true
              if (deleteByDates && selectedDates.includes(slot.date)) return true
              if (deleteByDateRange && overlapsRange(slot.date)) return true
              return false
            })
            .map((slot) => slot.id)
          idsToDelete.push(...slotIds)
        } else {
          const statusIds = allStatuses
            .filter((s: DayStatus) => {
              if (s.type !== deleteType) return false
              if (deleteByWeekDay && matchesWeekDays(s.date, s.endDate)) return true
              if (deleteByDates && matchesDateList(s.date, s.endDate)) return true
              if (deleteByDateRange && overlapsRange(s.date, s.endDate)) return true
              return false
            })
            .map((s) => s.id)
          idsToDelete.push(...statusIds)
        }
      }

      if (idsToDelete.length === 0) {
        setError('Ничего не найдено под выбранные условия')
        setLoading(false)
        return
      }

      const usersText =
        targetUserIds.length > 1
          ? `${targetUserIds.length} участников`
          : getUserNicknameSync(targetUserIds[0]) || 'участника'
      const weekDaysText = selectedWeekDays.map((d) => weekDays[d]).join(', ')
      const typesText = selectedDeleteTypes
        .map((t) => {
          switch (t) {
            case 'slots': return 'слоты'
            case 'dayoff': return 'выходные'
            case 'sick': return 'больничные'
            case 'vacation': return 'отпуска'
            case 'absence': return 'отсутствия'
            case 'truancy': return 'прогулы'
            case 'internship': return 'стажировки'
          }
        })
        .join(', ')
      const scopeText = deleteByWeekDay
        ? `по дням недели (${weekDaysText})`
        : deleteByDates
        ? `по датам: ${selectedDates.map((d) => formatDate(d, 'dd.MM')).join(', ')}`
        : `по диапазону ${formatDate(dateRangeStart, 'dd.MM')} — ${formatDate(dateRangeEnd, 'dd.MM')}`

      if (!confirm(`Удалить ${typesText} (${idsToDelete.length}) ${scopeText} для ${usersText}?`)) {
        setLoading(false)
        return
      }

      if (isAdmin) {
        // Админ удаляет напрямую
        for (const id of idsToDelete) {
          const slot = allSlots.find(s => s.id === id)
          if (slot) {
            await deleteWorkSlot(id)
          } else {
            await deleteDayStatus(id)
          }
        }
        // Small delay to allow Firestore to propagate changes
        await new Promise(resolve => setTimeout(resolve, 100))
      } else {
        // Не-админ отправляет запросы на согласование
        for (const id of idsToDelete) {
          const slot = allSlots.find(s => s.id === id)
          if (slot) {
            await addApprovalRequest({
              entity: 'slot',
              action: 'delete',
              authorId: user?.id || '',
              targetUserId: slot.userId,
              before: slot,
              after: null,
              comment: `Удаление слота ${formatDate(slot.date, 'dd.MM.yyyy')}`,
            })
          } else {
            const status = allStatuses.find(s => s.id === id)
            if (status) {
              await addApprovalRequest({
                entity: 'status',
                action: 'delete',
                authorId: user?.id || '',
                targetUserId: status.userId,
                before: status,
                after: null,
                comment: `Удаление статуса ${formatDate(status.date, 'dd.MM.yyyy')}`,
              })
            }
          }
        }
      }

      onSave()
      onClose()
    } catch (err) {
      console.error('Error deleting items:', err)
      setError('Ошибка при удалении')
    } finally {
      setLoading(false)
    }
  }

  const steps = [
    { id: 'type', label: 'Типы', icon: Filter, done: selectedDeleteTypes.length > 0 },
    { id: 'members', label: 'Участники', icon: Users, done: selectedUserIds.length > 0 || !isAdmin },
    { id: 'dates', label: 'Режим', icon: Calendar, done: selectionInfo !== 'Выберите режим' },
  ]

  const progress = Math.round((steps.filter(s => s.done).length / steps.length) * 100)

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xl flex items-start sm:items-center justify-center z-[70] p-4 sm:p-6 overflow-y-auto overscroll-contain modal-scroll">
      <div className={`w-full max-w-5xl rounded-3xl shadow-[0_24px_80px_rgba(0,0,0,0.45)] border ${theme === 'dark' ? 'bg-gradient-to-br from-[#0c1320] via-[#0b1220] to-[#08111b] border-white/10' : 'bg-gradient-to-br from-white via-slate-50 to-white border-slate-200'} max-h-[85dvh] sm:max-h-[calc(100dvh-96px)] overflow-y-auto`}>
        <div className="p-5 sm:p-6 lg:p-7 flex flex-col h-full min-h-0 overflow-y-auto modal-scroll">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4C7F6E]/10 text-[#4C7F6E] border border-[#4C7F6E]/30 text-xs font-bold uppercase tracking-wider">
                  Очистка расписания
                </span>
              </div>
              <h3 className={`text-2xl sm:text-3xl font-bold ${headingColor}`}>
                Удаление слотов и отсутствий
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <div className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl border text-sm ${theme === 'dark' ? 'border-white/10 bg-white/5 text-gray-200' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#4C7F6E]" />
                  <span className="font-semibold">{steps.filter(s => s.done).length}/{steps.length}</span>
                </div>
                <span className="text-gray-500">заполнено</span>
              </div>
              <button
                onClick={onClose}
                className={`p-2.5 rounded-full border transition-all hover:scale-105 active:scale-95 ${theme === 'dark' ? 'border-white/10 text-gray-200 hover:bg-white/5' : 'border-slate-200 text-slate-600 hover:bg-slate-100'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#4C7F6E] to-[#5a9a87] transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="mt-2 grid lg:grid-cols-[280px_1fr] gap-6 flex-1 overflow-hidden">
            {/* Navigation sidebar */}
            <aside className={`hidden lg:block rounded-2xl border ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'} p-4 space-y-3 sticky top-0 self-start max-h-[calc(85dvh-200px)] overflow-y-auto`}>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">Навигация</p>
              <div className="space-y-1">
                {steps.map((step, index) => (
                  <button
                    key={step.id}
                    onClick={() => {
                      const element = document.getElementById(step.id)
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
                        setActiveStep(index)
                      }
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${activeStep === index
                      ? 'bg-[#4C7F6E]/10 border border-[#4C7F6E]/30'
                      : 'border border-transparent hover:bg-white/5'
                    }`}
                  >
                    <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${step.done ? 'bg-[#4C7F6E] text-white' : activeStep === index ? 'bg-[#4C7F6E]/20 text-[#4C7F6E]' : 'bg-slate-200 dark:bg-white/10 text-gray-400'}`}>
                      {step.done ? <Check className="w-4 h-4" /> : <step.icon className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold ${activeStep === index ? 'text-[#4C7F6E]' : ''}`}>{step.label}</p>
                      {step.id === 'type' && selectedDeleteTypes.length > 0 && (
                        <p className="text-xs text-gray-500 truncate">{selectedDeleteTypes.length} тип(ов)</p>
                      )}
                      {step.id === 'members' && selectedUserIds.length > 0 && (
                        <p className="text-xs text-gray-500 truncate">{selectedUserIds.length} участник(ов)</p>
                      )}
                      {step.id === 'dates' && selectionInfo !== 'Выберите режим' && (
                        <p className="text-xs text-gray-500 truncate">{selectionInfo}</p>
                      )}
                    </div>
                    {activeStep !== index && <ChevronRight className="w-4 h-4 text-gray-400" />}
                  </button>
                ))}
              </div>
            </aside>

            <div className="space-y-6 overflow-y-auto overscroll-contain pr-1 pb-6 flex-1 min-h-0">
              {/* Type selection */}
              <section id="type" className="scroll-mt-24 space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`p-2 rounded-lg ${steps[0].done ? 'bg-[#4C7F6E]' : 'bg-slate-200 dark:bg-white/10'}`}>
                    <Filter className={`w-5 h-5 ${steps[0].done ? 'text-white' : 'text-gray-400'}`} />
                  </div>
                  <div>
                    <h4 className={`text-lg font-bold ${headingColor}`}>Что удаляем</h4>
                    <p className="text-sm text-gray-500">Выберите типы записей (можно несколько)</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {deleteTypeOptions.map((item) => {
                    const isSelected = selectedDeleteTypes.includes(item.key)
                    const Icon = item.icon
                    return (
                      <button
                        key={item.key}
                        onClick={() => toggleDeleteType(item.key)}
                        className={`px-4 py-3 rounded-xl border text-sm font-semibold transition-all hover:scale-105 active:scale-95 flex items-center gap-2 ${
                          isSelected
                            ? 'border-[#4C7F6E] bg-[#4C7F6E]/10 text-[#4C7F6E] shadow-lg'
                            : theme === 'dark'
                            ? 'border-white/10 bg-white/5 text-gray-300 hover:border-white/30'
                            : 'border-gray-200 bg-white text-gray-800 hover:border-gray-300'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                        {isSelected && <Check className="w-4 h-4 text-[#4C7F6E]" />}
                      </button>
                    )
                  })}
                </div>
              </section>

              {/* Users (admin) */}
              {isAdmin && (
                <section id="members" className="scroll-mt-24 space-y-3">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`p-2 rounded-lg ${steps[1].done ? 'bg-[#4C7F6E]' : 'bg-slate-200 dark:bg-white/10'}`}>
                      <Users className={`w-5 h-5 ${steps[1].done ? 'text-white' : 'text-gray-400'}`} />
                    </div>
                    <div>
                      <h4 className={`text-lg font-bold ${headingColor}`}>Участники</h4>
                      <p className="text-sm text-gray-500">Выберите участников</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm font-medium ${headingColor}`}>Выберите участников для удаления</p>
                      <button
                        onClick={() =>
                          setSelectedUserIds((prev) =>
                            prev.length === TEAM_MEMBERS.length ? [] : TEAM_MEMBERS.map((m) => m.id)
                          )
                        }
                        className="text-xs font-semibold text-[#4C7F6E] hover:text-[#5a9a87] transition-colors"
                      >
                        {selectedUserIds.length === TEAM_MEMBERS.length ? 'Снять выделение' : 'Выбрать всех'}
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {TEAM_MEMBERS.map((member) => {
                        const isSelected = selectedUserIds.includes(member.id)
                        return (
                          <button
                            key={member.id}
                            onClick={() => handleUserToggle(member.id)}
                            className={`px-4 py-2 rounded-lg transition-all hover:scale-105 active:scale-95 text-sm font-medium ${
                              isSelected
                                ? 'bg-[#4C7F6E] text-white shadow-lg shadow-[#4C7F6E]/20'
                                : theme === 'dark'
                                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            {getUserNicknameSync(member.id)}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </section>
              )}

              {/* Delete modes */}
              <section id="dates" className="scroll-mt-24 space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`p-2 rounded-lg ${steps[2].done ? 'bg-[#4C7F6E]' : 'bg-slate-200 dark:bg-white/10'}`}>
                    <Calendar className={`w-5 h-5 ${steps[2].done ? 'text-white' : 'text-gray-400'}`} />
                  </div>
                  <div>
                    <h4 className={`text-lg font-bold ${headingColor}`}>Режим удаления</h4>
                    <p className="text-sm text-gray-500">Выберите способ (только один)</p>
                  </div>
                </div>

                {/* By weekday */}
                <label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl border transition-all hover:bg-white/5 dark:hover:bg-white/5">
                  <input
                    type="checkbox"
                    checked={deleteByWeekDay}
                    onChange={(e) => toggleMode(setDeleteByWeekDay, e.target.checked, [deleteByDates, deleteByDateRange])}
                    className={`w-5 h-5 rounded border-2 transition-colors ${theme === 'dark'
                      ? 'border-gray-700 bg-gray-800 checked:bg-[#4C7F6E] checked:border-[#4C7F6E]'
                      : 'border-gray-300 bg-white checked:bg-[#4C7F6E] checked:border-[#4C7F6E]'
                      } focus:ring-2 focus:ring-[#4C7F6E] cursor-pointer`}
                  />
                  <div className="flex-1">
                    <p className={`text-sm font-semibold ${headingColor}`}>Удалить по дню недели</p>
                    <p className="text-xs text-gray-500">Все записи за выбранные дни недели</p>
                  </div>
                </label>
                {deleteByWeekDay && (
                  <div className="ml-8 space-y-3 p-4 rounded-xl border border-[#4C7F6E]/20 bg-[#4C7F6E]/5">
                    <p className={`text-sm font-medium mb-3 ${headingColor}`}>Выберите дни недели:</p>
                    <div className="flex gap-2 flex-wrap">
                      {weekDays.map((day, idx) => {
                        const active = selectedWeekDays.includes(idx)
                        return (
                          <button
                            key={day}
                            onClick={() =>
                              setSelectedWeekDays((prev) => (active ? prev.filter((d) => d !== idx) : [...prev, idx]))
                            }
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 active:scale-95 ${
                              active
                                ? 'bg-[#4C7F6E] text-white shadow-lg shadow-[#4C7F6E]/20'
                                : theme === 'dark'
                                ? 'bg-gray-800 text-gray-300'
                                : 'bg-gray-200 text-gray-700'
                            }`}
                          >
                            {day}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* By dates */}
                <label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl border transition-all hover:bg-white/5 dark:hover:bg-white/5">
                  <input
                    type="checkbox"
                    checked={deleteByDates}
                    onChange={(e) => toggleMode(setDeleteByDates, e.target.checked, [deleteByWeekDay, deleteByDateRange])}
                    className={`w-5 h-5 rounded border-2 transition-colors ${theme === 'dark'
                      ? 'border-gray-700 bg-gray-800 checked:bg-[#4C7F6E] checked:border-[#4C7F6E]'
                      : 'border-gray-300 bg-white checked:bg-[#4C7F6E] checked:border-[#4C7F6E]'
                      } focus:ring-2 focus:ring-[#4C7F6E] cursor-pointer`}
                  />
                  <div className="flex-1">
                    <p className={`text-sm font-semibold ${headingColor}`}>Удалить по конкретным датам</p>
                    <p className="text-xs text-gray-500">Выберите конкретные даты для удаления</p>
                  </div>
                </label>
                {deleteByDates && (
                  <div className="ml-8 space-y-3 p-4 rounded-xl border border-[#4C7F6E]/20 bg-[#4C7F6E]/5">
                    <div className="flex gap-2">
                      <input
                        type="date"
                        value={currentDate}
                        onChange={(e) => setCurrentDate(e.target.value)}
                        className={`flex-1 px-4 py-2.5 rounded-lg border touch-manipulation transition-all focus:ring-2 focus:ring-[#4C7F6E] ${
                          theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                      <button
                        onClick={addDate}
                        className="px-6 py-2.5 bg-[#4C7F6E] hover:bg-[#5a9a87] text-white rounded-lg font-semibold transition-all hover:scale-105 active:scale-95"
                      >
                        Добавить
                      </button>
                    </div>
                    {selectedDates.length > 0 && (
                      <div className="space-y-2">
                        <p className={`text-sm font-medium ${headingColor}`}>
                          Выбранные даты ({selectedDates.length}):
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {selectedDates.map((d) => (
                            <div
                              key={d}
                              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}
                            >
                              <span className={`text-sm font-medium ${headingColor}`}>{formatDate(d, 'dd.MM.yyyy')}</span>
                              <button
                                onClick={() => removeDate(d)}
                                className="p-1 text-[#4C7F6E] hover:bg-[#4C7F6E] hover:text-white rounded-full transition-all"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* By range */}
                <label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl border transition-all hover:bg-white/5 dark:hover:bg-white/5">
                  <input
                    type="checkbox"
                    checked={deleteByDateRange}
                    onChange={(e) => toggleMode(setDeleteByDateRange, e.target.checked, [deleteByWeekDay, deleteByDates])}
                    className={`w-5 h-5 rounded border-2 transition-colors ${theme === 'dark'
                      ? 'border-gray-700 bg-gray-800 checked:bg-[#4C7F6E] checked:border-[#4C7F6E]'
                      : 'border-gray-300 bg-white checked:bg-[#4C7F6E] checked:border-[#4C7F6E]'
                      } focus:ring-2 focus:ring-[#4C7F6E] cursor-pointer`}
                  />
                  <div className="flex-1">
                    <p className={`text-sm font-semibold ${headingColor}`}>Удалить по диапазону дат</p>
                    <p className="text-xs text-gray-500">Все записи в указанном периоде</p>
                  </div>
                </label>
                {deleteByDateRange && (
                  <div className="ml-8 space-y-3 p-4 rounded-xl border border-[#4C7F6E]/20 bg-[#4C7F6E]/5">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={`block text-xs font-medium mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          Начальная дата
                        </label>
                        <input
                          type="date"
                          value={dateRangeStart}
                          onChange={(e) => setDateRangeStart(e.target.value)}
                          className={`w-full px-4 py-2.5 rounded-lg border touch-manipulation transition-all focus:ring-2 focus:ring-[#4C7F6E] ${
                            theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                          }`}
                        />
                      </div>
                      <div>
                        <label className={`block text-xs font-medium mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          Конечная дата
                        </label>
                        <input
                          type="date"
                          value={dateRangeEnd}
                          onChange={(e) => setDateRangeEnd(e.target.value)}
                          min={dateRangeStart}
                          className={`w-full px-4 py-2.5 rounded-lg border touch-manipulation transition-all focus:ring-2 focus:ring-[#4C7F6E] ${
                            theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                          }`}
                        />
                      </div>
                    </div>
                    {dateRangeStart && dateRangeEnd && (
                      <div className={`mt-3 p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                        <p className={`text-sm ${headingColor}`}>
                          Будет удалено: с <span className="font-semibold">{formatDate(dateRangeStart, 'dd.MM.yyyy')}</span> по{' '}
                          <span className="font-semibold">{formatDate(dateRangeEnd, 'dd.MM.yyyy')}</span>
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </section>

              {/* Error message */}
              {error && (
                <div className="p-4 bg-[#4C7F6E]/10 border border-[#4C7F6E]/30 rounded-xl text-[#4C7F6E] dark:text-[#5a9a87] text-sm font-medium flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  {error}
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleDelete}
                  disabled={loading || (!deleteByWeekDay && !deleteByDates && !deleteByDateRange)}
                  className="flex-1 px-6 py-3 bg-[#4C7F6E] hover:bg-[#3d6659] disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-[#4C7F6E]/20"
                >
                  <Trash2 className="w-4 h-4" />
                  {loading ? (isAdmin ? 'Удаление...' : 'Отправка на согласование...') : (isAdmin ? 'Очистить расписание' : 'Отправить на согласование')}
                </button>
                <button
                  onClick={onClose}
                  className={`px-6 py-3 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 ${theme === 'dark' ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
