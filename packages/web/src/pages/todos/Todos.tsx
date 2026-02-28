import type { Todo, UpdateTodoInput } from "@todo/shared";
import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { formatDate } from "date-fns";
import { Plus, CheckCheck, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import {
  Button,
  Layout,
  SkeletonList,
  FilterPills,
  TodoGroup,
  CalendarPicker,
  UndoToast,
  TodoItem,
} from "@/components/";
import { useTodoStore } from "@/store/todoStore";
import { useKeybindings } from "@/hooks/useKeybinding";
import {
  todosHeaderVariants,
  todosFormVariants,
  todosProgressVariants,
  todosEmptyVariants,
  todosBulkBarVariants,
  ease,
} from "@/lib/animations";
import { getDateGroup, toDateStr, DATE_GROUP_ORDER } from "@/lib/todos";
import type { Filter } from "@/types";

const TEMP_PREFIX = "__temp__";
const tempId = () => `${TEMP_PREFIX}${Date.now()}`;

const Todos = () => {
  const {
    fetchTodos,
    todos,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    isLoading,
  } = useTodoStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const [highlightId, setHighlightId] = useState<string | null>(() =>
    searchParams.get("highlight"),
  );
  const [newTodo, setNewTodo] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [localTodos, setLocalTodos] = useState<Todo[]>([]);
  const [deletedTodo, setDeletedTodo] = useState<Todo | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const undoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idRemapRef = useRef<Map<string, string>>(new Map());
  const initialized = useRef(false);

  const now = new Date();
  const dayName = formatDate(now, "EEEE");
  const dayDate = formatDate(now, "do MMMM");

  const serverId = (localId: string) =>
    idRemapRef.current.get(localId) ?? localId;

  useEffect(() => {
    if (!highlightId) return;
    const next = new URLSearchParams(searchParams);
    next.delete("highlight");
    setSearchParams(next, { replace: true });
    const t = setTimeout(() => setHighlightId(null), 2500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  useEffect(() => {
    if (!initialized.current && todos.length > 0) {
      initialized.current = true;
      setLocalTodos(todos);
    }
  }, [todos]);

  const handleCancelEdit = useCallback(() => {
    setEditingId(null);
    setEditingText("");
  }, []);

  const handleUndoDelete = useCallback(async () => {
    if (!deletedTodo) return;
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    setLocalTodos((prev) => [...prev, deletedTodo]);
    setDeletedTodo(null);
    try {
      await createTodo({
        text: deletedTodo.text,
        ...(deletedTodo.dueDate
          ? { dueDate: toDateStr(deletedTodo.dueDate) }
          : {}),
      });
      const real = useTodoStore.getState().todos.at(-1);
      if (real) idRemapRef.current.set(deletedTodo.id, real.id);
    } catch {
      setLocalTodos((prev) => prev.filter((t) => t.id !== deletedTodo.id));
    }
  }, [deletedTodo, createTodo]);

  useKeybindings([
    ["/", () => inputRef.current?.focus(), { ignoreWhenTyping: true }],
    [
      "escape",
      () => {
        if (editingId) handleCancelEdit();
      },
      { preventDefault: false, enabled: !!editingId },
    ],
    [
      "mod+z",
      () => {
        if (deletedTodo) handleUndoDelete();
      },
      { enabled: !!deletedTodo },
    ],
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = (event: DragStartEvent) =>
    setActiveId(event.active.id as string);

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setLocalTodos((prev) => {
      const oldIndex = prev.findIndex((t) => t.id === active.id);
      const newIndex = prev.findIndex((t) => t.id === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  const handleCreate = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = newTodo.trim();
    if (!text) return;

    const tid = tempId();
    const optimistic: Todo = {
      id: tid,
      text,
      done: false,
      note: null,
      userId: null,
      dueDate: newDueDate ? new Date(newDueDate).toISOString() : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setLocalTodos((prev) => [...prev, optimistic]);
    setNewTodo("");
    setNewDueDate("");

    try {
      await createTodo({
        text,
        ...(optimistic.dueDate ? { dueDate: optimistic.dueDate } : {}),
      });
      const real = useTodoStore.getState().todos.at(-1);
      if (real && !real.id.startsWith(TEMP_PREFIX)) {
        idRemapRef.current.set(tid, real.id);
        setLocalTodos((prev) =>
          prev.map((t) => (t.id === tid ? { ...real, id: tid } : t)),
        );
      }
    } catch {
      setLocalTodos((prev) => prev.filter((t) => t.id !== tid));
      setNewTodo(text);
    }
  };

  const handleStartEdit = (id: string, text: string) => {
    setEditingId(id);
    setEditingText(text);
  };

  const handleUpdate = async (id: string) => {
    const text = editingText.trim();
    if (!text) {
      setEditingId(null);
      setEditingText("");
      return;
    }
    const prev = localTodos.find((t) => t.id === id);
    setLocalTodos((all) => all.map((t) => (t.id === id ? { ...t, text } : t)));
    setEditingId(null);
    setEditingText("");
    try {
      await updateTodo(serverId(id), { text });
    } catch {
      if (prev)
        setLocalTodos((all) => all.map((t) => (t.id === id ? prev : t)));
    }
  };

  const handleUpdateField = useCallback(
    async (id: string, data: Record<string, unknown>) => {
      const prev = localTodos.find((t) => t.id === id);
      setLocalTodos((all) =>
        all.map((t) => (t.id === id ? { ...t, ...data } : t)),
      );
      try {
        await updateTodo(serverId(id), data as UpdateTodoInput);
      } catch {
        if (prev)
          setLocalTodos((all) => all.map((t) => (t.id === id ? prev : t)));
      }
    },
    [localTodos, updateTodo],
  );

  const handleDelete = async (id: string) => {
    if (editingId === id) handleCancelEdit();
    const todo = localTodos.find((t) => t.id === id);
    setLocalTodos((prev) => prev.filter((t) => t.id !== id));
    try {
      await deleteTodo(serverId(id));
      idRemapRef.current.delete(id);
      if (todo) {
        setDeletedTodo(todo);
        if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
        undoTimerRef.current = setTimeout(() => setDeletedTodo(null), 5000);
      }
    } catch {
      if (todo) setLocalTodos((prev) => [...prev, todo]);
    }
  };

  const handleToggle = async (id: string) => {
    const todo = localTodos.find((t) => t.id === id);
    if (!todo) return;
    setLocalTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );
    try {
      await toggleTodo(serverId(id));
    } catch {
      setLocalTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, done: todo.done } : t)),
      );
    }
  };

  const handleCheckAll = async () => {
    const undone = localTodos.filter((t) => !t.done);
    setLocalTodos((prev) => prev.map((t) => ({ ...t, done: true })));
    try {
      await Promise.all(undone.map((t) => toggleTodo(serverId(t.id))));
    } catch {
      setLocalTodos((prev) =>
        prev.map((t) =>
          undone.find((u) => u.id === t.id) ? { ...t, done: false } : t,
        ),
      );
    }
  };

  const handleDeleteCompleted = async () => {
    const completed = localTodos.filter((t) => t.done);
    setLocalTodos((prev) => prev.filter((t) => !t.done));
    try {
      await Promise.all(completed.map((t) => deleteTodo(serverId(t.id))));
    } catch {
      setLocalTodos((prev) => [...prev, ...completed]);
    }
  };

  const hasCompleted = localTodos.some((t) => t.done);
  const allDone = localTodos.length > 0 && localTodos.every((t) => t.done);
  const completedCount = localTodos.filter((t) => t.done).length;
  const totalCount = localTodos.length;

  const filteredTodos = useMemo(
    () =>
      localTodos.filter((t) =>
        filter === "active"
          ? !t.done
          : filter === "completed"
            ? !!t.done
            : true,
      ),
    [localTodos, filter],
  );

  const groupedTodos = useMemo(() => {
    const groups: Partial<
      Record<ReturnType<typeof getDateGroup>, typeof filteredTodos>
    > = {};
    for (const todo of filteredTodos) {
      const group = todo.createdAt ? getDateGroup(todo.createdAt) : "Older";
      if (!groups[group]) groups[group] = [];
      groups[group]!.push(todo);
    }
    return groups;
  }, [filteredTodos]);

  return (
    <Layout>
      <section className="px-4 sm:px-6 mt-36 flex flex-col items-center">
        <motion.div
          className="text-5xl font-semibold"
          variants={todosHeaderVariants}
          initial="hidden"
          animate="visible"
        >
          <span className="text-primary font-serif italic text-6xl">
            {dayName},{" "}
          </span>
          <span>{dayDate}</span>
        </motion.div>

        <motion.div
          className="max-w-2xl w-full mt-10 flex flex-col gap-3"
          variants={todosFormVariants}
          initial="hidden"
          animate="visible"
        >
          <form
            onSubmit={handleCreate}
            className="has-[input:focus]:ring-1 ring-text/90 rounded-full border relative border-text/15 w-full transition"
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="Add new task  —  press / to focus"
              className="outline-none py-3.5 px-5 w-full placeholder:text-text/30 bg-transparent rounded-full"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
            />
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 right-2"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{
                type: "spring" as const,
                stiffness: 400,
                damping: 18,
              }}
            >
              <Button
                type="submit"
                outline
                variant="secondary"
                className="p-2 hover:translate-y-0 active:translate-y-0 rounded-full"
              >
                <Plus className="size-4" />
              </Button>
            </motion.div>
          </form>

          <AnimatePresence>
            {newTodo.trim() && (
              <motion.div
                className="flex items-center gap-2 px-1"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease }}
              >
                <span className="text-xs text-text/30">Due date</span>
                <CalendarPicker
                  value={newDueDate}
                  onChange={setNewDueDate}
                  placeholder="Optional"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <FilterPills filter={filter} onChange={setFilter} />
      </section>

      <div className="mt-16 md:max-w-4xl lg:max-w-5xl w-full mx-auto px-4 sm:px-6 pb-24">
        <AnimatePresence>
          {!isLoading && localTodos.length > 0 && (
            <motion.div
              className="flex items-center gap-2 mb-6"
              variants={todosBulkBarVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.button
                onClick={handleCheckAll}
                disabled={allDone}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-text/15 text-xs font-medium text-text/50 hover:text-text hover:bg-text/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                whileHover={{ y: -1 }}
                whileTap={{ y: 0 }}
                transition={{ duration: 0.15 }}
              >
                <CheckCheck className="size-3.5" />
                Check all
              </motion.button>

              <AnimatePresence>
                {hasCompleted && (
                  <motion.button
                    onClick={handleDeleteCompleted}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-rose-500/20 text-xs font-medium text-rose-500/60 hover:text-rose-500 hover:bg-rose-500/5 transition-colors"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.2 }}
                    whileHover={{ y: -1 }}
                    whileTap={{ y: 0 }}
                  >
                    <Trash2 className="size-3.5" />
                    Delete completed
                  </motion.button>
                )}
              </AnimatePresence>

              <span className="ml-auto text-xs text-text/25">
                {completedCount}/{totalCount} done
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {isLoading ? (
          <SkeletonList />
        ) : (
          <AnimatePresence mode="wait">
            {filteredTodos.length === 0 ? (
              <motion.div
                key={`empty-${filter}`}
                className="flex flex-col items-center gap-2 py-20 text-text/40"
                variants={todosEmptyVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <p className="text-lg font-medium font-serif italic">
                  {filter === "completed"
                    ? "No completed tasks yet"
                    : filter === "active"
                      ? "No active tasks"
                      : "No tasks yet"}
                </p>
                <p className="text-sm text-text/30">
                  {filter === "all"
                    ? "Add one above to get started"
                    : "Try a different filter"}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key={`list-${filter}`}
                variants={todosEmptyVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <motion.p
                  className="text-sm text-text/40 mb-8"
                  variants={todosProgressVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {completedCount} of {totalCount} completed
                  <span className="ml-2 text-text/20 text-xs">
                    — double-click to edit · press / to focus
                  </span>
                </motion.p>

                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                >
                  {DATE_GROUP_ORDER.filter((g) => groupedTodos[g]?.length).map(
                    (group, groupIdx) => (
                      <TodoGroup
                        key={group}
                        label={group}
                        todos={groupedTodos[group]!}
                        groupIdx={groupIdx}
                        highlightId={highlightId}
                        editingId={editingId}
                        editingText={editingText}
                        onStartEdit={handleStartEdit}
                        onUpdate={handleUpdate}
                        onUpdateField={handleUpdateField}
                        onCancelEdit={handleCancelEdit}
                        onDelete={handleDelete}
                        onToggle={handleToggle}
                        onEditingTextChange={setEditingText}
                      />
                    ),
                  )}

                  <DragOverlay
                    dropAnimation={{ duration: 180, easing: "ease" }}
                  >
                    {activeId &&
                      (() => {
                        const activeTodo = localTodos.find(
                          (t) => t.id === activeId,
                        );
                        if (!activeTodo) return null;
                        return (
                          <div className="rotate-1 scale-[1.02] shadow-xl shadow-text/10 rounded-xl sm:rounded-2xl border border-primary/20 bg-background/90 backdrop-blur-sm opacity-95">
                            <TodoItem
                              todo={activeTodo}
                              isEditing={false}
                              editingText=""
                              onStartEdit={() => {}}
                              onUpdate={() => {}}
                              onUpdateField={async () => {}}
                              onCancelEdit={() => {}}
                              onDelete={() => {}}
                              onToggle={() => {}}
                              onEditingTextChange={() => {}}
                            />
                          </div>
                        );
                      })()}
                  </DragOverlay>
                </DndContext>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      <AnimatePresence>
        {deletedTodo && (
          <UndoToast
            message={`Deleted "${deletedTodo.text}"`}
            onUndo={handleUndoDelete}
            onDismiss={() => setDeletedTodo(null)}
          />
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default Todos;
