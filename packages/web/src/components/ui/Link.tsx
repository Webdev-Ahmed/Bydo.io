import { Link as RouterLink } from "react-router-dom";
import { cn } from "@/lib/utils";

interface LinkProps {
  children: React.ReactNode;
  to: string;
  variant?: "button" | "button-filled" | "link";
  className?: string;
  colored?: boolean;
  outline?: boolean;
}

const Link = ({
  to,
  children,
  variant = "link",
  className,
  colored = false,
  outline = false,
}: LinkProps) => {
  const classes = cn(
    `font-medium transition-colors ${colored ? "text-primary" : ""}`,
    variant === "button"
      ? `${colored ? "hover:bg-primary/10" : "hover:bg-text/10"} px-4 py-2 rounded-full ${outline ? "border border-text/10 hover:border-text/20" : ""}`
      : variant === "button-filled"
        ? `bg-primary hover:bg-primary/90 px-4 py-2 rounded-full ${outline ? "border border-text/10 hover:border-text/20" : ""}`
        : "hover:underline",
    className ? className : "",
  );

  return (
    <RouterLink to={to} className={classes}>
      {children}
    </RouterLink>
  );
};

export default Link;
