// import db from '../DB/db.js';
// import { TaskRepositoryImpl } from '../implementations/TaskRepositoryImpl.js';
// import { UserRepositoryImpl } from '../implementations/UserRepositoryImpl.js';
// import { BoardRepositoryImpl } from '../implementations/BoardRepositoryImpl.js';
// import { TaskService } from '../../application/services/TaskService.js';
// import { STATUS } from '../../utils/states/Status.js';
// import {
//   handleRequest,
//   sendResponse,
//   // emitTaskEvent,
// } from '../../utils/handlers/http.js';
// import { EVENT_TYPE, TASK_STATUS } from '../../utils/types/types.js';

// const taskRepository = new TaskRepositoryImpl(db);
// const userRepository = new UserRepositoryImpl(db);
// const boardRepository = new BoardRepositoryImpl(db);
// const taskService = new TaskService(
//   taskRepository,
//   userRepository,
//   boardRepository,
// );

// export class TaskController {
//   getAllTasks = handleRequest(async (_req, res) => {
//     const tasks = await taskService.getAllTasks();
//     sendResponse(res, STATUS.OK, tasks);
//   });

//   getTaskById = handleRequest(async (req, res) => {
//     const taskId = req.params.taskId;
//     const task = await taskService.getTaskById(taskId);
//     if (!task) {
//       sendResponse(res, STATUS.NOT_FOUND, { message: 'Task not found' });
//       return;
//     }
//     sendResponse(res, STATUS.OK, task);
//   });

//   getTaskByUser = handleRequest(async (req, res) => {
//     const userId = req.params.userId;
//     const tasks = await taskService.getTasksByUser(userId);
//     sendResponse(res, STATUS.OK, tasks);
//   });

//   createTask = handleRequest(async (req, res) => {
//     const { title, description, user_id, board_id, task_status } = req.body;

//     if (!title || !description || !user_id) {
//       sendResponse(res, STATUS.BAD_REQUEST, {
//         message: 'Missing required fields',
//       });
//       return;
//     }

//     const task = await taskService.createTask(
//       title,
//       description,
//       user_id,
//       board_id,
//       task_status || TASK_STATUS.NEW,
//       false,
//     );

//     // await emitTaskEvent(EVENT_TYPE.TASK_CREATED, task);

//     sendResponse(res, STATUS.CREATED, task);
//   });

//   updateTask = handleRequest(async (req, res) => {
//     const taskId = req.params.taskId;
//     const { title, description, userId, boardId, task_status, completed } =
//       req.body;

//     if (!title || !description || !userId) {
//       sendResponse(res, STATUS.BAD_REQUEST, {
//         message: 'Missing required fields',
//       });
//       return;
//     }

//     const task = await taskService.updateTask(
//       taskId,
//       title,
//       description,
//       userId,
//       boardId,
//       task_status,
//       completed,
//     );

//     // await emitTaskEvent(EVENT_TYPE.TASK_UPDATED, task);

//     sendResponse(res, STATUS.OK, task);
//   });

//   deleteTask = handleRequest(async (req, res) => {
//     const { taskId, userId } = req.params;
//     const task = await taskService.getTaskById(taskId);

//     if (!task) {
//       sendResponse(res, STATUS.NOT_FOUND, { message: 'Task not found' });
//       return;
//     }

//     await taskService.deleteTask(taskId, userId);

//     // await emitTaskEvent(EVENT_TYPE.TASK_DELETED, task);

//     sendResponse(res, STATUS.NO_CONTENT);
//   });

//   getTasksByBoard = handleRequest(async (req, res) => {
//     const boardId = req.params.boardId;
//     const tasks = await taskService.getTasksByBoard(boardId);
//     sendResponse(res, STATUS.OK, tasks);
//   });

//   toggleComplete = handleRequest(async (req, res) => {
//     const taskId = req.params.taskId;
//     const task = await taskService.getTaskById(taskId);
//     if (!task) {
//       sendResponse(res, STATUS.NOT_FOUND, { message: 'Task not found' });
//       return;
//     }
//     await taskService.toggleComplete(taskId);
//     // await emitTaskEvent(EVENT_TYPE.TASK_COMPLETED,task);
//     sendResponse(res, STATUS.OK, task);
//     return;
//   });

//   toggleAssigned = handleRequest(async (req, res) => {
//     const taskId = req.params.taskId;
//     const task = await taskService.getTaskById(taskId);
//     if (!task) {
//       sendResponse(res, STATUS.NOT_FOUND, { message: 'Task not found' });
//       return;
//     }
//     await taskService.toggleAssigned(taskId);
//     // await emitTaskEvent(EVENT_TYPE.TASK_ASSIGNED, task);
//     sendResponse(res, STATUS.OK, task);
//     return;
//   });

//   toggleInProgress = handleRequest(async (req, res) => {
//     const taskId = req.params.taskId;
//     const task = await taskService.getTaskById(taskId);
//     if (!task) {
//       sendResponse(res, STATUS.NOT_FOUND, { message: 'Task not found' });
//       return;
//     }
//     await taskService.toggleInProgress(taskId);
//     // await emitTaskEvent(EVENT_TYPE.TASK_IN_PROGRESS, task);
//     sendResponse(res, STATUS.OK, task);
//     return;
//   });

//   updateTaskStatus = handleRequest(async (req, res) => { 
//     const taskId = req.params.taskId;
//     const { state }: { state: keyof typeof EVENT_TYPE } = req.body;
//     const task = await taskService.getTaskById(taskId);
//     if (!task) {
//       sendResponse(res, STATUS.NOT_FOUND, { message: 'Task not found' });
//       return;
//     }
//     await taskService.toggleTaskState(taskId, state);
//     // await emitTaskEvent(EVENT_TYPE[state.toUpperCase() as keyof typeof EVENT_TYPE], task);
//     sendResponse(res, STATUS.OK, task);
//     return;
//   })
// }

import { Request, Response } from 'express';
import db from '../DB/db.js';
import { TaskRepositoryImpl } from '../implementations/TaskRepositoryImpl.js';
import { UserRepositoryImpl } from '../implementations/UserRepositoryImpl.js';
import { BoardRepositoryImpl } from '../implementations/BoardRepositoryImpl.js';
import { TaskService } from '../../application/services/TaskService.js';
import { STATUS } from '../../utils/states/Status.js';
import { NotFoundError } from '../../utils/errors/Errors.js';
import { sendMessage } from '../../utils/events/listener.js';
// import { io } from '../../server.js';
import { EVENT_TYPE, TASK_STATUS } from '../../utils/types/types.js';

const taskReposiroty = new TaskRepositoryImpl(db);
const userRepository = new UserRepositoryImpl(db);
const boardRepository = new BoardRepositoryImpl(db);
const taskService = new TaskService(
  taskReposiroty,
  userRepository,
  boardRepository,
);

export class TaskController {
  async getAllTasks(_req: Request, res: Response) {
    try {
      const tasks = await taskService.getAllTasks();
      res.status(STATUS.OK).json(tasks);
      return;
    } catch (error) {
      console.error(error);
      res
        .status(STATUS.INTERNAL_SERVER_ERROR)
        .json({ message: 'Internal server error' });
      return;
    }
  }

  async getTaskById(req: Request, res: Response) {
    const taskId = req.params.taskId;
    try {
      const task = await taskService.getTaskById(taskId);
      if (!task) {
        res.status(STATUS.NOT_FOUND).json({ message: 'Task not found' });
        return;
      }
      res.status(STATUS.OK).json(task);
    } catch (error) {
      console.error(error);
      res
        .status(STATUS.INTERNAL_SERVER_ERROR)
        .json({ message: 'Internal server error' });
      return;
    }
  }

  async getTaskByUser(req: Request, res: Response) {
    const userId = req.params.userId;
    try {
      const tasks = await taskService.getTasksByUser(userId);
      res.status(STATUS.OK).json(tasks);
    } catch (error) {
      console.error(error);
      res
        .status(STATUS.INTERNAL_SERVER_ERROR)
        .json({ message: 'Internal server error' });
      return;
    }
  }

  async createTask(req: Request, res: Response) {
    const { title, description, user_id, board_id, task_status } = req.body;

    if (!title || !description || !user_id) {
      res
        .status(STATUS.BAD_REQUEST)
        .json({ message: 'Missing required fields' });
      return;
    }

    try {
      const task = await taskService.createTask(
        title,
        description,
        user_id,
        board_id,
        task_status ? task_status : TASK_STATUS.NEW,
        false,
      );
      const message = JSON.stringify({
        type: EVENT_TYPE.TASK_CREATED,
        taskId: task.id,
        title: task.title,
        description: task.description,
        userId: task.user_id,
        boardId: task.board_id,
        task_status: task.task_status,
        completed: task.completed,
      });
      await sendMessage('notifications', message);
      res.status(STATUS.CREATED).json(task);
    } catch (error) {
      console.error('Error creating task:', error);
      res
        .status(STATUS.INTERNAL_SERVER_ERROR)
        .json({ message: 'Internal server error' });
    }
  }

  async updateTask(req: Request, res: Response) {
    const taskId = req.params.taskId;
    const { title, description, userId, boardId, task_status, completed, assigned_user_id } =
      req.body;
    if (!title || !description || !userId) {
      res
        .status(STATUS.BAD_REQUEST)
        .json({ message: 'Missing required fields' });
      return;
    }
    try {
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
      const message = JSON.stringify({
        type: EVENT_TYPE.TASK_UPDATED,
        taskId: task.id,
        title: task.title,
        description: task.description,
        userId: task.user_id,
        boardId: task.board_id,
        task_status: task.task_status,
        completed: task.completed,
        assigned_user_id: task.assigned_user_id
      });
      await sendMessage('notifications', message);
      // io.emit('taskEdited', task);
      res.status(STATUS.OK).json(task);
      return;
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundError) {
        res.status(STATUS.NOT_FOUND).json({ message: error.message });
        return;
      }
    }
  }

  async deleteTask(req: Request, res: Response) {
    const taskId = req.params.taskId;
    const userId = req.params.userId;
    try {
      const taskToDelete = await taskService.getTaskById(taskId);
      await taskService.deleteTask(taskId, userId);
      const message = JSON.stringify({
        type: EVENT_TYPE.TASK_DELETED,
        taskId: taskToDelete?.id,
        title: taskToDelete?.title,
        description: taskToDelete?.description,
        userId: taskToDelete?.user_id,
        boardId: taskToDelete?.board_id,
        task_status: taskToDelete?.task_status,
        completed: taskToDelete?.completed,
        assigned_user_id: taskToDelete?.assigned_user_id,
      });
      await sendMessage('notifications', message);
      // io.emit('taskDeleted', taskToDelete);
      res.status(STATUS.NO_CONTENT).send();
      return;
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundError) {
        res.status(STATUS.NOT_FOUND).json({ message: error.message });
        return;
      } else {
        res
          .status(STATUS.INTERNAL_SERVER_ERROR)
          .json({ message: 'Internal server error' });
        return;
      }
    }
  }

  async toggleComplete(req: Request, res: Response) {
    const taskId = req.params.taskId;
    const userId = req.body.userId;
    const boardId = req.body.boardId;
    try {
      const task = await taskService.toggleComplete(taskId);
      if (task.completed === true) {
        const message = JSON.stringify({
          type: EVENT_TYPE.TASK_COMPLETED,
          taskId: task.id,
          title: task.title,
          description: task.description,
          userId,
          boardId,
          task_status: task.task_status,
          completed: task.completed,
          assigned_user_id: task.assigned_user_id
        });
        await sendMessage('notifications', message);
        // io.emit('taskcompleted', {
        //   taskId: task.id,
        //   title: task.title,
        //   boardId,
        // });
      } else {
        const message = JSON.stringify({
          type: EVENT_TYPE.TASK_UNCOMPLETED,
          taskId: task.id,
          title: task.title,
          description: task.description,
          userId,
          boardId,
          task_status: task.task_status,
          completed: task.completed,
        });
        await sendMessage('notifications', message);
        // io.emit('taskUncompleted', {
        //   taskId: task.id,
        //   title: task.title,
        //   boardId,
        // });
      }
      res.status(STATUS.OK).json(task);
      return;
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundError) {
        res.status(STATUS.NOT_FOUND).json({ message: error.message });
        return;
      } else {
        res
          .status(STATUS.INTERNAL_SERVER_ERROR)
          .json({ message: 'Internal server error' });
        return;
      }
    }
  }

  async toggleAssigned(req: Request, res: Response) {
    const taskId = req.params.taskId;
    const userId = req.body.userId;
    const boardId = req.body.boardId;
    try {
      const task = await taskService.toggleAssigned(taskId);
      const message = JSON.stringify({
        type: 'TASK_ASSIGNED',
        taskId: task.id,
        title: task.title,
        description: task.description,
        userId,
        boardId,
        task_status: task.task_status,
        completed: task.completed,
        assigned_user_id: task.assigned_user_id,
      });
      await sendMessage('notifications', message);
      // // io.emit('taskAssigned', {
      //   taskId: task.id,
      //   title: task.title,
      //   boardId,
      // });
      res.status(STATUS.OK).json(task);
      return;
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundError) {
        res.status(STATUS.NOT_FOUND).json({ message: error.message });
        return;
      } else {
        res
          .status(STATUS.INTERNAL_SERVER_ERROR)
          .json({ message: 'Internal server error' });
        return;
      }
    }
  }

  async toggleInProgress(req: Request, res: Response) {
    const taskId = req.params.taskId;
    const userId = req.body.userId;
    const boardId = req.body.boardId;
    try {
      const task = await taskService.toggleInProgress(taskId);
      const message = JSON.stringify({
        type: EVENT_TYPE.TASK_IN_PROGRESS,
        taskId: task.id,
        title: task.title,
        description: task.description,
        userId,
        boardId,
        task_status: task.task_status,
        completed: task.completed,
        assigned_user_id: task.assigned_user_id,
      });
      await sendMessage('notifications', message);
      // io.emit('taskInProgress', {
      //   taskId: task.id,
      //   title: task.title,
      //   boardId,
      // });
      res.status(STATUS.OK).json(task);
      return;
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundError) {
        res.status(STATUS.NOT_FOUND).json({ message: error.message });
        return;
      } else {
        res
          .status(STATUS.INTERNAL_SERVER_ERROR)
          .json({ message: 'Internal server error' });
        return;
      }
    }
  }

  async updateTaskStatus(req: Request, res: Response) {
    const taskId = req.params.taskId;
    const { task_status } = req.body;

    try {
      const task = await taskService.getTaskById(taskId);
      if (!task) {
        res.status(STATUS.NOT_FOUND).json({ message: 'Task not found' });
        return;
      }

      // Cambiar el estado
      task.task_status = task_status;
      if (task_status === TASK_STATUS.COMPLETED) {
        task.completed = true;
      }

      // Guardar los cambios
      await taskService.updateTask(
        taskId,
        task.title,
        task.description,
        task.user_id,
        task.board_id,
        task.task_status,
        task.completed,
        task.assigned_user_id!,
      );
      const message = JSON.stringify({
        type: EVENT_TYPE.TASK_UPDATED,
        taskId: task.id,
        title: task.title,
        description: task.description,
        userId: task.user_id,
        boardId: task.board_id,
        task_status: task.task_status,
        completed: task.completed,
      });
      await sendMessage('notifications', message);
      // io.emit('taskUpdated', {
        // taskId,
        // title: task.title,
        // task_status: task.task_status,
      // });
      res.status(STATUS.OK).json(task);
      return;
    } catch (error) {
      console.error(error);
      res
        .status(STATUS.INTERNAL_SERVER_ERROR)
        .json({ message: 'Internal server error' });
      return;
    }
  }

  async getTasksByBoard(req: Request, res: Response) {
    const boardId = req.params.boardId;
    try {
      const tasks = await taskService.getTasksByBoard(boardId);
      res.status(STATUS.OK).json(tasks);
    } catch (error) {
      console.error(error);
      res
        .status(STATUS.INTERNAL_SERVER_ERROR)
        .json({ message: 'Internal server error' });
      return;
    }
  }
}
