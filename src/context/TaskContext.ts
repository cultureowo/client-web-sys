import { createContext } from "react";
import type { Task, TaskDraft, StatusFilter, SortOrder } from "../types/task";
import type { PendingDeletion } from "../reducers/taskReducer";

export interface ToastMessage {
  id: string;
  message: string;
  kind: "success" | "error";
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
  addTask: (draft: TaskDraft) => boolean;
  updateTask: (id: string, draft: TaskDraft) => boolean;
  toggleTask: (id: string) => void;
  requestDelete: (id: string) => void;
  undoDelete: () => void;
  clearCompleted: () => void;
  resetTasks: () => void;
  toast: ToastMessage | null;
  dismissToast: () => void;
  reportError: (message: string) => void;
  storageError: string;
}

export const TaskContext = createContext<TaskContextValue | null>(null);
