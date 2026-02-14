import { create } from "zustand";
import api from "@/lib/axios";
import type { User } from "@todo/shared";
import type { LoginInput, RegisterInput } from "@todo/shared";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  checkAuth: () => Promise<void>;
  login: (data: LoginInput) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  checkAuth: async () => {
    try {
      const response = await api.get("/auth/me");
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  login: async (data: LoginInput) => {
    const response = await api.post("/auth/login", data);
    set({
      user: response.data.user,
      isAuthenticated: true,
    });
  },

  register: async (data: RegisterInput) => {
    const response = await api.post("/auth/register", data);
    set({
      user: response.data.user,
      isAuthenticated: true,
    });
  },

  logout: async () => {
    await api.post("/auth/logout");
    set({
      user: null,
      isAuthenticated: false,
    });
  },
}));
