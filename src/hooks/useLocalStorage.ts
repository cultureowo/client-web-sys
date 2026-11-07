import { useEffect, useState } from "react";

export function readStoredValue<T>(
  key: string,
  fallback: T,
  validate: (value: unknown) => value is T,
): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored === null) return fallback;
    const value: unknown = JSON.parse(stored);
    return validate(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

// The key identifies this hook instance and must stay constant while mounted.
export function useLocalStorage<T>(
  key: string,
  fallback: T,
  validate: (value: unknown) => value is T,
) {
  const [value, setValue] = useState<T>(() => readStoredValue(key, fallback, validate));
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      setError("");
    } catch {
      setError("Сховище браузера недоступне. Налаштування збережені лише до перезавантаження.");
    }
  }, [key, value]);

  return [value, setValue, error] as const;
}
