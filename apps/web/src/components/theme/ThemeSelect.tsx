import { useState, useRef, useEffect } from "react";
import { Sun, Moon, Monitor, ChevronDown, Check } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import type { Theme } from "@/types";
import { AnimatePresence, motion } from "motion/react";

interface ThemeOption {
  value: Theme;
  label: string;
  icon: typeof Sun | typeof Moon | typeof Monitor;
}

const themeOptions: ThemeOption[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "auto", label: "Auto", icon: Monitor },
];

const dropdownVariants = {
  hidden: {
    opacity: 0,
    y: -8,
    filter: "blur(4px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.25,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    filter: "blur(4px)",
    transition: {
      duration: 0.18,
      ease: "easeIn" as const,
    },
  },
};

const dropdownItemVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.22,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
  exit: {
    opacity: 0,
    x: -8,
    transition: { duration: 0.12 },
  },
};

const checkVariants = {
  hidden: { opacity: 0, x: 6 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.2,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
  exit: {
    opacity: 0,
    x: 6,
    transition: { duration: 0.12 },
  },
};

export default function ThemeSelect() {
  const { theme, setTheme } = useThemeStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentOption = themeOptions.find((opt) => opt.value === theme);
  const CurrentIcon = currentOption?.icon || Monitor;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (value: Theme) => {
    setTheme(value);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-transparent border border-text/20 text-text hover:bg-text/10 focus:outline-none focus:ring-2 focus:ring-primary transition-colors text-sm cursor-pointer"
          aria-label="Select theme"
          aria-expanded={isOpen}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={currentOption?.value}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="flex items-center"
            >
              <CurrentIcon className="w-4 h-4" />
            </motion.span>
          </AnimatePresence>

          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={currentOption?.label}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {currentOption?.label}
            </motion.span>
          </AnimatePresence>

          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center"
          >
            <ChevronDown className="w-4 h-4" />
          </motion.span>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute right-0 mt-2 w-48 bg-background backdrop-blur-xl border border-text/10 rounded-lg shadow-xl overflow-hidden z-50"
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {themeOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = option.value === theme;

              return (
                <motion.button
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                    isSelected
                      ? "bg-primary/10 text-primary"
                      : "text-text hover:bg-primary/5"
                  }`}
                  variants={dropdownItemVariants}
                  whileHover={{ x: 3 }}
                  whileTap={{ x: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Icon className="w-4 h-4" />
                  <span className="flex-1 text-left">{option.label}</span>

                  <AnimatePresence initial={false}>
                    {isSelected && (
                      <motion.span
                        variants={checkVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        <Check className="w-4 h-4" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
