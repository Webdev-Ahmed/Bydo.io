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
        <div className="absolute right-0 mt-2 w-48 bg-neutral-900 border border-neutral-50/10 rounded-lg shadow-xl overflow-hidden z-50">
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                item.onClick();
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2.5 text-left flex items-center gap-3 transition ${
                item.variant === "danger"
                  ? "text-red-400 hover:bg-red-500/10"
                  : "text-neutral-50/80 hover:bg-neutral-50/5"
              }`}
            >
              {item.icon && <span className="text-lg">{item.icon}</span>}
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
