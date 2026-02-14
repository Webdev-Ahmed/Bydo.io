import { prisma } from "@/libs/prisma";
import { createBudgetSchema, updateBudgetSchema } from "@todo/shared";
import type { Request, Response } from "express";
import { flattenError, ZodError } from "zod";

export const getBudgets = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { month, year } = req.query;

    const where: any = { userId };

    if (month) where.month = parseInt(month as string);
    if (year) where.year = parseInt(year as string);

    const budgets = await prisma.budget.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({ budgets });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getBudget = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const id = req.params.id as string;

    const budget = await prisma.budget.findFirst({
      where: { id, userId },
      include: { category: true },
    });

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    return res.status(200).json({ budget });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createBudget = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const data = createBudgetSchema.parse(req.body);

    const category = await prisma.category.findFirst({
      where: { id: data.categoryId, userId },
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const budget = await prisma.budget.create({
      data: {
        ...data,
        userId,
      },
      include: { category: true },
    });

    return res.status(201).json({ budget, message: "Budget created" });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ message: flattenError(error).fieldErrors });
    }
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateBudget = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const id = req.params.id as string;
    const data = updateBudgetSchema.parse(req.body);

    const budget = await prisma.budget.findFirst({
      where: { id, userId },
    });

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    const updated = await prisma.budget.update({
      where: { id },
      data,
      include: { category: true },
    });

    return res.status(200).json({ budget: updated, message: "Budget updated" });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ message: flattenError(error).fieldErrors });
    }
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteBudget = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const id = req.params.id as string;

    const budget = await prisma.budget.findFirst({
      where: { id, userId },
    });

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    await prisma.budget.delete({ where: { id } });

    return res.status(200).json({ message: "Budget deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getBudgetProgress = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { month, year } = req.query;

    const currentDate = new Date();
    const targetMonth = month
      ? parseInt(month as string)
      : currentDate.getMonth() + 1;
    const targetYear = year
      ? parseInt(year as string)
      : currentDate.getFullYear();

    const budgets = await prisma.budget.findMany({
      where: {
        userId,
        month: targetMonth,
        year: targetYear,
      },
      include: { category: true },
    });

    const startDate = new Date(targetYear, targetMonth - 1, 1);
    const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59);

    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const budgetProgress = budgets.map((budget) => {
      const categoryTransactions = transactions.filter(
        (t) => t.categoryId === budget.categoryId,
      );

      const spent = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
      const remaining = budget.amount - spent;
      const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;

      return {
        budgetId: budget.id,
        categoryId: budget.category.id,
        categoryName: budget.category.name,
        budgetAmount: budget.amount,
        spent,
        remaining,
        percentage,
        month: budget.month,
        year: budget.year,
        color: budget.category.color,
      };
    });

    return res.status(200).json({ budgetProgress });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
