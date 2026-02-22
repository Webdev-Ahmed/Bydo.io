import type { Todo } from "@todo/shared";
import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  isToday,
  isPast,
  addMonths,
  subMonths,
} from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckSquare,
  FileText,
} from "lucide-react";

import {
  ease,
  fadeUpVariants,
  staggerContainer,
  dayCellVariants,
} from "@/lib/animations";
import { Layout } from "@/components";
import { useTodoStore } from "@/store/todoStore";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const getDueTodosForDay = (todos: Todo[], day: Date) =>
  todos.filter((t) => t.dueDate && isSameDay(new Date(t.dueDate), day));

const isTodoOverdue = (todo: Todo) =>
  !!todo.dueDate &&
  !todo.done &&
  isPast(new Date(todo.dueDate)) &&
  !isToday(new Date(todo.dueDate));

// ─── Todo chip rendered inside a calendar cell ────────────────────────────────

const TodoChip = ({ todo }: { todo: Todo }) => {
  const isOverdue = isTodoOverdue(todo);

  return (
    <div
      className={`flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] truncate leading-tight ${
        todo.done
          ? "bg-primary/8 text-primary/50 line-through"
          : isOverdue
            ? "bg-rose-500/10 text-rose-500/80"
            : "bg-primary/10 text-primary/80"
      }`}
    >
      {todo.done ? (
        <CheckSquare className="size-2 shrink-0" />
      ) : isOverdue ? (
        <Clock className="size-2 shrink-0" />
      ) : (
        <div className="size-1.5 rounded-full bg-primary/60 shrink-0" />
      )}
      <span className="truncate">{todo.text}</span>
    </div>
  );
};

// ─── Day cell ─────────────────────────────────────────────────────────────────

const DayCell = ({
  day,
  viewDate,
  todos,
  isSelected,
  onClick,
}: {
  day: Date;
  viewDate: Date;
  todos: Todo[];
  isSelected: boolean;
  onClick: () => void;
}) => {
  const inMonth = isSameMonth(day, viewDate);
  const today = isToday(day);
  const hasOverdue = todos.some(isTodoOverdue);
  const MAX_VISIBLE = 2;
  const overflow = todos.length - MAX_VISIBLE;

  return (
    <motion.button
      onClick={onClick}
      variants={dayCellVariants}
      className={`relative flex flex-col items-start rounded-xl p-1.5 sm:p-2 text-left min-h-18 sm:min-h-22.5 transition-colors border ${
        isSelected
          ? "border-primary/30 bg-primary/5"
          : today
            ? "border-primary/20 bg-primary/3"
            : inMonth
              ? "border-text/5 bg-transparent hover:bg-text/2 hover:border-text/10"
              : "border-transparent bg-transparent"
      }`}
      whileHover={inMonth && !isSelected ? { scale: 1.01 } : {}}
      whileTap={inMonth ? { scale: 0.98 } : {}}
      transition={{ duration: 0.12 }}
    >
      <div className="flex items-center justify-between w-full mb-1">
        <span
          className={`text-xs font-medium w-5 h-5 flex items-center justify-center rounded-full ${
            today
              ? "bg-primary text-primary-foreground font-bold"
              : inMonth
                ? "text-text/70"
                : "text-text/20"
          }`}
        >
          {format(day, "d")}
        </span>
        {hasOverdue && inMonth && (
          <span className="size-1.5 rounded-full bg-rose-500/60 shrink-0" />
        )}
      </div>

      {inMonth && (
        <div className="flex flex-col gap-0.5 w-full">
          {todos.slice(0, MAX_VISIBLE).map((todo) => (
            <TodoChip key={todo.id} todo={todo} />
          ))}
          {overflow > 0 && (
            <span className="text-[10px] text-text/30 pl-1">
              +{overflow} more
            </span>
          )}
        </div>
      )}
    </motion.button>
  );
};

// ─── Selected day panel ───────────────────────────────────────────────────────

const DayPanel = ({
  day,
  todos,
  onClose,
}: {
  day: Date;
  todos: Todo[];
  onClose: () => void;
}) => {
  const activeTodos = todos.filter((t) => !t.done);
  const completedTodos = todos.filter((t) => t.done);

  const [expandedNote, setExpandedNote] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.25, ease }}
      className="rounded-2xl border border-text/8 bg-text/2 overflow-hidden"
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-text/6">
        <div>
          <p className="text-xs text-text/35 mb-0.5">{format(day, "EEEE")}</p>
          <h3 className="text-xl font-semibold">
            <span className="font-serif italic text-primary">
              {format(day, "do")}
            </span>{" "}
            <span className="text-text/70">{format(day, "MMMM, yyyy")}</span>
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-text/25 hover:text-text/60 hover:bg-text/8 transition-colors text-xs"
        >
          ✕
        </button>
      </div>

      <div className="p-5">
        {todos.length === 0 ? (
          <p className="text-sm text-text/25 italic text-center py-4">
            No todos due on this day.
          </p>
        ) : (
          <div className="flex flex-col gap-5">
            {activeTodos.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-text/30 font-serif mb-2">
                  Due · {activeTodos.length}
                </p>
                <div className="flex flex-col gap-2">
                  {activeTodos.map((todo) => {
                    const overdue = isTodoOverdue(todo);
                    const note = (todo as Todo & { note?: string | null }).note;
                    const hasNote = !!note;
                    const noteOpen = expandedNote === todo.id;

                    return (
                      <div
                        key={todo.id}
                        className={`rounded-xl border overflow-hidden ${
                          overdue
                            ? "border-rose-500/15 bg-rose-500/3"
                            : "border-text/6 bg-text/1"
                        }`}
                      >
                        <div className="flex items-start gap-3 px-3 py-2.5">
                          <div
                            className={`mt-1 size-2.5 rounded-full border shrink-0 ${
                              overdue
                                ? "border-rose-500/50"
                                : "border-primary/50"
                            }`}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-text/80">{todo.text}</p>
                            {overdue && (
                              <p className="text-[10px] text-rose-500/60 mt-0.5 flex items-center gap-1">
                                <Clock className="size-2.5" />
                                Overdue
                              </p>
                            )}
                          </div>
                          {hasNote && (
                            <button
                              onClick={() =>
                                setExpandedNote(noteOpen ? null : todo.id)
                              }
                              className={`shrink-0 p-1 rounded-md transition-colors ${
                                noteOpen
                                  ? "text-primary/70 bg-primary/8"
                                  : "text-text/25 hover:text-text/60 hover:bg-text/8"
                              }`}
                            >
                              <FileText className="size-3" />
                            </button>
                          )}
                        </div>

                        <AnimatePresence initial={false}>
                          {hasNote && noteOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{
                                height: { duration: 0.22, ease },
                                opacity: { duration: 0.15 },
                              }}
                              className="overflow-hidden"
                            >
                              <p className="text-xs text-text/45 leading-relaxed px-3 pb-3 border-t border-text/5 pt-2 whitespace-pre-wrap">
                                {note}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {completedTodos.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-text/30 font-serif mb-2">
                  Completed · {completedTodos.length}
                </p>
                <div className="flex flex-col gap-2">
                  {completedTodos.map((todo) => (
                    <div
                      key={todo.id}
                      className="flex items-start gap-3 px-3 py-2.5 rounded-xl border border-text/6 bg-text/1"
                    >
                      <CheckSquare className="mt-0.5 size-2.5 text-primary/40 shrink-0" />
                      <p className="text-sm text-text/35 line-through">
                        {todo.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ─── Legend ───────────────────────────────────────────────────────────────────

const Legend = () => (
  <div className="flex items-center gap-4 flex-wrap px-4 pb-3 pt-2 border-t border-text/4">
    <div className="flex items-center gap-1.5">
      <div className="size-1.5 rounded-full bg-primary/60" />
      <span className="text-[10px] text-text/30">Active</span>
    </div>
    <div className="flex items-center gap-1.5">
      <Clock className="size-2.5 text-rose-500/60" />
      <span className="text-[10px] text-text/30">Overdue</span>
    </div>
    <div className="flex items-center gap-1.5">
      <CheckSquare className="size-2.5 text-primary/40" />
      <span className="text-[10px] text-text/30">Completed</span>
    </div>
    <div className="flex items-center gap-1.5">
      <span className="size-1.5 rounded-full bg-rose-500/60 inline-block" />
      <span className="text-[10px] text-text/30">Day has overdue</span>
    </div>
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

const CalendarPage = () => {
  const { todos, fetchTodos, isLoading } = useTodoStore();
  const [viewDate, setViewDate] = useState(new Date());
  const [direction, setDirection] = useState(1);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const duedTodos = useMemo(() => todos.filter((t) => !!t.dueDate), [todos]);

  const days = useMemo(() => {
    const monthStart = startOfMonth(viewDate);
    const monthEnd = endOfMonth(viewDate);
    return eachDayOfInterval({
      start: startOfWeek(monthStart),
      end: endOfWeek(monthEnd),
    });
  }, [viewDate]);

  const selectedDayTodos = useMemo(
    () => (selectedDay ? getDueTodosForDay(duedTodos, selectedDay) : []),
    [selectedDay, duedTodos],
  );

  const isCurrentMonth = isSameMonth(viewDate, new Date());

  const goToPrev = useCallback(() => {
    setDirection(-1);
    setViewDate((d) => subMonths(d, 1));
    setSelectedDay(null);
  }, []);

  const goToNext = useCallback(() => {
    setDirection(1);
    setViewDate((d) => addMonths(d, 1));
    setSelectedDay(null);
  }, []);

  const goToToday = useCallback(() => {
    const now = new Date();
    setDirection(viewDate < now ? 1 : -1);
    setViewDate(now);
    setSelectedDay(now);
  }, [viewDate]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;
      if (e.key === "ArrowLeft") goToPrev();
      else if (e.key === "ArrowRight") goToNext();
      else if (e.key === "Escape") setSelectedDay(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goToPrev, goToNext]);

  const handleDayClick = (day: Date) => {
    if (!isSameMonth(day, viewDate)) return;
    setSelectedDay((prev) => (prev && isSameDay(prev, day) ? null : day));
  };

  const monthTodos = useMemo(
    () => duedTodos.filter((t) => isSameMonth(new Date(t.dueDate!), viewDate)),
    [duedTodos, viewDate],
  );
  const doneCount = monthTodos.filter((t) => t.done).length;
  const overdueCount = monthTodos.filter(isTodoOverdue).length;

  return (
    <Layout>
      <section className="px-4 sm:px-6 mt-36 flex flex-col items-center pb-24">
        <motion.div
          className="md:max-w-4xl lg:max-w-5xl w-full"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={fadeUpVariants}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8"
          >
            <div>
              <p className="text-sm text-text/35 mb-1">Calendar</p>
              <h1 className="text-4xl sm:text-5xl font-semibold">
                <span className="font-serif italic text-primary">Due </span>
                <span className="text-text/80">dates.</span>
              </h1>
            </div>

            {!isLoading && (
              <div className="flex flex-col items-start sm:items-end gap-1">
                <div className="flex items-center gap-3 text-xs text-text/40">
                  <span>{monthTodos.length} due this month</span>
                  {doneCount > 0 && (
                    <>
                      <span className="text-text/15">·</span>
                      <span className="text-primary/60">{doneCount} done</span>
                    </>
                  )}
                  {overdueCount > 0 && (
                    <>
                      <span className="text-text/15">·</span>
                      <span className="text-rose-500/60">
                        {overdueCount} overdue
                      </span>
                    </>
                  )}
                </div>
                <p className="text-[10px] text-text/20 hidden sm:block">
                  ← → to navigate · click a day to expand · Esc to close
                </p>
              </div>
            )}
          </motion.div>

          <motion.div
            variants={fadeUpVariants}
            className="rounded-2xl border border-text/8 bg-text/1 overflow-hidden mb-4"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-text/6">
              <motion.button
                onClick={goToPrev}
                className="p-2 rounded-xl text-text/40 hover:text-text/80 hover:bg-text/8 transition-colors"
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.1 }}
              >
                <ChevronLeft className="size-4" />
              </motion.button>

              <div className="flex items-center gap-3">
                <div className="overflow-hidden">
                  <AnimatePresence
                    mode="wait"
                    initial={false}
                    custom={direction}
                  >
                    <motion.h2
                      key={format(viewDate, "MMM-yyyy")}
                      custom={direction}
                      variants={{
                        hidden: (d: number) => ({
                          opacity: 0,
                          x: d > 0 ? 24 : -24,
                          filter: "blur(4px)",
                        }),
                        visible: {
                          opacity: 1,
                          x: 0,
                          filter: "blur(0px)",
                          transition: { duration: 0.28, ease },
                        },
                        exit: (d: number) => ({
                          opacity: 0,
                          x: d > 0 ? -24 : 24,
                          filter: "blur(4px)",
                          transition: { duration: 0.18 },
                        }),
                      }}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="text-base font-semibold text-text/80"
                    >
                      <span className="font-serif italic text-primary">
                        {format(viewDate, "MMMM")}
                      </span>{" "}
                      {format(viewDate, "yyyy")}
                    </motion.h2>
                  </AnimatePresence>
                </div>

                <AnimatePresence>
                  {!isCurrentMonth && (
                    <motion.button
                      onClick={goToToday}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.18, ease }}
                      className="text-[10px] font-semibold px-2.5 py-1 rounded-full border border-primary/25 bg-primary/8 text-primary/70 hover:bg-primary/15 hover:text-primary transition-colors"
                    >
                      Today
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              <motion.button
                onClick={goToNext}
                className="p-2 rounded-xl text-text/40 hover:text-text/80 hover:bg-text/8 transition-colors"
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.1 }}
              >
                <ChevronRight className="size-4" />
              </motion.button>
            </div>

            <div className="grid grid-cols-7 px-3 pt-3 pb-1 border-b border-text/4">
              {DAYS.map((d) => (
                <div
                  key={d}
                  className="text-center text-[10px] font-semibold text-text/25 tracking-wider pb-2"
                >
                  {d}
                </div>
              ))}
            </div>

            <div className="p-2 sm:p-3">
              <AnimatePresence mode="wait" initial={false} custom={direction}>
                <motion.div
                  key={format(viewDate, "MMM-yyyy")}
                  custom={direction}
                  variants={{
                    hidden: (d: number) => ({
                      opacity: 0,
                      x: d > 0 ? 30 : -30,
                      filter: "blur(6px)",
                    }),
                    visible: {
                      opacity: 1,
                      x: 0,
                      filter: "blur(0px)",
                      transition: {
                        duration: 0.28,
                        ease,
                        staggerChildren: 0.006,
                        delayChildren: 0.05,
                      },
                    },
                    exit: (d: number) => ({
                      opacity: 0,
                      x: d > 0 ? -30 : 30,
                      filter: "blur(6px)",
                      transition: { duration: 0.2 },
                    }),
                  }}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="grid grid-cols-7 gap-1 sm:gap-1.5"
                >
                  {days.map((day) => {
                    const dayTodos = getDueTodosForDay(duedTodos, day);
                    const isSelected = selectedDay
                      ? isSameDay(day, selectedDay)
                      : false;
                    return (
                      <DayCell
                        key={day.toISOString()}
                        day={day}
                        viewDate={viewDate}
                        todos={dayTodos}
                        isSelected={isSelected}
                        onClick={() => handleDayClick(day)}
                      />
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </div>

            <Legend />
          </motion.div>

          <AnimatePresence>
            {selectedDay && (
              <DayPanel
                key={selectedDay.toISOString()}
                day={selectedDay}
                todos={selectedDayTodos}
                onClose={() => setSelectedDay(null)}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {!isLoading && monthTodos.length === 0 && (
              <motion.p
                variants={fadeUpVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
                className="text-center text-sm text-text/25 italic py-6"
              >
                No todos with due dates in {format(viewDate, "MMMM")}.
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </section>
    </Layout>
  );
};

export default CalendarPage;
