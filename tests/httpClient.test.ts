import { test } from "node:test";
import assert from "node:assert/strict";
import {
  ApiError,
  createHttpClient,
  errorMessage,
  isAbortError,
} from "../src/api/httpClient.ts";

test("HTTP client builds the configured URL and JSON headers, preserving signal", async (t) => {
  const controller = new AbortController();
  t.mock.method(globalThis, "fetch", async (url: URL, options: RequestInit) => {
    assert.equal(url.href, "https://example.test/api/todos?limit=10&skip=20");
    assert.equal(options.method, "POST");
    assert.equal(options.signal, controller.signal);
    assert.equal(
      new Headers(options.headers).get("Content-Type"),
      "application/json",
    );
    return Response.json({ ok: true });
  });
  assert.deepEqual(
    await createHttpClient("https://example.test/api/")(
      "/todos?limit=10&skip=20",
      { method: "POST", signal: controller.signal, body: "{}" },
    ),
    { ok: true },
  );
});

test("HTTP errors reject even though fetch resolves; invalid JSON is normalized", async (t) => {
  const fetchMock = t.mock.method(
    globalThis,
    "fetch",
    async () => new Response("missing", { status: 404 }),
  );
  const client = createHttpClient("https://example.test");
  await assert.rejects(
    client("/todos/1"),
    (error: unknown) => error instanceof ApiError && error.status === 404,
  );
  fetchMock.mock.mockImplementation(async () => new Response("bad JSON"));
  await assert.rejects(client("/todos"), /JSON/);
  fetchMock.mock.mockImplementation(
    async () => new Response(null, { status: 204 }),
  );
  assert.equal(await client("/todos/1"), undefined);
});

test("missing or invalid base URL is an actionable configuration error", async () => {
  await assert.rejects(createHttpClient("")("/todos"), /VITE_API_URL/);
  await assert.rejects(
    createHttpClient("file:///tmp")("/todos"),
    /VITE_API_URL/,
  );
});

test("abort signal cancels fetch without converting it into an HTTP failure", async (t) => {
  t.mock.method(
    globalThis,
    "fetch",
    async (_url: URL, { signal }: RequestInit) =>
      new Promise((_resolve, reject) => {
        signal?.addEventListener(
          "abort",
          () => reject(new DOMException("Canceled", "AbortError")),
          { once: true },
        );
      }),
  );
  const controller = new AbortController();
  const pending = createHttpClient("https://example.test")("/todos", {
    signal: controller.signal,
  });
  controller.abort();
  await assert.rejects(pending, isAbortError);
  assert.match(errorMessage(new TypeError("Failed to fetch")), /інтернет/);
});
