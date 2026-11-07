import { Layers, CircleCheck, Clock3, TrendingUp } from "lucide-react";
import { useTaskContext } from "../hooks/useTaskContext";
import "./TaskStats.scss";
export function TaskStats() {
  const { tasks, completed } = useTaskContext();
  const total = tasks.length;
  const progress = total ? Math.round((completed / total) * 100) : 0;
  return (
    <section className="stats" aria-label="Статистика завдань">
      <article className="stats__card">
        <span className="stats__icon stats__icon--blue">
          <Layers size={21} />
        </span>
        <div>
          <p>Усього завдань</p>
          <strong>{total}</strong>
        </div>
      </article>
      <article className="stats__card">
        <span className="stats__icon stats__icon--purple">
          <Clock3 size={21} />
        </span>
        <div>
          <p>Не виконано</p>
          <strong>{total - completed}</strong>
        </div>
      </article>
      <article className="stats__card">
        <span className="stats__icon stats__icon--green">
          <CircleCheck size={21} />
        </span>
        <div>
          <p>Виконано</p>
          <strong>{completed}</strong>
        </div>
      </article>
      <article className="stats__card stats__card--progress">
        <span className="stats__icon stats__icon--blue">
          <TrendingUp size={21} />
        </span>
        <div className="stats__progress">
          <p>
            Твій прогрес <strong>{progress}%</strong>
          </p>
          <progress
            value={progress}
            max="100"
            aria-label="Відсоток виконаних завдань"
          />
          <small>
            {progress === 100
              ? "Чудова робота! Усе виконано."
              : "Кожен крок наближає до мети"}
          </small>
        </div>
      </article>
    </section>
  );
}
