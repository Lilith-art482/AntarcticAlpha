import { useState, useEffect, useRef } from 'react'
import { Task, TaskStatus, TaskPriority, TaskCategory, TaskReport } from '@/types'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { useAdminStore } from '@/store/adminStore'
import { X, Edit, Trash2, Share, Calendar, Clock, Target, User, Link2, ExternalLink, CheckCircle2, Circle, XCircle, RefreshCw, Users, FileText, AlertCircle, Send, RotateCcw, Check, Plus, Trash, Image, Upload } from 'lucide-react'
import { formatDate } from '@/utils/dateUtils'
import { CountdownTimer } from '@/components/Analytics/AnalyticsTable'
import Avatar from '@/components/Avatar'
import { UserNickname } from '@/components/UserNickname'
import { TASK_CATEGORIES } from '@/types'
import { updateTask } from '@/services/firestoreService'

interface TaskDetailsProps {
  task: Task
  onClose: () => void
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
  onMove: (taskId: string, newStatus: TaskStatus, skipUpdate?: boolean) => void
  onCopyLink: (taskId: string) => void
  openCompleteModal?: boolean // открыть модальное окно завершения при загрузке
}

interface ReportLinkInput {
  id: string
  url: string
  name: string
}

export const TaskDetails = ({ task, onClose, onEdit, onDelete, onMove, onCopyLink, openCompleteModal }: TaskDetailsProps) => {
  const { theme } = useThemeStore()
  const { user } = useAuthStore()
  const { isAdmin: isAdminStore } = useAdminStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [localTask, setLocalTask] = useState<Task>(task)
  const [reportText, setReportText] = useState('')
  const [reportLinks, setReportLinks] = useState<ReportLinkInput[]>([{ id: crypto.randomUUID(), url: '', name: '' }])
  const [reportScreenshots, setReportScreenshots] = useState<string[]>([])
  const [reworkComment, setReworkComment] = useState('')
  const [showReportForm, setShowReportForm] = useState(false)
  const [showReworkForm, setShowReworkForm] = useState(false)
  const [showCompleteModal, setShowCompleteModal] = useState(false)

  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const subTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
  const buttonTextColor = theme === 'dark' ? 'text-white' : 'text-gray-900'

  const isTaskAuthor = localTask.createdBy === user?.id
  const isAdmin = isAdminStore || user?.role === 'admin'
  const isExecutor = localTask.assignedTo?.includes(user?.id || '')
  const isCoExecutor = localTask.coExecutors?.includes(user?.id || '')
  const canEdit = isTaskAuthor || isAdmin
  const canDelete = isAdmin // Удалить может только админ
  const canResumeFromCompleted = isTaskAuthor || isAdmin
  const canApprove = isTaskAuthor || isAdmin
  const canSubmitReport = isExecutor || isCoExecutor || isTaskAuthor || isAdmin
  const canCompleteTask = isExecutor || isCoExecutor || isAdmin // Исполнитель или соисполнитель может завершить
  const isMaxExtensionsReached = (localTask.deadlineExtensions || 0) >= 10

  // Модальные окна для доработки
  const [showReworkLinksModal, setShowReworkLinksModal] = useState(false)
  const [showReworkScreenshotsModal, setShowReworkScreenshotsModal] = useState(false)
  const [showReworkDeadlineModal, setShowReworkDeadlineModal] = useState(false)
  const [reworkLinks, setReworkLinks] = useState<ReportLinkInput[]>([{ id: crypto.randomUUID(), url: '', name: '' }])
  const [reworkScreenshots, setReworkScreenshots] = useState<string[]>([])
  const [newDeadline, setNewDeadline] = useState('')
  const [newDeadlineTime, setNewDeadlineTime] = useState('')
  
  // Модальное окно просмотра отчета
  const [showReportModal, setShowReportModal] = useState(false)

  useEffect(() => { setLocalTask(task) }, [task])
  useEffect(() => { if (openCompleteModal) setShowCompleteModal(true) }, [openCompleteModal])

  const getPriorityColor = (priority?: TaskPriority) => {
    switch (priority) {
      case 'low': return theme === 'dark' ? 'bg-gray-500/20 text-gray-400 border-gray-500/20' : 'bg-gray-100 text-gray-600 border-gray-200'
      case 'medium': return theme === 'dark' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20' : 'bg-yellow-100 text-yellow-600 border-yellow-200'
      case 'high': return theme === 'dark' ? 'bg-orange-500/20 text-orange-400 border-orange-500/20' : 'bg-orange-100 text-orange-600 border-orange-200'
      case 'urgent': return theme === 'dark' ? 'bg-red-500/20 text-red-400 border-red-500/20' : 'bg-red-100 text-red-600 border-red-200'
      default: return theme === 'dark' ? 'bg-gray-500/20 text-gray-400 border-gray-500/20' : 'bg-gray-100 text-gray-600 border-gray-200'
    }
  }

  const getPriorityLabel = (priority?: TaskPriority) => {
    switch (priority) { case 'low': return 'Низкий'; case 'medium': return 'Средний'; case 'high': return 'Высокий'; case 'urgent': return 'Срочный'; default: return 'Средний' }
  }

  const getCategoryLabel = (category: TaskCategory) => TASK_CATEGORIES[category]?.label || category

  const getStatusInfo = (status: TaskStatus) => {
    switch (status) {
      case 'in_progress': return { label: 'В работе', icon: <Circle size={16} className="fill-blue-500 text-blue-500" />, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' }
      case 'in_progress_rework': return { label: 'В работе (ПВ)', icon: <Circle size={16} className="fill-orange-500 text-orange-500" />, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' }
      case 'completed': return { label: 'Выполнено', icon: <CheckCircle2 size={16} className="text-violet-500" />, color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' }
      case 'approval': return { label: 'Согласование', icon: <FileText size={16} className="text-[#4C7F6E]" />, color: 'text-[#4C7F6E]', bg: 'bg-[#4C7F6E]/10', border: 'border-[#4C7F6E]/20' }
      case 'closed': return { label: 'Закрыто', icon: <XCircle size={16} className="text-gray-500" />, color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/20' }
      default: return { label: 'В работе', icon: <Circle size={16} className="fill-blue-500 text-blue-500" />, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' }
    }
  }

  const statusInfo = getStatusInfo(localTask.status)

  const statusOptions = [
    { status: 'in_progress' as TaskStatus, label: 'В работе', icon: <Circle size={14} className="fill-blue-500 text-blue-500" /> },
    { status: 'in_progress_rework' as TaskStatus, label: 'В работе (ПВ)', icon: <Circle size={14} className="fill-orange-500 text-orange-500" /> },
    { status: 'completed' as TaskStatus, label: 'Выполнено', icon: <CheckCircle2 size={14} className="text-violet-500" /> },
    { status: 'approval' as TaskStatus, label: 'На согласование', icon: <FileText size={14} className="text-[#4C7F6E]" /> },
    { status: 'closed' as TaskStatus, label: 'Закрыто', icon: <XCircle size={14} className="text-gray-500" /> }
  ]

  const getAvailableStatusOptions = () => {
    const options = [...statusOptions]
    const status = localTask.status as TaskStatus
    if (status === 'closed') return options.filter(o => o.status !== 'closed')
    if (status === 'completed') return options.filter(o => o.status !== 'completed' || canResumeFromCompleted)
    if (status === 'approval') return options.filter(o => o.status === 'in_progress_rework' || o.status === 'completed')
    return options
  }
  const availableStatusOptions = getAvailableStatusOptions()

  const handleAddReportLink = () => { if (reportLinks.length < 10) setReportLinks([...reportLinks, { id: crypto.randomUUID(), url: '', name: '' }]) }
  const handleRemoveReportLink = (index: number) => setReportLinks(reportLinks.filter((_, i) => i !== index))
  const handleReportLinkChange = (index: number, field: keyof ReportLinkInput, value: string) => {
    const newLinks = [...reportLinks]
    newLinks[index] = { ...newLinks[index], [field]: value }
    setReportLinks(newLinks)
  }

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    const filesToAdd = Array.from(files).slice(0, 10 - reportScreenshots.length)
    filesToAdd.forEach(file => {
      const reader = new FileReader()
      reader.onload = (event) => { if (event.target?.result) setReportScreenshots(prev => [...prev, event.target!.result as string]) }
      reader.readAsDataURL(file)
    })
    if (fileInputRef.current) fileInputRef.current.value = ''
  }
  const handleRemoveScreenshot = (index: number) => setReportScreenshots(prev => prev.filter((_, i) => i !== index))

  // Обработчики для доработки
  const handleAddReworkLink = () => { if (reworkLinks.length < 10) setReworkLinks([...reworkLinks, { id: crypto.randomUUID(), url: '', name: '' }]) }
  const handleRemoveReworkLink = (index: number) => setReworkLinks(reworkLinks.filter((_, i) => i !== index))
  const handleReworkLinkChange = (index: number, field: keyof ReportLinkInput, value: string) => {
    const newLinks = [...reworkLinks]
    newLinks[index] = { ...newLinks[index], [field]: value }
    setReworkLinks(newLinks)
  }

  const handleReworkScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    const filesToAdd = Array.from(files).slice(0, 10 - reworkScreenshots.length)
    filesToAdd.forEach(file => {
      const reader = new FileReader()
      reader.onload = (event) => { if (event.target?.result) setReworkScreenshots(prev => [...prev, event.target!.result as string]) }
      reader.readAsDataURL(file)
    })
  }
  const handleRemoveReworkScreenshot = (index: number) => setReworkScreenshots(prev => prev.filter((_, i) => i !== index))

  const handleCompleteWithReport = async () => {
    if (!reportText.trim()) return
    try {
      const now = new Date().toISOString()
      const formattedLinks = reportLinks.filter(l => l.url.trim() || l.name.trim()).map(l => ({ id: l.id, url: l.url.trim(), name: l.name.trim() }))
      const updates: Partial<Task> = {
        report: { text: reportText, links: formattedLinks, screenshots: reportScreenshots, createdAt: now } as TaskReport,
        status: 'approval', approvalStartedAt: now, updatedAt: now
      }
      await updateTask(localTask.id, updates)
      setLocalTask(prev => ({ ...prev, ...updates }))
      setShowCompleteModal(false)
      setReportText('')
      setReportLinks([{ id: crypto.randomUUID(), url: '', name: '' }])
      setReportScreenshots([])
      onMove(localTask.id, 'approval')
      onClose()
    } catch (error) { console.error('Error completing task with report:', error) }
  }

  const handleSubmitReport = async () => {
    if (!reportText.trim()) return
    try {
      const now = new Date().toISOString()
      const updates: Partial<Task> = {
        report: { text: reportText, links: [], screenshots: [], createdAt: now } as TaskReport,
        status: 'approval', approvalStartedAt: now, updatedAt: now
      }
      await updateTask(localTask.id, updates)
      setLocalTask(prev => ({ ...prev, ...updates }))
      setShowReportForm(false)
      setReportText('')
      onMove(localTask.id, 'approval')
      onClose()
    } catch (error) { console.error('Error submitting report:', error) }
  }

  const handleApprove = async () => {
    try {
      const updates: Partial<Task> = { status: 'completed', completedAt: new Date().toISOString(), approvalStartedAt: undefined, updatedAt: new Date().toISOString() }
      await updateTask(localTask.id, updates)
      setLocalTask(prev => ({ ...prev, ...updates }))
      onMove(localTask.id, 'completed')
      onClose()
    } catch (error) { console.error('Error approving task:', error) }
  }

  const handleRequestRework = async () => {
    if (!reworkComment.trim()) return
    try {
      const now = new Date().toISOString()
      const formattedLinks = reworkLinks.filter(l => l.url.trim() || l.name.trim()).map(l => ({ id: l.id, url: l.url.trim(), name: l.name.trim() }))
      
      // Формируем reworkComment без undefined полей
      const reworkCommentData: {
        text: string
        links: typeof formattedLinks
        screenshots: string[]
        createdAt: string
        createdBy: string
        newDeadline?: string
        newDeadlineTime?: string
      } = { 
        text: reworkComment, 
        links: formattedLinks, 
        screenshots: reworkScreenshots, 
        createdAt: now, 
        createdBy: user?.id || '' 
      }
      
      // Добавляем newDeadline только если он указан
      if (newDeadline) {
        reworkCommentData.newDeadline = newDeadline
        if (newDeadlineTime) {
          reworkCommentData.newDeadlineTime = newDeadlineTime
        }
      }
      
      const updates: Partial<Task> = {
        status: 'in_progress_rework',
        reworkComment: reworkCommentData,
        approvalStartedAt: undefined, 
        updatedAt: now
      }
      
      // Если указан новый дедлайн, обновляем его
      if (newDeadline) {
        updates.dueDate = newDeadline
        if (newDeadlineTime) {
          updates.dueTime = newDeadlineTime
        }
      }
      
      await updateTask(localTask.id, updates)
      setLocalTask(prev => ({ ...prev, ...updates }))
      setShowReworkForm(false)
      setShowReworkLinksModal(false)
      setShowReworkScreenshotsModal(false)
      setShowReworkDeadlineModal(false)
      setReworkComment('')
      setReworkLinks([{ id: crypto.randomUUID(), url: '', name: '' }])
      setReworkScreenshots([])
      setNewDeadline('')
      setNewDeadlineTime('')
      onMove(localTask.id, 'in_progress_rework', true)
      onClose()
    } catch (error) { console.error('Error requesting rework:', error) }
  }

  const primaryAssignee = localTask.assignedTo?.[0]
  const isTaskCompleted = localTask.status === 'completed' || localTask.status === 'closed'
  const completionDate = localTask.completedAt || localTask.closedAt

  const handleStatusChange = (newStatus: TaskStatus) => {
    switch (newStatus) {
      case 'completed':
        setShowCompleteModal(true)
        return
      case 'closed':
        onMove(localTask.id!, newStatus)
        setLocalTask(prev => ({ ...prev, status: newStatus, closedAt: new Date().toISOString(), updatedAt: new Date().toISOString() }))
        return
      case 'in_progress':
        onMove(localTask.id!, newStatus)
        setLocalTask(prev => ({ ...prev, status: newStatus, completedAt: undefined, closedAt: undefined, updatedAt: new Date().toISOString() }))
        return
      default:
        onMove(localTask.id!, newStatus)
        setLocalTask(prev => ({ ...prev, status: newStatus, updatedAt: new Date().toISOString() }))
    }
  }

  const renderScreenshot = (src: string, index: number) => (
    <div key={index} className="relative group">
      <img src={src} alt={`Скриншот ${index + 1}`} className="w-20 h-20 object-cover rounded-lg border border-white/10" />
      <button onClick={() => handleRemoveScreenshot(index)} className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"><Trash size={12} /></button>
    </div>
  )

  return (
    <>
    <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 overflow-y-auto">
      <div className={`${theme === 'dark' ? 'bg-[#0f141a]' : 'bg-white'} w-full max-w-2xl max-h-[calc(100vh-32px)] rounded-3xl overflow-hidden shadow-2xl border mt-4 ${theme === 'dark' ? 'border-white/10' : 'border-gray-100'}`}>
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div>
              <p className={`text-[10px] font-bold uppercase tracking-wider ${subTextColor}`}>#{localTask.id?.slice(0, 6) || 'NEW'}</p>
              <h2 className={`text-xl font-black tracking-tight ${headingColor}`}>{localTask.title}</h2>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><X className="w-5 h-5 text-gray-500" /></button>
        </div>

        <div className="p-6 space-y-5 max-h-[calc(100vh-280px)] overflow-y-auto custom-scrollbar">
          <div className="flex items-center gap-3">
            <span className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${statusInfo.bg} ${statusInfo.border} ${statusInfo.color} font-bold text-sm`}>{statusInfo.icon}{statusInfo.label}</span>
            <span className={`text-xs px-3 py-1.5 rounded-lg border font-bold uppercase ${getPriorityColor(localTask.priority)}`}>{getPriorityLabel(localTask.priority)}</span>
            <span className={`text-xs px-3 py-1.5 rounded-lg border font-bold uppercase ${theme === 'dark' ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-gray-100 border-gray-200 text-gray-600'}`}>{getCategoryLabel(localTask.category)}</span>
          </div>

          {isTaskCompleted && completionDate && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#4C7F6E]/10 border border-[#4C7F6E]/20">
              <CheckCircle2 size={14} className="text-[#4C7F6E]" />
              <span className="text-xs font-bold text-[#4C7F6E] uppercase tracking-wider">Завершено {formatDate(new Date(completionDate), 'dd.MM.yyyy HH:mm')}</span>
            </div>
          )}

          <div className={`p-4 rounded-xl border border-white/5 bg-white/5`}>
            <div className="flex items-center gap-2 mb-2"><User size={14} className={subTextColor} /><span className={`text-[10px] uppercase font-bold tracking-wider ${subTextColor}`}>Автор</span></div>
            <div className="flex items-center gap-2"><Avatar userId={localTask.createdBy} size="md" /><UserNickname userId={localTask.createdBy} className={`text-sm font-bold ${headingColor}`} /></div>
          </div>

          {primaryAssignee && primaryAssignee !== localTask.createdBy && (
            <div className={`p-4 rounded-xl border border-white/5 bg-white/5`}>
              <div className="flex items-center gap-2 mb-2"><User size={14} className={subTextColor} /><span className={`text-[10px] uppercase font-bold tracking-wider ${subTextColor}`}>Исполнитель</span></div>
              <div className="flex items-center gap-2"><Avatar userId={primaryAssignee} size="md" /><UserNickname userId={primaryAssignee} className={`text-sm font-bold ${headingColor}`} /></div>
            </div>
          )}

          {localTask.coExecutors && localTask.coExecutors.length > 0 && (
            <div className={`p-4 rounded-xl border border-white/5 bg-white/5`}>
              <div className="flex items-center gap-2 mb-2"><Users size={14} className={subTextColor} /><span className={`text-[10px] uppercase font-bold tracking-wider ${subTextColor}`}>Соисполнители</span></div>
              <div className="flex flex-wrap gap-2">{localTask.coExecutors.map((userId, idx) => (<div key={idx} className="flex items-center gap-2 px-2 py-1 rounded-lg bg-white/5"><Avatar userId={userId} size="sm" /><UserNickname userId={userId} className={`text-xs font-medium ${headingColor}`} /></div>))}</div>
            </div>
          )}

          {localTask.deadlineExtensions > 0 && (
            <div className="flex items-center gap-2 p-4 rounded-xl bg-[#4C7F6E]/10 border border-[#4C7F6E]/20">
              <RefreshCw size={16} className="text-[#4C7F6E] flex-shrink-0" />
              <div className="flex flex-col">
                <span className={`text-[10px] uppercase font-bold tracking-wider ${headingColor}`}>Дедлайн продлён</span>
                <span className={`text-sm font-medium ${headingColor}`}>{localTask.deadlineExtensions}/10 раз{localTask.originalDueDate && <span className="text-xs ml-2 opacity-70">(был: {formatDate(new Date(localTask.originalDueDate), 'dd.MM.yyyy HH:mm')})</span>}</span>
              </div>
            </div>
          )}

          {isMaxExtensionsReached && !isTaskCompleted && (
            <div className="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
              <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
              <span className="text-sm font-bold text-red-400">Достигнуто максимальное количество продлений! Обратитесь к DM или автору.</span>
            </div>
          )}

          <div className="p-4 rounded-xl border border-white/5 bg-white/5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2"><Calendar size={16} className={subTextColor} /><span className={`text-[10px] uppercase font-bold tracking-wider ${subTextColor}`}>Дедлайн</span></div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`text-lg font-bold ${headingColor}`}>{localTask.dueDate ? formatDate(new Date(localTask.dueDate), 'dd.MM.yyyy') : '—'}</span>
                {localTask.dueTime && <span className={`text-lg font-bold ${headingColor}`}>{localTask.dueTime}</span>}
              </div>
              {!isTaskCompleted && localTask.dueDate && localTask.dueTime && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#4C7F6E]/10 border border-[#4C7F6E]/20">
                  <Clock size={14} className="text-[#4C7F6E]" />
                  <span className="text-xs font-mono font-bold text-[#4C7F6E]"><CountdownTimer deadline={`${localTask.dueDate}T${localTask.dueTime}`} /></span>
                </div>
              )}
            </div>
          </div>

          {localTask.description && <div><h3 className={`text-[10px] uppercase font-bold tracking-wider ${subTextColor} mb-2`}>Описание</h3><p className={`text-sm leading-relaxed ${headingColor} whitespace-pre-wrap`}>{localTask.description}</p></div>}
          {localTask.expectedResult && <div><h3 className={`text-[10px] uppercase font-bold tracking-wider ${subTextColor} mb-2 flex items-center gap-2`}><Target size={14} /> Ожидаемый результат</h3><p className={`text-sm leading-relaxed ${headingColor} whitespace-pre-wrap`}>{localTask.expectedResult}</p></div>}

          {localTask.links && localTask.links.length > 0 && (
            <div>
              <h3 className={`text-[10px] uppercase font-bold tracking-wider ${subTextColor} mb-2 flex items-center gap-2`}><Link2 size={14} /> Ссылки</h3>
              <div className="space-y-2">{localTask.links.map((link) => (<a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 p-3 rounded-xl border ${theme === 'dark' ? 'border-white/5 bg-white/5 hover:bg-white/10' : 'border-gray-100 bg-gray-50 hover:bg-gray-100'} transition-all group`}><ExternalLink size={14} className={`${subTextColor} group-hover:text-[#4C7F6E] transition-colors`} /><span className={`text-sm font-medium ${headingColor} group-hover:text-[#4C7F6E] transition-colors`}>{link.name || link.url}</span></a>))}</div>
            </div>
          )}

          {/* Кнопка просмотра отчета для автора в статусе согласования */}
          {localTask.status === 'approval' && isTaskAuthor && (
            <button 
              onClick={() => setShowReportModal(true)}
              className={`flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border border-[#4C7F6E]/20 bg-[#4C7F6E]/10 ${buttonTextColor} font-bold text-sm transition-all hover:bg-[#4C7F6E]/20`}
            >
              <FileText size={16} />
              Просмотреть отчёт
            </button>
          )}

          {localTask.report && (
            <div className={`p-4 rounded-xl border border-[#4C7F6E]/20 bg-[#4C7F6E]/5`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2"><FileText size={14} className="text-[#4C7F6E]" /><span className={`text-[10px] uppercase font-bold tracking-wider text-[#4C7F6E]`}>Отчёт</span></div>
                {localTask.status !== 'approval' && (
                  <button 
                    onClick={() => setShowReportModal(true)}
                    className="text-xs text-[#4C7F6E] hover:text-[#4C7F6E] underline"
                  >
                    Подробнее
                  </button>
                )}
              </div>
              <p className={`text-sm leading-relaxed ${headingColor} whitespace-pre-wrap mb-3`}>{localTask.report.text}</p>
              {localTask.report.links && localTask.report.links.length > 0 && (
                <div className="mt-3 pt-3 border-t border-[#4C7F6E]/10">
                  <h4 className={`text-[10px] uppercase font-bold tracking-wider text-[#4C7F6E]/70 mb-2`}>Ссылки</h4>
                  <div className="space-y-1">{localTask.report.links.map((link) => (<a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 text-sm ${headingColor} hover:text-[#4C7F6E]`}><ExternalLink size={12} />{link.name || link.url}</a>))}</div>
                </div>
              )}
              {localTask.report.screenshots && localTask.report.screenshots.length > 0 && (
                <div className="mt-3 pt-3 border-t border-[#4C7F6E]/10">
                  <h4 className={`text-[10px] uppercase font-bold tracking-wider text-[#4C7F6E]/70 mb-2`}>Скриншоты</h4>
                  <div className="flex flex-wrap gap-2">{localTask.report.screenshots.map((screenshot, idx) => (<a key={idx} href={screenshot} target="_blank" rel="noopener noreferrer"><img src={screenshot} alt={`Скриншот ${idx + 1}`} className="w-20 h-20 object-cover rounded-lg border border-[#4C7F6E]/20 hover:scale-105 transition-transform" /></a>))}</div>
                </div>
              )}
            </div>
          )}

          {/* Комментарий к доработке - виден автору и исполнителю */}
          {localTask.reworkComment && (
            <div className={`p-4 rounded-xl border border-[#4C7F6E]/20 bg-[#4C7F6E]/5`}>
              <div className="flex items-center gap-2 mb-2"><RotateCcw size={14} className="text-[#4C7F6E]" /><span className={`text-[10px] uppercase font-bold tracking-wider text-[#4C7F6E]`}>Комментарий к доработке</span></div>
              <p className={`text-sm leading-relaxed ${headingColor} whitespace-pre-wrap mb-3`}>{localTask.reworkComment.text}</p>
              
              {localTask.reworkComment.links && localTask.reworkComment.links.length > 0 && (
                <div className="mt-3 pt-3 border-t border-[#4C7F6E]/10">
                  <h4 className={`text-[10px] uppercase font-bold tracking-wider text-[#4C7F6E]/70 mb-2`}>Ссылки</h4>
                  <div className="space-y-1">{localTask.reworkComment.links.map((link) => (<a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 text-sm ${headingColor} hover:text-[#4C7F6E]`}><ExternalLink size={12} />{link.name || link.url}</a>))}</div>
                </div>
              )}
              {localTask.reworkComment.screenshots && localTask.reworkComment.screenshots.length > 0 && (
                <div className="mt-3 pt-3 border-t border-[#4C7F6E]/10">
                  <h4 className={`text-[10px] uppercase font-bold tracking-wider text-[#4C7F6E]/70 mb-2`}>Скриншоты</h4>
                  <div className="flex flex-wrap gap-2">{localTask.reworkComment.screenshots.map((screenshot, idx) => (<a key={idx} href={screenshot} target="_blank" rel="noopener noreferrer"><img src={screenshot} alt={`Скриншот ${idx + 1}`} className="w-20 h-20 object-cover rounded-lg border border-[#4C7F6E]/20 hover:scale-105 transition-transform" /></a>))}</div>
                </div>
              )}
              {localTask.reworkComment.newDeadline && (
                <div className="mt-3 pt-3 border-t border-[#4C7F6E]/10">
                  <div className="flex items-center gap-2 text-sm text-[#4C7F6E]">
                    <Calendar size={14} />
                    <span>Новый дедлайн: {localTask.reworkComment.newDeadline} {localTask.reworkComment.newDeadlineTime || ''}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Кнопка завершения задачи для исполнителя/соисполнителя */}
          {(localTask.status === 'in_progress' || localTask.status === 'in_progress_rework') && canCompleteTask && (
            <button 
              onClick={() => setShowCompleteModal(true)} 
              className={`flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border border-[#4C7F6E]/20 bg-[#4C7F6E]/10 ${buttonTextColor} font-bold text-sm transition-all hover:bg-[#4C7F6E]/20`}
            >
              <CheckCircle2 size={16} />
              Выполнено
            </button>
          )}

          {localTask.status === 'in_progress' && canSubmitReport && !showReportForm && !canCompleteTask && (
            <button onClick={() => setShowReportForm(true)} className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border border-purple-500/20 bg-purple-500/10 text-purple-400 font-bold text-sm transition-all hover:bg-purple-500/20"><Send size={16} />Отправить отчёт</button>
          )}

          {showReportForm && (
            <div className={`p-4 rounded-xl border border-purple-500/20 bg-purple-500/5 space-y-3`}>
              <h3 className={`text-[10px] uppercase font-bold tracking-wider text-purple-400`}>Отчёт о выполнении</h3>
              <textarea value={reportText} onChange={(e) => setReportText(e.target.value)} placeholder="Опишите выполненную работу..." className={`w-full h-32 p-3 rounded-xl border bg-transparent text-sm ${headingColor} placeholder-gray-500 whitespace-pre-wrap ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} focus:outline-none focus:border-purple-500/50`} />
              <div className="flex gap-2">
                <button onClick={handleSubmitReport} disabled={!reportText.trim()} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-purple-500 text-white font-bold text-sm transition-all hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"><Send size={16} />Отправить</button>
                <button onClick={() => { setShowReportForm(false); setReportText('') }} className="px-4 py-2 rounded-xl border border-gray-500/20 text-gray-400 font-bold text-sm transition-all hover:bg-white/5">Отмена</button>
              </div>
            </div>
          )}

          {localTask.status === 'approval' && canApprove && (
            <div className="space-y-3">
              <div className="flex gap-2">
                <button onClick={handleApprove} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#4C7F6E] text-white font-bold text-sm transition-all hover:bg-[#4C7F6E]"><Check size={16} />Согласую</button>
                <button onClick={() => setShowReworkForm(true)} className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[#4C7F6E]/20 bg-[#4C7F6E]/10 ${buttonTextColor} font-bold text-sm transition-all hover:bg-[#4C7F6E]/20`}><RotateCcw size={16} />На доработку</button>
              </div>
              {showReworkForm && (
                <div className={`p-4 rounded-xl border border-[#4C7F6E]/20 bg-[#4C7F6E]/5 space-y-3`}>
                  <h3 className={`text-[10px] uppercase font-bold tracking-wider text-[#4C7F6E]`}>Комментарий к доработке</h3>
                  <textarea value={reworkComment} onChange={(e) => setReworkComment(e.target.value)} placeholder="Укажите, что нужно исправить..." className={`w-full h-32 p-3 rounded-xl border bg-transparent text-sm ${headingColor} placeholder-gray-500 whitespace-pre-wrap ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} focus:outline-none focus:border-[#4C7F6E]/50`} />
                  
                  {/* Кнопки для добавления ссылок, скриншотов и дедлайна */}
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => setShowReworkLinksModal(true)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border border-[#4C7F6E]/20 ${buttonTextColor} text-xs font-bold hover:bg-[#4C7F6E]/10 transition-all`}
                    >
                      <Link2 size={14} />
                      Добавить ссылки ({reworkLinks.filter(l => l.url || l.name).length}/10)
                    </button>
                    <button 
                      onClick={() => setShowReworkScreenshotsModal(true)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border border-[#4C7F6E]/20 ${buttonTextColor} text-xs font-bold hover:bg-[#4C7F6E]/10 transition-all`}
                    >
                      <Image size={14} />
                      Скриншоты ({reworkScreenshots.length}/10)
                    </button>
                    <button 
                      onClick={() => setShowReworkDeadlineModal(true)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border border-[#4C7F6E]/20 ${buttonTextColor} text-xs font-bold hover:bg-[#4C7F6E]/10 transition-all`}
                    >
                      <Calendar size={14} />
                      Новый дедлайн {newDeadline && `(${newDeadline} ${newDeadlineTime || ''})`}
                    </button>
                  </div>
                  
                  <div className="flex gap-2">
                    <button onClick={handleRequestRework} disabled={!reworkComment.trim()} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#4C7F6E] text-white font-bold text-sm transition-all hover:bg-[#4C7F6E]/80 disabled:opacity-50 disabled:cursor-not-allowed"><RotateCcw size={16} />На доработку</button>
                    <button onClick={() => { setShowReworkForm(false); setReworkComment('') }} className="px-4 py-2 rounded-xl border border-gray-500/20 text-gray-400 font-bold text-sm transition-all hover:bg-white/5">Отмена</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Блок изменения статуса - только для админа */}
          {isAdmin && (
            <div>
              <h3 className={`text-[10px] uppercase font-bold tracking-wider ${subTextColor} mb-2`}>Изменить статус</h3>
              <div className="flex flex-wrap gap-2">
                {availableStatusOptions.map((option) => (
                  <button key={option.status} onClick={() => handleStatusChange(option.status)} className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-bold text-sm transition-all ${localTask.status === option.status ? theme === 'dark' ? 'bg-blue-500/20 border-blue-500 text-blue-400 ring-2 ring-blue-500/50' : 'bg-blue-100 border-blue-400 text-blue-600 ring-2 ring-blue-400/50' : theme === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10 text-gray-400 hover:text-white' : 'bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-600 hover:text-gray-900'}`}>
                    {option.icon}{option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 p-6 border-t border-white/5">
          <button onClick={() => onCopyLink(localTask.id!)} className="flex items-center gap-2 px-4 py-2 rounded-xl border font-bold text-sm transition-all hover:bg-[#4C7F6E]/10 hover:border-[#4C7F6E]/20 hover:text-[#4C7F6E]"><Share size={16} /><span>Копировать ссылку</span></button>
          {canEdit && <button onClick={() => onEdit(localTask)} className="flex items-center gap-2 px-4 py-2 rounded-xl border font-bold text-sm transition-all hover:bg-blue-500/10 hover:border-blue-500/20 hover:text-blue-500"><Edit size={16} /><span>Редактировать</span></button>}
          {canDelete && <button onClick={() => onDelete(localTask.id!)} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-500/20 text-red-500 font-bold text-sm transition-all hover:bg-red-500/10"><Trash2 size={16} /><span>Удалить</span></button>}
        </div>
      </div>
    </div>

    {showCompleteModal && (
      <div className="fixed inset-0 z-[200] flex items-start justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300 overflow-y-auto">
        <div className={`${theme === 'dark' ? 'bg-[#0f141a]' : 'bg-white'} w-full max-w-3xl max-h-[calc(100vh-32px)] rounded-3xl overflow-hidden shadow-2xl border mt-4 ${theme === 'dark' ? 'border-white/10' : 'border-gray-100'}`}>
          <div className="flex items-center justify-between p-6 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl bg-[#4C7F6E]/10`}><CheckCircle2 size={24} className="text-[#4C7F6E]" /></div>
              <div>
                <h2 className={`text-xl font-black tracking-tight ${headingColor}`}>Завершение задачи</h2>
                <p className={`text-xs ${subTextColor}`}>Заполните отчёт о выполненной работе</p>
              </div>
            </div>
            <button onClick={() => setShowCompleteModal(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><X className="w-5 h-5 text-gray-500" /></button>
          </div>

          <div className="p-6 space-y-5 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#4C7F6E] flex items-center gap-2"><FileText size={14} /> Отчёт о выполнении</label>
              <textarea value={reportText} onChange={(e) => setReportText(e.target.value)} placeholder="Опишите выполненную работу... (поддерживается форматирование)" className={`w-full h-40 p-4 rounded-xl border text-sm ${headingColor} placeholder-gray-500 whitespace-pre-wrap resize-none ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'} focus:outline-none focus:border-[#4C7F6E]/50`} />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#4C7F6E] flex items-center gap-2"><Link2 size={14} /> Ссылки ({reportLinks.length}/20)</label>
              {reportLinks.map((linkInput, index) => (
                <div key={linkInput.id} className="flex gap-2">
                  <input type="text" placeholder="URL" value={linkInput.url} onChange={(e) => handleReportLinkChange(index, 'url', e.target.value)} className={`flex-1 px-4 py-3 rounded-xl border text-sm ${headingColor} placeholder-gray-500 ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'} focus:outline-none focus:border-[#4C7F6E]/50`} />
                  <input type="text" placeholder="Название" value={linkInput.name} onChange={(e) => handleReportLinkChange(index, 'name', e.target.value)} className={`flex-1 px-4 py-3 rounded-xl border text-sm ${headingColor} placeholder-gray-500 ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'} focus:outline-none focus:border-[#4C7F6E]/50`} />
                  {reportLinks.length > 1 && <button type="button" onClick={() => handleRemoveReportLink(index)} className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all"><Trash className="w-5 h-5" /></button>}
                </div>
              ))}
              {reportLinks.length < 10 && <button type="button" onClick={handleAddReportLink} className={`w-full px-4 py-3 rounded-xl border border-dashed border-[#4C7F6E] ${buttonTextColor} hover:bg-[#4C7F6E]/10 transition-all flex items-center justify-center gap-2 text-sm font-bold`}><Plus className="w-4 h-4" /> Добавить ссылку</button>}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#4C7F6E] flex items-center gap-2"><Image size={14} /> Скриншоты ({reportScreenshots.length}/10)</label>
              {reportScreenshots.length > 0 && <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-white/5 border border-white/10">{reportScreenshots.map((screenshot, index) => renderScreenshot(screenshot, index))}</div>}
              {reportScreenshots.length < 10 && <button type="button" onClick={() => fileInputRef.current?.click()} className={`w-full px-4 py-3 rounded-xl border border-dashed border-[#4C7F6E] ${buttonTextColor} hover:bg-[#4C7F6E]/10 transition-all flex items-center justify-center gap-2 text-sm font-bold`}><Upload className="w-4 h-4" /> Загрузить скриншоты</button>}
              <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleScreenshotUpload} className="hidden" />
              <p className={`text-xs ${subTextColor}`}>Максимум 10 скриншотов. Перетаскивание или выбор файлов.</p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 p-6 border-t border-white/5">
            <button onClick={() => { setShowCompleteModal(false); setReportText(''); setReportLinks([{ id: crypto.randomUUID(), url: '', name: '' }]); setReportScreenshots([]) }} className={`px-6 py-3 rounded-xl font-bold transition-all ${theme === 'dark' ? 'bg-white/5 text-gray-400 hover:bg-white/10' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Отмена</button>
            <button onClick={handleCompleteWithReport} disabled={!reportText.trim()} className="flex items-center gap-2 px-6 py-3 bg-[#4C7F6E] hover:bg-[#4C7F6E] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-lg shadow-[#4C7F6E]/20 transition-all"><CheckCircle2 className="w-4 h-4" />Отправить на согласование</button>
          </div>
        </div>
      </div>
    )}

    {/* Модальное окно просмотра отчета */}
    {showReportModal && localTask.report && (
      <div className="fixed inset-0 z-[200] flex items-start justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300 overflow-y-auto">
        <div className={`${theme === 'dark' ? 'bg-[#0f141a]' : 'bg-white'} w-full max-w-3xl max-h-[calc(100vh-32px)] rounded-3xl overflow-hidden shadow-2xl border mt-4 ${theme === 'dark' ? 'border-white/10' : 'border-gray-100'}`}>
          <div className="flex items-center justify-between p-6 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl bg-[#4C7F6E]/10`}><FileText size={24} className="text-[#4C7F6E]" /></div>
              <div>
                <h2 className={`text-xl font-black tracking-tight ${headingColor}`}>Отчёт о выполнении</h2>
                <p className={`text-xs ${subTextColor}`}>Задача #{localTask.id?.slice(0, 6)}</p>
              </div>
            </div>
            <button onClick={() => setShowReportModal(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><X className="w-5 h-5 text-gray-500" /></button>
          </div>

          <div className="p-6 space-y-5 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#4C7F6E] flex items-center gap-2"><FileText size={14} /> Текст отчёта</label>
              <div className={`p-4 rounded-xl border text-sm ${headingColor} whitespace-pre-wrap ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'}`}>
                {localTask.report.text}
              </div>
            </div>

            {localTask.report.links && localTask.report.links.length > 0 && (
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#4C7F6E] flex items-center gap-2"><Link2 size={14} /> Ссылки ({localTask.report.links.length}/10)</label>
                <div className="space-y-2">
                  {localTask.report.links.map((link) => (
                    <a 
                      key={link.id} 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className={`flex items-center gap-3 p-3 rounded-xl border ${theme === 'dark' ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'} transition-all group`}
                    >
                      <ExternalLink size={16} className="text-[#4C7F6E] flex-shrink-0" />
                      <span className={`text-sm font-medium ${headingColor} group-hover:text-[#4C7F6E] transition-colors`}>{link.name || link.url}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {localTask.report.screenshots && localTask.report.screenshots.length > 0 && (
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#4C7F6E] flex items-center gap-2"><Image size={14} /> Скриншоты ({localTask.report.screenshots.length}/10)</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {localTask.report.screenshots.map((screenshot, idx) => (
                    <a 
                      key={idx} 
                      href={screenshot} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="relative group"
                    >
                      <img 
                        src={screenshot} 
                        alt={`Скриншот ${idx + 1}`} 
                        className="w-full h-24 object-cover rounded-lg border border-[#4C7F6E]/20 group-hover:scale-105 transition-transform" 
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                        <ExternalLink size={20} className="text-white" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 p-6 border-t border-white/5">
            <button onClick={() => setShowReportModal(false)} className={`px-6 py-3 rounded-xl font-bold transition-all ${theme === 'dark' ? 'bg-white/5 text-gray-400 hover:bg-white/10' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Закрыть</button>
          </div>
        </div>
      </div>
    )}

    {/* Модальное окно добавления ссылок для доработки */}
    {showReworkLinksModal && (
      <div className="fixed inset-0 z-[200] flex items-start justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300 overflow-y-auto">
        <div className={`${theme === 'dark' ? 'bg-[#0f141a]' : 'bg-white'} w-full max-w-2xl max-h-[calc(100vh-32px)] rounded-3xl overflow-hidden shadow-2xl border mt-4 ${theme === 'dark' ? 'border-white/10' : 'border-gray-100'}`}>
          <div className="flex items-center justify-between p-6 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl bg-[#4C7F6E]/10`}><Link2 size={24} className="text-[#4C7F6E]" /></div>
              <div>
                <h2 className={`text-xl font-black tracking-tight ${headingColor}`}>Ссылки для доработки</h2>
                <p className={`text-xs ${subTextColor}`}>Добавьте ссылки с описанием</p>
              </div>
            </div>
            <button onClick={() => setShowReworkLinksModal(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><X className="w-5 h-5 text-gray-500" /></button>
          </div>

          <div className="p-6 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
            {reworkLinks.map((linkInput, index) => (
              <div key={linkInput.id} className="flex gap-2">
                <input type="text" placeholder="URL" value={linkInput.url} onChange={(e) => handleReworkLinkChange(index, 'url', e.target.value)} className={`flex-1 px-4 py-3 rounded-xl border text-sm ${headingColor} placeholder-gray-500 ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'} focus:outline-none focus:border-[#4C7F6E]/50`} />
                <input type="text" placeholder="Название" value={linkInput.name} onChange={(e) => handleReworkLinkChange(index, 'name', e.target.value)} className={`flex-1 px-4 py-3 rounded-xl border text-sm ${headingColor} placeholder-gray-500 ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'} focus:outline-none focus:border-[#4C7F6E]/50`} />
                {reworkLinks.length > 1 && <button type="button" onClick={() => handleRemoveReworkLink(index)} className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all"><Trash className="w-5 h-5" /></button>}
              </div>
            ))}
            {reworkLinks.length < 10 && <button type="button" onClick={handleAddReworkLink} className={`w-full px-4 py-3 rounded-xl border border-dashed border-[#4C7F6E] ${buttonTextColor} hover:bg-[#4C7F6E]/10 transition-all flex items-center justify-center gap-2 text-sm font-bold`}><Plus className="w-4 h-4" /> Добавить ссылку</button>}
          </div>

          <div className="flex items-center justify-end gap-3 p-6 border-t border-white/5">
            <button onClick={() => setShowReworkLinksModal(false)} className="px-6 py-3 bg-[#4C7F6E] hover:bg-[#4C7F6E] text-white rounded-xl font-bold transition-all">Готово</button>
          </div>
        </div>
      </div>
    )}

    {/* Модальное окно добавления скриншотов для доработки */}
    {showReworkScreenshotsModal && (
      <div className="fixed inset-0 z-[200] flex items-start justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300 overflow-y-auto">
        <div className={`${theme === 'dark' ? 'bg-[#0f141a]' : 'bg-white'} w-full max-w-2xl max-h-[calc(100vh-32px)] rounded-3xl overflow-hidden shadow-2xl border mt-4 ${theme === 'dark' ? 'border-white/10' : 'border-gray-100'}`}>
          <div className="flex items-center justify-between p-6 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl bg-[#4C7F6E]/10`}><Image size={24} className="text-[#4C7F6E]" /></div>
              <div>
                <h2 className={`text-xl font-black tracking-tight ${headingColor}`}>Скриншоты для доработки</h2>
                <p className={`text-xs ${subTextColor}`}>Добавьте скриншоты с описанием ошибок</p>
              </div>
            </div>
            <button onClick={() => setShowReworkScreenshotsModal(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><X className="w-5 h-5 text-gray-500" /></button>
          </div>

          <div className="p-6 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
            {reworkScreenshots.length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-white/5 border border-white/10">
                {reworkScreenshots.map((screenshot, index) => (
                  <div key={index} className="relative group">
                    <img src={screenshot} alt={`Скриншот ${index + 1}`} className="w-20 h-20 object-cover rounded-lg border border-[#4C7F6E]/20" />
                    <button onClick={() => handleRemoveReworkScreenshot(index)} className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"><Trash size={12} /></button>
                  </div>
                ))}
              </div>
            )}
            {reworkScreenshots.length < 10 && (
              <label className={`w-full px-4 py-6 rounded-xl border border-dashed border-[#4C7F6E] ${buttonTextColor} hover:bg-[#4C7F6E]/10 transition-all flex items-center justify-center gap-2 text-sm font-bold cursor-pointer`}>
                <Upload className="w-4 h-4" />
                Загрузить скриншоты
                <input type="file" accept="image/*" multiple onChange={handleReworkScreenshotUpload} className="hidden" />
              </label>
            )}
            <p className={`text-xs ${subTextColor}`}>Максимум 10 скриншотов.</p>
          </div>

          <div className="flex items-center justify-end gap-3 p-6 border-t border-white/5">
            <button onClick={() => setShowReworkScreenshotsModal(false)} className="px-6 py-3 bg-[#4C7F6E] hover:bg-[#4C7F6E] text-white rounded-xl font-bold transition-all">Готово</button>
          </div>
        </div>
      </div>
    )}

    {/* Модальное окно выбора нового дедлайна для доработки */}
    {showReworkDeadlineModal && (
      <div className="fixed inset-0 z-[200] flex items-start justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300 overflow-y-auto">
        <div className={`${theme === 'dark' ? 'bg-[#0f141a]' : 'bg-white'} w-full max-w-md max-h-[calc(100vh-32px)] rounded-3xl overflow-hidden shadow-2xl border mt-4 ${theme === 'dark' ? 'border-white/10' : 'border-gray-100'}`}>
          <div className="flex items-center justify-between p-6 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl bg-[#4C7F6E]/10`}><Calendar size={24} className="text-[#4C7F6E]" /></div>
              <div>
                <h2 className={`text-xl font-black tracking-tight ${headingColor}`}>Новый дедлайн</h2>
                <p className={`text-xs ${subTextColor}`}>Укажите новый срок выполнения</p>
              </div>
            </div>
            <button onClick={() => setShowReworkDeadlineModal(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><X className="w-5 h-5 text-gray-500" /></button>
          </div>

          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#4C7F6E]">Дата</label>
              <input 
                type="date" 
                value={newDeadline} 
                onChange={(e) => setNewDeadline(e.target.value)} 
                className={`w-full px-4 py-3 rounded-xl border text-sm ${headingColor} ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'} focus:outline-none focus:border-[#4C7F6E]/50`}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#4C7F6E]">Время (необязательно)</label>
              <input 
                type="time" 
                value={newDeadlineTime} 
                onChange={(e) => setNewDeadlineTime(e.target.value)} 
                className={`w-full px-4 py-3 rounded-xl border text-sm ${headingColor} ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'} focus:outline-none focus:border-[#4C7F6E]/50`}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 p-6 border-t border-white/5">
            <button 
              onClick={() => { setNewDeadline(''); setNewDeadlineTime('') }} 
              className={`px-4 py-2 rounded-xl font-bold transition-all ${theme === 'dark' ? 'bg-white/5 text-gray-400 hover:bg-white/10' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              Очистить
            </button>
            <button onClick={() => setShowReworkDeadlineModal(false)} className="px-6 py-3 bg-[#4C7F6E] hover:bg-[#4C7F6E] text-white rounded-xl font-bold transition-all">Готово</button>
          </div>
        </div>
      </div>
    )}
    </>
  )
}