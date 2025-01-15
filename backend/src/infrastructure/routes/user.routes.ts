import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import {UserController} from '../controllers/UserController.js';
import multer from 'multer';

const userRouter = Router();
const userController = new UserController();
const uploadsDir = path.join(
  path.dirname(new URL(import.meta.url).pathname),
  'uploads',
);

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({ storage });

userRouter.get('/all', userController.getAllUsers);
userRouter.get('/search/:id', userController.getUserById);
userRouter.get('/search/email/:email', userController.getUserByEmail);
userRouter.put(
  '/profile-pic/:id',
  upload.single('profile-pic'),
  userController.updateProfilePicture,
);
userRouter.put('/:id', userController.updateUser);
userRouter.delete('/:id', userController.deleteUser);

export default userRouter;
