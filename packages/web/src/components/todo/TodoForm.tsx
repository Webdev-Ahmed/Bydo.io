import { useState } from "react";
import { useTodoStore } from "@/store/todoStore";
import { createTodoSchema } from "@todo/shared";
import { flattenError, ZodError } from "zod";

const TodoForm = () => {
  const [text, setText] = useState("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<{ text?: string; note?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createTodo = useTodoStore((state) => state.createTodo);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      const validatedData = createTodoSchema.parse({
        text,
        note: note || undefined,
      });

      await createTodo(validatedData);

      setText("");
      setNote("");
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors = flattenError(error).fieldErrors;
        setErrors(fieldErrors);
      } else {
        if (error instanceof Error) {
          alert(error.message || "Failed to create todo");
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-neutral-50/5 border border-neutral-50/10 p-4 rounded-2xl shadow-md"
    >
      <h2 className="text-3xl tracking-wide font-semibold mb-4">
        Add New Todo
      </h2>

      <div className="mb-4">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What needs to be done?"
          className={`w-full px-4 py-2 border bg-neutral-50/5 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400/70 ${
            errors.text ? "border-red-500" : "border-neutral-50/10"
          }`}
        />
        {errors.text && (
          <p className="text-red-500 text-sm mt-1">{errors.text}</p>
        )}
      </div>

      <div className="mb-4">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a note (optional)"
          rows={3}
          className="w-full px-4 py-2 border resize-none bg-neutral-50/5 border-neutral-50/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400/70"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold tracking-widest py-2 px-4 rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {isSubmitting ? "Adding..." : "Add Todo"}
      </button>
    </form>
  );
};

export default TodoForm;
