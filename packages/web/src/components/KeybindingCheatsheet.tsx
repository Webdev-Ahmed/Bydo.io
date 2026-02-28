import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { useState } from "react";

import {
  SHORTCUTS,
  SCOPE_LABELS,
  comboToDisplay,
  type KeyScope,
} from "@/lib/keybindings";
import { useKeybinding } from "@/hooks/useKeybinding";
import {
  commandPaletteBackdropVariants,
  commandPaletteVariants,
} from "@/lib/animations";

// ─── Kbd chip ─────────────────────────────────────────────────────────────────

const Kbd = ({ children }: { children: string }) => (
  <kbd className="inline-flex items-center justify-center min-w-[1.4rem] h-5 px-1.5 rounded border border-text/15 bg-text/5 text-[10px] font-mono text-text/50 leading-none">
    {children}
  </kbd>
);

const ComboKeys = ({ combo }: { combo: string }) => (
  <span className="flex items-center gap-0.5">
    {comboToDisplay(combo).map((part, i) => (
      <Kbd key={i}>{part}</Kbd>
    ))}
  </span>
);

// ─── Component ────────────────────────────────────────────────────────────────

const SCOPE_ORDER: KeyScope[] = ["global", "todos", "editor", "calendar"];

const KeybindingCheatsheet = () => {
  const [isOpen, setIsOpen] = useState(false);

  useKeybinding("?", () => setIsOpen((p) => !p), {
    ignoreWhenTyping: true,
    preventDefault: false,
  });

  useKeybinding("escape", () => setIsOpen(false), {
    enabled: isOpen,
  });

  const grouped = SCOPE_ORDER.reduce<
    Partial<Record<KeyScope, (typeof SHORTCUTS)[keyof typeof SHORTCUTS][]>>
  >((acc, scope) => {
    const items = Object.values(SHORTCUTS).filter((s) => s.scope === scope);
    if (items.length) acc[scope] = items;
    return acc;
  }, {});

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="cheatsheet-backdrop"
            variants={commandPaletteBackdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-60 bg-background/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          <div className="fixed inset-0 z-61 flex items-center justify-center px-4 pointer-events-none">
            <motion.div
              key="cheatsheet-panel"
              variants={commandPaletteVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="pointer-events-auto w-full max-w-md bg-background border border-text/10 rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-text/8">
                <div>
                  <p className="text-sm font-semibold text-text/80">
                    Keyboard shortcuts
                  </p>
                  <p className="text-xs text-text/30 mt-3 flex items-center gap-1">
                    Press <ComboKeys combo="?" /> anytime to toggle this
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-text/25 hover:text-text/60 hover:bg-text/8 transition-colors"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Shortcut groups */}
              <div className="p-4 space-y-5 max-h-[70vh] overflow-y-auto">
                {SCOPE_ORDER.map((scope) => {
                  const items = grouped[scope];
                  if (!items?.length) return null;
                  return (
                    <div key={scope}>
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-text/25 font-serif mb-2 px-1">
                        {SCOPE_LABELS[scope]}
                      </p>
                      <div className="space-y-0.5">
                        {items.map((shortcut) => (
                          <div
                            key={shortcut.combo}
                            className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-text/4 transition-colors"
                          >
                            <span className="text-xs text-text/55">
                              {shortcut.label}
                            </span>
                            <ComboKeys combo={shortcut.combo} />
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="border-t border-text/6 px-5 py-2.5 flex items-center gap-3">
                <span className="text-[10px] text-text/20 flex items-center gap-1.5">
                  <ComboKeys combo="escape" />
                  close
                </span>
                <span className="ml-auto text-[10px] text-text/15">
                  ? to toggle
                </span>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default KeybindingCheatsheet;
