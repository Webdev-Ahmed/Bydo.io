import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: string[]): string => {
  return clsx(twMerge(inputs));
};

export const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
