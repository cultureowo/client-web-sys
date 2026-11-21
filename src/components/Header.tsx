import "./Header.scss";
import { BookOpen, Moon, Sun } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
export function Header({
  dark,
  onThemeChange,
}: {
  dark: boolean;
  onThemeChange: () => void;
}) {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <header className="header">
      <div className="header__inner">
        <Link className="header__brand" to="/tasks">
          <span className="header__logo">
            <BookOpen size={23} />
          </span>
          Study<span className="header__brand-light">Planner</span>
          <span className="header__badge">навчайся · зростай</span>
        </Link>
        <nav className="header__nav" aria-label="Головна навігація">
          <NavLink to="/tasks">Завдання</NavLink>
          <NavLink to="/profile">Профіль</NavLink>
          {isAuthenticated ? (
            <button
              className="button button--quiet"
              onClick={() => {
                logout();
                void navigate("/login", { replace: true });
              }}
            >
              Вийти
            </button>
          ) : (
            <NavLink to="/login">Увійти</NavLink>
          )}
        </nav>
        <button
          className="header__theme"
          onClick={onThemeChange}
          aria-label={dark ? "Увімкнути світлу тему" : "Увімкнути темну тему"}
          aria-pressed={dark}
        >
          {dark ? <Sun size={19} /> : <Moon size={19} />}
          <span>{dark ? "Світла тема" : "Темна тема"}</span>
        </button>
      </div>
    </header>
  );
}
