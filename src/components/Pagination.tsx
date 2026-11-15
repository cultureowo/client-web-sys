import { useTaskContext } from "../hooks/useTaskContext";
import "./Pagination.scss";

export function Pagination() {
  const { page, pageSize, serverTotal, setPage, pending, mutation } =
    useTaskContext();
  const pages = Math.max(1, Math.ceil(serverTotal / pageSize));
  const busy = !!pending || !!mutation;
  return (
    <nav className="pagination" aria-label="Сторінки завдань">
      <button
        className="button pagination__button"
        disabled={page <= 1 || busy}
        onClick={() => setPage(page - 1)}
      >
        Попередня
      </button>
      <span className="pagination__position" aria-live="polite">
        Сторінка {page} з {pages}
      </span>
      <button
        className="button pagination__button"
        disabled={page >= pages || busy}
        onClick={() => setPage(page + 1)}
      >
        Наступна
      </button>
    </nav>
  );
}
