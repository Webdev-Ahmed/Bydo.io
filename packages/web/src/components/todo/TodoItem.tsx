import { useState } from "react";
import { useTodoStore } from "@/store/todoStore";
import type { Todo } from "@todo/shared";
import { Pencil, X } from "lucide-react";
import { Checkbox } from "../ui/Checkbox";

interface TodoItemProps {
  todo: Todo;
}

const TodoItem = ({ todo }: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editNote, setEditNote] = useState(todo.note || "");

  const { toggleTodo, updateTodo, deleteTodo } = useTodoStore();

  const handleToggle = async () => {
    try {
      await toggleTodo(todo.id);
    } catch (error) {
      if (error instanceof Error) alert(error.message);
    }
  };

  const handleUpdate = async () => {
    try {
      await updateTodo(todo.id, {
        text: editText,
        note: editNote || undefined,
      });
      setIsEditing(false);
    } catch (error) {
      if (error instanceof Error) alert(error.message);
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this todo?")) {
      try {
        await deleteTodo(todo.id);
      } catch (error) {
        if (error instanceof Error) alert(error.message);
      }
    }
  };

  const handleCancel = () => {
    setEditText(todo.text);
    setEditNote(todo.note || "");
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-neutral-50/5 p-4 rounded-2xl shadow-sm border border-neutral-50/10">
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          className="w-full px-3 py-2 border border-neutral-50/10 bg-neutral-50/5 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-pink-400/70"
          placeholder="Todo text"
        />
        <textarea
          value={editNote}
          onChange={(e) => setEditNote(e.target.value)}
          className="w-full px-3 py-2 border border-neutral-50/10 bg-neutral-50/5 resize-none rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-pink-400/70"
          placeholder="Note (optional)"
          rows={2}
        />
        <div className="flex gap-2">
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-pink-500 text-white rounded-lg cursor-pointer transition hover:bg-pink-600"
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="px-4 py-2 cursor-pointer text-neutral-100/80 bg-neutral-100/10 rounded-lg border border-neutral-100/20 hover:bg-neutral-100/15 hover:border-neutral-100/25 hover:text-neutral-100 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-50/5 p-4 rounded-2xl shadow-sm border border-neutral-50/10 hover:shadow-neutral-50/5 transition">
      <div className="flex items-center gap-3">
        <Checkbox
          variant="default"
          checked={todo.done}
          onChange={handleToggle}
        />

        <div className="flex-1">
          <p
            className={`text-lg ${todo.done ? "line-through text-pink-300/80" : "text-neutral-50/80"}`}
          >
            {todo.text}
          </p>
          {todo.note && (
            <p className="text-sm text-neutral-50/50 mt-1">{todo.note}</p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className="text-neutral-50/60 flex items-center justify-center rounded-full hover:text-neutral-100 cursor-pointer size-10 bg-blue-500"
          >
            <Pencil className="size-6" />
          </button>
          <button
            onClick={handleDelete}
            className="text-neutral-50/60 flex items-center justify-center rounded-full hover:text-neutral-100 cursor-pointer size-10 bg-red-500"
          >
            <X className="size-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoItem;
