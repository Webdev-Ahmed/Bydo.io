import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import Loader from "../ui/Loader";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) return <Loader />;
  if (!isLoading && !isAuthenticated) return <Navigate to="/login" replace />;

  return <>{children}</>;
}
