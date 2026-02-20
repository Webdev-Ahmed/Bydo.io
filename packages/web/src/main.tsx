import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./components/auth/AuthProvider.tsx";
import { ThemeProvider } from "./components/theme/ThemeProvider.tsx";
import { SettingsProvider } from "./components/theme/SettingProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <SettingsProvider>
          <App />
        </SettingsProvider>
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>,
);
