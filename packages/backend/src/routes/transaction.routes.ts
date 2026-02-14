import { Router } from "express";
import {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getFinanceSummary,
  getCategorySpending,
  getMonthlyStats,
} from "@/controllers/transaction.controller";
import { protect } from "@/middlewares/auth.middleware";

const router = Router();

router.use(protect);

router.get("/", getTransactions);
router.get("/summary", getFinanceSummary);
router.get("/category-spending", getCategorySpending);
router.get("/monthly-stats", getMonthlyStats);
router.get("/:id", getTransaction);
router.post("/", createTransaction);
router.put("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);

export default router;
