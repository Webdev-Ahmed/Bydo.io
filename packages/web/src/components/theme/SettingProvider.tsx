import { useSettingsStore } from "@/store/settingStore";
import { useEffect, type ReactNode } from "react";
import { MotionConfig } from "motion/react";

export function SettingsProvider({ children }: { children: ReactNode }) {
  const { initializeSettings, reduceMotion } = useSettingsStore();

  useEffect(() => {
    initializeSettings();
  }, [initializeSettings]);

  return (
    <MotionConfig reducedMotion={reduceMotion ? "always" : "never"}>
      {children}
    </MotionConfig>
  );
}
