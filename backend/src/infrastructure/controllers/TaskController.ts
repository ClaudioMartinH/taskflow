import db from '../DB/db.js';
import { TaskRepositoryImpl } from '../implementations/TaskRepositoryImpl.js';
import { UserRepositoryImpl } from '../implementations/UserRepositoryImpl.js';
import { BoardRepositoryImpl } from '../implementations/BoardRepositoryImpl.js';
import { TaskService } from '../../application/services/TaskService.js';
import { STATUS } from '../../utils/states/Status.js';
import {
  handleRequest,
  sendResponse,
  // emitTaskEvent,
} from '../../utils/handlers/http.js';
import { EVENT_TYPE, TASK_STATUS } from '../../utils/types/types.js';

const taskRepository = new TaskRepositoryImpl(db);
const userRepository = new UserRepositoryImpl(db);
const boardRepository = new BoardRepositoryImpl(db);
const taskService = new TaskService(
  taskRepository,
  userRepository,
  boardRepository,
);

export class TaskController {
  getAllTasks = handleRequest(async (_req, res) => {
    const tasks = await taskService.getAllTasks();
    sendResponse(res, STATUS.OK, tasks);
  });

  getTaskById = handleRequest(async (req, res) => {
    const taskId = req.params.taskId;
    const task = await taskService.getTaskById(taskId);
    if (!task) {
      sendResponse(res, STATUS.NOT_FOUND, { message: 'Task not found' });
      return;
    }
    sendResponse(res, STATUS.OK, task);
  });

  getTaskByUser = handleRequest(async (req, res) => {
    const userId = req.params.userId;
    const tasks = await taskService.getTasksByUser(userId);
    sendResponse(res, STATUS.OK, tasks);
  });

  createTask = handleRequest(async (req, res) => {
    const { title, description, user_id, board_id, task_status } = req.body;

    if (!title || !description || !user_id) {
      sendResponse(res, STATUS.BAD_REQUEST, {
        message: 'Missing required fields',
      });
      return;
    }

    const task = await taskService.createTask(
      title,
      description,
      user_id,
      board_id,
      task_status || TASK_STATUS.NEW,
      false,
    );

    sendResponse(res, STATUS.CREATED, task);
  });

  updateTask = handleRequest(async (req, res) => {
    const taskId = req.params.taskId;
    const {
      title,
      description,
      userId,
      boardId,
      task_status,
      completed,
      assigned_user_id,
    } = req.body;

    if (!title || !description || !userId) {
      sendResponse(res, STATUS.BAD_REQUEST, {
        message: 'Missing required fields',
      });
      return;
    }

    const task = await taskService.updateTask(
      taskId,
      title,
      description,
      userId,
      boardId,
      task_status,
      completed,
      assigned_user_id,
    );

    sendResponse(res, STATUS.OK, task);
  });

  deleteTask = handleRequest(async (req, res) => {
    const { taskId, userId } = req.params;
    const task = await taskService.getTaskById(taskId);

    if (!task) {
      sendResponse(res, STATUS.NOT_FOUND, { message: 'Task not found' });
      return;
    }

    await taskService.deleteTask(taskId, userId);

    sendResponse(res, STATUS.NO_CONTENT);
  });

  getTasksByBoard = handleRequest(async (req, res) => {
    const boardId = req.params.boardId;
    const tasks = await taskService.getTasksByBoard(boardId);
    sendResponse(res, STATUS.OK, tasks);
  });

  toggleComplete = handleRequest(async (req, res) => {
    const taskId = req.params.taskId;
    const task = await taskService.getTaskById(taskId);
    if (!task) {
      sendResponse(res, STATUS.NOT_FOUND, { message: 'Task not found' });
      return;
    }
    await taskService.toggleComplete(taskId);
    return;
  });

  toggleAssigned = handleRequest(async (req, res) => {
    const taskId = req.params.taskId;
    const task = await taskService.getTaskById(taskId);
    if (!task) {
      sendResponse(res, STATUS.NOT_FOUND, { message: 'Task not found' });
      return;
    }
    await taskService.toggleAssigned(taskId);
    return;
  });

  toggleInProgress = handleRequest(async (req, res) => {
    const taskId = req.params.taskId;
    const task = await taskService.getTaskById(taskId);
    if (!task) {
      sendResponse(res, STATUS.NOT_FOUND, { message: 'Task not found' });
      return;
    }
    await taskService.toggleInProgress(taskId);
    return;
  });

  updateTaskStatus = handleRequest(async (req, res) => {
    const taskId = req.params.taskId;
    const { state }: { state: keyof typeof EVENT_TYPE } = req.body;
    const task = await taskService.getTaskById(taskId);
    if (!task) {
      sendResponse(res, STATUS.NOT_FOUND, { message: 'Task not found' });
      return;
    }
    await taskService.toggleTaskState(taskId, state);
    return;
  });
  
  assignTaskToUser = handleRequest(async (req, res) => {
    const taskId = req.params.taskId;
    const userId = req.params.userId;
    const task = await taskService.getTaskById(taskId);
    if (!task) {
      sendResponse(res, STATUS.NOT_FOUND, { message: 'Task not found' });
      return;
    }

    await taskService.assignedToUser(taskId, userId);

    const updatedTask = await taskService.getTaskWithUser(taskId);

    sendResponse(res, STATUS.OK, updatedTask);
  });
}
