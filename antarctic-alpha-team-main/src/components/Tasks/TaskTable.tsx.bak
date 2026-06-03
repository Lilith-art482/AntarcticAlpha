import { Task, TASK_CATEGORIES, TASK_STATUSES } from '@/types'
import { useUsers } from '@/hooks/useUsers'
import { formatDate } from '@/utils/dateUtils'
import { Clock, Pencil, Trash2 } from 'lucide-react'
import { useThemeStore } from '@/store/themeStore'

interface TaskTableProps {
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
}

export const TaskTable = ({ tasks, onEdit, onDelete }: TaskTableProps) => {
  const { theme } = useThemeStore()
  const { users } = useUsers()

  const getUser = (userId: string) => users.find(u => u.id === userId)
  const getUserName = (userId: string) => {
    const user = getUser(userId)
    return user ? user.name : 'Unknown'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_progress': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
      case 'completed': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
      case 'closed': return 'bg-slate-500/10 text-slate-400 border-slate-500/20'
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
    }
  }

  const getCategoryColor = (categoryId: string) => {
    const colors: Record<string, string> = {
      trading: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      research: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      content: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      stream: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
      other: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
      learning: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    }
    return colors[categoryId] || colors.other
  }

  if (tasks.length === 0) {
    return (
      <div className={`text-center py-20 rounded-3xl border-2 border-dashed ${theme === 'dark' ? 'border-white/5 text-gray-500' : 'border-gray-200 text-gray-500'}`}>
        <div className="flex flex-col items-center gap-3">
          <div className={`p-4 rounded-full ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'}`}>
            <Clock className="w-8 h-8 opacity-50" />
          </div>
          <p>Задач пока нет</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-separate border-spacing-y-3 -mt-3">
        <thead>
          <tr className={`text-xs uppercase tracking-wider text-left ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
            <th className="px-6 py-2 font-medium w-20">#ID</th>
            <th className="px-6 py-2 font-medium">Задача</th>
            <th className="px-6 py-2 font-medium">Категория</th>
            <th className="px-6 py-2 font-medium">Исполнитель</th>
            <th className="px-6 py-2 font-medium text-center">Статус</th>
            <th className="px-6 py-2 font-medium text-right">Действия</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr
              key={task.id}
              className={`group transition-all duration-200 ${theme === 'dark'
                  ? 'bg-[#151a21]/80 hover:bg-[#1a2029] hover:shadow-lg hover:shadow-black/20'
                  : 'bg-white hover:bg-gray-50 hover:shadow-md'
                }`}
            >
              <td className={`px-6 py-5 rounded-l-2xl border-y border-l ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'}`}>
                <span className={`font-mono text-xs opacity-50 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  #{task.id.slice(0, 4)}
                </span>
              </td>

              <td className={`px-6 py-5 border-y ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'}`}>
                <div className="flex flex-col gap-1">
                  <span className={`font-bold text-[15px] ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                    {task.title}
                  </span>
                  <div className="flex items-center gap-2 text-[11px] text-gray-500 font-medium">
                    <Clock className="w-3 h-3" />
                    {task.dueDate ? (
                      <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}>
                        {formatDate(new Date(task.dueDate), 'd MMM')} {task.dueTime ? `, ${task.dueTime}` : ''}
                      </span>
                    ) : (
                      <span>Без срока</span>
                    )}
                  </div>
                </div>
              </td>

              <td className={`px-6 py-5 border-y ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'}`}>
                <span className={`px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-wide uppercase border ${getCategoryColor(task.category)}`}>
                  {TASK_CATEGORIES[task.category]?.label || task.category}
                </span>
              </td>

              <td className={`px-6 py-5 border-y ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'}`}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4E6E49] to-[#3d5639] flex items-center justify-center text-[10px] text-white font-bold shadow-inner">
                    {getUserName(task.mainExecutor || task.assignedTo[0]).charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {getUserName(task.mainExecutor || task.assignedTo[0])}
                    </span>
                    {task.assignedTo.length > 1 && (
                      <span className="text-[10px] text-gray-500">+{task.assignedTo.length - 1} ещё</span>
                    )}
                  </div>
                </div>
              </td>

              <td className={`px-6 py-5 border-y text-center ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'}`}>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wide border ${getStatusColor(task.status)}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${task.status === 'in_progress' ? 'bg-yellow-500 animate-pulse' : task.status === 'completed' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                  {TASK_STATUSES[task.status]?.label || task.status}
                </span>
              </td>

              <td className={`px-6 py-5 rounded-r-2xl border-y border-r text-right ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'}`}>
                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0">
                  <button
                    onClick={() => onEdit(task)}
                    className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-white/10 text-gray-500 hover:text-white' : 'hover:bg-gray-100 text-gray-400 hover:text-gray-900'}`}
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(task.id)}
                    className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-red-500/10 text-gray-500 hover:text-red-400' : 'hover:bg-red-50 text-gray-400 hover:text-red-600'}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
