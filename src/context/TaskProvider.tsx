import { useEffect, useReducer, useState } from "react";
import type { ReactNode } from "react";
import { TaskContext } from "./TaskContext";
import type { ToastMessage } from "./TaskContext";
import { taskReducer } from "../reducers/taskReducer";
import { initialTasks } from "../data/initialTasks";
import { readStoredValue, useLocalStorage } from "../hooks/useLocalStorage";
import type { Task, TaskDraft, StatusFilter, SortOrder } from "../types/task";

export const DELETE_DELAY = 5000;
const TASKS_KEY = "study-planner.tasks.v1";

function isTaskArray(value: unknown): value is Task[] {
  if (!Array.isArray(value)) return false;
  const ids = new Set<string>();
  return value.every((task: unknown) => {
    if (!task || typeof task !== "object") return false;
    const t = task as Record<string, unknown>;
    if (typeof t.id !== "string" || !t.id || ids.has(t.id)) return false;
    ids.add(t.id);
    return (
      typeof t.title === "string" &&
      !!t.title.trim() &&
      typeof t.description === "string" &&
      typeof t.completed === "boolean" &&
      ["low", "medium", "high"].includes(String(t.priority)) &&
      typeof t.category === "string" &&
      typeof t.categoryColor === "string" &&
      /^#[\da-f]{6}$/i.test(t.categoryColor)
    );
  });
}

function isFilter(value: unknown): value is StatusFilter {
  return value === "all" || value === "active" || value === "completed";
}

export function TaskProvider({ children }: { children: ReactNode }) {
  const [{ tasks, pending }, dispatch] = useReducer(
    taskReducer,
    undefined,
    () => ({
      tasks: readStoredValue(TASKS_KEY, initialTasks, isTaskArray),
      pending: null,
    }),
  );
  const [filter, setFilter, filterError] = useLocalStorage<StatusFilter>(
    "study-planner.filter.v1",
    "all",
    isFilter,
  );
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOrder>("default");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [storageError, setStorageError] = useState("");

  function notify(message: string, kind: ToastMessage["kind"] = "success") {
    setToast({ id: crypto.randomUUID(), message, kind });
  }

  useEffect(() => {
    try {
      // Pending deletions are session-only: keep tasks until confirmDelete.
      localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
      // Reflect the result of synchronizing with the external storage API.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStorageError("");
    } catch {
      const message =
        "Не вдалося зберегти завдання. Зміни залишаться лише до перезавантаження.";
      setStorageError(message);
      setToast({ id: crypto.randomUUID(), message, kind: "error" });
    }
  }, [tasks]);

  useEffect(() => {
    if (!pending) return;
    const timer = window.setTimeout(
      () => {
        dispatch({ type: "confirmDelete", token: pending.token });
        setToast({
          id: crypto.randomUUID(),
          message: "Видалення завершено.",
          kind: "success",
        });
      },
      Math.max(0, pending.startedAt + DELETE_DELAY - Date.now()),
    );
    return () => window.clearTimeout(timer);
  }, [pending]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 4000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const completed = tasks.filter((task) => task.completed).length;
  const active = tasks.length - completed;
  useEffect(() => {
    const original = document.title;
    document.title = `Study Planner — ${active} невиконаних завдань`;
    return () => {
      document.title = original;
    };
  }, [active]);

  const ranks = { high: 3, medium: 2, low: 1 };
  const visibleTasks = tasks
    .filter(
      (task) =>
        (filter === "all" || task.completed === (filter === "completed")) &&
        task.title
          .toLocaleLowerCase("uk")
          .includes(search.trim().toLocaleLowerCase("uk")),
    )
    .sort((a, b) =>
      sort === "default"
        ? 0
        : (ranks[b.priority] - ranks[a.priority]) * (sort === "high" ? 1 : -1),
    );

  function canChange(id: string) {
    if (!tasks.some((task) => task.id === id) || pending?.ids.includes(id)) {
      notify("Це завдання недоступне для зміни або очікує видалення.", "error");
      return false;
    }
    return true;
  }

  function validDraft(draft: TaskDraft) {
    if (!draft.title.trim()) {
      notify("Введіть назву завдання.", "error");
      return false;
    }
    return true;
  }

  function scheduleDeletion(
    ids: string[],
    type: "requestDelete" | "clearCompleted",
  ) {
    if (pending || !ids.length) {
      notify(
        pending
          ? "Спершу скасуйте поточне видалення або дочекайтеся його завершення."
          : "Немає виконаних завдань для очищення.",
        "error",
      );
      return;
    }
    dispatch({
      type,
      pending: { ids, token: crypto.randomUUID(), startedAt: Date.now() },
    });
    if (editingId && ids.includes(editingId)) setEditingId(null);
    setToast(null);
  }

  return (
    <TaskContext.Provider
      value={{
        tasks,
        visibleTasks,
        completed,
        pending,
        filter,
        setFilter,
        search,
        setSearch,
        sort,
        setSort,
        editingTask: tasks.find((task) => task.id === editingId),
        startEditing(id) {
          if (canChange(id)) setEditingId(id);
        },
        cancelEditing: () => setEditingId(null),
        addTask(draft) {
          if (!validDraft(draft)) return false;
          dispatch({
            type: "add",
            task: { ...draft, id: crypto.randomUUID(), completed: false },
          });
          setFilter("all");
          setSearch("");
          notify("Завдання додано. Ще один крок до мети!");
          return true;
        },
        updateTask(id, draft) {
          if (!canChange(id) || !validDraft(draft)) return false;
          dispatch({ type: "update", id, draft });
          setEditingId(null);
          notify("Зміни завдання збережено.");
          return true;
        },
        toggleTask(id) {
          if (canChange(id)) dispatch({ type: "toggle", id });
        },
        requestDelete(id) {
          if (canChange(id)) scheduleDeletion([id], "requestDelete");
        },
        clearCompleted() {
          scheduleDeletion(
            tasks.filter((task) => task.completed).map((task) => task.id),
            "clearCompleted",
          );
        },
        undoDelete() {
          dispatch({ type: "undoDelete" });
          notify("Видалення скасовано.");
        },
        resetTasks() {
          dispatch({ type: "reset", tasks: initialTasks });
          setEditingId(null);
          setFilter("all");
          setSearch("");
          setSort("default");
          notify("Початкові дані відновлено.");
        },
        toast,
        dismissToast: () => setToast(null),
        reportError: (message) => notify(message, "error"),
        storageError: storageError || filterError,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}
