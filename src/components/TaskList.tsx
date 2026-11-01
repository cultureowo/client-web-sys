import { BookOpenCheck } from 'lucide-react'
import type { Task } from '../types/task'
import { TaskItem } from './TaskItem'
import type { TaskActions } from './TaskItem'
export function TaskList({ tasks, total, onToggle, onDelete }: { tasks: Task[]; total: number } & TaskActions) {
  if (!tasks.length) return <div className="empty"><BookOpenCheck size={38} /><h3>{total ? 'За цим фільтром завдань немає.' : 'Завдань поки немає.'}</h3><p>{total ? 'Спробуй змінити фільтр або пошуковий запит.' : 'Додай перше навчальне завдання — і починай свій шлях.'}</p></div>
  return <ul className="task-list">{tasks.map(task => <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />)}</ul>
}
