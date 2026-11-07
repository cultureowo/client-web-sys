import { useContext } from "react";
import { TaskContext } from "../context/TaskContext";

export function useTaskContext() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error(
      "useTaskContext потрібно використовувати всередині TaskProvider.",
    );
  }
  return context;
}
