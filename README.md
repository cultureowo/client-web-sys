# Study Planner · Lab 11

Built with Vite, React 19, React Router 8, TypeScript, React Hook Form, and Zod. The application uses DummyJSON for task data and authentication, with SCSS and BEM for styling. Requires **Node.js 22.22 or later**.

## Getting Started

Install dependencies:

```sh
npm ci
```

Create a local `.env` file with the public API URL.

```dotenv
VITE_API_URL=https://dummyjson.com
```

Start the development server.

```sh
npm run dev
```

Restart Vite after changing the local environment configuration. Git ignores all `.env` files. Variables prefixed with `VITE_` are exposed to the browser.

## Routes

| Route | Access | Purpose |
| --- | --- | --- |
| `/` | Public | Redirects to the task list |
| `/tasks` | Public | Task list with server pagination and a URL-based status filter |
| `/tasks/:taskId` | Public | Task details, including available author and creation metadata |
| `/login` | Public | Sign-in form |
| `/profile` | Authenticated | Account information and sign-out |

Declarative Mode is the default. Set `VITE_ROUTER_MODE=data` in the local environment to use Data Mode. Both modes share the same pages and layout. Deployments must serve `index.html` for client-side routes.

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
- Task details retrieved through a separate GET request by ID, with loading, error, and retry states.
- Authentication via DummyJSON and an in-memory session. Login and task forms use React Hook Form with Zod validation.
- Shared modal for creating and editing tasks, with keyboard focus, Escape, and submission state.
- Authenticated task mutations send an Authorization bearer token through the HTTP client.
- Task creation through POST, editing and completion updates through PATCH, and deletion through DELETE after confirmation.
- Loading indicators, retry controls for failed requests, success toasts, and empty states.
- AbortController support for list and detail requests, with cleanup when switching pages or leaving details.
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

The active status filter is stored in the URL as `status=active` or `status=completed`. Task data and the access token stay in memory and are cleared on page reload.

DummyJSON provides a user ID for existing tasks. The app records the author name and creation time locally for tasks created during the session.

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
  auth/session.ts                   # login, profile request, session lifecycle
  context/AuthProvider.tsx          # current account and authentication actions
  layouts/AppLayout.tsx             # shared header, content and notifications
  pages/                            # tasks, task details, login and profile
  schemas/forms.ts                  # Zod schemas for login and task forms
  context/TaskProvider.tsx           # UI state, actions, toasts, and undo
  reducers/taskReducer.ts            # loading state and mutation results
  components/TaskFormDialog.tsx      # shared create and edit form
  components/Pagination.tsx
  components/RequestState.tsx
  components/...                    # additional components with their own SCSS
  App.tsx                           # router configuration and profile guards
tests/
```

The reducer stores the current page response and successful session changes. Task Context exposes the derived task list and its operations. Task Details loads the selected record into local page state. Auth Context exposes the account and authentication actions, while the mutation handler checks the session before calling the repository.
