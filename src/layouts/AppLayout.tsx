import { useState } from "react";
import { Outlet } from "react-router";
import { AuthProvider } from "../context/AuthProvider";
import { TaskProvider } from "../context/TaskProvider";
import { Header } from "../components/Header";
import { Toast } from "../components/Toast";
import "../App.scss";
import "../styles/app.scss";

export function AppLayout() {
  const [dark, setDark] = useState(false);
  return (
    <AuthProvider>
      <TaskProvider>
        <div className={`planner${dark ? " planner--dark" : ""}`}>
          <Header
            dark={dark}
            onThemeChange={() => setDark((value) => !value)}
          />
          <main className="planner__main">
            <Outlet />
          </main>
          <Toast />
          <footer className="planner__footer">Study Planner</footer>
        </div>
      </TaskProvider>
    </AuthProvider>
  );
}
