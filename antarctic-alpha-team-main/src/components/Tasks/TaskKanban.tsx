// TaskKanban временно отключен - компонент использует старую структуру с этапами
// TODO: Переписать или удалить этот компонент

import { Task } from '@/types'

interface TaskKanbanProps {
  tasks: Task[]
  onUpdate: () => void
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
}

export const TaskKanban = (_props: TaskKanbanProps) => {
  return (
    <div className="p-4 text-center text-gray-500">
      <p>Канбан-доска временно недоступна</p>
      <p className="text-sm">Используйте карточки для просмотра задач</p>
    </div>
  )
}
