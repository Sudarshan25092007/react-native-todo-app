import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { getTasks, createTask, updateTask, deleteTask } from "../controllers/task.controller";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getTasks);
router.post("/", createTask);
router.patch("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
