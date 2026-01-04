import { apiClient } from "./apiClient";
import { Task, TaskInput } from "../types/task";

export const taskService = {
  getTasks: async (): Promise<Task[]> => {
    const response = await apiClient.get<Task[]>("/tasks");
    return response.data;
  },

  createTask: async (input: TaskInput): Promise<Task> => {
    const response = await apiClient.post<Task>("/tasks", input);
    return response.data;
  },

  updateTask: async (id: string, updates: Partial<TaskInput & { completed: boolean }>): Promise<Task> => {
    const response = await apiClient.patch<Task>(`/tasks/${id}`, updates);
    return response.data;
  },

  deleteTask: async (id: string): Promise<void> => {
    await apiClient.delete(`/tasks/${id}`);
  },
};

