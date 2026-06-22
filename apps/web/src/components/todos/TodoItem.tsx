import { useState, useEffect, useRef } from "react";
import { formatDate, isPast, isToday } from "date-fns";
import { motion, AnimatePresence } from "motion/react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  Clock,
  FileText,
  ChevronDown,
  Pencil,
  Trash2,
  CalendarDays,
} from "lucide-react";
import { CalendarPicker, Button, TodoCheckbox } from "@/components";
import {
  todoItemVariants,
  todoButtonGroupVariants,
  ease,
} from "@/lib/animations";
import { toDateStr } from "@/lib/todos";
import type { Todo } from "@bydo-io/shared";

const TEMP_PREFIX = "__temp__";

interface TodoItemProps {
  todo: Todo & { dueDate?: string | Date | null; note?: string | null };
  isEditing: boolean;
  editingText: string;
  isHighlighted?: boolean;
  onStartEdit: (id: string, text: string) => void;
  onUpdate: (id: string) => void;
  onUpdateField: (id: string, data: Record<string, unknown>) => Promise<void>;
  onCancelEdit: () => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onEditingTextChange: (text: string) => void;
}

const DueBadge = ({ dueDate, done }: { dueDate: string; done: boolean }) => {
  const isOverdue = !done && isPast(dueDate) && !isToday(dueDate);
  const isDueToday = isToday(dueDate);

  if (isOverdue)
    return (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-rose-500/10 text-rose-500/80 border border-rose-500/15">
        <Clock className="size-2.5 shrink-0" />
        Overdue · {formatDate(dueDate, "do MMM")}
      </span>
    );

  if (isDueToday)
    return (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-500/80 border border-amber-500/15">
        <Clock className="size-2.5 shrink-0" />
        Due today
      </span>
    );

  return (
    <span className="inline-flex items-center gap-1 text-[10px] text-text/30">
      <CalendarDays className="size-2.5 shrink-0" />
      {formatDate(dueDate, "do MMM, yyyy")}
    </span>
  );
};

const TodoItem = ({
  todo,
  isEditing,
  editingText,
  isHighlighted = false,
  onStartEdit,
  onUpdate,
  onUpdateField,
  onCancelEdit,
  onDelete,
  onToggle,
  onEditingTextChange,
}: TodoItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [noteValue, setNoteValue] = useState(todo.note ?? "");
  const [showHighlight, setShowHighlight] = useState(false);
  const [localDueDate, setLocalDueDate] = useState(toDateStr(todo.dueDate));

  const itemRef = useRef<HTMLLIElement>(null);
  const isTemp = todo.id.startsWith(TEMP_PREFIX);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id });

  const setRefs = (el: HTMLLIElement | null) => {
    (itemRef as React.MutableRefObject<HTMLLIElement | null>).current = el;
    setNodeRef(el);
  };

  useEffect(() => {
    if (!isHighlighted) return;
    const scrollTimer = setTimeout(() => {
      itemRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      setShowHighlight(true);
      const fadeTimer = setTimeout(() => setShowHighlight(false), 3000);
      return () => clearTimeout(fadeTimer);
    }, 300);
    return () => clearTimeout(scrollTimer);
  }, [isHighlighted]);

  const dueDate = todo.dueDate ? new Date(todo.dueDate).toISOString() : null;
  const isOverdue =
    dueDate && !todo.done && isPast(dueDate) && !isToday(dueDate);
  const hasMetadata = todo.createdAt || dueDate || todo.note;

  const borderClass = showHighlight
    ? "border-primary/40 bg-primary/4 shadow-sm shadow-primary/10"
    : isEditing
      ? "border-text/15 bg-text/3"
      : isOverdue
        ? "border-rose-500/15 hover:border-rose-500/25 bg-transparent hover:bg-rose-500/2"
        : "border-text/6 hover:border-text/12 bg-transparent hover:bg-text/2";

  const handleCancel = () => {
    setLocalDueDate(toDateStr(todo.dueDate));
    setNoteValue(todo.note ?? "");
    onCancelEdit();
  };

  const handleSave = async () => {
    if (localDueDate !== toDateStr(todo.dueDate))
      await onUpdateField(todo.id, {
        dueDate: localDueDate ? new Date(localDueDate).toISOString() : null,
      });
    if (noteValue !== (todo.note ?? ""))
      await onUpdateField(todo.id, { note: noteValue });
    onUpdate(todo.id);
  };

  return (
    <motion.li
      ref={setRefs}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : undefined,
      }}
      className={`group flex flex-col rounded-xl sm:rounded-2xl border transition-all duration-200 ${borderClass}`}
      variants={todoItemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div
        style={{
          opacity: isDragging ? 0.4 : isTemp ? 0.6 : 1,
          transition: "opacity 0.2s ease",
        }}
      >
        <div className="flex items-start gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3">
          <motion.button
            className="hidden sm:flex shrink-0 text-text/15 hover:text-text/40 cursor-grab active:cursor-grabbing transition-colors touch-none mt-1 opacity-0 group-hover:opacity-100"
            {...attributes}
            {...listeners}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.15 }}
            tabIndex={-1}
          >
            <GripVertical className="size-3.5" />
          </motion.button>

          <div className="shrink-0 mt-0.5">
            <TodoCheckbox
              checked={!!todo.done}
              onChange={() => onToggle(todo.id)}
              label={`Mark "${todo.text}" as ${todo.done ? "incomplete" : "complete"}`}
            />
          </div>

          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="flex flex-col gap-3 pt-0.5">
                <input
                  autoFocus
                  className="outline-none w-full bg-transparent text-sm text-text/90 placeholder:text-text/30"
                  value={editingText}
                  onChange={(e) => onEditingTextChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSave();
                    if (e.key === "Escape") handleCancel();
                  }}
                />
                <div className="flex flex-col gap-2 pt-1 border-t border-text/6">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="size-3 text-text/25 shrink-0" />
                    <CalendarPicker
                      value={localDueDate}
                      onChange={setLocalDueDate}
                      placeholder="Set due date"
                    />
                  </div>
                  <div className="flex items-start gap-2">
                    <FileText className="size-3 text-text/25 shrink-0 mt-1" />
                    <textarea
                      rows={2}
                      value={noteValue}
                      onChange={(e) => setNoteValue(e.target.value)}
                      placeholder="Add a note..."
                      className="flex-1 text-xs bg-transparent outline-none resize-none text-text/60 placeholder:text-text/25 focus:text-text transition-colors"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <button
                className="text-left w-full"
                onClick={() => setIsExpanded((p) => !p)}
                onDoubleClick={() => onStartEdit(todo.id, todo.text)}
              >
                <motion.p
                  animate={{ opacity: todo.done ? 0.3 : 1 }}
                  transition={{ duration: 0.25 }}
                  className={`text-sm leading-snug ${todo.done ? "line-through" : "text-text/85"}`}
                >
                  {todo.text}
                </motion.p>

                {hasMetadata && (
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    {todo.createdAt && (
                      <span className="text-[10px] text-text/25">
                        {formatDate(new Date(todo.createdAt), "do MMM, yyyy")}
                      </span>
                    )}
                    {dueDate && (
                      <>
                        {todo.createdAt && (
                          <span className="text-text/15 text-[10px]">·</span>
                        )}
                        <DueBadge dueDate={dueDate} done={!!todo.done} />
                      </>
                    )}
                    {todo.note && (
                      <>
                        {(todo.createdAt || dueDate) && (
                          <span className="text-text/15 text-[10px]">·</span>
                        )}
                        <span className="inline-flex items-center gap-1 text-[10px] text-text/25">
                          <FileText className="size-2.5" />
                          Note
                        </span>
                      </>
                    )}
                  </div>
                )}
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0 mt-0.5">
            <AnimatePresence mode="wait" initial={false}>
              {isEditing ? (
                <motion.div
                  key="editing"
                  className="flex items-center gap-1"
                  variants={todoButtonGroupVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <Button
                    variant="secondary"
                    outline
                    onClick={handleSave}
                    className="text-xs px-3 py-1.5 hover:translate-y-0 active:translate-y-0"
                  >
                    Save
                  </Button>
                  <Button
                    variant="primary"
                    outline
                    onClick={handleCancel}
                    className="text-xs px-3 py-1.5 hover:translate-y-0 active:translate-y-0"
                  >
                    Cancel
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="viewing"
                  className="flex items-center gap-0.5"
                  variants={todoButtonGroupVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <motion.button
                    onClick={() => onStartEdit(todo.id, todo.text)}
                    className="hidden sm:flex p-1.5 rounded-lg text-text/20 hover:text-text/60 hover:bg-text/6 transition-colors opacity-0 group-hover:opacity-100"
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.12 }}
                    title="Edit"
                  >
                    <Pencil className="size-3.5" />
                  </motion.button>
                  <motion.button
                    onClick={() => onDelete(todo.id)}
                    className="hidden sm:flex p-1.5 rounded-lg text-text/20 hover:text-rose-500/70 hover:bg-rose-500/6 transition-colors opacity-0 group-hover:opacity-100"
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.12 }}
                    title="Delete"
                  >
                    <Trash2 className="size-3.5" />
                  </motion.button>
                  <motion.button
                    onClick={() => setIsExpanded((p) => !p)}
                    className="p-1.5 rounded-lg text-text/20 hover:text-text/50 hover:bg-text/6 transition-colors"
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.22, ease }}
                    title={isExpanded ? "Collapse" : "Expand"}
                  >
                    <ChevronDown className="size-3.5" />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {isExpanded && !isEditing && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                height: { duration: 0.25, ease },
                opacity: { duration: 0.18 },
              }}
              className="overflow-hidden"
            >
              <div className="px-3 sm:px-4 pb-3 sm:pb-3.5 flex flex-col gap-3">
                <div className="h-px bg-text/5" />
                {todo.note ? (
                  <p className="text-xs text-text/45 leading-relaxed whitespace-pre-wrap border-l-2 border-primary/20 pl-3">
                    {todo.note}
                  </p>
                ) : (
                  <p className="text-xs text-text/20 italic">
                    No note — double-click to add one
                  </p>
                )}
                <div className="flex items-center gap-2 sm:hidden">
                  <button
                    onClick={() => {
                      setIsExpanded(false);
                      onStartEdit(todo.id, todo.text);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-text/12 text-xs text-text/50 hover:text-text hover:bg-text/5 transition-colors"
                  >
                    <Pencil className="size-3" /> Edit
                  </button>
                  <button
                    onClick={() => onDelete(todo.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-rose-500/20 text-xs text-rose-500/60 hover:text-rose-500 hover:bg-rose-500/5 transition-colors"
                  >
                    <Trash2 className="size-3" /> Delete
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isTemp && (
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease }}
              style={{ originX: 0 }}
              className="h-px bg-linear-to-r from-primary/40 to-transparent rounded-full mx-3 sm:mx-4 mb-2"
            />
          )}
        </AnimatePresence>
      </div>
    </motion.li>
  );
};

export default TodoItem;
