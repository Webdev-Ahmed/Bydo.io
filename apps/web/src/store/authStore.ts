import { create } from "zustand";
import api from "@/lib/axios";
import type { User } from "@bydo-io/shared";
import type { LoginInput, RegisterInput } from "@bydo-io/shared";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;

  checkAuth: () => Promise<void>;
  login: (data: LoginInput) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  isAdmin: false,

  checkAuth: async () => {
    try {
      const response = await api.get("/auth/me");
      const user: User = response.data.user;
      set({
        user,
        isAuthenticated: true,
        isAdmin: user.role === "ADMIN",
        isLoading: false,
      });
    } catch {
      set({
        user: null,
        isAuthenticated: false,
        isAdmin: false,
        isLoading: false,
      });
    }
  },

  login: async (data: LoginInput) => {
    const response = await api.post("/auth/login", data);
    const user: User = response.data.user;
    set({ user, isAuthenticated: true, isAdmin: user.role === "ADMIN" });
  },

  register: async (data: RegisterInput) => {
    const response = await api.post("/auth/register", data);
    const user: User = response.data.user;
    set({ user, isAuthenticated: true, isAdmin: user.role === "ADMIN" });
  },

  logout: async () => {
    await api.post("/auth/logout");
    set({ user: null, isAuthenticated: false, isAdmin: false });
  },
}));
