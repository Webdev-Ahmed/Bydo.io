import { useEffect, useLayoutEffect, useRef } from "react";
import { matchesCombo, isTyping } from "@/lib/keybindings";

export interface KeybindingOptions {
  ignoreWhenTyping?: boolean;
  preventDefault?: boolean;
  enabled?: boolean;
}

type Handler = (e: KeyboardEvent) => void;

/**
 * Register a single keyboard shortcut.
 * Uses a stable event listener that always calls the latest handler via ref.
 */
export function useKeybinding(
  combo: string,
  handler: Handler,
  options: KeybindingOptions = {},
): void {
  const {
    ignoreWhenTyping = false,
    preventDefault = true,
    enabled = true,
  } = options;

  // useLayoutEffect runs synchronously after DOM mutations, before useEffect,
  // so the ref is always fresh by the time any keydown listener fires.
  const handlerRef = useRef<Handler>(handler);
  useLayoutEffect(() => {
    handlerRef.current = handler;
  });

  const optionsRef = useRef({ ignoreWhenTyping, preventDefault });
  useLayoutEffect(() => {
    optionsRef.current = { ignoreWhenTyping, preventDefault };
  });

  useEffect(() => {
    if (!enabled) return;

    const fn = (e: KeyboardEvent) => {
      const { ignoreWhenTyping: ig, preventDefault: pd } = optionsRef.current;
      if (ig && isTyping()) return;
      if (!matchesCombo(e, combo)) return;
      if (pd) e.preventDefault();
      handlerRef.current(e);
    };

    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [combo, enabled]); // re-register only when combo or enabled changes
}

// ─── Multi-binding variant ────────────────────────────────────────────────────

type Binding = [combo: string, handler: Handler, options?: KeybindingOptions];

/**
 * Register multiple keyboard shortcuts with a single event listener.
 * Bindings array can be an inline literal — handlers are always called fresh
 * via ref so stale closures are never an issue.
 */
export function useKeybindings(bindings: Binding[]): void {
  // useLayoutEffect keeps the ref current before any keydown can fire
  const bindingsRef = useRef<Binding[]>(bindings);
  useLayoutEffect(() => {
    bindingsRef.current = bindings;
  });

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      for (const [combo, handler, opts = {}] of bindingsRef.current) {
        const {
          ignoreWhenTyping = false,
          preventDefault: pd = true,
          enabled = true,
        } = opts;

        if (!enabled) continue;
        if (ignoreWhenTyping && isTyping()) continue;
        if (!matchesCombo(e, combo)) continue;
        if (pd) e.preventDefault();
        handler(e);
      }
    };

    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []); // single listener, reads live from ref
}
