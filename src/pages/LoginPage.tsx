import { Link, useNavigate, useSearchParams } from "react-router";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../context/AuthContext";
import { errorMessage } from "../api/httpClient";
import { returnPath } from "../routes/authNavigation";
import { loginSchema } from "../schemas/forms";
import "../components/FormFields.scss";
import "./AccountPage.scss";

export function LoginPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const destination = returnPath(params.get("next"));
  const request = useRef<AbortController | null>(null);
  useEffect(() => () => request.current?.abort(), []);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });
  return (
    <section className="account-page">
      <h1>Вхід</h1>
      {auth.isAuthenticated ? (
        <Link to={destination}>Продовжити</Link>
      ) : (
        <form
          noValidate
          onSubmit={(event) => {
            void handleSubmit(async (values) => {
              const controller = new AbortController();
              request.current = controller;
              try {
                await auth.login(values, controller.signal);
                await navigate(destination, { replace: true });
              } catch (error) {
                if (!controller.signal.aborted)
                  setError("root", { message: errorMessage(error) });
              }
            })(event);
          }}
        >
          <fieldset className="form__fields" disabled={isSubmitting}>
            <label className="field">
              Ім’я користувача
              <input
                autoComplete="username"
                aria-invalid={!!errors.username}
                aria-describedby={
                  errors.username ? "username-error" : undefined
                }
                {...register("username")}
              />
            </label>
            {errors.username && (
              <p id="username-error" className="form__error" role="alert">
                {errors.username.message}
              </p>
            )}
            <label className="field">
              Пароль
              <input
                type="password"
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                aria-describedby={
                  errors.password ? "password-error" : undefined
                }
                {...register("password")}
              />
            </label>
            {errors.password && (
              <p id="password-error" className="form__error" role="alert">
                {errors.password.message}
              </p>
            )}
            <button type="submit" className="button button--primary">
              {isSubmitting ? "Вхід…" : "Увійти"}
            </button>
          </fieldset>
          {errors.root && <p role="alert">{errors.root.message}</p>}
        </form>
      )}
    </section>
  );
}
