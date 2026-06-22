interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary";
}

const Spinner = ({ size = "md", variant = "primary" }: SpinnerProps) => {
  const sizeStyles = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };

  const variantStyles = {
    primary: "border-primary border-t-transparent",
    secondary: "border-text border-t-transparent",
  };

  return (
    <div
      className={`${sizeStyles[size]} ${variantStyles[variant]} rounded-full animate-spin`}
    />
  );
};

export default Spinner;
