import { createContext, useContext } from "react";
import { getSession, login, logout } from "../auth/session";

export const AuthContext = createContext<{
  session: ReturnType<typeof getSession>;
  isAuthenticated: boolean;
  login: typeof login;
  logout: typeof logout;
} | null>(null);

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("AuthProvider is required.");
  return value;
}
