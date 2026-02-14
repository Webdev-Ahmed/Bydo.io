import { Link } from "react-router-dom";

interface AvatarProps {
  name: string;
  to?: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "success" | "warning" | "danger";
}

const Avatar = ({
  name,
  to,
  size = "md",
  variant = "primary",
}: AvatarProps) => {
  const sizeStyles = {
    sm: "size-8 text-sm",
    md: "size-10 text-base",
    lg: "size-12 text-lg",
  };

  const variantStyles = {
    primary: "bg-pink-500",
    secondary: "bg-neutral-500",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    danger: "bg-red-500",
  };

  const initial = name.charAt(0).toUpperCase();

  const avatarContent = (
    <div
      className={`${sizeStyles[size]} ${variantStyles[variant]} relative rounded-full cursor-pointer flex items-center justify-center font-semibold text-white after:content-[''] after:absolute after:inset-0 after:bg-neutral-50/30 after:rounded-full after:-z-1 hover:after:-inset-1 after:transition-all after:pointer-events-none`}
    >
      <span className="pointer-events-none select-none">{initial}</span>
    </div>
  );

  if (to) {
    return <Link to={to}>{avatarContent}</Link>;
  }

  return avatarContent;
};

export default Avatar;
