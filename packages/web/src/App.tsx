import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/home/Home";
import Todos from "./pages/todos/Todos";
import { useAuthStore } from "./store/authStore";
import { ProtectedRoute } from "./components/auth/ProtectRoute";
import Navbar from "./components/Navbar";
import NotFound from "./pages/errors/NotFound";
import UserPage from "./pages/UserPage";
import Unauthorized from "./pages/errors/Unauthorized";
import Forbidden from "./pages/errors/Forbidden";
import RequireAdmin from "./components/auth/RequireAdmin";
import AdminPage from "./pages/admin/AdminPage";
import AdminUserPage from "./pages/admin/AdminUserPage";
import CalendarPage from "./pages/CalenderPage";

const App = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/todos"
          element={
            <ProtectedRoute>
              <Todos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <CalendarPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user"
          element={
            <ProtectedRoute>
              <UserPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminPage />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/users/:userId"
          element={
            <RequireAdmin>
              <AdminUserPage />
            </RequireAdmin>
          }
        />

        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to={"/"} /> : <Login />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to={"/"} /> : <Register />}
        />

        <Route path="*" element={<NotFound />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/forbidden" element={<Forbidden />} />
      </Routes>
    </Router>
  );
};

export default App;
