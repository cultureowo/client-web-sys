import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema } from "../schemas/forms";
import {
  categoryColors,
  priorityLabels,
  type Task,
  type TaskDraft,
} from "../types/task";
import "./FormFields.scss";
import "./TaskFormDialog.scss";

export function TaskFormDialog({
  mode,
  task,
  onClose,
  onSubmit,
}: {
  mode: "create" | "edit";
  task?: Task;
  onClose: () => void;
  onSubmit: (draft: TaskDraft) => Promise<boolean>;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<TaskDraft>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title ?? "",
      description: task?.description ?? "",
      category: task?.category ?? "",
      priority: task?.priority ?? "medium",
      categoryColor: task?.categoryColor ?? categoryColors[0],
    },
  });
  useEffect(() => {
    const element = dialog.current;
    element?.showModal();
    return () => element?.close();
  }, []);

  return (
    <dialog
      ref={dialog}
      className="task-form-dialog"
      aria-labelledby="task-form-title"
      onCancel={(event) => {
        event.preventDefault();
        if (!isSubmitting) onClose();
      }}
    >
      <h2 id="task-form-title">
        {mode === "create" ? "Нове завдання" : "Редагувати завдання"}
      </h2>
      <form
        noValidate
        onSubmit={handleSubmit(async (draft) => {
          if (await onSubmit(draft)) onClose();
          else
            setError("root", {
              message:
                "Зміни не збережено. Перевірте повідомлення про помилку та повторіть.",
            });
        })}
      >
        <fieldset className="form__fields" disabled={isSubmitting}>
          <label className="field">
            Назва
            <input
              autoFocus
              maxLength={140}
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? "task-title-error" : undefined}
              {...register("title")}
            />
          </label>
          {errors.title && (
            <p id="task-title-error" className="form__error" role="alert">
              {errors.title.message}
            </p>
          )}
          <label className="field">
            Опис
            <textarea maxLength={1000} {...register("description")} />
          </label>
          {errors.description && (
            <p className="form__error" role="alert">
              {errors.description.message}
            </p>
          )}
          <label className="field">
            Категорія
            <input
              maxLength={40}
              aria-invalid={!!errors.category}
              aria-describedby={
                errors.category ? "task-category-error" : undefined
              }
              {...register("category")}
            />
          </label>
          {errors.category && (
            <p
              id="task-category-error"
              className="form__error"
              role="alert"
            >
              {errors.category.message}
            </p>
          )}
          <label className="field">
            Пріоритет
            <select {...register("priority")}>
              {Object.entries(priorityLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          {errors.priority && (
            <p className="form__error" role="alert">
              {errors.priority.message}
            </p>
          )}
          <label className="field">
            Колір категорії
            <input type="color" {...register("categoryColor")} />
          </label>
          {errors.categoryColor && (
            <p className="form__error" role="alert">
              {errors.categoryColor.message}
            </p>
          )}
          <button className="button button--primary" type="submit">
            {isSubmitting ? "Збереження…" : "Зберегти"}
          </button>
          <button
            className="button button--quiet"
            type="button"
            onClick={onClose}
          >
            Скасувати
          </button>
        </fieldset>
        {errors.root && <p role="alert">{errors.root.message}</p>}
      </form>
    </dialog>
  );
}
