import { Task } from "../entities/Task.js";

export interface TaskRepository {
  getAllTasks(): Promise<Task[]>;
  getTaskById(taskId: string): Promise<Task | null>;
  getAllTasksByBoardId(boardId: string): Promise<Task[]>;
  createTask(task: Task): Promise<void>;
  updateTask(taskId: string, updatedTask: Task): Promise<void>;
  deleteTask(taskId: string): Promise<void>;
  completeTask(taskId: string): Promise<Task>;
  assignTaskToUser(taskId: string, userId: string): Promise<void>;
}
