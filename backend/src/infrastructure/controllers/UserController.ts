import process from 'process'
import db from '../DB/db.js';
import { UserRepositoryImpl } from '../implementations/UserRepositoryImpl.js';
import { UserService } from '../../application/services/UserService.js';
import { STATUS } from '../../utils/states/Status.js';
import { handleRequest, sendResponse } from '../../utils/handlers/http.js';

const userReposiroty = new UserRepositoryImpl(db);
const userService = new UserService(userReposiroty);

export class UserController {
  getAllUsers = handleRequest(async (_req, res) => {
    const users = await userService.getAllUsers();
    if (!users) {
      sendResponse(res, STATUS.NOT_FOUND, { message: 'Users not found' });
      return;
    }
    sendResponse(res, STATUS.OK, users);
  });

  getUserById = handleRequest(async (_req, res) => {
    const { id } = _req.params;
    const user = await userService.getUserById(id);
    if (!user) {
      sendResponse(res, STATUS.NOT_FOUND, { message: 'User not found' });
      return;
    }
    sendResponse(res, STATUS.OK, user);
  });

  getUserByEmail = handleRequest(async (req, res) => {
    const { email } = req.params;
    const user = await userService.getUserByEmail(email);
    if (!user) {
      sendResponse(res, STATUS.NOT_FOUND, { message: 'User not found' });
      return;
    }
    sendResponse(res, STATUS.OK, user);
  });

  createUser = handleRequest(async (req, res) => {
    const { username, fullname, email, password } = req.body;
    const profile_pic = req.file ? req.file.path : '/img/default.jpg';
    if (!username || !fullname || !email || !password) {
      sendResponse(res, STATUS.BAD_REQUEST, {
        message: 'Missing required fields',
      });
      return;
    }
    const newUser = await userService.createUser(
      username,
      fullname,
      email,
      password,
      profile_pic,
    );
    sendResponse(res, STATUS.CREATED, newUser);
  });

  updateUser = handleRequest(async (req, res) => {
    const { id } = req.params;
    const { username, fullname, email, password } = req.body;
    if (!username || !fullname || !email || !password) {
      sendResponse(res, STATUS.BAD_REQUEST, {
        message: 'Missing required fields',
      });
      return;
    }
    const updatedUser = await userService.updateUser(
      id,
      username,
      fullname,
      email,
      password,
    );
    if (!updatedUser) {
      sendResponse(res, STATUS.NOT_FOUND, { message: 'User not found' });
      return;
    }
    sendResponse(res, STATUS.OK, updatedUser);
  });

  deleteUser = handleRequest(async (req, res) => {
    const { id } = req.params;
    await userService.deleteUser(id);
    sendResponse(res, STATUS.NO_CONTENT);
  });

  updateProfilePicture = handleRequest(async (req, res) => {
    console.log('📥 File received:', req.file);
    console.log('📦 Request Body:', req.body);

    if (!req.file) {
      sendResponse(res, STATUS.BAD_REQUEST, {
        message: '❌ No file received!',
      });
      return;
    }

    const { id } = req.params;
    const profilePicUrl = `${process.env.BACKEND_URL}/uploads/${req.file.filename}`;

    console.log(`✅ Image uploaded successfully: ${profilePicUrl}`);

    const updatedUser = await userService.changeProfilePicture(
      id,
      profilePicUrl,
    );
    sendResponse(res, STATUS.OK, updatedUser);
  });
}


// import { Request, Response } from 'express';
// import db from '../DB/db.js';
// import path from 'path';
// import { UserRepositoryImpl } from '../implementations/UserRepositoryImpl.js';
// import { UserService } from '../../application/services/UserService.js';
// import { STATUS } from '../../utils/states/Status.js';
// import { sendMessage } from '../../utils/events/listener.js';
// // import { io } from '../../server.js';
// import multer from 'multer';

// const userReposiroty = new UserRepositoryImpl(db);
// const userService = new UserService(userReposiroty);

// const storage = multer.diskStorage({
//   destination: (_req, _file, cb) => {
//     cb(null, 'uploads/profile_pics'); // Aquí defines la carpeta donde se guardarán las imágenes
//   },
//   filename: (_req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname)); // Nombre único para cada archivo
//   },
// });

// // Configuración de multer para que solo acepte imágenes
// const upload = multer({
//   storage,
//   fileFilter: (_req, file, cb) => {
//     const filetypes = /jpeg|jpg|png|gif/;
//     const extname = filetypes.test(
//       path.extname(file.originalname).toLowerCase()
//     );
//     const mimetype = filetypes.test(file.mimetype);

//     if (extname && mimetype) {
//       return cb(null, true);
//     } else {
//       cb(new Error('Invalid file type'));
//     }
//   },
// }).single('profile_pic');

// export class UserController {
//   async getAllUsers(_req: Request, res: Response) {
//     try {
//       const users = await userService.getAllUsers();
//       if (!users) {
//         res.status(STATUS.NOT_FOUND).json({ message: 'Users not found' });
//         return;
//       }
//       res.status(STATUS.OK).json(users);
//       return;
//     } catch (error) {
//       console.error(error);
//       res
//         .status(STATUS.INTERNAL_SERVER_ERROR)
//         .json({ message: 'Server Error' });
//       return;
//     }
//   }

//   async getUserById(req: Request, res: Response) {
//     const id = req.params.id;
//     try {
//       const user = await userService.getUserById(id);
//       if (!user) {
//         res.status(STATUS.NOT_FOUND).json({ message: 'User not found' });
//         return;
//       }
//       res.status(STATUS.OK).json(user);
//       return;
//     } catch (error) {
//       console.error(error);
//       res
//         .status(STATUS.INTERNAL_SERVER_ERROR)
//         .json({ message: 'Server Error' });
//       return;
//     }
//   }

//   async getUserByEmail(req: Request, res: Response) {
//     const email = req.params.email;
//     try {
//       const user = await userService.getUserByEmail(email);
//       if (!user) {
//         res.status(STATUS.NOT_FOUND).json({ message: 'User not found' });
//         return;
//       }
//       res.status(STATUS.OK).json(user);
//       return;
//     } catch (error) {
//       console.error(error);
//       res
//         .status(STATUS.INTERNAL_SERVER_ERROR)
//         .json({ message: 'Server Error' });
//       return;
//     }
//   }

//   async createUser(req: Request, res: Response) {
//     const { username, fullname, email, password } = req.body;
//     const profile_pic = req.file ? req.file.path : '/img/default.jpg';
//     if (!username || !fullname || !email || !password) {
//       res
//         .status(STATUS.BAD_REQUEST)
//         .json({ message: 'Missing required fields' });
//       return;
//     }
//     const newUser = await userService.createUser(
//       username,
//       fullname,
//       email,
//       password,
//       profile_pic
//     );
//     const message = JSON.stringify({
//       type: 'USER_CREATED',
//       userId: newUser?.id,
//       username: newUser?.username,
//       fullname: newUser?.fullname,
//       profile_pic: profile_pic,
//     });
//     await sendMessage('notifications', message);
//     // io.emit('userCreated', newUser);
//     res.status(STATUS.CREATED).json(newUser);
//     return;
//   }

//   async updateUser(req: Request, res: Response) {
//     const { id } = req.params;
//     const { username, fullname, email, password } = req.body;
//     if (!username || !fullname || !email || !password) {
//       res
//         .status(STATUS.BAD_REQUEST)
//         .json({ message: 'Missing required fields' });
//       return;
//     }
//     try {
//       const updatedUser = await userService.updateUser(
//         id,
//         username,
//         fullname,
//         email,
//         password
//       );
//       const message = JSON.stringify({
//         type: 'USER_UPDATED',
//         userId: updatedUser?.id,
//         username: updatedUser?.username,
//         fullname: updatedUser?.fullname,
//       });
//       await sendMessage('notifications', message);
//       // io.emit('userCreated', updatedUser);
//       res.status(STATUS.OK).json(updatedUser);
//       return;
//     } catch (error: unknown) {
//       console.error(error);
//       if ((error as Error).message === 'User not found') {
//         res.status(STATUS.NOT_FOUND).json({ message: 'User not found' });
//         return;
//       } else {
//         res
//           .status(STATUS.INTERNAL_SERVER_ERROR)
//           .json({ message: 'Server Error' });
//         return;
//       }
//     }
//   }

//   async deleteUser(req: Request, res: Response) {
//     const id = req.params.id;
//     const userToDelete = await userService.getUserById(id);
//     try {
//       await userService.deleteUser(id);
//       const message = JSON.stringify({
//         type: 'USER_DELETED',
//         userId: userToDelete?.id,
//         username: userToDelete?.username,
//         fullname: userToDelete?.fullname,
//       });
//       await sendMessage('notifications', message);
//       // io.emit('userDeleted', userToDelete);
//       res.status(STATUS.NO_CONTENT).end();
//       return;
//     } catch (error) {
//       console.error(error);
//       res
//         .status(STATUS.INTERNAL_SERVER_ERROR)
//         .json({ message: 'Server Error' });
//       return;
//     }
//   }

//   async updateProfilePicture(req: Request, res: Response) {
//     const id = req.params.id;

//     upload(req, res, async (err) => {
//       if (err) {
//         console.error('Error al subir la imagen:', err);
//         return res
//           .status(STATUS.INTERNAL_SERVER_ERROR)
//           .json({ message: 'Error uploading file' });
//       }

//       const profilePic = req.file
//         ? req.file.path
//         : 'uploads/profile_pics/default.jpg';

//       if (!id) {
//         res.status(STATUS.BAD_REQUEST).json({ message: 'User ID is required' });
//         return;
//       }

//       try {
//         await userService.changeProfilePicture(id, profilePic);
//         res.status(STATUS.OK).json({ message: 'Profile picture updated' });
//       } catch (error) {
//         console.error('Error updating profile picture:', error);
//         res
//           .status(STATUS.INTERNAL_SERVER_ERROR)
//           .json({ message: 'Server Error' });
//       }
//     });
//   }
// }
