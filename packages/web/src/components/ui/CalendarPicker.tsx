import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  isPast,
  addMonths,
  subMonths,
} from "date-fns";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, CalendarDays, X } from "lucide-react";
import { ease, calendarDropdownVariants } from "@/lib/animations";

interface CalendarPickerProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  disablePast?: boolean;
}

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export const CalendarPicker = ({
  value,
  onChange,
  placeholder = "Pick a date",
  disablePast = false,
}: CalendarPickerProps) => {
  const selectedDate = value ? new Date(value + "T00:00:00") : null;

  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(selectedDate ?? new Date());
  const [direction, setDirection] = useState(1);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  const triggerRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleOpen = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({ top: rect.bottom + 8, left: rect.left });
    }
    if (value) {
      setViewDate(new Date(value + "T00:00:00"));
    }
    setIsOpen((p) => !p);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen]);

  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(viewDate);
  const gridStart = startOfWeek(monthStart);
  const gridEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  const goToPrev = () => {
    setDirection(-1);
    setViewDate((d) => subMonths(d, 1));
  };

  const goToNext = () => {
    setDirection(1);
    setViewDate((d) => addMonths(d, 1));
  };

  const handleSelect = (day: Date) => {
    if (disablePast && isPast(day) && !isToday(day)) return;
    onChange(format(day, "yyyy-MM-dd"));
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
  };

  const isDisabled = (day: Date) => disablePast && isPast(day) && !isToday(day);

  return (
    <div className="relative">
      <motion.button
        ref={triggerRef}
        type="button"
        onClick={handleOpen}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs transition-colors ${
          isOpen
            ? "border-primary bg-primary/5 text-text"
            : "border-text/15 bg-transparent text-text/60 hover:text-text hover:border-text/30"
        }`}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.1 }}
      >
        <CalendarDays className="size-3.5 shrink-0" />
        <span>
          {selectedDate ? format(selectedDate, "do MMM, yyyy") : placeholder}
        </span>

        <AnimatePresence>
          {selectedDate && (
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.15 }}
              onClick={handleClear}
              className="ml-0.5 rounded-full hover:bg-text/10 p-0.5 text-text/40 hover:text-text transition-colors"
            >
              <X className="size-2.5" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {isOpen &&
        createPortal(
          <AnimatePresence>
            <motion.div
              ref={containerRef}
              className="absolute z-999 w-64 rounded-2xl border border-text/10 bg-background shadow-xl overflow-hidden"
              style={{ top: coords.top, left: coords.left }}
              variants={calendarDropdownVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-text/5">
                <motion.button
                  type="button"
                  onClick={goToPrev}
                  className="p-1.5 rounded-lg hover:bg-text/10 text-text/50 hover:text-text transition-colors"
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.1 }}
                >
                  <ChevronLeft className="size-3.5" />
                </motion.button>

                <div className="overflow-hidden flex-1 mx-2 flex justify-center">
                  <AnimatePresence
                    mode="wait"
                    initial={false}
                    custom={direction}
                  >
                    <motion.span
                      key={format(viewDate, "MMM-yyyy")}
                      className="text-sm font-semibold"
                      custom={direction}
                      variants={{
                        hidden: (d: number) => ({
                          opacity: 0,
                          x: d > 0 ? 16 : -16,
                          filter: "blur(4px)",
                        }),
                        visible: {
                          opacity: 1,
                          x: 0,
                          filter: "blur(0px)",
                          transition: { ease },
                        },
                        exit: (d: number) => ({
                          opacity: 0,
                          x: d > 0 ? -16 : 16,
                          filter: "blur(4px)",
                          transition: { duration: 0.15 },
                        }),
                      }}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      {format(viewDate, "MMMM yyyy")}
                    </motion.span>
                  </AnimatePresence>
                </div>

                <motion.button
                  type="button"
                  onClick={goToNext}
                  className="p-1.5 rounded-lg hover:bg-text/10 text-text/50 hover:text-text transition-colors"
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.1 }}
                >
                  <ChevronRight className="size-3.5" />
                </motion.button>
              </div>

              <div className="grid grid-cols-7 px-3 pt-3 pb-1">
                {DAYS.map((d) => (
                  <div
                    key={d}
                    className="text-center text-[10px] font-semibold text-text/25 pb-1"
                  >
                    {d}
                  </div>
                ))}
              </div>

              <div className="overflow-hidden px-3 pb-3">
                <AnimatePresence mode="wait" initial={false} custom={direction}>
                  <motion.div
                    key={format(viewDate, "MMM-yyyy")}
                    className="grid grid-cols-7 gap-y-0.5"
                    custom={direction}
                    variants={{
                      hidden: (d: number) => ({
                        opacity: 0,
                        x: d > 0 ? 20 : -20,
                        filter: "blur(4px)",
                      }),
                      visible: {
                        opacity: 1,
                        x: 0,
                        filter: "blur(0px)",
                        transition: {
                          ease,
                          staggerChildren: 0.015,
                        },
                      },
                      exit: (d: number) => ({
                        opacity: 0,
                        x: d > 0 ? -20 : 20,
                        filter: "blur(4px)",
                        transition: { duration: 0.18 },
                      }),
                    }}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {days.map((day) => {
                      const isSelected = selectedDate
                        ? isSameDay(day, selectedDate)
                        : false;
                      const isCurrent = isToday(day);
                      const isCurrentMonth = isSameMonth(day, viewDate);
                      const disabled = isDisabled(day);

                      return (
                        <motion.button
                          key={day.toISOString()}
                          type="button"
                          onClick={() => handleSelect(day)}
                          disabled={disabled}
                          className={`
                            relative aspect-square flex items-center justify-center rounded-full text-xs
                            transition-colors
                            ${!isCurrentMonth ? "text-text/15" : ""}
                            ${disabled ? "cursor-not-allowed text-text/15" : "cursor-pointer"}
                            ${
                              isSelected
                                ? "bg-primary text-primary-foreground font-semibold"
                                : isCurrent && !isSelected
                                  ? "border border-primary text-primary font-semibold"
                                  : isCurrentMonth && !disabled
                                    ? "hover:bg-text/10 text-text/80"
                                    : ""
                            }
                          `}
                          variants={{
                            hidden: { opacity: 0 },
                            visible: { opacity: 1 },
                          }}
                          whileHover={
                            !isSelected && !disabled ? { scale: 1.15 } : {}
                          }
                          whileTap={!disabled ? { scale: 0.92 } : {}}
                          transition={{ duration: 0.12 }}
                        >
                          {format(day, "d")}
                        </motion.button>
                      );
                    })}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="border-t border-text/5 px-4 py-2.5 flex items-center justify-between">
                <motion.button
                  type="button"
                  onClick={() => {
                    const today = new Date();
                    setViewDate(today);
                    handleSelect(today);
                  }}
                  className="text-xs text-primary hover:opacity-70 transition-opacity font-medium"
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.15 }}
                >
                  Today
                </motion.button>

                {selectedDate && (
                  <motion.button
                    type="button"
                    onClick={handleClear}
                    className="text-xs text-text/30 hover:text-rose-500 transition-colors"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ x: -2 }}
                    transition={{ duration: 0.15 }}
                  >
                    Clear
                  </motion.button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
};
