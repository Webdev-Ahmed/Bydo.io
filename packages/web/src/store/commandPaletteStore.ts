import { create } from "zustand";

const RECENT_KEY = "cp-recent-pages";
const MAX_RECENT = 3;

const loadRecent = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]");
  } catch {
    return [];
  }
};

interface CommandPaletteStore {
  isOpen: boolean;
  recentHrefs: string[];
  open: () => void;
  close: () => void;
  toggle: () => void;
  pushRecent: (href: string) => void;
}

export const useCommandPalette = create<CommandPaletteStore>((set, get) => ({
  isOpen: false,
  recentHrefs: loadRecent(),

  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),

  pushRecent: (href: string) => {
    const current = get().recentHrefs;
    const next = [href, ...current.filter((h) => h !== href)].slice(
      0,
      MAX_RECENT,
    );
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    set({ recentHrefs: next });
  },
}));
