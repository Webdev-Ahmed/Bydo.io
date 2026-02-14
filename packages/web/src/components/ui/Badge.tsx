import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "success" | "warning" | "danger";
  size?: "sm" | "md" | "lg";
}

const Badge = ({
  children,
  variant = "secondary",
  size = "md",
}: BadgeProps) => {
  const baseStyles = "rounded-full font-semibold tracking-wide inline-block";

  const variantStyles = {
    primary: "bg-pink-500/20 text-pink-400 border border-pink-500/30",
    secondary:
      "bg-neutral-50/10 text-neutral-50/80 border border-neutral-50/15",
    success: "bg-green-500/20 text-green-400 border border-green-500/30",
    warning: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
    danger: "bg-red-500/20 text-red-400 border border-red-500/30",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base",
  };

  return (
    <span
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]}`}
    >
      {children}
    </span>
  );
};

export default Badge;
