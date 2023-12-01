import express from 'express';
import {
  addNewPrompt,
  deletePrompt,
  editPrompt,
  getAllPrompt,
  getMyPrompt,
} from '../controllers/promptController';

const promptRouter = express.Router();

promptRouter.get('/', getAllPrompt);
promptRouter.post('/new', addNewPrompt);
promptRouter.patch('/:promptId/edit', editPrompt);
promptRouter.get('/my', getMyPrompt);
promptRouter.delete('/:promptId/delete', deletePrompt);

export default promptRouter;
