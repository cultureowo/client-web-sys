import { useTaskContext } from "../hooks/useTaskContext";
import "./ApiNotice.scss";

export function ApiNotice() {
  const { serverTotal } = useTaskContext();
  return (
    <aside className="api-notice" aria-label="Особливості навчальних даних">
      <strong>Навчальний режим · {serverTotal} завдань в API</strong>
      <p>
        Створення, редагування й видалення діють до перезавантаження сторінки:
        навчальний сервіс імітує збереження. Додаткові поля зберігаються лише в
        поточній сесії.
      </p>
      <p>
        Статистика, фільтри та пошук стосуються поточної сторінки. Нові завдання
        додаються на першу сторінку.
      </p>
    </aside>
  );
}
