import { useState, useEffect } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { Task, TaskStatus, TaskPriority, TaskCategory, TASK_CATEGORIES, TaskLink, TEAM_MEMBERS } from '@/types'
import { X, Save, Plus, Trash2, Calendar, Clock, Target, User, Link2, Users, Tag, AlertTriangle, CheckCircle } from 'lucide-react'
import { format, addHours, addDays } from 'date-fns'
import Avatar from '@/components/Avatar'
import { UserNickname } from '@/components/UserNickname'
import { getUserNicknameSync } from '@/utils/userUtils'
import { MultiSelect, SelectOption } from '@/components/Call/MultiSelect'
import { CATEGORY_ICONS } from './categoryIcons'

interface TaskFormProps {
  task: Task | null
  onClose: () => void
  onSave: (task: Partial<Task>) => Promise<void>
}

interface LinkInput {
  id: string
  url: string
  name: string
}

export const TaskForm = ({ task, onClose, onSave }: TaskFormProps) => {
  const { theme } = useThemeStore()
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<Task>>({
    title: '',
    description: '',
    category: 'trading',
    priority: 'medium',
    status: 'in_progress',
    assignedTo: [],
    coExecutors: [],
    dueDate: '',
    dueTime: '',
    expectedResult: '',
    links: []
  })
  const [linkInputs, setLinkInputs] = useState<LinkInput[]>([])

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        category: task.category || 'trading',
        priority: task.priority || 'medium',
        status: task.status || 'in_progress',
        assignedTo: task.assignedTo || [],
        coExecutors: task.coExecutors || [],
        dueDate: task.dueDate || '',
        dueTime: task.dueTime || '',
        expectedResult: task.expectedResult || '',
        links: task.links || []
      })

      const parsedLinks = task.links?.map(link => ({
        id: link.id || crypto.randomUUID(),
        url: link.url || '',
        name: link.name || ''
      })) || []
      setLinkInputs(parsedLinks.length > 0 ? parsedLinks : [{ id: crypto.randomUUID(), url: '', name: '' }])

      if (task.dueDate && task.dueTime) {
        setFormData(prev => ({
          ...prev,
          dueDate: task.dueDate,
          dueTime: task.dueTime
        }))
      } else {
        const now = new Date()
        setFormData(prev => ({
          ...prev,
          dueDate: format(now, 'yyyy-MM-dd'),
          dueTime: format(now, 'HH:mm')
        }))
      }
    } else {
      setFormData({
        title: '',
        description: '',
        category: 'trading',
        priority: 'medium',
        status: 'in_progress',
        assignedTo: [],
        coExecutors: [],
        dueDate: format(new Date(), 'yyyy-MM-dd'),
        dueTime: format(new Date(), 'HH:mm'),
        expectedResult: '',
        links: []
      })
      setLinkInputs([{ id: crypto.randomUUID(), url: '', name: '' }])
    }
  }, [task])

  if (!task && !user) return null

  const handleAddLinkInput = () => {
    if (linkInputs.length < 10) {
      setLinkInputs([...linkInputs, { id: crypto.randomUUID(), url: '', name: '' }])
    }
  }

  const handleRemoveLinkInput = (index: number) => {
    const newLinkInputs = linkInputs.filter((_, i) => i !== index)
    setLinkInputs(newLinkInputs)
  }

  const handleLinkInputChange = (index: number, field: keyof LinkInput, value: string) => {
    const newLinkInputs = [...linkInputs]
    newLinkInputs[index] = { ...newLinkInputs[index], [field]: value }
    setLinkInputs(newLinkInputs)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const formattedLinks: TaskLink[] = linkInputs
        .filter(link => !(link.url.trim() === '' && link.name.trim() === ''))
        .map(link => ({ id: link.id, url: link.url.trim(), name: link.name.trim() }))

      const data = {
        ...formData,
        links: formattedLinks,
        updatedAt: new Date().toISOString()
      } as Partial<Task>

      if (!task) {
        data.createdBy = user?.id || ''
        data.createdAt = new Date().toISOString()
      }

      await onSave(data)
    } catch (error) {
      console.error('Error saving task:', error)
    } finally {
      setLoading(false)
    }
  }

  const bgColor = theme === 'dark' ? 'bg-[#0f141a]' : 'bg-white'
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const inputBg = theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
  const subTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500'

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 overflow-y-auto">
      <div className={`${bgColor} w-full max-w-2xl max-h-[calc(100vh-32px)] rounded-3xl overflow-hidden shadow-2xl border mt-4 ${theme === 'dark' ? 'border-white/10' : 'border-gray-100'}`}>
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className={`text-xl font-black tracking-tight ${textColor}`}>
            {task ? 'Редактировать задачу' : 'Создать задачу'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[calc(100vh-180px)] overflow-y-auto custom-scrollbar">
          {task && (
            <div className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/5">
              <div className="flex items-center gap-3">
                <Avatar userId={task.createdBy} size="md" />
                <div>
                  <UserNickname userId={task.createdBy} className={`text-sm font-bold ${textColor}`} />
                  <p className={`text-[10px] uppercase font-bold tracking-widest ${subTextColor}`}>Автор задачи</p>
                </div>
              </div>
              {task.assignedTo && task.assignedTo.length > 0 && (
                <div className="flex items-center gap-2">
                  <Avatar userId={task.assignedTo[0]} size="sm" />
                  <UserNickname userId={task.assignedTo[0]} className={`text-sm ${subTextColor}`} />
                </div>
              )}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold flex items-center gap-2" style={{ color: '#4C7F6E' }}>Название задачи</label>
            <input
              type="text"
              placeholder="Введите название задачи"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full px-4 py-3 rounded-xl border focus:ring-2 outline-none transition-all ${inputBg} ${textColor}`}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Категория */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold flex items-center gap-2" style={{ color: '#4C7F6E' }}>Категория</label>
              {(() => {
                const categoryColorMap: Record<string, string> = {
                  green: 'bg-emerald-500',
                  blue: 'bg-blue-500',
                  red: 'bg-red-500',
                  purple: 'bg-purple-500'
                }
                const catOptions: SelectOption[] = Object.entries(TASK_CATEGORIES).map(([key, value]) => {
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
                    value={formData.category ? [formData.category] : []}
                    onChange={(values) => setFormData({ ...formData, category: (values[0] || 'trading') as TaskCategory })}
                    options={catOptions}
                    placeholder="Категория"
                    searchable={false}
                    icon={<Tag size={16} />}
                    singleSelect={true}
                  />
                )
              })()}
            </div>

            {/* Приоритет */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold flex items-center gap-2" style={{ color: '#4C7F6E' }}>Приоритет</label>
              {(() => {
                const prioOptions: SelectOption[] = [
                  { value: 'low', label: 'Низкий', icon: <span className="text-gray-400">●</span> },
                  { value: 'medium', label: 'Средний', icon: <span className="text-yellow-500">●</span> },
                  { value: 'high', label: 'Высокий', icon: <span className="text-orange-500">●</span> },
                  { value: 'urgent', label: 'Срочный', icon: <span className="text-red-500">●</span> }
                ]
                return (
                  <MultiSelect
                    value={formData.priority ? [formData.priority] : []}
                    onChange={(values) => setFormData({ ...formData, priority: (values[0] || 'medium') as TaskPriority })}
                    options={prioOptions}
                    placeholder="Приоритет"
                    searchable={false}
                    icon={<AlertTriangle size={16} />}
                    singleSelect={true}
                  />
                )
              })()}
            </div>
          </div>

          {/* Статус показывается только при редактировании существующей задачи */}
          {task && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold flex items-center gap-2" style={{ color: '#4C7F6E' }}>Статус</label>
                {(() => {
                  const statusOpts: SelectOption[] = [
                    { value: 'in_progress', label: 'В работе', icon: <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse" /> },
                    { value: 'completed', label: 'Выполнено', icon: <div className="w-4 h-4 rounded-full bg-emerald-500" /> },
                    { value: 'closed', label: 'Закрыто', icon: <div className="w-4 h-4 rounded-full bg-gray-500" /> }
                  ]
                  return (
                    <MultiSelect
                      value={formData.status ? [formData.status] : []}
                      onChange={(values) => setFormData({ ...formData, status: (values[0] || 'in_progress') as TaskStatus })}
                      options={statusOpts}
                      placeholder="Статус"
                      searchable={false}
                      icon={<CheckCircle size={16} />}
                      singleSelect={true}
                    />
                  )
                })()}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold flex items-center gap-2" style={{ color: '#4C7F6E' }}>
                <Calendar size={14} /> Дедлайн
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl border focus:ring-2 outline-none transition-all ${inputBg} ${textColor}`}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold flex items-center gap-2" style={{ color: '#4C7F6E' }}>
                <Clock size={14} /> Время
              </label>
              <input
                type="time"
                value={formData.dueTime}
                onChange={(e) => setFormData({ ...formData, dueTime: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl border focus:ring-2 outline-none transition-all ${inputBg} ${textColor}`}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {[
                { label: '1ч', value: 1, type: 'hour' },
                { label: '3ч', value: 3, type: 'hour' },
                { label: '6ч', value: 6, type: 'hour' },
                { label: '12ч', value: 12, type: 'hour' },
                { label: '1д', value: 1, type: 'day' },
                { label: '2д', value: 2, type: 'day' },
                { label: '3д', value: 3, type: 'day' },
                { label: '7д', value: 7, type: 'day' },
              ].map((option) => (
                <button
                  key={`${option.type}-${option.value}`}
                  type="button"
                  onClick={() => {
                    const now = new Date()
                    const newDate = option.type === 'hour'
                      ? addHours(now, option.value)
                      : addDays(now, option.value)
                    setFormData({
                      ...formData,
                      dueDate: format(newDate, 'yyyy-MM-dd'),
                      dueTime: format(newDate, 'HH:mm')
                    })
                  }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${theme === 'dark'
                    ? 'bg-white/5 border-white/10 hover:bg-white/10 text-gray-300'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  +{option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
              <label className="text-xs font-bold flex items-center gap-2" style={{ color: '#4C7F6E' }}>
                <User size={14} /> Исполнитель
              </label>
            {(() => {
                const assigneeOptions: SelectOption[] = TEAM_MEMBERS.map(member => ({
                  value: member.id,
                  label: getUserNicknameSync(member.id),
                  icon: <div className="w-6 h-6"><Avatar userId={member.id} size="sm" className="w-6 h-6" /></div>
                }))

              return (
                <MultiSelect
                  value={formData.assignedTo || []}
                  onChange={(values) => setFormData({ ...formData, assignedTo: values })}
                  options={assigneeOptions}
                  placeholder="Не назначен"
                  searchable={true}
                  icon={<User size={16} />}
                />
              )
            })()}
          </div>

          {/* Соисполнители */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold flex items-center gap-2" style={{ color: '#4C7F6E' }}>
              <Users size={14} /> Соисполнители
            </label>
            {(() => {
              const coExecutorOptions: SelectOption[] = TEAM_MEMBERS
                .filter(member => !formData.assignedTo?.includes(member.id))
                  .map(member => ({
                    value: member.id,
                    label: getUserNicknameSync(member.id),
                    icon: <div className="w-6 h-6"><Avatar userId={member.id} size="sm" className="w-6 h-6" /></div>
                  }))

              return (
                <MultiSelect
                  value={formData.coExecutors || []}
                  onChange={(values) => setFormData({ ...formData, coExecutors: values })}
                  options={coExecutorOptions}
                  placeholder="Не назначены"
                  searchable={true}
                  icon={<Users size={16} />}
                />
              )
            })()}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold flex items-center gap-2" style={{ color: '#4C7F6E' }}>Описание</label>
            <textarea
              rows={3}
              placeholder="Опишите задачу подробнее..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={`w-full px-4 py-3 rounded-xl border focus:ring-2 outline-none transition-all resize-none ${inputBg} ${textColor}`}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold flex items-center gap-2" style={{ color: '#4C7F6E' }}>
              <Target size={14} /> Ожидаемый результат
            </label>
            <textarea
              rows={2}
              placeholder="Какой результат ожидается?"
              value={formData.expectedResult}
              onChange={(e) => setFormData({ ...formData, expectedResult: e.target.value })}
              className={`w-full px-4 py-3 rounded-xl border focus:ring-2 outline-none transition-all resize-none ${inputBg} ${textColor}`}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold flex items-center gap-2" style={{ color: '#4C7F6E' }}>
              <Link2 size={14} /> Ссылки
            </label>
            {linkInputs.map((linkInput, index) => (
              <div key={linkInput.id} className="flex gap-2">
                <input
                  type="text"
                  placeholder="URL"
                  value={linkInput.url}
                  onChange={(e) => handleLinkInputChange(index, 'url', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border focus:ring-2 outline-none transition-all ${inputBg} ${textColor}`}
                />
                <input
                  type="text"
                  placeholder="Название"
                  value={linkInput.name}
                  onChange={(e) => handleLinkInputChange(index, 'name', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border focus:ring-2 outline-none transition-all ${inputBg} ${textColor}`}
                />
                {linkInputs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveLinkInput(index)}
                    className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
            {linkInputs.length < 10 && (
              <button
                type="button"
                onClick={handleAddLinkInput}
                className="w-full px-4 py-3 mt-2 rounded-xl border border-dashed text-[#4C7F6E] hover:bg-[#4C7F6E]/10 transition-all flex items-center justify-center gap-2"
                style={{ borderColor: '#4C7F6E' }}
              >
                <Plus className="w-5 h-5" /> Добавить ссылку
              </button>
            )}
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${theme === 'dark' ? 'bg-white/5 text-gray-400 hover:bg-white/10' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 disabled:opacity-50 text-white rounded-xl font-bold shadow-lg transition-all active:scale-95"
              style={{ backgroundColor: '#4C7F6E', boxShadow: '0 0 0 0 rgba(76,127,110,0.4)' }}
            >
              {loading ? <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> : <Save className="w-4 h-4" />}
              {task ? 'Обновить задачу' : 'Создать задачу'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
