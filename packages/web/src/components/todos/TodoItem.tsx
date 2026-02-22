import { useState, useEffect, useRef } from "react";
import { formatDate, isPast, isToday } from "date-fns";
import { motion, AnimatePresence } from "motion/react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  Calendar,
  Clock,
  FileText,
  ChevronDown,
  Pencil,
  Trash2,
} from "lucide-react";
import { CalendarPicker, Button, TodoCheckbox } from "@/components";
import {
  todoItemVariants,
  todoButtonGroupVariants,
  ease,
} from "@/lib/animations";
import { toDateStr } from "@/lib/todos";
import type { Todo } from "@todo/shared";

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

  const itemRef = useRef<HTMLLIElement>(null);
  const dueDateValue = toDateStr(todo.dueDate);

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

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 10 : undefined,
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
  const isDueToday = dueDate && isToday(dueDate);

  const handleNoteBlur = async () => {
    if (noteValue !== (todo.note ?? "")) {
      await onUpdateField(todo.id, { note: noteValue });
    }
  };

  const handleDueDateChange = async (val: string) => {
    await onUpdateField(todo.id, {
      dueDate: new Date(val).toISOString() || null,
    });
  };

  return (
    <motion.li
      ref={setRefs}
      style={style}
      className={`flex flex-col rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 transition-all duration-500 ${
        isEditing ? "bg-text/4" : "hover:bg-text/3"
      } ${showHighlight ? "ring-2 ring-primary/50 ring-offset-2 ring-offset-background bg-primary/3" : ""}`}
      variants={todoItemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="flex items-start justify-between gap-2 sm:gap-3">
        <motion.button
          className="hidden sm:flex shrink-0 text-text/20 hover:text-text/50 cursor-grab active:cursor-grabbing transition-colors touch-none pt-0.5"
          {...attributes}
          {...listeners}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.15 }}
          tabIndex={-1}
        >
          <GripVertical className="size-4" />
        </motion.button>

        <div className="pt-0.5 shrink-0">
          <TodoCheckbox
            checked={!!todo.done}
            onChange={() => onToggle(todo.id)}
            label={`Mark "${todo.text}" as ${todo.done ? "incomplete" : "complete"}`}
          />
        </div>

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="flex flex-col gap-2.5 pt-0.5">
              <input
                className="outline-none w-full bg-transparent text-sm"
                value={editingText}
                onChange={(e) => onEditingTextChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onUpdate(todo.id);
                  if (e.key === "Escape") onCancelEdit();
                }}
                autoFocus
              />
              <CalendarPicker
                value={dueDateValue}
                onChange={handleDueDateChange}
                placeholder="Set due date"
              />
              <div className="flex items-start gap-2">
                <FileText className="size-3.5 text-text/30 shrink-0 mt-0.5" />
                <textarea
                  value={noteValue}
                  onChange={(e) => setNoteValue(e.target.value)}
                  onBlur={handleNoteBlur}
                  placeholder="Add a note..."
                  rows={2}
                  className="flex-1 text-xs bg-transparent outline-none resize-none text-text/60 placeholder:text-text/25 focus:text-text transition-colors border-b border-text/10 focus:border-primary pb-1"
                />
              </div>
            </div>
          ) : (
            <button
              className="text-left w-full pt-0.5"
              onDoubleClick={() => onStartEdit(todo.id, todo.text)}
              onClick={() => setIsExpanded((p) => !p)}
            >
              <motion.div
                animate={{ opacity: todo.done ? 0.35 : 1 }}
                transition={{ duration: 0.3 }}
                className={`text-sm truncate ${todo.done ? "line-through" : ""}`}
              >
                {todo.text}
              </motion.div>

              <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                {todo.createdAt && (
                  <span className="text-xs text-text/30 flex items-center gap-1">
                    <Calendar className="size-2.5" />
                    {formatDate(new Date(todo.createdAt), "do MMM, yyyy")}
                  </span>
                )}
                {todo.createdAt && dueDate && (
                  <span className="text-text/20 text-[10px] leading-none">
                    ·
                  </span>
                )}
                {dueDate && (
                  <span
                    className={`text-xs flex items-center gap-1 ${
                      isOverdue
                        ? "text-rose-500"
                        : isDueToday
                          ? "text-amber-500"
                          : "text-text/30"
                    }`}
                  >
                    <Clock className="size-2.5" />
                    {isOverdue
                      ? `Overdue · ${formatDate(dueDate, "do MMM, yyyy")}`
                      : isDueToday
                        ? "Due today"
                        : formatDate(dueDate, "do MMM, yyyy")}
                  </span>
                )}
                {todo.note && (
                  <>
                    {(todo.createdAt || dueDate) && (
                      <span className="text-text/20 text-[10px] leading-none">
                        ·
                      </span>
                    )}
                    <span className="text-xs text-text/30 flex items-center gap-1">
                      <FileText className="size-2.5" />
                      Note
                    </span>
                  </>
                )}
              </div>
            </button>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0 pt-0.5">
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
                  onClick={() => onUpdate(todo.id)}
                >
                  Save
                </Button>
                <Button variant="primary" outline onClick={onCancelEdit}>
                  Cancel
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="viewing"
                className="flex items-center gap-1"
                variants={todoButtonGroupVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <Button
                  variant="secondary"
                  className="hidden sm:flex py-2.5"
                  outline
                  onClick={() => onStartEdit(todo.id, todo.text)}
                >
                  <Pencil className="size-5" strokeWidth={1.5} />
                </Button>
                <Button
                  variant="primary"
                  className="hidden sm:flex py-2.5"
                  outline
                  onClick={() => onDelete(todo.id)}
                >
                  <Trash2 className="size-5" strokeWidth={1.5} />
                </Button>
                <motion.button
                  onClick={() => setIsExpanded((p) => !p)}
                  className="p-1 rounded-lg text-text/25 hover:text-text/60 hover:bg-text/5 transition-colors"
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.25, ease }}
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
              height: { duration: 0.28, ease },
              opacity: { duration: 0.2 },
            }}
            className="overflow-hidden"
          >
            <div className="sm:ml-13 ml-7 mt-2 pb-1 flex flex-col gap-3">
              {todo.note ? (
                <p className="text-xs text-text/45 leading-relaxed whitespace-pre-wrap">
                  {todo.note}
                </p>
              ) : (
                <p className="text-xs text-text/20 italic">
                  No note — tap edit to add one
                </p>
              )}
              <div className="flex items-center gap-2 sm:hidden">
                <button
                  onClick={() => onStartEdit(todo.id, todo.text)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-text/15 text-xs text-text/50 hover:text-text hover:bg-text/5 transition-colors"
                >
                  <Pencil className="size-3" />
                  Edit
                </button>
                <button
                  onClick={() => onDelete(todo.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-rose-500/20 text-xs text-rose-500/60 hover:text-rose-500 hover:bg-rose-500/5 transition-colors"
                >
                  <Trash2 className="size-3" />
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
};

export default TodoItem;
