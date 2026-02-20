export interface User {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  createdAt: string;
  updatedAt: string;
}

export interface Todo {
  id: string;
  text: string;
  note: string | null;
  done: boolean;
  dueDate?: string;

  userId: string | null;

  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  user: User;
  message: string;
}

export interface TodoResponse {
  todo: Todo;
  message: string;
}

export interface TodosResponse {
  todos: Todo[];
}
