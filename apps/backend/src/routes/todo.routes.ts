import { Router } from "express";
import * as todoController from "#/controllers/todo.controller";
import { protect } from "#/middlewares/auth.middleware";

const router = Router();

router.use(protect);

router.get("/", todoController.getAll);
router.post("/", todoController.create);
router.put("/:id", todoController.update);
router.delete("/:id", todoController.deleteTodo);

export default router;
