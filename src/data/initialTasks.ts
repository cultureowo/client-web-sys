import type { Task } from "../types/task";
export const initialTasks: Task[] = [
  {
    id: "react",
    title: "Розібратися з React-компонентами",
    description:
      "Опрацювати props, JSX та композицію компонентів. Закріпити все на практиці.",
    completed: false,
    priority: "high",
    category: "React",
    categoryColor: "#6284f5",
  },
  {
    id: "typescript",
    title: "Практика з TypeScript",
    description:
      "Описати інтерфейси та потренуватися працювати з union-типами.",
    completed: false,
    priority: "medium",
    category: "TypeScript",
    categoryColor: "#a37cf0",
  },
  {
    id: "design",
    title: "Дослідити принципи UI-дизайну",
    description:
      "Переглянути приклади візуальної ієрархії та зібрати власні референси.",
    completed: false,
    priority: "low",
    category: "Дизайн",
    categoryColor: "#dc9343",
  },
  {
    id: "setup",
    title: "Підготувати середовище розробки",
    description:
      "Встановити Node.js, створити Vite-проєкт і налаштувати редактор.",
    completed: true,
    priority: "high",
    category: "Практика",
    categoryColor: "#24a88b",
  },
];
