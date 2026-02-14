import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import env from "./libs/env";

import authRoutes from "@/routes/auth.routes";
import todoRoutes from "@/routes/todo.routes";
import categoryRoutes from "@/routes/category.routes";
import transactionRoutes from "@/routes/transaction.routes";
import budgetRoutes from "@/routes/budget.routes";
import reminderRoutes from "@/routes/reminder.routes";

const app = express();

app.use(
  cors({
    origin:
      env.NODE_ENV === "development"
        ? "http://localhost:5173"
        : env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  return res.json({ status: "ok", message: "The server is up and running 🍀" });
});

app.use("/api/auth", authRoutes);
app.use("/api/todo", todoRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/reminders", reminderRoutes);

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`🚀 The server is running on http://localhost:${PORT}`);
});
