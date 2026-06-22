import { ShieldCheck, ShieldOff } from "lucide-react";

interface RoleBadgeProps {
  role: "USER" | "ADMIN";
  variant?: "pill" | "full";
}

const RoleBadge = ({ role, variant = "full" }: RoleBadgeProps) => {
  const isAdmin = role === "ADMIN";

  if (variant === "pill") {
    if (!isAdmin) return null;
    return (
      <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-primary/10 text-primary/70 border border-primary/20">
        Admin
      </span>
    );
  }

  return (
    <div
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium ${
        isAdmin
          ? "bg-primary/10 border-primary/20 text-primary/70"
          : "bg-text/5 border-text/10 text-text/50"
      }`}
    >
      {isAdmin ? (
        <>
          <ShieldCheck className="size-3" /> Admin
        </>
      ) : (
        <>
          <ShieldOff className="size-3" /> User
        </>
      )}
    </div>
  );
};

export default RoleBadge;
