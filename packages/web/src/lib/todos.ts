import { isToday, isYesterday, isThisWeek } from "date-fns";
import type { DateGroup } from "@/types";

export const getDateGroup = (dateStr: string | Date): DateGroup => {
  const date = new Date(dateStr);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  if (isThisWeek(date)) return "This Week";
  return "Older";
};

export const toDateStr = (
  dueDate: string | Date | null | undefined,
): string => {
  if (!dueDate) return "";
  try {
    return new Date(dueDate).toISOString().split("T")[0];
  } catch {
    return "";
  }
};

export const DATE_GROUP_ORDER: DateGroup[] = [
  "Today",
  "Yesterday",
  "This Week",
  "Older",
];
