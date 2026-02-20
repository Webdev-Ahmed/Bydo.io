import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import Button from "@/components/ui/Button";
import FadeUp from "@/components/ui/FadeUp";
import InfoRow from "@/components/ui/InfoRow";
import SectionHeader from "@/components/ui/SectionHeader";
import StatCard from "@/components/ui/StatCard";
import UserAvatar from "@/components/ui/UserAvatar";
import RoleBadge from "@/components/ui/RoleBadge";
import ErrorCard from "@/components/ui/ErrorCard";
import { formatDate, formatDistanceToNow, isPast, isToday } from "date-fns";
import {
  ArrowLeft,
  Mail,
  CalendarDays,
  Clock,
  ListTodo,
  CheckSquare,
  ShieldCheck,
  ShieldOff,
  Trash2,
  FileText,
} from "lucide-react";
import api from "@/lib/axios";
import type { AdminUser, AdminTodo } from "@/types/admin.type";

// ─── TodoRow ──────────────────────────────────────────────────────────────────

const TodoRow = ({
  todo,
  onDelete,
  isDeleting,
}: {
  todo: AdminTodo;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}) => {
  const [expanded, setExpanded] = useState(false);
  const dueDate = todo.dueDate ? new Date(todo.dueDate) : null;
  const isOverdue =
    dueDate && !todo.done && isPast(dueDate) && !isToday(dueDate);
  const isDueToday = dueDate && isToday(dueDate);

  return (
    <div className="rounded-xl border border-text/6 bg-text/1 overflow-hidden">
      <div className="flex items-start gap-3 px-3 py-2.5">
        <div
          className={`mt-1 size-3 rounded-full border shrink-0 ${
            todo.done ? "bg-primary/40 border-primary/40" : "border-text/25"
          }`}
        />
        <div className="flex-1 min-w-0">
          <p
            className={`text-sm truncate ${
              todo.done ? "line-through text-text/35" : "text-text/80"
            }`}
          >
            {todo.text}
          </p>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className="text-[10px] text-text/25 flex items-center gap-1">
              <CalendarDays className="size-2.5" />
              {formatDate(new Date(todo.createdAt), "do MMM, yyyy")}
            </span>
            {dueDate && (
              <>
                <span className="text-text/20 text-[10px]">·</span>
                <span
                  className={`text-[10px] flex items-center gap-1 ${
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
              </>
            )}
            {todo.note && (
              <>
                <span className="text-text/20 text-[10px]">·</span>
                <button
                  onClick={() => setExpanded((p) => !p)}
                  className="text-[10px] text-text/30 flex items-center gap-1 hover:text-text/60 transition-colors"
                >
                  <FileText className="size-2.5" />
                  Note
                </button>
              </>
            )}
          </div>
          {expanded && todo.note && (
            <p className="text-xs text-text/45 mt-2 leading-relaxed whitespace-pre-wrap border-t border-text/5 pt-2">
              {todo.note}
            </p>
          )}
        </div>
        <button
          onClick={() => onDelete(todo.id)}
          disabled={isDeleting}
          className="shrink-0 p-1.5 rounded-lg text-text/20 hover:text-rose-500 hover:bg-rose-500/5 transition-colors disabled:opacity-30"
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const AdminUserPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<AdminUser | null>(null);
  const [todos, setTodos] = useState<AdminTodo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingTodo, setDeletingTodo] = useState<string | null>(null);
  const [updatingRole, setUpdatingRole] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, todosRes] = await Promise.all([
          api.get("/admin/users"),
          api.get(`/admin/users/${userId}/todos`),
        ]);
        const found = usersRes.data.users.find(
          (u: AdminUser) => u.id === userId,
        );
        if (!found) {
          setError("User not found.");
          return;
        }
        setUser(found);
        setTodos(todosRes.data.todos);
      } catch {
        setError("Failed to load user data.");
      } finally {
        setIsLoading(false);
      }
    };
    if (userId) fetchData();
  }, [userId]);

  const handleDeleteTodo = async (todoId: string) => {
    setDeletingTodo(todoId);
    const target = todos.find((t) => t.id === todoId);
    try {
      await api.delete(`/admin/todos/${todoId}`);
      setTodos((prev) => prev.filter((t) => t.id !== todoId));
      setUser((prev) =>
        prev
          ? {
              ...prev,
              stats: {
                total: prev.stats.total - 1,
                completed: target?.done
                  ? prev.stats.completed - 1
                  : prev.stats.completed,
                active: !target?.done
                  ? prev.stats.active - 1
                  : prev.stats.active,
              },
            }
          : null,
      );
    } catch {
      // silently fail
    } finally {
      setDeletingTodo(null);
    }
  };

  const handleRoleToggle = async () => {
    if (!user) return;
    setUpdatingRole(true);
    const newRole = user.role === "ADMIN" ? "USER" : "ADMIN";
    try {
      await api.patch(`/admin/users/${user.id}/role`, { role: newRole });
      setUser((prev) => (prev ? { ...prev, role: newRole } : null));
    } catch {
      // silently fail
    } finally {
      setUpdatingRole(false);
    }
  };

  const memberSince = user?.createdAt
    ? formatDate(new Date(user.createdAt), "do MMMM, yyyy")
    : "—";
  const memberDuration = user?.createdAt
    ? formatDistanceToNow(new Date(user.createdAt), { addSuffix: false })
    : null;

  const activeTodos = todos.filter((t) => !t.done);
  const completedTodos = todos.filter((t) => t.done);

  return (
    <Layout>
      <section className="px-4 sm:px-6 mt-36 flex flex-col items-center pb-24">
        <div className="md:max-w-4xl lg:max-w-5xl w-full">
          <FadeUp className="mb-8">
            <button
              onClick={() => navigate("/admin")}
              className="flex items-center gap-2 text-sm text-text/40 hover:text-text/80 transition-colors group"
            >
              <ArrowLeft className="size-4 group-hover:-translate-x-0.5 transition-transform duration-150" />
              Back to admin
            </button>
          </FadeUp>

          {isLoading && (
            <div className="flex flex-col gap-4">
              {[80, 200, 300].map((h) => (
                <div
                  key={h}
                  style={{ height: h }}
                  className="rounded-2xl bg-text/3 border border-text/5 animate-pulse"
                />
              ))}
            </div>
          )}

          {!isLoading && error && (
            <FadeUp>
              <ErrorCard message={error} />
            </FadeUp>
          )}

          {!isLoading && !error && user && (
            <>
              <FadeUp
                delay={0.05}
                className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10"
              >
                <div>
                  <p className="text-sm text-text/35 mb-1">Admin › User</p>
                  <h1 className="text-4xl sm:text-5xl font-semibold">
                    <span className="font-serif italic text-primary">
                      {user.name.split(" ")[0]},
                    </span>{" "}
                    <span className="text-text/80">details.</span>
                  </h1>
                </div>
                <Button
                  variant="secondary"
                  outline
                  onClick={handleRoleToggle}
                  disabled={updatingRole}
                  className="flex items-center gap-2 shrink-0"
                >
                  {user.role === "ADMIN" ? (
                    <>
                      <ShieldOff className="size-3.5" /> Demote to user
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="size-3.5" /> Promote to admin
                    </>
                  )}
                </Button>
              </FadeUp>

              <FadeUp
                delay={0.1}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4"
              >
                <div className="rounded-2xl border border-text/8 bg-text/2 p-6 flex flex-col items-center justify-center gap-4 text-center">
                  <UserAvatar name={user.name} size="lg" />
                  <div>
                    <p className="font-semibold text-text/90">{user.name}</p>
                    <p className="text-xs text-text/35 mt-0.5 truncate max-w-40">
                      {user.email}
                    </p>
                  </div>
                  <RoleBadge role={user.role} variant="full" />
                </div>
                <div className="sm:col-span-2 rounded-2xl border border-text/8 bg-text/2 p-6">
                  <p className="text-xs font-semibold uppercase tracking-widest text-text/30 font-serif">
                    Profile details
                  </p>
                  <div className="mt-3">
                    <InfoRow
                      icon={Mail}
                      label="Email address"
                      value={user.email}
                    />
                    <InfoRow
                      icon={CalendarDays}
                      label="Member since"
                      value={memberSince}
                    />
                    {memberDuration && (
                      <InfoRow
                        icon={Clock}
                        label="Member for"
                        value={memberDuration}
                      />
                    )}
                  </div>
                </div>
              </FadeUp>

              <FadeUp delay={0.15} className="grid grid-cols-3 gap-4 mb-8">
                <StatCard
                  label="Total todos"
                  value={user.stats.total}
                  icon={ListTodo}
                />
                <StatCard
                  label="Completed"
                  value={user.stats.completed}
                  icon={CheckSquare}
                />
                <StatCard
                  label="Active"
                  value={user.stats.active}
                  icon={Clock}
                />
              </FadeUp>

              <FadeUp delay={0.2} className="flex flex-col gap-6">
                {activeTodos.length > 0 && (
                  <div>
                    <SectionHeader
                      label="Active"
                      count={activeTodos.length}
                      className="mb-3"
                    />
                    <div className="flex flex-col gap-2">
                      {activeTodos.map((todo) => (
                        <TodoRow
                          key={todo.id}
                          todo={todo}
                          onDelete={handleDeleteTodo}
                          isDeleting={deletingTodo === todo.id}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {completedTodos.length > 0 && (
                  <div>
                    <SectionHeader
                      label="Completed"
                      count={completedTodos.length}
                      className="mb-3"
                    />
                    <div className="flex flex-col gap-2">
                      {completedTodos.map((todo) => (
                        <TodoRow
                          key={todo.id}
                          todo={todo}
                          onDelete={handleDeleteTodo}
                          isDeleting={deletingTodo === todo.id}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {todos.length === 0 && (
                  <p className="text-sm text-text/25 italic text-center py-8">
                    This user has no todos yet.
                  </p>
                )}
              </FadeUp>
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default AdminUserPage;
