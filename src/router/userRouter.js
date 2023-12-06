import express from 'express';
import { editProfile, getMe, postJoin } from '../controllers/userController';
import passport from 'passport';

const userRouter = express.Router();

//FIXME: 잘못된 유저 입력시 에러 발생
userRouter.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/login',
  }),
  function (req, res) {
    req.session.loggedIn = true;
    res.json({ message: 'Login Success' });
  },
);
userRouter.post('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    return res.json({ message: '로그아웃에 성공하였습니다.' });
  });
});
userRouter.post('/join', postJoin);
//userRouter.post('/logout', logOut);
userRouter.get('/me', getMe);
userRouter.patch('/edit', editProfile);

export default userRouter;
