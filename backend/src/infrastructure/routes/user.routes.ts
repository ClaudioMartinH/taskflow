import { Router } from 'express';
import { UserController } from '../controllers/UserController.js';
import upload from '../../utils/config/multer.js';

const userRouter = Router();
const userController = new UserController();

userRouter.get('/all', userController.getAllUsers);
userRouter.get('/search/:id', userController.getUserById);
userRouter.get('/search/email/:email', userController.getUserByEmail);
userRouter.put(
  '/profile-pic/:id',
  upload.single('profile_pic'),
  userController.updateProfilePicture,
);
userRouter.put('/:id', userController.updateUser);
userRouter.delete('/:id', userController.deleteUser);

export default userRouter;
