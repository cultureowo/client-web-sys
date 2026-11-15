import { test } from "node:test";
import assert from "node:assert/strict";
import {
  createTaskRepository,
  toTask,
} from "../src/repositories/taskRepository.ts";
import type { httpClient } from "../src/api/httpClient.ts";
import type { TaskDraft } from "../src/types/task.ts";

const todo = { id: 1, todo: "Learn REST", completed: false, userId: 3 };
const draft: TaskDraft = {
  title: "New task",
  description: "Client metadata",
  priority: "high",
  category: "React",
  categoryColor: "#6284f5",
};

test("repository maps DTOs and pagination while forwarding AbortSignal", async () => {
  const controller = new AbortController();
  const request: typeof httpClient = async <T>(
    path: string,
    options: RequestInit = {},
  ) => {
    assert.equal(options.signal, controller.signal);
    return (
      path === "/todos/1"
        ? todo
        : { todos: [todo], total: 25, limit: 10, skip: 20 }
    ) as T;
  };
  const repo = createTaskRepository(request);
  const page = await repo.getAll({
    limit: 10,
    skip: 20,
    signal: controller.signal,
  });
  assert.equal(page.total, 25);
  assert.equal(page.tasks[0].title, todo.todo);
  assert.equal(page.tasks[0].priority, "medium");
  assert.equal((await repo.getById("1", controller.signal)).id, "1");
});

test("POST sends only API fields; repeated mock IDs get unique session IDs", async () => {
  const request: typeof httpClient = async <T>(
    path: string,
    options: RequestInit = {},
  ) => {
    assert.equal(path, "/todos/add");
    assert.equal(options.method, "POST");
    assert.deepEqual(JSON.parse(options.body as string), {
      todo: draft.title,
      completed: false,
      userId: 1,
    });
    return { ...todo, id: 255, todo: draft.title } as T;
  };
  const repo = createTaskRepository(request);
  const first = await repo.create(draft),
    second = await repo.create(draft);
  assert.notEqual(first.id, second.id);
  assert.equal(first.description, draft.description);
  assert.equal(first.origin, "session");
});

test("PATCH and DELETE use remote IDs, preserve metadata and propagate HTTP errors", async () => {
  const calls: string[] = [];
  const request: typeof httpClient = async <T>(
    path: string,
    options: RequestInit = {},
  ) => {
    calls.push(`${options.method} ${path}`);
    if (options.method === "PATCH") {
      assert.deepEqual(JSON.parse(options.body as string), {
        todo: "Edited",
        completed: true,
      });
      return { ...todo, id: "1", todo: "Edited", completed: true } as T;
    }
    return { ...todo, isDeleted: true } as T;
  };
  const repo = createTaskRepository(request);
  const updated = await repo.update(toTask(todo), {
    ...draft,
    title: "Edited",
    completed: true,
  });
  assert.equal(updated.description, draft.description);
  assert.equal(updated.completed, true);
  await repo.delete(updated);
  assert.deepEqual(calls, ["PATCH /todos/1", "DELETE /todos/1"]);
  const failing = createTaskRepository(async () => {
    throw new Error("offline");
  });
  await assert.rejects(
    failing.update(updated, { completed: false }),
    /offline/,
  );
  await assert.rejects(failing.delete(updated), /offline/);
});

test("session-only records do not send impossible follow-up requests", async () => {
  const repo = createTaskRepository(async () => {
    throw new Error("Unexpected HTTP call");
  });
  const task = {
    ...toTask(todo),
    id: "session:one",
    origin: "session" as const,
  };
  assert.equal((await repo.getById(task.id, undefined, task)).id, task.id);
  assert.equal(
    (await repo.update(task, { title: "Local edit" })).title,
    "Local edit",
  );
  await repo.delete(task);
});

test("invalid DTOs, pagination and duplicate IDs are rejected", async () => {
  assert.throws(() =>
    toTask({ ...todo, completed: "false" } as unknown as typeof todo),
  );
  const repo = createTaskRepository(
    async <T>() => ({ todos: [todo, todo], total: 2, skip: 0, limit: 10 }) as T,
  );
  await assert.rejects(repo.getAll(), /ідентифікатори/);
  const invalid = createTaskRepository(
    async <T>() => ({ todos: [], total: -1 }) as T,
  );
  await assert.rejects(invalid.getAll(), /список/);
});
