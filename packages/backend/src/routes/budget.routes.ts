import { Router } from "express";
import {
  getBudgets,
  getBudget,
  createBudget,
  updateBudget,
  deleteBudget,
  getBudgetProgress,
} from "@/controllers/budget.controller";
import { protect } from "@/middlewares/auth.middleware";

const router = Router();

router.use(protect);

router.get("/", getBudgets);
router.get("/progress", getBudgetProgress);
router.get("/:id", getBudget);
router.post("/", createBudget);
router.put("/:id", updateBudget);
router.delete("/:id", deleteBudget);

export default router;
