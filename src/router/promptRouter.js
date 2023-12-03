import express from 'express';
import {
  addNewPrompt,
  deletePrompt,
  editPrompt,
  getAllPrompt,
  getEditPrompt,
  getMyPrompt,
} from '../controllers/promptController';

//app.use('/api/v1/prompt', promptRouter);

const promptRouter = express.Router();

promptRouter.get('/', getAllPrompt);
promptRouter.post('/new', addNewPrompt);
promptRouter.route('/:promptId/edit').get(getEditPrompt).patch(editPrompt);
promptRouter.get('/my', getMyPrompt);
promptRouter.delete('/:promptId/delete', deletePrompt);

export default promptRouter;
