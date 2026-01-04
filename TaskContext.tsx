import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Task, TaskInput, TaskStatusFilter } from "../types/task";
import { taskService } from "../services/taskService";
import { useAuth } from "./AuthContext";

interface TaskContextType {
  tasks: Task[];
  tasksLoading: boolean;
  tasksError: string | null;
  statusFilter: TaskStatusFilter;
  categoryFilter: string | "all";
  loadTasks: () => Promise<void>;
  addTask: (input: TaskInput) => Promise<void>;
  updateTask: (id: string, updates: Partial<TaskInput & { completed: boolean }>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskCompletion: (id: string) => Promise<void>;
  setStatusFilter: (filter: TaskStatusFilter) => void;
  setCategoryFilter: (category: string | "all") => void;
  getFilteredTasks: () => Task[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [tasksError, setTasksError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<TaskStatusFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<string | "all">("all");

  const loadTasks = async (): Promise<void> => {
    if (!user) {
      return;
    }

    setTasksLoading(true);
    setTasksError(null);
    try {
      const loadedTasks = await taskService.getTasks();
      setTasks(loadedTasks);
    } catch (error: any) {
      setTasksError(error.message || "Failed to load tasks");
    } finally {
      setTasksLoading(false);
    }
  };

  const addTask = async (input: TaskInput): Promise<void> => {
    try {
      const newTask = await taskService.createTask(input);
      setTasks((prev) => [...prev, newTask]);
    } catch (error: any) {
      setTasksError(error.message || "Failed to create task");
      throw error;
    }
  };

  const updateTask = async (id: string, updates: Partial<TaskInput & { completed: boolean }>): Promise<void> => {
    try {
      const updatedTask = await taskService.updateTask(id, updates);
      setTasks((prev) => prev.map((task) => (task._id === id ? updatedTask : task)));
    } catch (error: any) {
      setTasksError(error.message || "Failed to update task");
      throw error;
    }
  };

  const deleteTask = async (id: string): Promise<void> => {
    try {
      await taskService.deleteTask(id);
      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch (error: any) {
      setTasksError(error.message || "Failed to delete task");
      throw error;
    }
  };

  const toggleTaskCompletion = async (id: string): Promise<void> => {
    const task = tasks.find((t) => t._id === id);
    if (task) {
      await updateTask(id, { completed: !task.completed });
    }
  };

  const getFilteredTasks = (): Task[] => {
    let filtered = tasks;

    // Apply status filter
    if (statusFilter === "completed") {
      filtered = filtered.filter((task) => task.completed);
    } else if (statusFilter === "pending") {
      filtered = filtered.filter((task) => !task.completed);
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((task) => task.category === categoryFilter);
    }

    return filtered;
  };

  useEffect(() => {
    if (user) {
      loadTasks();
    } else {
      setTasks([]);
      setTasksError(null);
    }
  }, [user]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        tasksLoading,
        tasksError,
        statusFilter,
        categoryFilter,
        loadTasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskCompletion,
        setStatusFilter,
        setCategoryFilter,
        getFilteredTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
};

