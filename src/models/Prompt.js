import mongoose from 'mongoose';

const PromptScheme = new mongoose.Schema({
  prompt: {
    type: String,
    required: [true, 'Prompt is required'],
  },

  tags: {
    type: String,
    required: [true, 'Tag is required'],
  },

  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Prompt = mongoose.model('Prompt', PromptScheme);

export default Prompt;
