import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { taskRepository } from "../repositories/taskRepository";
import { errorMessage, isAbortError } from "../api/httpClient";
import { priorityLabels } from "../types/task";
import type { Task } from "../types/task";
import type { RequestStatus } from "../types/api";
import { RequestState } from "./RequestState";
import "./TaskDetails.scss";

export function TaskDetails({
  seed,
  override,
  onClose,
}: {
  seed: Task;
  override?: Task;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [state, setState] = useState<{
    status: RequestStatus;
    task: Task | null;
    error: string;
  }>({ status: "loading", task: null, error: "" });
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    const element = dialog.current;
    element?.showModal();
    return () => element?.close();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    taskRepository
      .getById(seed.id, controller.signal, seed)
      .then((task) => {
        if (controller.signal.aborted) return;
        setState({
          status: "success",
          error: "",
          task: {
            ...task,
            description: seed.description,
            priority: seed.priority,
            category: seed.category,
            categoryColor: seed.categoryColor,
            ...override,
          },
        });
      })
      .catch((error) => {
        if (!controller.signal.aborted && !isAbortError(error))
          setState({ status: "error", task: null, error: errorMessage(error) });
      });
    return () => controller.abort();
  }, [seed, override, revision]);

  return (
    <dialog
      className="task-details"
      ref={dialog}
      onCancel={onClose}
      aria-labelledby="details-title"
    >
      <div className="task-details__heading">
        <h2 id="details-title">Деталі завдання</h2>
        <button
          className="task-details__close"
          onClick={onClose}
          aria-label="Закрити деталі"
        >
          <X size={20} />
        </button>
      </div>
      {state.status === "loading" && (
        <RequestState loading message="Завантаження деталей…" />
      )}
      {state.status === "error" && (
        <RequestState
          message={state.error}
          onRetry={() => {
            setState({ status: "loading", task: null, error: "" });
            setRevision((value) => value + 1);
          }}
        />
      )}
      {state.status === "success" && state.task && (
        <>
          <h3 className="task-details__title">{state.task.title}</h3>
          <dl className="task-details__fields">
            <dt>Опис</dt>
            <dd>{state.task.description || "Опис не додано"}</dd>
            <dt>Категорія</dt>
            <dd>{state.task.category}</dd>
            <dt>Пріоритет</dt>
            <dd>{priorityLabels[state.task.priority]}</dd>
            <dt>Стан</dt>
            <dd>{state.task.completed ? "Виконано" : "Не виконано"}</dd>
          </dl>
          <p className="task-details__note">
            {seed.origin === "session"
              ? "Це завдання створене в поточній сесії. Навчальний API не зберігає його на сервері; деталі й подальші зміни доступні локально до перезавантаження."
              : "Дані отримані окремим GET-запитом. Зміни поточної сесії та додаткові поля відображаються поверх відповіді навчального API."}
          </p>
        </>
      )}
    </dialog>
  );
}
