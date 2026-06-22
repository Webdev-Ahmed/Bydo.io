import { useThemeStore } from "@/store/themeStore";
import { useEffect, type ReactNode } from "react";

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const initializeTheme = useThemeStore((state) => state.initializeTheme);

  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  return <>{children}</>;
};

export default ThemeProvider;
