import { type ChangeEvent } from "react";

interface InputProps {
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  step?: string;
  error?: string;
  type?: string;
  placeholder?: string;
}

const Input = ({
  label,
  value,
  onChange,
  error,
  step,
  type = "text",
  placeholder,
}: InputProps) => {
  return (
    <div className="mb-4">
      <label className="block text-neutral-50/80 tracking-wider text-sm font-semibold mb-2">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        step={step}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border bg-neutral-50/5 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400/70 ${
          error ? "border-red-500" : "border-neutral-50/10"
        }`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Input;
