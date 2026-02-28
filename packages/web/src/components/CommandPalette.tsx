import { useEffect, useRef, useState, useMemo, useCallback } from "react";
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
  Check,
} from "lucide-react";
import { formatDate, isPast, isToday } from "date-fns";
import { useCommandPalette } from "@/store/commandPaletteStore";
import { useAuthStore } from "@/store/authStore";
import { useTodoStore } from "@/store/todoStore";
import { useKeybinding } from "@/hooks/useKeybinding";
import {
  commandPaletteBackdropVariants,
  commandPaletteVariants,
  ease,
} from "@/lib/animations";

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

const rowVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0, transition: { ease } },
};

const groupVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
};

const matches = (text: string, query: string) =>
  text.toLowerCase().includes(query.toLowerCase());

const Highlight = ({ text, query }: { text: string; query: string }) => {
  if (!query) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-primary/20 text-primary rounded-sm px-px">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
};

const GroupLabel = ({ children }: { children: React.ReactNode }) => (
  <motion.p
    variants={rowVariants}
    className="text-[10px] font-semibold uppercase tracking-widest text-text/25 font-serif px-3 py-1.5"
  >
    {children}
  </motion.p>
);

const PageRow = ({
  page,
  isActive,
  query,
  onClick,
  rowRef,
}: {
  page: PageResult;
  isActive: boolean;
  query: string;
  onClick: () => void;
  rowRef: (el: HTMLButtonElement | null) => void;
}) => {
  const Icon = page.icon;
  return (
    <motion.button
      ref={rowRef}
      variants={rowVariants}
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${isActive ? "bg-primary/10" : "hover:bg-text/5"}`}
    >
      <div
        className={`size-8 rounded-lg flex items-center justify-center shrink-0 border transition-colors ${isActive ? "bg-primary/15 border-primary/25 text-primary" : "bg-text/5 border-text/8 text-text/40"}`}
      >
        <Icon className="size-3.5" />
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium ${isActive ? "text-text/90" : "text-text/70"}`}
        >
          <Highlight text={page.label} query={query} />
        </p>
        <p className="text-xs text-text/35 truncate">
          <Highlight text={page.description} query={query} />
        </p>
      </div>
      <ArrowRight
        className={`size-3.5 shrink-0 transition-all ${isActive ? "opacity-60 text-primary translate-x-0" : "opacity-0 -translate-x-1"}`}
      />
    </motion.button>
  );
};

const TodoRow = ({
  todo,
  isActive,
  query,
  onClick,
  onToggle,
  rowRef,
}: {
  todo: TodoResult;
  isActive: boolean;
  query: string;
  onClick: () => void;
  onToggle: (e: React.MouseEvent) => void;
  rowRef: (el: HTMLButtonElement | null) => void;
}) => {
  const dueDate = todo.dueDate ? new Date(todo.dueDate) : null;
  const isOverdue =
    dueDate && !todo.done && isPast(dueDate) && !isToday(dueDate);
  const isDueToday = dueDate && isToday(dueDate);

  return (
    <motion.button
      ref={rowRef}
      variants={rowVariants}
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${isActive ? "bg-primary/10" : "hover:bg-text/5"}`}
    >
      <button
        type="button"
        onClick={onToggle}
        title={todo.done ? "Mark incomplete" : "Mark complete"}
        className={`size-8 rounded-lg flex items-center justify-center shrink-0 border transition-all ${todo.done ? "bg-primary/10 border-primary/25 text-primary/60 hover:bg-primary/20" : isActive ? "bg-primary/15 border-primary/25 hover:bg-primary/25" : "bg-text/5 border-text/8 hover:bg-text/10 hover:border-text/15"}`}
      >
        {todo.done ? (
          <Check className="size-3 text-primary" />
        ) : (
          <div
            className={`size-2.5 rounded-full border ${isOverdue ? "border-rose-500/60" : "border-primary/50"}`}
          />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p
          className={`text-sm truncate ${todo.done ? "line-through text-text/35" : isActive ? "text-text/90 font-medium" : "text-text/70"}`}
        >
          <Highlight text={todo.text} query={query} />
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          {dueDate && (
            <span
              className={`text-[10px] flex items-center gap-1 ${isOverdue ? "text-rose-500/70" : isDueToday ? "text-amber-500/70" : "text-text/30"}`}
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
        className={`size-3.5 shrink-0 transition-all ${isActive ? "opacity-40 text-primary" : "opacity-0"}`}
      />
    </motion.button>
  );
};

const EmptyState = ({ query }: { query: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ ease }}
    className="flex flex-col items-center gap-2 py-10"
  >
    <p className="text-sm text-text/30 font-serif italic">No results for</p>
    <p className="text-sm font-medium text-text/50 bg-text/5 border border-text/8 rounded-lg px-3 py-1">
      "{query}"
    </p>
  </motion.div>
);

const PalettePanel = ({
  isAdmin,
  todos,
  recentHrefs,
  onClose,
  onSelect,
  onToggleTodo,
}: {
  isAdmin: boolean;
  todos: ReturnType<typeof useTodoStore.getState>["todos"];
  recentHrefs: string[];
  onClose: () => void;
  onSelect: (result: Result) => void;
  onToggleTodo: (id: string) => void;
}) => {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const rowRefs = useRef<Map<number, HTMLButtonElement>>(new Map());

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    rowRefs.current
      .get(activeIndex)
      ?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [activeIndex]);

  const setRowRef = useCallback(
    (index: number) => (el: HTMLButtonElement | null) => {
      if (el) rowRefs.current.set(index, el);
      else rowRefs.current.delete(index);
    },
    [],
  );

  const recentPages = useMemo(
    () =>
      recentHrefs
        .map((href) => ALL_PAGES.find((p) => p.href === href))
        .filter((p): p is PageResult => !!p && (!p.adminOnly || isAdmin)),
    [recentHrefs, isAdmin],
  );

  const pages = useMemo(
    () =>
      ALL_PAGES.filter(
        (p) =>
          (!p.adminOnly || isAdmin) &&
          (!query || matches(p.label, query) || matches(p.description, query)),
      ),
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

  const showRecent = !query && recentPages.length > 0;
  const allResults = useMemo<Result[]>(
    () => [...(showRecent ? recentPages : pages), ...filteredTodos],
    [showRecent, recentPages, pages, filteredTodos],
  );
  const todoOffset = showRecent ? recentPages.length : pages.length;

  const onKeyDown = (e: React.KeyboardEvent) => {
    const len = Math.max(allResults.length, 1);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % len);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + len) % len);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (allResults[activeIndex]) onSelect(allResults[activeIndex]);
    } else if (e.key === "Escape") onClose();
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
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveIndex(0);
          }}
          placeholder="Search todos, navigate pages…"
          className="flex-1 bg-transparent outline-none text-sm placeholder:text-text/25 text-text/80"
        />
        <AnimatePresence>
          {query && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              className="text-[10px] text-text/20 bg-text/5 border border-text/8 rounded px-1.5 py-0.5 font-mono"
            >
              {allResults.length} result{allResults.length !== 1 ? "s" : ""}
            </motion.span>
          )}
        </AnimatePresence>
        <kbd className="hidden sm:flex items-center gap-1 text-[10px] text-text/20 border border-text/10 rounded px-1.5 py-0.5 font-mono">
          ESC
        </kbd>
      </div>

      <div className="overflow-y-auto max-h-105 p-2">
        <AnimatePresence mode="wait">
          {!allResults.length && query ? (
            <EmptyState key="empty" query={query} />
          ) : (
            <motion.div
              key={query ? `search-${query.slice(0, 3)}` : "default"}
              variants={groupVariants}
              initial="hidden"
              animate="visible"
            >
              {showRecent && (
                <div className="mb-1">
                  <GroupLabel>Recent</GroupLabel>
                  {recentPages.map((page, i) => (
                    <PageRow
                      key={page.href}
                      page={page}
                      isActive={activeIndex === i}
                      query=""
                      onClick={() => onSelect(page)}
                      rowRef={setRowRef(i)}
                    />
                  ))}
                </div>
              )}
              {!showRecent && pages.length > 0 && (
                <div className="mb-1">
                  <GroupLabel>{query ? "Pages" : "Navigate"}</GroupLabel>
                  {pages.map((page, i) => (
                    <PageRow
                      key={page.href}
                      page={page}
                      isActive={activeIndex === i}
                      query={query}
                      onClick={() => onSelect(page)}
                      rowRef={setRowRef(i)}
                    />
                  ))}
                </div>
              )}
              {filteredTodos.length > 0 && (
                <div className="mt-1">
                  <GroupLabel>Todos</GroupLabel>
                  {filteredTodos.map((todo, i) => (
                    <TodoRow
                      key={todo.id}
                      todo={todo}
                      isActive={activeIndex === todoOffset + i}
                      query={query}
                      onClick={() => onSelect(todo)}
                      onToggle={(e) => {
                        e.stopPropagation();
                        onToggleTodo(todo.id);
                      }}
                      rowRef={setRowRef(todoOffset + i)}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
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
        {filteredTodos.length > 0 && (
          <motion.span
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-[10px] text-text/20 flex items-center gap-1.5"
          >
            <kbd className="border border-text/10 rounded px-1 py-0.5 font-mono flex items-center gap-0.5">
              <Check className="size-2.5" />
            </kbd>
            toggle
          </motion.span>
        )}
        <span className="ml-auto text-[10px] text-text/15">⌘K to toggle</span>
      </div>
    </motion.div>
  );
};

const CommandPalette = () => {
  const { isOpen, close, recentHrefs, pushRecent } = useCommandPalette();
  const { isAdmin } = useAuthStore();
  const { todos, toggleTodo } = useTodoStore();
  const navigate = useNavigate();
  const [openCount, setOpenCount] = useState(0);

  useEffect(() => {
    if (!isOpen) return;
    const id = window.setTimeout(() => setOpenCount((c) => c + 1), 0);
    return () => clearTimeout(id);
  }, [isOpen]);

  useKeybinding("mod+k", () => useCommandPalette.getState().toggle());

  const handleSelect = (result: Result) => {
    close();
    if (result.kind === "page") {
      pushRecent(result.href);
      navigate(result.href);
    } else navigate(`/todos?highlight=${result.id}`);
  };

  const handleToggleTodo = useCallback(
    (id: string) => {
      toggleTodo(id);
    },
    [toggleTodo],
  );

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
              recentHrefs={recentHrefs}
              onClose={close}
              onSelect={handleSelect}
              onToggleTodo={handleToggleTodo}
            />
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
