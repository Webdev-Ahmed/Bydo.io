import type { ChangeEvent } from "react";

interface TextareaProps {
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
}

const Textarea = ({
  label,
  value,
  onChange,
  error,
  placeholder,
  rows = 4,
  maxLength,
}: TextareaProps) => {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-neutral-50/80 tracking-wider text-sm font-semibold">
          {label}
        </label>
        {maxLength && (
          <span className="text-xs text-neutral-50/50">
            {value.length}/{maxLength}
          </span>
        )}
      </div>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className={`w-full px-3 py-2 border bg-neutral-50/5 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400/70 resize-none ${
          error ? "border-red-500" : "border-neutral-50/10"
        }`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Textarea;
