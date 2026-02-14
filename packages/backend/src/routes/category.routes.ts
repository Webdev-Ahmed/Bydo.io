import { Router } from "express";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/controllers/category.controller";
import { protect } from "@/middlewares/auth.middleware";

const router = Router();

router.use(protect);

router.get("/", getCategories);
router.post("/", createCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;
