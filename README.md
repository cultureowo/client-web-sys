# Study Planner · Лабораторна №10

Vite + React 19 + TypeScript. REST API: DummyJSON Todos. Стилізація: SCSS + BEM, стилі поряд із компонентами. Потрібен Node.js **22.22 або новіший**; перевірено на 24.13.0.

## Запуск

```sh
npm ci
```

Створіть `.env` за зразком `.env.example`. У PowerShell:

```powershell
Copy-Item .env.example .env
npm run dev
```

Конфігурація:

```dotenv
VITE_API_URL=https://dummyjson.com
```

Після зміни `.env` перезапустіть Vite. У PowerShell із забороненими скриптами використовуйте `npm.cmd`. `.env` не відстежується Git; `.env.example` містить лише публічний URL. Змінні з `VITE_` доступні клієнту — не кладіть у них секрети.

## Перевірки

```sh
npm run lint
npm test
npm run build
npm run preview
```

16 тестів використовують вбудований test runner Node.js, без окремого тестового фреймворку. Вони перевіряють HTTP-помилки, JSON, AbortSignal, DTO mapping, payload CRUD, повторні ID після POST, сесійні записи, reducer та безпечне читання налаштувань.

## Можливості

- GET списку: серверна пагінація по 10 завдань, Previous/Next і номер сторінки.
- Окремий GET деталей за ID: доступна кнопка з іконкою ока, loading/error/retry, закриття клавішею Escape.
- POST створення, PATCH редагування/виконання, DELETE після підтвердження.
- Loading, error з повторним запитом, success із Toast, empty state.
- AbortController для списку й деталей; cleanup при зміні сторінки або закритті деталей.
- Форма очищується тільки після успіху; після помилки введені дані залишаються.
- Підтвердження видалення → 5 секунд Undo → HTTP DELETE. Помилка DELETE залишає завдання в UI.
- Масове очищення виконаних поточної сторінки з підтвердженням та Undo.
- Пошук із debounce 300 мс, фільтри й сортування на поточній сторінці; похідна статистика.
- «Оновити список» повторює GET, зберігаючи зміни поточної сесії. «Скинути зміни» відкидає ці зміни й завантажує першу сторінку.
- Світла/темна тема, адаптивний інтерфейс.

## Важливе про DummyJSON

Сервіс симулює мутації, не записуючи їх назавжди. Після успішного запиту UI оновлюється локально. Зміни зберігаються між переходами сторінок у межах відкритого застосунку, але скидаються при перезавантаженні. Опис, пріоритет, категорія та колір — client-only metadata: вони не надсилаються як вигадані API-поля.

POST може повертати однакові ID. Тому створені записи отримують унікальні `session:UUID` і показуються на першій сторінці понад отримані 10 записів. Їхні подальші деталі, редагування, toggle і видалення обробляються repository локально: на сервері цих записів немає. Для демонстрації справжніх GET за ID, PATCH і DELETE оберіть завдання, отримане зі списку API.

Пагінація рахується за серверним `total`, статистика — за завданнями поточної сторінки з урахуванням сесійних змін. Після видалення записи не підтягуються з наступної сторінки автоматично, тому поточна сторінка може містити менше 10 завдань.

У localStorage зберігається **лише активний фільтр**. Старий ключ завдань із №9 ігнорується. API-дані не читаються й не записуються у localStorage як друге джерело правди.

## Архітектура

```text
UI → TaskContext / useTasks → taskRepository → httpClient → REST API

src/
  api/httpClient.ts                 # fetch, base URL, response.ok, помилки
  repositories/taskRepository.ts    # endpoints, DTO mapping, CRUD
  types/api.ts                      # ApiTodo, TodosResponse
  types/task.ts                     # domain Task, TaskDraft
  hooks/useTasks.ts                 # єдиний стан списку, async lifecycle, abort
  hooks/useDebouncedValue.ts         # debounce пошуку
  hooks/useLocalStorage.ts           # лише client/UI state
  context/TaskProvider.tsx           # UI-стан, дії, Toast та Undo
  reducers/taskReducer.ts            # стан завантаження й результати мутацій
  components/TaskDetails.tsx         # локальний async state деталей
  components/Pagination.tsx
  components/RequestState.tsx
  components/TaskForm.tsx
  components/...                    # інші компоненти з власними .scss
  App.tsx                           # композиція UI
tests/
docs/lab-10.md                       # повний сценарій захисту
```

Reducer зберігає відповідь поточної сторінки й журнал лише успішних змін сесії. Видимий список виводиться з них, без незалежної копії tasks. Context надає посилання на цей стан та операції, не створюючи ще один state завдань. Деталі завантажуються в локальний state `TaskDetails` і не додаються в глобальний Context.

## Документація для захисту

**[Відкрити сценарій захисту №10, пояснення коду та відповіді](docs/lab-10.md).**

Матеріали попередніх робіт залишені як історичні: [№9](docs/lab-09.md), [№8](docs/lab-08.md). Вони описують відповідні попередні версії, а не поточну REST-архітектуру.

Гілка: `feature/rest-api`. Коміти: Conventional Commits. Публікація гілки виконується окремо після підтвердження користувачкою.
