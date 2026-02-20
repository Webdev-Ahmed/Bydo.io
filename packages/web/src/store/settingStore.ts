import { create } from "zustand";

interface SettingsStore {
  reduceMotion: boolean;
  setReduceMotion: (value: boolean) => void;
  initializeSettings: () => void;
}

const applyReduceMotion = (enabled: boolean): void => {
  document.documentElement.classList.toggle("reduce-motion", enabled);
};

export const useSettingsStore = create<SettingsStore>((set) => ({
  reduceMotion: false,

  setReduceMotion: (value: boolean) => {
    localStorage.setItem("reduceMotion", String(value));
    applyReduceMotion(value);
    set({ reduceMotion: value });
  },

  initializeSettings: () => {
    const saved = localStorage.getItem("reduceMotion");
    const reduceMotion = saved === "true";
    applyReduceMotion(reduceMotion);
    set({ reduceMotion });
  },
}));
