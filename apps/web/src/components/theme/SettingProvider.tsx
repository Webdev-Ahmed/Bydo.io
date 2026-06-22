import { useSettingsStore, SPEED_DURATION } from "@/store/settingStore";
import { useEffect, type ReactNode } from "react";
import { MotionConfig } from "motion/react";
import { ease } from "@/lib/animations";

const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const { initializeSettings, reduceMotion, animationSpeed } =
    useSettingsStore();

  useEffect(() => {
    initializeSettings();
  }, [initializeSettings]);

  return (
    <MotionConfig
      reducedMotion={reduceMotion ? "always" : "never"}
      transition={{ duration: SPEED_DURATION[animationSpeed], ease }}
    >
      {children}
    </MotionConfig>
  );
};

export default SettingsProvider;
