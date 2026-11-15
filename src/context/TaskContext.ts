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
  editingTask: Task | undefined;
  startEditing: (id: string) => void;
  cancelEditing: () => void;
  addTask: (draft: TaskDraft) => Promise<boolean>;
  updateTask: (id: string, draft: TaskDraft) => Promise<boolean>;
  toggleTask: (id: string) => Promise<void>;
  requestDelete: (id: string) => void;
  confirmDelete: () => void;
  undoDelete: () => void;
  clearCompleted: () => void;
  resetTasks: () => void;
  toast: ToastMessage | null;
  dismissToast: () => void;
  reportError: (message: string) => void;
  storageError: string;
  status: RequestStatus;
  loadError: string;
  mutation: string | null;
  mutationError: string;
  reload: () => void;
  page: number;
  pageSize: number;
  serverTotal: number;
  setPage: (value: number) => void;
  selectedId: string | null;
  selectTask: (id: string | null) => void;
  sessionChanges: Record<string, Task | null>;
}

export const TaskContext = createContext<TaskContextValue | null>(null);
