import type { CSSProperties } from "react";
import { Trash2, Check, Flag, Pencil, Eye } from "lucide-react";
import { priorityLabels } from "../types/task";
import type { Task } from "../types/task";
import { useTaskContext } from "../hooks/useTaskContext";
import "./TaskItem.scss";
export function TaskItem({ task }: { task: Task }) {
  const {
    toggleTask,
    requestDelete,
    startEditing,
    pending,
    mutation,
    selectTask,
  } = useTaskContext();
  const deleting = pending?.tasks.some((item) => item.id === task.id) ?? false;
  const disabled = !!pending || !!mutation;
  return (
    <li
      className={`task${task.completed ? " task--completed" : ""}${deleting ? " task--pending" : ""}`}
    >
      <input
        className="task__checkbox"
        type="checkbox"
        checked={task.completed}
        disabled={disabled}
        onChange={() => toggleTask(task.id)}
        aria-label={`Виконано: ${task.title}`}
      />
      <div className="task__content">
        <h3>{task.title}</h3>
        {task.origin === "session" && (
          <p className="task__session">Створено в поточній сесії</p>
        )}
        {deleting && (
          <p className="task__pending" role="status">
            Буде видалено…
          </p>
        )}
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
      <div className="task__actions">
        <button
          className="task__edit"
          disabled={disabled}
          onClick={() => selectTask(task.id)}
          aria-label={`Деталі: ${task.title}`}
          title="Деталі завдання"
        >
          <Eye size={17} />
        </button>
        <button
          className="task__edit"
          disabled={disabled}
          onClick={() => startEditing(task.id)}
          aria-label={`Редагувати: ${task.title}`}
          title="Редагувати завдання"
        >
          <Pencil size={17} />
        </button>
        <button
          disabled={disabled}
          className="task__delete"
          onClick={() => requestDelete(task.id)}
          aria-label={`Видалити: ${task.title}`}
          title="Видалити завдання"
        >
          <Trash2 size={17} />
        </button>
      </div>
    </li>
  );
}
