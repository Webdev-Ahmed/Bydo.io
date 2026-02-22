import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return <>{children}</>;
};

export default AuthProvider;
