import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import Spinner from "../ui/Spinner";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading)
    return (
      <main className="w-full h-screen flex justify-center items-center">
        <Spinner />
      </main>
    );
  if (!isLoading && !isAuthenticated) return <Navigate to="/login" replace />;

  return <>{children}</>;
}
