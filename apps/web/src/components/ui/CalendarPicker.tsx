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
import { ease } from "@/lib/animations";

interface CalendarPickerProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  disablePast?: boolean;
}

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const CalendarPicker = ({
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
  const [flippedUp, setFlippedUp] = useState(false);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateCoords = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const dropdownWidth = 256;
    const dropdownHeight = 320;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const left =
      rect.left + dropdownWidth > viewportWidth
        ? viewportWidth - dropdownWidth - 8
        : rect.left;

    const spaceBelow = viewportHeight - rect.bottom;
    const shouldFlip = spaceBelow < dropdownHeight;

    const top = shouldFlip ? rect.top - (dropdownHeight - 30) : rect.bottom + 6;

    setFlippedUp(shouldFlip);
    setCoords({ top, left });
  };

  const handleOpen = () => {
    updateCoords();
    if (value) setViewDate(new Date(value + "T00:00:00"));
    setIsOpen((p) => !p);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onChange("");
    setIsOpen(false);
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

  useEffect(() => {
    if (!isOpen) return;
    const handleScroll = () => updateCoords();
    window.addEventListener("scroll", handleScroll, true);
    return () => window.removeEventListener("scroll", handleScroll, true);
  }, [isOpen]);

  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(viewDate);
  const days = eachDayOfInterval({
    start: startOfWeek(monthStart),
    end: endOfWeek(monthEnd),
  });

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

  const isDisabled = (day: Date) => disablePast && isPast(day) && !isToday(day);

  return (
    <div className="relative">
      <motion.button
        ref={triggerRef}
        type="button"
        onClick={handleOpen}
        className={`group flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs transition-all ${
          isOpen
            ? "border-primary/50 bg-primary/6 text-text"
            : selectedDate
              ? "border-text/20 bg-text/3 text-text/70 hover:border-text/30 hover:text-text"
              : "border-text/12 bg-transparent text-text/40 hover:border-text/25 hover:text-text/70"
        }`}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.1 }}
      >
        <CalendarDays className="size-3 shrink-0" />
        <span className="leading-none">
          {selectedDate ? format(selectedDate, "do MMM, yyyy") : placeholder}
        </span>

        <AnimatePresence>
          {selectedDate && (
            <motion.button
              type="button"
              initial={{ opacity: 0, scale: 0.5, width: 0 }}
              animate={{ opacity: 1, scale: 1, width: "auto" }}
              exit={{ opacity: 0, scale: 0.5, width: 0 }}
              transition={{ duration: 0.15 }}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={handleClear}
              className="flex items-center justify-center rounded-full p-0.5 text-text/30 hover:text-text/70 hover:bg-text/10 transition-colors ml-0.5"
              tabIndex={-1}
              aria-label="Clear date"
            >
              <X className="size-2.5" />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.button>

      {isOpen &&
        createPortal(
          <AnimatePresence>
            <motion.div
              ref={containerRef}
              className="fixed z-9999 w-64 rounded-2xl border border-text/8 bg-background shadow-2xl shadow-text/8 overflow-hidden"
              style={{ top: coords.top, left: coords.left }}
              initial={{
                opacity: 0,
                y: flippedUp ? 8 : -8,
                filter: "blur(6px)",
              }}
              animate={{
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                transition: { ease },
              }}
              exit={{
                opacity: 0,
                y: flippedUp ? 8 : -8,
                filter: "blur(6px)",
                transition: { duration: 0.18, ease: "easeIn" },
              }}
            >
              <div className="flex items-center justify-between px-3 py-2.5 border-b border-text/5">
                <motion.button
                  type="button"
                  onClick={goToPrev}
                  className="p-1.5 rounded-lg hover:bg-text/8 text-text/30 hover:text-text/70 transition-colors"
                  whileTap={{ scale: 0.88 }}
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
                    <motion.p
                      key={format(viewDate, "MMM-yyyy")}
                      className="text-xs font-semibold text-text/80"
                      custom={direction}
                      variants={{
                        hidden: (d: number) => ({
                          opacity: 0,
                          x: d > 0 ? 14 : -14,
                          filter: "blur(3px)",
                        }),
                        visible: {
                          opacity: 1,
                          x: 0,
                          filter: "blur(0px)",
                          transition: { ease },
                        },
                        exit: (d: number) => ({
                          opacity: 0,
                          x: d > 0 ? -14 : 14,
                          filter: "blur(3px)",
                          transition: { duration: 0.13 },
                        }),
                      }}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <span className="font-serif italic text-primary">
                        {format(viewDate, "MMMM")}
                      </span>{" "}
                      <span className="text-text/50 font-sans font-medium">
                        {format(viewDate, "yyyy")}
                      </span>
                    </motion.p>
                  </AnimatePresence>
                </div>

                <motion.button
                  type="button"
                  onClick={goToNext}
                  className="p-1.5 rounded-lg hover:bg-text/8 text-text/30 hover:text-text/70 transition-colors"
                  whileTap={{ scale: 0.88 }}
                  transition={{ duration: 0.1 }}
                >
                  <ChevronRight className="size-3.5" />
                </motion.button>
              </div>

              <div className="grid grid-cols-7 px-3 pt-2.5 pb-1">
                {DAYS.map((d) => (
                  <div
                    key={d}
                    className="text-center text-[9px] font-semibold text-text/20 tracking-wide pb-1"
                  >
                    {d}
                  </div>
                ))}
              </div>

              <div className="overflow-hidden px-3 pb-2">
                <AnimatePresence mode="wait" initial={false} custom={direction}>
                  <motion.div
                    key={format(viewDate, "MMM-yyyy")}
                    className="grid grid-cols-7 gap-y-0.5"
                    custom={direction}
                    variants={{
                      hidden: (d: number) => ({
                        opacity: 0,
                        x: d > 0 ? 18 : -18,
                        filter: "blur(4px)",
                      }),
                      visible: {
                        opacity: 1,
                        x: 0,
                        filter: "blur(0px)",
                        transition: { ease, staggerChildren: 0.012 },
                      },
                      exit: (d: number) => ({
                        opacity: 0,
                        x: d > 0 ? -18 : 18,
                        filter: "blur(4px)",
                        transition: { duration: 0.15 },
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
                      const inMonth = isSameMonth(day, viewDate);
                      const disabled = isDisabled(day);

                      return (
                        <motion.button
                          key={day.toISOString()}
                          type="button"
                          onClick={() => handleSelect(day)}
                          disabled={disabled}
                          variants={{
                            hidden: { opacity: 0 },
                            visible: { opacity: 1 },
                          }}
                          whileHover={
                            !isSelected && !disabled && inMonth
                              ? { scale: 1.18 }
                              : {}
                          }
                          whileTap={!disabled ? { scale: 0.9 } : {}}
                          transition={{ duration: 0.1 }}
                          className={`
                            aspect-square flex items-center justify-center rounded-full text-[11px] transition-colors
                            ${!inMonth ? "text-text/12 pointer-events-none" : ""}
                            ${disabled ? "cursor-not-allowed opacity-25" : "cursor-pointer"}
                            ${
                              isSelected
                                ? "bg-primary text-white font-semibold shadow-sm shadow-primary/30"
                                : isCurrent && inMonth
                                  ? "border border-primary/50 text-primary font-semibold"
                                  : inMonth && !disabled
                                    ? "text-text/70 hover:bg-text/8"
                                    : ""
                            }
                          `}
                        >
                          {format(day, "d")}
                        </motion.button>
                      );
                    })}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="border-t border-text/5 px-3 py-2 flex items-center justify-between">
                <motion.button
                  type="button"
                  onClick={() => handleSelect(new Date())}
                  className="text-[11px] font-medium text-primary/70 hover:text-primary transition-colors px-2 py-1 rounded-lg hover:bg-primary/6"
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.1 }}
                >
                  Today
                </motion.button>

                <AnimatePresence>
                  {selectedDate && (
                    <motion.button
                      type="button"
                      initial={{ opacity: 0, x: 6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 6 }}
                      transition={{ duration: 0.15 }}
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={handleClear}
                      className="text-[11px] text-text/25 hover:text-rose-500/70 transition-colors px-2 py-1 rounded-lg hover:bg-rose-500/5 flex items-center gap-1"
                      whileTap={{ scale: 0.95 }}
                    >
                      <X className="size-2.5" />
                      Clear
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
};

export default CalendarPicker;
