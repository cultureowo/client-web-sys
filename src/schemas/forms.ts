import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().trim().min(1, "Введіть ім’я користувача."),
  password: z.string().min(6, "Введіть щонайменше 6 символів."),
});

export const taskSchema = z.object({
  title: z.string().trim().min(1, "Введіть назву.").max(140),
  description: z.string().trim().max(1000),
  category: z.string().trim().min(1, "Введіть категорію.").max(40),
  priority: z.enum(["low", "medium", "high"]),
  categoryColor: z.string().regex(/^#[0-9a-f]{6}$/i),
});
