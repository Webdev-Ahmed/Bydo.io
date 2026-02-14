import { z } from "zod";

export const categoryTypeEnum = z.enum(["INCOME", "EXPENSE"]);

export const createCategorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(50),
  type: categoryTypeEnum,
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Invalid color format")
    .optional(),
  icon: z.string().max(50).optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

export type CategoryType = z.infer<typeof categoryTypeEnum>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;

export const transactionTypeEnum = z.enum(["INCOME", "EXPENSE"]);

export const createTransactionSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  description: z.string().min(1, "Description is required").max(200),
  date: z.string().datetime().or(z.date()),
  type: transactionTypeEnum,
  categoryId: z.string().uuid().optional().nullable(),
});

export const updateTransactionSchema = createTransactionSchema.partial();

export type TransactionType = z.infer<typeof transactionTypeEnum>;
export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;

export const createBudgetSchema = z.object({
  amount: z.number().positive("Budget amount must be positive"),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2000).max(2100),
  categoryId: z.string().uuid(),
});

export const updateBudgetSchema = z.object({
  amount: z.number().positive("Budget amount must be positive"),
});

export type CreateBudgetInput = z.infer<typeof createBudgetSchema>;
export type UpdateBudgetInput = z.infer<typeof updateBudgetSchema>;
