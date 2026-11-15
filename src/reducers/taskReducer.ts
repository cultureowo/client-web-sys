import type { Task } from "../types/task.ts";
import type { TaskPage } from "../repositories/taskRepository.ts";
import type { RequestStatus } from "../types/api.ts";

export interface TaskState {
  pageTasks: Task[];
  total: number;
  page: number;
  status: RequestStatus;
  error: string;
  // Only successful session mutations, not another copy of the fetched dataset.
  changes: Record<string, Task | null>;
}

export const initialTaskState: TaskState = {
  pageTasks: [],
  total: 0,
  page: 1,
  status: "loading",
  error: "",
  changes: {},
};

export type TaskAction =
  | { type: "load"; page: number }
  | { type: "loaded"; page: number; result: TaskPage }
  | { type: "failed"; page: number; error: string }
  | { type: "upsert"; task: Task }
  | { type: "deleted"; id: string }
  | { type: "reset" };

export function taskReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case "load":
      return {
        ...state,
        page: action.page,
        pageTasks: [],
        status: "loading",
        error: "",
      };
    case "loaded":
      if (state.page !== action.page) return state;
      return {
        ...state,
        pageTasks: action.result.tasks,
        total: action.result.total,
        status: "success",
        error: "",
      };
    case "failed":
      if (state.page !== action.page) return state;
      return { ...state, status: "error", error: action.error };
    case "upsert":
      return {
        ...state,
        changes: { ...state.changes, [action.task.id]: action.task },
      };
    case "deleted":
      return { ...state, changes: { ...state.changes, [action.id]: null } };
    case "reset":
      return { ...initialTaskState, changes: {} };
  }
}

export function selectPageTasks(state: TaskState): Task[] {
  if (state.status !== "success") return [];
  const created =
    state.page === 1
      ? Object.values(state.changes)
          .filter((task): task is Task => task?.origin === "session")
          .reverse()
      : [];
  const remote = state.pageTasks.flatMap((task) => {
    const changed = state.changes[task.id];
    return changed === null ? [] : [changed ?? task];
  });
  return [...created, ...remote];
}
