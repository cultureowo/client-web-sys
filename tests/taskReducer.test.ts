import { test } from "node:test";
import assert from "node:assert/strict";
import { taskReducer } from "../src/reducers/taskReducer.ts";
import type { TaskState } from "../src/reducers/taskReducer.ts";
import type { Task } from "../src/types/task.ts";

const task: Task = {
  id: "1",
  title: "React",
  description: "Practice",
  completed: false,
  priority: "high",
  category: "React",
  categoryColor: "#6284f5",
};
const second: Task = { ...task, id: "2", completed: true };
function initial(): TaskState {
  return { tasks: [{ ...task }, { ...second }], pending: null };
}
const pending = { token: "delete-1", ids: ["1"], startedAt: 1000 };

test("add, toggle and update preserve the original state and task identity", () => {
  const state = initial();
  const snapshot = structuredClone(state);
  const toggled = taskReducer(state, { type: "toggle", id: "1" });
  assert.equal(toggled.tasks[0].completed, true);
  assert.equal(toggled.tasks[1], state.tasks[1]);
  const updated = taskReducer(state, {
    type: "update",
    id: "1",
    draft: {
      title: "Effects",
      description: "Updated",
      category: "Hooks",
      priority: "low",
      categoryColor: "#24a88b",
    },
  });
  assert.equal(updated.tasks[0].title, "Effects");
  assert.equal(updated.tasks[0].id, "1");
  assert.equal(updated.tasks[0].completed, false);
  assert.equal(
    taskReducer(state, { type: "add", task: { ...task, id: "3" } }).tasks
      .length,
    3,
  );
  assert.deepEqual(state, snapshot);
});

test("request keeps task present; undo restores normal state; stale timers are ignored", () => {
  const state = initial();
  const requested = taskReducer(state, { type: "requestDelete", pending });
  assert.equal(requested.tasks.length, 2);
  assert.deepEqual(requested.pending, pending);
  assert.equal(
    taskReducer(requested, { type: "toggle", id: "1" }).tasks[0].completed,
    false,
  );
  assert.equal(
    taskReducer(requested, { type: "confirmDelete", token: "stale" }),
    requested,
  );
  const undone = taskReducer(requested, { type: "undoDelete" });
  assert.equal(undone.pending, null);
  assert.equal(
    taskReducer(undone, { type: "confirmDelete", token: pending.token }),
    undone,
  );
  assert.deepEqual(
    taskReducer(requested, { type: "confirmDelete", token: pending.token })
      .tasks,
    [second],
  );
});

test("only one deletion batch is active and clearCompleted has the same undo lifecycle", () => {
  const state = initial();
  const batch = { ...pending, ids: ["2"] };
  const requested = taskReducer(state, {
    type: "clearCompleted",
    pending: batch,
  });
  assert.equal(
    taskReducer(requested, { type: "requestDelete", pending }),
    requested,
  );
  assert.deepEqual(
    taskReducer(requested, { type: "undoDelete" }).tasks,
    state.tasks,
  );
  assert.deepEqual(
    taskReducer(requested, { type: "confirmDelete", token: batch.token }).tasks,
    [task],
  );
});

test("reset cancels pending deletion and copies initial tasks", () => {
  const state = taskReducer(initial(), { type: "requestDelete", pending });
  const reset = taskReducer(state, { type: "reset", tasks: [task] });
  assert.equal(reset.pending, null);
  assert.deepEqual(reset.tasks, [task]);
  assert.notEqual(reset.tasks[0], task);
  assert.equal(
    taskReducer(reset, { type: "confirmDelete", token: pending.token }),
    reset,
  );
});
