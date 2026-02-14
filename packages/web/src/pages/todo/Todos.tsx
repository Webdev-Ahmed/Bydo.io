import { useTodoStore } from "@/store/todoStore";
import { useEffect } from "react";
import TodoForm from "@/components/todo/TodoForm";
import TodoItem from "@/components/todo/TodoItem";

const Todos = () => {
  const { todos, isLoading, fetchTodos } = useTodoStore();

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const completedCount = todos.filter((todo) => todo.done).length;
  const totalCount = todos.length;

  return (
    <div className="min-h-screen pt-24">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <TodoForm />
        </div>

        <div className="bg-neutral-50/5 border border-neutral-50/5 p-4 rounded-2xl shadow-sm mb-4">
          <p className="text-neutral-50/80">
            <span className="text-pink-300">{completedCount}</span> of{" "}
            {totalCount} tasks completed
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading todos...</p>
          </div>
        ) : todos.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-neutral-50/70">
              No todos yet. Create one above!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {todos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Todos;
