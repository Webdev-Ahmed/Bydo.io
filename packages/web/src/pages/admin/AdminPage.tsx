import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Users,
  CheckSquare,
  Trash2,
  ChevronDown,
  ShieldCheck,
  ShieldOff,
  ListTodo,
  Clock,
  Calendar,
} from "lucide-react";
import { formatDate } from "date-fns";

import {
  Layout,
  Button,
  SectionHeader,
  StatCard,
  UserAvatar,
  RoleBadge,
  ErrorCard,
} from "@/components/";
import { useAuthStore } from "@/store/authStore";
import { ease, fadeUpVariants, staggerContainer } from "@/lib/animations";
import type { AdminUser, AdminTodo } from "@/types/admin.type";

import api from "@/lib/axios";

// ─── StatPill ─────────────────────────────────────────────────────────────────

const StatPill = ({
  icon: Icon,
  label,
  value,
  color = "text-text/50",
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  color?: string;
}) => (
  <div className="flex items-center gap-1.5">
    <Icon className={`size-3 ${color}`} />
    <span className={`text-xs ${color}`}>
      {value} {label}
    </span>
  </div>
);

// ─── UserRow ──────────────────────────────────────────────────────────────────

const UserRow = ({
  user,
  currentUserId,
  isDeleting,
  onDelete,
  onRoleChange,
}: {
  user: AdminUser;
  currentUserId: string;
  isDeleting: boolean;
  onDelete: (id: string) => void;
  onRoleChange: (id: string, role: "USER" | "ADMIN") => void;
}) => {
  const [expanded, setExpanded] = useState(false);
  const [todos, setTodos] = useState<AdminTodo[]>([]);
  const [loadingTodos, setLoadingTodos] = useState(false);
  const [deletingTodo, setDeletingTodo] = useState<string | null>(null);
  const [updatingRole, setUpdatingRole] = useState(false);
  const navigate = useNavigate();
  const isSelf = user.id === currentUserId;

  const handleExpand = async () => {
    setExpanded((p) => !p);
    if (!expanded && todos.length === 0) {
      setLoadingTodos(true);
      try {
        const res = await api.get(`/admin/users/${user.id}/todos`);
        setTodos(res.data.todos);
      } catch {
        // silently fail
      } finally {
        setLoadingTodos(false);
      }
    }
  };

  const handleDeleteTodo = async (todoId: string) => {
    setDeletingTodo(todoId);
    try {
      await api.delete(`/admin/todos/${todoId}`);
      setTodos((prev) => prev.filter((t) => t.id !== todoId));
    } catch {
      // silently fail
    } finally {
      setDeletingTodo(null);
    }
  };

  const handleRoleToggle = async () => {
    setUpdatingRole(true);
    const newRole = user.role === "ADMIN" ? "USER" : "ADMIN";
    try {
      await api.patch(`/admin/users/${user.id}/role`, { role: newRole });
      onRoleChange(user.id, newRole);
    } catch {
      // silently fail
    } finally {
      setUpdatingRole(false);
    }
  };

  return (
    <motion.div
      variants={fadeUpVariants}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
      className="rounded-2xl border border-text/8 bg-text/2 overflow-hidden"
    >
      <div className="flex items-start gap-4 p-4">
        <UserAvatar name={user.name} size="sm" />

        <div
          className="flex-1 min-w-0 cursor-pointer"
          onClick={() => navigate(`/admin/users/${user.id}`)}
        >
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-medium text-text/90">{user.name}</p>
            <RoleBadge role={user.role} variant="pill" />
            {isSelf && (
              <span className="text-[10px] text-text/30 italic">you</span>
            )}
          </div>
          <p className="text-xs text-text/35 truncate">{user.email}</p>
          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
            <StatPill icon={ListTodo} label="total" value={user.stats.total} />
            <StatPill
              icon={CheckSquare}
              label="done"
              value={user.stats.completed}
              color="text-emerald-500/60"
            />
            <StatPill
              icon={Clock}
              label="active"
              value={user.stats.active}
              color="text-amber-500/60"
            />
            <span className="text-text/20 text-[10px]">·</span>
            <span className="text-xs text-text/25 flex items-center gap-1">
              <Calendar className="size-2.5" />
              {formatDate(new Date(user.createdAt), "do MMM, yyyy")}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {!isSelf && (
            <>
              <Button
                variant="secondary"
                outline
                onClick={handleRoleToggle}
                disabled={updatingRole}
                className="py-1.5 px-2.5 text-xs flex items-center gap-1.5"
              >
                {user.role === "ADMIN" ? (
                  <>
                    <ShieldOff className="size-3.5" /> Demote
                  </>
                ) : (
                  <>
                    <ShieldCheck className="size-3.5" /> Promote
                  </>
                )}
              </Button>
              <Button
                variant="primary"
                outline
                onClick={() => onDelete(user.id)}
                disabled={isDeleting}
                className="py-1.5 px-2.5"
              >
                <Trash2 className="size-3.5" />
              </Button>
            </>
          )}
          <motion.button
            onClick={handleExpand}
            className="p-1.5 rounded-lg text-text/25 hover:text-text/60 hover:bg-text/5 transition-colors"
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.22 }}
          >
            <ChevronDown className="size-3.5" />
          </motion.button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
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
            <div className="border-t border-text/6 mx-4 mb-4 pt-3">
              {loadingTodos ? (
                <p className="text-xs text-text/30 italic py-2">
                  Loading todos…
                </p>
              ) : todos.length === 0 ? (
                <p className="text-xs text-text/25 italic py-2">
                  No todos yet.
                </p>
              ) : (
                <div className="flex flex-col gap-1.5">
                  {todos.map((todo) => (
                    <div
                      key={todo.id}
                      className="flex items-center gap-3 px-3 py-2 rounded-xl bg-text/2 border border-text/5"
                    >
                      <div
                        className={`size-3 rounded-full border shrink-0 ${
                          todo.done
                            ? "bg-primary/40 border-primary/40"
                            : "border-text/20"
                        }`}
                      />
                      <span
                        className={`text-xs flex-1 truncate ${
                          todo.done
                            ? "line-through text-text/30"
                            : "text-text/70"
                        }`}
                      >
                        {todo.text}
                      </span>
                      {todo.dueDate && (
                        <span className="text-[10px] text-text/30 shrink-0">
                          {formatDate(new Date(todo.dueDate), "do MMM")}
                        </span>
                      )}
                      <button
                        onClick={() => handleDeleteTodo(todo.id)}
                        disabled={deletingTodo === todo.id}
                        className="shrink-0 p-1 rounded-lg text-text/20 hover:text-rose-500 hover:bg-rose-500/5 transition-colors disabled:opacity-30"
                      >
                        <Trash2 className="size-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const AdminPage = () => {
  const { user } = useAuthStore();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingUser, setDeletingUser] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/admin/users");
        setUsers(res.data.users);
      } catch {
        setError("Failed to load users. Make sure you have admin access.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId: string) => {
    setDeletingUser(userId);
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch {
      // silently fail
    } finally {
      setDeletingUser(null);
    }
  };

  const handleRoleChange = (userId: string, newRole: "USER" | "ADMIN") => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
    );
  };

  const totalTodos = users.reduce((sum, u) => sum + u.stats.total, 0);
  const totalCompleted = users.reduce((sum, u) => sum + u.stats.completed, 0);

  return (
    <Layout>
      <section className="px-4 sm:px-6 mt-36 flex flex-col items-center pb-24">
        <motion.div
          className="md:max-w-4xl lg:max-w-5xl w-full"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeUpVariants} className="mb-10">
            <p className="text-sm text-text/35 mb-1">Admin</p>
            <h1 className="text-4xl sm:text-5xl font-semibold">
              <span className="font-serif italic text-primary">Control </span>
              <span className="text-text/80">panel.</span>
            </h1>
          </motion.div>

          <motion.div
            variants={fadeUpVariants}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"
          >
            <StatCard
              label="Total users"
              value={users.length}
              icon={Users}
              loading={isLoading}
            />
            <StatCard
              label="Total todos"
              value={totalTodos}
              icon={ListTodo}
              loading={isLoading}
            />
            <StatCard
              label="Completed"
              value={totalCompleted}
              icon={CheckSquare}
              loading={isLoading}
            />
            <StatCard
              label="Active"
              value={totalTodos - totalCompleted}
              icon={Clock}
              loading={isLoading}
            />
          </motion.div>

          <motion.div variants={fadeUpVariants}>
            <SectionHeader
              label="Users"
              count={users.length}
              className="mb-4"
            />

            {isLoading ? (
              <div className="flex flex-col gap-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-20 rounded-2xl bg-text/3 border border-text/5 animate-pulse"
                  />
                ))}
              </div>
            ) : error ? (
              <ErrorCard message={error} />
            ) : (
              <div className="flex flex-col gap-3">
                <AnimatePresence>
                  {users.map((u) => (
                    <UserRow
                      key={u.id}
                      user={u}
                      currentUserId={user!.id}
                      isDeleting={deletingUser === u.id}
                      onDelete={handleDeleteUser}
                      onRoleChange={handleRoleChange}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </motion.div>
      </section>
    </Layout>
  );
};

export default AdminPage;
