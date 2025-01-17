import db from '../DB/db.js';
import { BoardRepositoryImpl } from '../implementations/BoardRepositoryImpl.js';
import { UserRepositoryImpl } from '../implementations/UserRepositoryImpl.js';
import { BoardService } from '../../application/services/BoardService.js';
import { STATUS } from '../../utils/states/Status.js';
import { sendMessage } from '../../utils/events/listener.js';
// import { io } from '../../server.js';
import { TaskRepositoryImpl } from '../implementations/TaskRepositoryImpl.js';
import { handleRequest, sendResponse } from '../../utils/handlers/http.js';

const boardRepository = new BoardRepositoryImpl(db);
const userRepository = new UserRepositoryImpl(db);
const taskRepository = new TaskRepositoryImpl(db);
const boardService = new BoardService(
  boardRepository,
  userRepository,
  taskRepository,
);

export class BoardController {
  getBoardById = handleRequest(async (req, res) => {
    const boardId = req.params.boardId;
    const board = await boardService.getBoardById(boardId);
    if (!board) {
      sendResponse(res, STATUS.NOT_FOUND);
      return;
    }
    sendResponse(res, STATUS.OK, board);
  });
  getAllBoardsForUser = handleRequest(async (req, res) => {
    const userId = req.params.userId;
    const boards = await boardService.getAllBoardsForUser(userId);
    if (!boards) {
      sendResponse(res, STATUS.NOT_FOUND);
      return;
    }
    sendResponse(res, STATUS.OK, boards);
  });
  createBoard = handleRequest(async (req, res) => {
    const { name, user_id, parent_board_id } = req.body;
    if (!name || !user_id ) {
      sendResponse(res, STATUS.BAD_REQUEST);
      return;
    }
    if (parent_board_id) {
      const board = await boardService.createBoard(
        name,
        user_id,
        parent_board_id,
      );
      if (!board) {
        sendResponse(res, STATUS.INTERNAL_SERVER_ERROR);
        return;
      }
      sendResponse(res, STATUS.CREATED, board);
    } 
    const board = await boardService.createBoard(name, user_id);
    if (!board) {
      sendResponse(res, STATUS.INTERNAL_SERVER_ERROR);
      return;
    }
    return sendResponse(res, STATUS.CREATED, board);
  });

  updateBoard = handleRequest(async (req, res) => {
    const { boardId, name, user_id } = req.body;
    if (!boardId || !name || !user_id) {
      sendResponse(res, STATUS.BAD_REQUEST);
      return;
    }
    const board = await boardService.updateBoard(boardId, name, user_id);
    if (!board) {
      sendResponse(res, STATUS.INTERNAL_SERVER_ERROR);
      return;
    }
    sendResponse(res, STATUS.OK, board);
  });

  deleteBoard = handleRequest(async (req, res) => {
    const boardId = req.params.boardId;
    await boardService.deleteBoard(boardId);
    const message = JSON.stringify({
      type: 'BOARD_DELETED',
      boardId: boardId,
    });
    await sendMessage('notifications', message);
    sendResponse(res, STATUS.NO_CONTENT);
  });

  getTasksByBoard = handleRequest(async (req, res) => {
    const boardId = req.params.boardId;
    const tasks = await boardService.getTasksByBoard(boardId);
    if (!tasks) {
      sendResponse(res, STATUS.NOT_FOUND);
      return;
    }
    sendResponse(res, STATUS.OK, tasks);
  });
}

// import { Request, Response } from 'express';
// import db from '../DB/db.js';
// import { BoardRepositoryImpl } from '../implementations/BoardRepositoryImpl.js';
// import { UserRepositoryImpl } from '../implementations/UserRepositoryImpl.js';
// import { BoardService } from '../../application/services/BoardService.js';
// import { STATUS } from '../../utils/states/Status.js';
// import { sendMessage } from '../../utils/events/listener.js';
// // import { io } from '../../server.js';
// import { TaskRepositoryImpl } from '../implementations/TaskRepositoryImpl.js';

// const boardRepository = new BoardRepositoryImpl(db);
// const userRepository = new UserRepositoryImpl(db);
// const taskRepository = new TaskRepositoryImpl(db);
// const boardService = new BoardService(boardRepository, userRepository, taskRepository);

// export class BoardController {
//   async getBoardById(req: Request, res: Response) {
//     const boardId = req.params.boardId;
//     try {
//       const board = await boardService.getBoardById(boardId);
//       if (!board) {
//         res.status(STATUS.NOT_FOUND).json({ message: 'Board not found' });
//         return;
//       }
//       res.status(STATUS.OK).json(board);
//       return;
//     } catch (error) {
//       console.error(error);
//       res
//         .status(STATUS.INTERNAL_SERVER_ERROR)
//         .json({ message: 'Internal Server Error' });
//       return;
//     }
//   }

//   async getAllBoardsForUser(req: Request, res: Response) {
//     const userId = req.params.userId;
//     try {
//       const boards = await boardService.getAllBoardsForUser(userId);
//       res.status(STATUS.OK).json(boards);
//       return;
//     } catch (error) {
//       console.error(error);
//       res
//         .status(STATUS.INTERNAL_SERVER_ERROR)
//         .json({ message: 'Internal Server Error' });
//       return;
//     }
//   }

//   async createBoard(req: Request, res: Response) {
//     const { name, userId, parentBoardId } = req.body;
//     const user = await userRepository.getUserById(userId);
//     if (!user) {
//       res.status(STATUS.NOT_FOUND).json({ message: 'User not found' });
//       return;
//     }
//     const parentBoard = parentBoardId
//       ? await boardRepository.getBoardById(parentBoardId)
//       : null;
//     const newBoard = await boardService.createBoard(
//       name,
//       user.id,
//       parentBoard?.id,
//     );
//     const message = JSON.stringify({
//       type: 'BOARD_CREATED',
//       boardId: newBoard?.id,
//       name: newBoard?.name,
//       parent_board_id: newBoard?.parent_board_id,
//     });
//     await sendMessage('notifications', message);
//     // io.emit('boardCreated', newBoard);
//     res.status(STATUS.CREATED).json(newBoard);
//     return;
//   }

//   async updateBoard(req: Request, res: Response) {
//     const { boardId, name } = req.body;
//     const user = await userRepository.getUserById(req.body.id);
//     if (!user) {
//       res.status(STATUS.NOT_FOUND).json({ message: 'User not found' });
//       return;
//     }
//     try {
//       const updatedBoard = await boardService.updateBoard(boardId, name, user.id);
//       const message = JSON.stringify({
//         type: 'BOARD_UPDATED',
//         boardId: updatedBoard?.id,
//         name: updatedBoard?.name,
//         parent_board_id: updatedBoard?.parent_board_id,
//       });
//       await sendMessage('notifications', message);
//       // io.emit('boardUpdated', updatedBoard);
//       res.status(STATUS.OK).json(updatedBoard);
//     } catch (error) {
//       console.error(error);
//       res
//         .status(STATUS.INTERNAL_SERVER_ERROR)
//         .json({ message: 'Internal Server Error' });
//     }
//   }

//   async deleteBoard(req: Request, res: Response) {
//     const { id } = req.params;
//     try {
//       const boardToDelete = await boardService.getBoardById(id);
//       await boardService.deleteBoard(id);
//       const message = JSON.stringify({
//         type: 'BOARD_DELETED',
//         boardId: boardToDelete?.id,
//         name: boardToDelete?.name,
//         parent_board_id: boardToDelete?.parent_board_id,
//       });
//       await sendMessage('notifications', message);
//       // io.emit('boardDeleted', boardToDelete);
//       res.status(STATUS.NO_CONTENT).json('Board sucessfully eliminated');
//     } catch (error) {
//       console.error(error);
//       res
//         .status(STATUS.INTERNAL_SERVER_ERROR)
//         .json({ message: 'Internal Server Error' });
//     }
//   }

//   async getTasksByBoard(req: Request, res: Response) {
//     const boardId = req.params.boardId;
//     try {
//       const board = await boardRepository.getBoardById(boardId);
//       if (!board) {
//         res.status(STATUS.NOT_FOUND).json({ message: 'Board not found' });
//         return;
//       }
//       const tasks = await boardService.getTasksByBoard(boardId);
//       res.status(STATUS.OK).json(tasks);
//       return;
//     } catch (error) {
//       console.error(error);
//       res
//         .status(STATUS.INTERNAL_SERVER_ERROR)
//         .json({ message: 'Internal Server Error' });
//       return;
//     }
//   }
// }
