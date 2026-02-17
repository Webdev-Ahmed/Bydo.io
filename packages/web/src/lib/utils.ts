import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: string[]): string => {
  return clsx(twMerge(inputs));
};
