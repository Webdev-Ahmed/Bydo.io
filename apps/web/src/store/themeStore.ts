import { create } from "zustand";
import type { Theme, ResolvedTheme } from "@/types";

interface ThemeStore {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  initializeTheme: () => void;
}

const applyTheme = (resolvedTheme: ResolvedTheme): void => {
  if (resolvedTheme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};

const getResolvedTheme = (theme: Theme): ResolvedTheme => {
  if (theme === "auto") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return theme;
};

export const useThemeStore = create<ThemeStore>((set, get) => ({
  theme: "auto",
  resolvedTheme: "light",
  isDark: false,

  setTheme: (theme: Theme) => {
    const resolvedTheme = getResolvedTheme(theme);
    const isDark = resolvedTheme === "dark";

    localStorage.setItem("theme", theme);
    applyTheme(resolvedTheme);
    set({ theme, resolvedTheme, isDark });
  },

  initializeTheme: () => {
    const savedTheme = (localStorage.getItem("theme") as Theme) || "auto";
    const resolvedTheme = getResolvedTheme(savedTheme);
    const isDark = resolvedTheme === "dark";

    applyTheme(resolvedTheme);

    set({ theme: savedTheme, resolvedTheme, isDark });

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      const currentTheme = get().theme;
      if (currentTheme === "auto") {
        const newResolvedTheme: ResolvedTheme = e.matches ? "dark" : "light";
        applyTheme(newResolvedTheme);
        set({ resolvedTheme: newResolvedTheme, isDark: e.matches });
      }
    };

    mediaQuery.addEventListener("change", handler);
  },
}));
