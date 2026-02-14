import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

const Card = ({ children, className = "", hover = false }: CardProps) => {
  const hoverStyles = hover
    ? "hover:shadow-lg hover:border-neutral-50/20 transition-all cursor-pointer"
    : "";

  return (
    <div
      className={`bg-neutral-50/5 border border-neutral-50/5 rounded-2xl shadow-md p-4 ${hoverStyles} ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
