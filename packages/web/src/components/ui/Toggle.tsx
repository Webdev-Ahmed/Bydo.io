interface ToggleProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

const Toggle = ({
  label,
  checked,
  onChange,
  disabled = false,
}: ToggleProps) => {
  return (
    <label className="flex items-center justify-between cursor-pointer group">
      {label && (
        <span
          className={`text-sm font-medium tracking-wide ${
            disabled ? "text-neutral-50/30" : "text-neutral-50/80"
          }`}
        >
          {label}
        </span>
      )}
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only peer"
        />
        <div
          className={`w-11 h-6 rounded-full transition-all ${
            checked ? "bg-pink-500" : "bg-neutral-50/20"
          } ${
            disabled
              ? "opacity-50 cursor-not-allowed"
              : "group-hover:opacity-90"
          }`}
        >
          <div
            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
              checked ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </div>
      </div>
    </label>
  );
};

export default Toggle;
