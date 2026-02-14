import type { ChangeEvent } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  error?: string;
  placeholder?: string;
}

const Select = ({
  label,
  value,
  onChange,
  options,
  error,
  placeholder = "Select an option",
}: SelectProps) => {
  return (
    <div className="mb-4">
      <label className="block text-neutral-50/80 tracking-wider text-sm font-semibold mb-2">
        {label}
      </label>
      <select
        value={value}
        onChange={onChange}
        className={`w-full px-3 py-2 border bg-neutral-50/5 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400/70 cursor-pointer ${
          error ? "border-red-500" : "border-neutral-50/10"
        }`}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-neutral-900"
          >
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Select;
