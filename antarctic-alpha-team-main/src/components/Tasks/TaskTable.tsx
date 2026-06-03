// TaskTable временно отключен - таблица заменена на карточки
// TODO: Удалить этот компонент

import { Task } from '@/types'

interface TaskTableProps {
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
}

export const TaskTable = (_props: TaskTableProps) => {
  return (
    <div className="p-4 text-center text-gray-500">
      <p>Таблица временно недоступна</p>
      <p className="text-sm">Используйте карточки для просмотра задач</p>
    </div>
  )
}
