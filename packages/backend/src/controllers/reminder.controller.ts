import { prisma } from "@/libs/prisma";
import {
  createReminderSchema,
  updateReminderSchema,
  completeReminderSchema,
} from "@todo/shared";
import type { Request, Response } from "express";
import { flattenError, ZodError } from "zod";

export const getReminders = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { completed, upcoming, overdue, type } = req.query;

    const where: any = { userId };

    if (completed !== undefined) {
      where.completed = completed === "true";
    }

    if (type) {
      where.reminderType = type;
    }

    if (upcoming === "true") {
      where.completed = false;
      where.dueDate = {
        gte: new Date(),
      };
    }

    if (overdue === "true") {
      where.completed = false;
      where.dueDate = {
        lt: new Date(),
      };
    }

    const reminders = await prisma.financialReminder.findMany({
      where,
      include: {
        category: true,
        transaction: true,
      },
      orderBy: { dueDate: "asc" },
    });

    return res.status(200).json({ reminders });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getReminder = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const id = req.params.id as string;

    const reminder = await prisma.financialReminder.findFirst({
      where: { id, userId },
      include: {
        category: true,
        transaction: true,
      },
    });

    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    return res.status(200).json({ reminder });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createReminder = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const data = createReminderSchema.parse(req.body);

    if (data.categoryId) {
      const category = await prisma.category.findFirst({
        where: { id: data.categoryId, userId },
      });

      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
    }

    const reminder = await prisma.financialReminder.create({
      data: {
        ...data,
        dueDate: new Date(data.dueDate),
        userId,
      },
      include: {
        category: true,
      },
    });

    return res.status(201).json({ reminder, message: "Reminder created" });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ message: flattenError(error).fieldErrors });
    }
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateReminder = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const id = req.params.id as string;
    const data = updateReminderSchema.parse(req.body);

    const reminder = await prisma.financialReminder.findFirst({
      where: { id, userId },
    });

    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    // If categoryId is being updated, verify it belongs to user
    if (data.categoryId) {
      const category = await prisma.category.findFirst({
        where: { id: data.categoryId, userId },
      });

      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
    }

    const updated = await prisma.financialReminder.update({
      where: { id },
      data: {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      },
      include: {
        category: true,
        transaction: true,
      },
    });

    return res
      .status(200)
      .json({ reminder: updated, message: "Reminder updated" });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ message: flattenError(error).fieldErrors });
    }
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteReminder = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const id = req.params.id as string;

    const reminder = await prisma.financialReminder.findFirst({
      where: { id, userId },
    });

    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    await prisma.financialReminder.delete({ where: { id } });

    return res.status(200).json({ message: "Reminder deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const completeReminder = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const id = req.params.id as string;
    const data = completeReminderSchema.parse(req.body);

    const reminder = await prisma.financialReminder.findFirst({
      where: { id, userId },
      include: { category: true },
    });

    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    let transaction = null;

    if (data.completed && data.createTransaction && data.transactionData) {
      transaction = await prisma.transaction.create({
        data: {
          amount: data.transactionData.amount,
          description: data.transactionData.description,
          date: data.transactionData.date
            ? new Date(data.transactionData.date)
            : new Date(),
          type: data.transactionData.type || "EXPENSE",
          categoryId: data.transactionData.categoryId || reminder.categoryId,
          userId,
        },
        include: { category: true },
      });
    }

    const updated = await prisma.financialReminder.update({
      where: { id },
      data: {
        completed: data.completed,
        transactionId: transaction?.id,
      },
      include: {
        category: true,
        transaction: true,
      },
    });

    if (data.completed && reminder.isRecurring && reminder.recurrence) {
      const nextDueDate = calculateNextDueDate(
        new Date(reminder.dueDate),
        reminder.recurrence,
      );

      await prisma.financialReminder.create({
        data: {
          title: reminder.title,
          description: reminder.description,
          dueDate: nextDueDate,
          priority: reminder.priority,
          reminderType: reminder.reminderType,
          amount: reminder.amount,
          categoryId: reminder.categoryId,
          isRecurring: true,
          recurrence: reminder.recurrence,
          userId,
        },
      });
    }

    return res.status(200).json({
      reminder: updated,
      transaction,
      message: "Reminder completed",
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ message: flattenError(error).fieldErrors });
    }
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

function calculateNextDueDate(currentDate: Date, recurrence: string): Date {
  const nextDate = new Date(currentDate);

  switch (recurrence) {
    case "WEEKLY":
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case "MONTHLY":
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    case "QUARTERLY":
      nextDate.setMonth(nextDate.getMonth() + 3);
      break;
    case "YEARLY":
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      break;
  }

  return nextDate;
}

export const getUpcomingReminders = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { days = 7 } = req.query;

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + parseInt(days as string));

    const reminders = await prisma.financialReminder.findMany({
      where: {
        userId,
        completed: false,
        dueDate: {
          lte: futureDate,
          gte: new Date(),
        },
      },
      include: {
        category: true,
      },
      orderBy: { dueDate: "asc" },
    });

    return res.status(200).json({ reminders });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getOverdueReminders = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;

    const reminders = await prisma.financialReminder.findMany({
      where: {
        userId,
        completed: false,
        dueDate: {
          lt: new Date(),
        },
      },
      include: {
        category: true,
      },
      orderBy: { dueDate: "asc" },
    });

    return res.status(200).json({ reminders });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
