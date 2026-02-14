export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Todo {
  id: string;
  text: string;
  note: string | null;
  done: boolean;
  userId: string | null;
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
