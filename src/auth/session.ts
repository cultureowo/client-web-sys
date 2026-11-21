import { ApiError, httpClient } from "../api/httpClient";

export interface User {
  id: number;
  username: string;
  email: string;
}

let session: { user: User; accessToken: string; signal: AbortSignal } | null =
  null;
let lifetime: AbortController | null = null;
const listeners = new Set<() => void>();
export const getSession = () => session;
export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function publish(value: typeof session) {
  session = value;
  listeners.forEach((listener) => listener());
}

export async function login(
  credentials: { username: string; password: string },
  signal?: AbortSignal,
) {
  const result = await httpClient<{ accessToken: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
    signal,
  });
  if (!result?.accessToken) throw new ApiError("API не повернув токен.");
  const user = await httpClient<User>("/auth/me", {
    accessToken: result.accessToken,
    signal,
  });
  signal?.throwIfAborted();
  if (!Number.isInteger(user?.id) || !user.username)
    throw new ApiError("API не повернув профіль користувача.");
  lifetime?.abort();
  lifetime = new AbortController();
  publish({ user, accessToken: result.accessToken, signal: lifetime.signal });
}

export function logout() {
  lifetime?.abort();
  lifetime = null;
  publish(null);
}
