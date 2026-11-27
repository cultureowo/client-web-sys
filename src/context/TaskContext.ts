import { createContext } from "react";
import type { Task, TaskDraft, StatusFilter, SortOrder } from "../types/task";
import type { RequestStatus } from "../types/api";

export interface ToastMessage {
  id: string;
  message: string;
  kind: "success" | "error";
}
export interface PendingDeletion {
  token: string;
  tasks: Task[];
  phase: "confirm" | "waiting";
  startedAt: number;
}

export interface TaskContextValue {
  tasks: Task[];
  visibleTasks: Task[];
  completed: number;
  pending: PendingDeletion | null;
  filter: StatusFilter;
  setFilter: (value: StatusFilter) => void;
  search: string;
  setSearch: (value: string) => void;
  sort: SortOrder;
  setSort: (value: SortOrder) => void;
  addTask: (draft: TaskDraft) => Promise<boolean>;
  updateTask: (task: Task, draft: TaskDraft) => Promise<boolean>;
  toggleTask: (id: string) => Promise<void>;
  requestDelete: (task: Task) => void;
  confirmDelete: () => void;
  undoDelete: () => void;
  clearCompleted: () => void;
  resetTasks: () => void;
  toast: ToastMessage | null;
  dismissToast: () => void;
  reportError: (message: string) => void;
  status: RequestStatus;
  loadError: string;
  mutation: string | null;
  mutationError: string;
  reload: () => void;
  page: number;
  pageSize: number;
  serverTotal: number;
  setPage: (value: number) => void;
  sessionChanges: Record<string, Task | null>;
}

export const TaskContext = createContext<TaskContextValue | null>(null);
