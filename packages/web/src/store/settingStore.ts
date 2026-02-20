import { create } from "zustand";

export type AnimationSpeed = "slow" | "normal" | "fast";

export const SPEED_DURATION: Record<AnimationSpeed, number> = {
  slow: 2,
  normal: 0.4,
  fast: 0.18,
};

interface SettingsStore {
  reduceMotion: boolean;
  animationSpeed: AnimationSpeed;
  setReduceMotion: (value: boolean) => void;
  setAnimationSpeed: (speed: AnimationSpeed) => void;
  initializeSettings: () => void;
}

const applyReduceMotion = (enabled: boolean): void => {
  document.documentElement.classList.toggle("reduce-motion", enabled);
};

export const useSettingsStore = create<SettingsStore>((set) => ({
  reduceMotion: false,
  animationSpeed: "normal",

  setReduceMotion: (value: boolean) => {
    localStorage.setItem("reduceMotion", String(value));
    applyReduceMotion(value);
    set({ reduceMotion: value });
  },

  setAnimationSpeed: (speed: AnimationSpeed) => {
    localStorage.setItem("animationSpeed", speed);
    set({ animationSpeed: speed });
  },

  initializeSettings: () => {
    const savedMotion = localStorage.getItem("reduceMotion");
    const reduceMotion = savedMotion === "true";
    applyReduceMotion(reduceMotion);

    const savedSpeed = localStorage.getItem(
      "animationSpeed",
    ) as AnimationSpeed | null;
    const animationSpeed: AnimationSpeed =
      savedSpeed && ["slow", "normal", "fast"].includes(savedSpeed)
        ? savedSpeed
        : "normal";

    set({ reduceMotion, animationSpeed });
  },
}));
