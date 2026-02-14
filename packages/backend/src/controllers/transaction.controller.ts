import { prisma } from "@/libs/prisma";
import { createTransactionSchema, updateTransactionSchema } from "@todo/shared";
import type { Request, Response } from "express";
import { flattenError, ZodError } from "zod";

export const getTransactions = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { startDate, endDate, type, categoryId, limit } = req.query;

    const where: any = { userId };

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate as string);
      if (endDate) where.date.lte = new Date(endDate as string);
    }

    if (type) where.type = type;
    if (categoryId) where.categoryId = categoryId;

    const transactions = await prisma.transaction.findMany({
      where,
      include: { category: true },
      orderBy: { date: "desc" },
      take: limit ? parseInt(limit as string) : undefined,
    });

    return res.status(200).json({ transactions });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getTransaction = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const id = req.params.id as string;

    const transaction = await prisma.transaction.findFirst({
      where: { id, userId },
      include: { category: true },
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    return res.status(200).json({ transaction });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createTransaction = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const data = createTransactionSchema.parse(req.body);

    const transaction = await prisma.transaction.create({
      data: {
        ...data,
        date: new Date(data.date),
        userId,
      },
      include: { category: true },
    });

    return res
      .status(201)
      .json({ transaction, message: "Transaction created" });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ message: flattenError(error).fieldErrors });
    }
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateTransaction = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const id = req.params.id as string;
    const data = updateTransactionSchema.parse(req.body);

    const transaction = await prisma.transaction.findFirst({
      where: { id, userId },
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    const updated = await prisma.transaction.update({
      where: { id },
      data: {
        ...data,
        date: data.date ? new Date(data.date) : undefined,
      },
      include: { category: true },
    });

    return res
      .status(200)
      .json({ transaction: updated, message: "Transaction updated" });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ message: flattenError(error).fieldErrors });
    }
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteTransaction = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const id = req.params.id as string;

    const transaction = await prisma.transaction.findFirst({
      where: { id, userId },
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    await prisma.transaction.delete({ where: { id } });

    return res.status(200).json({ message: "Transaction deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getFinanceSummary = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { startDate, endDate } = req.query;

    const where: any = { userId };

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate as string);
      if (endDate) where.date.lte = new Date(endDate as string);
    }

    const transactions = await prisma.transaction.findMany({ where });

    const totalIncome = transactions
      .filter((t) => t.type === "INCOME")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter((t) => t.type === "EXPENSE")
      .reduce((sum, t) => sum + t.amount, 0);

    return res.status(200).json({
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      transactionCount: transactions.length,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getCategorySpending = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { startDate, endDate, type } = req.query;

    const where: any = { userId };

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate as string);
      if (endDate) where.date.lte = new Date(endDate as string);
    }

    if (type) where.type = type;

    const transactions = await prisma.transaction.findMany({
      where,
      include: { category: true },
    });

    const categoryMap = new Map();

    transactions.forEach((t) => {
      if (!t.category) return;

      const key = t.categoryId!;
      if (!categoryMap.has(key)) {
        categoryMap.set(key, {
          categoryId: t.category.id,
          categoryName: t.category.name,
          color: t.category.color,
          total: 0,
          transactionCount: 0,
        });
      }

      const cat = categoryMap.get(key);
      cat.total += t.amount;
      cat.transactionCount += 1;
    });

    const categorySpending = Array.from(categoryMap.values());
    const totalAmount = categorySpending.reduce((sum, c) => sum + c.total, 0);

    categorySpending.forEach((c) => {
      c.percentage = totalAmount > 0 ? (c.total / totalAmount) * 100 : 0;
    });

    categorySpending.sort((a, b) => b.total - a.total);

    return res.status(200).json({ categorySpending });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMonthlyStats = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { year, months } = req.query;

    const currentYear = year
      ? parseInt(year as string)
      : new Date().getFullYear();
    const monthCount = months ? parseInt(months as string) : 12;

    const stats = [];

    for (let i = 0; i < monthCount; i++) {
      const month = new Date().getMonth() - i + 1;
      const adjustedYear = month <= 0 ? currentYear - 1 : currentYear;
      const adjustedMonth = month <= 0 ? 12 + month : month;

      const startDate = new Date(adjustedYear, adjustedMonth - 1, 1);
      const endDate = new Date(adjustedYear, adjustedMonth, 0, 23, 59, 59);

      const transactions = await prisma.transaction.findMany({
        where: {
          userId,
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      const income = transactions
        .filter((t) => t.type === "INCOME")
        .reduce((sum, t) => sum + t.amount, 0);

      const expenses = transactions
        .filter((t) => t.type === "EXPENSE")
        .reduce((sum, t) => sum + t.amount, 0);

      stats.unshift({
        month: adjustedMonth,
        year: adjustedYear,
        income,
        expenses,
        balance: income - expenses,
      });
    }

    return res.status(200).json({ monthlyStats: stats });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
