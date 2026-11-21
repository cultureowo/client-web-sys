import { useSyncExternalStore, type ReactNode } from "react";
import { getSession, login, logout, subscribe } from "../auth/session";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  const session = useSyncExternalStore(subscribe, getSession);
  return (
    <AuthContext.Provider
      value={{ session, isAuthenticated: !!session, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
