import { motion } from "motion/react";

interface UndoToastProps {
  message: string;
  onUndo: () => void;
  onDismiss: () => void;
}

export const UndoToast = ({ message, onUndo, onDismiss }: UndoToastProps) => (
  <motion.div
    className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-full bg-text text-background text-sm font-medium shadow-xl"
    initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
    exit={{ opacity: 0, y: 20, filter: "blur(6px)" }}
    transition={{
      duration: 0.28,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    }}
  >
    <span>{message}</span>
    <button
      onClick={onUndo}
      className="underline underline-offset-2 font-semibold hover:opacity-70 transition-opacity"
    >
      Undo
    </button>
    <button
      onClick={onDismiss}
      className="opacity-50 hover:opacity-100 transition-opacity text-xs"
    >
      ✕
    </button>
  </motion.div>
);
