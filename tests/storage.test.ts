import { test } from "node:test";
import assert from "node:assert/strict";
import { readStoredValue } from "../src/hooks/useLocalStorage.ts";

const valid = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === "string");
test("storage accepts saved empty arrays and falls back for absent, corrupt or invalid data", () => {
  for (const [stored, expected] of [
    [null, ["fallback"]],
    ["[]", []],
    ['["React"]', ["React"]],
    ["broken JSON", ["fallback"]],
    ['{"wrong":true}', ["fallback"]],
  ] as const) {
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: { getItem: () => stored },
    });
    assert.deepEqual(readStoredValue("test", ["fallback"], valid), expected);
  }
  delete (globalThis as Record<string, unknown>).localStorage;
});
test("blocked storage does not crash initialization", () => {
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    get() {
      throw new Error("SecurityError");
    },
  });
  assert.deepEqual(readStoredValue("test", ["fallback"], valid), ["fallback"]);
  delete (globalThis as Record<string, unknown>).localStorage;
});
