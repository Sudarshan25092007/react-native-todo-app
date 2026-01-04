export type TaskStatusFilter = "all" | "completed" | "pending";

export interface Task {
  _id: string;
  title: string;
  description?: string;
  deadline?: string; // ISO string
  priority: "low" | "medium" | "high";
  category?: string;
  completed: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface TaskInput {
  title: string;
  description?: string;
  deadline?: string;
  priority: "low" | "medium" | "high";
  category?: string;
}

