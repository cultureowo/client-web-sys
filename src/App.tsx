import { useState } from "react";
import { Plus, Sparkles } from "lucide-react";
import { Header } from "./components/Header";
import { TaskForm } from "./components/TaskForm";
import { TaskStats } from "./components/TaskStats";
import { TaskFilters } from "./components/TaskFilters";
import { TaskList } from "./components/TaskList";
import { initialTasks } from "./data/initialTasks";
import type { Task, TaskDraft, StatusFilter, SortOrder } from "./types/task";
import "./styles/app.scss";

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOrder>("default");
  const [dark, setDark] = useState(false);
  const [notice, setNotice] = useState("");
  const completed = tasks.filter((task) => task.completed).length;
  const ranks = { high: 3, medium: 2, low: 1 };
  const visibleTasks = tasks
    .filter(
      (task) =>
        (filter === "all" || task.completed === (filter === "completed")) &&
        task.title
          .toLocaleLowerCase("uk")
          .includes(search.trim().toLocaleLowerCase("uk")),
    )
    .sort((a, b) =>
      sort === "default"
        ? 0
        : (ranks[b.priority] - ranks[a.priority]) * (sort === "high" ? 1 : -1),
    );

  function addTask(draft: TaskDraft) {
    setTasks((previous) => [
      { ...draft, id: crypto.randomUUID(), completed: false },
      ...previous,
    ]);
    setFilter("all");
    setSearch("");
    setNotice("Завдання додано. Ще один крок до мети!");
  }

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
        <TaskStats total={tasks.length} completed={completed} />
        <div className="planner__workspace">
          <aside>
            <TaskForm onAdd={addTask} />
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
              <button
                className="button button--quiet"
                disabled={!completed}
                onClick={() => {
                  setTasks((previous) =>
                    previous.filter((task) => !task.completed),
                  );
                  setNotice("Виконані завдання очищено.");
                }}
              >
                Очистити виконані
              </button>
            </div>
            <TaskFilters
              filter={filter}
              onFilter={setFilter}
              search={search}
              onSearch={setSearch}
              sort={sort}
              onSort={setSort}
              total={tasks.length}
              completed={completed}
            />
            <TaskList
              tasks={visibleTasks}
              total={tasks.length}
              onToggle={(id) =>
                setTasks((previous) =>
                  previous.map((task) =>
                    task.id === id
                      ? { ...task, completed: !task.completed }
                      : task,
                  ),
                )
              }
              onDelete={(id) => {
                setTasks((previous) =>
                  previous.filter((task) => task.id !== id),
                );
                setNotice("Завдання видалено.");
              }}
            />
            <p className="tasks__result">
              Показано {visibleTasks.length} із {tasks.length} завдань
            </p>
          </section>
        </div>
        <p className="planner__notice" role="status">
          {notice}
        </p>
      </main>
      <footer className="planner__footer">
        <span>Study Planner ✦ Навчайся у своєму ритмі</span>
        <span>Кожен крок має значення.</span>
      </footer>
    </div>
  );
}
