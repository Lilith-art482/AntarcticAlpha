import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { TaskForm } from '@/components/Tasks/TaskForm'
import { TaskDetails } from '@/components/Tasks/TaskDetails'
import { TaskArchive } from '@/components/Tasks/TaskArchive'
import { getTasks, updateTask, deleteTask, addTask } from '@/services/firestoreService'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { useAdminStore } from '@/store/adminStore'
import { Plus, Archive, Filter, X, Users, Tag, CheckCircle, AlertTriangle } from 'lucide-react'
import { Task, TaskStatus, TaskCategory, TaskPriority, TASK_CATEGORIES, TEAM_MEMBERS } from '@/types'
import { CATEGORY_ICONS } from '@/components/Tasks/categoryIcons'
import { TaskCard } from '@/components/Tasks/TaskCard'
import { useUserNickname } from '@/utils/userUtils'
import { MultiSelect, SelectOption } from '@/components/Call/MultiSelect'
import Avatar from '@/components/Avatar'

export const Tasks = () => {
  const { theme } = useThemeStore()
  const { user } = useAuthStore()
  const { isAdmin: isAdminStore } = useAdminStore()
  const [searchParams] = useSearchParams()
  
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isArchiveOpen, setIsArchiveOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const [openCompleteModal, setOpenCompleteModal] = useState(false) // открыть модальное окно завершения
  
  // Фильтры
  const [filters, setFilters] = useState({
    assignee: '',
    category: '',
    status: '',
    priority: ''
  })
  
  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const subTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500'

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasksData = await getTasks()
        setTasks(tasksData)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching tasks:', error)
        setLoading(false)
      }
    }
    fetchTasks()
  }, [])

  // Обработка открытия задачи по ссылке
  useEffect(() => {
    const taskId = searchParams.get('taskId')
    if (taskId && tasks.length > 0) {
      const task = tasks.find(t => t.id === taskId)
      if (task) {
        setSelectedTask(task)
        window.history.replaceState({}, '', '/tasks')
      }
    }
  }, [searchParams, tasks])

  // Применение фильтров
  useEffect(() => {
    let result = tasks.filter(task => !task.archivedAt)
    
    if (filters.assignee) {
      result = result.filter(task => task.assignedTo?.includes(filters.assignee))
    }
    
    if (filters.category) {
      result = result.filter(task => task.category === filters.category)
    }
    
    if (filters.status) {
      result = result.filter(task => task.status === filters.status)
    }
    
    if (filters.priority) {
      result = result.filter(task => task.priority === filters.priority)
    }
    
    setFilteredTasks(result)
  }, [tasks, filters])

  // Автоматическое закрытие, архивация и продление дедлайнов
  useEffect(() => {
    const processTasks = async () => {
      const now = new Date().getTime()
      const updates: { taskId: string; updates: Partial<Task> }[] = []
      
      for (const task of tasks) {
        // 1. Автозакрытие задач в статусе "Выполнено" через 12 часов
        if (task.status === 'completed' && task.completedAt) {
          const completedTime = new Date(task.completedAt).getTime()
          const hoursSinceCompleted = (now - completedTime) / (1000 * 60 * 60)
          
          if (hoursSinceCompleted >= 12) {
            updates.push({
              taskId: task.id,
              updates: {
                status: 'closed',
                closedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              }
            })
          }
        }
        
        // 1.5. Автопереход "Согласование" → "Выполнено" через 48 часов
        if (task.status === 'approval' && task.approvalStartedAt) {
          const approvalStartTime = new Date(task.approvalStartedAt).getTime()
          const hoursSinceApprovalStart = (now - approvalStartTime) / (1000 * 60 * 60)
          
          if (hoursSinceApprovalStart >= 48) {
            updates.push({
              taskId: task.id,
              updates: {
                status: 'completed',
                completedAt: new Date().toISOString(),
                approvalStartedAt: undefined,
                updatedAt: new Date().toISOString()
              }
            })
          }
        }
        
        // 2. Архивация задач
        // "Выполнено" > 24 часов
        if (task.status === 'completed' && task.completedAt) {
          const completedTime = new Date(task.completedAt).getTime()
          const hoursSinceCompleted = (now - completedTime) / (1000 * 60 * 60)
          
          if (hoursSinceCompleted >= 24) {
            updates.push({
              taskId: task.id,
              updates: {
                archivedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              }
            })
          }
        }
        
        // "Закрыто" > 12 часов
        if (task.status === 'closed' && task.closedAt) {
          const closedTime = new Date(task.closedAt).getTime()
          const hoursSinceClosed = (now - closedTime) / (1000 * 60 * 60)
          
          if (hoursSinceClosed >= 12) {
            updates.push({
              taskId: task.id,
              updates: {
                archivedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              }
            })
          }
        }
        
        // 3. Автопродление дедлайна для просроченных задач (каждые 12 часов, макс 10 раз)
        if ((task.status === 'in_progress' || task.status === 'in_progress_rework') && task.dueDate && task.dueTime) {
          const deadline = new Date(`${task.dueDate}T${task.dueTime}`).getTime()
          const hoursSinceDeadline = (now - deadline) / (1000 * 60 * 60)
          const extensions = task.deadlineExtensions || 0
          
          // Проверяем, нужно ли продлить дедлайн (каждые 12 часов)
          const shouldExtend = hoursSinceDeadline > 0 && extensions < 10
          const lastExtension = task.lastExtensionAt ? new Date(task.lastExtensionAt).getTime() : 0
          const hoursSinceLastExtension = (now - lastExtension) / (1000 * 60 * 60)
          
          if (shouldExtend && hoursSinceLastExtension >= 12) {
            // Продлеваем дедлайн на 12 часов
            const newDeadline = new Date(deadline + 12 * 60 * 60 * 1000)
            const newDueDate = newDeadline.toISOString().split('T')[0]
            const newDueTime = newDeadline.toTimeString().slice(0, 5)
            
            updates.push({
              taskId: task.id,
              updates: {
                dueDate: newDueDate,
                dueTime: newDueTime,
                deadlineExtensions: extensions + 1,
                lastExtensionAt: new Date().toISOString(),
                // Сохраняем оригинальную дату только при первом продлении
                originalDueDate: task.originalDueDate || task.dueDate,
                originalDueTime: task.originalDueTime || task.dueTime,
                updatedAt: new Date().toISOString()
              }
            })
          }
        }
      }
      
      // Применяем все обновления
      for (const updateItem of updates) {
        try {
          await updateTask(updateItem.taskId, updateItem.updates)
          setTasks(prev => prev.map(t => t.id === updateItem.taskId ? { ...t, ...updateItem.updates } : t))
        } catch (error) {
          console.error('Error processing task:', updateItem.taskId, error)
        }
      }
    }
    
    // Запускаем проверку каждые 60 секунд
    const interval = setInterval(processTasks, 60000)
    processTasks() // Запускаем сразу при монтировании
    
    return () => clearInterval(interval)
  }, [tasks])

  const openModal = () => {
    setEditingTask(null)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingTask(null)
  }

  const openTaskDetails = (task: Task) => {
    setSelectedTask(task)
  }

  const closeTaskDetails = () => {
    setSelectedTask(null)
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setSelectedTask(null)
    setIsModalOpen(true)
  }

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId)
      setTasks(tasks.filter(t => t.id !== taskId))
      setSelectedTask(null)
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  // Открыть модальное окно завершения задачи с отчётом
  const handleCompleteTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId)
    if (task) {
      setSelectedTask(task)
      setOpenCompleteModal(true)
    }
  }

  const handleMoveTask = async (taskId: string, newStatus: TaskStatus, skipUpdate: boolean = false) => {
    try {
      const task = tasks.find(t => t.id === taskId)
      if (!task) return
      
      // Проверка прав на изменение статуса
      if (newStatus === 'completed' && !canChangeStatusToCompleted(task)) {
        alert('Только автор или админ может завершить задачу')
        return
      }
      
      if (task.status === 'closed' && newStatus !== 'closed') {
        if (!canChangeStatusFromClosed()) {
          alert('Только админ может открыть закрытую задачу')
          return
        }
      }
      
      if (task.status === 'completed' && newStatus === 'in_progress') {
        if (!canResumeFromCompleted(task)) {
          alert('Только автор или админ может возобновить выполненную задачу')
          return
        }
      }
      
      const updates: Partial<Task> = {
        status: newStatus,
        updatedAt: new Date().toISOString()
      }
      
      // Устанавливаем completedAt или closedAt в зависимости от статуса
      if (newStatus === 'completed') {
        updates.completedAt = new Date().toISOString()
      } else if (newStatus === 'closed') {
        updates.closedAt = new Date().toISOString()
      } else if (newStatus === 'approval') {
        // Начало согласования - сбрасываем completedAt, если был
        updates.completedAt = undefined
        updates.approvalStartedAt = new Date().toISOString()
      }
      
      // Если статус меняется с completed/closed на другой, сбрасываем поля
      if (task.status === 'completed' || task.status === 'closed') {
        if (newStatus === 'in_progress' || newStatus === 'in_progress_rework') {
          updates.completedAt = undefined
          updates.closedAt = undefined
        }
      }
      
      // Если выходим из статуса согласования, сбрасываем approvalStartedAt
      if (task.status === 'approval' && newStatus !== 'approval') {
        updates.approvalStartedAt = undefined
        if (newStatus === 'in_progress_rework') {
          // Запрос на доработку - сбрасываем report
          updates.report = undefined
        }
      }
      
      if (!skipUpdate) {
        await updateTask(taskId, updates)
      }
      setTasks(tasks.map(t => t.id === taskId ? { ...t, ...updates } : t))
    } catch (error) {
      console.error('Error moving task:', error)
    }
  }

  const handleCopyLink = (taskId: string) => {
    const link = `${window.location.origin}/tasks?taskId=${taskId}`
    navigator.clipboard.writeText(link)
      .then(() => {
        console.log('Ссылка скопирована!', link)
      })
      .catch(err => {
        console.error('Не удалось скопировать ссылку: ', err)
      })
  }

  const stats = {
    total: filteredTasks.length,
    inProgress: filteredTasks.filter(t => t.status === 'in_progress' || t.status === 'in_progress_rework').length,
    completed: filteredTasks.filter(t => t.status === 'completed').length,
    inApproval: filteredTasks.filter(t => t.status === 'approval').length,
    overdue: filteredTasks.filter(t => {
      const now = new Date().getTime()
      const deadline = new Date(`${t.dueDate}T${t.dueTime}`).getTime()
      // Не считаем просроченными: completed, closed, approval
      return t.status !== 'completed' && t.status !== 'closed' && t.status !== 'approval' && deadline < now
    }).length
  }

  const statCards = [
    {
      label: 'В работе',
      icon: <div className="w-4 h-4 rounded-full bg-blue-500" />,
      value: stats.inProgress,
      bgClass: 'bg-blue-500/5',
      borderClass: 'border-blue-500/20',
      iconBgClass: 'bg-blue-500/10'
    },
    {
      label: 'На согласовании',
      icon: <div className="w-4 h-4 rounded-full bg-purple-500" />,
      value: stats.inApproval,
      bgClass: 'bg-purple-500/5',
      borderClass: 'border-purple-500/20',
      iconBgClass: 'bg-purple-500/10'
    },
    {
      label: 'Выполнено',
      icon: <div className="w-4 h-4 rounded-full bg-[#4C7F6E]" />,
      value: stats.completed,
      bgClass: 'bg-[#4C7F6E]/5',
      borderClass: 'border-emerald-500/20',
      iconBgClass: 'bg-[#4C7F6E]/10'
    },
    {
      label: 'Просрочено',
      icon: <div className="w-4 h-4 rounded-full bg-red-500" />,
      value: stats.overdue,
      bgClass: 'bg-red-500/5',
      borderClass: 'border-red-500/20',
      iconBgClass: 'bg-red-500/10'
    }
  ]

  const hasActiveFilters = Object.values(filters).some(value => value !== '')

  const clearFilters = () => {
    setFilters({ assignee: '', category: '', status: '', priority: '' })
  }

  const priorityLabels: Record<TaskPriority, string> = {
    low: 'Низкий',
    medium: 'Средний',
    high: 'Высокий',
    urgent: 'Срочный'
  }

  const statusLabels: Record<TaskStatus, string> = {
    in_progress: 'В работе',
    in_progress_rework: 'В работе (ПВ)',
    completed: 'Выполнено',
    approval: 'Согласование',
    closed: 'Закрыто'
  }

  // Проверка, является ли пользователь автором задачи
  const isTaskAuthor = (task: Task) => task.createdBy === user?.id
  
  // Проверка, является ли пользователь админом (по store + роли)
  const isAdmin = isAdminStore || user?.role === 'admin'
  
  // Проверка прав на изменение статуса
  const canChangeStatusToCompleted = (task: Task) => isTaskAuthor(task) || isAdmin
  const canChangeStatusFromClosed = () => isAdmin // Только админ может открыть из закрытого
  const canResumeFromCompleted = (task: Task) => isTaskAuthor(task) || isAdmin
  
  return (
    <div className="flex min-h-screen">
      <div className="w-full space-y-6 p-4 md:p-6">
        {/* Шапка в стиле Analytics */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <h1 className={`flex items-center gap-2 text-2xl md:text-3xl font-black tracking-tight ${headingColor}`}>
              <span style={{ color: '#4C7F6E' }}>
                <Tag size={32} />
              </span>
              Tasks
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={openModal}
              className="flex items-center justify-center w-10 h-10 rounded-xl font-medium transition-all text-white"
              style={{ backgroundColor: '#4C7F6E' }}
              title="Создать задачу"
            >
              <Plus size={20} />
            </button>
            <button
              onClick={() => setIsArchiveOpen(!isArchiveOpen)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                isArchiveOpen
                  ? theme === 'dark'
                    ? 'bg-amber-600 hover:bg-amber-500 text-white'
                    : 'bg-amber-500 hover:bg-amber-600 text-white'
                  : theme === 'dark'
                    ? 'bg-white/10 hover:bg-white/20 text-gray-300'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              title="Показать/скрыть архив"
            >
              <Archive size={18} />
              <span>Архив</span>
            </button>
          </div>
        </div>

        {/* Статистические карточки */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((item, idx) => (
            <div
              key={idx}
              className={`relative overflow-hidden rounded-2xl p-5 border transition-all duration-300 hover:shadow-lg group ${theme === 'dark'
                  ? `${item.bgClass} ${item.borderClass} hover:border-opacity-50`
                  : 'bg-white border-gray-100 hover:border-blue-500/20'
                }`}
            >
              <div className="flex justify-between items-start mb-4">
                <span className={`text-[10px] font-bold uppercase tracking-wider ${subTextColor}`}>
                  {item.label}
                </span>
                <div className={`p-2 rounded-xl transition-colors ${theme === 'dark' ? 'bg-white/5 group-hover:bg-white/10' : 'bg-gray-100 group-hover:bg-gray-200'}`}>
                  {typeof item.icon === 'string' ? (
                    <span className="text-lg">{item.icon}</span>
                  ) : (
                    item.icon
                  )}
                </div>
              </div>
              <div className={`text-3xl font-black ${headingColor}`}>
                {item.value}
              </div>
            </div>
          ))}
        </div>

        {/* Фильтры */}
        <div className={`p-4 rounded-2xl border ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Filter size={18} className={subTextColor} />
              <h3 className={`text-sm font-black uppercase tracking-wider ${subTextColor}`}>Фильтры</h3>
            </div>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${theme === 'dark' ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
              >
                <X size={14} />
                Очистить
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Фильтр по исполнителю - MultiSelect как в Analytics */}
            {(() => {
              const assigneeOptions: SelectOption[] = TEAM_MEMBERS.map(member => ({
                value: member.id,
                label: useUserNickname(member.id),
                icon: <div className="w-6 h-6"><Avatar user={member} size="sm" className="w-6 h-6" /></div>
              }))

              return (
                <MultiSelect
                  value={filters.assignee ? [filters.assignee] : []}
                  onChange={(values) => setFilters({ ...filters, assignee: values[0] || '' })}
                  options={assigneeOptions}
                  placeholder="Все исполнители"
                  searchable={true}
                  icon={<Users size={16} />}
                />
              )
            })()}

            {/* Фильтр по категории */}
            {(() => {
              const categoryColorMap: Record<string, string> = {
                green: 'bg-emerald-500',
                blue: 'bg-blue-500',
                red: 'bg-red-500',
                purple: 'bg-purple-500'
              }
              const categoryOptions: SelectOption[] = Object.entries(TASK_CATEGORIES).map(([key, value]) => {
                const IconComponent = CATEGORY_ICONS[key as TaskCategory]
                return {
                  value: key,
                  label: value.label,
                  icon: IconComponent ? <IconComponent className="w-4 h-4" /> : <Tag className="w-4 h-4" />,
                  chip: categoryColorMap[value.color] || 'bg-gray-500'
                }
              })

              return (
                <MultiSelect
                  value={filters.category ? [filters.category] : []}
                  onChange={(values) => setFilters({ ...filters, category: values[0] as TaskCategory || '' })}
                  options={categoryOptions}
                  placeholder="Все категории"
                  searchable={false}
                  icon={<Tag size={16} />}
                />
              )
            })()}

            {/* Фильтр по статусу */}
            {(() => {
              const statusOptions: SelectOption[] = Object.entries(statusLabels).map(([key, value]) => ({
                value: key,
                label: value,
                icon: key === 'in_progress' ? <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse" /> :
                      key === 'in_progress_rework' ? <div className="w-4 h-4 rounded-full bg-orange-500 animate-pulse" /> :
                      key === 'completed' ? <div className="w-4 h-4 rounded-full bg-violet-500" /> :
                      key === 'approval' ? <div className="w-4 h-4 rounded-full bg-[#4C7F6E]" /> :
                      key === 'closed' ? <div className="w-4 h-4 rounded-full bg-gray-500" /> : null
              }))

              return (
                <MultiSelect
                  value={filters.status ? [filters.status] : []}
                  onChange={(values) => setFilters({ ...filters, status: values[0] as TaskStatus || '' })}
                  options={statusOptions}
                  placeholder="Все статусы"
                  searchable={false}
                  icon={<CheckCircle size={16} />}
                />
              )
            })()}

            {/* Фильтр по приоритету */}
            {(() => {
              const priorityOptions: SelectOption[] = Object.entries(priorityLabels).map(([key, value]) => ({
                value: key,
                label: value,
                icon: key === 'low' ? <span className="text-gray-400">●</span> :
                      key === 'medium' ? <span className="text-yellow-500">●</span> :
                      key === 'high' ? <span className="text-orange-500">●</span> :
                      <span className="text-red-500">●</span>,
                chip: key
              }))

              return (
                <MultiSelect
                  value={filters.priority ? [filters.priority] : []}
                  onChange={(values) => setFilters({ ...filters, priority: values[0] as TaskPriority || '' })}
                  options={priorityOptions}
                  placeholder="Все приоритеты"
                  searchable={false}
                  icon={<AlertTriangle size={16} />}
                />
              )
            })()}
          </div>
        </div>

        {/* Список задач или архив */}
        {isArchiveOpen ? (
          <TaskArchive
            tasks={tasks.filter(t => t.archivedAt)}
            onRestore={async (taskId) => {
              await updateTask(taskId, { archivedAt: undefined, updatedAt: new Date().toISOString() })
              setTasks(tasks.map(t => t.id === taskId ? { ...t, archivedAt: undefined } : t))
            }}
            onDelete={async (taskId) => {
              await deleteTask(taskId)
              setTasks(tasks.filter(t => t.id !== taskId))
            }}
            onEdit={handleEditTask}
          />
        ) : (
          <>
            {loading ? (
              <div className="text-center py-10">
                <p className={subTextColor}>Загрузка задач...</p>
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className={`p-10 text-center rounded-2xl border border-dashed ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'}`}>
                <p className={subTextColor}>{hasActiveFilters ? 'Задачи не найдены по выбранным фильтрам' : 'Задач не найдено'}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
                {filteredTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onClick={() => openTaskDetails(task)}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                    onCopyLink={handleCopyLink}
                    onMove={handleMoveTask}
                    onComplete={handleCompleteTask}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Модальное окно создания/редактирования */}
        {isModalOpen && (
          <TaskForm
            task={editingTask}
            onClose={closeModal}
            onSave={async (taskData) => {
              if (editingTask) {
                await updateTask(editingTask.id, taskData)
                setTasks(tasks.map(t => t.id === editingTask.id ? { ...t, ...taskData } : t))
              } else {
                // Добавляем createdBy если не существует
                const taskWithCreator = {
                  ...taskData,
                  createdBy: taskData.createdBy || user?.id || ''
                }
                const newTaskId = await addTask(taskWithCreator as Omit<Task, 'id'>)
                // Добавляем новую задачу в локальный стейт
                const newTask: Task = {
                  id: newTaskId,
                  ...taskWithCreator,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  archivedAt: undefined
                } as Task
                setTasks([newTask, ...tasks])
              }
              closeModal()
            }}
          />
        )}

        {/* Модальное окно деталей задачи */}
        {selectedTask && (
          <TaskDetails
            task={selectedTask}
            onClose={() => { closeTaskDetails(); setOpenCompleteModal(false) }}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onMove={handleMoveTask}
            onCopyLink={handleCopyLink}
            openCompleteModal={openCompleteModal}
          />
        )}
      </div>
    </div>
  )
}

export default Tasks
