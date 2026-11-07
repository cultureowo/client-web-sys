import { Search } from "lucide-react";
import type { StatusFilter, SortOrder } from "../types/task";
import { useTaskContext } from "../hooks/useTaskContext";
import "./TaskFilters.scss";
export function TaskFilters() {
  const {
    filter,
    setFilter: onFilter,
    search,
    setSearch: onSearch,
    sort,
    setSort: onSort,
    tasks,
    completed,
  } = useTaskContext();
  const total = tasks.length;
  const filters: { id: StatusFilter; label: string; count: number }[] = [
    { id: "all", label: "Усі", count: total },
    { id: "active", label: "Не виконані", count: total - completed },
    { id: "completed", label: "Виконані", count: completed },
  ];
  return (
    <div className="filters">
      <div className="filters__tabs" role="group" aria-label="Фільтр за станом">
        {filters.map((item) => (
          <button
            key={item.id}
            className={`filters__tab${filter === item.id ? " filters__tab--active" : ""}`}
            aria-pressed={filter === item.id}
            onClick={() => onFilter(item.id)}
          >
            {item.label}
            <span>{item.count}</span>
          </button>
        ))}
      </div>
      <div className="filters__tools">
        <label className="filters__search">
          <Search size={18} />
          <input
            type="search"
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Знайти завдання…"
            aria-label="Пошук за назвою"
          />
        </label>
        <select
          className="filters__sort"
          aria-label="Сортування за пріоритетом"
          value={sort}
          onChange={(event) => onSort(event.target.value as SortOrder)}
        >
          <option value="default">За порядком додавання</option>
          <option value="high">Спочатку високий пріоритет</option>
          <option value="low">Спочатку низький пріоритет</option>
        </select>
      </div>
    </div>
  );
}
