import { BookOpenCheck } from "lucide-react";
import { TaskItem } from "./TaskItem";
import { useTaskContext } from "../hooks/useTaskContext";
import "./TaskList.scss";
import { RequestState } from "./RequestState";
export function TaskList() {
  const {
    visibleTasks: tasks,
    tasks: allTasks,
    status,
    loadError,
    reload,
  } = useTaskContext();
  if (status === "loading")
    return <RequestState loading message="Завантаження завдань…" />;
  if (status === "error")
    return <RequestState message={loadError} onRetry={reload} />;
  const total = allTasks.length;
  if (!tasks.length)
    return (
      <div className="empty">
        <BookOpenCheck size={38} />
        <h3>
          {total ? "За цим фільтром завдань немає." : "Завдань поки немає."}
        </h3>
        <p>
          {total
            ? "Спробуй змінити фільтр або пошуковий запит."
            : "Додай перше навчальне завдання — і починай свій шлях."}
        </p>
      </div>
    );
  return (
    <ul className="task-list" aria-label="Список завдань">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  );
}
