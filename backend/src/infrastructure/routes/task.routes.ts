import { Router } from 'express';
import { TaskController } from '../controllers/TaskController.js';

const taskRouter = Router();
const taskController = new TaskController();

taskRouter.get('/', taskController.getAllTasks); 
taskRouter.post('/', taskController.createTask); 
taskRouter.get('/:taskId', taskController.getTaskById);
taskRouter.get('/board/:boardId', taskController.getTasksByBoard); 
taskRouter.get('/user/:userId', taskController.getTaskByUser);
taskRouter.put('/:taskId', taskController.updateTask);
taskRouter.post('/complete/:taskId', taskController.toggleComplete);
taskRouter.post('/assign/:taskId', taskController.toggleAssigned);
taskRouter.post('/inprogress/:taskId', taskController.toggleInProgress); 
taskRouter.put('/:taskId/status', taskController.updateTaskStatus);
taskRouter.patch('/assign/:taskId/:userId', taskController.assignTaskToUser);
taskRouter.delete('/:userId/:taskId', taskController.deleteTask); 


export default taskRouter;
