import type { Request, Response } from "express";
import { prisma } from "@/libs/prisma";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        todos: {
          select: { done: true },
        },
      },
    });

    const formatted = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      stats: {
        total: user.todos.length,
        completed: user.todos.filter((t) => t.done).length,
        active: user.todos.filter((t) => !t.done).length,
      },
    }));

    res.json({ users: formatted });
  } catch (error) {
    console.error("[admin] getAllUsers:", error);
    res.status(500).json({ message: "Failed to fetch users." });
  }
};

export const getUserTodos = async (req: Request, res: Response) => {
  const userId = req.params.userId as string;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const todos = await prisma.todo.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        text: true,
        note: true,
        done: true,
        dueDate: true,
        createdAt: true,
      },
    });

    res.json({ todos });
  } catch (error) {
    console.error("[admin] getUserTodos:", error);
    res.status(500).json({ message: "Failed to fetch user todos." });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const userId = req.params.userId as string;
  const requestingUser = (req as any).user;

  if (requestingUser?.id === userId) {
    return res
      .status(400)
      .json({ message: "You cannot delete your own account." });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    await prisma.todo.deleteMany({ where: { userId } });
    await prisma.user.delete({ where: { id: userId } });

    res.json({ message: "User deleted successfully." });
  } catch (error) {
    console.error("[admin] deleteUser:", error);
    res.status(500).json({ message: "Failed to delete user." });
  }
};

export const deleteTodo = async (req: Request, res: Response) => {
  const todoId = req.params.todoId as string;

  try {
    const todo = await prisma.todo.findUnique({ where: { id: todoId } });

    if (!todo) {
      return res.status(404).json({ message: "Todo not found." });
    }

    await prisma.todo.delete({ where: { id: todoId } });

    res.json({ message: "Todo deleted successfully." });
  } catch (error) {
    console.error("[admin] deleteTodo:", error);
    res.status(500).json({ message: "Failed to delete todo." });
  }
};

export const updateUserRole = async (req: Request, res: Response) => {
  const userId = req.params.userId as string;
  const { role } = req.body as { role: "USER" | "ADMIN" };
  const requestingUser = (req as any).user;

  if (!["USER", "ADMIN"].includes(role)) {
    return res
      .status(400)
      .json({ message: "Invalid role. Must be USER or ADMIN." });
  }

  if (requestingUser?.id === userId) {
    return res
      .status(400)
      .json({ message: "You cannot change your own role." });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    res.json({ user: updated });
  } catch (error) {
    console.error("[admin] updateUserRole:", error);
    res.status(500).json({ message: "Failed to update role." });
  }
};
