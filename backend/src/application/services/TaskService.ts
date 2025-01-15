import { v4 as uuidv4 } from "uuid";
import { Task } from "../../domain/entities/Task.js";
import { TaskRepository } from "../../domain/repositories/TaskRepository.js";
import { UserRepository } from "../../domain/repositories/UserRepository.js";
import { BoardRepository } from "../../domain/repositories/BoardRepository.js";
import { ForbiddenError, NotFoundError } from "../../utils/errors/Errors.js";
import { TASK_STATUS } from "../../utils/types/types.js";

export class TaskService {
  private taskRepository: TaskRepository;
  private userRepository: UserRepository;
  private boardRepository: BoardRepository;
  constructor(
    taskRepository: TaskRepository,
    userRepository: UserRepository,
    boardRepository: BoardRepository
  ) {
    this.taskRepository = taskRepository;
    this.userRepository = userRepository;
    this.boardRepository = boardRepository;
  }
  async getAllTasks(): Promise<Task[]> {
    const tasks = await this.taskRepository.getAllTasks();
    if (!tasks) return [];
    return tasks;
  }

  async getTaskById(taskId: string): Promise<Task | null> {
    const task = await this.taskRepository.getTaskById(taskId);
    if (!task) {
      throw new NotFoundError(`Task not found.`);
    }
    return task;
  }

  async createTask(
    title: string,
    description: string,
    userId: string,
    boardId: string,
    task_status: TASK_STATUS = TASK_STATUS.NEW,
    completed: boolean = false,
    assigned_user_id?: string
  ): Promise<Task> {
    const user = await this.userRepository.getUserById(userId);
    if (!user) throw new NotFoundError("User not found.");
    const board = await this.boardRepository.getBoardById(boardId);
    if (!board) throw new NotFoundError("Board not found.");
    const id = uuidv4();
    const task = new Task(id, title, description, user.id, board.id, task_status, completed, assigned_user_id);
    await this.taskRepository.createTask(task);
    return task;
  }

  async updateTask(
    taskId: string,
    title: string,
    description: string,
    userId: string,
    boardId: string,
    task_status: TASK_STATUS,
    completed: boolean,
    assigned_user_id: string,
  ): Promise<Task> {
    const task = await this.getTaskById(taskId);
    if (!task) throw new NotFoundError("Task not found.");
    if (task.user_id !== userId) throw new ForbiddenError("Unauthorized.");
    task.title = title;
    task.description = description;
    task.board_id = boardId;
    task.task_status = task_status;
    task.completed = completed;
    if (assigned_user_id) {
      const user = await this.userRepository.getUserById(assigned_user_id);
      if (!user) throw new NotFoundError("Assigned user not found.");
      task.assigned_user_id = assigned_user_id;
      return task;
    } else {
      await this.taskRepository.updateTask(taskId, task);
      return task;
    }
  }

  async deleteTask(taskId: string, userId: string): Promise<void> {
    const task = await this.getTaskById(taskId);
    if (!task) throw new NotFoundError("Task not found.");
    if (task.user_id !== userId) throw new ForbiddenError("Unauthorized.");
    await this.taskRepository.deleteTask(taskId);
    return;
  }

  async toggleComplete(taskId: string): Promise<Task> {
    try {
      const task = await this.getTaskById(taskId);

      if (!task) {
        throw new NotFoundError("Task not found.");
      }
      task.task_status = TASK_STATUS.COMPLETED;
      task.completed = true;
      await this.taskRepository.updateTask(taskId, task);
      return task;
    } catch (error) {
      console.error("Error toggling task completion:", error);
      throw error;
    }
  }

  async toggleAssigned(taskId: string): Promise<Task> { 
    const task = await this.getTaskById(taskId);
    if (!task) throw new NotFoundError("Task not found.");
      task.task_status = TASK_STATUS.ASSIGNED;
    await this.taskRepository.updateTask(taskId, task);
    return task;
  }

  async toggleInProgress(taskId: string): Promise<Task> {
    const task = await this.getTaskById(taskId);
    if (!task) throw new NotFoundError("Task not found.");
      task.task_status = TASK_STATUS.IN_PROGRESS;
    await this.taskRepository.updateTask(taskId, task);
    return task;
  }

  async toggleNew(taskId: string): Promise<Task> {
    const task = await this.getTaskById(taskId);
    if (!task) throw new NotFoundError("Task not found.");
      task.task_status = TASK_STATUS.NEW;
    await this.taskRepository.updateTask(taskId, task);
    return task;
  }

  async getTasksByUser(userId: string): Promise<Task[]> {
    const tasks = await this.taskRepository.getAllTasks();
    return tasks.filter((task) => task.user_id === userId);
  }

  async getTasksByBoard(boardId: string): Promise<Task[]> {
    const tasks = await this.taskRepository.getAllTasks();
    return tasks.filter((task) => task.board_id === boardId);
  }

  async toggleTaskState(taskId: string, state: string): Promise<void> {
    const task = await this.getTaskById(taskId);
    if (!task) throw new NotFoundError("Task not found.");
    if (state === "COMPLETED") {
      await this.toggleComplete(taskId);
    } else if (state === "ASSIGNED") {
      await this.toggleAssigned(taskId);
    } else if (state === "IN_PROGRESS") {
      await this.toggleInProgress(taskId);
    } else if (state === 'NEW') {
      task.task_status = TASK_STATUS.NEW;
      await this.toggleNew(taskId)
    } else {
      throw new Error("Invalid state provided.");
    }
    return;
  }

  async assignedToUser(taskId: string, userId: string): Promise<void> {
    const task = await this.getTaskById(taskId);
    if (!task) throw new NotFoundError("Task not found.");
    const user = await this.userRepository.getUserById(userId);
    if (!user) throw new NotFoundError("User not found.");
    await this.taskRepository.assignTaskToUser(task.id, user.id)
    return;
  }
}
