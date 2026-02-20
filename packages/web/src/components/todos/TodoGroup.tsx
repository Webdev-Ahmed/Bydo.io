import { motion, AnimatePresence } from "motion/react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { TodoItem } from "./TodoItem";
import SectionHeader from "@/components/ui/SectionHeader";
import { slideLeftVariants } from "@/lib/animations";
import type { Todo } from "@todo/shared";

interface TodoGroupProps {
  label: string;
  todos: (Todo & { dueDate?: string | Date | null; note?: string | null })[];
  groupIdx: number;
  editingId: string | null;
  editingText: string;
  onStartEdit: (id: string, text: string) => void;
  onUpdate: (id: string) => void;
  onUpdateField: (id: string, data: Record<string, unknown>) => Promise<void>;
  onCancelEdit: () => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onEditingTextChange: (text: string) => void;
}

export const TodoGroup = ({
  label,
  todos,
  groupIdx,
  editingId,
  editingText,
  onStartEdit,
  onUpdate,
  onUpdateField,
  onCancelEdit,
  onDelete,
  onToggle,
  onEditingTextChange,
}: TodoGroupProps) => (
  <motion.div
    className="mb-10"
    initial="hidden"
    animate="visible"
    variants={{
      hidden: {},
      visible: {
        transition: { staggerChildren: 0.06, delayChildren: groupIdx * 0.05 },
      },
    }}
  >
    <motion.div className="mb-3" variants={slideLeftVariants}>
      <SectionHeader label={label} count={todos.length} />
    </motion.div>

    <SortableContext
      items={todos.map((t) => t.id)}
      strategy={verticalListSortingStrategy}
    >
      <ul className="flex flex-col gap-1">
        <AnimatePresence initial={false}>
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              isEditing={editingId === todo.id}
              editingText={editingText}
              onStartEdit={onStartEdit}
              onUpdate={onUpdate}
              onUpdateField={onUpdateField}
              onCancelEdit={onCancelEdit}
              onDelete={onDelete}
              onToggle={onToggle}
              onEditingTextChange={onEditingTextChange}
            />
          ))}
        </AnimatePresence>
      </ul>
    </SortableContext>
  </motion.div>
);
