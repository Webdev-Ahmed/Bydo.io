import { useState, useRef, useEffect, type ReactNode } from "react";

interface DropdownItem {
  label: string;
  onClick: () => void;
  icon?: ReactNode;
  variant?: "default" | "danger";
}

interface DropdownProps {
  trigger: ReactNode;
  items: DropdownItem[];
}

const Dropdown = ({ trigger, items }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>

      {isOpen && (
        <div
          style={{ transformOrigin: "top right" }}
          className="absolute right-0 mt-2 w-48 bg-background backdrop-blur-xl border border-text/10 rounded-lg shadow-xl overflow-hidden z-50"
        >
          {items.map(({ onClick, label, icon, variant }, index) => (
            <button
              key={index}
              onClick={() => {
                onClick();
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2.5 text-left flex items-center gap-3 transition active:scale-[0.97] ${
                variant === "danger"
                  ? "text-red-400 hover:bg-red-500/10"
                  : "text-text hover:bg-primary/10"
              }`}
            >
              {icon && <div className="size-9">{icon}</div>}
              <span className="text-sm">{label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
