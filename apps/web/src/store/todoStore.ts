import { create } from "zustand";
import api from "@/lib/axios";
import type { Todo } from "@bydo-io/shared";
import type { CreateTodoInput, UpdateTodoInput } from "@bydo-io/shared";

interface TodoState {
  todos: Todo[];
  isLoading: boolean;

  fetchTodos: () => Promise<void>;
  createTodo: (data: CreateTodoInput) => Promise<void>;
  updateTodo: (id: string, data: UpdateTodoInput) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
}

export const useTodoStore = create<TodoState>((set, get) => ({
  todos: [],
  isLoading: false,

  fetchTodos: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get("/todo");
      set({ todos: response.data.todos, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  createTodo: async (data: CreateTodoInput) => {
    const response = await api.post("/todo", data);
    set({ todos: [...get().todos, response.data.todo] });
  },

  updateTodo: async (id: string, data: UpdateTodoInput) => {
    const response = await api.put(`/todo/${id}`, data);
    set({
      todos: get().todos.map((todo) =>
        todo.id === id ? response.data.todo : todo,
      ),
    });
  },

  deleteTodo: async (id: string) => {
    await api.delete(`/todo/${id}`);
    set({ todos: get().todos.filter((todo) => todo.id !== id) });
  },

  toggleTodo: async (id: string) => {
    const todo = get().todos.find((t) => t.id === id);
    if (!todo) return;

    const response = await api.put(`/todo/${id}`, { done: !todo.done });
    set({
      todos: get().todos.map((t) => (t.id === id ? response.data.todo : t)),
    });
  },
}));
