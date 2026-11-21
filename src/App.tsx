import {
  BrowserRouter,
  Navigate,
  Route,
  RouterProvider,
  Routes,
  createBrowserRouter,
  redirect,
  useLocation,
  Outlet,
  Link,
} from "react-router";
import { AppLayout } from "./layouts/AppLayout";
import { TasksPage } from "./pages/TasksPage";
import { TaskDetailsPage } from "./pages/TaskDetailsPage";
import { LoginPage } from "./pages/LoginPage";
import { ProfilePage } from "./pages/ProfilePage";
import { useAuth } from "./context/AuthContext";
import { getSession } from "./auth/session";
import { loginPath } from "./routes/authNavigation";

function RequireAuth() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate replace to={loginPath(location.pathname + location.search)} />
  );
}

function NotFound() {
  return (
    <section className="account-page">
      <h1>Сторінку не знайдено</h1>
      <Link to="/tasks">До завдань</Link>
    </section>
  );
}

const dataRouter =
  import.meta.env.VITE_ROUTER_MODE === "data"
    ? createBrowserRouter([
        {
          Component: AppLayout,
          children: [
            { index: true, loader: () => redirect("/tasks") },
            { path: "tasks", Component: TasksPage },
            { path: "tasks/:taskId", Component: TaskDetailsPage },
            { path: "login", Component: LoginPage },
            {
              path: "profile",
              Component: ProfilePage,
              loader: ({ request }) => {
                if (getSession()) return null;
                const url = new URL(request.url);
                return redirect(loginPath(url.pathname + url.search));
              },
            },
            { path: "*", Component: NotFound },
          ],
        },
      ])
    : null;

export default function App() {
  if (dataRouter) return <RouterProvider router={dataRouter} />;
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate replace to="/tasks" />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="tasks/:taskId" element={<TaskDetailsPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route element={<RequireAuth />}>
            <Route path="profile" element={<ProfilePage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
