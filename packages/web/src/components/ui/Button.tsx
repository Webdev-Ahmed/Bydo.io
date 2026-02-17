import { cn } from "@/lib/utils";
import { motion, type HTMLMotionProps } from "motion/react";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary";
  outline?: boolean;
}

const Button = ({
  variant = "primary",
  outline = false,
  ...props
}: ButtonProps) => {
  const classes = cn(
    "font-medium transition-colors px-4 py-2 rounded-full cursor-pointer",
    variant === "primary"
      ? `${outline ? "border border-primary/70 text-primary hover:bg-primary/15" : "bg-primary hover:bg-primary/90"}`
      : `${outline ? "border border-text/50 text-text/85 hover:bg-text/10" : "bg-text text-background"}`,
    props.className ? props.className : "",
  );
  return (
    <motion.button
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      {...props}
      className={classes}
    >
      {props.children}
    </motion.button>
  );
};

export default Button;
