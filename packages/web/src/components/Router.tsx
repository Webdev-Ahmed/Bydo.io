import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import {
  Navbar,
  CommandPalette,
  ProtectedRoute,
  RequireAdmin,
} from "@/components";
import { useAuthStore } from "@/store/authStore";

import Todos from "@/pages/todos/Todos";
import CalendarPage from "@/pages/CalenderPage";
import UserPage from "@/pages/UserPage";
import AdminPage from "@/pages/admin/AdminPage";
import AdminUserPage from "@/pages/admin/AdminUserPage";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import NotFound from "@/pages/errors/NotFound";
import Unauthorized from "@/pages/errors/Unauthorized";
import Forbidden from "@/pages/errors/Forbidden";
import Home from "@/pages/home/Home";

const Router = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <BrowserRouter>
      <Navbar />
      <CommandPalette />

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
    </BrowserRouter>
  );
};

export default Router;
