import Prompt from '../models/Prompt';

//홈화면에 띄워주기 위해 모든 프롬프트를 가져온다.
export const getAllPrompt = async (req, res) => {
  const prompts = await Prompt.find({}).populate('creator');
  console.log(prompts);
  return res.json(JSON.stringify(prompts));
};

//프롬프트를 추가하기 위함
export const addNewPrompt = async (req, res) => {
  const { prompt, tags } = req.body;
  const userId = req.session.user._id;

  if (prompt === '' || tags === '') {
    return res.json({ message: '프롬프트와 테그는 필수입력입니다.' });
  }

  if (!userId) {
    return res.json({ message: '로그인 한 유저만 글을 게시할 수 있습니다.' });
  }

  try {
    const newPrompt = await Prompt.create({ prompt, tags, creator: userId });

    return res.json(newPrompt);
  } catch (error) {
    console.log(error);
    return res.json({ message: error });
  }
};

//만들어져있는 프롬프트를 편집하기 위함
export const editPrompt = async (req, res) => {
  const { promptId } = req.params;
  const { prompt, tags } = req.body;

  if (!prompt || !tags) {
    return res.json({ message: '프롬프트와 테그는 필수 입력란입니다.' });
  }

  if (!req.session.user) {
    return res.json({ message: '해당 유저의 정보를 가져올 수 없습니다.' });
  }

  const userId = req.session.user._id;

  try {
    //프롬프트를 아이디로 찾아서 가져오기
    const oldPrompt = await Prompt.findById(promptId);
    //프롬프트가 없을때의 에러핸들링
    if (!oldPrompt) {
      return res.json({ message: '해당하는 글이 없습니다.' });
    }
    const creatorId = oldPrompt.creator.valueOf();
    //프롬프트를 만든 사람과 현재 로그인한 사람이 동일인물인지 확인해야함.
    if (userId !== creatorId) {
      return res.json({ message: '해당 글을 수정할 권한이 없습니다.' });
    }

    //프롬프트가 존재한다면 해당 항목들을 변경 및 저장

    oldPrompt.prompt = prompt;
    oldPrompt.tags = tags;
    oldPrompt.save();
    return res.json(oldPrompt);
  } catch (error) {
    return res.json({ message: error });
  }
};

//내가 게시한 프롬프트를 가져오기 위함
export const getMyPrompt = async (req, res) => {
  if (!req.session.user) {
    return res.json({ message: '로그인 상태가 아닙니다.' });
  }

  const userId = req.session.user._id;
  const prompts = await Prompt.find({ creator: userId });
  return res.json(JSON.stringify(prompts));
};

export const deletePrompt = async (req, res) => {
  const { promptId } = req.params;
  try {
    const prompt = await Prompt.findById(promptId);
    if (!prompt) {
      return res.json({ message: '해당하는 글이 존재하지 않습니다.' });
    }

    if (prompt.creator.valueOf() !== req.session.user._id) {
      return res.json({ message: '해당 글을 삭제할 권한이 없습니다.' });
    }
    await prompt.deleteOne();
    return res.json({ message: '삭제하였습니다.' });
  } catch (error) {
    return res.json({ message: error });
  }
};
