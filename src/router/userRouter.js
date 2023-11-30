import express from 'express';
import {
  getMe,
  logOut,
  postJoin,
  postLogin,
} from '../controllers/userController';

const userRouter = express.Router();

userRouter.post('/login', postLogin);
userRouter.post('/join', postJoin);
userRouter.post('/logout', logOut);
userRouter.get('/me', getMe);

export default userRouter;
