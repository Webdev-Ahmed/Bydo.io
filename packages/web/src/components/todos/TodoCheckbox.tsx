import { motion, AnimatePresence } from "motion/react";

interface TodoCheckboxProps {
  checked: boolean;
  onChange: () => void;
  label: string;
}

export const TodoCheckbox = ({
  checked,
  onChange,
  label,
}: TodoCheckboxProps) => (
  <button
    role="checkbox"
    aria-checked={checked}
    aria-label={label}
    onClick={onChange}
    className="relative shrink-0 size-5 rounded-full border-2 border-text/30 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
    style={{
      backgroundColor: checked ? "var(--color-primary)" : "transparent",
      borderColor: checked ? "var(--color-primary)" : undefined,
    }}
  >
    <AnimatePresence>
      {checked && (
        <motion.svg
          key="check"
          viewBox="0 0 10 8"
          fill="none"
          className="absolute inset-0 m-auto w-3 h-3"
          initial={{ opacity: 0, pathLength: 0 }}
          animate={{ opacity: 1, pathLength: 1 }}
          exit={{ opacity: 0, pathLength: 0 }}
        >
          <motion.path
            d="M1 4L3.5 6.5L9 1"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            exit={{ pathLength: 0 }}
            transition={{
              duration: 0.25,
              ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
            }}
          />
        </motion.svg>
      )}
    </AnimatePresence>

    <AnimatePresence>
      {checked && (
        <motion.span
          key="ripple"
          className="absolute inset-0 rounded-full bg-primary"
          initial={{ scale: 1, opacity: 0.35 }}
          animate={{ scale: 2.2, opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      )}
    </AnimatePresence>
  </button>
);
