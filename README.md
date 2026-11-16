# Study Planner · Lab 10

Built with Vite, React 19, and TypeScript. REST API: DummyJSON Todos. Styling uses SCSS with BEM conventions, with styles located alongside their components. Requires **Node.js 22.22 or later**; tested with version 24.13.0.

## Getting Started

Install dependencies:

```sh
npm ci
```

Create `.env` from `.env.example`. In PowerShell:

```powershell
Copy-Item .env.example .env
npm run dev
```

Configuration:

```dotenv
VITE_API_URL=https://dummyjson.com
```

Restart Vite after changing `.env`. If PowerShell blocks script execution, use `npm.cmd` instead of `npm`. The `.env` file is excluded from Git; `.env.example` contains only the public API URL. Variables prefixed with `VITE_` are exposed to the client and must not contain secrets.

## Validation

```sh
npm run lint
npm test
npm run build
npm run preview
```

The 16 tests use the built-in Node.js test runner without an additional testing framework. They cover HTTP errors, JSON parsing, AbortSignal support, DTO mapping, CRUD payloads, duplicate IDs returned by POST requests, session records, reducer behavior, and safe loading of stored preferences.

## Features

- Task list retrieval through GET with server-side pagination: 10 tasks per page, previous/next controls, and a page indicator.
- Task details retrieved through a separate GET request by ID, with loading, error, and retry states. Details open using the eye icon and can be closed with Escape.
- Task creation through POST, editing and completion updates through PATCH, and deletion through DELETE after confirmation.
- Loading indicators, retry controls for failed requests, success toasts, and empty states.
- AbortController support for list and detail requests, with cleanup when switching pages or closing details.
- Forms reset only after a successful submission; entered values are preserved after an error.
- Deletion confirmation followed by a five-second undo window before the HTTP DELETE request. Failed deletion requests leave the task in the interface.
- Bulk deletion of completed tasks on the current page, with confirmation and undo support.
- Search with a 300 ms debounce, filtering and sorting within the current page, and derived task statistics.
- Refreshing the list repeats the GET request while preserving session changes. Resetting changes discards those changes and loads the first page.
- Light and dark themes and a responsive interface.

## DummyJSON Behavior

DummyJSON simulates mutations without persisting them on the server. After a successful request, the interface updates locally. Changes remain available when navigating between pages within the current application session but are discarded on browser reload. Description, priority, category, and category color are client-only metadata and are not included as unsupported fields in API requests.

POST requests may return duplicate IDs. Created records therefore receive unique `session:UUID` identifiers and appear on the first page in addition to its 10 server records. Subsequent detail retrieval, editing, completion updates, and deletion of these records are handled locally by the repository because the records do not exist on the server. Records retrieved from the API use actual GET-by-ID, PATCH, and DELETE requests.

Pagination uses the server's `total` value. Statistics are calculated from the current page, including session changes. Deleted records are not automatically replaced with records from the next page, so a page may contain fewer than 10 tasks.

Only the **active filter** is stored in localStorage. The legacy task storage key from Lab 9 is ignored. API data is neither loaded from nor written to localStorage as a second source of truth.

## Architecture

```text
UI → TaskContext / useTasks → taskRepository → httpClient → REST API

src/
  api/httpClient.ts                 # fetch, base URL, response.ok, error handling
  repositories/taskRepository.ts    # endpoints, DTO mapping, CRUD operations
  types/api.ts                      # ApiTodo, TodosResponse
  types/task.ts                     # domain Task, TaskDraft
  hooks/useTasks.ts                 # task list state, async lifecycle, cancellation
  hooks/useDebouncedValue.ts         # search debounce
  hooks/useLocalStorage.ts           # client/UI state persistence
  context/TaskProvider.tsx           # UI state, actions, toasts, and undo
  reducers/taskReducer.ts            # loading state and mutation results
  components/TaskDetails.tsx         # local async state for task details
  components/Pagination.tsx
  components/RequestState.tsx
  components/TaskForm.tsx
  components/...                    # additional components with their own SCSS
  App.tsx                           # UI composition
tests/
```

The reducer stores the current page response and a journal of successful session changes. The visible task list is derived from these values without maintaining an independent copy of the tasks. Context exposes this state and its operations without creating another task state. Task details are loaded into local state within `TaskDetails` rather than stored in the global Context.

Materials from previous labs are retained as historical documentation: [Lab 9](docs/lab-09.md) and [Lab 8](docs/lab-08.md). They describe earlier versions rather than the current REST architecture.
