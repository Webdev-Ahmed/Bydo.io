import { Router } from "express";
import { protect, requireAdmin } from "#/middlewares/auth.middleware";
import * as adminController from "#/controllers/admin.controller";

const router = Router();

router.use(protect, requireAdmin);

router.get("/users", adminController.getAllUsers);
router.get("/users/:userId/todos", adminController.getUserTodos);
router.delete("/users/:userId", adminController.deleteUser);
router.delete("/todos/:todoId", adminController.deleteTodo);
router.patch("/users/:userId/role", adminController.updateUserRole);

export default router;
