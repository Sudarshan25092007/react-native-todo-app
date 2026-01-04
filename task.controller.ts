import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import Task from "../models/Task";

// GET /api/tasks
export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const tasks = await Task.find({ userId: req.userId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

// POST /api/tasks
export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const task = await Task.create({
      userId: req.userId, // Firebase UID string
      title: req.body.title,
      description: req.body.description,
      deadline: req.body.deadline,
      priority: req.body.priority,
      category: req.body.category,
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ message: "Failed to create task" });
  }
};

// PATCH /api/tasks/:id
export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const updates = {
      title: req.body.title,
      description: req.body.description,
      deadline: req.body.deadline,
      priority: req.body.priority,
      category: req.body.category,
      completed: req.body.completed,
    };

    const task = await Task.findOneAndUpdate(
      { _id: id, userId: req.userId },
      updates,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (err) {
    res.status(400).json({ message: "Failed to update task" });
  }
};

// DELETE /api/tasks/:id
export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const task = await Task.findOneAndDelete({ _id: id, userId: req.userId });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(204).send();
  } catch (err) {
    res.status(400).json({ message: "Failed to delete task" });
  }
};
