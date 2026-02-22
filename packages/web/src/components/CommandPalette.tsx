import { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  CheckSquare,
  CalendarDays,
  User,
  Home,
  ShieldCheck,
  Clock,
  FileText,
  ArrowRight,
  CornerDownLeft,
} from "lucide-react";
import { formatDate, isPast, isToday } from "date-fns";

import { useCommandPalette } from "@/store/commandPaletteStore";
import { useAuthStore } from "@/store/authStore";
import { useTodoStore } from "@/store/todoStore";
import {
  commandPaletteBackdropVariants,
  commandPaletteVariants,
} from "@/lib/animations";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PageResult {
  kind: "page";
  label: string;
  description: string;
  href: string;
  icon: React.ElementType;
}

interface TodoResult {
  kind: "todo";
  id: string;
  text: string;
  done: boolean;
  dueDate: string | null | undefined;
  note: string | null | undefined;
}

type Result = PageResult | TodoResult;

// ─── Pages list ───────────────────────────────────────────────────────────────

const ALL_PAGES: (PageResult & { adminOnly?: boolean })[] = [
  {
    kind: "page",
    label: "Todos",
    description: "View and manage your tasks",
    href: "/todos",
    icon: CheckSquare,
  },
  {
    kind: "page",
    label: "Calendar",
    description: "Browse todos by due date",
    href: "/calendar",
    icon: CalendarDays,
  },
  {
    kind: "page",
    label: "Account",
    description: "Profile, preferences and settings",
    href: "/user",
    icon: User,
  },
  {
    kind: "page",
    label: "Home",
    description: "Back to the landing page",
    href: "/",
    icon: Home,
  },
  {
    kind: "page",
    label: "Admin panel",
    description: "Manage users and roles",
    href: "/admin",
    icon: ShieldCheck,
    adminOnly: true,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const matches = (text: string, query: string) =>
  text.toLowerCase().includes(query.toLowerCase());

// ─── Result rows ──────────────────────────────────────────────────────────────

const PageRow = ({
  page,
  isActive,
  onClick,
}: {
  page: PageResult;
  isActive: boolean;
  onClick: () => void;
}) => {
  const Icon = page.icon;
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
        isActive ? "bg-primary/10" : "hover:bg-text/5"
      }`}
    >
      <div
        className={`size-8 rounded-lg flex items-center justify-center shrink-0 border transition-colors ${
          isActive
            ? "bg-primary/15 border-primary/25 text-primary"
            : "bg-text/5 border-text/8 text-text/40"
        }`}
      >
        <Icon className="size-3.5" />
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium ${isActive ? "text-text/90" : "text-text/70"}`}
        >
          {page.label}
        </p>
        <p className="text-xs text-text/35 truncate">{page.description}</p>
      </div>
      <ArrowRight
        className={`size-3.5 shrink-0 transition-all ${
          isActive
            ? "opacity-60 text-primary translate-x-0"
            : "opacity-0 -translate-x-1"
        }`}
      />
    </button>
  );
};

const TodoRow = ({
  todo,
  isActive,
  onClick,
}: {
  todo: TodoResult;
  isActive: boolean;
  onClick: () => void;
}) => {
  const dueDate = todo.dueDate ? new Date(todo.dueDate) : null;
  const isOverdue =
    dueDate && !todo.done && isPast(dueDate) && !isToday(dueDate);
  const isDueToday = dueDate && isToday(dueDate);

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
        isActive ? "bg-primary/10" : "hover:bg-text/5"
      }`}
    >
      <div
        className={`size-8 rounded-lg flex items-center justify-center shrink-0 border transition-colors ${
          todo.done
            ? "bg-text/3 border-text/8"
            : isActive
              ? "bg-primary/15 border-primary/25"
              : "bg-text/5 border-text/8"
        }`}
      >
        <div
          className={`size-2.5 rounded-full border ${
            todo.done
              ? "bg-primary/40 border-primary/40"
              : isOverdue
                ? "border-rose-500/60"
                : "border-primary/50"
          }`}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm truncate ${
            todo.done
              ? "line-through text-text/35"
              : isActive
                ? "text-text/90 font-medium"
                : "text-text/70"
          }`}
        >
          {todo.text}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          {dueDate && (
            <span
              className={`text-[10px] flex items-center gap-1 ${
                isOverdue
                  ? "text-rose-500/70"
                  : isDueToday
                    ? "text-amber-500/70"
                    : "text-text/30"
              }`}
            >
              <Clock className="size-2.5" />
              {isOverdue
                ? `Overdue · ${formatDate(dueDate, "do MMM")}`
                : isDueToday
                  ? "Due today"
                  : formatDate(dueDate, "do MMM, yyyy")}
            </span>
          )}
          {todo.note && (
            <span className="text-[10px] text-text/25 flex items-center gap-1">
              <FileText className="size-2.5" />
              Note
            </span>
          )}
        </div>
      </div>
      <CornerDownLeft
        className={`size-3.5 shrink-0 transition-all ${
          isActive ? "opacity-40 text-primary" : "opacity-0"
        }`}
      />
    </button>
  );
};

const PalettePanel = ({
  isAdmin,
  todos,
  onClose,
  onSelect,
}: {
  isAdmin: boolean;
  todos: ReturnType<typeof useTodoStore.getState>["todos"];
  onClose: () => void;
  onSelect: (result: Result) => void;
}) => {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearTimeout(t);
  }, []);

  const pages = useMemo(
    () =>
      ALL_PAGES.filter((p) => {
        if (p.adminOnly && !isAdmin) return false;
        if (!query) return true;
        return matches(p.label, query) || matches(p.description, query);
      }),
    [query, isAdmin],
  );

  const filteredTodos = useMemo<TodoResult[]>(() => {
    if (!query) return [];
    return todos
      .filter(
        (t) => matches(t.text, query) || (t.note && matches(t.note, query)),
      )
      .slice(0, 6)
      .map((t) => ({
        kind: "todo" as const,
        id: t.id,
        text: t.text,
        done: t.done,
        dueDate: t.dueDate as string | null | undefined,
        note: (t as typeof t & { note?: string | null }).note,
      }));
  }, [query, todos]);

  const allResults = useMemo<Result[]>(
    () => [...pages, ...filteredTodos],
    [pages, filteredTodos],
  );

  const todoOffset = pages.length;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setActiveIndex(0);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % Math.max(allResults.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(
        (i) =>
          (i - 1 + Math.max(allResults.length, 1)) %
          Math.max(allResults.length, 1),
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (allResults[activeIndex]) onSelect(allResults[activeIndex]);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <motion.div
      variants={commandPaletteVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-full max-w-lg bg-background border border-text/10 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto"
      onKeyDown={onKeyDown}
    >
      <div className="flex items-center gap-3 px-4 py-3.5 border-b border-text/8">
        <Search className="size-4 text-text/30 shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search todos, navigate pages…"
          className="flex-1 bg-transparent outline-none text-sm placeholder:text-text/25 text-text/80"
        />
        <kbd className="hidden sm:flex items-center gap-1 text-[10px] text-text/20 border border-text/10 rounded px-1.5 py-0.5 font-mono">
          ESC
        </kbd>
      </div>

      <div className="overflow-y-auto max-h-105 p-2">
        {allResults.length === 0 && query && (
          <p className="text-center text-sm text-text/25 italic py-10">
            No results for "{query}"
          </p>
        )}

        <div key={query}>
          {pages.length > 0 && (
            <div className="mb-1">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-text/25 font-serif px-3 py-1.5">
                {query ? "Pages" : "Navigate"}
              </p>
              {pages.map((page, i) => (
                <PageRow
                  key={page.href}
                  page={page}
                  isActive={activeIndex === i}
                  onClick={() => onSelect(page)}
                />
              ))}
            </div>
          )}

          {filteredTodos.length > 0 && (
            <div className="mt-1">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-text/25 font-serif px-3 py-1.5">
                Todos
              </p>
              {filteredTodos.map((todo, i) => (
                <TodoRow
                  key={todo.id}
                  todo={todo}
                  isActive={activeIndex === todoOffset + i}
                  onClick={() => onSelect(todo)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-text/6 px-4 py-2 flex items-center gap-4">
        <span className="text-[10px] text-text/20 flex items-center gap-1.5">
          <kbd className="border border-text/10 rounded px-1 py-0.5 font-mono">
            ↑↓
          </kbd>
          navigate
        </span>
        <span className="text-[10px] text-text/20 flex items-center gap-1.5">
          <kbd className="border border-text/10 rounded px-1 py-0.5 font-mono">
            ↵
          </kbd>
          select
        </span>
        <span className="ml-auto text-[10px] text-text/15">⌘K to toggle</span>
      </div>
    </motion.div>
  );
};

const CommandPalette = () => {
  const { isOpen, close } = useCommandPalette();
  const { isAdmin } = useAuthStore();
  const { todos } = useTodoStore();
  const navigate = useNavigate();

  const [openCount, setOpenCount] = useState(0);

  useEffect(() => {
    if (!isOpen) return;
    const id = window.setTimeout(() => setOpenCount((c) => c + 1), 0);
    return () => clearTimeout(id);
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        useCommandPalette.getState().toggle();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleSelect = (result: Result) => {
    close();
    if (result.kind === "page") {
      navigate(result.href);
    } else {
      navigate(`/todos?highlight=${result.id}`);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="cp-backdrop"
            variants={commandPaletteBackdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-60 bg-background/60 backdrop-blur-sm"
            onClick={close}
          />
          <div className="fixed inset-0 z-61 flex items-start justify-center pt-[15vh] px-4 pointer-events-none">
            <PalettePanel
              key={openCount}
              isAdmin={isAdmin}
              todos={todos}
              onClose={close}
              onSelect={handleSelect}
            />
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
