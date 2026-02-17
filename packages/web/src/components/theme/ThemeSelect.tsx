import { useState, useRef, useEffect } from "react";
import { Sun, Moon, Monitor, ChevronDown, Check } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import type { Theme } from "@/types";

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
          <CurrentIcon className="w-4 h-4" />
          <span>{currentOption?.label}</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-background backdrop-blur-xl border border-text/10 rounded-lg shadow-xl overflow-hidden z-50">
          {themeOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = option.value === theme;

            return (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                  isSelected
                    ? "bg-primary/10 text-primary"
                    : "text-text hover:bg-primary/5"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="flex-1 text-left">{option.label}</span>
                {isSelected && <Check className="w-4 h-4" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
