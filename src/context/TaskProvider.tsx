import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { TaskContext } from "./TaskContext";
import type { PendingDeletion, ToastMessage } from "./TaskContext";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useTasks } from "../hooks/useTasks";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import type { Task, TaskDraft, StatusFilter, SortOrder } from "../types/task";

export const DELETE_DELAY = 5000;
function isFilter(value: unknown): value is StatusFilter {
  return value === "all" || value === "active" || value === "completed";
}

export function TaskProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const notify = useCallback(
    (message: string, kind: ToastMessage["kind"] = "success") => {
      setToast({ id: crypto.randomUUID(), message, kind });
    },
    [],
  );
  const data = useTasks(notify);
  const [filter, setFilter, storageError] = useLocalStorage<StatusFilter>(
    "study-planner.filter.v1",
    "all",
    isFilter,
  );
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);
  const [sort, setSort] = useState<SortOrder>("default");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pending, setPending] = useState<PendingDeletion | null>(null);
  const remove = data.remove;

  useEffect(() => {
    if (!pending || pending.phase !== "waiting") return;
    const timer = window.setTimeout(
      () => {
        setPending(null);
        void remove(pending.tasks);
      },
      Math.max(0, pending.startedAt + DELETE_DELAY - Date.now()),
    );
    return () => window.clearTimeout(timer);
  }, [pending, remove]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 4000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const completed = data.tasks.filter((task) => task.completed).length;
  const active = data.tasks.length - completed;
  useEffect(() => {
    const original = document.title;
    document.title = `Study Planner — ${active} невиконаних на сторінці`;
    return () => {
      document.title = original;
    };
  }, [active]);

  const ranks = { high: 3, medium: 2, low: 1 };
  const visibleTasks = data.tasks
    .filter(
      (task) =>
        (filter === "all" || task.completed === (filter === "completed")) &&
        task.title
          .toLocaleLowerCase("uk")
          .includes(debouncedSearch.trim().toLocaleLowerCase("uk")),
    )
    .sort((a, b) =>
      sort === "default"
        ? 0
        : (ranks[b.priority] - ranks[a.priority]) * (sort === "high" ? 1 : -1),
    );

  function findEditable(id: string) {
    if (data.mutation || pending) return undefined;
    return data.tasks.find((task) => task.id === id);
  }
  function validDraft(draft: TaskDraft) {
    if (draft.title.trim()) return true;
    notify("Введіть назву завдання.", "error");
    return false;
  }
  function scheduleDeletion(tasks: Task[]) {
    if (data.mutation || pending || !tasks.length) return;
    setPending({
      tasks,
      token: crypto.randomUUID(),
      phase: "confirm",
      startedAt: 0,
    });
    setEditingId(null);
    setSelectedId(null);
  }

  return (
    <TaskContext.Provider
      value={{
        tasks: data.tasks,
        visibleTasks,
        completed,
        pending,
        filter,
        setFilter,
        search,
        setSearch,
        sort,
        setSort,
        editingTask: data.tasks.find((task) => task.id === editingId),
        startEditing(id) {
          if (findEditable(id)) setEditingId(id);
        },
        cancelEditing() {
          if (!data.mutation) setEditingId(null);
        },
        async addTask(draft) {
          if (pending || !validDraft(draft)) return false;
          const success = await data.create(draft);
          if (success) {
            setFilter("all");
            setSearch("");
          }
          return success;
        },
        async updateTask(id, draft) {
          const task = findEditable(id);
          if (!task || !validDraft(draft)) return false;
          const success = await data.update(task, draft);
          if (success) setEditingId(null);
          return success;
        },
        async toggleTask(id) {
          const task = findEditable(id);
          if (task) await data.update(task, { completed: !task.completed });
        },
        requestDelete(id) {
          const task = findEditable(id);
          if (task) scheduleDeletion([task]);
        },
        clearCompleted() {
          scheduleDeletion(data.tasks.filter((task) => task.completed));
        },
        confirmDelete() {
          if (pending?.phase === "confirm")
            setPending({ ...pending, phase: "waiting", startedAt: Date.now() });
        },
        undoDelete() {
          setPending(null);
          notify("Видалення скасовано.");
        },
        resetTasks() {
          if (data.mutation) return;
          setPending(null);
          setEditingId(null);
          setSelectedId(null);
          setFilter("all");
          setSearch("");
          setSort("default");
          data.reset();
        },
        toast,
        dismissToast: () => setToast(null),
        reportError: (message) => notify(message, "error"),
        storageError,
        status: data.status,
        loadError: data.error,
        mutation: data.mutation,
        mutationError: data.mutationError,
        reload() {
          if (!pending) data.reload();
        },
        page: data.page,
        pageSize: data.pageSize,
        serverTotal: data.serverTotal,
        setPage(value) {
          if (pending || data.mutation) return;
          setEditingId(null);
          setSelectedId(null);
          data.setPage(value);
        },
        selectedId,
        selectTask: setSelectedId,
        sessionChanges: data.sessionChanges,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}
