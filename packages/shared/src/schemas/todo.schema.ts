import { z } from "zod";

export const createTodoSchema = z.object({
  text: z.string().min(1, "Todo text is required"),
  note: z.string().optional(),
});

export const updateTodoSchema = z.object({
  text: z.string().min(1, "Todo text is required").optional(),
  note: z.string().optional().nullable(),
  done: z.boolean().optional(),
});

export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
