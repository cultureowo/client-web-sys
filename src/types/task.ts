export type Priority = "low" | "medium" | "high";
export type StatusFilter = "all" | "active" | "completed";
export type SortOrder = "default" | "high" | "low";
export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: Priority;
  category: string;
  categoryColor: string;
  origin?: "api" | "session";
  userId?: number;
  // Client-owned metadata. DummyJSON does not supply these timestamps or names.
  createdAt?: string;
  createdBy?: string;
}
export type TaskDraft = Pick<
  Task,
  "title" | "description" | "priority" | "category" | "categoryColor"
>;
export const priorityLabels: Record<Priority, string> = {
  low: "Низький",
  medium: "Середній",
  high: "Високий",
};
export const categoryColors = [
  "#6284f5",
  "#a37cf0",
  "#24a88b",
  "#dc9343",
  "#db7199",
];
