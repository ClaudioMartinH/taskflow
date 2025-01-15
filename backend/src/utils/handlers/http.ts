// import { Task } from "../../domain/entities/Task.js";
// import { io } from "../../server.js";
// import { sendMessage } from "../events/listener.js";
import { Response, Request, NextFunction } from 'express';


export const handleRequest = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

export const sendResponse = (res: Response, status: number, data?: unknown) => {
  res.status(status).json(data);
};

// export const emitTaskEvent = async (eventType: string, task: Task, extraData = {}) => {
//   try {
//     // Serializar para limpiar referencias cíclicas
//     const safeTask = JSON.parse(JSON.stringify(task));
//     const message = JSON.stringify({
//       type: eventType,
//       ...safeTask,
//       ...extraData,
//     });
//     await sendMessage('notifications', message); // Envía al sistema de mensajes
//     io.emit(eventType, safeTask); // Emite al cliente
//   } catch (error) {
//     console.error('Error emitting task event:', error);
//   }
// };
