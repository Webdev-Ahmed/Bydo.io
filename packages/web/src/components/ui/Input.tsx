import { useState, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  icon?: React.ReactNode;
  password?: boolean;
}

const EyeIcon = ({ open }: { open: boolean }) =>
  open ? (
    <svg
      key="eye-open"
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg
      key="eye-closed"
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  );

const Input = ({ error, icon, password, ...props }: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const hasRightSlot = icon || password;

  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="relative">
        {hasRightSlot && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 mt-0.5 z-50 cursor-pointer">
            {password ? (
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword((p) => !p)}
                className="text-text/70 hover:text-text transition-colors cursor-pointer active:scale-[0.85]"
              >
                <EyeIcon open={showPassword} />
              </button>
            ) : (
              icon
            )}
          </span>
        )}

        <input
          {...props}
          type={password ? (showPassword ? "text" : "password") : props.type}
          className={cn(
            `px-4 py-2 rounded-full focus:scale-[1.01] border focus:ring-primary outline-0 focus:ring-2 transition placeholder:text-text/50 placeholder:text-sm w-full`,
            error ? "border-red-500/60 focus:ring-red-500" : "border-text/20",
            hasRightSlot ? "pr-10" : "",
            props.className ? props.className : "",
          )}
        />
      </div>

      {error && <p className="text-red-500 text-xs px-4">{error}</p>}
    </div>
  );
};

export default Input;
