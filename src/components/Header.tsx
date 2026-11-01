import { BookOpen, Moon, Sun } from "lucide-react";
export function Header({
  dark,
  onThemeChange,
}: {
  dark: boolean;
  onThemeChange: () => void;
}) {
  return (
    <header className="header">
      <div className="header__inner">
        <a className="header__brand" href="#">
          <span className="header__logo">
            <BookOpen size={23} />
          </span>
          Study<span className="header__brand-light">Planner</span>
          <span className="header__badge">навчайся · зростай</span>
        </a>
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
