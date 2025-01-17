import db from '../DB/db.js';
import { AuthService } from '../../application/services/AuthService.js';
import { AuthrepositoryImpl } from '../implementations/AuthRepositoryImpl.js';
import { STATUS } from '../../utils/states/Status.js';
import { UserRepositoryImpl } from '../implementations/UserRepositoryImpl.js';
// import { io } from '../../server.js';
import { NotFoundError } from '../../utils/errors/Errors.js';
import { handleRequest, sendResponse } from '../../utils/handlers/http.js';

const authRepository = new AuthrepositoryImpl(db);
const userRepository = new UserRepositoryImpl(db);
const authService = new AuthService(authRepository, userRepository);

export class AuthController {
  login = handleRequest(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      sendResponse(res, STATUS.BAD_REQUEST, {
        message: 'Missing required fields',
      });
      return;
    }

    const response = await authService.login(email, password);
    if (!response.token) {
      sendResponse(res, STATUS.UNAUTHORIZED, {
        message: 'Authentication failed',
      });
      return;
    }

    const { token, user } = response;
    res.setHeader('Authorization', `Bearer ${token}`);

    const userFound = await userRepository.getUserById(user.id);
    if (!userFound) throw new NotFoundError('User not found');

    sendResponse(res, STATUS.OK, { token, user });
  });

  logout = handleRequest(async (_req, res) => {
    await authService.logout();
    res.clearCookie('token');
    res.setHeader('Authorization', '');
    res.sendStatus(STATUS.NO_CONTENT);
  });
}

// import { Request, Response } from 'express';
// import db from '../DB/db.js';
// import { AuthService } from '../../application/services/AuthService.js';
// import { AuthrepositoryImpl } from '../implementations/AuthRepositoryImpl.js';
// import { STATUS } from '../../utils/states/Status.js';
// import { UserRepositoryImpl } from '../implementations/UserRepositoryImpl.js';
// import { sendMessage } from '../../utils/events/listener.js';
// // import { io } from '../../server.js';
// import { NotFoundError } from '../../utils/errors/Errors.js';

// const authRepository = new AuthrepositoryImpl(db);
// const userRepository = new UserRepositoryImpl(db);
// const authService = new AuthService(authRepository, userRepository);

// export class AuthController {
//   async login(req: Request, res: Response) {
//     const { email, password } = req.body;
//     if (!email || !password) {
//       res
//         .status(STATUS.BAD_REQUEST)
//         .json({ message: 'Missing required fields' });
//       return;
//     }
//     try {
//       const response = await authService.login(email, password);
//       if (!response.token) {
//         res
//           .status(STATUS.UNAUTHORIZED)
//           .json({ message: 'Authentication failed' });
//         return;
//       }
//       const { token, user } = response;
//       res.setHeader('Authorization', `Bearer ${token}`);
//       const userFound = await userRepository.getUserById(user.id);
//       if (!userFound) throw new NotFoundError('User not found');
//       const message = JSON.stringify({
//         type: 'USER_CONNECTED',
//         userId: userFound.id,
//         username: userFound.username,
//         fullname: userFound.fullname,
//         email: userFound.email,
//       });
//       await sendMessage('notifications', message);
//       // io.emit('userConnected', {
//       //   id: userFound.id,
//       //   username: userFound.username,
//       //   fullname: userFound.fullname,
//       //   email: userFound.email,
//       // });

//       res.status(STATUS.OK).json({ token, user });
//       return;
//     } catch (error) {
//       console.error(error);
//       res.status(STATUS.INTERNAL_SERVER_ERROR).json({ error });
//       return;
//     }
//   }
//   async logout(_req: Request, res: Response) {
//     try {
//       // const user = await authService.getUserFromRequest(req);
//       // const socket = io.sockets.sockets.get(user.id);
//       // if (socket) {
//       //   socket.emit('userDisconnected', {
//       //     id: user.id,
//       //     username: user.username,
//       //     fullname: user.fullname,
//       //     email: user.email,
//       //   });
//       // }
//       await authService.logout();
//       res.clearCookie('token');
//       res.setHeader('Authorization', '');
//       res.status(STATUS.NO_CONTENT).end();
//       return;
//     } catch (error) {
//       console.error(error);
//       res.status(STATUS.INTERNAL_SERVER_ERROR).json({ error });
//       return;
//     }
//   }
// }
