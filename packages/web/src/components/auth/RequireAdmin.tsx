import { useAuthStore } from "@/store/authStore";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface RequireAdminProps {
  children: ReactNode;
}

const RequireAdmin = ({ children }: RequireAdminProps) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuthStore();

  if (isLoading) return null;

  if (!isAuthenticated) return <Navigate to="/unauthorized" />;

  if (!isAdmin) return <Navigate to="/forbidden" />;

  return <>{children}</>;
};

export default RequireAdmin;
