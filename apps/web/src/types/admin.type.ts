export interface AdminUserStats {
  total: number;
  completed: number;
  active: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  createdAt: string;
  stats: AdminUserStats;
}

export interface AdminTodo {
  id: string;
  text: string;
  note: string | null;
  done: boolean;
  dueDate: string | null;
  createdAt: string;
}
