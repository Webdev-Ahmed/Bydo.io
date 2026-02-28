// ─── Types ────────────────────────────────────────────────────────────────────

export type KeyScope = "global" | "todos" | "calendar" | "editor";

export interface Shortcut {
  /** Key combo string: "mod+k", "/", "escape", "shift+d" etc. */
  combo: string;
  /** Human-readable description shown in the cheatsheet */
  label: string;
  /** Grouping for the cheatsheet UI */
  scope: KeyScope;
  /**
   * If true, the handler is skipped when an <input>, <textarea>,
   * or contenteditable element is focused.
   */
  ignoreWhenTyping?: boolean;
}

// ─── Registry ─────────────────────────────────────────────────────────────────

/**
 * Single source of truth for every keyboard shortcut in the app.
 * Import this in hooks and in the cheatsheet UI.
 */
export const SHORTCUTS = {
  // ── Global ──────────────────────────────────────────────────────────────────
  COMMAND_PALETTE: {
    combo: "mod+k",
    label: "Open command palette",
    scope: "global",
  },
  SHOW_SHORTCUTS: {
    combo: "?",
    label: "Show keyboard shortcuts",
    scope: "global",
    ignoreWhenTyping: true,
  },

  // ── Todos page ──────────────────────────────────────────────────────────────
  FOCUS_INPUT: {
    combo: "/",
    label: "Focus new task input",
    scope: "todos",
    ignoreWhenTyping: true,
  },
  UNDO_DELETE: {
    combo: "mod+z",
    label: "Undo last delete",
    scope: "todos",
  },
  CANCEL_EDIT: {
    combo: "escape",
    label: "Cancel editing",
    scope: "editor",
  },
  SAVE_EDIT: {
    combo: "enter",
    label: "Save edit",
    scope: "editor",
  },

  // ── Calendar page ────────────────────────────────────────────────────────────
  CALENDAR_PREV: {
    combo: "arrowleft",
    label: "Previous month",
    scope: "calendar",
    ignoreWhenTyping: true,
  },
  CALENDAR_NEXT: {
    combo: "arrowright",
    label: "Next month",
    scope: "calendar",
    ignoreWhenTyping: true,
  },
  CALENDAR_TODAY: {
    combo: "t",
    label: "Jump to today",
    scope: "calendar",
    ignoreWhenTyping: true,
  },
} as const satisfies Record<string, Shortcut>;

export type ShortcutId = keyof typeof SHORTCUTS;

// ─── Scope metadata ───────────────────────────────────────────────────────────

export const SCOPE_LABELS: Record<KeyScope, string> = {
  global: "Global",
  todos: "Todos",
  calendar: "Calendar",
  editor: "Editing",
};

// ─── Combo parsing ────────────────────────────────────────────────────────────

export interface ParsedCombo {
  mod: boolean; // Ctrl (Win/Linux) or Cmd (Mac)
  shift: boolean;
  alt: boolean;
  key: string; // lowercase key value e.g. "k", "escape", "/"
}

/**
 * Parses a combo string into its parts.
 * Note: `shift: true` only means the combo explicitly declared "shift+".
 * Plain chars like "?" do NOT set shift=true even though they require Shift physically.
 */
export function parseCombo(combo: string): ParsedCombo {
  const parts = combo.toLowerCase().split("+");
  return {
    mod: parts.includes("mod"),
    shift: parts.includes("shift"),
    alt: parts.includes("alt"),
    key: parts[parts.length - 1],
  };
}

export function matchesCombo(e: KeyboardEvent, combo: string): boolean {
  const parts = combo.toLowerCase().split("+");
  const hasMod = parts.includes("mod");
  const hasShift = parts.includes("shift");
  const hasAlt = parts.includes("alt");
  const key = parts[parts.length - 1];

  // Key must match
  if (e.key.toLowerCase() !== key) return false;

  // Mod (Ctrl/Cmd) must match exactly — prevents "k" firing on Ctrl+K
  const eMod = e.metaKey || e.ctrlKey;
  if (eMod !== hasMod) return false;

  // Alt must match exactly
  if (e.altKey !== hasAlt) return false;

  // Only enforce shiftKey when combo explicitly declares "shift".
  // Plain chars like "?" already encode shift in the key character itself
  // (e.key === "?" regardless of how shift is expressed in the combo string).
  if (hasShift && !e.shiftKey) return false;

  return true;
}

export function isTyping(): boolean {
  const el = document.activeElement;
  if (!el) return false;
  const tag = el.tagName.toLowerCase();
  return (
    tag === "input" ||
    tag === "textarea" ||
    (el as HTMLElement).isContentEditable
  );
}

// ─── Display helpers ──────────────────────────────────────────────────────────

const isMac =
  typeof navigator !== "undefined" &&
  /Mac|iPod|iPhone|iPad/.test(navigator.platform);

const KEY_DISPLAY: Record<string, string> = {
  mod: isMac ? "⌘" : "Ctrl",
  shift: "⇧",
  alt: isMac ? "⌥" : "Alt",
  escape: "Esc",
  arrowleft: "←",
  arrowright: "→",
  arrowup: "↑",
  arrowdown: "↓",
  enter: "↵",
  backspace: "⌫",
  " ": "Space",
};

/** Returns an array of display strings for each key part, e.g. ["⌘", "K"] */
export function comboToDisplay(combo: string): string[] {
  return combo
    .toLowerCase()
    .split("+")
    .map((part) => KEY_DISPLAY[part] ?? part.toUpperCase());
}
