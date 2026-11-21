import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { TaskContext } from "./TaskContext";
import type { PendingDeletion, ToastMessage } from "./TaskContext";
import { useSearchParams } from "react-router";
import { getSession } from "../auth/session";
import { useAuth } from "./AuthContext";
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
  const [params, setParams] = useSearchParams();
  const statusParam = params.get("status");
  const filter = isFilter(statusParam) ? statusParam : "all";
  function setFilter(value: StatusFilter) {
    setParams((previous) => {
      const next = new URLSearchParams(previous);
      if (value === "all") next.delete("status");
      else next.set("status", value);
      return next;
    });
  }
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);
  const [sort, setSort] = useState<SortOrder>("default");
  const { session } = useAuth();
  const [deletion, setPending] = useState<
    (PendingDeletion & { owner: typeof session }) | null
  >(null);
  const pending = deletion?.owner === session ? deletion : null;
  const remove = data.remove;

  useEffect(() => {
    if (!pending || pending.phase !== "waiting") return;
    const timer = window.setTimeout(
      () => {
        setPending(null);
        if (pending.owner === getSession()) void remove(pending.tasks);
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
    if (!getSession() || data.mutation || pending) return undefined;
    return data.tasks.find((task) => task.id === id);
  }
  function validDraft(draft: TaskDraft) {
    if (draft.title.trim()) return true;
    notify("Введіть назву завдання.", "error");
    return false;
  }
  function scheduleDeletion(tasks: Task[]) {
    const owner = getSession();
    if (!owner || data.mutation || pending || !tasks.length) return;
    setPending({
      owner,
      tasks,
      token: crypto.randomUUID(),
      phase: "confirm",
      startedAt: 0,
    });
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
        async addTask(draft) {
          if (pending || !validDraft(draft)) return false;
          const success = await data.create(draft);
          if (success) {
            setFilter("all");
            setSearch("");
          }
          return success;
        },
        async updateTask(task, draft) {
          if (pending || !validDraft(draft)) return false;
          return data.update(task, draft);
        },
        async toggleTask(id) {
          const task = findEditable(id);
          if (task) await data.update(task, { completed: !task.completed });
        },
        requestDelete(task) {
          scheduleDeletion([task]);
        },
        clearCompleted() {
          scheduleDeletion(data.tasks.filter((task) => task.completed));
        },
        confirmDelete() {
          if (pending?.phase === "confirm" && pending.owner === getSession())
            setPending({ ...pending, phase: "waiting", startedAt: Date.now() });
        },
        undoDelete() {
          setPending(null);
          notify("Видалення скасовано.");
        },
        resetTasks() {
          if (data.mutation) return;
          setPending(null);
          setFilter("all");
          setSearch("");
          setSort("default");
          data.reset();
        },
        toast,
        dismissToast: () => setToast(null),
        reportError: (message) => notify(message, "error"),
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
          data.setPage(value);
        },
        sessionChanges: data.sessionChanges,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}
