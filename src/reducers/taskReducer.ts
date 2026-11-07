import type { Task, TaskDraft } from "../types/task";

export interface PendingDeletion {
  token: string;
  ids: string[];
  startedAt: number;
}

export interface TaskState {
  tasks: Task[];
  pending: PendingDeletion | null;
}

export type TaskAction =
  | { type: "add"; task: Task }
  | { type: "toggle"; id: string }
  | { type: "update"; id: string; draft: TaskDraft }
  | { type: "requestDelete"; pending: PendingDeletion }
  | { type: "clearCompleted"; pending: PendingDeletion }
  | { type: "confirmDelete"; token: string }
  | { type: "undoDelete" }
  | { type: "reset"; tasks: Task[] };

export function taskReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case "add":
      return { ...state, tasks: [action.task, ...state.tasks] };
    case "toggle":
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.id && !state.pending?.ids.includes(task.id)
            ? { ...task, completed: !task.completed }
            : task,
        ),
      };
    case "update":
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.id && !state.pending?.ids.includes(task.id)
            ? { ...task, ...action.draft }
            : task,
        ),
      };
    case "requestDelete":
    case "clearCompleted":
      return state.pending ? state : { ...state, pending: action.pending };
    case "confirmDelete":
      if (state.pending?.token !== action.token) return state;
      return {
        tasks: state.tasks.filter((task) => !state.pending.ids.includes(task.id)),
        pending: null,
      };
    case "undoDelete":
      return { ...state, pending: null };
    case "reset":
      return { tasks: action.tasks.map((task) => ({ ...task })), pending: null };
  }
}
