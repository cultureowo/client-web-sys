import type { CSSProperties } from "react";
import { Trash2, Check, Flag, Pencil, Eye } from "lucide-react";
import { priorityLabels } from "../types/task";
import type { Task } from "../types/task";
import { useTaskContext } from "../hooks/useTaskContext";
import { Link } from "react-router";
import { useRequireLogin } from "../routes/authNavigation";
import "./TaskItem.scss";
export function TaskItem({ task }: { task: Task }) {
  const { toggleTask, requestDelete, pending, mutation } = useTaskContext();
  const requireLogin = useRequireLogin();
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
        onChange={() => {
          if (requireLogin()) void toggleTask(task.id);
        }}
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
        <Link
          className="task__edit"
          to={`/tasks/${encodeURIComponent(task.id)}`}
          aria-label={`Деталі: ${task.title}`}
          title="Деталі завдання"
        >
          <Eye size={17} />
        </Link>
        <Link
          className="task__edit"
          to={`/tasks/${encodeURIComponent(task.id)}?edit=1`}
          aria-label={`Редагувати: ${task.title}`}
          title="Редагувати завдання"
        >
          <Pencil size={17} />
        </Link>
        <button
          disabled={disabled}
          className="task__delete"
          onClick={() => {
            if (requireLogin()) requestDelete(task);
          }}
          aria-label={`Видалити: ${task.title}`}
          title="Видалити завдання"
        >
          <Trash2 size={17} />
        </button>
      </div>
    </li>
  );
}
