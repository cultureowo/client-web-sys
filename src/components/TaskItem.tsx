import type { CSSProperties } from "react";
import { Trash2, Check, Flag } from "lucide-react";
import { priorityLabels } from "../types/task";
import type { Task } from "../types/task";
export interface TaskActions {
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}
export function TaskItem({
  task,
  onToggle,
  onDelete,
}: { task: Task } & TaskActions) {
  return (
    <li className={`task${task.completed ? " task--completed" : ""}`}>
      <input
        className="task__checkbox"
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        aria-label={`Виконано: ${task.title}`}
      />
      <div className="task__content">
        <h3>{task.title}</h3>
        {task.description && (
          <p className="task__description">{task.description}</p>
        )}
        <div className="task__meta">
          <span
            className="task__category"
            style={{ "--category-color": task.categoryColor } as CSSProperties}
          >
            <span />
            {task.category}
          </span>
          <span className={`task__priority task__priority--${task.priority}`}>
            <Flag size={12} />
            {priorityLabels[task.priority]}
          </span>
          {task.completed && (
            <span className="task__status">
              <Check size={13} />
              Виконано
            </span>
          )}
        </div>
      </div>
      <button
        className="task__delete"
        onClick={() => onDelete(task.id)}
        aria-label={`Видалити: ${task.title}`}
        title="Видалити завдання"
      >
        <Trash2 size={17} />
      </button>
    </li>
  );
}
