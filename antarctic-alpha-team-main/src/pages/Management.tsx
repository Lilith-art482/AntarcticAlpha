import { useState, useEffect } from 'react'
import { useThemeStore } from '@/store/themeStore'
// import { useAdminStore } from '@/store/adminStore' // Удален неиспользуемый импорт
import { useScheduleDateStore } from '@/store/scheduleDateStore'
import { ManagementTable } from '@/components/Management/ManagementTable'
import { MemberSelector } from '@/components/Management/MemberSelector'
import { SlotForm } from '@/components/Management/SlotForm'
import { DayStatusForm } from '@/components/Management/DayStatusForm'
import {
 Calendar,
 CalendarCheck,
 PlusCircle,
 Trash2,
 UserX,
 TrendingUp,
 TrendingDown,
 Clock,
 CalendarDays,
 CheckCircle2,
 Sunrise,
 Sun,
 Sunset,
 Moon,
 ChevronLeft,
 ChevronRight,
 RotateCcw,
} from 'lucide-react'
import { DeleteSlotsForm } from '@/components/Management/DeleteSlotsForm'
import { useAccessControl } from '@/hooks/useAccessControl'
import { Lock } from 'lucide-react'
import { getWorkSlots } from '@/services/firestoreService'
import { WorkSlot, TimeSlot } from '@/types'
import { format, startOfWeek, endOfWeek, addDays, isWithinInterval, parseISO } from 'date-fns'
import { ru } from 'date-fns/locale'
import { formatDate } from '@/utils/dateUtils'

export type SlotFilter = 'all' | 'upcoming' | 'completed'

export const Management = () => {
  const { theme } = useThemeStore()
  const { selectedWeekStart: persistedWeekStart, setSelectedDate, setSelectedWeekStart } = useScheduleDateStore()

  const gridPattern = theme === 'dark'
    ? 'bg-[linear-gradient(rgba(78,110,73,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(78,110,73,0.08)_1px,transparent_1px)]'
    : 'bg-[linear-gradient(rgba(78,110,73,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(78,110,73,0.06)_1px,transparent_1px)]'
  const [selectedWeekStart, setSelectedWeekStartState] = useState<string | null>(null)
  const [selectedWeek, setSelectedWeek] = useState(() => persistedWeekStart ? new Date(persistedWeekStart) : new Date())
  const [slotFilter] = useState<SlotFilter>('all')

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedWeek)
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 7)
    } else {
      newDate.setDate(newDate.getDate() + 7)
    }
    setSelectedWeek(newDate)
    setSelectedWeekStartState(formatDate(newDate, 'yyyy-MM-dd'))
  }

  const goToCurrentWeek = () => {
    const today = new Date()
    const weekStart = startOfWeek(today, { weekStartsOn: 1 })
    setSelectedWeek(weekStart)
    setSelectedWeekStartState(formatDate(weekStart, 'yyyy-MM-dd'))
  }

  const [showSlotForm, setShowSlotForm] = useState(false)
  const [showDeleteSlotsForm, setShowDeleteSlotsForm] = useState(false)
  const [showStatusForm, setShowStatusForm] = useState(false)
  const [statusType, setStatusType] = useState<'dayoff' | 'sick' | 'vacation' | 'absence' | 'internship' | null>(null)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [editingSlot, setEditingSlot] = useState<any>(null)
  const [editingStatus, setEditingStatus] = useState<any>(null)
  const [refreshKey, setRefreshKey] = useState(0)

 // Access Control Hooks
 const pageAccess = useAccessControl('arca_schedule')
 const addSlotAccess = useAccessControl('schedule_add_slot')
 const statusEditAccess = useAccessControl('schedule_status_edit')
 const slotDeleteAccess = useAccessControl('schedule_slot_delete')

 // Состояние для аналитики
 const [allSlots, setAllSlots] = useState<WorkSlot[]>([])
 const [analyticsLoading, setAnalyticsLoading] = useState(true)

 // Загрузка всех слотов для аналитики
 useEffect(() => {
 const fetchSlotsForAnalytics = async () => {
 try {
 const slots = await getWorkSlots()
 setAllSlots(slots)
 } catch (error) {
 console.error('Error fetching slots for analytics:', error)
 } finally {
 setAnalyticsLoading(false)
 }
 }
 fetchSlotsForAnalytics()
 }, [refreshKey])

 // Функция для определения времени суток
 const getTimeOfDay = (timeStr: string): 'morning' | 'afternoon' | 'evening' | 'night' => {
 const hour = parseInt(timeStr.split(':')[0],10)
 if (hour >=6 && hour< 12) return 'morning'
 if (hour >=12 && hour< 18) return 'afternoon'
 if (hour >=18 && hour< 24) return 'evening'
 return 'night'
 }

 // Функция для расчёта аналитики
 const calculateAnalytics = () => {
 if (allSlots.length ===0) {
 return {
 totalSlots:0,
 previousWeekSlots:0,
 dynamicPercent:0,
 busiestDay: '—',
 busiestTime: '—',
 completedSlots:0,
 morningEfficiency:0,
 afternoonEfficiency:0,
 eveningEfficiency:0,
 nightEfficiency:0,
 }
 }

 const now = new Date()
 const currentWeekStart = startOfWeek(now, { weekStartsOn:1 }) // Понедельник
 const currentWeekEnd = endOfWeek(now, { weekStartsOn:1 })
 const previousWeekStart = addDays(currentWeekStart, -7)
 const previousWeekEnd = addDays(currentWeekStart, -1)

 // Слоты текущей недели
 const currentWeekSlots = allSlots.filter((slot: WorkSlot) => {
 const slotDate = parseISO(slot.date)
 return isWithinInterval(slotDate, { start: currentWeekStart, end: currentWeekEnd })
 })

 // Слоты прошлой недели
 const previousWeekSlots = allSlots.filter((slot: WorkSlot) => {
 const slotDate = parseISO(slot.date)
 return isWithinInterval(slotDate, { start: previousWeekStart, end: previousWeekEnd })
 })

 // Динамика
 const dynamicPercent = previousWeekSlots.length >0
 ? Math.round(((currentWeekSlots.length - previousWeekSlots.length) / previousWeekSlots.length) *100)
 : currentWeekSlots.length >0 ?100 :0

 // Подсчёт слотов по дням недели
 const dayCounts: Record<string, number> = {}
 currentWeekSlots.forEach((slot: WorkSlot) => {
 const dayName = format(parseISO(slot.date), 'EEEE', { locale: ru })
 dayCounts[dayName] = (dayCounts[dayName] ||0) +1
 })

 // Самый загруженный день
 const busiestDay = Object.entries(dayCounts).length >0
 ? Object.entries(dayCounts).sort((a, b) => b[1] - a[1])[0][0]
 : '—'

 // Подсчёт слотов по времени суток
 const timeOfDayCounts: Record<string, number> = { morning:0, afternoon:0, evening:0, night:0 }
 currentWeekSlots.forEach((slot: WorkSlot) => {
 slot.slots.forEach((ts: TimeSlot) => {
 const tod = getTimeOfDay(ts.start)
 timeOfDayCounts[tod] = (timeOfDayCounts[tod] ||0) +1
 })
 })

 // Самое пиковое время
 const timeLabels: Record<string, string> = {
 morning: 'Утро (6:00-12:00)',
 afternoon: 'День (12:00-18:00)',
 evening: 'Вечер (18:00-24:00)',
 night: 'Ночь (0:00-6:00)'
 }
 const busiestTime = Object.entries(timeOfDayCounts).length >0 && Object.values(timeOfDayCounts).some(v => v >0)
 ? timeLabels[Object.entries(timeOfDayCounts).sort((a, b) => b[1] - a[1])[0][0]]
 : '—'

 // Завершённые слоты (прошедшие даты)
 const today = format(now, 'yyyy-MM-dd')
 const completedSlots = allSlots.filter((slot: WorkSlot) => slot.date< today).length

 // Эффективность по времени суток (процент от общего числа завершённых слотов)
 const completedSlotTimes: Record<string, number> = { morning:0, afternoon:0, evening:0, night:0 }
 allSlots.filter((slot: WorkSlot) => slot.date< today).forEach((slot: WorkSlot) => {
 slot.slots.forEach((ts: TimeSlot) => {
 const tod = getTimeOfDay(ts.start)
 completedSlotTimes[tod] = (completedSlotTimes[tod] ||0) +1
 })
 })

 const totalCompleted = Object.values(completedSlotTimes).reduce((a, b) => a + b,0)
 const morningEfficiency = totalCompleted >0 ? Math.round((completedSlotTimes.morning / totalCompleted) *100) :0
 const afternoonEfficiency = totalCompleted >0 ? Math.round((completedSlotTimes.afternoon / totalCompleted) *100) :0
 const eveningEfficiency = totalCompleted >0 ? Math.round((completedSlotTimes.evening / totalCompleted) *100) :0
 const nightEfficiency = totalCompleted >0 ? Math.round((completedSlotTimes.night / totalCompleted) *100) :0

 return {
 totalSlots: currentWeekSlots.length,
 previousWeekSlots: previousWeekSlots.length,
 dynamicPercent,
 busiestDay,
 busiestTime,
 completedSlots,
 morningEfficiency,
 afternoonEfficiency,
 eveningEfficiency,
 nightEfficiency,
 }
 }

 const analytics = calculateAnalytics()

  // Sync local state with persisted store
  useEffect(() => {
    setSelectedWeekStartState(persistedWeekStart)
  }, [persistedWeekStart])

  const handleAddSlot = () => {
    setEditingSlot(null)
    setShowSlotForm(true)
  }

  const handleEditSlot = (slot: any) => {
    setEditingSlot(slot)
    setShowSlotForm(true)
  }

  const handleAddAbsence = () => {
    setStatusType(null)
    setEditingStatus(null)
    setShowStatusForm(true)
  }

  const handleEditStatus = (status: any) => {
    setEditingStatus(status)
    setStatusType(status.type)
    setShowStatusForm(true)
  }

  const handleDeleteSlots = () => {
    setShowDeleteSlotsForm(true)
  }

  const handleFormClose = () => {
    setShowSlotForm(false)
    setShowDeleteSlotsForm(false)
    setShowStatusForm(false)
    setStatusType(null)
    setEditingSlot(null)
    setEditingStatus(null)
    setRefreshKey((key) => key + 1)
  }

  // Callback when date changes in child components
  const handleDateChange = (date: string | null, weekStart: string | null) => {
    setSelectedWeekStartState(weekStart)
    setSelectedDate(date)
    setSelectedWeekStart(weekStart)
  }

  

  if (pageAccess.loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    )
  }

  if (!pageAccess.hasAccess) {
    return (
      <div className="py-20 text-center space-y-4">
        <Lock className="w-16 h-16 text-gray-700 mx-auto opacity-20" />
        <h3 className={`text-xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Доступ к Schedule ограничен</h3>
        <p className="text-gray-500 max-w-md mx-auto">{pageAccess.reason || 'У вас нет доступа к управлению расписанием.'}</p>
      </div>
    )
  }

return (
<div className="flex min-h-screen">
 {/* Grid Pattern Background */}
<div className={`fixed inset-0 pointer-events-none ${gridPattern} [background-size:40px_40px] z-0`} />

 {/* Content */}
<div className="w-full relative z-10 space-y-6 p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#4C7F6E]/10 rounded-2xl border border-[#4C7F6E]/20">
              <CalendarCheck className="w-8 h-8 text-[#4C7F6E]" />
            </div>
            <div>
              <h1 className={`text-2xl md:text-3xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Lead
              </h1>
              <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Управление сменами и активностью ARCA - Team
              </p>
            </div>
          </div>
</div>

 {/* Analytics Cards - Above Controls Toolbar */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
 {/* Total Scheduled Slots */}
<div className={`relative overflow-hidden rounded-2xl p-5 border transition-all duration-300 hover:shadow-lg group ${theme === 'dark'
 ? 'bg-[#4C7F6E]/5 border-[#4C7F6E]/20 hover:border-[#4C7F6E]/40'
 : 'bg-white border-gray-100 hover:border-[#4C7F6E]/20'
 }`}>
<div className="flex justify-between items-start mb-4">
<span className={`text-[10px] font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
 Всего слотов
</span>
<div className={`p-2 rounded-xl transition-colors ${theme === 'dark' ? 'bg-white/5 group-hover:bg-white/10' : 'bg-gray-100 group-hover:bg-gray-200'}`}>
<CalendarDays className="w-4 h-4 text-[#4C7F6E]" />
</div>
</div>
<div className={`text-3xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
 {analyticsLoading ? '...' : analytics.totalSlots}
</div>
 {!analyticsLoading && analytics.dynamicPercent !==0 && (
<div className={`flex items-center gap-1 mt-2 text-xs font-bold ${analytics.dynamicPercent >=0 ? 'text-[#4C7F6E]' : 'text-rose-500'}`}>
 {analytics.dynamicPercent >=0 ?<TrendingUp className="w-3 h-3" /> :<TrendingDown className="w-3 h-3" />}
 {analytics.dynamicPercent >=0 ? '+' : ''}{analytics.dynamicPercent}% к прошлой неделе
</div>
 )}
</div>

 {/* Busiest Day */}
<div className={`relative overflow-hidden rounded-2xl p-5 border transition-all duration-300 hover:shadow-lg group ${theme === 'dark'
 ? 'bg-blue-500/5 border-blue-500/20 hover:border-blue-500/40'
 : 'bg-white border-gray-100 hover:border-blue-500/20'
 }`}>
<div className="flex justify-between items-start mb-4">
<span className={`text-[10px] font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
 Самый загруженный день
</span>
<div className={`p-2 rounded-xl transition-colors ${theme === 'dark' ? 'bg-white/5 group-hover:bg-white/10' : 'bg-gray-100 group-hover:bg-gray-200'}`}>
<Calendar className="w-4 h-4 text-blue-500" />
</div>
</div>
<div className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
 {analyticsLoading ? '...' : analytics.busiestDay}
</div>
</div>

 {/* Peak Time */}
<div className={`relative overflow-hidden rounded-2xl p-5 border transition-all duration-300 hover:shadow-lg group ${theme === 'dark'
 ? 'bg-purple-500/5 border-purple-500/20 hover:border-purple-500/40'
 : 'bg-white border-gray-100 hover:border-purple-500/20'
 }`}>
<div className="flex justify-between items-start mb-4">
<span className={`text-[10px] font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
 Пиковое время
</span>
<div className={`p-2 rounded-xl transition-colors ${theme === 'dark' ? 'bg-white/5 group-hover:bg-white/10' : 'bg-gray-100 group-hover:bg-gray-200'}`}>
<Clock className="w-4 h-4 text-purple-500" />
</div>
</div>
<div className={`text-lg font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
 {analyticsLoading ? '...' : analytics.busiestTime}
</div>
</div>

 {/* Completed Slots */}
<div className={`relative overflow-hidden rounded-2xl p-5 border transition-all duration-300 hover:shadow-lg group ${theme === 'dark'
 ? 'bg-amber-500/5 border-amber-500/20 hover:border-amber-500/40'
 : 'bg-white border-gray-100 hover:border-amber-500/20'
 }`}>
<div className="flex justify-between items-start mb-4">
<span className={`text-[10px] font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
 Завершено слотов
</span>
<div className={`p-2 rounded-xl transition-colors ${theme === 'dark' ? 'bg-white/5 group-hover:bg-white/10' : 'bg-gray-100 group-hover:bg-gray-200'}`}>
<CheckCircle2 className="w-4 h-4 text-amber-500" />
</div>
</div>
<div className={`text-3xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
 {analyticsLoading ? '...' : analytics.completedSlots}
</div>
</div>
</div>

 {/* Controls Toolbar - Below Analytics Cards */}
<div className="z-40">
<div className={`p-2 rounded-2xl border shadow-xl ${theme === 'dark'
 ? 'bg-[#0b1015] border-white/10'
 : 'bg-white border-gray-200'
 }`}>
<div className="flex flex-col lg:flex-row items-center justify-between gap-4 p-2">
 {/* View Toggle - REMOVED, only table view remains */}

 {/* Center: Week Navigation */}
<div className="flex items-center gap-1">
  <button
    onClick={() => navigateWeek('prev')}
    className={`p-2 rounded-xl border transition-all ${theme === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
  >
    <ChevronLeft className="w-4 h-4" style={{ color: '#4C7F6E' }} />
  </button>

  <button
    onClick={goToCurrentWeek}
    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${theme === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
    title="Вернуться к текущей неделе"
  >
    <RotateCcw className="w-3.5 h-3.5" style={{ color: '#4C7F6E' }} />
    <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Актуальная</span>
  </button>

  <button
    onClick={() => navigateWeek('next')}
    className={`p-2 rounded-xl border transition-all ${theme === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
  >
    <ChevronRight className="w-4 h-4" style={{ color: '#4C7F6E' }} />
  </button>
</div>

 {/* Actions */}
<div className="flex items-center gap-2">
 {addSlotAccess.hasAccess && (
<button
 onClick={handleAddSlot}
 className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-bold text-sm transition-all hover:scale-105 active:scale-95"
 style={{ backgroundColor: '#4C7F6E' }}
 onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3d6a5e'}
 onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4C7F6E'}
 >
<PlusCircle className="w-4 h-4" />
<span>Добавить слот</span>
</button>
 )}
 {statusEditAccess.hasAccess && (
<button
 onClick={handleAddAbsence}
 className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-bold text-sm transition-all hover:scale-105 active:scale-95 ${theme === 'dark'
 ? 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
 : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
 }`}
 >
<UserX className="w-4 h-4" />
<span className="hidden sm:inline">Отсутствие</span>
</button>
 )}
 {slotDeleteAccess.hasAccess && (
<button
 onClick={handleDeleteSlots}
 className="p-2.5 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition-all"
 title="Очистить"
 >
<Trash2 className="w-5 h-5" />
</button>
 )}
</div>

<div className="flex items-center gap-2 w-full lg:w-72">
<MemberSelector
 selectedUserId={selectedUserId}
 onSelect={setSelectedUserId}
 />
</div>
</div>
</div>
</div>

 {/* Main Content */}
<div className={`rounded-2xl border ${theme === 'dark'
 ? 'bg-[#0b1015] border-white/5'
 : 'bg-white border-gray-200'
 }`}>
 <div className="p-0">
 <ManagementTable
   selectedUserId={selectedUserId}
   slotFilter={slotFilter}
   refreshKey={refreshKey}
   initialWeekStart={selectedWeekStart}
   onDateChange={handleDateChange}
   onEditSlot={handleEditSlot}
   onEditStatus={handleEditStatus}
 />
</div>
</div>

 {/* Efficiency Table - Below Schedule */}
<div className={`rounded-2xl border mt-6 ${theme === 'dark'
 ? 'bg-[#0b1015] border-white/5'
 : 'bg-white border-gray-200'
 }`}>
<div className="p-4 sm:p-6">
<h3 className={`text-lg font-black mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
 Эффективность по времени суток
</h3>
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
 {/* Morning */}
<div className={`p-4 rounded-xl border ${theme === 'dark'
 ? 'bg-orange-500/5 border-orange-500/20'
 : 'bg-orange-50 border-orange-200'
 }`}>
<div className="flex items-center gap-2 mb-2">
<Sunrise className={`w-5 h-5 ${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`} />
<span className={`text-sm font-bold ${theme === 'dark' ? 'text-orange-400' : 'text-orange-700'}`}>
 Утро
</span>
</div>
<span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>6:00 -12:00</span>
<div className={`text-2xl font-black mt-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
 {analyticsLoading ? '...' : `${analytics.morningEfficiency}%`}
</div>
</div>

 {/* Afternoon */}
<div className={`p-4 rounded-xl border ${theme === 'dark'
 ? 'bg-yellow-500/5 border-yellow-500/20'
 : 'bg-yellow-50 border-yellow-200'
 }`}>
<div className="flex items-center gap-2 mb-2">
<Sun className={`w-5 h-5 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`} />
<span className={`text-sm font-bold ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-700'}`}>
 День
</span>
</div>
<span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>12:00 -18:00</span>
<div className={`text-2xl font-black mt-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
 {analyticsLoading ? '...' : `${analytics.afternoonEfficiency}%`}
</div>
</div>

 {/* Evening */}
<div className={`p-4 rounded-xl border ${theme === 'dark'
 ? 'bg-purple-500/5 border-purple-500/20'
 : 'bg-purple-50 border-purple-200'
 }`}>
<div className="flex items-center gap-2 mb-2">
<Sunset className={`w-5 h-5 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
<span className={`text-sm font-bold ${theme === 'dark' ? 'text-purple-400' : 'text-purple-700'}`}>
 Вечер
</span>
</div>
<span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>18:00 -24:00</span>
<div className={`text-2xl font-black mt-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
 {analyticsLoading ? '...' : `${analytics.eveningEfficiency}%`}
</div>
</div>

 {/* Night */}
<div className={`p-4 rounded-xl border ${theme === 'dark'
 ? 'bg-indigo-500/5 border-indigo-500/20'
 : 'bg-indigo-50 border-indigo-200'
 }`}>
<div className="flex items-center gap-2 mb-2">
<Moon className={`w-5 h-5 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
<span className={`text-sm font-bold ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-700'}`}>
 Ночь
</span>
</div>
<span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>0:00 -6:00</span>
<div className={`text-2xl font-black mt-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
 {analyticsLoading ? '...' : `${analytics.nightEfficiency}%`}
</div>
</div>
</div>
</div>
</div>

 {/* Forms */}
 {
 showSlotForm && (
<SlotForm
 slot={editingSlot}
 onClose={handleFormClose}
 onSave={handleFormClose}
 />
 )
 }

 {
 showDeleteSlotsForm && (
<DeleteSlotsForm
 onClose={handleFormClose}
 onSave={handleFormClose}
 />
 )
 }

 {showStatusForm && (
<DayStatusForm
 type={statusType || undefined}
 status={editingStatus}
 onClose={handleFormClose}
 onSave={handleFormClose}
 />
 )}
</div>
</div>
 );
};
