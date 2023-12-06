import { session } from 'passport';
import User from '../models/User';
import { Query } from 'mongoose';

export const postJoin = async (req, res) => {
  const { username, password, email, avatarUrl } = req.body;
  //유저의 입력정보가 전달이 잘 되지 않을때의 에러
  if (username === '' || password === '' || email === '') {
    return res.json({
      message: '유저네임, 이메일, 비밀번호는 필수입력 요소입니다.',
    });
  }

  //해당 정보의 유저가 이미 존재할때의 에러핸들링
  const existCheck = await User.exists({ email });
  if (existCheck !== null) {
    return res.json({ message: '해당 정보의 유저가 이미 존재합니다.' });
  }

  const newUser = await User.create({
    username,
    password,
    email,
    avatarUrl,
  });
  return res.json(newUser);
};

// getMe 컨트롤러 수정
export const getMe = async (req, res) => {
  try {
    const { loggedIn } = req.session;
    const { user } = req.session.passport;
    // TODO:어떨때는 user에 값이 있고 어쩔때는 존재하지 않음.
    if (!loggedIn || !user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const userData = await User.findById(user);
    const { email, username, avatarUrl, _id } = userData;
    return res.json({ email, username, avatarUrl, _id });
  } catch (error) {
    console.log(error);
    console.log(error.stack);
    return res.json({ error: 'Internal Server Error' });
  }
};

// logOut 컨트롤러 수정
export const logOut = async (req, res) => {
  req.session.destroy();
  // 세션 쿠키 삭제
  return res.json({ message: 'LogOut success' });
};

export const editProfile = async (req, res) => {
  const { user } = req.session;
  const { email, username, avatarUrl } = req.body;

  if (!email || !username) {
    return res.json({ message: '오류가 발생했습니다.' });
  }

  if (!user) {
    return res.json({ message: '로그인상태가 아닙니다.' });
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(user._id, {
      username,
      email,
      avatarUrl,
    });

    req.session.user = updatedUser;
    //await req.session.save();
    console.log(req.session.user);
    return res.json(updatedUser);
  } catch (error) {
    return res.json({ message: '실패하였습니다.' });
  }
};
