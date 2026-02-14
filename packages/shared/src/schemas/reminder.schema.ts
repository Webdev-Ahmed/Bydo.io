import { z } from "zod";

export const reminderTypeEnum = z.enum([
  "BILL_PAYMENT",
  "BUDGET_REVIEW",
  "SAVINGS_GOAL",
  "TAX_DEADLINE",
  "SUBSCRIPTION_RENEWAL",
  "GENERAL",
]);

export const recurrenceEnum = z.enum([
  "WEEKLY",
  "MONTHLY",
  "QUARTERLY",
  "YEARLY",
]);

export const priorityEnum = z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]);

export const createReminderSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(500).optional(),
  dueDate: z.string().datetime().or(z.date()),
  priority: priorityEnum.default("MEDIUM"),
  reminderType: reminderTypeEnum,
  amount: z.number().positive().optional(),
  categoryId: z.string().uuid().optional(),
  isRecurring: z.boolean().default(false),
  recurrence: recurrenceEnum.optional(),
});

export const updateReminderSchema = createReminderSchema.partial();

export const completeReminderSchema = z.object({
  completed: z.boolean(),
  createTransaction: z.boolean().optional(),
  transactionData: z
    .object({
      amount: z.number().positive(),
      description: z.string(),
      date: z.string().datetime().or(z.date()).optional(),
      type: z.enum(["INCOME", "EXPENSE"]).optional(),
      categoryId: z.string().uuid().optional(),
    })
    .optional(),
});

export type ReminderType = z.infer<typeof reminderTypeEnum>;
export type Recurrence = z.infer<typeof recurrenceEnum>;
export type Priority = z.infer<typeof priorityEnum>;
export type CreateReminderInput = z.infer<typeof createReminderSchema>;
export type UpdateReminderInput = z.infer<typeof updateReminderSchema>;
export type CompleteReminderInput = z.infer<typeof completeReminderSchema>;
