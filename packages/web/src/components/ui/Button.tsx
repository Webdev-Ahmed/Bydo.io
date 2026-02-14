import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface ButtonProps {
  type?: "link" | "button" | "submit";
  to?: string;
  variant?: "primary" | "secondary";
  onClick?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
  children: ReactNode;
  className?: string;
}

const Button = ({
  children,
  variant = "secondary",
  type = "button",
  to,
  onClick,
  disabled = false,
  fullWidth = false,
  className,
}: ButtonProps) => {
  const baseStyles = `py-2 px-3 rounded-lg font-semibold tracking-wide cursor-pointer transition-all ${className && className}`;

  const variantStyles =
    variant === "primary"
      ? "bg-pink-500 hover:bg-pink-600"
      : "bg-neutral-50/10 border border-neutral-50/15 shadow-sm shadow-neutral-50/5 hover:shadow-neutral-50/20 hover:shadow-lg hover:bg-neutral-50 hover:text-neutral-900 hover:border-neutral-50";

  const widthStyles = fullWidth ? "w-full" : "";
  const disabledStyles = disabled
    ? "opacity-50 cursor-not-allowed pointer-events-none"
    : "";

  const classname = `${baseStyles} ${variantStyles} ${widthStyles} ${disabledStyles}`;

  return type === "link" ? (
    <Link to={to!} className={classname}>
      {children}
    </Link>
  ) : (
    <button
      type={type === "submit" ? "submit" : "button"}
      onClick={onClick}
      disabled={disabled}
      className={classname}
    >
      {children}
    </button>
  );
};

export default Button;
