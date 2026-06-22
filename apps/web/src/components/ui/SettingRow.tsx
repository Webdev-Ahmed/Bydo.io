interface SettingRowProps {
  icon: React.ElementType;
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}

const SettingRow = ({
  icon: Icon,
  label,
  description,
  checked,
  onChange,
}: SettingRowProps) => (
  <div className="flex items-center gap-4 py-3.5 border-b border-text/6 last:border-0">
    <div className="shrink-0 size-8 rounded-xl bg-text/5 flex items-center justify-center">
      <Icon className="size-3.5 text-text/40" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm text-text/80">{label}</p>
      <p className="text-xs text-text/35 mt-0.5">{description}</p>
    </div>
    <button
      onClick={onChange}
      role="switch"
      aria-checked={checked}
      className={`relative shrink-0 w-11 h-6 rounded-full border transition-colors duration-200 ${
        checked ? "bg-primary/20 border-primary/30" : "bg-text/8 border-text/10"
      }`}
    >
      <span
        className={`absolute top-1 left-1 size-4 rounded-full transition-transform duration-200 ${
          checked ? "translate-x-5 bg-primary" : "translate-x-0 bg-text/30"
        }`}
      />
    </button>
  </div>
);

export default SettingRow;
