import { Router } from "express";
import {
  getReminders,
  getReminder,
  createReminder,
  updateReminder,
  deleteReminder,
  completeReminder,
  getUpcomingReminders,
  getOverdueReminders,
} from "@/controllers/reminder.controller";
import { protect } from "@/middlewares/auth.middleware";

const router = Router();

router.use(protect);

router.get("/", getReminders);
router.get("/upcoming", getUpcomingReminders);
router.get("/overdue", getOverdueReminders);
router.get("/:id", getReminder);
router.post("/", createReminder);
router.put("/:id", updateReminder);
router.put("/:id/complete", completeReminder);
router.delete("/:id", deleteReminder);

export default router;
