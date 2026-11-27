import type { CSSProperties } from "react";
import { X, Undo2 } from "lucide-react";
import { useTaskContext } from "../hooks/useTaskContext";
import { DELETE_DELAY } from "../context/TaskProvider";
import "./Toast.scss";

export function Toast() {
  const { pending, toast, undoDelete, confirmDelete, dismissToast } =
    useTaskContext();
  return (
    <div className="toasts" aria-label="Сповіщення">
      {pending && (
        <div key={pending.token} className="toast toast--pending" role="status">
          <p className="toast__message">
            {pending.phase === "confirm"
              ? `Видалити завдання (${pending.tasks.length})?`
              : `Завдань до видалення: ${pending.tasks.length}. Залишилось до 5 секунд.`}
          </p>
          {pending.phase === "confirm" && (
            <button className="toast__undo" onClick={confirmDelete}>
              Підтвердити видалення
            </button>
          )}
          <button className="toast__undo" onClick={undoDelete}>
            <Undo2 size={16} /> Скасувати
          </button>
          {pending.phase === "waiting" && (
            <div className="toast__track" aria-hidden="true">
              <span
                className="toast__progress"
                style={{ "--duration": `${DELETE_DELAY}ms` } as CSSProperties}
              />
            </div>
          )}
        </div>
      )}
      {toast && (
        <div
          key={toast.id}
          className={`toast toast--${toast.kind}`}
          role={toast.kind === "error" ? "alert" : "status"}
        >
          <p className="toast__message">{toast.message}</p>
          <button
            className="toast__close"
            onClick={dismissToast}
            aria-label="Закрити сповіщення"
          >
            <X size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
