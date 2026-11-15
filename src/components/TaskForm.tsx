import { useState } from "react";
import type { SubmitEvent, CSSProperties } from "react";
import { Plus, ArrowUpRight } from "lucide-react";
import { categoryColors, priorityLabels } from "../types/task";
import type { Task, Priority } from "../types/task";
import { useTaskContext } from "../hooks/useTaskContext";
import "./TaskForm.scss";
export function TaskForm({ task }: { task?: Task }) {
  const {
    addTask,
    updateTask,
    cancelEditing,
    reportError,
    mutation,
    pending,
    status,
  } = useTaskContext();
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [category, setCategory] = useState(task?.category ?? "");
  const [priority, setPriority] = useState<Priority>(
    task?.priority ?? "medium",
  );
  const [color, setColor] = useState(task?.categoryColor ?? categoryColors[0]);
  const [error, setError] = useState("");
  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim()) {
      setError("Введи назву завдання — не лише пробіли.");
      reportError("Не вдалося зберегти: введіть назву завдання.");
      return;
    }
    const draft = {
      title: title.trim(),
      description: description.trim(),
      category: category.trim() || "Без категорії",
      priority,
      categoryColor: color,
    };
    const success = await (task ? updateTask(task.id, draft) : addTask(draft));
    if (!success) return;
    setTitle("");
    setDescription("");
    setCategory("");
    setPriority("medium");
    setColor(categoryColors[0]);
    setError("");
  }
  return (
    <section className="task-form">
      <div className="task-form__heading">
        <span className="task-form__icon">
          <Plus size={21} />
        </span>
        <h2>{task ? "Редагувати завдання" : "Нове завдання"}</h2>
        <ArrowUpRight size={19} />
      </div>
      <p className="task-form__intro">З чого почнемо сьогодні?</p>
      <form onSubmit={submit} noValidate>
        <fieldset
          className="task-form__fields"
          disabled={!!mutation || !!pending || status !== "success"}
        >
          <legend className="task-form__legend">Поля завдання</legend>
          <label className="field" htmlFor="task-title">
            Назва <span>*</span>
            <input
              autoFocus={!!task}
              id="task-title"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                setError("");
              }}
              placeholder="Що плануєш вивчити?"
              required
              maxLength={140}
              aria-invalid={!!error}
              aria-describedby={error ? "title-error" : undefined}
            />
          </label>
          {error && (
            <p className="task-form__error" id="title-error" role="alert">
              {error}
            </p>
          )}
          <label className="field" htmlFor="task-description">
            Опис <span className="field__optional">необов’язково</span>
            <textarea
              id="task-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Кілька деталей або маленьких кроків…"
              rows={3}
              maxLength={1000}
            />
          </label>
          <label className="field" htmlFor="task-category">
            Категорія
            <input
              id="task-category"
              list="categories"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              placeholder="Наприклад, React"
              maxLength={40}
            />
          </label>
          <datalist id="categories">
            <option value="React" />
            <option value="TypeScript" />
            <option value="Дизайн" />
            <option value="Практика" />
          </datalist>
          <fieldset className="task-form__colors">
            <legend>Колір категорії</legend>
            {categoryColors.map((value, index) => (
              <button
                key={value}
                type="button"
                className={`task-form__color${color === value ? " task-form__color--selected" : ""}`}
                style={{ "--swatch": value } as CSSProperties}
                aria-label={
                  ["Синій", "Фіолетовий", "Зелений", "Помаранчевий", "Рожевий"][
                    index
                  ]
                }
                aria-pressed={color === value}
                onClick={() => setColor(value)}
              />
            ))}
          </fieldset>
          <label className="field" htmlFor="task-priority">
            Пріоритет
            <select
              id="task-priority"
              value={priority}
              onChange={(event) => setPriority(event.target.value as Priority)}
            >
              {Object.entries(priorityLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <button
            className="button button--primary task-form__submit"
            type="submit"
          >
            <Plus size={18} />{" "}
            {mutation
              ? "Обробка запиту…"
              : task
                ? "Зберегти зміни"
                : "Додати завдання"}
          </button>
          {task && (
            <button
              type="button"
              className="button task-form__cancel"
              onClick={cancelEditing}
            >
              Скасувати редагування
            </button>
          )}
        </fieldset>
        <p className="task-form__hint">
          Маленький план — початок великих змін.
        </p>
      </form>
    </section>
  );
}
