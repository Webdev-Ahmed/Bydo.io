import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface NavLinkProps {
  to: string;
  className?: string;
  children: ReactNode;
}

const NavLink = ({ to, className, children }: NavLinkProps) => {
  return (
    <Link
      to={to}
      className={`py-1.5 px-4 text-neutral-100/80 bg-neutral-100/10 rounded-full border border-neutral-100/20 hover:bg-neutral-100/15 hover:border-neutral-100/25 hover:text-neutral-100 transition ${className && className}`}
    >
      {children}
    </Link>
  );
};

export default NavLink;
