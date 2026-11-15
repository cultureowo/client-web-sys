import "./App.scss";
import { useState } from "react";
import { Plus, Sparkles } from "lucide-react";
import { Header } from "./components/Header";
import { TaskForm } from "./components/TaskForm";
import { TaskStats } from "./components/TaskStats";
import { TaskFilters } from "./components/TaskFilters";
import { TaskList } from "./components/TaskList";
import { useTaskContext } from "./hooks/useTaskContext";
import { Toast } from "./components/Toast";
import { Pagination } from "./components/Pagination";
import { TaskDetails } from "./components/TaskDetails";
import { ApiNotice } from "./components/ApiNotice";
import "./styles/app.scss";

export default function App() {
  const [dark, setDark] = useState(false);
  const {
    tasks,
    completed,
    visibleTasks,
    editingTask,
    clearCompleted,
    resetTasks,
    pending,
    storageError,
    mutation,
    mutationError,
    status,
    reload,
    selectedId,
    selectTask,
    sessionChanges,
  } = useTaskContext();
  const selectedTask = tasks.find((task) => task.id === selectedId);

  return (
    <div className={`planner${dark ? " planner--dark" : ""}`}>
      <Header dark={dark} onThemeChange={() => setDark((value) => !value)} />
      <main className="planner__main">
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
              Звільни думки від списків. Плануй, навчайся та помічай свій
              прогрес.
            </p>
          </div>
          <a
            className="button button--primary intro__action"
            href="#task-title"
          >
            <Plus size={19} /> Нове завдання
          </a>
        </section>
        <ApiNotice />
        <TaskStats />
        <div className="planner__workspace">
          <aside>
            <TaskForm key={editingTask?.id ?? "new"} task={editingTask} />
            <div className="note">
              <Sparkles size={20} />
              <p>
                Не потрібно встигнути все.
                <br />
                <strong>Достатньо почати з одного.</strong>
              </p>
            </div>
          </aside>
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
                    !completed ||
                    !!pending ||
                    !!mutation ||
                    status !== "success"
                  }
                  onClick={clearCompleted}
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
                {mutationError} Дані форми збережено; повторіть дію.
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
        {storageError && (
          <p className="planner__notice" role="alert">
            {storageError}
          </p>
        )}
      </main>
      <Toast />
      {selectedTask && (
        <TaskDetails
          key={selectedTask.id}
          seed={selectedTask}
          override={sessionChanges[selectedTask.id] ?? undefined}
          onClose={() => selectTask(null)}
        />
      )}
      <footer className="planner__footer">
        <span>Study Planner ✦ Навчайся у своєму ритмі</span>
        <span>Кожен крок має значення.</span>
      </footer>
    </div>
  );
}
