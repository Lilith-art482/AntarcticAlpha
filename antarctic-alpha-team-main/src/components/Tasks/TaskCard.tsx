import { Task, TaskStatus, TaskPriority, TaskCategory } from '@/types'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { useAdminStore } from '@/store/adminStore'
import { Calendar, Clock, Share2, Edit, Trash2, CheckCircle2, Circle, XCircle, RefreshCw, AlertCircle } from 'lucide-react'
import { formatDate } from '@/utils/dateUtils'
import { CountdownTimer } from '@/components/Analytics/AnalyticsTable'
import Avatar from '@/components/Avatar'
import { UserNickname } from '@/components/UserNickname'
import { TASK_CATEGORIES } from '@/types'

interface TaskCardProps {
  task: Task
  onClick: () => void
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
  onCopyLink: (taskId: string) => void
  onMove?: (taskId: string, newStatus: TaskStatus) => void
  onComplete?: (taskId: string) => void // для открытия модального окна с отчётом
}

export const TaskCard = ({ task, onClick, onEdit, onDelete, onCopyLink, onMove, onComplete }: TaskCardProps) => {
  const { theme } = useThemeStore()
  const { user } = useAuthStore()
  const { isAdmin: isAdminStore } = useAdminStore()
  
  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const subTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500'

  // Проверка прав
  const isTaskAuthor = task.createdBy === user?.id
  const isAdmin = isAdminStore || user?.role === 'admin'
  const isExecutor = task.assignedTo?.includes(user?.id || '')
  const isCoExecutor = task.coExecutors?.includes(user?.id || '')
  const canComplete = isExecutor || isCoExecutor || isAdmin // Исполнитель/соисполнитель может завершить
  const canEdit = isTaskAuthor || isAdmin // Редактировать - автор или админ

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
    switch (priority) {
      case 'low': return 'Низкий'
      case 'medium': return 'Средний'
      case 'high': return 'Высокий'
      case 'urgent': return 'Срочный'
      default: return 'Средний'
    }
  }

  const getCategoryLabel = (category: TaskCategory) => {
    return TASK_CATEGORIES[category]?.label || category
  }

  const getStatusInfo = (status: TaskStatus) => {
    switch (status) {
      case 'in_progress': return { label: 'В работе', color: 'bg-blue-500', text: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' }
      case 'in_progress_rework': return { label: 'В работе - ПВ', color: 'bg-orange-500', text: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' }
      case 'completed': return { label: 'Выполнено', color: 'bg-violet-500', text: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' }
      case 'approval': return { label: 'Согласование', color: 'bg-[#4C7F6E]', text: 'text-[#4C7F6E]', bg: 'bg-[#4C7F6E]/10', border: 'border-[#4C7F6E]/20' }
      case 'closed': return { label: 'Закрыто', color: 'bg-gray-500', text: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/20' }
      default: return { label: 'В работе', color: 'bg-blue-500', text: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' }
    }
  }

  const statusInfo = getStatusInfo(task.status)

  const isMaxExtensionsReached = task.deadlineExtensions >= 10

  // Get primary assignee (first from assignedTo array)
  const primaryAssignee = task.assignedTo?.[0]
  const coExecutors = task.coExecutors || []

  const handleAction = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation()
    action()
  }

  // Status change options for quick action
  const getNextStatus = (currentStatus: TaskStatus): TaskStatus => {
    switch (currentStatus) {
      case 'in_progress': return 'completed'
      case 'completed': return 'closed'
      case 'closed': return 'in_progress'
      default: return 'completed'
    }
  }

  const getNextStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'in_progress': return <Circle size={16} className="fill-blue-500 text-blue-500" />
      case 'completed': return <CheckCircle2 size={16} className="text-[#4C7F6E]" />
      case 'closed': return <XCircle size={16} className="text-gray-500" />
      default: return <Circle size={16} className="fill-blue-500 text-blue-500" />
    }
  }

  const nextStatus = getNextStatus(task.status)
  const isTaskCompleted = task.status === 'completed' || task.status === 'closed'
  const completionDate = task.completedAt || task.closedAt

  return (
    <div
      onClick={onClick}
      className={`${theme === 'dark' ? 'bg-[#0b1015]' : 'bg-white'} rounded-2xl p-6 border ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'} cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-[#4C7F6E]/30 group`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <p className={`text-[10px] font-bold uppercase tracking-wider ${subTextColor}`}>
            #{task.id?.slice(0, 6) || 'NEW'}
          </p>
          <span className={`text-xs px-2 py-0.5 rounded-full border ${statusInfo.bg} ${statusInfo.border} ${statusInfo.text} font-bold`}>
            {statusInfo.label}
          </span>
        </div>
        <span className={`text-[10px] px-2 py-1 rounded-lg border font-bold uppercase ${getPriorityColor(task.priority)}`}>
          {getPriorityLabel(task.priority)}
        </span>
      </div>

      {/* Category */}
      <div className="mb-3">
        <span className={`text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-[#4C7F6E]' : 'text-[#4C7F6E]'}`}>
          {getCategoryLabel(task.category)}
        </span>
      </div>

      {/* Title */}
      <h3 className={`text-lg font-bold mb-4 line-clamp-2 ${headingColor} group-hover:text-[#4C7F6E] transition-colors`}>
        {task.title}
      </h3>

      {/* Footer */}
      <div className="space-y-3">
        {/* Assignee */}
        {primaryAssignee && (
          <div className={`flex items-center gap-3 p-2.5 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
            <Avatar userId={primaryAssignee} size="sm" className="ring-2 ring-[#4C7F6E]/20" />
            <div className="flex flex-col min-w-0">
              <span className={`text-[10px] uppercase font-bold tracking-wider ${subTextColor}`}>Исполнитель</span>
              <UserNickname userId={primaryAssignee} className={`text-xs font-medium truncate ${headingColor}`} />
            </div>
          </div>
        )}

        {/* Соисполнители */}
        {coExecutors.length > 0 && (
          <div className={`flex items-center gap-2 p-2.5 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
            <div className="flex -space-x-2">
              {coExecutors.slice(0, 3).map((userId, idx) => (
                <Avatar key={idx} userId={userId} size="sm" className={`ring-2 ${theme === 'dark' ? 'ring-[#0b1015]' : 'ring-white'}`} />
              ))}
              {coExecutors.length > 3 && (
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold ${theme === 'dark' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'}`}>
                  +{coExecutors.length - 3}
                </div>
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <span className={`text-[10px] uppercase font-bold tracking-wider ${subTextColor}`}>Соисполнители</span>
              <div className="flex gap-1">
                {coExecutors.slice(0, 2).map((userId, idx) => (
                  <UserNickname key={idx} userId={userId} className={`text-xs font-medium truncate ${headingColor}`} />
                ))}
                {coExecutors.length > 2 && (
                  <span className={`text-xs ${subTextColor}`}>+{coExecutors.length - 2}</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Deadline */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5">
          <div className="flex items-center gap-2">
            <Calendar size={14} className={subTextColor} />
            <span className={`text-xs font-bold ${headingColor}`}>
              {task.dueDate ? formatDate(new Date(task.dueDate), 'dd.MM.yyyy') : '—'}
            </span>
          </div>
          {task.dueTime && (
            <div className="flex items-center gap-2">
              <Clock size={14} className={subTextColor} />
              <span className={`text-xs font-bold ${headingColor}`}>
                {task.dueTime}
              </span>
            </div>
          )}
        </div>

        {/* Timer or Completion Info */}
        {/* Баннер о максимальном количестве продлений */}
        {isMaxExtensionsReached && !isTaskCompleted && (
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-red-500/10 border border-red-500/20">
            <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
            <span className="text-[10px] font-bold text-red-400 leading-tight">
              Достигнуто макс. кол-во продлений! Обратитесь к DM или автору.
            </span>
          </div>
        )}

        {/* Информация о продлении дедлайна */}
        {!isTaskCompleted && task.deadlineExtensions > 0 && (
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#4C7F6E]/10 border border-[#4C7F6E]/20">
            <RefreshCw size={14} className="text-[#4C7F6E] flex-shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className={`text-[10px] uppercase font-bold tracking-wider ${subTextColor}`}>
                Дедлайн продлён
              </span>
              <span className={`text-xs font-medium ${subTextColor}`}>
                {task.deadlineExtensions}/10 раз
                {task.originalDueDate && (
                  <span className="text-[10px] ml-1 opacity-70">
                    (был: {formatDate(new Date(task.originalDueDate), 'dd.MM')})
                  </span>
                )}
              </span>
            </div>
          </div>
        )}

        {!isTaskCompleted && task.dueDate && task.dueTime ? (
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#4C7F6E]/5 border border-[#4C7F6E]/20">
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-[#4C7F6E]" />
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#4C7F6E]">
                До дедлайна
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-[#4C7F6E]">
              <CountdownTimer deadline={`${task.dueDate}T${task.dueTime}`} />
            </span>
          </div>
        ) : isTaskCompleted && completionDate ? (
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#4C7F6E]/10 border border-[#4C7F6E]/20">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-[#4C7F6E]" />
              <span className={`text-[10px] uppercase font-bold tracking-wider text-[#4C7F6E]`}>
                Завершено
              </span>
            </div>
            <span className={`text-xs font-mono font-bold text-[#4C7F6E]`}>
              {formatDate(new Date(completionDate), 'dd.MM.yyyy HH:mm')}
            </span>
          </div>
        ) : null}

        {/* Quick Actions */}
        <div className="flex items-center gap-2 pt-2 border-t border-white/5">
          {/* Кнопка завершения задачи для исполнителя/соисполнителя - открывает модальное окно с отчётом */}
          {task.status === 'in_progress' && canComplete && (
            <button
              onClick={(e) => handleAction(e, () => onComplete ? onComplete(task.id!) : onClick())}
              className="p-2 rounded-lg transition-all hover:bg-[#4C7F6E]/20 hover:text-[#4C7F6E]"
              title="Выполнено"
            >
              <CheckCircle2 size={16} className="text-[#4C7F6E]" />
            </button>
          )}
          {/* Кнопка смены статуса для остальных случаев (только для админа) */}
          {onMove && isAdmin && task.status !== 'in_progress' && (
            <button
              onClick={(e) => handleAction(e, () => onMove(task.id!, nextStatus))}
              className="p-2 rounded-lg transition-all hover:bg-blue-500/10 hover:text-blue-500"
              title={`Сменить статус на: ${statusInfo.label}`}
            >
              {getNextStatusIcon(nextStatus)}
            </button>
          )}
          <button
            onClick={(e) => handleAction(e, () => onCopyLink(task.id!))}
            className="p-2 rounded-lg transition-all hover:bg-[#4C7F6E]/10 hover:text-[#4C7F6E]"
            title="Поделиться"
          >
            <Share2 size={16} />
          </button>
          {canEdit && (
            <>
              <button
                onClick={(e) => handleAction(e, () => onEdit(task))}
                className="p-2 rounded-lg transition-all hover:bg-blue-500/10 hover:text-blue-500"
                title="Редактировать"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={(e) => handleAction(e, () => onDelete(task.id!))}
                className="p-2 rounded-lg transition-all hover:bg-red-500/10 hover:text-red-500"
                title="Удалить"
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
