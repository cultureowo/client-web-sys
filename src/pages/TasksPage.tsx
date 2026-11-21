import { TaskFormDialog } from "../components/TaskFormDialog";
import { useRequireLogin } from "../routes/authNavigation";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { Plus, Sparkles } from "lucide-react";
import { TaskStats } from "../components/TaskStats";
import { TaskFilters } from "../components/TaskFilters";
import { TaskList } from "../components/TaskList";
import { useTaskContext } from "../hooks/useTaskContext";
import { Pagination } from "../components/Pagination";
import { ApiNotice } from "../components/ApiNotice";

export function TasksPage() {
  const [creating, setCreating] = useState(false);
  const requireLogin = useRequireLogin();
  const { isAuthenticated } = useAuth();
  const {
    tasks,
    completed,
    visibleTasks,
    clearCompleted,
    resetTasks,
    pending,
    mutation,
    mutationError,
    status,
    reload,
    addTask,
  } = useTaskContext();

  return (
    <>
      <section className="intro">
        <div>
          <p className="intro__eyebrow">
            <Sparkles size={15} /> ТВІЙ ПРОСТІР ДЛЯ НАВЧАННЯ
          </p>
          <h1>
            Великі цілі.
            <br />
            <span>Маленькі кроки.</span>
          </h1>
          <p className="intro__description">
            Звільни думки від списків. Плануй, навчайся та помічай свій прогрес.
          </p>
        </div>
        <button
          className="button button--primary"
          disabled={!!pending || !!mutation || status !== "success"}
          onClick={() => {
            if (requireLogin()) setCreating(true);
          }}
        >
          <Plus size={19} /> Нове завдання
        </button>
      </section>
      <ApiNotice />
      <TaskStats />
      <div className="tasks-page">
        <section className="tasks" aria-labelledby="tasks-heading">
          <div className="tasks__heading">
            <div>
              <p className="section-label">КРОК ЗА КРОКОМ</p>
              <h2 id="tasks-heading">
                Мої завдання <span>{tasks.length}</span>
              </h2>
            </div>
            <div className="tasks__actions">
              <button
                className="button button--quiet"
                disabled={
                  !completed || !!pending || !!mutation || status !== "success"
                }
                onClick={() => {
                  if (requireLogin()) clearCompleted();
                }}
              >
                Очистити виконані на сторінці
              </button>
              <button
                className="button button--quiet"
                disabled={!!mutation}
                onClick={resetTasks}
              >
                Скинути зміни
              </button>
              <button
                className="button button--quiet"
                disabled={!!pending || !!mutation || status === "loading"}
                onClick={reload}
              >
                Оновити список
              </button>
            </div>
          </div>
          <TaskFilters />
          {mutation && (
            <p className="tasks__operation" role="status" aria-live="polite">
              {mutation}
            </p>
          )}
          {mutationError && (
            <p
              className="tasks__operation tasks__operation--error"
              role="alert"
            >
              {mutationError} Повторіть дію, коли сервіс буде доступний.
            </p>
          )}
          <TaskList />
          <Pagination />
          <p className="tasks__result">
            Показано {visibleTasks.length} із {tasks.length} завдань поточної
            сторінки
          </p>
        </section>
      </div>
      {creating && isAuthenticated && (
        <TaskFormDialog
          mode="create"
          onClose={() => setCreating(false)}
          onSubmit={addTask}
        />
      )}
    </>
  );
}
