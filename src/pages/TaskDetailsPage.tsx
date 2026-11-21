import { useEffect, useState } from "react";
import {
  Link,
  Navigate,
  useLocation,
  useParams,
  useSearchParams,
} from "react-router";
import { taskRepository } from "../repositories/taskRepository";
import { errorMessage, isAbortError } from "../api/httpClient";
import { useTaskContext } from "../hooks/useTaskContext";
import { useAuth } from "../context/AuthContext";
import { loginPath, useRequireLogin } from "../routes/authNavigation";
import { RequestState } from "../components/RequestState";
import { TaskFormDialog } from "../components/TaskFormDialog";
import { priorityLabels, type Task } from "../types/task";
import "./TaskDetailsPage.scss";

export function TaskDetailsPage() {
  const { taskId = "" } = useParams();
  return <TaskDetailsContent key={taskId} taskId={taskId} />;
}

function TaskDetailsContent({ taskId }: { taskId: string }) {
  const [params, setParams] = useSearchParams();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const requireLogin = useRequireLogin();
  const { sessionChanges, updateTask, requestDelete, pending, mutation } =
    useTaskContext();
  const override = sessionChanges[taskId];
  const sessionTask = taskId.startsWith("session:")
    ? (override ?? undefined)
    : undefined;
  const [result, setResult] = useState<{ task?: Task; error?: string } | null>(
    null,
  );
  const [attempt, setAttempt] = useState(0);
  const editing = params.get("edit") === "1";

  useEffect(() => {
    if (taskId.startsWith("session:")) return;
    const controller = new AbortController();
    taskRepository
      .getById(taskId, controller.signal)
      .then((task) => {
        if (!controller.signal.aborted) setResult({ task });
      })
      .catch((error) => {
        if (!controller.signal.aborted && !isAbortError(error))
          setResult({ error: errorMessage(error) });
      });
    return () => controller.abort();
  }, [taskId, attempt]);

  function setEditing(open: boolean) {
    setParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        if (open) next.set("edit", "1");
        else next.delete("edit");
        return next;
      },
      { replace: true },
    );
  }

  if (editing && !isAuthenticated)
    return (
      <Navigate replace to={loginPath(location.pathname + location.search)} />
    );
  const task =
    sessionTask ?? (result?.task ? (override ?? result.task) : undefined);
  return (
    <article className="details-page">
      <Link to="/tasks">← До завдань</Link>
      {override === null || (taskId.startsWith("session:") && !sessionTask) ? (
        <p>Завдання недоступне.</p>
      ) : result?.error ? (
        <RequestState
          message={result.error}
          onRetry={() => {
            setResult(null);
            setAttempt((value) => value + 1);
          }}
        />
      ) : !task ? (
        <RequestState loading message="Завантаження деталей…" />
      ) : (
        <>
          <h1>{task.title}</h1>
          <dl className="details-page__fields">
            <dt>Опис</dt>
            <dd>{task.description || "Опис не додано"}</dd>
            <dt>Категорія</dt>
            <dd>{task.category}</dd>
            <dt>Пріоритет</dt>
            <dd>{priorityLabels[task.priority]}</dd>
            <dt>Стан</dt>
            <dd>{task.completed ? "Виконано" : "Не виконано"}</dd>
            <dt>Автор</dt>
            <dd>
              {task.createdBy ??
                (task.userId ? `Користувач #${task.userId}` : "Невідомо")}
            </dd>
            <dt>Дата створення</dt>
            <dd>
              {task.createdAt ? (
                <time dateTime={task.createdAt}>
                  {new Date(task.createdAt).toLocaleString("uk-UA")}
                </time>
              ) : (
                "API не надає дату"
              )}
            </dd>
          </dl>
          <div className="details-page__actions">
            <button
              className="button button--primary"
              disabled={!!mutation || !!pending}
              onClick={() => setEditing(true)}
            >
              Редагувати
            </button>
            <button
              className="button button--quiet"
              disabled={!!mutation || !!pending}
              onClick={() => {
                if (requireLogin()) requestDelete(task);
              }}
            >
              Видалити
            </button>
          </div>
          {editing && (
            <TaskFormDialog
              mode="edit"
              task={task}
              onClose={() => setEditing(false)}
              onSubmit={(draft) => updateTask(task, draft)}
            />
          )}
        </>
      )}
    </article>
  );
}
