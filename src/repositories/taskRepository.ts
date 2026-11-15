import { ApiError, httpClient } from "../api/httpClient.ts";
import type { Task, TaskDraft } from "../types/task.ts";
import type { ApiTodo, TodosResponse } from "../types/api.ts";

export interface TaskPage { tasks: Task[]; total: number; skip: number; limit: number }
type Request = typeof httpClient;

function validateTodo(value: unknown): asserts value is ApiTodo {
  if (!value || typeof value !== "object") throw new ApiError("API повернув некоректне завдання.");
  const item = value as ApiTodo;
  if (!/^\d+$/.test(String(item.id)) || Number(item.id) <= 0 || typeof item.todo !== "string" ||
    typeof item.completed !== "boolean" || !Number.isInteger(item.userId)) {
    throw new ApiError("API повернув некоректне завдання.");
  }
}

export function toTask(todo: ApiTodo): Task {
  validateTodo(todo);
  return {
    id: String(todo.id), title: todo.todo, completed: todo.completed,
    description: "", priority: "medium", category: "Загальне", categoryColor: "#6284f5",
    userId: todo.userId, origin: "api",
  };
}

// DummyJSON does not persist mutations. Newly POSTed records therefore have
// unique session IDs and cannot be read/updated/deleted by a server endpoint.
// Their later operations use the current task passed by the caller, without a second cache.
export function createTaskRepository(request: Request = httpClient) {
  return {
    async getAll({ limit = 10, skip = 0, signal }: { limit?: number; skip?: number; signal?: AbortSignal } = {}): Promise<TaskPage> {
      const data = await request<TodosResponse>(`/todos?limit=${limit}&skip=${skip}`, { signal });
      if (!data || !Array.isArray(data.todos) || !Number.isInteger(data.total) || data.total < 0 ||
        !Number.isInteger(data.skip) || data.skip < 0 || !Number.isInteger(data.limit) || data.limit < 0) {
        throw new ApiError("API повернув некоректний список завдань.");
      }
      const tasks = data.todos.map(toTask);
      if (new Set(tasks.map(task => task.id)).size !== tasks.length) throw new ApiError("API повернув повторні ідентифікатори.");
      return { tasks, total: data.total, skip: data.skip, limit: data.limit };
    },
    async getById(id: string, signal?: AbortSignal, sessionTask?: Task): Promise<Task> {
      signal?.throwIfAborted();
      if (id.startsWith("session:")) {
        if (sessionTask?.id !== id) throw new ApiError("Сесійне завдання недоступне.");
        return { ...sessionTask };
      }
      return toTask(await request<ApiTodo>(`/todos/${encodeURIComponent(id)}`, { signal }));
    },
    async create(draft: TaskDraft, signal?: AbortSignal): Promise<Task> {
      const todo = await request<ApiTodo>("/todos/add", {
        method: "POST", signal,
        body: JSON.stringify({ todo: draft.title, completed: false, userId: 1 }),
      });
      const mapped = toTask(todo);
      return { ...mapped, ...draft, id: `session:${crypto.randomUUID()}`, origin: "session" };
    },
    async update(task: Task, changes: Partial<TaskDraft> & { completed?: boolean }, signal?: AbortSignal): Promise<Task> {
      signal?.throwIfAborted();
      if (task.origin === "session") return { ...task, ...changes };
      const body = { todo: changes.title ?? task.title, completed: changes.completed ?? task.completed };
      const todo = await request<ApiTodo>(`/todos/${encodeURIComponent(task.id)}`, {
        method: "PATCH", signal, body: JSON.stringify(body),
      });
      const mapped = toTask(todo);
      if (mapped.id !== task.id) throw new ApiError("API повернув інше завдання.");
      return { ...task, ...changes, title: mapped.title, completed: mapped.completed };
    },
    async delete(task: Task, signal?: AbortSignal): Promise<void> {
      signal?.throwIfAborted();
      if (task.origin === "session") return;
      await request<unknown>(`/todos/${encodeURIComponent(task.id)}`, { method: "DELETE", signal });
    },
  };
}

export const taskRepository = createTaskRepository();
