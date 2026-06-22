import { getInitials } from "@/lib/utils";

interface UserAvatarProps {
  name: string;
  size?: "sm" | "lg";
}

const sizeMap = {
  sm: { wrapper: "size-9", text: "text-sm" },
  lg: { wrapper: "size-20 border-2", text: "text-2xl" },
};

const UserAvatar = ({ name, size = "sm" }: UserAvatarProps) => {
  const { wrapper, text } = sizeMap[size];
  return (
    <div
      className={`${wrapper} rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0`}
    >
      <span className={`${text} font-bold font-serif text-primary`}>
        {getInitials(name)}
      </span>
    </div>
  );
};

export default UserAvatar;
