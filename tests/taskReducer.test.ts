import { test } from "node:test";
import assert from "node:assert/strict";
import {
  initialTaskState,
  selectPageTasks,
  taskReducer,
} from "../src/reducers/taskReducer.ts";
import type { TaskState } from "../src/reducers/taskReducer.ts";
import type { Task } from "../src/types/task.ts";

const task: Task = {
  id: "1",
  title: "React",
  description: "",
  completed: false,
  priority: "medium",
  category: "Загальне",
  categoryColor: "#6284f5",
  origin: "api",
};
const page = { tasks: [task], total: 25, skip: 0, limit: 10 };
function initial(): TaskState {
  return taskReducer(initialTaskState, {
    type: "loaded",
    page: 1,
    result: page,
  });
}

test("loading, error and retry transitions reject responses for other pages", () => {
  const loading = taskReducer(initial(), { type: "load", page: 2 });
  assert.equal(loading.status, "loading");
  assert.deepEqual(selectPageTasks(loading), []);
  assert.equal(
    taskReducer(loading, { type: "loaded", page: 1, result: page }),
    loading,
  );
  assert.equal(
    taskReducer(loading, { type: "failed", page: 1, error: "stale" }),
    loading,
  );
  const failed = taskReducer(loading, {
    type: "failed",
    page: 2,
    error: "offline",
  });
  assert.equal(failed.error, "offline");
  const retried = taskReducer(failed, { type: "load", page: 2 });
  assert.equal(retried.error, "");
  assert.equal(
    taskReducer(retried, {
      type: "loaded",
      page: 2,
      result: { ...page, tasks: [] },
    }).status,
    "success",
  );
});

test("confirmed mutations are immutable and survive page reloading", () => {
  const state = initial();
  const snapshot = structuredClone(state);
  const updated = {
    ...task,
    title: "Effects",
    description: "Metadata",
    completed: true,
  };
  const changed = taskReducer(state, { type: "upsert", task: updated });
  const loadedAgain = taskReducer(changed, {
    type: "loaded",
    page: 1,
    result: page,
  });
  assert.deepEqual(selectPageTasks(loadedAgain), [updated]);
  assert.deepEqual(state, snapshot);
  assert.equal(state.pageTasks[0], task);
});

test("deleted remote tasks remain hidden after navigation and refresh", () => {
  const deleted = taskReducer(initial(), { type: "deleted", id: "1" });
  assert.deepEqual(
    selectPageTasks(
      taskReducer(deleted, { type: "loaded", page: 1, result: page }),
    ),
    [],
  );
});

test("created tasks appear on page one with unique session identity and can be deleted", () => {
  const created = { ...task, id: "session:unique", origin: "session" as const };
  const state = taskReducer(initial(), { type: "upsert", task: created });
  assert.deepEqual(selectPageTasks(state), [created, task]);
  const next = taskReducer(taskReducer(state, { type: "load", page: 2 }), {
    type: "loaded",
    page: 2,
    result: { ...page, tasks: [] },
  });
  assert.deepEqual(selectPageTasks(next), []);
  assert.deepEqual(
    selectPageTasks(taskReducer(state, { type: "deleted", id: created.id })),
    [task],
  );
});

test("reset discards session changes and starts loading instead of using localStorage", () => {
  const state = taskReducer(initial(), {
    type: "upsert",
    task: { ...task, completed: true },
  });
  assert.deepEqual(taskReducer(state, { type: "reset" }), initialTaskState);
});
