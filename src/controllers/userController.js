import User from '../models/User';

export const postJoin = async (req, res) => {
  const { username, password, email, avatarUrl } = req.body;

  //유저의 입력정보가 전달이 잘 되지 않을때의 에러
  if (username === '' || password === '' || email === '') {
    return res.send({
      message: '유저네임, 이메일, 비밀번호는 필수입력 요소입니다.',
    });
  }

  //해당 정보의 유저가 이미 존재할때의 에러핸들링
  const existCheck = await User.exists({ email });
  if (existCheck !== null) {
    return res.send({ message: '해당 정보의 유저가 이미 존재합니다.' });
  }

  const newUser = await User.create({ username, password, email, avatarUrl });
  return res.json(newUser);
};

export const postLogin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });

  if (!user) {
    return res.send({ message: '해당 정보의 유저가 존재하지 않습니다.' });
  }

  req.session.user = user;
  req.session.loggedIn = true;
  return res.json(user);
};

export const getMe = async (req, res) => {
  try {
    const {
      session: { user },
    } = req;

    console.log(user);

    if (!user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    return res.json(user);
  } catch (error) {
    console.error('Error in getMe:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const logOut = async (req, res) => {
  req.session.destroy();
  return res.json({ message: 'LogOut success' });
};
