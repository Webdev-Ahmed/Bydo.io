import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  outline?: boolean;
}

const Button = ({
  variant = "primary",
  outline = false,
  className,
  children,
  ...props
}: ButtonProps) => {
  const classes = cn(
    "font-medium transition-all duration-200 px-4 py-2 rounded-full cursor-pointer",
    "hover:-translate-y-0.5 active:translate-y-0",
    props.disabled
      ? "bg-text/10 cursor-not-allowed"
      : variant === "primary"
        ? outline
          ? "border border-primary/70 text-primary hover:bg-primary/15"
          : "bg-primary hover:shadow-[0_8px_16px_-4px_color-mix(in_srgb,var(--color-primary)_30%,transparent),0_14px_32px_-6px_color-mix(in_srgb,var(--color-primary)_30%,transparent)] active:shadow-none"
        : outline
          ? "border border-text/50 text-text/85 hover:bg-text/10"
          : "bg-text text-background hover:shadow-[0_8px_16px_-4px_color-mix(in_srgb,var(--color-text)_20%,transparent),0_14px_32px_-6px_color-mix(in_srgb,var(--color-text)_25%,transparent)] active:shadow-none",
    className ?? "",
  );

  return (
    <button {...props} className={classes}>
      {children}
    </button>
  );
};

export default Button;
