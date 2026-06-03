import { useState } from 'react'
import { useAdminStore } from '@/store/adminStore'
import { useThemeStore } from '@/store/themeStore'
import { Task } from '@/types'
import { Archive, Trash2, RotateCcw, Calendar, Clock } from 'lucide-react'
import { formatDate } from '@/utils/dateUtils'

interface TaskArchiveProps {
  tasks: Task[]
  onRestore: (taskId: string) => Promise<void>
  onDelete: (taskId: string) => Promise<void>
  onEdit: (task: Task) => void
}

export const TaskArchive = ({ tasks, onRestore, onDelete }: TaskArchiveProps) => {
  const { isAdmin } = useAdminStore()
  const { theme } = useThemeStore()

  const [deleting, setDeleting] = useState<string | null>(null)

  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const borderColor = theme === 'dark' ? 'border-gray-800' : 'border-gray-300'

  const canDelete = isAdmin
  const canRestore = isAdmin

  const getArchiveReason = (task: Task) => {
    const now = new Date()
    const deadline = new Date(`${task.dueDate}T${task.dueTime}`)
    const daysSinceDeadline = (now.getTime() - deadline.getTime()) / (1000 * 60 * 60 * 24)

    if (task.status === 'closed' && task.closedAt) {
      const hoursSinceClosed = (now.getTime() - new Date(task.closedAt).getTime()) / (1000 * 60 * 60)
      if (hoursSinceClosed > 12) {
        return {
          reason: 'Закрыта более 12 часов назад',
          date: task.closedAt,
        }
      }
    }

    if (daysSinceDeadline > 3) {
      return {
        reason: 'Дедлайн прошел более 3 дней',
        date: task.dueDate,
      }
    }

    return {
      reason: 'В архиве',
      date: task.archivedAt || task.createdAt,
    }
  }

  const getDaysUntilDeletion = (task: Task) => {
    if (!task.archivedAt) return null
    const now = new Date()
    const archiveDate = new Date(task.archivedAt)
    const daysSinceArchive = (now.getTime() - archiveDate.getTime()) / (1000 * 60 * 60 * 24)
    const daysLeft = Math.max(0, 7 - daysSinceArchive)
    return Math.round(daysLeft)
  }

  const handleRestore = async (taskId: string) => {
    await onRestore(taskId)
  }

  const handleDelete = async (taskId: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту задачу?')) return

    setDeleting(taskId)
    try {
      await onDelete(taskId)
    } catch (error) {
      console.error('Error deleting task:', error)
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="space-y-4">
      {tasks.length === 0 ? (
        <div className="text-center py-10">
          <Archive className={`w-16 h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-700' : 'text-gray-300'}`} />
          <p className={`text-lg ${headingColor}`}>Архив пуст</p>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
            Задачи автоматически попадают в архив через определенное время
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map(task => {
            const archiveReason = getArchiveReason(task)
            const daysUntilDeletion = getDaysUntilDeletion(task)
            return (
              <div
                key={task.id}
                className={`p-4 rounded-xl border ${borderColor} ${theme === 'dark' ? 'bg-[#0f0f0f]' : 'bg-gray-50'}`}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-mono ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
                        #{task.id.slice(0, 6)}
                      </span>
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-medium border ${
                        task.status === 'closed'
                          ? theme === 'dark' ? 'bg-gray-500/20 text-gray-400 border-gray-500/30' : 'bg-gray-50 text-gray-700 border-gray-200'
                          : theme === 'dark' ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        {task.status === 'closed' ? 'Закрыто' : 'Просрочена'}
                      </span>
                    </div>
                    <h3 className={`text-sm font-bold ${headingColor} break-words line-clamp-2`}>
                      {task.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {canRestore && (
                      <button
                        onClick={() => handleRestore(task.id)}
                        className={`p-1.5 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-blue-500/20 text-blue-400' : 'hover:bg-blue-50 text-blue-600'}`}
                        title="Восстановить"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    )}
                    {canDelete && (
                      <button
                        onClick={() => handleDelete(task.id)}
                        disabled={deleting === task.id}
                        className={`p-1.5 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-50 text-red-600'}`}
                        title="Удалить"
                      >
                        {deleting === task.id ? (
                          <div className="w-3.5 h-3.5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-2 text-xs mb-3">
                  <div className={`flex items-center gap-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                    <Archive className="w-3.5 h-3.5" />
                    <span className="truncate">{archiveReason.reason}</span>
                  </div>
                  <div className={`flex items-center gap-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(new Date(archiveReason.date), 'dd MMM yyyy, HH:mm')}</span>
                  </div>
                  <div className={`flex items-center gap-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                    <Clock className="w-3.5 h-3.5" />
                    <span>Дедлайн: {formatDate(new Date(task.dueDate), 'dd MMM yyyy')} {task.dueTime}</span>
                  </div>
                </div>

                {daysUntilDeletion !== null && (
                  <div className={`flex items-center gap-2 p-2 rounded-lg ${theme === 'dark' ? 'bg-rose-500/10 border-rose-500/20' : 'bg-rose-50 border-rose-200'} border`}>
                    <Clock className={`w-3.5 h-3.5 ${theme === 'dark' ? 'text-rose-400' : 'text-rose-600'}`} />
                    <span className={`text-xs ${theme === 'dark' ? 'text-rose-400' : 'text-rose-600'}`}>
                      Удаление через {daysUntilDeletion} {daysUntilDeletion === 1 ? 'день' : daysUntilDeletion < 5 ? 'дня' : 'дней'}
                    </span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
