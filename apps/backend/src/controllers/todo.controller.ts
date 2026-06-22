import { prisma } from "#/lib/prisma";
import { createTodoSchema, updateTodoSchema } from "@todo/shared";
import type { Request, Response } from "express";
import { flattenError, ZodError } from "zod";

export const getAll = async (req: Request, res: Response) => {
  try {
    const todos = await prisma.todo.findMany({
      where: { userId: req.user?.id },
    });

    return res.status(200).json({ todos });
  } catch (error) {
    return res.status(500).json({ message: "Failed to retrieve todos" });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const { text, note, dueDate } = createTodoSchema.parse(req.body);

    const todo = await prisma.todo.create({
      data: { text, note, dueDate: dueDate ?? null, userId: req.user!.id },
    });

    if (!todo) {
      return res.status(400).json({ message: "Failed to create todo" });
    }

    return res.status(201).json({ todo, message: "Todo created successfully" });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ message: flattenError(error).fieldErrors });
    }
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const todoId = req.params.id as string | undefined;
    const { text, note, dueDate, done } = updateTodoSchema.parse(req.body);

    if (!todoId) {
      return res.status(400).json({ message: "Invalid todo id" });
    }

    const todo = await prisma.todo.findFirst({ where: { id: todoId } });

    if (!todo) {
      return res.status(400).json({ message: "Invalid todo id" });
    }

    const updatedTodo = await prisma.todo.update({
      where: { id: todoId },
      data: { text, note, dueDate, done },
    });

    if (!updatedTodo) {
      return res.status(400).json({ message: "Failed to update todo" });
    }

    return res
      .status(200)
      .json({ todo: updatedTodo, message: "Todo updated successfully" });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ message: flattenError(error).fieldErrors });
    }
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteTodo = async (req: Request, res: Response) => {
  try {
    const todoId = req.params.id as string | undefined;

    if (!todoId) {
      return res.status(400).json({ message: "Invalid todo id" });
    }

    const todo = await prisma.todo.findFirst({ where: { id: todoId } });

    if (!todo) {
      return res.status(400).json({ message: "Invalid todo id" });
    }

    const deletedTodo = await prisma.todo.delete({ where: { id: todoId } });

    if (!deletedTodo) {
      return res.status(400).json({ message: "Failed to delete todo" });
    }

    return res
      .status(200)
      .json({ todo: deletedTodo, message: "Todo deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
