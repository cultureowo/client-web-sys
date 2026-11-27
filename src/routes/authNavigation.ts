import { useLocation, useNavigate } from "react-router";
import { getSession } from "../auth/session";

export function loginPath(destination: string) {
  return "/login?" + new URLSearchParams({ next: destination });
}

export function returnPath(value: string | null) {
  if (
    !value ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\")
  )
    return "/tasks";
  try {
    const url = new URL(value, window.location.origin);
    if (
      url.origin !== window.location.origin ||
      !/^\/(tasks(?:\/[^/]+)?|profile)$/.test(url.pathname)
    )
      return "/tasks";
    return url.pathname + url.search + url.hash;
  } catch {
    return "/tasks";
  }
}

export function useRequireLogin() {
  const location = useLocation();
  const navigate = useNavigate();
  return () => {
    if (getSession()) return true;
    void navigate(loginPath(location.pathname + location.search));
    return false;
  };
}
