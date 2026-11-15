import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { taskRepository } from "../repositories/taskRepository";
import { errorMessage, isAbortError } from "../api/httpClient";
import {
  initialTaskState,
  selectPageTasks,
  taskReducer,
} from "../reducers/taskReducer";
import type { Task, TaskDraft } from "../types/task";

const PAGE_SIZE = 10;

export function useTasks(
  notify: (message: string, kind?: "success" | "error") => void,
) {
  const [state, dispatch] = useReducer(taskReducer, initialTaskState);
  const [page, setPage] = useState(1);
  const [revision, setRevision] = useState(0);
  const [mutation, setMutation] = useState<string | null>(null);
  const [mutationError, setMutationError] = useState("");
  const operation = useRef<AbortController | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    dispatch({ type: "load", page });
    taskRepository
      .getAll({
        limit: PAGE_SIZE,
        skip: (page - 1) * PAGE_SIZE,
        signal: controller.signal,
      })
      .then((result) => {
        if (!controller.signal.aborted)
          dispatch({ type: "loaded", page, result });
      })
      .catch((error) => {
        if (!controller.signal.aborted && !isAbortError(error))
          dispatch({ type: "failed", page, error: errorMessage(error) });
      });
    return () => controller.abort();
  }, [page, revision]);

  useEffect(
    () => () => {
      operation.current?.abort();
    },
    [],
  );

  const runMutation = useCallback(
    async (
      label: string,
      work: (signal: AbortSignal) => Promise<void>,
    ): Promise<boolean> => {
      if (operation.current) return false;
      const controller = new AbortController();
      operation.current = controller;
      setMutation(label);
      setMutationError("");
      try {
        await work(controller.signal);
        return !controller.signal.aborted;
      } catch (error) {
        if (!controller.signal.aborted && !isAbortError(error)) {
          const message = errorMessage(error);
          setMutationError(message);
          notify(message, "error");
        }
        return false;
      } finally {
        if (!controller.signal.aborted) {
          setMutation(null);
          operation.current = null;
        }
      }
    },
    [notify],
  );

  const remove = useCallback(
    (items: Task[]) =>
      runMutation("Видалення завдань…", async (signal) => {
        for (const task of items) {
          await taskRepository.delete(task, signal);
          if (signal.aborted) return;
          dispatch({ type: "deleted", id: task.id });
        }
        notify("Видалення завершено.");
      }),
    [runMutation, notify],
  );

  const tasks = state.page === page ? selectPageTasks(state) : [];
  return {
    tasks,
    page,
    pageSize: PAGE_SIZE,
    serverTotal: state.total,
    status: state.page === page ? state.status : ("loading" as const),
    error: state.error,
    mutation,
    mutationError,
    sessionChanges: state.changes,
    setPage(value: number) {
      if (!operation.current)
        setPage(
          Math.max(
            1,
            Math.min(value, Math.max(1, Math.ceil(state.total / PAGE_SIZE))),
          ),
        );
    },
    reload() {
      if (!operation.current) setRevision((value) => value + 1);
    },
    reset() {
      if (operation.current) return;
      dispatch({ type: "reset" });
      setPage(1);
      setRevision((value) => value + 1);
      setMutationError("");
    },
    create(draft: TaskDraft) {
      return runMutation("Створення завдання…", async (signal) => {
        const task = await taskRepository.create(draft, signal);
        if (signal.aborted) return;
        dispatch({ type: "upsert", task });
        setPage(1);
        notify("Завдання створено. Воно доступне в поточній сесії.");
      });
    },
    update(task: Task, changes: Partial<TaskDraft> & { completed?: boolean }) {
      return runMutation("Збереження змін…", async (signal) => {
        const updated = await taskRepository.update(task, changes, signal);
        if (signal.aborted) return;
        dispatch({ type: "upsert", task: updated });
        notify("Зміни завдання збережено в поточній сесії.");
      });
    },
    remove,
  };
}
