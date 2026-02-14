import { forwardRef, type InputHTMLAttributes } from "react";

interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "size"
> {
  label?: string;
  variant?: "default" | "circle" | "switch";
  checkboxSize?: "sm" | "md" | "lg";
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      variant = "default",
      checkboxSize = "md",
      className = "",
      ...props
    },
    ref,
  ) => {
    const sizeClasses = {
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-6 h-6",
    };

    const labelSizeClasses = {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    };

    if (variant === "switch") {
      return (
        <label className="inline-flex items-center cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              ref={ref}
              className="sr-only peer"
              {...props}
            />
            <div
              className={`
                ${checkboxSize === "sm" ? "w-9 h-5" : checkboxSize === "lg" ? "w-14 h-7" : "w-11 h-6"}
                bg-neutral-50/20 rounded-full peer
                peer-focus:ring-2 peer-focus:ring-pink-300
                peer-checked:bg-pink-500
                transition-colors
              `}
            />
            <div
              className={`
                ${checkboxSize === "sm" ? "w-4 h-4 left-0.5" : checkboxSize === "lg" ? "w-6 h-6 left-0.5" : "w-5 h-5 left-0.5"}
                absolute top-0.5 bg-neutral-50/80 rounded-full
                transition-transform
                peer-checked:translate-x-full
              `}
            />
          </div>
          {label && (
            <span
              className={`ml-3 ${labelSizeClasses[checkboxSize]} text-neutral-50/70`}
            >
              {label}
            </span>
          )}
        </label>
      );
    }

    if (variant === "circle") {
      return (
        <label className="inline-flex items-center cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              ref={ref}
              className="sr-only peer"
              {...props}
            />
            <div
              className={`
                ${sizeClasses[checkboxSize]}
                rounded-full border-2 border-neutral-50/60
                peer-checked:bg-pink-500 peer-checked:border-pink-500
                peer-focus:ring-2 peer-focus:ring-pink-300
                transition-all
                flex items-center justify-center
              `}
            >
              <svg
                className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          {label && (
            <span
              className={`ml-3 ${labelSizeClasses[checkboxSize]} text-neutral-50/70`}
            >
              {label}
            </span>
          )}
        </label>
      );
    }

    return (
      <label className="inline-flex items-center cursor-pointer">
        <div className="relative">
          <input
            type="checkbox"
            ref={ref}
            className="sr-only peer"
            {...props}
          />
          <div
            className={`
              ${sizeClasses[checkboxSize]}
              rounded border-2 border-neutral-50/60
              peer-checked:bg-pink-500 peer-checked:border-pink-500
              peer-focus:ring-2 peer-focus:ring-pink-300
              peer-disabled:bg-gray-100 peer-disabled:cursor-not-allowed
              transition-all
              flex items-center justify-center
              ${className}
            `}
          >
            <svg
              className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
        {label && (
          <span
            className={`ml-3 ${labelSizeClasses[checkboxSize]} text-neutral-50/70 peer-disabled:text-gray-400`}
          >
            {label}
          </span>
        )}
      </label>
    );
  },
);

Checkbox.displayName = "Checkbox";
