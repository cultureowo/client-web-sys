import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import "./AccountPage.scss";

export function ProfilePage() {
  const { session, logout } = useAuth();
  const navigate = useNavigate();
  if (!session) return null;
  return (
    <section className="account-page">
      <h1>Профіль</h1>
      <p>{session.user.username}</p>
      <p>{session.user.email}</p>
      <p>Сесія активна</p>
      <button
        className="button button--primary"
        onClick={() => {
          logout();
          void navigate("/login", { replace: true });
        }}
      >
        Вийти
      </button>
    </section>
  );
}
