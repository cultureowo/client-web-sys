export class ApiError extends Error {
  status: number;
  constructor(message: string, status = 0) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === "AbortError";
}

export function errorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof TypeError)
    return "Не вдалося з’єднатися з API. Перевірте інтернет і спробуйте ще раз.";
  return "Не вдалося виконати операцію. Спробуйте ще раз.";
}

export function createHttpClient(baseUrl: string) {
  return async function request<T>(
    path: string,
    options: RequestInit & { accessToken?: string } = {},
  ): Promise<T> {
    if (!baseUrl)
      throw new ApiError(
        "Не налаштовано VITE_API_URL. Задайте адресу API та перезапустіть Vite.",
      );
    let url: URL;
    try {
      url = new URL(
        `${baseUrl.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`,
      );
      if (!["http:", "https:"].includes(url.protocol))
        throw new Error("Invalid protocol");
    } catch {
      throw new ApiError("Некоректне значення VITE_API_URL.");
    }
    const { accessToken, ...init } = options;
    const headers = new Headers(init.headers);
    if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);
    headers.set("Accept", "application/json");
    if (options.body) headers.set("Content-Type", "application/json");
    const response = await fetch(url, { ...init, headers });
    if (!response.ok) {
      const message =
        response.status === 401
          ? "Не вдалося підтвердити особу. Перевірте дані входу або увійдіть повторно."
          : response.status === 404
            ? "Завдання не знайдено на сервері."
            : response.status >= 500
              ? "Сервер тимчасово недоступний. Спробуйте ще раз."
              : "API відхилив запит. Спробуйте ще раз.";
      throw new ApiError(
        `${message} (HTTP ${response.status})`,
        response.status,
      );
    }
    if (response.status === 204) return undefined as T;
    try {
      return (await response.json()) as T;
    } catch (error) {
      if (isAbortError(error)) throw error;
      throw new ApiError("API повернув некоректний JSON.");
    }
  };
}

export const httpClient = createHttpClient(import.meta.env?.VITE_API_URL ?? "");
