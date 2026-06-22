import { Link } from "react-router-dom";

interface LogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  rounded?: boolean;
}

const Logo = ({ size = "md", rounded = false }: LogoProps) => {
  const sizeMap = {
    xs: 32,
    sm: 36,
    md: 40,
    lg: 48,
    xl: 56,
  };

  const px = sizeMap[size];

  return (
    <Link to="/">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
        width={px}
        height={px}
      >
        <rect width="64" height="64" rx={rounded ? 50 : 18} fill="#ef233c" />

        <polyline
          points="16,20 32,32 16,44"
          stroke="#edf2f4"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity="0.4"
        />
        <polyline
          points="32,20 48,32 32,44"
          stroke="#edf2f4"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </Link>
  );
};

export default Logo;
